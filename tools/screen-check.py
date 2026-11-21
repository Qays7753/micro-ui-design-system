#!/usr/bin/env python3
"""T3 (N-D5): بوابة عائلة screen — هيكل شاشة الهاتف.

عند 360×780 و320×780 RTL على صفحة مضمّنة تستهلك dist/iife/screen.js:
- المحتوى يتمرر داخليًا والصفحة نفسها لا تتمرر.
- لا overflow أفقي.
- آخر عنصر في المحتوى قابل للوصول (scrollIntoView) وغير مغطى بالأشرطة.
- محاكاة لوحة مفاتيح (visualViewport وهمي قابل للضبط قبل تحميل
  السكربت) تبقي الحقل المركّز ظاهرًا وترفع شريط keyboard-follow
  وتخفي keyboard-hide.
- الحواف الآمنة مطبقة بمحاكاة قيم CSS مخصصة (--m-screen-safe-*).
- update() يعيد قياس الأشرطة، وdestroy() يزيل الحالة.
- صفر أخطاء صفحة/كونسول/موارد فاشلة.
"""
import argparse
import http.server
import json
import sys
import tempfile
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent

PAGE = """<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>فحص هيكل الشاشة</title><link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/buttons/buttons.css">
<link rel="stylesheet" href="/components/navigation/navigation.css">
<link rel="stylesheet" href="/components/screen/screen.css">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { background: var(--micro-surface-page); font-family: var(--micro-font-family); }
  .demo-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--micro-border-divider); }
  .demo-field { display: block; width: 100%; min-height: 52px; margin-top: 10px; padding: 12px; font: inherit;
    border: 1px solid var(--micro-border-control); border-radius: var(--micro-radius-field); background: var(--micro-surface); }
</style>
<script>
/* محاكي visualViewport قبل تحميل السكربت: قابل للضبط من الفحص */
(function () {
  var listeners = [];
  var mock = {
    height: window.innerHeight, width: window.innerWidth, offsetTop: 0, offsetLeft: 0, scale: 1,
    addEventListener: function (t, f) { if (listeners.indexOf(f) < 0) listeners.push(f); },
    removeEventListener: function (t, f) { listeners = listeners.filter(function (x) { return x !== f; }); },
    __set: function (height, top) { mock.height = height; mock.offsetTop = top || 0;
      listeners.forEach(function (f) { f({ type: 'resize' }); }); },
    __reset: function () { mock.__set(window.__realHeight); },
  };
  window.__realHeight = window.innerHeight;
  Object.defineProperty(window, 'visualViewport', { value: mock, configurable: true });
  window.__mockVV = mock;
})();
</script>
</head><body>
<div class="m-screen" data-micro-screen id="screen-a">
  <header class="m-screen__top"><div class="m-appbar">
    <button class="m-btn m-btn--icon m-btn--secondary" type="button" aria-label="رجوع">‹</button>
    <span class="m-appbar__title">حساب الورشة</span>
  </div></header>
  <main class="m-screen__content" id="content-a">
    <section class="m-screen__section"><h2>ملخص</h2>
      <div class="demo-row"><span>صافي الفترة</span><strong>870 د.أ</strong></div>
      <div class="demo-row"><span>عدد العمليات</span><strong>3</strong></div>
    </section>
    <section class="m-screen__section"><h2>نموذج</h2>
      <label>اسم العملية<input class="demo-field" type="text" id="field-title"></label>
      <label>المبلغ<input class="demo-field" type="text" inputmode="decimal" id="field-amount"></label>
      <label>ملاحظات<input class="demo-field" type="text" id="field-note"></label>
      <label>تفاصيل إضافية<input class="demo-field" type="text" id="field-extra"></label>
    </section>
    <section class="m-screen__section" id="last-a"><h2>قسم أخير</h2><p>آخر عنصر قابل للوصول.</p></section>
  </main>
  <footer class="m-screen__actions" data-actions="keyboard-follow" id="actions-a">
    <button class="m-btn m-btn--primary" type="button" id="primary-a">حفظ العملية</button>
  </footer>
  <nav class="m-screen__nav" id="nav-a">
    <nav class="m-navbar" role="navigation" aria-label="تنقل الفحص">
      <button type="button" class="m-navbar__item" aria-current="page">الرئيسية</button>
      <button type="button" class="m-navbar__item">الطلبات</button>
    </nav>
  </nav>
</div>
<script src="/dist/iife/screen.js"></script>
</body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == "/screen-fixture.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(PAGE.encode("utf-8"))
        else:
            super().do_GET()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-screen-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}/screen-fixture.html"
    checks, errors = [], []

    def check(name, ok, detail=None):
        checks.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name, flush=True)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            for width in (360, 320):
                page = browser.new_page(viewport={"width": width, "height": 780}, is_mobile=True,
                                        has_touch=True, color_scheme="light", reduced_motion="reduce")
                page.set_default_timeout(5000)
                page.on("pageerror", lambda e: errors.append(f"{e}"))
                page.on("console", lambda m: errors.append("console: " + m.text) if m.type == "error" else None)
                page.on("requestfailed", lambda r: errors.append("net: " + r.url))
                page.goto(url)
                page.wait_for_timeout(150)
                w = str(width)

                # 1) التمرير الداخلي فقط + لا overflow أفقي
                scroll = page.evaluate("""() => {
                  const c = document.getElementById('content-a');
                  c.scrollTop = 99999;
                  return { content: c.scrollTop > 0,
                    page: document.scrollingElement.scrollTop,
                    pageScrollable: document.scrollingElement.scrollHeight > window.innerHeight + 1,
                    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1 };
                }""")
                check(f"{w}: content scrolls internally and page does not",
                      scroll["content"] and not scroll["pageScrollable"] and scroll["page"] == 0 and not scroll["overflowX"],
                      scroll)

                # 2) آخر عنصر قابل للوصول وغير مغطى
                reach = page.evaluate("""() => {
                  const last = document.getElementById('last-a');
                  const c = document.getElementById('content-a');
                  const actions = document.getElementById('actions-a');
                  last.scrollIntoView({ block: 'end' });
                  const r = last.getBoundingClientRect();
                  const a = actions.getBoundingClientRect();
                  return { bottom: r.bottom, actionsTop: a.top, uncovered: r.bottom <= a.top + 1,
                    insideViewport: r.bottom <= window.innerHeight + 1 };
                }""")
                check(f"{w}: last content element reachable and uncovered by bars",
                      reach["uncovered"] and reach["insideViewport"], reach)

                # 3) لوحة المفاتيح: الحقل المركّز يبقى ظاهرًا + الشريط يرتفع
                kb = page.evaluate("""() => {
                  const note = document.getElementById('field-note');
                  note.focus();
                  const vv = window.__mockVV;
                  vv.__set(vv.height - 300, 0);   /* لوحة مفاتيح 300px */
                  return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
                }""")
                kb_state = page.evaluate("""() => {
                  const screen = document.getElementById('screen-a');
                  const note = document.getElementById('field-note');
                  const actions = document.getElementById('actions-a');
                  const kb = parseFloat(getComputedStyle(screen).getPropertyValue('--m-screen-keyboard')) || 0;
                  const r = note.getBoundingClientRect();
                  const t = actions.getBoundingClientRect();
                  return { state: screen.getAttribute('data-keyboard'), kb: kb,
                    fieldBottom: r.bottom, actionsTop: t.top,
                    fieldVisible: r.bottom <= window.__mockVV.height + 1 };
                }""")
                check(f"{w}: keyboard opens → focused field stays visible above keyboard",
                      kb_state["state"] == "true" and kb_state["kb"] >= 299 and kb_state["fieldVisible"],
                      kb_state)
                check(f"{w}: keyboard-follow actions bar rises above keyboard",
                      kb_state["actionsTop"] >= 0 and kb_state["actionsTop"] < 780 - kb_state["kb"] + 1,
                      {"actionsTop": kb_state["actionsTop"], "kb": kb_state["kb"]})

                # 4) إغلاق اللوحة يرجع الحالة
                page.evaluate("window.__mockVV.__reset()")
                page.wait_for_timeout(60)
                closed = page.evaluate(
                    "document.getElementById('screen-a').getAttribute('data-keyboard')")
                check(f"{w}: keyboard close resets state", closed == "false", closed)

                # 5) الحواف الآمنة بمحاكاة قيم مخصصة
                safe = page.evaluate("""() => {
                  const screen = document.getElementById('screen-a');
                  const top = document.querySelector('.m-screen__top');
                  const nav = document.getElementById('nav-a');
                  screen.style.setProperty('--m-screen-safe-top', '44px');
                  screen.style.setProperty('--m-screen-safe-bottom', '34px');
                  return { top: getComputedStyle(top).paddingTop,
                    navBottom: getComputedStyle(nav).paddingBottom };
                }""")
                check(f"{w}: safe areas applied from simulated insets",
                      safe["top"] == "44px" and safe["navBottom"] == "34px", safe)

                # 6) update() يعيد قياس الأشرطة + destroy ينظف
                life = page.evaluate("""() => {
                  const screen = document.getElementById('screen-a');
                  const actions = document.getElementById('actions-a');
                  const before = getComputedStyle(screen).getPropertyValue('--m-screen-actions-h');
                  const btn = document.createElement('button');
                  btn.type = 'button'; btn.className = 'm-btn';
                  btn.style.minHeight = '72px'; btn.textContent = 'إجراء طويل القياس';
                  actions.appendChild(btn);
                  MicroScreen.update(document.getElementById('screen-a'));
                  const after = getComputedStyle(screen).getPropertyValue('--m-screen-actions-h');
                  const inst = MicroScreen.getInstance(document.getElementById('screen-a'));
                  MicroScreen.destroy(document.getElementById('screen-a'));
                  const cleared = screen.getAttribute('data-keyboard') === null
                    && !screen.style.getPropertyValue('--m-screen-actions-h')
                    && MicroScreen.getInstance(document.getElementById('screen-a')) === null;
                  return { before: before.trim(), after: after.trim(), cleared: cleared, hadInstance: !!inst };
                }""")
                check(f"{w}: update() re-measures bars after content change",
                      life["hadInstance"] and life["after"] not in ("", "0px") and life["after"] != life["before"], life)
                check(f"{w}: destroy() clears state and instance", life["cleared"], life)

                # إعادة init بعد destroy تعيد القياس
                rebound = page.evaluate("""() => {
                  MicroScreen.init();
                  const screen = document.getElementById('screen-a');
                  const h = getComputedStyle(screen).getPropertyValue('--m-screen-actions-h');
                  return { h: h.trim(), inst: !!MicroScreen.getInstance(document.getElementById('screen-a')) };
                }""")
                check(f"{w}: init after destroy rebinds and re-measures",
                      rebound["inst"] and rebound["h"] not in ("", "0px"), rebound)

                page.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    check("no page, console, or resource errors", not errors, errors[:6])
    report = {"checks": checks, "errors": errors,
              "passed": sum(1 for c in checks if c["passed"]),
              "failed": sum(1 for c in checks if not c["passed"])}
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                                     encoding="utf-8")
    print(f"{report['passed']} PASS / {report['failed']} FAIL; output {out}")
    return 1 if report["failed"] or errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
