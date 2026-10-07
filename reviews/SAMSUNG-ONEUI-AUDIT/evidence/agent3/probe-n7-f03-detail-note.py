# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 7: F03 item save -> persistent detail note (the B06
'persistent alternative' contract), navbar aria-current switching, and
screenshot of the visible note state. REAL keyboard (Enter to save).
360x800.
"""
import json
from playwright.sync_api import sync_playwright

F03 = "http://127.0.0.1:5000/previews/ux-patterns/mobile-record-sample/"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n7-f03-detail-note.json"
R = {}

def active(page):
    return page.evaluate("document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'body'")

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = browser.new_page(viewport={"width": 360, "height": 800})
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto(F03, wait_until="networkidle")
    page.click("#f03-gw-demo")
    page.wait_for_timeout(400)

    # add item with real keyboard
    page.click("#f03-home-add")
    page.wait_for_timeout(300)
    page.keyboard.type("صنف تجريبي للفحص")
    # open category picker from its trigger
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(900)  # category read is async (mock adapter)
    opts = page.locator("#f03-picker .m-picker__option")
    if opts.count():
        opts.first.click()
        page.wait_for_timeout(400)
    if page.evaluate("!document.getElementById('f03-cat-layer').hidden"):
        page.keyboard.press("Escape")
        page.wait_for_timeout(400)
    R["category_chosen"] = page.evaluate("document.getElementById('f03-cat-value').textContent")
    page.click("#f03-save")
    page.wait_for_timeout(1200)  # save resolves (600ms) + transition

    R["item_save"] = {
        "view": page.evaluate("Array.from(document.querySelectorAll('.f03-view')).find(v=>!v.hidden)?.id"),
        "noteHidden": page.evaluate("document.getElementById('f03-detail-note').hidden"),
        "noteVisibleRect": page.evaluate("""() => {
            const n = document.getElementById('f03-detail-note');
            const r = n.getBoundingClientRect();
            return {w: Math.round(r.width), h: Math.round(r.height)};
        }"""),
        "noteTitle": page.evaluate("document.getElementById('f03-detail-note-title').textContent"),
        "noteBody": page.evaluate("document.getElementById('f03-detail-note-body').textContent"),
        "noteRole": page.evaluate("document.getElementById('f03-detail-note').getAttribute('role')"),
        "noteVariant": page.evaluate("document.getElementById('f03-detail-note').className"),
        "focus": active(page),
        "toastRect": page.evaluate("(() => {const r = document.getElementById('f03-toast').getBoundingClientRect(); return {w:r.width,h:r.height};})()"),
    }
    page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/f03-360-item-save-detail-note-visible.png")

    # navbar aria-current switching (from detail: back to list first, navbar shows on main views)
    page.click("#f03-detail-back")
    page.wait_for_timeout(400)
    cur = {}
    for nav_id in ("#f03-nav-list", "#f03-nav-reports", "#f03-nav-account", "#f03-nav-home"):
        page.click(nav_id)
        page.wait_for_timeout(250)
        cur[nav_id] = page.evaluate(
            "document.querySelector('#f03-navbar .m-navbar__item[aria-current=page]') ? document.querySelector('#f03-navbar .m-navbar__item[aria-current=page]').id : null")
    R["navbar_aria_current_switch"] = cur

    # op note in form on failed save (persistent alternative for errors)
    page.evaluate("window.F03App.arm('save', 'not-saved')")
    page.click("#f03-nav-list"); page.wait_for_timeout(250)
    page.click("#f03-list-add"); page.wait_for_timeout(300)
    page.keyboard.type("صنف فاشل")
    # choose category
    page.click("#f03-cat-trigger"); page.wait_for_timeout(400)
    opts = page.locator("#f03-picker .m-picker__option")
    if opts.count():
        opts.first.click()
        page.wait_for_timeout(300)
    page.click("#f03-save")
    page.wait_for_timeout(1400)
    R["failed_save_op_note"] = {
        "opNoteHidden": page.evaluate("document.getElementById('f03-op-note').hidden"),
        "opNoteRole": page.evaluate("document.getElementById('f03-op-note').getAttribute('role')"),
        "opNoteVariant": page.evaluate("document.getElementById('f03-op-note').className"),
        "opNoteTitle": page.evaluate("document.getElementById('f03-op-title').textContent"),
        "opNoteBody": page.evaluate("document.getElementById('f03-op-body').textContent"),
        "fieldsStillEditable": page.evaluate("document.getElementById('f03-name').readOnly"),
        "checkBtnVisible": page.evaluate("!document.getElementById('f03-check').hidden"),
        "focus": active(page),
    }

    R["pageErrors"] = errs
    browser.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(R, f, ensure_ascii=False, indent=2)
print(json.dumps(R, ensure_ascii=False, indent=1)[:3000])
