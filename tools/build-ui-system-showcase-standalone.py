#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — توليد النسخة المكتفية ذاتيًا لمعرض نظام الواجهة (ملف واحد بلا تبعيات).
من جذر المستودع:
    python3 tools/build-ui-system-showcase-standalone.py            # يكتب previews/ui-system-showcase/standalone.html
    python3 tools/build-ui-system-showcase-standalone.py --check    # يتحقق أن الملف القائم مطابق لإعادة التوليد (بلا كتابة)

المصدر الوحيد (المعمارية نفسها لأداة build-f03-standalone.py — مبادئ دون سيناريو المنتج):
- ملفات previews/ui-system-showcase/{index.html, showcase.css, showcase.js}
  والأصول المعتمدة (shared/tokens.css، components/*.css|js، assets/fonts، assets/icons).
- لا نسختان تُعدلان يدويًا: standalone.html مولّد دائمًا — أي تعديل يمر عبر المصادر ثم إعادة البناء.
- حتمي تمامًا: نفس المدخلات → نفس البايتات (لا أختام زمن ولا قيم بيئة).
- حماية أصول الأيقونات (R1-02): كل <symbol> في index.html يحمل data-icon-source="اسم الملف"
  ويُقارن محتواه بمكافئه في assets/icons — أي انحراف في المسارات أو الخصائص (منها fill)
  يفشل البناء.
- الخطوط مضمّنة base64 من أصول fonts.css نفسها مع حفظ ترخيص SIL OFL 1.1 كاملًا داخل الملف،
  وترخيص HugeIcons للأيقونات المضمّنة كذلك.
- بلا fetch/import ولا modules ولا CDN ولا ملفات جانبية: كل CSS/JS/SVG/خط داخل الملف الواحد.
- يعمل مباشرة من file:// (كل مكوّنات العرض خالية من الشبكة؛ رموز الأيقونات sprite مضمّن
  بدل icons.js الذي يتطلب http).
"""
import argparse
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SAMPLE = ROOT / "previews" / "ui-system-showcase"
OUT = SAMPLE / "standalone.html"

FONTS_CSS = ROOT / "assets" / "fonts" / "fonts.css"
FONT_LICENSE = ROOT / "assets" / "fonts" / "LICENSE-IBM-Plex-OFL.txt"
ICONS_LICENSE = ROOT / "assets" / "icons" / "LICENSE-hugeicons.txt"
ICONS_DIR = ROOT / "assets" / "icons"

# CSS وJS المضمّنة — بترتيبها في index.html نفسه (أهمية للترتيب التراكبي)
EXPECTED_CSS = [
    "assets/fonts/fonts.css",
    "shared/tokens.css",
    "shared/motion.css",
    "components/buttons/buttons.css",
    "components/fields/fields.css",
    "components/selection/selection.css",
    "components/selection/picker.css",
    "components/organization/organization.css",
    "components/data/data.css",
    "components/data/packed-circle.css",
    "components/messages/messages.css",
    "components/navigation/navigation.css",
    "components/surfaces/surfaces.css",
    "components/surfaces/curves.css",
    "components/info-strip/info-strip.css",
    "components/info-strip/info-strip-peek.css",
    "components/metric-comparison/metric-comparison.css",
    "components/account-settings/account-settings.css",
    "components/access-gateway/access-gateway.css",
    "components/order-schedule/order-schedule.css",
    "components/carousel/carousel.css",
    "previews/ui-system-showcase/showcase.css",
]
EXPECTED_JS = [
    "components/buttons/buttons.js",
    "components/fields/fields.js",
    "components/selection/selection.js",
    "components/selection/picker.js",
    "components/messages/messages.js",
    "components/navigation/navigation.js",
    "components/organization/organization.js",
    "components/data/data.js",
    "components/data/packed-circle.js",
    "components/info-strip/info-strip.js",
    "components/info-strip/info-strip-peek.js",
    "components/metric-comparison/metric-comparison.js",
    "components/account-settings/account-settings.js",
    "components/access-gateway/access-gateway.js",
    "components/order-schedule/order-schedule.js",
    "components/carousel/carousel.js",
    "previews/ui-system-showcase/showcase.js",
]


def repo_rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()


def read(p: Path) -> str:
    if not p.is_file():
        raise SystemExit(f"BUILD ERROR: ملف مطلوب غير موجود: {repo_rel(p)}")
    return p.read_text(encoding="utf-8")


def normalize_svg_fragment(svg_text: str) -> str:
    """تطبيع مقارن: إزالة التعليقات والمسافات الزائدة لمقارنة العقد الفعلية."""
    s = re.sub(r"<!--.*?-->", "", svg_text, flags=re.S)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def symbol_inner(symbol_text: str) -> str:
    m = re.search(r"<symbol\b[^>]*>(.*)</symbol>", symbol_text, flags=re.S)
    if not m:
        raise SystemExit("BUILD ERROR: symbol بلا محتوى قابل للتحديد")
    return normalize_svg_fragment(m.group(1))


def asset_inner(fname: str) -> tuple[str, str]:
    raw = read(ICONS_DIR / fname)
    m = re.search(r"<svg\b([^>]*)>(.*)</svg>", raw, flags=re.S)
    if not m:
        raise SystemExit(f"BUILD ERROR: أصل أيقونة غير مقروء: assets/icons/{fname}")
    attrs, inner = m.group(1), m.group(2)
    fill_m = re.search(r'fill="([^"]*)"', attrs)
    fill = fill_m.group(1) if fill_m else ""
    return normalize_svg_fragment(inner), fill


def verify_icons(html: str) -> None:
    """(R1-02) كل symbol مع data-icon-source يطابق أصله: المحتوى وسمة fill."""
    symbols = re.findall(r"<symbol\b[^>]*>.*?</symbol>", html, flags=re.S)
    checked = 0
    for sym in symbols:
        src_m = re.search(r'data-icon-source="([^"]+)"', sym)
        if not src_m:
            continue
        fname = src_m.group(1)
        asset_inner_text, asset_fill = asset_inner(fname)
        sym_inner = symbol_inner(sym)
        if sym_inner != asset_inner_text:
            raise SystemExit(
                f"BUILD ERROR (R1-02): محتوى الرمز يخالف الأصل assets/icons/{fname} — "
                f"انسخ الأصل كما هو أو أصلح المصدر ثم أعد البناء")
        sym_fill_m = re.search(r'fill="([^"]*)"', sym[: sym.find(">")])
        sym_fill = sym_fill_m.group(1) if sym_fill_m else ""
        if sym_fill != asset_fill:
            raise SystemExit(
                f"BUILD ERROR (R1-02): سمة fill للرمز ({sym_fill!r}) تخالف الأصل "
                f"assets/icons/{fname} ({asset_fill!r}) — استعد خصائص الأصل المعتمد")
        checked += 1
    if checked == 0:
        raise SystemExit("BUILD ERROR (R1-02): لا رموز موسومة data-icon-source للتحقق")
    print(f"ICON CHECK OK: {checked} رمزًا يطابق أصول assets/icons (المحتوى وfill)")


def inline_fonts_css() -> str:
    """fonts.css الأصلية مع استبدال كل woff2 بـ data: URI base64 (نفس القواعد والترتيب)."""
    css = read(FONTS_CSS)
    lic = FONT_LICENSE.read_text(encoding="utf-8").strip()
    header = (
        "/* == خطوط مضمّنة (base64) من assets/fonts/fonts.css الأصلية دون تغيير القواعد ==\n"
        "   العائلات: IBM Plex Sans Arabic + IBM Plex Sans (400/500/600) — مصدر fontsource.\n"
        "   الترخيص SIL OFL 1.1 كاملًا أدناه، والمصدر في assets/fonts/LICENSE-IBM-Plex-OFL.txt. */\n"
        f"/*\n{lic}\n*/\n"
    )

    def repl(m: re.Match) -> str:
        fname = m.group(1)
        fpath = FONTS_CSS.parent / fname
        data = base64.b64encode(fpath.read_bytes()).decode("ascii")
        return f"url('data:font/woff2;base64,{data}')"

    css2 = re.sub(r"url\('\./([^']+\.woff2)'\)", repl, css)
    if "data:font/woff2" not in css2:
        raise SystemExit("BUILD ERROR: لم تُضمّن أي خطوط — تحقق من مسارات url() في fonts.css")
    return header + css2


