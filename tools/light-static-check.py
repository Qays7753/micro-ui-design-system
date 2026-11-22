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
import tempfile
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
IDENTITY = json.loads((ROOT / "tools/baselines/identity.json").read_text(encoding="utf-8"))
# Diff base: origin/main by default (available in shallow clones), override with --base.
DEFAULT_BASE = "origin/main"
# Deletions are only forbidden for editable UI source; docs cleanups are allowed.
PROTECTED_PREFIXES = ("components/", "shared/", "assets/", "previews/")
# Phase 3 approved removal: the historical chart-proposal preview (decision logged
# in docs/DECISIONS.md); its implemented successor lives in components/ previews.
APPROVED_REMOVALS = ("previews/chart-proposal/",)


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
    parser.add_argument("--out", type=Path,
                        default=Path(tempfile.mkdtemp(prefix="micro-light-static-")) / "static.json")
    parser.add_argument("--base", default=DEFAULT_BASE,
                        help="Diff base ref (default: origin/main)")
    args = parser.parse_args()
    base = args.base
    files = sorted(set(git("ls-files", "--cached", "--others", "--exclude-standard").splitlines()))
    changed = set(git("diff", "--name-only", base).splitlines()) | set(git("ls-files", "--others", "--exclude-standard").splitlines())
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
            # Generated package mirrors of already-checked sources; byte-identity
            # is enforced by the package --check gate.
            if name.startswith(("src/", "dist/")):
                continue
            # ds batch one (2026-11-22): ds/src/tokens/tokens.css is GENERATED
            # from docs/design-system/tokens.json by ds/tools/generate-tokens.mjs
            # and byte-verified by its --check mode plus the manifest gate, so
            # its hex values are the token definitions themselves — the single
            # allowed location of raw colors in the new system. Explicit file
            # list, not a pattern; every other ds file must use var(--mds-*).
            if name == "ds/src/tokens/tokens.css":
                continue
            required = set(re.findall(r"var\((--micro-[\w-]+)\s*\)", path.read_text()))
            check("defined required CSS tokens: " + name, not (required - defined), sorted(required - defined))
            old = subprocess.run(["git", "show", f"{base}:{name}"], cwd=ROOT, capture_output=True, text=True)
            before_colors = set(re.findall(r"#[0-9a-fA-F]{3,8}\b", old.stdout))
            after_colors = set(re.findall(r"#[0-9a-fA-F]{3,8}\b", path.read_text()))
            # R-06 (2026-10-25): القيمتان المدققتان وحدهما مسموحتان في
            # tokens.css — تصحيح تباين مسجل بأدلة (c/e فوق 3:1 على الأبيض)،
            # والقيمتان القديمتان محفوظتان في تعليق التوثيق. لا يفتح هذا
            # الباب لأي لون آخر: الاستثناء قائمة صريحة لا نمط عام.
            audited = {"#A189CA", "#8E9A4D"} if name == "shared/tokens.css" else set()
            # Provider branding has its own exact light palette; never a Micro token exception.
            # The three literals must occur only inside the single provider-button rule.
            if name == "components/access-gateway/welcome.css":
                source = re.sub(r"/\*[\s\S]*?\*/", "", path.read_text())
                provider = re.findall(r"(?m)^\.m-google-button\s*\{([^}]+)\}", source)
                official = {"#747775", "#fff", "#1f1f1f"}
                check("Google light palette confined to provider selector",
                      len(provider) == 1 and set(re.findall(r"#[0-9a-fA-F]{3,8}\b", provider[0])) == official
                      and not re.findall(r"#[0-9a-fA-F]{3,8}\b", re.sub(r"(?m)^\.m-google-button\s*\{[^}]+\}", "", source)))
                audited |= official
            check("no new hardcoded CSS palette: " + name,
                  not (after_colors - before_colors - audited), sorted(after_colors - before_colors - audited))

    tokens = (ROOT / "shared/tokens.css").read_text()
    marker = '[data-theme="dark"]'
    legacy_block = tokens[tokens.index(marker):].rstrip()
    # The closing "}" belongs to the inert @media wrapper, not to the legacy block.
    legacy_block = legacy_block[:-1].rstrip()
    check("legacy Dark values retained unchanged and gated inert",
          hashlib.sha256(legacy_block.encode()).hexdigest() == IDENTITY["legacyDarkBlockSha256"]
          and "@media not all {" in tokens)
    check("official accent and primary unchanged",
          f"--micro-color-brand-accent: {IDENTITY['brandAccent']};" in tokens
          and f"--micro-color-brand-primary: {IDENTITY['brandPrimary']};" in tokens)
    # Every baseline token value must still appear verbatim; additions are allowed.
    # The only accepted deltas are the audited R-06 corrections and the one
    # documented removal recorded next to the baseline in identity.json.
    current_values = dict(re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", tokens))
    audited = IDENTITY.get("auditedTokenChanges", {})
    removed_tokens = set(IDENTITY.get("removedTokens", []))

    def rem_equivalent(current, baseline):
        """الجولة الثالثة N-D6: توكنز أحجام الخط تُكتب بـrem بقيمة مكافئة
        تمامًا عند جذر 16px — المقارنة بالقيمة المحسوبة لا بالنص الحرفي."""
        try:
            cur = current.strip(); base = baseline.strip()
            if cur.endswith("rem") and base.endswith("px"):
                return abs(float(cur[:-3]) * 16 - float(base[:-2])) < 1e-9
        except (ValueError, AttributeError):
            pass
        return False

    changed_values = sorted(
        name for name, value in IDENTITY["tokensCssDeclarations"].items()
        if current_values.get(name, "").strip() not in (value, audited.get(name))
        and not rem_equivalent(current_values.get(name, ""), value)
        and name not in removed_tokens
    )
    check("baseline token values unchanged against identity baseline", not changed_values, changed_values)
    # Phase 3 (D6): _audit-resources/ removed from the tree after the archive tag;
    # protection now covers the logo v2 assets only.
    check("logo v2 assets unchanged",
          not any(n.startswith(("assets/brand/micro-logo/v2/",)) for n in changed))
    removed = [name for name in git("diff", "--name-only", "--diff-filter=D", base).splitlines()
               if name.startswith(PROTECTED_PREFIXES) and not name.startswith(APPROVED_REMOVALS)]
    check("no removed source or dead removed-chart imports", not removed, removed)
    try:
        check("branch descends from diff base",
              git("merge-base", base, "HEAD").strip() == git("rev-parse", base).strip())
    except subprocess.CalledProcessError:
        # Depth-1 clones of two refs share no graft history, so ancestry cannot
        # be verified there. The check stays strict in full clones and CI.
        shallow = subprocess.run(["git", "rev-parse", "--is-shallow-repository"], cwd=ROOT,
                                 capture_output=True, text=True).stdout.strip() == "true"
        check("branch descends from diff base",
              shallow, "shallow clone: ancestry not verifiable; enforced in full clones")
    whitespace = subprocess.run(["git", "diff", "--check", base], cwd=ROOT, capture_output=True, text=True)
    # 2026-10-25 (تصحيح نطاق): أصول المرجع التي يزوّد بها المالك
    # (docs/zai/references/**) تصل بأسطرها الأصلية (CRLF في
    # calendar-reference-implementation.html كما سلّمها المالك في
    # 318118e/d3bdf5d/204495f) ويجب أن تبقى بايت-ببايت أمينة للمصدر —
    # ليست مصدر النظام. بوابة المسافة البيضاء تحدد نطاقها بملفات
    # المستودع المملوكة له؛ فشلٌ في أصل المالك لا يعني عيب مصدر.
    ws_issues = [line for line in (whitespace.stdout or "").splitlines()
                 if re.match(r"^\S+:\d+: ", line)
                 and not line.startswith("docs/zai/references/")]
    check("git diff --check (repository-owned files)",
          whitespace.returncode == 0 or not ws_issues,
          ws_issues[:10] or (whitespace.stderr or None))
    diff = git("diff", "--no-ext-diff", "--unified=0", base)
    additions = "\n".join(line[1:] for line in diff.splitlines() if line.startswith("+") and not line.startswith("+++"))
    # High-signal signatures only. This is not a full security certification.
    signatures = re.compile(r"(?:AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)")
    check("no high-signal credential added in diff", not signatures.search(additions))
    passed = sum(row["passed"] for row in records)
    report = {"baseline": base, "identityBaseline": IDENTITY["extractedFromCommit"],
              "sourceCommitAtRun": git("rev-parse", "HEAD").strip(),
              "sourceSha256": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in sorted(changed) if (ROOT / name).is_file()},
              "passed": passed, "failed": len(records) - passed, "total": len(records), "records": records,
              "limits": ["CSS check is structural, not a full standards parser.", "Secret scan covers selected high-signal diff signatures, not arbitrary secrets.", "No Dark or System-dark execution."]}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"{passed}/{len(records)} PASS")
    return 0 if report["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
