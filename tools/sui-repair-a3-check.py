#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص الوكيل 3 لجولة SAMSUNG-ONEUI-REPAIR-R1 (SUI-A3)

فحوص بنود الوكيل 3 القابلة لإعادة التشغيل (قبل/بعد) على المصدر الحالي:
SUI-001  توست F03: rect>0 مع نص مرئي في مسارات الإضافة/الحذف/الحفظ عند
         320/360/390/430 و200%، لا تراكب مع navbar (فجوة مقيسة)، لا سرقة
         تركيز، زوال ~4s وإغلاق يدوي، إعلان واحد في القناة الحية الواحدة.
SUI-002  ارتفاع navbar بمتغير CSS ديناميكي (--f03-navbar-h) عبر
         ResizeObserver: صفر تراكب للشريط/التذييل عند 320+200%، نفس 53px
         عند 1×، مراقب واحد لا يتكرر، سياسة الحالة المخفية موثقة (آخر قيمة).
         + محدد الإخفاء سليم (اكتشاف القائد «#f03-select-baridden]» —
         تحقق بايتي ومقيس).
SUI-010  ملاحظة الحفظ: الخطأ = role=alert، النجاح/المعلومة/التحذير = status.
SUI-012  MicroMessages.announce(text,{id}): الحدث ذاته يُعلن مرة؛ الحدث
         المستقل (id مختلف أو بلا id) بنفس النص يُعلن — بعدّ mutations.
SUI-013  نصوص البوابة بشرية بلا مصطلحات داخلية (المعالج/المستهلك/موصولة).
SUI-014  قناة خطأ واحدة في البوابة: لا استدعاء reportValidity الأصلية مع
         بقاء aria-invalid والرسالة المرتبطة والتركيز.
SUI-015  أول تركيز في لوحات الفلاتر الثلاث = أول تحكم فعلي (لا زر الإغلاق).
SUI-016  هامش F03: 16px دون 390 و20px من 390 (عقد UI-VISUAL-SYSTEM).
SUI-017  .f03-block__title: 16/24 وزن 600؛ .f03-block__sub يبقى 14/500.
SUI-019  استبدال m-section__title الميت بـm-section-title (18/28/600).
SUI-020  انتقال .f03-row محمي تحت prefers-reduced-motion: reduce.
SUI-022  KEEP موثق: أسهم التبويبات تلتف عند الحواف (سلوك مقصود) + سطر
         التوثيق في مواصفة B07.
SUI-023  نص تأكيد الحذف سؤال (S26) مع بقاء «لا يمكن التراجع» والإلغاء
         الافتراضي الآمن محفوظ التركيز.
SUI-029  مدخل «وضع المراجعة» مخفي في مسار الدخول (البوابة) وأداة المراجعة
         تعمل من التذييل بعد الدخول.

الاستخدام: python3 tools/sui-repair-a3-check.py --phase before|after
الإخراج: reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent3/<phase>/
         (results.json + summary.txt + screenshots/)
خروج غير صفري عند أي فشل. NOT RUN معلنة في الملخص.

