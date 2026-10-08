import os
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,json,subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ.get('MICRO_REVIEW_ROOT', str(Path(__file__).resolve().parents[4])))
OUT=Path('/tmp/micro-repair-review/extra');OUT.mkdir(parents=True,exist_ok=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{srv.server_port}'
results={'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':{}}
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-review-chromium'),headless=True,args=['--no-sandbox'])
 results['browser']=browser.version
 page=browser.new_page(viewport={'width':390,'height':850})
 # Source contract: consumer owns authentication results.
 page.goto(base+'/components/access-gateway/example-usage.html');page.wait_for_load_state('networkidle')
 page.evaluate('''() => {
  window.__providerCalls=0;window.__submitCalls=0;
  const g=document.querySelector('[data-access-gateway]');
  MicroAccessGateway.init(g,{providers:{google:()=>{window.__providerCalls++;return undefined;}},onSubmit:()=>{window.__submitCalls++;return {authenticated:false,message:'لم يتم الدخول'};}});
  g.addEventListener('micro-access:submitted',e=>{window.__consumerResult=e.detail.result;g.querySelector('[data-access-status]').textContent='لم يتم الدخول — النتيجة من المستهلك';});
 }''')
 page.click('[data-access-provider="google"]');page.wait_for_timeout(120)
 results['checks']['provider']=page.evaluate("() => ({text:document.querySelector('[data-access-status]').textContent,calls:window.__providerCalls})")
 page.fill('#gateway-email','test@example.test');page.fill('#gateway-password','demo-pass-1');page.click('[type=submit]');page.wait_for_timeout(180)
 results['checks']['submit']=page.evaluate("() => ({text:document.querySelector('[data-access-status]').textContent,result:window.__consumerResult,calls:window.__submitCalls})")
 page.screenshot(path=str(OUT/'gateway-result.png'),full_page=True)
 # Same event repeated with another event in between.
 page.goto(base+'/previews/messages/');page.wait_for_load_state('networkidle')
 page.evaluate('''() => {MicroMessages.announce('تهيئة');window.__added=[];new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.textContent)window.__added.push(n.textContent)}))).observe(document.body,{childList:true,subtree:true});}''');page.wait_for_timeout(100)
 page.evaluate('window.__added=[]')
 for event in ['event-A','event-B','event-A']:
  page.evaluate("id=>MicroMessages.announce('نتيجة العملية',{id})",event);page.wait_for_timeout(120)
 results['checks']['announcement']=page.evaluate('() => ({added:window.__added,count:window.__added.length})')
 # disconnect -> init must restore observation without rebuilding controls.
 for kind in ['peek','carousel']:
  api='MicroInfoPeek' if kind=='peek' else 'MicroCarousel'
  vp='[data-info-strip-viewport]' if kind=='peek' else '[data-viewport]'
  slides='.m-info-strip__slide' if kind=='peek' else '[data-carousel-slide]'
  track='[data-info-strip-track]' if kind=='peek' else '[data-track]'
  html=(ROOT/f'reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent5/scripts/harness/h-{kind}.html').read_text().replace('../../../../../',base+'/')
  html=html.replace('<head>','<head><script>window.__roBuilt=0;const NativeRO=ResizeObserver;window.ResizeObserver=class extends NativeRO{constructor(cb){super(cb);window.__roBuilt++}}</script>')
  page.goto(base+'/');page.set_content(html,wait_until='networkidle')
  page.evaluate("() => {document.querySelector('section').classList.remove('hidden');document.querySelector('section').style.display='block';}");page.wait_for_timeout(180)
  rootselector='[data-info-peek]' if kind=='peek' else '[data-carousel]'
  page.evaluate(f'() => window.{api}.goTo(document.querySelector("{rootselector}"),1,{{animate:false}})');page.wait_for_timeout(100)
  def geo():return page.evaluate('''cfg=>{const v=document.querySelector(cfg.vp),s=document.querySelectorAll(cfg.slide)[1];const vr=v.getBoundingClientRect(),sr=s.getBoundingClientRect();return {observers:window.__roBuilt,width:vr.width,left:sr.left-vr.left,right:vr.right-sr.right,transform:getComputedStyle(document.querySelector(cfg.track)).transform};}''',{'vp':vp,'slide':slides,'track':track})
  initial=geo();page.evaluate(f'() => window.{api}.disconnect(document)');page.evaluate(f'() => window.{api}.init(document)')
  page.evaluate("() => document.querySelector('.host').style.width='360px'");page.wait_for_timeout(220)
  after=geo();page.screenshot(path=str(OUT/f'{kind}-after-reinit.png'),full_page=True)
  page.evaluate(f'() => window.{api}.goTo(document.querySelector("{rootselector}"),1,{{animate:false}})');page.wait_for_timeout(100)
  manual=geo()
  results['checks'][kind]={'initial':initial,'after_disconnect_init_resize':after,'manual_same_index':manual}
  page.screenshot(path=str(OUT/f'{kind}-manual-recenter.png'),full_page=True)
 browser.close()
srv.shutdown()
(OUT/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
