#!/usr/bin/env python3
"""Focused Chromium checks for exact external readings in metric circles."""

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from browser_support import chromium_launch_options  # noqa: E402

BASE = os.environ.get("MICRO_TEST_BASE", "http://127.0.0.1:5000").rstrip("/")
URL = BASE + "/components/metric-comparison/example-usage.html"
RESULTS = []


def check(name, condition, detail=None):
    RESULTS.append((name, bool(condition), detail))
    print(("PASS " if condition else "FAIL ") + name + (f" — {detail}" if detail else ""))


def rendered_reading_state(page):
    return page.locator("[data-metric-circles]").evaluate("""chart => {
      const source = [...chart.querySelectorAll('[data-metric-source] [data-label]')];
      const rows = [...chart.querySelectorAll('[data-metric-fallback] > li')];
      const labels = rows.map(row => row.querySelector('.m-metric-circles__fallback-label')?.textContent || '');
      const readings = rows.map(row => row.querySelector('.m-metric-circles__fallback-reading')?.textContent || '');
      const labelRects = rows.map(row => row.querySelector('.m-metric-circles__fallback-label').getBoundingClientRect());
      const readingRects = rows.map(row => row.querySelector('.m-metric-circles__fallback-reading').getBoundingClientRect());
      const rect = el => { const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; };
      return {
        sourceLabels: source.map(item => item.getAttribute('data-label') || ''),
        rows: rows.length, labels, readings,
        labelsAligned: labelRects.every(r => Math.abs(r.x - labelRects[0].x) < 1),
        readingsAligned: readingRects.every(r => Math.abs(r.x - readingRects[0].x) < 1),
        listVisible: getComputedStyle(chart.querySelector('[data-metric-fallback]')).display !== 'none',
        diagramHidden: chart.querySelector('[data-metric-items]').getAttribute('aria-hidden') === 'true',
        noEmbeddedText: !chart.querySelector('.m-metric-circles__bubble-content, .m-metric-circles__inside-label, .m-metric-circles__inside-reading'),
        circleStates: [...chart.querySelectorAll('.m-metric-circles__item')].map(item => ({
          state:item.getAttribute('data-state'),
          rect:rect(item),
          inside:item.getAttribute('data-inside')
        })),
        overflow: chart.scrollWidth > chart.clientWidth + 1 ||
          chart.querySelector('[data-metric-fallback]').scrollWidth >
            chart.querySelector('[data-metric-fallback]').clientWidth + 1,
        height: chart.getBoundingClientRect().height,
        width: chart.getBoundingClientRect().width
      };
    }""")