def inline_css_urls(css_text: str, css_dir: Path) -> str:
    """حشو url() التي تشير إلى أصول المستودع بـ data URIs (svg) — لاستقلالية
    الملف الواحد عن ملفات جانبية. data:/http تُمرر كما هي، وwoff2 تُدار
    بواسطة inline_fonts_css حصرًا. المسارات تُحل نسبةً إلى موضع ملف CSS الأصلي."""

    def repl(m: re.Match) -> str:
        quote, path = m.group(1) or "", m.group(2)
        if path.startswith("data:") or path.startswith("http://") or path.startswith("https://"):
            return m.group(0)
        if path.endswith(".woff2"):
            return m.group(0)
        resolved = (css_dir / path).resolve()
        try:
            rel = repo_rel(resolved)
        except ValueError:
            return m.group(0)
        if not rel.startswith("assets/") or not resolved.is_file():
            return m.group(0)
        data = base64.b64encode(resolved.read_bytes()).decode("ascii")
        return f"url({quote}data:image/svg+xml;base64,{data}{quote})"

    return re.sub(r"url\((['\"]?)([^)'\"]+)\1\)", repl, css_text)


def style_block(src_rel: str, css: str) -> str:
    return f'<style data-sc-from="{src_rel}">\n{css}\n</style>'


