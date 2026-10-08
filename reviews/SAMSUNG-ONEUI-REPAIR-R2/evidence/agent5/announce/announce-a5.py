#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A5 المستقل — فحص SUI-R1-03 (سجل هوية الإعلان) على صفحة معاينة الرسائل.

أسلوب الوكيل 5: عدّ «تعبيات» منطقة .m-live-region (انتقال من فراغ إلى نص)
بMutationObserver بدل عدّ سجلات الطفرة الخام — مقياس مستقل عن تشريك
التفريغ/التعبئة. المسارات:
  a) A,A,B = تعبئتان و A,B,A = تعبئتان
  b) بلا id مرتين = تعبئتان
  c) id نفسه بنص مختلف = يُعلن
  d) resetAnnouncements ثم نفس id = يُعلن
  e) 13 هوية ثم الأولى = تُعلن (إقصاء السعة 12)
  f) رقّاع Date.now (+61s) ثم نفس id+نص = يُعلن
  g) assertive/polite يتبدلان على المنطقة
  h) toast يعمل (ظهور + تعبئة إعلان)

الإخراج: announce/announce-a5.json. الخروج غير الصفري عند أي فشل.
NOT RUN: قارئ شاشة صوتي فعلي — القياس DOM بنيوي (إعلان = تعبئة المنطقة).
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
PAGE = f"http://127.0.0.1:{PORT}/previews/messages/index.html"

# يُثبَّت بعد أول announce (المنطقة تنشأ كسولًا)
OBSERVER_JS = """() => {
  const region = document.querySelector('.m-live-region');
  if (!region) return 'no-region';
  window.__fills = 0;
  window.__lastLive = null;
  const mo = new MutationObserver(() => {
    const t = region.textContent;
    if (t !== '') { window.__fills += 1; window.__lastLive = region.getAttribute('aria-live'); }
  });
  mo.observe(region, { childList: true, characterData: true, subtree: true });
  return 'ok';
}"""


def zero_fills(pg):
    pg.evaluate("() => { window.__fills = 0; }")


