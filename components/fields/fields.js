/* =========================================================
   Micro UI — سلوك مكوّن الحقول (B02)
   الملف: components/fields/fields.js
   الدور: عقد عام للمكوّن فقط — لا تحقق منطق أعمال ولا مؤقتات
   ولا رسائل شبكة. سياسة التحقق الفعلية (متى يظهر الخطأ والنجاح)
   قرار المستهلك؛ هذا الملف يوفّر:
     1) عدّاد الأحرف للحقول ذات حد معلن (data-maxlength).
     2) زر مسح البحث: إظهاره بوجود نص، ومسحه وإعادة التركيز.
     3) خطوة الكمية (زيادة/نقصان) بحدود وخطوة يمررها المستهلك
        (min/max/step من السمات أو data-* على الغلاف).
     4) ربط الرسالة بالحقل عبر aria-describedby تلقائيًا إن لم يتصله.

   مثال استخدام أدنى (خارج لوحة المعاينة):
   ─────────────────────────────────────────────────────────
   <link rel="stylesheet" href="shared/tokens.css">
   <link rel="stylesheet" href="components/fields/fields.css">
   <div class="m-field" data-micro-field>
     <label class="m-field__label" for="amount1">المبلغ</label>
     <div class="m-field__control">
       <input class="m-field__input m-field__input--num" id="amount1"
              type="text" inputmode="decimal" dir="ltr" placeholder="0.00">
       <span class="m-field__unit">د.أ</span>
     </div>
     <p class="m-field__msg" data-field-msg hidden>رسالة المستهلك هنا</p>
   </div>
   <script src="components/fields/fields.js"></script>
   ─────────────────────────────────────────────────────────
   الحالات (has-error/has-success/has-disabled/has-readonly) يضبطها
   المستهلك على الغلاف — المكوّن يعرضها فقط.
   ========================================================= */

(function () {
  'use strict';

  function fieldOf(el) { return el.closest('[data-micro-field]'); }

  function bindCount(f) {
    var input = f.querySelector('.m-field__input, .m-field__area');
    var count = f.querySelector('.m-field__count');
    if (!input || !count) return;
    var max = parseInt(input.getAttribute('maxlength') || input.dataset.maxlength || '', 10);
    if (!max || isNaN(max)) { count.style.display = 'none'; return; }
    function update() {
      count.textContent = input.value.length + '/' + max;
    }
    input.addEventListener('input', update);
    update();
  }

  function bindClear(f) {
    var input = f.querySelector('.m-field__input');
    var clear = f.querySelector('.m-field__clear');
    if (!input || !clear) return;
    function sync() {
      clear.classList.toggle('is-visible', input.value !== '');
    }
    clear.addEventListener('click', function () {
      input.value = '';
      sync();
      input.focus(); /* إعادة التركيز للحقل بعد المسح */
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('micro-field:cleared', { bubbles: true }));
    });
    input.addEventListener('input', sync);
    sync();
  }

  function bindStepper(f) {
    var input = f.querySelector('.m-field__input--num');
    if (!f.querySelector('.m-field__stepper') || !input) return;
    var min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : null;
    var max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : null;
    var step = parseFloat(input.getAttribute('step')) || 1;
    var dec = (String(input.getAttribute('step') || '').split('.')[1] || '').length;
    /* الاستماع على الغلاف نفسه: قد يكون هناك حايتا خطوة (إنقاص/زيادة) */
    f.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-step]');
      if (!btn || !f.contains(btn)) return;
      var dir = btn.getAttribute('data-step') === 'up' ? 1 : -1;
      var v = parseFloat(input.value);
      if (isNaN(v)) v = min !== null && min > 0 ? min : 0;
      v = Math.round((v + dir * step) * Math.pow(10, dec)) / Math.pow(10, dec);
      if (min !== null && v < min) v = min; /* الحدود والخطوة والدقة من المستهلك */
      if (max !== null && v > max) v = max;
      input.value = String(v);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('micro-field:changed', { bubbles: true }));
    });
  }

  function bindMessage(f) {
    var msg = f.querySelector('[data-field-msg]');
    var input = f.querySelector('.m-field__input, .m-field__area');
    if (!msg || !input || msg.getAttribute('aria-describedby')) return;
    if (!msg.id) msg.id = 'm-field-msg-' + Math.abs(
      (f.id || f.className) .split('').reduce(function (a, c) { return (a * 31 + c.charCodeAt(0)) | 0; }, 7)
    );
    input.setAttribute('aria-describedby', msg.id);
  }

  function init(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-micro-field]').forEach(function (f) {
      if (f.dataset.microFieldBound) return;
      f.dataset.microFieldBound = '1';
      bindCount(f);
      bindClear(f);
      bindStepper(f);
      bindMessage(f);
    });
  }

  /* واجهة عامة: تهيئة يدوية للمحتوى المضاف لاحقًا */
  window.MicroFields = { init: init };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
