#!/usr/bin/env python3
"""SUI-A2 Agent 2 — Probe B: Fields (B02) component-level.

Pages: previews/fields/index.html (panel, states showcase) and
previews/fields/example-usage.html (behavior contract, independent).
Server: tools/preview-server.py on 127.0.0.1:5000 (unmodified).

 B1. Control height 52px, input font 16px, unit chip at inline-end (RTL=left),
     stepper buttons 48px, qty input min-width 64px.
 B2. Text 200% (declared two-pass computed font-size x2, scoped to the
     phone-demo block) inside is-320: qty value "9999" readability
     (scrollWidth vs clientWidth), big amount "12,456,789.50" + unit د.أ,
     counter 12/40, label wrap, touch sizes unchanged.
 B3. Clear button: visibility with text, click clears + refocuses input +
     fires input event; REAL keyboard: Tab to clear, Enter → cleared +
     focus returned.
 B4. Counter sync contract: programmatic value + MicroFields.sync →
     counter updates; no input event fired by sync.
 B5. Stepper: step/min/max honored (10→15, max 99 clamp, min 0 clamp);
     REAL keyboard Enter on step button; readonly guard (no change).
 B6. aria-describedby: auto-linked msg id; prior ref preserved.
 B7. Readonly: user-select text, color, cursor; value stays on error field.
 B8. 430→320 viewport change without reload — no control-row overflow.
 B9. Placeholder/hint colors computed (contrast math done in report).
Metadata: commit a5500c9 (tree 05f344b), Chromium /home/z/my-project/evidence/bin/chromium.
"""
import json, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
PANEL = BASE + "/previews/fields/"
USAGE = BASE + "/previews/fields/example-usage.html"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent2/probe-b-fields.json"

