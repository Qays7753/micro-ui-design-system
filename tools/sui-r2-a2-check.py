#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص الوكيل 2 (جولة SAMSUNG-ONEUI-REPAIR-R2 — عيب SUI-R1-02)

ملك الوكيل 2 وحده. إعادة إنتاج مقيسة قبل/بعد لإصلاح «disconnect ثم init
لا يعيد مراقبة الحجم» في عارضَي peek وcarousel:

الفحوص الإلزامية (تُكتب لتفشل قبل الإصلاح وتنجح بعده — عدا فحوص الحالة
السليمة التي تظل خضراء في الحالتين كإثبات عدم الانحدار):
  1. ثلاث دورات كاملة لكل مكوّن عند فهرس غير صفري (peek: 2/4 بطاقات في
     حاضنة معزولة؛ carousel: 1/3 شرائح): لكل دورة disconnect(root) ثم
     init(root) ثم تغيير عرض الحاوية الأب (320→360→390→340) دون أي
     window-resize — البطاقة/الشريحة النشطة موسّطة داخل viewport بفرق
     حواف ≤1px (getBoundingClientRect للنشطة مقابل حواف الـviewport).
     الدورة 1 بجذر العنصر نفسه (init الجذر-الذات) والدورتان 2-3 بجذر
     document. الدورة الأخيرة تنتهي عند 340 لا 320 عمدًا: العودة إلى
     العرض الأصلي تحجب العيب في «قبل» بقيمة transform قديمة صادفة
     الصواب، فتُختبر إعادة القياس الحقيقية بعرض مختلف.
  2. الإخفاء ثم الإظهار ضمن الدورة الثانية: أخفِ الحاضنة ثم disconnect
     ثم init ثم اكشفها — البطاقة النشطة موسّطة بعد الكشف، الفهرس محفوظ،
     وصفر أحداث micro-info-peek:change / micro-carousel:change أثناء
     مزامنة إعادة التوسيط (عدّها بمستمع).
  3. مراقب نشط واحد بالضبط لهدف viewport المكوّن بعد 3 دورات — تغليف
     ResizeObserver قبل تحميل السكربتات يتتبع البناء وobserve وdisconnect
     لكل نسخة (لا مراقب يتيم؛ يُسجَّل built/observeCalls/disconnected).
  4. لا ازدواج مستمعات بعد 3 دورات: نقر زر next مرة واحدة = خطوة واحدة
     وحدث change واحد (لو ازدوج مستمع click لتقدم أكثر)؛ مثله prev؛
     ArrowLeft/ArrowRight مرة على العارض المركّز = خطوة وحدث واحد؛ نقر
     نقطة/صفحة = حدث واحد.
  5. لا ازدواج نقاط/صفحات: عدد أبناء [data-dots]/[data-info-strip-pages]
     = عدد الشرائح بعد 3 دورات.
  6. التركيز محفوظ: زر داخل البطاقة النشطة قبل disconnect يبقى
     document.activeElement بعد الدورة الكاملة (disconnect→init→تغير العرض).
  7. التوسيط عند 320 و200% (ZOOM2_CLEAN بمرورين نظيفين — محاكاة نص لا
     native zoom): بعد دورة disconnect/init عند فهرس غير صفري مع تغيّر
     عرض الأب — البطاقة النشطة موسّطة ضمن ±1px.
  8. standalone (الملف الواحد) عبر file:// مع تحقق build --check أولًا:
     دخول بالمزوّد التجريبي → وجهة التقارير → دورة disconnect/init كاملة
     مع تغيّر عرض الحاضنة (style.width على الشريط عبر evaluate) → توسيط
     وفهرس محفوظ ومراقب نشط واحد لهدف viewport الشريط (بقية RO للصفحة
     لا تستهدفه) وصفر أحداث أثناء المزامنة.
  9. صفر أخطاء صفحة عبر كل الجلسات.
  + دورة rAF المعلقة: في مهمة واحدة: تغيير عرض الأب + dispatch resize
    (يجدول نبضة recenter عبر مستمع window-resize) + disconnect — إن أُلغي
    rAF المعلق يبقى transform كما كان (لا إعادة قياس بعد الفصل)؛ إن لم
    يُلغَ تُعيد النبضة القياس عند العرض الجديد فيظهر الفرق.

