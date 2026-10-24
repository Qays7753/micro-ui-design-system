"""Local-only visual captures for the visual audit supplement.

Screenshots are element crops of current repository demo fixtures; dynamic
extreme values are set only in the browser DOM and are not saved to source.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
OUT = Path("generated-artifacts/pixilated-audit")
OUT.mkdir(parents=True, exist_ok=True)


def save(locator, name):
    locator.wait_for(state="visible", timeout=10000)
    locator.screenshot(path=str(OUT / name), animations="disabled")


def settle(page):
    page.evaluate("document.fonts.ready")
    page.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")


with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path="/repl/tools/bin/chromium",
        headless=True,
        args=["--no-sandbox"],
    )

    for width in (320, 360, 390, 430):
        page = browser.new_page(
            viewport={"width": width, "height": 900},
            device_scale_factor=1,
        )
        page.goto(f"{BASE}/components/metric-comparison/example-usage.html", wait_until="networkidle")
        settle(page)
        save(page.locator("[data-metric-circles]"), f"visual-metric-circles-overlap-{width}.png")
        save(page.locator("[data-main-comparison]"), f"visual-main-comparison-default-{width}.png")
        if width == 390:
            circle = page.locator("[data-metric-circles]")
            page.locator("#circle-layout").select_option("separated")
            settle(page)
            save(circle, "visual-metric-circles-separated-390.png")
            page.evaluate(
                """() => {
                  const root = document.querySelector('[data-metric-circles]');
                  const rows = [...root.querySelectorAll('[data-metric-source] [data-label]')];
                  const values = ['1000000000000000', '0', '-2'];
                  rows.forEach((row, i) => row.setAttribute('data-value', values[i]));
                  const missing = document.createElement('li');
                  missing.dataset.label = 'قراءة غير متاحة';
                  missing.dataset.unit = 'وحدة';
                  missing.dataset.series = 'd';
                  root.querySelector('[data-metric-source]').appendChild(missing);
                  root.setAttribute('data-layout', 'separated');
                  MicroMetricComparison.render(root);
                }"""
            )
            settle(page)
            save(circle, "visual-metric-circles-zero-negative-missing-huge-390.png")
            main = page.locator("[data-main-comparison]")
            page.evaluate(
                """() => {
                  const root = document.querySelector('[data-main-comparison]');
                  root.classList.add('m-main-metric--flat');
                  MicroMetricComparison.render(root);
                }"""
            )
            settle(page)
            save(main, "visual-main-comparison-flat-390.png")
            page.evaluate(
                """() => {
                  const root = document.querySelector('[data-main-comparison]');
                  root.classList.remove('m-main-metric--flat');
                  root.querySelector('.m-main-metric__number').textContent = '98765432109876543210';
                  root.setAttribute('data-max', '1000000000000');
                  const rows = [...root.querySelectorAll('[data-bar-source] [data-label]')];
                  const values = ['1000000000000', '0', '-450', ''];
                  rows[0].setAttribute('data-value', values[0]);
                  rows[1].setAttribute('data-value', values[1]);
                  rows[2].setAttribute('data-value', values[2]);
                  const missing = document.createElement('li');
                  missing.dataset.label = 'غائب طويل التسمية';
                  missing.dataset.value = '';
                  missing.dataset.unit = 'عملية';
                  missing.dataset.period = 'اليوم';
                  missing.dataset.series = 'd';
                  root.querySelector('[data-bar-source]').appendChild(missing);
                  MicroMetricComparison.render(root);
                }"""
            )
            settle(page)
            save(main, "visual-main-comparison-extreme-states-390.png")
        page.close()

    for width in (320, 360, 390, 430):
        charts = browser.new_page(
            viewport={"width": width, "height": 900},
            device_scale_factor=1,
        )
        charts.goto(f"{BASE}/components/data/example-usage.html", wait_until="networkidle")
        settle(charts)
        save(charts.locator("#bars"), f"visual-chart-bars-{width}.png")
        save(charts.locator("#line"), f"visual-chart-line-{width}.png")
        save(charts.locator("#donut"), f"visual-chart-donut-{width}.png")
        save(charts.locator("#bubbles"), f"visual-chart-bubbles-{width}.png")
        save(charts.locator("#bubble-states"), f"visual-chart-bubbles-states-{width}.png")
        if width == 390:
            save(charts.locator("#long-donut"), "visual-chart-donut-huge-total-390.png")
        charts.close()

    for width in (320, 360, 390, 430):
        fields = browser.new_page(
            viewport={"width": width, "height": 900},
            device_scale_factor=1,
        )
        fields.goto(f"{BASE}/previews/fields/index.html", wait_until="networkidle")
        settle(fields)
        quantity = fields.locator(".example").filter(has=fields.locator("#t-qty"))
        save(quantity, f"visual-field-stepper-{width}.png")
        fields.close()

        gateway = browser.new_page(
            viewport={"width": width, "height": 900},
            device_scale_factor=1,
        )
        gateway.goto(f"{BASE}/previews/concepts/index.html", wait_until="networkidle")
        settle(gateway)
        save(
            gateway.locator(".m-access-gateway"),
            f"visual-field-password-{width}.png",
        )
        gateway.close()

    browser.close()
