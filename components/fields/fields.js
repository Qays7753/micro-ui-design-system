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
     5) عقد مزامنة القيم المعينة برمجيًا: MicroFields.sync(root)
        (UI-05/UI-06) — إعادة حساب عدّاد الأحرف وظهور زر المسح من
        القيم الحالية دون إطلاق أي حدث تعديل (لا input ولا change
        ولا micro-field:*) ودون أي أثر جانبي (لا يجعل النموذج dirty).

   الواجهة العلنية (window.MicroFields):
     init(root): تهيئة/ربط حقول النطاق (تلقائيًا عند التحميل).
     sync(root): مزامنة عدّاد الأحرف وظهور زر المسح بعد تعيين
                 القيم برمجيًا (input.value = ...) — بلا أحداث
                 تعديل زائفة. root = عنصر حقل واحد [data-micro-field]
                 أو أي نطاق (عندها تُزامَن كل حقوله)؛ الحقول غير
                 المربوطة تُتجاهل بصمت.

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

  var msgUid = 0; /* E03: معرفات رسائل فريدة ثابتة لكل عنصر */

  function fieldOf(el) { return el.closest('[data-micro-field]'); }

  /* UI-05/UI-06: عقد مزامنة القيم المعينة برمجيًا — دوال التحديث
     نفسها المستدعاة على حدث input تُحفظ على الغلاف (مصدر واحد
     للحقيقة) ليستدعيها MicroFields.sync(root) لاحقًا؛ هي بلا
     أحداث ولا آثار جانبية أصلا (نص العدّاد وصنف is-visible فقط). */
  function registerSync(f, fn) {
    if (!Array.isArray(f.__microFieldSyncs)) f.__microFieldSyncs = [];
    f.__microFieldSyncs.push(fn);
  }

  function runSyncs(f) {
    var list = f.__microFieldSyncs;
    if (!list || !list.length) return; /* حقل غير مربوط — يُتجاهل بصمت */
    for (var i = 0; i < list.length; i++) list[i]();
  }

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
    registerSync(f, update); /* UI-05: نفس دالة الحدث للمزامنة البرمجية */
    update();
  }

  function bindClear(f) {
    var input = f.querySelector('.m-field__input');
    var clear = f.querySelector('.m-field__clear');
    if (!input || !clear) return;
    /* E03: لا مسح على حقل readOnly أو disabled — يبقى قابلًا للقراءة والنسخ */
    function locked() { return input.disabled || input.readOnly; }
    function sync() {
      clear.classList.toggle('is-visible', input.value !== '' && !locked());
    }
    clear.addEventListener('click', function () {
      if (locked()) return; /* حراسة وقت النقر — الحالة قد تتغير بعد الربط */
      input.value = '';
      sync();
      input.focus(); /* إعادة التركيز للحقل بعد المسح */
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('micro-field:cleared', { bubbles: true }));
    });
    input.addEventListener('input', sync);
    registerSync(f, sync); /* UI-06: نفس دالة الحدث للمزامنة البرمجية —
                              دالة locked تُحترم فيها أيضا (readonly/disabled بلا مسح) */
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
      /* E03: لا تغيير قيمة على حقل readOnly أو disabled — readonly يبقى قابلًا للقراءة والنسخ */
      if (input.disabled || input.readOnly || btn.disabled) return;
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
    if (!msg || !input) return;
    /* E03: الفحص على الحقل (لا على الرسالة) — ودمج المراجع القائمة
       دون استبدال: مراجع وصف سابقة تبقى، ومعرف الرسالة يُضاف مرة.
       R2-06: التفرد يُفحص في المستند كله — معرف موجود مسبقًا (من
       مستهلك أو رسالة أخرى) لا يُعاد استعماله؛ الموجود يُحفظ كما هو. */
    var refs = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (msg.id && refs.indexOf(msg.id) >= 0) return; /* مرتبط سابقًا */
    if (!msg.id) msg.id = uniqueMsgId('m-field-msg-');
    if (refs.indexOf(msg.id) < 0) refs.push(msg.id);
    input.setAttribute('aria-describedby', refs.join(' '));
  }

  /* R2-06: معرف رسالة غير مستعمل في المستند كله — لا تصادم مع
     معرفات موجودة (مثل m-field-msg-1 المضبوطة من المستهلك). */
  function uniqueMsgId(base) {
    var i = ++msgUid;
    while (document.getElementById(base + i)) i++;
    return base + i;
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

  /* UI-05/UI-06: مزامنة حالة الحقول من قيمها الحالية بعد تعيينها
     برمجيًا (input.value = ...) — بلا إطلاق أي حدث تعديل (لا input
     ولا change ولا micro-field:*) وبلا أثر جانبي، فلا يصبح النموذج
     dirty بسببها. تقبل عنصر حقل واحد أو أي نطاق (document/عنصر
     حاوي) فتُزامن كل حقوله؛ الحقول غير المربوطة تُتجاهل بصمت. */
  function sync(root) {
    var scope = (root && typeof root.querySelectorAll === 'function') ? root : document;
    if (scope.nodeType === 1 && scope.matches('[data-micro-field]')) {
      runSyncs(scope);
    }
    scope.querySelectorAll('[data-micro-field]').forEach(runSyncs);
  }

  /* واجهة عامة: init تهيئة يدوية للمحتوى المضاف لاحقًا؛
     sync مزامنة العدّاد/المسح بعد تعيين القيم برمجيًا. */
  window.MicroFields = { init: init, sync: sync };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
