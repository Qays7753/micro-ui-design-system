#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-E2: packed-circle inside carousel card 3 expansion flow
(details region hidden at init -> expand -> ResizeObserver re-layout),
peek drag on F03 reports strip (RTL direction + snap-back), and carousel
card 1 screenshot at 320.
Output: probe-e2-packed-peek.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-e2-packed-peek.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

PACKED = """() => {
  const ch = document.querySelector('[data-chart-packed]');
  if (!ch) return null;
  const wrap = ch.querySelector('.m-bubbles');
  return {
    wrapW: +wrap.getBoundingClientRect().width.toFixed(1),
    wrapH: wrap.style.height,
    circles: [...ch.querySelectorAll('.m-bubble')].map(b => {
      const c = b.querySelector('.m-bubble__circle');
      const r = c.getBoundingClientRect();
      return { series: (String(b.className).match(/m-cat--(\\w)/) || [])[1],
               w: +r.width.toFixed(1), h: +r.height.toFixed(1),
               placement: b.getAttribute('data-value-placement'),
               value: (b.querySelector('.m-bubble__value')||{}).textContent || null,
               insideText: b.querySelector('.m-bubble__circle .m-bubble__value') ? true : false };
    }),
    valueRows: [...ch.querySelectorAll('.m-packed__value-row')].map(li => li.textContent.trim()),
    legendVisible: !!ch.querySelector('.m-legend')
  };
}"""

def run():
    result = {"meta": {"commit": "a5500c9", "tree": "05f344b",
        "pages": ["/previews/carousel/index.html", "/previews/ux-patterns/mobile-record-sample/index.html"]}, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("car:" + str(e)))
        page.goto(BASE + "/previews/carousel/index.html", wait_until="networkidle")
        page.wait_for_timeout(800)

        # before expansion (details hidden)
        page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('main-carousel'), 2)")
        page.wait_for_timeout(400)
        result["runs"]["packed_before_expand"] = page.evaluate(PACKED)

        # expand card 3 (real click on toggle button)
        page.click("#main-carousel [data-carousel-slide]:nth-child(3) [data-card-expand]")
        page.wait_for_timeout(600)
        result["runs"]["packed_after_expand"] = page.evaluate(PACKED)
        result["runs"]["expand_state"] = page.evaluate("""() => {
          const s = document.querySelectorAll('#main-carousel [data-carousel-slide]')[2];
          return { expanded: s.getAttribute('data-expanded'),
                   btnAria: s.querySelector('[data-card-expand]').getAttribute('aria-expanded'),
                   detailsHidden: s.querySelector('[data-card-details]').hidden };
        }""")
        card3 = page.query_selector("#main-carousel [data-carousel-slide]:nth-child(3)")
        card3.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/carousel-card3-packed-expanded-320.png")

        # card 1 screenshot
        page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('main-carousel'), 0)")
        page.wait_for_timeout(400)
        c1 = page.query_selector("#main-carousel")
        c1.scroll_into_view_if_needed()
        c1.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/carousel-card1-320.png")
        ctx.close()

        # ---- peek drag on F03 reports strip
        ctx2 = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page2 = ctx2.new_page()
        page2.on("pageerror", lambda e: errors.append("f03:" + str(e)))
        page2.goto(BASE + "/previews/ux-patterns/mobile-record-sample/index.html", wait_until="load")
        page2.wait_for_function("() => !!window.F03App", timeout=10000)
        page2.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
        page2.reload()
        page2.wait_for_function("() => !!window.F03App", timeout=10000)
        page2.evaluate("() => { const b = document.getElementById('f03-gw-demo'); if (b && !b.hidden) b.click(); }")
        page2.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page2.click("#f03-nav-reports")
        page2.wait_for_function("() => window.F03App.inspect().view === 'reports'", timeout=5000)
        page2.wait_for_timeout(600)

        vp = page2.evaluate("""() => { const v = document.querySelector('#f03-rep-strip [data-info-strip-viewport]'); const r = v.getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; }""")
        cx, cy = vp["x"] + vp["w"] / 2, vp["y"] + vp["h"] / 2
        idx0 = page2.evaluate("() => window.MicroInfoPeek.getIndex(document.getElementById('f03-rep-strip'))")
        # drag right in RTL = next
        page2.mouse.move(cx, cy)
        page2.mouse.down()
        for i in range(1, 11):
            page2.mouse.move(cx + i * 5, cy, steps=2)
        page2.wait_for_timeout(100)
        during = page2.evaluate("""() => { const t = document.querySelector('#f03-rep-strip .m-info-strip__track'); return { transform: t.style.transform, dragging: t.classList.contains('is-peek-dragging') }; }""")
        page2.mouse.up()
        page2.wait_for_timeout(400)
        after = page2.evaluate("() => ({ idx: window.MicroInfoPeek.getIndex(document.getElementById('f03-rep-strip')), pos: document.querySelector('#f03-rep-strip [data-info-strip-position]').textContent })")
        # small drag = snap back
        page2.mouse.move(cx, cy)
        page2.mouse.down()
        for i in range(1, 5):
            page2.mouse.move(cx - i * 5, cy, steps=2)
        page2.mouse.up()
        page2.wait_for_timeout(400)
        snapback = page2.evaluate("() => ({ idx: window.MicroInfoPeek.getIndex(document.getElementById('f03-rep-strip')), pos: document.querySelector('#f03-rep-strip [data-info-strip-position]').textContent })")
        result["runs"]["peek_drag_f03"] = {"before": idx0, "during": during, "afterDragRight60px": after, "afterDragLeft20px": snapback}
        result["pageerrors"] = errors
        ctx2.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    print("before expand:", json.dumps(result["runs"]["packed_before_expand"], ensure_ascii=False)[:300])
    print("after expand:", json.dumps(result["runs"]["packed_after_expand"], ensure_ascii=False)[:500])
    print("expand_state:", result["runs"]["expand_state"])
    print("peek drag:", json.dumps(result["runs"]["peek_drag_f03"], ensure_ascii=False))
    print("pageerrors:", errors)

run()
