#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة فحص جدول الطلبات المجدولة (ORDER-SCHEDULE / CAL) — الجولة R3

مصفوفة CAL-01..15 من بطاقة القبول docs/ux/ORDER-SCHEDULE-ACCEPTANCE.md
على أربعة أهداف موسومة:

  src          HTTP خادم محلي — previews/ux-patterns/mobile-record-sample/index.html
               (تجربة F03 الكاملة: بوابة → رئيسية → «الطلبات المجدولة»)
  standalone   file:// — previews/ux-patterns/mobile-record-sample/standalone.html
               (الملف الواحد المولّد حتميًا)
  sample       file:// — previews/ux-patterns/order-schedule/index.html
               (العينة المستقلة: الرحلة نفسها من موصل OrderDemoStore)
  comp         file:// — components/order-schedule/example-usage.html
               (وثيقة المكوّن: رياضيات API المثيل وحالات الخطأ/الفراغ
               والتهيئة المزدوجة/destroy — بنود لا تكشفها أهداف الرحلة)

نمط أدوات المنزل (ux-f03-check): CheckTool + assert_/path_begin/path_end +
لقطات screenshots/ + verification.json/txt + NOT RUN معلنة + خروج غير
صفري عند أي فشل. أخطاء صفحة وفشل موارد مصفوفة **لكل هدف على حدة**،
تكبير نص ×2 بمرورين نظيفين (قراءة الأحجام المحسوبة ثم تطبيقها كي لا
تتضاعف الموروثة — ليست native zoom)، ولوحة مفاتيح حقيقية عبر
pg.keyboard، وقياسات 320/360/390/430 موثقة بأرقامها الفعلية (خلايا
الشهر PROPOSED ≈37.7px عند 320 كما في المواصفة — لا ادعاء 48 لها).

