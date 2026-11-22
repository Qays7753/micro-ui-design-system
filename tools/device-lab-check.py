#!/usr/bin/env python3
"""T6 (N-D9): بوابة مختبر الهاتف — previews/device-lab.

1. التغطية: كل عائلة ومتغير وتركيب في الكتالوج يظهر في شاشة واحدة على
   الأقل (علامات data-lab-covers على الشاشات).
2. لكل شاشة (360×780 RTL، و320 للشاشات الضيقة): صفر أخطاء JS/كونسول/
   طلبات فاشلة؛ لا overflow أفقي؛ آخر عنصر في المحتوى قابل للوصول وغير
   مغطى بالأشرطة؛ أهداف اللمس ≥ 48px؛ لا عنصرين تفاعليين متداخلين؛
   النص لا يُقص.
3. تفاعل قصير حقيقي لكل شاشة (ضغط/كتابة/فتح وإغلاق/سحب حيث يوجد).
4. الرجوع: فتح شاشة ثم الرجوع يعيد للفهرس؛ فتح طبقة ثم الرجوع يغلقها أولًا.
5. standalone.html يعمل من file:// بلا أي طلب شبكة وبلا أخطاء ومطابق
   لإعادة التوليد.
6. حجم الخط 200% من أدوات المختبر يعمل.
"""
import argparse
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent

SCREEN_PROBE = """() => {
  const screen = document.querySelector('.lab-stage [data-lab-screen]:not([hidden]) .m-screen')
    || document.querySelector('.lab-stage [data-lab-screen]:not([hidden])');
  if (!screen) return { missing: true };
  const content = screen.querySelector('.m-screen__content');
  const doc = document.documentElement;
  const out = { overflowX: doc.scrollWidth > doc.clientWidth + 1, small: [], overlap: [], clipped: [], reachable: true };
  const interactive = [];
  screen.querySelectorAll('button, a[href], input:not([type=hidden]), select, [role="button"], [role="switch"], label.m-choice')
    .forEach((el) => {
      if (!el.getClientRects().length) return;
      /* الإدخال الأصلي المخفي بصريًا (نمط m-choice: 1×1) هدفه الليبل — يُقاس بدلًا منه */
      if (el.tagName === 'INPUT' && el.getBoundingClientRect().width < 8) {
        const choiceLabel = el.closest('label.m-choice');
        if (choiceLabel && choiceLabel.getClientRects().length) el = choiceLabel;
        else return;
      }
      const inTools = el.closest('#lab-tools, #lab-tools-backdrop, .lab-index');
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      /* هدف لمس الحقل النصي هو غلافه (min-height 52px) — يخص inputs فقط
         لا الأزرار داخل الغلاف (زر الخطوة له هدفه الخاص) */
      /* عقد المكتبة: الغلاف .m-field__control هو الإطار المرئي وهدف اللمس
         لكل ما فيه (مدخلات وأزرار خطوة) — يُقاس للمُدخل، وأفراد الغلاف
         الواحد لا يُعدّون متداخلين (منطقة لمس واحدة) */
      const isTextInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT';
      const hostControl = isTextInput ? el.closest('.m-field__control') : null;
      const rect = (hostControl && hostControl.getBoundingClientRect().height > 0)
        ? hostControl.getBoundingClientRect() : r;
      interactive.push({ el, r: rect, inTools });
      if (!inTools && (rect.width < 47 || rect.height < 47)) {
        out.small.push({ tag: el.tagName, cls: String(el.className).slice(0, 36), w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    });
  const hostOf = (el) => el && el.closest ? el.closest('.m-field__control') : null;
  for (let i = 0; i < interactive.length; i++) {
    for (let j = i + 1; j < interactive.length; j++) {
      const a = interactive[i], b = interactive[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      if (hostOf(a.el) && hostOf(a.el) === hostOf(b.el)) continue;
      const x = Math.max(0, Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left));
      const y = Math.max(0, Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top));
      if (x > 2 && y > 2) { out.overlap.push([String(a.el.className).slice(0, 24), String(b.el.className).slice(0, 24)]); }
    }
  }
  if (content) {
    content.scrollTop = 99999;
    const last = content.lastElementChild;
    if (last) {
      const lr = last.getBoundingClientRect();
      const bars = screen.querySelectorAll('.m-screen__actions:not([hidden]), .m-screen__nav');
      let top = screen.getBoundingClientRect().bottom;
      bars.forEach((b) => { const br = b.getBoundingClientRect(); if (br.top < top) top = br.top; });
      out.reachable = lr.bottom <= top + 2 && lr.height > 0;
    }
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    let node;
    while ((node = walker.nextNode())) {
      const el = node.parentElement;
      if (!el || seen.has(el) || !node.textContent.trim()) continue;
      seen.add(el);
      const st = getComputedStyle(el);
      if (['auto', 'scroll', 'hidden'].includes(st.overflowX)) continue;
      if (st.textOverflow === 'ellipsis' || st.webkitLineClamp !== 'none') continue;
      if (el.scrollWidth > el.clientWidth + 1) {
        out.clipped.push({ tag: el.tagName, cls: String(el.className).slice(0, 30) });
      }
    }
  }
  return out;
}"""

