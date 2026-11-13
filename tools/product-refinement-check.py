#!/usr/bin/env python3
"""Focused phone checks for product refinement, without repeating the full suite."""
import argparse, hashlib, http.server, json, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path);ap.add_argument('--capture-only',action='store_true');args=ap.parse_args()
 out=args.out or Path(tempfile.mkdtemp(prefix='product-layout-'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
 def check(name,ok):checks.append(dict(name=name,passed=bool(ok)));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce');p.set_default_timeout(5000)
  p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  def go(kind,case):
   p.goto(f'http://127.0.0.1:{server.server_port}/previews/product-context/lab.html?component={kind}');p.locator('#scenario').select_option(case);p.evaluate('document.fonts.ready')
  def model(code):p.evaluate('()=>{let m=lab.model;'+code+';lab.replace(m)}')
  for kind,case in [('market','editor'),('market','no-media'),('delivery','offer'),('delivery','request')]:
   go(kind,case);p.locator('#product-root').screenshot(path=str(out/(kind+'-'+case+'360.png')))
   if args.capture_only:continue
   check(kind+'/'+case+' fits phone',p.evaluate('document.documentElement.scrollWidth===innerWidth'))
   check(kind+'/'+case+' interactive controls retain touch height',p.evaluate('[...document.querySelectorAll("#product-root button,#product-root input:not([type=file]),#product-root textarea")].filter(e=>e.getClientRects().length).every(e=>e.getBoundingClientRect().height>=48)'))
   if kind=='delivery' and case=='request':check('Request has editable addresses without duplicate read-only copy',p.locator('#product-root dl').count()==0 and p.locator('#product-root input').count()>=2)
   if kind=='delivery' and case=='offer':check('Address labels align with their values',p.evaluate('(()=>{let d=document.querySelector("#product-root dt"),v=document.querySelector("#product-root dd");return d.getBoundingClientRect().top<v.getBoundingClientRect().bottom&&v.getBoundingClientRect().top<d.getBoundingClientRect().bottom})()'))
   if kind=='market' and case=='no-media':check('Missing image does not reserve a large photo',p.locator('.m-product__media-empty').bounding_box()['height']<120)
   if kind=='market' and case=='editor':
    with p.expect_file_chooser() as chooser:p.get_by_role('button',name='اختيار الصور',exact=True).click()
    chooser.value.set_files(dict(name='photo.png',mimeType='image/png',buffer=(ROOT/'docs/audits/ui-refinement-2026-11-13/phase1/evidence/delivery-proof360.png').read_bytes()))
    check('Branded upload control selects and previews a local file',p.locator('#product-root input[type=file]').is_hidden() and p.locator('#product-root .m-product__media').count()==3 and p.locator('#product-root').get_by_text('photo.png',exact=True).count()==1)
    p.get_by_role('button',name='إزالة المرفقات',exact=True).click();check('Remove clears selection while preserving editor',p.locator('#product-root .m-product__media').count()==2 and p.locator('#product-root [data-focus-key=field-title]').input_value()!='')
    model('m.phase="disabled"');check('Upload cannot open for disabled editor',p.get_by_role('button',name='اختيار الصور',exact=True).is_disabled())
  if not args.capture_only:
   p.set_viewport_size({'width':320,'height':780});go('delivery','offer');model('m.pickup="عنوان طويل جدًا ".repeat(12);m.dropoff="عنوان آخر ".repeat(15)');check('Long addresses stay readable at targeted320',p.evaluate('document.documentElement.scrollWidth===innerWidth'))
   p.set_viewport_size({'width':360,'height':780});p.evaluate('document.documentElement.dir="ltr"');check('Address rows also fit LTR',p.evaluate('document.documentElement.scrollWidth===innerWidth'))
   check('No browser/resource errors',not errors)
  b.close()
 server.shutdown()
 files=list((ROOT/'components/product-context').glob('*'))
 report=dict(commitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,physicalDevice=False,checks=checks,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),errors=errors,sourceSha256={str(f.relative_to(ROOT)):hashlib.sha256(f.read_bytes()).hexdigest() for f in files if f.is_file()})
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
