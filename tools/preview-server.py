#!/usr/bin/env python3
"""Serve the editable Micro library, without exposing private workspace folders.

R2 (الجولة الثانية): المستهلكون داخل المستودع يخدمون من dist/iife المبني
(المصدر ESM — R-D2/R-D3). عند البدء تُبنى الحزمة تلقائيًا إن كان dist/
غائبًا أو أقدم من أي ملف مصدر (مقارنة mtime)، ويطبع ذلك قبل الإصغاء.
"""

import subprocess
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
# R1 (الجولة الثانية، F9): حُذفت المجلدات غير الموجودة (reviews، prompts،
# handoff). R2: حُذفت src (مرآة قديمة — R-D4) وبقيت dist (مخرج البناء).
PUBLIC_DIRS = {"assets", "components", "shared", "previews", "docs", "references", "tools", "examples", "dist"}
PUBLIC_FILES = {"README.md", "AGENTS.md", "DESIGN.md", "MANIFEST.json", "pyproject.toml", "uv.lock", "CHANGELOG.md", "package.json"}


def ensure_dist():
    """ابنِ الحزمة إن كانت غائبة أو قديمة (أي ملف مصدر أحدث من dist/)."""
    dist = ROOT / "dist"
    sources = [ROOT / "package.json"]
    for pattern in ("components/**/*.js", "components/**/*.css", "shared/*.js", "shared/*.css", "tools/build-package.mjs"):
        sources.extend(ROOT.glob(pattern))
    newest_source = max((p.stat().st_mtime for p in sources if p.is_file()), default=0)
    marker = dist / "MANIFEST.json"
    if marker.is_file() and marker.stat().st_mtime >= newest_source:
        return
    print("preview-server: dist/ غائب أو أقدم من المصدر — إعادة البناء…", flush=True)
    result = subprocess.run(["node", "tools/build-package.mjs"], cwd=ROOT)
    if result.returncode != 0:
        print("preview-server: فشل البناء — قدم الصفحات كما هي", flush=True)


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def public_path(self):
        path = unquote(urlsplit(self.path).path)
        parts = Path(path).parts[1:]
        if any(part.startswith(".") or part == "__pycache__" for part in parts):
            return None
        if parts and parts[0] not in PUBLIC_DIRS and path.lstrip("/") not in PUBLIC_FILES:
            return None
        return path

    def do_GET(self):
        path = self.public_path()
        if path is None:
            self.send_error(404)
            return
        if path == "/":
            self.send_response(302)
            self.send_header("Location", "/previews/ui-system-showcase/index.html")
            self.end_headers()
            return
        super().do_GET()

    def do_HEAD(self):
        if self.public_path() is None:
            self.send_error(404)
            return
        super().do_HEAD()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    ensure_dist()
    ThreadingHTTPServer(("0.0.0.0", 5000), PreviewHandler).serve_forever()
