#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص R8-07: فصل نص المستخدم عن التشخيص التقني ودورة حياة التشخيص. من الجذر:
  python3 tools/data-scale-state-check.py

الانتقالات تُختبر على العقدة نفسها (تعديل سمات + MicroData.render) لا باستبدال
العقدة — إعادة إنتاج مباشرة لعيوب R8-07a/R8-07b من مراجعة CHATGPT-REVIEW-R2:
  bars : over→ok، invalid→ok، over-rescaled→auto، ok→over (العودة إلى الخطأ)
  line : over→ok
  donut: invalid→valid، over→valid→over، conflict→valid، سالب→valid
  مزامنة حدث micro-data:rendered مع التشخيص، ونقاء الرسائل الظاهرة من
  أسماء السمات/التعليمات، وغياب السمتين في الحالة السليمة (عقد R8-07b).

الأدلة: reviews/UI-COMPLETION/verification-r8-07.txt (+ لاحقة -webkit عند تشغيله بمحرك آخر
عبر MICRO_TEST_ENGINE) + لقطة الحالات. المحرك الافتراضي Chromium؛ WebKit تشغيل آلي
على نفس الفحوص لا يغني عن Safari حقيقي ولا جهاز — لا ادعاء جهاز/قارئ شاشة.
"""
import http.server
import os
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "UI-COMPLETION"
results, log_lines = [], []

# T01 روح الحسم المعلن: MICRO_TEST_ENGINE يحدد محرك Playwright (chromium افتراضيًا؛
# webkit مسموح لإثبات العقد على محرك ثانٍ — الأدلة تُسجل بلاحقة المحرك)
ENGINE = os.environ.get("MICRO_TEST_ENGINE", "chromium")
SUFFIX = "" if ENGINE == "chromium" else f"-{ENGINE}"

BRIEF_BARS = "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه."
BRIEF_DONUT = "تعذر رسم التوزيع كنسب. القيم معروضة في المفتاح دون نسب."
# ما لا يجوز ظهوره في رسالة المستخدم أو الملاحظة الظاهرة (R8-07: لا أسماء سمات ولا تعليمات)
FORBIDDEN_UI = ["data-max", "data-total", "data-overscale", "data-scale", "rescale", "صحّح", "<", '"', "HTML"]


def log(m):
    print(m)
    log_lines.append(m)


def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))


BASE_CSS = """
  <link rel="stylesheet" href="shared/tokens.css">
  <link rel="stylesheet" href="shared/motion.css">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <style>body{font-family:var(--micro-font-family);margin:12px;max-width:400px;direction:rtl}</style>