الإخراج: reviews/ORDER-SCHEDULE/{verification.json, verification.txt,
screenshots/}. البناء الحتمي يُتحقق منه بـ build-f03-standalone.py --check
(بلا كتابة).
"""

import argparse
import json
import subprocess
import sys
import threading
from contextlib import contextmanager
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "reviews" / "ORDER-SCHEDULE"
F03_REL = "previews/ux-patterns/mobile-record-sample"
OCAL_REL = "previews/ux-patterns/order-schedule"
COMP_PAGE = (ROOT / "components" / "order-schedule" / "example-usage.html").resolve()
STANDALONE_PAGE = (ROOT / F03_REL / "standalone.html").resolve()
SAMPLE_PAGE = (ROOT / OCAL_REL / "index.html").resolve()
WIDTHS = [320, 360, 390, 430]
VIEW = {"width": 390, "height": 844}
TARGETS = ["src", "standalone", "sample", "comp"]

F03_IDS = {
    "root": "#f03-ocal",
    "layer": "f03-order-layer", "title": "f03-order-title", "rd_date": "f03-order-date",
    "rd_customer": "f03-order-customer", "rd_time_row": "f03-order-time-row", "rd_time": "f03-order-time",
    "chip": "f03-order-status", "chip_text": "f03-order-status-text", "edit": "f03-order-edit",
    "form_layer": "f03-order-form-layer", "name": "f03-order-name", "date": "f03-order-form-date",
    "save": "f03-order-save", "addbar": "f03-schedule-add", "name_msg": "f03-order-name-msg",
}
SMP_IDS = {
    "root": "#ocal-demo",
    "layer": "ocal-order-layer", "title": "ocal-order-title", "rd_date": "ocal-rd-date",
    "rd_customer": "ocal-rd-customer", "rd_time_row": "ocal-rd-time-row", "rd_time": "ocal-rd-time",
    "chip": "ocal-order-status", "chip_text": "ocal-order-status-text", "edit": "ocal-order-edit",
    "form_layer": "ocal-order-form-layer", "name": "ocal-order-name", "date": "ocal-order-date",
    "save": "ocal-order-save", "addbar": "ocal-demo-add", "name_msg": "ocal-order-name-msg",
}

# أعمدة الرحلة المشتركة التي يجب أن تعمل بالنتيجة نفسها على الأهداف الثلاثة
SHARED_JOURNEY = ["CAL-%02d" % i for i in range(1, 13)]

JS_HELPERS = r"""
() => {
  window.CALh = {
    overflow: () => {
      const doc = document.documentElement;
      return { docW: doc.clientWidth, scrollW: doc.scrollWidth,
               overflow: doc.scrollWidth > doc.clientWidth + 1 };
    },
    measure: (rootSel) => {
      const R = (el) => { const b = el.getBoundingClientRect(); return { w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
      const root = document.querySelector(rootSel);
      if (!root) return null;
      const cells = [...root.querySelectorAll('.m-ocal__cell')];
      const navs = [...root.querySelectorAll('.m-ocal__navbtn')];
      const today = root.querySelector('.m-ocal__todaybtn');
      const rows = [...root.querySelectorAll('.m-ocal__row')];
      const sw = [...root.querySelectorAll('.m-ocal__views-btn, .m-ocal__modes-btn')];
      return {
        docW: document.documentElement.clientWidth,
        scrollW: document.documentElement.scrollWidth,
        nCells: cells.length,
        cellW: cells.map((c) => +c.getBoundingClientRect().width.toFixed(1)),
        cellH: cells.slice(0, 4).map((c) => +c.getBoundingClientRect().height.toFixed(1)),
        navs: navs.map(R), today: today ? R(today) : null,
        rows: rows.slice(0, 6).map(R), switches: sw.map(R)
      };
    },
    zoom2: () => {
      /* مروران نظيفان: قراءة كل الأحجام المحسوبة أولًا ثم التطبيق —
         كي لا تتضاعف القيم الموروثة (ليست native zoom) */
      const els = [document.body].concat([...document.body.querySelectorAll('*')]);
      const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
      orig.forEach((it) => {
        if (it.el.dataset.calZoom === undefined) {
          it.el.dataset.calZoom = '1';
          it.el.style.fontSize = (it.fs * 2) + 'px';
        }
      });
      return orig.length;
    },
    unzoom: () => {
      document.querySelectorAll('[data-cal-zoom]').forEach((el) => {
        el.style.fontSize = '';
        delete el.dataset.calZoom;
      });
      return true;
    }
  };
  return true;
}
"""


class Ctx:
    """صفحات الأهداف وعناوينها + المتصفح (للسياقات الفرعية)."""

    def __init__(self, pages, urls, browser):
        self.pages = pages
        self.urls = urls
        self.browser = browser


class CheckTool:
    def __init__(self, out_dir: Path):
        self.out = out_dir
        self.shots = out_dir / "screenshots"
        self.shots.mkdir(parents=True, exist_ok=True)
        self.results = []
        self.current = None
        self.errors = {t: [] for t in TARGETS}
        self.resource_failures = {t: [] for t in TARGETS}
        self.requests = {t: [] for t in TARGETS}
        self.parity = {t: {} for t in TARGETS}

    # ---------- تسجيل (نمط أدوات المنزل) ----------
    def assert_(self, name, expected, measured, ok, extra=None):
        entry = {"name": name, "expected": expected, "measured": measured, "pass": bool(ok)}
        if extra is not None:
            entry["extra"] = extra
        self.current["assertions"].append(entry)
        if not ok:
            self.current["failures"].append(name)

    def path_begin(self, pid, desc):
        self.current = {"id": pid, "path": desc, "assertions": [], "failures": [], "targets": []}
        self.results.append(self.current)

    def path_end(self):
        self.current["result"] = "PASS" if not self.current["failures"] else "FAIL"
        self.current = None

    @contextmanager
    def target_scope(self, target, cal_id):
        """نطاق هدف داخل مسار: يسجل نتيجة الهدف للمصفوفة (تكافؤ الأهداف)."""
        before = len(self.current["failures"]) if self.current else 0
        if self.current and target not in self.current["targets"]:
            self.current["targets"].append(target)
        try:
            yield
        finally:
            ok = len(self.current["failures"]) == before if self.current else False
            self.parity[target][cal_id] = ok

    def shot(self, page, name, full=False):
        page.screenshot(path=str(self.shots / name), full_page=full)

    # ---------- تتبع أخطاء/موارد لكل هدف على حدة ----------
    def track(self, page, target):
        page.on("pageerror", lambda e: self.errors[target].append(str(e)))
        page.on("console", lambda m: self.errors[target].append(f"console.error: {m.text}")
                if m.type == "error" else None)
        page.on("requestfailed", lambda r: self.resource_failures[target].append(f"{r.url} :: {r.failure}"))
        page.on("response", lambda r: self.resource_failures[target].append(f"HTTP {r.status} :: {r.url}")
                if r.status >= 400 else None)
        page.on("request", lambda r: self.requests[target].append(r.url))

    # ---------- فتح الأهداف (كل مسار يبدأ بحالة نظيفة معاد بذرها) ----------
    def open_f03(self, page, url):
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        page.evaluate("() => { try { window.localStorage.clear(); } catch (e) {} }")
        page.locator("#f03-gw-demo").click()
        page.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page.locator("#f03-home-schedule").click()
        page.wait_for_selector("#view-schedule", state="visible", timeout=5000)
        page.wait_for_function("() => document.querySelectorAll('#f03-ocal .m-ocal__cell').length >= 30",
                               timeout=5000)
        page.evaluate(JS_HELPERS)
        page.wait_for_timeout(200)

    def open_sample(self, page, url):
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.wait_for_function("() => document.querySelectorAll('#ocal-demo .m-ocal__cell').length >= 30",
                               timeout=10000)
        page.evaluate(JS_HELPERS)
        page.wait_for_timeout(200)

    def open_comp(self, page, url):
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.wait_for_function("() => !!window.__OCAL_DEMO", timeout=10000)
        page.wait_for_timeout(200)

    def open_target(self, target, ctx):
        page = ctx.pages[target]
        if target in ("src", "standalone"):
            self.open_f03(page, ctx.urls[target])
        elif target == "sample":
            self.open_sample(page, ctx.urls["sample"])
        else:
            self.open_comp(page, ctx.urls["comp"])
        return page



# ==================== JS مشتركة للمسارات ====================

JS_MARKERS = r"""
(rs) => {
  const root = document.querySelector(rs);
  const sel = root.querySelector('.m-ocal__cell[aria-selected="true"]');
  const cur = root.querySelector('.m-ocal__cell[aria-current="date"]');
  return {
    selDate: sel ? sel.getAttribute('data-ocal-date') : null,
    curDate: cur ? cur.getAttribute('data-ocal-date') : null,
    distinct: !!sel && !!cur && sel !== cur,
    curLabel: cur ? cur.getAttribute('aria-label') : null,
    selClass: sel ? String(sel.className) : null,
    curClass: cur ? String(cur.className) : null
  };
}
"""

JS_TITLE = r"""
(rs) => {
  const t = document.querySelector(rs + ' .m-ocal__cal-title');
  return t ? t.textContent : null;
}
"""

JS_COUNTS = r"""
(rs) => {
  const root = document.querySelector(rs);
  const info = (d) => {
    const c = root.querySelector('.m-ocal__cell[data-ocal-date="' + d + '"]');
    if (!c) return null;
    const cnt = c.querySelector('.m-ocal__count');
    return { count: cnt ? cnt.textContent : null,
             dots: c.querySelectorAll('.m-ocal__dot').length,
             label: c.getAttribute('aria-label') };
  };
  const all = [...root.querySelectorAll('.m-ocal__cell')].map((c) => ({
    d: c.getAttribute('data-ocal-date'),
    dots: c.querySelectorAll('.m-ocal__dot').length,
    hasCount: !!c.querySelector('.m-ocal__count')
  }));
  return {
    zero: info('2026-10-02'), today: info('2026-10-07'), d8: info('2026-10-08'),
    d9: info('2026-10-09'), d22: info('2026-10-22'),
    maxDots: all.reduce((m, a) => Math.max(m, a.dots), 0),
    dotsWithoutCounter: all.filter((a) => !a.hasCount && a.dots > 0).length
  };
}
"""

JS_LIST_STATS = r"""
(rs) => {
  const root = document.querySelector(rs);
  const secs = [...root.querySelectorAll('.m-ocal__list-section')].map((s) => ({
    head: s.querySelector('.m-ocal__list-heading').textContent,
    n: s.querySelectorAll('.m-ocal__row').length,
    ids: [...s.querySelectorAll('.m-ocal__row')].map((r) => r.getAttribute('data-ocal-id'))
  }));
  const all = [...root.querySelectorAll('.m-ocal__row')].map((r) => r.getAttribute('data-ocal-id'));
  return { secs, total: all.length, unique: new Set(all).size,
           storeCount: window.OrderDemoStore ? window.OrderDemoStore.count() : null };
}
"""

JS_LIST_ORDER = r"""
(rs) => {
  const root = document.querySelector(rs);
  const secOf = (frag) => [...root.querySelectorAll('.m-ocal__list-section')]
    .find((s) => s.querySelector('.m-ocal__list-heading').textContent.indexOf(frag) >= 0);
  const rowsOf = (s) => s ? [...s.querySelectorAll('.m-ocal__row')] : [];
  const up = secOf('القادمة'), past = secOf('السابقة'), un = secOf('غير مجدولة');
  const dates = {};
  (window.OrderDemoStore ? window.OrderDemoStore.all() : []).forEach((o) => { dates[o.id] = o.date; });
  const upSeq = rowsOf(up).map((r) => dates[r.getAttribute('data-ocal-id')]);
  const pastRows = rowsOf(past);
  const known = ['قيد التنفيذ', 'تم التسليم', 'بانتظار العميل'];
  return {
    heads: [...root.querySelectorAll('.m-ocal__list-heading')].map((h) => h.textContent),
    upFirst: upSeq[0] || null, upCount: upSeq.length,
    upAscending: upSeq.every((d, i) => i === 0 || upSeq[i - 1] <= d),
    upFirstId: rowsOf(up)[0] ? rowsOf(up)[0].getAttribute('data-ocal-id') : null,
    pastIds: pastRows.map((r) => r.getAttribute('data-ocal-id')),
    pastLabels: pastRows.map((r) => (r.querySelector('.m-ocal__row-statuslabel') || {}).textContent),
    pastLabelsKnown: pastRows.every((r) => {
      const l = r.querySelector('.m-ocal__row-statuslabel');
      return l && known.indexOf(l.textContent) >= 0;
    }),
    unIds: rowsOf(un).map((r) => r.getAttribute('data-ocal-id')),
    allIds: [...root.querySelectorAll('.m-ocal__row')].map((r) => r.getAttribute('data-ocal-id')),
    hasLateWord: /متأخر/.test(document.body.innerText || '')
  };
}
"""

JS_ROW_TITLE_WRAP = r"""
(rs) => {
  const root = document.querySelector(rs);
  const r4 = root.querySelector('.m-ocal__row[data-ocal-id="od-04"]');
  const t4 = r4 ? r4.querySelector('.m-ocal__row-title') : null;
  const r10 = root.querySelector('.m-ocal__row[data-ocal-id="od-10"]');
  const rinj = root.querySelector('.m-ocal__row[data-ocal-id="od-inj"]');
  return {
    longRowWraps: t4 ? t4.scrollWidth <= t4.clientWidth + 1 : null,
    mysteryLabel: r10 ? (r10.querySelector('.m-ocal__row-statuslabel') || {}).textContent : null,
    mysteryClass: r10 ? String(r10.querySelector('.m-ocal__row-status').className) : null,
    injText: rinj ? rinj.querySelector('.m-ocal__row-title').textContent : null,
    injHasMarkup: rinj ? !!rinj.querySelector('b, img') : null,
    rootB: root.querySelectorAll('b').length,
    rootImg: root.querySelectorAll('img').length,
    xssArmed: typeof window.__xss !== 'undefined'
  };
}
"""

JS_DETAIL_LAYER = r"""
(ids) => {
  const layer = document.getElementById(ids.layer);
  const trow = document.getElementById(ids.rd_time_row);
  const chip = document.getElementById(ids.chip);
  return {
    title: document.getElementById(ids.title).textContent,
    customer: document.getElementById(ids.rd_customer).textContent,
    date: document.getElementById(ids.rd_date).textContent,
    timeRowHidden: trow.hidden,
    timeRowDisplay: getComputedStyle(trow).display,
    time: document.getElementById(ids.rd_time).textContent,
    chipText: document.getElementById(ids.chip_text).textContent,
    chipClass: String(chip.className),
    layerB: layer.querySelectorAll('b, img').length
  };
}
"""

JS_NO_RELOAD = r"""
() => ({
  marker: window.__calNoReload ? window.__calNoReload.n : null,
  navEntries: performance.getEntriesByType('navigation').length
})
"""

# ---------- SUI-009 (REPAIR-R1 2026-10-07): تحميل حالات الحدود عبر fixtures صريحة ----------
# تبرير التحديث (عقد SUI-009 المكتوب في المواصفة وREADME العينة): البذرة
# الافتراضية للموصل صارت **نظيفة** (بيانات أعمال بمفاتيح الحالات المعروفة
# فقط — 22 طلبًا)، وحالتا الحدود (od-10 بمفتاح مجهول 'mystery' + od-inj
# بعنوان محقون) انتقلتا إلى OrderDemoStore.EDGE_FIXTURES المعزولة التي لا
# تُحمّل إلا بوضع فحص صريح (وسيط ?fixtures=edge أو زر وضع الفحص أو الواجهة
# البرمجية). المسارات التي تعتمد على أعدادهما/نصوصهما (CAL-05/07/08/09/10)
# تحمّلها الآن صراحة عبر الواجهة البرمجية (upsert بعد فتح الهدف) —
# **اختبار الحالات الحدية عبر fixtures صريحة بدل المسار الافتراضي — عقد
# SUI-009** — دون تعديل أي توقع قائم (الأعداد 24/18 وسلوك المفتاح المجهول
# المحايد والحقن النصي الحرفي كما هي في بطاقة القبول).
# standalone.html القائم (قبل إعادة بناء القائد للدمج) مبني على البذرة
# القديمة التي تحمل الحالتين أصلًا ولا يعرّف EDGE_FIXTURES — فالتحميل
# يتخطاه بأمان (Array.isArray يفشل) وتبقى توقعاته محققة من بذرته الخاصة.
# (تحديث القائد بعد إعادة البناء الحتمي 2026-10-07): standalone الجديد
# مبني على البذرة النظيفة نفسها ويعرّف EDGE_FIXTURES — فصار الهدف
# الثالث يُحمّل fixtures صريحة مثل src/sample (نفس التبرير أعلاه، عقد
# SUI-009؛ بلا تعديل أي توقع).
EDGE_FIXTURES_LOAD = r"""
() => {
  if (window.OrderDemoStore && Array.isArray(window.OrderDemoStore.EDGE_FIXTURES)) {
    window.OrderDemoStore.EDGE_FIXTURES.forEach((o) => window.OrderDemoStore.upsert(o));
    return window.OrderDemoStore.count();
  }
  return null; /* standalone القديم: الحالات في بذرته أصلًا */
}
"""


def ensure_edge_fixtures(page, tgt):
    """تحميل fixtures الحالات الحدية لمسارات CAL-05/07/08/09/10 (عقد SUI-009).
    حدث order-store:changed يعيد التصيير من المصدر الواحد في F03 والعينة."""
    if tgt not in ("src", "sample", "standalone"):
        return
    page.evaluate(EDGE_FIXTURES_LOAD)
    page.wait_for_timeout(450)  # إعادة تصيير المستهلك من حدث الموصل

JS_CELL_SELECT_STATE = r"""
(rs) => {
  const root = document.querySelector(rs);
  const sel = root.querySelector('.m-ocal__cell[aria-selected="true"]');
  return {
    selDate: sel ? sel.getAttribute('data-ocal-date') : null,
    calView: root.getAttribute('data-ocal-cal-view'),
    view: root.getAttribute('data-ocal-view'),
    rows: root.querySelectorAll('[data-ocal-day-panel] .m-ocal__row').length,
    rowIds: [...root.querySelectorAll('[data-ocal-day-panel] .m-ocal__row')].map((r) => r.getAttribute('data-ocal-id'))
  };
}
"""


# ==================== المصفوفة CAL-01..15 ====================

def p01_calendar_math(t: CheckTool, ctx: Ctx):
    """CAL-01: رياضيات التقويم المدني — كبيسة وحدود الشهور والقص المعلن."""
    t.path_begin("CAL-01", "شبكة الشهر تطابق التقويم المدني: فبراير 2028=29 و2027=28، ديسمبر→يناير، قص م31→ف28 مع إعلان")
    # --- comp: API المثيل في وثيقة المكوّن (leader-ocal-check نفسها) ---
    page = t.open_target("comp", ctx)
    with t.target_scope("comp", "CAL-01"):
        m = page.evaluate(r"""() => {
          const root = document.querySelector('#demo-1');
          const inst = window.MicroOrderSchedule.init(root, {});
          inst.setCalendarView('month');
          inst.setSelectedDate('2028-02-28');
          const feb28 = root.querySelectorAll('.m-ocal__cell').length;
          inst.setSelectedDate('2027-02-15');
          const feb27 = root.querySelectorAll('.m-ocal__cell').length;
          inst.setSelectedDate('2026-12-15');
          root.querySelector('[data-ocal-action="next-month"]').click();
          const decToJan = root.querySelector('.m-ocal__cal-title').textContent;
          inst.setSelectedDate('2026-03-31');
          const got = [];
          const h = (e) => got.push(e.detail.date);
          root.addEventListener('order-schedule:day-select', h);
          root.querySelector('[data-ocal-action="prev-month"]').click();
          root.removeEventListener('order-schedule:day-select', h);
          return { feb28, feb27, decToJan,
                   clampTitle: root.querySelector('.m-ocal__cal-title').textContent,
                   clampSel: root.querySelector('[aria-selected="true"]').getAttribute('data-ocal-date'),
                   clampEvents: got };
        }""")
        t.assert_("[comp] فبراير 2028 = 29 خلية (كبيسة)", 29, m["feb28"], m["feb28"] == 29)
        t.assert_("[comp] فبراير 2027 = 28 خلية", 28, m["feb27"], m["feb27"] == 28)
        t.assert_("[comp] ديسمبر→يناير عبر سهم الشهر التالي", "يناير 2027", m["decToJan"],
                  "يناير" in m["decToJan"] and "2027" in m["decToJan"])
        t.assert_("[comp] م31→فبراير يقص التحديد إلى 28 مع إعلان day-select",
                  {"title": "فبراير 2026", "sel": "2026-02-28", "events": ["2026-02-28"]},
                  {"title": m["clampTitle"], "sel": m["clampSel"], "events": m["clampEvents"]},
                  "فبراير" in m["clampTitle"] and "2026" in m["clampTitle"]
                  and m["clampSel"] == "2026-02-28" and m["clampEvents"] == ["2026-02-28"])
    # --- sample: API المثيل العام في العينة المستقلة ---
    page = t.open_target("sample", ctx)
    with t.target_scope("sample", "CAL-01"):
        feb28 = page.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          const inst = window.MicroOrderSchedule.getInstance(root);
          inst.setCalendarView('month');
          inst.setSelectedDate('2028-02-28');
          return root.querySelectorAll('.m-ocal__cell').length;
        }""")
        t.assert_("[sample] فبراير 2028 = 29 خلية عبر API المثيل", 29, feb28, feb28 == 29)
        feb27 = page.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          window.MicroOrderSchedule.getInstance(root).setSelectedDate('2027-02-15');
          return root.querySelectorAll('.m-ocal__cell').length;
        }""")
        t.assert_("[sample] فبراير 2027 = 28 خلية", 28, feb27, feb27 == 28)
        page.evaluate("""() => {
          window.MicroOrderSchedule.getInstance(document.getElementById('ocal-demo'))
            .setSelectedDate('2026-12-15');
          return true;
        }""")
        page.locator("#ocal-demo [data-ocal-action='next-month']").click()
        page.wait_for_timeout(150)
        jan = page.evaluate(JS_TITLE, "#ocal-demo")
        t.assert_("[sample] ديسمبر→يناير بسهم المستخدم", "يناير 2027", jan,
                  "يناير" in jan and "2027" in jan)
        page.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          window.MicroOrderSchedule.getInstance(root).setSelectedDate('2026-03-31');
          window.__calEv = [];
          root.addEventListener('order-schedule:day-select', (e) => window.__calEv.push(e.detail.date));
          return true;
        }""")
        page.locator("#ocal-demo [data-ocal-action='prev-month']").click()
        page.wait_for_timeout(150)
        clamp = page.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          const sel = root.querySelector('[aria-selected="true"]');
          return { title: root.querySelector('.m-ocal__cal-title').textContent,
                   sel: sel ? sel.getAttribute('data-ocal-date') : null,
                   events: window.__calEv };
        }""")
        t.assert_("[sample] قص م31→ف28 بإعلان (فعلة سهم حقيقية)",
                  {"title": "فبراير 2026", "sel": "2026-02-28", "events": ["2026-02-28"]},
                  clamp,
                  "فبراير" in clamp["title"] and clamp["sel"] == "2026-02-28"
                  and clamp["events"] == ["2026-02-28"])
    # --- src/standalone: شهر أكتوبر 2026 كاملًا في F03 ---
    for tgt in ("src", "standalone"):
        page = t.open_target(tgt, ctx)
        with t.target_scope(tgt, "CAL-01"):
            info = page.evaluate("""() => {
              const root = document.getElementById('f03-ocal');
              return { cells: root.querySelectorAll('.m-ocal__cell').length,
                       blanks: root.querySelectorAll('.m-ocal__cellblank').length,
                       title: root.querySelector('.m-ocal__cal-title').textContent };
            }""")
            t.assert_(f"[{tgt}] أكتوبر 2026 = 31 خلية يوم", 31, info["cells"], info["cells"] == 31)
            t.assert_(f"[{tgt}] بداية الأسبوع السبت: 5 خلايا بادئة قبل الخميس 1 أكتوبر", 5,
                      info["blanks"], info["blanks"] == 5)
            t.assert_(f"[{tgt}] عنوان الشهر يطابق التقويم", "أكتوبر 2026", info["title"],
                      "أكتوبر" in info["title"] and "2026" in info["title"])
    t.path_end()


def p02_today_and_markers(t: CheckTool, ctx: Ctx):
    """CAL-02: زر «اليوم» وعلامة اليوم الحالي ≠ علامة المحدد، وأسهما الشهر يغيّران الشهر فعلًا."""
    t.path_begin("CAL-02", "زر اليوم وaria-current/date مختلف عن aria-selected، وسهما الشهر يحدثان الرأس والتقويم")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        R = F03_IDS["root"] if tgt != "sample" else SMP_IDS["root"]
        with t.target_scope(tgt, "CAL-02"):
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-09']").click()
            page.wait_for_timeout(250)
            mk = page.evaluate(JS_MARKERS, R)
            t.assert_(f"[{tgt}] خلية محددة aria-selected وخلية اليوم aria-current عنصران مختلفان",
                      {"sel": "2026-10-09", "cur": "2026-10-07"},
                      {"sel": mk["selDate"], "cur": mk["curDate"], "distinct": mk["distinct"]},
                      mk["selDate"] == "2026-10-09" and mk["curDate"] == "2026-10-07" and mk["distinct"])
            t.assert_(f"[{tgt}] المعنى ليس باللون وحده: aria-label خلية اليوم يحمل «اليوم»",
                      "يحوي «اليوم»", mk["curLabel"], mk["curLabel"] and "اليوم" in mk["curLabel"])
            t.assert_(f"[{tgt}] علامة اليوم حد/شارة ≠ تعبئة البترولي للمحدد",
                      {"curClass": "cell--today", "selClass": "cell--selected"},
                      {"curClass": mk["curClass"], "selClass": mk["selClass"]},
                      "--today" in mk["curClass"] and "--selected" in mk["selClass"]
                      and "--selected" not in mk["curClass"])
            page.locator(R + " .m-ocal__todaybtn").click()
            page.wait_for_timeout(250)
            back = page.evaluate(JS_MARKERS, R)
            t.assert_(f"[{tgt}] زر «اليوم» يعيد لليوم الحالي ويحدّده",
                      {"sel": "2026-10-07"}, {"sel": back["selDate"]}, back["selDate"] == "2026-10-07")
            title = page.evaluate(JS_TITLE, R)
            t.assert_(f"[{tgt}] الرأس عاد إلى شهر اليوم", "أكتوبر 2026", title,
                      "أكتوبر" in title and "2026" in title)
            # سهما الشهر يغيّران الشهر فعلًا (رأس + شبكة)
            page.locator(R + " [data-ocal-action='prev-month']").click()
            page.wait_for_timeout(250)
            prev = page.evaluate("""(rs) => ({
              title: document.querySelector(rs + ' .m-ocal__cal-title').textContent,
              cells: document.querySelectorAll(rs + ' .m-ocal__cell').length })""", R)
            t.assert_(f"[{tgt}] السهم السابق يعرض سبتمبر 2026 (30 خلية)",
                      {"title": "سبتمبر 2026", "cells": 30}, prev,
                      "سبتمبر" in prev["title"] and prev["cells"] == 30)
            page.locator(R + " [data-ocal-action='next-month']").click()
            page.wait_for_timeout(250)
            nxt = page.evaluate("""(rs) => ({
              title: document.querySelector(rs + ' .m-ocal__cal-title').textContent,
              cells: document.querySelectorAll(rs + ' .m-ocal__cell').length })""", R)
            t.assert_(f"[{tgt}] السهم التالي يعيد أكتوبر 2026 (31 خلية)",
                      {"title": "أكتوبر 2026", "cells": 31}, nxt,
                      "أكتوبر" in nxt["title"] and nxt["cells"] == 31)
    t.path_end()


def p03_counters_dots(t: CheckTool, ctx: Ctx):
    """CAL-03: عدّادات 0/1/3/5 صحيحة ومؤشرات الحالات مسقفة ≤3."""
    t.path_begin("CAL-03", "عدّاد كل يوم يطابق عدد طلباته (0/1/3/5) ونقاط الحالات بحد أقصى 3")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        R = F03_IDS["root"] if tgt != "sample" else SMP_IDS["root"]
        with t.target_scope(tgt, "CAL-03"):
            c = page.evaluate(JS_COUNTS, R)
            t.assert_(f"[{tgt}] يوم بلا طلبات (10-02): لا عدّاد وتسميته «لا طلبات»",
                      {"count": None, "label": "لا طلبات"},
                      {"count": c["zero"]["count"], "label": c["zero"]["label"]},
                      c["zero"]["count"] is None and "لا طلبات" in c["zero"]["label"])
            t.assert_(f"[{tgt}] عدّادات اليوم/غدًا/ذات الطلب الواحد = 3/3/1",
                      {"10-07": "3", "10-08": "3", "10-09": "1"},
                      {"10-07": c["today"]["count"], "10-08": c["d8"]["count"], "10-09": c["d9"]["count"]},
                      c["today"]["count"] == "3" and c["d8"]["count"] == "3" and c["d9"]["count"] == "1")
            t.assert_(f"[{tgt}] يوم الخمسة طلبات عدّاده 5", "5", c["d22"]["count"],
                      c["d22"]["count"] == "5")
            t.assert_(f"[{tgt}] سقف نقاط الحالات ≤3 على كل الشهر", "<=3", c["maxDots"],
                      c["maxDots"] <= 3)
            t.assert_(f"[{tgt}] يوم الخمسة بثلاث حالات → 3 نقاط", 3, c["d22"]["dots"],
                      c["d22"]["dots"] == 3)
            t.assert_(f"[{tgt}] لا نقاط لخلايا بلا طلبات", 0, c["dotsWithoutCounter"],
                      c["dotsWithoutCounter"] == 0)
    t.path_end()


def p04_rows_details_back(t: CheckTool, ctx: Ctx):
    """CAL-04: اختيار يوم يعرض صفوفه داخل الصفحة؛ فتح طلب يفتح تفاصيله؛ الرجوع يحفظ الحالة والتركيز."""
    t.path_begin("CAL-04", "لوحة اليوم أسفل الشبكة داخل الصفحة، تفاصيل الطلب المطابقة، والرجوع يحفظ الموعد/العرض/التركيز")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        A = F03_IDS if tgt != "sample" else SMP_IDS
        R = A["root"]
        with t.target_scope(tgt, "CAL-04"):
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-08']").click()
            page.wait_for_timeout(300)
            panel = page.evaluate("""(rs) => ({
              rows: document.querySelectorAll(rs + ' [data-ocal-day-panel] .m-ocal__row').length,
              panelInPage: !!document.querySelector(rs + ' [data-ocal-day-panel]'),
              openDialogs: document.querySelectorAll('[role=dialog]:not([hidden])').length })""", R)
            t.assert_(f"[{tgt}] اختيار 10-08 يعرض طلباته الثلاثة أسفل الشبكة داخل الصفحة",
                      {"rows": 3, "dialogs": 0}, panel,
                      panel["rows"] == 3 and panel["panelInPage"] and panel["openDialogs"] == 0)
            page.locator(R + " .m-ocal__row[data-ocal-id='od-04']").click()
            page.wait_for_timeout(450)
            layer = page.locator("#" + A["layer"])
            t.assert_(f"[{tgt}] فتح طلب يفتح طبقة التفاصيل", True, layer.is_visible(), layer.is_visible())
            d = page.evaluate(JS_DETAIL_LAYER, A)
            t.assert_(f"[{tgt}] التفاصيل الصحيحة للطلب المفتوح (od-04)",
                      {"title": "الوفادة المرافقة…", "customer": "قاعة الملتقى",
                       "date": "الخميس 8 أكتوبر 2026", "time": "11:15", "chip": "قيد التنفيذ"},
                      d, "الوفادة المرافقة" in d["title"] and d["customer"] == "قاعة الملتقى"
                      and d["date"] == "الخميس 8 أكتوبر 2026" and d["time"] == "11:15"
                      and d["chipText"] == "قيد التنفيذ")
            page.locator("#" + A["layer"] + " [data-layer-close]").first.click()
            page.wait_for_timeout(450)
            st = page.evaluate(JS_CELL_SELECT_STATE, R)
            t.assert_(f"[{tgt}] الرجوع من التفاصيل يحفظ الموعد المختار وعرض الشهر",
                      {"sel": "2026-10-08", "view": "calendar", "calView": "month"},
                      {"sel": st["selDate"], "view": st["view"], "calView": st["calView"]},
                      st["selDate"] == "2026-10-08" and st["view"] == "calendar" and st["calView"] == "month")
            if tgt != "sample":
                page.locator("#f03-schedule-back").click()
                page.wait_for_timeout(350)
                home_vis = page.locator("#view-home").is_visible()
                focus = page.evaluate(
                    "() => document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'none'")
                t.assert_(f"[{tgt}] الرجوع من العرض → الرئيسية والتركيز على زر الطلبات المجدولة",
                          {"home": True, "focus": "f03-home-schedule"},
                          {"home": home_vis, "focus": focus},
                          home_vis and focus == "f03-home-schedule")
                page.locator("#f03-home-schedule").click()
                page.wait_for_timeout(400)
                st2 = page.evaluate(JS_CELL_SELECT_STATE, R)
                t.assert_(f"[{tgt}] العودة للجدول تحفظ حالة المثيل (اليوم المحدد والعرض)",
                          {"sel": "2026-10-08", "view": "calendar", "calView": "month"},
                          {"sel": st2["selDate"], "view": st2["view"], "calView": st2["calView"]},
                          st2["selDate"] == "2026-10-08" and st2["view"] == "calendar"
                          and st2["calView"] == "month")
    t.path_end()


def p05_views_sync(t: CheckTool, ctx: Ctx):
    """CAL-05: الشهر واليوم والقائمة على نسخة البيانات نفسها بلا تكرار أو ضياع."""
    t.path_begin("CAL-05", "تزامن شهر/يوم/قائمة: عدّ الخلية = صفوف الشهر = صفوف اليوم، وكل طلب مرة واحدة (+ حالات حدود fixtures — عقد SUI-009)")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        ensure_edge_fixtures(page, tgt)  # SUI-009: fixtures صريحة بدل البذرة الافتراضية
        A = F03_IDS if tgt != "sample" else SMP_IDS
        R = A["root"]
        with t.target_scope(tgt, "CAL-05"):
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-22']").click()
            page.wait_for_timeout(250)
            month = page.evaluate(
                "(rs) => ({ rows: document.querySelectorAll(rs + ' [data-ocal-day-panel] .m-ocal__row').length,"
                " counter: (document.querySelector(rs + ' .m-ocal__cell[data-ocal-date=\"2026-10-22\"] .m-ocal__count') || {}).textContent })",
                R)
            page.locator(R + " .m-ocal__modes-btn[data-ocal-value='day']").click()
            page.wait_for_timeout(250)
            day = page.evaluate("""(rs) => ({
              rows: document.querySelectorAll(rs + ' [data-ocal-day-panel] .m-ocal__row').length,
              title: (document.querySelector(rs + ' .m-ocal__cal-title') || {}).textContent })""", R)
            page.locator(R + " .m-ocal__views-btn[data-ocal-value='list']").click()
            page.wait_for_timeout(300)
            lst = page.evaluate(JS_LIST_STATS, R)
            t.assert_(f"[{tgt}] يوم 5 طلبات: عدّاد الخلية = صفوف الشهر = صفوف اليوم = 5",
                      {"counter": "5", "month": 5, "day": 5},
                      {"counter": month["counter"], "month": month["rows"], "day": day["rows"]},
                      month["counter"] == "5" and month["rows"] == 5 and day["rows"] == 5)
            t.assert_(f"[{tgt}] شاشة اليوم تعرض التاريخ الكامل للـ22",
                      "الخميس 22 أكتوبر 2026", day["title"], day["title"] == "الخميس 22 أكتوبر 2026")
            t.assert_(f"[{tgt}] القائمة تعرض كل طلبات الموصل مرة واحدة",
                      {"total": 24, "unique": 24, "store": 24},
                      {"total": lst["total"], "unique": lst["unique"], "store": lst["storeCount"]},
                      lst["total"] == 24 and lst["unique"] == 24 and lst["storeCount"] == 24)
            heads = [s["head"] for s in lst["secs"]]
            counts = {s["head"]: s["n"] for s in lst["secs"]}
            t.assert_(f"[{tgt}] أقسام القائمة الثلاثة بترتيبها وأعدادها",
                      {"الطلبات القادمة": 18, "الطلبات السابقة": 4, "طلبات غير مجدولة": 2},
                      counts,
                      heads == ["الطلبات القادمة", "الطلبات السابقة", "طلبات غير مجدولة"]
                      and counts.get("الطلبات القادمة") == 18 and counts.get("الطلبات السابقة") == 4
                      and counts.get("طلبات غير مجدولة") == 2)
    t.path_end()


def p06_connected_journey(t: CheckTool, ctx: Ctx):
    """CAL-06: إضافة وانتقال موعد بلا reload من المصدر الواحد (علامة window + إدخالات navigation)."""
    t.path_begin("CAL-06", "رحلة متصلة: تعديل الموعد ينقل اليوم (−1/+1) والإضافة تظهر، بلا reload، والاسم الفارغ يمنع الحفظ")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        A = F03_IDS if tgt != "sample" else SMP_IDS
        R = A["root"]
        with t.target_scope(tgt, "CAL-06"):
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-08']").click()
            page.wait_for_timeout(250)
            rows = page.locator(R + " [data-ocal-day-panel] .m-ocal__row").count()
            t.assert_(f"[{tgt}] يوم 10-08 يعرض طلباته الثلاثة قبل التعديل", 3, rows, rows == 3)
            page.locator(R + " .m-ocal__row[data-ocal-id='od-04']").click()
            page.wait_for_timeout(450)
            page.click("#" + A["edit"])
            page.wait_for_timeout(450)
            form_vis = page.locator("#" + A["form_layer"]).is_visible()
            name_val = page.locator("#" + A["name"]).input_value()
            date_val = page.locator("#" + A["date"]).input_value()
            t.assert_(f"[{tgt}] نموذج التعديل يفتح مملوءًا من الطلب",
                      {"visible": True, "date": "2026-10-08"},
                      {"visible": form_vis, "name": name_val[:30] + "…", "date": date_val},
                      form_vis and "الوفادة المرافقة" in name_val and date_val == "2026-10-08")
            page.evaluate("() => { window.__calNoReload = { n: (window.__calNoReload ? window.__calNoReload.n : 0) + 1 }; return true; }")
            page.fill("#" + A["date"], "2026-10-09")
            page.click("#" + A["save"])
            page.wait_for_timeout(900)
            nr = page.evaluate(JS_NO_RELOAD)
            st = page.evaluate(JS_CELL_SELECT_STATE, R)
            badge = page.evaluate("""(rs) => ({
              b8: (document.querySelector(rs + ' .m-ocal__cell[data-ocal-date=\"2026-10-08\"] .m-ocal__count') || {}).textContent,
              b9: (document.querySelector(rs + ' .m-ocal__cell[data-ocal-date=\"2026-10-09\"] .m-ocal__count') || {}).textContent })""", R)
            layers_closed = page.locator("#" + A["form_layer"]).is_hidden() and page.locator("#" + A["layer"]).is_hidden()
            t.assert_(f"[{tgt}] حفظ الموعد الجديد بلا reload (علامة window + navigation=1)",
                      {"marker": 1, "navEntries": 1}, nr,
                      nr["marker"] == 1 and nr["navEntries"] == 1 and layers_closed)
            t.assert_(f"[{tgt}] الطلب انتقل: القديم 3→2 والجديد 1→2 والمحدد صار اليوم الجديد",
                      {"b8": "2", "b9": "2", "sel": "2026-10-09", "rows": 2},
                      {"b8": badge["b8"], "b9": badge["b9"], "sel": st["selDate"], "rows": st["rows"],
                       "ids": st["rowIds"]},
                      badge["b8"] == "2" and badge["b9"] == "2" and st["selDate"] == "2026-10-09"
                      and st["rows"] == 2 and "od-04" in st["rowIds"])
            # الإضافة من زر الرأس: الاسم الفارغ يمنع، ثم الإضافة بموعد تظهر
            page.click("#" + A["addbar"])
            page.wait_for_timeout(450)
            count_before = page.evaluate("() => window.OrderDemoStore.count()")
            page.click("#" + A["save"])
            page.wait_for_timeout(300)
            err_vis = page.locator("#" + A["name_msg"]).is_visible()
            err_txt = page.locator("#" + A["name_msg"]).text_content()
            count_after = page.evaluate("() => window.OrderDemoStore.count()")
            t.assert_(f"[{tgt}] الحفظ بلا اسم → خطأ الحقل ولا يُضاف",
                      {"visible": True, "text": "الاسم مطلوب.", "count": count_before},
                      {"visible": err_vis, "text": err_txt, "count": count_after},
                      err_vis and err_txt == "الاسم مطلوب." and count_after == count_before)
            page.fill("#" + A["name"], "طلب اختبار CAL-06")
            page.fill("#" + A["date"], "2026-10-08")
            page.evaluate("() => { window.__calNoReload = { n: (window.__calNoReload ? window.__calNoReload.n : 0) + 1 }; return true; }")
            page.click("#" + A["save"])
            page.wait_for_timeout(900)
            nr2 = page.evaluate(JS_NO_RELOAD)
            b8b = page.evaluate(
                "(rs) => (document.querySelector(rs + ' .m-ocal__cell[data-ocal-date=\"2026-10-08\"] .m-ocal__count') || {}).textContent",
                R)
            t.assert_(f"[{tgt}] الطلب المضاف يظهر: عدّاد 10-08 صار 3 — وما زال بلا reload",
                      {"b8": "3", "marker": 2, "navEntries": 1},
                      {"b8": b8b, "marker": nr2["marker"], "navEntries": nr2["navEntries"]},
                      b8b == "3" and nr2["marker"] == 2 and nr2["navEntries"] == 1)
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-08']").click()
            page.wait_for_timeout(250)
            found = page.evaluate("""(rs) => [...document.querySelectorAll(rs + ' [data-ocal-day-panel] .m-ocal__row')]
              .some((r) => r.textContent.indexOf('طلب اختبار CAL-06') >= 0)""", R)
            rows8 = page.locator(R + " [data-ocal-day-panel] .m-ocal__row").count()
            t.assert_(f"[{tgt}] صف الطلب الجديد يظهر عند اختيار يومه (3 صفوف)",
                      {"found": True, "rows": 3}, {"found": found, "rows": rows8},
                      found and rows8 == 3)
    t.path_end()


def p07_list_sections(t: CheckTool, ctx: Ctx):
    """CAL-07: أقسام القائمة بترتيبها، والماضي لا يتحول إلى «متأخر»."""
    t.path_begin("CAL-07", "القائمة: القادمة صاعدة/السابقة الأحدث أولًا/غير المجدولة قسمها، ولا «متأخر» أبدًا (+ حالات حدود fixtures — عقد SUI-009)")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        ensure_edge_fixtures(page, tgt)  # SUI-009: fixtures صريحة بدل البذرة الافتراضية
        A = F03_IDS if tgt != "sample" else SMP_IDS
        R = A["root"]
        with t.target_scope(tgt, "CAL-07"):
            page.locator(R + " .m-ocal__views-btn[data-ocal-value='list']").click()
            page.wait_for_timeout(300)
            o = page.evaluate(JS_LIST_ORDER, R)
            t.assert_(f"[{tgt}] الأقسام الثلاثة بترتيب القادمة/السابقة/غير المجدولة",
                      ["الطلبات القادمة", "الطلبات السابقة", "طلبات غير مجدولة"], o["heads"],
                      o["heads"] == ["الطلبات القادمة", "الطلبات السابقة", "طلبات غير مجدولة"])
            t.assert_(f"[{tgt}] القادمة تبدأ من اليوم (الأقرب موعدًا) صاعدة",
                      {"first": "2026-10-07", "ascending": True, "count": 18},
                      {"first": o["upFirst"], "ascending": o["upAscending"], "count": o["upCount"]},
                      o["upFirst"] == "2026-10-07" and o["upAscending"] and o["upCount"] == 18)
            t.assert_(f"[{tgt}] أول صف قادم من اليوم نفسه مرتب بالوقت (od-01 14:30 أولًا وبلا وقت بعده)",
                      "od-01", o["upFirstId"], o["upFirstId"] == "od-01")
            t.assert_(f"[{tgt}] السابقة مجموعة بالأحدث أولًا (10-06 بالوقت ثم 10-01 ثم 09-28)",
                      ["od-p2", "od-p1", "od-p3", "od-p4"], o["pastIds"],
                      o["pastIds"] == ["od-p2", "od-p1", "od-p3", "od-p4"])
            t.assert_(f"[{tgt}] نصوص حالات الماضي من خريطة المستهلك فقط (لا «متأخر»)",
                      {"labelsKnown": True, "hasLate": False},
                      {"labelsKnown": o["pastLabelsKnown"], "labels": o["pastLabels"], "hasLate": o["hasLateWord"]},
                      o["pastLabelsKnown"] and not o["hasLateWord"])
            t.assert_(f"[{tgt}] غير المجدولة قسمها الخاص بطلبيه", ["od-u1", "od-u2"], o["unIds"],
                      o["unIds"] == ["od-u1", "od-u2"])
            dup = [i for i, v in enumerate(o["allIds"]) if o["allIds"].index(v) != i]
            t.assert_(f"[{tgt}] كل طلب مرة واحدة في نطاقه", [], dup, not dup)
    t.path_end()


def p08_states(t: CheckTool, ctx: Ctx):
    """CAL-08: loading/error+retry/empty صادقة — أزرار حقيقية في comp وAPI المثيل في أهداف الرحلة."""
    t.path_begin("CAL-08", "حالات loading/error+retry/empty: أزرار حقيقية في وثيقة المكوّن وAPI المثيل العمومي في الأهداف الثلاثة")
    # --- comp: أزرار المستهلك الحقيقية (فشل → إعادة محاولة ×2 → نجاح؛ فراغ → مرشد؛ استعادة) ---
    page = t.open_target("comp", ctx)
    with t.target_scope("comp", "CAL-08"):
        page.click("#btn-fail")
        page.wait_for_timeout(250)
        err = page.evaluate("""() => {
          const r = document.getElementById('demo-3');
          const s = r.querySelector('[data-ocal-status="error"]');
          return { hasError: !!s, text: s ? s.textContent : null,
                   hasRetry: !!r.querySelector('.m-ocal__retry') };
        }""")
        t.assert_("[comp] خطأ التحميل يعرض رسالة وزر إعادة المحاولة",
                  {"text": "تعذر تحميل الطلبات.", "retry": True}, err,
                  err["hasError"] and "تعذر" in err["text"] and err["hasRetry"])
        page.click("#demo-3 .m-ocal__retry")
        page.wait_for_timeout(200)
        loading = page.evaluate("""() => {
          const s = document.querySelector('#demo-3 [data-ocal-status="loading"]');
          return s ? s.textContent : null;
        }""")
        t.assert_("[comp] إعادة المحاولة تظهر الانتظار (لا بيانات قبل الرد)", "جارٍ تحميل الطلبات…",
                  loading, loading and "جارٍ" in loading)
        page.wait_for_timeout(700)  # المحاولة الأولى تفشل حتميًا (500ms)
        err2 = page.evaluate("() => !!document.querySelector('#demo-3 [data-ocal-status=\"error\"]')")
        t.assert_("[comp] المحاولة الأولى تعيد الخطأ (لا نجاح كاذب)", True, err2, err2)
        page.click("#demo-3 .m-ocal__retry")
        page.wait_for_timeout(900)  # الثانية تنجح وتستعيد البيانات
        rec = page.evaluate("() => document.querySelectorAll('#demo-3 .m-ocal__row').length")
        t.assert_("[comp] المحاولة الثانية تستعيد البيانات كاملة (22 طلبًا من وثيقة المكوّن)", 22, rec,
                  rec == 22)
        page.click("#btn-empty")
        page.wait_for_timeout(250)
        empty = page.evaluate("""() => {
          const s = document.querySelector('#demo-3 [data-ocal-status="empty"]');
          return { has: !!s, text: s ? s.textContent : null,
                   addGuide: !!document.querySelector('#demo-3 [data-ocal-status="empty"] [data-ocal-action="add"]') };
        }""")
        t.assert_("[comp] حالة الفراغ مع مرشد إضافة",
                  {"text": "لا توجد طلبات بعد.", "addGuide": True}, empty,
                  empty["has"] and "لا توجد طلبات" in empty["text"] and empty["addGuide"])
        page.click("#btn-restore")
        page.wait_for_timeout(250)
        restored = page.evaluate("() => document.querySelectorAll('#demo-3 .m-ocal__row').length")
        t.assert_("[comp] استعادة البيانات تعيد الصفوف (22)", 22, restored, restored == 22)
    # --- src/standalone/sample: API المثيل العمومي (getInstance) ---
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        ensure_edge_fixtures(page, tgt)  # SUI-009: fixtures صريحة بدل البذرة الافتراضية
        R = F03_IDS["root"] if tgt != "sample" else SMP_IDS["root"]
        with t.target_scope(tgt, "CAL-08"):
            st = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              const inst = window.MicroOrderSchedule.getInstance(root);
              window.__calRetry = 0;
              inst.setView('list');
              inst.setError(() => { window.__calRetry += 1; });
              const s = root.querySelector('[data-ocal-status="error"]');
              return { hasError: !!s, hasRetry: !!root.querySelector('.m-ocal__retry') };
            }""", R)
            t.assert_(f"[{tgt}] setError يعرض الخطأ مع زر إعادة المحاولة",
                      {"error": True, "retry": True}, st, st["hasError"] and st["hasRetry"])
            page.locator(R + " .m-ocal__retry").click()
            page.wait_for_timeout(200)
            retried = page.evaluate("() => window.__calRetry")
            t.assert_(f"[{tgt}] زر إعادة المحاولة يستدعي callback المستهلك مرة واحدة", 1, retried,
                      retried == 1)
            loading = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              window.MicroOrderSchedule.getInstance(root).setLoading(true);
              const s = root.querySelector('[data-ocal-status="loading"]');
              return s ? s.textContent : null;
            }""", R)
            t.assert_(f"[{tgt}] setLoading تظهر انتظارًا صادقًا (لا بيانات قديمة)",
                      "جارٍ تحميل الطلبات…", loading, loading and "جارٍ" in loading)
            rec = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              window.MicroOrderSchedule.getInstance(root).setData(window.OrderDemoStore.all());
              return root.querySelectorAll('.m-ocal__row').length;
            }""", R)
            t.assert_(f"[{tgt}] setData بعد الانتظار تستعيد كل الصفوف", 24, rec, rec == 24)
            empty = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              window.MicroOrderSchedule.getInstance(root).setData([]);
              const s = root.querySelector('[data-ocal-status="empty"]');
              return { has: !!s, text: s ? s.textContent : null,
                       addGuide: !!root.querySelector('[data-ocal-status="empty"] [data-ocal-action="add"]') };
            }""", R)
            t.assert_(f"[{tgt}] بلا طلبات: حالة فراغ مع مرشد إضافة",
                      {"text": "لا توجد طلبات بعد.", "addGuide": True}, empty,
                      empty["has"] and "لا توجد طلبات" in empty["text"] and empty["addGuide"])
            back = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              window.MicroOrderSchedule.getInstance(root).setData(window.OrderDemoStore.all());
              return root.querySelectorAll('.m-ocal__row').length;
            }""", R)
            t.assert_(f"[{tgt}] استعادة البيانات تعيد الصفوف بعد الفراغ", 24, back, back == 24)
    t.path_end()


