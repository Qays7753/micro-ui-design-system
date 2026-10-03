#!/usr/bin/env python3
"""Rendered UI release gates. No product logic, device, or screen-reader claims."""
import hashlib
import json
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("MICRO_TEST_BASE", "http://127.0.0.1:5000")

# T01: أسماء التوكنات المطلوبة تُقرأ صراحة عبر getPropertyValue —
# تعداد CSSStyleDeclaration غير مضمون عبر إصدارات المحرك (توقف على
# Chromium 134 بعد 281 فحصًا ثم KeyError). الحد الأدنى المدعوم معلن
# أدناه بدل الاعتماد على تعداد غير مضمون؛ الإصدار يُسجل في التقرير.
REQUIRED_TOKENS = (
    "text-primary", "text-secondary", "text-hint", "text-inverse",
    "brand-primary", "brand-gradient-start", "brand-pressed",
    "surface-page", "surface-base",
    "danger", "success", "success-surface", "warning", "warning-surface",
    "info", "info-surface", "border-control", "focus-ring",
)
PAGES = {
    "gallery": "/previews/",
    "system": "/previews/system/",
    **{name: f"/previews/{name}/example-usage.html" for name in (
        "buttons", "fields", "selection", "organization", "surfaces",
        "data", "messages", "navigation")},
    **{name: f"/components/{name}/example-usage.html" for name in (
        "info-strip", "metric-comparison", "account-settings", "access-gateway")},
}


def contrast(a, b):
    def luminance(value):
        value = value.strip().lstrip("#")
        if len(value) == 3:
            value = "".join(c * 2 for c in value)
        channels = [int(value[i:i + 2], 16) / 255 for i in (0, 2, 4)]
        linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in channels]
        return sum(c * w for c, w in zip(linear, (.2126, .7152, .0722)))
    x, y = sorted((luminance(a), luminance(b)))
    return (y + .05) / (x + .05)


def resolve_chromium(pw):
    """T01: حسم المتصفح بترتيب معلن — MICRO_TEST_CHROME ثم chromium على PATH
    ثم Chromium المرفق مع Playwright؛ يُسجل المحدد في التقرير."""
    override = os.environ.get("MICRO_TEST_CHROME")
    if override:
        if not Path(override).exists():
            raise RuntimeError(f"MICRO_TEST_CHROME does not exist: {override}")
        return override, "MICRO_TEST_CHROME"
    on_path = shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")
    if on_path:
        return on_path, "PATH"
    try:
        return pw.chromium.executable_path, "playwright-bundled"
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError("No Chromium found (MICRO_TEST_CHROME / PATH / playwright bundle)") from exc


