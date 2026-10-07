#!/usr/bin/env python3
"""SUI-A5 Agent 5 — independent verification probe 2: I1 (Agent 2).

Claim under test: `.m-switch input:checked ~ .m-switch__text .m-switch__state`
(selection.css:208-210) never matches in the selection family pages because
`.m-switch__text` PRECEDES the input in DOM; state text stays hint-gray in both
ON and OFF while the track does change color (rule at :192 uses adjacent `+`).

My own checks on: previews/selection panel, ux-patterns/switch-lifecycle,
components/account-settings/example-usage.html (claimed reverse order).
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
PANEL = BASE + "/previews/selection/"
SWITCH_LIFECYCLE = BASE + "/previews/ux-patterns/switch-lifecycle/"
ACCOUNT = BASE + "/components/account-settings/example-usage.html"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe2-i1-switch.json"

SWITCH_STATE = r"""(jsEl) => {
  const sw = eval(jsEl);
  if (!sw) return { found: false };
  const input = sw.querySelector('input');
  const text = sw.querySelector('.m-switch__text');
  const track = sw.querySelector('.m-switch__track');
  const state = sw.querySelector('.m-switch__state');
  const kids = [...sw.children].map(c => (c.className && String(c.className)) || c.tagName);
  return {
    found: true,
    childOrder: kids,
    textBeforeInput: !!(text && input && (input.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_PRECEDING)),
    checked: input.checked,
    selectorHits: !!sw.querySelector('input:checked ~ .m-switch__text .m-switch__state'),
    stateColor: state ? getComputedStyle(state).color : null,
    stateText: state ? state.textContent.trim() : null,
    trackBg: track ? getComputedStyle(track).backgroundColor : null,
    tokenHint: getComputedStyle(document.documentElement).getPropertyValue('--micro-text-hint').trim(),
    tokenPrimary: getComputedStyle(document.documentElement).getPropertyValue('--micro-brand-primary').trim(),
  };
}"""

def snap(page, js_el):
    return page.evaluate(SWITCH_STATE, js_el)

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b05ef12284abfc31ad9a1c8633dcd6a058",
        "browser": "Chrome for Testing 143.0.7499.4 (Playwright sync)",
        "claim": "dead rule selection.css:208-210; state text hint-gray both states; track changes",
    }}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)

        page = browser.new_page(viewport={"width": 360, "height": 900})
        page.goto(PANEL, wait_until="networkidle")
        js_el = page.evaluate("""() => {
          const switches = [...document.querySelectorAll('.m-switch')];
          const i = switches.findIndex(s => { const inp = s.querySelector('input'); return inp && !inp.disabled && !inp.readOnly; });
          return 'document.querySelectorAll(".m-switch")[' + (i < 0 ? 0 : i) + ']';
        }""")
        off = snap(page, js_el)
        page.evaluate(f"() => {{ const sw = {js_el}; sw.querySelector('input').click(); }}")
        page.wait_for_timeout(200)
        on = snap(page, js_el)
        results["selection_panel"] = {"element": js_el, "off": off, "on": on}
        page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe2-i1-switch-panel-on-gray-state.png")

        page2 = browser.new_page(viewport={"width": 360, "height": 900})
        page2.goto(SWITCH_LIFECYCLE, wait_until="networkidle")
        lc_off = snap(page2, 'document.querySelector(".m-switch")')
        page2.evaluate("() => { const i = document.querySelector('.m-switch input'); if (i) i.click(); }")
        page2.wait_for_timeout(200)
        lc_on = snap(page2, 'document.querySelector(".m-switch")')
        results["switch_lifecycle"] = {"off": lc_off, "on": lc_on}

        page3 = browser.new_page(viewport={"width": 360, "height": 900})
        page3.goto(ACCOUNT, wait_until="networkidle")
        ac = snap(page3, 'document.querySelector(".m-switch")')
        ac_on = None
        if ac and ac.get("found"):
            page3.evaluate("() => { const i = document.querySelector('.m-switch input'); if (i) i.click(); }")
            page3.wait_for_timeout(200)
            ac_on = snap(page3, 'document.querySelector(".m-switch")')
        results["account_settings_example"] = {"off": ac, "on": ac_on}
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)
    for k in ("selection_panel", "switch_lifecycle", "account_settings_example"):
        r = results[k]
        print(k, "| OFF color:", (r["off"] or {}).get("stateColor"), "track:", (r["off"] or {}).get("trackBg"))
        print(k, "| ON  color:", (r["on"] or {}).get("stateColor"), "track:", (r["on"] or {}).get("trackBg"),
              "selectorHits:", (r["on"] or {}).get("selectorHits"), "textBeforeInput:", (r["on"] or {}).get("textBeforeInput"))
        print(k, "| childOrder:", (r["on"] or r["off"] or {}).get("childOrder"))

if __name__ == "__main__":
    main()
