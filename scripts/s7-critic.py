#!/usr/bin/env python3
"""S7 critic review — geometric measurement of every ActionBar claim
(BRIEF 9.2, 23.16, 23.20, 27.3/27.4, 29.2) on both engines against the
lab's standalone.html. Run from the repo root.

Outputs a JSON report to reports/ds-batch1/s7-actionbar-measure.json
(tracked) and prints the verdict table.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools' / 'ds-gates'))

from common import browser_session, DEFAULT_CONTEXT  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TARGET = (ROOT / 'previews' / 'ds-lab' / 'standalone.html').resolve().as_uri()

CLAIMS = [
    # (claim, selector, JS expression or None for structural checks)
    ("bar background surface (white)", ".mds-action-bar",
     "getComputedStyle(el).backgroundColor"),
    ("bar top hairline present with content-more (23.16)",
     ".mds-action-bar--more", "getComputedStyle(el).borderTopWidth"),
    ("hairline color surface-edge", ".mds-action-bar--more",
     "getComputedStyle(el).borderTopColor"),
    ("no hairline when scrolled to end", ".lab-bar-stage:not(:has(.mds-action-bar--more)) .mds-action-bar",
     "getComputedStyle(el).borderTopWidth"),
    ("ONE primary button per bar", ".mds-action-bar",
     "el.querySelectorAll('.mds-button--primary').length"),
    ("primary fills the remaining width (flex 1 1 auto)", ".mds-action-bar-primary",
     "getComputedStyle(el).flexGrow + '/' + getComputedStyle(el).flexShrink"),
    ("secondary does not shrink (flex 0 0 auto)", ".mds-action-bar-secondary",
     "getComputedStyle(el).flexGrow + '/' + getComputedStyle(el).flexShrink"),
    ("bar layer is layer.bars (20)", ".mds-action-bar",
     "getComputedStyle(el).zIndex"),
    ("safe-area in bottom padding", ".mds-action-bar",
     "getComputedStyle(el).paddingBottom"),
    ("bar block padding 12", ".mds-action-bar",
     "getComputedStyle(el).paddingBlockStart + '/' + getComputedStyle(el).paddingBlockEnd"),
    ("bar inline padding = screen margin 16", ".mds-action-bar",
     "getComputedStyle(el).paddingInlineStart + '/' + getComputedStyle(el).paddingInlineEnd"),
    ("role=group with label", ".mds-action-bar",
     "el.getAttribute('role') + ':' + (el.getAttribute('aria-label') || '').slice(0, 12)"),
    ("primary button height 52 (size.button)", ".mds-action-bar .mds-button--primary",
     "el.getBoundingClientRect().height"),
    ("primary is full width (label single line)", ".mds-action-bar .mds-button--primary",
     "el.getBoundingClientRect().width"),
]


def measure(page):
    page.goto(TARGET)
    page.wait_for_selector('.mds-action-bar', state='attached', timeout=8000)
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
        except Exception as e:  # engine-specific CSS gaps logged, not fatal
            val = f"EVAL-ERROR: {e}".splitlines()[0]
        out.append((claim, val))
    return out


def main():
    results = {}
    for engine in ('chromium', 'webkit'):
        with browser_session(engine) as s:
            page = s.page(**DEFAULT_CONTEXT)
            results[engine] = measure(page)
    report = {
        'target': 'previews/ds-lab/standalone.html',
        'engines': results,
    }
    out_path = ROOT / 'reports' / 'ds-batch1' / 's7-actionbar-measure.json'
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    for engine, rows in results.items():
        print(f'===== {engine} =====')
        for claim, val in rows:
            print(f'  {claim:55s} -> {val}')


if __name__ == '__main__':
    main()
