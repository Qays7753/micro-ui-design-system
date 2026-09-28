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

        # ---- E02: عزل الخلفية inert + حصر تركيز Tab/Shift+Tab ----
        overflow_before = page.evaluate("() => document.body.style.overflow")
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(120)
        iso = page.evaluate(
            """() => { const d = document.getElementById('dialog-delete');
                 const main = document.querySelector('main');
                 const f = [...d.querySelectorAll('button')].filter(b => !b.disabled);
                 const last = f[f.length - 1], first = f[0];
                 last.focus();
                 return {mainInert: main.inert,
                         bodyHidden: document.body.style.overflow,
                         firstId: first.id || first.textContent.trim()}; }""")
        page.keyboard.press("Tab")  # Tab من الأخير → الاول
        wrapped_to_first = page.evaluate(
            """() => { const d = document.getElementById('dialog-delete');
                 const f = [...d.querySelectorAll('button')].filter(b => !b.disabled);
                 return document.activeElement === f[0]; }""")
        page.evaluate(
            """() => { const d = document.getElementById('dialog-delete');
                 const f = [...d.querySelectorAll('button')].filter(b => !b.disabled);
                 f[0].focus(); }""")
        page.keyboard.press("Shift+Tab")  # Shift+Tab من الأول → الأخير
        wrapped_to_last = page.evaluate(
            """() => { const d = document.getElementById('dialog-delete');
                 const f = [...d.querySelectorAll('button')].filter(b => !b.disabled);
                 return document.activeElement === f[f.length - 1]; }""")
        check("A3 عزل الخلفية: main.inert عند الفتح + قفل تمرير محفوظ + حصر Tab/Shift+Tab داخل الطبقة",
              iso["mainInert"] and iso["bodyHidden"] == "hidden" and overflow_before == ""
              and wrapped_to_first and wrapped_to_last,
              f"{iso} أول={wrapped_to_first} أخير={wrapped_to_last}")

        # ---- E02: المشغّل يُلتقط قبل نقل التركيز (فتح بلا خيار trigger) ----
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)  # خفوت 240ms + هامش
        page.focus("#filter-trigger")
        page.evaluate("() => MicroNavigation.openLayer(document.getElementById('dialog-delete'))")
        page.wait_for_timeout(120)
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        trig = page.evaluate(
            """() => ({restored: document.activeElement === document.getElementById('filter-trigger'),
                       overflowRestored: document.body.style.overflow === '',
                       mainFree: !document.querySelector('main').inert})""")
        check("A4 openLayer بلا trigger صريح: يُلتقط المشغّل قبل النقل ويُستعاد إليه + استرجاع overflow وinert",
              trig["restored"] and trig["overflowRestored"] and trig["mainFree"], str(trig))

        # ---- E02: حوار المتلف — سياسة keep + تركيز داخلي + خلفية ظاهرة ----
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(120)
        dlg = page.evaluate(
            """() => { const d = document.getElementById('dialog-delete');
                 return {open: !d.hidden, focused: document.activeElement.tagName,
                         backdrop: !document.querySelector('.m-layer-backdrop[data-for="dialog-delete"]').hidden,
                         policy: d.getAttribute('data-backdrop')}; }""")
        page.mouse.click(10, 470)  # خارج الطبقة الموسّطة
        page.wait_for_timeout(120)
        kept = page.evaluate("() => !document.getElementById('dialog-delete').hidden")
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        esc = page.evaluate(
            """() => ({closed: document.getElementById('dialog-delete').hidden,
                       refocus: document.activeElement === document.querySelector("[data-layer-open='dialog-delete']")})""")
        check("A5 حوار المتلف: يفتح بتركيز داخلي وسياسة keep (الضغط بالخلفية لا يغلق) وEscape يستعيد التركيز",
              dlg["open"] and dlg["focused"] == "BUTTON" and dlg["backdrop"] and dlg["policy"] == "keep"
              and kept and esc["closed"] and esc["refocus"], f"{dlg} keep={kept} {esc}")

        # ---- E02: المكدس — Escape يغلق الأعلى مرة واحدة + تهيئة مزدوجة آمنة ----
        page.evaluate("() => { MicroNavigation.init(); MicroNavigation.init(); }")  # تهيئة مرتين
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(100)
        page.evaluate("() => MicroNavigation.openLayer(document.getElementById('filter-panel'))")
        page.wait_for_timeout(150)
        page.keyboard.press("Escape")  # يغلق الأعلى (الفلتر) فقط
        page.wait_for_timeout(450)
        stack1 = page.evaluate(
            """() => ({filterClosed: document.getElementById('filter-panel').hidden,
                       dialogStill: !document.getElementById('dialog-delete').hidden})""")
        page.keyboard.press("Escape")  # ثم يغلق الحوار
        page.wait_for_timeout(450)
        stack2 = page.evaluate("() => document.getElementById('dialog-delete').hidden")
        check("A6 تهيئة مرتين آمنة: Escape واحد يغلق أعلى طبقة مرة واحدة (المتلف يبقى ثم يُغلق بثانٍ)",
              stack1["filterClosed"] and stack1["dialogStill"] and stack2, str(stack1) + f" ثم أغلق={stack2}")

        # ---- E02: طبقة بلا عنصر تفاعلي — فتح/إغلاق بلا أخطاء وبلا قفز تركيز ----
        no_focus_err = page.evaluate(
            """() => { try {
                 const l = document.createElement('div');
                 l.className = 'm-layer'; l.id = 'empty-layer';
                 l.setAttribute('role', 'dialog');
                 l.innerHTML = '<div class="m-layer__head"><span class="m-layer__title">بلا عناصر</span></div>';
                 document.body.appendChild(l);
                 MicroNavigation.openLayer(l);
                 const ok1 = !l.hidden;
                 MicroNavigation.closeLayer(l);
                 return ok1;
               } catch (e) { return 'ERR:' + e.message; } }""")
        page.wait_for_timeout(450)
        page.evaluate("() => document.getElementById('empty-layer').remove()")
        check("A7 طبقة بلا عنصر تفاعلي: تُفتح وتُغلق بلا خطأ ولا قفز تركيز", no_focus_err is True, str(no_focus_err))

        # ---- E02: backdropEl موحد — الخيار المعلن = المنفذ ----
        bd_ok = page.evaluate(
            """() => { try {
                 const bd = document.querySelector('.m-layer-backdrop[data-for="sheet-more"]');
                 MicroNavigation.openLayer(document.getElementById('sheet-more'), { backdropEl: bd });
                 const shown = !bd.hidden && !document.getElementById('sheet-more').hidden;
                 MicroNavigation.closeLayer(document.getElementById('sheet-more'));
                 return shown;
               } catch (e) { return 'ERR:' + e.message; } }""")
        page.wait_for_timeout(450)
        check("A8 خيار backdropEl المعلن يعمل كما هو منفَّذ (اسم واحد لا اثنان)", bd_ok is True, str(bd_ok))

        # ---- لوحة المزيد: backdrop=close يغلق بالضغط خلفها ----
        page.click("[data-layer-open='sheet-more']")
        page.wait_for_timeout(120)
        page.mouse.click(10, 470)
        page.wait_for_timeout(450)
        closed = page.evaluate("() => document.getElementById('sheet-more').hidden")
        check("A9 لوحة غير متلفة: الضغط بالخلفية يغلقها (سياسة close)", closed)

        # ---- حوار النص الطويل: تمرير داخلي والرأس ثابت ----
        page.click("[data-layer-open='dialog-long']")
        page.wait_for_timeout(120)
        scroll = page.evaluate(
            """() => { const b = document.querySelector('#dialog-long .m-layer__body');
                 return {scrollable: b.scrollHeight > b.clientHeight, headVisible: !document.getElementById('dlg-long-title').hidden}; }""")
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        check("A10 حوار النص الطويل: تمرير داخلي عند الحاجة والرأس ظاهر",
              scroll["scrollable"] and scroll["headVisible"], str(scroll))

        # ---- NAV-03: عقد الفلاتر — بحث جزء من العقد + الملخص يتبع الجاري فعليًا (E08) ----
        page.click("#filter-trigger")
        page.wait_for_timeout(150)
        page.click("#filter-panel label:has(input[data-filter-key='قيد التجهيز'])")
        summary_after_check = page.evaluate("() => document.querySelector('[data-filter-summary]').textContent")
        page.fill("#f-search", "متجر")
        summary_after_search = page.evaluate("() => document.querySelector('[data-filter-summary]').textContent")
        page.click("#filter-panel label:has(input[data-filter-key='متأخر'])")
        page.click("[data-filter-apply]")
        page.wait_for_timeout(450)
        applied = page.evaluate(
            """() => { const c = document.getElementById('filter-trigger').querySelector('[data-filter-count]');
                 return {count: c.textContent, hidden: c.classList.contains('m-btn__counter--zero'),
                         closed: document.getElementById('filter-panel').hidden}; }""")
        # إعادة الفتح: الجاري يبدأ من المطبّق (نص البحث يعود) — ثم إلغاء يرمي التغيير
        page.click("#filter-trigger")
        page.wait_for_timeout(150)
        restored = page.evaluate(
            """() => ({search: document.getElementById('f-search').value,
                       late: document.querySelector("input[data-filter-key='متأخر']").checked,
                       summary: document.querySelector('[data-filter-summary]').textContent})""")
        page.click("#filter-panel label:has(input[data-filter-key='مكتمل'])")
        page.click("[data-filter-cancel]")
        page.wait_for_timeout(450)
        after_cancel = page.evaluate(
            """() => document.getElementById('filter-trigger').querySelector('[data-filter-count]').textContent""")
        # مسح ثم تطبيق → 0 مخفية
        page.click("#filter-trigger")
        page.wait_for_timeout(150)
        page.click("[data-filter-clear]")
        cleared = page.evaluate(
            """() => ({search: document.getElementById('f-search').value,
                       anyChecked: !!document.querySelector('[data-filter-key]:checked')})""")
        page.click("[data-filter-apply]")
        page.wait_for_timeout(450)
        zero = page.evaluate(
            """() => { const c = document.getElementById('filter-trigger').querySelector('[data-filter-count]');
                 return {text: c.textContent, hidden: c.classList.contains('m-btn__counter--zero')}; }""")
        check("A11 فلاتر (E08): البحث ضمن العقد — الملخص يتبع الجاري عند كل تغيير، والإلغاء يرمي، والمسح يفرّغ البحث والصناديق، و0 مخفية",
              applied["count"] == "3" and not applied["hidden"] and applied["closed"]
              and "قيد التجهيز" in summary_after_check and "بحث بالاسم" in summary_after_search
              and restored["search"] == "متجر" and restored["late"] and after_cancel == "3"
              and cleared["search"] == "" and not cleared["anyChecked"] and zero["hidden"],
              f"تطبيق={applied} ملخص_جاري='{summary_after_check[:30]}' ملخص_بحث='{summary_after_search[:30]}' استعادة={restored} بعد_إلغاء={after_cancel} مسح={cleared} صفر={zero}")


        # ---- SYS-02/E11: المثال المستقل بلا board.* ----
        ex7 = f"{base}/previews/navigation/example-usage.html"
        pe7 = ctx.new_page()
        ex_err7 = []
        pe7.on("pageerror", lambda e: ex_err7.append(str(e)))
        pe7.goto(ex7)
        pe7.wait_for_load_state("networkidle")
        pe7.wait_for_timeout(1200)
        ex_res7 = pe7.evaluate("() => document.getElementById('results').textContent")
        check("EX مثال مستقل navigation: 0 فشل بلا أخطاء",
              ex_res7.count("FAIL ") == 0 and ex_res7.count("PASS ") >= 3 and not ex_err7,
              ex_res7.splitlines()[0] if ex_res7 else "لا نتائج")
        pe7.close()

        # ---- لقطات ----
        page.locator("#appbar").screenshot(path=str(SHOTS / "01-appbar-tabs-390.png"))
        page.locator("#filters").screenshot(path=str(SHOTS / "02-filters-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "08-assets-390.png"))
        page.click("#filter-trigger")
        page.wait_for_timeout(250)
        page.screenshot(path=str(SHOTS / "03-filter-open-390.png"))
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        page.click("[data-layer-open='dialog-delete']")
        page.wait_for_timeout(250)
        page.screenshot(path=str(SHOTS / "04-dialog-delete-390.png"))
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ---- E1: تعديل توكن → انعكاس → استعادة ----
        tok = page.evaluate(
            """() => { const root = document.documentElement.style;
                 root.setProperty('--micro-touch-min', '56px');
                 const v = getComputedStyle(document.querySelector('.m-tabs__tab')).minHeight;
                 root.removeProperty('--micro-touch-min');
                 const back = getComputedStyle(document.querySelector('.m-tabs__tab')).minHeight;
                 return {changed: v, restored: back}; }""")
        check("E1 تعديل توكن → انعكاس في المكوّن → استعادة الأصل",
              tok["changed"] == "56px" and tok["restored"] != "56px", str(tok))

        # ---- الهواتف + التكبير + تركيب الشريطين (E07) ----
        for width in (320, 360, 390, 430):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            ov = pg.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
            check(f"B1 {width}px بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))
            # تركيب الشريطين: لا تغطية متبادلة + آخر عنصر يُرى كاملًا عند نهاية التمرير
            comp = pg.evaluate(
                """() => { const t = document.getElementById('text-zoom-target');
                     t.scrollTop = t.scrollHeight;
                     const bar = t.querySelector('.m-actionbar').getBoundingClientRect();
                     const nav = t.querySelector('.m-navbar').getBoundingClientRect();
                     const last = document.getElementById('last-content').getBoundingClientRect();
                     const overlap = !(bar.top >= nav.bottom || bar.bottom <= nav.top);
                     const lastVisible = last.top >= t.getBoundingClientRect().top && last.bottom <= nav.top + 1;
                     return {overlap, lastVisible}; }""")
            check(f"B2 {width}px تركيب الشريطين: الأفعال لا تغطي التنقل السفلي وآخر عنصر مرئي كاملًا",
                  not comp["overlap"] and comp["lastVisible"], str(comp))
            if width in (320, 360, 390):
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(250)
                compz = pg.evaluate(
                    """() => { const t = document.getElementById('text-zoom-target');
                      t.scrollTop = t.scrollHeight;
                      const bar = t.querySelector('.m-actionbar').getBoundingClientRect();
                      const nav = t.querySelector('.m-navbar').getBoundingClientRect();
                      const last = document.getElementById('last-content').getBoundingClientRect();
                      const overlap = !(bar.top >= nav.bottom || bar.bottom <= nav.top);
                      const lastVisible = last.top >= t.getBoundingClientRect().top && last.bottom <= nav.top + 1;
                      return {overlap, lastVisible, sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B3 {width}px تكبير 200%: الشريطان لا يتصادمان وآخر عنصر قابل للوصول والمحتوى داخل العمود",
                      not compz["overlap"] and compz["lastVisible"] and compz["sw"] <= compz["cw"] + 1, str(compz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"05-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(200)
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
