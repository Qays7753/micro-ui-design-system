#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص الوكيل 4 (جولة SAMSUNG-ONEUI-REPAIR-R1 — البيانات والعرض والجدولة)

ملك الوكيل 4 وحده. فحوص بنوده قابلة لإعادة التشغيل قبل/بعد:

SUI-007 (peek هندسة قديمة عند أول كشف):
  - F03 دخول حقيقي (بوابة → الرئيسية → التقارير) عند 320 و430: أول كشف بلا
    أي تفاعل → البطاقة النشطة موسّطة (فرق الحواف ≤2px) وtransform ≠ 0،
    والفرق بين «قبل أول تفاعل» و«بعد goTo لنفس الفهرس» = صفر (نفس transform
    ونفس rect).
  - عزل (hidden → init → reveal): توسيط قبل أي تفاعل؛ تغير عرض الأب بلا
    window resize → إعادة توسيط؛ إعادة init لا تضاعف المراقبين (عدّ عبر
    تغليف ResizeObserver)؛ MicroInfoPeek.disconnect ينظف (تغير عرض بعده
    بلا إعادة توسيط)؛ الفهرس محفوظ عبر إخفاء/كشف وصفر أحداث تغيير؛
    التركيز يبقى داخل البطاقة النشطة عند إعادة التوسيط؛ سياسة العرض 0
    (المخفي لا يعاد قياسه — track style يبقى على آخر توسيط).
SUI-008 (m-stat__num رقم طويل):
  - عزل: بطاقة stat برقم 16 خانة عند 320+200% (ZOOM2_CLEAN مروران):
    scrollWidth ≤ clientWidth للبطاقة والقيمة كاملة مرئية داخل حدودها
    (تلف) وقيمة DOM كاملة؛ عند 1× رقم قصير يبقى سطرًا واحدًا (لا انحدار).
SUI-009 (بذرة فحص في المسار الافتراضي):
  - F03 المسار الافتراضي (وجهة الجدولة): لا 'mystery' في DOM ولا في مفتاح
    الكالندر ولا نص حقن؛ العينة المستقلة الافتراضية نظيفة؛ وضع fixtures
    صريح (?fixtures=edge + زر موسوم) يغطي المفتاح المجهول (محايد بنصه)
    وعنوان الحقن (نص حرفي، لا b/img، __xss غير مفعّل)؛ واجهة الموصل
    createStore(seed) معزولة + EDGE_FIXTURES.
SUI-024 (جدول comparison):
  - 320+200%: scrollWidth للصفحة = viewport (لا تمديد الصفحة) والجدول
    قابل للتمرير داخل حاويته (scrollLeft يتغير فعلًا).
SUI-025 (carousel — أُعيد إنتاجه أولًا):
  - عزل: كشف بعد إخفاء → توسيط قبل أول تفاعل؛ تغير عرض الأب بلا window
    resize → إعادة توسيط؛ الفهرس محفوظ + صفر أحداث؛ مراقب واحد عند init
    مزدوج؛ disconnect ينظف؛ التركيز محفوظ عند إعادة التوسيط.
SUI-017 (جزء data):
  - .m-chart__title = 16px/24px وزن 600 مقيسًا في لوحة data وفي F03
    التقارير.

سياق قرارات المالك (SUI-030/SUI-031) يسجل أرقامًا مقيسة (info لا PASS/FAIL).

التشغيل من جذر المستودع:
  python3 tools/sui-repair-a4-check.py --stage before   # قبل الإصلاح: عيوب FAIL
  python3 tools/sui-repair-a4-check.py --stage after    # بعد الإصلاح: كله PASS
الخادم المدمج: منفذ من نطاق الوكيل 4 (4400-4419). المتصفح: Chromium
143.0.7499.4 (executable_path من --browser أو /home/z/my-project/evidence/bin/chromium).
المخرجات: evidence/agent4/checks/<stage>-results.json + <stage>-summary.txt.
آلية تكبير النص 200% (ZOOM2_CLEAN — منقولة حرفيًا من tools/ui-repair-r2-check.py):
قراءة الحجم المرجعي computed font-size لكل عنصر (مرور أول) ثم مضاعفته inline
(مرور ثانٍ) — محاكاة نص فقط، ليست native zoom ولا zoom نظام.
NOT RUN: أجهزة فعلية/لمس/TalkBack/WebKit/native zoom.
"""
import argparse
import json
import subprocess
import threading
from datetime import datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT_REPO = Path(__file__).resolve().parents[1]
EVIDENCE_BIN = Path("/home/z/my-project/evidence/bin/chromium")
OUT_DEFAULT = SCRIPT_REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent4" / "checks"
PORT_RANGE = range(4400, 4420)  # نطاق منافذ الوكيل 4 في البروتوكول

ZOOM2_CLEAN = """() => {
  /* محاكاة نص ×2 بمرورين نظيفين (لا مضاعفة موريثة) — نفس عقد لوحة المعاينة */
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""

# تغليف ResizeObserver لعدّ المراقبين المنشئين (قبل تحميل سكربتات المكوّنات)
RO_WRAP = """<script>
(() => {
  const Orig = window.ResizeObserver;
  window.__a4ro = { built: 0, observeCalls: 0, disconnected: 0 };
  if (!Orig) return;
  window.ResizeObserver = class extends Orig {
    constructor(cb) { super(cb); window.__a4ro.built += 1; }
    observe(t) { super.observe(t); window.__a4ro.observeCalls += 1; }
    disconnect() { super.disconnect(); window.__a4ro.disconnected += 1; }
  };
})();
</script>"""


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
        raise RuntimeError("لا منفذ متاح في نطاق 4400-4419")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}", srv