آلية 200%: محاكاة نص ×2 بمرورين نظيفين (نمط ZOOM2_CLEAN من أدوات
المشروع — قراءة كل المقاسات المحسوبة ثم تطبيق ×2) — ليست native zoom.
"""
import argparse
import json
import subprocess
import sys
import threading
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT_REPO = Path(__file__).resolve().parents[1]
SAMPLE_REL = "previews/ux-patterns/mobile-record-sample"
F02_REL = "previews/ux-patterns/filter-lifecycle"
NAV_REL = "previews/navigation"
MSG_REL = "previews/messages"
GW_EXAMPLE_REL = "components/access-gateway/example-usage.html"
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
WIDTHS = [320, 360, 390, 430]
VIEW = {"width": 390, "height": 844}
EVIDENCE_ROOT = SCRIPT_REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent3"


def serve_dir(root: Path, preferred_port: int):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    last_err = None
    for port in range(preferred_port, preferred_port + 20):
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", port), partial(H, directory=str(root)))
            threading.Thread(target=srv.serve_forever, daemon=True).start()
            return f"http://127.0.0.1:{port}"
        except OSError as e:  # المنفذ مشغول — جرّب التالي في نطاق A3
            last_err = e
    raise RuntimeError(f"تعذر فتح خادم في نطاق A3: {last_err}")


def git_meta(root: Path):
    def git(*args):
        return subprocess.run(["git", *args], capture_output=True, text=True, cwd=str(root)).stdout.strip()
    status = git("status", "--porcelain")
    return {
        "commit": git("rev-parse", "HEAD"),
        "tree": git("rev-parse", "HEAD^{tree}"),
        "status_clean": status == "",
        "dirty_owned": [ln for ln in status.splitlines() if any(k in ln for k in (
            "mobile-record-sample", "components/messages", "components/access-gateway",
            "components/navigation", "filter-lifecycle", "previews/navigation",
            "previews/messages"))][:12],
        "branch": git("rev-parse", "--abbrev-ref", "HEAD"),
    }


class Tool:
    def __init__(self, out_dir: Path):
        self.out = out_dir
        self.shots = out_dir / "screenshots"
        self.shots.mkdir(parents=True, exist_ok=True)
        self.results = []
        self.errors_all = []
        self.error_cursor = 0
        self.current = None

    def check(self, name, ok, detail=""):
        entry = {"name": name, "ok": bool(ok), "detail": str(detail)[:400]}
        if self.current is not None:
            self.current["checks"].append(entry)
        else:
            self.results.append({"id": "tool", "checks": [entry]})
        if not ok:
            print(f"  [FAIL] {name} — {entry['detail']}")
        return bool(ok)

    def group_begin(self, gid, desc):
        self.current = {"id": gid, "group": desc, "checks": [], "meta": {}}
        self.results.append(self.current)
        self.error_cursor = len(self.errors_all)
        print(f"[{gid}] {desc}")

    def group_end(self):
        self.current["page_errors"] = self.errors_all[self.error_cursor:]
        self.current["result"] = "PASS" if all(c["ok"] for c in self.current["checks"]) else "FAIL"
        print(f"[{self.current['id']}] => {self.current['result']}")
        self.current = None

    def track(self, page):
        page.on("pageerror", lambda e: self.errors_all.append(str(e)))

    def shot(self, page, name):
        try:
            page.screenshot(path=str(self.shots / name))
        except Exception as e:  # noqa
            print(f"  [SHOT-ERR] {name}: {e}")

    def summary(self):
        total = sum(len(g["checks"]) for g in self.results)
        passed = sum(1 for g in self.results for c in g["checks"] if c["ok"])
        return {
            "total": total,
            "passed": passed,
            "failed": total - passed,
            "groups": {g["id"]: g.get("result", "?") for g in self.results},
            "not_run": [
                "قارئ شاشة فعلي (TalkBack/VoiceOver/NVDA) — الأدوار والإعلانات مقيسة DOM/mutations فقط",
                "هاتف فعلي / لمس / Samsung Internet — بيئة Chromium headless",
                "native zoom لنظام التشغيل — 200% هنا محاكاة نص ×2 بمرورين نظيفين معلنة",
                "WebKit/Safari وsafe-area فعلي (headless = 0)",
                "عرض الفقاعة الأصلية لـreportValidity بصريًا على متصفح مرئي — يقاس عدم الاستدعاء برمجيًا هنا",
            ],
        }


F03_HELPERS = r"""
() => {
  window.F03h = {
    insp: () => window.F03App.inspect(),
    arm: (kind, outcome) => window.F03App.arm(kind, outcome),
    enter: () => {
      const b = document.getElementById('f03-gw-demo');
      if (b && !b.hidden) b.click();
      return window.F03App.inspect().view;
    },
    zoom2: () => {
      /* محاكاة نص ×2 بمرورين نظيفين: قراءة كل المقاسات ثم تطبيقها (نمط ZOOM2_CLEAN) */
      const els = [document.body].concat([...document.body.querySelectorAll('*')]);
      const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
      orig.forEach((it) => { if (it.el.dataset.a3z === undefined) { it.el.dataset.a3z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
      return orig.length;
    },
    unzoom: () => {
      document.querySelectorAll('[data-a3-z],[data-a3z]').forEach((el) => {
        el.style.fontSize = ''; delete el.dataset.a3z;
      });
      return true;
    },
    navbarVar: () => document.documentElement.style.getPropertyValue('--f03-navbar-h') || null,
    rects: (sels) => {
      const out = {};
      sels.forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) { out[sel] = null; return; }
        const r = el.getBoundingClientRect();
        out[sel] = { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
      });
      return out;
    }
  };
  return true;
}
"""

# قياس التوست: مستطيلات + نص مرئي + فجوة navbar + تركيز + قناة الإعلان
TOAST_MEASURE = r"""
() => {
  const toast = document.getElementById('f03-toast');
  const text = document.getElementById('f03-toast-text');
  const navbar = document.getElementById('f03-navbar');
  const region = document.querySelector('.m-live-region');
  const r = toast.getBoundingClientRect();
  const tr = text.getBoundingClientRect();
  const cs = getComputedStyle(toast);
  /* نص مرئي: مدى الحروف داخل مستطيل النص */
  const rg = document.createRange();
  rg.selectNodeContents(text);
  let glyphOk = false, glyphW = 0;
  const rects = rg.getClientRects();
  for (const cr of rects) { if (cr.width > 4 && cr.height > 4) { glyphOk = true; glyphW += cr.width; } }
  const nb = navbar.getBoundingClientRect();
  const vh = window.innerHeight;
  const active = document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'none';
  return {
    hiddenAttr: toast.hidden, display: cs.display, position: cs.position,
    w: +r.width.toFixed(2), h: +r.height.toFixed(2),
    bottom: +r.bottom.toFixed(2), top: +r.top.toFixed(2),
    textW: +tr.width.toFixed(2), textH: +tr.height.toFixed(2), glyphOk, glyphW: +glyphW.toFixed(1),
    text: text.textContent,
    toastParentId: toast.parentElement.id || toast.parentElement.tagName,
    navbarHidden: navbar.hidden,
    navbarTop: +nb.top.toFixed(2), navbarH: +nb.height.toFixed(2), viewportH: vh,
    gapToNavbar: navbar.hidden ? null : +(nb.top - r.bottom).toFixed(2),
    gapFromBottom: +(vh - r.bottom).toFixed(2),
    activeElement: active,
    liveRegionText: region ? region.textContent : null,
    liveRegionCount: document.querySelectorAll('.m-live-region').length,
    toastHasLiveAttrs: !!(toast.getAttribute('role') || toast.getAttribute('aria-live'))
  };
}
"""

# قياس شريط التحديد والتذييل مقابل navbar (وضع التحديد)
SELECTBAR_MEASURE = r"""
() => {
  const bar = document.getElementById('f03-select-bar');
  const navbar = document.getElementById('f03-navbar');
  const foot = document.querySelector('.f03-foot');
  const reviewLink = document.getElementById('f03-review-open');
  const storageLine = document.getElementById('f03-storage-line');
  const R = (el) => { const r = el.getBoundingClientRect();
    return { top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; };
  const br = R(bar), nr = R(navbar);
  const linkR = reviewLink.getBoundingClientRect();
  const lineR = storageLine.getBoundingClientRect();
  const footCS = getComputedStyle(foot);
  return {
    bar: br, navbar: nr,
    barOverlapNavbar: +((br.bottom - nr.top)).toFixed(2), /* سالب = فجوة */
    barInsetFromBottom: +(window.innerHeight - br.bottom).toFixed(2),
    footPaddingBottom: parseFloat(footCS.paddingBottom),
    linkBottom: +linkR.bottom.toFixed(2),
    linkGapToNavbar: +((nr.top - linkR.bottom)).toFixed(2),
    lineGapToNavbar: +((nr.top - lineR.bottom)).toFixed(2),
    scrollY: Math.round(window.scrollY || 0),
    navbarVar: document.documentElement.style.getPropertyValue('--f03-navbar-h') || null
  };
}
"""

# عدّ mutations على المنطقة الحية (SUI-012) على لوحة messages
ANNOUNCE_CONTRACT = r"""
() => {
  /* تهيئة القناة أولًا (المنطقة تُنشأ بأول إعلان) */
  window.MicroMessages.announce('تهيئة القناة', { id: 'init' });
  return new Promise((resolve) => setTimeout(() => {
    const region = document.querySelector('.m-live-region');
    if (!region) { resolve({ error: 'no live region' }); return; }
    region.textContent = '';
    let mutations = 0;
    const mo = new MutationObserver((records) => { mutations += records.length; });
    mo.observe(region, { childList: true, characterData: true, subtree: true });
    const A = window.MicroMessages.announce;
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    (async () => {
      A('حدث أول', { id: 'ev-1' });
      await wait(180);
      const afterFirst = { mutations, text: region.textContent };
      A('حدث أول', { id: 'ev-1' });
      await wait(180);
      const afterSameEvent = { mutations, text: region.textContent };
      A('حدث أول', { id: 'ev-2' });
      await wait(180);
      const afterIndependentId = { mutations, text: region.textContent };
      A('حدث أول');
      await wait(180);
      const afterNoId = { mutations, text: region.textContent };
      A('حدث ثانٍ', true); /* التوافق الخلفي: وسيط منطقي = assertive */
      await wait(180);
      const liveAttr = region.getAttribute('aria-live');
      mo.disconnect();
      resolve({ afterFirst, afterSameEvent, afterIndependentId, afterNoId, liveAttr,
               counts: { first: afterFirst.mutations, same: afterSameEvent.mutations,
                         independentId: afterIndependentId.mutations, noId: afterNoId.mutations } });
    })();
  }, 200));
}
"""

# قناة خطأ البوابة: عدّ استدعاءات reportValidity الأصلية + الرسالة والتركيز
GATEWAY_ERROR_CHANNEL = r"""
() => {
  window.__rvCalls = 0;
  const proto = window.HTMLInputElement.prototype;
  if (!proto.__origReportValidity) proto.__origReportValidity = proto.reportValidity;
  proto.reportValidity = function () { window.__rvCalls += 1; return true; };
  return true;
}
"""

GATEWAY_ERROR_MEASURE = r"""
() => {
  const email = document.getElementById('f03-gw-email');
  const password = document.getElementById('f03-gw-password');
  const field = email.closest('[data-micro-field]');
  const note = field.querySelector('[data-field-msg]');
  const status = document.querySelector('[data-access-gateway] [data-access-status]');
  return {
    rvCalls: window.__rvCalls,
    emailAriaInvalid: email.getAttribute('aria-invalid'),
    fieldHasError: field.classList.contains('has-error'),
    noteText: note ? note.textContent : null,
    noteVisible: note ? getComputedStyle(note).display !== 'none' : false,
    noteLinked: email.getAttribute('aria-describedby') || (note && note.id ? note.id : null),
    statusText: status ? status.textContent : null,
    focusId: document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'none'
  };
}
"""

ROW_TRANSITION = r"""
() => {
  const row = document.querySelector('#f03-list-rows .f03-row');
  if (!row) return null;
  const cs = getComputedStyle(row);
  return { property: cs.transitionProperty, duration: cs.transitionDuration,
           reduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
}
"""


def fresh_f03(t, page, url, enter=True):
    page.goto(url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate(F03_HELPERS)
    page.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
    page.reload()
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate(F03_HELPERS)
    page.wait_for_timeout(150)
    if enter:
        page.evaluate("() => window.F03h.enter()")
        page.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=5000)
        page.wait_for_timeout(150)
    return page


def goto_view(page, target):
    for _ in range(4):
        v = page.evaluate("() => window.F03App.inspect().view")
        if v == target:
            return
        if v == "form":
            page.click("#f03-form-back")
            page.wait_for_timeout(300)
            if page.evaluate("() => window.F03App.inspect().dialogOpen"):
                page.click("#f03-abandon")
                page.wait_for_timeout(400)
        elif v == "detail":
            page.click("#f03-detail-back")
            page.wait_for_timeout(250)
        else:
            page.click(f"#f03-nav-{target}")
            page.wait_for_function(f"() => window.F03App.inspect().view === '{target}'", timeout=5000)
            return
    raise RuntimeError(f"goto_view: {target} تعذر")


def run(browser, url, out_dir: Path, phase: str):
    t = Tool(out_dir)
    ctx = browser.new_context(viewport=VIEW)
    page = ctx.new_page()
    t.track(page)

    # ------------------------------------------------ SUI-001 + SUI-002 (توست وnavbar)
    t.group_begin("SUI-001", "توست F03 على مستوى التطبيق: مرئي مقيسًا في كل مسارات showToast")
    base = url + "/" + SAMPLE_REL + "/index.html"

    def do_delete_single(pw):
        goto_view(pw, "list")
        pw.click("#f03-list-rows .f03-row[data-id='it-01']")
        pw.wait_for_function("() => window.F03App.inspect().view === 'detail'")
        pw.click("#f03-detail-delete")
        pw.wait_for_timeout(300)
        pw.click("#f03-delete-confirm")
        pw.wait_for_function("() => !document.getElementById('f03-toast').hidden", timeout=5000)
        pw.wait_for_timeout(120)

    def do_add_order(pw):
        goto_view(pw, "home")
        pw.click("#f03-home-schedule")
        pw.wait_for_function("() => window.F03App.inspect().view === 'schedule'")
        pw.wait_for_timeout(300)
        pw.click("#f03-schedule-add")
        pw.wait_for_timeout(500)
        pw.fill("#f03-order-name", "طلب فحص التوست")
        pw.click("#f03-order-save")
        pw.wait_for_function("() => !document.getElementById('f03-toast').hidden", timeout=5000)
        pw.wait_for_timeout(120)

    def do_edit_order(pw):
        goto_view(pw, "home")
        pw.click("#f03-home-schedule")
        pw.wait_for_function("() => window.F03App.inspect().view === 'schedule'")
        pw.wait_for_timeout(300)
        pw.click(".m-ocal__row[data-ocal-id]")
        pw.wait_for_timeout(450)
        pw.click("#f03-order-edit")
        pw.wait_for_timeout(450)
        pw.fill("#f03-order-name", "طلب معدل للفحص")
        pw.click("#f03-order-save")
        pw.wait_for_function("() => !document.getElementById('f03-toast').hidden", timeout=5000)
        pw.wait_for_timeout(120)

    def do_bulk_delete(pw):
        goto_view(pw, "list")
        pw.click("#f03-select-toggle")
        pw.wait_for_timeout(200)
        pw.click("#f03-list-rows li:nth-child(1) .m-choice__box")
        pw.click("#f03-list-rows li:nth-child(2) .m-choice__box")
        pw.wait_for_timeout(150)
        pw.click("#f03-select-delete")
        pw.wait_for_timeout(300)
        pw.click("#f03-delete-confirm")
        pw.wait_for_function("() => !document.getElementById('f03-toast').hidden", timeout=5000)
        pw.wait_for_timeout(120)

    paths = [("delete-single", do_delete_single), ("add-order", do_add_order),
             ("edit-order", do_edit_order), ("bulk-delete", do_bulk_delete)]
    for width in WIDTHS:
        fresh_f03(t, page, base)
        page.set_viewport_size({"width": width, "height": 800})
        page.wait_for_timeout(200)
        do_delete_single(page)
        m = page.evaluate(TOAST_MEASURE)
        ok = (not m["hiddenAttr"] and m["w"] > 0 and m["h"] > 0 and m["glyphOk"]
              and (m["gapToNavbar"] is None or m["gapToNavbar"] >= 4)
              and not m["toastHasLiveAttrs"] and m["liveRegionCount"] == 1
              and m["liveRegionText"] == m["text"])
        t.check(f"delete-single @{width}px: توست rect>0 نص مرئي فجوة navbar قناة واحدة",
                ok, m)
        t.shot(page, f"f03-{phase}-toast-delete-{width}.png")

    for path_name, fn in [("add-order", do_add_order), ("edit-order", do_edit_order),
                          ("bulk-delete", do_bulk_delete)]:
        fresh_f03(t, page, base)
        fn(page)
        m = page.evaluate(TOAST_MEASURE)
        ok = (not m["hiddenAttr"] and m["w"] > 0 and m["h"] > 0 and m["glyphOk"]
              and (m["gapToNavbar"] is None or m["gapToNavbar"] >= 4)
              and (m["navbarHidden"] is False or m["gapFromBottom"] >= 60)
              and not m["toastHasLiveAttrs"] and m["liveRegionText"] == m["text"])
        t.check(f"{path_name} @390px: توست rect>0 نص مرئي بلا تراكب وقناة واحدة", ok, m)
        t.shot(page, f"f03-{phase}-toast-{path_name}-390.png")

    # 200% على مساري الحذف والإضافة (عناصر موجودة قبل التكبير)
    for path_name, fn in [("delete-single", do_delete_single), ("add-order", do_add_order)]:
        fresh_f03(t, page, base)
        page.set_viewport_size({"width": 320, "height": 800})
        page.evaluate("() => window.F03h.enter()")
        page.wait_for_function("() => window.F03App.inspect().view === 'home'")
        page.evaluate("() => window.F03h.zoom2()")
        page.wait_for_timeout(400)  # مهلة ResizeObserver
        fn(page)
        m = page.evaluate(TOAST_MEASURE)
        ok = (not m["hiddenAttr"] and m["w"] > 0 and m["h"] > 0 and m["glyphOk"]
              and (m["gapToNavbar"] is None or m["gapToNavbar"] >= 4)
              and (m["navbarHidden"] is False or m["gapFromBottom"] >= 60))
        t.check(f"{path_name} @320+200%: توست rect>0 نص مرئي بلا تراكب مع navbar", ok, m)
        t.shot(page, f"f03-{phase}-toast-{path_name}-320-zoom200.png")
        page.evaluate("() => window.F03h.unzoom()")
        page.wait_for_timeout(150)

    # لا سرقة تركيز + الزوال ~4s + الإغلاق اليدوي
    fresh_f03(t, page, base)
    do_delete_single(page)
    m1 = page.evaluate(TOAST_MEASURE)
    page.wait_for_timeout(350)
    m2 = page.evaluate(TOAST_MEASURE)
    t.check("التوست لا يسرق التركيز (عنصر نشط ثابت)", m1["activeElement"] == m2["activeElement"] and m1["activeElement"] not in ("body", "none"),
            {"t0": m1["activeElement"], "t350": m2["activeElement"]})
    t0 = datetime.now(timezone.utc)
    page.wait_for_function("() => document.getElementById('f03-toast').hidden", timeout=6000)
    dt = (datetime.now(timezone.utc) - t0).total_seconds() * 1000
    t.check("زوال تلقائي ~4s (3500..4800ms بعد القياس)", 3500 <= dt <= 4800, {"ms": round(dt)})
    # إغلاق يدوي — زر داخل التوست (غير قابل للوصول قبل الإصلاح لأن السلف مخفي)
    fresh_f03(t, page, base)
    do_delete_single(page)
    page.wait_for_timeout(120)
    closed = False
    click_err = None
    try:
        page.click("#f03-toast [data-toast-close]", timeout=2500)
        page.wait_for_timeout(150)
        closed = page.evaluate("() => document.getElementById('f03-toast').hidden")
    except Exception as e:  # noqa — الزر غير مرئي/غير قابل للنقر (عيب قبل الإصلاح)
        click_err = str(e).split("\n")[0][:200]
    t.check("الإغلاق اليدوي يخفي التوست فورًا (الزر قابل للوصول)",
            closed is True, {"clickError": click_err})
    t.group_end()

    # ------------------------------------------------ SUI-002 (navbar ديناميكي)
    t.group_begin("SUI-002", "ارتفاع navbar بمتغير CSS ديناميكي: صفر تراكب عند 200% و53px نفسها عند 1×")
    fresh_f03(t, page, base, enter=False)
    v_boot = page.evaluate("() => window.F03h.navbarVar()")
    t.check("الإقلاع (navbar مخفي): المتغير غير مضبوط — fallback 53px من CSS",
            v_boot is None or v_boot == "",
            {"var": v_boot})
    page.evaluate("() => window.F03h.enter()")
    page.wait_for_function("() => window.F03App.inspect().view === 'home'")
    page.wait_for_timeout(250)
    v_home = page.evaluate("() => window.F03h.navbarVar()")
    t.check("أول كشف (home): المتغير = الارتفاع المقيس", v_home is not None and v_home.endswith("px") and abs(float(v_home[:-2]) - 53) < 1.5,
            {"var": v_home})
    # الإخفاء: قيمة آخر قياس تبقى
    goto_view(page, "list")
    page.click("#f03-list-rows .f03-row[data-id='it-01']")
    page.wait_for_function("() => window.F03App.inspect().view === 'detail'")
    page.wait_for_timeout(250)
    v_hidden = page.evaluate("() => window.F03h.navbarVar()")
    t.check("الإخفاء (detail): آخر قيمة مقيسة تبقى (سياسة الحالة المخفية)",
            v_hidden == v_home, {"varHidden": v_hidden, "varHome": v_home})
    # إعادة الكشف
    page.click("#f03-detail-back")
    page.wait_for_function("() => window.F03App.inspect().view === 'list'")
    page.wait_for_timeout(250)
    v_back = page.evaluate("() => window.F03h.navbarVar()")
    t.check("إعادة الكشف: المتغير يعود بقيمة الارتفاع", v_back == v_home, {"var": v_back})
    # تغير حي (لا سطر load/resize): تكبير خط عناصر الـnavbar نفسها
    page.evaluate("""() => {
      document.querySelectorAll('#f03-navbar .m-navbar__item').forEach(function (it) { it.style.fontSize = '22px'; });
    }""")
    page.wait_for_timeout(300)
    v_font = page.evaluate("() => window.F03h.navbarVar()")
    t.check("رصد حي لتغير خط عناصر navbar (ResizeObserver لا سطر resize)",
            v_font is not None and float(v_font[:-2]) > 53.5, {"var": v_font})
    page.evaluate("""() => {
      document.querySelectorAll('#f03-navbar .m-navbar__item').forEach(function (it) { it.style.fontSize = ''; });
    }""")
    page.wait_for_timeout(300)

    # مراقب واحد لا يتكرر
    if page.evaluate("() => typeof window.F03App.observeNavbarHeight === 'function'"):
        page.evaluate("() => { window.F03App.observeNavbarHeight(); window.F03App.observeNavbarHeight(); }")
        page.wait_for_timeout(200)
    ro = page.evaluate("() => window.F03App.inspect().navbarRO")
    t.check("مراقب واحد فقط (لا تكرار عند إعادة التشغيل)", ro == 1, {"navbarRO": ro})

    # 1×: نفس 53px
    fresh_f03(t, page, base)
    page.set_viewport_size({"width": 320, "height": 800})
    page.wait_for_timeout(200)
    goto_view(page, "list")
    page.click("#f03-select-toggle")
    page.wait_for_timeout(250)
    sm1 = page.evaluate(SELECTBAR_MEASURE)
    t.check("1× @320: شريط التحديد ملاصق لـnavbar بلا تراكب (القيمة 53px نفسها)",
            abs(sm1["barOverlapNavbar"]) <= 0.5 and abs(sm1["barInsetFromBottom"] - 53) <= 1.5
            and abs(sm1["footPaddingBottom"] - 77) <= 1.5,
            {"overlap": sm1["barOverlapNavbar"], "inset": sm1["barInsetFromBottom"], "footPad": sm1["footPaddingBottom"]})
    t.shot(page, f"f03-{phase}-selectbar-320-1x.png")

    # 200%: صفر تراكب للشريط والتذييل
    page.evaluate("() => window.F03h.zoom2()")
    page.wait_for_timeout(450)
    page.evaluate("() => window.scrollTo(0, 300)")
    page.wait_for_timeout(250)
    sm2 = page.evaluate(SELECTBAR_MEASURE)
    t.check("200% @320: صفر تراكب لشريط التحديد مع navbar (المتغير تتبع 71px)",
            sm2["barOverlapNavbar"] <= 0.5 and sm2["barInsetFromBottom"] > 60,
            {"overlap": sm2["barOverlapNavbar"], "inset": sm2["barInsetFromBottom"], "navbarH": sm2["navbar"]["h"], "var": sm2["navbarVar"]})
    t.shot(page, f"f03-{phase}-selectbar-320-zoom200.png")
    page.evaluate("() => window.scrollTo(0, document.documentElement.scrollHeight)")
    page.wait_for_timeout(250)
    sm3 = page.evaluate(SELECTBAR_MEASURE)
    t.check("200% @320 بعد التمرير للنهاية: رابط التذييل ظاهر بفجوة ≥4px عن navbar",
            sm3["linkGapToNavbar"] >= 4 and sm3["lineGapToNavbar"] >= 4,
            {"linkGap": sm3["linkGapToNavbar"], "lineGap": sm3["lineGapToNavbar"], "footPad": sm3["footPaddingBottom"]})
    page.evaluate("() => window.F03h.unzoom()")
    page.wait_for_timeout(200)

    # اكتشاف القائد: المحدد المشوه — تحقق بايتي + مقيس
    css_path = SCRIPT_REPO / SAMPLE_REL / "example.css"
    css_src = css_path.read_text(encoding="utf-8")
    t.check("محدد الإخفاء سليم بايتيًا (اكتشاف القائد «baridden]» = أثر عرض لا مصدر)",
            "#f03-select-bar" + "[" + "hidden]" in css_src and "baridden]" not in css_src,
            {"ruleExists": "#f03-select-bar" + "[" + "hidden]" in css_src})
    if page.evaluate("() => window.F03App.inspect().list.selecting"):
        page.click("#f03-select-cancel")
        page.wait_for_timeout(200)
    hidden_rect = page.evaluate("""() => {
      const bar = document.getElementById('f03-select-bar');
      const r = bar.getBoundingClientRect();
      return { hiddenAttr: bar.hidden, w: r.width, h: r.height, display: getComputedStyle(bar).display };
    }""")
    t.check("الشريط يُخفى فعليًا بسمة hidden (مستطيل 0×0)", hidden_rect["hiddenAttr"] is True and hidden_rect["w"] == 0 and hidden_rect["h"] == 0,
            hidden_rect)
    t.group_end()

    # ------------------------------------------------ SUI-010
    t.group_begin("SUI-010", "عقد role لملاحظة الحفظ: الخطأ alert، النجاح/المعلومة/التحذير status")
    fresh_f03(t, page, base)
    goto_view(page, "list")
    page.click("#f03-list-rows .f03-row[data-id='it-02']")
    page.wait_for_function("() => window.F03App.inspect().view === 'detail'")
    page.click("#f03-detail-edit")
    page.wait_for_function("() => window.F03App.inspect().view === 'form'")
    page.evaluate("() => window.F03h.arm('save', 'not-saved')")
    page.fill("#f03-name", "باء مرفوض للفحص")
    page.click("#f03-save")
    page.wait_for_function("() => window.F03App.inspect().op === 'failed'", timeout=8000)
    page.wait_for_timeout(250)
    err = page.evaluate("""() => ({
      role: document.getElementById('f03-op-note').getAttribute('role'),
      variant: document.getElementById('f03-op-note').getAttribute('data-op-state'),
      text: document.getElementById('f03-op-body').textContent,
      regions: document.querySelectorAll('[role="alert"], [aria-live]').length,
      liveRegionText: (document.querySelector('.m-live-region') || {}).textContent || null
    })""")
    t.check("فشل الحفظ (خطأ قابل للتصرف): role=alert", err["role"] == "alert" and err["variant"] == "error", err)
    fresh_f03(t, page, base)
    goto_view(page, "list")
    page.click("#f03-list-rows .f03-row[data-id='it-02']")
    page.wait_for_function("() => window.F03App.inspect().view === 'detail'")
    page.click("#f03-detail-edit")
    page.wait_for_function("() => window.F03App.inspect().view === 'form'")
    page.evaluate("() => window.F03h.arm('save', 'unknown')")
    page.fill("#f03-name", "باء نتيجة غير مؤكدة")
    page.click("#f03-save")
    page.wait_for_function("() => window.F03App.inspect().op === 'unknown'", timeout=8000)
    page.wait_for_timeout(250)
    warn = page.evaluate("""() => ({
      role: document.getElementById('f03-op-note').getAttribute('role'),
      variant: document.getElementById('f03-op-note').getAttribute('data-op-state')
    })""")
    t.check("نتيجة غير مؤكدة (تحذير): role=status — ليس إعلانًا مقاطعًا آليًا",
            warn["role"] == "status" and warn["variant"] == "warning", warn)
    fresh_f03(t, page, base)
    goto_view(page, "list")
    page.click("#f03-list-rows .f03-row[data-id='it-02']")
    page.wait_for_function("() => window.F03App.inspect().view === 'detail'")
    page.click("#f03-detail-edit")
    page.wait_for_function("() => window.F03App.inspect().view === 'form'")
    page.fill("#f03-name", "حفظ ناجح للفحص")
    page.click("#f03-save")
    page.wait_for_function("() => window.F03App.inspect().view === 'detail'", timeout=8000)
    page.wait_for_timeout(250)
    succ = page.evaluate("""() => ({
      role: document.getElementById('f03-detail-note').getAttribute('role'),
      variant: document.getElementById('f03-detail-note').getAttribute('data-detail-state'),
      inert: !!document.getElementById('f03-detail-note').closest('[inert]')
    })""")
    t.check("نجاح الحفظ: role=status (كما كان)", succ["role"] == "status" and succ["variant"] == "success", succ)
    spec = (SCRIPT_REPO / "components" / "messages" / "specification.md").read_text(encoding="utf-8")
    t.check("مواصفة messages تحمل العقد المحدث (alert للخطأ فقط + مرجع WCAG)",
            "Status Messages" in spec and "alert" in spec, None)
    t.group_end()

    # ------------------------------------------------ SUI-012
    t.group_begin("SUI-012", "عقد التمييز في MicroMessages.announce: هوية الحدث لا النص")
    msg_url = url + "/" + MSG_REL + "/index.html"
    page.goto(msg_url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.MicroMessages", timeout=10000)
    r = page.evaluate(ANNOUNCE_CONTRACT)
    if "error" in r:
        t.check("منطقة الإعلان موجودة", False, r)
    else:
        c = r["counts"]
        t.check("حدث أول يُعلن (mutations>0)", c["first"] > 0, c)
        t.check("الحدث ذاته (id نفسه) مكررًا: لا إعلان ثانٍ",
                c["same"] == c["first"], c)
        t.check("حدث مستقل (id مختلف) بنفس النص: يُعلن",
                c["independentId"] > c["same"], c)
        t.check("حدث بلا id بنفس النص: يُعلن (توافق خلفي للمستدعين بلا id)",
                c["noId"] > c["independentId"], c)
        t.check("التوافق الخلفي: الوسيط المنطقي assertive يعمل", r["liveAttr"] == "assertive", {"live": r["liveAttr"]})
    spec = (SCRIPT_REPO / "components" / "messages" / "specification.md").read_text(encoding="utf-8")
    t.check("مواصفة messages توثق متى تُمرر id (عقد {id})", "{id}" in spec and "announce" in spec, None)
    t.group_end()

    # ------------------------------------------------ SUI-013 + SUI-014
    t.group_begin("SUI-013+014", "بوابة الدخول: نصوص بشرية وقناة خطأ واحدة")
    gw_url = url + "/" + GW_EXAMPLE_REL
    page.goto(gw_url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.MicroAccessGateway", timeout=10000)
    page.fill("#gateway-email", "demo@example.test")
    page.fill("#gateway-password", "demo-pass-1")
    page.click(".m-access-gateway__submit")
    page.wait_for_timeout(250)
    viewonly = page.evaluate("() => document.querySelector('[data-access-status]').textContent")
    jargon = ["المعالج", "المستهلك", "موصولة", "تمرير الطلب"]
    t.check("وضع العرض فقط: نص بشري بلا مصطلحات داخلية",
            viewonly != "" and not any(j in viewonly for j in jargon), {"text": viewonly})
    t.shot(page, f"gateway-{phase}-viewonly.png")

    # قناة خطأ واحدة على بوابة F03
    fresh_f03(t, page, base, enter=False)
    page.evaluate(GATEWAY_ERROR_CHANNEL)
    page.click("#f03-gw-submit")
    page.wait_for_timeout(350)
    gm = page.evaluate(GATEWAY_ERROR_MEASURE)
    t.check("لا استدعاء reportValidity الأصلي (قناة واحدة: رسالة المكوّن)",
            gm["rvCalls"] == 0, gm)
    t.check("الرسالة العربية المرتبطة ظاهرة وaria-invalid مضبوط والتركيز على الحقل",
            gm["emailAriaInvalid"] == "true" and gm["fieldHasError"] is True
            and gm["noteVisible"] is True and gm["focusId"] == "f03-gw-email", gm)
    t.shot(page, f"gateway-{phase}-single-error-channel.png")
    # نصوص busy/success بشرية (مسار الدخول الفعلي)
    page.fill("#f03-gw-email", "demo@example.test")
    page.fill("#f03-gw-password", "demo-pass-1")
    page.click("#f03-gw-submit")
    page.wait_for_function("() => window.F03App.inspect().entered === true", timeout=8000)
    busy_text = page.evaluate("""() => {
      const s = document.querySelector('[data-access-gateway] [data-access-status]');
      return s ? s.textContent : null;
    }""")
    t.check("نص ما بعد الإرسال بشري (بلا المعالج/المستهلك)",
            busy_text is not None and not any(j in busy_text for j in jargon) and busy_text.strip() != "",
            {"text": busy_text})
    gw_spec = (SCRIPT_REPO / "components" / "access-gateway" / "specification.md").read_text(encoding="utf-8")
    t.check("مواصفة البوابة توثق القناة الواحدة (لا فقاعة أصلية)",
            "reportValidity" in gw_spec, None)
    t.group_end()

    # ------------------------------------------------ SUI-015
    t.group_begin("SUI-015", "أول تركيز في لوحات الفلاتر الثلاث = أول تحكم فعلي")
    fresh_f03(t, page, base)
    goto_view(page, "list")
    page.click("#f03-filter-btn")
    page.wait_for_function("() => window.F03App.inspect().filterPanelOpen === true")
    page.wait_for_timeout(300)
    f1 = page.evaluate("""() => ({
      focus: document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'none',
      isCheckbox: document.activeElement ? document.activeElement.type === 'checkbox' : false,
      closeLabel: (document.querySelector('#f03-filter-layer [data-layer-close]') || {}).getAttribute('aria-label')
    })""")
    t.check("F03: التركيز الأول على أول تحكم (خانة فئة) لا زر الإغلاق",
            f1["isCheckbox"] is True, f1)
    t.shot(page, f"f03-{phase}-filter-first-focus.png")
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)

    f02_url = url + "/" + F02_REL + "/index.html"
    page.goto(f02_url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.MicroNavigation", timeout=10000)
    page.click("#f02f-filter-btn")
    page.wait_for_timeout(350)
    f2 = page.evaluate("""() => ({
      focus: document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'none'
    })""")
    t.check("filter-lifecycle: التركيز الأول على حقل البحث لا زر الإغلاق",
            f2["focus"] == "f02f-q", f2)
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)

    nav_url = url + "/" + NAV_REL + "/index.html"
    page.goto(nav_url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.MicroNavigation", timeout=10000)
    page.evaluate("() => MicroNavigation.openLayer(document.getElementById('filter-panel'), { trigger: document.body })")
    page.wait_for_timeout(350)
    f3 = page.evaluate("""() => ({
      focus: document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : 'none'
    })""")
    t.check("لوحة navigation: التركيز الأول على حقل البحث لا زر الإغلاق",
            f3["focus"] == "f-search", f3)
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    t.group_end()

    # ------------------------------------------------ SUI-016 + 017 + 019 + 020
    t.group_begin("SUI-016/017/019/020", "هامش F03 وهرمية العناوين وحماية الحركة")
    fresh_f03(t, page, base)
    for width in WIDTHS:
        page.set_viewport_size({"width": width, "height": 800})
        page.wait_for_timeout(200)
        pads = page.evaluate("""() => {
          const main = getComputedStyle(document.querySelector('.f03-main'));
          const foot = getComputedStyle(document.querySelector('.f03-foot'));
          return { mainL: parseFloat(main.paddingLeft), mainR: parseFloat(main.paddingRight),
                   footL: parseFloat(foot.paddingLeft), footR: parseFloat(foot.paddingRight) };
        }""")
        want = 20.0 if width >= 390 else 16.0
        t.check(f"هامش {width}px: {want:.0f}px (main+foot) دون 390 و20 من 390",
                abs(pads["mainL"] - want) < 0.5 and abs(pads["mainR"] - want) < 0.5
                and abs(pads["footL"] - want) < 0.5 and abs(pads["footR"] - want) < 0.5, pads)

    titles = page.evaluate("""() => {
      const title = getComputedStyle(document.querySelector('.f03-block__title'));
      const sub = getComputedStyle(document.querySelector('.f03-block__sub'));
      return { titleSize: parseFloat(title.fontSize), titleLine: parseFloat(title.lineHeight),
               titleWeight: title.fontWeight,
               subSize: parseFloat(sub.fontSize), subLine: parseFloat(sub.lineHeight), subWeight: sub.fontWeight };
    }""")
    t.check("عنوان كتلة F03: 16/24 وزن 600 (عنوان مجموعة داخل وجهة)",
            abs(titles["titleSize"] - 16) < 0.5 and abs(titles["titleLine"] - 24) < 0.5 and titles["titleWeight"] == "600",
            titles)
    t.check("العنوان الفرعي يبقى 14/500",
            abs(titles["subSize"] - 14) < 0.5 and titles["subWeight"] == "500", titles)
    t.shot(page, f"f03-{phase}-block-titles.png")

    secs = page.evaluate("""() => {
      const out = [];
      ['#f03-detail-activity .m-section__head span', '#f03-rep-extra .m-section__head span'].forEach((sel) => {
        const el = document.querySelector(sel);
        if (!el) { out.push({ sel, missing: true }); return; }
        const cs = getComputedStyle(el);
        out.push({ sel, cls: el.className, size: parseFloat(cs.fontSize), line: parseFloat(cs.lineHeight), weight: cs.fontWeight });
      });
      return out;
    }""")
    ok19 = all(not s.get("missing") and s["cls"] == "m-section-title"
               and abs(s["size"] - 18) < 0.5 and abs(s["line"] - 28) < 0.5 and s["weight"] == "600" for s in secs)
    t.check("SUI-019: العنوانان يستخدمان m-section-title (18/28/600) لا الصنف الميت", ok19, secs)

    tr_n = None
    ctx_rm = browser.new_context(viewport=VIEW, reduced_motion="reduce")
    page_rm = ctx_rm.new_page()
    t.track(page_rm)
    fresh_f03(t, page_rm, base)
    goto_view(page_rm, "list")
    rm = page_rm.evaluate(ROW_TRANSITION)
    t.check("SUI-020: تحت reduced-motion انتقال الصف = none",
            rm and rm["reduced"] is True and (rm["property"] == "none" or rm["duration"] == "0s"), rm)
    ctx_rm.close()
    fresh_f03(t, page, base)
    goto_view(page, "list")
    rn = page.evaluate(ROW_TRANSITION)
    t.check("الحالة الطبيعية: الانتقال باقٍ (background-color > 0s)",
            rn and rn["reduced"] is False and "background-color" in rn["property"] and rn["duration"] != "0s", rn)
    t.group_end()

    # ------------------------------------------------ SUI-022 + 023 + 029
    t.group_begin("SUI-022/023/029", "KEEP موثق + سؤال الحذف + عزل مدخل المراجعة")
    # SUI-022: السلوك محفوظ (التفاف) + سطر التوثيق
    nav_url = url + "/" + NAV_REL + "/index.html"
    page.goto(nav_url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.MicroNavigation", timeout=10000)
    wrap = page.evaluate("""() => {
      const tabs = [...document.querySelectorAll('.m-tabs__tab')];
      const last = tabs[tabs.length - 1];
      last.focus();
      const ev = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      last.dispatchEvent(ev);
      const active = document.activeElement;
      return { tabCount: tabs.length, from: last.id || last.textContent, to: active === tabs[0], toFirst: active === tabs[0] };
    }""")
    t.check("SUI-022 (KEEP): الالتفاف عند الحافة محفوظ كما هو (سلوك مقصود)",
            wrap["toFirst"] is True, wrap)
    nav_spec = (SCRIPT_REPO / "components" / "navigation" / "specification.md").read_text(encoding="utf-8")
    t.check("سطر توثيق القرار موجود في مواصفة B07", "التفاف" in nav_spec and "S29" in nav_spec, None)

    # SUI-023: نص الحذف سؤال
    fresh_f03(t, page, base)
    goto_view(page, "list")
    page.click("#f03-list-rows .f03-row[data-id='it-03']")
    page.wait_for_function("() => window.F03App.inspect().view === 'detail'")
    page.click("#f03-detail-delete")
    page.wait_for_timeout(350)
    dlg = page.evaluate("""() => ({
      text: document.getElementById('f03-delete-text').textContent,
      focus: document.activeElement ? (document.activeElement.id || document.activeElement.textContent) : 'none',
      cancelFocused: document.activeElement && document.activeElement.hasAttribute('data-autofocus')
    })""")
    t.check("SUI-023: نص الحذف سؤال (؟) مع بقاء عدم التراجع",
            "؟" in dlg["text"] and "لا يمكن التراجع" in dlg["text"], dlg)
    t.check("SUI-023: الإلغاء الافتراضي الآمن يحمل التركيز عند الفتح",
            dlg["cancelFocused"] is True, dlg)
    t.shot(page, f"f03-{phase}-delete-question.png")
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)

    # SUI-029: مدخل المراجعة مخفي في البوابة
    fresh_f03(t, page, base, enter=False)
    gw_state = page.evaluate("""() => {
      const link = document.getElementById('f03-review-open');
      const r = link.getBoundingClientRect();
      return { hiddenAttr: link.hidden, w: r.width, h: r.height,
               display: getComputedStyle(link).display, view: window.F03App.inspect().view };
    }""")
    t.check("SUI-029: مدخل المراجعة مخفي فعليًا في شاشة الدخول",
            gw_state["hiddenAttr"] is True and gw_state["w"] == 0 and gw_state["h"] == 0, gw_state)
    t.shot(page, f"f03-{phase}-gateway-no-review-entry.png")
    page.evaluate("() => window.F03h.enter()")
    page.wait_for_function("() => window.F03App.inspect().view === 'home'")
    page.wait_for_timeout(200)
    home_state = page.evaluate("""() => {
      const link = document.getElementById('f03-review-open');
      const r = link.getBoundingClientRect();
      return { hiddenAttr: link.hidden, w: r.width, h: r.height };
    }""")
    t.check("بعد الدخول: المدخل يعمل من التذييل (نطاق معلن)",
            home_state["hiddenAttr"] is False and home_state["w"] > 0 and home_state["h"] > 0, home_state)
    page.click("#f03-review-open")
    page.wait_for_function("() => window.F03App.inspect().reviewOpen === true")
    t.check("أداة المراجعة تفتح من التذييل بعد الدخول", True, None)
    page.click("#f03-review-close")
    page.wait_for_function("() => window.F03App.inspect().reviewOpen === false")
    t.group_end()

    ctx.close()

    # ---------- إخراج ----------
    meta = git_meta(SCRIPT_REPO)
    summary = t.summary()
    doc = {
        "tool": "tools/sui-repair-a3-check.py",
        "phase": phase,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "git": meta,
        "browser": {"name": "Chromium", "path": CHROMIUM},
        "zoom_mechanism": "text x2, two clean passes (ZOOM2_CLEAN pattern) — not native zoom",
        "summary": summary,
        "groups": t.results,
    }
    (out_dir / "results.json").write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [f"phase: {phase}", f"total: {summary['total']} passed: {summary['passed']} failed: {summary['failed']}", ""]
    for g in t.results:
        lines.append(f"[{g['id']}] {g.get('result', '?')} — {g['group']}")
        for c in g["checks"]:
            lines.append(f"  {'PASS' if c['ok'] else 'FAIL'} {c['name']}" + (f" — {c['detail']}" if not c["ok"] else ""))
    lines += ["", "NOT RUN:"] + [f"  - {n}" for n in summary["not_run"]]
    (out_dir / "summary.txt").write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))
    return summary["failed"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--phase", default="after", choices=["before", "after"])
    ap.add_argument("--port", type=int, default=4301)
    args = ap.parse_args()
    out_dir = EVIDENCE_ROOT / args.phase
    out_dir.mkdir(parents=True, exist_ok=True)
    url = serve_dir(SCRIPT_REPO, args.port)
    print(f"server: {url}\nphase: {args.phase}\nout: {out_dir}")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM)
        failed = run(browser, url, out_dir, args.phase)
        browser.close()
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
