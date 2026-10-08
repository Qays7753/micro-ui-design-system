import os
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,json,os
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ.get('MICRO_REVIEW_ROOT',str(Path(__file__).resolve().parents[4])));OUT=Path(os.environ.get('MICRO_REVIEW_OUT','/tmp/micro-repair-review/visual'));OUT.mkdir(parents=True,exist_ok=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{srv.server_port}'
ZOOM="""() => {const orig=[document.body,...document.body.querySelectorAll('*')].map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]);orig.forEach(([el,fs])=>el.style.fontSize=(fs*2)+'px')}"""
d={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-review-chromium'),headless=True,args=['--no-sandbox']);pg=b.new_page(viewport={'width':320,'height':850})
 pg.goto(base+'/previews/fields/');pg.wait_for_load_state('networkidle');pg.evaluate('document.fonts.ready');pg.fill('#p-amount-320','123456789012345');pg.evaluate(ZOOM);pg.wait_for_timeout(200)
 pg.locator('#p-amount-320').scroll_into_view_if_needed();pg.evaluate('document.activeElement.blur()');
 d['amount']=pg.locator('#p-amount-320').evaluate("el=>({value:el.value,client:el.clientWidth,scroll:el.scrollWidth,font:getComputedStyle(el).fontSize})")
 pg.locator('#p-amount-320').locator('xpath=ancestor::*[contains(@class,"m-field")][last()]').screenshot(path=str(OUT/'amount15-field.png'))
 pg.goto(base+'/previews/ux-patterns/mobile-record-sample/');pg.wait_for_load_state('networkidle');pg.click('#f03-gw-demo');pg.wait_for_timeout(250);pg.evaluate('document.fonts.ready');pg.evaluate(ZOOM);pg.wait_for_timeout(250)
 d['nav']=pg.locator('#f03-navbar .m-navbar__item').evaluate_all("""els=>els.map(el=>{const r=el.getBoundingClientRect();const text=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());const runs=text.map(n=>{const range=document.createRange();range.selectNodeContents(n);const q=range.getBoundingClientRect();return {text:n.textContent.trim(),left:q.left,right:q.right,width:q.width}});const spans=[...el.querySelectorAll('span')].filter(s=>s.textContent.trim()).map(s=>{const range=document.createRange();range.selectNodeContents(s);const q=range.getBoundingClientRect();return {text:s.textContent.trim(),left:q.left,right:q.right,width:q.width}});return {text:el.textContent.trim(),buttonLeft:r.left,buttonRight:r.right,runs,spans}})""")
 pg.screenshot(path=str(OUT/'navbar-320-text200.png'))
 pg.goto((ROOT/'previews/ux-patterns/mobile-record-sample/standalone.html').as_uri());pg.wait_for_load_state('networkidle');pg.click('#f03-gw-demo');pg.wait_for_timeout(250);pg.evaluate('document.fonts.ready');pg.evaluate(ZOOM);pg.wait_for_timeout(250)
 d['standalone_nav']=pg.locator('#f03-navbar .m-navbar__item').evaluate_all("els=>els.map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent.trim(),left:r.left,right:r.right}})")
 pg.screenshot(path=str(OUT/'standalone-navbar-320-text200.png'));b.close()
srv.shutdown();(OUT/'results.json').write_text(json.dumps(d,ensure_ascii=False,indent=2));print(json.dumps(d,ensure_ascii=False,indent=2))
