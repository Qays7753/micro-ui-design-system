#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B03 الاختيار: فحص ولقطات (بلا أسرار). من جذر المستودع:
  python3 tools/b03-screenshots.py
المخرجات: reviews/B03/screenshots/*.png و reviews/B03/verification.txt
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "B03" / "screenshots"
LOGFILE = ROOT / "reviews" / "B03" / "verification.txt"
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
    board = f"{base}/previews/selection/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    log(f"# B03 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
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
        n = page.evaluate("() => document.querySelectorAll('#m-icon-defs symbol').length")
        check("A2 الأيقونات من الأصول", n >= 30, f"{n}")

        # ---- الجزئي: تحديد الكل يزامن (1 من 2) ----
        page.locator("#choices [data-choice-group] [data-choice-item]").nth(0).check()
        page.locator("#choices [data-choice-group] [data-choice-item]").nth(1).uncheck()
        ind = page.evaluate(
            """() => { const a = document.querySelector('#choices [data-select-all]');
                 return {indeterminate: a.indeterminate, checked: a.checked}; }""")
        check("A3 المجموعة: تحديد الكل يصير جزئيًا عند بعض الصفوف",
              ind["indeterminate"] and not ind["checked"], str(ind))
        page.locator("#choices [data-choice-group]").screenshot(path=str(SHOTS / "03-group-partial-390.png"))

        # ---- العنوان الإتاحي للجزئي: aria-checked لا ينطبق على checkbox؛ العبرة بـ indeterminate الفعلي ----
        # ---- راديو: اختيار واحد (النقر على الصف كاللمس الحقيقي) ----
        page.click("label.m-choice--radio:has(input[value='transfer'])")
        radios = page.evaluate(
            """() => [...document.querySelectorAll("input[name='settle']")].map(r => r.checked)""")
        check("A4 الراديو: واحد فقط محدد", radios.count(True) == 1, str(radios))

        # ---- المفتاح: نص الحالة يتبع + role=switch ----
        page.evaluate(
            """() => { const sw = document.querySelectorAll('#switches [data-switch]')[0];
                 sw.querySelector('input').click(); }""")
        st = page.evaluate(
            """() => { const sw = document.querySelectorAll('#switches [data-switch]')[0];
                 return {role: sw.querySelector('input').getAttribute('role'),
                         state: sw.querySelector('[data-switch-state]').textContent.trim(),
                         checked: sw.querySelector('input').checked}; }""")
        check("A5 المفتاح: role=switch ونص الحالة يتبع القيمة",
              st["role"] == "switch" and ((st["checked"] and st["state"] == "مُفعّل") or st["state"] == "مُعطّل"), str(st))

        # ---- الإعداد غير المتزامن: فشل يرجع القيمة (عقد موثق) ----
        before = page.evaluate("() => document.querySelector('#async-switch input').checked")
        page.click("[data-async-demo='fail']")
        page.wait_for_timeout(1400)
        after = page.evaluate(
            """() => ({checked: document.querySelector('#async-switch input').checked,
                       pending: document.getElementById('async-switch').getAttribute('data-pending')})""")
        check("A6 الإعداد غير المتزامن: الفشل يرجع القيمة وينزع الانتظار",
              after["checked"] == before and after["pending"] == "false", f"قبل={before} بعد={after}")

        # ---- المقطّع: تبادل + أسهم ----
        page.click("[data-seg] [data-value='due']")
        seg = page.evaluate(
            """() => { const items = [...document.querySelectorAll('#switches [data-seg] .m-seg__item')];
                 return items.map(i => i.getAttribute('aria-pressed')); }""")
        check("A7 المقطّع: متبادل (المستحق فقط)", seg == ["false", "true", "false"], str(seg))

        # ---- المنتقي: لا نتائج ثم اختيار ومسح ----
        page.click("[data-picker-demo='empty']")
        page.wait_for_timeout(1200)
        empty = page.evaluate("() => document.getElementById('picker-list').textContent.includes('لا نتائج')")
        page.click("[data-picker-demo='loading']")
        page.wait_for_timeout(1300)
        opts = page.evaluate("() => document.querySelectorAll('#picker-list .picker-option[data-value]').length")
        page.locator("#picker-list .picker-option").first.click()
        sel = page.evaluate(
            """() => { const s = document.querySelector('#picker-list .picker-option[aria-selected=\"true\"]');
                 return s ? s.textContent.trim() : null; }""")
        check("A8 المنتقي: لا نتائج محاكاة ثم اختيار ومسح يعملان",
              empty and opts == 3 and sel is not None, f"empty={empty} options={opts} selected={sel}")

        # ---- لقطات ----
        page.locator("#choices").screenshot(path=str(SHOTS / "01-choices-390.png"))
        page.locator("#switches").screenshot(path=str(SHOTS / "02-switches-390.png"))
        page.locator("#pickers").screenshot(path=str(SHOTS / "04-pickers-390.png"))
        page.locator("#date").screenshot(path=str(SHOTS / "05-date-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "07-assets-390.png"))
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ---- تركيز فعلي ----
        page.keyboard.press("Tab")  # ضبط نمطية لوحة المفاتيح (كما في B01)
        page.evaluate("() => document.querySelector('#c1').focus()")
        fv = page.evaluate("() => document.getElementById('c1').matches(':focus-visible')")
        check("A9 تركيز لوحة المفاتيح فعلي على صندوق الاختيار", bool(fv))

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
                         const lab = t.querySelector('.m-switch__label');
                         return {font: getComputedStyle(lab).fontSize,
                                 sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: نص المفتاح 32px والمحتوى داخل العمود",
                      tz["font"] == "32px" and tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"06-zoom-200-{width}.png"))
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