def main():
    out = ROOT / "reviews/UI-RELEASE"
    (out / "screenshots").mkdir(parents=True, exist_ok=True)
    results, errors, assets = [], [], []

    def check(name, ok, detail=None):
        results.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name)

    with sync_playwright() as pw:
        binary, binary_source = resolve_chromium(pw)
        browser = pw.chromium.launch(executable_path=binary)
        print(f"# engine: {browser.version} ({binary_source}: {binary})")
        page = browser.new_page(viewport={"width": 390, "height": 874})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("response", lambda r: assets.append(r.url) if r.status >= 400 else None)

        def load(path):
            response = page.goto(BASE + path)
            check("Page loads: " + path, response.ok)
            page.wait_for_load_state("networkidle")
            page.evaluate("document.fonts.ready")

        for name, path in PAGES.items():
            for width in (320, 360, 390, 430):
                page.set_viewport_size({"width": width, "height": 874})
                load(path)
                check(f"{name} {width}: RTL", page.evaluate("document.documentElement.dir === 'rtl'"))
                check(f"{name} {width}: no horizontal overflow", page.evaluate(
                    "document.documentElement.scrollWidth <= innerWidth + 1"))
                check(f"{name} {width}: all rendered LTR readings retain direction", page.evaluate(
                    "[...document.querySelectorAll('[dir=ltr]')].every(e => getComputedStyle(e).direction === 'ltr')"))
                if width == 390:
                    page.screenshot(path=str(out / "screenshots" / f"{name}.png"))
                page.evaluate("""() => {
                  const sizes=[...document.querySelectorAll('body, body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);
                  sizes.forEach(([e,s])=>e.style.fontSize=s*2+'px');
                  if(window.MicroMetricComparison) MicroMetricComparison.render();
                }""")
                check(f"{name} {width}: CSS text 200% no horizontal overflow", page.evaluate(
                    "document.documentElement.scrollWidth <= innerWidth + 1"))

        load(PAGES["buttons"])
        # T01: قراءة صريحة بأسماء معلنة عبر getPropertyValue (لا تعداد CSS)
        tokens = page.evaluate("""(names) => {
          const s=getComputedStyle(document.documentElement);
          const out={};
          for (const n of names) {
            const v=s.getPropertyValue(n).trim();
            if (v) out[n]=v;
          }
          return out;
        }""", ["--micro-" + name for name in REQUIRED_TOKENS])
        missing = [n for n in ("--micro-" + t for t in REQUIRED_TOKENS) if n not in tokens]
        check("Required tokens readable via explicit getPropertyValue", not missing, missing)
        for foreground, background, minimum in (
            ("text-primary", "surface-page", 4.5),
            ("text-secondary", "surface-page", 4.5),
            ("text-hint", "surface-base", 4.5),
            ("text-inverse", "brand-primary", 4.5),
            ("text-inverse", "brand-gradient-start", 4.5),
            ("text-inverse", "brand-pressed", 4.5),
            ("danger", "surface-base", 4.5),
            ("success", "success-surface", 4.5),
            ("warning", "warning-surface", 4.5),
            ("info", "info-surface", 4.5),
            ("border-control", "surface-base", 3),
            ("focus-ring", "surface-base", 3),
        ):
            ratio = contrast(tokens["--micro-" + foreground], tokens["--micro-" + background])
            check(f"Contrast {foreground}/{background} >= {minimum}", ratio >= minimum, round(ratio, 3))

        # Complete consumer markup exercises the real production CSS and setter.
        page.evaluate("""() => {
          const host=document.createElement('section');
          host.id='release-fixture'; host.style.padding='24px'; host.style.background='var(--micro-surface-base)';
          host.innerHTML=`
            <button id="ui-text" class="m-btn m-btn--primary" type="button" data-loading-label="جارٍ الحفظ">حفظ</button>
            <button id="ui-span" class="m-btn m-btn--secondary" type="button" aria-label="حفظ نسخة"><span>حفظ نسخة</span></button>
            <button id="ui-icon" class="m-btn m-btn--primary" type="button"><svg class="m-btn__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>حفظ</button>
            <button id="ui-legacy" class="m-btn m-btn--primary m-btn--loading-replace" type="button">حفظ</button>
            <button id="ui-disabled" class="m-btn m-btn--primary" type="button" disabled>حفظ</button>
            <button id="ui-long" class="m-btn m-btn--primary" type="button" style="width:180px">تسمية عربية طويلة لا تختصر ولا تقص عند التفاف النص إلى أسطر متعددة</button>`;
          document.body.prepend(host);
        }""")
        for identifier in ("ui-text", "ui-span", "ui-icon", "ui-legacy"):
            element = page.locator("#" + identifier)
            before = element.evaluate("""e=>({
              w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,
              label:e.getAttribute('aria-label'),markup:e.innerHTML})""")
            element.focus()
            page.evaluate("(id)=>MicroButtons.setLoading(document.getElementById(id),true)", identifier)
            during = element.evaluate("""e=>({
              w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,
              busy:e.getAttribute('aria-busy'),focused:document.activeElement===e,
              visibleLabel:!e.querySelector('.m-btn__label')||getComputedStyle(e.querySelector('.m-btn__label')).opacity==='1',
              shadow:getComputedStyle(e).boxShadow,outline:getComputedStyle(e).outlineWidth})""")
            check(identifier + ": stable loading dimensions", abs(before["w"] - during["w"]) < 1 and abs(before["h"] - during["h"]) < 1)
            check(identifier + ": busy preserves focus", during["busy"] == "true" and during["focused"])
            if identifier != "ui-legacy":
                check(identifier + ": label remains visible", during["visibleLabel"])
            page.evaluate("""id => {
              const e=document.getElementById(id);e.dataset.clicks='0';
              e.addEventListener('click',()=>e.dataset.clicks=String(+e.dataset.clicks+1));
              e.click();
            }""", identifier)
            element.press("Enter")
            element.press("Space")
            check(identifier + ": busy blocks repeated activation", element.get_attribute("data-clicks") == "0")
            page.evaluate("""id=>{
              const e=document.getElementById(id);MicroButtons.setLoading(e,true);
              MicroButtons.setLoading(e,false);MicroButtons.setLoading(e,false);
            }""", identifier)
            check(identifier + ": stop restores original name and markup", element.evaluate(
                "(e,b)=>e.getAttribute('aria-label')===b.label && e.innerHTML===b.markup && !e.hasAttribute('aria-busy')", before))

        page.evaluate("MicroButtons.setLoading(document.querySelector('#ui-disabled'),true)")
        check("Disabled is not confused with loading", page.locator("#ui-disabled").evaluate(
            "e=>e.disabled && !e.hasAttribute('aria-busy') && !e.querySelector('.m-btn__spinner')"))
        check("Multiline button has bounded 24px radius", page.locator("#ui-long").evaluate(
            "e=>['24px','min(24px, 50%)'].includes(getComputedStyle(e).borderTopLeftRadius) && e.scrollWidth<=e.clientWidth"))
        check("Visible controls retain 48px targets", page.locator("#release-fixture button").evaluate_all(
            "es=>es.every(e=>e.getBoundingClientRect().width>=48 && e.getBoundingClientRect().height>=48)"))
        page.locator("#ui-text").focus()
        check("Keyboard focus has visible treatment", page.locator("#ui-text").evaluate(
            "e=>getComputedStyle(e).boxShadow!=='none'||parseFloat(getComputedStyle(e).outlineWidth)>=2"))
        page.emulate_media(reduced_motion="reduce")
        page.evaluate("MicroButtons.setLoading(document.querySelector('#ui-text'),true)")
        check("Reduced motion stops spinner", page.locator("#ui-text .m-btn__spinner").evaluate(
            "e=>getComputedStyle(e).animationName==='none' || parseFloat(getComputedStyle(e).animationDuration)===0"))
        load(PAGES["account-settings"])
        page.evaluate("MicroIcons.ready")
        page.locator("[data-account-open]").click()
        page.locator("[data-account-to-application]").click()
        check("Independent account icons are actually drawn without gallery helpers",
              page.locator("svg[data-micro-icon]").evaluate_all(
                  "es=>es.length===2 && es.every(e=>e.getBBox().width>0 && e.getBBox().height>0)"))
        check("No runtime errors", not errors, errors)
        check("No failed source assets", not assets, assets)
        source = {}
        for folder in ("components", "shared", "previews"):
            for path in sorted((ROOT / folder).rglob("*")):
                if path.is_file() and not path.is_symlink():
                    source[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
        source["tools/ui-release-check.py"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
        report = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "engine": "chromium", "version": browser.version,
            "engine_binary_source": binary_source,
            "engine_binary": binary,
            "physical_device": False, "screen_reader": False,
            "text_enlargement": "computed CSS font sizes doubled; not native browser/device zoom",
            "passed": sum(r["passed"] for r in results), "total": len(results),
            "results": results, "source_sha256": source,
        }
        (out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
        browser.close()
    print(f'{report["passed"]}/{report["total"]}')
    if report["passed"] != report["total"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()