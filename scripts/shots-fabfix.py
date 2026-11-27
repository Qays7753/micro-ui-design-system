"""shots-fabfix.py — before/after proof of the tools-button clearance fix.

BEFORE: the pushed standalone at HEAD (the fixed-overlay fab covering the
finance tile's text at rest, and the delivery tile when scrolled).
AFTER:  the rebuilt standalone (the reserved dock band — nothing beneath).

Both at 390x844 on the compose view, at rest and scrolled to the tiles.
"""
import pathlib
import subprocess
import sys
import tempfile

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
AFTER = ROOT / 'previews' / 'ds-lab' / 'standalone.html'
OUT = ROOT / 'reports' / 'ds-addendum-1.7'

ENGINE = sys.argv[1] if len(sys.argv) > 1 else 'chromium'
W, H = 390, 844

# the pushed (pre-fix) standalone, extracted from git
tmp = pathlib.Path(tempfile.mkdtemp(prefix='fabfix-'))
before_html = tmp / 'standalone.html'
before_html.write_bytes(subprocess.check_output(
    ['git', '-C', str(ROOT), 'show', 'HEAD:previews/ds-lab/standalone.html']))
print('before (HEAD):', before_html)
print('after (worktree):', AFTER)

SCROLL_TO_TILES = """
() => { const el = document.querySelector('.lab-compose-content');
  el.scrollTop = el.scrollHeight; }
"""


def shots(page, src: pathlib.Path, tag: str):
    page.goto(src.as_uri() + '?view=compose')
    wait_lab_ready(page)
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / f'fabfix-{tag}-rest-{ENGINE}.png'))
    print(f'fabfix-{tag}-rest-{ENGINE}.png')
    page.evaluate(SCROLL_TO_TILES)
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / f'fabfix-{tag}-scrolled-{ENGINE}.png'))
    print(f'fabfix-{tag}-scrolled-{ENGINE}.png')


with browser_session(ENGINE) as s:
    page = s.page()
    page.set_viewport_size({'width': W, 'height': H})
    shots(page, before_html, 'before')
    shots(page, AFTER, 'after')
print('done', ENGINE)