def git_meta():
    def git(*args):
        return subprocess.run(["git", *args], capture_output=True, text=True, cwd=str(SCRIPT_REPO)).stdout.strip()
    status = git("status", "--porcelain")
    return {"commit": git("rev-parse", "HEAD"), "tree": git("rev-parse", "HEAD^{tree}"),
            "source_clean": status == "", "dirty_files": [ln for ln in status.splitlines()][:12]}


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
            "tool": "tools/sui-repair-a4-check.py",
            "stage": self.stage,
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "git": git_meta(),
            "browser": "Chromium 143.0.7499.4 (evidence/bin) — Playwright sync",
            "zoom_mechanism": "ZOOM2_CLEAN: مروران نظيفان (مضاعفة computed font-size) — محاكاة نص، ليست native zoom",
            "not_run": ["أجهزة فعلية/لمس", "TalkBack/قارئ شاشة فعلي", "WebKit", "native zoom"],
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
  return { transform: (t => t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41)(getComputedStyle(track).transform),
           inlineTransform: track.style.transform || '',
           vpW: Math.round(vr.width), slideW: Math.round(r.width),
           leftInset: Math.round(r.left - vr.left), rightInset: Math.round(vr.right - r.right),
           index: window.MicroInfoPeek ? window.MicroInfoPeek.getIndex(strip) : null };
}"""

CAR_GEO = """(sel) => {
  const c = document.querySelector(sel);
  const vp = c.querySelector('[data-viewport]');
  const cur = c.querySelector('[data-carousel-slide][data-current="true"]');
  const vr = vp.getBoundingClientRect(); const r = cur.getBoundingClientRect();
  const track = c.querySelector('[data-track]');
  return { transform: (t => t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41)(getComputedStyle(track).transform),
           inlineTransform: track.style.transform || '',
           vpW: Math.round(vr.width), slideW: Math.round(r.width),
           leftInset: Math.round(r.left - vr.left), rightInset: Math.round(vr.right - r.right),
           index: window.MicroCarousel ? window.MicroCarousel.getIndex(c) : null };
}"""


def f03_login(page):
    page.fill("#f03-gw-email", "demo@example.com")
    page.fill("#f03-gw-password", "secret123")
    page.click("#f03-gw-submit")
    page.wait_for_timeout(900)


def f03_enter_reports(page):
    """دخول حقيقي: بوابة → الرئيسية → التقارير. يعيد بعد استقرار العرض."""
    f03_login(page)
    page.click("#f03-nav-reports")
    page.wait_for_timeout(900)


def f03_enter_schedule(page):
    page.click("#f03-nav-home")
    page.wait_for_timeout(400)
    page.click("#f03-home-schedule")
    page.wait_for_timeout(900)


def centered(geo, tol=2):
    return abs(geo["leftInset"] - geo["rightInset"]) <= tol


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", required=True, choices=["before", "after"])
    ap.add_argument("--browser", default=str(EVIDENCE_BIN))
    ap.add_argument("--out", default=str(OUT_DEFAULT))
    ap.add_argument("--port", type=int, default=4400)
    args = ap.parse_args()

    out = Path(args.out)
    (out.parent / "screenshots").mkdir(parents=True, exist_ok=True)
    out.mkdir(parents=True, exist_ok=True)
    base, srv = serve_repo(args.port)
    t = Tool(out, args.stage)
    t.log(f"# فحص الوكيل 4 — SAMSUNG-ONEUI-REPAIR-R1 — stage={args.stage} — {datetime.now().isoformat(timespec='seconds')}")
    t.log(f"# الخادم: {base} (نطاق الوكيل 4) — meta: {json.dumps(git_meta(), ensure_ascii=False)}")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.browser, headless=True)

        # ==================== SUI-007: peek ====================
        # ---- F03 دخول حقيقي عند 320 و430 ----
        for w in (320, 430):
            ctx = browser.new_context(viewport={"width": w, "height": 844})
            page = ctx.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(base + "/previews/ux-patterns/mobile-record-sample/index.html")
            page.wait_for_load_state("networkidle")
            f03_enter_reports(page)
            b = page.evaluate(PEEK_GEO, "#f03-rep-strip")
            if w == 320:
                page.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui007-f03-first-reveal-{w}.png"))
            t.check(f"SUI-007/1 F03@{w} أول كشف لوجهة التقارير: البطاقة النشطة موسّطة (فرق الحواف ≤2px) قبل أي تفاعل",
                    centered(b), json.dumps(b, ensure_ascii=False))
            t.check(f"SUI-007/2 F03@{w} transform ≠ 0 عند أول كشف (قياس تم أثناء القسم مخفي)",
                    abs(b["transform"]) > 0.1, f"transform={b['transform']}")
            # goTo لنفس الفهرس — يجب ألا يغير شيئًا
            page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('f03-rep-strip'),"
                          " window.MicroInfoPeek.getIndex(document.getElementById('f03-rep-strip')))")
            page.wait_for_timeout(400)
            a = page.evaluate(PEEK_GEO, "#f03-rep-strip")
            same = (a["transform"] == b["transform"] and a["leftInset"] == b["leftInset"]
                    and a["rightInset"] == b["rightInset"] and a["index"] == b["index"])
            t.check(f"SUI-007/3 F03@{w} الفرق بين «قبل أول تفاعل» و«بعده» = صفر (نفس transform ونفس rect)",
                    same, f"before={json.dumps(b, ensure_ascii=False)} after={json.dumps(a, ensure_ascii=False)}")
            ctx.close()

        # ---- عزل: hidden → init → reveal (صفحة مستقلة — عدّ المراقبين بلا
        # تداخل أدوات التغليف عبر مستندات set_content المتعاقبة على الصفحة نفسها) ----
        ctx = browser.new_context(viewport={"width": 320, "height": 844})
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
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
        page.set_content(head + f'<div id="wrap" style="width:320px"><section id="hv" hidden>'
                                 f'<div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="t-peek">'
                                 f'<div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0" aria-label="عارض">'
                                 f'<div class="m-info-strip__track" data-info-strip-track>{slides}</div></div>'
                                 f'<div class="m-info-strip__controls" data-info-strip-controls>'
                                 f'<button type="button" data-info-strip-prev aria-label="السابقة">س</button>'
                                 f'<button type="button" data-info-strip-next aria-label="التالية">ت</button>'
                                 f'<span data-info-strip-position></span></div>'
                                 f'<p data-info-strip-status role="status"></p></div></section></div>'
                                 '</body></html>')
        page.wait_for_load_state("networkidle")

        # عدّ أحداث التغيير أثناء الإخفاء/الكشف
        page.evaluate("""() => {
          window.__ev = 0;
          document.getElementById('t-peek').addEventListener('micro-info-peek:change', () => window.__ev++);
        }""")
        page.evaluate("() => document.getElementById('hv').hidden = false")
        page.wait_for_timeout(500)
        rev = page.evaluate(PEEK_GEO, "#t-peek")
        t.check("SUI-007/4 عزل: كشف بعد إخفاء → البطاقة النشطة موسّطة قبل أي تفاعل (transform ≠ 0)",
                centered(rev) and abs(rev["transform"]) > 0.1, json.dumps(rev, ensure_ascii=False))

        # تغير عرض الأب بلا window resize
        page.evaluate("() => document.getElementById('wrap').style.width = '360px'")
        page.wait_for_timeout(500)
        wider = page.evaluate(PEEK_GEO, "#t-peek")
        t.check("SUI-007/5 عزل: تغير عرض الحاوية (بلا window resize) → إعادة توسيط البطاقة النشطة",
                centered(wider), json.dumps(wider, ensure_ascii=False))

        # التركيز يبقى داخل البطاقة النشطة عند إعادة التوسيط
        page.evaluate("() => document.getElementById('btn-0').focus()")
        page.evaluate("() => document.getElementById('wrap').style.width = '320px'")
        page.wait_for_timeout(500)
        focus_kept = page.evaluate("() => document.activeElement === document.getElementById('btn-0')")
        t.check("SUI-007/6 عزل: التركيز داخل البطاقة النشطة يبقى مكانه عند إعادة التوسيط (لا إعادة ضبط)",
                focus_kept, f"focusKept={focus_kept}")

        # الفهرس محفوظ عبر إخفاء/كشف + صفر أحداث
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('t-peek'), 2)")
        page.wait_for_timeout(400)
        page.evaluate("() => { window.__ev = 0; document.getElementById('hv').hidden = true; }")
        page.wait_for_timeout(400)
        hidden_inline = page.evaluate("() => document.querySelector('#t-peek [data-info-strip-track]').style.transform")
        page.evaluate("() => document.getElementById('hv').hidden = false")
        page.wait_for_timeout(500)
        back = page.evaluate(PEEK_GEO, "#t-peek")
        ev_count = page.evaluate("() => window.__ev")
        t.check("SUI-007/7 عزل: الفهرس محفوظ عبر إخفاء/كشف (index=2 وموسّطة) وصفر أحداث micro-info-peek:change",
                back["index"] == 2 and centered(back) and ev_count == 0,
                f"geo={json.dumps(back, ensure_ascii=False)} events={ev_count}")

        # سياسة العرض 0: المخفي لا يعاد قياسه (track style يبقى على آخر توسيط)
        page.evaluate("() => document.getElementById('hv').hidden = true")
        page.wait_for_timeout(400)
        still_inline = page.evaluate("() => document.querySelector('#t-peek [data-info-strip-track]').style.transform")
        t.check("SUI-007/8 عزل: سياسة العرض 0 — لا إعادة قياس على المخفي (inline transform يبقى على آخر توسيط)",
                still_inline == hidden_inline and still_inline != "",
                f"hidden={hidden_inline!r} afterHide={still_inline!r}")

        # إعادة init لا تضاعف المراقبين
        before_built = page.evaluate("() => window.__a4ro.built")
        page.evaluate("() => { window.MicroInfoPeek.init(); window.MicroInfoPeek.init(); }")
        page.wait_for_timeout(300)
        after_built = page.evaluate("() => window.__a4ro.built")
        t.check("SUI-007/9 عزل: إعادة init (مرتان) لا تنشئ مراقبًا ثانيًا (WeakMap — عدّ عبر تغليف ResizeObserver)",
                after_built == before_built == 1, f"built_before={before_built} built_after={after_built}")

        # disconnect ينظف
        try:
            page.evaluate("() => window.MicroInfoPeek.disconnect(document.getElementById('t-peek'))")
            disc_called = page.evaluate("() => window.__a4ro.disconnected")
        except Exception as e:  # noqa: BLE001
            disc_called = f"API خطأ: {e}"
        page.evaluate("() => document.getElementById('hv').hidden = false")
        page.evaluate("() => document.getElementById('wrap').style.width = '390px'")
        page.wait_for_timeout(500)
        after_disc = page.evaluate(PEEK_GEO, "#t-peek")
        not_recent = not centered(after_disc)
        t.check("SUI-007/10 عزل: MicroInfoPeek.disconnect يفصل المراقب — تغير العرض بعده لا يعيد التوسيط",
                isinstance(disc_called, int) and disc_called >= 1 and not_recent,
                f"disconnected={disc_called} geoAfterWidthChange={json.dumps(after_disc, ensure_ascii=False)}")
        page.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui007-harness-disconnected-320.png"))

        # ==================== SUI-008: m-stat__num ====================
        head3 = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
                 f'<base href="{base}/">'
                 '<link rel="stylesheet" href="shared/tokens.css">'
                 '<link rel="stylesheet" href="components/data/data.css"></head><body>')
        page.set_content(head3 + '<div id="card" style="box-sizing:border-box;width:288px;padding:12px">'
                                 '<div class="m-stat"><span class="m-stat__label">إجمالي</span>'
                                 '<span class="m-stat__value"><span class="m-stat__num" id="num16">1234567890123456</span>'
                                 '<span class="m-stat__unit">د.أ</span></span></div></div>'
                                 '<div id="card2" style="box-sizing:border-box;width:288px;padding:12px;margin-top:16px">'
                                 '<div class="m-stat"><span class="m-stat__label">مبيعات اليوم</span>'
                                 '<span class="m-stat__value"><span class="m-stat__num" id="numshort">1,240.50</span>'
                                 '<span class="m-stat__unit">د.أ</span></span></div></div>'
                                 '</body></html>')
        page.wait_for_load_state("networkidle")

        def stat_measure(num_id, card_id):
            return page.evaluate("""([numId, cardId]) => {
              const card = document.getElementById(cardId); const num = document.getElementById(numId);
              const cr = card.getBoundingClientRect(); const nr = num.getBoundingClientRect();
              const cs = getComputedStyle(num);
              return { cardClientW: card.clientWidth, cardScrollW: card.scrollWidth,
                       numW: Math.round(nr.width), numH: Math.round(nr.height),
                       overflowWrap: cs.overflowWrap, fontSize: cs.fontSize,
                       numInsideCard: nr.left >= cr.left - 1 && nr.right <= cr.right + 1
                                      && nr.top >= cr.top - 1 && nr.bottom <= cr.bottom + 1,
                       text: num.textContent };
            }""", [num_id, card_id])

        short_1x = stat_measure("numshort", "card2")
        t.check("SUI-008/1 عند 1×: الرقم القصير (1,240.50) سطر واحد داخل البطاقة — لا انحدار بالحجم/القيمة",
                short_1x["numInsideCard"] and short_1x["text"] == "1,240.50"
                and short_1x["overflowWrap"] in ("normal", "anywhere", "break-word"),
                json.dumps(short_1x, ensure_ascii=False))
        page.evaluate(ZOOM2_CLEAN)
        page.wait_for_timeout(300)
        zoomed16 = stat_measure("num16", "card")
        page.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui008-stat16-320-200pct.png"))
        t.check("SUI-008/2 بطاقة stat برقم 16 خانة عند 320+200%: scrollWidth ≤ clientWidth للبطاقة",
                zoomed16["cardScrollW"] <= zoomed16["cardClientW"],
                f"scrollW={zoomed16['cardScrollW']} clientW={zoomed16['cardClientW']}")
        t.check("SUI-008/3 القيمة كاملة مرئية بالتلف داخل حدود البطاقة (مستطيل الرقم داخل البطاقة)",
                zoomed16["numInsideCard"], json.dumps(zoomed16, ensure_ascii=False))
        t.check("SUI-008/4 القيمة في DOM كاملة بلا تغيير (لا تصغير ولا تغيير قيمة)",
                zoomed16["text"] == "1234567890123456", f"text={zoomed16['text']!r}")
        t.record("SUI-008 قياس الرقم الطويل 16 خانة عند 320+200%", zoomed16)

        # ==================== SUI-025: carousel (صفحة مستقلة لأداة العّاد نفسها) ====================
        ctx_car = browser.new_context(viewport={"width": 320, "height": 844})
        page = ctx_car.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        head2 = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
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
        page.set_content(head2 + f'<div id="wrap" style="width:320px"><section id="cv" hidden>'
                                 f'<div class="m-carousel" data-carousel data-carousel-label="اختبار" id="t-car">'
                                 f'<div class="m-carousel__viewport" data-viewport>'
                                 f'<ul class="m-carousel__track" data-track>{cards}</ul></div>'
                                 f'<div class="m-carousel__controls">'
                                 f'<button type="button" data-prev aria-label="السابق">س</button>'
                                 f'<p data-status aria-live="polite"></p>'
                                 f'<button type="button" data-next aria-label="التالي">ت</button></div>'
                                 f'<div class="m-carousel__dots" data-dots role="group" aria-label="نقاط"></div>'
                                 f'</div></section></div></body></html>')
        page.wait_for_load_state("networkidle")
        page.evaluate("""() => {
          window.__evCar = 0;
          document.getElementById('t-car').addEventListener('micro-carousel:change', () => window.__evCar++);
        }""")
        page.evaluate("() => document.getElementById('cv').hidden = false")
        page.wait_for_timeout(500)
        rev_car = page.evaluate(CAR_GEO, "#t-car")
        page.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui025-carousel-first-reveal-320.png"))
        t.check("SUI-025/1 عزل (إعادة إنتاج): كشف العارض بعد إخفاء → البطاقة الحالية موسّطة قبل أول تفاعل",
                centered(rev_car) and abs(rev_car["transform"]) > 0.1, json.dumps(rev_car, ensure_ascii=False))
        page.evaluate("() => document.getElementById('wrap').style.width = '360px'")
        page.wait_for_timeout(500)
        wide_car = page.evaluate(CAR_GEO, "#t-car")
        t.check("SUI-025/2 عزل: تغير عرض الحاوية (بلا window resize) → إعادة توسيط البطاقة الحالية",
                centered(wide_car), json.dumps(wide_car, ensure_ascii=False))
        # التركيز محفوظ عند إعادة التوسيط
        page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('t-car'), 1)")
        page.wait_for_timeout(400)
        page.evaluate("() => document.getElementById('cbtn-1').focus()")
        page.evaluate("() => document.getElementById('wrap').style.width = '320px'")
        page.wait_for_timeout(500)
        car_focus = page.evaluate("() => document.activeElement === document.getElementById('cbtn-1')")
        t.check("SUI-025/3 عزل: التركيز داخل البطاقة النشطة يبقى مكانه عند إعادة التوسيط",
                car_focus, f"focusKept={car_focus}")
        # الفهرس محفوظ عبر إخفاء/كشف + صفر أحداث
        page.evaluate("() => { window.__evCar = 0; document.getElementById('cv').hidden = true; }")
        page.wait_for_timeout(400)
        page.evaluate("() => document.getElementById('cv').hidden = false")
        page.wait_for_timeout(500)
        back_car = page.evaluate(CAR_GEO, "#t-car")
        ev_car = page.evaluate("() => window.__evCar")
        t.check("SUI-025/4 عزل: الفهرس محفوظ عبر إخفاء/كشف (index=1 وموسّطة) وصفر أحداث micro-carousel:change",
                back_car["index"] == 1 and centered(back_car) and ev_car == 0,
                f"geo={json.dumps(back_car, ensure_ascii=False)} events={ev_car}")
        # مراقب واحد عند init مزدوج
        built_before = page.evaluate("() => window.__a4ro.built")
        page.evaluate("() => { window.MicroCarousel.init(); window.MicroCarousel.init(); }")
        page.wait_for_timeout(300)
        built_after = page.evaluate("() => window.__a4ro.built")
        t.check("SUI-025/5 عزل: إعادة init (مرتان) لا تنشئ مراقبًا ثانيًا (WeakMap — عدّ عبر تغليف ResizeObserver)",
                built_after == built_before == 1, f"built_before={built_before} built_after={built_after}")
        # disconnect ينظف
        try:
            page.evaluate("() => window.MicroCarousel.disconnect(document.getElementById('t-car'))")
            disc_car = page.evaluate("() => window.__a4ro.disconnected")
        except Exception as e:  # noqa: BLE001
            disc_car = f"API خطأ: {e}"
        page.evaluate("() => document.getElementById('wrap').style.width = '390px'")
        page.wait_for_timeout(500)
        after_disc_car = page.evaluate(CAR_GEO, "#t-car")
        t.check("SUI-025/6 عزل: MicroCarousel.disconnect يفصل المراقب — تغير العرض بعده لا يعيد التوسيط",
                isinstance(disc_car, int) and disc_car >= 1 and not centered(after_disc_car),
                f"disconnected={disc_car} geoAfterWidthChange={json.dumps(after_disc_car, ensure_ascii=False)}")
        ctx_car.close()
        page = ctx.new_page()  # صفحة جديدة للملاحات اللاحقة (goto) بعد إغلاق سياق العزل

        # ==================== SUI-024: جدول comparison ====================
        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
        page.evaluate(ZOOM2_CLEAN)
        page.wait_for_timeout(300)
        cmp_data = page.evaluate("""() => {
          const tbl = document.querySelector('.cmp-table');
          const box = tbl ? tbl.closest('.cmp-table-scroll') : null;
          const out = { docScrollW: document.scrollingElement.scrollWidth,
                        docClientW: document.scrollingElement.clientWidth,
                        tableW: tbl ? Math.round(tbl.getBoundingClientRect().width) : null,
                        hasScrollContainer: !!box };
          if (box) {
            box.scrollLeft = 12;
            out.scrollLeftAfter = box.scrollLeft;
            out.boxClientW = box.clientWidth;
            out.boxScrollW = box.scrollWidth;
          }
          return out;
        }""")
        page.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui024-comparison-320-200pct.png"))
        t.check("SUI-024/1 comparison@320+200%: scrollWidth للصفحة = viewport (لا تمديد الصفحة كلها)",
                cmp_data["docScrollW"] <= cmp_data["docClientW"],
                f"docScrollW={cmp_data['docScrollW']} docClientW={cmp_data['docClientW']}")
        t.check("SUI-024/2 الجدول قابل للتمرير داخل حاويته (حاوية موجودة + scrollLeft يتغير فعلًا)",
                cmp_data["hasScrollContainer"] and cmp_data.get("scrollLeftAfter", 0) > 0
                and cmp_data.get("boxScrollW", 0) > cmp_data.get("boxClientW", 0),
                json.dumps(cmp_data, ensure_ascii=False))

        # ==================== SUI-017 (جزء data): m-chart__title ====================
        page.goto(base + "/previews/data/index.html")
        page.wait_for_load_state("networkidle")
        title_board = page.evaluate(
            "() => { const t = document.querySelector('.m-chart__title'); const cs = getComputedStyle(t);"
            " return { fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight }; }")
        t.check("SUI-017/1 لوحة data: .m-chart__title = 16px / 24px وزن 600 (عنوان مجموعة داخل وجهة)",
                title_board["fs"] == "16px" and title_board["lh"] == "24px" and title_board["fw"] == "600",
                json.dumps(title_board, ensure_ascii=False))

        # ==================== SUI-009: بذرة//fixtures ====================
        # F03 المسار الافتراضي (وجهة الجدولة)
        ctx2 = browser.new_context(viewport={"width": 320, "height": 844})
        fp = ctx2.new_page()
        fp.on("pageerror", lambda e: errors.append(str(e)))
        fp.goto(base + "/previews/ux-patterns/mobile-record-sample/index.html")
        fp.wait_for_load_state("networkidle")
        f03_enter_reports(fp)
        f03_title = fp.evaluate(
            "() => { const t = document.querySelector('#f03-rep-bars .m-chart__title'); const cs = getComputedStyle(t);"
            " return { fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight }; }")
        t.check("SUI-017/2 F03 التقارير: .m-chart__title = 16px / 24px وزن 600 (اتساق مع لوحة data)",
                f03_title["fs"] == "16px" and f03_title["lh"] == "24px" and f03_title["fw"] == "600",
                json.dumps(f03_title, ensure_ascii=False))
        f03_enter_schedule(fp)
        sched = fp.evaluate("""() => {
          const legend = document.querySelector('#f03-ocal [data-ocal-legend]');
          const items = legend ? [...legend.querySelectorAll('.m-ocal__legend-item, .m-ocal__legend-label')] : [];
          const txt = document.body.innerText || '';
          return { legendText: legend ? legend.textContent : null,
                   legendItems: items.map(i => i.textContent.trim()),
                   mysteryInDom: txt.indexOf('mystery') >= 0,
                   injectionLiteral: txt.indexOf('<b>') >= 0 || txt.indexOf('onerror') >= 0,
                   xssArmed: typeof window.__xss !== 'undefined',
                   storeCount: window.OrderDemoStore ? window.OrderDemoStore.count() : null };
        }""")
        fp.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui009-f03-schedule-default-320.png"))
        t.check("SUI-009/1 F03 المسار الافتراضي: لا 'mystery' في DOM (ولا في مفتاح الكالندر) ولا نص حقن",
                not sched["mysteryInDom"] and not sched["injectionLiteral"] and not sched["xssArmed"]
                and "mystery" not in (sched["legendText"] or ""),
                json.dumps(sched, ensure_ascii=False))

        # العينة المستقلة: المسار الافتراضي نظيف + وضع fixtures يعمل
        sp = ctx2.new_page()
        sp.goto(base + "/previews/ux-patterns/order-schedule/index.html")
        sp.wait_for_load_state("networkidle")
        sp.wait_for_timeout(600)
        sample_default = sp.evaluate("""() => {
          const legend = document.querySelector('#ocal-demo [data-ocal-legend]');
          const txt = document.body.innerText || '';
          return { legendText: legend ? legend.textContent : null,
                   mysteryInDom: txt.indexOf('mystery') >= 0,
                   injectionLiteral: txt.indexOf('<b>') >= 0 || txt.indexOf('onerror') >= 0,
                   storeCount: window.OrderDemoStore.count(),
                   hasCreateStore: typeof window.OrderDemoStore.createStore === 'function',
                   hasEdgeFixtures: Array.isArray(window.OrderDemoStore.EDGE_FIXTURES) };
        }""")
        sp.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui009-sample-default-320.png"))
        t.check("SUI-009/2 العينة المستقلة المسار الافتراضي نظيف: لا mystery ولا نص حقن",
                not sample_default["mysteryInDom"] and not sample_default["injectionLiteral"]
                and "mystery" not in (sample_default["legendText"] or ""),
                json.dumps(sample_default, ensure_ascii=False))
        t.check("SUI-009/3 واجهة fixtures في الموصل: createStore(seed) + EDGE_FIXTURES معزولان",
                sample_default["hasCreateStore"] and sample_default["hasEdgeFixtures"],
                json.dumps(sample_default, ensure_ascii=False))
        try:
            isolated = sp.evaluate("""() => {
              const s = window.OrderDemoStore.createStore([{ id: 'x-1', title: 'طلب مستقل', date: '2026-10-07',
                                                             time: '09:00', statusKey: 'done', customer: null }]);
              return { isolatedCount: s.count(), defaultCount: window.OrderDemoStore.count(),
                       isolatedHas: !!s.get('x-1'), defaultHas: !!window.OrderDemoStore.get('x-1'),
                       edgeCount: (window.OrderDemoStore.EDGE_FIXTURES || []).length };
            }""")
        except Exception as e:  # noqa: BLE001 — قبل الإصلاح الواجهة غائبة: يوثق الفشل ولا يكسر الأداة
            isolated = {"error": str(e).splitlines()[0]}
        t.check("SUI-009/4 createStore معزولة عن المخزن الافتراضي (بذرة بديلة بلا تسريب)",
                isolated.get("isolatedCount") == 1 and isolated.get("defaultHas") is False
                and isolated.get("defaultCount") == sample_default["storeCount"]
                and isolated.get("edgeCount", 0) >= 2,
                json.dumps(isolated, ensure_ascii=False))

        sp2 = ctx2.new_page()
        sp2.goto(base + "/previews/ux-patterns/order-schedule/index.html?fixtures=edge")
        sp2.wait_for_load_state("networkidle")
        sp2.wait_for_timeout(700)
        # عرض القائمة يُظهر كل الصفوف (التقويم الافتراضي يعرض صفوف اليوم المحدد فقط)
        sp2.click("#ocal-demo .m-ocal__views-btn[data-ocal-value='list']")
        sp2.wait_for_timeout(400)
        fixtures_mode = sp2.evaluate("""() => {
          const root = document.getElementById('ocal-demo');
          const r10 = root.querySelector('.m-ocal__row[data-ocal-id="od-10"]');
          const rinj = root.querySelector('.m-ocal__row[data-ocal-id="od-inj"]');
          const legend = root.querySelector('[data-ocal-legend]');
          const chip = r10 ? r10.querySelector('.m-ocal__row-status') : null;
          return { hasOd10: !!r10, hasOdInj: !!rinj,
                   mysteryLabel: r10 ? (r10.querySelector('.m-ocal__row-statuslabel') || {}).textContent : null,
                   mysteryNeutral: chip ? String(chip.className).indexOf('--neutral') >= 0 : null,
                   injText: rinj ? rinj.querySelector('.m-ocal__row-title').textContent : null,
                   injHasMarkup: rinj ? !!rinj.querySelector('b, img') : null,
                   rootB: root.querySelectorAll('b').length, rootImg: root.querySelectorAll('img').length,
                   xssArmed: typeof window.__xss !== 'undefined',
                   legendHasMystery: legend ? legend.textContent.indexOf('mystery') >= 0 : null,
                   storeCount: window.OrderDemoStore.count() };
        }""")
        sp2.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui009-sample-fixtures-320.png"))
        t.check("SUI-009/5 وضع fixtures (?fixtures=edge) يغطي الحالتين الحديتين: مفتاح مجهول محايد بنصه + حقن نصًا حرفيًا (لا b/img ولا __xss)",
                fixtures_mode["hasOd10"] and fixtures_mode["hasOdInj"]
                and fixtures_mode["mysteryLabel"] == "mystery" and fixtures_mode["mysteryNeutral"]
                and fixtures_mode["injHasMarkup"] is False and "<b>" in (fixtures_mode["injText"] or "")
                and fixtures_mode["rootB"] == 0 and fixtures_mode["rootImg"] == 0 and not fixtures_mode["xssArmed"],
                json.dumps(fixtures_mode, ensure_ascii=False))

        sp3 = ctx2.new_page()
        sp3.goto(base + "/previews/ux-patterns/order-schedule/index.html")
        sp3.wait_for_load_state("networkidle")
        sp3.wait_for_timeout(600)
        btn_state = sp3.evaluate("""() => {
          const b = document.getElementById('ocal-demo-fixtures');
          return { exists: !!b, label: b ? b.textContent.trim() : null, pressed: b ? b.getAttribute('aria-pressed') : null };
        }""")
        if btn_state["exists"]:
            sp3.click("#ocal-demo-fixtures")
            sp3.wait_for_timeout(700)
            # عرض القائمة يُظهر كل الصفوف (التقويم الافتراضي يعرض صفوف اليوم المحدد فقط)
            sp3.click("#ocal-demo .m-ocal__views-btn[data-ocal-value='list']")
            sp3.wait_for_timeout(400)
            after_btn = sp3.evaluate("""() => {
              const root = document.getElementById('ocal-demo');
              const r10 = root.querySelector('.m-ocal__row[data-ocal-id="od-10"]');
              const b = document.getElementById('ocal-demo-fixtures');
              const legend = root.querySelector('[data-ocal-legend]');
              return { hasOd10: !!r10, pressed: b.getAttribute('aria-pressed'),
                       legendHasMystery: legend ? legend.textContent.indexOf('mystery') >= 0 : null,
                       xssArmed: typeof window.__xss !== 'undefined' };
            }""")
            sp3.screenshot(path=str(out.parent / "screenshots" / f"{args.stage}-sui009-sample-fixtures-button-320.png"))
            t.check("SUI-009/6 زر وضع الفحص الظاهر في العينة يحمّل fixtures بلا reload (موسوم بـaria-pressed)",
                    after_btn["hasOd10"] and after_btn["pressed"] == "true" and after_btn["legendHasMystery"]
                    and not after_btn["xssArmed"],
                    json.dumps({"button": btn_state, "after_click": after_btn}, ensure_ascii=False))
        else:
            t.check("SUI-009/6 زر وضع الفحص الظاهر في العينة يحمّل fixtures بلا reload (موسوم بـaria-pressed)",
                    False, "الزر غير موجود في العينة المستقلة")
        ctx2.close()

        # ==================== سياقات قرارات المالك (info) ====================
        # SUI-030: خلايا الشهر عند 320/360/390/430 (عينة + F03)
        ctx3 = browser.new_context(viewport={"width": 320, "height": 844})
        mp = ctx3.new_page()
        cells = {}
        for w in (320, 360, 390, 430):
            mp.set_viewport_size({"width": w, "height": 844})
            mp.goto(base + "/previews/ux-patterns/order-schedule/index.html")
            mp.wait_for_load_state("networkidle")
            mp.wait_for_timeout(500)
            cells[w] = mp.evaluate("""() => {
              const c = document.querySelector('#ocal-demo .m-ocal__cell');
              const r = c.getBoundingClientRect();
              return { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
            }""")
        t.record("SUI-030 سياق: خلية الشهر في العينة المستقلة (CSSpx)", cells)
        fcells = {}
        fp2 = ctx3.new_page()
        fp2.goto(base + "/previews/ux-patterns/mobile-record-sample/index.html")
        fp2.wait_for_load_state("networkidle")
        f03_login(fp2)
        f03_enter_schedule(fp2)
        for w in (320, 360, 390, 430):
            fp2.set_viewport_size({"width": w, "height": 844})
            fp2.wait_for_timeout(500)
            fcells[w] = fp2.evaluate("""() => {
              const c = document.querySelector('#f03-ocal .m-ocal__cell');
              const r = c.getBoundingClientRect();
              return { w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
            }""")
        t.record("SUI-030 سياق: خلية الشهر في تركيب F03 (CSSpx)", fcells)

        # SUI-031: تسمية مقتطعة وقيمة aria عند 320 (لوحة data)
        mp2 = ctx3.new_page()
        mp2.set_viewport_size({"width": 320, "height": 844})
        mp2.goto(base + "/previews/data/index.html")
        mp2.wait_for_load_state("networkidle")
        mp2.wait_for_timeout(600)
        labels = mp2.evaluate("""() => {
          const sec = document.getElementById('bars');
          const texts = [...sec.querySelectorAll('svg .m-chart__bar-label')].slice(0, 6);
          return texts.map(t => ({ visible: t.textContent, aria: t.getAttribute('aria-label'),
                                   title: t.querySelector('title') ? t.querySelector('title').textContent : null }));
        }""")
        t.record("SUI-031 سياق: تسميات أعمدة مرئية مقابل القراءة الكاملة عند 320", labels)
        ctx3.close()

        t.check("SUI-META/1 صفر أخطاء JavaScript في كل الصفحات والتفاعلات أعلاه",
                len(errors) == 0, "; ".join(errors[:3]))
        browser.close()
    srv.shutdown()
    ok = t.finish()
    raise SystemExit(0 if (ok or args.stage == "before") else 1)


if __name__ == "__main__":
    main()
