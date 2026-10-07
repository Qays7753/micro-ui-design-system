#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-E: carousel (previews/carousel/index.html):
- RTL drag direction (real mouse pointer events, threshold > max(32, 20% slide))
- below-threshold drag = snap-back, edge resistance at ends
- real keyboard: ArrowLeft/Right/Home/End (RTL logical order), Tab order
- status counter text + dots (6 cards), disabled states at ends
- inert on non-current slides; focus not trapped
- packed circles inside card 3: diameter proportionality + value placement
- reduced-motion context: transition none on track
Output: probe-e-carousel.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-e-carousel.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

STATE = """(id) => {
  const c = document.getElementById(id);
  const st = window.MicroCarousel.getIndex(c);
  const track = c.querySelector('[data-track]');
  const slides = [...c.querySelectorAll('[data-carousel-slide]')];
  return {
    index: st, count: slides.length,
    status: (c.querySelector('[data-status]')||{}).textContent || null,
    transform: track.style.transform,
    dataDir: c.getAttribute('data-dir'),
    prevDisabled: (c.querySelector('[data-prev]')||{}).disabled,
    nextDisabled: (c.querySelector('[data-next]')||{}).disabled,
    dots: [...c.querySelectorAll('.m-carousel__dot')].map(b => b.getAttribute('aria-label')),
    currentFlags: slides.map(s => s.getAttribute('data-current')),
    inert: slides.map(s => !!s.inert),
    slideW: +(slides[0].getBoundingClientRect().width.toFixed(1)),
    ariaLabels: slides.slice(0,2).map(s => s.getAttribute('aria-label'))
  };
}"""

PACKED = """() => {
  const ch = document.querySelector('[data-chart-packed]');
  if (!ch) return null;
  const bubbles = [...ch.querySelectorAll('.m-bubble')].map(b => {
    const c = b.querySelector('.m-bubble__circle');
    return {
      series: (String(b.className).match(/m-cat--(\\w)/) || [])[1],
      w: +(c.getBoundingClientRect().width.toFixed(1)),
      placement: b.getAttribute('data-value-placement'),
      externalRow: b.getAttribute('data-external-value'),
      value: (b.querySelector('.m-bubble__value')||{}).textContent || null
    };
  });
  return {
    wrapH: (ch.querySelector('.m-bubbles')||{}).style ? ch.querySelector('.m-bubbles').style.height : null,
    legendOff: ch.getAttribute('data-legend'),
    states: [...ch.querySelectorAll('.m-packed__states .m-legend__item')].map(li => li.textContent.trim()),
    valueRows: [...ch.querySelectorAll('.m-packed__value-row')].map(li => li.textContent.trim()),
    circles: bubbles
  };
}"""

