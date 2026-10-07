#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMSUNG-ONEUI-REPAIR-R1 — الوكيل 4 (البيانات والعرض والجدولة)
تحقق وظيفي إضافي بعد الإصلاحات (جولة استكمال الرجعيات 2026-10-07):

1) العينة المستقلة order-schedule عبر الخادم المدمج (نطاق الوكيل 4):
   - المسار الافتراضي نظيف: لا 'mystery' في DOM (ولا في مفتاح الكالندر)
     ولا نص حقن — البذرة الافتراضية بيانات أعمال فقط (22 طلبًا).
   - وضع ?fixtures=edge يعرض الحالات الحدية (تحقق نصي): صف od-10 بمفتاح
     'mystery' محايد بنصه + صف od-inj بعنوان محقون يظهر نصًا حرفيًا
     (لا b/img وwindow.__xss غير مفعّل) — عقد SUI-009.
   - لقطتان (افتراضي + fixtures) عند 320.
2) F03 عبر الخادم (بوابة → الرئيسية → الطلبات المجدولة): مفتاح الكالندر
   في المسار الافتراضي بلا 'mystery' ولا صفوف الحالات الحدية — فحص نصي
   DOM سريع (لا تعديل لملفات F03).

المخرجات: evidence/agent4/regression/functional/{functional-results.json,
functional-log.txt, screenshots/}.
NOT RUN: أجهزة فعلية/لمس/TalkBack/WebKit/native zoom.
"""
import json
import threading
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parents[5]  # micro-ui-design-system
OUT = REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent4" / "regression" / "functional"
BROWSER = "/home/z/my-project/evidence/bin/chromium"
PORT = 4406  # نطاق الوكيل 4 (4400-4419)
SAMPLE = "/previews/ux-patterns/order-schedule/index.html"
F03 = "/previews/ux-patterns/mobile-record-sample/index.html"

results, lines = [], []


def log(m):
    print(m)
    lines.append(m)


def check(name, ok, detail=""):
    results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:400]})
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + str(detail)[:200]) if detail else ""))


def serve(port):
    from functools import partial

    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", port), partial(H, directory=str(REPO)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


SAMPLE_PROBE = """() => {
  const root = document.getElementById('ocal-demo');
  const legend = root.querySelector('.m-ocal__legend') || root;
  const legendText = legend.textContent || '';
  const bodyText = document.body.innerText || '';
  return {
    legendText: legendText.trim(),
    hasMysteryRow: !!root.querySelector('.m-ocal__row[data-ocal-id="od-10"]'),
    hasInjRow: !!root.querySelector('.m-ocal__row[data-ocal-id="od-inj"]'),
    mysteryInDom: bodyText.indexOf('mystery') >= 0,
    injectionLiteral: bodyText.indexOf('onerror') >= 0 || bodyText.indexOf('<b>') >= 0,
    rootB: root.querySelectorAll('b').length,
    rootImg: root.querySelectorAll('img').length,
    xssArmed: typeof window.__xss !== 'undefined',
    storeCount: window.OrderDemoStore ? window.OrderDemoStore.count() : null,
    rowStatusLabels: [...root.querySelectorAll('.m-ocal__row-statuslabel')].map((l) => l.textContent)
  };
}"""

F03_PROBE = """() => {
  const root = document.getElementById('f03-ocal');
  const bodyText = document.body.innerText || '';
  const legend = root ? (root.querySelector('.m-ocal__legend') || root) : null;
  return {
    legendText: legend ? (legend.textContent || '').trim() : null,
    hasMysteryRow: !!root.querySelector('.m-ocal__row[data-ocal-id="od-10"]'),
    hasInjRow: !!root.querySelector('.m-ocal__row[data-ocal-id="od-inj"]'),
    mysteryInDom: bodyText.indexOf('mystery') >= 0,
    injectionLiteral: bodyText.indexOf('onerror') >= 0 || bodyText.indexOf('<b>') >= 0,
    storeCount: window.OrderDemoStore ? window.OrderDemoStore.count() : null
  };
}"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)
    srv = serve(PORT)
    base = f"http://127.0.0.1:{PORT}"
    errors = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=BROWSER,
                                     args=["--no-sandbox", "--disable-dev-shm-usage"])
        page = browser.new_page(viewport={"width": 320, "height": 844})
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))

        # ---------- 1) العينة المستقلة: المسار الافتراضي نظيف ----------
        page.goto(base + SAMPLE)
        page.wait_for_load_state("load")
        page.wait_for_function(
            "() => document.querySelectorAll('#ocal-demo .m-ocal__cell').length >= 30", timeout=10000)
        page.wait_for_timeout(300)
        d = page.evaluate(SAMPLE_PROBE)
        check("العينة المسار الافتراضي: لا 'mystery' في DOM كله (ولا في مفتاح الكالندر)",
              not d["mysteryInDom"], d)
        check("العينة المسار الافتراضي: لا صفوف الحالات الحدية (od-10/od-inj) ولا نص حقن",
              not d["hasMysteryRow"] and not d["hasInjRow"] and not d["injectionLiteral"]
              and d["rootB"] == 0 and d["rootImg"] == 0 and not d["xssArmed"], d)
        check("العينة المسار الافتراضي: البذرة 22 طلبًا بمفاتيح معروفة فقط",
              d["storeCount"] == 22 and "mystery" not in d["legendText"],
              {"storeCount": d["storeCount"], "legendText": d["legendText"],
               "labels": sorted(set(d["rowStatusLabels"]))})
        page.screenshot(path=str(OUT / "screenshots" / "sample-default-320.png"), full_page=True)

        # ---------- 2) وضع ?fixtures=edge يعرض الحالات الحدية (نصيًا) ----------
        page.goto(base + SAMPLE + "?fixtures=edge")
        page.wait_for_load_state("load")
        page.wait_for_function(
            "() => document.querySelectorAll('#ocal-demo .m-ocal__cell').length >= 30", timeout=10000)
        page.wait_for_timeout(400)
        # عرض القائمة كي تظهر كل الصفوف (في عرض التقويم تظهر صفوف اليوم المحدد فقط)
        page.click("#ocal-demo .m-ocal__views-btn[data-ocal-value='list']")
        page.wait_for_timeout(350)
        f = page.evaluate(SAMPLE_PROBE)
        page.screenshot(path=str(OUT / "screenshots" / "sample-fixtures-edge-320.png"), full_page=True)
        check("وضع ?fixtures=edge: صف od-10 (مفتاح 'mystery') وصف od-inj (عنوان محقون) حاضران",
              f["hasMysteryRow"] and f["hasInjRow"], f)
        check("وضع ?fixtures=edge: المفتاح المجهول محايد بنصه في المفتاح والصف",
              "mystery" in f["legendText"] and f["mysteryInDom"], {"legendText": f["legendText"]})
        check("وضع ?fixtures=edge: الحقن نص حرفي — لا b/img وwindow.__xss غير مفعّل",
              f["injectionLiteral"] and f["rootB"] == 0 and f["rootImg"] == 0 and not f["xssArmed"], f)
        check("وضع ?fixtures=edge: المخزن 24 (22 + حالتا حدود)",
              f["storeCount"] == 24, {"storeCount": f["storeCount"]})
        page.screenshot(path=str(OUT / "screenshots" / "sample-fixtures-edge-320.png"), full_page=True)

        # ---------- 3) F03 المسار الافتراضي: مفتاح الكالندر بلا mystery ----------
        page2 = browser.new_page(viewport={"width": 320, "height": 844})
        page2.on("pageerror", lambda e: errors.append("f03 pageerror: " + str(e)))
        page2.goto(base + F03)
        page2.wait_for_load_state("load")
        page2.wait_for_function("() => !!window.F03App", timeout=10000)
        page2.evaluate("() => { try { window.localStorage.clear(); } catch (e) {} }")
        page2.click("#f03-gw-demo")
        page2.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page2.click("#f03-home-schedule")
        page2.wait_for_selector("#view-schedule", state="visible", timeout=5000)
        page2.wait_for_function(
            "() => document.querySelectorAll('#f03-ocal .m-ocal__cell').length >= 30", timeout=5000)
        page2.wait_for_timeout(300)
        g = page2.evaluate(F03_PROBE)
        check("F03 المسار الافتراضي: لا 'mystery' في DOM (مفتاح الكالندر نظيف)",
              not g["mysteryInDom"], g)
        check("F03 المسار الافتراضي: لا صفوف الحالات الحدية ولا نص حقن",
              not g["hasMysteryRow"] and not g["hasInjRow"] and not g["injectionLiteral"], g)
        check("F03 المسار الافتراضي: الموصل 22 طلبًا (بذرة نظيفة)",
              g["storeCount"] == 22, g)
        page2.screenshot(path=str(OUT / "screenshots" / "f03-schedule-default-320.png"), full_page=True)
        page2.close()

        check("صفر أخطاء JavaScript في كل الصفحات أعلاه", not errors, errors[:3])
        browser.close()
    srv.shutdown()

    passed = sum(1 for r in results if r["ok"])
    log("")
    log(f"# النتيجة: {passed}/{len(results)}")
    payload = {
        "tool": "evidence/agent4/scripts/a4_functional_verify.py",
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "browser": "Chromium 143.0.7499.4 (/home/z/my-project/evidence/bin/chromium) — Playwright sync",
        "server": f"http://127.0.0.1:{PORT} (نطاق الوكيل 4: 4400-4419)",
        "not_run": ["أجهزة فعلية/لمس", "TalkBack/قارئ شاشة فعلي", "WebKit", "native zoom"],
        "checks": results,
        "summary": {"passed": passed, "total": len(results)},
    }
    (OUT / "functional-results.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2),
                                                 encoding="utf-8")
    (OUT / "functional-log.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return passed == len(results)


if __name__ == "__main__":
    import sys
    sys.exit(0 if main() else 1)
