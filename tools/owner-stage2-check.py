#!/usr/bin/env python3
"""Focused action layout and field feedback checks; optional read-only baseline capture."""
import argparse,http.server,json,threading,tempfile,subprocess,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
FILES=['components/buttons/buttons.css','components/product-context/product-core.js','components/product-context/product-context.css','components/product-context/market.js','components/product-context/delivery.js','components/product-context/context.js']
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path);ap.add_argument('--source-ref');args=ap.parse_args();out=args.out or Path(tempfile.mkdtemp(prefix='owner-stage2-'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
 def check(name,ok):checks.append(dict(name=name,passed=bool(ok)));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce');p.set_default_timeout(6000)
  p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  if args.source_ref:
   for path in FILES:
    data=subprocess.check_output(['git','show',args.source_ref+':'+path],cwd=ROOT,text=True)
    p.route('**/'+path,lambda route,request,data=data,path=path:route.fulfill(status=200,content_type='text/css' if path.endswith('.css') else 'text/javascript',body=data))
  def go(kind,case):
   p.goto(f'http://127.0.0.1:{server.server_port}/previews/product-context/lab.html?component={kind}');p.locator('#scenario').select_option(case);p.evaluate('document.fonts.ready')
  def model(code):p.evaluate('()=>{let m=lab.model;'+code+';lab.replace(m)}')
  go('market','editor');p.locator('[data-focus-key=field-title]').fill('');p.locator('[data-focus-key=field-price]').fill('');p.locator('[data-product-action=publish]').click()
  p.locator('#product-root').screenshot(path=str(out/'market-errors360.png'))
  if not args.source_ref:
   check('Each missing field has a nearby associated message',p.evaluate('[...document.querySelectorAll("[aria-invalid=true]")].length===2&&[...document.querySelectorAll("[aria-invalid=true]")].every(e=>e.closest(".m-field").contains(document.getElementById(e.getAttribute("aria-describedby")))&&document.getElementById(e.getAttribute("aria-describedby")).getClientRects().length>0)'))
   check('One summary and first-field focus',p.locator('[data-product-validation]').count()==1 and p.locator('[data-focus-key=field-title]').evaluate('(e)=>e===document.activeElement'))
   p.locator('[data-focus-key=field-title]').fill('عنوان مصحح');check('Correcting one preserves the other error only',p.locator('[data-product-field-error]').count()==1 and p.locator('[data-focus-key=field-price]').get_attribute('aria-invalid')=='true')
   p.locator('[data-focus-key=field-price]').fill('0');check('Zero value is retained and notices clear',p.locator('[data-product-field-error],[data-product-validation]').count()==0 and p.locator('[data-focus-key=field-price]').input_value()=='0')
   model('m.permissions=["view","compose","publish"]');check('Single permitted action fills the row',p.locator('[data-product-action=publish]').bounding_box()['width']>300)
  go('delivery','offer');p.locator('#product-root').screenshot(path=str(out/'delivery-actions360.png'))
  if not args.source_ref:
   check('Paired actions have equal width and same row',p.evaluate('(()=>{let a=document.querySelector("[data-product-action=accept]").getBoundingClientRect(),d=document.querySelector("[data-product-action=decline]").getBoundingClientRect();return Math.abs(a.width-d.width)<1&&Math.abs(a.top-d.top)<1})()'))
   check('Supplementary action has an explicit full row',p.locator('.m-btn-group__more [data-product-action=assign]').bounding_box()['width']>300)
   model('m.permissions=["view","accept"]');check('One delivery action does not leave half a row',p.locator('[data-product-action=accept]').bounding_box()['width']>300)
   p.set_viewport_size({'width':320,'height':780});go('delivery','offer');p.locator('[data-product-action=accept]').evaluate('(e)=>e.textContent="مراجعة تفاصيل العرض وقبول التوصيل"');check('Long paired action wraps without overflow or reduced touch height',p.evaluate('document.documentElement.scrollWidth===innerWidth&&[...document.querySelectorAll(".m-btn-group button")].every(e=>e.getBoundingClientRect().height>=48)&&Math.abs(document.querySelector("[data-product-action=accept]").getBoundingClientRect().height-document.querySelector("[data-product-action=decline]").getBoundingClientRect().height)<1'))
   p.evaluate('document.documentElement.dir="ltr"');check('LTR uses same DOM order and containment',p.evaluate('document.documentElement.scrollWidth===innerWidth&&document.querySelector(".m-btn-group button").dataset.productAction==="accept"'))
   p.set_viewport_size({'width':360,'height':780});go('context','driver');check('Concise context preserves driver-only destinations',p.evaluate('[...document.querySelectorAll("[data-destination]")].map(e=>e.dataset.destination).join(",")==="delivery,ask"') and 'Workspace' not in p.locator('#product-root label').inner_text())
   p.goto(f'http://127.0.0.1:{server.server_port}/previews/design-direction/actions.html');p.evaluate('document.fonts.ready');p.screenshot(path=str(out/'action-recipes360.png'),full_page=True)
   check('Recipe examples fit phone',p.evaluate('document.documentElement.scrollWidth===innerWidth'))
   check('No browser/resource errors',not errors)
  b.close()
 server.shutdown();report=dict(commitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),sourceRef=args.source_ref,workingTree=not bool(args.source_ref),physicalDevice=False,checks=checks,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),errors=errors,sourceSha256={f:hashlib.sha256((ROOT/f).read_bytes() if not args.source_ref else subprocess.check_output(['git','show',args.source_ref+':'+f],cwd=ROOT)).hexdigest() for f in FILES})
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
