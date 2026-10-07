#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص الوكيل 1 (جولة SAMSUNG-ONEUI-REPAIR-R1 — الأسس والجودة البصرية)

ملك الوكيل 1 وحده. فحوص بنوده + قياسات مراجعة عائلاته الثلاث (B01 الأزرار،
B04 التنظيم، S01 الأسطح). الأرقام قبل/بعد قابلة لإعادة التشغيل:

SUI-026: زرا «تفاصيل» و«إلغاء» في لوحة «التركيب الصعب» بلوحة B04
      (previews/organization/index.html) — ارتفاع offsetHeight ≥ 48px عند
      320 و390 (عقد المشروع --micro-touch-min / B01)، بلا فيض أفقي في عمود
      الهاتف ولا في الصفحة (لا انحدار في اللوحة)، + حالة تكبير نص 200%.
SUI-018: تناقض مواصفة S01 — قيمة --micro-surface-light في §3 جدول المفاتيح
      تطابق القيمة المحققة في surfaces.css (var(--micro-surface-light, 0.12))
      والنص في §5 (توثيق فقط — لا تغيير كود).
SUI-019: الصنف الميت m-section__title (شرطة مزدوجة) في موضعي ملك الوكيل 1:
      previews/compositions/index.html:128 وpreviews/organization/example-usage.html:25
      — صفر استخدام ميت بعد التعديل، والعنوان يقيس 18px/28px وزن 600 فعليًا
      (قاعدة m-section-title المعرفة في organization.css).
SUI-021: letter-spacing معلن على عناصر تحوي عربية في معرض المكتبة
      (previews/index.css:17,21) — صفر عنصر بنص عربي يحمل تباعدًا غير صفرية
      (قياس computed على كل عنصر بنص عربي مباشر) + ثبات صناديق العرض/الارتفاع
      (لا انحدار تخطيطي).

مراجعة العائلات (قياسات KEEP/IMPROVE — تعمل قبل وبعد؛ ليست فحوص عيب):
B01: مقاسات أنواع الأزرار وحالاتها (ارتفاع ≥48، أيقونة 48×48، معطل/تحميل/
     تركيز/عدّاد)، reduced-motion فعلي (مؤشر ثابت)، 320 بلا تمرير أفقي،
     وتكبير 200% بلا قص تسمية.
B04: صف 72px وبلاط 48px ورأس طي 48px وعنوان 18/28، شارة غير تفاعلية،
     عدّاد يتمدد، هوية ≥48، تكبير 200% داخل عمود الهاتف، وصحة الاتجاه
     المنطقي RTL↔LTR (سهم الفتح ينتقل للطرف المقابل).
S01: أدوار نص الاتجاه الحالي (curves) بأحجامها وألوانها الداكنة الثابتة
     بلا letter-spacing، زخرفة ساكنة غير تفاعلية، بلا فيض أفقي عند
     320/430، ونتائج الفحص الذاتي للمثال المستقل.

التشغيل من جذر المستودع:
  python3 tools/sui-repair-a1-check.py --stage before   # قبل الإصلاح
  python3 tools/sui-repair-a1-check.py --stage after    # بعد الإصلاح
الخادم المدمج: منفذ من نطاق الوكيل 1 (4100-4119). المتصفح: Chromium
143.0.7499.4 (executable_path من --browser أو الافتراضي إن غاب).
المخرجات: <out>/<stage>-results.json + <out>/<stage>-summary.txt +
<out>/screenshots/<stage>-*.png. خروج غير صفري عند أي فشل.