def g(page, js, arg=None):
    return page.evaluate(js, arg) if arg is not None else page.evaluate(js)

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "browser": "Chromium via /home/z/my-project/evidence/bin/chromium (Playwright)",
        "textZoom": "declared two-pass computed font-size x2 scoped to .phone-demo.is-320 (NOT native zoom)",
        "pages": [PANEL, USAGE]}}

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")

        # ---------- B1: geometry inside the panel's fixed-width phone demos ----------
        page = browser.new_page(viewport={"width": 1280, "height": 1000})
        page.goto(PANEL, wait_until="networkidle")
        b1 = {}
        for w, block in [(320, ".phone-demo.is-320"), (390, ".phone-demo.is-390"), (430, ".phone-demo.is-430")]:
            b1[w] = g(page, """(block) => {
              const root = document.querySelector(block);
              const out = {};
              const amount = root.querySelector('.m-field__input--num');
              out.inputFont = getComputedStyle(amount).fontSize;
              out.inputW = Math.round(amount.getBoundingClientRect().width*10)/10;
              const control = amount.closest('.m-field__control');
              out.controlH = Math.round(control.getBoundingClientRect().height*10)/10;
              const unit = control.querySelector('.m-field__unit');
              if (unit) {
                const ur = unit.getBoundingClientRect(); const cr = control.getBoundingClientRect();
                // RTL: inline-end = left side of the row
                out.unitAtInlineEnd = (ur.x - cr.x) < 20;
                out.unitFont = getComputedStyle(unit).fontSize;
                out.unitText = unit.textContent;
              } else { out.unitAtInlineEnd = null; }
              const steps = control.querySelectorAll('.m-field__stepper .m-btn');
              out.stepBtns = [].slice.call(steps).map(b => Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height));
              if (root.querySelector('.m-field__count')) {
                const cnt = root.querySelector('.m-field__count');
                out.countDir = getComputedStyle(cnt).direction;
              }
              out.blockW = Math.round(root.getBoundingClientRect().width);
              return out;
            }""", block)
        # qty input min width on 320 block (p-qty-320)
        b1["qtyInputComputedW_320"] = g(page, "() => { const i = document.getElementById('p-qty-320'); return { computedW: getComputedStyle(i).width, offsetW: i.offsetWidth, cs: getComputedStyle(i).fontVariantNumeric }; }")
        results["B1_geometry"] = b1

        # ---------- B2: 200% text inside is-320 ----------
        zoom_scope = """(blockSel) => {
          const root = document.querySelector(blockSel);
          const all = root.querySelectorAll('*');
          const sizes = [];
          all.forEach(el => sizes.push([el, parseFloat(getComputedStyle(el).fontSize)]));
          sizes.forEach(([el, before]) => { el.style.fontSize = (before * 2) + 'px'; });
          return sizes.length;
        }"""
        # set big values first (readable-before check as well)
        g(page, "() => { document.getElementById('p-qty-320').value = '9999';"
                "  document.getElementById('p-amount-320').value = '12,456,789.50'; }")
        before_qty = g(page, "() => { const i = document.getElementById('p-qty-320');"
                             " return { clientW: i.clientWidth, scrollW: i.scrollW !== undefined ? i.scrollWidth : null, font: getComputedStyle(i).fontSize }; }")
        before_amount = g(page, "() => { const i = document.getElementById('p-amount-320');"
                             " return { clientW: i.clientWidth, scrollW: i.scrollWidth, font: getComputedStyle(i).fontSize }; }")
        n = g(page, zoom_scope, ".phone-demo.is-320")
        time.sleep(0.1)
        after = g(page, """() => {
          const q = document.getElementById('p-qty-320');
          const a = document.getElementById('p-amount-320');
          const err = document.getElementById('p-err-320');
          const qf = q.closest('.m-field');
          const af = a.closest('.m-field');
          const ef = err.closest('.m-field');
          const stepBtn = q.closest('.m-field__control').querySelector('.m-field__stepper .m-btn');
          const unit = q.closest('.m-field__control').querySelector('.m-field__unit');
          return {
            qty: { clientW: q.clientWidth, scrollW: q.scrollWidth, clipped: q.scrollWidth > q.clientWidth + 1, font: getComputedStyle(q).fontSize },
            qtyFieldH: Math.round(qf.getBoundingClientRect().height*10)/10,
            amount: { clientW: a.clientWidth, scrollW: a.scrollWidth, clipped: a.scrollWidth > a.clientWidth + 1, font: getComputedStyle(a).fontSize },
            amountFieldH: Math.round(af.getBoundingClientRect().height*10)/10,
            unitFont: getComputedStyle(unit).fontSize,
            stepBtnSize: Math.round(stepBtn.getBoundingClientRect().width) + 'x' + Math.round(stepBtn.getBoundingClientRect().height),
            controlRowOverflow: (() => { const c = q.closest('.m-field__control'); return c.scrollWidth > c.clientWidth + 1; })(),
            errFont: getComputedStyle(err).fontSize,
            errFieldH: Math.round(ef.getBoundingClientRect().height*10)/10,
            labelFont: getComputedStyle(qf.querySelector('.m-field__label')).fontSize,
            blockW: Math.round(document.querySelector('.phone-demo.is-320').getBoundingClientRect().width)
          };
        }""")
        results["B2_text200_in_320"] = {"elementsScaled": n,
            "qtyBefore": before_qty, "amountBefore": before_amount, "after": after}
        page.close()

        # ---------- B3: clear button behavior + real keyboard ----------
        page = browser.new_page(viewport={"width": 360, "height": 900})
        page.goto(PANEL, wait_until="networkidle")
        events = []
        page.evaluate("window.__evts = []; document.getElementById('t-search').addEventListener('input', () => window.__evts.push('input'));")
        page.fill("#t-search", "مؤسسة النور")
        time.sleep(0.05)
        vis = g(page, "() => { const c = document.getElementById('search-clear');"
                      " const cs = getComputedStyle(c); const r = c.getBoundingClientRect();"
                      " return { display: cs.display, w: Math.round(r.width), h: Math.round(r.height), aria: c.getAttribute('aria-label') }; }")
        # REAL keyboard: Tab from input to clear button, Enter
        page.focus("#t-search")
        page.keyboard.press("Tab"); time.sleep(0.05)
        focused_clear = g(page, "() => document.activeElement.id")
        page.keyboard.press("Enter"); time.sleep(0.1)
        after_kb = g(page, "() => ({ value: document.getElementById('t-search').value,"
                           " focused: document.activeElement.id, evts: window.__evts.slice() })")
        # mouse click path with refilled value
        page.fill("#t-search", "النور"); time.sleep(0.05)
        page.click("#search-clear"); time.sleep(0.1)
        after_mouse = g(page, "() => ({ value: document.getElementById('t-search').value,"
                              " focused: document.activeElement.id, evts: window.__evts.slice(),"
                              " clearVisible: getComputedStyle(document.getElementById('search-clear')).display })")
        results["B3_clear"] = {"visibility": vis, "tabFocusOnClear": focused_clear,
                               "afterKeyboardEnter": after_kb, "afterMouseClick": after_mouse}
        page.close()

        # ---------- B4/B5/B6: behavior contracts on example-usage ----------
        page = browser.new_page(viewport={"width": 390, "height": 900})
        page.goto(USAGE, wait_until="networkidle")
        # counter initial value 'أحمد' with maxlength 40
        c0 = g(page, "() => document.querySelector('[for=\"u-1\"]') && document.querySelectorAll('.m-field__count')[0].textContent")
        # programmatic set + sync (UI-05/UI-06)
        page.evaluate("window.__evts2 = []; const i = document.getElementById('u-1');"
                      "i.addEventListener('input', () => window.__evts2.push('input'));"
                      "i.value = 'اسم مستفيد أطول بكثير لقياس العدّاد';"
                      "window.MicroFields.sync(document);")
        c1 = g(page, "() => ({ count: document.querySelectorAll('.m-field__count')[0].textContent,"
                     " evts: window.__evts2, ariaHidden: document.querySelectorAll('.m-field__count')[0].getAttribute('aria-hidden') })")
        # aria-describedby merge (u-2 has prior-help)
        desc = g(page, "() => ({ u2: document.getElementById('u-2').getAttribute('aria-describedby'),"
                      " u1: document.getElementById('u-1').getAttribute('aria-describedby'),"
                      " priorHelpExists: !!document.getElementById('prior-help') })")
        # readonly stepper guard: click up on u-3 (readonly, value 10)
        page.click("text=زيادة") if False else page.evaluate("() => { const b = document.querySelectorAll('[data-step=\"up\"]')[0]; b.click(); }")
        ro = g(page, "() => document.getElementById('u-3').value")
        results["B4_counter_sync_contract"] = {"initial": c0, "afterProgrammaticSetAndSync": c1}
        results["B6_aria_describedby"] = {"fields": desc, "readonlyStepperValueAfterClick": ro}
        page.close()

        # ---------- B5: stepper live (panel live section, real keyboard) ----------
        page = browser.new_page(viewport={"width": 360, "height": 900})
        page.goto(PANEL, wait_until="networkidle")
        # live-qty: value 10 step 5 min 0 max 99
        page.evaluate("() => { document.getElementById('live-qty').value = '10'; }")
        up_btn = page.evaluate("() => { const f = document.getElementById('live-qty').closest('.m-field');"
                               " return f.querySelector('[data-step=\"up\"]') ? 'found' : 'missing'; }")
        page.click("#live-qty")  # focus (no change)
        page.evaluate("() => { const f = document.getElementById('live-qty').closest('.m-field');"
                      " f.querySelector('[data-step=\"up\"]').focus(); }")
        page.keyboard.press("Enter"); time.sleep(0.1)
        v_after_enter = g(page, "() => document.getElementById('live-qty').value")
        # clamp at max
        page.evaluate("() => { document.getElementById('live-qty').value = '99'; }")
        page.evaluate("() => { const f = document.getElementById('live-qty').closest('.m-field');"
                      " f.querySelector('[data-step=\"up\"]').focus(); }")
        page.keyboard.press("Enter"); time.sleep(0.1)
        v_max = g(page, "() => document.getElementById('live-qty').value")
        # clamp at min
        page.evaluate("() => { document.getElementById('live-qty').value = '0'; }")
        page.evaluate("() => { const f = document.getElementById('live-qty').closest('.m-field');"
                      " f.querySelector('[data-step=\"down\"]').focus(); }")
        page.keyboard.press("Enter"); time.sleep(0.1)
        v_min = g(page, "() => document.getElementById('live-qty').value")
        results["B5_stepper"] = {"upBtn": up_btn, "value10_plus5_viaKeyboardEnter": v_after_enter,
                                 "value99_up_clamped": v_max, "value0_down_clamped": v_min}
        page.close()

        # ---------- B7: readonly + disabled + placeholder colors ----------
        page = browser.new_page(viewport={"width": 390, "height": 900})
        page.goto(PANEL, wait_until="networkidle")
        ro_dis = g(page, """() => {
          const ro = document.getElementById('s-readonly');
          const rof = ro.closest('.m-field');
          const dis = document.getElementById('s-disabled');
          const disf = dis.closest('.m-field');
          const ph = document.getElementById('t-name');
          return {
            readonly: { color: getComputedStyle(ro).color, userSelect: getComputedStyle(ro).userSelect,
                        cursor: getComputedStyle(ro).cursor, controlBg: getComputedStyle(rof.querySelector('.m-field__control')).backgroundColor,
                        canSelect: getComputedStyle(ro).userSelect !== 'none' },
            disabled: { color: getComputedStyle(dis).color, inputDisabled: dis.disabled,
                        controlBg: getComputedStyle(disf.querySelector('.m-field__control')).backgroundColor },
            placeholder: { color: getComputedStyle(ph, '::placeholder').color, hintToken: getComputedStyle(document.documentElement).getPropertyValue('--micro-text-hint').trim() },
            errorValue: document.getElementById('s-error').value,
            errorMsgLinked: document.getElementById('s-error').getAttribute('aria-describedby')
          };
        }""")
        results["B7_readonly_disabled_placeholder"] = ro_dis
        page.close()

        # ---------- B8: 430 -> 320 without reload ----------
        page = browser.new_page(viewport={"width": 430, "height": 900})
        page.goto(PANEL, wait_until="networkidle")
        # use the live amount field (max-width 360) as the measured control row
        m430 = g(page, "() => { const c = document.getElementById('live-amount').closest('.m-field__control');"
                      " const r = c.getBoundingClientRect(); return { w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10,"
                      " overflow: c.scrollWidth > c.clientWidth + 1 }; }")
        page.set_viewport_size({"width": 320, "height": 900})
        time.sleep(0.15)
        m320 = g(page, "() => { const c = document.getElementById('live-amount').closest('.m-field__control');"
                      " const r = c.getBoundingClientRect(); return { w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10,"
                      " overflow: c.scrollWidth > c.clientWidth + 1 }; }")
        results["B8_viewport_430_to_320_noreload"] = {"at430": m430, "at320": m320}
        page.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)

if __name__ == "__main__":
    main()
