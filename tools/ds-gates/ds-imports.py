#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-imports — the new system never imports the old one (plan K1/K2/K16, 4.1, AGENTS).

Rules on every import in ds/src (+ ds/lab/src when it exists):
  1. no import resolving into the legacy tree (components/, shared/, previews/
     at the repo top level) — the import may not even leave ds/ (a package is
     self-contained; any ../ that escapes ds/ is a violation).
  2. no react-dom import inside ds/src/components (react-dom belongs to the
     app and to lib-level glue, never to a component file).
  3. icons are imported from their index (../icons), fonts only through the
     CSS entry (ds/src/styles.css) — no deep imports (D5/D8).
  4. no deep import into another component's files — a component is reached
     through its folder index (../Button), never ../Button/Button.
"""
import re
from pathlib import Path

from common import Gate, gate_main, source_files, strip_comments, rel_of

IMPORT_RX = re.compile(
    r"""(?:import\s[^;]*?from\s*|import\s*\(\s*|require\s*\(\s*|@import\s+|url\(\s*)['"]([^'"]+)['"]""")

LEGACY_TOP = ("components", "shared", "previews")


def resolve_rel(from_file: Path, spec: str):
    """Resolve a relative specifier from a file; returns absolute Path or None."""
    if not spec.startswith("."):
        return None
    base = from_file.parent
    return (base / spec).resolve()


def run(gate: Gate, target, args):
    root = Path(target)
    scopes = [("ds/src", source_files(target, "ds/src", ["*.ts", "*.tsx", "*.css"]))]
    lab = source_files(target, "ds/lab/src", ["*.ts", "*.tsx", "*.css"])
    if lab:
        scopes.append(("ds/lab/src", lab))

    if not any(files for _, files in scopes):
        gate.na("ds-imports/boundaries", "no ds source under target")
        return

    legacy, escaped, react_dom, deep = [], [], [], []
    for scope, files in scopes:
        ds_root = (root / scope.split("/")[0]).resolve()
        for path in files:
            rel = rel_of(path, target)
            code = strip_comments(path.read_text(encoding="utf-8"))
            for m in IMPORT_RX.finditer(code):
                spec = m.group(1)
                line = code.count("\n", 0, m.start()) + 1
                where = f"{rel}:{line}"

                if spec.startswith(("http://", "https://", "data:")):
                    deep.append(f"{where} remote import '{spec}' — the library is self-contained")
                    continue
                if spec == "react-dom" or spec.startswith("react-dom/"):
                    if "/components/" in f"/{rel}/" and scope == "ds/src":
                        react_dom.append(f"{where} react-dom import inside a component file")
                    continue
                if spec == "react" or spec.startswith("react/") or spec == "vaul" or spec.startswith("vaul/"):
                    continue

                resolved = resolve_rel(path, spec)
                if resolved is not None:
                    try:
                        inside = resolved.is_relative_to(ds_root)
                    except AttributeError:  # py<3.9 fallback
                        inside = str(resolved).startswith(str(ds_root))
                    if not inside:
                        top = None
                        try:
                            top = resolved.relative_to(root).parts[0]
                        except ValueError:
                            top = None
                        if top in LEGACY_TOP:
                            legacy.append(f"{where} imports the legacy library ({top}/) — forbidden (AGENTS, plan 4.1)")
                        else:
                            escaped.append(f"{where} import '{spec}' escapes ds/ (self-contained package)")
                        continue
                    # deep imports: icons / fonts / other components' internals
                    rest = None
                    try:
                        rest = resolved.relative_to(ds_root / "src")
                    except ValueError:
                        rest = None
                    if rest is not None and len(rest.parts) >= 2:
                        section, second = rest.parts[0], rest.parts[1]
                        in_own_section = path.parent == (ds_root / "src" / section)
                        # the CSS bundle entry (styles.css) aggregates the
                        # generated icon stylesheet and the font stylesheet.
                        css_entry = rel == "ds/src/styles.css"
                        if section == "icons" and "index" not in rest.parts \
                                and path.parent.name != "icons" and not css_entry:
                            deep.append(f"{where} deep icon import '{spec}' — use the icons index (D5)")
                        if section == "fonts" and not css_entry and not in_own_section:
                            deep.append(f"{where} font import '{spec}' — fonts load only via the styles.css entry (D8)")
                        if section == "components":
                            own = path.parent.name
                            if second != own and "index" not in rest.parts and not str(rest).startswith("tokens"):
                                deep.append(f"{where} deep import into component {second} — use its folder index")

    problems = legacy + escaped + react_dom + deep
    if legacy:
        gate.fail("ds-imports/legacy", f"{len(legacy)} imports from the legacy library")
        for p in legacy:
            gate.fail("ds-imports/legacy-import", p)
    else:
        gate.ok("ds-imports/legacy", "zero imports from components/ shared/ previews/")

    if escaped:
        gate.fail("ds-imports/self-contained", f"{len(escaped)} imports escaping ds/")
        for p in escaped:
            gate.fail("ds-imports/escape", p)
    else:
        gate.ok("ds-imports/self-contained", "every relative import stays inside ds/")

    if react_dom:
        gate.fail("ds-imports/react-dom", f"{len(react_dom)} react-dom imports in components")
        for p in react_dom:
            gate.fail("ds-imports/react-dom-import", p)
    else:
        gate.ok("ds-imports/react-dom", "no react-dom in component files")

    if deep:
        gate.fail("ds-imports/deep", f"{len(deep)} deep imports (icons/fonts/other components)")
        for p in deep:
            gate.fail("ds-imports/deep-import", p)
    else:
        gate.ok("ds-imports/deep", "icons and fonts via their indexes, components via folder indexes")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-imports", run))