ملاحظة تشغيل: قبل مرحلة after يُعاد توليد standalone داخل worktreeك بـ
    python3 tools/build-f03-standalone.py
(التعديل على standalone.html داخل worktree مقصود للاختبار المحلي فقط —
القائد يعيد التوليد رسميًا بعد الدمج).

NOT RUN: أجهزة فعلية/لمس حقيقي، TalkBack/قارئ شاشة فعلي، WebKit، native zoom
(التكبير محاكاة نص معلنة)، رجوع النظام.
"""
import argparse
import hashlib
import json
import subprocess
import sys
import threading
from datetime import datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT_REPO = Path(__file__).resolve().parents[1]
EVIDENCE_BIN = Path("/home/z/my-project/evidence/bin/chromium")
OUT_DEFAULT = SCRIPT_REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R2" / "evidence" / "agent2"
STANDALONE = SCRIPT_REPO / "previews" / "ux-patterns" / "mobile-record-sample" / "standalone.html"
BUILD_TOOL = SCRIPT_REPO / "tools" / "build-f03-standalone.py"
PORT_RANGE = range(4420, 4440)  # نطاق منافذ الوكيل 2 في بروتوكول الجولة

ZOOM2_CLEAN = """() => {
  /* محاكاة نص ×2 بمرورين نظيفين (لا مضاعفة موريثة) — نفس آلية a2-check */
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""

UNZOOM = """() => {
  document.querySelectorAll('[data-r2-z],[data-r2z]').forEach((el) => {
    el.style.fontSize = ''; delete el.dataset.r2z;
  });
  return true;
}"""

# تغليف ResizeObserver لعدّ المراقبين لكل نسخة (قبل تحميل سكربتات المكوّنات):
# يتتبّع البناء وobserve (الأهداف) وdisconnect لكل instance — يسمح بعدّ
# «المراقبين النشطين لهدف بعينه» (النسخ غير المفصولة التي تراقبه) وبكشف
# أي يتيم (نسخة نشطة لا تراقب شيئًا). امتداد لنمط a4 (__a4ro) بـinstances.
RO_WRAP_BODY = """(() => {
  const Orig = window.ResizeObserver;
  window.__a2ro = { built: 0, observeCalls: 0, disconnected: 0, instances: [] };
  if (!Orig) return;
  window.ResizeObserver = class extends Orig {
    constructor(cb) {
      super(cb);
      this.__a2 = { id: window.__a2ro.built + 1, disconnected: false, targets: [] };
      window.__a2ro.built += 1;
      window.__a2ro.instances.push(this.__a2);
    }
    observe(t) { super.observe(t); window.__a2ro.observeCalls += 1; if (this.__a2 && t) this.__a2.targets.push(t); }
    disconnect() { super.disconnect(); window.__a2ro.disconnected += 1; if (this.__a2) this.__a2.disconnected = true; }
  };
})();"""
RO_WRAP = "<script>" + RO_WRAP_BODY + "</script>"


def serve_repo(port):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = None
    for p in [port] + [x for x in PORT_RANGE if x != port]:
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", p), partial(H, directory=str(SCRIPT_REPO)))
            break
        except OSError:
            continue
    if srv is None:
        raise RuntimeError("لا منفذ متاح في نطاق 4420-4439")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}", srv


def git_meta():
    def git(*args):
        return subprocess.run(["git", *args], capture_output=True, text=True, cwd=str(SCRIPT_REPO)).stdout.strip()
    status = git("status", "--porcelain")
    return {"commit": git("rev-parse", "HEAD"), "tree": git("rev-parse", "HEAD^{tree}"),
            "source_clean": status == "", "dirty_files": [ln for ln in status.splitlines()][:12],
            "components_clean": git("diff", "--stat", "--", "components") == ""}


