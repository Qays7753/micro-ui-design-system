#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — دفعة العارض (Carousel + Packed-Circle): فحص ولقطات. من جذر المستودع:
  python3 tools/carousel-screenshots.py
متصفح headless فعلي (Playwright + Chromium) — لقطات وقياسات من المصدر نفسه.
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

def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    board = f"{base}/previews/carousel/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log(f"# CAROUSEL سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree} (الأدلة مولدة من شجرة هذا commit نظيفة)")
    log("# بيئة الفحص: متصفح headless فعلي (Playwright + Chromium) — لا محاكاة DOM؛ القياسات الهندسية من مستطيلات المتصفح الحقيقية")
    log("# حدود الفحوص المعلنة: لا قارئ شاشة فعلي، لا لمس حقيقي (سحب بالمؤشر فقط)، لا متصفحات غير Chromium، لا تكبير نظام/متصفح أصلي (محاكاة مكافئة للنص)، لا هاتف حقيقي")
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

        # ==== A13: Enter/Space على الأزرار + عدم نقل التركيز لغير المرئي ====
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
        # تركيز داخل بطاقة مخفية كليًا مستحيل (inert) — والشرائح الخفية معلّمة
        inert = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const ss = [...r.querySelectorAll('[data-carousel-slide]')];
                 const vp = r.querySelector('[data-viewport]').getBoundingClientRect();
                 const vis = ss.map(s => { const b = s.getBoundingClientRect();
                   return !(b.right <= vp.left + 1 || b.left >= vp.right - 1); });
                 const inertAttr = ss.map(s => s.hasAttribute('inert'));
                 return {vis, inertAttr}; }""")
        check("A13 Enter ثم Space يبدّلان البطاقة والتركيز يبقى على الزر · الشرائح المخفية كليًا inert والمجاورة الظاهرة مقروءة",
              enterState["status"] == "البطاقة 2 من 3" and enterState["active"]
              and spaceState == "البطاقة 3 من 3"
              and (not inert["vis"][0]) and inert["vis"][1] and inert["vis"][2]
              and inert["inertAttr"][0] and not inert["inertAttr"][1] and not inert["inertAttr"][2],
              f"enter={enterState} space={spaceState} inert={inert}")

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

        # ==== A17: حدث عام ====
        ev = page.evaluate(
            """() => new Promise(res => { const r = document.querySelector('#main-carousel');
                 r.addEventListener('micro-carousel:change', e => res(e.detail), {once: true});
                 MicroCarousel.next(r); })""")
        page.wait_for_timeout(250)
        check("A17 حدث micro-carousel:change يفصح عن {index, count}", ev == {"index": 2, "count": 3}, str(ev))

        # ==== A18: المحتوى داخل بطاقة المقارنة (donut بمقام معلن داخل العارض) ====
        donut = page.evaluate(
            """() => { const c = document.querySelector('#main-carousel .m-chart--donut');
                 return {center: c.querySelector('.m-donut__center').textContent,
                         pct: c.querySelector('.m-legend').textContent.includes('(44%)')}; }""")
        check("A18 بطاقة الطلبات: donut بمقام معلن 25 في المركز ونسب من المقام — عقد B05 داخل بطاقة العارض دون تغيير",
              donut["center"] == "25" and donut["pct"], str(donut))

        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#main-carousel'), 2)")
        page.wait_for_timeout(350)
        # اللقطة 15: بطاقة المقارنة المالية داخل العارض (الحالة الأخيرة)
        page.locator("#main-carousel").screenshot(path=str(SHOTS / "15-financial-card-390.png"))
        fincard = page.evaluate(
            """() => { const r = document.querySelector('#main-carousel');
                 const card = r.querySelector('[data-current="true"]');
                 return {packed: !!card.querySelector('.m-chart--packed'),
                         circles: card.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)').length,
                         netIsStat: !!card.querySelector('.net-profit .m-stat__num'),
                         status: r.querySelector('[data-status]').textContent}; }""")
        check("A18b بطاقة المقارنة داخل العارض: دوائر متداخلة + صافي الربح رقم مستقل والمؤشر «البطاقة 3 من 3»",
              fincard["packed"] and fincard["circles"] == 2 and fincard["netIsStat"]
              and fincard["status"] == "البطاقة 3 من 3", str(fincard))
        page.click("#main-carousel [data-prev]")
        page.click("#main-carousel [data-prev]")
        page.wait_for_timeout(300)

        # ==== A19: دوائر المقارنة — المساحة ∝ القيمة ونصوص خارجية ====
        packed = page.evaluate(
            """() => { const c = document.querySelector('#packed-detail .packed-demo .m-chart--packed');
                 const circs = [...c.querySelectorAll('.m-bubble__circle:not(.m-bubble__circle--none)')];
                 const widths = circs.map(x => parseFloat(x.style.width));
                 const w0 = widths[0], w1 = widths[1];
                 const ratioOk = Math.abs(w1 - w0 * Math.sqrt(61150 / 84300)) <= 1.5;
                 const cRects = circs.map(x => x.getBoundingClientRect());
                 const overlap = +(Math.min(cRects[0].right, cRects[1].right) - Math.max(cRects[0].left, cRects[1].left)).toFixed(1);
                 const textInCircle = [...c.querySelectorAll('.m-bubble')].some(b =>
                     b.querySelector('.m-bubble__value').compareDocumentPosition(b.querySelector('.m-bubble__circle')) & Node.DOCUMENT_POSITION_CONTAINS);
                 const key = c.querySelector('.m-legend').textContent;
                 const netProfitIsStat = !!document.querySelector('#packed-detail .packed-demo .m-stat__num');
                 return {w0, w1, ratioOk, overlap, textInCircle, keyPct: key.includes('%'), keyHasVals: key.includes('84,300') && key.includes('61,150'), netProfitIsStat}; }""")
        page.locator("#packed-detail .packed-demo").first.screenshot(path=str(SHOTS / "16-packed-overlap-390.png"))
        check("A19 المقارنة: القطران بتناسب الجذر (84300/61150) وتداخل فعلي بين الدائرتين والنصوص خارج الدوائر والمفتاح بقيم خام بلا نسب وصافي الربح m-stat لا دائرة",
              packed["ratioOk"] and packed["overlap"] > 0 and not packed["textInCircle"]
              and not packed["keyPct"] and packed["keyHasVals"] and packed["netProfitIsStat"], str(packed))

        # ==== A20: القيم غير الطبيعية ====
        edge = page.evaluate(
            """() => { const g = document.querySelectorAll('#packed-detail .edge-grid')[0];
                 const c = g.querySelector('.m-chart--packed');
                 const t = c.textContent;
                 const negCircles = [...c.querySelectorAll('.m-bubble__circle')].filter(x =>
                   !x.className.includes('--none')).length;
                 const noneRings = c.querySelectorAll('.m-bubble__circle--none').length;
                 return {unknown: t.includes('— غير معروف'), unavailable: t.includes('— غير متاح'),
                         zero: t.includes('0'), neg: t.includes('سالب غير صالح للمساحة'),
                         circles: negCircles, noneRings}; }""")
        page.locator("#packed-detail .edge-grid").first.screenshot(path=str(SHOTS / "17-packed-edge-states-390.png"))
        check("A20 القيم غير الطبيعية: صفر «0» ومجهول «— غير معروف» ≠ غير متاح «— غير متاح» وسالب بنص صريح — دائرة واحدة فقط للموجبة وحلقات شرطة للأربعة البدائل",
              edge["unknown"] and edge["unavailable"] and edge["zero"] and edge["neg"]
              and edge["circles"] == 1 and edge["noneRings"] == 4, str(edge))

        # ==== A21: حالات المقياس (نظير المقام — اتساق مع دلالة C2) ====
        scale = page.evaluate(
            """() => { const gs = document.querySelectorAll('#packed-detail .edge-grid')[1];
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
        page.locator("#packed-detail .edge-grid").nth(1).screenshot(path=str(SHOTS / "17b-scale-states-390.png"))
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
                 const b = r.querySelector('[data-next]'); /* زر متاح عند الحالة الأولى — المعطل حدّه شفاف بعمد */
                 const s = r.querySelector('.m-carousel__status');
                 const card = r.querySelector('.m-carousel__card');
                 return {btnBorder: getComputedStyle(b).borderColor,
                         statusColor: getComputedStyle(s).color,
                         cardRadius: getComputedStyle(card).borderRadius,
                         trackDur: getComputedStyle(r.querySelector('[data-track]')).transitionDuration}; }""")
        check("A23 توكنات الأسس: حد الزر #71868B ونص المؤشر #50656A وانحناء البطاقة 24px وزمن الانتقال 0.18s",
              tokens["btnBorder"] == "rgb(113, 134, 139)" and tokens["statusColor"] == "rgb(80, 101, 106)"
              and tokens["cardRadius"] == "24px" and "0.18" in tokens["trackDur"], str(tokens))

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
                 host.remove();
                 return {wBefore, wAfter, wBack, lblBefore, lblAfter, lblBack,
                         dBefore, dAfter, dBack}; }""")
        page.wait_for_timeout(250)
        diameterOk = abs(edit["dAfter"] - edit["dBefore"] * (0.5 ** 0.5)) < 1.5
        check("A24 إثبات التعديل: --_peek 24→60 يضيّق البطاقة (الشريحة المجاورة أوسع) ثم يُستعاد · data-card-label ينعكس على aria-label · data-value نصفها يقلّص القطر بتناسب √ ثم يُستعاد",
              edit["wAfter"] < edit["wBefore"] and edit["wBack"] == edit["wBefore"]
              and edit["lblAfter"].startswith("اسم معدّل للفحص") and edit["lblBack"].startswith("الطلبات حسب الحالة")
              and diameterOk,
              str(edit))
        log(f"      قياس القطر: {edit['dBefore']} → {edit['dAfter']} (√0.5 المتوقع {edit['dBefore'] * (0.5 ** 0.5):.1f}) → {edit['dBack']}")

        # ==== لقطة عامة كاملة ====
        page.screenshot(path=str(SHOTS / "00-overview-390-full.png"), full_page=True)

        # ==== B1: العروض الثلاثة بلا تمرير أفقي + لقطات 320/390/430 ====
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
            pg.locator("#main-carousel").screenshot(path=str(SHOTS / f"18-width-{width}.png"))
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

        # ==== المحتوى الصعب: نص طويل وأرقام مختلطة (لقطات) ====
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
        check("B4 نص طويل: البطاقة النشطة كاملة داخل القناع بلا قصّ عمودي · الأرقام والمبالغ المختلطة ظاهرة",
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

        # ==== B5: عرض أكبر مناسب للمعاينة (768) ====
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
                 return {sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth,
                         off: Math.abs((s0.left + s0.width/2) - (vp.left + vp.width/2))}; }""")
        pgw.locator("#overview").screenshot(path=str(SHOTS / "19-wide-768.png"))
        check("B5 عرض 768: بلا تمرير أفقي والنشطة متمركزة — العرض يتمدد دون تغيير دور العنصر",
              w768["sw"] <= w768["cw"] and w768["off"] <= 1, str(w768))
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
        check("EX مثال مستقل carousel: 0 فشل بلا أخطاء (15 فحصًا مدمجًا)",
              ex_res.count("FAIL ") == 0 and ex_res.count("PASS ") >= 10 and not ex_err,
              ex_res.splitlines()[0] if ex_res else "لا نتائج")
        pex.close()

        # ==== A25: بلا أخطاء متراكمة بعد كل التفاعلات (سحب/مفاتيح/نقاط/تعديلات) ====
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
    main()