def p09_date_time_status(t: CheckTool, ctx: Ctx):
    """CAL-09: التاريخ الكامل بالعربية في التفاصيل، الوقت فقط إن وُجد، والحالات من الخريطة."""
    t.path_begin("CAL-09", "قراءة التفاصيل: تاريخ كامل بالعربية، صف الوقت يخفى بلا وقت، وشريحة الحالة من الخريطة (المجهول بنصه — عبر fixtures صريحة، عقد SUI-009)")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        ensure_edge_fixtures(page, tgt)  # SUI-009: fixtures صريحة بدل البذرة الافتراضية
        A = F03_IDS if tgt != "sample" else SMP_IDS
        R = A["root"]
        with t.target_scope(tgt, "CAL-09"):
            # od-04: بتاريخ ووقت وحالة معروفة
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-08']").click()
            page.wait_for_timeout(250)
            page.locator(R + " .m-ocal__row[data-ocal-id='od-04']").click()
            page.wait_for_timeout(450)
            d4 = page.evaluate(JS_DETAIL_LAYER, A)
            t.assert_(f"[{tgt}] الموعد يقرأ كاملًا بالعربية (تسمية من النص لا من UTC)",
                      "الخميس 8 أكتوبر 2026", d4["date"], d4["date"] == "الخميس 8 أكتوبر 2026")
            t.assert_(f"[{tgt}] الوقت يظهر فقط إن وُجد (od-04 عند 11:15)",
                      {"hidden": False, "time": "11:15"},
                      {"hidden": d4["timeRowHidden"], "display": d4["timeRowDisplay"], "time": d4["time"]},
                      d4["timeRowHidden"] is False and d4["time"] == "11:15")
            t.assert_(f"[{tgt}] الحالة نصًا من خريطة المستهلك", "قيد التنفيذ", d4["chipText"],
                      d4["chipText"] == "قيد التنفيذ" and "progress" in d4["chipClass"])
            page.locator("#" + A["layer"] + " [data-layer-close]").first.click()
            page.wait_for_timeout(400)
            # od-u1: غير مجدول بلا وقت
            page.locator(R + " .m-ocal__views-btn[data-ocal-value='list']").click()
            page.wait_for_timeout(300)
            page.locator(R + " .m-ocal__row[data-ocal-id='od-u1']").click()
            page.wait_for_timeout(450)
            du = page.evaluate(JS_DETAIL_LAYER, A)
            t.assert_(f"[{tgt}] غير المجدول: «غير مجدول» وصف الوقت مخفي فعليًا (لا وقت مخترع)",
                      {"date": "غير مجدول", "timeRow": "hidden"},
                      {"date": du["date"], "hidden": du["timeRowHidden"], "display": du["timeRowDisplay"]},
                      du["date"] == "غير مجدول" and du["timeRowHidden"] is True
                      and du["timeRowDisplay"] == "none" and du["time"] == "")
            page.locator("#" + A["layer"] + " [data-layer-close]").first.click()
            page.wait_for_timeout(400)
            # od-10: مفتاح حالة غير معروف → محايد بنصه الخام
            page.locator(R + " .m-ocal__row[data-ocal-id='od-10']").click()
            page.wait_for_timeout(450)
            d10 = page.evaluate(JS_DETAIL_LAYER, A)
            t.assert_(f"[{tgt}] المفتاح المجهول يظهر محايدًا بنصه الخام في التفاصيل",
                      {"chipText": "mystery", "tone": "neutral"},
                      {"chipText": d10["chipText"], "chipClass": d10["chipClass"]},
                      d10["chipText"] == "mystery" and "neutral" in d10["chipClass"])
            t.assert_(f"[{tgt}] تاريخ od-10 كاملًا بالعربية", "الخميس 15 أكتوبر 2026", d10["date"],
                      d10["date"] == "الخميس 15 أكتوبر 2026")
            page.locator("#" + A["layer"] + " [data-layer-close]").first.click()
            page.wait_for_timeout(300)
    t.path_end()


