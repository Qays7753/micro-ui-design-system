#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص الوكيل 3 لجولة SAMSUNG-ONEUI-REPAIR-R2 (SUI-R2-A3)
ملك حصري للوكيل 3. عيبان ملزمان من المراجعة CHATGPT-REVIEW-R1:

SUI-R1-03 (messages.js): منع تكرار الإعلان كان يعتمد آخر إعلان فقط
        (lastAnnounced) — التسلسل A(id) ثم B(id) ثم A(id بنفس النص) يعلن
        3 مرات بينما عقد «الحدث ذاته يعلن مرة» يستلزم 2. الإصلاح: سجل
        هوية محدود (CAPACITY=12، LIFETIME_MS=60000) + resetAnnouncements().
        الفحوص (قبلها فشل في before وبعدها نجاح): A,A,B=2 · A,B,A=2 ·
        بلا id مرتين=2 · id نفسه بنص مختلف يعلن · assertive→polite ·
        reset ثم نفس الهوية يعلن · مرور 61s (ترقيع Date.now) يعلن ·
        إقصاء السعة (12 أخرى تقصي الأقدم) · قناة toast نفسها · صفر أخطاء.
        عدّ التحديثات عبر MutationObserver على .m-live-region — قياس DOM
        بنيوي وليس إثبات صوت قارئ شاشة فعلي.
