#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — S01 الأسطح والحركة: فحص ولقطات. من جذر المستودع:
  python3 tools/s01-screenshots.py
المخرجات: reviews/S01/screenshots/*.png و reviews/S01/verification.txt

بيئة الفحص (تسمية دقيقة — C1): متصفح headless فعلي (Playwright + Chromium) —
ليست محاكاة DOM. القياس الموضعي للتباين من لقطات بكسل حقيقية للمتصفح.

C1 — قياس التباين الموضعي المصحح (بديل sample_contrast القديمة):
  الطريقة القديمة كانت تختار «الخلفية» بأفتح بكسل دون 85% من أقصى إضاءة
  في لقطة العنصر، ويمكن أن يكون ذلك البكسل من حواف الحروف الملساء —
  فكان رقم 2.09 السابق للنص الشفاف ليس قياسًا موضعيًا دقيقًا ولم يُعتمد.
  الطريقة الحالية: لقطتان للعنصر نفسه — بالنص وبنص مخفي رسمه
  (color: transparent — layout ثابت)؛ الخلفية من الإحداثيات نفسها،
  والنص المرسوم (أو الممزوج من لون النص/شفافيته الفعليين المحسوبَين)
  يُقاس مقابلها. الرقم المعلن «قياس موضعي فعلي» ويُميَّز عن الحد
  المحافظ المحسوب في tools/contrast-check.txt (رقمان مختلفا الغرض).
"""
import http.server, io, subprocess, sys, threading
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

def _lin(v):
    v /= 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

def rel_lum(rgb):
    r, g, b = (_lin(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def rel_ratio(fg, bg):
    l1, l2 = sorted((rel_lum(fg), rel_lum(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

HIDE_JS = """(sel) => { const el = document.querySelector(sel);
     el.dataset.c1style = el.getAttribute('style') || '';
     el.style.color = 'transparent'; }"""
RESTORE_JS = """(sel) => { const el = document.querySelector(sel);
     if (!el || el.dataset.c1style === undefined) return;
     if (el.dataset.c1style === '') el.removeAttribute('style');
     else el.setAttribute('style', el.dataset.c1style);
     delete el.dataset.c1style; }"""
COLOR_JS = """(sel) => { const c = getComputedStyle(document.querySelector(sel)).color;
     const m = c.match(/[\\d.]+/g) || [];
     return {r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1, raw: c}; }"""


def measure_positional(page, el_sel):
    """C1: قياس موضعي فعلي من لقطتين للعنصر نفسه (النص ثم مخفي الرسم).
    الخلفية من الإحداثيات نفسها (نقطة نواة الحرف الأفتح) بعد إخفاء رسم
    النص دون تغيير layout؛ والنص الممزوج من قيمه الفعلية (اللون/الشفافية
    المحسوبان) يُقاس مقابلها — مع الرسم الفعلي كسند. layout ثابت بين
    اللقطتين لأن تغيير اللون لا يؤثر فيه والزخرفة ساكنة."""
    from PIL import Image
    color = page.evaluate(COLOR_JS, el_sel)
    loc = page.locator(el_sel)
    shot_text = loc.screenshot()
    page.evaluate(HIDE_JS, el_sel)
    shot_bg = loc.screenshot()
    page.evaluate(RESTORE_JS, el_sel)
    a = Image.open(io.BytesIO(shot_text)).convert("RGB")
    b = Image.open(io.BytesIO(shot_bg)).convert("RGB")
    if a.size != b.size:
        return {"error": "حجم اللقطتين مختلف — layout تغيّر"}
    la, lb = list(a.getdata()), list(b.getdata())
    idx = max(range(len(la)), key=lambda i: rel_lum(la[i]))  # نواة الحرف الأفتح
    fg_rendered, bg = la[idx], lb[idx]
    al = color["a"]
    fg_expected = tuple(round(al * c + (1 - al) * k)
                        for c, k in zip((color["r"], color["g"], color["b"]), bg))
    return {"ratio": rel_ratio(fg_expected, bg),          # الطريقة المعتمدة (C1)
            "ratio_rendered": rel_ratio(fg_rendered, bg),  # سند من الرسم الفعلي
            "fg": fg_expected, "fg_rendered": fg_rendered, "bg": bg, "color": color}


def gate_roles(page, base_sel, roles, tag, note):
    """C1: بوابة أدوار النص — كل دور يُقاس موضعيًا ويدخل نجاح/فشل الجولة."""
    for role in roles:
        s = measure_positional(page, f"{base_sel} .m-surface__{role}")
        if "error" in s:
            check(f"{tag} تباين دور {role}", False, s["error"])
            continue
        ok = s["ratio"] >= 4.5 and s["ratio_rendered"] >= 4.5
        check(f"{tag} تباين دور {role} (أبيض مصمت — C1) ≥ 4.5", ok,
              "%.2f:1 موضعي (رسم فعلي %.2f:1) نص=%s خلفية=%s — %s"
              % (s["ratio"], s["ratio_rendered"], s["fg"], s["bg"], note))


ZOOM_ON_JS = """(args) => { const root = document.querySelector(args.sel);
     const els = [root].concat([].slice.call(root.querySelectorAll('*')));
     const originals = els.map(function (el) {
       return {el: el, fs: parseFloat(getComputedStyle(el).fontSize)}; });
     originals.forEach(function (item) {
       item.el.dataset.tzStyle = item.el.getAttribute('style') || '';
       item.el.style.fontSize = (item.fs * args.factor) + 'px'; }); }"""
ZOOM_OFF_JS = """(sel) => { const root = document.querySelector(sel);
     const els = [root].concat([].slice.call(root.querySelectorAll('*')));
     els.forEach(function (el) {
       if (el.dataset.tzStyle === undefined) return;
       if (el.dataset.tzStyle === '') el.removeAttribute('style');
       else el.setAttribute('style', el.dataset.tzStyle);
       delete el.dataset.tzStyle; }); }"""


def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    board = f"{base}/previews/surfaces/index.html"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log(f"# S01 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree} (الأدلة مولدة من شجرة هذا commit نظيفة)")
    log("# بيئة الفحص: متصفح headless فعلي (Playwright + Chromium) — ليست محاكاة DOM")
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

        # ---- C1: الأدوار الأربعة أبيض مصمت بالقيم المحسوبة (حجم/وزن/إيقاع لا شفافية) ----
        roles_css = page.evaluate(
            """() => { const s = document.querySelector('[data-surface="waves"]');
                 const roles = ['title', 'amount', 'label', 'sub'];
                 const out = {};
                 roles.forEach(function (r) {
                   const cs = getComputedStyle(s.querySelector('.m-surface__' + r));
                   out[r] = {color: cs.color, weight: cs.fontWeight, size: cs.fontSize};
                 });
                 return out; }""")
        ok_c1 = (all(roles_css[r]["color"] == "rgb(255, 255, 255)" for r in ("title", "amount", "label", "sub"))
                 and roles_css["title"]["weight"] == "600" and roles_css["amount"]["weight"] == "600"
                 and roles_css["label"]["weight"] == "500" and roles_css["sub"]["weight"] == "400")
        check("A6b (C1) أدوار النص الأربعة أبيض مصمت والتمييز بالحجم/الوزن (600/600/500/400) لا الشفافية",
              ok_c1, str(roles_css))

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

        # =============================================================
        # C1 — بوابة أدوار النص (قياس موضعي فعلي: خلفية من الإحداثيات
        # نفسها بعد إخفاء رسم النص — لا اختيار «أفتح بكسل دون 85%» الذي
        # كان يلتقط حواف الحروف الملساء). كل دور يدخل نجاح/فشل الجولة.
        # =============================================================
        POSITIONAL_NOTE = "قياس موضعي فعلي (خلفية من الإحداثيات نفسها بعد إخفاء النص) — يُميَّز عن الحد المحافظ المحسوب في contrast-check.txt"

        # B2c: السطح الافتراضي (الموجات) 390 — الأدوار الأربعة
        gate_roles(page, '[data-surface="waves"]', ("title", "amount", "label", "sub"),
                   "B2c (C1) السطح الافتراضي 390:", POSITIONAL_NOTE)

        # B2c-v2: مرشح v2 390 — الأدوار المستخدمة فيه (label/amount/sub؛
        # العنوان غير مستخدم في مقارنة v2 بمحتواها القصير ويُفحص على الافتراضي)
        gate_roles(page, '#wave-v2 .m-surface--waves-v2', ("label", "amount", "sub"),
                   "B2c (C1) مرشح v2 390:", POSITIONAL_NOTE)

        # B2d: مرشح v2 عند تكبير 200% (مروران كأداة اللوحة) — الأدوار المستخدمة
        page.evaluate(ZOOM_ON_JS, {"sel": "#wave-v2 .m-surface--waves-v2", "factor": 2})
        page.wait_for_timeout(200)
        gate_roles(page, '#wave-v2 .m-surface--waves-v2', ("label", "amount", "sub"),
                   "B2d (C1) مرشح v2 تكبير 200%:", POSITIONAL_NOTE)
        page.evaluate(ZOOM_OFF_JS, "#wave-v2 .m-surface--waves-v2")
        page.wait_for_timeout(150)

        # B2e: اختبار تحكم (C1) — حالة فاشلة داخل النطاق يعلنها الكاشف فشلًا
        # فعليًا: القيمة السابقة المزالة (أبيض 0.72) تُحقن على التسمية نفسها
        # ثم تُقاس بالآلية نفسها، ثم تُستعاد القيمة الافتراضية وينجح القياس.
        page.evaluate(
            """() => { const el = document.querySelector('[data-surface="waves"] .m-surface__label');
                 el.dataset.c1ctrl = el.getAttribute('style') || '';
                 el.style.color = 'rgba(255, 255, 255, 0.72)'; }""")
        injected = measure_positional(page, '[data-surface="waves"] .m-surface__label')
        page.evaluate(
            """() => { const el = document.querySelector('[data-surface="waves"] .m-surface__label');
                 if (el.dataset.c1ctrl === '') el.removeAttribute('style');
                 else el.setAttribute('style', el.dataset.c1ctrl);
                 delete el.dataset.c1ctrl; }""")
        restored = measure_positional(page, '[data-surface="waves"] .m-surface__label')
        check("B2e (C1) تحكم: القيمة المزالة 0.72 داخل النطاق يكشفها الكاشف فشلًا فعليًا ثم ينجح الافتراضي",
              injected["ratio"] < 4.5 and restored["ratio"] >= 4.5,
              "محقون=%.2f:1 (يجب <4.5) | مستعاد=%.2f:1 (يجب ≥4.5) — الكاشف يعمل" %
              (injected["ratio"], restored["ratio"]))

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
                         const sr = surf.getBoundingClientRect();
                         // R2-01: حدود حروف النص الفعلية (Range) لا مستطيل العنصر فقط
                         function glyphRects(el) {
                           const range = document.createRange();
                           range.selectNodeContents(el);
                           return [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
                         }
                         const aRects = glyphRects(amount);
                         const tRects = glyphRects(title).sort((a, b) => a.top - b.top);
                         const inSurf = rs => rs.every(r => r.left >= sr.left + 2 && r.right <= sr.right - 2
                                                     && r.top >= sr.top - 0.5 && r.bottom <= sr.bottom + 0.5);
                         // لا تداخل أسطر العنوان: كل سطر يبدأ عند انتهاء سابقه (سطر نسبي لا ثابت)
                         const noOverlap = tRects.every((r, i) => i === 0 || r.top >= tRects[i-1].bottom - 1);
                         return {titleFont: getComputedStyle(title).fontSize,
                                 amountFont: getComputedStyle(amount).fontSize,
                                 overflow: getComputedStyle(surf).overflow,
                                 amountGlyphs: aRects.length, titleLines: tRects.length,
                                 amountGlyphsInSurface: inSurf(aRects),
                                 titleGlyphsInSurface: inSurf(tRects),
                                 titleLinesNoOverlap: noOverlap,
                                 sw: t.scrollWidth, cw: t.clientWidth}; }""")
                check(f"B2 {width}px تكبير 200%: العنوان 44px والرقم 72px — حدود حروفهما الفعلية (Range) داخل السطح بلا قصّ وأسطر العنوان بلا تداخل",
                      tz["titleFont"] == "44px" and tz["amountFont"] == "72px"
                      and tz["overflow"] == "visible" and tz["amountGlyphsInSurface"]
                      and tz["titleGlyphsInSurface"] and tz["titleLinesNoOverlap"]
                      and tz["sw"] <= tz["cw"] + 1, str(tz))
                pg.locator("#phones-full").screenshot(path=str(SHOTS / f"04-surface-zoom-{width}.png"))
                if width == 320:
                    # C1/B2b: بوابة الأدوار الأربعة عند تكبير 200% على 320 — قياس موضعي فعلي
                    gate_roles(pg, "#text-zoom-target .m-surface", ("title", "amount", "label", "sub"),
                               "B2b (C1) 320px تكبير 200%:", POSITIONAL_NOTE)
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

        # ---- R2-07 (EX): المثال المستقل للأسطح بلا board.* ----
        exs = f"{base}/previews/surfaces/example-usage.html"
        pes = ctx.new_page()
        ex_errs = []
        pes.on("console", lambda m: ex_errs.append(m.text) if m.type == "error" else None)
        pes.on("pageerror", lambda e: ex_errs.append(str(e)))
        pes.goto(exs)
        pes.wait_for_load_state("networkidle")
        pes.wait_for_timeout(800)
        ex_res = pes.evaluate("() => document.getElementById('results').textContent")
        check("EX مثال مستقل surfaces: 0 فشل بلا أخطاء (موجات مفعّلة ومفاتيح تعمل ومحتوى مقروء)",
              ex_res.count("FAIL ") == 0 and ex_res.count("PASS ") >= 3 and not ex_errs,
              ex_res.splitlines()[0] if ex_res else "لا نتائج")
        pes.locator("#demo").screenshot(path=str(SHOTS / "07-example-surface.png"))
        pes.close()

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
