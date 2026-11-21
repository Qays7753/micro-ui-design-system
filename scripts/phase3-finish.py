#!/usr/bin/env python3
"""Phase 3 consolidation: merges, deletions, link remapping, new docs, link-check."""
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


def sh(*args):
    return subprocess.run(list(args), cwd=ROOT, capture_output=True, text=True)


# ---------- Link mappings (old doc -> new merged doc), applied repo-wide ----------
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
DEAD_DIRS = ("docs/audits/", "docs/proposals/", "docs/replit/", "docs/zai/",
             "docs/review-evidence-repairs-2026-11-11/", "../handoff/", "../deliverables/",
             "../reviews/", "../../handoff/", "../../deliverables/", "../../reviews/",
             "audits/", "product-context/closure-evidence/", "product-context/evidence/")


def map_path(raw_path):
    """Return (new_path_or_None_if_link_should_be_stripped, changed)."""
    raw = raw_path.strip()
    # dead directories -> strip link
    for dead in DEAD_DIRS:
        if dead in "/" + raw or raw.startswith(dead) or ("/" + dead) in ("/" + raw):
            if raw.startswith("docs/audits") or raw.startswith("docs/proposals") or \
               raw.startswith("docs/replit") or raw.startswith("docs/zai") or \
               raw.startswith("docs/review-evidence") or "handoff/" in raw or \
               "deliverables/" in raw or "reviews/" in raw or "closure-evidence" in raw or \
               "product-context/evidence" in raw:
                return None, True
    parts = raw.split("/")
    fname = parts[-1]
    if fname in DOC_MAP and raw.startswith("docs/"):
        parts[-1] = DOC_MAP[fname]
        return "/".join(parts), True
    if fname in DOC_MAP and not raw.startswith(("http", "assets/", "components/", "previews/", "shared/", "tools/")):
        # bare doc name reference (same-dir docs link)
        return DOC_MAP[fname], True
    return raw, False


def fix_md(text):
    def repl(m):
        label, path = m.group(1), m.group(2)
        if path.startswith(("http", "mailto:", "#", "data:")):
            return m.group(0)
        new, changed = map_path(path)
        if new is None:
            return label
        if not changed:
            return m.group(0)
        return f"[{label}]({new})"
    return re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", repl, text)


