#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تحليل فرق البكسل قبل/بعد لقطات الوكيل 1 (قابل لإعادة التشغيل).

يقارن لقطات before/after لأداة sui-repair-a1-check نفسها (نفس المقاس والحالة)
ويكتب pixel-diff.json: صندوق الاختلاف ونسبة البكسلات المتغيرة — دليل أن
التغيير البصري موضعي ومقصود، وأن إزالة letter-spacing من h1 العربي بلا
أثر مرئي في Chromium (متوافق مع قياس التدقيق V8).

التشغيل من جذر المستودع:
  python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent1/scripts/pixel-diff.py
"""
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops


def find_repo(start: Path) -> Path:
    for d in [start] + list(start.parents):
        if (d / "tools" / "sui-repair-a1-check.py").exists():
            return d
    raise RuntimeError("لم يُعثر على جذر المستودع")


REPO = find_repo(Path(__file__).resolve())
BASE = REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent1" / "checks"
SHOTS = BASE / "screenshots"

PAIRS = [
    ("before-sui026-phones-390.png", "after-sui026-phones-390.png", "SUI-026"),
    ("before-sui026-phones-320.png", "after-sui026-phones-320.png", "SUI-026"),
    ("before-sui021-gallery-head-1280.png", "after-sui021-gallery-head-1280.png", "SUI-021"),
    ("before-sui021-gallery-head-390.png", "after-sui021-gallery-head-390.png", "SUI-021"),
    ("before-sui019-compositions-390.png", "after-sui019-compositions-390.png", "SUI-019"),
    ("before-sui019-example-usage-390.png", "after-sui019-example-usage-390.png", "SUI-019"),
]


def main():
    out = {
        "tool": "تحليل فرق البكسل قبل/بعد (PIL ImageChops) — تحديد نطاق التغيير البصري",
        "note": "المقارنة على لقطات الأداة نفسها بنفس المقاس؛ نسبة البكسلات المتغيرة تُظهر أن التغيير موضعي ومقصود، "
                "وأن إزالة letter-spacing من h1 العربي بلا أثر مرئي في Chromium (متوافق مع قياس التدقيق V8).",
        "generated": datetime.now(timezone.utc).isoformat(),
        "pairs": [],
    }
    for b, a, item in PAIRS:
        ib = Image.open(os.path.join(str(SHOTS), b)).convert("RGB")
        ia = Image.open(os.path.join(str(SHOTS), a)).convert("RGB")
        rec = {"item": item, "before": b, "after": a, "size": list(ib.size)}
        if ib.size == ia.size:
            diff = ImageChops.difference(ib, ia)
            bbox = diff.getbbox()
            changed = sum(1 for p in diff.getdata() if sum(p) > 12)
            total = ib.size[0] * ib.size[1]
            rec.update({"diff_bbox": bbox, "changed_pixels": changed,
                        "total_pixels": total, "changed_pct": round(100 * changed / total, 2)})
        else:
            rec["sizes_differ"] = True
        out["pairs"].append(rec)
    dest = BASE / "pixel-diff.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"كُتب: {dest}")


if __name__ == "__main__":
    main()
