/* C05: mobile command list. Navigation owns modal/focus/inert/scroll/motion. */

import { globalApi } from '../../shared/integrations.js';
import { getLabel, instanceLabelFor, instanceLabelsOf, registerLabels, setInstanceLabels, setLabels as setFamilyLabels } from '../../shared/labels.js';
import { defaults as familyDefaults } from './labels.js';
import { instanceRegistry } from '../../shared/lifecycle.js';

registerLabels('navigation', familyDefaults);
  /* ---- المرحلة 7 / الجولة الثانية R2 — النصوص الافتراضية: تُقرأ من سجل
     النصوص المشترك (shared/labels.js) وقت الاستخدام (لا عند التحميل)
     كي يعمل setLabels؛ العائلة تسجّل نصوصها الافتراضية عند الاستيراد. ---- */
var MICRO_LABELS_FAMILY = 'navigation';
  /* R5 — تخصيص لكل instance عبر السجل المشترك (shared/labels.js): الخريطة
     لكل (جذر، عائلة) فيقرأ النواة وrenderers العائلة الطبقة نفسها. */
  var renderLabels = null;
  function L(key, el) {
    var own = (el && instanceLabelFor(el, MICRO_LABELS_FAMILY)) || renderLabels;
    if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
    return getLabel(MICRO_LABELS_FAMILY, key);
  }
  function withLabels(scope, fn) {
    var previous = renderLabels;
    renderLabels = instanceLabelsOf(scope, MICRO_LABELS_FAMILY);
    try { return fn(); } finally { renderLabels = previous; }
  }
  function applyInstanceLabels(scope, options) {
    if (options && options.labels && typeof options.labels === 'object') {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
    }
  }
  var states = new WeakMap();

  function sheets(root) {
    var scope = root || document;
    var all = [].slice.call(scope.querySelectorAll('.m-action-sheet'));
    if (scope.matches && scope.matches('.m-action-sheet')) all.unshift(scope);
    return all;
  }
  function backdrop(sheet) {
    var id = sheet.getAttribute('data-backdrop-id');
    return id ? document.getElementById(id) : null;
  }
  function initOne(sheet) {
    if (states.has(sheet)) return states.get(sheet);
    if (!globalApi('Navigation') || sheet.tagName !== 'DIV' || !sheet.classList.contains('m-layer')) return null;
    var state = { lifetime: new AbortController(), contextKey: null, pending: null };
    states.set(sheet, state);
    var options = { signal: state.lifetime.signal };
    function deliver(pending) {
      if (states.get(sheet) !== state || state.pending !== pending || !pending.accepted || !pending.closed || pending.queued) return;
      pending.queued = true;
      // Let every closed listener finish before the consumer can open a successor.
      queueMicrotask(function () {
        if (states.get(sheet) !== state || state.pending !== pending) return;
        state.pending = null;
        sheet.dispatchEvent(new CustomEvent('micro-actions:request', {
          bubbles: true, detail: { id: pending.id, contextKey: pending.contextKey }
        }));
      });
    }
    sheet.addEventListener('micro-navigation:opened', function (event) {
      if (event.target === sheet) state.pending = null;
    }, options);
    sheet.addEventListener('micro-navigation:closed', function (event) {
      if (event.target !== sheet || !state.pending) return;
      state.pending.closed = true;
      deliver(state.pending);
    }, options);
    sheet.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('button[data-action-id]') : null;
      if (!button || button.closest('.m-action-sheet') !== sheet || state.pending ||
          button.disabled || button.getAttribute('aria-disabled') === 'true' ||
          button.closest('[hidden], [inert]') || !button.getClientRects().length) return;
      var id = button.getAttribute('data-action-id');
      if (!id || !id.trim()) return;
      var pending = { id: id, contextKey: state.contextKey, accepted: false, closed: false };
      state.pending = pending;
      pending.accepted = globalApi('Navigation').requestClose(sheet, { reason: 'programmatic-request', trigger: button });
      if (!pending.accepted) {
        if (state.pending === pending) state.pending = null;
        return;
      }
      deliver(pending); /* reduced motion may finish before requestClose returns */
    }, options);
    globalApi('Navigation').init(sheet);
    var bd = backdrop(sheet);
    if (bd) globalApi('Navigation').init(bd);
    return state;
  }
  /* العقد الموحد (الجولة الثانية R4): init(root, options?) يعيد instance
     له update/destroy. update يعيد ربط أوراق الأفعال الجديدة تحت الجذر
     (Navigation يبقى مالك الطبقة)؛ destroy يفك كل ورقة وطبقتها. */
  var registry = instanceRegistry();

  export function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
        /* R4 (عقد SPA): المثيل الحي يُعاد كما هو، مع فحص الجذر وربط أي
       عنصر جديد غير مربوط تحته — init متكرر آمن كما في v0.1.0. */
    if (existing) { withLabels(scope, function () { sheets(scope).forEach(initOne); }); return existing; }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد ربط أوراق الأفعال الجديدة تحت الجذر. */
      update: function () { withLabels(scope, function () { sheets(scope).forEach(initOne); }); },
      /** يفك كل ورقة تحت الجذر (ومستمعات Navigation التابعة لها). */
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      },
    };
    withLabels(scope, function () { sheets(scope).forEach(initOne); });
    registry.set(scope, instance);
    return instance;
  }

  export function getInstance(root) {
    return registry.get(root);
  }

  export function destroy(root) {
    var instance = registry.get(root);
    if (instance) instance.destroy();
    else teardown(root || document);
  }
  export function open(sheet, options) {
      if (!sheet || sheet.nodeType !== 1 || !document.contains(sheet) || !sheet.matches('.m-layer.m-action-sheet')) return false;
      var state = initOne(sheet);
      if (!state) return false;
      options = options || {};
      state.pending = null;
      state.contextKey = typeof options.contextKey === 'string' ? options.contextKey : null;
      globalApi('Navigation').openLayer(sheet, { trigger: options.trigger, backdropEl: backdrop(sheet) });
      return true;
    }
  export function close(sheet) { if (states.has(sheet)) globalApi('Navigation').closeLayer(sheet); }
  /* @deprecated منذ 0.2.0 (R-D10): اسم مهمل يبقى في نسخة IIFE فقط حتى
     1.0 — استخدم destroy(root) أو instance.destroy(). */
  export function disconnect(root) {
    destroy(root);
  }

  function teardown(root) {
      sheets(root).forEach(function (sheet) {
        var state = states.get(sheet);
        if (!state) return;
        state.pending = null;
        state.lifetime.abort();
        states.delete(sheet);
        var nav = globalApi('Navigation');
        if (nav) nav.disconnect(sheet);
        var bd = backdrop(sheet);
        if (bd && nav) nav.disconnect(bd);
      });
    }

  /* المرحلة 7 — تخصيص نصوص العائلة: دمج جزئي فوق الافتراضي في سجل
     MicroLabels؛ يسري على التصييرات اللاحقة (النص الثابت في DOM يتحدث
     عند أول render/update بعد التغيير). */
  export function setLabels(partial) {
  setFamilyLabels('navigation', partial);
}
