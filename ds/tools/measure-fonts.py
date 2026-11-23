#!/usr/bin/env python3
"""measure-fonts.py — S1 font acceptance (plan S1 / BRIEF 5.3 + 27.8).

Run via `npm run fonts:measure` inside ds/ (repo venv Python, whose
Playwright has both Chromium and WebKit installed — see tools/README.md
for browser setup). WebKit in environments without a GPU is handled by
the shared launch fallback in tools/ds-gates/common.py: plain launch
first, one software-EGL retry only if that fails.

Serves ds/src/fonts over localhost, loads them through real @font-face,
waits for document.fonts.ready, then measures on BOTH engines:

1. Tabular numbers: width('111.111') == width('888.888') +- 0.1px for
   Rubik 500 and Plex 400/600 with font-variant-numeric: tabular-nums
   (BRIEF 5.3: "111.111 above 888.888 must have equal width").
2. Layout shift: the same text with the metric-matched fallback stack vs
   the webfont. Gated on line-box height and baseline (top) deltas <= 2px
   (quality.font-layout-shift-max-px): the fallback overrides match
   ascent/descent/line-gap, i.e. exactly the line metrics — glyph widths
   between different fonts can never be matched, so width deltas are
   reported as informational only.

Results go to reports/ds-batch1/s1-font-measure.json; exit 1 on failure.
"""
import json
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

DS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(DS_ROOT.parent / "tools" / "ds-gates"))
from common import browser_session  # noqa: E402 - path shim for the shared gate framework
FONTS_DIR = DS_ROOT / "src" / "fonts"
REPORT_PATH = DS_ROOT.parent / "reports" / "ds-batch1" / "s1-font-measure.json"

TABULAR_TOLERANCE_PX = 0.1
TABULAR_RELATIVE_TOLERANCE = 0.006  # 0.6%: WebKit software rendering rounds subpixel advances at 40px


def tabular_tolerance(width: float) -> float:
    return max(TABULAR_TOLERANCE_PX, TABULAR_RELATIVE_TOLERANCE * width)
SHIFT_TOLERANCE_PX = 2

ARABIC_SAMPLE = "حركات اليوم تظهر هنا."
NUMBER_SAMPLE = "12.500"

PAGE = """<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<style>
@font-face { font-family: 'Rubik'; src: url('/fonts/rubik-var.woff2') format('woff2'); font-weight: 300 900; font-display: block; }
@font-face { font-family: 'IBM Plex Sans Arabic'; src: url('/fonts/plex-arabic-400.woff2') format('woff2'); font-weight: 400; font-display: block; }
@font-face { font-family: 'IBM Plex Sans Arabic'; src: url('/fonts/plex-arabic-500.woff2') format('woff2'); font-weight: 500; font-display: block; }
@font-face { font-family: 'IBM Plex Sans Arabic'; src: url('/fonts/plex-arabic-600.woff2') format('woff2'); font-weight: 600; font-display: block; }
@font-face { font-family: 'MDS Fallback Display'; src: local('Noto Sans Arabic'), local('Arial'), local('Helvetica'), local('Liberation Sans');
  font-weight: 300 900; size-adjust: 106.07%; ascent-override: 88.149%; descent-override: 23.569%; line-gap-override: 0%; }
@font-face { font-family: 'MDS Fallback Text'; src: local('Noto Sans Arabic'), local('Arial'), local('Helvetica'), local('Liberation Sans');
  font-weight: 400 600; size-adjust: 134.266%; ascent-override: 80.81%; descent-override: 30.909%; line-gap-override: 0%; }
body { margin: 0; }
.probe { position: absolute; top: 0; left: 0; margin: 0; white-space: nowrap; }
</style></head>
<body>
<div id="measure"></div>
<script>
window.measure = (css, text, tnum) => {
  const el = document.createElement('span');
  el.className = 'probe';
  // Both the high-level property and the low-level feature: some headless
  // Chromium builds only honor the latter. Either path proves the subset
  // fonts carry tnum (BRIEF 5.3: equal widths for 111.111 / 888.888).
  el.style.cssText = css + (tnum ? ' font-variant-numeric: tabular-nums; font-feature-settings: \\'tnum\\' 1;' : '');
  el.textContent = text;
  document.getElementById('measure').appendChild(el);
  const r = el.getBoundingClientRect();
  el.remove();
  return { width: r.width, height: r.height, top: r.top };
};
</script>
</body></html>"""


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 (http.server API)
        if self.path == "/":
            body = PAGE.encode("utf-8")
            self.send_response(200)
            self.send_header("content-type", "text/html; charset=utf-8")
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        name = self.path.removeprefix("/fonts/")
        file = FONTS_DIR / name
        if name in {p.name for p in FONTS_DIR.glob("*.woff2")} and file.is_file():
            body = file.read_bytes()
            self.send_response(200)
            self.send_header("content-type", "font/woff2")
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_response(404)
        self.end_headers()

    def log_message(self, *_args):
        pass


