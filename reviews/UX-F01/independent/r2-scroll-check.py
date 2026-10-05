import argparse,functools,http.server,json,threading,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[3];out=Path(__file__).resolve().parent
opts=argparse.ArgumentParser();opts.add_argument('--browser',help='Optional Chromium executable');opts=opts.parse_args()
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(r)));threading.Thread(target=srv.serve_forever,daemon=True).start()
result={}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=opts.browser,args=['--no-sandbox','--disable-dev-shm-usage'])
 p=b.new_page(viewport={'width':320,'height':844});p.goto(f'http://127.0.0.1:{srv.server_port}/previews/ux-patterns/form-lifecycle/');p.wait_for_load_state('networkidle');p.click('#f01-edit-btn');p.fill('#f01-note','اختبار تمرير الحوار');p.click('#f01-back')
 p.wait_for_function("getComputedStyle(document.getElementById('f01-leave-dialog')).opacity==='1'")
 p.evaluate("() => {const pairs=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);pairs.forEach(([e,z])=>e.style.fontSize=z*2+'px');}")
 body=p.locator('#f01-leave-dialog .m-layer__body')
 result['before']=body.evaluate('(e)=>({scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,scrollTop:e.scrollTop})')
 body.hover();p.mouse.wheel(0,500);p.wait_for_function("document.querySelector('#f01-leave-dialog .m-layer__body').scrollTop>0")
 result['after']=body.evaluate('''(e)=>{const r=e.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(e.querySelector('p'));const rects=[...range.getClientRects()];const last=rects[rects.length-1];return {scrollTop:e.scrollTop,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,lastTextRectInside:last.top>=r.top-1&&last.bottom<=r.bottom+1};}''')
 p.screenshot(path=str(out/'r2-dialog-zoom-320-bottom.png'))
 result['pass']=result['after']['lastTextRectInside'];b.close()
srv.shutdown();(out/'r2-scroll-check.json').write_text(json.dumps(result,indent=2));print(result)
