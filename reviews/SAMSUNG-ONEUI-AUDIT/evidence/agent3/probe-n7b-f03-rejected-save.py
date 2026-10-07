# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 7b: F03 rejected save -> persistent error note final state
(after settle window). REAL click flow. 360x800. Playwright + Chromium."""
import json
from playwright.sync_api import sync_playwright
F03 = "http://127.0.0.1:5000/previews/ux-patterns/mobile-record-sample/"
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = b.new_page(viewport={"width": 360, "height": 800})
    errs=[]; page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto(F03, wait_until="networkidle")
    page.click("#f03-gw-demo"); page.wait_for_timeout(400)
    page.click("#f03-nav-list"); page.wait_for_timeout(250)
    page.click("#f03-list-add"); page.wait_for_timeout(300)
    page.keyboard.type("صنف فاشل")
    page.click("#f03-cat-trigger"); page.wait_for_timeout(900)
    page.locator("#f03-picker .m-picker__option").first.click(); page.wait_for_timeout(400)
    page.evaluate("window.F03App.arm('save', 'not-saved')")
    page.click("#f03-save"); page.wait_for_timeout(3200)  # busy 600 + settle window
    out["rejected_save_final"] = {
        "opNoteHidden": page.evaluate("document.getElementById('f03-op-note').hidden"),
        "variant": page.evaluate("document.getElementById('f03-op-note').className"),
        "title": page.evaluate("document.getElementById('f03-op-title').textContent"),
        "body": page.evaluate("document.getElementById('f03-op-body').textContent"),
        "role": page.evaluate("document.getElementById('f03-op-note').getAttribute('role')"),
        "nameValueKept": page.evaluate("document.getElementById('f03-name').value"),
        "checkBtnVisible": page.evaluate("!document.getElementById('f03-check').hidden"),
        "saveBtnLoading": page.evaluate("document.getElementById('f03-save').getAttribute('data-loading') || document.getElementById('f03-save').className"),
        "focus": page.evaluate("document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'body'"),
    }
    page.screenshot(path="f03-360-rejected-save-persistent-error-note.png")
    out["pageErrors"] = errs
    b.close()
json.dump(out, open("n7b-f03-rejected-save.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(json.dumps(out, ensure_ascii=False, indent=1))
