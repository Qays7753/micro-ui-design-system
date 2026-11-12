/* Independent synthetic consumer, NOT a production adapter or library API. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const controllers = new WeakMap();
  const counts = { input: {}, submit: {}, callback: {}, row: {}, history: 0 };
  const jobs = [];
  const slots = {};
  let serial = 0;
  const valueMarkup = `<article class="m-info-card m-info-card--compact m-info-card--context"><span class="m-info-card__label">قراءة مستقلة من المصدر</span><p class="m-info-card__context">فترة عينة معلنة · ليست بيانات منتج</p><span class="m-info-card__reading"><bdi class="m-info-card__number" dir="ltr" data-number>−123,456.750</bdi><span class="m-info-card__unit">د.أ</span></span><p class="m-info-card__note">قيمة كاملة بوحدتها، دون حساب داخل المكوّن.</p></article>`;
  function markup(prefix) {
    return `<div class="fixture-panel">${valueMarkup}<ul class="m-operational-list"><li class="m-row m-row--operational"><div class="m-row__text"><strong class="m-row__title">مادة ذات اسم طويل يستلزم سطر قراءة مستقلًا</strong><div class="m-row__reading"><bdi class="m-row__value" dir="ltr" data-quantity>123,456,789.125</bdi><span>كغ</span></div></div><div class="m-row__meta"><span class="m-badge m-badge--info">قراءة أولية</span></div><div class="m-row__action"><button class="m-btn m-btn--secondary" type="button" data-row-action>مصدر القراءة</button></div><p class="m-row__text" data-source-note role="status" hidden>القراءة من بيانات الحاضنة الاصطناعية، وليست مصدرًا إنتاجيًا.</p></li><li class="m-row m-row--operational"><details class="m-row__details"><summary class="m-row__primary" aria-controls="${prefix}-details"><span class="m-row__text"><span class="m-row__title">تفاصيل العينة</span></span><img class="m-section__chevron" src="../../assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary><div class="m-row__disclosure" id="${prefix}-details"><p>الإفصاح أصلي. الإجراء ليس نقرًا على الصف كله.</p></div></details></li></ul><form class="m-form-surface" novalidate aria-labelledby="${prefix}-title"><header class="m-form-surface__head"><h2 class="m-form-surface__title" id="${prefix}-title">مرجع اختباري</h2><p class="m-form-surface__description">raw والصحة والقيمة المسبقة وتعديل المستخدم حالات منفصلة.</p></header><div class="m-form-surface__body"><div class="m-field" data-micro-field><label class="m-field__label" for="${prefix}-code">المرجع</label><div class="m-field__control"><input class="m-field__input" id="${prefix}-code" name="code" type="search" value="CODE-001" required pattern="[A-Z0-9\\-]{3,20}" aria-describedby="${prefix}-help" autocomplete="off"><button class="m-btn m-btn--icon m-btn--secondary m-field__clear" type="button" aria-label="مسح المرجع"><img class="m-btn__icon" src="../../assets/icons/cancel01.svg" width="24" height="24" alt=""></button></div><p class="m-field__msg is-visible" id="${prefix}-help">3–20 حرفًا لاتينيًا كبيرًا أو رقمًا أو شرطة.</p></div><p class="m-form-surface__feedback" role="status" data-feedback>قيمة مسبقة؛ لم يحررها المستخدم.</p></div><footer class="m-form-surface__actions"><button class="m-btn m-btn--primary" type="submit">إرسال للعينة</button><button class="m-btn m-btn--secondary" type="button" data-refill>استعادة الأصل</button></footer></form></div>`;
  }
  function bind(form, callback, key) {
    const existing = controllers.get(form);
    if (existing) { existing.setCallback(callback); return existing; }
    MicroFields.init(form);
    const input = $('input', form), feedback = $('[data-feedback]', form), button = $('[type=submit]', form);
    const lifetime = new AbortController();
    const state = { baseline: input.value, pending: false, disposed: false, callback, version: 0 };
    const listen = (type, fn) => form.addEventListener(type, fn, { signal: lifetime.signal });
    const recipe = form.closest('.fixture-panel');
    recipe.addEventListener('click', e => { if (e.target.closest('[data-row-action]')) { counts.row[key] = (counts.row[key] || 0) + 1; $('[data-source-note]', recipe).hidden = false; } }, { signal: lifetime.signal });
    const c = {
      setCallback(callback) { state.callback = callback; },
      state: () => ({ raw: input.value, valid: input.validity.valid, dirty: input.value !== state.baseline, pending: state.pending, disposed: state.disposed }),
      prefill(raw) { input.value = raw; state.baseline = raw; state.version++; MicroFields.sync(form); feedback.textContent = 'قيمة مسبقة؛ لم يحررها المستخدم.'; },
      destroy() { state.disposed = true; lifetime.abort(); MicroButtons.disconnect(form); MicroFields.disconnect(form); controllers.delete(form); }
    };
    listen('input', () => { counts.input[key] = (counts.input[key] || 0) + 1; state.version++; });
    listen('click', e => { if (e.target.closest('[data-refill]')) c.prefill('CODE-001'); });
    listen('submit', async e => {
      e.preventDefault();
      if (state.pending) return;
      counts.submit[key] = (counts.submit[key] || 0) + 1;
      if (!input.validity.valid) { feedback.textContent = 'قيمة غير صالحة؛ النص محفوظ دون تحويل.'; input.focus(); return; }
      const raw = input.value, version = state.version;
      state.pending = true; MicroButtons.setLoading(button, true); feedback.textContent = 'بانتظار نتيجة العينة.';
      try {
        const result = await state.callback(raw);
        if (state.disposed) return;
        feedback.textContent = version !== state.version ? 'النتيجة تخص نصًا أقدم؛ النص الحالي محفوظ.' : result === true ? 'نتيجة العينة معلنة.' : 'لا توجد نتيجة اعتماد صريحة.';
      } catch (_) { if (!state.disposed) feedback.textContent = 'تعذر إكمال العينة؛ النص محفوظ.'; }
      finally { if (!state.disposed) { state.pending = false; MicroButtons.setLoading(button, false); } }
    });
    controllers.set(form, c);
    return c;
  }
  function mount(key) {
    const host = $('#instance-' + key), prefix = key + '-' + (++serial);
    host.innerHTML = markup(prefix);
    const callback = raw => { counts.callback[key] = (counts.callback[key] || 0) + 1; return new Promise(resolve => jobs.push({ key, raw, resolve })); };
    slots[key] = { host, form: $('form', host), callback };
    slots[key].controller = bind(slots[key].form, callback, key);
  }
  if (document.body.dataset.fixture === 'containers') {
    $('#container-host').innerHTML = markup('container');
    const form = $('form'); form.setAttribute('aria-labelledby', 'container-title');
    bind(form, () => Promise.resolve(undefined), 'container');
    $('#direction').onclick = () => { document.documentElement.dir = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl'; };
    $('#reset-bad').onclick = () => {
      if (!$('#conflict')) { const s = document.createElement('style'); s.id = 'conflict'; s.textContent = 'button { min-height:20px; height:20px; padding:0; box-sizing:content-box; font-family:serif; }'; document.head.append(s); }
      $('#css-status').textContent = 'حالة سلبية مقصودة: reset غير محصور يتقدم على CSS المكوّن.';
    };
    $('#reset-good').onclick = () => { if ($('#conflict')) $('#conflict').textContent = '.fixture-native-controls button { min-height:20px; height:20px; padding:0; }'; $('#css-status').textContent = 'نطاق reset مصحح؛ المصدر لم يتغير.'; };
  }
  if (document.body.dataset.fixture === 'lifecycle') {
    mount('a'); mount('b');
    $('#prefill').onclick = () => slots.a.controller.prefill('READY-009');
    $('#update').onclick = () => { $('[data-number]', slots.a.host).textContent = '0'; $('[data-quantity]', slots.a.host).textContent = '−17.250'; };
    $('#replace').onclick = () => {
      const callback = raw => { counts.callback.replaced = (counts.callback.replaced || 0) + 1; return new Promise(resolve => jobs.push({ key: 'a', raw, resolve })); };
      slots.a.controller = bind(slots.a.form, callback, 'a');
    };
    $('#unmount').onclick = () => { slots.a.controller.destroy(); slots.a.host.replaceChildren(); };
    $('#remount').onclick = () => { if (!slots.a.host.firstElementChild) mount('a'); };
    $('#resolve').onclick = () => { const job = jobs.shift(); if (job) job.resolve(true); };
  }
  if (document.body.dataset.fixture === 'layers') {
    $('#layer-value').innerHTML = valueMarkup;
    document.body.insertAdjacentHTML('beforeend', '<div class="m-layer-backdrop" id="shade-inner" data-for="inner" hidden></div><div class="m-layer" id="inner" role="dialog" aria-label="طبقة ثانية" hidden><div class="m-layer__head"><h2 class="m-layer__title">طبقة ثانية</h2><button class="m-btn m-btn--secondary" data-close-layer="inner">إغلاق</button></div><div class="m-layer__body"><p>المحرك نفسه؛ يرجع التركيز إلى الطبقة الأولى.</p></div></div><dialog class="m-form-dialog" id="native" aria-label="قرار إغلاق العينة"><form class="m-form-surface" method="dialog"><div class="m-form-surface__body"><div class="m-field" data-micro-field><label class="m-field__label" for="native-raw">نص العينة</label><div class="m-field__control"><input id="native-raw" class="m-field__input" type="text" value=""></div></div><p role="status" id="native-status">لا تغييرات.</p></div><footer class="m-form-surface__actions"><button class="m-btn m-btn--secondary" type="button" id="native-close">إغلاق</button><button class="m-btn m-btn--secondary" type="button" id="native-discard" hidden>إغلاق دون اعتماد</button></footer></form></dialog>');
    MicroNavigation.init(document);
    const outer = $('#outer'), shade = $('#shade-outer'), native = $('#native');
    MicroFields.init(native);
    let nativeOverflow, nativeTrigger;
    function openNative() {
      if (!outer.hidden || !$('#inner').hidden) { $('#layer-status').textContent = 'رُفض محرك ثانٍ حتى تغلق طبقات Navigation.'; return false; }
      nativeOverflow = document.documentElement.style.overflow; nativeTrigger = document.activeElement;
      document.documentElement.style.overflow = 'hidden'; native.showModal(); return true;
    }
    function closeNative() {
      if ($('#native-raw').value) { $('#native-status').textContent = 'نص تغير؛ أكد الإغلاق أو أكمل التحرير.'; $('#native-discard').hidden = false; return; }
      native.close();
    }
    native.addEventListener('cancel', e => { e.preventDefault(); closeNative(); });
    native.addEventListener('close', () => { document.documentElement.style.overflow = nativeOverflow; if (nativeTrigger && nativeTrigger.isConnected) nativeTrigger.focus(); });
    $('#native-open').onclick = openNative; $('#try-native').onclick = openNative;
    $('#native-close').onclick = closeNative; $('#native-discard').onclick = () => native.close();
    $('#bad-layer').onclick = e => MicroNavigation.openLayer(outer, { backdropEl: shade, trigger: e.currentTarget });
    $('#portal-layer').onclick = e => { document.body.append(shade, outer); MicroNavigation.openLayer(outer, { backdropEl: shade, trigger: e.currentTarget }); };
    $('#nested-open').onclick = e => MicroNavigation.openLayer($('#inner'), { backdropEl: $('#shade-inner'), trigger: e.currentTarget });
    $('#append-background').onclick = () => { const x = document.createElement('aside'); x.className = 'fixture-late'; x.innerHTML = '<button class="fixture-action" data-late>خلفية أضيفت أثناء الفتح</button>'; document.body.append(x); };
    $('#dispose-layer').onclick = () => { MicroNavigation.disconnect(outer); shade.remove(); outer.remove(); $('#portal-layer').focus(); };
  }
  window.BoundaryFixture = { counts, jobs, state: key => slots[key].controller.state(), bindAgain: key => { const s = slots[key]; s.controller = bind(s.form, s.callback, key); }, detach: key => { slots[key].controller.destroy(); }, slots };
})();
