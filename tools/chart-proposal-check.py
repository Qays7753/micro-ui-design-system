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
                d=p.evaluate('''()=>{const bad=[];const view=document.querySelector('.proposal-view:not([hidden])');const targets=[...document.querySelectorAll('button,summary,input[type=range],a')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');for(const e of targets){const r=e.getBoundingClientRect();if(r.width<47.9||r.height<47.9)bad.push({text:e.textContent,kind:'small',w:r.width,h:r.height});}for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){if(targets[i].contains(targets[j])||targets[j].contains(targets[i]))continue;const a=targets[i].getBoundingClientRect(),b=targets[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)bad.push({kind:'overlap',a:targets[i].textContent,b:targets[j].textContent});}for(const row of view.querySelectorAll('.proposal-grid-rows>li')){const parts=[row.querySelector('.proposal-row-head>span'),row.querySelector('.proposal-bar'),row.querySelector('.proposal-row-head>strong')].filter(Boolean);for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){const a=parts[i].getBoundingClientRect(),b=parts[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1)bad.push({kind:'row-parts-overlap',text:row.textContent});}const label=parts[0],b=label.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(label);for(const x of r.getClientRects())if(x.left<b.left-1||x.right>b.right+1)bad.push({kind:'label-overflow',text:label.textContent});}for(const e of view.querySelectorAll('[data-category],[data-amount]')){const b=e.closest('button').getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);for(const x of r.getClientRects())if(x.left<b.left-1||x.right>b.right+1)bad.push({kind:'category-overflow',text:e.textContent});}const readings=[...view.querySelectorAll('bdi')].filter(e=>e.getClientRects().length);for(const e of readings){const box=e.closest('.proposal-card').getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);for(const x of r.getClientRects())if(x.left<box.left-1||x.right>box.right+1)bad.push({kind:'reading-overflow',text:e.textContent});}return {viewport:innerWidth,docWidth:document.documentElement.scrollWidth,container:view.getBoundingClientRect().width,targets:targets.length,bad}}''')
                measurements.append(dict(name=name,**d));check(name,d['docWidth']<=d['viewport'] and not d['bad'],d)
                aligned=p.locator('.proposal-view:not([hidden]) .proposal-grid-rows').evaluate_all('''lists=>lists.every(list=>{const bars=[...list.querySelectorAll('.proposal-bar')].map(e=>e.getBoundingClientRect());return bars.every(b=>Math.abs(b.width-bars[0].width)<1&&Math.abs(b.left-bars[0].left)<1)})''')
                check(name+' shared scale columns align',aligned)
            def density(name):
                d=p.locator('#'+name).evaluate('''e=>({id:e.id,top:e.getBoundingClientRect().top,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,bottom:e.getBoundingClientRect().bottom,surfaces:e.querySelectorAll('.proposal-card').length,cards:[...e.querySelectorAll('.proposal-card')].map(x=>({title:x.querySelector('h2').textContent,height:x.getBoundingClientRect().height})),numbers:[...e.querySelectorAll('bdi')].filter(x=>x.getClientRects().length).map(x=>x.textContent),allNumbers:[...e.querySelectorAll('bdi')].map(x=>x.textContent)})''')
                measurements.append(dict(name='density '+name,**d))
                check('Structured '+name+' content remains in natural scroll flow',p.locator('#'+name).evaluate("e=>getComputedStyle(e).overflowY!=='hidden'&&document.documentElement.scrollHeight>=e.getBoundingClientRect().bottom+scrollY"),d)
            def view(name):
                p.locator('[data-view="'+name+'"]').click();p.evaluate('scrollTo(0,0)')
                check('Selected context '+name+' retains brand fill while hovered',p.locator('[data-view="'+name+'"]').evaluate('''e=>{const s=document.createElement('span');s.style.background='var(--micro-brand-primary)';s.style.color='var(--micro-text-inverse)';document.body.append(s);const a=getComputedStyle(e),b=getComputedStyle(s);const ok=a.backgroundColor===b.backgroundColor&&a.color===b.color;s.remove();return ok}'''))
            for selector,expected in [('body',16),('.proposal-intro h1',24),('#trend-title',18),('#week-total',36),('#clients-title',18),('#goal-value',36),('.proposal-share-hero .proposal-reading bdi',22),('[data-share="0"] [data-category]',14)]:
                check('Approved type size retained '+selector,abs(float(p.locator(selector).first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)'))-expected)<.1)
            check('Customer primary reading retains36px',p.locator('[aria-label="إجمالي الأرصدة المعروضة"] bdi').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)===36'))
            check('Donut retains112px diameter',p.locator('#share-ring').evaluate('e=>parseFloat(getComputedStyle(e).width)===112&&parseFloat(getComputedStyle(e).height)===112'))
            check('Explicit sample data notice visible','بيانات توضيحية' in p.locator('.proposal-kicker').inner_text())
            check('Absolute weekly total from seven declared daily values',p.locator('#week-total').inner_text()=='4,820')
            check('Absolute prior-period delta, no percent',p.locator('#week-difference').inner_text()=='+640' and '%' not in p.locator('#activity').inner_text())
            check('Seven bar marks',p.locator('#trend-svg rect').count()==7)
            check('Full selected reading outside plot','820' in p.locator('#point-reading').inner_text())
            geometry('activity360 RTL: targets, readings, overflow');density('activity');shot('01-activity-360-rtl')
            p.locator('#point-picker').focus();p.keyboard.press('ArrowLeft');check('Native keyboard changes selected point','560' in p.locator('#point-reading').inner_text() and p.locator('#point-picker').get_attribute('aria-valuetext').startswith('الأربعاء'))
            check('Plot focus ring visible',p.locator('#trend-plot').evaluate("e=>getComputedStyle(e).outlineStyle==='solid'&&getComputedStyle(e).outlineWidth==='2px'"))
            p.keyboard.press('Home');check('Home selects first point','580' in p.locator('#point-reading').inner_text());check('Previous control disabled at first point',p.locator('#point-prev').is_disabled())
            p.keyboard.press('End');check('End selects last point and next disabled','820' in p.locator('#point-reading').inner_text() and p.locator('#point-next').is_disabled())
            p.locator('#point-prev').click();p.locator('#point-next').click();check('Touch-sized navigation uses same point state','820' in p.locator('#point-reading').inner_text())
            box=p.locator('#point-picker').bounding_box();p.locator('#point-picker').click(position=dict(x=box['width']/2,y=box['height']/2));check('Pointer selects actual middle day and amount','810' in p.locator('#point-reading').inner_text());p.locator('#point-picker').focus();p.keyboard.press('End')
            p.locator('[data-mode=line]').click();check('Line is straight segments across explicit dates',p.locator('.proposal-line').get_attribute('d').count('M')==1 and 'C' not in p.locator('.proposal-line').get_attribute('d'))
            check('Mode change preserves value and selected date','820' in p.locator('#point-reading').inner_text() and p.locator('#week-total').inner_text()=='4,820')
            p.evaluate('scrollTo(0,0)');shot('02-line-360-rtl')
            p.locator('#data-toggle').click();check('Table keeps all seven exact readings',p.locator('#trend-table tr').count()==7 and p.locator('#trend-table td').all_inner_texts()==['580','720','640','810','690','560','820']);p.locator('#data-toggle').click()
            p.locator('#data-toggle').focus();p.keyboard.press('Enter');check('Reading disclosure exposes table and expanded state',p.locator('#trend-data').is_visible() and p.locator('#data-toggle').get_attribute('aria-expanded')=='true');p.keyboard.press('Enter');check('Reading disclosure closes without changing day',not p.locator('#trend-data').is_visible() and p.locator('#data-toggle').get_attribute('aria-expanded')=='false' and '820' in p.locator('#point-reading').inner_text())
            view('compare');check('Independent money comparison, not percentage','3,120' in p.locator('#cash-list').inner_text() and '2,480' in p.locator('#cash-list').inner_text() and '%' not in p.locator('#compare').inner_text())
            check('Cash delta not claimed as profit','لا يعبّر وحده عن الربح' in p.locator('#compare').inner_text())
            check('Customer balance sum shown exactly','1,560' in p.locator('#clients-title').locator('..').locator('..').inner_text())
            check('Signed comparison keeps negative and true zero','−9' in p.locator('#signed-list').inner_text() and p.locator('#signed-list bdi').all_inner_texts()==['32','−9','0'])
            geometry('comparison360 RTL: targets, readings, overflow');density('compare');shot('03-comparison-360-rtl')
            p.locator('#signed-title').scroll_into_view_if_needed();shot('04-signed-360-rtl')
            saved=p.locator('#clients-list').inner_html();long_name='عميلباسممتصلطويل'*3;p.locator('#clients-list .proposal-row-head>span').first.evaluate('(e,t)=>e.textContent=t',long_name);p.locator('#clients-list bdi').first.evaluate("e=>e.textContent='123,456,789.125'");geometry('long row name and amount retain separate columns');check('Long row text and amount remain exact',p.locator('#clients-list .proposal-row-head>span').first.text_content()==long_name and p.locator('#clients-list bdi').first.text_content()=='123,456,789.125');p.locator('#clients-list').evaluate('(e,t)=>e.innerHTML=t',saved)
            view('share');check('Donut absolute denominator and all four amounts',p.locator('#share-list [data-amount] bdi').all_inner_texts()==['600','360','180','120'] and '1,260' in p.locator('.proposal-share-hero').inner_text())
            check('Category and amount remain on one baseline',p.locator('.proposal-share-item').evaluate_all('''es=>es.every(e=>{const baseline=s=>{const p=document.createElement('span');p.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';e.querySelector(s).append(p);const y=p.getBoundingClientRect().top;p.remove();return y;};return Math.abs(baseline('[data-category]')-baseline('[data-amount]'))<1})'''))
            check('Only actual part-of-whole percent','48%' in p.locator('#share-selected').inner_text());p.locator('[data-share="1"]').click();check('Category selection updates explicit share and focus','29%' in p.locator('#share-selected').inner_text() and p.locator('[data-share="1"]').evaluate('e=>e===document.activeElement'));p.locator('[data-share="0"]').click()
            check('Progress numerator and denominator exact',p.locator('#goal-value').inner_text()=='1,260' and '1,800' in p.locator('#goal-context').inner_text() and p.locator('#goal-percent').inner_text()=='70%')
            check('Progress remaining amount exact','540' in p.locator('#goal-remainder').inner_text());geometry('share360 RTL: targets, readings, overflow');density('share');p.evaluate('scrollTo(0,0)');shot('05-share-progress-360-rtl');p.locator('#share').screenshot(path=str(out/'05-share-components.png'))
            long_category='فئةباسممتصلطويل'*3;p.locator('[data-share="0"] [data-category]').evaluate('(e,t)=>e.textContent=t',long_category);geometry('long category remains inside its48px-plus target');check('Long category is not truncated',p.locator('[data-share="0"] [data-category]').text_content()==long_category);p.locator('[data-share="0"] [data-category]').evaluate("e=>e.textContent='مواد'")
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
