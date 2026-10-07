#!/usr/bin/env python3
"""SUI-A2 Agent 2 — Probe D: composition lifecycles (UX patterns).

Pages (all via preview-server :5000):
 previews/ux-patterns/form-lifecycle/    (F01)
 previews/ux-patterns/choice-lifecycle/  (F02 choice)
 previews/ux-patterns/switch-lifecycle/  (F02 switch)

 D1. F01 submit with empty name (REAL keyboard Enter): has-error + msg
     visible + focus moved to name input (S32: focus next needed action).
 D2. F01 valid submit: save button aria-busy + fields readonly during
     save; settle success via SIM: view returns to read, focus to title.
 D3. F01 actions row: one primary (S10 one emphasized style per screen).
 D4. F02 choice: open picker via real trigger; search 'النور'; Enter
     selects; outer display + status note update; close layer.
 D5. F02 choice: empty outcome via SIM then reopen: empty state row +
     no selectable options (search cannot clear it).
 D6. F02 switch: REAL Space toggle: data-pending + input disabled +
     aria-busy; settle not-saved: value restored + note; focus policy.
Metadata: commit a5500c9 (tree 05f344b), Chromium /home/z/…/evidence/bin/chromium.
"""
import json, time
from playwright.sync_api import sync_playwright

OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent2/probe-d-lifecycles.json"

