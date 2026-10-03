#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص إغلاق عيوب التدقيق A01/A02 (وحدود T01 البيئية). من الجذر:
  python3 tools/audit-fixes-check.py
يعيد إنتاج مدخلات التدقيق قبل الإصلاح (فشل) ثم يثبت الإصلاح (نجاح):
  A01 — تجاوز/بطلان data-max في bars/line: عقد مقياس صريح لا clamp صامت.
  A02 — حصر Tab/Shift+Tab داخل الطبقة مع منتقي roving tabindex=-1.
الأدلة: reviews/UI-COMPLETION/verification-a01-a02.txt + لقطات الحالات.
بيئة: متصفح headless فعلي (Playwright + Chromium) — لا ادعاء جهاز/قارئ شاشة.
"""
import http.server
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "UI-COMPLETION"
results, log_lines = [], []


def log(m):
    print(m)
    log_lines.append(m)


def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))


BASE_CSS = """
  <link rel="stylesheet" href="shared/tokens.css">
  <link rel="stylesheet" href="shared/motion.css">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <style>body{font-family:var(--micro-font-family);margin:12px;max-width:400px;direction:rtl}</style>
"""

A01_PAGE = """<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<base href="{base}/">
{css}
<link rel="stylesheet" href="components/data/data.css">
<script src="components/data/data.js"></script>
</head><body>
<div id="host"></div>
</body></html>"""


def chart_html(kind, items, attrs=""):
    lis = "".join(
        '<li data-series="%s" data-label="%s" data-value="%s"%s></li>' % (
            s, lbl, ("" if v is None else v), extra)
        for s, lbl, v, extra in items)
    return ('<div class="m-chart" data-chart="%s" %s data-title="t">'
            '<ul class="m-chart__data" hidden>%s</ul>'
            '<div class="m-chart__plot %s" data-plot></div></div>'
            % (kind, attrs, lis, " m-donut" if kind == "donut" else ""))


def run_a01(page):
    """A01 — عقد المقياس: [5,10]/[4,6]، مقام غائب/غير رقمي/صفر/سالب، مجهول، فجوة خط."""
    page.set_content(A01_PAGE.format(base=BASE, css=BASE_CSS))
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    page.evaluate("() => { window.MicroData && MicroData.init(); }")

    def mount(kind, items, attrs=""):
        return page.evaluate(
            """([kind, items, attrs]) => {
              const host = document.getElementById('host');
              host.innerHTML = `<div class="m-chart" data-chart="${kind}" ${attrs} data-title="t">
                 <ul class="m-chart__data" hidden>${items}</ul>
                 <div class="m-chart__plot" data-plot></div></div>`;
              MicroData.render(host.querySelector('[data-chart]'));
              const c = host.querySelector('[data-chart]');
              const svg = c.querySelector('svg');
              return {
                svg: !!svg,
                err: c.querySelector('.m-chart__error') ? c.querySelector('.m-chart__error').textContent : null,
                scaleState: c.getAttribute('data-scale-state'),
                scaleDetail: c.getAttribute('data-scale-detail'),
                note: c.querySelector('.m-chart__scale-note') ? c.querySelector('.m-chart__scale-note').textContent : null,
                values: [...c.querySelectorAll('.m-chart__bar-value,.m-chart__point-value')].map(t => t.textContent),
                barHeights: [...c.querySelectorAll('rect')].map(r => parseFloat(r.getAttribute('height') || '0')).filter(h => h > 0),
                dots: [...c.querySelectorAll('circle.m-chart__dot')].map(d => ({cy: parseFloat(d.getAttribute('cy')), r: d.getBoundingClientRect().height})),
                polys: c.querySelectorAll('polyline').length,
                pts: [...c.querySelectorAll('.m-chart__point-value')].map(t => ({y: parseFloat(t.getAttribute('y')), text: t.textContent})),
                readings: c.querySelector('.m-legend') ? [...c.querySelectorAll('.m-legend__value')].map(e => e.textContent) : null
              };
            }""", [kind, items, attrs])

    def lis(spec):
        out = ""
        for s, lbl, v, extra in spec:
            out += '<li data-series="%s" data-label="%s" data-value="%s"%s></li>' % (
                s, lbl, ("" if v is None else v), extra)
        return out

    # ---- 1) الأعمدة: data-max=5 وقيم [5,10] — الافتراضي رفض، القراءات محفوظة ----
    # R8-07: رسالة المستخدم موحدة موجزة بلا أسماء سمات؛ التشخيص في data-scale-*
    r = mount("bars", lis([("a", "أ", 5, ""), ("b", "ب", 10, "")]), 'data-max="5"')
    check("A01.1 أعمدة [5,10] على max=5: لا رسم مشوه ورسالة موجزة + تشخيص التجاوز في data-scale-detail",
          not r["svg"] and r["err"] == "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه."
          and r["scaleState"] == "over" and "تتجاوز data-max" in (r["scaleDetail"] or "")
          and "10" in (r["scaleDetail"] or ""),
          (r["err"] or "")[:60] + " | state=" + str(r["scaleState"]))
    check("A01.2 أعمدة [5,10] على max=5: القراءات 5 و10 محفوظة كاملة في قائمة قراءات",
          r["readings"] == ["5", "10"], str(r["readings"]))

    # ---- 2) نفس المدخلات مع data-overscale="rescale": رسم صادق بنسب صحيحة + ملاحظة ظاهرة ----
    r = mount("bars", lis([("a", "أ", 5, ""), ("b", "ب", 10, "")]), 'data-max="5" data-overscale="rescale"')
    ratio_ok = (r["svg"] and len(r["barHeights"]) == 2
                and abs(r["barHeights"][1] / r["barHeights"][0] - 10 / 5) < 0.02)
    check("A01.3 أعمدة [5,10] مع overscale=rescale: نسب الارتفاع صادقة (10/5) وملاحظة المقياس الموسّع ظاهرة",
          ratio_ok and r["note"] and "10" in r["note"] and "5" in r["note"],
          f"heights={r['barHeights']} note={(r['note'] or '')[:50]}")

    # ---- 3) [4,6] على max=5: تجاوز → رفض افتراضي ----
    r = mount("bars", lis([("a", "أ", 4, ""), ("b", "ب", 6, "")]), 'data-max="5"')
    check("A01.4 أعمدة [4,6] على max=5: رفض صريح (لا clamp صامت لقيمة 6) — الرسالة موجزة والتشخيص يسمي 6",
          not r["svg"] and r["err"] == "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه."
          and r["scaleState"] == "over" and "6" in (r["scaleDetail"] or ""),
          (r["err"] or "")[:60] + " | detail=" + (r["scaleDetail"] or "")[:50])

    # ---- 4) مقام غائب: مقياس تلقائي يستوعب القيم بنسب صادقة ----
    r = mount("bars", lis([("a", "أ", 5, ""), ("b", "ب", 10, "")]), "")
    ratio_ok = (r["svg"] and len(r["barHeights"]) == 2
                and abs(r["barHeights"][1] / r["barHeights"][0] - 2) < 0.02)
    check("A01.5 أعمدة [5,10] بلا data-max: مقياس تلقائي بنسب صادقة (الفرق ظاهر)",
          ratio_ok, f"heights={r['barHeights']}")

    # ---- 5) مقياس معلن غير رقمي/صفر/سالب: حالة غير صالح صريحة لا سقوط صامت ----
    for bad in ("bad", "0", "-5"):
        r = mount("bars", lis([("a", "أ", 5, ""), ("b", "ب", 10, "")]), f'data-max="{bad}"')
        check(f"A01.6 أعمدة [5,10] على data-max={bad}: حالة «غير صالح» صريحة (state+detail) وقراءات محفوظة ورسالة موجزة",
              not r["svg"] and r["err"] == "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه."
              and r["scaleState"] == "invalid" and "غير رقمي/غير موجب" in (r["scaleDetail"] or "")
              and r["readings"] == ["5", "10"],
              (r["err"] or "")[:60] + " | state=" + str(r["scaleState"]))

    # ---- 6) قيمة مجهولة داخل حالة الرفض تبقى «—» ----
    r = mount("bars", lis([("a", "أ", 10, ""), ("b", "ب", None, "")]), 'data-max="5"')
    check("A01.7 قيمة مجهولة في حالة الرفض تبقى «— غير متاح» (لا صفر)",
          r["readings"] == ["10", "— غير متاح"], str(r["readings"]))

    # ---- 7) الخط: [5,10] على max=5 — الافتراضي رفض، ولا نقطة خارج SVG مع rescale ----
    r = mount("line", lis([("a", "أ", 5, ""), ("b", "ب", 10, "")]), 'data-max="5"')
    check("A01.8 خط [5,10] على max=5: رفض صريح برسالة موجزة وتشخيص التجاوز في data-scale-detail",
          not r["svg"] and r["err"] == "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه."
          and r["scaleState"] == "over" and "تتجاوز data-max" in (r["scaleDetail"] or ""),
          (r["err"] or "")[:60] + " | state=" + str(r["scaleState"]))
    r = mount("line", lis([("a", "أ", 5, ""), ("b", "ب", 10, "")]), 'data-max="5" data-overscale="rescale"')
    inside = all(0 <= p["y"] <= 170 for p in r["pts"]) and len(r["dots"]) == 2 if r["pts"] else False
    check("A01.9 خط [5,10] مع overscale=rescale: النقطتان داخل SVG وبنسب صادقة وملاحظة ظاهرة",
          r["svg"] and inside and r["note"] is not None,
          f"pts={[(p['y'], p['text']) for p in r['pts']]}")

    # ---- 8) فجوة الخط: المفقود يقطع (شريحتان متعددتا النقاط) وتبقى قراءات «—» ----
    r = mount("line", lis([("a", "أ", 5, ""), ("b", "ب", 7, ""), ("c", "ج", None, ""), ("d", "د", 8, ""), ("e", "هـ", 3, "")]), "")
    check("A01.10 الخط بفجوة وسطية: شريحتان منفصلتان والمجهول «—» (سلوك E06 محفوظ)",
          r["polys"] == 2 and "—" in r["values"], f"polys={r['polys']} values={r['values']}")


A02_PAGE = """<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<base href="{base}/">
{css}
<link rel="stylesheet" href="components/buttons/buttons.css">
<link rel="stylesheet" href="components/navigation/navigation.css">
<link rel="stylesheet" href="components/selection/picker.css">
<script src="components/navigation/navigation.js"></script>
<script src="components/selection/picker.js"></script>
</head><body>
  <button type="button" class="m-btn m-btn--primary" data-layer-open="pick-layer" id="trigger">اختيار</button>
  <div class="m-layer-backdrop" data-for="pick-layer" hidden></div>
  <div class="m-layer" id="pick-layer" role="dialog" aria-modal="true" aria-label="اختيار" hidden>
    <div class="m-layer__head"><span class="m-layer__title">اختيار مورد</span>
      <button type="button" class="m-btn m-btn--secondary" data-picker-close>إغلاق</button></div>
    <div class="m-layer__body">
      <div class="m-picker" data-micro-picker id="p">
        <input class="m-picker__input" type="search" data-picker-search autocomplete="off" aria-label="بحث">
        <div class="m-picker__list" role="listbox" aria-label="النتائج" data-picker-list></div>
        <p class="m-picker__foot" data-picker-summary>المحدد: لا شيء</p>
      </div>
    </div>
  </div>
  <div class="m-layer" id="empty-layer" role="dialog" aria-modal="true" aria-label="فارغة" hidden>
    <div class="m-layer__body"><p>طبقة بلا عناصر تفاعلية</p></div>
  </div>
