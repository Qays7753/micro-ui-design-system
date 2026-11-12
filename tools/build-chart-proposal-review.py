#!/usr/bin/env python3
"""Generate the review-only offline concept from its preview, using local fonts.
No dependency on, or modification of, the system showcase standalone builder.
"""
import argparse,base64,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'previews/chart-proposal/index.html'
OUT=ROOT/'docs/proposals/charts-2026-11-12/review.html'

def build():
    html=SOURCE.read_text()
    def stylesheet(match):
        path=(SOURCE.parent/match[1]).resolve()
        css=path.read_text()
        def font(m):
            file=(path.parent/m[1]).resolve()
            if file.suffix!='.woff2':raise ValueError('Unexpected CSS resource: '+str(file))
            data=base64.b64encode(file.read_bytes()).decode()
            return 'url("data:font/woff2;base64,'+data+'")'
        css=re.sub(r'url\([\'\"]?([^\'\"()]+)[\'\"]?\)',font,css)
        return '<style>\n'+css+'\n</style>'
    html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',stylesheet,html)
    js=(SOURCE.parent/'proposal.js').read_text()
    assert '</script' not in js.lower()
    html=html.replace('<script src="proposal.js"></script>','<script>\n'+js+'\n</script>')
    html=html.replace('../../docs/proposals/charts-2026-11-12/PROPOSAL.md','https://github.com/Qays7753/micro-ui-design-system/blob/feature/ui-system-component-audit-repair-2026-11-11/docs/proposals/charts-2026-11-12/PROPOSAL.md')
    license=(ROOT/'assets/fonts/LICENSE-IBM-Plex-OFL.txt').read_text()
    assert '-->' not in license
    return '<!-- GENERATED: review concept only; run tools/build-chart-proposal-review.py -->\n<!-- Embedded fonts license:\n'+license+'\n-->\n'+html

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--check',action='store_true');a=p.parse_args();html=build()
    if a.check:
        ok=OUT.exists() and OUT.read_text()==html
        print('Review concept '+('byte-identical PASS' if ok else 'STALE FAIL'));return not ok
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(html);print(f'Review concept generated: {len(html.encode())} bytes')
    return False
if __name__=='__main__':raise SystemExit(main())
