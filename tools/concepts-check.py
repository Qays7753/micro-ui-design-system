#!/usr/bin/env python3
"""Verify editable Micro components in a real, Nix-managed Chromium browser."""

import json
import os
import re
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "CONCEPTS"
BASE = os.environ.get("MICRO_TEST_BASE", "http://127.0.0.1:5000")
RESULTS = []
CONTRAST = []


def check(name, condition, detail=None):
    result = {"name": name, "passed": bool(condition)}
    if detail is not None:
        result["detail"] = detail
    RESULTS.append(result)
    print(("PASS " if condition else "FAIL ") + name)


def font_200(page):
    page.evaluate("""() => {
      const rules = new Map();
      [...document.querySelectorAll('body, body *')].forEach(el => {
        const size = parseFloat(getComputedStyle(el).fontSize);
        const selector = el.tagName.toLowerCase() +
          [...el.classList].map(name => '.' + CSS.escape(name)).join('');
        if (size > 0) rules.set(selector, size * 2);
      });
      const style = document.createElement('style');
      style.textContent = [...rules].map(([selector, size]) =>
        selector + '{font-size:' + size + 'px!important;}').join('\\n');
      document.head.append(style);
      MicroMetricComparison.render();
    }""")


def fits(page):
    return page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")


def circles_geometry(page):
    return page.locator("[data-metric-items]").first.evaluate("""el => {
      const bounds = el.getBoundingClientRect();
      const rects = [...el.children].map(child => child.getBoundingClientRect());
      return {
        squares: rects.every(r => Math.abs(r.width - r.height) < .1),
        bounded: rects.every(r => r.left >= bounds.left - 1 && r.right <= bounds.right + 1
          && r.top >= bounds.top - 1 && r.bottom <= bounds.bottom + 1),
        areas: rects.map(r => r.width * r.height),
        separated: rects.every((r, i) => rects.every((s, j) => i === j ||
          r.right <= s.left || s.right <= r.left || r.bottom <= s.top || s.bottom <= r.top)),
        readable: [...el.querySelectorAll('[data-inside="true"] .m-metric-circles__bubble-content')]
          .every(text => text.scrollWidth <= text.clientWidth + 1 &&
            text.scrollHeight <= text.clientHeight + 1)
      };
    }""")


