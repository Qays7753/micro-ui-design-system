/* =========================================================
   Micro UI — سلوك مكوّن التنقّل والطبقات (B07)
   الملف: components/navigation/navigation.js
   عقد عام فقط:
   MicroNavigation.openLayer(layerEl, {trigger, backdropEl})
   MicroNavigation.closeLayer(layerEl)
   - تركيز يُدار: التقاط المشغّل قبل نقل التركيز داخل الطبقة،
     أول عنصر تفاعلي عند الفتح، واستعادته عند الإغلاق إلى هدف
     صالح داخل المستند (وليس إلى ابن مخفي).
   - عزل خلفية فعلي (inert على أبناء body خارج الطبقة العليا
     وغشائها — بلا وصول لوحة مفاتيح أو تقنيات مساعدة) + حصر
     Tab/Shift+Tab داخل الطبقة + قفل تمرير الصفحة مع حفظ قيمة
     overflow السابقة واسترجاعها كما كانت.
   - Escape: مستمع واحد على document (مهما تكرر init) يغلق أعلى
     طبقة مرة واحدة؛ الفتح المتكرر لنفس الطبقة آمن (لا تكرار في
     المكدس) والتهيئة المتكررة آمنة.
   - اسم الخيار المعلن = المنفَّذ: backdropEl (مع دعم السمة
     data-backdrop-id على الطبقة، والغشاء data-for="id").
   - سياسة الضغط بالخلفية من سمة data-backdrop على الطبقة
     ("close" الافتراضي للغير المتلف، "keep" للحوار المتلف).
   - إغلاق ظاهر دائمًا (زر) — السحب ليس وسيلة الإغلاق الوحيدة.
   - حركة فتح/إغلاق موصولة بـ shared/motion.css (MOT-01) عبر
     data-closing مع احترام prefers-reduced-motion فعليًا،
     ولا يبقى عنصر مخفي قابلًا للتركيز أثناء الخفوت.
   - تبويبات: [data-tabs] بأسهم وتبديل لوحات مرتبطة aria-controls.
   - لوحة الفلاتر: [data-filter-panel] بعقد تطبيق/مسح/إلغاء يفرّق
     الجاري عن المطبّق. كل input ذو data-filter-key (checkbox أو
     نص/بحث أو select) جزء من العقد نفسه: الجاري يتبع التغيير
     فعليًا (حدث change)، والتطبيق يجمع القيم غير الفارغة، والمسح
     يفرّغ الجميع، والإلغاء يرمي الجاري. تفاصيل initFilterPanel.
   لا هندسة تنقل جديدة ولا شاشات فعلية.
   ========================================================= */

