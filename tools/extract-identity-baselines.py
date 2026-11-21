#!/usr/bin/env python3
"""One-time extraction of identity baselines from the historical pinned commit.

Phase 0 of the integration-readiness plan replaces the runtime dependence on
commit 161bb71adbed86e0df4382174cb07bd2fcb8d62d with a checked-in
`tools/baselines/identity.json`. This script performs that one-time extraction
so the result is reproducible and auditable:

- every `--micro-*` / `--ui-*` custom-property declaration in tokens.css
  (name -> exact declaration text), protecting all existing values;
- the SHA-256 of the legacy Dark token block (from `[data-theme="dark"]` to
  end of file), used by the Light-only inert-gate checks;
- the SHA-256 of every file under `assets/brand/micro-logo/v2/`;
- the pre-integration Fields source used by the read-only replay case in
  `tools/product-context-check.py` (from 280b33b), saved as
  `tools/baselines/fields-baseline.js`.

Run once from the repository root (a full clone that still contains the
historical commits); the outputs are ordinary tracked files afterwards.
"""
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDENTITY_COMMIT = "161bb71adbed86e0df4382174cb07bd2fcb8d62d"
FIELDS_COMMIT = "280b33b988428e3085c28cc150a0c71deb419889"
OUT = ROOT / "tools/baselines/identity.json"


def show(commit, path):
    return subprocess.check_output(["git", "show", f"{commit}:{path}"], cwd=ROOT, text=True)


def main():
    tokens = show(IDENTITY_COMMIT, "shared/tokens.css")
    marker = '[data-theme="dark"]'
    # Canonical legacy block: from the dark marker to end of file, right-stripped.
    # In the historical file the block ends with the dark rule's own closing "}".
    # In the current file the same block is wrapped in an inert @media, whose
    # extra trailing "}" the checks strip before comparing against this hash.
    legacy = tokens[tokens.index(marker):].rstrip()
    declarations = {}
    for match in re.finditer(r"^\s*(--[\w-]+)\s*:\s*([^;]+);", tokens, re.M):
        declarations[match.group(1)] = match.group(2).strip()

    # Documented deltas between the 161bb71 identity commit and the accepted
    # current state (recorded so the identity baseline stays traceable to the
    # extraction commit while the protection remains exact):
    # - R-06 (2026-10-25), audited contrast corrections for WCAG 1.4.11 (3:1)
    #   on white; the pre-correction values stay documented in tokens.css.
    # - --micro-metric-hero-separator moved out of tokens.css; metric-comparison
    #   defines its own --micro-metric-hero-separator-color locally since then.
    audited_token_changes = {
        "--micro-data-c": "#A189CA",
        "--micro-data-e": "#8E9A4D",
    }
    removed_tokens = ["--micro-metric-hero-separator"]

    logo_listing = subprocess.check_output(
        ["git", "ls-tree", "-r", "--name-only", IDENTITY_COMMIT, "--", "assets/brand/micro-logo/v2"],
        cwd=ROOT, text=True).splitlines()
    logo_hashes = {}
    for path in logo_listing:
        content = subprocess.check_output(["git", "show", f"{IDENTITY_COMMIT}:{path}"], cwd=ROOT)
        logo_hashes[path] = hashlib.sha256(content).hexdigest()

    identity = {
        "schemaVersion": 1,
        "extractedFromCommit": IDENTITY_COMMIT,
        "extractedOn": "2026-11-21",
        "note": "One-time identity snapshot so checks no longer need the historical commit object. "
                "Protected token values, the inert legacy Dark block, and logo v2 fingerprints.",
        "tokensCssDeclarations": declarations,
        "auditedTokenChanges": audited_token_changes,
        "removedTokens": removed_tokens,
        "legacyDarkBlockSha256": hashlib.sha256(legacy.encode()).hexdigest(),
        "brandAccent": "#D97757",
        "brandPrimary": "#164D59",
        "logoV2Sha256": logo_hashes,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(identity, ensure_ascii=False, indent=2) + "\n")

    fields = show(FIELDS_COMMIT, "components/fields/fields.js")
    fields_out = ROOT / "tools/baselines/fields-baseline.js"
    header = ("/* Baseline snapshot of components/fields/fields.js at "
              f"{FIELDS_COMMIT}, extracted once in Phase 0 so the read-only replay case in "
              "tools/product-context-check.py works without the historical commit object. "
              "Do not edit; not part of any package. */\n")
    fields_out.write_text(header + fields)
    print(f"identity.json: {len(declarations)} token declarations, "
          f"{len(logo_hashes)} logo v2 files; fields-baseline.js: {len(fields)} chars")


if __name__ == "__main__":
    raise SystemExit(main())
