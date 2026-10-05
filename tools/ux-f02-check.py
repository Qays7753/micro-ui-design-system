#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص قبول UX-F02 (مسارات F02-01..F02-32). من جذر المستودع:
  python3 tools/ux-f02-check.py                     # أدلة الجولة الأصلية
  python3 tools/ux-f02-check.py --round r1          # أدلة جولة مسماة
  F02_ROOT=/path python3 ...                        # أو --root لcheckout نظيف
المخرجات: reviews/UX-F02/round-<round>/verification.json + .txt + screenshots/
المسارات تغطي إصلاحات P01–P04 وعينات الاختيار/الفلاتر/المفتاح (المصدر المصلح).
فشل أي assertion أو خطأ صفحة أو مورد 4xx/5xx أو تعذر بيئة → رمز خروج غير صفري.

آليات مقاسة معلنة:
- المؤشر الحقيقي: page.mouse.click على إحداثيات العنصر للمعطل/الحالات الحرجة
  (Playwright click() العادي يرفض المعطل/aria-disabled وقد يخفي خلل الحرس).
- تكبير النص 200%: مضاعفة أحجام الخط المحسوبة لعناصر مختارة وقياسها
  قبل/بعد (آلية ui-release-check المعلنة) — ليست native zoom.
- reduced-motion: تفضيل فعلي عبر Playwright reduced_motion='reduce'.
- التسوية/الرد القديم: أداة SIMULATION عبر evaluate (محايدة للتركيز) وفق
  إذن البطاقة §6؛ أفعال المستخدم الحقيقية بالنقر/لوحة المفاتيح.
