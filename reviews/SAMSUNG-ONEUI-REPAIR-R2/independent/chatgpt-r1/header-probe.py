from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,json,subprocess,os
from playwright.sync_api import sync_playwright
O=Path('/tmp/micro-sui-r2-review/header');O.mkdir(exist_ok=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
ZOOM="""()=>{const a=[document.body,...document.body.querySelectorAll('*')];const v=a.map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);v.forEach(([e,n])=>e.style.fontSize=n*2+'px')}"""
MEASURE="""()=>{let t=document.querySelector('#f03-list-title'),a=document.querySelector('#f03-list-add'),back=document.querySelector('#f03-list-back');let r=document.createRange();r.selectNodeContents(t);let tr=r.getBoundingClientRect(),ar=a.getBoundingClientRect(),br=back.getBoundingClientRect();let pack=q=>({left:q.left,right:q.right,top:q.top,bottom:q.bottom,width:q.width});let area=q=>Math.max(0,Math.min(tr.right,q.right)-Math.max(tr.left,q.left))*Math.max(0,Math.min(tr.bottom,q.bottom)-Math.max(tr.top,q.top));return {titleText:t.textContent,titleBox:pack(t.getBoundingClientRect()),titleGlyphs:pack(tr),add:pack(ar),back:pack(br),overlapAdd:area(ar),overlapBack:area(br),docWidth:document.documentElement.clientWidth}}"""
out={'mechanism':'two-pass computed font x2; Chromium headless; not native zoom','cases':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-r2-browser/chromium'),headless=True,args=['--no-sandbox']);out['browser']=b.version
 for name,root in [('before',Path(os.environ.get('MICRO_REVIEW_BEFORE','/tmp/micro-sui-r2-before'))),('after',Path(os.environ.get('MICRO_REVIEW_ROOT',str(Path(__file__).resolve().parents[4]))))]:
  s=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(root)));threading.Thread(target=s.serve_forever,daemon=True).start()
  targets=[('src',f'http://127.0.0.1:{s.server_port}/previews/ux-patterns/mobile-record-sample/index.html'),('standalone',(root/'previews/ux-patterns/mobile-record-sample/standalone.html').as_uri())]
  for target,url in targets:
   for w in [320,360,390,430]:
    pg=b.new_page(viewport={'width':w,'height':844});pg.goto(url);pg.wait_for_load_state('networkidle');pg.click('[data-access-provider="demo"]');pg.wait_for_timeout(300);pg.click('#f03-nav-list');pg.wait_for_timeout(200);pg.evaluate(ZOOM);pg.wait_for_timeout(250);m=pg.evaluate(MEASURE)
    out['cases'].append({'source':name,'target':target,'width':w,'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),**m})
    if w in [320,390]:pg.screenshot(path=str(O/f'{name}-{target}-{w}-200.png'))
    pg.close()
  s.shutdown()
 b.close()
(O/'results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps([{k:d[k] for k in ['source','target','width','overlapAdd','overlapBack']} for d in out['cases']],indent=2))
