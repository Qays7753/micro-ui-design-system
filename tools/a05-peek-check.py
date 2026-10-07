#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص مقارنة A05 (شريط المعلومات الحالي مقابل variant peek). من الجذر:
  python3 tools/a05-peek-check.py [--out DIR] [--port PORT]
SAMSUNG-ONEUI-REPAIR-R1 (الوكيل 4 — جولة الرجعية 2026-10-07): وسائط
  --out/--port اختيارية لإعادة تشغيل الرجعية بمخرجات معزولة (أدلة
  evidence/agent4/regression/) دون الكتابة فوق الأدلة التاريخية في
  reviews/UI-COMPLETION/، ولتثبيت الخادم على منفذ نطاق الوكيل 4
  (4400-4419). الافتراضات كما كانت.
التغطية بعد R8 (مراجعة CHATGPT-REVIEW-R1):
  - الشريط الحالي: لا تتبع أثناء الحركة (الانتقال بعد pointerup).
  - الـvariant: peek على بطاقة وسطية (الجارين ظاهران) واستقرار الطرفين.
  - أزرار السابق/التالي: نقر فعلي بالاتجاهين ومن الطرفين (R8-01) + النقاط
    + تطابق index/aria/position/transform.
  - مالك وحيد: بلا محرك قديم على جذر peek، حدث تغيير واحد لكل تنقل،
    تهيئة متكررة وترتيب تحميل معكوس (R8-02)، وإدخال تفاعلي داخل البطاقة
    لا تُلتقط أسهمه كتنقل.
  - موارد الصفحة: صفر 404/فشل شبكة بعد التحميل وبعد كل التفاعلات (R8-03).
  - نقل التركيز: تركيز داخل بطاقة تصبح غير نشطة → العارض لا BODY (R8-04).
  - الفراغ وبطاقة واحدة بعقد variant نفسه (data-info-peek-ready) (R8-05).
  - تتبع 1:1 مقاسًا: دلتا المسار = دلتا المؤشر، تثبت بلا انزلاق، التزام
    العتبة، snap-back يستعيد الموضع، pointercancel نظيف (R8-06).
  - reduced-motion: بلا انتقالات وظهور فوري عند الموضع الهدف.
الأدلة: reviews/UI-COMPLETION/verification-a05.txt + لقطات.
بيئة: Playwright + Chromium headless — لا لمس حقيقي ولا قارئ شاشة.
"""
import argparse
import http.server
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "UI-COMPLETION"
results, log_lines = [], []


def log(m):
    print(m)
    log_lines.append(m)


def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))


TX_JS = "e => { const t = getComputedStyle(e).transform; return t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41; }"

STANDALONE_HEAD = """<html lang="ar" dir="rtl"><head><meta charset="UTF-8">
  <base href="%s/">
  <link rel="stylesheet" href="shared/tokens.css">
  <link rel="stylesheet" href="components/info-strip/info-strip.css">
  <link rel="stylesheet" href="components/info-strip/info-strip-peek.css">
  %s</head><body>
