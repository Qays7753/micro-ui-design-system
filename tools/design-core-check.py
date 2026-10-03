#!/usr/bin/env python3
"""Verify the unified gallery, real-source compositions and carousel boundaries."""
import argparse
import hashlib
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("MICRO_TEST_BASE", "http://127.0.0.1:5000")
FAMILIES = ("buttons", "fields", "selection", "organization", "surfaces", "data",
            "messages", "navigation", "info-strip", "metric-comparison",
            "account-settings", "access-gateway")
PAGES = ("/previews/", "/previews/compositions/", *(
    f"/previews/compositions/{name}-example.html" for name in ("row", "form", "summary")))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--engine", choices=("chromium", "firefox", "webkit"), default="chromium")
    args = parser.parse_args()
    out = ROOT / "reviews" / "DESIGN-CORE"
    if args.engine != "chromium":
        out = out / args.engine
    shots = out / "screenshots"
    shots.mkdir(parents=True, exist_ok=True)
    results, errors, failed = [], [], []

    def check(name, condition):
        results.append({"name": name, "passed": bool(condition)})
        print(("PASS " if condition else "FAIL ") + name)

    with sync_playwright() as p:
        engine = getattr(p, args.engine)
        executable = shutil.which("chromium") if args.engine == "chromium" else None
        if args.engine == "chromium" and not executable:
            raise RuntimeError("Nix-managed Chromium is required")
        browser = engine.launch(**({"executable_path": executable} if executable else {}))
        page = browser.new_page(viewport={"width": 390, "height": 874}, has_touch=True)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("response", lambda r: failed.append(r.url) if r.status >= 400 else None)

        def load(path):
            page.goto(BASE + path)
            page.wait_for_load_state("networkidle")
            page.evaluate("document.fonts.ready")

        load("/previews/")
        check("Root redirects to unified gallery", page.request.get(BASE + "/").url.endswith("/previews/"))
        check("Twelve source families are discoverable", all(
            page.locator(f'a[href*="{family}/"]').count() for family in FAMILIES))
        check("Arabic RTL and local font loaded", page.evaluate(
            "document.documentElement.dir === 'rtl' && document.fonts.check('500 16px \"IBM Plex Sans Arabic\"')"))
        links = page.locator("a[href]").evaluate_all("els => els.map(el => el.getAttribute('href'))")
        for href in sorted(set(links)):
            if not urlsplit(href).scheme and not href.startswith("#"):
                response = page.request.get(urljoin(page.url, href))
                check("Gallery link responds: " + href, response.ok)
        for private in ("/.agents/memory/MEMORY.md", "/attached_assets/", "/.replit", "/.local/tasks/"):
            check("Private workspace not served (GET/HEAD): " + private,
                  page.request.get(BASE + private).status == 404
                  and page.request.head(BASE + private).status == 404)

        for width in (320, 360, 390, 430):
            page.set_viewport_size({"width": width, "height": 874})
            for path in PAGES:
                load(path)
                check(f"{width}px {path}: no horizontal overflow", page.evaluate(
                    "document.documentElement.scrollWidth <= innerWidth + 1"))
                check(f"{width}px {path}: numeric direction preserved", page.evaluate(
                    "[...document.querySelectorAll('[dir=ltr]')].every(el => getComputedStyle(el).direction === 'ltr')"))
                if width == 390:
                    name = path.strip("/").replace("/", "-") or "gallery"
                    page.screenshot(path=str(shots / (name + ".png")), full_page=False)
                page.evaluate("""() => {
                  const sizes = [...document.querySelectorAll('body, body *')].map(el =>
                    [el, parseFloat(getComputedStyle(el).fontSize)]);
                  sizes.forEach(([el,size]) => el.style.fontSize = size * 2 + 'px');
                  if (window.MicroMetricComparison) MicroMetricComparison.render();
                }""")
                check(f"{width}px {path}: CSS text 200% no horizontal overflow", page.evaluate(
                    "document.documentElement.scrollWidth <= innerWidth + 1"))
                if width == 390 and path.endswith("summary-example.html"):
                    page.screenshot(path=str(shots / "summary-css-text-200.png"))

        page.set_viewport_size({"width": 390, "height": 874})
        load("/previews/compositions/form-example.html")
        page.locator("#composition-submit").click()
        check("Empty form exposes associated error and restores focus", page.evaluate("""() => {
          const input = document.querySelector('#composition-name');
          return input.getAttribute('aria-invalid') === 'true' && document.activeElement === input
            && input.getAttribute('aria-describedby').includes('composition-error')
            && document.querySelector('#composition-error').textContent.length > 0;
        }"""))
        page.locator("#composition-name").fill("  ")
        page.locator("#composition-submit").click()
        check("Invalid input is preserved", page.locator("#composition-name").input_value() == "  ")
        page.locator("#composition-name").fill("اسم تجريبي")
        page.locator("#composition-name").press("Enter")
        check("Keyboard submit validates locally without storage or navigation",
              "لم يُرسل" in page.locator("#composition-feedback").inner_text()
              and page.locator("#composition-name").get_attribute("aria-invalid") is None
              and page.url.endswith("form-example.html")
              and page.evaluate("localStorage.length === 0 && sessionStorage.length === 0"))
        page.locator("#composition-name").fill("تعديل")
        check("Editing clears stale success", not page.locator("#composition-feedback").inner_text())

        load("/previews/compositions/row-example.html")
        before = page.locator(".m-badge").inner_text()
        page.locator("#row-example button").first.click()
        check("Row action updates its demo state", page.locator(".m-badge").inner_text() != before)
        check("Row action is not inside a link and meets 48px target", page.locator(
            "#row-example button").first.evaluate("""el => {
              const r=el.getBoundingClientRect(); return !el.closest('a') && r.height >=48 && r.width>=48;
            }"""))
        load("/previews/compositions/summary-example.html")
        check("Summary consumes real metric renderer and preserves readings", page.evaluate(
            "!!window.MicroMetricComparison && document.querySelectorAll('.m-main-metric__bar').length > 0"))

        for count in (0, 1, 12):
            load("/previews/concepts/")
            page.evaluate("""count => {
              const old = document.querySelector('[data-info-strip]');
              const root = old.cloneNode(true);
              root.removeAttribute('data-info-strip-ready');
              const track = root.querySelector('[data-info-strip-track]');
              const sample = track.firstElementChild.cloneNode(true);
              track.replaceChildren();
              for(let i=0;i<count;i++) track.append(sample.cloneNode(true));
              // Empty-state copy is consumer-owned, as specified by the contract.
              const empty = document.createElement('p');
              empty.setAttribute('data-info-strip-empty', '');
              empty.hidden = true;
              empty.textContent = 'لا توجد بطاقات للعرض.';
              root.append(empty);
              old.replaceWith(root);
              MicroInfoStrip.init(root);
            }""", count)
            check(f"Carousel {count} cards: controls reflect cardinality",
                  page.locator("[data-info-strip-controls]").first.evaluate(
                      "el => el.hidden") == (count < 2))
            if not count:
                check("Empty carousel exposes explicit empty state",
                      page.locator("[data-info-strip-empty]").first.is_visible()
                      and not page.locator("[data-info-strip-viewport]").first.is_visible())
            else:
                check(f"Carousel {count} cards: current card and page count correct", page.evaluate(
                    f"document.querySelectorAll('[data-info-strip-page]').length === {count}"
                    " && document.querySelector('[data-info-strip-prev]').disabled"))
                if count > 1:
                    page.locator("[data-info-strip-viewport]").first.focus()
                    page.keyboard.press("End")
                    check("Many cards: End activates last card without hidden focus", page.evaluate(
                        "document.querySelector('[data-info-strip-next]').disabled"
                        " && [...document.querySelectorAll('.m-info-strip__slide')].filter(el => !el.inert).length === 1"))
                    page.keyboard.press("Home")
                    check("Many cards: Home returns to first card", page.locator(
                        "[data-info-strip-prev]").first.is_disabled())
            page.emulate_media(reduced_motion="reduce")
            check(f"Carousel {count} cards: reduced motion has no animated track",
                  page.locator("[data-info-strip-track]").first.evaluate(
                      "el => parseFloat(getComputedStyle(el).transitionDuration) === 0"))
            page.emulate_media(reduced_motion="no-preference")

        check("No page runtime errors", not errors)
        check("No failed source asset responses", not failed)
        source = {}
        for folder in ("components", "shared", "previews"):
            for path in sorted((ROOT / folder).rglob("*")):
                if path.is_file() and not path.is_symlink():
                    source[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
        source["tools/design-core-check.py"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
        report = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "engine": args.engine, "version": browser.version, "base": BASE,
            "text_enlargement": "computed CSS font sizes doubled; not native browser/device zoom",
            "physical_device": False, "screen_reader": False,
            "other_engines": {name: {"installed": Path(getattr(p, name).executable_path).exists(),
                                     "tested": name == args.engine}
                              for name in ("firefox", "webkit")},
            "results": results, "errors": errors, "failed_assets": failed, "source_sha256": source,
            "passed": sum(r["passed"] for r in results), "total": len(results),
        }
        (out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
        browser.close()
    print(f'{report["passed"]}/{report["total"]} checks passed')
    if report["passed"] != report["total"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()