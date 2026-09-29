/* محاكاة لوحة الاختيار B03 — كلها خارج المكوّن: بيانات + انتظار/فشل فقط.
   المنتقي نفسه عقد عام في components/selection/picker.js */
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

  /* قائمة الاختيار: مسح الاختيار (المفعّلة فقط — المعطل لا يُلمس) */
  var clearBtn = document.querySelector('[data-clear-list]');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    document.querySelectorAll('[data-choice-group] [data-choice-item]').forEach(function (b) {
      if (b.closest('.demo-card') && !b.disabled) b.checked = false;
    });
    document.dispatchEvent(new Event('micro-selection:changed', { bubbles: true }));
  });

  /* ======== منتقي الكيان في طبقة B07: بيانات ومحاكاة فقط ======== */
  var DATA = [
    { value: 'petrol', label: 'شركة البترول الوطنية' },
    { value: 'noor', label: 'مؤسسة النور للتوريدات' },
    { value: 'fawry', label: 'مأمورية فوري — فرع وسط المدينة' },
    { value: 'watania', label: 'الشركة الوطنية للإمداد' }
  ];
  var picker = document.getElementById('entity-picker');
  var status = document.querySelector('[data-picker-status]');

  function showStatus(text, tone) {
    if (!status) return;
    status.hidden = false;
    status.setAttribute('data-tone', tone);
    status.textContent = text;
  }

  /* فشل القراءة: زر «إعادة المحاولة» من المكوّن يطلق micro-picker:retry */
  if (picker) {
    picker.addEventListener('micro-picker:retry', function () { simulate('loading'); });
    picker.addEventListener('micro-picker:change', function (e) {
      showStatus(e.detail && e.detail.label ? 'تم الاختيار (محاكاة)' : 'أُمسح الاختيار', e.detail && e.detail.label ? 'success' : 'info');
    });
    var clearSel = picker.querySelector('[data-picker-clear]');
    if (clearSel) clearSel.addEventListener('click', function () { MicroPicker.clearSelection(picker); });
  }

  function simulate(mode) {
    if (!picker) return;
    MicroPicker.setStatus(picker, 'loading', 'جارٍ القراءة… (محاكاة)');
    showStatus('انتظار…', 'info');
    window.setTimeout(function () {
      if (mode === 'empty') {
        MicroPicker.setOptions(picker, []);
        MicroPicker.setStatus(picker, 'empty', 'لا نتائج مطابقة — جرّب اسمًا آخر (محاكاة)');
        showStatus('لا نتائج', 'info');
      } else if (mode === 'fail') {
        MicroPicker.setStatus(picker, 'error', 'تعذر القراءة (محاكاة) — زر إعادة المحاولة من المكوّن');
        showStatus('فشل قراءة — أعد المحاولة', 'error');
      } else {
        MicroPicker.setOptions(picker, DATA);
        MicroPicker.setStatus(picker, 'ready');
        showStatus('تمت القراءة (محاكاة)', 'success');
      }
    }, 900);
  }
  document.querySelectorAll('[data-picker-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () { simulate(btn.getAttribute('data-picker-demo')); });
  });
})();