def p10_robustness(t: CheckTool, ctx: Ctx):
    """CAL-10: عنوان طويل بلا كسر، مفتاح مجهول محايد، ولا HTML من البيانات."""
    t.path_begin("CAL-10", "عنوان طويل يلتف بلا فيض، mystery محايد بنصه، وحقن <b>/<img> يظهر نصًا حرفيًا (window.__xss غير مفعّل) — عبر fixtures صريحة (عقد SUI-009)")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        ensure_edge_fixtures(page, tgt)  # SUI-009: fixtures صريحة بدل البذرة الافتراضية
        A = F03_IDS if tgt != "sample" else SMP_IDS
        R = A["root"]
        with t.target_scope(tgt, "CAL-10"):
            page.locator(R + " .m-ocal__views-btn[data-ocal-value='list']").click()
            page.wait_for_timeout(300)
            r = page.evaluate(JS_ROW_TITLE_WRAP, R)
            t.assert_(f"[{tgt}] العنوان الطويل جدًا يلتف دون كسر الصف",
                      True, {"wraps": r["longRowWraps"]}, r["longRowWraps"] is True)
            ov = page.evaluate("() => window.CALh.overflow()")
            t.assert_(f"[{tgt}] لا فيض أفقي للصفحة مع العنوان الطويل", False,
                      {"scrollW": ov["scrollW"], "docW": ov["docW"]}, not ov["overflow"])
            t.assert_(f"[{tgt}] مفتاح الحالة المجهول محايد بنصه في الصف",
                      {"label": "mystery", "class": "neutral"},
                      {"label": r["mysteryLabel"], "class": r["mysteryClass"]},
                      r["mysteryLabel"] == "mystery" and "--neutral" in r["mysteryClass"])
            t.assert_(f"[{tgt}] لا عناصر b/img من البيانات داخل المكوّن وwindow.__xss غير مفعّل",
                      {"b": 0, "img": 0, "xss": False},
                      {"b": r["rootB"], "img": r["rootImg"], "xss": r["xssArmed"],
                       "injText": (r["injText"] or "")[:40]},
                      r["rootB"] == 0 and r["rootImg"] == 0 and r["xssArmed"] is False
                      and r["injHasMarkup"] is False and "<b>" in (r["injText"] or ""))
            page.locator(R + " .m-ocal__row[data-ocal-id='od-inj']").click()
            page.wait_for_timeout(450)
            inj = page.evaluate(JS_DETAIL_LAYER, A)
            t.assert_(f"[{tgt}] حقن العنوان يظهر نصًا حرفيًا في طبقة التفاصيل أيضًا",
                      {"titleHasLiteral": True, "layerB": 0, "xss": False},
                      {"title": (inj["title"] or "")[:40], "layerB": inj["layerB"]},
                      "<b>" in (inj["title"] or "") and inj["layerB"] == 0)
            xss2 = page.evaluate("() => typeof window.__xss !== 'undefined'")
            t.assert_(f"[{tgt}] onerror لم ينفذ بعد فتح التفاصيل", False, xss2, xss2 is False)
            page.locator("#" + A["layer"] + " [data-layer-close]").first.click()
            page.wait_for_timeout(300)
    t.path_end()