class Tool:
    def __init__(self, out_dir, stage):
        self.out = out_dir
        self.stage = stage
        self.results = []
        self.info = []
        self.lines = []

    def log(self, m):
        print(m)
        self.lines.append(m)

    def check(self, name, ok, detail=""):
        self.results.append({"name": name, "ok": bool(ok), "detail": detail})
        self.log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))

    def record(self, name, data):
        self.info.append({"name": name, "data": data})
        self.log("INFO  " + name + " — " + json.dumps(data, ensure_ascii=False)[:300])

    def finish(self):
        passed = sum(1 for r in self.results if r["ok"])
        total = len(self.results)
        self.log("")
        self.log(f"# النتيجة ({self.stage}): {passed}/{total} ناجح — info: {len(self.info)}")
        payload = {
            "tool": "tools/sui-r2-a2-check.py",
            "stage": self.stage,
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "git": git_meta(),
            "browser": self.browser_version,
            "zoom_mechanism": "ZOOM2_CLEAN: مروران نظيفان (مضاعفة computed font-size) — محاكاة نص، ليست native zoom",
            "not_run": ["أجهزة فعلية/لمس حقيقي", "TalkBack/قارئ شاشة فعلي", "WebKit", "native zoom", "رجوع النظام"],
            "checks": self.results,
            "info_records": self.info,
            "summary": {"passed": passed, "failed": total - passed, "total": total},
        }
        (self.out / f"{self.stage}-results.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        (self.out / f"{self.stage}-summary.txt").write_text("\n".join(self.lines) + "\n", encoding="utf-8")
        return passed == total


PEEK_GEO = """(sel) => {
  const strip = document.querySelector(sel);
  const vp = strip.querySelector('[data-info-strip-viewport]');
  const slides = [...strip.querySelectorAll('.m-info-strip__slide')];
  const act = slides.find(s => s.getAttribute('aria-hidden') === 'false') || slides[0];
  const vr = vp.getBoundingClientRect(); const r = act.getBoundingClientRect();
  const track = strip.querySelector('[data-info-strip-track]');
  const tr = getComputedStyle(track).transform;
  return { transform: (t => t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41)(tr),
           inlineTransform: track.style.transform || '',
           vpW: vr.width, slideW: r.width,
           leftInset: r.left - vr.left, rightInset: vr.right - r.right,
           index: window.MicroInfoPeek ? window.MicroInfoPeek.getIndex(strip) : null };
}"""

CAR_GEO = """(sel) => {
  const c = document.querySelector(sel);
  const vp = c.querySelector('[data-viewport]');
  const cur = c.querySelector('[data-carousel-slide][data-current="true"]');
  const vr = vp.getBoundingClientRect(); const r = cur.getBoundingClientRect();
  const track = c.querySelector('[data-track]');
  const tr = getComputedStyle(track).transform;
  return { transform: (t => t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41)(tr),
           inlineTransform: track.style.transform || '',
           vpW: vr.width, slideW: r.width,
           leftInset: r.left - vr.left, rightInset: vr.right - r.right,
           index: window.MicroCarousel ? window.MicroCarousel.getIndex(c) : null };
}"""

RO_STATS = """(sel) => {
  const t = document.querySelector(sel);
  const inst = window.__a2ro ? window.__a2ro.instances : [];
  const active = inst.filter(i => !i.disconnected);
  return { built: window.__a2ro ? window.__a2ro.built : null,
           observeCalls: window.__a2ro ? window.__a2ro.observeCalls : null,
           disconnected: window.__a2ro ? window.__a2ro.disconnected : null,
           activeTotal: active.length,
           activeOnViewport: active.filter(i => i.targets.includes(t)).length,
           orphanActive: active.filter(i => i.targets.indexOf(t) < 0).length };
}"""

FOCUS_EL = "() => document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : null"


def centered(geo, tol=1.0):
    return abs(geo["leftInset"] - geo["rightInset"]) <= tol


def fmt(geo):
    return json.dumps({k: (round(v, 2) if isinstance(v, float) else v) for k, v in geo.items()}, ensure_ascii=False)


# ---------- الحواضن المعزولة (نمط a4: #wrap بعرض متغير + قسم مخفي #hv) ----------

def peek_harness(base):
    head = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
            f'<base href="{base}/">'
            '<link rel="stylesheet" href="shared/tokens.css">'
            '<link rel="stylesheet" href="components/info-strip/info-strip.css">'
            '<link rel="stylesheet" href="components/info-strip/info-strip-peek.css">'
            + RO_WRAP +
            '<script src="components/info-strip/info-strip-peek.js"></script></head><body>')
    slides = "".join(
        f'<div class="m-info-strip__slide"><article class="m-info-card">'
        f'<span class="m-info-card__label">بطاقة {i + 1}</span>'
        f'<div class="m-info-card__reading"><span class="m-info-card__number">{(i + 1) * 12}</span>'
        f'<span class="m-info-card__unit">وحدة</span></div>'
        f'<button type="button" id="btn-{i}">تفاصيل {i + 1}</button></article></div>'
        for i in range(4))
    body = ('<div id="wrap" style="width:320px"><section id="hv" hidden>'
            '<div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="t-peek">'
            '<div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0" aria-label="عارض">'
            f'<div class="m-info-strip__track" data-info-strip-track>{slides}</div></div>'
            '<div class="m-info-strip__controls" data-info-strip-controls>'
            '<button type="button" data-info-strip-prev aria-label="السابقة">س</button>'
            '<button type="button" data-info-strip-next aria-label="التالية">ت</button>'
            '<span data-info-strip-position></span>'
            '<span class="m-info-strip__pages" data-info-strip-pages aria-label="اختيار البطاقة"></span>'
            '</div>'
            '<p data-info-strip-status role="status"></p></div></section></div>')
    return head + body + '</body></html>'


