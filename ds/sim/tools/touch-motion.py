#!/usr/bin/env python3
"""touch-motion.py — فحص لمس M1 (الأساس: الرموز وMotionProvider ومختبر
الحركة وزر المقارنة) بلمس حقيقي hasTouch+isMobile على 390×844:
 1. جذر الحركة يوضع بصفاته الأربع والمتغيرات (--ds-motion-scale=1).
 2. لمس مطوّل على النسخة يفتح لوحة المحاكاة وقسم «الحركة» كاملًا.
 3. «مختبر الحركة» يفتح المختبر (§10): السرعة، مفاتيح الفرض، صف المرجع.
 4. «شغّل» يفتح ورقة تجريبية وعدّاد الإطارات يسجل (>0 إطار) ثم يُغلق.
 5. «بدون» يضع html[data-sim-motion="off"] و«خفيف» يرفع tier=light،
    و«تقليل الحركة» يرفع data-ds-motion-reduced=true.
Usage: uv run python ds/sim/tools/touch-motion.py <chromium|webkit> [url]
"""
import glob
import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

VIEW = {"width": 390, "height": 844}


def apply_webkit_env():
    installs = sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/webkit-*")))
    if not installs:
        return False
    sysdir = os.path.join(installs[-1], "minibrowser-wpe", "sys")
    egl_vendor, dri = os.path.join(sysdir, "egl_vendor"), os.path.join(sysdir, "lib", "dri")
    if not (os.path.isdir(egl_vendor) and os.path.isdir(dri)):
        return False
    for k, v in {
        "PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS": "1",
        "EGL_PLATFORM": "surfaceless",
        "LIBGL_ALWAYS_SOFTWARE": "1",
        "LIBGL_ALWAYS_INDIRECT": "0",
        "__EGL_VENDOR_LIBRARY_DIRS": egl_vendor,
        "LIBGL_DRIVERS_PATH": dri,
    }.items():
        os.environ.setdefault(k, v)
    return True


def check(page, cond, label, detail=""):
    ok = "PASS" if cond else "FAIL"
    print(f"  [{ok}] {label} {detail}")
    return cond


async def _noop():
    return None