def script_block(src_rel: str, js: str) -> str:
    # تهريب الإغلاق الحرفي (يظهر في تعليقات التوثيق مثل buttons.js):
    # "<\/script" مكافئة تمامًا لـ"</script" دلاليًا داخل JS لكنها لا تُغلق
    # وسم <script> في تحليل HTML.
    js_safe = js.replace("</script", "<\\/script")
    return f'<script data-sc-from="{src_rel}">\n{js_safe}\n</script>'


def build_html() -> str:
    html = read(SAMPLE / "index.html")

    # 1) أوراق الأنماط: fonts.css تُضمّن بخطوط base64؛ والبقية مع حشو
    #    url() الأصول بـ data URIs (استقلالية الملف الواحد)
    def css_repl(m: re.Match) -> str:
        href = m.group(1)
        if href == "data:,":
            return m.group(0)
        src = (SAMPLE / href).resolve()
        rel = repo_rel(src)
        if rel == "assets/fonts/fonts.css":
            return style_block(rel, inline_fonts_css())
        return style_block(rel, inline_css_urls(read(src), src.parent))

    html, n_css = re.subn(
        r'<link rel="stylesheet" href="([^"]+)">',
        css_repl, html)
    if n_css != len(EXPECTED_CSS):
        raise SystemExit(f"BUILD ERROR: عدد أوراق الأنماط {n_css} ≠ المتوقع {len(EXPECTED_CSS)}")
    # 1b) url() داخل السمات السطرية في HTML (أسهم شريط المعلومات) → data URIs
    html = inline_css_urls(html, SAMPLE)

    # 2) السكربتات
    def js_repl(m: re.Match) -> str:
        src = (SAMPLE / m.group(1)).resolve()
        return script_block(repo_rel(src), read(src))

    html, n_js = re.subn(r'<script src="([^"]+)"></script>', js_repl, html)
    if n_js != len(EXPECTED_JS):
        raise SystemExit(f"BUILD ERROR: عدد السكربتات {n_js} ≠ المتوقع {len(EXPECTED_JS)}")

    # 3) حماية أصول الأيقونات قبل التغليف (R1-02)
    verify_icons(html)

    # 4) ترويسة التوليد (حتمية بلا أختام زمن) + ترخيص الأيقونات المضمّنة
    icons_lic = ICONS_LICENSE.read_text(encoding="utf-8").strip()
    banner = (
        "<!-- =========================================================\n"
        "  Micro UI — معرض نظام الواجهة: النسخة المكتفية ذاتيًا (ملف واحد)\n"
        "  ملف مولّد آليًا بواسطة tools/build-ui-system-showcase-standalone.py من المصادر القابلة للتحرير:\n"
        "  previews/ui-system-showcase/{index.html, showcase.css, showcase.js}\n"
        "  والأصول المعتمدة (shared/tokens.css، components/*، assets/fonts، assets/icons). لا تُعدَّل هذه النسخة يدويًا؛\n"
        "  عدّل المصادر ثم أعد البناء. يعمل محليًا بلا إنترنت أو خادم أو CDN أو ملفات جانبية\n"
        "  (بلا fetch/import ولا modules). الحالة: PROTOTYPE — عرض مكوّنات تفاعلي، ليس تطبيقًا إنتاجيًا؛\n"
        "  البيانات fixtures محلية حتمية ولا شبكة ولا مصادقة ولا حفظ.\n"
        "\n"
        "  تراخيص الأصول المضمّنة:\n"
        "  - الخطوط: SIL Open Font License 1.1 (IBM Plex) — النص الكامل مضمّن مع قواعد @font-face أدناه.\n"
        "  - الأيقونات: HugeIcons Stroke Rounded — النص الكامل أدناه.\n"
        "\n"
        f"{icons_lic}\n"
        "========================================================= -->\n"
    )
    html = html.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + banner, 1)
    return html


def main() -> int:
    ap = argparse.ArgumentParser(description="توليد standalone.html لمعرض نظام الواجهة")
    ap.add_argument("--check", action="store_true",
                    help="تحقق فقط: قارن إعادة التوليد بالملف القائم بلا كتابة")
    args = ap.parse_args()

    html = build_html()
    if args.check:
        if not OUT.is_file():
            print(f"CHECK FAIL: {repo_rel(OUT)} غير موجود")
            return 1
        existing = OUT.read_text(encoding="utf-8")
        if existing == html:
            print("CHECK OK: standalone.html مطابق لإعادة التوليد بايت-ببايت")
            return 0
        print("CHECK FAIL: standalone.html يختلف عن إعادة التوليد — أعد البناء من المصادر")
        return 1

    OUT.write_text(html, encoding="utf-8", newline="\n")
    size_kb = OUT.stat().st_size / 1024
    print(f"BUILD OK: {repo_rel(OUT)} ({size_kb:.0f} KB)")
    # تحقق ذاتي: إعادة التوليد من نفس المدخلات تطابق المكتوب
    if build_html() != html:
        print("SELF-CHECK FAIL: التوليد غير حتمي")
        return 1
    print("SELF-CHECK OK: إعادة التوليد مطابقة بايت-ببايت")
    return 0


if __name__ == "__main__":
    sys.exit(main())
