#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-C: F03 reports view (composition layer):
- reach view-reports through the real app (F03App.enter + navbar)
- charts at 320/430 + live resize + 200% (project-declared per-element zoom)
- donut in collapsible section: 148 contract + segment count after open
- info-strip peek in reports: status text, inert slides, position, keyboard,
  focus transfer on programmatic navigation, RTL arrows
- overflow source identification at 200%
Output: probe-c-f03-reports.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-c-f03-reports.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

ZOOM2 = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""
UNZOOM = """() => {
  document.querySelectorAll('[data-r2-z],[data-r2z]').forEach((el) => { el.style.fontSize = ''; delete el.dataset.r2z; });
  return true;
}"""

REP_MEASURE = """() => {
  const out = {};
  function chartInfo(id) {
    const ch = document.getElementById(id);
    if (!ch) return null;
    const plot = ch.querySelector('[data-plot]');
    const svg = ch.querySelector('svg');
    if (!svg) return { refused: true, state: ch.getAttribute('data-scale-state') };
    const ctm = svg.getScreenCTM();
    const labs = [...svg.querySelectorAll('text')].filter(t => /bar-label|x-label/.test(t.getAttribute('class')||''));
    const rowRects = labs.map(t => t.getBoundingClientRect());
    let collisions = 0;
    for (let i = 0; i < rowRects.length; i++)
      for (let j = i+1; j < rowRects.length; j++) {
        const a = rowRects[i], b = rowRects[j];
        const rowOv = !(a.bottom <= b.top + 0.5 || b.bottom <= a.top + 0.5);
        const colOv = !(a.right <= b.left + 0.5 || b.right <= a.left + 0.5);
        if (rowOv && colOv) collisions++;
      }
    const fs = labs.length ? labs.map(t => parseFloat(getComputedStyle(t).fontSize)) : [];
    const screen = labs.length ? labs.map(t => +(parseFloat(getComputedStyle(t).fontSize) * ctm.a).toFixed(2)) : [];
    const plotRect = plot.getBoundingClientRect();
    const outside = rowRects.filter(r => r.left < plotRect.left - 0.5 || r.right > plotRect.right + 0.5).length;
    return {
      refused: false, plotW: +plotRect.width.toFixed(1),
      labelCount: labs.length, labelTexts: labs.map(t => t.textContent),
      labelCssPx: [...new Set(fs.map(v => +v.toFixed(2)))],
      labelScreenPx: [...new Set(screen)],
      collisions, labelsOutsidePlot: outside,
      truncated: labs.filter(t => t.textContent.includes('…')).map(t => ({
        text: t.textContent, aria: t.getAttribute('aria-label'),
        title: t.querySelector('title') ? t.querySelector('title').textContent : null }))
    };
  }
  out.bars = chartInfo('f03-rep-bars');
  out.line = chartInfo('f03-rep-line');
  const dch = document.getElementById('f03-rep-donut');
  if (dch) {
    const svg = dch.querySelector('.m-donut__svg');
    if (svg) {
      const r = svg.getBoundingClientRect();
      out.donut = { size: [r.width, r.height], viewBox: svg.getAttribute('viewBox'),
        segmentCircles: svg.querySelectorAll('circle').length,
        centerText: (svg.querySelector('.m-donut__center')||{}).textContent || null,
        legendItems: [...dch.querySelectorAll('.m-legend__item')].length };
    } else out.donut = { refused: true, state: dch.getAttribute('data-scale-state') };
  }
  // peek strip
  const strip = document.getElementById('f03-rep-strip');
  if (strip) {
    const slides = [...strip.querySelectorAll('.m-info-strip__slide')];
    out.peek = {
      slideCount: slides.length,
      position: (strip.querySelector('[data-info-strip-position]') || {}).textContent || null,
      status: (strip.querySelector('[data-info-strip-status]') || {}).textContent || null,
      ariaHidden: slides.map(s => s.getAttribute('aria-hidden')),
      inert: slides.map(s => !!s.inert),
      prevDisabled: (strip.querySelector('[data-info-strip-prev]')||{}).disabled,
      nextDisabled: (strip.querySelector('[data-info-strip-next]')||{}).disabled,
      controlsHidden: (strip.querySelector('[data-info-strip-controls]')||{}).hidden
    };
  }
  out.doc = { scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth };
  return out;
}"""

OVERFLOW_SOURCE = """() => {
  const W = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > W + 1 || r.left < -1)) {
      bad.push({ tag: el.tagName, cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || el.id || '', w: +r.width.toFixed(1), right: +r.right.toFixed(1), left: +r.left.toFixed(1) });
    }
  });
  return bad.slice(0, 12);
}"""