لا تثبت هذه الفحوص: قارئ شاشة فعلي، WebKit، أجهزة حقيقية، لمس — NOT RUN.
"""
import argparse
import functools
import hashlib
import http.server
import json
import re
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
ROUND = "r1"
ARGS = None  # يضبط في main

UX_DIRNAME = None  # يكتشف من previews في main

CHOICE_PAGE = None
FILTER_PAGE = None
SWITCH_PAGE = None

results_rows, log_lines, js_errors, http_failures = [], [], [], []
BROWSER_VERSION = ""
SOURCE_COMMIT = ""
SOURCE_TREE = ""


def log(m):
    print(m)
    log_lines.append(m)


def row(rid, title, expected):
    r = {"id": rid, "path": title, "expected": expected, "measured": {}, "failed": []}
    results_rows.append(r)
    log(f"## {rid} — {title}")
    return r


def A(r, name, ok, detail=None):
    ok = bool(ok)
    r["measured"][name] = detail if detail is not None else ok
    if not ok:
        r["failed"].append(name + ((" — " + str(detail)) if detail is not None else ""))
        log(f"   FAIL {name} — {detail}")
    else:
        log(f"   ok   {name}" + (f" ({json.dumps(detail, ensure_ascii=False)})" if detail is not None else ""))
    return ok


# ---------- مساعدات البيئة ----------

def discover_ux_dir():
    previews = ROOT / "previews"
    dirs = [d.name for d in previews.iterdir() if d.is_dir() and d.name.startswith("ux-")]
    if len(dirs) != 1:
        raise SystemExit(f"EXPECTED one previews/ux-* dir, found {dirs}")
    return dirs[0]


def watch(page):
    page.on("pageerror", lambda e: js_errors.append(str(e)))
    page.on("response", lambda r: http_failures.append((r.url.split("/")[-1], r.status)) if r.status >= 400 else None)


def goto(page, which):
    page.goto(f"{BASE}/{which}", wait_until="networkidle")
    page.evaluate("() => document.fonts.ready")
    page.evaluate("() => { window.__f02_no_reload = 'F02-SESSION'; }")


def reset_reload_marker(page):
    page.evaluate("() => { window.__f02_no_reload = 'F02-SESSION'; }")


def assert_no_reload(page, r, name="بلا reload"):
    return A(r, name, page.evaluate("() => window.__f02_no_reload === 'F02-SESSION'"))


# ---------- مساعدات عينة الاختيار ----------

def choice_inspect(page):
    return page.evaluate("() => window.F02Choice.inspect()")


def choice_arm(page, outcome):
    page.evaluate(
        """(v) => { const s = document.getElementById('f02c-sim-outcome');
             s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }""",
        outcome,
    )


def choice_settle(page, which):
    page.evaluate(
        "() => document.getElementById('f02c-sim-settle-" + which + "').click()")


def choice_stale(page):
    page.evaluate("() => document.getElementById('f02c-sim-stale').click()")


def choice_open(page):
    page.click("#f02c-open-picker")
    page.wait_for_function("() => window.F02Choice.inspect().layerOpen === true", timeout=3000)


def choice_close_wait(page):
    page.wait_for_function("() => window.F02Choice.inspect().layerOpen === false", timeout=3000)


def drop_note_measure(page):
    """F02-R2-04(1): قياس رسالة زوال الاختيار فعليًا — الظهور المحسوب
    (display/hidden) ومساحة العنصر وعدم القص + نصها وموقعها داخل الطبقة
    + هل نص الزوال موجود أيضًا في قناة القراءة (فحص قناة واحدة)."""
    return page.evaluate(
        """() => {
        const n = document.getElementById('f02c-drop-note');
        const live = document.getElementById('f02c-picker-live');
        const layer = document.getElementById('f02c-picker-layer');
        if (!n) return null;
        const cs = getComputedStyle(n), r = n.getBoundingClientRect();
        return { text: (document.getElementById('f02c-drop-note-text') || {textContent: ''}).textContent,
                 hiddenAttr: n.hidden, display: cs.display, visibility: cs.visibility,
                 w: Math.round(r.width), h: Math.round(r.height),
                 clipPath: cs.clipPath, inLayer: layer.contains(n),
                 inLive: (live.textContent || '').indexOf('لم يعد متاحًا') !== -1 };
      }""")


def drop_note_visible_assertion(dn):
    """شرط الظهور الفعلي للرسالة (لا textContent وحده ولا داخل الطبقة وحدها):
    محسوبًا معروضة، بسمة hidden=false، بمستطيل حقيقي > 1×1، بلا قص،
    داخل الطبقة، بنص الزوال الصحيح."""
    return bool(dn) and dn["inLayer"] and not dn["hiddenAttr"] and dn["display"] != "none" \
        and dn["visibility"] != "hidden" and dn["w"] > 1 and dn["h"] > 1 \
        and dn["clipPath"] == "none" and "لم يعد متاحًا" in dn["text"]


def raw_click(page, selector):
    """نقر مؤشر حقيقي بإحداثيات العنصر — يتجاوز حراسة Playwright للمعطل."""
    box = page.locator(selector).bounding_box()
    page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)


# ---------- مساعدات عينة الفلاتر ----------

def filter_inspect(page):
    return page.evaluate("() => window.F02Filter.inspect()")


def filter_open(page):
    page.click("#f02f-filter-btn")
    page.wait_for_function("() => window.F02Filter.inspect().layerOpen === true", timeout=3000)


def filter_close_wait(page):
    page.wait_for_function("() => window.F02Filter.inspect().layerOpen === false", timeout=3000)


def filter_listen_applied(page):
    page.evaluate("""() => {
      window.__f02_applied_events = 0; window.__f02_applied_detail = null;
      document.getElementById('f02f-filter-layer').addEventListener(
        'micro-navigation:filters-applied',
        (e) => { window.__f02_applied_events += 1; window.__f02_applied_detail = { applied: e.detail.applied, count: e.detail.count }; });
    }""")


# ---------- مساعدات عينة المفتاح ----------

def switch_inspect(page):
    return page.evaluate("() => window.F02Switch.inspect()")


def switch_arm(page, which, outcome):
    page.evaluate(
        """([sel, v]) => { const s = document.getElementById(sel);
             s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }""",
        ["f02s-sim-" + which + "-outcome", outcome],
    )


def switch_settle(page, which):
    page.evaluate("() => document.getElementById('f02s-sim-settle-" + which + "').click()")


def switch_stale(page, which):
    page.evaluate("() => document.getElementById('f02s-sim-stale-" + which + "').click()")


def switch_toggle(page):
    page.click("label:has(#f02s-switch-input)")


# ---------- ظهور فعلي / تكبير ----------

def vis(page, selector):
    """الظهور الفعلي: computed display + مستطيل + قابلية التقاط التركيز."""
    return page.evaluate(
        """(sel) => {
        const e = document.querySelector(sel);
        if (!e) return null;
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        const before = document.activeElement;
        e.focus();
        const took = document.activeElement === e;
        if (took && before && before.focus) before.focus();
        return { display: cs.display, hiddenAttr: e.hidden,
                 w: Math.round(r.width), h: Math.round(r.height), focusable: took };
      }""", selector)


ZOOM_SELECTORS = ['h1', '.f02-hint', '.m-choice__text', '.m-btn', '.m-note__body',
                  '.m-picker__option', '.f02f-row__label', '.m-switch__label']


def zoom200(page):
    """F02-R1-08(3): مضاعفة 200% بممرين — التقاط أحجام البداية لكل العناصر
    أولًا ثم تطبيقها من اللقطة (قراءة/كتابة متسلسلة تضاعف الموروث مرتين).
    تعيد before/after للعناصر المطلوبة وآلية معلنة. ليست native zoom."""
    return page.evaluate("""(sel) => {
      const els = sel.map(s => document.querySelector(s)).filter(Boolean).slice(0, 8);
      const before = els.map(e => parseFloat(getComputedStyle(e).fontSize));
      const fontEls = [...document.querySelectorAll('body, body *')]
        .filter(e => { const fs = getComputedStyle(e).fontSize; return fs && fs.endsWith('px'); });
      const snapshot = new Map(fontEls.map(e => [e, parseFloat(getComputedStyle(e).fontSize)]));
      snapshot.forEach((px, e) => { e.style.fontSize = (px * 2) + 'px'; });
      const after = els.map(e => parseFloat(getComputedStyle(e).fontSize));
      const names = sel.filter(s => document.querySelector(s) !== null);
      return { before, after, names,
               doubled: before.every((b, i) => Math.abs(after[i] - b * 2) < 0.6) };
    }""", ZOOM_SELECTORS)


def no_h_overflow(page):
    return page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")


def shot(page, name):
    page.screenshot(path=str(OUT / "screenshots" / name))


# ---------- المسارات: P01–P04 ----------

def run_f02_01(page):
    """P01: مجموعة بلا مفعّلين — تهيئة ثم نقر تحديد الكل؛ المعطل محفوظ."""
    r = row("F02-01", "P01 مجموعة بلا خيارات مفعّلة: init ثم نقر تحديد الكل",
            "checked=false وindeterminate=false قبل/بعد النقر؛ المعطل وقيمته محفوظان")
    goto(page, CHOICE_PAGE)
    zero = page.evaluate("""() => {
      const all = document.getElementById('f02c-group-zero-all');
      return { checked: all.checked, indeterminate: all.indeterminate }; }""")
    A(r, "init: الحامل صفر صريح", zero["checked"] is False and zero["indeterminate"] is False, zero)
    raw_click(page, "label:has(#f02c-group-zero-all)")
    page.wait_for_timeout(60)
    zero = page.evaluate("""() => {
      const all = document.getElementById('f02c-group-zero-all');
      return { checked: all.checked, indeterminate: all.indeterminate }; }""")
    A(r, "بعد النقر: بلا حالة وهمية", zero["checked"] is False and zero["indeterminate"] is False, zero)
    dis = page.evaluate("""() => {
      const boxes = [...document.querySelectorAll('#f02c-group-zero input[data-choice-item]')];
      return boxes.map(b => ({ disabled: b.disabled, checked: b.checked })); }""")
    A(r, "المعطلان محفوظان (أحدهما محدد)", dis == [{"disabled": True, "checked": True}, {"disabled": True, "checked": False}], dis)
    # مفعّلان في المجموعة الرئيسية: تهيئة سليمة من المصدر الواحد
    main_state = page.evaluate("""() => {
      const all = document.getElementById('f02c-all-main');
      const items = [...document.querySelectorAll('#f02c-group-main input[data-choice-item]')];
      return { allChecked: all.checked, allInd: all.indeterminate,
               items: items.map(b => ({ checked: b.checked, disabled: b.disabled })) }; }""")
    A(r, "المجموعة الرئيسية: صفر مبدئي + ثالث معطل محدد",
      main_state["allChecked"] is False and main_state["allInd"] is False
      and main_state["items"][2] == {"checked": True, "disabled": True}, main_state)
    shot(page, "f02-01-zero-group.png")


def run_f02_02(page):
    """P02: segmented مع aria-disabled — مؤشر حقيقي وEnter/Space لا تفعلان."""
    r = row("F02-02", "P02 مقطّع: aria-disabled + مؤشر حقيقي + Enter/Space + أسهم",
            "لا تغيير ولا حدث من المعطل؛ الأسهم تتجاوزه؛ المفعّل يعمل")
    goto(page, CHOICE_PAGE)
    page.evaluate("""() => {
      window.__seg_events = 0;
      document.getElementById('f02c-mode-seg').addEventListener(
        'micro-selection:segment', () => window.__seg_events += 1); }""")
    # مؤشر حقيقي على المعطل
    raw_click(page, "#f02c-mode-seg [data-value='extra']")
    page.wait_for_timeout(60)
    st = page.evaluate("""() => ({
      pressed: document.querySelector("#f02c-mode-seg [data-value='extra']").getAttribute('aria-pressed'),
      events: window.__seg_events,
      mode: window.F02Choice.inspect().mode })""")
    A(r, "نقرة مؤشر حقيقية: لا تحديد ولا حدث", st["pressed"] == "false" and st["events"] == 0 and st["mode"] == "brief", st)
    # Enter وSpace على المعطل (تركيز ثم مفتاح — أصله click داخل المكوّن)
    page.evaluate("() => document.querySelector(\"#f02c-mode-seg [data-value='extra']\").focus()")
    page.keyboard.press("Enter")
    page.keyboard.press(" ")
    page.wait_for_timeout(60)
    st = page.evaluate("""() => ({
      pressed: document.querySelector("#f02c-mode-seg [data-value='extra']").getAttribute('aria-pressed'),
      events: window.__seg_events })""")
    A(r, "Enter/Space: لا تحديد ولا حدث", st["pressed"] == "false" and st["events"] == 0, st)
    # الأسهم تتجاوز المعطل: من موجز ArrowLeft → التالي المفعّل (تفصيلي)
    page.evaluate("() => document.querySelector(\"#f02c-mode-seg [data-value='brief']\").focus()")
    page.keyboard.press("ArrowLeft")
    page.wait_for_timeout(60)
    st = page.evaluate("""() => ({
      detailPressed: document.querySelector("#f02c-mode-seg [data-value='detail']").getAttribute('aria-pressed'),
      extraPressed: document.querySelector("#f02c-mode-seg [data-value='extra']").getAttribute('aria-pressed'),
      events: window.__seg_events,
      mode: window.F02Choice.inspect().mode,
      focusOn: document.activeElement.getAttribute('data-value') || document.activeElement.tagName })""")
    A(r, "أسهم تتجاوز المعطل وتحدد التالي المفعّل",
      st["detailPressed"] == "true" and st["extraPressed"] == "false" and st["events"] == 1 and st["mode"] == "detail", st)
    shot(page, "f02-02-segmented-guard.png")


def run_f02_03(page):
    """P03: ملخص فلاتر بشري + تسمية غائبة تعطي ملخصًا آمنًا + event سليم."""
    r = row("F02-03", "P03 ملخص الفلاتر: تسميات بشرية، لا مفاتيح، event/count سليم",
            "ملخص بالتسميات؛ لا قيمة بحث خام؛ تسمية غائبة → عدد محايد؛ detail.applied/count سليمة")
    goto(page, FILTER_PAGE)
    filter_listen_applied(page)
    filter_open(page)
    page.fill("#f02f-q", "ج")
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "ملخص الجاري بالتسمية لا القيمة", s["summaryText"] == "الجاري: البحث", s["summaryText"])
    page.click("label:has(> [data-filter-key='active'])")
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "تسمية data-filter-label تعمل", "النشطة" in s["summaryText"] and "active" not in s["summaryText"], s["summaryText"])
    A(r, "لا قيمة بحث خام في الملخص", "ج" not in s["summaryText"].replace("الجاري", ""), s["summaryText"])
    A(r, "لا عبارة العدّاد التقنية", "يخفي" not in s["summaryText"] and "0)" not in s["summaryText"], s["summaryText"])
    # تسمية غائبة: ملخص عدد محايد بلا اسم مفتاح (حقن مؤقت للفحص ثم إزالة)
    page.evaluate("""() => {
      const panel = document.getElementById('f02f-filter-layer');
      const lab = document.createElement('label');
      lab.innerHTML = '<input type="checkbox" data-filter-key="nolabel_key">';
      panel.querySelector('.f02f-choices').appendChild(lab); }""")
    raw_click(page, "label:has(> [data-filter-key='nolabel_key'])")
    page.wait_for_timeout(60)
    s = filter_inspect(page)
    A(r, "تسمية غائبة: ملخص عدد محايد بلا مفاتيح", s["summaryText"] == "الجاري: 3 فلاتر", s["summaryText"])
    A(r, "لا اسم مفتاح داخلي ظهر", "nolabel" not in s["summaryText"], s["summaryText"])
    page.evaluate("() => document.querySelector(\"[data-filter-key='nolabel_key']\").closest('label').remove()")
    raw_click(page, "label:has(> [data-filter-key='active'])")  # إزالة العلامة بنقرة حقيقية
    page.wait_for_timeout(60)
    page.wait_for_timeout(50)
    # التطبيق: event بنسخة القيم والعدد
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    ev = page.evaluate("() => ({ n: window.__f02_applied_events, d: window.__f02_applied_detail })")
    A(r, "حدث تطبيق واحد بنسخة applied", ev["n"] == 1 and ev["d"]["applied"] == {"q": "ج", "active": False, "marked": False}, ev)
    A(r, "count = عدد الشروط", ev["d"]["count"] == 1, ev["d"])
    A(r, "applied لدى المستهلك مطابق", s["applied"] == {"q": "ج", "active": False, "marked": False}, s["applied"])
    shot(page, "f02-03-human-summary.png")


def run_f02_04(source_root):
    """P04: توثيق المنتقي مرتبطًا بB07 + مطابقة README والعقود للمصدر."""
    r = row("F02-04", "P04 توثيق المنتقي/العقود", "لا وصف طبقة مؤقتة؛ عقد B07 مرجع الروابط؛ READMEs موجودة ومطابقة")
    spec = (source_root / "components" / "selection" / "specification.md").read_text(encoding="utf-8")
    A(r, "لا «المنتقي بطبقة مؤقتة حتى B07»", "بطبقة مؤقتة حتى B07" not in spec)
    A(r, "الربط الفعلي بB07 موثق", "MicroNavigation.openLayer" in spec and "B07" in spec, "specification.md §6")
    A(r, "إصلاح F02-P04 موسوم", "F02-P04" in spec)
    nav_spec = (source_root / "components" / "navigation" / "specification.md").read_text(encoding="utf-8")
    A(r, "data-filter-label موثق في مواصفة B07", "data-filter-label" in nav_spec)
    sel_spec = (source_root / "components" / "selection" / "specification.md").read_text(encoding="utf-8")
    A(r, "حراسة isDisabled في النقر موثقة (F02-P02)", "F02-P02" in sel_spec)
    A(r, "حالة صفر صريح للمجموعة الفارغة موثقة (F02-P01)", "F02-P01" in sel_spec)
    ux = discover_ux_dir()
    for name in ("choice-lifecycle", "filter-lifecycle", "switch-lifecycle"):
        p = source_root / "previews" / ux / name / "README.md"
        A(r, f"README موجود: {name}", p.exists() and len(p.read_text(encoding="utf-8")) > 400, p.exists())
    index_html = (source_root / "previews" / ux / "index.html").read_text(encoding="utf-8")
    A(r, "فهرس ux-patterns يربط العينات الأربع",
      all(x in index_html for x in ["form-lifecycle", "choice-lifecycle", "filter-lifecycle", "switch-lifecycle"]))
    prev_index = (source_root / "previews" / "index.html").read_text(encoding="utf-8")
    A(r, "فهرس المعرض يحيل لعينات UX", "ux-patterns" in prev_index)


# ---------- المسارات: عينة الاختيار ----------

def run_f02_05(page):
    r = row("F02-05", "checkboxes صفر→جزئي→كل→مسح + راديو", "المعطل المحفوظ ثابت؛ تحديد الكل يخص المفعّل؛ راديو واحد؛ لا قراءات ولا حفظ")
    goto(page, CHOICE_PAGE)
    reads_before = choice_inspect(page)["readCalls"]

    def group_state():
        return page.evaluate("""() => {
          const items = [...document.querySelectorAll('#f02c-group-main input[data-choice-item]')];
          const all = document.getElementById('f02c-all-main');
          return { items: items.map(b => ({ checked: b.checked, disabled: b.disabled })),
                   all: { checked: all.checked, indeterminate: all.indeterminate } }; }""")

    st = group_state()
    A(r, "بداية: صفر مفعّل محدد، المعطل محدد", st["items"][2] == {"checked": True, "disabled": True} and st["all"]["indeterminate"] is False, st)
    page.click("label:has(#f02c-choice-alpha)")
    page.wait_for_timeout(40)
    st = group_state()
    A(r, "جزئي: alpha محدد → indeterminate", st["items"][0]["checked"] is True and st["all"]["indeterminate"] is True and st["all"]["checked"] is False, st)
    page.click("label:has(#f02c-choice-beta)")
    page.wait_for_timeout(40)
    st = group_state()
    A(r, "كل المفعّل: تحديد الكل true بلا جزئية", st["all"]["checked"] is True and st["all"]["indeterminate"] is False, st)
    page.click("label:has(#f02c-choice-alpha)")
    page.click("label:has(#f02c-choice-beta)")
    page.wait_for_timeout(40)
    st = group_state()
    A(r, "مسح المفعّل: صفر صريح، المعطل باقٍ",
      st["items"][0]["checked"] is False and st["items"][2]["checked"] is True
      and st["all"]["checked"] is False and st["all"]["indeterminate"] is False, st)
    # نقر تحديد الكل: يخص المفعّل فقط
    page.click("label:has(#f02c-all-main)")
    page.wait_for_timeout(40)
    st = group_state()
    A(r, "تحديد الكل يحدد المفعّلين ولا يلمس المعطل",
      st["items"][0]["checked"] is True and st["items"][1]["checked"] is True and st["items"][2] == {"checked": True, "disabled": True}, st)
    # راديو: اختيار واحد فقط
    page.click("label:has(#f02c-radio-alpha)")
    page.wait_for_timeout(30)
    page.click("label:has(#f02c-radio-beta)")
    page.wait_for_timeout(30)
    radios = page.evaluate("""() => [...document.querySelectorAll('#f02c-radios input[type=radio]')]
      .map(b => ({ checked: b.checked, name: b.name }))""")
    A(r, "راديو: اسم واحد واختيار واحد", len({x["name"] for x in radios}) == 1 and [x["checked"] for x in radios] == [False, True, False], radios)
    s = choice_inspect(page)
    A(r, "لا قراءات من المجموعات المحلية", s["readCalls"] == reads_before == 0, s["readCalls"])
    A(r, "لا رسائل نجاح/حفظ", s["selectionNote"] == "", s["selectionNote"])
    shot(page, "f02-05-groups.png")


def run_f02_06(page):
    r = row("F02-06", "مقطّع موجز/تفصيلي", "aria-pressed والمحتوى متطابقان؛ لا تأثير على المنتقي ولا أحداث عرض")
    goto(page, CHOICE_PAGE)
    page.evaluate("""() => { window.__seg_events = 0;
      document.getElementById('f02c-mode-seg').addEventListener('micro-selection:segment', () => window.__seg_events += 1); }""")
    page.click("#f02c-mode-seg [data-value='detail']")
    page.wait_for_timeout(40)
    st = page.evaluate("""() => ({
      brief: document.getElementById('f02c-mode-brief').hidden,
      detail: document.getElementById('f02c-mode-detail').hidden,
      pressedDetail: document.querySelector("#f02c-mode-seg [data-value='detail']").getAttribute('aria-pressed'),
      pressedBrief: document.querySelector("#f02c-mode-seg [data-value='brief']").getAttribute('aria-pressed'),
      events: window.__seg_events, insp: window.F02Choice.inspect() })""")
    A(r, "المحتوى يتبع الوضع", st["brief"] is True and st["detail"] is False, st)
    A(r, "aria-pressed متزامن", st["pressedDetail"] == "true" and st["pressedBrief"] == "false", st)
    A(r, "المنتقي لم يتأثر: لا قراءات ولا اختيار ولا طبقة",
      st["insp"]["readCalls"] == 0 and st["insp"]["layerOpen"] is False and st["insp"]["selected"] is None, st["insp"])
    page.click("#f02c-mode-seg [data-value='brief']")
    page.wait_for_timeout(40)
    st = page.evaluate("""() => ({ brief: document.getElementById('f02c-mode-brief').hidden, events: window.__seg_events })""")
    A(r, "عودة للموجز سليمة", st["brief"] is False and st["events"] == 2, st["events"])
    shot(page, "f02-06-segmented-detail.png")


def run_f02_07(page):
    r = row("F02-07", "قراءة المنتقي loading→error→retry→ready", "القديم غير مرئي/غير قابل للاختيار؛ البحث لا يمس الخطأ؛ retry قراءة واحدة")
    goto(page, CHOICE_PAGE)
    choice_arm(page, "error")
    choice_open(page)
    s = choice_inspect(page)
    A(r, "loading: لا خيارات ظاهرة", all(not o["visibleRect"] for o in s["options"]) and s["readSeq"] == 1, s)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "error: صف حالة + زر إعادة محاولة، الخيارات مخفية فعليًا",
      s["stateRow"] and "إعادة المحاولة" in s["stateRow"] and all(o["display"] == "none" for o in s["options"]), s)
    A(r, "error: لا خيار قديم قابل للاختيار", all(o["hiddenAttr"] for o in s["options"]), s)
    # البحث أثناء الخطأ لا يمس الحالة
    page.fill("[data-picker-search]", "عينة")
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "البحث لا يزيل حالة الخطأ", s["stateRow"] and "إعادة المحاولة" in s["stateRow"], s["stateRow"])
    page.fill("[data-picker-search]", "")
    shot(page, "f02-07-picker-error.png")
    page.click("[data-picker-retry]")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "retry: قراءة واحدة جديدة", s["readCalls"] == 2 and s["readSeq"] == 2, (s["readCalls"], s["readSeq"]))
    A(r, "retry أثناء loading: صف الانتظار", s["stateRow"] == "جارٍ القراءة…", s["stateRow"])
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "ready: خيارات ظاهرة وصف الحالة زال",
      len(s["options"]) == 3 and all(o["visibleRect"] for o in s["options"]) and s["stateRow"] is None, s)
    shot(page, "f02-07-picker-ready.png")


def run_f02_08(page):
    r = row("F02-08", "empty-source وready بلا عناصر بعد اختيار سابق + no-results",
            "المصدر الفارغ (مسارا empty وready/items=[]) يصفر الاختيار والملخص والعرض مع رسالة "
            "الزوال الظاهرة داخل الطبقة (R2-01) دون استبدال العقدة أو reload ولا اختيار تلقائي؛ "
            "no-results ثم المسح يعيد البيانات بلا قراءة؛ والبحث المكتوب أثناء القراءة (R2-04-2) "
            "يعلن من الظاهر لا من عدد المصدر: مطابقة/بلا مطابقة/تحديث ببيانات جديدة/مسح")
    goto(page, CHOICE_PAGE)
    # اختيار سابق: open → settle → اختيار beta
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='beta']")
    choice_close_wait(page)
    nodes_before = page.evaluate("() => document.querySelectorAll('#f02c-picker-layer .m-picker__option').length")
    reset_reload_marker(page)
    # المسار 1: armed=empty والطبقة مفتوحة
    choice_arm(page, "empty")
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "empty بعد اختيار: الاختيار صفر في القيمة والعرض والملخص",
      s["selected"] is None and "لا شيء" in s["displayText"]
      and s["pickerSummary"] == "المحدد: لا شيء", s)
    dn = drop_note_measure(page)
    A(r, "empty بعد اختيار: رسالة الزوال ظاهرة فعليًا داخل الطبقة (R2-01)",
      drop_note_visible_assertion(dn), dn)
    A(r, "empty بعد اختيار: قناة واحدة — نص الزوال ليس في قناة القراءة والخارجية فارغة",
      not dn["inLive"] and s["selectionNote"] == "", (dn["inLive"], s["selectionNote"]))
    A(r, "empty بعد اختيار: صف حالة صريح ولا اختيار تلقائي لأول خيار",
      s["stateRow"] == "لا خيارات في المصدر." and not any(o["selected"] for o in s["options"]), s)
    # المسار 2: ready بقائمة فارغة عبر مسار المستهلك (نفس التزامن)
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'ready', items: [] });""")
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "ready/items=[] يطابق empty (تزامن null ورسالة الزوال)",
      s["selected"] is None and s["stateRow"] == "لا خيارات في المصدر."
      and not any(o["selected"] for o in s["options"]), s)
    A(r, "بلا reload في المسارين", page.evaluate("() => window.__f02_no_reload === 'F02-SESSION'"))
    page.keyboard.press("Escape")
    choice_close_wait(page)
    # عودة البيانات: فتح جديد ready ثم no-results ثم مسح البحث
    choice_arm(page, "ready")
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "فتح جديد يعيد ready بعد الفارغ", len(s["options"]) == 3 and s["stateRow"] is None, s)
    page.fill("[data-picker-search]", "zzz")
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "no-results: صف بحث ولا يخلط بحالة القراءة", "لا نتائج مطابقة" in (s["stateRow"] or ""), s["stateRow"])
    A(r, "no-results: القناة المباشرة تعلن انعدام النتائج لا عدد القراءة القديم",
      "لا نتائج" in (s["liveText"] or "") and "تمت القراءة" not in (s["liveText"] or ""), s["liveText"])
    shot(page, "f02-08-picker-no-results.png")
    calls_before = s["readCalls"]
    page.fill("[data-picker-search]", "")
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "مسح البحث يعيد كل الخيارات بلا قراءة جديدة وتعلانًا مفهومًا",
      len([o for o in s["options"] if o["visibleRect"]]) == 3 and s["readCalls"] == calls_before
      and "الخيارات الظاهرة: 3" in (s["liveText"] or ""), (s["liveText"], s["readCalls"]))
    shot(page, "f02-08-picker-empty.png")
    # F02-R2-04(2): كتابة البحث أثناء القراءة ثم التسوية — لا مكتوب بعد ready فقط
    page.keyboard.press("Escape")  # الطبقة مفتوحة من المسار السابق — إغلاق قبل قراءة جديدة
    choice_close_wait(page)
    choice_open(page)
    page.fill("[data-picker-search]", "ب")  # أثناء loading
    page.wait_for_timeout(50)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "بحث أثناء القراءة ثم ready بمطابقة: الإعلان يطابق الظاهر (R2-02)",
      "نتائج البحث: 1" in (s["liveText"] or "")
      and len([o for o in s["options"] if o["visibleRect"]]) == 1, s["liveText"])
    page.keyboard.press("Escape")
    choice_close_wait(page)
    choice_open(page)
    page.fill("[data-picker-search]", "zzz")  # أثناء loading
    page.wait_for_timeout(50)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "بحث أثناء القراءة ثم ready بلا مطابقة: انعدام النتائج لا عدد المصدر (R2-02)",
      s["searchValue"] == "zzz" and "لا نتائج مطابقة" in (s["liveText"] or "")
      and "تمت القراءة" not in (s["liveText"] or "")
      and len([o for o in s["options"] if o["visibleRect"]]) == 0
      and "لا نتائج مطابقة" in (s["stateRow"] or ""), s["liveText"])
    # تحديث البيانات مع استعلام قائم (R2-04-2): نتيجة جديدة بمطابقة واحدة
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'ready',
      items: [{ value: 'zzz-a', label: 'نتيجة zzz واحدة' }] });""")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "تحديث بيانات باستعلام قائم مع مطابقة: عدد الظاهر هو المعلن",
      "نتائج البحث: 1" in (s["liveText"] or "")
      and len([o for o in s["options"] if o["visibleRect"]]) == 1, s["liveText"])
    page.fill("[data-picker-search]", "")
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "مسح البحث بعد تحديث باستعلام قائم: النص يطابق المعروض",
      "الخيارات الظاهرة: 1" in (s["liveText"] or ""), s["liveText"])
    page.keyboard.press("Escape")
    choice_close_wait(page)


def run_f02_09(page):
    r = row("F02-09", "اختيار ثم إعادة فتح ثم مسح", "قيمة/ملخص/عرض متطابقة؛ الاختيار يغلق الطبقة؛ المسح إلى null بلا قراءات حفظ")
    goto(page, CHOICE_PAGE)
    choice_open(page)
    choice_settle(page, "latest")  # السيناريو الافتراضي ready
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='beta']")
    choice_close_wait(page)
    s = choice_inspect(page)
    A(r, "الاختيار أغلق الطبقة وتركّز على المشغّل", s["focusId"] == "f02c-open-picker" and s["layerOpen"] is False, s)
    A(r, "قيمة/عرض/ملخص متطابقة", s["selected"] == {"value": "beta", "label": "عينة ب"} and "عينة ب" in s["displayText"] and "عينة ب" in s["pickerSummary"], s)
    # إعادة فتح: الاختيار السابق محفوظ في المنتقي (لا فراغ)
    choice_open(page)
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "إعادة فتح: الملخص الداخلي يحفظ الاختيار", s["pickerSummary"] == "المحدد: عينة ب", s["pickerSummary"])
    page.keyboard.press("Escape")
    choice_close_wait(page)
    calls_pre_clear = choice_inspect(page)["readCalls"]
    # المسح من خارج الطبقة
    page.click("#f02c-clear")
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "مسح الاختيار: null في كل العروض", s["selected"] is None and "لا شيء" in s["displayText"] and s["pickerSummary"] == "المحدد: لا شيء", s)
    A(r, "لا قراءات جديدة عند المسح (ولا مسار حفظ أصلاً)", s["readCalls"] == calls_pre_clear, (s["readCalls"], calls_pre_clear))
    shot(page, "f02-09-selected-cleared.png")


def run_f02_10(page):
    r = row("F02-10", "إغلاق بلا اختيار جديد بكل الوسائل",
            "الاختيار السابق محفوظ؛ لا إعادة فتح تلقائية؛ تركيز إلى المشغّل الصالح؛ "
            "إغلاق ظاهر واحد في التركيب (R1-06) بفقد Escape/الخلفية")
    goto(page, CHOICE_PAGE)
    A(r, "إغلاق ظاهر واحد: لا [data-picker-close] في تركيب الطبقة",
      page.evaluate("() => document.querySelectorAll('#f02c-picker-layer [data-picker-close]').length") == 0)
    A(r, "زر رأس الطبقة موجود والوسائل الأخرى سليمة (Escape/خلفية data-backdrop=close)",
      page.evaluate("() => !!document.querySelector('#f02c-picker-layer [data-layer-close]')")
      and page.evaluate("() => document.getElementById('f02c-picker-layer').getAttribute('data-backdrop') === 'close'"))
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='alpha']")
    choice_close_wait(page)
    means = []
    # 1) زر رأس الطبقة (الإغلاق الظاهر الوحيد)
    choice_open(page)
    page.click("[data-layer-close]")
    choice_close_wait(page)
    means.append(choice_inspect(page)["focusId"])
    # 2) Escape
    choice_open(page)
    page.keyboard.press("Escape")
    choice_close_wait(page)
    means.append(choice_inspect(page)["focusId"])
    # 3) الخلفية بنقرة حقيقية
    choice_open(page)
    page.wait_for_timeout(120)  # اكتمال انتقال الفتح
    page.mouse.click(10, 10)  # زاوية الخلفية خارج الطبقة
    choice_close_wait(page)
    means.append(choice_inspect(page)["focusId"])
    A(r, "كل الوسائل تُغلق وترجع التركيز للمشغّل", means == ["f02c-open-picker"] * 3, means)
    s = choice_inspect(page)
    A(r, "الاختيار السابق محفوظ بعد كل الإغلاقات", s["selected"] == {"value": "alpha", "label": "عينة أ"}, s["selected"])
    page.wait_for_timeout(400)
    A(r, "لا إعادة فتح تلقائية", choice_inspect(page)["layerOpen"] is False)
    A(r, "القراءات = فتح الاختيار الأول + 3 فتحات الإغلاق (الإغلاق بلا قراءة)", s["readCalls"] == 4, s["readCalls"])
    shot(page, "f02-10-closed-preserved.png")


def run_f02_11(page):
    r = row("F02-11", "إعادة قراءة بمعرف باقٍ وتسمية جديدة", "القيمة ثابتة والتسمية الداخلية/الخارجية تجددان حتى دون change")
    goto(page, CHOICE_PAGE)
    # قراءة أولى وتحديد beta
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='beta']")
    choice_close_wait(page)
    # تتبع أحداث change (حدث اختيار المستخدم وحده حتى الآن)
    page.evaluate("""() => {
      window.__change_events = 0;
      document.getElementById('f02c-picker').addEventListener('micro-picker:change', () => window.__change_events += 1); }""")
    # مصدر القراءة التالية: نفس beta بتسمية محدثة (تعديل fixture عبر أداة SIMULATION)
    page.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' },
      { value: 'beta', label: 'عينة ب — المحدثة' },
      { value: 'gamma', label: 'عينة ج' }]);""")
    choice_open(page)  # قراءة جديدة بمعرف جديد
    page.wait_for_timeout(80)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "beta باقٍ بالمعرف", s["selected"] and s["selected"]["value"] == "beta", s["selected"])
    A(r, "التسمية الجديدة داخلية وخارجية", "المحدثة" in s["pickerSummary"] and "المحدثة" in s["displayText"], (s["pickerSummary"], s["displayText"]))
    ev = page.evaluate("() => window.__change_events")
    A(r, "بلا change لازمة لتحديث التسمية (بقاء المعرف)", ev == 0, ev)
    shot(page, "f02-11-relabel-kept.png")


