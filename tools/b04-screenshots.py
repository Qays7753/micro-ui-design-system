#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B04 التنظيم والمعلومات: فحص ولقطات. من جذر المستودع:
  python3 tools/b04-screenshots.py
المخرجات: reviews/B04/screenshots/*.png و reviews/B04/verification.txt
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "B04" / "screenshots"
LOGFILE = ROOT / "reviews" / "B04" / "verification.txt"
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
    board = f"{base}/previews/organization/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    log(f"# B04 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
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

        # فلتر 404 المقصود (صورة فاشلة التحميل لعرض بديل الأحرف — موثق في التقرير)
        errors_live = [e for e in errors if "غير-موجود" not in e and "%D8%BA%D9%8A%D8%B1" not in e]
        check("A1 لا أخطاء (مع استثناء 404 صورة الفشل المقصودة)",
              len(errors_live) == 0, "; ".join(errors_live[:2]))

        # ---- الطي: زر + aria-expanded + hidden ----
        page.click("#sec2-head")
        open1 = page.evaluate(
            """() => ({exp: document.getElementById('sec2-head').getAttribute('aria-expanded'),
                       hidden: document.getElementById('sec2-body').hidden})""")
        page.click("#sec2-head")
        closed = page.evaluate(
            """() => ({exp: document.getElementById('sec2-head').getAttribute('aria-expanded'),
                       hidden: document.getElementById('sec2-body').hidden})""")
        check("A2 الطي: يفتح ويغلق باللمس مع aria-expanded/hidden",
              open1["exp"] == "true" and not open1["hidden"] and closed["exp"] == "false" and closed["hidden"],
              f"بعد الفتح {open1} بعد الإغلاق {closed}")

        # ---- الطي بالكيبورد (Enter على الرأس) ----
        page.evaluate("() => document.getElementById('sec2-head').focus()")
        page.keyboard.press("Tab")
        page.evaluate("() => document.getElementById('sec2-head').focus()")
        page.keyboard.press("Enter")
        kb = page.evaluate("() => document.getElementById('sec2-head').getAttribute('aria-expanded')")
        check("A3 الطي بالكيبورد (Enter)", kb == "true", f"expanded={kb}")

        # ---- صف الفتح: رابط بلا زر متداخل ----
        nest = page.evaluate(
            """() => { const a = document.querySelector('a.m-row');
                 return {isLink: a && a.tagName === 'A',
                         nested: a ? !!a.querySelector('button, a, input') : null,
                         chevron: a ? !!a.querySelector('.m-row__open') : null}; }""")
        check("A4 صف الفتح: رابط حقيقي بلا زر متداخل وبسهم فتح",
              nest["isLink"] and not nest["nested"] and nest["chevron"], str(nest))

        # ---- عدّاد تتمدد مع الرقم ----
        widths = page.evaluate(
            """() => ['1','123','9999'].map(t => {
                 const c = document.querySelector('.m-counter');
                 const probe = c.cloneNode(true); probe.textContent = t;
                 probe.style.position = 'absolute'; probe.style.visibility = 'hidden';
                 document.body.appendChild(probe);
                 const w = probe.getBoundingClientRect().width;
                 probe.remove(); return w; })""")
        growing = widths[0] < widths[1] < widths[2]
        check("A5 العدّاد يتمدد مع الرقم (1<123<9999) ولا ينكمش تحت محتواه", growing, str([round(w) for w in widths]))

        # ---- الشارة غير تفاعلية ----
        badge = page.evaluate(
            """() => { const b = document.querySelector('.m-badge');
                 return {tag: b.tagName, cursor: getComputedStyle(b).cursor}; }""")
        check("A6 الشارة span غير تفاعلية (ليست زرًا ولا مؤشر يد)",
              badge["tag"] == "SPAN" and badge["cursor"] not in ("pointer",), str(badge))

        # ---- الصورة الفاشلة تستبدل أحرف أولى ----
        page.wait_for_timeout(400)
        fallback = page.evaluate(
            """() => { const wrap = [...document.querySelectorAll('.m-identity')].find(w => w.querySelector('.m-identity__initials') && w.textContent.includes('البترول'));
                 return wrap ? wrap.querySelector('.m-identity__initials').textContent.trim() : null; }""")
        check("A7 الصورة الفاشلة تستبدل بأحرف أولى من أول كلمتين", fallback == "شا", f"initials={fallback}")

        # ---- بيانات ناقصة: — ظاهرة ----
        missing = page.evaluate("() => document.querySelector('.m-missing').textContent.trim()")
        check("A8 البيانات الناقصة تظهر — لا فراغ", missing == "—", missing)

        # ---- لقطات ----
        page.locator("#grouping").screenshot(path=str(SHOTS / "01-grouping-390.png"))
        page.locator("#rows").screenshot(path=str(SHOTS / "02-rows-390.png"))
        page.locator("#sections").screenshot(path=str(SHOTS / "03-sections-390.png"))
        page.locator("#badges").screenshot(path=str(SHOTS / "04-badges-390.png"))
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
                         const title = t.querySelector('.m-row__title');
                         return {font: getComputedStyle(title).fontSize,
                                 sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: العنوان 32px والمحتوى داخل العمود",
                      tz["font"] == "32px" and tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"06-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
            c.close()

        # ---- توكن ارتفاع الصف: 72→84→72 ----
        before = page.evaluate("() => document.querySelector('.m-row').getBoundingClientRect().height")
        page.evaluate("() => document.documentElement.style.setProperty('--micro-row-min-height', '84px')")
        after = page.evaluate("() => document.querySelector('.m-row').getBoundingClientRect().height")
        page.evaluate("() => document.documentElement.style.removeProperty('--micro-row-min-height')")
        restored = page.evaluate("() => document.querySelector('.m-row').getBoundingClientRect().height")
        check("E1 توكن ارتفاع الصف ينعكس ثم يستعاد",
              abs(before - 72) < 1 and abs(after - 84) < 1 and abs(restored - 72) < 1,
              f"قبل {before} أثناء {after} بعد {restored}")

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
