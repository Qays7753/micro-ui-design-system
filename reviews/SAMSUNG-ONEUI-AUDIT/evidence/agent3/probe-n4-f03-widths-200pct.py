# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 4: 
A) navigation panel actionbar sticky — scrolled-to-end measurement.
B) F03 at 320/360/390/430 default: navbar geometry, appbar back button.
C) F03 text 200% DECLARED mechanism (double computed font-size of every
   element — text-zoom simulation, NOT native zoom), two clean passes:
   pass 1 baseline, apply, pass 2 after. Measures navbar height, bulk
   selection bar vs navbar overlap (cross-check of Agent 1 V1), appbar.
D) Tabs arrow wrap at the edge (S29 no-looping reference).
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n4-f03-widths-200pct.json"
R = {"declaredTextZoomMechanism": "JS walk doubling computed font-size on every element (simulates text zoom 200%); two passes: baseline -> apply -> measure. NOT native zoom."}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = browser.new_page(viewport={"width": 360, "height": 800})
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))

    # A) actionbar sticky scrolled to end
    page.goto(BASE + "/previews/navigation/", wait_until="networkidle")
    page.evaluate("""() => {
        const ph = document.querySelector('.phone-demo.is-scroll');
        ph.scrollTop = ph.scrollHeight;
    }""")
    page.wait_for_timeout(200)
    R["actionbar_scrolled_end"] = page.evaluate("""() => {
        const bar = document.querySelector('.m-actionbar');
        const foot = document.getElementById('sticky-foot');
        const last = document.getElementById('last-content');
        const rb = bar.getBoundingClientRect(), rf = foot.getBoundingClientRect(), rl = last.getBoundingClientRect();
        return {lastContentBottom: Math.round(rl.bottom), footTop: Math.round(rf.top),
                cleared: rl.bottom <= rf.top + 1,
                barHeight: Math.round(rb.height),
                lastContentVisibleFully: rl.bottom <= foot.getBoundingClientRect().top};
    }""")

    # D) tabs wrap at edge
    page.focus("#tab-b-btn")
    page.keyboard.press("ArrowLeft")  # last tab, left = next -> wraps to first
    page.wait_for_timeout(120)
    R["tabs_edge_wrap"] = {
        "fromLastTabArrowLeft_goesTo": page.evaluate("document.activeElement.id"),
        "selected": page.evaluate("document.querySelector('.m-tabs__tab[aria-selected=true]').id"),
    }

    # B) F03 default widths
    page.goto(F03, wait_until="networkidle")
    page.click("#f03-gw-demo")
    page.wait_for_timeout(400)
    widths = {}
    for w in (320, 360, 390, 430):
        page.set_viewport_size({"width": w, "height": 800})
        page.wait_for_timeout(150)
        widths[str(w)] = page.evaluate("""() => {
            const nav = document.getElementById('f03-navbar');
            const navR = nav.getBoundingClientRect();
            const items = Array.from(nav.querySelectorAll('.m-navbar__item'));
            const back = document.querySelector('#view-home .f03-appbar') ? null : document.getElementById('f03-list-back');
            const appbar = document.querySelector('#view-home .f03-appbar');
            const title = document.getElementById('f03-home-title');
            const foot = document.querySelector('.f03-foot');
            const footLink = document.getElementById('f03-review-open');
            return {
                navbarH: Math.round(navR.height),
                itemWidths: items.map(i => Math.round(i.getBoundingClientRect().width)),
                itemHeights: items.map(i => Math.round(i.getBoundingClientRect().height)),
                labelLines: items.map(i => i.textContent.trim().length > 0 ? Math.round(i.getBoundingClientRect().height) : 0),
                hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
                appbarH: Math.round(appbar.getBoundingClientRect().height),
                appbarTitleFont: getComputedStyle(title).fontSize,
                footBottomPadding: getComputedStyle(foot).paddingBottom,
                footLinkClearsNavbar: (footLink.getBoundingClientRect().bottom <= navR.top + 1)
            };
        }""")
    R["f03_default_widths"] = widths

    # back button size in a sub-view (list)
    page.click("#f03-nav-list")
    page.wait_for_timeout(300)
    R["f03_list_back_button"] = page.evaluate("""() => {
        const b = document.getElementById('f03-list-back');
        const r = b.getBoundingClientRect();
        const appbarR = b.closest('.f03-appbar').getBoundingClientRect();
        return {w: Math.round(r.width), h: Math.round(r.height), label: b.getAttribute('aria-label'),
                isAtInlineStart: Math.abs(r.right - b.closest('.f03-appbar').getBoundingClientRect().right) > 100,
                side: (r.x < appbarR.x + appbarR.width/2) ? 'left-half' : 'right-half',
                appbarNote: 'RTL: back should be at the right (inline-start)'};
    }""")

    # C) 200% two passes on F03 (list view with selection mode)
    page.set_viewport_size({"width": 320, "height": 800})
    page.wait_for_timeout(150)
    # pass 1 baseline (navbar + select bar hidden baseline)
    base_navbar = page.evaluate("document.getElementById('f03-navbar').getBoundingClientRect().height")
    # enter selection mode
    page.click("#f03-select-toggle")
    page.wait_for_timeout(300)
    base = page.evaluate("""() => {
        const bar = document.getElementById('f03-select-bar');
        const nav = document.getElementById('f03-navbar');
        return {navbarH: nav.getBoundingClientRect().height,
                selectBarH: bar.getBoundingClientRect().height,
                selectBarBottom: bar.getBoundingClientRect().bottom,
                navbarTop: nav.getBoundingClientRect().top};
    }""")
    # scroll down so the sticky bar detaches
    page.evaluate("window.scrollTo(0, 900)")
    page.wait_for_timeout(250)
    base_scrolled = page.evaluate("""() => {
        const bar = document.getElementById('f03-select-bar');
        const nav = document.getElementById('f03-navbar');
        const rb = bar.getBoundingClientRect(), rn = nav.getBoundingClientRect();
        return {selectBarBottom: Math.round(rb.bottom), navbarTop: Math.round(rn.top),
                overlap: Math.round(Math.max(0, Math.min(rb.bottom, rn.bottom) - Math.max(rb.top, rn.top)))};
    }""")
    # apply 200% (declared mechanism)
    page.evaluate("""() => {
        document.querySelectorAll('body *').forEach(el => {
            const fs = getComputedStyle(el).fontSize;
            const m = /^([\\d.]+)px$/.exec(fs);
            if (m) el.style.fontSize = (parseFloat(m[1]) * 2) + 'px';
        });
        const b = getComputedStyle(document.body).fontSize;
        const mb = /^([\\d.]+)px$/.exec(b);
        if (mb) document.body.style.fontSize = (parseFloat(mb[1]) * 2) + 'px';
    }""")
    page.wait_for_timeout(400)
    after_navbar = page.evaluate("document.getElementById('f03-navbar').getBoundingClientRect().height")
    after = page.evaluate("""() => {
        const bar = document.getElementById('f03-select-bar');
        const nav = document.getElementById('f03-navbar');
        const rb = bar.getBoundingClientRect(), rn = nav.getBoundingClientRect();
        return {navbarH: Math.round(rn.height),
                selectBarH: Math.round(rb.height),
                selectBarBottom: Math.round(rb.bottom),
                navbarTop: Math.round(rn.top),
                selectBarVisiblePartAboveNavbar: Math.round(Math.max(0, rn.top - rb.top)),
                hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth};
    }""")
    R["f03_200pct_selection"] = {
        "pass1_baseline_navbarH": base_navbar,
        "pass1_selectbar": base,
        "pass1_scrolled": base_scrolled,
        "pass2_navbarH": after_navbar,
        "pass2_scrolled": after,
        "overlap200": after["navbarTop"] - base_scrolled["navbarTop"],
        "measuredOverlap": round(after["selectBarBottom"] - after["navbarTop"]) if after["selectBarBottom"] > after["navbarTop"] else 0,
    }
    # screenshot of the overlapped state (relevant state visible: selection mode at 200%)
    page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/f03-320-text200-selection-navbar-overlap.png")

    R["pageErrors"] = errs
    browser.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(R, f, ensure_ascii=False, indent=2)
print(json.dumps(R, ensure_ascii=False, indent=1)[:4000])
