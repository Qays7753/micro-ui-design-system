"""Catch ErrorEvents (including non-Error ResizeObserver failures) on reveal."""
import argparse
import json
import os
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
    parser.add_argument("--out", type=Path, default=ROOT / "generated-artifacts/runtime-fix")
    args = parser.parse_args()
    if not args.base:
        parser.error("--base is required outside Replit")
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(**chromium_launch_options())
        targets = {
            "source": args.base.rstrip("/") + "/previews/ui-system-showcase/index.html",
            "standalone": (ROOT / "previews/ui-system-showcase/standalone.html").as_uri(),
        }
        for version, url in targets.items():
            for width in (320, 360, 390, 430):
                for direction in ("rtl", "ltr"):
                    page = browser.new_page(viewport={"width": width, "height": 844})
                    page.add_init_script(INSTRUMENT)
                    page_errors = []
                    page.on("pageerror", lambda error, errors=page_errors: errors.append(str(error)))
                    page.goto(url, wait_until="load")
                    page.evaluate("document.fonts.ready")
                    before = page.evaluate(SNAPSHOT)
                    page.locator('[data-showcase-view="state"]').first.click()
                    page.locator(f'[data-sc-dir="{direction}"]').click()
                    page.locator(f'[data-sc-w="{width}"]').click()
                    for _ in range(2):
                        page.locator('[data-showcase-view="overview"]').first.click()
                        page.locator('[data-showcase-view="state"]').first.click()
                        page.wait_for_timeout(160)
                    trigger = page.locator('#sc-ocal-root [data-ocal-action="month-picker"]')
                    trigger.click()
                    page.locator("#sc-ocal-root [data-ocal-picker]").wait_for(state="visible")
                    page.keyboard.press("Escape")
                    page.set_viewport_size({"width": 460 if width < 390 else 320, "height": 844})
                    page.wait_for_timeout(180)
                    page.set_viewport_size({"width": width, "height": 844})
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
        browser.close()
    passed = sum(sum(case["checks"].values()) for case in results)
    total = sum(len(case["checks"]) for case in results)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "verification.json").write_text(json.dumps({
        "passed": passed, "failed": total - passed, "cases": results,
        "scope": "Light-only, Chromium, source plus file:// standalone; no Dark tests",
    }, indent=2), encoding="utf-8")
    print(f"{passed}/{total} PASS")
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
