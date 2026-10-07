#!/usr/bin/env python3
"""SUI-A5 Agent 5 — independent verification probe 4: D1 (peek stale geometry) + D2 (m-stat overflow).

D1 claim (falsification attempt): entering F03 reports, the peek strip shows
STALE geometry before any interaction: track transform translateX(0px), active
card flush to the viewport's start edge (RTL: right), adjacent slide peeking
~48px; after the FIRST goTo (arrow/drag/programmatic) the geometry corrects to
translateX(-30px) with the active card centered. Root cause claimed:
info-strip-peek.js measures at init while the section is hidden + only
window-resize listener, no ResizeObserver (data.js HAS one — R3-UI01).

D2 claim (falsification attempt): .m-stat__num (data.css:42-47) has no
overflow-wrap; long number at declared 200% text overflows a 288px card and
document scrollWidth sticks (overflow unreachable). Agent 4 measured 302.3px
for "1,240.50" and 431.9px for 9-digit "123,456.789".

My own data: "7,543,210,986.55" (16 glyphs) + "1,240.50" comparison, in my own
harness (evidence/agent5/harness-m-stat.html) AND on the real preview panel.
"""
import json, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/index.html"
DATA_PANEL = BASE + "/previews/data/"
HARNESS = BASE + "/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/harness-m-stat.html"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe4-d1d2.json"