def p11_sizes(t: CheckTool, ctx: Ctx):
    """CAL-11: مقاسات 320/360/390/430 + نص×2: أزرار رئيسية ≥48 وخلايا الشهر PROPOSED بأرقام مقيسة."""
    t.path_begin("CAL-11", "لا فيض أفقي على المقاسات الأربعة، الأزرار/الصفوف ≥48px، خلايا الشهر PROPOSED بأرقام مقيسة، نص×2 بلا فيض")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        R = F03_IDS["root"] if tgt != "sample" else SMP_IDS["root"]
        with t.target_scope(tgt, "CAL-11"):
            page.locator(R + " .m-ocal__cell[data-ocal-date='2026-10-08']").click()
            page.wait_for_timeout(250)
            recorded = {}
            for w in WIDTHS:
                page.set_viewport_size({"width": w, "height": 844})
                page.wait_for_timeout(300)
                m = page.evaluate("(rs) => window.CALh.measure(rs)", R)
                recorded[w] = {"cellW": m["cellW"][:3], "nav": m["navs"], "today": m["today"],
                               "rows": m["rows"][:1], "nCells": m["nCells"]}
                ov = page.evaluate("() => window.CALh.overflow()")
                t.assert_(f"[{tgt}] عرض {w}: لا فيض أفقي", False,
                          {"scrollW": ov["scrollW"], "docW": ov["docW"]}, not ov["overflow"])
                ok_targets = (all(n["h"] >= 47.5 for n in m["navs"]) and m["today"]["h"] >= 47.5
                              and all(s["h"] >= 47.5 for s in m["switches"])
                              and all(rw["h"] >= 47.5 for rw in m["rows"]))
                t.assert_(f"[{tgt}] عرض {w}: سهما الشهر واليوم والتبديلات والصفوف ≥48px",
                          ">=48", {"navs": m["navs"], "today": m["today"],
                                   "switches": m["switches"][:2], "rows": m["rows"][:2]},
                          ok_targets)
                squares = all(abs(cw - ch) <= max(2.0, 0.12 * cw)
                              for cw, ch in zip(m["cellW"][:4], m["cellH"][:4]))
                t.assert_(f"[{tgt}] عرض {w}: الخلايا مربعة", True,
                          {"cellW": m["cellW"][:3], "cellH": m["cellH"]}, squares)
                if w == 320:
                    t.assert_(f"[{tgt}] خلايا الشهر عند 320 ضمن PROPOSED (~37.7px موثقة — لا ادعاء 48)",
                              "36..40", m["cellW"][:3], m["cellW"] and 36 <= min(m["cellW"]) <= 40)
            page.evaluate("() => window.CALh.zoom2()")
            page.wait_for_timeout(300)
            ovz = page.evaluate("() => window.CALh.overflow()")
            t.assert_(f"[{tgt}] 320 + نص×2 (محاكاة مرورين معلنة): لا فيض أفقي", False,
                      {"scrollW": ovz["scrollW"], "docW": ovz["docW"]}, not ovz["overflow"])
            page.evaluate("() => window.CALh.unzoom()")
            page.wait_for_timeout(200)
            t.assert_(f"[{tgt}] القياسات الفعلية موثقة بالتفصيل (PROPOSED)",
                      "أرقام مقيسة", recorded, True, extra=recorded)
    t.path_end()


