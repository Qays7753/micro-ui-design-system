/* Consumer-owned examples only. Do not load this file in a product.
   Shared composition sources are CSS/semantic markup; this local controller
   supplies sample data, validation, dirty policy and manually resolved Promises. */
(function () {
  'use strict';
  var forms = new WeakMap();
  var localJobs = new Map();
  var booted = false;
  var rowActions = 0;

  function rawValues(form) {
    var values = {};
    form.querySelectorAll('input[name],textarea[name],select[name]').forEach(function (input) {
      values[input.name] = input.type === 'checkbox' ? input.checked : input.value;
    });
    return values;
  }
  function snapshot(form) { return JSON.stringify(rawValues(form)); }
  function feedback(form, message, tone) {
    var box = form.querySelector('[data-form-feedback]');
    if (!box) return;
    box.hidden = !message;
    box.className = 'm-form-surface__feedback m-note m-note--' + (tone || 'info');
    box.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    box.querySelector('[data-feedback-title]').textContent = tone === 'error' ? 'تعذّرت العينة' : tone === 'success' ? 'نتيجة معلنة' : 'حالة العينة';
    box.querySelector('[data-feedback-body]').textContent = message || '';
  }
  function errorFor(input, message) {
    var field = input.closest('[data-micro-field]');
    var note = field && field.querySelector('[data-example-error]');
    if (!field || !note) return;
    field.classList.toggle('has-error', !!message);
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    note.textContent = message || '';
    note.classList.toggle('is-visible', !!message);
  }
  function validate(input) {
    if (!input.willValidate) return '';
    // These are explicit rules of the local examples, not library validation.
    if (input.name === 'title' && input.value.trim().length < 3) return 'أدخل ثلاثة أحرف على الأقل؛ النص الحالي باقٍ.';
    if (!input.validity.valid) return input.name === 'reference'
      ? 'استخدم من3 إلى20 حرفًا لاتينيًا كبيرًا أو رقمًا أو شرطة؛ النص الحالي باقٍ.'
      : 'تحقق من القيمة المطلوبة؛ لم يُمسح النص.';
    return '';
  }
  function deferredExample(form, signal) {
    return new Promise(function (resolve, reject) {
      function finish(value, error) {
        if (localJobs.get(form.id) !== job) return;
        localJobs.delete(form.id);
        signal.removeEventListener('abort', abort);
        if (error) reject(error); else resolve(value);
      }
      function abort() { finish(null, { userMessage: 'أُوقفت المعاينة المحلية.' }); }
      var job = { settle: finish };
      localJobs.set(form.id, job);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
  }
  function initForm(form, handlers) {
    var existing = forms.get(form);
    if (existing) {
      if (handlers !== undefined) existing.handlers = handlers || {};
      return existing;
    }
    var lifetime = new AbortController();
    var submit = form.querySelector('[type="submit"]');
    var state = {
      handlers: handlers === undefined ? { onSubmit: function (_, context) { return deferredExample(form, context.signal); } } : handlers || {},
      baseline: snapshot(form), pending: false, inputsSeen: 0, submissions: 0,
      lifetime: lifetime, originalBusy: null
    };
    forms.set(form, state);
    MicroFields.init(form);
    feedback(form, '', 'info'); // A fresh preview lifetime must not inherit an old pending announcement.
    function alive() { return !lifetime.signal.aborted && form.isConnected && forms.get(form) === state; }
    function busy(flag) {
      if (flag) state.originalBusy = form.getAttribute('aria-busy');
      state.pending = flag;
      if (flag) form.setAttribute('aria-busy', 'true');
      else if (state.originalBusy === null) form.removeAttribute('aria-busy');
      else form.setAttribute('aria-busy', state.originalBusy);
      MicroButtons.setLoading(submit, flag);
    }
    state.prefill = function (values) {
      if (!alive() || state.pending) return false;
      form.querySelectorAll('input[name],textarea[name],select[name]').forEach(function (input) {
        if (!Object.prototype.hasOwnProperty.call(values, input.name)) return;
        if (input.type === 'checkbox') input.checked = !!values[input.name];
        else input.value = String(values[input.name]);
        errorFor(input, '');
      });
      MicroFields.sync(form);
      state.baseline = snapshot(form);
      feedback(form, 'قيمة مسبقة من مستهلك المثال؛ لا حدث تعديل أو اعتماد ضمني.', 'info');
      return true;
    };
    state.getState = function () {
      return { raw: rawValues(form), dirty: snapshot(form) !== state.baseline,
        pending: state.pending, inputsSeen: state.inputsSeen, submissions: state.submissions };
    };
    state.destroy = function () {
      if (lifetime.signal.aborted) return;
      lifetime.abort();
      if (state.pending) {
        busy(false);
        feedback(form, 'أُوقفت معاينة النموذج؛ لا نتيجة معتمدة.', 'info');
      }
      MicroFields.disconnect(form);
      MicroButtons.disconnect(form);
      forms.delete(form);
    };
    form.addEventListener('input', function (event) {
      state.inputsSeen++;
      if (event.target.matches('input,textarea,select')) errorFor(event.target, '');
    }, { signal: lifetime.signal });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (state.pending || submit.disabled) return;
      var invalid = [];
      form.querySelectorAll('input[name],textarea[name],select[name]').forEach(function (input) {
        var message = validate(input);
        errorFor(input, message);
        if (message) invalid.push(input);
      });
      if (invalid.length) {
        feedback(form, 'صحّح الحقول الموضحة. النص الخام بقي كما أدخلته.', 'error');
        invalid[0].focus();
        return;
      }
      var submittedSnapshot = snapshot(form);
      var values = rawValues(form);
      var handler = state.handlers.onSubmit;
      state.submissions++;
      busy(true);
      feedback(form, 'العينة تنتظر نتيجة يحددها المستهلك. لا إرسال أو حفظ.', 'info');
      Promise.resolve().then(function () {
        if (!alive()) return;
        return typeof handler === 'function' ? handler(values, { signal: lifetime.signal }) : undefined;
      }).then(function (result) {
        if (!alive()) return;
        if (snapshot(form) !== submittedSnapshot) {
          feedback(form, 'تغيّر النص أثناء الانتظار؛ النتيجة لا تعتمد القيم الجديدة.', 'info');
          return;
        }
        // Result shape is a policy of this preview only, not a production API.
        if (result && result.confirmed === true) {
          feedback(form, typeof result.message === 'string' && result.message.trim() ? result.message : 'نتيجة عينة أكدها المستهلك؛ لم تُحفظ بيانات.', 'success');
        } else if (result && result.confirmed === false) {
          feedback(form, typeof result.message === 'string' && result.message.trim() ? result.message : 'المستهلك لم يعتمد نتيجة العينة.', 'error');
        } else {
          feedback(form, 'انتهت العينة دون نتيجة مؤكدة؛ لم يُعتمد شيء.', 'info');
        }
      }).catch(function (error) {
        if (!alive()) return;
        var message = error && typeof error.userMessage === 'string' && error.userMessage.trim()
          ? error.userMessage : 'تعذّرت العينة؛ النص المدخل باقٍ للمراجعة.';
        feedback(form, message, 'error');
      }).then(function () { if (alive()) busy(false); });
    }, { signal: lifetime.signal });
    return state;
  }

  function boot() {
    if (booted) return;
    booted = true;
    document.querySelectorAll('[data-example-form]').forEach(function (form) { initForm(form); });
    document.querySelectorAll('[data-prefill-form]').forEach(function (button) {
      button.addEventListener('click', function () {
        var form = document.getElementById(button.dataset.prefillForm);
        initForm(form).prefill(form.id === 'inline-form' ? { title: 'عنوان عينة مسبق', note: 'نص من مصدر المثال' } : { reference: 'REF-001', origin: 'DEMO' });
      });
    });
    document.querySelectorAll('[data-resolve-form]').forEach(function (button) {
      button.addEventListener('click', function () {
        var job = localJobs.get(button.dataset.resolveForm);
        if (!job) return;
        if (button.dataset.result === 'error') job.settle(null, { userMessage: 'رفض مستهلك المثال العينة؛ النص باقٍ.' });
        else job.settle(button.dataset.result === 'confirmed'
          ? { confirmed: true, message: 'نتيجة عينة معلنة من المستهلك؛ لم تُحفظ بيانات.' } : undefined);
      });
    });
    var dialog = document.getElementById('form-dialog');
    if (dialog) {
      var dialogForm = document.getElementById('dialog-form');
      var opener = document.getElementById('open-form-dialog');
      var confirm = dialog.querySelector('[data-close-confirm]');
      var previousFocus;
      var savedOverflow = null;
      var openedController = null;
      function releaseScroll() {
        if (savedOverflow === null) return;
        document.documentElement.style.overflow = savedOverflow;
        savedOverflow = null;
      }
      function closeDialog() {
        var controller = forms.get(dialogForm);
        if (controller) controller.destroy();
        openedController = null;
        confirm.hidden = true;
        releaseScroll();
        dialog.close();
        document.getElementById('dialog-feedback').textContent = 'أُغلقت المعاينة؛ لم يُعتمد أو يُحفظ شيء.';
      }
      function requestClose() {
        var state = initForm(dialogForm).getState();
        if (!state.dirty && !state.pending) { closeDialog(); return; }
        if (confirm.hidden) previousFocus = document.activeElement;
        confirm.hidden = false;
        dialog.querySelector('[data-keep-editing]').focus();
      }
      opener.addEventListener('click', function () {
        if (dialog.open) return;
        openedController = initForm(dialogForm);
        savedOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        dialog.showModal();
      });
      dialog.addEventListener('cancel', function (event) { event.preventDefault(); requestClose(); });
      dialog.addEventListener('click', function (event) {
        if (event.target !== dialog) return;
        var r = dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) requestClose();
      });
      dialog.querySelector('[data-example-close]').addEventListener('click', requestClose);
      dialog.querySelector('[data-keep-editing]').addEventListener('click', function () {
        confirm.hidden = true;
        if (previousFocus && previousFocus.isConnected && !previousFocus.closest('[hidden]')) previousFocus.focus();
        else dialogForm.querySelector('input:not([readonly])').focus();
      });
      dialog.querySelector('[data-discard-example]').addEventListener('click', closeDialog);
      dialog.addEventListener('close', function () {
        if (dialog.open) return; // A prior close event must not tear down a reopened example.
        // Only clean the controller of the session actually opened. A queued
        // close event must not destroy a newly prepared, still-closed form.
        if (openedController) openedController.destroy();
        openedController = null;
        confirm.hidden = true;
        releaseScroll();
      });
    }

    var reading = document.getElementById('count-reading');
    if (reading) {
      var modes = { ready: ['18', 'القيمة كما قدمها المصدر.'], zero: ['0', 'صفر معلوم؛ ليس غيابًا.'], missing: ['غير متاح', 'لا قيمة في مصدر العينة؛ لم نستبدلها بصفر.'], signed: ['−12.500', 'قراءة موقعة ودقة معلنة من المصدر.'], long: ['123,456,789.125', 'قيمة عرض طويلة بلا تقريب.'] };
      document.querySelectorAll('[data-reading-state]').forEach(function (button) {
        button.addEventListener('click', function () {
          var mode = button.dataset.readingState;
          reading.removeAttribute('aria-busy');
          if (modes[mode]) {
            reading.querySelector('.m-info-card__number').textContent = modes[mode][0];
            reading.querySelector('.m-info-card__unit').hidden = mode === 'missing';
            reading.querySelector('.m-info-card__reading').classList.toggle('m-info-card__reading--unavailable', mode === 'missing');
            reading.querySelector('.m-info-card__qualifier').textContent = 'قيمة يقدمها المستهلك';
            document.getElementById('count-feedback').textContent = modes[mode][1];
          } else {
            reading.querySelector('.m-info-card__qualifier').textContent = 'القراءة السابقة؛ لم تُحدّث';
            if (mode === 'pending') reading.setAttribute('aria-busy', 'true');
            document.getElementById('count-feedback').textContent = mode === 'pending' ? 'بانتظار قراءة جديدة؛ القيمة المعروضة سابقة.' : 'تعذّر التحديث؛ القيمة المعروضة سابقة.';
          }
        });
      });
    }
    document.querySelectorAll('[data-row-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        rowActions++;
        document.getElementById('row-feedback').textContent = 'استجاب إجراء العينة محليًا؛ لم يُعتمد تحديث بيانات.';
      });
    });
    document.querySelectorAll('[data-list-mode]').forEach(function (button) {
      button.addEventListener('click', function () {
        var mode = button.dataset.listMode, list = document.getElementById('stock-list');
        list.hidden = mode === 'empty';
        document.getElementById('stock-empty').hidden = mode !== 'empty';
        if (mode === 'pending') list.setAttribute('aria-busy', 'true'); else list.removeAttribute('aria-busy');
        document.getElementById('list-feedback').textContent = mode === 'empty' ? 'المصدر فارغ؛ لا صف صفر وهمي.' : mode === 'pending' ? 'الصفوف السابقة ظاهرة أثناء انتظار التحديث.' : mode === 'error' ? 'تعذّر التحديث؛ الصفوف السابقة ما زالت ظاهرة.' : 'الصفوف من مصدر عينة معلن.';
      });
    });
  }
  // Test/preview hooks, explicitly not a Micro* component API.
  window.CompositionPreview = {
    initForm: initForm,
    getFormState: function (form) { var state = forms.get(form); return state ? state.getState() : null; },
    destroyForm: function (form) { var state = forms.get(form); if (state) state.destroy(); },
    getRowActionCount: function () { return rowActions; }
  };
  document.addEventListener('DOMContentLoaded', boot, { once: true });
  if (document.readyState !== 'loading') boot();
}());
