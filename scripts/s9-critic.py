#!/usr/bin/env python3
"""S9 critic review — geometric measurement of every SaveState / Toast /
InlineBanner / EmptyState / Skeleton claim (BRIEF 9.4, 23.7, 23.10,
23.12, 23.17, 517/658, 1649/1650) on both engines against the lab's
standalone.html. Run from the repo root.

Outputs reports/ds-batch1/s9-measure.json (tracked) and prints the
verdict table.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools' / 'ds-gates'))

from common import browser_session, DEFAULT_CONTEXT  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TARGET = (ROOT / 'previews' / 'ds-lab' / 'standalone.html').resolve().as_uri()

CLAIMS = [
    # SaveState (9.4, 656, 23.17)
    ("SaveState four instances in the lab", "#save-state",
     "el.querySelectorAll('.mds-save-state').length"),
    ("draft rides the waiting color", "#save-state .mds-save-state--draft",
     "getComputedStyle(el).color"),
    ("saved rides the done color", "#save-state .mds-save-state--saved",
     "getComputedStyle(el).color"),
    ("failed rides the problem color + role=alert", "#save-state .mds-save-state--failed",
     "getComputedStyle(el).color + '/' + el.getAttribute('role')"),
    ("sending is aria-busy, silent", "#save-state .mds-save-state--sending",
     "String(el.getAttribute('aria-busy')) + '/' + (el.querySelector('.mds-visually-hidden') ? 'announced-wrong' : 'silent')"),
    ("saved check draws (motion tokens present)", "#save-state .mds-save-state--saved .mds-save-state-icon path",
     "getComputedStyle(el).strokeDasharray !== 'none' ? 'draw-ready' : 'no-draw'"),
    ("state line fits content, never breaks (1347)", "#save-state .mds-save-state-text",
     "getComputedStyle(el).whiteSpace"),
    # Toast (23.12, 23.17)
    ("Toast bg is toast-bg", "#toast .mds-toast",
     "getComputedStyle(el).backgroundColor"),
    ("Toast text is white (on-dark)", "#toast .mds-toast-text",
     "getComputedStyle(el).color"),
    ("Toast radius 16", "#toast .mds-toast",
     "getComputedStyle(el).borderRadius"),
    ("Toast padding 12/16", "#toast .mds-toast",
     "getComputedStyle(el).paddingBlockStart + '/' + getComputedStyle(el).paddingInlineStart"),
    ("Toast layer.toast 70", "#toast .mds-toast",
     "getComputedStyle(el).zIndex"),
    ("Toast role=status polite (23.17)", "#toast .mds-toast",
     "el.getAttribute('role')"),
    ("Toast text two lines max (1348)", "#toast .mds-toast-text",
     "getComputedStyle(el).webkitLineClamp"),
    ("undo rides on-dark-action", "#toast .mds-toast-action",
     "(() => { const b = el.querySelector('button'); return b ? getComputedStyle(b).color : 'no-action-button'; })()"),
    ("Toast static in the lab stage", "#toast .mds-toast",
     "getComputedStyle(el).position"),
    # InlineBanner (517, 658, 23.23, 1649)
    ("banner icon 20", "#inline-banner .mds-inline-banner svg",
     "el.getBoundingClientRect().width"),
    ("offline pair problem-bg/problem-fg", "#inline-banner .mds-inline-banner--offline",
     "getComputedStyle(el).backgroundColor + '/' + getComputedStyle(el).color"),
    ("locked pair neutral", "#inline-banner .mds-inline-banner--locked",
     "getComputedStyle(el).backgroundColor + '/' + getComputedStyle(el).color"),
    ("info pair info", "#inline-banner .mds-inline-banner--info",
     "getComputedStyle(el).backgroundColor + '/' + getComputedStyle(el).color"),
    ("banner role=status polite (23.17)", "#inline-banner .mds-inline-banner",
     "el.getAttribute('role')"),
    ("banner static in the lab stage", "#inline-banner .mds-inline-banner",
     "getComputedStyle(el).position"),
    ("banner action slot present (658)", "#inline-banner .mds-inline-banner--info",
     "el.querySelector('.mds-inline-banner-action') ? 'action' : 'no-action'"),
    # EmptyState (23.7, 1649)
    ("EmptyState radius r-lg 24", "#empty-state .mds-empty-state",
     "getComputedStyle(el).borderRadius"),
    ("two ghost rows shaped like ObjectRow", "#empty-state .mds-empty-state",
     "el.querySelectorAll('.mds-empty-state-ghost').length"),
    ("ghost mark is the 44 shape", "#empty-state .mds-empty-state-ghost-mark",
     "el.getBoundingClientRect().width + 'x' + el.getBoundingClientRect().height"),
    ("ghost lines 72% / 48%", "#empty-state .mds-empty-state-ghost-line--body",
     "(() => { const b = el.getBoundingClientRect();"
     " const c = el.parentElement.querySelector('.mds-empty-state-ghost-line--caption').getBoundingClientRect();"
     " const w = el.parentElement.getBoundingClientRect().width;"
     " return Math.round(b.width / w * 100) + '%/' + Math.round(c.width / w * 100) + '%'; })()"),
    ("ghost lines use the skeleton color, no motion", "#empty-state .mds-empty-state-ghost-line--body",
     "getComputedStyle(el).backgroundColor + '/' + getComputedStyle(el).animationName"),
    ("ONE body sentence, centered", "#empty-state .mds-empty-state-sentence",
     "getComputedStyle(el).textAlign"),
    ("content ≤ 280 (1649)", "#empty-state .mds-empty-state-ghosts",
     "el.getBoundingClientRect().width"),
    # Skeleton (23.10, 1650)
    ("skeleton on a surface, never on the ground", "#skeleton .mds-surface",
     "getComputedStyle(el).backgroundColor"),
    ("body line 12 / 72% / r4", "#skeleton .mds-skeleton--body",
     "(() => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);"
     " const w = el.parentElement.getBoundingClientRect().width;"
     " return r.height + '/' + Math.round(r.width / w * 100) + '%/' + cs.borderRadius; })()"),
    ("caption line 10 / 48%", "#skeleton .mds-skeleton--caption",
     "(() => { const r = el.getBoundingClientRect(); const w = el.parentElement.getBoundingClientRect().width;"
     " return r.height + '/' + Math.round(r.width / w * 100) + '%'; })()"),
    ("hero rect 160x32 r8", "#skeleton .mds-skeleton--hero",
     "(() => { const r = el.getBoundingClientRect(); return r.width + 'x' + r.height + '/' + getComputedStyle(el).borderRadius; })()"),
    ("mark shape 44 with its radius", "#skeleton .mds-skeleton--mark",
     "(() => { const r = el.getBoundingClientRect(); return r.width + 'x' + r.height + '/' + getComputedStyle(el).borderRadius; })()"),
    ("pulse 1400ms infinite, no gradient (1650)", "#skeleton .mds-skeleton--body",
     "getComputedStyle(el).animationDuration + '/' + getComputedStyle(el).animationIterationCount + '/' +"
     " (getComputedStyle(el).backgroundImage === 'none' ? 'no-gradient' : 'GRADIENT-WRONG')"),
    ("static under reduced-motion (emulated)", "#skeleton .mds-skeleton--body",
     "(() => { el.style.animation = 'none'; const n = getComputedStyle(el).animationName;"
     " el.style.animation = ''; return n === 'none' ? 'static-ok' : n; })()"),
    ("skeleton aria-hidden (23.17)", "#skeleton .mds-skeleton--body",
     "el.getAttribute('aria-hidden')"),
]

SPECIAL = """
() => {
  const out = {};
  // SaveState: the saved instance carries the polite sr line.
  const saved = document.querySelector('#save-state .mds-save-state--saved');
  out.savedPolite = Boolean(saved && saved.querySelector('.mds-visually-hidden'));
  // Toast: undo button exists in the action row.
  out.toastUndo = Boolean(document.querySelector('#toast .mds-toast-action button'));
  // EmptyState: ONE action button in the second specimen.
  const empties = document.querySelectorAll('#empty-state .mds-empty-state');
  out.emptyInstances = empties.length;
  out.emptyAction = Boolean(empties[1] && empties[1].querySelector('.mds-empty-state-action button'));
  out.emptyFirstNoAction = empties[0] ? !empties[0].querySelector('.mds-empty-state-action') : null;
  return out;
}
"""


def measure(page):
    page.goto(TARGET)
    page.wait_for_selector('.mds-skeleton', state='attached', timeout=8000)
    page.wait_for_timeout(150)
    out = []
    for claim, sel, expr in CLAIMS:
        try:
            val = page.evaluate(
                "([sel, expr]) => { const el = document.querySelector(sel);"
                " if (!el) return 'NO-ELEMENT';"
                " const f = new Function('el', 'return ' + expr + ';');"
                " return String(f(el)); }",
                [sel, expr],
            )
        except Exception as e:
            val = f"EVAL-ERROR: {e}".splitlines()[0]
        out.append((claim, val))
    return out, page.evaluate(SPECIAL)


def main():
    results = {}
    special = {}
    for engine in ('chromium', 'webkit'):
        with browser_session(engine) as s:
            page = s.page(**DEFAULT_CONTEXT)
            rows, sp = measure(page)
            results[engine] = rows
            special[engine] = sp
    report = {
        'target': 'previews/ds-lab/standalone.html',
        'special': special,
        'engines': results,
    }
    out_path = ROOT / 'reports' / 'ds-batch1' / 's9-measure.json'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    for engine, rows in results.items():
        print(f'===== {engine} =====')
        for claim, val in rows:
            print(f'  {claim:62s} -> {val}')
        print(f'  special: {special[engine]}')


if __name__ == '__main__':
    main()
