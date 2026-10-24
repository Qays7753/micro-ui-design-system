#!/usr/bin/env python3
"""Independent light-only order-schedule browser check (source files only).

Examples:
  python3 tools/light-calendar-check.py
  python3 tools/light-calendar-check.py --capture-dir /tmp/calendar-before
"""
import argparse
import http.server
import json
import tempfile
import threading
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent

HTML = """<!doctype html><html lang="ar" dir="rtl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/order-schedule/order-schedule.css">
<style>
html,body{margin:0;min-width:0;background:var(--micro-surface-page);color:var(--micro-text-primary)}
#fixture{width:100%;padding:8px;box-sizing:border-box}
#order-root{margin-inline:auto;max-width:100%;font-family:var(--micro-font-family)}
</style></head><body><main id="fixture"><div id="order-root"></div></main>
<script src="/components/order-schedule/order-schedule.js"></script>
<script>
(() => {
  const q = new URLSearchParams(location.search);
  const root = document.querySelector('#order-root');
  root.style.width = q.get('root') + 'px';
  root.dir = q.get('dir');
  const orders = [
    {id:'one',title:'طلب واحد',date:'2026-10-31',time:'09:15',statusKey:'progress'},
    {id:'many-1',title:'طلب صباحي',date:'2026-10-22',time:'08:00',statusKey:'progress'},
    {id:'many-2',title:'طلب ثانٍ',date:'2026-10-22',time:'09:00',statusKey:'done'},
    {id:'many-3',title:'طلب ثالث',date:'2026-10-22',time:'10:00',statusKey:'hold'},
    {id:'many-4',title:'طلب رابع',date:'2026-10-22',time:'11:00',statusKey:'progress'},
    {id:'many-5',title:'طلب خامس',date:'2026-10-22',time:'12:00',statusKey:'done'},
    {id:'unscheduled',title:'طلب غير مجدول',date:null,statusKey:'progress'}
  ];
  window.fixtureOrders = orders;
  window.events = [];
  ['order-schedule:day-select','order-schedule:order-open','order-schedule:add-request'].forEach(name =>
    root.addEventListener(name, event => window.events.push({name,detail:event.detail})));
  window.instance = MicroOrderSchedule.init(root,{
    orders, today:'2026-10-07', selectedDate:'2026-10-31', weekStart:6,
    statuses:{progress:{label:'قيد التنفيذ',tone:'progress'},done:{label:'مكتمل',tone:'success'},hold:{label:'معلق',tone:'warning'}}
  });
})();
</script></body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if urlparse(self.path).path == "/calendar-fixture.html":
            payload = HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        else:
            super().do_GET()

    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--capture-dir", type=Path,
                        help="save the same initial fixture screenshots to this external directory")
    parser.add_argument("--capture-only", action="store_true",
                        help="capture initial screenshots without running behavioral assertions")
    args = parser.parse_args()
    capture_dir = args.capture_dir
    if capture_dir:
        capture_dir.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/calendar-fixture.html"
    checks = []
    errors = []
    browser_version = "unknown"

    def check(name, result, detail=None):
        checks.append({"name": name, "passed": bool(result), "detail": detail})
        print(("PASS " if result else "FAIL ") + name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            browser_version = browser.version
            page = browser.new_page(viewport={"width": 390, "height": 980}, reduced_motion="reduce")
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            page.on("requestfailed", lambda req: errors.append(req.url))
            page.on("response", lambda res: errors.append(f"{res.status} {res.url}") if res.status >= 400 else None)

            viewport_for_root = {288: 320, 328: 360, 358: 390, 398: 430}
            for root_width, viewport_width in viewport_for_root.items():
                for direction in ("rtl", "ltr"):
                    page.set_viewport_size({"width": viewport_width, "height": 980})
                    page.goto(f"{base}?root={root_width}&dir={direction}", wait_until="load")
                    page.evaluate("document.fonts.ready")
                    layout = page.locator("#order-root").get_attribute("data-ocal-layout")
                    expected = "month-grid" if root_width >= 360 else "date-rail"
                    check(f"{root_width}px root/{viewport_width}px viewport/{direction}: expected layout",
                          layout == expected, {"actual": layout, "expected": expected})
                    check(f"{root_width}px/{direction}: displayed month independent and title available",
                          page.locator(".m-ocal__cal-title [data-ocal-action='month-picker']").count() == 1
                          and "أكتوبر 2026" in page.locator(".m-ocal__cal-title").inner_text())
                    check(f"{root_width}px/{direction}: selected date initially October 31",
                          page.locator("[data-ocal-selected-date='2026-10-31']").count() == 1
                          if root_width < 360 else page.locator("[data-ocal-date='2026-10-31'][aria-selected='true']").count() == 1)
                    if root_width < 360:
                        check(f"{root_width}px/{direction}: rail replaces grid and targets remain 48px",
                              page.locator("[data-ocal-date-rail]").count() == 1
                              and page.locator("[data-ocal-grid]").count() == 0
                              and page.locator("[data-ocal-date-rail] [data-ocal-date]").evaluate_all(
                                  "es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48})"))
                    else:
                        check(f"{root_width}px/{direction}: month grid remains and all day targets are 48px",
                              page.locator("[data-ocal-grid]").count() == 1
                              and page.locator("[data-ocal-grid] [data-ocal-date]").evaluate_all(
                                  "es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48})"))
                    overflow = page.locator("#order-root").evaluate(
                        "e=>({client:e.clientWidth,scroll:e.scrollWidth,document:document.documentElement.scrollWidth})")
                    check(f"{root_width}px/{direction}: component and document have no horizontal overflow",
                          overflow["scroll"] <= overflow["client"] + 1 and overflow["document"] <= viewport_width, overflow)
                    controls_ok = page.locator(
                        "#order-root [data-ocal-action]:not([data-ocal-action='day-cell']):not([data-ocal-action='date-rail-day'])"
                    ).evaluate_all("es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48})")
                    check(f"{root_width}px/{direction}: other visible controls retain 48px targets", controls_ok)
                    if capture_dir:
                        page.screenshot(path=str(capture_dir / f"root-{root_width}-{direction}.png"), full_page=True)

            if args.capture_only:
                browser.close()
                print(f"Captured 8 initial fixture screenshots in {capture_dir}")
                return 0

            # Open, year navigation, choosing a month, Escape, and focus restoration.
            page.goto(f"{base}?root=398&dir=rtl", wait_until="load")
            title = page.locator(".m-ocal__cal-title [data-ocal-action='month-picker']")
            title.click()
            check("picker opens as a real local dialog and receives focus",
                  page.locator("[data-ocal-picker][role='dialog']").count() == 1
                  and page.locator("[data-ocal-picker] [aria-pressed='true']").count() == 1
                  and page.locator(":focus").get_attribute("data-ocal-action") == "picker-month"
                  and page.locator("[data-ocal-picker] [data-ocal-action]").evaluate_all(
                      "es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48})"))
            selected_before = page.locator("[data-ocal-date][aria-selected='true']").get_attribute("data-ocal-date")
            page.locator("[data-ocal-picker] [data-ocal-action='picker-next-year']").click()
            check("year step changes picker year without changing selection",
                  page.locator("[data-ocal-picker]").get_attribute("data-ocal-year") == "2027"
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == selected_before
                  and page.evaluate("events.length") == 0)
            page.locator("[data-ocal-picker] [data-ocal-value='0']").click()
            check("month choice updates displayed month only and returns focus to title",
                  "يناير 2027" in page.locator(".m-ocal__cal-title").inner_text()
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == selected_before
                  and page.evaluate("events.length") == 0
                  and page.evaluate("document.activeElement.matches('.m-ocal__cal-title [data-ocal-action=month-picker]')"))
            title = page.locator(".m-ocal__cal-title [data-ocal-action='month-picker']")
            title.click()
            page.keyboard.press("Escape")
            check("Escape closes local picker and restores focus",
                  page.locator("[data-ocal-picker]").count() == 0
                  and page.evaluate("document.activeElement.matches('.m-ocal__cal-title [data-ocal-action=month-picker]')"))
            title.click()
            page.locator("[data-ocal-picker] [data-ocal-action='picker-back']").click()
            check("picker Back action closes and restores focus",
                  page.locator("[data-ocal-picker]").count() == 0
                  and page.evaluate("document.activeElement.matches('.m-ocal__cal-title [data-ocal-action=month-picker]')"))

            # Gregorian 28/29/30/31 day coverage and year boundary navigation.
            def choose_month(year, month):
                if page.locator("[data-ocal-picker]").count() == 0:
                    page.locator(".m-ocal__cal-title [data-ocal-action='month-picker']").click()
                current = int(page.locator("[data-ocal-picker]").get_attribute("data-ocal-year"))
                while current < year:
                    page.locator("[data-ocal-action='picker-next-year']").click()
                    current += 1
                while current > year:
                    page.locator("[data-ocal-action='picker-prev-year']").click()
                    current -= 1
                page.locator(f"[data-ocal-picker] [data-ocal-value='{month - 1}']").click()
            expected_days = {(2027, 2): 28, (2028, 2): 29, (2027, 4): 30, (2027, 3): 31}
            for (year, month), count in expected_days.items():
                choose_month(year, month)
                actual = page.locator("[data-ocal-grid] [data-ocal-date]").count()
                check(f"{year}-{month:02}: Gregorian month contains {count} days", actual == count, actual)
            choose_month(2027, 12)
            page.locator("[data-ocal-action='next-month']").click()
            check("December-to-January month arrow changes displayed month without selecting",
                  "يناير 2028" in page.locator(".m-ocal__cal-title").inner_text()
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == selected_before
                  and page.evaluate("events.length") == 0)

            # Rail selection leaves displayed month untouched, emits exactly one event.
            page.goto(f"{base}?root=288&dir=rtl", wait_until="load")
            rail_date = page.locator("[data-ocal-date-rail] [data-ocal-date='2026-11-01']")
            check("date rail offers a nearby date across a month boundary", rail_date.count() == 1)
            rail_date.click()
            check("rail date selection changes selectedDate, not displayed month; emits once",
                  page.locator("[data-ocal-selected-date='2026-11-01']").count() == 1
                  and "أكتوبر 2026" in page.locator(".m-ocal__cal-title").inner_text()
                  and page.evaluate("events.length===1&&events[0].name==='order-schedule:day-select'&&events[0].detail.date==='2026-11-01'"))
            rail_focus_before = page.evaluate("document.activeElement.getAttribute('data-ocal-date')")
            page.keyboard.press("ArrowLeft" if page.locator("#order-root").evaluate("e=>getComputedStyle(e).direction==='rtl'") else "ArrowRight")
            check("date rail keyboard navigation moves focus to adjacent date",
                  page.evaluate("document.activeElement.hasAttribute('data-ocal-date')")
                  and page.evaluate("(previous)=>document.activeElement.getAttribute('data-ocal-date')!==previous", rail_focus_before))
            check("month arrow leaves selected date untouched",
                  page.locator(".m-ocal__cal-title").count() == 1)
            page.locator("[data-ocal-action='next-month']").click()
            check("next month changes displayed month only on narrow rail",
                  "نوفمبر 2026" in page.locator(".m-ocal__cal-title").inner_text()
                  and page.locator("[data-ocal-selected-date='2026-11-01']").count() == 1
                  and page.evaluate("events.length===1"))
            page.locator("[data-ocal-action='cal-mode']").click()
            check("real day-mode action remains available without auto-switching",
                  page.locator("#order-root").get_attribute("data-ocal-layout") == "day"
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-11-01"
                  and page.evaluate("document.activeElement.matches('[data-ocal-action=cal-mode]')"))
            page.locator("[data-ocal-action='cal-mode']").click()
            check("returning to month restores compact date rail with selection intact",
                  page.locator("#order-root").get_attribute("data-ocal-layout") == "date-rail"
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-11-01"
                  and page.evaluate("document.activeElement.matches('[data-ocal-action=cal-mode]')"))

            # Component data states and event/data integrity.
            page.goto(f"{base}?root=398&dir=ltr", wait_until="load")
            page.evaluate("instance.setLoading(true)")
            check("loading state remains outside calendar and is announced",
                  page.locator("[data-ocal-status='loading'][role='status']").count() == 1
                  and page.locator("[data-ocal-grid]").count() == 0)
            page.evaluate("instance.setLoading(false);instance.setError(()=>window.retryCalls=(window.retryCalls||0)+1)")
            page.locator("[data-ocal-action='retry']").click()
            check("error and consumer retry callback are available",
                  page.locator("[data-ocal-status='error'][role='alert']").count() == 1
                  and page.evaluate("retryCalls===1"))
            page.evaluate("instance.setError(null);instance.setData([]);instance.setView('list')")
            check("empty list keeps truthful empty state and add action",
                  page.locator("[data-ocal-status='empty']").count() == 1
                  and page.locator("[data-ocal-status='empty'] [data-ocal-action='add']").count() == 1)
            page.evaluate("instance.setData(window.fixtureOrders);instance.setView('calendar');instance.setSelectedDate('2026-10-22')")
            check("one and many order data are preserved in counts and rows",
                  page.locator("[data-ocal-date='2026-10-22']").get_attribute("aria-label").endswith("5 طلبات")
                  and page.locator("[data-ocal-day-panel] [data-ocal-id]").count() == 5)
            check("one-order day count remains visible",
                  page.locator("[data-ocal-date='2026-10-31']").get_attribute("aria-label").endswith("طلب واحد"))

            # Existing grid keyboard navigation continues to move focus, not selection.
            page.goto(f"{base}?root=398&dir=rtl", wait_until="load")
            page.evaluate("instance.setSelectedDate('2026-10-07')")
            day = page.locator("[data-ocal-grid] [data-ocal-date='2026-10-07']")
            day.focus()
            page.keyboard.press("ArrowLeft")
            check("RTL grid ArrowLeft moves focus one day without selecting",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-08'")
                  and page.locator("[data-ocal-date][aria-selected='true']").get_attribute("data-ocal-date") == "2026-10-07"
                  and page.evaluate("events.length===0"),
                  page.evaluate("""()=>({focus:document.activeElement.getAttribute('data-ocal-date'),
                    selected:document.querySelector('[data-ocal-date][aria-selected=true]')?.getAttribute('data-ocal-date'),
                    events:events.length})"""))
            page.keyboard.press("Enter")
            check("grid Enter selects once and emits the existing day-select event",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-08"
                  and page.evaluate("events.length===1&&events[0].detail.date==='2026-10-08'"),
                  page.evaluate("()=>({selected:document.querySelector('#order-root').dataset.ocalSelectedDate,events})"))

            page.goto(f"{base}?root=398&dir=ltr", wait_until="load")
            page.evaluate("instance.setSelectedDate('2026-10-07')")
            day = page.locator("[data-ocal-grid] [data-ocal-date='2026-10-07']")
            day.focus()
            page.keyboard.press("ArrowLeft")
            check("LTR grid ArrowLeft moves focus to previous day",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-06'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-07"
                  and page.evaluate("events.length===0"))

            page.goto(f"{base}?root=398&dir=rtl", wait_until="load")
            page.locator("[data-ocal-grid] [data-ocal-date='2026-10-07']").focus()
            page.locator("#order-root").evaluate("e=>e.style.width='358px'")
            page.wait_for_function("document.querySelector('#order-root').dataset.ocalLayout==='date-rail'")
            check("live resize switches grid to rail and restores equivalent date focus",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-07'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-31")
            page.locator("#order-root").evaluate("e=>e.style.width='398px'")
            page.wait_for_function("document.querySelector('#order-root').dataset.ocalLayout==='month-grid'")
            check("live resize back restores grid focus without selecting",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-07'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-31")

            page.set_viewport_size({"width": 320, "height": 900})
            page.goto(f"http://127.0.0.1:{server.server_port}/components/order-schedule/example-usage.html",
                      wait_until="load")
            page.wait_for_function("document.querySelector('#demo-1').dataset.ocalLayout==='date-rail'")
            check("example title names the actual narrow date-rail presentation",
                  page.locator("#demo-1-title").inner_text() == "1) مسار التواريخ القريبة")
            page.evaluate("__demo1.setCalendarView('day')")
            page.wait_for_function("document.querySelector('#demo-1-title').textContent==='1) عرض اليوم'")
            check("example title follows explicit day mode", page.locator("#demo-1-title").inner_text() == "1) عرض اليوم")
            page.evaluate("__demo1.setView('list')")
            page.wait_for_function("document.querySelector('#demo-1-title').textContent==='1) عرض القائمة'")
            check("example title follows explicit list mode", page.locator("#demo-1-title").inner_text() == "1) عرض القائمة")

            check("no browser, console, or resource errors", not errors, errors)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    passed = sum(row["passed"] for row in checks)
    report = {"browser": browser_version, "passed": passed, "failed": len(checks) - passed,
              "checks": checks, "errors": errors,
              "scope": "Source-only fixture; light appearance; Chromium; no Dark tests or real-device/Safari/screen-reader claims"}
    output = Path(tempfile.gettempdir()) / "micro-light-calendar-check.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{passed} PASS / {len(checks) - passed} FAIL — report {output}")
    return 0 if passed == len(checks) else 1


if __name__ == "__main__":
    raise SystemExit(main())
