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

def phase5(p,base,out,check):
 def go(case):
  p.goto(base+'/previews/product-context/lab.html?component=market');p.locator('#scenario').select_option(case);p.evaluate('document.fonts.ready')
 image=(ROOT/'docs/audits/ui-owner-2026-11-14/phase1/evidence/direction360.png').read_bytes()
 def choose(name):p.locator('#product-root input[type=file]').set_input_files(dict(name=name,mimeType='image/png',buffer=image))
 go('editor');choose('one.png');choose('two.png');check('Default selection still replaces',p.locator('.m-product__filenames bdi').all_text_contents()==['two.png'])
 go('editor-append');choose('one.png');choose('two.png');check('Explicit append preserves both selections',p.locator('.m-product__filenames bdi').all_text_contents()==['one.png','two.png'])
 p.locator('#product-root').screenshot(path=str(out/'append360.png'))
 p.get_by_role('button',name='إزالة one.png',exact=True).click();check('Individual removal preserves other file and focus',p.locator('.m-product__filenames bdi').all_text_contents()==['two.png'] and p.locator('[data-focus-key=choose-files]').evaluate('(e)=>e===document.activeElement'))
 p.locator('[data-product-action=save-draft]').click();check('Draft emits remaining file only',p.evaluate('lab.lastIntent.payload.files.length===1&&lab.lastIntent.payload.files[0].name==="two.png"'))
 go('editor-append');choose('one.png');p.evaluate('let m=lab.model;m.scope={...m.scope,workspaceId:"new"};m.dataContext=m.scope;lab.replace(m)');check('Context change clears file selection',p.locator('.m-product__filenames').count()==0)
 go('editor-append');p.evaluate('let m=lab.model;m.phase="disabled";lab.replace(m)');check('Disabled editor cannot choose files',p.locator('[data-focus-key=choose-files]').is_disabled())
 check('File list fits phone',p.evaluate('document.documentElement.scrollWidth===innerWidth'))

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
