#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""بوابة العقد الموحد لدورة حياة API العائلات (المرحلة 6 — خطة 2026-11-21).

لكل عائلة لها JavaScript (انظر جدول المسح في docs/API.md — «العقد الموحد
للبرمجة»):
  أ) init مرتين على نسخة مكررة حديثة من ترميز أدنى صالح لا يضاعف
     المستمعات: الفعل الأساسي للعائلة يطلق حدثها مرة واحدة بالضبط.
  ب) update (الاسم الموحد، أو غيابه الموثق حيث لا مفهوم بيانات) بعد init
     يعيد التصيير/يتقدم بلا أخطاء وبلا ازدواج مستمعات: فعل ← عدّ ←
     update ← فعل ← العدّ نفسه.
  ج) disconnect/destroy حسب موثق كل عائلة: بعد التنظيف الفعل نفسه لا
     يطلق أي حدث (ولا يغير حالة قابلة للفحص)، ولا أخطاء صفحة/كونسول.
العائلات التي لا ينطبق عليها update (Buttons وOrganization وSelection و
Messages وNavigation وAccount Settings — حالة أصلية عند المستهلك أو واجهات
حالة لا بيانات) يُفحص غياب update الموثق (لم يُخترع سلوك). عائلة Surfaces
عائلة CSS بلا JavaScript فلا تدخل الفحص؛ العائلات الثانوية المشمولة
كتغطية إضافية: Picker (عائلة Selection/Picker) وPacked وPeek (متغيرا
Data وInfo Strip). صفحة الفحص تُخدم من جذر المستودع (نمط
product-context-check.py، مع browser_support.chromium_launch_options)
وتحمل الخطوط والتوكنز والحركة وCSS/JS كل العائلات، وترميز أدنى صالح لكل
عائلة داخل <template> منسوخ من example-usage الحقيقية (عربية RTL).
الهدف 360×780 RTL وLight وreduced-motion. تقرير JSON إلى --out
(افتراضيًا مجلد مؤقت) وخروج غير صفري عند أي فشل.
"""
import argparse
import http.server
import json
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]

# ترتيب التحميل موثق في docs/API.md: الخطوط ثم التوكنز ثم الحركة ثم CSS
# العائلات (buttons أولًا لأن رسوم Data/Metric تستهلك B01 لأفعالها المولدة).
CSS = (
    "assets/fonts/fonts.css",
    "shared/tokens.css",
    "shared/motion.css",
    "components/buttons/buttons.css",
    "components/fields/fields.css",
    "components/selection/selection.css",
    "components/selection/picker.css",
    "components/organization/organization.css",
    "components/data/data.css",
    "components/data/packed-circle.css",
    "components/messages/messages.css",
    "components/navigation/navigation.css",
    "components/navigation/action-sheet.css",
    "components/info-strip/info-strip.css",
    "components/info-strip/info-strip-peek.css",
    "components/metric-comparison/metric-comparison.css",
    "components/account-settings/account-settings.css",
    "components/access-gateway/access-gateway.css",
    "components/order-schedule/order-schedule.css",
    "components/carousel/carousel.css",
)
# R2.3: الفحص يستهلك dist/iife المبني — ملف واحد لكل مدخل (labels مضمنة).
JS = (
    "dist/iife/labels.js",
    "dist/iife/buttons.js",
    "dist/iife/fields.js",
    "dist/iife/selection.js",
    "dist/iife/picker.js",
    "dist/iife/organization.js",
    "dist/iife/data.js",
    "dist/iife/packed-circle.js",
    "dist/iife/messages.js",
    "dist/iife/navigation.js",
    "dist/iife/action-sheet.js",
    "dist/iife/info-strip.js",
    "dist/iife/info-strip-peek.js",
    "dist/iife/metric-comparison.js",
    "dist/iife/account-settings.js",
    "dist/iife/access-gateway.js",
    "dist/iife/order-schedule.js",
    "dist/iife/carousel.js",
    "dist/iife/readings.js",
    "dist/iife/icons.js",
    "dist/iife/product.js",
)

# ترميز أدنى صالح لكل عائلة — منسوخ من example-usage/spec الحقيقية.
TEMPLATES = """
<template id="tpl-buttons"><button class="m-btn m-btn--primary" type="button" data-loading-label="جارٍ الحفظ">حفظ العملية</button></template>
<template id="tpl-fields"><div class="m-field" data-micro-field>
  <label class="m-field__label" for="lc-field-q">بحث الطلبات</label>
  <div class="m-field__control">
    <input class="m-field__input" id="lc-field-q" type="search" value="ORD-1042">
    <button type="button" class="m-btn m-btn--icon m-btn--secondary m-field__clear" aria-label="مسح البحث"><svg class="m-btn__icon" aria-hidden="true"></svg></button>
  </div>
</div></template>
<template id="tpl-selection"><div data-seg role="group" aria-label="ترتيب العرض">
  <button type="button" class="m-seg__item" aria-pressed="true" data-value="new">الأحدث</button>
  <button type="button" class="m-seg__item" aria-pressed="false" data-value="old">الأقدم</button>
</div></template>
<template id="tpl-picker"><div class="m-picker" data-micro-picker>
  <input class="m-picker__input" type="search" data-picker-search autocomplete="off" aria-label="بحث بالمورد">
  <div class="m-picker__list" role="listbox" aria-label="الموردون" data-picker-list>
    <button type="button" class="m-picker__option" role="option" aria-selected="false" data-value="petrol">شركة البترول الوطنية</button>
    <button type="button" class="m-picker__option" role="option" aria-selected="false" data-value="noor">مؤسسة النور للتوريدات</button>
  </div>
  <p class="m-picker__foot" data-picker-summary>المحدد: لا شيء</p>
</div></template>
<template id="tpl-organization"><section class="m-section">
  <button type="button" class="m-section__head" aria-expanded="false" aria-controls="lc-org-body">تفاصيل القسم</button>
  <div class="m-section__body" id="lc-org-body" hidden>محتوى القسم</div>
</section></template>
<template id="tpl-data"><section class="m-chart" data-chart="bars" data-max="12" data-summary-text="مثال فحص العقد: فئتان.">
  <h3 class="m-chart__title">توزيع العمليات</h3>
  <ul class="m-chart__data" hidden>
    <li data-series="a" data-label="مبيعات" data-value="8"></li>
    <li data-series="b" data-label="مرتجعات" data-value="3"></li>
  </ul>
  <div data-plot></div>
</section></template>
<template id="tpl-packed-circle"><section class="m-chart" data-chart-packed>
  <h3 class="m-chart__title">كثافة الفئات</h3>
  <ul class="m-chart__data" hidden>
    <li data-series="a" data-label="مبيعات" data-value="4"></li>
    <li data-series="b" data-label="مرتجعات" data-value="2"></li>
  </ul>
  <div data-plot></div>
</section></template>
<template id="tpl-messages"><div class="m-note m-note--info">
  <div class="m-note__text"><span class="m-note__title">تنبيه</span><p class="m-note__body">تم حفظ المسودة على هذا الجهاز.</p></div>
  <button type="button" class="m-btn m-btn--icon m-btn--secondary m-note__close" aria-label="إغلاق الرسالة"><svg class="m-btn__icon" aria-hidden="true"></svg></button>