class LinkStripper(HTMLParser):
    """Rewrite <a href> and <link href> targets; drop anchors pointing at dead docs."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.strip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag == "a" and self.strip_depth:
            self.strip_depth += 1
            self.out.append(self.get_starttag_text().replace("<a", "<a data-removed-link", 1))
            return
        if tag == "a":
            href = dict(attrs).get("href", "")
            if href.startswith(("http", "mailto:", "#", "data:")):
                self.out.append(self.get_starttag_text())
                return
            new, changed = map_path(href)
            if new is None:
                self.strip_depth = 1
                return  # drop the <a>, keep children
            if changed:
                attrs = [(k, new if k == "href" else v) for k, v in attrs]
                self.out.append(self._build(tag, attrs))
                return
        self.out.append(self.get_starttag_text())

    def _build(self, tag, attrs):
        parts = [f'{k}="{v}"' if v is not None else k for k, v in attrs]
        return f"<{tag} {' '.join(parts)}>"

    def handle_endtag(self, tag):
        if tag == "a" and self.strip_depth:
            self.strip_depth -= 1
            return
        self.out.append(f"</{tag}>")

    def handle_data(self, data):
        self.out.append(data)

    def handle_startendtag(self, tag, attrs):
        if tag in ("link",):
            href = dict(attrs).get("href", "")
            if href and not href.startswith(("http", "mailto:", "#", "data:")):
                new, changed = map_path(href)
                if new is None:
                    return
                if changed:
                    attrs = [(k, new if k == "href" else v) for k, v in attrs]
        self.out.append(self._build(tag, attrs) if attrs else f"<{tag}>")


def fix_html(text):
    p = LinkStripper()
    p.feed(text)
    p.close()
    return "".join(p.out)


# ---------- 1. SYSTEM-CONTRACTS.md += UI-PLATFORM-NOTES ----------
sc = ROOT / "docs/SYSTEM-CONTRACTS.md"
notes = (ROOT / "docs/UI-PLATFORM-NOTES.md").read_text()
notes_body = notes.split("\n", 1)[1].strip()
sc.write_text(sc.read_text().rstrip() + "\n\n## ملاحظات المنصات وحدود التحقق\n\n" + notes_body + "\n")

# ---------- 2. DECISIONS.md += UI-DECISIONS (live decisions, links fixed) ----------
dec = ROOT / "docs/DECISIONS.md"
uid = (ROOT / "docs/UI-DECISIONS.md").read_text()
uid = fix_md(uid)
merged_section = (
    "\n## قرارات المالك السابقة (مدموجة من UI-DECISIONS)\n\n"
    "هذه القرارات سارية بحدودها أدناه؛ ما تعارض منها مع خطة الربط الحالية أو مع\n"
    "ثوابت الهوية تُحسم الخطة/الثوابت. الأدلة التاريخية المرتبطة بها محفوظة في\n"
    "tag الأرشيف `archive/pre-integration-2026-11-21`.\n\n" + uid.strip() + "\n")
dec.write_text(dec.read_text().rstrip() + merged_section)

# ---------- 3. product-context/COVERAGE.md cleanup ----------
cov = ROOT / "docs/product-context/COVERAGE.md"
ct = cov.read_text()
ct = fix_md(ct)
ct = re.sub(r"## إقفال المصدر واعتماد الدمج[\s\S]*$", "", ct).rstrip() + "\n"
ct = ct.replace("، مصدر المكونات فقط. فُحص الكتالوج14/8/6", "، مصدر المكونات فقط. فُحص الكتالوج14/8/13")
cov.write_text(ct)

# ---------- 4. Repo-wide link fixes (components, previews, shared, tools, docs) ----------
fixed = []
for pattern in ("components/**/*.md", "previews/**/*.html", "previews/**/*.md",
                "shared/**/*.css", "tools/README.md", "docs/**/*.md", "docs/**/*.html"):
    for path in ROOT.glob(pattern):
        if not path.is_file() or "standalone.html" in path.name:
            continue
        text = path.read_text()
        new = fix_html(text) if path.suffix == ".html" else fix_md(text)
        if new != text:
            path.write_text(new)
            fixed.append(path.relative_to(ROOT).as_posix())
print("link-fixed files:", len(fixed))

# ---------- 5. light-static-check gate adjustments (approved deletions) ----------
lsc = ROOT / "tools/light-static-check.py"
t = lsc.read_text()
t = t.replace(
    'check("logo v2 and official skills unchanged",\n          not any(n.startswith(("assets/brand/micro-logo/v2/", "_audit-resources/")) for n in changed))',
    '# Phase 3 (D6): _audit-resources/ removed from the tree after the archive tag;\n'
    '    # protection now covers the logo v2 assets only.\n'
    '    check("logo v2 assets unchanged",\n          not any(n.startswith(("assets/brand/micro-logo/v2/",)) for n in changed))')
t = t.replace(
    'PROTECTED_PREFIXES = ("components/", "shared/", "assets/", "previews/")',
    'PROTECTED_PREFIXES = ("components/", "shared/", "assets/", "previews/")\n'
    '# Phase 3 approved removal: the historical chart-proposal preview (decision logged\n'
    '# in docs/DECISIONS.md); its implemented successor lives in components/ previews.\n'
    'APPROVED_REMOVALS = ("previews/chart-proposal/",)')
t = t.replace(
    '    removed = [name for name in git("diff", "--name-only", "--diff-filter=D", base).splitlines()\n               if name.startswith(PROTECTED_PREFIXES)]',
    '    removed = [name for name in git("diff", "--name-only", "--diff-filter=D", base).splitlines()\n               if name.startswith(PROTECTED_PREFIXES) and not name.startswith(APPROVED_REMOVALS)]')
lsc.write_text(t)

# ---------- 6. Deletions ----------
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
    sh("git", "rm", "-r", "-q", "--ignore-unmatch", target)
print("deleted:", len(DELETE), "targets")

# ---------- 7. New docs: STATUS.md, GETTING-STARTED.md, README.md ----------
(ROOT / "docs/STATUS.md").write_text("""# حالة المكتبة — Micro UI

## الإصدار

الحزمة قيد التجهيز باسم `@micro/ui` إصدار `0.1.0` (Vanilla بدون إطار؛ راجع [CHANGELOG.md](../CHANGELOG.md) عند اكتمال التوزيع). المصدر القابل للتعديل في `components/` و`shared/` و`assets/` هو التسليم الأساسي.

## النضج الحالي

المصدر الوحيد للنضج هو [COMPONENT-CATALOG.json](COMPONENT-CATALOG.json): **14 عائلة / 8 متغيرات / 13 تركيبًا (C01–C13)**.

- العائلات: `stable-ui` ما عدا `order-schedule` و`carousel` (`draft-for-review`).
- المتغيرات: donut/bubbles/main-metric-featured/metric-circles/info-strip-peek (`stable-ui`)، data-readable/metric-readable (`draft-for-review`)، packed-circle (`proposed`).
- التراكيب C01–C13 كلها `draft-for-review`؛ لا ترقية نضج آلية، والاعتماد البصري قرار مالك منفصل.

## الفجوات المعروفة

مسجلة في [خطة جاهزية المكونات](plans/component-readiness-2026-11-17/PLAN.md): تركيب Manage (C14)، عرض نتائج بحث Market في C09، وقائمة مراجعة متعددة العناصر في C12 — تُسد في المرحلة 8 من [خطة الربط](plans/integration-readiness-2026-11-21/PLAN.md).

## المؤجلات

- wrappers إطارات التطبيق (React/Vue) مؤجلة لحين تحديد التطبيق (قرار D7).
- الاعتماد البصري النهائي ومعاينة Samsung Galaxy S25/Chrome الفعلية على المالك.
- قائمة مهام السائق غير مطلوبة (D19)؛ قائمة المراجعة صُممت لقابلية إعادة الاستخدام.

## ما لم يُختبر

