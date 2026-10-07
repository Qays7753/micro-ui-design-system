# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 8: F03 gateway reveal button S28 contract (aria-pressed +
label), invalid-email error focus contract, busy state, post-submit state.
REAL keyboard (Enter). 360x800. Playwright + Chromium."""
import json
from playwright.sync_api import sync_playwright
F03 = "http://127.0.0.1:5000/previews/ux-patterns/mobile-record-sample/"
out = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = b.new_page(viewport={"width": 360, "height": 800})
    errs=[]; page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto(F03, wait_until="networkidle")
    rev = page.locator("[data-access-reveal]").first
    out["reveal_before"] = page.evaluate("""() => {
        const r = document.querySelector('[data-access-reveal]');
        const rect = r.getBoundingClientRect();
        return {pressed: r.getAttribute('aria-pressed'), label: r.getAttribute('aria-label'),
                w: rect.width, h: rect.height, tabIndex: r.tabIndex};
    }""")
    rev.click(); page.wait_for_timeout(150)
    out["reveal_after"] = page.evaluate("""() => {
        const r = document.querySelector('[data-access-reveal]');
        const pw = document.getElementById('f03-gw-password');
        const st = r.querySelector('[data-access-reveal-status]');
        return {pressed: r.getAttribute('aria-pressed'), label: r.getAttribute('aria-label'),
                pwType: pw.type, statusText: st ? st.textContent : null};
    }""")
    page.fill("#f03-gw-email", "abc"); page.fill("#f03-gw-password", "1234")
    page.keyboard.press("Enter"); page.wait_for_timeout(300)
    out["invalid_email_error"] = {
        "focus": page.evaluate("document.activeElement.id"),
        "fieldMsg": page.evaluate("document.getElementById('f03-gw-email').closest('.m-field').querySelector('[data-field-msg]').textContent"),
        "status": page.evaluate("document.querySelector('[data-access-status]').textContent"),
        "tone": page.evaluate("document.querySelector('[data-access-status]').getAttribute('data-tone')"),
    }
    page.fill("#f03-gw-email", "ok@example.test"); page.fill("#f03-gw-password", "123456")
    page.click("#f03-gw-submit")
    page.wait_for_timeout(250)
    out["submit_busy"] = {
        "ariaBusy": page.evaluate("document.querySelector('[data-access-form]').getAttribute('aria-busy')"),
        "submitLoading": page.evaluate("document.getElementById('f03-gw-submit').className"),
        "statusText": page.evaluate("document.querySelector('[data-access-status]').textContent"),
    }
    page.wait_for_timeout(800)
    out["after_submit"] = {
        "view": page.evaluate("Array.from(document.querySelectorAll('.f03-view')).find(v=>!v.hidden)?.id"),
        "statusText": page.evaluate("document.querySelector('[data-access-status]').textContent"),
    }
    out["pageErrors"] = errs
    b.close()
json.dump(out, open("n8-gateway-reveal-errors.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(json.dumps(out, ensure_ascii=False, indent=1))
