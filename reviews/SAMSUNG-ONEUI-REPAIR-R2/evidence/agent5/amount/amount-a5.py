#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A5 المستقل — فحص SUI-R1-05 (قراءة المبلغ الطويل) بأسلوب الوكيل 5.

آلية التضخيم: TOKX2 (متغيرات الخط الجذرية ×2 على <html> — آلية الوكيل 5
المعلنة، ليست ZOOM2 المنفذ) داخل phone-demo is-320 في لوحة الحقول:
  1) القيمة المنسقة `123,456,789.50` (11 رقمًا/14 محرفًا): clientWidth == scrollWidth
     (تسع سطر المدخل دفعة واحدة) — بلا أي ادعاء لف.
  2) القيمة الخام `123456789012345` (15 رقمًا): scrollWidth > clientWidth
     (تحتاج تمرير تحرير — العقد الصادق).
  3) End → scrollLeft > 0 (الذيل ظاهر) ثم Home → scrollLeft == 0 (البداية ظاهرة)
     بنقرة حقيقية أولًا (التمرير الداخلي يتبع المؤشر بعد تفاعل حقيقي).

الإخراج: amount/amount-a5.json + لقطة. الخروج غير الصفري عند أي فشل.
NOT RUN: أجهزة/لمس/قارئ صوتي — قياس DOM في Chromium headless.
"""
import json
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
PORT = 4481
PAGE = f"http://127.0.0.1:{PORT}/previews/fields/index.html"

COLLECT_TOKENS = """() => {
  const seen = new Map();
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const rule of rules) {
      if (!rule.style) continue;
      for (let i = 0; i < rule.style.length; i++) {
        const p = rule.style[i];
        if (/^--micro-.*-(size|line)$/.test(p) && !seen.has(p)) {
          const v = rule.style.getPropertyValue(p).trim();
          const m = v.match(/^([\\d.]+)px/);
          if (m) seen.set(p, parseFloat(m[1]));
        }
      }
    }
  }
  return [...seen.entries()];
}"""

TOKX2_ON = """(props) => {
  props.forEach(([p, n]) => document.documentElement.style.setProperty(p, (n * 2) + 'px'));
  return props.length;
}"""


def serve():
    handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def digits_chars(value):
    return sum(c.isdigit() for c in value), len(value)


def run():
    results = []
    ok_all = True

    def check(cid, label, ok, detail=None):
        nonlocal ok_all
        results.append({"id": cid, "label": label, "pass": bool(ok), "detail": detail})
        if not ok:
            ok_all = False

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=CHROMIUM, headless=True)
        pg = browser.new_page(viewport={"width": 430, "height": 900})
        pg.goto(PAGE)
        pg.wait_for_timeout(400)
        tokens = pg.evaluate(COLLECT_TOKENS)
        pg.evaluate(TOKX2_ON, tokens)
        pg.wait_for_timeout(300)

        # عد أحرف القيمتين (صدق الوصف)
        d1, c1 = digits_chars("123,456,789.50")
        d2, c2 = digits_chars("123456789012345")
        check("values-desc", "وصف القيمتين: 11 رقمًا/14 محرفًا و15 رقمًا/15 محرفًا",
              (d1, c1, d2, c2) == (11, 14, 15, 15), {"formatted": [d1, c1], "raw": [d2, c2]})

        # 1) القيمة المنسقة تسع سطر المدخل (client == scroll)
        pg.fill("#p-amount-320", "123,456,789.50")
        pg.wait_for_timeout(80)
        m1 = pg.evaluate("""() => {
            const i = document.getElementById('p-amount-320');
            return { client: i.clientWidth, scroll: i.scrollWidth, fontSize: getComputedStyle(i).fontSize,
                     unitWrap: null, parentW: i.parentElement.getBoundingClientRect().width };
        }""")
        check("formatted-fits", "123,456,789.50 (11 رقمًا/14 محرفًا): clientWidth == scrollWidth عند 320+200%",
              abs(m1["client"] - m1["scroll"]) <= 1, m1)

        # 2) القيمة الخام لا تسع (scroll > client)
        pg.fill("#p-amount-320", "123456789012345")
        pg.wait_for_timeout(80)
        m2 = pg.evaluate("() => { const i = document.getElementById('p-amount-320'); return { client: i.clientWidth, scroll: i.scrollWidth }; }")
        check("raw-overflows", "123456789012345 (15 رقمًا): scrollWidth > clientWidth (يحتاج تمرير تحرير)",
              m2["scroll"] > m2["client"], m2)

        # 3) End/Home بنقرة حقيقية أولًا
        pg.click("#p-amount-320")
        pg.keyboard.press("End")
        pg.wait_for_timeout(120)
        e1 = pg.evaluate("""() => {
            const i = document.getElementById('p-amount-320');
            return { scrollLeft: i.scrollLeft, selStart: i.selectionStart, selEnd: i.selectionEnd };
        }""")
        pg.keyboard.press("Home")
        pg.wait_for_timeout(120)
        e2 = pg.evaluate("""() => {
            const i = document.getElementById('p-amount-320');
            return { scrollLeft: i.scrollLeft, selStart: i.selectionStart, selEnd: i.selectionEnd };
        }""")
        check("end-tail", "End: scrollLeft > 0 والمؤشر في النهاية (الذيل ظاهر)",
              e1["scrollLeft"] > 0 and e1["selStart"] == 15, e1)
        check("home-head", "Home: scrollLeft == 0 والمؤشر في البداية (البداية ظاهرة)",
              e2["scrollLeft"] == 0 and e2["selStart"] == 0, e2)

        # 4) الوحدة تلف عند الحاجة (لف الوحدة وحده — المدخل أحادي السطر)
        m3 = pg.evaluate("""() => {
            const i = document.getElementById('p-amount-320');
            const ctrl = i.closest('.m-field__control');
            const unit = ctrl ? ctrl.querySelector('.m-field__unit') : null;
            const row = ctrl ? ctrl.closest('.m-field__row, .m-field') : null;
            return { hasUnit: !!unit, unitRect: unit ? unit.getBoundingClientRect().toJSON() : null,
                     ctrlRect: ctrl ? ctrl.getBoundingClientRect().toJSON() : null,
                     inputTag: i.tagName, inputRows: i.getAttribute('rows'), inputType: i.getAttribute('type') };
        }""")
        check("unit-wrap-structure", "بنية الوحدة موجودة والمدخل أحادي السطر (input بلا rows)",
              m3["hasUnit"] and m3["inputRows"] is None, m3)

        pg.screenshot(path=str(HERE / "amount-320-zoom200.png"))
        browser.close()

    out = {"tool": "agent5 amount probe (SUI-R1-05) — TOKX2", "page": PAGE, "checks": results,
           "summary": {"pass": sum(1 for r in results if r["pass"]), "total": len(results)}}
    (HERE / "amount-a5.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"amount: {out['summary']['pass']}/{out['summary']['total']}")
    for r in results:
        print(f"  [{'PASS' if r['pass'] else 'FAIL'}] {r['id']}: {r['label']}")
        if not r["pass"]:
            print(f"         detail: {json.dumps(r['detail'], ensure_ascii=False)}")
    return 0 if ok_all else 1


if __name__ == "__main__":
    httpd = serve()
    try:
        sys.exit(run())
    finally:
        httpd.shutdown()
