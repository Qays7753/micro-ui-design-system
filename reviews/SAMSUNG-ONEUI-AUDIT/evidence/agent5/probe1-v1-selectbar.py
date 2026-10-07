#!/usr/bin/env python3
"""SUI-A5 Agent 5 — independent verification probe 1: V1 (Agent 1) / N8 (Agent 3).

Claim under test (falsification attempt):
  At 320px + declared 200% text zoom (two-pass computed font-size x2), with
  selection mode active in the F03 items list, the sticky bulk-selection bar
  (#f03-select-bar, inset-block-end: calc(53px + env(safe-area-inset-bottom)))
  is covered by the fixed navbar: navbar grows 53 -> ~70.98px while the offset
  stays 53px -> overlap ~17.98px. At 1x: overlap 0 (barBottom == navbarTop).

My own approach (independent of agent 1's script):
  - 320 AND 390 widths, 1x and 2x in fresh sessions (no zoom state carry-over),
  - overlap measured at FOUR scroll positions (0 / 300 / 600 / max),
  - also measure the bottom of the actual destructive button ("حذف المحدد")
    inside the bar vs navbar top (user-visible impact),
  - and .f03-foot computed padding-bottom (the second hardcoded 53px, N8).

Meta: commit a5500c9 (tree 05f344b), Chromium /home/z/my-project/evidence/bin/chromium
via unmodified tools/preview-server.py on 127.0.0.1:5000.
Text-200% mechanism: DECLARED two-pass computed font-size doubling on body+all
elements (same library-documented mechanism) — NOT native browser/system zoom.
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/index.html"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe1-v1-selectbar.json"

# CLEAN two-pass (same as library ZOOM2_CLEAN in tools/ui-repair-r2-check.py):
# pass 1 collects ALL computed font sizes; pass 2 applies x2 — no inherited
# re-doubling. (A single read-and-set loop would over-double inheriting
# elements; agent 5 caught and fixed this in its own scripts before trusting
# its numbers — validation comparison kept in probe5.)
TWO_PASS = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  let n = 0;
  orig.forEach((it) => { if (it.fs > 0) { it.el.style.fontSize = (it.fs * 2) + 'px'; n++; } });
  return n;
}"""

MEASURE = """() => {
  const bar = document.querySelector('#f03-select-bar');
  const navbar = document.querySelector('#f03-navbar');
  const br = bar.getBoundingClientRect();
  const nr = navbar.getBoundingClientRect();
  const delBtn = [...bar.querySelectorAll('.m-btn')].find(b => b.textContent.includes('حذف'));
  const db = delBtn ? delBtn.getBoundingClientRect() : null;
  const foot = document.querySelector('.f03-foot');
  const revLink = document.querySelector('.f03-foot__link');
  const rl = revLink ? revLink.getBoundingClientRect() : null;
  return {
    scrollY: window.scrollY,
    barHidden: bar.hidden,
    bar: { top: +br.top.toFixed(2), bottom: +br.bottom.toFixed(2), h: +br.height.toFixed(2) },
    navbar: { top: +nr.top.toFixed(2), h: +nr.height.toFixed(2) },
    overlapPx: +Math.max(0, br.bottom - nr.top).toFixed(2),
    gapPx: +(nr.top - br.bottom).toFixed(2),
    deleteBtn: db ? { top: +db.top.toFixed(2), bottom: +db.bottom.toFixed(2), coveredPx: +Math.max(0, db.bottom - nr.top).toFixed(2), btnH: +db.height.toFixed(2) } : null,
    footPaddingBottom: getComputedStyle(foot).paddingBottom,
    reviewLink: rl ? { bottom: +rl.bottom.toFixed(2), clearance: +(nr.top - rl.bottom).toFixed(2) } : null,
    docScrollW: document.documentElement.scrollWidth,
    docClientW: document.documentElement.clientWidth,
  };
}"""

def session(ctx, width, zoom):
    page = ctx.new_page()
    page.goto(F03, wait_until="networkidle")
    page.click("#f03-gw-demo")
    page.wait_for_selector("#view-home:not([hidden])")
    page.wait_for_timeout(350)
    page.click("#f03-nav-list")
    page.wait_for_selector("#view-list:not([hidden])")
    page.wait_for_timeout(250)
    page.click("#f03-select-toggle")
    page.wait_for_timeout(300)
    n = 0
    if zoom:
        n = page.evaluate(TWO_PASS)
        page.wait_for_timeout(350)
    out = {"elementsDoubled": n}
    for y in [0, 300, 600, 100000]:
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(120)
        out["scroll_%s" % (y if y != 100000 else "max")] = page.evaluate(MEASURE)
    return page, out

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b05ef12284abfc31ad9a1c8633dcd6a058",
        "browser": "Chrome for Testing 143.0.7499.4 (/home/z/my-project/evidence/bin/chromium, Playwright sync)",
        "server": "tools/preview-server.py unmodified on 127.0.0.1:5000",
        "textZoom200": "DECLARED clean two-pass (library ZOOM2_CLEAN style): collect ALL computed font sizes, then apply x2 — no inherited re-doubling. NOT native zoom.",
        "claim": "V1 overlap ~17.98px at 320/200%; 0 at 1x; navbar 53->70.98px",
    }}
    errs = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM, args=["--hide-scrollbars"])
        for width in (320, 390):
            for zoom in (False, True):
                ctx = browser.new_context(viewport={"width": width, "height": 800})
                ctx.on("page", None) if False else None
                page = ctx.new_page()
                page.on("pageerror", lambda e: errs.append(str(e)))
                page, out = session(ctx, width, zoom)
                shot = ("probe1-v1-320-text200-selectbar.png" if (width, zoom) == (320, True) else None)
                if shot:
                    page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/" + shot)
                results["w%d_%s" % (width, "2x" if zoom else "1x")] = out
                ctx.close()
        browser.close()
    results["pageerrors"] = errs
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)
    # quick digest
    for k in ["w320_1x", "w320_2x", "w390_1x", "w390_2x"]:
        v = results[k]
        for s in v:
            if isinstance(v[s], dict) and "overlapPx" in v[s]:
                print(k, s, "overlap=", v[s]["overlapPx"], "navbarH=", v[s]["navbar"]["h"], "deleteCovered=", (v[s]["deleteBtn"] or {}).get("coveredPx"))

if __name__ == "__main__":
    main()
