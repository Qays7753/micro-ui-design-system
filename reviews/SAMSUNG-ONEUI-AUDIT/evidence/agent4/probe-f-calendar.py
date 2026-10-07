#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-F: order-schedule calendar:
- month cell exact px at 320 (context for the PROPOSED 37.7px exception —
  CAL-D1 owner decision, NOT re-litigated), 360/390/430
- day panel + list rows >= 48px; nav buttons 48px; views/modes buttons 48px
- dots cap <= 3 (seed with 4+ distinct statuses on one day), counter display
- today vs selected marker distinction (box-shadow vs fill, aria-current)
- real keyboard: arrows roving on grid, Enter selects, month switch
- mystery statusKey visible in F03 schedule key (CAL-R1-02 verification —
  KNOWN-OPEN, verified on current HEAD only)
Output: probe-f-calendar.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-f-calendar.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

CELL_MEASURE = """() => {
  const grid = document.querySelector('.m-ocal__grid');
  if (!grid) return null;
  const cells = [...grid.querySelectorAll('.m-ocal__cell')];
  const rows = [...grid.querySelectorAll('.m-ocal__gridrow')];
  const sample = cells.slice(0, 8);
  return {
    cellCount: cells.length,
    cellW: [...new Set(sample.map(c => +c.getBoundingClientRect().width.toFixed(2)))],
    cellH: [...new Set(sample.map(c => +c.getBoundingClientRect().height.toFixed(2)))],
    rowH: [...new Set(rows.map(r => +r.getBoundingClientRect().height.toFixed(2)))],
    gap: getComputedStyle(grid).rowGap,
    todayCell: (function(){ const t = grid.querySelector('.m-ocal__cell--today'); if (!t) return null;
      const s = getComputedStyle(t); return { boxShadow: s.boxShadow.slice(0, 60), ariaCurrent: t.getAttribute('aria-current'), dot: !!t.querySelector('.m-ocal__daynum::after') || 'css-marker' }; })(),
    selectedCell: (function(){ const s = grid.querySelector('.m-ocal__cell--selected'); if (!s) return null;
      const cs = getComputedStyle(s); return { bg: cs.backgroundColor, color: cs.color, ariaSelected: s.getAttribute('aria-selected') }; })(),
    countBadges: [...grid.querySelectorAll('.m-ocal__count')].slice(0, 5).map(c => ({ text: c.textContent, w: +c.getBoundingClientRect().width.toFixed(1), h: +c.getBoundingClientRect().height.toFixed(1) })),
    dotsPerCell: [...grid.querySelectorAll('.m-ocal__dots')].slice(0, 6).map(d => d.querySelectorAll('.m-ocal__dot').length),
    legend: [...document.querySelectorAll('.m-ocal__legend-item')].map(li => li.textContent.trim()),
    navBtns: [...document.querySelectorAll('.m-ocal__navbtn')].map(b => { const r = b.getBoundingClientRect(); return [+r.width.toFixed(1), +r.height.toFixed(1)]; }),
    todayBtn: (function(){ const b = document.querySelector('.m-ocal__todaybtn'); if (!b) return null; const r = b.getBoundingClientRect(); return [+r.width.toFixed(1), +r.height.toFixed(1)]; })(),
    viewsBtns: [...document.querySelectorAll('.m-ocal__views-btn')].map(b => { const r = b.getBoundingClientRect(); return [+r.width.toFixed(1), +r.height.toFixed(1)]; }),
    dayRows: [...document.querySelectorAll('.m-ocal__row')].slice(0, 4).map(r => { const b = r.getBoundingClientRect(); return [+b.width.toFixed(1), +b.height.toFixed(1)]; }),
    doc: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }
  };
}"""

