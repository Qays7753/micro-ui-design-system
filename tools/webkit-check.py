#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص WebKit آلي (حدود معلنة). من الجذر:
  python3 tools/webkit-check.py

نطاقه: دخان آلي على اللوحتين المتأثرتين بهذه الجولة على محرك Playwright WebKit
(headless) — لوحة البيانات (عقد R8-07a/b) ومقارنة info-strip (A05 المعتمد):
  - صفر أخطاء JS وصفر موارد فاشلة وخطوط محملة
  - عقد رفض donut/bars (رسالة موجزة + تشخيص الجذر) وتوزيع سليم
  - العارضان جاهزان وينقلان فعليًا (شريط + peek) وبلا ازدواج مالك
هذا ليس Safari حقيقيًا ولا جهازًا ولا قارئ شاشة — يُسجل كفحص آلي فقط.

الأدلة: reviews/UI-COMPLETION/verification-webkit.txt
"""
import http.server
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "UI-COMPLETION"
results, log_lines = [], []

BRIEF_DONUT = "تعذر رسم التوزيع كنسب. القيم معروضة في المفتاح دون نسب."
BRIEF_BARS = "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه."


def log(m):
    print(m)
    log_lines.append(m)


def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log("# فحص WebKit آلي — دخان اللوحات المتأثرة — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree}")
    log("# المحرك: WebKit (Playwright headless) — ليس Safari جهازًا حقيقيًا ولا قارئ شاشة")
    log("")

    errors = []
    with sync_playwright() as pw:
        browser = pw.webkit.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        failed = []
        page.on("response", lambda r: failed.append(f"{r.status} {r.url}") if r.status >= 400 else None)

        # ---------- لوحة البيانات: عقد R8-07 على WebKit ----------
        page.goto(base + "/previews/data/index.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        check("W1 data: صفر أخطاء JS وصفر موارد فاشلة على WebKit",
              not errors and not failed, f"js={errors[:2]} http={failed[:3]}")

        fonts = page.evaluate("() => document.fonts.status")
        check("W2 data: الخطوط المحلية محملة (status=loaded)", fonts == "loaded", fonts)

        ov = page.evaluate("() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")
        check("W3 data: 390px بلا تمرير أفقي", ov["sw"] <= ov["cw"], str(ov))

        donut_err = page.evaluate(
            """() => { const charts = [...document.querySelectorAll('#edge-cases [data-chart]')];
                 const c = charts[2];
                 return {err: c.querySelector('.m-chart__error') ? c.querySelector('.m-chart__error').textContent : null,
                         state: c.getAttribute('data-scale-state'),
                         detail: c.getAttribute('data-scale-detail') || ''}; }""")
        check("W4 data (R8-07a): رفض donut رسالة موجزة موحدة وstate=over والتشخيص يحمل 110",
              donut_err["err"] == BRIEF_DONUT and donut_err["state"] == "over"
              and "110" in donut_err["detail"], str(donut_err["state"]))

        healthy = page.evaluate(
            """() => { const c = document.querySelectorAll('#shapes .m-chart')[0];
                 return {slices: c.querySelectorAll('circle[stroke-dasharray]').length,
                         state: c.getAttribute('data-scale-state'),
                         pct: c.querySelector('.m-legend') ? c.querySelector('.m-legend').textContent.includes('(60%)') : false}; }""")
        check("W5 data (R8-07b): توزيع سليم شرائح ونسب وحالة سليمة بلا تشخيص",
              healthy["slices"] == 3 and healthy["state"] is None and healthy["pct"], str(healthy))

        # دورة حياة التشخيص على WebKit (نفس عقد R8-07b على العقدة نفسها)
        life = page.evaluate(
            """() => {
              const host = document.createElement('div');
              host.innerHTML = '<div class="m-chart" data-chart="bars" data-max="5" data-title="t" id="wk-life">' +
                '<ul class="m-chart__data" hidden><li data-series="a" data-label="أ" data-value="5"></li>' +
                '<li data-series="b" data-label="ب" data-value="10"></li></ul>' +
                '<div class="m-chart__plot" data-plot></div></div>';
              document.body.appendChild(host);
              const c = host.querySelector('[data-chart]');
              MicroData.render(c);
              const s1 = c.getAttribute('data-scale-state');
              c.setAttribute('data-max', '20');
              MicroData.render(c);
              const s2 = c.getAttribute('data-scale-state');
              const svg2 = !!c.querySelector('svg');
              const err2 = c.querySelector('.m-chart__error');
              c.removeAttribute('data-max');
              MicroData.render(c);
              const s3 = c.getAttribute('data-scale-state');
              const note3 = c.querySelector('.m-chart__scale-note');
              host.remove();
              return {s1, s2, svg2, err2: !!err2, s3, note3: !!note3};
            }""")
        check("W6 data (R8-07b): دورة كاملة over→ok→auto على WebKit — التشخيص لا يبقى من الدورة السابقة",
              life["s1"] == "over" and life["s2"] is None and life["svg2"] and not life["err2"]
              and life["s3"] is None and not life["note3"], str(life))

        # ---------- مقارنة info-strip: A05 المعتمد على WebKit ----------
        errors.clear(); failed.clear()
        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")

        check("W7 comparison: صفر أخطاء JS وصفر موارد فاشلة على WebKit",
              not errors and not failed, f"js={errors[:2]} http={failed[:3]}")

        owners = page.evaluate(
            """() => { const peek = document.querySelector('[data-info-peek]');
                 const strip = document.querySelector('[data-info-strip]:not([data-info-peek])');
                 const roots = [...document.querySelectorAll('[data-info-strip]')];
                 const stripRoot = roots.find(r => !r.hasAttribute('data-info-peek'));
                 return {peekReady: peek ? peek.hasAttribute('data-info-peek-ready') : false,
                         peekOld: peek ? peek.hasAttribute('data-info-strip-ready') : true,
                         stripReady: stripRoot ? stripRoot.hasAttribute('data-info-strip-ready') : false}; }""")
        check("W8 comparison (R8-02): مالك واحد — peek بعقده والشريط بعقده",
              owners["peekReady"] and not owners["peekOld"] and owners["stripReady"], str(owners))

        nav = page.evaluate(
            """() => { const peek = document.querySelector('[data-info-peek]');
                 const before = window.MicroInfoPeek.getIndex(peek);
                 window.MicroInfoPeek.next(peek);
                 const after = window.MicroInfoPeek.getIndex(peek);
                 window.MicroInfoPeek.prev(peek);
                 const back = window.MicroInfoPeek.getIndex(peek);
                 return {before, after, back}; }""")
        check("W9 comparison (R8-01): تنقل peek يعمل فعليًا next→+1 وprev→العودة",
              nav["before"] == 0 and nav["after"] == 1 and nav["back"] == 0, str(nav))

        strip_nav = page.evaluate(
            """() => { const roots = [...document.querySelectorAll('[data-info-strip]')];
                 const stripRoot = roots.find(r => !r.hasAttribute('data-info-peek'));
                 const next = stripRoot.querySelector('[data-info-strip-next]');
                 const pos = stripRoot.querySelector('[data-info-strip-position]');
                 const t0 = pos ? pos.textContent.trim() : null;
                 if (next) next.click();
                 const t1 = pos ? pos.textContent.trim() : null;
                 return {t0, t1, moved: t0 !== t1}; }""")
        check("W10 comparison: شريط عرض كامل ينقل بالسهم (position يتغير) — النمطان منفصلان بلا تداخل",
              strip_nav["moved"], str(strip_nav))

        browser.close()

    passed = sum(1 for _, ok in results if ok)
    log("")
    log(f"# النتيجة: {passed}/{len(results)}")
    (OUT / "verification-webkit.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")
    if passed != len(results):
        sys.exit(1)


if __name__ == "__main__":
    main()
