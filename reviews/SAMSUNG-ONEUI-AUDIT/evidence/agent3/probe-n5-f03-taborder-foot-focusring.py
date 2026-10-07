# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 5: F03 tab order + foot clearance scrolled + navbar
focus-visible ring + gateway example-usage Escape contract.
REAL keyboard (Tab/Shift+Tab/Escape). 360x800.
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n5-f03-taborder-foot-focusring.json"
R = {}

def active(page):
    return page.evaluate("document.activeElement ? (document.activeElement.id || document.activeElement.tagName + '.' + (document.activeElement.className||'')) : 'body'")

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = browser.new_page(viewport={"width": 360, "height": 800})
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto(F03, wait_until="networkidle")

    # gateway tab order (first 10 stops)
    stops = []
    page.keyboard.press("Tab")
    for _ in range(9):
        page.wait_for_timeout(60)
        stops.append(active(page))
        page.keyboard.press("Tab")
    R["gateway_tab_order"] = stops

    page.click("#f03-gw-demo")
    page.wait_for_timeout(400)
    # home tab order (12 stops)
    stops = []
    page.keyboard.press("Tab")
    for _ in range(11):
        page.wait_for_timeout(60)
        stops.append(active(page))
        page.keyboard.press("Tab")
    R["home_tab_order"] = stops

    # navbar focus-visible ring (keyboard reached)
    ring = page.evaluate("""() => {
        const items = Array.from(document.querySelectorAll('#f03-navbar .m-navbar__item'));
        const it = items.find(i => document.activeElement === i);
        if (!it) return {onNavbar: false};
        const cs = getComputedStyle(it);
        return {onNavbar: true, boxShadow: cs.boxShadow.slice(0, 80), outline: cs.outlineWidth + ' ' + cs.outlineStyle};
    }""")
    R["navbar_focus_ring_while_tabbing"] = ring

    # foot clearance scrolled to document end (default size)
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page.wait_for_timeout(300)
    R["foot_clearance_scrolled_default"] = page.evaluate("""() => {
        const link = document.getElementById('f03-review-open');
        const nav = document.getElementById('f03-navbar');
        const rl = link.getBoundingClientRect(), rn = nav.getBoundingClientRect();
        return {linkBottom: Math.round(rl.bottom), navbarTop: Math.round(rn.top),
                clearance: Math.round(rn.top - rl.bottom),
                linkFullyVisible: rl.bottom <= rn.top};
    }""")

    # account-settings example-usage: Escape + focus contract
    page.goto(BASE + "/components/account-settings/example-usage.html", wait_until="networkidle")
    page.keyboard.press("Tab")   # first stop = open button (data-autofocus)
    R["account_example_firstTab"] = active(page)
    page.keyboard.press("Enter")
    page.wait_for_timeout(400)
    R["account_example"] = {
        "layerOpen": page.evaluate("!document.getElementById('sample-account-layer').hidden"),
        "focusOnOpen": active(page),
        "backdropOpen": page.evaluate("!document.getElementById('sample-account-backdrop').hidden"),
    }
    page.keyboard.press("Tab"); page.wait_for_timeout(60)
    R["account_example"]["tab2"] = active(page)
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    R["account_example"]["afterEscape_hidden"] = page.evaluate("document.getElementById('sample-account-layer').hidden")
    R["account_example"]["afterEscape_focus"] = active(page)

    # access-gateway example-usage: hidden optional elements without handlers
    page.goto(BASE + "/components/access-gateway/example-usage.html", wait_until="networkidle")
    R["gateway_example"] = page.evaluate("""() => {
        const rec = document.querySelector('[data-access-recovery]');
        const prov = document.querySelector('[data-access-providers]');
        const demo = document.querySelector('.m-access-gateway__demo-note');
        return {recoveryHidden: rec ? rec.hidden : 'absent',
                providersHidden: prov ? prov.hidden : 'absent',
                demoNoteText: demo ? demo.textContent.trim() : null};
    }""")

    R["pageErrors"] = errs
    browser.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(R, f, ensure_ascii=False, indent=2)
print(json.dumps(R, ensure_ascii=False, indent=1)[:3500])