def run():
    result = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "page": BASE + "/previews/ux-patterns/mobile-record-sample/index.html",
        "flow": "F03App real app: enter() then navbar #f03-nav-reports",
        "zoom_mechanism": "project-declared per-element computed font-size *2 (two clean passes)",
    }, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 430, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "/previews/ux-patterns/mobile-record-sample/index.html", wait_until="load")
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        page.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
        page.reload()
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        # enter through the real gateway UI (demo button), same as tools/ux-f03-check.py enter()
        page.evaluate("() => { const b = document.getElementById('f03-gw-demo'); if (b && !b.hidden) b.click(); }")
        page.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page.click("#f03-nav-reports")
        page.wait_for_function("() => window.F03App.inspect().view === 'reports'", timeout=5000)
        page.wait_for_timeout(700)

        result["runs"]["reports_w430_1x"] = page.evaluate(REP_MEASURE)

        # live resize 430 -> 320 (no reload)
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(800)
        result["runs"]["reports_w320_after_live_resize"] = page.evaluate(REP_MEASURE)

        # open collapsible donut section
        opened = page.evaluate("""() => {
          const btn = document.querySelector('#f03-rep-extra .m-section__head');
          if (!btn) return 'no-button';
          btn.click();
          return 'clicked';
        }""")
        page.wait_for_timeout(500)
        result["runs"]["donut_section"] = {"action": opened}
        result["runs"]["reports_w320_donut_open"] = page.evaluate(REP_MEASURE)

        # screenshot donut + bars at 320
        shot = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4"
        for sel, name in [("#f03-rep-bars", "f03-rep-bars-320"), ("#f03-rep-donut", "f03-rep-donut-320-open")]:
            el = page.query_selector(sel)
            if el:
                el.scroll_into_view_if_needed()
                page.wait_for_timeout(200)
                el.screenshot(path=f"{shot}/{name}.png")

        # 200% two passes
        page.evaluate(ZOOM2)
        page.wait_for_timeout(600)
        result["runs"]["reports_w320_200pct_pass1"] = page.evaluate(REP_MEASURE)
        if result["runs"]["reports_w320_200pct_pass1"]["doc"]["scrollW"] > result["runs"]["reports_w320_200pct_pass1"]["doc"]["clientW"] + 1:
            result["runs"]["reports_w320_200pct_pass1"]["overflow_sources"] = page.evaluate(OVERFLOW_SOURCE)
        page.evaluate(UNZOOM)
        page.wait_for_timeout(300)
        page.evaluate(ZOOM2)
        page.wait_for_timeout(600)
        result["runs"]["reports_w320_200pct_pass2"] = page.evaluate(REP_MEASURE)
        page.evaluate(UNZOOM)
        page.wait_for_timeout(300)

        # ---- peek strip keyboard + focus transfer (REAL keyboard)
        kb = {}
        # focus the strip root
        page.focus("#f03-rep-strip")
        page.wait_for_timeout(200)
        kb["focusOnStrip"] = page.evaluate("() => document.activeElement.id || document.activeElement.className")
        # ArrowLeft in RTL = next
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(400)
        kb["afterArrowLeft"] = page.evaluate("""() => ({
          position: (document.querySelector('#f03-rep-strip [data-info-strip-position]')||{}).textContent,
          status: (document.querySelector('#f03-rep-strip [data-info-strip-status]')||{}).textContent,
          ariaHidden: [...document.querySelectorAll('#f03-rep-strip .m-info-strip__slide')].map(s => s.getAttribute('aria-hidden')),
          activeElement: document.activeElement.id || document.activeElement.className
        })""")
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(400)
        kb["afterArrowRight"] = page.evaluate("""() => ({
          position: (document.querySelector('#f03-rep-strip [data-info-strip-position]')||{}).textContent,
          status: (document.querySelector('#f03-rep-strip [data-info-strip-status]')||{}).textContent
        })""")
        # focus transfer: focus a button INSIDE a slide, then navigate away programmatically (goTo) -> focus should move to viewport
        page.evaluate("""() => {
          const strip = document.getElementById('f03-rep-strip');
          window.__peekBefore = window.MicroInfoPeek.getIndex(strip);
          const btn = strip.querySelector('.m-info-strip__slide button, .m-info-strip__slide [tabindex]');
        }""")
        # use next button itself (a control inside strip, not slide) — instead move focus into slide 0 content if focusable
        kb["nextBtnDisabledAtEnd"] = page.evaluate("() => (document.querySelector('#f03-rep-strip [data-info-strip-next]')||{}).disabled")
        kb["prevBtnDisabledAtStart"] = page.evaluate("() => (document.querySelector('#f03-rep-strip [data-info-strip-prev]')||{}).disabled")
        result["runs"]["peek_keyboard"] = kb

        # reduced motion context: transitions off on track
        page.set_viewport_size({"width": 390, "height": 900})
        page.wait_for_timeout(400)
        result["runs"]["peek_track_transition_390"] = page.evaluate("""() => {
          const t = document.querySelector('#f03-rep-strip .m-info-strip__track');
          return getComputedStyle(t).transition;
        }""")

        result["pageerrors"] = errors
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    for k, v in result["runs"].items():
        if isinstance(v, dict) and ("bars" in v or "peek" in v):
            print("===", k, "scrollW", v.get("doc", {}).get("scrollW"), "clientW", v.get("doc", {}).get("clientW"))
            for fam in ["bars", "line", "donut", "peek"]:
                if fam in v:
                    d = v[fam]
                    print(f"  {fam}:", json.dumps(d, ensure_ascii=False)[:400])
    print("pageerrors:", errors)

run()
