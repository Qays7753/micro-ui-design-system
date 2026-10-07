#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص وكيل الإصلاح A2 (SAMSUNG-ONEUI-REPAIR-R1)
ملك حصري للوكيل 2 (الحقول والاختيار). فحوص البنود المكلفة:

SUI-003 لون نص حالة المفتاح مستقل عن ترتيب DOM (:has) في اللوحة
        وتركيبين معاكسين + صفحات خارج الملكية للتحقق فقط (قراءة).
SUI-004 أرضية قراءة قيمة الكمية (ch مثبتة بالخط) + عقد 64px عند 1×
        + «9999» كاملة عند 320+200% (محاكاة ZOOM2 بمرورين نظيفين).
SUI-005 أرضية قراءة مدخل المبلغ (11ch) + لف الوحدة عند الحاجة:
        مبلغ 12,456,789.50 ومبلغ 15 خانة مقروءان كاملين عند 320+200%.
SUI-006 زرا خطوة بعقد B01 (48×48 + aria-label) في مثال الاستخدام
        الرسمي + مثال خطوة عامل فعليًا (زيادة/إنقاص).
SUI-011 فصل فجوات المقاطع: column-gap 4px وrow-gap 12px —
        hit-test على تركيب حقيقي ملتف عند 320 و200%: فراغ ≥4px بين
        الأهداف الموسعة، والنقر بين الصفين لا يصيب هدفًا، والسطر
        الواحد بلا تغيير (فجوة أفقية 4px نفسها).
SUI-032 توثيق حدود توسع المنتقي في المواصفة (KEEP+DOC) + سلوك
        «كل الخيارات قبل الكتابة» محفوظ.

+ فحوص مراجعة المرحلة الثانية لعائلتي B02/B03 (KEEP بمبرر مقيس).

التشغيل من جذر المستودع:
  python3 tools/sui-repair-a2-check.py --tag before --out reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent2
  python3 tools/sui-repair-a2-check.py --tag after  --out reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent2

خروج غير صفري عند فشل أي فحص (الملخص يطبع PASS/FAIL لكل بند).
NOT RUN: لمس حقيقي/جهاز هاتف، قارئ شاشة فعلي، WebKit، native zoom
(التكبير هنا محاكاة نص ×2 بمرورين نظيفين معلنة — آلية ZOOM2_CLEAN
منسوخة من tools/ui-repair-r2-check.py).
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
PORT_RANGE = (4200, 4219)  # نطاق الوكيل 2 المخصص

FIELDS_BOARD = "/previews/fields/index.html"
FIELDS_EXAMPLE = "/previews/fields/example-usage.html"
SELECTION_BOARD = "/previews/selection/index.html"
SWITCH_LIFECYCLE = "/previews/ux-patterns/switch-lifecycle/index.html"  # قراءة فقط (ملك A3)
ACCOUNT_SETTINGS = "/components/account-settings/example-usage.html"   # قراءة فقط (ملك A3)

PETROLEUM = "rgb(22, 77, 89)"     # --micro-brand-primary (ON)
HINT_GRAY = "rgb(95, 115, 120)"   # --micro-text-hint (OFF)

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

# ---- مقاطع طويلة حقيقية (تركيب المكوّن نفسه) لإجبار الالتفاف عند 320 ----
WRAP_SEG_HOST = """() => {
  const host = document.createElement('div');
  host.id = 'a2-wrap-seg-host';
  host.innerHTML = `<div class="m-seg" data-seg role="group" aria-label="فحص فجوات الالتفاف">
    <button type="button" class="m-seg__item" aria-pressed="true" data-value="v1">الكل</button>
    <button type="button" class="m-seg__item" aria-pressed="false" data-value="v2">المستحق</button>
    <button type="button" class="m-seg__item" aria-pressed="false" data-value="v3">المدفوع</button>
    <button type="button" class="m-seg__item" aria-pressed="false" data-value="v4">المرتجع</button>
    <button type="button" class="m-seg__item" aria-pressed="false" data-value="v5">معلق المراجعة</button>
    <button type="button" class="m-seg__item" aria-pressed="false" data-value="v6">ملغي الدفعة</button>
  </div>`;
  const mount = document.querySelector('#switches .example-grid') || document.body;
  mount.appendChild(host);
  return true;
}"""

# ---- مفتاح بترتيب DOM معاكس (input ثم track ثم text) — كتركيب account-settings ----
REVERSED_SWITCH_HOST = """() => {
  const host = document.createElement('div');
  host.id = 'a2-reversed-switch-host';
  host.innerHTML = `
    <label class="m-switch" id="a2-sw-rev-on">
      <input type="checkbox" role="switch" checked>
      <span class="m-switch__track"><span class="m-switch__thumb"></span></span>
      <span class="m-switch__text"><span class="m-switch__label">ترتيب معاكس (مفعّل)</span>
      <span class="m-switch__state">مُفعّل</span></span>
    </label>
    <label class="m-switch" id="a2-sw-rev-off">
      <input type="checkbox" role="switch">
      <span class="m-switch__track"><span class="m-switch__thumb"></span></span>
      <span class="m-switch__text"><span class="m-switch__label">ترتيب معاكس (معطّل)</span>
      <span class="m-switch__state">مُعطّل</span></span>
    </label>`;
  const mount = document.querySelector('#switches .example-grid') || document.body;
  mount.appendChild(host);
  return true;
}"""


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
        raise RuntimeError("لا منفذ حرًا في نطاق 4200-4219")
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
                      if any(k in ln for k in ("components/fields", "components/selection",
                                               "previews/fields", "previews/selection",
                                               "tools/sui-repair-a2"))][:8],
        "browser_hint": "Chromium executable_path=" + CHROMIUM,
    }


class Tool:
    def __init__(self):
        self.items = {}

    def check(self, item, name, ok, detail=""):
        self.items.setdefault(item, {"checks": [], "ok": True})
        rec = {"name": name, "ok": bool(ok), "detail": str(detail)[:400]}
        self.items[item]["checks"].append(rec)
        if not ok:
            self.items[item]["ok"] = False
        print(("[PASS] " if ok else "[FAIL] ") + f"[{item}] " + name
              + (f" — {detail}" if detail and not ok else ""))
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
    page.wait_for_timeout(250)


def unzoom(page):
    page.evaluate(UNZOOM)
    page.wait_for_timeout(200)


def rect(page, sel):
    return page.evaluate(
        """(sel) => { const el = document.querySelector(sel); if (!el) return null;
            const r = el.getBoundingClientRect();
            return {x: r.x, y: r.y, w: r.width, h: r.height,
                    top: r.top, bottom: r.bottom, left: r.left, right: r.right}; }""",
        sel)


