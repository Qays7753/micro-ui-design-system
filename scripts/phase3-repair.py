#!/usr/bin/env python3
"""Phase 3 repair pass: dirname-preserving link remap, force deletions, rebuild, verify."""
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


def sh(*args):
    return subprocess.run(list(args), cwd=ROOT, capture_output=True, text=True)


DOC_MAP = {
    "COMPONENT-API-CONTRACTS.md": "API.md", "COMPONENT-CONSUMPTION.md": "API.md",
    "FAMILY-CONSUMPTION.md": "API.md", "SHARED-ACTIONS.md": "API.md",
    "SHARED-SPEC.md": "API.md", "UI-USAGE-SOP.md": "API.md",
    "MICRO-COMPONENTS-GUIDE.md": "API.md",
    "COMPOSITION-CONTRACTS.md": "COMPOSITIONS.md", "MOBILE-CAPABILITIES.md": "COMPOSITIONS.md",
    "UI-COMPOSITION-RULES.md": "COMPOSITIONS.md", "BOUNDARY-FIXTURES.md": "COMPOSITIONS.md",
    "READING-TASK-GUIDE.md": "COMPOSITIONS.md", "READABLE-SOURCE.md": "COMPOSITIONS.md",
    "CURRENT-STATE.md": "STATUS.md", "UI-RELEASE.md": "STATUS.md",
    "IMPLEMENTATION-VERIFICATION.md": "STATUS.md",
    "UI-VISUAL-SYSTEM.md": "DESIGN-FOUNDATIONS.md", "COMPONENT-GEOMETRY.md": "DESIGN-FOUNDATIONS.md",
    "MOBILE-MOTION.md": "DESIGN-FOUNDATIONS.md", "VISUAL-ACCEPTANCE.md": "DESIGN-FOUNDATIONS.md",
    "Micro-UI-Foundations-V1.md": "DESIGN-FOUNDATIONS.md",
    "UI-PLATFORM-NOTES.md": "SYSTEM-CONTRACTS.md",
    "UI-DECISIONS.md": "DECISIONS.md",
    "UI-FINAL-HANDOFF.md": "HANDOFF.md", "UI-OWNER-HANDOFF.md": "HANDOFF.md",
    "MOBILE-EXPERIENCE-HANDOFF.md": "HANDOFF.md", "EDITABLE-DELIVERY.md": "HANDOFF.md",
    "UI-SYSTEM-SHOWCASE-COVERAGE.md": "TESTING.md",
    "UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md": "TESTING.md",
    "CLOSURE.md": "COVERAGE.md", "TRANSFER.md": "COVERAGE.md",
}


def map_path(raw_path):
    raw = raw_path.strip()
    if re.search(r"(^|/)(audits|proposals|replit|zai|review-evidence-repairs-2026-11-11|closure-evidence)/", raw) \
       or "handoff/REFERENCE" in raw or raw.startswith(("handoff/", "deliverables/", "reviews/")) \
       or "product-context/evidence" in raw:
        return None, True
    parts = raw.split("/")
    fname = parts[-1]
    if fname in DOC_MAP:
        parts[-1] = DOC_MAP[fname]
        return "/".join(parts), True
    return raw, False


def fix_md(text):
    def repl(m):
        label, path = m.group(1), m.group(2)
        if path.startswith(("http", "mailto:", "#", "data:")):
            return m.group(0)
        new, changed = map_path(path)
        if new is None:
            return label
        return m.group(0) if not changed else f"[{label}]({new})"
    return re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", repl, text)


def strip_chart_proposal_links(text):
    text = re.sub(r'<a href="[^"]*chart-proposal[^"]*">([^<]*)</a>', r"\1", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*chart-proposal[^)]*\)", r"\1", text)
    return text


