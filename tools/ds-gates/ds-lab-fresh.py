#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-lab-fresh — the committed standalone is the build of the current source (plan K24/K25).

Interface (documented for the builder, S3):
  - the build command is the `build:standalone` script in ds/package.json
    (config.json: lab_build_script), run with cwd = ds/
  - it receives the output path in the environment variable
    DS_LAB_STANDALONE_OUT; a compliant build writes exactly there, so the
    gate never writes a file it controls (manifest --check pattern)
  - the gate byte-compares that output with previews/ds-lab/standalone.html
Today neither the script nor the file exists (lab lands in S3): documented
not applicable. Proof fixtures use a tiny fake build command to show the
byte comparison detects a stale file.
"""
import json
import os
import subprocess
import tempfile
from pathlib import Path

from common import CONFIG, Gate, gate_main, rel_of


def run(gate: Gate, target, args):
    root = Path(target)
    pkg_path = root / "ds" / "package.json"
    standalone = root / "previews" / "ds-lab" / "standalone.html"
    script_name = CONFIG["lab_build_script"]

    if not pkg_path.is_file():
        gate.na("ds-lab-fresh/freshness", "no ds/package.json under target")
        return
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    has_script = script_name in (pkg.get("scripts") or {})

    if not has_script and not standalone.is_file():
        gate.na("ds-lab-fresh/freshness",
                f"no '{script_name}' lab build command and no standalone.html yet (both land in S3)")
        return
    if not has_script:
        gate.fail("ds-lab-fresh/freshness",
                  "previews/ds-lab/standalone.html exists but ds/package.json has no "
                  f"'{script_name}' script — freshness cannot be verified (K25)")
        return

    # Run the build into a temp file (the gate never touches the tracked file).
    with tempfile.TemporaryDirectory(prefix="ds-lab-fresh-") as tmp:
        out_path = Path(tmp) / "standalone.html"
        env = dict(os.environ)
        env["DS_LAB_STANDALONE_OUT"] = str(out_path)
        proc = subprocess.run(["npm", "run", script_name], cwd=str(root / "ds"), env=env,
                              capture_output=True, text=True, timeout=180)
        if proc.returncode != 0:
            gate.fail("ds-lab-fresh/freshness",
                      f"`npm run {script_name}` failed (exit {proc.returncode}): "
                      f"{(proc.stderr or proc.stdout or '').strip()[-300:]}")
            return
        if not out_path.is_file():
            gate.fail("ds-lab-fresh/freshness",
                      f"the build command did not write $DS_LAB_STANDALONE_OUT — "
                      "a compliant build must honor that variable (see gate docstring)")
            return
        built = out_path.read_bytes()

    if not standalone.is_file():
        gate.fail("ds-lab-fresh/freshness",
                  "build output exists but previews/ds-lab/standalone.html is not committed — "
                  "standalone.html قديم — أعد بناءه وأدرجه")
        return
    committed = standalone.read_bytes()
    if built != committed:
        gate.fail("ds-lab-fresh/freshness",
                  f"previews/ds-lab/standalone.html is stale: built {len(built)} bytes vs "
                  f"committed {len(committed)} bytes — standalone.html قديم — أعد بناءه وأدرجه (K25)")
    else:
        gate.ok("ds-lab-fresh/freshness",
                f"{rel_of(standalone, root)} byte-identical to a fresh '{script_name}' build "
                f"({len(committed)} bytes)")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-lab-fresh", run))
