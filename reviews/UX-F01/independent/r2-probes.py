import argparse,functools,http.server,json,threading,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[3]
opts=argparse.ArgumentParser();opts.add_argument('--browser',help='Optional Chromium executable');opts=opts.parse_args()
OUT=Path(__file__).resolve().parent;OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
s=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=s.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{s.server_port}/previews/ux-patterns/form-lifecycle/'
res={}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=opts.browser,args=['--no-sandbox','--disable-dev-shm-usage'])
 res['engine']=b.version
 p=b.new_page(viewport={'width':390,'height':844})
 errors=[];bad=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('response',lambda r:bad.append({'status':r.status,'url':r.url.replace(url,'')}) if r.status>=400 else None)
 def load():
  p.goto(url);p.wait_for_load_state('networkidle');p.evaluate('document.fonts.ready');p.click('#f01-edit-btn')
 def state():return p.evaluate('F01Example.inspect()')
 def arm(kind,outcome):p.select_option(f'#f01-sim-{kind}-outcome',outcome)
 def settle(kind):p.evaluate('(kind)=>document.getElementById("f01-sim-settle-"+kind).click()',kind)
 def visual():return p.evaluate('''() => {const a=document.getElementById('f01-check'),r=a.getBoundingClientRect();return {hidden:a.hidden,display:getComputedStyle(a).display,width:r.width,height:r.height,focused:document.activeElement.id||document.activeElement.tagName,tabIndex:a.tabIndex};}''')
 load();res['initial_check_visibility']=visual();p.screenshot(path=str(OUT/'r2-initial-edit-390.png'),full_page=True)
 # natural focus on check before async result (neutral completion)
 for outcome in ['saved','not-saved']:
  load();p.fill('#f01-name','تحقق');arm('save','unknown');p.click('#f01-save');settle('save');p.wait_for_function("F01Example.inspect().op==='unknown'")
  arm('check',outcome);p.click('#f01-check');res['focus_check_'+outcome+'_before']=visual();settle('check');p.wait_for_function("F01Example.inspect().op==='"+('saved' if outcome=='saved' else 'failed')+"'")
  res['focus_check_'+outcome+'_after']=visual();res['check_'+outcome+'_state']=state()
 # old response recovery exposed by provided panel
 load();p.fill('#f01-name','رد قديم');p.click('#f01-save');p.evaluate("document.getElementById('f01-sim-stale-save').click()")
 p.wait_for_function('F01Example.inspect().staleIgnored===1')
 res['stale_save_state']=state();res['stale_save_finish_disabled']=p.locator('#f01-sim-settle-save').is_disabled()
 settle('save');p.wait_for_function("F01Example.inspect().op==='saved'");res['stale_save_completed']=state()
 # failed modified / revert display
 load();p.fill('#f01-name','محاولة');arm('save','not-saved');p.click('#f01-save');settle('save');p.wait_for_function("F01Example.inspect().op==='failed'")
 p.fill('#f01-name','عينة');res['failed_reverted']=state()
 # clean message then edits / invalid + old status
 load();p.click('#f01-save');p.fill('#f01-name','تعديل');res['clean_message_after_edit']=state()
 p.fill('#f01-name','');p.click('#f01-save');res['invalid_with_old_clean_message']=state()
 # initializer editable contract: replace JS constant response only
 p.route('**/example.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=(ROOT/'previews/ux-patterns/form-lifecycle/example.js').read_text().replace("var CONFIRMED_INIT = { name: 'عينة', note: '' };","var CONFIRMED_INIT = { name: 'اسم جديد', note: 'ملاحظة جديدة' };")))
 load();res['edited_initial_constant']=state();p.unroute('**/example.js')
 # modal bounds at all widths, zoom fresh once per case
 for w in [320,360,390,430]:
  p.set_viewport_size({'width':w,'height':844});load();p.fill('#f01-note','تعديل');p.click('#f01-back');p.wait_for_timeout(300)
  res[f'modal_{w}']=p.evaluate('''() => {const e=document.getElementById('f01-leave-dialog'),r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:innerWidth,h:innerHeight,scrollW:e.scrollWidth,clientW:e.clientWidth};}''')
  p.evaluate("() => {const pairs=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);pairs.forEach(([e,z])=>e.style.fontSize=z*2+'px');}")
  res[f'modal_zoom_{w}']=p.evaluate('''() => {const e=document.getElementById('f01-leave-dialog'),r=e.getBoundingClientRect();const buttons=[...e.querySelectorAll('button')].map(b=>{const z=b.getBoundingClientRect();return {id:b.id,top:z.top,bottom:z.bottom,left:z.left,right:z.right};});return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:innerWidth,h:innerHeight,scrollH:e.scrollHeight,clientH:e.clientHeight,buttons};}''')
  p.screenshot(path=str(OUT/f'dialog-zoom-{w}.png'))
 res['js_errors']=errors;res['failed_assets']=bad
 b.close()
s.shutdown();(OUT/'r2-probes.json').write_text(json.dumps(res,ensure_ascii=False,indent=2));print(json.dumps(res,ensure_ascii=False,indent=2))
