# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 1: CAL-R1-01/02 verification on F03 (a5500c9).

Measures actual visibility of #f03-toast after each save/delete flow that
calls showToast(), the announcement channel, and the schedule legend text
(CAL-R1-02). REAL keyboard for form submission (Enter).
Method: Playwright sync + Chromium (Chrome for Testing) via
tools/preview-server.py (port 5000, unmodified).
"""
import json, sys, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n1-f03-toast-cals.json"

def toast_state(page):
    return page.evaluate("""() => {
        const t = document.getElementById('f03-toast');
        if (!t) return {found:false};
        const r = t.getBoundingClientRect();
        const cs = getComputedStyle(t);
        const view = document.getElementById('view-account');
        return {
            found: true,
            hiddenAttr: t.hidden,
            rect: {x:r.x, y:r.y, w:r.width, h:r.height},
            display: cs.display, position: cs.position, zIndex: cs.zIndex,
            text: (t.querySelector('.m-toast__text')||{}).textContent || '',
            parentViewId: t.parentElement ? t.parentElement.id : null,
            parentViewHidden: view ? view.hidden : null,
            opacity: cs.opacity, visibility: cs.visibility
        };
    }""")

def live_region(page):
    return page.evaluate("""() => {
        const lr = document.querySelector('.m-live-region');
        return lr ? {text: lr.textContent, ariaLive: lr.getAttribute('aria-live'),
                     ariaAtomic: lr.getAttribute('aria-atomic'),
                     parent: lr.parentElement && lr.parentElement.tagName} : null;
    }""")

def visible_text_contains(page, needle):
    return page.evaluate("""(needle) => {
        // any element with non-zero size whose text contains needle
        const els = Array.from(document.querySelectorAll('body *'));
        for (const el of els) {
            if (el.children.length) continue;
            const t = (el.textContent || '');
            if (t.includes(needle)) {
                const r = el.getBoundingClientRect();
                if (r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none'
                    && !el.closest('[hidden]')) return {found:true, tag:el.tagName, id:el.id, w:r.width, h:r.height};
            }
        }
        return {found:false};
    }""", needle)

results = {"viewport": "360x800", "flows": {}}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium",
                                args=["--force-prefers-reduced-motion-no-preference"])
    page = browser.new_page(viewport={"width": 360, "height": 800})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(F03, wait_until="networkidle")

    # --- 0) gateway entry (demo provider button = one tap path) ---
    demo_btn = page.locator("#f03-gw-demo")
    results["gateway"] = {
        "demoButtonVisible": demo_btn.is_visible(),
        "navbarHiddenAtGateway": page.evaluate("document.getElementById('f03-navbar').hidden"),
    }
    demo_btn.click()
    page.wait_for_timeout(300)
    results["gateway"]["viewAfterLogin"] = page.evaluate(
        "Array.from(document.querySelectorAll('.f03-view')).find(v=>!v.hidden)?.id")
    results["gateway"]["navbarHiddenAfterLogin"] = page.evaluate(
        "document.getElementById('f03-navbar').hidden")
    results["gateway"]["navbarItems"] = page.evaluate(
        "document.querySelectorAll('#f03-navbar .m-navbar__item').length")
    results["gateway"]["focusAfterLogin"] = page.evaluate(
        "document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : null")

    # --- 1) CAL-R1-01: schedule -> add order -> save -> toast ---
    page.click("#f03-home-schedule")
    page.wait_for_timeout(200)
    results["flows"]["view"] = page.evaluate(
        "Array.from(document.querySelectorAll('.f03-view')).find(v=>!v.hidden)?.id")
    page.click("#f03-schedule-add")
    page.wait_for_timeout(400)
    # REAL keyboard: type name then Enter to submit the order form
    page.keyboard.type("طلب قياس النافذة")
    page.wait_for_timeout(100)
    page.keyboard.press("Enter")
    page.wait_for_timeout(900)  # save promise resolves (600ms) + layer close
    results["flows"]["cal_r1_01_order_save"] = {
        "toast": toast_state(page),
        "liveRegion": live_region(page),
        "visibleTextAnywhere": visible_text_contains(page, "تمت إضافة الطلب."),
        "layerOpenAfterSave": page.evaluate("!document.getElementById('f03-order-form-layer').hidden"),
        "focusAfterSave": page.evaluate(
            "document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : null"),
    }

    # --- 2) delete single item from list -> toast (second showToast caller) ---
    page.click("#f03-schedule-back")  # schedule is a sub-view: navbar hidden there
    page.wait_for_timeout(300)
    page.click("#f03-nav-list")
    page.wait_for_timeout(300)
    first_row = page.locator("#f03-list-rows .f03-row").first
    first_row.click()
    page.wait_for_timeout(300)
    page.click("#f03-detail-delete")
    page.wait_for_timeout(400)
    page.click("#f03-delete-confirm")
    page.wait_for_timeout(900)
    results["flows"]["delete_item_toast"] = {
        "view": page.evaluate("Array.from(document.querySelectorAll('.f03-view')).find(v=>!v.hidden)?.id"),
        "toast": toast_state(page),
        "liveRegion": live_region(page),
        "visibleTextAnywhere": visible_text_contains(page, "تم حذف العنصر."),
    }

    # --- 3) CAL-R1-02: schedule legend raw key ---
    page.click("#f03-nav-home")
    page.wait_for_timeout(300)
    page.click("#f03-home-schedule")
    page.wait_for_timeout(600)
    # legend is scoped to displayed month (2026-10 default); od-10 is 10-15
    legend = page.evaluate("""() => {
        const leg = document.querySelector('#f03-ocal [data-ocal-legend]');
        if (!leg) return {found:false};
        const r = leg.getBoundingClientRect();
        return {found:true, items: Array.from(leg.querySelectorAll('.m-ocal__legend-label')).map(e=>e.textContent),
                rect:{x:r.x,y:r.y,w:r.width,h:r.height},
                visible: r.width>0 && r.height>0};
    }""")
    results["flows"]["cal_r1_02_legend"] = legend
    # also find the order row/chip for od-10 in the list screen
    mystery_chip = page.evaluate("""() => {
        const cells = Array.from(document.querySelectorAll('#f03-ocal *'));
        const hits = cells.filter(e => (e.textContent||'') === 'mystery' && e.children.length===0);
        return hits.map(e => {const r=e.getBoundingClientRect();
            return {tag:e.tagName, cls:e.className, w:r.width, h:r.height,
                     visible: r.width>0 && r.height>0 && getComputedStyle(e).display!=='none'};});
    }""")
    results["flows"]["cal_r1_02_mystery_nodes"] = mystery_chip

    # --- 4) screenshots of the two states (relevant state visible) ---
    # 4a: right after order save toast should be visible — redo the flow for a clean shot
    page.click("#f03-schedule-add")
    page.wait_for_timeout(400)
    page.keyboard.type("طلب ثانٍ للتحقق")
    page.keyboard.press("Enter")
    page.wait_for_timeout(900)
    page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/f03-360-order-save-toast-state.png")
    # 4b: schedule legend with mystery
    page.click("#f03-schedule-back")
    page.wait_for_timeout(600)
    page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/f03-360-schedule-legend-mystery.png")

    results["pageErrors"] = errors
    browser.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(json.dumps({k: (v if k != "flows" else {kk: (str(vv)[:300]) for kk, vv in v.items()}) for k, v in results.items()},
                 ensure_ascii=False, indent=1)[:3500])
