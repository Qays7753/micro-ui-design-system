/* Access form primitives. No provider, network, or authentication is enabled by default. */
(function () {
  'use strict';

  function setMessage(form, message, tone) {
    var status = form.querySelector('[data-access-status]');
    if (!status) return;
    status.textContent = message || '';
    if (tone) status.setAttribute('data-tone', tone);
    else status.removeAttribute('data-tone');
  }

  function setFieldError(input, message) {
    var field = input.closest('[data-micro-field]');
    if (!field) return;
    var note = field.querySelector('[data-field-msg]');
    field.classList.toggle('has-error', !!message);
    if (note) {
      note.textContent = message || '';
      note.classList.toggle('is-visible', !!message);
    }
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function credential(form, role) {
    return form.querySelector('[data-access-credential="' + role + '"]')
      || form.querySelector('input[name="' + role + '"]');
  }

  /* SUI-R1-01: عقد النتيجة — المستهلك يملك النتيجة والرسالة، والمكوّن لا
     يستنتج دخولًا من مجرد اكتمال المعالج:
     - result.message نص غير فارغ → يُعرض حرفيًا في منطقة الحالة.
     - النبرة: result.tone إن كانت 'info' أو 'error'؛ وإلا 'error' عند
       result.authenticated === false؛ وإلا 'info'.
     - بلا message: result.authenticated === true → نص الدخول المؤكد
       (المستهلك أكّد الدخول صراحة)؛ result.authenticated === false → نص
       عدم الدخول؛ أي نتيجة أخرى (undefined أو كائن بلا مفاتيح معروفة مثل
       {ok:true} أو {handled:true}) → نص محايد صادق لا يدّعي شيئًا.
     المفاتيح message/tone/authenticated اختيارية موثقة في المواصفة —
     ليست مخطط أعمال ملزمًا. الرفض يبقى رسالة الخطأ بنبرة error. */
  function resultOutcome(result, confirmedText, deniedText, neutralText) {
    var hasMessage = !!(result && typeof result.message === 'string' && result.message.trim() !== '');
    var tone = 'info';
    if (result && (result.tone === 'info' || result.tone === 'error')) tone = result.tone;
    else if (result && result.authenticated === false) tone = 'error';
    if (hasMessage) return { text: result.message, tone: tone };
    if (result && result.authenticated === true && confirmedText) return { text: confirmedText, tone: tone };
    if (result && result.authenticated === false && deniedText) return { text: deniedText, tone: tone };
    return { text: neutralText, tone: 'info' };
  }

  function initGateway(gateway, callbacks) {
    if (gateway.hasAttribute('data-access-ready')) {
      gateway.__microAccessCallbacks = callbacks || gateway.__microAccessCallbacks || {};
      return;
    }
    gateway.setAttribute('data-access-ready', '');
    gateway.__microAccessCallbacks = callbacks || {};
    var form = gateway.querySelector('form[data-access-form]');
    if (!form) return;

    var reveal = gateway.querySelector('[data-access-reveal]');
    if (reveal) {
      var targetId = reveal.getAttribute('aria-controls');
      var password = targetId ? document.getElementById(targetId) : credential(form, 'password');
      if (password) {
        reveal.addEventListener('click', function () {
          var showing = password.type === 'password';
          password.type = showing ? 'text' : 'password';
          reveal.setAttribute('aria-pressed', showing ? 'true' : 'false');
          reveal.setAttribute('aria-label', showing ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
          var status = reveal.querySelector('[data-access-reveal-status]');
          if (status) status.textContent = showing ? 'إخفاء' : 'إظهار';
        });
      }
    }

    var recovery = gateway.querySelector('[data-access-recovery]');
    var providers = Array.prototype.slice.call(gateway.querySelectorAll('[data-access-provider]'));
    syncOptional(gateway);
    if (recovery) recovery.addEventListener('click', function () {
      var current = gateway.__microAccessCallbacks || {};
      if (typeof current.onRecovery !== 'function') return;
      Promise.resolve().then(function () { return current.onRecovery(); })
        .then(function (result) {
          /* SUI-013: نص بشري — رسالة المستهلك إن قدمها.
             SUI-R1-01: بلا message لا ندّعي الإرسال من مجرد اكتمال
             المعالج — نص محايد بنبرة info. */
          var hasMessage = !!(result && typeof result.message === 'string' && result.message.trim() !== '');
          var tone = 'info';
          if (result && (result.tone === 'info' || result.tone === 'error')) tone = result.tone;
          else if (hasMessage && result && result.authenticated === false) tone = 'error';
          setMessage(form, hasMessage ? result.message : 'انتهى طلب المساعدة دون تأكيد إرساله.', tone);
        })
        .catch(function (error) { setMessage(form, error && error.message ? error.message : 'تعذّر إرسال طلب المساعدة.', 'error'); });
    });
    providers.forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-access-provider');
        var current = gateway.__microAccessCallbacks || {};
        var handler = current.providers && current.providers[key];
        if (typeof handler !== 'function') return;
        Promise.resolve().then(function () { return handler(); })
          .then(function (result) {
            /* SUI-R1-01: عقد النتيجة — لا نجاح دخول من مجرد اكتمال
               المعالج؛ المستهلك يصرّح بالنتيجة أو تبقى محايدة. */
            var outcome = resultOutcome(result, 'تم الدخول بنجاح.', 'لم يتم الدخول.', 'انتهى الطلب دون نتيجة مؤكدة من التطبيق.');
            setMessage(form, outcome.text, outcome.tone);
          })
          .catch(function (error) { setMessage(form, error && error.message ? error.message : 'تعذّر تنفيذ الدخول.', 'error'); });
      });
    });

    form.addEventListener('input', function () {
      var controls = Array.prototype.slice.call(form.querySelectorAll('input[required]'));
      controls.forEach(function (input) {
        if (input.validity.valid) {
          setFieldError(input, '');
        }
      });
      setMessage(form, '');
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (form.dataset.microAccessBusy === 'true') return;
      var email = credential(form, 'email');
      var passwordInput = credential(form, 'password');
      if (!email || !passwordInput) {
        setMessage(form, 'تعذّر تجهيز نموذج الدخول — تأكد من اكتمال حقوله.', 'error');
        return;
      }
      var controls = [email, passwordInput].filter(Boolean);
      var invalid = controls.filter(function (input) { return !input.checkValidity(); });
      if (invalid.length) {
        invalid.forEach(function (input) {
          var isEmail = input.getAttribute('data-access-credential') === 'email' || input.name === 'email' || input.type === 'email';
          setFieldError(input, isEmail
            ? 'أدخل بريدًا إلكترونيًا صالحًا.'
            : input.validity.valueMissing
              ? 'أدخل كلمة المرور.'
              : input.validity.tooShort && input.minLength > 0
                ? 'أدخل كلمة مرور لا تقل عن ' + input.minLength + ' أحرف.'
                : 'تحقق من كلمة المرور المطلوبة.');
        });
        setMessage(form, 'تحقق من البريد الإلكتروني وكلمة المرور المطلوبة.', 'error');
        /* SUI-014: قناة خطأ واحدة — رسالة المكوّن المرتبطة بالحقل + aria-invalid
           + تركيز الحقل الأول. لا نستدعي reportValidity() فلا فقاعة أصلية
           ثانية بلغة النظام فوق الرسالة العربية (العرض البصري للفقاعة نفسها
           يحتاج متصفحًا مرئيًا — موثق NOT RUN). */
        invalid[0].focus();
        return;
      }
      var current = gateway.__microAccessCallbacks || {};
      if (typeof current.onSubmit !== 'function') {
        /* SUI-013: لغة بشرية بلا مصطلحات داخلية (لا معالج/مستهلك/موصولة) */
        setMessage(form, 'هذه نسخة عرض تجريبية — لن تُرسل بياناتك إلى أي خدمة.', 'info');
        return;
      }
      form.dataset.microAccessBusy = 'true';
      form.setAttribute('aria-busy', 'true');
      var submit = form.querySelector('[type="submit"]');
      if (submit && window.MicroButtons) window.MicroButtons.setLoading(submit, true, { loadingLabel: 'جارٍ تسجيل الدخول' });
      setMessage(form, 'جارٍ التحقق من بيانات الدخول…', 'info');
      Promise.resolve().then(function () {
        return current.onSubmit({
          email: email ? email.value : '',
          password: passwordInput ? passwordInput.value : ''
        });
      }).then(function (result) {
        /* SUI-R1-01: المكوّن يكتب رسالة النتيجة أولًا ثم يُطلق الحدث بعدها —
           فالكلمة الأخيرة فوق منطقة الحالة لمستمع المستهلك ولا تُمسح رسالته
           لاحقًا. النتيجة مسؤولية المستهلك بصياغة بشرية (SUI-013). */
        var outcome = resultOutcome(result, 'تم الدخول بنجاح.', 'لم يتم الدخول.', 'انتهى الطلب دون نتيجة مؤكدة من التطبيق.');
        setMessage(form, outcome.text, outcome.tone);
        form.dispatchEvent(new CustomEvent('micro-access:submitted', { bubbles: true, detail: { result: result } }));
      }).catch(function (error) {
        setMessage(form, error && error.message ? error.message : 'تعذّر تسجيل الدخول — تحقق من بياناتك وحاول مجددًا.', 'error');
      }).then(function () {
        form.dataset.microAccessBusy = 'false';
        form.removeAttribute('aria-busy');
        if (submit && window.MicroButtons) window.MicroButtons.setLoading(submit, false);
      });
    });
  }

  function syncOptional(gateway) {
    var callbacks = gateway.__microAccessCallbacks || {};
    var recovery = gateway.querySelector('[data-access-recovery]');
    if (recovery) recovery.hidden = typeof callbacks.onRecovery !== 'function';
    gateway.querySelectorAll('[data-access-provider]').forEach(function (button) {
      var key = button.getAttribute('data-access-provider');
      button.hidden = !(callbacks.providers && typeof callbacks.providers[key] === 'function');
    });
    var providerGroup = gateway.querySelector('[data-access-providers]');
    if (providerGroup) {
      providerGroup.hidden = !Array.prototype.some.call(
        gateway.querySelectorAll('[data-access-provider]'),
        function (button) { return !button.hidden; }
      );
    }
  }

  function init(root, handlers) {
    var scope = root || document;
    var gateways = [];
    if (scope.matches && scope.matches('[data-access-gateway]')) gateways.push(scope);
    gateways = gateways.concat(Array.prototype.slice.call(scope.querySelectorAll('[data-access-gateway]')));
    gateways.forEach(function (gateway) {
      initGateway(gateway, handlers || gateway.__microAccessCallbacks || {});
      syncOptional(gateway);
    });
  }

  window.MicroAccessGateway = { init: init };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();