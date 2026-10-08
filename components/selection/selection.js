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

  /* E05: استرجاع دقيق لحالة التعطيل الأصلية للمفتاح بعد الانتظار */
  var pendingRestore = new WeakMap();

  function isDisabled(el) {
    return el.disabled || el.getAttribute('aria-disabled') === 'true';
  }

  function syncGroup(group) {
    var all = group.querySelector('[data-select-all]');
    /* E05: «تحديد الكل» يدير العناصر المفعّلة فقط — لا يغيّر المحمية */
    var boxes = [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]'))
      .filter(function (b) { return !b.disabled; });
    if (!all) return;
    /* F02-P01: مجموعة بلا خيارات مفعّلة = حالة صفر صريح على الحامل
       (checked=false وindeterminate=false) عند التهيئة وعند أي إعادة حساب،
       حتى لو ورد الحامل بالسمتين من الترميز. العناصر المعطلة وقيمها
       تبقى كما هي — لا تُمس ولا تُستنتج منها. */
    if (!boxes.length) { all.checked = false; all.indeterminate = false; return; }
    var checked = boxes.filter(function (b) { return b.checked; }).length;
    if (checked === 0) { all.checked = false; all.indeterminate = false; }
    else if (checked === boxes.length) { all.checked = true; all.indeterminate = false; }
    else { all.checked = false; all.indeterminate = true; }
  }

  function bindGroups(root) {
    /* W2.5 (A2-F08): الجذر نفسه إن طابق المحدد ثم الأبناء — عقد init موحد */
    var scope = root || document;
    var groups = [].slice.call(scope.querySelectorAll('[data-choice-group]'));
    if (scope.nodeType === 1 && scope.matches('[data-choice-group]')) groups.unshift(scope);
    groups.forEach(function (group) {
      if (group.dataset.microChoicesBound) return;
      group.dataset.microChoicesBound = '1';
      var all = group.querySelector('[data-select-all]');
      if (all) {
        all.addEventListener('change', function () {
          [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]'))
            .forEach(function (b) { if (!b.disabled) b.checked = all.checked; }); /* E05: المعطل لا يُلمس */
          /* F02-P01: إعادة حساب بعد كل تغيير — نقر «تحديد الكل» في مجموعة
             بلا مفعّلين يقلب الحامل أصليًا ثم يُصفّر هنا فلا حالة وهمية */
          syncGroup(group);
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
    /* W2.5 (A2-F08): الجذر نفسه إن طابق المحدد ثم الأبناء — تمرير عقدة
       segmented ذاتها إلى MicroSelection.init كان يُهمل قبل هذا التعديل */
    var scope = root || document;
    var segs = [].slice.call(scope.querySelectorAll('[data-seg]'));
    if (scope.nodeType === 1 && scope.matches('[data-seg]')) segs.unshift(scope);
    segs.forEach(function (seg) {
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
        /* F02-P02: نفس حراسة الأسهم (isDisabled) في النقر — المعطّل
           أصليًا أو aria-disabled=true لا يغيّر الاختيار ولا يطلق حدث
           micro-selection:segment، بما يشمل Enter/Space (أصله click). */
        it.addEventListener('click', function () { if (!isDisabled(it)) select(it); });
      });
      /* تنقل أسهم مثل مجموعة راديو — يتجاوز المعطل (E05) ولا يقف عنده */
      seg.addEventListener('keydown', function (e) {
        var i = items.indexOf(document.activeElement);
        if (i < 0) return;
        var dir = 0;
        if (e.key === 'ArrowLeft') dir = 1;      /* RTL: يسار = التالي */
        else if (e.key === 'ArrowRight') dir = -1;
        else if (e.key === 'ArrowDown') dir = 1;
        else if (e.key === 'ArrowUp') dir = -1;
        if (!dir) return;
        e.preventDefault();
        var n = items.length, next = null;
        for (var s = 1; s <= n; s++) {
          var cand = items[((i + dir * s) % n + n) % n];
          if (!isDisabled(cand)) { next = cand; break; }
        }
        if (next) { next.focus(); select(next); }
      });
    });
  }

  function init(root) {
    var scope = root || document;
    bindGroups(scope);
    bindSegmented(scope);
  }

  /* حماية مباشرة حتى مع data-pending المضبوط بالترميز دون API:
   * تبديل مستخدم فعلي على مفتاح في انتظار يُرجع فورًا (تقاطع).
   * R2-06: إشعار change برمجي (isTrusted=false — مثلاً استهلاكٍ
   * ضبط checked وأطلق الححدث بنفسه) ليس تبديلًا فعليًا فلا يُعكس. */
  document.addEventListener('change', function (e) {
    if (!e.isTrusted) return; /* R2-06: إشعار برمجي ليس تبديلًا فعليًا */
    var input = e.target;
    if (!input.matches || !input.matches('.m-switch input')) return;
    var sw = input.closest('.m-switch');
    if (sw && sw.getAttribute('data-pending') === 'true') {
      input.checked = !input.checked;
    }
  }, true);

  /* عقد المفتاح: انتظار تحديث إعداد — المستهلك يضبط ويرجع عند الفشل */
  window.MicroSelection = {
    init: init,
    setSwitchPending: function (switchEl, pending) {
      if (!switchEl || switchEl.nodeType !== 1) return;
      switchEl.setAttribute('data-pending', pending ? 'true' : 'false');
      var input = switchEl.querySelector('input');
      if (!input) return;
      input.setAttribute('aria-busy', pending ? 'true' : 'false');
      /* E05: حماية تفعيل فعلية أثناء الانتظار — label وSpace والنقر
         جميعها بلا أثر، مع استرجاع التعطيل الأصلي بدقة (ربما كان
         معطلًا قبل الانتظار — يُرجع معطلًا لا مفعّلًا).
         R2-06: إنهاء انتظار غير مبدوء آمن — لا يغيّر حالة المستهلك
         (مفتاح معطل أصلًا يبقى معطلًا، ومفعّل أصلًا يبقى مفعّلًا)،
         وإنهاء متكرر بعد دورة مكتملة لا يعيد فعل شيء. */
      if (pending) {
        if (!pendingRestore.has(input)) pendingRestore.set(input, input.disabled);
        input.disabled = true;
      } else if (pendingRestore.has(input)) {
        input.disabled = pendingRestore.get(input);
        pendingRestore.delete(input);
      }
      /* بلا دورة انتظار سابقة: لا يُلمس disabled إطلاقًا */
    }
  };

  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
