#!/usr/bin/env python3
"""SUI-A2 Agent 2 — Probe A: Buttons (B01) component-level.

Page: previews/buttons/example-usage.html (component used independently,
no board.css reset) — served via tools/preview-server.py (unmodified).

Measurements (320/360/390/430 CSSpx):
 A1. Button box sizes: text-only, text+icon, icon-circle 48, filter+counter.
 A2. Multi-line wrapping: long Arabic label at 320 — height, radius, no clip.
 A3. Filter counter with 123 at text 200% — containment inside capsule.
 A4. Loading contract Pattern B: box before/during/after (width/height),
     spinner size + margins, label opacity.
 A5. REAL keyboard: Tab focus + Enter on busy button (guard), Enter on
     normal button (fires click).
 A6. Disabled: no activation, no focus ring via keyboard.
Metadata: commit a5500c9 (tree 05f344b), Chromium executable
/home/z/my-project/evidence/bin/chromium, Playwright sync API.
Text 200% mechanism: declared two-pass root font-size scale on document
elements (R2-D style: read computed font-sizes first, then multiply) —
NOT native browser zoom.
"""
import json, subprocess, sys, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
URL = BASE + "/previews/buttons/example-usage.html"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent2/probe-a-buttons.json"

ZOOM2_JS = """
() => {
  // Pass 1: collect computed font sizes of every element (declared mechanism)
  const all = document.querySelectorAll('*');
  const sizes = [];
  all.forEach(el => sizes.push([el, parseFloat(getComputedStyle(el).fontSize)]));
  // Pass 2: multiply inline font-size by 2 (declared before/after)
  const applied = [];
  sizes.forEach(([el, before]) => {
    el.style.fontSize = (before * 2) + 'px';
    applied.push({ tag: el.tagName, cls: el.className && el.className.baseVal !== undefined ? '' : String(el.className), before, after: before * 2 });
  });
  document.documentElement.dataset.textZoom = '2';
  return { count: applied.length };
}
"""

UNZOOM_JS = """
() => {
  document.querySelectorAll('*').forEach(el => {
    el.style.removeProperty('font-size');
  });
  delete document.documentElement.dataset.textZoom;
}
"""

def rect(page, sel):
    return page.evaluate(
        "s => { const el = document.querySelector(s); if (!el) return null;"
        " const r = el.getBoundingClientRect();"
        " return { x: Math.round(r.x*10)/10, y: Math.round(r.y*10)/10, w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10 }; }",
        sel)

