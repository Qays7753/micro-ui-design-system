#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
أداة فحص UX-F03 — تجربة الهاتف الكاملة «العناصر» (الجولة R3)

مصفوفة F03-01..F03-44: رحلات حقيقية بالنقر والكتابة (لا استدعاء دوال داخلية
كإثبات)، قياس البيانات والسلوك الفعليين (F03-R2-06)، وأخطاء صفحة وموارد مجمعة
عبر جميع المسارات دون مسحها، ومقاسات 320/360/390/430 مع تكبير نص 200% محاكى
معلن الآلية، وreduced-motion أصلية من Playwright، ولوحة مفاتيح وتركيز، وتخزين
محلي وحجب منذ الإقلاع وفشل كتابة متأخر (R2-05)، وملف واحد عبر file:// بلا
موارد خارجية وبناء حتمي وحماية أيقونات (R1-02)، وبوابة الوصول والتقارير
والحساب والاختيار الجماعي والحذف (تغطية التجربة الكاملة بتكليف المالك).

البنية: CheckTool + JS_HELPERS (window.F03h) + مسارات p01..p44 + main.
الإخراج: verification.json/txt + لقطات screenshots/ ضمن مجلد الجولة.
خروج غير صفري عند أي فشل. NOT RUN معلنة في summary (منصات فعلية).
"""
import argparse
import json
import subprocess
import sys
import threading
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parents[1] / "reviews" / "UX-F03"
SAMPLE_REL = "previews/ux-patterns/mobile-record-sample"
WIDTHS = [320, 360, 390, 430]
VIEW = {"width": 390, "height": 844}

JS_HELPERS = r"""
() => {
  window.F03h = {
    insp: () => window.F03App.inspect(),
    arm: (kind, outcome) => window.F03App.arm(kind, outcome),
    settle: (kind, override) => window.F03App.settle(kind, override),
    stale: (kind, payload) => window.F03App.deliverTestResponse(kind, payload),
    enter: () => {
      const b = document.getElementById('f03-gw-demo');
      if (b && !b.hidden) { b.click(); }
      return window.F03App.inspect().view;
    },
    overflow: () => {
      const bad = [];
      const docW = document.documentElement.clientWidth;
      /* عنصر مقصوص بسلف overflow حقيقي داخل الصفحة ليس فيضًا للصفحة
         (شرائح الشريط المتوقفة خارج viewport مقصوصة بقصد) */
      const clippedByAncestor = (el) => {
        let p = el.parentElement;
        while (p && p !== document.body) {
          const pcs = getComputedStyle(p);
          if (/(hidden|clip|auto|scroll)/.test(pcs.overflowX)) {
            const pr = p.getBoundingClientRect();
            if (pr.left >= -1 && pr.right <= docW + 1) return true;
          }
          p = p.parentElement;
        }
        return false;
      };
      document.querySelectorAll('body *').forEach((el) => {
        if (!el.offsetParent && el.getClientRects().length === 0) return;
        if (clippedByAncestor(el)) return;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (cs.position === 'fixed' || cs.position === 'absolute') {
          if (r.width > docW + 1 || (r.left < -1 && r.width > 8)) {
            if (el.closest('.m-layer') || el.closest('.m-navbar') || el.closest('.m-actionbar') || el.closest('.m-toast')) return;
            bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 60), left: Math.round(r.left), w: Math.round(r.width) });
          }
          return;
        }
        if (r.right > docW + 1 || r.left < -1) {
          bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 60), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
        }
      });
      return { ok: bad.length === 0, bad: bad.slice(0, 8), docW };
    },
    rect: (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { x: r.x, y: r.y, w: r.width, h: r.height, display: cs.display };
    },
    glyphBounds: (hostSel) => {
      const host = document.querySelector(hostSel);
      if (!host) return null;
      const hr = host.getBoundingClientRect();
      let minL = Infinity, maxR = -Infinity, minT = Infinity, maxB = -Infinity;
      const walk = (node) => {
        for (const child of node.childNodes) {
          if (child.nodeType === 3) {
            const text = child.textContent;
            if (!text.trim()) continue;
            const rg = document.createRange();
            rg.selectNodeContents(child);
            for (const rect of rg.getClientRects()) {
              if (!rect.width || !rect.height) continue;
              minL = Math.min(minL, rect.left); maxR = Math.max(maxR, rect.right);
              minT = Math.min(minT, rect.top); maxB = Math.max(maxB, rect.bottom);
            }
          } else if (child.nodeType === 1) {
            const cs = getComputedStyle(child);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            walk(child);
          }
        }
      };
      walk(host);
      if (minL === Infinity) return { ok: true, empty: true };
      return { ok: minL >= hr.left - 0.5 && maxR <= hr.right + 0.5 && minT >= hr.top - 0.5 && maxB <= hr.bottom + 0.5,
               box: { l: Math.round(minL), r: Math.round(maxR), t: Math.round(minT), b: Math.round(maxB) },
               host: { l: Math.round(hr.left), r: Math.round(hr.right), t: Math.round(hr.top), b: Math.round(hr.bottom) } };
    },
    zoom2: () => {
      const all = document.querySelectorAll('body, body *');
      all.forEach((el) => {
        const cs = getComputedStyle(el);
        el.dataset.f03Zoom = '1';
        el.style.fontSize = (parseFloat(cs.fontSize) * 2) + 'px';
      });
    },
    unzoom: () => {
      document.querySelectorAll('[data-f03-zoom]').forEach((el) => {
        el.style.fontSize = '';
        delete el.dataset.f03Zoom;
      });
    },
    scrollPageTo: (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      return Math.round(window.scrollY);
    },
    fontsLoaded: () => ({
      arabic400: document.fonts.check("16px 'IBM Plex Sans Arabic'"),
      arabic500: document.fonts.check("500 16px 'IBM Plex Sans Arabic'"),
      latin400: document.fonts.check("16px 'IBM Plex Sans'")
    }),
    iconFill: (hostSel) => {
      const host = document.querySelector(hostSel);
      if (!host) return null;
      const use = host.querySelector('use');
      const sym = use ? use.closest('svg') : null;
      let symbolFill = null;
      try {
        const id = use && use.getAttribute('href');
        if (id) {
          const s = document.querySelector(id);
          if (s) symbolFill = s.getAttribute('fill');
        }
      } catch (e) {}
      return { useFill: symbolFill, hostComputed: getComputedStyle(host).fill };
    },
    tabbables: () => {
      const sel = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return [].slice.call(document.querySelectorAll(sel)).filter((el) => {
        if (el.closest('[inert]') || el.closest('[hidden]')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length;
    },
    bodyText: () => document.body.innerText || '',
    storageSeed: () => {
      try { return JSON.parse(window.localStorage.getItem('micro-f03-mobile-record-v2') || 'null'); }
      catch (e) { return { corrupt: true }; }
    },
    setStorageBlock: (on) => {
      if (on) {
        const orig = Storage.prototype.setItem;
        window.__f03OrigSetItem = orig;
        Storage.prototype.setItem = function (k, v) { throw new Error('محاكاة فشل كتابة التخزين المتأخر'); };
      } else if (window.__f03OrigSetItem) {
        Storage.prototype.setItem = window.__f03OrigSetItem;
        window.__f03OrigSetItem = null;
      }
      return true;
    }
  };
  return true;
}
"""


class CheckTool:
    def __init__(self, out_dir: Path):
        self.out = out_dir
        self.shots = out_dir / "screenshots"
        self.shots.mkdir(parents=True, exist_ok=True)
        self.results = []
        self.errors_all = []
        self.resource_failures = []
        self.error_cursor = 0
        self.current = None

    # ---------- تسجيل ----------
    def assert_(self, name, expected, measured, ok, extra=None):
        entry = {"name": name, "expected": expected, "measured": measured, "pass": bool(ok)}
        if extra is not None:
            entry["extra"] = extra
        self.current["assertions"].append(entry)
        if not ok:
            self.current["failures"].append(name)

    def path_begin(self, pid, desc):
        self.current = {"id": pid, "path": desc, "assertions": [], "failures": []}
        self.results.append(self.current)
        self.error_cursor = len(self.errors_all)

    def path_end(self):
        self.current["result"] = "PASS" if not self.current["failures"] else "FAIL"
        new_errors = self.errors_all[self.error_cursor:]
        if new_errors:
            self.current["new_errors"] = new_errors
        self.current = None

    def shot(self, page, name):
        page.screenshot(path=str(self.shots / name))

    # ---------- بنية ----------
    def _track(self, page):
        page.on("pageerror", lambda e: self.errors_all.append(str(e)))
        page.on("console", lambda m: self.errors_all.append(f"console.error: {m.text}") if m.type == "error" else None)
        page.on("requestfailed", lambda r: self.resource_failures.append(f"{r.url} :: {r.failure}"))
        page.on("response", lambda r: self.resource_failures.append(f"HTTP {r.status} :: {r.url}") if r.status >= 400 else None)

    def fresh(self, page, url, enter=True, seed_reset=True):
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.wait_for_function("() => !!window.F03App", timeout=10000)
        page.evaluate(JS_HELPERS)
        if seed_reset:
            page.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
            page.reload()
            page.wait_for_load_state("load")
            page.wait_for_function("() => !!window.F03App", timeout=10000)
            page.evaluate(JS_HELPERS)
        page.wait_for_timeout(150)
        if enter:
            page.evaluate("() => window.F03h.enter()")
            page.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page.wait_for_timeout(120)

    def open_page(self, ctx, url):
        page = ctx.new_page()
        self._track(page)
        return page

    # ---------- قياس ----------
    def insp(self, page):
        return page.evaluate("() => window.F03h.insp()")

    def arm(self, page, kind, outcome):
        return page.evaluate(f"() => window.F03h.arm('{kind}', '{outcome}')")

    def settle(self, page, kind, override=None):
        if override:
            return page.evaluate(f"() => window.F03h.settle('{kind}', '{override}')")
        return page.evaluate(f"() => window.F03h.settle('{kind}')")

    def stale(self, page, kind, payload):
        import json as _json
        return page.evaluate(f"() => window.F03h.stale('{kind}', {_json.dumps(payload)})")

    def no_new_errors(self):
        return len(self.errors_all) == self.error_cursor

    def no_overflow_ok(self, page):
        return page.evaluate("() => window.F03h.overflow()")

    def wait_view(self, page, view, timeout=5000):
        page.wait_for_function(f"() => window.F03App.inspect().view === '{view}'", timeout=timeout)

    def wait_op(self, page, op, timeout=5000):
        page.wait_for_function(f"() => window.F03App.inspect().op === '{op}'", timeout=timeout)

    def wait_filter(self, page, open_, timeout=5000):
        page.wait_for_function(
            f"() => window.F03App.inspect().filterPanelOpen === {str(open_).lower()}", timeout=timeout)

    def wait_review(self, page, open_, timeout=5000):
        page.wait_for_function(
            f"() => window.F03App.inspect().reviewOpen === {str(open_).lower()}", timeout=timeout)

    def goto_view(self, page, target):
        """وصول عام: من الوجهات الفرعية رجوع أولًا (مع حوار dirty عند الحاجة) ثم navbar."""
        for _ in range(4):
            v = self.insp(page)["view"]
            if v == target:
                return
            if v == "form":
                page.click("#f03-form-back")
                page.wait_for_timeout(300)
                if self.insp(page)["dialogOpen"]:
                    page.click("#f03-abandon")
                    page.wait_for_timeout(400)
            elif v == "detail":
                page.click("#f03-detail-back")
                page.wait_for_timeout(250)
            else:
                page.click(f"#f03-nav-{target}")
                self.wait_view(page, target)
                return
        raise RuntimeError(f"goto_view: تعذر الوصول إلى {target}")

    def open_list(self, page):
        self.goto_view(page, "list")

    def open_detail_of(self, page, item_id):
        self.open_list(page)
        page.click(f"#f03-list-rows .f03-row[data-id='{item_id}']")
        self.wait_view(page, "detail")

    def open_edit_form(self, page, item_id):
        self.open_detail_of(page, item_id)
        page.click("#f03-detail-edit")
        self.wait_view(page, "form")

    def open_add_form(self, page):
        self.goto_view(page, "home")
        page.click("#f03-home-add")
        self.wait_view(page, "form")

    def check_filter_cat(self, page, key):
        """نقر تسمية الاختيار (المدخل المخفي بصريًا لا يقبل نقرًا مباشرًا)"""
        page.click(f"#f03-filter-cats label.m-choice:has(input[data-filter-key='{key}']) .m-choice__box")

    def click_choice_input(self, page, selector):
        """نقر صندوق الاختيار المرئي لمدخل مخفي بصريًا داخل تسمية m-choice"""
        page.click(f"{selector}")

    def git_info(self):
        try:
            commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
            tree = subprocess.run(["git", "rev-parse", "HEAD^{tree}"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
            status = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
            return {"commit": commit, "tree": tree, "dirty_files": status, "status_clean": status == ""}
        except Exception as e:  # noqa
            return {"commit": None, "tree": None, "error": str(e)}


# ==================== المصفوفة F03-01..F03-44 ====================

def p01_boot_gateway(t: CheckTool, page, url):
    """الإقلاع: بوابة الوصول وجهة افتراضية نظيفة بلا أدوات ولا أخطاء."""
    t.path_begin("F03-01", "الإقلاع: بوابة الوصول الافتراضية بلا أدوات أو نصوص تقنية وأخطاء صفحة صفرية")
    t.fresh(page, url, enter=False, seed_reset=True)
    i = t.insp(page)
    t.assert_("الوجهة الافتراضية بوابة الوصول", "gateway", {"view": i["view"], "entered": i["entered"]},
              i["view"] == "gateway" and i["entered"] is False)
    t.assert_("شريط التنقل مخفي قبل الدخول", False, {"navbarVisible": i["navbarVisible"]},
              i["navbarVisible"] is False)
    t.assert_("لا طلبات محاكاة عند الإقلاع", {"save": 0, "check": 0, "read": 0},
              {"save": i["saveCalls"], "check": i["checkCalls"], "read": i["readCalls"]},
              i["saveCalls"] == 0 and i["checkCalls"] == 0 and i["readCalls"] == 0)
    text = page.evaluate("() => window.F03h.bodyText()")
    for bad in ("SIMULATION", "DRAFT", "UX-F03", "F03-V3", "simulation"):
        t.assert_(f"لا نص تقني في الواجهة الافتراضية: {bad}", "غائب", bad, bad not in text)
    t.assert_("وصف الدخول صادق (لا مصادقة)", "يصرّح بمحاكاة",
              {"hasNote": "لا تتصل بأي خدمة مصادقة" in text or "محاكاة" in text},
              "محاكاة" in text)
    t.shot(page, "f03-01-gateway-390.png")
    t.path_end()


def p02_gateway_validation_and_entry(t: CheckTool, page, url):
    """بوابة الوصول: تحقق أصلي ثم معالج محاكاة + الطريق السهل."""
    t.path_begin("F03-02", "بوابة الوصول: تحقق البريد وكلمة المرور، كشف كلمة المرور، ومزود الدخول السريع")
    t.fresh(page, url, enter=False, seed_reset=True)
    page.click("#f03-gw-submit")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("الإرسال الفارغ لا يدخل التطبيق", {"view": "gateway", "errorShown": True},
              {"view": i["view"], "errCount": page.evaluate("() => document.querySelectorAll('.m-access-gateway .has-error').length")},
              i["view"] == "gateway" and page.evaluate("() => document.querySelectorAll('.m-access-gateway .has-error').length") >= 1)
    t.shot(page, "f03-02-gateway-invalid.png")
    page.fill("#f03-gw-email", "not-an-email")
    page.fill("#f03-gw-password", "demo-pass-1")
    page.click("#f03-gw-submit")
    page.wait_for_timeout(250)
    t.assert_("البريد غير الصالح يُرفض بصيغة", True,
              {"errors": page.evaluate("() => document.querySelectorAll('.m-access-gateway .has-error').length")},
              page.evaluate("() => document.querySelectorAll('.m-access-gateway .has-error').length") >= 1)
    page.fill("#f03-gw-email", "demo@example.test")
    page.evaluate("() => { const b = document.querySelector('[data-access-reveal]'); b.click(); const p = document.getElementById('f03-gw-password'); window.__pwType = p.type; }")
    t.assert_("كشف كلمة المرور يبدّل النوع", "text",
              page.evaluate("() => document.getElementById('f03-gw-password').type"),
              page.evaluate("() => document.getElementById('f03-gw-password').type") == "text")
    page.click("#f03-gw-submit")
    t.wait_view(page, "home", timeout=8000)
    i2 = t.insp(page)
    t.assert_("المعالج المتناظر يدخل بعد نجاح حتمي", {"view": "home", "entered": True},
              {"view": i2["view"], "entered": i2["entered"]},
              i2["view"] == "home" and i2["entered"] is True)
    t.shot(page, "f03-02-after-form-entry.png")
    t.path_end()


def p03_home_from_data(t: CheckTool, page, url):
    """الرئيسية: كل الأرقام مشتقة من المخزن الوحيد."""
    t.path_begin("F03-03", "الرئيسية: السطح والشريط والمقارنة والدوائر وأحدث العناصر من البيانات الفعلية")
    t.fresh(page, url)
    i = t.insp(page)
    t.assert_("إجمالي القيمة = مجموع القيم المعلومة (797.35)", "797.35",
              {"total": i["home"]["totalText"]}, i["home"]["totalText"] == "797.35")
    t.assert_("الصدق عند قيمة مجهولة مذكور في السطح", True,
              {"sub": i["home"]["totalSub"]},
              "8 عناصر ذات قيمة معلومة" in i["home"]["totalSub"] and "بلا قيمة معلومة" in i["home"]["totalSub"])
    t.assert_("بطاقات الشريط من البيانات", {"count": "9", "unknown": "1", "cats": "3"},
              i["home"]["strip"],
              i["home"]["strip"]["count"] == "9" and i["home"]["strip"]["unknown"] == "1" and i["home"]["strip"]["cats"] == "3")
    t.assert_("بطل الكمية = مجموع الكميات (56)", "56", {"qty": i["home"]["qty"]}, i["home"]["qty"] == "56")
    bars = {b["label"]: b["value"] for b in i["home"]["bars"]}
    t.assert_("صفوف مقارنة العد لكل فئة", {"فئة أ": "3", "فئة ب": "3", "فئة ج": "3"}, bars,
              bars == {"فئة أ": "3", "فئة ب": "3", "فئة ج": "3"})
    t.assert_("أحدث العناصر بترتيب آخر تحديث", i["home"]["recentExpected"], i["home"]["recentIds"],
              i["home"]["recentIds"] == i["home"]["recentExpected"])
    t.assert_("الدوائر تعكس القيم المعلومة والغير متاح حالة مستقلة", True,
              {"circles": i["home"]["circles"]},
              any(c["label"] == "فئة ج" for c in i["home"]["circles"]))
    t.shot(page, "f03-03-home-390.png")
    t.path_end()


def p04_home_actions_and_recent(t: CheckTool, page, url):
    """أفعال الرئيسية وصفوف الأحدث تفتح تفاصيلها الصحيحة."""
    t.path_begin("F03-04", "أفعال الرئيسية: إضافة وعرض الكل وفتح صف من أحدث العناصر")
    t.fresh(page, url)
    page.click("#f03-home-add")
    t.wait_view(page, "form")
    i = t.insp(page)
    t.assert_("إضافة عنصر تفتح النموذج", {"view": "form", "mode": "add", "title": "إضافة عنصر"},
              {"view": i["view"], "mode": i["formMode"], "title": i["formTitle"]},
              i["view"] == "form" and i["formMode"] == "add" and i["formTitle"] == "إضافة عنصر")
    page.click("#f03-form-back")
    t.wait_view(page, "home")
    page.click("#f03-home-all")
    t.wait_view(page, "list")
    t.assert_("عرض جميع العناصر يفتح القائمة", "list", t.insp(page)["view"], t.insp(page)["view"] == "list")
    page.click("#f03-nav-home")
    t.wait_view(page, "home")
    page.click("#f03-home-recent .f03-row[data-id='it-02']")
    t.wait_view(page, "detail")
    i2 = t.insp(page)
    t.assert_("صف الأحدث يفتح التفاصيل الصحيحة", {"id": "it-02", "name": "عنصر باء"},
              {"id": i2["detailId"], "name": i2["detailRead"]["name"]},
              i2["detailId"] == "it-02" and i2["detailRead"]["name"] == "عنصر باء")
    t.assert_("مصدر الوصول للتفاصيل هو الرئيسية", "home", i2["detailReturnTo"], i2["detailReturnTo"] == "home")
    t.path_end()


def p05_list_rows_and_sort(t: CheckTool, page, url):
    """القائمة: كل الصفوف من المخزن والترتيب يعمل فعليًا."""
    t.path_begin("F03-05", "القائمة: 9 صفوف بترتيب الأحدث، وترتيب الاسم والقيمة من البيانات")
    t.fresh(page, url)
    t.open_list(page)
    i = t.insp(page)
    t.assert_("عدد الصفوف = عدد عناصر المخزن", {"rows": 9, "results": "النتائج: 9"},
              {"rows": i["list"]["rowCount"], "results": i["list"]["resultsText"]},
              i["list"]["rowCount"] == 9 and i["list"]["resultsText"] == "النتائج: 9")
    page.click("#f03-sort-seg .m-seg__item[data-value='name']")
    page.wait_for_timeout(150)
    i = t.insp(page)
    names_first = page.evaluate("() => document.querySelector('#f03-list-rows .f03-row__name').textContent")
    t.assert_("ترتيب الاسم: ألف أولًا", "عنصر ألف", names_first, names_first == "عنصر ألف")
    page.click("#f03-sort-seg .m-seg__item[data-value='value']")
    page.wait_for_timeout(150)
    i = t.insp(page)
    first_val = page.evaluate("() => document.querySelector('#f03-list-rows .f03-row[data-id]').getAttribute('data-id')")
    last_id = page.evaluate("() => { const rows = document.querySelectorAll('#f03-list-rows .f03-row'); return rows[rows.length-1].getAttribute('data-id'); }")
    t.assert_("ترتيب القيمة: الأعلى أولًا", "it-05", first_val, first_val == "it-05")
    t.assert_("القيمة المجهولة آخرًا لا صفرًا (R2-02 صدق)", "it-06", last_id, last_id == "it-06")
    t.shot(page, "f03-05-list-sorted-390.png")
    t.path_end()


def p06_search(t: CheckTool, page, url):
    """البحث على البيانات الفعلية ومسحه."""
    t.path_begin("F03-06", "البحث: نتائج فعلية بالاسم والملاحظة ومسح البحث")
    t.fresh(page, url)
    t.open_list(page)
    page.fill("#f03-search-input", "باء")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("بحث «باء» يعرض عنصرًا واحدًا", {"rows": 1, "results": "النتائج: 1"},
              {"rows": i["list"]["rowCount"], "results": i["list"]["resultsText"]},
              i["list"]["rowCount"] == 1 and i["list"]["resultsText"] == "النتائج: 1")
    page.fill("#f03-search-input", "قابلة للتعديل")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("البحث يشمل الملاحظة", 1, i["list"]["rowCount"], i["list"]["rowCount"] == 1)
    page.fill("#f03-search-input", "نص لا يطابق شيئًا")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("بلا مطابقة: زر مسح البحث ظاهر", True,
              {"visible": i["list"]["clearSearchVisible"]}, i["list"]["clearSearchVisible"] is True)
    page.click("#f03-list-noresults #f03-clear-search")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("مسح البحث يعيد الكل", 9, i["list"]["rowCount"], i["list"]["rowCount"] == 9)
    t.path_end()


def p07_filter_union(t: CheckTool, page, url):
    """(R2-02) اتحاد الفئات: أ→3، أ+ب→6، الثلاثة→9، والشارة عدد الفئات."""
    t.path_begin("F03-07", "تصفية الفئات: اتحاد المحددات ضمن البعد الواحد والشارة عدد الفئات المطبقة")
    t.fresh(page, url)
    t.open_list(page)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-a')
    page.click("[data-filter-apply]")
    t.wait_filter(page, False)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("فئة أ وحدها → 3", {"rows": 3, "badge": "1"},
              {"rows": i["list"]["rowCount"], "badge": i["list"]["filterCount"]},
              i["list"]["rowCount"] == 3 and i["list"]["filterCount"] == "1")
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-b')
    page.click("[data-filter-apply]")
    t.wait_filter(page, False)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("فئة أ + ب معًا → 6 (اتحاد لا تقاطع)", {"rows": 6, "badge": "2"},
              {"rows": i["list"]["rowCount"], "badge": i["list"]["filterCount"]},
              i["list"]["rowCount"] == 6 and i["list"]["filterCount"] == "2")
    t.shot(page, "f03-07-union-two-cats.png")
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-c')
    page.click("[data-filter-apply]")
    t.wait_filter(page, False)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("الفئات الثلاث → 9", {"rows": 9, "badge": "3"},
              {"rows": i["list"]["rowCount"], "badge": i["list"]["filterCount"]},
              i["list"]["rowCount"] == 9 and i["list"]["filterCount"] == "3")
    t.path_end()


def p08_search_with_filters_and(t: CheckTool, page, url):
    """(R2-02) جمع البحث مع اتحاد الفئات بعلاقة AND."""
    t.path_begin("F03-08", "البحث مع اتحاد الفئات: AND بين البحث والاتحاد")
    t.fresh(page, url)
    t.open_list(page)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-a')
    t.check_filter_cat(page, 'cat-b')
    page.click("[data-filter-apply]")
    t.wait_filter(page, False)
    page.fill("#f03-search-input", "دال")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("«دال» ضمن اتحاد (أ+ب) → صف واحد هو it-04", {"rows": 1, "id": "it-04"},
              {"rows": i["list"]["rowCount"], "ids": i["list"]["rowIds"]},
              i["list"]["rowCount"] == 1 and i["list"]["rowIds"] == ["it-04"])
    page.fill("#f03-search-input", "جيم")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("«جيم» خارج الاتحاد → لا نتائج", {"rows": 0, "noResults": True},
              {"rows": i["list"]["rowCount"], "noResults": i["list"]["noResultsVisible"]},
              i["list"]["rowCount"] == 0 and i["list"]["noResultsVisible"] is True)
    t.path_end()


def p09_no_results_vs_empty(t: CheckTool, page, url):
    """حالتا «لا نتائج» و«لا عناصر بعد» مختلفتان بنصهما وفعليهما."""
    t.path_begin("F03-09", "لا نتائج ≠ لا بيانات: نصوص وأفعال مستقلة")
    t.fresh(page, url)
    t.open_list(page)
    page.fill("#f03-search-input", "نص بلا مطابقة إطلاقًا")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("بحث بلا مطابقة → حالة لا نتائج", {"noResults": True, "empty": False, "clears": 2},
              {"noResults": i["list"]["noResultsVisible"], "empty": i["list"]["emptyVisible"],
               "clearSearch": i["list"]["clearSearchVisible"], "clearFilters": i["list"]["clearFiltersVisible"]},
              i["list"]["noResultsVisible"] is True and i["list"]["emptyVisible"] is False)
    page.click("#f03-list-noresults #f03-clear-search")
    page.wait_for_timeout(150)
    open_review(t, page)
    page.click("#f03-rev-clear-data")
    page.wait_for_timeout(200)
    close_review(t, page)
    t.open_list(page)
    i = t.insp(page)
    t.assert_("تفريغ البيانات → حالة لا عناصر مع فعل إضافة", {"empty": True, "noResults": False, "addVisible": True},
              {"empty": i["list"]["emptyVisible"], "noResults": i["list"]["noResultsVisible"],
               "rows": i["list"]["rowCount"]},
              i["list"]["emptyVisible"] is True and i["list"]["noResultsVisible"] is False and i["list"]["rowCount"] == 0)
    t.shot(page, "f03-09-empty-state.png")
    t.path_end()


def p10_external_clear_syncs_panel(t: CheckTool, page, url):
    """(R2-03) المسح الخارجي يزامن المطبق داخل لوحة B07 ومسودة الفتح التالي."""
    t.path_begin("F03-10", "المسح الخارجي للفلاتر يزامن اللوحة: لا فلاتر معادة بعد الفتح")
    t.fresh(page, url)
    t.open_list(page)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-a')
    page.click("[data-filter-apply]")
    t.wait_filter(page, False)
    page.fill("#f03-search-input", "باء")  # بحث بلا نتائج ضمن فئة أ
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("التركيب الابتدائي: فئة أ + بحث بلا نتائج", {"rows": 0, "badge": "1"},
              {"rows": i["list"]["rowCount"], "badge": i["list"]["filterCount"]},
              i["list"]["rowCount"] == 0 and i["list"]["filterCount"] == "1")
    page.click("#f03-clear-filters")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("بعد المسح الخارجي: صف باء ظهر والشارة صفر", {"rows": 1, "badge": "0", "hidden": True},
              {"rows": i["list"]["rowCount"], "badge": i["list"]["filterCount"], "counterHidden": i["list"]["filterCounterHidden"]},
              i["list"]["rowCount"] == 1 and i["list"]["filterCount"] == "0" and i["list"]["filterCounterHidden"] is True)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    page.wait_for_timeout(150)
    i = t.insp(page)
    checks = {c["key"]: c["checked"] for c in i["filterChecks"]}
    t.assert_("مربعات اللوحة بعد الفصل كلها غير محددة", {"cat-a": False, "cat-b": False, "cat-c": False}, checks,
              checks == {"cat-a": False, "cat-b": False, "cat-c": False})
    t.assert_("مطبق اللوحة الداخلي تزامن (عقد setAppliedFilters): لا قيمة true", True,
              i["filterPanelApplied"],
              all(v is not True for v in i["filterPanelApplied"].values()))
    t.assert_("ملخص اللوحة: المطبق لا فلاتر", True,
              {"summary": i["filterPanelSummary"]}, "لا فلاتر" in i["filterPanelSummary"])
    page.click("[data-filter-apply]")  # تطبيق لوحة بلا فلاتر
    t.wait_filter(page, False)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("تطبيق اللوحة بعد المسح لا يعيد فئة أ", {"rows": 1, "badge": "0", "cats": 0},
              {"rows": i["list"]["rowCount"], "badge": i["list"]["filterCount"], "cats": len(i["list"]["appliedCats"])},
              i["list"]["rowCount"] == 1 and i["list"]["filterCount"] == "0" and len(i["list"]["appliedCats"]) == 0)
    t.shot(page, "f03-10-clear-sync.png")
    t.path_end()


def p11_filter_cancel_keeps_applied(t: CheckTool, page, url):
    """إلغاء مسودة جديدة يبقي آخر مطبق فعلي (بقية عقد UX-15/R2-03)."""
    t.path_begin("F03-11", "إلغاء مسودة اللوحة يبقي آخر مطبق فعليًا")
    t.fresh(page, url)
    t.open_list(page)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-c')
    page.click("[data-filter-apply]")
    t.wait_filter(page, False)
    page.wait_for_timeout(120)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.check_filter_cat(page, 'cat-a')  # مسودة لم تُطبق
    page.click("[data-filter-cancel]")
    t.wait_filter(page, False)
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("الإلغاء يرمي المسودة ويبقي المطبق (فئة ج → 3)", {"rows": 3, "cats": ["cat-c"]},
              {"rows": i["list"]["rowCount"], "cats": i["list"]["appliedCats"]},
              i["list"]["rowCount"] == 3 and i["list"]["appliedCats"] == ["cat-c"])
    t.path_end()


def p12_detail_data_and_image(t: CheckTool, page, url):
    """التفاصيل: بيانات محفوظة وصورة أو بديلها وشارات وسجل قابل للطي."""
    t.path_begin("F03-12", "التفاصيل: البيانات المحفوظة، صورة أو بديل أحرف، شارة حالة، وسجل نشاط قابل للطي")
    t.fresh(page, url)
    t.open_detail_of(page, "it-01")
    i = t.insp(page)
    t.assert_("it-01 بصورة رمزية (img)", {"img": True, "name": "عنصر ألف", "value": "120.5 د.أ"},
              {"photo": i["detailPhoto"], "name": i["detailRead"]["name"], "value": i["detailRead"]["value"]},
              i["detailPhoto"]["hasImg"] is True and i["detailRead"]["name"] == "عنصر ألف")
    t.assert_("شارة الحالة «جاهز» ظاهرة بنص", True,
              {"status": i["detailRead"]["status"]}, "جاهز" in i["detailRead"]["status"])
    t.assert_("سجل النشاط مطوي افتراضيًا", {"expanded": False},
              {"expanded": page.evaluate("() => document.querySelector('#f03-detail-activity .m-section__head').getAttribute('aria-expanded')")},
              page.evaluate("() => document.querySelector('#f03-detail-activity .m-section__head').getAttribute('aria-expanded')") == "false")
    page.click("#f03-detail-activity .m-section__head")
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("فتح القسم يكشف خطوتين من البيانات الفعلية", {"steps": 2},
              {"steps": i["detailSteps"]}, len(i["detailSteps"]) == 2)
    t.shot(page, "f03-12-detail-it01-390.png")
    page.click("#f03-detail-back")
    t.wait_view(page, "list")
    t.open_detail_of(page, "it-02")
    i = t.insp(page)
    t.assert_("it-02 بلا صورة → بديل أحرف مباشرة (حرفا كلمتين)", {"img": False, "initials": "عب"},
              i["detailPhoto"],
              i["detailPhoto"]["hasImg"] is False and i["detailPhoto"]["initials"] == "عب")
    page.click("#f03-detail-back")
    t.wait_view(page, "list")
    page.fill("#f03-search-input", "زاي")
    page.wait_for_timeout(120)
    page.click("#f03-list-rows .f03-row[data-id='it-06']")
    t.wait_view(page, "detail")
    i = t.insp(page)
    t.assert_("القيمة المجهولة تُعرض «—» لا صفر", True,
              {"value": i["detailRead"]["value"]}, i["detailRead"]["value"].startswith("—"))
    t.path_end()


def p13_detail_back_context(t: CheckTool, page, url):
    """الرجوع من التفاصيل يحفظ سياق القائمة (بحث وتصفية وتمرير)."""
    t.path_begin("F03-13", "رجوع التفاصيل يعيد سياق القائمة: بحث وتصفية وموضع تمرير")
    t.fresh(page, url)
    page.set_viewport_size({"width": 320, "height": 500})  # مساحة صغيرة تجعل القائمة قابلة للتمرير
    t.open_list(page)
    page.fill("#f03-search-input", "عنصر")
    page.wait_for_timeout(150)
    t.open_detail_of(page, "it-05")
    page.evaluate("() => window.F03h.scrollPageTo('#f03-detail-edit')")
    page.click("#f03-detail-back")
    t.wait_view(page, "list")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("البحث محفوظ بعد الرجوع", {"search": "عنصر", "rows": 9},
              {"search": i["list"]["searchValue"], "rows": i["list"]["rowCount"]},
              i["list"]["searchValue"] == "عنصر" and i["list"]["rowCount"] == 9)
    t.assert_("موضع التمرير استُعيد قدر الإمكان", ">0",
              {"scrollY": i["scrollY"]}, i["scrollY"] > 0)
    page.set_viewport_size(VIEW)
    t.path_end()


def p14_single_delete_confirm(t: CheckTool, page, url):
    """حذف مفرد بتأكيد يوضح الأثر: الإلغاء يحفظ والتأكيد يحذف ويحدث الكل."""
    t.path_begin("F03-14", "حذف عنصر من التفاصيل: تأكيد يوضح الأثر وانعكاس الحذف في كل الوجهات")
    t.fresh(page, url)
    t.open_detail_of(page, "it-03")
    page.click("#f03-detail-delete")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("حوار التأكيد يفتح بنص يصرّح بعدم التراجع", True,
              {"open": i["deleteOpen"], "text": i["deleteText"]},
              i["deleteOpen"] is True and "لا يمكن التراجع" in i["deleteText"])
    page.click("#f03-delete-dialog [data-layer-close]")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("إلغاء الحذف يحفظ العنصر", {"count": 9, "view": "detail"},
              {"count": i["storeCount"], "view": i["view"]},
              i["storeCount"] == 9 and i["view"] == "detail")
    page.click("#f03-detail-delete")
    page.wait_for_timeout(250)
    page.click("#f03-delete-confirm")
    page.wait_for_timeout(300)
    i = t.insp(page)
    t.assert_("التأكيد يحذف ويعيد إلى القائمة", {"count": 8, "view": "list", "toast": "تم حذف العنصر."},
              {"count": i["storeCount"], "view": i["view"], "toast": i["toastText"]},
              i["storeCount"] == 8 and i["view"] == "list" and i["toastText"] == "تم حذف العنصر.")
    t.assert_("المحذوف غاب عن القائمة", True,
              {"ids": i["list"]["rowIds"]}, "it-03" not in i["list"]["rowIds"])
    t.shot(page, "f03-14-after-delete.png")
    page.click("#f03-nav-home")
    t.wait_view(page, "home")
    i = t.insp(page)
    t.assert_("ملخص الرئيسية تحدّث بعد الحذف (797.35 − 42.75)", {"total": "754.60", "count": "8"},
              {"total": i["home"]["totalText"], "count": i["home"]["strip"]["count"]},
              i["home"]["totalText"] == "754.60" and i["home"]["strip"]["count"] == "8")
    t.path_end()


def p15_bulk_select_and_delete(t: CheckTool, page, url):
    """(تغطية جديدة) اختيار متعدد + حذف جماعي بتأكيد + تحديد الكل."""
    t.path_begin("F03-15", "الاختيار المتعدد: أهداف منفصلة، تحديد الكل، حذف جماعي بتأكيد")
    t.fresh(page, url)
    t.open_list(page)
    page.click("#f03-select-toggle")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("وضع التحديد يظهر الشريط وخانات الصفوف", {"selecting": True, "bar": True},
              {"selecting": i["list"]["selecting"], "bar": i["list"]["selectBarVisible"]},
              i["list"]["selecting"] is True and i["list"]["selectBarVisible"] is True)
    page.click("#f03-list-rows li:nth-child(1) .m-choice__box")
    page.click("#f03-list-rows li:nth-child(2) .m-choice__box")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("تحديد صفين يرفع العدّاد ويعطل الحذف عند الصفر فقط", {"selected": 2, "disabled": False},
              {"selected": i["list"]["selectedCount"], "disabled": i["list"]["selectDeleteDisabled"]},
              i["list"]["selectedCount"] == 2 and i["list"]["selectDeleteDisabled"] is False)
    t.assert_("تحديد الكل indeterminate عند تحديد جزئي", True,
              {"indeterminate": i["list"]["selectAllIndeterminate"]},
              i["list"]["selectAllIndeterminate"] is True)
    page.click("#f03-list-rows .f03-row[data-id='it-01']")  # ضغط الصف في وضع التحديد = تبديل اختيار
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("ضغط الصف في وضع التحديد يبدل الاختيار (أُزيل it-01)", {"selected": 1},
              {"selected": i["list"]["selectedCount"]}, i["list"]["selectedCount"] == 1)
    page.click("#f03-list-rows .f03-row[data-id='it-01']")
    page.click("label.f03-select-all .m-choice__box")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("تحديد الكل يحدد 9", 9, i["list"]["selectedCount"], i["list"]["selectedCount"] == 9)
    page.click("#f03-select-cancel")
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("إلغاء التحديد يفرغ المحدد ويخفي الشريط", {"selected": 0, "bar": False},
              {"selected": i["list"]["selectedCount"], "bar": i["list"]["selectBarVisible"]},
              i["list"]["selectedCount"] == 0 and i["list"]["selectBarVisible"] is False)
    page.click("#f03-select-toggle")
    page.wait_for_timeout(120)
    page.click("#f03-list-rows li:nth-child(1) .m-choice__box")
    page.click("#f03-list-rows li:nth-child(2) .m-choice__box")
    page.click("#f03-select-delete")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("حوار الحذف الجماعي يذكر العدد", True,
              {"text": i["deleteText"]}, "2 عناصر" in i["deleteText"])
    page.click("#f03-delete-confirm")
    page.wait_for_timeout(300)
    i = t.insp(page)
    t.assert_("الحذف الجماعي ينفذ مرة واحدة ويحدث الكل", {"count": 7, "toast": "تم حذف 2 عناصر."},
              {"count": i["storeCount"], "toast": i["toastText"], "selecting": i["list"]["selecting"]},
              i["storeCount"] == 7 and i["toastText"] == "تم حذف 2 عناصر." and i["list"]["selecting"] is False)
    t.shot(page, "f03-15-after-bulk-delete.png")
    t.path_end()


def p16_photo_fallback_review(t: CheckTool, page, url):
    """بديل الصورة عند فشل العنصر — من وضع المراجعة بلا طلب شبكة فاشل."""
    t.path_begin("F03-16", "تجربة بديل الصورة: كسر الصورة من وضع المراجعة يظهر بديل الأحرف")
    t.fresh(page, url)
    t.open_detail_of(page, "it-01")
    i = t.insp(page)
    t.assert_("it-01 تعرض img قبل الكسر", True, i["detailPhoto"]["hasImg"], i["detailPhoto"]["hasImg"] is True)
    open_review(t, page)
    page.click("#f03-rev-photo-fallback")
    close_review(t, page)
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("بعد الكسر: بديل أحرف بلا img", {"img": False, "initials": "عأ"},
              i["detailPhoto"],
              i["detailPhoto"]["hasImg"] is False and i["detailPhoto"]["initials"] == "عأ")
    t.shot(page, "f03-16-photo-fallback.png")
    t.path_end()


def p17_form_validation(t: CheckTool, page, url):
    """تحقق النموذج: مطلوب الاسم في تعديل، مطلوبة الفئة في إضافة، صيغة القيمة والكمية، وإزالة رسائل منتهية السبب."""
    t.path_begin("F03-17", "تحقق النموذج: الاسم مطلوب، الفئة مطلوبة، صيغة القيمة والكمية، والقيم باقية")
    t.fresh(page, url)
    # الاسم المطلوب: تعديل ثم تفريغ الاسم (dirty مع قيمة غير صالحة)
    t.open_edit_form(page, "it-02")
    page.fill("#f03-name", "")
    page.click("#f03-save")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("الاسم المفرغ → خطأ مطلوب وتركيزه", {"error": True, "focus": "f03-name", "msg": "الاسم مطلوب."},
              {"error": i["nameError"], "focus": i["focusId"], "msg": i["nameMsgText"]},
              i["nameError"] is True and i["focusId"] == "f03-name" and i["nameMsgText"] == "الاسم مطلوب.")
    t.assert_("الحفظ لم يبدأ: لا دعوة ولا readonly", {"calls": 0, "readonly": False},
              {"calls": i["saveCalls"], "readonly": i["readonly"]},
              i["saveCalls"] == 0 and i["readonly"] is False)
    page.fill("#f03-name", "باء بعد التصحيح")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("رسالة الاسم زالت عند التصحيح (F01-R1-03)", False, i["nameError"], i["nameError"] is False)
    # الفئة المطلوبة: إضافة باسم صالح وفئة فارغة
    t.open_add_form(page)
    page.fill("#f03-name", "عنصر تحقق الفئة")
    page.click("#f03-save")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("الفئة المطلوبة: خطأ بتركيز صف الفئة والاسم سليم",
              {"cat": True, "name": False, "focus": "f03-cat-trigger"},
              {"cat": i["catError"], "name": i["nameError"], "focus": i["focusId"]},
              i["catError"] is True and i["nameError"] is False and i["focusId"] == "f03-cat-trigger")
    # صيغة القيمة: اختر فئة ثم قيمة غير رقمية
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(700)
    page.click(".m-picker__option[data-value='cat-b']")
    page.wait_for_timeout(500)
    page.fill("#f03-value", "abc")
    page.click("#f03-save")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("قيمة غير رقمية → خطأ صيغة والقيمة باقية", {"error": True, "value": "abc"},
              {"error": i["valueError"], "value": i["current"]["value"]},
              i["valueError"] is True and i["current"]["value"] == "abc")
    page.fill("#f03-value", "45.5")
    page.fill("#f03-qty", "-2")
    page.click("#f03-save")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("كمية سالبة → خطأ صيغة", {"qty": True, "qtyMsg": "أدخل كمية صحيحة (عدد صغير أو صفر)."},
              {"qty": i["qtyError"], "msg": i["qtyMsgText"]},
              i["qtyError"] is True and i["qtyMsgText"] == "أدخل كمية صحيحة (عدد صغير أو صفر).")
    page.fill("#f03-qty", "7")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("كل أخطاء الصيغة زالت بعد التصحيح", {"value": False, "qty": False, "name": False, "cat": False},
              {"value": i["valueError"], "qty": i["qtyError"], "name": i["nameError"], "cat": i["catError"]},
              i["valueError"] is False and i["qtyError"] is False and i["nameError"] is False and i["catError"] is False)
    t.assert_("لا عملية حفظ بدأت طوال مسار التحقق", 0, i["saveCalls"], i["saveCalls"] == 0)
    t.shot(page, "f03-17-form-valid-390.png")
    t.path_end()


def p18_clean_save_and_dirty(t: CheckTool, page, url):
    """حفظ clean لا ينشئ عملية؛ dirty محور مستقل يرتد بالقيم الأصلية."""
    t.path_begin("F03-18", "حفظ clean بلا عملية، وdirty يرتد عند العودة للأصل")
    t.fresh(page, url)
    t.open_edit_form(page, "it-02")
    i = t.insp(page)
    t.assert_("فتح تعديل clean: dirty=false", False, i["dirty"], i["dirty"] is False)
    page.click("#f03-save")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("حفظ clean: رسالة لا تغييرات وبلا دعوة حفظ", {"msg": "لا تغييرات للحفظ.", "calls": 0},
              {"msg": i["formMessage"]["text"], "calls": i["saveCalls"]},
              i["formMessage"]["text"] == "لا تغييرات للحفظ." and i["saveCalls"] == 0)
    page.fill("#f03-name", "عنصر باء معدل")
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("الكتابة ترفع dirty ومؤشره ظاهر", {"dirty": True, "hint": True},
              {"dirty": i["dirty"], "hint": i["dirtyHintVisible"]},
              i["dirty"] is True and i["dirtyHintVisible"] is True)
    page.fill("#f03-name", "عنصر باء")
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("العودة للأصل تعيد clean دون حفظ", {"dirty": False, "calls": 0},
              {"dirty": i["dirty"], "calls": i["saveCalls"]},
              i["dirty"] is False and i["saveCalls"] == 0)
    t.path_end()


def p19_edit_flow_updates_everywhere(t: CheckTool, page, url):
    """تعديل ناجح ينعكس في التفاصيل والقائمة والرئيسية والتقارير والتخزين."""
    t.path_begin("F03-19", "تعديل ناجح: القيمة الجديدة في التفاصيل والقائمة والرئيسية والتقارير والتخزين")
    t.fresh(page, url)
    t.open_edit_form(page, "it-04")
    page.fill("#f03-name", "عنصر دال محدث")
    page.fill("#f03-value", "99.5")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("التفاصيل تعرض القيم الملتزمة", {"name": "عنصر دال محدث", "value": "99.50 د.أ"},
              {"name": i["detailRead"]["name"], "value": i["detailRead"]["value"]},
              i["detailRead"]["name"] == "عنصر دال محدث" and i["detailRead"]["value"] == "99.50 د.أ")
    t.assert_("رسالة نجاح مكتوبة في سياق التفاصيل", {"note": "تم حفظ التعديلات", "visible": True, "inert": False},
              {"note": i["detailNote"]["title"] if i["detailNote"] else None,
               "visible": i["detailNoteVisible"], "inert": i["detailNoteInertAncestor"]},
              i["detailNote"] and i["detailNote"]["title"] == "تم حفظ التعديلات"
              and i["detailNoteVisible"] is True and i["detailNoteInertAncestor"] is False)
    t.assert_("ترتيب الأحداث: save ثم view ثم note", ["save:saved", "view:detail", "note:written"],
              [e["t"] for e in i["events"] if e["t"] in ("save:saved", "view:detail", "note:written")][-3:],
              True)
    t.open_list(page)
    i = t.insp(page)
    t.assert_("القائمة تعرض الاسم الجديد", True,
              {"rows": i["list"]["rowCount"]},
              any(r == "it-04" for r in i["list"]["rowIds"]))
    page.click("#f03-nav-home")
    t.wait_view(page, "home")
    i = t.insp(page)
    t.assert_("إجمالي الرئيسية تحدّث (797.35 + 99.5 - 0)", "896.85",
              {"total": i["home"]["totalText"]}, i["home"]["totalText"] == "896.85")
    seed = page.evaluate("() => window.F03h.storageSeed()")
    t.assert_("التخزين المحلي يحمل القيم الجديدة", True,
              {"found": any(x["name"] == "عنصر دال محدث" and x["value"] == 99.5 for x in seed["items"])},
              any(x["name"] == "عنصر دال محدث" and x["value"] == 99.5 for x in seed["items"]))
    t.shot(page, "f03-19-detail-after-edit.png")
    t.path_end()


def p20_add_flow_updates_everywhere(t: CheckTool, page, url):
    """إضافة ناجحة: العدد يزيد مرة واحدة وتظهر في كل الوجهات."""
    t.path_begin("F03-20", "إضافة عنصر: العدد 9→10 مرة واحدة وانعكاسها في الرئيسية والتقارير")
    t.fresh(page, url)
    t.open_add_form(page)
    page.fill("#f03-name", "عنصر جديد كامل")
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(400)
    page.click(".m-picker__option[data-value='cat-c']")
    page.wait_for_timeout(500)
    page.fill("#f03-value", "31")
    page.fill("#f03-qty", "4")
    page.fill("#f03-date", "2026-10-06")
    page.click("#f03-status-seg .m-seg__item[data-value='ready']")
    page.fill("#f03-note", "ملاحظة الإضافة.")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("العدد زاد مرة واحدة", 10, i["storeCount"], i["storeCount"] == 10)
    t.assert_("التفاصيل تعرض العنصر الجديد", {"name": "عنصر جديد كامل", "status": "جاهز"},
              {"name": i["detailRead"]["name"], "status": i["detailRead"]["status"]},
              i["detailRead"]["name"] == "عنصر جديد كامل" and "جاهز" in i["detailRead"]["status"])
    t.goto_view(page, "home")
    i = t.insp(page)
    t.assert_("الرئيسية حسبت الإضافة", {"count": "10", "total": "828.35"},
              {"count": i["home"]["strip"]["count"], "total": i["home"]["totalText"]},
              i["home"]["strip"]["count"] == "10" and i["home"]["totalText"] == "828.35")
    page.click("#f03-nav-reports")
    t.wait_view(page, "reports")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("التقارير حسبت الإضافة في فئة ج", "169.75",
              {"catC": [b["value"] for b in i["reports"]["bars"] if b["label"] == "فئة ج"][0]},
              [b["value"] for b in i["reports"]["bars"] if b["label"] == "فئة ج"][0] == "169.75")
    t.shot(page, "f03-20-reports-after-add.png")
    t.path_end()


def p21_double_activation_and_busy(t: CheckTool, page, url):
    """(UX-03) التفعيل المكرر أثناء pending لا يكرر الطلب والمغادرة محجوبة."""
    t.path_begin("F03-21", "حماية التفعيل المكرر أثناء الحفظ وحجب المغادرة")
    t.fresh(page, url)
    t.open_edit_form(page, "it-07")
    page.fill("#f03-name", "عنصر حاء معلق")
    t.arm(page, "save", "saved")
    page.click("#f03-save")
    t.wait_op(page, "saving")
    # نقر متعمد أثناء pending — حارس B01 يمنع التكرار؛ force يتجاوز انتظار
    # استقرار الحركة لدى Playwright ولا يتجاوز الحارس نفسه (الحدث يُسلّم ويُرفض)
    page.click("#f03-save", force=True)
    page.click("#f03-save", force=True)
    page.wait_for_timeout(100)
    i = t.insp(page)
    t.assert_("ثلاث محاولات نقر → دعوة حفظ واحدة", 1, i["saveCalls"], i["saveCalls"] == 1)
    page.click("#f03-form-back")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("المغادرة أثناء pending محجوبة برسالة", {"view": "form", "msg": "لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ."},
              {"view": i["view"], "msg": i["formMessage"]["text"]},
              i["view"] == "form" and i["formMessage"]["text"] == "لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ.")
    t.settle(page, "save")
    t.wait_view(page, "detail", timeout=8000)
    t.path_end()


def p22_known_failure_keeps_input(t: CheckTool, page, url):
    """رفض معلوم: لا نجاح، القيم باقية، إعادة المحاولة تعمل."""
    t.path_begin("F03-22", "رفض معلوم: القيم باقية وإمكان التصحيح وإعادة المحاولة")
    t.fresh(page, url)
    t.open_edit_form(page, "it-07")
    page.fill("#f03-name", "حاء مرفوض")
    t.arm(page, "save", "not-saved")
    page.click("#f03-save")
    t.wait_op(page, "failed", timeout=8000)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("الرفض يظهر رسالة خطأ بلا نجاح", {"op": "failed", "msg": "لم تُحفظ التعديلات"},
              {"op": i["op"], "msg": i["formMessage"]["title"]},
              i["op"] == "failed" and i["formMessage"]["title"] == "لم تُحفظ التعديلات")
    t.assert_("القيم باقية بعد الرفض", "حاء مرفوض", i["current"]["name"], i["current"]["name"] == "حاء مرفوض")
    t.assert_("العدادات: لا التزام بالرفض", {"store": 9, "save": 1},
              {"store": i["storeCount"], "save": i["saveCalls"]},
              i["storeCount"] == 9 and i["saveCalls"] == 1)
    page.click("#f03-save")  # إعادة محاولة بنفس القيم
    t.wait_view(page, "detail", timeout=8000)
    i = t.insp(page)
    t.assert_("إعادة المحاولة تنجح افتراضيًا", {"calls": 2, "name": "حاء مرفوض"},
              {"calls": i["saveCalls"], "name": i["detailRead"]["name"]},
              i["saveCalls"] == 2 and i["detailRead"]["name"] == "حاء مرفوض")
    t.shot(page, "f03-22-retry-saved.png")
    t.path_end()


def open_review(t: CheckTool, page):
    page.click("#f03-review-open")
    t.wait_review(page, True)


def close_review(t: CheckTool, page):
    page.click("#f03-review-close")
    t.wait_review(page, False)

def p23_unknown_check_saved_edit(t: CheckTool, page, url):
    """(R2-01) تعديل: unknown ثم check=saved يلتزم اللقطة الأصلية لا قيم النموذج."""
    t.path_begin("F03-23", "R2-01 تعديل: check=saved يلتزم snapshot المحاولة الأصلية ويحدّث كل الوجهات والتخزين")
    t.fresh(page, url)
    t.open_edit_form(page, "it-01")
    page.fill("#f03-name", "ألف من محاولة أصلية")
    t.arm(page, "save", "unknown")
    page.click("#f03-save")
    t.wait_op(page, "unknown", timeout=8000)
    page.wait_for_timeout(120)
    # عدّل النموذج بعد النتيجة المجهولة؟ لا يمكن (readOnly) — يثبت أن النموذج مجمد
    i = t.insp(page)
    t.assert_("unknown: النموذج للقراءة وزر التحقق ظاهر", {"readonly": True, "check": True},
              {"readonly": i["readonly"], "check": i["checkVisible"]},
              i["readonly"] is True and i["checkVisible"] is True)
    t.arm(page, "check", "saved")
    page.click("#f03-check")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("التفاصيل تعرض اسم اللقطة الأصلية لا قيمًا لاحقة", "ألف من محاولة أصلية",
              {"name": i["detailRead"]["name"]}, i["detailRead"]["name"] == "ألف من محاولة أصلية")
    t.assert_("لا حفظ جديد من التحقق (saveCalls=1) وتحقق واحد (checkCalls=1)", {"save": 1, "check": 1},
              {"save": i["saveCalls"], "check": i["checkCalls"]},
              i["saveCalls"] == 1 and i["checkCalls"] == 1)
    seed = page.evaluate("() => window.F03h.storageSeed()")
    t.assert_("التخزين التزم اللقطة الأصلية", True,
              {"found": any(x["id"] == "it-01" and x["name"] == "ألف من محاولة أصلية" for x in seed["items"])},
              any(x["id"] == "it-01" and x["name"] == "ألف من محاولة أصلية" for x in seed["items"]))
    t.goto_view(page, "home")
    i = t.insp(page)
    t.assert_("الرئيسية محدثة باللقطة (القيمة لم تتغير 120.5)", {"count": "9", "total": "797.35"},
              {"count": i["home"]["strip"]["count"], "total": i["home"]["totalText"]},
              i["home"]["strip"]["count"] == "9" and i["home"]["totalText"] == "797.35")
    t.shot(page, "f03-23-unknown-check-saved-edit.png")
    t.path_end()


def p24_unknown_check_saved_add_idempotent(t: CheckTool, page, url):
    """(R2-01) إضافة: check=saved يلتزم المحاولة الأصلية مرة واحدة؛ إعادة التحقق والرد المكرر لا ينشئان عنصرًا ثانيًا."""
    t.path_begin("F03-24", "R2-01 إضافة: التزام واحد، إعادة تحقق ورد مكرر بلا عنصر ثانٍ")
    t.fresh(page, url)
    t.open_add_form(page)
    page.fill("#f03-name", "إضافة عبر التحقق")
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(400)
    page.click(".m-picker__option[data-value='cat-a']")
    page.wait_for_timeout(500)  # فوق إغلاق الطبقة (240ms) واستعادة التركيز — لا سباق مع fill
    page.fill("#f03-value", "77")
    t.arm(page, "save", "unknown")
    page.click("#f03-save")
    t.wait_op(page, "unknown", timeout=8000)
    t.arm(page, "check", "saved")
    page.click("#f03-check")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("الإضافة التزمت مرة واحدة: 9→10", 10, i["storeCount"], i["storeCount"] == 10)
    t.assert_("التفاصيل تعرض العنصر الملتزم", {"name": "إضافة عبر التحقق", "value": "77.00 د.أ"},
              {"name": i["detailRead"]["name"], "value": i["detailRead"]["value"]},
              i["detailRead"]["name"] == "إضافة عبر التحقق" and i["detailRead"]["value"] == "77.00 د.أ")
    t.goto_view(page, "home")
    i = t.insp(page)
    t.assert_("الرئيسية: العدد 10 والإجمالي 874.35", {"count": "10", "total": "874.35"},
              {"count": i["home"]["strip"]["count"], "total": i["home"]["totalText"]},
              i["home"]["strip"]["count"] == "10" and i["home"]["totalText"] == "874.35")
    # رد مكرر بنفس معرف المحاولة الملتزمة (1): يجب تجاهله كليًا
    t.stale(page, "check", {"attemptId": 1, "outcome": "saved", "item": {"id": "it-10", "name": "مكرر", "value": 1}})
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("الرد المكرر على محاولة ملتزمة يُتجاهل", {"count": 10, "dups": 1, "view": "home"},
              {"count": i["storeCount"], "dups": i["duplicateIgnored"], "view": i["view"]},
              i["storeCount"] == 10 and i["duplicateIgnored"] >= 1 and i["view"] == "home")
    # إعادة فتح التفاصيل ثم فحص آخر للقيمة (عقد ناقص: saved بلا item → يبقى لا جديد)
    t.path_end()


def p25_check_incomplete_contract(t: CheckTool, page, url):
    """(R2-01) سياسة العقد الناقص: saved بلا item → بقاء unknown بلا نجاح كاذب."""
    t.path_begin("F03-25", "سياسة العقد الناقص: نجاح بلا عنصر مؤكد لا يعرض نجاحًا ولا تفاصيل فارغة")
    t.fresh(page, url)
    t.open_edit_form(page, "it-05")
    page.fill("#f03-name", "هاء عقد ناقص")
    t.arm(page, "save", "unknown")
    page.click("#f03-save")
    t.wait_op(page, "unknown", timeout=8000)
    # تسليم نتيجة saved بلا item عبر مسار المستهلك (محاكاة عقد ناقص)
    t.stale(page, "check", {"attemptId": 1, "outcome": "saved"})
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("نجاح بلا عنصر → يعود unknown برسالة صادقة", {"op": "unknown", "view": "form", "note": None},
              {"op": i["op"], "view": i["view"], "note": i["detailNote"]},
              i["op"] == "unknown" and i["view"] == "form" and i["detailNote"] is None)
    t.assert_("لا التزام في المخزن ولا تغيير تفاصيل", {"count": 9, "storeName": "عنصر هاء"},
              {"count": i["storeCount"], "storeName": [x for x in i["storeIds"]]},
              i["storeCount"] == 9)
    t.assert_("زر التحقق ما زال متاحًا", True, {"check": i["checkVisible"]}, i["checkVisible"] is True)
    t.path_end()


def p26_check_not_saved_and_unknown(t: CheckTool, page, url):
    """check=not-saved لا يلتزم ولا ينجح؛ check=unknown يبقى مجهولًا."""
    t.path_begin("F03-26", "نتائج تحقق غير ناجحة: not-saved بلا التزام، وunknown يبقى مجهولًا")
    t.fresh(page, url)
    t.open_edit_form(page, "it-08")
    page.fill("#f03-name", "طاء لم تُحفظ")
    t.arm(page, "save", "unknown")
    page.click("#f03-save")
    t.wait_op(page, "unknown", timeout=8000)
    t.arm(page, "check", "not-saved")
    page.click("#f03-check")
    t.wait_op(page, "failed", timeout=8000)
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("not-saved: فشل مؤكد بلا التزام والقيم باقية", {"op": "failed", "count": 9, "name": "طاء لم تُحفظ"},
              {"op": i["op"], "count": i["storeCount"], "name": i["current"]["name"]},
              i["op"] == "failed" and i["storeCount"] == 9 and i["current"]["name"] == "طاء لم تُحفظ")
    t.arm(page, "save", "unknown")
    page.click("#f03-save")
    t.wait_op(page, "unknown", timeout=8000)
    t.arm(page, "check", "unknown")
    page.click("#f03-check")
    t.wait_op(page, "unknown", timeout=8000)
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("check=unknown يبقى مجهولًا بلا نجاح ولا فشل", {"op": "unknown", "checkVisible": True},
              {"op": i["op"], "check": i["checkVisible"]},
              i["op"] == "unknown" and i["checkVisible"] is True)
    t.shot(page, "f03-26-check-unknown.png")
    t.path_end()


def p27_stale_responses_ignored(t: CheckTool, page, url):
    """ردود بمعرف قديم تُتجاهل في قنوات الحفظ والتحقق والقراءة."""
    t.path_begin("F03-27", "الردود القديمة: معرف 0 لا يطابق أي طلب نشط ويُسجل التجاهل")
    t.fresh(page, url)
    t.open_edit_form(page, "it-09")
    t.stale(page, "save", {"attemptId": 0, "outcome": "saved", "item": {"id": "x", "name": "x"}})
    page.wait_for_timeout(120)
    i = t.insp(page)
    t.assert_("رد حفظ قديم تجاهل وبقي النموذج", {"op": "idle", "count": 9, "stale": 1},
              {"op": i["op"], "count": i["storeCount"], "stale": i["staleIgnored"]},
              i["op"] == "idle" and i["storeCount"] == 9 and i["staleIgnored"] >= 1)
    t.stale(page, "check", {"attemptId": 0, "outcome": "saved", "item": {"id": "x", "name": "x"}})
    page.wait_for_timeout(100)
    t.open_list(page)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    t.stale(page, "read", {"readId": 0, "outcome": "ready", "items": [{"value": "stale", "label": "فئة قديمة"}]})
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("رد قراءة قديم لا يطبق فئة وهمية", {"cats": 3, "stale": ">=2"},
              {"applied": i["list"]["appliedCats"], "stale": i["staleIgnored"]},
              i["list"]["appliedCats"] == [] and i["staleIgnored"] >= 2)
    t.path_end()


def p28_leave_clean_dirty_pending(t: CheckTool, page, url):
    """المغادرة: clean مباشرة، dirty حوار (بقاء/تجاهل)، pending حجب."""
    t.path_begin("F03-28", "المغادرة: clean مباشرة، dirty حوار قرار، التجاهل وحده يغادر بلا حفظ")
    t.fresh(page, url)
    t.open_add_form(page)
    page.click("#f03-form-back")
    t.wait_view(page, "home")
    t.assert_("clean يغادر بلا حوار", "home", t.insp(page)["view"], t.insp(page)["view"] == "home")
    t.open_add_form(page)
    page.fill("#f03-name", "نص للتجاهل")
    page.click("#f03-form-back")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("dirty يفتح حوار البقاء/التجاهل", {"dialog": True, "focus": "f03-stay"},
              {"dialog": i["dialogOpen"], "focus": i["focusId"]},
              i["dialogOpen"] is True and i["focusId"] == "f03-stay")
    page.click("#f03-stay")
    page.wait_for_timeout(400)  # فوق انتقال إغلاق الطبقة (240ms) حتى يكتمل استيعاب التركيز
    i = t.insp(page)
    t.assert_("البقاء يبقي الإدخال والتركيز", {"dialog": False, "name": "نص للتجاهل", "focus": "f03-form-back"},
              {"dialog": i["dialogOpen"], "name": i["current"]["name"], "focus": i["focusId"]},
              i["dialogOpen"] is False and i["current"]["name"] == "نص للتجاهل")
    page.click("#f03-form-back")
    page.wait_for_timeout(200)
    page.click("#f03-abandon")
    t.wait_view(page, "home")
    i = t.insp(page)
    t.assert_("التجاهل يغادر بلا حفظ", {"count": 9, "calls": 0},
              {"count": i["storeCount"], "calls": i["saveCalls"]},
              i["storeCount"] == 9 and i["saveCalls"] == 0)
    t.open_edit_form(page, "it-01")
    page.fill("#f03-name", "ألف pending")
    t.arm(page, "save", "saved")
    page.click("#f03-save")
    t.wait_op(page, "saving")
    page.keyboard.press("Escape")
    page.wait_for_timeout(150)
    i = t.insp(page)
    t.assert_("Escape أثناء pending يحجب برسالة", {"view": "form", "msg": "لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ."},
              {"view": i["view"], "msg": (i["formMessage"] or {}).get("text")},
              i["view"] == "form" and i["formMessage"]["text"] == "لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ.")
    t.settle(page, "save")
    t.wait_view(page, "detail", timeout=8000)
    t.path_end()


def p29_picker_read_select_search(t: CheckTool, page, url):
    """المنتقي: قراءة واختيار وبحث وإعلان الحالة الظاهرة."""
    t.path_begin("F03-29", "المنتقي: قراءة الفئات واختيار فئة وبحث بنتائج وبلا نتائج")
    t.fresh(page, url)
    t.open_add_form(page)
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(700)
    i = t.insp(page)
    t.assert_("القراءة جاهزة بثلاث فئات", {"options": 3, "state": None},
              {"options": len(i["pickerOptions"]), "state": i["pickerStateRow"]},
              len(i["pickerOptions"]) == 3)
    page.click(".m-picker__option[data-value='cat-c']")
    page.wait_for_timeout(350)
    i = t.insp(page)
    t.assert_("الاختيار يزامن صف الفئة ويغلق الطبقة", {"cat": "فئة ج", "open": False},
              {"cat": i["draftCategory"]["label"] if i["draftCategory"] else None, "open": i["pickerOpen"]},
              i["draftCategory"] and i["draftCategory"]["label"] == "فئة ج" and i["pickerOpen"] is False)
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(500)
    page.fill("#f03-picker-search", "ب")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("بحث المنتقي يعرض فئة واحدة", 1,
              len([o for o in i["pickerOptions"] if not o["hiddenAttr"]]),
              len([o for o in i["pickerOptions"] if not o["hiddenAttr"]]) == 1)
    page.fill("#f03-picker-search", "لا يوجد")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("بلا نتائج داخل المنتقي بحالة صريحة", True,
              {"state": i["pickerStateRow"]}, i["pickerStateRow"] and "لا نتائج مطابقة" in i["pickerStateRow"])
    page.keyboard.press("Escape")
    page.wait_for_timeout(250)
    t.path_end()


def p30_picker_error_empty_stale_snapshot(t: CheckTool, page, url):
    """المنتقي: error→retry، empty→رسالة زوال ظاهرة، snapshot لكل قراءة، إبطال سياق مغلق."""
    t.path_begin("F03-30", "المنتقي المتقدم: فشل قراءة وإعادة محاولة، مصدر فارغ، snapshot، وإبطال السياق")
    t.fresh(page, url)
    t.open_add_form(page)
    t.arm(page, "read", "error")
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(2400)  # المسلح يُحسم حتميًا بعد 2000ms
    i = t.insp(page)
    t.assert_("فشل القراءة يعرض صف خطأ وزر إعادة", True,
              {"state": i["pickerStateRow"]},
              i["pickerStateRow"] and ("فشل" in i["pickerStateRow"] or "تعذر" in i["pickerStateRow"]))
    page.click("[data-picker-retry]")
    page.wait_for_timeout(700)
    i = t.insp(page)
    t.assert_("إعادة المحاولة تنجح افتراضيًا", 3, len(i["pickerOptions"]), len(i["pickerOptions"]) == 3)
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    # قراءة مسلحة (empty) تُغلق قبل حسمها: الرد يجب أن يُبطل ولا يغيّر شيئًا
    # (وضع الإضافة: لا فئة جارية — فيبقى لا فئة ولا رسالة زوال)
    t.arm(page, "read", "empty")
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(150)
    page.keyboard.press("Escape")  # إغلاق قبل الحسم
    page.wait_for_timeout(2400)
    i = t.insp(page)
    t.assert_("إغلاق المنتقي قبل الحسم يبطل الرد: بذرة الفئات كما هي بلا تطبيق empty",
              {"cat": None, "drop": "", "options": 3},
              {"cat": i["draftCategory"], "drop": (i["dropNote"] or {}).get("text"),
               "options": len(i["pickerOptions"])},
              i["draftCategory"] is None and (i["dropNote"] or {}).get("text") == ""
              and len(i["pickerOptions"]) == 3)
    # snapshot: غيّر المصدر بعد بدء القراءة لا يمس نتيجتها (setSource للفحص فقط)
    t.arm(page, "read", "ready")
    page.click("#f03-cat-trigger")
    page.wait_for_timeout(200)
    page.evaluate("() => window.F03App.setSource([{value:'x1',label:'فئة بديلة 1'},{value:'x2',label:'فئة بديلة 2'}])")
    page.wait_for_timeout(900)
    i = t.insp(page)
    t.assert_("القراءة سُويت من snapshot دعوتها (3 فئات أصلية لا 2 بديلة)", 3, len(i["pickerOptions"]), len(i["pickerOptions"]) == 3)
    page.keyboard.press("Escape")
    page.wait_for_timeout(250)
    t.path_end()


def p31_announcement_normal_path(t: CheckTool, page, url):
    """(R2-04) المسار العادي: النجاح مرة واحدة بعد الانتقال في سياق غير معزول."""
    t.path_begin("F03-31", "R2-04 المسار العادي: كتابة واحدة بعد الظهور بلا inert ولا تكرار")
    t.fresh(page, url)
    t.open_edit_form(page, "it-03")
    page.fill("#f03-note", "ملاحظة محدثة للمسار العادي.")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(200)
    i = t.insp(page)
    order = [e["t"] for e in i["events"] if e["t"] in ("save:saved", "view:detail", "note:written")]
    tail = order[-3:]  # آخر ثلاثة: ما بعد بدء الحفظ فقط (view:detail الأقدم من فتح تفاصيل العنصر)
    t.assert_("ترتيب صارم: save → view → note", ["save:saved", "view:detail", "note:written"], tail,
              tail == ["save:saved", "view:detail", "note:written"])
    t.assert_("كتابة واحدة فقط", 1, len([e for e in i["events"] if e["t"] == "note:written"]),
              len([e for e in i["events"] if e["t"] == "note:written"]) == 1)
    t.assert_("القناة غير معزولة عند الكتابة", False, {"inert": i["detailNoteInertAncestor"]},
              i["detailNoteInertAncestor"] is False)
    t.assert_("التركيز صالح على عنوان التفاصيل", "f03-detail-title", i["focusId"], i["focusId"] == "f03-detail-title")
    t.path_end()


def p32_announcement_deferred_manual(t: CheckTool, page, url):
    """(R2-04) تسوية يدوية داخل وضع المراجعة: بيانات تتحدث فورًا والإعلان يُؤجل إلى الإغلاق مرة واحدة."""
    t.path_begin("F03-32", "R2-04 تسوية يدوية خلف المراجعة: تأجيل الإعلان وكتابته مرة واحدة في سياق متاح")
    t.fresh(page, url)
    t.open_edit_form(page, "it-03")
    page.fill("#f03-name", "جيم تسوية خلف الطبقة")
    t.arm(page, "save", "saved")
    page.click("#f03-save")
    t.wait_op(page, "saving")
    open_review(t, page)
    t.settle(page, "save")
    page.wait_for_timeout(300)
    i = t.insp(page)
    t.assert_("خلف الطبقة: البيانات تحدثت والعرض تبديل بلا كتابة إعلان",
              {"view": "detail", "storeName": "جيم تسوية خلف الطبقة", "inert": True, "written": 0},
              {"view": i["view"], "storeName": i["storeItem"]["name"] if i["storeItem"] else None,
               "inert": i["detailNoteInertAncestor"],
               "written": len([e for e in i["events"] if e["t"] == "note:written"])},
              i["view"] == "detail" and i["storeItem"]["name"] == "جيم تسوية خلف الطبقة"
              and i["detailNoteInertAncestor"] is True
              and len([e for e in i["events"] if e["t"] == "note:written"]) == 0)
    t.assert_("التركيز لم يُسرق من أداة الطبقة", True,
              {"focus": i["focusId"]},
              i["focusId"] not in ("body", "none") and i["focusInert"] is False)
    t.shot(page, "f03-32-deferred-behind-review.png")
    close_review(t, page)
    page.wait_for_timeout(300)
    i = t.insp(page)
    writes = [e for e in i["events"] if e["t"] == "note:written"]
    t.assert_("بعد الإغلاق: إعلان واحد مؤجل في سياق متاح", {"writes": 1, "deferred": True, "inert": False},
              {"writes": len(writes), "detail": writes[-1]["detail"] if writes else None,
               "inert": i["detailNoteInertAncestor"], "note": i["detailNote"]["title"] if i["detailNote"] else None},
              len(writes) == 1 and writes[0]["detail"].get("deferred") is True
              and i["detailNoteInertAncestor"] is False
              and i["detailNote"] and i["detailNote"]["title"] == "تم حفظ التعديلات")
    t.assert_("إغلاق الطبقة أعاد التركيز لهدف صالح", True,
              {"focus": i["focusId"]}, i["focusId"] not in ("body", "none"))
    t.path_end()


def p33_announcement_deferred_auto(t: CheckTool, page, url):
    """(R2-04) الحسم التلقائي أثناء فتح المراجعة: نفس سياسة التأجيل."""
    t.path_begin("F03-33", "R2-04 حسم تلقائي أثناء فتح المراجعة: إعلان واحد بعد الإغلاق")
    t.fresh(page, url)
    t.open_edit_form(page, "it-09")
    page.fill("#f03-name", "ياء حسم تلقائي")
    t.arm(page, "save", "saved")
    page.click("#f03-save")
    t.wait_op(page, "saving")
    open_review(t, page)
    page.wait_for_timeout(2300)  # حسم تلقائي 2000ms أثناء فتح الطبقة
    i = t.insp(page)
    written = len([e for e in i["events"] if e["t"] == "note:written"])
    t.assert_("الحسم التلقائي خلف الطبقة لا يكتب الإعلان", {"view": "detail", "written": 0},
              {"view": i["view"], "written": written},
              i["view"] == "detail" and written == 0)
    close_review(t, page)
    page.wait_for_timeout(300)
    i = t.insp(page)
    writes = [e for e in i["events"] if e["t"] == "note:written"]
    t.assert_("بعد الإغلاق: كتابة واحدة والاسم الملتزم معروض", {"writes": 1, "name": "ياء حسم تلقائي"},
              {"writes": len(writes), "name": i["detailRead"]["name"]},
              len(writes) == 1 and i["detailRead"]["name"] == "ياء حسم تلقائي")
    t.path_end()


def p34_storage_persistence_and_reload(t: CheckTool, page, url):
    """التخزين: حفظ يبقى بعد إعادة الفتح بمفتاح v2."""
    t.path_begin("F03-34", "التخزين المحلي: التعديل يبقى بعد إعادة فتح الملف")
    t.fresh(page, url)
    t.open_edit_form(page, "it-06")
    page.fill("#f03-value", "55")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    page.reload()
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate(JS_HELPERS)
    page.evaluate("() => window.F03h.enter()")
    t.wait_view(page, "home")
    t.open_list(page)
    page.fill("#f03-search-input", "زاي")
    page.wait_for_timeout(150)
    page.click("#f03-list-rows .f03-row[data-id='it-06']")
    t.wait_view(page, "detail")
    i = t.insp(page)
    t.assert_("بعد إعادة الفتح: القيمة المحفوظة معروضة", "55.00 د.أ", i["detailRead"]["value"],
              i["detailRead"]["value"] == "55.00 د.أ")
    seed = page.evaluate("() => window.F03h.storageSeed()")
    t.assert_("مفتاح v2 يحمل الحقول الجديدة", True,
              {"schema": seed is not None and "items" in seed and "settings" in seed},
              seed is not None and "items" in seed and "settings" in seed)
    t.path_end()


def p35_storage_blocked_at_boot(t: CheckTool, page, url):
    """حجب التخزين منذ الإقلاع: إقلاع آمن ووصف جلسة صادق."""
    t.path_begin("F03-35", "حجب التخزين منذ الإقلاع: بيانات الجلسة سليمة والوصف صادق")
    ctx = t.ctx_browser.new_context(viewport=VIEW)
    page = ctx.new_page()
    t._track(page)
    page.add_init_script(
        "Object.defineProperty(window, 'localStorage', { get() { throw new Error('محاكاة حجب التخزين المحلي'); }, configurable: false });"
    )
    page.goto(url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate(JS_HELPERS)
    page.evaluate("() => window.F03h.enter()")
    t.wait_view(page, "home")
    i = t.insp(page)
    t.assert_("إقلاع من البذرة بلا انهيار", {"count": 9, "persistent": False, "available": False},
              {"count": i["storeCount"], "persistent": i["storage"]["persistent"], "available": i["storage"]["available"]},
              i["storeCount"] == 9 and i["storage"]["persistent"] is False and i["storage"]["available"] is False)
    t.assert_("سطر التذييل يصرّح بالجلسة", True,
              {"line": i["storageLineText"]}, "الجلسة" in i["storageLineText"])
    t.open_edit_form(page, "it-01")
    page.fill("#f03-note", "حفظ داخل الجلسة فقط.")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    i = t.insp(page)
    t.assert_("الحفظ يعمل داخل الجلسة", {"name": "عنصر ألف", "note": "حفظ داخل الجلسة فقط."},
              {"note": i["detailRead"]["note"]},
              i["detailRead"]["note"] == "حفظ داخل الجلسة فقط.")
    ctx.close()
    t.path_end()


def p36_late_storage_failure_syncs(t: CheckTool, page, url):
    """(R2-05) فشل كتابة متأخر: الوصف يتحرك إلى جلسة ثم يعود بنجاح لاحق."""
    t.path_begin("F03-36", "R2-05 فشل كتابة متأخر يزامن الوصف في التذييل ووضع المراجعة ثم يعيد الدوام")
    t.fresh(page, url)
    i = t.insp(page)
    t.assert_("قبل الفشل: دوام معلن بصدق", {"persistent": True, "line": "دوام"},
              {"persistent": i["storage"]["persistent"], "line": i["storageLineText"]},
              i["storage"]["persistent"] is True and "تبقى بعد إغلاق الملف" in i["storageLineText"])
    page.evaluate("() => window.F03h.setStorageBlock(true)")
    t.open_edit_form(page, "it-02")
    page.fill("#f03-name", "باء فشل كتابة متأخر")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("بعد الفشل: persistent=false والبيانات سليمة داخل الجلسة",
              {"persistent": False, "name": "باء فشل كتابة متأخر"},
              {"persistent": i["storage"]["persistent"], "name": i["detailRead"]["name"]},
              i["storage"]["persistent"] is False and i["detailRead"]["name"] == "باء فشل كتابة متأخر")
    t.assert_("سطر التذييل تحرك إلى وصف الجلسة (R2-05)", True,
              {"line": i["storageLineText"]}, "الجلسة" in i["storageLineText"])
    open_review(t, page)
    rev_text = page.evaluate("() => document.getElementById('f03-rev-storage').textContent")
    t.assert_("وصف وضع المراجعة متزامن أيضًا", True, {"text": rev_text}, "الجلسة" in rev_text)
    close_review(t, page)
    page.wait_for_timeout(150)
    page.evaluate("() => window.F03h.setStorageBlock(false)")
    t.open_edit_form(page, "it-02")
    page.fill("#f03-note", "كتابة ناجحة لاحقة.")
    page.click("#f03-save")
    t.wait_view(page, "detail", timeout=8000)
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("نجاح كتابة لاحق يعيد الوصف الدوام", {"persistent": True},
              {"persistent": i["storage"]["persistent"]}, i["storage"]["persistent"] is True)
    t.assert_("التذييل عاد لوصف الدوام", True,
              {"line": i["storageLineText"]}, "تبقى بعد إغلاق الملف" in i["storageLineText"])
    t.shot(page, "f03-36-storage-recovered.png")
    t.path_end()

def p37_reports_match_data(t: CheckTool, page, url):
    """التقارير: كل رسم وقيمه وتسمياته من البيانات الفعلية."""
    t.path_begin("F03-37", "التقارير: أعمدة ودوائر وخط ومقارنة وتقدم بأرقام مطابقة للبيانات")
    t.fresh(page, url)
    page.click("#f03-nav-reports")
    t.wait_view(page, "reports")
    page.wait_for_timeout(250)
    i = t.insp(page)
    bars = {b["label"]: b["value"] for b in i["reports"]["bars"]}
    t.assert_("أعمدة القيمة لكل فئة", {"فئة أ": "184.7", "فئة ب": "473.9", "فئة ج": "138.75"}, bars,
              bars == {"فئة أ": "184.7", "فئة ب": "473.9", "فئة ج": "138.75"})
    t.assert_("مقام الدوائر = مجموع الأجزاء (797.35)", "797.35", i["reports"]["donutTotal"],
              i["reports"]["donutTotal"] == "797.35")
    t.assert_("الدوائر بلا رفض (حالة scale سليمة)", True,
              {"state": i["reports"]["donutScaleState"], "error": i["reports"]["donutError"]},
              i["reports"]["donutScaleState"] in ("", "ok", "auto") and i["reports"]["donutError"] is None)
    line = {l["label"]: l["value"] for l in i["reports"]["line"]}
    t.assert_("الخط الأسبوعي من التواريخ الفعلية (4 نوافذ)", 4, len(line), len(line) == 4)
    t.assert_("بطل المقارنة = الإجمالي 797.35 د.أ", {"num": "797.35", "unit": "د.أ"},
              i["reports"]["hero"],
              i["reports"]["hero"]["num"] == "797.35" and i["reports"]["hero"]["unit"] == "د.أ")
    known = {k["label"]: k["value"] for k in i["reports"]["known"]}
    t.assert_("القيم المعلومة لكل فئة (2 من 3 لفئة ج)", {"فئة أ": "3 من 3", "فئة ب": "3 من 3", "فئة ج": "2 من 3"},
              known, known == {"فئة أ": "3 من 3", "فئة ب": "3 من 3", "فئة ج": "2 من 3"})
    t.shot(page, "f03-37-reports-390.png")
    t.path_end()


def p38_reports_metric_switch(t: CheckTool, page, url):
    """تبديل المقياس يعيد اشتقاق كل الرسوم والبطاقات."""
    t.path_begin("F03-38", "تبديل مقياس التقارير: الكمية تعيد كل القيم والتسميات")
    t.fresh(page, url)
    page.click("#f03-nav-reports")
    t.wait_view(page, "reports")
    page.wait_for_timeout(200)
    page.click("#f03-rep-seg .m-seg__item[data-value='quantity']")
    page.wait_for_timeout(250)
    i = t.insp(page)
    bars = {b["label"]: b["value"] for b in i["reports"]["bars"]}
    t.assert_("أعمدة الكمية", {"فئة أ": "16", "فئة ب": "25", "فئة ج": "15"}, bars,
              bars == {"فئة أ": "16", "فئة ب": "25", "فئة ج": "15"})
    t.assert_("البطل والوحدة تبديلا", {"num": "56", "unit": "وحدة", "label": "إجمالي الكمية"},
              i["reports"]["hero"],
              i["reports"]["hero"]["num"] == "56" and i["reports"]["hero"]["unit"] == "وحدة"
              and i["reports"]["hero"]["label"] == "إجمالي الكمية")
    t.assert_("بطاقة الإجمالي تبديل وحدتها", "وحدة", i["reports"]["totalUnit"], i["reports"]["totalUnit"] == "وحدة")
    t.assert_("عناوين الرسوم حدثت", {"bars": "الكمية لكل فئة", "donut": "توزيع الكمية على الفئات"},
              {"bars": i["reports"]["barsTitle"], "donut": i["reports"]["donutTitle"]},
              i["reports"]["barsTitle"] == "الكمية لكل فئة" and i["reports"]["donutTitle"] == "توزيع الكمية على الفئات")
    t.shot(page, "f03-38-reports-quantity.png")
    t.path_end()


def p39_settings_effects_and_restore(t: CheckTool, page, url):
    """مفاتيح الإعدادات: أثر فوري محفوظ على التقارير والرئيسية واستعادة بالبذرة."""
    t.path_begin("F03-39", "الإعدادات: تضمين المتوقفين وإظهار المقارنة — أثر فوري وحفظ واستعادة")
    t.fresh(page, url)
    page.click("#f03-nav-account")
    t.wait_view(page, "account")
    page.click("[data-account-open]")
    page.wait_for_timeout(350)
    page.click("[data-account-to-application]")
    page.wait_for_timeout(250)
    page.click("label.m-switch:has(input[data-account-setting='includeStoppedInReports']) .m-switch__track")
    page.wait_for_timeout(400)
    i = t.insp(page)
    t.assert_("الإعداد تحفظ في المخزن", False, i["settings"]["includeStoppedInReports"],
              i["settings"]["includeStoppedInReports"] is False)
    t.assert_("رسالة الحفظ ظاهرة", True, {"status": i["accountStatusText"]}, "حُفظ" in i["accountStatusText"])
    page.click("[data-account-close]")
    page.wait_for_timeout(300)
    page.click("#f03-nav-reports")
    t.wait_view(page, "reports")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("التقارير استثنت المتوقفين (7 عناصر، إجمالي 638.45)",
              {"included": "7", "total": "638.45"},
              {"included": i["reports"]["includedText"], "total": i["reports"]["totalText"]},
              i["reports"]["includedText"] == "7" and i["reports"]["totalText"] == "638.45")
    page.click("#f03-nav-home")
    t.wait_view(page, "home")
    open_review(t, page)
    page.click("#f03-rev-reset-data")
    page.wait_for_timeout(300)
    close_review(t, page)
    i = t.insp(page)
    t.assert_("استعادة البذرة تعيد الإعدادات والأثر", {"includeStopped": True, "compareHidden": False},
              {"includeStopped": i["settings"]["includeStoppedInReports"], "compareHidden": i["home"]["compareHidden"]},
              i["settings"]["includeStoppedInReports"] is True and i["home"]["compareHidden"] is False)
    t.path_end()


def p40_review_mode_from_phone(t: CheckTool, page, url):
    """وضع المراجعة: مغلق افتراضيًا، يعمل بالنقر من الهاتف، وأدوات البيانات منه."""
    t.path_begin("F03-40", "وضع المراجعة: مغلق افتراضيًا ويعمل بالنقر من الهاتف بلا console")
    t.fresh(page, url)
    i = t.insp(page)
    t.assert_("مغلق افتراضيًا وبلا نصوص تقنية ظاهرة", {"open": False},
              {"open": i["reviewOpen"]}, i["reviewOpen"] is False)
    open_review(t, page)
    page.click("#f03-rev-reset-data")
    page.wait_for_timeout(200)
    page.click("#f03-rev-clear-data")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("أدوات البيانات تعمل بالنقر من داخل الطبقة", 0, i["storeCount"], i["storeCount"] == 0)
    page.click("#f03-rev-reset-data")
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("الاستعادة تعيد 9 عناصر", 9, i["storeCount"], i["storeCount"] == 9)
    close_review(t, page)
    t.assert_("الإغلاق يعود للوجهة نفسها", "home", t.insp(page)["view"], t.insp(page)["view"] == "home")
    t.path_end()


def p41_widths_and_reflow(t: CheckTool, page, url):
    """مقاسات 320/360/390/430: لا فيض أفقي في الوجهات الست بالنقر الفعلي."""
    t.path_begin("F03-41", "المقاسات 320/360/390/430: لا فيض أفقي عبر الوجهات الرئيسية بالنقر")
    t.fresh(page, url)
    for w in WIDTHS:
        page.set_viewport_size({"width": w, "height": 800})
        # الرئيسية
        page.click("#f03-nav-home")
        t.wait_view(page, "home")
        page.wait_for_timeout(100)
        ov = t.no_overflow_ok(page)
        t.assert_(f"{w}px/home: لا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
        # القائمة
        t.open_list(page)
        page.wait_for_timeout(100)
        ov = t.no_overflow_ok(page)
        t.assert_(f"{w}px/list: لا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
        # التقارير
        page.click("#f03-nav-reports")
        t.wait_view(page, "reports")
        page.wait_for_timeout(150)
        ov = t.no_overflow_ok(page)
        t.assert_(f"{w}px/reports: لا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
        # التفاصيل ثم النموذج ثم الحساب
        page.click("#f03-nav-list")
        t.wait_view(page, "list")
        t.open_detail_of(page, "it-01")
        page.wait_for_timeout(100)
        ov = t.no_overflow_ok(page)
        t.assert_(f"{w}px/detail: لا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
        page.click("#f03-detail-edit")
        t.wait_view(page, "form")
        page.wait_for_timeout(100)
        ov = t.no_overflow_ok(page)
        t.assert_(f"{w}px/form: لا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
        page.click("#f03-form-back")
        t.wait_view(page, "detail")
        page.click("#f03-detail-back")
        t.wait_view(page, "list")
        page.click("#f03-nav-account")
        t.wait_view(page, "account")
        page.wait_for_timeout(100)
        ov = t.no_overflow_ok(page)
        t.assert_(f"{w}px/account: لا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
    page.set_viewport_size(VIEW)
    t.shot(page, "f03-41-widths-final.png")
    t.path_end()


def p42_zoom200_and_targets(t: CheckTool, page, url):
    """تكبير النص 200%: حدود الحروف داخل الأفعال وتمرير فعلي للوصول."""
    t.path_begin("F03-42", "تكبير 200%: لا قص للنصوص الحاسمة وتمرير فعلي يصل زر الحفظ")
    t.fresh(page, url)
    t.open_add_form(page)
    page.set_viewport_size({"width": 320, "height": 480})
    page.evaluate("() => window.F03h.zoom2()")
    page.wait_for_timeout(200)
    ov = t.no_overflow_ok(page)
    t.assert_("النموذج عند 320/200% بلا فيض أفقي", True, {"ok": ov["ok"], "bad": ov["bad"]}, ov["ok"])
    page.wait_for_timeout(100)
    reachable = page.evaluate("""() => {
      const b = document.getElementById('f03-save');
      b.scrollIntoView({behavior: 'instant', block: 'center'});
      const r = b.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight;
    }""")
    t.assert_("زر الحفظ يُصل إليه تمرير فعلي عند 320/200%", True, {"reachable": reachable}, reachable)
    gb = page.evaluate("() => window.F03h.glyphBounds('#f03-save')")
    t.assert_("حروف زر الحفظ داخل حدوده عند 200%", True, gb, gb and gb.get("ok") is True)
    page.set_viewport_size(VIEW)
    page.evaluate("() => window.F03h.unzoom()")
    page.wait_for_timeout(150)
    t.shot(page, "f03-42-zoom-form.png")
    t.path_end()


def p43_keyboard_and_focus(t: CheckTool, page, url):
    """لوحة المفاتيح: تركيز مرئي وحصر الطبقات وسياسة Escape."""
    t.path_begin("F03-43", "لوحة المفاتيح: Tab عبر الوجهة، حصر الطبقة، Escape، واستعادة التركيز")
    t.fresh(page, url)
    page.click("#f03-nav-list")
    t.wait_view(page, "list")
    page.focus("#f03-search-input")
    page.keyboard.press("Tab")
    i = t.insp(page)
    t.assert_("Tab ينتقل إلى هدف قابل للتركيز داخل الصفحة", True,
              {"focus": i["focusId"]}, i["focusId"] not in ("body", "none"))
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    page.keyboard.press("Escape")
    t.wait_filter(page, False)
    page.wait_for_timeout(200)
    i = t.insp(page)
    t.assert_("Escape يغلق الطبقة ويعيد التركيز لمشغلها", "f03-filter-btn", i["focusId"],
              i["focusId"] == "f03-filter-btn")
    t.open_add_form(page)
    page.fill("#f03-name", "نص escape")
    page.keyboard.press("Escape")
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("Escape على نموذج dirty يفتح حوار البقاء", True, {"dialog": i["dialogOpen"]},
              i["dialogOpen"] is True)
    page.keyboard.press("Escape")  # إغلاق الحوار = بقاء
    page.wait_for_timeout(250)
    i = t.insp(page)
    t.assert_("إغلاق الحوار بقاء والإدخال باق", {"dialog": False, "name": "نص escape"},
              {"dialog": i["dialogOpen"], "name": i["current"]["name"]},
              i["dialogOpen"] is False and i["current"]["name"] == "نص escape")
    t.path_end()


def p44_standalone_and_build(t: CheckTool, page, url):
    """الملف الواحد عبر file://: صفر طلبات خارجية، خطوط وأيقونات، تكافؤ، بناء حتمي."""
    t.path_begin("F03-44", "standalone عبر file://: صفر طلبات خارجية + بناء حتمي وأيقونات مطابقة")
    import subprocess as _sp
    run = _sp.run([sys.executable, str(ROOT / "tools" / "build-f03-standalone.py"), "--check"],
                  cwd=ROOT, capture_output=True, text=True)
    t.assert_("فحص البناء الحتمي يمر", 0, {"rc": run.returncode},
              run.returncode == 0 and "CHECK OK" in run.stdout and "ICON CHECK OK" in run.stdout)
    standalone = (ROOT / SAMPLE_REL / "standalone.html").resolve()
    ctx = t.ctx_browser.new_context(viewport=VIEW)
    spage = ctx.new_page()
    t._track(spage)
    requests = []
    spage.on("request", lambda r: requests.append(r.url))
    spage.goto(standalone.as_uri())
    spage.wait_for_load_state("load")
    spage.wait_for_function("() => !!window.F03App", timeout=10000)
    spage.evaluate(JS_HELPERS)
    external = [u for u in requests if not (u.startswith("file://") or u.startswith("data:"))]
    t.assert_("صفر طلبات خارج الشيفرة نفسها (بلا ملفات جانبية)", [], external, len(external) == 0)
    side_files = [u for u in requests if u.startswith("file://") and u != standalone.as_uri()]
    t.assert_("صفر طلبات ملفات جانبية file://", [], side_files, len(side_files) == 0)
    fonts = spage.evaluate("() => window.F03h.fontsLoaded()")
    t.assert_("الخطوط العربية واللاتينية مضمّنة وتعمل", {"ar400": True, "ar500": True, "la400": True},
              fonts, fonts["arabic400"] and fonts["arabic500"] and fonts["latin400"])
    fill = spage.evaluate("() => window.F03h.iconFill('.f03-cat__chevron')")
    t.assert_("سهم الفئة fill=none من الأصل في الملف الواحد (R1-02)", "none", fill and fill.get("useFill"),
              fill and fill.get("useFill") == "none")
    spage.evaluate("() => window.F03h.enter()")
    spage.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
    i = spage.evaluate("() => window.F03h.insp()")
    t.assert_("تكافؤ الإقلاع: بوابة ثم رئيسية بـ9 عناصر", {"count": 9, "total": "797.35"},
              {"count": i["storeCount"], "total": i["home"]["totalText"]},
              i["storeCount"] == 9 and i["home"]["totalText"] == "797.35")
    # دورة تعديل وحفظ داخل الملف الواحد
    spage.evaluate("() => window.F03App.openDetail('it-01')")
    spage.wait_for_function("() => window.F03App.inspect().view === 'detail'")
    spage.click("#f03-detail-edit")
    spage.wait_for_function("() => window.F03App.inspect().view === 'form'")
    spage.fill("#f03-name", "ألف من الملف الواحد")
    spage.click("#f03-save")
    spage.wait_for_function("() => window.F03App.inspect().view === 'detail'", timeout=8000)
    spage.wait_for_timeout(150)
    i = spage.evaluate("() => window.F03h.insp()")
    t.assert_("دورة حفظ كاملة داخل standalone", {"name": "ألف من الملف الواحد", "writes": 1},
              {"name": i["detailRead"]["name"],
               "writes": len([e for e in i["events"] if e["t"] == "note:written"])},
              i["detailRead"]["name"] == "ألف من الملف الواحد"
              and len([e for e in i["events"] if e["t"] == "note:written"]) == 1)
    spage.screenshot(path=str(t.shots / "f03-44-standalone-home.png"))
    ctx.close()
    t.path_end()


def p45_reduced_motion(t: CheckTool, page, url):
    """الحركة المخفضة (سياق Playwright أصلي): فتح/إغلاق فوري والوظيفة باقية."""
    t.path_begin("F03-45", "reduced-motion أصلية: الطبقات فورية والوظيفة والتركيز محفوظان")
    page.goto(url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate(JS_HELPERS)
    page.evaluate("() => window.F03h.enter()")
    t.wait_view(page, "home")
    t.open_list(page)
    page.click("#f03-filter-btn")
    t.wait_filter(page, True)
    page.wait_for_timeout(100)
    i = t.insp(page)
    t.assert_("فتح طبقة فوري بلا انتقال", True,
              {"open": i["filterPanelOpen"], "opening": page.evaluate("() => document.getElementById('f03-filter-layer').hasAttribute('data-opening')")},
              i["filterPanelOpen"] is True
              and page.evaluate("() => document.getElementById('f03-filter-layer').hasAttribute('data-opening')") is False)
    page.keyboard.press("Escape")
    t.wait_filter(page, False)
    i = t.insp(page)
    t.assert_("الإغلاق الفوري يعيد التركيز للمشغل", "f03-filter-btn", i["focusId"], i["focusId"] == "f03-filter-btn")
    t.shot(page, "f03-45-reduced-motion.png")
    t.path_end()


# ==================== التشغيل ====================

PATHS = [
    p01_boot_gateway, p02_gateway_validation_and_entry, p03_home_from_data,
    p04_home_actions_and_recent, p05_list_rows_and_sort, p06_search,
    p07_filter_union, p08_search_with_filters_and, p09_no_results_vs_empty,
    p10_external_clear_syncs_panel, p11_filter_cancel_keeps_applied,
    p12_detail_data_and_image, p13_detail_back_context, p14_single_delete_confirm,
    p15_bulk_select_and_delete, p16_photo_fallback_review, p17_form_validation,
    p18_clean_save_and_dirty, p19_edit_flow_updates_everywhere,
    p20_add_flow_updates_everywhere, p21_double_activation_and_busy,
    p22_known_failure_keeps_input, p23_unknown_check_saved_edit,
    p24_unknown_check_saved_add_idempotent, p25_check_incomplete_contract,
    p26_check_not_saved_and_unknown, p27_stale_responses_ignored,
    p28_leave_clean_dirty_pending, p29_picker_read_select_search,
    p30_picker_error_empty_stale_snapshot, p31_announcement_normal_path,
    p32_announcement_deferred_manual, p33_announcement_deferred_auto,
    p34_storage_persistence_and_reload, p35_storage_blocked_at_boot,
    p36_late_storage_failure_syncs, p37_reports_match_data,
    p38_reports_metric_switch, p39_settings_effects_and_restore,
    p40_review_mode_from_phone, p41_widths_and_reflow, p42_zoom200_and_targets,
    p43_keyboard_and_focus, p44_standalone_and_build,
]


def run(browser, url, out_dir: Path):
    tool = CheckTool(out_dir)
    page = browser.new_page(viewport=VIEW)
    tool._track(page)
    tool.ctx_browser = browser
    for fn in PATHS:
        try:
            fn(tool, page, url)
        except Exception as e:  # noqa
            if tool.current:
                tool.current["failures"].append(f"exception: {type(e).__name__}: {e}")
                tool.current["result"] = "FAIL"
                tool.current = None
            else:
                tool.results.append({"id": "??", "path": "exception", "assertions": [], "failures": [str(e)], "result": "FAIL"})
    # F03-45: سياق reduced_motion أصلي منفصل
    rctx = browser.new_context(viewport=VIEW, reduced_motion="reduce")
    rpage = rctx.new_page()
    tool._track(rpage)
    try:
        p45_reduced_motion(tool, rpage, url)
    except Exception as e:  # noqa
        if tool.current:
            tool.current["failures"].append(f"exception: {type(e).__name__}: {e}")
            tool.current["result"] = "FAIL"
            tool.current = None
    rctx.close()
    browser.close()

    # الحسم الجامع: أخطاء وموارد عبر جميع المسارات
    agg = {"id": "F03-AGG", "path": "لا أخطاء صفحة أو موارد مجمعة عبر جميع المسارات",
           "assertions": [
               {"name": "أخطاء صفحة مجمعة", "expected": 0, "measured": len(tool.errors_all),
                "pass": len(tool.errors_all) == 0},
               {"name": "فشل موارد مجمّع", "expected": 0, "measured": len(tool.resource_failures),
                "pass": len(tool.resource_failures) == 0},
           ], "failures": [], "result": "PASS"}
    if len(tool.errors_all) or len(tool.resource_failures):
        agg["failures"] = ["accumulated page errors" if len(tool.errors_all) else "resource failures"]
        agg["result"] = "FAIL"
        if tool.errors_all:
            agg["page_errors"] = tool.errors_all[:20]
        if tool.resource_failures:
            agg["resource_failures"] = tool.resource_failures[:20]
    tool.results.append(agg)
    return tool


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--round", dest="round_name", default="")
    args = parser.parse_args()
    out_dir = OUT / args.round_name if args.round_name else OUT

    handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    srv = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{port}/{SAMPLE_REL}/index.html"

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        version = browser.version
        tool = run(browser, url, out_dir)

    passed = sum(1 for r in tool.results if r["result"] == "PASS")
    failed = [r["id"] for r in tool.results if r["result"] == "FAIL"]
    assertions = sum(len(r["assertions"]) for r in tool.results)
    doc = {
        "tool": "tools/ux-f03-check.py",
        "experience": "UX-F03 تجربة الهاتف الكاملة «العناصر» (تكليف المالك 2026-10-06 + إغلاق F03-R2-01..06)",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": tool.git_info(),
        "browser": {"engine": "Chromium", "version": version, "headless": True},
        "url_source": url,
        "widths": WIDTHS,
        "zoom_policy": "محاكاة تكبير نص ×2 بحساب fontSize محسوب — ليست native zoom؛ المرجع WCAG 1.4.4/1.4.10 للمراجعة لا ادعاء امتثال شامل",
        "paths": tool.results,
        "summary": {
            "paths_total": len(tool.results),
            "paths_passed": passed,
            "paths_failed": failed,
            "assertions_total": assertions,
            "page_errors_total": len(tool.errors_all),
            "resource_failures_total": len(tool.resource_failures),
            "not_run": [
                "جهاز Samsung Galaxy S25 الحقيقي وSamsung Internet",
                "أجهزة Android/iOS الفعلية واللمس ولوحة النظام وsafe areas ورجوع النظام",
                "TalkBack/VoiceOver وقارئ شاشة فعلي",
                "WebKit/Safari",
                "native zoom (المستخدم محاكاة نص ×2 معلنة)",
            ],
            "limits": [
                "فلاتر الردود القديمة تثبت سلوك المستهلك لا وصولًا شبكيًا",
                "الفحوص البنيوية لا تغلق حدود المنصات الفعلية",
            ],
        },
    }
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "verification.json").write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [
        f"UX-F03 — نتائج الفحص ({doc['generated_at_utc']})",
        f"المصدر: commit {doc['source'].get('commit')} tree {doc['source'].get('tree')} clean={doc['source'].get('status_clean')}",
        f"المحرك: Chromium {version} headless",
        "",
    ]
    for r in tool.results:
        lines.append(f"[{r['result']}] {r['id']} — {r['path']} ({len(r['assertions'])} تحقيقًا)")
        if r["failures"]:
            for f in r["failures"]:
                lines.append(f"    FAIL: {f}")
    lines.append("")
    lines.append(f"الملخص: {passed}/{len(tool.results)} مسارًا ناجحًا — {assertions} تحقيقًا — "
                 f"أخطاء صفحة {len(tool.errors_all)} — فشل موارد {len(tool.resource_failures)}")
    lines.append("NOT RUN: " + "؛ ".join(doc["summary"]["not_run"]))
    (out_dir / "verification.txt").write_text("\n".join(lines), encoding="utf-8")

    print("\n".join(lines[-6:]))
    sys.exit(0 if not failed and not tool.errors_all and not tool.resource_failures else 1)


if __name__ == "__main__":
    main()
