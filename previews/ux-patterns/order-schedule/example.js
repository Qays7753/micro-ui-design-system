/* =========================================================
   Micro UI — سلوك عينة جدول الطلبات المستقلة
   الملف: previews/ux-patterns/order-schedule/example.js
   الحالة: DRAFT FOR REVIEW — سلوك مستهلك للعينة فقط.

   الرحلة المتصلة (المصدر الواحد: OrderDemoStore — بلا reload):
   إضافة طلب بموعد → يظهر في الجدول (خليته ولوحة يومه) → فتحه من
   الصف → تعديل موعده → ينتقل لليوم الجديد — كل ذلك عبر حدث
   order-store:changed الذي يعيد تصيير المكوّن بsetData الصامتة
   (عقد المواصفة: العمليات البرمجية صامتة، الأفعال فقط تطلق
   الأحداث). سجل أحداث نصي صغير أسفل الصفحة (هذه العينة فقط).
   ========================================================= */

(function () {
  'use strict';

  function q(id) { return document.getElementById(id); }

  var el = {
    root: q('ocal-demo'),
    title: q('ocal-demo-title'),
    addBtn: q('ocal-demo-add'),
    logList: q('ocal-log-list'),
    /* تفاصيل الطلب */
    layer: q('ocal-order-layer'),
    orderTitle: q('ocal-order-title'),
    orderCustomer: q('ocal-rd-customer'),
    orderDate: q('ocal-rd-date'),
    orderTimeRow: q('ocal-rd-time-row'),
    orderTime: q('ocal-rd-time'),
    orderStatusChip: q('ocal-order-status'),
    orderStatusText: q('ocal-order-status-text'),
    orderEdit: q('ocal-order-edit'),
    /* نموذج الطلب */
    formLayer: q('ocal-order-form-layer'),
    formTitle: q('ocal-order-form-title'),
    form: q('ocal-order-form'),
    nameField: q('ocal-order-name-field'),
    name: q('ocal-order-name'),
    nameMsg: q('ocal-order-name-msg'),
    customer: q('ocal-order-customer'),
    customerMsg: q('ocal-order-customer-msg'),
    dateField: q('ocal-order-date-field'),
    date: q('ocal-order-date'),
    dateMsg: q('ocal-order-date-msg'),
    timeField: q('ocal-order-time-field'),
    time: q('ocal-order-time'),
    timeMsg: q('ocal-order-time-msg'),
    statusSeg: q('ocal-order-status-seg'),
    /* toast النجاح */
    toast: q('ocal-toast'),
    toastText: q('ocal-toast-text')
  };

  var store = window.OrderDemoStore;
  var state = {
    detailId: null,
    formMode: 'add',
    formId: null,
    draftStatus: 'progress',
    savedFocus: null,
    openLayers: 0
  };

  /* ---------- سجل الأحداث (هذه العينة فقط) ---------- */
  function log(text) {
    if (!el.logList) return;
    var li = document.createElement('li');
    li.textContent = text;
    el.logList.insertBefore(li, el.logList.firstChild);
    while (el.logList.childNodes.length > 30) el.logList.removeChild(el.logList.lastChild);
  }

  /* ---------- تهيئة المكوّن من المصدر الواحد ---------- */
  var inst = window.MicroOrderSchedule.init(el.root, {
    orders: store.all(),
    statuses: store.statuses(),
    today: store.today(),   /* مثبت 2026-10-07 في الموصل لحتمية الفحص */
    weekStart: 6            /* السبت — اختيار سياق عربي للعينة */
  });
  log('تهيئة الجدول من الموصل: ' + store.count() + ' طلبًا (اليوم المثبت ' + store.today() + ').');

  /* أي كتابة في الموصل تنعكس فورًا على المكوّن — بلا reload */
  document.addEventListener('order-store:changed', function (e) {
    var d = e.detail || {};
    inst.setData(store.all());
    var saved = d.id ? store.get(d.id) : null;
    if (saved && saved.date) inst.setSelectedDate(saved.date); /* صامتة */
    log((d.isNew ? 'أُضيف طلب' : 'حُفظ تعديل طلب') + ': ' + saved.title +
      (saved.date ? ' — موعده ' + saved.date : ' — غير مجدول') + '.');
  });

  /* ---------- التاريخ الكامل بالعربية (محلي مدني — بلا UTC) ---------- */
  var AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var AR_WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  function fullDateAr(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return '';
    var y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    return AR_WEEKDAYS[new Date(y, mo - 1, d).getDay()] + ' ' + d + ' ' + AR_MONTHS[mo - 1] + ' ' + y;
  }

  function fieldError(field, input, msgEl, show, text) {
    field.classList.toggle('has-error', !!show);
    if (show) {
      input.setAttribute('aria-invalid', 'true');
      msgEl.textContent = text;
      msgEl.hidden = false;
      msgEl.classList.add('is-visible');
    } else {
      input.removeAttribute('aria-invalid');
      msgEl.hidden = true;
      msgEl.classList.remove('is-visible');
      msgEl.textContent = '';
    }
  }

  function rowTrigger(id) {
    return el.root.querySelector('.m-ocal__row[data-ocal-id="' + id + '"]');
  }

  /* ---------- أحداث المكوّن (على الجذر — bubbles) ---------- */
  el.root.addEventListener('order-schedule:day-select', function (e) {
    log('اختيار يوم ' + fullDateAr(e.detail && e.detail.date) + '.');
  });

  el.root.addEventListener('order-schedule:order-open', function (e) {
    var id = e.detail && e.detail.id;
    var order = store.get(id);
    if (!order) return;
    state.detailId = id;
    /* كل القيم textContent — لا HTML من البيانات */
    el.orderTitle.textContent = order.title;
    el.orderCustomer.textContent = order.customer || '—';
    el.orderDate.textContent = order.date ? fullDateAr(order.date) : 'غير مجدول';
    el.orderTimeRow.hidden = !order.time;
    el.orderTime.textContent = order.time || '';
    var st = store.statuses()[order.statusKey];
    el.orderStatusText.textContent = st ? st.label : String(order.statusKey || '');
    el.orderStatusChip.className = 'ocal-chip ocal-chip--' + ((st && st.tone) || 'neutral');
    window.MicroNavigation.openLayer(el.layer, { trigger: rowTrigger(id) });
    log('فتح طلب: ' + order.title + '.');
  });

  /* زر الرأس: إضافة بلا تاريخ مسبق (اختيار موثق في README — عقد
     add-request من المكوّن يمرر اليوم المحدد، وزر الرأس قرار
     المستهلك هنا: بلا تاريخ) */
  el.addBtn.addEventListener('click', function () {
    openForm({ mode: 'add', date: null, trigger: el.addBtn });
  });

  el.root.addEventListener('order-schedule:add-request', function (e) {
    var date = (e.detail && e.detail.date) || null;
    openForm({ mode: 'add', date: date, trigger: el.root.querySelector('[data-ocal-action="add"]') || el.addBtn });
  });

  el.orderEdit.addEventListener('click', function () {
    var order = state.detailId ? store.get(state.detailId) : null;
    if (!order) return;
    openForm({ mode: 'edit', id: order.id, trigger: el.orderEdit });
  });

  /* ---------- النموذج ---------- */
  function setDraftStatus(key) {
    state.draftStatus = key;
    [].slice.call(el.statusSeg.querySelectorAll('.ocal-seg__item')).forEach(function (b) {
      var on = b.getAttribute('data-value') === key;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  el.statusSeg.addEventListener('click', function (e) {
    var btn = e.target.closest('.ocal-seg__item');
    if (!btn || !el.statusSeg.contains(btn)) return;
    var v = btn.getAttribute('data-value');
    if (v && store.statuses()[v]) setDraftStatus(v);
  });

  function openForm(opts) {
    var mode = opts.mode === 'edit' ? 'edit' : 'add';
    var order = mode === 'edit' ? store.get(opts.id) : null;
    if (mode === 'edit' && !order) return;
    state.formMode = mode;
    state.formId = order ? order.id : null;
    el.formTitle.textContent = mode === 'add' ? 'إضافة طلب' : 'تعديل الطلب';
    el.name.value = order ? order.title : '';
    el.customer.value = order ? (order.customer || '') : '';
    el.date.value = order ? (order.date || '') : (opts.date || '');
    el.time.value = order ? (order.time || '') : '';
    setDraftStatus(order ? order.statusKey : 'progress');
    fieldError(el.nameField, el.name, el.nameMsg, false);
    fieldError(el.dateField, el.date, el.dateMsg, false);
    fieldError(el.timeField, el.time, el.timeMsg, false);
    if (window.MicroFields) window.MicroFields.sync(el.form);
    window.MicroNavigation.openLayer(el.formLayer, { trigger: opts.trigger });
  }

  el.name.addEventListener('input', function () {
    if (el.nameField.classList.contains('has-error') && String(el.name.value).trim() !== '') {
      fieldError(el.nameField, el.name, el.nameMsg, false);
    }
  });

  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    saveForm();
  });

  function saveForm() {
    /* التحقق: الاسم مطلوب؛ التاريخ الفارغ = غير مجدول؛ الوقت الفارغ
       مقبول. منتقي التاريخ/الوقت أصلي فالقيم غير الصالحة نادرة —
       تظهر خطأ صريحًا لا قسرًا صامتًا */
    var name = String(el.name.value || '');
    if (!name.trim()) {
      fieldError(el.nameField, el.name, el.nameMsg, true, 'الاسم مطلوب.');
      el.name.focus();
      return;
    }
    var dateRaw = el.date.value;
    if (dateRaw !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
      fieldError(el.dateField, el.date, el.dateMsg, true, 'أدخل تاريخًا صالحًا أو اتركه فارغًا.');
      el.date.focus();
      return;
    }
    var timeRaw = el.time.value;
    if (timeRaw !== '' && !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(timeRaw)) {
      fieldError(el.timeField, el.time, el.timeMsg, true, 'أدخل وقتًا صالحًا أو اتركه فارغًا.');
      el.time.focus();
      return;
    }
    var customer = String(el.customer.value || '').trim();
    var id = (state.formMode === 'edit' && state.formId) ? state.formId : store.nextId();
    var saved = store.upsert({
      id: id,
      title: name.trim(),
      date: dateRaw === '' ? null : dateRaw,
      time: timeRaw === '' ? null : timeRaw.slice(0, 5),
      statusKey: state.draftStatus,
      customer: customer === '' ? null : customer
    });
    if (!saved) return; /* لم يُكتب شيء — لا نجاح كاذب */
    state.savedFocus = saved.id;
    window.MicroNavigation.closeLayer(el.formLayer);
    if (!el.layer.hidden) window.MicroNavigation.closeLayer(el.layer);
    el.toastText.textContent = state.formMode === 'edit' ? 'تم حفظ تعديل الطلب.' : 'تمت إضافة الطلب.';
    if (window.MicroMessages) window.MicroMessages.toast(el.toast, { duration: 4000 });
  }

  /* عدّ الطبقات + هبوط التركيز على صف الطلب المحفوظ بعد الإغلاق
     (عقد closeLayer يستعيد مشغّله، وإعادة التصيير أزالت الصف القديم) */
  [el.layer, el.formLayer].forEach(function (layer) {
    layer.addEventListener('micro-navigation:opened', function () {
      state.openLayers += 1;
    });
    layer.addEventListener('micro-navigation:closed', function (e) {
      if (e.target !== layer) return;
      state.openLayers = Math.max(0, state.openLayers - 1);
      if (!state.savedFocus || state.openLayers !== 0) return;
      var id = state.savedFocus;
      state.savedFocus = null;
      var row = el.root.querySelector('.m-ocal__row[data-ocal-id="' + id + '"]');
      if (row && typeof row.focus === 'function') row.focus();
      else el.title.focus({ preventScroll: true });
    });
  });

  /* واجهة الفحص الآلي (قراءة فقط) */
  window.__OCAL_SAMPLE = {
    inst: inst,
    store: store,
    state: state
  };
})();
