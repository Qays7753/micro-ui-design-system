#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص الوكيل 1 (جولة SAMSUNG-ONEUI-REPAIR-R2 — SUI-R2-A1 / SUI-R1-01)

ملك الوكيل 1 وحده. تعيد إنتاج عيب بوابة الدخول بأرقام مقيسة قبل/بعد:

SUI-R1-01 (رسالة نجاح دخول لا تضمنها نتيجة المستهلك):
  المصدر: components/access-gateway/access-gateway.js (providers ~77 و onSubmit ~138-141).
  - مزوّد يعيد undefined → كان يعرض «تم الدخول بنجاح.» (استنتاج نجاح من اكتمال المعالج).
  - onSubmit ينجز بأي نتيجة → كان المكوّن يكتب «تم التحقق من بيانات الدخول.» فوق رسالة
    المستهلك (بما فيها رسالة عدم دخول صادقة من result.message أو من مستمع الحدث).
  عقد النتيجة الجديد المفحوص هنا (المستهلك يملك النتيجة والرسالة):
  - message نص غير فارغ → يعرض حرفيًا؛ النبرة result.tone إن كانت info/error وإلا
    error عند authenticated===false وإلا info.
  - بلا message: authenticated===true → «تم الدخول بنجاح.» (info)؛
    authenticated===false → «لم يتم الدخول.» (error)؛
    أي نتيجة أخرى (undefined / {ok:true} / {handled:true}) →
    «انتهى الطلب دون نتيجة مؤكدة من التطبيق.» (info).
  - onRecovery: بلا message → «انتهى طلب المساعدة دون تأكيد إرساله.» (info).
  - الترتيب: المكوّن يكتب رسالة النتيجة أولًا ثم يطلق micro-access:submitted —
    الكلمة الأخيرة لمستمع المستهلك (رسالته لا تُمحى).
  - الرفض: error.message بالنبرة error (كما كان).
  - بلا onSubmit: نص العرض التجريبي الحالي يبقى.
  - محفوظات مقيسة: حارس الطلب الواحد (busy)، aria-busy أثناء المعالجة وإزالتها
    بعدها، عدم تخزين كلمة المرور (detail الحدث بلا password + لا سمة/dataset/مخزن)،
    صفر أخطاء صفحة، وعينة F03 (بوابة bindGateway): الإرسال الصالح يدخل التطبيق
    والنص النهائي «تم الدخول بنجاح.».

الصفحات المضيفة: components/access-gateway/example-usage.html و
previews/concepts/ (بوابة بلا معالجات) و previews/ux-patterns/mobile-record-sample/
(بوابة F03). كل سيناريو بصفحة جديدة معزولة.

التشغيل من جذر المستودع:
  python3 tools/sui-r2-a1-check.py --tag before   # قبل الإصلاح: عيوب FAIL
  python3 tools/sui-r2-a1-check.py --tag after    # بعد الإصلاح: كله PASS
