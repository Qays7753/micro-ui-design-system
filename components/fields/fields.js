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

  function on(field, element, type, listener, capture) {
    element.addEventListener(type, listener, {
      capture: !!capture, signal: field.__microFieldLifetime.signal
    });
  }
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

  /* كل مساحة التحكم المرئية تستجيب للمس؛ التحرير والأزرار الداخلية
     تحتفظ بسلوكها الأصلي (لا تحريك للمؤشر عند النقر على النص). */
  function bindControlFocus(f) {
    var control = f.querySelector('.m-field__control');
    var input = f.querySelector('.m-field__input, .m-field__area');
    if (!control || !input) return;
    var outsideTouchButton = null;
    /* Chromium can retarget a gutter tap to a nearby button and adjust the
       later click coordinates. Inspect the original touch pointer position:
       a tap outside the actual 48px button focuses the shell, never clears
       or steps a value. Keyboard/synthetic activation remains unchanged. */
    on(f, control, 'pointerdown', function (e) {
      outsideTouchButton = null;
      if (e.pointerType !== 'touch') return;
      var button = e.target.closest('button');
      if (!button || !control.contains(button)) return;
      var box = button.getBoundingClientRect();
      if (e.clientX >= box.left && e.clientX <= box.right
          && e.clientY >= box.top && e.clientY <= box.bottom) return;
      outsideTouchButton = button;
      e.preventDefault();
      if (!input.disabled) input.focus({ preventScroll: true });
    }, true);
    on(f, control, 'click', function (e) {
      var outside = outsideTouchButton;
      outsideTouchButton = null;
      if (!outside || e.detail === 0 || e.target.closest('button') !== outside) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!input.disabled) input.focus({ preventScroll: true });
    }, true);
    on(f, control, 'click', function (e) {
      if (e.defaultPrevented || input.disabled) return;
      if (e.target.closest('input, textarea, select, button, a[href], [tabindex], [role="button"]')) return;
      input.focus();
    });
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
    on(f, input, 'input', update);
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
    on(f, clear, 'click', function () {
      if (locked()) return; /* حراسة وقت النقر — الحالة قد تتغير بعد الربط */
      input.value = '';
      sync();
      input.focus(); /* إعادة التركيز للحقل بعد المسح */
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('micro-field:cleared', { bubbles: true }));
    });
    on(f, input, 'input', sync);
    registerSync(f, sync); /* UI-06: نفس دالة الحدث للمزامنة البرمجية —
                              دالة locked تُحترم فيها أيضا (readonly/disabled بلا مسح) */
    sync();
  }

  function bindStepper(f) {
    var input = f.querySelector('.m-field__input--num');
    if (!f.querySelector('.m-field__stepper') || !input) return;
    var buttons = [].slice.call(f.querySelectorAll('[data-step]')).map(function (btn) {
      /* Preserve declared locks separately from derived unavailability.
         A reinitialized clone must not mistake its old bound/readonly
         aria-disabled state for a new permanent consumer lock. */
      var origin = btn.getAttribute('data-micro-step-aria-origin');
      if (origin === null) {
        origin = btn.getAttribute('aria-disabled');
        btn.setAttribute('data-micro-step-aria-origin', origin === null ? 'unset' : origin);
      } else if (origin === 'unset') origin = null;
      return { el: btn, ariaDisabled: origin };
    });
    function decimalPlaces(value) {
      var parts = String(value).toLowerCase().split('e');
      var fraction = (parts[0].split('.')[1] || '').length;
      var exponent = parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
      return Math.max(0, fraction - exponent);
    }
    function nextValue(btn) {
      var min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : null;
      var max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : null;
      if (!isFinite(min)) min = null;
      if (!isFinite(max)) max = null;
      var rawStep = input.getAttribute('step') || '1';
      var step = rawStep === 'any' ? 1 : parseFloat(rawStep);
      if (!isFinite(step) || step <= 0) step = 1;
      var dir = btn.getAttribute('data-step') === 'up' ? 1 : -1;
      var rawValue = input.value.trim();
      var empty = rawValue === '';
      var unchanged = parseFloat(rawValue);
      /* Invalid nonempty editing text is not zero or a numeric prefix.
         Leave it intact for consumer-owned validation and manual correction. */
      if (!empty && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(rawValue)) return unchanged;
      var v = unchanged;
      if (isNaN(v)) v = min !== null && min > 0 ? min : 0;
      if (empty && dir < 0 && min !== null && min >= 0) return unchanged;
      var precision = Math.max(decimalPlaces(rawValue || 0), decimalPlaces(rawStep));
      if (min !== null) precision = Math.max(precision, decimalPlaces(min));
      if (max !== null) precision = Math.max(precision, decimalPlaces(max));
      var scale = Math.pow(10, precision);
      var scaledValue = Math.round(v * scale);
      var scaledStep = Math.round(step * scale);
      /* Keep full text editable when exact stepping exceeds Number precision.
         Never round an unsafe integer or turn an extreme decimal into NaN. */
      if (!isFinite(scale) || !Number.isSafeInteger(scaledValue)
          || !Number.isSafeInteger(scaledStep)) return unchanged;
      if (empty && dir > 0 && min !== null && min > 0) return min;
      /* An out-of-range manually edited value may be nudged back toward its
         allowed range. Within range, never turn a full step into a partial
         clamp (e.g. 95 + 5 must not silently become 99). */
      if (min !== null && v < min) {
        return dir > 0 && Number.isSafeInteger(Math.round(min * scale)) ? min : unchanged;
      }
      if (max !== null && v > max) {
        return dir < 0 && Number.isSafeInteger(Math.round(max * scale)) ? max : unchanged;
      }
      var scaledCandidate = scaledValue + dir * scaledStep;
      if (!Number.isSafeInteger(scaledCandidate)) return unchanged;
      var candidate = scaledCandidate / scale;
      if (min !== null && candidate < min) return unchanged;
      if (max !== null && candidate > max) return unchanged;
      return candidate;
    }
    /* aria-disabled يُبقي الهدف قابلًا للاكتشاف بالكيبورد ويحفظ disabled
       الأصلي الذي يملكه المستهلك. المظهر والحراسة كلاهما من المكوّن. */
    function sameValue(a, b) {
      return a === b || (isNaN(a) && isNaN(b));
    }
    function syncButtons() {
      var current = parseFloat(input.value);
      buttons.forEach(function (state) {
        var btn = state.el;
        var unavailable = input.disabled || input.readOnly || btn.disabled
          || state.ariaDisabled === 'true' || sameValue(nextValue(btn), current);
        if (unavailable) btn.setAttribute('aria-disabled', 'true');
        else if (state.ariaDisabled === null) btn.removeAttribute('aria-disabled');
        else btn.setAttribute('aria-disabled', state.ariaDisabled);
      });
    }
    function stepButton(e) {
      var btn = e.target.closest('[data-step]');
      return btn && f.contains(btn) ? btn : null;
    }
    function applyStep(btn) {
      var current = parseFloat(input.value);
      var v = nextValue(btn);
      if (sameValue(v, current)) return false;
      input.value = String(v);
      syncButtons();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('micro-field:changed', { bubbles: true }));
      return true;
    }
    /* حراسة الالتقاط تمنع أيضًا المستمعات الخارجية والتفعيل الأصلي
       (Enter/Space) عندما يكون زر الخطوة غير متاح. */
    on(f, f, 'click', function (e) {
      var btn = stepButton(e);
      if (!btn) return;
      syncButtons();
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
    /* الاستماع على الغلاف نفسه: قد يكون هناك حايتا خطوة (إنقاص/زيادة) */
    on(f, f, 'click', function (e) {
      var btn = stepButton(e);
      if (!btn || input.disabled || input.readOnly || btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      applyStep(btn);
    });
    on(f, input, 'keydown', function (e) {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      if (input.disabled || input.readOnly) return;
      var btn = buttons.find(function (state) {
        return state.el.getAttribute('data-step') === (e.key === 'ArrowUp' ? 'up' : 'down');
      });
      if (!btn) return;
      syncButtons();
      if (btn.el.disabled || btn.el.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      applyStep(btn.el);
    });
    on(f, input, 'input', syncButtons);
    on(f, input, 'change', syncButtons);
    registerSync(f, syncButtons);
    f.__microFieldObserver = new MutationObserver(syncButtons);
    f.__microFieldObserver.observe(f, {
      subtree: true, attributes: true,
      attributeFilter: ['disabled', 'readonly', 'min', 'max', 'step']
    });
    syncButtons();
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
    var fields = [].slice.call(scope.querySelectorAll('[data-micro-field]'));
    if (scope.matches && scope.matches('[data-micro-field]')) fields.unshift(scope);
    fields.forEach(function (f) {
      if (f.dataset.microFieldBound && f.__microFieldLifetime && !f.__microFieldLifetime.signal.aborted) return;
      f.dataset.microFieldBound = '1';
      f.__microFieldLifetime = new AbortController();
      bindControlFocus(f);
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
  function disconnect(root) {
    var scope = root || document;
    var fields = [].slice.call(scope.querySelectorAll('[data-micro-field]'));
    if (scope.matches && scope.matches('[data-micro-field]')) fields.unshift(scope);
    fields.forEach(function (field) {
      if (field.__microFieldLifetime) field.__microFieldLifetime.abort();
      if (field.__microFieldObserver) field.__microFieldObserver.disconnect();
      delete field.__microFieldLifetime;
      delete field.__microFieldObserver;
      delete field.__microFieldSyncs;
      delete field.dataset.microFieldBound;
      field.querySelectorAll('[data-micro-step-aria-origin]').forEach(function (button) {
        var original = button.getAttribute('data-micro-step-aria-origin');
        if (original === 'unset') button.removeAttribute('aria-disabled');
        else button.setAttribute('aria-disabled', original);
        button.removeAttribute('data-micro-step-aria-origin');
      });
    });
  }
  window.MicroFields = { init: init, sync: sync, disconnect: disconnect, destroy: disconnect };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
