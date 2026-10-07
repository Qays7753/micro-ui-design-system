#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — دفعة العارض (Carousel + Packed-Circle) — جولة إصلاح PR#5: فحص ولقطات. من جذر المستودع:
  python3 tools/carousel-screenshots.py
متصفح headless فعلي (Playwright + Chromium) — لقطات وقياسات من المصدر نفسه.

جولة PR#5 تضيف فحوصًا إلزامية جديدة:
  - إفلات المؤشر خارج الـviewport أثناء السحب → لا بقاء is-dragging والانتقال يعود.
  - السحب العمودي يُسلَّم للتمرير (إلغاء ذاتي) وفقدان التركيز يوقف السحب.
  - الأسهم داخل input/contenteditable/زر بطاقة تبقى محلية (لا اعتراض ولا preventDefault).
  - التوسعة inline: aria-expanded/aria-controls والطي عند الانتقال والسحب لا يوسّع.
  - القيم الحقيقية داخل الدوائر (لا نسب) وتداخل لا يخفي رقمًا (قياس تقاطع فعلي).
  - القيمة السالبة مع data-display: التنسيق والدلالة معًا في الرسم والمفتاح.
"""
import http.server, subprocess, sys, threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "CAROUSEL" / "screenshots"
LOGFILE = ROOT / "reviews" / "CAROUSEL" / "verification.txt"
results, log_lines = [], []

def log(m):
    print(m); log_lines.append(m)

def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))

def main(out_dir: Path = None, port: int = 0):
    global SHOTS, LOGFILE
    # SAMSUNG-ONEUI-REPAIR-R1 (الوكيل 4 — رجعية 2026-10-07): --out/--port
    # لمخرجات معزولة دون الكتابة فوق reviews/CAROUSEL التاريخي + منفذ نطاق الوكيل 4.
    if out_dir is not None:
        SHOTS = out_dir / "screenshots"
        LOGFILE = out_dir / "verification.txt"
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    board = f"{base}/previews/carousel/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log(f"# CAROUSEL سجل الفحص — جولة إصلاح PR#5 — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree} (الأدلة مولدة من شجرة هذا commit نظيفة)")
    log("# بيئة الفحص: متصفح headless فعلي (Playwright + Chromium) — لا محاكاة DOM؛ القياسات الهندسية من مستطيلات المتصفح الحقيقية")
    log("# حدود الفحوص المعلنة: لا قارئ شاشة فعلي، لا لمس حقيقي (سحب بالمؤشر فقط)، لا متصفحات غير Chromium، لا تكبير نظام/متصفح أصلي (محاكاة مكافئة للنص)، لا هاتف حقيقي؛ فقدان التركيز يُحاكى بحدث blur تركيبي موثق")
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
        page.wait_for_timeout(350)

        # ==== A1: بلا أخطاء ====
        check("A1 لا أخطاء كونسول/صفحة في اللوحة", len(errors) == 0, "; ".join(errors[:2]))

        # ==== A2: البنية والعقد ====
        st = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 return {vp: !!r.querySelector('[data-viewport]'), track: !!r.querySelector('[data-track]'),
                         slides: r.querySelectorAll('[data-carousel-slide]').length,
                         prev: !!r.querySelector('[data-prev]'), next: !!r.querySelector('[data-next]'),
                         status: !!r.querySelector('[data-status]'), dots: r.querySelectorAll('[data-dots] .m-carousel__dot').length,
                         role: r.getAttribute('role'), roledesc: r.getAttribute('aria-roledescription'),
                         label: r.getAttribute('aria-label')}; }""")
        check("A2 البنية: viewport/track/3 شرائح/أزرار/مؤشر/3 نقاط + group/عارض بطاقات/اسم إتاحي",
              st["vp"] and st["track"] and st["slides"] == 3 and st["prev"] and st["next"]
              and st["status"] and st["dots"] == 3 and st["role"] == "group"
              and st["roledesc"] == "عارض بطاقات" and st["label"] == "ملخصات العمليات", str(st))

        # ==== A3: تسميات الشرائح الإتاحية ====
        lbl = page.evaluate(
            """() => [...document.querySelectorAll('#main-carousel [data-carousel-slide]')]
                      .map(s => s.getAttribute('aria-label'))""")
        check("A3 تسمية كل شريحة «الاسم، البطاقة X من N» (نمط «ملخص الطلبات، البطاقة 2 من 3»)",
              lbl[0] == "مؤشرات التشغيل، البطاقة 1 من 3" and lbl[1] == "الطلبات حسب الحالة، البطاقة 2 من 3"
              and lbl[2] == "المقارنة المالية، البطاقة 3 من 3", str(lbl))

        # ==== A4: الحالة الأولى — تعطيل صادق + توسّط فعلي ====
        first = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const s0 = r.querySelectorAll('[data-carousel-slide]')[0].getBoundingClientRect();
                 const c0 = s0.left + s0.width/2, cvp = vp.left + vp.width/2;
                 const tr = getComputedStyle(r.querySelector('[data-track]')).transform;
                 const tx = tr && tr !== 'none' ? parseFloat(tr.match(/matrix\\(([^)]+)\\)/)[1].split(',')[4]) : 0;
                 return {prevDisabled: r.querySelector('[data-prev]').disabled,
                         nextDisabled: r.querySelector('[data-next]').disabled,
                         status: r.querySelector('[data-status]').textContent,
                         off: Math.abs(c0 - cvp), tx}; }""")
        check("A4 الحالة الأولى: prev معطل وnext متاح والمؤشر «البطاقة 1 من 3» والبطاقة النشطة بمركز الشاشة (فرق ≤ 1px)",
              first["prevDisabled"] and not first["nextDisabled"] and first["status"] == "البطاقة 1 من 3"
              and first["off"] <= 1, str(first))

        # ==== A5: الحالة الوسطى ====
        page.click("#main-carousel [data-next]")
        page.wait_for_timeout(320)
        mid = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const s1 = r.querySelectorAll('[data-carousel-slide]')[1].getBoundingClientRect();
                 return {status: r.querySelector('[data-status]').textContent,
                         prevDis: r.querySelector('[data-prev]').disabled, nextDis: r.querySelector('[data-next]').disabled,
                         off: Math.abs((s1.left + s1.width/2) - (vp.left + vp.width/2))}; }""")
        check("A5 الحالة الوسطى: كلا الزرين متاحان والمؤشر «البطاقة 2 من 3» والوسطى متمركزة",
              mid["status"] == "البطاقة 2 من 3" and not mid["prevDis"] and not mid["nextDis"] and mid["off"] <= 1, str(mid))

        # ==== A6: RTL بالقياس الفيزيائي — المنطقي لا الاسم ====
        rtl = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const tr = getComputedStyle(r.querySelector('[data-track]')).transform;
                 const tx = parseFloat(tr.match(/matrix\\(([^)]+)\\)/)[1].split(',')[4]);
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const s0 = r.querySelectorAll('[data-carousel-slide]')[0].getBoundingClientRect();
                 return {tx, rtl: getComputedStyle(r).direction === 'rtl',
                         prevPeekRight: +(vp.right - s0.left).toFixed(1),
                         nextPeekLeft: +(s2left(s0, vp)).toFixed(1),
                         dirAttr: r.getAttribute('data-dir')};
                 function s2left(s0, vp) {
                   const r2 = document.querySelector('#main-carousel');
                   const s2 = r2.querySelectorAll('[data-carousel-slide]')[2].getBoundingClientRect();
                   return s2.right - vp.left; } }""")
        page.screenshot(path=str(SHOTS / "08-rtl-logical-390.png"), clip={"x": 0, "y": 0, "width": 390, "height": 844})
        check("A6 RTL: بعد next من الأولى translateX موجب (التالي ظهر من اليسار) والمجاورة السابقة تطلّ من اليمين والتالية من اليسار بمقدار peek (24±2)",
              rtl["rtl"] and rtl["tx"] > 0 and abs(rtl["prevPeekRight"] - 24) <= 2
              and abs(rtl["nextPeekLeft"] - 24) <= 2 and rtl["dirAttr"] == "rtl", str(rtl))

        # ==== A7: الحالة الأخيرة ====
        page.click("#main-carousel [data-next]")
        page.wait_for_timeout(320)
        last = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 return {status: r.querySelector('[data-status]').textContent,
                         nextDis: r.querySelector('[data-next]').disabled, prevDis: r.querySelector('[data-prev]').disabled}; }""")
        page.locator("#overview").screenshot(path=str(SHOTS / "04-state-last-390.png"))
        check("A7 الحالة الأخيرة: next معطل والمؤشر «البطاقة 3 من 3» وprev متاح",
              last["nextDis"] and not last["prevDis"] and last["status"] == "البطاقة 3 من 3", str(last))
        page.click("#main-carousel [data-prev]")
        page.wait_for_timeout(320)
        page.locator("#overview").screenshot(path=str(SHOTS / "03-state-middle-390.png"))
        page.click("#main-carousel [data-prev]")
        page.wait_for_timeout(320)
        page.locator("#overview").screenshot(path=str(SHOTS / "02-state-first-390.png"))
        page.locator("#main-carousel").screenshot(path=str(SHOTS / "01-overview-main-390.png"))

        # ==== A8: الأسهم ومؤشر الموضع (لقطة قريبة + أدوار الأزرار) ====
        btns = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 return {prevLabel: r.querySelector('[data-prev]').getAttribute('aria-label'),
                         nextLabel: r.querySelector('[data-next]').getAttribute('aria-label'),
                         live: r.querySelector('[data-status]').getAttribute('aria-live'),
                         iconHidden: r.querySelector('[data-prev] svg').getAttribute('aria-hidden')}; }""")
        page.locator("#main-carousel .m-carousel__controls").screenshot(path=str(SHOTS / "09-controls-indicator-390.png"))
        check("A8 أسماء الأزرار «السابق/التالي» + أيقونة ديكورية aria-hidden + المؤشر حيّ aria-live=polite",
              btns["prevLabel"] == "السابق" and btns["nextLabel"] == "التالي"
              and btns["live"] == "polite" and btns["iconHidden"] == "true", str(btns))

        # ==== A9: حالات العدد — 0 و1 ====
        empty = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r0 = labs[0].querySelector('[data-carousel]');
                 return {status: r0.querySelector('[data-status]').textContent,
                         prev: r0.querySelector('[data-prev]').disabled, next: r0.querySelector('[data-next]').disabled,
                         dotsHidden: r0.querySelector('[data-dots]') ? r0.querySelector('[data-dots]').hidden : null,
                         slides: r0.querySelectorAll('[data-carousel-slide]').length}; }""")
        one = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r1 = labs[1].querySelector('[data-carousel]');
                 return {status: r1.querySelector('[data-status]').textContent,
                         prev: r1.querySelector('[data-prev]').disabled, next: r1.querySelector('[data-next]').disabled}; }""")
        page.locator(".state-lab").first.screenshot(path=str(SHOTS / "05-empty-cards-390.png"))
        page.locator(".state-lab").nth(1).screenshot(path=str(SHOTS / "05b-one-card-390.png"))
        check("A9 صفر بطاقات: «لا توجد بطاقات» وكلا الزرين معطل وبلا نقاط · بطاقة واحدة: «البطاقة 1 من 1» وكلا الزرين معطل",
              empty["status"] == "لا توجد بطاقات" and empty["prev"] and empty["next"] and empty["slides"] == 0
              and one["status"] == "البطاقة 1 من 1" and one["prev"] and one["next"], f"empty={empty} one={one}")

        # ==== A10: بطاقتان وعدد أكبر ====
        two = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r2 = labs[2].querySelector('[data-carousel]');
                 const dots = r2.querySelectorAll('.m-carousel__dot').length;
                 r2.querySelector('[data-next]').click();
                 return {dots, willCheck: true}; }""")
        page.wait_for_timeout(320)
        two2 = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r2 = labs[2].querySelector('[data-carousel]');
                 const out = {status: r2.querySelector('[data-status]').textContent,
                              nextDis: r2.querySelector('[data-next]').disabled};
                 r2.querySelector('[data-prev]').click();
                 return out; }""")
        page.wait_for_timeout(250)
        many = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r6 = labs[3].querySelector('[data-carousel]');
                 return {dots: r6.querySelectorAll('.m-carousel__dot').length,
                         slides: r6.querySelectorAll('[data-carousel-slide]').length,
                         status: r6.querySelector('[data-status]').textContent}; }""")
        page.locator(".state-lab").nth(2).screenshot(path=str(SHOTS / "06-two-cards-390.png"))
        page.locator(".state-lab").nth(3).screenshot(path=str(SHOTS / "07-many-cards-390.png"))
        check("A10 بطاقتان: نقطتان والوصول للأخير يعطّل next · عدد أكبر: 6 شرائح و6 نقاط والمؤشر صادق",
              two["dots"] == 2 and two2["status"] == "البطاقة 2 من 2" and two2["nextDis"]
              and many["dots"] == 6 and many["slides"] == 6 and many["status"] == "البطاقة 1 من 6", f"two={two} two2={two2} many={many}")

        # ==== A11: النقاط — انتقال مباشر وaria-current ====
        dots = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r6 = labs[3].querySelector('[data-carousel]');
                 const ds = [...r6.querySelectorAll('.m-carousel__dot')];
                 ds[3].click();
                 return {label: ds[3].getAttribute('aria-label')}; }""")
        page.wait_for_timeout(320)
        dotsState = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r6 = labs[3].querySelector('[data-carousel]');
                 const ds = [...r6.querySelectorAll('.m-carousel__dot')];
                 return {status: r6.querySelector('[data-status]').textContent,
                         current: ds.map(d => d.getAttribute('aria-current') === 'true')}; }""")
        check("A11 نقطة رقم 4: aria-label صريح والنقر ينقل («البطاقة 4 من 6») وaria-current للحالية فقط",
              dotsState["status"] == "البطاقة 4 من 6" and dotsState["current"] == [False, False, False, True, False, False]
              and "البطاقة 4 من 6" in dots["label"], f"{dots} {dotsState}")

        # ==== A12: لوحة المفاتيح — الترتيب المنطقي تحت RTL ====
        keys = page.evaluate(
            """() => { const labs = [...document.querySelectorAll('.state-lab')];
                 const r6 = labs[3].querySelector('[data-carousel]');
                 const fire = k => r6.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true}));
                 const idx = () => MicroCarousel.getIndex(r6);
                 const start = idx();
                 fire('ArrowLeft');  const afterLeft = idx();
                 fire('ArrowRight'); const afterRight = idx();
                 fire('Home'); const afterHome = idx();
                 fire('End');  const afterEnd = idx();
                 fire('Home');
                 return {start, afterLeft, afterRight, afterHome, afterEnd}; }""")
        page.wait_for_timeout(350)
        check("A12 RTL منطقيًا: ArrowLeft تالي (+1) وArrowRight سابق (−1) وHome الأولى وEnd الأخيرة",
              keys["start"] == 3 and keys["afterLeft"] == 4 and keys["afterRight"] == 3
              and keys["afterHome"] == 0 and keys["afterEnd"] == 5, str(keys))

        # ==== A13: Enter/Space على أزرار العارض + عدم نقل التركيز لغير المرئي ====
        page.focus("#main-carousel [data-next]")
        page.keyboard.press("Enter")
        page.wait_for_timeout(300)
        enterState = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 return {status: r.querySelector('[data-status]').textContent,
                         active: document.activeElement === r.querySelector('[data-next]')}; }""")
        page.keyboard.press("Space")
        page.wait_for_timeout(300)
        spaceState = page.evaluate(
            """() => document.querySelector('#main-carousel [data-status]').textContent""")
        inert = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const ss = [...r.querySelectorAll('[data-carousel-slide]')];
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const vis = ss.map(s => { const b = s.getBoundingClientRect();
                   return !(b.right <= vp.left + 1 || b.left >= vp.right - 1); });
                 const inertAttr = ss.map(s => s.hasAttribute('inert'));
                 return {vis, inertAttr}; }""")
        check("A13 Enter ثم Space يبدّلان البطاقة والتركيز يبقى على الزر؛ المجاورة تبقى معاينة بصرية لكن inert، والنشطة وحدها تفاعلية",
              enterState["status"] == "البطاقة 2 من 3" and enterState["active"]
              and spaceState == "البطاقة 3 من 3"
              and (not inert["vis"][0]) and inert["vis"][1] and inert["vis"][2]
              and inert["inertAttr"][0] and inert["inertAttr"][1] and not inert["inertAttr"][2],
              f"enter={enterState} space={spaceState} inert={inert}")

        # ==== A13b (جديد PR#5): حارس الأسهم داخل العناصر التفاعلية للبطاقة ====
        guard = page.evaluate(
            """() => { const r = document.querySelector('#lab-interactive');
                 const idx = () => MicroCarousel.getIndex(r);
                 const start = idx();
                 /* 1) داخل input: الأسهم محلية — لا تبديل ولا منع افتراضي */
                 const input = document.getElementById('card-input');
                 input.focus();
                 const eL = new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true, cancelable: true});
                 const eR = new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true, cancelable: true});
                 input.dispatchEvent(eL); input.dispatchEvent(eR);
                 const afterInput = idx();
                 /* 2) داخل contenteditable */
                 const ed = document.getElementById('card-editable');
                 ed.focus();
                 const eE = new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true, cancelable: true});
                 ed.dispatchEvent(eE);
                 const afterEditable = idx();
                 /* 3) زر عادي داخل البطاقة: أسهمه محلية */
                 const btn = document.getElementById('card-plain-btn');
                 btn.focus();
                 const eB = new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true, cancelable: true});
                 btn.dispatchEvent(eB);
                 const afterCardBtn = idx();
                 /* 4) من زر تحكم العارض (prev): الأسهم تبقى تنقل بالترتيب المنطقي */
                 const prevBtn = r.querySelector('[data-prev]');
                 prevBtn.focus();
                 const idxAtCtrl = idx();
                 const eC = new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true, cancelable: true});
                 prevBtn.dispatchEvent(eC);
                 const afterCtrl = idx();
                 return {start, afterInput, afterEditable, afterCardBtn, idxAtCtrl, afterCtrl,
                         inPrevL: eL.defaultPrevented, inPrevR: eR.defaultPrevented,
                         inEd: eE.defaultPrevented, inBtn: eB.defaultPrevented, inCtrl: eC.defaultPrevented}; }""")
        page.wait_for_timeout(250)
        check("A13b حارس الأسهم: داخل input/contenteditable/زر بطاقة لا تبديل ولا preventDefault — ومن زر تحكم العارض تبقى الأسهم تنقل (RTL: يسار = تالي)",
              guard["afterInput"] == guard["start"] and guard["afterEditable"] == guard["start"]
              and guard["afterCardBtn"] == guard["start"]
              and not guard["inPrevL"] and not guard["inPrevR"] and not guard["inEd"] and not guard["inBtn"]
              and guard["afterCtrl"] == guard["idxAtCtrl"] + 1 and guard["inCtrl"],
              str(guard))

        # لقطة تركيز لوحة المفاتيح: Tab حتى زر مع حلقة التركيز
        page.evaluate("() => document.activeElement && document.activeElement.blur()")
        page.focus("#main-carousel [data-prev]")
        focusShot = page.evaluate(
            """() => { const b = document.querySelector('#main-carousel [data-prev]');
                 const r = b.getBoundingClientRect();
                 return {fv: b.matches(':focus-visible'),
                         shadow: getComputedStyle(b).boxShadow !== 'none',
                         rect: {x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height}}; }""")
        page.locator("#main-carousel .m-carousel__controls").screenshot(path=str(SHOTS / "10-keyboard-focus-390.png"))
        check("A14 حلقة تركيز مرئية على الزر المركّز بلوحة المفاتيح (focus-visible + ظل)",
              focusShot["fv"] or focusShot["shadow"], str(focusShot))

        # ==== A15: لا autoplay ولا تبديل تلقائي ====
        beforeIdx = page.evaluate("() => MicroCarousel.getIndex(document.querySelector('#main-carousel'))")
        page.wait_for_timeout(1400)
        afterIdx = page.evaluate("() => MicroCarousel.getIndex(document.querySelector('#main-carousel'))")
        check("A15 لا autoplay: الموضع ثابت بعد 1.4s بلا أي تفاعل", beforeIdx == afterIdx == 2, f"{beforeIdx}→{afterIdx}")

        # ==== A16: السحب — التزام فوق العتبة وsnap-back تحتها ====
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(350)
        vpBox = page.locator("#main-carousel [data-viewport]").bounding_box()
        cx, cy = vpBox["x"] + vpBox["width"] / 2, vpBox["y"] + vpBox["height"] / 2
        # سحب يمينًا (RTL) بمقدار 120px > العتبة → التالي
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 60, cy, steps=6)
        page.screenshot(path=str(SHOTS / "14-drag-mid-390.png"), clip={"x": 0, "y": vpBox["y"] - 90, "width": 390, "height": 260})
        page.mouse.move(cx + 120, cy, steps=6)
        page.mouse.up()
        page.wait_for_timeout(350)
        dragCommit = page.evaluate(
            """() => ({idx: MicroCarousel.getIndex(document.querySelector('#main-carousel')),
                       status: document.querySelector('#main-carousel [data-status]').textContent})""")
        # سحب قصير 20px < العتبة → snap-back لنفس البطاقة
        page.mouse.move(cx, cy); page.mouse.down()
        page.mouse.move(cx + 20, cy, steps=4)
        page.mouse.up()
        page.wait_for_timeout(350)
        dragCancel = page.evaluate(
            """() => ({idx: MicroCarousel.getIndex(document.querySelector('#main-carousel'))})""")
        touchAction = page.evaluate(
            """() => getComputedStyle(document.querySelector('#main-carousel [data-viewport]')).touchAction""")
        check("A16 السحب: يمينًا 120px في RTL يلتزم التالي (من 0 إلى 1) و20px يلغي نفسه (snap-back) وtouch-action: pan-y يحفظ التمرير العمودي",
              dragCommit["idx"] == 1 and dragCancel["idx"] == 1 and touchAction == "pan-y",
              f"commit={dragCommit} cancel={dragCancel} touch-action={touchAction}")

        # ==== A16b (جديد PR#5): إفلات المؤشر خارج الـviewport — لا بقاء is-dragging ====
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(350)
        vpBox = page.locator("#main-carousel [data-viewport]").bounding_box()
        cx, cy = vpBox["x"] + vpBox["width"] / 2, vpBox["y"] + vpBox["height"] / 2
        stateExpr = """() => { const r = document.querySelector('#main-carousel');
                     return {dragging: r.classList.contains('is-dragging'),
                             dur: getComputedStyle(r.querySelector('[data-track]')).transitionDuration,
                             idx: MicroCarousel.getIndex(r)}; }"""
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 50, cy, steps=5)
        during = page.evaluate(stateExpr)
        # الخروج خارج حدود الـviewport (إلى أعلى الصفحة) ثم الإفلات هناك
        page.mouse.move(cx + 50, 12, steps=8)
        page.mouse.up()
        page.wait_for_timeout(250)
        after = page.evaluate(stateExpr)
        page.screenshot(path=str(SHOTS / "27-drag-released-outside-390.png"), clip={"x": 0, "y": 0, "width": 390, "height": 480})
        check("A16b pointerup خارج الـviewport: أثناء السحب is-dragging=true والانتقال 0s — وبعد الإفلات خارج الـviewport يُنظَّف كل شيء (is-dragging=false والانتقال يعود 0.18s) — إصلاح PR#5 المثبت",
              during["dragging"] and during["dur"] == "0s"
              and not after["dragging"] and after["dur"] == "0.18s",
              f"during={during} after={after}")

        # ==== A16c (جديد PR#5): السحب العمودي يُسلَّم للتمرير + blur يوقف السحب ====
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(350)
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx, cy + 34, steps=5)  # عمودي > قفل المحور 8px
        page.wait_for_timeout(60)
        vert = page.evaluate(stateExpr)
        page.mouse.up()
        page.wait_for_timeout(250)
        # فقدان التركيز/النافذة أثناء سحب جديد — مسار تنظيف تركيبي موثق (blur)
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 30, cy, steps=3)
        page.evaluate("() => window.dispatchEvent(new Event('blur'))")
        page.wait_for_timeout(60)
        blurState = page.evaluate(stateExpr)
        page.mouse.up()
        page.wait_for_timeout(250)
        check("A16c مسارات الإلغاء: السحب العمودي (>8px) يُلغي نفسه ويُسلّم للتمرير (is-dragging=false والموضع ثابت) وفقدان التركيز (blur) ينظّف حالة السحب فورًا",
              not vert["dragging"] and vert["idx"] == 0
              and not blurState["dragging"],
              f"vertical={vert} blur={blurState}")

        # ==== A17: حدث عام ====
        ev = page.evaluate(
            """() => new Promise(res => { const r = document.querySelector('#main-carousel');
                 r.addEventListener('micro-carousel:change', e => res(e.detail), {once: true});
                 MicroCarousel.next(r); })""")
        page.wait_for_timeout(250)
        check("A17 حدث micro-carousel:change يفصح عن {index, count}", ev == {"index": 1, "count": 3}, str(ev))
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(300)

        # ==== A18: المحتوى داخل بطاقة المقارنة (donut بمقام معلن داخل العارض) ====
        donut = page.evaluate(
            """() => { const c = document.querySelector('#main-carousel .m-chart--donut');
                 return {center: c.querySelector('.m-donut__center').textContent,
                         pct: c.querySelector('.m-legend').textContent.includes('(44%)')}; }""")
        check("A18 بطاقة الطلبات: donut بمقام معلن 25 في المركز ونسب من المقام — عقد B05 داخل بطاقة العارض دون تغيير",
              donut["center"] == "25" and donut["pct"], str(donut))

        # ==== C0 (جديد PR#5): البطاقات compact افتراضيًا — لا تمدد إجباري ولا قصّ ====
        compact = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const cards = [...r.querySelectorAll('.m-carousel__card')];
                 const hs = cards.map(c => Math.round(c.getBoundingClientRect().height));
                 const noClip = cards.every(c => c.scrollHeight <= c.clientHeight + 2);
                 const slide = r.querySelector('[data-current="true"]').querySelector('.m-carousel__card');
                 const sh = Math.round(slide.getBoundingClientRect().height);
                 const noStretchCSS = getComputedStyle(r.querySelector('[data-track]')).alignItems;
                 return {heights: hs, noClip, activeH: sh, align: noStretchCSS}; }""")
        page.locator("#main-carousel").screenshot(path=str(SHOTS / "20-compact-closed-390.png"))
        check("C0 compact افتراضيًا: أطوال البطاقات تتبع محتواها (غير متساوية — لا تمدد إجباري) والبطاقة النشطة المغلقة ≈ 220–280px على 390px بلا أي قصّ محتوى وalign-items: flex-start",
              len(set(compact["heights"])) > 1 and compact["noClip"]
              and 200 <= compact["activeH"] <= 320 and compact["align"] == "flex-start",
              str(compact))

        # ==== C1 (جديد PR#5): الحالة المغلقة الافتراضية لعقد التوسعة ====
        contract = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const ss = [...r.querySelectorAll('[data-carousel-slide]')];
                 return ss.map(s => { const b = s.querySelector('[data-card-expand]');
                   const reg = s.querySelector('[data-card-details]');
                   return b && reg ? {exp: b.getAttribute('aria-expanded'), hidden: reg.hidden,
                                      type: b.getAttribute('type'), ctl: b.getAttribute('aria-controls'),
                                      label: b.textContent.trim()} : null; }); }""")
        check("C1 عقد التوسعة في كل بطاقة: type=button وaria-expanded=false وaria-controls والمنطقة hidden والنص «عرض التفاصيل»",
              all(c and c["exp"] == "false" and c["hidden"] and c["type"] == "button" and c["ctl"] and "عرض التفاصيل" in c["label"] for c in contract),
              str(contract))

        # ==== A18b: بطاقة المقارنة داخل العارض — مغلقة: دوائر موجودة والتفاصيل مطوية ====
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 2)")
        page.wait_for_timeout(350)
        fincard = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const card = r.querySelector('[data-current="true"]');
                 const det = card.querySelector('[data-card-details]');
                 return {packed: !!card.querySelector('.m-chart--packed'),
                         circles: card.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)').length,
                         detailsHidden: det && det.hidden,
                         status: r.querySelector('[data-status]').textContent}; }""")
        page.locator("#main-carousel").screenshot(path=str(SHOTS / "24-packed-card-closed-390.png"))
        check("A18b بطاقة الدوائر مغلقة: دوائر مقرَّرة في DOM (تظهر عند التوسعة) والتفاصيل hidden والمؤشر «البطاقة 3 من 3»",
              fincard["packed"] and fincard["circles"] == 3 and fincard["detailsHidden"]
              and fincard["status"] == "البطاقة 3 من 3", str(fincard))

        # ==== C2 (جديد PR#5): التوسعة inline من الزر — القياس واللقطة ====
        hBefore = page.evaluate(
            """() => Math.round(document.querySelector('#main-carousel [data-current="true"] .m-carousel__card').getBoundingClientRect().height)""")
        expandSeq = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const slide = r.querySelector('[data-current="true"]');
                 const btn = slide.querySelector('[data-card-expand]');
                 const reg = document.getElementById(btn.getAttribute('aria-controls'));
                 btn.click();
                 return {slideExp: slide.getAttribute('data-expanded'), aria: btn.getAttribute('aria-expanded'),
                         regHidden: reg.hidden, label: btn.textContent.trim(),
                         regIsAriaCtl: document.getElementById(btn.getAttribute('aria-controls')) === reg}; }""")
        page.wait_for_timeout(250)
        hAfter = page.evaluate(
            """() => Math.round(document.querySelector('#main-carousel [data-current="true"] .m-carousel__card').getBoundingClientRect().height)""")
        expandedNoClip = page.evaluate(
            """() => { const c = document.querySelector('#main-carousel [data-current="true"] .m-carousel__card');
                 const plot = c.querySelector('.m-chart--packed [data-plot]');
                 return {noClip: c.scrollHeight <= c.clientHeight + 2,
                         plotVisible: plot.getBoundingClientRect().height > 40}; }""")
        page.locator("#main-carousel").screenshot(path=str(SHOTS / "23-expanded-active-390.png"))
        page.locator("#main-carousel [data-current=\"true\"] .m-carousel__card").screenshot(path=str(SHOTS / "25-packed-card-expanded-390.png"))
        page.locator("#main-carousel [data-current=\"true\"] .m-carousel__card").screenshot(path=str(SHOTS / "30-aria-expanded-true-390.png"))
        check("C2 التوسعة من الزر الصريح: data-expanded=true وaria-expanded=true والمنطقة تُكشف والنص يصير «إخفاء التفاصيل» والارتفاع يتبع المحتوى (يزيد) بلا قصّ والرسم ظاهر",
              expandSeq["slideExp"] == "true" and expandSeq["aria"] == "true" and not expandSeq["regHidden"]
              and "إخفاء التفاصيل" in expandSeq["label"] and expandSeq["regIsAriaCtl"]
              and hAfter > hBefore + 40 and expandedNoClip["noClip"] and expandedNoClip["plotVisible"],
              f"before={hBefore} after={hAfter} seq={expandSeq} clip={expandedNoClip}")
        log(f"      قياس الارتفاع: مغلقة {hBefore}px → موسعة {hAfter}px (المستهدف البصري للموسعة على 390 ≈ 280–360)")

        # ==== C3 (جديد PR#5): الإغلاق من الزر نفسه ====
        closeSeq = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const slide = r.querySelector('[data-current="true"]');
                 const btn = slide.querySelector('[data-card-expand]');
                 const reg = document.getElementById(btn.getAttribute('aria-controls'));
                 btn.click();
                 return {slideExp: slide.getAttribute('data-expanded'), aria: btn.getAttribute('aria-expanded'),
                         regHidden: reg.hidden, label: btn.textContent.trim()}; }""")
        check("C3 الإغلاق من الزر: aria-expanded تعود false والمنطقة hidden والنص يعود «عرض التفاصيل»",
              closeSeq["slideExp"] == "false" and closeSeq["aria"] == "false" and closeSeq["regHidden"]
              and "عرض التفاصيل" in closeSeq["label"], str(closeSeq))

        # ==== C4 (جديد PR#5): الطي عند الانتقال إلى بطاقة أخرى ====
        page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const slide = r.querySelectorAll('[data-carousel-slide]')[2];
                 slide.querySelector('[data-card-expand]').click(); }""")
        page.wait_for_timeout(150)
        page.click("#main-carousel [data-prev]")
        page.wait_for_timeout(320)
        collapseNav = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const s2 = r.querySelectorAll('[data-carousel-slide]')[2];
                 const b2 = s2.querySelector('[data-card-expand]');
                 const reg = document.getElementById(b2.getAttribute('aria-controls'));
                 return {idx: MicroCarousel.getIndex(r), s2Exp: s2.hasAttribute('data-expanded'),
                         aria: b2.getAttribute('aria-expanded'), hidden: reg.hidden}; }""")
        check("C4 الطي عند الانتقال: توسعة بطاقة ثم الانتقال → البطاقة السابقة تُطوى (aria-expanded=false والمنطقة hidden) والجديدة تظهر مغلقة",
              collapseNav["idx"] == 1 and not collapseNav["s2Exp"] and collapseNav["aria"] == "false" and collapseNav["hidden"],
              str(collapseNav))
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 2)")
        page.wait_for_timeout(300)

        # ==== C5 (جديد PR#5): السحب لا يوسّع ولا يغيّر حالة التوسعة ====
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 30, cy, steps=4)  # دون عتبة الالتزام
        page.mouse.up()
        page.wait_for_timeout(320)
        dragExp = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const s2 = r.querySelectorAll('[data-carousel-slide]')[2];
                 const b2 = s2.querySelector('[data-card-expand]');
                 return {idx: MicroCarousel.getIndex(r), aria: b2.getAttribute('aria-expanded'),
                         dragging: r.classList.contains('is-dragging')}; }""")
        # زر توسعة بطاقة غير النشطة ينقل دون توسعة
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(300)
        peekClick = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const s1 = r.querySelectorAll('[data-carousel-slide]')[1];
                 s1.querySelector('[data-card-expand]').click();
                 return {idx: MicroCarousel.getIndex(r),
                         s1Exp: s1.hasAttribute('data-expanded'),
                         s1Aria: s1.querySelector('[data-card-expand]').getAttribute('aria-expanded')}; }""")
        page.wait_for_timeout(250)
        check("C5 السحب لا يوسّع: سحب دون العتبة لا يغيّر aria-expanded ولا يترك is-dragging · زر توسعة بطاقة غير النشطة ينقل إليها دون توسعة",
              dragExp["idx"] == 2 and dragExp["aria"] == "false" and not dragExp["dragging"]
              and peekClick["idx"] == 1 and not peekClick["s1Exp"] and peekClick["s1Aria"] == "false",
              f"drag={dragExp} peek={peekClick}")
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(300)

        # ==== C6 (جديد PR#5): Tab يصل زر التوسعة وEnter/Space يفتحان ويغلقان ====
        page.evaluate("() => { const b = document.querySelector('#main-carousel [data-prev]'); b && b.blur(); }")
        page.evaluate("() => { const i = document.createElement('input'); i.style.position='fixed'; i.style.top='0'; i.style.left='0'; i.id='tab-start'; document.body.appendChild(i); i.focus(); }")
        tabbed = None
        for _ in range(20):
            page.keyboard.press("Tab")
            isToggle = page.evaluate("() => !!document.activeElement && document.activeElement.matches('#main-carousel [data-card-expand]')")
            if isToggle:
                tabbed = page.evaluate(
                    """() => { const b = document.activeElement;
                         return {fv: b.matches(':focus-visible'), shadow: getComputedStyle(b).boxShadow !== 'none'}; }""")
                break
        check("C6 Tab يصل إلى زر التوسعة بحلقة تركيز مرئية",
              tabbed is not None and (tabbed["fv"] or tabbed["shadow"]), str(tabbed))
        page.locator("#main-carousel [data-current=\"true\"] .m-carousel__card").screenshot(path=str(SHOTS / "29-expand-focus-390.png"))
        enterOpen = page.evaluate(
            """() => { const b = document.activeElement;
                 return {aria: b.getAttribute('aria-expanded'), label: b.textContent.trim()}; }""")
        page.keyboard.press("Enter")
        page.wait_for_timeout(200)
        enterOpen2 = page.evaluate(
            """() => { const b = document.activeElement;
                 return {aria: b.getAttribute('aria-expanded'), label: b.textContent.trim()}; }""")
        page.keyboard.press("Space")
        page.wait_for_timeout(200)
        enterClose = page.evaluate(
            """() => { const b = document.activeElement;
                 return {aria: b.getAttribute('aria-expanded'), label: b.textContent.trim()}; }""")
        check("C7 Enter/Space على زر التوسعة: Enter يفتح (aria-expanded=true و«إخفاء التفاصيل») وSpace يغلق (تعود false و«عرض التفاصيل»)",
              enterOpen2["aria"] == "true" and "إخفاء" in enterOpen2["label"]
              and enterClose["aria"] == "false" and "عرض" in enterClose["label"],
              f"before={enterOpen} enter={enterOpen2} space={enterClose}")
        page.evaluate("() => { const i = document.getElementById('tab-start'); i && i.remove(); }")

        # ==== A19 (محدَّث PR#5): دوائر بقيم حقيقية داخلها وتداخل لا يخفي رقمًا ====
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 0)")
        page.wait_for_timeout(300)
        packed = page.evaluate(
            """() => { const c = document.querySelector('#packed-detail .packed-demo .m-chart--packed');
                 const bubbles = [...c.querySelectorAll('.m-bubble')].filter(b => b.querySelector('.m-bubble__circle'));
                 const circs = bubbles.map(b => b.querySelector('.m-bubble__circle'));
                 const widths = circs.map(x => parseFloat(x.style.width));
                 const w0 = widths[0];
                 const r1ok = Math.abs(widths[1] - w0 * Math.sqrt(3566 / 7532)) <= 1.5;
                 const r2ok = Math.abs(widths[2] - w0 * Math.sqrt(3333 / 7532)) <= 1.5;
                 const rects = circs.map(x => x.getBoundingClientRect());
                 const overlap = (a, b) => +Math.max(0, (a.width + b.width) / 2 -
                   Math.hypot((a.left+a.right-b.left-b.right)/2,
                              (a.top+a.bottom-b.top-b.bottom)/2)).toFixed(1);
                 const ov1 = overlap(rects[0], rects[1]);
                 const ov2 = overlap(rects[1], rects[2]);
                 const inCircle = circs.map(x => { const v = x.querySelector('.m-bubble__value');
                   return v && x.contains(v) ? v.textContent.trim() : null; });
                 /* لا يخفي التداخل أي رقم: نص كل دائرة لا يتقاطع مع أي دائرة مرسومة فوقه (الأصغر فوق الأكبر) */
                 let covered = 0;
                 for (let i = 0; i < circs.length; i++) {
                   const v = circs[i].querySelector('.m-bubble__value');
                   if (!v) continue;
                   const vr = v.getBoundingClientRect();
                   for (let j = i + 1; j < circs.length; j++) {
                     const cr = circs[j].getBoundingClientRect();
                     const ox = Math.min(vr.right, cr.right) - Math.max(vr.left, cr.left);
                     const oy = Math.min(vr.bottom, cr.bottom) - Math.max(vr.top, cr.top);
                     if (ox > 0 && oy > 0) covered++;
                   }
                 }
                 const key = c.querySelector('.m-legend').textContent;
                 return {widths, r1ok, r2ok, ov1, ov2, inCircle, covered,
                         keyPct: key.includes('%'),
                         keyHasVals: key.includes('7,532') && key.includes('3,566') && key.includes('3,333')}; }""")
        page.locator("#packed-detail .packed-demo").first.screenshot(path=str(SHOTS / "16-packed-overlap-390.png"))
        page.locator("#packed-detail .packed-demo .m-chart--packed [data-plot]").first.screenshot(path=str(SHOTS / "26-overlap-readable-390.png"))
        check("A19 المقارنة (قرار PR#5): ثلاث دوائر بأقطار √القيمة (7532→3566→3333) والقيم الحقيقية 7,532/3,566/3,333 داخلها بلا نسب · تداخل هندسي فعلي في الزوجين · التداخل لا يغطي أي رقم (قياس تقاطع نص×دائرة = 0) والمفتاح بقيم خام بلا نسب",
              packed["r1ok"] and packed["r2ok"] and packed["ov1"] > 0 and packed["ov2"] > 0
              and packed["inCircle"] == ["7,532", "3,566", "3,333"] and packed["covered"] == 0
              and not packed["keyPct"] and packed["keyHasVals"], str(packed))
        log(f"      القياسات: أقطار {packed['widths']} · تداخل الزوجين {packed['ov1']}/{packed['ov2']}px · أرقام مغطاة: {packed['covered']}")

        # ==== A20b (جديد PR#5): قيمة سالبة مع data-display — التنسيق والدلالة معًا ====
        negDisp = page.evaluate(
            """() => { const g = document.querySelectorAll('#packed-detail .edge-grid')[0];
                 const c = g.querySelector('.m-chart--packed');
                 const t = c.textContent;
                 const posCircles = [...c.querySelectorAll('.m-bubble__circle')].filter(x => !x.className.includes('--none')).length;
                 const noneRings = c.querySelectorAll('.m-bubble__circle--none').length;
                 const inVal = c.querySelector('.m-bubble__circle:not(.m-bubble__circle--none) .m-bubble__value');
                 return {both: t.includes('-3,566 — سالب غير صالح للمساحة'),
                         rawInCircle: inVal ? inVal.textContent.trim() : null,
                         posCircles, noneRings, states: c.querySelectorAll('.m-packed__states li').length}; }""")
        page.locator("#packed-detail .edge-grid").first.screenshot(path=str(SHOTS / "28-negative-with-display-390.png"))
        check("A20b سالب مع data-display: «-3,566 — سالب غير صالح للمساحة» يظهر بالتنسيق والدلالة معًا (في الرسم/المفتاح) ولا دائرة سالبة ولا نسب — إصلاح PR#5",
              negDisp["both"] and negDisp["posCircles"] == 1 and negDisp["noneRings"] == 0 and negDisp["states"] == 1
              and negDisp["rawInCircle"] == "7,532", str(negDisp))

        # ==== A20: القيم غير الطبيعية ====
        edge = page.evaluate(
            """() => { const g = document.querySelectorAll('#packed-detail .edge-grid')[1];
                 const c = g.querySelector('.m-chart--packed');
                 const t = c.textContent;
                 const negCircles = [...c.querySelectorAll('.m-bubble__circle')].filter(x =>
                   !x.className.includes('--none')).length;
                 const noneRings = c.querySelectorAll('.m-bubble__circle--none').length;
                 return {unknown: t.includes('— غير معروف'), unavailable: t.includes('— غير متاح'),
                         zero: t.includes('0'), neg: t.includes('سالب غير صالح للمساحة'),
                         circles: negCircles, noneRings, states: c.querySelectorAll('.m-packed__states li').length}; }""")
        page.locator("#packed-detail .edge-grid").nth(1).screenshot(path=str(SHOTS / "17-packed-edge-states-390.png"))
        check("A20 دائرة موجبة واحدة؛ أربعة صفوف حالة منفصلة للصفر والمجهول وغير المتاح والسالب، بلا حلقات",
              edge["unknown"] and edge["unavailable"] and edge["zero"] and edge["neg"]
              and edge["circles"] == 1 and edge["noneRings"] == 0 and edge["states"] == 4, str(edge))

        # ==== A21: حالات المقياس (نظير المقام — اتساق مع دلالة C2) ====
        scale = page.evaluate(
            """() => { const gs = document.querySelectorAll('#packed-detail .edge-grid')[2];
                 const charts = [...gs.querySelectorAll('.m-chart--packed')];
                 const zeroMax = charts[0], negMax = charts[1], noMax = charts[2];
                 const zerr = zeroMax.querySelector('.m-chart__scale-error');
                 const nerr = negMax.querySelector('.m-chart__scale-error');
                 return {zeroErr: !!zerr && zerr.textContent.includes('تعارض'),
                         zeroNoCircles: zeroMax.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)').length,
                         negErr: !!nerr && nerr.textContent.includes('غير صالح'),
                         negNoCircles: negMax.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)').length,
                         noMaxCircles: noMax.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)').length,
                         noMaxErr: !noMax.querySelector('.m-chart__scale-error')}; }""")
        page.locator("#packed-detail .edge-grid").nth(2).screenshot(path=str(SHOTS / "17b-scale-states-390.png"))
        check("A21 المقياس المعلن: صفر مع موجبة تعارض صريح بلا دوائر · سالب غير صالح صريح · الغائب يشتق من أكبر قيمة (البديل الموثق) — بلا سقوط صامت",
              scale["zeroErr"] and scale["zeroNoCircles"] == 0 and scale["negErr"]
              and scale["negNoCircles"] == 0 and scale["noMaxCircles"] == 2 and scale["noMaxErr"], str(scale))

        # ==== A22: صافي سالب — رقم وحالة لا دائرة ====
        neg = page.evaluate(
            """() => { const d = document.getElementById('net-negative');
                 return {negNum: !!d.querySelector('.m-stat__num--negative') &&
                              d.querySelector('.m-stat__num--negative').textContent.includes('-12,400'),
                         noBubble: d.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)').length === 2,
                         badge: d.querySelector('.m-badge') && d.querySelector('.m-badge').textContent.includes('خسارة')}; }""")
        page.locator("#net-negative").screenshot(path=str(SHOTS / "17c-negative-net-390.png"))
        check("A22 صافي سالب: رقم بعلامته وحالة «خسارة» — لا دائرة سالبة مضللة ولا معادلة داخل المكوّن",
              neg["negNum"] and neg["noBubble"] and neg["badge"], str(neg))

        # ==== A23: توكنات لا قيم صريحة (فحص عيّنة) ====
        tokens = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const b = r.querySelector('[data-next]');
                 const s = r.querySelector('.m-carousel__status');
                 const card = r.querySelector('.m-carousel__card');
                 const toggle = r.querySelector('[data-card-expand]');
                 return {btnBorder: getComputedStyle(b).borderColor,
                         statusColor: getComputedStyle(s).color,
                         cardRadius: getComputedStyle(card).borderRadius,
                         trackDur: getComputedStyle(r.querySelector('[data-track]')).transitionDuration,
                         toggleRadius: toggle ? getComputedStyle(toggle).borderRadius : null}; }""")
        check("A23 توكنات الأسس: حد الزر #71868B ونص المؤشر #50656A وانحناء البطاقة 24px وزمن الانتقال 0.18s وزر التوسعة بكبسولة التوكن 999px",
              tokens["btnBorder"] == "rgb(113, 134, 139)" and tokens["statusColor"] == "rgb(80, 101, 106)"
              and tokens["cardRadius"] == "24px" and "0.18" in tokens["trackDur"]
              and tokens["toggleRadius"] == "999px", str(tokens))

        # ==== A24: إثبات قابلية التعديل (تعديل → انعكاس → استعادة) ====
        edit = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const slide = r.querySelectorAll('[data-carousel-slide]')[0];
                 const wBefore = slide.getBoundingClientRect().width;
                 r.style.setProperty('--_peek', '60px');
                 const wAfter = slide.getBoundingClientRect().width;
                 r.style.setProperty('--_peek', '24px');
                 const wBack = slide.getBoundingClientRect().width;
                 const s1 = r.querySelectorAll('[data-carousel-slide]')[1];
                 const lblBefore = s1.getAttribute('aria-label');
                 s1.setAttribute('data-card-label', 'اسم معدّل للفحص');
                 MicroCarousel.goTo(r, 1);
                 const lblAfter = s1.getAttribute('aria-label');
                 s1.setAttribute('data-card-label', 'الطلبات حسب الحالة');
                 MicroCarousel.goTo(r, 0);
                 const lblBack = s1.getAttribute('aria-label');
                 /* قياس القطر على رسم معزول بمقياس معلن: 9000 → 4500 (نصف) → القطر × √0.5 */
                 const host = document.createElement('div');
                 host.innerHTML = '<div class="m-chart m-chart--bubbles m-chart--packed" data-chart-packed data-rmax="40" data-max="9000">' +
                   '<ul class="m-chart__data" hidden><li data-series="a" data-label="قيمة" data-value="9000"></li></ul>' +
                   '<div class="m-chart__plot" data-plot></div></div>';
                 document.body.appendChild(host);
                 const chart = host.querySelector('[data-chart-packed]');
                 MicroPacked.render(chart);
                 const dBefore = parseFloat(chart.querySelector('.m-bubble__circle').style.width);
                 chart.querySelector('[data-series="a"]').setAttribute('data-value', '4500');
                 MicroPacked.render(chart);
                 const dAfter = parseFloat(chart.querySelector('.m-bubble__circle').style.width);
                 chart.querySelector('[data-series="a"]').setAttribute('data-value', '9000');
                 MicroPacked.render(chart);
                 const dBack = parseFloat(chart.querySelector('.m-bubble__circle').style.width);
                 /* تعديل نص زر التوسعة عبر سمات الملصقين — يعكس فورًا */
                 const tbtn = r.querySelector('[data-card-expand]');
                 tbtn.setAttribute('data-label-closed', 'تفاصيل معدّلة');
                 const txt = tbtn.querySelector('[data-card-expand-text]').textContent;
                 tbtn.setAttribute('data-label-closed', 'عرض التفاصيل');
                 host.remove();
                 return {wBefore, wAfter, wBack, lblBefore, lblAfter, lblBack,
                         dBefore, dAfter, dBack, txt}; }""")
        page.wait_for_timeout(250)
        diameterOk = abs(edit["dAfter"] - edit["dBefore"] * (0.5 ** 0.5)) < 1.5
        check("A24 إثبات التعديل: --_peek 24→60 يضيّق البطاقة ثم يُستعاد · data-card-label ينعكس على aria-label · data-value نصفها يقلّص القطر بتناسب √ ثم يُستعاد · ملصقا زر التوسعة ينعكسان على النص",
              edit["wAfter"] < edit["wBefore"] and edit["wBack"] == edit["wBefore"]
              and edit["lblAfter"].startswith("اسم معدّل للفحص") and edit["lblBack"].startswith("الطلبات حسب الحالة")
              and diameterOk,
              str(edit))
        log(f"      قياس القطر: {edit['dBefore']} → {edit['dAfter']} (√0.5 المتوقع {edit['dBefore'] * (0.5 ** 0.5):.1f}) → {edit['dBack']}")

        # ==== لقطة عامة كاملة ====
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ==== B1: العروض الثلاثة بلا تمرير أفقي + لقطات 320/390/430 (compact) ====
        for width in (320, 390, 430):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            pg.evaluate("() => document.fonts.ready")
            pg.wait_for_timeout(300)
            ov = pg.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
            check(f"B1 {width}px بلا تمرير أفقي للصفحة", ov["sw"] <= ov["cw"], str(ov))
            # B3: عرض الشريحة = viewport − 2×(peek+gap) والنشطة متمركزة
            geo = pg.evaluate(
                """() => { const r = document.querySelector('#main-carousel');
                     const vp = r.querySelector('[data-viewport]');
                     const s0 = r.querySelectorAll('[data-carousel-slide]')[0];
                     const b = s0.getBoundingClientRect(), vb = vp.getBoundingClientRect();
                     return {w: b.width, expected: vb.width - 72, off: Math.abs((b.left + b.width/2) - (vb.left + vb.width/2))}; }""")
            check(f"B3 {width}px: عرض الشريحة = viewport − 2×(24+12) والنشطة متمركزة (فرق ≤ 1px)",
                  abs(geo["w"] - geo["expected"]) <= 2 and geo["off"] <= 1, str(geo))
            # C8: compact عند كل عرض — البطاقة المغلقة مضغوطة بلا قصّ ولا فراغ زائد
            comp = pg.evaluate(
                """() => { const r = document.querySelector('#main-carousel');
                     const card = r.querySelector('[data-current="true"] .m-carousel__card');
                     const b = card.getBoundingClientRect();
                     const packedVals = [...document.querySelectorAll('#packed-detail .packed-demo .m-bubble__circle')]
                       .map(x => { const v = x.querySelector('.m-bubble__value');
                         const vr = v ? v.getBoundingClientRect() : null; const cr = x.getBoundingClientRect();
                         return vr ? {inX: vr.left >= cr.left && vr.right <= cr.right,
                                      inY: vr.top >= cr.top && vr.bottom <= cr.bottom} : null; });
                     return {h: Math.round(b.height), noClip: card.scrollHeight <= card.clientHeight + 2,
                             vals: packedVals}; }""")
            pg.locator("#main-carousel").screenshot(path=str(SHOTS / f"18-width-{width}.png"))
            check(f"C8 {width}px: البطاقة المغلقة مضغوطة (≈220–280، حد مرن ≤ 340) بلا قصّ ولا سطح فارغ طويل · قيم الدوائر (6-أ) داخل حدود دوائرها",
                  comp["h"] <= 340 and comp["noClip"]
                  and all(v and v["inX"] and v["inY"] for v in comp["vals"]), str(comp))
            c.close()

        # ==== B2: تكبير النص 200% — النشط يلفّ ولا يقصّ (Range داخل viewport) ====
        for width in (320, 390):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            pg.evaluate("() => document.fonts.ready")
            pg.click('[data-lab="text-zoom"]')
            pg.wait_for_timeout(400)
            z = pg.evaluate(
                """() => { const t = document.getElementById('text-zoom-target');
                     const r = t.querySelector('[data-carousel]');
                     const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                     const slide = r.querySelector('[data-current="true"]');
                     const title = slide.querySelector('.card-title');
                     const rng = document.createRange(); rng.selectNodeContents(title);
                     const rects = [...rng.getClientRects()];
                     const inX = rects.every(rc => rc.left >= vp.left - 1 && rc.right <= vp.right + 1);
                     const card = slide.querySelector('.m-carousel__card');
                     const status = r.querySelector('[data-status]');
                     const stR = status.getBoundingClientRect();
                     return {font: getComputedStyle(title).fontSize, lines: rects.length, inX,
                             cardNoHScroll: card.scrollWidth <= card.clientWidth + 1,
                             statusVisible: stR.width > 0}; }""")
            pg.locator("#lab-zoom").screenshot(path=str(SHOTS / f"11-zoom-200-{width}.png"))
            check(f"B2 {width}px تكبير 200%: العنوان مضاعف ويُلفّ أسطره داخل viewport بلا قصّ أفقي والبطاقة بلا تمرير داخلي والمؤشر ظاهر",
                  z["font"] in ("32px", "36px") and z["inX"] and z["cardNoHScroll"] and z["statusVisible"], str(z))
            pg.click('[data-lab="text-zoom"]')
            c.close()

        # ==== المحتوى الصعب: نص طويل وأرقام مختلطة (لقطات) — لا قصّ مع compact ====
        page.locator("#lab-content .m-carousel").first.screenshot(path=str(SHOTS / "11b-long-arabic-390.png"))
        long_ok = page.evaluate(
            """() => { const r = document.querySelector('#lab-content [data-carousel]');
                 const slide = r.querySelector('[data-current="true"]');
                 const card = slide.querySelector('.m-carousel__card');
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const cb = card.getBoundingClientRect();
                 return {withinVp: cb.left >= vp.left - 1 && cb.right <= vp.right + 1,
                         noClip: card.scrollHeight <= card.clientHeight + 2,
                         mixed: document.querySelector('#lab-content').textContent.includes('ORD-2419') &&
                                document.querySelector('#lab-content').textContent.includes('1,240.50')}; }""")
        page.locator("#lab-content").screenshot(path=str(SHOTS / "12-mixed-amounts-390.png"))
        check("B4 نص طويل: البطاقة النشطة كاملة داخل القناع وارتفاعها يتبع محتواها بلا قصّ عمودي · الأرقام والمبالغ المختلطة ظاهرة",
              long_ok["withinVp"] and long_ok["noClip"] and long_ok["mixed"], str(long_ok))

        # ==== D1: تقليل الحركة (تفضيل فعلي) — الانتقال فوري والموضع صحيح ====
        c = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        pg.evaluate("() => document.fonts.ready")
        pg.wait_for_timeout(300)
        rm = pg.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const dur = getComputedStyle(r.querySelector('[data-track]')).transitionDuration;
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 MicroCarousel.next(r);
                 const s1 = r.querySelectorAll('[data-carousel-slide]')[1].getBoundingClientRect();
                 return {dur, offImmediately: Math.abs((s1.left + s1.width/2) - (vp.left + vp.width/2)),
                         status: r.querySelector('[data-status]').textContent}; }""")
        pg.locator("#main-carousel").screenshot(path=str(SHOTS / "13-reduced-motion-390.png"))
        check("D1 تقليل الحركة (تفضيل Playwright فعلي): مدة الانتقال 0s والموضع النهائي فوري عند next والمؤشر واضح",
              rm["dur"] == "0s" and rm["offImmediately"] <= 1 and rm["status"] == "البطاقة 2 من 3", str(rm))
        c.close()

        # ==== B5: عرض أكبر مناسب للمعاينة (768) — لا سطح طويل فارغ ====
        cw = browser.new_context(viewport={"width": 768, "height": 900})
        pgw = cw.new_page()
        pgw.goto(board)
        pgw.wait_for_load_state("networkidle")
        pgw.evaluate("() => document.fonts.ready")
        pgw.wait_for_timeout(300)
        w768 = pgw.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const s0 = r.querySelectorAll('[data-carousel-slide]')[0].getBoundingClientRect();
                 const card = r.querySelector('[data-current="true"] .m-carousel__card');
                 return {sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth,
                         off: Math.abs((s0.left + s0.width/2) - (vp.left + vp.width/2)),
                         cardH: Math.round(card.getBoundingClientRect().height),
                         noClip: card.scrollHeight <= card.clientHeight + 2}; }""")
        pgw.locator("#overview").screenshot(path=str(SHOTS / "19-wide-768.png"))
        check("B5 عرض 768: بلا تمرير أفقي والنشطة متمركزة والبطاقة تتبع محتواها (لا سطح طويل فارغ ولا قصّ)",
              w768["sw"] <= w768["cw"] and w768["off"] <= 1 and w768["cardH"] <= 340 and w768["noClip"], str(w768))
        cw.close()

        # ==== EX: المثال المستقل بلا board.* ====
        ex = f"{base}/previews/carousel/example-usage.html"
        pex = ctx.new_page()
        ex_err = []
        pex.on("pageerror", lambda e: ex_err.append(str(e)))
        pex.goto(ex)
        pex.wait_for_load_state("networkidle")
        pex.wait_for_timeout(2400)
        ex_res = pex.evaluate("() => document.getElementById('results').textContent")
        check("EX مثال مستقل carousel: 0 فشل بلا أخطاء (20 فحصًا مدمجًا: بنية وحارس أسهم وتوسعة ودوائر بقيم داخلها وسالب مع data-display)",
              ex_res.count("FAIL ") == 0 and ex_res.count("PASS ") >= 15 and not ex_err,
              ex_res.splitlines()[0] if ex_res else "لا نتائج")
        pex.close()

        # ==== A25: بلا أخطاء متراكمة بعد كل التفاعلات (سحب/مفاتيح/نقاط/توسعة/تعديلات) ====
        check("A25 لا أخطاء متراكمة في الكونسول/الصفحة بعد كل الفحوص والتفاعلات", len(errors) == 0,
              "; ".join(errors[:2]))

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
    import argparse
    _ap = argparse.ArgumentParser()
    _ap.add_argument("--out", default="", help="دليل إخراج معزول (افتراضي: reviews/CAROUSEL التاريخي)")
    _ap.add_argument("--port", type=int, default=0, help="منفذ الخادم (0 تلقائي؛ REPAIR-R1: 4400-4419)")
    _a = _ap.parse_args()
    main(Path(_a.out).resolve() if _a.out else None, _a.port)
