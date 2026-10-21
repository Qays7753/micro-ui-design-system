#!/usr/bin/env python3
"""Source-only SVG, navigation and segmented geometry checks in Chromium.

Artifacts default to a temporary directory; --out PATH overrides it.
Text enlargement is simulated, not an Android/iOS native zoom test.
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
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ["shared/tokens.css", "components/data/data.css", "components/data/data.js",
           "components/data/example-usage.html", "components/navigation/navigation.css",
           "components/navigation/navigation.js", "components/selection/selection.css",
           "components/selection/selection.js"]
CONTROLS = """<nav class="m-navbar" aria-label="تنقل المثال" id="nav">
<button class="m-navbar__item" type="button" aria-current="page"><svg aria-hidden="true" data-micro-icon="home02.svg"></svg><span>مشروعي</span></button>
<button class="m-navbar__item" type="button"><svg aria-hidden="true" data-micro-icon="grid.svg"></svg><span>العمل</span></button>
<button class="m-navbar__item" type="button"><svg aria-hidden="true" data-micro-icon="package01.svg"></svg><span>الطلبات</span></button>
<button class="m-navbar__item" type="button"><svg aria-hidden="true" data-micro-icon="user-circle.svg"></svg><span>الحساب</span></button></nav>
<div class="m-seg" data-seg role="group" aria-label="نوع القراءة" id="seg">
<button type="button" class="m-seg__item" aria-pressed="true">الطلبات النشطة</button>
<button type="button" class="m-seg__item" aria-pressed="false">قيد التجهيز</button>
<button type="button" class="m-seg__item" aria-pressed="false">بانتظار المراجعة</button></div>
<div class="m-tabs" data-tabs role="tablist" aria-label="أمثلة التبويب" id="tabs">
<button type="button" class="m-tabs__tab" role="tab" aria-selected="true">الأول</button>
<button type="button" class="m-tabs__tab" role="tab" aria-selected="false">الثاني</button></div>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path != "/chart-mobile-fixture.html":
            return super().do_GET()
        html = (ROOT / "components/data/example-usage.html").read_text(encoding="utf-8")
        html = html.replace('<head>', '<head><base href="/components/data/">')
        html = html.replace('</head>', '''
<link rel="stylesheet" href="../navigation/navigation.css">
<link rel="stylesheet" href="../selection/selection.css">
<style>main{grid-template-columns:minmax(0,1fr)}</style></head>''')
        html = html.replace('<main>', '<main>' + CONTROLS)
        html = html.replace('</body>', '''<script src="../../shared/icons.js"></script>
<script src="../navigation/navigation.js"></script><script src="../selection/selection.js"></script></body>''')
        payload = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-chart-mobile-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/chart-mobile-fixture.html"
    rows, errors = [], []

    def check(name, ok, detail=None):
        rows.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            context = browser.new_context(viewport={"width": 390, "height": 844},
                                          is_mobile=True, has_touch=True, reduced_motion="reduce")
            page = context.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("requestfailed", lambda r: errors.append(r.url + ": " + str(r.failure)))
            page.on("response", lambda r: errors.append(f"HTTP {r.status}: {r.url}") if r.status >= 400 else None)
            for width in [320, 360, 390, 430]:
                page.set_viewport_size({"width": width, "height": 844})
                page.goto(base)
                page.evaluate("document.fonts.ready")
                page.evaluate("MicroIcons.ready")
                page.wait_for_timeout(80)
                for kind in ["bars", "line"]:
                    geom = page.locator(f"#{kind} [data-plot]").evaluate("""e=>{
                      const s=e.querySelector('svg');return{width:e.getBoundingClientRect().width,
                      view:s.viewBox.baseVal.width,font:[...s.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)*t.getScreenCTM().a)};}""")
                    check(f"{width}: {kind} width follows component; text stays 13px",
                          abs(geom["width"] - geom["view"]) < .1 and all(abs(f - 13) < .1 for f in geom["font"]), geom)
                ratio = page.locator("#bars .m-chart__bar").evaluate_all("es=>es.map(e=>parseFloat(e.getAttribute('height'))).filter(h=>h>0)")
                check(f"{width}: bar heights preserve 8:4:10", len(ratio) == 3 and abs(ratio[0]/ratio[1] - 2) < .01 and abs(ratio[2]/ratio[1] - 2.5) < .01, ratio)
                check(f"{width}: missing line point keeps two separate paths",
                      page.locator("#line .m-chart__line").count() == 2 and page.locator("#line .m-chart__dot").count() == 4)
                check(f"{width}: zero/unknown/negative bubbles are decorative SVG markers with distinct readings",
                      page.locator("#bubble-states svg.m-bubble__circle--none[aria-hidden=true]").count() == 3 and
                      page.locator("#bubble-states .m-bubble__value").all_text_contents() == ["0", "— غير متاح", "-2 (سالب غير صالح للمساحة)"])
                diameters = page.locator("#bubbles .m-bubble__circle").evaluate_all("es=>es.map(e=>e.getBoundingClientRect().width)")
                check(f"{width}: SVG bubble areas preserve 90:3:12", abs((diameters[0]/diameters[1])**2 - 30) < .08 and abs((diameters[2]/diameters[1])**2 - 4) < .04, diameters)
                check(f"{width}: full donut total moves outside ring",
                      page.locator("#long-donut .m-donut__number").inner_text() == "123456789" and page.locator("#long-donut svg text").count() == 0)
                for zoom in [1, 2]:
                    if zoom == 2:
                        page.evaluate("""()=>{
                          const nodes=[...document.querySelectorAll('#nav *,#seg *')];
                          const sizes=nodes.map(e=>parseFloat(getComputedStyle(e).fontSize));
                          nodes.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px');
                        }""")
                    nav = page.locator("#nav .m-navbar__item").evaluate_all("es=>es.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,sw:e.scrollWidth,cw:e.clientWidth}})")
                    check(f"{width} text {zoom*100}%: navbar stays one row with readable 48px targets",
                          max(r["y"] for r in nav)-min(r["y"] for r in nav) < 1 and all(r["w"] >= 48 and r["h"] >= 48 and r["sw"] <= r["cw"] for r in nav), nav)
                    seg = page.locator("#seg .m-seg__item").evaluate_all("es=>es.map(e=>{const r=e.getBoundingClientRect();return{y:r.y,w:r.width,h:r.height}})")
                    check(f"{width} text {zoom*100}%: segmented stays one row and retains target geometry",
                          max(r["y"] for r in seg)-min(r["y"] for r in seg) < 1 and all(r["w"] >= 48 and r["h"] + 8 >= 48 for r in seg), seg)
                    check(f"{width} text {zoom*100}%: no page overflow", page.evaluate("document.documentElement.scrollWidth<=innerWidth"))
                page.locator("#nav").screenshot(path=str(out / f"navbar-{width}-text-200.png"))
            for direction, key in [("rtl", "ArrowLeft"), ("ltr", "ArrowRight")]:
                page.goto(base)
                page.locator("main").evaluate("(e,d)=>e.dir=d", direction)
                for selector, state in [("#seg .m-seg__item", "aria-pressed"), ("#tabs [role=tab]", "aria-selected")]:
                    items = page.locator(selector)
                    items.nth(0).focus()
                    page.keyboard.press(key)
                    check(f"{direction}: {selector} follows visual arrow direction", items.nth(1).get_attribute(state) == "true")
            page.locator("#donut").evaluate("e=>{e.style.setProperty('--micro-amount2-size','44px');MicroData.render(e)}")
            check("enlarged donut total uses full external reading", page.locator("#donut .m-donut__number").inner_text() == "25")
            page.set_viewport_size({"width": 320, "height": 844})
            page.wait_for_function("Math.abs(document.querySelector('#bars svg').viewBox.baseVal.width-document.querySelector('#bars [data-plot]').getBoundingClientRect().width)<.1")
            check("resize remeasures SVG without consumer render", True)
            check("no JavaScript or resource errors", not errors, errors)
            version = browser.version
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    passed = sum(r["passed"] for r in rows)
    report = {"head": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
              "source_sha256": {f: hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in SOURCES},
              "browser": version, "scope": "Chromium emulation; real devices, WebKit, screen readers, safe areas and native zoom NOT RUN",
              "passed": passed, "failed": len(rows)-passed, "checks": rows}
    (out/"verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{passed} PASS / {len(rows)-passed} FAIL — {out}")
    return 0 if passed == len(rows) else 1


if __name__ == "__main__":
    raise SystemExit(main())