</div></template>
<template id="tpl-navigation"><div>
  <div data-tabs role="tablist" aria-label="أقسام الصفحة">
    <button type="button" role="tab" aria-selected="true" aria-controls="lc-nav-panel-a">التشغيل</button>
    <button type="button" role="tab" aria-selected="false" aria-controls="lc-nav-panel-b">الأرشيف</button>
  </div>
  <div role="tabpanel" id="lc-nav-panel-a">محتوى التشغيل</div>
  <div role="tabpanel" id="lc-nav-panel-b" hidden>محتوى الأرشيف</div>
  <button type="button" data-layer-open="lc-nav-layer">فتح الإعدادات</button>
  <div class="m-layer" id="lc-nav-layer" hidden role="dialog" aria-label="إعدادات سريعة">
    <button type="button" data-layer-close>إغلاق</button>
  </div>
</div></template>
<template id="tpl-info-strip"><div class="m-info-strip" data-info-strip>
  <div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0">
    <div class="m-info-strip__track" data-info-strip-track>
      <article class="m-info-strip__slide">مبيعات اليوم</article>
      <article class="m-info-strip__slide">طلبات معلقة</article>
      <article class="m-info-strip__slide">مرتجعات</article>
    </div>
  </div>
  <div data-info-strip-controls>
    <button type="button" data-info-strip-prev>السابق</button>
    <span data-info-strip-position></span>
    <button type="button" data-info-strip-next>التالي</button>
  </div>
</div></template>
<template id="tpl-info-peek"><div class="m-info-strip m-info-peek" data-info-strip data-info-peek>
  <div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0">
    <div class="m-info-strip__track" data-info-strip-track>
      <article class="m-info-strip__slide">مبيعات اليوم</article>
      <article class="m-info-strip__slide">طلبات معلقة</article>
      <article class="m-info-strip__slide">مرتجعات</article>
    </div>
  </div>
  <div data-info-strip-controls>
    <button type="button" data-info-strip-prev>السابق</button>
    <span data-info-strip-position></span>
    <button type="button" data-info-strip-next>التالي</button>
  </div>
</div></template>
<template id="tpl-metric-comparison"><section class="m-main-metric" data-main-comparison data-common-unit="عملية" data-common-period="اليوم" data-max="40">
  <h2 class="m-main-metric__title">قيمة رئيسية ومؤشرات مستقلة</h2>
  <div class="m-main-metric__layout">
    <div class="m-main-metric__hero">
      <span class="m-main-metric__label">قيمة العينة</span>
      <span class="m-main-metric__value"><span class="m-main-metric__number" dir="ltr">18</span><span class="m-main-metric__unit">عملية</span></span>
    </div>
    <div>
      <ul class="m-main-metric__source" data-bar-source hidden>
        <li data-label="طلبات" data-value="32" data-unit="عملية" data-period="اليوم" data-series="a"></li>
        <li data-label="مرتجعات" data-value="9" data-unit="عملية" data-period="اليوم" data-series="b"></li>
      </ul>
      <ul class="m-main-metric__rows" data-bar-items aria-label="مؤشرات مستقلة"></ul>
      <p class="m-main-metric__status" data-bar-status aria-live="polite"></p>
    </div>
  </div>
</section></template>
<template id="tpl-account-settings"><div data-account-settings data-account-layer-id="lc-account-layer">
  <button type="button" data-account-open>فتح الإعدادات</button>
  <div class="m-layer" id="lc-account-layer" hidden role="dialog" aria-label="إعدادات الحساب">
    <h2 id="lc-account-title" data-account-title="account">الحساب</h2>
    <h2 id="lc-app-title" data-account-title="application" hidden>التطبيق</h2>
    <div data-account-view="account">
      <label class="m-choice m-choice--check"><input type="checkbox" data-account-setting="emails"><span>إشعارات البريد</span></label>
    </div>
    <div data-account-view="application" hidden>إعدادات التطبيق</div>
  </div>
</div></template>
<template id="tpl-access-gateway"><section class="m-access-gateway" data-access-gateway>
  <form data-access-form novalidate>
    <div class="m-access-gateway__fields">
      <div class="m-field" data-micro-field>
        <label class="m-field__label" for="lc-access-email">البريد الإلكتروني</label>
        <div class="m-field__control">
          <input class="m-field__input" id="lc-access-email" data-access-credential="email" type="email" inputmode="email" autocomplete="username" required>
        </div>
      </div>
      <div class="m-field" data-micro-field>
        <label class="m-field__label" for="lc-access-password">كلمة المرور</label>
        <div class="m-field__control">
          <input class="m-field__input" id="lc-access-password" data-access-credential="password" type="password" autocomplete="current-password" required>
          <button type="button" class="m-btn m-btn--secondary m-access-gateway__reveal" data-access-reveal aria-controls="lc-access-password" aria-label="إظهار كلمة المرور" aria-pressed="false">إظهار</button>
        </div>
      </div>
    </div>
    <button class="m-btn m-btn--primary" type="submit">متابعة</button>
    <p class="m-access-gateway__status" data-access-status role="status" aria-live="polite"></p>
  </form>
</section></template>
<template id="tpl-order-schedule"><div></div></template>
<template id="tpl-carousel"><div class="m-carousel" data-carousel data-carousel-label="ملخصات متعددة" role="group" aria-roledescription="عارض بطاقات">
  <div class="m-carousel__viewport" data-viewport>
    <ul class="m-carousel__track" data-track>
      <li class="m-carousel__slide" data-carousel-slide data-card-label="ملخص الطلبات"><div class="m-carousel__card">ملخص الطلبات</div></li>
      <li class="m-carousel__slide" data-carousel-slide data-card-label="ملخص المورد"><div class="m-carousel__card">ملخص المورد</div></li>
      <li class="m-carousel__slide" data-carousel-slide data-card-label="ملخص المرتجعات"><div class="m-carousel__card">ملخص المرتجعات</div></li>
    </ul>
  </div>
  <div class="m-carousel__controls">
    <button type="button" class="m-carousel__btn" data-prev aria-label="السابق"></button>
    <span data-status aria-live="polite"></span>
    <button type="button" class="m-carousel__btn" data-next aria-label="التالي"></button>
  </div>
