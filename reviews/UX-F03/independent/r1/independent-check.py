import os,json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ['F03_REVIEW_ROOT']);OUT=Path(os.environ['F03_REVIEW_OUT']);OUT.mkdir(parents=True,exist_ok=True)
result={'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'page_errors':[]}
def rec(name,ok,measured):
 result['checks'].append({'name':name,'status':'PASS' if ok else 'FAIL','measured':measured})
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ['F03_REVIEW_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage']);result['browser']=b.version
 p=b.new_page(viewport={'width':390,'height':844})
 p.on('pageerror',lambda e:result['page_errors'].append(str(e)))
 url=(ROOT/'previews/ux-patterns/mobile-record-sample/standalone.html').as_uri()
 def fresh():
  p.goto(url);p.wait_for_function('!!window.F03Example');p.evaluate('() => document.fonts.ready')
 def edit():
  p.click('#f03-edit-btn');p.wait_for_function('document.activeElement.id==="f03-name"');p.wait_for_timeout(300)
 def close_picker():
  p.click('#f03-cat-layer-close');p.wait_for_function('document.getElementById("f03-cat-layer").hidden')
 def insp():return p.evaluate('F03Example.inspect()')
 fresh()
 ui=p.evaluate('''() => {const h=document.querySelector('.f03-head'),s=document.getElementById('f03-sim');return {heading:h.innerText,simulationVisible:getComputedStyle(s).display!=='none'&&s.getBoundingClientRect().height>0,bodyText:document.body.innerText};}''')
 rec('default-phone-view-no-technical-report',not ui['simulationVisible'] and 'DRAFT FOR REVIEW' not in ui['bodyText'] and 'IBM Plex' not in ui['bodyText'],ui)
 p.screenshot(path=str(OUT/'default-phone-390.png'),full_page=True)
 edit()
 icon=p.evaluate('''() => {const e=document.querySelector('.f03-cat__chevron use'),s=document.getElementById('i-chevron-down');return {computedFill:getComputedStyle(e).fill,symbolFill:s.getAttribute('fill'),assetRequiresFillNone:true};}''')
 rec('hugeicons-chevron-unfilled',icon['computedFill']=='none',icon)
 p.screenshot(path=str(OUT/'edit-phone-390.png'))
 # Copy-on-read must be fixed when the read starts, not at resolution.
 fresh()
 snapshot=p.evaluate('''async () => {const c=F03Sim.createConnector({categories:[{value:'a',label:'before'}]});c.setNextRead('ready');const promise=c.readCategories({readId:1});c.setSource([{value:'b',label:'after'}]);c.settle('read');return await promise;}''')
 rec('read-snapshot-at-invocation',snapshot['items']==[{'value':'a','label':'before'}],snapshot)
 # Timer associated with request 1 must not resolve request 2.
 timer=p.evaluate('''async () => {const c=F03Sim.createConnector({categories:[{value:'a',label:'A'}]});let first=null,second=null;const one=c.readCategories({readId:1}).then(r=>{first=r;});await new Promise(r=>setTimeout(r,80));c.setNextRead('error');c.readCategories({readId:2}).then(r=>{second=r;});await new Promise(r=>setTimeout(r,760));return {first,second,readout:c.readout(),firstSettled:c.calls[0].settled,secondSettled:c.calls[1].settled};}''')
 rec('timer-resolves-own-request-only',timer['firstSettled'] and not timer['secondSettled'] and timer['second'] is None,timer)
 # Closing a picker/session must invalidate responses belonging to it.
 fresh();edit();p.evaluate('F03Example.arm("read","empty")');p.click('#f03-cat-trigger');p.wait_for_timeout(300);close_picker()
 p.click('#f03-back');p.wait_for_function('document.getElementById("f03-edit-sheet").hidden');edit()
 before=insp();p.evaluate('F03Example.settle("read")');p.wait_for_timeout(100);after=insp()
 rec('closed-picker-response-does-not-mutate-new-edit',before['draftCategory']==after['draftCategory'] and after['dirty']==False,{'before':before,'after':after})
 # Core note visibility does not imply live notification: check mutation timing.
 fresh();edit();p.fill('#f03-name','تعديل واحد');p.evaluate('''() => {window.noteWrites=[];const n=document.getElementById('f03-view-note');new MutationObserver(()=>noteWrites.push({text:n.innerText,hidden:n.hidden,inertAncestor:!!n.closest('[inert]'),sheetHidden:document.getElementById('f03-edit-sheet').hidden})).observe(n,{subtree:true,childList:true,characterData:true,attributes:true});}''');p.click('#f03-save');p.wait_for_function('document.getElementById("f03-edit-sheet").hidden');p.wait_for_timeout(80)
 writes=p.evaluate('noteWrites');rec('success-live-note-updated-after-background-activation',any(x['text'] and not x['inertAncestor'] and x['sheetHidden'] for x in writes),writes)
 rec('default-save-updates-record',insp()['confirmed']['name']=='تعديل واحد' and insp()['dirty']==False,{'op':insp()['op'],'record':insp()['confirmed'],'viewNote':insp()['viewNote']})
 # Reviewer UI must not require a developer console to end armed requests.
 fresh();p.select_option('#f03-sim-save-outcome','not-saved');edit();p.fill('#f03-name','تعديل معلّق');p.click('#f03-save');p.wait_for_timeout(900)
 blocked=p.evaluate('''() => {const e=document.getElementById('f03-sim-settle-save');return {op:F03Example.inspect().op,pending:F03Example.inspect().sim.pendingSave,buttonDisabled:e.disabled,buttonInertAncestor:!!e.closest('[inert]'),sheetVisible:!document.getElementById('f03-edit-sheet').hidden};}''')
 rec('manual-simulation-can-settle-armed-save',not blocked['buttonInertAncestor'] and not blocked['buttonDisabled'],blocked)
 p.screenshot(path=str(OUT/'manual-simulation-blocked.png'))
 # Four widths, real before/after glyph bounds, unknown introduces a third footer action.
 for width in [320,360,390,430]:
  fresh();p.set_viewport_size({'width':width,'height':844});edit();p.fill('#f03-note','نص تجريبي');p.evaluate('F03Example.arm("save","unknown")');p.click('#f03-save');p.evaluate('F03Example.settle("save")');p.wait_for_timeout(80)
  for scale in [100,200]:
   if scale==200:
    p.evaluate('''() => {const s=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);s.forEach(([e,z])=>e.style.fontSize=(z*2)+'px');}''')
   data=p.evaluate('''() => {const layer=document.getElementById('f03-edit-sheet'),body=layer.querySelector('.m-layer__body'),foot=layer.querySelector('.m-layer__foot');const fr=foot.getBoundingClientRect(),lr=layer.getBoundingClientRect();return {width:innerWidth,height:innerHeight,docOverflow:document.documentElement.scrollWidth>innerWidth+1,layerTop:lr.top,footTop:fr.top,footBottom:fr.bottom,bodyHeight:body.clientHeight,actions:[...foot.querySelectorAll('button')].filter(e=>!e.hidden).map(e=>{const r=e.getBoundingClientRect(),rr=new Range();rr.selectNodeContents(e);return {id:e.id,font:getComputedStyle(e).fontSize,w:r.width,h:r.height,top:r.top,bottom:r.bottom,left:r.left,right:r.right,glyphs:[...rr.getClientRects()].map(g=>({left:g.left,right:g.right,top:g.top,bottom:g.bottom}))};})};}''')
   ok=not data['docOverflow'] and data['bodyHeight']>0 and all(a['top']>=-1 and a['bottom']<=845 and a['left']>=-1 and a['right']<=width+1 and all(g['left']>=a['left']-1 and g['right']<=a['right']+1 and g['top']>=a['top']-1 and g['bottom']<=a['bottom']+1 for g in a['glyphs']) for a in data['actions'])
   rec(f'unknown-footer-bounds-{width}-{scale}',ok,data)
   if width==320 and scale==200:p.screenshot(path=str(OUT/'unknown-200-320.png'))
 b.close()
result['summary']={'passed':sum(r['status']=='PASS' for r in result['checks']),'total':len(result['checks']),'failures':[r['name'] for r in result['checks'] if r['status']=='FAIL']}
(OUT/'independent-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result['summary'],ensure_ascii=False))
