import json,sys,http.server,threading
from pathlib import Path
import os, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[4];OUT=Path(os.environ.get('MICRO_AUDIT_OUT', '/tmp/micro-final-review-visual'))
OUT.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(ROOT/'tools'));from browser_support import chromium_launch_options
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
s=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=s.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{s.server_port}'
r={'sha':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'errors':[],'states':[],'measurements':{}}
with sync_playwright() as w:
 b=w.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',reduced_motion='reduce');p.on('pageerror',lambda e:r['errors'].append(str(e)))
 def go(path):p.goto(base+'/'+path);p.evaluate('document.fonts.ready');p.wait_for_timeout(80)
 def shot(sel,name):p.locator(sel).screenshot(path=str(OUT/(name+'.png')));r['states'].append(name)
 go('previews/ui-system-showcase/index.html#component-review');p.select_option('#sc-review-family','order-schedule');p.wait_for_timeout(100)
 root='#sc-ocal-root'
 for view in ['week','day','month']:
  p.locator(root+' [data-ocal-action=view][data-ocal-value='+view+']').click();shot(root,'calendar-'+view)
 p.locator(root+' [data-ocal-action=order-row]').first.click();shot(root,'calendar-expanded')
 p.locator(root+' [data-ocal-action=month-picker]').click();shot(root,'calendar-picker');p.locator(root+' [data-ocal-action=picker-back]').click()
 p.locator(root+' [data-ocal-action=mode-toggle]').click();shot(root,'calendar-list')
 for state in ['loading','error','empty']:
  p.locator('#sc-ocal-'+state).evaluate('e=>e.click()');shot(root,'calendar-'+state);p.locator('#sc-ocal-restore').evaluate('e=>e.click()')
 p.select_option('#sc-review-family','navigation');p.wait_for_timeout(100);p.locator('.sc-frame').scroll_into_view_if_needed()
 r['measurements']['nav']=p.evaluate('''()=>{let a=document.querySelector('#sc-actionbar .m-btn--icon').getBoundingClientRect(),n=document.querySelector('#sc-navigation .m-navbar').getBoundingClientRect();return {icon:a.toJSON(),navbar:n.toJSON(),overlapPixels:Math.max(0,Math.min(a.bottom,n.bottom)-Math.max(a.top,n.top))}}''')
 p.select_option('#sc-review-family','metric-comparison');p.wait_for_timeout(100)
 shot('#sc-metric .m-main-metric--flat','metric-flat');shot('#sc-metric .m-main-metric--compact','metric-compact')
 p.select_option('#sc-review-family','data');p.wait_for_timeout(100)
 r['measurements']['signedRTL']=p.locator('#sc-signed-bars svg').evaluate('e=>({width:e.getBoundingClientRect().width,html:e.outerHTML})')
 p.evaluate("document.documentElement.dir='ltr'");p.wait_for_timeout(120);shot('#sc-signed','signed-data-ltr');r['measurements']['ltrOverflow']=p.evaluate('document.documentElement.scrollWidth')
 go('previews/concepts/index.html');p.locator('[data-info-strip-next]').click();shot('#strip [data-info-strip]','metric-compact-in-strip');p.locator('[data-info-strip-next]').click()
 for mode in ['standard','small','zero','negative','missing','invalid','mixed']:
  p.select_option('#comparison-mode',mode);p.wait_for_timeout(100);shot('#strip [data-info-strip]','circles-'+mode)
 p.select_option('#comparison-mode','standard');p.select_option('#circle-layout','overlap');p.wait_for_timeout(100);shot('#strip [data-info-strip]','circles-overlap')
 go('previews/buttons/index.html')
 for i in range(p.locator('.state-row').count()):p.locator('.state-row').nth(i).screenshot(path=str(OUT/f'button-states-{i}.png'))
 go('components/data/example-usage.html')
 r['dataExamples']=p.locator('[data-chart]').evaluate_all('es=>es.map((e,i)=>({i,id:e.id,type:e.dataset.chart}))')
 for i in range(p.locator('[data-chart]').count()):p.locator('[data-chart]').nth(i).screenshot(path=str(OUT/f'data-example-{i}.png'))
 go('components/info-strip/example-usage.html');p.screenshot(path=str(OUT/'info-source-example.png'),full_page=True)
 go('components/metric-comparison/example-usage.html')
 for i in range(p.locator('[data-metric-circles],[data-main-comparison]').count()):p.locator('[data-metric-circles],[data-main-comparison]').nth(i).screenshot(path=str(OUT/f'metric-example-{i}.png'))
 go('previews/ui-system-showcase/index.html#component-review');p.select_option('#sc-review-family','access-gateway');p.wait_for_timeout(100)
 p.locator('#sc-gw-email').fill('test@example.test');p.locator('#sc-gw-password').fill('test-pass');p.locator('#sc-gateway-root button[type=submit]').click();shot('#sc-gateway-root','gateway-busy');p.wait_for_timeout(650);shot('#sc-gateway-root','gateway-result')
 p.select_option('#sc-review-family','buttons');p.wait_for_timeout(100)
 r['measurements']['fonts']=p.locator('#sc-buttons .m-btn').first.evaluate('e=>({font:getComputedStyle(e).fontFamily,size:getComputedStyle(e).fontSize,weight:getComputedStyle(e).fontWeight,fontsReady:document.fonts.status})')
 b.close()
s.shutdown();s.server_close();(OUT/'state-observations.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in r.items() if k!='measurements'},ensure_ascii=False));print(json.dumps({k:v for k,v in r['measurements'].items() if k!='signedRTL'},ensure_ascii=False))