</div></template>
"""


def fixture_page():
    links = "".join(f'<link rel="stylesheet" href="/{href}">' for href in CSS)
    scripts = "".join(f'<script src="/{src}"></script>' for src in JS)
    return ("<!doctype html><html lang=\"ar\" dir=\"rtl\"><head><meta charset=\"utf-8\">"
            "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
            "<link rel=\"icon\" href=\"data:,\">"
            "<title>api-lifecycle — العقد الموحد</title>" + links + "</head><body><main>"
            + TEMPLATES + "</main>" + scripts + "</body></html>")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == "/api-lifecycle.html":
            body = fixture_page().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()


SCRIPT = r"""async () => {
  const results = [];
  const record = (family, name, passed, detail) => results.push({
    family, name, passed: !!passed, detail: detail === undefined ? null : detail
  });
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 30));
  const frames = () => new Promise((r) => requestAnimationFrame(
    () => requestAnimationFrame(() => setTimeout(r, 40))));
  const countOn = (node, type) => {
    let n = 0;
    const fn = () => { n += 1; };
    node.addEventListener(type, fn);
    return { get: () => n, off: () => node.removeEventListener(type, fn) };
  };
  const mount = (family, width) => {
    const holder = document.createElement('div');
    holder.dataset.apiLifecycleFamily = family;
    if (width) holder.style.width = width + 'px';
    const root = document.getElementById('tpl-' + family).content.firstElementChild.cloneNode(true);
    holder.appendChild(root);
    document.body.appendChild(holder);
    return { holder, root };
  };
  const done = (m) => m.holder.remove();

  /* اطمئنان الجاهزية: refit الخطوط (data/metric/packed تسجله مرة عند
     التحميل) يجب أن يمر قبل إنشاء أي رسم ديناميكي كي لا يدخل في العدّ. */
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  await tick(60);

  /* ---------- Buttons ---------- */
  {
    const m = mount('buttons');
    const btn = m.root.matches('.m-btn') ? m.root : m.root.querySelector('.m-btn');
    const found = MicroButtons.init(m.root);
    const again = MicroButtons.init(m.root);
    record('buttons', 'init(root) يعيد instance جذره النطاق (R4)', !!found && found.root === m.root && typeof found.update === 'function' && typeof found.destroy === 'function', found && found.root === m.root);
    record('buttons', 'init مرتين يعيدان المثيل نفسه (لا ربط مضاعف)', again === found);
    const clicks = countOn(document, 'click');
    btn.click();
    const oneActivation = clicks.get();
    MicroButtons.setLoading(btn, true, { loadingLabel: 'جارٍ الحفظ' });
    btn.click();
    const whileBusy = clicks.get();
    record('buttons', 'a: تفعيل أصلي مرة واحدة، والتحميل يحرس التفعيل (لا click يتجاوز الزر)', oneActivation === 1 && whileBusy === 1, { oneActivation, whileBusy });
    record('buttons', 'b: update غير منطبق موثقًا (لا مفهوم بيانات — setLoading واجهة الحالة العابرة)', typeof MicroButtons.update !== 'function');
    MicroButtons.disconnect(m.root);
    const busyAfter = btn.getAttribute('aria-busy');
    btn.click();
    const afterDisconnect = clicks.get();
    record('buttons', 'c: disconnect ينهي التحميل ويفك الحراسة — click واحد يصل بعده', busyAfter !== 'true' && afterDisconnect === 2, { busyAfter, afterDisconnect });
    clicks.off();
    done(m);
  }

  /* ---------- Fields ---------- */
  {
    const m = mount('fields');
    const input = m.root.matches('[data-micro-field]') ? m.root : m.root.querySelector('[data-micro-field]');
    const fieldInput = input.querySelector('.m-field__input');
    const clear = input.querySelector('.m-field__clear');
    const ev = countOn(m.root, 'micro-field:cleared');
    MicroFields.init(m.root);
    MicroFields.init(m.root);
    clear.click();
    record('fields', 'a: init مرتين ثم مسح واحد → micro-field:cleared مرة واحدة بالضبط', ev.get() === 1 && fieldInput.value === '', { events: ev.get(), value: fieldInput.value });
    fieldInput.value = 'INV-77021';
    MicroFields.update(m.root);
    const visibleAfterUpdate = clear.classList.contains('is-visible');
    clear.click();
    record('fields', 'b: update(root) يفوّض إلى sync (زر المسح عاد) والفعل بعدها يطلق حدثًا واحدًا', visibleAfterUpdate && ev.get() === 2 && fieldInput.value === '', { visibleAfterUpdate, events: ev.get() });
    MicroFields.disconnect(m.root);
    clear.click();
    record('fields', 'c: بعد disconnect لا حدث مسح إطلاقًا', ev.get() === 2, ev.get());
    ev.off();
    done(m);
  }

  /* ---------- Selection ---------- */
  {
    const m = mount('selection');
    const seg = m.root.matches('[data-seg]') ? m.root : m.root.querySelector('[data-seg]');
    const items = seg.querySelectorAll('.m-seg__item');
    const ev = countOn(m.root, 'micro-selection:segment');
    MicroSelection.init(m.root);
    MicroSelection.init(m.root);
    items[1].click();
    record('selection', 'a: init مرتين ثم اختيار مقطع → micro-selection:segment مرة واحدة', ev.get() === 1 && items[1].getAttribute('aria-pressed') === 'true', { events: ev.get(), pressed: items[1].getAttribute('aria-pressed') });
    record('selection', 'b: update غير منطبق موثقًا (الحالة الأصلية checked/pressed يملكها المستهلك)', typeof MicroSelection.update !== 'function');
    MicroSelection.disconnect(m.root);
    items[0].click();
    record('selection', 'c: بعد disconnect لا حدث ولا تغيير تحديد', ev.get() === 1 && items[1].getAttribute('aria-pressed') === 'true', { events: ev.get(), pressed: items[1].getAttribute('aria-pressed') });
    ev.off();
    done(m);
  }

  /* ---------- Picker (عائلة Selection/Picker) ---------- */
  {
    const m = mount('picker');
    const picker = m.root.matches('[data-micro-picker]') ? m.root : m.root.querySelector('[data-micro-picker]');
    const ev = countOn(m.root, 'micro-picker:change');
    MicroPicker.init(m.root);
    MicroPicker.init(m.root);
    picker.querySelector('.m-picker__option').click();
    record('picker', 'a: init مرتين ثم اختيار → micro-picker:change مرة واحدة', ev.get() === 1, ev.get());
    MicroPicker.update(m.root, [
      { value: 'noor', label: 'مؤسسة النور للتوريدات' },
      { value: 'wadi', label: 'شركة الوادي للتجارة' }
    ]);
    const optionCount = picker.querySelectorAll('.m-picker__option').length;
    const removalEvents = ev.get() - 1; /* موثق: حذف المحدد مع setOptions يطلق change واحدًا */
    picker.querySelector('.m-picker__option').click();
    record('picker', 'b: update(root, items) يستبدل الخيارات عبر setOptions (حدث إزالة موثق واحد) والاختيار بعده يطلق حدثًا واحدًا', optionCount === 2 && removalEvents === 1 && ev.get() === 3, { optionCount, removalEvents, events: ev.get() });
    record('picker', 'b: الملخص يتبع الاختيار الجديد', picker.querySelector('[data-picker-summary]').textContent.indexOf('النور') >= 0, picker.querySelector('[data-picker-summary]').textContent);
    MicroPicker.destroy(m.root);
    picker.querySelector('.m-picker__option').click();
    record('picker', 'c: بعد destroy لا حدث change إطلاقًا', ev.get() === 3, ev.get());
    ev.off();
    done(m);
  }

  /* ---------- Organization ---------- */
  {
    const m = mount('organization');
    const head = m.root.querySelector('.m-section__head');
    const body = m.root.querySelector('.m-section__body');
    const ev = countOn(m.root, 'micro-organization:toggle');
    MicroOrganization.init(m.root);
    MicroOrganization.init(m.root);
    head.click();
    record('organization', 'a: init مرتين ثم طي/فتح → toggle مرة واحدة والحالة انقلبت مرة', ev.get() === 1 && head.getAttribute('aria-expanded') === 'true' && !body.hidden, { events: ev.get(), expanded: head.getAttribute('aria-expanded') });
    record('organization', 'b: update غير منطبق موثقًا (تحديث source DOM عند المستهلك ثم init)', typeof MicroOrganization.update !== 'function');
    MicroOrganization.disconnect(m.root);
    head.click();
    record('organization', 'c: بعد disconnect لا حدث ولا انقلاب حالة', ev.get() === 1 && head.getAttribute('aria-expanded') === 'true' && !body.hidden, { events: ev.get(), expanded: head.getAttribute('aria-expanded') });
    ev.off();
    done(m);
  }

  /* ---------- Data ---------- */
  {
    const m = mount('data', 320);
    const chart = m.root.matches('[data-chart]') ? m.root : m.root.querySelector('[data-chart]');
    const ev = countOn(m.root, 'micro-data:rendered');
    MicroData.init(m.root);
    MicroData.init(m.root);
    const renderedOnInitTwice = ev.get();
    const disclose = chart.querySelector('.m-chart__disclose');
    disclose.click();
    record('data', 'a: init مرتين: المثيل نفسه يُعاد بلا إعادة تصيير مكررة (R4) والإفصاح ينقلب مرة واحدة فقط', renderedOnInitTwice === 1 && disclose.getAttribute('aria-expanded') === 'true', { renderedOnInitTwice, expanded: disclose.getAttribute('aria-expanded') });
    const before = ev.get();
    chart.querySelector('.m-chart__data li[data-series="b"]').setAttribute('data-value', '10');
    MicroData.update(m.root);
    const afterUpdate = ev.get();
    chart.querySelector('.m-chart__disclose').click();
    record('data', 'b: update(root) يعيد تصيير رسوم النطاق عبر render (حدث rendered واحد لكل رسم) والإفصاح بعدها ينقلب مرة', afterUpdate - before === 1 && chart.querySelector('.m-chart__disclose').getAttribute('aria-expanded') === 'false', { before, afterUpdate, expanded: chart.querySelector('.m-chart__disclose').getAttribute('aria-expanded') });
    m.holder.style.width = '200px';
    await frames();
    const afterShrink = ev.get();
    MicroData.disconnect(m.root);
    m.holder.style.width = '320px';
    await frames();
    record('data', 'c: تغيير العرض قبل الفصل يعيد الرسم مرة، وبعد disconnect لا rendered إطلاقًا', afterShrink === afterUpdate + 1 && ev.get() === afterShrink, { afterUpdate, afterShrink, afterDisconnect: ev.get() });
    ev.off();
    done(m);
  }

  /* ---------- Packed (متغير عائلة Data) ---------- */
  {
    const m = mount('packed-circle', 320);
    const chart = m.root.matches('[data-chart-packed]') ? m.root : m.root.querySelector('[data-chart-packed]');
    const ev = countOn(m.root, 'micro-packed:rendered');
    MicroPacked.init(m.root);
    MicroPacked.init(m.root);
    record('packed-circle', 'a: init مرتين يرسمان الدوائر والجدول مرة واحدة (لا ازدواج)', !!chart.querySelector('.m-bubble') && chart.querySelectorAll('table').length === 1, { bubbles: !!chart.querySelector('.m-bubble'), tables: chart.querySelectorAll('table').length });
    const before = ev.get();
    chart.querySelector('.m-chart__data li[data-series="b"]').setAttribute('data-value', '5');
    MicroPacked.update(m.root);
    record('packed-circle', 'b: update(root) يعيد التصيير عبر render (حدث rendered واحد لكل رسم)', ev.get() - before === 1, { before, after: ev.get() });
    const roDuring = window.auditROs.size;
    MicroPacked.disconnect(m.root);
    record('packed-circle', 'c: disconnect يحرر مراقب العرض الوحيد للرسم', window.auditROs.size === roDuring - 1, { roDuring, after: window.auditROs.size });
    ev.off();
    done(m);
  }

  /* ---------- Messages ---------- */
  {
    const m = mount('messages');
    const note = m.root.matches('.m-note') ? m.root : m.root.querySelector('.m-note');
    const close = note.querySelector('.m-note__close');
    const ev = countOn(m.root, 'micro-messages:note-closed');
    MicroMessages.init(m.root);
    MicroMessages.init(m.root);
    close.click();
    record('messages', 'a: init مرتين ثم إغلاق → note-closed مرة واحدة والرسالة اختفت', ev.get() === 1 && note.hidden, { events: ev.get(), hidden: note.hidden });
    record('messages', 'b: update غير منطبق موثقًا (toast/announce/closeToast واجهات الحالة)', typeof MicroMessages.update !== 'function');
    note.hidden = false;
    MicroMessages.disconnect(m.root);
    close.click();
    record('messages', 'c: بعد disconnect الإغلاق لا يطلق الحدث ولا يخفي', ev.get() === 1 && note.hidden === false, { events: ev.get(), hidden: note.hidden });
    ev.off();
    done(m);
  }

  /* ---------- Navigation ---------- */
  {
    const m = mount('navigation');
    const layer = m.root.querySelector('.m-layer');
    const trigger = m.root.querySelector('[data-layer-open]');
    const ev = countOn(m.root, 'micro-navigation:opened');
    MicroNavigation.init(m.root);
    MicroNavigation.init(m.root);
    m.root.querySelectorAll('[role="tab"]')[1].click();
    const panelSwitched = !m.root.querySelector('#lc-nav-panel-b').hidden;
    trigger.click();
    record('navigation', 'a: init مرتين ثم فتح الطبقة → micro-navigation:opened مرة واحدة والطبقة ظاهرة (والتبويب يبدّل لوحته)', ev.get() === 1 && !layer.hidden && panelSwitched, { events: ev.get(), hidden: layer.hidden, panelSwitched });
    record('navigation', 'b: update غير منطبق موثقًا (openLayer/closeLayer/setAppliedFilters واجهات الحالة)', typeof MicroNavigation.update !== 'function');
    MicroNavigation.closeLayer(layer);
    MicroNavigation.disconnect(m.root);
    trigger.click();
    record('navigation', 'c: بعد disconnect الفتح لا يطلق الحدث والطبقة تبقى مخفية', ev.get() === 1 && layer.hidden, { events: ev.get(), hidden: layer.hidden });
    ev.off();
    done(m);
  }

  /* ---------- Info Strip ---------- */
  {
    const m = mount('info-strip', 320);
    const strip = m.root.matches('[data-info-strip]') ? m.root : m.root.querySelector('[data-info-strip]');
    const position = strip.querySelector('[data-info-strip-position]');
    MicroInfoStrip.init(m.root);
    MicroInfoStrip.init(m.root);
    strip.querySelector('[data-info-strip-next]').click();
    record('info-strip', 'a: init مرتين ثم «التالي» مرة → تقدم فهرس واحد فقط (لا ازدواج مستمعات)', position.textContent.trim() === '2 / 3', position.textContent.trim());
    const extra = document.createElement('article');
    extra.className = 'm-info-strip__slide';
    extra.textContent = 'قراءة رابعة';
    strip.querySelector('[data-info-strip-track]').appendChild(extra);
    MicroInfoStrip.update(m.root);
    strip.querySelector('[data-info-strip-next]').click();
    /* rescan يفصل الربط ويعيد التهيئة من أول بطاقة (موثق R-15) —
       دليل الالتقاط هو العداد الجديد «/ 4» ثم تقدم فهرس واحد فقط. */
    record('info-strip', 'b: update(root) يفوّض إلى rescan (التقط البطاقة الرابعة) والتقدم بعدها فهرس واحد', position.textContent.trim() === '2 / 4', position.textContent.trim());
    MicroInfoStrip.disconnect(m.root);
    strip.querySelector('[data-info-strip-next]').click();
    record('info-strip', 'c: بعد disconnect «التالي» لا يغير الفهرس', position.textContent.trim() === '2 / 4', position.textContent.trim());
    done(m);
  }

  /* ---------- Info Peek (متغير عائلة Info Strip) ---------- */
  {
    const m = mount('info-peek', 320);
    const strip = m.root.matches('[data-info-peek]') ? m.root : m.root.querySelector('[data-info-peek]');
    const ev = countOn(m.root, 'micro-info-peek:change');
    MicroInfoPeek.init(m.root);
    MicroInfoPeek.init(m.root);
    strip.querySelector('[data-info-strip-next]').click();
    record('info-peek', 'a: init مرتين ثم «التالي» → micro-info-peek:change مرة واحدة', ev.get() === 1 && MicroInfoPeek.getIndex(strip) === 1, { events: ev.get(), index: MicroInfoPeek.getIndex(strip) });
    const before = ev.get();
    MicroInfoPeek.update(strip, 2);
    const afterGoTo = ev.get();
    const indexAfterGoTo = MicroInfoPeek.getIndex(strip);
    strip.querySelector('[data-info-strip-prev]').click();
    record('info-peek', 'b: update(strip, index) يفوّض إلى goTo (حدث برمجي واحد) والفعل بعدها يطلق حدثًا واحدًا', afterGoTo === before + 1 && indexAfterGoTo === 2 && ev.get() === before + 2, { before, afterGoTo, after: ev.get(), indexAfterGoTo });
    MicroInfoPeek.disconnect(m.root);
    strip.querySelector('[data-info-strip-next]').click();
    record('info-peek', 'c: بعد disconnect لا حدث change إطلاقًا', ev.get() === before + 2, { before, after: ev.get() });
    ev.off();
    done(m);
  }

  /* ---------- Metric Comparison ---------- */
  {
    const m = mount('metric-comparison', 320);
    const chart = m.root.matches('[data-main-comparison]') ? m.root : m.root.querySelector('[data-main-comparison]');
    MicroMetricComparison.init(m.root);
    MicroMetricComparison.init(m.root);
    const disclose = chart.querySelector('.m-main-metric__disclose');
    disclose.click();
    const rows = chart.querySelectorAll('[data-bar-items] > *').length;
    record('metric-comparison', 'a: init مرتين يرسمان الصفوف مرة، والإفصاح ينقلب مرة واحدة فقط', rows === 2 && disclose.getAttribute('aria-expanded') === 'true', { rows, expanded: disclose.getAttribute('aria-expanded') });
    const source = chart.querySelector('[data-bar-source] li[data-series="b"]');
    source.setAttribute('data-value', '21');
    MicroMetricComparison.update(m.root);
    const discloseAfter = chart.querySelector('.m-main-metric__disclose');
    discloseAfter.click();
    record('metric-comparison', 'b: update(root) يعيد التصيير عبر render والإفصاح بعدها ينقلب مرة (لا ازدواج مستمعات)', chart.querySelectorAll('[data-bar-items] > *').length === 2 && discloseAfter.getAttribute('aria-expanded') === 'false', { rows: chart.querySelectorAll('[data-bar-items] > *').length, expanded: discloseAfter.getAttribute('aria-expanded') });
    const readyBefore = chart.hasAttribute('data-metric-ready');
    const roDuring = window.auditROs.size;
    MicroMetricComparison.disconnect(m.root);
    chart.querySelector('.m-main-metric__disclose').click();
    record('metric-comparison', 'c: disconnect يزيل سمات الجاهزية ويحرر المراقب، والإفصاح المساعد يبقى ملك العرض (موثق)', !chart.hasAttribute('data-metric-ready') && !chart.hasAttribute('data-bars-ready') && window.auditROs.size === roDuring - 1, { readyBefore, roDuring, after: window.auditROs.size });
    done(m);
  }

  /* ---------- Account Settings ---------- */
  {
    const m = mount('account-settings');
    const panel = m.root.matches('[data-account-settings]') ? m.root : m.root.querySelector('[data-account-settings]');
    const setting = panel.querySelector('[data-account-setting]');
    const ev = countOn(m.root, 'micro-account-settings:change');
    MicroAccountSettings.init(m.root);
    MicroAccountSettings.init(m.root);
    setting.click();
    record('account-settings', 'a: init مرتين ثم تبديل إعداد → micro-account-settings:change مرة واحدة', ev.get() === 1, ev.get());
    record('account-settings', 'b: update غير منطبق موثقًا (لا setData/save — الحالة أصلية عند المستهلك)', typeof MicroAccountSettings.update !== 'function');
    MicroAccountSettings.disconnect(m.root);
    setting.click();
    record('account-settings', 'c: بعد disconnect لا حدث تغيير إطلاقًا', ev.get() === 1, ev.get());
    ev.off();
    done(m);
  }

  /* ---------- Access Gateway ---------- */
  {
    const m = mount('access-gateway');
    const gateway = m.root.matches('[data-access-gateway]') ? m.root : m.root.querySelector('[data-access-gateway]');
    const form = gateway.querySelector('form');
    const status = gateway.querySelector('[data-access-status]');
    const submit = form.querySelector('[type="submit"]');
    const ev = countOn(m.root, 'micro-access:submitted');
    MicroAccessGateway.init(m.root, { onSubmit: () => ({ message: 'أول رد', tone: 'info' }) });
    MicroAccessGateway.init(m.root, { onSubmit: () => ({ message: 'أول رد', tone: 'info' }) });
    form.querySelector('[type="email"]').value = 'owner@micro.example';
    form.querySelector('[type="password"]').value = 'secret-1042';
    submit.click();
    await tick(40);
    record('access-gateway', 'a: init مرتين (تحديث callbacks موثق) ثم إرسال → micro-access:submitted مرة واحدة', ev.get() === 1, ev.get());
    record('access-gateway', 'a: رسالة النتيجة ظاهرة', status.textContent.indexOf('أول رد') >= 0, status.textContent);
    MicroAccessGateway.update(m.root, { onSubmit: () => ({ message: 'ثاني رد', tone: 'info' }) });
    submit.click();
    await tick(40);
    record('access-gateway', 'b: update(root, handlers) يحدّث الـcallbacks بلا ربط مضاعف (حدث واحد جديد)', ev.get() === 2 && status.textContent.indexOf('ثاني رد') >= 0, { events: ev.get(), status: status.textContent });
    MicroAccessGateway.destroy(m.root);
    submit.click();
    await tick(40);
    record('access-gateway', 'c: بعد destroy الإرسال لا يطلق الحدث', ev.get() === 2, ev.get());
    ev.off();
    done(m);
  }

  /* ---------- Order Schedule ---------- */
  {
    const m = mount('order-schedule');
    const ev = countOn(m.root, 'order-schedule:day-select');
    const ORDERS = [
      { id: 'od-01', title: 'طلب القهوة العربية', date: '2026-11-21', time: '14:30', statusKey: 'progress', customer: 'مطعم الواحة' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-11-22', time: '09:00', statusKey: 'done', customer: 'شركة النور' }
    ];
    const STATUSES = {
      progress: { label: 'قيد التنفيذ', tone: 'progress' },
      done: { label: 'تم التسليم', tone: 'success' }
    };
    const inst1 = MicroOrderSchedule.init(m.root, { orders: ORDERS, statuses: STATUSES, today: '2026-11-21', selectedDate: '2026-11-21', view: 'calendar', calendarView: 'month' });
    const inst2 = MicroOrderSchedule.init(m.root, {});
    record('order-schedule', 'a: init مرتين على نفس الجذر يعيد المثيل نفسه (لا مستمعات جديدة)', inst1 === inst2 && !!inst1, inst1 === inst2);
    const dayCell = m.root.querySelector('[data-ocal-action="day-cell"][data-ocal-date="2026-11-22"]');
    dayCell.click();
    record('order-schedule', 'a: اختيار يوم يطلق day-select مرة واحدة', ev.get() === 1, ev.get());
    const returned = MicroOrderSchedule.update(m.root, [ORDERS[0]]);
    const dayCellAgain = m.root.querySelector('[data-ocal-action="day-cell"][data-ocal-date="2026-11-22"]');
    dayCellAgain.click();
    record('order-schedule', 'b: update(root, orders) يفوّض إلى setData ويعيد المثيل، والاختيار بعده يطلق حدثًا واحدًا', returned === inst1 && ev.get() === 2, { sameInstance: returned === inst1, events: ev.get() });
    inst1.destroy();
    const emptied = m.root.textContent.trim() === '' && !m.root.hasAttribute('data-ocal-init');
    const stale = document.createElement('button');
    stale.type = 'button';
    stale.setAttribute('data-ocal-action', 'day-cell');
    stale.setAttribute('data-ocal-date', '2026-11-21');
    m.root.appendChild(stale);
    stale.click();
    record('order-schedule', 'c: destroy يفرغ الجذر وينزع المستمعات — فعل يوم بعده صفر أحداث', emptied && ev.get() === 2, { emptied, events: ev.get() });
    ev.off();
    done(m);
  }

  /* ---------- Carousel ---------- */
  {
    const m = mount('carousel', 320);
    const carousel = m.root.matches('[data-carousel]') ? m.root : m.root.querySelector('[data-carousel]');
    const ev = countOn(m.root, 'micro-carousel:change');
    MicroCarousel.init(m.root);
    MicroCarousel.init(m.root);
    carousel.querySelector('[data-next]').click();
    record('carousel', 'a: init مرتين ثم «التالي» → micro-carousel:change مرة واحدة', ev.get() === 1 && MicroCarousel.getIndex(carousel) === 1, { events: ev.get(), index: MicroCarousel.getIndex(carousel) });
    const before = ev.get();
    MicroCarousel.update(carousel, 2);
    const afterGoTo = ev.get();
    const indexAfterGoTo = MicroCarousel.getIndex(carousel);
    carousel.querySelector('[data-prev]').click();
    record('carousel', 'b: update(carousel, index) يفوّض إلى goTo (حدث برمجي واحد) والفعل بعدها يطلق حدثًا واحدًا', afterGoTo === before + 1 && indexAfterGoTo === 2 && ev.get() === before + 2, { before, afterGoTo, after: ev.get(), indexAfterGoTo });
    MicroCarousel.destroy(m.root);
    carousel.querySelector('[data-next]').click();
    record('carousel', 'c: بعد destroy لا حدث change إطلاقًا ( getIndex بلا حالة)', ev.get() === before + 2 && MicroCarousel.getIndex(carousel) === -1, { after: ev.get(), index: MicroCarousel.getIndex(carousel) });
    ev.off();
    done(m);
  }

  /* المرحلة 7 — setLabels: نص بديل يظهر بعد إعادة التصيير، والاستعادة تعيد الأصل */
  const labelsOf = (fam) => (window.MicroLabels && window.MicroLabels.familyLabels(fam)) || {};
  const labelKeyOf = (fam, html) => Object.keys(labelsOf(fam))
    .find((k) => typeof labelsOf(fam)[k] === 'string' && html.includes(labelsOf(fam)[k]));
  {
    const m = mount('order-schedule');
    /* نطاق الكتلة السابقة لا يمتد هنا — تعريفان محليان للسيناريو */
    const ORDERS = [
      { id: 'od-01', title: 'طلب القهوة العربية', date: '2026-11-21', time: '14:30', statusKey: 'progress', customer: 'مطعم الواحة' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-11-22', time: '09:00', statusKey: 'done', customer: 'شركة النور' }
    ];
    const STATUSES = {
      progress: { label: 'قيد التنفيذ', tone: 'progress' },
      done: { label: 'تم التسليم', tone: 'success' }
    };
    const inst = MicroOrderSchedule.init(m.root, { orders: ORDERS, statuses: STATUSES, today: '2026-11-21', selectedDate: '2026-11-21', view: 'list' });
    MicroOrderSchedule.update(m.root, []);
    const key = labelKeyOf('order-schedule', m.root.innerHTML);
    const original = key && labelsOf('order-schedule')[key];
    MicroOrderSchedule.setLabels(key ? { [key]: 'نص بديل للفحص' } : {});
    MicroOrderSchedule.update(m.root, []);
    const changed = m.root.innerHTML.includes('نص بديل للفحص');
    MicroOrderSchedule.setLabels(key ? { [key]: original } : {});
    MicroOrderSchedule.update(m.root, []);
    const restored = m.root.innerHTML.includes(original) && !m.root.innerHTML.includes('نص بديل للفحص');
    inst.destroy();
    record('order-schedule', 'd: setLabels ثم update يُظهر النص البديل والاستعادة تعيد الأصل', !!key && changed && restored, { key: key || null, changed, restored });
  }
  {
    /* حتمي: رسم أعمدة بنطاق معلن غير صالح (data-max="oops") يعرض نص
       الرفض الافتراضي k9 داخل [data-plot] — بلا اعتماد على نصوص
       القالب التي قد لا تحوي مفتاحًا ظاهرًا في innerHTML */
    const m = mount('data');
    const chart = document.createElement('div');
    chart.className = 'm-chart';
    chart.setAttribute('data-chart', 'bars');
    chart.setAttribute('data-max', 'oops');
    chart.innerHTML = '<ul class="m-chart__data" hidden>'
      + '<li data-series="a" data-label="قراءة" data-value="5"></li></ul>'
      + '<div data-plot></div><p data-chart-summary></p>';
    m.root.appendChild(chart);
    MicroData.init(m.root);
    const original = labelsOf('data').k9;
    const shown = m.root.innerHTML.includes(original);
    MicroData.setLabels({ k9: 'نص بديل للفحص' });
    MicroData.update(m.root);
    const changed = m.root.innerHTML.includes('نص بديل للفحص') && !m.root.innerHTML.includes(original);
    MicroData.setLabels({ k9: original });
    MicroData.update(m.root);
    const restored = m.root.innerHTML.includes(original) && !m.root.innerHTML.includes('نص بديل للفحص');
    MicroData.disconnect(m.root);
    record('data', 'f: setLabels ثم update يعيد تصيير النص البديل والاستعادة تعيد الأصل', shown && changed && restored, { shown, changed, restored });
  }
  {
    const m1 = mount('carousel');
    MicroCarousel.init(m1.root);
    const key = labelKeyOf('carousel', m1.root.innerHTML);
    const original = key && labelsOf('carousel')[key];
    let changed = false;
    let restored = false;
    if (key) {
      MicroCarousel.setLabels({ [key]: 'نص بديل للفحص' });
      const m2 = mount('carousel');
      MicroCarousel.init(m2.root);
      changed = m2.root.innerHTML.includes('نص بديل للفحص');
      MicroCarousel.destroy(m2.root);
      MicroCarousel.setLabels({ [key]: original });
      const m3 = mount('carousel');
      MicroCarousel.init(m3.root);
      restored = m3.root.innerHTML.includes(original) && !m3.root.innerHTML.includes('نص بديل للفحص');
      MicroCarousel.destroy(m3.root);
    }
    MicroCarousel.destroy(m1.root);
    record('carousel', 'e: setLabels يسري على التصييرات اللاحقة (مثيل جديد) والاستعادة تعيد الأصل', !!key && changed && restored, { key: key || null, changed, restored });
  }
  return results;
}"""



ESM_SCRIPT = r"""async () => {
  const results = [];
  const record = (name, passed, detail) => results.push({
    family: 'esm-unified', name, passed: !!passed, detail: detail === undefined ? null : detail
  });
  const counts = () => ({
    listeners: window.__lcNet.listeners,
    observers: window.__lcNet.observers,
    timers: window.__lcNet.timers.size,
  });
  const frames = () => new Promise((r) => requestAnimationFrame(
    () => requestAnimationFrame(() => setTimeout(r, 40))));
  const clone = (id) => document.getElementById('tpl-' + id).content.firstElementChild.cloneNode(true);
  await document.fonts.ready;
  await frames(); await frames(); /* استقرار نشاط ما قبل السيناريو */

  const scope = { contextId: 'lc-owner', workspaceId: 'lc-ws', roleId: 'owner', kind: 'business', label: 'ورشة الفحص' };
  const manageModel = {
    type: 'manage', scope, dataContext: scope, phase: 'ready', connection: 'online',
    destination: 'manage', permissions: ['view', 'compose', 'add-operation', 'retry'], revision: 'lc-r1',
    unit: 'د.أ', requiredFields: ['amount', 'type', 'date'],
    summary: [{ label: 'المبيعات', value: '150' }], operations: [],
  };
  const asId = 'lc-as-' + Math.random().toString(36).slice(2, 7);
  const configs = {
    'buttons': { tpl: 'buttons', updateArg: { loading: true } },
    'fields': { tpl: 'fields' },
    'selection': { tpl: 'selection' },
    'picker': { tpl: 'picker', updateArg: [{ value: 'a', label: 'الخيار أ' }] },
    'organization': { tpl: 'organization' },
    'data': { tpl: 'data', width: 320 },
    'packed-circle': { tpl: 'packed-circle', width: 320 },
    'messages': { tpl: 'messages' },
    'navigation': { tpl: 'navigation' },
    'action-sheet': { root: () => {
      const d = document.createElement('div');
      d.className = 'm-layer m-action-sheet'; d.id = asId; d.hidden = true;
      d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
      d.innerHTML = '<div class="m-layer__head"><span class="m-layer__title">أفعال الفحص</span></div>' +
        '<div class="m-layer__body"><button type="button" data-action-id="a1">إجراء الفحص</button></div>';
      return d;
    } },
    'info-strip': { tpl: 'info-strip', width: 320 },
    'info-strip-peek': { tpl: 'info-peek', width: 320, updateArg: { index: 0, animate: false } },
    'metric-comparison': { tpl: 'metric-comparison', width: 320 },
    'account-settings': { tpl: 'account-settings' },
    'access-gateway': { tpl: 'access-gateway' },
    'carousel': { tpl: 'carousel', width: 320, updateArg: { index: 0, animate: false } },
    'order-schedule': { tpl: 'order-schedule', updateArg: [] },
    'readings': { root: () => {
      const d = document.createElement('div');
      const uid = 'lc-ru-' + Math.random().toString(36).slice(2, 7);
      d.innerHTML = '<p id="' + uid + '">إجمالي بالدينار الأردني</p><span data-reading-unit="د.أ">150 د.أ</span>';
      d.setAttribute('data-reading-context', uid); d.setAttribute('data-unit', 'د.أ');
      return d;
    } },
    'product': { root: () => document.createElement('section'), initArg: manageModel, updateArg: manageModel },
  };

  const apis = {};
  for (const entry of Object.keys(configs)) {
    try { apis[entry] = await import('/dist/esm/' + entry + '.js'); }
    catch (error) { record(entry + ': استيراد ESM ينجح', false, String(error)); }
  }

  for (const [entry, cfg] of Object.entries(configs)) {
    const api = apis[entry];
    if (!api) continue;
    const before = counts();
    const errorsBefore = window.__lcErrors.length;
    const holder = document.createElement('div');
    holder.style.width = cfg.width ? cfg.width + 'px' : '';
    const root = cfg.root ? cfg.root() : clone(cfg.tpl);
    holder.appendChild(root);
    document.body.appendChild(holder);
    let inst = null, sameInstance = false, updateOk = true, destroyTwiceOk = true;
    try {
      inst = api.init(root, cfg.initArg);
      sameInstance = api.init(root, cfg.initArg) === inst;
      if (!inst || inst.root !== root || typeof inst.update !== 'function' || typeof inst.destroy !== 'function') inst = null;
    } catch (error) { record(entry + ': init يعيد instance له update/destroy', false, String(error)); }
    record(entry + ': init يعيد instance له update/destroy', !!inst);
    record(entry + ': init مكرر يعيد المثيل نفسه بلا ربط مضاعف', sameInstance && !!inst);
    try { if (inst) inst.update(cfg.updateArg); } catch (error) { updateOk = false; record(entry + ': update بلا أخطاء', false, String(error)); }
    if (inst) record(entry + ': update بلا أخطاء', updateOk);
    try { if (inst) { inst.destroy(); inst.destroy(); } } catch (error) { destroyTwiceOk = false; record(entry + ': destroy مرتين لا يرمي', false, String(error)); }
    if (inst) record(entry + ': destroy مرتين لا يرمي', destroyTwiceOk);
    if (inst) {
      const after = counts();
      record(entry + ': صفر متبقيات بعد destroy (مستمعات/مراقبات/مؤقتات)',
        before.listeners === after.listeners && before.observers === after.observers && before.timers === after.timers,
        JSON.stringify({ before, after }));
    }
    let inst3 = null;
    try { inst3 = api.init(root, cfg.initArg); } catch (error) { record(entry + ': init من جديد بعد destroy', false, String(error)); }
    record(entry + ': init من جديد بعد destroy يعمل', !!inst3 && inst3 !== inst);
    holder.remove(); /* إزالة الجذر بلا destroy (قاعدة 3) */
    await frames();
    try { if (inst3) inst3.destroy(); } catch (error) { record(entry + ': destroy بعد إزالة الجذر لا يرمي', false, String(error)); }
    record(entry + ': إزالة الجذر بلا destroy — لا أخطاء لاحقة', window.__lcErrors.length === errorsBefore,
      window.__lcErrors.slice(errorsBefore));
  }

  /* R-D10: window.Micro* تعرض صادرات المدخل نفسها + الأسماء المهملة (IIFE فقط). */
  const iifeExpect = {
    MicroButtons: { fns: ['init', 'setLoading', 'destroy', 'getInstance'], aliases: ['disconnect'] },
    MicroFields: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['sync', 'update', 'disconnect'] },
    MicroSelection: { fns: ['init', 'setSwitchPending', 'destroy', 'getInstance', 'setLabels'], aliases: ['disconnect'] },
    MicroPicker: { fns: ['init', 'update', 'destroy', 'getInstance', 'setOptions', 'setStatus', 'clearSelection', 'getSelected', 'setLabels'], aliases: ['update', 'disconnect'] },
    MicroOrganization: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['disconnect'] },
    MicroData: { fns: ['init', 'getSelection', 'setSelection', 'destroy', 'getInstance', 'setLabels'], aliases: ['render', 'update', 'disconnect'] },
    MicroPacked: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['render', 'update', 'disconnect'] },
    MicroMessages: { fns: ['init', 'toast', 'closeToast', 'announce', 'resetAnnouncements', 'destroy', 'getInstance', 'setLabels'], aliases: ['disconnect'] },
    MicroNavigation: { fns: ['init', 'openLayer', 'requestClose', 'closeLayer', 'appliedFilters', 'setAppliedFilters', 'destroy', 'getInstance', 'setLabels'], aliases: ['disconnect'] },
    MicroActionSheet: { fns: ['init', 'open', 'close', 'destroy', 'getInstance', 'setLabels'], aliases: ['disconnect'] },
    MicroInfoStrip: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['rescan', 'update', 'disconnect'] },
    MicroInfoPeek: { fns: ['init', 'goTo', 'next', 'prev', 'getIndex', 'destroy', 'getInstance', 'setLabels'], aliases: ['update', 'disconnect'] },
    MicroMetricComparison: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['render', 'update', 'disconnect'] },
    MicroAccountSettings: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['disconnect'] },
    MicroAccessGateway: { fns: ['init', 'destroy', 'getInstance', 'setLabels'], aliases: ['update', 'disconnect'] },
    MicroCarousel: { fns: ['init', 'goTo', 'next', 'prev', 'getIndex', 'destroy', 'getInstance', 'setLabels'], aliases: ['update', 'disconnect'] },
    MicroOrderSchedule: { fns: ['init', 'update', 'getInstance', 'destroy', 'setLabels'], aliases: [] },
    MicroReadings: { fns: ['init', 'destroy', 'getInstance'], aliases: ['sync', 'update', 'disconnect'] },
    MicroProduct: { fns: ['register', 'mount', 'contextKey', 'init', 'destroy', 'getInstance', 'setLabels'], aliases: [] },
    MicroIcons: { fns: ['hydrate'], aliases: [] },
    MicroLabels: { fns: ['registerLabels', 'getLabel', 'familyLabels', 'setLabels', 'setLocale', 'getLocale', 'formatNumber', 'pluralCategory', 'plural'], aliases: [] },
  };
  const iifeProblems = [];
  for (const [global, expect] of Object.entries(iifeExpect)) {
    const api = window[global];
    if (!api) { iifeProblems.push(global + ' غير موجود'); continue; }
    for (const fn of expect.fns) if (typeof api[fn] !== 'function') iifeProblems.push(global + '.' + fn);
    for (const alias of expect.aliases) if (typeof api[alias] !== 'function') iifeProblems.push(global + '.' + alias + ' (alias)');
  }
  record('IIFE: window.Micro* تعرض دوال المدخل نفسها + مهملات R-D10', !iifeProblems.length, iifeProblems);
  record('IIFE: خاصيتا توافق locale وready', typeof window.MicroLabels.locale === 'string' && !!window.MicroIcons.ready);
  return results;
}"""

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, help="مجلد تقرير JSON (افتراضيًا مجلد مؤقت)")
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-api-lifecycle-"))
    out.mkdir(parents=True, exist_ok=True)

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    console_errors = []
    results = []
    version = ""
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            page = browser.new_page(viewport={"width": 360, "height": 780},
                                    color_scheme="light", locale="ar",
                                    reduced_motion="reduce")
            page.add_init_script(
                # تتبع مراقبي ResizeObserver (نفس نمط clone-lifecycle)، وشبكة
                # أمان تمنع الإرسال الأصلي بعد destroy من الانتقال بالصفحة
                # (المكوّن نفسه يمنع الافتراضي ما دام مربوطًا).
                "window.auditROs=new Set();const RO=window.ResizeObserver;"
                "window.ResizeObserver=class extends RO{"
                "observe(t,o){auditROs.add(this);return super.observe(t,o)}"
                "disconnect(){auditROs.delete(this);return super.disconnect()}};"
                "document.addEventListener('submit',function(e){e.preventDefault()},true);")

            page.add_init_script(
                # R4 (الجولة الثانية): عدّاد صافٍ للمستمعات والمراقبات والمؤقتات
                # لسيناريو العقد الموحد — يُلتقط قبل/بعد كل دورة.
                "window.__lcErrors=[];"
                "addEventListener('error',e=>window.__lcErrors.push(e.message||'error'));"
                "addEventListener('unhandledrejection',e=>window.__lcErrors.push('rejection: '+String(e.reason)));"
                "window.__lcNet={listeners:0,observers:0,timers:new Set()};"
                "(function(){"
                "const oa=EventTarget.prototype.addEventListener,or=EventTarget.prototype.removeEventListener;"
                "EventTarget.prototype.addEventListener=function(t,f,o){window.__lcNet.listeners++;return oa.call(this,t,f,o)};"
                "EventTarget.prototype.removeEventListener=function(t,f,o){window.__lcNet.listeners--;return or.call(this,t,f,o)};"
                "for(const n of['ResizeObserver','MutationObserver','IntersectionObserver']){const O=window[n];if(!O)continue;"
                "window[n]=class extends O{constructor(c){super(c);window.__lcNet.observers++}"
                "disconnect(){window.__lcNet.observers--;return super.disconnect()}}}"
                "const wt=(k,sch,can)=>{const w=function(f,...a){let key;const id=sch.call(window,function(...x){window.__lcNet.timers.delete(key);return f.apply(this,x)},...a);"
                "key=k+':'+id;window.__lcNet.timers.add(key);return id};"
                "const wc=function(id,...a){window.__lcNet.timers.delete(k+':'+id);return can.call(window,id,...a)};return[w,wc]};"
                "const[t1,c1]=wt('t',setTimeout,clearTimeout),[t2,c2]=wt('i',setInterval,clearInterval),[t3,c3]=wt('r',requestAnimationFrame,cancelAnimationFrame);"
                "window.setTimeout=t1;window.clearTimeout=c1;window.setInterval=t2;window.clearInterval=c2;"
                "window.requestAnimationFrame=t3;window.cancelAnimationFrame=c3;})();")
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
            page.goto(f"http://127.0.0.1:{server.server_port}/api-lifecycle.html")
            page.wait_for_load_state("networkidle")
            page.evaluate("document.fonts ? document.fonts.ready : Promise.resolve()")
            results = page.evaluate(SCRIPT)
            page.wait_for_timeout(120)
            # R4 (الجولة الثانية): سيناريو العقد الموحد عبر ESM — نفس الصفحة
            # (القوالب والغلوبالات جاهزة فيها) مع عدّادات التغليف أعلاه.
            esm_results = page.evaluate(ESM_SCRIPT)
            results.extend(esm_results)
            version = browser.version
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    results.append({
        "family": "runtime", "name": "لا أخطاء صفحة (pageerror) خلال الدورة كاملة",
        "passed": not errors, "detail": errors,
    })
    results.append({
        "family": "runtime", "name": "لا أخطاء كونسول خلال الدورة كاملة",
        "passed": not console_errors, "detail": console_errors,
    })
    for row in results:
        print(("PASS " if row["passed"] else "FAIL ") + row["family"] + " | " + row["name"])
    passed = sum(1 for r in results if r["passed"])
    report = {
        "browser": version,
        "passed": passed,
        "failed": len(results) - passed,
        "checks": results,
        "scope": "unified lifecycle contract (R4: init/instance.update/destroy + zero leftovers + IIFE aliases), 360x780 RTL Light reduced-motion; "
                 "update N/A verified as documented absence for Buttons/Selection/Organization/Messages/"
                 "Navigation/Account Settings; Surfaces is CSS-only (no JS)",
    }
    (out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{passed} PASS / {len(results) - passed} FAIL")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
