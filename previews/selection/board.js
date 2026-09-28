/* محاكاة لوحة الاختيار B03 — كلها خارج المكوّن */
(function () {
  'use strict';

  /* نص حالة المفتاح يتبع القيمة (عرض فقط) */
  function bindSwitchStates(root) {
    root.querySelectorAll('[data-switch]').forEach(function (sw) {
      if (sw.dataset.switchBound) return;
      sw.dataset.switchBound = '1';
      var input = sw.querySelector('input');
      var state = sw.querySelector('[data-switch-state]');
      function sync() { if (state) state.textContent = input.checked ? 'مُفعّل' : 'مُعطّل'; }
      input.addEventListener('change', sync);
      sync();
    });
  }
  bindSwitchStates(document);

  /* إعداد غير متزامن محاكى: انتظار ثم فشل/نجاح — العقد: المستهلك
     يضبط MicroSelection.setSwitchPending ويرجع القيمة عند الفشل */
  var asyncSw = document.getElementById('async-switch');
  var asyncStatus = document.querySelector('[data-async-status]');
  document.querySelectorAll('[data-async-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!asyncSw) return;
      var mode = btn.getAttribute('data-async-demo');
      var input = asyncSw.querySelector('input');
      var before = input.checked;
      MicroSelection.setSwitchPending(asyncSw, true);
      if (asyncStatus) { asyncStatus.hidden = true; asyncStatus.textContent = 'جارٍ تحديث الإعداد… (محاكاة)'; asyncStatus.setAttribute('data-tone', 'info'); asyncStatus.hidden = false; }
      window.setTimeout(function () {
        MicroSelection.setSwitchPending(asyncSw, false);
        if (mode === 'fail') {
          input.checked = before; /* العقد: الفشل يرجع القيمة السابقة */
          input.dispatchEvent(new Event('change', { bubbles: true }));
          if (asyncStatus) { asyncStatus.setAttribute('data-tone', 'error'); asyncStatus.textContent = 'فشل التحديث — أُعيدت القيمة السابقة (محاكاة)'; }
        } else {
          if (asyncStatus) { asyncStatus.setAttribute('data-tone', 'success'); asyncStatus.textContent = 'تم حفظ الإعداد (محاكاة)'; }
        }
      }, 1000);
    });
  });

  /* قائمة الاختيار: مسح الاختيار + ملخص */
  var clearBtn = document.querySelector('[data-clear-list]');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    document.querySelectorAll('[data-choice-group] [data-choice-item]').forEach(function (b) {
      if (b.closest('.picker-sheet')) b.checked = false;
    });
    document.dispatchEvent(new Event('micro-selection:changed', { bubbles: true }));
  });

  /* منتقي الكيان: بحث محاكى + حالات قراءة + اختيار ومسح */
  var list = document.getElementById('picker-list');
  var search = document.getElementById('picker-search');
  var status = document.querySelector('[data-picker-status]');
  var summary = document.querySelector('[data-picker-summary]');
  var options = list ? [].slice.call(list.querySelectorAll('.picker-option')) : [];

  function showStatus(text, tone) {
    if (!status) return;
    status.hidden = false;
    status.setAttribute('data-tone', tone);
    status.textContent = text;
  }
  document.querySelectorAll('[data-picker-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-picker-demo');
      list.innerHTML = '<div class="picker-option is-loading-row">جارٍ القراءة… (محاكاة)</div>';
      showStatus('انتظار…', 'info');
      window.setTimeout(function () {
        if (mode === 'empty') {
          list.innerHTML = '<div class="picker-option is-loading-row">لا نتائج مطابقة — جرّب اسمًا آخر</div>';
          showStatus('لا نتائج', 'info');
        } else if (mode === 'fail') {
          list.innerHTML = '<div class="picker-option is-loading-row">تعذر القراءة</div>';
          showStatus('فشل قراءة — أعد المحاولة (أزرار المحاكاة تعيد التحميل)', 'error');
        } else {
          restoreOptions();
          showStatus('تمت القراءة (محاكاة)', 'success');
        }
      }, 900);
    });
  });
  function restoreOptions() {
    list.innerHTML = '';
    options.forEach(function (o) { list.appendChild(o); });
  }
  if (search) search.addEventListener('input', function () {
    var q = search.value.trim();
    if (!q) { options.forEach(function (o) { o.hidden = false; }); return; }
    options.forEach(function (o) { o.hidden = o.textContent.indexOf(q) === -1; });
    var visible = options.filter(function (o) { return !o.hidden; });
    if (!visible.length && list.querySelector('.picker-option')) {
      /* لا نتائج محاكاة بحسب نص البحث */
      list.querySelectorAll('.picker-option').forEach(function (o) { if (o.hidden) o.style.display = 'none'; });
    }
  });
  list && list.addEventListener('click', function (e) {
    var opt = e.target.closest('.picker-option[data-value]');
    if (!opt) return;
    options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
    opt.setAttribute('aria-selected', 'true');
    if (summary) summary.textContent = 'المحدد: ' + opt.textContent.trim();
  });
})();
