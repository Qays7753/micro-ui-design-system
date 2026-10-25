#!/usr/bin/env python3
"""Focused responsive regressions for the approved compact/mobile repairs."""
import argparse
import http.server
import json
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent


def fixture_html():
    variants = []
    for key, cls in (("flat", "m-main-metric--flat"),
                     ("compact", "m-main-metric--compact"),
                     ("hero", "")):
        variants.append(
            f'<section class="m-main-metric {cls}" data-main-comparison '
            f'data-common-unit="عملية" data-common-period="اليوم" data-max="40" id="metric-{key}">'
            '<div class="m-main-metric__layout"><div class="m-main-metric__hero">'
            '<span class="m-main-metric__label">قيمة العينة</span><span class="m-main-metric__value">'
            '<span class="m-main-metric__number" dir="ltr">18</span>'
            '<span class="m-main-metric__unit">عملية</span></span></div><div>'
            '<ul data-bar-source hidden><li data-label="طلبات" data-value="32" data-unit="عملية" '
            'data-period="اليوم" data-series="a"></li><li data-label="مرتجعات" data-value="-9" '
            'data-unit="عملية" data-period="اليوم" data-series="b"></li><li data-label="مراجعات" '
            'data-value="0" data-unit="عملية" data-period="اليوم" data-series="c"></li>'
            '<li data-label="معلق" data-value="" data-unit="عملية" data-period="اليوم" data-series="d"></li>'
            '</ul><ul class="m-main-metric__rows" data-bar-items></ul>'
            '<p class="m-main-metric__status" data-bar-status></p></div></div></section>'
        )
    return """<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/info-strip/info-strip.css">
<link rel="stylesheet" href="/components/info-strip/info-strip-peek.css">
<link rel="stylesheet" href="/components/metric-comparison/metric-comparison.css">
<link rel="stylesheet" href="/components/order-schedule/order-schedule.css">
<style>body{margin:0;padding:12px;font-family:var(--micro-font-family);background:var(--micro-surface-page)}
#cards{display:flex;gap:12px}.m-info-card{width:240px}.peek-wrap{width:220px}
#schedule-wrap{width:var(--schedule-width,390px);max-width:100%}</style></head><body>
<div id="cards"><article class="m-info-card" id="standard"><span class="m-info-card__label">قراءة اليوم</span>
<span class="m-info-card__reading"><span class="m-info-card__number" dir="ltr">18</span>
<span class="m-info-card__unit">طلب</span></span></article>
<article class="m-info-card m-info-card--compact" id="compact"><span class="m-info-card__label">قراءة اليوم</span>
<span class="m-info-card__reading"><span class="m-info-card__number" dir="ltr">18</span>
<span class="m-info-card__unit">طلب</span></span></article></div>
<div class="peek-wrap"><div class="m-info-strip m-info-peek" data-info-strip data-info-peek>
<div class="m-info-strip__viewport" data-info-strip-viewport><div class="m-info-strip__track" data-info-strip-track>
<div class="m-info-strip__slide"><article class="m-info-card m-info-card--compact"><span class="m-info-card__label">أ</span>
<span class="m-info-card__reading"><span class="m-info-card__number">1</span></span></article></div>
<div class="m-info-strip__slide"><article class="m-info-card m-info-card--compact"><span class="m-info-card__label">ب</span>
<span class="m-info-card__reading"><span class="m-info-card__number">2</span></span></article></div></div></div></div></div>
""" + "".join(variants) + """
<div id="schedule-wrap"><div id="schedule" aria-label="جدول الطلبات"></div></div>
<script src="/components/info-strip/info-strip.js"></script>
<script src="/components/info-strip/info-strip-peek.js"></script>
<script src="/components/metric-comparison/metric-comparison.js"></script>
<script src="/components/order-schedule/order-schedule.js"></script></body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/":
            body = fixture_html().encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-complete-mobile-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    failures = []
    checks = 0

    def check(condition, message):
        nonlocal checks
        checks += 1
        if not condition:
            failures.append(message)

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(**chromium_launch_options())
            page = browser.new_page(viewport={"width": 1000, "height": 900}, device_scale_factor=1)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(f"http://127.0.0.1:{server.server_port}/", wait_until="networkidle")
            page.evaluate("""() => {
              window.scheduleEvents = [];
              var root = document.querySelector('#schedule');
              ['order-schedule:day-select','order-schedule:order-open','order-schedule:add-request']
                .forEach(name => root.addEventListener(name, e => scheduleEvents.push([name,e.detail])));
              window.schedule = MicroOrderSchedule.init(root, {
                today:'2026-10-07', selectedDate:'2026-10-07', weekStart:6,
                orders:[{id:'a',title:'طلب ألف',date:'2026-10-07',time:'12:00',statusKey:''},
                        {id:'b',title:'طلب باء',date:'2026-10-08',time:null,statusKey:''},
                        {id:'b2',title:'طلب ثان',date:'2026-10-08',time:null,statusKey:''}]
              });
            }""")

            geometry = page.evaluate("""() => {
              const text = id => document.querySelector(id+' .m-info-card__number').textContent;
              const card = id => document.querySelector(id).getBoundingClientRect();
              const styles = id => getComputedStyle(document.querySelector(id));
              return {compactText:text('#compact'), standardText:text('#standard'),
                compactHeight:card('#compact').height, standardHeight:card('#standard').height,
                compactPadding:styles('#compact').paddingInlineStart,
                standardPadding:styles('#standard').paddingInlineStart,
                compactNumberSize:styles('#compact .m-info-card__number').fontSize,
                standardNumberSize:styles('#standard .m-info-card__number').fontSize,
                peekWidth:document.querySelector('.m-info-strip__slide').getBoundingClientRect().width,
                peekContainer:document.querySelector('.m-info-peek').getBoundingClientRect().width};
            }""")
            check(geometry["compactText"] == geometry["standardText"] == "18",
                  "compact/standard info cards must retain identical readings")
            # 2026-10-25: عقد «ال compact هو الافتراضي القابل لإعادة الاستخدام»
            # (موثق في info-strip.css) — modifier الـcompact مطابق للأساس بتعمد؛
            # الفحص يثبت التطابق (لا انحراف قراءة أو حشو) بدل الاختلاف القديم.
            check(geometry["compactPadding"] == geometry["standardPadding"] and
                  geometry["compactNumberSize"] == geometry["standardNumberSize"],
                  "compact card matches the documented reusable default scale (identical readings)")
            check(geometry["peekWidth"] >= geometry["peekContainer"] - 1,
                  "narrow peek container must fall back to a full-width slide")

            metric_data = page.evaluate("""() => {
              return ['flat','compact','hero'].map(kind => {
                const root=document.querySelector('#metric-'+kind);
                const source=Array.from(root.querySelectorAll('[data-bar-source] li')).map(li =>
                  ['data-label','data-value','data-unit','data-period','data-series']
                    .map(k=>li.getAttribute(k)).join('|'));
                const rows=Array.from(root.querySelectorAll('[data-bar-items] li')).map(li=>li.textContent.trim());
                return {source,rows};
              });
            }""")
            check(metric_data[0]["source"] == metric_data[1]["source"] == metric_data[2]["source"],
                  "metric variants must preserve an identical source dataset")
            check(metric_data[0]["rows"] == metric_data[1]["rows"] == metric_data[2]["rows"],
                  "metric variants must render identical comparison readings")

            showcase_page = browser.new_page(viewport={"width": 1280, "height": 900})
            showcase_page.goto(
                f"http://127.0.0.1:{server.server_port}/previews/ui-system-showcase/index.html#state-lab",
                wait_until="networkidle",
            )
            showcase_page.wait_for_function("window.MicroOrderSchedule && document.querySelector('#sc-main-metric-flat [data-bar-source] li')")
            for fixture in ("normal", "stress"):
                if fixture == "stress":
                    showcase_page.locator('[data-sc-fixture="stress"]').click()
                variant_source = showcase_page.evaluate("""() => {
                  const ids=['sc-main-metric-flat','sc-main-metric','sc-main-metric-compact'];
                  return ids.map(id => {
                    const root=document.getElementById(id);
                    return Array.from(root.querySelectorAll('[data-bar-source] li')).map(li =>
                      ['data-label','data-value','data-unit','data-period','data-series']
                        .map(k=>li.getAttribute(k)).join('|'));
                  });
                }""")
                check(variant_source[0] == variant_source[1] == variant_source[2],
                      f"showcase metric variants must retain one {fixture} dataset")
            for direction in ["ltr", "rtl", "ltr"]:
                showcase_page.locator(f'[data-sc-dir="{direction}"]').click()
                showcase_page.wait_for_timeout(80)
                check(showcase_page.locator("#sc-carousel-root").evaluate("""r=>{
                  const v=r.querySelector('[data-viewport]').getBoundingClientRect();
                  const s=r.querySelector('[data-current="true"]').getBoundingClientRect();
                  return Math.abs((v.left+v.right)-(s.left+s.right))<2 &&
                    s.left>=v.left-1 && s.right<=v.right+1;
                }"""), f"showcase direction switch to {direction} keeps active carousel centered/unclipped")
            showcase_page.close()

            def set_width(width):
                page.evaluate("(w) => document.querySelector('#schedule-wrap').style.width=w+'px'", width)
                page.wait_for_timeout(100)
                return page.evaluate("""() => {
                  const root=document.querySelector('#schedule');
                  const buttons=Array.from(root.querySelectorAll('button'));
                  const boxes=buttons.map(b=>{const r=b.getBoundingClientRect();return {
                    x:r.x,y:r.y,w:r.width,h:r.height,cell:b.classList.contains('m-ocal__cell')}});
                  let overlap=false, undersized=[];
                  boxes.forEach((a,i)=>{
                    if (!a.cell && (a.w<48 || a.h<48)) undersized.push(i);
                    /* عقد 2026-10-24/25: خلية الشهر المدمجة >=24 عرضًا و>=48 ارتفاعًا
                       (WCAG 2.5.8 موثق)؛ الممتدة مربع >=48 */
                    if (a.cell && (a.w<24 || a.h<48)) undersized.push(i);
                    boxes.slice(i+1).forEach(b=>{
                      if (a.x < b.x+b.w-.1 && a.x+a.w > b.x+.1 &&
                          a.y < b.y+b.h-.1 && a.y+a.h > b.y+.1) overlap=true;
                    });
                  });
                  return {width:root.getBoundingClientRect().width,view:root.getAttribute('data-ocal-view'),
                    compact:root.getAttribute('data-ocal-compact'),auto:root.getAttribute('data-ocal-auto-view'),
                    calView:root.getAttribute('data-ocal-cal-view'),
                    preferredCalView:root.getAttribute('data-ocal-preferred-cal-view'),
                    auto:root.getAttribute('data-ocal-auto-view'),
                    screen:root.querySelector('[data-ocal-screen="calendar"]')?.textContent || '',
                    cellCount:root.querySelectorAll('.m-ocal__cell').length,
                    undersized:undersized.length,overlap,buttonCount:buttons.length};
                }""")

            # 2026-10-24/25 contract: the complete month grid renders at EVERY
            # root width; <360px flips data-ocal-compact (CSS-only, no re-render,
            # no focus loss); the old auto-day fallback and its data-ocal-auto-view
            # attribute were removed — this section asserts the current contract.
            for width in (320, 360, 390, 430):
                result = set_width(width)
                expected_compact = "true" if width < 360 else "false"
                check(result["auto"] is None,
                      f"{width}px schedule must not carry the removed auto-view attribute")
                check(result["compact"] == expected_compact,
                      f"{width}px schedule width should set compact={expected_compact}")
                check(result["cellCount"] == 31,
                      f"{width}px schedule shows the complete month grid (31 days)")
                check(result["calView"] == "month",
                      f"{width}px schedule keeps the month presentation (no auto-day)")
                check(result["undersized"] == 0 and not result["overlap"],
                      f"{width}px schedule has an undersized/overlapping touch target")
                check(result["buttonCount"] > 0, f"{width}px schedule should remain interactive")

            page.evaluate("schedule.setSelectedDate('2026-10-08')")
            page.evaluate("schedule.setView('list')")
            for width in (680, 540, 359, 720, 390, 320, 430):
                result = set_width(width)
                check(result["view"] == "list" and result["auto"] is None,
                      f"nested resize to {width}px must preserve explicit list mode")
                check(result["undersized"] == 0 and not result["overlap"],
                      f"list at {width}px has an undersized/overlapping touch target")
            page.evaluate("schedule.setView('calendar')")
            result = set_width(320)
            check(result["calView"] == "month" and result["preferredCalView"] == "month",
                  "compact flip must preserve the user's month presentation")
            check(page.evaluate("document.querySelector('#schedule').getAttribute('data-ocal-view')") == "calendar",
                  "compact flip must preserve calendar view state")
            check("8 أكتوبر" in page.locator("#schedule [data-ocal-day-panel]").inner_text(),
                  "compact flip must preserve the selected civil date")
            check(page.evaluate("scheduleEvents.length") == 0,
                  "programmatic changes and resize must not emit user selection events")
            set_width(390)
            page.locator('#schedule [data-ocal-date="2026-10-08"]').focus()
            set_width(320)
            check(page.evaluate("""()=>{
              const a=document.activeElement;
              return document.querySelector('#schedule').contains(a) &&
                a.getAttribute('data-ocal-date')==='2026-10-08';
            }"""), "focused month cell keeps focus on narrowing (CSS-only compact flip)")
            set_width(390)
            check(page.evaluate("""()=>{
              const a=document.activeElement;
              return document.querySelector('#schedule').contains(a) &&
                a.getAttribute('data-ocal-date')==='2026-10-08';
            }"""), "focused month cell keeps focus on widening back")
            check(page.evaluate("scheduleEvents.length") == 0,
                  "responsive focus restoration must not create selection events")
            page.locator('#schedule [data-ocal-id="b2"]').focus()
            set_width(320)
            check(page.evaluate("document.activeElement.getAttribute('data-ocal-id')") == "b2",
                  "narrow fallback preserves second order identity, not first same-action row")
            set_width(430)
            check(page.evaluate("document.activeElement.getAttribute('data-ocal-id')") == "b2",
                  "widening preserves second order identity")
            page.keyboard.press("Enter")
            check(page.evaluate("""()=>scheduleEvents.length===1 &&
              scheduleEvents[0][0]==='order-schedule:order-open' &&
              scheduleEvents[0][1].id==='b2'"""),
                  "Enter after responsive resize opens the exact focused order")
            page.evaluate("scheduleEvents=[]")
            page.locator('#schedule [data-ocal-action="view"][data-ocal-value="list"]').focus()
            set_width(320)
            check(page.evaluate("""()=>{
              return document.activeElement.getAttribute('data-ocal-action')==='view' &&
                document.activeElement.getAttribute('data-ocal-value')==='list';
            }"""), "responsive rerender preserves the exact focused view toggle")
            page.evaluate("schedule.setCalendarView('day')")
            page.evaluate("schedule.setCalendarView('month')")
            check(page.evaluate("""()=>{
              const r=schedule.root;
              return r.getAttribute('data-ocal-cal-view')==='month' &&
                !r.hasAttribute('data-ocal-auto-view');
            }"""), "explicit month presentation persists at narrow width (no auto-day in the current contract)")
            page.evaluate("schedule.destroy()")
            check(page.evaluate("""() => !document.querySelector('#schedule').hasAttribute('data-ocal-init') &&
              MicroOrderSchedule.getInstance(document.querySelector('#schedule')) === null"""),
                  "destroy must clean root state and release the instance")
            page.evaluate("""() => {
              const root=document.querySelector('#schedule');
              schedule=MicroOrderSchedule.init(root,{today:'2026-10-07',orders:[]});
              schedule.destroy();
            }""")
            check(not errors, "browser runtime errors: " + "; ".join(errors))
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    print(f"{checks - len(failures)}/{checks} checks passed")
    (out / "results.json").write_text(json.dumps({
        "passed": checks - len(failures), "failed": len(failures),
        "failures": failures, "scope": "Chromium component-width and data-equivalence checks"
    }, ensure_ascii=False, indent=2))
    if failures:
        for failure in failures:
            print("FAIL:", failure)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
