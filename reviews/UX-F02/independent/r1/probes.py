#!/usr/bin/env python3
"""Independent bounded probes for F02 review; does not modify sources."""
import os,functools,json,re,subprocess,threading
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(os.environ['F02_REVIEW_ROOT']); OUT=Path(os.environ['F02_REVIEW_OUTPUT']);OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
results={'source_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'targeted extra scenarios; not platform/user testing','probes':[]}
def record(name,data):results['probes'].append({'name':name,'measured':data});print(name,json.dumps(data,ensure_ascii=False),flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ['F02_REVIEW_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage']);results['browser']=b.version
 p=b.new_page(viewport={'width':390,'height':844});err=[];p.on('pageerror',lambda e:err.append(str(e)))
 def load():p.goto(base+'/previews/ux-patterns/choice-lifecycle/',wait_until='networkidle');p.evaluate('document.fonts.ready')
 def open_():p.locator('#f02c-open-picker').click();p.wait_for_timeout(300)
 def settle():p.evaluate("document.querySelector('#f02c-sim-settle-latest').click()");p.wait_for_timeout(80)
 def select_beta():open_();settle();p.locator('[data-picker-list] [data-value=beta]').click();p.wait_for_function('document.querySelector("#f02c-picker-layer").hidden')
 src=(ROOT/'previews/ux-patterns/choice-lifecycle/example.js').read_text()
 patch=src.replace('var PICKER_SELECTED_INIT = null;',"var PICKER_SELECTED_INIT = {value:'beta',label:'عينة ب'};")
 p.route('**/example.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=patch))
 load();before=p.evaluate('F02Choice.inspect()');open_();settle();after=p.evaluate('F02Choice.inspect()');record('initial-beta-first-ready',{'before':before['selected'],'after':after['selected'],'innerSummary':after['pickerSummary'],'note':after['selectionNote']});p.screenshot(path=str(OUT/'initial-beta-lost.png'));p.unroute('**/example.js')
 load();select_beta();p.evaluate("const s=document.querySelector('#f02c-sim-outcome');s.value='empty';s.dispatchEvent(new Event('change',{bubbles:true}));")
 open_();settle();s=p.evaluate('F02Choice.inspect()');record('selected-beta-empty-source',{'selected':s['selected'],'summary':s['pickerSummary'],'stateRow':s['stateRow'],'optionCount':len(s['options']),'optionsHidden':[x['hiddenAttr'] for x in s['options']]})
 p.screenshot(path=str(OUT/'empty-retains-selection.png'))
 load();select_beta();p.evaluate("F02Choice.setSource([{value:'alpha',label:'عينة أ'}])");open_();p.locator('[data-picker-close]').focus();focus0=p.evaluate('document.activeElement.outerHTML');settle();s=p.evaluate('F02Choice.inspect()');record('drop-selection-and-stable-close-focus',{'focusBefore':focus0,'focusAfter':s['focusId'],'note':s['selectionNote'],'noteInInert':p.evaluate("!!document.querySelector('#f02c-selection-note').closest('[inert]')"),'liveInLayer':s['liveText'],'selected':s['selected']});p.screenshot(path=str(OUT/'drop-note-inert-focus.png'))
 load();open_();settle();live0=p.locator('#f02c-picker-live').inner_text();p.locator('[data-picker-search]').fill('no match');s=p.evaluate('F02Choice.inspect()');record('search-no-results-live-channel',{'liveBefore':live0,'liveAfter':s['liveText'],'state':s['stateRow'],'rowRole':p.locator('.m-picker__state').get_attribute('role'),'rowLive':p.locator('.m-picker__state').get_attribute('aria-live')})
 load();r=p.evaluate('''async () => {const c=F02ChoiceSim.createConnector({items:[{value:'old',label:'Old'}]});const promise=c.read({readId:1});c.setSource([{value:'new',label:'New'}]);c.settle(1);return await promise;}''');record('read-fixture-changed-after-call',r)
 b.close();results['page_errors']=err
server.shutdown()
pattern=r'^FAIL\\b';record('regression-failure-detector',{'literalPattern':pattern,'matchesActualFail':bool(re.search(pattern,'FAIL real failure\nPASS another test',re.M))})
(OUT/'probes.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
