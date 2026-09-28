#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B05 البيانات والتتبّع: فحص ولقطات. من جذر المستودع:
  python3 tools/b05-screenshots.py
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "B05" / "screenshots"
LOGFILE = ROOT / "reviews" / "B05" / "verification.txt"
results, log_lines = [], []

def log(m):
    print(m); log_lines.append(m)

def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))

def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    board = f"{base}/previews/data/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    log(f"# B05 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}\n")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("console", lambda m: errors.append((m.text or "") + " @" + ((m.location or {}).get("url") or "")) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(board)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        check("A1 لا أخطاء", len(errors) == 0, "; ".join(errors[:2]))

        # ---- DATA-01: مجهول ≠ 0 وسالب بعلامته ----
        unknown = page.evaluate(
            """() => document.querySelector('.m-stat__value--unknown .m-stat__num').textContent.includes('غير متاح')""")
        neg = page.evaluate(
            """() => { const n = document.querySelector('.m-stat__num--negative').textContent;
                 return n.startsWith('-') && getComputedStyle(document.querySelector('.m-stat__num--negative')).color === 'rgb(173, 48, 59)'; }""")
        check("A2 المجهول «غير متاح» والسالب بعلامته ولونه الدلالي", unknown and neg, f"unknown={unknown} neg={neg}")

        # ---- DATA-02: أعمدة — صفر ظاهر، ناقص «—»، شاذة موسومة، القيم ظاهرة ----
        bars = page.evaluate(
            """() => { const c = document.querySelector('#bars .m-chart');
                 const svg = c.querySelector('svg');
                 return {svg: !!svg,
                         values: [...svg.querySelectorAll('.m-chart__bar-value')].map(t => t.textContent),
                         outlier: c.textContent.includes('قيمة شاذة'),
                         zeroStroke: !!svg.querySelector('rect[stroke]')}; }""")
        check("A3 أعمدة: القيم ظاهرة (8/0/—/12) والشاذة موسومة والصفر بحد ظاهر",
              bars["svg"] and bars["values"][:4] == ["8", "0", "—", "12"] and bars["outlier"], str(bars["values"]))

        # ---- 5 فئات: تعيين الألوان ثابت بالمفتاح لا بالترتيب ----
        colors = page.evaluate(
            """() => { const charts = document.querySelectorAll('#bars .m-chart');
                 const last = charts[charts.length - 1];
                 const fills = [...last.querySelectorAll('rect')].map(r => r.getAttribute('fill'));
                 return {uniq: new Set(fills).size, first: fills[0]}; }""")
        check("A4 خمس فئات بألوان تعيين ثابت (5 ألوان من المفاتيح)", colors["uniq"] == 5, str(colors))

        # ---- تعديل بيانات من المصدر ينعكس (إثبات) ----
        before = page.evaluate(
            """() => { const c = document.querySelector('#bars .m-chart');
                 const t = [...c.querySelectorAll('.m-chart__bar-value')][0];
                 return {text: t.textContent, y: Math.round(parseFloat(t.getAttribute('y')))}; }""")
        page.evaluate(
            """() => { const li = document.querySelector('#bars .m-chart [data-series="a"]');
                 li.setAttribute('data-value', '11'); MicroData.init(); }""")
        after = page.evaluate(
            """() => { const c = document.querySelector('#bars .m-chart');
                 const t = [...c.querySelectorAll('.m-chart__bar-value')][0];
                 return {text: t.textContent, y: Math.round(parseFloat(t.getAttribute('y')))}; }""")
        page.evaluate(
            """() => { const li = document.querySelector('#bars .m-chart [data-series="a"]');
                 li.setAttribute('data-value', '8'); MicroData.init(); }""")
        restored = page.evaluate(
            """() => [...document.querySelector('#bars .m-chart').querySelectorAll('.m-chart__bar-value')][0].textContent""")
        check("A5 تعديل بيانات المصدر ينعكس ثم يستعاد (8→11→8)",
              before["text"] == "8" and after["text"] == "11" and after["y"] < before["y"] and restored == "8",
              f"قبل {before} أثناء {after} بعد {restored}")

        # ---- DATA-03: دوائر — المساحة ∝ القيمة (√) ----
        radii = page.evaluate(
            """() => { const bs = [...document.querySelectorAll('#shapes .m-bubble')]
                   .filter(b => b.querySelector('.m-bubble__circle:not(.m-bubble__circle--none)'));
                 return bs.map(b => Math.round(parseFloat(b.querySelector('.m-bubble__circle').style.width))); }""")
        expected_49 = radii[0] * (49 / 100) ** 0.5
        expected_25 = radii[0] * (25 / 100) ** 0.5
        ratio_ok = (len(radii) >= 4
                    and abs(radii[1] - expected_49) <= 2
                    and abs(radii[2] - expected_25) <= 2
                    and radii[0] > radii[1] > radii[2] > radii[3]
                    and radii[3] >= 8)
        check("A6 دوائر المساحة: نصف القطر √القيمة (100→49→25→1)",
              ratio_ok, f"أقطار={radii} (1 صغيرة بتسمية خارجية)")

        # ---- بدائل الصفر/السالب/الناقص في الدوائر ----
        alts = page.evaluate(
            """() => { const wrap = document.querySelectorAll('#shapes .m-chart')[1];
                 return {none: wrap.querySelectorAll('.m-bubble__circle--none').length,
                         neg: wrap.textContent.includes('سالب غير صالح'),
                         miss: wrap.textContent.includes('غير متاح')}; }""")
        check("A7 الدوائر: 3 بدائل ظاهرة (صفر/سالب غير صالح/ناقص)", alts["none"] == 3 and alts["neg"] and alts["miss"], str(alts))

        # ---- التوزيع: مفتاح بنسب من مقام معلن ----
        legend = page.evaluate(
            """() => { const l = document.querySelector('#shapes .m-legend');
                 return {items: l ? l.querySelectorAll('.m-legend__item').length : 0,
                         pct: l ? l.textContent.includes('(60%)') : false}; }""")
        check("A8 التوزيع: مفتاح بقيم كاملة ونسبة 60% من المقام 100", legend["items"] == 3 and legend["pct"], str(legend))

        # ---- DATA-04: محدد vs غير محدد + خطوات الحالات الأربع ----
        prog = page.evaluate(
            """() => ({det: document.querySelector('.m-progress').getAttribute('style').includes('65%'),
                       ind: !!document.querySelector('.m-progress--indeterminate'),
                       val: document.querySelector('.m-progress__value').textContent})""")
        steps = page.evaluate(
            """() => ({complete: document.querySelectorAll('.m-step--complete').length,
                       current: document.querySelectorAll('.m-step--current').length,
                       upcoming: document.querySelectorAll('.m-step--upcoming').length,
                       blocked: document.querySelectorAll('.m-step--blocked').length,
                       badge: document.querySelector('.m-step--current .m-badge').textContent.includes('الحالية')})""")
        check("A9 تقدم محدد 65% وغير محدد بتسمية؛ خطوات الحالات الأربع بشارة نصية للحالي",
              prog["det"] and prog["ind"] and steps["complete"] == 2 and steps["current"] == 1
              and steps["upcoming"] == 1 and steps["blocked"] == 1 and steps["badge"], f"{prog} {steps}")

        # ---- لقطات ----
        page.locator("#values").screenshot(path=str(SHOTS / "01-values-390.png"))
        page.locator("#bars").screenshot(path=str(SHOTS / "02-bars-390.png"))
        page.locator("#line").screenshot(path=str(SHOTS / "03-line-390.png"))
        page.locator("#shapes").screenshot(path=str(SHOTS / "04-shapes-390.png"))
        page.locator("#tracking").screenshot(path=str(SHOTS / "05-tracking-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "08-assets-390.png"))
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ---- الهواتف + التكبير ----
        for width in (320, 390, 430):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            ov = pg.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
            check(f"B1 {width}px بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))
            if width in (320, 390):
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(250)
                tz = pg.evaluate(
                    """() => { const t = document.getElementById('text-zoom-target');
                         const num = t.querySelector('.m-stat__num');
                         return {font: getComputedStyle(num).fontSize, sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: الرقم 72px والمحتوى داخل العمود",
                      tz["font"] == "72px" and tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"06-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
            c.close()

        # ---- تقليل الحركة: شريط الانتظار ثابت ----
        c = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        anim = pg.evaluate(
            "() => getComputedStyle(document.querySelector('.m-progress--indeterminate .m-progress__bar')).animationName")
        check("D1 تقليل الحركة: شريط الانتظار غير المحدد ثابت (التسمية تحمل الدلالة)", anim == "none", f"animation={anim}")
        c.close()

        browser.close()
    server.shutdown()

    log("")
    total = len(results)
    passed = sum(1 for _, ok in results if ok)
    log(f"# النتيجة: {passed}/{total} ناجح")
    LOGFILE.write_text("\n".join(log_lines) + "\n", encoding="utf-8")
    if passed != total:
        sys.exit(1)
    print(f"\nOK — اللقطات في {SHOTS}")

if __name__ == "__main__":
    main()