def fit(page, sel):
    return page.evaluate(
        """(sel) => { const el = document.querySelector(sel); if (!el) return null;
            return {sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight}; }""",
        sel)


def doc_fit(page):
    return page.evaluate(
        "() => ({sw: document.scrollingElement.scrollWidth, cw: document.scrollingElement.clientWidth})")


def set_val(page, sel, val):
    page.evaluate("([s, v]) => { const el = document.querySelector(s); el.value = v; }", [sel, val])
    page.wait_for_timeout(120)


# ============================ فحوص SUI-003 ============================
def check_sui003(t, ctx, base):
    page = ctx.new_page()
    page.goto(base + SELECTION_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")

    # ترتيب اللوحة الرسمي [text, input, track]
    on_color = page.evaluate(
        "() => getComputedStyle(document.querySelectorAll('#switches [data-switch]')[1].querySelector('.m-switch__state')).color")
    off_color = page.evaluate(
        "() => getComputedStyle(document.querySelectorAll('#switches [data-switch]')[0].querySelector('.m-switch__state')).color")
    t.check("SUI-003", "لوحة selection (ترتيب رسمي): لون الحالة عند ON بترولي rgb(22,77,89)",
            on_color == PETROLEUM, f"محسوب={on_color}")
    t.check("SUI-003", "لوحة selection: لون الحالة عند OFF رمادي تلميح rgb(95,115,120)",
            off_color == HINT_GRAY, f"محسوب={off_color}")

    # تركيب معاكس (input أولاً — كترتيب account-settings)
    page.evaluate(REVERSED_SWITCH_HOST)
    rev_on = page.evaluate(
        "() => getComputedStyle(document.querySelector('#a2-sw-rev-on .m-switch__state')).color")
    rev_off = page.evaluate(
        "() => getComputedStyle(document.querySelector('#a2-sw-rev-off .m-switch__state')).color")
    t.check("SUI-003", "تركيب معاكس (input قبل النص): لون الحالة عند ON بترولي — مستقل عن الترتيب",
            rev_on == PETROLEUM, f"محسوب={rev_on}")
    t.check("SUI-003", "تركيب معاكس: OFF رمادي تلميح",
            rev_off == HINT_GRAY, f"محسوب={rev_off}")
    t.check("SUI-003", "اللون متطابق بين الترتيبين (ON وON / OFF وOFF)",
            rev_on == on_color and rev_off == off_color,
            f"ON: {on_color} vs {rev_on} — OFF: {off_color} vs {rev_off}")

    # الموضع: المسار عند نهاية السطر في الترتيب الرسمي (RTL = يسار) — K8 محفوظ
    pos = page.evaluate(
        """() => { const sw = document.querySelectorAll('#switches [data-switch]')[1];
             const tr = sw.querySelector('.m-switch__track').getBoundingClientRect();
             const tx = sw.querySelector('.m-switch__text').getBoundingClientRect();
             return {trackX: tr.x, textX: tx.x}; }""")
    t.check("SUI-003", "المسار عند نهاية السطر (يسار RTL) في الترتيب الرسمي — لا قفز موضع",
            pos["trackX"] < pos["textX"], str(pos))

    # min-width 4ch محفوظ + النص غير مقصوص في الحالتين
    mw = page.evaluate(
        """() => { const states = [...document.querySelectorAll('#switches .m-switch__state')].slice(0, 2);
             return states.map(s => ({mw: getComputedStyle(s).minWidth,
                                      sw: s.scrollWidth, cw: s.clientWidth, text: s.textContent.trim()})); }""")
    ok_mw = all(m["mw"] not in ("auto", "0px", "") and
                float(m["mw"].replace("px", "")) >= 20 and m["sw"] <= m["cw"] + 1 for m in mw)
    t.check("SUI-003", "min-width:4ch محفوظ ونص الحالة (مُفعّل/مُعطّل) غير مقصوص",
            ok_mw, json.dumps(mw, ensure_ascii=False))

    # لوحة المفاتيح: Space تبدّل والنص واللون يتبعان
    kb = page.evaluate(
        """() => { const sw = document.querySelectorAll('#switches [data-switch]')[0];
             const input = sw.querySelector('input'); const state = sw.querySelector('[data-switch-state]');
             input.focus();
             const before = {checked: input.checked, color: getComputedStyle(state).color, text: state.textContent.trim()};
             return before; }""")
    page.keyboard.press("Space")
    page.wait_for_timeout(200)
    kb2 = page.evaluate(
        """() => { const sw = document.querySelectorAll('#switches [data-switch]')[0];
             const input = sw.querySelector('input'); const state = sw.querySelector('[data-switch-state]');
             return {checked: input.checked, color: getComputedStyle(state).color, text: state.textContent.trim()}; }""")
    t.check("SUI-003", "Space تبدّل المفتاح: checked ينقلب ونص الحالة يتبع ولونها يصير بتروليًا",
            kb2["checked"] is True and kb2["text"] in ("مُفعّل", "مُعطّل")
            and kb2["color"] == PETROLEUM and kb["checked"] is False,
            f"قبل={kb} بعد={kb2}")
    page.keyboard.press("Space")  # إعادة
    page.wait_for_timeout(150)

    # switch-lifecycle (ملك A3 — قياس قراءة فقط، لا تعديل ملف)
    # ضبط checked برمجيًا بلا حدث: قياس CSS خالص (النص من عينة المستهلك)
    pl = ctx.new_page()
    pl.goto(base + SWITCH_LIFECYCLE)
    pl.wait_for_load_state("networkidle")
    sl = pl.evaluate(
        """() => { const sw = document.getElementById('f02s-switch');
             if (!sw) return null;
             const state = sw.querySelector('.m-switch__state');
             const input = sw.querySelector('input');
             if (!input.checked) input.checked = true; /* بلا dispatch: قياس القاعدة CSS فقط */
             return {color: getComputedStyle(state).color, checked: input.checked}; }""")
    t.check("SUI-003", "switch-lifecycle (قراءة فقط، قياس CSS): عند ON لون الحالة بترولي — القاعدة لم تعد ميتة",
            sl is not None and sl["checked"] is True and sl["color"] == PETROLEUM,
            json.dumps(sl, ensure_ascii=False))
    pl.close()

    # account-settings (ملك A3 — قياس قراءة فقط): التوحيد بلا انحدار
    pa = ctx.new_page()
    pa.goto(base + ACCOUNT_SETTINGS)
    pa.wait_for_load_state("networkidle")
    acc = pa.evaluate(
        """() => { const sw = document.querySelector('.m-switch');
             if (!sw) return null;
             const state = sw.querySelector('.m-switch__state');
             const input = sw.querySelector('input');
             if (input.checked) input.click();   // اجعلها OFF ثم ON للقياسين
             const offC = getComputedStyle(state).color;
             input.click();
             const onC = getComputedStyle(state).color;
             return {off: offC, on: onC}; }""")
    t.check("SUI-003", "account-settings (قراءة فقط): ON بترولي وOFF تلميح — نفس العقد الموحد",
            acc is not None and acc["on"] == PETROLEUM and acc["off"] == HINT_GRAY,
            json.dumps(acc, ensure_ascii=False))
    pa.close()
    page.close()


# ============================ فحوص SUI-004 ============================
def check_sui004(t, ctx, base):
    page = ctx.new_page()
    page.goto(base + FIELDS_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    set_val(page, "#t-qty", "9999")
    set_val(page, "#p-qty-320", "9999")

    # 1× عند 320: عقد العرض 64px (التوكن) مطبق فعليًا
    page.set_viewport_size({"width": 320, "height": 900})
    page.wait_for_timeout(250)
    r1x = rect(page, "#p-qty-320")
    steps1x = page.evaluate(
        """() => [...document.querySelectorAll('.phone-demo.is-320 [data-step]')].map(b => {
             const r = b.getBoundingClientRect(); return {w: r.width, h: r.height}; })""")
    t.check("SUI-004", "عند 1× (320): عرض مدخل الكمية = توكن 64px (العقد مطبق فعليًا)",
            r1x is not None and abs(r1x["w"] - 64) < 0.75, f"العرض={r1x and round(r1x['w'], 2)}px")
    f1x = fit(page, "#p-qty-320")
    t.check("SUI-004", "عند 1× (320): «9999» ظاهرة كاملة (clientWidth ≥ scrollWidth)",
            f1x is not None and f1x["cw"] >= f1x["sw"] - 1, str(f1x))
    t.check("SUI-004", "عند 1× (320): زرا الخطوة 48×48",
            all(s["w"] >= 47.5 and s["h"] >= 47.5 for s in steps1x), str(steps1x))
    mwid = page.evaluate(
        "() => getComputedStyle(document.querySelector('#p-qty-320')).minWidth")
    t.check("SUI-004", "أرضية قراءة ch مثبتة بالخط على مدخل الكمية (min-width محسوب > 0)",
            mwid not in ("auto", "0px", "none") and float(mwid.replace("px", "")) >= 35,
            f"minWidth={mwid} (5ch عند 16px ≈ 44-48px)")
    page.screenshot(path=str(SHOTS / f"{TAG}-sui004-qty-1x-320.png"), full_page=False)

    # 200% عند 320 (مروران نظيفان): القيمة كاملة بلا قص
    zoom(page)
    r2x = rect(page, "#p-qty-320")
    f2x = fit(page, "#p-qty-320")
    steps2x = page.evaluate(
        """() => [...document.querySelectorAll('.phone-demo.is-320 [data-step]')].map(b => {
             const r = b.getBoundingClientRect(); return {w: r.width, h: r.height}; })""")
    docf = doc_fit(page)
    t.check("SUI-004", "عند 320+200%: «9999» كاملة ظاهرة (clientWidth ≥ scrollWidth للحقل)",
            f2x is not None and f2x["cw"] >= f2x["sw"] - 1,
            f"client={f2x and f2x['cw']} scroll={f2x and f2x['sw']} rectW={r2x and round(r2x['w'], 1)}")
    t.check("SUI-004", "عند 320+200%: زرا الخطوة ≥48×48 (هدف اللمس لا يتقلص)",
            all(s["w"] >= 47.5 and s["h"] >= 47.5 for s in steps2x), str(steps2x))
    t.check("SUI-004", "عند 320+200%: لا فيض أفقي للصفحة (scrollWidth ≤ clientWidth)",
            docf["sw"] <= docf["cw"] + 1, str(docf))
    # الوحدة داخل التحكم غير مقصوصة (لف مسموح)
    unit = page.evaluate(
        """() => { const u = document.querySelector('.phone-demo.is-320 .m-field__unit');
             const c = u.closest('.m-field__control');
             const ur = u.getBoundingClientRect(); const cr = c.getBoundingClientRect();
             return {inside: ur.left >= cr.left - 0.5 && ur.right <= cr.right + 0.5,
                     uSw: u.scrollWidth, uCw: u.clientWidth}; }""")
    t.check("SUI-004", "عند 320+200%: وحدة الكمية داخل التحكم (تلف عند الحاجة) بلا قص",
            unit is not None and unit["inside"] and unit["uSw"] <= unit["uCw"] + 1, str(unit))
    page.screenshot(path=str(SHOTS / f"{TAG}-sui004-qty-320-zoom200.png"), full_page=False)
    unzoom(page)
    page.close()

    # التركيب الرسمي في قسم الأنواع (t-qty) عند 360: نفس العقد
    page = ctx.new_page()
    page.set_viewport_size({"width": 360, "height": 900})
    page.goto(base + FIELDS_BOARD)
    page.wait_for_load_state("networkidle")
    set_val(page, "#t-qty", "9999")
    r = rect(page, "#t-qty")
    f = fit(page, "#t-qty")
    t.check("SUI-004", "التركيب الرسمي (t-qty) عند 360 و1×: عرض 64px والقيمة كاملة",
            r is not None and abs(r["w"] - 64) < 0.75 and f["cw"] >= f["sw"] - 1,
            f"عرض={r and round(r['w'], 2)} fit={f}")
    page.close()


# ============================ فحوص SUI-005 ============================
def check_sui005(t, ctx, base):
    page = ctx.new_page()
    page.goto(base + FIELDS_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")

    # 1× عند 320: بلا التفاف (سلوك محفوظ) والقيمة كاملة
    page.set_viewport_size({"width": 320, "height": 900})
    page.wait_for_timeout(250)
    set_val(page, "#p-amount-320", "1,240.50")
    same_row = page.evaluate(
        """() => { const i = document.querySelector('#p-amount-320');
             const u = document.querySelector('.phone-demo.is-320 .m-field__unit');
             const ir = i.getBoundingClientRect(); const ur = u.getBoundingClientRect();
             /* مقارنة المراكز الرأسية: الارتفاعات تختلف (26 مقابل 28) فالقمة تختلف 3px وهو قياس سليم لسطر واحد */
             return {sameRow: Math.abs((ir.top + ir.height/2) - (ur.top + ur.height/2)) < 2,
                     iCy: ir.top + ir.height/2, uCy: ur.top + ur.height/2}; }""")
    f_1x = fit(page, "#p-amount-320")
    t.check("SUI-005", "عند 1× (320): المبلغ والوحدة في سطر واحد (بلا التفاف) والقيمة كاملة",
            same_row["sameRow"] and f_1x["cw"] >= f_1x["sw"] - 1,
            f"sameRow={same_row} fit={f_1x}")

    # 200% عند 320: مبلغ 12,456,789.50 كامل
    set_val(page, "#p-amount-320", "12,456,789.50")
    zoom(page)
    f_z = fit(page, "#p-amount-320")
    unit_z = page.evaluate(
        """() => { const u = document.querySelector('.phone-demo.is-320 .m-field__unit');
             const c = u.closest('.m-field__control');
             const ur = u.getBoundingClientRect(); const cr = c.getBoundingClientRect();
             const cs = getComputedStyle(c);
             return {inside: ur.left >= cr.left - 0.5 && ur.right <= cr.right + 0.5,
                     uSw: u.scrollWidth, uCw: u.clientWidth,
                     cSw: c.scrollWidth, cCw: c.clientWidth,
                     wrapped: Math.abs(ur.top - (u.previousElementSibling
                        ? u.previousElementSibling.getBoundingClientRect().top : 0)) > 2}; }""")
    docf = doc_fit(page)
    t.check("SUI-005", "عند 320+200%: مبلغ 12,456,789.50 مقروء كاملًا (clientWidth ≥ scrollWidth)",
            f_z is not None and f_z["cw"] >= f_z["sw"] - 1,
            f"client={f_z and f_z['cw']} scroll={f_z and f_z['sw']}")
    t.check("SUI-005", "عند 320+200%: الوحدة «د.أ» ظاهرة كاملة داخل التحكم (لف عند الحاجة) بلا قص",
            unit_z is not None and unit_z["inside"] and unit_z["uSw"] <= unit_z["uCw"] + 1,
            str(unit_z))
    t.check("SUI-005", "عند 320+200%: التحكم بلا فيض داخلي (control scrollW ≤ clientW)",
            unit_z is not None and unit_z["cSw"] <= unit_z["cCw"] + 1, str(unit_z))
    t.check("SUI-005", "عند 320+200%: لا فيض أفقي للصفحة", docf["sw"] <= docf["cw"] + 1, str(docf))
    page.screenshot(path=str(SHOTS / f"{TAG}-sui005-amount12-320-zoom200.png"), full_page=False)

    # مبلغ 15 خانة (15 حرفًا بفواصل — قيمة الفحص 123,456,789.50) وقيمة قبول التدقيق 9,999,999.99
    set_val(page, "#p-amount-320", "123,456,789.50")
    page.wait_for_timeout(150)
    f15 = fit(page, "#p-amount-320")
    t.check("SUI-005", "عند 320+200%: مبلغ 15 خانة (123,456,789.50) مقروء كاملًا — اللف مسموح",
            f15 is not None and f15["cw"] >= f15["sw"] - 1,
            f"client={f15 and f15['cw']} scroll={f15 and f15['sw']}")
    set_val(page, "#p-amount-320", "9,999,999.99")
    page.wait_for_timeout(150)
    fa = fit(page, "#p-amount-320")
    unit_a = page.evaluate(
        """() => { const u = document.querySelector('.phone-demo.is-320 .m-field__unit');
             const ur = u.getBoundingClientRect();
             const pr = u.closest('.m-field__control').getBoundingClientRect();
             return {inside: ur.left >= pr.left - 0.5 && ur.right <= pr.right + 0.5}; }""")
    t.check("SUI-005", "عند 320+200%: قيمة قبول التدقيق 9,999,999.99 كاملة والوحدة ظاهرة داخل الصف",
            fa is not None and fa["cw"] >= fa["sw"] - 1 and unit_a["inside"],
            f"client={fa and fa['cw']} scroll={fa and fa['sw']} unit={unit_a}")
    # الحد الفيزيائي الصادق: سلسلة أطول من سعة الصف (مُوثق في المواصفة — لا تصغير خط)
    set_val(page, "#p-amount-320", "123456789012345")
    page.wait_for_timeout(150)
    fcap = fit(page, "#p-amount-320")
    t.check("SUI-005", "الحد الفيزيائي: أطول من سعة صف 320+200% يأخذ الصف كاملًا (أقصى قراءة ممكنة بلا تصغير خط)",
            fcap is not None and fcap["cw"] >= 250 and fcap["cw"] < fcap["sw"],
            f"client={fcap and fcap['cw']} scroll={fcap and fcap['sw']} (مقيد بعرض الصف، موثق)")
    page.screenshot(path=str(SHOTS / f"{TAG}-sui005-amount15-320-zoom200.png"), full_page=False)
    unzoom(page)

    # عند 390+200%: لا انحدار (القيم الأوسع تسع سطرًا واحدًا أو تلتف بلا قص)
    page.set_viewport_size({"width": 390, "height": 900})
    page.wait_for_timeout(250)
    set_val(page, "#p-amount-320", "1,240.50")
    zoom(page)
    f390 = fit(page, "#p-amount-320")
    doc390 = doc_fit(page)
    t.check("SUI-005", "عند 390+200%: لا فيض للصفحة والقيمة كاملة",
            f390["cw"] >= f390["sw"] - 1 and doc390["sw"] <= doc390["cw"] + 1,
            f"fit={f390} doc={doc390}")
    unzoom(page)
    page.close()


# ============================ فحوص SUI-006 ============================
def check_sui006(t, ctx, base):
    page = ctx.new_page()
    page.set_viewport_size({"width": 390, "height": 844})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(base + FIELDS_EXAMPLE)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1400)

    btns = page.evaluate(
        """() => [...document.querySelectorAll('[data-step]')].map(b => {
             const r = b.getBoundingClientRect();
             return {w: r.width, h: r.height, label: b.getAttribute('aria-label'),
                     cls: b.className, disabled: b.disabled, step: b.getAttribute('data-step')}; })""")
    t.check("SUI-006", "كل زر [data-step] في مثال الاستخدام ≥48×48 (عقد B01)",
            len(btns) >= 2 and all(b["w"] >= 47.5 and b["h"] >= 47.5 for b in btns),
            json.dumps(btns, ensure_ascii=False))
    t.check("SUI-006", "كل زر [data-step] يحمل فئات B01 (m-btn m-btn--icon m-btn--secondary)",
            all("m-btn--icon" in b["cls"] and "m-btn--secondary" in b["cls"] for b in btns),
            json.dumps([b["cls"] for b in btns], ensure_ascii=False))
    t.check("SUI-006", "كل زر [data-step] له aria-label عربي صريح",
            all(b["label"] and any('\u0600' <= ch <= '\u06FF' for ch in b["label"]) for b in btns),
            json.dumps([b["label"] for b in btns], ensure_ascii=False))

    # مثال خطوة عامل فعليًا (حقل قابل للتحرير): زيادة/إنقاص يحرّك القيمة بالخطوة
    work = page.evaluate(
        """() => { const inp = document.getElementById('u-4');
             if (!inp) return {missing: true};
             const up = inp.closest('.m-field').querySelector('[data-step="up"]');
             const down = inp.closest('.m-field').querySelector('[data-step="down"]');
             const before = inp.value;
             up.click();
             const afterUp = inp.value;
             down.click(); down.click();
             const afterDown = inp.value;
             return {before, afterUp, afterDown}; }""")
    t.check("SUI-006", "المثال يعمل: الخطوة تزيد/تنقص فعليًا بالعقد (min/max/step من المستهلك)",
            work and not work.get("missing") and work["afterUp"] != work["before"]
            and work["afterDown"] != work["afterUp"],
            json.dumps(work, ensure_ascii=False))

    # الفحوص الذاتية المدمجة للمثال سليمة
    res = page.evaluate("() => document.getElementById('results').textContent")
    t.check("SUI-006", "فحوص المثال الذاتية: 0 FAIL وبلا أخطاء صفحة",
            res.count("FAIL ") == 0 and res.count("PASS ") >= 3 and not errors,
            f"PASS={res.count('PASS ')} FAIL={res.count('FAIL ')} errors={errors[:2]}")
    page.screenshot(path=str(SHOTS / f"{TAG}-sui006-example-usage-390.png"), full_page=True)
    page.close()


# ============================ فحوص SUI-011 ============================
def _seg_rows(page):
    return page.evaluate(
        """() => { const host = document.querySelector('#a2-wrap-seg-host');
             host.scrollIntoView({block: 'center'}); /* إدخال مجال الرؤية: elementFromPoint بإحداثيات إطار العرض */
             const seg = host.querySelector('.m-seg');
             const items = [...seg.querySelectorAll('.m-seg__item')];
             const rects = items.map(it => it.getBoundingClientRect());
             const rowsMap = new Map();
             rects.forEach((r) => {
               const key = Math.round(r.top);
               if (!rowsMap.has(key)) rowsMap.set(key, {top: r.top, bottom: r.bottom, items: []});
               const row = rowsMap.get(key);
               row.bottom = Math.max(row.bottom, r.bottom);
               row.items.push(r);
             });
             const rows = [...rowsMap.values()].sort((a, b) => a.top - b.top);
             const cs = getComputedStyle(seg);
             const first = rects[0]; const second = rects[1];
             /* RTL: العنصر الأول في أقصى اليمين — الفجوة بين الحافتين المتقابلتين */
             const hgap = second
               ? (second.left > first.left ? second.left - first.right : first.left - second.right)
               : null;
             return {nRows: rows.length, rows: rows.map(r => ({top: r.top, bottom: r.bottom})),
                     rowGap: rows.length > 1 ? rows[1].top - rows[0].bottom : null,
                     hgap, colGap: cs.columnGap, rowGapStyle: cs.rowGap,
                     visualH: first ? first.height : null,
                     segRect: seg.getBoundingClientRect().toJSON()}; }""")


SEG_HIT_TEST = """() => { const host = document.querySelector('#a2-wrap-seg-host');
             host.scrollIntoView({block: 'center'});
             const seg = host.querySelector('.m-seg');
             const items = [...seg.querySelectorAll('.m-seg__item')];
             const rects = items.map(it => it.getBoundingClientRect());
             const rowsMap = new Map();
             rects.forEach((r) => {
               const key = Math.round(r.top);
               if (!rowsMap.has(key)) rowsMap.set(key, {top: r.top, bottom: r.bottom, xs: []});
               const row = rowsMap.get(key);
               row.bottom = Math.max(row.bottom, r.bottom);
               row.xs.push(r.left + r.width / 2);
             });
             const rows = [...rowsMap.values()].sort((a, b) => a.top - b.top);
             if (rows.length < 2) return {nRows: rows.length};
             const r1 = rows[0], r2 = rows[1];
             /* النقر بين الصفين: منتصف الفجوة البصرية ± 1px (نقاط صارمة فوق
                مراكز عناصر الصفين). حواف الامتداد (±4px) خارجها عمدًا —
                داخل الامتداد هدف 48px مشروع، وخارج منتصف الفجوة ±1 تصطف
                حواف مضروبة بكسليًا (لواقعية اللمس: الإصبع لا يستهدف نصف بكسل). */
             const band = r2.top - r1.bottom;
             const mid = r1.bottom + band / 2;
             const ys = [mid - 1, mid, mid + 1];
             const xs = [...r1.xs.slice(0, 3), ...r2.xs.slice(0, 3)];
             const clean = [];
             xs.forEach((x) => {
               ys.forEach((y) => {
                 const el = document.elementFromPoint(x, y);
                 clean.push({x: Math.round(x), y: Math.round(y * 10) / 10,
                             isItem: !!(el && el.closest('.m-seg__item'))});
               });
             });
             const badClean = clean.filter(p => p.isItem);
             /* عيّنات داخل منطقة الامتداد المقصودة: يجب أن تصيب الهدف (48px حقيقي) */
             const extHits = [];
             [r1.bottom + 2, r2.top - 2].forEach((y) => {
               [r1.xs[0], r2.xs[0]].forEach((x) => {
                 const el = document.elementFromPoint(x, y);
                 extHits.push(!!(el && el.closest('.m-seg__item')));
               });
             });
             return {nRows: rows.length, rowGapPx: band, touchGapPx: band - 8,
                     mid, badClean: badClean.length, cleanSamples: clean.length,
                     extHitsAll: extHits.every(Boolean), extHits: extHits}; }"""


def check_sui011(t, ctx, base):
    # --- سطر واحد (عرض واسع): لا تغيير بصري ---
    page = ctx.new_page()
    page.set_viewport_size({"width": 900, "height": 800})
    page.goto(base + SELECTION_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate(WRAP_SEG_HOST)
    page.wait_for_timeout(200)
    one = _seg_rows(page)
    t.check("SUI-011", "السطر الواحد (900px): بلا التفاف والفجوة الأفقية 4px نفسها (كثافة محفوظة)",
            one["nRows"] == 1 and one["hgap"] is not None and abs(one["hgap"] - 4) < 0.75
            and one["visualH"] is not None and one["visualH"] <= 42,
            json.dumps({k: one[k] for k in ("nRows", "hgap", "visualH")}, ensure_ascii=False))
    page.close()

    # --- التفاف حقيقي عند 320 ---
    page = ctx.new_page()
    page.set_viewport_size({"width": 320, "height": 900})
    page.goto(base + SELECTION_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate(WRAP_SEG_HOST)
    page.wait_for_timeout(250)
    w1 = _seg_rows(page)
    t.check("SUI-011", "عند 320: المقاطع تلتف فعليًا (صفان أو أكثر)",
            w1["nRows"] >= 2, f"nRows={w1['nRows']}")

    hit = page.evaluate(SEG_HIT_TEST)
    t.check("SUI-011", "عند 320: فراغ ≥4px بين أهداف اللمس الموسعة (touchGap = rowGap − 8 ≥ 4)",
            hit.get("touchGapPx", -99) >= 3.5, f"touchGap={hit.get('touchGapPx')}px rowGap={hit.get('rowGapPx')}px")
    t.check("SUI-011", "عند 320: النقر في منتصف الفجوة بين الصفين (±1px فوق مراكز العناصر) لا يصيب أي هدف",
            hit.get("cleanSamples", 0) >= 6 and hit.get("badClean", 999) == 0,
            f"عيّنات={hit.get('cleanSamples')} مصابة={hit.get('badClean')} منتصف={hit.get('mid')}")
    t.check("SUI-011", "عند 320: الامتداد 4px يعمل (داخل أسفل الصف الأول وفوق الثاني يصيب الهدف 48px)",
            hit.get("extHitsAll") is True,
            json.dumps({k: hit.get(k) for k in ("extHits", "extHitsAll")}))
    t.check("SUI-011", "row-gap المحققة 12px (قيمة محققة لهذه البنية لا توكن عامًا)",
            hit.get("rowGapPx") is not None and abs(hit["rowGapPx"] - 12) < 0.75,
            f"rowGap={hit.get('rowGapPx')}px")
    page.screenshot(path=str(SHOTS / f"{TAG}-sui011-seg-wrap-320.png"))

    # --- التفاف عند 200% ---
    zoom(page)
    hit2 = page.evaluate(SEG_HIT_TEST)
    t.check("SUI-011", "عند 320+200%: التفاف مستمر وفراغ ≥4px بين الأهداف الموسعة",
            hit2.get("nRows", 0) >= 2 and hit2.get("touchGapPx", -99) >= 3.5,
            json.dumps(hit2, ensure_ascii=False))
    t.check("SUI-011", "عند 320+200%: النقر في منتصف الفجوة بين الصفين لا يصيب هدفًا",
            hit2.get("cleanSamples", 0) >= 6 and hit2.get("badClean", 999) == 0,
            json.dumps({k: hit2.get(k) for k in ("badClean", "cleanSamples")}))
    page.screenshot(path=str(SHOTS / f"{TAG}-sui011-seg-wrap-320-zoom200.png"))
    unzoom(page)
    page.close()


# ============================ فحوص SUI-032 ============================
def check_sui032(t, ctx, base):
    spec = ROOT / "components" / "selection" / "specification.md"
    text = spec.read_text(encoding="utf-8") if spec.exists() else ""
    t.check("SUI-032", "المواصفة توثق حدود توسع المنتقي (متى يليق الاقتراح/كيف يوسَّع) — KEEP+DOC",
            "حدود توسع المنتقي" in text and "SUI-032" in text,
            "علامات التوثيق غير موجودة في specification.md")

    page = ctx.new_page()
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(base + SELECTION_BOARD)
    page.wait_for_load_state("networkidle")
    page.click("[data-layer-open='picker-layer']")
    page.wait_for_timeout(400)
    keep = page.evaluate(
        """() => { const opts = [...document.querySelectorAll('#entity-picker .m-picker__option')];
             const visible = opts.filter(o => getComputedStyle(o).display !== 'none');
             return {n: visible.length,
                     search: document.querySelector('#entity-picker [data-picker-search]').value}; }""")
    t.check("SUI-032", "السلوك محفوظ (KEEP): المنتقي يعرض كل الخيارات قبل الكتابة",
            keep["n"] >= 4 and keep["search"] == "", json.dumps(keep, ensure_ascii=False))
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    page.close()


# ==================== مراجعة المرحلة 2 — عائلة B02 (fields) ====================
def review_fields(t, ctx, base):
    page = ctx.new_page()
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(base + FIELDS_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")

    geo = page.evaluate(
        """() => { const ctrl = document.querySelector('#types .m-field__control');
             const area = document.querySelector('#types .m-field__area');
             const label = document.querySelector('#types .m-field__label');
             const input = document.querySelector('#t-name');
             const unit = document.querySelector('#types .m-field__unit');
             return {ctrlH: ctrl.getBoundingClientRect().height,
                     areaH: area.getBoundingClientRect().height,
                     labelFont: getComputedStyle(label).fontSize,
                     labelWeight: getComputedStyle(label).fontWeight,
                     bodyFont: getComputedStyle(input).fontSize,
                     bodyLine: getComputedStyle(input).lineHeight,
                     unitFont: getComputedStyle(unit).fontSize,
                     unitRect: unit.getBoundingClientRect().toJSON()}; }""")
    t.check("REV-B02", "أحجام الحقول حسب طبيعة البيانات: تحكم 52px/مساحة 52px أدنى، تسمية 14/500، جسم 16 (KEEP مقيس)",
            abs(geo["ctrlH"] - 52) < 1 and geo["areaH"] >= 51
            and geo["labelFont"] == "14px" and geo["labelWeight"] == "500"
            and geo["bodyFont"] == "16px",
            json.dumps({k: geo[k] for k in ("ctrlH", "areaH", "labelFont", "labelWeight", "bodyFont")},
                       ensure_ascii=False))

    page.fill("#t-search", "مورد النور")
    page.wait_for_timeout(150)
    clear = page.evaluate(
        """() => { const b = document.querySelector('#search-clear');
             const r = b.getBoundingClientRect();
             return {w: r.width, h: r.height, label: b.getAttribute('aria-label'),
                     visible: b.classList.contains('is-visible')}; }""")
    t.check("REV-B02", "زر مسح البحث 48×48 ظاهر بوجود النص بتسمية عربية (KEEP)",
            clear["w"] >= 47.5 and clear["h"] >= 47.5 and "مسح" in (clear["label"] or "")
            and clear["visible"], str(clear))

    err = page.evaluate(
        """() => { const f = document.getElementById('live-amount');
             f.value = '12..5';
             f.dispatchEvent(new Event('blur'));
             return true; }""")
    page.wait_for_timeout(300)  # استقرار انتقال الحد 120ms (درس القياس الموثق)
    err = page.evaluate(
        """() => { const f = document.getElementById('live-amount');
             const wrap = document.getElementById('live-amount-field');
             const msg = wrap.querySelector('[data-field-msg]');
             const st = getComputedStyle(wrap.querySelector('.m-field__control'));
             return {hasError: wrap.classList.contains('has-error'),
                     border: st.borderColor, msgColor: getComputedStyle(msg).color,
                     value: f.value,
                     described: (f.getAttribute('aria-describedby') || '').includes(msg.id)}; }""")
    t.check("REV-B02", "رسائل التحقق: خطأ بحد ورسالة مصححة مربوطة aria-described والقيمة باقية (KEEP)",
            err["hasError"] and err["border"] == "rgb(173, 48, 59)"
            and err["msgColor"] == "rgb(173, 48, 59)" and err["value"] == "12..5" and err["described"],
            str(err))

    ro = page.evaluate(
        """() => { const f = document.getElementById('s-readonly');
             const st = getComputedStyle(f);
             const wrap = f.closest('.m-field__control');
             return {color: st.color, select: st.userSelect, cursor: st.cursor,
                     bg: getComputedStyle(wrap).backgroundColor}; }""")
    t.check("REV-B02", "القراءة فقط ليست معطلة: نص كامل وقابل للتحديد (KEEP)",
            ro["color"] == "rgb(23, 45, 50)" and ro["select"] == "text", str(ro))

    dis = page.evaluate(
        """() => { const wrap = document.querySelector('#states .has-disabled .m-field__control');
             const st = getComputedStyle(wrap);
             return {bg: st.backgroundColor, shadow: st.boxShadow}; }""")
    t.check("REV-B02", "المعطل: أرضية معطل بلا حلقة (KEEP)",
            dis["bg"] == "rgb(228, 234, 232)" and dis["shadow"] == "none", str(dis))

    # الأرقام والاتجاه: RTL أصلي + LTR مقلوب — عزل الأرقام محفوظ
    ltr = page.evaluate(
        """() => { const i = document.getElementById('t-amount');
             const before = getComputedStyle(i).direction + '|' + i.getBoundingClientRect().width;
             document.documentElement.setAttribute('dir', 'ltr');
             const afterDir = getComputedStyle(i).direction;
             const fits = i.scrollWidth <= i.clientWidth + 1;
             document.documentElement.setAttribute('dir', 'rtl');
             return {before, afterDir, fits}; }""")
    t.check("REV-B02", "عزل الأرقام في RTL وLTR معًا (مدخل المبلغ dir=ltr ثابت والقيمة ظاهرة)",
            ltr["afterDir"] == "ltr" and ltr["fits"], str(ltr))

    # المقاسات الأربعة + 200%: لا فيض
    for wdt in (320, 360, 390, 430):
        page.set_viewport_size({"width": wdt, "height": 900})
        page.wait_for_timeout(250)
        df = doc_fit(page)
        t.check("REV-B02", f"لوحة الحقول عند {wdt}px: لا تمرير أفقي للصفحة",
                df["sw"] <= df["cw"] + 1, str(df))
    zoom(page)
    dfz = doc_fit(page)
    t.check("REV-B02", "لوحة الحقول عند 390+200%: لا فيض أفقي",
            dfz["sw"] <= dfz["cw"] + 1, str(dfz))
    page.screenshot(path=str(SHOTS / f"{TAG}-rev-b02-board-390-zoom200.png"), full_page=True)
    unzoom(page)
    page.close()

    # reduced-motion
    ctx2 = ctx.browser.new_context(viewport={"width": 390, "height": 844},
                                   reduced_motion="reduce")
    pg = ctx2.new_page()
    pg.goto(base + FIELDS_BOARD)
    pg.wait_for_load_state("networkidle")
    rm = pg.evaluate(
        "() => getComputedStyle(document.querySelector('.m-field__control')).transitionDuration")
    t.check("REV-B02", "reduced-motion: انتقالات الحقل ملغاة (KEEP)", rm == "0s", f"duration={rm}")
    ctx2.close()


# ==================== مراجعة المرحلة 2 — عائلة B03 (selection) ====================
def review_selection(t, ctx, base):
    page = ctx.new_page()
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(base + SELECTION_BOARD)
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")

    ch = page.evaluate(
        """() => { const row = document.querySelector('#choices .m-choice--check');
             const box = row.querySelector('.m-choice__box');
             const long = [...document.querySelectorAll('.m-choice__text')].find(t => t.textContent.includes('إشعار المورد'));
             const longRow = long.closest('.m-choice');
             return {rowH: row.getBoundingClientRect().height,
                     box: box.getBoundingClientRect().toJSON(),
                     longH: longRow.getBoundingClientRect().height,
                     longClipped: long.scrollWidth > long.clientWidth + 1}; }""")
    t.check("REV-B03", "صفوف الاختيار هدف 48px والصندوق 24px والتسمية الطويلة تلف بلا قص (KEEP)",
            ch["rowH"] >= 47.5 and abs(ch["box"]["width"] - 24) < 1 and not ch["longClipped"],
            json.dumps({k: ch[k] for k in ("rowH", "longH", "longClipped")}, ensure_ascii=False))

    sw = page.evaluate(
        """() => { const s = document.querySelectorAll('#switches [data-switch]')[1];
             const track = s.querySelector('.m-switch__track');
             const thumb = s.querySelector('.m-switch__thumb');
             const tr = track.getBoundingClientRect(); const th = thumb.getBoundingClientRect();
             const st = getComputedStyle(s.querySelector('.m-switch__state'));
             /* RTL: عند ON المقبض عند النهاية = الطرف الفيزيائي الأيسر للمسار */
             return {trackW: tr.width, trackH: tr.height,
                     thumbW: th.width,
                     onEnd: Math.abs(th.left - tr.left) < 4,
                     stateFont: st.fontSize, stateMinW: st.minWidth}; }""")
    t.check("REV-B03", "المفتاح: مسار 52×32 ومقبض 24 وعند ON المقبض عند نهاية المسار (RTL) (KEEP)",
            abs(sw["trackW"] - 52) < 1 and abs(sw["trackH"] - 32) < 1 and abs(sw["thumbW"] - 24) < 1
            and sw["onEnd"], json.dumps(sw, ensure_ascii=False))

    tg = page.evaluate(
        """() => { const b = document.querySelector('#switches .m-toggle[aria-pressed="true"]');
             const st = getComputedStyle(b);
             return {bg: st.backgroundColor, color: st.color, shadow: st.boxShadow}; }""")
    t.check("REV-B03", "زر الوضع المضغوط: أرضية التحديد ولون بترولي (KEEP)",
            tg["bg"] == "rgb(223, 238, 230)" and tg["color"] == PETROLEUM, str(tg))

    # لوحة المفاتيح: أسهم المقاطع RTL (يسار = التالي)
    kb = page.evaluate(
        """() => { const seg = document.querySelector('#switches [data-seg]');
             const items = [...seg.querySelectorAll('.m-seg__item')];
             items[0].focus();
             seg.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
             return {landed: document.activeElement.getAttribute('data-value')}; }""")
    t.check("REV-B03", "أسهم المقاطع بمنطق RTL: يسار = التالي (KEEP)",
            kb["landed"] == "due", str(kb))

    # المنتقي: بحث + اختيار Enter يحدّث الملخص (عقد K7 خفيف)
    pk = page.evaluate(
        """() => { const open = document.querySelector('[data-layer-open="picker-layer"]');
             open.click(); return true; }""")
    page.wait_for_timeout(400)
    pick = page.evaluate(
        """() => { const input = document.querySelector('#entity-picker [data-picker-search]');
             input.value = 'الوطنية';
             input.dispatchEvent(new Event('input', {bubbles: true}));
             const vis = [...document.querySelectorAll('#entity-picker .m-picker__option')]
               .filter(o => getComputedStyle(o).display !== 'none');
             return {visible: vis.length}; }""")
    t.check("REV-B03", "المنتقي: بحث فرعي يصفّي (الوطنية → 2) داخل طبقة B07 (KEEP)",
            pk and pick["visible"] == 2, str(pick))
    pick2 = page.evaluate(
        """() => { const first = document.querySelector('#entity-picker .m-picker__option');
             first.focus();
             return {focused: document.activeElement === first}; }""")
    page.keyboard.press("Enter")  # زر حقيقي: Enter على الزر المركز يطلق click الأصلي
    page.wait_for_timeout(200)
    pick2 = page.evaluate(
        """() => ({summary: document.querySelector('#entity-picker [data-picker-summary]').textContent,
                   selected: !!document.querySelector('#entity-picker .m-picker__option[aria-selected=true]')})""")
    t.check("REV-B03", "المنتقي: Enter يحدد ويحدّث الملخص معًا (KEEP)",
            pick2["selected"] and "المحدد" in pick2["summary"] and "لا شيء" not in pick2["summary"],
            str(pick2))
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)

    # الحالات المعطلة: مفتاح معطل بألوان معطل
    dsw = page.evaluate(
        """() => { const s = document.querySelector('#switches .m-switch.is-disabled');
             const st = getComputedStyle(s.querySelector('.m-switch__state'));
             const track = getComputedStyle(s.querySelector('.m-switch__track'));
             return {state: st.color, trackBg: track.backgroundColor, opacity: track.opacity}; }""")
    t.check("REV-B03", "المفتاح المعطل: نص ومسار بحالة المعطل (KEEP)",
            dsw["state"] == "rgb(83, 103, 107)" and dsw["trackBg"] == "rgb(228, 234, 232)",
            str(dsw))

    for wdt in (320, 360, 390, 430):
        page.set_viewport_size({"width": wdt, "height": 900})
        page.wait_for_timeout(250)
        df = doc_fit(page)
        t.check("REV-B03", f"لوحة الاختيار عند {wdt}px: لا تمرير أفقي",
                df["sw"] <= df["cw"] + 1, str(df))
    page.screenshot(path=str(SHOTS / f"{TAG}-rev-b03-board-430.png"), full_page=False)
    page.close()

    ctx2 = ctx.browser.new_context(viewport={"width": 390, "height": 844},
                                   reduced_motion="reduce")
    pg = ctx2.new_page()
    pg.goto(base + SELECTION_BOARD)
    pg.wait_for_load_state("networkidle")
    rmx = pg.evaluate(
        """() => ({seg: getComputedStyle(document.querySelector('.m-seg__item')).transitionDuration,
                   track: getComputedStyle(document.querySelector('.m-switch__track')).transitionDuration})""")
    t.check("REV-B03", "reduced-motion: انتقالات الاختيار ملغاة (KEEP)",
            rmx["seg"] == "0s" and rmx["track"] == "0s", str(rmx))
    ctx2.close()


def main():
    global SHOTS, TAG
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", required=True, help="وسم الجولة: before / after")
    ap.add_argument("--out", default=str(ROOT / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent2"),
                    help="مجلد الإخراج (JSON + لقطات)")
    args = ap.parse_args()
    TAG = args.tag
    out = Path(args.out).resolve()
    shots_dir = out / "screenshots"
    shots_dir.mkdir(parents=True, exist_ok=True)
    SHOTS = shots_dir

    srv, base = start_server()
    t = Tool()
    meta = git_meta()
    meta.update({
        "tag": TAG,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "zoom_type": "محاكاة نص ×2 بمرورين نظيفين (ZOOM2_CLEAN) — ليست native zoom",
        "server_port": srv.server_address[1],
    })

    print(f"# sui-repair-a2-check — وسم: {TAG}")
    print(f"# commit: {meta['commit']} — شجرة: {meta['tree']}")
    print(f"# خادم الوكيل 2 على المنفذ {srv.server_address[1]}")
    print("")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=CHROMIUM)
        meta["browser"] = browser.version
        ctx = browser.new_context(viewport={"width": 390, "height": 844})

        check_sui003(t, ctx, base)
        check_sui004(t, ctx, base)
        check_sui005(t, ctx, base)
        check_sui006(t, ctx, base)
        check_sui011(t, ctx, base)
        check_sui032(t, ctx, base)
        review_fields(t, ctx, base)
        review_selection(t, ctx, base)

        ctx.close()
        browser.close()
    srv.shutdown()

    summary = t.summary()
    payload = {
        "meta": meta,
        "items": {k: v for k, v in t.items.items()},
        "summary": summary,
        "not_run": [
            "لمس حقيقي وجهاز هاتف (hit-test بمستطيلات وelementFromPoint فقط)",
            "قارئ شاشة فعلي (TalkBack/VoiceOver)",
            "WebKit/Safari وnative zoom (التكبير محاكاة نص معلنة)",
            "لوحة مفاتيح نظام حقيقية",
        ],
    }
    json_path = out / f"sui-repair-a2-{TAG}.json"
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    txt_path = out / f"sui-repair-a2-{TAG}.txt"
    txt_path.write_text(
        "\n".join([f"# sui-repair-a2-check — {TAG} — {datetime.now().isoformat(timespec='seconds')}"]
                  + summary["summary_lines"]
                  + ["", f"فحوص فاشلة: {summary['failed_items']} / إجمالي الفحوص: {summary['total_checks']}",
                     "NOT RUN: " + "؛ ".join(payload["not_run"])]),
        encoding="utf-8")
    print("")
    for ln in summary["summary_lines"]:
        print(ln)
    print(f"\nJSON: {json_path}")
    return 1 if summary["failed_items"] else 0


if __name__ == "__main__":
    sys.exit(main())
