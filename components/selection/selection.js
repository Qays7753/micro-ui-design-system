/* =========================================================
   Micro UI — سلوك مكوّن الاختيار (B03)
   الملف: components/selection/selection.js
   عقد عام فقط — لا محاكاة ولا منطق أعمال:
   1) مجموعة checkboxes مع "تحديد الكل": مزامنة الحالة الجزئية
      (indeterminate) تلقائيًا — العنصر الحامل data-select-all
      داخل [data-choice-group].
   2) المقطّع Segmented: سلوك متبادل + تنقل أسهم (radiogroup-like)
      للأزرار داخل [data-seg].
   3) المفتاح Switch: حالة انتظار اختيارية (data-pending) يضبطها
      المستهلك أثناء تحديث الإعداد — عند الفشل يرجع المستهلك القيمة.
   HTML الأساس: <label class="m-choice m-choice--check"><input …><span class="m-choice__box"><svg><use href="#i-check"/></svg></span><span class="m-choice__text">…</span></label>
   ========================================================= */

(function () {
  'use strict';

  function syncGroup(group) {
    var all = group.querySelector('[data-select-all]');
    var boxes = [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]'));
    if (!all || !boxes.length) return;
    var checked = boxes.filter(function (b) { return b.checked; }).length;
    if (checked === 0) { all.checked = false; all.indeterminate = false; }
    else if (checked === boxes.length) { all.checked = true; all.indeterminate = false; }
    else { all.checked = false; all.indeterminate = true; }
  }

  function bindGroups(root) {
    root.querySelectorAll('[data-choice-group]').forEach(function (group) {
      if (group.dataset.microChoicesBound) return;
      group.dataset.microChoicesBound = '1';
      var all = group.querySelector('[data-select-all]');
      if (all) {
        all.addEventListener('change', function () {
          [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]'))
            .forEach(function (b) { b.checked = all.checked; });
          group.dispatchEvent(new Event('micro-selection:changed', { bubbles: true }));
        });
      }
      group.addEventListener('change', function (e) {
        if (e.target.matches('input[type="checkbox"][data-choice-item]')) syncGroup(group);
      });
      syncGroup(group);
    });
  }

  function bindSegmented(root) {
    root.querySelectorAll('[data-seg]').forEach(function (seg) {
      if (seg.dataset.microSegBound) return;
      seg.dataset.microSegBound = '1';
      var items = [].slice.call(seg.querySelectorAll('.m-seg__item'));
      function select(item) {
        items.forEach(function (it) {
          var on = it === item;
          it.setAttribute('aria-pressed', on ? 'true' : 'false');
          it.classList.toggle('is-selected', on);
        });
        seg.dispatchEvent(new CustomEvent('micro-selection:segment', {
          bubbles: true, detail: { value: item.getAttribute('data-value') || item.textContent.trim() }
        }));
      }
      items.forEach(function (it) {
        it.addEventListener('click', function () { if (!it.disabled) select(it); });
      });
      /* تنقل أسهم مثل مجموعة راديو */
      seg.addEventListener('keydown', function (e) {
        var i = items.indexOf(document.activeElement);
        if (i < 0) return;
        var next = null;
        if (e.key === 'ArrowLeft') next = items[(i + 1) % items.length];      /* RTL: يسار = التالي */
        else if (e.key === 'ArrowRight') next = items[(i - 1 + items.length) % items.length];
        else if (e.key === 'ArrowDown') next = items[(i + 1) % items.length];
        else if (e.key === 'ArrowUp') next = items[(i - 1 + items.length) % items.length];
        if (next) { e.preventDefault(); next.focus(); if (!next.disabled) select(next); }
      });
    });
  }

  function init(root) {
    var scope = root || document;
    bindGroups(scope);
    bindSegmented(scope);
  }

  /* عقد المفتاح: انتظار تحديث إعداد — المستهلك يضبط ويرجع عند الفشل */
  window.MicroSelection = {
    init: init,
    setSwitchPending: function (switchEl, pending) {
      switchEl.setAttribute('data-pending', pending ? 'true' : 'false');
      var input = switchEl.querySelector('input');
      if (input) input.setAttribute('aria-busy', pending ? 'true' : 'false');
    }
  };

  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
