/* =========================================================
   Micro UI — سلوك مكوّن التنقّل والطبقات (B07)
   الملف: components/navigation/navigation.js
   عقد عام فقط:
   MicroNavigation.openLayer(layerEl, {trigger, backdropEl})
   MicroNavigation.closeLayer(layerEl)
   - تركيز يُدار: أول عنصر تفاعلي في الطبقة عند الفتح، ويُستعاد
     للمشغّل عند الإغلاق.
   - خلفية modal غير تفاعلية (غشاء يمنع الوصول) + قفل تمرير الصفحة.
   - Escape يغلق؛ سياسة الضغط بالخلفية من سمة data-backdrop
     ("close" الافتراضي للغير المتلف، "keep" للحوار المتلف).
   - إغلاق ظاهر دائمًا (زر) — السحب ليس وسيلة الإغلاق الوحيدة.
   - تبويبات: [data-tabs] بأسهم وتبديل لوحات مرتبطة aria-controls.
   - لوحة الفلاتر: [data-filter-panel] بعقد تطبيق/مسح/إلغاء يفرّق
     الجاري عن المطبّق (تفاصيل في initFilterPanel).
   لا هندسة تنقل جديدة ولا شاشات فعلية.
   ========================================================= */

(function () {
  'use strict';

  var openLayers = [];

  function focusables(layer) {
    return [].slice.call(layer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function openLayer(layer, options) {
    options = options || {};
    if (!layer || layer.tagName !== 'DIV') return;
    var backdrop = options.backdrop
      || (layer.getAttribute('data-backdrop-id') ? document.getElementById(layer.getAttribute('data-backdrop-id')) : null)
      || document.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    layer.hidden = false;
    if (backdrop) backdrop.hidden = false;
    document.body.style.overflow = 'hidden'; /* منع التفاعل مع الخلفية وقفل التمرير */
    var f = focusables(layer);
    var first = layer.querySelector('[data-autofocus]') || f[0];
    if (first) first.focus();
    openLayers.push({ layer: layer, backdrop: backdrop, trigger: options.trigger || document.activeElement });
    layer.dispatchEvent(new CustomEvent('micro-navigation:opened', { bubbles: true }));
  }

  function closeLayer(layer) {
    var idx = openLayers.findIndex(function (o) { return o.layer === layer; });
    if (idx < 0) return;
    var entry = openLayers.splice(idx, 1)[0];
    layer.hidden = true;
    if (entry.backdrop) entry.backdrop.hidden = true;
    if (!openLayers.length) document.body.style.overflow = '';
    if (entry.trigger && entry.trigger.focus) entry.trigger.focus(); /* استعادة التركيز للمشغّل */
    layer.dispatchEvent(new CustomEvent('micro-navigation:closed', { bubbles: true }));
  }

  /* فلاتر: عقد الجاري/المطبّق — المستهلك يقرأ المطبق عند التطبيق */
  function initFilterPanel(panel) {
    if (panel.dataset.microFilterBound) return;
    panel.dataset.microFilterBound = '1';
    var applied = {}; /* المطبّق: آخر قيم أُقرّت */
    panel.addEventListener('micro-navigation:opened', function () {
      /* الجاري يبدأ نسخة من المطبّق عند كل فتح */
      panel.querySelectorAll('[data-filter-key]').forEach(function (input) {
        var key = input.getAttribute('data-filter-key');
        if (Object.prototype.hasOwnProperty.call(applied, key)) input.checked = applied[key];
        else if (input.type === 'checkbox') input.checked = false;
      });
      updateSummary(panel, 'الجاري');
    });
    var apply = panel.querySelector('[data-filter-apply]');
    if (apply) apply.addEventListener('click', function () {
      applied = {};
      panel.querySelectorAll('[data-filter-key]').forEach(function (input) {
        if (input.type === 'checkbox') applied[input.getAttribute('data-filter-key')] = input.checked;
      });
      updateSummary(panel, 'المطبّق');
      panel.dispatchEvent(new CustomEvent('micro-navigation:filters-applied', {
        bubbles: true, detail: { applied: Object.assign({}, applied) }
      }));
      closeLayer(panel);
    });
    var clear = panel.querySelector('[data-filter-clear]');
    if (clear) clear.addEventListener('click', function () {
      panel.querySelectorAll('[data-filter-key]').forEach(function (input) { if (input.type === 'checkbox') input.checked = false; });
      updateSummary(panel, 'الجاري');
    });
    var cancel = panel.querySelector('[data-filter-cancel]');
    if (cancel) cancel.addEventListener('click', function () { closeLayer(panel); }); /* يرمي الجاري */
  }

  function updateSummary(panel, phase) {
    var summary = panel.querySelector('[data-filter-summary]');
    if (!summary) return;
    var keys = [].slice.call(panel.querySelectorAll('[data-filter-key]:checked'))
      .map(function (i) { return i.getAttribute('data-filter-key'); })
      .filter(function (k) { return k && k !== 'none'; });
    summary.textContent = keys.length
      ? phase + ': ' + keys.length + ' فلاتر — ' + keys.join('، ')
      : phase + ': لا فلاتر (العدّاد يخفي 0)';
  }

  /* تبويبات المحتوى */
  function initTabs(tabs) {
    if (tabs.dataset.microTabsBound) return;
    tabs.dataset.microTabsBound = '1';
    var items = [].slice.call(tabs.querySelectorAll('[role="tab"]'));
    function select(tab) {
      items.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }
    items.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowLeft') next = items[(i + 1) % items.length];      /* RTL: يسار = التالي */
        else if (e.key === 'ArrowRight') next = items[(i - 1 + items.length) % items.length];
        if (next) { e.preventDefault(); next.focus(); select(next); }
      });
    });
  }

  function init(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-layer-open]').forEach(function (btn) {
      if (btn.dataset.microLayerOpenBound) return;
      btn.dataset.microLayerOpenBound = '1';
      btn.addEventListener('click', function () {
        var layer = document.getElementById(btn.getAttribute('data-layer-open'));
        if (layer) openLayer(layer, { trigger: btn });
      });
    });
    scope.querySelectorAll('[data-layer-close]').forEach(function (btn) {
      if (btn.dataset.microLayerCloseBound) return;
      btn.dataset.microLayerCloseBound = '1';
      btn.addEventListener('click', function () {
        closeLayer(btn.closest('.m-layer'));
      });
    });
    scope.querySelectorAll('.m-layer-backdrop[data-for]').forEach(function (bd) {
      if (bd.dataset.microBackdropBound) return;
      bd.dataset.microBackdropBound = '1';
      bd.addEventListener('click', function () {
        var layer = document.getElementById(bd.getAttribute('data-for'));
        if (!layer) return;
        /* سياسة الضغط بالخلفية من السمة: close (افتراضي) أو keep للمتلف */
        if ((layer.getAttribute('data-backdrop') || 'close') === 'close') closeLayer(layer);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openLayers.length) closeLayer(openLayers[openLayers.length - 1].layer);
    });
    scope.querySelectorAll('[data-tabs]').forEach(initTabs);
    scope.querySelectorAll('[data-filter-panel]').forEach(initFilterPanel);
  }

  window.MicroNavigation = {
    init: init,
    openLayer: openLayer,
    closeLayer: closeLayer
  };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
