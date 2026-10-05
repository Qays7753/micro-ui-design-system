import os,json,subprocess,functools,http.server,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ['F02_REVIEW_ROOT']);OUT=Path(os.environ['F02_REVIEW_OUTPUT']);OUT.mkdir(parents=True,exist_ok=True)
s=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=s.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{s.server_port}'
res={'source_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'rows':[],'page_errors':[]}
def record(name,ok,data):res['rows'].append({'name':name,'status':'PASS' if ok else 'FAIL','measured':data})
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ['F02_REVIEW_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage']);res['browser']=b.version
 p=b.new_page(viewport={'width':390,'height':844});p.on('pageerror',lambda e:res['page_errors'].append(str(e)))
 p.goto(base+'/previews/ux-patterns/switch-lifecycle/',wait_until='networkidle')
 pre=p.evaluate('''() => {
  const get=()=>{const x=F02Switch.inspect();return {calls:x.updateCalls,checks:x.checkCalls,op:x.op,enabled:document.getElementById('f02s-switch-input').disabled,locked:document.querySelector('#f02s-locked-switch input').disabled,checked:document.getElementById('f02s-switch-input').checked};};
  const before=get();
  MicroSelection.setSwitchPending(document.getElementById('f02s-switch'),false);
  MicroSelection.setSwitchPending(document.getElementById('f02s-locked-switch'),false);
  return {before,after:get()};
 }''')
 record('false-before-first-pending-fresh-page',pre['before']==pre['after'] and pre['before']['calls']==0 and pre['before']['checks']==0 and pre['before']['enabled']==False and pre['before']['locked']==True,pre)
 p.close()
 for w in [320,360,390,430]:
  p=b.new_page(viewport={'width':w,'height':844});p.on('pageerror',lambda e:res['page_errors'].append(str(e)))
  p.goto(base+'/previews/ux-patterns/choice-lifecycle/',wait_until='networkidle');p.evaluate('() => document.fonts.ready')
  p.click('#f02c-open-picker');p.wait_for_timeout(300);p.evaluate('() => document.getElementById("f02c-sim-settle-latest").click()');p.wait_for_timeout(100)
  p.click('.m-picker__option[data-value="beta"]');p.wait_for_timeout(350)
  p.evaluate('() => F02Choice.setSource([{value:"alpha",label:"عينة أ"}])');p.click('#f02c-open-picker');p.wait_for_timeout(300)
  p.fill('#f02c-picker-search','zzz');p.evaluate('() => document.getElementById("f02c-sim-settle-latest").click()');p.wait_for_timeout(100)
  for scale in [100,200]:
   if scale==200:
    p.evaluate('''() => { const snap=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);snap.forEach(([e,px])=>{if(Number.isFinite(px))e.style.fontSize=2*px+'px';}); }''')
   p.locator('#f02c-drop-note').scroll_into_view_if_needed()
   data=p.evaluate('''() => {
    const n=document.getElementById('f02c-drop-note'),t=document.getElementById('f02c-drop-note-text'),l=document.getElementById('f02c-picker-layer'),cs=getComputedStyle(n),nr=n.getBoundingClientRect();
    const range=new Range();range.selectNodeContents(t);const lines=[...range.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom}));
    const txt=t.textContent;
    return {text:txt,visible:!n.hidden&&cs.display!=='none'&&nr.width>1&&nr.height>1,role:n.getAttribute('role'),inert:!!n.closest('[inert]'),clipPath:cs.clipPath,noteWidth:nr.width,noteHeight:nr.height,noteFont:parseFloat(getComputedStyle(t).fontSize),horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth+1,glyphsInside:lines.every(r=>r.left>=nr.left-1&&r.right<=nr.right+1&&r.top>=nr.top-1&&r.bottom<=nr.bottom+1),live:document.getElementById('f02c-picker-live').textContent,external:document.getElementById('f02c-selection-note').textContent,selected:F02Choice.inspect().selected,lines};
   }''')
   ok=data['visible'] and data['role']=='alert' and not data['inert'] and not data['horizontalOverflow'] and data['glyphsInside'] and 'لم يعد متاح' in data['text'] and 'لم يعد متاح' not in data['live'] and 'لا نتائج' in data['live'] and data['external']=='' and data['selected']==None
   record(f'drop-and-no-results-{w}-{scale}',ok,data)
   if w==320 and scale==200:p.screenshot(path=str(OUT/'drop-no-results-200-320.png'))
  p.click('[data-layer-close]');p.wait_for_timeout(350)
  cleared=p.evaluate('() => ({hidden:document.getElementById("f02c-drop-note").hidden,text:document.getElementById("f02c-drop-note-text").textContent})')
  record(f'drop-cleared-on-close-{w}',cleared['hidden'] and cleared['text']=='',cleared)
  p.close()
 b.close()
s.shutdown();res['passed']=sum(x['status']=='PASS' for x in res['rows']);res['total']=len(res['rows']);(OUT/'independent-check.json').write_text(json.dumps(res,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'passed':res['passed'],'total':res['total'],'errors':res['page_errors'],'failed':[x['name'] for x in res['rows'] if x['status']!='PASS']},ensure_ascii=False));raise SystemExit(0 if res['passed']==res['total'] and not res['page_errors'] else 1)
