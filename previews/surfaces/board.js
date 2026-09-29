/* محاكاة لوحة S01 — كلها عرض خارج المكوّن:
   1) مفاتيح الموجة على سطح التجربة.
   2) محاكاة تقليل الحركة (صنف micro-reduce على الجذر).
   3) طبقة تجريبية 240ms فتح/إغلاق بعقد micro-layer. */
(function () {
  'use strict';

  /* 1) مفاتيح الموجة */
  var target = document.querySelector('[data-surface="waves"]');
  var defaults = {};
  document.querySelectorAll('[data-wave-keys] [data-key]').forEach(function (input) {
    var key = input.getAttribute('data-key');
    defaults[key] = input.value;
    input.addEventListener('input', function () {
      if (!target) return;
      var unit = input.getAttribute('data-unit') || '';
      target.style.setProperty(key, input.value + unit);
    });
  });
  var reset = document.querySelector('[data-reset-keys]');
  if (reset) reset.addEventListener('click', function () {
    document.querySelectorAll('[data-wave-keys] [data-key]').forEach(function (input) {
      input.value = defaults[input.getAttribute('data-key')];
      if (target) target.style.removeProperty(input.getAttribute('data-key'));
    });
  });

  /* 2) محاكاة تقليل الحركة */
  var reduceBtn = document.querySelector('[data-reduce-toggle]');
  var motionState = document.querySelector('[data-motion-state]');
  if (reduceBtn) reduceBtn.addEventListener('click', function () {
    var on = document.body.classList.toggle('micro-reduce');
    reduceBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (motionState) motionState.textContent = on
      ? 'تقليل الحركة (محاكاة): الطبقة فورية بلا حركة مكانية.'
      : 'الحركة الكاملة مفعّلة.';
  });

  /* 3) طبقة تجريبية */
  var sheet = document.querySelector('[data-layer]');
  var opener = document.querySelector('[data-layer-open]');
  function close() {
    if (!sheet) return;
    sheet.setAttribute('data-closing', 'true');
    window.setTimeout(function () {
      sheet.hidden = true;
      sheet.removeAttribute('data-closing');
      if (opener) opener.focus(); /* إعادة التركيز للمشغّل */
    }, 240);
  }
  if (opener) opener.addEventListener('click', function () {
    if (sheet) { sheet.hidden = false; sheet.removeAttribute('data-closing');
      var btn = sheet.querySelector('[data-layer-close]'); if (btn) btn.focus(); }
  });
  var closer = document.querySelector('[data-layer-close]');
  if (closer) closer.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && !sheet.hidden) close();
  });
})();
