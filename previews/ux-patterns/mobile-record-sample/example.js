/* =========================================================
   Micro UI — UX-F03: سلوك المستهلك لتجربة الهاتف الكاملة «العناصر»
   الملف: previews/ux-patterns/mobile-record-sample/example.js
   الحالة: DRAFT FOR RE-REVIEW — سلوك مستهلك للعينة، ليس framework عامًا
   ولا منطق أعمال، ولا يعدّل أي مصدر UI.
   مصدر القواعد: docs/ux/F03-COMPLETE-EXPERIENCE-BRIEF.md §2..9.

   بنية التجربة (سبع وجهات + طبقات B07):
   - بوابة الوصول: بوابة محلية بمعالج محاكاة وطريق سهل للدخول (مزوّد).
   - الرئيسية: سطح بارز + شريط معلومات (نمط كامل) + مقارنة عددية ودوائر
     + أحدث العناصر — كل الأرقام من المخزن الوحيد.
   - العناصر: بحث + لوحة تصفية معتمدة (اتحاد الفئات R2-02) + ترتيب
     + اختيار متعدد وحذف جماعي بتأكيد + حالتا فراغ/لا نتائج.
   - التفاصيل: بيانات محفوظة + صورة أو بديلها + سجل نشاط قابل للطي
     + تعديل وحذف بتأكيد.
   - الإضافة/التعديل: نموذج صفحة كاملة (اسم/فئة/قيمة/كمية/تاريخ/حالة/ملاحظة).
   - التقارير: مقياس قابل للتبديل + شريط peek + أعمدة ودوائر وخط ومقارنة
     + تقدم القيم المعلومة — كلها مشتقة من البيانات فعليًا.
   - الحساب: هوية + إعدادات بمفاتيح ذات أثر فوري محفوظ + خروج للبوابة.

   مصدر الحقيقة:
   - F03Store: العناصر والفئات والإعدادات — كل الصفحات والملخصات والرسوم
     تُشتق منه (لا رقم ثابت في HTML). حفظ محلي عند توفره وجلسي عند
     التعذر؛ وصف البقاء يتبع آخر نتيجة كتابة فعلية (R2-05).
   - formBaseline: أساس النموذج عند الفتح (قيم خام)؛ dirty محور مستقل =
     اختلاف القيم الخام عن الأساس، والعودة للأصل تعيد clean.
   - sending: نسخة إرسال ثابتة عند بدء الحفظ (كل حقول العنصر)؛
     attemptId/readSeq/pickerSession/formEpoch معرفات متزايدة — الردود
     خارج سياقها تُبطل ولا تطبق أبدًا.
   - op: idle | saving | failed | unknown | checking.

   قرارات موثقة (تفصيلها في README.md):
   - (R2-01) سياسة عقد النجاح الناقص: نتيجة saved بلا item لا تعرض
     نجاحًا ولا تفاصيل فارغة — تعود إلى unknown مع بقاء التحقق متاحًا.
     والرد المكرر على محاولة ملتزمة يُتجاهل (لا عنصر ثانٍ ولا رسالة ثانية).
   - (R2-02) التصفية: ضمن بعد الفئة اتحاد المحددات (أ أو ب)، ويجتمع
     مع البحث بعلاقة AND؛ الشارة عدد الفئات المطبقة لا النتائج.
   - (R2-03) المسح الخارجي للمطبق يمر عبر MicroNavigation.setAppliedFilters
     (عقد B07 المحدود الموثق) فيتزامن المطبق الداخلي ومسودة الفتح التالي.
   - (R2-04) نجاح الحفظ: تحديث البيانات فورًا وتبديل العرض ثم كتابة
     رسالة النجاح مرة واحدة في قناة التفاصيل — وإن كانت طبقة مفتوحة
     (وضع المراجعة) عند التأكيد فيُؤجَّل الإعلان إلى إغلاقها ويُكتب
     مرة واحدة في سياق متاح؛ تغيّر السياق قبل الإعلان → يُسقط بسجل.
   - (R1-01/02/05/07) إغلاقات الجولة السابقة محفوظة: واجهة افتراضية
     بلا أدوات، رموز مطابقة للأصول، سياق قراءة مزدوج بإبطال صريح،
     ووضع مراجعة يعمل من الهاتف بلا console.
   - قناة واحدة لكل سياق؛ الحذف بتأكيد يوضح أثره (لا تراجع مزيف) والاستعادة
     المرجعية أدوات وضع المراجعة؛ «تحديد» يجعل ضغط الصف تبديل اختيار.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- العناصر ---------- */
  function q(id) { return document.getElementById(id); }

  var el = {
    views: {
      gateway: q('view-gateway'),
      home: q('view-home'),
      list: q('view-list'),
      detail: q('view-detail'),
      form: q('view-form'),
      reports: q('view-reports'),
      account: q('view-account')
    },
    titles: {
      gateway: q('f03-gateway-title'),
      home: q('f03-home-title'),
      list: q('f03-list-title'),
      detail: q('f03-detail-title'),
      form: q('f03-form-title'),
      reports: q('f03-reports-title'),
      account: q('f03-account-view-title')
    },
    navbar: q('f03-navbar'),
    navItems: {
      home: q('f03-nav-home'),
      list: q('f03-nav-list'),
      reports: q('f03-nav-reports'),
      account: q('f03-nav-account')
    },
    storageLine: q('f03-storage-line'),
    /* بوابة الوصول */
    gatewayRoot: document.querySelector('[data-access-gateway]'),
    /* الرئيسية */
    homeTotal: q('f03-home-total'),
    homeTotalSub: q('f03-home-total-sub'),
    stripCount: q('f03-strip-count'),
    stripUnknown: q('f03-strip-unknown'),
    stripCats: q('f03-strip-cats'),
    homeAdd: q('f03-home-add'),
    homeAll: q('f03-home-all'),
    homeCompare: q('f03-home-compare'),
    homeQty: q('f03-home-qty'),
    homeBarsSrc: q('f03-home-bars-src'),
    homeMetric: q('f03-home-metric'),
    homeCircles: q('f03-home-circles'),
    homeCirclesSrc: q('f03-home-circles-src'),
    homeRecent: q('f03-home-recent'),
    homeRecentEmpty: q('f03-home-recent-empty'),
    homeDist: q('f03-home-dist'),
    /* القائمة */
    listBack: q('f03-list-back'),
    listAdd: q('f03-list-add'),
    searchInput: q('f03-search-input'),
    filterBtn: q('f03-filter-btn'),
    filterCount: q('f03-filter-count'),
    filterLayer: q('f03-filter-layer'),
    filterCats: q('f03-filter-cats'),
    sortSeg: q('f03-sort-seg'),
    selectToggle: q('f03-select-toggle'),
    listResults: q('f03-list-results'),
    listRows: q('f03-list-rows'),
    selectZone: q('f03-select-zone'),
    listEmpty: q('f03-list-empty'),
    listEmptyAdd: q('f03-list-empty-add'),
    listNoResults: q('f03-list-noresults'),
    clearSearch: q('f03-clear-search'),
    clearFilters: q('f03-clear-filters'),
    selectBar: q('f03-select-bar'),
    selectAll: q('f03-select-all'),
    selectCancel: q('f03-select-cancel'),
    selectDelete: q('f03-select-delete'),
    /* التفاصيل */
    detailBack: q('f03-detail-back'),
    detailNote: q('f03-detail-note'),
    detailNoteTitle: q('f03-detail-note-title'),
    detailNoteBody: q('f03-detail-note-body'),
    detailIdentity: q('f03-detail-identity'),
    readName: q('f03-read-name'),
    readCat: q('f03-read-cat'),
    readStatus: q('f03-read-status'),
    readValue: q('f03-read-value'),
    readQty: q('f03-read-qty'),
    readDate: q('f03-read-date'),
    readNote: q('f03-read-note'),
    detailSteps: q('f03-detail-steps'),
    detailEdit: q('f03-detail-edit'),
    detailDelete: q('f03-detail-delete'),
    /* النموذج */
    formBack: q('f03-form-back'),
    formTitle: q('f03-form-title'),
    form: q('f03-form'),
    nameField: q('f03-name-field'),
    name: q('f03-name'),
    nameMsg: q('f03-name-msg'),
    catField: q('f03-cat-field'),
    catTrigger: q('f03-cat-trigger'),
    catValue: q('f03-cat-value'),
    catMsg: q('f03-cat-msg'),
    valueField: q('f03-value-field'),
    value: q('f03-value'),
    valueMsg: q('f03-value-msg'),
    valueHelp: q('f03-value-help'),
    qtyField: q('f03-qty-field'),
    qty: q('f03-qty'),
    qtyMsg: q('f03-qty-msg'),
    dateField: q('f03-date-field'),
    date: q('f03-date'),
    dateMsg: q('f03-date-msg'),
    statusField: q('f03-status-field'),
    statusSeg: q('f03-status-seg'),
    noteField: q('f03-note-field'),
    note: q('f03-note'),
    dirtyHint: q('f03-dirty-hint'),
    opNote: q('f03-op-note'),
    opTitle: q('f03-op-title'),
    opBody: q('f03-op-body'),
    saveBtn: q('f03-save'),
    checkBtn: q('f03-check'),
    /* التقارير */
    repSeg: q('f03-rep-seg'),
    repTotal: q('f03-rep-total'),
    repIncluded: q('f03-rep-included'),
    repBars: q('f03-rep-bars'),
    repBarsTitle: q('f03-rep-bars-title'),
    repBarsData: q('f03-rep-bars-data'),
    repDonut: q('f03-rep-donut'),
    repDonutTitle: q('f03-rep-donut-title'),
    repDonutData: q('f03-rep-donut-data'),
    repLine: q('f03-rep-line'),
    repLineTitle: q('f03-rep-line-title'),
    repLineData: q('f03-rep-line-data'),
    repMetric: q('f03-rep-metric'),
    repHeroLabel: q('f03-rep-hero-label'),
    repHeroNum: q('f03-rep-hero-num'),
    repHeroUnit: q('f03-rep-hero-unit'),
    repBarsSrc: q('f03-rep-bars-src'),
    repKnown: q('f03-rep-known'),
    /* الحساب */
    accountLogout: q('f03-account-logout'),
    accountViewRoot: q('view-account'),
    accountLayer: q('f03-account-layer'),
    /* الطبقات المشتركة */
    catLayer: q('f03-cat-layer'),
    catLayerClose: q('f03-cat-layer-close'),
    picker: q('f03-picker'),
    pickerLive: q('f03-cat-live'),
    dropNote: q('f03-cat-drop-note'),
    dropNoteText: q('f03-cat-drop-note-text'),
    leaveDialog: q('f03-leave-dialog'),
    stayBtn: q('f03-stay'),
    abandonBtn: q('f03-abandon'),
    deleteDialog: q('f03-delete-dialog'),
    deleteText: q('f03-delete-text'),
    deleteConfirm: q('f03-delete-confirm'),
    reviewLayer: q('f03-review-layer'),
    reviewOpen: q('f03-review-open'),
    toast: q('f03-toast'),
    toastText: q('f03-toast-text')
  };
  var pickerSearch = el.picker.querySelector('[data-picker-search]');

  /* ---------- المخزن والموصل (مصدر واحد قابل للاستبدال) ---------- */
  var store = window.F03Store;
  var connector = window.F03Sim.createConnector({ store: store });
  window.F03Sim.bindReviewPanel(el.reviewLayer, connector);

  /* ---------- حالة المستهلك ---------- */
  var state = {
    entered: false,
    view: 'gateway',
    detailId: null,
    detailReturnTo: 'list',       /* مصدر الوصول إلى التفاصيل */
    formMode: 'add',
    formId: null,
    formReturnTo: 'home',         /* وجهة المغادرة بلا حفظ */
    formEpoch: 0,
    baseline: { name: '', category: null, note: '', value: '', quantity: '0', date: '', status: 'draft' },
    draftCategory: null,
    draftStatus: 'draft',
    sending: null,
    attemptId: 0,
    committedAttempt: 0,          /* آخر محاولة التزمت نجاحها (لصد الردود المكررة) */
    readSeq: 0,
    pickerSession: 0,
    activeRead: null,             /* {readId, session, epoch} */
    op: 'idle',
    abandonRequested: false,
    leaveTrigger: null,
    deleteConfirmed: false,
    deleteTarget: null,           /* { ids: [], single: bool } */
    pendingNote: null,            /* (R2-04) إعلان مؤجل إلى سياق متاح */
    catLayerOpen: false,
    dialogOpen: false,
    reviewOpen: false,
    openLayers: 0,
    search: '',
    appliedFilters: {},           /* cat-a/b/c → true/false (اتحاد ضمن الفئة) */
    sortBy: 'recent',
    selecting: false,
    selected: {},                 /* id → true */
    repMetric: 'value',
    settingScenario: 'auto',
    pendingSetting: null,
    pendingSettingTimer: null,
    listScrollY: 0,
    staleIgnored: 0,
    duplicateIgnored: 0,
    events: []
  };

  function logEvent(kind, detail) {
    state.events.push({ t: kind, at: Date.now(), detail: detail || null });
    if (state.events.length > 120) state.events.splice(0, state.events.length - 120);
  }

  /* ---------- أدوات ---------- */
  function isReallyVisible(e) {
    if (!e) return false;
    var cs = window.getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function formatNumber(n) {
    if (n == null || !isFinite(n)) return '—';
    return String(Math.round(n * 100) / 100);
  }

  /* R1-UI20: تنسيق عرض ثابت — المبالغ برقمين عشريين دائمًا والأعداد الصحيحة بلا كسور.
     عرض فقط؛ دقة البيانات المخزنة وقيم data-value/data-max محفوظة كما هي. */
  function formatMoney(n) {
    if (n == null || !isFinite(n)) return '—';
    return (Math.round(n * 100) / 100).toFixed(2);
  }
  function formatCount(n) {
    if (n == null || !isFinite(n)) return '—';
    return String(Math.round(n));
  }
  var AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function formatDateAr(iso) {
    if (!iso) return '—';
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
    if (!m) return String(iso);
    return String(Number(m[3])) + ' ' + AR_MONTHS[Number(m[2]) - 1] + ' ' + m[1];
  }

  function categoryObj(value) {
    if (!value) return null;
    var label = store.categoryLabel(value);
    return label ? { value: value, label: label } : { value: value, label: value };
  }

  function countPhrase(n) {
    if (n === 0) return 'لا عناصر بعد.';
    if (n === 1) return 'عنصر واحد.';
    if (n === 2) return 'عنصران.';
    if (n <= 10) return n + ' عناصر.';
    return n + ' عنصر.';
  }

  /* ---------- تبديل العروض: تركيز وتمرير وnavbar موثقة ---------- */
  var MAIN_VIEWS = ['home', 'list', 'reports', 'account'];

  function showView(name, opts) {
    opts = opts || {};
    if (state.view === 'list' && name !== 'list') {
      state.listScrollY = window.scrollY || 0; /* حفظ سياق القائمة قبل المغادرة */
    }
    Object.keys(el.views).forEach(function (k) { el.views[k].hidden = k !== name; });
    state.view = name;
    logEvent('view:' + name);
    /* navbar للوجهات الأربع الرئيسية فقط — التيار aria-current */
    var isMain = MAIN_VIEWS.indexOf(name) >= 0;
    el.navbar.hidden = !isMain;
    if (isMain) {
      Object.keys(el.navItems).forEach(function (k) {
        if (k === name) el.navItems[k].setAttribute('aria-current', 'page');
        else el.navItems[k].removeAttribute('aria-current');
      });
    }
    if (name === 'home') renderHome();
    if (name === 'list') renderList();
    if (name === 'detail') renderDetail();
    if (name === 'reports') renderReports();
    window.scrollTo(0, 0);
    if (name === 'list' && opts.restoreScroll !== false) {
      window.scrollTo(0, state.listScrollY || 0); /* استعادة موضع التمرير قدر الإمكان */
    }
    if (opts.focus !== false) {
      var target = opts.focusEl || el.titles[name];
      /* preventScroll: التمرير قرار العرض صريحًا أعلاه — لا قفزة تركيز تفسد الاستعادة.
         عنصر داخل inert (طبقة مفتوحة) لا يستقبل التركيز فلا تُسرق من الأداة العليا. */
      if (target) target.focus({ preventScroll: true });
    }
  }

  function renderAll() {
    renderHome();
    renderList();
    renderReports();
    if (state.view === 'detail') renderDetail();
  }

  /* ---------- بوابة الوصول: معالج محاكاة وطريق سهل ---------- */
  function enterApp() {
    state.entered = true;
    logEvent('gateway:entered');
    showView('home', { focusEl: el.titles.home });
  }

  function enterGateway() {
    state.entered = false;
    logEvent('account:logout');
    showView('gateway', { focusEl: el.titles.gateway });
  }

  function bindGateway() {
    if (!el.gatewayRoot || !window.MicroAccessGateway) return;
    var submitArmed = false;
    window.MicroAccessGateway.init(el.gatewayRoot, {
      onSubmit: function () {
        /* محاكاة حتمية: نجاح بعد زمن ثابت — لا مصادقة ولا شبكة */
        return new Promise(function (resolve) {
          window.setTimeout(function () { resolve({ ok: true }); }, 600);
        });
      },
      onRecovery: function () {
        return new Promise(function (resolve) {
          resolve({ message: 'تجربة محلية: لا تُرسل بيانات إلى أي خدمة.' });
        });
      },
      providers: {
        demo: function () {
          /* الطريق السهل: ضغطة واحدة للدخول إلى التجربة */
          enterApp();
          return Promise.resolve({ ok: true });
        }
      }
    });
    el.gatewayRoot.addEventListener('micro-access:submitted', function () {
      if (!state.entered) enterApp();
    });
  }

  /* ---------- الرئيسية: ملخص من البيانات الفعلية فقط ---------- */
  function knownValueSum(items) {
    var sum = 0;
    items.forEach(function (it) { if (typeof it.value === 'number' && isFinite(it.value)) sum += it.value; });
    return sum;
  }

  function renderHome() {
    var items = store.all();
    var total = items.length;
    var cats = store.categories();
    var unknownCount = items.filter(function (it) { return it.value == null; }).length;
    var usedCats = cats.filter(function (c) {
      return items.some(function (it) { return it.category === c.value; });
    }).length;
    var sumValue = knownValueSum(items);
    var sumQty = items.reduce(function (a, it) { return a + (it.quantity || 0); }, 0);
    var settings = store.settings();

    el.homeTotal.textContent = formatMoney(sumValue);
    el.homeTotalSub.textContent = total === 0
      ? 'المجموع يظهر عند إضافة عناصر ذات قيمة.'
      : (unknownCount > 0
        ? 'مجموع قيم ' + (total - unknownCount) + ' عناصر ذات قيمة معلومة — ' +
          (unknownCount === 1 ? 'عنصر واحد' : unknownCount + ' عناصر') + ' بلا قيمة معلومة غير محتسبة.'
        : 'مجموع قيم ' + total + ' عناصر.');

    /* بطاقات شريط المعلومات من البيانات نفسها */
    function card(node, num, unit, label, fmt) {
      var text = fmt(num);
      node.setAttribute('aria-label', label + '، ' + text + ' ' + unit);
      node.querySelector('.m-info-card__number').textContent = text;
      node.querySelector('.m-info-card__unit').textContent = unit;
    }
    card(el.stripCount, total, 'عنصر', 'عدد العناصر', formatCount);
    card(el.stripUnknown, unknownCount, 'عنصر', 'بلا قيمة معلومة', formatCount);
    card(el.stripCats, usedCats, 'فئة', 'فئات قيد الاستخدام', formatCount);

    el.homeAll.textContent = 'عرض جميع العناصر (' + total + ')';

    /* المقارنة العددية: بطل الكمية + صفوف عدّ كل فئة */
    el.homeQty.textContent = formatCount(sumQty);
    el.homeBarsSrc.textContent = '';
    var maxCount = 0;
    cats.forEach(function (c) {
      var n = items.filter(function (it) { return it.category === c.value; }).length;
      if (n > maxCount) maxCount = n;
      var li = document.createElement('li');
      li.setAttribute('data-label', c.label);
      li.setAttribute('data-value', String(n));
      li.setAttribute('data-unit', 'عنصر');
      li.setAttribute('data-period', 'كل الفترات');
      li.setAttribute('data-series', c.value === 'cat-a' ? 'a' : c.value === 'cat-b' ? 'b' : 'c');
      el.homeBarsSrc.appendChild(li);
    });
    if (maxCount > 0) el.homeMetric.setAttribute('data-max', String(maxCount));
    else el.homeMetric.removeAttribute('data-max');
    if (window.MicroMetricComparison) window.MicroMetricComparison.render(el.homeMetric);

    /* الدوائر: قيمة معلومة لكل فئة — الغياب حالة مستقلة لا صفر */
    el.homeCirclesSrc.textContent = '';
    var maxVal = 0;
    cats.forEach(function (c) {
      var inCat = items.filter(function (it) { return it.category === c.value; });
      var li = document.createElement('li');
      li.setAttribute('data-label', c.label);
      li.setAttribute('data-series', c.value === 'cat-a' ? 'a' : c.value === 'cat-b' ? 'b' : 'c');
      if (inCat.length === 0) {
        li.setAttribute('data-state', 'unavailable');
      } else {
        var s = knownValueSum(inCat);
        if (inCat.every(function (it) { return it.value == null; })) {
          li.setAttribute('data-state', 'unavailable');
        } else {
          li.setAttribute('data-value', String(Math.round(s * 100) / 100));
          li.setAttribute('data-display-value', formatMoney(Math.round(s * 100) / 100));
          li.setAttribute('data-unit', 'د.أ');
          if (s > maxVal) maxVal = s;
        }
      }
      el.homeCirclesSrc.appendChild(li);
    });
    if (maxVal > 0) el.homeCircles.setAttribute('data-max', String(Math.ceil(maxVal)));
    else el.homeCircles.removeAttribute('data-max');
    if (window.MicroMetricComparison) window.MicroMetricComparison.render(el.homeCircles);

    /* أثر الإعداد: إظهار/إخفاء قسم المقارنة (أثر تجريبي محفوظ) */
    el.homeCompare.hidden = !settings.showHomeComparison;

    /* أحدث العناصر */
    el.homeRecent.textContent = '';
    var recent = items.slice().sort(function (a, b) { return (b.updatedAt - a.updatedAt) || a.id.localeCompare(b.id); }).slice(0, 3);
    recent.forEach(function (it) { el.homeRecent.appendChild(rowNode(it, false)); });
    el.homeRecentEmpty.hidden = total !== 0;
    el.homeRecent.hidden = total === 0;
  }

  /* صف عرض موحد: هدف فتح واحد (وضع القراءة) أو تبديل اختيار (وضع التحديد) */
  function rowNode(it, withCheck) {
    var li = document.createElement('li');
    if (withCheck) {
      var wrap = document.createElement('span');
      wrap.className = 'f03-row__check';
      var lab = document.createElement('label');
      lab.className = 'm-choice m-choice--check';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.setAttribute('data-choice-item', '');
      cb.setAttribute('data-id', it.id);
      cb.checked = !!state.selected[it.id];
      var box = document.createElement('span');
      box.className = 'm-choice__box';
      box.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
      lab.appendChild(cb);
      lab.appendChild(box);
      wrap.appendChild(lab);
      li.appendChild(wrap);
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'f03-row';
    btn.setAttribute('data-id', it.id);
    if (state.selecting) {
      btn.setAttribute('aria-pressed', state.selected[it.id] ? 'true' : 'false');
      btn.setAttribute('aria-label', (state.selected[it.id] ? 'إلغاء تحديد ' : 'تحديد ') + it.name);
    }
    var body = document.createElement('span');
    body.className = 'f03-row__body';
    var name = document.createElement('span');
    name.className = 'f03-row__name';
    name.textContent = it.name;
    var meta = document.createElement('span');
    meta.className = 'f03-row__meta';
    meta.textContent = (store.categoryLabel(it.category) || '—') + ' · ' + (store.statusLabel(it.status) || '—');
    body.appendChild(name);
    body.appendChild(meta);
    var val = document.createElement('span');
    val.className = 'f03-row__value';
    val.textContent = it.value == null ? '—' : formatMoney(it.value) + ' د.أ'; /* R1-UI20: بلا بادئة مكررة وبنمط ثابت */
    btn.appendChild(body);
    btn.appendChild(val);
    li.appendChild(btn);
    return li;
  }

  /* ---------- القائمة: بحث وتصفية (اتحاد) وترتيب وتحديد ---------- */
  function activeFilterCats() {
    return Object.keys(state.appliedFilters).filter(function (k) { return state.appliedFilters[k] === true; });
  }

  /* (R2-02) اتحاد الفئات المحددة + AND مع البحث */
  function matchesFilters(it) {
    var query = state.search.trim().toLowerCase();
    if (query && (it.name + ' ' + it.note).toLowerCase().indexOf(query) < 0) return false;
    var cats = activeFilterCats();
    if (cats.length && cats.indexOf(it.category) < 0) return false;
    return true;
  }

  function sortItems(items) {
    var list = items.slice();
    if (state.sortBy === 'name') {
      list.sort(function (a, b) { return a.name.localeCompare(b.name, 'ar') || a.id.localeCompare(b.id); });
    } else if (state.sortBy === 'value') {
      list.sort(function (a, b) {
        var av = a.value == null ? -Infinity : a.value;
        var bv = b.value == null ? -Infinity : b.value;
        return (bv - av) || a.id.localeCompare(b.id); /* المجهول آخرًا — لا يُعتبر صفرًا */
      });
    } else {
      list.sort(function (a, b) { return (b.updatedAt - a.updatedAt) || a.id.localeCompare(b.id); });
    }
    return list;
  }

  function renderList() {
    var items = store.all();
    var filtered = sortItems(items.filter(matchesFilters));
    el.listRows.textContent = '';
    filtered.forEach(function (it) { el.listRows.appendChild(rowNode(it, state.selecting)); });

    var isNoData = items.length === 0;
    var isNoMatch = !isNoData && filtered.length === 0;
    el.listEmpty.hidden = !isNoData;
    el.listNoResults.hidden = !isNoMatch;
    el.listRows.hidden = isNoData || isNoMatch;
    el.listResults.hidden = isNoData;
    el.listResults.textContent = 'النتائج: ' + filtered.length;
    el.clearSearch.hidden = state.search.trim() === '';
    el.clearFilters.hidden = activeFilterCats().length === 0;
    updateFilterCounter();
    syncSelectionUI(filtered);
  }

  function updateFilterCounter() {
    var n = activeFilterCats().length;
    el.filterCount.textContent = String(n);
    el.filterCount.hidden = n === 0;
    el.filterCount.classList.toggle('m-btn__counter--zero', n === 0);
    el.filterBtn.setAttribute('aria-label', n === 0
      ? 'تصفية، لا فلاتر مطبقة'
      : (n === 1 ? 'تصفية، فلتر واحد مطبق' : 'تصفية، ' + n + ' فلاتر مطبقة'));
  }

  function buildFilterCats() {
    el.filterCats.textContent = '';
    store.categories().forEach(function (c) {
      var lab = document.createElement('label');
      lab.className = 'm-choice m-choice--check';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('data-filter-key', c.value);
      input.setAttribute('data-filter-label', c.label);
      var box = document.createElement('span');
      box.className = 'm-choice__box';
      box.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
      var text = document.createElement('span');
      text.className = 'm-choice__text';
      text.textContent = c.label;
      lab.appendChild(input);
      lab.appendChild(box);
      lab.appendChild(text);
      el.filterCats.appendChild(lab);
    });
  }

  el.filterBtn.addEventListener('click', function () {
    window.MicroNavigation.openLayer(el.filterLayer, { trigger: el.filterBtn });
  });

  el.filterLayer.addEventListener('micro-navigation:filters-applied', function (e) {
    state.appliedFilters = Object.assign({}, (e.detail && e.detail.applied) || {});
    logEvent('filters:applied', { count: e.detail && e.detail.count });
    renderList();
  });

  /* (R2-03) المسح الخارجي يمر بعقد B07 المحدود: يزامن المطبق الداخلي
     ومسودة الفتح التالي — لا تضارب بين نسخة العرض والمتغير المعاد */
  function clearAllFiltersExternal() {
    state.appliedFilters = {};
    window.MicroNavigation.setAppliedFilters(el.filterLayer, {});
    logEvent('filters:cleared-external');
    renderList();
  }

  el.searchInput.addEventListener('input', function () {
    state.search = el.searchInput.value;
    renderList();
  });
  el.clearSearch.addEventListener('click', function () {
    el.searchInput.value = '';
    state.search = '';
    renderList();
    el.searchInput.focus();
  });
  el.clearFilters.addEventListener('click', clearAllFiltersExternal);

  /* الترتيب: مقطّع معتمد — التغيير يعد القائمة من البيانات نفسها */
  el.sortSeg.addEventListener('micro-selection:segment', function (e) {
    var v = e.detail && e.detail.value;
    if (['recent', 'name', 'value'].indexOf(v) >= 0) {
      state.sortBy = v;
      logEvent('list:sort', { by: v });
      renderList();
    }
  });

  /* وضع التحديد: أهداف منفصلة — ضغط الصف يبدل الاختيار في هذا الوضع */
  el.selectToggle.addEventListener('click', function () {
    setSelecting(!state.selecting);
  });
  el.selectCancel.addEventListener('click', function () {
    setSelecting(false);
  });

  function setSelecting(on) {
    state.selecting = on;
    if (!on) state.selected = {};
    el.selectToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.selectZone.classList.toggle('f03-selecting', on);
    logEvent('list:selecting', { on: on });
    renderList();
    if (on) el.selectAll.focus();
    else el.selectToggle.focus();
  }

  el.listRows.addEventListener('click', function (e) {
    var row = e.target.closest('.f03-row');
    if (!row) return;
    if (state.selecting) {
      var cb = row.parentElement.querySelector('input[data-choice-item]');
      if (cb) {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }
    openDetail(row.getAttribute('data-id'), { from: 'list' });
  });
  el.homeRecent.addEventListener('click', function (e) {
    var row = e.target.closest('.f03-row');
    if (row) openDetail(row.getAttribute('data-id'), { from: 'home' });
  });

  /* مزامنة التحديد: العدّاد والشريط من الحالة الفعلية. عقد المكوّن:
     micro-selection:changed يُطلق على مسار «تحديد الكل»، وتغييرات العناصر
     الفردية أحداث change أصلية — كلاهما يزامن الحالة نفسها idempotent */
  function syncSelectionFromDOM() {
    var checked = {};
    el.selectZone.querySelectorAll('input[data-choice-item]').forEach(function (cb) {
      if (cb.checked) checked[cb.getAttribute('data-id')] = true;
    });
    state.selected = checked;
    syncSelectionUI(null);
  }
  el.selectZone.addEventListener('micro-selection:changed', syncSelectionFromDOM);
  el.selectZone.addEventListener('change', function (e) {
    if (e.target && e.target.matches && e.target.matches('input[data-choice-item]')) {
      syncSelectionFromDOM();
    }
  });

  function selectedCount() {
    return Object.keys(state.selected).filter(function (k) { return state.selected[k]; }).length;
  }

  function syncSelectionUI(filtered) {
    if (state.selecting) {
      el.selectBar.hidden = false;
      var n = selectedCount();
      el.selectDelete.disabled = n === 0;
      el.selectDelete.setAttribute('aria-label', n === 0
        ? 'حذف المحدد — لا صفوف محددة'
        : (n === 1 ? 'حذف العنصر المحدد' : 'حذف ' + n + ' عناصر محددة'));
      el.selectDelete.textContent = n === 0 ? 'حذف المحدد' : 'حذف المحدد (' + n + ')';
      /* تزامن الحامل الكل مع الحالة الفعلية بعد أي إعادة بناء صفوف */
      var boxes = [].slice.call(el.selectZone.querySelectorAll('input[data-choice-item]'));
      var c = boxes.filter(function (b) { return b.checked; }).length;
      el.selectAll.checked = boxes.length > 0 && c === boxes.length;
      el.selectAll.indeterminate = c > 0 && c < boxes.length;
    } else {
      el.selectBar.hidden = true;
    }
  }

  /* الحذف الجماعي: تأكيد يوضح الأثر — لا تراجع مزيف (UX-04) */
  el.selectDelete.addEventListener('click', function () {
    var ids = Object.keys(state.selected).filter(function (k) { return state.selected[k]; });
    if (!ids.length) return;
    requestDelete(ids, false, el.selectDelete);
  });

  /* ---------- التفاصيل ---------- */
  var PHOTO_SRC = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
    '<rect width="96" height="96" rx="20" fill="#DFEEE6"/>' +
    '<circle cx="48" cy="38" r="14" fill="none" stroke="#164D59" stroke-width="3"/>' +
    '<path d="M20 78c8-16 18-24 28-24s20 8 28 24" fill="none" stroke="#164D59" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>'
  );
  var BROKEN_PHOTO_SRC = 'data:text/plain,broken-for-fallback-demo'; /* نوع غير صوري → خطأ فك ترميز حتمي بلا طلب شبكة */

  function clearDetailNote() {
    el.detailNote.hidden = true;
    el.detailNote.setAttribute('data-detail-state', 'idle');
    el.detailNoteTitle.textContent = '';
    el.detailNoteBody.textContent = '';
  }

  function setDetailNote(variant, title, body) {
    el.detailNote.hidden = false;
    el.detailNote.className = 'm-note m-note--' + variant + ' f03-detail-note';
    el.detailNote.setAttribute('data-detail-state', variant);
    el.detailNoteTitle.textContent = title;
    el.detailNoteBody.textContent = body;
  }

  /* (R2-04) الإعلان يُكتب فقط في سياق متاح فعليًا؛ وإلا يُؤجَّل مرة واحدة */
  function contextAllowsNote() {
    return !el.detailNote.closest('[inert]');
  }

  function writeDetailNoteOnce(title, body) {
    if (!contextAllowsNote()) {
      state.pendingNote = { title: title, body: body };
      logEvent('note:deferred', { reason: 'inert-layer' });
      return;
    }
    setDetailNote('success', title, body);
    logEvent('note:written', { context: 'detail' });
  }

  function flushPendingNote() {
    if (!state.pendingNote) return;
    if (state.view !== 'detail') {
      state.pendingNote = null;
      logEvent('note:dropped', { reason: 'context-changed' });
      return;
    }
    if (!contextAllowsNote()) return;
    setDetailNote('success', state.pendingNote.title, state.pendingNote.body);
    state.pendingNote = null;
    logEvent('note:written', { context: 'detail', deferred: true });
  }

  function statusBadge(status) {
    var b = document.createElement('span');
    var variant = status === 'ready' ? 'success' : status === 'stopped' ? 'warning' : 'info';
    b.className = 'm-badge m-badge--' + variant;
    var dot = document.createElement('span');
    dot.className = 'm-badge__dot';
    b.appendChild(dot);
    b.appendChild(document.createTextNode(store.statusLabel(status) || '—'));
    return b;
  }

  function renderDetail() {
    var item = state.detailId ? store.get(state.detailId) : null;
    el.detailIdentity.textContent = '';
    if (!item) {
      el.readName.textContent = '—';
      el.readCat.textContent = '—';
      el.readStatus.textContent = '—';
      el.readValue.textContent = '—';
      el.readQty.textContent = '—';
      el.readDate.textContent = '—';
      el.readNote.textContent = '—';
      el.detailSteps.textContent = '';
      return;
    }
    /* صورة أو بديلها: img مع fallback، أو أحرف مباشرة بلا img */
    el.detailIdentity.className = 'm-identity f03-detail-id';
    if (item.photo) {
      var img = document.createElement('img');
      img.src = PHOTO_SRC;
      img.alt = 'صورة العنصر';
      img.setAttribute('data-avatar-fallback', '');
      img.className = 'm-identity__img';
      el.detailIdentity.appendChild(img);
      /* الصورة تُبنى ديناميكيًا بعد إقلاع المكوّن: init يعيد الربط بأمان
         (حارس microAvatarBound) ليعمل بديل الأحرف عند فشل المصدر لاحقًا */
      if (window.MicroOrganization) window.MicroOrganization.init(el.detailIdentity);
    } else {
      var ini = document.createElement('span');
      ini.className = 'm-identity__initials';
      ini.setAttribute('aria-hidden', 'true');
      /* نفس عقد المكوّن: حرفا أول كلمتين من الاسم */
      ini.textContent = item.name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('') || '؟';
      el.detailIdentity.appendChild(ini);
    }
    var nameSpan = document.createElement('span');
    nameSpan.className = 'm-identity__name';
    nameSpan.textContent = item.name;
    el.detailIdentity.appendChild(nameSpan);

    el.readName.textContent = item.name;
    el.readCat.textContent = store.categoryLabel(item.category) || '—';
    el.readStatus.textContent = '';
    el.readStatus.appendChild(statusBadge(item.status));
    el.readValue.textContent = item.value == null
      ? '— (قيمة مجهولة)'
      : formatMoney(item.value) + ' د.أ';
    el.readQty.textContent = formatNumber(item.quantity) + ' وحدة';
    el.readDate.textContent = formatDateAr(item.date);
    el.readNote.textContent = item.note === '' ? '—' : item.note;

    /* سجل النشاط من حقول العنصر الفعلية — لا تاريخ مُختلق */
    el.detailSteps.textContent = '';
    var steps = [
      { cls: 'complete', title: 'سُجّل العنصر', time: item.date || '—' },
      { cls: 'current', title: 'الحالة الحالية: ' + (store.statusLabel(item.status) || '—'), time: '' }
    ];
    steps.forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'm-step m-step--' + s.cls;
      var rail = document.createElement('span');
      rail.className = 'm-step__rail';
      var marker = document.createElement('span');
      marker.className = 'm-step__marker';
      rail.appendChild(marker);
      var text = document.createElement('span');
      text.className = 'm-step__text';
      var t1 = document.createElement('span');
      t1.className = 'm-step__title';
      t1.textContent = s.title;
      text.appendChild(t1);
      if (s.time) {
        var t2 = document.createElement('span');
        t2.className = 'm-step__time';
        t2.textContent = s.time;
        text.appendChild(t2);
      }
      li.appendChild(rail);
      li.appendChild(text);
      el.detailSteps.appendChild(li);
    });
  }

  function openDetail(id, opts) {
    opts = opts || {};
    state.detailId = id;
    state.detailReturnTo = opts.from === 'home' ? 'home' : 'list';
    clearDetailNote();
    showView('detail');
  }

  el.detailBack.addEventListener('click', function () {
    /* الرجوع يعيد إلى مصدر الوصول مع سياق القائمة (بحث/تصفية/تمرير) */
    showView(state.detailReturnTo === 'home' ? 'home' : 'list');
  });

  el.detailEdit.addEventListener('click', function () {
    clearDetailNote(); /* سياق تعديل جديد: رسالة النجاح السابقة انتهى سببها */
    openForm({ mode: 'edit', id: state.detailId });
  });

  el.detailDelete.addEventListener('click', function () {
    var item = state.detailId ? store.get(state.detailId) : null;
    if (!item) return;
    requestDelete([item.id], true, el.detailDelete);
  });

  /* ---------- الحذف بتأكيد: حوار واحد للفردي والجماعي ---------- */
  function requestDelete(ids, single, trigger) {
    state.deleteConfirmed = false;
    state.deleteTarget = { ids: ids, single: single };
    el.deleteText.textContent = single
      ? 'سيُحذف «' + (store.get(ids[0]) || { name: '—' }).name + '» من هذه التجربة، ولا يمكن التراجع عن الحذف بعد التأكيد.'
      : 'سيُحذف ' + ids.length + (ids.length === 1 ? ' عنصر' : ' عناصر') + ' من هذه التجربة، ولا يمكن التراجع عن الحذف بعد التأكيد.';
    window.MicroNavigation.openLayer(el.deleteDialog, { trigger: trigger });
  }

  el.deleteConfirm.addEventListener('click', function () {
    state.deleteConfirmed = true;
    window.MicroNavigation.closeLayer(el.deleteDialog);
  });

  el.deleteDialog.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.deleteDialog) return;
    if (!state.deleteConfirmed || !state.deleteTarget) return;
    var target = state.deleteTarget;
    state.deleteConfirmed = false;
    state.deleteTarget = null;
    var removed = 0;
    target.ids.forEach(function (id) { if (store.deleteById(id)) removed += 1; });
    logEvent('delete:done', { count: removed, single: target.single });
    state.selected = {};
    if (state.selecting) setSelecting(false); /* إنجاز الفعل الجماعي يغادر وضع التحديد */
    if (state.view === 'detail') {
      showView(state.detailReturnTo === 'home' ? 'home' : 'list');
    } else {
      renderAll();
    }
    showToast(removed === 1 ? 'تم حذف العنصر.' : 'تم حذف ' + removed + ' عناصر.');
  });

  function showToast(text) {
    el.toastText.textContent = text;
    window.MicroMessages.toast(el.toast, { duration: 4000 });
    logEvent('toast:shown', { text: text });
  }

  /* ---------- إضافة/تعديل: فتح النموذج من المصدر الواحد ---------- */
  function rawBaseline(item) {
    return item
      ? {
          name: item.name,
          category: item.category,
          note: item.note,
          value: item.value == null ? '' : String(item.value),
          quantity: String(item.quantity),
          date: item.date || '',
          status: item.status
        }
      : { name: '', category: null, note: '', value: '', quantity: '0', date: '', status: 'draft' };
  }

  function openForm(opts) {
    var mode = opts.mode === 'edit' ? 'edit' : 'add';
    state.formEpoch += 1;
    state.formMode = mode;
    state.formId = opts.id || null;
    state.formReturnTo = mode === 'edit' ? 'detail' : state.view;
    var item = mode === 'edit' ? store.get(state.formId) : null;
    state.baseline = rawBaseline(item);
    el.formTitle.textContent = mode === 'add' ? 'إضافة عنصر' : 'تعديل العنصر';
    el.name.value = state.baseline.name;
    el.note.value = state.baseline.note;
    el.note.style.height = ''; /* R1-UI21: إعادة النمو لمحتوى هذه الجلسة */
    el.value.value = state.baseline.value;
    el.qty.value = state.baseline.quantity;
    el.date.value = state.baseline.date;
    if (window.MicroFields) window.MicroFields.sync(el.form); /* R1-UI05/06 */
    setDraftStatus(state.baseline.status);
    setDraftCategory(item ? categoryObj(item.category) : null);
    setNameError(false);
    setCatError(false);
    setValueError(false);
    setQtyError(false);
    state.op = 'idle';
    state.sending = null;
    clearOpMessage();
    el.checkBtn.hidden = true;
    setFieldsReadonly(false);
    renderDirtyHint();
    showView('form', { focusEl: el.name });
    autoGrowNote(); /* R1-UI21: القياس بعد إظهار العرض — مخفيًا كان scrollHeight صفرًا */
    logEvent('form:open:' + mode, { id: state.formId });
  }

  el.homeAdd.addEventListener('click', function () { openForm({ mode: 'add' }); });
  el.listAdd.addEventListener('click', function () { openForm({ mode: 'add' }); });
  el.listEmptyAdd.addEventListener('click', function () { openForm({ mode: 'add' }); });
  el.homeAll.addEventListener('click', function () { showView('list'); });
  el.listBack.addEventListener('click', function () { showView('home'); });

  /* شريط التنقل الرئيسي: الوجهات الأربع — تبديل بسيط بين الرئيسيات */
  Object.keys(el.navItems).forEach(function (k) {
    el.navItems[k].addEventListener('click', function () {
      showView(k);
    });
  });

  /* ---------- حالة الحقول والرسائل ---------- */
  function setFieldsReadonly(ro) {
    /* readOnly يفقد التحرير ويحفظ القراءة والنسخ — ليس fieldset معطلاً */
    el.name.readOnly = ro;
    el.note.readOnly = ro;
    el.value.readOnly = ro;
    el.qty.readOnly = ro;
    el.date.readOnly = ro;
    [el.nameField, el.noteField, el.valueField, el.qtyField, el.dateField].forEach(function (f) {
      f.classList.toggle('has-readonly', ro);
    });
    if (window.MicroFields) window.MicroFields.sync(el.form); /* R1-UI05/06: زر المسح يختفي في readonly ويعود بعدها */
    el.catTrigger.disabled = ro; /* لا تغيير فئة قبل حسم النتيجة */
  }

  function fieldError(field, input, msgEl, show, text) {
    field.classList.toggle('has-error', show);
    if (show) {
      input.setAttribute('aria-invalid', 'true');
      msgEl.textContent = text;
      msgEl.hidden = false;
      msgEl.classList.add('is-visible');
    } else {
      input.removeAttribute('aria-invalid');
      msgEl.hidden = true;
      msgEl.classList.remove('is-visible');
      msgEl.textContent = '';
    }
  }
  function errorActive(field) { return field.classList.contains('has-error'); }

  function setNameError(show, text) { fieldError(el.nameField, el.name, el.nameMsg, show, text); }
  function setCatError(show, text) { fieldError(el.catField, el.catTrigger, el.catMsg, show, text); }
  function setValueError(show, text) {
    fieldError(el.valueField, el.value, el.valueMsg, show, text);
    if (el.valueHelp) el.valueHelp.hidden = !!show; /* R1-UI15: الخطأ يحل محل المساعدة */
  }
  function setQtyError(show, text) { fieldError(el.qtyField, el.qty, el.qtyMsg, show, text); }

  function setOpMessage(variant, title, body) {
    el.opNote.hidden = false;
    el.opNote.className = 'm-note m-note--' + variant;
    el.opNote.setAttribute('data-op-state', variant);
    el.opTitle.textContent = title;
    el.opBody.textContent = body;
  }
  function clearOpMessage() {
    el.opNote.hidden = true;
    el.opNote.setAttribute('data-op-state', 'idle');
    el.opTitle.textContent = '';
    el.opBody.textContent = '';
  }

  function renderDirtyHint() {
    el.dirtyHint.hidden = !isDirty();
  }

  function setDraftCategory(category) {
    state.draftCategory = category ? { value: category.value, label: category.label } : null;
    renderCatTrigger();
    if (!el.catLayer.hidden) syncPickerSeed();
  }

  function setDraftStatus(status) {
    state.draftStatus = status || 'draft';
    [].slice.call(el.statusSeg.querySelectorAll('.m-seg__item')).forEach(function (b) {
      var on = b.getAttribute('data-value') === state.draftStatus;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-selected', on);
    });
  }

  function renderCatTrigger() {
    el.catValue.textContent = state.draftCategory ? state.draftCategory.label : 'لم تُحدد فئة';
    el.catTrigger.setAttribute('aria-label', state.draftCategory
      ? 'تغيير الفئة، الفئة الحالية: ' + state.draftCategory.label
      : 'تغيير الفئة، لا فئة محددة — اختر فئة');
  }

  function syncPickerSeed() {
    if (!state.draftCategory) return;
    var options = el.picker.querySelectorAll('.m-picker__option');
    for (var i = 0; i < options.length; i++) {
      if (options[i].getAttribute('data-value') === state.draftCategory.value) {
        options[i].setAttribute('aria-selected', 'true');
        var foot = el.picker.querySelector('[data-picker-summary]');
        if (foot) foot.textContent = 'المحدد: ' + options[i].textContent.trim();
        return;
      }
    }
  }

  /* ---------- الإدخال: محور dirty + أخطاء انتهى سببها ---------- */
  function currentValues() {
    return {
      name: el.name.value,
      category: state.draftCategory ? state.draftCategory.value : null,
      note: el.note.value,
      value: el.value.value,
      quantity: el.qty.value,
      date: el.date.value,
      status: state.draftStatus
    };
  }

  function sameValues(a, b) {
    return a.name === b.name && a.note === b.note && a.category === b.category
      && a.value === b.value && a.quantity === b.quantity
      && a.date === b.date && a.status === b.status;
  }

  function isDirty() {
    return !sameValues(currentValues(), state.baseline);
  }

  function nameValid(raw) {
    return String(raw).trim() !== ''; /* الفحص دون تغيير القيمة المكتوبة */
  }

  /* تحقق الصيغة (قرارات تجريبية): القيمة رقم مفهوم؛ الكمية صحيح ≥ 0.
     الفارغ في القيمة مجهول لا صفر (UX-08). */
  function parseValue(raw) {
    var s = String(raw).trim();
    if (s === '') return { ok: true, value: null };
    var n = Number(s);
    if (!isFinite(n)) return { ok: false };
    return { ok: true, value: n };
  }

  function parseQuantity(raw) {
    var s = String(raw).trim();
    if (s === '') return { ok: true, value: 0 };
    if (!/^\d+$/.test(s)) return { ok: false };
    return { ok: true, value: parseInt(s, 10) };
  }

  function inBusyOp() {
    return state.op === 'saving' || state.op === 'checking' || state.op === 'unknown';
  }

  function syncAfterInput() {
    renderDirtyHint();
    /* UX-09: بعد معرفة خطأ محدد أعد تقييمه عند التصحيح */
    if (errorActive(el.nameField) && nameValid(el.name.value)) setNameError(false);
    if (errorActive(el.valueField) && parseValue(el.value.value).ok) setValueError(false);
    if (errorActive(el.qtyField) && parseQuantity(el.qty.value).ok) setQtyError(false);
    /* رسالة عملية سابقة انتهى سببها بتغير القيم تزال (F01-R1-03) */
    if (state.op === 'saved' || state.op === 'failed' || state.op === 'idle') {
      state.op = state.op === 'unknown' ? state.op : 'idle';
      clearOpMessage();
    }
  }
  el.name.addEventListener('input', syncAfterInput);
  el.note.addEventListener('input', syncAfterInput);
  el.value.addEventListener('input', syncAfterInput);
  el.qty.addEventListener('input', syncAfterInput);
  el.date.addEventListener('input', function () { renderDirtyHint(); });

  /* R1-UI21: مساحة ابتدائية معتدلة (rows=2) تنمو مع المحتوى وتقرأ كاملة */
  function autoGrowNote() {
    el.note.style.height = 'auto';
    el.note.style.height = el.note.scrollHeight + 'px';
  }
  el.note.addEventListener('input', autoGrowNote);

  el.statusSeg.addEventListener('micro-selection:segment', function (e) {
    var v = e.detail && e.detail.value;
    if (['draft', 'ready', 'stopped'].indexOf(v) >= 0) {
      setDraftStatus(v);
      renderDirtyHint();
      syncAfterInput();
      logEvent('form:status', { status: v });
    }
  });

  /* ---------- الحفظ: حراسة المستهلك + تحقق عند الإرسال ---------- */
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    attemptSave();
  });

  function attemptSave() {
    /* حراسة المستهلك إضافة لحراسة الزر: saving/checking لا عملية جديدة؛
       unknown الحفظ ممنوع سلوكيًا وشرح السبب باقٍ — لا إعادة إرسال تلقائية. */
    if (state.op === 'saving' || state.op === 'checking' || state.op === 'unknown') return;

    var values = currentValues();

    /* حفظ clean: لا دعوة ولا loading ولا نجاح جديد — لا عملية تُنشأ */
    if (!isDirty()) {
      setOpMessage('info', 'لا تغييرات', 'لا تغييرات للحفظ.');
      return;
    }

    /* إدخال غير صالح: لا عملية — موضع الخطأ وسببه، القيم باقية،
       والتركيز على موضع التصحيح (UX-10) */
    if (!nameValid(values.name)) {
      setNameError(true, 'الاسم مطلوب.');
      el.name.focus();
      return;
    }
    if (!values.category) {
      setCatError(true, 'الفئة مطلوبة — اختر فئة من القائمة.');
      el.catTrigger.focus();
      return;
    }
    var parsedValue = parseValue(values.value);
    if (!parsedValue.ok) {
      setValueError(true, 'أدخل رقمًا صحيحًا للقيمة، أو اتركها فارغة لقيمة مجهولة.');
      el.value.focus();
      return;
    }
    var parsedQty = parseQuantity(values.quantity);
    if (!parsedQty.ok) {
      setQtyError(true, 'أدخل كمية صحيحة (عدد صغير أو صفر).');
      el.qty.focus();
      return;
    }

    /* حفظ dirty صالح: نسخة إرسال ثابتة (كل حقول العنصر) + معرف محاولة.
       photo محفوظ للعنصر المعدّل، والإضافة الجديدة بلا صورة. */
    state.attemptId += 1;
    var originalItem = state.formMode === 'edit' ? store.get(state.formId) : null;
    state.sending = {
      mode: state.formMode,
      id: state.formId,
      values: {
        name: values.name,
        category: values.category,
        note: values.note,
        value: parsedValue.value,
        quantity: parsedQty.value,
        date: values.date === '' ? null : values.date,
        status: values.status,
        photo: originalItem ? originalItem.photo === true : false
      }
    };
    state.op = 'saving';
    setFieldsReadonly(true);
    setOpMessage('info', 'جارٍ الحفظ', 'جارٍ حفظ التعديلات…');
    window.MicroButtons.setLoading(el.saveBtn, true, { loadingLabel: 'جارٍ الحفظ' });
    logEvent('save:attempt', { attemptId: state.attemptId, mode: state.formMode });

    connector.save({
      attemptId: state.attemptId,
      mode: state.sending.mode,
      id: state.sending.id,
      values: Object.assign({}, state.sending.values)
    }).then(handleSaveResult, function (err) {
      /* عقد الإلغاء الصريح: سياق الطلب انتهى — تجاهل صامت موثق */
      if (err && err.cancelled) { logEvent('save:cancelled', { attemptId: state.attemptId }); return; }
      /* رفض Promise أثناء save بلا عقد عدم حفظ: نتيجة مجهولة لا رفض مؤكد */
      endSaveBusy();
      enterUnknown('انتهت محاولة الحفظ بنتيجة غير مؤكدة — تحقق من النتيجة قبل أي تعديل.');
    });
  }

  function belongsToActiveAttempt(res) {
    /* معرفات المحاولات تبدأ من 1 — الصفر (رد فحص قديم) لا يطابق أي محاولة */
    return !!(res && typeof res === 'object' && res.attemptId === state.attemptId && state.attemptId > 0);
  }

  function endSaveBusy() {
    window.MicroButtons.setLoading(el.saveBtn, false);
  }

  function handleSaveResult(res) {
    /* رد قديم لا يخص المحاولة النشطة: تجاهل كليًا وسجّل للفحص فقط */
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      logEvent('stale:ignored', { channel: 'save', receivedAttemptId: res && res.attemptId });
      return;
    }
    /* رد مكرر بعد إتمام محاولة ملتزمة: تجاهل — لا عنصر ثانٍ ولا رسالة ثانية */
    if (!state.sending || state.op === 'idle') {
      state.duplicateIgnored += 1;
      logEvent('duplicate:ignored', { channel: 'save', attemptId: res.attemptId });
      return;
    }
    endSaveBusy();
    if (res.outcome === 'saved') {
      /* (R2-01) سياسة عقد النجاح الناقص: نجاح بلا عنصر مؤكد لا يعرض
         نجاحًا ولا تفاصيل فارغة — يعود unknown والتحقق متاح */
      if (!res.item || !res.item.id) {
        logEvent('save:incomplete-contract', { attemptId: res.attemptId });
        enterUnknown('وصلت نتيجة نجاح بلا عنصر مؤكد — تحقق من النتيجة قبل أي تعديل.');
        return;
      }
      applySaved(res.item);
    } else if (res.outcome === 'not-saved') {
      applyFailed('لم تُحفظ التعديلات', 'يمكنك التصحيح والمحاولة مجددًا.');
    } else {
      enterUnknown('انتهت محاولة الحفظ بنتيجة غير مؤكدة — تحقق من النتيجة قبل أي تعديل.');
    }
  }

  /* نجاح مؤكد: تحديث المؤكد ثم الانتقال إلى التفاصيل ثم كتابة رسالة
     النجاح مرة واحدة في سياق متاح فعليًا (R2-04) — الترتيب يُسجل */
  function applySaved(item) {
    var committed = store.get(item.id) || item; /* نسخة المخزن هي الحقيقة */
    state.baseline = {
      name: state.sending.values.name,
      category: state.sending.values.category,
      note: state.sending.values.note,
      value: state.sending.values.value == null ? '' : String(state.sending.values.value),
      quantity: String(state.sending.values.quantity),
      date: state.sending.values.date || '',
      status: state.sending.values.status
    };
    var mode = state.sending.mode;
    var attemptId = state.attemptId;
    state.committedAttempt = attemptId;
    state.op = 'idle';
    state.sending = null;
    setFieldsReadonly(false);
    renderDirtyHint();
    clearOpMessage();
    logEvent('save:saved', { attemptId: attemptId, id: committed.id, mode: mode });

    clearDetailNote();
    if (mode === 'add') state.detailReturnTo = 'list';
    state.detailId = committed.id;
    renderAll(); /* القائمة والرئيسية والتقارير تُشتق من المصدر الواحد */
    showView('detail'); /* الانتقال الفعلي ثم الكتابة في سياق متاح */
    writeDetailNoteOnce(mode === 'add' ? 'تمت إضافة العنصر' : 'تم حفظ التعديلات', 'القائمة والرئيسية والتقارير محدّثة.');
  }

  function applyFailed(title, body) {
    state.op = 'failed';
    setFieldsReadonly(false);
    setOpMessage('error', title, body);
    renderDirtyHint();
    logEvent('save:failed', { attemptId: state.attemptId });
  }

  function enterUnknown(reasonText) {
    state.op = 'unknown';
    setFieldsReadonly(true); /* النتيجة غير محسومة: لا تحرير، والوصول محفوظ */
    setOpMessage('warning', 'النتيجة غير مؤكدة', reasonText);
    el.checkBtn.hidden = false; /* التحقق متاح — يظهر ظهورًا فعليًا */
    renderDirtyHint();
    logEvent('save:unknown', { attemptId: state.attemptId });
  }

  /* ---------- التحقق من نتيجة محاولة مجهولة ---------- */
  el.checkBtn.addEventListener('click', function () {
    if (state.op !== 'unknown') return; /* حراسة: تكرار التفعيل أثناء checking لا يكرر */
    state.op = 'checking';
    setOpMessage('info', 'جارٍ التحقق', 'جارٍ التحقق من نتيجة الحفظ…');
    window.MicroButtons.setLoading(el.checkBtn, true, { loadingLabel: 'جارٍ التحقق' });
    logEvent('check:attempt', { attemptId: state.attemptId });

    connector.check({ attemptId: state.attemptId })
      .then(handleCheckResult, function (err) {
        window.MicroButtons.setLoading(el.checkBtn, false);
        if (err && err.cancelled) { logEvent('check:cancelled', { attemptId: state.attemptId }); state.op = 'unknown'; return; }
        /* رفض التحقق يبقى unknown — لا يتحول رفض حفظ مؤكدًا ولا نجاحًا */
        state.op = 'unknown';
        setOpMessage('warning', 'تعذر تأكيد النتيجة', 'تعذر تأكيد النتيجة، تحقق مجددًا.');
      });
  });

  /* إخفاء زر تحقق مركّز يُسقط التركيز إلى BODY — النقل قبل الإخفاء
     دون سرقة إن انتقل المستخدم (F01-R1-02) */
  function refocusIfCheckFocused() {
    if (document.activeElement === el.checkBtn) el.saveBtn.focus();
  }

  function handleCheckResult(res) {
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      logEvent('stale:ignored', { channel: 'check', receivedAttemptId: res && res.attemptId });
      return;
    }
    if (!state.sending || (state.op !== 'checking')) {
      state.duplicateIgnored += 1;
      logEvent('duplicate:ignored', { channel: 'check', attemptId: res.attemptId });
      return;
    }
    window.MicroButtons.setLoading(el.checkBtn, false);
    if (res.outcome === 'saved') {
      /* عقد ناقص: نجاح بلا عنصر مؤكد يبقى unknown بلا ادعاء (R2-01) */
      if (!res.item || !res.item.id) {
        state.op = 'unknown';
        setOpMessage('warning', 'النتيجة غير مؤكدة', 'وصلت نتيجة نجاح بلا عنصر مؤكد — تحقق مجددًا.');
        logEvent('check:incomplete-contract', { attemptId: res.attemptId });
        return;
      }
      refocusIfCheckFocused();
      el.checkBtn.hidden = true;
      applySaved(res.item);
      logEvent('check:saved', { attemptId: res.attemptId });
    } else if (res.outcome === 'not-saved') {
      refocusIfCheckFocused();
      el.checkBtn.hidden = true;
      applyFailed('تأكدت النتيجة: لم تُحفظ التعديلات', 'القيم باقية ويمكنك التصحيح والمحاولة مجددًا.');
    } else {
      /* تحقق بنتيجة مجهولة: عودة unknown بقيم كما هي وإمكان إعادة تحقق */
      state.op = 'unknown';
      setOpMessage('warning', 'تعذر تأكيد النتيجة', 'تعذر تأكيد النتيجة، تحقق مجددًا.');
      logEvent('check:unknown', { attemptId: res.attemptId });
    }
  }

  /* ---------- قراءة الفئات: سياق مزدوج + إبطال عند الإغلاق (R1-05) ---------- */
  function pickerVisibleOptionCount() {
    return [].slice.call(el.picker.querySelectorAll('.m-picker__option'))
      .filter(function (o) { return !o.hidden; }).length;
  }

  function announceReadState(text) {
    el.pickerLive.textContent = text; /* القناة الحية داخل الطبقة */
  }

  function moveFocusIntoPickerBeforeDataChange() {
    if (el.catLayer.hidden) return;
    var active = document.activeElement;
    if (!active || !el.picker.contains(active)) return;
    var doomed = active.classList.contains('m-picker__option')
      || active.hasAttribute('data-picker-retry')
      || !!active.closest('.m-picker__state');
    if (!doomed) return; /* عنصر ثابت أو هدف صالح آخر — لا سرقة */
    if (pickerSearch && active !== pickerSearch) pickerSearch.focus();
  }

  function startRead() {
    state.readSeq += 1;
    state.activeRead = {
      readId: state.readSeq,
      session: state.pickerSession,
      epoch: state.formEpoch
    };
    var readId = state.readSeq;
    moveFocusIntoPickerBeforeDataChange();
    setDropNote(''); /* قراءة جديدة = سياق معالجة جديد: رسالة قديمة تُمسح */
    window.MicroPicker.setStatus(el.picker, 'loading');
    announceReadState('جارٍ قراءة الفئات…');
    logEvent('read:attempt', { readId: readId, session: state.pickerSession, epoch: state.formEpoch });
    connector.readCategories({ readId: readId }).then(handleReadResult, function (err) {
      if (err && err.cancelled) {
        logEvent('read:cancelled', { readId: readId });
        return;
      }
      handleReadResult({ readId: readId, outcome: 'error', items: [] });
    });
  }

  function handleReadResult(res) {
    /* الرد لا يُطبق إلا في سياقه الحي: نفس الجلسة، نفس جلسة النموذج،
       الطبقة مفتوحة فعليًا، والمستخدم في النموذج — وإلا يُبطل */
    var active = state.activeRead;
    var contextOk = !!(active && res && typeof res === 'object'
      && res.readId === active.readId
      && active.session === state.pickerSession
      && active.epoch === state.formEpoch
      && !el.catLayer.hidden
      && state.view === 'form');
    if (!contextOk) {
      state.staleIgnored += 1;
      logEvent('stale:ignored', { channel: 'read', receivedReadId: res && res.readId });
      return; /* رد بلا سياق: لا قيمة ولا رسالة ولا تركيز */
    }
    moveFocusIntoPickerBeforeDataChange();
    if (res.outcome === 'ready') {
      window.MicroPicker.setOptions(el.picker, res.items || []);
      syncDraftFromPicker();
      var visibleCount = pickerVisibleOptionCount();
      if (!res.items || !res.items.length) {
        window.MicroPicker.setStatus(el.picker, 'empty', 'لا فئات في المصدر.');
        announceReadState('لا فئات في المصدر.');
      } else {
        var query = pickerSearch ? pickerSearch.value.trim() : '';
        if (query) {
          announceReadState(visibleCount
            ? 'نتائج البحث: ' + visibleCount + ' فئات.'
            : 'لا نتائج مطابقة للبحث. جرّب اسمًا آخر.');
        } else {
          announceReadState('تمت القراءة: ' + res.items.length + ' فئات.');
        }
      }
      logEvent('read:ready', { readId: res.readId, items: (res.items || []).length });
    } else if (res.outcome === 'empty') {
      window.MicroPicker.setOptions(el.picker, []);
      syncDraftFromPicker();
      window.MicroPicker.setStatus(el.picker, 'empty', 'لا فئات في المصدر.');
      announceReadState('لا فئات في المصدر.');
      logEvent('read:empty', { readId: res.readId });
    } else {
      window.MicroPicker.setStatus(el.picker, 'error');
      announceReadState('تعذرت قراءة الفئات.');
      logEvent('read:error', { readId: res.readId });
    }
  }

  function syncDraftFromPicker() {
    var cur = window.MicroPicker.getSelected(el.picker);
    if (cur) {
      if (!state.draftCategory || state.draftCategory.value !== cur.value || state.draftCategory.label !== cur.label) {
        state.draftCategory = { value: cur.value, label: cur.label };
        setDropNote('');
        if (errorActive(el.catField)) setCatError(false);
        renderCatTrigger();
        renderDirtyHint();
      }
    } else if (state.draftCategory) {
      state.draftCategory = null;
      setDropNote('الفئة السابقة لم تعد متاحة. اختر فئة جديدة.');
      renderCatTrigger();
      renderDirtyHint();
    }
  }

  /* ---------- أحداث المنتقي ---------- */
  el.picker.addEventListener('micro-picker:change', function (e) {
    var d = e.detail || {};
    if (d.value != null) {
      state.draftCategory = { value: d.value, label: d.label };
      setDropNote('');
      if (errorActive(el.catField)) setCatError(false);
      renderCatTrigger();
      renderDirtyHint();
      syncAfterInput();
      logEvent('picker:selected', { value: d.value });
      window.MicroNavigation.closeLayer(el.catLayer);
    } else {
      syncDraftFromPicker();
    }
  });

  el.picker.addEventListener('micro-picker:retry', function () {
    startRead();
  });

  el.catTrigger.addEventListener('click', function () {
    if (el.catTrigger.disabled) return;
    window.MicroNavigation.openLayer(el.catLayer, { trigger: el.catTrigger });
  });

  el.catLayer.addEventListener('micro-navigation:opened', function () {
    state.catLayerOpen = true;
    state.pickerSession += 1;
    logEvent('picker:opened', { session: state.pickerSession });
    window.MicroPicker.setOptions(el.picker, store.categories());
    if (state.draftCategory) syncPickerSeed();
    else window.MicroPicker.clearSelection(el.picker);
    startRead();
  });

  el.catLayer.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.catLayer) return;
    state.catLayerOpen = false;
    if (state.activeRead) {
      connector.cancel('read', state.activeRead.readId);
      state.activeRead = null;
    }
    setDropNote('');
    announceReadState('');
    logEvent('picker:closed');
  });

  function bindSearchAnnouncement() {
    if (!pickerSearch || pickerSearch.dataset.f03SearchAnnounced) return;
    pickerSearch.dataset.f03SearchAnnounced = '1';
    pickerSearch.addEventListener('input', function () {
      if (el.catLayer.hidden) return;
      var row = el.picker.querySelector('.m-picker__state');
      var rowText = row ? row.textContent : '';
      if (rowText.indexOf('لا نتائج مطابقة') !== -1) {
        announceReadState('لا نتائج مطابقة للبحث. جرّب اسمًا آخر.');
        return;
      }
      if (row) return;
      var visible = pickerVisibleOptionCount();
      if (pickerSearch.value.trim() === '') {
        announceReadState('الفئات الظاهرة: ' + visible + ' فئات.');
      } else {
        announceReadState('نتائج البحث: ' + visible + ' فئات.');
      }
    });
  }

  function setDropNote(text) {
    if (!el.dropNote || !el.dropNoteText) return;
    if (text) {
      el.dropNote.hidden = false;
      el.dropNoteText.textContent = text;
    } else {
      el.dropNote.hidden = true;
      el.dropNoteText.textContent = '';
    }
  }

  /* ---------- مغادرة النموذج: حراسة clean/dirty/pending ---------- */
  el.formBack.addEventListener('click', function () {
    requestLeaveForm(el.formBack);
  });

  function requestLeaveForm(trigger) {
    if (inBusyOp()) {
      setOpMessage('warning', 'المغادرة غير متاحة الآن', blockedLeaveText());
      return;
    }
    if (isDirty()) {
      state.abandonRequested = false;
      state.leaveTrigger = trigger || el.formBack;
      window.MicroNavigation.openLayer(el.leaveDialog, { trigger: state.leaveTrigger });
      return;
    }
    logEvent('form:leave:clean');
    closeFormTo(state.formReturnTo);
  }

  function closeFormTo(dest) {
    if (state.activeRead) {
      connector.cancel('read', state.activeRead.readId);
      state.activeRead = null;
    }
    showView(dest, { focusEl: dest === 'detail' ? el.detailEdit : null });
  }

  function blockedLeaveText() {
    if (state.op === 'saving') return 'لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ.';
    if (state.op === 'checking') return 'لا يمكن الرجوع الآن — جارٍ التحقق من نتيجة الحفظ.';
    return 'لا يمكن الرجوع قبل حسم نتيجة الحفظ — استخدم «التحقق من النتيجة» أولًا.';
  }

  /* Escape: قرار مستهلك موثق — طبقة مفتوحة → سلوك B07؛ نموذج dirty →
     الحوار؛ نموذج pending → حجب؛ غير ذلك لا فعل. رجوع النظام NOT RUN. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (state.openLayers > 0) return; /* أعلى طبقة: سلوك B07 */
    if (state.view !== 'form') return;
    if (inBusyOp()) {
      e.preventDefault();
      e.stopPropagation();
      setOpMessage('warning', 'المغادرة غير متاحة الآن', blockedLeaveText());
      return;
    }
    if (isDirty()) {
      e.preventDefault();
      e.stopPropagation();
      state.abandonRequested = false;
      state.leaveTrigger = el.formBack;
      window.MicroNavigation.openLayer(el.leaveDialog, { trigger: state.leaveTrigger });
    }
  }, true);

  el.stayBtn.addEventListener('click', function () {
    window.MicroNavigation.closeLayer(el.leaveDialog);
  });

  el.abandonBtn.addEventListener('click', function () {
    state.abandonRequested = true;
    logEvent('form:leave:discard');
    window.MicroNavigation.closeLayer(el.leaveDialog);
  });

  el.leaveDialog.addEventListener('micro-navigation:opened', function () {
    state.dialogOpen = true;
  });

  el.leaveDialog.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.leaveDialog) return;
    state.dialogOpen = false;
    if (!state.abandonRequested) return; /* بقاء: لا فعل إضافي */
    state.abandonRequested = false;
    closeFormTo(state.formReturnTo);
  });

  /* ---------- عدّ الطبقات + تدفق الإعلان المؤجل عند أي إغلاق ---------- */
  [el.catLayer, el.leaveDialog, el.deleteDialog, el.reviewLayer, el.filterLayer, el.accountLayer].forEach(function (layer) {
    layer.addEventListener('micro-navigation:opened', function () {
      state.openLayers += 1;
    });
    layer.addEventListener('micro-navigation:closed', function (e) {
      if (e.target !== layer) return;
      state.openLayers = Math.max(0, state.openLayers - 1);
      flushPendingNote(); /* (R2-04) سياق متاح الآن: اكتب ما تأجل مرة واحدة */
    });
  });

  el.reviewLayer.addEventListener('micro-navigation:opened', function () {
    state.reviewOpen = true;
    logEvent('review:opened');
  });
  el.reviewLayer.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.reviewLayer) return;
    state.reviewOpen = false;
    logEvent('review:closed');
  });

  el.reviewOpen.addEventListener('click', function () {
    window.MicroNavigation.openLayer(el.reviewLayer, { trigger: el.reviewOpen });
  });

  /* ---------- التقارير: مشتقة من البيانات فعليًا بمقياس قابل للتبديل -- */
  function metricUnit() {
    return state.repMetric === 'value' ? 'د.أ' : 'وحدة';
  }

  function metricValueOf(it) {
    /* القيمة: المجهول مستثنى من الجمع (لا يُعتبر صفرًا)؛ الكمية دائمًا معلومة */
    if (state.repMetric === 'quantity') return typeof it.quantity === 'number' ? it.quantity : 0;
    return typeof it.value === 'number' && isFinite(it.value) ? it.value : null;
  }

  function includedItems() {
    var includeStopped = store.settings().includeStoppedInReports;
    return store.all().filter(function (it) { return includeStopped || it.status !== 'stopped'; });
  }

  function weekKeyOf(dateStr) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
    if (!m) return null;
    var days = Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000);
    return new Date(Math.floor(days / 7) * 7 * 86400000).toISOString().slice(0, 10);
  }

  /* R3-UI02: تسمية تاريخ قصيرة مقروءة بصيغة «يوم/شهر» من نص ISO نفسه —
     regex نصي لا Date/UTC: لا انزياح زمني ولا منطق تقويم جديد هنا؛
     القراءة الكاملة تبقى متاحة عبر data-label-full (عقد data.js: المكوّن
     لا يفترض أن كل label تاريخ — يعرض ما مرره المستهلك). */
  function shortDateAr(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    return m ? (m[3] + '/' + m[2]) : String(iso || '');
  }

  function renderReports() {
    var items = includedItems();
    var cats = store.categories();
    var unit = metricUnit();
    var metricLabel = state.repMetric === 'value' ? 'القيمة' : 'الكمية';
    var fmtMetric = state.repMetric === 'value' ? formatMoney : formatCount; /* R1-UI20 */

    /* بطاقتا peek من البيانات نفسها */
    var sumAll = 0;
    items.forEach(function (it) { var v = metricValueOf(it); if (v != null) sumAll += v; });
    el.repTotal.setAttribute('aria-label', 'إجمالي المقياس، ' + fmtMetric(sumAll) + ' ' + unit);
    el.repTotal.querySelector('.m-info-card__number').textContent = fmtMetric(sumAll);
    el.repTotal.querySelector('.m-info-card__unit').textContent = unit;
    el.repIncluded.setAttribute('aria-label', 'عناصر مشمولة، ' + items.length);
    el.repIncluded.querySelector('.m-info-card__number').textContent = formatNumber(items.length);

    /* جمع المقياس لكل فئة — المجهول حالة مستقلة لا صفر */
    var perCat = cats.map(function (c) {
      var inCat = items.filter(function (it) { return it.category === c.value; });
      var known = inCat.filter(function (it) { return metricValueOf(it) != null; });
      var s = known.reduce(function (a, it) { return a + metricValueOf(it); }, 0);
      return { cat: c, count: inCat.length, sum: known.length ? s : null, known: known.length, total: inCat.length };
    });
    var seriesOf = function (v) { return v === 'cat-a' ? 'a' : v === 'cat-b' ? 'b' : 'c'; };

    /* الأعمدة: data-max معلن من البيانات؛ المجهول «—» */
    el.repBarsTitle.textContent = metricLabel + ' لكل فئة';
    var maxCat = 0;
    perCat.forEach(function (p) { if (p.sum != null && p.sum > maxCat) maxCat = p.sum; });
    el.repBars.setAttribute('data-max', maxCat > 0 ? String(Math.ceil(maxCat)) : '1');
    el.repBarsData.textContent = '';
    perCat.forEach(function (p) {
      var li = document.createElement('li');
      li.setAttribute('data-series', seriesOf(p.cat.value));
      li.setAttribute('data-label', p.cat.label);
      if (p.sum == null) li.setAttribute('data-value', '');
      else li.setAttribute('data-value', String(Math.round(p.sum * 100) / 100));
      el.repBarsData.appendChild(li);
    });
    window.MicroData.render(el.repBars);

    /* دوائر التوزيع: المقام مجموع الأجزاء المعلومة — والسالب يطبق رفض العقد */
    el.repDonutTitle.textContent = 'توزيع ' + metricLabel + ' على الفئات';
    var totalKnown = 0;
    perCat.forEach(function (p) { if (p.sum != null) totalKnown += p.sum; });
    el.repDonut.setAttribute('data-total', String(Math.round(totalKnown * 100) / 100));
    el.repDonutData.textContent = '';
    perCat.forEach(function (p) {
      var li = document.createElement('li');
      li.setAttribute('data-series', seriesOf(p.cat.value));
      li.setAttribute('data-label', p.cat.label);
      if (p.sum == null) li.setAttribute('data-value', '');
      else li.setAttribute('data-value', String(Math.round(p.sum * 100) / 100));
      el.repDonutData.appendChild(li);
    });
    window.MicroData.render(el.repDonut);

    /* الخط: نوافذ أسبوعية من التواريخ الفعلية — أسبوع بلا عناصر لا يُخترع له صفر */
    el.repLineTitle.textContent = metricLabel + ' أسبوعيًا';
    var buckets = {};
    items.forEach(function (it) {
      var wk = weekKeyOf(it.date);
      if (!wk) return;
      var v = metricValueOf(it);
      if (!buckets[wk]) buckets[wk] = { sum: 0, known: 0 };
      if (v != null) { buckets[wk].sum += v; buckets[wk].known += 1; }
    });
    var weeks = Object.keys(buckets).sort();
    var maxWeek = 0;
    weeks.forEach(function (w) { if (buckets[w].known > 0 && buckets[w].sum > maxWeek) maxWeek = buckets[w].sum; });
    el.repLine.setAttribute('data-max', maxWeek > 0 ? String(Math.ceil(maxWeek)) : '1');
    el.repLineData.textContent = '';
    weeks.forEach(function (w) {
      var li = document.createElement('li');
      li.setAttribute('data-series', 'a');
      /* R3-UI02: تسمية قصيرة مقروءة (يوم/شهر) من نص الأسبوع نفسه،
         والتاريخ الكامل قراءة متاحة عبر data-label-full — ISO الأصلي
         بلا تحويل تاريخي (يُبنى من نص w مباشرة) */
      li.setAttribute('data-label', shortDateAr(w));
      li.setAttribute('data-label-full', w);
      li.setAttribute('data-value', buckets[w].known ? String(Math.round(buckets[w].sum * 100) / 100) : '');
      el.repLineData.appendChild(li);
    });
    window.MicroData.render(el.repLine);

    /* المقارنة العددية: بطل الإجمالي + صفوف الفئات (وحدة وفترة معلنتان) */
    el.repMetric.setAttribute('data-common-unit', unit);
    el.repMetric.setAttribute('data-common-period', 'كل الفترات');
    el.repHeroLabel.textContent = 'إجمالي ' + metricLabel;
    el.repHeroNum.textContent = fmtMetric(sumAll);
    el.repHeroUnit.textContent = unit;
    el.repBarsSrc.textContent = '';
    var maxRow = 0;
    perCat.forEach(function (p) { if (p.sum != null && p.sum > maxRow) maxRow = p.sum; });
    perCat.forEach(function (p) {
      var li = document.createElement('li');
      li.setAttribute('data-label', p.cat.label);
      li.setAttribute('data-unit', unit);
      li.setAttribute('data-period', 'كل الفترات');
      li.setAttribute('data-series', seriesOf(p.cat.value));
      if (p.sum == null) li.setAttribute('data-state', 'unavailable');
      else {
        li.setAttribute('data-value', String(Math.round(p.sum * 100) / 100));
        li.setAttribute('data-display-value', fmtMetric(Math.round(p.sum * 100) / 100)); /* R1-UI20: عرض منسق داخل صفوف المقارنة */
      }
      el.repBarsSrc.appendChild(li);
    });
    if (maxRow > 0) el.repMetric.setAttribute('data-max', String(Math.ceil(maxRow)));
    else el.repMetric.removeAttribute('data-max');
    window.MicroMetricComparison.render(el.repMetric);

    /* القيم المعلومة لكل فئة (قراءة جودة بيانات صادقة عن القيمة) */
    el.repKnown.textContent = '';
    cats.forEach(function (c) {
      var p = perCat.filter(function (x) { return x.cat.value === c.value; })[0];
      var row = document.createElement('div');
      row.className = 'm-progress';
      row.setAttribute('data-cat', c.value);
      var head = document.createElement('div');
      head.className = 'm-progress__head';
      var label = document.createElement('span');
      label.className = 'm-progress__label';
      label.textContent = c.label;
      var value = document.createElement('span');
      value.className = 'm-progress__value';
      value.textContent = p.total === 0 ? 'لا عناصر' : p.known + ' من ' + p.total;
      head.appendChild(label);
      head.appendChild(value);
      var track = document.createElement('div');
      track.className = 'm-progress__track';
      var bar = document.createElement('div');
      bar.className = 'm-progress__bar';
      var pct = p.total > 0 ? Math.round((p.known / p.total) * 100) : 0;
      bar.style.setProperty('--progress', pct + '%');
      track.appendChild(bar);
      row.appendChild(head);
      row.appendChild(track);
      el.repKnown.appendChild(row);
    });
  }

  el.repSeg.addEventListener('micro-selection:segment', function (e) {
    var v = e.detail && e.detail.value;
    if (v === 'value' || v === 'quantity') {
      state.repMetric = v;
      logEvent('reports:metric', { metric: v });
      renderReports();
    }
  });

  /* ---------- الحساب: مفاتيح بأثر فوري محفوظ + خروج ---------- */
  function setAccountStatus(text) {
    var node = el.accountLayer.querySelector('[data-account-demo-status]');
    if (node) node.textContent = text || '';
  }

  function applySetting(setting, checked) {
    store.updateSettings(((function () { var p = {}; p[setting] = checked; return p; })()));
    renderAll();
    logEvent('setting:applied', { setting: setting, checked: checked });
    /* تأجيل قصير: مكوّن الإعدادات يمسح الحالة بعد إطلاق الحدث — رسالتنا تكتب بعده */
    window.setTimeout(function () { setAccountStatus('حُفظ الإعداد في هذا المتصفح.'); }, 0);
  }

  el.accountViewRoot.addEventListener('micro-account-settings:change', function (e) {
    /* عقد المكوّن: الحدث يُطلق على جذر data-account-settings وdetail يحمل
       {setting, checked} — عنصر المفتاح يُجلب بالاسم من طبقة المكوّن */
    var d = e.detail || {};
    var setting = d.setting;
    var checked = d.checked === true;
    if (setting !== 'includeStoppedInReports' && setting !== 'showHomeComparison') return;
    var input = el.accountLayer.querySelector('[data-account-setting="' + setting + '"]');
    if (!input) return;
    if (state.settingScenario === 'auto') {
      applySetting(setting, checked);
      return;
    }
    if (state.settingScenario === 'pending') {
      /* UX-13: رفع معلق — حسم حتمي بعد مهلة إن لم يُنهَ من وضع المراجعة */
      window.MicroSelection.setSwitchPending(input, true);
      state.pendingSetting = { input: input, setting: setting, checked: checked };
      logEvent('setting:pending', { setting: setting, checked: checked });
      if (state.pendingSettingTimer) window.clearTimeout(state.pendingSettingTimer);
      state.pendingSettingTimer = window.setTimeout(function () { settlePendingSetting(); }, 2000);
      updateReviewSettingControls();
      return;
    }
    /* رفض معلوم: استعادة القيمة السابقة مع تفسير — لا نجاح كاذب */
    window.MicroSelection.setSwitchPending(input, true);
    window.setTimeout(function () {
      window.MicroSelection.setSwitchPending(input, false);
      input.checked = !checked;
      setAccountStatus('تعذر تطبيق الإعداد — عاد إلى قيمته السابقة.');
      logEvent('setting:rejected', { setting: setting, checked: checked });
    }, 600);
  });

  function settlePendingSetting() {
    if (!state.pendingSetting) return;
    var p = state.pendingSetting;
    state.pendingSetting = null;
    if (state.pendingSettingTimer) { window.clearTimeout(state.pendingSettingTimer); state.pendingSettingTimer = null; }
    window.MicroSelection.setSwitchPending(p.input, false);
    applySetting(p.setting, p.checked);
    updateReviewSettingControls();
  }

  function updateReviewSettingControls() {
    var btn = q('f03-rev-settle-setting');
    if (btn) btn.disabled = !state.pendingSetting;
  }

  el.accountLogout.addEventListener('click', function () {
    enterGateway();
  });

  /* ---------- أدوات البيانات في وضع المراجعة ---------- */
  function afterDataTool() {
    if (state.activeRead) {
      connector.cancel('read', state.activeRead.readId);
      state.activeRead = null;
    }
    el.searchInput.value = '';
    state.search = '';
    state.selected = {};
    if (state.selecting) setSelecting(false);
    clearAllFiltersExternal(); /* (R2-03) عبر عقد B07 الموثق */
    if (state.view === 'form') {
      state.detailId = null;
      showView('home');
      return;
    }
    if (state.view === 'detail' && !store.get(state.detailId)) {
      state.detailId = null;
      clearDetailNote();
      showView('home');
      return;
    }
    renderAll();
  }

  /* تسليم رد فحص بمعرف قديم (نمط F01-R1-05): عبر معالِج النتائج لدى
     المستهلك بذات الفلاتر — دون استهلاك الطلب المعلق */
  function deliverTestResponse(kind, payload) {
    if (kind === 'save') handleSaveResult(payload);
    else if (kind === 'check') handleCheckResult(payload);
    else if (kind === 'read') handleReadResult(payload);
  }

  /* ---------- واجهة الفحص البرمجي (محايدة التركيز — للفحص فقط) ---------- */
  var F03App = {
    version: 'F03-V3',
    arm: function (kind, outcome) {
      if (kind === 'save') connector.setNextSave(outcome);
      else if (kind === 'check') connector.setNextCheck(outcome);
      else if (kind === 'read') connector.setNextRead(outcome);
      return connector.readout();
    },
    settle: function (kind, override) {
      return connector.settle(kind, override);
    },
    deliverTestResponse: deliverTestResponse,
    resetDemoData: function () {
      store.resetToSeed();
      logEvent('data:reset');
      afterDataTool();
    },
    clearDemoData: function () {
      store.clearAll();
      logEvent('data:cleared');
      afterDataTool();
    },
    openReview: function () {
      window.MicroNavigation.openLayer(el.reviewLayer, { trigger: el.reviewOpen });
    },
    closeReview: function () {
      window.MicroNavigation.closeLayer(el.reviewLayer);
    },
    openForm: openForm,
    openDetail: openDetail,
    showView: function (name) { showView(name); },
    setSource: function (items) { connector.setSource(items); }, /* للفحص فقط — يطبق من القراءة التالية */
    breakDetailPhoto: function () {
      var img = el.detailIdentity.querySelector('img[data-avatar-fallback]');
      if (!img) return false;
      img.src = BROKEN_PHOTO_SRC; /* خطأ عنصر بلا طلب شبكة → بديل الأحرف */
      logEvent('detail:photo-broken');
      return true;
    },
    setSettingScenario: function (outcome) {
      state.settingScenario = outcome || 'auto';
      if (outcome !== 'pending') updateReviewSettingControls();
      return state.settingScenario;
    },
    settlePendingSetting: settlePendingSetting,
    inspect: inspect
  };

  function inspect() {
    var active = document.activeElement;
    var options = [].slice.call(el.picker.querySelectorAll('.m-picker__option'));
    var rows = [].slice.call(el.listRows.querySelectorAll('.f03-row'));
    var recentRows = [].slice.call(el.homeRecent.querySelectorAll('.f03-row'));
    var distRows = [].slice.call(el.repKnown.querySelectorAll('.m-progress'));
    var filterChecks = [].slice.call(el.filterCats.querySelectorAll('input[type="checkbox"]'));
    var items = store.all();
    var recentSorted = items.slice().sort(function (a, b) { return (b.updatedAt - a.updatedAt) || a.id.localeCompare(b.id); }).slice(0, 3);
    var settings = store.settings();
    var chartVals = function (list) {
      return [].slice.call(list.querySelectorAll('li')).map(function (li) {
        return { label: li.getAttribute('data-label'), value: li.getAttribute('data-value') };
      });
    };
    return {
      version: F03App.version,
      entered: state.entered,
      view: state.view,
      op: state.op,
      dirty: isDirty(),
      formMode: state.formMode,
      formId: state.formId,
      formReturnTo: state.formReturnTo,
      formEpoch: state.formEpoch,
      pickerSession: state.pickerSession,
      attemptId: state.attemptId,
      committedAttempt: state.committedAttempt,
      readSeq: state.readSeq,
      baseline: Object.assign({}, state.baseline),
      current: currentValues(),
      draftCategory: state.draftCategory ? { value: state.draftCategory.value, label: state.draftCategory.label } : null,
      draftStatus: state.draftStatus,
      sending: state.sending
        ? { mode: state.sending.mode, id: state.sending.id, values: Object.assign({}, state.sending.values) }
        : null,
      formTitle: el.formTitle.textContent,
      nameError: errorActive(el.nameField),
      nameMsgText: el.nameMsg.hidden ? '' : el.nameMsg.textContent,
      nameAriaInvalid: el.name.getAttribute('aria-invalid') === 'true',
      nameDescribedBy: el.name.getAttribute('aria-describedby') || '',
      catError: errorActive(el.catField),
      catMsgText: el.catMsg.hidden ? '' : el.catMsg.textContent,
      valueError: errorActive(el.valueField),
      valueMsgText: el.valueMsg.hidden ? '' : el.valueMsg.textContent,
      qtyError: errorActive(el.qtyField),
      qtyMsgText: el.qtyMsg.hidden ? '' : el.qtyMsg.textContent,
      catTriggerDisabled: el.catTrigger.disabled,
      readonly: el.name.readOnly && el.note.readOnly,
      saveBusy: el.saveBtn.getAttribute('aria-busy') === 'true',
      checkBusy: el.checkBtn.getAttribute('aria-busy') === 'true',
      checkVisible: isReallyVisible(el.checkBtn),
      formMessage: el.opNote.hidden ? null : {
        variant: el.opNote.getAttribute('data-op-state'),
        title: el.opTitle.textContent,
        text: el.opBody.textContent
      },
      formMessageVisible: isReallyVisible(el.opNote),
      dirtyHintVisible: !el.dirtyHint.hidden,
      storeIds: items.map(function (it) { return it.id; }),
      storeCount: items.length,
      storeItem: (function () {
        var it = state.detailId ? store.get(state.detailId) : null;
        return it ? { id: it.id, name: it.name, category: it.category, note: it.note, value: it.value, quantity: it.quantity, date: it.date, status: it.status } : null;
      })(),
      detailId: state.detailId,
      detailReturnTo: state.detailReturnTo,
      detailRead: {
        name: el.readName.textContent,
        category: el.readCat.textContent,
        status: el.readStatus.textContent,
        value: el.readValue.textContent,
        quantity: el.readQty.textContent,
        date: el.readDate.textContent,
        note: el.readNote.textContent
      },
      detailPhoto: (function () {
        var img = el.detailIdentity.querySelector('img[data-avatar-fallback]');
        var ini = el.detailIdentity.querySelector('.m-identity__initials');
        return { hasImg: !!img, hasInitials: !!ini, initials: ini ? ini.textContent : '' };
      })(),
      detailSteps: [].slice.call(el.detailSteps.querySelectorAll('.m-step')).map(function (s) {
        return { cls: s.className.indexOf('complete') >= 0 ? 'complete' : s.className.indexOf('current') >= 0 ? 'current' : 'other', title: (s.querySelector('.m-step__title') || {}).textContent || '' };
      }),
      detailNote: el.detailNote.hidden ? null : {
        variant: el.detailNote.getAttribute('data-detail-state'),
        title: el.detailNoteTitle.textContent,
        text: el.detailNoteBody.textContent
      },
      detailNoteVisible: isReallyVisible(el.detailNote),
      detailNoteInertAncestor: !!el.detailNote.closest('[inert]'),
      pendingNote: state.pendingNote ? Object.assign({}, state.pendingNote) : null,
      home: {
        totalText: el.homeTotal.textContent,
        totalSub: el.homeTotalSub.textContent,
        allBtnText: el.homeAll.textContent,
        strip: {
          count: (el.stripCount.querySelector('.m-info-card__number') || {}).textContent || '',
          unknown: (el.stripUnknown.querySelector('.m-info-card__number') || {}).textContent || '',
          cats: (el.stripCats.querySelector('.m-info-card__number') || {}).textContent || ''
        },
        qty: el.homeQty.textContent,
        compareHidden: el.homeCompare.hidden,
        bars: chartVals(el.homeBarsSrc),
        circles: chartVals(el.homeCirclesSrc),
        recentIds: recentRows.map(function (r) { return r.getAttribute('data-id'); }),
        recentExpected: recentSorted.map(function (it) { return it.id; }),
        recentEmptyVisible: !el.homeRecentEmpty.hidden
      },
      list: {
        resultsText: el.listResults.hidden ? null : el.listResults.textContent,
        rowIds: rows.map(function (r) { return r.getAttribute('data-id'); }),
        rowCount: rows.length,
        emptyVisible: !el.listEmpty.hidden,
        noResultsVisible: !el.listNoResults.hidden,
        clearSearchVisible: !el.clearSearch.hidden,
        clearFiltersVisible: !el.clearFilters.hidden,
        searchValue: el.searchInput.value,
        appliedFilters: Object.assign({}, state.appliedFilters),
        appliedCats: activeFilterCats(),
        filterCount: el.filterCount.textContent,
        filterCounterHidden: el.filterCount.hidden,
        filterAria: el.filterBtn.getAttribute('aria-label') || '',
        sortBy: state.sortBy,
        selecting: state.selecting,
        selectTogglePressed: el.selectToggle.getAttribute('aria-pressed') === 'true',
        selectedCount: selectedCount(),
        selectBarVisible: !el.selectBar.hidden,
        selectDeleteDisabled: el.selectDelete.disabled,
        selectDeleteLabel: el.selectDelete.textContent,
        checkStates: [].slice.call(el.selectZone.querySelectorAll('input[data-choice-item]')).map(function (cb) {
          return { id: cb.getAttribute('data-id'), checked: cb.checked };
        }),
        selectAllChecked: el.selectAll.checked,
        selectAllIndeterminate: el.selectAll.indeterminate
      },
      filterPanelOpen: !el.filterLayer.hidden,
      filterChecks: filterChecks.map(function (cb) {
        return { key: cb.getAttribute('data-filter-key'), label: cb.getAttribute('data-filter-label'), checked: cb.checked };
      }),
      filterPanelSummary: (el.filterLayer.querySelector('[data-filter-summary]') || {}).textContent || '',
      filterPanelApplied: window.MicroNavigation.appliedFilters(el.filterLayer),
      reports: {
        metric: state.repMetric,
        totalText: (el.repTotal.querySelector('.m-info-card__number') || {}).textContent || '',
        totalUnit: (el.repTotal.querySelector('.m-info-card__unit') || {}).textContent || '',
        includedText: (el.repIncluded.querySelector('.m-info-card__number') || {}).textContent || '',
        barsTitle: el.repBarsTitle.textContent,
        donutTitle: el.repDonutTitle.textContent,
        lineTitle: el.repLineTitle.textContent,
        bars: chartVals(el.repBarsData),
        donut: chartVals(el.repDonutData),
        donutTotal: el.repDonut.getAttribute('data-total'),
        donutScaleState: el.repDonut.getAttribute('data-scale-state') || '',
        donutError: (el.repDonut.querySelector('.m-chart__error') || {}).textContent || null,
        line: chartVals(el.repLineData),
        hero: { label: el.repHeroLabel.textContent, num: el.repHeroNum.textContent, unit: el.repHeroUnit.textContent },
        metricRows: chartVals(el.repBarsSrc),
        known: distRows.map(function (row) {
          return {
            cat: row.getAttribute('data-cat'),
            label: (row.querySelector('.m-progress__label') || {}).textContent || '',
            value: (row.querySelector('.m-progress__value') || {}).textContent || '',
            width: (row.querySelector('.m-progress__bar') || { getAttribute: function () { return ''; } }).style ? row.querySelector('.m-progress__bar').style.getPropertyValue('--progress') : ''
          };
        })
      },
      settings: settings,
      pickerOpen: !el.catLayer.hidden,
      dialogOpen: !el.leaveDialog.hidden,
      deleteOpen: !el.deleteDialog.hidden,
      deleteText: el.deleteText.textContent,
      accountLayerOpen: !el.accountLayer.hidden,
      reviewOpen: !el.reviewLayer.hidden,
      openLayers: state.openLayers,
      focusId: active ? (active.id || active.tagName.toLowerCase()) : 'none',
      focusInert: !!(active && active.closest && active.closest('[inert]')),
      pickerSummary: (el.picker.querySelector('[data-picker-summary]') || {}).textContent || '',
      pickerStateRow: (function () {
        var row = el.picker.querySelector('.m-picker__state');
        return row ? row.textContent : null;
      })(),
      pickerLiveText: el.pickerLive.textContent,
      pickerOptions: options.map(function (o) {
        var r = o.getBoundingClientRect();
        return {
          value: o.getAttribute('data-value'),
          label: o.textContent,
          selected: o.getAttribute('aria-selected') === 'true',
          hiddenAttr: o.hidden,
          visibleRect: r.width > 0 && r.height > 0
        };
      }),
      dropNote: (function () {
        if (!el.dropNote || !el.dropNoteText) return null;
        var cs = getComputedStyle(el.dropNote);
        var r = el.dropNote.getBoundingClientRect();
        return {
          text: el.dropNoteText.textContent,
          hiddenAttr: el.dropNote.hidden,
          display: cs.display,
          w: Math.round(r.width),
          h: Math.round(r.height),
          inLayer: el.catLayer.contains(el.dropNote)
        };
      })(),
      pickerSearchValue: (pickerSearch || {}).value || '',
      accountStatusText: (el.accountLayer.querySelector('[data-account-demo-status]') || {}).textContent || '',
      toastVisible: !el.toast.hidden,
      toastText: el.toastText.textContent,
      scrollY: Math.round(window.scrollY || 0),
      saveCalls: connector.counters.save,
      checkCalls: connector.counters.check,
      readCalls: connector.counters.read,
      staleIgnored: state.staleIgnored,
      duplicateIgnored: state.duplicateIgnored,
      storage: store.storageStatus(),
      storageLineText: el.storageLine.textContent,
      navbarVisible: !el.navbar.hidden,
      sim: connector.readout(),
      events: state.events.slice()
    };
  }
  window.F03App = F03App;

  /* ---------- إقلاع: بوابة الوصول ثم البناء بلا طلبات ولا أحداث -------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    buildFilterCats();
    bindSearchAnnouncement();
    bindGateway();
    /* مزامنة مفاتيح الإعدادات من المصدر الواحد */
    var s = store.settings();
    var sw1 = el.accountLayer.querySelector('[data-account-setting="includeStoppedInReports"]');
    var sw2 = el.accountLayer.querySelector('[data-account-setting="showHomeComparison"]');
    if (sw1) sw1.checked = s.includeStoppedInReports;
    if (sw2) sw2.checked = s.showHomeComparison;
    /* سيناريو الإعداد من وضع المراجعة (UX-13) */
    document.addEventListener('f03:setting-scenario', function (e) {
      state.settingScenario = (e.detail && e.detail.outcome) || 'auto';
      updateReviewSettingControls();
    });
    var settleSettingBtn = q('f03-rev-settle-setting');
    if (settleSettingBtn) settleSettingBtn.addEventListener('click', function () { settlePendingSetting(); });
    /* وصف البقاء يتبع آخر نتيجة كتابة فعلية (R2-05) */
    document.addEventListener('f03:storage-changed', renderStorageLine);
    renderStorageLine();
    renderHome();
    renderReports();
    showView('gateway', { focus: false });
    logEvent('boot', { storage: store.storageStatus().persistent ? 'local' : 'session' });
  }

  function renderStorageLine() {
    var st = store.storageStatus();
    el.storageLine.textContent = st.persistent
      ? 'تُحفظ تعديلاتك محليًا في هذا المتصفح وتبقى بعد إغلاق الملف.'
      : 'التعديلات تبقى داخل هذه الجلسة فقط — تعذر الحفظ المحلي في هذا المتصفح.';
  }
})();
