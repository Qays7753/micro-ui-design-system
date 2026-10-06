import json, os, threading, functools, subprocess, tempfile
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ.get('F03_REVIEW_ROOT',str(Path(__file__).resolve().parents[4])))
OUT=Path(os.environ.get('F03_REVIEW_OUTPUT',tempfile.mkdtemp(prefix='f03-review-r2-')))
OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/previews/ux-patterns/mobile-record-sample/'
results=[]
def fresh(b):
 c=b.new_context(viewport={'width':390,'height':844});p=c.new_page();p.goto(url);p.wait_for_function('window.F03App && window.F03Store');return c,p
def click(p,s):p.locator(s).click();p.wait_for_timeout(340)
def review_arm(p,k,o):
 click(p,'#f03-review-open');p.locator('#f03-rev-'+k+'-outcome').select_option(o);click(p,'#f03-review-close')
def edit(p):
 click(p,'#f03-home-all');click(p,"#f03-list-rows [data-id='it-01']");click(p,'#f03-detail-edit')
def choose(p):
 click(p,'#f03-cat-trigger');p.wait_for_timeout(750);click(p,".m-picker__option[data-value='cat-a']")
def result(id,d):
 results.append({'id':id,**d});print(id,json.dumps(d,ensure_ascii=False),flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(**({'executable_path':os.environ['F03_BROWSER']} if os.environ.get('F03_BROWSER') else {}),args=['--no-sandbox'])
 # Two choices within the category dimension.
 c,p=fresh(b);click(p,'#f03-home-all');click(p,'#f03-filter-btn')
 for k in ['cat-a','cat-b']:click(p,f"#f03-filter-cats label:has(input[data-filter-key='{k}'])")
 click(p,'[data-filter-apply]');d=p.evaluate("() => ({rows:document.querySelectorAll('#f03-list-rows .f03-row').length,text:document.querySelector('#f03-list-results').textContent,count:document.querySelector('#f03-filter-count').textContent})");p.screenshot(path=str(OUT/'01-two-categories.png'),full_page=True);result('two-categories',{'expected_rows':6,'actual':d});c.close()
 # External clear must also clear last applied panel state.
 c,p=fresh(b);click(p,'#f03-home-all');click(p,'#f03-filter-btn');click(p,"#f03-filter-cats label:has(input[data-filter-key='cat-a'])");click(p,'[data-filter-apply]');p.locator('#f03-search-input').fill('عنصر باء');click(p,'#f03-clear-filters');click(p,'#f03-filter-btn');d=p.evaluate("() => ({checked:[...document.querySelectorAll('#f03-filter-cats input:checked')].map(x=>x.dataset.filterKey),count:document.querySelector('#f03-filter-count').textContent, rows:document.querySelectorAll('#f03-list-rows .f03-row').length})");p.screenshot(path=str(OUT/'02-clear-reopen.png'),full_page=True);result('clear-reopen',{'expected_checked':[],'actual':d});c.close()
 # Confirming a formerly unknown save must commit original values once.
 for mode in ['edit','add']:
  c,p=fresh(b)
  if mode=='edit':edit(p)
  else:click(p,'#f03-home-add');choose(p)
  name='اختبار تأكيد '+mode;p.locator('#f03-name').fill(name);review_arm(p,'save','unknown');click(p,'#f03-save');p.wait_for_timeout(2100);review_arm(p,'check','saved');click(p,'#f03-check');p.wait_for_timeout(2100)
  d=p.evaluate("() => ({items:F03Store.all(),name:document.querySelector('#f03-read-name').textContent,note:document.querySelector('#f03-detail-note').textContent,calls:F03App.inspect().sim})")
  p.screenshot(path=str(OUT/f'03-unknown-{mode}-saved.png'),full_page=True)
  result('unknown-'+mode+'-saved',{'expected_name':name,'expected_count':10 if mode=='add' else 9,'actual':d});c.close()
 # Announcement mutation while the reviewer is still inside the modal.
 c,p=fresh(b);edit(p);p.locator('#f03-name').fill('حفظ أثناء المراجعة');review_arm(p,'save','saved');click(p,'#f03-save');click(p,'#f03-review-open')
 p.evaluate("""() => {window.noteWrites=[];new MutationObserver(()=>{let n=document.querySelector('#f03-detail-note');noteWrites.push({text:n.textContent,insideInert:!!n.closest('[inert]'),reviewHidden:document.querySelector('#f03-review-layer').hidden})}).observe(document.querySelector('#f03-detail-note'),{childList:true,subtree:true,characterData:true})}""")
 click(p,'#f03-rev-settle-save');p.wait_for_timeout(100);before=p.evaluate('noteWrites');click(p,'#f03-review-close');after=p.evaluate('noteWrites');result('announcement-inert',{'writes_while_open':before,'writes_after_close':after});c.close()
 # Storage becoming unavailable AFTER startup.
 c,p=fresh(b);edit(p);p.evaluate("() => {Storage.prototype.setItem=function(){throw new DOMException('injected write failure','QuotaExceededError')}}");p.locator('#f03-name').fill('حفظ الجلسة فقط');click(p,'#f03-save');p.wait_for_timeout(750);click(p,'#f03-review-open');d=p.evaluate("() => ({storage:F03Store.storageStatus(),label:document.querySelector('#f03-rev-storage').textContent,committed:F03Store.get('it-01').name})");p.screenshot(path=str(OUT/'05-storage-write-failed.png'),full_page=True);p.reload();p.wait_for_function('window.F03App');d['name_after_reload']=p.evaluate("F03Store.get('it-01').name");result('late-storage-failure',d);c.close()
 # Ordinary successful edit, addition, and reload controls.
 c,p=fresh(b);edit(p);p.locator('#f03-name').fill('نجاح عادي');click(p,'#f03-save');p.wait_for_timeout(750);p.reload();p.wait_for_function('window.F03App');result('default-edit-reload',{'actual':p.evaluate("F03Store.get('it-01').name"),'expected':'نجاح عادي'});c.close()
 # Ordinary addition creates one item and survives reload.
 c,p=fresh(b);click(p,'#f03-home-add');choose(p);p.locator('#f03-name').fill('إضافة عادية');click(p,'#f03-save');p.wait_for_timeout(750);p.reload();p.wait_for_function('window.F03App');result('default-add-reload',{'actual':p.evaluate("({count:F03Store.count(),created:F03Store.all().filter(x=>x.name==='إضافة عادية').length})"),'expected':{'count':10,'created':1}});c.close()
 b.close()
server.shutdown()
(OUT/'probes.json').write_text(json.dumps({'source_commit':subprocess.check_output(['git','-C',str(ROOT),'rev-parse','HEAD'],text=True).strip(),'results':results},ensure_ascii=False,indent=2)+'\n')