آلية تكبير النص 200% (ZOOM2_CLEAN — منقولة حرفيًا من tools/ui-repair-r2-check.py):
قراءة الحجم المرجعي computed font-size لكل عنصر (مرور أول) ثم مضاعفته inline
(مرور ثانٍ) ثم إعادة القياس — محاكاة نص فقط، ليست native zoom ولا zoom نظام.
NOT RUN: أجهزة فعلية/لمس/TalkBack/WebKit/native zoom.
"""
import argparse
import json
import re
import socket
import subprocess
import sys
import threading
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT_REPO = Path(__file__).resolve().parents[1]
EVIDENCE_BIN = Path("/home/z/my-project/evidence/bin/chromium")
OUT_DEFAULT = SCRIPT_REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent1" / "checks"
PORT_RANGE = range(4100, 4120)  # نطاق منافذ الوكيل 1 في البروتوكول


# ---------- خادم مدمج على منفذ من نطاق الوكيل ----------
def serve_dir(root: Path, port: int):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    for p in [port] + [x for x in PORT_RANGE if x != port]:
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", p), partial(H, directory=str(root)))
            break
        except OSError:
            srv = None
            continue
    if srv is None:
        raise RuntimeError("لا منفذ متاح في نطاق 4100-4119")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}", srv


def git_meta(root: Path):
    def git(*args):
        return subprocess.run(["git", *args], capture_output=True, text=True, cwd=str(root)).stdout.strip()
    status = git("status", "--porcelain")
    return {
        "commit": git("rev-parse", "HEAD"),
        "tree": git("rev-parse", "HEAD^{tree}"),
        "branch": git("rev-parse", "--abbrev-ref", "HEAD"),
        "source_clean": status == "",
        "dirty_files": [ln for ln in status.splitlines()][:12],
    }


class Tool:
    def __init__(self):
        self.results = []
        self.fails = 0

    def check(self, name, ok, detail=""):
        self.results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:600]})
        if not ok:
            self.fails += 1
        print(("[PASS] " if ok else "[FAIL] ") + name + (f" — {detail}" if detail and not ok else ""))
        return bool(ok)

    def summary(self):
        ok = sum(1 for r in self.results if r["ok"])
        return {
            "total": len(self.results),
            "passed": ok,
            "failed": self.fails,
            "not_run": [
                "هاتف فعلي / Samsung Internet / لمس / TalkBack / قارئ شاشة صوتي",
                "WebKit/Safari (سلوك letter-spacing للعربية خارج Chromium)",
                "native zoom / zoom نظام — التكبير هنا محاكاة نص ×2 بمرورين نظيفين معلنة",
            ],
        }


# ---------- تكبير النص 200% — آلية ZOOM2_CLEAN منقولة من ui-repair-r2-check ----------
ZOOM2_CLEAN = """() => {
  /* محاكاة نص ×2 بمرورين نظيفين (لا مضاعفة موريثة) — نفس عقد لوحة المعاينة */
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.suiz === undefined) { it.el.dataset.suiz = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""

UNZOOM = """() => {
  document.querySelectorAll('[data-suiz]').forEach((el) => {
    el.style.fontSize = ''; delete el.dataset.suiz;
  });
  return true;
}"""


# ---------- JS: قياس SUI-026 ----------
SUI26_MEASURE = """() => {
  const btns = [...document.querySelectorAll('#text-zoom-target .m-btn')];
  const col = document.getElementById('text-zoom-target');
  const row = col.querySelector('.m-row');
  const R = (el) => { const b = el.getBoundingClientRect();
    return { w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; };
  return {
    nButtons: btns.length,
    buttons: btns.map((b) => ({ label: b.textContent.trim(),
      rect: R(b), offsetHeight: b.offsetHeight,
      inlineMinHeight: b.style.minHeight || null,
      inlinePaddingBlock: b.style.paddingBlock || null })),
    rowRect: R(row),
    col: { sw: col.scrollWidth, cw: col.clientWidth },
    page: { sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth },
  };
}"""


# ---------- JS: قياس SUI-019 (رأس قابل للطي بعنوان) ----------
SUI19_HEAD = """() => {
  const head = document.querySelector('button.m-section__head[aria-controls="sample-list-body"]');
  const span = head ? head.querySelector('span') : null;
  const cs = span ? getComputedStyle(span) : null;
  let deadRule = false;
  for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) {
    if (r.selectorText && /\\.m-section__title(\\s|$|,|:|\\+)/.test(r.selectorText)) deadRule = true; } } catch (e) {} }
  const hr = head ? head.getBoundingClientRect() : null;
  return {
    headClass: head ? head.className : null,
    spanClass: span ? span.className : null,
    fontSize: cs ? cs.fontSize : null,
    lineHeight: cs ? cs.lineHeight : null,
    fontWeight: cs ? cs.fontWeight : null,
    deadClassUsed: span ? /(^|\\s)m-section__title(\\s|$)/.test(span.className) : null,
    deadRuleAnywhere: deadRule,
    headRect: hr ? { w: +hr.width.toFixed(1), h: +hr.height.toFixed(1) } : null,
  };
}"""

SUI19_EX = """() => {
  const head = document.querySelector('.m-section__head');
  const span = head ? head.querySelector('span') : null;
  const cs = span ? getComputedStyle(span) : null;
  const hr = head ? head.getBoundingClientRect() : null;
  return {
    headClass: head ? head.className : null,
    spanClass: span ? span.className : null,
    fontSize: cs ? cs.fontSize : null,
    lineHeight: cs ? cs.lineHeight : null,
    fontWeight: cs ? cs.fontWeight : null,
    deadClassUsed: span ? /(^|\\s)m-section__title(\\s|$)/.test(span.className) : null,
    headRect: hr ? { w: +hr.width.toFixed(1), h: +hr.height.toFixed(1) } : null,
    selfResults: document.getElementById('results') ? document.getElementById('results').textContent : null,
  };
}"""


# ---------- JS: قياس SUI-021 (المعرض) ----------
SUI21_MEASURE = """() => {
  const AR = /[\\u0600-\\u06FF]/;
  const out = { violations: [], h1: null, eyebrow: null, kicker: null };
  for (const el of document.querySelectorAll('body *')) {
    let hasArabic = false;
    for (const n of el.childNodes) { if (n.nodeType === 3 && AR.test(n.nodeValue || '')) { hasArabic = true; break; } }
    if (!hasArabic) continue;
    const ls = getComputedStyle(el).letterSpacing;
    if (ls && ls !== 'normal' && Math.abs(parseFloat(ls)) > 0.001) {
      if (out.violations.length < 8) out.violations.push({ tag: el.tagName, cls: String(el.className).slice(0, 60),
        ls: ls, text: (el.textContent || '').trim().slice(0, 28) });
      else out.violations.push('...');
    }
  }
  const q = (sel) => { const el = document.querySelector(sel); if (!el) return null;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { ls: cs.letterSpacing, fontSize: cs.fontSize, w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
  out.h1 = q('.library-head h1');
  out.eyebrow = q('.eyebrow');
  out.kicker = q('.section-kicker');
  out.page = { sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth };
  return out;
}"""


# ---------- JS: مراجعة عائلة B01 ----------
B01_TYPES = """() => {
  const sec = document.getElementById('types');
  const btns = [...sec.querySelectorAll('.example .m-btn')];
  return btns.map((b) => { const r = b.getBoundingClientRect(); const cs = getComputedStyle(b);
    return { cls: b.className, text: b.textContent.trim().slice(0, 16),
      w: +r.width.toFixed(1), h: +r.height.toFixed(1), minH: cs.minHeight, gap: cs.gap }; });
}"""

B01_STATES = """() => {
  const R = (el) => { const r = el.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
  const dis = document.querySelector('#states .m-btn[disabled]');
  const spin = document.querySelector('#states .m-btn__spinner');
  const counter = document.querySelector('#types .m-btn__counter');
  const focus = document.querySelector('#states .m-btn.is-focus');
  const d = dis ? getComputedStyle(dis) : null;
  return {
    disabled: d ? { bg: d.backgroundColor, color: d.color, cursor: d.cursor, minH: d.minHeight } : null,
    disabledRect: dis ? R(dis) : null,
    spinner: spin ? Object.assign(R(spin), { vis: getComputedStyle(spin).visibility }) : null,
    counter: counter ? Object.assign(R(counter), { bg: getComputedStyle(counter).backgroundColor }) : null,
    focusShadow: focus ? getComputedStyle(focus).boxShadow.slice(0, 140) : null,
    page: { sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth },
  };
}"""

B01_RM = """() => { const sp = document.querySelector('.m-btn__spinner');
  const btn = document.querySelector('.m-btn');
  return sp && btn ? { spinnerAnim: getComputedStyle(sp).animationName,
    spinnerDur: getComputedStyle(sp).animationDuration,
    btnTransition: getComputedStyle(btn).transition } : null; }"""

B01_ZOOM = """() => {
  const btns = [...document.querySelectorAll('#types .example .m-btn')].slice(0, 3);
  return btns.map((b) => { const r = b.getBoundingClientRect();
    return { cls: b.className, h: +r.height.toFixed(1), offsetH: b.offsetHeight,
      scrollH: b.scrollHeight, clientH: b.clientHeight,
      label: b.querySelector('.m-btn__label') || b }; })
    .map((o) => { const lr = o.label.getBoundingClientRect ? o.label.getBoundingClientRect() : null;
      delete o.label; o.labelW = lr ? +lr.width.toFixed(1) : null; return o; });
}"""


# ---------- JS: مراجعة عائلة B04 ----------
B04_MEASURE = """() => {
  const R = (el) => { const r = el.getBoundingClientRect(); return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
  const row = document.querySelector('#rows .m-row');
  const tile = document.querySelector('#rows .m-row__tile');
  const head = document.querySelector('#sections .m-section__head');
  const title = document.querySelector('#grouping .m-section-title');
  const badge = document.querySelector('#badges .m-badge');
  const identity = document.querySelector('#badges .m-identity');
  const cs = (el) => getComputedStyle(el);
  const t = title ? cs(title) : null;
  return {
    row: row ? R(row) : null,
    tile: tile ? R(tile) : null,
    head: head ? R(head) : null,
    identity: identity ? R(identity) : null,
    title: t ? { fs: t.fontSize, lh: t.lineHeight, fw: t.fontWeight, color: t.color } : null,
    badge: badge ? { tag: badge.tagName, cursor: cs(badge).cursor, maxWidth: cs(badge).maxWidth, wrap: cs(badge).overflowWrap } : null,
    counterFlex: cs(document.querySelector('.m-counter')).flex,
    page: { sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth },
  };
}"""

B04_COUNTER_GROW = """() => ['1','123','9999'].map((t) => {
  const c = document.querySelector('.m-counter');
  const probe = c.cloneNode(true); probe.textContent = t;
  probe.style.position = 'absolute'; probe.style.visibility = 'hidden';
  document.body.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove(); return w; })"""

B04_DIR = """() => {
  const chev = document.querySelector('#rows a.m-row .m-row__open');
  const txt = document.querySelector('#rows a.m-row .m-row__text');
  if (!chev || !txt) return null;
  const c = chev.getBoundingClientRect(); const t = txt.getBoundingClientRect();
  return { dir: getComputedStyle(document.documentElement).direction,
    chevronAtEndSide: (c.right < t.left) || (c.left > t.right),
    chevX: +c.x.toFixed(1), textX: +t.x.toFixed(1) };
}"""

B04_ZOOM = """() => {
  const col = document.getElementById('text-zoom-target');
  const title = col.querySelector('.m-row__title');
  const btn = col.querySelector('.m-btn');
  return { titleFont: getComputedStyle(title).fontSize,
    btn: { h: +btn.getBoundingClientRect().height.toFixed(1), scrollH: btn.scrollHeight, clientH: btn.clientHeight },
    col: { sw: col.scrollWidth, cw: col.clientWidth } };
}"""


# ---------- JS: مراجعة عائلة S01 ----------
S01_MEASURE = """() => {
  const cur = document.querySelector('#current-direction .m-surface--curves');
  const roles = {};
  for (const role of ['label', 'title', 'amount', 'sub']) {
    const el = cur ? cur.querySelector('.m-surface__' + role) : null;
    if (el) { const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      roles[role] = { fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, color: cs.color,
        ls: cs.letterSpacing, w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }
  }
  const waves = document.querySelector('[data-surface="waves"]');
  const wt = waves ? waves.querySelector('.m-surface__title') : null;
  const wcs = wt ? getComputedStyle(wt) : null;
  const layer = waves ? waves.querySelector('.m-surface__waves') : null;
  const lcs = layer ? getComputedStyle(layer) : null;
  const ccs = cur ? getComputedStyle(cur) : null;
  const pcs = cur ? getComputedStyle(cur, '::before') : null;
  return {
    curves: cur ? {
      bgColor: ccs.backgroundColor,
      wavesDisplay: getComputedStyle(cur.querySelector('.m-surface__waves')).display,
      pseudoContent: (pcs.content || '').slice(0, 8),
      pseudoPE: pcs.pointerEvents,
      bgImageHasGradient: (ccs.backgroundImage || '').indexOf('linear-gradient') >= 0,
    } : null,
    curvesRoles: roles,
    wavesTitle: wcs ? { fs: wcs.fontSize, lh: wcs.lineHeight, fw: wcs.fontWeight, color: wcs.color, ls: wcs.letterSpacing } : null,
    wavesLayer: lcs ? { anim: lcs.animationName, pe: lcs.pointerEvents, pe2: lcs.userSelect } : null,
    page: { sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth },
  };
}"""


def rel_ratio(fg, bg):
    """تباين WCAG من نص rgb() — للأرقام الاسترشادية في مراجعة S01."""
    def lin(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    def lum(rgb):
        r, g, b = (lin(x) for x in rgb)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    l1, l2 = sorted((lum(fg), lum(bg)), reverse=True)
    return round((l1 + 0.05) / (l2 + 0.05), 2)


def parse_rgb(s):
    m = re.findall(r"[\d.]+", s or "")
    return [float(x) for x in m[:3]] if len(m) >= 3 else None


def count_dead_class(path: Path):
    txt = path.read_text(encoding="utf-8")
    return len(re.findall(r'class="[^"]*\bm-section__title\b[^"]*"', txt))


# ---------- SUI-018: فحص توثيقي (قراءة مصدر — بلا متصفح) ----------
def run_sui018(t, root, data):
    spec = (root / "components" / "surfaces" / "specification.md").read_text(encoding="utf-8")
    css = (root / "components" / "surfaces" / "surfaces.css").read_text(encoding="utf-8")
    m_css = re.search(r"--micro-surface-light,\s*([\d.]+)\)", css)
    m_s3 = re.search(r"\|\s*`--micro-surface-light`\s*\|\s*([\d.]+)\s*\|", spec)
    m_s5 = re.search(r"وافتراضيه\s*([\d.]+)", spec)
    css_v = m_css.group(1) if m_css else None
    s3_v = m_s3.group(1) if m_s3 else None
    s5_v = m_s5.group(1) if m_s5 else None
    data["sui018"] = {"css_actual": css_v, "spec_s3": s3_v, "spec_s5": s5_v}
    t.check("[SUI-018] المواصفة §3 تطابق القيمة المحققة في surfaces.css وقيمة §5 (لا تعارض داخلي)",
            css_v is not None and css_v == s3_v == s5_v,
            f"css={css_v} §3={s3_v} §5={s5_v}")


# ---------- SUI-021: المعرض ----------
def run_sui021(t, browser, base, shots, stage, data):
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto(f"{base}/previews/index.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    res_d = page.evaluate(SUI21_MEASURE)
    page.screenshot(path=str(shots / f"{stage}-sui021-gallery-head-1280.png"),
                    clip=page.evaluate("""() => { const r = document.querySelector('.library-head').getBoundingClientRect();
                       return { x: 0, y: 0, width: Math.min(1280, r.width), height: r.height }; }"""))
    data["sui021_desktop"] = res_d
    t.check("[SUI-021] معرض المكتبة (1280): صفر عنصر بنص عربي يحمل letter-spacing غير صفرية",
            len(res_d["violations"]) == 0,
            json.dumps(res_d["violations"][:3], ensure_ascii=False))
    page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/index.html")
    page.wait_for_load_state("networkidle")
    res_m = page.evaluate(SUI21_MEASURE)
    data["sui021_mobile390"] = res_m
    t.check("[SUI-021] معرض المكتبة (390): صفر عنصر بنص عربي يحمل letter-spacing غير صفرية",
            len(res_m["violations"]) == 0,
            json.dumps(res_m["violations"][:3], ensure_ascii=False))
    t.check("[SUI-021] صناديق h1 وeyebrow تقاس بأبعاد موجودة (مرجع ثبات التخطيط قبل/بعد)",
            res_m["h1"] is not None and res_d["h1"] is not None
            and res_m["h1"]["h"] > 0 and res_d["eyebrow"] is not None and res_d["eyebrow"]["h"] > 0,
            f"h1={res_m['h1']} eyebrow={res_m['eyebrow']}")
    page.screenshot(path=str(shots / f"{stage}-sui021-gallery-head-390.png"))
    page.close()


# ---------- SUI-019: الصنف الميت في موضعيّ الوكيل ----------
def run_sui019(t, browser, base, shots, stage, data, root):
    # 1) grep الملفين (ملك الوكيل)
    files = [root / "previews" / "compositions" / "index.html",
             root / "previews" / "organization" / "example-usage.html"]
    grep_counts = {str(f.relative_to(root)): count_dead_class(f) for f in files}
    data["sui019_grep"] = grep_counts
    t.check("[SUI-019] grep: صفر استخدام للصنف الميت m-section__title في موضعيّ ملكي",
            all(v == 0 for v in grep_counts.values()), json.dumps(grep_counts, ensure_ascii=False))

    # 2) قياس فعلي في compositions (390)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/compositions/index.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    comp = page.evaluate(SUI19_HEAD)
    data["sui019_compositions"] = comp
    t.check("[SUI-019] compositions: العنوان يستخدم m-section-title ويقيس 18px/28px وزن 600",
            comp["spanClass"] is not None and "m-section-title" in comp["spanClass"]
            and not (comp["deadClassUsed"] or False)
            and comp["fontSize"] == "18px" and comp["lineHeight"] == "28px" and comp["fontWeight"] == "600",
            json.dumps(comp, ensure_ascii=False))
    page.locator('section[aria-labelledby="summary-title"]').screenshot(
        path=str(shots / f"{stage}-sui019-compositions-390.png"))
    page.close()

    # 3) قياس فعلي في مثال الاستخدام المستقل + نتائج فحصه الذاتي
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/organization/example-usage.html")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(600)
    ex = page.evaluate(SUI19_EX)
    data["sui019_example_usage"] = ex
    t.check("[SUI-019] مثال الاستخدام المستقل: العنوان يستخدم m-section-title ويقيس 18px/28px وزن 600",
            ex["spanClass"] is not None and "m-section-title" in ex["spanClass"]
            and not (ex["deadClassUsed"] or False)
            and ex["fontSize"] == "18px" and ex["lineHeight"] == "28px" and ex["fontWeight"] == "600",
            json.dumps({k: ex[k] for k in ("spanClass", "fontSize", "lineHeight", "fontWeight")}, ensure_ascii=False))
    self_txt = ex.get("selfResults") or ""
    data["sui019_example_selfcheck"] = self_txt
    t.check("[SUI-019] فحوص المثال المستقل الذاتية ما زالت تنجح بعد تغيير الصنف",
            self_txt.count("FAIL ") == 0 and self_txt.count("PASS ") >= 3,
            self_txt.splitlines()[0] if self_txt else "لا نتائج")
    page.screenshot(path=str(shots / f"{stage}-sui019-example-usage-390.png"))
    page.close()


# ---------- SUI-026: زرا التركيب الصعب ----------
def run_sui026(t, browser, base, shots, stage, data):
    for width in (320, 390):
        page = browser.new_page(viewport={"width": width, "height": 900})
        page.goto(f"{base}/previews/organization/index.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        m = page.evaluate(SUI26_MEASURE)
        data[f"sui026_w{width}"] = m
        heights = [b["offsetHeight"] for b in m["buttons"]]
        t.check(f"[SUI-026] زرا التركيب الصعب عند {width}px: offsetHeight ≥ 48px (عقد B01/touch-min)",
                m["nButtons"] == 2 and all(h >= 48 for h in heights),
                f"offsetHeights={heights} inlineMin={[b['inlineMinHeight'] for b in m['buttons']]}")
        t.check(f"[SUI-026] لا انحدار في اللوحة عند {width}px: عمود الهاتف والصفحة بلا فيض أفقي",
                m["col"]["sw"] <= m["col"]["cw"] + 1 and m["page"]["sw"] <= m["page"]["cw"] + 1,
                json.dumps({"col": m["col"], "page": m["page"], "row": m["rowRect"]}))
        page.locator("#phones-full").screenshot(path=str(shots / f"{stage}-sui026-phones-{width}.png"))
        page.close()

    # حالة تكبير 200% (آلية ZOOM2_CLEAN) عند 390 — الأزرار تنمو مع الخط بلا قص
    page = browser.new_page(viewport={"width": 390, "height": 900})
    page.goto(f"{base}/previews/organization/index.html")
    page.wait_for_load_state("networkidle")
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(250)
    m = page.evaluate(SUI26_MEASURE)
    data["sui026_zoom200_390"] = m
    t.check("[SUI-026] عند محاكاة نص 200% (مروران): الأزرار ≥48px وعمود الهاتف بلا فيض",
            m["nButtons"] == 2 and all(b["offsetHeight"] >= 48 for b in m["buttons"])
            and m["col"]["sw"] <= m["col"]["cw"] + 1,
            json.dumps({k: m[k] for k in ("buttons", "col", "page")}, ensure_ascii=False))
    page.locator("#phones-full").screenshot(path=str(shots / f"{stage}-sui026-phones-zoom200-390.png"))
    page.evaluate(UNZOOM)
    page.close()


# ---------- مراجعة عائلة B01 ----------
def run_family_b01(t, browser, base, shots, stage, data):
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/buttons/index.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    types = page.evaluate(B01_TYPES)
    data["b01_types_390"] = types
    icon = [x for x in types if "m-btn--icon" in x["cls"]]
    t.check("[B01-مراجعة] كل أنواع الأزرار عند 390 بارتفاع ≥48px وزر الأيقونة 48×48",
            all(x["h"] >= 47.5 for x in types) and icon and abs(icon[0]["w"] - 48) < 1 and abs(icon[0]["h"] - 48) < 1,
            json.dumps([{"cls": x["cls"].replace("m-btn m-btn--", ""), "h": x["h"]} for x in types], ensure_ascii=False))
    states = page.evaluate(B01_STATES)
    data["b01_states_390"] = states
    t.check("[B01-مراجعة] الحالات: معطل (أرضية/نص معطل + not-allowed) ومؤشر التحميل مرئي وعدّاد 20px وحلقة تركيز",
            states["disabled"] is not None
            and states["disabled"]["bg"] == "rgb(228, 234, 232)"
            and states["disabled"]["color"] == "rgb(83, 103, 107)"
            and states["disabled"]["cursor"] == "not-allowed"
            and states["spinner"] is not None and states["spinner"]["vis"] == "visible"
            and states["counter"] is not None and abs(states["counter"]["h"] - 20) < 1
            and states["focusShadow"] is not None and states["focusShadow"] != "none",
            json.dumps(states, ensure_ascii=False))
    page.locator("#types").screenshot(path=str(shots / f"{stage}-b01-types-390.png"))
    page.locator("#states").screenshot(path=str(shots / f"{stage}-b01-states-390.png"))

    # 320 بلا تمرير أفقي
    page2 = browser.new_page(viewport={"width": 320, "height": 900})
    page2.goto(f"{base}/previews/buttons/index.html")
    page2.wait_for_load_state("networkidle")
    ov = page2.evaluate("() => ({ sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth })")
    data["b01_overflow_320"] = ov
    t.check("[B01-مراجعة] اللوحة عند 320px بلا تمرير أفقي", ov["sw"] <= ov["cw"], json.dumps(ov))
    page2.close()

    # تكبير 200%: الأزرار تنمو مع النص بلا قص
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(250)
    zoomed = page.evaluate(B01_ZOOM)
    data["b01_zoom200_390"] = zoomed
    t.check("[B01-مراجعة] عند محاكاة نص 200%: ارتفاع الأزرار ≥48 وscrollHeight ≤ clientHeight (لا قص تسمية)",
            all(z["offsetH"] >= 48 and z["scrollH"] <= z["clientH"] + 1 for z in zoomed),
            json.dumps(zoomed, ensure_ascii=False))
    page.evaluate(UNZOOM)
    page.wait_for_timeout(150)
    page.close()

    # reduced-motion فعلي: مؤشر ثابت
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    pg = ctx.new_page()
    pg.goto(f"{base}/previews/buttons/index.html")
    pg.wait_for_load_state("networkidle")
    rm = pg.evaluate(B01_RM)
    data["b01_reduced_motion"] = rm
    t.check("[B01-مراجعة] prefers-reduced-motion فعلي: مؤشر بلا حركة وانتقال الزر ملغى",
            rm is not None and rm["spinnerAnim"] == "none" and "none" in rm["btnTransition"],
            json.dumps(rm, ensure_ascii=False))
    ctx.close()


# ---------- مراجعة عائلة B04 ----------
def run_family_b04(t, browser, base, shots, stage, data):
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/organization/index.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    m = page.evaluate(B04_MEASURE)
    data["b04_measure_390"] = m
    t.check("[B04-مراجعة] الصف 72px والبلاط 48 ورأس الطي 48 وعنوان القسم 18/28/600",
            m["row"] is not None and m["row"]["h"] >= 71.5
            and m["tile"] is not None and abs(m["tile"]["h"] - 48) < 1
            and m["head"] is not None and m["head"]["h"] >= 47.5
            and m["title"] is not None and m["title"]["fs"] == "18px" and m["title"]["lh"] == "28px"
            and m["title"]["fw"] == "600",
            json.dumps(m, ensure_ascii=False))
    t.check("[B04-مراجعة] الشارة span غير تفاعلية (ليست زرًا ولا مؤشر يدًا) ويلتف نصها الطويل",
            m["badge"] is not None and m["badge"]["tag"] == "SPAN"
            and m["badge"]["cursor"] not in ("pointer",) and m["badge"]["wrap"] == "anywhere",
            json.dumps(m["badge"], ensure_ascii=False))
    widths = page.evaluate(B04_COUNTER_GROW)
    data["b04_counter_widths"] = widths
    t.check("[B04-مراجعة] العدّاد يتمدد مع الرقم (1<123<9999) ولا ينكمش",
            widths[0] < widths[1] < widths[2], str([round(w) for w in widths]))
    t.check("[B04-مراجعة] اللوحة عند 390px بلا تمرير أفقي",
            m["page"]["sw"] <= m["page"]["cw"], json.dumps(m["page"]))
    page.locator("#rows").screenshot(path=str(shots / f"{stage}-b04-rows-390.png"))

    # اتجاه منطقي: سهم الفتح في طرف الكتلة النصية، ويقلب مع dir
    rtl = page.evaluate(B04_DIR)
    page.evaluate("() => document.documentElement.setAttribute('dir', 'ltr')")
    ltr = page.evaluate(B04_DIR)
    page.evaluate("() => document.documentElement.setAttribute('dir', 'rtl')")
    data["b04_direction"] = {"rtl": rtl, "ltr": ltr}
    t.check("[B04-مراجعة] الاتجاه منطقي: سهم الفتح في الطرف المقابل للنص ويقلب فعليًا بين RTL وLTR",
            rtl is not None and ltr is not None and rtl["chevronAtEndSide"] and ltr["chevronAtEndSide"]
            and rtl["dir"] == "rtl" and ltr["dir"] == "ltr"
            and (rtl["chevX"] < rtl["textX"]) == (ltr["chevX"] > ltr["textX"]),
            json.dumps({"rtl": rtl, "ltr": ltr}, ensure_ascii=False))

    # تكبير 200% على عمود الهاتف (آلية ZOOM2_CLEAN)
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(250)
    z = page.evaluate(B04_ZOOM)
    data["b04_zoom200_390"] = z
    t.check("[B04-مراجعة] عند محاكاة نص 200%: عنوان الصف 32px والمحتوى داخل عمود الهاتف بلا قص زر",
            z["titleFont"] == "32px" and z["col"]["sw"] <= z["col"]["cw"] + 1
            and z["btn"]["scrollH"] <= z["btn"]["clientH"] + 1,
            json.dumps(z, ensure_ascii=False))
    page.evaluate(UNZOOM)
    page.close()


# ---------- مراجعة عائلة S01 ----------
S01_CURVES_PAGE = """() => {
  const cur = document.querySelector('.m-surface--curves');
  const roles = {};
  for (const role of ['label', 'title', 'amount', 'sub']) {
    const el = cur ? cur.querySelector('.m-surface__' + role) : null;
    if (el) { const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      roles[role] = { fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, color: cs.color,
        ls: cs.letterSpacing, w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }
  }
  const ccs = cur ? getComputedStyle(cur) : null;
  const pcs = cur ? getComputedStyle(cur, '::before') : null;
  return {
    curves: cur ? {
      bgColor: ccs.backgroundColor,
      bgImageHasGradient: (ccs.backgroundImage || '').indexOf('linear-gradient') >= 0,
      wavesDisplay: getComputedStyle(cur.querySelector('.m-surface__waves')).display,
      pseudoContent: (pcs.content || '').slice(0, 8),
      pseudoPE: pcs.pointerEvents,
    } : null,
    curvesRoles: roles,
    page: { sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth },
  };
}"""

# لوحة S01 §0: هل تعرض الاتجاه الحالي فعليًا؟ (اكتشاف الوكيل 1 — القياس فقط؛
# الملف خارج ملكية الوكيل: يوثق في التقرير ويُصلحه القائد)
S01_BOARD_CURRENT = """() => {
  const cur = document.querySelector('#current-direction .m-surface--curves');
  if (!cur) return null;
  const cs = getComputedStyle(cur);
  const title = cur.querySelector('.m-surface__title');
  const tcs = title ? getComputedStyle(title) : null;
  const curvesLoaded = [...document.styleSheets].some((sh) => {
    try { return (sh.href || '').indexOf('curves.css') >= 0; } catch (e) { return false; } });
  return { curvesCssLoaded: curvesLoaded, bgColor: cs.backgroundColor,
    titleColor: tcs ? tcs.color : null,
    wavesDisplay: getComputedStyle(cur.querySelector('.m-surface__waves')).display };
}"""


def run_family_s01(t, browser, base, shots, stage, data):
    # 0) قياس اكتشاف الوكيل 1: لوحة S01 §0 «الاتجاه الحالي» لا تحمّل curves.css
    #    (يسجل في قبل وبعد على السواء — الملف خارج ملكية الوكيل 1؛ للقائد)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/surfaces/index.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    disc = page.evaluate(S01_BOARD_CURRENT)
    data["s01_discovery_board_curves_not_loaded"] = disc
    t.check("[S01-اكتشاف للقائد] لوحة S01 §0 «الاتجاه الحالي» تعرض curves فعليًا (curves.css محملة وسلوك الاتجاه مطبق)",
            disc is not None and disc["curvesCssLoaded"] and disc["wavesDisplay"] == "none"
            and disc["titleColor"] == "rgb(23, 45, 50)",
            json.dumps(disc, ensure_ascii=False) + " — اكتشاف خارج ملكية الوكيل 1: الفحص يوثق الحالة ولا يصلحها")
    page.locator("#current-direction").screenshot(path=str(shots / f"{stage}-s01-board-current-direction-390.png"))
    page.close()

    # 1) الاتجاه الحالي من مصدره الصحيح: approved-curves.html (يحمّل curves.css)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/surfaces/approved-curves.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    m = page.evaluate(S01_CURVES_PAGE)
    data["s01_approved_curves_390"] = m
    roles = m.get("curvesRoles") or {}
    t.check("[S01-مراجعة] أدوار نص الاتجاه الحالي (curves من approved-curves): أحجام 14/22/36/13 داكنة ثابتة بلا letter-spacing",
            roles.get("label", {}).get("fs") == "14px" and roles.get("title", {}).get("fs") == "22px"
            and roles.get("amount", {}).get("fs") == "36px" and roles.get("sub", {}).get("fs") == "13px"
            and all(v.get("ls") in ("normal", "0px") for v in roles.values())
            and all(v.get("color") == "rgb(23, 45, 50)" for v in roles.values()),
            json.dumps(roles, ensure_ascii=False))
    cur = m.get("curves") or {}
    t.check("[S01-مراجعة] السطح الحالي: أرضية فاتحة بتدرج curves وإخفاء الموجات وزخرفة ::before غير تفاعلية",
            cur.get("bgColor") == "rgb(247, 248, 244)" and cur.get("bgImageHasGradient")
            and cur.get("wavesDisplay") == "none" and cur.get("pseudoPE") == "none",
            json.dumps(cur, ensure_ascii=False))
    fg = parse_rgb(roles.get("title", {}).get("color", ""))
    bg = parse_rgb(cur.get("bgColor", ""))
    ratio = rel_ratio(fg, bg) if fg and bg else None
    data["s01_curves_contrast"] = {"fg": roles.get("title", {}).get("color"), "bg": cur.get("bgColor"), "ratio": ratio}
    t.check("[S01-مراجعة] تباين عنوان curves على أرضيته ≥ 4.5:1 (حساب من القيم المحسوبة)",
            ratio is not None and ratio >= 4.5, f"ratio={ratio}")
    page.locator(".curves-stage").screenshot(path=str(shots / f"{stage}-s01-approved-curves-390.png"))
    page.close()

    # 2) زخرفة الموجات التاريخية في اللوحة ساكنة وغير تفاعلية (من اللوحة)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/surfaces/index.html")
    page.wait_for_load_state("networkidle")
    w = page.evaluate(S01_MEASURE)
    data["s01_board_waves_390"] = {"wavesLayer": w.get("wavesLayer"), "wavesTitle": w.get("wavesTitle")}
    t.check("[S01-مراجعة] زخرفة الموجات التاريخية ساكنة (بلا animation) وغير تفاعلية وعنوانها 22px أبيض",
            (w.get("wavesLayer") or {}).get("anim") == "none" and (w.get("wavesLayer") or {}).get("pe") == "none"
            and (w.get("wavesTitle") or {}).get("fs") == "22px",
            json.dumps(data["s01_board_waves_390"], ensure_ascii=False))
    page.close()

    for width in (320, 430):
        page = browser.new_page(viewport={"width": width, "height": 900})
        page.goto(f"{base}/previews/surfaces/index.html")
        page.wait_for_load_state("networkidle")
        ov = page.evaluate("() => ({ sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth })")
        data[f"s01_overflow_{width}"] = ov
        t.check(f"[S01-مراجعة] لوحة الأسطح عند {width}px بلا تمرير أفقي", ov["sw"] <= ov["cw"], json.dumps(ov))
        page.close()

    # 3) الفحص الذاتي للمثال المستقل (curves — الاتجاه الحالي)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(f"{base}/previews/surfaces/example-usage.html")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(700)
    self_txt = page.evaluate("() => document.getElementById('results') ? document.getElementById('results').textContent : ''")
    data["s01_example_selfcheck"] = self_txt
    t.check("[S01-مراجعة] فحوص المثال المستقل الذاتية (7 فحوصًا) كلها ناجحة",
            self_txt.count("FAIL ") == 0 and self_txt.count("PASS ") >= 7,
            self_txt.splitlines()[0] if self_txt else "لا نتائج")
    page.screenshot(path=str(shots / f"{stage}-s01-example-usage-390.png"))
    page.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", required=True, choices=["before", "after"],
                    help="مرحلة القياس: before (قبل الإصلاح) أو after (بعده)")
    ap.add_argument("--root", default=str(SCRIPT_REPO),
                    help="جذر المصدر المفحوص (افتراضي: جذر المستودع الحاوي للأداة)")
    ap.add_argument("--out", default=str(OUT_DEFAULT),
                    help="مجلد الإخراج (افتراضي: أدلة الوكيل 1 في جولة الإصلاح)")
    ap.add_argument("--port", type=int, default=4100,
                    help="منفذ الخادم المدمج من نطاق الوكيل 1 (4100-4119)")
    ap.add_argument("--browser", default=str(EVIDENCE_BIN) if EVIDENCE_BIN.exists() else "",
                    help="مسار Chromium التنفيذي (افتراضي: حزمة أدلة المشروع إن وُجدت)")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    out = Path(args.out).resolve()
    shots = out / "screenshots"
    shots.mkdir(parents=True, exist_ok=True)

    t = Tool()
    data = {"stage": args.stage}
    meta = git_meta(root)
    data["meta"] = meta
    base, srv = serve_dir(root, args.port)
    data["meta"]["server"] = base
    print(f"# مرحلة: {args.stage} — الخادم: {base} — المتصفح: {args.browser or 'playwright الافتراضي'}")

    run_sui018(t, root, data)

    exe = args.browser or None
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=exe)
        data["meta"]["browser"] = browser.version
        data["meta"]["zoom_type"] = "محاكاة نص ×2 بمرورين نظيفين (ZOOM2_CLEAN من ui-repair-r2-check) — ليست native zoom"
        data["meta"]["checked_at"] = datetime.now(timezone.utc).isoformat()

        run_sui026(t, browser, base, shots, args.stage, data)
        run_sui019(t, browser, base, shots, args.stage, data, root)
        run_sui021(t, browser, base, shots, args.stage, data)
        run_family_b01(t, browser, base, shots, args.stage, data)
        run_family_b04(t, browser, base, shots, args.stage, data)
        run_family_s01(t, browser, base, shots, args.stage, data)
        browser.close()
    srv.shutdown()

    summary = t.summary()
    data["summary"] = summary
    (out / f"{args.stage}-results.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [f"{'[PASS]' if r['ok'] else '[FAIL]'} {r['name']}" + (f" — {r['detail']}" if r["detail"] and not r["ok"] else "")
             for r in t.results]
    lines.append("")
    lines.append(f"الملخص: {summary['passed']}/{summary['total']} فحصًا ناجحًا — فشل {summary['failed']}")
    lines.append(f"المصدر: commit {meta['commit'][:12]} — tree {meta['tree'][:12]} — {'نظيف' if meta['source_clean'] else 'غير نظيف'}")
    lines.append(f"المتصفح: Chromium {data['meta'].get('browser')} — الخادم: {base}")
    lines.append("NOT RUN: " + "؛ ".join(summary["not_run"]))
    (out / f"{args.stage}-summary.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nالملخص [{args.stage}]: {summary['passed']}/{summary['total']} — فشل {summary['failed']}")
    print(f"meta: commit={meta['commit'][:12]} clean={meta['source_clean']} browser={data['meta'].get('browser')}")
    return 1 if summary["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
