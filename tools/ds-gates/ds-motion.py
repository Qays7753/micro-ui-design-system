#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-motion — durations come from the tokens; reduced motion really reduces (BRIEF 23.14, task S2 #16).

Pass A (motion allowed): every animation-duration and transition-duration on
the page must equal a motion token duration (the set of motion.*.ms values in
tokens.json — 80/160/240/360/200/150/400/300/1400/600/800/20/120/3000/5000).
A 2000ms spin that is not a token is a violation.

Pass B (prefers-reduced-motion: reduce, emulated): for every element that
animates or transitions, the animation must stop (play-state paused, name
none, or duration 0) and the transition-duration must be 0ms — or exactly the
fade token (150ms), because BRIEF 23.14 says «reduced-motion: كل ما سبق يصير
fade», and the brief wins over the literal "0ms" reading of the task (the
documented resolution of that conflict; recorded in the S2 report).
Both passes run on Chromium AND WebKit.
"""
from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, resolve_page_target, \
    read_tokens, token_by_path, ROOT, wait_lab_ready

ANIMATED_JS = """
() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    if (el.offsetParent === null && el !== document.body) continue;
    const st = getComputedStyle(el);
    const anim = st.animationName !== 'none';
    const trans = st.transitionProperty !== 'none' && st.transitionDuration !== '0s';
    if (anim || trans) {
      out.push({
        tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40),
        anim, trans,
        animationDuration: st.animationDuration, animationPlayState: st.animationPlayState,
        transitionDuration: st.transitionDuration
      });
    }
  }
  return out;
}
"""


def parse_ms(duration):
    """Parse a CSS time list like '0.8s, 0.8s' or '800ms' → list of ms floats."""
    values = []
    for part in (duration or "").split(","):
        part = part.strip()
        if not part:
            continue
        if part.endswith("ms"):
            values.append(float(part[:-2]))
        elif part.endswith("s"):
            values.append(float(part[:-1]) * 1000.0)
        else:
            values.append(None)
    return values


def motion_durations(tokens):
    """All numeric motion durations/periods from tokens.json (reference set)."""
    values = set()
    motion = tokens.get("motion", {})
    for key, value in motion.items():
        if isinstance(value, dict):
            for sub, v in value.items():
                if isinstance(v, (int, float)) and (sub == "ms" or sub.endswith("-ms")):
                    values.add(float(v))
        elif isinstance(value, (int, float)) and key.endswith("ms"):
            values.add(float(value))
    return values


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-motion/tokens", resolved)
        return
    if kind == "url":
        url, server = resolved, None
    else:
        server, url = resolved

    tokens = read_tokens(target) or read_tokens(ROOT) or {}
    durations = motion_durations(tokens)
    fade_ms = float(token_by_path(tokens, CONFIG["motion_fade_token"])) if tokens else 150.0

    try:
        for engine in CONFIG["engines"]:
            if args.engine != "both" and engine != args.engine:
                continue
            problems = []
            try:
                # ---- Pass A: allowed motion ----
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(200)
                    animated = page.evaluate(ANIMATED_JS)
                    for el in animated:
                        for ms in parse_ms(el["animationDuration"]) if el["anim"] else []:
                            if ms is not None and ms not in durations:
                                problems.append(f"<{el['tag']} .{el['cls']}> animation-duration {ms:g}ms "
                                                f"is not a motion token {sorted(durations)} (23.14)")
                        for ms in parse_ms(el["transitionDuration"]) if el["trans"] else []:
                            if ms is not None and ms not in durations:
                                problems.append(f"<{el['tag']} .{el['cls']}> transition-duration {ms:g}ms "
                                                f"is not a motion token (23.14)")

                # ---- Pass B: reduced motion ----
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT, reduced_motion="reduce")
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(200)
                    reduced = page.evaluate(ANIMATED_JS)
                    for el in reduced:
                        if el["anim"]:
                            play = el["animationPlayState"]
                            dur = parse_ms(el["animationDuration"])
                            stopped = play == "paused" or all(d == 0 or d is None for d in dur)
                            if not stopped:
                                problems.append(f"<{el['tag']} .{el['cls']}> still animates under "
                                                f"prefers-reduced-motion (state {play}, {el['animationDuration']})")
                        if el["trans"]:
                            bad = [ms for ms in parse_ms(el["transitionDuration"])
                                   if ms is not None and ms != 0 and ms != fade_ms]
                            if bad:
                                problems.append(f"<{el['tag']} .{el['cls']}> transition {bad}ms survives "
                                                f"reduced-motion (only 0 or the fade token {fade_ms:g}ms allowed)")

                summary = f"{len(animated)} animated elements, {len(durations)} token durations"
                if problems:
                    gate.fail(f"ds-motion/tokens/{engine}", f"{summary}, {len(problems)} violations")
                    for p in problems[:15]:
                        gate.fail(f"ds-motion/violation/{engine}", p)
                else:
                    gate.ok(f"ds-motion/tokens/{engine}", summary + "; reduce stops everything or fades")
            except Exception as exc:
                gate.fail(f"ds-motion/tokens/{engine}", f"browser error: {exc!r}")
    finally:
        if server:
            server.stop()


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-motion", run))
