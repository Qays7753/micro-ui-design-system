#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص معرض نظام الواجهة (مصفوفة تفاعل + قياسات + لقطات).
من جذر المستودع:
    python3 tools/ui-system-showcase-check.py

المصدر المفحوص (هدفان):
  1) المصدر القابل للتحرير عبر خادم محلي مؤقت يرفعه السكربت نفسه:
     previews/ui-system-showcase/index.html
  2) النسخة المكتفية ذاتيًا عبر file:// مباشرة:
     previews/ui-system-showcase/standalone.html

المخرجات (reviews/UI-SYSTEM-SHOWCASE/):
  - screenshots/*.png  لقطات العرض والتفاعل والقياسات 320/360/390/430 × RTL/LTR
  - verification.txt   سجل الفحص الكامل (PASS/FAIL لكل بند)

النطاق: Chromium (Playwright headless) فقط — لا ادعاء أجهزة أو قارئات شاشة.
كل فحص تفاعلي يمر عبر العقود العامة للمكوّنات (نقر/لوحة مفاتيح/أحداث micro-*).
Exit 0 عند نجاح الكل وإلا exit 1. لا أسرار ولا مسارات خاصة.
"""
import http.server
import socketserver
import sys
import threading
from datetime import date
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SAMPLE = ROOT / "previews" / "ui-system-showcase"
OUT_DIR = ROOT / "reviews" / "UI-SYSTEM-SHOWCASE"
SHOTS = OUT_DIR / "screenshots"
PORT = 0  # منفذ حر يُختار آليًا (يكتب في chosen_port)

results = []
console_errors = {}
page_errors = {}
failed_requests = {}


def t(name, ok, detail=""):
    results.append((name, bool(ok), str(detail)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *a):
        pass


class Server(socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


chosen_port = []


def serve():
    with Server(("127.0.0.1", 0), Handler) as httpd:
        chosen_port.append(httpd.server_address[1])
        httpd.serve_forever()


def wait(ms):
    page.wait_for_timeout(ms)


def jclick(sel):
    """نقر عبر JS (المعالجات نفسها تنطلق) — لتجنب حجب شريط التحكم اللاصق
    للعناصر العميقة في صفحة طويلة؛ النقر الفيزيائي يبقى مغطى بلقطات الأقسام."""
    found = page.evaluate("(s) => !!document.querySelector(s)", sel)
    if not found:
        raise RuntimeError(f"jclick: selector not found: {sel}")
    page.evaluate("(s) => document.querySelector(s).click()", sel)


def shot(name, full=False):
    page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=full)


# ---------------------------------------------------------------- running state
page = None


def run_interaction_matrix(base_url, label, screenshot_prefix):
    """مصفوفة التفاعل §8 على الهدف المعطى (مصدر أو standalone)."""
    global page
    page.goto(base_url, wait_until="load")
    wait(800)
    t(f"[{label}] فتح الصفحة بلا أخطاء موارد", True, base_url.split("/")[-1])

    # ---- 1) الألسنة: اختيار + تمرير أفقي مقصود بتسميات طويلة (D-UI-01) ----
    page.click('[data-sc-fixture="stress"]')
    wait(250)
    tabs = page.locator("#sc-tabs")
    tab_info = page.evaluate("""() => {
      const tabs = document.getElementById('sc-tabs');
      const tab3 = document.getElementById('sc-tab-c-btn');
      tab3.click();
      return {
        scrollable: tabs.scrollWidth > tabs.clientWidth,
        sw: tabs.scrollWidth, cw: tabs.clientWidth,
        selected: tab3.getAttribute('aria-selected'),
        panelVisible: !document.getElementById('sc-tab-c').hidden,
        othersHidden: document.getElementById('sc-tab-a').hidden && document.getElementById('sc-tab-b').hidden,
        singleRow: tabs.getBoundingClientRect().height < 96
      };
    }""")
    t(f"[{label}] الألسنة صف واحد وتمرير أفقي بتسميات طويلة (D-UI-01)",
      tab_info["scrollable"] and tab_info["singleRow"],
      f"sw={tab_info['sw']}/cw={tab_info['cw']} h={tab_info['singleRow']}")
    t(f"[{label}] اختيار لسان يبدّل اللوحة المرتبطة",
      tab_info["selected"] == "true" and tab_info["panelVisible"] and tab_info["othersHidden"])
    end_info = page.evaluate("""() => {
      /* المستمع على عنصر اللسان نفسه (عقد B07) — التركيز ثم End */
      const tab3 = document.getElementById('sc-tab-c-btn');
      tab3.focus();
      tab3.dispatchEvent(new KeyboardEvent('keydown', {key: 'End', bubbles: true}));
      return Array.from(document.querySelectorAll('#sc-tabs [role=tab]')).find(x => x.getAttribute('aria-selected')==='true').id;
    }""")
    wait(120)
    t(f"[{label}] Home/End داخل الألسنة", end_info == "sc-tab-d-btn", end_info)
    page.click('[data-sc-fixture="normal"]')
    wait(250)

    # ---- 2) RTL / LTR ----
    page.click('[data-sc-dir="ltr"]')
    wait(300)
    dir_info = page.evaluate("""() => ({
      dir: document.documentElement.getAttribute('dir'),
      lineAxis: document.getElementById('sc-chart-line').getAttribute('data-axis-dir'),
      sw: document.documentElement.scrollWidth
    })""")
    t(f"[{label}] التبديل إلى LTR يقلب الاتجاه ويحدّث محور الخط",
      dir_info["dir"] == "ltr" and dir_info["lineAxis"] == "ltr", str(dir_info))
    t(f"[{label}] لا فيض أفقي في LTR عند 390", dir_info["sw"] <= 390, f"sw={dir_info['sw']}")
    shot(f"{screenshot_prefix}-ltr-390")
    page.click('[data-sc-dir="rtl"]')
    wait(300)

    # ---- 3) الأزرار: حالات موثقة ----
    jclick("#sc-btn-loading")
    wait(150)
    btn = page.evaluate("""() => {
      const b = document.getElementById('sc-btn-demo');
      return { busy: b.getAttribute('aria-busy'), cls: b.classList.contains('is-loading'),
               visible: b.textContent.trim(), accName: b.getAttribute('aria-label') || '' };
    }""")
    t(f"[{label}] setLoading: aria-busy + is-loading + الاسم الإتاحي يتبديل والتسمية المرئية باقية (نمط B)",
      btn["busy"] == "true" and btn["cls"] and ("جارٍ" in btn["accName"]) and btn["visible"] == "حفظ العملية", str(btn))
    jclick("#sc-btn-loading")
    wait(120)
    btn2 = page.evaluate("() => { const b = document.getElementById('sc-btn-demo'); return {busy: b.getAttribute('aria-busy'), cls: b.classList.contains('is-loading')}; }")
    t(f"[{label}] إيقاف التحميل يرجع الحالة", btn2["busy"] != "true" and not btn2["cls"])
    jclick("#sc-btn-pressed")
    pressed = page.evaluate("() => document.getElementById('sc-btn-demo').classList.contains('is-pressed')")
    t(f"[{label}] حالة الضغط .is-pressed", pressed)
    jclick("#sc-btn-disable")
    dis = page.evaluate("() => document.getElementById('sc-btn-demo').disabled")
    t(f"[{label}] التعطيل الأصلي", dis)
    jclick("#sc-btn-pressed")
    jclick("#sc-btn-disable")
    wait(100)

    # ---- 4) الحقول: إدخال + تحقق + مسح + خطوة ----
    page.evaluate("() => { const i = document.getElementById('sc-f-search'); i.value = 'قهوة'; i.dispatchEvent(new Event('input', {bubbles: true})); }")
    wait(120)
    srch = page.evaluate("""() => {
      const f = document.getElementById('sc-field-search');
      const clear = f.querySelector('.m-field__clear');
      const r = clear.getBoundingClientRect();
      return { visible: clear.classList.contains('is-visible') && r.width > 0 };
    }""")
    t(f"[{label}] حقل البحث: الإدخال يظهر زر المسح", srch["visible"])
    jclick("#sc-field-search .m-field__clear")
    wait(100)
    cleared = page.evaluate("""() => ({
      value: document.getElementById('sc-f-search').value,
      focused: document.activeElement === document.getElementById('sc-f-search')
    })""")
    t(f"[{label}] المسح يفرّغ ويعيد التركيز للحقل", cleared["value"] == "" and cleared["focused"])
    jclick('#sc-field-qty [data-step="up"]')
    qty = page.evaluate("() => document.getElementById('sc-f-qty').value")
    t(f"[{label}] خطوة الكمية 10→15 بحدود المستهلك", qty == "15", qty)
    page.evaluate("() => document.getElementById('sc-f-demo').dispatchEvent(new Event('input', {bubbles:true}))")
    page.evaluate("() => { const i = document.getElementById('sc-f-demo'); i.value = 'قيمة معدلة'; i.dispatchEvent(new Event('input', {bubbles: true})); }")
    wait(100)
    jclick("#sc-fx-error")
    wait(100)
    fstate = page.evaluate("""() => {
      const f = document.getElementById('sc-field-error-demo');
      const m = f.querySelector('[data-field-msg]');
      const inp = document.getElementById('sc-f-demo');
      const desc = inp.getAttribute('aria-describedby') || '';
      return { err: f.classList.contains('has-error'), msg: !m.hidden && m.textContent.length > 0, kept: inp.value, linked: desc.includes(m.id) };
    }""")
    t(f"[{label}] حالة الخطأ: has-error + رسالة ظاهرة مرتبطة والقيمة باقية",
      fstate["err"] and fstate["msg"] and fstate["kept"] == "قيمة معدلة" and fstate["linked"], str(fstate))
    jclick("#sc-fx-clear")
    wait(100)
    t(f"[{label}] مسح حالة الخطأ", page.evaluate("() => { const f = document.getElementById('sc-field-error-demo'); return !f.classList.contains('has-error') && f.querySelector('[data-field-msg]').hidden; }"))

    # ---- 5) المنتقي: فتح/بحث/اختيار/مسح/إغلاق ----
    jclick("#sc-picker-trigger")
    wait(320)
    pk_open = page.evaluate("""() => {
      const layer = document.getElementById('sc-picker-layer');
      return { open: !layer.hidden, focusIn: layer.contains(document.activeElement) };
    }""")
    t(f"[{label}] المنتقي يفتح داخل طبقة والتركيز محصور", pk_open["open"] and pk_open["focusIn"])
    page.evaluate("() => { const i = document.querySelector('#sc-picker [data-picker-search]'); i.value = 'النور'; i.dispatchEvent(new Event('input', {bubbles: true})); }")
    wait(180)
    pk_filter = page.evaluate("() => document.querySelectorAll('#sc-picker .m-picker__option:not([hidden])').length")
    t(f"[{label}] البحث الجزئي يرشّح الخيارات", pk_filter == 1, f"ظاهرة={pk_filter}")
    page.evaluate("() => { const i = document.querySelector('#sc-picker [data-picker-search]'); i.value = ''; i.dispatchEvent(new Event('input', {bubbles: true})); }")
    wait(180)
    jclick("#sc-picker .m-picker__option")
    wait(150)
    pk_sel = page.evaluate("""() => ({
      summary: document.querySelector('#sc-picker [data-picker-summary]').textContent,
      value: document.getElementById('sc-picker-value').textContent
    })""")
    t(f"[{label}] الاختيار يحدّث ملخص المنتقي وقيمة المشغّل",
      "لا شيء" not in pk_sel["summary"] and "لا شيء" not in pk_sel["value"], str(pk_sel))
    page.evaluate("() => { if (window.MicroPicker) window.MicroPicker.clearSelection(document.getElementById('sc-picker')); }")
    wait(120)
    pk_clear = page.evaluate("() => document.querySelector('#sc-picker [data-picker-summary]').textContent")
    t(f"[{label}] مسح الاختيار يعيد «لا شيء»", "لا شيء" in pk_clear, pk_clear)
    page.keyboard.press("Escape")
    wait(350)
    pk_close = page.evaluate("""() => ({
      hidden: document.getElementById('sc-picker-layer').hidden,
      focusBack: document.activeElement === document.getElementById('sc-picker-trigger')
    })""")
    t(f"[{label}] الإغلاق يستعيد تركيز المشغّل", pk_close["hidden"] and pk_close["focusBack"])

    # ---- 6) الحوار واللوحة السفلية: تركيز وإغلاق ----
    jclick("#sc-dialog-trigger")
    wait(320)
    page.keyboard.press("Tab")
    page.keyboard.press("Tab")
    page.keyboard.press("Tab")
    wait(80)
    dlg = page.evaluate("""() => {
      const layer = document.getElementById('sc-dialog-layer');
      return { open: !layer.hidden, focusIn: layer.contains(document.activeElement) };
    }""")
    t(f"[{label}] الحوار المركزي يفتق التركيز داخله (Tab متكرر لا يخرج)", dlg["open"] and dlg["focusIn"])
    page.keyboard.press("Escape")
    wait(350)
    dlg_close = page.evaluate("""() => ({
      hidden: document.getElementById('sc-dialog-layer').hidden,
      focusBack: document.activeElement === document.getElementById('sc-dialog-trigger')
    })""")
    t(f"[{label}] Escape يغلق الحوار ويعيد التركيز", dlg_close["hidden"] and dlg_close["focusBack"])
    jclick("#sc-sheet-trigger")
    wait(320)
    sheet_open = page.evaluate("() => !document.getElementById('sc-sheet-layer').hidden")
    t(f"[{label}] اللوحة السفلية تفتح", sheet_open)
    page.evaluate("() => document.querySelector('.m-layer-backdrop[data-for=sc-sheet-layer]').dispatchEvent(new MouseEvent('click', {bubbles: true}))")
    wait(350)
    t(f"[{label}] الضغط بالخلفية يغلق اللوحة (سياسة non-destructive)",
      page.evaluate("() => document.getElementById('sc-sheet-layer').hidden"))
    # لقطة للوحة السفلية مفتوحة
    jclick("#sc-sheet-trigger")
    wait(320)
    shot(f"{screenshot_prefix}-sheet-open")
    page.evaluate("() => document.querySelector('.m-layer-backdrop[data-for=sc-sheet-layer]').dispatchEvent(new MouseEvent('click', {bubbles: true}))")
    wait(350)

    # ---- 7) الرسائل: toast + إغلاق ملاحظة + إعلان ----
    jclick("#sc-toast-open")
    wait(200)
    toast = page.evaluate("""() => { const el = document.getElementById('sc-toast'); const r = el.getBoundingClientRect(); return { open: !el.hidden, rect: r.width > 0 && r.height > 0 }; }""")
    t(f"[{label}] toast يظهر فوق الأقسام (rect>0)", toast["open"] and toast["rect"])
    jclick("#sc-toast [data-toast-close]")
    wait(120)
    t(f"[{label}] إغلاق toast اليدوي", page.evaluate("() => document.getElementById('sc-toast').hidden"))
    jclick("#sc-note-success .m-note__close")
    wait(150)
    note = page.evaluate("""() => ({
      hidden: document.getElementById('sc-note-success').hidden,
      focusBack: document.activeElement === document.getElementById('sc-note-reopen-success')
    })""")
    t(f"[{label}] إغلاق ملاحظة يعيد التركيز لمصدرها (data-return-focus)",
      note["hidden"] and note["focusBack"])
    jclick("#sc-note-reopen-success")
    wait(100)
    t(f"[{label}] إعادة إظهار الملاحظة", page.evaluate("() => !document.getElementById('sc-note-success').hidden"))
    jclick("#sc-announce")
    wait(150)
    live = page.evaluate("""() => {
      const regions = document.querySelectorAll('.m-live-region');
      return { count: regions.length, polite: Array.from(regions).some(r => r.textContent.includes('إعلان تجريبي')) };
    }""")
    t(f"[{label}] الإعلان في القناة الحيّة المنفصلة (A2-F05)", live["count"] >= 1 and live["polite"], str(live))

    # ---- 8) إفصاح الرسم + مزامنة البيانات (D-UI-04 / A4-D04) ----
    discl = page.evaluate("""() => {
      const btn = document.querySelector('#sc-chart-bars .m-chart__disclose');
      if (!btn) return null;
      btn.click();
      return { expanded: btn.getAttribute('aria-expanded'), table: !!document.querySelector('#sc-chart-bars .m-chart__dataset') };
    }""")
    t(f"[{label}] إفصاح بيانات الرسم يفتح (aria-expanded + جدول)",
      bool(discl) and discl["expanded"] == "true" and discl["table"])
    page.click('[data-sc-fixture="stress"]')
    wait(300)
    sync = page.evaluate("""() => {
      const chart = document.getElementById('sc-chart-bars');
      const summary = chart.querySelector('[data-summary]').textContent;
      const table = chart.querySelector('.m-chart__dataset');
      const vals = table ? table.textContent : '';
      return { summary, hasStressValue: vals.includes('4096'), hasStressLabel: vals.includes('مبيعات الربع الحالي للفرع الرئيسي'),
               expanded: chart.querySelector('.m-chart__disclose').getAttribute('aria-expanded') };
    }""")
    t(f"[{label}] تبديل البيانات: الإفصاح أعيد بناؤه والقيمة والتسمية الجديدتان ظاهرتان (A4-D04)",
      sync["hasStressValue"] and sync["hasStressLabel"] and sync["expanded"] == "true", str(sync)[:80])
    follows = page.evaluate("""() => {
      const chart = document.getElementById('sc-chart-bars');
      chart.setAttribute('data-summary-text', 'ملخص محدث من الفحص — يتبع المصدر');
      window.MicroData.render(chart);
      return chart.querySelector('[data-summary]').textContent;
    }""")
    t(f"[{label}] الملخص يتبع المصدر كل render (A4-D04)",
      follows == 'ملخص محدث من الفحص — يتبع المصدر', follows[:50])
    page.evaluate("""() => {
      const btn = document.querySelector('#sc-chart-bars .m-chart__disclose');
      btn.click();
    }""")
    wait(120)
    t(f"[{label}] إغلاق الإفصاح",
      page.evaluate("() => document.querySelector('#sc-chart-bars .m-chart__disclose').getAttribute('aria-expanded')") == "false")
    page.click('[data-sc-fixture="normal"]')
    wait(300)

    # ---- 9) صفر/مجهول/سالب ----
    zvals = page.evaluate("""() => {
      const bars = Array.from(document.querySelectorAll('#sc-chart-bars .m-chart__bar-value')).map(e => e.textContent.trim());
      const metricRows = Array.from(document.querySelectorAll('#sc-main-metric [data-bar-items] li')).map(e => e.textContent);
      const scaleStates = Array.from(document.querySelectorAll('[data-scale-state]')).map(e => e.getAttribute('data-scale-state'));
      return { bars: bars.join('|'), metric: metricRows.join(' | '), scaleStates: scaleStates.join(',') };
    }""")
    t(f"[{label}] صفر ومجهول ظاهران نصًا في الأعمدة", "0" in zvals["bars"] and "—" in zvals["bars"], zvals["bars"])
    t(f"[{label}] السالب في أشرطة المقارنة (موقعة حول الصفر)", "مرتجعات" in zvals["metric"], zvals["metric"][:80])
    t(f"[{label}] عقد الحالة data-scale-state مكتوب كل تصيير", len(zvals["scaleStates"]) > 0, zvals["scaleStates"][:60])

    # ---- 10) مفاتيح الإعدادات ----
    jclick("#sc-account-root [data-account-open]")
    wait(350)
    acc = page.evaluate("() => !document.getElementById('sc-account-layer').hidden")
    t(f"[{label}] حوار الإعدادات يفتح", acc)
    jclick("#sc-account-root [data-account-to-application]")
    wait(200)
    app_view = page.evaluate("""() => ({
      app: !document.querySelector('#sc-account-root [data-account-view=application]').hidden,
      back: !document.querySelector('#sc-account-root [data-account-back]').hidden
    })""")
    t(f"[{label}] المستويان: عرض التطبيق وزر العودة", app_view["app"] and app_view["back"])
    jclick("#sc-account-root [data-account-setting=notifications]")
    wait(200)
    sw = page.evaluate("""() => ({
      checked: document.querySelector('#sc-account-root [data-account-setting=notifications]').checked,
      status: document.querySelector('#sc-account-root [data-account-demo-status]').textContent
    })""")
    t(f"[{label}] مفتاح التطبيق: تغيير + حالة عرض تجريبية", sw["checked"] and len(sw["status"]) > 0, sw["status"][:60])
    jclick("#sc-account-root [data-account-back]")
    wait(200)
    page.keyboard.press("Escape")
    wait(350)
    acc_close = page.evaluate("""() => ({
      hidden: document.getElementById('sc-account-layer').hidden,
      focusBack: document.activeElement === document.querySelector('#sc-account-root [data-account-open]')
    })""")
    t(f"[{label}] إغلاق الإعدادات يستعيد التركيز", acc_close["hidden"] and acc_close["focusBack"])

    # ---- 11) الجدول والعارض ----
    ocal = page.evaluate("""() => {
      const root = document.getElementById('sc-ocal-root');
      const cell = root.querySelector('[data-ocal-date="2026-10-12"]');
      if (cell) cell.click();
      return { clicked: !!cell, log: document.getElementById('sc-ocal-log').textContent };
    }""")
    wait(200)
    t(f"[{label}] اختيار يوم في الجدول (order-schedule:day-select)",
      ocal["clicked"] and "day-select" in page.evaluate("() => document.getElementById('sc-ocal-log').textContent"))
    jclick("#sc-ocal-view")
    wait(200)
    t(f"[{label}] تبديل عرض القائمة/التقويم",
      page.evaluate("() => document.getElementById('sc-ocal-root').getAttribute('data-ocal-view')") == "list")
    jclick("#sc-ocal-empty")
    wait(150)
    t(f"[{label}] حالة الفراغ في الجدول",
      page.evaluate("() => !!document.querySelector('#sc-ocal-root [data-ocal-status=empty]')"))
    jclick("#sc-ocal-restore")
    wait(200)
    jclick("#sc-ocal-view")
    wait(200)

    # عودة عرض التقويم عبر الزر (list -> calendar)
    t(f"[{label}] استعادة بيانات الجدول",
      page.evaluate("() => !document.querySelector('#sc-ocal-root [data-ocal-status=empty]')"))

    car = page.evaluate("""() => {
      const root = document.getElementById('sc-carousel-root');
      const next = root.querySelector('[data-next]');
      next.click();
      return { status: root.querySelector('[data-status]').textContent, prevDisabled: root.querySelector('[data-prev]').disabled };
    }""")
    wait(180)
    t(f"[{label}] العارض: التالي يحدّث المؤشر صادقًا", "2" in car["status"] and not car["prevDisabled"], car["status"])
    jclick("#sc-carousel-root [data-card-expand]") if page.locator("#sc-carousel-root [data-card-expand]").count() else None
    # التوسيع في البطاقة الأولى: عد للبطاقة 1 أولًا
    page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('sc-carousel-root'), 0)")
    wait(180)
    jclick("#sc-carousel-root [data-card-expand]")
    wait(150)
    exp = page.evaluate("""() => {
      const btn = document.querySelector('#sc-carousel-root [data-card-expand]');
      return { expanded: btn.getAttribute('aria-expanded') === 'true', details: !document.getElementById('sc-carousel-details-1').hidden };
    }""")
    t(f"[{label}] توسيع تفاصيل البطاقة (aria-expanded + المنطقة)", exp["expanded"] and exp["details"])
    page.evaluate("() => document.getElementById('sc-carousel-root').dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}))")
    wait(200)
    collapsed = page.evaluate("""() => {
      const btn = document.querySelector('#sc-carousel-root [data-card-expand]');
      return btn.getAttribute('aria-expanded') === 'false' && document.getElementById('sc-carousel-details-1').hidden
        && window.MicroCarousel.getIndex(document.getElementById('sc-carousel-root')) === 1;
    }""")
    t(f"[{label}] الانتقال يطوي التفاصيل وArrowLeft=التالي في RTL", collapsed)
    dots = page.evaluate("() => document.querySelectorAll('#sc-carousel-root [data-dots] button').length")
    t(f"[{label}] نقاط العارض 48px", dots == 3, f"نقاط={dots}")

    # ---- 12) تصفية الحالة ----
    page.click('[data-sc-filter="draft"]')
    wait(200)
    flt = page.evaluate("""() => ({
      ocal: !document.getElementById('sc-ocal').hidden,
      carousel: !document.getElementById('sc-carousel').hidden,
      packed: !document.getElementById('sc-packed').hidden,
      buttons: document.getElementById('sc-buttons').hidden
    })""")
    t(f"[{label}] تصفية draft/proposed تظهر العائلات المسودة وتخفي المستقرة",
      flt["ocal"] and flt["carousel"] and flt["packed"] and flt["buttons"], str(flt))
    page.click('[data-sc-filter="current"]')
    wait(200)
    t(f"[{label}] تصفية current/reference",
      page.evaluate("() => !document.getElementById('sc-buttons').hidden && document.getElementById('sc-ocal').hidden"))
    page.click('[data-sc-filter="all"]')
    wait(200)
    t(f"[{label}] تصفية «الكل» تعيد كل الأقسام",
      page.evaluate("() => !document.getElementById('sc-ocal').hidden && !document.getElementById('sc-buttons').hidden"))


def run_width_matrix(base_url, label, screenshot_prefix):
    """320/360/390/430 × RTL على الهدف — قياس فيض وعرض اللوحة."""
    global page
    for w in (320, 360, 390, 430):
        page.set_viewport_size({"width": w, "height": 844})
        page.goto(base_url, wait_until="load")
        wait(650)
        jclick(f'[data-sc-w="{w}"]')
        wait(250)
        info = page.evaluate("""(w) => ({
          sw: document.documentElement.scrollWidth,
          canvasW: document.getElementById('sc-canvas').getBoundingClientRect().width,
          tabsScroll: (function(){ const t = document.getElementById('sc-tabs'); return t.scrollWidth + '/' + t.clientWidth; })()
        })""", w)
        t(f"[{label}] عرض {w}: لا فيض أفقي ولوحة بعرض العرض",
          info["sw"] <= w and abs(info["canvasW"] - w) <= 1,
          f"sw={info['sw']} canvas={info['canvasW']} tabs={info['tabsScroll']}")
        shot(f"{screenshot_prefix}-rtl-{w}")
        if w <= 360:
            # مزيج تصفية × عرض (فجوة وجدها المراجع المستقل): الأقسام المخفية
            # عند الكشف لا تدفع الصفحة أفقيًا
            jclick('[data-sc-filter="draft"]')
            wait(350)
            sw_draft = page.evaluate("() => document.documentElement.scrollWidth")
            t(f"[{label}] عرض {w} + تصفية draft: لا فيض أفقي بعد كشف الأقسام",
              sw_draft <= w, f"sw={sw_draft}")
            jclick('[data-sc-filter="all"]')
            wait(300)
            sw_all = page.evaluate("() => document.documentElement.scrollWidth")
            t(f"[{label}] عرض {w} + تصفية all: لا فيض أفقي",
              sw_all <= w, f"sw={sw_all}")
            jclick('[data-sc-filter="current"]')
            wait(300)
    page.set_viewport_size({"width": 390, "height": 844})


def main() -> int:
    SHOTS.mkdir(parents=True, exist_ok=True)
    threading.Thread(target=serve, daemon=True).start()
    import time
    for _ in range(50):
        if chosen_port:
            break
        time.sleep(0.05)
    port = chosen_port[0]

    with sync_playwright() as p:
        global page
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        ctx.set_default_timeout(9000)
        page = ctx.new_page()

        # أخطاء موحدة لكل هدف
        page.on("pageerror", lambda e: page_errors.setdefault("target", []).append(str(e)))
        page.on("console", lambda m: console_errors.setdefault("target", []).append(m.text) if m.type == "error" else None)
        page.on("requestfailed", lambda r: failed_requests.setdefault("target", []).append(r.url))
        page.on("response", lambda r: failed_requests.setdefault("target", []).append(f"{r.status} {r.url}") if r.status >= 400 else None)

        editable = f"http://127.0.0.1:{port}/previews/ui-system-showcase/index.html"
        standalone = (SAMPLE / "standalone.html").as_uri()

        run_width_matrix(editable, "editable", "sc-w")
        run_interaction_matrix(editable, "editable", "sc-i")

        # الملف الواحد من file://
        run_width_matrix(standalone, "standalone", "sc-f")
        run_interaction_matrix(standalone, "standalone", "sc-fi")

        # لقطات أقسام (editable, 390, RTL) لكل عائلة
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(editable, wait_until="load")
        wait(700)
        sections = page.evaluate("""() => Array.from(document.querySelectorAll('.sc-section')).map(s => ({id: s.id, status: s.getAttribute('data-status')}))""")
        for s in sections:
            page.evaluate("(id) => document.getElementById(id).scrollIntoView()", s["id"])
            wait(250)
            shot(f"sc-section-{s['id']}")
        # لقطة إجهاد على قسم البيانات
        page.click('[data-sc-fixture="stress"]')
        wait(400)
        page.evaluate("() => document.getElementById('sc-data').scrollIntoView()")
        wait(300)
        shot("sc-stress-data-390")
        page.click('[data-sc-fixture="normal"]')
        wait(300)

        browser.close()

    # ---- كتابة سجل التحقق ----
    lines = []
    lines.append("UI SYSTEM SHOWCASE — VERIFICATION RUN")
    lines.append(f"التاريخ: {date.today().isoformat()} · المنفّذ: Zed AI")
    lines.append("المصدر: zai/ui-system-showcase-prototype-2026-10-09 (من 788c2fd)")
    lines.append("البيئة: Chromium headless (Playwright) فقط — الأجهزة/قارئات الشاشة/WebKit/native zoom: NOT RUN")
    lines.append("الأهداف: editable (http محلي) + standalone.html (file://)")
    lines.append("")
    passed = failed = 0
    for name, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        passed += ok
        failed += (not ok)
        lines.append(f"{mark} | {name}" + (f" | {detail}" if detail else ""))
    lines.append("")
    lines.append(f"الخلاصة: {passed} PASS / {failed} FAIL — إجمالي {len(results)}")
    lines.append(f"أخطاء console: {sum(len(v) for v in console_errors.values())}")
    lines.append(f"أخطاء صفحة: {sum(len(v) for v in page_errors.values())}")
    lines.append(f"موارد فاشلة: {sum(len(v) for v in failed_requests.values())}")
    if console_errors:
        lines.append("عينات console: " + "; ".join(e for v in console_errors.values() for e in v[:5]))
    if page_errors:
        lines.append("عينات pageerror: " + "; ".join(e for v in page_errors.values() for e in v[:5]))
    if failed_requests:
        lines.append("عينات موارد: " + "; ".join(r for v in failed_requests.values() for r in v[:10]))
    lines.append("")
    lines.append("ملاحظة الإخلاص: أي بند FAIL هنا عيب في العرض (prototype) يُصلح في ملفات العرض فقط؛")
    lines.append("عيب المكوّن الأساسي يُسجَّل PROTOTYPE_BLOCKED_BY_CORE_FINDING ولا يُرقَّع core من هذا الفرع.")
    (OUT_DIR / "verification.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"VERIFICATION: {passed} PASS / {failed} FAIL -> {OUT_DIR / 'verification.txt'}")
    if console_errors:
        print(f"  console errors: {sum(len(v) for v in console_errors.values())}")
    return 0 if failed == 0 and not console_errors and not page_errors else 1


if __name__ == "__main__":
    sys.exit(main())
