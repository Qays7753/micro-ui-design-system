/* Two independent consumers, one shared source sheet. No command is executed. */
(function () {
  'use strict';
  var sheet = document.getElementById('sample-actions');
  var result = document.getElementById('action-feedback');
  document.querySelectorAll('[data-example-actions]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.MicroActionSheet.open(sheet, { trigger: button, contextKey: button.getAttribute('data-example-actions') });
    });
  });
  sheet.addEventListener('micro-actions:request', function (event) {
    result.textContent = 'طلب إجراء ' + event.detail.id + ' على ' + event.detail.contextKey + '؛ لا عملية فعلية.';
  });
  document.getElementById('toggle-empty-actions').addEventListener('click', function () {
    var empty = sheet.querySelector('[data-actions-empty]');
    empty.hidden = !empty.hidden;
    sheet.querySelector('.m-action-sheet__list').hidden = !empty.hidden;
  });
}());