PEEK_SNAP = """() => {
  const strip = document.getElementById('f03-rep-strip');
  const viewport = strip.querySelector('[data-info-strip-viewport]');
  const track = strip.querySelector('[data-info-strip-track]');
  const slides = [...strip.querySelectorAll('.m-info-strip__slide')];
  const cs = getComputedStyle(track);
  const vr = viewport.getBoundingClientRect();
  return {
    viewHidden: document.getElementById('view-reports').hidden,
    viewport: { left: +vr.left.toFixed(1), right: +vr.right.toFixed(1), w: +vr.width.toFixed(1) },
    trackTransform: cs.transform,
    trackTranslateX: (cs.transform.match(/([-\\d.]+)px/) || [null, null])[1] || null,
    slides: slides.map(s => { const r = s.getBoundingClientRect(); return { hidden: s.getAttribute('aria-hidden'), left: +r.left.toFixed(1), right: +r.right.toFixed(1), w: +r.width.toFixed(1) }; }),
    position: (strip.querySelector('[data-info-strip-position]') || {}).textContent,
    index: window.MicroInfoPeek.getIndex(strip),
  };
}"""

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b05ef12284abfc31ad9a1c8633dcd6a058",
        "browser": "Chrome for Testing 143.0.7499.4 (Playwright sync)",
        "textZoom200": "DECLARED clean two-pass (collect-then-apply, library ZOOM2_CLEAN style) — NOT native zoom",
    }}
    errs = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)

        # ================= D1: F03 reports peek =================
        ctx = browser.new_context(viewport={"width": 320, "height": 800})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.goto(F03, wait_until="networkidle")
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        page.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
        page.click("#f03-gw-demo")
        page.wait_for_selector("#view-home:not([hidden])")
        page.wait_for_timeout(400)
        page.click("#f03-nav-reports")
        page.wait_for_selector("#view-reports:not([hidden])")
        page.wait_for_timeout(600)
        results["D1_before_any_interaction"] = page.evaluate(PEEK_SNAP)
        page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe4-d1-peek-before-interaction-320.png")
        # first interaction: NEXT arrow (real click)
        page.click("#f03-rep-strip [data-info-strip-next]")
        page.wait_for_timeout(500)
        results["D1_after_first_real_click_next"] = page.evaluate(PEEK_SNAP)
        # isolate geometry correction without index change: goTo index 0 (agent 4's exact D1 numbers)
        page.evaluate("() => { const s = document.getElementById('f03-rep-strip'); window.MicroInfoPeek.goTo(s, 0, { animate: false }); }")
        page.wait_for_timeout(200)
        results["D1_after_programmatic_goTo_index0"] = page.evaluate(PEEK_SNAP)
        ctx.close()

        # ================= D2: m-stat harness + panel =================
        # (a) my harness at 320 viewport
        ctx2 = browser.new_context(viewport={"width": 320, "height": 800})
        page2 = ctx2.new_page()
        page2.on("pageerror", lambda e: errs.append("harness:" + str(e)))
        page2.goto(HARNESS, wait_until="networkidle")
        results["D2_harness_1x"] = page2.evaluate("""() => {
          const num = document.getElementById('h-num');
          const num2 = document.getElementById('h-num2');
          const card = document.getElementById('h-stat');
          const r = num.getBoundingClientRect(), r2 = num2.getBoundingClientRect(), cr = card.getBoundingClientRect();
          return {
            long: { text: num.textContent, w: +r.width.toFixed(1), right: +r.right.toFixed(1), left: +r.left.toFixed(1) },
            short: { w: +r2.width.toFixed(1) },
            card: { w: +cr.width.toFixed(1), right: +cr.right.toFixed(1) },
            overflowWrap: getComputedStyle(num).overflowWrap,
            doc: { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth },
          };
        }""")
        n = page2.evaluate("""() => {
          const els = [document.body].concat([...document.body.querySelectorAll('*')]);
          const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
          let n = 0; orig.forEach((it) => { if (it.fs > 0) { it.el.style.fontSize = (it.fs*2)+'px'; n++; } }); return n;
        }""")
        time.sleep(0.2)
        results["D2_harness_2x"] = {"elementsDoubled": n}
        results["D2_harness_2x"]["measure"] = page2.evaluate("""() => {
          const num = document.getElementById('h-num');
          const num2 = document.getElementById('h-num2');
          const card = document.getElementById('h-stat');
          const r = num.getBoundingClientRect(), r2 = num2.getBoundingClientRect(), cr = card.getBoundingClientRect();
          return {
            long: { text: num.textContent, w: +r.width.toFixed(1), right: +r.right.toFixed(1), left: +r.left.toFixed(1), font: getComputedStyle(num).fontSize },
            short: { w: +r2.width.toFixed(1), font: getComputedStyle(num2).fontSize },
            card: { w: +cr.width.toFixed(1), right: +cr.right.toFixed(1) },
            overflowWrap: getComputedStyle(num).overflowWrap,
            doc: { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth },
          };
        }""")
        page2.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe4-d2-mstat-harness-320-text200.png")
        ctx2.close()

        # (b) the REAL preview panel (previews/data/) at 320 + 200% whole-doc
        ctx3 = browser.new_context(viewport={"width": 320, "height": 900})
        page3 = ctx3.new_page()
        page3.on("pageerror", lambda e: errs.append("panel:" + str(e)))
        page3.goto(DATA_PANEL, wait_until="networkidle")
        # my own long value injected at runtime (DOM only — no source change)
        page3.evaluate("""() => {
          const num = document.querySelector('.m-stat__num');
          if (num) num.textContent = '7,543,210,986.55';
        }""")
        results["D2_panel_1x"] = page3.evaluate("""() => {
          const num = document.querySelector('.m-stat__num');
          const r = num.getBoundingClientRect();
          return { numW: +r.width.toFixed(1), right: +r.right.toFixed(1), doc: { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth } };
        }""")
        n3 = page3.evaluate("""() => {
          const els = [document.body].concat([...document.body.querySelectorAll('*')]);
          const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
          let n = 0; orig.forEach((it) => { if (it.fs > 0) { it.el.style.fontSize = (it.fs*2)+'px'; n++; } }); return n;
        }""")
        time.sleep(0.25)
        results["D2_panel_2x"] = {"elementsDoubled": n3, "measure": page3.evaluate("""() => {
          const num = document.querySelector('.m-stat__num');
          const card = num.closest('.m-stat');
          const r = num.getBoundingClientRect(), cr = card.getBoundingClientRect();
          return { numW: +r.width.toFixed(1), right: +r.right.toFixed(1), cardRight: +cr.right.toFixed(1), cardW: +cr.width.toFixed(1),
                   overflowWrap: getComputedStyle(num).overflowWrap,
                   doc: { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth } };
        }""")}
        ctx3.close()
        browser.close()

    results["pageerrors"] = errs
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)
    print("D1 before:", json.dumps(results["D1_before_any_interaction"], ensure_ascii=False))
    print("D1 after click next:", json.dumps(results["D1_after_first_real_click_next"], ensure_ascii=False))
    print("D1 after goTo idx0:", json.dumps(results["D1_after_programmatic_goTo_index0"], ensure_ascii=False))
    print("D2 harness 2x:", json.dumps(results["D2_harness_2x"], ensure_ascii=False))
    print("D2 panel 2x:", json.dumps(results["D2_panel_2x"], ensure_ascii=False))

if __name__ == "__main__":
    main()
