from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,json,subprocess,os
from playwright.sync_api import sync_playwright
R=Path(os.environ.get('MICRO_REVIEW_ROOT',str(Path(__file__).resolve().parents[4])));O=Path('/tmp/micro-sui-r2-review/edge');O.mkdir(exist_ok=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(R)));threading.Thread(target=s.serve_forever,daemon=True).start()
u=f'http://127.0.0.1:{s.server_port}/previews/ux-patterns/mobile-record-sample/index.html'
ZOOM="""() => {const a=[document.body,...document.body.querySelectorAll('*')];const v=a.map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);v.forEach(([e,n])=>e.style.fontSize=n*2+'px');} """
GEO="""() => {let b=document.querySelector('#f03-select-bar'),n=document.querySelector('#f03-navbar'),z=document.querySelector('#f03-select-zone');let br=b.getBoundingClientRect(),nr=n.getBoundingClientRect(),zr=z.getBoundingClientRect();return {scroll:scrollY,bodyHeight:document.documentElement.scrollHeight,fixed:b.classList.contains('f03-selectbar-fixed'),bar:[br.top,br.bottom],nav:[nr.top,nr.bottom],zone:[zr.top,zr.bottom],overlap:Math.max(0,Math.min(br.bottom,nr.bottom)-Math.max(br.top,nr.top))}}"""
out={'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip(),'cases':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-r2-browser/chromium'),headless=True,args=['--no-sandbox']);out['browser']=b.version
 for target in [u,(R/'previews/ux-patterns/mobile-record-sample/standalone.html').as_uri()]:
  pg=b.new_page(viewport={'width':320,'height':844});pg.goto(target);pg.wait_for_load_state('networkidle');pg.click('[data-access-provider="demo"]');pg.wait_for_timeout(400);pg.click('#f03-nav-list');pg.wait_for_timeout(200);pg.click('#f03-select-toggle');pg.wait_for_timeout(150);pg.evaluate(ZOOM);pg.wait_for_timeout(500)
  rows=[]
  for y in [0,50,100,150,180,210,250,300,500,10000,300,210,180,150,100,50,0]:
   pg.evaluate('(y)=>window.scrollTo(0,y)',y);pg.wait_for_timeout(180);rows.append({'requested':y,**pg.evaluate(GEO)})
  pg.screenshot(path=str(O/('src-selection.png' if target==u else 'standalone-selection.png')))
  out['cases'].append({'target':'src' if target==u else 'standalone','selectionScroll':rows});pg.close()
 # Consumer callback writes the status directly before resolving (without event listener).
 pg=b.new_page();pg.goto(f'http://127.0.0.1:{s.server_port}/components/access-gateway/example-usage.html');pg.wait_for_load_state('networkidle')
 pg.evaluate("""()=>{let g=document.querySelector('[data-access-gateway]');MicroAccessGateway.init(g,{onSubmit:()=>{g.querySelector('[data-access-status]').textContent='طلبك قيد المراجعة من التطبيق';return undefined}})}""")
 pg.fill('#gateway-email','q@example.test');pg.fill('#gateway-password','123456789');pg.click('[type=submit]');pg.wait_for_timeout(200);out['directCallbackStatus']=pg.locator('[data-access-status]').inner_text()
 b.close()
s.shutdown();(O/'results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps(out,ensure_ascii=False,indent=2))
