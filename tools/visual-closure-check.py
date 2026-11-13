#!/usr/bin/env python3
"""Approved visual refinements, source UI and brand usage. Light360 RTL; targeted320/LTR."""
import argparse, hashlib, http.server, json, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw): super().__init__(*a, directory=str(ROOT), **kw)
    def log_message(self, *_): pass

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out', type=Path)
    ap.add_argument('--capture-only', action='store_true')
    args=ap.parse_args(); out=args.out or Path(tempfile.mkdtemp(prefix='visual-closure-'))
    out.mkdir(parents=True, exist_ok=True)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    checks=[]; errors=[]; measurements=[]
    def check(name, passed, detail=None):
        checks.append(dict(name=name,passed=bool(passed),detail=detail))
        print(('PASS ' if passed else 'FAIL ')+name,flush=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(**chromium_launch_options()); version=browser.version
        p=browser.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce')
        p.set_default_timeout(5000)
        p.on('pageerror',lambda e:errors.append(str(e)))
        p.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
        def ev(js):return p.evaluate(js)
        def go():
            p.goto(base+'/previews/readable-source/index.html',wait_until='networkidle');ev('document.fonts.ready')
        def shot(selector,name):p.locator(selector).screenshot(path=str(out/(name+'.png')))
        def geometry(selector,name):
            d=p.locator(selector).evaluate('''e=>{let r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height,document:document.documentElement.scrollWidth,viewport:innerWidth}}''')
            measurements.append(dict(name=name,**d))
            check(name+' contained',d['left']>=-1 and d['right']<=d['viewport']+1 and d['document']==d['viewport'],d)
            return d
        go()
        check('Default sales is static readable, without duplicate selected value or controls',ev("(()=>{let c=document.querySelector('#sales-bars');return !c.hasAttribute('data-selection')&&!c.querySelector('.m-chart__selection')&&!c.querySelector('[data-reading-selected=true]')&&MicroData.getSelection(c)===null})()"))
        check('Seven exact sales values, total and previous amount remain',ev("(()=>{let c=document.querySelector('#sales-bars');return [...c.querySelectorAll('.m-chart__data li')].map(e=>e.dataset.value).join(',')==='640,720,510,810,920,780,440'&&document.querySelector('#sales-group').textContent.includes('4,820')&&document.querySelector('#sales-group details').textContent.includes('4,180')&&c.querySelector('[data-plot]').textContent.includes('920')})()"))
        check('Primary expenses uses real monetary rows with unchanged source values',ev("(()=>{let c=document.querySelector('#expenses-rows');return !!c&&[...c.querySelectorAll('[data-bar-source] li')].map(e=>e.dataset.value).join(',')==='480,320,200'&&c.querySelectorAll('[data-bar-items] > li').length===3&&[...c.querySelectorAll('.m-main-metric__reading-unit')].every(e=>e.textContent==='د.أ')})()"))
        check('Donut is clearly optional and initially collapsed',ev("!!document.querySelector('#distribution-example')&&!document.querySelector('#distribution-example').open&&!!document.querySelector('#distribution-example #expenses-group')"))
        for selector,name in [('#sales-group','sales-default360'),('#stock-rows','stock360'),('#progress-example','progress360')]:geometry(selector,name);shot(selector,name)
        if p.locator('#expenses-rows-group').count():geometry('#expenses-rows-group','expense-rows360');shot('#expenses-rows-group','expense-rows360')
        else:check('expense-rows360 contained',False,'Primary row example absent')
        normal=ev("document.querySelector('#stock-rows [data-bar-status]').textContent")
        check('Normal scale note is concise and keeps value, unit and period',normal=='الأشرطة حتى 149 قطعة · اليوم.',normal)
        check('Auto scale diagnostics remain available to developers',ev("document.querySelector('#stock-rows').dataset.scaleDetail.includes('scale=auto-largest-known=149')"))
        for name,js,want,state in [
            ('Declared',"m.dataset.max='200'",'الأشرطة حتى 200 قطعة · اليوم.','ok'),
            ('Signed',"m.removeAttribute('data-max');m.querySelector('[data-bar-source] li').dataset.value='-149'",'خط الوسط صفر؛ الموجب يمينه والسالب يساره.','ok'),
            ('Invalid',"m.dataset.max='bad'",'القراءات معروضة كاملة.','invalid-scale'),
            ('Below known',"m.dataset.max='50'",'القراءات معروضة كاملة.','scale-below-known'),
            ('Mixed',"m.removeAttribute('data-max');m.querySelector('[data-bar-source] li').dataset.period='أمس'",'وحدة أو فترة غير متوافقة','inconsistent'),
        ]:
            ev("window.m=document.querySelector('#stock-rows');"+js+";MicroMetricComparison.render(m)")
            d=ev("({text:m.querySelector('[data-bar-status]').textContent,state:m.dataset.scaleState,rows:m.querySelectorAll('[data-bar-items]>li').length,detail:m.dataset.scaleDetail})")
            check(name+' retains honest scale, all rows and diagnostics',want in d['text'] and d['state']==state and d['rows']==3 and bool(d['detail']),d)
        go()
        toggle=p.locator('#preview-sales-selection')
        names=['Explicit opt-in silently selects the supplied Wednesday','Opt-in remains operable once by touch','Turning selection off leaves data, table and focus available','Repeated opt-in preserves a single binding']
        if toggle.count():
            p.locator('#reading-options > summary').tap();ev("window.c=document.querySelector('#sales-bars');window.events=[];c.addEventListener('micro-data:selection-change',e=>events.push(e.detail))")
            toggle.tap();check(names[0],ev("MicroData.getSelection(c).key==='wed'&&events.length===0&&document.querySelector('#preview-sales-selection').getAttribute('aria-pressed')==='true'"))
            p.locator('#sales-bars .m-chart__select-step').last.tap();check(names[1],ev("events.length===1&&events[0].key==='thu'&&events[0].value===780"))
            geometry('#sales-group','sales-opt-in360');shot('#sales-group','sales-opt-in360')
            toggle.tap();check(names[2],ev("!c.querySelector('.m-chart__selection')&&c.querySelectorAll('tbody tr').length===7&&document.activeElement.id==='preview-sales-selection'&&MicroData.getSelection(c)===null"))
            toggle.tap();p.locator('#sales-bars .m-chart__select-step').last.tap();check(names[3],ev("events.length===2&&c.querySelectorAll('.m-chart__selection').length===1"))
            toggle.tap()
        else:
            for n in names:check(n,False,'Explicit preview opt-in absent')
        if p.locator('#distribution-example').count():
            p.locator('#distribution-example > summary').tap();p.locator('#expenses-group [data-reading-choice=delivery]').tap()
            check('Optional donut still selects exact amount and valid share',ev("(()=>{let d=MicroData.getSelection(document.querySelector('#expenses-group'));return d.value===320&&d.share===.32})()"));shot('#expenses-group','donut-optional360')
        else:check('Optional donut still selects exact amount and valid share',False,'Optional example absent')
        go();p.set_viewport_size({'width':320,'height':780})
        geometry('#stock-rows','stock-targeted320');shot('#stock-rows','stock-targeted320')
        p.set_viewport_size({'width':360,'height':780});ev("document.documentElement.dir='ltr'");geometry('#stock-rows','stock-directional-ltr');shot('#stock-rows','stock-directional-ltr')
        p.goto(base+'/previews/ui-system-showcase/index.html#component-review',wait_until='networkidle');ev('document.fonts.ready')
        d=p.locator('.showcase-brand__logo').evaluate("e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,fit:getComputedStyle(e).objectFit,filter:getComputedStyle(e).filter,loaded:e.complete&&e.naturalWidth>0})")
        check('Showcase lockup meets96px minimum, retains ratio and original colors',d['width']>=96 and d['fit']=='contain' and d['filter']=='none' and d['loaded'],d)
        p.goto(base+'/previews/ui-system-showcase/index.html#brand-proof',wait_until='networkidle');ev('document.fonts.ready')
        p.set_viewport_size({'width':320,'height':780})
        d=ev("[...document.querySelectorAll('.brand-proof__plate img')].map((i,n)=>{let r=i.getBoundingClientRect();return {width:r.width,height:r.height,loaded:i.complete&&i.naturalWidth>0,fit:getComputedStyle(i).objectFit,min:n===2?24:96}})")
        check('Targeted320 brand plate wraps instead of shrinking its three assets',len(d)==3 and all(x['loaded'] and x['width']>=x['min'] and x['height']>0 and x['fit']=='contain' for x in d),d)
        geometry('#brand-proof','brand-plate-targeted320');shot('#brand-proof','brand-plate-targeted320')
        p.set_viewport_size({'width':360,'height':780})
        check('Digital brand usage guide exists', (ROOT/'assets/brand/micro-logo/USAGE.md').is_file())
        if (ROOT/'previews/brand/index.html').is_file():
            p.goto(base+'/previews/brand/index.html',wait_until='networkidle');ev('document.fonts.ready')
            d=ev("[...document.querySelectorAll('[data-brand-sample]')].map(e=>{let i=e.querySelector('img'),r=i.getBoundingClientRect(),p=e.getBoundingClientRect(),c=getComputedStyle(e);return {kind:e.dataset.brandSample,width:r.width,height:r.height,ratio:i.naturalWidth/i.naturalHeight,loaded:i.complete&&i.naturalWidth>0,gaps:[r.left-p.left,p.right-r.right,r.top-p.top,p.bottom-r.bottom],min:Math.max(8,r.height/4),filter:getComputedStyle(i).filter}})")
            check('Brand sample minima, clear space, ratios and no recoloring',len(d)>=3 and all(x['loaded'] and x['filter']=='none' and x['width']>=(24 if x['kind']=='symbol' else 96) and abs(x['width']/x['height']-x['ratio'])<.01 and min(x['gaps'])>=x['min']-.1 for x in d),d)
            check('Brand dimension captions isolate width by height in LTR',ev("(()=>{let a=[...document.querySelectorAll('figcaption bdi')];return a.map(e=>e.textContent).join(',')==='96×30,96×30,24×24'&&a.every(e=>getComputedStyle(e).direction==='ltr')})()"))
            geometry('main','brand360');shot('main','brand360')
        else:check('Brand sample minima, clear space, ratios and no recoloring',False,'Brand usage preview absent')
        check('No browser or missing resource errors',not errors,errors)
        browser.close()
    server.shutdown()
    paths=['components/metric-comparison/metric-comparison.js','previews/readable-source/index.html','previews/readable-source/preview.js','previews/ui-system-showcase/showcase.css','assets/brand/micro-logo/USAGE.md','previews/brand/index.html']
    report=dict(sourceCommitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,captureOnly=args.capture_only,browser=version,physicalDevice=False,theme='Light',scope='360x780 RTL; targeted320 stock note; directional360 LTR; no Dark/zoom',passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),checks=checks,measurements=measurements,sourceSha256={n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in paths if (ROOT/n).exists()})
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f"Visual closure: {report['passed']} PASS / {report['failed']} FAIL",flush=True)
    return bool(report['failed'] and not args.capture_only)
if __name__=='__main__':raise SystemExit(main())