def run():
    result = {"meta": {"commit": "a5500c9", "tree": "05f344b",
        "pages": ["components/order-schedule/example-usage.html (independent)",
                  "previews/ux-patterns/order-schedule/index.html (sample)",
                  "previews/ux-patterns/mobile-record-sample/index.html (F03 schedule)"],
        "note": "month-cell size numbers are CONTEXT for the PROPOSED 37.7px exception (CAL-D1 owner decision) — not a new finding"}, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)

        # ---------- independent component example
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append("ex:" + str(e)))
        page.goto(BASE + "/components/order-schedule/example-usage.html", wait_until="networkidle")
        page.wait_for_timeout(700)
        result["runs"]["example_320"] = page.evaluate(CELL_MEASURE)
        for w in (360, 390, 430):
            page.set_viewport_size({"width": w, "height": 900})
            page.wait_for_timeout(600)
            m = page.evaluate(CELL_MEASURE)
            result["runs"][f"example_{w}"] = {k: m[k] for k in ["cellW", "cellH", "rowH", "doc"]}

        # dots cap: inject 4 distinct statuses on one day via instance API
        cap = page.evaluate("""() => {
          const root = document.querySelector('.m-ocal') || document.querySelector('[data-ocal-root]') || document.querySelector('.m-ocal').parentElement;
          const inst = window.MicroOrderSchedule.getInstance ? window.MicroOrderSchedule.getInstance(root) : null;
          return !!inst;
        }""")
        result["runs"]["example_instance_api"] = {"hasInstance": cap}
        # keyboard roving on the grid (real keys)
        page.set_viewport_size({"width": 320, "height": 900})
        page.wait_for_timeout(400)
        kb = {}
        page.evaluate("""() => { const c = document.querySelector('.m-ocal__cell[data-ocal-date]'); if (c) c.focus(); }""")
        kb["focusStart"] = page.evaluate("() => document.activeElement.getAttribute('data-ocal-date') || document.activeElement.className")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(200)
        kb["afterArrowLeft"] = page.evaluate("() => document.activeElement.getAttribute('data-ocal-date')")
        page.keyboard.press("ArrowDown")
        page.wait_for_timeout(200)
        kb["afterArrowDown"] = page.evaluate("() => document.activeElement.getAttribute('data-ocal-date')")
        page.keyboard.press("Enter")
        page.wait_for_timeout(300)
        kb["afterEnter"] = page.evaluate("""() => {
          const s = document.querySelector('.m-ocal__cell--selected');
          return { selectedDate: s ? s.getAttribute('data-ocal-date') : null,
                   focusDate: (document.activeElement.getAttribute('data-ocal-date') || null) };
        }""")
        result["runs"]["example_keyboard"] = kb
        # screenshot month at 320
        elg = page.query_selector(".m-ocal")
        if elg:
            elg.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            elg.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/ocal-month-320.png")
        ctx.close()

        # ---------- ux-patterns sample (mystery in seed)
        ctx2 = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page2 = ctx2.new_page()
        page2.on("pageerror", lambda e: errors.append("sample:" + str(e)))
        page2.goto(BASE + "/previews/ux-patterns/order-schedule/index.html", wait_until="networkidle")
        page2.wait_for_timeout(800)
        result["runs"]["sample_320"] = page.evaluate if False else page2.evaluate(CELL_MEASURE)
        # dots cap test: day 15 oct has mystery + others
        result["runs"]["sample_320"]["dotsOnOct15"] = page2.evaluate("""() => {
          const c = document.querySelector('.m-ocal__cell[data-ocal-date="2026-10-15"]');
          if (!c) return 'no-cell';
          return { count: c.querySelector('.m-ocal__count') ? c.querySelector('.m-ocal__count').textContent : null,
                   dots: c.querySelectorAll('.m-ocal__dot').length,
                   dotTones: [...c.querySelectorAll('.m-ocal__dot')].map(d => d.className),
                   ariaLabel: c.getAttribute('aria-label') };
        }""")
        # mystery in legend (CAL-R1-02 runtime verification)
        result["runs"]["sample_legend_mystery"] = page2.evaluate("() => [...document.querySelectorAll('.m-ocal__legend-item')].map(li => li.textContent.trim())")
        page2.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/ocal-sample-320.png", full_page=False)
        ctx2.close()

        # ---------- F03 schedule view — mystery visible (CAL-R1-02 known-open verify)
        ctx3 = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page3 = ctx3.new_page()
        page3.on("pageerror", lambda e: errors.append("f03:" + str(e)))
        page3.goto(BASE + "/previews/ux-patterns/mobile-record-sample/index.html", wait_until="load")
        page3.wait_for_function("() => !!window.F03App", timeout=10000)
        page3.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
        page3.reload()
        page3.wait_for_function("() => !!window.F03App", timeout=10000)
        page3.evaluate("() => { const b = document.getElementById('f03-gw-demo'); if (b && !b.hidden) b.click(); }")
        page3.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page3.click("#f03-home-schedule")
        page3.wait_for_function("() => window.F03App.inspect().view === 'schedule'", timeout=5000)
        page3.wait_for_timeout(800)
        result["runs"]["f03_schedule_legend"] = page3.evaluate("() => [...document.querySelectorAll('.m-ocal__legend-item')].map(li => li.textContent.trim())")
        result["runs"]["f03_schedule_320"] = {k: v for k, v in page3.evaluate(CELL_MEASURE).items() if k in ["cellW", "cellH", "rowH", "navBtns", "todayBtn", "viewsBtns", "dayRows", "doc"]}
        ctx3.close()

        result["pageerrors"] = errors
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    for k in ["example_320", "example_360", "example_390", "example_430"]:
        m = result["runs"][k]
        print(k, "cellW:", m["cellW"], "cellH:", m.get("cellH"), "rowH:", m.get("rowH"), "doc:", m.get("doc"))
    m = result["runs"]["example_320"]
    print("today:", m["todayCell"], "\nselected:", m["selectedCell"])
    print("count badges:", m["countBadges"][:3], "dots:", m["dotsPerCell"])
    print("navBtns:", m["navBtns"], "todayBtn:", m["todayBtn"], "views:", m["viewsBtns"], "dayRows:", m["dayRows"])
    print("keyboard:", json.dumps(result["runs"]["example_keyboard"], ensure_ascii=False))
    print("sample dots oct15:", json.dumps(result["runs"]["sample_320"]["dotsOnOct15"], ensure_ascii=False))
    print("sample legend (mystery?):", result["runs"]["sample_legend_mystery"])
    print("f03 legend:", result["runs"]["f03_schedule_legend"])
    print("f03 320:", result["runs"]["f03_schedule_320"])
    print("pageerrors:", errors)

run()
