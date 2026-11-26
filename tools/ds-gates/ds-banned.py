#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-banned — forbidden libraries and template markers (BRIEF 0.7/0.8, 26-21/22, plan S2).

1. ds/package.json dependencies + devDependencies may not contain any ready-made
   UI/icon library (shadcn, MUI, Chakra, bootstrap, daisyui, lucide*, heroicons,
   @material-ui, @fortawesome, feather-icons, @tabler/icons, phosphor-at-runtime…).
   The list is explicit in config.json.
2. ds/src may not import an icon library (the only icons are our generated
   ds/src/icons — D5), nor any of the banned packages.
3. No default Tailwind color/shadow/radius classes (rounded-*, shadow-*,
   bg-red-500 …) in tsx/ts/css — explicit prefix x scale x palette list in
   config.json (BRIEF 26-21).
4. No machine-absolute paths (a filesystem-root "home", "Users" or "tmp"
   directory segment) in tracked files under ds/, tools/ds-gates/ and
   .githooks/ — the tools must run on any machine, so every path is
   repo-relative, env-provided or resolved at run time (task 2026-11-23:
   portability). Gate fixtures are excluded by design: they carry the
   violations on purpose and are enforced by --prove.
"""
import json
import re
import subprocess
from pathlib import Path

from common import CONFIG, Gate, gate_main, source_files, strip_comments, rel_of

BANNED_DEPS = set(CONFIG["banned_deps"])
TW = CONFIG["tailwind_banned"]

# Built by concatenation so this file itself carries no literal that the
# pattern would flag (the gate scans its own tree).
ABS_PATH_RX = re.compile("/" + "(?:home|Users|tmp)" + "/[A-Za-z0-9._~$-]")


def abs_path_scan_files(root):
    """Files subject to the machine-absolute-path scan.

    Tracked files (git ls-files) when the target is a repository checkout; a
    filesystem walk otherwise (fixture trees are not checkouts). node_modules/
    dist/.git and the fixtures/ trees are always excluded: fixtures carry
    deliberate violations for --prove, not shippable code.
    """
    root = Path(root)
    prefixes = ["ds", "tools/ds-gates", ".githooks"]
    excluded = re.compile(r"(^|/)(node_modules|dist|fixtures|\.git)(/|$)")
    try:
        top = subprocess.run(["git", "-C", str(root), "rev-parse", "--show-toplevel"],
                             capture_output=True, text=True)
        if top.returncode == 0 and Path(top.stdout.strip()).resolve() == root.resolve():
            listed = subprocess.run(["git", "-C", str(root), "ls-files", "--", *prefixes],
                                    capture_output=True, text=True)
            if listed.returncode == 0:
                files = [root / name for name in listed.stdout.splitlines() if name]
                return [p for p in files
                        if p.is_file() and not excluded.search(p.relative_to(root).as_posix())]
    except (OSError, ValueError):
        pass
    files = []
    for prefix in prefixes:
        base = root / prefix
        if not base.is_dir():
            continue
        for path in base.rglob("*"):
            if path.is_file() and not excluded.search(path.relative_to(root).as_posix()):
                files.append(path)
    return files


def tailwind_banned_classes():
    """Expand the explicit prefix x scale/palette matrix from config.json."""
    classes = set()
    for prefix in TW["prefixes"]:
        for scale in TW["scales"]:
            classes.add(f"{prefix}-{scale}")
        for color in TW["palette"]:
            for scale in TW["scales"]:
                classes.add(f"{prefix}-{color}-{scale}")
    return sorted(classes)


TW_CLASSES = tailwind_banned_classes()


def run(gate: Gate, target, args):
    root = Path(target)

    # ---- 1) package.json deps ----
    pkg_path = root / "ds" / "package.json"
    if not pkg_path.is_file():
        gate.na("ds-banned/deps", "no ds/package.json under target")
    else:
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        generation_dep = CONFIG.get("phosphor_generation_dep")
        found = []
        for section in ("dependencies", "devDependencies"):
            for dep in (pkg.get(section) or {}):
                if dep in BANNED_DEPS:
                    # D13: the Phosphor core package is the S1 generation input
                    # and is allowed ONLY as a devDependency, never at runtime.
                    if dep == generation_dep and section == "devDependencies":
                        continue
                    found.append(f"ds/package.json {section}: {dep}@{pkg[section][dep]}")
        if found:
            gate.fail("ds-banned/deps", f"{len(found)} banned packages")
            for f in found:
                gate.fail("ds-banned/dep", f)
        else:
            gate.ok("ds-banned/deps", "no banned packages in dependencies/devDependencies")

    # ---- 2) banned imports in source ----
    files = source_files(target, "ds/src", ["*.ts", "*.tsx", "*.css"])
    if not files:
        gate.na("ds-banned/imports", "no ds/src source under target")
    else:
        import_rx = re.compile(
            r"""(?:import\s[^'"]*?from\s*|import\s*\(\s*|require\s*\(\s*|@import\s+|url\(\s*)['"]([^'"]+)['"]""")
        found = []
        for path in files:
            rel = rel_of(path, target)
            code = strip_comments(path.read_text(encoding="utf-8"))
            for m in import_rx.finditer(code):
                spec = m.group(1)
                for banned in BANNED_DEPS:
                    if spec == banned or spec.startswith(banned + "/"):
                        line = code.count("\n", 0, m.start()) + 1
                        found.append(f"{rel}:{line} imports banned library '{spec}'")
                        break
        if found:
            gate.fail("ds-banned/imports", f"{len(files)} files scanned, {len(found)} banned imports")
            for f in found:
                gate.fail("ds-banned/import", f)
        else:
            gate.ok("ds-banned/imports", f"{len(files)} files scanned, no banned imports")

    # ---- 3) banned Tailwind default classes ----
    if not files:
        gate.na("ds-banned/tailwind-classes", "no ds/src source under target")
    else:
        found = []
        rx = re.compile(r"[\"'`\s]([a-z0-9:-]+)")
        for path in files:
            rel = rel_of(path, target)
            for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
                stripped = line.lstrip()
                if stripped.startswith(("*", "/*", "//", "/*")) or stripped.startswith("|"):
                    continue
                for m in rx.finditer(" " + line):
                    token = m.group(1)
                    if token in TW_CLASSES:
                        found.append(f"{rel}:{lineno} Tailwind default utility class '{token}' (BRIEF 26-21)")
        if found:
            gate.fail("ds-banned/tailwind-classes", f"{len(found)} default Tailwind classes")
            for f in found:
                gate.fail("ds-banned/tailwind-class", f)
        else:
            gate.ok("ds-banned/tailwind-classes", f"{len(TW_CLASSES)} default classes watched, none used")

    # ---- 3ب) banned code patterns (unit 15: lesson rules 11 and 55) ----
    patterns = (CONFIG.get("banned_code_patterns") or {}).get("patterns") or []
    if not files or not patterns:
        gate.na("ds-banned/code-patterns", "no ds/src source or no patterns configured")
    else:
        found = []
        for path in files:
            rel = rel_of(path, target)
            code = strip_comments(path.read_text(encoding="utf-8"))
            for spec in patterns:
                rx = re.compile(spec["regex"])
                for m in rx.finditer(code):
                    line = code.count("\n", 0, m.start()) + 1
                    found.append(f"{rel}:{line} {spec['why']} (pattern {spec['regex']!r})")
        if found:
            gate.fail("ds-banned/code-patterns", f"{len(files)} files scanned, {len(found)} banned code patterns")
            for f in found:
                gate.fail("ds-banned/code-pattern", f)
        else:
            gate.ok("ds-banned/code-patterns", f"{len(files)} files scanned, {len(patterns)} patterns watched, none used")

    # ---- 4) machine-absolute paths ----
    scan = abs_path_scan_files(root)
    if not scan:
        gate.na("ds-banned/machine-paths", "no ds/, tools/ds-gates/ or .githooks/ files under target")
    else:
        found = []
        for path in scan:
            rel = rel_of(path, target)
            try:
                text = path.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue  # binary artifacts (woff2 etc.) carry no source paths
            for lineno, line in enumerate(text.splitlines(), 1):
                if ABS_PATH_RX.search(line):
                    found.append(f"{rel}:{lineno} machine-absolute path: {line.strip()[:70]!r}")
        if found:
            gate.fail("ds-banned/machine-paths", f"{len(scan)} files scanned, {len(found)} machine-absolute paths")
            for f in found:
                gate.fail("ds-banned/machine-path", f)
        else:
            gate.ok("ds-banned/machine-paths", f"{len(scan)} files scanned, no machine-absolute paths")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-banned", run))
