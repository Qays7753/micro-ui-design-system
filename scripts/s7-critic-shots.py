#!/usr/bin/env python3
"""S7 critic screenshots — 360x780 of the ActionBar/Sheet/ConfirmSheet
lab sections on both engines, saved under /tmp/render/s7-critic/ (NOT
tracked; evidence lives in the report JSON)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools' / 'ds-gates'))
from common import browser_session, DEFAULT_CONTEXT  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TARGET = (ROOT / 'previews' / 'ds-lab' / 'standalone.html').resolve().as_uri()
OUT = Path('/tmp/render/s7-critic')
SECTIONS = ['sheet', 'confirm-sheet', 'action-bar']


def shots(engine):
    with browser_session(engine) as s:
        page = s.page(**DEFAULT_CONTEXT)
        page.goto(TARGET)
        page.wait_for_selector('.mds-action-bar', state='attached', timeout=8000)
        for sec in SECTIONS:
            el = page.query_selector(f'#{sec}')
            if el:
                el.scroll_into_view_if_needed()
                page.wait_for_timeout(300)
                path = OUT / f'{engine}-{sec}.png'
                el.screenshot(path=str(path))
                print(f'{engine} {sec} -> {path.name}')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for engine in ('chromium', 'webkit'):
        shots(engine)


if __name__ == '__main__':
    main()