def p12_keyboard(t: CheckTool, ctx: Ctx):
    """CAL-12: لوحة مفاتيح حقيقية (أسهم/Enter/Tab) وroving وaria-selected وحيد، وreduced-motion بلا انتقالات."""
    t.path_begin("CAL-12", "أسهم الشبكة وEnter بلوحة مفاتيح حقيقية، Tab واحد يخرج من الشبكة (roving)، aria-selected وحيد، reduced-motion بلا انتقالات")
    for tgt in ("src", "standalone", "sample"):
        page = t.open_target(tgt, ctx)
        R = F03_IDS["root"] if tgt != "sample" else SMP_IDS["root"]
        with t.target_scope(tgt, "CAL-12"):
            focus0 = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              window.__calEv = { day: 0 };
              root.addEventListener('order-schedule:day-select', () => { window.__calEv.day += 1; });
              const sel = root.querySelector('.m-ocal__cell[aria-selected="true"]');
              sel.focus();
              return document.activeElement.getAttribute('data-ocal-date');
            }""", R)
            t.assert_(f"[{tgt}] التركيز يبدأ على الخلية المحددة (اليوم)", "2026-10-07", focus0,
                      focus0 == "2026-10-07")
            page.keyboard.press("ArrowLeft")  # RTL: السهم الأيسر = اليوم التالي
            page.wait_for_timeout(200)
            kb1 = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              const cells = [...root.querySelectorAll('.m-ocal__cell')];
              return { focusDate: document.activeElement.getAttribute('data-ocal-date'),
                       tabbable: cells.filter((c) => c.tabIndex === 0).length };
            }""", R)
            t.assert_(f"[{tgt}] ArrowLeft (RTL) ينقل التركيز إلى اليوم التالي 10-08",
                      "2026-10-08", kb1["focusDate"], kb1["focusDate"] == "2026-10-08")
            t.assert_(f"[{tgt}] roving: خلية واحدة قابلة للـTab داخل الشبكة", 1, kb1["tabbable"],
                      kb1["tabbable"] == 1)
            page.keyboard.press("Enter")
            page.wait_for_timeout(250)
            kb2 = page.evaluate("""(rs) => {
              const root = document.querySelector(rs);
              return { selDate: (root.querySelector('.m-ocal__cell[aria-selected="true"]') || {}).getAttribute('data-ocal-date'),
                       nSelected: root.querySelectorAll('.m-ocal__cell[aria-selected="true"]').length,
                       events: window.__calEv.day };
            }""", R)
            t.assert_(f"[{tgt}] Enter يختار الخلية المركّزة بحدث واحد وaria-selected وحيد",
                      {"sel": "2026-10-08", "n": 1, "events": 1}, kb2,
                      kb2["selDate"] == "2026-10-08" and kb2["nSelected"] == 1 and kb2["events"] == 1)
            page.keyboard.press("Tab")
            page.wait_for_timeout(200)
            in_grid = page.evaluate(
                "() => !!(document.activeElement.closest && document.activeElement.closest('.m-ocal__grid'))")
            t.assert_(f"[{tgt}] Tab واحد يخرج من الشبكة (لا عشرات التوقفات)", False, in_grid,
                      in_grid is False)
    # reduced-motion أصلي (سياق Playwright) على العينة المستقلة
    rctx = ctx.browser.new_context(viewport=VIEW, reduced_motion="reduce")
    rpage = rctx.new_page()
    t.track(rpage, "sample")
    with t.target_scope("sample", "CAL-12"):
        rpage.goto(ctx.urls["sample"])
        rpage.wait_for_function(
            "() => document.querySelectorAll('#ocal-demo .m-ocal__cell').length >= 30", timeout=10000)
        tr = rpage.evaluate("""() => {
          const sels = ['.m-ocal__cell', '.m-ocal__views-btn', '.m-ocal__modes-btn',
                        '.m-ocal__navbtn', '.m-ocal__todaybtn', '.m-ocal__row', '.m-ocal__add'];
          const bad = [];
          sels.forEach((s) => {
            document.querySelectorAll('#ocal-demo ' + s).forEach((el) => {
              const cs = getComputedStyle(el);
              if (cs.transitionDuration !== '0s' || cs.animationName !== 'none') {
                bad.push({ sel: s, td: cs.transitionDuration, an: cs.animationName });
              }
            });
          });
          return { n: bad.length, bad: bad.slice(0, 4) };
        }""")
        t.assert_("[sample/reduced-motion] لا انتقالات على عناصر المكوّن (سياق أصلي)",
                  0, tr, tr["n"] == 0)
    rctx.close()
    t.path_end()


