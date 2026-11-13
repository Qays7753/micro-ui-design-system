#!/usr/bin/env python3
"""One RTL phone: verify task-based use without changing calendar defaults."""
import argparse,http.server,json,threading,tempfile,subprocess,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path);args=ap.parse_args();out=args.out or Path(tempfile.mkdtemp(prefix='calendar-task-'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[];sizes={};day_targets=[]
 def check(name,ok):checks.append(dict(name=name,passed=bool(ok)));print(('PASS ' if ok else 'FAIL ')+name)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce')
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.goto(f'http://127.0.0.1:{server.server_port}/previews/mobile-capabilities/calendar-tasks.html');p.evaluate('document.fonts.ready')
  check('Task example starts with week',p.evaluate('calendarTaskLab.calendar.getState().calendarView==="week"'))
  for view in ['week','month','day']:
   p.evaluate('(view)=>calendarTaskLab.calendar.setCalendarView(view)',view);r=p.locator('#task-calendar');sizes[view]=r.bounding_box()['height'];day_targets.extend(r.locator('.m-ocal__cell').evaluate_all('(xs)=>xs.map(x=>x.getBoundingClientRect().height)'));r.screenshot(path=str(out/(view+'360.png')))
   check(view+' retains date and order content',p.evaluate('calendarTaskLab.calendar.getState().selectedDate==="2026-11-14"') and 'طلب صابون' in r.inner_text())
   check(view+' has no horizontal overflow',p.evaluate('document.documentElement.scrollWidth===innerWidth'))
  check('Week leaves more room than month without shrinking controls',sizes['week']<sizes['month'] and bool(day_targets) and min(day_targets)>=48)
  p.goto(f'http://127.0.0.1:{server.server_port}/previews/readable-source/index.html');p.evaluate('document.fonts.ready')
  for selector in ['#sales-group','#units-default']:
   r=p.locator(selector);r.screenshot(path=str(out/(selector[1:]+'360.png')));check(selector+' readable without overflow',r.bounding_box()['width']<=360 and p.evaluate('document.documentElement.scrollWidth===innerWidth'))
  check('Money and inventory retain distinct visible units','د.أ' in p.locator('#units-default').inner_text() and 'قطعة' in p.locator('#units-default').inner_text())
  check('Share chart is optional, not initial clutter',not p.locator('#distribution-example').evaluate('(e)=>e.open'))
  check('No script errors',not errors);b.close()
 server.shutdown();files=['components/order-schedule/order-schedule.js','components/order-schedule/order-schedule.css','previews/mobile-capabilities/calendar-tasks.js','previews/mobile-capabilities/calendar-tasks.html']
 report=dict(commitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,physicalDevice=False,checks=checks,heights=sizes,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),sourceSha256={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in files})
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
