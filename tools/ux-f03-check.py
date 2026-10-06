#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص UX-F03 للتجربة المترابطة (مصفوفة F03-01..F03-38).
من جذر المستودع:
    python3 tools/ux-f03-check.py               # الأدلة إلى reviews/UX-F03/
    python3 tools/ux-f03-check.py --round r2    # الأدلة إلى reviews/UX-F03/<round>/
    F03_ROOT=... F03_OUT=... F03_BROWSER=...    # تجاوزات بيئية (نمط F02 للمراجعة المستقلة)

ما تثبته الأداة: سلوك المستهلك المقاس بالنقر والكتابة والتنقل الفعليين
(قيم/عدادات/تركيز/قياسات/ترتيب أحداث) لا وجود النص وحده — إغلاق F03-R1-08:
- أخطاء الصفحة وطلبات الموارد تُجمع عبر جميع المسارات دون مسح عند بدء صفحة.
- ظهور فعلي (display/مستطيل) وترتيب أحداث مسجل لا سمات مخفية وحدها.
- حدود الحروف داخل حدود الأفعال داخل الإطار عند 100% و200% (لا عرض أفقي فقط).
- وضع المراجعة يُختبر بالنقر الفعلي من التذييل بلا evaluate للإنهاء.
- التخزين المحلي وإعادة الفتح والتفريغ وتعذر التخزين (init script حاجب).
البيئة: Chromium headless فعلي عبر Playwright — محاكاة المتصفح ليست اختبار S25 الحقيقي.
NOT RUN (خارج نطاق هذه الأداة): جهاز فعلي، TalkBack/VoiceOver، native zoom، اللمس، WebKit، رجوع النظام.
"""
import argparse
import functools
import json
import os
import subprocess
import sys
import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(os.environ.get("F03_ROOT", Path(__file__).resolve().parent.parent))
OUT = Path(os.environ.get("F03_OUT", "")) if os.environ.get("F03_OUT") else ROOT / "reviews" / "UX-F03"
BROWSER_PATH = os.environ.get("F03_BROWSER", "")

SAMPLE_REL = "previews/ux-patterns/mobile-record-sample"
WIDTHS = [320, 360, 390, 430]
VIEW = {"width": 390, "height": 844}

JS_HELPERS = r"""
() => {
  window.F03h = {
    insp: () => window.F03App.inspect(),
    arm: (k, o) => window.F03App.arm(k, o),
    settle: (k, o) => window.F03App.settle(k, o === undefined ? undefined : o),
    stale: (k, p) => window.F03App.deliverTestResponse(k, p),
    // عدم الخروج الأفقي: عناصر بعرض فعلي تتجاوز إطار العرض (بلا html/body)
    overflow: () => {
      const w = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > w + 1 || r.left < -1)) {
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' && Math.abs(r.width - w) <= 1) return; // أغشية inset:0
          bad.push({ tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.className + '').slice(0, 40), left: Math.round(r.left), right: Math.round(r.right) });
        }
      });
      return { clientW: w, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth, bad: bad.slice(0, 6), badCount: bad.length };
    },
    rect: (sel) => {
      const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) };
    },
    targets: (sels) => sels.map(s => {
      const el = document.querySelector(s);
      if (!el) return { sel: s, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { sel: s, w: Math.round(r.width), h: Math.round(r.height), display: cs.display };
    }),
    // تكبير النص 200% بتمريرين (الآلية المعلنة): قراءة كل الأحجام أولًا ثم التطبيق
    zoom2: () => {
      const els = Array.from(document.querySelectorAll('body, body *'));
      const sizes = els.map(el => getComputedStyle(el).fontSize);
      els.forEach((el, i) => { el.setAttribute('data-f03-zoom', '1'); el.style.fontSize = (parseFloat(sizes[i]) * 2) + 'px'; });
      return els.length;
    },
    unzoom: () => {
      document.querySelectorAll('[data-f03-zoom]').forEach(el => { el.style.fontSize = ''; el.removeAttribute('data-f03-zoom'); });
      return true;
    },
    msgSize: (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { fontSize: cs.fontSize, w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) };
    },
    // حدود الحروف داخل حدود الأفعال داخل إطار العرض (قياس المراجعة المستقلة R1)
    actionBounds: (rootSel) => {
      const root = document.querySelector(rootSel);
      if (!root) return null;
      const actions = [...root.querySelectorAll('button')].filter(e => !e.hidden && getComputedStyle(e).display !== 'none');
      const layer = root.getBoundingClientRect();
      return {
        layer: { top: Math.round(layer.top), bottom: Math.round(layer.bottom), left: Math.round(layer.left), right: Math.round(layer.right) },
        actions: actions.map(e => {
          const r = e.getBoundingClientRect();
          const rr = new Range(); rr.selectNodeContents(e);
          return {
            id: e.id || e.getAttribute('data-layer-close') || 'btn',
            font: getComputedStyle(e).fontSize,
            top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right),
            glyphs: [...rr.getClientRects()].map(g => ({ left: Math.round(g.left), right: Math.round(g.right), top: Math.round(g.top), bottom: Math.round(g.bottom) }))
          };
        })
      };
    },
    // أفعال داخل الحدود: أفقيًا دائمًا + حروف داخل أزرارها؛ والرأسي للمقصورات الثابتة فقط
    boundsOk: (data, width, height, fixed) => {
      if (!data) return false;
      const inLayer = a => a.left >= -1 && a.right <= width + 1 && (!fixed || (a.top >= -1 && a.bottom <= height + 1));
      const glyphsOk = a => a.glyphs.every(g => g.left >= a.left - 1 && g.right <= a.right + 1 && g.top >= a.top - 1 && g.bottom <= a.bottom + 1);
      return data.actions.length > 0 && data.actions.every(a => inLayer(a) && glyphsOk(a));
    },
    scrollPageTo: (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      return Math.round(window.scrollY);
    },
    fontsLoaded: async () => {
      await document.fonts.ready;
      return {
        arabic400: document.fonts.check("16px 'IBM Plex Sans Arabic'"),
        arabic500: document.fonts.check("500 16px 'IBM Plex Sans Arabic'"),
        latin400: document.fonts.check("16px 'IBM Plex Sans'"),
        count: document.fonts.size
      };
    },
    iconFill: (hostSel) => {
      const host = document.querySelector(hostSel);
      if (!host) return { found: false };
      const use = host.querySelector('use');
      return {
        found: true, use: !!use,
        hostFill: getComputedStyle(host).fill,
        useFill: use ? getComputedStyle(use).fill : null,
        w: Math.round(host.getBoundingClientRect().width),
        h: Math.round(host.getBoundingClientRect().height)
      };
    },
    // عناصر قابلة للتبويب فعليًا (للكشف عن أدوات مخفية قابلة للتركيز)
    tabbables: () => [...document.querySelectorAll('button, [href], input, select, textarea, [tabindex]')]
      .filter(el => {
        if (el.disabled) return false;
        const ti = el.getAttribute('tabindex');
        if (ti !== null && parseInt(ti, 10) < 0) return false;
        if (el.closest('[inert]')) return false;
        return el.offsetParent !== null || el.getClientRects().length > 0;
      })
      .map(el => el.id || el.tagName.toLowerCase()),
    tabbablesIn: (rootSel) => {
      const root = document.querySelector(rootSel);
      if (!root) return [];
      return [...root.querySelectorAll('button, [href], input, select, textarea, [tabindex]')]
        .filter(el => {
          if (el.disabled) return false;
          const ti = el.getAttribute('tabindex');
          if (ti !== null && parseInt(ti, 10) < 0) return false;
          return el.offsetParent !== null || el.getClientRects().length > 0;
        })
        .map(el => el.id || el.className);
    },
    bodyText: () => document.body.innerText,
    storageSeed: () => {
      try { const raw = localStorage.getItem('micro-f03-mobile-record-v1'); return raw ? JSON.parse(raw).length : -1; }
      catch (e) { return -2; }
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
        self.results = []            # صف لكل مسار
        self.current_id = ""
        self.errors_all = []         # (path_id, error) — تُجمع عبر جميع المسارات بلا مسح
        self.resource_failures = []  # (path_id, url, reason)
        self.error_cursor = 0        # لأخطاء هذا المسار فقط (بلا مسح السجل الكلي)

    # ---------- بنية النتائج ----------
    def assert_(self, name, expected, measured, ok, extra=None):
        row = {"name": name, "expected": expected, "measured": measured, "pass": bool(ok)}
        if extra is not None:
            row["extra"] = extra
        self.results[-1]["assertions"].append(row)
        if not ok:
            self.results[-1]["failures"].append(name)
        return ok

    def path_begin(self, pid, desc):
        self.current_id = pid
        self.results.append({"id": pid, "path": desc, "assertions": [], "failures": []})
        self.error_cursor = len(self.errors_all)

    def path_end(self):
        r = self.results[-1]
        r["result"] = "PASS" if not r["failures"] else "FAIL"
        r["new_errors"] = self.errors_all[self.error_cursor:]

    def shot(self, page, name):
        page.screenshot(path=str(self.shots / name), full_page=False)

    # ---------- تشغيل ----------
    def _track(self, page):
        page.on("pageerror", lambda e: self.errors_all.append((self.current_id, f"pageerror: {e}")))
        page.on("console", lambda m: self.errors_all.append((self.current_id, f"console.{m.type}: {m.text}")) if m.type == "error" else None)
        page.on("requestfailed", lambda r: self.resource_failures.append((self.current_id, r.url[:120], r.failure)))
        page.on("response", lambda r: self.resource_failures.append((self.current_id, r.url[:120], f"HTTP {r.status}")) if r.status >= 400 else None)

    def fresh(self, page, url, seed_reset=True):
        """بداية كل مسار من حالة نظيفة: تصفير التخزين ثم استعادة البذرة
        (التخزين المحلي يجعل الحالة تعبر المسارات — التصفير شرط عزل)."""
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.wait_for_function("!!window.F03App")
        if seed_reset:
            page.evaluate("() => { try { localStorage.clear(); } catch (e) {} F03App.resetDemoData(); }")
            page.wait_for_timeout(140)
        else:
            page.wait_for_timeout(140)
        page.evaluate(JS_HELPERS)

    def fresh_boot(self, page, url):
        """إقلاع بلا أي تسوية: تصفير التخزين ثم إعادة تحميل كاملة —
        لقياس الإقلاع الأول الحقيقي (بلا نداءات ولا أخطاء)."""
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.evaluate("() => { try { localStorage.clear(); } catch (e) {} }")
        page.goto(url)
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        page.wait_for_timeout(160)

    def open_page(self, ctx, url):
        page = ctx.new_page()
        self._track(page)
        page.set_viewport_size(VIEW)
        page.goto(url)
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        return page

    @staticmethod
    def insp(page):
        return page.evaluate("window.F03h.insp()")

    @staticmethod
    def arm(page, kind, outcome):
        return page.evaluate("([k,o]) => window.F03h.arm(k,o)", [kind, outcome])

    @staticmethod
    def settle(page, kind, override=None):
        return page.evaluate("([k,o]) => window.F03h.settle(k,o)", [kind, override])

    @staticmethod
    def stale(page, kind, payload):
        return page.evaluate("([k,p]) => window.F03h.stale(k,p)", [kind, payload])

    @staticmethod
    def no_new_errors(tool) -> bool:
        return len(tool.errors_all) == tool.error_cursor

    # انتظارات
    def wait_view(self, page, name, timeout=2000):
        page.wait_for_function(f"() => window.F03h.insp().view === '{name}'", timeout=timeout)
        page.wait_for_timeout(120)

    def wait_picker(self, page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().pickerOpen === true", timeout=timeout)

    def wait_dialog(self, page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().dialogOpen === true", timeout=timeout)

    def wait_review(self, page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().reviewOpen === true", timeout=timeout)

    def wait_filter(self, page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().filterPanelOpen === true", timeout=timeout)

    def wait_saved(self, page, timeout=5000):
        page.wait_for_function("() => { const i = window.F03h.insp(); return i.view === 'detail' && i.detailNote !== null; }", timeout=timeout)

    def wait_detail_saved_msg_gone(self, page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().detailNote === null", timeout=timeout)

    def no_overflow_ok(self, page, extra_allowed=0):
        ov = page.evaluate("window.F03h.overflow()")
        ok = ov["scrollW"] <= ov["clientW"] + extra_allowed and ov["badCount"] == 0
        return ok, ov

    def check_widths(self, page, states, record):
        """states: قائمة (اسم حالة، تجهيز) — قياس كل مقاس في كل حالة."""
        for w in WIDTHS:
            page.set_viewport_size({"width": w, "height": 844})
            for state_name, prep in states:
                if prep:
                    prep()
                page.wait_for_timeout(60)
                ok, ov = self.no_overflow_ok(page)
                record[f"{w}@{state_name}"] = {"ok": ok, **ov}
        page.set_viewport_size(VIEW)

    @staticmethod
    def git_info():
        def g(*a):
            try:
                return subprocess.check_output(["git", "-C", str(ROOT), *a], text=True).strip()
            except Exception as e:  # noqa: BLE001
                return f"unavailable: {e}"
        return {
            "commit": g("rev-parse", "HEAD"),
            "tree": g("rev-parse", "HEAD^{tree}"),
            "dirty_files": g("status", "--porcelain").count("\n"),
            "status_clean": g("status", "--porcelain") == "",
        }

    # مساعدات تجربة مشتركة
    def open_list(self, page):
        # قيادة محايدة التركيز للوصول إلى القائمة من أي عرض (الأفعال نفسها تنقر فعليًا)
        if page.evaluate("document.getElementById('f03-home-all').offsetParent === null"):
            page.evaluate("F03App.showView('home')")
            page.wait_for_timeout(80)
        page.click("#f03-home-all")
        self.wait_view(page, "list")

    def open_detail_of(self, page, item_id, from_sel="#f03-list-rows"):
        if self.insp(page)["view"] != "list" and from_sel == "#f03-list-rows":
            self.open_list(page)
        page.click(f"{from_sel} .f03-row[data-id='{item_id}']")
        self.wait_view(page, "detail")

    def open_edit_form(self, page, item_id):
        self.open_detail_of(page, item_id)
        page.click("#f03-detail-edit")
        self.wait_view(page, "form")

    def open_add_form(self, page):
        page.click("#f03-home-add")
        self.wait_view(page, "form")

    # ===================== المسارات =====================
    def p01_boot(self, page, url):
        self.path_begin("F03-01", "إقلاع أول حقيقي: لا أخطاء، الرئيسية من البذرة، لا طلبات، بلا نصوص تقنية")
        self.fresh_boot(page, url)
        page.wait_for_timeout(200)
        i = self.insp(page)
        self.assert_("لا أخطاء صفحة عند الإقلاع الأول", "0 أخطاء",
                     len(self.errors_all), len(self.errors_all) == 0)
        self.assert_("الرئيسية هي العرض الأول", "home", i["view"], i["view"] == "home")
        self.assert_("ملخص الرئيسية من البذرة (9 عناصر)",
                     "countLine يحوي 9",
                     {"line": i["home"]["countLine"], "all": i["home"]["allBtnText"]},
                     "9" in i["home"]["countLine"] and "9" in i["home"]["allBtnText"])
        self.assert_("لا دعوات حفظ/تحقق/قراءة عند الإقلاع", "0/0/0",
                     {"save": i["saveCalls"], "check": i["checkCalls"], "read": i["readCalls"]},
                     i["saveCalls"] == 0 and i["checkCalls"] == 0 and i["readCalls"] == 0)
        self.assert_("لا رسالة نجاح أو عملية مبكرة", "null",
                     {"detailNote": i["detailNote"], "formMessage": i["formMessage"]},
                     i["detailNote"] is None and i["formMessage"] is None)
        body = page.evaluate("window.F03h.bodyText()")
        self.assert_("لا نصوص تقنية في الواجهة الافتراضية (R1-01)",
                     "بلا UX-F03/DRAFT/SIMULATION/مكونات",
                     {"hits": [t for t in ["UX-F03", "DRAFT", "SIMULATION", "IBM Plex", "HugeIcons", "standalone"] if t in body]},
                     not any(t in body for t in ["UX-F03", "DRAFT", "SIMULATION", "IBM Plex", "HugeIcons", "standalone"]))
        tabs = page.evaluate("window.F03h.tabbables()")
        self.assert_("لا أدوات فحص قابلة للتبويب في الافتراضي (R1-01) — رابط المدخل وحده استثناء موثق",
                     "لا f03-rev-* في التبويب (المدخل f03-review-open وحده)",
                     {"revTabs": [t for t in tabs if "f03-rev-" in str(t)]},
                     not any("f03-rev-" in str(t) for t in tabs))
        ok, ov = self.no_overflow_ok(page)
        self.assert_("لا خروج أفقي عند 390", "bad=0", ov, ok)
        self.shot(page, "f03-01-home-390.png")
        self.path_end()

    def p02_home_from_data(self, page, url):
        self.path_begin("F03-02", "الرئيسية مبنية من البيانات الفعلية: عدد وتوزيع وأحدث وروابط صحيحة")
        self.fresh(page, url)
        i = self.insp(page)
        dist = [(d["label"], d["value"], d["width"]) for d in i["home"]["distribution"]]
        self.assert_("التوزيع يطابق البذرة (3/3/3)",
                     "فئة أ=3، فئة ب=3، فئة ج=3",
                     dist,
                     [d[1] for d in dist] == ["3", "3", "3"] and all(w.endswith("%") for _, _, w in dist))
        self.assert_("أحدث العناصر بترتيب آخر تحديث ومرتبطة بتفاصيلها",
                     "it-01,it-02,it-03",
                     {"rows": i["home"]["recentIds"], "expected": i["home"]["recentExpected"]},
                     i["home"]["recentIds"] == i["home"]["recentExpected"])
        self.shot(page, "f03-02-home-summary-390.png")
        # ضغط صف «أحدث العناصر» يفتح تفاصيله هو
        page.click("#f03-home-recent .f03-row[data-id='it-02']")
        self.wait_view(page, "detail")
        i2 = self.insp(page)
        self.assert_("ضغط صف الأحدث يفتح تفاصيل العنصر نفسه",
                     "it-02/عنصر باء",
                     {"id": i2["detailId"], "read": i2["detailRead"], "returnTo": i2["detailReturnTo"]},
                     i2["detailId"] == "it-02" and i2["detailRead"]["name"] == "عنصر باء"
                     and i2["detailReturnTo"] == "home")
        page.click("#f03-detail-back")
        self.wait_view(page, "home")
        self.path_end()

    def p03_home_actions(self, page, url):
        self.path_begin("F03-03", "أفعال الرئيسية: إضافة عنصر وعرض الكل — وكل فعل يعمل")
        self.fresh(page, url)
        page.click("#f03-home-all")
        self.wait_view(page, "list")
        i = self.insp(page)
        self.assert_("«عرض جميع العناصر» يفتح القائمة", "list", i["view"], i["view"] == "list")
        page.click("#f03-list-back")
        self.wait_view(page, "home")
        page.click("#f03-home-add")
        self.wait_view(page, "form")
        i2 = self.insp(page)
        self.assert_("«إضافة عنصر» يفتح نموذج إضافة فارغًا",
                     "add/فارغ/التركيز للاسم",
                     {"title": i2["formTitle"], "cur": i2["current"], "focus": i2["focusId"], "dirty": i2["dirty"]},
                     i2["formTitle"] == "إضافة عنصر" and i2["current"]["name"] == ""
                     and i2["current"]["category"] is None and i2["focusId"] == "f03-name" and i2["dirty"] is False)
        self.path_end()

    def p04_list_rows(self, page, url):
        self.path_begin("F03-04", "القائمة: كل الصفوف من المخزن وكل صف يفتح تفاصيله الصحيحة")
        self.fresh(page, url)
        self.open_list(page)
        i = self.insp(page)
        self.assert_("عدد الصفوف = عدد عناصر المخزن (9)", "9",
                     {"rows": i["list"]["rowCount"], "results": i["list"]["resultsText"]},
                     i["list"]["rowCount"] == 9 and i["list"]["resultsText"] == "النتائج: 9")
        self.shot(page, "f03-04-list-390.png")
        self.open_detail_of(page, "it-05")
        i2 = self.insp(page)
        self.assert_("الصف الخامس يفتح تفاصيل العنصر الصحيح",
                     "it-05/عنصر هاء/فئة ب",
                     {"id": i2["detailId"], "read": i2["detailRead"]},
                     i2["detailId"] == "it-05" and i2["detailRead"]["name"] == "عنصر هاء"
                     and i2["detailRead"]["category"] == "فئة ب" and i2["detailRead"]["note"] == "ملاحظة ثانية للتجربة.")
        self.assert_("التفاصيل تعرض البيانات المحفوظة وفعل تعديل واضح",
                     "تعديل ظاهر",
                     {"editVisible": page.evaluate("document.getElementById('f03-detail-edit').offsetParent !== null")},
                     page.evaluate("document.getElementById('f03-detail-edit').offsetParent !== null"))
        self.shot(page, "f03-05-detail-390.png")
        self.path_end()

    def p05_search(self, page, url):
        self.path_begin("F03-05", "البحث يعمل على البيانات: تصفية حية وعدّاد نتائج ومسح يعيد")
        self.fresh(page, url)
        self.open_list(page)
        page.fill("#f03-search-input", "باء")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("بحث «باء» → صف واحد صحيح", "it-02",
                     {"rows": i["list"]["rowIds"], "results": i["list"]["resultsText"]},
                     i["list"]["rowIds"] == ["it-02"] and i["list"]["resultsText"] == "النتائج: 1")
        page.fill("#f03-search-input", "ملاحظة")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        self.assert_("البحث يشمل الملاحظة أيضًا", "4 صفوف (ملاحظات البذرة)",
                     i2["list"]["rowCount"], i2["list"]["rowCount"] == 4)
        page.fill("#f03-search-input", "")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        self.assert_("مسح البحث يعيد كل الصفوف", "9", i3["list"]["rowCount"], i3["list"]["rowCount"] == 9)
        self.path_end()

    def p06_no_results_vs_empty(self, page, url):
        self.path_begin("F03-06", "حالة «لا نتائج مطابقة» تختلف عن حالة «لا عناصر بعد»")
        self.fresh(page, url)
        self.open_list(page)
        page.fill("#f03-search-input", "زززز")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("بلا بيانات فارغة: لا نتائج ≠ لا عناصر (فراغ البذرة)",
                     "noResults ظاهرة وempty مخفية",
                     {"noRes": i["list"]["noResultsVisible"], "empty": i["list"]["emptyVisible"],
                      "clearSearch": i["list"]["clearSearchVisible"]},
                     i["list"]["noResultsVisible"] is True and i["list"]["emptyVisible"] is False
                     and i["list"]["clearSearchVisible"] is True)
        self.shot(page, "f03-06-no-results-390.png")
        page.click("#f03-clear-search")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        self.assert_("مسح البحث من الحالة يعيد القائمة", "9 صفوف",
                     i2["list"]["rowCount"], i2["list"]["rowCount"] == 9)
        # حالة لا عناصر: من أداة بيانات وضع المراجعة بالنقر الفعلي
        page.click("#f03-review-open")
        self.wait_review(page)
        page.click("#f03-review-close")  # إغلاق ظاهر — تأكد أن الطبقة تعمل ثم نفتحها مجددًا للتفريغ
        page.wait_for_timeout(400)
        page.click("#f03-review-open")
        self.wait_review(page)
        page.click("#f03-rev-clear-data")
        page.wait_for_timeout(200)
        page.click("#f03-review-close")
        page.wait_for_timeout(400)
        i3 = self.insp(page)
        self.assert_("تفريغ البيانات → القائمة تعرض حالة «لا عناصر بعد» بفعل إضافة",
                     "empty ظاهرة وnoResults مخفية",
                     {"empty": i3["list"]["emptyVisible"], "noRes": i3["list"]["noResultsVisible"],
                      "results": i3["list"]["resultsText"]},
                     i3["list"]["emptyVisible"] is True and i3["list"]["noResultsVisible"] is False
                     and i3["list"]["resultsText"] is None)
        self.shot(page, "f03-06-empty-list-390.png")
        page.click("#f03-list-empty-add")
        self.wait_view(page, "form")
        i4 = self.insp(page)
        self.assert_("فعل الإضافة من حالة الفراغ يعمل", "إضافة عنصر", i4["formTitle"],
                     i4["formTitle"] == "إضافة عنصر")
        # استعادة البذرة للنظافة
        page.evaluate("F03App.resetDemoData()")
        page.wait_for_timeout(120)
        self.path_end()

    def p07_filter_panel(self, page, url):
        self.path_begin("F03-07", "لوحة التصفية المعتمدة: مسودة/تطبيق/مسح/إلغاء وعدّاد المطبق")
        self.fresh(page, url)
        self.open_list(page)
        page.click("#f03-filter-btn")
        self.wait_filter(page)
        i = self.insp(page)
        self.assert_("اللوحة تفتح طبقة B07 والمسودة تبدأ من المطبق (لا شيء)",
                     "3 خيارات غير مختارة",
                     i["filterChecks"], len(i["filterChecks"]) == 3 and not any(c["checked"] for c in i["filterChecks"]))
        page.click("#f03-filter-cats label.m-choice:has(input[data-filter-key='cat-a'])")
        page.wait_for_timeout(80)
        page.click("#f03-filter-layer [data-filter-cancel]")  # الإلغاء يرمي المسودة
        page.wait_for_timeout(400)
        i2 = self.insp(page)
        self.assert_("الإلغاء يرمي المسودة: لا فلتر مطبق ولا تغيير قائمة",
                     "counter=0 و9 صفوف",
                     {"applied": i2["list"]["appliedFilters"], "rows": i2["list"]["rowCount"],
                      "counter": i2["list"]["filterCounterHidden"], "aria": i2["list"]["filterAria"]},
                     i2["list"]["appliedFilters"] == {} and i2["list"]["rowCount"] == 9
                     and i2["list"]["filterCounterHidden"] is True and "لا فلاتر" in i2["list"]["filterAria"])
        # تطبيق فلتر واحد
        page.click("#f03-filter-btn")
        self.wait_filter(page)
        page.click("#f03-filter-cats label.m-choice:has(input[data-filter-key='cat-b'])")
        page.click("#f03-filter-layer [data-filter-apply]")
        page.wait_for_timeout(400)
        i3 = self.insp(page)
        self.assert_("التطبيق يقرّ: عدّاد المطبق = 1 وصفوف فئة ب فقط (3)",
                     "counter=1 و3 صفوف",
                     {"applied": i3["list"]["appliedFilters"], "rows": i3["list"]["rowCount"],
                      "counter": i3["list"]["filterCount"], "zero": i3["list"]["filterCounterZeroClass"],
                      "aria": i3["list"]["filterAria"]},
                     i3["list"]["appliedFilters"] == {"cat-a": False, "cat-b": True, "cat-c": False}
                     and i3["list"]["rowCount"] == 3 and i3["list"]["filterCount"] == "1"
                     and i3["list"]["filterCounterZeroClass"] is False and "فلتر واحد" in i3["list"]["filterAria"])
        self.shot(page, "f03-07-filter-applied-390.png")
        # المسح من اللوحة يفرغ المطبق بعد التطبيق
        page.click("#f03-filter-btn")
        self.wait_filter(page)
        page.click("#f03-filter-layer [data-filter-clear]")
        page.wait_for_timeout(80)
        i4 = self.insp(page)
        self.assert_("المسح يفرغ المسودة (لا يطبق وحده)",
                     "لا اختيار في المسودة والقائمة كما هي حتى التطبيق",
                     {"checks": [c["checked"] for c in i4["filterChecks"]], "rows": i4["list"]["rowCount"]},
                     not any(c["checked"] for c in i4["filterChecks"]) and i4["list"]["rowCount"] == 3)
        page.click("#f03-filter-layer [data-filter-apply]")
        page.wait_for_timeout(400)
        i5 = self.insp(page)
        self.assert_("تطبيق بعد المسح → لا فلاتر و9 صفوف",
                     "counter مخفي و9",
                     {"rows": i5["list"]["rowCount"], "hidden": i5["list"]["filterCounterHidden"]},
                     i5["list"]["rowCount"] == 9 and i5["list"]["filterCounterHidden"] is True)
        self.path_end()

    def p08_search_with_filters(self, page, url):
        self.path_begin("F03-08", "البحث والتصفية يجتمعان (AND) ولا يغيّر أحدهما عدّاد الآخر")
        self.fresh(page, url)
        self.open_list(page)
        page.click("#f03-filter-btn")
        self.wait_filter(page)
        page.click("#f03-filter-cats label.m-choice:has(input[data-filter-key='cat-a'])")
        page.click("#f03-filter-layer [data-filter-apply]")
        page.wait_for_timeout(400)
        page.fill("#f03-search-input", "دال")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("فلتر cat-a + بحث «دال» → صف واحد (it-04)",
                     "it-04 وcounter=1",
                     {"rows": i["list"]["rowIds"], "counter": i["list"]["filterCount"]},
                     i["list"]["rowIds"] == ["it-04"] and i["list"]["filterCount"] == "1")
        page.fill("#f03-search-input", "باء")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        self.assert_("بحث لا يطابق الفلتر → لا نتائج مع بقاء العدّاد",
                     "noResults وcounter=1",
                     {"noRes": i2["list"]["noResultsVisible"], "counter": i2["list"]["filterCount"],
                      "clearFilters": i2["list"]["clearFiltersVisible"]},
                     i2["list"]["noResultsVisible"] is True and i2["list"]["filterCount"] == "1"
                     and i2["list"]["clearFiltersVisible"] is True)
        page.fill("#f03-search-input", "")
        page.wait_for_timeout(100)
        self.path_end()

    def p09_detail_back_context(self, page, url):
        self.path_begin("F03-09", "الرجوع من التفاصيل يحفظ سياق القائمة: بحث وتصفية وموضع التمرير")
        self.fresh(page, url)
        self.open_list(page)
        page.set_viewport_size({"width": 390, "height": 480})  # ارتفاع أقصر: 9 صفوف تفيض فالتمرير ممكن
        page.evaluate("window.scrollTo(0, 400)")
        page.wait_for_timeout(120)
        y_before = self.insp(page)["scrollY"]
        self.assert_("التمرير ممكن فعلًا قبل المغادرة (9 صفوف بارتفاع قصير)", "scrollY>0", y_before, y_before > 0)
        self.open_detail_of(page, "it-06")
        page.click("#f03-detail-back")
        self.wait_view(page, "list")
        page.set_viewport_size({"width": 390, "height": 480})
        after = self.insp(page)
        self.assert_("موضع التمرير استُعيد (قد الإمكان)", f">= {y_before}",
                     {"before": y_before, "after": after["scrollY"]},
                     after["scrollY"] >= y_before)
        # سياق البحث والتصفية: فلتر cat-a مع بحث «عنصر» ثم فتح وعودة
        page.click("#f03-filter-btn")
        self.wait_filter(page)
        page.click("#f03-filter-cats label.m-choice:has(input[data-filter-key='cat-a'])")
        page.click("#f03-filter-layer [data-filter-apply]")
        page.wait_for_timeout(400)
        page.fill("#f03-search-input", "عنصر")
        page.wait_for_timeout(120)
        before = self.insp(page)
        self.assert_("سياق قبل المغادرة: فلتر cat-a وبحث «عنصر» و3 صفوف",
                     "counter=1 و3",
                     {"rows": before["list"]["rowCount"], "counter": before["list"]["filterCount"]},
                     before["list"]["rowCount"] == 3 and before["list"]["filterCount"] == "1")
        self.open_detail_of(page, before["list"]["rowIds"][0])
        i = self.insp(page)
        self.assert_("التفاصيل تظهر العنصر الصحيح", "it-01",
                     {"id": i["detailId"], "read": i["detailRead"]},
                     i["detailId"] == "it-01" and i["detailRead"]["name"] == "عنصر ألف")
        page.click("#f03-detail-back")
        self.wait_view(page, "list")
        page.set_viewport_size({"width": 390, "height": 480})
        after2 = self.insp(page)
        self.assert_("العودة تجد البحث والتصفية كما كانت",
                     "بحث+فلتر+عدّاد كما هي",
                     {"search": after2["list"]["searchValue"], "counter": after2["list"]["filterCount"],
                      "rows": after2["list"]["rowCount"]},
                     after2["list"]["searchValue"] == "عنصر" and after2["list"]["filterCount"] == "1"
                     and after2["list"]["rowCount"] == 3)
        page.set_viewport_size(VIEW)
        self.path_end()

    def p10_edit_flow_updates_everywhere(self, page, url):
        self.path_begin("F03-10", "تعديل وحفظ ناجح: النتيجة تظهر في التفاصيل والقائمة وملخص الرئيسية")
        self.fresh(page, url)
        self.open_edit_form(page, "it-03")
        i = self.insp(page)
        self.assert_("النموذج يُبث من المؤكد عند الفتح",
                     "عنصر جيم/cat-c/ملاحظة قابلة للتعديل.",
                     {"title": i["formTitle"], "cur": i["current"], "dirty": i["dirty"]},
                     i["formTitle"] == "تعديل العنصر" and i["current"]["name"] == "عنصر جيم"
                     and i["current"]["category"] == "cat-c" and i["current"]["note"] == "ملاحظة قابلة للتعديل."
                     and i["dirty"] is False)
        page.fill("#f03-name", "عنصر جيم المعدّل")
        page.wait_for_timeout(80)
        i2 = self.insp(page)
        self.assert_("dirty=true مع مؤشر التعديل المحلي", "hint ظاهر",
                     {"dirty": i2["dirty"], "hint": i2["dirtyHintVisible"]},
                     i2["dirty"] is True and i2["dirtyHintVisible"] is True)
        self.shot(page, "f03-10-edit-dirty-390.png")
        page.click("#f03-save")
        self.wait_saved(page)
        page.wait_for_timeout(150)
        i3 = self.insp(page)
        self.assert_("التفاصيل تعرض الاسم المعدّل مع رسالة نجاح",
                     "success/عنصر جيم المعدّل",
                     {"read": i3["detailRead"], "note": i3["detailNote"], "visible": i3["detailNoteVisible"]},
                     i3["detailRead"]["name"] == "عنصر جيم المعدّل" and i3["detailNote"]
                     and i3["detailNote"]["title"] == "تم حفظ التعديلات" and i3["detailNoteVisible"] is True)
        self.assert_("القائمة تعرض القيمة الجديدة في مكانها (ترتيب مستقر)",
                     "it-03 محدّث",
                     {"rows": i3["list"]["rowCount"], "pos": i3["list"]["rowIds"].index("it-03") if "it-03" in i3["list"]["rowIds"] else -1},
                     i3["list"]["rowCount"] == 9 and "it-03" in i3["list"]["rowIds"])
        page.click("#f03-detail-back")
        self.wait_view(page, "list")
        i4 = self.insp(page)
        self.assert_("صف القائمة يعرض الاسم المعدّل",
                     "الصف يحوي المعدّل",
                     {"rows": i4["list"]["rowCount"]},
                     i4["list"]["rowCount"] == 9)
        row_text = page.evaluate("document.querySelector(\"#f03-list-rows .f03-row[data-id='it-03']\").innerText")
        self.assert_("نص الصف المعدّل ظاهر", "عنصر جيم المعدّل", row_text, "عنصر جيم المعدّل" in row_text)
        page.click("#f03-list-back")
        self.wait_view(page, "home")
        i5 = self.insp(page)
        dist_b = {d["label"]: d["value"] for d in i5["home"]["distribution"]}
        self.assert_("ملخص الرئيسية تحدّث (أحدث العناصر يتصدر المعدّل)",
                     "it-03 أول الأحدث",
                     {"recent": i5["home"]["recentIds"], "dist": dist_b},
                     i5["home"]["recentIds"][0] == "it-03" and dist_b["فئة ج"] == "3")
        self.shot(page, "f03-10-home-updated-390.png")
        self.path_end()

    def p11_add_flow_updates_everywhere(self, page, url):
        self.path_begin("F03-11", "إضافة عنصر: نجاح الحفظ يظهر العنصر في التفاصيل والقائمة والرئيسية")
        self.fresh(page, url)
        before = self.insp(page)
        self.open_add_form(page)
        page.fill("#f03-name", "عنصر جديد كليًا")
        page.fill("#f03-note", "أول ملاحظة له.")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(800)  # حسم قراءة تلقائي
        page.click("#f03-picker .m-picker__option[data-value='cat-b']")
        page.wait_for_timeout(450)
        i = self.insp(page)
        self.assert_("النموذج مكتمل قبل الحفظ", "cat-b وdirty",
                     {"cat": i["current"]["category"], "dirty": i["dirty"]},
                     i["current"]["category"] == "cat-b" and i["dirty"] is True)
        page.click("#f03-save")
        self.wait_saved(page)
        page.wait_for_timeout(150)
        i2 = self.insp(page)
        new_id = i2["detailId"]
        self.assert_("التفاصيل تعرض العنصر الجديد برسالة إضافة",
                     "تمت إضافة العنصر",
                     {"read": i2["detailRead"], "note": i2["detailNote"], "id": new_id},
                     i2["detailRead"]["name"] == "عنصر جديد كليًا" and i2["detailNote"]
                     and i2["detailNote"]["title"] == "تمت إضافة العنصر" and new_id not in ("it-01", "it-02"))
        page.click("#f03-detail-back")
        self.wait_view(page, "list")
        i3 = self.insp(page)
        self.assert_("القائمة تحتوي العنصر الجديد (10 صفوف)",
                     "10 ويتضمن الجديد",
                     {"rows": i3["list"]["rowCount"], "has": new_id in i3["list"]["rowIds"]},
                     i3["list"]["rowCount"] == 10 and new_id in i3["list"]["rowIds"])
        page.click("#f03-list-back")
        self.wait_view(page, "home")
        i4 = self.insp(page)
        dist_b = {d["label"]: d["value"] for d in i4["home"]["distribution"]}
        self.assert_("الرئيسية: العدد صار 10 وفئة ب صارت 4 والجديد في الأحدث",
                     "10/4/في الأحدث",
                     {"all": i4["home"]["allBtnText"], "dist": dist_b, "recent": i4["home"]["recentIds"]},
                     "10" in i4["home"]["allBtnText"] and dist_b["فئة ب"] == "4"
                     and new_id in i4["home"]["recentIds"])
        self.shot(page, "f03-11-home-after-add-390.png")
        _ = before
        self.path_end()

    def p12_validation(self, page, url):
        self.path_begin("F03-12", "التحقق: «الاسم مطلوب» مرتبط بالحقل والقيم باقية والوصول لموضع التصحيح")
        self.fresh(page, url)
        self.open_add_form(page)
        page.fill("#f03-note", "ملاحظة تبقى")
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("لا عملية عند الاسم الفارغ", "saveCalls=0", i["saveCalls"], i["saveCalls"] == 0)
        self.assert_("«الاسم مطلوب» مرتبطة aria-invalid+describedby",
                     "true+f03-name-msg",
                     {"invalid": i["nameAriaInvalid"], "desc": i["nameDescribedBy"], "msg": i["nameMsgText"]},
                     i["nameAriaInvalid"] is True and "f03-name-msg" in i["nameDescribedBy"]
                     and "الاسم مطلوب" in i["nameMsgText"])
        self.assert_("التركيز إلى الاسم (موضع التصحيح)", "f03-name", i["focusId"], i["focusId"] == "f03-name")
        self.assert_("بقية الإدخال محفوظة", "ملاحظة تبقى", i["current"]["note"], i["current"]["note"] == "ملاحظة تبقى")
        self.shot(page, "f03-12-error-name-390.png")
        page.fill("#f03-name", "عنصر مصحّح")
        page.wait_for_timeout(80)
        i2 = self.insp(page)
        self.assert_("التصحيح يزول الخطأ عند الإدخال (UX-09)", "has-error=false",
                     {"err": i2["nameError"], "msg": i2["nameMsgText"]},
                     i2["nameError"] is False and i2["nameMsgText"] == "")
        # الفئة مطلوبة أيضًا
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        self.assert_("الفئة مطلوبة: خطأ موضعي وتركيز لصف الفئة",
                     "خطأ + f03-cat-trigger",
                     {"err": i3["catError"], "msg": i3["catMsgText"], "focus": i3["focusId"], "save": i3["saveCalls"]},
                     i3["catError"] is True and "الفئة مطلوبة" in i3["catMsgText"]
                     and i3["focusId"] == "f03-cat-trigger" and i3["saveCalls"] == 0)
        self.assert_("خطأ الفئة مرتبط aria-describedby", "f03-cat-msg",
                     i3["catTriggerLabel"] + "|" + page.evaluate("document.getElementById('f03-cat-trigger').getAttribute('aria-describedby')"),
                     "f03-cat-msg" in page.evaluate("document.getElementById('f03-cat-trigger').getAttribute('aria-describedby')"))
        self.path_end()

    def p13_clean_save_and_dirty(self, page, url):
        self.path_begin("F03-13", "حفظ clean لا ينشئ عملية؛ dirty محور مستقل والعودة للأصل تعيد clean")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("حفظ clean: لا دعوة ولا saving ولا نجاح", "لا عملية ورسالة «لا تغييرات»",
                     {"save": i["saveCalls"], "op": i["op"], "msg": i["formMessage"], "note": i["detailNote"]},
                     i["saveCalls"] == 0 and i["op"] == "idle" and i["formMessage"]
                     and "لا تغييرات" in i["formMessage"]["title"] and i["detailNote"] is None)
        orig_note = i["baseline"]["note"]
        page.fill("#f03-note", "ملاحظة تجريبية مؤقتة")
        page.wait_for_timeout(80)
        i2 = self.insp(page)
        self.assert_("تعديل → dirty=true والمؤكد لم يُمس", "true",
                     {"dirty": i2["dirty"], "base": i2["baseline"]["note"]},
                     i2["dirty"] is True and i2["baseline"]["note"] == orig_note)
        page.fill("#f03-note", orig_note)
        page.wait_for_timeout(80)
        i3 = self.insp(page)
        self.assert_("العودة للأصل → clean دون حفظ", "false وsaveCalls=0",
                     {"dirty": i3["dirty"], "save": i3["saveCalls"], "msg": i3["formMessage"]},
                     i3["dirty"] is False and i3["saveCalls"] == 0 and i3["formMessage"] is None)
        page.fill("#f03-name", "عنصر ألف X")
        page.fill("#f03-name", "عنصر ألف")
        page.wait_for_timeout(80)
        i4 = self.insp(page)
        self.assert_("كتابة الاسم وإرجاعه → clean", "false", i4["dirty"], i4["dirty"] is False)
        self.path_end()

    def p14_picker_read_and_select(self, page, url):
        self.path_begin("F03-14", "المنتقي: قراءة بمعرف جديد loading→ready وبذرة الفئة واختيار يزامن ويغلق")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("قراءة واحدة بدأت بحالة loading", "readCalls=1",
                     {"read": i["readCalls"], "row": i["pickerStateRow"], "focus": i["focusId"]},
                     i["readCalls"] == 1 and i["pickerStateRow"] and "جارٍ" in i["pickerStateRow"]
                     and i["focusId"] == "f03-picker-search")
        page.wait_for_timeout(800)  # حسم تلقائي 600ms
        i2 = self.insp(page)
        opts = [(o["value"], o["selected"], o["visibleRect"]) for o in i2["pickerOptions"]]
        self.assert_("ready بثلاث فئات ظاهرة وبذرة محددة", "3 وواحدة selected",
                     {"opts": opts, "row": i2["pickerStateRow"], "summary": i2["pickerSummary"],
                      "live": i2["pickerLiveText"]},
                     len(opts) == 3 and all(v and vis for v, s, vis in opts)
                     and sum(1 for _, s, _ in opts if s) == 1 and i2["pickerStateRow"] is None
                     and i2["pickerSummary"] == "المحدد: فئة أ" and "تمت القراءة: 3" in i2["pickerLiveText"])
        self.shot(page, "f03-14-picker-ready-390.png")
        page.click("#f03-picker .m-picker__option[data-value='cat-c']")
        page.wait_for_timeout(450)
        i3 = self.insp(page)
        self.assert_("الاختيار: إغلاق وتزامن القيمة والملخص وdirty",
                     "cat-c ومغلق وdirty",
                     {"open": i3["pickerOpen"], "cat": i3["current"]["category"], "focus": i3["focusId"],
                      "dirty": i3["dirty"], "trigger": i3["catTriggerLabel"]},
                     i3["pickerOpen"] is False and i3["current"]["category"] == "cat-c"
                     and i3["focusId"] == "f03-cat-trigger" and i3["dirty"] is True
                     and "فئة ج" in i3["catTriggerLabel"])
        self.path_end()

    def p15_picker_search(self, page, url):
        self.path_begin("F03-15", "بحث المنتقي: تصفية وno-results ومسح — الحالة المخزنة لا يتغيرها البحث")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(800)
        page.fill("#f03-picker-search", "أ")
        page.wait_for_timeout(120)
        i = self.insp(page)
        vis1 = [o for o in i["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("بحث «أ» → فئة أ فقط", "1 ظاهر",
                     {"n": len(vis1), "live": i["pickerLiveText"]},
                     len(vis1) == 1 and vis1[0]["value"] == "cat-a")
        page.fill("#f03-picker-search", "ز")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        self.assert_("بلا مطابقة → صف «لا نتائج مطابقة» منسجم مع الإعلان",
                     "صف + إعلان",
                     {"row": i2["pickerStateRow"], "live": i2["pickerLiveText"]},
                     i2["pickerStateRow"] and "لا نتائج مطابقة" in i2["pickerStateRow"]
                     and "لا نتائج مطابقة" in i2["pickerLiveText"])
        self.assert_("no-results نتيجة بحث فقط — الملخص يبقى بفئة النموذج",
                     "المحدد: فئة أ", i2["pickerSummary"], i2["pickerSummary"] == "المحدد: فئة أ")
        self.shot(page, "f03-15-picker-no-results-390.png")
        page.fill("#f03-picker-search", "")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        vis3 = [o for o in i3["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("مسح البحث يعيد الخيارات ويعلن الظاهر", "3 + إعلان",
                     {"n": len(vis3), "live": i3["pickerLiveText"]},
                     len(vis3) == 3 and "الفئات الظاهرة: 3" in i3["pickerLiveText"])
        self.path_end()

    def p16_picker_error_empty(self, page, url):
        self.path_begin("F03-16", "فشل القراءة وإعادتها؛ empty المؤكدة تُسقط الفئة برسالة ظاهرة وحيدة")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        self.arm(page, "read", "error")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("error: صف خطأ + إعادة محاولة والخيارات القديمة مخفية",
                     "صف خطأ و0 خيار ظاهر",
                     {"row": i["pickerStateRow"], "visible": [o["visibleRect"] for o in i["pickerOptions"]]},
                     i["pickerStateRow"] and "تعذر" in i["pickerStateRow"]
                     and not any(o["visibleRect"] for o in i["pickerOptions"]))
        retry = page.evaluate("window.F03h.targets(['[data-picker-retry]'])")[0]
        self.assert_("زر إعادة المحاولة بأدنى هدف لمس", "h>=48", retry, retry.get("h", 0) >= 48)
        self.shot(page, "f03-16-picker-error-390.png")
        self.arm(page, "read", "ready")
        page.click("[data-picker-retry]")
        page.wait_for_timeout(120)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        vis = [o for o in i2["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("إعادة المحاولة → ready يعيد الخيارات", "3 ظاهر", len(vis), len(vis) == 3)
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        # empty مؤكد على قراءة جديدة
        self.arm(page, "read", "empty")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        dn = i3["dropNote"]
        self.assert_("empty: مصدر فارغ ورسالة الزوال ظاهرة داخل الطبقة (قناة وحيدة R1-02/F02)",
                     "role=alert ظاهرة داخل الطبقة",
                     {"n": len(i3["pickerOptions"]), "row": i3["pickerStateRow"], "dn": dn, "inLayer": dn and dn["inLayer"]},
                     len(i3["pickerOptions"]) == 0 and "لا فئات" in (i3["pickerStateRow"] or "")
                     and dn and dn["display"] != "none" and dn["w"] > 0 and dn["inLayer"] is True
                     and "لم تعد متاحة" in dn["text"])
        self.assert_("الفئة الجارية أُسقطت (لا بديل تلقائي)", "null",
                     {"draft": i3["draftCategory"], "trigger": i3["catTriggerLabel"]},
                     i3["draftCategory"] is None and "لا فئة محددة" in i3["catTriggerLabel"])
        self.shot(page, "f03-16-picker-empty-drop-390.png")
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        i4 = self.insp(page)
        self.assert_("إغلاق الطبقة يمسح رسالة الزوال من النطاق", "مخفية فعليًا", i4["dropNote"],
                     i4["dropNote"] is None or (i4["dropNote"]["hiddenAttr"] is True and i4["dropNote"]["display"] == "none"))
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i5 = self.insp(page)
        self.assert_("الحفظ بلا فئة: خطأ موضعي بلا عملية", "خطأ + saveCalls=0",
                     {"err": i5["catError"], "save": i5["saveCalls"]},
                     i5["catError"] is True and i5["saveCalls"] == 0)
        self.path_end()

    def p17_picker_stale_and_snapshot(self, page, url):
        self.path_begin("F03-17", "رد قراءة قديم يُتجاهل؛ snapshot القراءة من لحظة الدعوة (R1-03)")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        self.arm(page, "read", "ready")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        before = self.insp(page)
        self.stale(page, "read", {"readId": 0, "outcome": "ready",
                                  "items": [{"value": "stale", "label": "فئة قديمة"}]})
        page.wait_for_timeout(120)
        after = self.insp(page)
        self.assert_("الرد القديم لم يغيّر الخيارات/الحالة/الإعلان",
                     "لا تغيّر",
                     {"opts": [o["value"] for o in after["pickerOptions"]],
                      "row": after["pickerStateRow"], "live": after["pickerLiveText"]},
                     [o["value"] for o in after["pickerOptions"]] == [o["value"] for o in before["pickerOptions"]]
                     and after["pickerStateRow"] == before["pickerStateRow"]
                     and "قديمة" not in after["pickerLiveText"])
        self.assert_("تجاهل مسجل للفحص", "staleIgnored=1", after["staleIgnored"], after["staleIgnored"] == 1)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        final = self.insp(page)
        vis = [o for o in final["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("الطلب الصحيح حُسم بعده", "3 ظاهر", len(vis), len(vis) == 3)
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        # snapshot على مستوى الموصل: المصدر يتغير بعد الدعوة فلا يمس النتيجة
        snap = page.evaluate("""async () => {
          const c = F03Sim.createConnector({store: window.F03Store});
          c.setNextRead('ready');
          const p = c.readCategories({readId: 1});
          c.setSource([{value: 'b', label: 'after'}]);
          c.settle('read');
          return await p;
        }""")
        self.assert_("snapshot القراءة عند بدء الدعوة لا عند التسوية (R1-03)",
                     "فئات المخزن الثلاث لا «after»",
                     {"items": [i["label"] for i in snap["items"]]},
                     [i["label"] for i in snap["items"]] == ["فئة أ", "فئة ب", "فئة ج"])
        mut = page.evaluate("""async () => {
          const c = F03Sim.createConnector({store: window.F03Store});
          const src = [{value: 'a', label: 'before'}];
          c.setSource(src);
          c.setNextRead('ready');
          const p = c.readCategories({readId: 1});
          src[0].label = 'معدّل بعد الدعوة';
          c.settle('read');
          return (await p).items[0].label;
        }""")
        self.assert_("تعديل خصائص كائنات المصدر بعد الدعوة لا يمس النتيجة (R1-03)",
                     "before", mut, mut == "before")
        nested = page.evaluate("""async () => {
          /* تداخل فعلي بموصلين مستقلين (عقد الفيض: الدعوة الثانية لنفس
             النوع على الموصل نفسه تُلغي الأولى إلغاءً صريحًا — فُحص أعلاه) */
          const c1 = F03Sim.createConnector({store: window.F03Store});
          const c2 = F03Sim.createConnector({store: window.F03Store});
          c1.setSource([{value: 'x', label: 'مصدر أول'}]);
          const p1 = c1.readCategories({readId: 1});
          const p2 = c2.readCategories({readId: 2});
          const r2 = await p2; const r1 = await p1;
          return {r1: r1.items[0].label, r2: r2.items[0].label};
        }""")
        self.assert_("قراءتان متداخلتان: كل نتيجة من snapshot دعوتها",
                     "مصدر أول/فئة أ", nested,
                     nested["r1"] == "مصدر أول" and nested["r2"] == "فئة أ")
        overflow = page.evaluate("""async () => {
          /* عقد الفيض الموثق: دعوة ثانية على الموصل نفسه تُعلن؛ القديمة
             تبقى قابلة للحسم بأمرها الخاص ولا يتيم أي وعد */
          const c = F03Sim.createConnector({store: window.F03Store});
          c.setNextRead('ready');
          const p1 = c.readCategories({readId: 1});
          await new Promise(r => setTimeout(r, 60));
          let overflowSeen = false;
          document.addEventListener('f03:sim', (e) => { if (e.detail && e.detail.type === 'overflow') overflowSeen = true; }, {once: true});
          const p2 = c.readCategories({readId: 2});
          const r2 = await p2;               // الثاني يحسم بمؤقته الافتراضي
          const firstStillPending = !c.calls[0].settled;
          c.settle('read');                  // الإنهاء الصريح للأول المسلح
          const r1 = await p1;
          return {overflowSeen, r2out: r2.outcome, firstStillPending, r1out: r1.outcome,
                  r1snapshot: r1.items[0].label};
        }""")
        self.assert_("الفيض المعلن: كل دعوة تحسم بعقدها وبـsnapshot دعوتها",
                     "overflow+ready+ready",
                     overflow, overflow["overflowSeen"] is True and overflow["r2out"] == "ready"
                     and overflow["firstStillPending"] is True and overflow["r1out"] == "ready")
        self.path_end()

    def p18_timer_ownership(self, page, url):
        self.path_begin("F03-18", "مؤقت الطلب يخص طلبه: مؤقت قديم لا يحسم طلبًا أحدث (R1-04)")
        self.fresh(page, url)
        timer = page.evaluate("""async () => {
          const c = F03Sim.createConnector({store: window.F03Store});
          let first = null, second = null;
          const one = c.readCategories({readId: 1}).then(r => { first = r; });
          await new Promise(r => setTimeout(r, 80));
          c.setNextRead('error');   // الدعوة الثانية مسلحة: معلقة حتى أمر صريح/مهلة حتمية
          const two = c.readCategories({readId: 2}).then(r => { second = r; });
          await new Promise(r => setTimeout(r, 700)); // بعد مهلة الأول الافتراضية (600ms)
          const mid = {firstSettled: c.calls[0].settled, firstOutcome: first && first.outcome,
                       firstItems: first && first.items.length,
                       secondSettled: c.calls[1].settled, second: second};
          c.settle('read');         // الإنهاء الصريح للثاني
          await two;
          return {mid: mid, secondAfter: second};
        }""")
        m = timer["mid"]
        self.assert_("مؤقت الأول حسم طلبه هو بنتيجته ولم يمس المسلح (R1-04)",
                     "first محسوم ببياناته وsecond معلق",
                     m,
                     m["firstSettled"] is True and m["firstOutcome"] == "ready" and m["firstItems"] == 3
                     and m["secondSettled"] is False and m["second"] is None)
        self.assert_("الطلب المسلح حُسم بأمره الصريح بعدها دون تسوية مبكرة", "error",
                     {"outcome": timer["secondAfter"]["outcome"]},
                     timer["secondAfter"]["outcome"] == "error")
        rev = page.evaluate("""async () => {
          const c = F03Sim.createConnector({store: window.F03Store});
          c.setNextRead('ready');    // الأول مسلح
          const p1 = c.readCategories({readId: 1});
          await new Promise(r => setTimeout(r, 80));
          const p2 = c.readCategories({readId: 2});  // الثاني افتراضي: مؤقته 600ms
          await p2;                  // مؤقت الثاني لا يمس الأول المسلح
          const firstStillPending = !c.calls[0].settled;
          await new Promise(r => setTimeout(r, 1400)); // مهلة الحسم الحتمي للمسلح (2000ms منذ دعوته)
          const r1 = await p1;
          return {firstStillPending: firstStillPending, r1out: r1.outcome,
                  secondSettledFirst: c.calls[1].seq === 2 && c.calls[1].settled};
        }""")
        self.assert_("والعكس: مؤقت الثاني لا يحسم الأول المسلح — والمسلح يحسم بمهلته الحتمية",
                     "المسلح يبقى حتى أمره/مهلته ثم يحسم",
                     rev, rev["firstStillPending"] is True and rev["r1out"] == "ready"
                     and rev["secondSettledFirst"] is True)
        cancel = page.evaluate("""async () => {
          const c = F03Sim.createConnector({store: window.F03Store});
          c.setNextRead('ready');
          const p1 = c.readCategories({readId: 1}).catch(e => e);
          c.cancel('read', 1);
          const err = await p1;
          return {cancelled: !!err.cancelled};
        }""")
        self.assert_("الإلغاء الصريح بعقد موثق {cancelled:true} — لا وعد يتيم", "cancelled",
                     cancel, cancel["cancelled"] is True)
        self.path_end()

    def p19_closed_context_read(self, page, url):
        self.path_begin("F03-19", "رد منتقي مغلق لا يمس جلسة أحدث (R1-05): إبطال السياق وإلغاء صريح وفلتر سياق")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        self.arm(page, "read", "empty")     # قراءة معلقة
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(100)
        old_read_seq = self.insp(page)["readSeq"]
        page.click("#f03-cat-layer-close")  # إغلاق المنتقي: إبطال السياق + إلغاء صريح
        page.wait_for_timeout(450)
        i = self.insp(page)
        evts = [e["t"] for e in i["events"]]
        self.assert_("إغلاق المنتقي ألغى الطلب المعلق إلغاءً صريحًا (عقد R1-04)",
                     "read:cancelled في الأحداث",
                     evts, "read:cancelled" in evts)
        page.click("#f03-form-back")        # رجوع clean من النموذج
        self.wait_view(page, "detail")
        page.click("#f03-detail-edit")      # فتح جلسة نموذج جديدة
        self.wait_view(page, "form")
        before = self.insp(page)
        self.assert_("جلسة جديدة بفئتها المحفوظة وclean",
                     "cat-a وdirty=false",
                     {"cat": before["current"]["category"], "dirty": before["dirty"]},
                     before["current"]["category"] == "cat-a" and before["dirty"] is False)
        # رد القراءة القديمة يصل «شبكيًا» بعد كل شيء (تسليم اختبار بالمعرف الصحيح):
        # فلتر السياق في المستهلك يجب أن يُبطله كليًا (الجلسة/الفتح/العرض تغيرت)
        self.stale(page, "read", {"readId": old_read_seq, "outcome": "empty", "items": []})
        page.wait_for_timeout(200)
        after = self.insp(page)
        self.assert_("رد القراءة القديمة لا يغير فئة الجلسة الجديدة ولا dirty ولا الرسائل",
                     "لا تغيّر",
                     {"cat": after["current"]["category"], "dirty": after["dirty"],
                      "msg": after["formMessage"], "focus": after["focusId"], "picker": after["pickerOpen"]},
                     after["current"]["category"] == before["current"]["category"]
                     and after["dirty"] is False and after["formMessage"] is None
                     and after["pickerOpen"] is False)
        self.assert_("تجاهل مسجل (سياق مغلق)", "staleIgnored=1", after["staleIgnored"], after["staleIgnored"] == 1)
        # قراءة جديدة صحيحة في سياق حي تحسم بعدها
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(800)
        i2 = self.insp(page)
        vis = [o for o in i2["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("الجلسة الجديدة قادرة على الحسم: قراءة صحيحة بثلاث فئات",
                     "3 ظاهر", len(vis), len(vis) == 3)
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(400)
        self.path_end()

    def p20_save_cycle_order(self, page, url):
        self.path_begin("F03-20", "الدورة الافتراضية: تعديل → حفظ → حسم تلقائي → نجاح مرة واحدة بعد الانتقال (R1-06)")
        self.fresh(page, url)
        self.open_edit_form(page, "it-04")
        page.fill("#f03-name", "عنصر دال المعدّل")
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("حالة saving بديل واحد وحقول readOnly",
                     "busy واحد وreadonly وcat معطل",
                     {"op": i["op"], "busy": i["saveBusy"], "ro": i["readonly"], "catDis": i["catTriggerDisabled"]},
                     i["op"] == "saving" and i["saveBusy"] is True and i["readonly"] is True
                     and i["catTriggerDisabled"] is True)
        self.assert_("نسخة إرسال ثابتة خام", "مطابقة", i["sending"],
                     i["sending"]["values"]["name"] == "عنصر دال المعدّل" and i["sending"]["mode"] == "edit")
        self.shot(page, "f03-20-saving-390.png")
        self.wait_saved(page)
        page.wait_for_timeout(150)
        i2 = self.insp(page)
        evts = [e["t"] for e in i2["events"]]
        self.assert_("ترتيب الأحداث: الحفظ ثم الانتقال ثم كتابة الرسالة (R1-06)",
                     "save:saved → view:detail → note:written",
                     {"order": [t for t in evts if t in ("save:saved", "view:detail", "note:written")][-3:],
                      "writtenOnce": sum(1 for t in evts if t == "note:written")},
                     [t for t in evts if t in ("save:saved", "view:detail", "note:written")][-3:]
                     == ["save:saved", "view:detail", "note:written"]
                     and sum(1 for t in evts if t == "note:written") == 1)
        self.assert_("الرسالة في سياق التفاصيل الظاهر فعليًا وبلا سلف inert",
                     "visible وinert=false",
                     {"note": i2["detailNote"], "visible": i2["detailNoteVisible"], "inert": i2["detailNoteInertAncestor"]},
                     i2["detailNote"] and i2["detailNoteVisible"] is True and i2["detailNoteInertAncestor"] is False)
        self.assert_("البيانات الجديدة في التفاصيل وdirty=false وتركيز صالح",
                     "محدّث",
                     {"read": i2["detailRead"], "dirty": i2["dirty"], "focus": i2["focusId"]},
                     i2["detailRead"]["name"] == "عنصر دال المعدّل" and i2["dirty"] is False
                     and i2["focusId"] not in ("none", "body"))
        self.shot(page, "f03-20-saved-detail-390.png")
        self.path_end()

    def p21_double_activation(self, page, url):
        self.path_begin("F03-21", "منع التفعيل المتكرر: pointer وEnter وSpace وsubmit أثناء pending → دعوة واحدة")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        self.arm(page, "save", "saved")  # معلق حتى الإنهاء/المهلة الحتمية
        page.fill("#f03-note", "ملاحظة للتفعيل المتكرر")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        # أثناء pending: زر الحفظ في حالة التحميل (B01) — نكرر كل الطرق
        page.dispatch_event("#f03-save", "click")     # pointer متكرر
        page.focus("#f03-name")
        page.keyboard.press("Enter")                  # submit متكرر من الحقل
        page.focus("#f03-save")
        page.keyboard.press("Enter")
        page.keyboard.press("Space")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("كل التفعيلات المتكررة أطلقت دعوة واحدة", "saveCalls=1",
                     {"save": i["saveCalls"], "op": i["op"]},
                     i["saveCalls"] == 1 and i["op"] == "saving")
        busy_blocks_pointer = page.evaluate("""() => {
          const b = document.getElementById('f03-save');
          const r = b.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return hit !== b;  // النقر الحقيقي لا يصل للزر أثناء التحميل (حراسة بصرية إضافية)
        }""")
        self.assert_("النقر الحقيقي أثناء pending لا يصل إلى الزر (حالة التحميل B01)",
                     "elementFromPoint ≠ الزر", busy_blocks_pointer, busy_blocks_pointer is True)
        self.settle(page, "save")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("الحسم يعمل بنتيجته بعد الحراسة", "تم حفظ التعديلات",
                     i2["detailNote"], i2["detailNote"] and i2["detailNote"]["title"] == "تم حفظ التعديلات")
        self.path_end()

    def p22_not_saved_retry(self, page, url):
        self.path_begin("F03-22", "رفض معلوم: القيم باقية والرسالة باقية والتصحيح ومحاولة جديدة تنجح")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "اسم لن يُحفظ")
        page.fill("#f03-note", "ملاحظة باقية")
        self.arm(page, "save", "not-saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("failed: رسالة باقية داخل النموذج والقيم باقية",
                     "رسالة error وقيم كما كتبت",
                     {"op": i["op"], "msg": i["formMessage"], "name": i["current"]["name"], "note": i["current"]["note"],
                      "view": i["view"]},
                     i["op"] == "failed" and i["formMessage"] and i["formMessage"]["variant"] == "error"
                     and i["current"]["name"] == "اسم لن يُحفظ" and i["current"]["note"] == "ملاحظة باقية"
                     and i["view"] == "form")
        self.assert_("إعادة المحاولة متاحة والحقول قابلة للتحرير", "readonly=false",
                     {"ro": i["readonly"], "busy": i["saveBusy"]},
                     i["readonly"] is False and i["saveBusy"] is False)
        self.shot(page, "f03-22-not-saved-390.png")
        # رسالة انتهى سببها تزال عند تغيّر القيم (درس F01-R1-03)
        page.fill("#f03-note", "تعديل بعد الرفض")
        page.wait_for_timeout(100)
        i2 = self.insp(page)
        self.assert_("تغيير القيم أزال رسالة الرفض المنتهية سببها",
                     "msg=null", i2["formMessage"], i2["formMessage"] is None)
        # محاولة جديدة (سيناريو saved مسلح) تنجح
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        self.wait_saved(page)
        i3 = self.insp(page)
        self.assert_("المحاولة الجديدة تنجح بالقيم الحالية", "اسم لن يُحفظ محفوظ",
                     {"read": i3["detailRead"], "dirty": i3["dirty"]},
                     i3["detailRead"]["name"] == "اسم لن يُحفظ" and i3["detailRead"]["note"] == "تعديل بعد الرفض"
                     and i3["dirty"] is False)
        self.path_end()

    def p23_unknown_check_saved(self, page, url):
        self.path_begin("F03-23", "نتيجة غير مؤكدة: زر التحقق يظهر ظهورًا فعليًا ولا إعادة إرسال؛ التحقق → نجاح")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "اسم نتيجته مجهولة")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("unknown: لا «لم يُحفظ» ولا إعادة إرسال تلقائية",
                     "op=unknown وsaveCalls=1 ورسالة تحذير",
                     {"op": i["op"], "save": i["saveCalls"], "msg": i["formMessage"], "ro": i["readonly"]},
                     i["op"] == "unknown" and i["saveCalls"] == 1
                     and i["formMessage"] and "غير مؤكدة" in i["formMessage"]["title"] and i["readonly"] is True)
        cb = i["checkBox"]
        self.assert_("زر «التحقق من النتيجة» يظهر ظهورًا فعليًا", "display!=none وw>0",
                     cb, cb["display"] != "none" and cb["w"] > 0 and cb["hiddenAttr"] is False)
        self.shot(page, "f03-23-unknown-390.png")
        # الحفظ محروس في unknown
        page.click("#f03-save")
        page.wait_for_timeout(100)
        i2 = self.insp(page)
        self.assert_("الحفظ محروس أثناء unknown (لا دعوة جديدة)", "saveCalls=1",
                     i2["saveCalls"], i2["saveCalls"] == 1)
        # التحقق (تفعيل متكرر) → saved على المحاولة نفسها
        self.arm(page, "check", "saved")
        page.click("#f03-check")
        page.wait_for_timeout(80)
        page.dispatch_event("#f03-check", "click")  # تفعيل متكرر أثناء busy
        page.wait_for_timeout(80)
        self.settle(page, "check")
        self.wait_saved(page)
        i3 = self.insp(page)
        self.assert_("التحقق مرة واحدة رغم التكرار ثم نجاح بالانتقال",
                     "checkCalls=1 ونجاح",
                     {"check": i3["checkCalls"], "note": i3["detailNote"], "save": i3["saveCalls"]},
                     i3["checkCalls"] == 1 and i3["detailNote"]
                     and i3["detailNote"]["title"] == "تم حفظ التعديلات" and i3["saveCalls"] == 1)
        self.assert_("زر التحقق اختفى فعليًا بعد الحسم", "hidden فعلي",
                     {"visible": i3["checkVisible"]}, i3["checkVisible"] is False)
        self.path_end()

    def p24_check_not_saved_and_unknown(self, page, url):
        self.path_begin("F03-24", "التحقق → رفض معلوم يبقي القيم؛ تحقق مجهول يبقي unknown ويمكن إعادة التحقق")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-note", "ملاحظة تحقق")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(120)
        self.arm(page, "check", "not-saved")
        page.click("#f03-check")
        page.wait_for_timeout(100)
        self.settle(page, "check")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("تأكد الرفض: لا نجاح ولا انتقال والقيم باقية",
                     "form وfailed وقيم باقية",
                     {"view": i["view"], "op": i["op"], "msg": i["formMessage"], "note": i["current"]["note"],
                      "checkVisible": i["checkVisible"]},
                     i["view"] == "form" and i["op"] == "failed" and i["formMessage"]
                     and "لم تُحفظ" in i["formMessage"]["title"] and i["current"]["note"] == "ملاحظة تحقق"
                     and i["checkVisible"] is False)
        # إعادة الحفظ تعيد النتيجة مجهولة ثم تحقق مجهول يبقي إمكان إعادة التحقق
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(120)
        self.arm(page, "check", "unknown")
        page.click("#f03-check")
        page.wait_for_timeout(100)
        self.settle(page, "check")
        page.wait_for_timeout(150)
        i2 = self.insp(page)
        self.assert_("تحقق مجهول: عودة unknown بلا حفظ جديد وإعادة التحقق متاحة",
                     "op=unknown وcheck ظاهر وsaveCalls=2",
                     {"op": i2["op"], "check": i2["checkCalls"], "save": i2["saveCalls"], "visible": i2["checkVisible"],
                      "msg": i2["formMessage"]},
                     i2["op"] == "unknown" and i2["checkCalls"] == 2 and i2["saveCalls"] == 2
                     and i2["checkVisible"] is True and i2["formMessage"]
                     and "تعذر تأكيد" in i2["formMessage"]["title"])
        self.shot(page, "f03-24-check-unknown-390.png")
        self.path_end()

    def p25_stale_save_check(self, page, url):
        self.path_begin("F03-25", "ردود حفظ/تحقق بمعرف قديم تُتجاهل كليًا والطلب المعلق يحسم بعده")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "اسم الطلب المعلق")
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.stale(page, "save", {"attemptId": 0, "outcome": "saved"})
        self.stale(page, "check", {"attemptId": 0, "outcome": "saved"})
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("الردود القديمة لم تغير الحالة/الرسالة/التركيز",
                     "لا تغيّر",
                     {"op": i["op"], "msg": i["formMessage"], "stale": i["staleIgnored"], "focus": i["focusId"]},
                     i["op"] == "saving" and i["staleIgnored"] == 2)
        self.settle(page, "save")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("الطلب الصحيح حُسم بعده بنتيجته", "نجاح",
                     {"note": i2["detailNote"], "read": i2["detailRead"]},
                     i2["detailNote"] and i2["detailRead"]["name"] == "اسم الطلب المعلق")
        self.path_end()

    def p26_leave_clean(self, page, url):
        self.path_begin("F03-26", "مغادرة نظيفة: عودة مباشرة بلا حوار وتركيز صالح")
        self.fresh(page, url)
        # من تعديل عنصر دون تغيير → رجوع للتفاصيل مباشرة
        self.open_edit_form(page, "it-01")
        page.click("#f03-form-back")
        self.wait_view(page, "detail")
        i = self.insp(page)
        self.assert_("رجوع نظيف من تعديل → تفاصيل بلا حوار وتركيز على «تعديل»",
                     "detail/dialog=false/focus=f03-detail-edit",
                     {"view": i["view"], "dialog": i["dialogOpen"], "focus": i["focusId"]},
                     i["view"] == "detail" and i["dialogOpen"] is False and i["focusId"] == "f03-detail-edit")
        # من إضافة فارغة → عودة لوجهة الوصول مباشرة (التنقل للرئيسية أولًا بالنقر)
        page.click("#f03-detail-back")   # التفاصيل → القائمة
        self.wait_view(page, "list")
        page.click("#f03-list-back")     # القائمة → الرئيسية
        self.wait_view(page, "home")
        page.click("#f03-home-add")
        self.wait_view(page, "form")
        page.click("#f03-form-back")
        self.wait_view(page, "home")
        i2 = self.insp(page)
        self.assert_("رجوع نظيف من إضافة فارغة → الرئيسية بلا حوار",
                     "home/dialog=false",
                     {"view": i2["view"], "dialog": i2["dialogOpen"]},
                     i2["view"] == "home" and i2["dialogOpen"] is False)
        self.path_end()

    def p27_leave_dirty_dialog(self, page, url):
        self.path_begin("F03-27", "مغادرة مع تغييرات: حوار قرار — البقاء يبقي الإدخال والتجاهل يغادر بلا حفظ")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "اسم سيُسأل عنه")
        page.fill("#f03-note", "ملاحظة سيُسأل عنها")
        page.click("#f03-form-back")
        self.wait_dialog(page)
        i = self.insp(page)
        self.assert_("الحوار يفتح والتركيز على زر البقاء",
                     "dialog=true/focus=f03-stay",
                     {"dialog": i["dialogOpen"], "focus": i["focusId"]},
                     i["dialogOpen"] is True and i["focusId"] == "f03-stay")
        self.shot(page, "f03-27-leave-dialog-390.png")
        page.click("#f03-stay")
        page.wait_for_timeout(450)
        i2 = self.insp(page)
        self.assert_("البقاء يبقي الإدخال والتركيز والنموذج مفتوحًا",
                     "form والقيم كما هي",
                     {"view": i2["view"], "name": i2["current"]["name"], "note": i2["current"]["note"], "dirty": i2["dirty"]},
                     i2["view"] == "form" and i2["current"]["name"] == "اسم سيُسأل عنه"
                     and i2["current"]["note"] == "ملاحظة سيُسأل عنها" and i2["dirty"] is True)
        # التجاهل يغادر بلا حفظ والبيانات المحفوظة كما هي
        page.click("#f03-form-back")
        self.wait_dialog(page)
        page.click("#f03-abandon")
        self.wait_view(page, "detail")
        page.wait_for_timeout(150)
        i3 = self.insp(page)
        self.assert_("التجاهل يغادر النموذج إلى التفاصيل المحفوظة بلا أي حفظ",
                     "detail/القيم المحفوظة/saveCalls=0",
                     {"view": i3["view"], "read": i3["detailRead"], "save": i3["saveCalls"], "focus": i3["focusId"]},
                     i3["view"] == "detail" and i3["detailRead"]["name"] == "عنصر ألف"
                     and i3["saveCalls"] == 0 and i3["focusId"] == "f03-detail-edit")
        # مغادرة الإضافة بالتجاهل → عودة لوجهة الوصول بلا عنصر جديد
        page.click("#f03-detail-back")   # التفاصيل → القائمة
        self.wait_view(page, "list")
        page.click("#f03-list-add")
        self.wait_view(page, "form")
        page.fill("#f03-name", "لن يُضاف")
        page.click("#f03-form-back")
        self.wait_dialog(page)
        page.click("#f03-abandon")
        self.wait_view(page, "list")
        i4 = self.insp(page)
        self.assert_("تجاهل الإضافة يعود للقائمة بلا عنصر جديد",
                     "9 صفوف", i4["list"]["rowCount"], i4["list"]["rowCount"] == 9)
        self.path_end()

    def p28_leave_busy_blocked(self, page, url):
        self.path_begin("F03-28", "المغادرة أثناء busy محجوبة برسالة موجزة والعملية تحسم بنتيجتها")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "اسم مشغول")
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        page.click("#f03-form-back")  # محجوبة
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("المغادرة محجوبة برسالة والحالة saving مستمرة",
                     "form وsaving ورسالة حجب",
                     {"view": i["view"], "op": i["op"], "msg": i["formMessage"]},
                     i["view"] == "form" and i["op"] == "saving"
                     and i["formMessage"] and "غير متاحة" in i["formMessage"]["title"])
        self.shot(page, "f03-28-leave-blocked-390.png")
        # Escape أثناء busy محجوب أيضًا (يُغطى سياسه في F03-30)
        self.settle(page, "save")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("العملية تحسم بنتيجتها رغم محاولة المغادرة",
                     "نجاح", i2["detailNote"], i2["detailNote"] and i2["detailNote"]["title"] == "تم حفظ التعديلات")
        self.path_end()

    def p29_focus_trap_layers(self, page, url):
        self.path_begin("F03-29", "حصر التركيز والطبقات: Tab داخل الطبقة العليا والخلفية معزولة والعودة للمشغّل")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(800)
        # Tab من البحث يدور داخل الطبقة العليا
        page.focus("#f03-picker-search")
        for _ in range(8):
            page.keyboard.press("Tab")
        i = self.insp(page)
        active_in_layer = page.evaluate("document.getElementById('f03-cat-layer').contains(document.activeElement)")
        self.assert_("Tab المتكرر يبقى داخل الطبقة العليا", "active داخل f03-cat-layer",
                     {"active": i["focusId"], "inLayer": active_in_layer, "openLayers": i["openLayers"]},
                     active_in_layer and i["openLayers"] == 1)
        bg_inert = page.evaluate("!!document.getElementById('view-form').closest('[inert]')")
        self.assert_("الخلفية معزولة فعليًا (سلف inert) أثناء الطبقة", "true", bg_inert, bg_inert is True)
        self.shot(page, "f03-29-picker-layer-390.png")
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        i2 = self.insp(page)
        self.assert_("الإغلاق يعيد التركيز إلى صف الفئة ويزيل العزل",
                     "f03-cat-trigger وinert=false",
                     {"focus": i2["focusId"], "inert": page.evaluate("document.getElementById('view-form').inert")},
                     i2["focusId"] == "f03-cat-trigger"
                     and page.evaluate("document.getElementById('view-form').inert") is False)
        self.path_end()

    def p30_escape_policy(self, page, url):
        self.path_begin("F03-30", "سياسة Escape: طبقة → تُغلق؛ dirty → الحوار؛ pending → حجب؛ غير ذلك لا فعل")
        self.fresh(page, url)
        self.open_edit_form(page, "it-01")
        # dirty → الحوار
        page.fill("#f03-name", "اسم لإسكيب")
        page.keyboard.press("Escape")
        self.wait_dialog(page)
        i = self.insp(page)
        self.assert_("Escape على نموذج dirty يفتح حوار البقاء (لا تخلي صامت)",
                     "dialog=true وdirty بقي", i["dialogOpen"], i["dialogOpen"] is True)
        # Escape داخل الحوار → إغلاق الحوار فقط (بقاء)
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        i2 = self.insp(page)
        self.assert_("Escape داخل الحوار يغلفه فقط: بقاء بالنموذج والإدخال",
                     "dialog=false والنموذج بقي",
                     {"dialog": i2["dialogOpen"], "view": i2["view"], "name": i2["current"]["name"]},
                     i2["dialogOpen"] is False and i2["view"] == "form" and i2["current"]["name"] == "اسم لإسكيب")
        # pending → حجب
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        page.keyboard.press("Escape")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        self.assert_("Escape أثناء pending محجوب برسالة",
                     "form وsaving",
                     {"view": i3["view"], "op": i3["op"], "msg": i3["formMessage"]},
                     i3["view"] == "form" and i3["op"] == "saving" and i3["formMessage"]
                     and "غير متاحة" in i3["formMessage"]["title"])
        self.settle(page, "save")
        self.wait_saved(page)
        # في التفاصيل: Escape لا فعل (موثق)
        page.keyboard.press("Escape")
        page.wait_for_timeout(120)
        i4 = self.insp(page)
        self.assert_("Escape في التفاصيل: لا فعل (رجوع النظام خارج النطاق)",
                     "detail", i4["view"], i4["view"] == "detail")
        self.path_end()


    def p31_widths(self, page, url):
        self.path_begin("F03-31", "المقاسات 320/360/390/430: لا خروج أفقي ولا قص في كل العروض والطبقات")
        self.fresh(page, url)
        record = {}
        states = [
            ("home", None),
            ("list", lambda: self.open_list(page)),
            ("detail", lambda: (self.open_detail_of(page, "it-05"))),
            ("form", lambda: (page.click("#f03-detail-edit"), self.wait_view(page, "form"))),
            ("picker", lambda: (page.click("#f03-cat-trigger"), self.wait_picker(page))),
            ("dialog", lambda: (page.fill("#f03-note", "نص يجعل النموذج أطول"), page.click("#f03-form-back"), self.wait_dialog(page))),
        ]
        # تجهيزات متراكبة: نبدأ من المسار الطويل ثم نغلق الطبقات بين المقاسات
        for w in WIDTHS:
            page.set_viewport_size({"width": w, "height": 844})
            # home
            page.evaluate("() => { document.querySelectorAll('.f03-view').forEach(v => v.hidden = v.id !== 'view-home'); F03App.showView('home'); }")
            page.wait_for_timeout(60)
            ok, ov = self.no_overflow_ok(page)
            record[f"{w}@home"] = {"ok": ok, **ov}
            # list
            self.open_list(page)
            page.wait_for_timeout(60)
            ok, ov = self.no_overflow_ok(page)
            record[f"{w}@list"] = {"ok": ok, **ov}
            # detail
            self.open_detail_of(page, "it-05")
            page.wait_for_timeout(60)
            ok, ov = self.no_overflow_ok(page)
            record[f"{w}@detail"] = {"ok": ok, **ov}
            # form
            page.click("#f03-detail-edit")
            self.wait_view(page, "form")
            page.wait_for_timeout(60)
            ok, ov = self.no_overflow_ok(page)
            record[f"{w}@form"] = {"ok": ok, **ov}
            # picker
            page.click("#f03-cat-trigger")
            self.wait_picker(page)
            page.wait_for_timeout(700)
            ok, ov = self.no_overflow_ok(page)
            record[f"{w}@picker"] = {"ok": ok, **ov}
            page.click("#f03-cat-layer-close")
            page.wait_for_timeout(400)
            # leave dialog (dirty)
            page.fill("#f03-note", "نص يجعل النموذج أطول قليلًا للفحص عند المقاسات")
            page.click("#f03-form-back")
            self.wait_dialog(page)
            page.wait_for_timeout(60)
            ok, ov = self.no_overflow_ok(page)
            record[f"{w}@dialog"] = {"ok": ok, **ov}
            page.click("#f03-stay")
            page.wait_for_timeout(400)
        page.set_viewport_size(VIEW)
        bad = {k: v for k, v in record.items() if not v["ok"]}
        self.assert_("لا خروج أفقي في كل المقاسات والحالات (24 قياسًا)", "24/24",
                     {"bad": list(bad.keys()), "total": len(record)},
                     len(bad) == 0 and len(record) == 24)
        self.shot(page, "f03-31-width-320.png")
        page.set_viewport_size({"width": 320, "height": 844})
        page.evaluate("F03App.showView('home')")
        page.wait_for_timeout(80)
        self.open_list(page)
        self.shot(page, "f03-31-list-320.png")
        page.set_viewport_size(VIEW)
        self.path_end()

    def p32_zoom200(self, page, url):
        self.path_begin("F03-32", "تكبير النص 200%: قياس قبل/بعد وحدود الحروف داخل الأفعال داخل الإطار وتمرير فعلي")
        self.fresh(page, url)
        # (أ) رسالة خطأ الحقل تتضاعف دون قص عند 320
        page.set_viewport_size({"width": 320, "height": 844})
        self.open_add_form(page)
        page.fill("#f03-note", "ملاحظة تُقاس عند التكبير")
        before = page.evaluate("window.F03h.msgSize('#f03-note')")
        page.click("#f03-save")
        page.wait_for_timeout(120)
        msg_before = page.evaluate("window.F03h.msgSize('#f03-name-msg.is-visible')")
        self.assert_("رسالة الخطأ مرئية قبل التكبير", "h>0", msg_before, msg_before and msg_before["h"] > 0)
        page.evaluate("window.F03h.zoom2()")
        page.wait_for_timeout(120)
        msg_after = page.evaluate("window.F03h.msgSize('#f03-name-msg.is-visible')")
        self.assert_("نص الرسالة يتضاعف عند 200%", "h تقريبًا ×2",
                     {"before": msg_before, "after": msg_after},
                     msg_after and msg_before and msg_after["h"] >= msg_before["h"] * 1.6)
        self.assert_("لا خروج أفقي عند 320 و200%", "bad=0",
                     page.evaluate("window.F03h.overflow()"),
                     self.no_overflow_ok(page)[0])
        self.shot(page, "f03-32-zoom200-form-320.png")
        # (ب) حدود أفعال صفحة النموذج وحروفها أفقيا عند 320/200% (المحتوى يتمرر رأسيا)
        bounds = page.evaluate("window.F03h.actionBounds('#view-form')")
        ok_bounds = page.evaluate("([d, w, h, f]) => window.F03h.boundsOk(d, w, h, f)", [bounds, 320, 844, False])
        self.assert_("حدود أفعال النموذج وحروفها أفقيا داخل الإطار عند 320/200%",
                     "كل زر وكل حرف داخل الحدود الأفقية",
                     {"actions": [a["id"] for a in bounds["actions"]], "ok": ok_bounds},
                     ok_bounds and len(bounds["actions"]) >= 1)
        # (ب2) المقصورة الثابتة (حوار البقاء) عند 320/200%: أفعالها داخل الإطار رأسيا وأفقيا
        page.fill("#f03-note", "نص يجعل النموذج أطول للفحص")
        page.click("#f03-form-back")
        self.wait_dialog(page)
        page.wait_for_timeout(100)
        bounds_d = page.evaluate("window.F03h.actionBounds('#f03-leave-dialog')")
        ok_d = page.evaluate("([d, w, h, f]) => window.F03h.boundsOk(d, w, h, f)", [bounds_d, 320, 844, True])
        self.assert_("أفعال الحوار الثابت وحروفها داخل الشاشة كاملة عند 320/200%",
                     "كل زر داخل الإطار رأسيا وأفقيا",
                     {"actions": [a["id"] for a in bounds_d["actions"]], "ok": ok_d,
                      "rects": [[a["top"], a["bottom"], a["left"], a["right"]] for a in bounds_d["actions"]]},
                     ok_d)
        page.click("#f03-stay")
        page.wait_for_timeout(400)
        # (ج) تمرير فعلي للوصول إلى زر الحفظ داخل الشاشة
        save_rect_before = page.evaluate("window.F03h.rect('#f03-save')")
        page.evaluate("window.F03h.scrollPageTo('#f03-save')")
        page.wait_for_timeout(80)
        save_rect_after = page.evaluate("window.F03h.rect('#f03-save')")
        self.assert_("زر الحفظ قابل للوصول بتمرير فعلي عند 320/200%",
                     "bottom داخل الشاشة بعد التمرير",
                     {"before": save_rect_before, "after": save_rect_after},
                     save_rect_after["bottom"] <= 845 and save_rect_after["top"] >= -1)
        page.evaluate("window.F03h.unzoom()")
        page.wait_for_timeout(100)
        # (د) حالة unknown عند 320/200%: أفعال التذييل الثلاثة بحدود سليمة
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "اسم للفحص عند التكبير")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(120)
        page.evaluate("window.F03h.zoom2()")
        page.wait_for_timeout(120)
        bounds2 = page.evaluate("window.F03h.actionBounds('#view-form')")
        ok2 = page.evaluate("([d, w, h, f]) => window.F03h.boundsOk(d, w, h, f)", [bounds2, 320, 844, False])
        self.assert_("أفعال unknown وحروفها أفقيا داخل الإطار عند 320/200% (تمرير فعلي للوصول)",
                     "كل زر داخل الحدود الأفقية",
                     {"actions": [a["id"] for a in bounds2["actions"]], "ok": ok2},
                     ok2 and len(bounds2["actions"]) == 4)  # رجوع + صف الفئة + حفظ + تحقق
        self.shot(page, "f03-32-zoom200-unknown-320.png")
        page.evaluate("window.F03h.unzoom()")
        page.set_viewport_size(VIEW)
        self.path_end()

    def p33_reduced_motion(self, page, url):
        self.path_begin("F03-33", "reduced-motion (تفضيل بيئة حقيقي): فتح/إغلاق فوريان بلا حركة والوظيفة محفوظة")
        rm_ctx = page.context.browser.new_context(viewport=VIEW, reduced_motion="reduce")
        pg = rm_ctx.new_page()
        self._track(pg)
        pg.goto(url)
        pg.wait_for_load_state("load")
        pg.evaluate(JS_HELPERS)
        pg.wait_for_function("!!window.F03App")
        pg.wait_for_timeout(150)
        self.open_edit_form(pg, "it-01")
        pg.click("#f03-cat-trigger")
        self.wait_picker(pg)
        pg.wait_for_timeout(700)
        i = self.insp(pg)
        self.assert_("الطبقة تفتح وتعمل بلا حركة", "مفتوحة و3 خيارات",
                     {"open": i["pickerOpen"], "opts": len(i["pickerOptions"])},
                     i["pickerOpen"] is True and len(i["pickerOptions"]) == 3)
        opening = pg.evaluate("document.getElementById('f03-cat-layer').hasAttribute('data-opening')")
        self.assert_("لا طور فتح مكاني (data-opening منزوع)", "false", opening, opening is False)
        pg.click("#f03-cat-layer-close")
        pg.wait_for_timeout(150)  # إغلاق فوري بلا انتقال
        i2 = self.insp(pg)
        self.assert_("الإغلاق فوري والمحاورة كاملة", "مغلق وتركيز صالح",
                     {"open": i2["pickerOpen"], "focus": i2["focusId"]},
                     i2["pickerOpen"] is False and i2["focusId"] == "f03-cat-trigger")
        pg.screenshot(path=str(self.shots / "f03-33-reduced-motion-390.png"))
        rm_ctx.close()
        self.path_end()

    def p34_keyboard_and_targets(self, page, url):
        self.path_begin("F03-34", "دورة كاملة بلوحة المفاتيح وحدها + أهداف لمس السياسة (48px)")
        self.fresh(page, url)
        # الرئيسية → القائمة
        page.focus("#f03-home-all")
        page.keyboard.press("Enter")
        self.wait_view(page, "list")
        # فتح أول صف بالكيبورد
        page.evaluate("document.querySelector('#f03-list-rows .f03-row').focus()")
        page.keyboard.press("Enter")
        self.wait_view(page, "detail")
        # تعديل
        page.focus("#f03-detail-edit")
        page.keyboard.press("Enter")
        self.wait_view(page, "form")
        page.keyboard.type("ن")  # dirty بالكيبورد
        page.keyboard.press("Escape")  # dirty → الحوار
        self.wait_dialog(page)
        page.keyboard.press("Enter")  # البقاء (autofocus)
        page.wait_for_timeout(450)
        i = self.insp(page)
        self.assert_("حوار Escape بالكيبورد: البقاء يبقي النموذج",
                     "form وdirty",
                     {"view": i["view"], "dirty": i["dirty"]},
                     i["view"] == "form" and i["dirty"] is True)
        # المنتقي بالكيبورد: فتح → بحث → تنقل أسهم → اختيار Enter
        page.focus("#f03-cat-trigger")
        page.keyboard.press("Enter")
        self.wait_picker(page)
        page.wait_for_timeout(700)
        page.keyboard.type("ج")  # تصفية لفئة ج
        page.wait_for_timeout(120)
        page.keyboard.press("Tab")  # إلى الخيار الجوال
        page.keyboard.press("Enter")  # اختيار
        page.wait_for_timeout(450)
        i2 = self.insp(page)
        self.assert_("اختيار فئة بالكيبورد وحده", "cat-c ومغلق",
                     {"cat": i2["current"]["category"], "open": i2["pickerOpen"]},
                     i2["current"]["category"] == "cat-c" and i2["pickerOpen"] is False)
        # حفظ بالكيبورد
        page.focus("#f03-save")
        page.keyboard.press("Enter")
        self.wait_saved(page)
        i3 = self.insp(page)
        self.assert_("حفظ بالكيبورد → نجاح كامل", "تم حفظ التعديلات",
                     i3["detailNote"], i3["detailNote"] and i3["detailNote"]["title"] == "تم حفظ التعديلات")
        # أهداف اللمس: سياسة المكتبة 48px — قياس كل زر في عرضه الظاهر
        targets = []
        targets += page.evaluate("window.F03h.targets(['#f03-detail-edit'])")          # التفاصيل ظاهرة الآن
        page.evaluate("F03App.showView('home')")
        page.wait_for_timeout(80)
        targets += page.evaluate("window.F03h.targets(['#f03-home-add', '#f03-home-all'])")
        self.open_list(page)
        targets += page.evaluate("window.F03h.targets(['#f03-filter-btn'])")
        targets += page.evaluate("window.F03h.targets(['#f03-list-rows .f03-row'])")
        page.evaluate("F03App.openForm({mode: 'add'})")
        page.wait_for_timeout(100)
        targets += page.evaluate("window.F03h.targets(['#f03-save'])")
        undersized = [t for t in targets if not t.get("missing") and t["h"] < 48]
        self.assert_("أهداف اللمس وفق سياسة المشروع (48px) — سياسة لا ادعاء WCAG",
                     "كل h>=48 في عرضه",
                     targets, len(undersized) == 0)
        self.path_end()

    def p35_review_mode(self, page, url):
        self.path_begin("F03-35", "وضع المراجعة: مغلق افتراضيًا ويُفتح من التذييل بالنقر وينهي المعلق من الهاتف (R1-01/07)")
        self.fresh(page, url)
        i = self.insp(page)
        rev = page.evaluate("window.F03h.rect('#f03-review-layer')")
        self.assert_("الطبقة مغلقة افتراضيًا (display:none فعليًا)",
                     "مغلق", {"rect": rev, "open": i["reviewOpen"]},
                     rev is not None and rev["w"] == 0 and i["reviewOpen"] is False)
        # الفتح بالنقر من رابط التذييل فقط
        page.click("#f03-review-open")
        self.wait_review(page)
        i2 = self.insp(page)
        self.assert_("الرابط يفتح الطبقة وأدواتها ظاهرة",
                     "مفتوحة وأدوات مرئية",
                     {"open": i2["reviewOpen"], "tools": page.evaluate("window.F03h.tabbablesIn('#f03-review-layer').length")},
                     i2["reviewOpen"] is True and page.evaluate("window.F03h.tabbablesIn('#f03-review-layer').length") >= 6)
        self.shot(page, "f03-35-review-layer-390.png")
        page.click("#f03-review-close")
        page.wait_for_timeout(450)
        # سيناريو كامل بالنقر حصرًا: تسليح رفض → حفظ معلق → إنهاء من الطبقة
        page.click("#f03-review-open")
        self.wait_review(page)
        page.select_option("#f03-rev-save-outcome", "not-saved")
        page.click("#f03-review-close")
        page.wait_for_timeout(450)
        self.open_edit_form(page, "it-01")
        page.fill("#f03-name", "سيناريو من الهاتف")
        page.click("#f03-save")
        page.wait_for_timeout(200)
        i3 = self.insp(page)
        self.assert_("السيناريو المسلح جعل الحفظ معلقًا", "saving",
                     {"op": i3["op"], "pending": i3["sim"]["pendingSave"]},
                     i3["op"] == "saving" and i3["sim"]["pendingSave"] is True)
        # المستخدم يصل لأدوات الإنهاء دون console ولا reload: التذييل ثم الطبقة
        page.evaluate("window.F03h.scrollPageTo('#f03-review-open')")
        page.click("#f03-review-open")
        self.wait_review(page)
        settle_btn = page.evaluate("window.F03h.targets(['#f03-rev-settle-save'])")[0]
        self.assert_("زر «إنهاء الحفظ المعلق» متاح ومفعّل داخل الطبقة العليا",
                     "h>0 وغير معطل",
                     {"btn": settle_btn, "disabled": page.evaluate("document.getElementById('f03-rev-settle-save').disabled"),
                      "inert": page.evaluate("!!document.getElementById('f03-rev-settle-save').closest('[inert]')")},
                     settle_btn["h"] > 0 and page.evaluate("document.getElementById('f03-rev-settle-save').disabled") is False
                     and page.evaluate("!!document.getElementById('f03-rev-settle-save').closest('[inert]')") is False)
        page.click("#f03-rev-settle-save")  # إنهاء بالنقر فقط
        page.wait_for_timeout(200)
        i4 = self.insp(page)
        self.assert_("الرفض طُبق بالنقر: رسالة باقية والقيم باقية",
                     "failed وقيم باقية",
                     {"op": i4["op"], "msg": i4["formMessage"], "name": i4["current"]["name"]},
                     i4["op"] == "failed" and i4["formMessage"] and i4["current"]["name"] == "سيناريو من الهاتف")
        page.click("#f03-review-close")
        page.wait_for_timeout(400)
        self.shot(page, "f03-35-review-settled-390.png")
        # المسلح بلا إنهاء يدوي: حسم حتمي داخل الموصل (2000ms) — لا فخ
        page.click("#f03-review-open")
        self.wait_review(page)
        page.select_option("#f03-rev-save-outcome", "unknown")
        page.click("#f03-review-close")
        page.wait_for_timeout(450)
        page.fill("#f03-note", "ملاحظة الحسم التلقائي")
        page.click("#f03-save")
        page.wait_for_timeout(300)
        i5 = self.insp(page)
        self.assert_("المسلح معلق قبل مهلته", "saving", i5["op"], i5["op"] == "saving")
        page.wait_for_timeout(2300)  # مهلة الحسم الحتمي ARMED_SETTLE_MS
        i6 = self.insp(page)
        self.assert_("حسم تلقائي حتمي بلا تدخل: لا مستخدم محتجز في pending",
                     "unknown بعد المهلة",
                     {"op": i6["op"], "checkVisible": i6["checkVisible"]},
                     i6["op"] == "unknown" and i6["checkVisible"] is True)
        self.path_end()

    def p36_storage_persistence(self, page, url):
        self.path_begin("F03-36", "التخزين المحلي: الحفظ يبقى بعد إعادة الفتح؛ الاستعادة والتفريغ بالنقر والحالة معلنة")
        self.fresh(page, url)
        i = self.insp(page)
        self.assert_("التخزين متاح في بيئة الفحص ومعلن بصدق", "persistent=true",
                     i["storage"], i["storage"]["available"] is True and i["storage"]["persistent"] is True)
        # تعديل + حفظ
        self.open_edit_form(page, "it-02")
        page.fill("#f03-name", "عنصر باء المحفوظ")
        page.click("#f03-save")
        self.wait_saved(page)
        page.wait_for_timeout(150)
        # إعادة فتح كاملة (إقلاع جديد يقرأ المخزن المحلي)
        page.goto(url)
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        page.wait_for_function("!!window.F03App")
        page.wait_for_timeout(200)
        i2 = self.insp(page)
        self.assert_("إعادة فتح الملف تعرض البيانات المحفوظة (بلا بذرة)",
                     "الاسم المحفوظ في القائمة",
                     {"rows": i2["list"]["rowCount"] if i2["view"] == "list" else None,
                      "seedCount": page.evaluate("window.F03h.storageSeed()")},
                     page.evaluate("window.F03h.storageSeed()") == 9)
        self.open_list(page)
        row_text = page.evaluate("document.querySelector(\"#f03-list-rows .f03-row[data-id='it-02']\").innerText")
        self.assert_("الصف المحفوظ ظاهر بعد إعادة الفتح", "عنصر باء المحفوظ",
                     row_text, "عنصر باء المحفوظ" in row_text)
        # استعادة البذرة بالنقر من وضع المراجعة
        page.click("#f03-review-open")
        self.wait_review(page)
        page.click("#f03-rev-reset-data")
        page.wait_for_timeout(200)
        page.click("#f03-review-close")
        page.wait_for_timeout(400)
        i3 = self.insp(page)
        row_text2 = page.evaluate("document.querySelector(\"#f03-list-rows .f03-row[data-id='it-02']\").innerText")
        self.assert_("«استعادة البيانات الأصلية» بالنقر تعيد البذرة",
                     "عنصر باء (بذرة)",
                     {"rows": i3["list"]["rowCount"]}, i3["list"]["rowCount"] == 9 and "عنصر باء المحفوظ" not in row_text2)
        self.path_end()

    def p37_storage_unavailable(self, page, url):
        self.path_begin("F03-37", "تعذر التخزين المحلي: تدهور آمن إلى حفظ الجلسة بلا انهيار والحالة معلنة")
        ctx2 = page.context.browser.new_context(viewport=VIEW)
        pg2 = ctx2.new_page()
        self._track(pg2)
        pg2.add_init_script("""
          Object.defineProperty(window, 'localStorage', {
            get() { throw new Error('محاكاة حجب التخزين المحلي'); },
            configurable: false
          });
        """)
        pg2.goto(url)
        pg2.wait_for_load_state("load")
        pg2.evaluate(JS_HELPERS)
        pg2.wait_for_function("!!window.F03App")
        pg2.wait_for_timeout(200)
        i = pg2.evaluate("window.F03h.insp()")
        self.assert_("الإقلاع يعمل بلا تخزين محلي (بذرة في الذاكرة)", "home و9 عناصر",
                     {"view": i["view"], "count": "9" in i["home"]["countLine"]},
                     i["view"] == "home" and "9" in i["home"]["countLine"])
        self.assert_("الحالة معلنة بصدق: التخزين غير متاح", "available=false",
                     i["storage"], i["storage"]["available"] is False and i["storage"]["persistent"] is False)
        # الحفظ يعمل داخل الجلسة
        self.open_edit_form(pg2, "it-01")
        pg2.fill("#f03-name", "جلسة بلا تخزين")
        pg2.click("#f03-save")
        self.wait_saved(pg2)
        i2 = pg2.evaluate("window.F03h.insp()")
        self.assert_("الحفظ داخل الجلسة يعمل رغم حجب التخزين",
                     "نجاح", i2["detailNote"],
                     i2["detailNote"] and i2["detailNote"]["title"] == "تم حفظ التعديلات")
        self.shot_tool = None
        pg2.screenshot(path=str(self.shots / "f03-37-storage-blocked-390.png"))
        ctx2.close()
        self.path_end()

    def p38_standalone_and_build(self, page, url):
        self.path_begin("F03-38", "الملف الواحد عبر file://: صفر طلبات خارجية وخطوط وأيقونات وبناء حتمي وتكافؤ")
        # (أ) بناء حتمي: --check يطابق إعادة التوليد
        out = subprocess.run([sys.executable, str(ROOT / "tools" / "build-f03-standalone.py"), "--check"],
                             capture_output=True, text=True, cwd=str(ROOT))
        self.assert_("build --check: الملف مطابق لإعادة التوليد بايت-ببايت", "CHECK OK",
                     {"code": out.returncode, "out": (out.stdout + out.stderr).strip()[:300]},
                     out.returncode == 0 and "CHECK OK" in out.stdout)
        self.assert_("حماية أصول الأيقونات تعمل في البناء (R1-02)", "ICON CHECK OK",
                     out.stdout, "ICON CHECK OK" in out.stdout)
        # (ب) فتح file:// بسياق جديد بلا شبكة
        ctx2 = page.context.browser.new_context(viewport=VIEW)
        pg2 = ctx2.new_page()
        self._track(pg2)
        reqs = []
        pg2.on("request", lambda r: reqs.append(r.url))
        file_url = (ROOT / SAMPLE_REL / "standalone.html").as_uri()
        pg2.goto(file_url)
        pg2.wait_for_load_state("load")
        pg2.evaluate(JS_HELPERS)
        pg2.wait_for_function("!!window.F03App")
        pg2.wait_for_timeout(400)
        external = [u for u in reqs if not (u.startswith("file://") or u.startswith("data:"))]
        self.assert_("صفر طلبات خارجية (كل الطلبات file:// أو data:)", "0 خارجي",
                     {"total": len(reqs), "external": external}, len(external) == 0 and len(reqs) >= 1)
        fonts = pg2.evaluate("window.F03h.fontsLoaded()")
        self.assert_("الخطان محمّلان داخل الملف الواحد", "arabic+latin",
                     fonts, fonts["arabic400"] is True and fonts["arabic500"] is True and fonts["latin400"] is True)
        body = pg2.evaluate("window.F03h.bodyText()")
        self.assert_("الواجهة الافتراضية نظيفة أيضًا في الملف الواحد (R1-01)",
                     "بلا نصوص تقنية",
                     {"hits": [t for t in ["UX-F03", "DRAFT", "SIMULATION"] if t in body]},
                     not any(t in body for t in ["UX-F03", "DRAFT", "SIMULATION"]))
        i2 = pg2.evaluate("window.F03h.insp()")
        self.assert_("تكافؤ الإقلاع: الرئيسية من البذرة بلا طلبات",
                     "9 عناصر و0/0/0",
                     {"count": "9" in i2["home"]["countLine"], "calls": (i2["saveCalls"], i2["checkCalls"], i2["readCalls"])},
                     "9" in i2["home"]["countLine"] and (i2["saveCalls"], i2["checkCalls"], i2["readCalls"]) == (0, 0, 0))
        # (ج) دورة مفاتيح تكافؤ في الملف الواحد: تعديل وحفظ ونجاح
        self.open_edit_form(pg2, "it-01")
        pg2.fill("#f03-name", "تعديل في الملف الواحد")
        pg2.click("#f03-save")
        self.wait_saved(pg2)
        i3 = pg2.evaluate("window.F03h.insp()")
        self.assert_("تكافؤ السلوك: الحفظ ينجح ويرسالة واحدة في التفاصيل",
                     "success",
                     {"note": i3["detailNote"], "read": i3["detailRead"]},
                     i3["detailNote"] and i3["detailNote"]["title"] == "تم حفظ التعديلات"
                     and i3["detailRead"]["name"] == "تعديل في الملف الواحد")
        chev = pg2.evaluate("window.F03h.iconFill('.f03-cat__chevron')")
        self.assert_("سهم الفئة في الملف الواحد: fill=none (R1-02)",
                     "none", chev, chev["found"] is True and chev["useFill"] == "none")
        pg2.screenshot(path=str(self.shots / "f03-38-standalone-home.png"))
        ctx2.close()
        self.path_end()

    # ===================== التنفيذ =====================
    def run(self, browser, url_source):
        page = browser.new_page(viewport=VIEW)
        self._track(page)
        page.evaluate(JS_HELPERS)  # لا يضر قبل أي goto

        self.p01_boot(page, url_source)
        self.p02_home_from_data(page, url_source)
        self.p03_home_actions(page, url_source)
        self.p04_list_rows(page, url_source)
        self.p05_search(page, url_source)
        self.p06_no_results_vs_empty(page, url_source)
        self.p07_filter_panel(page, url_source)
        self.p08_search_with_filters(page, url_source)
        self.p09_detail_back_context(page, url_source)
        self.p10_edit_flow_updates_everywhere(page, url_source)
        self.p11_add_flow_updates_everywhere(page, url_source)
        self.p12_validation(page, url_source)
        self.p13_clean_save_and_dirty(page, url_source)
        self.p14_picker_read_and_select(page, url_source)
        self.p15_picker_search(page, url_source)
        self.p16_picker_error_empty(page, url_source)
        self.p17_picker_stale_and_snapshot(page, url_source)
        self.p18_timer_ownership(page, url_source)
        self.p19_closed_context_read(page, url_source)
        self.p20_save_cycle_order(page, url_source)
        self.p21_double_activation(page, url_source)
        self.p22_not_saved_retry(page, url_source)
        self.p23_unknown_check_saved(page, url_source)
        self.p24_check_not_saved_and_unknown(page, url_source)
        self.p25_stale_save_check(page, url_source)
        self.p26_leave_clean(page, url_source)
        self.p27_leave_dirty_dialog(page, url_source)
        self.p28_leave_busy_blocked(page, url_source)
        self.p29_focus_trap_layers(page, url_source)
        self.p30_escape_policy(page, url_source)
        self.p31_widths(page, url_source)
        self.p32_zoom200(page, url_source)
        self.p33_reduced_motion(page, url_source)
        self.p34_keyboard_and_targets(page, url_source)
        self.p35_review_mode(page, url_source)
        self.p36_storage_persistence(page, url_source)
        self.p37_storage_unavailable(page, url_source)
        self.p38_standalone_and_build(page, url_source)
        page.close()


def main() -> int:
    ap = argparse.ArgumentParser(description="فحص UX-F03 للتجربة المترابطة")
    ap.add_argument("--round", default="", help="مجلد الجولة داخل reviews/UX-F03 (مثال: r2)")
    args = ap.parse_args()

    out = OUT / args.round if args.round else OUT
    tool = CheckTool(out)

    # خادم ملفات محلي للمصدر
    class Handler(SimpleHTTPRequestHandler):
        def log_message(self, *a):  # noqa: N802
            pass

    handler = functools.partial(Handler, directory=str(ROOT))
    srv = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    url_source = f"http://127.0.0.1:{port}/{SAMPLE_REL}/index.html"
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()

    summary = {}
    try:
        with sync_playwright() as pw:
            launch_kwargs = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
            if BROWSER_PATH:
                launch_kwargs["executable_path"] = BROWSER_PATH
            browser = pw.chromium.launch(**launch_kwargs)
            tool.run(browser, url_source)

            # بيئة reduced-motion حقيقية (تفضيل البيئة) للمسار 33
            rm_ctx = browser.new_context(viewport=VIEW, reduced_motion="reduce")
            rm_page = rm_ctx.new_page()
            tool._track(rm_page)
            tool.path_begin("F03-39", "reduced-motion بالتفضيل الحقيقي للبيئة: فتح/إغلاق ووظيفة محفوظة")
            tool.fresh(rm_page, url_source)
            rm_page.click("#f03-home-all")
            tool.wait_view(rm_page, "list")
            tool.open_detail_of(rm_page, "it-01")
            rm_page.click("#f03-detail-edit")
            tool.wait_view(rm_page, "form")
            rm_page.fill("#f03-name", "اسم بلا حركة")
            rm_page.click("#f03-cat-trigger")
            tool.wait_picker(rm_page)
            rm_page.wait_for_timeout(700)
            i = tool.insp(rm_page)
            tool.assert_("المنتقي يفتح ويعمل بتفضيل الحركة المخفض", "3 خيارات",
                         {"open": i["pickerOpen"], "opts": len(i["pickerOptions"])},
                         i["pickerOpen"] is True and len(i["pickerOptions"]) == 3)
            rm_page.click("#f03-picker .m-picker__option[data-value='cat-b']")
            rm_page.wait_for_timeout(200)
            i2 = tool.insp(rm_page)
            tool.assert_("الاختيار والإغلاق فوريان والوظيفة محفوظة",
                         "cat-b ومغلق",
                         {"cat": i2["current"]["category"], "open": i2["pickerOpen"]},
                         i2["current"]["category"] == "cat-b" and i2["pickerOpen"] is False)
            rm_ctx.close()
            tool.path_end()

            browser.close()
    finally:
        srv.shutdown()

    # التحقق النهائي: الأخطاء المجمعة عبر كل المسارات بلا مسح
    tool.path_begin("F03-40", "صحة عامة: صفر أخطاء صفحة وموارد عبر جميع المسارات مجمعة (بلا مسح)")
    tool.assert_("أخطاء صفحة/كونسول عبر كل المسارات", "0",
                 {"count": len(tool.errors_all), "errors": [e for _, e in tool.errors_all][:10]},
                 len(tool.errors_all) == 0)
    tool.assert_("فشل موارد (طلبات فاشلة أو HTTP>=400)", "0",
                 {"count": len(tool.resource_failures), "items": tool.resource_failures[:10]},
                 len(tool.resource_failures) == 0)
    tool.path_end()

    total_paths = len(tool.results)
    passed = sum(1 for r in tool.results if r["result"] == "PASS")
    failed = [r["id"] for r in tool.results if r["result"] == "FAIL"]
    total_asserts = sum(len(r["assertions"]) for r in tool.results)

    verification = {
        "tool": "tools/ux-f03-check.py",
        "experience": "F03 تجربة مترابطة: رئيسية/قائمة/تفاصيل/إضافة-تعديل (الموجز F03-EXPERIENCE-BRIEF)",
        "source": tool.git_info(),
        "browser": {"engine": "Chromium (Playwright headless)"},
        "url_source": url_source,
        "widths": WIDTHS,
        "zoom_policy": "مضاعفة أحجام الخط المحسوبة بتمريرين (الآلية المعلنة) — لا native zoom",
        "paths": tool.results,
        "summary": {
            "paths_total": total_paths,
            "paths_passed": passed,
            "paths_failed": failed,
            "assertions_total": total_asserts,
            "page_errors_total": len(tool.errors_all),
            "resource_failures_total": len(tool.resource_failures),
            "not_run": [
                "Samsung Galaxy S25 الحقيقي وأي جهاز فعلي — محاكاة Chromium ليست اختبار S25 ولا Samsung Internet",
                "TalkBack/VoiceOver وقارئ شاشة فعلي",
                "native zoom (تكبير النظام) — تمت المحاكاة المعلنة فقط",
                "اللمس الحقيقي ولوحة مفاتيح النظام وsafe areas الفعلية",
                "WebKit/Safari",
                "رجوع النظام (predictive back)",
            ],
            "limits": [
                "تسليم الردود القديمة عبر deliverTestResponse يثبت فلاتر المستهلك ولا يثبت وصولًا شبكيًا",
                "قياس 200% بالآلية المعلنة لا native zoom",
            ],
        },
    }
    (out / "verification.json").write_text(json.dumps(verification, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        f"UX-F03 check — {out.as_posix()}",
        f"source commit: {verification['source']['commit']} (tree {verification['source']['tree']})",
        f"paths: {passed}/{total_paths} PASS; assertions: {total_asserts}",
        f"page_errors_total: {len(tool.errors_all)}; resource_failures_total: {len(tool.resource_failures)}",
    ]
    for r in tool.results:
        lines.append(f"  [{r['result']}] {r['id']}: {r['path']} — {len(r['assertions'])} تحققًا")
        for f in r["failures"]:
            lines.append(f"      FAIL: {f}")
    (out / "verification.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
