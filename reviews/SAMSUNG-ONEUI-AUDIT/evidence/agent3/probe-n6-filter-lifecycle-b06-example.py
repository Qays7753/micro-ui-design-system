# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 6: filter-lifecycle (F02) contract with REAL keyboard +
messages example-usage (B06 official example) toast/notes checks.
360x800. Playwright + Chromium.
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n6-filter-lifecycle-b06-example.json"
R = {}

def active(page):
    return page.evaluate("document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'body'")

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    page = browser.new_page(viewport={"width": 360, "height": 800})
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))

    # ---- filter-lifecycle ----
    page.goto(BASE + "/previews/ux-patterns/filter-lifecycle/", wait_until="networkidle")
    f = {}
    # apply an impossible filter: active + marked + q=zzz
    page.click("#f02f-filter-btn")
    page.wait_for_timeout(400)
    f["open_focus"] = active(page)
    page.fill("#f02f-q", "zzz")
    page.locator(".f02f-choices .m-choice").nth(0).click()
    page.wait_for_timeout(150)
    f["draft_summary"] = page.evaluate("document.querySelector('[data-filter-summary]').textContent")
    page.click("[data-filter-apply]")
    page.wait_for_timeout(400)
    f["afterApply"] = {
        "layerHidden": page.evaluate("document.getElementById('f02f-filter-layer').hidden"),
        "focus": active(page),
        "counter": page.evaluate("document.getElementById('f02f-filter-count').textContent + '/hidden=' + document.getElementById('f02f-filter-count').hidden"),
        "ariaLabel": page.evaluate("document.getElementById('f02f-filter-btn').getAttribute('aria-label')"),
        "results": page.evaluate("document.getElementById('f02f-results-count').textContent"),
        "noResultsShown": page.evaluate("!document.getElementById('f02f-no-results').hidden"),
        "noResultsText": page.evaluate("document.querySelector('.f02f-empty__text').textContent"),
    }
    # corrective path: تعديل الفلاتر reopens panel with draft from applied
    page.click("#f02f-edit-filters")
    page.wait_for_timeout(400)
    f["editFilters_reopens"] = page.evaluate("!document.getElementById('f02f-filter-layer').hidden")
    f["reopen_focus"] = active(page)
    f["reopen_draft_q"] = page.evaluate("document.getElementById('f02f-q').value")
    f["reopen_draft_active"] = page.evaluate("document.querySelector('[data-filter-key=active]').checked")
    # Escape discards draft only (applied stays: counter remains 2)
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    f["afterEscape"] = {
        "layerHidden": page.evaluate("document.getElementById('f02f-filter-layer').hidden"),
        "focus": active(page),
        "counter": page.evaluate("document.getElementById('f02f-filter-count').textContent + '/hidden=' + document.getElementById('f02f-filter-count').hidden"),
        "results": page.evaluate("document.getElementById('f02f-results-count').textContent"),
    }
    R["filter_lifecycle"] = f

    # ---- B06 messages example-usage (official component example) ----
    page.goto(BASE + "/components/messages/example-usage.html", wait_until="networkidle")
    m = {}
    m["hasToast"] = page.evaluate("!!document.querySelector('.m-toast')")
    # if there is a demo trigger, use it
    trig = page.locator("[data-toast-demo], [data-toast]").first
    if trig.count():
        try:
            trig.click(timeout=2000)
            page.wait_for_timeout(250)
            m["toast_rect"] = page.evaluate("""() => {
                const t = document.querySelector('.m-toast');
                if (!t) return null;
                const r = t.getBoundingClientRect();
                return {w: r.width, h: r.height, hidden: t.hidden, visible: r.width > 0 && r.height > 0};
            }""")
        except Exception as e:
            m["toast_click_error"] = str(e)[:120]
    m["note_roles"] = page.evaluate("""() => Array.from(document.querySelectorAll('.m-note')).map(n =>
        (n.getAttribute('role') || 'no-role') + ':' + n.className.replace('m-note ', ''))""")
    R["messages_example"] = m

    R["pageErrors"] = errs
    browser.close()

with open(OUT, "w", encoding="utf-8") as f2:
    json.dump(R, f2, ensure_ascii=False, indent=2)
print(json.dumps(R, ensure_ascii=False, indent=1))
