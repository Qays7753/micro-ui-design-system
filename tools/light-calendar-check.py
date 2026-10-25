#!/usr/bin/env python3
"""Independent light-only order-schedule browser check (source files only).

Contract under test (2026-10-25 — owner reference calendar-reference-implementation.html
+ calendar-target-latest-owner.png): a real Day/Week/Month selector above the grid; the
month grid carries the month's days plus muted, selectable adjacent-month days (view
follows selection); an always-visible events region for the selected day sits below the
calendar card; Week shows the selected week's seven real days (deriving from selection)
with ±7 navigation; Day shows the selected day's event surface. The week starts on
Sunday by default (weekStart=0 — Sunday-first contract; explicit weekStart values stay
supported). The visible surface is numeric-only: month header «MM / YYYY», full dates
DD/MM/YYYY, no visible month names anywhere (month names remain in aria-labels only).
Weekday headers and grid columns share the exact 100%/7 column geometry inside one
calendar-card surface with restrained dividers. Below a 360px root the grid flips to
the compact presentation (`data-ocal-compact="true"` — CSS-only state, single DOM
structure): cell width (100%)/7 ≥ 24px (WCAG 2.5.8 minimum) with a 48px row height
floor; all command controls stay ≥48px. Browsing a month without a selected day shows
the honest browsing region (`data-ocal-day-browsing`) instead of a contradictory
selected day from another month.

The previous month/day/list selector contract and the expanded/agenda
presentation contract (2026-10-25 morning) were replaced by the owner's
corrective brief: Week must be a real state, the events region is always
visible, and List stays a separate host-invoked surface (setView('list')).
Checks encoding the old contract were updated to the corrected one.

Examples:
  python3 tools/light-calendar-check.py
  python3 tools/light-calendar-check.py --capture-dir /tmp/calendar-after
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
</style></head><body><main id="fixture"><div id="order-root"></div>
<button type="button" id="after-root-focus" style="margin-top:8px">هدف تركيز خارج المكوّن</button>
</main>
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
    {id:'unscheduled',title:'طلب غير مجدول',date:null,statusKey:'progress'},
    {id:'sep-1',title:'طلب سبتمبر',date:'2026-09-15',time:'10:00',statusKey:'progress'},
    {id:'sep-adj',title:'طلب يوم مجاور',date:'2026-09-28',time:'10:30',statusKey:'progress'}
  ];
  window.fixtureOrders = orders;
  window.events = [];
  ['order-schedule:day-select','order-schedule:order-open','order-schedule:add-request',
   'order-schedule:order-edit-request','order-schedule:order-delete-request'].forEach(name =>
    root.addEventListener(name, event => window.events.push({name,detail:event.detail})));
  const withActions = q.get('actions') === '1';
  window.instance = MicroOrderSchedule.init(root,{
    orders, today:'2026-10-07', selectedDate:'2026-10-31',
    orderActions: withActions ? { edit: true, delete: true } : {},
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
                        help="save representative fixture screenshots to this external directory")
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

            # ---------- A) Layout contract at every root width, RTL and LTR ----------
            viewport_for_root = {288: 320, 328: 360, 358: 390, 398: 430}
            for root_width, viewport_width in viewport_for_root.items():
                for direction in ("rtl", "ltr"):
                    page.set_viewport_size({"width": viewport_width, "height": 980})
                    page.goto(f"{base}?root={root_width}&dir={direction}", wait_until="load")
                    page.evaluate("document.fonts.ready")
                    compact = "true" if root_width < 360 else "false"
                    layout = page.locator("#order-root").get_attribute("data-ocal-layout")
                    actual_compact = page.locator("#order-root").get_attribute("data-ocal-compact")
                    check(f"{root_width}px root/{viewport_width}px viewport/{direction}: "
                          f"month-grid layout with compact={compact}",
                          layout == "month-grid" and actual_compact == compact,
                          {"layout": layout, "compact": actual_compact})
                    check(f"{root_width}px/{direction}: complete October grid with muted adjacent-month days",
                          page.locator("[data-ocal-grid] [data-ocal-date^='2026-10']").count() == 31
                          and page.locator("[data-ocal-grid] [data-ocal-date]").count() == 35
                          and page.locator("[data-ocal-grid] .m-ocal__cell--out").count() == 4
                          and page.locator(".m-ocal__weekday").count() == 7,
                          page.locator("[data-ocal-grid] [data-ocal-date]").count())
                    check(f"{root_width}px/{direction}: selected date initially October 31 in the grid",
                          page.locator("[data-ocal-date='2026-10-31'][aria-selected='true']").count() == 1
                          and page.locator("[data-ocal-selected-date='2026-10-31']").count() == 1)
                    cell_floor = ("r.height>=48&&r.width>=24" if root_width < 360
                                  else "r.width>=48&&r.height>=48")
                    cells_ok = page.locator("[data-ocal-grid] [data-ocal-date]").evaluate_all(
                        f"es=>es.every(e=>{{const r=e.getBoundingClientRect();return {cell_floor}}})")
                    check(f"{root_width}px/{direction}: day targets meet the documented "
                          f"{'compact (h>=48, w>=24)' if root_width < 360 else 'wide (48x48)'} contract",
                          cells_ok)
                    overflow = page.locator("#order-root").evaluate(
                        "e=>({client:e.clientWidth,scroll:e.scrollWidth,document:document.documentElement.scrollWidth})")
                    check(f"{root_width}px/{direction}: component and document have no horizontal overflow",
                          overflow["scroll"] <= overflow["client"] + 1 and overflow["document"] <= viewport_width, overflow)
                    controls_ok = page.locator(
                        "#order-root [data-ocal-action]:not([data-ocal-action='day-cell'])"
                    ).evaluate_all("es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48})")
                    check(f"{root_width}px/{direction}: all command controls retain 48px targets", controls_ok)
                    if capture_dir:
                        page.screenshot(path=str(capture_dir / f"root-{root_width}-{direction}.png"), full_page=True)

            if args.capture_only:
                browser.close()
                print(f"Captured 8 fixture screenshots in {capture_dir}")
                return 0

            # ---------- A2) 2026-10-25 cell anatomy + unified control contract ----------
            page.goto(f"{base}?root=288&dir=rtl", wait_until="load")
            check("2026-10-25 anatomy: no counter chip inside month cells (dots-only system)",
                  page.locator(".m-ocal__count").count() == 0
                  and page.locator(".m-ocal__badges").count() == 0)
            check("day with three status types renders exactly three semantic dots",
                  page.locator(".m-ocal__cell[data-ocal-date='2026-10-22'] .m-ocal__dot").count() == 3)
            grouping = page.locator(".m-ocal__cell[data-ocal-date='2026-10-22']").evaluate(
                """cell => {
                    const num = cell.querySelector('.m-ocal__daynum');
                    const dots = cell.querySelector('.m-ocal__dots');
                    if (!num || !dots) return {ok: false, why: 'missing'};
                    const nr = num.getBoundingClientRect();
                    const dr = dots.getBoundingClientRect();
                    const ownGap = dr.top - nr.bottom;
                    const row = cell.closest('[role="row"]');
                    const grid = row.parentElement;
                    const rows = Array.from(grid.querySelectorAll(':scope > [role="row"]'));
                    const idx = rows.indexOf(row);
                    const nextRow = rows[idx + 1];
                    if (!nextRow) return {ok: true, ownGap, nextGap: null};
                    const nextCell = nextRow.children[Array.from(row.children).indexOf(cell)];
                    const nextNum = nextCell && nextCell.querySelector('.m-ocal__daynum');
                    const nextGap = nextNum ? nextNum.getBoundingClientRect().top - dr.bottom : null;
                    return {ok: true, ownGap, nextGap};
                }""")
            check("dots sit directly below their own day number (fixed tight gap)",
                  grouping.get("ok") and grouping.get("ownGap") is not None
                  and 0 <= grouping["ownGap"] <= 5, grouping)
            check("indicator-to-next-row distance exceeds the own-number gap (ambiguity resolved)",
                  grouping.get("nextGap") is not None and grouping["nextGap"] > grouping["ownGap"] + 8,
                  grouping)
            check("unified view segment renders day/week/month with month pressed",
                  page.locator(".m-ocal__viewseg [data-ocal-action='view']").count() == 3
                  and page.locator(".m-ocal__viewseg [data-ocal-value='month'][aria-pressed='true']").count() == 1
                  and page.locator(".m-ocal__viewseg [data-ocal-value='day'][aria-pressed='false']").count() == 1
                  and page.locator(".m-ocal__viewseg [data-ocal-value='week'][aria-pressed='false']").count() == 1
                  and page.locator(".m-ocal__viewseg [data-ocal-value='list']").count() == 0)
            out_num = page.evaluate(
                """() => getComputedStyle(
                        document.querySelector("[data-ocal-grid] .m-ocal__cell--out .m-ocal__daynum"),
                        null).color""")
            out_dots = page.evaluate(
                """() => { const d = document.querySelector("[data-ocal-grid] .m-ocal__cell--out .m-ocal__dot");
                        return d ? getComputedStyle(d).opacity : null; }""")
            check("adjacent-month day is muted: quieter number color and 0.35 dot opacity",
                  out_num is not None and out_num != "rgb(43, 48, 51)" and out_dots == "0.35",
                  {"num": out_num, "dots": out_dots})
            page.locator(".m-ocal__viewseg [data-ocal-value='day']").click()
            check("day segment composes view=calendar with cal-view=day",
                  page.locator("#order-root").get_attribute("data-ocal-view") == "calendar"
                  and page.locator("#order-root").get_attribute("data-ocal-cal-view") == "day"
                  and page.locator("#order-root").get_attribute("data-ocal-layout") == "day"
                  and page.locator(".m-ocal__viewseg [data-ocal-value='day'][aria-pressed='true']").count() == 1)
            page.locator(".m-ocal__viewseg [data-ocal-value='week']").click()
            check("week segment composes view=calendar with cal-view=week (real week state)",
                  page.locator("#order-root").get_attribute("data-ocal-view") == "calendar"
                  and page.locator("#order-root").get_attribute("data-ocal-cal-view") == "week"
                  and page.locator("#order-root").get_attribute("data-ocal-layout") == "week-grid"
                  and page.locator(".m-ocal__viewseg [data-ocal-value='week'][aria-pressed='true']").count() == 1
                  and page.locator("[data-ocal-grid] [role='row']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date]").count() == 7
                  and page.locator("[data-ocal-action='prev-week']").count() == 1
                  and page.locator("[data-ocal-action='next-week']").count() == 1)
            week_range = page.locator(".m-ocal__week-range").inner_text()
            check("week bar carries the selected week's numeric range (Oct 31 week is Sunday-first 25–31/10/2026)",
                  "25–31" in week_range and "10/2026" in week_range,
                  week_range)
            check("week grid holds the selected day and the events region below",
                  page.locator("[data-ocal-grid] [data-ocal-date='2026-10-31'][aria-selected='true']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-11']").count() == 0
                  and "طلبات السبت 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-id='one']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='add']").count() == 1)
            page.locator("[data-ocal-action='next-week']").click()
            check("next-week selects +7 days and emits day-select once (week follows selection)",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-11-07"
                  and page.evaluate("events.length===1&&events[0].name==='order-schedule:day-select'&&events[0].detail.date==='2026-11-07'")
                  and "1–7" in page.locator(".m-ocal__week-range").inner_text()
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-11-07'][aria-selected='true']").count() == 1)
            page.locator("[data-ocal-action='prev-week']").click()
            check("prev-week returns to the Oct 31 week with another announced selection",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-31"
                  and page.evaluate("events.length===2&&events[1].detail.date==='2026-10-31'"))
            page.locator("[data-ocal-grid] [data-ocal-date='2026-10-25']").click()
            check("clicking the week row's Sunday (logical first day) selects it with a numeric title",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-25"
                  and page.evaluate("events.length===3&&events[2].detail.date==='2026-10-25'")
                  and "طلبات الأحد 25/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text())
            page.locator(".m-ocal__viewseg [data-ocal-value='month']").click()
            check("month segment returns to the full month grid of the selected month",
                  page.locator("#order-root").get_attribute("data-ocal-view") == "calendar"
                  and page.locator("#order-root").get_attribute("data-ocal-cal-view") == "month"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-10']").count() == 31
                  and page.locator("[data-ocal-grid] [data-ocal-date]").count() == 35)
            check("muted leading September day is present and selectable in October view",
                  page.evaluate("document.querySelector(\"[data-ocal-grid] [data-ocal-date='2026-09-28']\").classList.contains('m-ocal__cell--out')")
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-09-28']").count() == 1)
            page.locator("[data-ocal-grid] [data-ocal-date='2026-09-28']").click()
            check("clicking the muted out-month day selects it and follows it into its month",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-09-28"
                  and page.evaluate("events.length===4&&events[3].detail.date==='2026-09-28'")
                  and page.locator(".m-ocal__month-num").first.inner_text() == "09"
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0)
            page.evaluate("instance.setSelectedDate('2026-10-07')")
            hierarchy = page.evaluate(
                """() => {
                    const trig = document.querySelector('.m-ocal__month-trigger');
                    const mn = trig.querySelector('.m-ocal__month-num');
                    const yr = trig.querySelector('.m-ocal__year');
                    return {
                        text: trig.textContent.trim(),
                        month: mn ? getComputedStyle(mn).fontSize : null,
                        year: yr ? getComputedStyle(yr).fontSize : null,
                        monthWeight: mn ? getComputedStyle(mn).fontWeight : null,
                        yearWeight: yr ? getComputedStyle(yr).fontWeight : null,
                        chevron: !!trig.querySelector('svg')
                    };
                }""")
            check("numeric month header hierarchy: MM primary (18px/600), year secondary (14px/400), picker chevron present",
                  hierarchy["text"] == "10 / 2026" and hierarchy["month"] == "18px"
                  and hierarchy["year"] == "14px" and hierarchy["monthWeight"] == "600"
                  and hierarchy["yearWeight"] == "400" and hierarchy["chevron"] is True,
                  hierarchy)
            today_num = page.locator(".m-ocal__cell[data-ocal-date='2026-10-07'] .m-ocal__daynum")
            today_weight = today_num.evaluate("n=>getComputedStyle(n).fontWeight")
            today_dot = page.evaluate(
                """() => getComputedStyle(
                        document.querySelector(".m-ocal__cell[data-ocal-date='2026-10-07'] .m-ocal__daynum"),
                        '::after').content""")
            check("today = ring + semibold number with no under-dot (two focused marks)",
                  today_weight == "600" and today_dot == "none")
            sel_fill = page.locator(".m-ocal__cell--selected").evaluate(
                "c=>getComputedStyle(c).backgroundColor")
            check("selected day keeps the solid petrol fill (single strongest act)",
                  sel_fill == "rgb(22, 77, 89)", sel_fill)

            # ---------- B) Picker contract (wide root) ----------
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
                  page.locator(".m-ocal__month-num").first.inner_text() == "01" and page.locator(".m-ocal__year").first.inner_text() == "2027"
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == selected_before
                  and page.evaluate("events.length") == 0
                  and page.evaluate("document.activeElement.matches('.m-ocal__cal-title [data-ocal-action=month-picker]')"))
            check("browsing January 2027 without a selected day shows the honest browsing panel",
                  page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1
                  and "لا يوم محدد في 01/2027" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.locator("[data-ocal-day-panel] .m-ocal__row").count() == 0)
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

            # ---------- C) Gregorian month lengths and December/January ----------
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
                actual = page.locator(f"[data-ocal-grid] [data-ocal-date^='{year}-{month:02}']").count()
                check(f"{year}-{month:02}: Gregorian month contains {count} days", actual == count, actual)
            choose_month(2027, 12)
            page.locator("[data-ocal-action='next-month']").click()
            check("December-to-January month arrow changes displayed month without selecting",
                  page.locator(".m-ocal__month-num").first.inner_text() == "01" and page.locator(".m-ocal__year").first.inner_text() == "2028"
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == selected_before
                  and page.evaluate("events.length") == 0
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2028-01']").count() == 31)

            # ---------- D) Month coherence, browsing honesty and selection (compact root) ----------
            page.goto(f"{base}?root=288&dir=rtl", wait_until="load")
            check("compact initial state: October grid complete, selected day events region shown",
                  page.locator("#order-root").get_attribute("data-ocal-compact") == "true"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-10']").count() == 31
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0
                  and "طلبات السبت 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text())
            page.locator("[data-ocal-action='prev-month']").click()
            check("prev-month from October: heading, grid and events region describe September coherently",
                  page.locator(".m-ocal__month-num").first.inner_text() == "09" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-09']").count() == 30
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-09-01']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-09-30']").count() == 1
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1
                  and "لا يوم محدد في 09/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-31"
                  and page.evaluate("events.length") == 0)
            browsing_add = page.locator("[data-ocal-day-browsing] [data-ocal-action='add']")
            browsing_add.click()
            check("add request in a browsed month without selection emits date:null honestly",
                  page.evaluate("events.length===1&&events[0].name==='order-schedule:add-request'&&events[0].detail.date===null"),
                  page.evaluate("JSON.stringify(events)"))
            page.locator("[data-ocal-action='next-month']").click()
            check("next-month returns to October and restores the selected day events region",
                  page.locator(".m-ocal__month-num").first.inner_text() == "10" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0
                  and "طلبات السبت 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.evaluate("events.length") == 1)
            page.locator("[data-ocal-grid] [data-ocal-date='2026-10-22']").click()
            check("selecting a day in the displayed month updates selection and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-22"
                  and page.evaluate("events.length===2&&events[1].name==='order-schedule:day-select'&&events[1].detail.date==='2026-10-22'")
                  and "طلبات الخميس 22/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and "5 طلبات" in page.locator(".m-ocal__daypanel-count").inner_text())
            page.locator("[data-ocal-action='prev-month']").click()
            page.locator("[data-ocal-grid] [data-ocal-date='2026-09-15']").click()
            check("date selection after browsing another month selects, emits, and leaves browsing state",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-09-15"
                  and page.evaluate("events.length===3&&events[2].detail.date==='2026-09-15'")
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0
                  and "طلبات الثلاثاء 15/09/2026" in page.locator(".m-ocal__daypanel-title").inner_text())
            day_add = page.locator("[data-ocal-day-panel] [data-ocal-action='add']")
            day_add.click()
            check("add request with a selected day emits that day",
                  page.evaluate("events.length===4&&events[3].name==='order-schedule:add-request'&&events[3].detail.date==='2026-09-15'"))

            # Keyboard on the compact grid: focus movement, month crossing, no phantom selection.
            page.locator("[data-ocal-grid] [data-ocal-date='2026-09-15']").focus()
            page.keyboard.press("ArrowLeft")  # RTL: left = next day
            check("compact grid RTL ArrowLeft moves focus without selecting",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-09-16'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-09-15"
                  and page.evaluate("events.length") == 4)
            for _ in range(15):  # 2026-09-16 -> ... -> 2026-09-30 -> 2026-10-01
                page.keyboard.press("ArrowLeft")
            check("compact grid focus crossing the month boundary updates month and focus only",
                  page.locator(".m-ocal__month-num").first.inner_text() == "10" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-01'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-09-15"
                  and page.evaluate("events.length") == 4
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1)
            page.keyboard.press("Enter")
            check("compact grid Enter selects the focused day and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-01"
                  and page.evaluate("events.length===5&&events[4].detail.date==='2026-10-01'")
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0)

            # Live resize flips the compact flag without losing focus (single DOM structure).
            page.locator("#order-root").evaluate("e=>e.style.width='398px'")
            page.wait_for_function("document.querySelector('#order-root').dataset.ocalCompact==='false'")
            check("live resize to wide flips compact flag and keeps the focused date element",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-01'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-01"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-10']").count() == 31)
            page.locator("#order-root").evaluate("e=>e.style.width='288px'")
            page.wait_for_function("document.querySelector('#order-root').dataset.ocalCompact==='true'")
            check("live resize back to compact keeps focus and selection without re-render",
                  page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-01'")
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-01")

            # Compact December→January across the year boundary.
            choose_month(2026, 12)
            check("compact picker reaches December 2026 with 31 days and honest browsing panel",
                  page.locator(".m-ocal__month-num").first.inner_text() == "12" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-12']").count() == 31
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1)
            page.locator("[data-ocal-action='next-month']").click()
            check("compact December-to-January arrow crosses the year boundary coherently",
                  page.locator(".m-ocal__month-num").first.inner_text() == "01" and page.locator(".m-ocal__year").first.inner_text() == "2027"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2027-01']").count() == 31
                  and page.locator("[data-ocal-grid] [data-ocal-date='2027-01-01']").count() == 1
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-01"
                  and page.evaluate("events.length") == 5)

            # ---------- E) Component data states and event/data integrity ----------
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
            check("one and many order data are preserved in counts, rows, and summarized statuses",
                  page.locator("[data-ocal-date='2026-10-22']").get_attribute("aria-label").endswith(
                      "5 طلبات (قيد التنفيذ، مكتمل، معلق)")
                  and page.locator("[data-ocal-day-panel] [data-ocal-id]").count() == 5)
            check("one-order day count and status remain visible",
                  page.locator("[data-ocal-date='2026-10-31']").get_attribute("aria-label").endswith(
                      "طلب واحد (قيد التنفيذ)"))

            # ---------- F) Wide grid keyboard navigation (RTL/LTR) ----------
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

            # ---------- H) Events region contract, week keyboard, day-entry actions ----------
            # عقد 2026-10-25 (مرجع المالك calendar-reference-implementation.html):
            # منطقة أحداث اليوم المحدد ظاهرة دائمًا أسفل الشبكة («Events today»)،
            # والأسبوع حالة فاعلة مشتقة من التحديد؛ أفعال تعديل/حذف host-owned
            # على صفوف سطح فعل اليوم؛ لا زر عائم ولا Bottom Sheet في هذا المسار.
            page.goto(f"{base}?root=358&dir=rtl&actions=1", wait_until="load")
            check("month view: events region below the grid with title, count, add and rows",
                  page.locator("[data-ocal-grid]").count() == 1
                  and page.locator("[data-ocal-day-panel]").count() == 1
                  and "طلبات السبت 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and "طلب واحد" in page.locator(".m-ocal__daypanel-count").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='add']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").count() == 1)
            check("events region exposes host-owned edit/delete row actions at 48px",
                  page.locator("[data-ocal-day-panel] [data-ocal-action='order-edit']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-delete']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-edit']")
                      .evaluate("e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48}")
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-delete']")
                      .evaluate("e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48}"))
            # عقد احتواء 2026-10-25 (تصحيح هندسة ضيق): سطح الشريط الخارجي
            # (حد/تعبئة/زوايا) على حاوية الصف m-ocal__rowitem--tools ممتدًا
            # خلف زرّي التعديل/حذف ويطوّقهما؛ الزران دائرتان منفصلتان 48×48
            # بموضعهما المنطقي نفسه، ومنطقة المحتوى بلا سطح خاص و≥ 48px.
            containment = page.evaluate("""() => {
                const li = document.querySelector('[data-ocal-day-panel] .m-ocal__rowitem--tools');
                if (!li) return {present: false};
                const row = li.querySelector('.m-ocal__row');
                const tools = li.querySelector('.m-ocal__row-tools');
                const lr = li.getBoundingClientRect();
                const rr = row.getBoundingClientRect();
                const tr = tools.getBoundingClientRect();
                const lis = getComputedStyle(li), rs = getComputedStyle(row);
                return {
                  present: true,
                  barSurface: lis.backgroundColor + '/' + lis.borderTopWidth + '/' + lis.borderTopLeftRadius,
                  contentSurface: rs.backgroundColor + '/' + rs.borderTopWidth,
                  toolsInside: tr.x >= lr.x - 1 && tr.y >= lr.y - 1
                    && tr.x + tr.width <= lr.x + lr.width + 1
                    && tr.y + tr.height <= lr.y + lr.height + 1,
                  contentInside: rr.x >= lr.x - 1 && rr.y >= lr.y - 1
                    && rr.x + rr.width <= lr.x + lr.width + 1
                    && rr.y + rr.height <= lr.y + lr.height + 1,
                  toolsAtLogicalEnd: getComputedStyle(document.querySelector('#order-root')).direction === 'rtl'
                    ? tr.x < rr.x : tr.x > rr.x,
                  contentHitHeight: rr.height >= 48
                };
            }""")
            check("order-bar containment: outer bar surface wraps content and both circular tools",
                  containment["present"]
                  and containment["barSurface"].startswith("rgb(")
                  and containment["barSurface"].split("/")[1] == "1px"
                  and containment["barSurface"].split("/")[2] == "12px"
                  and containment["contentSurface"].startswith("rgba(0, 0, 0, 0)")
                  and containment["toolsInside"] and containment["contentInside"]
                  and containment["toolsAtLogicalEnd"]
                  and containment["contentHitHeight"], containment)
            page.locator("[data-ocal-day-panel] [data-ocal-action='order-edit']").click()
            check("row edit action emits the host-owned edit-request event once",
                  page.evaluate("events.length===1&&events[0].name==='order-schedule:order-edit-request'&&events[0].detail.id==='one'"))
            page.locator("[data-ocal-day-panel] [data-ocal-action='order-delete']").click()
            check("row delete action emits the host-owned delete-request event once",
                  page.evaluate("events.length===2&&events[1].name==='order-schedule:order-delete-request'&&events[1].detail.id==='one'"))
            check("no floating add control and no bottom-sheet layer exist in this flow",
                  page.locator(".m-ocal__fab, .m-ocal__sheet, [role='dialog'][data-ocal-sheet]").count() == 0
                  and page.evaluate("(()=>{const s=getComputedStyle(document.querySelector('.m-ocal'));"
                                    "return !s.position||s.position!=='fixed';})()"))

            # اليوم الحالي: عنوان «طلبات اليوم» يعكس تحديد اليوم الحالي
            page.evaluate("instance.setSelectedDate('2026-10-07')")
            check("today's events region uses the اليوم wording (Events today equivalent)",
                  page.locator(".m-ocal__daypanel-title").inner_text() == "طلبات اليوم")

            # يوم فارغ: حالة فراغ صادقة داخل منطقة الأحداث + الإضافة في مكانها
            page.evaluate("instance.setSelectedDate('2026-10-02')")
            check("empty selected day keeps an honest empty state with the add action in region",
                  page.locator("[data-ocal-day-panel] [data-ocal-status='empty']").count() == 1
                  and "لا طلبات في هذا اليوم" in page.locator("[data-ocal-day-panel]").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='add']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row']").count() == 0)

            # لوحة مفاتيح الأسبوع: الأسهم تختار (±1/±7) والتركيز يتبع التحديد
            page.evaluate("instance.setSelectedDate('2026-10-22');instance.setCalendarView('week')")
            check("week view derives its row from the selected date (Oct 22 week, Sunday-first)",
                  page.locator("[data-ocal-grid] [data-ocal-date]").count() == 7
                  and "18–24" in page.locator(".m-ocal__week-range").inner_text()
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-22'][aria-selected='true']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-18']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-24']").count() == 1
                  and "طلبات الخميس 22/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row']").count() == 5)
            week_cell = page.locator("[data-ocal-grid] [data-ocal-date='2026-10-22']")
            week_cell.focus()
            page.keyboard.press("ArrowLeft")  # RTL: left = next day
            check("week RTL ArrowLeft steps the selection one day and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-23"
                  and page.evaluate("events.length===3&&events[2].name==='order-schedule:day-select'&&events[2].detail.date==='2026-10-23'")
                  and page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-23'"))
            page.keyboard.press("ArrowDown")
            check("week ArrowDown steps the selection one week (+7) and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-30"
                  and page.evaluate("events.length===4&&events[3].detail.date==='2026-10-30'")
                  and "25–31" in page.locator(".m-ocal__week-range").inner_text())
            page.keyboard.press("ArrowUp")
            check("week ArrowUp steps the selection one week back (-7) and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-23"
                  and page.evaluate("events.length===5&&events[4].detail.date==='2026-10-23'"))
            page.keyboard.press("Home")
            check("week Home selects the first (Sunday) day of the shown week",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-18"
                  and page.evaluate("events.length===6&&events[5].detail.date==='2026-10-18'"))
            page.keyboard.press("End")
            check("week End selects the last (Saturday) day of the shown week",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-24"
                  and page.evaluate("events.length===7&&events[6].detail.date==='2026-10-24'"))

            # «اليوم» في عرض الأسبوع ينقل إلى أسبوع اليوم الحالي بتحديد معلن
            page.locator("[data-ocal-action='today']").click()
            check("today button in week view jumps to today's week with an announced selection",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-07"
                  and page.evaluate("events.length===8&&events[7].name==='order-schedule:day-select'&&events[7].detail.date==='2026-10-07'")
                  and "4–10" in page.locator(".m-ocal__week-range").inner_text()
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-07'][aria-current='date']").count() == 1
                  and page.locator(".m-ocal__daypanel-title").inner_text() == "طلبات اليوم")

            # عرض اليوم: شريط اليوم + منطقة أحداثه (العنوان في الشريط — لا عنوان مكرر)
            page.locator(".m-ocal__viewseg [data-ocal-value='day']").click()
            check("day view keeps the day bar with prev/next/today and the events region",
                  page.locator("[data-ocal-action='prev-day']").count() == 1
                  and page.locator("[data-ocal-action='next-day']").count() == 1
                  and page.locator("[data-ocal-action='today']").count() == 1
                  and "الأربعاء 07/10/2026" in page.locator(".m-ocal__cal-title").inner_text()
                  and page.locator("[data-ocal-day-panel]").count() == 1
                  and "لا طلبات في هذا اليوم" in page.locator("[data-ocal-day-panel]").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='add']").count() == 1
                  and page.locator("[data-ocal-grid]").count() == 0)
            page.locator("[data-ocal-action='next-day']").click()
            check("next-day in day view announces the new selected day",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-08"
                  and page.evaluate("events.length===9&&events[8].detail.date==='2026-10-08'"))

            # LTR: أسبوع بترتيب معكوس وفعالية كاملة للمحدّد
            page.goto(f"{base}?root=398&dir=ltr&actions=1", wait_until="load")
            page.locator(".m-ocal__viewseg [data-ocal-value='week']").click()
            check("LTR week view renders the selected week with the events region",
                  page.locator("[data-ocal-grid] [data-ocal-date]").count() == 7
                  and "25–31" in page.locator(".m-ocal__week-range").inner_text()
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-31'][aria-selected='true']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-edit']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-delete']").count() == 1)
            ltr_containment = page.evaluate("""() => {
                const li = document.querySelector('[data-ocal-day-panel] .m-ocal__rowitem--tools');
                if (!li) return {present: false};
                const row = li.querySelector('.m-ocal__row');
                const tools = li.querySelector('.m-ocal__row-tools');
                const lr = li.getBoundingClientRect();
                const rr = row.getBoundingClientRect();
                const tr = tools.getBoundingClientRect();
                return {
                  present: true,
                  toolsInside: tr.x >= lr.x - 1 && tr.x + tr.width <= lr.x + lr.width + 1,
                  toolsAtLogicalEnd: tr.x > rr.x,
                  barSurface: getComputedStyle(li).backgroundColor
                };
            }""")
            check("LTR order-bar containment keeps tools inside the bar at the logical end",
                  ltr_containment["present"]
                  and ltr_containment["toolsInside"]
                  and ltr_containment["toolsAtLogicalEnd"]
                  and ltr_containment["barSurface"].startswith("rgb("), ltr_containment)
            ltr_week_cell = page.locator("[data-ocal-grid] [data-ocal-date='2026-10-31']")
            ltr_week_cell.focus()
            page.keyboard.press("ArrowLeft")  # LTR: left = previous day
            check("LTR week ArrowLeft steps the selection to the previous day",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-30"
                  and page.evaluate("events.length===1&&events[0].detail.date==='2026-10-30'"))
            add_btn = page.locator("[data-ocal-day-panel] [data-ocal-action='add']")
            add_btn.click()
            check("events region add button emits add-request with the selected day",
                  page.evaluate("events.length===2&&events[1].name==='order-schedule:add-request'&&events[1].detail.date==='2026-10-30'"))
            overflow = page.locator("#order-root").evaluate(
                "e=>({client:e.clientWidth,scroll:e.scrollWidth,document:document.documentElement.scrollWidth})")
            check("week view has no horizontal overflow at wide root",
                  overflow["scroll"] <= overflow["client"] + 1, overflow)

            # Loading/error keep the selector usable (R-13)
            page.evaluate("instance.setLoading(true)")
            check("loading keeps the view selector usable above the status box",
                  page.locator("[data-ocal-status='loading'][role='status']").count() == 1
                  and page.locator(".m-ocal__viewseg-btn[aria-pressed='true']").count() == 1
                  and page.locator("[data-ocal-grid]").count() == 0)
            page.evaluate("instance.setLoading(false);instance.setError(()=>{})")
            check("error keeps the view selector usable and retry reachable",
                  page.locator("[data-ocal-status='error'][role='alert']").count() == 1
                  and page.locator(".m-ocal__viewseg-btn[aria-pressed='true']").count() == 1
                  and page.locator("[data-ocal-action='retry']").count() == 1)

            # Picker focus recovery: tabbing away closes it honestly (R-14)
            page.evaluate("instance.setError(null);instance.setView('calendar');instance.setCalendarView('month')")
            page.locator(".m-ocal__cal-title [data-ocal-action='month-picker']").click()
            check("picker opens with aria-expanded and dialog role",
                  page.locator("[data-ocal-picker][role='dialog']").count() == 1
                  and page.locator("[data-ocal-action='month-picker']").get_attribute("aria-expanded") == "true")
            page.locator("#after-root-focus").focus()
            page.wait_for_timeout(80)
            check("focus leaving the component closes the picker honestly with updated aria-expanded",
                  page.locator("[data-ocal-picker]").count() == 0
                  and page.locator("[data-ocal-action='month-picker']").get_attribute("aria-expanded") == "false")

            # Destroy: يزيل كل سمات العقد الحالية
            page.evaluate("window.instance.destroy()")
            check("destroy removes all contract attributes and content",
                  page.evaluate("(()=>{const r=document.querySelector('#order-root');"
                                "return ['data-ocal-root','data-ocal-init','data-ocal-layout','data-ocal-compact',"
                                "'data-ocal-selected-date','data-ocal-view','data-ocal-cal-view']"
                                ".every(a=>!r.hasAttribute(a)) && r.children.length===0 && !r.classList.contains('m-ocal');})()"))

            # ---------- I) Example page follows the compact contract ----------
            page.set_viewport_size({"width": 320, "height": 900})
            page.goto(f"http://127.0.0.1:{server.server_port}/components/order-schedule/example-usage.html",
                      wait_until="load")
            page.wait_for_function("document.querySelector('#demo-1').dataset.ocalCompact==='true'")
            check("example title names the actual compact month presentation",
                  page.locator("#demo-1-title").inner_text() == "1) شبكة الشهر المدمجة")
            page.evaluate("__demo1.setCalendarView('day')")
            page.wait_for_function("document.querySelector('#demo-1-title').textContent==='1) عرض اليوم'")
            check("example title follows explicit day mode", page.locator("#demo-1-title").inner_text() == "1) عرض اليوم")
            page.evaluate("__demo1.setCalendarView('week')")
            page.wait_for_function("document.querySelector('#demo-1-title').textContent==='1) عرض الأسبوع'")
            check("example title follows explicit week mode", page.locator("#demo-1-title").inner_text() == "1) عرض الأسبوع")
            check("example week demo initializes in the week presentation",
                  page.locator("#demo-2[data-ocal-cal-view='week']").count() == 1
                  and page.locator("#demo-2 [data-ocal-grid] [data-ocal-date]").count() == 7)
            check("example day demo initializes in the day presentation",
                  page.locator("#demo-3[data-ocal-cal-view='day']").count() == 1
                  and page.locator("#demo-3 [data-ocal-action='prev-day']").count() == 1)
            page.evaluate("__demo1.setView('list')")
            page.wait_for_function("document.querySelector('#demo-1-title').textContent==='1) عرض القائمة'")
            check("example title follows explicit list mode", page.locator("#demo-1-title").inner_text() == "1) عرض القائمة")

            # ---------- J) Sunday-first + numeric-only presentation (2026-10-25 visual fidelity) ----------
            # عقد 2026-10-25 (calendar-target-latest-owner.png): الأسبوع يبدأ
            # الأحد افتراضيًا في الاتجاهين (RTL يعكس الصف المنطقي بلا عكس
            # التواريخ)، والسطح المرئي أرقام فقط (MM / YYYY وDD/MM/YYYY)
            # بلا أسماء أشهر ظاهرة، وبطاقة تقويم بفواصل رقيقة أعمدة/صفوف
            # ورأس أيام محاذٍ تمامًا لأعمدة الشبكة.
            for direction in ("rtl", "ltr"):
                page.goto(f"{base}?root=358&dir={direction}", wait_until="load")
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(40)
                header = page.evaluate("""() => {
                    window.__cx = e => { const r = e.getBoundingClientRect(); return r.x + r.width / 2; };
                    const ws = Array.from(document.querySelectorAll('.m-ocal__weekday'));
                    const firstRow = document.querySelector('[data-ocal-grid] [role=row]');
                    const cells = Array.from(firstRow.querySelectorAll('.m-ocal__cell'));
                    const card = document.querySelector('.m-ocal__calcard');
                    const cs = card ? getComputedStyle(card) : null;
                    const mid = ws[3];
                    const midCell = cells[3];
                    const second = ws[1];
                    const secondCell = cells[1];
                    return {
                        first: ws[0] ? ws[0].textContent : null,
                        seventh: ws[6] ? ws[6].textContent : null,
                        firstIsSunday: ws[0] && ws[0].textContent === 'أحد',
                        seventhIsSaturday: ws[6] && ws[6].textContent === 'سبت',
                        centerOf: e => { const r = e.getBoundingClientRect(); return r.x + r.width / 2; },
                        aligned: mid && midCell && Math.abs(window.__cx(mid) - window.__cx(midCell)) < 1.5
                          && second && secondCell && Math.abs(window.__cx(second) - window.__cx(secondCell)) < 1.5,
                        cardPresent: !!card,
                        cardBg: cs ? cs.backgroundColor : null,
                        cardBorder: cs ? cs.borderTopWidth : null,
                        cardRadius: cs ? cs.borderTopLeftRadius : null,
                        cardOverflow: cs ? cs.overflow : null,
                        cellDivider: secondCell ? getComputedStyle(secondCell).borderInlineStartWidth : null,
                        firstColNoDivider: cells[0] ? getComputedStyle(cells[0]).borderInlineStartWidth : null,
                        headerRule: ws[0] ? getComputedStyle(ws[0].parentElement).borderBlockEndWidth : null,
                        monthNum: (document.querySelector('.m-ocal__month-num') || {}).textContent || null,
                        triggerText: document.querySelector('.m-ocal__month-trigger').textContent.trim(),
                        monthNameGone: !document.querySelector('.m-ocal__month-name'),
                        eventsTitleNumeric: /^[\\u0621-\\u064A]+ \\d{2}\\/\\d{2}\\/\\d{4}$/.test(
                          document.querySelector('.m-ocal__daypanel-title').textContent.trim()
                            .replace(/^طلبات\s+/, ''))
                    };
                }""")
                check(f"{direction}: Sunday-first weekday header in both directions (أحد..سبت logical order)",
                      header["firstIsSunday"] and header["seventhIsSaturday"] and header["first"] == "أحد",
                      {"first": header["first"], "seventh": header["seventh"]})
                check(f"{direction}: weekday header columns align exactly with grid date columns",
                      header["aligned"], header)
                check(f"{direction}: calendar card surface with restrained token-driven border/radius/elevation",
                      header["cardPresent"] and header["cardBorder"] == "1px"
                      and header["cardRadius"] == "16px" and header["cardOverflow"] == "hidden"
                      and header["cardBg"].startswith("rgb("), header)
                check(f"{direction}: restrained grid dividers (second column ruled, first column open, header rule present)",
                      header["cellDivider"] == "1px" and header["firstColNoDivider"] == "0px"
                      and header["headerRule"] == "1px", header)
                check(f"{direction}: numeric-only visible calendar surface (no visible month names)",
                      header["monthNameGone"] and header["monthNum"] == "10"
                      and header["triggerText"] == "10 / 2026"
                      and header["eventsTitleNumeric"], header)

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