def run_f02_12(page):
    r = row("F02-12", "اختفاء الاختيار من المصدر — الرسالة الظاهرة والقناة الواحدة (R2-01)",
            "داخل الطبقة المفتوحة: رسالة الزوال ظاهرة فعليًا داخل النطاق (display/مستطيل/بلا قص) "
            "وهي القناة الوحيدة للحدث (نصها ليس في قناة القراءة ولا في الخارجية)؛ اللقطة وهي مفتوحة "
            "والرسالة مستقرة بعد توكيد الحالة؛ تحديث بيانات وحده لا يمسحها (بلا استعادة تلقائية) "
            "واختيار جديد يمسح سببها؛ "
            "خارج الطبقة: القناة الخارجية دون إعادة فتح؛ null في كل العروض؛ بلا اختيار تلقائي؛ "
            "وأن يزول الاختيار مع no-results البحثية معًا (R2-02)")
    goto(page, CHOICE_PAGE)
    # (أ) الطبقة مفتوحة: الرسالة الظاهرة داخل النطاق — اللقطة قبل الإغلاق
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='beta']")
    choice_close_wait(page)
    page.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' },
      { value: 'gamma', label: 'عينة ج' }]);""")
    choice_open(page)
    page.wait_for_timeout(80)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "الاختيار سقط: null في القيمة والعرض والملخص",
      s["selected"] is None and "لا شيء" in s["displayText"]
      and s["pickerSummary"] == "المحدد: لا شيء", s)
    dn = drop_note_measure(page)
    A(r, "الطبقة مفتوحة: رسالة الزوال ظاهرة فعليًا داخل النطاق (R2-01)",
      drop_note_visible_assertion(dn), dn)
    A(r, "قناة واحدة للحدث: نص الزوال ليس في قناة القراءة",
      not dn["inLive"], (dn["inLive"], s["liveText"]))
    note_in_inert = page.evaluate("""() => {
      const n = document.getElementById('f02c-selection-note');
      return { text: n.textContent, inInert: !!n.closest('[inert]') }; }""")
    A(r, "لا نص معالجة في القناة الخارجية الخاضعة لـinert أثناء الفتح",
      note_in_inert["inInert"] is True and note_in_inert["text"] == "", note_in_inert)
    sel = [o["selected"] for o in s["options"]]
    A(r, "بلا تحديد تلقائي لأول خيار", not any(sel), sel)
    # توكيد استقرار الرسالة الظاهرة قبل اللقطة (R2-04-4)
    dn2 = drop_note_measure(page)
    A(r, "الرسالة الظاهرة مستقرة قبل اللقطة (قياسان متطابقان)",
      dn2 == dn and drop_note_visible_assertion(dn2), dn2)
    shot(page, "f02-12-selection-dropped.png")  # الطبقة مفتوحة والرسالة ظاهرة
    # تحديث البيانات بعد الزوال: لا استعادة تلقائية (بلا اختيار تلقائي) —
    # الرسالة باقية ما دام سببها قائمًا (لا اختيار جديد بعد) (R2-01)
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'ready',
      items: [{ value: 'alpha', label: 'عينة أ' }, { value: 'beta', label: 'عينة ب' },
              { value: 'gamma', label: 'عينة ج' }] });""")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    dn3 = drop_note_measure(page)
    A(r, "تحديث البيانات بعد الزوال لا يعيد الاختيار تلقائيًا والرسالة باقية (سببها قائم)",
      s["selected"] is None and not any(o["selected"] for o in s["options"])
      and drop_note_visible_assertion(dn3), dn3)
    page.keyboard.press("Escape")
    choice_close_wait(page)
    shot(page, "f02-12-selection-dropped-closed.png")  # لقطة العرض المغلق مستقلة
    # (ب) الطبقة مغلقة أثناء وصول النتيجة: القناة الخارجية وبلا إعادة فتح
    page.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' },
      { value: 'beta', label: 'عينة ب' },
      { value: 'gamma', label: 'عينة ج' }]);""")
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='beta']")
    choice_close_wait(page)
    page.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' },
      { value: 'gamma', label: 'عينة ج' }]);""")
    choice_open(page)          # قراءة جديدة
    page.keyboard.press("Escape")  # إغلاق أثناء القراءة (لا إلغاء)
    choice_close_wait(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "النتيجة المقبولة أثناء الإغلاق تزامن العرض", s["selected"] is None and "لا شيء" in s["displayText"], s)
    A(r, "العرض مغلق: رسالة الزوال في القناة الخارجية", "لم يعد متاحًا" in s["selectionNote"], s["selectionNote"])
    A(r, "العرض مغلق: رسالة الطبقة مخفية (القناة الوحيدة للحدث المغلق)",
      s["dropNote"]["hiddenAttr"] is True and s["dropNote"]["text"] == "", s["dropNote"])
    A(r, "لا إعادة فتح تلقائية", s["layerOpen"] is False)
    # اختيار جديد يمسح سبب الرسالة (R2-01)
    choice_open(page)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    page.click(".m-picker__option[data-value='alpha']")
    choice_close_wait(page)
    s = choice_inspect(page)
    A(r, "اختيار جديد يمسح القناتين: سبب الرسالة زال",
      s["selected"]["value"] == "alpha" and s["selectionNote"] == ""
      and s["dropNote"]["hiddenAttr"] is True and s["dropNote"]["text"] == "", s["dropNote"])
    # (ج) اجتماع زوال الاختيار مع no-results البحثية (R2-02)
    page.evaluate("""() => window.F02Choice.setSource([
      { value: 'beta', label: 'عينة ب' }]);""")  # alpha المحدد سيزول
    choice_open(page)
    page.fill("[data-picker-search]", "zzz")  # أثناء loading
    page.wait_for_timeout(50)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    dn = drop_note_measure(page)
    A(r, "زوال الاختيار + no-results معًا: كل قناة تعلن معناها دون تكرار أو تطغى",
      s["selected"] is None and drop_note_visible_assertion(dn)
      and not dn["inLive"]
      and "لا نتائج مطابقة" in (s["liveText"] or "")
      and len([o for o in s["options"] if o["visibleRect"]]) == 0, (dn, s["liveText"]))
    shot(page, "f02-12-drop-no-results.png")
    page.keyboard.press("Escape")
    choice_close_wait(page)


