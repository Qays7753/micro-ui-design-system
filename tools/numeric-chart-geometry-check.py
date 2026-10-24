#!/usr/bin/env python3
"""Focused Chromium checks for B05 line labels and packed-circle readings.

Uses the already-running local preview server; does not build or rewrite
standalone artifacts. Screenshots are disposable files under /tmp.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import chromium_launch_options


BASE_URL = os.environ.get("MICRO_CHART_TEST_BASE_URL", "http://127.0.0.1:5000")
VIEWPORTS = [
    (320, "rtl"),
    (360, "rtl"),
    (390, "rtl"),
    (430, "rtl"),
    (390, "ltr"),
]
SCREENSHOT_DIR = Path("/tmp/numeric-chart-geometry-check")


class Checks:
    def __init__(self) -> None:
        self.passed = 0
        self.failed = 0

    def check(self, name: str, condition: bool, detail: object = "") -> None:
        if condition:
            self.passed += 1
            print(f"PASS {name}")
        else:
            self.failed += 1
            print(f"FAIL {name}: {detail}")


def open_page(browser, path: str, width: int, direction: str):
    page = browser.new_page(viewport={"width": width, "height": 1100}, device_scale_factor=1)
    page_errors: list[str] = []
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.goto(f"{BASE_URL}{path}", wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    if direction == "ltr":
        page.evaluate("document.documentElement.dir = 'ltr'")
    return page, page_errors


def main() -> int:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    checks = Checks()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, **chromium_launch_options())
        print(f"Chromium {browser.version}; screenshots: {SCREENSHOT_DIR}")

        for width, direction in VIEWPORTS:
            page, page_errors = open_page(
                browser, "/components/data/example-usage.html", width, direction
            )
            line = page.locator("#line")
            if direction == "ltr":
                line.evaluate(
                    "(element) => { element.setAttribute('data-axis-dir', 'ltr'); "
                    "window.MicroData.render(element); }"
                )
                page.evaluate("document.fonts.ready")
            page.wait_for_timeout(60)
            sparse = line.evaluate(
                """chart => {
                  const plot = chart.querySelector('[data-plot]');
                  const svg = plot.querySelector('svg');
                  const p = plot.getBoundingClientRect();
                  const labels = [...svg.querySelectorAll('.m-chart__x-label')];
                  const dots = [...svg.querySelectorAll('g[data-point-index]')].map(g => {
                    const circle = g.querySelector('.m-chart__dot');
                    return circle ? {
                      index: Number(g.getAttribute('data-point-index')),
                      x: Number(circle.getAttribute('cx'))
                    } : null;
                  }).filter(Boolean);
                  return {
                    componentWidth: chart.getBoundingClientRect().width,
                    plotWidth: plot.getBoundingClientRect().width,
                    viewWidth: svg.viewBox.baseVal.width,
                    dir: chart.getAttribute('data-axis-dir') || 'rtl',
                    layout: chart.getAttribute('data-value-layout'),
                    rows: plot.querySelectorAll('.m-chart__readings > div').length,
                    labels: labels.map(label => ({
                      text: label.textContent.trim(),
                      visible: getComputedStyle(label).display !== 'none',
                      left: label.getBoundingClientRect().left,
                      right: label.getBoundingClientRect().right
                    })),
                    values: [...svg.querySelectorAll('.m-chart__point-value')]
                      .map(value => value.textContent.trim()),
                    polylines: svg.querySelectorAll('.m-chart__line').length,
                    dots,
                    font: getComputedStyle(labels[0]).fontFamily,
                    arabicFontLoaded: document.fonts.check(
                      '13px \"IBM Plex Sans Arabic\"', 'الأربعاء'
                    ),
                    latinFontLoaded: document.fonts.check(
                      '13px \"IBM Plex Sans\"', '1234567890'
                    )
                  };
                }"""
            )
            direction_name = direction.upper()
            print(
                f"MEASURE sparse-line viewport={width} {direction_name} "
                f"component={sparse['componentWidth']:.1f}px plot={sparse['plotWidth']:.1f}px "
                f"labels={sum(label['visible'] for label in sparse['labels'])}/"
                f"{len(sparse['labels'])} rows={sparse['rows']}"
            )
            checks.check(
                f"sparse line fits labels without full-row fallback at {width} {direction_name}",
                sparse["rows"] == 0
                and all(label["visible"] for label in sparse["labels"])
                and sparse["layout"] != "rows",
                sparse,
            )
            checks.check(
                f"all sparse line labels stay inside measured plot at {width} {direction_name}",
                all(
                    label["left"] >= line.locator("[data-plot]").evaluate(
                        "e => e.getBoundingClientRect().left"
                    ) - 0.5
                    and label["right"] <= line.locator("[data-plot]").evaluate(
                        "e => e.getBoundingClientRect().right"
                    ) + 0.5
                    for label in sparse["labels"]
                    if label["visible"]
                ),
                sparse["labels"],
            )
            expected_x = [
                sparse["viewWidth"] - 24 - i * (sparse["viewWidth"] - 48) / 4
                if sparse["dir"] == "rtl"
                else 24 + i * (sparse["viewWidth"] - 48) / 4
                for i in (0, 1, 3, 4)
            ]
            checks.check(
                f"endpoint label adjustment preserves line point coordinates at {width} {direction_name}",
                len(sparse["dots"]) == 4
                and all(abs(dot["x"] - x) < 0.1 for dot, x in zip(sparse["dots"], expected_x)),
                {"dots": sparse["dots"], "expected": expected_x},
            )
            checks.check(
                f"missing line point remains a real gap and full values remain {width} {direction_name}",
                sparse["polylines"] == 2
                and sparse["values"] == ["2", "7", "—", "4", "9"],
                sparse,
            )
            checks.check(
                f"actual Arabic and Latin display fonts are loaded at {width} {direction_name}",
                sparse["arabicFontLoaded"] and sparse["latinFontLoaded"],
                {"font": sparse["font"], "fonts": sparse},
            )

            dense = page.evaluate(
                """() => {
                  const chart = document.createElement('section');
                  chart.className = 'm-chart m-chart--line';
                  chart.setAttribute('data-chart', 'line');
                  chart.setAttribute('data-axis-dir',
                    document.documentElement.dir === 'ltr' ? 'ltr' : 'rtl');
                  chart.setAttribute('data-max', '10');
                  chart.innerHTML =
                    '<h3 class="m-chart__title">اختبار تسميات طويلة</h3>' +
                    '<ul class="m-chart__data" hidden>' +
                    '<li data-series="a" data-label="' + 'بداية'.repeat(18) + '" data-value="1"></li>' +
                    '<li data-series="a" data-label="' + 'حدّ'.repeat(18) + '" data-value="5" data-axis-boundary></li>' +
                    '<li data-series="a" data-label="' + 'نهاية'.repeat(18) + '" data-value="9"></li>' +
                    '</ul><div class="m-chart__plot" data-plot></div>' +
                    '<p class="m-chart__summary" data-summary>اختبار هندسي</p>';
                  document.querySelector('main').appendChild(chart);
                  window.MicroData.render(chart);
                  const svg = chart.querySelector('[data-plot] svg');
                  return {
                    chart,
                    layout: chart.getAttribute('data-value-layout'),
                    rows: [...chart.querySelectorAll('.m-chart__readings > div')]
                      .map(row => row.textContent.trim()),
                    values: [...chart.querySelectorAll('.m-chart__readings dd')]
                      .map(value => value.textContent.trim()),
                    dots: [...svg.querySelectorAll('g[data-point-index]')].map(g => {
                      const circle = g.querySelector('.m-chart__dot');
                      return circle ? Number(circle.getAttribute('cx')) : null;
                    }),
                    width: svg.viewBox.baseVal.width,
                    visiblePlotLabels: [...svg.querySelectorAll('.m-chart__x-label')]
                      .filter(label => getComputedStyle(label).display !== 'none').length,
                    sourceBoundaryPreserved: chart.querySelector(
                      '[data-axis-boundary]'
                    ) !== null
                  };
                }"""
            )
            checks.check(
                f"dense long semantic labels retain full readings in fallback at {width} {direction_name}",
                dense["layout"] == "rows"
                and dense["values"] == ["1", "5", "9"]
                and len(dense["rows"]) == 3
                and dense["visiblePlotLabels"] == 0
                and dense["sourceBoundaryPreserved"],
                dense,
            )
            dense_expected_x = [
                dense["width"] - 24,
                dense["width"] / 2,
                24,
            ] if direction == "rtl" else [
                24,
                dense["width"] / 2,
                dense["width"] - 24,
            ]
            checks.check(
                f"dense-label fallback preserves all point positions at {width} {direction_name}",
                len(dense["dots"]) == 3
                and all(abs(x - expected) < 0.1 for x, expected in zip(
                    dense["dots"], dense_expected_x
                )),
                {"dots": dense["dots"], "expected": dense_expected_x},
            )

            if width == 320 and direction == "rtl":
                canonical = page.evaluate(
                    """() => {
                      const chart = document.createElement('section');
                      chart.className = 'm-chart m-chart--bars';
                      chart.setAttribute('data-chart', 'bars');
                      chart.setAttribute('data-max', '2000');
                      chart.innerHTML =
                        '<ul class="m-chart__data" hidden>' +
                        '<li data-series="a" data-label="قيمة خام" data-value="1234.5" data-display="1,234.50"></li>' +
                        '<li data-series="b" data-label="حد المقياس" data-value="2000" data-display="2,000.00"></li>' +
                        '</ul><div class="m-chart__plot" data-plot></div>' +
                        '<p class="m-chart__summary" data-summary>اختبار الخام والعرض</p>';
                      document.querySelector('main').appendChild(chart);
                      window.MicroData.render(chart);
                      const rects = [...chart.querySelectorAll('.m-chart__bar')];
                      return {
                        ratio: rects[0].getBoundingClientRect().height
                          / rects[1].getBoundingClientRect().height,
                        displayed: [...chart.querySelectorAll('.m-chart__bar-value')]
                          .map(node => node.textContent.trim()),
                        rawTable: [...chart.querySelectorAll('.m-chart__dataset tbody td')]
                          .map(node => node.textContent.trim())
                      };
                    }"""
                )
                checks.check(
                    "canonical raw values control geometry while data-display formats visible readings",
                    abs(canonical["ratio"] - 1234.5 / 2000) < 0.01
                    and canonical["displayed"] == ["1,234.50", "2,000.00"]
                    and canonical["rawTable"] == ["1234.5", "2000"],
                    canonical,
                )
                line.screenshot(path=str(SCREENSHOT_DIR / "line-sparse-320-rtl.png"))
                page.locator("#bubble-states").screenshot(
                    path=str(SCREENSHOT_DIR / "bubble-states-320-rtl.png")
                )
            if width == 390 and direction == "ltr":
                line.screenshot(path=str(SCREENSHOT_DIR / "line-sparse-390-ltr.png"))
            checks.check(
                f"no uncaught browser exceptions in B05 preview at {width} {direction_name}",
                not page_errors,
                page_errors,
            )
            page.close()

        for width, direction in VIEWPORTS:
            page, page_errors = open_page(
                browser, "/previews/ui-system-showcase/index.html", width, direction
            )
            page.locator('[data-sc-filter="all"]').click()
            page.wait_for_timeout(60)
            packed = page.locator("#sc-chart-packed")
            if direction == "ltr":
                packed.evaluate("element => element.style.direction = 'ltr'")
            page.evaluate("document.fonts.ready")

            default_readings = packed.evaluate(
                """chart => {
                  const visible = element => {
                    const style = getComputedStyle(element);
                    return element.getClientRects().length > 0
                      && style.display !== 'none' && style.visibility !== 'hidden';
                  };
                  const readings = [...chart.querySelectorAll(
                    '.m-bubble__value, .m-legend__value'
                  )].filter(visible).map(node => node.textContent.trim());
                  return {
                    width: chart.getBoundingClientRect().width,
                    values: readings,
                    hiddenCircleValues: [...chart.querySelectorAll(
                      '.m-bubble__circle .m-bubble__value'
                    )].every(node => getComputedStyle(node).visibility === 'hidden'
                      && node.getAttribute('aria-hidden') === 'true'),
                    keyCount: chart.querySelectorAll('.m-legend__item').length,
                    circleDiameters: [...chart.querySelectorAll('.m-bubble__circle')]
                      .map(circle => circle.getBoundingClientRect().width)
                  };
                }"""
            )
            checks.check(
                f"packed default has one exact-reading source at {width} {direction.upper()}",
                all(default_readings["values"].count(value) == 1
                    for value in ("84,300", "52,100", "12,000"))
                and default_readings["hiddenCircleValues"]
                and default_readings["keyCount"] == 3,
                default_readings,
            )
            checks.check(
                f"packed area ratios remain proportional at {width} {direction.upper()}",
                len(default_readings["circleDiameters"]) == 3
                and abs(
                    default_readings["circleDiameters"][0] ** 2
                    / default_readings["circleDiameters"][1] ** 2
                    - 84300 / 52100
                ) < 0.03
                and abs(
                    default_readings["circleDiameters"][1] ** 2
                    / default_readings["circleDiameters"][2] ** 2
                    - 52100 / 12000
                ) < 0.08,
                default_readings,
            )
            print(
                f"MEASURE packed viewport={width} {direction.upper()} "
                f"component={default_readings['width']:.1f}px "
                f"diameters={','.join(f'{diameter:.1f}' for diameter in default_readings['circleDiameters'])}px"
            )

            if width == 320 and direction == "rtl":
                packed.screenshot(path=str(SCREENSHOT_DIR / "packed-key-320-rtl.png"))

            packed.evaluate(
                """chart => {
                  chart.setAttribute('data-legend', 'off');
                  window.MicroPacked.render(chart);
                }"""
            )
            page.wait_for_timeout(40)
            compact_readings = packed.evaluate(
                """chart => {
                  const visible = element => {
                    const style = getComputedStyle(element);
                    return element.getClientRects().length > 0
                      && style.display !== 'none' && style.visibility !== 'hidden';
                  };
                  return {
                    values: [...chart.querySelectorAll('.m-bubble__value')]
                      .filter(visible).map(node => node.textContent.trim()),
                    keyCount: chart.querySelectorAll('.m-legend__item').length,
                    externalReadings: [...chart.querySelectorAll(
                      '.m-packed__value-row .m-bubble__value'
                    )].filter(visible).map(node => node.textContent.trim()),
                    placements: [...chart.querySelectorAll('.m-bubble')]
                      .map(node => node.getAttribute('data-value-placement'))
                  };
                }"""
            )
            checks.check(
                f"packed legend-off keeps each complete value once at {width} {direction.upper()}",
                all(compact_readings["values"].count(value) == 1
                    for value in ("84,300", "52,100", "12,000"))
                and compact_readings["keyCount"] == 0
                and "outside" in compact_readings["placements"]
                and len(compact_readings["externalReadings"]) == 1,
                compact_readings,
            )
            if width == 320 and direction == "rtl":
                packed.screenshot(
                    path=str(SCREENSHOT_DIR / "packed-legend-off-320-rtl.png")
                )

            states = packed.evaluate(
                """chart => {
                  const source = chart.querySelector('.m-chart__data');
                  source.insertAdjacentHTML('beforeend',
                    '<li data-series="d" data-label="صفر" data-value="0"></li>' +
                    '<li data-series="e" data-label="سالب" data-value="-3"></li>' +
                    '<li data-series="d" data-label="مجهول"></li>' +
                    '<li data-series="e" data-label="غير متاح" data-value=""></li>');
                  window.MicroPacked.render(chart);
                  const stateText = chart.querySelector('.m-packed__states')?.textContent || '';
                  return {
                    text: stateText,
                    stateCount: chart.querySelectorAll('.m-packed__states .m-legend__item').length,
                    positiveCount: chart.querySelectorAll('.m-bubble').length,
                    legendCount: chart.querySelectorAll('.m-legend__item').length
                  };
                }"""
            )
            checks.check(
                f"packed zero/negative/unknown/unavailable remain distinct at {width} {direction.upper()}",
                "0 — صفر" in states["text"]
                and "-3 — سالب غير صالح للمساحة" in states["text"]
                and "(غير معروف)" in states["text"]
                and "(غير متاح)" in states["text"]
                and states["stateCount"] == 4
                and states["positiveCount"] == 3,
                states,
            )

            refusal = packed.evaluate(
                """chart => {
                  chart.setAttribute('data-max', 'bad');
                  window.MicroPacked.render(chart);
                  return {
                    error: chart.querySelector('.m-chart__scale-error')?.textContent || '',
                    circles: chart.querySelectorAll('.m-bubble').length,
                    keyCount: chart.querySelectorAll('.m-legend__item').length,
                    containsAllValues: ['84,300', '52,100', '12,000',
                      '0', '-3 — سالب غير صالح للمساحة',
                      '(غير معروف)', '(غير متاح)'].every(value =>
                        chart.querySelector('.m-chart__plot').textContent.includes(value))
                  };
                }"""
            )
            checks.check(
                f"invalid packed scale refuses geometry and preserves all readings at {width} {direction.upper()}",
                bool(refusal["error"])
                and refusal["circles"] == 0
                and refusal["keyCount"] == 7
                and refusal["containsAllValues"],
                refusal,
            )

            density = packed.evaluate(
                """chart => {
                  const dense = chart.cloneNode(true);
                  dense.removeAttribute('id');
                  dense.removeAttribute('data-legend');
                  dense.setAttribute('data-max', '100000');
                  const source = dense.querySelector('.m-chart__data');
                  source.textContent = '';
                  [100, 80, 60, 40, 20, 10].forEach((value, index) => {
                    const li = document.createElement('li');
                    li.setAttribute('data-series', 'abcde'[index % 5]);
                    li.setAttribute('data-label', 'فئة ' + index);
                    li.setAttribute('data-value', String(value));
                    source.appendChild(li);
                  });
                  chart.insertAdjacentElement('afterend', dense);
                  window.MicroPacked.render(dense);
                  return {
                    state: dense.getAttribute('data-packed-state'),
                    error: dense.querySelector('.m-chart__scale-error')?.textContent || '',
                    circleCount: dense.querySelectorAll('.m-bubble').length,
                    legendCount: dense.querySelectorAll('.m-legend__item').length,
                    values: [...dense.querySelectorAll('.m-legend__value')]
                      .map(node => node.textContent.trim())
                  };
                }"""
            )
            checks.check(
                f"packed density refusal preserves all six raw values at {width} {direction.upper()}",
                density["state"] == "too-many-positive-categories"
                and bool(density["error"])
                and density["circleCount"] == 0
                and density["legendCount"] == 6
                and density["values"] == ["100", "80", "60", "40", "20", "10"],
                density,
            )
            checks.check(
                f"no uncaught browser exceptions in packed showcase at {width} {direction.upper()}",
                not page_errors,
                page_errors,
            )
            page.close()

        page, page_errors = open_page(browser, "/previews/data/index.html", 320, "rtl")
        donut_error = page.locator('#edge-cases .m-chart[data-chart="donut"]').nth(1)
        error_state = donut_error.evaluate(
            """chart => ({
              state: chart.getAttribute('data-scale-state'),
              summary: chart.querySelector('[data-summary]')?.textContent || '',
              message: chart.querySelector('.m-chart__error')?.textContent || '',
              arcs: chart.querySelectorAll('.m-donut__svg circle[stroke-dasharray]').length,
              values: [...chart.querySelectorAll('.m-legend__value')]
                .map(value => value.textContent.trim())
            })"""
        )
        checks.check(
            "donut refusal retains raw readings and has user-facing summary only",
            error_state["state"] == "over"
            and error_state["arcs"] == 0
            and error_state["values"] == ["60", "30", "20"]
            and all(
                marker not in error_state["summary"]
                for marker in ("data-scale-detail", "fallback", "R8-07")
            ),
            error_state,
        )
        donut_error.screenshot(path=str(SCREENSHOT_DIR / "donut-refusal-320-rtl.png"))
        diameter = page.locator('#shapes .m-chart[data-chart="bubbles"]').evaluate(
            """chart => {
              const item = [...chart.querySelectorAll('.m-chart__data [data-series]')]
                .find(node => node.getAttribute('data-value') === '0.01');
              const bubbleIndex = [...chart.querySelectorAll('.m-chart__data [data-series]')]
                .indexOf(item);
              const circle = chart.querySelectorAll('.m-bubble__circle')[bubbleIndex];
              return {
                width: circle.getBoundingClientRect().width,
                caption: chart.parentElement.querySelector('.caption')?.textContent || ''
              };
            }"""
        )
        checks.check(
            "small-bubble example reports its measured diameter accurately",
            abs(diameter["width"] - 1.04) < 0.02
            and "قطرها 1.04px" in diameter["caption"],
            diameter,
        )
        checks.check("no uncaught browser exceptions in data examples", not page_errors, page_errors)
        page.close()

        browser.close()

    print(f"RESULT: {checks.passed} PASS, {checks.failed} FAIL")
    print(
        "Scope: sparse/dense line labels, packed key/compact modes, data states/refusals, "
        "and corrected 0.01 bubble diameter. No full suite or standalone build run."
    )
    return 0 if checks.failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
