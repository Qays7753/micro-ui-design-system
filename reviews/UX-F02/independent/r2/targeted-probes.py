import functools,http.server,threading,json,os,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ['F02_REVIEW_ROOT']); OUT=Path(os.environ['F02_REVIEW_OUTPUT']); OUT.mkdir(parents=True,exist_ok=True)
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
res={'source_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'probes':[],'errors':[]}
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path=os.environ['F02_REVIEW_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage'])
 res['browser']=b.version
 p=b.new_page(viewport={'width':390,'height':844}); p.on('pageerror',lambda e:res['errors'].append(str(e)))
 def load():
  p.goto(base+'/previews/ux-patterns/choice-lifecycle/',wait_until='networkidle');p.evaluate('() => document.fonts.ready')
 def op():
  p.click('#f02c-open-picker');p.wait_for_timeout(300)
 def settle():
  p.evaluate('() => document.getElementById("f02c-sim-settle-latest").click()');p.wait_for_timeout(100)
 def close():
  p.keyboard.press('Escape');p.wait_for_timeout(350)
 load()
 snap=p.evaluate('''async () => {
  const src=[{value:'old',label:'قبل القراءة'}];
  const c=F02ChoiceSim.createConnector({items:src});
  const first=c.read({readId:1});
  src[0].label='تعديل بعد بدء الطلب';
  c.setSource([{value:'new',label:'المصدر الجديد'}]);
  const second=c.read({readId:2});
  c.settleLatest(); const r2=await second;
  c.settle(1); const r1=await first;
  return {first:r1,second:r2};
 }''')
 res['probes'].append({'id':'snapshot-item-mutation','failure':snap['first']['items'][0]['label']!='قبل القراءة','measured':snap})
 load();op();settle()
 p.click('.m-picker__option[data-value="beta"]');p.wait_for_timeout(350)
 p.evaluate('() => F02Choice.setSource([{value:"alpha",label:"عينة أ"}])')
 op();settle()
 drop=p.evaluate('''() => {
  const l=document.getElementById('f02c-picker-layer');
  const live=document.getElementById('f02c-picker-live');
  const cs=getComputedStyle(live),r=live.getBoundingClientRect();
  const walkers=document.createTreeWalker(l,NodeFilter.SHOW_TEXT);
  const visible=[];
  while(walkers.nextNode()){
    const n=walkers.currentNode,e=n.parentElement;
    if(!n.textContent.trim()||e.closest('[hidden],svg,script,style'))continue;
    let clipped=false,cur=e;
    while(cur&&l.contains(cur)){
      const s=getComputedStyle(cur),rect=cur.getBoundingClientRect();
      if(s.display==='none'||s.visibility==='hidden'||(s.clipPath!=='none'&&rect.width<=1&&rect.height<=1)){clipped=true;break;}
      cur=cur.parentElement;
    }
    if(!clipped)visible.push(n.textContent.trim());
  }
  return {selected:F02Choice.inspect().selected,liveText:live.textContent,liveRect:{w:r.width,h:r.height},clipPath:cs.clipPath,externalNote:document.getElementById('f02c-selection-note').textContent,visibleTexts:visible};
 }''')
 dropfail='لم يعد متاح' in drop['liveText'] and not any('لم يعد متاح' in t for t in drop['visibleTexts'])
 res['probes'].append({'id':'drop-message-not-visible','failure':dropfail,'measured':drop})
 p.screenshot(path=str(OUT/'drop-message-not-visible.png'))
 load();op();p.fill('#f02c-picker-search','zzz');p.wait_for_timeout(50)
 before=p.evaluate('() => ({live:document.getElementById("f02c-picker-live").textContent,row:document.querySelector(".m-picker__state")?.textContent})')
 settle()
 after=p.evaluate('() => ({query:document.getElementById("f02c-picker-search").value,live:document.getElementById("f02c-picker-live").textContent,row:document.querySelector(".m-picker__state")?.textContent,visibleOptions:[...document.querySelectorAll(".m-picker__option")].filter(o=>!o.hidden).length})')
 res['probes'].append({'id':'no-results-after-read','failure':'لا نتائج' in after['row'] and 'لا نتائج' not in after['live'],'measured':{'before':before,'after':after}})
 p.screenshot(path=str(OUT/'no-results-after-read.png'))
 b.close()
(OUT/'targeted-probes.json').write_text(json.dumps(res,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(res,ensure_ascii=False,indent=2))
server.shutdown()
