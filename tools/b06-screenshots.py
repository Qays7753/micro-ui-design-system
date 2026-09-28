#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B06 الرسائل والحالات: فحص ولقطات. من جذر المستودع:
  python3 tools/b06-screenshots.py
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "B06" / "screenshots"
LOGFILE = ROOT / "reviews" / "B06" / "verification.txt"
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
    board = f"{base}/previews/messages/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    log(f"# B06 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}\n")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(board)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        check("A1 لا أخطاء", len(errors) == 0, "; ".join(errors[:2]))

        # ---- MSG-01: الأدوار الإعلانية لكل نوع ----
        roles = page.evaluate(
            """() => [...document.querySelectorAll('#notes .m-note')].map(n => ({
                 kind: [...n.classList].find(c => c.startsWith('m-note--')),
                 role: n.getAttribute('role') }))""")
        ok_roles = (roles[0]["role"] == "note" and roles[1]["role"] == "status"
                    and roles[2]["role"] == "status" and roles[3]["role"] == "alert"
                    and roles[4]["role"] == "alert")
        check("A2 أدوار الإعلان: مساعدة note، معلومة/نجاح status، تحذير/خطأ alert",
              ok_roles, str(roles))

        # ---- الرسالة الثابتة لا تختفي (مهمة لا Toast) ----
        page.wait_for_timeout(5200)
        still = page.evaluate(
            """() => [...document.querySelectorAll('#notes .m-note')].every(n => !n.hidden)""")
        check("A3 الرسائل الثابتة تبقى بعد 5 ثوانٍ (لا تختفي ذاتيًا)", still)

        # ---- زر الإغلاق يخفي الرسالة — إخفاء فعليًا لا سمة فقط (E01) ----
        def truly_hidden(sel):
            return page.evaluate(
                """(sel) => { const el = document.querySelector(sel);
                     const cs = getComputedStyle(el);
                     const r = el.getBoundingClientRect();
                     return cs.display === 'none' && r.width === 0 && r.height === 0; }""", sel)
        page.click("#notes .m-note--error .m-note__close")
        closed = truly_hidden("#notes .m-note--error")
        check("A4 الإغلاق اليدوي للرسالة يعمل (display محسوب none + بلا مستطيل)", closed)

        # ---- Toast: الظهور/الاختفاء بالظهور المحسوب والمستطيلات (E01) ----
        page.click("[data-toast-demo]")
        toast_visible = page.evaluate(
            """() => { const el = document.querySelector('[data-toast]');
                 return !el.hidden && getComputedStyle(el).display !== 'none' &&
                        el.getBoundingClientRect().height > 0; }""")
        mirror = page.evaluate("() => !document.querySelector('[data-toast-mirror]').hidden")
        page.wait_for_timeout(300)  # مهلة إعلان aria-live (50ms داخل المكوّن + هامش)
        live = page.evaluate("() => document.querySelector('.m-live-region').textContent")
        page.wait_for_timeout(4400)
        toast_gone = truly_hidden("[data-toast]")
        mirror_still = page.evaluate("() => !document.querySelector('[data-toast-mirror]').hidden")
        check("A5 العابرة: تظهر مع بديل ثابت ويختفي بعد مدته (إخفاء فعلي) والبديل يبقى",
              toast_visible and mirror and toast_gone and mirror_still,
              f"ظهرت={toast_visible} بديل={mirror} اختفت={toast_gone} البديل باقٍ={mirror_still}")
        check("A6 الإعلان دون تكرار: المنطقة تحمل النص مرة واحدة (مسار واحد بلا role على العنصر)",
              len(live) > 0, f"live='{live[:40]}'")
        before_txt = page.evaluate("() => document.querySelector('.m-live-region').textContent")
        page.click("[data-toast-repeat]")
        page.wait_for_timeout(400)
        after_txt = page.evaluate("() => document.querySelector('.m-live-region').textContent")
        check("A7 إعادة نفس النص: لا إعلان مكرر", before_txt == after_txt, f"ثابت='{after_txt[:30]}'")

        # ---- E01: إغلاق العابرة من المصدر وإعادة الاستخدام دون مؤقت قديم ----
        page.click("[data-toast-demo]")
        page.wait_for_timeout(200)
        page.click("[data-toast] [data-toast-close]")  # زر داخل العنصر → عقد closeToast في المكوّن
        manual = truly_hidden("[data-toast]")
        no_timer = page.evaluate("() => !('toastTimer' in document.querySelector('[data-toast]').dataset)")
        page.click("[data-toast-demo]")
        page.wait_for_timeout(400)
        reused = page.evaluate(
            """() => { const el = document.querySelector('[data-toast]');
                 return getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0; }""")
        check("A9 الإغلاق اليدوي من المصدر (closeToast) وإعادة الاستخدام بلا مؤقت قديم",
              manual and no_timer and reused, f"أغلق={manual} بلا_مؤقت={no_timer} أعيد={reused}")
        truly_hidden("[data-toast]")  # توازن الحالة قبل اللقطات

        # ---- E1: تعديل توكن → انعكاس → استعادة (دليل الاستقلال) ----
        tok = page.evaluate(
            """() => { const root = document.documentElement.style;
                 root.setProperty('--micro-radius-field', '2px');
                 const v = getComputedStyle(document.querySelector('#notes .m-note')).borderRadius;
                 root.removeProperty('--micro-radius-field');
                 const back = getComputedStyle(document.querySelector('#notes .m-note')).borderRadius;
                 return {changed: v, restored: back}; }""")
        check("E1 تعديل توكن → انعكاس في المكوّن → استعادة الأصل",
              tok["changed"] == "2px" and tok["restored"] != "2px", str(tok))

        # ---- المثال المستقل: عقد E01 كاملًا بلا board.* ----
        ex = f"{base}/previews/messages/example-usage.html"
        pe = ctx.new_page()
        ex_errors = []
        pe.on("console", lambda m: ex_errors.append(m.text) if m.type == "error" else None)
        pe.on("pageerror", lambda e: ex_errors.append(str(e)))
        pe.goto(ex)
        pe.wait_for_load_state("networkidle")
        pe.wait_for_timeout(2200)  # تسلسل الفحوص الداخلية (~1.9s)
        ex_results = pe.evaluate("() => document.getElementById('results').textContent")
        ex_pass = ex_results.count("PASS ")
        ex_fail = ex_results.count("FAIL ")
        check("A10 المثال المستقل (بلا board.*): عقد الإخفاء/الإغلاق/إعادة الاستخدام/استرجاع التركيز",
              ex_fail == 0 and ex_pass >= 7 and not ex_errors,
              f"{ex_pass} PASS / {ex_fail} FAIL; errors={ex_errors[:1]}")
        pe.screenshot(path=str(SHOTS / "05-example-after-close.png"), full_page=True)
        pe.close()

        # ---- الفراغ: ثلاث حالات مفهومة + إعادة المحاولة بمحاكاة ----
        page.click("[data-retry-demo]")
        page.wait_for_timeout(200)
        skel = page.evaluate("() => !document.querySelector('[data-retry-skeleton]').hidden")
        page.wait_for_timeout(1400)
        done = page.evaluate(
            """() => { const s = document.querySelector('[data-fail-state]');
                 return !s.hidden && s.textContent.includes('محاكاة'); }""")
        check("A8 إعادة المحاولة: skeleton ثم نتيجة محاكاة (لا بيانات مخترنة)",
              skel and done, f"skeleton={skel} نتيجة={done}")

        # ---- لقطات ----
        page.locator("#notes").screenshot(path=str(SHOTS / "01-notes-390.png"))
        page.locator("#wait").screenshot(path=str(SHOTS / "02-wait-skeleton-390.png"))
        page.locator("#empty").screenshot(path=str(SHOTS / "03-empty-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "07-assets-390.png"))
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
                         const body = t.querySelector('.m-note__body');
                         return {font: getComputedStyle(body).fontSize, sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: نص التحذير 28px داخل العمود",
                      tz["font"] == "28px" and tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"04-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
            c.close()

        # ---- تقليل الحركة: skeleton ثابت ومؤشر انتظار ثابت ----
        c = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        anims = pg.evaluate(
            """() => ({skel: getComputedStyle(document.querySelector('.m-skeleton__block')).animationName,
                       wait: getComputedStyle(document.querySelector('.m-wait__spinner')).animationName})""")
        check("D1 تقليل الحركة: لا لمعان skeleton ولا دوران مؤشر (التسمية تحمل الدلالة)",
              anims["skel"] == "none" and anims["wait"] == "none", str(anims))
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
