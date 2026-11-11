import sys,json,http.server,threading,traceback
from pathlib import Path
import os, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[4];OUT=Path(os.environ.get('MICRO_AUDIT_OUT', '/tmp/micro-final-review-focused'));OUT.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(ROOT/'tools'));from browser_support import chromium_launch_options
class H(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),H);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
checks=[];errors=[];axreports={}
def check(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),'detail':detail});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(**chromium_launch_options());version=b.version;p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',reduced_motion='reduce');p.set_default_timeout(5000)
 p.on('pageerror',lambda e:errors.append(str(e)))
 def load(path='previews/ui-system-showcase/index.html#component-review'):
  p.goto(base+'/'+path);p.evaluate('document.fonts.ready');p.wait_for_timeout(60)
 def family(f):p.select_option('#sc-review-family',f);p.wait_for_timeout(50)
 def test(name,fn):
  try:
   load();fn()
  except Exception as e:check(name+' execution',False,{'exception':str(e),'trace':traceback.format_exc()[-1000:]})
  finally:
   p.evaluate("document.querySelectorAll('.m-layer:not([hidden])').forEach(e=>{if(window.MicroNavigation)MicroNavigation.closeLayer(e)})")
 def snap(name):p.screenshot(path=str(OUT/(name+'.png')))
 def ax(sel):
  c=p.context.new_cdp_session(p);doc=c.send('DOM.getDocument');node=c.send('DOM.querySelector',{'nodeId':doc['root']['nodeId'],'selector':sel})['nodeId'];r=c.send('Accessibility.queryAXTree',{'nodeId':node})['nodes'];c.detach();return r
 load()
 roles={'button','link','checkbox','radio','switch','textbox','searchbox','combobox','tab','option','slider','spinbutton'}
 for f in json.loads((ROOT/'docs/COMPONENT-CATALOG.json').read_text())['families']:
  family(f['id']);nodes=[]
  for sel in p.locator('.sc-section:not([hidden])').evaluate_all('es=>es.map(e=>"#"+e.id)'):nodes+=ax(sel)
  controls=[{'role':n.get('role',{}).get('value'),'name':n.get('name',{}).get('value',''),'properties':n.get('properties',[])} for n in nodes if not n.get('ignored') and n.get('role',{}).get('value') in roles]
  axreports[f['id']]=controls;check(f['id']+': exposed controls have accessible names',all(c['name'].strip() for c in controls),{'controls':len(controls),'unnamed':[c for c in controls if not c['name'].strip()]})
 def fields():
  family('fields');q=p.locator('#sc-f-qty');q.fill('99');p.evaluate("MicroFields.sync(document.getElementById('sc-field-qty'))");p.locator('#sc-field-qty [data-step=up]').focus();p.keyboard.press('Enter');check('quantity: upper bound remains 99',q.input_value()=='99')
  q.fill('0');p.locator('#sc-field-qty [data-step=down]').focus();p.keyboard.press('Enter');check('quantity: lower bound remains zero',q.input_value()=='0')
  ro=p.locator('#sc-f-ro');ro.focus();p.keyboard.press('Control+a');p.keyboard.type('CHANGED');check('readonly: keyboard cannot edit and value can be selected',ro.input_value()=='ORD-2026-001')
  search=p.locator('#sc-f-search');search.fill('اسم');p.locator('#sc-field-search .m-field__clear').focus();p.keyboard.press('Enter');check('search: keyboard clears and restores input focus',search.input_value()=='' and search.evaluate('e=>e===document.activeElement'))
  p.evaluate("window.syncEvents=0;document.getElementById('sc-f-name').addEventListener('input',()=>syncEvents++);document.getElementById('sc-f-name').value='قيمة جديدة';MicroFields.sync(document.getElementById('sc-fields'))")
  check('fields sync: no fake user edit events',p.evaluate('syncEvents===0'))
 test('fields',fields)
 def selection():
  family('selection');seg='#sc-selection [data-seg]';first=p.locator(seg).first;items=first.locator('button');items.nth(2).focus();p.keyboard.press('ArrowLeft');check('segmented: RTL ArrowLeft skips aria-disabled option',items.first.get_attribute('aria-pressed')=='true' and items.first.evaluate('e=>e===document.activeElement'))
  disabled=items.last;p.evaluate("window.segmentEvents=0;document.querySelector('#sc-selection [data-seg]').addEventListener('micro-selection:segment',()=>segmentEvents++)");disabled.focus();p.keyboard.press('Enter');p.keyboard.press('Space');check('segmented: disabled does not activate with Enter/Space',p.evaluate('segmentEvents===0') and disabled.get_attribute('aria-pressed')=='false')
  sw=p.locator('#sc-switch-input');before=sw.is_checked();p.evaluate("MicroSelection.setSwitchPending(document.getElementById('sc-switch-pending-demo'),true)");check('switch: pending exposes busy+disabled and preserves value',sw.is_disabled() and sw.get_attribute('aria-busy')=='true' and sw.is_checked()==before);p.evaluate("MicroSelection.setSwitchPending(document.getElementById('sc-switch-pending-demo'),false)");check('switch: completion restores enabled state',not sw.is_disabled());sw.focus();p.keyboard.press('Space');check('switch: keyboard changes actual checked state',sw.is_checked()!=before)
  p.locator('#sc-picker-trigger').click();pick='#sc-picker';opts=p.locator(pick+' .m-picker__option');opts.first.focus();p.keyboard.press('End');check('picker: End focuses last enabled option',opts.last.evaluate('e=>e===document.activeElement'));p.keyboard.press('Enter');selected=p.evaluate("MicroPicker.getSelected(document.getElementById('sc-picker'))");check('picker: Enter selection matches exposed selected state',selected is not None and p.locator(pick+' [aria-selected=true]').count()==1)
  p.evaluate("window.pickerChanges=[];document.getElementById('sc-picker').addEventListener('micro-picker:change',e=>pickerChanges.push(e.detail));MicroPicker.setOptions(document.getElementById('sc-picker'),[{value:'replacement',label:'خيار جديد'}])");check('picker: removed selection clears value and summary with one event',p.evaluate("MicroPicker.getSelected(document.getElementById('sc-picker'))===null&&pickerChanges.length===1&&pickerChanges[0].value===null") and 'لا شيء' in p.locator(pick+' [data-picker-summary]').inner_text())
  p.locator(pick+' .m-picker__option').focus();p.evaluate("MicroPicker.setStatus(document.getElementById('sc-picker'),'loading')");check('picker: loading moves focus before hiding options',p.locator(pick+' [data-picker-list]').get_attribute('aria-busy')=='true' and p.locator(pick+' [data-picker-search]').evaluate('e=>e===document.activeElement'))
  p.evaluate("window.retries=0;document.getElementById('sc-picker').addEventListener('micro-picker:retry',()=>retries++);MicroPicker.setStatus(document.getElementById('sc-picker'),'error')");retry=p.locator(pick+' [data-picker-retry]');retry.focus();p.keyboard.press('Enter');check('picker: retry emits once and does not load invented data',p.evaluate('retries===1') and retry.is_visible());p.evaluate("MicroPicker.setStatus(document.getElementById('sc-picker'),'disabled')");check('picker: disabled hides options/retry and exposes state',not retry.is_visible() and p.locator(pick+' [data-picker-list]').get_attribute('aria-disabled')=='true');snap('picker-disabled');p.keyboard.press('Escape');check('picker: Escape restores opener',p.locator('#sc-picker-trigger').evaluate('e=>e===document.activeElement'))
 test('selection',selection)
 def navigation():
  family('navigation');p.locator('#sc-sheet-trigger').focus();p.keyboard.press('Enter');layer=p.locator('#sc-sheet-layer');check('layer: keyboard open names modal and contains focus',layer.is_visible() and layer.get_attribute('aria-modal')=='true' and layer.evaluate('e=>e.contains(document.activeElement)'))
  stayed=True;trace=[]
  p.wait_for_timeout(80)
  for key in ['Tab']*8+['Shift+Tab']*8:
   p.keyboard.press(key);inside=layer.evaluate('e=>e.contains(document.activeElement)');stayed=stayed and inside;trace.append({'key':key,'inside':inside,'active':p.evaluate('document.activeElement.outerHTML.slice(0,200)')})
  check('layer: Tab and reverse Tab remain inside modal',stayed,trace)
  axnames=ax('#sc-sheet-layer');check('layer: AX tree exposes named dialog',any(n.get('role',{}).get('value')=='dialog' and n.get('name',{}).get('value') for n in axnames));snap('sheet-keyboard-focus');p.keyboard.press('Escape');check('layer: close restores opener focus and scroll lock',p.locator('#sc-sheet-trigger').evaluate("e=>e===document.activeElement&&!e.closest('[inert]')") and p.evaluate("document.body.style.overflow!=='hidden'"))
  tabs=p.locator('#sc-tabs [role=tab]');tabs.first.focus();p.keyboard.press('ArrowLeft');check('tabs: RTL next selects and reveals matching panel',tabs.nth(1).get_attribute('aria-selected')=='true' and p.locator('#sc-tab-b').is_visible());p.keyboard.press('Tab');check('tabs: Tab reaches content panel, no skipped content',p.locator('#sc-tab-b').evaluate('e=>e===document.activeElement||e.contains(document.activeElement)'))
  load('previews/navigation/index.html');p.locator('#filter-trigger').click();p.locator('#f-search').fill('بحث محلي');p.locator('#filter-panel .m-choice').first.tap();p.locator('#filter-panel [data-filter-apply]').click();check('filters: applied search + checkbox update count',p.locator('#filter-trigger [data-filter-count]').inner_text()=='2');p.locator('#filter-trigger').click();p.locator('#f-search').fill('تغيير ملغى');p.locator('#filter-panel [data-filter-cancel]').click();p.locator('#filter-trigger').click();check('filters: cancel restores applied search',p.locator('#f-search').input_value()=='بحث محلي');p.locator('#filter-panel [data-filter-clear]').click();p.locator('#filter-panel [data-filter-apply]').click();check('filters: clear+apply hide zero count',not p.locator('#filter-trigger [data-filter-count]').is_visible())
  p.locator('[data-layer-open=dialog-delete]').click();p.locator('[data-for=dialog-delete]').tap(position={'x':5,'y':5});check('destructive dialog: backdrop tap respects keep policy',p.locator('#dialog-delete').is_visible());p.keyboard.press('Escape');check('destructive dialog: Escape remains available',not p.locator('#dialog-delete').is_visible());load()
 test('navigation',navigation)
 def organization():
  family('organization');head=p.locator('#sc-organization .m-section__head');head.focus();p.keyboard.press('Space');check('organization: Space opens real disclosure and aria-expanded',head.get_attribute('aria-expanded')=='true' and p.locator('#sc-org-body').is_visible());p.keyboard.press('Enter');check('organization: Enter closes without losing focus',not p.locator('#sc-org-body').is_visible() and head.evaluate('e=>e===document.activeElement'))
 test('organization',organization)
 def data():
  for f,sel in [('data','#sc-chart-donut'),('data','#sc-chart-bubbles'),('data','#sc-review-packed'),('metric-comparison','#sc-main-metric'),('metric-comparison','[data-review-variant=metric-circles]')]:
   family(f);root=p.locator(sel);button=root.locator('button[aria-expanded]').first;button.focus();p.keyboard.press('Enter');target=button.get_attribute('aria-controls');table=root.locator('table');check(sel+': keyboard disclosure names and opens real table',button.get_attribute('aria-expanded')=='true' and table.is_visible() and table.get_attribute('id')==target);p.keyboard.press('Space');check(sel+': Space closes table and keeps focus',not table.is_visible() and button.evaluate('e=>e===document.activeElement'))
 test('data',data)
 def account():
  family('account-settings');opener=p.locator('#sc-account-root [data-account-open]');opener.focus();p.keyboard.press('Enter');p.locator('#sc-account-root [data-account-to-application]').focus();p.keyboard.press('Enter');check('settings: keyboard reaches application view and visible title',p.locator('#sc-account-root [data-account-title=application]').is_visible());sw=p.locator('#sc-account-root [data-account-view=application] input[type=checkbox]').first;before=sw.is_checked();sw.focus();p.keyboard.press('Space');check('settings: native switch state changes by keyboard',sw.is_checked()!=before);p.keyboard.press('Escape');check('settings: Escape restores account opener',opener.evaluate('e=>e===document.activeElement'))
 test('account',account)
 def gateway():
  family('access-gateway');root='#sc-gateway-root';p.locator(root+' button[type=submit]').focus();p.keyboard.press('Enter');email=p.locator('#sc-gw-email');check('gateway: invalid submit focuses and describes first invalid input',email.evaluate("e=>e===document.activeElement&&e.getAttribute('aria-invalid')==='true'&&!!e.getAttribute('aria-describedby')"));email.fill('example@example.test');pwd=p.locator('#sc-gw-password');pwd.fill('123456789');reveal=p.locator(root+' [data-access-reveal]');name=reveal.get_attribute('aria-label');reveal.focus();p.keyboard.press('Space');check('gateway: keyboard reveal retains focus, fixed name and pressed state',pwd.get_attribute('type')=='text' and reveal.get_attribute('aria-pressed')=='true' and reveal.get_attribute('aria-label')==name and reveal.evaluate('e=>e===document.activeElement'))
  p.evaluate("window.gateCalls=0;window.gateEvent=null;const g=document.getElementById('sc-gateway-root');g.addEventListener('micro-access:submitted',e=>gateEvent=e.detail);MicroAccessGateway.init(g,{onSubmit:()=>{gateCalls++;return new Promise(resolve=>window.finishGate=resolve)}})");submit=p.locator(root+' button[type=submit]');submit.click();p.keyboard.press('Enter');p.evaluate("document.querySelector('#sc-gateway-root button[type=submit]').click()");check('gateway: busy blocks duplicate submit',p.evaluate('gateCalls===1') and submit.get_attribute('aria-busy')=='true');p.evaluate("finishGate({message:'نتيجة يملكها المستهلك'})");p.wait_for_timeout(40);check('gateway: result text is exact and event omits credentials',p.locator(root+' [data-access-status]').inner_text()=='نتيجة يملكها المستهلك' and p.evaluate("!('email' in gateEvent)&&!('password' in gateEvent)&&!!gateEvent.result"));p.evaluate("MicroAccessGateway.init(document.getElementById('sc-gateway-root'),{onSubmit:()=>undefined})");submit.click();p.wait_for_timeout(30);check('gateway: undefined result never claims successful authentication','دون نتيجة مؤكدة' in p.locator(root+' [data-access-status]').inner_text())
 test('gateway',gateway)
 def carousel():
  family('carousel');root=p.locator('#sc-carousel-root');root.focus();p.keyboard.press('ArrowLeft');check('carousel: RTL ArrowLeft advances one position','2' in root.locator('[data-status]').inner_text());p.keyboard.press('Home');expand=root.locator('[data-card-expand]').first;expand.focus();p.keyboard.press('Enter');check('carousel: expansion exposes details with aria-expanded',expand.get_attribute('aria-expanded')=='true' and root.locator('[data-card-details]').first.is_visible());root.focus();p.keyboard.press('End');check('carousel: End collapses previous details and inactive slides are inert',not root.locator('[data-card-details]').first.is_visible() and root.locator('[data-carousel-slide]').first.evaluate('e=>e.inert'))
 test('carousel',carousel)
 def picker_clone():
  load();family('selection');p.evaluate("""()=>{let original=document.getElementById('sc-picker');MicroPicker.setOptions(original,[{value:'a',label:'أول'},{value:'b',label:'ثان'}]);let c=original.cloneNode(true);c.id='phase3-picker-clone';c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));document.body.append(c);window.cloneEvents=0;c.addEventListener('micro-picker:change',()=>cloneEvents++);MicroPicker.init(c);MicroPicker.init(c)}""")
  p.locator('#phase3-picker-clone .m-picker__option').last.click();state=p.evaluate("({events:cloneEvents,value:MicroPicker.getSelected(document.getElementById('phase3-picker-clone')),bound:document.getElementById('phase3-picker-clone').hasAttribute('data-micro-picker-bound')})");check('picker: initialized clone owns working listeners exactly once',state['events']==1 and state['value'] and state['value']['value']=='b',state);snap('picker-clone');p.evaluate("MicroPicker.disconnect(document.getElementById('phase3-picker-clone'));document.getElementById('phase3-picker-clone').remove()")
 test('picker clone',picker_clone)
 check('runtime: no uncaught JavaScript errors',not errors,errors);b.close()
server.shutdown();server.server_close();report={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'browser':version,'scope':'Light,360x780 RTL; emulated keyboard and touch; not a screen reader test','passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks,'ax':axreports,'errors':errors};(OUT/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({k:report[k] for k in ['passed','failed']},ensure_ascii=False))

raise SystemExit(1 if report["failed"] else 0)