def carousel_harness(base):
    head = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
            f'<base href="{base}/">'
            '<link rel="stylesheet" href="shared/tokens.css">'
            '<link rel="stylesheet" href="components/carousel/carousel.css">'
            + RO_WRAP +
            '<script src="components/carousel/carousel.js"></script></head><body>')
    cards = "".join(
        f'<li class="m-carousel__slide" data-carousel-slide data-card-label="بطاقة {i + 1}">'
        f'<div class="m-carousel__card" style="padding:12px"><h3>بطاقة {i + 1}</h3>'
        f'<p>محتوى تجريبي للعارض رقم {i + 1}</p>'
        f'<button type="button" id="cbtn-{i}">تفاصيل {i + 1}</button></div></li>'
        for i in range(3))
    body = ('<div id="wrap" style="width:320px"><section id="cv" hidden>'
            '<div class="m-carousel" data-carousel data-carousel-label="اختبار" id="t-car">'
            '<div class="m-carousel__viewport" data-viewport>'
            f'<ul class="m-carousel__track" data-track>{cards}</ul></div>'
            '<div class="m-carousel__controls">'
            '<button type="button" data-prev aria-label="السابق">س</button>'
            '<p data-status aria-live="polite"></p>'
            '<button type="button" data-next aria-label="التالي">ت</button></div>'
            '<div class="m-carousel__dots" data-dots role="group" aria-label="نقاط"></div>'
            '</div></section></div>')
    return head + body + '</body></html>'


PEEK_CFG = {
    "name": "peek", "api": "MicroInfoPeek", "geo": PEEK_GEO,
    "root_id": "t-peek", "root_sel": "#t-peek", "hide_id": "hv",
    "index0": 2, "slides": 4, "event": "micro-info-peek:change",
    "viewport_sel": "#t-peek [data-info-strip-viewport]",
    "focus_id": "btn-2",
    "next_js": "() => document.querySelector('#t-peek [data-info-strip-next]').click()",
    "prev_js": "() => document.querySelector('#t-peek [data-info-strip-prev]').click()",
    "direct_js": "() => document.querySelectorAll('#t-peek [data-info-strip-page]')[1].click()",
    "direct_label": "نقرة صفحة (index 1)",
    "direct_index": 1,
    "pages_js": "() => document.querySelector('#t-peek [data-info-strip-pages]').childElementCount",
}

