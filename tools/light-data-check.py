#!/usr/bin/env python3
"""Focused Light-only Chromium checks for data and metric comparisons.

Screenshots and JSON reports default to a temporary directory. Capture-only
mode is intended for recording the unchanged baseline before a visual repair.
The 200% typography case is a CSS enlargement simulation, not native zoom.
"""
import argparse
import hashlib
import http.server
import json
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [
    "components/data/data.css",
    "components/data/data.js",
    "components/data/packed-circle.css",
    "components/data/packed-circle.js",
    "components/metric-comparison/metric-comparison.css",
    "components/metric-comparison/metric-comparison.js",
    "shared/tokens.css",
]

FIXTURE = """<!doctype html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,">
<base href="/"><link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/data/data.css">
<link rel="stylesheet" href="/components/data/packed-circle.css">
<link rel="stylesheet" href="/components/metric-comparison/metric-comparison.css">
<style>
*{box-sizing:border-box}body{margin:0;background:var(--micro-surface-page);color:var(--micro-text-primary);font-family:var(--micro-font-family)}
main{width:100%;max-width:430px;margin:auto;padding:12px;display:grid;gap:24px}
.m-chart,.m-main-metric,.m-metric-circles{padding:12px;background:var(--micro-surface-base)}
.m-chart__title{margin:0 0 8px}.m-chart__summary{margin:0}
.m-main-metric__title,.m-metric-circles__title{margin:0 0 8px}
.m-main-metric__layout{gap:12px}
.m-chart__dataset[hidden]{display:none}
</style></head><body><main>
<section class="m-chart m-chart--bars" data-chart="bars" data-max="10" id="bars">
<h2 class="m-chart__title">قراءات المقارنة</h2>
<ul class="m-chart__data" hidden>
<li data-series="a" data-label="قيمة صفرية" data-value="0"></li>
<li data-series="b" data-label="قراءة غائبة" data-value=""></li>
<li data-series="c" data-label="قيمة سالبة" data-value="-3"></li>
<li data-series="d" data-label="قراءة عربية طويلة للغاية" data-value="8"></li>
</ul><div class="m-chart__plot" data-plot></div><p class="m-chart__summary" data-summary></p></section>
<section class="m-chart m-chart--bars" data-chart="bars" data-max="0" id="invalid-scale">
<h2 class="m-chart__title">مقياس غير صالح</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="قيمة" data-value="2"></li></ul>
<div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--line" data-chart="line" data-value-domain="signed" data-axis-dir="rtl" id="signed">
<h2 class="m-chart__title">قراءات حول الصفر</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="موجب" data-value="4"></li>
<li data-series="a" data-label="صفر" data-value="0"></li>
<li data-series="a" data-label="سالب" data-value="-2"></li></ul>
<div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--donut" data-chart="donut" data-total="10" id="donut">
<h2 class="m-chart__title">حصص الفئات</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="فئة أ" data-value="4"></li>
<li data-series="b" data-label="فئة ب" data-value="3"></li>
<li data-series="c" data-label="فئة ج" data-value="3"></li></ul>
<div class="m-chart__plot m-donut" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--bubbles" data-chart="bubbles" data-max="10" id="bubbles">
<h2 class="m-chart__title">مقادير مستقلة</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="الأكبر" data-value="10"></li>
<li data-series="c" data-label="الأصغر" data-value="1"></li>
<li data-series="e" data-label="صفر" data-value="0"></li>
<li data-series="b" data-label="ناقص" data-value="-2"></li>
<li data-series="d" data-label="مفقود" data-value=""></li></ul>
<div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--bubbles m-chart--packed" data-chart="bubbles" data-chart-packed data-max="10" id="packed">
<h2 class="m-chart__title">تجميع بصري اختياري</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="الأكبر" data-value="10"></li>
<li data-series="c" data-label="الأصغر" data-value="1"></li>
<li data-series="e" data-label="متوسط" data-value="4"></li></ul>
<div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-metric-circles" data-metric-circles data-layout="separated" id="metric-circles">
<h2 class="m-metric-circles__title">دوائر المقدار الاختيارية</h2>
<ul class="m-metric-circles__source" data-metric-source hidden>
<li data-label="الأكبر" data-value="10" data-series="a"></li>
<li data-label="الأصغر" data-value="1" data-series="c"></li>
<li data-label="صفر" data-value="0" data-series="e"></li></ul>
<ol class="m-metric-circles__items" data-metric-items></ol>
<ul class="m-metric-circles__fallback" data-metric-fallback></ul>
<p data-metric-scale></p></section>
<section class="m-main-metric m-main-metric--flat" data-main-comparison data-common-unit="نقطة" data-common-period="الفترة التي حددها المضيف" id="main-flat">
<h2 class="m-main-metric__title">قراءة مسطحة وأشرطة مقارنة</h2><div class="m-main-metric__layout">
<div class="m-main-metric__hero"><span class="m-main-metric__label">القيمة الرئيسية</span>
<span class="m-main-metric__value"><span class="m-main-metric__number">12</span><span class="m-main-metric__unit">نقطة</span></span></div>
<div><ul class="m-main-metric__source" data-bar-source hidden>
<li data-label="قيمة أ" data-value="8" data-unit="نقطة" data-period="الفترة التي حددها المضيف" data-series="a"></li>
<li data-label="قيمة ب" data-value="-3" data-unit="نقطة" data-period="الفترة التي حددها المضيف" data-series="b"></li>
<li data-label="قيمة مفقودة" data-value="" data-unit="نقطة" data-period="الفترة التي حددها المضيف" data-series="c"></li></ul>
<ul class="m-main-metric__rows" data-bar-items></ul><p data-bar-status></p></div></div></section>
<section class="m-main-metric m-main-metric--featured" data-main-comparison data-common-unit="نقطة" data-common-period="الفترة التي حددها المضيف" id="main-featured">
<h2 class="m-main-metric__title">إبراز واحد مقصود</h2><div class="m-main-metric__layout">
<div class="m-main-metric__hero"><span class="m-main-metric__label">القيمة الرئيسية</span>
<span class="m-main-metric__value"><span class="m-main-metric__number">12</span><span class="m-main-metric__unit">نقطة</span></span></div>
<div><ul class="m-main-metric__source" data-bar-source hidden>
<li data-label="قيمة أ" data-value="8" data-unit="نقطة" data-period="الفترة التي حددها المضيف" data-series="a"></li>
<li data-label="قيمة ب" data-value="-3" data-unit="نقطة" data-period="الفترة التي حددها المضيف" data-series="b"></li></ul>
<ul class="m-main-metric__rows" data-bar-items></ul><p data-bar-status></p></div></div></section>
<section class="m-stat" id="stat"><span class="m-stat__label">قراءة مباشرة</span>
<span class="m-stat__value"><bdi class="m-stat__num" dir="ltr">123456789012345</bdi><span class="m-stat__unit">وحدة من المضيف</span></span></section>
<section class="m-progress" id="progress"><div class="m-progress__head"><span class="m-progress__label">تقدم معلوم</span><span class="m-progress__value">42</span></div>
<div class="m-progress__track"><div class="m-progress__bar" style="--progress:42%"></div></div></section>
<ol class="m-steps" id="steps"><li class="m-step m-step--complete"><span class="m-step__rail"><span class="m-step__marker">1</span></span><span class="m-step__text"><span class="m-step__title">مرحلة مكتملة</span></span></li>
<li class="m-step m-step--current"><span class="m-step__rail"><span class="m-step__marker">2</span></span><span class="m-step__text"><span class="m-step__title">المرحلة الحالية</span><span class="m-step__badge">حاليًا</span></span></li></ol>
<section class="m-chart m-chart--bars" data-chart="bars" data-max="10" data-unit="نقطة من المضيف" data-period="فترة يحددها المضيف" data-title="عنوان سياق المضيف" id="metadata">
<h2 class="m-chart__title">عنوان الرسم المرئي</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="قراءة" data-value="4"></li></ul><div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--bubbles" data-chart="bubbles" data-max="10" id="bubbles-empty">
<h2 class="m-chart__title">دوائر بلا بيانات</h2>
<ul class="m-chart__data" hidden></ul>
<div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--bars" data-chart="bars" data-value-domain="signed" id="signed-empty">
<h2 class="m-chart__title">موقّع كله مجهول</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="مجهول أول" data-value=""></li>
<li data-series="b" data-label="مجهول ثانٍ" data-value=""></li></ul>
<div class="m-chart__plot" data-plot></div><p data-summary></p></section>
<section class="m-chart m-chart--donut" data-chart="donut" data-total="25" data-total-label="إجمالي الطلبات" data-unit="طلب" data-period="أكتوبر" id="donut-unit">
<h2 class="m-chart__title">توزيع موثّق الوحدة والفترة</h2><ul class="m-chart__data" hidden>
<li data-series="a" data-label="فئة أ" data-value="11"></li>
<li data-series="b" data-label="فئة ب" data-value="6"></li>
<li data-series="c" data-label="صفر" data-value="0"></li></ul>
<div class="m-chart__plot m-donut" data-plot></div><p data-summary></p></section>
</main><script src="/components/data/data.js"></script><script src="/components/data/packed-circle.js"></script>
<script src="/components/metric-comparison/metric-comparison.js"></script></body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == "/light-data-fixture.html":
            payload = FIXTURE.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, help="report and screenshot directory")
    parser.add_argument("--capture-only", action="store_true", help="capture baseline without repair assertions")
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-light-data-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}/light-data-fixture.html"
    checks, errors = [], []
    version = "unknown"

    def check(name, ok, detail=None):
        checks.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            version = browser.version
            for width in (320, 360, 390, 430):
                for direction in ("rtl", "ltr"):
                    for dpr in (1, 2):
                        context = browser.new_context(
                            viewport={"width": width, "height": 900},
                            device_scale_factor=dpr,
                            color_scheme="light",
                        )
                        page = context.new_page()
                        page.on("pageerror", lambda exc: errors.append(str(exc)))
                        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
                        page.on("requestfailed", lambda req: errors.append(req.url + ": " + str(req.failure)))
                        page.goto(url)
                        page.evaluate("(dir) => { document.documentElement.dir = dir; return document.fonts.ready; }", direction)
                        page.wait_for_timeout(50)
                        if width in (320, 390) and dpr == 1:
                            page.screenshot(path=str(out / f"light-data-{width}-{direction}-1x.png"), full_page=True)

                        if args.capture_only:
                            pass
                        else:
                            state = page.locator("#bars").evaluate("""e=>({
                              labels:[...e.querySelectorAll('.m-chart__bar-label')].length,
                              zero:e.querySelector('.m-chart__bar[height="0"]')!==null,
                              missing:e.textContent.includes('—'),
                              negative:e.textContent.includes('سالب غير مرسوم'),
                              long:e.querySelector('.m-chart__data [data-label]')?.getAttribute('data-label')
                            })""")
                            check(f"{width} {direction} {dpr}x: zero, missing, negative and long source readings retained",
                                  state["labels"] > 0 and state["zero"] and state["missing"] and state["negative"]
                                  and state["long"] == "قيمة صفرية", state)
                            check(f"{width} {direction} {dpr}x: invalid scale refuses relative drawing",
                                  page.locator("#invalid-scale[data-scale-state=invalid] .m-chart__error").count() == 1
                                  and page.locator("#invalid-scale .m-chart__bar").count() == 0)
                            signed_state = page.locator("#signed").evaluate("""e=>({
                              zero:e.querySelectorAll('[data-zero-axis]').length,
                              lines:e.querySelectorAll('.m-chart__line').length,
                              readings:e.querySelectorAll('.m-chart__readings dt').length,
                              negative:e.textContent.includes('-2'),
                              text:e.innerText
                            })""")
                            check(f"{width} {direction} {dpr}x: signed axis preserves negative geometry and zero",
                                  signed_state["zero"] == 1 and signed_state["lines"] == 1
                                  and signed_state["readings"] == 3 and signed_state["negative"], signed_state)
                            check(f"{width} {direction} {dpr}x: donut shares and disclosure rows remain complete",
                                  page.locator("#donut .m-donut__svg circle").count() >= 5
                                  and page.locator("#donut .m-chart__disclose").count() == 1)
                            page.locator("#donut .m-chart__disclose").click()
                            check(f"{width} {direction} {dpr}x: disclosure opens its semantic table",
                                  page.locator("#donut table.m-chart__dataset tbody tr").count() == 3
                                  and page.locator("#donut table caption").count() == 1
                                  and page.locator("#donut button[aria-expanded=true]").count() == 1)
                            page.locator("#metadata").evaluate("""e=>{
                              const c=e.querySelector('.m-chart__context');
                              window.metadataBefore=c?c.innerText:'';
                              e.removeAttribute('data-unit');e.removeAttribute('data-period');MicroData.render(e);
                            }""")
                            metadata_absent = page.locator("#metadata .m-chart__context").count() == 0
                            page.locator("#metadata").evaluate("""e=>{
                              e.setAttribute('data-unit','نقطة من المضيف');
                              e.setAttribute('data-period','فترة يحددها المضيف');MicroData.render(e);
                            }""")
                            metadata = page.locator("#metadata .m-chart__context").inner_text()
                            check(f"{width} {direction} {dpr}x: optional host metadata appears only when provided",
                                  metadata_absent and "نقطة من المضيف" in metadata and "فترة يحددها المضيف" in metadata
                                  and "عنوان سياق المضيف" not in metadata, metadata)
                            title_context = page.locator("#metadata").evaluate("""e=>{
                              e.querySelector('.m-chart__title').remove();MicroData.render(e);
                              return e.querySelector('.m-chart__context-title')?.textContent||'';
                            }""")
                            check(f"{width} {direction} {dpr}x: host title is shown only when a visible title is absent",
                                  title_context == "عنوان سياق المضيف", title_context)
                            marks = page.evaluate("""()=>{
                              const bubble=getComputedStyle(document.querySelector('#bubbles .m-bubble__circle circle'));
                              const packed=getComputedStyle(document.querySelector('#packed .m-bubble__circle'));
                              const metric=getComputedStyle(document.querySelector('#metric-circles .m-metric-circles__bubble'));
                              const bar=getComputedStyle(document.querySelector('#main-flat .m-main-metric__bar'));
                              const donut=getComputedStyle(document.querySelector('#donut .m-donut__svg circle[aria-hidden="true"]'));
                              return {bubble:{stroke:bubble.stroke,width:bubble.strokeWidth,r:document.querySelector('#bubbles .m-bubble__circle circle').getAttribute('r')},
                                packed:packed.boxShadow,metric:metric.boxShadow,bar:bar.boxShadow,donut:{stroke:donut.stroke,width:donut.strokeWidth}};
                            }""")
                            check(f"{width} {direction} {dpr}x: only weakly bounded marks gain direct Light boundary",
                                  marks["bubble"]["width"] == "1px" and "rgb(80, 101, 106)" in marks["bubble"]["stroke"]
                                  and marks["packed"] != "none"
                                  and "inset" in marks["metric"]
                                  and marks["bar"] != "none"
                                  and marks["donut"]["width"] == "1px"
                                  and "rgb(80, 101, 106)" in marks["donut"]["stroke"], marks)
                            check(f"{width} {direction} {dpr}x: zero and area geometry stay unchanged",
                                  page.locator("#bubbles .m-bubble__circle--none").count() == 3
                                  and page.locator("#bubbles .m-bubble__circle circle").first.get_attribute("r") == "50"
                                  and page.locator("#metric-circles [data-state=zero]").count() == 1,
                                  {"zeroMarkers": page.locator("#bubbles .m-bubble__circle--none").count()})
                            check(f"{width} {direction} {dpr}x: long readings wrap without page-level horizontal loss",
                                  page.locator("#stat .m-stat__num").evaluate("e=>e.scrollWidth<=e.parentElement.clientWidth")
                                  and page.evaluate("document.documentElement.scrollWidth<=innerWidth"))
                            if width in (320, 390) and dpr == 1 and direction == "rtl":
                                before_text = page.locator("#signed svg text").all_text_contents()
                                page.evaluate("""()=>{
                                  const chart=document.querySelector('#signed');
                                  chart.dataset.preFontRenderText=[...chart.querySelectorAll('svg text')].map(e=>e.textContent).join('|');
                                  MicroData.render(chart);
                                }""")
                                after_text = page.locator("#signed svg text").all_text_contents()
                                check(f"{width} {direction} 1x: CHART-004 font-ready rerender retains complete line text",
                                      before_text == after_text and page.locator("#signed .m-chart__data li").count() == 3,
                                      {"before": before_text, "after": after_text})
                                page.add_style_tag(content="#bars svg text,#signed svg text{font-size:26px!important}")
                                page.evaluate("MicroData.render(document.querySelector('#bars'));MicroData.render(document.querySelector('#signed'))")
                                large_type = page.locator("#signed svg text").evaluate_all("es=>es.length>0&&es.every(e=>parseFloat(getComputedStyle(e).fontSize)>=26)")
                                long_type_state = page.evaluate("""()=>{
                                  const source=document.querySelector('#bars .m-chart__data [data-label="قيمة صفرية"]');
                                  return {largeText:[...document.querySelectorAll('#signed svg text')].map(e=>getComputedStyle(e).fontSize),
                                    longSource:source&&source.getAttribute('data-label'),
                                    pageWidth:document.documentElement.scrollWidth,viewport:innerWidth};
                                }""")
                                check(f"{width} {direction} 1x: long reading remains available at simulated 200% type",
                                      large_type and "123456789012345" in page.locator("#stat").inner_text()
                                      and long_type_state["longSource"] == "قيمة صفرية"
                                      and long_type_state["pageWidth"] <= long_type_state["viewport"], long_type_state)
                                page.screenshot(path=str(out / f"light-data-{width}-{direction}-200-type.png"), full_page=True)
                        page.close()
                        context.close()

            # ---------- 2026-10-25 owner contracts ----------
            if not args.capture_only:
                context = browser.new_context(
                    viewport={"width": 320, "height": 900},
                    device_scale_factor=1,
                    color_scheme="light",
                )
                page = context.new_page()
                page.on("pageerror", lambda exc: errors.append(str(exc)))
                page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
                page.on("requestfailed", lambda req: errors.append(req.url + ": " + str(req.failure)))
                page.goto(url)
                page.evaluate("() => document.fonts.ready")
                page.wait_for_timeout(80)

                check("bubbles with an empty dataset renders the honest no-data state (no blank frame)",
                      page.locator("#bubbles-empty .m-chart__empty").count() == 1
                      and page.locator("#bubbles-empty .m-bubbles").count() == 0
                      and page.locator("#bubbles-empty .m-bubble").count() == 0
                      and page.locator("#bubbles-empty[data-scale-state=empty]").count() == 1
                      and "لا توجد بيانات" in page.locator("#bubbles-empty .m-chart__empty").inner_text())
                check("signed chart with all-unknown values renders no axes and keeps complete readings",
                      page.locator("#signed-empty .m-chart__empty").count() == 1
                      and page.locator("#signed-empty [data-zero-axis]").count() == 0
                      and page.locator("#signed-empty .m-chart__readings dt").count() == 2
                      and page.locator("#signed-empty[data-scale-state=empty]").count() == 1)
                page.locator("#donut-unit .m-chart__disclose").click()
                donut_caption = page.locator("#donut-unit table.m-chart__dataset caption").inner_text()
                donut_rows = page.locator("#donut-unit table.m-chart__dataset tbody tr").all_text_contents()
                check("donut alternate table caption carries unit, period and declared denominator",
                      "الوحدة: طلب" in donut_caption and "الفترة: أكتوبر" in donut_caption
                      and "إجمالي الطلبات: 25" in donut_caption, donut_caption)
                check("donut mixed zero dataset keeps the zero category in the table",
                      len(donut_rows) == 3 and any("0" in r for r in donut_rows)
                      and "فئة أ" in donut_rows[0] and "صفر" in donut_rows[2], donut_rows)
                compact = page.evaluate("""()=>{
                    const chart=document.querySelector('#donut');
                    const svg=chart.querySelector('.m-donut__svg');
                    const legend=chart.querySelector('.m-legend');
                    if(!svg||!legend) return {ok:false};
                    const s=svg.getBoundingClientRect(), l=legend.getBoundingClientRect();
                    return {ok:true, svgW:Math.round(s.width), beside: l.left < s.right - 2 || l.right > s.left + 2,
                            sameRow: Math.abs(l.top - s.top) < s.height};
                }""")
                check("donut compact presentation at 320px: 112px ring with the legend beside it",
                      compact.get("ok") and compact.get("svgW") == 112
                      and compact.get("beside") and compact.get("sameRow"), compact)
                wide_ctx = browser.new_context(viewport={"width": 430, "height": 900}, device_scale_factor=1, color_scheme="light")
                wide_page = wide_ctx.new_page()
                wide_page.goto(url)
                wide_page.evaluate("() => document.fonts.ready")
                wide_page.wait_for_timeout(80)
                wide_donut = wide_page.evaluate("""()=>{
                    const svg=document.querySelector('#donut').querySelector('.m-donut__svg');
                    return Math.round(svg.getBoundingClientRect().width);
                }""")
                check("donut keeps the 148px ring at a wide container (responsive contract)",
                      wide_donut == 148, wide_donut)
                wide_page.close()
                wide_ctx.close()

                check("packed-circle gains the complete table switch with every category and state",
                      page.locator("#packed .m-chart__disclose").count() == 1
                      and page.locator("#packed .m-chart__disclose").get_attribute("aria-expanded") == "false")
                page.locator("#packed .m-chart__disclose").click()
                packed_rows = page.locator("#packed table.m-chart__dataset tbody tr").all_text_contents()
                check("packed-circle table opens with all three readings and a semantic structure",
                      page.locator("#packed .m-chart__disclose").get_attribute("aria-expanded") == "true"
                      and len(packed_rows) == 3
                      and page.locator("#packed table.m-chart__dataset tbody th[scope=row]").count() == 3,
                      packed_rows)
                page.locator("#packed .m-chart__disclose").click()
                check("packed-circle table hides again with the button label restored",
                      page.locator("#packed table.m-chart__dataset").is_hidden()
                      and page.locator("#packed .m-chart__disclose").inner_text() == "عرض البيانات كجدول")

                check("metric-circles gains the complete table switch",
                      page.locator("#metric-circles .m-main-metric__disclose").count() == 1)
                page.locator("#metric-circles .m-main-metric__disclose").click()
                circles_rows = page.locator("#metric-circles table.m-main-metric__dataset tbody tr").all_text_contents()
                check("metric-circles table opens with label, value and state for every reading",
                      page.locator("#metric-circles .m-main-metric__disclose").get_attribute("aria-expanded") == "true"
                      and len(circles_rows) == 3
                      and any("صفر" in r for r in circles_rows)
                      and page.locator("#metric-circles table.m-main-metric__dataset thead th[scope=col]").count() == 3,
                      circles_rows)
                page.locator("#main-flat .m-main-metric__disclose").click()
                flat_rows = page.locator("#main-flat table.m-main-metric__dataset tbody tr").all_text_contents()
                flat_headers = page.locator("#main-flat table.m-main-metric__dataset thead th").all_text_contents()
                check("metric-bars table opens with value, unit and period columns for every reading",
                      page.locator("#main-flat .m-main-metric__disclose").get_attribute("aria-expanded") == "true"
                      and len(flat_rows) == 3 and flat_headers == ["الفئة", "القيمة", "الوحدة", "الفترة"]
                      and any("(سالب)" in r for r in flat_rows)
                      and any("(غير متاح)" in r for r in flat_rows),
                      {"rows": flat_rows, "headers": flat_headers})
                overflow = page.evaluate(
                    "()=>({doc: document.documentElement.scrollWidth, view: innerWidth})")
                check("all new tables keep the page free of horizontal overflow at 320px",
                      overflow["doc"] <= overflow["view"] + 1, overflow)
                page.screenshot(path=str(out / "light-data-2026-10-25-contracts-320-rtl.png"), full_page=True)
                page.close()
                context.close()

            check("no browser, console, or resource errors", not errors, errors)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    report = {
        "browser": version,
        "theme": "Light only",
        "scope": "Chromium source fixture; 320/360/390/430 CSS px, RTL/LTR, DPR 1/2; 200% is simulated CSS enlargement, not native zoom",
        "capture_only": args.capture_only,
        "source_sha256": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in SOURCES},
        "passed": sum(1 for item in checks if item["passed"]),
        "failed": sum(1 for item in checks if not item["passed"]),
        "checks": checks,
    }
    (out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f'{report["passed"]} PASS / {report["failed"]} FAIL; output {out}')
    return 0 if args.capture_only or report["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