"""

CARD = ('<div class="m-info-strip__slide"><article class="m-info-card">'
        '<span class="m-info-card__label">%s</span>'
        '<div class="m-info-card__reading"><span class="m-info-card__number">%s</span>'
        '<span class="m-info-card__unit">وحدة</span></div>%s</article></div>')


def main(out_dir: Path = OUT, port: int = 0):
    global OUT
    OUT = out_dir
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log("# فحص مقارنة A05 — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree}")
    log("")

    errors, failed_resources = [], []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
        page.on("response", lambda r: failed_resources.append(f"{r.status} {r.url}") if r.status >= 400 else None)
        page.on("requestfailed", lambda r: failed_resources.append(f"FAILED {r.url}"))

        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        cur = page.locator("#cmp-current")
        peek = page.locator("#cmp-peek")
        cur_track = cur.locator("[data-info-strip-track]")
        peek_track = peek.locator("[data-info-strip-track]")

        # ---- A05.0: التحميل — لا أخطاء JS ولا موارد فاشلة (R8-03) ----
        check("A05.0 الصفحة تعمل بلا أخطاء JavaScript ولا موارد فاشلة عند التحميل",
              len(errors) == 0 and len(failed_resources) == 0,
              "; ".join((errors + failed_resources)[:3]))

        # ---- A05.1: الشريط الحالي — لا تتبع أثناء الحركة ----
        cur.scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        seq = page.evaluate("""() => {
          const vp = document.querySelector('#cmp-current [data-info-strip-viewport]');
          const r = vp.getBoundingClientRect();
          const y = r.top + r.height / 2;
          const x0 = r.left + r.width * 0.4;
          const t0 = vp.querySelector('[data-info-strip-track]').style.transform;
          const opts = (x) => ({bubbles: true, pointerId: 7, isPrimary: true, pointerType: 'touch',
                                clientX: x, clientY: y});
          vp.dispatchEvent(new PointerEvent('pointerdown', opts(x0)));
          [30, 60, 90].forEach(dx => vp.dispatchEvent(new PointerEvent('pointermove', opts(x0 + dx))));
          const tMid = vp.querySelector('[data-info-strip-track]').style.transform;
          vp.dispatchEvent(new PointerEvent('pointerup', opts(x0 + 90)));
          return {t0, tMid};
        }""")
        page.wait_for_timeout(500)
        after_index = page.evaluate(
            "() => [...document.querySelectorAll('#cmp-current .m-info-strip__slide')]"
            ".findIndex(s => s.getAttribute('aria-hidden') === 'false')")
        check("A05.1 الشريط الحالي (لمس): المسار لا يتبع أثناء الحركة (tMid==t0) ثم ينتقل عند الإفلات",
              seq["tMid"] == seq["t0"] and after_index == 1,
              f"tMid==t0:{seq['tMid'] == seq['t0']} idx={after_index}")

        # ---- A05.2: المالك الوحيد + الهندسة عند التحميل ----
        peek.scroll_into_view_if_needed()
        page.wait_for_timeout(600)
        old_engine_absent = page.evaluate(
            "() => { const r = document.getElementById('cmp-peek');"
            " return !r.hasAttribute('data-info-strip-ready') && r.hasAttribute('data-info-peek-ready'); }")
        geo = peek.evaluate("""() => {
          const vp = document.querySelector('#cmp-peek [data-info-strip-viewport]');
          const slides = [...vp.querySelectorAll('.m-info-strip__slide')];
          const vr = vp.getBoundingClientRect();
          return slides.map(s => { const r = s.getBoundingClientRect();
            return {left: Math.round(r.left - vr.left), right: Math.round(vr.right - r.right), w: Math.round(r.width)}; });
        }""")
        active_centered = (abs(geo[0]["left"] - geo[0]["right"]) <= 4)
        peek_w = min(geo[0]["left"], geo[0]["right"])
        check("A05.2 الـvariant: جذر peek بمالك واحد (بلا تهيئة المحرك القديم) والبطاقة موسّطة وجزء المجاور ظاهر (≥16px)",
              old_engine_absent and active_centered and peek_w >= 16,
              f"owner={old_engine_absent} geo0={geo[0]} peek={peek_w}")

        # ---- A05.3: أزرار السابق/التالي — نقر فعلي وتطابق الحالة (R8-01) ----
        idx_after_next = page.evaluate(
            "() => { window.MicroInfoPeek.next(document.getElementById('cmp-peek'));"
            " return window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek')); }")
        page.wait_for_timeout(400)
        pos_text = peek.locator("[data-info-strip-position]").inner_text()
        dot2_current = page.evaluate(
            "() => [...document.querySelectorAll('#cmp-peek [data-info-strip-page]')]"
            ".findIndex(b => b.getAttribute('aria-current') === 'true')")
        centered_after = peek.evaluate("""() => {
          const vp = document.querySelector('#cmp-peek [data-info-strip-viewport]');
          const s = [...vp.querySelectorAll('.m-info-strip__slide')][1];
          const vr = vp.getBoundingClientRect(); const r = s.getBoundingClientRect();
          return Math.abs(Math.round(r.left - vr.left) - Math.round(vr.right - r.right)) <= 4;
        }""")
        idx_after_prev = page.evaluate(
            "() => { window.MicroInfoPeek.prev(document.getElementById('cmp-peek'));"
            " return window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek')); }")
        page.wait_for_timeout(400)
        check("A05.3 أزرار التنقل تعمل بلا أخطاء: next→1 (position «2 / 4» + النقطة الثانية aria-current + التمركز) ثم prev→0",
              idx_after_next == 1 and pos_text.strip() == "2 / 4" and dot2_current == 1
              and centered_after and idx_after_prev == 0,
              f"next={idx_after_next} pos={pos_text!r} dot={dot2_current} centered={centered_after} prev={idx_after_prev}")

        # ---- A05.4: الطرفان والنقاط — من الحافة للطرف الآخر (R8-01) ----
        for _ in range(3):
            page.evaluate("() => window.MicroInfoPeek.next(document.getElementById('cmp-peek'))")
            page.wait_for_timeout(250)
        idx_end = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        next_disabled_end = peek.locator("[data-info-strip-next]").is_disabled()
        for _ in range(3):
            page.evaluate("() => window.MicroInfoPeek.prev(document.getElementById('cmp-peek'))")
            page.wait_for_timeout(250)
        idx_start = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        prev_disabled_start = peek.locator("[data-info-strip-prev]").is_disabled()
        peek.locator("[data-info-strip-page]").nth(2).click()
        page.wait_for_timeout(400)
        idx_dot = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        focus_on_dot = page.evaluate(
            "() => document.activeElement === document.querySelectorAll('#cmp-peek [data-info-strip-page]')[2]")
        check("A05.4 الطرفان: next×3→3 (معطل) وprev×3→0 (معطل)، النقاط تنقل (dot3→2) والتركيز يبقى على النقطة (لا نقل عشوائي)",
              idx_end == 3 and next_disabled_end and idx_start == 0 and prev_disabled_start
              and idx_dot == 2 and focus_on_dot,
              f"end={idx_end} nd={next_disabled_end} start={idx_start} pd={prev_disabled_start} dot={idx_dot} focusKept={focus_on_dot}")

        # ---- A05.5: بطاقة وسطية — الجارين ظاهران؛ الطرفيات بجانب واحد ----
        def visible_widths():
            return page.evaluate("""() => {
              const vp = document.querySelector('#cmp-peek [data-info-strip-viewport]');
              const vr = vp.getBoundingClientRect();
              return [...vp.querySelectorAll('.m-info-strip__slide')].map(s => {
                const r = s.getBoundingClientRect();
                return Math.max(0, Math.round(Math.min(r.right, vr.right) - Math.max(r.left, vr.left)));
              });
            }""")

        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('cmp-peek'), 1)")
        page.wait_for_timeout(400)
        w_mid = visible_widths()
        mid_ok = w_mid[1] >= 200 and w_mid[0] >= 16 and w_mid[2] >= 16
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('cmp-peek'), 0)")
        page.wait_for_timeout(400)
        w_first = visible_widths()
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('cmp-peek'), 3)")
        page.wait_for_timeout(400)
        w_last = visible_widths()
        check("A05.5 peek مقاسًا: الوسطى (الجار 0 والجار 2 ظاهران ≥16px) والطرف 0 (الجار 1 ظاهر والطرف الآخر 0) والطرف 3 بالمثل",
              mid_ok and w_first[0] >= 200 and w_first[1] >= 16 and w_first[3] == 0
              and w_last[3] >= 200 and w_last[2] >= 16 and w_last[0] == 0,
              f"mid={w_mid} first={w_first} last={w_last}")

        # ---- A05.6: تتبع 1:1 مقاسًا — دلتا المسار = دلتا المؤشر (R8-06) ----
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('cmp-peek'), 0)")
        page.wait_for_timeout(400)
        vp_box = peek.locator("[data-info-strip-viewport]").bounding_box()
        y = vp_box["y"] + vp_box["height"] / 2
        x0 = vp_box["x"] + vp_box["width"] * 0.7
        tx0 = peek_track.evaluate(TX_JS)
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 30, y)
        tx1 = peek_track.evaluate(TX_JS)
        page.mouse.move(x0 + 90, y)
        tx2 = peek_track.evaluate(TX_JS)
        page.wait_for_timeout(200)
        tx3 = peek_track.evaluate(TX_JS)
        page.mouse.up()
        page.wait_for_timeout(500)
        idx_after_drag = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        d1, d2 = tx1 - tx0, tx2 - tx0
        held_stable = abs(tx3 - tx2) < 0.5
        check("A05.6 تتبع 1:1 مقاسًا: +30px مؤشر → +30px مسار و+90 → +90 (±2px)، بلا انزلاق بعد التوقف، والالتزام عند الإفلات → البطاقة 1",
              abs(d1 - 30) <= 2 and abs(d2 - 90) <= 3 and held_stable and idx_after_drag == 1,
              f"tx0={tx0:.1f} d30={d1:.1f} d90={d2:.1f} held={held_stable} idx={idx_after_drag}")

        # ---- A05.7: دون العتبة — snap-back يستعيد الموضع نفسه ----
        tx_before = peek_track.evaluate(TX_JS)
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 18, y)
        tx_mid = peek_track.evaluate(TX_JS)
        page.mouse.up()
        page.wait_for_timeout(500)
        tx_after = peek_track.evaluate(TX_JS)
        idx_snap = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.7 سحب 18px (< العتبة): المسار تحرك أثناء السحب ثم snap-back إلى الموضع نفسه (±2px) دون تبديل",
              abs(tx_mid - tx_before) >= 12 and abs(tx_after - tx_before) <= 2 and idx_snap == 1,
              f"mid={tx_mid - tx_before:.1f} restore={tx_after - tx_before:.1f} idx={idx_snap}")

        # ---- A05.8: الالتزام — سحب كافٍ يبدل البطاقة (RTL: يمينًا = التالية) ----
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 120, y, steps=6)
        page.mouse.up()
        page.wait_for_timeout(500)
        idx = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.8 سحب يمينًا في RTL يلتزم إلى «التالية» (ترتيب منطقي)", idx == 2, f"idx={idx}")

        # ---- A05.9: pointercancel — snap-back نظيف بلا حالة عالقة ----
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 80, y, steps=4)
        page.evaluate("""() => {
          const vp = document.querySelector('#cmp-peek [data-info-strip-viewport]');
          vp.dispatchEvent(new PointerEvent('pointercancel', {bubbles: true, pointerId: 1}));
        }""")
        page.wait_for_timeout(500)
        idx_cancel = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        dragging_gone = peek_track.evaluate("e => !e.classList.contains('is-peek-dragging')")
        check("A05.9 pointercancel أثناء السحب: snap-back وبلا حالة سحب عالقة",
              idx_cancel == 2 and dragging_gone, f"idx={idx_cancel} clean={dragging_gone}")

        # ---- A05.10: حدث تغيير واحد لكل تنقل (مالك وحيد — R8-02) ----
        ev = page.evaluate("""() => {
          const r = document.getElementById('cmp-peek');
          window.__evCount = 0;
          r.addEventListener('micro-info-peek:change', () => window.__evCount++);
          window.MicroInfoPeek.next(r);
          return window.__evCount;
        }""")
        page.wait_for_timeout(400)
        idx_ev = page.evaluate(
            "() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.10 حدث micro-info-peek:change واحد لكل تنقل — بلا ازدواج إعلان من محركين",
              ev == 1 and idx_ev == 3, f"events={ev} idx={idx_ev}")

        # ---- A05.11: تهيئة متكررة (المحركان معًا) — لا نقاط مضاعفة ولا معالجات مزدوجة ----
        page.evaluate("() => { window.MicroInfoStrip.init(); window.MicroInfoPeek.init(); }")
        dots_count = page.evaluate("() => document.querySelectorAll('#cmp-peek [data-info-strip-page]').length")
        ev2 = page.evaluate("""() => {
          const r = document.getElementById('cmp-peek');
          window.__evCount2 = 0;
          r.addEventListener('micro-info-peek:change', () => window.__evCount2++);
          window.MicroInfoPeek.prev(r);
          return window.__evCount2;
        }""")
        page.wait_for_timeout(400)
        idx2 = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.11 تهيئة متكررة للمحركين: النقاط 4 (لا مضاعفة) والتنقل يتحرك خطوة واحدة بحدث واحد",
              dots_count == 4 and ev2 == 1 and idx2 == 2, f"dots={dots_count} events={ev2} idx={idx2}")

        # ---- A05.12: لوحة المفاتيح وRTL + Home/End ----
        peek.locator("[data-info-strip-viewport]").focus()
        page.keyboard.press("ArrowLeft")   # RTL: التالية
        page.wait_for_timeout(420)
        i2 = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        page.keyboard.press("ArrowRight")  # RTL: السابقة
        page.wait_for_timeout(420)
        i3 = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        page.keyboard.press("End")
        page.wait_for_timeout(420)
        i4 = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        next_disabled = peek.locator("[data-info-strip-next]").is_disabled()
        check("A05.12 لوحة المفاتيح RTL (يسار=التالية، يمين=السابقة، End=الأخيرة) وزر التالية معطل عند النهاية",
              i2 == 3 and i3 == 2 and i4 == 3 and next_disabled, f"{i2}→{i3}→{i4} nextDisabled={next_disabled}")

        # ---- A05.13: الإتاحة — المجاور مرئي لكنه inert وaria-hidden ----
        a11y = peek.evaluate("""() => {
          const slides = [...document.querySelectorAll('#cmp-peek .m-info-strip__slide')];
          return slides.map(s => ({ah: s.getAttribute('aria-hidden'), inert: s.inert}));
        }""")
        ok_a11y = (sum(1 for a in a11y if a["ah"] == "false") == 1
                   and all((a["ah"] == "true") == a["inert"] for a in a11y))
        neighbor_visible = peek.evaluate(
            "() => document.querySelectorAll('#cmp-peek .m-info-strip__slide')[1]"
            ".getBoundingClientRect().width > 40")
        check("A05.13 المجاور: مرئي (peek) لكنه inert وaria-hidden — لا تفاعل مخفي",
              ok_a11y and neighbor_visible, str(a11y))

        # ---- A05.14: بلا autoplay ----
        before = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        page.wait_for_timeout(1200)
        after = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.14 لا autoplay: الموضع ثابت دون أي إدخال", before == after, f"{before}=={after}")

        # ---- A05.15: reduced-motion — بلا انتقالات وظهور فوري عند الهدف ----
        page.emulate_media(reduced_motion="reduce")
        peek.locator("[data-info-strip-viewport]").focus()
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(80)
        geo_rm = peek.evaluate("""() => {
          const vp = document.querySelector('#cmp-peek [data-info-strip-viewport]');
          const slides = [...vp.querySelectorAll('.m-info-strip__slide')];
          const vr = vp.getBoundingClientRect();
          const i = slides.findIndex(s => s.getAttribute('aria-hidden') === 'false');
          const r = slides[i].getBoundingClientRect();
          return {i, centered: Math.abs(Math.round(r.left - vr.left) - Math.round(vr.right - r.right)) <= 4};
        }""")
        no_anim = peek_track.evaluate(
            "e => getComputedStyle(e).transitionDuration === '0s' || getComputedStyle(e).transitionProperty === 'none'")
        page.emulate_media(reduced_motion="no-preference")
        check("A05.15 prefers-reduced-motion: الموضع الهدف فورًا (80ms) بلا انتقال على المسار",
              geo_rm["i"] == 3 and geo_rm["centered"] and no_anim, str(geo_rm) + f" noAnim={no_anim}")

        # ---- A05.16: لا أخطاء ولا موارد فاشلة بعد كل مسارات المقارنة ----
        check("A05.16 صفر أخطاء JS وصفر موارد فاشلة (404+) بعد كل التفاعلات أعلاه",
              len(errors) == 0 and len(failed_resources) == 0,
              "; ".join((errors + failed_resources)[:3]))

        # ============ صفحات مستقلة — عقد variant وحده ============

        # ---- صفحة بترتيب تحميل معكوس (peek ثم الشريط القديم) + بطاقة بأزرار وحقل ----
        slides_html = "".join([
            CARD % ("بطاقة أولى", "12", '<button type="button" id="ro-btn">تفاصيل البطاقة</button>'),
            CARD % ("بطاقة ثانية", "34", ""),
            CARD % ("بطاقة ثالثة", "56", '<input id="ro-input" aria-label="ملاحظة البطاقة">'),
        ])
        ro_controls = ('<div class="m-info-strip__controls" data-info-strip-controls>'
                       '<span class="m-info-strip__position">البطاقة <span data-info-strip-position></span></span>'
                       '<div class="m-info-strip__pages" data-info-strip-pages></div>'
                       '<button type="button" class="m-info-strip__arrow" data-info-strip-prev aria-label="السابقة">س</button>'
                       '<button type="button" class="m-info-strip__arrow" data-info-strip-next aria-label="التالية">ت</button>'
                       '</div>'
                       '<p class="m-info-strip__status" data-info-strip-status role="status" aria-live="polite"></p>')
        page.set_content((STANDALONE_HEAD % (
            base,
            '<script src="components/info-strip/info-strip-peek.js"></script>'
            '<script src="components/info-strip/info-strip.js"></script>')
            + f'<div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="ro-peek">'
              f'<div class="m-info-strip__viewport" data-info-strip-viewport id="ro-vp" tabindex="0" aria-label="عارض">'
              f'<div class="m-info-strip__track" data-info-strip-track>{slides_html}</div></div>'
              f'{ro_controls}</div></body></html>'))
        page.wait_for_load_state("networkidle")

        ro_owner = page.evaluate(
            "() => { const r = document.getElementById('ro-peek');"
            " return r.hasAttribute('data-info-peek-ready') && !r.hasAttribute('data-info-strip-ready'); }")
        ro_dots = page.evaluate("() => document.querySelectorAll('#ro-peek [data-info-strip-page]').length")
        check("A05.17 ترتيب تحميل معكوس (peek أولًا): مالك واحد للجذر — ready بعقد variant وبلا ready للمحرك القديم ونقاط 3",
              ro_owner and ro_dots == 3, f"owner={ro_owner} dots={ro_dots}")

        # ---- A05.18: نقل التركيز عند إخفاء البطاقة (R8-04) ----
        page.evaluate("() => document.getElementById('ro-btn').focus()")
        focus_before = page.evaluate("() => document.activeElement.id")
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('ro-peek'), 1)")
        page.wait_for_timeout(300)
        focus_after = page.evaluate("""() => {
          const a = document.activeElement;
          return {id: a.id || a.tagName,
                  isViewport: a.id === 'ro-vp',
                  inInert: !!(a.closest && a.closest('[aria-hidden=\\"true\\"]')),
                  isBody: a === document.body};
        }""")
        idx_focus = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('ro-peek'))")
        check("A05.18 تركيز داخل بطاقة تصبح غير نشطة → يُنقل مرة إلى العارض (لا BODY ولا عنصر داخل inert) ولا يُنقل عند بقاء البطاقة نشطة",
              focus_before == "ro-btn" and focus_after["isViewport"] and not focus_after["inInert"]
              and not focus_after["isBody"] and idx_focus == 1,
              f"before={focus_before} after={focus_after} idx={idx_focus}")
        # لا نقل عشوائي: نقر حقيقي على نقطة (خارج البطاقات) يركّزها والتركيز يبقى مكانه بعد التنقل
        ro_dots_loc = page.locator("#ro-peek [data-info-strip-page]")
        ro_dots_loc.nth(1).click()
        page.wait_for_timeout(300)
        focus_kept = page.evaluate(
            "() => document.activeElement === document.querySelectorAll('#ro-peek [data-info-strip-page]')[1]"
            " && window.MicroInfoPeek.getIndex(document.getElementById('ro-peek')) === 1")
        check("A05.19 التركيز على نقطة (خارج البطاقات) يبقى مكانه بعد التنقل — لا نقل عشوائي", focus_kept,
              f"kept={focus_kept}")

        # ---- A05.20: إدخال تفاعلي داخل البطاقة — أسهمه ليست تنقلًا (R8-02) ----
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('ro-peek'), 2)")
        page.wait_for_timeout(300)
        page.evaluate("() => document.getElementById('ro-input').focus()")
        page.keyboard.press("ArrowRight")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(200)
        idx_input = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('ro-peek'))")
        input_focused = page.evaluate("() => document.activeElement === document.getElementById('ro-input')")
        check("A05.20 أسهم لوحة المفاتيح داخل حقل إدخال بالبطاقة لا تُلتقط كتنقل (يبقى 2 والتركيز في الحقل)",
              idx_input == 2 and input_focused, f"idx={idx_input} inputFocused={input_focused}")

        # ---- A05.21: بطاقة واحدة بعقد variant (R8-05) ----
        single_card = CARD % ("بطاقة وحيدة", "9", "")
        page.set_content((STANDALONE_HEAD % (
            base,
            '<script src="components/info-strip/info-strip.js"></script>'
            '<script src="components/info-strip/info-strip-peek.js"></script>')
            + f'<div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="single-peek">'
              f'<div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0" aria-label="عارض بطاقة واحدة">'
              f'<div class="m-info-strip__track" data-info-strip-track>{single_card}</div></div>'
              f'<div class="m-info-strip__controls" data-info-strip-controls>'
              f'<span class="m-info-strip__position">البطاقة <span data-info-strip-position></span></span></div>'
              f'<p class="m-info-strip__status" data-info-strip-status role="status" aria-live="polite"></p>'
              f'</div></body></html>'))
        page.wait_for_load_state("networkidle")
        single = page.evaluate("""() => {
          const r = document.getElementById('single-peek');
          const vp = r.querySelector('[data-info-strip-viewport]');
          const c = r.querySelector('[data-info-strip-controls]');
          const e = r.querySelector('[data-info-strip-empty]');
          return {ready: r.hasAttribute('data-info-peek-ready'),
                  oldReady: r.hasAttribute('data-info-strip-ready'),
                  index: window.MicroInfoPeek.getIndex(r),
                  viewportHidden: vp.hidden, controlsHidden: !c || c.hidden,
                  emptyHidden: e ? e.hidden : null};
        }""")
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('single-peek'), 1)")
        single_index_stable = page.evaluate(
            "() => window.MicroInfoPeek.getIndex(document.getElementById('single-peek'))")
        check("A05.21 بطاقة واحدة: جاهز بعقد variant، المنفذ ظاهر والتحكمات مخفية والفراغ مخفي، والتنقل لا يخرج من 0",
              single["ready"] and not single["oldReady"] and single["index"] == 0
              and not single["viewportHidden"] and single["controlsHidden"]
              and (single["emptyHidden"] is None or single["emptyHidden"]) and single_index_stable == 0,
              str(single) + f" stable={single_index_stable}")

        # ---- A05.22: الفراغ بعقد variant نفسه (R8-05) ----
        page.set_content((STANDALONE_HEAD % (
            base,
            '<script src="components/info-strip/info-strip.js"></script>'
            '<script src="components/info-strip/info-strip-peek.js"></script>')
            + '<div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="empty-peek">'
              '<div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0" aria-label="عارض فارغ">'
              '<div class="m-info-strip__track" data-info-strip-track></div></div>'
              '<div class="m-info-strip__controls" data-info-strip-controls>'
              '<span class="m-info-strip__position">البطاقة <span data-info-strip-position></span></span></div>'
              '<p class="m-info-strip__empty" data-info-strip-empty hidden>لا بطاقات بعد</p>'
              '</div></body></html>'))
        page.wait_for_load_state("networkidle")
        empty_state = page.evaluate("""() => {
          const r = document.getElementById('empty-peek');
          const vp = r.querySelector('[data-info-strip-viewport]');
          const c = r.querySelector('[data-info-strip-controls]');
          const e = r.querySelector('[data-info-strip-empty]');
          window.MicroInfoPeek.goTo(r, 0);
          return {ready: r.hasAttribute('data-info-peek-ready'),
                  oldReady: r.hasAttribute('data-info-strip-ready'),
                  index: window.MicroInfoPeek.getIndex(r),
                  viewportHidden: vp.hidden, controlsHidden: c.hidden, emptyShown: !e.hidden};
        }""")
        check("A05.22 عارض بلا بطاقات (عقد variant): جاهز، صف الفراغ ظاهر، المنفذ والتحكمات مخفيان، index -1 والتنقل لا يُجاري",
              empty_state["ready"] and not empty_state["oldReady"] and empty_state["emptyShown"]
              and empty_state["viewportHidden"] and empty_state["controlsHidden"]
              and empty_state["index"] == -1, str(empty_state))

        # ---- A05.23: الحصيلة النهائية — صفر أخطاء وصفر موارد فاشلة عبر كل الصفحات ----
        check("A05.23 الحصيلة عبر كل الصفحات والتفاعلات: صفر أخطاء JS وصفر موارد فاشلة",
              len(errors) == 0 and len(failed_resources) == 0,
              "; ".join((errors + failed_resources)[:3]))

        # ---- اللقطات ----
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        page.screenshot(path=str(OUT / "screenshots" / "a05-comparison-390.png"), full_page=True)
        page.set_viewport_size({"width": 320, "height": 844})
        page.wait_for_timeout(600)
        page.screenshot(path=str(OUT / "screenshots" / "a05-comparison-320.png"), full_page=True)
        browser.close()

    passed = sum(1 for _, ok in results if ok)
    log("")
    log(f"# النتيجة: {passed}/{len(results)}")
    (OUT / "verification-a05.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")
    if passed != len(results):
        sys.exit(1)


if __name__ == "__main__":
    _ap = argparse.ArgumentParser()
    _ap.add_argument("--out", default=str(OUT),
                     help="دليل الإخراج (الافتراضي reviews/UI-COMPLETION التاريخي)")
    _ap.add_argument("--port", type=int, default=0,
                     help="منفذ الخادم (0 = تلقائي؛ أثناء REPAIR-R1 استخدم 4400-4419)")
    _args = _ap.parse_args()
    main(Path(_args.out).resolve(), _args.port)
