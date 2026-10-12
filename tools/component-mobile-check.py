#!/usr/bin/env python3
"""Direct mobile interaction gates for B02/B03, using source CSS/JS only.

python3 tools/component-mobile-check.py [--out PATH]
Chromium touch emulation and text-size simulation; no real-device claims.
Artifacts default to a temporary directory, outside the repository.
"""
import argparse
import hashlib
import http.server
import json
import subprocess
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ["shared/tokens.css", "components/buttons/buttons.css", "components/buttons/buttons.js",
           "components/fields/fields.css", "components/fields/fields.js",
           "components/selection/selection.css", "components/selection/selection.js"]

HTML = """<!doctype html><html lang="ar" dir="rtl"><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="components/buttons/buttons.css">
<link rel="stylesheet" href="components/fields/fields.css">
<link rel="stylesheet" href="components/selection/selection.css">
<style>body{margin:16px;background:var(--micro-surface-page);font-family:var(--micro-font-family)}
section{display:grid;gap:16px;margin-block:24px}</style></head><body>
<section id="fields">
  <div class="m-field" data-micro-field id="text-field">
    <label class="m-field__label" for="text">اسم الصنف</label>
    <div class="m-field__control"><input class="m-field__input" id="text" value="صابون زيت الزيتون">
      <button type="button" class="m-btn m-btn--icon m-btn--secondary m-field__clear" aria-label="مسح البحث">
        <svg class="m-btn__icon" aria-hidden="true" data-micro-icon="cancel01.svg"></svg>
      </button></div>
  </div>
  <div class="m-field" data-micro-field id="qty-field">
    <label class="m-field__label" for="qty">الكمية</label>
    <div class="m-field__control">
      <div class="m-field__stepper"><button type="button" class="m-btn m-btn--icon m-btn--secondary" data-step="down" aria-label="إنقاص الكمية">
        <svg class="m-btn__icon" aria-hidden="true" data-micro-icon="minus-sign.svg"></svg></button></div>
      <input class="m-field__input m-field__input--num" id="qty" type="text" inputmode="numeric" value="5" min="0" max="10" step="1">
      <div class="m-field__stepper"><button type="button" class="m-btn m-btn--icon m-btn--secondary" data-step="up" aria-label="زيادة الكمية">
        <svg class="m-btn__icon" aria-hidden="true" data-micro-icon="plus-sign.svg"></svg></button></div>
      <span class="m-field__unit">صندوق</span>
    </div>
  </div>
</section>
<section id="selection"><div data-choice-group>
  <label class="m-choice m-choice--check"><input type="checkbox" data-select-all id="all">
    <span class="m-choice__box"><svg aria-hidden="true" data-micro-icon="check.svg"></svg></span><span class="m-choice__text">تحديد الكل</span></label>
  <label class="m-choice m-choice--check"><input type="checkbox" data-choice-item checked id="one">
    <span class="m-choice__box"><svg aria-hidden="true" data-micro-icon="check.svg"></svg></span><span class="m-choice__text">طلبات التجهيز</span></label>
  <label class="m-choice m-choice--check"><input type="checkbox" data-choice-item id="two">
    <span class="m-choice__box"><svg aria-hidden="true" data-micro-icon="check.svg"></svg></span><span class="m-choice__text">توصيلات اليوم</span></label>
</div>
<label class="m-switch"><span class="m-switch__text"><span class="m-switch__label">تنبيهات الطلبات</span></span>
  <input type="checkbox" role="switch" checked><span class="m-switch__track"><span class="m-switch__thumb"></span></span></label>
</section>
<section id="geometry">
  <div style="display:flex;flex-wrap:wrap;gap:var(--micro-space-2)">
    <button type="button" class="m-btn m-btn--secondary" id="short-button">أ</button>
    <button type="button" class="m-btn m-btn--secondary m-btn--icon" aria-label="بحث" id="icon-button">
      <svg class="m-btn__icon" aria-hidden="true" data-micro-icon="search-01.svg"></svg>
    </button>
  </div>
  <div class="m-seg" data-seg role="group" aria-label="عدد الوحدات">
    <button type="button" class="m-seg__item" aria-pressed="true">1</button>
    <button type="button" class="m-seg__item" aria-pressed="false">2</button>
    <button type="button" class="m-seg__item" aria-pressed="false">3</button>
  </div>
</section>
<script src="shared/icons.js"></script><script src="components/buttons/buttons.js"></script>
<script src="components/fields/fields.js"></script><script src="components/selection/selection.js"></script>
</body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/component-mobile-fixture.html":
            payload = HTML.replace("<head>", '<head><base href="/">').encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        else:
            super().do_GET()

    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-component-mobile-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/"
    rows, errors = [], []

    def check(name, ok, detail=None):
        rows.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            context = browser.new_context(viewport={"width": 390, "height": 844},
                                          is_mobile=True, has_touch=True, reduced_motion="reduce")
            page = context.new_page()
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            page.on("requestfailed", lambda req: errors.append(req.url))
            page.on("response", lambda res: errors.append(f"{res.status} {res.url}") if res.status >= 400 else None)
            page.goto(base + "component-mobile-fixture.html", wait_until="load")
            page.evaluate("document.fonts.ready")
            page.evaluate("MicroIcons.ready")

            for width in (320, 360, 390, 430):
                page.set_viewport_size({"width": width, "height": 844})
                sizes = page.locator("#geometry button").evaluate_all("es=>es.map(e=>({id:e.id,cls:e.className,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))")
                check(f"{width}: short text and icon buttons retain 48x48 targets",
                      all(r["w"] >= 48 and r["h"] >= 48 for r in sizes if r["id"]), sizes)
                segment = page.locator("#geometry .m-seg__item").first
                segment.scroll_into_view_if_needed()
                hit = segment.evaluate("""e=>{const r=e.getBoundingClientRect(),p=getComputedStyle(e,'::after');return {
                  w:r.width,h:r.height-parseFloat(p.top)-parseFloat(p.bottom),
                  above:e.contains(document.elementFromPoint(r.left+r.width/2,r.top-3)),
                  below:e.contains(document.elementFromPoint(r.left+r.width/2,r.bottom+3))};}""")
                check(f"{width}: short segment has actual 48x48 hit area", hit["w"] >= 48 and hit["h"] >= 48 and hit["above"] and hit["below"], hit)
                control = page.locator("#text-field .m-field__control")
                control.scroll_into_view_if_needed()
                box = control.bounding_box()
                for edge, y in (("top", box["y"] + 3), ("bottom", box["y"] + box["height"] - 3)):
                    page.evaluate("document.activeElement.blur()")
                    page.touchscreen.tap(box["x"] + box["width"] / 2, y)
                    check(f"{width}: field {edge} interior focuses input",
                          page.locator("#text").evaluate("e=>document.activeElement===e"))
                page.locator("#text-field .m-field__clear").tap()
                check(f"{width}: clear stays independent and restores focus",
                      page.locator("#text").input_value() == "" and page.locator("#text").evaluate("e=>document.activeElement===e"))
                page.locator("#text").fill("صابون زيت الزيتون")
                for direction in ("rtl", "ltr"):
                    # Local direction differs from the page in the LTR case.
                    page.locator(".m-switch").evaluate("(e,d)=>e.dir=d", direction)
                    for checked in (False, True):
                        page.locator(".m-switch input").evaluate("(e,v)=>e.checked=v", checked)
                        geometry = page.locator(".m-switch").evaluate("""e=>{
                          const a=e.querySelector('.m-switch__track').getBoundingClientRect();
                          const b=e.querySelector('.m-switch__thumb').getBoundingClientRect();
                          return {inside:b.left>=a.left&&b.right<=a.right,
                                  leftGap:b.left-a.left,rightGap:a.right-b.right,
                                  topGap:b.top-a.top,bottomGap:a.bottom-b.bottom};}""")
                        end_gap = geometry["leftGap" if (direction == "rtl") == checked else "rightGap"]
                        check(f"{width}: switch {direction} checked={checked} stays at expected end",
                              geometry["inside"] and abs(end_gap - 3) < 0.5
                              and abs(geometry["topGap"] - geometry["bottomGap"]) < 0.5, geometry)
                for section in ("fields", "selection"):
                    page.locator("#" + section).screenshot(path=str(out / f"{section}-{width}.png"))

            mixed = page.locator("#all").evaluate("""e=>{
              const a=getComputedStyle(e.nextElementSibling,'::after');
              return {mixed:e.indeterminate,checked:e.checked,
                      checkOpacity:getComputedStyle(e.nextElementSibling.querySelector('svg')).opacity,
                      mask:a.maskImage,content:a.content};}""")
            check("partial selection shows approved minus, hides check", mixed["mixed"] and not mixed["checked"]
                  and mixed["checkOpacity"] == "0" and "minus-sign.svg" in mixed["mask"] and mixed["content"] != "none", mixed)
            page.locator("#all").locator("..").tap()
            check("select all replaces partial with checked state", page.locator("#all").evaluate("""e=>e.checked&&!e.indeterminate
                  &&getComputedStyle(e.nextElementSibling.querySelector('svg')).opacity==='1'
                  &&getComputedStyle(e.nextElementSibling,'::after').content==='none'"""))
            page.locator("#all").locator("..").tap()
            check("clear all resets children", page.locator("[data-choice-item]").evaluate_all("es=>es.every(e=>!e.checked)"))

            page.evaluate("""window.edits=0;window.fieldEdits=0;window.buttonClicks=0;
              document.querySelector('#qty').addEventListener('input',()=>edits++);
              document.querySelector('#qty-field').addEventListener('micro-field:changed',()=>fieldEdits++);
              document.querySelector('#qty-field [data-step=up]').addEventListener('click',()=>buttonClicks++);""")
            up = page.locator("#qty-field [data-step=up]")
            down = page.locator("#qty-field [data-step=down]")
            up.tap()
            check("available step changes value and emits once", page.locator("#qty").input_value() == "6"
                  and page.evaluate("edits===1&&fieldEdits===1&&buttonClicks===1"))

            def set_value(value):
                page.locator("#qty").evaluate("(e,v)=>e.value=v", value)
                page.evaluate("MicroFields.sync(document.querySelector('#qty-field'))")

            for value, button, name in (("10", up, "maximum"), ("0", down, "minimum")):
                set_value(value)
                before = page.evaluate("[edits,fieldEdits,buttonClicks]")
                button.scroll_into_view_if_needed()
                box = button.bounding_box()
                page.touchscreen.tap(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
                button.focus()
                button.press("Enter")
                button.press("Space")
                check(f"{name}: unavailable step blocks touch, keyboard and no-op events",
                      button.get_attribute("aria-disabled") == "true" and page.locator("#qty").input_value() == value
                      and page.evaluate("[edits,fieldEdits,buttonClicks]") == before)
            set_value("5")
            check("programmatic sync restores available steps silently", not up.is_disabled() and not down.is_disabled())
            for attr in ("readonly", "disabled"):
                page.locator("#qty").evaluate("(e,a)=>e.setAttribute(a,'')", attr)
                page.wait_for_timeout(20)
                check(f"{attr}: both steps expose unavailable state", up.is_disabled() and down.is_disabled())
                page.locator("#qty").evaluate("(e,a)=>e.removeAttribute(a)", attr)
                page.wait_for_timeout(20)
                check(f"{attr}: removing lock restores availability", not up.is_disabled() and not down.is_disabled())
            down.evaluate("e=>e.disabled=true")
            page.wait_for_timeout(20)
            page.locator("#qty").evaluate("e=>e.readOnly=true")
            page.wait_for_timeout(20)
            page.locator("#qty").evaluate("e=>e.readOnly=false")
            page.wait_for_timeout(20)
            check("consumer disabled is preserved after lock/unlock", down.evaluate("e=>e.disabled") and not up.is_disabled())
            down.evaluate("e=>e.disabled=false")
            page.locator("#qty").evaluate("e=>e.max='5'")
            page.wait_for_timeout(20)
            check("changed bound immediately updates availability", up.is_disabled())

            page.set_viewport_size({"width": 320, "height": 844})
            page.evaluate("""()=>{
              const sizes=[...document.querySelectorAll('body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);
              sizes.forEach(([e,size])=>e.style.fontSize=size*2+'px');}""")
            overflow = page.locator("#fields").evaluate("e=>({width:e.getBoundingClientRect().width,scroll:e.scrollWidth,page:document.documentElement.scrollWidth})")
            check("320 + 200% text: fields stay within page", overflow["page"] <= 320, overflow)
            check("320 + 200% text: step targets retain 48px", page.locator("[data-step]").evaluate_all("es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=48&&r.height>=48})"))
            page.locator("#fields").screenshot(path=str(out / "fields-320-text-200.png"))
            check("no JavaScript or resource errors", not errors, errors)
            version = browser.version
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    passed = sum(row["passed"] for row in rows)
    report = {"head": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
              "source_sha256": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in SOURCES},
              "browser": version, "scope": "Chromium touch emulation only; real devices, Safari, screen readers, safe areas and native zoom NOT RUN",
              "passed": passed, "failed": len(rows) - passed, "checks": rows}
    (out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{passed} PASS / {len(rows)-passed} FAIL — {out}")
    return 0 if passed == len(rows) else 1


if __name__ == "__main__":
    raise SystemExit(main())
