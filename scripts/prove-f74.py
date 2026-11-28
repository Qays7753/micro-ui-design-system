"""prove-f74.py — prove the compose gate's f74 check catches a regression.

Loads the compose view, mutates the tools fab back into a fixed overlay
(the pre-fix geometry: fixed at the start corner above the TabBar), then
runs the gate's own COMPOSE_JS and expects an [f74] violation.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
import importlib.util
_spec = importlib.util.spec_from_file_location(
    'ds_compose', str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates' / 'ds-compose.py'))
ds_compose = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ds_compose)
from common import browser_session, resolve_page_target, wait_lab_ready, read_tokens, ROOT  # noqa: E402

ENGINE = 'chromium'
MUTATE = """
() => {
  const fab = document.querySelector('.lab-tools-fab');
  fab.style.position = 'fixed';
  fab.style.insetInlineStart = '8px';
  fab.style.bottom = '76px';
}
"""

bounds = {
    "labelPx": float(read_tokens(ROOT)["type"]["label"]["size"]),
    "s2s": float(read_tokens(ROOT)["layout"]["section-to-section"]),
    "maxSections": int(read_tokens(ROOT)["quality"]["max-hub-sections"]),
}

import os
from common import browser_session, wait_lab_ready, read_tokens, ROOT  # noqa: E402

ENGINE = 'chromium'
SRC = ROOT / 'previews' / 'ds-lab' / 'standalone.html'
MUTATE = """
() => {
  const fab = document.querySelector('.lab-tools-fab');
  fab.style.position = 'fixed';
  fab.style.insetInlineStart = '8px';
  fab.style.bottom = '76px';
}
"""

bounds = {
    "labelPx": float(read_tokens(ROOT)["type"]["label"]["size"]),
    "s2s": float(read_tokens(ROOT)["layout"]["section-to-section"]),
    "maxSections": int(read_tokens(ROOT)["quality"]["max-hub-sections"]),
}

with browser_session(ENGINE) as session:
    page = session.page(viewport={'width': 390, 'height': 844})
    page.goto(SRC.as_uri() + '?view=compose', wait_until='load', timeout=20000)
    wait_lab_ready(page)
    page.wait_for_timeout(200)
    page.evaluate(MUTATE)
    page.wait_for_timeout(100)
    result = page.evaluate(ds_compose.COMPOSE_JS, bounds)
    problems = result.get('problems', [])
    f74 = [p for p in problems if p.startswith('[f74]')]
    print('problems:', len(problems))
    for p in f74:
        print('F74:', p)
    if not f74:
        print('PROOF FAILED — f74 did not catch the fixed-overlay regression')
        raise SystemExit(1)
    print('PROOF OK — f74 catches the regression')
