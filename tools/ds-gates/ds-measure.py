#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-measure — exact dimensions from the tokens, ±0.5px (BRIEF 29, plan S2 #13).

The gate opens a page (default: the lab standalone when it exists; --target
accepts a URL, an html file, or a directory containing page.html) and measures
every element carrying data-ds-check="<id>" with getBoundingClientRect.

Expected values come from a spec file the future builder (S3+) extends:
  default:  tools/ds-gates/measure-spec.json
  fixtures: <target>/measure-spec.json (used automatically when present)
Spec entry:  {"id": "icon-button", "width": {"token": "size.touch-min"},
               "height": {"token": "size.touch-min"}}            — token ref
              {"id": "row-two-lines", "height": {"px": 72}}     — fixed number
              {"id": "entity-mark-md", "center": {"child":
               ".mds-entity-mark-initial"}}                      — centering:
              the child's rect center must sit within the measure tolerance
              (±0.5px) of the element's rect center on BOTH axes (ج1 as
              widened by addendum 1.6 و-2 item 7: the EntityMark initial is
              among the centered things). A missing child is a FAIL — a check
              that finds nothing proves nothing.
Token paths resolve against docs/design-system/tokens.json at the target root.
Runs on Chromium AND WebKit; every engine must pass.
"""
import json
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    read_tokens, token_by_path, resolve_page_target, wait_lab_ready

TOLERANCE = CONFIG["measure_tolerance_px"]

MEASURE_JS = """
(elements) => elements.map(el => {
  const r = el.getBoundingClientRect();
  return {tag: el.tagName.toLowerCase(), w: r.width, h: r.height};
})
"""

CENTER_JS = """
(args) => args.elements.map(el => {
  const child = el.querySelector(args.selector);
  if (!child) return null;
  const c = child.getBoundingClientRect();
  const p = el.getBoundingClientRect();
  return {
    dx: (c.x + c.width / 2) - (p.x + p.width / 2),
    dy: (c.y + c.height / 2) - (p.y + p.height / 2),
  };
})
"""


def load_spec(target, args_spec):
    if args_spec:
        return json.loads(Path(args_spec).read_text(encoding="utf-8")), Path(args_spec)
    candidate = Path(target) / "measure-spec.json"
    if candidate.is_file():
        return json.loads(candidate.read_text(encoding="utf-8")), candidate
    default = ROOT / "tools" / "ds-gates" / "measure-spec.json"
    return json.loads(default.read_text(encoding="utf-8")), default


def expected_value(spec_value, tokens):
    if "token" in spec_value:
        return float(token_by_path(tokens, spec_value["token"]))
    return float(spec_value["px"])


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-measure/dimensions", resolved)
        return
    if kind == "url":
        url, server = resolved, None
    else:
        server, url = resolved

    spec, spec_path = load_spec(target, getattr(args, "spec", None))
    tokens = read_tokens(ROOT if kind != "url" and target == str(ROOT) else target)
    if tokens is None:
        tokens = read_tokens(ROOT)
    checks = spec.get("checks") or []

    try:
        for engine in CONFIG["engines"]:
            if args.engine != "both" and engine != args.engine:
                continue
            check_id = f"ds-measure/dimensions/{engine}"
            problems = []
            measured = 0
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(150)
                    for entry in checks:
                        cid = entry["id"]
                        handle = page.query_selector_all(f'[data-ds-check="{cid}"]')
                        if not handle:
                            problems.append(f"[{cid}] no element with data-ds-check=\"{cid}\" on the page")
                            continue
                        rects = page.evaluate(MEASURE_JS, handle)
                        for i, rect in enumerate(rects):
                            measured += 1
                            for axis in ("width", "height"):
                                if axis not in entry:
                                    continue
                                want = expected_value(entry[axis], tokens)
                                got = rect["w"] if axis == "width" else rect["h"]
                                if abs(got - want) > TOLERANCE:
                                    problems.append(
                                        f"[{cid} #{i}] {axis} {got:.2f}px != token {want:g}px "
                                        f"(tolerance ±{TOLERANCE}px, {entry[axis]})")
                            if "center" in entry:
                                child_sel = entry["center"]["child"]
                                deltas = page.evaluate(
                                    CENTER_JS, {"elements": handle, "selector": child_sel})
                                for j, delta in enumerate(deltas):
                                    if delta is None:
                                        problems.append(
                                            f"[{cid} #{i}#{j}] center child '{child_sel}' not found — "
                                            "a check that finds nothing proves nothing")
                                        continue
                                    if abs(delta["dx"]) > TOLERANCE or abs(delta["dy"]) > TOLERANCE:
                                        problems.append(
                                            f"[{cid} #{i}#{j}] center off by "
                                            f"dx {delta['dx']:+.2f}px dy {delta['dy']:+.2f}px "
                                            f"(tolerance ±{TOLERANCE}px, child '{child_sel}')")
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(check_id, f"{len(checks)} spec checks, {measured} elements measured, {len(problems)} violations")
                for p in problems[:20]:
                    gate.fail(f"ds-measure/violation/{engine}", p)
            else:
                gate.ok(check_id, f"{len(checks)} spec checks, {measured} elements within ±{TOLERANCE}px (spec: {spec_path.name})")
    finally:
        if server:
            server.stop()


def extra_args(parser):
    parser.add_argument("--spec", help="path to the measure spec JSON (default: measure-spec.json near the target)")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-measure", run, extra_args))