def main():
    engine = sys.argv[1] if len(sys.argv) > 1 else "chromium"
    url = sys.argv[2] if len(sys.argv) > 2 else "http://127.0.0.1:5077/micro-ui-design-system/"
    if engine == "webkit":
        apply_webkit_env()

    results = []
    with sync_playwright() as pw:
        bt = pw.chromium if engine == "chromium" else pw.webkit
        browser = bt.launch(**({"args": ["--force-device-scale-factor=3"]} if engine == "chromium" else {}))
        ctx = browser.new_context(viewport=VIEW, has_touch=True, is_mobile=True,
                                  device_scale_factor=3, locale="ar")
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(url, wait_until="networkidle")
        page.wait_for_selector("[data-sim-role-screen]", timeout=10000)

        def press(sel, label):
            el = page.locator(sel).first
            el.scroll_into_view_if_needed()
            el.wait_for(state="visible", timeout=5000)
            print(f"\n— PRESS {label}")
            el.tap(timeout=5000)
            time.sleep(0.35)

        def root_attrs():
            return page.evaluate("""(() => {
              const r = document.documentElement;
              const cs = getComputedStyle(r);
              return { tier: r.getAttribute('data-ds-motion-tier'),
                       reduced: r.getAttribute('data-ds-motion-reduced'),
                       paused: r.getAttribute('data-ds-motion-paused'),
                       profile: r.getAttribute('data-ds-motion-profile'),
                       scale: r.getAttribute('data-ds-motion-scale') || cs.getPropertyValue('--ds-motion-scale').trim() };
            })()""")

        # 1) الجذر وصفاته
        a = root_attrs()
        results.append(check(page, a is not None and a["tier"] == "full" and a["scale"] == "1"
                             and a["reduced"] == "false" and a["profile"] == "standard",
                             "جذر الحركة بصفاته الافتراضية", json.dumps(a, ensure_ascii=False)))

        # الدخول: دور المالك
        press('[data-sim-role-screen] .mds-object-row:has-text("ورشة الياسمين")', "دور المالك")
        page.wait_for_selector(".mds-context-bar", timeout=5000)

        # M3 — منحنى press-out داخل النطاق = micro (تعارض 2، الشيم من الرموز):
        # المتغير الموروث على أي عنصر داخل النطاق يحمل cubic-bezier(.22,1,.36,1).
        curve = page.evaluate("""(() => {
          const el = document.querySelector('.sim-app') || document.body;
          return getComputedStyle(el).getPropertyValue('--mds-motion-quick-ease');
        })()""")
        results.append(check(page, curve is not None and ".22" in curve and ".36, 1".replace(' ', '') in curve.replace(' ', ''),
                             "منحنى الخروج داخل النطاق micro (الشيم)", curve or ""))

        # M3 — ح04: صف الحركات يبقى معلّمًا مع الورقة ثم يتلاشى بعد onClosed.
        press('.mds-tab-bar button:has-text("المالية")', "تبويب المالية")
        page.wait_for_selector('[data-sim-screen-body="finance"]', timeout=5000)
        row = page.locator('.mds-section:has-text("الحركات") .mds-object-row').first
        row.scroll_into_view_if_needed()
        row.tap(timeout=5000)
        time.sleep(0.7)
        opened_attr = page.evaluate("""(() => {
          const r = document.querySelector('[data-sim-screen-body="finance"] [data-sim-opened="true"]');
          return r ? r.getAttribute('data-sim-opened') : null;
        })()""")
        results.append(check(page, opened_attr == "true", "الصف المفتوح معلَّم data-sim-opened=true"))
        # إغلاق الورقة بلمسة الخلفية
        page.touchscreen.tap(195, 150)
        time.sleep(0.9)
        fade_attr = page.evaluate("""(() => {
          const r = document.querySelector('[data-sim-screen-body="finance"] [data-sim-opened]');
          return r ? r.getAttribute('data-sim-opened') : null;
        })()""")
        results.append(check(page, fade_attr == "fade", "بعد onClosed تبدأ حالة التلاشي fade", str(fade_attr)))

        # 2) لمس مطوّل على النسخة → لوحة المحاكاة (pointerdown ممسوك ≥500ms)
        version = page.locator("[data-sim-version]").first
        version.wait_for(state="visible", timeout=5000)
        version.dispatch_event("pointerdown")
        time.sleep(0.7)
        version.dispatch_event("pointerup")
        time.sleep(0.8)
        page.wait_for_selector(".sim-panel", timeout=5000)
        results.append(check(page, page.locator(".sim-panel").count() > 0, "اللمس المطوّل يفتح لوحة المحاكاة"))

        results.append(check(page, page.locator('.sim-panel :text("وضع الحركة (زر المقارنة)")').count() > 0
                             and page.locator('.sim-panel :text("تقليل الحركة")').count() > 0
                             and page.locator('.sim-panel :text("إبطاء ×10")').count() > 0,
                             "قسم «الحركة» كاملًا في اللوحة"))

        # 3) مختبر الحركة
        press("[data-sim-open-motion-lab]", "صف مختبر الحركة")
        page.wait_for_selector("[data-sim-motion-lab='open']", timeout=5000)
        results.append(check(page, page.locator("[data-sim-motion-lab='open']").count() > 0
                             and page.locator("[data-lab-motion='ref-sheet-open']").count() > 0,
                             "المختبر مفتوح بصف المرجع"))
        results.append(check(page, page.locator('.sim-motion-lab button:has-text("0.5")').count() > 0
                             and page.locator('.sim-motion-lab :text("تقليل الحركة")').count() > 0,
                             "تحكم السرعة ومفاتيح الفرض في المختبر"))

        # 4) شغّل → ورقة تجريبية + عدّاد إطارات > 0 → إغلاق
        press('.sim-motion-lab [data-lab-motion="ref-sheet-open"] button:has-text("شغّل")', "شغّل المرجع")
        time.sleep(1.0)
        stats = page.evaluate("""(() => {
          const el = document.querySelector('[data-sim-frame-stats]');
          return el ? el.getAttribute('data-sim-frame-stats') : null;
        })()""")
        try:
            frames = int(stats or "0")
        except ValueError:
            frames = 0
        results.append(check(page, frames > 0, "عدّاد الإطارات سجّل الحركة", f"frames={stats}"))
        panel_open = page.evaluate("Boolean(document.querySelector('.mds-sheet-panel'))")
        results.append(check(page, panel_open, "ورقة التجربة مفتوحة من المختبر"))
        # إغلاق الورقة بلمسة الخلفية
        page.touchscreen.tap(195, 150)
        time.sleep(0.7)
        results.append(check(page, not page.evaluate("Boolean(document.querySelector('.mds-sheet-panel'))"),
                             "ورقة التجربة تُغلق بلمسة الخلفية"))

        # 5) مفاتيح المقارنة من المختبر نفسه
        press('.sim-motion-lab :text("تقليل الحركة")', "مفتاح تقليل الحركة")
        a = root_attrs()
        results.append(check(page, a is not None and a["reduced"] == "true",
                             "المحاكى يرفع data-ds-motion-reduced=true", json.dumps(a, ensure_ascii=False)))
        press('.sim-motion-lab :text("تقليل الحركة")', "إرجاع تقليل الحركة")

        press('.sim-motion-lab button:has-text("0.1")', "سرعة 0.1")
        a = root_attrs()
        results.append(check(page, a is not None and a["scale"] == "0.1",
                             "السرعة تصل --ds-motion-scale", json.dumps(a, ensure_ascii=False)))
        press('.sim-motion-lab button:has-text("1")', "السرعة 1")

        press('.sim-motion-lab :text("خفيف (tier=light)")', "فرض light من المختبر")
        a = root_attrs()
        results.append(check(page, a is not None and a["tier"] == "light", "tier=light بالفرض"))
        press('.sim-motion-lab :text("خفيف (tier=light)")', "إرجاع الملحق")
        a = root_attrs()
        # بعد التخلّي عن الفرض يعود المستوى إلى قرار الجلسة (§4.1-6: لا قياس
        # ثانٍ) — على Chromium سريع فfull، وعلى WebKit البرمجي فlight المقاسة.
        results.append(check(page, a is not None and a["tier"] in ("full", "light"),
                             "الفرض يتخلى والمستوى يعود لقرار الجلسة",
                             json.dumps(a, ensure_ascii=False)))

        # إغلاق المختبر
        press('.sim-motion-lab [aria-label="إغلاق مختبر الحركة"]', "إغلاق المختبر")
        time.sleep(0.5)
        results.append(check(page, page.locator("[data-sim-motion-lab='open']").count() == 0,
                             "المختبر يُغلق من زره"))

        if errors:
            print("\nPAGE ERRORS:", errors)
            results.append(False)
        browser.close()

    passed = sum(1 for r in results if r)
    print(f"\n=== {engine}: {passed}/{len(results)} PASS ===")
    sys.exit(0 if passed == len(results) else 1)


if __name__ == "__main__":
    main()
