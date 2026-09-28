#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — S01 الأسطح والحركة: فحص ولقطات. من جذر المستودع:
  python3 tools/s01-screenshots.py
المخرجات: reviews/S01/screenshots/*.png و reviews/S01/verification.txt
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "S01" / "screenshots"
LOGFILE = ROOT / "reviews" / "S01" / "verification.txt"
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
    board = f"{base}/previews/surfaces/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    log(f"# S01 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
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
        n = page.evaluate("() => document.querySelectorAll('#compare .m-surface').length")
        check("A2 أربعة أسطح في المقارنة (3 مقارنات + مجردة)", n == 4, f"{n}")

        # ---- مفاتيح الموجة تنعكس ثم تستعاد ----
        page.evaluate(
            """() => document.querySelector('[data-surface="waves"]')
                 .style.setProperty('--micro-surface-wave-opacity', '0.2')""")
        op = page.evaluate(
            """() => getComputedStyle(document.querySelector('[data-surface="waves"] .m-surface__waves')).opacity""")
        page.evaluate(
            """() => document.querySelector('[data-surface="waves"]')
                 .style.removeProperty('--micro-surface-wave-opacity')""")
        op2 = page.evaluate(
            """() => getComputedStyle(document.querySelector('[data-surface="waves"] .m-surface__waves')).opacity""")
        check("A3 مفتاح شدة الموجة ينعكس ثم يستعاد", op == "0.2" and op2 == "1", f"أثناء={op} بعد={op2}")

        # ---- الزخرفة غير تفاعلية ----
        deco = page.evaluate(
            """() => { const w = document.querySelector('.m-surface__waves');
                 const cs = getComputedStyle(w);
                 return {pe: cs.pointerEvents, sel: cs.userSelect, hidden: w.getAttribute('aria-hidden')}; }""")
        check("A4 الزخرفة: pointer-events none وغير قابلة للتحديد وaria-hidden",
              deco["pe"] == "none" and deco["hidden"] == "true", str(deco))

        # ---- حقول صافية: الحقل بلا زخرفة خلفه (أرضية بيضاء) ----
        field_bg = page.evaluate(
            "() => getComputedStyle(document.querySelector('#rules .m-field__control')).backgroundColor")
        check("A5 الحقول صافية (أرضية بيضاء لا سطح بترولي)", field_bg == "rgb(255, 255, 255)", field_bg)

        # ---- تباين نص فوق السطح (حسابيًا من الألوان الفعلية عند موضع العنوان) ----
        contrast = page.evaluate(
            """() => {
                 const s = document.querySelector('[data-surface="waves"]');
                 const t = s.querySelector('.m-surface__title');
                 const r = t.getBoundingClientRect();
                 const dpr = window.devicePixelRatio || 1;
                 const c = document.createElement('canvas');
                 c.width = 40; c.height = 40;
                 const x = r.left + r.width/2, y = r.top + 6;
                 return {bg: getComputedStyle(s).backgroundColor,
                         color: getComputedStyle(t).color,
                         grad: getComputedStyle(s).backgroundImage.slice(0, 400)}; }""")
        check("A6 نص السطح أبيض والأرضية من التدرج المعتمد",
              contrast["color"] == "rgb(255, 255, 255)" and "rgb(35, 102, 117)" in contrast["grad"], str(contrast))

        # ---- الطبقة التجريبية 240ms + Escape + إعادة التركيز ----
        page.click("[data-layer-open]")
        page.wait_for_timeout(60)
        vis = page.evaluate("() => !document.querySelector('[data-layer]').hidden")
        page.keyboard.press("Escape")
        page.wait_for_timeout(340)
        closed = page.evaluate("() => document.querySelector('[data-layer]').hidden")
        refocused = page.evaluate("() => document.activeElement === document.querySelector('[data-layer-open]')")
        check("A7 الطبقة: تفتح وتغلق بـEscape ويعاد التركيز للمشغّل",
              vis and closed and refocused, f"فتحت={vis} أغلقت={closed} تركيز={refocused}")

        # ---- محاكاة تقليل الحركة: الطبقة فورية ----
        page.click("[data-reduce-toggle]")
        page.click("[data-layer-open]")
        dur = page.evaluate(
            """() => { const l = document.querySelector('[data-layer]');
                 return getComputedStyle(l).transitionDuration; }""")
        instant = page.evaluate("() => !document.querySelector('[data-layer]').hidden")
        page.keyboard.press("Escape")
        page.click("[data-reduce-toggle]")
        check("A8 محاكاة تقليل الحركة: لا انتقال (0s) والظهور فوري",
              dur == "0s" and instant, f"duration={dur}")

        # ---- لقطات ----
        page.locator("#compare").screenshot(path=str(SHOTS / "01-compare-390.png"))
        page.locator("#wave-v2").screenshot(path=str(SHOTS / "06-wave-v2-compare-390.png"))
        page.locator("#rules").screenshot(path=str(SHOTS / "02-rules-390.png"))
        page.locator("#motion").screenshot(path=str(SHOTS / "03-motion-390.png"))
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ---- E12: مقارنة الموجة قبل/بعد تعمل بالحجم العادي ومحتوى قصير ----
        v2 = page.evaluate(
            """() => { const s = document.querySelector('.m-surface--waves-v2');
                 if (!s) return {exists: false};
                 const w = s.querySelector('.m-surface__waves');
                 const bg = getComputedStyle(w).backgroundImage;
                 const amount = s.querySelector('.m-surface__amount');
                 return {exists: true, v2bg: bg.includes('waves-soft-v2'),
                         oldBg: getComputedStyle(document.querySelector('.m-surface--waves .m-surface__waves')).backgroundImage.includes('waves-soft.svg'),
                         amountVisible: amount.getBoundingClientRect().height > 0}; }""")
        check("A9 مقارنة E12: بعد v2 بتدرج/تلاشى أعمّ بجانب الأصل بالحجم العادي ومحتوى قصير",
              v2.get("exists") and v2["v2bg"] and v2["oldBg"] and v2["amountVisible"], str(v2))

        # ---- E1: تعديل توكن → انعكاس → استعادة ----
        tok = page.evaluate(
            """() => { const root = document.documentElement.style;
                 const s = document.querySelector('.m-surface--waves');
                 const before = s.querySelector('.m-surface__waves').getBoundingClientRect().height;
                 root.setProperty('--micro-surface-wave-height', '25%');
                 const after = s.querySelector('.m-surface__waves').getBoundingClientRect().height;
                 root.removeProperty('--micro-surface-wave-height');
                 const restored = s.querySelector('.m-surface__waves').getBoundingClientRect().height;
                 return {before: Math.round(before), after: Math.round(after), restored: Math.round(restored)}; }""")
        check("E1 تعديل توكن الموجة → انعكاس → استعادة",
              tok["after"] < tok["before"] and tok["restored"] == tok["before"], str(tok))

        # ---- 320/360/390/430: السطح بأصغر وأكبر عرض + تكبير 200% ----
        for width in (320, 360, 390, 430):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            ov = pg.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
            check(f"B1 {width}px بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))
            if width in (320, 390, 430):
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(250)
                tz = pg.evaluate(
                    """() => { const t = document.getElementById('text-zoom-target');
                         const title = t.querySelector('.m-surface__title');
                         const amount = t.querySelector('.m-surface__amount');
                         const surf = t.querySelector('.m-surface');
                         const ar = amount.getBoundingClientRect();
                         const sr = surf.getBoundingClientRect();
                         // E07: بلا قصّ — الرقم كامله داخل السطح (حدود داخلية بهامش 4px)
                         const notClipped = ar.left >= sr.left + 2 && ar.right <= sr.right - 2
                                            && ar.top >= sr.top && ar.bottom <= sr.bottom + 0.5;
                         return {titleFont: getComputedStyle(title).fontSize,
                                 amountFont: getComputedStyle(amount).fontSize,
                                 overflow: getComputedStyle(surf).overflow,
                                 notClipped,
                                 sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: العنوان 44px والرقم 72px داخل السطح بلا قصّ (overflow ظاهر)",
                      tz["titleFont"] == "44px" and tz["amountFont"] == "72px"
                      and tz["overflow"] == "visible" and tz["notClipped"]
                      and tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"04-surface-zoom-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(200)
            c.close()

        # ---- تفضيل تقليل الحركة الفعلي (Playwright) ----
        c = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        rm = pg.evaluate(
            """() => { const l = document.createElement('div'); l.className = 'micro-layer';
                 document.body.appendChild(l);
                 const d = getComputedStyle(l).transitionDuration;
                 l.remove(); return d; }""")
        check("D1 prefers-reduced-motion فعلي: صنف الطبقة بلا انتقال", rm == "0s", f"duration={rm}")
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
