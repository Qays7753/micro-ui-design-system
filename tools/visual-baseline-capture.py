#!/usr/bin/env python3
"""Capture 360x780 RTL Light reference screenshots for D12 visual regression.

Pages: every *.html under previews/ (recursive) plus components/*/example-usage.html
and components/access-gateway/*-usage.html. Deterministic settings: mobile
viewport 360x780, touch, Light, locale ar, reduced motion, DPR 1, full page.

Usage:
    uv run python tools/visual-baseline-capture.py --out <dir> [--base-url auto]
Output: one PNG per page (path-derived name) + manifest.json with page list and hashes.
"""
import argparse
import hashlib
import http.server
import json
import sys
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *_):
        pass


def collect_pages():
    pages = []
    for path in sorted((ROOT / "previews").rglob("*.html")):
        pages.append(path.relative_to(ROOT).as_posix())
    for pattern in ("example-usage.html", "*-usage.html"):
        for path in sorted((ROOT / "components").glob("*/" + pattern)):
            rel = path.relative_to(ROOT).as_posix()
            if rel not in pages:
                pages.append(rel)
    return sorted(set(pages))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    pages = collect_pages()
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    manifest = {"viewport": "360x780", "direction": "rtl", "scheme": "light",
                "locale": "ar", "reducedMotion": "reduce", "dpr": 1, "fullPage": True,
                "pages": {}}
    errors = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            context = browser.new_context(
                viewport={"width": 360, "height": 780}, is_mobile=True, has_touch=True,
                color_scheme="light", locale="ar", reduced_motion="reduce",
                device_scale_factor=1)
            page = context.new_page()
            page.set_default_timeout(15000)
            page.on("pageerror", lambda exc: errors.append(f"{exc}"))
            for rel in pages:
                page.goto(f"{base}/{rel}", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(250)
                name = rel.replace("/", "__")
                target = args.out / (name + ".png")
                page.screenshot(path=str(target), full_page=True, animations="disabled")
                manifest["pages"][rel] = {
                    "file": target.name,
                    "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
                }
                print("captured", rel, flush=True)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    manifest["errors"] = errors
    (args.out / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(manifest['pages'])} pages, errors={len(errors)} -> {args.out}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
