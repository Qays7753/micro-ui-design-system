#!/usr/bin/env python3
"""touch-sheets.py — the touch regression for the vanishing-sheet bug
(جولة الناقد): proves with REAL taps (tap(), hasTouch+isMobile, 390×844)
that every context-bar sheet OPENS, STAYS OPEN past the browser's
compatibility click (≥1s — the ghost click of the opening tap), and closes
only when the user taps the scrim. PASS/FAIL summary; exit 1 on any failure.

The bug (fixed by the sim's ghostClickGuard, library scrim unmodified):
openers fire onPress on pointerup, the sheet mounts, then the tap's
compatibility click lands on the fresh scrim and dismissed the sheet the
instant it opened — reproduced with tap() on Chromium and WebKit.

Usage: uv run python ds/sim/tools/touch-sheets.py <chromium|webkit> [url]
(url default: http://127.0.0.1:5077/micro-ui-design-system/ — serve
ds/sim/dist first, e.g. python scripts/serve_sim.py or `vite preview`.)
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


SHEET_JS = """(() => {
  const s = document.querySelector('.mds-sheet');
  if (!s) return { open: false };
  return { open: true, label: s.getAttribute('aria-label'),
           closing: s.className.includes('mds-sheet--closing') };
})()"""


def check(page, cond, label, detail=""):
    ok = "PASS" if cond else "FAIL"
    print(f"  [{ok}] {label} {detail}")
    return cond


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

        def tap(sel, label):
            el = page.locator(sel).first
            el.scroll_into_view_if_needed()
            el.wait_for(state="visible", timeout=5000)
            print(f"\n— TAP {label}")
            el.tap(timeout=5000)

        def sheet():
            return page.evaluate(SHEET_JS)

        def wait_closed(ms=2500):
            t0 = time.time()
            while time.time() - t0 < ms / 1000:
                if not sheet()["open"]:
                    return True
                time.sleep(0.05)
            return False

        # Enter the owner role.
        tap('[data-sim-role-screen] .mds-object-row:has-text("ورشة الياسمين")', "دور المالك")
        page.wait_for_selector(".mds-context-bar", timeout=5000)

        openers = [
            (".mds-context-bar .mds-project-switcher", "مبدّل المشروع"),
            ('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس"),
            ('.mds-context-bar [aria-label*="Ask"]', "زر Ask"),
        ]
        for sel, label in openers:
            tap(sel, f"يفتح {label}")
            st400 = page.evaluate(SHEET_JS)
            time.sleep(1.0)
            st1000 = sheet()
            results.append(check(page, st400["open"] and st1000["open"] and not st1000["closing"],
                                 f"{label}: يفتح ويبقى مفتوحًا بعد 1s",
                                 json.dumps(st1000, ensure_ascii=False)))
            # The user closes it: a real tap on the visible scrim (above
            # the panel — the scrim's element center sits behind it).
            page.touchscreen.tap(195, 150)
            results.append(check(page, wait_closed(), f"{label}: يُغلق بلمسة الخلفية"))
            time.sleep(0.4)

        if errors:
            print("\nPAGE ERRORS:", errors)
            results.append(False)
        browser.close()

    passed = sum(1 for r in results if r)
    print(f"\n=== {engine}: {passed}/{len(results)} PASS ===")
    sys.exit(0 if passed == len(results) else 1)


if __name__ == "__main__":
    main()
