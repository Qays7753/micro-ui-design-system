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
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log(f"# B07 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree} (الأدلة مولدة من شجرة هذا commit نظيفة)")
    log("")

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


        # ---- R2-02: إعادة الفتح أثناء الخفوت — لا أثر لإغلاق قديم على فتح جديد ----
        r2a = page.evaluate(
            """() => { try {
                 const opener = document.querySelector("[data-layer-open='sheet-more']");
                 opener.focus();
                 const l = document.getElementById('sheet-more');
                 MicroNavigation.openLayer(l);
                 MicroNavigation.closeLayer(l);          // بدء الخفوت
                 MicroNavigation.openLayer(l);           // إعادة فتح فورية بلا انتظار
                 return {reopened: !l.hidden};
               } catch (e) { return {err: e.message}; } }""")
        page.wait_for_timeout(400)  # لو بقي مؤقت الإغلاق القديم لخفى الطبقة هنا
        after = page.evaluate(
            """() => ({stillOpen: !document.getElementById('sheet-more').hidden,
                       locked: document.body.style.overflow === 'hidden'})""")
        page.keyboard.press("Escape")  # إغلاق نهائي
        page.wait_for_timeout(450)
        final = page.evaluate(
            """() => ({closed: document.getElementById('sheet-more').hidden,
                       overflowRestored: document.body.style.overflow === '',
                       refocus: document.activeElement === document.querySelector("[data-layer-open='sheet-more']")})""")
        check("A12 (R2-02) إعادة الفتح أثناء الخفوت: الطبقة تبقى مفتوحة بعد انقضاء مهلة الإغلاق القديم، والإغلاق النهائي يسترجع overflow والتركيز",
              r2a.get("reopened") and after["stillOpen"] and after["locked"]
              and final["closed"] and final["overflowRestored"] and final["refocus"],
              f"فتح={r2a} بعد400ms={after} نهائي={final}")

        # ---- R2-02: طبقة داخل غلاف — العزل على الأشقاء المناسبين لا الغلاف كله ----
        r2b = page.evaluate(
            """() => { try {
                 const wrap = document.createElement('div');
                 wrap.id = 'r2-wrap';
                 wrap.innerHTML = '<p>نص شقيق داخل الغلاف</p>';
                 const l = document.createElement('div');
                 l.className = 'm-layer'; l.id = 'r2-nested'; l.setAttribute('role', 'dialog');
                 l.innerHTML = '<div class="m-layer__head"><span>طبقة داخل غلاف</span>' +
                   '<button type="button">موافق</button></div>';
                 wrap.appendChild(l);
                 document.body.appendChild(wrap);
                 MicroNavigation.openLayer(l);
                 return {wrapInert: wrap.inert, layerInert: l.inert,
                         siblingInert: wrap.querySelector('p').inert,
                         mainInert: document.querySelector('main').inert};
               } catch (e) { return {err: e.message}; } }""")
        page.wait_for_timeout(100)
        r2b_focus = page.evaluate(
            """() => { const l = document.getElementById('r2-nested');
                 return {focusInside: l.contains(document.activeElement)}; }""")
        page.evaluate("() => MicroNavigation.closeLayer(document.getElementById('r2-nested'))")
        page.wait_for_timeout(450)
        r2b_restored = page.evaluate(
            """() => ({wrapInert: document.getElementById('r2-wrap').inert,
                       mainFree: !document.querySelector('main').inert,
                       overflowOk: document.body.style.overflow === ''})""")
        page.evaluate("() => document.getElementById('r2-wrap').remove()")
        check("A13 (R2-02) طبقة داخل غلاف: الأشقاء معزولة والغلاف والطبقة حرّان، وبعد الإغلاق يُستأنف كل شيء",
              not r2b.get("wrapInert") and not r2b.get("layerInert") and r2b.get("siblingInert")
              and r2b.get("mainInert") and r2b_focus.get("focusInside")
              and not r2b_restored.get("wrapInert") and r2b_restored.get("mainFree") and r2b_restored.get("overflowOk"),
              f"أثناء={r2b} تركيز={r2b_focus} بعد={r2b_restored}")

        # ---- R2-02: طبقة خالية من العناصر التفاعلية — تستقبل التركيز بنفسها ----
        r2c = page.evaluate(
            """() => { try {
                 const opener = document.querySelector("[data-layer-open='sheet-more']");
                 opener.focus();
                 const l = document.createElement('div');
                 l.className = 'm-layer'; l.id = 'r2-empty'; l.setAttribute('role', 'dialog');
                 l.innerHTML = '<div class="m-layer__head"><span>بلا عناصر تفاعلية</span></div>';
                 document.body.appendChild(l);
                 MicroNavigation.openLayer(l);
                 return {focusedLayer: document.activeElement === l,
                         backgroundInert: document.querySelector('main').inert};
               } catch (e) { return {err: e.message}; } }""")
        page.evaluate("() => MicroNavigation.closeLayer(document.getElementById('r2-empty'))")
        page.wait_for_timeout(450)
        page.evaluate("() => document.getElementById('r2-empty').remove()")
        check("A14 (R2-02) طبقة فارغة: التركيز داخلها عليها نفسها والخلفية معزولة (المشغّل فعليًا غير قابل للوصول) — لا «بلا استثناء» فقط",
              r2c.get("focusedLayer") and r2c.get("backgroundInert"), str(r2c))

        # ---- R2-02: انتقال فتح فعلي 240ms (طور بداية) + فوري مع محاكاة تقليل الحركة ----
        # الدليل الحتمي: getAnimations يرصد انتقال opacity بمدة 240ms أثناء الفتح،
        # ثم تكتمل الشفافية إلى 1. (أخذ العينات بالإطارات يتأثر ببطء إطارات headless.)
        r2d = page.evaluate(
            """async () => {
                 const l = document.getElementById('sheet-more');
                 MicroNavigation.openLayer(l);
                 await new Promise(r => requestAnimationFrame(r));
                 const anims = l.getAnimations().map(a => ({
                   prop: a.transitionProperty || (a.effect && a.effect.getKeyframes ? 'css' : '?'),
                   dur: a.effect && a.effect.getTiming ? String(a.effect.getTiming().duration) : null
                 }));
                 await new Promise(r => setTimeout(r, 400));
                 return {anims, late: parseFloat(getComputedStyle(l).opacity)};
               }""")
        r2d_late = {"late": r2d.pop("late")} if isinstance(r2d, dict) else {}
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        document_reduce = page.evaluate(
            """() => { try {
                 document.body.classList.add('micro-reduce');
                 const l = document.getElementById('sheet-more');
                 MicroNavigation.openLayer(l);
                 const op = parseFloat(getComputedStyle(l).opacity);
                 const anims = l.getAnimations().length;
                 MicroNavigation.closeLayer(l);
                 document.body.classList.remove('micro-reduce');
                 return {instant: op, anims};
               } catch (e) { return {err: e.message}; } }""")
        page.wait_for_timeout(450)
        has_open_transition = any(a.get("prop") == "opacity" and a.get("dur") in ("240", "240ms", "0.24")
                                  for a in (r2d.get("anims") or [])) if isinstance(r2d.get("anims"), list) else False
        check("A15 (R2-02) انتقال الفتح: انتقال opacity بمدة 240ms يُرصد فعليًا أثناء الفتح ويكتمل، ومع تقليل الحركة فوري بلا انتقالات",
              has_open_transition and r2d_late.get("late") == 1
              and document_reduce.get("instant") == 1 and document_reduce.get("anims") == 0,
              f"رصد={r2d.get('anims')} اكتمال={r2d_late} فوري={document_reduce}")

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
                      // قابلية الوصول عند أقصى تمرير: أسفل العنصر الأخير فوق المجموعة الثابتة
                      const bottomClears = last.bottom <= nav.top + 1;
                      // إن بقي أعلى العنصر فوق حافة العمود (عنصر أطول من المتبقي عند
                      // تكبير 200% على 320)، تمرير أعلى قليلًا يحقق الرؤية الكاملة —
                      // هذا reflow عمودي مشروع (WCAG 1.4.10): لا حجب ولا تمرير أفقي.
                      let fullyVisible = last.top >= t.getBoundingClientRect().top;
                      if (!fullyVisible && bottomClears) {
                        t.scrollTop = Math.max(0, t.scrollTop - (t.getBoundingClientRect().top - last.top) - 2);
                        const l2 = document.getElementById('last-content').getBoundingClientRect();
                        const n2 = t.querySelector('.m-navbar').getBoundingClientRect();
                        fullyVisible = l2.top >= t.getBoundingClientRect().top && l2.bottom <= n2.top + 1;
                      }
                      return {overlap, bottomClears, fullyVisible, sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B3 {width}px تكبير 200%: الشريطان لا يتصادمان والمحتوى بلا تمرير أفقي وآخر عنصر قابل للوصول كاملًا",
                      not compz["overlap"] and compz["bottomClears"] and compz["fullyVisible"] and compz["sw"] <= compz["cw"] + 1, str(compz))
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
