#!/usr/bin/env python3
"""Reproducible static gates for the Light-only release, without executing Dark."""
import argparse
import ast
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
BASE = "161bb71adbed86e0df4382174cb07bd2fcb8d62d"


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True)


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and ((tag in ("script", "img") and name == "src") or
                          (tag in ("link", "a") and name == "href")):
                self.urls.append(value)


def missing_links(path, text):
    if path.suffix == ".html":
        parser = Links()
        parser.feed(text)
        urls = parser.urls
    else:
        # Exclude code recipes, which are not clickable documentation links.
        prose = re.sub(r"```[\s\S]*?```", "", text)
        urls = re.findall(r"!?\[[^\]]*\]\(([^)\s]+)\)", prose)
    missing = []
    for url in urls:
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        rel = unquote(parsed.path)
        if any(char in rel for char in ("<", ">", "{", "}")):
            continue
        target = (ROOT / rel.lstrip("/")) if rel.startswith("/") else path.parent / rel
        if not target.exists():
            missing.append(url)
    return missing


def css_balanced(text):
    # A structural check, not a claim of full CSS semantic validation.
    clean = re.sub(r"/\*[\s\S]*?\*/", "", text)
    clean = re.sub(r"""'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*" """.strip(), '""', clean)
    stack = []
    for char in clean:
        if char in "{([":
            stack.append(char)
        elif char in "})]":
            if not stack or stack.pop() != {"}": "{", ")": "(", "]": "["}[char]:
                return False
    return not stack


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "generated-artifacts/light-only-repair/static.json")
    args = parser.parse_args()
    files = sorted(set(git("ls-files", "--cached", "--others", "--exclude-standard").splitlines()))
    changed = set(git("diff", "--name-only", BASE).splitlines()) | set(git("ls-files", "--others", "--exclude-standard").splitlines())
    records = []

    def check(name, passed, detail=None):
        records.append({"name": name, "passed": bool(passed), "detail": detail})
        print(("PASS " if passed else "FAIL ") + name)

    for name in files:
        path = ROOT / name
        if not path.is_file():
            continue
        if path.suffix == ".py":
            try:
                text = path.read_text()
                ast.parse(text, filename=name)
                compile(text, name, "exec")
                check("python compile: " + name, True)
            except (SyntaxError, UnicodeError) as exc:
                check("python compile: " + name, False, str(exc))
        elif path.suffix == ".js":
            result = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
            check("javascript syntax: " + name, result.returncode == 0, result.stderr or None)
        elif path.suffix == ".css":
            check("CSS balanced delimiters: " + name, css_balanced(path.read_text()))

    all_css = "\n".join((ROOT / name).read_text() for name in files if name.endswith(".css") and (ROOT / name).is_file())
    defined = set(re.findall(r"(--micro-[\w-]+)\s*:", all_css))
    for name in sorted(changed):
        path = ROOT / name
        if path.is_file() and path.suffix in (".html", ".md"):
            check("changed active links: " + name, not (bad := missing_links(path, path.read_text())), bad)
        if path.is_file() and path.suffix == ".css":
            required = set(re.findall(r"var\((--micro-[\w-]+)\s*\)", path.read_text()))
            check("defined required CSS tokens: " + name, not (required - defined), sorted(required - defined))
            old = subprocess.run(["git", "show", f"{BASE}:{name}"], cwd=ROOT, capture_output=True, text=True)
            before_colors = set(re.findall(r"#[0-9a-fA-F]{3,8}\b", old.stdout))
            after_colors = set(re.findall(r"#[0-9a-fA-F]{3,8}\b", path.read_text()))
            # R-06 (2026-10-25): القيمتان المدققتان وحدهما مسموحتان في
            # tokens.css — تصحيح تباين مسجل بأدلة (c/e فوق 3:1 على الأبيض)،
            # والقيمتان القديمتان محفوظتان في تعليق التوثيق. لا يفتح هذا
            # الباب لأي لون آخر: الاستثناء قائمة صريحة لا نمط عام.
            audited = {"#A189CA", "#8E9A4D"} if name == "shared/tokens.css" else set()
            check("no new hardcoded CSS palette: " + name,
                  not (after_colors - before_colors - audited), sorted(after_colors - before_colors - audited))

    tokens = (ROOT / "shared/tokens.css").read_text()
    old_tokens = git("show", f"{BASE}:shared/tokens.css")
    marker = '[data-theme="dark"]'
    legacy_same = tokens[tokens.index(marker):].rstrip()[:-1].rstrip() == old_tokens[old_tokens.index(marker):].rstrip()
    check("legacy Dark values retained unchanged and gated inert", legacy_same and "@media not all {" in tokens)
    check("official accent and primary unchanged", "--micro-color-brand-accent: #D97757;" in tokens and "--micro-color-brand-primary: #164D59;" in tokens)
    check("logo v2 and official skills unchanged", not any(n.startswith(("assets/brand/micro-logo/v2/", "_audit-resources/")) for n in changed))
    check("no removed source or dead removed-chart imports", not git("diff", "--name-only", "--diff-filter=D", BASE).strip())
    check("branch descends from recorded main", git("merge-base", BASE, "HEAD").strip() == BASE)
    whitespace = subprocess.run(["git", "diff", "--check", BASE], cwd=ROOT, capture_output=True, text=True)
    check("git diff --check", whitespace.returncode == 0, whitespace.stdout or whitespace.stderr or None)
    diff = git("diff", "--no-ext-diff", "--unified=0", BASE)
    additions = "\n".join(line[1:] for line in diff.splitlines() if line.startswith("+") and not line.startswith("+++"))
    # High-signal signatures only. This is not a full security certification.
    signatures = re.compile(r"(?:AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)")
    check("no high-signal credential added in diff", not signatures.search(additions))
    passed = sum(row["passed"] for row in records)
    report = {"baseline": BASE, "sourceCommitAtRun": git("rev-parse", "HEAD").strip(),
              "sourceSha256": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in sorted(changed) if (ROOT / name).is_file()},
              "passed": passed, "failed": len(records) - passed, "total": len(records), "records": records,
              "limits": ["CSS check is structural, not a full standards parser.", "Secret scan covers selected high-signal diff signatures, not arbitrary secrets.", "No Dark or System-dark execution."]}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"{passed}/{len(records)} PASS")
    return 0 if report["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