Safari/WebKit، الأجهزة الفعلية (بينها Samsung Galaxy S25/Chrome)، اللمس الحقيقي، قارئات الشاشة، safe areas، native zoom، forced-colors — «غير مختبرة»؛ الفحص الآلي Chromium/Playwright فقط. التفصيل في [TESTING.md](TESTING.md) و[DECISIONS.md](DECISIONS.md).
""")

(ROOT / "docs/GETTING-STARTED.md").write_text("""# البدء — Micro UI

مكتبة Vanilla (بدون إطار) للهاتف العربي RTL، Light-only. المصدر القابل للاستهلاك: `components/` و`shared/` و`assets/`.

## التثبيت

حاليًا عبر git (ستضاف تفاصيل حزمة npm في [CHANGELOG.md](../CHANGELOG.md) عند جهوزيتها):

```bash
git clone https://github.com/Qays7753/micro-ui-design-system.git
```

## ترتيب التحميل الإلزامي

```html
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="shared/tokens.css">
<!-- الحركة عند الحاجة -->
<link rel="stylesheet" href="shared/motion.css">
<!-- ثم CSS العائلات المستهلكة، مثال: -->
<link rel="stylesheet" href="components/buttons/buttons.css">
<link rel="stylesheet" href="components/fields/fields.css">
<!-- ثم JS العائلات مرة واحدة -->
<script src="components/buttons/buttons.js"></script>
<script src="components/fields/fields.js"></script>
```

الخطوط IBM Plex محلية من `assets/fonts` — لا Google Fonts. الاعتماديات المشروطة لكل عائلة في [API.md](API.md) (بطاقات الاعتماد).

## مثال أدنى

```html
<button class="m-btn m-btn--primary" type="button">حفظ التغييرات</button>
<script>MicroButtons.setLoading(document.querySelector('.m-btn'), true, {loadingLabel: 'جارٍ الحفظ'});</script>
```

التهيئة تلقائية عند تحميل الوحدات؛ DOM المضاف ديناميكيًا يحتاج استدعاء `init` على جذره المحلي. العقود الكاملة لكل عائلة في [API.md](API.md).

## الفحص

```bash
uv sync
uv run python tools/check-all.py
```
""")

(ROOT / "README.md").write_text("""# Micro UI Design System

مكتبة UI مستقلة لمشروع Micro: مكونات وتراكيب HTML/CSS/JS للهاتف العربي RTL، Light-only، Vanilla بدون إطار. لا مصادقة ولا شبكة ولا منطق أعمال — كل ذلك للتطبيق المضيف.

## الحالة

14 عائلة / 8 متغيرات / 13 تركيبًا (C01–C13)؛ الحالة والنضج والفجوات والمؤجلات في [docs/STATUS.md](docs/STATUS.md).

## تشغيل الفحوص

```bash
uv sync
uv run python tools/check-all.py
```

## تشغيل المعرض

```bash
python3 tools/preview-server.py
# ثم http://localhost:5000/previews/ui-system-showcase/index.html
```

أو افتح `previews/ui-system-showcase/standalone.html` مباشرة (ملف مولد لا يُعدَّل يدويًا).

## الوثائق

- [البدء](docs/GETTING-STARTED.md) · [الحالة](docs/STATUS.md) · [عقود النظام](docs/SYSTEM-CONTRACTS.md)
- [API والاستهلاك](docs/API.md) · [التراكيب](docs/COMPOSITIONS.md) · [أسس التصميم](docs/DESIGN-FOUNDATIONS.md)
- [الاختبار](docs/TESTING.md) · [التسليم](docs/HANDOFF.md) · [القرارات](docs/DECISIONS.md)
- [الكتالوج](docs/COMPONENT-CATALOG.json) (مصدر النضج) · [عقد العمل](AGENTS.md) · [الهوية والحدود](DESIGN.md)
""")

# ---------- 8. tools/link-check.py ----------
(ROOT / "tools/link-check.py").write_text('''#!/usr/bin/env python3
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
        prose = re.sub(r"```[\\s\\S]*?```", "", text)
        prose = re.sub(r"`[^`]*`", "", prose)
        urls = re.findall(r"!?\\[[^\\]]*\\]\\(([^)\\s]+)\\)", prose)
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
''')

# ---------- 9. Rebuild generated artifacts + run checks ----------
for cmd in (["uv", "run", "python", "tools/component-catalog-build.py"],
            ["uv", "run", "python", "tools/build-ui-system-showcase-standalone.py"],
            ["uv", "run", "python", "tools/manifest-build.py"]):
    r = sh(*cmd)
    print(cmd[-1], "->", (r.stdout or r.stderr).strip().splitlines()[-1])
r = sh("uv", "run", "python", "tools/link-check.py")
print(r.stdout.strip())
r = sh("uv", "run", "python", "tools/light-static-check.py")
print("static:", (r.stdout or r.stderr).strip().splitlines()[-1])
r = sh("uv", "run", "python", "tools/manifest-build.py", "--check")
print("manifest:", (r.stdout or r.stderr).strip().splitlines()[-1])
print("tree size after:", sh("du", "-sh", "--exclude=.git", ".").stdout.strip())
