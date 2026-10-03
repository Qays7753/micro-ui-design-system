(function () {
  'use strict';
  var action = document.getElementById('demo-action');
  var field = document.getElementById('demo-field');
  var input = document.getElementById('demo-product');
  var message = document.getElementById('field-message');
  var live = document.getElementById('action-status');
  var feedback = document.getElementById('feedback');
  var actionDisabled = false;

  function toggle(control, callback) {
    var enabled = control.getAttribute('aria-pressed') !== 'true';
    control.setAttribute('aria-pressed', String(enabled));
    callback(enabled);
    return enabled;
  }
  function spinner() {
    var node = action.querySelector('.m-btn__spinner');
    if (!node) {
      node = document.createElement('span');
      node.className = 'm-btn__spinner';
      node.setAttribute('aria-hidden', 'true');
      action.appendChild(node);
    }
    return node;
  }
  document.querySelectorAll('[data-command]').forEach(function (control) {
    control.addEventListener('click', function () {
      var command = control.getAttribute('data-command');
      if (command === 'busy') {
        var wasBusy = action.getAttribute('aria-busy') === 'true';
        if (!wasBusy && actionDisabled) {
          control.setAttribute('aria-pressed', 'false');
          live.textContent = 'الزر المعطّل لا يدخل حالة التحميل.';
          return;
        }
        var busy = toggle(control, function (on) {
          spinner();
          action.classList.toggle('is-loading', on);
          action.setAttribute('aria-busy', String(on));
        });
        live.textContent = busy ? 'جارٍ الحفظ — التسمية ومكان المؤشر ثابتان.' : 'انتهى الانتظار؛ عاد الزر إلى حالته الطبيعية.';
      } else if (command === 'pressed') {
        var pressed = toggle(control, function (on) { action.classList.toggle('is-pressed', on); });
        live.textContent = pressed ? 'حالة الضغط معروضة للمقارنة.' : 'عادت حالة الزر إلى الوضع العادي.';
      } else if (command === 'disabled') {
        if (action.getAttribute('aria-busy') === 'true') {
          control.setAttribute('aria-pressed', 'false');
          live.textContent = 'التحميل لا يلغي حلقة التركيز ولا يتحول إلى تعطيل.';
          return;
        }
        var disabled = toggle(control, function (on) { actionDisabled = on; action.disabled = on; });
        live.textContent = disabled ? 'الزر معطّل ولا يستجيب للتفعيل.' : 'أصبح الزر متاحًا.';
      } else if (command === 'invalid') {
        toggle(control, function (on) {
          field.classList.toggle('has-error', on);
          input.setAttribute('aria-invalid', String(on));
          message.classList.add('is-visible');
          message.textContent = on ? 'أدخل اسمًا واضحًا للصنف.' : 'اسم يظهر في قائمة المنتجات.';
        });
      } else if (command === 'readonly') {
        toggle(control, function (on) {
          input.readOnly = on;
          field.classList.toggle('has-readonly', on);
        });
      } else if (command === 'toggle') {
        toggle(control, function () {});
      }
    });
  });
  function showFeedback(kind) {
    feedback.querySelectorAll(':scope > *').forEach(function (node) { node.hidden = true; });
    var target = feedback.querySelector('.' + (kind === 'loading' ? 'm-wait' : kind === 'error' ? 'm-note' : 'm-empty'));
    if (target) target.hidden = false;
  }
  document.querySelectorAll('[data-view]').forEach(function (control) {
    control.addEventListener('click', function () { showFeedback(control.getAttribute('data-view')); });
  });
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  tabs.forEach(function (tab, index) {
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
    tab.addEventListener('click', function () { selectTab(index); });
    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      var rtlStep = event.key === 'ArrowLeft' ? 1 : -1;
      selectTab((index + rtlStep + tabs.length) % tabs.length);
    });
  });
  function selectTab(index) {
    tabs.forEach(function (tab, i) { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    tabs[index].focus();
  }
})();