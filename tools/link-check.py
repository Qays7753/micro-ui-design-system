#!/usr/bin/env python3
"""Check every relative link in git-tracked *.md and *.html resolves; fail on broken."""
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and ((tag in ("script", "img") and name == "src") or
                          (tag in ("link", "a") and name == "href")):
                self.urls.append(value)


def broken_links(path):
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".html":
        parser = Links()
        parser.feed(text)
        urls = parser.urls
    else:
        prose = re.sub(r"```[\s\S]*?```", "", text)
        prose = re.sub(r"`[^`]*`", "", prose)
        urls = re.findall(r"!?\[[^\]]*\]\(([^)\s]+)\)", prose)
    broken = []
    for url in urls:
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc or not parsed.path or url.startswith("#"):
            continue
        rel = unquote(parsed.path)
        if any(char in rel for char in ("<", ">", "{", "}")):
            continue
        target = (ROOT / rel.lstrip("/")) if rel.startswith("/") else path.parent / rel
        if not target.exists():
            broken.append(url)
    return broken


def main():
    files = subprocess.check_output(
        ["git", "ls-files", "*.md", "*.html"], cwd=ROOT, text=True).splitlines()
    failed = 0
    for name in files:
        path = ROOT / name
        if not path.is_file():
            continue
        bad = broken_links(path)
        if bad:
            failed += 1
            print(f"FAIL {name}: {sorted(set(bad))}")
    print(f"link-check: {len(files)} files, {failed} with broken links")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
