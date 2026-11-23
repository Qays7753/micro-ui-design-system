#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-standalone-mode — the lab file runs alone from file:// (plan K24, task S2 #11).

Opens previews/ds-lab/standalone.html (or --target) with the file:// protocol
on Chromium AND WebKit and verifies:
  - zero network requests (the single file is fully self-contained: no CDN,
    no remote font, no fetch — the owner opens it from a static raw URL)
  - no absolute resource paths (src="/..." href="/...") and no external
    http(s) resource URLs in the HTML
Today the file does not exist (lab build lands in S3): documented not
applicable. The proof fixture is an html that pulls a CDN script.
"""
import re
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, wait_lab_ready

EXTERNAL_RX = re.compile(r"(?:src|href|url)\s*[=(]\s*[\"']?\s*(?:(?:https?:)?//|/[^/\"' ])")


def run(gate: Gate, target, args):
    if target:
        path = Path(target)
        if re.match(r"^(https?|file)://", target):
            gate.fail("ds-standalone-mode/file-protocol", f"--target must be a file path for this gate, got {target}")
            return
        if path.is_dir():
            # Every directory goes through the same candidate search — the
            # repo root included (S4 fix: the old is_root shortcut skipped
            # the search and then reported the ROOT itself as "not a file",
            # so the normal no---target run said "not applicable" forever
            # even after previews/ds-lab/standalone.html landed).
            for candidate in (path / "previews" / "ds-lab" / "standalone.html", path / "standalone.html"):
                if candidate.is_file():
                    path = candidate
                    break
            else:
                gate.na("ds-standalone-mode/standalone",
                        f"no standalone html (previews/ds-lab/standalone.html) under {target}")
                return
        if not path.is_file():
            gate.na("ds-standalone-mode/standalone", f"--target file does not exist: {target}")
            return
    else:
        path = ROOT / "previews" / "ds-lab" / "standalone.html"
        if not path.is_file():
            gate.na("ds-standalone-mode/standalone",
                    "previews/ds-lab/standalone.html does not exist yet (lab build lands in S3)")
            return

    html = path.read_text(encoding="utf-8")
    url = path.resolve().as_uri()

    static_hits = [m.group(0) for m in EXTERNAL_RX.finditer(html)]

    for engine in CONFIG["engines"]:
        if args.engine != "both" and engine != args.engine:
            continue
        check_id = f"ds-standalone-mode/file://-alone/{engine}"
        try:
            with browser_session(engine) as session:
                page = session.page(**DEFAULT_CONTEXT)
                requests = []
                page.on("request", lambda req: requests.append(req.url)
                        if req.resource_type != "document" else None)
                page.goto(url, wait_until="load", timeout=15000)
                wait_lab_ready(page)
                page.wait_for_timeout(300)
                problems = []
                for req in requests:
                    problems.append(f"network request: {req}")
                for hit in static_hits:
                    problems.append(f"external/absolute reference in html: {hit}")
                if problems:
                    gate.fail(check_id, f"{len(problems)} violations (requests: {len(requests)})")
                    for p in problems[:10]:
                        gate.fail(f"ds-standalone-mode/violation/{engine}", p)
                else:
                    gate.ok(check_id, f"opened file:// with 0 subresource requests, no absolute paths")
        except Exception as exc:
            gate.fail(check_id, f"browser error: {exc!r}")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-standalone-mode", run))