CAR_CFG = {
    "name": "carousel", "api": "MicroCarousel", "geo": CAR_GEO,
    "root_id": "t-car", "root_sel": "#t-car", "hide_id": "cv",
    "index0": 1, "slides": 3, "event": "micro-carousel:change",
    "viewport_sel": "#t-car [data-viewport]",
    "focus_id": "cbtn-1",
    "next_js": "() => document.querySelector('#t-car [data-next]').click()",
    "prev_js": "() => document.querySelector('#t-car [data-prev]').click()",
    "direct_js": "() => document.querySelectorAll('#t-car [data-dots] button')[0].click()",
    "direct_label": "نقرة نقطة (index 0)",
    "direct_index": 0,
    "pages_js": "() => document.querySelector('#t-car [data-dots]').childElementCount",
}


def js_call(api, method, root_js):
    return "() => window.%s.%s(%s)" % (api, method, root_js)


def run_component_section(t, browser, base, stage, cfg, errors, shots):
    name = cfg["name"]
    ctx = browser.new_context(viewport={"width": 320, "height": 844})
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(f"{name}: {e}"))
    harness = peek_harness(base) if name == "peek" else carousel_harness(base)
    page.set_content(harness)
    page.wait_for_load_state("networkidle")

    # عدّاد أحداث التغيير
    page.evaluate("() => { window.__ev = 0; document.getElementById('%s').addEventListener('%s', () => window.__ev++); }"
                  % (cfg["root_id"], cfg["event"]))

    # كشف الحاضنة ثم فهرس غير صفري
    page.evaluate("() => document.getElementById('%s').hidden = false" % cfg["hide_id"])
    page.wait_for_timeout(500)
    page.evaluate("() => window.%s.goTo(document.getElementById('%s'), %d)"
                  % (cfg["api"], cfg["root_id"], cfg["index0"]))
    page.wait_for_timeout(500)
    base_geo = page.evaluate(cfg["geo"], cfg["root_sel"])
    t.check(f"{name}/baseline أول كشف عند 320 وفهرس {cfg['index0']}: البطاقة النشطة موسّطة (فرق حواف ≤1px) — حالة سليمة قبل وبعد",
            centered(base_geo), fmt(base_geo))
    t.record(f"{name}/baseline geo", base_geo)

    # ---- الفحص 1+2: ثلاث دورات disconnect → init → تغيّر عرض الأب (بلا window-resize) ----
    widths = [360, 390, 340]
    for i, w in enumerate(widths):
        root_js = "document.getElementById('%s')" % cfg["root_id"] if i == 0 else "document"
        root_label = "جذر العنصر نفسه (الجذر-الذات)" if i == 0 else "جذر document"
        if i == 1:
            # الإخفاء قبل الفصل ثم init ثم الكشف (الفحص 2 ضمن الدورة الثانية)
            page.evaluate("() => document.getElementById('%s').hidden = true" % cfg["hide_id"])
            page.wait_for_timeout(300)
            page.evaluate("() => window.__ev = 0")
        page.evaluate(js_call(cfg["api"], "disconnect", root_js))
        page.evaluate(js_call(cfg["api"], "init", root_js))
        if i == 1:
            page.evaluate("() => document.getElementById('%s').hidden = false" % cfg["hide_id"])
            page.wait_for_timeout(600)
            geo = page.evaluate(cfg["geo"], cfg["root_sel"])
            ev = page.evaluate("() => window.__ev")
            t.check(f"{name}/c2-reveal إخفاء ثم disconnect ثم init ثم كشف: موسّطة بعد الكشف + الفهرس محفوظ + صفر أحداث change أثناء مزامنة إعادة التوسيط",
                    centered(geo) and geo["index"] == cfg["index0"] and ev == 0,
                    f"geo={fmt(geo)} events={ev}")
            page.screenshot(path=str(shots / f"{stage}-{name}-c2-reveal.png"))
        page.evaluate("() => document.getElementById('wrap').style.width = '%dpx'" % w)
        page.wait_for_timeout(600)
        geo = page.evaluate(cfg["geo"], cfg["root_sel"])
        t.check(f"{name}/cycle{i + 1} دورة كاملة ({root_label}): disconnect → init → عرض الأب {w} بلا window-resize → النشطة موسّطة والفهرس محفوظ",
                centered(geo) and geo["index"] == cfg["index0"], fmt(geo))
        if i == 2:
            page.screenshot(path=str(shots / f"{stage}-{name}-after-3-cycles.png"))

    # ---- الفحص 3: مراقب نشط واحد بالضبط (ولا يتيم) ----
    ro = page.evaluate(RO_STATS, cfg["viewport_sel"])
    t.check(f"{name}/observer بعد 3 دورات disconnect/init: مراقب نشط واحد بالضبط لهدف viewport المكوّن ولا يتيم (نسخ نشطة لا تراقبه = 0)",
            ro["activeOnViewport"] == 1 and ro["orphanActive"] == 0,
            json.dumps(ro, ensure_ascii=False))
    t.record(f"{name}/observer stats", ro)

    # ---- الفحص 4: لا ازدواج مستمعات (حدث change واحد لكل فعل + خطوة واحدة) ----
    def act(label, action_js, expect_index, keyboard=False):
        page.evaluate("() => window.__ev = 0")
        if keyboard:
            page.focus(cfg["root_sel"])
            page.keyboard.press(action_js)
        else:
            page.evaluate(action_js)
        page.wait_for_timeout(500)
        idx = page.evaluate("() => window.%s.getIndex(document.getElementById('%s'))" % (cfg["api"], cfg["root_id"]))
        ev = page.evaluate("() => window.__ev")
        t.check(f"{name}/no-double {label}: خطوة واحدة فقط وحدث change واحد",
                ev == 1 and idx == expect_index, f"events={ev} index={idx}")

    act("نقر زر التالي مرة", cfg["next_js"], cfg["index0"] + 1)
    act("نقر زر السابق مرة", cfg["prev_js"], cfg["index0"])
    act("ArrowLeft على العارض المركز (RTL: التالي)", "ArrowLeft", cfg["index0"] + 1, keyboard=True)
    act("ArrowRight على العارض المركز (RTL: السابق)", "ArrowRight", cfg["index0"], keyboard=True)
    act(cfg["direct_label"], cfg["direct_js"], cfg["direct_index"])
    # إعادة الفهرس غير الصفري للفحوص التالية
    page.evaluate("() => window.%s.goTo(document.getElementById('%s'), %d)" % (cfg["api"], cfg["root_id"], cfg["index0"]))
    page.wait_for_timeout(500)
    page.evaluate("() => window.__ev = 0")

    # ---- الفحص 5: لا ازدواج نقاط/صفحات ----
    n = page.evaluate(cfg["pages_js"])
    t.check(f"{name}/no-double-children عدد أبناء مؤشر الموضع = عدد الشرائح بعد 3 دورات (لا ازدواج نقاط/صفحات)",
            n == cfg["slides"], f"children={n} slides={cfg['slides']}")

    # ---- الفحص 6: التركيز محفوظ عبر دورة كاملة ----
    page.evaluate("() => document.getElementById('%s').focus()" % cfg["focus_id"])
    page.evaluate(js_call(cfg["api"], "disconnect", "document"))
    page.evaluate(js_call(cfg["api"], "init", "document"))
    page.evaluate("() => document.getElementById('wrap').style.width = '360px'")
    page.wait_for_timeout(600)
    focus_kept = page.evaluate("() => document.activeElement === document.getElementById('%s')" % cfg["focus_id"])
    geo = page.evaluate(cfg["geo"], cfg["root_sel"])
    t.check(f"{name}/focus زر داخل البطاقة النشطة قبل disconnect يبقى document.activeElement بعد الدورة الكاملة (disconnect→init→تغير العرض) والفهرس محفوظ",
            focus_kept and geo["index"] == cfg["index0"],
            f"focusKept={focus_kept} activeEl={page.evaluate(FOCUS_EL)} geo={fmt(geo)}")

    # ---- الفحص 7: التوسيط عند 320 و200% (ZOOM2_CLEAN) بعد دورة disconnect/init ----
    page.evaluate("() => document.getElementById('wrap').style.width = '320px'")
    page.wait_for_timeout(500)
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(400)
    page.evaluate(js_call(cfg["api"], "disconnect", "document"))
    page.evaluate(js_call(cfg["api"], "init", "document"))
    page.evaluate("() => document.getElementById('wrap').style.width = '360px'")
    page.wait_for_timeout(700)
    geo = page.evaluate(cfg["geo"], cfg["root_sel"])
    t.check(f"{name}/zoom200 عند 320 و200% (ZOOM2_CLEAN): دورة disconnect/init عند فهرس غير صفري مع تغيّر عرض الأب → النشطة موسّطة ±1px",
            centered(geo) and geo["index"] == cfg["index0"], fmt(geo))
    page.screenshot(path=str(shots / f"{stage}-{name}-zoom200-after-cycle.png"))
    page.evaluate(UNZOOM)
    page.wait_for_timeout(300)
    page.evaluate("() => document.getElementById('wrap').style.width = '320px'")
    page.wait_for_timeout(600)

    # ---- إضافي (بند 3 من التصميم): disconnect يلغي نبضة rAF معلقة ----
    geo0 = page.evaluate(cfg["geo"], cfg["root_sel"])
    t0 = geo0["transform"]
    # مهمة واحدة: تغيير عرض + جدولة نبضة recenter (dispatch resize) + فصل
    page.evaluate("""() => {
      document.getElementById('wrap').style.width = '360px';
      window.dispatchEvent(new Event('resize'));
      window.%s.disconnect(document);
      return true;
    }""" % cfg["api"])
    page.wait_for_timeout(800)
    geo1 = page.evaluate(cfg["geo"], cfg["root_sel"])
    t.check(f"{name}/raf-cancel disconnect يلغي دورة rAF معلقة (تغيير عرض + dispatch resize ثم فصل في مهمة واحدة): transform يبقى كما كان — لا إعادة قياس بعد الفصل",
            abs(geo1["transform"] - t0) < 0.25,
            f"transformBefore={round(t0, 2)} transformAfter={round(geo1['transform'], 2)} centeredAfter={centered(geo1)}")
    t.record(f"{name}/raf-cancel", {"before": geo0, "after": geo1})
    page.screenshot(path=str(shots / f"{stage}-{name}-raf-cancel.png"))

    # لقطة نهائية للحالة بعد إعادة init (صحة عامة للنهاية)
    page.evaluate(js_call(cfg["api"], "init", "document"))
    page.wait_for_timeout(500)
    ro_final = page.evaluate(RO_STATS, cfg["viewport_sel"])
    t.record(f"{name}/observer final", ro_final)
    ctx.close()


