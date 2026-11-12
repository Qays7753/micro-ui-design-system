#!/usr/bin/env python3
"""Review-only chart concept: Light360 RTL; targeted320 long reading and LTR axis.
Not an implementation or release gate for MicroData/Metric APIs.
"""
import argparse,hashlib,http.server,json,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
    def log_message(self,*_):pass

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path);a=ap.parse_args();out=a.out or Path(tempfile.mkdtemp(prefix='chart-proposal-'));out.mkdir(parents=True,exist_ok=True)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
    checks=[];errors=[];measurements=[]
    def check(name,ok,detail=None):
        checks.append(dict(name=name,passed=bool(ok),detail=detail))
        if not ok:print('FAIL',name,str(detail)[:250],flush=True)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(**chromium_launch_options());version=browser.version
            p=browser.new_page(viewport=dict(width=360,height=780),color_scheme='light',locale='ar',reduced_motion='reduce')
            p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
            p.goto(f'http://127.0.0.1:{server.server_port}/previews/chart-proposal/',wait_until='networkidle');p.evaluate('document.fonts.ready')
            def shot(name):p.screenshot(path=str(out/(name+'.png')))
            def geometry(name):
                d=p.evaluate('''()=>{const bad=[];const view=document.querySelector('.proposal-view:not([hidden])');const targets=[...document.querySelectorAll('button,summary,input[type=range],a')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');for(const e of targets){const r=e.getBoundingClientRect();if(r.width<47.9||r.height<47.9)bad.push({text:e.textContent,kind:'small',w:r.width,h:r.height});}for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){if(targets[i].contains(targets[j])||targets[j].contains(targets[i]))continue;const a=targets[i].getBoundingClientRect(),b=targets[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)bad.push({kind:'overlap',a:targets[i].textContent,b:targets[j].textContent});}const readings=[...view.querySelectorAll('bdi')].filter(e=>e.getClientRects().length);for(const e of readings){const box=e.closest('.proposal-card').getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);for(const x of r.getClientRects())if(x.left<box.left-1||x.right>box.right+1)bad.push({kind:'reading-overflow',text:e.textContent});}return {viewport:innerWidth,docWidth:document.documentElement.scrollWidth,container:view.getBoundingClientRect().width,targets:targets.length,bad}}''')
                measurements.append(dict(name=name,**d));check(name,d['docWidth']<=d['viewport'] and not d['bad'],d)
            def view(name):
                p.locator('[data-view="'+name+'"]').click();p.evaluate('scrollTo(0,0)')
                check('Selected context '+name+' retains brand fill while hovered',p.locator('[data-view="'+name+'"]').evaluate('''e=>{const s=document.createElement('span');s.style.background='var(--micro-brand-primary)';s.style.color='var(--micro-text-inverse)';document.body.append(s);const a=getComputedStyle(e),b=getComputedStyle(s);const ok=a.backgroundColor===b.backgroundColor&&a.color===b.color;s.remove();return ok}'''))
            check('Explicit sample data notice visible','بيانات توضيحية' in p.locator('.proposal-kicker').inner_text())
            check('Absolute weekly total from seven declared daily values',p.locator('#week-total').inner_text()=='4,820')
            check('Absolute prior-period delta, no percent',p.locator('#week-difference').inner_text()=='+640' and '%' not in p.locator('#activity').inner_text())
            check('Seven bar marks',p.locator('#trend-svg rect').count()==7)
            check('Full selected reading outside plot','820' in p.locator('#point-reading').inner_text())
            geometry('activity360 RTL: targets, readings, overflow');shot('01-activity-360-rtl')
            p.locator('#point-picker').focus();p.keyboard.press('ArrowLeft');check('Native keyboard changes selected point','560' in p.locator('#point-reading').inner_text() and p.locator('#point-picker').get_attribute('aria-valuetext').startswith('الأربعاء'))
            check('Plot focus ring visible',p.locator('#trend-plot').evaluate("e=>getComputedStyle(e).outlineStyle==='solid'&&getComputedStyle(e).outlineWidth==='2px'"))
            p.keyboard.press('Home');check('Home selects first point','580' in p.locator('#point-reading').inner_text());check('Previous control disabled at first point',p.locator('#point-prev').is_disabled())
            p.keyboard.press('End');check('End selects last point and next disabled','820' in p.locator('#point-reading').inner_text() and p.locator('#point-next').is_disabled())
            p.locator('#point-prev').click();p.locator('#point-next').click();check('Touch-sized navigation uses same point state','820' in p.locator('#point-reading').inner_text())
            box=p.locator('#point-picker').bounding_box();p.locator('#point-picker').click(position=dict(x=box['width']/2,y=box['height']/2));check('Pointer selects actual middle day and amount','810' in p.locator('#point-reading').inner_text());p.locator('#point-picker').focus();p.keyboard.press('End')
            p.locator('[data-mode=line]').click();check('Line is straight segments across explicit dates',p.locator('.proposal-line').get_attribute('d').count('M')==1 and 'C' not in p.locator('.proposal-line').get_attribute('d'))
            check('Mode change preserves value and selected date','820' in p.locator('#point-reading').inner_text() and p.locator('#week-total').inner_text()=='4,820')
            p.evaluate('scrollTo(0,0)');shot('02-line-360-rtl')
            p.locator('.proposal-details summary').click();check('Table keeps all seven exact readings',p.locator('#trend-table tr').count()==7 and p.locator('#trend-table td').all_inner_texts()==['580','720','640','810','690','560','820']);p.locator('.proposal-details summary').click()
            view('compare');check('Independent money comparison, not percentage','3,120' in p.locator('#cash-list').inner_text() and '2,480' in p.locator('#cash-list').inner_text() and '%' not in p.locator('#compare').inner_text())
            check('Cash delta not claimed as profit','لا يعبّر وحده عن الربح' in p.locator('#compare').inner_text())
            check('Customer balance sum shown exactly','1,560' in p.locator('#clients-title').locator('..').locator('..').inner_text())
            check('Signed comparison keeps negative and true zero','−9' in p.locator('#signed-list').inner_text() and p.locator('#signed-list bdi').all_inner_texts()==['32','−9','0'])
            geometry('comparison360 RTL: targets, readings, overflow');shot('03-comparison-360-rtl')
            p.locator('#signed-title').scroll_into_view_if_needed();shot('04-signed-360-rtl')
            view('share');check('Donut absolute denominator and all four amounts',p.locator('#share-list [data-amount] bdi').all_inner_texts()==['600','360','180','120'] and '1,260' in p.locator('.proposal-share-hero').inner_text())
            check('Only actual part-of-whole percent','48%' in p.locator('#share-selected').inner_text());p.locator('[data-share="1"]').click();check('Category selection updates explicit share and focus','29%' in p.locator('#share-selected').inner_text() and p.locator('[data-share="1"]').evaluate('e=>e===document.activeElement'));p.locator('[data-share="0"]').click()
            check('Progress numerator and denominator exact',p.locator('#goal-value').inner_text()=='1,260' and '1,800' in p.locator('#goal-context').inner_text() and p.locator('#goal-percent').inner_text()=='70%')
            check('Progress remaining amount exact','540' in p.locator('#goal-remainder').inner_text());geometry('share360 RTL: targets, readings, overflow');p.evaluate('scrollTo(0,0)');shot('05-share-progress-360-rtl');p.locator('#share').screenshot(path=str(out/'05-share-components.png'))
            p.locator('.proposal-tools summary').click();p.locator('[data-goal=over]').click();check('Over-target amount and130 percent retained',p.locator('#goal-value').inner_text()=='2,340' and p.locator('#goal-percent').inner_text()=='130%' and '540' in p.locator('#goal-remainder').inner_text());check('Over-target accessible text retains uncapped amount','2,340' in p.locator('#goal-track').get_attribute('aria-valuetext'))
            p.locator('[data-goal=unknown]').click();check('Unknown denominator never invents percent',not p.locator('#goal-track').is_visible() and p.locator('#goal-percent').inner_text()=='' and p.locator('#goal-track').get_attribute('aria-valuenow') is None)
            p.locator('[data-goal=zero]').click();check('Zero denominator never invents percent',not p.locator('#goal-track').is_visible() and p.locator('#goal-percent').inner_text()=='' and 'صفر' in p.locator('#goal-context').inner_text())
            p.locator('[data-state=missing]').click();check('Missing sample day does not become zero','غير متاح' in p.locator('#point-reading').inner_text() and p.locator('#week-total').inner_text()=='غير متاح');check('Missing day cuts line path',p.locator('.proposal-line').get_attribute('d').count('M')==2)
            p.locator('[data-state=zero]').click();check('Known all-zero dataset remains real zero',p.locator('#week-total').inner_text()=='0' and 'غير متاح' not in p.locator('#point-reading').inner_text())
            p.locator('[data-state=negative]').click();check('Negative numeric sign preserved','−160' in p.locator('#point-reading').inner_text());check('Negative remains below same zero line',p.locator('#trend-svg').evaluate("e=>+e.querySelector('.proposal-zero-line').getAttribute('y1')<108"))
            p.locator('[data-state=long]').click();check('Long reading retained exactly','123,456,789.125' in p.locator('#point-reading').inner_text());geometry('long reading360 RTL')
            p.set_viewport_size(dict(width=320,height=780));geometry('targeted320: full long reading and plot target');p.evaluate('scrollTo(0,0)');shot('06-long-320-rtl')
            p.set_viewport_size(dict(width=360,height=780));p.locator('[data-state=ready]').click();p.locator('.proposal-tools summary').click();p.evaluate("document.documentElement.dir='ltr'");geometry('directional360 LTR');p.locator('#point-picker').focus();p.keyboard.press('ArrowLeft');check('Chronological axis stays stable across UI direction','560' in p.locator('#point-reading').inner_text());p.evaluate('scrollTo(0,0)');shot('07-axis-360-ltr')
            check('No public source API loaded or modified',p.evaluate("!window.MicroData&&!window.MicroMetricComparison"))
            outbound=[];p.on('request',lambda r:outbound.append(r.url) if r.url.startswith(('https:','http:')) and r.resource_type!='document' else None)
            p.goto(f'http://127.0.0.1:{server.server_port}/docs/proposals/charts-2026-11-12/review.html',wait_until='networkidle');p.evaluate('document.fonts.ready')
            check('Single-file review keeps absolute weekly total',p.locator('#week-total').inner_text()=='4,820')
            p.locator('[data-view=share]').click();check('Single-file review keeps interactions','1,260' in p.locator('.proposal-share-hero').inner_text() and p.locator('#goal-percent').inner_text()=='70%')
            check('Single-file review needs no asset network requests',not outbound,outbound)
            check('No browser/console/resource errors',not errors,errors)
            browser.close()
    except Exception as e:check('Runner completed',False,str(e))
    finally:server.shutdown()
    sources=[*ROOT.glob('previews/chart-proposal/*'),ROOT/'tools/chart-proposal-check.py',ROOT/'tools/build-chart-proposal-review.py',ROOT/'docs/proposals/charts-2026-11-12/review.html']
    result=dict(scope='Proposal only; not source component acceptance or product host validation',sourceCommitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),browser=locals().get('version'),passed=sum(x['passed'] for x in checks),failed=sum(not x['passed'] for x in checks),checks=checks,measurements=measurements,errors=errors,sourceSha256={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sources})
    (out/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:result[k] for k in ['passed','failed','browser']}));return bool(result['failed'])
if __name__=='__main__':raise SystemExit(main())