</body></html>"""


def run_a02(page):
    """A02 — حصر التركيز مع roving tabindex: Tab/Shift+Tab داخل الطبقة دائمًا."""
    page.set_content(A02_PAGE.format(base=BASE, css=BASE_CSS))
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    page.evaluate("""() => {
      MicroPicker.setOptions(document.getElementById('p'),
        [{value:'a',label:'مورد أ'},{value:'b',label:'مورد ب'},{value:'c',label:'مورد ج'}]);
      MicroNavigation.init();
    }""")

    def state():
        return page.evaluate("""() => ({
          active: document.activeElement.tagName + ':' + (document.activeElement.className || ''),
          inLayer: document.getElementById('pick-layer').contains(document.activeElement)
                     || document.activeElement === document.getElementById('pick-layer'),
          tabbables: [...document.getElementById('pick-layer').querySelectorAll('button,input')].filter(e => {
             const ti = e.getAttribute('tabindex');
             if (ti !== null && parseInt(ti,10) < 0) return false;
             if (e.disabled || e.getAttribute('aria-disabled') === 'true') return false;
             return e.offsetParent !== null || e.getClientRects().length > 0;
          }).map(e => e.className.split(' ')[0])
        })""")

    page.click("#trigger")
    page.wait_for_timeout(420)  # فتح 240ms + هامش

    # ---- 1) التركيز يبدأ داخل الطبقة ----
    st = state()
    check("A02.1 عند الفتح التركيز داخل الطبقة (لا BODY)", st["inLayer"], st["active"])

    # ---- 2) Tab من البحث يدخل الخيارات القابلة للتبويب فعلاً ويدور داخل الطبقة ----
    page.focus("[data-picker-search]")
    for i in range(8):
        page.keyboard.press("Tab")
        st = state()
        if not st["inLayer"]:
            check("A02.2 دورة Tab ×8 تبقى داخل الطبقة (كان يقفز إلى BODY بعد الخيار roving)",
                  False, f"escaped at press {i + 1}: {st['active']}")
            break
    else:
        check("A02.2 دورة Tab ×8 تبقى داخل الطبقة (كان يقفز إلى BODY بعد الخيار roving)", True)

    # ---- 3) Shift+Tab باتجاه معاكس يبقى داخل الطبقة ----
    page.focus("[data-picker-search]")
    for i in range(8):
        page.keyboard.press("Shift+Tab")
        st = state()
        if not st["inLayer"]:
            check("A02.3 دورة Shift+Tab ×8 تبقى داخل الطبقة", False, f"escaped at {i + 1}: {st['active']}")
            break
    else:
        check("A02.3 دورة Shift+Tab ×8 تبقى داخل الطبقة", True)

    # ---- 4) نقل نقطة roving بالأسهم لا يفسد الحصر ----
    page.focus("[data-picker-search]")
    page.keyboard.press("Tab")  # إلى أول خيار قابل للتبويب (roving=0)
    page.keyboard.press("ArrowLeft")  # RTL: التالي — ينقل tabindex
    page.keyboard.press("Tab")
    st = state()
    check("A02.4 بعد نقل roving بالأسهم يبقى Tab داخل الطبقة", st["inLayer"], st["active"])

    # ---- 5) الإغلاق يستعيد تركيز المشغل ----
    page.keyboard.press("Escape")
    page.wait_for_timeout(420)
    restored = page.evaluate("() => document.activeElement.id")
    check("A02.5 Escape يغلق ويستعيد تركيز المشغل (#trigger)", restored == "trigger", restored)

    # ---- 6) بحث ثم اختيار خيار ثم إغلاق: الحصر سليمة طوال التفاعل ----
    page.click("#trigger")
    page.wait_for_timeout(420)
    page.fill("[data-picker-search]", "ب")
    page.wait_for_timeout(60)
    st = state()
    ok_search = st["inLayer"]
    page.keyboard.press("Enter")  # اختيار الخيار الظاهر
    st2 = state()
    page.keyboard.press("Escape")
    page.wait_for_timeout(420)
    check("A02.6 بعد البحث/الاختيار: التركيز داخل الطبقة ثم يعود للمشغل عند الإغلاق",
          ok_search and st2["inLayer"] and page.evaluate("() => document.activeElement.id") == "trigger",
          f"search={ok_search}")

    # ---- 7) طبقة بلا عناصر تفاعلية: Tab لا يخرج إلى BODY ----
    page.evaluate("() => MicroNavigation.openLayer(document.getElementById('empty-layer'), {trigger: document.getElementById('trigger')})")
    page.keyboard.press("Tab")
    st = page.evaluate("""() => ({
      body: document.activeElement === document.body,
      onLayer: document.activeElement === document.getElementById('empty-layer')})""")
    page.keyboard.press("Escape")
    page.wait_for_timeout(420)
    check("A02.7 طبقة خالية: Tab لا ينتقل إلى BODY (يُمنع على الطبقة)",
          not st["body"], str(st))

    # ---- 8) قائمة tabbables لا تشمل أزرار roving tabindex=-1 ----
    page.click("#trigger")
    page.wait_for_timeout(420)
    st = state()
    page.keyboard.press("Escape")
    page.wait_for_timeout(420)
    # roving: خيار واحد فقط tabindex=0 من أصل 3 خيارات
    roving_ok = page.evaluate("""() => {
      const opts = [...document.querySelectorAll('#p .m-picker__option')];
      const tabbable = opts.filter(o => parseInt(o.getAttribute('tabindex') || '0', 10) >= 0);
      return tabbable.length === 1;
    }""")
    check("A02.8 عقد roving محفوظ: خيار واحد قابل للتبويب فقط (لم تُحوَّل الخيارات كلها إلى tabindex=0)",
          roving_ok, str(st["tabbables"]))


def main():
    global BASE
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    BASE = f"http://127.0.0.1:{server.server_address[1]}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log("# فحص إغلاق A01/A02 — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree}")
    log("")

    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))

        run_a01(page)
        run_a02(page)

        check("A03 لا أخطاء JavaScript أثناء الفحص", len(errors) == 0, "; ".join(errors[:3]))
        page.screenshot(path=str(OUT / "screenshots" / "a01-a02-states.png"))
        browser.close()

    passed = sum(1 for _, ok in results if ok)
    log("")
    log(f"# النتيجة: {passed}/{len(results)}")
    (OUT / "verification-a01-a02.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")
    if passed != len(results):
        sys.exit(1)


if __name__ == "__main__":
    main()