def run_standalone_section(t, browser, stage, errors, shots):
    # ---- الفحص 0: الملف الواحد مطابق للمصادر (بناء حتمي) ----
    if not STANDALONE.is_file():
        t.check("standalone/exists الملف الواحد موجود", False, str(STANDALONE))
        return
    chk = subprocess.run([sys.executable, str(BUILD_TOOL), "--check"], cwd=str(SCRIPT_REPO),
                         capture_output=True, text=True)
    digest = hashlib.md5(STANDALONE.read_bytes()).hexdigest()[:12]
    t.check("standalone/build-check standalone.html مطابق لإعادة التوليد من المصادر الحالية (build --check) — يثبت أن المفحوص هو نسخة المصدر الحالي",
            chk.returncode == 0, f"returncode={chk.returncode} md5={digest} out={chk.stdout.strip()[:120]}")

    ctx = browser.new_context(viewport={"width": 320, "height": 844})
    ctx.add_init_script(RO_WRAP_BODY)  # تغليف RO قبل أي سكربت — يعمل على file://
    page = ctx.new_page()
    page.on("pageerror", lambda e: errors.append(f"standalone: {e}"))
    page.goto(STANDALONE.as_uri())
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(700)

    # دخول عبر المزوّد التجريبي ثم وجهة التقارير
    page.click("#f03-gw-demo")
    page.wait_for_timeout(900)
    page.click("#f03-nav-reports")
    page.wait_for_timeout(900)

    # عدّاد أحداث التغيير على شريط التقارير
    page.evaluate("() => { window.__ev = 0; document.getElementById('f03-rep-strip')"
                  ".addEventListener('micro-info-peek:change', () => window.__ev++); }")
    # فهرس غير صفري (شريط التقارير بطاقتان)
    page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('f03-rep-strip'), 1)")
    page.wait_for_timeout(600)
    g0 = page.evaluate(PEEK_GEO, "#f03-rep-strip")
    t.check("standalone/baseline دخول بالمزوّد التجريبي → التقارير → goTo(1): البطاقة النشطة موسّطة عند عرض الحاضنة الافتراضي",
            centered(g0) and g0["index"] == 1, fmt(g0))
    page.screenshot(path=str(shots / f"{stage}-standalone-reports-baseline.png"))

    # ---- الفحص 8: دورة disconnect/init كاملة مع تغيّر عرض الحاضنة عبر evaluate ----
    page.evaluate("() => window.__ev = 0")
    page.evaluate("() => window.MicroInfoPeek.disconnect(document)")
    page.evaluate("() => window.MicroInfoPeek.init(document)")
    page.evaluate("() => document.getElementById('f03-rep-strip').style.width = '360px'")
    page.wait_for_timeout(800)
    g1 = page.evaluate(PEEK_GEO, "#f03-rep-strip")
    ev = page.evaluate("() => window.__ev")
    t.check("standalone/cycle دورة disconnect → init → عرض الحاضنة 360 (تغيير style.width عبر evaluate في file://): البطاقة النشطة موسّطة ±1px والفهرس محفوظ والعرض تغيّر فعلًا",
            centered(g1) and g1["index"] == 1 and g1["vpW"] > 350, fmt(g1))
    t.check("standalone/zero-events صفر أحداث micro-info-peek:change أثناء مزامنة إعادة التوسيط",
            ev == 0, f"events={ev}")
    ro = page.evaluate(RO_STATS, "#f03-rep-strip [data-info-strip-viewport]")
    t.check("standalone/observer مراقب نشط واحد بالضبط لهدف viewport شريط التقارير (بقية RO للصفحة لا تستهدفه — لا يتيم لهذا الهدف)",
            ro["activeOnViewport"] == 1, json.dumps(ro, ensure_ascii=False))
    t.record("standalone/observer stats", ro)
    page.screenshot(path=str(shots / f"{stage}-standalone-reports-after-cycle.png"))
    ctx.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", required=True, choices=["before", "after"])
    ap.add_argument("--browser", default=str(EVIDENCE_BIN))
    ap.add_argument("--out", default=str(OUT_DEFAULT))
    ap.add_argument("--port", type=int, default=4420)
    args = ap.parse_args()

    out = Path(args.out)
    shots = out / "screenshots"
    shots.mkdir(parents=True, exist_ok=True)
    base, srv = serve_repo(args.port)
    t = Tool(out, args.tag)
    t.log(f"# فحص الوكيل 2 — SAMSUNG-ONEUI-REPAIR-R2 — SUI-R1-02 — tag={args.tag} — {datetime.now().isoformat(timespec='seconds')}")
    t.log(f"# الخادم: {base} (نطاق الوكيل 2: 4420-4439) — meta: {json.dumps(git_meta(), ensure_ascii=False)}")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.browser, headless=True)
        t.browser_version = browser.version
        t.log(f"# المتصفح: {browser.version}")

        run_component_section(t, browser, base, args.tag, PEEK_CFG, errors, shots)
        run_component_section(t, browser, base, args.tag, CAR_CFG, errors, shots)
        run_standalone_section(t, browser, args.tag, errors, shots)

        browser.close()
    srv.shutdown()

    # ---- الفحص 9: صفر أخطاء صفحة عبر كل الجلسات ----
    t.check("page-errors صفر أخطاء صفحة عبر كل الجلسات (peek + carousel + standalone)",
            len(errors) == 0, json.dumps(errors[:6], ensure_ascii=False))

    ok = t.finish()
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