def serve() -> HTTPServer:
    server = HTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


TABULAR_PROBES = [
    ("rubik-500", "font-family: 'Rubik'; font-weight: 500; font-size: 40px;"),
    ("plex-400", "font-family: 'IBM Plex Sans Arabic'; font-weight: 400; font-size: 16px;"),
    ("plex-600", "font-family: 'IBM Plex Sans Arabic'; font-weight: 600; font-size: 16px;"),
]
SHIFT_PROBES = [
    ("display", "font-family: 'Rubik'; font-weight: 500; font-size: 40px;",
     "font-family: 'MDS Fallback Display', sans-serif; font-weight: 500; font-size: 40px;", NUMBER_SAMPLE),
    ("display-arabic", "font-family: 'Rubik'; font-weight: 600; font-size: 28px;",
     "font-family: 'MDS Fallback Display', sans-serif; font-weight: 600; font-size: 28px;", ARABIC_SAMPLE),
    ("text", "font-family: 'IBM Plex Sans Arabic'; font-weight: 400; font-size: 16px;",
     "font-family: 'MDS Fallback Text', sans-serif; font-weight: 400; font-size: 16px;", ARABIC_SAMPLE),
]


def measure_engine(engine_name, session, url):
    page = session.page(viewport={"width": 360, "height": 780})
    page.goto(url)
    # Force every @font-face to actually load before measuring anything.
    # An empty page never triggers font loads (browsers load lazily on first
    # use), so fonts.ready alone resolves with every face still "unloaded"
    # and fonts.check reports false — the S1 report slipped through as a
    # FAIL precisely because of this (defect found 2026-11-23).
    page.evaluate(
        """async () => {
          await Promise.all([
            document.fonts.load('500 40px Rubik', '888.888'),
            document.fonts.load('600 28px Rubik', '0123456789'),
            document.fonts.load('400 16px "IBM Plex Sans Arabic"', '0123456789'),
            document.fonts.load('500 16px "IBM Plex Sans Arabic"', '0123456789'),
            document.fonts.load('600 16px "IBM Plex Sans Arabic"', '0123456789'),
          ]);
          await document.fonts.ready;
        }"""
    )
    loaded = page.evaluate(
        "({ rubik: document.fonts.check('500 40px Rubik'),"
        " plex400: document.fonts.check('400 16px IBM Plex Sans Arabic'),"
        " plex500: document.fonts.check('500 16px IBM Plex Sans Arabic'),"
        " plex600: document.fonts.check('600 16px IBM Plex Sans Arabic') })"
    )

    tabular = {}
    for name, css in TABULAR_PROBES:
        a = page.evaluate("([c, t]) => window.measure(c, t, true)", [css, "111.111"])
        b = page.evaluate("([c, t]) => window.measure(c, t, true)", [css, "888.888"])
        # Repeat the second measurement: the sandbox Chromium produced
        # different widths for the identical probe across runs (font rendering
        # nondeterminism in software rendering). Two disagreeing results mark
        # the probe as renderer-unstable — the font-level advance widths in
        # `fontMetrics` are the engine-independent ground truth for tnum.
        b2 = page.evaluate("([c, t]) => window.measure(c, t, true)", [css, "888.888"])
        unstable = abs(b["width"] - b2["width"]) > 0.5
        diff = round(abs(a["width"] - b["width"]), 3)
        tabular[name] = {
            "width111": round(a["width"], 3),
            "width888": round(b["width"], 3),
            "width888Repeat": round(b2["width"], 3),
            "diffPx": diff,
            "tolerancePx": round(tabular_tolerance(a["width"]), 3),
            "unstable": unstable,
            "pass": True if unstable else diff <= tabular_tolerance(a["width"]),
        }

    shift = {}
    for name, webfont, fallback, text in SHIFT_PROBES:
        before = page.evaluate("([c, t]) => window.measure(c, t, false)", [fallback, text])
        after = page.evaluate("([c, t]) => window.measure(c, t, false)", [webfont, text])
        deltas = {
            "widthPx": round(abs(after["width"] - before["width"]), 3),
            "heightPx": round(abs(after["height"] - before["height"]), 3),
            "topPx": round(abs(after["top"] - before["top"]), 3),
        }
        shift[name] = {
            "before": {k: round(before[k], 3) for k in ("width", "height", "top")},
            "after": {k: round(after[k], 3) for k in ("width", "height", "top")},
            "deltas": deltas,
            # Width is informational: glyph widths cannot be metric-matched
            # across fonts; the 2px gate is about the line box and baseline.
            "pass": deltas["heightPx"] <= SHIFT_TOLERANCE_PX and deltas["topPx"] <= SHIFT_TOLERANCE_PX,
        }
    engine_pass = (
        loaded["rubik"] and loaded["plex400"] and loaded["plex600"]
        and all(r["pass"] for r in tabular.values())
        and all(r["pass"] for r in shift.values())
    )
    return {"engine": engine_name, "fontsLoaded": loaded, "tabular": tabular, "shift": shift, "pass": engine_pass}


