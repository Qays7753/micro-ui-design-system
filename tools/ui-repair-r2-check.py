#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص جولة UI-SOURCE-REPAIR-R2 (UI-R2-04)

فحوص سببية لبنود المراجعة الأربعة على المصدر وstandalone معًا:
R2-01 حقول الأرقام: قياس مواضع تحكمات الإدخال نفسها (input/وحدة/زرّا الخطوة)
      مع مبلغ 120.50 وكمية 9999 وخطأ القيمة: تراص القيمة+الكمية عند
      360/390/430 والتفاف حقيقي عند 320 وعند تكبير النص 200% بلا فيض
      ولا قص قراءة، وزرا الخطوة ≥48px.
R2-02 القراءة الفعلية للرسوم: الحجم الفعلي = fontSize × معامل getScreenCTM
      لكل نص bars/line عند 320/360/390/430 ≥ الحد المعلن (13/12)، مع أعداد
      عناصر موجبة قبل all()، وأسماء عربية طويلة وتواريخ ملفوفة قبل/بعد
      تكبير 200% بلا اصطدام ولا قص، والدونات 148 محمية.
R2-03 رسائل المقارنة: نص المستخدم موجز بلا تعليمات مبرمج في كل حالات
      circleItems/barItems، القراءات متاحة عند عدم الرسم، التشخيص في
      data-scale-state/detail على الجذر، يمسح كل render (حتى دون عنصر
      ملاحظة) ولا يبقى بعد invalid→valid على العقدة نفسها.
R2-04 loading الأزرار القصيرة/العريضة RTL/LTR: لا تداخل مؤشر/نص ولا
      ملامسة حافة الزر، بلا حجز حشو ساكن وبثبات الأبعاد.

بيانات أصل الأدلة (metadata): commit/tree/نظافة المصدر/نسخة المتصفح/نوع
التكبير. الإخراج: reviews/UI-SOURCE-REPAIR-R2/verification.{json,txt} +
لقطات screenshots/. خروج غير صفري عند أي فشل.
NOT RUN: منصات فعلية (كما في ux-f03-check) — التكبير محاكاة نص ×2
بمرورين نظيفين (نفس آلية لوحة المعاينة المعتمدة في المشروع)، ليس native zoom.
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
BUTTONS_REL = "previews/buttons/index.html"
WIDTHS = [320, 360, 390, 430]
DECLARED = {"bars": 13.0, "line": 12.0}  # الحد المعلن في data.css (عقد الأدنى)
JARGON = "data-|سمة|سمات|اختر تخطيط|أزل الحد|حدّد قيمة|المستهلك|متكيف|عقد"


def serve_dir(root: Path):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(H, directory=str(root)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}"


def git_meta(root: Path):
    def git(*args):
        return subprocess.run(["git", *args], capture_output=True, text=True, cwd=str(root)).stdout.strip()
    status = git("status", "--porcelain")
    return {
        "commit": git("rev-parse", "HEAD"),
        "tree": git("rev-parse", "HEAD^{tree}"),
        "source_clean": status == "",
        "dirty_sample": [ln for ln in status.splitlines() if SAMPLE_REL in ln][:8],
        "branch": git("rev-parse", "--abbrev-ref", "HEAD"),
    }


class Tool:
    def __init__(self):
        self.results = []
        self.fails = 0

    def check(self, name, ok, detail=""):
        self.results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:500]})
        if not ok:
            self.fails += 1
        print(("[PASS] " if ok else "[FAIL] ") + name + (f" — {detail}" if detail and not ok else ""))

    def summary(self):
        ok = sum(1 for r in self.results if r["ok"])
        return {
            "total": len(self.results),
            "passed": ok,
            "failed": self.fails,
            "not_run": [
                "Samsung Galaxy S25 حقيقي وSamsung Internet ولوحة نظام وسيف إريا واللمس",
                "TalkBack/VoiceOver وقارئ شاشة فعلي",
                "WebKit/Safari وnative zoom (التكبير هنا محاكاة نص ×2 بمرورين نظيفين معلنة)",
            ],
        }


GOTO_FORM = """() => {
  document.getElementById('f03-gw-demo').click();
}"""