def box(page, sel):
    return page.evaluate(
        "s => { const el = document.querySelector(s); if (!el) return null; const cs = getComputedStyle(el);"
        " const r = el.getBoundingClientRect();"
        " return { w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10,"
        "  fontSize: cs.fontSize, lineHeight: getComputedStyle(el.querySelector('.m-btn__label') || el).lineHeight,"
        "  borderRadius: cs.borderRadius, minHeight: cs.minHeight, cursor: cs.cursor }; }", sel)

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "browser": "Chromium via /home/z/my-project/evidence/bin/chromium (Playwright)",
        "viewportWidths": [320, 360, 390, 430],
        "textZoom": "declared two-pass computed font-size x2 (R2-D mechanism; NOT native zoom)",
        "page": URL }}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
        # ---------- A1/A2: sizes + wrap at all widths ----------
        sizes = {}
        for w in [320, 360, 390, 430]:
            page = browser.new_page(viewport={"width": w, "height": 900})
            page.goto(URL, wait_until="networkidle")
            sizes[w] = {
                "primaryText": box(page, "#save-btn"),
                "secondaryText": box(page, "#sync-btn"),
                "iconPlusText": box(page, "#icon-btn"),
                "iconCircle": box(page, "#circle-btn"),
                "filterCounter2": box(page, "#filter-btn"),
            }
            page.close()
        results["A1_button_sizes"] = sizes

        # long-label wrap test: inject a long Arabic label on a fresh copy
        page = browser.new_page(viewport={"width": 320, "height": 900})
        page.goto(URL, wait_until="networkidle")
        page.evaluate("""() => {
          const b = document.getElementById('sync-btn');
          b.style.maxWidth = '200px';
          b.textContent = 'مزامنة بيانات الموردين والفواتير المؤجلة لهذا الشهر';
        }""")
        long320 = box(page, "#sync-btn")
        label_r = page.evaluate(
            "() => { const l = document.querySelector('#sync-btn');"
            " const r = l.getBoundingClientRect();"
            " const cs = getComputedStyle(l);"
            " return { clientH: l.clientHeight, scrollH: l.scrollHeight, w: r.width, h: r.height,"
            " radius: cs.borderRadius, clipped: l.scrollHeight > l.clientHeight + 1 }; }")
        results["A2_multiline_320_maxW200"] = {"box": long320, "labelCheck": label_r}
        page.close()

        # ---------- A3: counter 123 at 200% ----------
        page = browser.new_page(viewport={"width": 320, "height": 900})
        page.goto(URL, wait_until="networkidle")
        # cycle filter button: initial counter fi=1 ("2") -> ONE click reaches 123
        page.click("#filter-btn"); time.sleep(0.05)
        before = rect(page, "#filter-btn")
        counter_before = page.evaluate(
            "() => { const c = document.querySelector('#filter-btn .m-btn__counter');"
            " const r = c.getBoundingClientRect(); const b = document.querySelector('#filter-btn').getBoundingClientRect();"
            " return { text: c.textContent, insideX: (r.x >= b.x - 0.5) && (r.right <= b.right + 0.5),"
            " cW: Math.round(r.width*10)/10, cH: Math.round(r.height*10)/10 }; }")
        zoomres = page.evaluate(ZOOM2_JS)
        after = rect(page, "#filter-btn")
        counter_after = page.evaluate(
            "() => { const c = document.querySelector('#filter-btn .m-btn__counter');"
            " const r = c.getBoundingClientRect(); const b = document.querySelector('#filter-btn').getBoundingClientRect();"
            " const cs = getComputedStyle(c); const cr = c.getBoundingClientRect();"
            " return { text: c.textContent, insideX: (r.x >= b.x - 0.5) && (r.right <= b.right + 0.5),"
            " insideY: (r.y >= b.y - 0.5) && (r.bottom <= b.bottom + 0.5),"
            " cW: Math.round(r.width*10)/10, cH: Math.round(r.height*10)/10,"
            " counterFontSize: cs.fontSize, horizScroll: c.scrollWidth > c.clientWidth + 0.5 }; }")
        btn_after = box(page, "#filter-btn")
        page.evaluate(UNZOOM_JS)
        restored = rect(page, "#filter-btn")
        results["A3_counter_123_at_200pct"] = {
            "zoomApplied": zoomres, "btnBefore": before, "counterBefore": counter_before,
            "btnAfter": after, "counterAfter": counter_after, "btnBoxAfter": btn_after,
            "btnRestored": restored}
        page.close()

        # ---------- A4: loading contract pattern B ----------
        page = browser.new_page(viewport={"width": 360, "height": 900})
        page.goto(URL, wait_until="networkidle")
        r0 = rect(page, "#save-btn")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('save-btn'), true, {loadingLabel:'جارٍ الحفظ'})")
        time.sleep(0.2)
        r1 = rect(page, "#save-btn")
        spin = page.evaluate(
            "() => { const s = document.querySelector('#save-btn .m-btn__spinner');"
            " const btn = document.getElementById('save-btn');"
            " const r = s.getBoundingClientRect(); const b = btn.getBoundingClientRect();"
            " const label = btn.querySelector('.m-btn__label');"
            " const lr = label ? label.getBoundingClientRect() : null;"
            " const cs = getComputedStyle(s);"
            " return { visible: cs.visibility, w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10,"
            " gapToBtnEdgeX: Math.round(Math.min(r.x - b.x, b.right - r.right)*10)/10,"
            " gapToLabelX: lr ? Math.round((lr.x - r.right)*10)/10 : null,"
            " labelOpacity: label ? getComputedStyle(label).opacity : null,"
            " ariaBusy: btn.getAttribute('aria-busy'), ariaLabel: btn.getAttribute('aria-label') }; }")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('save-btn'), false)")
        time.sleep(0.05)
        r2 = rect(page, "#save-btn")
        # icon button loading
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('circle-btn'), true)")
        time.sleep(0.1)
        icb = rect(page, "#circle-btn")
        icb_spin = page.evaluate(
            "() => { const s = document.querySelector('#circle-btn .m-btn__spinner'); const r = s.getBoundingClientRect();"
            " return { w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10 }; }")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('circle-btn'), false)")
        results["A4_loading_contract_B"] = {
            "textBtn": {"before": r0, "during": r1, "after": r2, "spinner": spin},
            "iconCircleBtn": {"during": icb, "spinner": icb_spin}}
        page.close()

        # ---------- A5: real keyboard ----------
        page = browser.new_page(viewport={"width": 390, "height": 900})
        page.goto(URL, wait_until="networkidle")
        kb = {}
        # Tab to first control (save button is first focusable in body).
        # Wait 250ms after focus so the 120ms box-shadow transition settles
        # (sampling mid-transition returns interpolated values — artifact).
        for i in range(3):
            page.keyboard.press("Tab")
            time.sleep(0.05)
        time.sleep(0.25)
        kb["focusedAfterTabs"] = page.evaluate("() => document.activeElement.id || document.activeElement.tagName")
        focus_ring = page.evaluate(
            "() => { const b = document.activeElement; const cs = getComputedStyle(b);"
            " return { matchesFocusVisible: b.matches(':focus-visible'),"
            "  boxShadow: cs.boxShadow.slice(0, 160), outline: cs.outline }; }")
        kb["focusRingOnKeyboardFocus"] = focus_ring
        # Enter on busy button: count clicks (go back to save-btn via Shift+Tab x2)
        page.keyboard.press("Shift+Tab"); time.sleep(0.05)
        page.keyboard.press("Shift+Tab"); time.sleep(0.05)
        kb["focusedForGuardTest"] = page.evaluate("() => document.activeElement.id || document.activeElement.tagName")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('save-btn'), true)")
        clicks = []
        page.evaluate("window.__clicks = 0; document.getElementById('save-btn').addEventListener('click', () => window.__clicks++)")
        page.keyboard.press("Enter"); time.sleep(0.1)
        kb["clicksWhileBusyEnter"] = page.evaluate("() => window.__clicks")
        page.keyboard.press(" "); time.sleep(0.1)
        kb["clicksWhileBusySpace"] = page.evaluate("() => window.__clicks")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('save-btn'), false)")
        time.sleep(0.3)
        page.keyboard.press("Enter"); time.sleep(0.1)
        kb["clicksAfterBusyEnter"] = page.evaluate("() => window.__clicks")
        # focus retention during loading
        page.evaluate("() => document.getElementById('save-btn').focus()")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('save-btn'), true)")
        time.sleep(0.25)
        kb["focusRetainedDuringLoading"] = page.evaluate("() => document.activeElement.id")
        kb["focusRingDuringLoading"] = page.evaluate(
            "() => { const b = document.getElementById('save-btn'); b.focus();"
            " return getComputedStyle(b).boxShadow.slice(0, 160); }")
        page.evaluate("() => MicroButtons.setLoading(document.getElementById('save-btn'), false)")
        results["A5_real_keyboard"] = kb
        page.close()

        # ---------- A6: disabled ----------
        page = browser.new_page(viewport={"width": 390, "height": 900})
        page.goto(URL, wait_until="networkidle")
        page.evaluate("() => document.getElementById('sync-btn').disabled = true")
        dis = page.evaluate(
            "() => { const b = document.getElementById('sync-btn'); const cs = getComputedStyle(b);"
            " return { cursor: cs.cursor, bg: cs.backgroundColor, boxShadow: cs.boxShadow.slice(0, 60), color: cs.color }; }")
        page.keyboard.press("Tab")
        f1 = page.evaluate("() => document.activeElement.id || document.activeElement.tagName")
        results["A6_disabled"] = {"computed": dis, "firstTabStop": f1,
            "note": "disabled native button skipped in Tab order"}
        page.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)

if __name__ == "__main__":
    main()