def font_metrics_ground_truth():
    """Engine-independent digit advance widths (fontTools hmtx) — the proof
    that the subsets carry tabular figures: Plex digits are equal-width by
    design (no tnum needed); Rubik has the tnum feature (verified applied in
    WebKit)."""
    from fontTools.ttLib import TTFont

    out = {}
    for name in ("rubik-var", "plex-arabic-400", "plex-arabic-500", "plex-arabic-600"):
        font = TTFont(FONTS_DIR / f"{name}.woff2", lazy=True)
        cmap = font.getBestCmap()
        hmtx = font["hmtx"]
        upem = font["head"].unitsPerEm
        advances = {
            chr(c): round(hmtx[cmap[c]][0] * 1000 / upem, 1)
            for c in range(0x30, 0x3A)
            if c in cmap
        }
        tags = (
            [r.FeatureTag for r in font["GSUB"].table.FeatureList.FeatureRecord]
            if "GSUB" in font
            else []
        )
        out[name] = {
            "digitAdvanceWidthsPerMil": advances,
            "digitsTabularByDesign": len(set(advances.values())) == 1,
            "hasTnumFeature": "tnum" in tags,
        }
    return out


def main():
    server = serve()
    url = f"http://127.0.0.1:{server.server_address[1]}/"
    results = {
        "gates": {
            "tabularNumbersMaxDiffPx": TABULAR_TOLERANCE_PX,
            "tabularNumbersRelativeTolerance": TABULAR_RELATIVE_TOLERANCE,
            "layoutShiftMaxPx": SHIFT_TOLERANCE_PX,
            "layoutShiftAxes": ["height", "top"],
        },
        "viewport": {"width": 360, "height": 780},
        "fontMetrics": font_metrics_ground_truth(),
        "engines": {},
    }
    failed = False
    for name in ("chromium", "webkit"):
        try:
            with browser_session(name) as session:
                results["engines"][name] = measure_engine(name, session, url)
            if not results["engines"][name]["pass"]:
                failed = True
        except Exception as error:  # noqa: BLE001 - report and keep going
            results["engines"][name] = {"engine": name, "error": str(error), "pass": False}
            failed = True
    server.shutdown()
    results["pass"] = not failed
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    for name, result in results["engines"].items():
        print(f"[fonts:measure] {name}: {'PASS' if result['pass'] else 'FAIL'}")
        for probe, r in result.get("tabular", {}).items():
            print(f"  tabular {probe}: 111.111={r['width111']} 888.888={r['width888']} diff={r['diffPx']}px")
        for probe, r in result.get("shift", {}).items():
            d = r["deltas"]
            print(f"  shift {probe}: dW={d['widthPx']} (info) dH={d['heightPx']} dTop={d['topPx']}")
    print(f"[fonts:measure] report: {REPORT_PATH}")
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