FILL_VALUES = """() => {
  const v = document.getElementById('f03-value');
  v.value = '120.50'; v.dispatchEvent(new Event('input', { bubbles: true }));
  const q = document.getElementById('f03-qty');
  q.value = '9999'; q.dispatchEvent(new Event('input', { bubbles: true }));
}"""

# R2-01: قياس تحكمات الإدخال نفسها — مواضع وأحجام لا ارتفاع صف فقط
FIELD_MEASURE = """() => {
  const R = (el) => { const b = el.getBoundingClientRect();
    return { l: +b.left.toFixed(1), t: +b.top.toFixed(1), r: +b.right.toFixed(1),
             b: +b.bottom.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
  const vf = document.getElementById('f03-value-field');
  const qf = document.getElementById('f03-qty-field');
  const vi = document.getElementById('f03-value');
  const qi = document.getElementById('f03-qty');
  const vCtrl = vf.querySelector('.m-field__control');
  const qCtrl = qf.querySelector('.m-field__control');
  const unit = vf.querySelector('.m-field__unit');
  const steps = [...document.querySelectorAll('#f03-qty-field [data-step]')].map(R);
  const vCtrlR = vCtrl.getBoundingClientRect();
  const unitR = unit.getBoundingClientRect();
  const textW = (el, s) => {
    const p = document.createElement('span');
    const cs = getComputedStyle(el);
    p.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:'
      + cs.fontFamily + ';font-size:' + cs.fontSize + ';font-variant-numeric:tabular-nums';
    p.textContent = s; document.body.appendChild(p);
    const w = p.getBoundingClientRect().width; p.remove(); return w;
  };
  return {
    docW: document.documentElement.clientWidth,
    docScrollW: document.documentElement.scrollWidth,
    vf: R(vf), qf: R(qf), vCtrl: R(vCtrl), qCtrl: R(qCtrl),
    vi: R(vi), qi: R(qi), unit: R(unit),
    unitVisible: unitR.width > 8 && vCtrlR.height > 0,
    unitInside: unitR.right <= vCtrlR.right + 0.5 && unitR.left >= vCtrlR.left - 0.5
             && unitR.bottom <= vCtrlR.bottom + 0.5 && unitR.top >= vCtrlR.top - 0.5,
    steps,
    /* مواضع التحكمات: التراص = سطر واحد بح_gap أفقي موجب بين الحقلين */
    controlsSameRow: Math.abs(vCtrlR.top - qCtrl.getBoundingClientRect().top) < 1,
    fieldsGap: Math.max(vf.getBoundingClientRect().left - qf.getBoundingClientRect().right,
                        qf.getBoundingClientRect().left - vf.getBoundingClientRect().right),
    valueTextW: +textW(vi, vi.value || '120.50').toFixed(1),
    qtyTextW: +textW(qi, qi.value || '9999').toFixed(1),
    valueFits: (vi.getBoundingClientRect().width + 0.75) >= textW(vi, vi.value || '120.50'),
    qtyFits: (qi.getBoundingClientRect().width + 0.75) >= textW(qi, qi.value || '9999')
  };
}"""

# R2-02: الأحجام الفعلية عبر getScreenCTM + الاصطدامات + القص الأفقي
CHART_MEASURE = """() => {
  const out = [];
  document.querySelectorAll('.m-chart').forEach((chart) => {
    const plot = chart.querySelector('[data-plot]');
    if (!plot) return;
    const svg = plot.querySelector('svg');
    const plotR = plot.getBoundingClientRect();
    if (!svg || plotR.width === 0) { out.push({ chart: chart.id, hidden: true }); return; }
    const ctm = svg.getScreenCTM();
    const scale = ctm ? ctm.a : null;
    const kind = chart.getAttribute('data-chart');
    const texts = [...svg.querySelectorAll('text')].map((t) => {
      const fs = parseFloat(getComputedStyle(t).fontSize);
      const b = t.getBoundingClientRect();
      return { cls: String(t.getAttribute('class')), fs, eff: scale != null ? +(fs * scale).toFixed(2) : null,
               l: +b.left.toFixed(1), r: +b.right.toFixed(1), t: +b.top.toFixed(1), b2: +b.bottom.toFixed(1),
               txt: (t.textContent || '').slice(0, 14) };
    });
    const coll = [];
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], c = texts[j];
      const ox = Math.min(a.r, c.r) - Math.max(a.l, c.l);
      const oy = Math.min(a.b2, c.b2) - Math.max(a.t, c.t);
      if (ox > 0.5 && oy > 0.5) coll.push({ a: a.txt, b: c.txt, ox: +ox.toFixed(1), oy: +oy.toFixed(1) });
    }
    const outsideH = texts.filter((x) => x.l < plotR.left - 2 || x.r > plotR.right + 2).length;
    out.push({ chart: chart.id, kind, vb: svg.getAttribute('viewBox'),
               plotW: +plotR.width.toFixed(1), plotL: +plotR.left.toFixed(1), plotR: +plotR.right.toFixed(1),
               scale: scale != null ? +scale.toFixed(4) : null,
               nTexts: texts.length, nRects: svg.querySelectorAll('rect').length,
               minEff: texts.length ? Math.min.apply(null, texts.map((x) => x.eff != null ? x.eff : 1e9)) : null,
               effs: [...new Set(texts.map((x) => x.eff).filter((v) => v != null))],
               collisions: coll, outsideH,
               docW: document.documentElement.clientWidth,
               docScrollW: document.documentElement.scrollWidth });
  });
  return out;
}"""