def p13_events_integrity(t: CheckTool, ctx: Ctx):
    """CAL-13: فعلة واحدة = حدث واحد؛ تهيئة مزدوجة آمنة؛ destroy يوقف كل حدث."""
    t.path_begin("CAL-13", "نقرتان سريعتان = حدثان لا أكثر، تهيئة مزدوجة نفس المثيل وحدث واحد، وdestroy يوقف كل الأحداث")
    # --- sample: نقرات حقيقية متتالية + init مزدوج + فتح تفاصيل مرة ---
    page = t.open_target("sample", ctx)
    with t.target_scope("sample", "CAL-13"):
        page.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          window.__calEv = { day: 0, open: 0 };
          root.addEventListener('order-schedule:day-select', () => { window.__calEv.day += 1; });
          root.addEventListener('order-schedule:order-open', () => { window.__calEv.open += 1; });
          return true;
        }""")
        cell = page.locator("#ocal-demo .m-ocal__cell[data-ocal-date='2026-10-05']")
        cell.click()
        cell.click()
        page.wait_for_timeout(300)
        ev = page.evaluate("() => window.__calEv")
        t.assert_("[sample] نقرتان سريعتان على خلية = حدثا day-select فقط (لا ازدواج داخلي)",
                  2, ev["day"], ev["day"] == 2)
        di = page.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          const i2 = window.MicroOrderSchedule.init(root, {});
          window.__calEv.day = 0;
          root.querySelector('.m-ocal__cell[data-ocal-date="2026-10-06"]').click();
          return { same: i2 === window.__OCAL_SAMPLE.inst, day: window.__calEv.day };
        }""")
        t.assert_("[sample] التهيئة المزدوجة ترجع المثيل نفسه وبفعلة واحدة حدث واحد",
                  {"same": True, "day": 1}, di, di["same"] and di["day"] == 1)
        op = page.evaluate("""() => {
          window.__calEv.open = 0;
          const root = document.getElementById('ocal-demo');
          const row = root.querySelector('.m-ocal__row[data-ocal-id="od-p1"]');
          if (row) row.click();
          return { open: window.__calEv.open, layers: window.__OCAL_SAMPLE.state.openLayers };
        }""")
        t.assert_("[sample] فتح طلب مرة واحدة = حدث order-open واحد وطبقة واحدة",
                  {"open": 1, "layers": 1}, op, op["open"] == 1 and op["layers"] == 1)
        page.locator("#ocal-order-layer [data-layer-close]").first.click()
        page.wait_for_timeout(400)
    # --- comp: قيادة leader نفسها (init مزدوج + destroy + إعادة تهيئة) ---
    page = t.open_target("comp", ctx)
    with t.target_scope("comp", "CAL-13"):
        d = page.evaluate("""() => {
          const root = document.querySelector('#demo-1');
          const i1 = window.MicroOrderSchedule.init(root, {});
          const i2 = window.MicroOrderSchedule.init(root, {});
          window.__calC = { day: 0, open: 0 };
          root.addEventListener('order-schedule:day-select', () => { window.__calC.day += 1; });
          root.addEventListener('order-schedule:order-open', () => { window.__calC.open += 1; });
          root.querySelector('.m-ocal__cell[data-ocal-date="2026-10-07"]').click();
          const dayPerClick = window.__calC.day;
          const row = root.querySelector('.m-ocal__row[data-ocal-id="od-01"]');
          if (row) row.click();
          const openPerClick = window.__calC.open;
          i1.destroy();
          window.__calC.day = 0; window.__calC.open = 0;
          const cellAfter = root.querySelector('.m-ocal__cell');
          if (cellAfter) cellAfter.click();
          const afterDestroy = window.__calC.day + window.__calC.open;
          return { same: i1 === i2, dayPerClick, openPerClick, afterDestroy,
                   gridCleared: !cellAfter };
        }""")
        t.assert_("[comp] تهيئة مزدوجة = المثيل نفسه؛ فعلة واحدة = حدث واحد (يوم/فتح)",
                  {"same": True, "day": 1, "open": 1}, d,
                  d["same"] and d["dayPerClick"] == 1 and d["openPerClick"] == 1)
        t.assert_("[comp] destroy يوقف كل الأحداث ويفرّغ الجذر",
                  {"afterDestroy": 0, "gridCleared": True}, d,
                  d["afterDestroy"] == 0 and d["gridCleared"])
        re = page.evaluate("""() => {
          const root = document.querySelector('#demo-1');
          const inst = window.MicroOrderSchedule.init(root, {
            orders: window.__OCAL_DEMO.orders, statuses: window.__OCAL_DEMO.statuses,
            today: '2026-10-07', weekStart: 6, selectedDate: '2026-10-07' });
          return { cells: root.querySelectorAll('.m-ocal__cell').length, has: !!inst };
        }""")
        t.assert_("[comp] إعادة التهيئة بعد destroy تعمل (31 خلية أكتوبر)",
                  {"cells": 31, "has": True}, re, re["cells"] == 31 and re["has"])
    t.path_end()


def p14_no_external_parity(t: CheckTool, ctx: Ctx):
    """CAL-14: بلا موارد خارجية فاشلة، standalone مكتفٍ، بناء حتمي، والأعمدة نفسها بالنتيجة نفسها على الأهداف الثلاثة."""
    t.path_begin("CAL-14", "المصدر/standalone/sample بلا موارد فاشلة أو خارجية، standalone بلا طلبات جانبية، بناء حتمي، وتكافؤ الأعمدة")
    std_uri = ctx.urls["standalone"]
    with t.target_scope("standalone", "CAL-14"):
        run = subprocess.run([sys.executable, str(ROOT / "tools" / "build-f03-standalone.py"), "--check"],
                             cwd=ROOT, capture_output=True, text=True)
        t.assert_("بناء standalone حتمي (بايت-ببايت + أيقونات)", 0,
                  {"rc": run.returncode, "out": run.stdout.strip()[:120]},
                  run.returncode == 0 and "CHECK OK" in run.stdout and "ICON CHECK OK" in run.stdout)
        external = [u for u in t.requests["standalone"] if not (u.startswith("file://") or u.startswith("data:"))]
        t.assert_("standalone عبر file://: صفر طلبات خارج الشيفرة نفسها", [], external,
                  len(external) == 0)
        side = [u for u in t.requests["standalone"] if u.startswith("file://") and u != std_uri]
        t.assert_("standalone: صفر طلبات ملفات جانبية file://", [], side, len(side) == 0)
    with t.target_scope("sample", "CAL-14"):
        ext_smp = [u for u in t.requests["sample"] if not (u.startswith("file://") or u.startswith("data:"))]
        t.assert_("العينة المستقلة عبر file://: كل الطلبات محلية (لا خارجية)", [], ext_smp,
                  len(ext_smp) == 0)
        fail_smp = t.resource_failures["sample"]
        t.assert_("العينة المستقلة: صفر موارد فاشلة (requestfailed/HTTP≥400)", [], fail_smp[:4],
                  len(fail_smp) == 0)
    with t.target_scope("src", "CAL-14"):
        ext_src = [u for u in t.requests["src"]
                   if not (u.startswith("http://127.0.0.1:") or u.startswith("data:"))]
        t.assert_("المصدر عبر HTTP: كل الطلبات من الخادم المحلي فقط", [], ext_src, len(ext_src) == 0)
        fail_src = t.resource_failures["src"]
        t.assert_("المصدر: صفر موارد فاشلة", [], fail_src[:4], len(fail_src) == 0)
    # تكافؤ الأعمدة: نفس أعمدة الرحلة بالنتيجة نفسها على الأهداف الثلاثة
    with t.target_scope("src", "CAL-14"):
        parity_table = {}
        missing = []
        for cid in SHARED_JOURNEY:
            row = {tgt: t.parity[tgt].get(cid) for tgt in ("src", "standalone", "sample")}
            parity_table[cid] = row
            if not all(v is True for v in row.values()):
                missing.append({cid: row})
        t.assert_("الأعمدة CAL-01..12 نفسها بالنتيجة نفسها (PASS) على src/standalone/sample",
                  "كلها True", parity_table, not missing, extra=parity_table)
    t.path_end()


def p15_screenshots(t: CheckTool, ctx: Ctx):
    """CAL-15: لقطات فعلية للقراءة البصرية اللاحقة — الفحص الآلي يثبت وجودها وغير فارغة (>10KB)."""
    t.path_begin("CAL-15", "لقطات فعلية: شهر مختار، يوم بخمسة طلبات، القائمة، نموذج الإضافة، التفاصيل — مثبتة وغير فارغة")
    names = ["cal-15-month-390.png", "cal-15-five-orders-day-390.png", "cal-15-list-390.png",
             "cal-15-add-form-390.png", "cal-15-details-390.png",
             "cal-15-f03-schedule-390.png", "cal-15-f03-details-390.png"]
    # --- العينة المستقلة ---
    page = t.open_target("sample", ctx)
    with t.target_scope("sample", "CAL-15"):
        t.shot(page, "cal-15-month-390.png", full=True)
        page.locator("#ocal-demo .m-ocal__cell[data-ocal-date='2026-10-22']").click()
        page.wait_for_timeout(300)
        t.shot(page, "cal-15-five-orders-day-390.png", full=True)
        page.locator("#ocal-demo .m-ocal__views-btn[data-ocal-value='list']").click()
        page.wait_for_timeout(300)
        t.shot(page, "cal-15-list-390.png", full=True)
        page.locator("#ocal-demo .m-ocal__views-btn[data-ocal-value='calendar']").click()
        page.wait_for_timeout(250)
        page.click("#ocal-demo-add")
        page.wait_for_timeout(450)
        t.shot(page, "cal-15-add-form-390.png")
        page.click("#ocal-order-cancel")
        page.wait_for_timeout(400)
        page.locator("#ocal-demo .m-ocal__cell[data-ocal-date='2026-10-08']").click()
        page.wait_for_timeout(250)
        page.locator("#ocal-demo .m-ocal__row[data-ocal-id='od-04']").click()
        page.wait_for_timeout(450)
        t.shot(page, "cal-15-details-390.png")
        page.locator("#ocal-order-layer [data-layer-close]").first.click()
        page.wait_for_timeout(300)
    # --- F03 (HTTP) ---
    page = t.open_target("src", ctx)
    with t.target_scope("src", "CAL-15"):
        page.locator("#f03-ocal .m-ocal__cell[data-ocal-date='2026-10-22']").click()
        page.wait_for_timeout(300)
        t.shot(page, "cal-15-f03-schedule-390.png")
        page.locator("#f03-ocal .m-ocal__row[data-ocal-id='od-22a']").click()
        page.wait_for_timeout(450)
        t.shot(page, "cal-15-f03-details-390.png")
        page.locator("#f03-order-layer [data-layer-close]").first.click()
        page.wait_for_timeout(300)
    # --- إثبات الوجود والامتلاء ---
    with t.target_scope("sample", "CAL-15"):
        sizes = {}
        ok_all = True
        for name in names:
            p = t.shots / name
            sz = p.stat().st_size if p.exists() else 0
            sizes[name] = sz
            if not p.exists() or sz <= 10240:
                ok_all = False
        t.assert_("كل اللقطات موجودة وغير فارغة (> 10KB لكل ملف)", ">10240", sizes, ok_all,
                  extra=sizes)
    t.path_end()


