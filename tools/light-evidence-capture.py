#!/usr/bin/env python3
"""Same-fixture before/after chart evidence from Git baseline and live sources."""
import argparse
import hashlib
import http.server
import importlib.util
import json
import mimetypes
from pathlib import Path
import subprocess
import threading
from urllib.parse import unquote, urlsplit

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent
BASE = "161bb71adbed86e0df4382174cb07bd2fcb8d62d"
module_spec = importlib.util.spec_from_file_location("light_data_fixture", ROOT / "tools/light-data-check.py")
fixture_module = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(fixture_module)
FIXTURE = fixture_module.FIXTURE
SELECTORS = {
    "bars": "#bars", "line": "#signed", "donut": "#donut", "bubbles": "#bubbles",
    "packed": "#packed", "metric-circles": "#metric-circles", "main-flat": "#main-flat",
    "main-featured": "#main-featured", "stats": ".m-stat", "progress": ".m-progress",
    "steps": ".m-steps", "table": "#donut .m-chart__dataset",
}


class Handler(http.server.BaseHTTPRequestHandler):
    cache = {}

    def log_message(self, *_):
        pass

    def do_GET(self):
        parts = unquote(urlsplit(self.path).path).lstrip("/").split("/", 1)
        if len(parts) != 2 or parts[0] not in ("before", "after"):
            return self.send_error(404)
        phase, rel = parts
        if rel == "light-data-fixture.html":
            # Keep the source fixture identical; relative dependencies stay in phase.
            payload = FIXTURE.replace('href="/', f'href="/{phase}/').replace('src="/', f'src="/{phase}/').encode()
        else:
            if ".." in Path(rel).parts or rel.split("/")[0] not in ("assets", "shared", "components"):
                return self.send_error(404)
            key = phase + ":" + rel
            if key not in self.cache:
                if phase == "before":
                    proc = subprocess.run(["git", "show", f"{BASE}:{rel}"], cwd=ROOT, capture_output=True)
                    if proc.returncode:
                        return self.send_error(404)
                    self.cache[key] = proc.stdout
                else:
                    path = ROOT / rel
                    if not path.is_file():
                        return self.send_error(404)
                    self.cache[key] = path.read_bytes()
            payload = self.cache[key]
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8" if rel.endswith(".html") else mimetypes.guess_type(rel)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "generated-artifacts/light-only-repair/chart-pairs")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    evidence, errors = {}, []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            context = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1, reduced_motion="reduce", color_scheme="light")
            page = context.new_page()
            page.on("pageerror", lambda exc: errors.append(str(exc)))
            page.on("response", lambda res: errors.append(f"HTTP {res.status}: {res.url}") if res.status >= 400 else None)
            for phase in ("before", "after"):
                page.goto(f"http://127.0.0.1:{server.server_port}/{phase}/light-data-fixture.html", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(200)
                page.locator("#donut .m-chart__disclose").click()
                evidence[phase] = {}
                for key, selector in SELECTORS.items():
                    node = page.locator(selector).first
                    if node.count() != 1 or not node.is_visible():
                        raise RuntimeError("Evidence target missing: " + phase + " " + selector)
                    path = args.out / f"{phase}-{key}-390-rtl-dpr1.png"
                    node.screenshot(path=str(path), animations="disabled")
                    evidence[phase][key] = {"file": str(path.relative_to(ROOT)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
                # Exact same input rows as Packed and Donut, rendered as bars.
                for source_id, name in (("packed", "packed-as-bars"), ("donut", "donut-as-bars")):
                    page.evaluate("""([sourceId,name])=>{
                      const source=document.querySelector('#'+sourceId+' .m-chart__data');
                      const chart=document.createElement('section');
                      chart.id=name;chart.className='m-chart m-chart--bars';
                      chart.setAttribute('data-chart','bars');
                      const title=document.createElement('h2');title.className='m-chart__title';
                      title.textContent='نفس البيانات في أشرطة';
                      chart.appendChild(title);chart.appendChild(source.cloneNode(true));
                      const plot=document.createElement('div');plot.setAttribute('data-plot','');
                      plot.className='m-chart__plot';chart.appendChild(plot);
                      document.querySelector('main').appendChild(chart);MicroData.render(chart);
                    }""", [source_id, name])
                    page.wait_for_timeout(80)
                    path = args.out / f"{phase}-{name}-390-rtl-dpr1.png"
                    page.locator("#" + name).screenshot(path=str(path), animations="disabled")
                    evidence[phase][name] = {"file": str(path.relative_to(ROOT)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
            browser.close()
    finally:
        server.shutdown()
    report = {"baseline": BASE, "width": 390, "direction": "rtl", "dpr": 1, "theme": "light",
              "fixtureSha256": hashlib.sha256(FIXTURE.encode()).hexdigest(),
              "sameFixtureBothPhases": True, "evidence": evidence, "errors": errors,
              "limits": "Controlled source fixture, not actual device or measured user comprehension."}
    (args.out / "manifest.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"Captured {sum(len(v) for v in evidence.values())} chart images; errors={len(errors)}")
    return bool(errors)


if __name__ == "__main__":
    raise SystemExit(main())
