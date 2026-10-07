#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-D: composition layers:
- previews/data/index.html at 320 + 200%: identify overflow source (scrollW 428)
- previews/concepts/index.html (metric comparison + packed circles): circles
  area ∝ value check (measured diameters), fallback rows, zero/unknown,
  320 fit, resize behavior, 200%
- previews/info-strip/index.html + comparison.html: strip states (0/1/many),
  position/status, empty state
Output: probe-d-compositions.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-d-compositions.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

ZOOM2 = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""
UNZOOM = """() => { document.querySelectorAll('[data-r2-z],[data-r2z]').forEach((el) => { el.style.fontSize = ''; delete el.dataset.r2z; }); return true; }"""

OVERFLOW_SOURCE = """() => {
  const W = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > W + 1 || r.left < -1)) {
      let p = el.parentElement, clipped = false;
      while (p && p !== document.body) {
        const pcs = getComputedStyle(p);
        if (/(hidden|clip|auto|scroll)/.test(pcs.overflowX)) {
          const pr = p.getBoundingClientRect();
          if (pr.left >= -1 && pr.right <= W + 1) { clipped = true; break; }
        }
        p = p.parentElement;
      }
      if (!clipped) bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 70), w: +r.width.toFixed(1), right: +r.right.toFixed(1) });
    }
  });
  return bad.slice(0, 15);
}"""

CONCEPTS_MEASURE = """() => {
  const out = {};
  // metric circles (separated + overlap)
  out.circles = [...document.querySelectorAll('[data-metric-circles]')].map(ch => ({
    layout: ch.getAttribute('data-layout'),
    scaleState: ch.getAttribute('data-scale-state'),
    scaleNote: (ch.querySelector('[data-metric-scale]') || {}).textContent || null,
    items: [...ch.querySelectorAll('.m-metric-circles__item')].map(li => {
      const d = li.getBoundingClientRect();
      const r = li.querySelector('.m-metric-circles__visual');
      const rd = r ? r.getBoundingClientRect() : null;
      return {
        series: li.getAttribute('data-series'),
        state: li.getAttribute('data-state'),
        inside: li.getAttribute('data-inside'),
        boxW: +d.width.toFixed(1), boxH: +d.height.toFixed(1),
        bubbleW: rd ? +rd.width.toFixed(1) : null,
        reading: (li.querySelector('.m-metric-circles__inside-reading')||{}).textContent || null
      };
    }),
    fallbackItems: [...ch.querySelectorAll('.m-metric-circles__fallback-item')].map(li => li.textContent.trim())
  }));
  // packed circles
  out.packed = [...document.querySelectorAll('[data-chart-packed]')].map(ch => {
    const wrap = ch.querySelector('.m-bubbles');
    return {
      state: ch.getAttribute('data-scale-state'),
      legendOff: ch.getAttribute('data-legend'),
      wrapW: wrap ? +wrap.getBoundingClientRect().width.toFixed(1) : null,
      wrapH: wrap ? +wrap.style.height : null,
      circles: [...ch.querySelectorAll('.m-bubble')].map(b => {
        const c = b.querySelector('.m-bubble__circle');
        const cr = c ? c.getBoundingClientRect() : null;
        return {
          series: (b.className.match(/m-cat--(\\w)/) || [])[1],
          w: cr ? +cr.width.toFixed(1) : null,
          placement: b.getAttribute('data-value-placement'),
          external: b.getAttribute('data-external-value'),
          value: (b.querySelector('.m-bubble__value')||{}).textContent || null
        };
      }),
      stateList: [...ch.querySelectorAll('.m-packed__states .m-legend__item')].map(li => li.textContent.trim()),
      valueRows: [...ch.querySelectorAll('.m-packed__value-row')].map(li => li.textContent.trim()),
      legendItems: [...ch.querySelectorAll('.m-legend')].map(u => u.textContent.trim().slice(0, 80))
    };
  });
  out.doc = { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth };
  return out;
}"""

STRIP_MEASURE = """() => {
  const strips = [...document.querySelectorAll('[data-info-strip], [data-info-peek]')];
  return strips.map(s => ({
    peek: s.hasAttribute('data-info-peek'),
    slideCount: s.querySelectorAll('.m-info-strip__slide').length,
    position: (s.querySelector('[data-info-strip-position]')||{}).textContent || null,
    status: (s.querySelector('[data-info-strip-status]')||{}).textContent || null,
    emptyVisible: (s.querySelector('[data-info-strip-empty]') ? !s.querySelector('[data-info-strip-empty]').hidden : false),
    emptyText: (s.querySelector('[data-info-strip-empty]')||{}).textContent || null,
    controlsHidden: (s.querySelector('[data-info-strip-controls]')||{}).hidden,
    viewportHidden: (s.querySelector('[data-info-strip-viewport]')||{}).hidden
  }));
}"""

