# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 2: layer contracts on F03 with REAL keyboard.
Escape close + focus restoration, Tab trap, background inert, leave-guard,
filter panel draft/applied, account-settings layer, delete dialog keep policy.
Viewport 360x800. Playwright sync + Chromium (evidence/bin/chromium).
"""
import json
from playwright.sync_api import sync_playwright

F03 = "http://127.0.0.1:5000/previews/ux-patterns/mobile-record-sample/"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n2-f03-layer-contracts.json"

def active(page):
    return page.evaluate("document.activeElement ? (document.activeElement.id || document.activeElement.tagName+'.'+document.activeElement.className) : 'body'")

results = {"viewport": "360x800", "tests": {}}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = browser.new_page(viewport={"width": 360, "height": 800})
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto(F03, wait_until="networkidle")
    # enter app via demo button
    page.click("#f03-gw-demo")
    page.wait_for_timeout(400)

    # ---- A) category layer: open from form, Escape, focus restore ----
    page.click("#f03-home-add")
    page.wait_for_timeout(300)
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(400)
    a = {
        "layerOpen": page.evaluate("!document.getElementById('f03-cat-layer').hidden"),
        "backdropOpen": page.evaluate("!document.getElementById('f03-cat-backdrop').hidden"),
        "focusOnOpen": active(page),
        "bodyScrollLocked": page.evaluate("document.body.style.overflow"),
        "backgroundInert": page.evaluate(
            "document.getElementById('f03-navbar').inert === true"),
        "mainInert": page.evaluate("document.getElementById('f03-main').inert"),
    }
    # Tab trap: press Tab 15 times, focus must stay inside layer
    ids = []
    for _ in range(15):
        page.keyboard.press("Tab")
        page.wait_for_timeout(40)
        ids.append(active(page))
    a["tabCycleAllInsideLayer"] = all(i and ("f03-cat" in i or "f03-picker" in i or i.startswith("INPUT") or i.startswith("BUTTON")) for i in ids)
    a["tabFocusSequence"] = ids[:10]
    # Escape close
    page.keyboard.press("Escape")
    page.wait_for_timeout(500)
    a["afterEscape_layerHidden"] = page.evaluate("document.getElementById('f03-cat-layer').hidden")
    a["afterEscape_focusRestoredTo"] = active(page)
    a["afterEscape_inertReleased"] = page.evaluate("document.getElementById('f03-navbar').inert === false")
    a["afterEscape_scrollUnlocked"] = page.evaluate("document.body.style.overflow === ''")
    results["tests"]["A_category_layer"] = a

    # ---- B) leave guard: dirty form + back -> dialog; stay/abandon ----
    page.click("#f03-name")
    page.keyboard.type("بضاعة مؤقتة")
    page.wait_for_timeout(100)
    page.click("#f03-form-back")
    page.wait_for_timeout(400)
    b = {
        "leaveDialogOpen": page.evaluate("!document.getElementById('f03-leave-dialog').hidden"),
        "focusOnOpen": active(page),  # expect البقاء في التعديل (data-autofocus)
    }
    # Escape on the leave dialog = close (stay), focus back to form-back
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    b["afterEscape_dialogHidden"] = page.evaluate("document.getElementById('f03-leave-dialog').hidden")
    b["afterEscape_focus"] = active(page)
    b["stillInForm"] = page.evaluate("!document.getElementById('view-form').hidden")
    # reopen and abandon
    page.click("#f03-form-back")
    page.wait_for_timeout(400)
    page.click("#f03-abandon")
    page.wait_for_timeout(400)
    b["afterAbandon_view"] = page.evaluate(
        "Array.from(document.querySelectorAll('.f03-view')).find(v=>!v.hidden)?.id")
    b["afterAbandon_focus"] = active(page)
    results["tests"]["B_leave_guard"] = b

    # ---- C) filter panel draft/applied ----
    page.click("#f03-nav-list")
    page.wait_for_timeout(300)
    page.click("#f03-filter-btn")
    page.wait_for_timeout(400)
    c = {"open_focus": active(page)}
    boxes = page.locator("#f03-filter-layer input[type=checkbox]")
    c["checkboxCount"] = boxes.count()
    if boxes.count() >= 2:
        # click the wrapping label (real pointer path; input itself is covered)
        page.locator("#f03-filter-cats .m-choice").nth(0).click()
        page.locator("#f03-filter-cats .m-choice").nth(1).click()
        page.wait_for_timeout(150)
        c["draftSummary"] = page.evaluate(
            "document.querySelector('#f03-filter-layer [data-filter-summary]').textContent")
    page.click("#f03-filter-layer [data-filter-apply]")
    page.wait_for_timeout(500)
    c["afterApply_layerHidden"] = page.evaluate("document.getElementById('f03-filter-layer').hidden")
    c["afterApply_focus"] = active(page)
    c["afterApply_counter"] = page.evaluate(
        "document.getElementById('f03-filter-count').textContent + '/hidden=' + document.getElementById('f03-filter-count').hidden")
    c["afterApply_ariaLabel"] = page.evaluate(
        "document.getElementById('f03-filter-btn').getAttribute('aria-label')")
    c["afterApply_results"] = page.evaluate("document.getElementById('f03-list-results').textContent")
    # reopen: draft must start from applied
    page.click("#f03-filter-btn")
    page.wait_for_timeout(400)
    c["reopen_draftState"] = page.evaluate(
        "Array.from(document.querySelectorAll('#f03-filter-layer input[type=checkbox]')).map(i=>i.checked)")
    c["reopen_summary"] = page.evaluate(
        "document.querySelector('#f03-filter-layer [data-filter-summary]').textContent")
    # cancel (discard): applied stays
    page.click("#f03-filter-layer [data-filter-cancel]")
    page.wait_for_timeout(400)
    c["afterCancel_focus"] = active(page)
    c["afterCancel_counter"] = page.evaluate(
        "document.getElementById('f03-filter-count').textContent + '/hidden=' + document.getElementById('f03-filter-count').hidden")
    results["tests"]["C_filter_panel"] = c

    # ---- D) account settings layer: open, to-application, back, Escape ----
    page.click("#f03-nav-account")
    page.wait_for_timeout(300)
    page.click("[data-account-open]")
    page.wait_for_timeout(400)
    d = {
        "layerOpen": page.evaluate("!document.getElementById('f03-account-layer').hidden"),
        "focusOnOpen": active(page),
        "backBtnHidden_accountView": page.evaluate("document.querySelector('#f03-account-layer [data-account-back]').hidden"),
    }
    page.click("[data-account-to-application]")
    page.wait_for_timeout(300)
    d["appViewShown"] = page.evaluate("!document.querySelector('[data-account-view=application]').hidden")
    d["focusAfterToApplication"] = active(page)
    d["backBtnVisible_appView"] = page.evaluate("!document.querySelector('#f03-account-layer [data-account-back]').hidden")
    d["ariaLabelledby"] = page.evaluate("document.getElementById('f03-account-layer').getAttribute('aria-labelledby')")
    # toggle a switch with real keyboard Space
    sw = page.locator('[data-account-setting="showHomeComparison"]')
    d["switchBefore"] = sw.is_checked()
    sw.focus()
    page.keyboard.press("Space")
    page.wait_for_timeout(500)
    d["switchAfterSpace"] = sw.is_checked()
    d["switchStateText"] = page.evaluate(
        "document.querySelector('[data-account-setting=showHomeComparison] ~ .m-switch__text') ? document.querySelector('#f03-account-layer [data-account-view=application] .m-switch__text .m-switch__state').textContent : null")
    d["demoStatus"] = page.evaluate("document.querySelector('[data-account-demo-status]').textContent")
    # back button returns to account view, focus to heading
    page.click("#f03-account-layer [data-account-back]")
    page.wait_for_timeout(300)
    d["afterBack_view"] = page.evaluate("!document.querySelector('[data-account-view=account]').hidden")
    d["afterBack_focus"] = active(page)
    # Escape: close and restore focus to the settings row trigger
    page.keyboard.press("Escape")
    page.wait_for_timeout(500)
    d["afterEscape_layerHidden"] = page.evaluate("document.getElementById('f03-account-layer').hidden")
    d["afterEscape_focus"] = active(page)
    results["tests"]["D_account_layer"] = d

    # ---- E) delete dialog keep-policy + Escape ----
    page.click("#f03-nav-list")
    page.wait_for_timeout(300)
    row = page.locator("#f03-list-rows .f03-row").first
    row.click()
    page.wait_for_timeout(300)
    page.click("#f03-detail-delete")
    page.wait_for_timeout(400)
    e = {"dialogOpen": page.evaluate("!document.getElementById('f03-delete-dialog').hidden"),
         "focusOnOpen": active(page)}
    # backdrop click must NOT close (data-backdrop=keep)
    page.mouse.click(20, 200)
    page.wait_for_timeout(400)
    e["afterBackdropClick_dialogStillOpen"] = page.evaluate("!document.getElementById('f03-delete-dialog').hidden")
    # Escape must close it (destructive-soft default close policy via key)
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    e["afterEscape_dialogHidden"] = page.evaluate("document.getElementById('f03-delete-dialog').hidden")
    e["afterEscape_focus"] = active(page)
    e["itemStillExists"] = page.locator("#f03-list-rows .f03-row").count() > 0
    results["tests"]["E_delete_dialog"] = e

    results["pageErrors"] = errs
    browser.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(json.dumps(results, ensure_ascii=False, indent=1)[:4000])
