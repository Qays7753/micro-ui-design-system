/* Local consumer behavior for the three standalone component compositions. */
(function () {
  'use strict';

  var rowAction = document.querySelector('[data-row-action]');
  var rowFeedback = document.querySelector('[data-row-feedback]');
  if (rowAction && rowFeedback) {
    rowAction.addEventListener('click', function () {
      if (rowAction.getAttribute('aria-busy') === 'true') return;
      MicroButtons.setLoading(rowAction, true, { loadingLabel: 'جارٍ تنفيذ العينة' });
      window.setTimeout(function () {
        MicroButtons.setLoading(rowAction, false);
        rowFeedback.textContent = 'اكتمل الإجراء التجريبي داخل الصفحة فقط.';
      }, 700);
    });
  }

  var form = document.querySelector('[data-sample-form]');
  if (form) {
    var field = document.getElementById('sample-note');
    var fieldWrap = field.closest('[data-micro-field]');
    var error = document.getElementById('sample-note-error');
    var feedback = form.querySelector('[data-form-feedback]');
    var submit = form.querySelector('[data-form-submit]');

    function setError(message) {
      var invalid = Boolean(message);
      fieldWrap.classList.toggle('has-error', invalid);
      if (invalid) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      error.textContent = message;
      error.classList.toggle('is-visible', invalid);
    }

    field.addEventListener('input', function () {
      if (field.value.trim().length >= 3) setError('');
      feedback.textContent = 'تغيّر المثال محليًا؛ لم يتم حفظه.';
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (submit.getAttribute('aria-busy') === 'true') return;
      if (field.value.trim().length < 3) {
        setError('أضف ثلاثة أحرف على الأقل قبل المتابعة.');
        feedback.textContent = 'تحقق من الخطأ الموضح بجانب الحقل.';
        field.focus();
        return;
      }
      setError('');
      feedback.textContent = 'جارٍ التحقق من العينة محليًا…';
      MicroButtons.setLoading(submit, true);
      window.setTimeout(function () {
        MicroButtons.setLoading(submit, false);
        feedback.textContent = 'العينة صالحة؛ لم تُرسل ولم تُحفظ.';
      }, 700);
    });
  }
})();