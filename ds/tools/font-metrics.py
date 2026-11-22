#!/usr/bin/env python3
"""font-metrics.py — read layout metrics from font files for the fallback math.

Used by ds/tools/generate-fonts.mjs (run with the repo venv python so fontTools
is available). Prints JSON:

{
  "upem": 1000,
  "ascender": 935,       # hhea
  "descender": -250,     # hhea (negative)
  "lineGap": 0,          # hhea
  "family": "Rubik",
  "variable": true,
  "axes": [{"tag": "wght", "min": 300, "max": 900}]
}

The fallback metric math (BRIEF 27.8 — metric-matched fallback so first paint
does not shift the layout by more than 2px):

    size-adjust        = (ascWeb + |descWeb|) / (ascRef + |descRef|)   # em-normalized
    ascent-override    = (ascWeb / size-adjust) * 100
    descent-override   = (|descWeb| / size-adjust) * 100
    line-gap-override  = (lineGapWeb / size-adjust) * 100

hhea metrics are used for both sides. Both webfonts set OS/2
USE_TYPO_METRICS (fsSelection bit 7) and their sTypoAscender/sTypoDescender
equal hhea (Rubik 935/-250, Plex 1085/-415), so hhea is the metric the
browsers actually use for line boxes here.
"""
import json
import sys

from fontTools.ttLib import TTFont


def metrics(path: str) -> dict:
    font = TTFont(path, lazy=True)
    head = font["head"]
    hhea = font["hhea"]
    axes = []
    if "fvar" in font:
        for axis in font["fvar"].axes:
            axes.append({"tag": axis.axisTag, "min": axis.minValue, "max": axis.maxValue})
    return {
        "path": path,
        "family": font["name"].getDebugName(1),
        "upem": head.unitsPerEm,
        "ascender": hhea.ascender,
        "descender": hhea.descender,
        "lineGap": hhea.lineGap,
        "variable": "fvar" in font,
        "axes": axes,
    }


def cmap(path: str) -> dict:
    font = TTFont(path, lazy=True)
    table = font.getBestCmap() or {}
    return {"path": path, "codepoints": sorted(table.keys())}


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "metrics":
        print(json.dumps([metrics(p) for p in sys.argv[2:]]))
    elif mode == "cmap":
        print(json.dumps([cmap(p) for p in sys.argv[2:]]))
    else:
        raise SystemExit(f"unknown mode: {mode}")
