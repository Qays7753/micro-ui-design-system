import os,json,threading,functools,re
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ['F02_REVIEW_ROOT']);OUT=Path(os.environ['F02_REVIEW_OUTPUT']);OUT.mkdir(exist_ok=True,parents=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
res=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ['F02_REVIEW_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage']);version=b.version
 for name in ['choice','filter','switch']:
  for width in [320,360,390,430]:
   p=b.new_page(viewport={'width':width,'height':844});p.goto(f'{base}/previews/ux-patterns/{name}-lifecycle/',wait_until='networkidle');p.evaluate('document.fonts.ready')
   if name=='choice':
    p.locator('#f02c-open-picker').click();p.evaluate("document.querySelector('#f02c-sim-settle-latest').click()")
   elif name=='filter':p.locator('#f02f-filter-btn').click()
   else:
    p.evaluate("const x=document.querySelector('#f02s-sim-update-outcome');x.value='unknown';x.dispatchEvent(new Event('change',{bubbles:true}));")
    p.locator('label:has(#f02s-switch-input)').click();p.evaluate("document.querySelector('#f02s-sim-settle-update').click()")
   p.wait_for_timeout(300)
   size=p.evaluate('''() => {const entries=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);entries.forEach(([e,n])=>e.style.fontSize=n*2+'px');return {h1:parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),label:parseFloat(getComputedStyle(document.querySelector('.m-choice__text,.m-switch__label,.f02f-row__label')).fontSize)}}''')
   p.wait_for_timeout(50)
   dims=p.evaluate('''() => {let r={viewport:innerWidth,doc:document.documentElement.scrollWidth,horizontalClips:[],controlOverflow:[]};const q=['.f02f-list','.m-layer__foot','.m-note','.m-switch','.m-picker__list'];for(const sel of q){for(const el of document.querySelectorAll(sel)){if(el.closest('[hidden]'))continue;const cs=getComputedStyle(el);const parent=el.getBoundingClientRect();if(['hidden','clip'].includes(cs.overflowX)){const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(walk.nextNode()){const n=walk.currentNode;if(!n.textContent.trim())continue;const rr=new Range();rr.selectNodeContents(n);for(const br of rr.getClientRects())if(br.left<parent.left-2||br.right>parent.right+2)r.horizontalClips.push({container:sel,text:n.textContent,rect:{left:br.left,right:br.right},parent:{left:parent.left,right:parent.right}})}}if(el.scrollWidth>el.clientWidth+2)r.controlOverflow.push({selector:sel,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth});}}return r;}''')
   res.append({'sample':name,'width':width,'font':size,'bounds':dims})
   if width==320:p.screenshot(path=str(OUT/(name+'-200-320.png')),full_page=True)
   p.close()
 b.close()
server.shutdown()
(OUT/'layout.json').write_text(json.dumps({'browser':version,'mechanism':'snapshot computed font sizes before doubling; data/states loaded before snapshot','results':res},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(res,ensure_ascii=False,indent=2))
