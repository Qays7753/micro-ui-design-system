#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMSUNG-ONEUI-REPAIR-R1 — الوكيل 4: مسبار مراجعة عائلة metric-comparison (E03)
مراجعة KEEP/IMPROVE بقياس فعلي (لا انحدار):
  - حماية اللف overflow-wrap: anywhere على الرقم الرئيسي وتسميات الدوائر
    وfallback (مقيسة computed).
  - رقم طويل (16 خانة) في البطاقة الرئيسية عند 320+200% (ZOOM2_CLEAN):
    مستطيله داخل البطاقة (لا فيض) — القيمة كاملة في DOM.
  - عقد الغياب: data-state="unavailable" يعرض «غير متاح» (لا صفر مخترع)
    والصفر علامة مجوفة بقراءة صريحة.
المخرجات: evidence/agent4/regression/family-metric-comparison/results.json + log.txt
NOT RUN: أجهزة فعلية/لمس/TalkBack/WebKit/native zoom.
"""
import json
import threading
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parents[5]
OUT = REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent4" / "regression" / "family-metric-comparison"
BROWSER = "/home/z/my-project/evidence/bin/chromium"
PORT = 4407  # نطاق الوكيل 4
PAGE = "/components/metric-comparison/example-usage.html"

results, lines = [], []


def log(m):
    print(m)
    lines.append(m)


def check(name, ok, detail=""):
    results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:400]})
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + str(detail)[:200]) if detail else ""))


ZOOM2 = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  els.forEach((el) => {
    if (el.dataset.fz === undefined) {
      el.dataset.fz = '1';
      el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * 2) + 'px';
    }
  });
  return true;
}"""

PROBE = """() => {
  const num = document.querySelector('.m-main-metric__number');
  const card = num.closest('.m-main-metric') || num.closest('article, section, div');
  const cr = card.getBoundingClientRect(), nr = num.getBoundingClientRect();
  const wraps = [...document.querySelectorAll('.m-main-metric__number, .m-metric-circles__fallback-label, .m-metric-circles__fallback-reading')]
    .map((el) => getComputedStyle(el).overflowWrap);
  return { numText: num.textContent, numInside: nr.left >= cr.left - 0.5 && nr.right <= cr.right + 0.5 && nr.top >= cr.top - 0.5 && nr.bottom <= cr.bottom + 0.5,
           numRect: {l: +nr.left.toFixed(1), r: +nr.right.toFixed(1), t: +nr.top.toFixed(1), b: +nr.bottom.toFixed(1)},
           cardRect: {l: +cr.left.toFixed(1), r: +cr.right.toFixed(1)},
           wrapAll: wraps.every((w) => w === 'anywhere'), wrapValues: [...new Set(wraps)] };
}"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    from functools import partial
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), partial(H, directory=str(REPO)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{PORT}"
    errors = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=BROWSER,
                                     args=["--no-sandbox", "--disable-dev-shm-usage"])
        page = browser.new_page(viewport={"width": 320, "height": 844})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(base + PAGE)
        page.wait_for_load_state("load")
        page.evaluate("() => document.fonts.ready")
        page.wait_for_timeout(300)

        p0 = page.evaluate(PROBE)
        check("حماية اللف overflow-wrap: anywhere على الرقم الرئيسي وتسميات fallback (مقيسة)",
              p0["wrapAll"], {"wrapValues": p0["wrapValues"]})

        # رقم طويل 16 خانة عند 320+200%
        page.evaluate("""() => {
          const num = document.querySelector('.m-main-metric__number');
          num.textContent = '1234567890123456';
          return true;
        }""")
        page.evaluate(ZOOM2)
        page.wait_for_timeout(250)
        p1 = page.evaluate(PROBE)
        check("رقم 16 خانة عند 320+200%: مستطيله داخل البطاقة (يلتف لا يفيض)",
              p1["numInside"] and p1["numText"] == "1234567890123456", p1)

        # عقد الغياب: unavailable يعرض «غير متاح» لا صفرًا (بنية المصدر الفعلية)
        un = page.evaluate("""() => {
          const host = document.createElement('div');
          host.innerHTML = '<section class="m-metric-circles" data-metric-circles data-radius="72">' +
            '<ul class="m-metric-circles__source" data-metric-source hidden>' +
            '<li data-label="مؤشر غائب" data-value="" data-state="unavailable"></li>' +
            '<li data-label="صفر صريح" data-value="0"></li></ul>' +
            '<ol class="m-metric-circles__items" data-metric-items></ol>' +
            '<ul class="m-metric-circles__fallback" data-metric-fallback></ul></section>';
          document.body.appendChild(host);
          try { window.MicroMetricComparison && MicroMetricComparison.init(host); } catch (e) {}
          const txt = host.textContent || '';
          const items = [...host.querySelectorAll('[data-metric-items] li')];
          const fb = [...host.querySelectorAll('[data-metric-fallback] li')].map((li) => li.textContent || '');
          const out = { hasUnavailable: txt.indexOf('غير متاح') >= 0,
                        fallbackHasLabel: fb.some((t) => t.indexOf('مؤشر غائب') >= 0 && t.indexOf('غير متاح') >= 0),
                        liStates: items.map((li) => li.getAttribute('data-state')) };
          host.remove();
          return out;
        }""")
        check("الغياب «غير متاح» (لا صفر مخترع) والصفر قراءة صريحة (عقد المواصفة)",
              un["hasUnavailable"] and un["fallbackHasLabel"] and "zero" in un["liStates"], un)

        check("صفر أخطاء JavaScript", not errors, errors[:3])
        browser.close()
    srv.shutdown()

    passed = sum(1 for r in results if r["ok"])
    log("")
    log(f"# النتيجة: {passed}/{len(results)}")
    (OUT / "results.json").write_text(json.dumps({
        "tool": "evidence/agent4/scripts/a4_family_metric_probe.py",
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "browser": "Chromium 143.0.7499.4 — Playwright sync",
        "server": f"http://127.0.0.1:{PORT} (نطاق الوكيل 4)",
        "not_run": ["أجهزة فعلية/لمس", "قارئ شاشة فعلي", "WebKit", "native zoom"],
        "checks": results, "summary": {"passed": passed, "total": len(results)},
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "log.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return passed == len(results)


if __name__ == "__main__":
    import sys
    sys.exit(0 if main() else 1)