def serve():
    handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


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
        pg = browser.new_page(viewport={"width": 390, "height": 800})
        pg.goto(PAGE)
        pg.wait_for_timeout(300)

        # إنشاء المنطقة وتركيب العدّاد
        pg.evaluate("() => MicroMessages.announce('تهيئة الفحص', { id: 'init-a5' })")
        pg.wait_for_timeout(120)
        attach = pg.evaluate(OBSERVER_JS)
        check("setup", "منطقة الإعلان تنشأ والعدّاد يُركَّب", attach == "ok", attach)
        pg.evaluate("() => MicroMessages.resetAnnouncements()")

        # ---- (a) A,A,B ثم A,B,A ----
        for seq, name in [([("A", "نص أ"), ("A", "نص أ"), ("B", "نص ب")], "AAB"),
                          ([("A", "نص أ"), ("B", "نص ب"), ("A", "نص أ")], "ABA")]:
            pg.evaluate("() => MicroMessages.resetAnnouncements()")
            zero_fills(pg)
            pg.wait_for_timeout(90)
            for i, (cid, txt) in enumerate(seq):
                pg.evaluate(f"() => MicroMessages.announce({json.dumps(txt, ensure_ascii=False)}, {{ id: {json.dumps(cid)} }})")
                pg.wait_for_timeout(120)
            fills = pg.evaluate("() => window.__fills")
            check(f"a-{name}", f"{name} = تعبئتان (الحدث ذاته يعلن مرة)",
                  fills == 2, {"fills": fills})

        # ---- (b) بلا id مرتين ----
        pg.evaluate("() => MicroMessages.resetAnnouncements()")
        zero_fills(pg)
        pg.wait_for_timeout(90)
        pg.evaluate("() => MicroMessages.announce('حدث مستقل بلا هوية')")
        pg.wait_for_timeout(120)
        pg.evaluate("() => MicroMessages.announce('حدث مستقل بلا هوية')")
        pg.wait_for_timeout(120)
        fills = pg.evaluate("() => window.__fills")
        check("b-no-id", "بلا id مرتين = تعبئتان", fills == 2, {"fills": fills})

        # ---- (c) id نفسه بنص مختلف = يُعلن ----
        pg.evaluate("() => MicroMessages.resetAnnouncements()")
        zero_fills(pg)
        pg.wait_for_timeout(90)
        pg.evaluate("() => MicroMessages.announce('النص الأول', { id: 'X' })")
        pg.wait_for_timeout(120)
        pg.evaluate("() => MicroMessages.announce('النص الثاني المحدّث', { id: 'X' })")
        pg.wait_for_timeout(120)
        fills = pg.evaluate("() => window.__fills")
        last_text = pg.evaluate("() => document.querySelector('.m-live-region').textContent")
        check("c-new-text", "id نفسه بنص مختلف = يُعلن (محدّث المحتوى)",
              fills == 2 and last_text == "النص الثاني المحدّث", {"fills": fills, "last": last_text})

        # ---- (d) reset ثم نفس id = يُعلن ----
        pg.evaluate("() => MicroMessages.resetAnnouncements()")
        zero_fills(pg)
        pg.wait_for_timeout(90)
        pg.evaluate("() => MicroMessages.announce('حدث بعد التهيئة', { id: 'R' })")
        pg.wait_for_timeout(120)
        fills_before = pg.evaluate("() => window.__fills")
        pg.evaluate("() => MicroMessages.announce('حدث بعد التهيئة', { id: 'R' })")
        pg.wait_for_timeout(120)
        fills_mid = pg.evaluate("() => window.__fills")
        pg.evaluate("() => MicroMessages.resetAnnouncements()")
        pg.evaluate("() => MicroMessages.announce('حدث بعد التهيئة', { id: 'R' })")
        pg.wait_for_timeout(120)
        fills_after = pg.evaluate("() => window.__fills")
        check("d-reset", "resetAnnouncements ثم نفس id = يُعلن (والابتلاء قبل الreset مثبت)",
              fills_mid == fills_before + 0 and fills_after == fills_mid + 1,
              {"before": fills_before, "swallowed": fills_mid, "afterReset": fills_after})

        # ---- (e) 13 هوية ثم الأولى = تُعلن (إقصاء السعة 12) ----
        pg.evaluate("() => MicroMessages.resetAnnouncements()")
        zero_fills(pg)
        pg.wait_for_timeout(90)
        pg.evaluate("""() => {
            for (let i = 1; i <= 13; i++) MicroMessages.announce('هوية رقم ' + i, { id: 'cap-' + i });
        }""")
        pg.wait_for_timeout(300)
        fills_13 = pg.evaluate("() => window.__fills")
        pg.evaluate("() => MicroMessages.announce('هوية رقم 1', { id: 'cap-1' })")
        pg.wait_for_timeout(150)
        fills_evict = pg.evaluate("() => window.__fills")
        check("e-capacity", "13 هوية ثم الأولى = تُعلن (إقصاء السعة 12: 13 تعبئة ثم +1)",
              fills_13 == 13 and fills_evict == 14, {"after13": fills_13, "afterFirstRepeat": fills_evict})

        # ---- (f) رقّاع Date.now بزمن+61s ثم نفس id+نص = يُعلن ----
        pg.evaluate("() => MicroMessages.resetAnnouncements()")
        zero_fills(pg)
        pg.wait_for_timeout(90)
        pg.evaluate("() => MicroMessages.announce('حدث العمر الطويل', { id: 'L' })")
        pg.wait_for_timeout(120)
        fills_before = pg.evaluate("() => window.__fills")
        pg.evaluate("() => MicroMessages.announce('حدث العمر الطويل', { id: 'L' })")
        pg.wait_for_timeout(120)
        fills_swall = pg.evaluate("() => window.__fills")
        pg.evaluate("""() => {
            window.__realNow = Date.now;
            Date.now = () => window.__realNow() + 61000;   // تجاوز عمر الهوية 60s
        }""")
        pg.evaluate("() => MicroMessages.announce('حدث العمر الطويل', { id: 'L' })")
        pg.wait_for_timeout(150)
        fills_expired = pg.evaluate("() => window.__fills")
        pg.evaluate("() => { Date.now = window.__realNow; }")
        check("f-lifetime", "نفس id+نص بعد +61s (رقّاع Date.now) = يُعلن",
              fills_swall == fills_before and fills_expired == fills_swall + 1,
              {"before": fills_before, "swallowed": fills_swall, "afterExpiry": fills_expired})

        # ---- (g) assertive/polite يتبدلان ----
        pg.evaluate("() => MicroMessages.announce('إعلان محايد', { id: 'g1' })")
        pg.wait_for_timeout(120)
        polite1 = pg.evaluate("() => document.querySelector('.m-live-region').getAttribute('aria-live')")
        pg.evaluate("() => MicroMessages.announce('إعلان عاجل', { id: 'g2', assertive: true })")
        pg.wait_for_timeout(120)
        assertive = pg.evaluate("() => document.querySelector('.m-live-region').getAttribute('aria-live')")
        pg.evaluate("() => MicroMessages.announce('إعلان محايد ثانٍ', { id: 'g3' })")
        pg.wait_for_timeout(120)
        polite2 = pg.evaluate("() => document.querySelector('.m-live-region').getAttribute('aria-live')")
        check("g-live-toggle", "assertive ثم polite يتبدلان على المنطقة",
              polite1 == "polite" and assertive == "assertive" and polite2 == "polite",
              {"polite1": polite1, "assertive": assertive, "polite2": polite2})

        # ---- (h) toast يعمل ----
        fills_before = pg.evaluate("() => window.__fills")  # دلتا فقط (بلا تصفير)
        pg.click("[data-toast-demo]")
        pg.wait_for_timeout(150)
        toast_state = pg.evaluate("() => { const t = document.querySelector('[data-toast]'); return { hidden: t.hidden, text: t.textContent.trim() }; }")
        fills_toast = pg.evaluate("() => window.__fills")
        check("h-toast", "toast: يظهر ويُعلن عبر المنطقة الحية",
              toast_state["hidden"] is False and fills_toast == fills_before + 1,
              {"toast": toast_state, "fillsBefore": fills_before, "fillsAfter": fills_toast})
        pg.screenshot(path=str(HERE / "announce-toast.png"))

        browser.close()

    out = {"tool": "agent5 announce probe (SUI-R1-03)", "page": PAGE, "checks": results,
           "summary": {"pass": sum(1 for r in results if r["pass"]), "total": len(results)}}
    (HERE / "announce-a5.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"announce: {out['summary']['pass']}/{out['summary']['total']}")
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
