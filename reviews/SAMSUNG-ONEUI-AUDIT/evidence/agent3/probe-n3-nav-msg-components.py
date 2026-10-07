# -*- coding: utf-8 -*-
"""Agent 3 — N-probe 3: navigation + messages components/panels (REAL keyboard).
- previews/navigation: appbar geometry, tabs roving + RTL arrows, navbar items,
  actionbar sticky, at 320/360/390/430.
- previews/messages: toast real visibility + timing + manual close + single
  announce channel + dedup; note close button size.
- F03 gateway: empty submit focus/error contract + native validationMessage text.
- SYNTHETIC (labeled): F03 toast geometry vs fixed navbar (DOM-only move in
  probe, source untouched) to inform the CAL-R1-01 fix.
- reduced-motion: layer transition + spinner.
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent3/n3-nav-msg-components.json"
R = {}

def active(page):
    return page.evaluate("document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'body'")

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")
    ctx = browser.new_context(viewport={"width": 360, "height": 800})
    page = ctx.new_page()
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))

    # ============ 1) previews/navigation ============
    page.goto(BASE + "/previews/navigation/", wait_until="networkidle")
    nav = {}
    nav["appbar"] = page.evaluate("""() => {
        const bar = document.querySelector('.m-appbar');
        const btns = Array.from(bar.querySelectorAll('.m-btn'));
        const title = bar.querySelector('.m-appbar__title');
        const r = bar.getBoundingClientRect();
        return {height: r.height,
                buttons: btns.map(b => {const rb=b.getBoundingClientRect();
                    return {id:b.id||'', label:b.getAttribute('aria-label'), w:rb.width, h:rb.height,
                            sideRTL: getComputedStyle(b).direction}}),
                titleFontSize: getComputedStyle(title).fontSize,
                titleWraps: title.getClientRects().length};
    }""")
    # tabs keyboard: Tab reaches only selected; ArrowLeft = next (RTL); panel toggles
    page.focus("#tab-a-btn")
    nav["tabs_focusStart"] = active(page)
    page.keyboard.press("Tab")  # from tab-a, Tab goes to next control (tab-b has tabindex -1)
    nav["tabs_afterTab"] = active(page)
    page.focus("#tab-a-btn")
    page.keyboard.press("ArrowLeft")  # RTL: left = next (tab-b)
    page.wait_for_timeout(150)
    nav["tabs_afterArrowLeft"] = active(page)
    nav["tabs_arrowLeft_selected"] = page.evaluate("document.getElementById('tab-b-btn').getAttribute('aria-selected')")
    nav["tabs_panelB_shown"] = page.evaluate("!document.getElementById('tab-b').hidden")
    page.keyboard.press("ArrowRight")  # back to tab-a
    page.wait_for_timeout(150)
    nav["tabs_afterArrowRight_selected"] = page.evaluate("document.getElementById('tab-a-btn').getAttribute('aria-selected')")
    nav["tabs_tabindexRoaming"] = page.evaluate(
        "[document.getElementById('tab-a-btn').tabIndex, document.getElementById('tab-b-btn').tabIndex]")
    # navbar sample geometry
    nav["navbar"] = page.evaluate("""() => {
        const items = Array.from(document.querySelectorAll('.m-navbar__item'));
        const out = {count: items.length, items: []};
        items.forEach(function (i) {
            const r = i.getBoundingClientRect();
            const svg = i.querySelector('svg');
            out.items.push({label: i.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height),
                hasIcon: !!svg, iconSize: svg ? svg.getBoundingClientRect().width : null,
                current: i.getAttribute('aria-current')});
        });
        return out;
    }""")
    # actionbar sticky geometry at 4 widths
    nav["actionbar_widths"] = {}
    for w in (320, 360, 390, 430):
        page.set_viewport_size({"width": w, "height": 800})
        page.wait_for_timeout(120)
        nav["actionbar_widths"][str(w)] = page.evaluate("""() => {
            const bar = document.querySelector('.m-actionbar');
            const foot = document.getElementById('sticky-foot');
            const last = document.getElementById('last-content');
            const rb = bar.getBoundingClientRect(), rf = foot.getBoundingClientRect(), rl = last.getBoundingClientRect();
            return {barH: Math.round(rb.height), footH: Math.round(rf.height),
                    lastContentAboveFoot: rl.bottom <= rf.top + 1,
                    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth};
        }""")
    R["navigation_panel"] = nav

    # ============ 2) previews/messages ============
    page.set_viewport_size({"width": 360, "height": 800})
    page.goto(BASE + "/previews/messages/", wait_until="networkidle")
    msg = {}
    page.click("[data-toast-demo]")
    page.wait_for_timeout(250)
    msg["toast_visible_rect"] = page.evaluate("""() => {
        const t = document.querySelector('.m-toast');
        const r = t.getBoundingClientRect();
        const cs = getComputedStyle(t);
        return {x:r.x, y:r.y, w:r.width, h:r.height, bottomOffset: Math.round(window.innerHeight - r.bottom),
                display: cs.display, zIndex: cs.zIndex, text: t.querySelector('.m-toast__text').textContent.trim()};
    }""")
    t0 = page.evaluate("performance.now()")
    hidden_after = None
    for _ in range(70):
        page.wait_for_timeout(200)
        if page.evaluate("document.querySelector('.m-toast').hidden"):
            hidden_after = page.evaluate("performance.now()") - t0
            break
    msg["toast_autoDismissMs"] = round(hidden_after) if hidden_after else None
    # manual close timing
    page.click("[data-toast-demo]")
    page.wait_for_timeout(150)
    page.click(".m-toast [data-toast-close]")
    page.wait_for_timeout(100)
    msg["toast_manualClose_hides"] = page.evaluate("document.querySelector('.m-toast').hidden")
    # dedup: repeat same text — region not re-populated
    page.evaluate("window.MicroMessages.announce('نص الاختبار', false)")
    page.wait_for_timeout(120)
    msg["announce_first"] = page.evaluate("document.querySelector('.m-live-region').textContent")
    page.evaluate("document.querySelector('.m-live-region').textContent = ''")  # instrument
    page.evaluate("window.MicroMessages.announce('نص الاختبار', false)")
    page.wait_for_timeout(150)
    msg["announce_repeat_sameText_afterClear"] = page.evaluate("document.querySelector('.m-live-region').textContent")
    msg["liveRegion_channels"] = page.evaluate(
        "document.querySelectorAll('.m-live-region').length + '/toastRoles=' + document.querySelector('.m-toast').getAttribute('role')")
    msg["note_closeButton"] = page.evaluate("""() => {
        const b = document.querySelector('.m-note__close');
        const r = b.getBoundingClientRect();
        return {w:r.width, h:r.height, label: b.getAttribute('aria-label')};
    }""")
    R["messages_panel"] = msg

    # ============ 3) F03 gateway empty submit ============
    page.goto(BASE + "/previews/ux-patterns/mobile-record-sample/", wait_until="networkidle")
    gw = {}
    page.focus("#f03-gw-email")
    page.keyboard.press("Enter")  # submit empty form with real keyboard
    page.wait_for_timeout(300)
    gw = {
        "focusAfterSubmit": active(page),
        "emailAriaInvalid": page.evaluate("document.getElementById('f03-gw-email').getAttribute('aria-invalid')"),
        "emailFieldMsg": page.evaluate("document.getElementById('f03-gw-email').closest('.m-field').querySelector('[data-field-msg]').textContent"),
        "emailValidationMessageNative": page.evaluate("document.getElementById('f03-gw-email').validationMessage"),
        "statusRegion": page.evaluate("document.querySelector('[data-access-status]').textContent"),
        "statusRole": page.evaluate("document.querySelector('[data-access-status]').getAttribute('role')"),
        "errorShownInField": page.evaluate("document.getElementById('f03-gw-email').closest('.m-field').classList.contains('has-error')"),
    }
    R["gateway_empty_submit"] = gw

    # ============ 4) SYNTHETIC: toast geometry vs navbar in F03 ============
    # (probe-only DOM move; no source change; labeled synthetic)
    page.click("#f03-gw-demo")
    page.wait_for_timeout(300)
    syn = page.evaluate("""() => {
        const t = document.getElementById('f03-toast');
        const nav = document.getElementById('f03-navbar');
        t.hidden = false;                     // would be after showToast
        const navR = nav.getBoundingClientRect();
        // temporarily attach to body so the fixed geometry is measurable
        const parent = t.parentElement;
        document.body.appendChild(t);
        const r = t.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(navR.bottom, r.bottom) - Math.max(navR.top, r.top));
        const out = {toastRect: {x:r.x, y:r.y, w:r.width, h:r.height},
                     navbarRect: {y: navR.y, h: navR.height},
                     overlapPx: Math.round(overlap),
                     toastBottomOffset: Math.round(window.innerHeight - r.bottom)};
        parent.appendChild(t); t.hidden = true;   // restore
        return out;
    }""")
    syn["method"] = "SYNTHETIC: moved #f03-toast to body in-probe to reveal fixed geometry (CAL-R1-01 keeps it 0x0); source untouched"
    R["synthetic_toast_vs_navbar"] = syn

    # ============ 5) reduced motion ============
    ctx2 = browser.new_context(viewport={"width": 360, "height": 800},
                               reduced_motion="reduce")
    page2 = ctx2.new_page()
    page2.on("pageerror", lambda e: errs.append("rm:" + str(e)))
    page2.goto(BASE + "/previews/navigation/", wait_until="networkidle")
    page2.click("[data-layer-open='sheet-more']")
    page2.wait_for_timeout(200)
    R["reduced_motion"] = {
        "layerTransition": page2.evaluate("getComputedStyle(document.getElementById('sheet-more')).transitionDuration"),
        "layerTransform": page2.evaluate("getComputedStyle(document.getElementById('sheet-more')).transform"),
        "spinner": None,
    }
    page2.goto(BASE + "/previews/messages/", wait_until="networkidle")
    R["reduced_motion"]["spinner"] = page2.evaluate(
        "getComputedStyle(document.querySelector('.m-wait__spinner')).animationName")
    ctx2.close()

    R["pageErrors"] = errs
    browser.close()

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(R, f, ensure_ascii=False, indent=2)
print(json.dumps(R, ensure_ascii=False, indent=1)[:4500])
