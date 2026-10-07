#!/usr/bin/env python3
"""SUI-A5 Agent 5 — independent verification probe 6: KEEP spot-checks.

KEEP claims under test (falsification attempt — a KEEP that hides an unfixed
problem must be exposed):
 1) Agent 1 / K1 (contrast): lowest real text pair = hint #5F7378 on page
    #F7F8F4 = 4.68:1; white #FFFFFF on petroleum #164D59 = 9.38:1.
    -> My own WCAG math in Python (no browser needed).
 2) Agent 4 / K1 (chart label ACTUAL on-screen size): at 430 the bars-chart
    labels render at 13.89px actual; after a LIVE 430->320 resize (no reload,
    ResizeObserver path) they are exactly 13.00px (bars) / 12.00px (line).
    -> My own measurement: computed font-size x CTM scale on the real panel.
 3) Agent 2 / K7 (picker contract): searching "الوطنية" filters the picker to
    exactly 2 options; keyboard selection updates the summary.
 4) Agent 3 / K1 (layer contract, spot): opening a B07 layer in F03 focuses
    first control, Escape closes it and RESTORES focus to the trigger.
"""
import json, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/index.html"
DATA_PANEL = BASE + "/previews/data/"
SELECTION_PANEL = BASE + "/previews/selection/"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe6-keeps.json"

# ---------- 1) contrast math (my own implementation) ----------
def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def rel_lum(hexcolor):
    h = hexcolor.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b)

def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)