def run_f02_13(page):
    r = row("F02-13", "قراءتان متداخلتان + لقطة fixture لكل قراءة (R1-05)",
            "الأقدم يُتجاهل كليًا؛ نتيجة كل Promise تخص مصدرها وreadId (تسوية الأحدث أولًا ثم الأقدم)؛ "
            "تسوية الحالي بلا reload")
    goto(page, CHOICE_PAGE)
    # (أ) فتح (قراءة 1) وإغلاق أثناء القراءة ثم فتح (قراءة 2)
    choice_open(page)
    page.keyboard.press("Escape")
    choice_close_wait(page)
    choice_open(page)
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "قراءتان معلقتان (1 و2)", s["readCalls"] == 2 and s["readSeq"] == 2, (s["readCalls"], s["readSeq"]))
    reset_reload_marker(page)
    # (ج) تجاهل الأقدم في الصفحة ثم تسوية الأحدث
    choice_settle(page, "oldest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "القديم تجاهل كليًا: لا حالة ولا رسالة ولا اختيار",
      s["staleIgnored"] == 1 and s["stateRow"] == "جارٍ القراءة…" and s["selected"] is None, s)
    A(r, "التركيز لم يتحرك بالقديم", s["focusId"] != "f02c-open-picker", s["focusId"])
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "الأحدث طُبق في الصفحة نفسها (بلا reload) والاختيار لا يزال null",
      len(s["options"]) == 3 and s["selected"] is None, s)
    assert_no_reload(page, r)
    # (ب-لاحق) لقطة البيانات لكل قراءة (R1-05): موصل مؤقت بعد انتهاء تسويات
    # الصفحة (أحداثه تعطل أزرار التسوية — فينزل بعد الحاجة إليها)
    snap = page.evaluate("""() => {
      const c = window.F02ChoiceSim.createConnector({ items: [{ value: 'old', label: 'Old' }] });
      const p1 = c.read({ readId: 101 });
      c.setSource([{ value: 'new', label: 'New' }]);
      const p2 = c.read({ readId: 102 });
      const out = { newFirst: null, oldLater: null };
      return c.settle(102) === true ? p2.then(r2 => {
        out.newFirst = r2;
        c.settle(101);
        return p1.then(r1 => { out.oldLater = r1; return out; });
      }) : Promise.reject(new Error('settle 102 failed')); }""")
    A(r, "R1-05: نتيجة القراءة الأحدث من مصدرها الجديد",
      snap["newFirst"] == {"readId": 102, "outcome": "ready",
                           "items": [{"value": "new", "label": "New"}]}, snap["newFirst"])
    A(r, "R1-05: نتيجة القراءة الأقدم من مصدرها القديم رغم تغيير fixture",
      snap["oldLater"] == {"readId": 101, "outcome": "ready",
                            "items": [{"value": "old", "label": "Old"}]}, snap["oldLater"])
    # (ج-2) F02-R2-04(3): تعديل خصائص الكائنات المشتركة بعد بدء الدعوة
    # (label وvalue معًا) في مصدر الإنشاء ومصدر setSource — لا استبدال مصفوفة فقط
    snap2 = page.evaluate("""() => {
      const src = [{ value: 'old', label: 'قبل القراءة' }];
      const c = window.F02ChoiceSim.createConnector({ items: src });
      const p1 = c.read({ readId: 201 });
      src[0].label = 'تعديل بعد بدء الطلب';
      src[0].value = 'معدل';
      const src2 = [{ value: 'new', label: 'المصدر الجديد' }];
      c.setSource(src2);
      const p2 = c.read({ readId: 202 });
      src2[0].label = 'تعديل المصدر بعد بدء الطلب';
      src2[0].value = 'معدل-جديد';
      const out = { first: null, second: null };
      return c.settleLatest() === true ? p2.then(r2 => {
        out.second = r2;
        c.settle(201);
        return p1.then(r1 => { out.first = r1; return out; });
      }) : Promise.reject(new Error('settle failed')); }""")
    A(r, "R2-03: تعديل label وvalue لكائن مصدر الإنشاء بعد بدء الطلب لا يمس نتيجته",
      snap2["first"] == {"readId": 201, "outcome": "ready",
                         "items": [{"value": "old", "label": "قبل القراءة"}]}, snap2["first"])
    A(r, "R2-03: تعديل label وvalue لكائن مصدر setSource بعد بدء الطلب لا يمس نتيجته",
      snap2["second"] == {"readId": 202, "outcome": "ready",
                          "items": [{"value": "new", "label": "المصدر الجديد"}]}, snap2["second"])
    # (د) الرد القديم عبر مسار المستهلك أيضًا
    choice_stale(page)
    page.wait_for_timeout(60)
    s = choice_inspect(page)
    A(r, "رد بمعرف 0 عبر مسار المستهلك يُتجاهل", s["staleIgnored"] == 2, s["staleIgnored"])
    shot(page, "f02-13-overlapping-reads.png")


def run_f02_14(page):
    r = row("F02-14", "تحديث بيانات والتركيز داخل المنتقي + لوحة المفاتيح (R1-03)",
            "خيار مركّز → البحث الثابت قبل استبدال العقدة؛ زر retry المزول → البحث؛ "
            "البحث الثابت وزر رأس الطبقة لا تُسرق منهما؛ بلا عنصر نشط مخفي؛ أسهم/Home/End وroving سليمة")
    goto(page, CHOICE_PAGE)
    choice_open(page)
    choice_settle(page, "latest")  # ready
    page.wait_for_timeout(80)
    # (أ) المستخدم على خيار مركّز → تحديث بيانات عبر مسار المستهلك (SIMULATION §6)
    page.evaluate("""() => {
      const g = document.querySelector(".m-picker__option[data-value='gamma']");
      g.focus(); window.__was_gamma = document.activeElement === g; }""")
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'ready',
      items: [{ value: 'alpha', label: 'عينة أ (جديدة)' },
              { value: 'beta', label: 'عينة ب (جديدة)' },
              { value: 'gamma', label: 'عينة ج (جديدة)' }] });""")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "كان التركيز على خيار قبل التحديث", page.evaluate("() => window.__was_gamma") is True)
    A(r, "التركيز انتقل للبحث الثابت قبل استبدال العقدة", s["focusId"] == "f02c-picker-search", s["focusId"])
    A(r, "الخيارات استُبدلت فعليًا", all("(جديدة)" in o["label"] for o in s["options"]), [o["label"] for o in s["options"]])
    A(r, "لا عنصر نشط مخفي بعد الاستبدال",
      page.evaluate("() => !document.activeElement.hidden && document.getElementById('f02c-picker-layer').contains(document.activeElement)"))
    # (ب) عنصر ثابت داخل المنتقي: التركيز على البحث نفسه → لا نقل
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'ready',
      items: [{ value: 'alpha', label: 'عينة أ (أحدث)' },
              { value: 'beta', label: 'عينة ب (أحدث)' },
              { value: 'gamma', label: 'عينة ج (أحدث)' }] });""")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "R1-03: تركيز المستخدم على البحث الثابت لا يُسرق", s["focusId"] == "f02c-picker-search", s["focusId"])
    # (ج) عنصر ثابت خارج المنتقي: زر رأس الطبقة → لا سرقة
    page.evaluate("() => document.getElementById('f02c-layer-close').focus()")
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'ready',
      items: [{ value: 'alpha', label: 'عينة أ' }, { value: 'beta', label: 'عينة ب' }, { value: 'gamma', label: 'عينة ج' }] });""")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "R1-03: تركيز المستخدم على زر رأس الطبقة لا يُسرق", s["focusId"] == "f02c-layer-close", s["focusId"])
    A(r, "البيانات تجددت رغم عدم سرقة التركيز", all("(أحدث)" not in o["label"] for o in s["options"]), None)
    # (د) صف الخطأ المزول: التركيز على retry → البحث الثابت قبل استبدال الصف
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'error', items: [] });""")
    page.wait_for_timeout(80)
    page.evaluate("() => document.querySelector('[data-picker-retry]').focus()")
    page.evaluate("""() => window.F02Choice.deliverTestReadResponse({
      readId: window.F02Choice.inspect().readSeq, outcome: 'error', items: [] });""")
    page.wait_for_timeout(80)
    s = choice_inspect(page)
    A(r, "R1-03: تركيز على retry المزول → البحث الثابت (لا body)",
      s["focusId"] == "f02c-picker-search" and s["stateRow"] and "إعادة المحاولة" in s["stateRow"], s["focusId"])
    # (هـ) لوحة المفاتيح: أسهم RTL/Home/End/roving — عبر retry قراءة جديدة
    choice_arm(page, "ready")
    page.click("[data-picker-retry]")
    page.wait_for_timeout(80)
    choice_settle(page, "latest")
    page.wait_for_timeout(80)
    kb = page.evaluate("""() => {
      const list = document.querySelector('[data-picker-list]');
      const res = {};
      document.querySelector('[data-picker-search]').focus();
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      res.home = document.activeElement.getAttribute('data-value');
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      res.end = document.activeElement.getAttribute('data-value');
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      res.next_rtl = document.activeElement.getAttribute('data-value');
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      res.prev_rtl = document.activeElement.getAttribute('data-value');
      res.tab_stops = [...document.querySelectorAll('.m-picker__option')].filter(o => !o.hidden && o.tabIndex === 0).length;
      return res; }""")
    A(r, "Home لأول خيار وEnd لآخره", kb["home"] == "alpha" and kb["end"] == "gamma", kb)
    A(r, "أسهم RTL: يسار=التالي ويمين=السابق", kb["next_rtl"] == "alpha" and kb["prev_rtl"] == "gamma", kb)
    A(r, "roving: نقطة تبويب واحدة", kb["tab_stops"] == 1, kb["tab_stops"])
    shot(page, "f02-14-picker-focus.png")


