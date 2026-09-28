/* محاكاة لوحة B07 — عدّاد زر التصفية يتبع المطبّق (عرض المستهلك) */
(function () {
  'use strict';
  var trigger = document.getElementById('filter-trigger');
  var panel = document.getElementById('filter-panel');
  if (!trigger || !panel) return;
  panel.addEventListener('micro-navigation:filters-applied', function (e) {
    var n = Object.keys(e.detail.applied || {}).filter(function (k) { return e.detail.applied[k]; }).length;
    var counter = trigger.querySelector('[data-filter-count]');
    if (!counter) return;
    counter.textContent = String(n);
    counter.classList.toggle('m-btn__counter--zero', n === 0); /* 0 مخفية (B01) */
    var label = 'تصفية، ' + (n === 0 ? 'لا فلاتر نشطة' : n + ' فلاتر نشطة');
    trigger.setAttribute('aria-label', label);
    var result = document.querySelector('[data-filter-result]');
    if (result) { result.hidden = false; result.setAttribute('data-tone', 'success'); result.textContent = 'المطبّق: ' + n + ' فلاتر (محاكاة المستهلك)'; }
  });
})();
