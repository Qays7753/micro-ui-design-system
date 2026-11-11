#!/usr/bin/env python3
"""Source-only calendar contract regressions: Light, 360x780, RTL + directional LTR."""
import argparse
import http.server
import json
from pathlib import Path
import subprocess
import tempfile
import threading

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = '''<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/order-schedule/order-schedule.css">
<style>body{margin:0;padding:8px;font-family:var(--micro-font-family);background:var(--micro-surface-page)}
#calendar{min-width:0;max-width:100%}</style><div id="calendar"></div>
<script src="/components/order-schedule/order-schedule.js"></script></html>'''


class Handler(http.server.SimpleHTTPRequestHandler):
    source_ref = None
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == '/calendar-contract.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(FIXTURE.encode())
        elif self.source_ref and self.path.endswith('.js'):
            body = subprocess.check_output(['git', 'show', self.source_ref + ':' + self.path.lstrip('/')], cwd=ROOT)
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--source-ref', help='read-only reproduction against a Git ref; no branch switch')
    args = parser.parse_args()
    Handler.source_ref = args.source_ref
    out = args.out or Path(tempfile.mkdtemp(prefix='micro-calendar-contract-'))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    checks, errors = [], []

    def check(name, ok, detail=None):
        checks.append({'name': name, 'passed': bool(ok), 'detail': detail})
        print(('PASS ' if ok else 'FAIL ') + name, flush=True)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            version = browser.version
            page = browser.new_page(viewport={'width': 360, 'height': 780}, color_scheme='light')
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('requestfailed', lambda r: errors.append(r.url))
            page.goto(f'http://127.0.0.1:{server.server_port}/calendar-contract.html')
            page.evaluate('document.fonts.ready')

            def init(options=None):
                page.evaluate('''opts=>{if(window.instance)instance.destroy();
                  window.root=document.getElementById('calendar');
                  window.instance=MicroOrderSchedule.init(root,Object.assign({today:'2026-11-11',
                    selectedDate:'2026-11-11',orders:[]},opts));}''', options or {})

            init()
            for date in ['2026-02-30', '2026-13-01', '2026-00-00', '2025-02-29', '0000-01-01']:
                page.evaluate('d=>instance.setSelectedDate(d)', date)
                selected = page.locator('#calendar').get_attribute('data-ocal-selected-date')
                check('invalid selected date is ignored: ' + date, selected == '2026-11-11', selected)
            page.screenshot(path=str(out / 'date-validation.png'), full_page=True)
            init({'today': '2026-02-30', 'selectedDate': '2026-13-01'})
            check('invalid initialization uses a real local date', page.evaluate('''()=>{
              const d=new Date(),p=n=>String(n).padStart(2,'0');
              return root.dataset.ocalSelectedDate===d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}'''))
            init({'orders': [{'id': 'bad', 'title': 'طلب بتاريخ غير موجود', 'date': '2026-02-30'}], 'view': 'list'})
            text = page.locator('#calendar').inner_text()
            check('impossible order date is unscheduled, never a real dated order',
                  '30/02/2026' not in text and 'الطلبات غير المجدولة' in text, text)
            page.screenshot(path=str(out / 'invalid-order-date.png'), full_page=True)
            for year in ['0001', '0099', '0100', '0999', '2000']:
                date = year + '-02-28'
                init({'today': date, 'selectedDate': date, 'orders': [{'id': 'low', 'title': 'موعد', 'date': date}]})
                data = page.evaluate('''()=>({days:[...root.querySelectorAll('[data-ocal-date]')].map(n=>n.dataset.ocalDate),
                  selected:root.querySelectorAll('[aria-selected=true][data-ocal-date]').length,
                  row:!!root.querySelector('[data-ocal-action=order-row]'),text:root.textContent})''')
                check('four-digit year, selected cell and order agree: ' + year,
                      data['selected'] == 1 and data['row'] and date in data['days']
                      and all(len(d) == 10 for d in data['days']) and '28/02/' + year in data['text'], data)
            page.screenshot(path=str(out / 'four-digit-year.png'), full_page=True)
            init({'today': '0001-01-01', 'selectedDate': '0001-01-01'})
            page.locator('[data-ocal-action=prev-month]').click()
            check('month browsing stays inside the supported Gregorian year range',
                  '01 / 0001' in page.locator('[data-ocal-action=month-picker]').inner_text())
            init({'today': '2024-02-29', 'selectedDate': '2024-02-29'})
            check('real Gregorian leap day remains valid', page.locator('[data-ocal-date="2024-02-29"][aria-selected=true]').count() == 1)
            for direction, key, expected in [('rtl', 'ArrowLeft', '2026-11-12'), ('ltr', 'ArrowRight', '2026-11-12')]:
                init()
                page.evaluate('d=>document.documentElement.dir=d', direction)
                page.wait_for_timeout(30)
                page.locator('[data-ocal-date="2026-11-11"]').focus()
                page.keyboard.press(key)
                check(direction + ' month arrow moves focus without selecting', page.evaluate('''date=>
                  document.activeElement.dataset.ocalDate===date&&root.dataset.ocalSelectedDate==='2026-11-11' ''', expected))
                page.keyboard.press('Enter')
                check(direction + ' Enter selects the focused day', page.locator('#calendar').get_attribute('data-ocal-selected-date') == expected)
            page.evaluate("document.documentElement.dir='rtl'")
            for order_id in ['quote"id', "quote'id", 'bracket]\\id', 'طلب عربي/1']:
                init({'orders': [{'id': order_id, 'title': 'طلب بعنوان كامل', 'date': '2026-11-11'}],
                      'orderActions': {'edit': True, 'delete': True}})
                page.evaluate('''()=>{window.opens=[];root.addEventListener('order-schedule:order-open',e=>opens.push(e.detail.id),{once:true})}''')
                row = page.locator('[data-ocal-action=order-row]')
                row.click()
                check('opaque ID opens once and restores focus: ' + order_id, page.evaluate('''id=>
                  opens.length===1&&opens[0]===id&&document.activeElement.dataset.ocalId===id
                  &&root.querySelector('[data-ocal-action=order-row]').getAttribute('aria-expanded')==='true' ''', order_id))
                for action in ['edit', 'delete']:
                    page.locator('[data-ocal-action=order-' + action + ']').click()
                    check('opaque ID ' + action + ' event leaves a focused row',
                          page.evaluate('id=>document.activeElement.dataset.ocalId===id', order_id))
                page.screenshot(path=str(out / 'opaque-id.png'), full_page=True)

            init({'displayedMonth': '2026-12'})
            api = page.evaluate("typeof instance.getState==='function'&&typeof instance.setDisplayedMonth==='function'")
            check('general state snapshot and independent displayed-month API are available', api)
            if api:
                check('initial displayed month is independent of selection', page.evaluate('''()=>
                  instance.getState().displayedMonth==='2026-12'&&instance.getState().selectedDate==='2026-11-11' '''))
                page.evaluate('''()=>{window.changes=[];window.days=[];
                  root.addEventListener('order-schedule:state-change',e=>changes.push(e.detail));
                  root.addEventListener('order-schedule:day-select',e=>days.push(e.detail.date));
                  let s=instance.getState();s.view='list';
                  instance.setDisplayedMonth('2027-01');instance.setDisplayedMonth('2027-13');
                  instance.setView('calendar');instance.setCalendarView('month');}''')
                check('snapshots are copies; programmatic setters stay silent; invalid month ignored',
                      page.evaluate("changes.length===0&&days.length===0&&instance.getState().displayedMonth==='2027-01'&&instance.getState().view==='calendar'"))
                page.locator('[data-ocal-action=next-month]').click()
                check('user month browse emits one complete snapshot without selecting', page.evaluate('''()=>
                  changes.length===1&&days.length===0&&changes[0].displayedMonth==='2027-02'
                  &&changes[0].selectedDate==='2026-11-11'&&changes[0].view==='calendar'
                  &&changes[0].calendarView==='month' '''))
                page.locator('[data-ocal-action=mode-toggle]').click()
                check('user mode switch emits exactly one snapshot', page.evaluate("changes.length===2&&changes[1].view==='list'"))
                page.evaluate("instance.setView('calendar');instance.setSelectedDate('2026-11-11');changes=[];days=[]")
                page.locator('[data-ocal-date="2026-11-12"]').click()
                check('one day action emits its legacy event and one coherent state event', page.evaluate("changes.length===1&&days.length===1&&changes[0].selectedDate===days[0]"))
                page.evaluate("changes=[];instance.setData([]);instance.setLoading(true);instance.setError(()=>{});instance.setData([])")
                check('data/loading/error and repeat init do not fake navigation changes', page.evaluate("changes.length===0&&MicroOrderSchedule.init(root,{view:'list'})===instance"))
                # Captured DOM interaction must become inert after teardown.
                result = page.evaluate('''()=>{const old=root.querySelector('[data-ocal-action=next-month]');
                  instance.destroy();old.click();instance.setDisplayedMonth('2029-01');
                  return root.childElementCount===0&&changes.length===0&&MicroOrderSchedule.getInstance(root)===null;}''')
                check('teardown releases DOM, instance and all state-event paths', result)
            init()
            check('no document horizontal overflow at 360px', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            page.set_viewport_size({'width': 320, 'height': 780})
            page.screenshot(path=str(out / 'calendar-320.png'), full_page=True)
            check('targeted narrow calendar has no horizontal overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            check('no browser or resource errors', not errors, errors)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    passed = sum(c['passed'] for c in checks)
    report = {'browser': version, 'sourceRef': args.source_ref or 'working tree', 'passed': passed, 'failed': len(checks)-passed, 'checks': checks,
              'errors': errors, 'scope': 'Light only; 360x780 RTL; directional LTR; targeted 320; no zoom/Dark/device claims'}
    (out / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(f'{passed} PASS / {len(checks)-passed} FAIL — {out}')
    return int(passed != len(checks))


if __name__ == '__main__':
    raise SystemExit(main())
