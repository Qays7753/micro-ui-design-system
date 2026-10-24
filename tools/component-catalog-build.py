#!/usr/bin/env python3
"""Derive the inventory from the one maturity catalog; no runtime requests."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LABELS = {"stable-ui": "STABLE UI", "draft-for-review": "DRAFT FOR REVIEW", "proposed": "PROPOSED"}


def build():
    catalog = json.loads((ROOT / "docs/COMPONENT-CATALOG.json").read_text())
    families = catalog["families"]
    assert len(families) == 14 and len({item["id"] for item in families}) == 14
    lines = [
        "# فهرس مكونات Micro UI",
        "",
        "<!-- GENERATED: tools/component-catalog-build.py — edit COMPONENT-CATALOG.json -->",
        "",
        "مصدر حالة النضج الوحيد: [`COMPONENT-CATALOG.json`](COMPONENT-CATALOG.json).",
        "هذه 14 عائلة؛ packed-circle متغير مقترح تحت Data وليس العائلة الخامسة عشرة.",
        "الحالة وصف للمصدر، لا شهادة منصة أو مصادقة أو حفظ أو جاهزية نقل.",
        "",
        "| العائلة | المواصفة والمصدر | المعاينة | النضج | التبعيات العائلية |",
        "|---|---|---|---|---|",
    ]
    for item in families:
        source = f"components/{item['id']}/specification.md"
        for path in (source, item["preview"]):
            assert (ROOT / path).is_file(), path
        assert item["maturity"] in LABELS, item
        lines.append(f"| {item['name']} | [`{item['id']}`](../{source}) | [فتح](../{item['preview']}) | {LABELS[item['maturity']]} | {', '.join(item['dependencies']) or 'لا توجد'} |")
    lines += ["", "## المتغيرات", "", "| المتغير | العائلة | النضج | opt-in | المعاينة |", "|---|---|---|---|---|"]
    for item in catalog["variants"]:
        assert item["family"] in {family["id"] for family in families}
        for path in item["source"]:
            assert (ROOT / path).is_file(), path
        lines.append(f"| {item['id']} | {item['family']} | {LABELS[item['maturity']]} | نعم | [فتح](../{item['preview']}) |")
    lines += [
        "", "## العقود العامة", "",
        "- القواعد المعتمدة: [`SYSTEM-CONTRACTS.md`](SYSTEM-CONTRACTS.md).",
        "- توكنز CSS مصدر التنفيذ؛ لا مسار DTCG موازٍ.",
        "- انطباق حالات initial/loading/empty/error/disabled/success يتبع مسؤولية كل مكوّن، لا قالبًا وهميًا موحدًا.",
        "- `MANIFEST.json` جرد بصمات، وليس مصدر النضج أو رسم التبعيات.",
        "- runtime success/error مختلف عن stable/draft/proposed.",
        "- المعرض: [`Overview / State Lab`](../previews/ui-system-showcase/index.html) و[`Composition Lab`](../previews/compositions/index.html).",
        "- المصدر والنسخة المولدة والمقارنات التاريخية وأدلة الاختبار فئات منفصلة.",
        "",
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    output = ROOT / "docs/COMPONENT-INVENTORY.md"
    content = build()
    catalog = json.loads((ROOT / "docs/COMPONENT-CATALOG.json").read_text())
    showcase = ROOT / "previews/ui-system-showcase/index.html"
    html = showcase.read_text()
    payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    pattern = r'(<script type="application/json" id="sc-component-catalog">)[\s\S]*?(</script>)'
    generated, count = re.subn(pattern, lambda match: match[1] + payload + match[2], html)
    assert count == 1, "Showcase must have exactly one generated catalog payload"
    hooks = set(re.findall(r'data-catalog-family="([^"]+)"', html))
    assert hooks == {item["id"] for item in catalog["families"]}, "Showcase family hooks differ from catalog"
    if args.check:
        if output.read_text() != content:
            raise SystemExit("Catalog inventory is stale")
        if generated != html:
            raise SystemExit("Showcase catalog payload is stale")
        print("Catalog: 14 families, 2 explicit variants, paths and inventory OK")
    else:
        output.write_text(content)
        showcase.write_text(generated)
        print("Generated docs/COMPONENT-INVENTORY.md from the maturity catalog")


if __name__ == "__main__":
    main()