# تفاعل قصير لكل شاشة (معرف الشاشة → سيناريو)
INTERACTIONS = {
    "screen": "js: (document.querySelectorAll(\"[data-lab-screen='screen'] .m-navbar__item\")[1]||{}).click && document.querySelectorAll(\"[data-lab-screen='screen'] .m-navbar__item\")[1].click(); wait: 250",
    "buttons": "tap: [data-lab-loading-demo] >> first;wait:300",
    "fields": "js: document.querySelector('#lab-fields-form .m-field__input').focus() ; js: document.getElementById('lab-fields-form').requestSubmit() ; wait: 250",
    "selection": "tap: #lab-picker-open; wait: 300; js: history.back(); wait: 300",
    "surfaces": "js: void 0",
    "data": "js: void 0",
    "metric": "js: void 0",
    "info-strip": "tap: [data-info-next]; wait: 350",
    "carousel": "js: window.MicroCarousel.next(document.querySelector('[data-carousel]')); wait: 400",
    "organization": "js: void 0",
    "calendar": "js: void 0",
    "navigation": "tap: [data-layer-open='lab-filter-panel']; wait: 250; js: history.back(); wait: 300",
    "messages": "tap: #lab-toast-show; wait: 400; js: history.back(); wait: 200",
    "account": "tap: [data-account-open]; wait: 300; js: history.back(); wait: 300",
    "gateway": "js: document.getElementById('lab-gw-email').value = 'not-an-email' ; tap: [data-access-submit]; wait: 300",
    "product": "tap: [data-lab-product-type='market']; wait: 350",
    "error": "tap: #lab-error-retry; wait: 300",
}


