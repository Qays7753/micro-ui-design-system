#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 4 — Probe D-H (compact): metric-comparison negative paths on
previews/concepts/index.html (render via public API after attribute change):
- data-max below largest known -> user note + root diagnostics separation
- invalid layout -> refusal with readings in fallback list
- signed bar rows: zero mark + center line presence (main-metric compact)
Output: probe-h-metric-negative.json
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent4/probe-h-metric-negative.json"
CHROME = "/home/z/my-project/evidence/bin/chromium"

def run():
    result = {"meta": {"commit": "a5500c9", "tree": "05f344b",
        "page": BASE + "/previews/concepts/index.html",
        "method": "public API render() after attribute mutation (source editable, no rebuild)"}}
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        ctx = browser.new_context(viewport={"width": 360, "height": 900}, locale="ar")
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "/previews/concepts/index.html", wait_until="networkidle")
        page.wait_for_timeout(700)

        # negative: data-max below largest (64)
        r1 = page.evaluate("""() => {
          const ch = document.querySelector('[data-metric-circles]');
          ch.setAttribute('data-max', '5');
          window.MicroMetricComparison.render(ch);
          const note = ch.querySelector('[data-metric-scale]');
          return {
            userNote: note.textContent,
            scaleState: ch.getAttribute('data-scale-state'),
            scaleDetail: ch.getAttribute('data-scale-detail'),
            circlesRendered: ch.querySelectorAll('.m-metric-circles__item').length,
            fallbackRows: [...ch.querySelectorAll('.m-metric-circles__fallback-item')].map(li => li.textContent.trim())
          };
        }""")
        result["max_below_largest"] = r1

        # negative: unknown layout
        r2 = page.evaluate("""() => {
          const ch = document.querySelector('[data-metric-circles]');
          ch.setAttribute('data-max', '');
          ch.removeAttribute('data-max');
          ch.setAttribute('data-layout', 'banana');
          window.MicroMetricComparison.render(ch);
          const note = ch.querySelector('[data-metric-scale]');
          return {
            userNote: note.textContent,
            scaleState: ch.getAttribute('data-scale-state'),
            circlesRendered: ch.querySelectorAll('.m-metric-circles__item').length,
            fallbackRows: [...ch.querySelectorAll('.m-metric-circles__fallback-item')].map(li => li.textContent.trim())
          };
        }""")
        result["invalid_layout"] = r2

        # restore + main-metric compact signed/zero marks
        r3 = page.evaluate("""() => {
          const ch = document.querySelector('[data-metric-circles]');
          ch.setAttribute('data-layout', 'separated');
          window.MicroMetricComparison.render(ch);
          const mm = document.querySelector('[data-main-comparison]');
          return {
            circlesBack: ch.querySelectorAll('.m-metric-circles__item').length,
            mmState: mm.getAttribute('data-scale-state'),
            mmStatus: (mm.querySelector('[data-bar-status]')||{}).textContent || null,
            rows: [...mm.querySelectorAll('.m-main-metric__row')].map(r => ({
              label: (r.querySelector('.m-main-metric__row-label')||{}).textContent,
              value: (r.querySelector('.m-main-metric__row-value')||{}).textContent,
              trackHidden: (r.querySelector('.m-main-metric__track')||{}).hidden,
              zero: r.querySelector('.m-main-metric__track') ? r.querySelector('.m-main-metric__track').getAttribute('data-zero') : null,
              barW: r.querySelector('.m-main-metric__bar') ? r.querySelector('.m-main-metric__bar').style.getPropertyValue('--m-bar-width') : null
            })),
            hero: (mm.querySelector('.m-main-metric__number')||{}).textContent
          };
        }""")
        result["restored_and_bars"] = r3
        result["pageerrors"] = errors
        ctx.close(); browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(json.dumps(result, ensure_ascii=False, indent=1))
run()