def run():
    result = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "zoom_mechanism": "project-declared per-element computed font-size *2, two clean passes",
    }, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)

        # ---------- data board overflow source at 320+200%
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("data:" + str(e)))
        page.goto(BASE + "/previews/data/index.html", wait_until="networkidle")
        page.wait_for_timeout(400)
        result["runs"]["data_board_320_1x"] = {"doc": page.evaluate("() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})")}
        page.evaluate(ZOOM2); page.wait_for_timeout(600)
        result["runs"]["data_board_320_200"] = {
            "doc": page.evaluate("() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})"),
            "overflow_sources": page.evaluate(OVERFLOW_SOURCE)
        }
        page.evaluate(UNZOOM)
        ctx.close()

        # ---------- concepts board (metric comparison + packed)
        ctx = browser.new_context(viewport={"width": 430, "height": 1000}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("concepts:" + str(e)))
        page.goto(BASE + "/previews/concepts/index.html", wait_until="networkidle")
        page.wait_for_timeout(700)
        result["runs"]["concepts_w430_1x"] = page.evaluate(CONCEPTS_MEASURE)
        page.set_viewport_size({"width": 320, "height": 1000})
        page.wait_for_timeout(800)
        result["runs"]["concepts_w320_live_resize"] = page.evaluate(CONCEPTS_MEASURE)
        page.evaluate(ZOOM2); page.wait_for_timeout(600)
        result["runs"]["concepts_w320_200pct"] = page.evaluate(CONCEPTS_MEASURE)
        if result["runs"]["concepts_w320_200pct"]["doc"]["scrollW"] > result["runs"]["concepts_w320_200pct"]["doc"]["clientW"] + 1:
            result["runs"]["concepts_w320_200pct"]["overflow_sources"] = page.evaluate(OVERFLOW_SOURCE)
        page.evaluate(UNZOOM); page.wait_for_timeout(300)

        # area proportionality check on separated circles: diameter ratio vs sqrt(value ratio)
        cm = result["runs"]["concepts_w430_1x"]["circles"]
        for group in cm:
            ds = [i["bubbleW"] for i in group["items"] if i["bubbleW"] and i["state"] == "positive"]
        result["runs"]["concepts_area_check_note"] = "diameters measured from bubbles; proportionality computed in analysis (sqrt ratio)"

        # screenshot of packed circles at 320
        el = page.query_selector("[data-chart-packed]")
        if el:
            el.scroll_into_view_if_needed()
            page.wait_for_timeout(300)
            el.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/concepts-packed-320.png")
        ctx.close()

        # ---------- info-strip previews
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("strip:" + str(e)))
        page.goto(BASE + "/previews/info-strip/index.html", wait_until="networkidle")
        page.wait_for_timeout(500)
        result["runs"]["info_strip_index_320"] = page.evaluate(STRIP_MEASURE)
        page.goto(BASE + "/previews/info-strip/comparison.html", wait_until="networkidle")
        page.wait_for_timeout(500)
        result["runs"]["info_strip_comparison_320"] = page.evaluate(STRIP_MEASURE)
        # 200% on comparison page
        page.evaluate(ZOOM2); page.wait_for_timeout(600)
        result["runs"]["info_strip_comparison_320_200"] = {
            "strips": page.evaluate(STRIP_MEASURE),
            "doc": page.evaluate("() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})"),
            "overflow_sources": page.evaluate(OVERFLOW_SOURCE)
        }
        page.evaluate(UNZOOM)
        ctx.close()

        result["pageerrors"] = errors
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    print(json.dumps(result["runs"]["data_board_320_200"]["doc"], ensure_ascii=False))
    print("overflow sources (data board 200%):", json.dumps(result["runs"]["data_board_320_200"]["overflow_sources"][:6], ensure_ascii=False))
    print("concepts 320 doc:", result["runs"]["concepts_w320_live_resize"]["doc"])
    for g in result["runs"]["concepts_w320_live_resize"]["circles"]:
        print("circles layout", g["layout"], "items:", [(i["series"], i["state"], i["bubbleW"], i["inside"], i["reading"]) for i in g["items"]], "fallback:", g["fallbackItems"][:3])
    for g in result["runs"]["concepts_w320_live_resize"]["packed"]:
        print("packed circles:", [(c["series"], c["w"], c["placement"]) for c in g["circles"]], "states:", g["stateList"], "wrapH:", g["wrapH"])
    print("strips index:", json.dumps(result["runs"]["info_strip_index_320"], ensure_ascii=False)[:600])
    print("strips comparison:", json.dumps(result["runs"]["info_strip_comparison_320"], ensure_ascii=False)[:800])
    print("pageerrors:", errors)

run()
