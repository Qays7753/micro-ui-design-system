#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-consumer — the package contract a consumer installs (plan D1/D7/D10,
section 4) plus the S11 automated checks K13/K14/K15 (plan rows 221-223,
executed against ds/consumer-test).

Checks ds/package.json as the consumer's package manager sees it:
  - exports exposes exactly '.' and './styles.css', '.' with types + import
  - every JS entry in exports has a types entry
  - peerDependencies are exactly react ^19, react-dom ^19, vaul ^1 (D7: zero
    other runtime dependencies; an empty "dependencies" section)
  - sideEffects lists CSS only
  - "files" ships dist
  - main/module/types point into dist
"""
import json
import subprocess
from pathlib import Path

from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT

REQUIRED_PEERS = {"react": "^19", "react-dom": "^19", "vaul": "^1"}
EXPECTED_EXPORTS = {".", "./styles.css"}


def run(gate: Gate, target, args):
    pkg_path = Path(target) / "ds" / "package.json"
    if not pkg_path.is_file():
        gate.na("ds-consumer/exports", "no ds/package.json under target")
        return
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    problems = []

    # ---- exports ----
    exports = pkg.get("exports") or {}
    keys = set(exports)
    if keys != EXPECTED_EXPORTS:
        problems.append(f"exports keys {sorted(keys)} != {sorted(EXPECTED_EXPORTS)}")
    root_export = exports.get(".")
    if isinstance(root_export, dict):
        if "types" not in root_export:
            problems.append("exports '.' has no types condition (K-types for every entry)")
        if "import" not in root_export:
            problems.append("exports '.' has no import condition")
    elif root_export is not None:
        problems.append("exports '.' should be a conditional object {types, import}")
    for key, cond in exports.items():
        if key.endswith(".js") and isinstance(cond, dict) and "types" not in cond:
            problems.append(f"exports '{key}' has no types condition")
    if "./styles.css" not in keys:
        problems.append("exports is missing './styles.css' (the CSS entry)")

    # ---- peer dependencies ----
    peers = pkg.get("peerDependencies") or {}
    if peers != REQUIRED_PEERS:
        problems.append(f"peerDependencies {peers} != {REQUIRED_PEERS} (D7)")
    if pkg.get("dependencies"):
        problems.append(f"runtime dependencies present: {sorted(pkg['dependencies'])} (D7: zero)")

    # ---- side effects ----
    side = pkg.get("sideEffects")
    if side is None or side is True:
        problems.append("sideEffects missing/true — tree-shaking of JS would break")
    else:
        entries = side if isinstance(side, list) else [side]
        non_css = [e for e in entries if isinstance(e, str) and not e.endswith(".css")]
        if non_css:
            problems.append(f"sideEffects lists non-CSS entries: {non_css}")

    # ---- files + entry points ----
    files = pkg.get("files") or []
    if "dist" not in files:
        problems.append(f'"files" does not include dist: {files}')
    for field in ("main", "module", "types"):
        value = pkg.get(field)
        if not value or not value.startswith("./dist/"):
            problems.append(f'"{field}" must point into ./dist/, got {value!r}')

    if problems:
        gate.fail("ds-consumer/package", f"{len(problems)} package-contract problems")
        for p in problems:
            gate.fail("ds-consumer/problem", p)
    else:
        gate.ok("ds-consumer/package",
                "exports ./ ./styles.css with types, peers react/react-dom/vaul only, sideEffects CSS only, files include dist")

    run_consumer_checks(gate, Path(target))


def run_consumer_checks(gate: Gate, root: Path) -> None:
    """K15 (pack+install), K13 (build + 0 console), K14 (bridge = tokens)."""
    ds_dir = root / "ds"
    consumer = ds_dir / "consumer-test"
    if not (consumer / "package.json").is_file():
        gate.na("ds-consumer/k15-pack-install", "no ds/consumer-test scaffold")
        gate.na("ds-consumer/k13-build-console", "no ds/consumer-test scaffold")
        gate.na("ds-consumer/k14-bridge-value", "no ds/consumer-test scaffold")
        return

    pnpm = ["corepack", "pnpm"]

    # ---- K15: pnpm pack then install from the tarball ----
    pack = subprocess.run(pnpm + ["pack"], cwd=ds_dir, capture_output=True, text=True, timeout=300)
    tarballs = list(ds_dir.glob("micro-ds-*.tgz"))
    if pack.returncode != 0 or not tarballs:
        gate.fail("ds-consumer/k15-pack-install", f"pnpm pack failed: {pack.stderr[-200:]}")
        gate.na("ds-consumer/k13-build-console", "pack failed")
        gate.na("ds-consumer/k14-bridge-value", "pack failed")
        return
    install = subprocess.run(pnpm + ["install"], cwd=consumer, capture_output=True, text=True, timeout=600)
    pkg_src = consumer / "node_modules" / "@micro" / "ds" / "dist" / "index.js"
    if install.returncode != 0 or not pkg_src.is_file():
        gate.fail("ds-consumer/k15-pack-install",
                  f"install from tarball failed: {install.stderr[-200:]}")
        gate.na("ds-consumer/k13-build-console", "install failed")
        gate.na("ds-consumer/k14-bridge-value", "install failed")
        return
    gate.ok("ds-consumer/k15-pack-install",
            f"installed @micro/ds from {tarballs[0].name}; components come from node_modules")

    # ---- K13 first half: the consumer build (tsc + vite) ----
    build = subprocess.run(pnpm + ["run", "build"], cwd=consumer, capture_output=True, text=True, timeout=600)
    if build.returncode != 0:
        gate.fail("ds-consumer/k13-build-console", f"consumer build failed: {build.stderr[-300:]}")
        gate.na("ds-consumer/k14-bridge-value", "build failed")
        return
    dist = consumer / "dist"
    index_html = dist / "index.html"
    if not index_html.is_file():
        gate.fail("ds-consumer/k13-build-console", "consumer dist/index.html missing")
        gate.na("ds-consumer/k14-bridge-value", "dist missing")
        return

    # ---- serve dist: K13 console sweep + K14 bridge value ----
    import functools
    import http.server
    import threading

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(dist))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        tokens = json.loads((root / "docs" / "design-system" / "tokens.json").read_text(encoding="utf-8"))
        ground = tokens["color"]["canvas"]

        def rgb(hex_value: str) -> str:
            hex_value = hex_value.lstrip("#")
            return f"rgb({int(hex_value[0:2], 16)}, {int(hex_value[2:4], 16)}, {int(hex_value[4:6], 16)})"

        for engine in CONFIG["engines"]:
            messages: list[str] = []
            with browser_session(engine) as session:
                page = session.page(**DEFAULT_CONTEXT)
                page.on("console", lambda m, _msgs=messages: _msgs.append(m.text) if m.type in ("error", "warning") else None)
                page.on("pageerror", lambda e, _msgs=messages: _msgs.append(str(e)))
                page.goto(f"http://127.0.0.1:{port}/", wait_until="load", timeout=20000)
                page.wait_for_timeout(600)
                # ---- K14: the Tailwind class computes the token value ----
                bridge = page.evaluate(
                    "() => { const el = document.querySelector('[data-ds-check=consumer-bridge]');"
                    " return el ? getComputedStyle(el).backgroundColor : 'NO-ELEMENT'; }")
                if bridge != rgb(ground):
                    gate.fail(f"ds-consumer/k14-bridge-value/{engine}",
                              f"bg-ground computed {bridge} != tokens.json color.canvas {rgb(ground)} (K14)")
                else:
                    gate.ok(f"ds-consumer/k14-bridge-value/{engine}",
                            f"Tailwind bg-ground == tokens.json color.canvas ({ground})")
            if messages:
                gate.fail(f"ds-consumer/k13-build-console/{engine}",
                          f"{len(messages)} console errors/warnings: {messages[:3]}")
            else:
                gate.ok(f"ds-consumer/k13-build-console/{engine}",
                        "consumer build clean, 0 console errors, 0 React warnings")
    finally:
        server.shutdown()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-consumer", run))