class LinkStripper(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.strip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            if self.strip_depth:
                self.strip_depth += 1
                return
            href = dict(attrs).get("href", "")
            if href.startswith(("http", "mailto:", "#", "data:")):
                self.out.append(self.get_starttag_text())
                return
            new, changed = map_path(href)
            if new is None:
                self.strip_depth = 1
                return
            if changed:
                attrs = [(k, new if k == "href" else v) for k, v in attrs]
        self.out.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        if tag == "a" and self.strip_depth:
            self.strip_depth -= 1
            return
        self.out.append(f"</{tag}>")

    def handle_data(self, data):
        self.out.append(data)

    def handle_startendtag(self, tag, attrs):
        if tag == "link":
            href = dict(attrs).get("href", "")
            if href and not href.startswith(("http", "mailto:", "#", "data:")):
                new, changed = map_path(href)
                if new is None:
                    return
                if changed:
                    attrs = [(k, new if k == "href" else v) for k, v in attrs]
        self.out.append(self.get_starttag_text())


def fix_html(text):
    p = LinkStripper()
    p.feed(text)
    p.close()
    return "".join(p.out)


# repair the bare COVERAGE.md link introduced by the previous pass
dec = ROOT / "docs/DECISIONS.md"
dec.write_text(dec.read_text().replace("](COVERAGE.md)", "](product-context/COVERAGE.md)"))

fixed = 0
for pattern in ("components/**/*.md", "previews/**/*.html", "previews/**/*.md",
                "shared/**/*.css", "tools/README.md", "docs/**/*.md", "docs/**/*.html"):
    for path in ROOT.glob(pattern):
        if not path.is_file() or path.name == "standalone.html":
            continue
        text = path.read_text()
        new = fix_html(text) if path.suffix == ".html" else fix_md(text)
        new = strip_chart_proposal_links(new)
        if new != text:
            path.write_text(new)
            fixed += 1
print("re-fixed files:", fixed)

DELETE = [
    "docs/zai", "_audit-resources", "reviews", "docs/replit",
    "docs/replit-professional-ui-repair-2026-10-20", "docs/review-evidence-repairs-2026-11-11",
    "docs/audits", "docs/proposals", "handoff", "deliverables", "previews/chart-proposal",
    "docs/foundations",
    "docs/product-context/CLOSURE.md", "docs/product-context/REPORT.md",
    "docs/product-context/TRANSFER.md", "docs/product-context/closure-evidence",
    "docs/product-context/evidence",
    "docs/COMPONENT-API-CONTRACTS.md", "docs/COMPONENT-CONSUMPTION.md",
    "docs/FAMILY-CONSUMPTION.md", "docs/SHARED-ACTIONS.md", "docs/SHARED-SPEC.md",
    "docs/UI-USAGE-SOP.md", "docs/MICRO-COMPONENTS-GUIDE.md", "docs/COMPOSITION-CONTRACTS.md",
    "docs/MOBILE-CAPABILITIES.md", "docs/UI-COMPOSITION-RULES.md", "docs/BOUNDARY-FIXTURES.md",
    "docs/READING-TASK-GUIDE.md", "docs/READABLE-SOURCE.md", "docs/CURRENT-STATE.md",
    "docs/UI-RELEASE.md", "docs/IMPLEMENTATION-VERIFICATION.md", "docs/UI-VISUAL-SYSTEM.md",
    "docs/COMPONENT-GEOMETRY.md", "docs/MOBILE-MOTION.md", "docs/VISUAL-ACCEPTANCE.md",
    "docs/UI-PLATFORM-NOTES.md", "docs/UI-SYSTEM-SHOWCASE-COVERAGE.md",
    "docs/UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md", "docs/UI-DECISIONS.md",
    "docs/UI-FINAL-HANDOFF.md", "docs/UI-OWNER-HANDOFF.md", "docs/MOBILE-EXPERIENCE-HANDOFF.md",
    "docs/EDITABLE-DELIVERY.md",
]
for target in DELETE:
    sh("git", "rm", "-r", "-f", "-q", "--ignore-unmatch", target)
left = sh("git", "status", "--porcelain").stdout
print("remaining tracked deletions pending:", len([l for l in left.splitlines() if l.startswith("D") or l.startswith("DU")]))

for cmd in (["uv", "run", "python", "tools/component-catalog-build.py"],
            ["uv", "run", "python", "tools/build-ui-system-showcase-standalone.py"],
            ["uv", "run", "python", "tools/manifest-build.py"]):
    r = sh(*cmd)
    print(cmd[-1], "->", (r.stdout or r.stderr).strip().splitlines()[-1])
r = sh("uv", "run", "python", "tools/link-check.py")
print(r.stdout.strip()[-800:])
r = sh("uv", "run", "python", "tools/light-static-check.py")
print("static:", (r.stdout or r.stderr).strip().splitlines()[-1])
fails = [l for l in (r.stdout or "").splitlines() if l.startswith("FAIL")]
print("static fails:", fails[:5])
print("tree size:", sh("du", "-sh", "--exclude=.git", ".").stdout.strip())
