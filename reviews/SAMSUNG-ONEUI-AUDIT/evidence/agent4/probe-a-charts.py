#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-A: charts (bars/line) resize 430→320 without reload,
actual SVG text font-size vs declared 13/12px, 200% two-pass (declared
mechanism: double root font-size — documented, not native zoom),
donut 148px preservation, label truncation + full reading attrs.

Baseline: a5500c9 (tree 05f344b). Playwright sync + Chromium at
/home/z/my-project/evidence/bin/chromium via http://localhost:5000.
Output JSON: evidence/agent4/probe-a-charts.json
"""
import json, sys, time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-a-charts.json"

CHROME = "/home/z/my-project/evidence/bin/chromium"

MEASURE_JS = """
() => {
  function chartInfo(sel) {
    const c = document.querySelector(sel);
    if (!c) return null;
    const plot = c.querySelector('[data-plot]');
    const svg = c.querySelector('svg');
    const texts = svg ? [...svg.querySelectorAll('text')] : [];
    const ctm = svg ? svg.getScreenCTM() : null;
    const labels = texts.filter(t => /bar-label|x-label/.test(t.getAttribute('class') || ''));
    const labelPx = labels.length ? labels.map(t => {
      const fs = parseFloat(getComputedStyle(t).fontSize);
      const scale = ctm ? ctm.a : 1;  // viewBox units -> screen px
      return {
        cls: t.getAttribute('class'),
        cssPx: fs,                     // CSS px of the <text> font-size
        screenPx: +(fs * scale).toFixed(2),  // effective on-screen size
        text: t.textContent,
        aria: t.getAttribute('aria-label'),
        hasTitle: !!t.querySelector('title'),
        titleText: t.querySelector('title') ? t.querySelector('title').textContent : null,
        x: parseFloat(t.getAttribute('x')) || 0,
        len: (function(){ try { return +t.getComputedTextLength().toFixed(2); } catch(e){ return -1; } })()
      };
    }) : [];
    const values = texts.filter(t => /bar-value|point-value/.test(t.getAttribute('class') || '')).map(t => ({
      text: t.textContent,
      cssPx: parseFloat(getComputedStyle(t).fontSize),
      clipped: false
    }));
    return {
      plotWidth: plot ? plot.getBoundingClientRect().width : null,
      viewBox: svg ? svg.getAttribute('viewBox') : null,
      labelCount: labelPx.length,
      labels: labelPx,
      valueCount: values.length,
      values: values,
      scaleState: c.getAttribute('data-scale-state'),
      rects: svg ? svg.querySelectorAll('rect').length : 0,
      hasError: !!c.querySelector('.m-chart__error')
    };
  }
  return {
    bars: chartInfo('#bars .m-chart--bars'),
    bars5: chartInfo('#bars .m-chart--bars:nth-of-type(2)'),
    line: chartInfo('#line .m-chart--line'),
    donut: (function(){
      const c = document.querySelector('.m-chart--donut');
      if (!c) return null;
      const svg = c.querySelector('.m-donut__svg');
      const r = svg ? svg.getBoundingClientRect() : null;
      return { width: r ? r.width : null, height: r ? r.height : null,
               viewBox: svg ? svg.getAttribute('viewBox') : null,
               segments: svg ? svg.querySelectorAll('circle').length : 0,
               center: (svg && svg.querySelector('.m-donut__center')) ? svg.querySelector('.m-donut__center').textContent : null,
               legendItems: [...c.querySelectorAll('.m-legend__item')].map(li => li.textContent.trim())
      };
    })()
  };
}
"""

def run():
    result = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "tool": "Playwright sync + Chromium (Chrome for Testing)",
        "page": BASE + "/previews/data/index.html",
        "mechanism_200pct": "declared: multiply html font-size by 2 (two clean passes, recorded before/after) — simulates text scaling, NOT native browser zoom",
        "zero_mechanism": "root html font-size * 1 back to normal"
    }, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, args=["--force-device-scale-factor=1"])
        ctx = browser.new_context(viewport={"width": 430, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "/previews/data/index.html", wait_until="networkidle")
        page.wait_for_timeout(400)

        # --- 1) at 430, before resize
        result["runs"]["w430_before"] = page.evaluate(MEASURE_JS)

        # --- 2) resize 430 -> 320 WITHOUT reload (ResizeObserver path)
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(700)  # allow RO to fire + re-render
        result["runs"]["w320_after_live_resize"] = page.evaluate(MEASURE_JS)
        rendered_events = page.evaluate("""
          () => { let n = 0; document.addEventListener('micro-data:rendered', () => n++); return n; }
        """)
        # count renders triggered by another tiny resize
        page.set_viewport_size({"width": 328, "height": 900})
        page.wait_for_timeout(700)
        n = page.evaluate("() => window.__n || 0")
        result["runs"]["render_count_probe"] = {"note": "listener attached after first resize; second resize 320->328 to count events", "events_after_second_resize": n}
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(500)

        # --- 3) 200% first pass: double root font-size
        before_200 = page.evaluate("() => { return { htmlFs: getComputedStyle(document.documentElement).fontSize, bodyFs: getComputedStyle(document.body).fontSize }; }")
        page.add_style_tag(content="html { font-size: 200% !important; }")
        page.wait_for_timeout(600)
        result["runs"]["before_200_root"] = before_200
        result["runs"]["w320_200pct_pass1"] = page.evaluate(MEASURE_JS)

        # --- 4) overflow check at 200%
        result["runs"]["overflow_w320_200"] = page.evaluate("""
          () => ({
            docScrollW: document.documentElement.scrollWidth,
            docClientW: document.documentElement.clientWidth,
            bodyScrollW: document.body.scrollWidth,
            horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
          })
        """)

        # --- 5) 200% second pass (clean two-pass): revert then re-apply
        page.add_style_tag(content="html { font-size: 100% !important; }")
        page.wait_for_timeout(300)
        pass1b = page.evaluate(MEASURE_JS)
        page.evaluate("() => { document.querySelectorAll('style').forEach(s => { if (s.textContent.includes('font-size: 100%')) s.remove(); }); }")
        page.wait_for_timeout(300)
        inter = page.evaluate(MEASURE_JS)
        page.add_style_tag(content="html { font-size: 200% !important; }")
        page.wait_for_timeout(600)
        result["runs"]["w320_200pct_pass2"] = page.evaluate(MEASURE_JS)

        # --- 6) donut at 320 and 200%
        # --- 7) screenshots
        page.evaluate("() => { document.querySelectorAll('style').forEach(s => { if (s.textContent.includes('font-size: 200%')) s.remove(); }); }")
        page.wait_for_timeout(300)
        page.set_viewport_size({"width": 430, "height": 900})
        page.wait_for_timeout(500)
        shot_dir = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4"
        # section screenshots: bars + line at 320 (live-resized) then 200%
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(500)
        for sel, name in [("#bars", "data-bars-320-live"), ("#line", "data-line-320-live")]:
            el = page.query_selector(sel)
            if el:
                el.scroll_into_view_if_needed()
                page.wait_for_timeout(200)
                el.screenshot(path=shot_dir + "/" + name + ".png")
        page.add_style_tag(content="html { font-size: 200% !important; }")
        page.wait_for_timeout(600)
        el = page.query_selector("#bars")
        if el:
            el.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            el.screenshot(path=shot_dir + "/data-bars-320-200pct.png")
        page.evaluate("() => { document.querySelectorAll('style').forEach(s => { if (s.textContent.includes('font-size: 200%')) s.remove(); }); }")
        result["pageerrors"] = errors
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)

    # quick console summary
    def summary(runs):
        for k in ["w430_before", "w320_after_live_resize", "w320_200pct_pass1", "w320_200pct_pass2"]:
            r = runs.get(k)
            if not r: continue
            print("===", k)
            for key in ["bars", "line", "donut"]:
                c = r.get(key)
                if not c: continue
                if key == "donut":
                    print(f"  donut: {c['width']}x{c['height']} segments={c['segments']} center={c['center']!r}")
                else:
                    labs = c.get("labels") or []
                    if labs:
                        fs = [l["cssPx"] for l in labs]
                        print(f"  {key}: plotW={c['plotWidth']} labels={c['labelCount']} cssPx={sorted(set(fs))}")
                        for l in labs[:4]:
                            print(f"    - {l['text']!r} aria={l['aria']!r} title={l['hasTitle']} len={l['len']}")
    summary(result["runs"])

run()
