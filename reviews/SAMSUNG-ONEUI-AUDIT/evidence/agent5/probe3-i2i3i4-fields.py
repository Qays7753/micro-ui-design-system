#!/usr/bin/env python3
"""SUI-A5 Agent 5 — independent verification probe 3: I2 / I3 / I4 (Agent 2).

Claims under test (falsification attempt):
 I2: --micro-quantity-min-width (64px, tokens.css:107) is inert in BOTH official
     compositions:
     (a) previews/fields panel + spec §2 documented composition: two separate
         .m-field__stepper wrappers, input BETWEEN them -> selector
         `.m-field__stepper .m-field__input--num` (fields.css:145) matches nothing;
     (b) example-usage.html: control itself carries .m-field__stepper so the
         selector matches, but .m-field__input flex:1 (basis 0%) + min-width:0
         (fields.css:57-58) cancel the width.
     Consequence at declared 200% text in the 320 phone-demo: qty input ~62px
     (< 64 token) and "9999" clipped (scrollWidth 77 > clientWidth 62).
 I3: 12-digit amount clipped at 200%/320 (scrollWidth 218 > clientWidth 202 for
     12,456,789.50); values <=10 digits fit.
 I4: raw step buttons (no m-btn class) in previews/fields/example-usage.html
     u-3 measure ~23.8x21px (B01 contract: 48px icon buttons).

My own data (different from agent 2 where possible):
 - qty value "1234" AND "9999"; amount "8,765,432,109.5" (15 glyphs) AND
   "9,999,999.99" (10 glyphs, expected to fit).
"""
import json, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
PANEL = BASE + "/previews/fields/"
USAGE = BASE + "/previews/fields/example-usage.html"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe3-i2i3i4-fields.json"

TWO_PASS_320 = """() => {
  const root = document.querySelector('.phone-demo.is-320');
  const all = root.querySelectorAll('*');
  const orig = [...all].map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  let n = 0;
  orig.forEach((it) => { if (it.fs > 0) { it.el.style.fontSize = (it.fs * 2) + 'px'; n++; } });
  return n;
}"""

QTY_MEASURE = """() => {
  const q = document.getElementById('p-qty-320');
  const a = document.getElementById('p-amount-320');
  const cs = getComputedStyle(q);
  return {
    qty: { value: q.value, clientW: q.clientWidth, scrollW: q.scrollWidth,
           clipped: q.scrollWidth > q.clientWidth + 1, font: cs.fontSize,
           computedWidth: cs.width, flexBasis: cs.flexBasis, flexGrow: cs.flexGrow, minWidth: cs.minWidth,
           selectorMatchesStepper: !!q.closest('.m-field__stepper') },
    amount: { value: a.value, clientW: a.clientWidth, scrollW: a.scrollWidth, clipped: a.scrollWidth > a.clientWidth + 1, font: getComputedStyle(a).fontSize },
    qtyToken: getComputedStyle(document.documentElement).getPropertyValue('--micro-quantity-min-width').trim(),
  };
}"""

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b05ef12284abfc31ad9a1c8633dcd6a058",
        "browser": "Chrome for Testing 143.0.7499.4 (Playwright sync)",
        "textZoom200": "DECLARED clean two-pass computed font-size x2 scoped to .phone-demo.is-320 (collect-then-apply, library ZOOM2_CLEAN style) — NOT native zoom",
        "myData": {"qty": ["1234", "9999"], "amountLong": "8,765,432,109.5", "amount10": "9,999,999.99"},
    }}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)

        # ---------- I2(a) + I3: panel ----------
        page = browser.new_page(viewport={"width": 1280, "height": 1000})
        page.goto(PANEL, wait_until="networkidle")
        results["panel_1x"] = {}
        for val in ("1234", "9999"):
            page.evaluate(f"() => {{ document.getElementById('p-qty-320').value = '{val}'; }}")
            results["panel_1x"][f"qty_{val}"] = page.evaluate(QTY_MEASURE)
        page.evaluate("() => { document.getElementById('p-amount-320').value = '8,765,432,109.5'; }")
        results["panel_1x"]["amount_long"] = page.evaluate(QTY_MEASURE)
        n = page.evaluate(TWO_PASS_320)
        time.sleep(0.2)
        results["panel_2x"] = {"elementsDoubled": n}
        for val in ("1234", "9999"):
            page.evaluate(f"() => {{ document.getElementById('p-qty-320').value = '{val}'; }}")
            results["panel_2x"][f"qty_{val}"] = page.evaluate(QTY_MEASURE)
        for label, val in (("amount_long", "8,765,432,109.5"), ("amount_10glyph", "9,999,999.99")):
            page.evaluate(f"() => {{ document.getElementById('p-amount-320').value = '{val}'; }}")
            results["panel_2x"][label] = page.evaluate(QTY_MEASURE)
        page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe3-i2-qty-9999-320-text200.png")
        page.close()

        # ---------- I2(b): example-usage composition (selector matches, flex kills width) ----------
        page2 = browser.new_page(viewport={"width": 420, "height": 900})
        page2.goto(USAGE, wait_until="networkidle")
        results["usage_1x"] = page2.evaluate("""() => {
          const q = document.getElementById('u-3');
          const cs = getComputedStyle(q);
          const control = q.closest('.m-field__control');
          return {
            controlClass: control.className,
            selectorMatchesStepper: !!q.closest('.m-field__stepper'),
            computedWidth: cs.width, flexBasis: cs.flexBasis, flexGrow: cs.flexGrow, flexShrink: cs.flexShrink, minWidth: cs.minWidth,
            qtyToken: getComputedStyle(document.documentElement).getPropertyValue('--micro-quantity-min-width').trim(),
            rectW: Math.round(q.getBoundingClientRect().width * 10) / 10,
          };
        }""")
        # ---------- I4: raw step buttons ----------
        results["usage_i4_rawStepButtons"] = page2.evaluate("""() => {
          const fields = document.querySelectorAll('[data-micro-field]');
          const f3 = fields[2];
          const btns = [...f3.querySelectorAll('[data-step]')];
          const clearBtn = document.querySelector('.m-field__clear');
          return {
            buttons: btns.map(b => {
              const r = b.getBoundingClientRect();
              return { text: b.textContent.trim(), className: b.className || '(no class)',
                       w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10,
                       ariaLabel: b.getAttribute('aria-label') };
            }),
            reference_B01_icon_button_clear: clearBtn ? {
              w: Math.round(clearBtn.getBoundingClientRect().width), h: Math.round(clearBtn.getBoundingClientRect().height),
              className: clearBtn.className } : null,
            u3_inputRectW: Math.round(document.getElementById('u-3').getBoundingClientRect().width * 10) / 10,
          };
        }""")
        page2.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)
    print(json.dumps({
        "panel_1x_qty9999": results["panel_1x"]["qty_9999"]["qty"],
        "panel_2x_qty1234": results["panel_2x"]["qty_1234"]["qty"],
        "panel_2x_qty9999": results["panel_2x"]["qty_9999"]["qty"],
        "panel_2x_amountLong": results["panel_2x"]["amount_long"]["amount"],
        "panel_2x_amount10": results["panel_2x"]["amount_10glyph"]["amount"],
        "usage_1x": results["usage_1x"],
        "i4": results["usage_i4_rawStepButtons"],
    }, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
