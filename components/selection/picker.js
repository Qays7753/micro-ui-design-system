/* MicroPicker — Arabic-first listbox. Host owns data and the surrounding layer.
   Status and retry are siblings of the listbox, never options.
   init/disconnect are repeatable; destroy releases instance state, not host data. */
(function () {
  'use strict';
  var states = new WeakMap();
  function stateOf(picker) {
    var state = states.get(picker);
    if (!state) {
      state = { status: 'ready', query: '', message: '', listeners: [] };
      states.set(picker, state);
    }
    return state;
  }
  function listOf(picker) { return picker.querySelector('[data-picker-list]'); }
  function optionsOf(picker) {
    var list = listOf(picker);
    return list ? [].slice.call(list.querySelectorAll('.m-picker__option')) : [];
  }
  function searchOf(picker) { return picker.querySelector('[data-picker-search]'); }
  function locked(picker) {
    return picker.getAttribute('aria-disabled') === 'true' || stateOf(picker).status === 'disabled';
  }
  function available(picker) {
    return optionsOf(picker).filter(function (option) {
      return !option.hidden && !option.disabled && option.getAttribute('aria-disabled') !== 'true';
    });
  }
  function listen(picker, element, type, handler) {
    if (!element) return;
    element.addEventListener(type, handler);
    stateOf(picker).listeners.push(function () { element.removeEventListener(type, handler); });
  }
  function safeFocus(picker) {
    var target = searchOf(picker);
    if (!target || target.disabled || target.hidden) {
      target = picker;
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
    }
    target.focus({ preventScroll: true });
  }
  function roving(picker, active) {
    var visible = available(picker);
    var chosen = visible.indexOf(active) >= 0 ? active
      : visible.filter(function (option) { return option.getAttribute('aria-selected') === 'true'; })[0] || visible[0];
    optionsOf(picker).forEach(function (option) {
      option.tabIndex = !locked(picker) && option === chosen ? 0 : -1;
    });
  }
  function summary(picker) {
    var foot = picker.querySelector('[data-picker-summary]');
    var selected = getSelected(picker);
    if (foot) foot.textContent = selected ? 'المحدد: ' + selected.label : 'المحدد: لا شيء';
  }
  function getSelected(picker) {
    var option = optionsOf(picker).filter(function (item) { return item.getAttribute('aria-selected') === 'true'; })[0];
    return option ? { value: option.getAttribute('data-value'), label: option.textContent.trim() } : null;
  }
  function changed(picker, value) {
    picker.dispatchEvent(new CustomEvent('micro-picker:change', {
      bubbles: true, detail: value || { value: null, label: null }
    }));
  }
  function statusNodes(picker) {
    var list = listOf(picker);
    if (!list) return null;
    // Remove the old, invalid listbox-child state when upgrading existing markup.
    [].slice.call(list.querySelectorAll('.m-picker__state')).forEach(function (node) { node.remove(); });
    var status = picker.querySelector('[data-picker-status]');
    if (!status) {
      status = document.createElement('div');
      status.className = 'm-picker__state';
      status.setAttribute('data-picker-status', '');
      list.parentNode.insertBefore(status, list);
    } else if (list.contains(status)) list.parentNode.insertBefore(status, list);
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    var retry = picker.querySelector('[data-picker-retry]');
    if (!retry) {
      retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'm-btn m-btn--secondary';
      retry.setAttribute('data-picker-retry', '');
      retry.textContent = 'إعادة المحاولة';
      list.parentNode.insertBefore(retry, list.nextSibling);
    } else if (list.contains(retry) || status.contains(retry)) {
      list.parentNode.insertBefore(retry, list.nextSibling);
    }
    return { status: status, retry: retry };
  }
  /* R-32 (2026-10-25): تطبيع البحث — توحيد الحالة + تجريد التشكيل (NFD)
     قبل المقارنة كي لا تُنتج البحثات اللاتينية/المشكولة «لا نتائج» كاذبة؛
     مصدر الخيارات نفسه لا يُمس (العرض كما كتبه المستهلك). */
  function normalizeMatch(text) {
    var s = String(text).toLowerCase();
    if (!s.normalize) return s; /* بيئات بلا Intl: مقارنة الحالة فقط (موثق) */
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function apply(picker) {
    var state = stateOf(picker);
    var list = listOf(picker);
    var nodes = statusNodes(picker);
    if (!list || !nodes) return;
    var active = document.activeElement;
    var ownedOption = optionsOf(picker).indexOf(active) >= 0;
    var ready = state.status === 'ready';
    var queryNorm = state.query !== '' ? normalizeMatch(state.query) : '';
    optionsOf(picker).forEach(function (option) {
      var hide = !ready || (queryNorm !== '' && normalizeMatch(option.textContent).indexOf(queryNorm) === -1);
      // Move focus before hiding its owner. Never steal focus from outside options.
      if (hide && option === active) safeFocus(picker);
      option.hidden = hide;
    });
    var defaults = {
      initial: 'لم تُحمّل الخيارات بعد.', loading: 'جارٍ تحميل الخيارات…',
      empty: 'لا خيارات متاحة.', error: 'تعذّر تحميل الخيارات. أعد المحاولة.',
      disabled: 'الاختيار غير متاح حاليًا.'
    };
    var noResult = ready && state.query !== '' && !available(picker).length;
    var noData = ready && !optionsOf(picker).length;
    var message = ready ? (noResult ? 'لا نتائج مطابقة. عدّل كلمة البحث.' : noData ? defaults.empty : '')
      : state.message || defaults[state.status] || '';
    var retryVisible = state.status === 'error' && !locked(picker);
    if (active === nodes.retry && !retryVisible) safeFocus(picker);
    if (nodes.status.textContent !== message) nodes.status.textContent = message;
    nodes.status.hidden = !message;
    nodes.status.classList.toggle('m-picker__state--error', state.status === 'error');
    nodes.retry.hidden = !retryVisible;
    list.setAttribute('aria-busy', state.status === 'loading' ? 'true' : 'false');
    list.setAttribute('aria-disabled', locked(picker) ? 'true' : 'false');
    roving(picker, ownedOption && !active.hidden ? active : null);
  }
  function bind(picker) {
    if (picker.hasAttribute('data-micro-picker-bound') || !listOf(picker)) return;
    picker.setAttribute('data-micro-picker-bound', '1');
    var nodes = statusNodes(picker);
    listen(picker, searchOf(picker), 'input', function () {
      stateOf(picker).query = searchOf(picker).value.trim();
      apply(picker);
    });
    listen(picker, nodes.retry, 'click', function () {
      if (stateOf(picker).status !== 'error' || locked(picker)) return;
      picker.dispatchEvent(new CustomEvent('micro-picker:retry', { bubbles: true }));
    });
    listen(picker, listOf(picker), 'click', function (event) {
      var option = event.target.closest('.m-picker__option');
      if (!option || available(picker).indexOf(option) < 0 || locked(picker)) return;
      optionsOf(picker).forEach(function (item) { item.setAttribute('aria-selected', String(item === option)); });
      summary(picker);
      roving(picker, option);
      changed(picker, getSelected(picker));
    });
    listen(picker, listOf(picker), 'keydown', function (event) {
      var options = available(picker);
      if (!options.length || locked(picker)) return;
      var index = options.indexOf(document.activeElement), next = null;
      var rtl = getComputedStyle(picker).direction === 'rtl';
      if (event.key === 'ArrowDown' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) next = options[(index + 1 + options.length) % options.length];
      else if (event.key === 'ArrowUp' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) next = options[(index - 1 + options.length) % options.length];
      else if (event.key === 'Home') next = options[0];
      else if (event.key === 'End') next = options[options.length - 1];
      if (next) { event.preventDefault(); next.focus(); roving(picker, next); }
    });
    listen(picker, picker.querySelector('[data-picker-close]'), 'click', function () {
      var layer = picker.closest('.m-layer');
      if (layer && window.MicroNavigation) window.MicroNavigation.closeLayer(layer);
      picker.dispatchEvent(new CustomEvent('micro-picker:close', { bubbles: true }));
    });
    apply(picker);
    summary(picker);
  }
  function each(root, fn) {
    var scope = root || document;
    if (scope.matches && scope.matches('[data-micro-picker]')) fn(scope);
    [].slice.call(scope.querySelectorAll('[data-micro-picker]')).forEach(fn);
  }
  function disconnect(picker) {
    stateOf(picker).listeners.splice(0).forEach(function (remove) { remove(); });
    picker.removeAttribute('data-micro-picker-bound');
  }
  window.MicroPicker = {
    init: function (root) { each(root, bind); },
    disconnect: function (root) { each(root, disconnect); },
    destroy: function (root) { each(root, function (picker) { disconnect(picker); states.delete(picker); }); },
    setStatus: function (picker, kind, message) {
      if (['ready', 'loading', 'empty', 'error', 'initial', 'disabled'].indexOf(kind) < 0) return;
      var state = stateOf(picker);
      state.status = kind;
      state.message = typeof message === 'string' ? message : '';
      apply(picker);
    },
    setOptions: function (picker, items) {
      var list = listOf(picker);
      if (!list) return;
      var selected = getSelected(picker), active = document.activeElement;
      var hadFocus = optionsOf(picker).indexOf(active) >= 0;
      var focusedKey = hadFocus ? active.getAttribute('data-value') : null;
      if (hadFocus) safeFocus(picker);
      optionsOf(picker).forEach(function (option) { option.remove(); });
      (items || []).forEach(function (item) {
        var option = document.createElement('button');
        option.type = 'button';
        option.className = 'm-picker__option';
        option.setAttribute('role', 'option');
        option.setAttribute('data-value', String(item.value));
        option.setAttribute('aria-selected', String(!!selected && selected.value === String(item.value)));
        option.textContent = item.label;
        list.appendChild(option);
      });
      var state = stateOf(picker);
      state.status = 'ready'; state.message = '';
      apply(picker); summary(picker);
      var replacement = available(picker).filter(function (option) { return option.getAttribute('data-value') === focusedKey; })[0];
      if (hadFocus && replacement && !locked(picker)) { replacement.focus(); roving(picker, replacement); }
      if (selected && !getSelected(picker)) changed(picker, null);
    },
    clearSelection: function (picker) {
      optionsOf(picker).forEach(function (option) { option.setAttribute('aria-selected', 'false'); });
      summary(picker); roving(picker, document.activeElement); changed(picker, null);
    },
    getSelected: getSelected
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroPicker.init(); });
  if (document.readyState !== 'loading') window.MicroPicker.init();
})();
