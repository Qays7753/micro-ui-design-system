#!/usr/bin/env python3
"""S12/2 critic screenshots — BOTH lab views (catalog + compose) on both
engines at 360x780 and 320x640, at font 100% and 200%. Full-page shots land
under /tmp/render/s12-critic/ (NOT tracked; the evidence recorded in the
report is the per-shot measurement JSON: horizontal overflow of the document
plus per-element clipping, the same criteria as text-scale-check's probe).

Owner requirement (three missing S12 items, item 1):
2 views x 2 engines x 2 sizes x 2 font scales = 16 shots, every one LOOKED at
against the section-26 checklist, every rejection fixed in its own commit.
"""
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'tools' / 'ds-gates'))
from common import browser_session, resolve_page_target, wait_lab_ready  # noqa: E402

OUT = Path('/tmp/render/s12-critic')
SIZES = [(360, 780), (320, 640)]
SCALES = [("100", "100%"), ("200", "200%")]   # the lab's own applyScale values
VIEWS = ["compose", "catalog"]          # compose = the default view
ENGINES = ["chromium", "webkit"]

# Same clipping criteria as tools/text-scale-check.py's PROBE (per-element
# scrollWidth vs clientWidth with the same ellipsis/overflow exemptions).
PROBE = """() => {
  const de = document.documentElement;
  const clipped = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!el || seen.has(el) || !node.textContent.trim()) continue;
    seen.add(el);
    const style = getComputedStyle(el);
    if (['auto', 'scroll', 'hidden'].includes(style.overflowX)) continue;
    if (style.textOverflow === 'ellipsis' || style.webkitLineClamp !== 'none') continue;
    if (el.scrollWidth > el.clientWidth + 1) {
      clipped.push({tag: el.tagName, cls: String(el.className).slice(0, 50),
                    sw: el.scrollWidth, cw: el.clientWidth});
    }
  }
  const families = [];
  document.fonts.forEach(f => {
    if (f.status === 'loaded' && !families.includes(f.family)) families.push(f.family);
  });
  return {
    overflowX: de.scrollWidth > de.clientWidth + 1,
    docW: de.scrollWidth, viewW: de.clientWidth, docH: de.scrollHeight,
    clipped: clipped.slice(0, 8),
    fontsLoaded: families,
  };
}"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    for view in VIEWS:
        os.environ['DS_VIEW'] = view
        kind, value = resolve_page_target('')
        if kind != 'server':
            print('cannot open view', view, value)
            sys.exit(1)
        server, url = value
        for engine in ENGINES:
            with browser_session(engine) as s:
                for (w, h) in SIZES:
                    for scale_name, root_size in SCALES:
                        page = s.page(viewport={'width': w, 'height': h},
                                      device_scale_factor=1)  # catalog@200% is
                        # 19101 CSS px tall — dsf 2 would break Playwright's
                        # 32767px screenshot cap; dsf 1 keeps every full-page
                        # shot under it and stays faithful to the layout.
                        try:
                            page.goto(url, wait_until='load', timeout=30000)
                            wait_lab_ready(page, timeout_ms=8000)
                            page.wait_for_timeout(700)   # webfonts settle
                            page.evaluate(
                                'document.documentElement.style.fontSize = '
                                f'"{root_size}"')
                            page.wait_for_timeout(500)   # reflow at that root
                            m = page.evaluate(PROBE)
                            name = f'{engine}-{view}-{w}x{h}-{scale_name}.png'
                            page.screenshot(path=str(OUT / name), full_page=True)
                            # Viewport-only companion: exactly what the user
                            # sees (sticky bars in place, no full-page-stitch
                            # artifacts, canvas = the real viewport).
                            page.screenshot(
                                path=str(OUT / f'{engine}-{view}-{w}x{h}-{scale_name}-vp.png'))
                            m.update(shot=name, engine=engine, view=view,
                                     width=w, height=h, scale=scale_name)
                            results.append(m)
                            flag = 'OVERFLOW' if m['overflowX'] else 'clean'
                            print(f"{engine:8s} {view:8s} {w}x{h} {scale_name}% "
                                  f"docH={m['docH']:5d} {flag} "
                                  f"clipped={len(m['clipped'])} fonts={m['fontsLoaded']}")
                        finally:
                            page.context.close()
        server.stop()
    (OUT / 'measurements.json').write_text(
        json.dumps(results, ensure_ascii=False, indent=1), encoding='utf-8')
    bad = [r for r in results if r['overflowX'] or r['clipped']]
    print(f"\n{len(results)} shots -> {OUT}")
    print(f"overflow/clipping failures: {len(bad)}")
    for r in bad:
        print('  FAIL', r['shot'], 'overflowX=', r['overflowX'], r['clipped'])
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
