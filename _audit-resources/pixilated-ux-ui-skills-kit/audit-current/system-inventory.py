#!/usr/bin/env python3
"""Build a read-only inventory of tracked UI-system sources and selectors."""
import json
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent / "system-inventory.json"

def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()

def tracked_paths():
    return sorted(filter(None, git("ls-files", "-z").split("\0")))

def read_text(path):
    try:
        return (ROOT / path).read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        return ""

def paths_in(directory, paths):
    prefix = directory.rstrip("/") + "/"
    return [path for path in paths if path.startswith(prefix)]

def selector_inventory(css_paths):
    classes, variants, states = set(), set(), set()
    state_re = re.compile(
        r"(?::(?:hover|active|focus|focus-visible|focus-within|disabled|checked|"
        r"indeterminate|empty|valid|invalid|has|dir)\b|\["
        r"(?:aria-[\w-]+|data-[\w-]+|hidden|disabled|readonly|required)"
        r"(?:[~|^$*]?=|\]))"
    )
    for path in css_paths:
        text = read_text(path)
        classes.update(re.findall(r"\.((?:m|micro)-[A-Za-z0-9_-]+)", text))
        variants.update(re.findall(r"\.((?:m|micro)-[A-Za-z0-9_-]+--[A-Za-z0-9_-]+)", text))
        states.update(match.group(0) for match in state_re.finditer(text))
    return {
        "sourceClasses": sorted(classes),
        "variantClasses": sorted(variants),
        "stateSelectorMarkers": sorted(states),
    }

def specification_inventory(spec_paths):
    state_words = re.compile(
        r"\b(default|hover|active|focus(?:-visible)?|disabled|loading|error|empty|"
        r"success|selected|expanded|collapsed|readonly|read-only|zero|missing|"
        r"unavailable|valid|invalid|rtl|ltr|draft|stable|proposed|complete|current|"
        r"upcoming|disconnect|destroy|reduced-motion)\b|"
        r"(افتراضي|تركيز|ضغط|معطل|تحميل|خطأ|فارغ|نجاح|محدد|موسّع|مضموم|"
        r"قراءة فقط|صفر|مفقود|غير متاح|صالح|غير صالح|مسودة|مقترح|مكتمل|حالي|قادم|"
        r"تقليل الحركة|دورة حياة|فصل)",
        re.IGNORECASE,
    )
    sections, state_lines = [], []
    for path in spec_paths:
        text = read_text(path)
        for line_number, line in enumerate(text.splitlines(), 1):
            stripped = line.strip()
            if stripped.startswith("#"):
                sections.append({"path": path, "line": line_number, "heading": stripped})
            elif state_words.search(stripped):
                state_lines.append({
                    "path": path,
                    "line": line_number,
                    "evidence": stripped[:500],
                })
    return {"specificationSections": sections, "specificationStateEvidence": state_lines}

def main():
    paths = tracked_paths()
    component_dirs = sorted({
        path.split("/")[1]
        for path in paths
        if path.startswith("components/") and len(path.split("/")) > 2
    })
    families = []
    for family in component_dirs:
        source_dir = f"components/{family}"
        family_paths = paths_in(source_dir, paths)
        css = [path for path in family_paths if path.endswith(".css")]
        js = [path for path in family_paths if path.endswith(".js")]
        specs = [path for path in family_paths if path.endswith("specification.md")]
        readmes = [path for path in family_paths if path.endswith("README.md")]
        examples = [path for path in family_paths if path.endswith("example-usage.html")]
        preview_paths = paths_in(f"previews/{family}", paths)
        if family == "data":
            preview_paths += paths_in("previews/concepts", paths)
        if family in {"account-settings", "access-gateway", "metric-comparison"}:
            preview_paths += paths_in("previews/concepts", paths)
        families.append({
            "family": family,
            "trackedSourceFiles": family_paths,
            "cssFiles": css,
            "javascriptFiles": js,
            "specificationFiles": specs,
            "readmeFiles": readmes,
            "exampleFiles": examples,
            "previewFiles": sorted(set(preview_paths)),
            **specification_inventory(specs),
            **selector_inventory(css),
        })
    areas = Counter(path.split("/")[0] if "/" in path else "root" for path in paths)
    result = {
        "scope": "read-only tracked-file and source/spec selector inventory",
        "head": git("rev-parse", "HEAD"),
        "trackedFileCount": len(paths),
        "trackedFiles": paths,
        "trackedFilesByTopLevelArea": dict(sorted(areas.items())),
        "componentFamilyCount": len(families),
        "componentFamilies": families,
        "limitations": [
            "Selectors and state markers are lexical inventory, not proof of runtime behavior.",
            "HTML fixture values are demo data; no user, analytics, or persona inference is made.",
            "No external repository, consumer application, or external URL was accessed.",
        ],
    }
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)}: {len(paths)} tracked files, {len(families)} component folders")

if __name__ == "__main__":
    main()
