#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent 3 — مراجعة عائلة messages B06 بعد تغييرات SUI-012/010 (العقد K8 محفوظ؟)
+ عائلة access-gateway وaccount-settings: عقد الإتاحة الأساسي بعد SUI-013/014.
تشغيل من جذر المستودع: python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent3/family-review.py
الإخراج: reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent3/family-review.json
"""
import json
import sys
import threading
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[4]  # جذر المستودع micro-ui-design-system
# (تصحيح جولة التحقق: كان parents[5] = /home/z/my-project → مسارات 404 والمكوّنات
#  غير معرفة؛ الوكيل 3 أنهى جولته قبل تشغيل هذا السكربت فلم يظهر الخلل.)
OUT = Path(__file__).resolve().parent / "family-review.json"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"


def serve(root: Path):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(H, directory=str(root)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}"


results = []


def check(name, ok, detail=""):
    results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:300]})
    print(("[PASS] " if ok else "[FAIL] ") + name + (f" — {detail}" if not ok else ""))


def main():
    base = serve(ROOT)
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))

        # ---- B06: عقد التوست المكوّن (K8) بعد تعديل announce ----
        page.goto(base + "/previews/messages/index.html")
        page.wait_for_load_state("load")
        page.wait_for_function("() => !!window.MicroMessages", timeout=10000)
        page.wait_for_timeout(300)
        board = page.evaluate("""() => {
          const out = {};
          // (تصحيح جولة التحقق: النص البشري للزر «تأكيد غير حرج (محاكاة)» لا
          // يطابق regex النص السابق — الالتقاط بعقد العينة data-toast-demo)
          const btn = document.querySelector('[data-toast-demo]');
          out.hasDemoButton = !!btn;
          if (btn) btn.id = 'a3-toast-demo';
          return out;
        }""")
        if board.get("hasDemoButton"):
            page.click("#a3-toast-demo")
            page.wait_for_timeout(200)
            t = page.evaluate("""() => {
              const toast = document.querySelector('.m-toast:not([hidden])') || document.querySelector('.m-toast');
              if (!toast) return null;
              const r = toast.getBoundingClientRect();
              const region = document.querySelector('.m-live-region');
              return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), hidden: toast.hidden,
                       role: toast.getAttribute('role'), ariaLive: toast.getAttribute('aria-live'),
                       regionText: region ? region.textContent : null,
                       fromBottom: +(window.innerHeight - r.bottom).toFixed(1) };
            }""")
            check("B06 toast: ظهور فعلي 320×80 تقريبًا مع قناة إعلان واحدة (بلا role/aria-live على العنصر)",
                  t and t["w"] > 200 and t["h"] > 60 and not t["role"] and not t["ariaLive"] and t["regionText"],
                  t)
            close_btn = page.evaluate("""() => {
              const toast = document.querySelector('.m-toast:not([hidden])');
              return toast ? !!toast.querySelector('[data-toast-close]') : false;
            }""")
            if close_btn:
                page.click(".m-toast [data-toast-close]")
                page.wait_for_timeout(150)
                closed = page.evaluate("() => { const t = document.querySelector('.m-toast'); return t ? t.hidden : true; }")
                check("B06 toast: الإغلاق اليدوي يعمل", closed is True, closed)
        else:
            check("B06 toast: زر عرض موجود في اللوحة", False, board)

        # الرسائل الثابتة: عقد الأدوار في اللوحة (معلومة/نجاح status، خطأ alert)
        notes = page.evaluate("""() => {
          const grab = (cls) => {
            const n = document.querySelector('.m-note--' + cls);
            return n ? { role: n.getAttribute('role') } : null;
          };
          return { info: grab('info'), success: grab('success'), warning: grab('warning'), error: grab('error') };
        }""")
        check("B06 اللوحة: عقد أدوار m-note مطبق في HTML العينة (SUI-010: خطأ=alert، تحذير/معلومة/نجاح=status)",
              all(v is not None for v in notes.values())
              and notes["error"]["role"] == "alert"
              and notes["warning"]["role"] == "status"
              and notes["info"]["role"] == "status"
              and notes["success"]["role"] == "status",
              notes)

        # ---- E01: البوابة بعد SUI-013/014 — كشف كلمة المرور وbusy ----
        page.goto(base + "/components/access-gateway/example-usage.html")
        page.wait_for_load_state("load")
        page.wait_for_timeout(300)
        reveal = page.evaluate("""() => {
          const b = document.querySelector('[data-access-reveal]');
          if (!b) return null;
          b.click();
          const pw = document.getElementById('gateway-password');
          return { type: pw.type, pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label') };
        }""")
        check("E01 gateway: كشف كلمة المرور يبدّل النوع مع aria-pressed وlabel",
              reveal and reveal["type"] == "text" and reveal["pressed"] == "true" and "إخفاء" in reveal["label"], reveal)
        errors_txt = page.evaluate("() => { window.__errs = []; window.addEventListener('error', (e) => window.__errs.push(String(e))); return true; }")
        page.fill("#gateway-email", "bad-email")
        page.fill("#gateway-password", "x")
        page.click(".m-access-gateway__submit")
        page.wait_for_timeout(300)
        inv = page.evaluate("""() => {
          const email = document.getElementById('gateway-email');
          return { ariaInvalid: email.getAttribute('aria-invalid'),
                   msg: (email.closest('[data-micro-field]').querySelector('[data-field-msg]') || {}).textContent || null,
                   focus: document.activeElement.id };
        }""")
        check("E01 gateway: صيغة بريد غير صالحة → رسالة مرتبطة وaria-invalid وتركيز (قناة واحدة)",
              inv["ariaInvalid"] == "true" and inv["msg"] and inv["focus"] == "gateway-email", inv)

        # ---- E04: account-settings — مثال الاستخدام: مفتاح Space ومساحة الحالة ----
        page.goto(base + "/previews/concepts/index.html")
        page.wait_for_load_state("load")
        page.wait_for_timeout(500)
        acc = page.evaluate("""() => {
          const root = document.querySelector('[data-account-settings]');
          if (!root) return { missing: true };
          const sw = root.querySelector('.m-switch input[type="checkbox"]');
          return { hasSwitch: !!sw, note: !!root.querySelector('[data-account-demo-status], .m-account-settings__demo-status') };
        }""")
        check("E04 account-settings: المفتاح وقناة الحالة موجودان في لوحة المفاهيم",
              acc and not acc.get("missing") and acc["hasSwitch"] and acc["note"], acc)

        browser.close()

    doc = {
        "tool": "evidence/agent3/family-review.py",
        "purpose": "مراجعة عائلات المرحلة الثانية بعد إصلاحات A3: B06 + E01 + E04",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "page_errors": errors,
        "results": results,
        "summary": {"total": len(results), "passed": sum(1 for r in results if r["ok"]),
                    "failed": sum(1 for r in results if not r["ok"])},
        "not_run": ["قارئ شاشة فعلي", "لمس/هاتف فعلي", "WebKit", "native zoom"],
    }
    OUT.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(doc["summary"], ensure_ascii=False))
    sys.exit(0 if doc["summary"]["failed"] == 0 and not errors else 1)


if __name__ == "__main__":
    main()
