#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A5 المستقل — فحص SUI-R1-01 (بوابة الدخول) بأسلوب الوكيل 5.

سبعة مسارات مقيسة على مكوّن المصدر الحالي عبر حاضنة خاصة:
  a) onSubmit مؤجل يرجع {authenticated:false, message} — الرسالة حرفيًا بنبرة error.
  b) معالج undefined + مستمع micro-access:submitted يكتب رسالة — الكلمة الأخيرة للمستمع.
  c) مزوّد يرجع {ok:true} — نص محايد بلا ادعاء نجاح.
  d) رفض — رسالة الخطأ بنبرة error.
  e) طلبان أثناء busy — معالج واحد.
  f) لا تخزين كلمة مرور (detail/سمات/dataset/مخازن).
  g) onRecovery بلا message — لا ادعاء إرسال.

الإخراج: gateway/gateway-a5.json + لقطات PNG مفصلية. الخروج غير الصفري عند أي فشل.
NOT RUN: أجهزة/لمس/قارئات صوتية/WebKit — القياس DOM برمجي في Chromium headless.
"""
import json
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]          # جذر worktree (أدلة الوكيل 5 تحت reviews/.../evidence/agent5)
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
PORT = 4481
URL = f"http://127.0.0.1:{PORT}/reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent5/gateway/gateway-harness.html"

EMAIL = "a5@example.com"
PASSWORD = "S3cretA5Pass"


def serve():
    handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def fill_and_submit(page):
    page.fill("#gw-email", EMAIL)
    page.fill("#gw-password", PASSWORD)
    page.click("button[type=submit]")


def status_state(page):
    return page.evaluate(
        "() => { const s = document.querySelector('[data-access-status]');"
        " return { text: s.textContent, tone: s.getAttribute('data-tone') }; }"
    )


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

        # ---- (a) onSubmit مؤجل: {authenticated:false, message} ----
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("() => { const gw = document.querySelector('[data-access-gateway]'); MicroAccessGateway.init(gw, { onSubmit: () => new Promise(r => setTimeout(() => r({ authenticated: false, message: 'لم يتم الدخول إلى الحساب التجريبي.' }), 150)) }); }")
        busy_during = {}
        pg.evaluate("window.__submitted = 0; document.addEventListener('micro-access:submitted', e => { window.__submitted++; window.__detail = e.detail; })")
        fill_and_submit(pg)
        busy_during = pg.evaluate("() => ({ busy: document.querySelector('[data-access-form]').dataset.microAccessBusy, aria: document.querySelector('[data-access-form]').getAttribute('aria-busy'), mid: document.querySelector('[data-access-status]').textContent })")
        pg.wait_for_timeout(400)
        st = status_state(pg)
        check("a-msg", "الرسالة تبقى حرفيًا بنبرة error بعد التأخير",
              st["text"] == "لم يتم الدخول إلى الحساب التجريبي." and st["tone"] == "error", st)
        check("a-busy", "حالة المشغول أثناء المعالجة (busy=true + جارٍ التحقق)",
              busy_during.get("busy") == "true" and busy_during.get("aria") == "true" and busy_during.get("mid") == "جارٍ التحقق من بيانات الدخول…", busy_during)
        pg.screenshot(path=str(HERE / "gateway-a-error.png"), full_page=True)
        pg.close()

        # ---- (b) undefined + مستمع يكتب — الكلمة الأخيرة للمستمع ----
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("""() => {
            const gw = document.querySelector('[data-access-gateway]');
            MicroAccessGateway.init(gw, { onSubmit: () => Promise.resolve(undefined) });
            window.__ev = [];
            document.addEventListener('micro-access:submitted', e => {
              window.__ev.push({ detail: JSON.stringify(e.detail) });
              document.querySelector('[data-access-status]').textContent = 'رسالة المستهلك النهائية: الدخول معلّق بانتظار التطبيق.';
            });
        }""")
        fill_and_submit(pg)
        pg.wait_for_timeout(250)
        st = status_state(pg)
        ev = pg.evaluate("() => window.__ev")
        check("b-final", "الكلمة الأخيرة لمستمع micro-access:submitted",
              st["text"] == "رسالة المستهلك النهائية: الدخول معلّق بانتظار التطبيق." and len(ev) == 1, {"status": st, "events": ev})
        pg.close()

        # ---- (c) مزوّد يرجع {ok:true} — محايد بلا ادعاء ----
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("() => { const gw = document.querySelector('[data-access-gateway]'); MicroAccessGateway.init(gw, { providers: { probeProvider: () => Promise.resolve({ ok: true }) } }); }")
        pg.click("[data-access-provider=probeProvider]")
        pg.wait_for_timeout(250)
        st = status_state(pg)
        neutral_ok = st["text"] == "انتهى الطلب دون نتيجة مؤكدة من التطبيق." and st["tone"] == "info"
        no_claims = ("تم الدخول" not in st["text"]) and ("نجاح" not in st["text"]) and ("تم التحقق" not in st["text"])
        check("c-neutral", "مزوّد {ok:true} → نص محايد بلا «تم الدخول/نجاح/تم التحقق»",
              neutral_ok and no_claims, st)
        pg.screenshot(path=str(HERE / "gateway-c-neutral.png"), full_page=True)
        pg.close()

        # ---- (d) رفض — رسالة الخطأ بنبرة error ----
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("() => { const gw = document.querySelector('[data-access-gateway]'); MicroAccessGateway.init(gw, { onSubmit: () => Promise.reject(new Error('فشل الاتصال بمزوّد الهوية.')) }); }")
        fill_and_submit(pg)
        pg.wait_for_timeout(250)
        st = status_state(pg)
        check("d-reject", "الرفض → رسالة الخطأ بنبرة error",
              st["text"] == "فشل الاتصال بمزوّد الهوية." and st["tone"] == "error", st)
        pg.close()

        # ---- (e) طلبان أثناء busy — معالج واحد ----
        # ملاحظة منهجية: نقر Playwright ينتظر قابلية النقر (زر قد يُعطَّل أثناء
        # busy) فتقع المحاولة الثانية بعد تفريغ busy — لذا المحاولة الثانية هنا
        # نقر DOM مباشر + إرسال حدث submit مباشرة على النموذج، كلاهما داخل
        # نافذة المشغول، لعزل حارس microAccessBusy نفسه.
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("""() => {
            const gw = document.querySelector('[data-access-gateway]');
            window.__calls = 0;
            MicroAccessGateway.init(gw, { onSubmit: () => { window.__calls++; return new Promise(r => setTimeout(() => r({ authenticated: false }), 200)); } });
        }""")
        fill_and_submit(pg)
        pg.wait_for_timeout(40)      # في قلب النافذة المشغولة
        guard_state = pg.evaluate("() => document.querySelector('[data-access-form]').dataset.microAccessBusy")
        pg.evaluate("document.querySelector('button[type=submit]').click()")
        pg.evaluate("document.querySelector('[data-access-form]').dispatchEvent(new Event('submit', { cancelable: true }))")
        pg.wait_for_timeout(400)
        calls = pg.evaluate("() => window.__calls")
        busy_after = pg.evaluate("() => document.querySelector('[data-access-form]').getAttribute('aria-busy')")
        check("e-busy-guard", "طلبان أثناء busy (نقر DOM + حدث submit مباشر) → معالج واحد وbusy يُفرَّغ",
              calls == 1 and busy_after is None, {"calls": calls, "ariaBusyAfter": busy_after, "busyFlagDuringSecondAttempt": guard_state})
        pg.close()

        # ---- (f) لا تخزين كلمة مرور ----
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("""() => {
            const gw = document.querySelector('[data-access-gateway]');
            window.__lastDetail = null;
            MicroAccessGateway.init(gw, { onSubmit: () => Promise.resolve({ authenticated: true }) });
            document.addEventListener('micro-access:submitted', e => { window.__lastDetail = e.detail; });
        }""")
        fill_and_submit(pg)
        pg.wait_for_timeout(250)
        leak = pg.evaluate("""pwd => {
            const hits = { detailKeys: null, detailHasPwd: false, htmlAttr: false, dataset: [], storage: [] };
            if (window.__lastDetail) {
              hits.detailKeys = Object.keys(window.__lastDetail).sort();
              hits.detailHasPwd = JSON.stringify(window.__lastDetail).indexOf(pwd) !== -1;
            }
            hits.htmlAttr = document.documentElement.outerHTML.indexOf(pwd) !== -1;
            document.querySelectorAll('*').forEach(el => {
              for (const a of el.attributes) if ((a.value || '').indexOf(pwd) !== -1 && !hits.dataset.includes(el.tagName)) hits.dataset.push(el.tagName + ':' + a.name);
              if (JSON.stringify(el.dataset || {}).indexOf(pwd) !== -1) hits.dataset.push(el.tagName + ':dataset');
            });
            for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if ((localStorage.getItem(k) || '').indexOf(pwd) !== -1) hits.storage.push('local:' + k); }
            for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if ((sessionStorage.getItem(k) || '').indexOf(pwd) !== -1) hits.storage.push('session:' + k); }
            return hits;
        }""", PASSWORD)
        check("f-no-pwd", "لا أثر لكلمة المرور في detail/سمات/dataset/مخازن",
              (not leak["detailHasPwd"]) and (not leak["htmlAttr"]) and leak["dataset"] == [] and leak["storage"] == [] and leak["detailKeys"] == ["result"], leak)
        pg.close()

        # ---- (g) onRecovery بلا message — لا ادعاء إرسال ----
        pg = browser.new_page(viewport={"width": 360, "height": 720})
        pg.goto(URL)
        pg.evaluate("() => { const gw = document.querySelector('[data-access-gateway]'); MicroAccessGateway.init(gw, { onRecovery: () => Promise.resolve(undefined) }); }")
        pg.click("[data-access-recovery]")
        pg.wait_for_timeout(250)
        st = status_state(pg)
        check("g-recovery", "onRecovery بلا message → محايد بلا «تم إرسال»",
              st["text"] == "انتهى طلب المساعدة دون تأكيد إرساله." and st["tone"] == "info" and "تم إرسال" not in st["text"], st)
        pg.screenshot(path=str(HERE / "gateway-g-recovery-neutral.png"), full_page=True)
        pg.close()

        browser.close()

    out = {"tool": "agent5 gateway probe (SUI-R1-01)", "url": URL, "checks": results,
           "summary": {"pass": sum(1 for r in results if r["pass"]), "total": len(results)}}
    (HERE / "gateway-a5.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"gateway: {out['summary']['pass']}/{out['summary']['total']}")
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