def run_f02_15(page, browser):
    r = row("F02-15", "fixtures بديلة للاختيار والمفتاح + بقاء البذرة بعد القراءة (R1-01)",
            "قيم البداية من مصدر واحد؛ beta تظهر محددة داخل المنتقي وخارجه عند الإقلاع، "
            "تبقى بعد أول ready وتسميته المحدثة وبعد إعادة الفتح؛ معرف غائب يُمسح بأول تأكيد برسالة الزوال؛ "
            "بلا أحداث/تحديثات مبكرة")
    # ---------- اختيار: PICKER_SELECTED_INIT = beta ----------
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    watch(pg)
    src = (ROOT / "previews" / UX_DIRNAME / "choice-lifecycle" / "example.js").read_text(encoding="utf-8")
    patched = src.replace("var PICKER_SELECTED_INIT = null;",
                          "var PICKER_SELECTED_INIT = { value: 'beta', label: 'عينة ب' };")
    assert patched != src, "seed needle missing"
    pg.route("**/example.js", lambda route: route.fulfill(status=200, content_type="text/javascript", body=patched))
    pg.goto(f"{BASE}/{CHOICE_PAGE}", wait_until="networkidle")
    pg.evaluate("() => document.fonts.ready")
    s = choice_inspect(pg)
    A(r, "اختيار beta ظاهر عند الإقلاع (قيمة/عرض/ملخص داخلي)",
      s["selected"] == {"value": "beta", "label": "عينة ب"} and "عينة ب" in s["displayText"]
      and s["pickerSummary"] == "المحدد: عينة ب", s)
    A(r, "بلا قراءات مبكرة عند الإقلاع", s["readCalls"] == 0, s["readCalls"])
    pg.unroute("**/example.js")
    # أول ready صحيح يبقي البذرة محددة داخل المنتقي وخارجه
    choice_open(pg)
    s = choice_inspect(pg)
    A(r, "الفتح يقرأ ولا يزيل البذرة قبل النتيجة", s["readCalls"] == 1 and s["selected"]["value"] == "beta", s)
    choice_settle(pg, "latest")
    pg.wait_for_timeout(80)
    s = choice_inspect(pg)
    in_picker = pg.evaluate("""() => {
      const o = document.querySelector(".m-picker__option[data-value='beta']");
      return { ariaSelected: o && o.getAttribute('aria-selected') === 'true',
               summary: document.querySelector('[data-picker-summary]').textContent }; }""")
    A(r, "R1-01: أول ready يبقي beta محددة داخل المنتقي (aria-selected + ملخص)",
      in_picker["ariaSelected"] is True and in_picker["summary"] == "المحدد: عينة ب", in_picker)
    A(r, "R1-01: البذرة باقية خارج المنتقي بلا رسالة زوال",
      s["selected"] == {"value": "beta", "label": "عينة ب"} and s["selectionNote"] == "", s)
    pg.keyboard.press("Escape")
    choice_close_wait(pg)
    # تسمية محدثة + إعادة فتح: بقاء المعرف مع التسمية الجديدة
    pg.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' },
      { value: 'beta', label: 'عينة ب — المحدثة' },
      { value: 'gamma', label: 'عينة ج' }]);""")
    choice_open(pg)
    pg.wait_for_timeout(80)
    choice_settle(pg, "latest")
    pg.wait_for_timeout(80)
    s = choice_inspect(pg)
    A(r, "إعادة الفتح: beta باقية بالمعرف وبالتسمية المحدثة",
      s["selected"] == {"value": "beta", "label": "عينة ب — المحدثة"}
      and "المحدثة" in s["pickerSummary"] and "المحدثة" in s["displayText"], s)
    pg.keyboard.press("Escape")
    choice_close_wait(pg)
    ctx.close()
    # ---------- معرف البداية غير موجود في المصدر ----------
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    watch(pg)
    patched_missing = src.replace("var PICKER_SELECTED_INIT = null;",
                                  "var PICKER_SELECTED_INIT = { value: 'ghost', label: 'غير موجودة' };")
    pg.route("**/example.js", lambda route: route.fulfill(status=200, content_type="text/javascript", body=patched_missing))
    pg.goto(f"{BASE}/{CHOICE_PAGE}", wait_until="networkidle")
    pg.evaluate("() => document.fonts.ready")
    s = choice_inspect(pg)
    A(r, "معرف غائب: يظهر في القيمة عند الإقلاع (لم تؤكد قراءة بعد)", s["selected"]["value"] == "ghost", s["selected"])
    A(r, "معرف غائب: لا بذرة داخل المنتقي قبل القراءة", s["pickerSummary"] == "المحدد: لا شيء", s["pickerSummary"])
    choice_open(pg)
    choice_settle(pg, "latest")
    pg.wait_for_timeout(80)
    s = choice_inspect(pg)
    dn = drop_note_measure(pg)
    A(r, "معرف غائب: أول ready يمسحه برسالة الزوال الظاهرة داخل الطبقة (R2-01)",
      s["selected"] is None and drop_note_visible_assertion(dn) and not dn["inLive"],
      (s["selected"], dn))
    ctx.close()
    # ---------- مفتاح: SWITCH_CONFIRMED_INIT = true ----------
    ctx2 = browser.new_context(viewport={"width": 390, "height": 844})
    pg2 = ctx2.new_page()
    watch(pg2)
    src2 = (ROOT / "previews" / UX_DIRNAME / "switch-lifecycle" / "example.js").read_text(encoding="utf-8")
    patched2 = src2.replace("var SWITCH_CONFIRMED_INIT = false;", "var SWITCH_CONFIRMED_INIT = true;")
    assert patched2 != src2, "switch seed needle missing"
    pg2.route("**/example.js", lambda route: route.fulfill(status=200, content_type="text/javascript", body=patched2))
    pg2.goto(f"{BASE}/{SWITCH_PAGE}", wait_until="networkidle")
    pg2.evaluate("() => document.fonts.ready")
    s2 = switch_inspect(pg2)
    A(r, "مفتاح true عند الإقلاع", s2["confirmed"] is True and s2["checked"] is True and s2["op"] == "idle", s2)
    A(r, "بلا تحديثات مبكرة", s2["updateCalls"] == 0 and s2["message"] is None, (s2["updateCalls"], s2["message"]))
    ctx2.close()


# ---------- المسارات: عينة الفلاتر ----------

def run_f02_16(page):
    r = row("F02-16", "تعديل draft فلاتر", "applied/القائمة/العدّاد لا تتغير قبل التطبيق؛ الملخص الجاري فقط يتغير")
    goto(page, FILTER_PAGE)
    filter_listen_applied(page)
    filter_open(page)
    before = filter_inspect(page)
    page.fill("#f02f-q", "ج")
    page.wait_for_timeout(50)
    page.click("label:has(> [data-filter-key='active'])")
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "applied لم يتغير", s["applied"] == before["applied"] == {"q": "", "active": False, "marked": False}, s["applied"])
    A(r, "القائمة والعدّاد ثابتان", s["shownIds"] == ["a", "b", "c"] and s["badge"]["hiddenAttr"] is True, (s["shownIds"], s["badge"]))
    A(r, "الملخص يتبع الجاري", s["summaryText"] == "الجاري: البحث، النشطة", s["summaryText"])
    A(r, "لا حدث تطبيق", page.evaluate("() => window.__f02_applied_events") == 0)
    shot(page, "f02-16-filter-draft.png")


def run_f02_17(page):
    r = row("F02-17", "إلغاء الفلاتر بكل الوسائل ثم فتح", "applied/القائمة/العدّاد محفوظة؛ draft يُستعاد من applied؛ لا apply من الإغلاق")
    goto(page, FILTER_PAGE)
    filter_listen_applied(page)
    # تطبيق شرطين
    filter_open(page)
    page.fill("#f02f-q", "ج")
    page.click("label:has(> [data-filter-key='marked'])")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    base_state = filter_inspect(page)
    A(r, "أساس: شرطان مطبقان", base_state["badge"]["text"] == "2" and base_state["shownIds"] == ["c"], base_state)
    ev_before = page.evaluate("() => window.__f02_applied_events")
    means = []
    for how in ("cancel", "close-btn", "escape", "backdrop"):
        filter_open(page)
        page.wait_for_timeout(40)
        if how == "cancel":
            page.click("[data-filter-cancel]")
        elif how == "close-btn":
            page.click("[data-layer-close]")
        elif how == "escape":
            page.keyboard.press("Escape")
        else:
            page.wait_for_timeout(100)
            page.mouse.click(10, 10)
        filter_close_wait(page)
        s = filter_inspect(page)
        means.append((how, s["applied"], s["badge"]["text"]))
    A(r, "كل الوسائل حفظت applied والعدّاد",
      all(x[1] == {"q": "ج", "active": False, "marked": True} and x[2] == "2" for x in means), means)
    A(r, "لا أحداث تطبيق من الإغلاق", page.evaluate("() => window.__f02_applied_events") == ev_before)
    # draft يُستعاد من applied عند الفتح
    filter_open(page)
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "الفتح يعيد draft من applied", s["draft"] == {"q": "ج", "active": False, "marked": True}, s["draft"])
    A(r, "تركيز داخل الطبقة عند الفتح", page.evaluate("() => document.getElementById('f02f-filter-layer').contains(document.activeElement)"))
    page.keyboard.press("Escape")
    filter_close_wait(page)
    shot(page, "f02-17-filter-cancel.png")


def run_f02_18(page):
    r = row("F02-18", "تطبيق q+checkbox ثم إعادة فتح", "حدث واحد بنسخة القيم؛ AND صحيح؛ العدّاد شروط لا نتائج؛ draft=applied")
    goto(page, FILTER_PAGE)
    filter_listen_applied(page)
    filter_open(page)
    page.fill("#f02f-q", "  ج  ")  # مسافات محيطة: تُقص في المطبق (عقد B07)
    page.click("label:has(> [data-filter-key='active'])")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    ev = page.evaluate("() => ({ n: window.__f02_applied_events, d: window.__f02_applied_detail })")
    A(r, "حدث واحد بقيم مقصوصة", ev["n"] == 1 and ev["d"]["applied"]["q"] == "ج", ev)
    A(r, "AND: العنصر المطابق للشرطين وحده", s["shownIds"] == ["c"], s["shownIds"])
    A(r, "العدّاد شروط (2) لا نتائج (1)", s["badge"]["text"] == "2" and s["resultsText"].endswith("1"), (s["badge"], s["resultsText"]))
    filter_open(page)
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "draft يطابق applied بعد الفتح", s["draft"] == {"q": "ج", "active": True, "marked": False}, s["draft"])
    page.keyboard.press("Escape")
    filter_close_wait(page)
    shot(page, "f02-18-filter-applied.png")


def run_f02_19(page):
    r = row("F02-19", "applied → مسح draft → إلغاء", "المطبّق والنتائج محفوظة؛ إعادة الفتح تعيد المطبّق إلى draft")
    goto(page, FILTER_PAGE)
    filter_open(page)
    page.fill("#f02f-q", "عينة")
    page.click("label:has(> [data-filter-key='active'])")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "أساس: شرطان مطبقان", s["badge"]["text"] == "2" and s["shownIds"] == ["a", "c"], (s["badge"], s["shownIds"]))
    filter_open(page)
    page.click("[data-filter-clear]")
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "مسح draft: الجاري صفر والملخص آمن", s["draft"] == {"q": "", "active": False, "marked": False} and s["summaryText"] == "الجاري: لا فلاتر", (s["draft"], s["summaryText"]))
    page.click("[data-filter-cancel]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "الإلغاء حفظ المطبّق", s["badge"]["text"] == "2" and s["shownIds"] == ["a", "c"], (s["badge"], s["shownIds"]))
    filter_open(page)
    page.wait_for_timeout(50)
    s = filter_inspect(page)
    A(r, "إعادة الفتح تعيد المطبّق للـdraft", s["draft"] == {"q": "عينة", "active": True, "marked": False}, s["draft"])
    page.keyboard.press("Escape")
    filter_close_wait(page)
    shot(page, "f02-19-filter-keep.png")


def run_f02_20(page):
    r = row("F02-20", "applied → مسح → تطبيق", "3 نتائج؛ count=0 والعدّاد مخفي فعليًا بلا وصول؛ لا «تم الحفظ»")
    goto(page, FILTER_PAGE)
    filter_listen_applied(page)
    filter_open(page)
    page.click("label:has(> [data-filter-key='active'])")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    filter_open(page)
    page.click("[data-filter-clear]")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    ev = page.evaluate("() => window.__f02_applied_detail")
    A(r, "تطبيق صفر شروط: count=0 وقيم فارغة", ev["count"] == 0 and ev["applied"] == {"q": "", "active": False, "marked": False}, ev)
    A(r, "3 نتائج", s["shownIds"] == ["a", "b", "c"] and s["resultsText"].endswith("3"), s["resultsText"])
    v = page.evaluate("""() => {
      const b = document.getElementById('f02f-filter-count');
      const r0 = b.getBoundingClientRect();
      return { display: getComputedStyle(b).display, w: Math.round(r0.width), h: Math.round(r0.height),
               focusable: (b.focus(), document.activeElement === b) }; }""")
    A(r, "العدّاد مخفي فعليًا: display:none ومستطيل 0 وبلا وصول تركيز",
      v["display"] == "none" and v["w"] == 0 and v["h"] == 0 and v["focusable"] is False, v)
    body_text = page.evaluate("() => document.body.innerText")
    A(r, "لا «تم الحفظ» إطلاقًا", "تم الحفظ" not in body_text, None)
    shot(page, "f02-20-filter-zero.png")


def run_f02_21(page):
    r = row("F02-21", "no-results مع تعديل الفلاتر", "النص والفعل ظاهران؛ الفتح يعيد التصحيح دون فقد applied غير مقصود")
    goto(page, FILTER_PAGE)
    filter_open(page)
    page.fill("#f02f-q", "zzz")
    page.click("label:has(> [data-filter-key='active'])")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "no-results ظاهرة", s["noResultsVisible"] is True and s["shownIds"] == [], s)
    txt = page.evaluate("() => document.getElementById('f02f-no-results').innerText")
    A(r, "نص موجز بلا تقنيات (ليست خطأ قراءة)", "لا نتائج" in txt and "فشل" not in txt and "خطأ" not in txt, txt)
    shot(page, "f02-21-filter-no-results.png")
    page.click("#f02f-edit-filters")
    page.wait_for_function("() => window.F02Filter.inspect().layerOpen === true", timeout=3000)
    s = filter_inspect(page)
    A(r, "الفتح يعيد draft المطبق للتصحيح", s["draft"] == {"q": "zzz", "active": True, "marked": False}, s["draft"])
    page.fill("#f02f-q", "")
    page.click("label:has(> [data-filter-key='active'])")  # إزالة الشرط
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "التصحيح يعيد النتائج", s["shownIds"] == ["a", "b", "c"] and s["noResultsVisible"] is False, s["shownIds"])


def run_f02_22(page):
    r = row("F02-22", "بحث مختلط/مسافات/أحرف شبيهة بـHTML", "قص أطراف فقط؛ مطابقة معلنة؛ نص حرفي؛ لا حقن أو أسماء مفاتيح في الواجهة")
    goto(page, FILTER_PAGE)
    filter_open(page)
    page.fill("#f02f-q", "  <b>عينة</b>  ")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "القيمة المطبقة مشذبة الأطراف فقط", s["applied"]["q"] == "<b>عينة</b>", s["applied"])
    A(r, "مطابقة حرفية: بلا نتائج للنص الكامل", s["shownIds"] == [] and s["noResultsVisible"] is True, s["shownIds"])
    filter_open(page)
    page.fill("#f02f-q", "<b>")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "احتواء حرفي: <b> لا يطابق شيء", s["shownIds"] == [], s["shownIds"])
    rows_html = page.evaluate("() => [...document.querySelectorAll('#f02f-list .f02f-row__label')].map(e => e.innerHTML)")
    A(r, "لا حقن: تسميات القائمة نصوص مقروبة", all("<b>" not in x for x in rows_html), rows_html)
    filter_open(page)
    page.fill("#f02f-q", "عينة ب")
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "مطابقة بالاحتواء المعلنة تعمل", s["shownIds"] == ["b"], s["shownIds"])
    ui_text = page.evaluate("() => document.body.innerText")
    A(r, "لا أسماء مفاتيح داخلية في الواجهة", all(k not in ui_text for k in ("active", "marked", "q")), None)
    shot(page, "f02-22-filter-literal.png")


# ---------- المسارات: عينة المفتاح ----------

def run_f02_23(page):
    r = row("F02-23", "idle→pending مع نقر/Space متكرر", "تحديث واحد ونسخة ثابتة؛ confirmed القديم؛ checked المقصود؛ حجب التكرار وتركيز صالح")
    goto(page, SWITCH_PAGE)
    switch_arm(page, "update", "saved")  # السيناريو للدعوة التالية
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    s = switch_inspect(page)
    A(r, "تحديث واحد بمعرف 1 ونسخة مقصودة", s["updateCalls"] == 1 and s["attemptId"] == 1 and s["submitted"] == {"attemptId": 1, "value": True}, s["submitted"])
    A(r, "confirmed لم يتغير وchecked المقصودة", s["confirmed"] is False and s["checked"] is True, s)
    A(r, "التعطيل الفعلي + data-pending", s["inputDisabled"] is True and s["pendingAttr"] == "true", s)
    A(r, "التركيز انتقل للوصف قبل التعطيل (لا BODY ولا معطل)", s["focusId"] == "f02s-note", s["focusId"])
    # مؤشر خام على التسمية المعطلة: لا تحديث ثانٍ
    box = page.locator("label:has(#f02s-switch-input)").bounding_box()
    page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.wait_for_timeout(60)
    A(r, "نقرة خام أثناء pending: لا تحديث ثانٍ", switch_inspect(page)["updateCalls"] == 1)
    shot(page, "f02-23-switch-pending.png")


def run_f02_24(page):
    r = row("F02-24", "pending→saved ثم تبديل معاكس", "تزامن confirmed؛ النجاح بعد النتيجة فقط؛ القديم يزال؛ المحاولة الثانية مستقلة")
    goto(page, SWITCH_PAGE)
    switch_arm(page, "update", "saved")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    focus_before = switch_inspect(page)["focusId"]
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "saved: confirmed=1 وchecked متزامنة", s["confirmed"] is True and s["checked"] is True and s["inputDisabled"] is False, s)
    A(r, "رسالة النجاح بعد الحسم فقط", s["message"]["variant"] == "success" and "تم تحديث الإعداد" in s["message"]["title"], s["message"])
    A(r, "الحسم لا يحرك التركيز", s["focusId"] == focus_before, (s["focusId"], focus_before))
    # تبديل معاكس: القديم يزال عند بدء محاولة أخرى
    switch_arm(page, "update", "saved")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    s = switch_inspect(page)
    A(r, "نتيجة قديمة (نجاح) زالت عند محاولة جديدة", s["message"]["variant"] == "info" and "جارٍ" in s["message"]["title"], s["message"])
    A(r, "المحاولة الثانية مستقلة", s["attemptId"] == 2 and s["submitted"] == {"attemptId": 2, "value": False}, s["submitted"])
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "الثانية حُسمت: confirmed=0", s["confirmed"] is False and s["checked"] is False, s)
    shot(page, "f02-24-switch-saved.png")


def run_f02_25(page):
    r = row("F02-25", "pending→not-saved ثم إعادة المحاولة", "استرجاع confirmed ونص ثابت؛ محاولة جديدة ممكنة بلا reload")
    goto(page, SWITCH_PAGE)
    switch_arm(page, "update", "not-saved")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    reset_reload_marker(page)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'not-saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "confirmed لم يتغير وchecked استُرجعت", s["confirmed"] is False and s["checked"] is False and s["inputDisabled"] is False, s)
    A(r, "رسالة الرفض ثابتة", s["message"]["variant"] == "error" and "لم يُحدَّث الإعداد" in s["message"]["title"], s["message"])
    # اللقطة وهي مستقرة في not-saved نفسها (R1-08(7): إثبات الحالة قبل التقاطها)
    s_ns = switch_inspect(page)
    A(r, "الحالة المقصودة not-saved مثبتة قبل اللقطة",
      s_ns["op"] == "not-saved" and s_ns["message"]["variant"] == "error", s_ns["op"])
    shot(page, "f02-25-switch-not-saved.png")
    # إعادة محاولة فورية بلا reload
    switch_arm(page, "update", "saved")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "إعادة المحاولة نجحت بلا reload", s["confirmed"] is True and s["attemptId"] == 2, s)
    assert_no_reload(page, r)
    shot(page, "f02-25-switch-retry-saved.png")


def run_f02_26(page):
    r = row("F02-26", "update unknown ورفض Promise", "لا rollback ولا ادعاء رفض؛ لا تحديث جديد؛ زر التحقق ظاهر فعليًا والسبب واضح")
    goto(page, SWITCH_PAGE)
    # (أ) outcome unknown
    switch_arm(page, "update", "unknown")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    switch_settle(page, "update")
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    s = switch_inspect(page)
    A(r, "unknown: لا rollback (checked المقصودة باقية) ولا ادعاء",
      s["checked"] is True and s["confirmed"] is False and s["inputDisabled"] is True, s)
    v = vis(page, "#f02s-check")
    A(r, "زر التحقق ظاهر فعليًا (display/مستطيل/وصول)", v["display"] != "none" and v["w"] > 0 and v["focusable"] is True, v)
    A(r, "سبب الحجب واضح", s["message"]["variant"] == "warning" and "تعذر تأكيد التحديث" in s["message"]["title"], s["message"])
    calls = s["updateCalls"]
    # محاولة تبديل أثناء unknown بمؤشر خام على التسمية المعطلة: مرفوضة بلا تحديث جديد
    raw_click(page, "label:has(#f02s-switch-input)")
    page.wait_for_timeout(80)
    s = switch_inspect(page)
    A(r, "لا تحديث جديد أثناء unknown", s["updateCalls"] == calls, s["updateCalls"])
    shot(page, "f02-26-switch-unknown.png")
    # (ب) رفض Promise لتحديث جديد: نتيجة مجهولة بلا rollback ولا ادعاء رفض
    goto(page, SWITCH_PAGE)
    switch_arm(page, "update", "reject")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    s = switch_inspect(page)
    A(r, "رفض update: unknown بلا rollback (checked المقصودة باقية) وبلا ادعاء",
      s["checked"] is True and s["confirmed"] is False and s["inputDisabled"] is True
      and s["updateCalls"] == 1, s)
    v = vis(page, "#f02s-check")
    A(r, "رفض update: زر التحقق ظاهر فعليًا", v["display"] != "none" and v["w"] > 0 and v["focusable"] is True, v)
    # (ج) رفض Promise


def run_f02_27(page):
    r = row("F02-27", "unknown→checking متكرر→saved/not-saved/unknown صريح/رفض (R1-08(5))",
            "check واحد لكل دورة لنفس attemptId؛ update ثابت؛ حسم صحيح وتركيز قبل إخفاء الزر "
            "وفقط إن كان التركيز عليه؛ رفض check يعيد unknown؛ check outcome=unknown صريح يُنفذ فعلًا؛ "
            "تركيز المستخدم في مكان آخر لا يُسرق عند الحسم")
    goto(page, SWITCH_PAGE)
    switch_arm(page, "update", "unknown")
    switch_toggle(page)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    attempt = switch_inspect(page)["attemptId"]
    updates = switch_inspect(page)["updateCalls"]
    # دورة 1: check saved — وتركيز المستخدم ينتقل لموضع آخر أثناء checking
    switch_arm(page, "check", "saved")
    page.click("#f02s-check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'checking'", timeout=3000)
    page.keyboard.press("Enter")  # المستخدم الحقيقي أثناء busy: المؤشر محجوب (عقد B01)
    page.wait_for_timeout(60)
    s = switch_inspect(page)
    A(r, "تكرار تفعيل أثناء checking: لا check ثانٍ", s["checkCalls"] == 1 and s["updateCalls"] == updates, s)
    A(r, "busy على زر التحقق فقط", s["checkBusy"] is True, s)
    s_chk = switch_inspect(page)
    A(r, "حالة checking مثبتة قبل اللقطة", s_chk["op"] == "checking", s_chk["op"])
    shot(page, "f02-27-switch-checking.png")
    # المستخدم في موضع آخر (وصف الانتظار) — الحسم لا يسرق تركيزه
    page.evaluate("() => document.getElementById('f02s-note').focus()")
    switch_settle(page, "check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "R1-08(5): الحسم مع المستخدم في مكان آخر: لا سرقة تركيز",
      s["focusId"] == "f02s-note", s["focusId"])
    A(r, "حسم saved على قيمة إرسال المحاولة", s["confirmed"] is True and s["attemptId"] == attempt, s)
    # دورة 2: تبديل → unknown → check not-saved (التركيز على زر التحقق → المفتاح قبل الإخفاء)
    switch_arm(page, "update", "unknown")
    switch_toggle(page)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    attempt2 = switch_inspect(page)["attemptId"]
    switch_arm(page, "check", "not-saved")
    page.click("#f02s-check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'checking'", timeout=3000)
    switch_settle(page, "check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'not-saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "حسم not-saved: confirmed بقي وchecked استُرجعت", s["confirmed"] is True and s["checked"] is True and s["checkVisible"] is False, s)
    A(r, "التركيز كان على زر التحقق عند الحسم → المفتاح قبل إخفاء الزر",
      s["focusId"] == "f02s-switch-input", s["focusId"])
    # دورة 3: رفض check يبقي مجهولة ويعيد التحقق بلا إرسال تلقائي
    switch_arm(page, "update", "reject")
    switch_toggle(page)  # من not-saved: تبديل حر (True) → pending → رفض → unknown
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    updates = switch_inspect(page)["updateCalls"]
    switch_arm(page, "check", "reject")
    page.click("#f02s-check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'checking'", timeout=3000)
    switch_settle(page, "check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    s = switch_inspect(page)
    A(r, "رفض check: عودة unknown والتحقق متاح مجددًا", s["checkVisible"] is True and s["updateCalls"] == updates, s)
    A(r, "رفض check: بلا إرسال تلقائي ثانٍ", s["checkCalls"] == 3, s["checkCalls"])
    # دورة 4: check بنتيجة unknown صريحة (عنوان الدورة مذكور في التجربة — تُنفذ فعلًا)
    switch_arm(page, "check", "unknown")
    calls_before = switch_inspect(page)["checkCalls"]
    page.click("#f02s-check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'checking'", timeout=3000)
    switch_settle(page, "check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    s = switch_inspect(page)
    A(r, "check unknown صريح: عودة unknown وزر التحقق متاح",
      s["op"] == "unknown" and s["checkVisible"] is True and s["checkCalls"] == calls_before + 1, s)
    A(r, "check unknown صريح: بلا rollback وبلا تحديث جديد",
      s["confirmed"] is True and s["updateCalls"] == updates, s)
    shot(page, "f02-27-switch-check.png")


def run_f02_28(page):
    r = row("F02-28", "رد قديم update/check ثم تسوية الحالي", "لا أثر للقديم في قيمة/رسالة/تركيز؛ الحالي يُحسم في الصفحة نفسها بلا طلب بديل")
    goto(page, SWITCH_PAGE)
    # رد قديم أثناء معلونية update
    switch_arm(page, "update", "saved")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    s = switch_inspect(page)
    focus_before = s["focusId"]
    msg_before = s["message"]["title"]
    switch_stale(page, "update")  # معرف 0 عبر مسار المستهلك
    page.wait_for_timeout(60)
    s = switch_inspect(page)
    A(r, "القديم: لا قيمة/رسالة/تركيز", s["staleIgnored"] == 1 and s["op"] == "pending" and s["message"]["title"] == msg_before and s["focusId"] == focus_before, s)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "الحالي حُسم بعده في الصفحة نفسها", s["confirmed"] is True and s["staleIgnored"] == 1, s)
    assert_no_reload(page, r)
    # رد قديم check أثناء معلونية التحقق
    switch_arm(page, "update", "unknown")
    switch_toggle(page)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
    switch_arm(page, "check", "not-saved")
    page.click("#f02s-check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'checking'", timeout=3000)
    msg_before = switch_inspect(page)["message"]["title"]
    switch_stale(page, "check")
    page.wait_for_timeout(60)
    s = switch_inspect(page)
    A(r, "رد تحقق قديم: لا تغيير أثناء checking", s["staleIgnored"] == 2 and s["op"] == "checking" and s["message"]["title"] == msg_before, s)
    switch_settle(page, "check")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'not-saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "التحقق الحالي حُسم بعده", s["confirmed"] is True and s["checked"] is True and s["staleIgnored"] == 2, s)
    shot(page, "f02-28-switch-stale.png")


def run_f02_29(page):
    r = row("F02-29", "الرسائل وقناة واحدة وإنهاء pending",
            "قناة واحدة لكل حدث؛ لا نص تقني ولا toast؛ false قبل أي pending (متاح ومعطل أصلًا — R2-04-5) "
            "بلا أثر، وfalse المتكرر والمعطل الأصلي محفوظان، والدورة القائمة سليمة")
    goto(page, SWITCH_PAGE)
    # دورة كاملة تختبر الرسائل الباقية
    switch_arm(page, "update", "not-saved")
    switch_toggle(page)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'not-saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "رسالة الرفض باقية (لا toast)", s["noteVisible"] is True and "حاول مجددًا" in s["message"]["text"], s["message"])
    A(r, "قناة إعلان واحدة في الصفحة (role=status للعينة وحدها)",
      page.evaluate("() => [...document.querySelectorAll('[role=status]')].length") == 1)
    A(r, "لا نص تقني/مفاتيح في الرسالة",
      all(k not in (s["message"]["title"] + s["message"]["text"]) for k in ("saved", "unknown", "pending", "attemptId")), s["message"])
    A(r, "وصف الانتظار قابل للتركيز برمجيًا ويبقى بعد الحسم", s["noteFocusable"] is True and s["noteVisible"] is True, s)
    # F02-R2-04(5): false قبل أي pending — فجوة R1-08(5): حالة متاحة وحالة معطلة أصلًا
    pre = page.evaluate("""() => {
      const mainInput = document.getElementById('f02s-switch-input');
      const mainSw = document.getElementById('f02s-switch');
      const locked = document.getElementById('f02s-locked-switch');
      const lockedInput = locked.querySelector('input');
      const before = { mainDisabled: mainInput.disabled, mainChecked: mainInput.checked,
                       lockedDisabled: lockedInput.disabled,
                       op: window.F02Switch.inspect().op };
      window.MicroSelection.setSwitchPending(mainSw, false);
      window.MicroSelection.setSwitchPending(locked, false);
      return Object.assign(before, {
        mainDisabledAfter: mainInput.disabled, mainCheckedAfter: mainInput.checked,
        opAfter: window.F02Switch.inspect().op,
        mainPending: mainSw.getAttribute('data-pending'),
        mainBusy: mainInput.getAttribute('aria-busy'),
        lockedDisabledAfter: lockedInput.disabled,
        lockedPending: locked.getAttribute('data-pending'),
        lockedBusy: lockedInput.getAttribute('aria-busy') }); }""")
    A(r, "false قبل أي pending: المتاح لا يتغير (disabled/checked/op محفوظة)",
      pre["mainDisabled"] is False and pre["mainDisabledAfter"] is False
      and pre["mainChecked"] == pre["mainCheckedAfter"] and pre["op"] == pre["opAfter"], pre)
    A(r, "false قبل أي pending: المعطل أصلًا يبقى معطلًا",
      pre["lockedDisabled"] is True and pre["lockedDisabledAfter"] is True, pre)
    A(r, "false قبل أي pending: بلا آثار pending/aria-busy على الحالتين",
      pre["mainPending"] == "false" and pre["mainBusy"] == "false"
      and pre["lockedPending"] == "false" and pre["lockedBusy"] == "false", pre)
    # false المتكرر والمعطل الأصلي (R2-06)
    page.evaluate("""() => {
      const sw = document.getElementById('f02s-locked-switch');
      window.MicroSelection.setSwitchPending(sw, true);
      window.MicroSelection.setSwitchPending(sw, false);
      window.MicroSelection.setSwitchPending(sw, false); }""")
    s = switch_inspect(page)
    A(r, "المعطل أصلاً يبقى معطلًا بعد false متكرر", s["lockedInputDisabled"] is True, s)
    # إنهاء pending يعيد التفاعل
    switch_arm(page, "update", "saved")
    switch_toggle(page)
    page.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    switch_settle(page, "update")
    page.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    s = switch_inspect(page)
    A(r, "بعد الحسم: المفتاح متاح مرة أخرى", s["inputDisabled"] is False and s["pendingAttr"] == "false", s)
    shot(page, "f02-29-switch-message.png")


# ---------- المسارات: التركيب والمنصات والتسليم ----------

def run_f02_30(page, browser):
    r = row("F02-30", "B07 داخل العينتين وحفظ تركيز المستخدم", "Tab/Shift+Tab محصوران؛ opened/closed مرة لكل عملية؛ overflow يُسترجع؛ لا focus في body/hidden/inert ولا سرقة عند حسم غير حواري")
    # عينة الاختيار
    goto(page, CHOICE_PAGE)
    events = page.evaluate("""() => {
      const layer = document.getElementById('f02c-picker-layer');
      window.__opened = 0; window.__closed = 0;
      layer.addEventListener('micro-navigation:opened', () => window.__opened++);
      layer.addEventListener('micro-navigation:closed', () => window.__closed++);
      return true; }""")
    choice_open(page)
    A(r, "اختيار: opened مرة واحدة", page.evaluate("() => window.__opened") == 1)
    tab_ok = True
    for _ in range(10):
        page.keyboard.press("Tab")
        if not page.evaluate("() => document.getElementById('f02c-picker-layer').contains(document.activeElement)"):
            tab_ok = False
            break
    A(r, "اختيار: Tab محصور", tab_ok)
    for _ in range(10):
        page.keyboard.press("Shift+Tab")
        if not page.evaluate("() => document.getElementById('f02c-picker-layer').contains(document.activeElement)"):
            tab_ok = False
            break
    A(r, "اختيار: Shift+Tab محصور", tab_ok)
    page.keyboard.press("Escape")
    choice_close_wait(page)
    page.wait_for_timeout(300)
    A(r, "اختيار: closed مرة واحدة", page.evaluate("() => window.__closed") == 1)
    A(r, "اختيار: overflow يُسترجع", page.evaluate("() => document.body.style.overflow === ''"))
    A(r, "اختيار: لا تركيز في body بعد الإغلاق", choice_inspect(page)["focusId"] != "body")
    # عينة الفلاتر: الحسم غير الحواري (تطبيق) لا يسرق التركيز عن هدف منطقي
    goto(page, FILTER_PAGE)
    filter_open(page)
    A(r, "فلاتر: فتح يعيد التركيز داخل الطبقة",
      page.evaluate("() => document.getElementById('f02f-filter-layer').contains(document.activeElement)"))
    page.click("[data-filter-apply]")
    filter_close_wait(page)
    s = filter_inspect(page)
    A(r, "فلاتر: التطبيق يعيد التركيز للمشغّل", s["focusId"] == "f02f-filter-btn", s["focusId"])
    A(r, "فلاتر: overflow يُسترجع", page.evaluate("() => document.body.style.overflow === ''"))
    A(r, "فلاتر: لا تركيز في body", s["focusId"] != "body")
    # رد قديم غير حواري لا يسرق التركيز (عينة الاختيار)
    goto(page, CHOICE_PAGE)
    choice_open(page)
    page.evaluate("() => document.querySelector('[data-picker-search]').focus()")
    choice_stale(page)
    page.wait_for_timeout(60)
    A(r, "القديم لا يسرق التركيز", choice_inspect(page)["focusId"] == "f02c-picker-search", choice_inspect(page)["focusId"])
    page.keyboard.press("Escape")
    choice_close_wait(page)
    shot(page, "f02-30-b07-focus.png")


def run_f02_31(page, browser):
    r = row("F02-31", "المقاسات الأربعة لكل عينة + 200% + reduced-motion",
            "لا خروج أفقي/قص في كل المقاسات والحالات المنطبقة؛ 200% بتضخيم فعلي مقاس قبل/بعد "
            "(بما فيها خيارات المنتقي بعد تجهيزها) ولا خروج أفقي عند 320/390؛ "
            "الحوار قابل للتمرير فعليًا وآخر نص مreachable؛ reduced-motion حقيقي للطبقتين")
    widths = [320, 360, 390, 430]
    overflow_report = {}
    for which, label in ((CHOICE_PAGE, "choice"), (FILTER_PAGE, "filter"), (SWITCH_PAGE, "switch")):
        for w in widths:
            ctx = browser.new_context(viewport={"width": w, "height": 844})
            pg = ctx.new_page()
            watch(pg)
            pg.goto(f"{BASE}/{which}", wait_until="networkidle")
            pg.evaluate("() => document.fonts.ready")
            overflow_report[f"{label}-{w}-main"] = pg.evaluate(
                "() => document.documentElement.scrollWidth <= window.innerWidth + 1")
            # حالة مطبقة حقيقية: الاختيار/الفلاتر بطبقة مفتوحة، والمفتاح بنتيجة
            # مجهولة مؤكدة (F02-R1-08(2): تسوية update المعلق فعلًا قبل القياس —
            # الحالة المسماة unknown يجب أن تكون unknown مقاسة لا pending)
            if label == "choice":
                choice_arm(pg, "error")
                choice_open(pg)
                choice_settle(pg, "latest")
                pg.wait_for_timeout(100)
                overflow_report[f"{label}-{w}-layer"] = no_h_overflow(pg)
            elif label == "filter":
                filter_open(pg)
                pg.wait_for_timeout(120)
                overflow_report[f"{label}-{w}-layer"] = no_h_overflow(pg)
            else:
                switch_arm(pg, "update", "unknown")
                switch_toggle(pg)
                switch_settle(pg, "update")
                pg.wait_for_function("() => window.F02Switch.inspect().op === 'unknown'", timeout=3000)
                st = switch_inspect(pg)
                overflow_report[f"{label}-{w}-unknown"] = {
                    "overflow": no_h_overflow(pg), "op": st["op"]}
            ctx.close()
    A(r, "لا خروج أفقي في كل المقاسات والحالات", all(
        (v if isinstance(v, bool) else v["overflow"]) for v in overflow_report.values()), overflow_report)
    A(r, "حالة المفتاح في حلقة المقاسات unknown مقاسة (لا pending)",
      all(v["op"] == "unknown" for k, v in overflow_report.items() if isinstance(v, dict)),
      {k: v["op"] for k, v in overflow_report.items() if isinstance(v, dict)})

    # ---------- 200% نص: الاختيار عند 320 و390 ----------
    # (F02-R1-08(3): الحالات والخيارات تُجهز قبل القياس ثم مضاعفة بممرين،
    # فتُغطى خيارات المنتقي المبنية بالقراءة أولًا — لا عناصر تفلت من القياس)
    for w in (320, 390):
        ctx = browser.new_context(viewport={"width": w, "height": 844})
        pg = ctx.new_page()
        watch(pg)
        pg.goto(f"{BASE}/{CHOICE_PAGE}", wait_until="networkidle")
        pg.evaluate("() => document.fonts.ready")
        choice_open(pg)
        choice_settle(pg, "latest")
        pg.wait_for_timeout(100)
        z = zoom200(pg)
        A(r, f"200% @{w}: أحجام الخط تضاعفت فعليًا (قياس قبل/بعد)", z["doubled"], z)
        probe = pg.evaluate(
            """() => { const o = document.querySelector('.m-picker__option');
                   const h1 = document.querySelector('h1');
                   return { opt: parseFloat(getComputedStyle(o).fontSize),
                            h1: parseFloat(getComputedStyle(h1).fontSize) }; }""")
        idx_opt = z["names"].index('.m-picker__option')
        A(r, f"200% @{w}: خيارات المنتقي مغطاة بالتضخيم",
          probe["opt"] >= z["before"][idx_opt] * 2 - 0.6, (probe, z["before"][idx_opt]))
        A(r, f"200% @{w}: لا خروج أفقي بعد التكبير", no_h_overflow(pg))
        # حدود الحروف: لا حرف خارج صفحة العرض (قاعدة F02-R1-07)
        glyphs = pg.evaluate("""() => {
          const out = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const n = walker.currentNode;
            if (!n.textContent.trim() || n.parentElement.closest('[hidden],svg,script,style')) continue;
            const range = new Range(); range.selectNodeContents(n);
            for (const rect of range.getClientRects())
              if (rect.left < -2 || rect.right > window.innerWidth + 2)
                out.push({ text: n.textContent.slice(0, 60), left: rect.left, right: rect.right });
          }
          return out; }""")
        A(r, f"200% @{w}: لا حدود حروف خارج الصفحة", len(glyphs) == 0, glyphs[:4])
        # الحوار عند 200%: تمرير فعلي إلى آخر نص ووصول الأفعال (F02-R1-08(4))
        dlg = pg.evaluate("""() => {
          const body = document.querySelector('#f02c-picker-layer .m-layer__body');
          const cs = getComputedStyle(body);
          const lastOpt = [...body.querySelectorAll('.m-picker__option')].pop();
          const before = body.scrollTop;
          body.scrollTop = body.scrollHeight;
          const scrolled = body.scrollTop;
          const lr = lastOpt.getBoundingClientRect();
          const br = body.getBoundingClientRect();
          const lastReachable = lr.bottom <= br.bottom + 2 && lr.top >= br.top - 2;
          body.scrollTop = before;
          return { sh: body.scrollHeight, ch: body.clientHeight,
                   overflowY: cs.overflowY, canScroll: scrolled > before,
                   lastReachable }; }""")
        if dlg["sh"] > dlg["ch"]:
            A(r, f"200% @{w}: الحوار يتجاوز → تمرير فعلي وآخر خيار reachable",
              dlg["canScroll"] is True and dlg["overflowY"] != "hidden"
              and dlg["lastReachable"] is True, dlg)
        else:
            A(r, f"200% @{w}: الحوار بلا تجاوز", True, dlg)
        shot(pg, f"f02-31-choice-200-{w}.png")
        # وظيفة باقية بعد التكبير: مقطّع يعمل
        pg.keyboard.press("Escape")
        choice_close_wait(pg)
        pg.click("#f02c-mode-seg [data-value='detail']")
        pg.wait_for_timeout(40)
        A(r, f"200% @{w}: الوظيفة باقية (مقطّع يعمل)", choice_inspect(pg)["mode"] == "detail")
        ctx.close()

    # 200% للفلاتر والمفتاح عند 320 (قيد F02-R1-07: تثبيت الفحص عند 320)
    for which, label, prepare in ((FILTER_PAGE, "filter", True), (SWITCH_PAGE, "switch", False)):
        ctx = browser.new_context(viewport={"width": 320, "height": 844})
        pg = ctx.new_page()
        watch(pg)
        pg.goto(f"{BASE}/{which}", wait_until="networkidle")
        pg.evaluate("() => document.fonts.ready")
        if label == "filter":
            filter_open(pg)
            pg.wait_for_timeout(100)
        z = zoom200(pg)
        A(r, f"200% @320 {label}: تضخيم فعلي قبل/بعد", z["doubled"], z)
        A(r, f"200% @320 {label}: لا خروج أفقي", no_h_overflow(pg))
        shot(pg, f"f02-31-{label}-200-320.png")
        ctx.close()

    # ---------- reduced-motion: تفضيل فعلي للطبقتين ----------
    for which, label, opener in ((CHOICE_PAGE, "choice", "choice"), (FILTER_PAGE, "filter", "filter")):
        ctx = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pg = ctx.new_page()
        watch(pg)
        pg.goto(f"{BASE}/{which}", wait_until="networkidle")
        rm = pg.evaluate("() => window.matchMedia('(prefers-reduced-motion: reduce)').matches")
        A(r, f"reduced-motion {label}: تفضيل فعلي مطبق في السياق", rm is True)
        if label == "choice":
            choice_open(pg)
            dur = pg.evaluate("""() => {
              const layer = document.getElementById('f02c-picker-layer');
              const d = getComputedStyle(layer).transitionDuration;
              return { d, instant: d === '0s' || d === '' }; }""")
            A(r, f"reduced-motion {label}: زمن انتقال الطبقة صفر", dur["instant"], dur["d"])
            A(r, f"reduced-motion {label}: الطبقة تفتح وتعمل", choice_inspect(pg)["layerOpen"] is True)
            pg.keyboard.press("Escape")
            choice_close_wait(pg)
            A(r, f"reduced-motion {label}: الإغلاق يعمل فورًا", choice_inspect(pg)["layerOpen"] is False)
        else:
            filter_open(pg)
            dur = pg.evaluate("""() => {
              const layer = document.getElementById('f02f-filter-layer');
              const d = getComputedStyle(layer).transitionDuration;
              return { d, instant: d === '0s' || d === '' }; }""")
            A(r, f"reduced-motion {label}: زمن انتقال الطبقة صفر", dur["instant"], dur["d"])
            pg.click("[data-filter-apply]")
            filter_close_wait(pg)
            A(r, f"reduced-motion {label}: الإغلاق يعمل فورًا", filter_inspect(pg)["layerOpen"] is False)
        ctx.close()
    shot(page, "f02-31-viewport-390.png")


def find_fail_line(txt):
    """F02-R1-08(1): كاشف أحكام FAIL المثبت في بداية السطر — النمط
    القديم r"^FAIL\\b" كان يطابق backslash حرفيًا فلا يكشف سجلًا فيه FAIL.
    النمط الصحيح يطابق FAIL في أول السطر متبوعًا بنهايته أو مسافة."""
    return re.search(r"^FAIL(\s|$)", txt, re.M) is not None


def run_f02_32(page):
    r = row("F02-32", "مصدر قابل للتعديل + فحوص رجعية + أدلة نظيفة",
            "تعديل fixture ينعكس؛ صفر pageerrors/404؛ فحوص B03/B07/F01 من مصدر مثبت "
            "مع تطابق commit/الشجرة وعدد الأحكام لا كلمة PASS؛ كاشف FAIL صحيح "
            "مُختبَر ذاتيًا؛ شجرة المصدر نظيفة من تعديلات غير أدلة الجولة؛ "
            "روابط READMEs لملفات موجودة")
    # 1) تعديل fixture الفلاتر ينعكس دون إعادة إنشاء
    goto(page, FILTER_PAGE)
    src = (ROOT / "previews" / UX_DIRNAME / "filter-lifecycle" / "example.js").read_text(encoding="utf-8")
    patched = src.replace("    { id: 'c', label: 'عينة ج', active: true, marked: true }",
                          "    { id: 'c', label: 'عينة ج', active: true, marked: true },\n    { id: 'd', label: 'عينة د', active: false, marked: false }")
    assert patched != src, "fixture needle missing"
    page.route("**/example.js", lambda route: route.fulfill(status=200, content_type="text/javascript", body=patched))
    goto(page, FILTER_PAGE)
    s = filter_inspect(page)
    A(r, "إضافة عنصر للـfixture ينعكس في العرض", s["rowLabels"] == ["عينة أ", "عينة ب", "عينة ج", "عينة د"], s["rowLabels"])
    page.unroute("**/example.js")
    # 2) صفر أخطاء JS وموارد فاشلة عبر كل الجلسة (تُجمع عالميًا)
    A(r, "صفر pageerrors في الجلسة كلها", len(js_errors) == 0, js_errors[:5])
    A(r, "صفر موارد 4xx/5xx في الجلسة كلها", len(http_failures) == 0, http_failures[:5])
    # 3) كاشف FAIL: اختبار ذاتي لحالات نجاح كامل/مختلط/مفقود/ناقص
    A(r, "كاشف FAIL: سجل ناجح كامل يمر", find_fail_line("PASS a\nPASS b\n") is False)
    A(r, "كاشف FAIL: سجل مختلط PASS+FAIL يكشف", find_fail_line("PASS a\nFAIL real failure\nPASS b\n") is True)
    A(r, "كاشف FAIL: FAIL داخل اسم اختبار لا يكشف (بداية سطر فقط)",
      find_fail_line("PASS no FAIL here\n") is False)
    A(r, "كاشف FAIL: النمط القديم كان معطوبًا فعلًا",
      re.search(r"^FAIL\\b", "FAIL real failure\nPASS x", re.M) is None)
    # 4) فحوص رجعية من checkout نظيف لنفس source commit (جولة R2 بلا overwrite تاريخي)
    reg_dir = ROOT / "reviews" / "UX-F02" / ("round-" + ROUND) / "regression"
    f01_dir = ROOT / "reviews" / "UX-F02" / ("round-" + ROUND) / "f01-regression"
    for p, name, expected in ((reg_dir / "b03-verification.txt", "B03", 25),
                              (reg_dir / "b07-verification.txt", "B07", 28)):
        ok, detail = False, "مفقود"
        if p.exists():
            body = p.read_text(encoding="utf-8", errors="replace")
            commit_m = re.search(r"^# commit المصدر: ([0-9a-f]{40})", body, re.M)
            tree_m = re.search(r"^# بصمة شجرة المصدر: ([0-9a-f]{40})", body, re.M)
            pass_n = len(re.findall(r"^PASS\b", body, re.M))
            fail_n = len(re.findall(r"^FAIL\b", body, re.M))
            result_m = re.search(r"^# النتيجة: (\d+)/(\d+)", body, re.M)
            checks = {
                "commit-match": bool(commit_m and commit_m.group(1) == SOURCE_COMMIT),
                "tree-match": bool(tree_m and tree_m.group(1) == SOURCE_TREE),
                "pass-count": pass_n == expected,
                "no-fail": not find_fail_line(body) and fail_n == 0,
                "result-line": bool(result_m and int(result_m.group(1)) == pass_n
                                    and int(result_m.group(1)) == expected),
            }
            ok = all(checks.values())
            detail = checks
        A(r, f"فحص رجعي {name}: {expected} PASS من مصدر مثبت (commit+شجرة+عدد)", ok, detail)
    f01_p = f01_dir / "verification.json"
    ok, detail = False, "مفقود"
    if f01_p.exists():
        try:
            data = json.loads(f01_p.read_text(encoding="utf-8"))
            rows_ = data.get("rows", [])
            meta = data.get("meta", {})
            checks = {
                "count": len(rows_) == 20,
                "all-pass": bool(rows_) and all(x.get("status") == "PASS" for x in rows_),
                "source-commit": meta.get("source_commit") == SOURCE_COMMIT,
                "no-fail-rows": not any(x.get("failed") for x in rows_),
            }
            ok = all(checks.values())
            detail = checks
        except Exception as exc:
            ok, detail = False, str(exc)
    A(r, "فحص رجعي F01: 20/20 PASS من نفس source commit", ok, detail)
    # 5) نظافة شجرة المصدر: لا تعديلات مصدر قبل التشغيل (مجلد الأدلة الجديد مستثنى)
    try:
        status = subprocess.check_output(["git", "status", "--porcelain"], cwd=str(ROOT), text=True)
        out_prefix = f"reviews/UX-F02/round-{ROUND}"
        # يُستثنى مجلد أدلة الجولة نفسه (untracked تحته ليس تعديل مصدر)
        dirty = [l for l in status.splitlines()
                 if not (l.strip().startswith("??") and out_prefix in l)]
    except Exception as exc:
        dirty, status = [f"git-status-error: {exc}"], ""
    A(r, "شجرة المصدر نظيفة عند التشغيل (الأدلة الجديدة مستثناة)", not dirty, dirty[:8])
    # 6) روابط READMEs تشير لملفات موجودة
    ux = UX_DIRNAME
    link_failures = []
    for name in ("choice-lifecycle", "filter-lifecycle", "switch-lifecycle"):
        rp = ROOT / "previews" / ux / name / "README.md"
        if not rp.exists():
            link_failures.append(f"{name}/README.md missing")
            continue
        body = rp.read_text(encoding="utf-8")
        for m in re.finditer(r"\]\(([^)#]+?)(?:#[^)]*)?\)", body):
            target = m.group(1).strip()
            if target.startswith(("http://", "https://", "data:")) or not target:
                continue
            resolved = (rp.parent / target).resolve()
            if not resolved.exists():
                link_failures.append(f"{name}: {target}")
    A(r, "روابط READMEs الداخلية لملفات موجودة", not link_failures, link_failures[:8])
    # 7) بصمة المصدر في الأدلة
    A(r, "source commit مثبت في السجل", len(SOURCE_COMMIT) == 40 and len(SOURCE_TREE) == 40, (SOURCE_COMMIT[:8], SOURCE_TREE[:8]))


# ---------- التشغيل ----------

BASE = None
OUT = None


def main():
    global BASE, OUT, UX_DIRNAME, CHOICE_PAGE, FILTER_PAGE, SWITCH_PAGE
    global BROWSER_VERSION, SOURCE_COMMIT, SOURCE_TREE
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=str(ROOT), help="جذر الشجرة قيد الفحص (checkout نظيف)")
    parser.add_argument("--round", default="r1", help="اسم الجولة للتخزين في round-<round>")
    ns = parser.parse_args()
    root = Path(ns.root).resolve()
    globals()["ROOT"] = root  # أدلة الشجرة قيد الفحص هي المرجع للنسب النسبية
    globals()["ROUND"] = ns.round  # اسم الجولة يصل لفحص نظافة الشجرة ومسارات الرجعية
    OUT = root / "reviews" / "UX-F02" / ("round-" + ns.round)
    UX_DIRNAME = discover_ux_dir()
    CHOICE_PAGE = f"previews/{UX_DIRNAME}/choice-lifecycle/index.html"
    FILTER_PAGE = f"previews/{UX_DIRNAME}/filter-lifecycle/index.html"
    SWITCH_PAGE = f"previews/{UX_DIRNAME}/switch-lifecycle/index.html"
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    BASE = f"http://127.0.0.1:{server.server_address[1]}"
    SOURCE_COMMIT = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(root), text=True).strip()
    SOURCE_TREE = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(root), text=True).strip()

    log("# فحص قبول UX-F02 (F02-01..F02-32) — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {SOURCE_COMMIT}")
    log(f"# بصمة شجرة المصدر: {SOURCE_TREE}")
    log("")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        BROWSER_VERSION = browser.version
        log(f"# إصدار المتصفح الفعلي: {BROWSER_VERSION}")
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        watch(page)

        run_f02_01(page)
        run_f02_02(page)
        run_f02_03(page)
        run_f02_04(root)
        run_f02_05(page)
        run_f02_06(page)
        run_f02_07(page)
        run_f02_08(page)
        run_f02_09(page)
        run_f02_10(page)
        run_f02_11(page)
        run_f02_12(page)
        run_f02_13(page)
        run_f02_14(page)
        run_f02_15(page, browser)
        run_f02_16(page)
        run_f02_17(page)
        run_f02_18(page)
        run_f02_19(page)
        run_f02_20(page)
        run_f02_21(page)
        run_f02_22(page)
        run_f02_23(page)
        run_f02_24(page)
        run_f02_25(page)
        run_f02_26(page)
        run_f02_27(page)
        run_f02_28(page)
        run_f02_29(page)
        run_f02_30(page, browser)
        run_f02_31(page, browser)
        run_f02_32(page)

        browser.close()

    for rec in results_rows:
        rec["status"] = "PASS" if not rec["failed"] else "FAIL"

    engine = {
        "browser": "Chromium (headless)",
        "browser_version": BROWSER_VERSION,
        "driver": "Playwright (Python sync API)",
        "base_url": BASE,
        "pages": [CHOICE_PAGE, FILTER_PAGE, SWITCH_PAGE],
        "viewport_default": "390x844",
    }
    try:
        from playwright._repo_version import version as pw_version
        engine["playwright_version"] = pw_version
    except Exception:
        engine["playwright_version"] = "runtime"

    verification = {
        "meta": {
            "title": "UX-F02 — مصفوفة قبول الاختيار والفلاتر والمفتاح (32 مسارًا)",
            "status": "DRAFT FOR REVIEW",
            "round": ns.round,
            "date": datetime.now().isoformat(timespec="seconds"),
            "source_commit": SOURCE_COMMIT,
            "source_tree": SOURCE_TREE,
            "engine": engine,
            "command": f"python3 tools/ux-f02-check.py --root {ns.root} --round {ns.round}".strip(),
            "zoom_mechanism": "مضاعفة 200% بممرين: التقاط أحجام البداية لكل عناصر body ثم تطبيقها من اللقطة (F02-R1-08-3: لا قراءة/كتابة متسلسلة تضاعف الموروث مرتين)؛ الحالات والخيارات تُجهز قبل القياس — ليست native zoom",
            "reduced_motion_mechanism": "Playwright reduced_motion='reduce' (تفضيل حقيقي على مستوى السياق)",
            "raw_pointer_mechanism": "page.mouse.click على إحداثيات العنصر للمعطل/aria-disabled وفق PREFLIGHT — إحداثيات حقيقية لا click() محمي",
            "sim_neutrality": "تسليح/تسوية/رد قديم عبر evaluate (محايد للتركيز) وفق إذن البطاقة §6؛ أفعال المستخدم بالنقر/لوحة المفاتيح الفعلية",
            "regression_order": "فحوص B03/B07 وF01 (--round f02r2-regression) تُشغل من checkout نظيف لنفس source commit قبل هذه الأداة، وتُنسخ إلى reviews/UX-F02/round-r2/regression/ وf01-regression/ — ملفات الجولات السابقة لا تُكتب فوقها؛ الفحص يطابق commit/الشجرة وعدد الأحكام لا كلمة PASS",
            "js_errors": js_errors,
            "http_failures": http_failures,
        },
        "rows": [{k: rec[k] for k in ("id", "path", "expected", "measured", "failed", "status")} for rec in results_rows],
        "not_run": [
            {"item": "WebKit/Safari (محرك آخر)", "reason": "غير منفذ في بيئة التنفيذ — لم يُنفذ فعليًا"},
            {"item": "أجهزة Android/iPhone حقيقية + TalkBack/VoiceOver", "reason": "لا جهاز أو أداة قارئ شاشة في البيئة — لم تُنفذ"},
            {"item": "native zoom للنظام/المتصفح", "reason": "الفحص المنفذ محاكاة CSS 200% معلنة الآلية فقط"},
            {"item": "لمس حقيقي وsafe areas فعلية ولوحة مفاتيح نظام", "reason": "بيئة headless — لم تُنفذ"},
        ],
        "fail_detector": "F02-R1-08-1: كاشف FAIL مثبت الأحكام ببداية السطر، مُختبَر ذاتيًا في F02-32 (ناجح كامل/مختلط/مفقود/النمط القديم المعطوب)",
        "limits": [
            "فحوص DOM ولوحة مفاتيح محاكاة لا تثبت سلوك قارئ شاشة فعلي",
            "الصور أدلة شكل فقط — القيم والتركيز والعدادات هي أدلة السلوك",
            "أدلة ما قبل التصحيح (PREFLIGHT) لشجرة 8791514 تاريخية وتحفظ كما هي",
        ],
    }
    (OUT / "verification.json").write_text(json.dumps(verification, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    passed = sum(1 for rec in results_rows if rec["status"] == "PASS")
    log("")
    log(f"# النتيجة: {passed}/{len(results_rows)} مسارًا PASS")
    for rec in results_rows:
        log(f"  {rec['status']:4} {rec['id']}")
    if js_errors:
        log("# أخطاء JavaScript: " + "; ".join(js_errors[:5]))
    if http_failures:
        log("# موارد فاشلة: " + "; ".join(f"{u} ({s})" for u, s in http_failures[:5]))
    log(f"# التقرير المفصل: {OUT / 'verification.json'}")
    (OUT / "verification.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")

    if passed != len(results_rows) or js_errors or http_failures:
        sys.exit(1)


if __name__ == "__main__":
    main()