def contrast_ratio(foreground, background):
    def luminance(color):
        rgb = [int(value) / 255 for value in re.findall(r"\d+", color)[:3]]
        linear = [value / 12.92 if value <= .04045 else ((value + .055) / 1.055) ** 2.4
                  for value in rgb]
        return sum(value * weight for value, weight in zip(linear, (.2126, .7152, .0722)))
    a, b = sorted((luminance(foreground), luminance(background)))
    return (b + .05) / (a + .05)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    shots = OUT / "screenshots"
    shots.mkdir(exist_ok=True)
    errors = []
    failed_requests = []
    with sync_playwright() as p:
        executable = shutil.which("chromium")
        if not executable:
            raise RuntimeError("Nix Chromium is required; install it via the project package manager.")
        browser = p.chromium.launch(executable_path=executable, headless=True)
        context = browser.new_context(viewport={"width": 390, "height": 874}, has_touch=True)
        page = context.new_page()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("response", lambda response: failed_requests.append(response.url)
                if response.status >= 400 else None)

        def load(path="/previews/concepts/"):
            page.goto(BASE + path)
            page.wait_for_load_state("networkidle")
            page.evaluate("document.fonts.ready")

        def move(index):
            page.locator("[data-info-strip-viewport]").first.focus()
            page.keyboard.press("Home")
            for _ in range(index):
                page.keyboard.press("ArrowLeft")
            page.wait_for_timeout(280)

        load()
        check("Gallery loads real local fonts", page.evaluate(
            "document.fonts.check('600 16px \"IBM Plex Sans Arabic\"')"))
        slides = page.locator("[data-info-strip-track] > .m-info-strip__slide")
        count = slides.count()
        check("Strip contains independent numeric, circle/bar and separated-circle cards", count >= 3)
        check("Previous is disabled on first card", page.locator("[data-info-strip-prev]").first.is_disabled())
        page.locator("[data-info-strip-next]").first.click()
        page.wait_for_timeout(280)
        check("Next changes the active card", slides.nth(1).get_attribute("aria-hidden") == "false")
        check("Non-current cards inert", page.evaluate("""() =>
          [...document.querySelectorAll('.m-info-strip__slide')].every(el =>
            el.inert === (el.getAttribute('aria-hidden') === 'true'))"""))
        move(count - 1)
        check("Last card disables next", page.locator("[data-info-strip-next]").first.is_disabled())
        move(0)
        viewport = page.locator("[data-info-strip-viewport]").first
        viewport.dispatch_event("pointerdown", {
            "pointerType": "touch", "isPrimary": True, "clientX": 90, "clientY": 100, "pointerId": 1})
        viewport.dispatch_event("pointerup", {
            "pointerType": "touch", "isPrimary": True, "clientX": 220, "clientY": 102, "pointerId": 1})
        page.wait_for_timeout(280)
        check("RTL rightward swipe advances", slides.nth(1).get_attribute("aria-hidden") == "false")
        viewport.dispatch_event("pointerdown", {
            "pointerType": "touch", "isPrimary": True, "clientX": 160, "clientY": 100, "pointerId": 2})
        viewport.dispatch_event("pointerup", {
            "pointerType": "touch", "isPrimary": True, "clientX": 163, "clientY": 230, "pointerId": 2})
        check("Vertical touch does not advance", slides.nth(1).get_attribute("aria-hidden") == "false")
        page.wait_for_timeout(500)
        check("No automatic card advance", slides.nth(1).get_attribute("aria-hidden") == "false")
        for width in (320, 360, 390, 430):
            page.set_viewport_size({"width": width, "height": 874})
            load()
            for index in range(count):
                move(index)
                check(f"{width}px card {index + 1}: no horizontal overflow", fits(page))
                card = slides.nth(index)
                page.screenshot(path=str(shots / f"strip-{width}-{index + 1}.png"))
                check(f"{width}px card {index + 1}: no clipped internal reading",
                      card.evaluate("el => el.scrollWidth <= el.clientWidth + 1"))
            geometry = circles_geometry(page)
            check(f"{width}px separated circles are round and entirely inside the card",
                  geometry["squares"] and geometry["bounded"])
            check(f"{width}px separated circles do not touch", geometry["separated"])
            areas = geometry["areas"]
            check(f"{width}px area ratios match 64:25:9, not diameter ratios",
                  len(areas) == 3 and abs(areas[1] / areas[0] - 25 / 64) < .005
                  and abs(areas[2] / areas[0] - 9 / 64) < .005)
            page.locator("#circle-layout").select_option("overlap")
            geometry = circles_geometry(page)
            check(f"{width}px overlap circles are round and bounded", geometry["squares"] and geometry["bounded"])
            check(f"{width}px overlap layout really overlaps", not geometry["separated"])
            if width == 390:
                move(2)
                page.screenshot(path=str(shots / "circles-overlap-390.png"))
            page.locator("#circle-layout").select_option("separated")
            font_200(page)
            for index in range(count):
                move(index)
                check(f"{width}px card {index + 1}: text 200% fits", fits(page))
                check(f"{width}px card {index + 1}: text 200% not internally clipped",
                      slides.nth(index).evaluate("el => el.scrollWidth <= el.clientWidth + 1"))
                if width == 390 and index == 1:
                    page.screenshot(path=str(shots / "main-reading-font-200-390.png"))
            check(f"{width}px 200%: inside-circle text fits or uses full external fallback",
                  circles_geometry(page)["readable"])

        page.set_viewport_size({"width": 390, "height": 874})
        load()
        selector = page.locator("#comparison-mode")
        for state in ("standard", "small", "negative", "missing", "invalid", "zero", "mixed"):
            selector.select_option(state)
            check(f"Comparison state {state}: layout fits", fits(page))
            expected = {"standard": 3, "small": 3, "negative": 3, "missing": 2,
                        "invalid": 2, "zero": 3, "mixed": 3}[state]
            check(f"Comparison state {state}: known readings get magnitude circles or zero markers",
                  page.locator(".m-metric-circles__item").count() == expected)
            if state == "negative":
                check("Signed circles compare magnitude without hiding the negative sign",
                      page.locator('.m-metric-circles__item[data-state="negative"]').count() == 1
                      and "-9" in page.locator("[data-metric-fallback]").inner_text())
                check("Zero marker is separate from the scaled magnitude circles",
                      page.locator('.m-metric-circles__item[data-state="zero"]').count() == 1)
                check("Negative bar ends at zero and positive bar starts at the same zero", page.evaluate("""() => {
                  const neg = document.querySelector('.m-main-metric__bar[data-direction="negative"]');
                  const pos = document.querySelector('.m-main-metric__bar[data-direction="positive"]');
                  const n = neg.getBoundingClientRect(), p = pos.getBoundingClientRect();
                  const nt = neg.parentElement.getBoundingClientRect(), pt = pos.parentElement.getBoundingClientRect();
                  return Math.abs(n.right - nt.left - nt.width / 2) < 1 &&
                    Math.abs(p.left - pt.left - pt.width / 2) < 1 &&
                    Math.abs(n.width / p.width - 9 / 32) < .01;
                }"""))
                move(1)
                page.screenshot(path=str(shots / "bars-signed-390.png"))
                move(2)
                page.screenshot(path=str(shots / "circles-signed-zero-390.png"))
            if state == "zero":
                check("All-zero data is a normal state with three unfilled markers",
                      page.locator('.m-metric-circles__item[data-state="zero"]').count() == 3
                      and page.locator(".m-main-metric__bar").count() == 0
                      and page.locator('.m-main-metric__track[data-zero="true"]').count() == 3)
                move(2)
                page.screenshot(path=str(shots / "circles-zero-390.png"))
            if state == "mixed":
                check("Different units never get misleading common bars",
                      page.locator(".m-main-metric__bar").count() == 0)
        page.locator("[data-comparison-reset]").click()
        check("Comparison reset restores selection", selector.input_value() == "standard")
        check("Standard sample actually renders three independent bars",
              page.locator(".m-main-metric__bar").count() == 3)
        chart = page.locator("[data-metric-circles]").first
        for maximum in ("", "0", "-1", "bad", "1"):
            chart.evaluate("""(el, value) => {
              el.setAttribute('data-max', value); MicroMetricComparison.render(el);
            }""", maximum)
            check(f"Invalid/insufficient declared maximum {maximum!r} rejected without fallback geometry",
                  page.locator(".m-metric-circles__item").count() == 0
                  and page.locator("[data-metric-fallback] li").count() == 3)
        chart.evaluate("""el => {
          el.removeAttribute('data-max'); el.setAttribute('data-radius', 'bad');
          MicroMetricComparison.render(el);
        }""")
        check("Invalid declared radius is explicitly rejected",
              page.locator(".m-metric-circles__item").count() == 0
              and "غير صالح" in page.locator("[data-metric-scale]").inner_text())
        chart.evaluate("""el => {
          el.setAttribute('data-radius', '72');
          el.querySelector('[data-metric-source]').replaceChildren();
          MicroMetricComparison.render(el);
        }""")
        check("Empty circle source has explicit empty state", page.locator("[data-metric-empty]").is_visible())
        load()
        chart = page.locator("[data-metric-circles]").first
        chart.evaluate("""el => {
          const values = ['−64', '-25', '-9'];
          el.querySelectorAll('[data-metric-source] li').forEach((item, i) =>
            item.setAttribute('data-value', values[i]));
          MicroMetricComparison.render(el);
        }""")
        check("All-negative data still renders magnitude circles, including Unicode minus",
              page.locator('.m-metric-circles__item[data-state="negative"]').count() == 3)
        areas = circles_geometry(page)["areas"]
        check("Negative magnitude areas preserve the 64:25:9 ratios",
              abs(areas[1] / areas[0] - 25 / 64) < .005 and abs(areas[2] / areas[0] - 9 / 64) < .005)
        chart.evaluate("""el => {
          el.querySelector('[data-metric-source] li').setAttribute('data-label', 'قراءة قابلة للتعديل');
          MicroMetricComparison.render(el);
        }""")
        check("Editable labels propagate from source without duplicating the component",
              "قراءة قابلة للتعديل" in chart.inner_text())
        check("Existing shared surface token changes the real source-rendered card", page.evaluate("""() => {
          const root = document.documentElement;
          root.style.setProperty('--micro-radius-surface', '8px');
          const actual = getComputedStyle(document.querySelector('.m-info-card')).borderRadius;
          root.style.removeProperty('--micro-radius-surface');
          return actual === '8px';
        }"""))
        load()

        open_button = page.locator("[data-account-open]").first
        layer = page.locator("[data-account-settings-layer]").first
        open_button.click()
        layer.wait_for(state="visible")
        check("Account settings opens as one dialog", page.locator('[role="dialog"]:visible').count() == 1)
        check("Background is inert", page.locator(".concept-header").evaluate("el => el.inert"))
        page.screenshot(path=str(shots / "settings-account.png"))
        page.locator("[data-account-to-application]").click()
        check("Application settings replaces account content",
              page.locator('[data-account-view="application"]').is_visible()
              and not page.locator('[data-account-view="account"]').is_visible())
        check("Still only one dialog", page.locator('[role="dialog"]:visible').count() == 1)
        page.screenshot(path=str(shots / "settings-application.png"))
        for key in ("Tab", "Tab", "Shift+Tab", "Tab", "Tab", "Tab", "Tab"):
            page.keyboard.press(key)
            check(f"Settings focus stays in dialog ({key})",
                  layer.evaluate("el => el.contains(document.activeElement)"))
        toggle = page.locator("[data-account-setting]").first
        toggle.locator("..").locator(".m-switch__track").click()
        check("Setting control changes locally", toggle.is_checked())
        check("Demo announces no persistence",
              "لم يُحفظ" in page.locator("[data-account-demo-status]").inner_text())
        page.locator("[data-account-back]").click()
        check("Back returns to account", page.locator('[data-account-view="account"]').is_visible())
        page.keyboard.press("Escape")
        layer.wait_for(state="hidden")
        check("Closing restores settings launcher focus", open_button.evaluate("el => el === document.activeElement"))
        check("Closing removes background inert", not page.locator(".concept-header").evaluate("el => el.inert"))
        open_button.click()
        layer.wait_for(state="visible")
        page.locator("[data-account-close]").click()
        layer.wait_for(state="hidden")
        check("Settings reopens and closes cleanly", open_button.evaluate("el => el === document.activeElement"))

        gateway = page.locator("[data-access-gateway]").first
        email = gateway.locator('[data-access-credential="email"]')
        password = gateway.locator('[data-access-credential="password"]')
        reveal = gateway.locator("[data-access-reveal]")
        form = gateway.locator("[data-access-form]")
        status = gateway.locator("[data-access-status]")
        check("No unwired providers or recovery shown",
              not gateway.locator("[data-access-recovery]").is_visible()
              and not gateway.locator("[data-access-providers]").is_visible())
        email.fill("sample@example.test")
        password.fill("sample-password")
        reveal.click()
        check("Password reveal preserves value", password.get_attribute("type") == "text"
              and password.input_value() == "sample-password")
        reveal.click()
        check("Password conceal restores password type", password.get_attribute("type") == "password")
        email.fill("bad-address")
        form.evaluate("el => el.requestSubmit()")
        check("Invalid email explicitly marked", email.get_attribute("aria-invalid") == "true")
        email.fill("sample@example.test")
        password.fill("sample-password")
        form.evaluate("el => el.requestSubmit()")
        check("Unwired submit does not claim real login", "لا توجد خدمة مصادقة" in status.inner_text())
        page.screenshot(path=str(shots / "gateway.png"))
        gateway.evaluate("""el => {
          window.__submits = 0;
          MicroAccessGateway.init(el, {onSubmit: () => {
            window.__submits++;
            return new Promise(resolve => { window.__resolveAccess = resolve; });
          }});
        }""")
        form.evaluate("el => { el.requestSubmit(); el.requestSubmit(); }")
        page.wait_for_function("window.__submits === 1")
        check("Async submit prevents duplicate calls", page.evaluate("window.__submits") == 1)
        check("Async submit announces busy state", form.get_attribute("aria-busy") == "true")
        page.evaluate("window.__resolveAccess({handled: true})")
        page.wait_for_function("document.querySelector('[data-access-form]').dataset.microAccessBusy === 'false'")
        check("Async completion clears busy", form.get_attribute("aria-busy") is None)
        gateway.evaluate("""el => MicroAccessGateway.init(el, {
          onSubmit: () => Promise.reject(new Error('تعذر الاتصال التجريبي')),
          onRecovery: () => Promise.resolve(),
          providers: {google: () => Promise.resolve()}
        })""")
        check("Recovery/provider appear only with callbacks",
              gateway.locator("[data-access-recovery]").is_visible()
              and gateway.locator('[data-access-provider="google"]').is_visible()
              and not gateway.locator('[data-access-provider="apple"]').is_visible())
        form.evaluate("el => el.requestSubmit()")
        page.wait_for_function("document.querySelector('[data-access-status]').textContent.includes('تعذر الاتصال التجريبي')")
        check("Callback rejection displayed explicitly", status.get_attribute("data-tone") == "error")
        for family in ("info-strip", "metric-comparison", "account-settings", "access-gateway"):
            load(f"/components/{family}/example-usage.html")
            check(f"{family} works without gallery styles", fits(page))
            if family == "account-settings":
                page.locator("[data-account-open]").click()
                page.locator("[data-account-settings-layer]").wait_for(state="visible")
                check("Independent settings example actually opens the dialog",
                      page.locator('[role="dialog"]:visible').count() == 1)
                page.keyboard.press("Escape")
                page.locator("[data-account-settings-layer]").wait_for(state="hidden")

        load()
        for series in ("a", "b", "c", "d", "e"):
            colors = page.locator("[data-metric-circles]").first.evaluate("""(el, series) => {
              const source = el.querySelector('[data-metric-source]');
              const item = source.firstElementChild;
              source.replaceChildren(item);
              item.setAttribute('data-value', '64');
              item.setAttribute('data-series', series);
              MicroMetricComparison.render(el);
              return {
                foreground: getComputedStyle(el.querySelector('.m-metric-circles__inside-reading')).color,
                background: getComputedStyle(el.querySelector('.m-metric-circles__bubble')).backgroundColor
              };
            }""", series)
            ratio = contrast_ratio(colors["foreground"], colors["background"])
            CONTRAST.append({"pair": "circle-" + series, "ratio": round(ratio, 2), "required": 4.5})
            check(f"Category {series}: normal-sized circle readings meet 4.5:1 contrast", ratio >= 4.5,
                  round(ratio, 2))
        colors = page.evaluate("""() => {
          const root = getComputedStyle(document.documentElement);
          const probe = document.createElement('span');
          document.body.append(probe);
          const resolved = name => {
            probe.style.color = root.getPropertyValue(name);
            return getComputedStyle(probe).color;
          };
          const result = {
            edge: resolved('--micro-text-primary'),
            circle: resolved('--micro-surface-base'),
            bar: resolved('--micro-surface-disabled')
          };
          probe.remove(); return result;
        }""")
        for shape in ("circle", "bar"):
            ratio = contrast_ratio(colors["edge"], colors[shape])
            CONTRAST.append({"pair": shape + "-boundary", "ratio": round(ratio, 2), "required": 3})
            check(f"{shape} boundaries/zero markers distinguish light data colors at 3:1",
                  ratio >= 3, round(ratio, 2))
        load()
        page.emulate_media(reduced_motion="reduce")
        check("Reduced-motion carousel is stationary between states",
              page.locator("[data-info-strip-track]").first.evaluate(
                  "el => getComputedStyle(el).transitionDuration") in ("0s", "0s, 0s"))
        check("No page JavaScript exceptions", not errors, errors)
        check("All requested local assets load", not failed_requests, failed_requests)
        report = {
            "browser": browser.version,
            "zoom": "200% computed-font simulation; not native zoom",
            "touch": "synthetic touch pointer events; not a physical phone",
            "results": RESULTS,
            "contrast": CONTRAST,
            "passed": sum(result["passed"] for result in RESULTS),
            "total": len(RESULTS),
        }
        (OUT / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
        browser.close()
    print(f"Result: {report['passed']}/{report['total']}")
    raise SystemExit(0 if report["passed"] == report["total"] else 1)


if __name__ == "__main__":
    main()