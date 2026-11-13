/* Consumer example only: local draft and confirmation; no persistence/service. */
(function () {
  'use strict';
  var layer = document.getElementById('guarded-form');
  var input = document.getElementById('sample-note');
  var confirmation = document.getElementById('discard-confirm');
  var discard = false;
  var accepted = '';
  var lastAttempt = null;
  layer.addEventListener('micro-navigation:close-request', function (event) {
    if (event.target !== layer || input.value === accepted) return;
    event.preventDefault();
    lastAttempt = layer.contains(document.activeElement) ? document.activeElement : input;
    if (confirmation.hidden) window.MicroNavigation.openLayer(confirmation, { trigger: lastAttempt || input });
  });
  confirmation.addEventListener('micro-navigation:closed', function (event) {
    if (event.target !== confirmation) return;
    if (discard) {
      discard = false;
      input.value = accepted;
      window.MicroNavigation.closeLayer(layer);
    } else if (lastAttempt && layer.contains(lastAttempt) && !lastAttempt.disabled) lastAttempt.focus();
  });
  document.getElementById('discard-sample').addEventListener('click', function () {
    discard = true;
    window.MicroNavigation.closeLayer(confirmation);
  });
  document.getElementById('accept-sample').addEventListener('click', function () {
    accepted = input.value;
    window.MicroNavigation.closeLayer(layer);
    document.getElementById('form-feedback').textContent = 'اعتمدت القيمة في ذاكرة هذه المعاينة فقط؛ لا حفظ في خدمة.';
  });
}());
