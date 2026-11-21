#!/usr/bin/env python3
"""T6 (N-D3): توليد مختبر الهاتف بملف واحد — previews/device-lab/standalone.html.

يضمّن كل CSS (والخطوط base64 مع ترخيص SIL OFL كما في مولّد المعرض) وكل
سكربتات dist/iife وسلوك المختبر، فلا يطلب الملف أي شيء خارجيًا ويعمل
بفتحه مباشرة (file://). حتمي بايت-ببايت؛ وضع --check يتحقق من التطابق.
"""
import argparse
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "previews/device-lab/index.html"
OUT = ROOT / "previews/device-lab/standalone.html"

# إعادة استخدام دوال التضمين من مولّد المعرض (اسم الملف بشرطة → importlib)
_spec = importlib.util.spec_from_file_location(
    "showcase_standalone", ROOT / "tools/build-ui-system-showcase-standalone.py")
_mod = importlib.util.module_from_spec(_spec)
sys.modules["showcase_standalone"] = _mod
_spec.loader.exec_module(_mod)
inline_fonts_css = _mod.inline_fonts_css
inline_css_urls = _mod.inline_css_urls

BANNER = """<!-- GENERATED: tools/build-device-lab-standalone.py — edit previews/device-lab/ sources, not this file.
     مختبر الهاتف بملف واحد: كل CSS والخطوط (base64، الترخيص SIL OFL داخل ملف الخطوط) والسكربتات مضمّنة —
     يعمل من file:// بلا أي طلب شبكة. -->"""


def build() -> str:
    html = SRC.read_text(encoding="utf-8")
    # 1) الضمّ: <link rel="stylesheet" href="X"> → <style>…</style>
    def css_repl(m: re.Match) -> str:
        href = m.group(1)
        path = (SRC.parent / href).resolve()
        if not path.is_file():
            raise SystemExit(f"BUILD ERROR: missing stylesheet {href}")
        if path.name == "fonts.css":
            css = inline_fonts_css()
        else:
            css = path.read_text(encoding="utf-8")
            css = inline_css_urls(css, path.parent)
        return "<style>\n" + css + "\n</style>"
    html, n_css = re.subn(r'<link rel="stylesheet" href="([^"]+)">', css_repl, html)

    # 2) السكربتات: <script src="X"></script> → <script>…</script>
    def js_repl(m: re.Match) -> str:
        src = m.group(1)
        path = (SRC.parent / src).resolve()
        if not path.is_file():
            raise SystemExit(f"BUILD ERROR: missing script {src}")
        return "<script>\n" + path.read_text(encoding="utf-8") + "\n</script>"
    html, n_js = re.subn(r'<script src="([^"]+)"></script>', js_repl, html)

    if n_css == 0 or n_js == 0:
        raise SystemExit(f"BUILD ERROR: nothing inlined (css={n_css}, js={n_js})")
    # 3) العنوان والعلامة
    html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n" + BANNER, 1)
    html = html.replace("<title>مختبر الهاتف — Micro UI</title>",
                        "<title>مختبر الهاتف — Micro UI (ملف واحد)</title>", 1)
    return html


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true",
                    help="تحقق أن standalone.html مطابق لإعادة التوليد")
    args = ap.parse_args()
    generated = build()
    if args.check:
        if not OUT.is_file():
            raise SystemExit("CHECK FAIL: standalone.html غير موجود — أعد البناء")
        current = OUT.read_text(encoding="utf-8")
        if current != generated:
            raise SystemExit("CHECK FAIL: standalone.html يختلف عن إعادة التوليد — أعد البناء من المصادر")
        print("CHECK OK: standalone.html مطابق لإعادة التوليد بايت-ببايت")
        return 0
    OUT.write_text(generated, encoding="utf-8")
    print(f"BUILD OK: {OUT.relative_to(ROOT)} ({len(generated) // 1024}KB — كل CSS والسكربتات مضمّنة)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
