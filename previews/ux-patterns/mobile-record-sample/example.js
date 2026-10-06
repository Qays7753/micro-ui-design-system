/* =========================================================
   Micro UI — UX-F03: سلوك المستهلك للتجربة المترابطة «العناصر»
   الملف: previews/ux-patterns/mobile-record-sample/example.js
   الحالة: DRAFT FOR RE-REVIEW — سلوك مستهلك للعينة، ليس framework عامًا
   ولا منطق أعمال، ولا يعدّل أي مصدر UI.
   مصدر القواعد: docs/ux/F03-EXPERIENCE-BRIEF.md §2..8.

   بنية التجربة (أربع وجهات + ثلاث طبقات B07):
   - الرئيسية: ملخص من المخزن الوحيد (عدد/توزيع m-progress/أحدث العناصر).
   - القائمة: بحث فعلي + زر التصفية المعتمد (عقد data-filter-panel) وعدّاد
     المطبق + «لا بيانات» ≠ «لا نتائج».
   - التفاصيل: البيانات المحفوظة + قناة حالة السياق الوحيدة للصفحة.
   - الإضافة/التعديل: صفحة نموذج كاملة (قرار تركيب موثق في الموجب §2 بدل
     اللوحة السفلية) — منتقي الفئة طبقة B07 وحوار تجاهل التعديلات طبقة B07.

   مصدر الحقيقة:
   - F03Store: العناصر والفئات — كل الصفحات والملخصات تُشتق منه، والحفظ
     المحلي عند توفره (جلسي عند التعذر) بلا ادعاء دوام أو مزامنة.
   - formBaseline: أساس النموذج عند الفتح (قيم العنصر أو فراغ)؛ dirty محور
     مستقل = اختلاف القيم الخام عن الأساس، والعودة للأصل تعيد clean.
   - sending: نسخة إرسال ثابتة عند بدء الحفظ؛ attemptId/readSeq/pickerSession/
     formEpoch معرفات متزايدة — الردود خارج سياقها تُبطل ولا تطبق أبدًا.
   - op: idle | saving | failed | unknown | checking.

   قرارات موثقة (تفصيلها في README.md):
   - (R1-05) صلاحية رد القراءة مرتبطة بسياق مزدوج: جلسة فتح المنتقي + جلسة
     النموذج + ظهور الطبقة فعليًا؛ الإغلاق أو مغادرة النموذج يُبطل السياق
     ويُلغي الطلب إلغاءً صريحًا (cancel → {cancelled:true} يُتجاهل بصمت
     بعقد موثق) — فلا يغير رد مغلق فئة جلسة أحدث أو dirty أو التركيز.
   - (R1-06) نجاح الحفظ: تحديث المؤكد ثم تبديل العرض إلى التفاصيل ثم كتابة
     رسالة النجاح مرة واحدة في قناة سياق التفاصيل الظاهرة (role=status) —
     سجل الأحداث يثبت الترتيب: save:saved → view:detail → note:written.
     لا رسالة مكررة ولا سرقة تركيز إضافية.
   - (R1-01) الواجهة الافتراضية بلا أي نصوص أو أدوات فحص؛ وضع المراجعة
     طبقة مغلقة مدخلها رابط التذييل وحده (R1-07: أدواته تعمل من الهاتف
     بلا console، والمسلح يُحسم تلقائيًا بوقت حتمي داخل الموصل).
   - (R1-02) رموز inline بنفس خصائص أصول HugeIcons بينها fill="none" —
     وأداة البناء تتحقق من كل رمز مقابل ملفه.
   - قناة واحدة لكل سياق: أخطاء الحقول قرب الحقل (aria-describedby)؛ رسالة
     العملية داخل النموذج role=status؛ نجاح الحفظ في قناة التفاصيل بعد
     الانتقال؛ رسالة زوال الفئة داخل طبقة المنتقي role=alert ظاهرة (B06)
     وهي القناة الوحيدة لهذا الحدث. لا Toast في هذه العينة.
   - رسائل انتهى سببها تزال عند تغير القيم (درس F01-R1-03)؛ failed يبقى
     سجل محاولة دون عرضه كرفض للقيم الحالية.
   - المغادرة: clean → عودة مباشرة؛ dirty → حوار قرار (كل إغلاق غير
     التجاهل = بقاء)؛ pending → حجب برسالة موجزة دون وهم إلغاء عملية.
   - Escape بطور الالتقاط: طبقة مفتوحة → سلوك B07؛ نموذج dirty → الحوار؛
     نموذج pending → حجب؛ غير ذلك لا فعل (موثق). رجوع النظام NOT RUN.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- العناصر ---------- */
  function q(id) { return document.getElementById(id); }

  var el = {
    views: {
      home: q('view-home'),
      list: q('view-list'),
      detail: q('view-detail'),
      form: q('view-form')
    },
    titles: {
      home: q('f03-home-title'),
      list: q('f03-list-title'),
      detail: q('f03-detail-title'),
      form: q('f03-form-title')
    },
    homeCount: q('f03-home-count'),
    homeDist: q('f03-home-dist'),
    homeAdd: q('f03-home-add'),
    homeAll: q('f03-home-all'),
    homeRecent: q('f03-home-recent'),
    homeRecentEmpty: q('f03-home-recent-empty'),
    listBack: q('f03-list-back'),
    listAdd: q('f03-list-add'),
    searchInput: q('f03-search-input'),
    filterBtn: q('f03-filter-btn'),
    filterCount: q('f03-filter-count'),
    filterLayer: q('f03-filter-layer'),
    filterCats: q('f03-filter-cats'),
    listResults: q('f03-list-results'),
    listRows: q('f03-list-rows'),
    listEmpty: q('f03-list-empty'),
    listEmptyAdd: q('f03-list-empty-add'),
    listNoResults: q('f03-list-noresults'),
    clearSearch: q('f03-clear-search'),
    clearFilters: q('f03-clear-filters'),
    detailBack: q('f03-detail-back'),
    detailNote: q('f03-detail-note'),
    detailNoteTitle: q('f03-detail-note-title'),
    detailNoteBody: q('f03-detail-note-body'),
    readName: q('f03-read-name'),
    readCat: q('f03-read-cat'),
    readNote: q('f03-read-note'),
    detailEdit: q('f03-detail-edit'),
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
    noteField: q('f03-note-field'),
    note: q('f03-note'),
    dirtyHint: q('f03-dirty-hint'),
    opNote: q('f03-op-note'),
    opTitle: q('f03-op-title'),
    opBody: q('f03-op-body'),
    saveBtn: q('f03-save'),
    checkBtn: q('f03-check'),
    catLayer: q('f03-cat-layer'),
    catLayerClose: q('f03-cat-layer-close'),
    picker: q('f03-picker'),
    pickerLive: q('f03-cat-live'),
    dropNote: q('f03-cat-drop-note'),
    dropNoteText: q('f03-cat-drop-note-text'),
    leaveDialog: q('f03-leave-dialog'),
    stayBtn: q('f03-stay'),
    abandonBtn: q('f03-abandon'),
    reviewLayer: q('f03-review-layer'),
    reviewOpen: q('f03-review-open')
  };
  var pickerSearch = el.picker.querySelector('[data-picker-search]');

  /* ---------- المخزن والموصل (مصدر واحد قابل للاستبدال) ---------- */
  var store = window.F03Store;
  var connector = window.F03Sim.createConnector({ store: store });
  window.F03Sim.bindReviewPanel(el.reviewLayer, connector);

  /* ---------- حالة المستهلك ---------- */
  var state = {
    view: 'home',
    detailId: null,
    detailReturnTo: 'list',       /* مصدر الوصول إلى التفاصيل */
    formMode: 'add',
    formId: null,
    formReturnTo: 'home',         /* وجهة المغادرة بلا حفظ */
    formEpoch: 0,
    baseline: { name: '', category: null, note: '' },
    draftCategory: null,
    sending: null,
    attemptId: 0,
    readSeq: 0,
    pickerSession: 0,
    activeRead: null,             /* {readId, session, epoch} */
    op: 'idle',
    abandonRequested: false,
    leaveTrigger: null,
    catLayerOpen: false,
    dialogOpen: false,
    reviewOpen: false,
    openLayers: 0,
    search: '',
    appliedFilters: {},
    listScrollY: 0,
    staleIgnored: 0,
    events: []
  };

  function logEvent(kind, detail) {
    state.events.push({ t: kind, at: Date.now(), detail: detail || null });
    if (state.events.length > 80) state.events.splice(0, state.events.length - 80);
  }

  /* ---------- أدوات ---------- */
  function isReallyVisible(e) {
    var cs = window.getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function categoryObj(value) {
    if (!value) return null;
    var label = store.categoryLabel(value);
    return label ? { value: value, label: label } : { value: value, label: value };
  }

  function currentValues() {
    return {
      name: el.name.value,
      category: state.draftCategory ? state.draftCategory.value : null,
      note: el.note.value
    };
  }

  function sameValues(a, b) {
    return a.name === b.name && a.note === b.note && a.category === b.category;
  }

  function isDirty() {
    return !sameValues(currentValues(), state.baseline);
  }

  function nameValid(raw) {
    return String(raw).trim() !== ''; /* الفحص دون تغيير القيمة المكتوبة */
  }

  function inBusyOp() {
    return state.op === 'saving' || state.op === 'checking' || state.op === 'unknown';
  }

  function countPhrase(n) {
    if (n === 0) return 'لا عناصر بعد.';
    if (n === 1) return 'عنصر واحد.';
    if (n === 2) return 'عنصران.';
    if (n <= 10) return n + ' عناصر.';
    return n + ' عنصر.';
  }

  /* ---------- تبديل العروض: تركيز وتمرير موثقان ---------- */
  function showView(name, opts) {
    opts = opts || {};
    if (state.view === 'list' && name !== 'list') {
      state.listScrollY = window.scrollY || 0; /* حفظ سياق القائمة قبل المغادرة */
    }
    Object.keys(el.views).forEach(function (k) { el.views[k].hidden = k !== name; });
    state.view = name;
    logEvent('view:' + name);
    if (name === 'home') renderHome();
    if (name === 'list') renderList();
    if (name === 'detail') renderDetail();
    window.scrollTo(0, 0);
    if (name === 'list' && opts.restoreScroll !== false) {
      window.scrollTo(0, state.listScrollY || 0); /* استعادة موضع التمرير قد الإمكان */
    }
    if (opts.focus !== false) {
      var target = opts.focusEl || el.titles[name];
      /* preventScroll: التمرير قرار العرض صريحًا أعلاه — لا قفزة تركيز تفسد الاستعادة */
      if (target) target.focus({ preventScroll: true });
    }
  }

  /* ---------- الرئيسية: ملخص من البيانات الفعلية فقط ---------- */
  function renderHome() {
    var items = store.all();
    var total = items.length;
    var cats = store.categories();
    var used = 0;
    el.homeDist.textContent = '';
    cats.forEach(function (c) {
      var n = items.filter(function (it) { return it.category === c.value; }).length;
      if (n > 0) used += 1;
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
      value.textContent = String(n);
      head.appendChild(label);
      head.appendChild(value);
      var track = document.createElement('div');
      track.className = 'm-progress__track';
      var bar = document.createElement('div');
      bar.className = 'm-progress__bar';
      var pct = total > 0 ? Math.round((n / total) * 100) : 0;
      bar.style.setProperty('--progress', pct + '%');
      track.appendChild(bar);
      row.appendChild(head);
      row.appendChild(track);
      el.homeDist.appendChild(row);
    });
    el.homeCount.textContent = total === 0
      ? countPhrase(0)
      : countPhrase(total) + ' موزعة على ' + used + (used === 1 ? ' فئة.' : ' فئات.');
    el.homeAll.textContent = 'عرض جميع العناصر (' + total + ')';

    el.homeRecent.textContent = '';
    var recent = items.slice().sort(function (a, b) { return b.updatedAt - a.updatedAt; }).slice(0, 3);
    recent.forEach(function (it) { el.homeRecent.appendChild(rowNode(it)); });
    el.homeRecentEmpty.hidden = total !== 0;
    el.homeRecent.hidden = total === 0;
  }

  function rowNode(it) {
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'f03-row';
    btn.setAttribute('data-id', it.id);
    var name = document.createElement('span');
    name.className = 'f03-row__name';
    name.textContent = it.name;
    var meta = document.createElement('span');
    meta.className = 'f03-row__meta';
    meta.textContent = store.categoryLabel(it.category) || '—';
    btn.appendChild(name);
    btn.appendChild(meta);
    li.appendChild(btn);
    return li;
  }

  /* ---------- القائمة: بحث وتصفية على البيانات ---------- */
  function matchesFilters(it) {
    var q = state.search.trim().toLowerCase();
    if (q && (it.name + ' ' + it.note).toLowerCase().indexOf(q) < 0) return false;
    for (var k in state.appliedFilters) {
      if (state.appliedFilters[k] === true && it.category !== k) return false;
    }
    return true;
  }

  function renderList() {
    var items = store.all();
    var filtered = items.filter(matchesFilters);
    el.listRows.textContent = '';
    filtered.forEach(function (it) { el.listRows.appendChild(rowNode(it)); });

    var isNoData = items.length === 0;
    var isNoMatch = !isNoData && filtered.length === 0;
    el.listEmpty.hidden = !isNoData;
    el.listNoResults.hidden = !isNoMatch;
    el.listRows.hidden = isNoData || isNoMatch;
    el.listResults.hidden = isNoData;
    el.listResults.textContent = 'النتائج: ' + filtered.length;
    el.clearSearch.hidden = state.search.trim() === '';
    var anyFilter = Object.keys(state.appliedFilters).some(function (k) { return state.appliedFilters[k] === true; });
    el.clearFilters.hidden = !anyFilter;
    updateFilterCounter();
  }

  function updateFilterCounter() {
    var n = Object.keys(state.appliedFilters).filter(function (k) { return state.appliedFilters[k] === true; }).length;
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
  el.filterLayer.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.filterLayer) return;
  });

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
  el.clearFilters.addEventListener('click', function () {
    state.appliedFilters = {};
    el.filterCats.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
    renderList();
  });

  /* صفوف القائمة وأحدث العناصر: هدف واحد واضح يفتح تفاصيل العنصر الصحيح */
  el.listRows.addEventListener('click', function (e) {
    var row = e.target.closest('.f03-row');
    if (row) openDetail(row.getAttribute('data-id'), { from: 'list' });
  });
  el.homeRecent.addEventListener('click', function (e) {
    var row = e.target.closest('.f03-row');
    if (row) openDetail(row.getAttribute('data-id'), { from: 'home' });
  });

  /* ---------- التفاصيل ---------- */
  function clearDetailNote() {
    el.detailNote.hidden = true;
    el.detailNote.setAttribute('data-detail-state', 'idle');
    el.detailNoteTitle.textContent = '';
    el.detailNoteBody.textContent = '';
  }

  function setDetailNote(variant, title, body) {
    /* تُكتب مرة واحدة بعد ظهور سياق التفاصيل فعليًا (الموجز §7) */
    el.detailNote.hidden = false;
    el.detailNote.className = 'm-note m-note--' + variant + ' f03-detail-note';
    el.detailNote.setAttribute('data-detail-state', variant);
    el.detailNoteTitle.textContent = title;
    el.detailNoteBody.textContent = body;
  }

  function renderDetail() {
    var item = state.detailId ? store.get(state.detailId) : null;
    if (!item) {
      el.readName.textContent = '—';
      el.readCat.textContent = '—';
      el.readNote.textContent = '—';
      return;
    }
    el.readName.textContent = item.name;
    el.readCat.textContent = store.categoryLabel(item.category) || '—';
    el.readNote.textContent = item.note === '' ? '—' : item.note;
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

  /* ---------- إضافة/تعديل: فتح النموذج من المصدر الواحد ---------- */
  function openForm(opts) {
    var mode = opts.mode === 'edit' ? 'edit' : 'add';
    state.formEpoch += 1;
    state.formMode = mode;
    state.formId = opts.id || null;
    state.formReturnTo = mode === 'edit' ? 'detail' : state.view;
    var item = mode === 'edit' ? store.get(state.formId) : null;
    state.baseline = item
      ? { name: item.name, category: item.category, note: item.note }
      : { name: '', category: null, note: '' };
    el.formTitle.textContent = mode === 'add' ? 'إضافة عنصر' : 'تعديل العنصر';
    el.name.value = state.baseline.name;
    el.note.value = state.baseline.note;
    setDraftCategory(item ? categoryObj(item.category) : null);
    setNameError(false);
    setCatError(false);
    state.op = 'idle';
    state.sending = null;
    clearOpMessage();
    el.checkBtn.hidden = true;
    setFieldsReadonly(false);
    renderDirtyHint();
    showView('form', { focusEl: el.name });
    logEvent('form:open:' + mode, { id: state.formId });
  }

  el.homeAdd.addEventListener('click', function () { openForm({ mode: 'add' }); });
  el.listAdd.addEventListener('click', function () { openForm({ mode: 'add' }); });
  el.listEmptyAdd.addEventListener('click', function () { openForm({ mode: 'add' }); });
  el.homeAll.addEventListener('click', function () { showView('list'); });
  el.listBack.addEventListener('click', function () { showView('home'); });

  /* ---------- حالة الحقول والرسائل ---------- */
  function setFieldsReadonly(ro) {
    /* readOnly يفقد التحرير ويحفظ القراءة والنسخ — ليس fieldset معطلاً */
    el.name.readOnly = ro;
    el.note.readOnly = ro;
    el.nameField.classList.toggle('has-readonly', ro);
    el.noteField.classList.toggle('has-readonly', ro);
    el.catTrigger.disabled = ro; /* لا تغيير فئة قبل حسم النتيجة */
  }

  function setNameError(show, text) {
    el.nameField.classList.toggle('has-error', show);
    if (show) {
      el.name.setAttribute('aria-invalid', 'true');
      el.nameMsg.textContent = text;
      el.nameMsg.hidden = false;
      el.nameMsg.classList.add('is-visible');
    } else {
      el.name.removeAttribute('aria-invalid');
      el.nameMsg.hidden = true;
      el.nameMsg.classList.remove('is-visible');
      el.nameMsg.textContent = '';
    }
  }
  function nameErrorActive() {
    return el.nameField.classList.contains('has-error');
  }

  function setCatError(show, text) {
    el.catField.classList.toggle('has-error', show);
    if (show) {
      el.catMsg.textContent = text;
      el.catMsg.hidden = false;
      el.catMsg.classList.add('is-visible');
    } else {
      el.catMsg.hidden = true;
      el.catMsg.classList.remove('is-visible');
      el.catMsg.textContent = '';
    }
  }
  function catErrorActive() {
    return el.catField.classList.contains('has-error');
  }

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
  function syncAfterInput() {
    renderDirtyHint();
    /* UX-09: بعد معرفة خطأ محدد أعد تقييمه عند التصحيح */
    if (nameErrorActive() && nameValid(el.name.value)) setNameError(false);
    /* رسالة عملية سابقة انتهى سببها بتغير القيم تزال (F01-R1-03):
       failed/idle تزال الرسالة وfailed يبقى سجل محاولة فقط. */
    if (state.op === 'saved') {
      state.op = 'idle';
      clearOpMessage();
    } else if (state.op === 'failed' || state.op === 'idle') {
      state.op = 'idle';
      clearOpMessage();
    }
  }
  el.name.addEventListener('input', syncAfterInput);
  el.note.addEventListener('input', syncAfterInput);

  /* ---------- الحفظ: حراسة المستهلك + تحقق عند الإرسال ---------- */
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    attemptSave();
  });

  function attemptSave() {
    /* حراسة المستهلك إضافة لحراسة الزر: submit لا يلزم أن يأتي من click.
       saving/checking: لا عملية جديدة إطلاقًا. unknown: الحفظ ممنوع
       سلوكيًا وشرح السبب باقٍ — لا إعادة إرسال تلقائية أبدًا. */
    if (state.op === 'saving' || state.op === 'checking' || state.op === 'unknown') return;

    var values = currentValues();

    /* حفظ clean: لا دعوة ولا loading ولا نجاح جديد — لا عملية تُنشأ */
    if (!isDirty()) {
      setOpMessage('info', 'لا تغييرات', 'لا تغييرات للحفظ.');
      return;
    }

    /* إدخال غير صالح: لا عملية — عرّف موضع الخطأ وسببه، حافظ القيم،
       وركّز موضع التصحيح (UX-10) */
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

    /* حفظ dirty صالح: نسخة إرسال ثابتة (خام بلا trim) + معرف محاولة */
    state.attemptId += 1;
    state.sending = {
      mode: state.formMode,
      id: state.formId,
      values: { name: values.name, category: values.category, note: values.note }
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
      values: {
        name: state.sending.values.name,
        category: state.sending.values.category,
        note: state.sending.values.note
      }
    }).then(handleSaveResult, function (err) {
      /* عقد الإلغاء الصريح: سياق الطلب انتهى — تجاهل صامت موثق */
      if (err && err.cancelled) { logEvent('save:cancelled', { attemptId: state.attemptId }); return; }
      /* رفض Promise أثناء save بلا عقد عدم حفظ: نتيجة مجهولة لا رفض مؤكد */
      endSaveBusy();
      enterUnknown('انتهت محاولة الحفظ بنتيجة غير مؤكدة — تحقق من النتيجة قبل أي تعديل.');
    });
  }

  function belongsToActiveAttempt(res) {
    return !!(res && typeof res === 'object' && res.attemptId === state.attemptId);
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
    endSaveBusy();
    if (res.outcome === 'saved') {
      applySaved(res.item);
    } else if (res.outcome === 'not-saved') {
      applyFailed('لم تُحفظ التعديلات', 'يمكنك التصحيح والمحاولة مجددًا.');
    } else {
      enterUnknown('انتهت محاولة الحفظ بنتيجة غير مؤكدة — تحقق من النتيجة قبل أي تعديل.');
    }
  }

  /* (R1-06) نجاح مؤكد: تحديث المؤكد ثم الانتقال إلى التفاصيل ثم كتابة
     رسالة النجاح مرة واحدة في قناة سياق التفاصيل الظاهرة — الترتيب يُسجل */
  function applySaved(item) {
    state.baseline = {
      name: state.sending.values.name,
      category: state.sending.values.category,
      note: state.sending.values.note
    };
    var savedItem = item || (state.sending.id ? store.get(state.sending.id) : null);
    var mode = state.sending.mode;
    state.op = 'idle';
    state.sending = null;
    setFieldsReadonly(false);
    renderDirtyHint();
    clearOpMessage();
    logEvent('save:saved', { attemptId: state.attemptId, id: savedItem && savedItem.id, mode: mode });

    clearDetailNote();
    if (mode === 'add') state.detailReturnTo = 'list';
    state.detailId = savedItem ? savedItem.id : state.detailId;
    renderHome();
    renderList(); /* القائمة تُحدَّث في محتواها بترتيبها المستقر */
    showView('detail'); /* الانتقال الفعلي ثم الكتابة مرة واحدة */
    setDetailNote('success', mode === 'add' ? 'تمت إضافة العنصر' : 'تم حفظ التعديلات', 'القائمة والرئيسية محدّثة.');
    logEvent('note:written', { context: 'detail', attemptId: state.attemptId });
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

  /* (F01-R1-02) إخفاء زر تحقق مركّز يُسقط التركيز إلى BODY. إن كان
     التركيز على الزر عند حسم النتيجة ننقله قبل الإخفاء إلى زر الحفظ —
     وإن نقل المستخدم تركيزه فلا نسرقه. */
  function refocusIfCheckFocused() {
    if (document.activeElement === el.checkBtn) el.saveBtn.focus();
  }

  function handleCheckResult(res) {
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      logEvent('stale:ignored', { channel: 'check', receivedAttemptId: res && res.attemptId });
      return;
    }
    window.MicroButtons.setLoading(el.checkBtn, false);
    if (res.outcome === 'saved') {
      refocusIfCheckFocused();
      el.checkBtn.hidden = true;
      applySaved(res.item);
      logEvent('check:saved', { attemptId: state.attemptId });
    } else if (res.outcome === 'not-saved') {
      refocusIfCheckFocused();
      el.checkBtn.hidden = true;
      applyFailed('تأكدت النتيجة: لم تُحفظ التعديلات', 'القيم باقية ويمكنك التصحيح والمحاولة مجددًا.');
    } else {
      /* تحقق بنتيجة مجهولة: عودة unknown بقيم كما هي وإمكان إعادة تحقق */
      state.op = 'unknown';
      setOpMessage('warning', 'تعذر تأكيد النتيجة', 'تعذر تأكيد النتيجة، تحقق مجددًا.');
      logEvent('check:unknown', { attemptId: state.attemptId });
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

  /* التركيز يُنقل إلى البحث الثابت فقط قبل زوال عنصر مركّز سيُخفى — نمط F02 */
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
    /* (R1-05) الطلب مرتبط بجلسة فتح المنتقي وجلسة النموذج معًا */
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
        /* عقد الإلغاء الصريح: سياق القراءة انتهى — تجاهل صامت موثق */
        logEvent('read:cancelled', { readId: readId });
        return;
      }
      /* رفض Promise قراءة = خطأ قراءة معروف (عقد الموصل) */
      handleReadResult({ readId: readId, outcome: 'error', items: [] });
    });
  }

  function handleReadResult(res) {
    /* (R1-05) الرد لا يُطبق إلا في سياقه الحي: نفس الجلسة، نفس جلسة
       النموذج، الطبقة مفتوحة فعليًا، والمستخدم في النموذج — وإلا يُبطل */
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
        /* الإعلان من الحالة الفعلية الظاهرة لا عدد المصدر وحده (F02-R2-02) */
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
      /* empty مؤكدة تطبق مصدرًا فارغًا وتُسقط فئة النموذج الجارية برسالة
         الزوال — لا بديل تلقائي (نمط F02-R1-02) */
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

  /* بعد setOptions: فئة النموذج الجارية يجب أن تطابق المنتقي دائمًا.
     السقوط وحده يوجَّه إلى رسالة الزوال الظاهرة داخل الطبقة (قناة
     واحدة لهذا الحدث) — ويُلزم باختيار عند الحفظ. */
  function syncDraftFromPicker() {
    var cur = window.MicroPicker.getSelected(el.picker);
    if (cur) {
      if (!state.draftCategory || state.draftCategory.value !== cur.value || state.draftCategory.label !== cur.label) {
        state.draftCategory = { value: cur.value, label: cur.label };
        setDropNote(''); /* سبب الرسالة زال بوجود الفئة */
        if (catErrorActive()) setCatError(false);
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
      /* اختيار مستخدم: فوري ومحلي ثم إغلاق الطبقة (لا Apply ثانٍ) */
      state.draftCategory = { value: d.value, label: d.label };
      setDropNote(''); /* سبب الرسالة زال باختيار جديد */
      if (catErrorActive()) setCatError(false);
      renderCatTrigger();
      renderDirtyHint();
      syncAfterInput();
      logEvent('picker:selected', { value: d.value });
      window.MicroNavigation.closeLayer(el.catLayer);
    } else {
      /* مسح أو سقوط الاختيار: تزامن دون إغلاق — رسالة السقوط تصدر من
         syncDraftFromPicker بعد setOptions */
      syncDraftFromPicker();
    }
  });

  el.picker.addEventListener('micro-picker:retry', function () {
    startRead(); /* طلب واحد واضح لكل نقرة إعادة محاولة */
  });

  el.catTrigger.addEventListener('click', function () {
    if (el.catTrigger.disabled) return;
    window.MicroNavigation.openLayer(el.catLayer, { trigger: el.catTrigger });
  });

  /* كل فتح للمنتقي: جلسة جديدة بمعرف جديد + بذرة فئة النموذج الجارية */
  el.catLayer.addEventListener('micro-navigation:opened', function () {
    state.catLayerOpen = true;
    state.pickerSession += 1;
    logEvent('picker:opened', { session: state.pickerSession });
    window.MicroPicker.setOptions(el.picker, store.categories());
    if (state.draftCategory) syncPickerSeed();
    else window.MicroPicker.clearSelection(el.picker);
    startRead();
  });

  /* (R1-05) عند إغلاق المنتقي: إبطال سياق القراءة وإلغاء الطلب إلغاءً
     صريحًا فلا يغير رد لاحق جلسة أحدث؛ رسالة الزوال تخرج من النطاق
     وتُمسح، وقناة القراءة تُفرغ، والتركيز أعادته B07 إلى صف الفئة */
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

  /* مزامنة بحث المنتقي مع القناة داخل الطبقة — نمط F02-R2-02:
     لا إعلان قديم يوهم بوجود نتائج، ومسح البحث يعلن الظاهر فعليًا. */
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
      if (row) return; /* صف حالة قراءة (loading/error/empty) — مسار القراءة يعلنها */
      var visible = pickerVisibleOptionCount();
      if (pickerSearch.value.trim() === '') {
        announceReadState('الفئات الظاهرة: ' + visible + ' فئات.');
      } else {
        announceReadState('نتائج البحث: ' + visible + ' فئات.');
      }
    });
  }

  /* ---------- رسالة زوال الفئة داخل طبقة المنتقي (قناة وحيدة) ---------- */
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
    /* مغادرة النموذج تُبطل سياق أي قراءة معلقة (لا ينبغي أن توجد بعد
       حراسة busy، والإلغاء الصريح عقد أمان) */
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

  /* Escape: قرار مستهلك موثق (الموجز §7) — مستمع التقاط على المستند يسبق
     مستمع B07 ويوجّه الحدث دون تعديل عقد B07:
     - أي طبقة مفتوحة (منتقي/حوار/مراجعة/تصفية): يُمرَّر إلى B07.
     - نموذج dirty: حوار البقاء/التجاهل — لا Escape صامت للتخلي (UX-17).
     - نموذج pending: حجب برسالة موجزة.
     - غير ذلك: لا فعل (موثق). */
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
      state.leaveTrigger = el.formBack; /* هدف استرجاع تركيز موثق لـEscape */
      window.MicroNavigation.openLayer(el.leaveDialog, { trigger: state.leaveTrigger });
    }
  }, true);

  /* حوار البقاء/التجاهل: كل إغلاق غير «التجاهل» = بقاء (B07 يستعيد
     التركيز للمشغّل بنفسه ولا نمس القيم ولا نغادر) */
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
    /* التجاهل وحده يغادر النموذج بعد اكتمال إغلاق الحوار — بلا أي حفظ،
       والبيانات المحفوظة كما هي (لا استرجاع مطلوب: النموذج يُبث من
       المؤكد عند كل فتح) */
    closeFormTo(state.formReturnTo);
  });

  /* ---------- عدّ الطبقات المفتوحة (لتوجيه Escape) ---------- */
  [el.catLayer, el.leaveDialog, el.reviewLayer, el.filterLayer].forEach(function (layer) {
    layer.addEventListener('micro-navigation:opened', function () {
      state.openLayers += 1;
    });
    layer.addEventListener('micro-navigation:closed', function (e) {
      if (e.target !== layer) return;
      state.openLayers = Math.max(0, state.openLayers - 1);
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

  /* ---------- أدوات البيانات في وضع المراجعة ---------- */
  function afterDataTool() {
    if (state.activeRead) {
      connector.cancel('read', state.activeRead.readId);
      state.activeRead = null;
    }
    el.searchInput.value = '';
    state.search = '';
    state.appliedFilters = {};
    el.filterCats.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
    if (state.view === 'form') {
      /* فعل أداة وليس مغادرة مستخدم: عودة مباشرة بلا حوار (موثق) */
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
    renderHome();
    renderList();
    renderDetail();
  }

  /* ---------- تسليم رد فحص بمعرف قديم (نمط F01-R1-05) ----------
     يستدعي معالِج النتائج نفسه لدى المستهلك (الذي تستدعيه حلول Promise)
     بذات فلاتر attemptId/سياق القراءة — دون استهلاك Promise الطلب المعلق،
     فيظل الطلب قادرًا على الحسم بنتيجته الصحيحة بعد تجاهل الرد القديم.
     ما يثبته: فلاتر المستهلك وتجاهلها الكامل — لا يثبت وصولًا شبكيًا. */
  function deliverTestResponse(kind, payload) {
    if (kind === 'save') handleSaveResult(payload);
    else if (kind === 'check') handleCheckResult(payload);
    else if (kind === 'read') handleReadResult(payload);
  }

  /* ---------- واجهة الفحص البرمجي (محايدة التركيز — للفحص فقط) ---------- */
  var F03App = {
    version: 'F03-V2',
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
    /* الحدث المحايد لفتح النموذج (للفحص البرمجي دون افتراضات) */
    openForm: openForm,
    openDetail: openDetail,
    showView: function (name) { showView(name); },
    inspect: inspect
  };

  function inspect() {
    var active = document.activeElement;
    var options = [].slice.call(el.picker.querySelectorAll('.m-picker__option'));
    var rows = [].slice.call(el.listRows.querySelectorAll('.f03-row'));
    var recentRows = [].slice.call(el.homeRecent.querySelectorAll('.f03-row'));
    var distRows = [].slice.call(el.homeDist.querySelectorAll('.m-progress'));
    var filterChecks = [].slice.call(el.filterCats.querySelectorAll('input[type="checkbox"]'));
    var homeItems = store.all();
    var recentSorted = homeItems.slice().sort(function (a, b) { return b.updatedAt - a.updatedAt; }).slice(0, 3);
    return {
      version: F03App.version,
      view: state.view,
      op: state.op,
      dirty: isDirty(),
      formMode: state.formMode,
      formId: state.formId,
      formReturnTo: state.formReturnTo,
      formEpoch: state.formEpoch,
      pickerSession: state.pickerSession,
      attemptId: state.attemptId,
      readSeq: state.readSeq,
      baseline: Object.assign({}, state.baseline),
      current: currentValues(),
      draftCategory: state.draftCategory ? { value: state.draftCategory.value, label: state.draftCategory.label } : null,
      sending: state.sending
        ? { mode: state.sending.mode, id: state.sending.id, values: Object.assign({}, state.sending.values) }
        : null,
      formTitle: el.formTitle.textContent,
      nameError: nameErrorActive(),
      nameMsgText: el.nameMsg.hidden ? '' : el.nameMsg.textContent,
      nameAriaInvalid: el.name.getAttribute('aria-invalid') === 'true',
      nameDescribedBy: el.name.getAttribute('aria-describedby') || '',
      catError: catErrorActive(),
      catMsgText: el.catMsg.hidden ? '' : el.catMsg.textContent,
      catTriggerDisabled: el.catTrigger.disabled,
      catTriggerLabel: el.catTrigger.getAttribute('aria-label') || '',
      readonly: el.name.readOnly && el.note.readOnly,
      saveBusy: el.saveBtn.getAttribute('aria-busy') === 'true',
      checkBusy: el.checkBtn.getAttribute('aria-busy') === 'true',
      checkVisible: isReallyVisible(el.checkBtn),
      checkBox: (function () {
        var r = el.checkBtn.getBoundingClientRect();
        return { display: window.getComputedStyle(el.checkBtn).display, hiddenAttr: el.checkBtn.hidden, w: Math.round(r.width), h: Math.round(r.height) };
      })(),
      formMessage: el.opNote.hidden ? null : {
        variant: el.opNote.getAttribute('data-op-state'),
        title: el.opTitle.textContent,
        text: el.opBody.textContent
      },
      formMessageVisible: isReallyVisible(el.opNote),
      dirtyHintVisible: !el.dirtyHint.hidden,
      detailId: state.detailId,
      detailReturnTo: state.detailReturnTo,
      detailRead: {
        name: el.readName.textContent,
        category: el.readCat.textContent,
        note: el.readNote.textContent
      },
      detailNote: el.detailNote.hidden ? null : {
        variant: el.detailNote.getAttribute('data-detail-state'),
        title: el.detailNoteTitle.textContent,
        text: el.detailNoteBody.textContent
      },
      detailNoteVisible: isReallyVisible(el.detailNote),
      detailNoteInertAncestor: !!el.detailNote.closest('[inert]'),
      home: {
        countLine: el.homeCount.textContent,
        allBtnText: el.homeAll.textContent,
        distribution: distRows.map(function (row) {
          var r = row.querySelector('.m-progress__bar');
          return {
            cat: row.getAttribute('data-cat'),
            label: row.querySelector('.m-progress__label').textContent,
            value: row.querySelector('.m-progress__value').textContent,
            width: r ? r.style.getPropertyValue('--progress') : ''
          };
        }),
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
        filterCount: el.filterCount.textContent,
        filterCounterHidden: el.filterCount.hidden,
        filterCounterZeroClass: el.filterCount.classList.contains('m-btn__counter--zero'),
        filterAria: el.filterBtn.getAttribute('aria-label') || ''
      },
      filterPanelOpen: !el.filterLayer.hidden,
      filterChecks: filterChecks.map(function (cb) {
        return { key: cb.getAttribute('data-filter-key'), label: cb.getAttribute('data-filter-label'), checked: cb.checked };
      }),
      pickerOpen: !el.catLayer.hidden,
      dialogOpen: !el.leaveDialog.hidden,
      reviewOpen: !el.reviewLayer.hidden,
      openLayers: state.openLayers,
      focusId: active ? (active.id || active.tagName.toLowerCase()) : 'none',
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
          display: getComputedStyle(o).display,
          visibleRect: r.width > 0 && r.height > 0,
          h: Math.round(r.height)
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
      scrollY: Math.round(window.scrollY || 0),
      saveCalls: connector.counters.save,
      checkCalls: connector.counters.check,
      readCalls: connector.counters.read,
      staleIgnored: state.staleIgnored,
      storage: store.storageStatus(),
      sim: connector.readout(),
      events: state.events.slice()
    };
  }
  window.F03App = F03App;

  /* ---------- إقلاع: بناء التصفية والرئيسية بلا طلبات ولا أحداث ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    buildFilterCats();
    bindSearchAnnouncement();
    renderHome();
    showView('home', { focus: false });
    logEvent('boot', { storage: store.storageStatus().persistent ? 'local' : 'session' });
  }
})();