def run():
    result = {"meta": {"commit": "a5500c9", "tree": "05f344b",
        "page": BASE + "/previews/carousel/index.html",
        "drag": "real Playwright mouse pointer events (trusted), viewport 320"}, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "/previews/carousel/index.html", wait_until="networkidle")
        page.wait_for_timeout(800)

        main = page.query_selector("#main-carousel")
        main.scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        result["runs"]["initial"] = page.evaluate(STATE, "main-carousel")

        vp = main.bounding_box()
        cx = vp["x"] + vp["width"] / 2
        cy = vp["y"] + vp["height"] / 2

        # --- drag RIGHT (dx>0) in RTL should go NEXT (index+1)
        page.mouse.move(cx, cy)
        page.mouse.down()
        for i in range(1, 13):
            page.mouse.move(cx + i * 5, cy, steps=2)
        page.wait_for_timeout(150)
        during = page.evaluate("(id) => { const c = document.getElementById(id); const t = c.querySelector('[data-track]'); return { transform: t.style.transform, isDragging: c.classList.contains('is-dragging'), transition: getComputedStyle(t).transition }; }", "main-carousel")
        page.mouse.up()
        page.wait_for_timeout(500)
        result["runs"]["drag_right_rtl"] = {"during": during, "after": page.evaluate(STATE, "main-carousel"), "dragPx": 60}

        # --- drag LEFT at current index (dx<0) should go PREV (index-1) if not 0, else edge-resist
        st_before = page.evaluate("(id) => window.MicroCarousel.getIndex(document.getElementById(id))", "main-carousel")
        page.mouse.move(cx, cy)
        page.mouse.down()
        for i in range(1, 13):
            page.mouse.move(cx - i * 5, cy, steps=2)
        page.wait_for_timeout(100)
        page.mouse.up()
        page.wait_for_timeout(500)
        result["runs"]["drag_left_rtl"] = {"beforeIndex": st_before, "after": page.evaluate(STATE, "main-carousel")}

        # --- below threshold drag (20px) should snap back (same index)
        st_before = page.evaluate("(id) => window.MicroCarousel.getIndex(document.getElementById(id))", "main-carousel")
        page.mouse.move(cx, cy)
        page.mouse.down()
        for i in range(1, 5):
            page.mouse.move(cx + i * 5, cy, steps=2)
        page.mouse.up()
        page.wait_for_timeout(500)
        result["runs"]["drag_below_threshold"] = {"beforeIndex": st_before, "after": page.evaluate(STATE, "main-carousel"), "dragPx": 20}

        # --- keyboard REAL: focus carousel root, ArrowLeft (RTL=next)
        page.focus("#main-carousel")
        page.wait_for_timeout(200)
        idx0 = page.evaluate("(id) => window.MicroCarousel.getIndex(document.getElementById(id))", "main-carousel")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(350)
        after_left = page.evaluate(STATE, "main-carousel")
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(350)
        after_right = page.evaluate(STATE, "main-carousel")
        page.keyboard.press("Home")
        page.wait_for_timeout(350)
        after_home = page.evaluate(STATE, "main-carousel")
        page.keyboard.press("End")
        page.wait_for_timeout(350)
        after_end = page.evaluate(STATE, "main-carousel")
        result["runs"]["keyboard"] = {"startIdx": idx0, "afterArrowLeft": {"index": after_left["index"], "status": after_left["status"]},
            "afterArrowRight": {"index": after_right["index"]}, "afterHome": {"index": after_home["index"], "prevDisabled": after_home["prevDisabled"]},
            "afterEnd": {"index": after_end["index"], "nextDisabled": after_end["nextDisabled"]}}

        # --- Tab order: prev -> next -> dots (keyboard tab from carousel root)
        page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('main-carousel'), 1)")
        page.wait_for_timeout(200)
        page.focus("#main-carousel")
        order = []
        for _ in range(4):
            page.keyboard.press("Tab")
            page.wait_for_timeout(80)
            order.append(page.evaluate("() => { const a = document.activeElement; return (a.className + ' ' + (a.getAttribute('aria-label') || '')).trim().slice(0, 60); }"))
        result["runs"]["tab_order"] = order

        # --- 6-card lab: dots built + wrap; status counter
        lab = page.query_selector("#lab-many")
        lab.scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        result["runs"]["lab_six_cards"] = page.evaluate(STATE, "lab-many")

        # --- packed circles in card 3 (go to index 2)
        page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('main-carousel'), 2)")
        page.wait_for_timeout(400)
        result["runs"]["packed_in_card3"] = page.evaluate(PACKED)
        main.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/carousel-card3-packed-320.png")

        # --- focus check: inert slides not tabbable (only current)
        result["runs"]["inert_check"] = page.evaluate(STATE, "main-carousel")["inert"]

        result["pageerrors"] = errors
        ctx.close()

        # --- reduced motion context
        ctx2 = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar", reduced_motion="reduce")
        page2 = ctx2.new_page()
        page2.on("pageerror", lambda e: errors.append("rm:" + str(e)))
        page2.goto(BASE + "/previews/carousel/index.html", wait_until="networkidle")
        page2.wait_for_timeout(600)
        result["runs"]["reduced_motion"] = page2.evaluate("""() => {
          const t = document.querySelector('#main-carousel [data-track]');
          const dot = document.querySelector('#main-carousel .m-carousel__dot');
          return { trackTransition: getComputedStyle(t).transition,
                   dotTransition: dot ? getComputedStyle(dot, '::before').transition : null };
        }""")
        ctx2.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    print("initial:", json.dumps(result["runs"]["initial"], ensure_ascii=False)[:400])
    print("drag_right (RTL, +60px):", result["runs"]["drag_right_rtl"]["after"]["index"], "during:", result["runs"]["drag_right_rtl"]["during"])
    print("drag_left:", result["runs"]["drag_left_rtl"]["beforeIndex"], "->", result["runs"]["drag_left_rtl"]["after"]["index"])
    print("below threshold:", result["runs"]["drag_below_threshold"]["beforeIndex"], "->", result["runs"]["drag_below_threshold"]["after"]["index"])
    print("keyboard:", json.dumps(result["runs"]["keyboard"], ensure_ascii=False))
    print("tab order:", result["runs"]["tab_order"])
    print("six cards:", {k: result["runs"]["lab_six_cards"][k] for k in ["index", "count", "status", "dots", "prevDisabled", "nextDisabled"]})
    print("packed:", json.dumps(result["runs"]["packed_in_card3"], ensure_ascii=False)[:600])
    print("reduced motion:", result["runs"]["reduced_motion"])
    print("pageerrors:", errors)

run()
