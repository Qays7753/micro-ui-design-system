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
      { value: 'waha', label: 'شركة الواحة للخدمات المتكاملة (فرع العاصمة)' },
      { value: 'fawry', label: 'مأمورية فوري (فرع وسط المدينة)' }
    ],
    stress: [
      { value: 'petrol', label: 'شركة البترول الوطنية للتوريدات المتكاملة بفرعها الرئيسي في العاصمة عمّان' },
      { value: 'noor', label: 'مؤسسة النور' },
      { value: 'waha', label: 'شركة الواحة: فرع العاصمة ببيانات عنوان طويلة جدًا بلا مسافات لاختبار التفاف خيار المنتقي' },
      { value: 'fawry', label: 'مأمورية فوري (فرع وسط المدينة)' }
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
      { id: 'od-01', title: 'طلب القهوة العربية', date: '2026-10-07', time: '14:30', statusKey: 'progress', customer: 'مطزاوية الفيصل', note: 'تجهيز صالة الاستقبال' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-10-07', time: '09:00', statusKey: 'done', customer: 'شركة الواحة', note: null },
      { id: 'od-03', title: 'طلب مستلزمات الضيافة', date: '2026-10-08', time: '18:45', statusKey: 'progress', note: 'يشمل أكوابًا ورقية' },
      { id: 'od-04', title: 'طلب تعقيم غرف الاجتماعات', date: '2026-10-09', time: '16:00', statusKey: 'done' },
      { id: 'od-05', title: 'طلب صيانة أجهزة العرض', date: '2026-10-12', time: null, statusKey: 'hold', note: 'بانتظار قطعة الغيار' },
      { id: 'od-06', title: 'طلب تجهيز معرض المنتجات', date: '2026-10-15', time: '12:00', statusKey: 'progress', customer: 'وحدة التسويق' },
      { id: 'od-07', title: 'طلب نقل عفش مكتبي', date: '2026-10-06', time: '15:00', statusKey: 'done', customer: 'فرع الشمال' },
      { id: 'od-08', title: 'طلب عناية حدائق', date: null, time: null, statusKey: 'progress', customer: 'الحديقة الغربية' }
    ],
    stress: [
      { id: 'od-01', title: 'طلب ضيافة استقبال شركة الوفادة المرافقة لوفد المنطقة الغربية مع تجهيز القاعة الرئيسية والمستلزمات الكاملة للفعالية المقامة يوم الخميس القادم بتجهيزات صباحية إضافية', date: '2026-10-07', time: '14:30', statusKey: 'progress', customer: 'قاعة الملتقى', note: 'تجهيز القاعة الرئيسية مع مصليات وضيافة صباحية' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-10-07', time: '09:00', statusKey: 'done', customer: 'شركة الواحة', note: null },
      { id: 'od-03', title: 'طلب مستلزمات الضيافة', date: '2026-10-08', time: '18:45', statusKey: 'progress' },
      { id: 'od-04', title: 'طلب قرطاسية إدارية', date: '2026-10-09', time: '10:30', statusKey: 'done' },
      { id: 'od-05', title: 'طلب صيانة أجهزة العرض', date: '2026-10-12', time: null, statusKey: 'hold' },
      { id: 'od-06', title: 'طلب تجهيز معرض المنتجات', date: '2026-10-15', time: '12:00', statusKey: 'progress', customer: 'وحدة التسويق' },
      { id: 'od-07', title: 'طلب نقل عفش مكتبي', date: '2026-10-06', time: '15:00', statusKey: 'done', customer: 'فرع الشمال' },
      { id: 'od-08', title: 'طلب عناية حدائق الحديقة الغربية الداخلية', date: null, time: null, statusKey: 'progress', customer: 'الحديقة الغربية' }
    ]
  };
  /* حالة العرض المحلية للجدول: نسخة قابلة للتعديل من fixtures فوق
     بيانات العرض نفسها — إضافة/تعديل/حذف محاكاة موسومة لا استمرارية. */
  var ocalDemo = { orders: null, editingId: null, addingFor: null, seq: 100 };

  /* ---------------- الحالة العامة للمتحكم ---------------- */

  /* عقد 2026-10-25: «المعاينة المحمولة» سطح المراجعة الافتراضي (data-view=app)
     — أسطح الفحص (نظرة عامة/مختبر الحالات) تبقى معزولة خلف روابط العمق. */
  var state = { dir: 'rtl', width: 390, fixture: 'normal', filter: 'current', view: 'app' };

  document.addEventListener('DOMContentLoaded', function () {
    renderCatalog();
    document.documentElement.setAttribute('data-theme', 'light');
    qa('[data-showcase-view]').forEach(function (link) {
      link.addEventListener('click', function () {
        setShowcaseView(link.getAttribute('data-showcase-view'));
      });
    });
    window.addEventListener('hashchange', revealDeepLink);
    /* --- 1) بوابة الوصول: معالج عرض محلي حتمي (لا مصادقة/لا شبكة) ---
       R-34 (2026-10-25): نجاح المحاكاة يُعلن بوسم محاكاة العرض في نص
       الرسالة نفسها (message مسار المكوّن الموثق) — لا يُقرأ كدخول حقيقي. */
    var gateway = q('sc-gateway-root');
    if (window.MicroAccessGateway && gateway) {
      window.MicroAccessGateway.init(gateway, {
        onSubmit: function () {
          return new Promise(function (resolve) {
            window.setTimeout(function () {
              resolve({
                authenticated: true,
                message: 'تم الدخول في محاكاة العرض فقط: لا حساب حقيقي ولا اتصال بأي خدمة.'
              });
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

    /* --- 3) جدول الطلبات: عرض محلي حتمي بأفعال مضيف محاكاة ---
       اليوم داخل التقويم نقطة الدخول؛ الإضافة/التعديل/الحذف أحداث
       host-owned يحاكيها محرر داخل الصفحة أدناه بحالة محلية موسومة
       «محاكاة عرض» — لا حفظ ولا شبكة ولا Bottom Sheet ولا زر عائم. */
    var ocalRoot = q('sc-ocal-root');
    var ocalInstance = null;
    if (window.MicroOrderSchedule && ocalRoot) {
      ocalDemo.orders = OCAL_ORDERS[state.fixture].map(function (o) { return o; });
      ocalInstance = window.MicroOrderSchedule.init(ocalRoot, {
        orders: ocalDemo.orders,
        statuses: OCAL_STATUSES,
        today: OCAL_TODAY,
        selectedDate: OCAL_TODAY,
        view: 'calendar',
        calendarView: 'month',
        orderActions: { edit: true, delete: true }
      });
      ['order-schedule:day-select', 'order-schedule:order-open',
        'order-schedule:add-request', 'order-schedule:order-edit-request',
        'order-schedule:order-delete-request'].forEach(function (name) {
        ocalRoot.addEventListener(name, function (e) {
          logEvent(q('sc-ocal-log'), name + ' ' + JSON.stringify(e.detail));
        });
      });
      ocalRoot.addEventListener('order-schedule:add-request', function (e) {
        openOcalEditor({ mode: 'add', date: (e.detail && e.detail.date) || null });
      });
      ocalRoot.addEventListener('order-schedule:order-edit-request', function (e) {
        var order = findOcalOrder(e.detail && e.detail.id);
        if (order) openOcalEditor({ mode: 'edit', order: order });
      });
      ocalRoot.addEventListener('order-schedule:order-delete-request', function (e) {
        removeOcalOrder(e.detail && e.detail.id);
      });
      q('sc-ocal-empty').addEventListener('click', function () { ocalInstance.setData([]); });
      q('sc-ocal-loading').addEventListener('click', function () {
        ocalInstance.setLoading(true);
        window.setTimeout(function () { ocalInstance.setLoading(false); }, 1200);
      });
      q('sc-ocal-error').addEventListener('click', function () {
        ocalInstance.setError(function () {
          ocalInstance.setError(null);
          ocalInstance.setData(ocalDemo.orders);
        });
      });
      q('sc-ocal-restore').addEventListener('click', function () {
        ocalDemo.orders = OCAL_ORDERS[state.fixture].map(function (o) { return o; });
        ocalInstance.setData(ocalDemo.orders);
      });
    }

    function findOcalOrder(id) {
      for (var i = 0; i < ocalDemo.orders.length; i++) {
        if (ocalDemo.orders[i].id === id) return ocalDemo.orders[i];
      }
      return null;
    }

    function removeOcalOrder(id) {
      ocalDemo.orders = ocalDemo.orders.filter(function (o) { return o.id !== id; });
      ocalInstance.setData(ocalDemo.orders);
      logEvent(q('sc-ocal-log'), 'حُذف الطلب محليًا في محاكاة العرض: ' + id);
    }

    /* محرر داخل الصفحة (تركيب حقول B02 القائمة): إضافة/تعديل بحالة
       محلية فقط؛ الحفظ يكتب في ocalDemo.orders ثم setData؛ إلغاء/Escape
       يستعيدان الحالة بلا تغيير. التاريخ للإضافة يأتي من الحدث نفسه. */
    function openOcalEditor(opts) {
      var panel = q('sc-ocal-editor');
      var titleInput = q('sc-ocal-editor-title');
      var timeInput = q('sc-ocal-editor-time');
      var statusSelect = q('sc-ocal-editor-status');
      var noteInput = q('sc-ocal-editor-note');
      var heading = q('sc-ocal-editor-heading');
      var dateLine = q('sc-ocal-editor-date');
      if (!panel || !titleInput) return;
      ocalDemo.editingId = opts.mode === 'edit' ? opts.order.id : null;
      ocalDemo.addingFor = opts.mode === 'add' ? (opts.date || null) : null;
      heading.textContent = opts.mode === 'edit'
        ? 'تعديل طلب (محاكاة عرض محلية)'
        : 'إضافة طلب (محاكاة عرض محلية)';
      dateLine.textContent = opts.mode === 'edit'
        ? 'التاريخ: ' + (opts.order.date || 'غير مجدول')
        : (opts.date ? 'التاريخ: ' + opts.date : 'بلا يوم محدد');
      titleInput.value = opts.mode === 'edit' ? opts.order.title : '';
      timeInput.value = opts.mode === 'edit' && opts.order.time ? opts.order.time : '';
      statusSelect.value = opts.mode === 'edit' ? opts.order.statusKey : 'progress';
      noteInput.value = opts.mode === 'edit' && opts.order.note ? opts.order.note : '';
      panel.hidden = false;
      if (window.MicroFields) window.MicroFields.sync(titleInput.closest('.m-field'));
      titleInput.focus({ preventScroll: false });
    }

    function closeOcalEditor() {
      var panel = q('sc-ocal-editor');
      if (panel) panel.hidden = true;
      ocalDemo.editingId = null;
      ocalDemo.addingFor = null;
      var returnTo = ocalRoot.querySelector('[data-ocal-action="view"][aria-pressed="true"]')
        || ocalRoot.querySelector('[data-ocal-action="view"]');
      if (returnTo) returnTo.focus({ preventScroll: true });
    }

    function saveOcalEditor() {
      var titleInput = q('sc-ocal-editor-title');
      var timeInput = q('sc-ocal-editor-time');
      var statusSelect = q('sc-ocal-editor-status');
      var noteInput = q('sc-ocal-editor-note');
      var title = titleInput.value.trim();
      if (!title) {
        titleInput.setAttribute('aria-invalid', 'true');
        titleInput.focus();
        return;
      }
      titleInput.removeAttribute('aria-invalid');
      var time = TIME_OK(timeInput.value) ? timeInput.value : null;
      var note = noteInput.value.trim() || null;
      if (ocalDemo.editingId) {
        var order = findOcalOrder(ocalDemo.editingId);
        if (order) {
          order.title = title;
          order.time = time;
          order.statusKey = statusSelect.value;
          order.note = note;
        }
        logEvent(q('sc-ocal-log'), 'عُدّل الطلب محليًا في محاكاة العرض: ' + ocalDemo.editingId);
      } else {
        var id = 'demo-' + (++ocalDemo.seq);
        ocalDemo.orders.push({
          id: id,
          title: title,
          date: ocalDemo.addingFor,
          time: time,
          statusKey: statusSelect.value,
          customer: null,
          note: note
        });
        logEvent(q('sc-ocal-log'), 'أُضيف الطلب محليًا في محاكاة العرض: ' + id);
      }
      ocalInstance.setData(ocalDemo.orders);
      closeOcalEditor();
    }

    function TIME_OK(v) {
      return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
    }

    (function bindOcalEditor() {
      var panel = q('sc-ocal-editor');
      if (!panel) return;
      panel.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeOcalEditor();
        }
      });
      q('sc-ocal-editor-save').addEventListener('click', saveOcalEditor);
      q('sc-ocal-editor-cancel').addEventListener('click', closeOcalEditor);
    })();

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

    /* --- 8) تبديل ترتيب دوائر المقارنة — أُزيل مع قرار عرض 2026-10-25:
       دوائر المقاييس استُبدلت في المعرض بصفوف مقاييس مدمجة بنفس المصدر
       (قرار مفاهيم الرسوم باء بالدليل)؛ المكوّن يبقى opt-in في المكتبة --- */

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
    initAppPreview();
    if (window.location.hash) revealDeepLink();
    else setShowcaseView('app');
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
      if (inst) {
        ocalDemo.orders = OCAL_ORDERS[mode].map(function (o) { return o; });
        inst.setData(ocalDemo.orders);
      }
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
    /* عقد 2026-10-25: ثلاثة أسطح — app (المعاينة المحمولة الافتراضية)،
       overview (نظرة عامة)، state (مختبر الحالات). القيم الأخرى تسقط
       إلى الافتراضي الموثق. */
    state.view = (view === 'state' || view === 'overview' || view === 'app') ? view : 'app';
    document.body.setAttribute('data-view', state.view);
    qa('[data-showcase-view]').forEach(function (link) {
      var active = link.getAttribute('data-showcase-view') === state.view;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    var targetFilter = state.view === 'state' ? 'all' : 'current';
    applyFilter(targetFilter);
    /* R-52 (2026-10-25): حالة الضغط لشريط الفلاتر تُزامن مع الفلتر
       المطبق فعليًا — لا يبقى زر «الحالي» مضغوطًا والعناصر كلها ظاهرة */
    var seg = q('sc-filter-seg');
    if (seg) {
      Array.prototype.forEach.call(seg.querySelectorAll('button'), function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-sc-filter') === targetFilter));
      });
    }
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
    /* عقد 2026-10-25: #app يعيد سطح المعاينة المحمولة الافتراضي */
    if (id === 'app' || id === 'app-preview') {
      setShowcaseView('app');
      return;
    }
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

  /* =========================================================
     المعاينة المحمولة النظيفة (عقد 2026-10-25 — السطح الافتراضي)
     تركيب مضيف لمكونات المكتبة الحقيقية ببيانات محلية حتمية:
     الرئيسية/الطلبات/التقارير/حسابي + تسجيل الدخول، وطبقات
     المنتقي/الحوار/التوست من عقود التنقل والرسائل نفسها.
     لا شبكة ولا مصادقة ولا حفظ — نفس حدود العرض الموثقة.
     ========================================================= */

  var APP_TITLES = {
    home: 'الرئيسية',
    orders: 'الطلبات',
    reports: 'التقارير',
    account: 'حسابي',
    signin: 'تسجيل الدخول'
  };

  function initAppPreview() {
    var root = document.getElementById('app-preview');
    if (!root || root.dataset.appInit) return;
    root.dataset.appInit = '1';

    var screens = {};
    qa('[data-app-screen]', root).forEach(function (screen) {
      screens[screen.getAttribute('data-app-screen')] = screen;
    });
    var title = document.getElementById('app-title');
    var backBtn = root.querySelector('[data-app-back]');
    var navItems = qa('[data-app-nav-item]', root);
    var currentScreen = 'home';

    function showScreen(name) {
      if (!screens[name]) return;
      currentScreen = name;
      Object.keys(screens).forEach(function (key) {
        screens[key].hidden = key !== name;
      });
      if (title) title.textContent = APP_TITLES[name] || '';
      if (backBtn) backBtn.hidden = name !== 'signin';
      /* عقد 2026-10-26 (عقد منتج التقويم): لا صورة رمزية على شاشة
         الطلبات/التقويم — تُخفى هناك فقط وتبقى في بقية الشاشات */
      var avatarBtn = root.querySelector('.app-avatar');
      if (avatarBtn) avatarBtn.hidden = (name === 'orders');
      /* شاشة فرعية كاملة العرض: شريط الألسنة يختفي كما في تطبيقات الهاتف */
      root.classList.toggle('app-shell--subscreen', name === 'signin');
      var navKey = name === 'signin' ? 'account' : name;
      navItems.forEach(function (item) {
        var active = item.getAttribute('data-app-nav-item') === navKey;
        if (active) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      });
      /* الرسوم داخل اللوحات المكشوفة حديثًا تُعاد قياسها بعد الظهور */
      if (name === 'reports') refreshReports();
      if (name === 'home') refreshHomeMetric();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    root.__appShowScreen = showScreen;
    root.__appCurrentScreen = function () { return currentScreen; };

    function refreshChartsIn(container) {
      if (!container) return;
      qa('[data-chart]', container).forEach(function (chart) {
        if (window.MicroData) window.MicroData.render(chart);
      });
      qa('[data-main-comparison]', container).forEach(function (metric) {
        if (window.MicroMetricComparison) window.MicroMetricComparison.render(metric);
      });
    }

    function refreshReports() {
      var active = root.querySelector('.app-tabpanel:not([hidden])') || screens.reports;
      refreshChartsIn(active);
    }

    function refreshHomeMetric() {
      refreshChartsIn(screens.home);
    }

    qa('[data-app-goto]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        showScreen(btn.getAttribute('data-app-goto'));
      });
    });
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        showScreen(item.getAttribute('data-app-nav-item'));
      });
    });
    if (backBtn) backBtn.addEventListener('click', function () { showScreen('account'); });

    /* ---- الرسائل: توست + إعلان المعاينة (عقد B06/A2-F05 نفسه) ---- */
    var toast = document.getElementById('app-toast');
    var toastText = document.getElementById('app-toast-text');
    function showToast(text) {
      if (!toast || !window.MicroMessages) return;
      if (toastText) toastText.textContent = text;
      window.MicroMessages.toast(toast);
    }
    function announce(text) {
      if (window.MicroMessages) window.MicroMessages.announce(text, { id: 'app-announce' });
    }

    /* ---- شاشة الطلبات: order-schedule الحقيقي + محرر المضيف ---- */
    var APP_STATUSES = {
      progress: { label: 'قيد التنفيذ', tone: 'progress' },
      done: { label: 'تم التسليم', tone: 'success' },
      hold: { label: 'بانتظار العميل', tone: 'warning' }
    };
    var APP_TODAY = '2026-10-07';
    var appOrders = [
      { id: 'od-01', title: 'طلب القهوة العربية', date: '2026-10-07', time: '14:30', statusKey: 'progress', customer: 'مطزاوية الفيصل', note: 'تجهيز صالة الاستقبال' },
      { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-10-07', time: '09:00', statusKey: 'done', customer: 'شركة الواحة', note: null },
      { id: 'od-03', title: 'طلب مستلزمات الضيافة', date: '2026-10-08', time: '18:45', statusKey: 'progress', note: 'يشمل أكوابًا ورقية' },
      { id: 'od-04', title: 'طلب تعقيم غرف الاجتماعات', date: '2026-10-09', time: '16:00', statusKey: 'done' },
      { id: 'od-05', title: 'طلب صيانة أجهزة العرض', date: '2026-10-12', time: null, statusKey: 'hold', note: 'بانتظار قطعة الغيار' },
      { id: 'od-06', title: 'طلب تجهيز معرض المنتجات', date: '2026-10-15', time: '12:00', statusKey: 'progress', customer: 'وحدة التسويق' },
      { id: 'od-07', title: 'طلب عناية حدائق', date: null, time: null, statusKey: 'progress', customer: 'الحديقة الغربية' }
    ];
    var appDemo = { editingId: null, addingFor: null, supplier: null, pendingDelete: null, seq: 100 };

    var ocalRoot = document.getElementById('app-ocal-root');
    var ocalInstance = null;
    if (ocalRoot && window.MicroOrderSchedule) {
      ocalInstance = window.MicroOrderSchedule.init(ocalRoot, {
        orders: appOrders,
        statuses: APP_STATUSES,
        today: APP_TODAY,
        selectedDate: APP_TODAY,
        view: 'calendar',
        calendarView: 'month',
        orderActions: { edit: true, delete: true }
      });

      function findOrder(id) {
        for (var i = 0; i < appOrders.length; i++) {
          if (appOrders[i].id === id) return appOrders[i];
        }
        return null;
      }

      var editor = document.getElementById('app-ocal-editor');
      var editorHeading = document.getElementById('app-ocal-editor-heading');
      var editorDate = document.getElementById('app-ocal-editor-date');
      var editorTitle = document.getElementById('app-ocal-editor-title');
      var editorTime = document.getElementById('app-ocal-editor-time');
      var editorStatus = document.getElementById('app-ocal-editor-status');
      var editorNote = document.getElementById('app-ocal-editor-note');
      var supplierValue = document.getElementById('app-supplier-value');

      function pad2(n) { return (n < 10 ? '0' : '') + n; }
      /* التاريخ المرئي للمحرر رقمي (عقد الأرقام في سطح المنتج) */
      function numericDate(iso) {
        var p = iso && /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
        return p ? p[3] + '/' + p[2] + '/' + p[1] : null;
      }

      function openEditor(opts) {
        if (!editor) return;
        appDemo.editingId = opts.mode === 'edit' ? opts.order.id : null;
        appDemo.addingFor = opts.mode === 'add' ? (opts.date || null) : null;
        appDemo.supplier = opts.mode === 'edit' ? (opts.order.customer || null) : null;
        if (editorHeading) {
          editorHeading.textContent = opts.mode === 'edit' ? 'تعديل الطلب' : 'إضافة طلب';
        }
        if (editorDate) {
          var d = opts.mode === 'edit' ? opts.order.date : appDemo.addingFor;
          editorDate.textContent = 'التاريخ: ' + (numericDate(d) || 'غير مجدول');
        }
        editorTitle.value = opts.mode === 'edit' ? opts.order.title : '';
        editorTime.value = (opts.mode === 'edit' && opts.order.time) ? opts.order.time : '';
        editorStatus.value = opts.mode === 'edit' ? opts.order.statusKey : 'progress';
        editorNote.value = (opts.mode === 'edit' && opts.order.note) ? opts.order.note : '';
        if (supplierValue) supplierValue.textContent = appDemo.supplier || 'بدون مورد';
        editor.hidden = false;
        if (window.MicroFields) {
          var field = editorTitle.closest('.m-field');
          if (field) window.MicroFields.sync(field);
        }
        editorTitle.focus({ preventScroll: false });
      }

      function closeEditor() {
        if (!editor) return;
        editor.hidden = true;
        var editingId = appDemo.editingId;
        appDemo.editingId = null;
        appDemo.addingFor = null;
        var row = editingId
          ? ocalRoot.querySelector('[data-ocal-id="' + editingId + '"][data-ocal-action="order-row"]')
          : null;
        if (!row) row = ocalRoot.querySelector('[data-ocal-action="add"]');
        if (row && row.focus) row.focus({ preventScroll: true });
      }

      function saveEditor() {
        var title = editorTitle.value.trim();
        if (!title) {
          editorTitle.setAttribute('aria-invalid', 'true');
          editorTitle.focus();
          return;
        }
        editorTitle.removeAttribute('aria-invalid');
        var timeOk = /^([01]\d|2[0-3]):[0-5]\d$/.test(editorTime.value);
        if (appDemo.editingId) {
          var order = findOrder(appDemo.editingId);
          if (order) {
            order.title = title;
            order.time = timeOk ? editorTime.value : null;
            order.statusKey = editorStatus.value;
            order.note = editorNote.value.trim() || null;
            order.customer = appDemo.supplier;
            showToast('تم حفظ تعديل الطلب');
            announce('تم حفظ تعديل الطلب');
          }
        } else {
          appDemo.seq++;
          appOrders.push({
            id: 'app-' + appDemo.seq,
            title: title,
            date: appDemo.addingFor,
            time: timeOk ? editorTime.value : null,
            statusKey: editorStatus.value,
            customer: appDemo.supplier,
            note: editorNote.value.trim() || null
          });
          showToast('أُضيف الطلب إلى جدول اليوم');
          announce('أُضيف الطلب إلى جدول اليوم');
        }
        if (ocalInstance) ocalInstance.setData(appOrders);
        closeEditor();
      }

      if (editor) {
        editor.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeEditor();
          }
        });
        document.getElementById('app-ocal-editor-save').addEventListener('click', saveEditor);
        document.getElementById('app-ocal-editor-cancel').addEventListener('click', closeEditor);
      }

      /* الحوار المركزي لتأكيد الحذف (عقد الطبقات B07 نفسه) */
      var dialogLayer = document.getElementById('app-dialog-layer');
      var dialogText = document.getElementById('app-dialog-text');
      var dialogConfirm = document.getElementById('app-dialog-confirm');
      function openDeleteDialog(order) {
        if (!dialogLayer || !window.MicroNavigation) return;
        appDemo.pendingDelete = order.id;
        if (dialogText) dialogText.textContent = 'سيُحذف «' + order.title + '» من الجدول. لا يمكن التراجع.';
        window.MicroNavigation.openLayer(dialogLayer, {
          trigger: ocalRoot.querySelector('[data-ocal-id="' + order.id + '"][data-ocal-action="order-delete"]'),
          backdropEl: document.querySelector('.m-layer-backdrop[data-for="app-dialog-layer"]')
        });
      }
      if (dialogConfirm) {
        dialogConfirm.addEventListener('click', function () {
          var id = appDemo.pendingDelete;
          if (id) {
            appOrders = appOrders.filter(function (o) { return o.id !== id; });
            if (ocalInstance) ocalInstance.setData(appOrders);
            showToast('حُذف الطلب من الجدول');
            announce('حُذف الطلب من الجدول');
          }
          appDemo.pendingDelete = null;
          if (window.MicroNavigation) window.MicroNavigation.closeLayer(dialogLayer);
        });
      }

      ocalRoot.addEventListener('order-schedule:add-request', function (e) {
        openEditor({ mode: 'add', date: (e.detail && e.detail.date) || null });
      });
      ocalRoot.addEventListener('order-schedule:order-edit-request', function (e) {
        var order = findOrder(e.detail && e.detail.id);
        if (order) openEditor({ mode: 'edit', order: order });
      });
      ocalRoot.addEventListener('order-schedule:order-delete-request', function (e) {
        var order = findOrder(e.detail && e.detail.id);
        if (order) openDeleteDialog(order);
      });
      /* عقد 2026-10-26 (أكورديون داخلي أحادي الفتح): order-open يطلقه
         المكوّن عند فتح صفّ الطلب — لا سطح تفاصيل منفصلًا أسفل
         القائمة بعد الآن؛ التفاصيل وأزرار تعديل/حذف داخل الصف نفسه
         (المحرر وحوار تأكيد الحذف القائمان أعلاه هما سطحا الفعلين). */
    }

    /* ---- منتجقي المورد (عقد المنتقي B03 نفسه) ---- */
    var appPicker = document.getElementById('app-picker');
    var supplierValueEl = document.getElementById('app-supplier-value');
    if (appPicker && window.MicroPicker) {
      window.MicroPicker.setOptions(appPicker, PICKER_DATA.normal);
      appPicker.addEventListener('micro-picker:change', function (e) {
        var label = e.detail && e.detail.label ? e.detail.label : null;
        appDemo.supplier = label;
        if (supplierValueEl) supplierValueEl.textContent = label || 'بدون مورد';
        showToast('تم تحديد المورد');
        /* سلوك تطبيق: الاختيار يغلق طبقة المنتقي ويستعيد تركيز المشغّل */
        var pickerLayer = document.getElementById('app-picker-layer');
        if (pickerLayer && window.MicroNavigation) {
          window.MicroNavigation.closeLayer(pickerLayer);
        }
      });
    }

    /* ---- بوابة الدخول (SPEC-04): معالج محلي حتمي بلا شبكة ---- */
    var gateway = document.getElementById('app-gateway-root');
    if (window.MicroAccessGateway && gateway) {
      window.MicroAccessGateway.init(gateway, {
        onSubmit: function () {
          return new Promise(function (resolve) {
            window.setTimeout(function () {
              resolve({
                authenticated: true,
                message: 'تم تسجيل الدخول في محاكاة العرض فقط: لا حساب حقيقي.'
              });
            }, 600);
          });
        }
      });
      gateway.addEventListener('micro-access:submitted', function (e) {
        var result = e.detail && e.detail.result;
        if (!result || !result.authenticated) return;
        showToast('تم تسجيل الدخول');
        announce('تم تسجيل الدخول');
        showScreen('account');
      });
    }

    var signinOpen = document.getElementById('app-signin-open');
    if (signinOpen) signinOpen.addEventListener('click', function () {
      showScreen('signin');
    });

    /* عقد 2026-10-26 (معرض المكونات الكامل في متناول واضح): صف واحد
       في شاشة حسابي يفتح سطح مختبر الحالات (14 عائلة + 6 متغيرات)
       بلا مراسي مخفية — والعودة عبر رابط «المعاينة المحمولة» في
       رأس المعرض نفسه. */
    var showcaseOpen = document.getElementById('app-showcase-open');
    if (showcaseOpen) showcaseOpen.addEventListener('click', function () {
      setShowcaseView('state');
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    showScreen('home');
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
