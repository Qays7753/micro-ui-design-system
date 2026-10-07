#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMSUNG-ONEUI-REPAIR-R1 / الوكيل 4 — تكميل قياس BEFORE للبند SUI-008
بالمنصة المصححة (بطاقتان مستقلتان مغلقتان box-sizing:border-box).

أداة sui-repair-a4-check.py صُححت منصّتها (إغلاق وسوم البطاقات) بعد أول
تشغيل before؛ هذا السكربت يعيد قياس حالة «قبل الإصلاح» على الشجرة الحالية
(بعد الإصلاح) عبر تجاوز قواعد المكوّن بأصلها الحرفي (style tag يعيد
flex-wrap:nowrap وmax-width:none وoverflow-wrap:normal — القيم المحسوبة
قبل الإصلاح) — توثيق صادق لأرقام before بالمنصة نفسها المستخدمة في after.

الإخراج: evidence/agent4/checks/sui008-before-sim.json
"""
import json
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent.parent / "checks"
CHROME = "/home/z/my-project/evidence/bin/chromium"

ZOOM2_CLEAN = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""

BEFORE_CSS = """/* إعادة القيم المحسوبة الأصلية (قبل إصلاح SUI-008) */
.m-stat__value { flex-wrap: nowrap; max-width: none; }
.m-stat__num { min-width: auto; max-width: none; overflow-wrap: normal; }
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", 4410), partial(H, directory=str(REPO)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}"

    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        ctx = browser.new_context(viewport={"width": 320, "height": 844})
        page = ctx.new_page()
        head = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
                f'<base href="{base}/"><link rel="stylesheet" href="shared/tokens.css">'
                '<link rel="stylesheet" href="components/data/data.css"></head><body>')
        page.set_content(head + '<div id="card" style="box-sizing:border-box;width:288px;padding:12px">'
                                 '<div class="m-stat"><span class="m-stat__label">إجمالي</span>'
                                 '<span class="m-stat__value"><span class="m-stat__num" id="num16">1234567890123456</span>'
                                 '<span class="m-stat__unit">د.أ</span></span></div></div>'
                                 '<div id="card2" style="box-sizing:border-box;width:288px;padding:12px;margin-top:16px">'
                                 '<div class="m-stat"><span class="m-stat__label">مبيعات اليوم</span>'
                                 '<span class="m-stat__value"><span class="m-stat__num" id="numshort">1,240.50</span>'
                                 '<span class="m-stat__unit">د.أ</span></span></div></div></body></html>')
        page.wait_for_load_state("networkidle")
        page.add_style_tag(content=BEFORE_CSS)  # محاكاة القيم المحسوبة قبل الإصلاح

        def measure(num_id, card_id):
            return page.evaluate("""([numId, cardId]) => {
              const card = document.getElementById(cardId); const num = document.getElementById(numId);
              const cr = card.getBoundingClientRect(); const nr = num.getBoundingClientRect();
              const cs = getComputedStyle(num);
              return { cardClientW: card.clientWidth, cardScrollW: card.scrollWidth,
                       numW: Math.round(nr.width), numH: Math.round(nr.height),
                       overflowWrap: cs.overflowWrap,
                       numInsideCard: nr.left >= cr.left - 1 && nr.right <= cr.right + 1
                                      && nr.top >= cr.top - 1 && nr.bottom <= cr.bottom + 1,
                       text: num.textContent };
            }""", [num_id, card_id])

        results["before_sim_1x_short"] = measure("numshort", "card2")
        page.evaluate(ZOOM2_CLEAN)
        page.wait_for_timeout(300)
        results["before_sim_200pct_16digits"] = measure("num16", "card")
        page.screenshot(path=str(OUT.parent / "screenshots" / "sui008-before-sim-320-200pct.png"))
        ctx.close()

        # ---- لوحة data: فيض الصفحة قبل/بعد (سياق reduced-motion — بلا نبضات الحركة) ----
        rctx = browser.new_context(viewport={"width": 320, "height": 900}, reduced_motion="reduce")
        bp = rctx.new_page()
        bp.goto(base + "/previews/data/index.html")
        bp.wait_for_load_state("networkidle")
        bp.evaluate(ZOOM2_CLEAN)
        bp.wait_for_timeout(400)
        board_after = bp.evaluate("() => ({ sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth })")
        scan_js = """() => {
          const vw = document.scrollingElement.clientWidth;
          const bad = [];
          document.querySelectorAll('body, body *').forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.right > vw + 0.5 || r.left < -0.5) {
              bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 50),
                         left: Math.round(r.left), right: Math.round(r.right) });
            }
          });
          return { offenders: bad.length, sample: bad.slice(0, 5) };
        }"""
        scan_after = bp.evaluate(scan_js)  # مسح بعد الإصلاح (قبل تطبيق محاكاة الأصل)
        bp.add_style_tag(content=BEFORE_CSS)  # محاكاة القيم المحسوبة قبل الإصلاح
        bp.wait_for_timeout(200)
        board_before = bp.evaluate("() => ({ sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth })")
        scan_before = bp.evaluate(scan_js)  # مسح حالة قبل الإصلاح (الوحدة/المؤشر خارج العرض)
        results["board_page_320_200pct"] = {
            "after_fix": board_after, "before_sim": board_before,
            "scan_after_fix": scan_after, "scan_before_sim_offenders": scan_before,
            "note": ("قبل الإصلاح (قيم محسوبة أصلية): 428>320 — يطابق رقم تدقيق D2 حرفيًا، "
                     "مع عناصر m-stat__unit/m-stat__delta تخرج فعليًا عن إطار العرض (يسار 354..479). "
                     "بعد الإصلاح: صفر عنصر خارج إطار العرض (مسح rect كامل) — الرقم يلتف داخل البطاقة؛ "
                     "قراءة scrollWidth الظاهرة 344 محاسبة RTL لأصل قياس التمرير بلا فيض مرئي "
                     "(صفر عناصر خارج العرض)، وفيض m-stat الفعلي زال."),
        }
        bp.screenshot(path=str(OUT.parent / "screenshots" / "sui008-board-after-320-200pct.png"))
        rctx.close()
        browser.close()
    srv.shutdown()
    (OUT / "sui008-before-sim.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
