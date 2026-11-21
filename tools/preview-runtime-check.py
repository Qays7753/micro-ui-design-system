"""Catch ErrorEvents (including non-Error ResizeObserver failures) on reveal."""
import argparse
import json
import os
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]
INSTRUMENT = """
window.__previewErrors = [];
window.__previewResourceErrors = [];
window.__resizeDeliveries = 0;
addEventListener('error', event => {
  if (event instanceof ErrorEvent) {
    __previewErrors.push(event.message || 'ErrorEvent without a message');
  } else {
    __previewResourceErrors.push({
      tag: event.target.tagName, src: event.target.getAttribute('src'),
      fallback: event.target.hasAttribute('data-avatar-fallback')
    });
  }
}, true);
addEventListener('unhandledrejection', event => {
  __previewErrors.push('Unhandled rejection: ' + String(event.reason));
});
const NativeObserver = window.ResizeObserver;
window.ResizeObserver = class extends NativeObserver {
  constructor(callback) {
    super((entries, observer) => {
      __resizeDeliveries++;
      callback(entries, observer);
    });
  }
};
"""
SNAPSHOT = """() => ({
  source: [...document.querySelectorAll('.m-chart__data')].map(n => n.innerHTML),
  selected: document.querySelector('#sc-ocal-root').getAttribute('data-ocal-selected-date')
})"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    domain = os.environ.get("REPLIT_DEV_DOMAIN")
    parser.add_argument("--base", default="https://" + domain if domain else None)
    parser.add_argument("--out", type=Path,
                        default=Path(tempfile.mkdtemp(prefix="micro-preview-runtime-")))
    parser.add_argument('--review-scope', action='store_true', help='360x780 RTL/LTR; targeted 320 resize only; no zoom')
    parser.add_argument('--standalone-http', action='store_true', help='serve the same generated file over HTTP when browser policy blocks file://; does not establish file:// support')
    args = parser.parse_args()
    if not args.base:
        parser.error("--base is required outside Replit")
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(**chromium_launch_options())
        targets = {
            "source": args.base.rstrip("/") + "/previews/ui-system-showcase/index.html",
            "standalone": (args.base.rstrip("/") + "/previews/ui-system-showcase/standalone.html"
                           if args.standalone_http else (ROOT / "previews/ui-system-showcase/standalone.html").as_uri()),
        }
        for version, url in targets.items():
            for width in ((360,) if args.review_scope else (320, 360, 390, 430)):
                for direction in ("rtl", "ltr"):
                    page = browser.new_page(viewport={"width": width, "height": 780 if args.review_scope else 844})
                    page.add_init_script(INSTRUMENT)
                    page_errors = []
                    page.on("pageerror", lambda error, errors=page_errors: errors.append(str(error)))
                    page.goto(url, wait_until="load")
                    page.evaluate("document.fonts.ready")
                    before = page.evaluate(SNAPSHOT)
                    # عقد 2026-10-25: الدخول الافتراضي هو المعاينة المحمولة؛
                    # الفحص يدخل مختبر الحالات عبر رابط العمق الموثق.
                    page.evaluate("location.hash = '#state-lab'")
                    page.wait_for_timeout(350)
                    page.locator(f'[data-sc-dir="{direction}"]').click()
                    page.locator(f'[data-sc-w="{width}"]').click()
                    for _ in range(2):
                        page.evaluate("location.hash = '#sc-canvas'")
                        page.wait_for_timeout(160)
                        page.evaluate("location.hash = '#state-lab'")
                        page.wait_for_timeout(160)
                    trigger = page.locator('#sc-ocal-root [data-ocal-action="month-picker"]')
                    trigger.click()
                    page.locator("#sc-ocal-root [data-ocal-picker]").wait_for(state="visible")
                    page.keyboard.press("Escape")
                    page.set_viewport_size({"width": 320 if args.review_scope else (460 if width < 390 else 320), "height": 780 if args.review_scope else 844})
                    page.wait_for_timeout(180)
                    page.set_viewport_size({"width": width, "height": 780 if args.review_scope else 844})
                    page.wait_for_timeout(350)
                    deliveries = page.evaluate("__resizeDeliveries")
                    page.wait_for_timeout(250)
                    errors = page.evaluate("__previewErrors") + page_errors
                    resources = page.evaluate("__previewResourceErrors")
                    after = page.evaluate(SNAPSHOT)
                    checks = {
                        "no_window_or_page_errors": not errors,
                        # Showcase deliberately demonstrates a failed-image fallback.
                        # No other failed asset is accepted, nor any ErrorEvent.
                        "no_unexpected_resource_errors": all(
                            error == {"tag": "IMG", "src": "data:text/plain,not-an-image", "fallback": True}
                            for error in resources),
                        "observer_deliveries_settle": page.evaluate("__resizeDeliveries") == deliveries,
                        "source_values_unchanged": before["source"] == after["source"],
                        "selected_date_unchanged": before["selected"] == after["selected"],
                        "calendar_visible": page.locator("#sc-ocal-root").is_visible(),
                        "charts_rendered": page.locator('[data-plot] svg').count() > 0,
                    }
                    results.append({"version": version, "width": width, "dir": direction,
                                    "checks": checks, "errors": errors, "resource_errors": resources})
                    print(version, width, direction, "PASS" if all(checks.values()) else "FAIL", errors)
                    page.close()
        # F7 (R1 الجولة الثانية): روابط footer صفحة concepts روابط حقيقية
        # لملفات موجودة — 4 روابط <a href> تحل إلى استجابات ناجحة.
        page = browser.new_page(viewport={"width": 360, "height": 780})
        page.goto(args.base.rstrip("/") + "/previews/concepts/index.html", wait_until="load")
        footer_hrefs = page.eval_on_selector_all(
            "footer.concept-footer a[href]",
            "els => els.map(el => el.getAttribute('href'))")
        footer_links_ok = len(footer_hrefs) == 4 and all(h and not h.startswith("#") for h in footer_hrefs)
        footer_resolved = []
        for href in footer_hrefs:
            url = page.evaluate("h => new URL(h, location.href).toString()", href)
            footer_resolved.append((href, page.request.get(url).ok))
        footer_targets_ok = all(ok for _href, ok in footer_resolved)
        results.append({
            "version": "concepts-footer", "width": 360, "dir": "rtl",
            "checks": {"concepts_footer_four_links": footer_links_ok,
                       "concepts_footer_links_resolve": footer_targets_ok},
            "errors": [], "resource_errors": [], "link_targets": footer_resolved,
        })
        print("concepts-footer", 360, "rtl",
              "PASS" if footer_links_ok and footer_targets_ok else "FAIL", footer_resolved)
        page.close()
        # R3.4 (الجولة الثانية): مثال ESM — استيراد الوحدات عبر importmap مع
        # init يدوي ودورة SPA (destroy ثم إعادة تركيب): صفر أخطاء، صفر موارد
        # فاشلة، والمكونات مرسومة فعلًا من dist/esm.
        page = browser.new_page(viewport={"width": 360, "height": 780})
        page.add_init_script(INSTRUMENT)
        page_errors = []
        page.on("pageerror", lambda error, errors=page_errors: errors.append(str(error)))
        page.goto(args.base.rstrip("/") + "/examples/esm-app/index.html", wait_until="load")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(300)
        mounted = page.evaluate("""() => ({
          button: !!document.querySelector('.m-btn'),
          field: !!document.querySelector('.m-field__control'),
          product: document.querySelector('#product-root').classList.contains('m-product')
            && document.querySelector('#product-root').children.length > 0,
        })""")
        page.click("#esm-remove")
        page.wait_for_timeout(150)
        destroyed = page.evaluate(
            "() => document.querySelector('#product-root').children.length === 0")
        page.click("#esm-remount")
        page.wait_for_timeout(150)
        remounted = page.evaluate(
            "() => document.querySelector('#product-root').children.length > 0")
        esm_errors = page.evaluate("__previewErrors") + page_errors
        esm_resources = page.evaluate("__previewResourceErrors")
        esm_checks = {
            "esm_app_components_mounted": all(mounted.values()),
            "esm_app_destroy_clears_dom": destroyed,
            "esm_app_remount_restores": remounted,
            "esm_app_no_errors": not esm_errors,
            "esm_app_no_resource_errors": not esm_resources,
        }
        results.append({"version": "esm-app", "width": 360, "dir": "rtl",
                        "checks": esm_checks, "errors": esm_errors,
                        "resource_errors": esm_resources})
        print("esm-app", 360, "rtl",
              "PASS" if all(esm_checks.values()) else "FAIL", esm_errors)
        page.close()
        browser.close()
    passed = sum(sum(case["checks"].values()) for case in results)
    total = sum(len(case["checks"]) for case in results)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "verification.json").write_text(json.dumps({
        "passed": passed, "failed": total - passed, "cases": results,
        "scope": "Light-only Chromium source + standalone over " + ("HTTP" if args.standalone_http else "file://") + "; no Dark tests",
        "reviewScope": args.review_scope,
    }, indent=2), encoding="utf-8")
    print(f"{passed}/{total} PASS")
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
