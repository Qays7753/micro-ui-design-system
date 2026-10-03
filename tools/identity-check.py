#!/usr/bin/env python3
"""Affected-scope verification of the unified gallery and actual compositions."""
import hashlib
import base64
import json
import os
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "IDENTITY"
BASE = os.environ.get("MICRO_TEST_BASE", "http://127.0.0.1:5000")
RESULTS = []


def check(name, passed, detail=None):
    row = {"name": name, "passed": bool(passed)}
    if detail is not None:
        row["detail"] = detail
    RESULTS.append(row)
    print(("PASS " if passed else "FAIL ") + name)


def enlarge(page):
    # Snapshot first so descendants never read already-doubled parent styles.
    page.evaluate("""() => {
      const sizes = [...document.querySelectorAll('body, body *')].map(el =>
        [el, parseFloat(getComputedStyle(el).fontSize)]);
      sizes.forEach(([el, size]) => el.style.fontSize = size * 2 + 'px');
    }""")


def fits(page):
    return page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")


def surface_contrast(page):
    """Conservative pixel-background check, with text hidden at unchanged layout."""
    surface = page.locator(".m-surface--curves")
    selector = ".m-surface__label,.m-surface__title,.m-surface__amount,.m-surface__sub"
    color = surface.locator(".m-surface__title").evaluate("el => getComputedStyle(el).color")
    surface.locator(selector).evaluate_all(
        "els => els.forEach(el => el.style.color = 'transparent')")
    png = base64.b64encode(surface.screenshot()).decode()
    ratio = page.evaluate("""async ({png, color}) => {
      const image = new Image(); image.src = 'data:image/png;base64,' + png;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const lum = rgb => rgb.map(v => v/255).map(v =>
        v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4)
        .reduce((sum, v, i) => sum + v * [.2126,.7152,.0722][i], 0);
      const foreground = lum(color.match(/\\d+/g).slice(0,3).map(Number));
      let minimum = Infinity;
      for (let i=0; i<data.length; i+=4) {
        const bg = lum([data[i],data[i+1],data[i+2]]);
        minimum = Math.min(minimum,(Math.max(bg,foreground)+.05)/
          (Math.min(bg,foreground)+.05));
      }
      return minimum;
    }""", {"png": png, "color": color})
    surface.locator(selector).evaluate_all(
        "els => els.forEach(el => el.style.removeProperty('color'))")
    return ratio


