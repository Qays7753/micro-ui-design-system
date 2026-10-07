#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-G: isolated component harness (evidence dir, not source):
- m-stat long number at 320 + 200% (project-declared per-element doubling):
  does the number overflow its container? (data board showed scrollW 428)
- bubbles: diameter sqrt-proportionality + zero/unknown states
Output: probe-g-mstat-bubbles.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
HARNESS = BASE + "/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/harness-m-stat-bubbles.html"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-g-mstat-bubbles.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

ZOOM2 = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""
UNZOOM = """() => { document.querySelectorAll('[data-r2-z],[data-r2z]').forEach((el) => { el.style.fontSize = ''; delete el.dataset.r2z; }); return true; }"""

MEASURE = """() => {
  function statInfo(id) {
    const s = document.getElementById(id);
    const num = s.querySelector('.m-stat__num');
    const value = s.querySelector('.m-stat__value');
    const box = s.closest('.box');
    const nb = num.getBoundingClientRect(), vb = value.getBoundingClientRect(), bb = box.getBoundingClientRect();
    return {
      numText: num.textContent,
      numW: +nb.width.toFixed(1), numRight: +nb.right.toFixed(1), numLeft: +nb.left.toFixed(1),
      valueW: +vb.width.toFixed(1), valueH: +vb.height.toFixed(1),
      boxW: +bb.width.toFixed(1), boxRight: +bb.right.toFixed(1), boxLeft: +bb.left.toFixed(1),
      numOverflowsBox: nb.right > bb.right + 0.5 || nb.left < bb.left - 0.5,
      valueOverflowsBox: vb.right > bb.right + 0.5 || vb.left < bb.left - 0.5,
      numFontPx: getComputedStyle(num).fontSize,
      numOverflowWrap: getComputedStyle(num).overflowWrap,
      wraps: vb.height > parseFloat(getComputedStyle(num).lineHeight) * 2.4
    };
  }
  return { stat1: statInfo('stat1'), stat2: statInfo('stat2'),
    doc: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth } };
}"""

BUBBLES = """() => {
  const ch = document.querySelector('[data-chart="bubbles"]');
  return [...ch.querySelectorAll('.m-bubble')].map(b => {
    const c = b.querySelector('[class*="m-bubble__circle"]');
    return {
      series: (String(b.className).match(/m-cat--(\\w)/) || [])[1],
      circleW: +c.getBoundingClientRect().width.toFixed(2),
      none: c.className.includes('--none'),
      value: (b.querySelector('.m-bubble__value')||{}).textContent || null,
      label: (b.querySelector('.m-bubble__label')||{}).textContent || null
    };
  });
}"""

def run():
    result = {"meta": {"commit": "a5500c9", "tree": "05f344b",
        "harness": HARNESS, "zoom": "project-declared per-element doubling"}, "runs": {}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 320, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(HARNESS, wait_until="networkidle")
        page.wait_for_timeout(600)
        result["runs"]["mstat_320_1x"] = page.evaluate(MEASURE)
        result["runs"]["bubbles_320_1x"] = page.evaluate(BUBBLES)
        page.evaluate(ZOOM2); page.wait_for_timeout(500)
        result["runs"]["mstat_320_200pct"] = page.evaluate(MEASURE)
        page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/mstat-isolated-320-200pct.png", full_page=True)
        page.evaluate(UNZOOM)
        result["pageerrors"] = errors
        ctx.close(); browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("saved:", OUT)
    print("1x:", json.dumps(result["runs"]["mstat_320_1x"], ensure_ascii=False, indent=1)[:700])
    print("200%:", json.dumps(result["runs"]["mstat_320_200pct"], ensure_ascii=False, indent=1)[:700])
    print("bubbles:", json.dumps(result["runs"]["bubbles_320_1x"], ensure_ascii=False))
    print("pageerrors:", errors)

run()