LONG_LABELS = """() => {
  const bars = document.getElementById('f03-rep-bars');
  bars.querySelector('.m-chart__data').innerHTML =
    '<li data-series="a" data-label="فئة بأسم عربي طويل جدًا لهذا الاختبار الافتراضي" data-value="4.5"></li>'
    + '<li data-series="b" data-label="فئة ثانية بأسم ملفوف أطول من المتاح" data-value="2"></li>'
    + '<li data-series="c" data-label="فئة ثالثة" data-value="0"></li>';
  window.MicroData.render(bars);
  const line = document.getElementById('f03-rep-line');
  line.querySelector('.m-chart__data').innerHTML =
    '<li data-series="a" data-label="أسبوع 2026 الأول من الشهر" data-value="4.5"></li>'
    + '<li data-series="a" data-label="أسبوع 2026 الثاني" data-value="6"></li>'
    + '<li data-series="a" data-label="أسبوع 2026 الثالث" data-value="2"></li>'
    + '<li data-series="a" data-label="أسبوع 2026 الرابع" data-value=""></li>';
  window.MicroData.render(line);
  return true;
}"""

ZOOM2_CLEAN = """() => {
  /* محاكاة نص ×2 بمرورين نظيفين (لا مضاعفة موريثة) — نفس عقد لوحة المعاينة */
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

# R2-03: دورة التشخيص كاملة على العقدة نفسها (invalid→valid)
CIRCLES_CYCLE = """() => {
  const MC = window.MicroMetricComparison;
  const el = document.getElementById('f03-home-circles');
  const snap = (tag) => {
    const note = el.querySelector('[data-metric-scale]');
    return { tag,
      note: note ? note.textContent.trim() : null,
      state: el.getAttribute('data-scale-state'),
      detail: el.getAttribute('data-scale-detail'),
      fallbackN: el.querySelectorAll('[data-metric-fallback] li').length,
      itemsN: el.querySelectorAll('.m-metric-circles__item').length };
  };
  const R = [snap('valid-baseline')];
  el.setAttribute('data-layout', 'weird'); MC.render(el); R.push(snap('layout=weird'));
  el.setAttribute('data-layout', 'separated'); MC.render(el); R.push(snap('valid-again-1'));
  el.setAttribute('data-max', 'bad'); MC.render(el); R.push(snap('max=bad'));
  el.removeAttribute('data-max');
  el.setAttribute('data-radius', '0'); MC.render(el); R.push(snap('radius=0'));
  el.removeAttribute('data-radius'); MC.render(el); R.push(snap('valid-again-2'));
  /* مسح التشخيص كل render حتى دون عنصر الملاحظة: احذف الملاحظة ثم بدّل الحالة */
  const noteEl = el.querySelector('[data-metric-scale]');
  const removed = !!noteEl; if (noteEl) noteEl.remove();
  el.setAttribute('data-layout', 'weird'); MC.render(el); R.push(snap('no-note-invalid'));
  el.setAttribute('data-layout', 'separated'); MC.render(el); R.push(snap('no-note-valid'));
  return { removed, steps: R };
}"""

BARS_CYCLE = """() => {
  const MC = window.MicroMetricComparison;
  const el = document.getElementById('f03-rep-metric');
  const snap = (tag) => {
    const st = el.querySelector('[data-bar-status]');
    return { tag,
      note: st ? st.textContent.trim() : null,
      state: el.getAttribute('data-scale-state'),
      detail: el.getAttribute('data-scale-detail'),
      rows: el.querySelectorAll('[data-bar-items] li').length,
      rowsWithValues: [...el.querySelectorAll('[data-bar-items] .m-main-metric__row-value')]
        .filter((x) => (x.textContent || '').trim().length > 0).length };
  };
  const R = [];
  const u = el.getAttribute('data-common-unit');
  el.setAttribute('data-common-unit', 'يوم'); MC.render(el); R.push(snap('unit-mismatch'));
  el.setAttribute('data-common-unit', u);
  el.setAttribute('data-max', 'bad'); MC.render(el); R.push(snap('bars-max=bad'));
  el.setAttribute('data-max', '1'); MC.render(el); R.push(snap('bars-max-too-small'));
  el.removeAttribute('data-max'); MC.render(el); R.push(snap('bars-valid-again'));
  return R;
}"""

# R2-04: loading الأزرار القصيرة/العريضة RTL/LTR — لا تداخل ولا ملامسة حافة
LOADING_HARNESS = """() => {
  const MB = window.MicroButtons;
  const mk = (id, text, dir) => {
    const old = document.getElementById(id); if (old) old.parentElement.remove();
    const btn = document.createElement('button');
    btn.id = id; btn.type = 'button';
    btn.className = 'm-btn m-btn--secondary';
    btn.textContent = text;
    if (dir) btn.dir = dir;
    const host = document.createElement('div');
    host.style.cssText = 'padding:8px;max-width:340px';
    host.appendChild(btn);
    document.body.appendChild(host);
    return btn;
  };
  const labelRect = (btn) => {
    const lab = btn.querySelector(':scope > .m-btn__label');
    if (lab) return lab.getBoundingClientRect();
    /* زر نصي فقط: القياس على عقد النص وحدها لا على محتوى الزر كله
       (المؤشر ابن للزر خارج التدفق — مدى المحتوى الكامل يشمله فيقيس
       تداخله مع نفسه) */
    const texts = [...btn.childNodes].filter((n) => n.nodeType === 3 && (n.textContent || '').trim());
    if (!texts.length) return null;
    const rng = document.createRange();
    texts.forEach((n, i) => (i === 0 ? rng.selectNodeContents(n) : rng.extend(n, n.length)));
    return rng.getBoundingClientRect();
  };
  const res = {};
  [
    ['r2-btn-short-rtl', 'تحديد', null],
    ['r2-btn-wide-rtl', 'زر عريض بنص عربي طويل جدًا يلتف على أكثر من سطر واحد داخل مساحة محدودة', null],
    ['r2-btn-short-ltr', 'OK', 'ltr'],
    ['r2-btn-wide-ltr', 'A very wide button with long wrapping latin text in a bounded space', 'ltr']
  ].forEach(([id, text, dir]) => {
    const btn = mk(id, text, dir);
    const before = btn.getBoundingClientRect().toJSON();
    MB.setLoading(btn, true, { loadingLabel: 'جارٍ' });
    const sp = btn.querySelector(':scope > .m-btn__spinner');
    const br = btn.getBoundingClientRect();
    const sr = sp ? sp.getBoundingClientRect() : null;
    const lr = labelRect(btn);
    const overlap = (sr && lr) ? {
      ox: Math.max(0, Math.min(sr.right, lr.right) - Math.max(sr.left, lr.left)),
      oy: Math.max(0, Math.min(sr.bottom, lr.bottom) - Math.max(sr.top, lr.top)) } : null;
    res[id] = {
      spinnerW: sr ? +sr.width.toFixed(1) : null,
      dim: { w: +br.width.toFixed(1), h: +br.height.toFixed(1) },
      before: { w: +before.width.toFixed(1), h: +before.height.toFixed(1) },
      dimStable: Math.abs(br.width - before.width) < 0.6 && Math.abs(br.height - before.height) < 0.6,
      gapStartEdge: sr ? +(Math.min(sr.left - br.left, br.right - sr.right) >= 1) : null,
      gapStartPx: sr ? +Math.min(sr.left - br.left, br.right - sr.right).toFixed(2) : null,
      gapLabelPx: (sr && lr) ? +Math.max(0, Math.min(Math.abs(lr.left - sr.right), Math.abs(sr.left - lr.right))).toFixed(2) : null,
      labelOverlap: overlap ? (overlap.ox > 0.5 && overlap.oy > 0.5) : null
    };
    MB.setLoading(btn, false);
    const after = btn.getBoundingClientRect();
    res[id].after = { w: +after.width.toFixed(1), h: +after.height.toFixed(1) };
    res[id].restored = Math.abs(after.width - before.width) < 0.6 && Math.abs(after.height - before.height) < 0.6;
  });
  return res;
}"""


def goto_form(page):
    page.click("#f03-gw-demo")
    page.wait_for_selector("#view-home:not([hidden])")
    page.click("#f03-nav-list")
    page.wait_for_selector("#view-list:not([hidden])")
    page.click("#f03-list-rows .f03-row[data-id='it-01']")
    page.wait_for_selector("#view-detail:not([hidden])")
    page.click("#f03-detail-edit")
    page.wait_for_selector("#view-form:not([hidden])")
    page.wait_for_timeout(300)
    page.evaluate(FILL_VALUES)


def open_reports(page):
    page.click("#f03-nav-reports")
    page.wait_for_selector("#view-reports:not([hidden])")
    page.wait_for_timeout(500)


def leave_form(page):
    page.click("#f03-form-back")
    page.wait_for_timeout(250)
    if page.evaluate("() => !document.getElementById('f03-leave-dialog').hidden"):
        page.click("#f03-abandon")
        page.wait_for_timeout(300)
    page.click("#f03-detail-back")
    page.wait_for_timeout(300)


def run_sample(t, page, tag, url, shots):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(url)
    page.wait_for_timeout(300)
    goto_form(page)

    # ---- R2-01 عند كل المقاسات: مواضع تحكمات الإدخال نفسها ----
    for w in WIDTHS:
        page.set_viewport_size({"width": w, "height": 760})
        page.wait_for_timeout(200)
        m = page.evaluate(FIELD_MEASURE)
        same_expected = (w != 320)
        t.check(f"R2-01[{tag} w{w}] تراص القيمة+الكمية بقياس مواضع التحكمات",
                m["controlsSameRow"] == same_expected,
                json.dumps({"sameRow": m["controlsSameRow"], "vf": m["vf"], "qf": m["qf"]}, ensure_ascii=False))
        if same_expected:
            t.check(f"R2-01[{tag} w{w}] الحقلان متجاوران بفجوة موجبة",
                    4 <= m["fieldsGap"] <= 24, f"gap={m['fieldsGap']}")
        t.check(f"R2-01[{tag} w{w}] قراءة المبلغ 120.50 والكمية 9999 والوحدة داخل التحكم",
                m["valueFits"] and m["qtyFits"] and m["unitVisible"] and m["unitInside"],
                json.dumps({k: m[k] for k in ("valueFits", "qtyFits", "unitVisible", "unitInside", "valueTextW", "qtyTextW")}))
        t.check(f"R2-01[{tag} w{w}] زرا الخطوة ≥48px ولا فيض أفقي",
                all(s["w"] >= 47.5 and s["h"] >= 47.5 for s in m["steps"])
                and len(m["steps"]) == 2 and m["docScrollW"] <= m["docW"] + 1,
                json.dumps({"steps": m["steps"], "docScrollW": m["docScrollW"], "docW": m["docW"]}))
        if w in (320, 360):
            page.screenshot(path=str(shots / f"form-{tag}-{w}.png"), full_page=True)

    # خطأ القيمة: يحل محل المساعدة ويبقى التراص
    page.set_viewport_size({"width": 360, "height": 760})
    page.wait_for_timeout(200)
    m = page.evaluate(FIELD_MEASURE)
    page.fill("#f03-value", "abc")
    page.click("#f03-save")
    page.wait_for_timeout(250)
    e = page.evaluate("""() => ({ helpHidden: document.getElementById('f03-value-help').hidden,
         msgShown: !document.getElementById('f03-value-msg').hidden,
         msgText: document.getElementById('f03-value-msg').textContent.trim(),
         hasError: document.getElementById('f03-value-field').classList.contains('has-error') })""")
    m2 = page.evaluate(FIELD_MEASURE)
    t.check(f"R2-01[{tag}] خطأ القيمة يظهر ويحل محل المساعدة والتراص ثابت",
            e["msgShown"] and e["helpHidden"] and e["hasError"] and m2["controlsSameRow"] and m2["valueFits"],
            json.dumps({"e": e, "sameRow": m2["controlsSameRow"]}, ensure_ascii=False))
    page.screenshot(path=str(shots / f"form-error-{tag}-360.png"), full_page=True)
    page.fill("#f03-value", "120.50")
    page.wait_for_timeout(150)

    # تكبير 200%: التفاف حقيقي بلا فيض ولا قص قراءة
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(250)
    z = page.evaluate(FIELD_MEASURE)
    t.check(f"R2-01[{tag} zoom200] يلتف الصف عند عدم اتساع القراءة وتبقى القراءة كاملة",
            (not z["controlsSameRow"]) and z["valueFits"] and z["qtyFits"]
            and z["docScrollW"] <= z["docW"] + 1
            and all(s["w"] >= 47.5 for s in z["steps"]),
            json.dumps({k: z[k] for k in ("controlsSameRow", "valueFits", "qtyFits", "docScrollW", "docW",
                                          "vi", "qi", "steps")}))
    page.screenshot(path=str(shots / f"form-zoom200-{tag}-360.png"), full_page=True)
    page.evaluate(UNZOOM)
    page.wait_for_timeout(200)

    leave_form(page)

    # ---- R2-02 عند كل المقاسات: الحجم الفعلي getScreenCTM ----
    open_reports(page)
    for w in WIDTHS:
        page.set_viewport_size({"width": w, "height": 900})
        page.wait_for_timeout(300)
        open_reports(page)  # إعادة الرسم بعد تغيير المقاس (عقد المستهلك)
        page.wait_for_timeout(300)
        charts = page.evaluate(CHART_MEASURE)
        for ch in charts:
            if ch.get("hidden"):
                continue
            declared = DECLARED.get(ch["kind"], 0)
            t.check(f"R2-02[{tag} w{w}] {ch['chart']}: عدد نصوص موجب قبل all()",
                    ch["nTexts"] > 0 and (ch["kind"] != "bars" or ch["nRects"] > 0),
                    json.dumps({"nTexts": ch["nTexts"], "nRects": ch["nRects"]}))
            t.check(f"R2-02[{tag} w{w}] {ch['chart']}: الحجم الفعلي ≥ المعلن ({declared}px) بمعامل CTM {ch['scale']}",
                    ch["minEff"] is not None and ch["minEff"] >= declared - 0.01,
                    json.dumps({"minEff": ch["minEff"], "effs": ch["effs"]}))
            t.check(f"R2-02[{tag} w{w}] {ch['chart']}: لا اصطدام ولا خروج أفقي عن الرسم",
                    len(ch["collisions"]) == 0 and ch["outsideH"] == 0 and ch["docScrollW"] <= ch["docW"] + 1,
                    json.dumps({"collisions": ch["collisions"][:4], "outsideH": ch["outsideH"]}))
        if w in (320, 360):
            page.screenshot(path=str(shots / f"reports-{tag}-{w}.png"), full_page=True)

    # أسماء عربية طويلة وتواريخ ملفوفة — قبل وبعد التكبير
    page.set_viewport_size({"width": 320, "height": 900})
    page.wait_for_timeout(200)
    open_reports(page)
    page.evaluate(LONG_LABELS)
    page.wait_for_timeout(250)
    charts = page.evaluate(CHART_MEASURE)
    for ch in charts:
        if ch.get("hidden"):
            continue
        declared = DECLARED.get(ch["kind"], 0)
        t.check(f"R2-02[{tag} long w320] {ch['chart']}: أسماء طويلة/تواريخ — الحد المعلن ولا اصطدام",
                ch["minEff"] is not None and ch["minEff"] >= declared - 0.01
                and len(ch["collisions"]) == 0 and ch["outsideH"] == 0,
                json.dumps({"minEff": ch["minEff"], "collisions": ch["collisions"][:3]}))
    page.screenshot(path=str(shots / f"reports-long-{tag}-320.png"), full_page=True)
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(250)
    charts = page.evaluate(CHART_MEASURE)
    for ch in charts:
        if ch.get("hidden"):
            continue
        t.check(f"R2-02[{tag} long w320 zoom200] {ch['chart']}: لا اصطدام ولا فيض صفحة",
                len(ch["collisions"]) == 0 and ch["docScrollW"] <= ch["docW"] + 1,
                json.dumps({"collisions": ch["collisions"][:3], "docScrollW": ch["docScrollW"], "docW": ch["docW"]}))
    page.screenshot(path=str(shots / f"reports-long-zoom200-{tag}-320.png"), full_page=True)
    page.evaluate(UNZOOM)
    page.wait_for_timeout(200)

    # الدونات 148 محمية (فتح القسم المطوي)
    page.evaluate("() => { const h = document.querySelector('#f03-rep-extra .m-section__head'); if (h) h.click(); }")
    page.wait_for_timeout(300)
    d = page.evaluate("""() => { const svg = document.querySelector('#f03-rep-donut .m-donut__svg');
        return svg ? { w: Math.round(svg.getBoundingClientRect().width), vb: svg.getAttribute('viewBox') } : null; }""")
    t.check(f"R2-02[{tag}] الدونات 148 الثابتة محمية (خارج التعويض)",
            d is not None and 146 <= d["w"] <= 150, json.dumps(d))
    page.screenshot(path=str(shots / f"reports-donut-{tag}-320.png"))

    # ---- R2-03: دورات التشخيص على العقدة نفسها ----
    page.set_viewport_size({"width": 360, "height": 760})
    page.wait_for_timeout(200)
    page.click("#f03-nav-home")
    page.wait_for_selector("#view-home:not([hidden])")
    page.wait_for_timeout(300)
    cyc = page.evaluate(CIRCLES_CYCLE)
    steps = {s["tag"]: s for s in cyc["steps"]}
    base = steps["valid-baseline"]
    t.check(f"R2-03[{tag}] دوائر سليمة: حالة ok وملاحظة دلالية والتشخيص على الجذر",
            base["state"] == "ok" and base["detail"] and "المساحة" in (base["note"] or ""),
            json.dumps(base, ensure_ascii=False))
    for tagk, statek, attrk in [("layout=weird", "invalid-layout", "data-layout"),
                                 ("max=bad", "invalid-scale", "data-max"),
                                 ("radius=0", "invalid-radius", "data-radius")]:
        s = steps[tagk]
        t.check(f"R2-03[{tag}] {tagk}: نص موجز بلا تعليمات مبرمج والقراءات في القائمة",
                (s["note"] is not None) and s["state"] == statek
                and not __import__("re").search(JARGON, s["note"] or "")
                and attrk in (s["detail"] or "") and s["fallbackN"] > 0,
                json.dumps(s, ensure_ascii=False))
    t.check(f"R2-03[{tag}] invalid→valid على العقدة نفسها: لا يبقى تشخيص الدورة السابقة",
            steps["valid-again-1"]["state"] == "ok" and steps["valid-again-2"]["state"] == "ok"
            and "invalid" not in (steps["valid-again-1"]["detail"] or ""),
            json.dumps({"a1": steps["valid-again-1"]["state"], "a2": steps["valid-again-2"]["state"]}))
    t.check(f"R2-03[{tag}] المسح يعمل دون عنصر الملاحظة (حالة الدورة الحالية وحدها)",
            cyc["removed"] and steps["no-note-invalid"]["state"] == "invalid-layout"
            and steps["no-note-valid"]["state"] == "ok"
            and steps["no-note-invalid"]["note"] is None,
            json.dumps({k: steps[k]["state"] for k in ("no-note-invalid", "no-note-valid")}))

    page.click("#f03-nav-reports")
    page.wait_for_selector("#view-reports:not([hidden])")
    page.wait_for_timeout(400)
    bars = page.evaluate(BARS_CYCLE)
    bs = {s["tag"]: s for s in bars}
    for tagk, statek, attrk in [("unit-mismatch", "inconsistent", "data-unit"),
                                 ("bars-max=bad", "invalid-scale", "data-max"),
                                 ("bars-max-too-small", "scale-below-known", "data-max")]:
        s = bs[tagk]
        t.check(f"R2-03[{tag}] {tagk}: نص موجز والقراءات كاملة في الصفوف",
                (s["note"] is not None) and s["state"] == statek
                and not __import__("re").search(JARGON, s["note"] or "")
                and attrk in (s["detail"] or "") and s["rowsWithValues"] == s["rows"] and s["rows"] > 0,
                json.dumps(s, ensure_ascii=False))
    v = bs["bars-valid-again"]
    t.check(f"R2-03[{tag}] أشرطة invalid→valid: حالة ok وشروح الوحدة/الفترة محفوظة",
            v["state"] == "ok" and "د.أ" in (v["note"] or "") and "كل الفترات" in (v["note"] or ""),
            json.dumps(v, ensure_ascii=False))

    # أخطاء الصفحة
    t.check(f"R2-ERR[{tag}] صفر أخطاء صفحة", len(errors) == 0, "; ".join(errors[:3]))
    page.close()


def run_loading(t, browser, base, shots):
    page = browser.new_page(viewport={"width": 360, "height": 760})
    page.goto(f"{base}/{BUTTONS_REL}")
    page.wait_for_timeout(400)
    res = page.evaluate(LOADING_HARNESS)
    for cid, m in res.items():
        t.check(f"R2-04[{cid}] لا تداخل مؤشر/نص ولا ملامسة حافة (هامش ≥1px) وثبات الأبعاد",
                m["dimStable"] and m["restored"] and m["gapStartEdge"] and not m["labelOverlap"]
                and m["gapStartPx"] is not None and m["gapStartPx"] >= 1,
                json.dumps(m))
    page.screenshot(path=str(shots / "loading-buttons-360.png"), full_page=True)
    page.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=str(SCRIPT_REPO),
                    help="جذر المصدر المفحوص (افتراضي: جذر المستودع الحاوي للأداة)")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    out = root / "reviews" / "UI-SOURCE-REPAIR-R2"
    shots = out / "screenshots"
    out.mkdir(parents=True, exist_ok=True)
    shots.mkdir(parents=True, exist_ok=True)

    t = Tool()
    meta = git_meta(root)
    base = serve_dir(root)
    src_url = f"{base}/{SAMPLE_REL}/index.html"
    standalone = root / SAMPLE_REL / "standalone.html"
    if not standalone.exists():
        print(f"standalone missing: {standalone}")
        return 2

    with sync_playwright() as p:
        browser = p.chromium.launch()
        meta["browser"] = browser.version
        meta["zoom_type"] = "محاكاة نص ×2 بمرورين نظيفين (لا مضاعفة موريثة) — ليست native zoom"
        meta["widths"] = WIDTHS
        meta["declared_bounds"] = DECLARED
        meta["checked_at"] = datetime.now(timezone.utc).isoformat()

        page = browser.new_page(viewport={"width": 360, "height": 760})
        run_sample(t, page, "src", src_url, shots)
        page = browser.new_page(viewport={"width": 360, "height": 760})
        run_sample(t, page, "standalone", standalone.as_uri(), shots)
        run_loading(t, browser, base, shots)
        browser.close()

    summary = t.summary()
    (out / "verification.json").write_text(
        json.dumps({"meta": meta, "summary": summary, "results": t.results},
                   ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [f"{'[PASS]' if r['ok'] else '[FAIL]'} {r['name']}" + (f" — {r['detail']}" if r["detail"] and not r["ok"] else "")
             for r in t.results]
    lines.append("")
    lines.append(f"الملخص: {summary['passed']}/{summary['total']} فحصًا ناجحًا — فشل {summary['failed']}")
    lines.append(f"المصدر: commit {meta['commit']} — tree {meta['tree']} — {'نظيف' if meta['source_clean'] else 'غير نظيف'}")
    lines.append(f"المتصفح: Chromium {meta.get('browser')} — التكبير: {meta.get('zoom_type')}")
    lines.append("NOT RUN: " + "؛ ".join(summary["not_run"]))
    (out / "verification.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nالملخص: {summary['passed']}/{summary['total']} — فشل {summary['failed']}")
    print(f"meta: commit={meta['commit'][:12]} clean={meta['source_clean']} browser={meta.get('browser')}")
    return 1 if summary["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