SUI-R1-04 (navigation.css): زر «الحساب» مقصوص خارج الحافة عند 320+200%
        (قبل: الزر −18..75 والنص −12..69 في RTL المصدر وstandalone).
        الفحوص: المصفوفة 320/360/390/430 × (100% و200% ZOOM2_CLEAN) ×
        (RTL وLTR) × (المصدر http بعد الدخول بالمزوّد التجريبي + standalone
        عبر file://): لكل زر من الأربعة getBoundingClientRect داخل
        [0, viewportWidth]، وحدود حروف التسمية بـRange داخل العرض وداخل
        حدود الزر، وصفر تداخل بين الأزرار، وهدف لمس ≥47.5px، وصفوف
        navbar ≥2 عند 320+200% مع --f03-navbar-h المقيس (RO)، ورجعية
        SUI-001/002 (توست فوق navbar الملفوف + شريط التحديد بلا تراكب).
        scrollWidth وحده ليس دليلًا — القياس بالحدود الفعلية والRange.

التشغيل من جذر worktree الوكيل 3:
  python3 tools/sui-r2-a3-check.py --tag before --out reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent3
  python3 tools/sui-r2-a3-check.py --tag after  --out reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent3

خروج غير صفري عند فشل أي فحص. NOT RUN معلنة في الملخص.
آلية 200%: محاكاة نص ×2 بمرورين نظيفين (ZOOM2_CLEAN منسوخة حرفيًا من
tools/sui-repair-a2-check.py) — ليست native zoom.
نطاق منافذ الوكيل 3 في هذه الجولة: 4440-4459.
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

ROOT = Path(__file__).resolve().parent.parent
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
PORT_RANGE = (4440, 4459)  # نطاق الوكيل 3 (R2)

MSG_BOARD = "/previews/messages/index.html"
SAMPLE_DIR = ROOT / "previews" / "ux-patterns" / "mobile-record-sample"
STANDALONE_URI = (SAMPLE_DIR / "standalone.html").resolve().as_uri()

WIDTHS = [320, 360, 390, 430]
NAV_IDS = ["f03-nav-home", "f03-nav-list", "f03-nav-reports", "f03-nav-account"]
TOAST_TEXT = "تم النسخ إلى سجل اليوم (محاكاة)"

ZOOM2_CLEAN = """() => {
  /* محاكاة نص ×2 بمرورين نظيفين (لا مضاعفة موروثة) — نفس آلية الأداة المشتركة */
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

# ==================== عقد الإعلان SUI-R1-03 (لوحة messages) ====================
# عدّ تحديثات المنطقة الحية عبر MutationObserver: كل إعلان فعلي بعد الأول =
# سجلان (مسح ثم وضع النص بعد 50ms)؛ وأول إعلان من منطقة فارغة = سجل واحد؛
# والمبتلع = صفر. الأرقام مقيسة داخل الصفحة.
ANNOUNCE_R2_CONTRACT = r"""
() => {
  const A = window.MicroMessages.announce;
  const MM = window.MicroMessages;
  const hasReset = typeof MM.resetAnnouncements === 'function';
  A('تهيئة القناة', { id: 'boot' }); /* المنطقة تُنشأ بأول إعلان */
  return new Promise((resolve) => setTimeout(() => {
    const region = document.querySelector('.m-live-region');
    if (!region) { resolve({ error: 'no live region' }); return; }
    region.textContent = '';
    let mut = 0;
    const mo = new MutationObserver((records) => { mut += records.length; });
    mo.observe(region, { childList: true, characterData: true, subtree: true });
    window.__a3r2Mut = () => mut; /* للقسم التالي (toast) من بايثون */
    window.__a3r2Region = region;
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    (async () => {
      const out = { hasReset };
      /* 1) A,A,B — المتوقع: إعلانان */
      A('حدث أ', { id: 'A' }); await wait(180);
      out.s1_afterA = mut;
      A('حدث أ', { id: 'A' }); await wait(180);
      out.s1_afterA2 = mut;
      A('حدث ب', { id: 'B' }); await wait(180);
      out.s1_afterB = mut;
      /* 2) A,B,A — المتوقع: إعلانان (الفاشل تاريخيًا: 3) */
      A('حدث ج', { id: 'C' }); await wait(180);
      A('حدث د', { id: 'D' }); await wait(180);
      A('حدث ج', { id: 'C' }); await wait(180);
      out.s2_total = mut; out.s2_delta = mut - out.s1_afterB;
      out.s2_text = region.textContent;
      /* 3) بلا id مرتين بالنص نفسه — المتوقع: إعلانان */
      A('مستقل'); await wait(180);
      A('مستقل'); await wait(180);
      out.s3_delta = mut - out.s2_total;
      /* 4) id نفسه بنص مختلف — المتوقع: يُعلن (حدث محدّث المحتوى) */
      A('نص أول', { id: 'U' }); await wait(180);
      A('نص ثانٍ', { id: 'U' }); await wait(180);
      out.s4_delta = mut - out.s2_total - out.s3_delta;
      out.s4_text = region.textContent;
      /* 5) assertive ثم polite (توافق خلفي محفوظ) */
      A('عاجل', { id: 'V', assertive: true }); await wait(180);
      out.s5_live_assertive = region.getAttribute('aria-live');
      out.s5_delta1 = mut - out.s2_total - out.s3_delta - out.s4_delta;
      A('هادئ', { id: 'W' }); await wait(180);
      out.s5_live_polite = region.getAttribute('aria-live');
      out.s5_delta2 = mut - out.s2_total - out.s3_delta - out.s4_delta - out.s5_delta1;
      /* 6) resetAnnouncements ثم نفس الهوية — المتوقع: يُعلن من جديد */
      A('حدث ر', { id: 'R' }); await wait(180);
      const base6 = mut;
      if (hasReset) MM.resetAnnouncements();
      A('حدث ر', { id: 'R' }); await wait(180);
      out.s6_delta = mut - base6;
      /* 7) عمر الهوية: ترقيع Date.now ثم نفس id+نص — المتوقع: يُعلن (انتهاء العمر) */
      A('حدث قديم', { id: 'T' }); await wait(180);
      const base7 = mut;
      const realNow = Date.now.bind(Date);
      Date.now = () => realNow() + 61000; /* مرور 61s */
      A('حدث قديم', { id: 'T' }); await wait(180);
      Date.now = realNow;
      out.s7_delta = mut - base7;
      /* 8) إقصاء السعة: هوية أولى + 12 هوية أخرى تقصيها ثم إعادتها — المتوقع: تُعلن */
      if (hasReset) MM.resetAnnouncements();
      A('الهوية الأولى', { id: 'K0' }); await wait(140);
      for (let i = 1; i <= 12; i++) { A('هوية ' + i, { id: 'K' + i }); await wait(120); }
      const base8 = mut;
      A('الهوية الأولى', { id: 'K0' }); await wait(180);
      out.s8_delta = mut - base8;
      /* لا فصل: المراقب يبقى لقسم toast عبر window.__a3r2Mut */
      resolve(out);
    })();
  }, 200));
}
"""

# قياس navbar: مستطيل كل زر + حدود حروف التسمية بـRange + التداخل والصفوف
NAV_MEASURE = r"""
() => {
  const vw = window.innerWidth;
  const nav = document.getElementById('f03-navbar');
  if (!nav || nav.hidden) return { error: 'navbar missing or hidden', view: window.F03App.inspect().view };
  const items = [...nav.querySelectorAll('.m-navbar__item')];
  const rowsSet = new Set();
  const buttons = items.map((btn) => {
    const r = btn.getBoundingClientRect();
    rowsSet.add(Math.round(r.top / 4)); /* تجميع الصفوف بقمة الزر */
    const textNode = [...btn.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    let range = null;
    if (textNode) {
      const rg = document.createRange();
      rg.selectNodeContents(textNode);
      const tr = rg.getBoundingClientRect();
      range = { text: textNode.textContent.trim(),
                left: +tr.left.toFixed(2), right: +tr.right.toFixed(2),
                top: +tr.top.toFixed(2), bottom: +tr.bottom.toFixed(2),
                w: +tr.width.toFixed(2) };
    }
    return { id: btn.id, label: btn.textContent.trim(),
             left: +r.left.toFixed(2), right: +r.right.toFixed(2),
             top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2),
             w: +r.width.toFixed(2), h: +r.height.toFixed(2), range };
  });
  const overlaps = [];
  for (let i = 0; i < buttons.length; i++) {
    for (let j = i + 1; j < buttons.length; j++) {
      const a = buttons[i], b = buttons[j];
      const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      overlaps.push(+(ox * oy).toFixed(2));
    }
  }
  const nb = nav.getBoundingClientRect();
  return { vw,
           dir: document.documentElement.getAttribute('dir') || 'rtl',
           buttons, overlaps, maxOverlap: overlaps.length ? Math.max(...overlaps) : 0,
           rows: rowsSet.size,
           navbarH: +nb.height.toFixed(2),
           navbarVar: document.documentElement.style.getPropertyValue('--f03-navbar-h') || null,
           scrollW: document.scrollingElement.scrollWidth, clientW: document.scrollingElement.clientWidth };
}
"""

# توست + شريط التحديد مقابل navbar الملفوف (رجعية SUI-001/002)
TOASTBAR_MEASURE = r"""
() => {
  const toast = document.getElementById('f03-toast');
  const nav = document.getElementById('f03-navbar');
  const R = (el) => { const r = el.getBoundingClientRect();
    return { top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2),
              left: +r.left.toFixed(2), right: +r.right.toFixed(2),
              w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; };
  const tr = R(toast), nr = R(nav);
  const out = { toast: tr, navbar: nr, navbarVar: document.documentElement.style.getPropertyValue('--f03-navbar-h') || null,
                toastHidden: toast.hidden,
                toastGapToNavbar: +(nr.top - tr.bottom).toFixed(2),
                toastOverlapNavbar: +Math.max(0, Math.min(tr.bottom, nr.bottom) - Math.max(tr.top, nr.top)).toFixed(2) };
  const bar = document.getElementById('f03-select-bar');
  if (bar && !bar.hidden) {
    const br = R(bar);
    out.selectBar = br;
    out.selectOverlapNavbar = +Math.max(0, Math.min(br.bottom, nr.bottom) - Math.max(br.top, nr.top)).toFixed(2);
    out.selectGapToNavbar = +(nr.top - br.bottom).toFixed(2);
  }
  return out;
}
"""


def start_server():
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    srv = None
    for port in range(PORT_RANGE[0], PORT_RANGE[1] + 1):
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", port), QuietHandler)
            break
        except OSError:
            continue
    if srv is None:
        raise RuntimeError("لا منفذ حرًا في نطاق 4440-4459")
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}"


def git_meta():
    def git(*args):
        try:
            return subprocess.run(["git", *args], capture_output=True, text=True,
                                  cwd=str(ROOT)).stdout.strip()
        except Exception:
            return ""
    status = git("status", "--porcelain")
    return {
        "commit": git("rev-parse", "HEAD"),
        "tree": git("rev-parse", "HEAD^{tree}"),
        "source_clean": status == "",
        "dirty_own": [ln for ln in status.splitlines()
                      if any(k in ln for k in ("components/messages", "components/navigation",
                                               "tools/sui-r2-a3", "mobile-record-sample/standalone.html",
                                               "SAMSUNG-ONEUI-REPAIR-R2"))][:12],
        "browser_hint": "Chromium executable_path=" + CHROMIUM,
    }


class Tool:
    def __init__(self):
        self.items = {}

    def check(self, item, name, ok, detail=""):
        self.items.setdefault(item, {"checks": [], "ok": True})
        rec = {"name": name, "ok": bool(ok), "detail": str(detail)[:600]}
        self.items[item]["checks"].append(rec)
        if not ok:
            self.items[item]["ok"] = False
        print(("[PASS] " if ok else "[FAIL] ") + f"[{item}] " + name
              + (f" — {rec['detail']}" if detail and not ok else ""))
        return bool(ok)

    def summary(self):
        lines = []
        for item, data in self.items.items():
            total = len(data["checks"])
            passed = sum(1 for c in data["checks"] if c["ok"])
            state = "PASS" if data["ok"] else "FAIL"
            lines.append(f"{state}  {item}: {passed}/{total} فحصًا")
        failed = sum(1 for d in self.items.values() if not d["ok"])
        return {
            "items": {k: {"ok": v["ok"], "passed": sum(1 for c in v["checks"] if c["ok"]),
                          "total": len(v["checks"])} for k, v in self.items.items()},
            "failed_items": failed,
            "total_checks": sum(len(v["checks"]) for v in self.items.values()),
            "summary_lines": lines,
        }


def zoom(page):
    page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(450)  # مهلة ResizeObserver لـ--f03-navbar-h


def unzoom(page):
    page.evaluate(UNZOOM)
    page.wait_for_timeout(200)


# ============================ فحوص SUI-R1-03 ============================
def check_r103(t, ctx, base):
    page = ctx.new_page()
    page_errors = []
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.goto(base + MSG_BOARD)
    page.wait_for_load_state("networkidle")
    page.wait_for_function("() => !!window.MicroMessages", timeout=10000)
    page.evaluate("() => document.fonts.ready")

    r = page.evaluate(ANNOUNCE_R2_CONTRACT)
    if not isinstance(r, dict) or "error" in r:
        t.check("SUI-R1-03", "منطقة الإعلان موجودة وتهيأ", False, str(r))
        page.close()
        return
    c = r
    # كل إعلان فعلي = سجلَي mutation (مسح + وضع) → الإعلانات = دلتا/2
    s1_ann = (c["s1_afterB"] - 0) / 2
    t.check("SUI-R1-03", "تسلسل A,A,B: حدثان معلنان فقط (A ثم B؛ الثانية A مبتلعة)",
            c["s1_afterA"] == 1 and c["s1_afterA2"] == 1 and c["s1_afterB"] == 3,
            f"s1: afterA={c['s1_afterA']} afterA2={c['s1_afterA2']} afterB={c['s1_afterB']} (سجلات؛ المتوقع 1/1/3)")
    t.check("SUI-R1-03", "تسلسل A,B,A (نفس الهوية بعد مستقلة): حدثان معلنان فقط — لا 3",
            c["s2_delta"] == 4,
            f"s2_delta={c['s2_delta']} (المتوقع 4 سجلات/إعلانين؛ الفاشل قبل الإصلاح 6 سجلات/3 إعلانات) نص={c['s2_text']}")
    t.check("SUI-R1-03", "دعوتان بلا id بنفس النص: تحديثان (حدث مستقل يعلن)",
            c["s3_delta"] == 4, f"s3_delta={c['s3_delta']}")
    t.check("SUI-R1-03", "id نفسه بنص مختلف: يُعلن (حدث محدّث المحتوى)",
            c["s4_delta"] == 4 and c["s4_text"] == "نص ثانٍ",
            f"s4_delta={c['s4_delta']} نص={c['s4_text']}")
    t.check("SUI-R1-03", "assertive يبدل aria-live إلى assertive ثم polite",
            c["s5_live_assertive"] == "assertive" and c["s5_live_polite"] == "polite"
            and c["s5_delta1"] == 2 and c["s5_delta2"] == 2,
            f"assertive={c['s5_live_assertive']} polite={c['s5_live_polite']} d1={c['s5_delta1']} d2={c['s5_delta2']}")
    t.check("SUI-R1-03", "resetAnnouncements موجود كعقد عام",
            c["hasReset"], f"hasReset={c['hasReset']}")
    t.check("SUI-R1-03", "reset ثم نفس الهوية: يُعلن من جديد (كل الأحداث بعده جديدة)",
            c["hasReset"] and c["s6_delta"] == 2, f"s6_delta={c['s6_delta']} (المتوقع 2: أُعلن من جديد)")
    t.check("SUI-R1-03", "مرور 61s (ترقيع Date.now) ثم نفس id+نص: يُعلن (انتهاء عمر الهوية)",
            c["s7_delta"] == 2, f"s7_delta={c['s7_delta']} (المتوقع 2: أُعلن بعد انتهاء العمر)")
    t.check("SUI-R1-03", "إقصاء السعة: 12 هوية أخرى تقصي الأقدم ثم الهوية الأولى تُعلن",
            c["s8_delta"] == 2, f"s8_delta={c['s8_delta']} (المتوقع 2: الأقدم أُقصيت فأُعلنت)")

    # 9) قناة toast نفسها: نقرتان على زر المحاكاة = إعلانان عبر .m-live-region
    before = page.evaluate("() => window.__a3r2Mut()")
    page.click("[data-toast-demo]")
    page.wait_for_timeout(250)
    mid = page.evaluate("() => window.__a3r2Mut()")
    page.click("[data-toast-demo]")
    page.wait_for_timeout(250)
    after = page.evaluate("() => window.__a3r2Mut()")
    region_text = page.evaluate("() => window.__a3r2Region.textContent")
    toast_state = page.evaluate(
        "() => { const el = document.querySelector('[data-toast]');"
        " return { hidden: el.hidden, text: el.querySelector('.m-toast__text').textContent }; }")
    t.check("SUI-R1-03", "toast القديم يعمل: يعلن عبر القناة الحية نفسها (نقرتان = إعلانان)",
            mid - before == 2 and after - mid == 2 and region_text == TOAST_TEXT
            and toast_state["hidden"] is False and toast_state["text"] == TOAST_TEXT,
            f"mid-bef={mid - before} after-mid={after - mid} region={region_text} toastHidden={toast_state['hidden']}")
    t.check("SUI-R1-03", "صفر أخطاء صفحة على لوحة messages", len(page_errors) == 0,
            str(page_errors[:3]))
    page.close()
    return page_errors


# ============================ فحوص SUI-R1-04 ============================
def enter_f03(page, base=None, standalone=None):
    """فتح العينة (http أو file://) وبيانات بذرة نظيفة ثم الدخول بالمزوّد التجريبي."""
    url = standalone if standalone else base + "/previews/ux-patterns/mobile-record-sample/index.html"
    page.goto(url)
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate("() => { try { window.localStorage.clear(); } catch (e) {} window.F03App.resetDemoData(); }")
    page.reload()
    page.wait_for_load_state("load")
    page.wait_for_function("() => !!window.F03App", timeout=10000)
    page.evaluate("() => document.fonts.ready")
    page.click("#f03-gw-demo")  # الدخول عبر المزوّد التجريبي
    page.wait_for_function("() => window.F03App.inspect().view === 'home'", timeout=8000)
    page.wait_for_timeout(300)  # أول قياس RO لـ--f03-navbar-h


def nav_checks(t, m, label, zoom_label, is_320_200):
    btns = m.get("buttons", [])
    ok_in = all(b["left"] >= -0.5 and b["right"] <= m["vw"] + 0.5 for b in btns) and len(btns) == 4
    bad = [f"{b['id']}: L{b['left']}..R{b['right']}" for b in btns
           if b["left"] < -0.5 or b["right"] > m["vw"] + 0.5]
    t.check("SUI-R1-04", f"{label} @{zoom_label}: الأزرار الأربعة داخل [0, {m['vw']}] بلا قص خارج الشاشة",
            ok_in, "مقصوص: " + "; ".join(bad) if bad else m.get("vw"))

    ok_rg = all(b["range"] is not None
                and b["range"]["left"] >= -0.5
                and b["range"]["right"] <= m["vw"] + 0.5
                and b["range"]["left"] >= b["left"] - 1
                and b["range"]["right"] <= b["right"] + 1
                for b in btns)
    bad_rg = [f"{b['id']}: text {b['range'] and b['range']['left']}..{b['range'] and b['range']['right']} زر {b['left']}..{b['right']}"
              for b in btns if b["range"] is None
              or b["range"]["left"] < -0.5 or b["range"]["right"] > m["vw"] + 0.5
              or b["range"]["left"] < b["left"] - 1 or b["range"]["right"] > b["right"] + 1]
    t.check("SUI-R1-04", f"{label} @{zoom_label}: حدود حروف النص بRange داخل العرض وداخل حدود الزر",
            ok_rg, "; ".join(bad_rg) if bad_rg else "Range الأربعة سليمة")

    t.check("SUI-R1-04", f"{label} @{zoom_label}: صفر تداخل بين أي زرين",
            m.get("maxOverlap", 99) <= 0.25,
            f"maxOverlap={m.get('maxOverlap')} overlaps={m.get('overlaps')}")

    ok_h = all(b["h"] >= 47.5 for b in btns)
    t.check("SUI-R1-04", f"{label} @{zoom_label}: هدف لمس ≥47.5px لكل زر (min-height محفوظ)",
            ok_h, str([f"{b['id']}:{b['h']}" for b in btns if b["h"] < 47.5]))

    if is_320_200:
        t.check("SUI-R1-04", f"{label} @200%: عدد صفوف navbar ≥2 (الالتفاف حدث) و--f03-navbar-h تحدّث",
                m.get("rows", 0) >= 2 and m.get("navbarVar") not in (None, "")
                and float(str(m.get("navbarVar")).replace("px", "")) >= m["navbarH"] - 1,
                f"rows={m.get('rows')} navbarH={m.get('navbarH')} var={m.get('navbarVar')}")


def check_r104(t, ctx, base):
    matrix = {"src": base + "/previews/ux-patterns/mobile-record-sample/index.html",
              "standalone": STANDALONE_URI}
    heights = {}  # تسجيل ارتفاع الشريط قبل/بعد التكبير
    for source, url in matrix.items():
        for direction in ("rtl", "ltr"):
            page = ctx.new_page()
            page_errors = []
            page.on("pageerror", lambda e: page_errors.append(str(e)))
            enter_f03(page, standalone=(url if source == "standalone" else None),
                      base=None if source == "standalone" else base)
            if direction == "ltr":
                page.evaluate("() => document.documentElement.setAttribute('dir', 'ltr')")
                page.wait_for_timeout(150)
            label = f"{source}/{direction}"
            for width in WIDTHS:
                page.set_viewport_size({"width": width, "height": 800})
                page.wait_for_timeout(250)
                m100 = page.evaluate(NAV_MEASURE)
                nav_checks(t, m100, label, f"{width}px 100%", False)
                heights[f"{label}-{width}-100"] = {k: m100.get(k) for k in ("navbarH", "navbarVar", "rows")}
                zoom(page)
                m200 = page.evaluate(NAV_MEASURE)
                nav_checks(t, m200, label, f"{width}px 200%", width == 320)
                heights[f"{label}-{width}-200"] = {k: m200.get(k) for k in ("navbarH", "navbarVar", "rows")}
                if width in (320, 390):
                    t.shot_hook(page, f"nav-{TAG}-{source}-{direction}-{width}-200.png")
                unzoom(page)
            # ---- رجعية SUI-001/002 عند 320+200% بعد الالتفاف ----
            page.set_viewport_size({"width": 320, "height": 800})
            page.wait_for_timeout(200)
            zoom(page)
            # توست: حذف عنصر واحد (مسار R1 نفسه)
            page.click("#f03-nav-list")
            page.wait_for_function("() => window.F03App.inspect().view === 'list'", timeout=5000)
            page.click("#f03-list-rows .f03-row[data-id='it-01']")
            page.wait_for_function("() => window.F03App.inspect().view === 'detail'", timeout=5000)
            page.click("#f03-detail-delete")
            page.wait_for_timeout(300)
            page.click("#f03-delete-confirm")
            page.wait_for_function("() => !document.getElementById('f03-toast').hidden", timeout=5000)
            page.wait_for_timeout(150)
            m = page.evaluate(TOASTBAR_MEASURE)
            t.check("SUI-R1-04", f"رجعية SUI-001 {label} @320+200%: التوست فوق navbar الملفوف (فجوة ≥0 وتراكب 0)",
                    m["toast"]["h"] > 0 and m["toastOverlapNavbar"] == 0 and m["toastGapToNavbar"] >= 0,
                    f"toastH={m['toast']['h']} overlap={m['toastOverlapNavbar']} gap={m['toastGapToNavbar']} navbarH={m['navbar']['h']} var={m['navbarVar']}")
            t.shot_hook(page, f"toast-{TAG}-{source}-{direction}-320-200.png")
            # التحديد الجماعي: شريط التحديد لا يتقاطع مع navbar الملفوف
            page.wait_for_timeout(300)
            page.click("#f03-select-toggle")
            page.wait_for_timeout(300)
            m2_top = page.evaluate(TOASTBAR_MEASURE)  # حالة التمرير 0 (تسجيل فقط — انظر التقرير)
            page.evaluate("() => window.scrollTo(0, 300)")  # منهجية R1/المستقل: القياس في الوضع المثبّت
            page.wait_for_timeout(250)
            m2 = page.evaluate(TOASTBAR_MEASURE)
            t.check("SUI-R1-04", f"رجعية SUI-002 {label} @320+200%: شريط التحديد لا يتقاطع مع navbar الملفوف",
                    "selectBar" in m2 and m2["selectOverlapNavbar"] == 0,
                    f"overlap={m2.get('selectOverlapNavbar')} gap={m2.get('selectGapToNavbar')} navbarH={m2['navbar']['h']} var={m2['navbarVar']}"
                    f" (scroll0: overlap={m2_top.get('selectOverlapNavbar')} gap={m2_top.get('selectGapToNavbar')})")
            t.shot_hook(page, f"selectbar-{TAG}-{source}-{direction}-320-200.png")
            t.check("SUI-R1-04", f"{label}: صفر أخطاء صفحة عبر المصفوفة و100% و200%",
                    len(page_errors) == 0, str(page_errors[:3]))
            page.close()
    return heights


class ShotHookTool(Tool):
    """Tool مع خطاف لقطات — يُنشأ في main ويمرر للمجموعات."""
    shots_dir = None

    def shot_hook(self, page, name):
        try:
            page.screenshot(path=str(self.shots_dir / name))
        except Exception as e:  # noqa
            print(f"  [SHOT-ERR] {name}: {e}")


def main():
    global TAG
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", required=True, help="وسم الجولة: before / after")
    ap.add_argument("--out", default=str(ROOT / "reviews" / "SAMSUNG-ONEUI-REPAIR-R2" / "evidence" / "agent3"),
                    help="مجلد الإخراج (JSON + TXT + لقطات)")
    args = ap.parse_args()
    TAG = args.tag
    out = Path(args.out).resolve() / TAG
    shots_dir = out / "screenshots"
    shots_dir.mkdir(parents=True, exist_ok=True)

    srv, base = start_server()
    t = ShotHookTool()
    t.shots_dir = shots_dir
    meta = git_meta()
    meta.update({
        "tag": TAG,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "zoom_type": "محاكاة نص ×2 بمرورين نظيفين (ZOOM2_CLEAN) — ليست native zoom",
        "server_port": srv.server_address[1],
        "standalone_uri": STANDALONE_URI,
    })

    print(f"# sui-r2-a3-check — وسم: {TAG}")
    print(f"# commit: {meta['commit']} — شجرة: {meta['tree']}")
    print(f"# خادم الوكيل 3 على المنفذ {srv.server_address[1]}")
    print("")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=CHROMIUM)
        meta["browser"] = browser.version
        ctx = browser.new_context(viewport={"width": 390, "height": 844})

        check_r103(t, ctx, base)
        heights = check_r104(t, ctx, base)

        ctx.close()
        browser.close()
    srv.shutdown()

    summary = t.summary()
    payload = {
        "meta": meta,
        "items": {k: v for k, v in t.items.items()},
        "navbar_heights": heights,
        "summary": summary,
        "not_run": [
            "أجهزة فعلية ولمس حقيقي (القياس مستطيلات وRange عبر Chromium headless)",
            "قارئ شاشة فعلي (TalkBack/VoiceOver/NVDA) — عدّ تحديثات المنطقة الحية قياس DOM بنيوي لا إثبات صوت",
            "WebKit/Safari",
            "native zoom لنظام التشغيل — 200% محاكاة نص بمرورين نظيفين معلنة",
            "safe-area فعلي (headless = 0)",
        ],
    }
    json_path = out / f"sui-r2-a3-{TAG}.json"
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    txt_path = out / f"sui-r2-a3-{TAG}.txt"
    txt_path.write_text(
        "\n".join([f"# sui-r2-a3-check — {TAG} — {datetime.now().isoformat(timespec='seconds')}"]
                  + summary["summary_lines"]
                  + ["", f"فحوص فاشلة (بنود): {summary['failed_items']} / إجمالي الفحوص: {summary['total_checks']}",
                     "NOT RUN: " + "؛ ".join(payload["not_run"])]),
        encoding="utf-8")
    print("")
    for ln in summary["summary_lines"]:
        print(ln)
    print(f"\nJSON: {json_path}")
    return 1 if summary["failed_items"] else 0


if __name__ == "__main__":
    sys.exit(main())