def fingerprint():
    paths = [ROOT / "DESIGN.md", ROOT / "tools/identity-check.py",
             ROOT / "tools/preview-server.py"]
    for folder in ("components", "shared", "assets", "previews"):
        paths.extend(p for p in (ROOT / folder).rglob("*") if p.is_file())
    hashes = {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest()
              for p in sorted(set(paths))}
    return {"files": hashes, "sha256": hashlib.sha256(
        json.dumps(hashes, sort_keys=True).encode()).hexdigest()}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    shots = OUT / "screenshots"
    shots.mkdir(exist_ok=True)
    errors, resources = [], []
    engines = {}
    before = fingerprint()
    with sync_playwright() as pw:
        chromium = shutil.which("chromium")
        if not chromium:
            raise RuntimeError("Nix-managed Chromium is required.")
        browser = pw.chromium.launch(executable_path=chromium, headless=True)
        engines["chromium"] = {"status": "tested", "version": browser.version,
                               "coverage": "all results below"}
        page = browser.new_page(viewport={"width": 390, "height": 874}, has_touch=True)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("response", lambda r: resources.append({"url": r.url, "status": r.status})
                if r.status >= 400 else None)

        def load(path):
            response = page.goto(BASE + path)
            page.wait_for_load_state("networkidle")
            page.evaluate("document.fonts.ready")
            check("HTTP 200 " + path, response.status == 200)

        load("/")
        check("Root routes to unified gallery", urlsplit(page.url).path == "/previews/")
        links = page.locator("a[href]").evaluate_all(
            "els => [...new Set(els.map(el => el.href))]")
        for url in links:
            check("Index link resolves: " + urlsplit(url).path,
                  page.request.get(url).status == 200)
        # Inspect rendered family boards/examples too: HTML-only requests miss broken resources.
        routes = sorted({urlsplit(u).path for u in links
                         if ("/previews/" in u or "/components/" in u)
                         and (urlsplit(u).path.endswith("/") or u.endswith(".html"))})
        for route in routes:
            load(route)
            check("RTL route " + route, page.locator("html").get_attribute("dir") == "rtl")

        for width in (320, 360, 390, 430):
            page.set_viewport_size({"width": width, "height": 874})
            for route, label in (("/previews/", "index"),
                                 ("/previews/compositions/", "compositions")):
                load(route)
                check(f"{label} {width}: base fits", fits(page))
                check(f"{label} {width}: IBM Plex loaded", page.evaluate(
                    """document.fonts.check('500 16px "IBM Plex Sans Arabic"')"""))
                if label == "compositions":
                    check("Compositions independent of board CSS", page.evaluate(
                        """[...document.styleSheets].every(s => !s.href ||
                          (!s.href.includes('board') && !s.href.includes('concepts')))"""))
                    page.locator(".m-row__title").first.evaluate("""el =>
                      el.textContent = 'عنوان عينة طويل للتحقق من الالتفاف والمحاذاة دون قص النص أو حجب إجراء الصف'""")
                    page.locator("#sample-note-help").evaluate("""el =>
                      el.textContent = 'نص مساعدة طويل يوضح أن هذه العينة محلية ولا ترسل أي بيانات، ويجب أن يبقى مقروءًا بالكامل عند التكبير.'""")
                page.screenshot(path=str(shots / f"{label}-{width}.png"), full_page=True)
                enlarge(page)
                check(f"{label} {width}: computed text 200% fits", fits(page))
                if label == "compositions":
                    check(f"Controls {width}: text not clipped", page.locator(
                        ".m-btn, .m-row__title, .m-field__msg").evaluate_all(
                        "els => els.every(el => el.scrollWidth <= el.clientWidth + 1 "
                        "&& el.scrollHeight <= el.clientHeight + 1)"))
                    check(f"Controls {width}: >=48px targets", page.locator(
                        ".m-btn, .m-section__head").evaluate_all(
                        "els => els.length > 0 && els.every(el => {const r=el.getBoundingClientRect();"
                        "return r.width >= 48 && r.height >= 48;})"))
                if width in (320, 390):
                    page.screenshot(path=str(shots / f"{label}-text-200-{width}.png"),
                                    full_page=True)

        page.set_viewport_size({"width": 390, "height": 874})
        for width in (320, 360, 390, 430):
            page.set_viewport_size({"width": width, "height": 874})
            load("/previews/surfaces/approved-curves.html")
            surface = page.locator(".m-surface--curves")
            surface.locator(".m-surface__title").evaluate(
                "el => el.textContent = 'تسمية طويلة لملخص القراءات للتحقق من الاحتواء والمحاذاة'")
            surface.locator(".m-surface__amount").evaluate(
                "el => el.textContent = '-123456789012345.67'")
            check(f"Curves {width}: fits at base size", fits(page))
            colors = surface.locator(
                ".m-surface__label,.m-surface__title,.m-surface__amount,.m-surface__sub"
            ).evaluate_all("els => els.map(el => getComputedStyle(el).color)")
            check(f"Curves {width}: all roles use same stable dark text",
                  len(set(colors)) == 1 and colors[0] == "rgb(23, 45, 50)")
            ratio = surface_contrast(page)
            check(f"Curves {width}: conservative background contrast >=4.5",
                  ratio >= 4.5, round(ratio, 2))
            enlarge(page)
            check(f"Curves {width}: long signed reading at computed text 200% fits",
                  fits(page) and surface.evaluate(
                      "el => el.scrollWidth <= el.clientWidth + 1"))
            check(f"Curves {width}: actual text bounds contained",
                  surface.evaluate("""el => {
                    const bounds = el.getBoundingClientRect();
                    return [...el.querySelectorAll('.m-surface__content *')].every(child => {
                      if (!child.firstChild || child.firstChild.nodeType !== Node.TEXT_NODE) return true;
                      const range = document.createRange(); range.selectNodeContents(child);
                      return [...range.getClientRects()].every(r =>
                        r.left >= bounds.left - 1 && r.right <= bounds.right + 1 &&
                        r.top >= bounds.top - 1 && r.bottom <= bounds.bottom + 1);
                    });
                  }"""))
            if width in (320, 390):
                page.screenshot(path=str(shots / f"curves-long-text-200-{width}.png"),
                                full_page=True)
        page.set_viewport_size({"width": 390, "height": 874})
        load("/previews/compositions/")
        action = page.locator("[data-row-action]")
        action.focus()
        page.keyboard.press("Tab")
        page.keyboard.press("Shift+Tab")
        check("Keyboard focus has visible indicator", action.evaluate(
            "el => el.matches(':focus-visible') && (getComputedStyle(el).outlineStyle !== 'none'"
            "|| getComputedStyle(el).boxShadow !== 'none')"))
        page.keyboard.press("Enter")
        check("Row action busy", action.get_attribute("aria-busy") == "true")
        page.wait_for_function(
            "document.querySelector('[data-row-feedback]').textContent.includes('اكتمل')")
        check("Row action completes locally", action.get_attribute("aria-busy") != "true")
        field = page.locator("#sample-note")
        page.locator("[data-form-submit]").click()
        check("Error keeps field value and focuses input",
              field.input_value() == "م" and field.evaluate("el => el === document.activeElement")
              and field.get_attribute("aria-invalid") == "true")
        check("Help/error explicitly associated", field.get_attribute("aria-describedby")
              == "sample-note-help sample-note-error")
        field.fill("عينة صالحة")
        page.locator("[data-form-submit]").click()
        page.wait_for_function(
            "document.querySelector('[data-form-feedback]').textContent.includes('لم تُرسل')")
        check("Valid form clears error without saving", field.get_attribute("aria-invalid") is None)
        toggle = page.locator(".m-section__head")
        toggle.focus()
        page.keyboard.press("Enter")
        closed = toggle.get_attribute("aria-expanded") == "false"
        page.keyboard.press("Space")
        check("Disclosure works via Enter/Space", closed
              and toggle.get_attribute("aria-expanded") == "true")
        check("Signed, zero and absent readings remain distinct", page.evaluate("""() => {
          const t = document.querySelector('.composition-summary-wrap').textContent;
          return t.includes('−') && t.includes('+') && t.includes('0') && t.includes('غير متاح');
        }"""))
        page.emulate_media(reduced_motion="reduce")
        check("Button respects reduced motion", page.locator(".m-btn").first.evaluate(
            "el => getComputedStyle(el).transitionDuration") in ("0s", "0s, 0s"))

        for width in (320, 360, 390, 430):
            page.set_viewport_size({"width": width, "height": 874})
            for count in (0, 1, 8):
                load("/previews/info-strip/")
                page.locator("[data-info-strip]").first.evaluate("""(root, count) => {
                  const template = root.querySelector('.m-info-strip__slide').cloneNode(true);
                  template.querySelector('.m-info-card__label').textContent =
                    'تسمية طويلة لقراءة عينة محفوظة دون تصغير أو اقتطاع';
                  template.querySelector('.m-info-card__number').textContent = '-1234567890.12';
                  const fresh = root.cloneNode(true);
                  fresh.removeAttribute('data-info-strip-ready');
                  const track = fresh.querySelector('[data-info-strip-track]');
                  track.replaceChildren(...Array.from({length: count}, () => template.cloneNode(true)));
                  const empty = document.createElement('p');
                  empty.setAttribute('data-info-strip-empty', '');
                  empty.textContent = 'لا توجد بطاقات — عينة فارغة';
                  empty.hidden = true;
                  fresh.append(empty); root.replaceWith(fresh);
                  MicroInfoStrip.init(fresh);
                }""", count)
                root = page.locator("[data-info-strip]").first
                viewport = root.locator("[data-info-strip-viewport]")
                check(f"Strip {width}/{count}: fits", fits(page))
                if count == 0:
                    check(f"Strip {width}/empty: consumer message and no controls",
                          root.locator("[data-info-strip-empty]").is_visible()
                          and not viewport.is_visible()
                          and not root.locator("[data-info-strip-controls]").is_visible())
                elif count == 1:
                    check(f"Strip {width}/one: no navigation",
                          not root.locator("[data-info-strip-controls]").is_visible()
                          and root.locator(".m-info-strip__slide").get_attribute("aria-hidden") == "false")
                else:
                    viewport.focus()
                    page.keyboard.press("End")
                    check(f"Strip {width}/eight: end bound", root.locator(
                        "[data-info-strip-next]").is_disabled())
                    page.keyboard.press("ArrowLeft")
                    check(f"Strip {width}/eight: no overrun",
                          root.locator("[data-info-strip-position]").inner_text() == "8 / 8")
                    page.keyboard.press("Home")
                    for start, end, expected in ((90, 220, "2 / 8"), (220, 90, "1 / 8")):
                        viewport.dispatch_event("pointerdown", {"pointerType": "touch",
                            "isPrimary": True, "clientX": start, "clientY": 100})
                        viewport.dispatch_event("pointerup", {"pointerType": "touch",
                            "isPrimary": True, "clientX": end, "clientY": 102})
                        check(f"Strip {width}: swipe {start}->{end} matches spec",
                              root.locator("[data-info-strip-position]").inner_text() == expected)
                    check(f"Strip {width}: inactive slides inert", root.locator(
                        ".m-info-strip__slide").evaluate_all(
                        "els => els.every(el => el.inert === (el.getAttribute('aria-hidden') === 'true'))"))
                enlarge(page)
                check(f"Strip {width}/{count}: long signed reading at text 200% fits", fits(page))
                check(f"Strip {width}/{count}: no internal clipping", root.locator(
                    ".m-info-card").evaluate_all(
                    "els => els.every(el => el.scrollWidth <= el.clientWidth + 1)"))
                if width == 390:
                    page.screenshot(path=str(shots / f"strip-count-{count}.png"), full_page=True)

        check("No JavaScript errors on affected routes", not errors, errors)
        expected_path = "/previews/organization/assets/icons/logo-%D8%BA%D9%8A%D8%B1-%D9%85%D9%88%D8%AC%D9%88%D8%AF.png"
        expected = [r for r in resources
                    if urlsplit(r["url"]).path == expected_path and r["status"] == 404]
        unexpected = [r for r in resources if r not in expected]
        check("No unexplained failed local assets", not unexpected, unexpected)
        if expected:
            load("/previews/organization/")
            check("Intentional broken avatar demonstrates source fallback",
                  page.locator(".m-identity__initials").count() > 0, expected)
        for name in ("firefox", "webkit"):
            other = None
            try:
                other = getattr(pw, name).launch(headless=True)
                probe = other.new_page(viewport={"width": 390, "height": 874})
                probe.goto(BASE + "/previews/compositions/")
                check(name + " composition smoke", fits(probe))
                engines[name] = {"status": "smoke only", "version": other.version}
            except Exception as error:
                engines[name] = {"status": "unavailable", "reason": str(error).splitlines()[0]}
            finally:
                if other:
                    other.close()
        browser.close()
    after = fingerprint()
    check("Measured sources unchanged during verification", before == after)
    report = {"engines": engines, "source": before,
              "git_head": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT).decode().strip(),
              "working_tree": "file SHA256s identify tested working sources, not a clean commit claim",
              "zoom": "200% computed-font simulation, not native browser/device zoom",
              "touch": "synthetic pointer events, not physical touch",
              "manual_not_tested": ["physical phone/keyboard", "screen reader", "native zoom", "Safari/iOS"],
              "results": RESULTS, "passed": sum(r["passed"] for r in RESULTS), "total": len(RESULTS)}
    (OUT / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"Result: {report['passed']}/{report['total']}")
    raise SystemExit(0 if report["passed"] == report["total"] else 1)


if __name__ == "__main__":
    main()