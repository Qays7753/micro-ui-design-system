#!/usr/bin/env python3
"""sw-update-check.py — proves the owner's installed PWA lands on the LATEST
build when he opens it (بلاغ المالك، جولة المستخدم 2026-11-28). Sequence on a
local server of ds/sim/dist:

  1. page 1: open the app over HTTP -> SW v1 installs and controls the page.
  2. append one byte to sw.js = «a new deploy happened».
  3. page 2 (the owner reopens the app): the page loads ALREADY controlled
     by v1; the browser re-fetches sw.js (its navigation update check, and
     an explicit register() as fallback) -> the new worker installs,
     skipWaiting+clientsClaim activate it -> the sim's controllerchange
     handler must reload the page by itself.
  4. PASS = page 2's `load` event fired at least TWICE (initial open + the
     handler's own reload) and the new worker is the controller — no manual
     second reload anywhere.
Usage: uv run python ds/sim/tools/sw-update-check.py [chromium|webkit] [url]
"""
import glob
import os
import sys

import time

from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sim_server import SIM_URL, serve  # noqa: E402


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


def main():
    engine = sys.argv[1] if len(sys.argv) > 1 else "chromium"
    if engine == "webkit":
        apply_webkit_env()
    dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
    sw_path = os.path.join(dist, "sw.js")
    with serve(dist):
        with sync_playwright() as pw:
            bt = pw.chromium if engine == "chromium" else pw.webkit
            browser = bt.launch()
            ctx = browser.new_context(viewport={"width": 390, "height": 844},
                                      has_touch=True, is_mobile=True, locale="ar")

            # 1. First visit: SW v1 installs and controls the page.
            page1 = ctx.new_page()
            page1.goto(SIM_URL, wait_until="networkidle")
            page1.wait_for_selector("[data-sim-version]", timeout=15000)
            for _ in range(60):
                if page1.evaluate("() => !!navigator.serviceWorker.controller"):
                    break
                time.sleep(0.25)
            assert page1.evaluate("() => !!navigator.serviceWorker.controller"), "v1 SW never took control"
            version = page1.get_attribute("[data-sim-version]", "data-sim-version")
            print(f"[1] v1 installed and controlling, version={version}")
            page1.close()

            # 2. A new deploy: the worker bytes change (the real deploy swaps
            #    the precache manifest; one byte is enough for an update).
            with open(sw_path, "ab") as f:
                f.write(b"//deploy\n")

            # 3. The owner reopens the app. Count `load` events: the initial
            #    open + the controllerchange handler's own reload >= 2.
            page2 = ctx.new_page()
            loads = {"n": 0}
            page2.on("load", lambda _p: loads.update(n=loads["n"] + 1))
            page2.goto(SIM_URL, wait_until="domcontentloaded")
            try:
                page2.wait_for_selector("[data-sim-version]", timeout=15000)
            except Exception:
                pass  # a mid-load reload restarts the wait below
            deadline = time.time() + 12
            while time.time() < deadline and loads["n"] < 2:
                if loads["n"] == 1 and not page2.is_closed():
                    try:
                        page2.evaluate("() => navigator.serviceWorker.register('/micro-ui-design-system/sw.js')")
                    except Exception:
                        pass
                time.sleep(0.25)
            try:
                ctrl = page2.evaluate("() => !!navigator.serviceWorker.controller")
                ver2 = page2.get_attribute("[data-sim-version]", "data-sim-version")
            except Exception:
                ctrl, ver2 = "?", "?"
            print(f"[2] reopen: load events={loads['n']} (2 = the handler reloaded by itself), "
                  f"controlled={ctrl}, version shown={ver2}")

            ok = loads["n"] >= 2 and ctrl is True
            print(f"{'PASS' if ok else 'FAIL'}: {'التحديث التلقائي يعمل — التطبيق وصل للنسخة الجديدة عند الفتح' if ok else 'التحديث التلقائي لا يعمل'}")
            browser.close()
            sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
