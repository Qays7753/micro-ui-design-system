import json,sys,http.server,threading
from pathlib import Path
import os, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[4]; OUT=Path(os.environ.get('MICRO_AUDIT_OUT', '/tmp/micro-final-review-visual'));OUT.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(ROOT/'tools'))
from browser_support import chromium_launch_options
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
results={'sha':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'viewport':[360,780],'direction':'rtl','theme':'light','families':{},'errors':[],'failedRequests':[],'states':[]}
with sync_playwright() as pw:
 b=pw.chromium.launch(**chromium_launch_options());results['browser']=b.version
 p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',reduced_motion='reduce')
 p.on('pageerror',lambda e:results['errors'].append(str(e)));p.on('requestfailed',lambda r:results['failedRequests'].append(r.url))
 p.goto(base+'/previews/ui-system-showcase/index.html#component-review');p.evaluate('document.fonts.ready');p.wait_for_timeout(150)
 def select(f):p.select_option('#sc-review-family',f);p.wait_for_timeout(100)
 def snap(sel,name):
  p.locator(sel).screenshot(path=str(OUT/(name+'.png')));results['states'].append(name)
 for f in json.loads((ROOT/'docs/COMPONENT-CATALOG.json').read_text())['families']:
  key=f['id'];select(key)
  results['families'][key]=p.evaluate('''()=>({dir:document.dir,scroll:document.documentElement.scrollWidth,width:innerWidth,sections:[...document.querySelectorAll('.sc-section:not([hidden])')].map(s=>({id:s.id,width:s.getBoundingClientRect().width,height:s.getBoundingClientRect().height}))})''')
  for i,s in enumerate(results['families'][key]['sections']):snap('#'+s['id'],key+('' if i==0 else '-'+str(i)))
 for family,sel,name in [('data','#sc-chart-donut','variant-donut'),('data','#sc-chart-bubbles','variant-bubbles'),('data','#sc-review-packed','variant-packed-circle'),('data','#sc-signed','signed-data'),('metric-comparison','[data-review-variant="metric-circles"]','variant-metric-circles'),('metric-comparison','#sc-main-metric','variant-main-metric-featured'),('info-strip','#sc-strip-peek','variant-info-strip-peek')]:
  select(family);snap(sel,name)
 select('navigation');p.locator('.sc-frame').scroll_into_view_if_needed();p.screenshot(path=str(OUT/'navigation-initial-viewport.png'))
 def cover():return p.locator('#sc-actionbar .m-btn--icon').evaluate('''e=>{const r=e.getBoundingClientRect(), hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2),frame=e.closest('.sc-frame').getBoundingClientRect();return {button:r.toJSON(),frame:frame.toJSON(),hit:hit?.outerHTML.slice(0,300),covered:!!hit&&!e.contains(hit)}}''')
 results['navigationInitial']=cover();p.locator('.sc-frame').evaluate('e=>e.scrollTop=e.scrollHeight');results['navigationAfterScroll']=cover();snap('.sc-frame','navigation-scrolled')
 p.locator('#sc-sheet-trigger').click();p.wait_for_timeout(100);p.screenshot(path=str(OUT/'navigation-sheet.png'));p.keyboard.press('Escape')
 p.locator('#sc-dialog-trigger').click();p.wait_for_timeout(100);p.screenshot(path=str(OUT/'navigation-dialog.png'));p.keyboard.press('Escape')
 select('account-settings');p.locator('#sc-account-root [data-account-open]').click();p.wait_for_timeout(100);p.screenshot(path=str(OUT/'settings-account.png'));p.locator('#sc-account-root [data-account-to-application]').click();p.wait_for_timeout(100);p.screenshot(path=str(OUT/'settings-application.png'));p.keyboard.press('Escape')
 select('selection');p.locator('#sc-picker-trigger').click();p.wait_for_timeout(100);p.screenshot(path=str(OUT/'selection-picker.png'));p.locator('#sc-picker [data-picker-search]').fill('بدون نتائج تطابق');p.screenshot(path=str(OUT/'selection-picker-empty.png'));p.keyboard.press('Escape')
 select('fields');p.locator('#sc-f-search').fill('اسم للبحث');p.locator('#sc-f-name').focus();snap('#sc-fields','fields-filled-focus')
 p.evaluate("document.getElementById('sc-field-error-demo').classList.add('has-error');document.getElementById('sc-f-demo').setAttribute('aria-invalid','true');let m=document.querySelector('#sc-field-error-demo [data-field-msg]');m.textContent='راجع القيمة';m.hidden=false;MicroFields.sync(document.getElementById('sc-field-error-demo'))")
 snap('#sc-field-error-demo','field-error')
 select('access-gateway');p.locator('#sc-gateway-root button[type=submit]').click();snap('#sc-gateway-root','gateway-validation')
 select('carousel');p.locator('#sc-carousel [data-card-expand]').first.click();snap('#sc-carousel-root','carousel-expanded')
 select('data')
 for s in ['#sc-chart-bars','#sc-chart-line','#sc-chart-donut','#sc-chart-bubbles','#sc-review-packed','#sc-signed-bars','#sc-signed-time']:
  p.locator(s+' .m-chart__disclose').click();snap(s,'table-'+s[1:])
 select('messages');p.locator('#sc-toast-open').click();p.wait_for_timeout(100);p.screenshot(path=str(OUT/'toast.png'));p.locator('#sc-toast [data-toast-close]').click()
 # Independent family preview coverage, catalog-specified routes only.
 for f in json.loads((ROOT/'docs/COMPONENT-CATALOG.json').read_text())['families']:
  key=f['id'];p.goto(base+'/'+f['preview']);p.evaluate('document.fonts.ready');p.wait_for_timeout(100)
  results['families'][key]['preview']=p.evaluate('''()=>({dir:document.dir,width:innerWidth,scroll:document.documentElement.scrollWidth,title:document.title})''')
  p.screenshot(path=str(OUT/('preview-'+key+'.png')),full_page=True)
  if key=='carousel':
   root=p.locator('#main-carousel');root.evaluate("e=>e.dataset.peek='true'");p.evaluate("MicroCarousel.disconnect(document.querySelector('#main-carousel'));MicroCarousel.init(document.querySelector('#main-carousel'))");p.wait_for_timeout(100);snap('#main-carousel','carousel-peek')
  if key=='metric-comparison':
   for mode in ['zero','negative','missing','invalid','mixed']:
    p.select_option('#comparison-mode',mode);p.wait_for_timeout(100);snap('#comparison','metric-'+mode) if p.locator('#comparison').count() else p.screenshot(path=str(OUT/('metric-'+mode+'.png')),full_page=True)
   p.select_option('#comparison-mode','standard');p.select_option('#circle-layout','overlap');p.wait_for_timeout(100);p.screenshot(path=str(OUT/'metric-overlap.png'),full_page=True)
 b.close()
server.shutdown();server.server_close();(OUT/'observations.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print(json.dumps(results,ensure_ascii=False,indent=2))
