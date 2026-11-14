#!/usr/bin/env python3
"""Focused checks for owner stages. One phone, no broad duplicate matrix."""
import argparse,http.server,json,threading,tempfile,subprocess,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def phase3(p,base,out,check):
 p.goto(base+'/previews/design-direction/density.html');p.evaluate('document.fonts.ready')
 p.locator('.m-row').evaluate_all('(xs)=>xs.forEach(x=>x.classList.remove("m-row--single"))');before=p.locator('#short-rows').bounding_box()['height'];p.locator('main').screenshot(path=str(out/'before360.png'))
 p.locator('.m-row').evaluate_all('(xs)=>xs.forEach(x=>x.classList.add("m-row--single"))');after=p.locator('#short-rows').bounding_box()['height'];p.locator('main').screenshot(path=str(out/'after360.png'))
 check('Short rows save space without reducing readable type',after<before and p.locator('.m-row').evaluate_all('(xs)=>xs.every(x=>x.getBoundingClientRect().height>=48)'))
 check('Amounts and counts remain distinct','د.أ' in p.locator('.m-reading-group').inner_text() and 'طلب' in p.locator('.m-reading-group').inner_text())
 p.locator('.m-row__title').first.evaluate('(e)=>e.textContent="اسم صنف طويل جدًا ".repeat(12)');check('Long single-row content grows without overflow',p.locator('.m-row').first.bounding_box()['height']>48 and p.evaluate('document.documentElement.scrollWidth===innerWidth'))
 check('Default rows keep old minimum',before>=72*3)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--phase',required=True);ap.add_argument('--out',type=Path);args=ap.parse_args();out=args.out or Path(tempfile.mkdtemp(prefix='owner-check-'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
 def check(name,ok):checks.append(dict(name=name,passed=bool(ok)));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce');p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)))
  globals()['phase'+args.phase](p,f'http://127.0.0.1:{server.server_port}',out,check)
  check('No script errors',not errors);b.close()
 server.shutdown();files=[x for folder in ['components','previews/design-direction'] for x in (ROOT/folder).rglob('*') if x.is_file() and x.suffix in ['.css','.js']]
 report=dict(baseCommit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,physicalDevice=False,phase=args.phase,checks=checks,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),sourceSha256={str(x.relative_to(ROOT)):hashlib.sha256(x.read_bytes()).hexdigest() for x in files})
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
