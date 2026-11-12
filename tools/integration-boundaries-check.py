#!/usr/bin/env python3
"""Independent Light fixtures: 360x780 RTL, directional LTR, focused 320 container.

Negative controls prove host CSS/containing-block violations without claiming a
source defect. --source-ref replays the same isolation checks against old JS.
"""
import argparse
import hashlib
import http.server
import json
import subprocess
import tempfile
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)
    def log_message(self, *_):
        pass

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--source-ref')
    parser.add_argument('--isolation-only', action='store_true')
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix='integration-boundaries-'))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/previews/integration-boundaries/'
    checks, errors, measurements = [], [], []
    def check(name, ok, detail=None):
        checks.append(dict(name=name, passed=bool(ok), detail=detail))
        if not ok: print('FAIL', name, str(detail)[:240], flush=True)
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            version = browser.version
            page = browser.new_page(viewport=dict(width=360, height=780), color_scheme='light', locale='ar', reduced_motion='reduce')
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('response', lambda r: errors.append(str(r.status)+' '+r.url) if r.status >= 400 else None)
            if args.source_ref:
                js = subprocess.check_output(['git','show',args.source_ref+':components/navigation/navigation.js'],cwd=ROOT,text=True)
                page.route('**/components/navigation/navigation.js',lambda route:route.fulfill(status=200,content_type='application/javascript',body=js))
            def goto(name):
                page.goto(base+name+'.html', wait_until='networkidle'); page.evaluate('document.fonts.ready')
                # Detect unexpected product routing without implementing History.
                page.evaluate('''()=>{for(const key of ['pushState','replaceState']){const original=history[key];history[key]=function(...args){BoundaryFixture.counts.history++;return original.apply(this,args)}}}''')
            def shot(name): page.screenshot(path=str(out/(name+'.png')))
            def geometry(name, selector):
                data = page.locator(selector).evaluate('''e=>{const b=e.getBoundingClientRect();const targets=[...e.querySelectorAll('button,summary,a[href]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden');const bad=[];for(const x of targets){const r=x.getBoundingClientRect();if(r.width<47.9||r.height<47.9||r.left<b.left-1||r.right>b.right+1)bad.push({text:x.textContent,width:r.width,height:r.height});}for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){if(targets[i].contains(targets[j])||targets[j].contains(targets[i]))continue;const a=targets[i].getBoundingClientRect(),b=targets[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)bad.push({overlap:[targets[i].textContent,targets[j].textContent]});}return {width:b.width,left:b.left,right:b.right,viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,bad}}''')
                measurements.append(dict(name=name,**data))
                check(name,data['width']>0 and data['left']>=-1 and data['right']<=data['viewport']+1 and data['documentWidth']<=data['viewport'] and not data['bad'],data)
            def reading(name,selector,root_selector,expected):
                data=page.locator(selector).evaluate('''(e,s)=>{const b=e.closest(s).getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);return {text:e.textContent,left:b.left,right:b.right,rects:[...r.getClientRects()].map(x=>({left:x.left,right:x.right})),ellipsis:getComputedStyle(e).textOverflow}}''',root_selector)
                check(name,data['text']==expected and data['ellipsis']!='ellipsis' and all(r['left']>=data['left']-1 and r['right']<=data['right']+1 for r in data['rects']),data)
            def state(key='a'):return page.evaluate('(key)=>BoundaryFixture.state(key)',key)
            if not args.isolation_only:
                goto('index');check('hub exposes all three fixtures',page.locator('nav a').count()==3)
                goto('containers')
                geometry('F01 nested grid and flex container','#container-host')
                check('F01 actual container is 296px inside 360 viewport',page.locator('#container-host').evaluate('e=>e.clientWidth')==296)
                check('F01 host really uses conflicting inherited font',page.evaluate("getComputedStyle(document.body).fontFamily")=='serif')
                for selector in ['.m-info-card','.m-row','.m-field','.m-btn','.m-form-surface']:
                    check('F01 source typography '+selector,'IBM Plex Sans' in page.locator(selector).first.evaluate('e=>getComputedStyle(e).fontFamily'))
                reading('F01 numeric sign precision and unit independent','.m-info-card__number','.m-info-card','−123,456.750')
                reading('F01 full row reading','.m-row__value','.m-row','123,456,789.125')
                check('F01 zero false validation is not implicit',page.locator('input').evaluate('e=>e.validity.valid'))
                page.locator('.m-info-card').scroll_into_view_if_needed();shot('container-296-360-rtl')
                page.locator('[data-row-action]').focus();page.keyboard.press('Tab');check('F01 keyboard reaches native summary',page.locator('summary').evaluate('e=>e===document.activeElement'))
                page.keyboard.press('Enter');check('F01 native disclosure opens',page.locator('details').evaluate('e=>e.open'))
                check('F01 documented disclosure icon remains20x20',page.locator('summary img').evaluate('e=>e.getBoundingClientRect().width===20&&e.getBoundingClientRect().height===20'))
                check('F01 disclosure text has full row space',page.locator('summary .m-row__text').evaluate('e=>e.getBoundingClientRect().width>200'))
                page.locator('#direction').click();geometry('F01 directional LTR in same narrow container','#container-host');shot('container-296-360-ltr')
                page.locator('#direction').click()
                page.locator('.fixture-panel').evaluate('e=>e.hidden=true');check('F01 hidden composition removes layout',not page.locator('.fixture-panel').is_visible())
                page.locator('.fixture-panel').evaluate('e=>e.hidden=false');geometry('F01 reveal retains geometry','#container-host')
                page.locator('#reset-bad').click()
                bad=page.locator('[data-row-action]').evaluate('e=>({height:e.getBoundingClientRect().height,font:getComputedStyle(e).fontFamily})')
                measurements.append(dict(name='negative CSS control',**bad));check('F01 negative control exposes host CSS violation',bad['height']<48 and bad['font']=='serif',bad)
                page.locator('#reset-good').click();geometry('F01 scoped host reset restores source targets','#container-host')
                check('F01 no important or source override used in fixture',page.evaluate('''async()=>{const t=await(await fetch('boundaries.css')).text();return !t.includes('!important')}'''))
                page.set_viewport_size(dict(width=320,height=780));geometry('F01 focused narrow container264px at320','#container-host')
                reading('F01 narrow numeric reading stays complete','.m-row__value','.m-row','123,456,789.125');page.locator('.m-operational-list').scroll_into_view_if_needed();shot('container-264-320-rtl')
                page.set_viewport_size(dict(width=360,height=780))
                goto('lifecycle')
                check('F02 prefill is valid and clean',state()==dict(raw='CODE-001',valid=True,dirty=False,pending=False,disposed=False),state())
                check('F02 clear uses documented48px B01 target',page.locator('#instance-a .m-field__clear').evaluate('e=>e.getBoundingClientRect().width>=48&&e.getBoundingClientRect().height>=48'))
                check('F02 all consumer IDs unique',page.evaluate('''()=>{const a=[...document.querySelectorAll('[id]')].map(x=>x.id);return a.length===new Set(a).size}'''))
                page.locator('#prefill').click();check('F02 prefill synchronizes without user events',state()['raw']=='READY-009' and not state()['dirty'] and page.evaluate('BoundaryFixture.counts.input.a||0')==0)
                page.evaluate("()=>{for(let i=0;i<5;i++){BoundaryFixture.bindAgain('a');MicroFields.init(BoundaryFixture.slots.a.form)}}")
                field=page.locator('#instance-a input');field.fill('bad!')
                check('F02 one input after repeated init',page.evaluate('BoundaryFixture.counts.input.a')==1)
                page.locator('#instance-a [data-row-action]').click();check('F02 independent row action fires once after repeated binding',page.evaluate('BoundaryFixture.counts.row.a')==1 and page.locator('#instance-a [data-source-note]').is_visible())
                check('F02 invalid raw remains dirty',state()['raw']=='bad!' and not state()['valid'] and state()['dirty'])
                page.locator('#instance-a [type=submit]').click();check('F02 invalid submit retains raw without callback',state()['raw']=='bad!' and page.evaluate('BoundaryFixture.counts.callback.a||0')==0)
                field.fill('NEXT-007');field.focus();field.evaluate('e=>e.setSelectionRange(2,4)')
                page.locator('#update').evaluate('e=>e.click()')
                check('F02 reading update preserves focus and caret',field.evaluate('e=>e===document.activeElement&&e.selectionStart===2&&e.selectionEnd===4'))
                check('F02 update keeps form raw dirty and sibling isolated',state()['raw']=='NEXT-007' and state()['dirty'] and state('b')['raw']=='CODE-001' and not state('b')['dirty'])
                reading('F02 zero is a real reading','#instance-a [data-number]','.m-info-card','0')
                reading('F02 signed reading is not parsed','#instance-a [data-quantity]','.m-row','−17.250')
                for _ in range(5):page.locator('#replace').click()
                page.locator('#instance-a [type=submit]').click();page.locator('#instance-a form').evaluate('e=>e.requestSubmit()')
                check('F02 callback replacement does not duplicate submit',page.evaluate('(BoundaryFixture.counts.callback.replaced||0)===1 && (BoundaryFixture.counts.callback.a||0)===0'))
                check('F02 pending duplicate submit blocked',state()['pending'] and page.evaluate('BoundaryFixture.counts.submit.a')==2)
                field.fill('NEW-008');page.locator('#resolve').click();check('F02 old result qualified after raw edit','أقدم' in page.locator('#instance-a [data-feedback]').inner_text() and state()['raw']=='NEW-008' and not state()['pending'])
                before_clear=page.evaluate('BoundaryFixture.counts.input.a')
                page.locator('#instance-a .m-field__clear').click();check('F02 source clear dispatches one user input',state()['raw']=='' and page.evaluate('BoundaryFixture.counts.input.a')==before_clear+1)
                page.locator('#instance-a [data-refill]').click();check('F02 restoring default resets baseline',not state()['dirty'] and state()['valid'])
                page.locator('#instance-a [type=submit]').click();page.locator('#instance-b [type=submit]').click()
                check('F02 two consumers can wait independently',state()['pending'] and state('b')['pending'])
                page.evaluate("window.detachedForm=BoundaryFixture.slots.a.form")
                page.locator('#unmount').click();check('F02 teardown restores owned source busy state',page.evaluate("!detachedForm.querySelector('[type=submit]').hasAttribute('aria-busy')"))
                check('F02 teardown does not cancel sibling',state('b')['pending'])
                old=page.evaluate('BoundaryFixture.counts.input.a')
                page.evaluate("()=>{const i=detachedForm.querySelector('input');i.value='REMOVED';i.dispatchEvent(new Event('input',{bubbles:true}))}")
                check('F02 detached consumer listeners aborted',page.evaluate('BoundaryFixture.counts.input.a')==old)
                page.locator('#remount').click();page.locator('#resolve').click()
                check('F02 stale response cannot write to remounted form',state()['raw']=='CODE-001' and not state()['pending'] and 'قيمة مسبقة' in page.locator('#instance-a [data-feedback]').inner_text())
                page.locator('#resolve').click();check('F02 independent pending consumer completes',not state('b')['pending'] and 'معلنة' in page.locator('#instance-b [data-feedback]').inner_text())
                geometry('F02 independent form geometry','#instance-a');page.locator('#instance-a form').scroll_into_view_if_needed();shot('lifecycle-independent-form-360-rtl')
                check('F02 no component or consumer History writes',page.evaluate('BoundaryFixture.counts.history')==0)
                # Portal negative control and two-source-layer ownership.
                goto('layers');page.locator('#bad-layer').click()
                bounds=page.locator('#outer').evaluate('''e=>({layer:e.getBoundingClientRect().toJSON(),trap:document.querySelector('#trap').getBoundingClientRect().toJSON(),viewport:innerHeight})''')
                measurements.append(dict(name='negative containing-block control',**bounds))
                check('F03 transformed parent constrains fixed layer as expected',bounds['layer']['width']<360 and bounds['layer']['bottom']<bounds['viewport'],bounds)
                shot('negative-containing-block-360-rtl');page.keyboard.press('Escape')
                page.locator('#portal-layer').click();check('F03 consumer portal moves source roots to body',page.evaluate("document.querySelector('#outer').parentElement===document.body&&document.querySelector('#shade-outer').parentElement===document.body"))
                geometry('F03 portaled layer covers viewport width','#outer')
                check('F03 Navigation owns one lock and focus',page.evaluate("document.body.style.overflow==='hidden'&&document.querySelector('#outer').contains(document.activeElement)"))
                page.locator('#try-native').click();check('F03 second engine refused by consumer',not page.locator('#native').evaluate('e=>e.open') and 'رُفض' in page.locator('#layer-status').text_content())
                page.locator('#nested-open').click();check('F03 nested source layer isolates parent',page.locator('#outer').evaluate('e=>e.inert') and page.locator('#inner').evaluate('e=>e.contains(document.activeElement)'))
                page.keyboard.press('Escape');check('F03 nested close restores focus within parent',page.locator('#nested-open').evaluate('e=>e===document.activeElement') and page.evaluate("document.body.style.overflow==='hidden'"))
                shot('portaled-layer-360-rtl');page.keyboard.press('Escape')
                check('F03 final close restores opener and scroll',page.locator('#portal-layer').evaluate('e=>e===document.activeElement') and page.evaluate("document.body.style.overflow===''"))
                page.locator('#native-open').click();check('F03 alternative native dialog has one engine',page.locator('#native').evaluate('e=>e.open') and page.evaluate("document.body.style.overflow===''&&document.documentElement.style.overflow==='hidden'"))
                page.locator('#native-raw').fill('raw!');page.keyboard.press('Escape');check('F03 consumer denies native dirty Escape',page.locator('#native').evaluate('e=>e.open') and page.locator('#native-discard').is_visible())
                shot('native-dirty-decision-360-rtl');page.locator('#native-discard').click();page.wait_for_timeout(50)
                check('F03 native close restores own scroll and focus',page.evaluate("document.documentElement.style.overflow===''&&document.activeElement.id==='native-open'"))
            # Same regression checks can be replayed against the immutable baseline.
            goto('layers');page.evaluate("()=>{document.body.style.overflow='clip';const p=document.createElement('aside');p.id='pre-inert';p.inert=true;document.body.append(p)}")
            page.locator('#portal-layer').click();page.locator('#append-background').click();page.wait_for_timeout(30)
            check('F03 newly mounted background inherits modal isolation',page.locator('.fixture-late').evaluate('e=>e.inert'))
            page.locator('[data-late]').evaluate('e=>e.focus()')
            check('F03 dynamic background cannot take focus',not page.locator('[data-late]').evaluate('e=>e===document.activeElement'))
            page.evaluate('''()=>{const live=document.createElement('div');live.id='allowed-live';live.className='m-live-region';live.setAttribute('role','status');document.body.append(live);const held=document.createElement('aside');held.id='late-pre-inert';held.inert=true;document.body.append(held)}''');page.wait_for_timeout(30)
            check('F03 live region exception remains available',page.locator('#allowed-live').evaluate('e=>!e.inert'))
            check('F03 initially inert late node remains inert',page.locator('#late-pre-inert').evaluate('e=>e.inert'))
            shot('dynamic-isolation-360-rtl')
            page.keyboard.press('Escape');check('F03 close restores late sibling and prior inert state',page.locator('.fixture-late').evaluate('e=>!e.inert') and page.locator('#pre-inert').evaluate('e=>e.inert'))
            check('F03 pre-inert late node restoration',page.locator('#late-pre-inert').evaluate('e=>e.inert'))
            check('F03 previous body overflow restored exactly',page.evaluate("document.body.style.overflow==='clip'"))
            page.locator('#portal-layer').click();page.locator('#append-background').click();page.wait_for_timeout(30)
            check('F03 observer survives a second open lifetime',page.locator('.fixture-late').last.evaluate('e=>e.inert'))
            page.locator('#dispose-layer').click()
            check('F03 disconnect releases lock and dynamic isolation',page.evaluate("document.body.style.overflow==='clip'&&[...document.querySelectorAll('.fixture-late')].every(e=>!e.inert)&&document.querySelector('#pre-inert').inert"))
            page.evaluate("()=>{const x=document.createElement('aside');x.id='after-disconnect';document.body.append(x)}");page.wait_for_timeout(30)
            check('F03 no observer isolation after disconnect',page.locator('#after-disconnect').evaluate('e=>!e.inert'))
            # Ancestor-chain siblings inside a non-portaled but untransformed host.
            goto('layers');page.locator('#trap').evaluate("e=>e.style.cssText='transform:none;contain:none;overflow:visible;height:auto'")
            page.locator('#bad-layer').click();page.locator('#trap').evaluate("e=>{const s=document.createElement('aside');s.id='nested-late';s.innerHTML='<button>late</button>';e.append(s)}");page.wait_for_timeout(30)
            check('F03 nested ancestor sibling is also isolated',page.locator('#nested-late').evaluate('e=>e.inert'))
            page.keyboard.press('Escape');check('F03 nested ancestor restoration',page.locator('#nested-late').evaluate('e=>!e.inert'))
            check('F03 no History ownership introduced',page.evaluate('BoundaryFixture.counts.history')==0)
            if not args.isolation_only:
                page.goto(base+'../ui-system-showcase/standalone.html',wait_until='networkidle')
                page.evaluate('''()=>{document.body.insertAdjacentHTML('beforeend','<div class="m-layer-backdrop" id="boundary-shade" hidden></div><div class="m-layer" id="boundary-modal" role="dialog" aria-label="عزل المصدر المضمّن" hidden><button class="m-btn m-btn--secondary">داخل الطبقة</button></div>');MicroNavigation.openLayer(document.querySelector('#boundary-modal'),{backdropEl:document.querySelector('#boundary-shade')});const late=document.createElement('aside');late.id='boundary-late';late.innerHTML='<button>late</button>';document.body.append(late)}''');page.wait_for_timeout(30)
                check('Standalone embedded Navigation isolates dynamic sibling',page.locator('#boundary-late').evaluate('e=>e.inert'))
                page.locator('#boundary-late button').evaluate('e=>e.focus()')
                check('Standalone embedded Navigation prevents background focus',page.locator('#boundary-modal').evaluate('e=>e.contains(document.activeElement)'))
                page.evaluate("MicroNavigation.closeLayer(document.querySelector('#boundary-modal'))")
                check('Standalone embedded Navigation restores dynamic sibling',page.locator('#boundary-late').evaluate('e=>!e.inert'))
            check('No browser or resource errors',not errors,errors)
            browser.close()
    except Exception as e:
        check('Test runner completed',False,str(e))
    finally:
        server.shutdown()
    sources=[*ROOT.glob('previews/integration-boundaries/*'),ROOT/'components/navigation/navigation.js',ROOT/'tools/integration-boundaries-check.py',ROOT/'previews/ui-system-showcase/standalone.html']
    result=dict(scope='independent synthetic UX fixtures only; Light; no product host',viewport='360x780 RTL; directional LTR; focused 320 container',sourceRef=args.source_ref,commitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),browser=locals().get('version'),passed=sum(x['passed'] for x in checks),failed=sum(not x['passed'] for x in checks),checks=checks,measurements=measurements,errors=errors,servedNavigationSha256=hashlib.sha256(js.encode() if args.source_ref else (ROOT/'components/navigation/navigation.js').read_bytes()).hexdigest(),workspaceSha256={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sources})
    (out/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ['passed','failed','browser']},ensure_ascii=False))
    return 1 if result['failed'] else 0
if __name__=='__main__':raise SystemExit(main())