"""

PAGE = """<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<base href="{base}/">
{css}
<link rel="stylesheet" href="components/data/data.css">
<script src="components/data/data.js"></script>
</head><body>
<div id="host"></div>
<div id="shot" style="display:flex;gap:16px;flex-wrap:wrap;margin-top:16px"></div>
</body></html>"""

# يقرأ حالة الرسم كاملة عند لحظة معينة (بعد render أو أثناء حدث rendered)
SNAP_FN = """(sel) => {
  const c = document.querySelector(sel);
  return {
    kind: c.getAttribute('data-chart'),
    svg: !!c.querySelector('svg'),
    err: c.querySelector('.m-chart__error') ? c.querySelector('.m-chart__error').textContent : null,
    note: c.querySelector('.m-chart__scale-note') ? c.querySelector('.m-chart__scale-note').textContent : null,
    state: c.getAttribute('data-scale-state'),
    detail: c.getAttribute('data-scale-detail'),
    center: c.querySelector('.m-donut__center') ? c.querySelector('.m-donut__center').textContent : null,
    slices: c.querySelectorAll('circle[stroke-dasharray]').length,
    dots: c.querySelectorAll('.m-chart__dot').length,
    polys: c.querySelectorAll('polyline').length,
    readings: c.querySelector('.m-legend') ? [...c.querySelectorAll('.m-legend__value')].map(e => e.textContent) : null
  };
}"""

# تثبيت مستمع يلتقط الحالة في لحظة إطلاق micro-data:rendered (قبل عودة render)
ARM_EVENT = """() => {
  window.__r8ev = null;
  document.addEventListener('micro-data:rendered', (e) => {
    const c = e.target;
    window.__r8ev = {
      kind: e.detail && e.detail.kind,
      svg: !!c.querySelector('svg'),
      err: c.querySelector('.m-chart__error') ? c.querySelector('.m-chart__error').textContent : null,
      state: c.getAttribute('data-scale-state'),
      detail: c.getAttribute('data-scale-detail')
    };
  }, true);
}"""


def ui_purity_ok(snap):
    """رسالة المستخدم/الملاحظة الظاهرة خالية من أسماء السمات والتعليمات."""
    texts = [t for t in (snap.get("err"), snap.get("note")) if t]
    return all(not any(f in t for f in FORBIDDEN_UI) for t in texts)


def main(out_dir: Path = None, port: int = 0):
    global OUT
    # SAMSUNG-ONEUI-REPAIR-R1 (الوكيل 4 — رجعية 2026-10-07): --out/--port
    # لمخرجات معزولة دون الكتابة فوق reviews/UI-COMPLETION التاريخي
    # + منفذ نطاق الوكيل 4 (4400-4419). الافتراضات كما كانت.
    if out_dir is not None:
        OUT = out_dir
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    BASE = f"http://127.0.0.1:{server.server_address[1]}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log("# فحص R8-07a/R8-07b — نص المستخدم مقابل التشخيص ودورة حياة التشخيص — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree}")
    log(f"# المحرك: {ENGINE} (Playwright) — لا ادعاء جهاز أو قارئ شاشة")
    log("")

    errors = []
    with sync_playwright() as pw:
        if not hasattr(pw, ENGINE):
            raise RuntimeError(f"Unknown MICRO_TEST_ENGINE: {ENGINE}")
        browser = getattr(pw, ENGINE).launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.set_content(PAGE.format(base=BASE, css=BASE_CSS))
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        page.evaluate("() => { window.MicroData && MicroData.init(); }")

        def mount(kind, lis, attrs=""):
            """عقدة جديدة تُثبت مرة واحدة وتُعاد استخدامها في كل الانتقالات."""
            page.evaluate(
                """([kind, lis, attrs]) => {
                  const host = document.getElementById('host');
                  host.innerHTML = `<div class="m-chart" data-chart="${kind}" ${attrs} data-title="t" id="r8c">
                     <ul class="m-chart__data" hidden>${lis}</ul>
                     <div class="m-chart__plot" data-plot></div></div>`;
                  MicroData.render(host.querySelector('[data-chart]'));
                }""", [kind, lis, attrs])
            return page.evaluate(SNAP_FN, "#r8c")

        def transition(attrs):
            """تعديل السمات على العقدة نفسها ثم render مع التقاط حدث rendered."""
            page.evaluate(ARM_EVENT)
            page.evaluate(
                """(attrs) => {
                  const c = document.getElementById('r8c');
                  for (const [k, v] of Object.entries(attrs.set)) {
                    if (v === null) c.removeAttribute(k); else c.setAttribute(k, v);
                  }
                  MicroData.render(c);
                }""", attrs)
            ev = page.evaluate("() => window.__r8ev")
            snap = page.evaluate(SNAP_FN, "#r8c")
            return ev, snap

        def event_sync_ok(ev, snap):
            """حدث rendered يطلق بعد كتابة التشخيص: الحالة عند الحدث تطابق ما بعد الرسم."""
            return (ev is not None and ev["kind"] == snap["kind"]
                    and ev["state"] == snap["state"] and ev["detail"] == snap["detail"]
                    and ev["err"] == snap["err"] and ev["svg"] == snap["svg"])

        LIS_5_10 = '<li data-series="a" data-label="أ" data-value="5"></li><li data-series="b" data-label="ب" data-value="10"></li>'
        LIS_60_30_20 = ('<li data-series="a" data-label="مكتمل" data-value="60"></li>'
                        '<li data-series="b" data-label="قيد التجهيز" data-value="30"></li>'
                        '<li data-series="c" data-label="متأخر" data-value="20"></li>')

        # ================= bars: عقدة واحدة عبر كل الانتقالات =================
        s = mount("bars", LIS_5_10, 'data-max="5"')
        check("R07.1 bars [5,10] على max=5: رفض برسالة موجزة وstate=over والتشخيص يحمل 10 (نقاء بلا أسماء سمات)",
              not s["svg"] and s["err"] == BRIEF_BARS and s["state"] == "over"
              and "10" in (s["detail"] or "") and ui_purity_ok(s), str(s["state"]))

        ev, s = transition({"set": {"data-max": "20"}})
        check("R07.2 (R8-07b) over→ok على العقدة نفسها: SVG سليم والتشخيص القديم اختفى تمامًا (كان يبقى over)",
              s["svg"] and s["err"] is None and s["state"] is None and s["detail"] is None,
              f"state={s['state']} err={s['err']}")
        check("R07.3 over→ok: حدث rendered متزامن مع الحالة السليمة (بلا تشخيص)",
              event_sync_ok(ev, s), str(ev))

        ev, s = transition({"set": {"data-max": "bad"}})
        check("R07.4 ok→invalid: رفض صريح برسالة موجزة وstate=invalid والتشخيص يحمل القيمة الخام",
              not s["svg"] and s["err"] == BRIEF_BARS and s["state"] == "invalid"
              and "bad" in (s["detail"] or "") and ui_purity_ok(s), str(s["state"]))
        check("R07.5 ok→invalid: حدث rendered متزامن مع التشخيص الجديد",
              event_sync_ok(ev, s), str(ev))

        ev, s = transition({"set": {"data-max": "20"}})
        check("R07.6 invalid→ok على العقدة نفسها: رسم سليم وتشخيص مُمسوح",
              s["svg"] and s["state"] is None and s["detail"] is None and s["err"] is None, str(s["state"]))

        ev, s = transition({"set": {"data-max": "5", "data-overscale": "rescale"}})
        check("R07.7 ok→over-rescaled: رسم بمقياس موسّع وملاحظة ظاهرة موجزة وstate=over-rescaled",
              s["svg"] and s["state"] == "over-rescaled" and s["note"] is not None
              and "10" in s["note"] and "5" in s["note"] and ui_purity_ok(s), str(s["state"]))

        ev, s = transition({"set": {"data-max": None, "data-overscale": None}})
        check("R07.8 (R8-07b) over-rescaled→auto: مقياس تلقائي سليم والملاحظة والتشخيص القديم اختفيا",
              s["svg"] and s["state"] is None and s["detail"] is None and s["note"] is None and s["err"] is None,
              f"state={s['state']} note={s['note']}")
        check("R07.9 over-rescaled→auto: حدث rendered متزامن (بلا تشخيص ولا ملاحظة)",
              event_sync_ok(ev, s), str(ev))

        ev, s = transition({"set": {"data-max": "5"}})
        check("R07.10 العودة إلى الخطأ (ok→over): الرفض يعود بتشخيص الدورة الحالية وحدها",
              not s["svg"] and s["err"] == BRIEF_BARS and s["state"] == "over" and "10" in (s["detail"] or ""),
              str(s["state"]))
        check("R07.11 العودة إلى الخطأ: حدث rendered متزامن مع تشخيص الرفض",
              event_sync_ok(ev, s), str(ev))

        # إعادة إنتاج المراجعة الحرفية: max=5 ثم 20 — يجب ألا يبقى state=over
        mount("bars", LIS_5_10, 'data-max="5"')
        ev, s = transition({"set": {"data-max": "20"}})
        check("R07.12 إعادة إنتاج R8-07b الحرفية: بعد data-max=20 لا يبقى state=over ولا detail يقول إن 5 مرفوض",
              s["svg"] and s["state"] != "over" and s["state"] is None and s["detail"] is None,
              f"state={s['state']}")

        # ================= line: عقدة مستقلة =================
        s = mount("line", LIS_5_10, 'data-max="5"')
        check("R07.13 line [5,10] على max=5: رفض موجز وstate=over",
              not s["svg"] and s["err"] == BRIEF_BARS and s["state"] == "over" and ui_purity_ok(s), str(s["state"]))
        ev, s = transition({"set": {"data-max": "20"}})
        check("R07.14 line over→ok: نقطتان مرسومتان والتشخيص مُمسوح ومتزامن مع الحدث",
              s["svg"] and s["polys"] == 1 and s["state"] is None and s["detail"] is None
              and event_sync_ok(ev, s), f"state={s['state']}")

        # ================= donut: عقدة واحدة (مجموع 110) =================
        s = mount("donut", LIS_60_30_20, "")
        check("R07.15 donut بلا مقام: توزيع سليم 3 شرائح بنسب وحالة سليمة بلا تشخيص",
              s["svg"] and s["slices"] == 3 and s["state"] is None and s["detail"] is None
              and s["err"] is None and s["center"] == "110", str(s["state"]))

        ev, s = transition({"set": {"data-total": "abc"}})
        check("R07.16 (R8-07a) donut مقام غير رقمي: رسالة موجزة موحدة وstate=invalid والتشخيص يحمل abc",
              s["err"] == BRIEF_DONUT and s["state"] == "invalid" and "abc" in (s["detail"] or "")
              and s["slices"] == 0 and s["center"] is None and ui_purity_ok(s), str(s["state"]))

        ev, s = transition({"set": {"data-total": "110"}})
        check("R07.17 (R8-07b) donut error→valid على العقدة نفسها: شرائح وعودة النسب واختفاء الرسالة والتشخيص",
              s["slices"] == 3 and s["err"] is None and s["state"] is None and s["detail"] is None
              and s["center"] == "110" and s["readings"] is not None
              and any("%" in r for r in (s["readings"] or [])), f"state={s['state']} err={s['err']}")
        check("R07.18 donut error→valid: حدث rendered متزامن مع الحالة السليمة",
              event_sync_ok(ev, s), str(ev))

        ev, s = transition({"set": {"data-total": "100"}})
        check("R07.19 العودة إلى الخطأ (valid→over): مجموع 110 يتجاوز 100 — رسالة موجزة وstate=over والتشخيص يحمل 110",
              s["err"] == BRIEF_DONUT and s["state"] == "over" and "110" in (s["detail"] or "")
              and s["slices"] == 0 and ui_purity_ok(s), str(s["state"]))

        ev, s = transition({"set": {"data-total": "-5"}})
        check("R07.20 donut مقام سالب (C2): state=invalid والتشخيص يذكر السالب",
              s["err"] == BRIEF_DONUT and s["state"] == "invalid" and "سالب" in (s["detail"] or ""), str(s["state"]))

        ev, s = transition({"set": {"data-total": "0"}})
        check("R07.21 donut مقام صفر مع قيم موجبة (C2): state=conflict والتشخيص يذكر التعارض",
              s["err"] == BRIEF_DONUT and s["state"] == "conflict"
              and "تعارض" in (s["detail"] or "") and ui_purity_ok(s), str(s["state"]))

        ev, s = transition({"set": {"data-total": "110"}})
        check("R07.22 donut conflict→valid: عودة التوزيع السليم ومسح التشخيص",
              s["slices"] == 3 and s["state"] is None and s["detail"] is None and s["err"] is None
              and event_sync_ok(ev, s), f"state={s['state']}")

        # ================= لقطة حالات للمراجعة البصرية =================
        page.evaluate(
            """() => {
              const shot = document.getElementById('shot');
              shot.innerHTML =
                '<div style="width:230px"><div class="m-chart" data-chart="donut" data-total="100" data-title="t">' +
                '<ul class="m-chart__data" hidden><li data-series="a" data-label="مكتمل" data-value="60"></li>' +
                '<li data-series="b" data-label="قيد التجهيز" data-value="30"></li>' +
                '<li data-series="c" data-label="متأخر" data-value="20"></li></ul>' +
                '<div class="m-chart__plot m-donut" data-plot></div></div><p>رفض donut: رسالة موجزة + مفتاح خام</p></div>' +
                '<div style="width:230px"><div class="m-chart" data-chart="donut" data-total="110" data-title="t">' +
                '<ul class="m-chart__data" hidden><li data-series="a" data-label="مكتمل" data-value="60"></li>' +
                '<li data-series="b" data-label="قيد التجهيز" data-value="30"></li>' +
                '<li data-series="c" data-label="متأخر" data-value="20"></li></ul>' +
                '<div class="m-chart__plot m-donut" data-plot></div></div><p>نفس العقدة بعد 110: توزيع سليم بلا تشخيص</p></div>';
              MicroData.init(shot);
            }""")
        page.wait_for_timeout(150)
        page.locator("#shot").screenshot(path=str(OUT / "screenshots" / f"r8-07-states{SUFFIX}.png"))

        check("A0 لا أخطاء JavaScript أثناء الفحص", len(errors) == 0, "; ".join(errors[:3]))
        browser.close()

    passed = sum(1 for _, ok in results if ok)
    log("")
    log(f"# النتيجة: {passed}/{len(results)}")
    (OUT / f"verification-r8-07{SUFFIX}.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")
    if passed != len(results):
        sys.exit(1)


if __name__ == "__main__":
    import argparse
    _ap = argparse.ArgumentParser()
    _ap.add_argument("--out", default="", help="دليل إخراج معزول (افتراضي: reviews/UI-COMPLETION التاريخي)")
    _ap.add_argument("--port", type=int, default=0, help="منفذ الخادم (0 تلقائي؛ REPAIR-R1: 4400-4419)")
    _a = _ap.parse_args()
    main(Path(_a.out).resolve() if _a.out else None, _a.port)
