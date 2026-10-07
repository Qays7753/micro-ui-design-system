#!/usr/bin/env python3
"""Leader spot-verification probe: CAL-R1-02 (mystery legend) and D1 (peek stale geometry).

Run from repo root with preview server on :5000. Evidence-only; touches no source.
"""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000/previews/ux-patterns/mobile-record-sample/"
CHROME = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/leader/leader-spot.json"


def main() -> int:
    result = {"meta": {"page": BASE, "viewport": 360, "browser": "chromium 143", "commit": "a5500c9"}}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        page = browser.new_page(viewport={"width": 360, "height": 800})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE)
        # gateway entry
        page.fill("#f03-gw-email", "user@micro.jo")
        page.fill("#f03-gw-password", "pass-1234")
        page.click("button[type='submit']")
        page.wait_for_timeout(600)
        # open scheduled orders from home
        page.click("#f03-home-schedule")
        page.wait_for_timeout(800)
        legend = page.locator("[data-ocal-legend]").first
        legend_texts = legend.locator("[data-ocal-legend-item], li, span").all_inner_texts() if legend.count() else []
        legend_box = legend.bounding_box() if legend.count() else None
        mystery = page.locator("[data-ocal-legend] >> text=mystery")
        mystery_box = mystery.bounding_box() if mystery.count() else None
        result["cal_r1_02_mystery"] = {
            "legend_count": legend.count(),
            "legend_texts": [t.strip() for t in legend_texts if t.strip()][:8],
            "legend_box": legend_box,
            "mystery_count": mystery.count(),
            "mystery_box": mystery_box,
            "mystery_visible_text": mystery.first.inner_text() if mystery.count() else None,
        }
        # back home then reports for peek check
        back = page.locator("#f03-schedule-back")
        if back.count():
            back.first.click()
            page.wait_for_timeout(600)
        nav_reports = page.locator("#f03-nav-reports")
        nav_reports.click()
        page.wait_for_timeout(1000)
        # expand reports section if collapsed
        for sel in ["#sec-reports .m-section__head", "[data-section-head='reports']", ".m-section--collapsible .m-section__head"]:
            loc = page.locator(sel)
            if loc.count():
                try:
                    loc.first.click()
                    page.wait_for_timeout(700)
                except Exception:
                    pass
                break
        peek = page.locator("[data-info-strip-viewport]").first
        if peek.count():
            before = page.evaluate(
                """() => {
                    const vp = document.querySelector('[data-info-strip-viewport]');
                    const st = vp ? (vp.querySelector('.info-strip') || vp.firstElementChild) : null;
                    const active = st ? (st.querySelector('[aria-current], .is-active, [data-active]') || st) : null;
                    return {
                        viewportRect: vp.getBoundingClientRect().toJSON(),
                        stripTransform: st ? getComputedStyle(st).transform : null,
                        activeRect: active ? active.getBoundingClientRect().toJSON() : null,
                    };
                }"""
            )
            # one interaction: arrow key
            page.keyboard.press("ArrowLeft")
            page.wait_for_timeout(900)
            after = page.evaluate(
                """() => {
                    const vp = document.querySelector('[data-info-strip-viewport]');
                    const st = vp ? (vp.querySelector('.info-strip') || vp.firstElementChild) : null;
                    const active = st ? (st.querySelector('[aria-current], .is-active, [data-active]') || st) : null;
                    return {
                        stripTransform: st ? getComputedStyle(st).transform : null,
                        activeRect: active ? active.getBoundingClientRect().toJSON() : null,
                    };
                }"""
            )
            result["d1_peek_stale_geometry"] = {"viewport_count": peek.count(), "before_interaction": before, "after_one_interaction": after}
        else:
            result["d1_peek_stale_geometry"] = {"viewport_count": 0, "note": "peek viewport not found on reports view"}
        result["pageerrors"] = errors
        browser.close()
    import pathlib

    pathlib.Path(OUT).parent.mkdir(parents=True, exist_ok=True)
    pathlib.Path(OUT).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2)[:2600])
    return 0


if __name__ == "__main__":
    sys.exit(main())
