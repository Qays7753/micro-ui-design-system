#!/usr/bin/env python3
"""Independent light-only order-schedule browser check (source files only).

Contract under test (2026-10-26 — owner "final numeric Calendar and full showcase"
brief, superseding the 2026-10-25 month-name refinement where they conflict):
a real Day/Week/Month selector above the grid; the month grid carries the month's
days plus muted, selectable adjacent-month days (view follows selection); an
always-visible events region for the selected day sits below the calendar card;
Week shows the selected week's seven real days with ±7 navigation; Day shows the
selected day's event surface. The week starts on Sunday by default. The visible
surface is NUMERIC-ONLY: month header «MM / YYYY» (e.g. 10 / 2026), full dates
DD/MM/YYYY, and NO visible Arabic or English month names anywhere (accessible
names are numeric too: cells «07/10/2026، طلبان», picker options «10 / 2026»).
A built-in Calendar/List mode toggle (data-ocal-action="mode-toggle") switches
the orders surface between calendar mode (viewseg + grid + events) and list
mode (grouped sections) with truthful aria-pressed. Order rows are a single-open
inline accordion: the whole card is the trigger (aria-expanded + aria-controls),
the expanded region (role=region) renders INSIDE the same row with the full
details plus Edit/Delete actions (when orderActions is enabled) — never a
detached global details box below the list. Weekday headers and grid columns
share the exact 100%/7 column geometry inside one calendar-card surface with
no inner grid lines. Below a 360px root the grid flips to the compact
presentation. Browsing a month without a selected day shows the honest browsing
region (numeric month).

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
    {id:'sep-1',title:'طلب أرشيف قديم',date:'2026-09-15',time:'10:00',statusKey:'progress'},
    {id:'sep-adj',title:'طلب يوم مجاور',date:'2026-09-28',time:'10:30',statusKey:'progress'}
  ];
  /* عقد 2026-10-26 (اختبارات العدد 1/2/20/100): طلبات إضافية حتمية
     على اليوم المحدد مبدئيًا (10-31) عبر معامل extra — عناوين عربية
     طويلة عند long=1 لاختبار القطع على الوجه والالتفاف في المنطقة. */
  const extra = parseInt(q.get('extra') || '0', 10) || 0;
  for (let i = 0; i < extra; i++) {
    const times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
                   '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30'];
    const keys = ['progress','done','hold'];
    orders.push({
      id: 'x-' + (i + 1),
      title: (q.get('long') === '1' && i === 0)
        ? 'طلب ضيافة استقبال شركة الوفادة المرافقة لوفد المنطقة الغربية مع تجهيز القاعة الرئيسية والمستلزمات الكاملة للفعالية المقامة يوم الخميس القادم بتجهيزات صباحية إضافية'
        : 'طلب إضافي رقم ' + (i + 1),
      date: '2026-10-31',
      time: times[i % times.length],
      statusKey: keys[i % keys.length]
    });
  }
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
                    ).evaluate_all("es=>es.every(e=>{const r=e.getBoundingClientRect();"
                                  "return e.getAttribute('data-ocal-action')==='view'"
                                  "? (r.width>=48&&r.height>=40)"
                                  ": (r.width>=48&&r.height>=48);})")
                    check(f"{root_width}px/{direction}: command controls keep 48px targets (segments 40px inside the 48px track)", controls_ok)
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
            check("indicator-to-next-row distance exceeds the own-number gap (fixed anatomy separation)",
                  grouping.get("nextGap") is not None and grouping["nextGap"] > grouping["ownGap"] + 4,
                  grouping)
            check("unified view segment renders day/week/month as tabs with month selected",
                  page.locator(".m-ocal__viewseg [data-ocal-action='view']").count() == 3
                  and page.locator(".m-ocal__viewseg [data-ocal-value='month'][aria-selected='true']").count() == 1
                  and page.locator(".m-ocal__viewseg [data-ocal-value='day'][aria-selected='false']").count() == 1
                  and page.locator(".m-ocal__viewseg [data-ocal-value='week'][aria-selected='false']").count() == 1
                  and page.locator(".m-ocal__viewseg [data-ocal-value='list']").count() == 0)
            out_num = page.evaluate(
                """() => getComputedStyle(
                        document.querySelector("[data-ocal-grid] .m-ocal__cell--out .m-ocal__daynum"),
                        null).color""")
            out_dots = page.evaluate(
                """() => { const d = document.querySelector("[data-ocal-grid] .m-ocal__cell--out .m-ocal__dot");
                        return d ? getComputedStyle(d).opacity : null; }""")
            check("adjacent-month day is muted: disabled number color and 0.4 dot opacity",
                  out_num is not None and out_num == "rgb(83, 103, 107)" and out_dots == "0.4",
                  {"num": out_num, "dots": out_dots})
            page.locator(".m-ocal__viewseg [data-ocal-value='day']").click()
            check("day segment composes view=calendar with cal-view=day",
                  page.locator("#order-root").get_attribute("data-ocal-view") == "calendar"
                  and page.locator("#order-root").get_attribute("data-ocal-cal-view") == "day"
                  and page.locator("#order-root").get_attribute("data-ocal-layout") == "day"
                  and page.locator(".m-ocal__viewseg [data-ocal-value='day'][aria-selected='true']").count() == 1)
            page.locator(".m-ocal__viewseg [data-ocal-value='week']").click()
            check("week segment composes view=calendar with cal-view=week (real week state)",
                  page.locator("#order-root").get_attribute("data-ocal-view") == "calendar"
                  and page.locator("#order-root").get_attribute("data-ocal-cal-view") == "week"
                  and page.locator("#order-root").get_attribute("data-ocal-layout") == "week-grid"
                  and page.locator(".m-ocal__viewseg [data-ocal-value='week'][aria-selected='true']").count() == 1
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
                  and "طلبات 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
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
                  and "طلبات 25/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text())
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
                  and page.locator(".m-ocal__month-label").first.inner_text() == "09"
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0)
            page.evaluate("instance.setSelectedDate('2026-10-31')")
            hierarchy = page.evaluate(
                """() => {
                    const trig = document.querySelector('.m-ocal__month-trigger');
                    const mn = trig.querySelector('.m-ocal__month-label');
                    const yr = trig.querySelector('.m-ocal__year');
                    return {
                        text: trig.textContent.trim().replace(/\\s+/g, ' '),
                        month: mn ? getComputedStyle(mn).fontSize : null,
                        year: yr ? getComputedStyle(yr).fontSize : null,
                        monthWeight: mn ? getComputedStyle(mn).fontWeight : null,
                        yearWeight: yr ? getComputedStyle(yr).fontWeight : null,
                        chevron: !!trig.querySelector('svg')
                    };
                }""")
            check("month header = numeric month / year (10 / 2026; month 18px/600 primary, year 18px/400 secondary, picker chevron)",
                  hierarchy["text"] == "10 / 2026" and hierarchy["month"] == "18px"
                  and hierarchy["year"] == "18px" and hierarchy["monthWeight"] == "600"
                  and hierarchy["yearWeight"] == "400" and hierarchy["chevron"] is True,
                  hierarchy)
            today_num = page.locator(".m-ocal__cell[data-ocal-date='2026-10-07'] .m-ocal__daynum")
            today_weight = today_num.evaluate("n=>getComputedStyle(n).fontWeight")
            today_ring = today_num.evaluate("n=>getComputedStyle(n).boxShadow")
            check("today = 1px divider-strong chip ring + semibold number (chip-level marks)",
                  today_weight == "600" and "rgb(113, 134, 139)" in today_ring, today_ring)
            sel_cell = page.locator(".m-ocal__cell--selected")
            cell_fill = sel_cell.evaluate("c=>getComputedStyle(c).backgroundColor")
            sel_chip = sel_cell.evaluate(
                "c=>getComputedStyle(c.querySelector('.m-ocal__daynum')).backgroundColor")
            sel_num = sel_cell.evaluate(
                "c=>getComputedStyle(c.querySelector('.m-ocal__daynum')).color")
            check("selected day = brand-tint chip with brand-ink number; the cell itself never fills",
                  cell_fill == "rgba(0, 0, 0, 0)" and sel_chip == "rgb(223, 238, 230)"
                  and sel_num == "rgb(22, 77, 89)",
                  {"cell": cell_fill, "chip": sel_chip, "num": sel_num})
            page.evaluate("instance.setSelectedDate('2026-10-07')")
            combo = page.locator(".m-ocal__cell--today.m-ocal__cell--selected .m-ocal__daynum").evaluate(
                "n=>({bg:getComputedStyle(n).backgroundColor,shadow:getComputedStyle(n).boxShadow,"
                "weight:getComputedStyle(n).fontWeight,color:getComputedStyle(n).color})")
            check("selected + today = selected style plus weight 600 with no ring",
                  combo["bg"] == "rgb(223, 238, 230)" and combo["shadow"] == "none"
                  and combo["weight"] == "600" and combo["color"] == "rgb(22, 77, 89)", combo)

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
                  page.locator(".m-ocal__month-label").first.inner_text() == "01" and page.locator(".m-ocal__year").first.inner_text() == "2027"
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == selected_before
                  and page.evaluate("events.length") == 0
                  and page.evaluate("document.activeElement.matches('.m-ocal__cal-title [data-ocal-action=month-picker]')"))
            check("browsing January 2027 without a selected day shows the honest browsing panel",
                  page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1
                  and "لا يوم محدد في 01 / 2027" in page.locator(".m-ocal__daypanel-title").inner_text()
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
                  page.locator(".m-ocal__month-label").first.inner_text() == "01" and page.locator(".m-ocal__year").first.inner_text() == "2028"
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
                  and "طلبات 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text())
            page.locator("[data-ocal-action='prev-month']").click()
            check("prev-month from October: heading, grid and events region describe September coherently",
                  page.locator(".m-ocal__month-label").first.inner_text() == "09" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-09']").count() == 30
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-09-01']").count() == 1
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-09-30']").count() == 1
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1
                  and "لا يوم محدد في 09 / 2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-31"
                  and page.evaluate("events.length") == 0)
            browsing_add = page.locator("[data-ocal-day-browsing] [data-ocal-action='add']")
            browsing_add.click()
            check("add request in a browsed month without selection emits date:null honestly",
                  page.evaluate("events.length===1&&events[0].name==='order-schedule:add-request'&&events[0].detail.date===null"),
                  page.evaluate("JSON.stringify(events)"))
            page.locator("[data-ocal-action='next-month']").click()
            check("next-month returns to October and restores the selected day events region",
                  page.locator(".m-ocal__month-label").first.inner_text() == "10" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0
                  and "طلبات 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.evaluate("events.length") == 1)
            page.locator("[data-ocal-grid] [data-ocal-date='2026-10-22']").click()
            check("selecting a day in the displayed month updates selection and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-22"
                  and page.evaluate("events.length===2&&events[1].name==='order-schedule:day-select'&&events[1].detail.date==='2026-10-22'")
                  and "طلبات 22/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and "5 طلبات" in page.locator(".m-ocal__daypanel-count").get_attribute("aria-label"))
            page.locator("[data-ocal-action='prev-month']").click()
            page.locator("[data-ocal-grid] [data-ocal-date='2026-09-15']").click()
            check("date selection after browsing another month selects, emits, and leaves browsing state",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-09-15"
                  and page.evaluate("events.length===3&&events[2].detail.date==='2026-09-15'")
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 0
                  and "طلبات 15/09/2026" in page.locator(".m-ocal__daypanel-title").inner_text())
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
                  page.locator(".m-ocal__month-label").first.inner_text() == "10" and page.locator(".m-ocal__year").first.inner_text() == "2026"
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
                  page.locator(".m-ocal__month-label").first.inner_text() == "12" and page.locator(".m-ocal__year").first.inner_text() == "2026"
                  and page.locator("[data-ocal-grid] [data-ocal-date^='2026-12']").count() == 31
                  and page.locator("[data-ocal-day-panel][data-ocal-day-browsing='true']").count() == 1)
            page.locator("[data-ocal-action='next-month']").click()
            check("compact December-to-January arrow crosses the year boundary coherently",
                  page.locator(".m-ocal__month-label").first.inner_text() == "01" and page.locator(".m-ocal__year").first.inner_text() == "2027"
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
                      "5 طلبات")
                  and page.locator("[data-ocal-day-panel] [data-ocal-id]").count() == 5)
            check("one-order day count and status remain visible",
                  page.locator("[data-ocal-date='2026-10-31']").get_attribute("aria-label").endswith(
                      "طلب واحد"))

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
            # عقد 2026-10-26 (أكورديون داخلي أحادي الفتح): منطقة أحداث
            # اليوم المحدد ظاهرة دائمًا أسفل الشبكة، والبطاقة مشغّل
            # أكورديون — منطقة الإفصاح (role=region) وأزرار تعديل/حذف
            # داخل الصف نفسه؛ لا زر عائم ولا Bottom Sheet ولا صندوق
            # تفاصيل منفصل أسفل القائمة.
            page.goto(f"{base}?root=358&dir=rtl&actions=1", wait_until="load")
            check("month view: events region below the grid with title, count, add and rows",
                  page.locator("[data-ocal-grid]").count() == 1
                  and page.locator("[data-ocal-day-panel]").count() == 1
                  and "طلبات 31/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and "طلب واحد" in page.locator(".m-ocal__daypanel-count").get_attribute("aria-label")
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='add']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").count() == 1)
            # عقد 2026-10-26: المشغّل يحمل aria-expanded/aria-controls ويشير
            # إلى منطقة region فريدة داخل الصف نفسه — والأزرار مخفية قبل
            # الفتح (لا أزرار تعديل/حذف على وجه البطاقة).
            accordion_static = page.evaluate("""() => {
                const trig = document.querySelector(
                  "[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']");
                if (!trig) return {present: false};
                const controls = trig.getAttribute('aria-controls');
                const panel = controls ? document.getElementById(controls) : null;
                return {
                  present: true,
                  expanded: trig.getAttribute('aria-expanded'),
                  controls: controls,
                  panelFound: !!panel,
                  panelRole: panel ? panel.getAttribute('role') : null,
                  panelHidden: panel ? panel.hidden : null,
                  panelInsideRow: panel
                    ? !!panel.closest('.m-ocal__rowitem').querySelector('[data-ocal-action="order-row"]')
                    : false,
                  visiblePanels: document.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length,
                  editInPanel: panel ? panel.querySelectorAll('[data-ocal-action="order-edit"]').length : 0,
                  deleteInPanel: panel ? panel.querySelectorAll('[data-ocal-action="order-delete"]').length : 0,
                  legacyTools: document.querySelectorAll('.m-ocal__rowitem--tools, .m-ocal__row-tool').length
                };
            }""")
            check("order card is an accordion trigger: aria-expanded/aria-controls to a unique in-row region; actions hidden before opening",
                  accordion_static["present"] and accordion_static["expanded"] == "false"
                  and accordion_static["panelFound"] and accordion_static["panelRole"] == "region"
                  and accordion_static["panelHidden"] is True
                  and accordion_static["panelInsideRow"]
                  and accordion_static["visiblePanels"] == 0
                  and accordion_static["editInPanel"] == 1 and accordion_static["deleteInPanel"] == 1
                  and accordion_static["legacyTools"] == 0,
                  accordion_static)
            # عقد هندسة البطاقة: سطح البطاقة على الصف (rowitem) — حد خافت
            # واحد وزوايا 16 بلا ظل؛ المشغّل شبكة (1fr 20px) بارتفاع أدنى
            # 76px وسهم 20px في نهاية السطر المضمن.
            card_shape = page.evaluate("""() => {
                const trig = document.querySelector(
                  "[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']");
                if (!trig) return {present: false};
                const item = trig.closest('.m-ocal__rowitem');
                const r = trig.getBoundingClientRect();
                const cs = getComputedStyle(trig);
                const is = getComputedStyle(item);
                const chev = trig.querySelector('.m-ocal__row-chev');
                return {present: true, h: r.height, cols: cs.gridTemplateColumns,
                  radius: is.borderTopLeftRadius, shadow: is.boxShadow,
                  border: is.borderTopWidth,
                  titleOverflow: getComputedStyle(trig.querySelector('.m-ocal__row-title')).textOverflow,
                  chev: chev ? Math.round(chev.getBoundingClientRect().width) : null};
            }""")
            check("order card keeps the refinement anatomy on the row surface (76px+, 1fr/20px, radius-lg, 1px border, no shadow, 20px chevron)",
                  card_shape["present"] and card_shape["h"] >= 76
                  and card_shape["cols"].split(" ")[-1] == "20px"
                  and card_shape["radius"] == "16px" and card_shape["shadow"] == "none"
                  and card_shape["border"] == "1px" and card_shape["chev"] == 20,
                  card_shape)
            page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").click()
            check("tapping the whole order card expands it in place and emits order-open once",
                  page.evaluate("events.length===1&&events[0].name==='order-schedule:order-open'&&events[0].detail.id==='one'")
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").get_attribute("aria-expanded") == "true"
                  and page.locator("[data-ocal-rowpanel]:not([hidden])").count() == 1
                  and page.evaluate("document.activeElement.getAttribute('data-ocal-action')==='order-row'"))
            panel_content = page.evaluate("""() => {
                const panel = document.querySelector('[data-ocal-rowpanel]:not([hidden])');
                const txt = panel ? panel.textContent : '';
                return {
                  title: (panel?.querySelector('.m-ocal__rowpanel-title')||{}).textContent || null,
                  hasDate: /31\\/10\\/2026/.test(txt), hasTime: /09:15/.test(txt),
                  hasStatus: /قيد التنفيذ/.test(txt),
                  editBtn: !!panel.querySelector('[data-ocal-action="order-edit"]'),
                  deleteBtn: !!panel.querySelector('[data-ocal-action="order-delete"]'),
                  editRect: (() => { const b = panel.querySelector('[data-ocal-action="order-edit"]');
                    if (!b) return null; const r = b.getBoundingClientRect();
                    return {w: Math.round(r.width), h: Math.round(r.height)}; })()
                };
            }""")
            check("expanded region shows the numeric details (title/date/time/status) with in-row edit/delete at 48px targets",
                  panel_content["title"] == "طلب واحد"
                  and panel_content["hasDate"] and panel_content["hasTime"] and panel_content["hasStatus"]
                  and panel_content["editBtn"] and panel_content["deleteBtn"]
                  and panel_content["editRect"]["w"] >= 48 and panel_content["editRect"]["h"] >= 48,
                  panel_content)
            # نقر أزرار الفعل لا يطوي الصف (لا انفصال منطقة الفعل عن المشغّل)
            page.locator("[data-ocal-day-panel] [data-ocal-rowpanel] [data-ocal-action='order-edit']").click()
            page.wait_for_timeout(120)
            page.locator("[data-ocal-day-panel] [data-ocal-rowpanel] [data-ocal-action='order-delete']").click()
            page.wait_for_timeout(120)
            check("clicking edit/delete inside the expanded row emits their events without collapsing the row",
                  page.evaluate("events.length===3"
                                "&&events[1].name==='order-schedule:order-edit-request'&&events[1].detail.id==='one'"
                                "&&events[2].name==='order-schedule:order-delete-request'&&events[2].detail.id==='one'")
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").get_attribute("aria-expanded") == "true")
            page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").click()
            check("tapping the expanded trigger collapses it honestly",
                  page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").get_attribute("aria-expanded") == "false"
                  and page.locator("[data-ocal-rowpanel]:not([hidden])").count() == 0)
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
                  and "لا توجد طلبات" in page.locator("[data-ocal-day-panel]").inner_text()
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
                  and "طلبات 22/10/2026" in page.locator(".m-ocal__daypanel-title").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row']").count() == 5)
            week_cell = page.locator("[data-ocal-grid] [data-ocal-date='2026-10-22']")
            week_cell.focus()
            page.keyboard.press("ArrowLeft")  # RTL: left = next day
            check("week RTL ArrowLeft steps the selection one day and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-23"
                  and page.evaluate("events.length===4&&events[3].name==='order-schedule:day-select'&&events[3].detail.date==='2026-10-23'")
                  and page.evaluate("document.activeElement.getAttribute('data-ocal-date')==='2026-10-23'"))
            page.keyboard.press("ArrowDown")
            check("week ArrowDown steps the selection one week (+7) and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-30"
                  and page.evaluate("events.length===5&&events[4].detail.date==='2026-10-30'")
                  and "25–31" in page.locator(".m-ocal__week-range").inner_text())
            page.keyboard.press("ArrowUp")
            check("week ArrowUp steps the selection one week back (-7) and emits once",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-23"
                  and page.evaluate("events.length===6&&events[5].detail.date==='2026-10-23'"))
            page.keyboard.press("Home")
            check("week Home selects the first (Sunday) day of the shown week",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-18"
                  and page.evaluate("events.length===7&&events[6].detail.date==='2026-10-18'"))
            page.keyboard.press("End")
            check("week End selects the last (Saturday) day of the shown week",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-24"
                  and page.evaluate("events.length===8&&events[7].detail.date==='2026-10-24'"))

            # «اليوم» في عرض الأسبوع ينقل إلى أسبوع اليوم الحالي بتحديد معلن
            page.locator("[data-ocal-action='today']").click()
            check("today button in week view jumps to today's week with an announced selection",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-07"
                  and page.evaluate("events.length===9&&events[8].name==='order-schedule:day-select'&&events[8].detail.date==='2026-10-07'")
                  and "4–10" in page.locator(".m-ocal__week-range").inner_text()
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-07'][aria-current='date']").count() == 1
                  and page.locator(".m-ocal__daypanel-title").inner_text() == "طلبات اليوم")

            # عرض اليوم: شريط اليوم + منطقة أحداثه (العنوان في الشريط — لا عنوان مكرر).
            # «اليوم» مخفي بصدق هنا: التحديد هو اليوم نفسه (عقد المرجع الأعلى 2.3)
            page.locator(".m-ocal__viewseg [data-ocal-value='day']").click()
            check("day view keeps the day bar with prev/next and hides اليوم when selected is today",
                  page.locator("[data-ocal-action='prev-day']").count() == 1
                  and page.locator("[data-ocal-action='next-day']").count() == 1
                  and page.locator("[data-ocal-action='today']").count() == 0
                  and "الأربعاء 07/10/2026" in page.locator(".m-ocal__cal-title").inner_text()
                  and page.locator("[data-ocal-day-panel]").count() == 1
                  and "لا توجد طلبات" in page.locator("[data-ocal-day-panel]").inner_text()
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='add']").count() == 1
                  and page.locator("[data-ocal-grid]").count() == 0)
            page.locator("[data-ocal-action='next-day']").click()
            check("next-day in day view announces the new selected day and reveals اليوم",
                  page.locator("#order-root").get_attribute("data-ocal-selected-date") == "2026-10-08"
                  and page.evaluate("events.length===10&&events[9].detail.date==='2026-10-08'")
                  and page.locator("[data-ocal-action='today']").count() == 1)

            # LTR: أسبوع بترتيب معكوس وفعالية كاملة للمحدّد
            page.goto(f"{base}?root=398&dir=ltr&actions=1", wait_until="load")
            page.locator(".m-ocal__viewseg [data-ocal-value='week']").click()
            check("LTR week view renders the selected week with the events region",
                  page.locator("[data-ocal-grid] [data-ocal-date]").count() == 7
                  and "25–31" in page.locator(".m-ocal__week-range").inner_text()
                  and page.locator("[data-ocal-grid] [data-ocal-date='2026-10-31'][aria-selected='true']").count() == 1
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'][data-ocal-id='one']").count() == 1
                  and page.locator("[data-ocal-rowpanel]:not([hidden])").count() == 0
                  and page.locator("[data-ocal-day-panel] [data-ocal-action='order-row'] .m-ocal__row-chev").count() == 1)
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
                  and page.locator(".m-ocal__viewseg-btn[aria-selected='true']").count() == 1
                  and page.locator("[data-ocal-grid]").count() == 0)
            page.evaluate("instance.setLoading(false);instance.setError(()=>{})")
            check("error keeps the view selector usable and retry reachable",
                  page.locator("[data-ocal-status='error'][role='alert']").count() == 1
                  and page.locator(".m-ocal__viewseg-btn[aria-selected='true']").count() == 1
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

            # ---------- J) Sunday-first + refined month presentation (2026-10-26) ----------
            # عقد الأرقام (2026-10-26): الأسبوع يبدأ الأحد افتراضيًا في
            # الاتجاهين (RTL يعكس الصف المنطقي بلا عكس التواريخ)، ورأس
            # الشهر رقمي «10 / 2026»، وبطاقة بلا خطوط شبكة داخلية إطلاقًا
            # (حد البطاقة وحده) ورأس أيام محاذٍ تمامًا لأعمدة الشبكة.
            AR_MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
                         'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول',
                         'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو',
                         'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
            EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                         'August', 'September', 'October', 'November', 'December']
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
                    const gridCells = Array.from(document.querySelectorAll('.m-ocal__cell'));
                    const innerLines = gridCells.filter(c =>
                      getComputedStyle(c).borderTopWidth !== '0px' ||
                      getComputedStyle(c).borderBottomWidth !== '0px' ||
                      getComputedStyle(c).borderInlineStartWidth !== '0px' ||
                      getComputedStyle(c).borderInlineEndWidth !== '0px').length;
                    return {
                        first: ws[0] ? ws[0].textContent : null,
                        seventh: ws[6] ? ws[6].textContent : null,
                        firstIsSunday: ws[0] && ws[0].textContent === 'أحد',
                        seventhIsSaturday: ws[6] && ws[6].textContent === 'سبت',
                        aligned: mid && midCell && Math.abs(window.__cx(mid) - window.__cx(midCell)) < 1.5
                          && second && secondCell && Math.abs(window.__cx(second) - window.__cx(secondCell)) < 1.5,
                        cardPresent: !!card,
                        cardBg: cs ? cs.backgroundColor : null,
                        cardBorder: cs ? cs.borderTopWidth : null,
                        cardRadius: cs ? cs.borderTopLeftRadius : null,
                        cardOverflow: cs ? cs.overflow : null,
                        cardShadow: cs ? cs.boxShadow : null,
                        headerRule: ws[0] ? getComputedStyle(ws[0].parentElement).borderBlockEndWidth : null,
                        innerLines: innerLines,
                        monthLabel: (document.querySelector('.m-ocal__month-label') || {}).textContent || null,
                        yearText: (document.querySelector('.m-ocal__year') || {}).textContent || null,
                        triggerText: document.querySelector('.m-ocal__month-trigger').textContent.trim().replace(/\\s+/g, ' '),
                        eventsTitleNumeric: /^(اليوم|\\d{2}\\/\\d{2}\\/\\d{4})$/.test(
                          document.querySelector('.m-ocal__daypanel-title').textContent.trim()
                            .replace(/^طلبات\\s+/, '')),
                        cellAriaNumeric: /^\\d{2}\\/\\d{2}\\/\\d{4}، /.test(
                          document.querySelector('[data-ocal-date="2026-10-07"]').getAttribute('aria-label') || ''),
                        pickerAriaNumeric: null,
                        visibleText: document.querySelector('#order-root').textContent,
                        ariaText: Array.from(document.querySelectorAll('#order-root [aria-label]'))
                          .map(e => e.getAttribute('aria-label')).join(' ')
                    };
                }""")
                check(f"{direction}: Sunday-first weekday header in both directions (أحد..سبت logical order)",
                      header["firstIsSunday"] and header["seventhIsSaturday"] and header["first"] == "أحد",
                      {"first": header["first"], "seventh": header["seventh"]})
                check(f"{direction}: weekday header columns align exactly with grid date columns",
                      header["aligned"], header)
                check(f"{direction}: calendar card surface with a single restrained border (radius-lg, no shadow)",
                      header["cardPresent"] and header["cardBorder"] == "1px"
                      and header["cardRadius"] == "16px" and header["cardOverflow"] == "hidden"
                      and header["cardShadow"] == "none"
                      and header["cardBg"].startswith("rgb("), header)
                check(f"{direction}: no inner grid lines anywhere (cells and weekday rule all borderless)",
                      header["innerLines"] == 0 and header["headerRule"] == "0px", header)
                check(f"{direction}: month header is numeric month / year (10 / 2026)",
                      header["monthLabel"] == "10" and header["yearText"] == "2026"
                      and header["triggerText"] == "10 / 2026"
                      and header["eventsTitleNumeric"], header)
                check(f"{direction}: day-cell accessible name is the full numeric date + count",
                      header["cellAriaNumeric"], header)
                leaked = [m for m in (AR_MONTHS + EN_MONTHS)
                          if m in (header["visibleText"] or "") or m in (header["ariaText"] or "")]
                check(f"{direction}: no Arabic or English month names anywhere (visible or accessible)",
                      not leaked, {"leaked": leaked})

            # ---------- K) Calendar/List mode toggle + inline accordion (2026-10-26) ----------
            # المبدّل المستقل (عرض القائمة/عرض التقويم): تغيير سطح حقيقي
            # بتسمية صادقة وaria-pressed؛ المحدّد المقسّم لوضع التقويم
            # وحده؛ القائمة تجمعات حقيقية بنفس البيانات وأفعالها؛
            # والأكورديون أحادي الفتح في القائمة أيضًا.
            page.set_viewport_size({"width": 390, "height": 980})
            page.goto(f"{base}?root=358&dir=rtl&actions=1", wait_until="load")
            toggle_state = page.evaluate("""() => {
                const t = document.querySelector('#order-root [data-ocal-action="mode-toggle"]');
                const r = t.getBoundingClientRect();
                return {
                    present: !!t, pressed: t.getAttribute('aria-pressed'),
                    label: t.textContent.trim(),
                    view: document.querySelector('#order-root').getAttribute('data-ocal-view'),
                    viewseg: !!document.querySelector('#order-root .m-ocal__viewseg'),
                    w: Math.round(r.width), h: Math.round(r.height)
                };
            }""")
            check("mode toggle renders beside the viewseg with truthful label and aria-pressed=false in calendar mode",
                  toggle_state["present"] and toggle_state["pressed"] == "false"
                  and toggle_state["label"] == "عرض القائمة"
                  and toggle_state["view"] == "calendar" and toggle_state["viewseg"]
                  and toggle_state["w"] >= 48 and toggle_state["h"] >= 48,
                  toggle_state)
            page.locator("[data-ocal-action='mode-toggle']").click()
            list_state = page.evaluate("""() => {
                const r = document.querySelector('#order-root');
                const t = r.querySelector('[data-ocal-action="mode-toggle"]');
                return {
                    view: r.getAttribute('data-ocal-view'),
                    layout: r.getAttribute('data-ocal-layout'),
                    pressed: t.getAttribute('aria-pressed'),
                    label: t.textContent.trim(),
                    viewseg: !!r.querySelector('.m-ocal__viewseg'),
                    calbar: !!r.querySelector('.m-ocal__cal-bar'),
                    sections: Array.from(r.querySelectorAll('.m-ocal__list-heading')).map(e=>e.textContent.trim()),
                    rows: r.querySelectorAll('[data-ocal-action="order-row"]').length,
                    triggerIds: Array.from(r.querySelectorAll('[data-ocal-action="order-row"]')).map(e=>e.getAttribute('data-ocal-id')),
                    docWidth: document.documentElement.scrollWidth, viewport: innerWidth
                };
            }""")
            check("mode toggle switches to the real list surface (viewseg/calbar gone, grouped sections, same orders)",
                  list_state["view"] == "list" and list_state["layout"] == "list"
                  and list_state["pressed"] == "true" and list_state["label"] == "عرض التقويم"
                  and not list_state["viewseg"] and not list_state["calbar"]
                  and "الطلبات القادمة" in list_state["sections"]
                  and "الطلبات السابقة" in list_state["sections"]
                  and "الطلبات غير المجدولة" in list_state["sections"]
                  and list_state["rows"] == 9
                  and "one" in list_state["triggerIds"] and "unscheduled" in list_state["triggerIds"]
                  and list_state["docWidth"] <= list_state["viewport"],
                  list_state)
            # أكورديون في وضع القائمة: نفس عقد aria + أحادي الفتح بالتبديل
            page.locator("[data-ocal-action='order-row'][data-ocal-id='one']").click()
            page.wait_for_timeout(120)
            first_expanded = page.evaluate("""() => {
                const t = document.querySelector('[data-ocal-action="order-row"][data-ocal-id="one"]');
                return { expanded: t.getAttribute('aria-expanded'),
                         visible: document.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length };
            }""")
            check("list mode rows are the same accordion triggers (expansion works)",
                  first_expanded["expanded"] == "true" and first_expanded["visible"] == 1, first_expanded)
            page.locator("[data-ocal-action='order-row'][data-ocal-id='many-1']").click()
            page.wait_for_timeout(120)
            switched = page.evaluate("""() => {
                const one = document.querySelector('[data-ocal-action="order-row"][data-ocal-id="one"]');
                const other = document.querySelector('[data-ocal-action="order-row"][data-ocal-id="many-1"]');
                return {
                    oneExpanded: one.getAttribute('aria-expanded'),
                    otherExpanded: other.getAttribute('aria-expanded'),
                    visible: document.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length,
                    orderOpenEvents: events.filter(e => e.name === 'order-schedule:order-open').map(e => e.detail.id),
                    focus: document.activeElement.getAttribute('data-ocal-id')
                };
            }""")
            check("switching expansion to another order closes the first (single-open, order-open per open)",
                  switched["oneExpanded"] == "false" and switched["otherExpanded"] == "true"
                  and switched["visible"] == 1
                  and switched["orderOpenEvents"] == ["one", "many-1"]
                  and switched["focus"] == "many-1",
                  switched)
            # لوحة المفاتيح: Enter على المشغّل = نقرة المؤشر (زر أصلي)
            page.locator("[data-ocal-action='order-row'][data-ocal-id='many-1']").focus()
            page.keyboard.press("Enter")
            page.wait_for_timeout(120)
            keyboard_state = page.evaluate("""() => ({
                expanded: document.querySelector('[data-ocal-action="order-row"][data-ocal-id="many-1"]').getAttribute('aria-expanded'),
                visible: document.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length,
                focus: document.activeElement.getAttribute('data-ocal-id')
            })""")
            check("keyboard Enter on the trigger collapses exactly like pointer activation",
                  keyboard_state["expanded"] == "false" and keyboard_state["visible"] == 0
                  and keyboard_state["focus"] == "many-1", keyboard_state)
            # العودة إلى التقويم: التحديد محفوظ والمحدّد عائد
            page.locator("[data-ocal-action='mode-toggle']").click()
            page.wait_for_timeout(120)
            back_state = page.evaluate("""() => {
                const r = document.querySelector('#order-root');
                return {
                    view: r.getAttribute('data-ocal-view'),
                    calView: r.getAttribute('data-ocal-cal-view'),
                    selected: r.getAttribute('data-ocal-selected-date'),
                    viewseg: !!r.querySelector('.m-ocal__viewseg'),
                    toggleLabel: r.querySelector('[data-ocal-action="mode-toggle"]').textContent.trim(),
                    togglePressed: r.querySelector('[data-ocal-action="mode-toggle"]').getAttribute('aria-pressed')
                };
            }""")
            check("mode toggle returns to calendar mode preserving the selection and the segmented control",
                  back_state["view"] == "calendar" and back_state["calView"] == "month"
                  and back_state["selected"] == "2026-10-31"
                  and back_state["viewseg"]
                  and back_state["toggleLabel"] == "عرض القائمة" and back_state["togglePressed"] == "false",
                  back_state)

            # قائمة فارغة: فراغ صادق + المبدّل باقٍ فوقه
            page.evaluate("instance.setView('list'); instance.setData([])")
            empty_list = page.evaluate("""() => {
                const r = document.querySelector('#order-root');
                const status = r.querySelector('[data-ocal-status]');
                return {
                    empty: !!status,
                    text: status ? status.textContent : null,
                    toggle: !!r.querySelector('[data-ocal-action=mode-toggle]'),
                    rows: r.querySelectorAll('[data-ocal-action=order-row]').length
                };
            }""")
            check("empty list keeps the honest empty state with the mode toggle still reachable",
                  empty_list["empty"] and "لا توجد طلبات" in (empty_list["text"] or "")
                  and empty_list["toggle"] and empty_list["rows"] == 0, empty_list)
            page.evaluate("instance.setData(window.fixtureOrders)")

            # ---------- L) Count matrix: 1/2/20/100 orders + long title ----------
            # الأكورديون الداخلي يجب أن يبقى ملاصقًا للطلب المنقور مع أي
            # عدد من الصفوف: المنطقة داخل صفّه دومًا، وأحادية الفتح محفوظة،
            # ولا فيض أفقي، ولا صندوق إفصاح منفصل خارج الصفوف.
            # (النقر عبر locator خارج evaluate — إعادة التصيير تستبدل العقد
            #  فأي مرجع داخل evaluate نفسه سيصبح منفصلًا بعد النقرة.)
            for extra, label in ((1, "2 orders"), (19, "20 orders"), (99, "100 orders")):
                page.goto(f"{base}?root=358&dir=rtl&actions=1&extra={extra}", wait_until="load")
                page.wait_for_timeout(60)
                middle_id = page.evaluate(
                    "() => { const rows = document.querySelectorAll("
                    "'#order-root [data-ocal-action=order-row]');"
                    "return rows[Math.floor(rows.length / 2)].getAttribute('data-ocal-id'); }")
                page.locator(f"[data-ocal-action='order-row'][data-ocal-id='{middle_id}']").click()
                page.wait_for_timeout(120)
                matrix = page.evaluate("""(mid) => {
                    const r = document.querySelector('#order-root');
                    const middle = r.querySelector(
                      '[data-ocal-action=order-row][data-ocal-id=\\'' + mid + '\\']');
                    const panel = r.querySelector('[data-ocal-rowpanel]:not([hidden])');
                    return {
                        rows: r.querySelectorAll('[data-ocal-action=order-row]').length,
                        middleId: mid,
                        expanded: middle ? middle.getAttribute('aria-expanded') : null,
                        panelInsideRow: panel
                          ? panel.closest('.m-ocal__rowitem').contains(middle) : false,
                        visiblePanels: r.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length,
                        panelsOutsideRows: Array.from(r.querySelectorAll('[data-ocal-rowpanel]'))
                          .filter(p => !p.closest('.m-ocal__rowitem')).length,
                        detachedGlobalBoxes: r.querySelectorAll(
                          '.m-ocal__details, .m-ocal__order-details, [data-ocal-details]').length,
                        rootScroll: r.scrollWidth, rootClient: r.clientWidth,
                        docWidth: document.documentElement.scrollWidth, viewport: innerWidth
                    };
                }""", middle_id)
                check(f"{label}: expansion stays inline inside the clicked row (no detached global box, single-open)",
                      matrix["rows"] == 1 + extra
                      and matrix["expanded"] == "true"
                      and matrix["panelInsideRow"]
                      and matrix["visiblePanels"] == 1
                      and matrix["panelsOutsideRows"] == 0
                      and matrix["detachedGlobalBoxes"] == 0,
                      matrix)
                check(f"{label}: no horizontal overflow with one row expanded",
                      matrix["rootScroll"] <= matrix["rootClient"] + 1
                      and matrix["docWidth"] <= matrix["viewport"], matrix)

            # عنوان عربي طويل: قطع على الوجه + النص الكامل داخل المنطقة
            page.goto(f"{base}?root=358&dir=rtl&actions=1&extra=1&long=1", wait_until="load")
            page.wait_for_timeout(60)
            first_id = page.evaluate(
                "() => document.querySelector("
                "'#order-root [data-ocal-action=order-row]').getAttribute('data-ocal-id')")
            page.locator(f"[data-ocal-action='order-row'][data-ocal-id='{first_id}']").click()
            page.wait_for_timeout(120)
            long_title = page.evaluate("""() => {
                const r = document.querySelector('#order-root');
                const first = r.querySelector('[data-ocal-action=order-row]');
                const titleEl = first.querySelector('.m-ocal__row-title');
                const panel = r.querySelector('[data-ocal-rowpanel]:not([hidden])');
                const full = 'طلب ضيافة استقبال شركة الوفادة المرافقة لوفد المنطقة الغربية مع تجهيز القاعة الرئيسية والمستلزمات الكاملة للفعالية المقامة يوم الخميس القادم بتجهيزات صباحية إضافية';
                return {
                    clipped: getComputedStyle(titleEl).textOverflow === 'ellipsis'
                      && titleEl.scrollWidth > titleEl.clientWidth,
                    timeStillVisible: !!first.querySelector('.m-ocal__row-time'),
                    chevStillVisible: !!first.querySelector('.m-ocal__row-chev'),
                    panelTitleFull: (panel?.querySelector('.m-ocal__rowpanel-title')||{}).textContent === full,
                    docWidth: document.documentElement.scrollWidth, viewport: innerWidth
                };
            }""")
            check("long Arabic title ellipsizes on the face (time/chevron intact) and shows in full inside the panel",
                  long_title["clipped"] and long_title["timeStillVisible"]
                  and long_title["chevStillVisible"] and long_title["panelTitleFull"]
                  and long_title["docWidth"] <= long_title["viewport"],
                  long_title)

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
