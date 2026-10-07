#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B02 الحقول: سكربت الفحص واللقطات (بلا أسرار أو مسارات خاصة)
المتطلبات: python3 + playwright (chromium). التشغيل من جذر المستودع:
  python3 tools/b02-screenshots.py
المخرجات: reviews/B02/screenshots/*.png و reviews/B02/verification.txt
الفحوص: أخطاء الصفحة، الأيقونات من الأصول، الخط الفعلي، ربط التسمية
والرسالة، مسح البحث (إظهار/مسح/إعادة تركيز)، عدّاد الأحرف، حدود
خطوة الكمية، القراءة فقط قابلة للنسخ (ليست معطلة)، الخطأ لا يمحو
القيمة، خطأ+تركيز، معاينات هاتف 320/390/430، محاكاة زيادة حجم الخط
200% (مروران)، استعادة توكن ارتفاع الحقل (إثبات تعديل المصدر).
"""
import argparse
import http.server, os, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
# SUI-A2 (REPAIR-R1): وسيط --out يوجه المخرجات إلى مجلد أدلة الوكيل بدل
# الكتابة فوق الأدلة التاريخية (reviews/B02) — بروتوكول REPAIR-R1: لا
# تُمس الأدلة التاريخية؛ الافتراضي كما كان فيبقى السلوك التاريخي للقائد.
DEFAULT_OUT = ROOT / "reviews" / "B02"
ap = argparse.ArgumentParser()
ap.add_argument("--out", default=str(DEFAULT_OUT),
                help="مجلد الإخراج (الافتراضي reviews/B02 التاريخي)")
_args = ap.parse_args()
SHOTS = Path(_args.out).resolve() / "screenshots"
LOGFILE = Path(_args.out).resolve() / "verification.txt"
results, log_lines = [], []

def log(msg):
    print(msg)
    log_lines.append(msg)

def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))
    return bool(ok)

def js_rect(page, selector):
    return page.evaluate(
        """(sel) => { const el = document.querySelector(sel); if (!el) return null;
            const r = el.getBoundingClientRect();
            return {w: Math.round(r.width*100)/100, h: Math.round(r.height*100)/100}; }""",
        selector)

def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    handler = http.server.SimpleHTTPRequestHandler
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    board = f"{base}/previews/fields/index.html"

    commit = "unknown"
    try:
        commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    except Exception:
        pass
    log(f"# B02 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    try:
        tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
        # SUI-A2 (REPAIR-R1، إعادة التحقق): صياغة صادقة لحالة الشجرة — الفحص
        # يخدم شجرة العمل الفعلية، فإن كانت معدلة وجب قول ذلك بدل ادعاء «نظيفة».
        dirty = subprocess.check_output(["git", "status", "--porcelain"], cwd=str(ROOT), text=True).strip()
        if dirty:
            state = f"شجرة عمل معدلة ({len(dirty.splitlines())} مدخلًا في git status) — الفحص على المحتوى الحالي للشجرة، لا على بصمة الـcommit"
        else:
            state = "شجرة عمل نظيفة مطابقة لبصمة الـcommit"
        log(f"# بصمة شجرة المصدر: {tree} ({state})")
    except Exception:
        pass
    log("")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/home/z/my-project/evidence/bin/chromium")  # SUI-A2: متصفح البروتوكول الثابت
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(board)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        check("A1 لا أخطاء console/pageerror", len(errors) == 0, "; ".join(errors[:3]))
        n_syms = page.evaluate("() => document.querySelectorAll('#m-icon-defs symbol').length")
        check("A2 الأيقونات محملة من أصولها", n_syms >= 30, f"symbols={n_syms}")
        fonts = page.evaluate(
            """() => ({ar: document.fonts.check('400 16px "IBM Plex Sans Arabic"'),
                       lat: document.fonts.check('400 16px "IBM Plex Sans"')})""")
        check("A3 الخطوط الفعلية محملة", fonts["ar"] and fonts["lat"], str(fonts))

        # ---- ربط التسمية والرسالة (إتاحة) ----
        binding = page.evaluate(
            """() => { const f = document.getElementById('s-error');
                 const msg = f.closest('.m-field').querySelector('[data-field-msg]');
                 return {labelFor: !!document.querySelector('label[for="s-error"]'),
                         described: f.getAttribute('aria-describedby') === msg.id}; }""")
        check("A4 التسمية label[for] والرسالة aria-describedby مربوطتان",
              binding["labelFor"] and binding["described"], str(binding))

        # ---- مسح البحث: إظهار/مسح/إعادة تركيز ----
        page.fill("#t-search", "مورد النور")
        vis = page.evaluate(
            "() => document.querySelector('#search-clear').classList.contains('is-visible')")
        page.click("#search-clear")
        cleared = page.evaluate(
            """() => ({value: document.getElementById('t-search').value,
                       focused: document.activeElement === document.getElementById('t-search'),
                       visible: document.querySelector('#search-clear').classList.contains('is-visible')})""")
        check("A5 مسح البحث: يظهر بوجود النص ويمسحه ويعيد التركيز ويختفي",
              vis and cleared["value"] == "" and cleared["focused"] and not cleared["visible"], f"vis={vis} {cleared}")

        # ---- عدّاد الأحرف ----
        page.fill("#t-desc", "وصف للتجربة")
        cnt = page.evaluate("() => document.querySelector('[data-count-for=\"t-desc\"]').textContent")
        check("A6 عدّاد الأحرف يتبع الكتابة (حد معلن فقط)", cnt == "11/40", f"count={cnt}")

        # ---- حدود خطوة الكمية (min 0 · max 99 · step 5) ----
        qty = "#live-qty"
        page.evaluate(f"() => document.querySelector('{qty}').focus()")
        page.click("[data-step='up'][aria-label='زيادة']")
        page.click("[data-step='up'][aria-label='زيادة']")
        v_up = page.evaluate(f"() => document.querySelector('{qty}').value")  # 10+5+5=20
        page.evaluate(f"() => {{ const q = document.querySelector('{qty}'); q.value = '97'; }}")
        page.click("[data-step='up'][aria-label='زيادة']")
        v_max = page.evaluate(f"() => document.querySelector('{qty}').value")  # يتوقف عند 99
        page.click("[data-step='down'][aria-label='إنقاص']")
        page.click("[data-step='down'][aria-label='إنقاص']")
        v_down = page.evaluate(f"() => document.querySelector('{qty}').value")  # 97? لا: بعد max=99 ثم -5 = 94 ثم -5 = 89
        page.evaluate(f"() => {{ const q = document.querySelector('{qty}'); q.value = '2'; }}")
        page.click("[data-step='down'][aria-label='إنقاص']")
        v_min = page.evaluate(f"() => document.querySelector('{qty}').value")  # يتوقف عند 0
        check("A7 خطوة الكمية تحترم الحدود والخطوة (من المستهلك)",
              v_up == "20" and v_max == "99" and v_down == "89" and v_min == "0",
              f"up={v_up} max={v_max} down={v_down} min={v_min}")

        # ---- القراءة فقط: قابلة للتحديد والنسخ وليست معطلة ----
        ro = page.evaluate(
            """() => { const f = document.getElementById('s-readonly');
                 f.focus();
                 f.select();
                 return {readonly: f.readOnly, disabled: f.disabled,
                         selected: f.selectionEnd - f.selectionStart,
                         color: getComputedStyle(f).color,
                         bg: getComputedStyle(f.closest('.m-field__control')).backgroundColor}; }""")
        check("A8 القراءة فقط: قابلة للتحديد والنسخ بنص كامل الوضوح (ليست معطلة)",
              ro["readonly"] and not ro["disabled"] and ro["selected"] > 0
              and ro["color"] == "rgb(23, 45, 50)", str(ro))

        # ---- الخطأ لا يمحو القيمة + الكتابة تعفي ----
        page.fill("#live-amount", "12..5")
        page.evaluate("() => document.getElementById('live-amount').dispatchEvent(new Event('blur'))")
        err = page.evaluate(
            """() => { const f = document.getElementById('live-amount-field');
                 return {hasError: f.classList.contains('has-error'),
                         value: document.getElementById('live-amount').value,
                         msg: f.querySelector('[data-field-msg]').textContent}; }""")
        page.fill("#live-amount", "125.00")
        fixed = page.evaluate(
            "() => document.getElementById('live-amount-field').classList.contains('has-error')")
        check("A9 الخطأ عند الخروج لا يمحو القيمة والكتابة تعفيه (سياسة موسومة)",
              err["hasError"] and err["value"] == "12..5" and "صحّح" in err["msg"] and not fixed,
              f"{err} after-fix={fixed}")
        page.evaluate("() => { const i = document.getElementById('live-amount'); i.value=''; i.dispatchEvent(new Event('input',{bubbles:true})); }")

        # ---- خطأ + تركيز: حد الخطأ مع الحلقة معًا (ثابت) ----
        ef = page.evaluate(
            """() => { const f = document.querySelector('.has-error.has-focus .m-field__control');
                 const cs = getComputedStyle(f);
                 return {border: cs.borderColor, ring: cs.boxShadow.includes('rgb(173, 48, 59)')}; }""")
        check("A10 خطأ + تركيز: حد الخطأ والحلقة معًا",
              ef["border"] == "rgb(173, 48, 59)" and ef["ring"], str(ef))

        # ---- المعطل: بلا حلقة تركيز ----
        dis = page.evaluate(
            """() => { const f = document.querySelector('.has-disabled .m-field__control');
                 return {bg: getComputedStyle(f).backgroundColor, shadow: getComputedStyle(f).boxShadow}; }""")
        check("A11 المعطل: أرضية المعطل وبلا حلقة", dis["bg"] == "rgb(228, 234, 232)" and dis["shadow"] == "none", str(dis))

        # ---- E03: حقول متطابقة البنية + وصف سابق + حراسة readOnly/disabled ----
        e03 = page.evaluate(
            """() => {
              const host = document.createElement('div');
              host.id = 'e03-probe';
              // ثلاثة حقول متطابقة البنية (نفس الصنف بلا id) + حقل بوصف سابق + مسح + stepper
              host.innerHTML = `
                <div class="m-field" data-micro-field>
                  <label class="m-field__label">حقل مكرر أ</label>
                  <div class="m-field__control"><input class="m-field__input" type="text" value="A"></div>
                  <p class="m-field__msg" data-field-msg hidden>رسالة أ</p>
                </div>
                <div class="m-field" data-micro-field>
                  <label class="m-field__label">حقل مكرر ب</label>
                  <div class="m-field__control"><input class="m-field__input" type="text" value="B"></div>
                  <p class="m-field__msg" data-field-msg hidden>رسالة ب</p>
                </div>
                <div class="m-field" data-micro-field>
                  <label class="m-field__label">حقل بوصف سابق</label>
                  <div class="m-field__control">
                    <input class="m-field__input" id="e03-prior" type="text" value="C" readonly aria-describedby="prior-help-77">
                    <button type="button" class="m-btn m-btn--icon m-btn--secondary m-field__clear" aria-label="مسح"><svg class="m-btn__icon" aria-hidden="true"></svg></button>
                  </div>
                  <p class="m-field__msg" data-field-msg hidden>رسالة ج</p>
                </div>
                <p id="prior-help-77" hidden>وصف مساعدة سابق</p>
                <div class="m-field" data-micro-field>
                  <label class="m-field__label">كمية قراءة فقط</label>
                  <div class="m-field__control m-field__stepper">
                    <button type="button" data-step="down" aria-label="إنقاص">−</button>
                    <input class="m-field__input m-field__input--num" id="e03-ro-step" type="text" inputmode="decimal" dir="ltr" value="10" min="0" max="99" step="5" readonly>
                    <button type="button" data-step="up" aria-label="زيادة">+</button>
                  </div>
                </div>
                <div class="m-field" data-micro-field>
                  <label class="m-field__label">كمية معطلة</label>
                  <div class="m-field__control m-field__stepper">
                    <button type="button" data-step="down" aria-label="إنقاص">−</button>
                    <input class="m-field__input m-field__input--num" id="e03-dis-step" type="text" inputmode="decimal" dir="ltr" value="20" min="0" max="99" step="5" disabled>
                    <button type="button" data-step="up" aria-label="زيادة">+</button>
                  </div>
                </div>`;
              document.body.appendChild(host);
              MicroFields.init(host);
              MicroFields.init(host); // إعادة init — بلا تكرار
              const fields = [...host.querySelectorAll('[data-micro-field]')];
              const msgIds = fields.filter(f => f.querySelector('[data-field-msg]')).map(f => f.querySelector('[data-field-msg]').id);
              const unique = new Set(msgIds).size === 3;
              const prior = document.getElementById('e03-prior').getAttribute('aria-describedby').split(/\\s+/);
              const merged = prior.includes('prior-help-77') && prior.includes(msgIds[2]);
              // مسح readonly (زر المسح موجود في الحقل الثالث لكن نجرّب الحماية بنقل القيمة)
              const roInput = document.getElementById('e03-ro-step');
              const disInput = document.getElementById('e03-dis-step');
              let roEvents = 0, disEvents = 0;
              roInput.addEventListener('micro-field:changed', () => roEvents++);
              disInput.addEventListener('micro-field:changed', () => disEvents++);
              fields[3].querySelector('[data-step="up"]').click();
              fields[4].querySelector('[data-step="up"]').click();
              const roVal = roInput.value, disVal = disInput.value;
              // مسح على حقل readonly عبر واجهة المسح: القيمة تبقى
              const c3 = fields[2].querySelector('.m-field__clear');
              const c3Input = document.getElementById('e03-prior');
              const beforeClear = c3Input.value;
              c3.click();
              const afterClear = c3Input.value;
              const res = {unique, msgIds, merged, roVal, disVal, roEvents, disEvents,
                           clearKept: afterClear === beforeClear,
                           priorStill: c3Input.getAttribute('aria-describedby').includes('prior-help-77')};
              host.remove();
              return res;
            }""")
        check("A12 حقول متطابقة: IDs رسائل فريدة + دمج وصف سابق بلا استبدال وبلا تكرار عند إعادة init",
              e03["unique"] and e03["merged"] and e03["priorStill"],
              str({k: e03[k] for k in ("unique", "msgIds", "merged", "priorStill")}))
        check("A13 حراسة الحالة: مسح/زيادة/نقصان على readOnly وdisabled يترك القيمة ويمنع حدث التغيير",
              e03["roVal"] == "10" and e03["disVal"] == "20" and e03["roEvents"] == 0
              and e03["disEvents"] == 0 and e03["clearKept"],
              str({k: e03[k] for k in ("roVal", "disVal", "roEvents", "disEvents", "clearKept")}))

        # ---- R2-06: تفرد معرف الرسالة في المستند كله — معرف موجود مسبقًا لا يُعاد استعماله ----
        e06 = page.evaluate(
            """() => { try {
                 // معرف موجود مسبقًا من المستهلك بنفس نمط العدّاد
                 const taken = document.createElement('p');
                 taken.id = 'm-field-msg-1';
                 taken.hidden = true;
                 document.body.appendChild(taken);
                 const host = document.createElement('div');
                 host.innerHTML = '<div class="m-field" data-micro-field>' +
                   '<label class="m-field__label" for="r2-f">حقل</label>' +
                   '<div class="m-field__control"><input class="m-field__input" id="r2-f" type="text"></div>' +
                   '<p class="m-field__msg" data-field-msg hidden>رسالة بلا معرف</p></div>';
                 document.body.appendChild(host);
                 MicroFields.init(host);
                 const msg = host.querySelector('[data-field-msg]');
                 const input = host.querySelector('#r2-f');
                 const res = {newId: msg.id,
                              notColliding: msg.id !== 'm-field-msg-1' && document.getElementById(msg.id) === msg,
                              bound: input.getAttribute('aria-describedby').includes(msg.id)};
                 host.remove();
                 taken.remove();
                 return res;
               } catch (e) { return {err: e.message}; } }""")
        check("A14 (R2-06) معرف رسالة جديد يفحص المستند كله: لا تصادم مع m-field-msg-1 الموجود والموجود محفوظ لصاحبه",
              e06.get("notColliding") and e06.get("bound"), str(e06))


        # ---- SYS-02/E11: المثال المستقل بلا board.* ----
        ex2 = f"{base}/previews/fields/example-usage.html"
        pe2 = ctx.new_page()
        ex_err2 = []
        pe2.on("pageerror", lambda e: ex_err2.append(str(e)))
        pe2.goto(ex2)
        pe2.wait_for_load_state("networkidle")
        pe2.wait_for_timeout(1200)
        ex_res2 = pe2.evaluate("() => document.getElementById('results').textContent")
        check("EX مثال مستقل fields: 0 فشل بلا أخطاء",
              ex_res2.count("FAIL ") == 0 and ex_res2.count("PASS ") >= 3 and not ex_err2,
              ex_res2.splitlines()[0] if ex_res2 else "لا نتائج")
        pe2.close()

        # ---- لقطات ----
        page.locator("#types").screenshot(path=str(SHOTS / "01-types-390.png"))
        page.locator("#live").screenshot(path=str(SHOTS / "03-live-390.png"))
        page.locator("#hard").screenshot(path=str(SHOTS / "04-hard-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "14-assets-390.png"))
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ---- E) إثبات تعديل توكن من المصدر ثم استعادة (داخل السياق نفسه) ----
        before = js_rect(page, ".m-field__control")
        page.evaluate("() => document.documentElement.style.setProperty('--micro-field-min-height', '56px')")
        after = js_rect(page, ".m-field__control")
        page.evaluate("() => document.documentElement.style.removeProperty('--micro-field-min-height')")
        restored = js_rect(page, ".m-field__control")
        check("E1 تعديل توكن الارتفاع من المصدر ينعكس ثم يُستعاد (52→56→52)",
              before and after and restored
              and abs(before["h"] - 52) < 0.5 and abs(after["h"] - 56) < 0.5 and abs(restored["h"] - 52) < 0.5,
              f"قبل {before} أثناء {after} بعد {restored}")
        ctx.close()

        # ---- C) جدول الحالات 1280 ----
        c = browser.new_context(viewport={"width": 1280, "height": 950})
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        pg.locator("#states").screenshot(path=str(SHOTS / "02-states-1280.png"))
        pg.screenshot(path=str(SHOTS / "15-board-1280-full.png"), full_page=True)
        c.close()

        # ---- B) 320/390/430 + تكبير 200% ----
        widths = [320, 390, 430]
        for idx, width in enumerate(widths):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            ov = pg.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
            check(f"B1 {width}px: الصفحة بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))
            fullsel = f'.phone-full-block[data-w="{width}"] .phone-demo'
            rect = js_rect(pg, fullsel)
            inner = pg.evaluate("(s) => { const el = document.querySelector(s); return {sw: el.scrollWidth, cw: el.clientWidth}; }", fullsel)
            check(f"B2 {width}px: العمود الكامل بعرضه الحقيقي وسالم داخليًا",
                  rect and abs(rect["w"] - width) < 0.5 and inner["sw"] <= inner["cw"] + 1, f"عرض={rect} داخلي={inner}")
            pg.locator("#phones-full").screenshot(path=str(SHOTS / f"{10 + idx}-phone-full-{width}.png"))
            if width in (320, 390):
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(250)
                tz = pg.evaluate(
                    """() => { const t = document.getElementById('text-zoom-target');
                         const lab = t.querySelector('.m-field__label');
                         const msg = t.querySelector('.m-field__msg');
                         const demo = t;
                         return {labFont: getComputedStyle(lab).fontSize,
                                 msgFont: getComputedStyle(msg).fontSize,
                                 demoSw: demo.scrollWidth, demoCw: demo.clientWidth}; }""")
                check(f"B3 {width}px زيادة حجم الخط 200%: التسمية والرسالة 28px (14×2) والمحتوى داخل العمود",
                      tz["labFont"] == "28px" and tz["msgFont"] == "28px"
                      and tz["demoSw"] <= tz["demoCw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"{12 + (0 if width == 320 else 1)}-zoom-200-{width}.png"))
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(150)
                back = pg.evaluate(
                    "() => getComputedStyle(document.querySelector('#text-zoom-target .m-field__label')).fontSize")
                check(f"B4 {width}px الاستعادة الدقيقة بعد الإلغاء (14px)", back == "14px", f"font={back}")
            c.close()

        # ---- D) تقليل الحركة ----
        c = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        rm = pg.evaluate(
            "() => getComputedStyle(document.querySelector('.m-field__control')).transitionDuration")
        check("D1 تقليل الحركة: الانتقالات ملغاة", rm == "0s", f"duration={rm}")
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
