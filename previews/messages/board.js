/* محاكاة لوحة B06 — كلها خارج المكوّن */
(function () {
  'use strict';

  /* الرسالة العابرة: المستهلك يستدعي toast بمدته + يظهر البديل الثابت */
  var toastBtn = document.querySelector('[data-toast-demo]');
  var repeatBtn = document.querySelector('[data-toast-repeat]');
  var toastEl = document.querySelector('[data-toast]');
  var mirror = document.querySelector('[data-toast-mirror]');
  function showToast() {
    if (mirror) mirror.hidden = false; /* البديل الثابت يظهر فورًا ويبقى */
    MicroMessages.toast(toastEl, { duration: 4000 });
  }
  if (toastBtn) toastBtn.addEventListener('click', showToast);
  if (repeatBtn) repeatBtn.addEventListener('click', showToast); /* إعلان دون تكرار نفس النص المتتالي */
  var toastClose = document.querySelector('[data-toast-close]');
  if (toastClose) toastClose.addEventListener('click', function () {
    if (toastEl) { toastEl.hidden = true; if (toastEl.dataset.toastTimer) { clearTimeout(parseInt(toastEl.dataset.toastTimer, 10)); delete toastEl.dataset.toastTimer; } }
  });

  /* فشل القراءة: إعادة محاولة محاكاة (skeleton ثم قائمة نتيجة) */
  var retryBtn = document.querySelector('[data-retry-demo]');
  var failState = document.querySelector('[data-fail-state]');
  var skeleton = document.querySelector('[data-retry-skeleton]');
  if (retryBtn) retryBtn.addEventListener('click', function () {
    if (failState) failState.hidden = true;
    if (skeleton) skeleton.hidden = false;
    window.setTimeout(function () {
      if (skeleton) skeleton.hidden = true;
      if (failState) {
        failState.hidden = false;
        failState.querySelector('.m-empty__title').textContent = 'تم تحميل القائمة (محاكاة)';
        failState.querySelector('.m-empty__body').textContent = 'ثلاث عمليات جاهزة — هذا عرض تجريبي لا بيانات حقيقية.';
      }
    }, 1200);
  });
})();