def g(page, js):
    return page.evaluate(js)

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "browser": "Chromium via /home/z/my-project/evidence/bin/chromium (Playwright)",
        "keyboard": "REAL keyboard events (Tab/Enter/Space) via Playwright keyboard API"}}

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")

        # ================= F01 form lifecycle =================
        page = browser.new_page(viewport={"width": 320, "height": 900})
        page.goto("http://127.0.0.1:5000/previews/ux-patterns/form-lifecycle/", wait_until="networkidle")
        page.click("#f01-edit-btn")
        time.sleep(0.1)
        # clear the name field (value from CONFIRMED_INIT)
        page.fill("#f01-name", "")
        # submit via REAL keyboard Enter on the submit button
        page.focus("#f01-save")
        page.keyboard.press("Enter")
        time.sleep(0.25)
        d1 = g(page, """() => {
          const f = document.getElementById('f01-name-field');
          const msg = document.getElementById('f01-name-msg');
          const name = document.getElementById('f01-name');
          return { hasError: f.classList.contains('has-error'),
                   msgVisible: !msg.hidden && getComputedStyle(msg).display !== 'none',
                   msgText: msg.textContent,
                   ariaDescribedby: name.getAttribute('aria-describedby'),
                   focusAfterError: document.activeElement.id,
                   errorBorderColor: getComputedStyle(f.querySelector('.m-field__control')).borderColor };
        }""")
        results["D1_f01_error_focus"] = d1
        # D3: one primary per actions row
        d3 = g(page, """() => {
          const row = document.querySelector('.f01-actions');
          const btns = [...row.querySelectorAll('.m-btn')];
          return { labels: btns.map(b => b.textContent.trim() + ':' + b.className.replace('m-btn ', '')),
                   primaryCount: btns.filter(b => b.classList.contains('m-btn--primary')).length,
                   destructiveCount: btns.filter(b => b.className.includes('destructive')).length };
        }""")
        results["D3_f01_actions_emphasis"] = d3
        # D2: valid submit → busy + readonly; settle via SIM
        page.fill("#f01-name", "مؤسسة النور")
        page.focus("#f01-save")
        page.keyboard.press("Enter")
        time.sleep(0.25)
        busy = g(page, """() => ({
          saveAriaBusy: document.getElementById('f01-save').getAttribute('aria-busy'),
          saveAriaLabel: document.getElementById('f01-save').getAttribute('aria-label'),
          nameReadonly: document.getElementById('f01-name').readOnly,
          noteReadonly: document.getElementById('f01-note').readOnly,
          opNoteVisible: !document.getElementById('f01-op-note').hidden,
          opText: document.getElementById('f01-op-title').textContent,
          checkBtnVisible: !document.getElementById('f01-check').hidden
        })""")
        # settle via SIM: outcome 'saved' + click settle-save (form not modal)
        page.select_option("#f01-sim-save-outcome", "saved")
        page.click("#f01-sim-settle-save")
        time.sleep(0.3)
        settled = g(page, """() => ({
          saveAriaBusy: document.getElementById('f01-save').getAttribute('aria-busy'),
          readViewVisible: !document.getElementById('f01-read').hidden,
          editViewHidden: document.getElementById('f01-edit').hidden,
          readName: document.getElementById('f01-read-name').textContent,
          opState: document.getElementById('f01-op-note').getAttribute('data-op-state'),
          opTitle: document.getElementById('f01-op-title').textContent
        })""")
        results["D2_f01_busy_and_settle"] = {"during": busy, "afterSavedSettle": settled}
        page.close()

        # ================= F02 choice lifecycle =================
        page = browser.new_page(viewport={"width": 320, "height": 900})
        page.goto("http://127.0.0.1:5000/previews/ux-patterns/choice-lifecycle/", wait_until="networkidle")
        page.click("#f02c-open-picker")
        time.sleep(0.3)
        opened = g(page, """() => ({
          layerHidden: document.getElementById('f02c-picker-layer').hidden,
          activeElement: document.activeElement.id || document.activeElement.tagName,
          liveText: document.getElementById('f02c-picker-live').textContent,
          stateRow: (() => { const s = document.querySelector('#f02c-picker .m-picker__state'); return s ? s.textContent.trim() : null; })(),
          optionsVisible: [...document.querySelectorAll('#f02c-picker .m-picker__option')].filter(o => !o.hidden).length
        })""")
        # the sample models a real read: settle the pending read via SIM (JS click —
        # the modal backdrop legitimately covers the SIM section while the layer is open)
        page.select_option("#f02c-sim-outcome", "ready")
        page.evaluate("() => document.getElementById('f02c-sim-settle-latest').click()")
        time.sleep(0.2)
        after_read = g(page, """() => ({
          stateRow: (() => { const s = document.querySelector('#f02c-picker .m-picker__state'); return s ? s.textContent.trim() : null; })(),
          optionsVisible: [...document.querySelectorAll('#f02c-picker .m-picker__option')].filter(o => !o.hidden).length
        })""")
        # search 'ب' then Enter selects (real keyboard)
        page.fill("#f02c-picker-search", "ب")
        time.sleep(0.1)
        filtered = g(page, "() => [...document.querySelectorAll('#f02c-picker .m-picker__option')].filter(o => !o.hidden).map(o => o.textContent.trim())")
        page.evaluate("() => { const o = [...document.querySelectorAll('#f02c-picker .m-picker__option')].find(o => !o.hidden); o.focus(); }")
        page.keyboard.press("Enter")
        time.sleep(0.15)
        selected = g(page, """() => ({
          summary: document.querySelector('#f02c-picker [data-picker-summary]').textContent,
          outerDisplay: document.getElementById('f02c-selected-display').textContent,
          statusNote: document.getElementById('f02c-selection-note').textContent
        })""")
        # close layer via Escape (B07) — then reopen after 'empty' outcome
        page.keyboard.press("Escape")
        time.sleep(0.25)
        closed = g(page, "() => ({ layerHidden: document.getElementById('f02c-picker-layer').hidden,"
                        " activeAfterClose: document.activeElement.id || document.activeElement.tagName })")
        page.select_option("#f02c-sim-outcome", "empty")
        page.click("#f02c-open-picker")
        time.sleep(0.3)
        # settle the read as empty via SIM (JS click — behind modal backdrop)
        page.evaluate("() => document.getElementById('f02c-sim-settle-latest').click()")
        time.sleep(0.2)
        empty_state = g(page, """() => ({
          layerHidden: document.getElementById('f02c-picker-layer').hidden,
          stateRow: (() => { const s = document.querySelector('#f02c-picker .m-picker__state'); return s ? s.textContent.trim() : null; })(),
          optionsVisible: [...document.querySelectorAll('#f02c-picker .m-picker__option')].filter(o => !o.hidden).length,
          liveText: document.getElementById('f02c-picker-live').textContent
        })""")
        # search cannot clear the stored empty state (query 'عينة' matches labels but state stays)
        page.fill("#f02c-picker-search", "عينة")
        time.sleep(0.15)
        after_search = g(page, """() => ({
          stateRow: (() => { const s = document.querySelector('#f02c-picker .m-picker__state'); return s ? s.textContent.trim() : null; })(),
          optionsVisible: [...document.querySelectorAll('#f02c-picker .m-picker__option')].filter(o => !o.hidden).length
        })""")
        results["D4_f02_choice_picker"] = {"opened": opened, "afterReadSettled": after_read,
                                           "filtered": filtered, "selected": selected, "closed": closed}
        results["D5_f02_choice_empty"] = {"emptyState": empty_state, "afterSearchInEmpty": after_search}
        page.close()

        # ================= F02 switch lifecycle =================
        page = browser.new_page(viewport={"width": 320, "height": 900})
        page.goto("http://127.0.0.1:5000/previews/ux-patterns/switch-lifecycle/", wait_until="networkidle")
        page.focus("#f02s-switch-input")
        page.keyboard.press(" ")
        time.sleep(0.3)
        pending = g(page, """() => ({
          dataPending: document.getElementById('f02s-switch').getAttribute('data-pending'),
          inputDisabled: document.getElementById('f02s-switch-input').disabled,
          inputAriaBusy: document.getElementById('f02s-switch-input').getAttribute('aria-busy'),
          inputChecked: document.getElementById('f02s-switch-input').checked,
          stateText: document.getElementById('f02s-switch-state').textContent,
          activeElement: document.activeElement.id || document.activeElement.tagName,
          noteVisible: !document.getElementById('f02s-note').hidden,
          noteText: document.getElementById('f02s-note-body').textContent.slice(0, 60)
        })""")
        # settle not-saved (failure): value should be restored to OFF
        page.select_option("#f02s-sim-update-outcome", "not-saved")
        page.evaluate("() => document.getElementById('f02s-sim-settle-update').click()")
        time.sleep(0.3)
        failed = g(page, """() => ({
          dataPending: document.getElementById('f02s-switch').getAttribute('data-pending'),
          inputChecked: document.getElementById('f02s-switch-input').checked,
          stateText: document.getElementById('f02s-switch-state').textContent,
          noteState: document.getElementById('f02s-note').getAttribute('data-op-state'),
          noteTitle: document.getElementById('f02s-note-title').textContent,
          checkBtnVisible: !document.getElementById('f02s-check').hidden,
          activeElement: document.activeElement.id || document.activeElement.tagName
        })""")
        # locked switch (disabled originally): settle pending cycle never started — stays disabled
        locked = g(page, "() => ({ lockedDisabled: document.getElementById('f02s-locked-input').disabled })")
        results["D6_f02_switch_pending"] = {"pending": pending, "afterFailedSettle": failed, "locked": locked}
        page.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)

if __name__ == "__main__":
    main()
