#!/usr/bin/env python3
"""Clean mobile preview gate (2026-10-25 — clean product-like surface contract).

The default entry of previews/ui-system-showcase/index.html must open directly into
the app-like mobile preview (body[data-view="app"]) — not a component catalogue or
State Lab. This gate verifies, on source (http) and standalone (file://):

1. Direct app-like entry: app surface visible; review chrome (header/controls/
   brand-proof/canvas/footer) hidden; no sc-section, no sc-log, no catalog pill
   (STABLE UI / DRAFT FOR REVIEW / PROPOSED), no fixture/debug labels visible.
2. Canonical Samsung Galaxy S25 profile 360×780 CSS px at 100% zoom: no horizontal
   overflow, and no artificial scaling (no zoom/transform scale on the app shell,
   no device frame wrapper).
3. Every catalog component family is mounted in the app surface through a real
   component root (coverage map in APP_FAMILY_SELECTORS).
4. Real navigation works: bottom tabs switch screens; the Calendar switches
   Day/Week/Month and both views derive from the selection.
5. Robustness: 320/390/430 widths and simulated 200% typography at 360 keep the
   page free of horizontal overflow, in RTL and LTR.

Scope: Chromium (Playwright headless) only. No real-device/Safari/screen-reader claims.
Exit 0 when every check passes; otherwise exit 1.
"""
import argparse
import http.server
import json
import tempfile
import threading
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent

# Every catalog family id (docs/COMPONENT-CATALOG.json) mapped to a real component
# root selector mounted inside #app-preview (screens may be hidden while other
# screens are active; presence in the app surface + reachability are what counts).
APP_FAMILY_SELECTORS = {
    "buttons": ".app-screen .m-btn",
    "fields": "#app-ocal-editor .m-field, #app-gateway-root .m-field",
    "selection": ".app-screen .m-switch, .app-screen .m-tabs",
    "organization": ".app-screen .m-section, .app-screen .m-row",
    "data": ".app-screen [data-chart]",
    "messages": "#app-toast.m-toast, .app-screen .m-note",
    "navigation": ".app-topbar.m-appbar, .app-nav.m-navbar, #app-picker-layer.m-layer, #app-dialog-layer.m-layer",
    "surfaces": ".app-screen .m-surface",
    "info-strip": ".app-screen .m-info-card",
    "metric-comparison": "#app-metric[data-main-comparison]",
    "account-settings": "[data-account-settings][data-account-layer-id='app-account-layer']",
    "access-gateway": "#app-gateway-root[data-access-gateway]",
    "order-schedule": "#app-ocal-root[data-ocal-init], #app-ocal-root.m-ocal",
    "carousel": "#app-carousel[data-carousel]",
}

FORBIDDEN_VISIBLE_LABELS = (
    "STABLE UI", "DRAFT FOR REVIEW", "PROPOSED", "PASS", "FAIL",
    "State Lab", "مختبر الحالات", "أدوات مراجعة العرض", "m-ocal", "m-chart",
    "sc-section", "State lab", "FIXTURE",
)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass


