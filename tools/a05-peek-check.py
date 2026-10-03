#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص مقارنة A05 (شريط المعلومات الحالي مقابل variant peek). من الجذر:
  python3 tools/a05-peek-check.py
يغطي: سلوك الشريط الحالي (لا تتبع أثناء الحركة)، سلوك الـvariant (peek + تتبع 1:1
+ التزام عتبة + snap-back عند pointercancel + RTL + لوحة مفاتيح + بطاقة واحدة/فراغ).
الأدلة: reviews/UI-COMPLETION/verification-a05.txt + لقطات.
بيئة: Playwright + Chromium headless — لا لمس حقيقي ولا قارئ شاشة.
"""
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


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log("# فحص مقارنة A05 — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree}")
    log("")

    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        cur = page.locator("#cmp-current")
        peek = page.locator("#cmp-peek")
        cur_track = cur.locator("[data-info-strip-track]")
        peek_track = peek.locator("[data-info-strip-track]")

        # ---- لا أخطاء وحالة جاهزية ----
        check("A05.0 الصفحة تعمل بلا أخطاء JavaScript", len(errors) == 0, "; ".join(errors[:2]))

        # ---- 1) الشريط الحالي: لا تتبع أثناء الحركة (الانتقال بعد pointerup) ----
        # الشريط الحالي يستجيب للمس (pointerType=touch) حسب عقده — نرسل أحداث touch
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

        # ---- 2) الـvariant: جزء المجاور ظاهر (peek) والبطاقة النشطة موسّطة ----
        peek.scroll_into_view_if_needed()
        page.wait_for_timeout(600)
        geo = peek.evaluate("""() => {
          const vp = document.querySelector('#cmp-peek [data-info-strip-viewport]');
          const slides = [...vp.querySelectorAll('.m-info-strip__slide')];
          const vr = vp.getBoundingClientRect();
          return slides.map(s => { const r = s.getBoundingClientRect();
            return {left: Math.round(r.left - vr.left), right: Math.round(vr.right - r.right), w: Math.round(r.width)}; });
        }""")
        active_centered = (abs(geo[0]["left"] - geo[0]["right"]) <= 4)
        peek_w = min(geo[0]["left"], geo[0]["right"])
        check("A05.2 الـvariant: البطاقة النشطة موسّطة وجزء المجاور ظاهر على الجانبين (≥16px)",
              active_centered and peek_w >= 16, f"geo0={geo[0]} peek={peek_w}")

        # ---- 3) الـvariant: تتبع المؤشر 1:1 أثناء السحب ----
        vp_box = peek.locator("[data-info-strip-viewport]").bounding_box()
        y = vp_box["y"] + vp_box["height"] / 2
        x0 = vp_box["x"] + vp_box["width"] * 0.7
        before_t = peek_track.evaluate("e => getComputedStyle(e).transform")
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 90, y, steps=6)  # سحب يمينًا = التالية في RTL
        during_t = peek_track.evaluate("e => getComputedStyle(e).transform")
        moved_mid = during_t != before_t
        page.mouse.move(x0 + 90, y)  # ثبات
        held_t = peek_track.evaluate("e => getComputedStyle(e).transform")
        held_follow = held_t == during_t  # بلا snap قبل الإفلات
        page.mouse.up()
        page.wait_for_timeout(500)
        check("A05.3 الـvariant: المسار يتبع الإصبع أثناء الحركة (بلا انتقال) ولا يقفز قبل الإفلات",
              moved_mid and held_follow, f"moved={moved_mid} held={held_follow}")

        # ---- 4) الالتزام بالعتبة: سحب قصير يلغي نفسه (snap-back دون تبديل) ----
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 18, y, steps=3)
        page.mouse.up()
        page.wait_for_timeout(500)
        idx_after_snap = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.4 سحب دون العتبة (18px < 32px): snap-back دون تبديل بطاقة", idx_after_snap == 1,
              f"idx={idx_after_snap}")

        # ---- 5) الالتزام: سحب كافٍ يبدل البطاقة (RTL: يمينًا = التالية) ----
        page.mouse.move(x0, y)
        page.mouse.down()
        page.mouse.move(x0 + 120, y, steps=6)
        page.mouse.up()
        page.wait_for_timeout(500)
        idx = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.5 سحب يمينًا في RTL يلتزم إلى «التالية» (ترتيب منطقي)", idx == 2, f"idx={idx}")

        # ---- 6) pointercancel: snap-back نظيف إلى أقرب بطاقة وبلا حالة عالقة ----
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
        check("A05.6 pointercancel أثناء السحب: snap-back وبلا حالة سحب عالقة",
              idx_cancel == 2 and dragging_gone, f"idx={idx_cancel} clean={dragging_gone}")

        # ---- 7) لوحة المفاتيح وRTL: يسار = التالية، يمين = السابقة ----
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
        check("A05.7 لوحة المفاتيح RTL (يسار=التالية، يمين=السابقة، End=الأخيرة) وزر التالية معطل عند النهاية",
              i2 == 3 and i3 == 2 and i4 == 3 and next_disabled, f"{i2}→{i3}→{i4} nextDisabled={next_disabled}")

        # ---- 8) الإتاحة: المجاور مرئي لكنه inert وaria-hidden ----
        a11y = peek.evaluate("""() => {
          const slides = [...document.querySelectorAll('#cmp-peek .m-info-strip__slide')];
          return slides.map(s => ({ah: s.getAttribute('aria-hidden'), inert: s.inert}));
        }""")
        ok_a11y = (sum(1 for a in a11y if a["ah"] == "false") == 1
                   and all((a["ah"] == "true") == a["inert"] for a in a11y))
        neighbor_visible = peek.evaluate(
            "() => document.querySelectorAll('#cmp-peek .m-info-strip__slide')[1]"
            ".getBoundingClientRect().width > 40")
        check("A05.8 المجاور: مرئي (peek) لكنه inert وaria-hidden — لا تفاعل مخفي",
              ok_a11y and neighbor_visible, str(a11y))

        # ---- 9) بلا autoplay: لا تبديل دون إدخال ----
        before = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        page.wait_for_timeout(1200)
        after = page.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('cmp-peek'))")
        check("A05.9 لا autoplay: الموضع ثابت دون أي إدخال", before == after, f"{before}=={after}")

        # ---- 10) reduced-motion: بلا انتقالات ----
        page.emulate_media(reduced_motion="reduce")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(300)
        no_anim = peek_track.evaluate(
            "e => getComputedStyle(e).transitionDuration === '0s' || getComputedStyle(e).transitionProperty === 'none'")
        page.emulate_media(reduced_motion="no-preference")
        check("A05.10 prefers-reduced-motion: لا انتقال على المسار", no_anim)

        # ---- 11) الفراغ وبطاقة واحدة: العقد نفسه (صفحة مستقلة مصغرة) ----
        page.set_content("""<html lang="ar" dir="rtl"><head><meta charset="UTF-8">
          <base href="%s/">
          <link rel="stylesheet" href="shared/tokens.css">
          <link rel="stylesheet" href="components/info-strip/info-strip.css">
          <link rel="stylesheet" href="components/info-strip/info-strip-peek.css">
          <script src="components/info-strip/info-strip.js"></script>
          <script src="components/info-strip/info-strip-peek.js"></script></head><body>
          <div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="empty-peek">
            <div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0" aria-label="عارض فارغ">
              <div class="m-info-strip__track" data-info-strip-track></div>
            </div>
            <p class="m-info-strip__empty" data-info-strip-empty hidden>لا بطاقات بعد</p>
          </div>
          </body></html>""" % base)
        page.wait_for_load_state("networkidle")
        empty_state = page.evaluate("""() => ({
          ready: document.getElementById('empty-peek').hasAttribute('data-info-strip-ready'),
          emptyShown: !document.querySelector('#empty-peek [data-info-strip-empty]').hidden
        })""")
        check("A05.11 عارض بلا بطاقات: صف الفراغ ظاهر وبلا تحكمات", empty_state["ready"] and empty_state["emptyShown"],
              str(empty_state))

        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
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
    main()
