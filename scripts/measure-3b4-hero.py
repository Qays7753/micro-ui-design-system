"""measure-3b4-hero.py — DOM measurement of the new ت2 hero structure.

Measures the marked hero (withSparkline sample) in the lab catalog on
Chromium at 360x780: total height, label line, one line, sparkline box,
and the label-line toggle bleed. Writes JSON to stdout.
"""
import json
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools' / 'ds-gates'))
from common import browser_session, wait_lab_ready  # noqa: E402

SRC = pathlib.Path(__file__).resolve().parents[1] / 'previews' / 'ds-lab' / 'standalone.html'

JS = """
() => {
  const hero = document.querySelector('[data-ds-check="hero"]');
  const header = hero.querySelector('.mds-hero-header');
  const toggle = hero.querySelector('.mds-amount-visibility-toggle');
  const amount = hero.querySelector('.mds-hero-amount');
  const line = hero.querySelector('.mds-hero-line');
  const spark = hero.querySelector('.mds-hero-sparkline');
  const svg = spark.querySelector('svg');
  const r = (el) => { const b = el.getBoundingClientRect(); return {x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height)}; };
  return {
    hero: r(hero), header: r(header), toggle: r(toggle), amount: r(amount),
    line: r(line), spark: r(spark), svg: r(svg),
    svgWidthAttr: svg.getAttribute('width'),
    heroPadding: getComputedStyle(hero).paddingTop,
    lineChildren: Array.from(line.children).map(c => c.className),
  };
}
"""

with browser_session('chromium') as s:
    page = s.page()
    page.set_viewport_size({'width': 360, 'height': 780})
    page.goto(SRC.as_uri() + '?view=catalog')
    wait_lab_ready(page)
    page.locator('#hero').scroll_into_view_if_needed()
    page.wait_for_timeout(200)
    data = page.evaluate(JS)
    print(json.dumps(data, ensure_ascii=False, indent=1))