LABEL_GEOM = """() => {
  const bars = document.querySelector('[data-chart="bars"]');
  const line = document.querySelector('[data-chart="line"]');
  function grab(chart) {
    if (!chart) return null;
    const svg = chart.querySelector('svg');
    if (!svg) return null;
    const plot = chart.querySelector('[data-plot] svg') || svg;
    const texts = [...plot.querySelectorAll('text')];
    const cs = getComputedStyle(texts[0] || plot);
    const vb = svg.getAttribute('viewBox').split(/\\s+/).map(Number);
    const ctmr = svg.getBoundingClientRect();
    const scale = ctmr.width / vb[2];
    return {
      svgW: +ctmr.width.toFixed(2), viewBox: vb.join(' '), scale: +scale.toFixed(4),
      labelComputedFont: texts.length ? getComputedStyle(texts[0]).fontSize : null,
      labelCount: texts.length,
      firstLabels: texts.slice(0, 3).map(t => t.textContent),
    };
  }
  return { bars: grab(bars), line: grab(line) };
}"""

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b05ef12284abfc31ad9a1c8633dcd6a058",
        "browser": "Chrome for Testing 143.0.7499.4 (Playwright sync)",
    }}
    # ---- 1) contrast ----
    results["K1_agent1_contrast"] = {
        "hint_on_page": {"pair": "#5F7378 on #F7F8F4", "ratio": contrast("#5F7378", "#F7F8F4")},
        "hint_on_white": {"pair": "#5F7378 on #FFFFFF", "ratio": contrast("#5F7378", "#FFFFFF")},
        "white_on_petroleum": {"pair": "#FFFFFF on #164D59", "ratio": contrast("#FFFFFF", "#164D59")},
        "text_on_page": {"pair": "#172D32 on #F7F8F4", "ratio": contrast("#172D32", "#F7F8F4")},
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)

        # ---- 2) Agent 4 K1: label actual size at 430 then live 430->320 ----
        ctx = browser.new_context(viewport={"width": 430, "height": 900})
        page = ctx.new_page()
        page.goto(DATA_PANEL, wait_until="networkidle")
        page.wait_for_timeout(600)
        results["K1_agent4_labels_at430"] = page.evaluate(LABEL_GEOM)
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(600)  # ResizeObserver path, no reload
        results["K1_agent4_labels_live320"] = page.evaluate(LABEL_GEOM)
        ctx.close()

        # ---- 3) Agent 2 K7: picker search + keyboard select ----
        ctx2 = browser.new_context(viewport={"width": 360, "height": 900})
        page2 = ctx2.new_page()
        page2.goto(SELECTION_PANEL, wait_until="networkidle")
        page2.wait_for_timeout(400)
        # open the B07 picker layer
        page2.click("[data-layer-open='picker-layer']")
        page2.wait_for_selector("#picker-layer:not([hidden])")
        page2.wait_for_timeout(300)
        k7 = {}
        k7["focusAfterOpen"] = page2.evaluate("() => document.activeElement && (document.activeElement.id || document.activeElement.className)")
        page2.fill("#picker-layer #picker-search", "الوطنية") if page2.evaluate("() => !!document.querySelector('#picker-layer #picker-search')") else page2.fill("#picker-search", "الوطنية")
        page2.wait_for_timeout(300)
        k7["filtered"] = page2.evaluate("""() => {
          const layer = document.getElementById('picker-layer');
          const opts = [...layer.querySelectorAll('.m-picker__option')].filter(o => o.getBoundingClientRect().height > 0 || !o.hidden);
          const visible = [...layer.querySelectorAll('.m-picker__option')].filter(o => o.offsetParent !== null || o.getBoundingClientRect().height > 0);
          return { visibleCount: visible.length, visibleTexts: visible.map(o => o.textContent.trim()),
                   anyNoResults: !!layer.querySelector('.m-picker__empty, .m-picker__no-results') };
        }""")
        # keyboard: first option focused, press Enter to select
        page2.keyboard.press("Enter")
        page2.wait_for_timeout(300)
        k7["afterEnter"] = page2.evaluate("""() => {
          const layer = document.getElementById('picker-layer');
          const sel = [...layer.querySelectorAll('.m-picker__option')].filter(o => o.getAttribute('aria-selected') === 'true').map(o => o.textContent.trim());
          const foot = layer.querySelector('.m-picker__foot, [data-picker-summary]');
          const status = document.querySelector('[data-picker-status]');
          return { selected: sel, foot: foot ? foot.textContent.trim() : null, status: status ? status.textContent.trim() : null,
                   layerStillOpen: !layer.hidden };
        }""")
        results["K7_agent2_picker"] = k7
        # ---- 4) Agent 3 K1: layer focus/escape contract in F03 form ----
        page3 = ctx2.new_page()
        page3.goto(F03, wait_until="networkidle")
        page3.wait_for_function("() => !!window.F03App", timeout=10000)
        page3.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
        page3.click("#f03-gw-demo")
        page3.wait_for_selector("#view-home:not([hidden])")
        page3.wait_for_timeout(300)
        page3.click("#f03-nav-list")
        page3.wait_for_selector("#view-list:not([hidden])")
        page3.wait_for_timeout(250)
        page3.click("#f03-list-rows .f03-row")
        page3.wait_for_selector("#view-detail:not([hidden])")
        page3.wait_for_timeout(250)
        page3.click("#f03-detail-edit")
        page3.wait_for_selector("#view-form:not([hidden])")
        page3.wait_for_timeout(300)
        page3.click("#f03-cat-trigger")
        page3.wait_for_selector("#f03-cat-layer:not([hidden])")
        page3.wait_for_timeout(300)
        lay = {}
        lay["focusAfterOpen"] = page3.evaluate("() => document.activeElement && (document.activeElement.id || document.activeElement.tagName + '.' + document.activeElement.className)")
        lay["navbarInert"] = page3.evaluate("() => document.getElementById('f03-navbar').inert")
        page3.keyboard.press("Escape")
        page3.wait_for_timeout(400)
        lay["layerClosedAfterEscape"] = page3.evaluate("() => document.getElementById('f03-cat-layer').hidden")
        lay["focusRestoredToTrigger"] = page3.evaluate("() => document.activeElement === document.getElementById('f03-cat-trigger')")
        lay["navbarInertAfterClose"] = page3.evaluate("() => document.getElementById('f03-navbar').inert")
        results["K1_agent3_layer_contract"] = lay
        ctx2.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)
    print(json.dumps(results, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
