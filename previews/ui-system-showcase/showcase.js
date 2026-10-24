/* =========================================================
   Micro UI — متحكم عرض النظام (demo controller)
   الملف: previews/ui-system-showcase/showcase.js
   الحالة: JavaScript عرض فقط — ينشّط حالات المكوّنات الحقيقية
   ببيانات fixtures محلية حتمية. لا شبكة، لا مصادقة، لا حفظ،
   ولا آلة حالة تطبيق جديدة — كل تفاعل يمر عبر عقود المكوّنات
   العامة (Micro* APIs والأحداث) كما وثّقتها المواصفات.

   شريط التحكم أعلى الصفحة يستخدم مكوّن m-seg نفسه (B03)
   وأحداث micro-selection:segment — لا أزرار عرض مخصصة.
   ========================================================= */
(function () {
  'use strict';

  function q(id) { return document.getElementById(id); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function renderCatalog() {
    var catalog = JSON.parse(q('sc-component-catalog').textContent);
    var labels = { 'stable-ui': 'STABLE UI', 'draft-for-review': 'DRAFT FOR REVIEW', proposed: 'PROPOSED' };
    var families = catalog.families, variants = catalog.variants;
    qa('[data-catalog-family]').forEach(function (badge) {
      var id = badge.getAttribute('data-catalog-family'), variant = badge.getAttribute('data-catalog-variant');
      var item = (variant ? variants : families).filter(function (entry) { return entry.id === (variant || id); })[0];
      if (!item || !labels[item.maturity]) throw new Error('Invalid showcase maturity catalog entry');
      badge.textContent = labels[item.maturity];
      var section = badge.closest('.sc-section');
      if (section) section.setAttribute('data-status', item.maturity === 'stable-ui' ? 'current' : item.maturity === 'draft-for-review' ? 'draft' : 'proposed');
    });
    qa('[data-catalog-summary]').forEach(function (node) {
      var stable = families.filter(function (item) { return item.maturity === 'stable-ui'; }).length;
      var draft = families.filter(function (item) { return item.maturity === 'draft-for-review'; }).length;
      node.textContent = families.length + ' عائلة · ' + stable + ' STABLE UI · ' + draft + ' DRAFT FOR REVIEW';
    });
  }

  /* ---------------- Fixtures حتمية محلية ---------------- */

  var PICKER_DATA = {
    normal: [
      { value: 'petrol', label: 'شركة البترول الوطنية' },
      { value: 'noor', label: 'مؤسسة النور للتوريدات' },
      { value: 'waha', label: 'شركة الواحة للخدمات المتكاملة — فرع العاصمة' },
      { value: 'fawry', label: 'مأمورية فوري — فرع وسط المدينة' }
    ],
    stress: [
      { value: 'petrol', label: 'شركة البترول الوطنية للتوريدات المتكاملة بفرعها الرئيسي في العاصمة عمّان' },
      { value: 'noor', label: 'مؤسسة النور' },
      { value: 'waha', label: 'شركة الواحة — فرع العاصمة ببيانات عنوان طويلة جدًا بلا مسافات لاختبار التفاف خيار المنتقي' },
      { value: 'fawry', label: 'مأمورية فوري — فرع وسط المدينة' }
    ]
  };

  var OCAL_STATUSES = {
    progress: { label: 'قيد التنفيذ', tone: 'progress' },
    done: { label: 'تم التسليم', tone: 'success' },
    hold: { label: 'بانتظار العميل', tone: 'warning' }
  };
  var OCAL_TODAY = '2026-10-07';
  var OCAL_ORDERS = {
    normal: [
      { id: 'od-01', title: 'طلب القهوة العربية', date: '2026-10-07', time: '14:30', statusKey: 'progress', customer: 'مطزاوية الفيصل' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-10-07', time: '09:00', statusKey: 'done', customer: 'شركة الواحة' },
      { id: 'od-03', title: 'طلب مستلزمات الضيافة', date: '2026-10-08', time: '18:45', statusKey: 'progress' },
      { id: 'od-04', title: 'طلب تعقيم غرف الاجتماعات', date: '2026-10-09', time: '16:00', statusKey: 'done' },
      { id: 'od-05', title: 'طلب صيانة أجهزة العرض', date: '2026-10-12', time: null, statusKey: 'hold' },
      { id: 'od-06', title: 'طلب تجهيز معرض المنتجات', date: '2026-10-15', time: '12:00', statusKey: 'progress', customer: 'وحدة التسويق' },
      { id: 'od-07', title: 'طلب نقل عفش مكتبي', date: '2026-10-06', time: '15:00', statusKey: 'done', customer: 'فرع الشمال' },
      { id: 'od-08', title: 'طلب عناية حدائق', date: null, time: null, statusKey: 'progress', customer: 'الحديقة الغربية' }
    ],
    stress: [
      { id: 'od-01', title: 'طلب ضيافة استقبال شركة الوفادة المرافقة لوفد المنطقة الغربية مع تجهيز القاعة الرئيسية والمستلزمات الكاملة للفعالية المقامة يوم الخميس القادم بتجهيزات صباحية إضافية', date: '2026-10-07', time: '14:30', statusKey: 'progress', customer: 'قاعة الملتقى' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-10-07', time: '09:00', statusKey: 'done', customer: 'شركة الواحة' },
      { id: 'od-03', title: 'طلب مستلزمات الضيافة', date: '2026-10-08', time: '18:45', statusKey: 'progress' },
      { id: 'od-04', title: 'طلب قرطاسية إدارية', date: '2026-10-09', time: '10:30', statusKey: 'done' },
      { id: 'od-05', title: 'طلب صيانة أجهزة العرض', date: '2026-10-12', time: null, statusKey: 'hold' },
      { id: 'od-06', title: 'طلب تجهيز معرض المنتجات', date: '2026-10-15', time: '12:00', statusKey: 'progress', customer: 'وحدة التسويق' },
      { id: 'od-07', title: 'طلب نقل عفش مكتبي', date: '2026-10-06', time: '15:00', statusKey: 'done', customer: 'فرع الشمال' },
      { id: 'od-08', title: 'طلب عناية حدائق الحديقة الغربية الداخلية', date: null, time: null, statusKey: 'progress', customer: 'الحديقة الغربية' }
    ]
  };

  /* ---------------- الحالة العامة للمتحكم ---------------- */

  var state = { dir: 'rtl', width: 390, fixture: 'normal', filter: 'current', view: 'overview' };

  document.addEventListener('DOMContentLoaded', function () {
    renderCatalog();
    document.documentElement.setAttribute('data-theme', 'light');
    qa('[data-showcase-view]').forEach(function (link) {
      link.addEventListener('click', function () {
        setShowcaseView(link.getAttribute('data-showcase-view'));
      });
    });
    window.addEventListener('hashchange', revealDeepLink);
    /* --- 1) بوابة الوصول: معالج عرض محلي حتمي (لا مصادقة/لا شبكة) --- */
    var gateway = q('sc-gateway-root');
    if (window.MicroAccessGateway && gateway) {
      window.MicroAccessGateway.init(gateway, {
        onSubmit: function () {
          return new Promise(function (resolve) {
            window.setTimeout(function () {
              resolve({ authenticated: true });
            }, 600);
          });
        }
      });
    }

    /* --- 2) المنتقي: بيانات المستهلك fixtures --- */
    var picker = q('sc-picker');
    if (window.MicroPicker && picker) {
      window.MicroPicker.setOptions(picker, PICKER_DATA[state.fixture]);
      picker.addEventListener('micro-picker:change', function (e) {
        q('sc-picker-value').textContent = 'القيمة الحالية: ' + (e.detail && e.detail.label ? e.detail.label : 'لا شيء');
        logEvent(q('sc-picker-log'), 'micro-picker:change ' + JSON.stringify(e.detail));
      });
      picker.addEventListener('micro-picker:retry', function () {
        logEvent(q('sc-picker-log'), 'micro-picker:retry');
      });
    }

    /* --- 3) جدول الطلبات: init صريح بعقد المكوّن --- */
    var ocalRoot = q('sc-ocal-root');
    var ocalInstance = null;
    if (window.MicroOrderSchedule && ocalRoot) {
      ocalInstance = window.MicroOrderSchedule.init(ocalRoot, {
        orders: OCAL_ORDERS[state.fixture],
        statuses: OCAL_STATUSES,
        today: OCAL_TODAY,
        weekStart: 6,
        selectedDate: OCAL_TODAY,
        view: 'calendar',
        calendarView: 'month'
      });
      ['order-schedule:day-select', 'order-schedule:order-open', 'order-schedule:add-request'].forEach(function (name) {
        ocalRoot.addEventListener(name, function (e) {
          logEvent(q('sc-ocal-log'), name + ' ' + JSON.stringify(e.detail));
        });
      });
      q('sc-ocal-view').addEventListener('click', function () {
        var isList = ocalRoot.getAttribute('data-ocal-view') === 'list';
        ocalInstance.setView(isList ? 'calendar' : 'list');
      });
      q('sc-ocal-empty').addEventListener('click', function () { ocalInstance.setData([]); });
      q('sc-ocal-restore').addEventListener('click', function () {
        ocalInstance.setData(OCAL_ORDERS[state.fixture]);
      });
    }

    /* --- 4) أدوات حالة الأزرار --- */
    var btnDemo = q('sc-btn-demo');
    var loading = false, pressed = false, disab = false;
    if (btnDemo && window.MicroButtons) {
      q('sc-btn-loading').addEventListener('click', function () {
        loading = !loading;
        window.MicroButtons.setLoading(btnDemo, loading);
      });
      q('sc-btn-pressed').addEventListener('click', function (e) {
        pressed = !pressed;
        btnDemo.classList.toggle('is-pressed', pressed);
        e.currentTarget.setAttribute('aria-pressed', String(pressed));
      });
      q('sc-btn-disable').addEventListener('click', function (e) {
        disab = !disab;
        btnDemo.disabled = disab;
        e.currentTarget.setAttribute('aria-pressed', String(disab));
      });
    }

    /* --- 5) أدوات حالة الحقول (عقد الحالة الموثق) --- */
    var demoField = q('sc-field-error-demo');
    var demoInput = q('sc-f-demo');
    var demoMsg = demoField ? demoField.querySelector('[data-field-msg]') : null;
    function clearFieldState() {
      if (!demoField) return;
      demoField.classList.remove('has-error', 'has-success');
      if (demoMsg) {
        demoMsg.hidden = true;
        demoMsg.classList.remove('is-visible');
        demoMsg.textContent = '';
      }
      if (demoInput) demoInput.removeAttribute('aria-invalid');
      qa('#sc-fx-error, #sc-fx-success').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    }
    if (demoField) {
      q('sc-fx-error').addEventListener('click', function (e) {
        clearFieldState();
        demoField.classList.add('has-error');
        demoMsg.hidden = false;
        demoMsg.classList.add('is-visible');
        demoMsg.textContent = 'أكمل القيمة المطلوبة ثم أعد التحقق؛ لم تتغير القيمة.';
        demoInput.setAttribute('aria-invalid', 'true');
        e.currentTarget.setAttribute('aria-pressed', 'true');
      });
      q('sc-fx-success').addEventListener('click', function (e) {
        clearFieldState();
        demoField.classList.add('has-success');
        demoMsg.hidden = false;
        demoMsg.classList.add('is-visible');
        demoMsg.textContent = 'تم التحقق من القيمة بنجاح.';
        e.currentTarget.setAttribute('aria-pressed', 'true');
      });
      q('sc-fx-clear').addEventListener('click', clearFieldState);
      demoInput.addEventListener('input', clearFieldState);
    }

    /* --- 6) مفتاح بانتظار (setSwitchPending) --- */
    var swInput = q('sc-switch-input');
    var swState = q('sc-switch-state');
    var pending = false;
    if (swInput && window.MicroSelection) {
      swInput.addEventListener('change', function () {
        pending = true;
        window.MicroSelection.setSwitchPending(swInput, true);
        swState.textContent = 'قيد الحفظ (aria-busy)...';
        window.setTimeout(function () {
          pending = false;
          window.MicroSelection.setSwitchPending(swInput, false);
          swState.textContent = 'تم (تغيير تجريبي)';
        }, 900);
      });
    }

    /* --- 7) toggle عرض --- */
    var toggle = q('sc-toggle-demo');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var on = toggle.getAttribute('aria-pressed') === 'true';
        toggle.setAttribute('aria-pressed', String(!on));
      });
    }

    /* --- 8) تبديل ترتيب دوائر المقارنة --- */
    var circles = q('sc-circles');
    if (circles && window.MicroMetricComparison) {
      q('sc-metric-layout').addEventListener('click', function (e) {
        var overlap = circles.getAttribute('data-layout') === 'overlap';
        circles.setAttribute('data-layout', overlap ? 'separated' : 'overlap');
        window.MicroMetricComparison.render(circles);
        e.currentTarget.setAttribute('aria-pressed', String(!overlap));
      });
    }

    /* --- 9) الرسائل: toast + إعلان + إعادة إظهار الملاحظات --- */
    var toast = q('sc-toast');
    if (toast && window.MicroMessages) {
      q('sc-toast-open').addEventListener('click', function () {
        window.MicroMessages.toast(toast);
      });
      q('sc-announce').addEventListener('click', function () {
        window.MicroMessages.announce('إعلان تجريبي في القناة المهذبة (polite).', { id: 'sc-announce-demo' });
        q('sc-announce-status').textContent = 'أُعلن النص في القناة الحيّة polite بهوية حدث sc-announce-demo (إعادة نفس الهوية خلال 60s لا تكرر الإعلان).';
      });
      ['info', 'success', 'error'].forEach(function (kind) {
        var note = q('sc-note-' + kind);
        var btn = q('sc-note-reopen-' + kind);
        if (note && btn) {
          btn.addEventListener('click', function () { note.hidden = false; });
        }
      });
    }

    /* --- 10) ألسنة: حالة حية --- */
    var tabs = q('sc-tabs');
    if (tabs) {
      tabs.addEventListener('click', function (e) {
        var tab = e.target.closest('[role="tab"]');
        if (!tab) return;
        window.setTimeout(function () {
          q('sc-tabs-status').textContent = 'اللسان المحدد: ' + tab.textContent.trim();
        }, 0);
      });
    }

    /* --- 11) شريط التحكم: m-seg حقيقي يقود المتحكم --- */
    /* F-11 (2026-10-10): صادقية fixture — خانة «كل الخدمات» تبدأ فعلًا في
       الحالة غير المحسومة الموثقة للمكوّن (تسميتها تقول ذلك). إزالتها
       تتم آليًا عند أول تفاعل (سلوك المتصفح الأصيل). */
    var checkGroup = q('sc-check-group');
    if (checkGroup) checkGroup.indeterminate = true;

    function bindSeg(segId, attr, apply) {
      var seg = q(segId);
      if (!seg) return;
      seg.addEventListener('micro-selection:segment', function () {
        /* الحدث يُطلق من جذر m-seg بعد تحديث aria-pressed —
           نقرأ العنصر المحدد الجديد منه (عقد detail.value نصي فقط) */
        var btn = seg.querySelector('[aria-pressed="true"]');
        if (!btn) return;
        apply(btn.getAttribute('data-' + attr));
      });
    }

    bindSeg('sc-dir-seg', 'sc-dir', applyDirection);
    bindSeg('sc-w-seg', 'sc-w', applyWidth);
    bindSeg('sc-fx-seg', 'sc-fixture', applyFixture);
    bindSeg('sc-filter-seg', 'sc-filter', applyFilter);

    applyDirection(state.dir);
    applyWidth(state.width);
    if (window.location.hash) revealDeepLink();
    else setShowcaseView('overview');
  });

  /* ---------------- تطبيقات شريط التحكم ---------------- */

  function applyDirection(dir) {
    state.dir = dir;
    document.documentElement.setAttribute('dir', dir);
    /* الخط: محور الزمن يبقى من سمة الرسم — نحدّثها مع الاتجاه ونعيد التصيير (عقد data-axis-dir) */
    qa('[data-axis-dir]').forEach(function (chart) {
      chart.setAttribute('data-axis-dir', dir);
      if (window.MicroData) window.MicroData.render(chart);
    });
  }

  function applyWidth(w) {
    state.width = parseInt(w, 10);
    var canvas = q('sc-canvas');
    if (canvas) canvas.style.setProperty('--sc-canvas-width', state.width + 'px');
  }

  function applyFixture(mode) {
    state.fixture = mode;
    /* نصوص data-fx-text */
    qa('[data-fx-text]').forEach(function (el) {
      if (el.dataset.fxOriginal === undefined) el.dataset.fxOriginal = el.textContent;
      el.textContent = mode === 'stress' ? el.getAttribute('data-fx-text') : el.dataset.fxOriginal;
    });
    /* قيم input data-fx-value */
    qa('[data-fx-value]').forEach(function (el) {
      if (el.dataset.fxOriginal === undefined) el.dataset.fxOriginal = el.value;
      el.value = mode === 'stress' ? el.getAttribute('data-fx-value') : el.dataset.fxOriginal;
      if (window.MicroFields) window.MicroFields.sync(el.closest('.m-field'));
    });
    /* بيانات الرسوم: template بديل → القائمة الحية → render */
    qa('template[data-fx-alt]').forEach(function (tpl) {
      var live = document.querySelector('[data-fx-live="' + tpl.getAttribute('data-fx-alt') + '"]');
      if (!live) return;
      if (live.dataset.original === undefined) live.dataset.original = live.innerHTML;
      live.innerHTML = mode === 'stress' ? tpl.innerHTML : live.dataset.original;
      var chart = live.closest('[data-chart], [data-chart-packed], [data-metric-circles], [data-main-comparison]');
      if (!chart) return;
      if (chart.hasAttribute('data-chart-packed') && window.MicroPacked) {
        window.MicroPacked.render(chart);
      } else if (chart.hasAttribute('data-chart') && window.MicroData) {
        window.MicroData.render(chart);
      } else if (window.MicroMetricComparison) {
        window.MicroMetricComparison.render(chart);
      }
    });
    /* بدائل القيمة/الأشرطة الثلاثة تعرض المصدر نفسه في المقارنة:
       flat الموصى به، hero المقصود، وcompact. */
    var primaryBars = q('sc-main-metric-flat');
    if (primaryBars && window.MicroMetricComparison) {
      var sourceRows = primaryBars.querySelector('[data-bar-source]');
      ['sc-main-metric', 'sc-main-metric-compact'].forEach(function (id) {
        var variant = q(id);
        var targetRows = variant && variant.querySelector('[data-bar-source]');
        if (!sourceRows || !targetRows) return;
        while (targetRows.firstChild) targetRows.removeChild(targetRows.firstChild);
        Array.prototype.forEach.call(sourceRows.children, function (row) {
          if (row.tagName === 'LI') targetRows.appendChild(row.cloneNode(true));
        });
        window.MicroMetricComparison.render(variant);
      });
    }
    /* المنتقي والجدول */
    var picker = q('sc-picker');
    if (picker && window.MicroPicker) {
      window.MicroPicker.setOptions(picker, PICKER_DATA[mode]);
    }
    var ocalRoot = q('sc-ocal-root');
    if (ocalRoot && window.MicroOrderSchedule) {
      var inst = window.MicroOrderSchedule.getInstance(ocalRoot);
      if (inst) inst.setData(OCAL_ORDERS[mode]);
    }
  }

  function applyFilter(filter) {
    state.filter = filter;
    qa('.sc-section[data-status]').forEach(function (section) {
      var status = section.getAttribute('data-status');
      var show = filter === 'all'
        ? true
        : (filter === 'current' ? status === 'current' : (status === 'draft' || status === 'proposed'));
      section.hidden = !show;
    });
  }

  function setShowcaseView(view) {
    state.view = view === 'state' ? 'state' : 'overview';
    document.body.setAttribute('data-view', state.view);
    qa('[data-showcase-view]').forEach(function (link) {
      var active = link.getAttribute('data-showcase-view') === state.view;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    applyFilter(state.view === 'state' ? 'all' : 'current');
  }

  var hashScrollGeneration = 0;
  function scrollAfterLayout(target) {
    var generation = ++hashScrollGeneration;
    var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(function () {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (generation === hashScrollGeneration && target.isConnected) {
            target.scrollIntoView({ block: 'start', behavior: 'instant' });
          }
        });
      });
    });
  }
  function revealDeepLink() {
    hashScrollGeneration++;
    var raw = window.location.hash.slice(1);
    if (!raw) return;
    var id;
    try { id = decodeURIComponent(raw); } catch (error) { id = raw; }
    if (id === 'sc-canvas') {
      setShowcaseView('overview');
      return;
    }
    if (id === 'state-lab' || id === 'brand-proof') {
      setShowcaseView('state');
      var labTarget = q(id);
      if (labTarget) {
        scrollAfterLayout(labTarget);
      }
      return;
    }
    var target = q(id);
    if (!target) return;
    var section = target.closest ? target.closest('.sc-section') : null;
    if (!section) return;
    setShowcaseView('state');
    scrollAfterLayout(target);
  }

  /* ---------------- سجل أحداث صغير ---------------- */

  function logEvent(list, text) {
    if (!list) return;
    var li = document.createElement('li');
    li.textContent = text;
    list.insertBefore(li, list.firstChild);
    while (list.childNodes.length > 12) list.removeChild(list.lastChild);
  }
})();
