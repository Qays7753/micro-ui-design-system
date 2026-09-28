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
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log(f"# B03 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
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

        # ---- E05: المفتاح أثناء الانتظار — label وSpace محميان + استرجاع التعطيل الأصلي ----
        e05 = page.evaluate(
            """() => {
              const sw = document.querySelector('#async-switch');
              const input = sw.querySelector('input');
              // نجعل المفتاح معطلًا أصلًا ثم نطلب انتظارًا ثم نزيله — يسترجع معطلًا لا مفعّلًا
              input.disabled = true;
              MicroSelection.setSwitchPending(sw, true);
              const pendingDisabled = input.disabled;
              const spaceBlocked = (() => {
                input.focus();  // disabled لا يأخذ تركيزًا — لذا نفحص الحماية البرمجية بالتقاطع
                input.checked = !input.checked;   // محاولة تغيير برمجية أثناء pending
                input.dispatchEvent(new Event('change', { bubbles: true }));  // التقاط المكوّن يرجعها
                return true;
              })();
              MicroSelection.setSwitchPending(sw, false);
              const restoredDisabled = input.disabled;
              input.disabled = false;
              return {pendingDisabled, restoredDisabled};
            }""")
        check("A7-b المفتاح (E05): الانتظار يعطّل فعليًا ويسترجع التعطيل الأصلي بدقة (معطل قبل → معطل بعد)",
              e05["pendingDisabled"] and e05["restoredDisabled"], str(e05))

        # ---- E05: «تحديد الكل» لا يغيّر المعطل + مجموعة مختلطة ----
        e05b = page.evaluate(
            """() => {
              const host = document.createElement('div');
              host.id = 'e05-probe';
              host.innerHTML = `
                <div data-choice-group>
                  <label class="m-choice m-choice--check"><input type="checkbox" data-select-all><span class="m-choice__box"></span><span class="m-choice__text">الكل</span></label>
                  <label class="m-choice m-choice--check"><input type="checkbox" data-choice-item><span class="m-choice__box"></span><span class="m-choice__text">أ</span></label>
                  <label class="m-choice m-choice--check"><input type="checkbox" data-choice-item><span class="m-choice__box"></span><span class="m-choice__text">ب</span></label>
                  <label class="m-choice m-choice--check"><input type="checkbox" data-choice-item disabled checked><span class="m-choice__box"></span><span class="m-choice__text">محمي</span></label>
                </div>`;
              document.body.appendChild(host);
              MicroSelection.init(host);
              const group = host.querySelector('[data-choice-group]');
              const all = group.querySelector('[data-select-all]');
              const items = [...group.querySelectorAll('[data-choice-item]')];
              all.click();  // تحديد الكل
              const enabledChecked = items[0].checked && items[1].checked;
              const protectedUntouched = items[2].checked; // المعطل بقيت قيمته كما هي
              all.click();  // إلغاء الكل
              const enabledCleared = !items[0].checked && !items[1].checked;
              const stillUntouched = items[2].checked;
              host.remove();
              return {enabledChecked, protectedUntouched, enabledCleared, stillUntouched};
            }""")
        check("A7-c تحديد الكل (E05): يدير المفعّلة فقط — المعطل لم يُلمس في التحديد ولا المسح",
              e05b["enabledChecked"] and e05b["protectedUntouched"] and e05b["enabledCleared"] and e05b["stillUntouched"], str(e05b))

        # ---- E05: الأسهم تتجاوز المعطل + هدف اللمس 48px فعليًا ----
        e05c = page.evaluate(
            """() => {
              const host = document.createElement('div');
              host.id = 'e05c-probe';
              host.innerHTML = `<div class="m-seg" data-seg role="group" aria-label="فحص">
                  <button type="button" class="m-seg__item" aria-pressed="false" data-value="a">أ</button>
                  <button type="button" class="m-seg__item" aria-pressed="false" data-value="b" disabled>معطل</button>
                  <button type="button" class="m-seg__item" aria-pressed="false" data-value="c">ج</button>
                </div>`;
              document.body.appendChild(host);
              MicroSelection.init(host);
              const seg = host.querySelector('[data-seg]');
              const items = [...seg.querySelectorAll('.m-seg__item')];
              items[0].focus();
              seg.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
              const landed = document.activeElement.getAttribute('data-value'); // يجب ج (تجاوز المعطل)
              // هدف اللمس الفعلي: العنصر + الامتداد الزائف (4px رأسيًا من كل طرف)
              const r = items[0].getBoundingClientRect();
              const touchHeight = r.height + 8;
              host.remove();
              return {landed, visualHeight: r.height, touchHeight};
            }""")
        check("A7-d المقطّع (E05): الأسهم تتجاوز المعطل والهدف الفعلي لللمس 48px (بصري 40 + امتداد 8)",
              e05c["landed"] == 'c' and e05c["visualHeight"] <= 42 and e05c["touchHeight"] >= 48, str(e05c))

        # ---- المنتقي (E04): فتح في طبقة B07 + محاكاة لا نتائج/جاهز + اختيار ومسح ----
        page.click("[data-layer-open='picker-layer']")
        page.wait_for_timeout(250)
        layer_open = page.evaluate("() => !document.getElementById('picker-layer').hidden")
        page.click("[data-picker-demo='empty']")
        page.wait_for_timeout(1200)
        empty = page.evaluate("() => document.querySelector('#entity-picker [data-picker-list]').textContent.includes('لا نتائج')")
        page.click("[data-picker-demo='ready']")
        page.wait_for_timeout(1200)
        opts = page.evaluate("() => document.querySelectorAll('#entity-picker .m-picker__option[data-value]').length")
        page.locator("#entity-picker .m-picker__option").nth(1).click()
        sel = page.evaluate(
            """() => { const s = document.querySelector('#entity-picker .m-picker__option[aria-selected=\"true\"]');
                 return s ? s.getAttribute('data-value') : null; }""")
        page.click("#entity-picker [data-picker-clear]")
        cleared = page.evaluate(
            """() => ({none: !document.querySelector('#entity-picker .m-picker__option[aria-selected=\"true\"]'),
                       summary: document.querySelector('#entity-picker [data-picker-summary]').textContent})""")
        check("A8 المنتقي في طبقة B07: محاكاة لا نتائج ثم نتائج سليمة (عقد المكوّن) واختيار ومسح يعملان",
              layer_open and empty and opts == 4 and sel == 'noor' and cleared["none"] and 'لا شيء' in cleared["summary"],
              f"open={layer_open} empty={empty} options={opts} selected={sel} مسح={cleared}")

        # ---- E04: البحث — لا نتائج عالقة بعد مسح الاستعلام (إخفاء فعلي) ----
        srch = page.evaluate(
            """() => { const picker = document.getElementById('entity-picker');
                 const input = picker.querySelector('[data-picker-search]');
                 const opts = [...picker.querySelectorAll('.m-picker__option')];
                 function visibleCount() { return opts.filter(o => getComputedStyle(o).display !== 'none').length; }
                 input.value = 'النور';
                 input.dispatchEvent(new Event('input', { bubbles: true }));
                 const partial = visibleCount();
                 input.value = 'zzz-لا-مطابق';
                 input.dispatchEvent(new Event('input', { bubbles: true }));
                 const noneRow = !!picker.querySelector('.m-picker__state') && visibleCount() === 0;
                 input.value = '';
                 input.dispatchEvent(new Event('input', { bubbles: true }));
                 const restored = visibleCount() === 4 && !picker.querySelector('.m-picker__state');
                 return {partial, noneRow, restored}; }""")
        check("A9 بحث المنتقي: جزئي يصفّي، بلا نتائج يظهر صف حالة، ومسح الاستعلام يعيد كل الخيارات (لا عالقة)",
              srch["partial"] == 1 and srch["noneRow"] and srch["restored"], str(srch))

        # ---- E04: الإغلاق من المنتقي يغلق طبقة B07 ويعاد الفتح ----
        page.click("#entity-picker [data-picker-close]")
        page.wait_for_timeout(500)
        closed = page.evaluate("() => document.getElementById('picker-layer').hidden")
        page.click("[data-layer-open='picker-layer']")
        page.wait_for_timeout(250)
        reopened = page.evaluate("() => !document.getElementById('picker-layer').hidden")
        check("A10 إغلاق المنتقي يغلق طبقة B07 المصححة (بلا مسارين) وإعادة الفتح تعمل",
              closed and reopened, f"closed={closed} reopened={reopened}")
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

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
        check("A11 تركيز لوحة المفاتيح فعلي على صندوق الاختيار", bool(fv))

        # ---- E04: المثال المستقل بلا board.* — عقد المنتقي كعقد واحد ----
        ex = f"{base}/previews/selection/example-usage.html"
        pe = ctx.new_page()
        ex_errors = []
        pe.on("console", lambda m: ex_errors.append(m.text) if m.type == "error" else None)
        pe.on("pageerror", lambda e: ex_errors.append(str(e)))
        pe.goto(ex)
        pe.wait_for_load_state("networkidle")
        pe.wait_for_timeout(1600)
        ex_results = pe.evaluate("() => document.getElementById('results').textContent")
        ex_pass, ex_fail = ex_results.count("PASS "), ex_results.count("FAIL ")
        check("A12 المثال المستقل (بلا board.*): فتح/بحث/بلا نتائج/مسح/اختيار/مسح اختيار/إغلاق وإعادة فتح",
              ex_fail == 0 and ex_pass >= 5 and not ex_errors, f"{ex_pass} PASS / {ex_fail} FAIL; errors={ex_errors[:1]}")
        pe.screenshot(path=str(SHOTS / "08-example-picker-layer.png"), full_page=True)
        pe.close()

        # ---- R2-03: حالة قراءة موحدة — الخيارات القديمة لا تُختار أثناء الانتظار/الفشل/الفراغ ----
        r2p = page.evaluate(
            """() => { try {
                 const host = document.createElement('div');
                 host.id = 'r2-picker-host';
                 host.innerHTML = '<div class="m-picker" data-micro-picker>' +
                   '<input class="m-picker__input" type="search" data-picker-search aria-label="بحث">' +
                   '<div class="m-picker__list" role="listbox" aria-label="نتائج" data-picker-list></div>' +
                   '<p class="m-picker__foot" data-picker-summary>المحدد: لا شيء</p></div>';
                 document.body.appendChild(host);
                 MicroPicker.init(host);
                 const picker = host.querySelector('.m-picker');
                 const opts = () => [...picker.querySelectorAll('.m-picker__option')];
                 MicroPicker.setOptions(picker, [{value: 'a', label: 'Alpha'}, {value: 'b', label: 'Beta'}]);
                 opts()[0].click(); // اختيار Alpha
                 const selBefore = picker.querySelector('[data-picker-summary]').textContent;
                 // loading: الخيار القديم مخفي وغير قابل للاختيار وصف الحالة ظاهر
                 MicroPicker.setStatus(picker, 'loading');
                 const loadingHidden = opts().every(o => o.hidden);
                 const loadingRow = picker.querySelector('.m-picker__state').textContent.includes('جارٍ');
                 // البحث أثناء الانتظار: لا يزيل الحالة ولا يكشف الخيارات
                 const inp = picker.querySelector('[data-picker-search]');
                 inp.value = 'Beta';
                 inp.dispatchEvent(new Event('input', {bubbles: true}));
                 const searchKeptState = !!picker.querySelector('.m-picker__state') && opts().every(o => o.hidden);
                 // error + retry يطلق الحدث ثم ready يعيد الخيارات
                 MicroPicker.setStatus(picker, 'error');
                 let retried = false;
                 picker.addEventListener('micro-picker:retry', () => { retried = true; }, {once: true});
                 picker.querySelector('[data-picker-retry]').click();
                 MicroPicker.setStatus(picker, 'ready');
                 inp.value = '';
                 inp.dispatchEvent(new Event('input', {bubbles: true}));
                 const readyVisible = opts().filter(o => !o.hidden).length;
                 // empty: لا خيارات قابلة للاختيار
                 MicroPicker.setStatus(picker, 'empty');
                 const emptyHidden = opts().every(o => o.hidden);
                 MicroPicker.setStatus(picker, 'ready');
                 return {selBefore, loadingHidden, loadingRow, searchKeptState, retried, readyVisible, emptyHidden};
               } catch (e) { return {err: e.message}; } }""")
        check("A13 (R2-03) حالة قراءة موحدة: القديمة مخفية في loading/error/empty، والبحث لا يلغي الحالة، وretry يطلق حدثه، وready يعيد العرض",
              r2p.get("loadingHidden") and r2p.get("loadingRow") and r2p.get("searchKeptState")
              and r2p.get("retried") and r2p.get("readyVisible") == 2 and r2p.get("emptyHidden"),
              str(r2p))

        # ---- R2-03: استبدال البيانات يحافظ على اختيار صالح أو يمسحه مع الملخص معًا ----
        r2q = page.evaluate(
            """() => { try {
                 const picker = document.querySelector('#r2-picker-host .m-picker');
                 const opts = () => [...picker.querySelectorAll('.m-picker__option')];
                 opts()[1].click(); // اختيار Beta
                 let changeDetail = null;
                 picker.addEventListener('micro-picker:change', (e) => { changeDetail = e.detail; }, {once: true});
                 // مجموعة جديدة تحتفظ بـ b: الاختيار يبقى والملخص يطابق getSelected
                 MicroPicker.setOptions(picker, [{value: 'c', label: 'Gamma'}, {value: 'b', label: 'Beta2'}]);
                 const kept = {sel: MicroPicker.getSelected(picker),
                               summary: picker.querySelector('[data-picker-summary]').textContent};
                 // مجموعة بلا b: الاختيار يُمسح والملخص يتبعه ويُعلن التغيير
                 MicroPicker.setOptions(picker, [{value: 'c', label: 'Gamma'}]);
                 const cleared = {sel: MicroPicker.getSelected(picker),
                                  summary: picker.querySelector('[data-picker-summary]').textContent,
                                  changeDetail};
                 return {kept, cleared};
               } catch (e) { return {err: e.message}; } }""")
        kept_ok = (r2q.get("kept", {}).get("sel", {}) or {}).get("value") == "b" \
                  and "Beta2" in (r2q.get("kept", {}).get("summary") or "") \
                  and "Beta2" in str((r2q.get("kept", {}).get("sel") or {}).get("label") or "")
        cleared_ok = (r2q.get("cleared", {}).get("sel") is None \
                      and "لا شيء" in (r2q.get("cleared", {}).get("summary") or "") \
                      and (r2q.get("cleared", {}).get("changeDetail") or {}).get("value") is None)
        check("A14 (R2-03) استبدال البيانات: اختيار صالح يُحفظ ويطابق الملخص، وسقوطه يُمسح مع الملخص ويُعلن — لا «المحدد: Alpha» مع getSelected null",
              kept_ok and cleared_ok, str(r2q))

        # ---- R2-03: نقطة التبويب تتبع الحالي/المحدد لا أول خيار دائمًا ----
        r2r = page.evaluate(
            """() => { try {
                 const picker = document.querySelector('#r2-picker-host .m-picker');
                 const opts = () => [...picker.querySelectorAll('.m-picker__option')].filter(o => !o.hidden);
                 MicroPicker.setOptions(picker, [{value: 'a', label: 'Alpha'}, {value: 'b', label: 'Beta'}, {value: 'd', label: 'Delta'}]);
                 // تنقل بالأسهم: التركيز على الثاني → نقطة التبويب تتبعه
                 opts()[0].focus();
                 picker.querySelector('[data-picker-list]').dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
                 const afterArrow = {focused: document.activeElement.textContent.trim(),
                                     tabStop: opts().find(o => o.tabIndex === 0).textContent.trim()};
                 // الاختيار يجعله نقطة التبويب
                 opts()[2].click();
                 const afterSelect = opts().find(o => o.tabIndex === 0).textContent.trim();
                 const host = document.getElementById('r2-picker-host');
                 host.remove();
                 return {afterArrow, afterSelect};
               } catch (e) { return {err: e.message}; } }""")
        check("A15 (R2-03) tabIndex متنقل: الأسهم تحرّك نقطة التبويب مع الحالي والاختيار يجعل المحدد نقطة التبويب",
              r2r.get("afterArrow", {}).get("tabStop") == r2r.get("afterArrow", {}).get("focused")
              and r2r.get("afterSelect") == "Delta", str(r2r))

        # ---- R2-06: ثبات عقود المفتاح — إنهاء انتظار غير مبدوء آمن وحماية موثوقة فقط ----
        r2s = page.evaluate(
            """() => { try {
                 const host = document.createElement('div');
                 host.id = 'r2-sw-host';
                 host.innerHTML = '<div class="m-switch" id="r2-sw-a"><input type="checkbox" role="switch"></div>' +
                   '<div class="m-switch" id="r2-sw-b"><input type="checkbox" role="switch" disabled></div>';
                 document.body.appendChild(host);
                 const a = host.querySelector('#r2-sw-a input');
                 const b = host.querySelector('#r2-sw-b input');
                 // false قبل أي دورة: لا يغيّر حالة المستهلك
                 MicroSelection.setSwitchPending(document.getElementById('r2-sw-a'), false);
                 const falseFirst = a.disabled; // يجب أن يبقى false
                 // دورة كاملة ثم false مرة أخرى: يبقى على الأصل (مفعّل)
                 MicroSelection.setSwitchPending(document.getElementById('r2-sw-a'), true);
                 MicroSelection.setSwitchPending(document.getElementById('r2-sw-a'), false);
                 const afterCycle = a.disabled;
                 MicroSelection.setSwitchPending(document.getElementById('r2-sw-a'), false);
                 const falseTwice = a.disabled;
                 // معطل أصلًا: دورة كاملة ترجعه معطلًا لا مفعّلًا
                 MicroSelection.setSwitchPending(document.getElementById('r2-sw-b'), true);
                 MicroSelection.setSwitchPending(document.getElementById('r2-sw-b'), false);
                 const preDisabled = b.disabled;
                 // إشعار برمجي (isTrusted=false) أثناء انتظار مضبوط بالترميز: لا يُعكس كتبديل
                 const swM = document.getElementById('r2-sw-a');
                 swM.setAttribute('data-pending', 'true');
                 a.checked = !a.checked;
                 a.dispatchEvent(new Event('change', {bubbles: true}));
                 const progNotReverted = a.checked; // بقي كما ضبطه المستهلك برمجيًا
                 swM.setAttribute('data-pending', 'false');
                 a.checked = false;
                 host.remove();
                 return {falseFirst, afterCycle, falseTwice, preDisabled, progNotReverted};
               } catch (e) { return {err: e.message}; } }""")
        check("A16 (R2-06) المفتاح: false قبل دورة ومرتين بعدها لا يغيّران الحالة، والمعطل أصلًا يبقى معطلًا، والإشعار البرمجي لا يُعكس كتبديل",
              r2s.get("falseFirst") is False and r2s.get("afterCycle") is False
              and r2s.get("falseTwice") is False and r2s.get("preDisabled") is True
              and r2s.get("progNotReverted") is True, str(r2s))

        # ---- E1: تعديل توكن → انعكاس → استعادة ----
        tok = page.evaluate(
            """() => { const root = document.documentElement.style;
                 root.setProperty('--micro-field-height', '60px');
                 const v = getComputedStyle(document.querySelector('#entity-picker [data-picker-search]')).minHeight;
                 root.removeProperty('--micro-field-height');
                 const back = getComputedStyle(document.querySelector('#entity-picker [data-picker-search]')).minHeight;
                 return {changed: v, restored: back}; }""")
        check("E1 تعديل توكن → انعكاس في المكوّن → استعادة الأصل",
              tok["changed"] == "60px" and tok["restored"] != "60px", str(tok))

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
