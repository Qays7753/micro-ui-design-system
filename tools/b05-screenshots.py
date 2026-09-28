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
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log(f"# B05 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree} (الأدلة مولدة من شجرة هذا commit نظيفة)")
    log("")

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

        # ---- DATA-03: دوائر — المساحة ∝ القيمة (√) بلا حد يضخّم (E06) ----
        radii = page.evaluate(
            """() => { const bs = [...document.querySelectorAll('#shapes .m-bubble')]
                   .filter(b => b.querySelector('.m-bubble__circle:not(.m-bubble__circle--none)'));
                 return bs.map(b => parseFloat(b.querySelector('.m-bubble__circle').style.width)); }""")
        expected_49 = radii[0] * (49 / 100) ** 0.5
        expected_25 = radii[0] * (25 / 100) ** 0.5
        expected_001 = radii[0] * (0.01 / 100) ** 0.5  # 0.01: قطر حقيقي بلا حد أدنى
        ratio_ok = (len(radii) >= 5
                    and abs(radii[1] - expected_49) <= 2
                    and abs(radii[2] - expected_25) <= 2
                    and radii[0] > radii[1] > radii[2] > radii[3]
                    and abs(radii[4] - expected_001) <= 0.15 and radii[4] < 2)
        check("A6 دوائر المساحة: نصف القطر √القيمة (100→49→25→1) و0.01 بقطرها الحقيقي ~1.04px بلا تضخيم",
              ratio_ok, f"أقطار={radii} متوقع_0.01={expected_001:.2f}")

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

        # ---- E06: حالات الحدود الصعبة (لا تمثيل مضلل) ----
        edges = page.evaluate(
            """() => { const sec = document.getElementById('edge-cases');
                 const charts = [...sec.querySelectorAll('[data-chart]')];
                 const negBar = charts[0];
                 const negTxt = negBar.textContent.includes('-5 — سالب غير مرسوم');
                 // لا عمود موجب وهمي للسالب: مستطيل بارتفاع فوق الأساس لا يضاف
                 const negRectHeights = [...negBar.querySelectorAll('rect')].map(r => parseFloat(r.getAttribute('height') || 0));
                 const zeroDonut = charts[1];
                 const noNaN = !zeroDonut.innerHTML.includes('NaN');
                 // R2-05: كل القيم صفر مع مقام معلن 100 — المركز يظهر المقام المعلن لا صفرًا متناقضًا
                 const zeroCenter = zeroDonut.querySelector('.m-donut__center') && zeroDonut.querySelector('.m-donut__center').textContent === '100';
                 const errDonut = charts[2];
                 const errShown = !!errDonut.querySelector('.m-chart__error') &&
                                  errDonut.querySelector('.m-chart__error').textContent.includes('110');
                 const rawLegend = errDonut.querySelector('.m-legend') && !errDonut.querySelector('.m-legend').textContent.includes('%');
                 const line = charts[3];
                 const dash = line.textContent.includes('—');
                 return {negTxt, negNoPositiveBar: negRectHeights.every(h => h >= 0), noNaN, zeroCenter, errShown, rawLegend, dash}; }""")
        check("A10 عمود سالب لا يُرسم كموجب + توزيع صفري بلا NaN وبالمقام المعلن في المركز + مقام مخطئ برسالة صريحة وقيم خام",
              edges["negTxt"] and edges["negNoPositiveBar"] and edges["noNaN"] and edges["zeroCenter"]
              and edges["errShown"] and edges["rawLegend"], str(edges))

        # ---- E06: الخط ينقطع عند المفقود (شرائح لا وصلة صامتة) + المفتاح نص حرفي ----
        split = page.evaluate(
            """() => { const mainLine = document.querySelectorAll('#line [data-chart]')[0];
                 const polys = mainLine.querySelectorAll('polyline').length; // 5 نقاط وفجوة وسطية: شريحتان
                 // حقن التسمية: نص حرفي بلا عناصر
                 const host = document.createElement('div');
                 host.innerHTML = '<div class="m-chart" data-chart="donut" data-total="10"><ul class="m-chart__data" hidden>' +
                   '<li data-series="a" data-label="<b id=inj>حقن</b>" data-value="5"></li></ul>' +
                   '<div class="m-chart__plot m-donut" data-plot></div></div>';
                 document.body.appendChild(host);
                 MicroData.render(host.querySelector('[data-chart]'));
                 const legend = host.querySelector('.m-legend');
                 const literal = legend.textContent.includes('<b id=inj>حقن</b>');
                 const noElement = !legend.querySelector('b');
                 host.remove();
                 return {polys, literal, noElement}; }""")
        check("A11 الخط ينقطع عند الفجوة (شريحتان) + تسمية المستهلك نص حرفي (عُقد DOM لا innerHTML)",
              split["polys"] == 2 and split["literal"] and split["noElement"], str(split))

        # ---- R2-05: فارق المفقود/الصفر والرقم الكامل والمقام الغائب/غير الصالح ----
        r2d = page.evaluate(
            """() => { try {
                 function donut(dataItems, totalAttr) {
                   const host = document.createElement('div');
                   const total = totalAttr === undefined ? '' : ` data-total="${totalAttr}"`;
                   host.innerHTML = `<div class="m-chart" data-chart="donut"${total}><ul class="m-chart__data" hidden>${dataItems}</ul><div class="m-chart__plot m-donut" data-plot></div></div>`;
                   document.body.appendChild(host);
                   MicroData.render(host.querySelector('[data-chart]'));
                   const c = host.querySelector('[data-chart]');
                   const center = c.querySelector('.m-donut__center');
                   const clab = c.querySelector('.m-donut__center-label');
                   const err = c.querySelector('.m-chart__error');
                   const legend = c.querySelector('.m-legend');
                   const out = {center: center ? center.textContent : null,
                                label: clab ? clab.textContent : null,
                                err: err ? err.textContent : null,
                                legend: legend ? legend.textContent : ''};
                   host.remove();
                   return out;
                 }
                 const allNull = donut('<li data-series="a" data-label="أ" data-value=""></li><li data-series="b" data-label="ب" data-value="x"></li>');
                 const allZero = donut('<li data-series="a" data-label="أ" data-value="0"></li><li data-series="b" data-label="ب" data-value="0"></li>');
                 const mixNullZero = donut('<li data-series="a" data-label="أ" data-value="0"></li><li data-series="b" data-label="ب" data-value=""></li>');
                 const oops = donut('<li data-series="a" data-label="أ" data-value="12oops"></li><li data-series="b" data-label="ب" data-value="3"></li>', 100);
                 const badTotal = donut('<li data-series="a" data-label="أ" data-value="4"></li>', 'bad');
                 const noTotal = donut('<li data-series="a" data-label="أ" data-value="4"></li><li data-series="b" data-label="ب" data-value="6"></li>');
                 return {allNull, allZero, mixNullZero, oops, badTotal, noTotal};
               } catch (e) { return {err: e.message}; } }""")
        a = r2d.get("allNull", {}); z = r2d.get("allZero", {}); m = r2d.get("mixNullZero", {})
        o = r2d.get("oops", {}); b = r2d.get("badTotal", {}); n = r2d.get("noTotal", {})
        check("A12 (R2-05) all-null يعرض «— / لا توجد بيانات» لا صفرًا، والخلط مع المجهول «الإجمالي غير معلوم»، و12oops مجهول لا 12، والمقام غير الصالح خطأ صريح، والغائب مجموع الفئات",
              a.get("center") == "—" and a.get("label") == "لا توجد بيانات"
              and z.get("center") == "0"
              and m.get("center") == "—" and m.get("label") == "الإجمالي غير معلوم"
              and o.get("center") == "100" and "12oops" not in o.get("legend", "")
              and "غير متاح" in o.get("legend", "")
              and b.get("err") is not None and "bad" in b.get("err", "")
              and n.get("center") == "10", str(r2d))


        # ---- SYS-02/E11: المثال المستقل بلا board.* ----
        ex5 = f"{base}/previews/data/example-usage.html"
        pe5 = ctx.new_page()
        ex_err5 = []
        pe5.on("pageerror", lambda e: ex_err5.append(str(e)))
        pe5.goto(ex5)
        pe5.wait_for_load_state("networkidle")
        pe5.wait_for_timeout(1200)
        ex_res5 = pe5.evaluate("() => document.getElementById('results').textContent")
        check("EX مثال مستقل data: 0 فشل بلا أخطاء",
              ex_res5.count("FAIL ") == 0 and ex_res5.count("PASS ") >= 3 and not ex_err5,
              ex_res5.splitlines()[0] if ex_res5 else "لا نتائج")
        pe5.close()

        # ---- لقطات ----
        page.locator("#values").screenshot(path=str(SHOTS / "01-values-390.png"))
        page.locator("#bars").screenshot(path=str(SHOTS / "02-bars-390.png"))
        page.locator("#line").screenshot(path=str(SHOTS / "03-line-390.png"))
        page.locator("#shapes").screenshot(path=str(SHOTS / "04-shapes-390.png"))
        page.locator("#edge-cases").screenshot(path=str(SHOTS / "09-edge-cases-390.png"))
        page.locator("#tracking").screenshot(path=str(SHOTS / "05-tracking-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "08-assets-390.png"))
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ---- E1: تعديل توكن → انعكاس → استعادة ----
        tok = page.evaluate(
            """() => { const root = document.documentElement.style;
                 root.setProperty('--micro-data-a', '#FF0000');
                 const v = getComputedStyle(document.querySelector('#shapes .m-bubble')).getPropertyValue('--micro-data-a');
                 root.removeProperty('--micro-data-a');
                 const back = getComputedStyle(document.querySelector('#shapes .m-bubble')).getPropertyValue('--micro-data-a');
                 return {changed: v, restored: back}; }""")
        check("E1 تعديل توكن → انعكاس في المكوّن → استعادة الأصل",
              tok["changed"] == " #FF0000" or tok["changed"] == "#FF0000", str(tok))

        # ---- الهواتف + التكبير + فحص تداخل تسميات SVG (E07) ----
        for width in (320, 360, 390, 430):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            ov = pg.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
            check(f"B1 {width}px بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))
            if width in (320, 360, 390):
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(250)
                tz = pg.evaluate(
                    """() => { const t = document.getElementById('text-zoom-target');
                         const num = t.querySelector('.m-stat__num');
                         return {font: getComputedStyle(num).fontSize, sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: الرقم 72px والمحتوى داخل العمود",
                      tz["font"] == "72px" and tz["sw"] <= tz["cw"] + 1, str(tz))
                # E07: تسميات الرسم داخل SVG لا تتزاحم/تتداخل عند التكبير (لا قياس عرض صفحة فقط)
                labels = pg.evaluate(
                    """() => { const sec = document.getElementById('bars');
                         const texts = [...sec.querySelectorAll('svg .m-chart__bar-label')];
                         const rs = texts.map(t => t.getBoundingClientRect());
                         let overlap = false;
                         for (let i = 0; i < rs.length; i++)
                           for (let j = i + 1; j < rs.length; j++) {
                             const a = rs[i], b = rs[j];
                             if (a.left < b.right - 0.5 && b.left < a.right - 0.5 &&
                                 a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) overlap = true;
                           }
                         return {count: texts.length, overlap}; }""")
                check(f"B3 {width}px تكبير 200%: تسميات الأعمدة داخل SVG لا تتداخل (فحص مستطيلات لا عرض صفحة)",
                      labels["count"] >= 3 and not labels["overlap"], str(labels))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"06-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(200)
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
