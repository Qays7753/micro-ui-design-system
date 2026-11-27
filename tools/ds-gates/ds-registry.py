#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-registry — every component is registered before it is used (lesson rule
76, unit 15).

Two checks:

  (أ) the lab catalog's section list (SECTIONS in ds/lab/src/App.tsx) covers
      EVERY component folder under ds/src/components — ids map to folder names
      by kebab-case, with the documented exceptions in config.json
      (registry_exceptions: entity→EntityMark, hero→HeroSurface,
      badge→StatusBadge, money→Money, controls→AmountVisibilityToggle). A
      component folder without a catalog section is a violation: nothing is
      used in a screen before the lab registers it. Runs only when the target
      carries the real tree (ds/src/components + ds/lab/src/App.tsx); the
      mini fixtures skip this half.

  (ب) nothing is drawn directly in a screen: every element class that looks
      like a component root (mds-<kebab> first token) on EITHER view, on BOTH
      engines, must map to a real component folder — a hand-drawn
      class="mds-fake" in a screen is a violation. The lab's own chrome uses
      lab-* classes and is not a component.

Fixtures: bad (a hand-drawn mds-fake block) must fail; clean (real component
roots only) must pass.
"""
import json
import re
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    resolve_page_target, wait_lab_ready

ROOTS_JS = """
(args) => {
  const bad = new Set();
  for (const el of document.querySelectorAll('[class*="mds-"]')) {
    for (const c of (el.getAttribute('class') || '').split(/\\s+/)) {
      if (c.startsWith('mds-') && !args.known.includes(c)) bad.add(c);
    }
  }
  return Array.from(bad);
}
"""


def known_classes(target):
    """Every mds-* class the LIBRARY defines (components CSS), or the fixture's
    documented known list."""
    base = Path(target)
    comp_dir = base / "ds" / "src" / "components"
    classes = set()
    if comp_dir.is_dir():
        src_dir = base / "ds" / "src"
        css_files = [q for q in src_dir.rglob("*") if q.suffix in (".css", ".tsx", ".ts")]
    else:
        fixture_list = base / "known-classes.txt"
        css_files = []
        if fixture_list.is_file():
            classes |= {ln.strip() for ln in fixture_list.read_text(encoding="utf-8").splitlines() if ln.strip()}
    rx = re.compile(r"(mds-[a-z0-9_-]+)")
    for path in css_files:
        try:
            classes |= set(rx.findall(path.read_text(encoding="utf-8")))
        except (UnicodeDecodeError, OSError):
            continue
    return sorted(classes)


def kebab(name):
    return re.sub(r"(?<=[a-z0-9])([A-Z])", r"-\1", name).lower()


def registry_check(gate: Gate, target):
    base = Path(target)
    comp_dir = base / "ds" / "src" / "components"
    app_tsx = base / "ds" / "lab" / "src" / "App.tsx"
    if not comp_dir.is_dir() or not app_tsx.is_file():
        gate.na("ds-registry/catalog", "target carries no ds tree (mini fixture) — the live repo is the checked state")
        return
    folders = sorted(p.name for p in comp_dir.iterdir() if p.is_dir())
    exceptions = CONFIG.get("registry_exceptions") or {}
    text = app_tsx.read_text(encoding="utf-8")
    ids = re.findall(r"\{\s*id:\s*'([a-z0-9-]+)'", text)
    # Plan B (B0): the domains wing's sections live in agent-2's own
    # ds/lab/src/domains/*.tsx files (one linking import in App.tsx); the
    # catalog scan reads every file of that directory too, so a domain
    # component page is registered exactly like a batch-1 section and a
    # private file outside the registry would be impossible.
    domains_dir = base / "ds" / "lab" / "src" / "domains"
    if domains_dir.is_dir():
        for df in sorted(domains_dir.glob("*.tsx")):
            ids += re.findall(r"\{\s*id:\s*'([a-z0-9-]+)'", df.read_text(encoding="utf-8"))
    if not ids:
        gate.fail("ds-registry/catalog", "no catalog section ids found in ds/lab/src/App.tsx")
        return
    missing = []
    for name in folders:
        kid = kebab(name)
        if kid in ids or name.lower() in ids or any(exceptions.get(i) == name for i in ids):
            continue
        missing.append(f"{name} (id '{kid}' and no exception)")
    valid = {kebab(f) for f in folders} | {i for i, name in exceptions.items() if name in folders}
    extra = [i for i in ids if i not in valid]
    if missing:
        gate.fail("ds-registry/catalog", f"{len(missing)} component folders without a catalog section")
        for m in missing:
            gate.fail("ds-registry/missing", m)
    elif extra:
        gate.fail("ds-registry/catalog", f"{len(extra)} catalog ids without a component folder: {', '.join(extra[:8])}")
    else:
        gate.ok("ds-registry/catalog", f"catalog covers all {len(folders)} component folders "
                f"({len(ids)} sections, exceptions documented in config)")


def run(gate: Gate, target, args):
    registry_check(gate, target)
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-registry/page-roots", resolved)
        return
    url, server = (resolved, None) if kind == "url" else (resolved[1], resolved[0])
    known = known_classes(target)

    for engine in CONFIG["engines"]:
        if args.engine != "both" and engine != args.engine:
            continue
        check_id = f"ds-registry/page-roots/{engine}"
        try:
            with browser_session(engine) as session:
                page = session.page(**DEFAULT_CONTEXT)
                page.goto(url, wait_until="load", timeout=20000)
                wait_lab_ready(page)
                page.wait_for_timeout(150)
                bad = page.evaluate(ROOTS_JS, {"known": known})
                if bad:
                    gate.fail(check_id, f"{len(bad)} hand-drawn mds-* roots not in the library")
                    for b in bad[:20]:
                        gate.fail("ds-registry/hand-drawn/" + engine, b)
                else:
                    gate.ok(check_id, f"every mds-* class on the page is library-defined ({len(known)} known classes)")
        except Exception as exc:
            gate.fail(check_id, f"browser error: {exc!r}")

    if server:
        server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-registry", run))
