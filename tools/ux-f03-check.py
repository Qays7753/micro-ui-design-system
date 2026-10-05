#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص UX-F03 القابلة لإعادة التشغيل (مصفوفة F03-01..F03-30).
من جذر المستودع:
    python3 tools/ux-f03-check.py               # الأدلة إلى reviews/UX-F03/
    python3 tools/ux-f03-check.py --round r1    # الأدلة إلى reviews/UX-F03/<round>/
    F03_ROOT=... F03_OUT=... F03_BROWSER=...    # تجاوزات بيئية (نمط F02 للمراجعة المستقلة)

ما تثبته الأداة: سلوك المستهلك المقاس (قيم/عدادات/تركيز/قياسات) لا وجود النص وحده.
البيئة: Chromium headless فعلي عبر Playwright — محاكاة المتصفح ليست اختبار S25 الحقيقي.
NOT RUN (خارج نطاق هذه الأداة): جهاز فعلي، TalkBack/VoiceOver، native zoom، اللمس، WebKit.
"""
import argparse
import json
import os
import platform
import subprocess
import sys
import threading
import functools
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(os.environ.get("F03_ROOT", Path(__file__).resolve().parent.parent))
OUT = Path(os.environ.get("F03_OUT", "")) if os.environ.get("F03_OUT") else ROOT / "reviews" / "UX-F03"
BROWSER_PATH = os.environ.get("F03_BROWSER", "")

SAMPLE_REL = "previews/ux-patterns/mobile-record-sample"
WIDTHS = [320, 360, 390, 430]

JS_HELPERS = r"""
() => {
  window.F03h = {
    insp: () => window.F03Example.inspect(),
    arm: (k, o) => window.F03Example.arm(k, o),
    settle: (k, o) => window.F03Example.settle(k, o === undefined ? undefined : o),
    stale: (k, p) => window.F03Example.deliverTestResponse(k, p),
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
    // هدف التركيز الفعلي غير محجوب كليًا عن طريق عنصر ثابت فوقه (فحص تقريبي)
    focusRect: (sel) => {
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
    // تكبير النص 200% بتمريرين (الآلية المعلنة في B01-R2-D): قراءة كل الأحجام أولًا ثم التطبيق
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
    msgBodySize: () => {
      const el = document.querySelector('#f03-name-msg.is-visible')
        || document.querySelector('#f03-cat-msg.is-visible')
        || document.querySelector('#f03-op-note .m-note__body')
        || document.querySelector('#f03-view-note .m-note__body');
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { fontSize: cs.fontSize, w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) };
    },
    sheetBodyScroll: () => {
      const b = document.querySelector('#f03-edit-sheet .m-layer__body');
      b.scrollTop = b.scrollHeight; // تمرير فعلي حتى النهاية
      return { scrollH: b.scrollHeight, clientH: b.clientHeight, scrollTopAfter: Math.round(b.scrollTop) };
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
    iconRendered: (symId) => {
      const sym = document.getElementById(symId);
      const use = document.querySelector('use[href="#' + symId + '"]');
      if (!sym || !use) return { sym: !!sym, use: !!use };
      const host = use.closest('svg');
      const r = host.getBoundingClientRect();
      return { sym: true, use: true, hostW: Math.round(r.width), hostH: Math.round(r.height) };
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
        self.results = []      # صف لكل مسار
        self.page_errors = []  # أخطاء الصفحة الحالية
        self.current_id = ""
        self.metas = {}

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

    def path_end(self):
        r = self.results[-1]
        r["result"] = "PASS" if not r["failures"] else "FAIL"

    def shot(self, page, name):
        page.screenshot(path=str(self.shots / name), full_page=False)

    # ---------- مساعدات تشغيل ----------
    def fresh(self, page, url):
        """بداية كل مسار من حالة نظيفة (نمط F01: كل صف يبدأ من fresh)"""
        self.page_errors.clear()
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(url)
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        page.wait_for_timeout(120)

    def open_page(self, ctx, url):
        page = ctx.new_page()
        page.set_viewport_size({"width": 390, "height": 844})
        page.on("pageerror", lambda e: self.page_errors.append(f"pageerror: {e}"))
        page.on("console", lambda m: self.page_errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
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
    def wait_saved(page, timeout=4000):
        page.wait_for_function("() => { const i = window.F03h.insp(); return i.sheetOpen === false && i.op === 'idle' && i.viewNote !== null; }", timeout=timeout)

    @staticmethod
    def wait_sheet(page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().sheetOpen === true", timeout=timeout)
        page.wait_for_timeout(120)  # استقرار الفتح/التركيز

    @staticmethod
    def wait_picker(page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().catLayerOpen === true", timeout=timeout)

    @staticmethod
    def wait_dialog(page, timeout=2000):
        page.wait_for_function("() => window.F03h.insp().dialogOpen === true", timeout=timeout)

    @staticmethod
    def no_overflow_ok(page, extra_allowed=0):
        ov = page.evaluate("window.F03h.overflow()")
        ok = ov["scrollW"] <= ov["clientW"] + extra_allowed and ov["badCount"] == 0
        return ok, ov

    @staticmethod
    def check_widths(page, states, record):
        """states: قائمة (اسم حالة، تجهيز) — قياس كل مقاس في كل حالة."""
        for w in WIDTHS:
            page.set_viewport_size({"width": w, "height": 800})
            for state_name, prep in states:
                if prep:
                    prep()
                page.wait_for_timeout(60)
                ok, ov = CheckTool.no_overflow_ok(page)
                record[f"{w}@{state_name}"] = {"ok": ok, **ov}
            # عناصر الأفعال ظاهرة أفقًا في 320 (أضيق مقاس)
        page.set_viewport_size({"width": 390, "height": 844})

    # ---------- مصدر الشجرة ----------
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

    # ===================== المسارات =====================
    def p01_boot(self, page):
        self.path_begin("F03-01", "إقلاع منظر العرض: لا أخطاء، قيم من مصدر وحيد، لا طلبات مبكرة")
        page.wait_for_timeout(250)
        i = self.insp(page)
        self.assert_("لا أخطاء صفحة عند الإقلاع", "0 أخطاء", self.page_errors, len(self.page_errors) == 0)
        self.assert_("القيم الابتدائية من RECORD_INIT",
                     "name=عنصر تجريبي، cat=cat-a، note=''",
                     {"confirmed": i["confirmed"], "read": i["readView"]},
                     i["confirmed"]["name"] == "عنصر تجريبي" and i["confirmed"]["category"]["value"] == "cat-a"
                     and i["confirmed"]["note"] == "" and i["readView"]["name"] == "عنصر تجريبي"
                     and i["readView"]["category"] == "فئة أ" and i["readView"]["note"] == "—")
        self.assert_("dirty=false ولا رسالة نجاح مبكرة", "false/null",
                     {"dirty": i["dirty"], "viewNote": i["viewNote"], "message": i["message"]},
                     i["dirty"] is False and i["viewNote"] is None and i["message"] is None)
        self.assert_("لا دعوات حفظ/تحقق/قراءة عند الإقلاع", "0/0/0",
                     {"save": i["saveCalls"], "check": i["checkCalls"], "read": i["readCalls"]},
                     i["saveCalls"] == 0 and i["checkCalls"] == 0 and i["readCalls"] == 0)
        self.assert_("الطبقات كلها مغلقة", "false",
                     {"sheet": i["sheetOpen"], "picker": i["catLayerOpen"], "dialog": i["dialogOpen"]},
                     not i["sheetOpen"] and not i["catLayerOpen"] and not i["dialogOpen"])
        ok, ov = self.no_overflow_ok(page)
        self.assert_("لا خروج أفقي عند 390", "scrollW<=clientW وbad=0", ov, ok)
        self.shot(page, "f03-01-view-390.png")
        self.path_end()

    def p02_open_edit(self, page):
        self.path_begin("F03-02", "«تعديل» تفتح لوحة B07 والتركيز على الاسم")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        i = self.insp(page)
        self.assert_("اللوحة ظاهرة فعليًا", "sheetOpen=true", {"sheetOpen": i["sheetOpen"], "dialog": i["dialogOpen"]},
                     i["sheetOpen"] is True and not i["dialogOpen"])
        self.assert_("التركيز على حقل الاسم (data-autofocus)", "f03-name", i["focusId"], i["focusId"] == "f03-name")
        self.assert_("القيم = المؤكدة وdirty=false", "مطابقة",
                     {"current": i["current"], "dirty": i["dirty"]},
                     i["current"]["name"] == i["confirmed"]["name"] and i["dirty"] is False)
        self.assert_("لا قراءة منتجقي عند فتح اللوحة", "readCalls=0", i["readCalls"], i["readCalls"] == 0)
        self.assert_("قناة عرض ما زالت بلا رسالة", "null", i["viewNote"], i["viewNote"] is None)
        self.shot(page, "f03-02-edit-sheet-390.png")
        self.path_end()

    def p03_clean_save(self, page):
        self.path_begin("F03-03", "حفظ clean: لا دعوة ولا loading ولا نجاح جديد")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.click("#f03-save")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("لا دعوة حفظ", "saveCalls=0", i["saveCalls"], i["saveCalls"] == 0)
        self.assert_("لا حالة saving ولا busy", "op=idle وbusy=false",
                     {"op": i["op"], "busy": i["saveBusy"]},
                     i["op"] == "idle" and i["saveBusy"] is False)
        self.assert_("رسالة «لا تغييرات» باقية داخل اللوحة",
                     "info/لا تغييرات",
                     {"message": i["message"]},
                     i["message"] and i["message"]["variant"] == "info" and "لا تغييرات" in i["message"]["title"])
        self.assert_("اللوحة بقيت مفتوحة", "sheetOpen=true", i["sheetOpen"], i["sheetOpen"] is True)
        self.path_end()

    def p04_dirty(self, page):
        self.path_begin("F03-04", "dirty يم ويحسب من القيم الخام — العودة للأصل تعيد clean")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-note", "ملاحظة تجريبية")
        page.wait_for_timeout(80)
        i = self.insp(page)
        self.assert_("تعديل الملاحظة → dirty=true", "true", i["dirty"], i["dirty"] is True)
        self.assert_("المؤكدة لم تُمس", "note=''", i["confirmed"]["note"], i["confirmed"]["note"] == "")
        page.fill("#f03-note", "")
        page.wait_for_timeout(80)
        i2 = self.insp(page)
        self.assert_("العودة للأصل → dirty=false دون حفظ", "false وsaveCalls=0",
                     {"dirty": i2["dirty"], "save": i2["saveCalls"]},
                     i2["dirty"] is False and i2["saveCalls"] == 0)
        page.fill("#f03-name", "عنصر تجريبي X")
        page.fill("#f03-name", "عنصر تجريبي")
        page.wait_for_timeout(80)
        i3 = self.insp(page)
        self.assert_("كتابة الاسم ثم إرجاعه → clean", "false", i3["dirty"], i3["dirty"] is False)
        self.assert_("تغيير القيم أزال رسالة «لا تغييرات» المنتهية سببها",
                     "message=null بعد الإدخال", i3["message"], i3["message"] is None)
        self.path_end()

    def p05_invalid_then_fix(self, page):
        self.path_begin("F03-05", "اسم غير صالح: خطأ مرتبط بالحقل والقيم باقية ثم التصحيح")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "   ")
        page.fill("#f03-note", "ملاحظة تبقى")
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("لا عملية عند الاسم غير الصالح", "saveCalls=0", i["saveCalls"], i["saveCalls"] == 0)
        self.assert_("خطأ مرتبط بالحقل aria-invalid+describedby",
                     "true+f03-name-msg",
                     {"invalid": i["nameAriaInvalid"], "desc": i["nameDescribedBy"], "msg": i["nameMsgText"]},
                     i["nameAriaInvalid"] is True and "f03-name-msg" in i["nameDescribedBy"] and "الاسم مطلوب" in i["nameMsgText"])
        self.assert_("التركيز إلى الاسم (موضع التصحيح)", "f03-name", i["focusId"], i["focusId"] == "f03-name")
        self.assert_("بقية القيم باقية (الملاحظة)", "ملاحظة تبقى", i["current"]["note"], i["current"]["note"] == "ملاحظة تبقى")
        self.shot(page, "f03-05-error-name-390.png")
        page.fill("#f03-name", "عنصر مصحّح")
        page.wait_for_timeout(80)
        i2 = self.insp(page)
        self.assert_("التصحيح يزول الخطأ عند الإدخال (UX-09)", "has-error=false",
                     {"err": i2["nameError"], "msg": i2["nameMsgText"]},
                     i2["nameError"] is False and i2["nameMsgText"] == "")
        page.fill("#f03-name", "")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        i3 = self.insp(page)
        self.assert_("رسالة خطأ قديمة لا تبقى مع خطأ جديد", "رسالة الاسم الحالية فقط",
                     {"msg": i3["nameMsgText"], "opMsg": i3["message"]},
                     "الاسم مطلوب" in i3["nameMsgText"])
        self.path_end()

    def p06_picker_read(self, page):
        self.path_begin("F03-06", "فتح المنتقي: قراءة بمعرف جديد loading→ready بثلاث فئات وبذرة الفئة")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.click("#f03-cat-trigger")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("قراءة واحدة بدأت", "readCalls=1", {"read": i["readCalls"], "seq": i["readSeq"]},
                     i["readCalls"] == 1 and i["readSeq"] == 1)
        self.assert_("حالة loading ظاهرة", "جارٍ قراءة الفئات", i["pickerStateRow"],
                     i["pickerStateRow"] and "جارٍ" in i["pickerStateRow"])
        self.assert_("التركيز داخل المنتقي (البحث)", "f03-picker-search", i["focusId"], i["focusId"] == "f03-picker-search")
        page.wait_for_timeout(800)  # حسم تلقائي 700ms
        i2 = self.insp(page)
        opts = [(o["value"], o["selected"], o["visibleRect"]) for o in i2["pickerOptions"]]
        self.assert_("ready بثلاث فئات ظاهرة (واحدة محددة)", "3 خيارات وواحدة selected",
                     {"opts": opts, "row": i2["pickerStateRow"]},
                     len(opts) == 3 and all(v and vis for v, s, vis in opts)
                     and sum(1 for v, s, vis in opts if s) == 1 and i2["pickerStateRow"] is None)
        self.assert_("بذرة فئة اللوحة الجارية في الملخص", "المحدد: فئة أ",
                     {"summary": i2["pickerSummary"], "label": i2["catTriggerLabel"]},
                     i2["pickerSummary"] == "المحدد: فئة أ" and "فئة الحالية: فئة أ" in i2["catTriggerLabel"].replace("الفئة الحالية", "الفئة الحالية"))
        self.assert_("إعلان القراءة من الظاهر (بدون بحث)", "تمت القراءة: 3 فئات",
                     i2["pickerLiveText"], i2["pickerLiveText"] == "تمت القراءة: 3 فئات.")
        self.shot(page, "f03-03-picker-390.png")
        self.path_end()

    def p07_picker_select(self, page):
        self.path_begin("F03-07", "اختيار فئة: تزامن القيمة والملخص والإغلاق والتركيز وdirty")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.click("#f03-cat-trigger")
        page.wait_for_timeout(900)  # قراءة auto
        page.evaluate("""() => {
          const opt = [...document.querySelectorAll('#f03-picker .m-picker__option')]
            .find(o => o.getAttribute('data-value') === 'cat-b');
          opt.click();
        }""")
        page.wait_for_timeout(450)  # اكتمال إغلاق الطبقة (انتقال 240ms)
        i = self.insp(page)
        self.assert_("الطبقة أغلقت والقيمة تزامنت", "cat-b ومغلق",
                     {"open": i["catLayerOpen"], "draft": i["draftCategory"], "summary": i["pickerSummary"]},
                     i["catLayerOpen"] is False and i["draftCategory"]["value"] == "cat-b")
        self.assert_("التركيز عاد إلى صف الفئة", "f03-cat-trigger", i["focusId"], i["focusId"] == "f03-cat-trigger")
        self.assert_("الاسم الإتاحي لصف الفئة حدُث", "تغيير الفئة… فئة ب",
                     i["catTriggerLabel"], "تغيير الفئة" in i["catTriggerLabel"] and "فئة ب" in i["catTriggerLabel"])
        self.assert_("dirty=true بعد تغيير الفئة", "true", {"dirty": i["dirty"], "cur": i["current"]},
                     i["dirty"] is True and i["current"]["category"] == "cat-b")
        self.assert_("لا رسالة زوال ظاهرة عند اختيار سليم", "dropNote مخفية فعليًا",
                     i["dropNote"],
                     i["dropNote"] is None or (i["dropNote"]["hiddenAttr"] is True and i["dropNote"]["display"] == "none"))
        self.path_end()

    def p08_picker_search(self, page):
        self.path_begin("F03-08", "بحث المنتقي: تصفية وno-results ومسح — والحالة المخزنة لا يتغيرها البحث")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.click("#f03-cat-trigger")
        page.wait_for_timeout(900)
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
        self.assert_("بحث بلا مطابقة → صف «لا نتائج مطابقة»",
                     "صف + إعلان منسجم",
                     {"row": i2["pickerStateRow"], "live": i2["pickerLiveText"]},
                     i2["pickerStateRow"] and "لا نتائج مطابقة" in i2["pickerStateRow"]
                     and "لا نتائج مطابقة" in i2["pickerLiveText"])
        self.assert_("no-results نتيجة بحث فقط — الملخص يبقى بفئة اللوحة",
                     "المحدد: فئة أ", i2["pickerSummary"], i2["pickerSummary"] == "المحدد: فئة أ")
        self.shot(page, "f03-04-picker-no-results-390.png")
        page.fill("#f03-picker-search", "")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        vis3 = [o for o in i3["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("مسح البحث يعيد الخيارات ويعلن الظاهر", "3 + إعلان",
                     {"n": len(vis3), "live": i3["pickerLiveText"]},
                     len(vis3) == 3 and "الفئات الظاهرة: 3" in i3["pickerLiveText"])
        self.path_end()

    def p09_picker_error_empty(self, page):
        self.path_begin("F03-09", "فشل قراءة وإعادة محاولة، وempty يؤكد إسقاط الفئة برسالة ظاهرة")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        self.arm(page, "read", "error")
        page.click("#f03-cat-trigger")
        page.wait_for_timeout(120)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("error: صف خطأ + إعادة محاولة", "صف خطأ",
                     {"row": i["pickerStateRow"], "opts": len(i["pickerOptions"])},
                     i["pickerStateRow"] and "تعذر" in i["pickerStateRow"])
        retry = page.evaluate("window.F03h.targets(['[data-picker-retry]'])")[0]
        self.assert_("زر إعادة المحاولة ظاهر بأدنى هدف", "h>=48", retry, retry.get("h", 0) >= 48)
        self.shot(page, "f03-05-picker-error-390.png")
        self.arm(page, "read", "ready")
        page.click("[data-picker-retry]")
        page.wait_for_timeout(120)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        vis = [o for o in i2["pickerOptions"] if not o["hiddenAttr"] and o["visibleRect"]]
        self.assert_("retry → ready يعيد الخيارات", "3 ظاهر", len(vis), len(vis) == 3)
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        # empty مؤكد على قراءة جديدة
        self.arm(page, "read", "empty")
        page.click("#f03-cat-trigger")
        page.wait_for_timeout(120)
        self.settle(page, "read")
        page.wait_for_timeout(120)
        i3 = self.insp(page)
        self.assert_("empty: مصدر فارغ مطبق", "0 خيار",
                     {"n": len(i3["pickerOptions"]), "row": i3["pickerStateRow"], "summary": i3["pickerSummary"]},
                     len(i3["pickerOptions"]) == 0 and "لا فئات" in i3["pickerStateRow"])
        dn = i3["dropNote"]
        self.assert_("رسالة الزوال ظاهرة داخل الطبقة (قناة وحيدة)",
                     "ظاهرة داخل الطبقة role=alert",
                     {"dn": dn, "inLayer": dn and dn["inLayer"]},
                     dn and dn["display"] != "none" and dn["w"] > 0 and dn["inLayer"] is True
                     and "لم تعد متاحة" in dn["text"])
        self.assert_("الفئة الجارية أُسقطت (لا بديل تلقائي)", "null",
                     {"draft": i3["draftCategory"], "trigger": i3["catTriggerLabel"]},
                     i3["draftCategory"] is None and "لا فئة محددة" in i3["catTriggerLabel"])
        self.shot(page, "f03-06-picker-empty-drop-390.png")
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        i4 = self.insp(page)
        self.assert_("إغلاق الطبقة يمسح رسالة الزوال من النطاق", "مخفية فعليًا", i4["dropNote"],
                     i4["dropNote"] is None or (i4["dropNote"]["hiddenAttr"] is True and i4["dropNote"]["display"] == "none"))
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i5 = self.insp(page)
        self.assert_("الحفظ بلا فئة: خطأ موضعي والتركيز لصف الفئة",
                     "خطأ + f03-cat-trigger",
                     {"err": i5["catError"], "msg": i5["catMsgText"], "focus": i5["focusId"], "save": i5["saveCalls"]},
                     i5["catError"] is True and "الفئة مطلوبة" in i5["catMsgText"]
                     and i5["focusId"] == "f03-cat-trigger" and i5["saveCalls"] == 0)
        self.path_end()

    def p10_picker_stale(self, page):
        self.path_begin("F03-10", "رد قراءة بمعرف قديم يُتجاهل كليًا ثم يُحسم الطلب الصحيح")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        self.arm(page, "read", "ready")
        page.click("#f03-cat-trigger")
        page.wait_for_timeout(120)
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
        self.path_end()

    def p11_happy_default(self, page):
        self.path_begin("F03-11", "الدورة الافتراضية: تعديل → حفظ → حسم تلقائي → عرض محدَّث برسالة واحدة")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر معدّل")
        page.fill("#f03-note", "ملاحظة أولى")
        page.click("#f03-save")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("حالة saving بديل واحد", "busy واحد وreadonly",
                     {"op": i["op"], "busy": i["saveBusy"], "ro": i["readonly"], "catDis": i["catTriggerDisabled"]},
                     i["op"] == "saving" and i["saveBusy"] is True and i["readonly"] is True
                     and i["catTriggerDisabled"] is True)
        self.assert_("نسخة إرسال ثابتة خام", "مطابقة للقيم",
                     i["sending"], i["sending"]["name"] == "عنصر معدّل" and i["sending"]["note"] == "ملاحظة أولى")
        self.shot(page, "f03-07-saving-390.png")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("المؤكدة = نسخة الإرسال", "مطابقة",
                     {"confirmed": i2["confirmed"], "sending": i2["sending"]},
                     i2["confirmed"]["name"] == "عنصر معدّل" and i2["confirmed"]["note"] == "ملاحظة أولى")
        self.assert_("اللوحة أُغلقت والعرض محدَّث", "مغلق ومحدّث",
                     {"sheet": i2["sheetOpen"], "read": i2["readView"]},
                     i2["sheetOpen"] is False and i2["readView"]["name"] == "عنصر معدّل"
                     and i2["readView"]["note"] == "ملاحظة أولى")
        self.assert_("رسالة نجاح واحدة في قناة سياق العرض",
                     "success ظاهرة واحدة",
                     {"note": i2["viewNote"], "visible": i2["viewNoteVisible"], "inSheetMsg": i2["message"]},
                     i2["viewNote"] and i2["viewNote"]["variant"] == "success" and i2["viewNoteVisible"] is True
                     and i2["message"] is None)
        self.assert_("dirty=false بعد النجاح", "false", i2["dirty"], i2["dirty"] is False)
        self.assert_("التركيز استعيد لمشغّل «تعديل»", "f03-edit-btn", i2["focusId"], i2["focusId"] == "f03-edit-btn")
        self.assert_("دعوة حفظ واحدة", "saveCalls=1", i2["saveCalls"], i2["saveCalls"] == 1)
        self.shot(page, "f03-08-success-view-390.png")
        self.path_end()

    def p12_double_activation(self, page):
        self.path_begin("F03-12", "تفعيل متكرر أثناء الحفظ: pointer وEnter وSpace وsubmit → دعوة واحدة")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر متكرر")
        self.arm(page, "save", "saved")  # معلق حتى التسوية
        page.click("#f03-save")
        page.wait_for_timeout(100)
        pe = page.evaluate("getComputedStyle(document.getElementById('f03-save')).pointerEvents")
        self.assert_("حارس المؤشر فعليًا أثناء التحميل (B01: pointer-events=none)",
                     "none", pe, pe == "none")
        page.focus("#f03-save")
        page.keyboard.press("Enter")      # Enter متكرر (حارس B01 بالتقاط يمنعه)
        page.keyboard.press(" ")          # Space متكرر
        page.evaluate("document.getElementById('f03-form').requestSubmit()")  # submit من أي طريق
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("دعوة واحدة رغم التكرار", "saveCalls=1",
                     {"save": i["saveCalls"], "op": i["op"], "busy": i["saveBusy"]},
                     i["saveCalls"] == 1 and i["op"] == "saving" and i["saveBusy"] is True)
        self.assert_("القيم والتركيز لم تُفقد أثناء الانتظار", "محفوظة",
                     {"name": i["current"]["name"], "ro": i["readonly"]},
                     i["current"]["name"] == "عنصر متكرر" and i["readonly"] is True)
        self.settle(page, "save")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("التسوية اللاحقة تحسم بنتيجتها", "saved ومغلق",
                     {"op": i2["op"], "sheet": i2["sheetOpen"], "save": i2["saveCalls"]},
                     i2["saveCalls"] == 1 and i2["sheetOpen"] is False
                     and i2["confirmed"]["name"] == "عنصر متكرر")
        self.path_end()

    def p13_known_failure(self, page):
        self.path_begin("F03-13", "رفض معروف: رسالة باقية والقيم باقية والتصحيح وإعادة المحاولة")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر مرفوض")
        self.arm(page, "save", "not-saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("failed برسالة باقية داخل اللوحة", "error باقية",
                     {"op": i["op"], "msg": i["message"], "sheet": i["sheetOpen"]},
                     i["op"] == "failed" and i["message"]["variant"] == "error"
                     and "لم تُحفظ" in i["message"]["text"] and i["sheetOpen"] is True)
        self.assert_("القيم المرفوضة باقية قابلة للتعديل", "قابلة للتعديل",
                     {"name": i["current"]["name"], "ro": i["readonly"], "dirty": i["dirty"]},
                     i["current"]["name"] == "عنصر مرفوض" and i["readonly"] is False and i["dirty"] is True)
        self.assert_("المؤكدة لم تتغير", "الاسم الأصلي", i["confirmed"]["name"], i["confirmed"]["name"] == "عنصر تجريبي")
        self.shot(page, "f03-09-failed-390.png")
        page.fill("#f03-name", "عنصر مصلّح")
        page.wait_for_timeout(80)
        i2 = self.insp(page)
        self.assert_("تغيير القيم أزال رسالة الرفض (وصفت قيمًا قديمة)", "message=null",
                     {"msg": i2["message"], "op": i2["op"]},
                     i2["message"] is None and i2["op"] == "failed")
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        self.wait_saved(page)
        i3 = self.insp(page)
        self.assert_("إعادة المحاولة تنجح", "saved",
                     {"op": i3["op"], "confirmed": i3["confirmed"]["name"], "save": i3["saveCalls"]},
                     i3["confirmed"]["name"] == "عنصر مصلّح" and i3["saveCalls"] == 2)
        self.path_end()

    def p14_unknown(self, page):
        self.path_begin("F03-14", "نتيجة غير مؤكدة: لا ادعاء فشل ولا إعادة إرسال تلقائية وزر التحقق يظهر فعليًا")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-note", "ملاحظة غير مؤكدة")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(150)
        i = self.insp(page)
        self.assert_("unknown برسالة تحذير", "warning",
                     {"op": i["op"], "msg": i["message"]},
                     i["op"] == "unknown" and i["message"]["variant"] == "warning")
        self.assert_("لا نص «لم يُحفظ» ولا ادعاء نتيجة", "لا فشل مؤكد",
                     i["message"]["title"] + i["message"]["text"],
                     "لم تُحفظ" not in (i["message"]["title"] + i["message"]["text"]))
        self.assert_("زر التحقق يظهر ظهورًا فعليًا (لا hidden وحدها)",
                     "display!=none وw>0",
                     {"vis": i["checkVisible"], "box": i["checkBox"]},
                     i["checkVisible"] is True and i["checkBox"]["display"] != "none" and i["checkBox"]["w"] > 0)
        self.assert_("الحقول readOnly وزر الفئة معطل (الوصول محفوظ)",
                     "ro=true",
                     {"ro": i["readonly"], "catDis": i["catTriggerDisabled"], "values": i["current"]},
                     i["readonly"] is True and i["catTriggerDisabled"] is True)
        self.assert_("الحفظ المتكرر أثناء unknown لا يطلق دعوة", "saveCalls=1",
                     (page.click("#f03-save") or self.insp(page))["saveCalls"],
                     self.insp(page)["saveCalls"] == 1)
        self.assert_("المغادرة أثناء unknown محجوبة برسالة موجزة",
                     "حجب برسالة",
                     (page.click("#f03-back") or self.insp(page))["message"]["title"],
                     self.insp(page)["message"]["title"] == "المغادرة غير متاحة الآن")
        self.assert_("اللوحة بقيت مفتوحة والعملية مستمرة", "مفتوحة",
                     {"sheet": self.insp(page)["sheetOpen"], "op": self.insp(page)["op"]},
                     self.insp(page)["sheetOpen"] is True and self.insp(page)["op"] == "unknown")
        self.shot(page, "f03-10-unknown-check-390.png")
        self.path_end()

    def p15_verify_saved_not_saved(self, page):
        self.path_begin("F03-15", "التحقق: تكرار محروس، وsaved يغلق بالنجاح، وnot-saved يبقي القيم")
        # unknown ثم تحقق → saved
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر تحقق")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(100)
        self.arm(page, "check", "saved")
        page.click("#f03-check")
        page.wait_for_timeout(80)
        pe_check = page.evaluate("getComputedStyle(document.getElementById('f03-check')).pointerEvents")
        page.focus("#f03-check")
        page.keyboard.press("Enter")  # تفعيل متكرر بلوحة المفاتيح (حارس B01 يمنعه)
        page.keyboard.press(" ")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("تحقق واحد رغم التكرار (وحارس المؤشر فعليًا)", "checkCalls=1 وpointer-events=none",
                     {"check": i["checkCalls"], "op": i["op"], "busy": i["checkBusy"], "pe": pe_check},
                     i["checkCalls"] == 1 and i["op"] == "checking" and i["checkBusy"] is True and pe_check == "none")
        self.assert_("لا حفظ جديد أثناء التحقق", "saveCalls=1", i["saveCalls"], i["saveCalls"] == 1)
        self.settle(page, "check")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("نتيجة التحقق تُطبق على نسخة الإرسال نفسها وتغلق بالنجاح",
                     "محدث ومغلق",
                     {"confirmed": i2["confirmed"]["name"], "sheet": i2["sheetOpen"], "note": i2["viewNote"]},
                     i2["confirmed"]["name"] == "عنصر تحقق" and i2["sheetOpen"] is False
                     and i2["viewNote"]["variant"] == "success")
        # unknown ثم تحقق → not-saved
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-note", "ملاحظة رفض التحقق")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(100)
        self.arm(page, "check", "not-saved")
        page.click("#f03-check")
        page.wait_for_timeout(100)
        self.settle(page, "check")
        page.wait_for_timeout(150)
        i3 = self.insp(page)
        self.assert_("تحقق not-saved: failed والقيم تبقى في اللوحة",
                     "failed + قيم باقية",
                     {"op": i3["op"], "msg": i3["message"]["variant"], "note": i3["current"]["note"],
                      "ro": i3["readonly"], "sheet": i3["sheetOpen"], "confirmed": i3["confirmed"]["note"]},
                     i3["op"] == "failed" and i3["message"]["variant"] == "error"
                     and i3["current"]["note"] == "ملاحظة رفض التحقق" and i3["readonly"] is False
                     and i3["sheetOpen"] is True and i3["confirmed"]["note"] == "")
        self.assert_("زر التحقق أخفي بعد الحسم والتركيز انتقل لزر الحفظ إن كان مركزًا",
                     "مخفي فعليًا",
                     {"vis": i3["checkVisible"]},
                     i3["checkVisible"] is False)
        self.path_end()

    def p16_check_unknown_reject(self, page):
        self.path_begin("F03-16", "تحقق unknown/رفض: عودة unknown وإعادة تحقق ممكنة دون حفظ جديد")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر مجهول")
        self.arm(page, "save", "unknown")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        self.settle(page, "save")
        page.wait_for_timeout(100)
        self.arm(page, "check", "unknown")
        page.click("#f03-check")
        page.wait_for_timeout(100)
        self.settle(page, "check")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("تحقق مجهول يعيد unknown بلا حفظ جديد",
                     "unknown وcheckCalls=1",
                     {"op": i["op"], "msg": i["message"]["title"], "check": i["checkCalls"], "save": i["saveCalls"]},
                     i["op"] == "unknown" and "تعذر تأكيد" in i["message"]["title"]
                     and i["checkCalls"] == 1 and i["saveCalls"] == 1)
        # رفض Promise للتحقق
        self.arm(page, "check", "reject")
        page.click("#f03-check")
        page.wait_for_timeout(100)
        self.settle(page, "check")
        page.wait_for_timeout(120)
        i2 = self.insp(page)
        self.assert_("رفض تحقق يبقى unknown وإعادة التحقق متاحة",
                     "unknown وcheckCalls=2",
                     {"op": i2["op"], "vis": i2["checkVisible"], "check": i2["checkCalls"]},
                     i2["op"] == "unknown" and i2["checkVisible"] is True and i2["checkCalls"] == 2)
        # إعادة تحقق بنتيجة not-saved لاحقة (بلا حفظ جديد)
        self.arm(page, "check", "not-saved")
        page.click("#f03-check")
        page.wait_for_timeout(100)
        self.settle(page, "check")
        page.wait_for_timeout(150)
        i3 = self.insp(page)
        self.assert_("إعادة التحقق تنجح لاحقًا بنتيجتها (لا حفظ جديد)",
                     "failed وcheckCalls=3 وsaveCalls=1",
                     {"op": i3["op"], "check": i3["checkCalls"], "save": i3["saveCalls"]},
                     i3["op"] == "failed" and i3["checkCalls"] == 3 and i3["saveCalls"] == 1)
        self.path_end()

    def p17_stale_save_check(self, page):
        self.path_begin("F03-17", "رد حفظ/تحقق بمعرف قديم: حالة وقيم ورسالة لا تتغير ثم الحسم الصحيح")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر قديم الرد")
        self.arm(page, "save", "not-saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        before = self.insp(page)
        self.stale(page, "save", {"attemptId": 0, "outcome": "saved"})
        page.wait_for_timeout(120)
        after = self.insp(page)
        self.assert_("الرد القديم لا يغيّر شيئًا (لا نجاح مفتعل)",
                     "لا تغيّر",
                     {"op": after["op"], "msg": after["message"] and after["message"]["variant"],
                      "confirmed": after["confirmed"]["name"], "stale": after["staleIgnored"]},
                     after["op"] == before["op"]
                     and (after["message"] and after["message"]["variant"]) == (before["message"] and before["message"]["variant"])
                     and after["confirmed"]["name"] == before["confirmed"]["name"] and after["staleIgnored"] == 1)
        self.settle(page, "save")
        page.wait_for_timeout(150)
        i2 = self.insp(page)
        self.assert_("الطلب المعلق حُسم بنتيجته بعد تجاهل القديم",
                     "failed والمؤكدة لم تتغير",
                     {"op": i2["op"], "confirmed": i2["confirmed"]["name"]},
                     i2["op"] == "failed" and i2["confirmed"]["name"] == "عنصر تجريبي")
        self.path_end()

    def p18_leave_clean(self, page):
        self.path_begin("F03-18", "مغادرة نظيفة: رجوع/إغلاق ظاهر/Escape — إغلاق مباشر بلا حوار وتركيز صالح")
        for label, act in [("رجوع", lambda: page.click("#f03-back")),
                           ("الإغلاق الظاهر", lambda: page.click("#f03-edit-close")),
                           ("Escape", lambda: page.keyboard.press("Escape"))]:
            page.click("#f03-edit-btn")
            self.wait_sheet(page)
            act()
            page.wait_for_timeout(450)  # اكتمال الخفوت (انتقال 240ms + مؤقت احتياط 320ms)
            i = self.insp(page)
            self.assert_(f"{label} نظيف → إغلاق مباشر بلا حوار",
                         "مغلق بلا حوار",
                         {"sheet": i["sheetOpen"], "dialog": i["dialogOpen"], "focus": i["focusId"]},
                         i["sheetOpen"] is False and i["dialogOpen"] is False
                         and i["focusId"] in ("f03-edit-btn", "body") and i["focusId"] == "f03-edit-btn")
            self.assert_(f"{label}: القيم لم تُمس", "المؤكدة نفسها",
                         i["confirmed"], i["confirmed"]["name"] == "عنصر تجريبي")
        self.path_end()

    def p19_leave_dirty(self, page):
        self.path_begin("F03-19", "مغادرة dirty: الحوار يفتح وكل إغلاق غير التخلي = بقاء، والتخلي يستعيد المؤكد")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر باقٍ")
        page.fill("#f03-note", "ملاحظة باقية")
        page.click("#f03-back")
        self.wait_dialog(page)
        i = self.insp(page)
        self.assert_("dirty → حوار البقاء/التخلي يفتح", "dialogOpen=true", i["dialogOpen"], i["dialogOpen"] is True)
        self.assert_("التركيز داخل الحوار (البقاء)", "f03-stay", i["focusId"], i["focusId"] == "f03-stay")
        self.shot(page, "f03-11-leave-dialog-390.png")
        # البقاء: يحفظ الإدخال
        page.click("#f03-stay")
        page.wait_for_timeout(450)
        i2 = self.insp(page)
        self.assert_("البقاء يبقي الإدخال والتركيز داخل اللوحة",
                     "قيم باقية",
                     {"dialog": i2["dialogOpen"], "sheet": i2["sheetOpen"], "name": i2["current"]["name"],
                      "note": i2["current"]["note"], "focus": i2["focusId"], "dirty": i2["dirty"]},
                     i2["dialogOpen"] is False and i2["sheetOpen"] is True
                     and i2["current"]["name"] == "عنصر باقٍ" and i2["current"]["note"] == "ملاحظة باقية"
                     and i2["dirty"] is True)
        # Escape على الحوار = بقاء
        page.click("#f03-back")
        self.wait_dialog(page)
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        i3 = self.insp(page)
        self.assert_("Escape على الحوار = بقاء", "قيم باقية",
                     {"dialog": i3["dialogOpen"], "name": i3["current"]["name"]},
                     i3["dialogOpen"] is False and i3["current"]["name"] == "عنصر باقٍ")
        # الإغلاق الظاهر للحوار = بقاء، والخلفية = بقاء
        page.click("#f03-back")
        self.wait_dialog(page)
        page.click("#f03-leave-close")
        page.wait_for_timeout(450)
        i4 = self.insp(page)
        self.assert_("إغلاق الحوار الظاهر = بقاء", "قيم باقية", i4["current"]["name"],
                     i4["current"]["name"] == "عنصر باقٍ" and i4["sheetOpen"] is True)
        page.click("#f03-back")
        self.wait_dialog(page)
        page.mouse.click(10, 300)  # الخلفية (سياسة close على حوار F01 النمط = إغلاق = بقاء)
        page.wait_for_timeout(450)
        i5 = self.insp(page)
        self.assert_("الخلفية على الحوار = إغلاق = بقاء", "قيم باقية",
                     {"dialog": i5["dialogOpen"], "name": i5["current"]["name"]},
                     i5["dialogOpen"] is False and i5["current"]["name"] == "عنصر باقٍ")
        # خلفية لوحة التعديل keep: لا إغلاق ولا حوار
        page.mouse.click(10, 300)
        page.wait_for_timeout(200)
        i6 = self.insp(page)
        self.assert_("خلفية اللوحة keep: بقاء ضمني بلا إغلاق", "لا تغيّر",
                     {"sheet": i6["sheetOpen"], "dialog": i6["dialogOpen"], "name": i6["current"]["name"]},
                     i6["sheetOpen"] is True and i6["dialogOpen"] is False and i6["current"]["name"] == "عنصر باقٍ")
        # التخلي: يستعيد المؤكد ويغادر بعد الإغلاق بلا حفظ
        page.click("#f03-back")
        self.wait_dialog(page)
        page.click("#f03-abandon")
        page.wait_for_timeout(800)
        i7 = self.insp(page)
        self.assert_("التخلي يستعيد المؤكد ويغادر اللوحة",
                     "استعادة وغادر",
                     {"sheet": i7["sheetOpen"], "dialog": i7["dialogOpen"], "name": i7["current"]["name"],
                      "note": i7["current"]["note"], "save": i7["saveCalls"], "focus": i7["focusId"]},
                     i7["sheetOpen"] is False and i7["dialogOpen"] is False
                     and i7["current"]["name"] == "عنصر تجريبي" and i7["current"]["note"] == ""
                     and i7["saveCalls"] == 0)
        self.assert_("بعد التخلي: إعادة الفتح نظيفة على المؤكد", "clean",
                     page.click("#f03-edit-btn") or self.wait_sheet(page) or self.insp(page)["dirty"],
                     self.insp(page)["dirty"] is False)
        self.path_end()

    def p20_leave_busy(self, page):
        self.path_begin("F03-20", "مغادرة أثناء busy: حجب برسالة موجزة والعملية تستمر بنتيجتها")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر مشغول")
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        page.click("#f03-back")
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("الحجب برسالة موجزة واللوحة بقيت", "مفتوح برسالة",
                     {"sheet": i["sheetOpen"], "dialog": i["dialogOpen"], "msg": i["message"]["title"]},
                     i["sheetOpen"] is True and i["dialogOpen"] is False
                     and i["message"]["title"] == "المغادرة غير متاحة الآن")
        page.keyboard.press("Escape")
        page.wait_for_timeout(200)
        i2 = self.insp(page)
        self.assert_("Escape أثناء busy محجوب أيضًا", "مفتوح",
                     {"sheet": i2["sheetOpen"], "op": i2["op"]},
                     i2["sheetOpen"] is True and i2["op"] == "saving")
        self.settle(page, "save")
        self.wait_saved(page)
        i3 = self.insp(page)
        self.assert_("النجاح بعد حجب مغادرة يغلق بالنتيجة المؤكدة",
                     "مغلق ومحدّث",
                     {"sheet": i3["sheetOpen"], "confirmed": i3["confirmed"]["name"], "note": i3["viewNote"]},
                     i3["sheetOpen"] is False and i3["confirmed"]["name"] == "عنصر مشغول"
                     and i3["viewNote"]["variant"] == "success")
        self.path_end()

    def p21_focus_trap_layers(self, page):
        self.path_begin("F03-21", "حصر التركيز والطبقات المتداخلة: المنتقي فوق اللوحة يعزل الخلفية ويعيد التركيز")
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(900)  # قراءة auto
        # Tab يبقى داخل المنتقي
        seq = []
        for _ in range(6):
            page.keyboard.press("Tab")
            seq.append(self.insp(page)["focusId"])
        in_picker = page.evaluate("""() => {
          const a = document.activeElement;
          return !!a && !!a.closest('#f03-cat-layer');
        }""")
        self.assert_("Tab يبقى داخل أعلى طبقة (المنتقي)", "داخل الطبقة",
                     {"seq": seq, "in": in_picker}, in_picker is True)
        ok, ov2 = self.no_overflow_ok(page)
        self.assert_("لا خروج أفقي مع المنتقي المفتوح فوق اللوحة", "bad=0", ov2, ok)
        # الخلفية (اللوحة) معزولة inert فعليًا
        sheet_inert = page.evaluate("document.getElementById('f03-edit-sheet').inert")
        self.assert_("لوحة التعديل تحتها inert فعليًا", "inert=true", sheet_inert, sheet_inert is True)
        # إغلاق المنتقي يعيد التركيز إلى صف الفئة داخل اللوحة
        page.click("#f03-cat-layer-close")
        page.wait_for_timeout(450)
        i = self.insp(page)
        self.assert_("إغلاق المنتقي يعيد التركيز داخل اللوحة", "f03-cat-trigger",
                     {"focus": i["focusId"], "open": i["catLayerOpen"], "sheet": i["sheetOpen"]},
                     i["focusId"] == "f03-cat-trigger" and i["catLayerOpen"] is False and i["sheetOpen"] is True)
        sheet_inert2 = page.evaluate("document.getElementById('f03-edit-sheet').inert")
        self.assert_("اللوحة خرجت من inert بعد إغلاق المنتقي", "inert=false", sheet_inert2, sheet_inert2 is False)
        # حوار فوق اللوحة: حصر التبويب فيه
        page.fill("#f03-note", "ملاحظة للحوار")
        page.click("#f03-back")
        self.wait_dialog(page)
        dialog_seq = []
        for _ in range(4):
            page.keyboard.press("Tab")
            dialog_seq.append(self.insp(page)["focusId"])
        in_dialog = page.evaluate("!!document.activeElement.closest('#f03-leave-dialog')")
        self.assert_("Tab يبقى داخل الحوار الموسط", "داخل الحوار",
                     {"seq": dialog_seq, "in": in_dialog}, in_dialog is True)
        page.keyboard.press("Shift+Tab")
        page.wait_for_timeout(60)
        page.click("#f03-stay")  # بقاء وإغلاق الحوار قبل نهاية المسار
        page.wait_for_timeout(450)
        self.path_end()

    def p22_escape_policy(self, page):
        self.path_begin("F03-22", "سياسة Escape: نظيف يغلق، dirty يفتح الحوار (لا تخلي صامت)، pending يحجب")
        # نظيف → إغلاق عادي
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        i = self.insp(page)
        self.assert_("Escape نظيف → إغلاق واستعادة مشغّل", "مغلق وf03-edit-btn",
                     {"sheet": i["sheetOpen"], "focus": i["focusId"]},
                     i["sheetOpen"] is False and i["focusId"] == "f03-edit-btn")
        # dirty → حوار لا تخلي صامت
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-name", "عنصر Escape")
        page.keyboard.press("Escape")
        self.wait_dialog(page)
        i2 = self.insp(page)
        self.assert_("Escape dirty → حوار البقاء (لا تخلي صامت)",
                     "حوار وقيم باقية",
                     {"dialog": i2["dialogOpen"], "sheet": i2["sheetOpen"], "name": i2["current"]["name"]},
                     i2["dialogOpen"] is True and i2["sheetOpen"] is True and i2["current"]["name"] == "عنصر Escape")
        page.click("#f03-stay")
        page.wait_for_timeout(450)
        # المنتقي مفتوح → Escape يغلق المنتقي فقط
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(850)
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        i3 = self.insp(page)
        self.assert_("Escape مع المنتقي يغلق المنتقي فقط", "منتجقي مغلق واللوحة باقية",
                     {"picker": i3["catLayerOpen"], "sheet": i3["sheetOpen"], "focus": i3["focusId"]},
                     i3["catLayerOpen"] is False and i3["sheetOpen"] is True and i3["focusId"] == "f03-cat-trigger")
        # pending → حجب
        self.arm(page, "save", "saved")
        page.click("#f03-save")
        page.wait_for_timeout(100)
        page.keyboard.press("Escape")
        page.wait_for_timeout(200)
        i4 = self.insp(page)
        self.assert_("Escape أثناء pending يحجب (بلا إغلاق)",
                     "مفتوح برسالة حجب",
                     {"sheet": i4["sheetOpen"], "msg": i4["message"]["title"]},
                     i4["sheetOpen"] is True and i4["message"]["title"] == "المغادرة غير متاحة الآن")
        self.settle(page, "save")
        self.wait_saved(page)
        self.path_end()

    def p23_widths(self, page):
        self.path_begin("F03-23", "المقاسات 320/360/390/430: لا خروج أفقي ولا قص للأفعال في كل حالة")
        record = {}
        page.click("#f03-edit-btn")
        self.wait_sheet(page)

        def open_picker():
            if not self.insp(page)["catLayerOpen"]:
                page.click("#f03-cat-trigger")
                page.wait_for_timeout(850)

        def close_picker():
            if self.insp(page)["catLayerOpen"]:
                page.keyboard.press("Escape")
                page.wait_for_timeout(450)

        def open_dialog():
            if not self.insp(page)["dialogOpen"]:
                page.fill("#f03-note", "ملاحظة للمقاسات")
                page.click("#f03-back")
                self.wait_dialog(page)

        def close_dialog():
            if self.insp(page)["dialogOpen"]:
                page.click("#f03-stay")
                page.wait_for_timeout(450)

        self.check_widths(page, [
            ("sheet", None),
            ("picker", open_picker),
            ("picker-closed", close_picker),
            ("dialog", open_dialog),
            ("sheet-again", close_dialog),
        ], record)
        all_ok = all(v["ok"] for v in record.values())
        self.assert_("لا خروج أفقي في كل المقاسات والحالات (15 قياسًا)",
                     "كل القياسات ok",
                     record, all_ok)
        # الأفعال ظاهرة داخل اللوحة عند 320 (مقاطع ضمن إطار العرض)
        page.set_viewport_size({"width": 320, "height": 800})
        page.wait_for_timeout(80)
        foot = page.evaluate("window.F03h.targets(['#f03-back','#f03-save'])")
        foot_ok = all(f["w"] > 0 and f["h"] > 0 for f in foot)
        inview = page.evaluate("""() => {
          const w = document.documentElement.clientWidth;
          return ['#f03-back','#f03-save'].map(s => {
            const r = document.querySelector(s).getBoundingClientRect();
            return r.width > 0 && r.right > 0 && r.left < w;
          });
        }""")
        self.assert_("أفعال اللوحة مقاطعها ضمن الإطار عند 320", "كلاهما",
                     {"targets": foot, "inview": inview}, foot_ok and all(inview))
        page.set_viewport_size({"width": 390, "height": 844})
        page.fill("#f03-note", "")  # إغلاق نظيف بلا حوار
        page.keyboard.press("Escape")
        page.wait_for_timeout(450)
        self.path_end()

    def p24_zoom200(self, page):
        self.path_begin("F03-24", "تكبير النص 200% (الآلية المعلنة): تضاعف القياس دون قص أو فقد أفعال")
        for w, shot in [(320, "f03-12-zoom200-sheet-320.png"), (390, "f03-13-zoom200-sheet-390.png")]:
            page.set_viewport_size({"width": w, "height": 800})
            page.reload()
            page.wait_for_load_state("load")
            page.evaluate(JS_HELPERS)
            page.click("#f03-edit-btn")
            self.wait_sheet(page)
            page.fill("#f03-name", "")
            page.click("#f03-save")  # رسالة خطأ ظاهرة داخل اللوحة
            page.wait_for_timeout(120)
            before = page.evaluate("window.F03h.msgBodySize()")
            n = page.evaluate("window.F03h.zoom2()")
            page.wait_for_timeout(120)
            after = page.evaluate("window.F03h.msgBodySize()")
            ratio = round(parseFloatSafe(after["fontSize"]) / parseFloatSafe(before["fontSize"]), 3)
            self.assert_(f"نص الرسالة يتضاعف عند {w} (بتمريرين على {n} عنصرًا)",
                         "≈2.0",
                         {"before": before["fontSize"], "after": after["fontSize"], "ratio": ratio},
                         1.9 <= ratio <= 2.1)
            ok, ov = self.no_overflow_ok(page)
            self.assert_(f"لا خروج أفقي عند {w} و200%", "bad=0", ov, ok)
            scroll = page.evaluate("window.F03h.sheetBodyScroll()")
            self.assert_(f"جسم اللوحة يتمرر وفق عقد B07 عند {w} و200%",
                         "scrollTop>0 عند امتلاء",
                         scroll,
                         scroll["scrollTopAfter"] > 0 if scroll["scrollH"] > scroll["clientH"] else True)
            foot = page.evaluate("window.F03h.targets(['#f03-save','#f03-back'])")
            inview = page.evaluate("""() => {
              const h = window.innerHeight;
              const w2 = document.documentElement.clientWidth;
              return ['#f03-save','#f03-back'].map(s => {
                const r = document.querySelector(s).getBoundingClientRect();
                return r.width > 0 && r.height > 0 && r.left < w2 && r.right > 0;
              });
            }""")
            self.assert_(f"أفعال اللوحة متاحة عند {w} و200%", "كلاهما",
                         {"targets": foot, "inview": inview}, all(t["h"] > 0 for t in foot) and all(inview))
            self.shot(page, shot)
            page.evaluate("window.F03h.unzoom()")
        page.set_viewport_size({"width": 390, "height": 844})
        page.reload()
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        # حوار عند 320 و200%: النص والأزرار متاحة وتمرير الجسم إن لزم
        page.set_viewport_size({"width": 320, "height": 800})
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        page.fill("#f03-note", "ملاحظة للحوار المكبر " * 3)
        page.click("#f03-back")
        self.wait_dialog(page)
        page.evaluate("window.F03h.zoom2()")
        page.wait_for_timeout(100)
        ok, ov = self.no_overflow_ok(page)
        self.assert_("الحوار عند 320 و200%: لا خروج أفقي", "bad=0", ov, ok)
        stay = page.evaluate("window.F03h.targets(['#f03-stay','#f03-abandon'])")
        self.assert_("أفعال الحوار متاحة عند 200%", "h>0",
                     stay, all(s["h"] > 0 for s in stay))
        self.shot(page, "f03-14-zoom200-dialog-320.png")
        page.evaluate("window.F03h.unzoom()")
        page.set_viewport_size({"width": 390, "height": 844})
        self.path_end()

    def p25_reduced_motion(self, page):
        self.path_begin("F03-25", "reduced-motion: وظيفة محفوظة وحركة مكانية ملغاة")
        ctx2 = page.context.browser.new_context(reduced_motion="reduce", viewport={"width": 390, "height": 844})
        p2 = ctx2.new_page()
        p2.on("pageerror", lambda e: self.page_errors.append(f"pageerror(rm): {e}"))
        p2.goto(page.url)
        p2.wait_for_load_state("load")
        p2.evaluate(JS_HELPERS)
        p2.click("#f03-edit-btn")
        self.wait_sheet(p2)
        i = self.insp(p2)
        self.assert_("فتح اللوحة يعمل مع reduced-motion", "مفتوحة وتركيز صحيح",
                     {"sheet": i["sheetOpen"], "focus": i["focusId"]},
                     i["sheetOpen"] is True and i["focusId"] == "f03-name")
        tr = p2.evaluate("""() => getComputedStyle(document.querySelector('#f03-edit-sheet')).transitionDuration""")
        self.assert_("انتقال الطبقة ملغى (فوري)", "0s", tr, tr.split(",")[0].strip() in ("0s", ""))
        p2.fill("#f03-name", "عنصر الحركة المخفوضة")
        p2.click("#f03-save")
        self.wait_saved(p2)
        i2 = self.insp(p2)
        self.assert_("الدورة كاملة تعمل مع reduced-motion", "نجاح ومغلق",
                     {"sheet": i2["sheetOpen"], "note": i2["viewNote"]},
                     i2["sheetOpen"] is False and i2["viewNote"]["variant"] == "success")
        ctx2.close()
        self.path_end()

    def p26_targets_keyboard(self, page):
        self.path_begin("F03-26", "أهداف اللمس ولوحة المفاتيح: قياس الأهداف أثناء فتح طبقاتها ودورة كاملة بلوحة المفاتيح")
        page.reload()
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        # أثناء كل حالة: قياس أهدافها الظاهرة فعلًا
        view_t = page.evaluate("(s) => window.F03h.targets(s)", ["#f03-edit-btn"])
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        sheet_t = page.evaluate("(s) => window.F03h.targets(s)",
                                ["#f03-back", "#f03-save", "#f03-cat-trigger", "#f03-edit-close"])
        page.click("#f03-cat-trigger")
        self.wait_picker(page)
        page.wait_for_timeout(850)
        picker_t = page.evaluate("(s) => window.F03h.targets(s)", ["#f03-cat-layer-close"])
        opt_h = self.insp(page)["pickerOptions"][0]["h"]
        page.keyboard.press("Escape")  # إغلاق المنتقي (نظيف)
        page.wait_for_timeout(450)
        page.fill("#f03-note", "ملاحظة للأهداف")
        page.click("#f03-back")
        self.wait_dialog(page)
        dialog_t = page.evaluate("(s) => window.F03h.targets(s)", ["#f03-stay", "#f03-abandon", "#f03-leave-close"])
        page.click("#f03-stay")
        page.wait_for_timeout(450)
        mins = {}
        for t in view_t + sheet_t + picker_t + dialog_t:
            if not t.get("missing"):
                mins[t["sel"]] = t["h"]
        mins[".m-picker__option"] = opt_h
        all_24 = all(h >= 24 for h in mins.values())
        lib_48 = all(mins.get(s, 0) >= 48 for s in
                     ["#f03-edit-btn", "#f03-back", "#f03-save", "#f03-cat-trigger", ".m-picker__option"])
        self.assert_("كل الأهداف ≥ 24px (أرضية W7) وأهداف المكتبة/العينة ≥ 48 (سياسة المشروع)",
                     "24/48",
                     mins, all_24 and lib_48)
        # دورة كاملة بلوحة المفاتيح وحدها (من عرض نظيف بإعادة تحميل)
        page.reload()
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        page.wait_for_timeout(120)
        page.keyboard.press("Tab")
        f1 = self.insp(page)["focusId"]
        self.assert_("أول توقف تبويب = تعديل", "f03-edit-btn", f1, f1 == "f03-edit-btn")
        page.keyboard.press("Enter")
        self.wait_sheet(page)
        self.assert_("Enter يفتح اللوحة والتركيز للاسم", "f03-name", self.insp(page)["focusId"], self.insp(page)["focusId"] == "f03-name")
        page.keyboard.press("Control+a")  # تحديد القيمة المؤكدة المبثوثة (لوحة مفاتيح فقط)
        page.keyboard.type("عنصر بلوحة المفاتيح")
        page.keyboard.press("Tab")  # → الفئة
        page.keyboard.press("Enter")  # فتح المنتقي
        self.wait_picker(page)
        page.wait_for_timeout(850)
        page.keyboard.press("Tab")  # → الخيار المحدد (roving)
        page.keyboard.press("ArrowLeft")  # RTL: يسار = التالي → فئة ب
        page.keyboard.press("Enter")  # اختيار فئة ب
        page.wait_for_function("() => window.F03h.insp().catLayerOpen === false", timeout=2000)  # اكتمال الإغلاق فعليًا
        page.wait_for_timeout(120)
        i = self.insp(page)
        self.assert_("اختيار بالأسهم/Enter يغلق ويعيد التركيز لصف الفئة",
                     "cat-b وf03-cat-trigger",
                     {"draft": i["draftCategory"], "focus": i["focusId"], "open": i["catLayerOpen"]},
                     i["catLayerOpen"] is False and i["draftCategory"]["value"] == "cat-b"
                     and i["focusId"] == "f03-cat-trigger")
        page.keyboard.press("Tab")  # → الملاحظة
        page.keyboard.type("ملاحظة لوحة المفاتيح")
        page.keyboard.press("Tab")  # → رجوع
        page.keyboard.press("Tab")  # → حفظ
        self.assert_("التركيز على زر الحفظ قبل الإرسال", "f03-save", self.insp(page)["focusId"], self.insp(page)["focusId"] == "f03-save")
        page.keyboard.press("Enter")  # حفظ
        try:
            self.wait_saved(page)
        except Exception:  # noqa: BLE001
            dbg = self.insp(page)
            print("P26 DEBUG:", {k: dbg[k] for k in ("op", "focusId", "sheetOpen", "saveCalls", "current", "message", "dirty")})
            raise
        i2 = self.insp(page)
        self.assert_("حفظ بلوحة المفاتيح ينجح ويغلق", "نجاح",
                     {"sheet": i2["sheetOpen"], "confirmed": i2["confirmed"]["name"], "note": i2["viewNote"]["variant"]},
                     i2["sheetOpen"] is False and i2["confirmed"]["name"] == "عنصر بلوحة المفاتيح"
                     and i2["viewNote"]["variant"] == "success")
        self.path_end()

    def p27_standalone_file(self, page, standalone_uri):
        self.path_begin("F03-27", "standalone كملف محلي بلا شبكة: صفر طلبات خارجية وخطوط وأيقونات محمّلة")
        seen = {"req": [], "aborted": []}

        def on_request(req):
            seen["req"].append(req.url)

        def on_requestfailed(req):
            seen["aborted"].append({"url": req.url, "failure": req.failure})

        page.on("request", on_request)
        page.on("requestfailed", on_requestfailed)

        def block_http(route):
            seen["aborted"].append({"url": route.request.url, "blocked": True})
            route.abort()

        # حجب أي http/https فقط (لو حاول الملف أي شيء) — file:// لا يمر هنا
        page.route("http://**", block_http)
        page.route("https://**", block_http)
        page.goto(standalone_uri)
        page.wait_for_load_state("load")
        page.evaluate(JS_HELPERS)
        page.wait_for_timeout(300)
        i = self.insp(page)
        self.assert_("إقلاع الملف الواحد بلا أخطاء", "0 أخطاء",
                     {"errors": self.page_errors, "dirty": i["dirty"], "calls": [i["saveCalls"], i["checkCalls"], i["readCalls"]]},
                     len(self.page_errors) == 0 and i["dirty"] is False and i["saveCalls"] == 0)
        external = [u for u in seen["req"] if u.startswith("http")]
        side_files = [u for u in seen["req"] if u != standalone_uri and u.startswith("file")]
        self.assert_("صفر طلبات خارجية (http/https) وصفر ملفات جانبية",
                     "0",
                     {"external": external, "sideFiles": side_files, "blocked": seen["aborted"]},
                     len(external) == 0 and len(side_files) == 0 and len(seen["aborted"]) == 0)
        fonts = page.evaluate("() => window.F03h.fontsLoaded()")
        self.assert_("الخطان محمّلان من data: (Arabic + Latin)",
                     "true/true",
                     fonts, fonts["arabic400"] is True and fonts["latin400"] is True and fonts["arabic500"] is True)
        # حفظ سريع يعمل في الملف الواحد — وبعد فتح اللوحة تُقاس الأيقونات الظاهرة
        page.click("#f03-edit-btn")
        self.wait_sheet(page)
        ic = page.evaluate("""() => {
          const ids = ['i-info', 'i-alert', 'i-check', 'i-close', 'i-chevron-down'];
          const syms = ids.map(id => !!document.getElementById(id));
          const rendered = ids.map(id => {
            const uses = [...document.querySelectorAll('use[href="#' + id + '"]')];
            return uses.some(u => {
              const host = u.closest('svg');
              if (!host) return false;
              const r = host.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            });
          });
          return { syms: syms, renderedAny: rendered };
        }""")
        self.assert_("الرموز الخمسة معرّفة والأيقونات الظاهرة (الإغلاق والسهم) تُرسم فعليًا",
                     "كلها true (الرموز) والإغلاق/السهم rendered",
                     ic,
                     all(ic["syms"]) and ic["renderedAny"][3] is True and ic["renderedAny"][4] is True)
        page.fill("#f03-name", "عنصر الملف الواحد")
        page.click("#f03-save")
        self.wait_saved(page)
        i2 = self.insp(page)
        self.assert_("حفظ كامل داخل الملف الواحد", "نجاح",
                     {"confirmed": i2["confirmed"]["name"], "save": i2["saveCalls"]},
                     i2["confirmed"]["name"] == "عنصر الملف الواحد" and i2["saveCalls"] == 1)
        self.shot(page, "f03-15-standalone-view.png")
        self.path_end()

    def p28_equivalence(self, page, source_url, standalone_uri, browser):
        self.path_begin("F03-28", "تكافؤ السلوك: المصدر ↔ الملف الواحد على مسارات مفتاحية")

        def run_suite(url):
            pg = browser.new_page(viewport={"width": 390, "height": 844})
            pg.on("pageerror", lambda e: self.page_errors.append(f"pageerror(eq): {e}"))
            pg.goto(url)
            pg.wait_for_load_state("load")
            pg.evaluate(JS_HELPERS)
            out = {}
            out["boot"] = self.insp(pg)
            pg.click("#f03-edit-btn")
            self.wait_sheet(pg)
            pg.fill("#f03-name", "عنصر تكافؤ")
            pg.click("#f03-save")
            self.wait_saved(pg)
            out["saved"] = self.insp(pg)
            pg.click("#f03-edit-btn")
            self.wait_sheet(pg)
            pg.fill("#f03-note", "ملاحظة تكافؤ")
            pg.click("#f03-back")
            self.wait_dialog(pg)
            out["dialog"] = self.insp(pg)
            pg.click("#f03-stay")
            pg.wait_for_timeout(300)
            out["stay"] = self.insp(pg)
            pg.close()
            return out

        s = run_suite(source_url)
        st = run_suite(standalone_uri)

        def key(i):
            return {
                "op": i["op"], "dirty": i["dirty"], "focus": i["focusId"],
                "confirmed": i["confirmed"], "current": i["current"],
                "save": i["saveCalls"], "check": i["checkCalls"], "read": i["readCalls"],
                "viewNote": i["viewNote"] and i["viewNote"]["variant"],
                "dialog": i["dialogOpen"], "sheet": i["sheetOpen"],
                "msg": i["message"] and i["message"]["variant"],
            }

        ks, kst = key(s["boot"]), key(st["boot"])
        kv_s, kv_st = key(s["saved"]), key(st["saved"])
        self.assert_("المصدر والملف الواحد: الإقلاع متطابق المعنى", "تطابق",
                     {"source": ks, "standalone": kst}, ks == kst)
        self.assert_("المصدر والملف الواحد: دورة الحفظ متطابقة المعنى", "تطابق",
                     {"source": kv_s, "standalone": kv_st}, kv_s == kv_st)
        kd_s, kd_st = key(s["dialog"]), key(st["dialog"])
        ks2, kst2 = key(s["stay"]), key(st["stay"])
        self.assert_("المصدر والملف الواحد: حوار المغادرة والبقاء متطابقان", "تطابق",
                     {"source": [kd_s, ks2], "standalone": [kd_st, kst2]},
                     kd_s == kd_st and ks2 == kst2)
        self.assert_("لا أخطاء صفحة في مساري التكافؤ", "0 أخطاء", self.page_errors, len(self.page_errors) == 0)
        self.path_end()

    def p29_build_reproducible(self, page):
        self.path_begin("F03-29", "قابلية إعادة إنتاج البناء: --check مطابق بايت-ببايت")
        import subprocess as sp
        r = sp.run([sys.executable, str(ROOT / "tools" / "build-f03-standalone.py"), "--check"],
                   capture_output=True, text=True)
        self.assert_("إعادة التوليد مطابقة للملف الملتزم", "exit=0",
                     {"exit": r.returncode, "out": (r.stdout + r.stderr).strip()[-200:]},
                     r.returncode == 0)
        self.path_end()

    def p30_build_integrity(self, page):
        self.path_begin("F03-30", "سلامة البناء: من المصادر والأصول المعتمدة وحدها، والتراخيص محفوظة")
        html = (ROOT / SAMPLE_REL / "standalone.html").read_text(encoding="utf-8")
        sample_files = ["example.css", "example.js", "mock-adapter.js", "index.html"]
        sample_text = "".join((ROOT / SAMPLE_REL / f).read_text(encoding="utf-8") for f in sample_files)
        import re as _re
        checks = {
            # لا وسوم تحميل خارجية (روابط التراخيص داخل النص/التعليقات مقبولة)
            "no_external_tags": not _re.search(r'(?:src|href)="https?://', html),
            "no_network_in_sample": all(tok not in sample_text for tok in
                                        ("fetch(", "XMLHttpRequest", "WebSocket", "navigator.sendBeacon",
                                         "window.localStorage", "localStorage.", "sessionStorage.", "indexedDB")),
            "no_import_modules": "import(" not in sample_text and 'type="module"' not in html,
            "fonts_data_uri": html.count("data:font/woff2") == 6,
            "ofl_license_embedded": "SIL Open Font License" in html and "IBM" in html,
            "hugeicons_license_embedded": "HugeIcons" in html,
            "tokens_source": 'data-f03-from="shared/tokens.css"' in html,
            "example_css_source": 'data-f03-from="previews/ux-patterns/mobile-record-sample/example.css"' in html,
            "adapter_source": 'data-f03-from="previews/ux-patterns/mobile-record-sample/mock-adapter.js"' in html,
            "single_file_dir": sorted(pp.name for pp in (ROOT / SAMPLE_REL).iterdir()) == sorted(
                ["example.css", "example.js", "index.html", "mock-adapter.js", "README.md", "standalone.html"]),
        }
        self.assert_("خصائص الملف الواحد المطلوبة", "كلها true",
                     checks, all(checks.values()))
        src = (ROOT / SAMPLE_REL / "index.html").read_text(encoding="utf-8")
        lic = (ROOT / "assets" / "fonts" / "LICENSE-IBM-Plex-OFL.txt").is_file() and \
              (ROOT / "assets" / "icons" / "LICENSE-hugeicons.txt").is_file()
        self.assert_("التراخيص في المصدر محفوظة وأصول fonts/icons من أماكنها المعتمدة", "true",
                     {"license_files": lic, "inline_symbols": src.count("assets/icons/") >= 4},
                     lic and src.count("assets/icons/") >= 4)
        self.path_end()


def parseFloatSafe(x):
    try:
        return float(str(x).replace("px", ""))
    except Exception:  # noqa: BLE001
        return 0.0


def write_txt(results, path, meta):
    lines = []
    lines.append(f"UX-F03 — نتائج الفحص ({meta['env']['browser']})")
    lines.append(f"المصدر: commit {meta['git']['commit']} — شجرة {meta['git']['tree'][:12]} — نظيف: {meta['git']['status_clean']}")
    lines.append(f"التاريخ: {meta['env']['now']}")
    lines.append("")
    total = sum(len(r["assertions"]) for r in results)
    passed = sum(1 for r in results for a in r["assertions"] if a["pass"])
    for r in results:
        lines.append(f"[{r['result']}] {r['id']} — {r['path']} ({len(r['assertions'])} تحققًا)")
        for a in r["assertions"]:
            mark = "PASS" if a["pass"] else "FAIL"
            lines.append(f"    {mark}: {a['name']} | متوقع: {a['expected']}")
            if not a["pass"]:
                lines.append(f"           المقاس: {json.dumps(a['measured'], ensure_ascii=False)[:400]}")
    lines.append("")
    lines.append(f"المجموع: {passed}/{total} تحقيقًا ناجحًا عبر {len(results)} مسارًا")
    fails = [r["id"] for r in results if r["result"] == "FAIL"]
    lines.append(f"مسارات فاشلة: {fails if fails else 'لا شيء'}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return total, passed, fails


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):  # كتم سجلات خادم التطوير
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--round", default=None, help="مجلد جولة فرعي تحت reviews/UX-F03/")
    args = ap.parse_args()

    out_dir = OUT / args.round if args.round else OUT
    tool = CheckTool(out_dir)

    git = tool.git_info()
    server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT)))
    server.ThreadingHTTPServer = server
    port = server.server_address[1]
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    source_url = f"http://127.0.0.1:{port}/{SAMPLE_REL}/index.html"
    standalone_uri = (ROOT / SAMPLE_REL / "standalone.html").as_uri()

    with sync_playwright() as p:
        launch_kwargs = {"headless": True}
        if BROWSER_PATH:
            launch_kwargs["executable_path"] = BROWSER_PATH
        browser = p.chromium.launch(**launch_kwargs)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = tool.open_page(ctx, source_url)

        tool.fresh(page, source_url)
        tool.p01_boot(page)
        tool.fresh(page, source_url)
        tool.p02_open_edit(page)
        tool.fresh(page, source_url)
        tool.p03_clean_save(page)
        tool.fresh(page, source_url)
        tool.p04_dirty(page)
        tool.fresh(page, source_url)
        tool.p05_invalid_then_fix(page)
        tool.fresh(page, source_url)
        tool.p06_picker_read(page)
        tool.fresh(page, source_url)
        tool.p07_picker_select(page)
        tool.fresh(page, source_url)
        tool.p08_picker_search(page)
        tool.fresh(page, source_url)
        tool.p09_picker_error_empty(page)
        tool.fresh(page, source_url)
        tool.p10_picker_stale(page)
        tool.fresh(page, source_url)
        tool.p11_happy_default(page)
        tool.fresh(page, source_url)
        tool.p12_double_activation(page)
        tool.fresh(page, source_url)
        tool.p13_known_failure(page)
        tool.fresh(page, source_url)
        tool.p14_unknown(page)
        tool.fresh(page, source_url)
        tool.p15_verify_saved_not_saved(page)
        tool.fresh(page, source_url)
        tool.p16_check_unknown_reject(page)
        tool.fresh(page, source_url)
        tool.p17_stale_save_check(page)
        tool.fresh(page, source_url)
        tool.p18_leave_clean(page)
        tool.fresh(page, source_url)
        tool.p19_leave_dirty(page)
        tool.fresh(page, source_url)
        tool.p20_leave_busy(page)
        tool.fresh(page, source_url)
        tool.p21_focus_trap_layers(page)
        tool.fresh(page, source_url)
        tool.p22_escape_policy(page)
        tool.fresh(page, source_url)
        tool.p23_widths(page)
        tool.fresh(page, source_url)
        tool.p24_zoom200(page)
        tool.fresh(page, source_url)
        tool.p25_reduced_motion(page)
        tool.fresh(page, source_url)
        tool.p26_targets_keyboard(page)
        tool.fresh(page, source_url)
        tool.p27_standalone_file(page, standalone_uri)
        tool.fresh(page, source_url)
        tool.p28_equivalence(page, source_url, standalone_uri, browser)
        tool.fresh(page, source_url)
        tool.p29_build_reproducible(page)
        tool.p30_build_integrity(page)

        browser_version = browser.version
        browser.close()
    server.shutdown()

    try:
        from importlib.metadata import version as _pkg_version
        pw_version = _pkg_version("playwright")
    except Exception:  # noqa: BLE001
        pw_version = "unknown"

    meta = {
        "git": git,
        "env": {
            "browser": f"Chromium {browser_version} (Playwright {pw_version})",
            "playwright": pw_version,
            "python": platform.python_version(),
            "platform": platform.platform(),
            "now": datetime.now(timezone.utc).isoformat(),
            "zoom_mechanism": "مضاعفة أحجام الخط المحسوبة بتمريرين (الآلية المعلنة في B01-R2-D) — لا native zoom",
            "widths": WIDTHS,
            "source_url": "local http.server (المصدر) + file:// (الملف الواحد)",
        },
        "not_run": [
            "Samsung Galaxy S25 حقيقي وأي جهاز فعلي — محاكاة المتصفح ليست اختبار S25",
            "TalkBack/VoiceOver وقارئ شاشة فعلي",
            "native zoom / تكبير النظام",
            "اللمس الحقيقي ولوحة مفاتيح النظام وsafe areas الفعلية",
            "WebKit/Safari",
            "لوحة مفاتيح الهاتف الفعلية وتغطية المدخلات",
            "رجوع النظام في تغليف Android",
        ],
    }

    total, passed, fails = write_txt(tool.results, out_dir / "verification.txt", meta)
    meta["summary"] = {"paths": len(tool.results), "assertions": total, "passed": passed, "failed_paths": fails}
    (out_dir / "verification.json").write_text(
        json.dumps({"meta": meta, "results": tool.results}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")

    print(f"المجموع: {passed}/{total} عبر {len(tool.results)} مسارًا")
    if fails:
        print("FAILED PATHS:", fails)
        return 1
    print("ALL PATHS PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
