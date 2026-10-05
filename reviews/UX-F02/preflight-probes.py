#!/usr/bin/env python3
"""Bounded F02 preflight; observational baseline, not a passing UX suite."""
import argparse, functools, hashlib, json, os, subprocess, threading
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser(); p.add_argument('--root',required=True); p.add_argument('--output',required=True); a=p.parse_args()
root=Path(a.root).resolve()
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
paths=['components/selection/selection.js','components/navigation/navigation.js','components/selection/specification.md']
result={'source_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'source_worktree_clean_before_probe':not subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True).strip(),'source_sha256':{x:hashlib.sha256((root/x).read_bytes()).hexdigest() for x in paths},'scope':'bounded baseline reproduction; not F02 implementation or full UI acceptance','observations':[]}
with sync_playwright() as pw:
    opts={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
    if os.environ.get('F02_BROWSER_EXECUTABLE'): opts['executable_path']=os.environ['F02_BROWSER_EXECUTABLE']
    browser=pw.chromium.launch(**opts); result['browser']=browser.version
    page=browser.new_page(viewport={'width':390,'height':844}); errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/previews/selection/',wait_until='networkidle')
    page.evaluate('''() => {const x=document.createElement('div'); x.innerHTML=`<div data-choice-group id="probe-zero"><label><input id="probe-all" type="checkbox" data-select-all checked>الكل</label><input type="checkbox" data-choice-item disabled></div><div data-seg id="probe-seg"><button class="m-seg__item" aria-pressed="true" data-value="a">الأول</button><button id="probe-disabled" class="m-seg__item" aria-disabled="true" aria-pressed="false" data-value="b">الثاني</button></div>`; document.body.prepend(x); document.querySelector('#probe-all').indeterminate=true; window.probeEvents=0; document.querySelector('#probe-seg').addEventListener('micro-selection:segment',()=>window.probeEvents++); MicroSelection.init(document); }''')
    zero=page.evaluate('''() => ({checked:document.querySelector('#probe-all').checked,indeterminate:document.querySelector('#probe-all').indeterminate,eligible:document.querySelectorAll('#probe-zero [data-choice-item]:not(:disabled)').length})''')
    result['observations'].append({'id':'F02-P01','expected':'zero eligible choices: checked=false and indeterminate=false','measured':zero,'issue_reproduced':zero['eligible']==0 and (zero['checked'] or zero['indeterminate'])})
    box=page.locator('#probe-disabled').bounding_box()
    page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)  # real pointer; do not let Playwright's aria-disabled guard mask the browser behavior
    seg=page.evaluate('''() => ({selected:document.querySelector('#probe-disabled').getAttribute('aria-pressed'),events:window.probeEvents})''')
    result['observations'].append({'id':'F02-P02','expected':'aria-disabled option does not change selection or dispatch selection event','measured':seg,'issue_reproduced':seg['selected']=='true' and seg['events']==1})
    page.goto(base+'/previews/navigation/',wait_until='networkidle')
    page.evaluate('''() => {const x=document.createElement('div'); x.innerHTML=`<section id="probe-filter" data-filter-panel><label><input id="probe-flag" type="checkbox" data-filter-key="only_active_internal" data-filter-label="العناصر النشطة">العناصر النشطة</label><p data-filter-summary></p><button data-filter-apply>تطبيق</button><button data-filter-clear>مسح</button><button data-filter-cancel>إلغاء</button></section>`; document.body.prepend(x); MicroNavigation.init(document);}''')
    page.locator('#probe-flag').check()
    summary=page.locator('#probe-filter [data-filter-summary]').inner_text()
    page.locator('#probe-flag').uncheck()
    zero_summary=page.locator('#probe-filter [data-filter-summary]').inner_text()
    result['observations'].append({'id':'F02-P03','expected':'human-facing summary; no machine key or implementation instruction','measured':{'active_summary':summary,'zero_summary':zero_summary},'issue_reproduced':'only_active_internal' in summary and 'العدّاد يخفي' in zero_summary})
    browser.close(); result['page_errors']=errors
server.shutdown()
out=Path(a.output); out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(0 if all(x['issue_reproduced'] for x in result['observations']) and not result['page_errors'] else 1)