PATHS = [
    p01_calendar_math, p02_today_and_markers, p03_counters_dots, p04_rows_details_back,
    p05_views_sync, p06_connected_journey, p07_list_sections, p08_states,
    p09_date_time_status, p10_robustness, p11_sizes, p12_keyboard,
    p13_events_integrity, p14_no_external_parity, p15_screenshots,
]


def run(browser, urls, out_dir: Path):
    tool = CheckTool(out_dir)
    pages = {}
    for tgt in TARGETS:
        pg = browser.new_page(viewport=VIEW)
        tool.track(pg, tgt)
        pages[tgt] = pg
    ctx = Ctx(pages, urls, browser)
    for fn in PATHS:
        try:
            fn(tool, ctx)
        except Exception as e:  # noqa
            if tool.current:
                tool.current["failures"].append(f"exception: {type(e).__name__}: {e}")
                tool.current["result"] = "FAIL"
                tool.current = None
            else:
                tool.results.append({"id": "??", "path": "exception", "assertions": [],
                                     "failures": [str(e)], "targets": [], "result": "FAIL"})
    browser.close()
    # الحسم الجامع: أخطاء صفحة وموارد لكل هدف على حدة
    agg = {"id": "CAL-AGG", "path": "صفر أخطاء صفحة وصفر فشل موارد لكل هدف على حدة",
           "assertions": [], "failures": [], "targets": list(TARGETS), "result": "PASS"}
    for tgt in TARGETS:
        agg["assertions"].append({"name": f"أخطاء صفحة — {tgt}", "expected": 0,
                                  "measured": len(tool.errors[tgt]), "pass": len(tool.errors[tgt]) == 0})
        agg["assertions"].append({"name": f"فشل موارد — {tgt}", "expected": 0,
                                  "measured": len(tool.resource_failures[tgt]),
                                  "pass": len(tool.resource_failures[tgt]) == 0})
        if tool.errors[tgt]:
            agg["failures"].append(f"page errors {tgt}")
            agg.setdefault("page_errors", {})[tgt] = tool.errors[tgt][:8]
        if tool.resource_failures[tgt]:
            agg["failures"].append(f"resource failures {tgt}")
            agg.setdefault("resource_failures", {})[tgt] = tool.resource_failures[tgt][:8]
    if agg["failures"]:
        agg["result"] = "FAIL"
    tool.results.append(agg)
    return tool


def git_info():
    """تُلتقط قبل أي كتابة (مجلد الإخراج ينشأ لاحقًا) — حالة checkout الصادقة."""
    try:
        commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True,
                                text=True).stdout.strip()
        tree = subprocess.run(["git", "rev-parse", "HEAD^{tree}"], cwd=ROOT, capture_output=True,
                              text=True).stdout.strip()
        status = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT, capture_output=True,
                                text=True).stdout.strip()
        branch = subprocess.run(["git", "branch", "--show-current"], cwd=ROOT, capture_output=True,
                                text=True).stdout.strip()
        return {"commit": commit, "tree": tree, "branch": branch or None,
                "dirty_files": status, "status_clean": status == ""}
    except Exception as e:  # noqa
        return {"commit": None, "tree": None, "error": str(e)}


def main():
    # SAMSUNG-ONEUI-REPAIR-R1 (الوكيل 4 — جولة الرجعية 2026-10-07): وسيطا
    # --out و--port اختياريان لإعادة تشغيل الرجعية بمخرجات معزولة (مثل أدلة
    # evidence/agent4/regression/) دون الكتابة فوق الأدلة التاريخية في
    # reviews/ORDER-SCHEDULE/، ولتثبيت الخادم على منفذ ضمن نطاق الوكيل 4
    # (4400-4419) بدل منفذ تلقائي. الافتراضات كما كانت بلا تغيير سلوك.
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(OUT),
                    help="دليل الإخراج (الافتراضي reviews/ORDER-SCHEDULE التاريخي)")
    ap.add_argument("--port", type=int, default=0,
                    help="منفذ الخادم (0 = تلقائي؛ أثناء REPAIR-R1 استخدم 4400-4419)")
    args = ap.parse_args()
    out_dir = Path(args.out).resolve()

    git_meta = git_info()

    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    handler = lambda *a, **k: QuietHandler(*a, directory=str(ROOT), **k)
    srv = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    urls = {
        "src": f"http://127.0.0.1:{port}/{F03_REL}/index.html",
        "standalone": STANDALONE_PAGE.as_uri(),
        "sample": SAMPLE_PAGE.as_uri(),
        "comp": COMP_PAGE.as_uri(),
    }

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        version = browser.version
        tool = run(browser, urls, out_dir)

    passed = sum(1 for r in tool.results if r["result"] == "PASS")
    failed = [r["id"] for r in tool.results if r["result"] == "FAIL"]
    assertions = sum(len(r["assertions"]) for r in tool.results)
    per_target = {}
    for tgt in TARGETS:
        vals = list(tool.parity[tgt].values())
        per_target[tgt] = {"checks": len(vals), "passed": sum(1 for v in vals if v)}
    doc = {
        "tool": "tools/order-schedule-check.py",
        "experience": "جدول الطلبات المجدولة (ORDER-SCHEDULE) — مصفوفة CAL-01..15 من بطاقة القبول docs/ux/ORDER-SCHEDULE-ACCEPTANCE.md",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": git_meta,
        "source_note": "git_meta التُقطت قبل إنشاء مجلد الإخراج؛ الأداة نفسها غير مثبتة بعد (القائد يثبّت) لذا قد تظهر dirty_files",
        "browser": {"engine": "Chromium", "version": version, "headless": True},
        "targets": {
            "src": {"url": urls["src"], "how": "HTTP عبر خادم محلي ThreadingHTTPServer (127.0.0.1) — تجربة F03 الكاملة"},
            "standalone": {"url": urls["standalone"], "how": "file:// — الملف الواحد المولّد حتميًا (تجربة F03 نفسها)"},
            "sample": {"url": urls["sample"], "how": "file:// — العينة المستقلة (order-store + طبقات B07)"},
            "comp": {"url": urls["comp"], "how": "file:// — وثيقة المكوّن example-usage.html (رياضيات API المثيل وحالات الخطأ/الفراغ وinit/destroy)"},
        },
        "widths": WIDTHS,
        "zoom_policy": "محاكاة تكبير نص ×2 بمرورين نظيفين (قراءة الأحجام المحسوبة لكل العناصر ثم تطبيقها كي لا تتضاعف الموروثة) — ليست native zoom؛ المرجع WCAG 1.4.4/1.4.10 للمراجعة لا ادعاء امتثال شامل",
        "paths": tool.results,
        "summary": {
            "paths_total": len(tool.results),
            "paths_passed": passed,
            "paths_failed": failed,
            "assertions_total": assertions,
            "page_errors_by_target": {tgt: len(tool.errors[tgt]) for tgt in TARGETS},
            "resource_failures_by_target": {tgt: len(tool.resource_failures[tgt]) for tgt in TARGETS},
            "per_target_checks": per_target,
            "not_run": [
                "جهاز Samsung Galaxy S25 الحقيقي وSamsung Internet",
                "أجهزة Android/iOS الفعلية واللمس ولوحة النظام وsafe areas ورجوع النظام",
                "TalkBack/VoiceOver وقارئ شاشة فعلي",
                "WebKit/Safari",
                "native zoom (المستخدم محاكاة نص ×2 بمرورين معلنة)",
                "القراءة البصرية البشرية للقطات CAL-15 (الأداة تثبت وجودها وغير فارغة — الحكم النهائي للقائد)",
            ],
            "limits": [
                "حالات الخطأ/الانتظار/الفراغ في أهداف الرحلة تُحقق عبر API المثيل العمومي getInstance (لا أزرار مستهلك مكشوفة هناك)؛ أزرار حقيقية في example-usage (comp)",
                "prefers-reduced-motion مُحقق بسياق Playwright أصلي على العينة المستقلة (عناصر المكوّن) لا على كل أهداف F03",
                "CAL-14 تكافؤ الأعمدة يشمل CAL-01..12 على src/standalone/sample؛ CAL-13 مكونية (comp) + سلوك العينة",
            ],
        },
    }
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "verification.json").write_text(json.dumps(doc, ensure_ascii=False, indent=2),
                                               encoding="utf-8")
    lines = [
        f"ORDER-SCHEDULE (CAL) — نتائج الفحص ({doc['generated_at_utc']})",
        f"المصدر: commit {git_meta.get('commit')} tree {git_meta.get('tree')} "
        f"branch {git_meta.get('branch')} clean={git_meta.get('status_clean')}",
        f"المحرك: Chromium {version} headless",
        "الأهداف: src=HTTP (F03)؛ standalone=file:// (F03 ملف واحد)؛ sample=file:// (عينة مستقلة)؛ comp=file:// (وثيقة المكوّن)",
        f"طريقة التكبير: {doc['zoom_policy']}",
        "",
    ]
    for r in tool.results:
        tg = ("؛ أهداف: " + "، ".join(r.get("targets", []))) if r.get("targets") else ""
        lines.append(f"[{r['result']}] {r['id']} — {r['path']} ({len(r['assertions'])} تحقيقًا){tg}")
        if r["failures"]:
            for f in r["failures"]:
                lines.append(f"    FAIL: {f}")
    lines.append("")
    lines.append(f"الملخص: {passed}/{len(tool.results)} مسارًا ناجحًا — {assertions} تحقيقًا")
    lines.append("أخطاء صفحة لكل هدف: " + "؛ ".join(
        f"{tgt}={len(tool.errors[tgt])}" for tgt in TARGETS))
    lines.append("فشل موارد لكل هدف: " + "؛ ".join(
        f"{tgt}={len(tool.resource_failures[tgt])}" for tgt in TARGETS))
    lines.append("فحوص لكل هدف (تكافؤ): " + "؛ ".join(
        f"{tgt} {per_target[tgt]['passed']}/{per_target[tgt]['checks']}" for tgt in TARGETS))
    lines.append("NOT RUN: " + "؛ ".join(doc["summary"]["not_run"]))
    (out_dir / "verification.txt").write_text("\n".join(lines), encoding="utf-8")

    print("\n".join(lines[-8:]))
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()
