#!/usr/bin/env python3
"""Serve the editable Micro library, without exposing private workspace folders."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIRS = {"assets", "components", "shared", "previews", "docs", "reviews", "references", "prompts", "tools"}
PUBLIC_FILES = {"README.md", "AGENTS.md", "DESIGN.md", "MANIFEST.json", "pyproject.toml", "uv.lock"}


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
            self.send_header("Location", "/previews/")
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
    ThreadingHTTPServer(("0.0.0.0", 5000), PreviewHandler).serve_forever()
