import sys,json,http.server,threading
from pathlib import Path
import os, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[4];OUT=Path(os.environ.get('MICRO_AUDIT_OUT', '/tmp/micro-final-review-visual-focused'));OUT.mkdir(parents=True,exist_ok=True);sys.path.insert(0,str(ROOT/'tools'));from browser_support import chromium_launch_options
class H(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
s=http.server.ThreadingHTTPServer(('127.0.0.1',0),H);threading.Thread(target=s.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{s.server_port}';checks=[];errors=[]
def check(n,ok,d=None):checks.append({'name':n,'passed':bool(ok),'detail':d});print(('PASS ' if ok else 'FAIL ')+n,flush=True)
with sync_playwright() as w:
 b=w.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',reduced_motion='reduce');p.on('pageerror',lambda e:errors.append(str(e)));p.on('requestfailed',lambda r:errors.append(r.url))
 p.goto(base+'/previews/ui-system-showcase/index.html#component-review');p.evaluate('document.fonts.ready')
 def family(name):p.select_option('#sc-review-family',name);p.wait_for_timeout(60)
 def shot(sel,name):p.locator(sel).screenshot(path=str(OUT/(name+'.png')))
 family('navigation');shot('.sc-frame','navigation-initial')
 def navgeometry():return p.evaluate('''()=>{let e=document.querySelector('#sc-actionbar .m-btn--icon'),r=e.getBoundingClientRect(),n=document.querySelector('.sc-frame .m-navbar').getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {icon:r.toJSON(),navbar:n.toJSON(),clear:r.bottom<=n.top+1&&!!hit&&e.contains(hit)}}''')
 state=navgeometry();check('navigation initial: bottom navbar never covers icon action',state['clear'],state);p.locator('.sc-frame').evaluate('e=>e.scrollTop=e.scrollHeight');shot('.sc-frame','navigation-scrolled');state=navgeometry();check('navigation scrolled: bottom navbar never covers icon action',state['clear'],state)
 shot('.sc-actionbar-example','actionbar-stack');check('stack option: text fills row while icon remains square',p.locator('.sc-actionbar-example .m-btn--icon').evaluate('e=>e.offsetWidth===48&&e.offsetHeight===48'))
 family('info-strip');shot('#sc-info-strip .m-info-card--featured','info-featured');check('featured card has an actual visible example',p.locator('#sc-info-strip .m-info-card--featured').is_visible())
 family('data');p.locator('#sc-signed-bars .m-chart__disclose').click();shot('#sc-signed-bars','signed-bars-table');p.locator('#sc-signed-time .m-chart__disclose').click();shot('#sc-signed-time','signed-time-table');check('time coordinate is isolated without losing its exact value',p.locator('#sc-signed-time tbody td bdi').first.inner_text()=='2026-01-01')
 family('metric-comparison');p.locator('#sc-main-metric button[aria-expanded]').click();shot('#sc-main-metric','metric-table')
 p.goto(base+'/components/access-gateway/example-usage.html');p.evaluate('document.fonts.ready');p.evaluate("MicroAccessGateway.init(document.querySelector('[data-access-gateway]'),{onRecovery:()=>({message:'عرض محلي'})})");shot('[data-access-gateway]','recovery-option');check('recovery option fits its component',p.locator('[data-access-gateway]').evaluate('e=>e.scrollWidth<=e.clientWidth') and p.locator('[data-access-recovery]').is_visible());p.goto(base+'/previews/ui-system-showcase/index.html#component-review');p.evaluate('document.fonts.ready')
 family('buttons');p.evaluate("let e=document.getElementById('sc-btn-demo');e.classList.add('m-btn--loading-replace');MicroButtons.setLoading(e,true)");shot('#sc-btn-demo','replacement-loading')
 p.goto(base+'/previews/buttons/index.html');p.evaluate('document.fonts.ready');shot('.state-row:first-of-type .is-loading','default-loading') if p.locator('.state-row:first-of-type .is-loading').count()==1 else p.locator('.state-row').first.locator('.is-loading').screenshot(path=str(OUT/'default-loading.png'))
 p.goto(base+'/previews/compositions/row-example.html');p.evaluate('document.fonts.ready');p.locator('#row-action').click();shot('#row-example','row-composition');state=p.locator('.composition-row').evaluate('''e=>{let t=e.querySelector('.m-row__text').getBoundingClientRect(),a=e.querySelector('.m-row__action').getBoundingClientRect();return {textWidth:t.width,rowWidth:e.getBoundingClientRect().width,textBottom:t.bottom,actionTop:a.top}}''');check('narrow row: reading receives its own line before actions',state['actionTop']>=state['textBottom'] and state['textWidth']>=state['rowWidth']*.8,state)
 check('visual pages have no runtime/resource errors',not errors,errors);b.close()
s.shutdown();s.server_close();r={'baseCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'workingTree':True,'scope':'360x780 RTL Light','passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks};(OUT/'verification.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print(r['passed'],r['failed'])

raise SystemExit(1 if r["failed"] else 0)