def main():
    errors = []
    checks_before = 0
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, **chromium_launch_options())
        print(f"Chromium {browser.version}")
        for viewport, direction in [(320, "rtl"), (360, "rtl"), (390, "rtl"),
                                    (430, "rtl"), (390, "ltr")]:
            page = browser.new_page(viewport={"width": viewport, "height": 850})
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(URL, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.evaluate("(dir) => { document.documentElement.dir = dir; }", direction)
            page.wait_for_timeout(80)
            chart = page.locator("[data-metric-circles]").first
            width = chart.evaluate("el => el.getBoundingClientRect().width")
            initial = rendered_reading_state(page)
            suffix = f"{viewport}px {direction} (component {width:.1f}px)"

            check(f"{suffix}: every source row has one visible exact reading",
                  initial["rows"] == len(initial["sourceLabels"]) == 3
                  and initial["labels"] == initial["sourceLabels"])
            check(f"{suffix}: common external label/value columns stay aligned",
                  initial["labelsAligned"] and initial["readingsAligned"])
            check(f"{suffix}: circle artwork is decorative and has no duplicate text",
                  initial["diagramHidden"] and initial["noEmbeddedText"]
                  and all(item["inside"] == "false" for item in initial["circleStates"]))
            check(f"{suffix}: full list and drawing do not overflow",
                  initial["listVisible"] and not initial["overflow"]
                  and page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"))

            # Circle area continues to encode absolute magnitude; the new key
            # is independent of either layout and does not affect the geometry.
            page.evaluate("""() => {
              const chart = document.querySelector('[data-metric-circles]');
              window.MicroMetricComparison.render(chart);
            }""")
            separated = rendered_reading_state(page)
            areas = [item["rect"]["w"] * item["rect"]["h"] for item in separated["circleStates"]]
            ratios_ok = len(areas) == 3 and areas[1] > 0 and areas[2] > 0 and (
                abs(areas[0] / areas[1] - 64 / 25) < 0.08
                and abs(areas[0] / areas[2] - 64 / 9) < 0.12)
            check(f"{suffix}: separated circle area ratios remain 64:25:9",
                  ratios_ok, [round(area, 1) for area in areas])

            page.evaluate("""() => {
              const chart = document.querySelector('[data-metric-circles]');
              chart.setAttribute('data-layout','overlap');
              window.MicroMetricComparison.render(chart);
            }""")
            overlap = rendered_reading_state(page)
            overlap_areas = [item["rect"]["w"] * item["rect"]["h"] for item in overlap["circleStates"]]
            overlap_ratio_ok = len(overlap_areas) == 3 and overlap_areas[2] > 0 and (
                abs(overlap_areas[0] / overlap_areas[2] - 64 / 9) < 0.12)
            check(f"{suffix}: overlap keeps area scale and complete external key",
                  overlap_ratio_ok and overlap["rows"] == 3
                  and overlap["labels"] == overlap["sourceLabels"])

            page.evaluate("""() => {
              const chart = document.querySelector('[data-metric-circles]');
              const values = [...chart.querySelectorAll('[data-metric-source] [data-label]')];
              values[0].setAttribute('data-value', '64');
              values[1].setAttribute('data-value', '-25');
              values[2].setAttribute('data-value', '9');
              chart.setAttribute('data-layout', 'separated');
              window.MicroMetricComparison.render(chart);
            }""")
            signed = rendered_reading_state(page)
            signed_areas = [item["rect"]["w"] * item["rect"]["h"] for item in signed["circleStates"]]
            check(f"{suffix}: signed values retain absolute-area ratios and exact minus sign",
                  [item["state"] for item in signed["circleStates"]] ==
                  ["positive", "negative", "positive"]
                  and len(signed_areas) == 3
                  and abs(signed_areas[0] / signed_areas[1] - 64 / 25) < 0.08
                  and abs(signed_areas[0] / signed_areas[2] - 64 / 9) < 0.12
                  and signed["readings"][1] == "-25 وحدة")

            page.evaluate("""() => {
              const chart = document.querySelector('[data-metric-circles]');
              chart.setAttribute('data-max', '1');
              window.MicroMetricComparison.render(chart);
            }""")
            invalid_scale = rendered_reading_state(page)
            check(f"{suffix}: rejected scale keeps all exact readings without plotting",
                  invalid_scale["rows"] == 3 and len(invalid_scale["circleStates"]) == 0
                  and invalid_scale["labels"] == invalid_scale["sourceLabels"])

            page.evaluate("""() => {
              const chart = document.querySelector('[data-metric-circles]');
              chart.removeAttribute('data-max');
              const source = chart.querySelector('[data-metric-source]');
              source.innerHTML =
                '<li data-label="تسمية عربية طويلة جدًا لاختبار التفاف عمود المفتاح دون قص" data-value="-1250" data-unit="وحدة" data-series="a"></li>' +
                '<li data-label="صفر" data-value="0" data-unit="وحدة" data-series="b"></li>' +
                '<li data-label="قراءة غير متاحة" data-value="" data-unit="وحدة" data-state="unavailable" data-series="c"></li>' +
                '<li data-label="قراءة غير صالحة" data-value="ليس رقمًا" data-unit="وحدة" data-series="d"></li>' +
                '<li data-label="قيمة كبيرة" data-value="1234567890123" data-display-value="1,234,567,890,123 وحدة" data-unit="وحدة" data-series="e"></li>';
              window.MicroMetricComparison.render(chart);
            }""")
            states = rendered_reading_state(page)
            check(f"{suffix}: negative, zero, unavailable, invalid, and long values all remain in key",
                  states["rows"] == 5
                  and states["labels"] == [
                      "تسمية عربية طويلة جدًا لاختبار التفاف عمود المفتاح دون قص",
                      "صفر", "قراءة غير متاحة", "قراءة غير صالحة", "قيمة كبيرة"]
                  and states["readings"][0] == "-1250 وحدة"
                  and states["readings"][1] == "0 وحدة"
                  and states["readings"][2] == "— وحدة"
                  and states["readings"][4] == "1,234,567,890,123 وحدة")
            check(f"{suffix}: state marks and wrapped readings remain overflow-safe",
                  [item["state"] for item in states["circleStates"]] == ["negative", "zero", "positive"]
                  and states["listVisible"] and not states["overflow"]
                  and page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"))
            page.close()

        browser.close()
    check("Chromium reports no uncaught page errors", not errors, errors[:3])
    passed = sum(1 for _, success, _ in RESULTS if success)
    failed = len(RESULTS) - passed
    print(f"RESULT {passed}/{len(RESULTS)} passed; {failed} failed")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
