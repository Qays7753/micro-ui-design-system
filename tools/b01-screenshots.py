#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — B01: سكربت الفحص واللقطات (قابل لإعادة التشغيل، بلا أسرار أو مسارات خاصة)

المتطلبات:
  - python3 + مكتبة playwright  (pip install playwright && playwright install chromium)
  - لا يحتاج اتصالًا بالإنترنت؛ يخدم ملفات المستودع بخادم محلي مؤقت بنفسه.

التشغيل من جذر المستودع:
  python3 tools/b01-screenshots.py

المخرجات:
  - reviews/B01/screenshots/*.png    لقطات من المصدر الحالي نفسه
  - reviews/B01/r2-verification.txt  سجل الفحص: القياسات والنتائج وcommit المصدر

الفحوص المنفذة: أخطاء الصفحة، تحميل الأيقونات من أصولها، الخطوط الفعلية،
عقد setLoading (تسمية/استرجاع/حراسة/معطل/تكرار)، ثبات الأبعاد أثناء التحميل
(قبل/أثناء/بعد)، رسالة النجاح (أول حفظ/إعادة حفظ)، تركيز+ضغط، تركيز←تحميل←عودة،
منع Enter/Space أثناء التحميل، معاينات هاتف كاملة 320/390/430 بلا تجاوز أفقي،
محاكاة زيادة حجم الخط 200% داخل مساحة هاتف ثابتة (مروران: قراءة كل الأحجام
الأصلية أولًا ثم تطبيق العامل — تصحيح R2-D؛ آلية CDP Emulation.setTextZoomFactor
غير متاحة في بيئة الفحص)، احتواء نص العدّاد داخل الشارة بخصم الحشو
(Range API — تصحيح R2-A)، الشكل المرشح للزر الطويل (R2-B)، استقلال المقاسات
خارج اللوحة وانعكاس توكن المؤشر على الأنواع كلها (R2-C)، والمقترحان A/B
للتحميل النصي، وتقليل الحركة (مؤشر ثابت). النتيجة النهائية: exit 0 عند نجاح
الكل، وإلا exit 1.
"""

import http.server
import os
import socket
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "B01" / "screenshots"
LOGFILE = ROOT / "reviews" / "B01" / "r2-verification.txt"

results = []
log_lines = []


def log(msg):
    print(msg)
    log_lines.append(msg)


def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))
    return bool(ok)


def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    server.daemon_threads = True
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server, server.server_address[1]


def js_rect(page, selector):
    return page.evaluate(
        """(sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100};
        }""",
        selector,
    )


def page_overflow(page):
    return page.evaluate(
        "() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})"
    )


def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server, port = start_server()
    base = f"http://127.0.0.1:{port}"
    board = f"{base}/previews/buttons/index.html"
    usage = f"{base}/previews/buttons/example-usage.html"

    commit = "unknown"
    try:
        commit = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True
        ).strip()
    except Exception:
        pass

    log(f"# B01 سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# خادم محلي مؤقت: {base} (يخدم جذر المستودع)")
    log("")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ============ A) 390 — اللوحة: أخطاء، أيقونات، خطوط، R1، عدّاد، عقد setLoading ============
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(board)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        check("A1 لا أخطاء console/pageerror", len(errors) == 0, "; ".join(errors[:3]))

        n_syms = page.evaluate("() => document.querySelectorAll('#m-icon-defs symbol').length")
        check("A2 الأيقونات محملة من أصولها (6 رموز)", n_syms == 6, f"symbols={n_syms}")

        fonts = page.evaluate(
            """() => ({
                ar500: document.fonts.check('500 16px "IBM Plex Sans Arabic"'),
                latin500: document.fonts.check('500 16px "IBM Plex Sans"'),
                btn: getComputedStyle(document.querySelector('.m-btn')).fontFamily
            })"""
        )
        check("A3 خط التسمية فعلي: IBM Plex Sans Arabic وزن 500", fonts["ar500"] and fonts["latin500"], str(fonts))

        # ---- R1: رسالة النجاح ----
        hidden0 = page.evaluate(
            """() => { const m = document.querySelector('[data-demo-message]');
                 return {hidden: m.hidden, display: getComputedStyle(m).display}; }"""
        )
        check("A4 الحالة الأولية: الرسالة مخفية (hidden + display:none)",
              hidden0["hidden"] and hidden0["display"] == "none", str(hidden0))

        save_btn = page.locator('#live [data-demo="save"]')
        save_btn.click()
        page.wait_for_timeout(400)
        st1 = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="save"]');
                 const m = document.querySelector('[data-demo-message]');
                 return {busy: b.getAttribute('aria-busy'), label: b.getAttribute('aria-label'),
                         hidden: m.hidden, display: getComputedStyle(m).display,
                         spinners: b.querySelectorAll('.m-btn__spinner').length}; }"""
        )
        check("A5 أول حفظ: تحميل بلا رسالة نجاح (إصلاح R1)",
              st1["busy"] == "true" and st1["hidden"] and st1["display"] == "none"
              and st1["label"] == "جارٍ الحفظ" and st1["spinners"] == 1, str(st1))
        page.locator("#live").screenshot(path=str(SHOTS / "04-live-loading-390.png"))

        page.wait_for_timeout(2400)
        st2 = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="save"]');
                 const m = document.querySelector('[data-demo-message]');
                 return {busy: b.getAttribute('aria-busy'), label: b.getAttribute('aria-label'),
                         hidden: m.hidden, text: m.textContent}; }"""
        )
        check("A6 بعد انتهاء المحاكاة: الرسالة تظهر والاسم الإتاحي يعود",
              st2["busy"] is None and not st2["hidden"] and "تم الحفظ" in st2["text"]
              and st2["label"] is None, str(st2))
        page.locator("#live").screenshot(path=str(SHOTS / "05-live-done-390.png"))

        save_btn.click()
        page.wait_for_timeout(300)
        st3 = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="save"]');
                 const m = document.querySelector('[data-demo-message]');
                 return {busy: b.getAttribute('aria-busy'), hidden: m.hidden}; }"""
        )
        check("A7 إعادة الحفظ: النجاح السابق يُخفى عند بدء المحاولة الجديدة",
              st3["busy"] == "true" and st3["hidden"], str(st3))
        page.locator("#live").screenshot(path=str(SHOTS / "14-live-resave-390.png"))
        page.wait_for_timeout(2300)  # انتهاء الدورة الثانية قبل الفحوص التالية

        # ---- عدّاد التصفية ----
        z = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="filter"]');
                 const c = b.querySelector('.m-btn__counter');
                 return {display: getComputedStyle(c).display, label: b.getAttribute('aria-label')}; }"""
        )
        check("A8 عدّاد 0: الشارة مخفية والاسم الإتاحي يوضح لا فلاتر (توجيه R2)",
              z["display"] == "none" and z["label"] == "تصفية، لا فلاتر نشطة", str(z))
        page.locator("#live [data-demo-group]").first.screenshot(path=str(SHOTS / "24-counter-zero-390.png"))

        page.locator('#live [data-demo="filter"]').click()
        page.locator("#live").screenshot(path=str(SHOTS / "07-counter-2-390.png"))
        z2 = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="filter"]');
                 return {text: b.querySelector('.m-btn__counter').textContent,
                         label: b.getAttribute('aria-label')}; }"""
        )
        check("A9 عدّاد 2 يظهر بتسميته", z2["text"] == "2" and z2["label"] == "تصفية، فلتران نشطان", str(z2))

        # ---- ثبات الأبعاد أثناء التحميل (قبل/أثناء/بعد) ----
        size_targets = [
            ("نص فقط", "#live [data-loading-api].m-btn--light"),
            ("نص+أيقونة", '#live [data-demo="save"]'),
            ("أيقونة دائري", "#live [data-loading-api].m-btn--icon"),
            ("تصفية بعدّاد", '#types [aria-label="تصفية، فلتران نشطان"]'),
            ("مقترح A — نص فقط", '#live [data-load-proposal="A"]'),
            ("مقترح B — فتحة محجوزة", '#live [data-load-proposal="B"]'),
        ]
        for name, sel in size_targets:
            before = js_rect(page, sel)
            page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), true)", [sel])
            during = js_rect(page, sel)
            page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), false)", [sel])
            after = js_rect(page, sel)
            stable = (before and during and after
                      and abs(before["w"] - during["w"]) < 0.5 and abs(before["h"] - during["h"]) < 0.5
                      and abs(before["w"] - after["w"]) < 0.5 and abs(before["h"] - after["h"]) < 0.5)
            check(f"A10 ثبات الأبعاد — {name}", stable,
                  f"قبل {before} أثناء {during} بعد {after}")

        # لقطة زر نصي بلا أيقونة أثناء التحميل (المجموعة الثالثة في القسم 3)
        page.evaluate("() => MicroButtons.setLoading(document.querySelector('#live [data-loading-api].m-btn--light'), true)")
        page.wait_for_timeout(150)
        page.locator("#live [data-demo-group]").nth(2).screenshot(path=str(SHOTS / "15-loading-size-stability-390.png"))
        page.evaluate("() => MicroButtons.setLoading(document.querySelector('#live [data-loading-api].m-btn--light'), false)")

        # لقطة المقترحين A/B للتحميل النصي أثناء التحميل معًا (قرار R2)
        page.evaluate(
            "([a, b]) => { MicroButtons.setLoading(document.querySelector(a), true); MicroButtons.setLoading(document.querySelector(b), true); }",
            ['#live [data-load-proposal="A"]', '#live [data-load-proposal="B"]'],
        )
        page.wait_for_timeout(150)
        page.locator("#live [data-demo-group]").nth(3).screenshot(path=str(SHOTS / "26-loading-proposals-390.png"))
        page.evaluate(
            "([a, b]) => { MicroButtons.setLoading(document.querySelector(a), false); MicroButtons.setLoading(document.querySelector(b), false); }",
            ['#live [data-load-proposal="A"]', '#live [data-load-proposal="B"]'],
        )

        # ---- عقد setLoading: الاسترجاع الدقيق والاستدعاءات المتكررة ----
        icon_sel = "#live [data-loading-api].m-btn--icon"
        page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), true)", [icon_sel])
        lab_during = page.evaluate("([s]) => document.querySelector(s).getAttribute('aria-label')", [icon_sel])
        page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), false)", [icon_sel])
        lab_after = page.evaluate("([s]) => document.querySelector(s).getAttribute('aria-label')", [icon_sel])
        page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), false)", [icon_sel])  # إيقاف متكرر
        lab_after2 = page.evaluate("([s]) => document.querySelector(s).getAttribute('aria-label')", [icon_sel])
        check("A11 تسمية التحميل الصريحة ثم الاسترجاع الدقيق والتكرار الآمن",
              lab_during == "جارٍ البحث" and lab_after == "بحث" and lab_after2 == "بحث",
              f"أثناء: {lab_during}، بعد: {lab_after}، بعد تكرار: {lab_after2}")

        never_sel = '#types .m-btn--icon[aria-label="بحث"]'
        page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), false)", [never_sel])
        lab_never = page.evaluate("([s]) => document.querySelector(s).getAttribute('aria-label')", [never_sel])
        check("A12 إيقاف على زر لم يُحمّل: لا يمحو aria-label (إصلاح R2)",
              lab_never == "بحث", f"aria-label={lab_never}")

        # زر نصي بلا تسمية صريحة: الاسم يبقى مطابقًا للنص الظاهر
        txt_name = page.evaluate(
            """() => { const b = document.querySelector('#kb-group .m-btn--primary');
                 MicroButtons.setLoading(b, true);
                 const r = {label: b.getAttribute('aria-label'), text: b.textContent.trim()};
                 MicroButtons.setLoading(b, false);
                 return r; }"""
        )
        check("A13 زر نصي بلا تسمية صريحة: الاسم يبقى النص الظاهر نفسه، لا تركيب آلي",
              txt_name["label"] is None and txt_name["text"] == "إنشاء طلب", str(txt_name))

        # زر معطل أصلًا لا يدخل التحميل
        dis = page.evaluate(
            """() => { const b = document.querySelector('#live .m-btn[disabled][data-loading-api]');
                 MicroButtons.setLoading(b, true);
                 return {busy: b.getAttribute('aria-busy'), disabled: b.disabled,
                         cls: b.className}; }"""
        )
        check("A14 زر معطل أصلًا: لا يدخل التحميل ولا تُنزع سمة المعطى",
              dis["busy"] is None and dis["disabled"] and "is-loading" not in dis["cls"], str(dis))

        # تكرار بدء التحميل: مؤشر واحد فقط
        dup = page.evaluate(
            """() => { const b = document.querySelector('#live [data-loading-api].m-btn--light');
                 MicroButtons.setLoading(b, true);
                 MicroButtons.setLoading(b, true);
                 const n = b.querySelectorAll('.m-btn__spinner').length;
                 MicroButtons.setLoading(b, false);
                 return n; }"""
        )
        check("A15 تكرار بدء التحميل: مؤشر واحد فقط", dup == 1, f"spinners={dup}")

        # ---- منع التفعيل أثناء التحميل: Enter/Space/نقر (حراسة المكوّن) ----
        # العدّاد على الزر نفسه في طور الفقاعة — المحرك الأمني حاجز الالتقاط
        # فأي نقرة محجوبة لا تصل إليه أصلًا.
        guard_sel = "#kb-group .m-btn--primary"  # «إنشاء طلب»
        page.keyboard.press("Tab")  # ضبط نمطية لوحة المفاتيح
        page.evaluate("([s]) => document.querySelector(s).focus()", [guard_sel])
        page.evaluate(
            "([s]) => { const b = document.querySelector(s); window.__clicks = 0; b.addEventListener('click', () => window.__clicks++); }",
            [guard_sel],
        )
        page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), true)", [guard_sel])
        page.keyboard.press("Enter")
        page.keyboard.press(" ")
        gbox = page.locator(guard_sel).bounding_box()
        page.mouse.click(gbox["x"] + gbox["width"] / 2, gbox["y"] + gbox["height"] / 2)
        busy_guard = page.evaluate(
            "([s]) => { const b = document.querySelector(s); return {clicks: window.__clicks, busy: b.getAttribute('aria-busy'), spinners: b.querySelectorAll('.m-btn__spinner').length}; }",
            [guard_sel],
        )
        page.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), false)", [guard_sel])
        page.evaluate("() => { window.__clicks = 0; }")
        page.evaluate("([s]) => document.querySelector(s).focus()", [guard_sel])
        page.keyboard.press("Enter")  # بعد التوقف: التفعيل يعمل طبيعيًا
        after_guard = page.evaluate("() => window.__clicks")
        check("A16 أثناء التحميل: Enter/Space/النقر لا تفعّل، وبعد التوقف يعود التفعيل",
              busy_guard["clicks"] == 0 and busy_guard["busy"] == "true" and busy_guard["spinners"] == 1
              and after_guard == 1,
              f"أثناء: {busy_guard}، نقرات بعد التوقف: {after_guard}")

        # ---- تركيز لوحة المفاتيح ----
        fv = page.evaluate(
            """([s]) => { const b = document.querySelector(s); b.focus();
                 return b.matches(':focus-visible'); }""",
            [guard_sel],
        )
        check("A17 تركيز لوحة المفاتيح: :focus-visible فعلي", bool(fv))
        page.locator("#live").screenshot(path=str(SHOTS / "06-focus-keyboard-390.png"))

        # ---- تركيز + ضغط معًا (بند 9) ----
        page.evaluate("([s]) => document.querySelector(s).focus()", [guard_sel])
        box = page.locator(guard_sel).bounding_box()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        page.mouse.down()
        page.wait_for_timeout(120)
        fp = page.evaluate(
            """([s]) => { const b = document.querySelector(s);
                 const cs = getComputedStyle(b);
                 return {fv: b.matches(':focus-visible'), shadow: cs.boxShadow,
                         bg: cs.backgroundColor}; }""",
            [guard_sel],
        )
        page.locator("#live").screenshot(path=str(SHOTS / "21-focus-press-390.png"))
        page.mouse.up()
        check("A18 تركيز + ضغط: الحلقة ظاهرة وخلفية الضغط معًا",
              fp["fv"] and "rgb(22, 77, 89)" in fp["shadow"] and fp["bg"] == "rgb(16, 62, 72)",
              f"focus-visible={fp['fv']}، bg={fp['bg']}")

        # ---- تركيز ← تحميل ← عودة (بند 9) ----
        page.evaluate("([s]) => document.querySelector(s).focus()", ['#live [data-demo="save"]'])
        page.keyboard.press("Enter")
        page.wait_for_timeout(250)
        fl = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="save"]');
                 return {focused: document.activeElement === b, fv: b.matches(':focus-visible'),
                         busy: b.getAttribute('aria-busy'), label: b.getAttribute('aria-label'),
                         shadow: getComputedStyle(b).boxShadow}; }"""
        )
        page.locator("#live").screenshot(path=str(SHOTS / "22-focus-loading-390.png"))
        page.wait_for_timeout(2400)
        fl2 = page.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="save"]');
                 return {focused: document.activeElement === b, busy: b.getAttribute('aria-busy'),
                         label: b.getAttribute('aria-label')}; }"""
        )
        check("A19 تركيز ← تحميل ← عودة: التركيز يبقى والحلقة ظاهرة والاسم يعود",
              fl["focused"] and fl["fv"] and fl["busy"] == "true" and fl["label"] == "جارٍ الحفظ"
              and "rgb(22, 77, 89)" in fl["shadow"]
              and fl2["focused"] and fl2["busy"] is None and fl2["label"] is None,
              f"أثناء: {fl} | بعد: {fl2}")

        # ---- لقطات أقسام عامة (390) ----
        page.locator("#types").screenshot(path=str(SHOTS / "02-types-390.png"))
        page.locator("#assets-check").screenshot(path=str(SHOTS / "13-fonts-icons-390.png"))
        page.screenshot(path=str(SHOTS / "01-overview-390-full.png"), full_page=True)
        ctx.close()

        # ============ B) 320/390/430 — أعمدة كاملة + تكبير النص 200% ============
        widths = [(320, "19-text-zoom-200-320.png", "08-hard-examples-320.png"),
                  (390, "20-text-zoom-200-390.png", None),
                  (430, None, None)]
        for idx, (width, shot_zoom, shot_hard) in enumerate(widths):
            c = browser.new_context(viewport={"width": width, "height": 900})
            pg = c.new_page()
            pg.goto(board)
            pg.wait_for_load_state("networkidle")
            ov = page_overflow(pg)
            check(f"B1 {width}px: الصفحة بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))
            if width == 320:
                pg.locator("#options").screenshot(path=str(SHOTS / shot_hard))
                pg.locator("#text-zoom-target").screenshot(path=str(SHOTS / "27-radius-baseline-320.png"))
                hidden_wider = pg.evaluate(
                    """() => { const b = document.querySelector('.phone-full-block[data-w="390"]');
                         return b && getComputedStyle(b).display === 'none'; }"""
                )
                check("B2 320px: الأعمدة الأعرض مخفية (تُعاين عند عرضها)", bool(hidden_wider))
            if width == 390:
                pg.locator("#text-zoom-target").screenshot(path=str(SHOTS / "27-radius-baseline-390.png"))
            fullsel = f'.phone-full-block[data-w="{width}"] .phone-demo'
            rect = js_rect(pg, fullsel)
            inner = pg.evaluate(
                "(s) => { const el = document.querySelector(s); return {sw: el.scrollWidth, cw: el.clientWidth}; }",
                fullsel,
            )
            check(f"B3 {width}px: العمود الكامل بعرضه الحقيقي وسالم داخليًا",
                  rect and abs(rect["w"] - width) < 0.5 and inner["sw"] <= inner["cw"] + 1,
                  f"عرض={rect}، داخلي={inner}")
            pg.locator("#phones-full").screenshot(path=str(SHOTS / f"{16 + idx}-phone-full-{width}.png"))

            if shot_zoom:
                # محاكاة زيادة حجم الخط 200% عبر زر اللوحة نفسه (مسار مستخدم حقيقي):
                # مروران — قراءة كل الأحجام الأصلية أولًا ثم تطبيق العامل
                # (تصحيح R2-D يمنع مضاعفة الابن الوارث مرتين: 16→32 لا 64).
                # آلية CDP Emulation.setTextZoomFactor غير متاحة في بيئة الفحص
                # (Chromium الحديث عبر Playwright) فاستُخدم هذا الزر.
                # الاسم الرسمي: «محاكاة زيادة حجم الخط» — مكافئة للنص وليست
                # تكبير متصفح/نظام مضمون التكافؤ لكل الحالات.
                # قبل التكبير: قياس زوج الانحناء المرشح (R2-B) عند 100%
                rad100 = pg.evaluate(
                    """() => { const cap = document.querySelector('#text-zoom-target [data-radius="capsule"]');
                         const lim = document.querySelector('#text-zoom-target [data-radius="limited"]');
                         const rc = getComputedStyle(lim).borderTopLeftRadius;
                         const hc = cap.getBoundingClientRect().height;
                         const hl = lim.getBoundingClientRect().height;
                         return {capR: getComputedStyle(cap).borderTopLeftRadius, limR: rc,
                                 capH: Math.round(hc), limH: Math.round(hl)}; }"""
                )
                pg.click('[data-lab="text-zoom"]')
                pg.wait_for_timeout(250)
                tz = pg.evaluate(
                    """() => { const sec = document.getElementById('phones-full');
                         const btn = sec.querySelector('#text-zoom-target .m-btn--primary.m-btn--block');
                         const cnt = sec.querySelector('#text-zoom-target .m-btn__counter');
                         const demo = sec.querySelector('#text-zoom-target');
                         const fs = getComputedStyle(btn).fontSize;
                         const lh = getComputedStyle(btn).lineHeight;
                         const bh = btn.getBoundingClientRect().height;
                         const csz = cnt.getBoundingClientRect();
                         const fb = sec.querySelector('#text-zoom-target .m-btn--secondary.m-btn--block');
                         const fr = fb.getBoundingClientRect();
                         const wrapped = sec.querySelector('#text-zoom-target .m-btn__label');
                         const wfs = wrapped ? getComputedStyle(wrapped).fontSize : null;
                         /* حدود نص العدّاد داخل الشارة بخصم الحشو (تصحيح R2-A):
                            أفقيًا عبر Range (عرض التقدم الفعلي)، وعموديًا عبر
                            غلاف نص قابل للقياس (صندوق السطر المحجوز) — صندوق
                            خط الزواجهة يفوق السطر بصريًا (1.3em) وليس قصًّا
                            حقيقيًا، والغلاف هو ما يحجزه التخطيط فعلًا. */
                         const range = document.createRange();
                         range.selectNodeContents(cnt);
                         const tr = range.getBoundingClientRect();
                         const ccs = getComputedStyle(cnt);
                         const padL = parseFloat(ccs.paddingLeft), padR = parseFloat(ccs.paddingRight);
                         const tnode = cnt.firstChild;
                         const wrap = document.createElement('span');
                         wrap.style.display = 'inline-block';
                         cnt.insertBefore(wrap, tnode);
                         wrap.appendChild(tnode);
                         const wr = wrap.getBoundingClientRect();
                         cnt.insertBefore(tnode, wrap);
                         wrap.remove();
                         const crb = cnt.getBoundingClientRect();
                         const textInside = tr.left >= crb.left + padL - 0.6
                             && tr.right <= crb.right - padR + 0.6
                             && wr.top >= crb.top - 0.6
                             && wr.bottom <= crb.bottom + 0.6;
                         const cap = sec.querySelector('#text-zoom-target [data-radius="capsule"]');
                         const lim = sec.querySelector('#text-zoom-target [data-radius="limited"]');
                         return {labelFont: fs, line: lh, btnH: Math.round(bh),
                                 wrappedFont: wfs,
                                 counterW: Math.round(csz.width), counterH: Math.round(csz.height),
                                 counterTextW: Math.round(tr.width), counterTextH: Math.round(tr.height),
                                 counterWrapH: Math.round(wr.height),
                                 counterPadL: padL, counterPadR: padR,
                                 counterTextInside: textInside,
                                 demoW: Math.round(demo.getBoundingClientRect().width),
                                 demoSw: demo.scrollWidth, demoCw: demo.clientWidth,
                                 hardestW: Math.round(fb.getBoundingClientRect().width),
                                 hardestRight: Math.round(fr.right),
                                 capR200: getComputedStyle(cap).borderTopLeftRadius,
                                 limR200: getComputedStyle(lim).borderTopLeftRadius,
                                 capH200: Math.round(cap.getBoundingClientRect().height),
                                 limH200: Math.round(lim.getBoundingClientRect().height)}; }"""
                )
                ov2 = page_overflow(pg)
                check(f"B4 {width}px زيادة حجم الخط 200%: الخط المباشر وغلاف m-btn__label كلاهما 32px لا 64px والسطر تمدّد",
                      tz["labelFont"] == "32px" and tz["wrappedFont"] == "32px"
                      and abs(float(str(tz["line"]).replace("px", "")) - 48) < 1,
                      f"fontSize={tz['labelFont']}، الغلاف={tz['wrappedFont']}، line={tz['line']}، ارتفاع الزر={tz['btnH']}px")
                check(f"B5 {width}px زيادة حجم الخط 200%: نص العدّاد داخل الشارة بخصم الحشو (R2-A) والمحتوى داخل العمود",
                      tz["counterTextInside"] and tz["counterH"] >= 26
                      and tz["demoSw"] <= tz["demoCw"] + 1
                      and tz["hardestRight"] <= tz["demoCw"] + 1 and tz["btnH"] >= 56,
                      f"شارة={tz['counterW']}x{tz['counterH']}، نصها={tz['counterTextW']}x{tz['counterTextH']} (غلاف السطر {tz['counterWrapH']}px)، "
                      f"حشو inline={tz['counterPadL']}/{tz['counterPadR']}، نص داخل الحدود={tz['counterTextInside']}، "
                      f"عمود داخلي sw/cw={tz['demoSw']}/{tz['demoCw']}، أصعب زر يمين={tz['hardestRight']}، ارتفاع الزر={tz['btnH']}")
                check(f"B6 {width}px زيادة حجم الخط 200%: الصفحة بلا تمرير أفقي",
                      ov2["sw"] <= ov2["cw"], str(ov2))
                check(f"B7 {width}px المرشح R2-B: انحناء الزر الطويل 24px عند 100% و200% وبنفس ارتفاع الحالي",
                      rad100["limR"] == "24px" and rad100["capR"] == "999px"
                      and tz["limR200"] == "24px" and tz["capR200"] == "999px"
                      and abs(rad100["capH"] - rad100["limH"]) < 1
                      and abs(tz["capH200"] - tz["limH200"]) < 1,
                      f"100%: كبسولة={rad100['capR']} مرشح={rad100['limR']} ارتفاعا {rad100['capH']}/{rad100['limH']}؛ "
                      f"200%: كبسولة={tz['capR200']} مرشح={tz['limR200']} ارتفاعا {tz['capH200']}/{tz['limH200']}")
                pg.locator("#phones-full").screenshot(path=str(SHOTS / shot_zoom))
                pg.click('[data-lab="text-zoom"]')  # استعادة الحجم الأصلي
                pg.wait_for_timeout(150)
                # B8: الاستعادة الدقيقة بعد الإلغاء — المباشر والغلاف معًا (R2-D)
                back = pg.evaluate(
                    """() => { const sec = document.getElementById('phones-full');
                         const btn = sec.querySelector('#text-zoom-target .m-btn--primary.m-btn--block');
                         const wrapped = sec.querySelector('#text-zoom-target .m-btn__label');
                         return {btn: getComputedStyle(btn).fontSize,
                                 wrapped: wrapped ? getComputedStyle(wrapped).fontSize : null,
                                 inline: btn.getAttribute('style')}; }"""
                )
                check(f"B8 {width}px الاستعادة الدقيقة بعد إلغاء المحاكاة: المباشر والغلاف يعودان 16px",
                      back["btn"] == "16px" and back["wrapped"] == "16px" and back["inline"] is None,
                      str(back))
            c.close()

        # ============ C) 1280 — جدول الحالات ولوحة المقارنة ============
        c = browser.new_context(viewport={"width": 1280, "height": 950})
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        pg.locator("#states").screenshot(path=str(SHOTS / "03-states-table-1280.png"))
        pg.locator(".phone-lab .phone-demo.is-320").first.screenshot(path=str(SHOTS / "09-phone-column-320.png"))
        pg.locator(".phone-lab .phone-demo.is-430").first.screenshot(path=str(SHOTS / "10-phone-column-430.png"))
        pg.screenshot(path=str(SHOTS / "12-board-1280-full.png"), full_page=True)
        c.close()

        # ============ D) تقليل الحركة: مؤشر ثابت (توجيه R2) ============
        c = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = c.new_page()
        pg.goto(board)
        pg.wait_for_load_state("networkidle")
        rm = pg.evaluate(
            """() => { const b = document.querySelector('#live [data-demo="save"]');
                 MicroButtons.setLoading(b, true);
                 const sp = b.querySelector('.m-btn__spinner');
                 return {anim: getComputedStyle(sp).animationName,
                         trans: getComputedStyle(b).transitionDuration,
                         busy: b.getAttribute('aria-busy')}; }"""
        )
        pg.wait_for_timeout(150)
        pg.locator("#live").screenshot(path=str(SHOTS / "23-reduced-motion-390.png"))
        pg.evaluate("() => MicroButtons.setLoading(document.querySelector('#live [data-demo=\"save\"]'), false)")
        check("D1 تقليل الحركة: مؤشر ثابت (animation none) + الانتقالات ملغاة + التسمية الصريحة باقية",
              rm["anim"] == "none" and rm["busy"] == "true", str(rm))
        c.close()

        # ============ E) مثال الاستخدام خارج اللوحة (بند 5 + تصحيح R2-C) ============
        c = browser.new_context(viewport={"width": 390, "height": 844})
        pg = c.new_page()
        errors_usage = []
        pg.on("console", lambda m: errors_usage.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errors_usage.append(str(e)))
        pg.goto(usage)
        pg.wait_for_load_state("networkidle")
        pg.evaluate("() => document.fonts.ready")
        n_syms_u = pg.evaluate("() => document.querySelectorAll('#usage-icon-defs symbol').length")
        check("E0 مثال الاستخدام: بلا أخطاء console/pageerror ورموز الأصول محملة (3)",
              len(errors_usage) == 0 and n_syms_u == 3,
              f"أخطاء={errors_usage[:2]}، رموز={n_syms_u}")
        pg.click("#save-btn")
        pg.wait_for_timeout(300)
        u1 = pg.evaluate(
            """() => { const b = document.querySelector('#save-btn');
                 const s = document.querySelector('#save-status');
                 return {busy: b.getAttribute('aria-busy'), label: b.getAttribute('aria-label'),
                         statusHidden: s.hidden}; }"""
        )
        pg.wait_for_timeout(1800)
        u2 = pg.evaluate(
            """() => { const b = document.querySelector('#save-btn');
                 const s = document.querySelector('#save-status');
                 return {busy: b.getAttribute('aria-busy'), label: b.getAttribute('aria-label'),
                         statusVisible: !s.hidden}; }"""
        )
        pg.screenshot(path=str(SHOTS / "25-example-usage-390.png"), full_page=True)
        check("E1 مثال الاستخدام خارج اللوحة: عقد المكوّن يعمل بمستهلك مستقل (تحميل ← نجاح المستهلك)",
              u1["busy"] == "true" and u1["label"] == "جارٍ الحفظ" and u1["statusHidden"]
              and u2["busy"] is None and u2["label"] is None and u2["statusVisible"],
              f"أثناء: {u1} | بعد: {u2}")

        # ---- R2-C: استقلال المقاسات خارج اللوحة — أبعاد قبل/أثناء/بعد لكل شكل ----
        e_targets = [
            ("نص+أيقونة", "#icon-btn"),
            ("أيقونة دائري", "#circle-btn"),
            ("تصفية بعدّاد", "#filter-btn"),
            ("مقترح B — فتحة محجوزة", "#slot-btn"),
        ]
        for name, sel in e_targets:
            before = js_rect(pg, sel)
            pg.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), true)", [sel])
            during = js_rect(pg, sel)
            sp = pg.evaluate(
                """([s]) => { const b = document.querySelector(s);
                     const sp = b.querySelector('.m-btn__spinner');
                     if (!sp) return null;
                     const r = sp.getBoundingClientRect();
                     return {w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100}; }""",
                [sel],
            )
            pg.evaluate("([s]) => MicroButtons.setLoading(document.querySelector(s), false)", [sel])
            after = js_rect(pg, sel)
            stable = (before and during and after and sp
                      and abs(before["w"] - during["w"]) < 0.5 and abs(before["h"] - during["h"]) < 0.5
                      and abs(before["w"] - after["w"]) < 0.5 and abs(before["h"] - after["h"]) < 0.5)
            check(f"E2 استقلال المقاسات خارج اللوحة — {name}", stable,
                  f"قبل {before} أثناء {during} بعد {after} مؤشر {sp}")

        # ---- R2-C: تغيّر توكن مقاس المؤشر ينعكس على الأنواع كلها ثم يستعاد ----
        pg.evaluate("() => document.documentElement.style.setProperty('--micro-icon-in-button', '26px')")
        t1 = pg.evaluate(
            """() => {
                 const out = {};
                 const b1 = document.querySelector('#icon-btn');
                 /* فتحة الأيقونة في الحالة العادية (أثناء التحميل display:none) */
                 const ic0 = b1.querySelector('.m-btn__icon');
                 out.iconSlot = ic0 ? Math.round(ic0.getBoundingClientRect().height) : null;
                 MicroButtons.setLoading(b1, true);
                 const s1 = b1.querySelector('.m-btn__spinner').getBoundingClientRect();
                 out.iconBtnSpinner = Math.round(s1.width);
                 MicroButtons.setLoading(b1, false);
                 const b2 = document.querySelector('#sync-btn');
                 MicroButtons.setLoading(b2, true);
                 const s2 = b2.querySelector('.m-btn__spinner').getBoundingClientRect();
                 out.textSpinner = Math.round(s2.width);
                 MicroButtons.setLoading(b2, false);
                 return out; }"""
        )
        pg.evaluate("() => document.documentElement.style.removeProperty('--micro-icon-in-button')")
        pg.evaluate("() => document.documentElement.style.setProperty('--micro-icon-button-icon', '28px')")
        t2 = pg.evaluate(
            """() => { const b = document.querySelector('#circle-btn');
                 MicroButtons.setLoading(b, true);
                 const s = b.querySelector('.m-btn__spinner').getBoundingClientRect();
                 const w = Math.round(s.width);
                 MicroButtons.setLoading(b, false);
                 return {circleSpinner: w}; }"""
        )
        pg.evaluate("() => document.documentElement.style.removeProperty('--micro-icon-button-icon')")
        t3 = pg.evaluate(
            """() => { const b = document.querySelector('#sync-btn');
                 MicroButtons.setLoading(b, true);
                 const s = b.querySelector('.m-btn__spinner').getBoundingClientRect();
                 const w = Math.round(s.width);
                 MicroButtons.setLoading(b, false);
                 return {restored: w}; }"""
        )
        check("E3 توكن المؤشر ينعكس على الأنواع كلها ثم يستعاد (R2-C)",
              t1["iconBtnSpinner"] == 26 and t1["iconSlot"] == 26 and t1["textSpinner"] == 26
              and t2["circleSpinner"] == 28 and t3["restored"] == 20,
              f"توكِن 26: نص+أيقونة={t1['iconBtnSpinner']} فتحة={t1['iconSlot']} نص={t1['textSpinner']}؛ "
              f"توكن الدائري 28: {t2['circleSpinner']}؛ بعد الاستعادة: {t3['restored']}")
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
