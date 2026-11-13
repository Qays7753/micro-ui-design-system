#!/usr/bin/env python3
"""C04 exact visible unit tokens. Light360 RTL only; no device or Dark claims."""
import argparse,hashlib,http.server,json,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
HTML='''<!doctype html><html lang="ar" dir="rtl" data-theme="light"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/shared/tokens.css"><link rel="stylesheet" href="/components/compositions/reading-layout.css"><style>body{margin:0;padding:16px;font:var(--micro-body-size)/var(--micro-body-line) var(--micro-font-family);background:var(--micro-surface-page)}</style><section id="unit-group" class="m-reading-group" data-reading-context="unit-caption"><h1 id="unit-caption" class="m-reading-group__title"></h1><p><bdi dir="ltr">150</bdi> <span id="unit"></span></p></section><script src="/components/compositions/reading-context.js"></script></html>'''
CASES=[('م','المخزون هذا اليوم',False),('g','Weight reading',False),('غ','المبلغ الحالي',False),('م','الوحدة كم',False),('g','Weight (kg)',False),('م','المساحة م²',False),('USD','BUSDA',False),('د.أ','رمز دXأ',False),('م','الوحدة: م',True),('g','الوزن · g',True),('د.أ','المبيعات (د.أ)',True),('د.أ','المبيعات · 150د.أ',False),('%','نسبة التحصيل 65%',True),('$','المبالغ $',True),('m²','المساحة m²',True),('kg','Weight kg',True),('USD','USD · المبيعات',True),('م','مخزون · م',True),('قطعة','الكمية (قطعة)',True),('طلب','الطلبات',False)]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
 def log_message(self,*_):pass
 def do_GET(self):
  if self.path=='/unit-context-fixture.html':
   self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.end_headers();self.wfile.write(HTML.encode())
  else:super().do_GET()
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path);ap.add_argument('--capture-only',action='store_true');a=ap.parse_args();out=a.out or Path(tempfile.mkdtemp(prefix='unit-context-'));out.mkdir(parents=True,exist_ok=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();checks=[];errors=[]
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());version=b.version;p=b.new_page(viewport={'width':360,'height':780},color_scheme='light',locale='ar');p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:errors.append(r.url) if r.status>=400 else None);p.goto(f'http://127.0.0.1:{server.server_port}/unit-context-fixture.html',wait_until='networkidle');p.evaluate('document.fonts.ready')
  for i,(unit,caption,expected) in enumerate(CASES):
   r=p.evaluate('''({unit,caption})=>{const group=document.querySelector('#unit-group'),label=document.querySelector('#unit-caption'),value=document.querySelector('#unit');group.dataset.unit=unit;label.textContent=caption;value.textContent=unit;value.dataset.readingUnit=unit;MicroReadings.sync(group);return {contextual:value.classList.contains('m-reading-unit--contextual'),label:label.textContent,unit:value.textContent,number:group.querySelector('bdi').textContent,scroll:document.documentElement.scrollWidth,width:innerWidth}}''',dict(unit=unit,caption=caption))
   passed=r['contextual']==expected and r['unit']==unit and r['number']=='150' and r['scroll']<=r['width'];checks.append(dict(name=f'{unit} in {caption}',passed=passed,expectedContextual=expected,detail=r));print(('PASS' if passed else 'FAIL')+' '+checks[-1]['name'],flush=True)
   if i in (0,4,10):p.locator('#unit-group').screenshot(path=str(out/(f'case-{i}.png')))
  r=p.evaluate("()=>{let group=document.querySelector('#unit-group');MicroReadings.disconnect(group);return !group.querySelector('.m-reading-unit--contextual')}");checks.append(dict(name='Disconnect keeps inline unit available',passed=r))
  checks.append(dict(name='No browser or resource errors',passed=not errors,detail=errors));b.close()
 server.shutdown();path='components/compositions/reading-context.js';report=dict(sourceCommitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),captureOnly=a.capture_only,physicalDevice=False,browser=version,viewport='360x780 RTL',theme='light',passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),checks=checks,sourceSha256={path:hashlib.sha256((ROOT/path).read_bytes()).hexdigest()});(out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"Unit context: {report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'] and not a.capture_only)
if __name__=='__main__':raise SystemExit(main())
