#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B07 التنقّل والطبقات: فحص ولقطات. من جذر المستودع:
  python3 tools/b07-screenshots.py
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "B07" / "screenshots"
LOGFILE = ROOT / "reviews" / "B07" / "verification.txt"
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
    board = f"{base}/previews/navigation/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    log(f"# B07 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
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

        # ---- NAV-01: تبويبات تغيّر المحتوى فعليًا + أسهم RTL ----
        tab_a = page.evaluate("() => !document.getElementById('tab-a').hidden")
        page.click("#tab-b-btn")
        tab_b = page.evaluate(
            """() => ({bVisible: !document.getElementById('tab-b').hidden,
                       aHidden: document.getElementById('tab-a').hidden,
                       sel: document.getElementById('tab-b-btn').getAttribute('aria-selected')})""")
        page.focus("#tab-b-btn")
        page.keyboard.press("ArrowRight")  # RTL: يمين = السابق
        back = page.evaluate("() => document.getElementById('tab-b-btn').getAttribute('aria-selected')")
        check("A2 تبويبات: تبديل لوحة مرتبطة فعليًا وأسهم RTL تعمل",
              tab_a and tab_b["bVisible"] and tab_b["aHidden"] and tab_b["sel"] == "true" and back == "false",
              f"أول={tab_a} ثانٍ={tab_b} بعد سهم={back}")

        # ---- حوار الحذف: خلفية keep + تركيز + استعادة + Escape ----
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(100)
        dlg = page.evaluate(
            """() => { const d = document.getElementById('dialog-delete');
                 return {open: !d.hidden, focused: document.activeElement.tagName,
                         backdrop: !document.querySelector('.m-layer-backdrop[data-for="dialog-delete"]').hidden,
                         policy: d.getAttribute('data-backdrop')}; }""")
        page.keyboard.press("Escape")
        page.wait_for_timeout(100)
        esc = page.evaluate(
            """() => ({closed: document.getElementById('dialog-delete').hidden,
                       refocus: document.activeElement === document.querySelector("[data-layer-open='dialog-delete']")})""")
        check("A3 حوار الحذف: يفتح بتركيز داخلي وخلفية ظاهرة وسياسة keep وEscape يستعيد التركيز",
              dlg["open"] and dlg["focused"] == "BUTTON" and dlg["backdrop"] and dlg["policy"] == "keep"
              and esc["closed"] and esc["refocus"], f"{dlg} {esc}")

        # ---- الضغط بالخلفية على حوار المتلف: لا يغلق (سياسة keep) ----
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(80)
        page.mouse.click(10, 470)  # خارج الطبقة الموسّطة
        kept = page.evaluate("() => !document.getElementById('dialog-delete').hidden")
        page.keyboard.press("Escape")
        page.wait_for_timeout(80)
        check("A4 حوار المتلف: الضغط بالخلفية لا يغلق (قرار صريح بالإجراء)", kept)

        # ---- لوحة المزيد: backdrop=close يغلق بالضغط خلفها ----
        page.click("[data-layer-open='sheet-more']")
        page.wait_for_timeout(80)
        page.mouse.click(10, 470)
        page.wait_for_timeout(80)
        closed = page.evaluate("() => document.getElementById('sheet-more').hidden")
        check("A5 لوحة غير متلفة: الضغط بالخلفية يغلقها (سياسة close)", closed)

        # ---- حوار النص الطويل: تمرير داخلي والرأس ثابت ----
        page.click("[data-layer-open='dialog-long']")
        page.wait_for_timeout(80)
        scroll = page.evaluate(
            """() => { const b = document.querySelector('#dialog-long .m-layer__body');
                 return {scrollable: b.scrollHeight > b.clientHeight, headVisible: !document.getElementById('dlg-long-title').hidden}; }""")
        page.keyboard.press("Escape")
        check("A6 حوار النص الطويل: تمرير داخلي عند الحاجة والرأس ظاهر",
              scroll["scrollable"] and scroll["headVisible"], str(scroll))

        # ---- NAV-03: عقد الفلاتر — تطبيق/مسح/إلغاء وعدّاد يخفي 0 ----
        page.click("#filter-trigger")
        page.wait_for_timeout(80)
        page.click("#filter-panel label:has(input[data-filter-key='قيد التجهيز'])")
        page.click("#filter-panel label:has(input[data-filter-key='متأخر'])")
        summary_prog = page.evaluate("() => document.querySelector('[data-filter-summary]').textContent")
        page.click("[data-filter-apply]")
        page.wait_for_timeout(80)
        applied = page.evaluate(
            """() => { const c = document.getElementById('filter-trigger').querySelector('[data-filter-count]');
                 return {count: c.textContent, hidden: c.classList.contains('m-btn__counter--zero'),
                         closed: document.getElementById('filter-panel').hidden}; }""")
        # إلغاء: يفتح ويغير ثم يلغي — يبقى المطبّق
        page.click("#filter-trigger")
        page.wait_for_timeout(80)
        page.click("#filter-panel label:has(input[data-filter-key='مكتمل'])")
        page.click("[data-filter-cancel]")
        page.wait_for_timeout(80)
        after_cancel = page.evaluate(
            """() => document.getElementById('filter-trigger').querySelector('[data-filter-count]').textContent""")
        # مسح ثم تطبيق → 0 مخفية
        page.click("#filter-trigger")
        page.wait_for_timeout(80)
        page.click("[data-filter-clear]")
        page.click("[data-filter-apply]")
        page.wait_for_timeout(80)
        zero = page.evaluate(
            """() => { const c = document.getElementById('filter-trigger').querySelector('[data-filter-count]');
                 return {text: c.textContent, hidden: c.classList.contains('m-btn__counter--zero')}; }""")
        check("A7 فلاتر: تطبيق يحدّث العدّاد (2) وإلغاء يرمي الجاري (يبقى 2) ومسح+تطبيق يخفي 0",
              applied["count"] == "2" and not applied["hidden"] and applied["closed"]
              and after_cancel == "2" and zero["hidden"],
              f"تطبيق={applied} بعد إلغاء={after_cancel} صفر={zero}")

        # ---- لقطات ----
        page.locator("#appbar").screenshot(path=str(SHOTS / "01-appbar-tabs-390.png"))
        page.locator("#filters").screenshot(path=str(SHOTS / "02-filters-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "08-assets-390.png"))
        # لقطة اللوحة المفتوحة
        page.click("#filter-trigger")
        page.wait_for_timeout(150)
        page.screenshot(path=str(SHOTS / "03-filter-open-390.png"))
        page.keyboard.press("Escape")
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(150)
        page.screenshot(path=str(SHOTS / "04-dialog-delete-390.png"))
        page.keyboard.press("Escape")
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
                         const title = t.querySelector('.m-appbar__title') || t.querySelector('.m-section-title');
                         return {sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: المحتوى داخل العمود", tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"05-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
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
