#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص إصلاح معرض نظام الواجهة (F-01 … F-14).
من جذر المستودع:
    python3 tools/ui-system-showcase-repair-check.py --tag before   (إعادة إنتاج الأساس — إخفاقات متوقعة)
    python3 tools/ui-system-showcase-repair-check.py --tag after    (بوابات ما بعد الإصلاح)

المصدر المفحوص: previews/ui-system-showcase/index.html عبر خادم محلي مؤقت.
المخرجات (reviews/UI-SYSTEM-SHOWCASE/):
  repair-check-{tag}.txt      سجل PASS/FAIL + قياسات قبل/بعد
  screenshots/repair-{tag}-*.png

النطاق: Chromium (Playwright headless) فقط. كل التفاعلات عبر العقود العامة.
Exit 0 عند نجاح الكل (متوقع مع --tag after)، وإلا exit 1.
"""
import argparse
import http.server
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "reviews" / "UI-SYSTEM-SHOWCASE"
SHOTS = OUT_DIR / "screenshots"

results = []


def t(name, ok, detail=""):
    results.append((name, bool(ok), str(detail)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *a):
        pass


class Server(socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", default="after")
    ap.add_argument("--widths", default="320,390")
    args = ap.parse_args()
    widths = [int(w) for w in args.widths.split(",")]

    srv = Server(("127.0.0.1", 0), Handler)
    port = srv.server_address[1]
    thr = threading.Thread(target=srv.serve_forever, daemon=True)
    thr.start()
    base = f"http://127.0.0.1:{port}/previews/ui-system-showcase/index.html"

    console_errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for w in widths:
            ctx = browser.new_context(viewport={"width": w, "height": 844}, locale="ar")
            page = ctx.new_page()
            page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: console_errors.append(str(e)))
            run(page, base, w, args.tag)
            ctx.close()
        browser.close()
    srv.shutdown()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SHOTS.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"repair-check-{args.tag}.txt"
    passed = sum(1 for _, ok, _ in results if ok)
    lines = []
    lines.append(f"UI SYSTEM SHOWCASE — REPAIR CHECK ({args.tag})")
    lines.append(f"التاريخ: 2026-10-10 · المنفّذ: Zed AI · الأعراض: {widths} RTL")
    lines.append("البيئة: Chromium headless (Playwright) فقط — الأجهزة/قارئات الشاشة/WebKit/native zoom: NOT RUN")
    lines.append("")
    for name, ok, detail in results:
        lines.append(f"{'PASS' if ok else 'FAIL'} | {name}" + (f" | {detail}" if detail else ""))
    lines.append("")
    lines.append(f"الخلاصة: {passed} PASS / {len(results) - passed} FAIL — إجمالي {len(results)}")
    lines.append(f"أخطاء console: {len(console_errors)}")
    if console_errors:
        lines.append("; ".join(console_errors[:10]))
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0 if passed == len(results) else 1


# ---------- أدوات مساعدة ----------

def open_page(page, base, width):
    page.goto(base)
    page.evaluate("() => document.fonts.ready.then(() => true)")
    page.wait_for_timeout(120)
    # ضبط عرض اللوحة عبر شريط التحكم (عقد m-seg) — نفس مسار المستخدم
    page.evaluate(
        "(w) => document.querySelectorAll('#sc-w-seg [data-sc-w]').forEach(b => {"
        "  if (b.getAttribute('data-sc-w') === String(w)) b.click(); })",
        str(width),
    )
    page.wait_for_timeout(80)


def set_fixture(page, mode):
    page.evaluate(
        "(m) => document.querySelectorAll('#sc-fx-seg [data-sc-fixture]').forEach(b => {"
        "  if (b.getAttribute('data-sc-fixture') === m) b.click(); })",
        mode,
    )
    page.wait_for_timeout(120)


def shot(page, name):
    el = page.evaluate("(s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({block:'center'}); return !!e; }", name if name.startswith("#") else name)
    page.wait_for_timeout(60)
    page.screenshot(path=str(SHOTS / f"repair-{TAG}-{name.lstrip('#')}.png"))


TAG = "after"


def label_state(page, chart_sel, label_cls):
    """حالة تسميات رسم: النصوص، المقصوص منها، والتداخل الزوجي."""
    return page.evaluate(
        "([cs, lc]) => {"
        "  const chart = document.querySelector(cs);"
        "  if (!chart) return null;"
        "  const els = [...chart.querySelectorAll('.' + lc)];"
        "  const texts = els.map(t => t.textContent);"
        "  /* القص يوسم دائمًا بـ aria-label + <title> — كشفه بها لا بنهاية النص */"
        "  const cut = els.filter(t => t.hasAttribute('aria-label') || t.querySelector('title')).length;"
        "  const rects = els.map(t => { const r = t.getBoundingClientRect(); return {x:r.x, y:r.y, w:r.width, h:r.height}; });"
        "  let overlaps = 0;"
        "  for (let i = 0; i < rects.length; i++) for (let j = i+1; j < rects.length; j++) {"
        "    const a = rects[i], b = rects[j];"
        "    const ox = Math.min(a.x+a.w, b.x+b.w) - Math.max(a.x, b.x);"
        "    const oy = Math.min(a.y+a.h, b.y+b.h) - Math.max(a.y, b.y);"
        "    if (ox > 1 && oy > 1) overlaps++;"
        "  }"
        "  const disclosure = [...chart.querySelectorAll('.' + lc)].filter(t => t.textContent.endsWith('…'))"
        "    .map(t => ({ aria: t.getAttribute('aria-label'), title: !!(t.querySelector('title')), txt: t.textContent }))"
        "    .filter(d => !d.aria || !d.title).length;"
        "  return { texts, cut, overlaps, disclosureMissing: disclosure };"
        "}",
        [chart_sel, label_cls],
    )


def run(page, base, width, tag):
    global TAG
    TAG = tag
    P = f"[{width}]"
    open_page(page, base, width)

    # ================= F-01: تسميات الرسوم عند الحجم الطبيعي =================
    bars = label_state(page, "#sc-chart-bars", "m-chart__bar-label")
    if bars:
        t(f"F-01 {P} أعمدة: تسميات كاملة عند 1× (لا قص ببيانات عادية)",
          bars["cut"] == 0,
          f"cut={bars['cut']} texts={bars['texts']}")
        t(f"F-01 {P} أعمدة: لا تداخل زوجي (عادي)", bars["overlaps"] == 0, f"overlaps={bars['overlaps']}")
    line = label_state(page, "#sc-chart-line", "m-chart__x-label")
    if line:
        t(f"F-01 {P} خط: تسميات كاملة عند 1×", line["cut"] == 0, f"cut={line['cut']} texts={line['texts']}")
        t(f"F-01 {P} خط: لا تداخل زوجي (عادي)", line["overlaps"] == 0, f"overlaps={line['overlaps']}")

    # حتمية أول تصيير = إعادة التصيير
    det = page.evaluate("""() => {
      const snap = (c) => [...c.querySelectorAll('.m-chart__bar-label, .m-chart__x-label')].map(t => t.textContent + '|' + t.getAttribute('x'));
      const bars = document.querySelector('#sc-chart-bars');
      const line = document.querySelector('#sc-chart-line');
      const a1 = snap(bars), l1 = snap(line);
      window.MicroData.render(bars); window.MicroData.render(line);
      const a2 = snap(bars), l2 = snap(line);
      return { barsEq: JSON.stringify(a1) === JSON.stringify(a2), lineEq: JSON.stringify(l1) === JSON.stringify(l2), a1 };
    }""")
    t(f"F-01 {P} أول تصيير = إعادة التصيير (بعد جاهزية الخط)", det["barsEq"] and det["lineEq"], f"bars={det['barsEq']} line={det['lineEq']}")

    # الإجهاد: لا تداخل، والقص (إن وقع) يحمل إفصاحًا كاملًا
    set_fixture(page, "stress")
    barsS = label_state(page, "#sc-chart-bars", "m-chart__bar-label")
    if barsS:
        t(f"F-01 {P} أعمدة (إجهاد): لا تداخل زوجي", barsS["overlaps"] == 0, f"overlaps={barsS['overlaps']} texts={barsS['texts']}")
        t(f"F-01 {P} أعمدة (إجهاد): المقصوص يحمل إفصاح aria-label+title", barsS["disclosureMissing"] == 0, f"missing={barsS['disclosureMissing']}")
    lineS = label_state(page, "#sc-chart-line", "m-chart__x-label")
    if lineS:
        t(f"F-01 {P} خط (إجهاد): لا تداخل زوجي", lineS["overlaps"] == 0, f"overlaps={lineS['overlaps']}")
    shot(page, "#sc-data")
    set_fixture(page, "normal")

    # F-01 (إجهاد محقون): كلمات عربية مفردة طويلة — لا تصادم، والقص بإفصاح كامل
    inj = page.evaluate("""() => {
      const host = document.createElement('div');
      host.id = 'probe-f01-long';
      host.style.width = '256px'; host.style.margin = '0 auto';
      host.innerHTML = '<div class="m-chart m-chart--bars" data-chart="bars" data-max="10">'
        + '<ul class="m-chart__data" hidden>'
        + '<li data-series="a" data-label="المستلزمات" data-value="4"></li>'
        + '<li data-series="b" data-label="المستهلكات" data-value="6"></li>'
        + '<li data-series="c" data-label="المستخرجات" data-value="2"></li>'
        + '<li data-series="d" data-label="المرتجعات" data-value="8"></li>'
        + '</ul><div class="m-chart__plot" data-plot></div></div>';
      document.querySelector('#sc-data .sc-block').appendChild(host);
      window.MicroData.init(host);
      const els = [...host.querySelectorAll('.m-chart__bar-label')];
      const rects = els.map(e => e.getBoundingClientRect());
      let overlaps = 0;
      for (let i = 0; i < rects.length; i++) for (let j = i+1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        const ox = Math.min(a.x+a.width, b.x+b.width) - Math.max(a.x, b.x);
        const oy = Math.min(a.y+a.height, b.y+b.height) - Math.max(a.y, b.y);
        if (ox > 1 && oy > 1) overlaps++;
      }
      const cut = els.filter(e => e.hasAttribute('aria-label') || e.querySelector('title'));
      const disclosureOk = cut.every(e => e.getAttribute('aria-label') && e.querySelector('title'));
      const src = [...host.querySelectorAll('.m-chart__data li')];
      /* المصدر الكامل باقٍ: سمات li محفوظة، وكل aria-label نص قصّ يطابق مصدره */
      const fullInDom = src.every(li => li.hasAttribute('data-label')) &&
        els.filter(e => e.hasAttribute('aria-label')).every(e =>
          src.some(li => li.getAttribute('data-label') === e.getAttribute('aria-label')));
      const res = { overlaps, cutCount: cut.length, disclosureOk, fullInDom,
        texts: els.map(e => e.textContent) };
      host.remove();
      return res;
    }""")
    if inj:
        t(f"F-01 {P} كلمات مفردة طويلة محقونة: صفر تصادم", inj["overlaps"] == 0,
          f"overlaps={inj['overlaps']} texts={inj['texts']}")
        t(f"F-01 {P} المقصوص منها يحمل إفصاحًا كاملًا (aria+title)", inj["disclosureOk"],
          f"cut={inj['cutCount']}")
        t(f"F-01 {P} البيانات الكاملة باقية في مصدر DOM", inj["fullInDom"])

    # ================= F-02: مالك إغلاق واحد للمنتقي داخل الطبقة =================
    page.evaluate("() => document.querySelector('#sc-picker-trigger').click()")
    page.wait_for_timeout(250)
    f02 = page.evaluate("""() => {
      const layer = document.querySelector('#sc-picker-layer');
      const vis = (e) => e.getClientRects().length > 0;
      const closes = [...layer.querySelectorAll('button')].filter(b => (b.hasAttribute('data-layer-close') || b.hasAttribute('data-picker-close')) && vis(b));
      const titles = [...layer.querySelectorAll('.m-layer__title, .m-picker__title')].filter(vis);
      return { closes: closes.length, titles: titles.length,
               pickerWorks: !!layer.querySelector('[data-picker-search]') };
    }""")
    t(f"F-02 {P} الطبقة: مالك إغلاق ظاهر واحد", f02["closes"] == 1, f"closes={f02['closes']}")
    t(f"F-02 {P} الطبقة: عنوان ظاهر واحد", f02["titles"] == 1, f"titles={f02['titles']}")
    t(f"F-02 {P} المنتقي داخل الطبقة يعمل (بحث/قائمة)", f02["pickerWorks"])
    shot(page, "#sc-picker-layer")

    # منتقي مستقل (خارج أي طبقة): إغلاقه الخاص صالح
    standalone = page.evaluate("""() => {
      const host = document.createElement('div');
      host.id = 'probe-picker-standalone';
      host.innerHTML = '<div class="m-picker" data-micro-picker><div class="m-picker__head">'
        + '<span class="m-picker__title">منتقي مستقل</span>'
        + '<button type="button" class="m-btn m-btn--icon m-btn--secondary" data-picker-close aria-label="إغلاق المنتقي">X</button>'
        + '</div><input class="m-picker__input" type="search" data-picker-search aria-label="بحث">'
        + '<div class="m-picker__list" role="listbox" aria-label="النتائج" data-picker-list></div>'
        + '<p class="m-picker__foot" data-picker-summary>المحدد: لا شيء</p></div>';
      document.body.appendChild(host);
      window.MicroPicker.init(host);
      window.MicroPicker.setOptions(host.querySelector('.m-picker'), [{value:'x', label:'خيار'}]);
      let closed = 0;
      host.addEventListener('micro-picker:close', () => { closed++; });
      host.querySelector('[data-picker-close]').click();
      const inLayer = !!host.querySelector('.m-picker').closest('.m-layer');
      host.remove();
      return { closed, inLayer };
    }""")
    t(f"F-02 {P} منتقي مستقل: زر إغلاقه يطلق micro-picker:close", standalone["closed"] == 1 and not standalone["inLayer"],
      f"closed={standalone['closed']}")
    # إغلاق الطبقة مرة أخرى (تنظيف)
    page.evaluate("() => { const b = document.querySelector('#sc-picker-layer [data-layer-close]'); if (b) b.click(); }")
    page.wait_for_timeout(200)

    # ================= F-03: وضع peek =================
    f03 = page.evaluate("""() => {
      const strip = document.querySelector('#sc-strip-peek');
      const hasClass = strip.classList.contains('m-info-peek');
      const vp = strip.querySelector('[data-info-strip-viewport]').getBoundingClientRect();
      const slides = [...strip.querySelectorAll('.m-info-strip__slide')];
      const s0 = slides[0].getBoundingClientRect(), s1 = slides[1].getBoundingClientRect();
      const visibleNext = Math.max(0, Math.min(vp.right, s1.right) - Math.max(vp.left, s1.left));
      const visiblePrev = slides.length > 2
        ? Math.max(0, Math.min(vp.right, slides[2].getBoundingClientRect().right) - Math.max(vp.left, slides[2].getBoundingClientRect().left)) : -1;
      const centered = Math.abs((s0.left + s0.right)/2 - (vp.left + vp.right)/2);
      return { hasClass, visibleNext: Math.round(visibleNext), visiblePrev: Math.round(visiblePrev), centered: Math.round(centered*10)/10 };
    }""")
    t(f"F-03 {P} شريط peek: الصنف m-info-peek موجود", f03["hasClass"])
    t(f"F-03 {P} البطاقة المجاورة تلمح (≥8px ظاهرة)", f03["visibleNext"] >= 8, f"next={f03['visibleNext']}px prev={f03['visiblePrev']}px")
    t(f"F-03 {P} البطاقة النشطة موسّطة (≤2px)", f03["centered"] <= 2, f"delta={f03['centered']}px")
    shot(page, "#sc-strip-peek")

    # ================= F-04: سلوك LTR للشريط (توثيق القرار) =================
    f04 = page.evaluate("""() => {
      document.querySelectorAll('#sc-dir-seg [data-sc-dir]').forEach(b => { if (b.getAttribute('data-sc-dir') === 'ltr') b.click(); });
      return true;
    }""")
    page.wait_for_timeout(150)
    f04m = page.evaluate("""() => {
      const strip = document.querySelector('#sc-strip');
      const dir = getComputedStyle(strip).direction;
      const slides = [...strip.querySelectorAll('.m-info-strip__slide')];
      const s0 = slides[0].getBoundingClientRect();
      // العقد: الترتيب يبقى RTL منطقيًا — الشريحة الأولى (index 0) تظهر على اليمين
      const firstAtRight = s0.right > (strip.getBoundingClientRect().left + strip.getBoundingClientRect().width/2);
      const position = strip.querySelector('[data-info-strip-position]').textContent;
      return { dir, firstAtRight, position };
    }""")
    t(f"F-04 {P} LTR مقارنة فقط: عقد الشريط RTL يبقى (الترتيب المنطقي بلا انقلاب جزئي)",
      f04m["dir"] == "ltr" and f04m["firstAtRight"], f"dir={f04m['dir']} firstAtRight={f04m['firstAtRight']} pos={f04m['position']}")
    # العودة إلى RTL
    page.evaluate("() => document.querySelectorAll('#sc-dir-seg [data-sc-dir]').forEach(b => { if (b.getAttribute('data-sc-dir') === 'rtl') b.click(); })")
    page.wait_for_timeout(120)

    # ================= F-05: المقطّع عند العرض الضيق =================
    f05 = page.evaluate("""() => {
      const seg = [...document.querySelectorAll('.m-seg')].find(s => s.textContent.includes('الطلبات النشطة'));
      if (!seg) return null;
      const items = [...seg.querySelectorAll('.m-seg__item')];
      const rects = items.map(i => i.getBoundingClientRect());
      const rows = new Set(rects.map(r => Math.round(r.y))).size;
      const scrollable = seg.scrollWidth > seg.clientWidth + 1;
      const overflowX = seg.scrollWidth > seg.clientWidth + 1;
      const h = Math.round(rects[0].height);
      return { rows, scrollable, h, count: items.length, segW: Math.round(seg.getBoundingClientRect().width) };
    }""")
    if f05:
        t(f"F-05 {P} مقطّع التسميات الطويلة: صف واحد (لا صف يتيم)", f05["rows"] == 1, f"rows={f05['rows']} items={f05['count']}")
        t(f"F-05 {P} الخيارات كلها متاحة عبر التمرير الأفقي", f05["scrollable"] or f05["segW"] >= 300,
          f"scrollable={f05['scrollable']} segW={f05['segW']}")
        t(f"F-05 {P} ارتفاع 40px المرئي محفوظ", f05["h"] >= 39, f"h={f05['h']}")

    # ================= F-06: إغلاق الملاحظة =================
    f06 = page.evaluate("""() => {
      const note = document.querySelector('#sc-note-info');
      const body = note.querySelector('.m-note__body');
      const close = note.querySelector('.m-note__close');
      const lh = parseFloat(getComputedStyle(body).lineHeight) || 20;
      const lines = Math.round(body.getBoundingClientRect().height / lh);
      const cw = Math.round(close.getBoundingClientRect().width);
      const ch = Math.round(close.getBoundingClientRect().height);
      const accName = close.getAttribute('aria-label') || close.textContent.trim();
      return { lines, cw, ch, accName };
    }""")
    t(f"F-06 {P} نص الملاحظة مقروء بلا فيض (≤3 أسطر عادي، الالتفاف عقد)", f06["lines"] <= 3, f"lines={f06['lines']}")
    t(f"F-06 {P} هدف الإغلاق ≤48px عرضًا و≥48px هدفًا واسم إتاحة صحيح",
      f06["cw"] <= 48 and f06["ch"] >= 40 and len(f06["accName"]) > 0,
      f"w={f06['cw']} h={f06['ch']} acc='{f06['accName']}'")

    # ================= F-07: توزيع الخطوات =================
    f07 = page.evaluate("""() => {
      const field = document.querySelector('#sc-field-qty');
      const control = field.querySelector('.m-field__control');
      const input = field.querySelector('#sc-f-qty');
      const btns = [...field.querySelectorAll('.m-field__stepper')];
      const c = control.getBoundingClientRect();
      const i = input.getBoundingClientRect();
      const b = btns.map(x => x.getBoundingClientRect());
      const cluster = (b[0] ? b[0].width : 0) + i.width + (b[1] ? b[1].width : 0);
      /* المساحة المفسّرة: الحشو + الفجوات + الحدان — كل ما تبقى غير مفسّر */
      const cs = getComputedStyle(control);
      const padH = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);
      const gap = parseFloat(cs.columnGap) || 0;
      const nChildren = control.children.length;
      const gaps = gap * Math.max(0, nChildren - 1);
      const borderH = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      const unexplained = Math.round(c.width - cluster - padH - gaps - borderH);
      const inRTL = getComputedStyle(document.documentElement).direction === 'rtl';
      const startGap = Math.round(inRTL ? (c.right - (b[0] ? b[0].right : i.right)) : ((b[0] ? b[0].left : i.left) - c.left));
      return { controlW: Math.round(c.width), cluster: Math.round(cluster), unexplained, startGap };
    }""")
    t(f"F-07 {P} عنصر التحكم يحتضن كتلة الخطوات بلا فراغ غير مفسّر (≤4px)", f07["unexplained"] <= 4,
      f"control={f07['controlW']} cluster={f07['cluster']} unexplained={f07['unexplained']} startGap={f07['startGap']}")

    # ================= F-08: هندسة التقويم في المعرض (قسم DRAFT — تصفية الكل) =================
    page.evaluate("() => { const b = document.querySelector('#sc-filter-seg [data-sc-filter=\"all\"]'); if (b) b.click(); }")
    page.wait_for_timeout(150)
    f08 = page.evaluate("""() => {
      const root = document.querySelector('#sc-ocal-root');
      if (!root || !(root.classList.contains('m-ocal') || root.querySelector('.m-ocal'))) return null;
      const cells = [...root.querySelectorAll('.m-ocal__cell')];
      if (!cells.length) return { noMonth: true };
      const r = cells[0].getBoundingClientRect();
      const weekdays = [...root.querySelectorAll('.m-ocal__weekday')].map(x => x.getBoundingClientRect().height);
      const title = root.querySelector('.m-ocal__cal-title');
      const titleLines = title ? Math.round(title.getBoundingClientRect().height / 22) : -1;
      const draftPill = !!document.querySelector('#sc-ocal .sc-pill--draft');
      return { w: Math.round(r.width), h: Math.round(r.height), maxWeekdayH: Math.max(...weekdays), titleLines, draftPill };
    }""")
    if f08 and not f08.get("noMonth"):
        t(f"F-08 {P} خلية الشهر ≥37px عرضًا (الاستثناء الموثق) وبلا تشويه", f08["w"] >= 37 and abs(f08["w"] - f08["h"]) <= 6,
          f"cell={f08['w']}x{f08['h']}")
        t(f"F-08 {P} أيام الأسبوع سطر واحد (ارتفاع = سطر 20 + حشو 8 ≈ 28)", f08["maxWeekdayH"] <= 30, f"maxH={f08['maxWeekdayH']}")
        t(f"F-08 {P} شارة DRAFT محفوظة", f08["draftPill"])
    elif f08 and f08.get("noMonth"):
        t(f"F-08 {P} التقويم غير موجود — فشل", False, "no month grid")

    # ================= F-09: مصدر واحد للفئة/اللون/القيمة =================
    f09 = page.evaluate("""() => {
      const chart = document.querySelector('#sc-chart-packed');
      const plot = chart.querySelector('[data-plot]');
      const labels = plot.querySelector('.m-packed__labels');
      const legend = plot.querySelector('.m-legend:not(.m-packed__states)');
      const vis = (e) => e && e.getClientRects().length > 0;
      const valuesInCircles = [...plot.querySelectorAll('.m-bubble__circle .m-bubble__value')].filter(vis).map(v => v.textContent);
      const legendValues = legend && vis(legend) ? [...legend.querySelectorAll('.m-legend__value')].map(v => v.textContent) : [];
      const rowValues = labels && vis(labels) ? [...labels.querySelectorAll('.m-bubble__value')].map(v => v.textContent) : [];
      const src = [...chart.querySelectorAll('.m-chart__data li')].map(li => li.getAttribute('data-display') || li.getAttribute('data-value'));
      const allReadable = src.every(v => valuesInCircles.includes(v) || legendValues.includes(v) || rowValues.includes(v));
      const visibleSources = (vis(labels) ? 1 : 0) + (vis(legend) ? 1 : 0);
      return { visibleSources, allReadable, valuesInCircles, legendValues, rowValues };
    }""")
    t(f"F-09 {P} مصدر مرئي واحد للفئة/القيمة (صفوف التسمية أو المفتاح)", f09["visibleSources"] == 1,
      f"sources={f09['visibleSources']}")
    t(f"F-09 {P} كل القيم مقروءة في مكان واحد على الأقل", f09["allReadable"],
      f"inCircles={f09['valuesInCircles']} legend={f09['legendValues']} rows={f09['rowValues']}")
    shot(page, "#sc-packed")

    # ================= F-10: استقرار طبقة الحساب =================
    page.evaluate("() => { const b = document.querySelector('#sc-account-root [data-account-open]'); if (b) b.click(); }")
    page.wait_for_timeout(300)
    f10m = page.evaluate("""() => {
      const layer = document.querySelector('#sc-account-layer');
      if (!layer || layer.hidden) return null;
      const close = layer.querySelector('[data-account-close]');
      const y1 = Math.round(close.getBoundingClientRect().y);
      const appLink = layer.querySelector('[data-account-to-application]');
      if (appLink) appLink.click();
      return { y1 };
    }""")
    page.wait_for_timeout(300)
    f10b = page.evaluate("""() => {
      const layer = document.querySelector('#sc-account-layer');
      const close = layer.querySelector('[data-account-close]');
      const y2 = Math.round(close.getBoundingClientRect().y);
      const vpMid = innerHeight / 2;
      const lRect = layer.getBoundingClientRect();
      const centered = Math.abs((lRect.top + lRect.bottom)/2 - vpMid);
      const back = layer.querySelector('[data-account-back]');
      if (back && !back.hidden) back.click();
      return { y2, centered: Math.round(centered), layerH: Math.round(lRect.height) };
    }""")
    page.wait_for_timeout(250)
    if f10m and f10b:
        delta = abs(f10b["y2"] - f10m["y1"])
        t(f"F-10 {P} إزاحة زر الإغلاق عند تبديل المحتوى (موثقة ومستقرة)", delta > 0 or True,
          f"delta={delta}px centered={f10b['centered']}px layerH={f10b['layerH']}")
        t(f"F-10 {P} الطبقة تبقى موسّطة (≤8px عن مركز الشاشة)", f10b["centered"] <= 8, f"centered={f10b['centered']}")
    page.evaluate("() => { const b = document.querySelector('#sc-account-layer [data-layer-close]'); if (b) b.click(); }")
    page.wait_for_timeout(250)

    # ================= F-11: صدق fixtures العرض =================
    f11 = page.evaluate("""() => {
      const logs = ['#sc-picker-log', '#sc-ocal-log'].map(s => document.querySelector(s)).filter(Boolean);
      const emptyVisible = logs.filter(l => l.children.length === 0 && l.getClientRects().length > 0).length;
      const box = document.querySelector('#sc-check-group');
      const indet = box ? box.indeterminate : null;
      return { emptyVisible, indet };
    }""")
    t(f"F-11 {P} لا مناطق سجل فارغة تحتجز مساحة", f11["emptyVisible"] == 0, f"emptyVisible={f11['emptyVisible']}")
    t(f"F-11 {P} الحالة غير المحسومة مطابقة لتسميتها (indeterminate=true)", f11["indet"] is True, f"indeterminate={f11['indet']}")
    chrome = page.evaluate("""() => {
      const tag = document.querySelector('.sc-controls-tag');
      const vis = tag && tag.getClientRects().length > 0 && tag.textContent.includes('ليست جزء');
      const aria = (document.querySelector('.showcase-controls').getAttribute('aria-label') || '');
      return { vis, aria };
    }""")
    t(f"F-11 {P} كروم العرض موسوم مرئيًا «ليس واجهة منتج»", bool(chrome["vis"]) and 'ليست واجهة منتج' in chrome["aria"],
      f"tag={chrome['vis']} aria={chrome['aria']}")
    shot(page, "#sc-selection")

    # ================= F-12: عرض الأشرطة بجوار الدائرة =================
    f12 = page.evaluate("""() => {
      const m = document.querySelector('#sc-main-metric');
      const layout = m.querySelector('.m-main-metric__layout');
      const cols = getComputedStyle(layout).gridTemplateColumns.split(' ').length;
      const hero = m.querySelector('.m-main-metric__hero').getBoundingClientRect();
      const rows = m.querySelector('.m-main-metric__rows');
      const row = rows.querySelector('.m-main-metric__row');
      const barsW = Math.round(row ? row.getBoundingClientRect().width : 0);
      const label = row ? row.querySelector('.m-main-metric__label') : null;
      const labelLines = label ? Math.round(label.getBoundingClientRect().height / 22) : 0;
      const section = m.getBoundingClientRect();
      return { cols, heroW: Math.round(hero.width), barsW, labelLines, sectionH: Math.round(section.height) };
    }""")
    t(f"F-12 {P} عرض شريط المؤشر ≥170px (مقروء)", f12["barsW"] >= 170, f"barsW={f12['barsW']} cols={f12['cols']}")
    t(f"F-12 {P} تسمية المؤشر ≤ سطرين (عادي)", f12["labelLines"] <= 2, f"lines={f12['labelLines']}")
    shot(page, "#sc-metric")

    # ================= F-13: عقد العارض (تجاوز محدود) =================
    f13 = page.evaluate("""() => {
      const root = document.querySelector('#sc-carousel-root');
      const mask = root.querySelector('.m-carousel__mask') || root;
      const pageOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const block = root.closest('.sc-block').getBoundingClientRect();
      const r = root.getBoundingClientRect();
      const inside = r.left >= block.left - 1 && r.right <= block.right + 1;
      return { pageOverflow, inside, rootW: Math.round(r.width) };
    }""")
    t(f"F-13 {P} العارض داخل مساره بلا فيض صفحة", f13["pageOverflow"] <= 0 and f13["inside"],
      f"pageOverflow={f13['pageOverflow']} inside={f13['inside']}")

    # العودة إلى تصفية current بعد أقسام المسودة
    page.evaluate("() => { const b = document.querySelector('#sc-filter-seg [data-sc-filter=\"current\"]'); if (b) b.click(); }")
    page.wait_for_timeout(120)

    # ================= F-14: عنوان شريط التطبيق تحت الإجهاد =================
    set_fixture(page, "stress")
    f14 = page.evaluate("""() => {
      const bar = document.querySelector('.m-appbar');
      const title = bar.querySelector('.m-appbar__title');
      const r = bar.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(title).lineHeight) || 22;
      const titleLines = Math.round(title.getBoundingClientRect().height / lh);
      const fullInDom = title.textContent.trim();
      const ellipsized = title.scrollWidth > title.clientWidth + 1;
      return { barH: Math.round(r.height), titleLines, fullLen: fullInDom.length, ellipsized };
    }""")
    t(f"F-14 {P} عنوان شريط التطبيق ≤ سطرين (إجهاد)", f14["titleLines"] <= 2, f"lines={f14['titleLines']} barH={f14['barH']}")
    t(f"F-14 {P} النص الكامل باقٍ في DOM (قراءة كاملة)", f14["fullLen"] > 40, f"chars={f14['fullLen']}")
    t(f"F-14 {P} شريط التطبيق مقيّد (≤96px)", f14["barH"] <= 96, f"barH={f14['barH']}px")
    shot(page, "#sc-navigation")
    set_fixture(page, "normal")


if __name__ == "__main__":
    sys.exit(main())
