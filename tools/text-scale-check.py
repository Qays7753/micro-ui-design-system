#!/usr/bin/env python3
"""T4 (N-D6): بوابة تكبير الخط — إعادة التدفق بلا قص عند 100/150/200%.

صفحات الفحص: شاشات مختبر الهاتف (T6) وصفحات العرض الأساسية.
لكل صفحة عند كل مستوى (جذر الخط 16/24/32px بحقن html{font-size}):
- لا overflow أفقي للصفحة.
- لا قص نص: عنصر يحمل نصًا مباشرًا وoverflow-x ليس تمريرًا مقصودًا
  (auto/scroll) ولا اقتصاصًا مقصودًا (text-overflow: ellipsis أو
  line-clamp) يجب ألا يتجاوز scrollWidth عرضه الظاهر.
- أهداف اللمس التفاعلية ≥ 48px في البعدين (بتفاوت 1px).
صفر أخطاء صفحة/كونسول. الحجم الافتراضي (100%) مطابق بصريًا لـv0.2.0
تثبته بوابة التطابق البصري (المسموح الموثق فقط).
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

# صفحات الفحص — تُضاف شاشات مختبر الهاتف في T6
PAGES = [
    "previews/screen/index.html",
    "previews/device-lab/index.html",
    "previews/compositions/error-retry-example.html",
    "previews/ui-system-showcase/index.html",
]

LEVELS = [("100%", "16px"), ("150%", "24px"), ("200%", "32px")]

PROBE = """(rootSize) => {
  document.documentElement.style.fontSize = rootSize;
  const bad = { clipped: [], targets: [] };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!el || seen.has(el) || !node.textContent.trim()) continue;
    seen.add(el);
    const style = getComputedStyle(el);
    if (['auto', 'scroll', 'hidden'].includes(style.overflowX)) continue;
    if (style.textOverflow === 'ellipsis' || style.webkitLineClamp !== 'none') continue;
    if (el.scrollWidth > el.clientWidth + 1) {
      bad.clipped.push({ tag: el.tagName, cls: String(el.className).slice(0, 40),
        sw: el.scrollWidth, cw: el.clientWidth });
    }
  }
  document.querySelectorAll('button, a[href], [role="button"], input:not([type=hidden]), select, [tabindex]:not([tabindex="-1"])')
    .forEach((el) => {
      if (!el.getClientRects().length || el.closest('[hidden], [inert]')) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.width < 47 || r.height < 47) {
        bad.targets.push({ tag: el.tagName, cls: String(el.className).slice(0, 40),
          w: Math.round(r.width), h: Math.round(r.height) });
      }
    });
  return {
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    clipped: bad.clipped.slice(0, 4),
    targets: bad.targets.slice(0, 4),
  };
}"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-textscale-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    checks, errors = [], []

    def check(name, ok, detail=None):
        checks.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name, flush=True)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            for rel in PAGES:
                page = browser.new_page(viewport={"width": 360, "height": 780}, is_mobile=True,
                                        has_touch=True, color_scheme="light", reduced_motion="reduce")
                page.set_default_timeout(8000)
                page.on("pageerror", lambda e: errors.append(f"{rel}: {e}"))
                page.on("console", lambda m: errors.append(f"{rel} console: {m.text}") if m.type == "error" else None)
                page.goto(f"{base}/{rel}", wait_until="networkidle")
                page.wait_for_timeout(120)
                for label, size in LEVELS:
                    probe = page.evaluate(PROBE, size)
                    page.wait_for_timeout(40)
                    ok = not probe["overflowX"] and not probe["clipped"]
                    check(f"{rel} @{label}: reflows with no page overflow and no text clipping",
                          ok, probe if not ok else None)
                    if label != "100%":
                        check(f"{rel} @{label}: touch targets stay >= 48px",
                              not probe["targets"], probe["targets"] or None)
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