(function () {
  'use strict';

  var openLayers = [];
  var prevOverflow = null;   /* قيمة overflow السابقة على body */
  var inertRestore = [];     /* [{el, inert}] — استرجاع دقيق */
  var escapeBound = false;
  var doc = document;
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function inDocument(el) {
    return !!(el && el.nodeType === 1 && doc.contains(el));
  }

  function isDisabled(el) {
    return el.disabled || el.getAttribute('aria-disabled') === 'true';
  }

  function focusables(layer) {
    return [].slice.call(layer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      if (isDisabled(el)) return false;
      if (typeof el.checkVisibility === 'function') {
        return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  }

  /* ---- عزل الخلفية: inert على أبناء body خارج الطبقة العليا ----
     تبقى منطقة الإعلان الحية والرسائل العابرة متاحة (خارج العزل). */
  function allowedOutside(el) {
    return el.classList.contains('m-live-region') || el.classList.contains('m-toast');
  }

  function applyBackgroundInert() {
    releaseBackgroundInert();
    if (!openLayers.length) return;
    var top = openLayers[openLayers.length - 1];
    [].slice.call(doc.body.children).forEach(function (el) {
      if (el === top.layer || el === top.backdrop) return;
      if (allowedOutside(el)) return;
      inertRestore.push({ el: el, inert: el.inert });
      el.inert = true;
    });
  }

  function releaseBackgroundInert() {
    inertRestore.forEach(function (r) { r.el.inert = r.inert; });
    inertRestore = [];
  }

  /* ---- حصر التركيز داخل الطبقة العليا ---- */
  function bindTrap(layer) {
    if (layer.dataset.microTrapBound) return;
    layer.dataset.microTrapBound = '1';
    layer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !openLayers.length) return;
      if (openLayers[openLayers.length - 1].layer !== layer) return;
      var f = focusables(layer);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      var active = doc.activeElement;
      if (!layer.contains(active)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    });
  }

  function openLayer(layer, options) {
    options = options || {};
    if (!layer || layer.tagName !== 'DIV') return;
    /* فتح متكرر لنفس الطبقة: آمن — إعادة تركيز دون تكرار في المكدس */
    if (openLayers.some(function (o) { return o.layer === layer; })) {
      var cur = focusables(layer)[0];
      if (cur) cur.focus();
      return;
    }
    /* اسم موحد معلن = منفَّذ: options.backdropEl */
    var backdrop = options.backdropEl
      || (layer.getAttribute('data-backdrop-id') ? doc.getElementById(layer.getAttribute('data-backdrop-id')) : null)
      || doc.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    /* التقاط المشغّل قبل نقل التركيز — وإلا يكون الالتقاط ابنًا داخل الطبقة */
    var trigger = options.trigger || doc.activeElement;
    if (!inDocument(trigger) || layer.contains(trigger)) trigger = null;

    layer.hidden = false;
    layer.removeAttribute('data-closing');
    if (backdrop) backdrop.hidden = false;
    if (!openLayers.length) {
      prevOverflow = doc.body.style.overflow; /* حفظ القيمة السابقة */
      doc.body.style.overflow = 'hidden';
    }
    bindTrap(layer);
    var f = focusables(layer);
    var first = layer.querySelector('[data-autofocus]');
    if (!(first && !isDisabled(first) && f.indexOf(first) >= 0)) first = f[0];
    if (first) first.focus();
    openLayers.push({ layer: layer, backdrop: backdrop, trigger: trigger });
    applyBackgroundInert(); /* بعد الإدخال للمكدس — الطبقة العليا مستثناة */
    layer.dispatchEvent(new CustomEvent('micro-navigation:opened', { bubbles: true }));
  }

  function closeLayer(layer) {
    var idx = -1;
    for (var i = 0; i < openLayers.length; i++) {
      if (openLayers[i].layer === layer) { idx = i; break; }
    }
    if (idx < 0) return;
    var entry = openLayers.splice(idx, 1)[0];

    function finish() {
      layer.hidden = true;
      layer.removeAttribute('data-closing');
      if (entry.backdrop) entry.backdrop.hidden = true;
      if (openLayers.length) applyBackgroundInert(); /* بقاء عزل لبقية المكدس */
      else {
        releaseBackgroundInert();
        doc.body.style.overflow = prevOverflow == null ? '' : prevOverflow; /* استرجاع كما كان */
        prevOverflow = null;
      }
      /* استعادة التركيز إلى مشغّل صالح داخل المستند فقط */
      var t = entry.trigger;
      if (t && inDocument(t) && !isDisabled(t) && typeof t.focus === 'function') t.focus();
      layer.dispatchEvent(new CustomEvent('micro-navigation:closed', { bubbles: true }));
    }

    if (layer.hidden) { finish(); return; }
    /* الخفوت: الطبقة غير قابلة للتركيز فورًا (لا عنصر مخفي قابل للتركيز) */
    var reduce = reduceQuery && reduceQuery.matches;
    var instant = reduce || getComputedStyle(layer).transitionDuration === '0s';
    if (instant) { finish(); return; }
    layer.inert = true;
    layer.setAttribute('data-closing', 'true');
    var done = false;
    function onEnd() {
      if (done) return;
      done = true;
      layer.removeEventListener('transitionend', onEnd);
      layer.inert = false;
      finish();
    }
    layer.addEventListener('transitionend', onEnd);
    window.setTimeout(onEnd, 320); /* احتياط لو لم يُطلق transitionend */
  }

  /* فلاتر: عقد الجاري/المطبّق — كل input ذو data-filter-key جزء من العقد */
  function draftInputs(panel) {
    return [].slice.call(panel.querySelectorAll('[data-filter-key]'));
  }

  function inputActive(input) {
    if (input.type === 'checkbox' || input.type === 'radio') return input.checked;
    return String(input.value == null ? '' : input.value).trim() !== '';
  }

  function activeKeys(panel) {
    return draftInputs(panel)
      .filter(inputActive)
      .map(function (i) { return i.getAttribute('data-filter-key'); })
      .filter(function (k) { return k && k !== 'none'; });
  }

  function updateSummary(panel, phase) {
    var summary = panel.querySelector('[data-filter-summary]');
    if (!summary) return;
    var keys = activeKeys(panel);
    summary.textContent = keys.length
      ? phase + ': ' + keys.length + ' فلاتر — ' + keys.join('، ')
      : phase + ': لا فلاتر (العدّاد يخفي 0)';
  }

  function initFilterPanel(panel) {
    if (panel.dataset.microFilterBound) return;
    panel.dataset.microFilterBound = '1';
    var applied = {}; /* المطبّق: آخر قيم أُقرّت — checkbox: true/false، نص: string */
    panel.addEventListener('micro-navigation:opened', function () {
      /* الجاري يبدأ نسخة من المطبّق عند كل فتح — لكل الأنواع */
      draftInputs(panel).forEach(function (input) {
        var key = input.getAttribute('data-filter-key');
        if (Object.prototype.hasOwnProperty.call(applied, key)) {
          if (input.type === 'checkbox') input.checked = applied[key] === true;
          else input.value = typeof applied[key] === 'string' ? applied[key] : '';
        } else if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      updateSummary(panel, 'الجاري');
    });
    /* الملخص يتبع الجاري فعليًا عند أي تغيير (وليس عند الفتح/التطبيق فقط) */
    panel.addEventListener('change', function (e) {
      if (e.target.closest && e.target.closest('[data-filter-key]')) updateSummary(panel, 'الجاري');
    });
    panel.addEventListener('input', function (e) {
      if (e.target.closest && e.target.closest('[data-filter-key][type="search"], [data-filter-key][type="text"]')) {
        updateSummary(panel, 'الجاري');
      }
    });
    var apply = panel.querySelector('[data-filter-apply]');
    if (apply) apply.addEventListener('click', function () {
      applied = {};
      draftInputs(panel).forEach(function (input) {
        var key = input.getAttribute('data-filter-key');
        if (!key || key === 'none') return;
        if (input.type === 'checkbox') applied[key] = input.checked;
        else applied[key] = String(input.value == null ? '' : input.value).trim();
      });
      updateSummary(panel, 'المطبّق');
      panel.__microApplied = Object.assign({}, applied); /* قراءة لاحقة للفحص/المستهلك */
      var count = Object.keys(applied).filter(function (k) {
        return applied[k] === true || (typeof applied[k] === 'string' && applied[k] !== '');
      }).length;
      panel.dispatchEvent(new CustomEvent('micro-navigation:filters-applied', {
        bubbles: true, detail: { applied: Object.assign({}, applied), count: count }
      }));
      closeLayer(panel);
    });
    var clear = panel.querySelector('[data-filter-clear]');
    if (clear) clear.addEventListener('click', function () {
      draftInputs(panel).forEach(function (input) {
        if (input.disabled || input.readOnly) return;
        if (input.type === 'checkbox') input.checked = false;
        else input.value = '';
      });
      updateSummary(panel, 'الجاري');
    });
    var cancel = panel.querySelector('[data-filter-cancel]');
    if (cancel) cancel.addEventListener('click', function () { closeLayer(panel); }); /* يرمي الجاري */
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

  function bindDocumentOnce() {
    /* Escape: مستمع واحد مهما تكرر init — يغلق أعلى طبقة مرة واحدة */
    if (escapeBound) return;
    escapeBound = true;
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openLayers.length) {
        closeLayer(openLayers[openLayers.length - 1].layer);
      }
    });
  }

  function init(root) {
    var scope = root || document;
    bindDocumentOnce();
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
    scope.querySelectorAll('[data-tabs]').forEach(initTabs);
    scope.querySelectorAll('[data-filter-panel]').forEach(initFilterPanel);
  }

  window.MicroNavigation = {
    init: init,
    openLayer: openLayer,
    closeLayer: closeLayer,
    /* قراءة المطبّق الحالي — للفحص والمستهلك */
    appliedFilters: function (panel) {
      return panel && panel.__microApplied ? Object.assign({}, panel.__microApplied) : {};
    }
  };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
