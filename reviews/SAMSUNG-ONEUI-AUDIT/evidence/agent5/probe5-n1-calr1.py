#!/usr/bin/env python3
"""SUI-A5 Agent 5 — independent verification probe 5: N1 + CAL-R1-01 + CAL-R1-02.

N1 claim (Agent 3, P3): after a rejected save in the F03 item form
(window.F03App.arm('save','not-saved') then click حفظ), the visible note is
m-note--error with the corrective text, BUT its role attribute stays "status"
(index.html:490) while the B06 contract (components/messages/specification.md §1)
says warning/error notes must be role=alert. The success note path correctly
uses status.

CAL-R1-01 claim (known-open, extended by Agent 3): #f03-toast shows hidden=false
/ display:flex / position:fixed / z-index 90 with the confirmation text, but
getBoundingClientRect = 0x0 because its ancestor #view-account is display:none
— in BOTH the add-order path and the item-delete path. The live region on body
does carry the announcement.

CAL-R1-02 claim (known-open): in F03 scheduled-orders view the status legend
shows the raw key 'mystery' (from order-store.js seed) — measured ~46.97x19.98px.

My own reproduction: real UI clicks (gateway demo entry, navbar, rows, dialogs)
+ real keyboard typing for the order name. Settle waits per mock-adapter
(ARMED_SETTLE_MS = 2000ms).
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5000"
F03 = BASE + "/previews/ux-patterns/mobile-record-sample/index.html"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe5-n1-calr1.json"

TOAST_SNAP = """() => {
  const t = document.getElementById('f03-toast');
  const r = t.getBoundingClientRect();
  const cs = getComputedStyle(t);
  const acc = document.querySelector('.m-live-region') || document.querySelector('[aria-live]');
  return {
    hidden: t.hidden, display: cs.display, position: cs.position, zIndex: cs.zIndex,
    rect: { w: r.width, h: r.height, x: r.x, y: r.y },
    text: document.getElementById('f03-toast-text').textContent,
    ancestorViewAccountHidden: document.getElementById('view-account').hidden,
    ancestorDisplay: getComputedStyle(document.getElementById('view-account')).display,
    liveRegionText: acc ? acc.textContent.trim() : null,
    visibleElementsWithToastText: [...document.querySelectorAll('body *')].filter(e =>
      e.children.length === 0 && e.textContent.trim() === t.textContent.trim() &&
      e.getBoundingClientRect().width > 0).length,
  };
}"""

OP_NOTE_SNAP = """() => {
  const n = document.getElementById('f03-op-note');
  return {
    hidden: n.hidden, className: n.className, role: n.getAttribute('role'),
    dataOpState: n.getAttribute('data-op-state'),
    title: document.getElementById('f03-op-title').textContent,
    body: document.getElementById('f03-op-body').textContent,
    rect: { w: n.getBoundingClientRect().width, h: n.getBoundingClientRect().height },
  };
}"""

LEGEND_SNAP = """() => {
  const legend = document.querySelector('[data-ocal-legend]');
  if (!legend) return { found: false };
  const items = [...legend.querySelectorAll('.m-legend__item, li, span')].filter(e => e.children.length <= 1);
  const out = [];
  legend.querySelectorAll('*').forEach(e => {
    const t = (e.textContent || '').trim();
    if (t && e.children.length === 0) {
      const r = e.getBoundingClientRect();
      if (r.width > 0) out.push({ text: t, w: +r.width.toFixed(2), h: +r.height.toFixed(2) });
    }
  });
  return { found: true, legendRect: { w: legend.getBoundingClientRect().width, h: legend.getBoundingClientRect().height }, items: out };
}"""

def enter(page):
    page.goto(F03, wait_until="networkidle")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
    page.click("#f03-gw-demo")
    page.wait_for_selector("#view-home:not([hidden])")
    page.wait_for_timeout(400)

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b05ef12284abfc31ad9a1c8633dcd6a058",
        "browser": "Chrome for Testing 143.0.7499.4 (Playwright sync)",
        "settle": "mock-adapter ARMED_SETTLE_MS=2000ms, AUTO_SETTLE_MS=600ms",
    }}
    errs = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)

        # ================= N1: rejected item save -> role stays status =================
        ctx = browser.new_context(viewport={"width": 360, "height": 800})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errs.append("N1:" + str(e)))
        enter(page)
        page.click("#f03-nav-list")
        page.wait_for_selector("#view-list:not([hidden])")
        page.wait_for_timeout(300)
        page.click("#f03-list-rows .f03-row")   # first row -> detail
        page.wait_for_selector("#view-detail:not([hidden])")
        page.wait_for_timeout(300)
        page.click("#f03-detail-edit")          # open edit form
        page.wait_for_selector("#view-form:not([hidden])")
        page.wait_for_timeout(300)
        # arm a known rejection for the NEXT save
        page.evaluate("() => window.F03App.arm('save', 'not-saved')")
        # make the form dirty
        page.fill("#f03-name", "اسم مراجعة مستقل")
        page.wait_for_timeout(150)
        page.click("#f03-save")
        page.wait_for_timeout(2600)  # armed settle 2000ms + margin
        results["N1_rejected_save_op_note"] = page.evaluate(OP_NOTE_SNAP)
        page.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe5-n1-error-note-role-status.png")
        ctx.close()

        # ================= CAL-R1-01 (a): add-order path =================
        ctx2 = browser.new_context(viewport={"width": 360, "height": 800})
        page2 = ctx2.new_page()
        page2.on("pageerror", lambda e: errs.append("CAL1:" + str(e)))
        enter(page2)
        page2.click("#f03-home-schedule")       # home -> scheduled orders view
        page2.wait_for_selector("#view-schedule:not([hidden])")
        page2.wait_for_timeout(500)
        page2.click("#f03-schedule-add")        # open add-order layer
        page2.wait_for_selector("#f03-order-form-layer:not([hidden])")
        page2.wait_for_timeout(300)
        page2.click("#f03-order-name")
        page2.keyboard.type("طلب تحقق مستقل A5")
        page2.wait_for_timeout(150)
        page2.click("#f03-order-save")          # default outcome = saved (auto 600ms)
        page2.wait_for_timeout(1200)
        results["CAL_R1_01_add_order_toast"] = page2.evaluate(TOAST_SNAP)
        results["CAL_R1_01_add_order_after_close"] = page2.evaluate("""() => ({
          currentView: [...document.querySelectorAll('.f03-view')].filter(v => !v.hidden).map(v => v.id),
          layerOpen: !document.getElementById('f03-order-form-layer').hidden,
        })""")
        page2.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe5-calr101-add-order-toast-invisible-360.png")
        ctx2.close()

        # ================= CAL-R1-01 (b): delete-item path =================
        ctx3 = browser.new_context(viewport={"width": 360, "height": 800})
        page3 = ctx3.new_page()
        page3.on("pageerror", lambda e: errs.append("CAL2:" + str(e)))
        enter(page3)
        page3.click("#f03-nav-list")
        page3.wait_for_selector("#view-list:not([hidden])")
        page3.wait_for_timeout(300)
        page3.click("#f03-list-rows .f03-row")
        page3.wait_for_selector("#view-detail:not([hidden])")
        page3.wait_for_timeout(300)
        page3.click("#f03-detail-delete")
        page3.wait_for_selector("#f03-delete-dialog:not([hidden])" if page3.evaluate("() => !!document.getElementById('f03-delete-dialog')") else ".m-layer[role=dialog]:not([hidden])")
        page3.wait_for_timeout(250)
        # confirm delete (the confirm button in the dialog)
        page3.evaluate("""() => {
          const dlg = [...document.querySelectorAll('.m-layer[role=dialog]')].find(d => !d.hidden);
          const btn = [...dlg.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('حذف') && b.type === 'button' && !b.id);
          const conf = document.getElementById('f03-delete-confirm') || btn;
          conf.click();
        }""")
        page3.wait_for_timeout(700)
        results["CAL_R1_01_delete_item_toast"] = page3.evaluate(TOAST_SNAP)
        ctx3.close()

        # ================= CAL-R1-02: mystery in schedule legend =================
        ctx4 = browser.new_context(viewport={"width": 360, "height": 800})
        page4 = ctx4.new_page()
        page4.on("pageerror", lambda e: errs.append("CAL02:" + str(e)))
        enter(page4)
        page4.click("#f03-home-schedule")
        page4.wait_for_selector("#view-schedule:not([hidden])")
        page4.wait_for_timeout(600)
        results["CAL_R1_02_schedule_legend"] = page4.evaluate(LEGEND_SNAP)
        page4.screenshot(path="/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5/probe5-calr102-mystery-legend-360.png")
        ctx4.close()
        browser.close()

    results["pageerrors"] = errs
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)
    print("N1:", json.dumps(results["N1_rejected_save_op_note"], ensure_ascii=False))
    print("CAL-R1-01 add:", json.dumps(results["CAL_R1_01_add_order_toast"], ensure_ascii=False))
    print("CAL-R1-01 del:", json.dumps(results["CAL_R1_01_delete_item_toast"], ensure_ascii=False))
    print("CAL-R1-02:", json.dumps(results["CAL_R1_02_schedule_legend"], ensure_ascii=False))

if __name__ == "__main__":
    main()
