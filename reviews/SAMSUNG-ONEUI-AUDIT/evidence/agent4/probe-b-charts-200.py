#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-B: chart labels at 200% using the PROJECT-DECLARED
mechanism (per-element computed font-size doubling, two clean passes with
data-r2z marker — same as tools/ui-repair-r2-check.py ZOOM2_CLEAN), plus
donut 148 contract, render-event counting on live resize, and value
visibility. Baseline a5500c9. Output: probe-b-charts-200.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-b-charts-200.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

ZOOM2 = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""

UNZOOM = """() => {
  document.querySelectorAll('[data-r2-z],[data-r2z]').forEach((el) => {
    el.style.fontSize = ''; delete el.dataset.r2z;
  });
  return true;
}"""

LABEL_CHECK = """() => {
  function rowsOverlap(a, b) {
    return !(a.bottom <= b.top + 0.5 || b.bottom <= a.top + 0.5);
  }
  function collide(a, b) {
    return rowsOverlap(a, b) && !(a.right <= b.left + 0.5 || b.right <= a.left + 0.5);
  }
  const out = {};
  ['#bars', '#line'].forEach(secId => {
    const sec = document.querySelector(secId);
    if (!sec) return;
    sec.querySelectorAll('.m-chart').forEach((ch, ci) => {
      const plot = ch.querySelector('[data-plot]');
      const plotRect = plot.getBoundingClientRect();
      const svg = ch.querySelector('svg');
      const labels = [...svg.querySelectorAll('text')].filter(t => /bar-label|x-label/.test(t.getAttribute('class') || ''));
      const rects = labels.map(t => ({ t, r: t.getBoundingClientRect() }));
      const collisions = [];
      for (let i = 0; i < rects.length; i++)
        for (let j = i + 1; j < rects.length; j++)
          if (collide(rects[i].r, rects[j].r)) collisions.push([i, j]);
      const outside = rects.filter(({r}) => r.left < plotRect.left - 0.5 || r.right > plotRect.right + 0.5).length;
      const values = [...svg.querySelectorAll('text')].filter(t => /bar-value|point-value/.test(t.getAttribute('class') || ''));
      out[secId + ':' + ci] = {
        labelCount: labels.length,
        collisions: collisions.length,
        collisionPairs: collisions,
        labelsOutsidePlot: outside,
        plotW: +plotRect.width.toFixed(1),
        labelTexts: labels.map(t => t.textContent),
        labelFs: [...new Set(labels.map(t => getComputedStyle(t).fontSize))],
        valueTexts: values.map(t => t.textContent),
        valueFs: [...new Set(values.map(t => getComputedStyle(t).fontSize))],
        truncated: labels.filter(t => t.textContent.includes('…')).map(t => ({
          text: t.textContent, aria: t.getAttribute('aria-label'), title: t.querySelector('title') ? t.querySelector('title').textContent : null
        }))
      };
    });
  });
  return out;
}"""

DONUT_CHECK = """() => {
  const donuts = [...document.querySelectorAll('.m-chart[data-chart="donut"]')];
  return donuts.map(ch => {
    const svg = ch.querySelector('.m-donut__svg');
    if (!svg) return { refused: true, error: (ch.querySelector('.m-chart__error') || {}).textContent || null, state: ch.getAttribute('data-scale-state') };
    const r = svg.getBoundingClientRect();
    return {
      refused: false,
      size: [r.width, r.height],
      viewBox: svg.getAttribute('viewBox'),
      segmentCircles: svg.querySelectorAll('circle').length,
      centerText: (svg.querySelector('.m-donut__center') || {}).textContent || null,
      legend: [...ch.querySelectorAll('.m-legend__item')].map(li => li.textContent.trim()),
      state: ch.getAttribute('data-scale-state')
    };
  });
}"""

def run():
    result = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "page": BASE + "/previews/data/index.html",
        "zoom_mechanism": "PROJECT-DECLARED: per-element computed font-size *2, two clean passes, data-r2z marker (same as tools/ui-repair-r2-check.py ZOOM2_CLEAN) — NOT native zoom",
    }, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "/previews/data/index.html", wait_until="networkidle")
        page.wait_for_timeout(500)

        result["runs"]["z320_1x"] = {"labels": page.evaluate(LABEL_CHECK), "donuts": page.evaluate(DONUT_CHECK)}

        # ---- pass 1
        n = page.evaluate(ZOOM2)
        page.wait_for_timeout(600)
        result["runs"]["z320_200pct_pass1"] = {"doubled": n, "labels": page.evaluate(LABEL_CHECK), "donuts": page.evaluate(DONUT_CHECK),
            "overflow": page.evaluate("() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})")}

        # ---- clean revert then pass 2
        page.evaluate(UNZOOM)
        page.wait_for_timeout(300)
        result["runs"]["z320_back_to_1x"] = {"labels": page.evaluate(LABEL_CHECK)}
        n2 = page.evaluate(ZOOM2)
        page.wait_for_timeout(600)
        result["runs"]["z320_200pct_pass2"] = {"doubled": n2, "labels": page.evaluate(LABEL_CHECK), "donuts": page.evaluate(DONUT_CHECK),
            "overflow": page.evaluate("() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})")}
        page.evaluate(UNZOOM)
        page.wait_for_timeout(300)

        # ---- render event counting on live width change (proper window counter)
        page.evaluate("""() => { window.__renders = 0; document.addEventListener('micro-data:rendered', () => window.__renders++); }""")
        page.set_viewport_size({"width": 430, "height": 900})
        page.wait_for_timeout(700)
        r430 = page.evaluate("() => window.__renders")
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(700)
        r320 = page.evaluate("() => window.__renders")
        result["runs"]["render_events_live_resize"] = {
            "events_after_430": r430, "events_after_back_320": r320,
            "note": "counter attached at 320 before widening; both directions counted"
        }
        # effective sizes at 320 after live resize again
        result["runs"]["w320_after_live_resize_sizes"] = page.evaluate("""() => {
          const out = {};
          ['#bars .m-chart', '#line .m-chart'].forEach(sel => {
            const ch = document.querySelector(sel);
            if (!ch) return;
            const svg = ch.querySelector('svg');
            const ctm = svg.getScreenCTM();
            const labs = [...svg.querySelectorAll('text')].filter(t => /bar-label|x-label/.test(t.getAttribute('class')||''));
            if (labs.length) {
              const fs = parseFloat(getComputedStyle(labs[0]).fontSize);
              out[sel] = [fs, +(fs * ctm.a).toFixed(2)];
            } else out[sel] = null;
          });
          return out;
        }""")

        result["pageerrors"] = errors
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    for k, v in result["runs"].items():
        if "labels" in v:
            for sec, d in v["labels"].items():
                if isinstance(d, dict) and d.get("labelCount"):
                    print(k, sec, "labels:", d["labelCount"], "collisions:", d["collisions"], "outside:", d["labelsOutsidePlot"], "fs:", d["labelFs"])
    print("donuts 1x:", [(d["size"], d["segmentCircles"], d["centerText"]) for d in result["runs"]["z320_1x"]["donuts"]])
    print("donuts 200 pass2:", [(d["size"], d["segmentCircles"], d["centerText"]) for d in result["runs"]["z320_200pct_pass2"]["donuts"]])
    print("render events:", result["runs"]["render_events_live_resize"])
    print("sizes after live resize:", result["runs"]["w320_after_live_resize_sizes"])
    print("pageerrors:", errors)

run()