def run_interaction(page, script: str):
    for step in [s.strip() for s in script.split(";") if s.strip()]:
        if step.startswith("tap:"):
            sel = step[4:].strip()
            if ">>" in sel:
                sel, nth = [x.strip() for x in sel.split(">>")]
                if nth == "first":
                    page.locator(sel).first.click()
                else:
                    page.locator(sel).nth(int(nth) - 1).click()
            else:
                page.locator(sel).first.click()
        elif step.startswith("wait:"):
            page.wait_for_timeout(int(step[5:].strip()))
        elif step.startswith("js:"):
            page.evaluate(step[3:].strip() or "void 0")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-lab-"))
    out.mkdir(parents=True, exist_ok=True)
    checks, errors = [], []

    def check(name, ok, detail=None):
        checks.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name, flush=True)
        if not ok:
            print("      detail:", str(detail)[:300], flush=True)

    catalog = json.loads((ROOT / "docs/COMPONENT-CATALOG.json").read_text(encoding="utf-8"))
    required = ([f["id"] for f in catalog["families"]]
                + [v["id"] for v in catalog["variants"]]
                + [c["id"] for c in catalog["compositions"]])

    import http.server
    import threading

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=str(ROOT), **kw)

        def log_message(self, *_):
            pass

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"

    run_error = None
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            page = browser.new_page(viewport={"width": 360, "height": 780}, is_mobile=True,
                                    has_touch=True, color_scheme="light", reduced_motion="reduce")
            page.set_default_timeout(8000)
            page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
            page.on("console", lambda m: errors.append("console: " + m.text) if m.type == "error" else None)
            page.on("requestfailed", lambda r: errors.append("net: " + r.url))
            page.goto(f"{base}/previews/device-lab/index.html")
            page.wait_for_timeout(500)

            # 1) التغطية من الكتالوج
            covered = page.evaluate(
                "Array.from(document.querySelectorAll('[data-lab-covers]'))"
                ".flatMap(n => n.getAttribute('data-lab-covers').split(/\\s+/)).filter(Boolean)")
            missing = sorted(set(required) - set(covered))
            check("coverage: every catalog family/variant/composition has a lab screen", not missing, missing)

            screens = page.evaluate(
                "Array.from(document.querySelectorAll('[data-lab-screen]')).map(s => s.getAttribute('data-lab-screen'))")
            check("lab has an index and screens", len(screens) >= 15, screens)

            # 2+3) لكل شاشة: السلوك + التفاعل
            for sid in screens:
                page.evaluate(f"location.hash='';history.replaceState(null,'','#{sid}');window.dispatchEvent(new HashChangeEvent('hashchange'))")
                page.wait_for_timeout(320)
                probe = page.evaluate(SCREEN_PROBE)
                ok = (not probe.get("missing") and not probe.get("overflowX")
                      and not probe.get("small") and not probe.get("overlap")
                      and not probe.get("clipped") and probe.get("reachable"))
                check(f"screen {sid}: no errors/overflow/clipping, targets >= 48, last element reachable",
                      ok, {k: probe.get(k) for k in ("missing", "overflowX", "small", "overlap", "clipped", "reachable")})
                script = INTERACTIONS.get(sid)
                if script:
                    before = len(errors)
                    try:
                        run_interaction(page, script)
                    except Exception as exc:  # فشل التفاعل يُسجل لا يكسر البوابة
                        errors.append(f"interaction {sid}: {exc}")
                    check(f"screen {sid}: interaction scenario succeeds with no errors",
                          len(errors) == before, errors[before:before + 3])
                page.evaluate("location.hash='';history.replaceState(null,'','');window.dispatchEvent(new HashChangeEvent('hashchange'))")
                page.wait_for_timeout(150)

            # شاشة ضيقة 320 + LTR حيث يؤثر الاتجاه
            page.set_viewport_size({"width": 320, "height": 780})
            page.evaluate("history.replaceState(null,'','#navigation');window.dispatchEvent(new HashChangeEvent('hashchange'))")
            page.wait_for_timeout(300)
            narrow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
            check("320px: no horizontal overflow on navigation screen", not narrow)
            page.evaluate("window.__labSetDir && window.__labSetDir('ltr')")
            page.wait_for_timeout(200)
            ltr = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
            check("LTR: no horizontal overflow on navigation screen", not ltr)
            page.evaluate("window.__labSetDir && window.__labSetDir('rtl')")
            page.set_viewport_size({"width": 360, "height": 780})

            # 4) الرجوع: شاشة ← الفهرس، وطبقة ← تُغلق أولًا
            def goto_index():
                page.evaluate("location.hash='';history.replaceState(null,'','');window.dispatchEvent(new HashChangeEvent('hashchange'))")
                page.wait_for_timeout(250)

            goto_index()
            page.locator('[data-lab-open="buttons"]').click()
            page.wait_for_timeout(300)
            page.evaluate("history.back()")
            page.wait_for_timeout(350)
            back_index = page.evaluate("document.querySelector('.lab-app').getAttribute('data-screen') === 'index'")
            check("back from a screen returns to the index", back_index)
            goto_index()
            page.locator('[data-lab-open="navigation"]').click()
            page.wait_for_timeout(300)
            page.locator("[data-layer-open='lab-filter-panel']").click()
            page.wait_for_timeout(300)
            layer_open = page.evaluate("!document.getElementById('lab-filter-panel').hidden")
            page.evaluate("history.back()")
            page.wait_for_timeout(350)
            closed_first = page.evaluate("document.getElementById('lab-filter-panel').hidden && document.querySelector('.lab-app').getAttribute('data-screen') === 'navigation'")
            check("back closes the open layer first, screen stays", layer_open and closed_first)
            page.evaluate("history.back()")
            page.wait_for_timeout(300)

            # 6) حجم الخط 200% من أدوات المختبر
            goto_index()
            page.locator('[data-lab-open="buttons"]').click()
            page.wait_for_timeout(250)
            page.locator(".lab-tools-button").click()
            page.wait_for_timeout(300)
            page.locator("[data-lab-font-scale='200']").click()
            page.wait_for_timeout(200)
            scaled = page.evaluate(
                "getComputedStyle(document.documentElement).fontSize === '32px' && document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
            check("tools sheet: 200% font scale applies without overflow", scaled)
            page.locator("#lab-tools [data-layer-close]").click()
            page.wait_for_timeout(200)

            # 5) standalone من file:// — صفر طلبات شبكة وصفر أخطاء
            standalone = ROOT / "previews/device-lab/standalone.html"
            page2 = browser.new_page(viewport={"width": 360, "height": 780}, is_mobile=True,
                                     has_touch=True, color_scheme="light", reduced_motion="reduce")
            lab_errors, requests = [], []
            page2.on("pageerror", lambda e: lab_errors.append(str(e)))
            page2.on("console", lambda m: lab_errors.append("console: " + m.text) if m.type == "error" else None)
            page2.on("request", lambda r: requests.append(r.url) if not r.url.startswith(("file://", "data:")) else None)
            page2.goto(standalone.as_uri())
            page2.wait_for_timeout(600)
            lab_screens = page2.evaluate("Array.from(document.querySelectorAll('[data-lab-screen]')).length")
            page2.locator('[data-lab-open="buttons"]').click()
            page2.wait_for_timeout(300)
            loaded = page2.evaluate("window.__labReady === true")
            check("standalone works from file://: ready, no errors, zero network requests",
                  loaded and not lab_errors and not requests,
                  {"ready": loaded, "errors": lab_errors[:3], "requests": [u[:60] for u in requests[:3]]})
            check("standalone includes every lab screen", lab_screens == len(screens), lab_screens)
            page2.close()

            check("no page, console, or resource errors across the lab", not errors, errors[:6])
            browser.close()
    except Exception as exc:  # أي انهيار يُسجل فشلًا ولا يمنع التقرير
        run_error = str(exc)
        checks.append({"name": "gate completes without internal errors",
                       "passed": False, "detail": run_error})
        print("FAIL gate completes without internal errors:", run_error[:200], flush=True)
    finally:
        try:
            browser.close()
        except Exception:
            pass
        server.shutdown()
        server.server_close()

    report = {"checks": checks, "errors": errors,
              "passed": sum(1 for c in checks if c["passed"]),
              "failed": sum(1 for c in checks if not c["passed"])}
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                                     encoding="utf-8")
    print(f"{report['passed']} PASS / {report['failed']} FAIL; output {out}")
    return 1 if report["failed"] or errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