def run_suite(page, base_url, label, results, out_dir, capture):
    errors = []

    def check(name, ok, detail=None):
        results.append({"name": f"[{label}] {name}", "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + f"[{label}] {name}")

    page.on("pageerror", lambda err: errors.append(str(err)))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("requestfailed", lambda req: errors.append(req.url))
    page.on("response", lambda res: errors.append(f"{res.status} {res.url}") if res.status >= 400 else None)

    # ---- 1) Direct app-like entry at the canonical S25 viewport ----
    page.set_viewport_size({"width": 360, "height": 780})
    page.goto(base_url, wait_until="load")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(500)
    entry = page.evaluate("""() => {
        const visible = e => !!e && e.getClientRects().length > 0;
        const app = document.getElementById('app-preview');
        const shell = document.querySelector('.app-shell');
        const shellStyle = shell ? getComputedStyle(shell) : null;
        const appText = app ? app.textContent : '';
        return {
            view: document.body.getAttribute('data-view'),
            appVisible: visible(app),
            reviewHidden: ['.showcase-header', '.showcase-controls', '.brand-proof',
                '.showcase-canvas', '.showcase-footer'].every(s => {
                    const e = document.querySelector(s);
                    return !e || getComputedStyle(e).display === 'none';
                }),
            sectionsHidden: Array.from(document.querySelectorAll('.sc-section'))
                .every(s => !visible(s)),
            logsHidden: Array.from(document.querySelectorAll('.sc-log'))
                .every(s => !visible(s)),
            forbiddenLabels: FORBIDDEN_VISIBLE_LABELS.filter(l => appText.includes(l)),
            shellTransform: shellStyle ? shellStyle.transform : null,
            shellZoom: shellStyle ? shellStyle.zoom : null,
            width: document.documentElement.scrollWidth,
            viewport: innerWidth,
            navCount: document.querySelectorAll('.app-nav [data-app-nav-item]').length,
            homeVisible: !document.querySelector('[data-app-screen="home"]').hidden
        };
    }""".replace("FORBIDDEN_VISIBLE_LABELS", json.dumps(list(FORBIDDEN_VISIBLE_LABELS))))
    check("direct entry opens the app-like mobile preview by default",
          entry["view"] == "app" and entry["appVisible"] and entry["homeVisible"], entry)
    check("review chrome and diagnostic surfaces stay out of the clean entry",
          entry["reviewHidden"] and entry["sectionsHidden"] and entry["logsHidden"], entry)
    check("no catalogue/debug labels inside the app surface",
          not entry["forbiddenLabels"], entry["forbiddenLabels"])
    check("no artificial scaling or device frame on the app shell",
          entry["shellTransform"] in ("none", "") and entry["shellZoom"] in ("1", "normal", "", None)
          and not document_frame_present(page), entry)
    check("360x780 app surface has no horizontal page overflow",
          entry["width"] <= entry["viewport"], entry)
    if capture:
        page.screenshot(path=str(out_dir / f"{label}-app-entry-360x780.png"))

    # ---- 2) Family coverage through real component roots ----
    coverage = page.evaluate("""(selectors) => Object.fromEntries(Object.entries(selectors).map(
        ([family, selector]) => [family, document.querySelectorAll('#app-preview ' + selector).length]))""",
        APP_FAMILY_SELECTORS)
    missing = [family for family, count in coverage.items() if count == 0]
    check("every catalog component family mounts a real root in the app surface",
          not missing, {"missing": missing, "counts": coverage})

    # ---- 3) Navigation + Calendar behavior in the app flow ----
    page.click('[data-app-nav-item="orders"]')
    page.wait_for_timeout(350)
    orders_state = page.evaluate("""() => ({
        screen: document.getElementById('app-preview').__appCurrentScreen(),
        title: document.getElementById('app-title').textContent,
        ocalLayout: document.getElementById('app-ocal-root').getAttribute('data-ocal-cal-view'),
        monthLabel: (document.querySelector('#app-ocal-root .m-ocal__month-label') || {}).textContent || null,
        monthYear: (document.querySelector('#app-ocal-root .m-ocal__month-trigger') || {}).textContent || null,
        card: !!document.querySelector('#app-ocal-root .m-ocal__calcard'),
        todayCell: !!document.querySelector('#app-ocal-root [data-ocal-date="2026-10-07"][aria-current="date"]'),
        avatarHidden: document.querySelector('.app-avatar').hidden,
        toggleLabel: (document.querySelector('#app-ocal-root .m-ocal__mode-toggle-text') || {}).textContent || null,
        togglePressed: document.querySelector('#app-ocal-root [data-ocal-action=mode-toggle]').getAttribute('aria-pressed'),
        width: document.documentElement.scrollWidth,
        surfaceText: document.getElementById('app-ocal-root').textContent
    })""")
    AR_MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول',
                 'تشرين الأول', 'تشرين الثاني', 'كانون الأول', 'يناير', 'فبراير', 'مارس', 'أبريل',
                 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                 'August', 'September', 'October', 'November', 'December']
    leaked_months = [m for m in (AR_MONTHS + EN_MONTHS) if m in (orders_state["surfaceText"] or "")]
    check("orders screen opens the real calendar with the numeric month header and no avatar",
          orders_state["screen"] == "orders" and orders_state["title"] == "الطلبات"
          and orders_state["ocalLayout"] == "month" and orders_state["monthLabel"] == "10"
          and "2026" in orders_state["monthYear"] and orders_state["card"]
          and orders_state["todayCell"] and orders_state["avatarHidden"], orders_state)
    check("calendar surface is numeric-only (no visible Arabic or English month names)",
          not leaked_months, {"leaked": leaked_months})
    check("calendar/list mode toggle is present with the truthful calendar-mode label",
          orders_state["toggleLabel"] == "عرض القائمة" and orders_state["togglePressed"] == "false",
          orders_state)
    page.click('#app-ocal-root .m-ocal__viewseg [data-ocal-value="week"]')
    page.wait_for_timeout(250)
    week_state = page.evaluate("""() => ({
        layout: document.getElementById('app-ocal-root').getAttribute('data-ocal-layout'),
        range: document.querySelector('#app-ocal-root .m-ocal__week-range').textContent.trim(),
        cells: document.querySelectorAll('#app-ocal-root [data-ocal-grid] [data-ocal-date]').length
    })""")
    check("week mode is a real state derived from the selection (Sunday-first numeric range)",
          week_state["layout"] == "week-grid" and week_state["cells"] == 7
          and "4–10" in week_state["range"], week_state)
    page.click('#app-ocal-root .m-ocal__viewseg [data-ocal-value="day"]')
    page.wait_for_timeout(250)
    day_state = page.evaluate("""() => ({
        layout: document.getElementById('app-ocal-root').getAttribute('data-ocal-layout'),
        title: document.querySelector('#app-ocal-root .m-ocal__cal-title').textContent.trim()
    })""")
    check("day mode shows the numeric day title",
          day_state["layout"] == "day" and "الأربعاء 07/10/2026" in day_state["title"], day_state)
    page.click('#app-ocal-root .m-ocal__viewseg [data-ocal-value="month"]')
    page.wait_for_timeout(250)
    if capture:
        page.screenshot(path=str(out_dir / f"{label}-app-calendar-month-360.png"))

    # Calendar/List toggle: real state change with truthful aria-pressed
    page.click('#app-ocal-root [data-ocal-action="mode-toggle"]')
    page.wait_for_timeout(300)
    list_state = page.evaluate("""() => ({
        view: document.getElementById('app-ocal-root').getAttribute('data-ocal-view'),
        pressed: document.querySelector('#app-ocal-root [data-ocal-action=mode-toggle]').getAttribute('aria-pressed'),
        label: document.querySelector('#app-ocal-root .m-ocal__mode-toggle-text').textContent,
        viewseg: !!document.querySelector('#app-ocal-root .m-ocal__viewseg'),
        sections: [...document.querySelectorAll('#app-ocal-root .m-ocal__list-heading')].map(e => e.textContent.trim()),
        rows: document.querySelectorAll('#app-ocal-root [data-ocal-action=order-row]').length,
        width: document.documentElement.scrollWidth
    })""")
    check("calendar/list toggle switches to the real list surface (same orders, no viewseg)",
          list_state["view"] == "list" and list_state["pressed"] == "true"
          and list_state["label"] == "عرض التقويم" and not list_state["viewseg"]
          and any('القادمة' in s for s in list_state["sections"])
          and list_state["rows"] >= 6 and list_state["width"] <= 360, list_state)
    if capture:
        page.screenshot(path=str(out_dir / f"{label}-app-calendar-list-360.png"))
    # Inline accordion in list mode: expand one order with its actions in-row
    page.click('#app-ocal-root [data-ocal-action="order-row"]')
    page.wait_for_timeout(300)
    acc_list = page.evaluate("""() => {
        const r = document.getElementById('app-ocal-root');
        const trig = r.querySelector('[data-ocal-action=order-row]');
        const panel = r.querySelector('[data-ocal-rowpanel]:not([hidden])');
        return {
            expanded: trig.getAttribute('aria-expanded'),
            panelRole: panel ? panel.getAttribute('role') : null,
            panelInsideRow: panel ? !!panel.closest('.m-ocal__rowitem').querySelector('[data-ocal-action=order-row]') : false,
            visiblePanels: r.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length,
            editBtn: !!panel.querySelector('[data-ocal-action=order-edit]'),
            deleteBtn: !!panel.querySelector('[data-ocal-action=order-delete]')
        };
    }""")
    check("order row expands inline in list mode (region inside the row with edit/delete)",
          acc_list["expanded"] == "true" and acc_list["panelRole"] == "region"
          and acc_list["panelInsideRow"] and acc_list["visiblePanels"] == 1
          and acc_list["editBtn"] and acc_list["deleteBtn"], acc_list)
    # Back to calendar; the selection is preserved
    page.click('#app-ocal-root [data-ocal-action="mode-toggle"]')
    page.wait_for_timeout(300)
    back_cal = page.evaluate("""() => ({
        view: document.getElementById('app-ocal-root').getAttribute('data-ocal-view'),
        selected: document.getElementById('app-ocal-root').getAttribute('data-ocal-selected-date'),
        viewseg: !!document.querySelector('#app-ocal-root .m-ocal__viewseg'),
        pressed: document.querySelector('#app-ocal-root [data-ocal-action=mode-toggle]').getAttribute('aria-pressed')
    })""")
    check("calendar/list toggle returns to calendar preserving the selected day",
          back_cal["view"] == "calendar" and back_cal["selected"] == "2026-10-07"
          and back_cal["viewseg"] and back_cal["pressed"] == "false", back_cal)

    # Inline accordion in calendar mode + host edit/delete flows.
    # (The row expanded in list mode stays expanded — clicking the SECOND
    #  row demonstrates the single-open switch instead of collapsing.)
    page.locator('#app-ocal-root [data-ocal-action="order-row"]').nth(1).click()
    page.wait_for_timeout(300)
    acc_cal = page.evaluate("""() => {
        const r = document.getElementById('app-ocal-root');
        const trig = r.querySelector('[data-ocal-action=order-row][aria-expanded=true]');
        const panel = r.querySelector('[data-ocal-rowpanel]:not([hidden])');
        return {
            expanded: trig ? trig.getAttribute('aria-expanded') : null,
            visiblePanels: r.querySelectorAll('[data-ocal-rowpanel]:not([hidden])').length,
            editVisible: !!panel.querySelector('[data-ocal-action=order-edit]'),
            detailsText: panel ? panel.textContent : ''
        };
    }""")
    check("order row expands inline in calendar mode with numeric details in-row",
          acc_cal["expanded"] == "true" and acc_cal["visiblePanels"] == 1
          and acc_cal["editVisible"] and '/2026' in acc_cal["detailsText"], acc_cal)
    page.click('#app-ocal-root [data-ocal-rowpanel]:not([hidden]) [data-ocal-action="order-edit"]')
    page.wait_for_timeout(300)
    editor_from_row = page.evaluate("""() => ({
        open: !document.getElementById('app-ocal-editor').hidden,
        stillExpanded: (document.querySelector('#app-ocal-root [data-ocal-action=order-row][aria-expanded=true]') || {}).getAttribute('data-ocal-id') || null
    })""")
    check("in-row edit action opens the host editor without collapsing the row",
          editor_from_row["open"] and editor_from_row["stillExpanded"] == "od-01", editor_from_row)
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    page.click('#app-ocal-root [data-ocal-rowpanel]:not([hidden]) [data-ocal-action="order-delete"]')
    page.wait_for_timeout(350)
    dialog_state2 = page.evaluate("""() => ({
        open: !document.getElementById('app-dialog-layer').hidden,
        text: document.getElementById('app-dialog-text').textContent,
        rows: document.querySelectorAll('#app-ocal-root [data-ocal-action=order-row]').length
    })""")
    check("in-row delete action opens the existing confirmation dialog",
          dialog_state2["open"] and 'لا يمكن التراجع' in dialog_state2["text"], dialog_state2)
    page.click('#app-dialog-confirm')
    page.wait_for_timeout(350)
    after_confirm = page.evaluate("""() => ({
        closed: document.getElementById('app-dialog-layer').hidden,
        rows: document.querySelectorAll('#app-ocal-root [data-ocal-action=order-row]').length
    })""")
    check("confirming the dialog deletes the order and collapses it honestly",
          after_confirm["closed"] and after_confirm["rows"] == dialog_state2["rows"] - 1, after_confirm)

    # Editor + overlays reachable in the flow
    page.click('#app-ocal-root [data-ocal-action="add"]')
    page.wait_for_timeout(250)
    editor_open = page.evaluate("!document.getElementById('app-ocal-editor').hidden")
    check("add action opens the in-page order editor (fields family, host-owned)",
          editor_open, {})
    page.keyboard.press("Escape")
    page.wait_for_timeout(150)

    page.click('[data-app-nav-item="reports"]')
    page.wait_for_timeout(500)
    reports_state = page.evaluate("""() => ({
        bars: !!document.querySelector('#app-chart-bars [data-plot] svg'),
        line: !!document.querySelector('#app-chart-line [data-plot] svg'),
        width: document.documentElement.scrollWidth
    })""")
    check("reports screen renders charts after reveal without overflow",
          reports_state["bars"] and reports_state["line"]
          and reports_state["width"] <= 360, reports_state)
    page.click('#app-tab-mix-btn')
    page.wait_for_timeout(400)
    mix_state = page.evaluate("""() => ({
        donut: !!document.querySelector('#app-tab-mix #app-chart-donut [data-plot] svg'),
        nodata: document.getElementById('app-chart-nodata').getAttribute('data-scale-state'),
        summary: document.querySelector('#app-chart-nodata [data-summary]').textContent.trim().length
    })""")
    check("distribution tab renders the donut and keeps the honest no-data state",
          mix_state["donut"] and mix_state["nodata"] == "empty" and mix_state["summary"] > 0,
          mix_state)
    if capture:
        page.screenshot(path=str(out_dir / f"{label}-app-reports-360.png"))

    page.click('[data-app-nav-item="account"]')
    page.wait_for_timeout(250)
    page.click('#app-account-open')
    page.wait_for_timeout(350)
    dialog_state = page.evaluate("""() => ({
        open: !document.getElementById('app-account-layer').hidden,
        focusIn: document.getElementById('app-account-layer').contains(document.activeElement)
    })""")
    check("account settings dialog opens with focus trapped inside",
          dialog_state["open"] and dialog_state["focusIn"], dialog_state)
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    page.click('#app-signin-open')
    page.wait_for_timeout(300)
    signin_state = page.evaluate("""() => ({
        screen: document.getElementById('app-preview').__appCurrentScreen(),
        back: !document.querySelector('[data-app-back]').hidden,
        gateway: !!document.querySelector('#app-gateway-root [data-access-form]')
    })""")
    check("sign-in surface is reachable from the account screen with a back path",
          signin_state["screen"] == "signin" and signin_state["back"]
          and signin_state["gateway"], signin_state)
    page.click('[data-app-back]')
    page.wait_for_timeout(250)
    if capture:
        page.screenshot(path=str(out_dir / f"{label}-app-account-360.png"))

    # Full Component Showcase reachable from the clean app (no hidden anchors):
    # one clearly labelled row in the account screen opens the state view with
    # every catalog section; the showcase header link returns to the app.
    page.click('#app-showcase-open')
    page.wait_for_timeout(450)
    showcase_state = page.evaluate("""() => ({
        view: document.body.getAttribute('data-view'),
        sections: document.querySelectorAll('.sc-section').length,
        visibleSections: [...document.querySelectorAll('.sc-section')]
          .filter(s => s.getClientRects().length > 0).length,
        headerNav: !!document.querySelector('.showcase-header [data-showcase-view=app]'),
        ocalTools: document.querySelectorAll('#sc-ocal-root').length
    })""")
    check("full component showcase is reachable from the account screen (all sections, no hidden anchor)",
          showcase_state["view"] == "state" and showcase_state["sections"] >= 14
          and showcase_state["visibleSections"] >= 14
          and showcase_state["headerNav"] and showcase_state["ocalTools"] == 1,
          showcase_state)
    if capture:
        page.screenshot(path=str(out_dir / f"{label}-full-showcase-360.png"))
    page.click('.showcase-header [data-showcase-view="app"]')
    page.wait_for_timeout(350)
    back_app = page.evaluate("""() => ({
        view: document.body.getAttribute('data-view'),
        appVisible: document.getElementById('app-preview').getClientRects().length > 0
    })""")
    check("showcase header returns to the clean app preview",
          back_app["view"] == "app" and back_app["appVisible"], back_app)

    # ---- 4) Robustness: widths × directions + simulated 200% typography ----
    for direction in ("rtl", "ltr"):
        for width in (320, 360, 390, 430):
            page.set_viewport_size({"width": width, "height": 780})
            page.goto(base_url, wait_until="load")
            page.evaluate("document.fonts.ready")
            page.evaluate(f"document.documentElement.setAttribute('dir', '{direction}')")
            page.wait_for_timeout(350)
            state = page.evaluate("""(direction) => ({
                dir: document.documentElement.getAttribute('dir'),
                width: document.documentElement.scrollWidth,
                viewport: innerWidth,
                appVisible: document.getElementById('app-preview').getClientRects().length > 0,
                firstWeekday: (document.querySelector('#app-ocal-root .m-ocal__weekday') || {}).textContent || null,
                monthLabel: (document.querySelector('#app-ocal-root .m-ocal__month-label') || {}).textContent || null
            })""", direction)
            check(f"{direction} {width}px: app surface renders without horizontal overflow",
                  state["width"] <= state["viewport"] and state["appVisible"], state)
            if capture and width == 360:
                page.screenshot(path=str(out_dir / f"{label}-app-360-{direction}.png"))
        # Simulated 200% typography at the canonical viewport
        page.set_viewport_size({"width": 360, "height": 780})
        page.goto(base_url, wait_until="load")
        page.evaluate("document.fonts.ready")
        # نفس عقد محاكاة النص ×2 في أدوات المشروع: مضاعفة الحجم المحسوب
        # الحالي لكل عنصر بقيم px صريحة — لا تفاعل تراكمي عبر التعشيش.
        page.evaluate("""() => {
            document.querySelectorAll('#app-preview, #app-preview *').forEach(e => {
                const size = parseFloat(getComputedStyle(e).fontSize);
                if (Number.isFinite(size) && size > 0) e.style.fontSize = (size * 2) + 'px';
            });
        }""")
        page.wait_for_timeout(300)
        big = page.evaluate("""() => ({
            width: document.documentElement.scrollWidth,
            viewport: innerWidth,
            appVisible: document.getElementById('app-preview').getClientRects().length > 0
        })""")
        check(f"{direction}: simulated 200% typography keeps the app surface overflow-free",
              big["width"] <= big["viewport"] and big["appVisible"], big)

    check("no console, page, or resource errors in the app flow", not errors, errors[:6])


def document_frame_present(page):
    return page.evaluate(
        "() => !!document.querySelector('.app-shell') && "
        "!!document.querySelector('.app-shell').closest('.phone, .device-frame, [data-device-frame]')")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--capture-dir", type=Path, default=None,
                        help="save canonical 360x780 evidence screenshots to this directory")
    args = parser.parse_args()
    out_dir = args.capture_dir
    if out_dir:
        out_dir.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/previews/ui-system-showcase/index.html"
    results = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            page = browser.new_page(viewport={"width": 360, "height": 780})
            run_suite(page, base, "source", results, out_dir, bool(out_dir))
            standalone = (ROOT / "previews/ui-system-showcase/standalone.html").as_uri()
            page2 = browser.new_page(viewport={"width": 360, "height": 780})
            run_suite(page2, standalone, "standalone", results, out_dir, bool(out_dir))
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    passed = sum(row["passed"] for row in results)
    total = len(results)
    report = {"passed": passed, "failed": total - passed, "total": total,
              "scope": "Light-only, Chromium, source plus file:// standalone; canonical 360x780 S25 profile",
              "checks": results}
    output = Path(tempfile.gettempdir()) / "micro-clean-mobile-preview-check.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{passed} PASS / {total - passed} FAIL — report {output}")
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
