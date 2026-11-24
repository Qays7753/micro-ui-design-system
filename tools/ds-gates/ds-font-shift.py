#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-font-shift — layout shift while the webfonts arrive, <= 2px (BRIEF 27.8, 29.3-د2).

Protocol (Chromium AND WebKit):
  1. the page is served locally; *.woff2 responses are held back ~600ms by
     the fixture server (no route-handler deadlock);
  2. right after domcontentloaded the gate records the rects of the marker
     elements ([data-ds-font-ref], else a sample of visible text elements) —
     the text is still in its fallback font;
  3. after document.fonts.ready the rects are recorded again;
  4. the maximum |dx| / |dy| / |dw| / |dh| over all markers must be <=
     quality.font-layout-shift-max-px from tokens.json (2px).
A fixture page can swap in a real tracked webfont (font.woff2 is served from
ds/src/fonts/ via the fixture alias) with a deliberately unmatched fallback
to prove the gate catches the jump.
"""
import re
from pathlib import Path

from common import CONFIG, ROOT, Gate, gate_main, browser_session, DEFAULT_CONTEXT, \
    LocalServer, read_tokens, token_by_path, wait_lab_ready

MARKERS_JS = """
() => {
  let els = Array.from(document.querySelectorAll('[data-ds-font-ref]'));
  if (!els.length) {
    els = Array.from(document.querySelectorAll('body *')).filter(el => {
      if (el.offsetParent === null) return false;
      return Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    }).slice(0, 30);
  }
  return els.map(el => {
    const r = el.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height};
  });
}
"""

# The marker body (without the arrow wrapper) for the frame-boundary sampler.
MARKERS_BODY = """
  let els = Array.from(document.querySelectorAll('[data-ds-font-ref]'));
  if (!els.length) {
    els = Array.from(document.querySelectorAll('body *')).filter(el => {
      if (el.offsetParent === null) return false;
      return Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    }).slice(0, 30);
  }
  return els.map(el => {
    const r = el.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height};
  });
"""

DEFAULT_FONT = "plex-arabic-400.woff2"


def resolve_font(target, args_font):
    if args_font:
        return Path(args_font)
    for base in (Path(target), ROOT):
        candidate = base / "ds" / "src" / "fonts" / DEFAULT_FONT
        if candidate.is_file():
            return candidate
    return None


def run(gate: Gate, target, args):
    font = resolve_font(target, getattr(args, "font", None))

    kind, url, server = "url", None, None
    if target and re.match(r"^(https?|file)://", target):
        url = target
    elif target:
        path = Path(target)
        if path.is_dir():
            page_file = next((path / n for n in ("previews/ds-lab/standalone.html", "standalone.html",
                                                 "page.html", "index.html")
                              if (path / n).is_file()), None)
        elif path.is_file():
            page_file = path
        else:
            page_file = None
        if page_file is None:
            try:
                is_root = path.resolve() == ROOT.resolve()
            except OSError:
                is_root = False
            reason = ("previews/ds-lab/standalone.html does not exist yet (lab build lands in S3)"
                      if is_root else
                      f"no page (previews/ds-lab/standalone.html, page.html) under {target}")
            gate.na("ds-font-shift/shift", reason)
            return
        serve_dir = page_file.parent
        server = LocalServer(serve_dir, delay_suffixes=(".woff2",),
                             aliases={"font.woff2": str(font)} if font else None)
        url = server.start() + "/" + page_file.name
    else:
        default = ROOT / "previews" / "ds-lab" / "standalone.html"
        if not default.is_file():
            gate.na("ds-font-shift/shift",
                    "previews/ds-lab/standalone.html does not exist yet (lab build lands in S3)")
            return
        server = LocalServer(default.parent, delay_suffixes=(".woff2",))
        url = server.start() + "/" + default.name

    tokens = read_tokens(target if target else ROOT) or read_tokens(ROOT) or {}
    max_shift = float(token_by_path(tokens, CONFIG["font_shift_max_token"])) if tokens else 2.0

    try:
        for engine in CONFIG["engines"]:
            if args.engine != "both" and engine != args.engine:
                continue
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="domcontentloaded", timeout=20000)
                    # Both samples at frame boundaries (two rAF each): a
                    # half-laid-out capture is what made this gate flaky
                    # under load — the before-measure could land after the
                    # swap for early elements while fonts.ready raced the
                    # relayout. Owner decision 2026-11-25: no retry loops,
                    # no raised thresholds — deterministic capture points.
                    before = page.evaluate(
                        "() => new Promise(res => requestAnimationFrame("
                        "() => requestAnimationFrame(() => res("
                        "(() => {" + MARKERS_BODY + "})()"
                        "))))"
                    )
                    page.wait_for_function("document.fonts.status === 'loaded'", timeout=15000)
                    after = page.evaluate(
                        "() => new Promise(res => requestAnimationFrame("
                        "() => requestAnimationFrame(() => res("
                        "(() => {" + MARKERS_BODY + "})()"
                        "))))"
                    )
                    # Fonts.ready can precede the final relayout by a frame;
                    # verify stability with one more frame-pair sample.
                    settle = page.evaluate(
                        "() => new Promise(res => requestAnimationFrame("
                        "() => requestAnimationFrame(() => res("
                        "(() => {" + MARKERS_BODY + "})()"
                        "))))"
                    )
                    if settle:
                        after = settle

                if not before:
                    gate.fail(f"ds-font-shift/shift/{engine}", "no text markers found on the page")
                    continue
                deltas = []
                for b, a in zip(before, after):
                    deltas.append(max(abs(a["x"] - b["x"]), abs(a["y"] - b["y"]),
                                      abs(a["w"] - b["w"]), abs(a["h"] - b["h"])))
                worst = max(deltas) if deltas else 0.0
                if worst > max_shift:
                    gate.fail(f"ds-font-shift/shift/{engine}",
                              f"font swap moved a marker by {worst:.2f}px > {max_shift:g}px "
                              f"(27.8: metric-matched fallback required; {len(deltas)} markers)")
                else:
                    gate.ok(f"ds-font-shift/shift/{engine}",
                            f"font swap shift {worst:.2f}px <= {max_shift:g}px across {len(deltas)} markers")
            except Exception as exc:
                gate.fail(f"ds-font-shift/shift/{engine}", f"browser error: {exc!r}")
    finally:
        if server:
            server.stop()


def extra_args(parser):
    parser.add_argument("--font", help=f"woff2 served as font.woff2 (default: ds/src/fonts/{DEFAULT_FONT})")


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-font-shift", run, extra_args))