الخادم المدمج: منفذ من نطاق الوكيل 1 في R2 (4400-4419). المتصفح: Chromium
143.0.7499.4 (executable_path من --browser أو /home/z/my-project/evidence/bin/chromium).
المخرجات: <out>/<tag>-results.json + <tag>-summary.txt + <out>/screenshots/*.png.
NOT RUN: أجهزة فعلية/لمس/TalkBack/WebKit/native zoom (القياس DOM برمجي).
"""
import argparse
import json
import subprocess
import threading
from datetime import datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT_REPO = Path(__file__).resolve().parents[1]
EVIDENCE_BIN = Path("/home/z/my-project/evidence/bin/chromium")
OUT_DEFAULT = SCRIPT_REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R2" / "evidence" / "agent1"
PORT_RANGE = range(4400, 4420)  # نطاق منافذ الوكيل 1 في جولة R2

NEUTRAL_REQUEST = "انتهى الطلب دون نتيجة مؤكدة من التطبيق."
NEUTRAL_RECOVERY = "انتهى طلب المساعدة دون تأكيد إرساله."
LOGIN_OK = "تم الدخول بنجاح."
LOGIN_DENIED = "لم يتم الدخول."
DEMO_NOTE = "هذه نسخة عرض تجريبية — لن تُرسل بياناتك إلى أي خدمة."
CONSUMER_MESSAGE = "لم يتم الدخول — هذا الحساب غير مفعل في العرض التجريبي."
LISTENER_MESSAGE = "رسالة المستهلك بعد الحدث: الدخول معلّق بانتظار التطبيق."
REJECT_MESSAGE = "تعذّر الاتصال بخدمة الدخول التجريبية."
RECOVERY_MESSAGE = "رسالة مساعدة من المستهلك: تعذر الإرسال في هذا العرض."

EXAMPLE_REL = "/components/access-gateway/example-usage.html"
CONCEPTS_REL = "/previews/concepts/"
F03_REL = "/previews/ux-patterns/mobile-record-sample/index.html"


def serve_repo(port):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = None
    for p in [port] + [x for x in PORT_RANGE if x != port]:
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", p), partial(H, directory=str(SCRIPT_REPO)))
            break
        except OSError:
            continue
    if srv is None:
        raise RuntimeError("لا منفذ متاح في نطاق 4400-4419")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}", srv


def git_meta():
    def git(*args):
        return subprocess.run(["git", *args], capture_output=True, text=True, cwd=str(SCRIPT_REPO)).stdout.strip()
    status = git("status", "--porcelain")
    return {"commit": git("rev-parse", "HEAD"), "tree": git("rev-parse", "HEAD^{tree}"),
            "source_clean": status == "", "dirty_files": [ln for ln in status.splitlines()][:12],
            "note": "ملفات الوكيل غير المتتبعة (الأداة نفسها + مجلد أدلة الجولة) تظهر هنا إن وُجدت — لا مصدر مُعدّل خارج الملكية"}


class Tool:
    def __init__(self, out_dir, tag):
        self.out = out_dir
        self.tag = tag
        self.results = []
        self.info = []
        self.lines = []
        self.shots = out_dir / "screenshots"

    def log(self, m):
        print(m)
        self.lines.append(m)

    def check(self, name, ok, detail=""):
        self.results.append({"name": name, "ok": bool(ok), "detail": detail})
        self.log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))

    def record(self, name, data):
        self.info.append({"name": name, "data": data})
        self.log("INFO  " + name + " — " + json.dumps(data, ensure_ascii=False)[:300])

    def shot(self, page, name):
        try:
            self.shots.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(self.shots / f"{self.tag}-{name}.png"))
        except Exception as exc:  # pragma: no cover
            self.log(f"INFO  screenshot {name} failed: {exc}")

    def finish(self):
        passed = sum(1 for r in self.results if r["ok"])
        total = len(self.results)
        self.log("")
        self.log(f"# النتيجة ({self.tag}): {passed}/{total} ناجح — info: {len(self.info)}")
        payload = {
            "tool": "tools/sui-r2-a1-check.py",
            "tag": self.tag,
            "round": "SAMSUNG-ONEUI-REPAIR-R2 — الوكيل 1 — SUI-R2-A1 (SUI-R1-01 بوابة الدخول)",
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "git": git_meta(),
            "browser": "Chromium 143.0.7499.4 (evidence/bin) — Playwright sync",
            "pages": [EXAMPLE_REL, CONCEPTS_REL, F03_REL],
            "not_run": ["أجهزة فعلية/لمس", "TalkBack/قارئ شاشة فعلي", "WebKit", "native zoom"],
            "checks": self.results,
            "info_records": self.info,
            "summary": {"passed": passed, "failed": total - passed, "total": total},
        }
        self.out.mkdir(parents=True, exist_ok=True)
        (self.out / f"{self.tag}-results.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        (self.out / f"{self.tag}-summary.txt").write_text("\n".join(self.lines) + "\n", encoding="utf-8")
        return passed == total


# ---------- قياس منطقة الحالة ----------
STATUS = r"""() => {
  const gw = document.querySelector('[data-access-gateway]');
  const s = gw.querySelector('[data-access-status]');
  const form = gw.querySelector('[data-access-form]');
  return { text: s.textContent, tone: s.getAttribute('data-tone'),
           busy: form.getAttribute('aria-busy'), busyFlag: form.getAttribute('data-micro-access-busy') };
}"""

# تسجيل معالجات سيناريو على البوابة (init يعيد ضبط __microAccessCallbacks كاملة)
GW_INIT = r"""(spec) => {
  const gw = document.querySelector('[data-access-gateway]');
  if (!gw || !window.MicroAccessGateway) return false;
  window.__gwEvents = [];
  window.__gwCalls = 0;
  window.__recoveryCalls = 0;
  window.__providerCalls = 0;
  document.addEventListener('micro-access:submitted', function (e) {
    window.__gwEvents.push({ detail: e.detail });
    if (spec.listenerMessage) {
      document.querySelector('[data-access-gateway] [data-access-status]').textContent = spec.listenerMessage;
    }
  });
  const parse = (v) => v === null ? undefined : JSON.parse(v);
  const handlers = {};
  if (spec.onSubmit !== false) {
    handlers.onSubmit = function (creds) {
      window.__gwCalls += 1;
      window.__lastCreds = creds;
      if (spec.rejectMessage) return Promise.reject(new Error(spec.rejectMessage));
      return Promise.resolve(parse(spec.result));
    };
  }
  if (spec.onRecovery !== false) {
    handlers.onRecovery = function () {
      window.__recoveryCalls += 1;
      return Promise.resolve(parse(spec.recoveryResult));
    };
  }
  if (spec.providerResult !== undefined) {
    handlers.providers = { google: function () {
      window.__providerCalls += 1;
      return Promise.resolve(parse(spec.providerResult));
    } };
  }
  window.MicroAccessGateway.init(gw, handlers);
  return true;
}"""

# معالج معلّق لفحص حارس الطلب الواحد ودورة busy
GW_INIT_PENDING = r"""() => {
  const gw = document.querySelector('[data-access-gateway]');
  window.__gwCalls = 0;
  window.__release = null;
  window.MicroAccessGateway.init(gw, {
    onSubmit: function () {
      window.__gwCalls += 1;
      return new Promise(function (resolve) { window.__release = resolve; });
    }
  });
  return true;
}"""

# فحص عدم تخزين كلمة المرور: detail الحدث + كل سمات/dataset البوابة والنموذج + المخازن
PW_SCAN = r"""(pw) => {
  const gw = document.querySelector('[data-access-gateway]');
  const form = gw.querySelector('[data-access-form]');
  const hits = [];
  const scanNode = (node) => {
    for (const a of node.attributes || []) {
      if (String(a.value || '').includes(pw)) hits.push(node.tagName + ':' + a.name);
    }
    for (const k in node.dataset || {}) {
      if (String(node.dataset[k]).includes(pw)) hits.push(node.tagName + ':data-' + k);
    }
  };
  scanNode(gw); scanNode(form);
  [gw, form].forEach((root) => root.querySelectorAll('*').forEach(scanNode));
  const storeHit = (store) => {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (String(k).includes(pw) || String(store.getItem(k)).includes(pw)) return true;
    }
    return false;
  };
  const detail = (window.__gwEvents && window.__gwEvents.length)
    ? window.__gwEvents[window.__gwEvents.length - 1].detail : null;
  const detailJson = detail === null ? null : JSON.stringify(detail);
  return { detailJson: detailJson,
           detailHasPassword: detailJson ? detailJson.includes(pw) : false,
           detailKeys: detail && typeof detail === 'object' ? Object.keys(detail) : null,
           attrHits: hits,
           localStorageHit: storeHit(window.localStorage),
           sessionStorageHit: storeHit(window.sessionStorage) };
}"""

SUBMIT_FORM = r"""() => { document.querySelector('[data-access-form]').requestSubmit(); }"""
DOUBLE_SUBMIT = r"""() => { const f = document.querySelector('[data-access-form]'); f.requestSubmit(); f.requestSubmit(); }"""


def new_page(browser, base, errors, rel, wait_gateway=True):
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(base + rel)
    page.wait_for_load_state("networkidle")
    if wait_gateway:
        page.wait_for_function("() => !!window.MicroAccessGateway", timeout=10000)
    return ctx, page


def fill_gateway(page, email_id, password_id, password="pw- لا-تخزين-777"):
    page.fill(email_id, "user@example.test")
    page.fill(password_id, password)


def settle_submit(page):
    page.wait_for_function(
        "() => document.querySelector('[data-access-form]').getAttribute('data-micro-access-busy') === 'false'",
        timeout=6000)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", required=True, choices=["before", "after"])
    ap.add_argument("--browser", default=str(EVIDENCE_BIN))
    ap.add_argument("--out", default=str(OUT_DEFAULT))
    ap.add_argument("--port", type=int, default=4400)
    args = ap.parse_args()

    out = Path(args.out)
    t = Tool(out, args.tag)
    base, srv = serve_repo(args.port)
    t.log(f"# فحص الوكيل 1 — SAMSUNG-ONEUI-REPAIR-R2 — SUI-R2-A1/SUI-R1-01 — tag={args.tag} — {datetime.now().isoformat(timespec='seconds')}")
    t.log(f"# الخادم: {base} (نطاق الوكيل 1) — meta: {json.dumps(git_meta(), ensure_ascii=False)}")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.browser, headless=True)

        def scenario(rel, spec=None, email_id="#gateway-email", password_id="#gateway-password"):
            """صفحة معزولة + معالجات سيناريو اختيارية. يعيد (ctx, page)."""
            ctx, page = new_page(browser, base, errors, rel)
            if spec is not None:
                assert page.evaluate(GW_INIT, spec) is True
            return ctx, page

        # ============ المجموعة 1: مسار المزوّد (providers) ============
        # A1-01: مزوّد يعيد undefined → نص محايد، لا ادعاء نجاح ولا «تم التحقق»
        ctx, page = scenario(EXAMPLE_REL, {"providerResult": None})
        page.click('[data-access-provider="google"]')
        page.wait_for_timeout(300)
        st = page.evaluate(STATUS)
        t.check("A1-01 مزوّد يعيد undefined → النص المحايد حرفيًا (لا استنتاج نجاح من اكتمال المعالج)",
                st["text"] == NEUTRAL_REQUEST,
                json.dumps(st, ensure_ascii=False))
        t.check("A1-01b النص لا يحوي «تم الدخول بنجاح» ولا «تم التحقق»",
                ("تم الدخول بنجاح" not in st["text"]) and ("تم التحقق" not in st["text"]),
                json.dumps(st, ensure_ascii=False))
        t.check("A1-01c نبرة النص المحايد info", st["tone"] == "info", f"tone={st['tone']}")
        t.shot(page, "a1-01-provider-undefined")
        ctx.close()

        # A1-02: مزوّد يعيد {authenticated:true} → دخول مؤكد بنبرة info (محفوظ)
        ctx, page = scenario(EXAMPLE_REL, {"providerResult": '{"authenticated":true}'})
        page.click('[data-access-provider="google"]')
        page.wait_for_timeout(300)
        st = page.evaluate(STATUS)
        t.check("A1-02 مزوّد يعيد {authenticated:true} → «تم الدخول بنجاح.» بنبرة info",
                st["text"] == LOGIN_OK and st["tone"] == "info",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # ============ المجموعة 2: مسار onSubmit — عقد النتيجة ============
        # A1-03: undefined → نص محايد بلا ادعاء
        ctx, page = scenario(EXAMPLE_REL, {"result": None})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-03 onSubmit يعيد undefined → النص المحايد حرفيًا (بلا ادعاء نجاح)",
                st["text"] == NEUTRAL_REQUEST and "تم الدخول بنجاح" not in st["text"] and "تم التحقق" not in st["text"],
                json.dumps(st, ensure_ascii=False))
        t.check("A1-03b نبرة المحايد info", st["tone"] == "info", f"tone={st['tone']}")
        ctx.close()

        # A1-04: {authenticated:true} → «تم الدخول بنجاح.» info
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"authenticated":true}'})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-04 onSubmit يعيد {authenticated:true} → «تم الدخول بنجاح.» وdata-tone=info",
                st["text"] == LOGIN_OK and st["tone"] == "info",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # A1-05: {authenticated:false} بلا message → «لم يتم الدخول.» error
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"authenticated":false}'})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-05 onSubmit يعيد {authenticated:false} بلا message → «لم يتم الدخول.» وdata-tone=error",
                st["text"] == LOGIN_DENIED and st["tone"] == "error",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # A1-06: {authenticated:false,message} → الرسالة تبقى حرفيًا (إعادة إنتاج الاستبدال)
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"authenticated":false,"message":"لم يتم الدخول"}'})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        replaced = st["text"] == "تم التحقق من بيانات الدخول."
        t.check("A1-06 onSubmit يعيد {authenticated:false,message:'لم يتم الدخول'} → الرسالة تبقى حرفيًا بنبرة error (لا تُستبدل)",
                st["text"] == "لم يتم الدخول" and st["tone"] == "error",
                json.dumps({**st, "كانت تُستبدل بـ": "تم التحقق من بيانات الدخول." if replaced else None}, ensure_ascii=False))
        t.shot(page, "a1-06-consumer-denial-message")
        ctx.close()

        # A1-07: {ok:true} (مفاتيح غير معروفة) → محايد
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"ok":true}'})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-07 onSubmit يعيد {ok:true} (مفتاح غير معروف) → النص المحايد (ليس مخططًا ملزمًا)",
                st["text"] == NEUTRAL_REQUEST and st["tone"] == "info",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # A1-08: message + tone صريح → الرسالة حرفيًا والنبرة من المستهلك
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"message":"البريد غير مسجل في هذا العرض.","tone":"error"}'})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-08 result.message نص غير فارغ → يُعرض حرفيًا وresult.tone='error' يُحترم",
                st["text"] == "البريد غير مسجل في هذا العرض." and st["tone"] == "error",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # A1-09: message مع authenticated:true → الرسالة تسبق الدخول المؤكد
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"authenticated":true,"message":"دخول تجريبي مقيد."}'})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-09 message مع authenticated:true → الرسالة تُعرض (لا تبتلعها رسالة الدخول)",
                st["text"] == "دخول تجريبي مقيد." and st["tone"] == "info",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # A1-10: مستمع micro-access:submitted يكتب → رسالته هي النهائية (الكلمة الأخيرة)
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"authenticated":true}', "listenerMessage": LISTENER_MESSAGE})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        ev = page.evaluate("() => window.__gwEvents.length")
        t.check("A1-10 مستمع micro-access:submitted يكتب رسالة → تبقى حرفيًا بعد اكتمال المسار (الكلمة الأخيرة للمستهلك)",
                st["text"] == LISTENER_MESSAGE,
                json.dumps({**st, "events": ev, "كانت تُمحى بـ": "تم التحقق من بيانات الدخول." if st["text"] == "تم التحقق من بيانات الدخول." else None}, ensure_ascii=False))
        t.check("A1-10b الحدث micro-access:submitted أُطلق مرة واحدة", ev == 1, f"events={ev}")
        t.shot(page, "a1-10-listener-last-word")
        ctx.close()

        # A1-11: رفض → رسالة الخطأ بنبرة error (محفوظ)
        ctx, page = scenario(EXAMPLE_REL, {"rejectMessage": REJECT_MESSAGE})
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-11 رفض Promise بخطأ → error.message بنبرة error",
                st["text"] == REJECT_MESSAGE and st["tone"] == "error",
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # ============ المجموعة 3: حارس الطلب الواحد ودورة busy ============
        ctx, page = scenario(EXAMPLE_REL, None)
        page.evaluate(GW_INIT_PENDING)
        fill_gateway(page, "#gateway-email", "#gateway-password")
        page.evaluate(DOUBLE_SUBMIT)  # طلبان متتاليان أثناء المعالجة
        page.wait_for_timeout(150)
        mid = page.evaluate(STATUS)
        calls = page.evaluate("() => window.__gwCalls")
        t.check("A1-12 طلبان متتاليان أثناء busy → معالج واحد يُستدعى (حارس microAccessBusy محفوظ)",
                calls == 1, f"calls={calls}")
        t.check("A1-12b aria-busy='true' أثناء المعالجة", mid["busy"] == "true" and mid["busyFlag"] == "true",
                json.dumps(mid, ensure_ascii=False))
        page.evaluate("() => window.__release({authenticated:false})")
        settle_submit(page)
        end = page.evaluate(STATUS)
        t.check("A1-12c بعد الإنجاز: aria-busy مُزالة وmicroAccessBusy='false'",
                end["busy"] is None and end["busyFlag"] == "false",
                json.dumps(end, ensure_ascii=False))
        t.check("A1-12d نتيجة الطلب المعلّق تُطبق (لم يتم الدخول بنبرة error)",
                end["text"] == LOGIN_DENIED and end["tone"] == "error",
                json.dumps(end, ensure_ascii=False))
        ctx.close()

        # ============ المجموعة 4: عدم تخزين كلمة المرور ============
        ctx, page = scenario(EXAMPLE_REL, {"result": '{"authenticated":true}'})
        fill_gateway(page, "#gateway-email", "#gateway-password", password="Pw-Do-Not-Store-777")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        scan = page.evaluate(PW_SCAN, "Pw-Do-Not-Store-777")
        t.check("A1-13 detail حدث submitted لا يحمل كلمة المرور (يحمل {result} فقط)",
                scan["detailHasPassword"] is False and scan["detailKeys"] == ["result"],
                json.dumps(scan, ensure_ascii=False))
        t.check("A1-13b لا سمة/dataset على البوابة أو النموذج تحمل كلمة المرور ولا في localStorage/sessionStorage",
                scan["attrHits"] == [] and scan["localStorageHit"] is False and scan["sessionStorageHit"] is False,
                json.dumps(scan, ensure_ascii=False))
        ctx.close()

        # ============ المجموعة 5: onRecovery ============
        ctx, page = scenario(EXAMPLE_REL, {"recoveryResult": None})
        page.click("[data-access-recovery]")
        page.wait_for_timeout(300)
        st = page.evaluate(STATUS)
        t.check("A1-14 onRecovery بلا message → «انتهى طلب المساعدة دون تأكيد إرساله.» (لا ادعاء إرسال) بنبرة info",
                st["text"] == NEUTRAL_RECOVERY and st["tone"] == "info" and "تم إرسال" not in st["text"],
                json.dumps(st, ensure_ascii=False))
        t.shot(page, "a1-14-recovery-neutral")
        ctx.close()

        ctx, page = scenario(EXAMPLE_REL, {"recoveryResult": '{"message":"رسالة مساعدة من المستهلك: تعذر الإرسال في هذا العرض."}'})
        page.click("[data-access-recovery]")
        page.wait_for_timeout(300)
        st = page.evaluate(STATUS)
        t.check("A1-15 onRecovery يعيد message → تُعرض وتُحترم حرفيًا",
                st["text"] == RECOVERY_MESSAGE,
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # ============ المجموعة 6: صفحة concepts (بوابة بلا معالجات + عقد على مستضيف ثانٍ) ============
        ctx, page = scenario(CONCEPTS_REL, None, "#concept-email", "#concept-password")
        fill_gateway(page, "#concept-email", "#concept-password")
        page.evaluate(SUBMIT_FORM)
        page.wait_for_timeout(300)
        st = page.evaluate(STATUS)
        t.check("A1-16 بلا onSubmit (concepts) → نص العرض التجريبي الحالي حرفيًا",
                st["text"] == DEMO_NOTE and st["tone"] == "info",
                json.dumps(st, ensure_ascii=False))
        t.shot(page, "a1-16-no-handler-demo-text")
        ctx.close()

        ctx, page = scenario(CONCEPTS_REL, {"providerResult": None}, "#concept-email", "#concept-password")
        page.click('[data-access-provider="google"]')
        page.wait_for_timeout(300)
        st = page.evaluate(STATUS)
        t.check("A1-17 concepts: مزوّد يعيد undefined → النص المحايد (نفس العقد على مستضيف ثانٍ)",
                st["text"] == NEUTRAL_REQUEST and "تم الدخول بنجاح" not in st["text"],
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        ctx, page = scenario(CONCEPTS_REL, {"result": None, "listenerMessage": CONSUMER_MESSAGE}, "#concept-email", "#concept-password")
        fill_gateway(page, "#concept-email", "#concept-password")
        page.evaluate(SUBMIT_FORM)
        settle_submit(page)
        st = page.evaluate(STATUS)
        t.check("A1-18 concepts: رسالة مستمع الحدث تبقى فوق منطقة الحالة (لا يمسحها المكوّن)",
                st["text"] == CONSUMER_MESSAGE,
                json.dumps(st, ensure_ascii=False))
        ctx.close()

        # ============ المجموعة 7: عينة F03 (bindGateway) ============
        ctx, page = new_page(browser, base, errors, F03_REL, wait_gateway=False)
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        page.fill("#f03-gw-email", "demo@example.test")
        page.fill("#f03-gw-password", "demo-pass-1")
        page.click("#f03-gw-submit")
        page.wait_for_function("() => window.F03App.inspect().entered === true", timeout=8000)
        f03 = page.evaluate("""() => ({
          view: window.F03App.inspect().view,
          entered: window.F03App.inspect().entered,
          text: document.querySelector('[data-access-gateway] [data-access-status]').textContent,
          tone: document.querySelector('[data-access-gateway] [data-access-status]').getAttribute('data-tone')
        })""")
        t.check("A1-19 F03: الإرسال الصالح يدخل التطبيق (entered=true وview=home)",
                f03["entered"] is True and f03["view"] == "home",
                json.dumps(f03, ensure_ascii=False))
        t.check("A1-19b F03: النص النهائي «تم الدخول بنجاح.» (المستهلك أكّد الدخول)",
                f03["text"] == LOGIN_OK,
                json.dumps(f03, ensure_ascii=False))
        t.shot(page, "a1-19-f03-final-text")
        ctx.close()

        ctx, page = new_page(browser, base, errors, F03_REL, wait_gateway=False)
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        page.click("#f03-gw-demo")
        page.wait_for_function("() => window.F03App.inspect().entered === true", timeout=8000)
        f03b = page.evaluate("""() => ({
          view: window.F03App.inspect().view,
          entered: window.F03App.inspect().entered,
          text: document.querySelector('[data-access-gateway] [data-access-status]').textContent,
          tone: document.querySelector('[data-access-gateway] [data-access-status]').getAttribute('data-tone')
        })""")
        t.check("A1-20 F03: المزوّد التجريبي يدخل التطبيق والنص «تم الدخول بنجاح.» (العرض يصرّح بالنتيجة)",
                f03b["entered"] is True and f03b["view"] == "home" and f03b["text"] == LOGIN_OK,
                json.dumps(f03b, ensure_ascii=False))
        ctx.close()

        # ============ صفر أخطاء صفحة ============
        t.check("A1-21 صفر أخطاء صفحة عبر الجلسة كلها (pageerrors)",
                len(errors) == 0, json.dumps(errors[:6], ensure_ascii=False))
        browser.close()

    ok = t.finish()
    srv.shutdown()
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
