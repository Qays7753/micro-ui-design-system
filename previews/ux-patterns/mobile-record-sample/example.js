/* =========================================================
   Micro UI — UX-F03: سلوك المستهلك لعينة «عرض عنصر وتعديله وحفظه»
   الملف: previews/ux-patterns/mobile-record-sample/example.js
   الحالة: DRAFT FOR REVIEW — سلوك مستهلك للعينة، ليس framework عام
   ولا منطق أعمال، ولا يعدّل أي مصدر UI.
   مصدر القواعد: docs/ux/F03-ACCEPTANCE.md §2..3 و§5.

   مصدر الحقيقة:
   - confirmed: النسخة المؤكدة {name, category:{value,label}, note}
     تبدأ من RECORD_INIT أدناه (مصدر وحيد يُبث عند الإقلاع).
   - draftCategory: فئة اللوحة الجارية (مرآة حالة المستهلك؛ الحقول
     النصية قيمها من input/textarea نفسهما).
   - sending: نسخة إرسال ثابتة عند بدء الحفظ (خام بلا trim).
   - attemptId / readSeq: معرفا محاولة الحفظ وقراءة الفئات المتزايدان —
     الردود بمعرف أقدم تُتجاهل كليًا (لا قيمة/رسالة/تركيز).
   - op: idle | saving | failed | unknown | checking | saved
   - dirty محور مستقل: اختلاف أي قيمة خام (الاسم/قيمة الفئة/الملاحظة)
     عن المؤكدة؛ الكتابة ثم العودة لنفس القيم تعيد clean دون حفظ.

   قرارات موثقة (تفصيلها في README.md):
   - النموذج داخل لوحة B07 سفلية (التطبيق المؤجل من قرار F01) وحراسة
     مغادرته في المستهلك: «رجوع» وزر الإغلاق الظاهر بلا [data-layer-close]
     كي يمرا عبر الحارس، والخلفية data-backdrop="keep" (بقاء ضمني)،
     وEscape يوجَّه بطور الالتقاط: نظيف → يُمرَّر إلى B07 (إغلاق عادي)،
     dirty → حوار البقاء/التخلي (UX-17: لا Escape صامت للتخلي)،
     pending → حجب برسالة موجزة. لا تعديل على عقد B07.
   - قناة واحدة لكل سياق: أثناء فتح اللوحة رسالة العملية ملاحظة B06
     ثابتة role=status داخلها (#f03-op-note) بلا MicroMessages.announce
     لنصها؛ بعد النجاح وإغلاق اللوحة قناة سياق العرض (#f03-view-note
     role=status) هي المالكة للحدث (نمط توجيه F02-R2-01). خطأ الاسم عبر
     aria-describedby/aria-invalid في رسالة الحقل، وخطأ الفئة عبر
     رسالة صف الفئة مرتبطة aria-describedby — بلا مصدر إعلان ثانٍ.
     رسالة زوال الفئة داخل طبقة المنتقي ظاهرة (m-note--warning +
     role=alert وفق مواصفة B06) وهي القناة الوحيدة لهذا الحدث.
   - المنتقي المعتمد (MicroPicker) داخل طبقة B07 ثانية فوق اللوحة:
     كل فتح قراءة جديدة بمعرف جديد؛ loading/error/empty تخفي الخيارات
     القديمة؛ البحث لا يلغي الحالة ولا يزيل صفها؛ empty المؤكدة تطبق
     مصدرًا فارغًا وتُسقط فئة اللوحة الجارية برسالة الزوال (لا بديل
     تلقائي) وتُلزم باختيار عند الحفظ؛ رد بمعرف قديم يُتجاهل كليًا.
   - unknown: الحقول readOnly وزر الفئة معطل (لا تحرير قبل حسم النتيجة،
     والوصول والقراءة محفوظان) وزر «التحقق من النتيجة» يظهر ظهورًا
     فعليًا (#f03-check[hidden] بقاعدة عينة — درس F01-R1-01)؛ الحفظ
     محروس سلوكيًا ولا إعادة إرسال تلقائية.
   - نجاح مؤكد: المؤكدة = نسخة الإرسال، اللوحة تغلق وتُعرض النتيجة في
     قناة سياق العرض ويستعيد B07 التركيز لمشغّل «تعديل» — دورة المهمة
     تكتمل. زر التحقق المركز عند حسم النتيجة ينتقل تركيزه قبل إخفائه
     إلى زر الحفظ (درس F01-R1-02) ما لم ينقل المستخدم تركيزه.
   - رسائل انتهى سببها تزال عند تغير القيم (درس F01-R1-03): رسالة
     نجاح العرض تُمسح عند فتح تعديل جديد، ورسائل اللوحة تتبع القيم.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- ثوابت البداية: مصدر وحيد للتعديل ----------
     عدّل هذه الثوابت فقط وتنعكس في منظر العرض وحقول اللوحة والمنتقي
     والموصل والفحص دون إعادة إنشاء (درس F01-R1-04). لا قيم مكررة في HTML. */
  var RECORD_INIT = {
    name: 'عنصر تجريبي',
    category: { value: 'cat-a', label: 'فئة أ' },
    note: ''
  };
  /* الفئات التركيبية الثلاث: تمرر إلى الموصل كبيانات القراءة */
  var CATEGORIES_INIT = [
    { value: 'cat-a', label: 'فئة أ' },
    { value: 'cat-b', label: 'فئة ب' },
    { value: 'cat-c', label: 'فئة ج' }
  ];

  /* ---------- عناصر العينة ---------- */
  var el = {
    view: document.getElementById('f03-view'),
    viewTitle: document.getElementById('f03-view-title'),
    viewNote: document.getElementById('f03-view-note'),
    viewNoteTitle: document.getElementById('f03-view-note-title'),
    viewNoteBody: document.getElementById('f03-view-note-body'),
    readName: document.getElementById('f03-read-name'),
    readCat: document.getElementById('f03-read-cat'),
    readNote: document.getElementById('f03-read-note'),
    editBtn: document.getElementById('f03-edit-btn'),
    sheet: document.getElementById('f03-edit-sheet'),
    sheetClose: document.getElementById('f03-edit-close'),
    form: document.getElementById('f03-form'),
    nameField: document.getElementById('f03-name-field'),
    name: document.getElementById('f03-name'),
    nameMsg: document.getElementById('f03-name-msg'),
    catField: document.getElementById('f03-cat-field'),
    catTrigger: document.getElementById('f03-cat-trigger'),
    catValue: document.getElementById('f03-cat-value'),
    catMsg: document.getElementById('f03-cat-msg'),
    noteField: document.getElementById('f03-note-field'),
    note: document.getElementById('f03-note'),
    dirtyHint: document.getElementById('f03-dirty-hint'),
    opNote: document.getElementById('f03-op-note'),
    opTitle: document.getElementById('f03-op-title'),
    opBody: document.getElementById('f03-op-body'),
    backBtn: document.getElementById('f03-back'),
    saveBtn: document.getElementById('f03-save'),
    checkBtn: document.getElementById('f03-check'),
    catLayer: document.getElementById('f03-cat-layer'),
    picker: document.getElementById('f03-picker'),
    pickerLive: document.getElementById('f03-cat-live'),
    dropNote: document.getElementById('f03-cat-drop-note'),
    dropNoteText: document.getElementById('f03-cat-drop-note-text'),
    leaveDialog: document.getElementById('f03-leave-dialog'),
    stayBtn: document.getElementById('f03-stay'),
    abandonBtn: document.getElementById('f03-abandon')
  };
  var searchInput = el.picker.querySelector('[data-picker-search]');

  /* ---------- حالة المستهلك ---------- */
  var state = {
    confirmed: copyRecord(RECORD_INIT),
    draftCategory: { value: RECORD_INIT.category.value, label: RECORD_INIT.category.label },
    sending: null,
    attemptId: 0,
    readSeq: 0,
    op: 'idle', /* idle|saving|failed|unknown|checking|saved */
    staleIgnored: 0,
    abandonRequested: false,
    leaveTrigger: null, /* مشغّل حوار المغادرة (رجوع/إغلاق/Escape → رجوع) */
    catLayerOpen: false,
    dialogOpen: false
  };

  function copyRecord(r) {
    return {
      name: r.name,
      category: r.category ? { value: r.category.value, label: r.category.label } : null,
      note: r.note
    };
  }

  /* الموصل التجريبي — قابل للاستبدال (واجهة mock-adapter.js) */
  var connector = window.F03Sim.createConnector({ categories: CATEGORIES_INIT });
  window.F03Sim.bindSimulationPanel(document.getElementById('f03-sim'), connector);

  /* ---------- التهيئة من المصدر الواحد ---------- */
  function applyInitialValues() {
    el.name.value = state.confirmed.name;
    el.note.value = state.confirmed.note;
    el.readName.textContent = state.confirmed.name;
    el.readNote.textContent = state.confirmed.note === '' ? '—' : state.confirmed.note;
    setDraftCategory(state.confirmed.category, { syncPickerSummary: false });
    renderReadView();
  }

  function renderReadView() {
    el.readName.textContent = state.confirmed.name;
    el.readCat.textContent = state.confirmed.category ? state.confirmed.category.label : '—';
    el.readNote.textContent = state.confirmed.note === '' ? '—' : state.confirmed.note;
  }

  /* الاسم الإتاحي لصف الفئة يصف الفعل والقيمة الحالية ويُحدث دائمًا */
  function renderCatTrigger() {
    el.catValue.textContent = state.draftCategory ? state.draftCategory.label : 'لم تُحدد فئة';
    el.catTrigger.setAttribute('aria-label', state.draftCategory
      ? 'تغيير الفئة، الفئة الحالية: ' + state.draftCategory.label
      : 'تغيير الفئة، لا فئة محددة — اختر فئة');
  }

  function setDraftCategory(category, opts) {
    state.draftCategory = category ? { value: category.value, label: category.label } : null;
    renderCatTrigger();
    /* بذرة داخل المنتقي نفسه كي يطابق الملخص فئة اللوحة الجارية (نمط F02) */
    if (opts && opts.syncPickerSummary !== false && !el.catLayer.hidden) {
      syncPickerSeed();
    }
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

  /* ---------- قياس الظهور الفعلي (لا سمة hidden وحدها) ---------- */
  function isReallyVisible(e) {
    var cs = window.getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  /* ---------- أدوات الحالة ---------- */
  function currentValues() {
    return {
      name: el.name.value,
      category: state.draftCategory ? state.draftCategory.value : null,
      note: el.note.value
    };
  }
  function catValueOf(c) {
    /* القيمة الجارية نص؛ والمؤكدة كائن {value,label} — القارنة على value */
    return c == null ? null : (typeof c === 'object' ? c.value : c);
  }
  function sameValues(a, b) {
    return a.name === b.name && a.note === b.note &&
      catValueOf(a.category) === catValueOf(b.category);
  }
  function isDirty() {
    return !sameValues(currentValues(), state.confirmed);
  }
  function nameValid(raw) {
    return String(raw).trim() !== ''; /* الفحص دون تغيير القيمة المكتوبة */
  }
  function categoryValid() {
    return !!state.draftCategory;
  }
  function inBusyOp() {
    return state.op === 'saving' || state.op === 'checking' || state.op === 'unknown';
  }

  function emitTest(kind, detail) {
    /* أثر فحص فقط — لا يظهر في واجهة المستفيد */
    document.dispatchEvent(new CustomEvent('f03:test', {
      detail: Object.assign({ kind: kind }, detail || {})
    }));
  }

  /* ---------- رسالة العملية داخل اللوحة: قناة سياق اللوحة الوحيدة ---------- */
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

  /* رسالة نتيجة الحفظ بعد إغلاق اللوحة: قناة سياق العرض الوحيدة.
     تُمسح عند فتح سياق تعديل جديد (انتهى سببها — درس F01-R1-03). */
  function setViewNote(variant, title, body) {
    el.viewNote.hidden = false;
    el.viewNote.className = 'm-note m-note--' + variant + ' f03-view-note';
    el.viewNote.setAttribute('data-view-state', variant);
    el.viewNoteTitle.textContent = title;
    el.viewNoteBody.textContent = body;
  }
  function clearViewNote() {
    el.viewNote.hidden = true;
    el.viewNote.setAttribute('data-view-state', 'idle');
    el.viewNoteTitle.textContent = '';
    el.viewNoteBody.textContent = '';
  }

  /* رسالة زوال الفئة داخل طبقة المنتقي — القناة الوحيدة لهذا الحدث */
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

  /* ---------- حالة الحقول والأزرار ---------- */
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

  function renderDirtyHint() {
    el.dirtyHint.hidden = !isDirty();
  }

  /* ---------- الإدخال: محور dirty + تقييم الأخطاء المعروفة + رسائل انتهى سببها ---------- */
  function syncAfterInput() {
    renderDirtyHint();
    /* UX-09: بعد معرفة خطأ محدد أعد تقييمه عند التصحيح */
    if (nameErrorActive() && nameValid(el.name.value)) setNameError(false);
    /* رسالة عملية سابقة انتهى سببها بتغير القيم تزال — لا تبقى رسالة
       تصف قيمًا لم تعد الحالية (F01-R1-03): saved → idle؛ failed/idle
       تزال الرسالة وfailed يبقى سجل محاولة دون عرضها كرفض للقيم الحالية. */
    if (state.op === 'saved') {
      state.op = 'idle';
      clearOpMessage();
    } else if (state.op === 'failed' || state.op === 'idle') {
      clearOpMessage();
    }
  }
  el.name.addEventListener('input', syncAfterInput);
  el.note.addEventListener('input', syncAfterInput);

  /* ---------- الحفظ: حراسة المستهلك + تحقق عند الإرسال ---------- */
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* حراسة المستهلك إضافة لحراسة الزر: submit لا يلزم أن يأتي من click.
       saving/checking: لا عملية جديدة إطلاقًا. unknown: الحفظ ممنوع
       سلوكيًا وشرح السبب باقٍ (لا رسالة جديدة ولا حفظ ولا إعادة إرسال). */
    if (state.op === 'saving' || state.op === 'checking') return;
    if (state.op === 'unknown') return;

    var values = currentValues();

    /* حفظ clean: لا دعوة ولا loading ولا نجاح جديد */
    if (!isDirty()) {
      setOpMessage('info', 'لا تغييرات', 'لا تغييرات للحفظ — القيم مطابقة للنسخة المؤكدة.');
      return;
    }

    /* إدخال غير صالح: لا عملية — عرّف موضع الخطأ وسببه، حافظ القيم،
       وركّز موضع التصحيح (UX-10) */
    if (!nameValid(values.name)) {
      setNameError(true, 'الاسم مطلوب — أدخل اسمًا غير فارغ ثم احفظ مجددًا.');
      el.name.focus();
      return;
    }
    if (!categoryValid()) {
      setCatError(true, 'الفئة مطلوبة — اختر فئة من القائمة ثم احفظ.');
      el.catTrigger.focus();
      return;
    }

    /* حفظ dirty صالح: نسخة إرسال ثابتة (خام بلا trim) + معرف محاولة */
    state.attemptId += 1;
    state.sending = {
      name: el.name.value,
      category: state.draftCategory ? { value: state.draftCategory.value, label: state.draftCategory.label } : null,
      note: el.note.value
    };
    state.op = 'saving';
    setFieldsReadonly(true);
    setOpMessage('info', 'جارٍ الحفظ', 'جارٍ حفظ التعديلات…');
    window.MicroButtons.setLoading(el.saveBtn, true, { loadingLabel: 'جارٍ الحفظ' });
    emitTest('attempt', { channel: 'save', attemptId: state.attemptId });

    connector.save({
      attemptId: state.attemptId,
      values: copyRecord(state.sending)
    }).then(handleSaveResult, function () {
      /* رفض Promise أثناء save بلا عقد عدم حفظ: نتيجة مجهولة لا رفض مؤكد.
         لا حفظ جديد يبدأ تلقائيًا — الحفظ التالي قرار المستخدم فقط. */
      endSaveBusy();
      enterUnknown('انتهت محاولة الحفظ بنتيجة غير مؤكدة — تحقق من النتيجة قبل أي تعديل.');
    });
  });

  function belongsToActiveAttempt(res) {
    return !!(res && typeof res === 'object' && res.attemptId === state.attemptId);
  }

  function endSaveBusy() {
    window.MicroButtons.setLoading(el.saveBtn, false);
  }

  /* نجاح مؤكد: قناة سياق اللوحة تغادر والحدث لقناة سياق العرض —
     اللوحة تُغلق بعد تحديث المؤكد ودورة المهمة تكتمل (بطاقة §2). */
  function applySaved(messageText) {
    state.confirmed = copyRecord(state.sending);
    state.op = 'saved';
    setFieldsReadonly(false);
    renderReadView();
    renderDirtyHint();
    setViewNote('success', 'تم الحفظ', messageText);
    clearOpMessage();
    window.MicroNavigation.closeLayer(el.sheet);
  }

  function applyFailed(messageText) {
    state.op = 'failed';
    setFieldsReadonly(false);
    setOpMessage('error', 'تعذر الحفظ', messageText);
    renderDirtyHint();
  }

  function enterUnknown(reasonText) {
    state.op = 'unknown';
    setFieldsReadonly(true); /* النتيجة غير محسومة: لا تحرير، والوصول محفوظ */
    setOpMessage('warning', 'النتيجة غير مؤكدة', reasonText);
    el.checkBtn.hidden = false; /* التحقق متاح — يظهر ظهورًا فعليًا */
    renderDirtyHint();
  }

  function handleSaveResult(res) {
    /* رد قديم لا يخص المحاولة النشطة: تجاهل كليًا وسجّل للفحص فقط */
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      emitTest('stale-ignored', { channel: 'save', receivedAttemptId: res && res.attemptId });
      return;
    }
    endSaveBusy();
    if (res.outcome === 'saved') {
      applySaved('تم حفظ التعديلات — النسخة المؤكدة محدثة.');
    } else if (res.outcome === 'not-saved') {
      applyFailed('لم تُحفظ التعديلات — القيم كما كتبتها باقية، ويمكنك التصحيح والمحاولة مجددًا.');
    } else {
      enterUnknown('انتهت محاولة الحفظ بنتيجة غير مؤكدة — تحقق من النتيجة قبل أي تعديل.');
    }
  }

  /* ---------- التحقق من نتيجة محاولة مجهولة ---------- */
  el.checkBtn.addEventListener('click', function () {
    if (state.op !== 'unknown') return; /* حراسة: تكرار التفعيل أثناء checking لا يكرر */
    state.op = 'checking';
    setOpMessage('info', 'جارٍ التحقق', 'جارٍ التحقق من نتيجة الحفظ…');
    window.MicroButtons.setLoading(el.checkBtn, true, { loadingLabel: 'جارٍ التحقق' });
    emitTest('attempt', { channel: 'check', attemptId: state.attemptId });

    connector.check({ attemptId: state.attemptId })
      .then(handleCheckResult, function () {
        /* رفض التحقق يبقى unknown — لا يتحول رفض حفظ مؤكدًا ولا نجاحًا،
           وإعادة التحقق تبقى ممكنة دون أي حفظ جديد */
        window.MicroButtons.setLoading(el.checkBtn, false);
        state.op = 'unknown';
        setOpMessage('warning', 'تعذر تأكيد النتيجة', 'تعذر تأكيد النتيجة، تحقق مجددًا.');
      });
  });

  /* (F01-R1-02) إخفاء زر تحقق مركّز يُسقط التركيز إلى BODY. إن كان
     التركيز على الزر عند حسم النتيجة ننقله قبل الإخفاء إلى هدف مرئي
     ثابت موثق داخل اللوحة: زر الحفظ. وإن نقل المستخدم التركيز أثناء
     الانتظار فلا نسرقه. */
  function refocusIfCheckFocused() {
    if (document.activeElement === el.checkBtn) el.saveBtn.focus();
  }

  function handleCheckResult(res) {
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      emitTest('stale-ignored', { channel: 'check', receivedAttemptId: res && res.attemptId });
      return;
    }
    window.MicroButtons.setLoading(el.checkBtn, false);
    if (res.outcome === 'saved') {
      refocusIfCheckFocused();
      applySaved('تأكدت النتيجة: تم حفظ التعديلات.');
      el.checkBtn.hidden = true;
    } else if (res.outcome === 'not-saved') {
      refocusIfCheckFocused();
      applyFailed('تأكدت النتيجة: لم تُحفظ التعديلات — القيم باقية ويمكنك التصحيح والمحاولة مجددًا.');
      el.checkBtn.hidden = true;
    } else {
      /* تحقق بنتيجة مجهولة: عودة unknown بقيم كما هي وإمكان إعادة تحقق */
      state.op = 'unknown';
      setOpMessage('warning', 'تعذر تأكيد النتيجة', 'تعذر تأكيد النتيجة، تحقق مجددًا.');
    }
  }

  /* ---------- قراءة الفئات: loading → ready | empty | error ---------- */
  function pickerVisibleOptionCount() {
    return [].slice.call(el.picker.querySelectorAll('.m-picker__option'))
      .filter(function (o) { return !o.hidden; }).length;
  }

  function announceReadState(text) {
    el.pickerLive.textContent = text; /* القناة الحية داخل الطبقة */
  }

  /* التركيز يُنقل إلى البحث الثابت فقط قبل زوال عنصر مركّز سيُخفى أو
     تُستبدل عقده (خيار/صف حالة/إعادة محاولة) — نمط F02-R1-03. */
  function moveFocusIntoPickerBeforeDataChange() {
    if (el.catLayer.hidden) return;
    var active = document.activeElement;
    if (!active || !el.picker.contains(active)) return;
    var doomed = active.classList.contains('m-picker__option')
      || active.hasAttribute('data-picker-retry')
      || !!active.closest('.m-picker__state');
    if (!doomed) return; /* عنصر ثابت أو هدف صالح آخر — لا سرقة */
    if (searchInput && active !== searchInput) searchInput.focus();
  }

  function startRead() {
    state.readSeq += 1;
    var readId = state.readSeq;
    moveFocusIntoPickerBeforeDataChange();
    setDropNote(''); /* قراءة جديدة = سياق معالجة جديد: رسالة قديمة تُمسح */
    window.MicroPicker.setStatus(el.picker, 'loading');
    announceReadState('جارٍ قراءة الفئات…');
    connector.readCategories({ readId: readId }).then(handleReadResult, function () {
      /* رفض Promise قراءة = خطأ قراءة معروف (عقد الموصل §4) */
      handleReadResult({ readId: readId, outcome: 'error', items: [] });
    });
  }

  function belongsToLatestRead(res) {
    return !!(res && typeof res === 'object' && res.readId === state.readSeq);
  }

  function handleReadResult(res) {
    if (!belongsToLatestRead(res)) {
      state.staleIgnored += 1;
      emitTest('stale-ignored', { channel: 'read', receivedReadId: res && res.readId });
      return; /* رد أقدم: لا قيمة ولا رسالة ولا تركيز */
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
        /* الإعلان من الحالة الفعلية الظاهرة لا عدد المصدر وحده (درس F02-R2-02) */
        var query = searchInput ? searchInput.value.trim() : '';
        if (query) {
          announceReadState(visibleCount
            ? 'نتائج البحث: ' + visibleCount + ' فئات.'
            : 'لا نتائج مطابقة للبحث. جرّب اسمًا آخر.');
        } else {
          announceReadState('تمت القراءة: ' + res.items.length + ' فئات.');
        }
      }
    } else if (res.outcome === 'empty') {
      /* empty مؤكدة تطبق مصدرًا فارغًا وتُسقط فئة اللوحة الجارية برسالة
         الزوال — لا بديل تلقائي (نمط F02-R1-02) */
      window.MicroPicker.setOptions(el.picker, []);
      syncDraftFromPicker();
      window.MicroPicker.setStatus(el.picker, 'empty', 'لا فئات في المصدر.');
      announceReadState('لا فئات في المصدر.');
    } else {
      window.MicroPicker.setStatus(el.picker, 'error');
      announceReadState('تعذرت قراءة الفئات.');
    }
  }

  /* بعد setOptions: فئة اللوحة الجارية يجب أن تطابق المنتقي دائمًا.
     السقوط وحده يوجَّه إلى رسالة الزوال الظاهرة داخل الطبقة (قناة
     واحدة لهذا الحدث) — ويُلزم باختيار عند الحفظ. */
  function syncDraftFromPicker() {
    var cur = window.MicroPicker.getSelected(el.picker);
    if (cur) {
      if (!state.draftCategory || state.draftCategory.value !== cur.value || state.draftCategory.label !== cur.label) {
        state.draftCategory = { value: cur.value, label: cur.label };
        setDropNote(''); /* سبب الرسالة زال بوجود الفئة */
        if (catErrorActive() && categoryValid()) setCatError(false);
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
      if (catErrorActive() && categoryValid()) setCatError(false);
      renderCatTrigger();
      renderDirtyHint();
      syncAfterInput();
      window.MicroNavigation.closeLayer(el.catLayer);
    } else {
      /* مسح (clearSelection) أو سقوط الاختيار (setOptions): تزامن دون إغلاق.
         رسالة السقوط تصدر من syncDraftFromPicker بعد setOptions. */
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

  /* كل فتح للمنتقي: قراءة جديدة بمعرف جديد + بذرة فئة اللوحة الجارية */
  el.catLayer.addEventListener('micro-navigation:opened', function () {
    state.catLayerOpen = true;
    window.MicroPicker.setOptions(el.picker, connectorSourceSnapshot());
    if (state.draftCategory) syncPickerSeed();
    else window.MicroPicker.clearSelection(el.picker);
    startRead();
  });

  /* عند إغلاق المنتقي تخرج رسالة الزوال من النطاق — تُمسح، وقناة
     القراءة تُفرغ (لا بقايا)، والتركيز أعادته B07 إلى صف الفئة */
  el.catLayer.addEventListener('micro-navigation:closed', function () {
    state.catLayerOpen = false;
    setDropNote('');
    announceReadState('');
  });

  /* مزامنة بحث المنتقي مع القناة داخل الطبقة — نمط F02-R2-02:
     لا إعلان قديم يوهم بوجود نتائج، ومسح البحث يعلن الظاهر فعليًا. */
  function bindSearchAnnouncement() {
    if (!searchInput || searchInput.dataset.f03SearchAnnounced) return;
    searchInput.dataset.f03SearchAnnounced = '1';
    searchInput.addEventListener('input', function () {
      if (el.catLayer.hidden) return;
      var row = el.picker.querySelector('.m-picker__state');
      var rowText = row ? row.textContent : '';
      if (rowText.indexOf('لا نتائج مطابقة') !== -1) {
        announceReadState('لا نتائج مطابقة للبحث. جرّب اسمًا آخر.');
        return;
      }
      if (row) return; /* صف حالة قراءة (loading/error/empty) — مسار القراءة يعلنها */
      var visible = pickerVisibleOptionCount();
      if (searchInput.value.trim() === '') {
        announceReadState('الفئات الظاهرة: ' + visible + ' فئات.');
      } else {
        announceReadState('نتائج البحث: ' + visible + ' فئات.');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSearchAnnouncement);
  } else {
    bindSearchAnnouncement();
  }

  /* مصدر الفئات الحالي لدى الموصل (لبذرة الفتح) — نسخة مستقلة لا مرجع حي */
  function connectorSourceSnapshot() {
    return CATEGORIES_INIT.map(function (c) { return { value: c.value, label: c.label }; });
  }

  /* ---------- فتح/إغلاق لوحة التعديل + حراسة المغادرة ---------- */
  el.editBtn.addEventListener('click', function () {
    clearViewNote(); /* سياق تعديل جديد: رسالة النجاح السابقة انتهى سببها */
    /* اللوحة تفتح على النسخة المؤكدة دائمًا (بطاقة §3: فتح التعديل) */
    el.name.value = state.confirmed.name;
    el.note.value = state.confirmed.note;
    setDraftCategory(state.confirmed.category, { syncPickerSummary: false });
    setNameError(false);
    setCatError(false);
    state.op = 'idle';
    state.sending = null;
    clearOpMessage();
    el.checkBtn.hidden = true;
    renderDirtyHint();
    window.MicroNavigation.openLayer(el.sheet, { trigger: el.editBtn });
  });

  /* زر الإغلاق الظاهر بلا [data-layer-close] الجاهزة كي يمر عبر الحارس */
  el.sheetClose.addEventListener('click', function () {
    requestLeave(el.sheetClose);
  });

  el.backBtn.addEventListener('click', function () {
    requestLeave(el.backBtn);
  });

  /* حراسة المغادرة: pending محجوب برسالة موجزة، dirty بحوار قرار،
     نظيف إغلاق مباشر (بطاقة §3) */
  function requestLeave(trigger) {
    if (inBusyOp()) {
      setOpMessage('warning', 'المغادرة غير متاحة الآن', blockedLeaveText());
      return;
    }
    if (isDirty()) {
      state.abandonRequested = false;
      state.leaveTrigger = trigger || el.backBtn;
      window.MicroNavigation.openLayer(el.leaveDialog, { trigger: state.leaveTrigger });
      return;
    }
    window.MicroNavigation.closeLayer(el.sheet);
  }

  function blockedLeaveText() {
    if (state.op === 'saving') return 'لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ.';
    if (state.op === 'checking') return 'لا يمكن الرجوع الآن — جارٍ التحقق من نتيجة الحفظ.';
    return 'لا يمكن الرجوع قبل حسم نتيجة الحفظ — استخدم «التحقق من النتيجة» أولًا.';
  }

  /* Escape: قرار مستهلك موثق (بطاقة §2) — مستمع التقاط على المستند
     يسبق مستمع B07 فيوجّه الحدث دون تعديل عقد B07:
     - طبقة المنتقي أو الحوار أعلى: يُمرَّر إلى B07 (إغلاق عرض آمن).
     - dirty: يفتح حوار البقاء/التخلي — لا Escape صامت للتخلي (UX-17).
     - pending: حجب برسالة موجزة.
     - نظيف: يُمرَّر إلى B07 (إغلاق عادي واستعادة تركيز المشغّل). */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (el.sheet.hidden) return;
    if (state.catLayerOpen || state.dialogOpen) return; /* أعلى طبقة أخرى: سلوك B07 */
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
      state.leaveTrigger = el.backBtn; /* هدف استرجاع تركيز موثق لـEscape */
      window.MicroNavigation.openLayer(el.leaveDialog, { trigger: state.leaveTrigger });
    }
  }, true);

  /* حوار البقاء/التخلي: كل إغلاق غير «التخلي» = بقاء (B07 يستعيد
     التركيز للمشغّل بنفسه ولا نمس القيم ولا نغادر) */
  el.stayBtn.addEventListener('click', function () {
    window.MicroNavigation.closeLayer(el.leaveDialog);
  });

  el.abandonBtn.addEventListener('click', function () {
    state.abandonRequested = true;
    /* التخلي وحده يستعيد النسخة المؤكدة — بلا أي حفظ */
    el.name.value = state.confirmed.name;
    el.note.value = state.confirmed.note;
    setDraftCategory(state.confirmed.category, { syncPickerSummary: false });
    state.op = 'idle';
    state.sending = null;
    clearOpMessage();
    el.checkBtn.hidden = true;
    setNameError(false);
    setCatError(false);
    renderDirtyHint();
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
    /* ننتظر إغلاق الحوار الفعلي قبل إغلاق اللوحة (لا نخفي المشغّل أثناء
       الخفوت) — الإغلاق نظيف الآن فيغلق مباشرة ويستعيد B07 تركيز
       مشغّل «تعديل» */
    window.MicroNavigation.closeLayer(el.sheet);
  });

  /* عند إغلاق لوحة التعديل بأي طريق: حالة اللوحة تعود لتهيئة نظيفة
     (رسائل/تحقق/تحرير) — القيم تبقى كما أُغلقت، وإعادة الفتح تبث
     المؤكد من جديد عبر فتح «تعديل» */
  el.sheet.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.sheet) return;
    if (state.op === 'saved') {
      state.op = 'idle'; /* رسالة النجاح انتقلت لقناة العرض */
    }
    state.sending = null;
    setFieldsReadonly(false);
    clearOpMessage();
    el.checkBtn.hidden = true;
    setNameError(false);
    setCatError(false);
    renderDirtyHint();
  });

  /* ---------- تسليم رد فحص بمعرف قديم (نمط F01-R1-05) ----------
     يستدعي معالِج النتائج نفسه لدى المستهلك (الذي تستدعيه حلول Promise)
     بذات فلتر attemptId/readId — دون استهلاك Promise الطلب المعلق، فيظل
     الطلب قادرًا على الحسم بنتيجته الصحيحة بعد تجاهل الرد القديم.
     للفحص عبر لوحة SIMULATION فقط. ما يثبته: فلتر المستهلك وتجاهله —
     لا يثبت وصولًا شبكيًا فعليًا لرد طلب سابق (حد موثق في README). */
  function deliverTestResponse(kind, payload) {
    if (kind === 'save') handleSaveResult(payload);
    else if (kind === 'check') handleCheckResult(payload);
    else if (kind === 'read') handleReadResult(payload);
  }

  /* ---------- تحكم فحص محايد التركيز ----------
     أثناء فتح طبقة يعزل B07 قسم SIMULATION فعليًا (inert)؛ هذه الواجهة
     البرمجية تسمح لأداة الفحص بتسليح السيناريوهات وإنهاء الطلبات المعلقة
     دون نقر لوحة ولا سرقة تركيز (نمط F01 الموثق). ليست أزرار debug في
     واجهة العينة، ولا جزءًا من عقد المستهلك. */
  var F03Example = {
    version: 'F03-V1',
    arm: function (kind, outcome) {
      if (kind === 'save') connector.setNextSave(outcome);
      else if (kind === 'check') connector.setNextCheck(outcome);
      else if (kind === 'read') connector.setNextRead(outcome);
      return connector.readout();
    },
    settle: function (kind, override) {
      return connector.settle(kind, override);
    },
    setSource: function (items) { connector.setSource(items); },
    deliverTestResponse: deliverTestResponse,
    inspect: function () {
      var active = document.activeElement;
      var options = [].slice.call(el.picker.querySelectorAll('.m-picker__option'));
      return {
        op: state.op,
        dirty: isDirty(),
        current: currentValues(),
        draftCategory: state.draftCategory ? { value: state.draftCategory.value, label: state.draftCategory.label } : null,
        confirmed: copyRecord(state.confirmed),
        sending: state.sending ? copyRecord(state.sending) : null,
        attemptId: state.attemptId,
        readSeq: state.readSeq,
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
        /* الظهور الفعلي (درس F01-R1-01): display/مستطيل وليس سمة hidden وحدها */
        checkVisible: isReallyVisible(el.checkBtn),
        checkBox: (function () {
          var r = el.checkBtn.getBoundingClientRect();
          return {
            display: window.getComputedStyle(el.checkBtn).display,
            hiddenAttr: el.checkBtn.hidden,
            w: Math.round(r.width),
            h: Math.round(r.height)
          };
        })(),
        message: el.opNote.hidden ? null : {
          variant: el.opNote.getAttribute('data-op-state'),
          title: el.opTitle.textContent,
          text: el.opBody.textContent
        },
        viewNote: el.viewNote.hidden ? null : {
          variant: el.viewNote.getAttribute('data-view-state'),
          title: el.viewNoteTitle.textContent,
          text: el.viewNoteBody.textContent
        },
        viewNoteVisible: isReallyVisible(el.viewNote),
        dirtyHintVisible: !el.dirtyHint.hidden,
        readView: {
          name: el.readName.textContent,
          category: el.readCat.textContent,
          note: el.readNote.textContent
        },
        sheetOpen: !el.sheet.hidden,
        catLayerOpen: !el.catLayer.hidden,
        dialogOpen: !el.leaveDialog.hidden,
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
        searchValue: (searchInput || {}).value || '',
        saveCalls: connector.counters.save,
        checkCalls: connector.counters.check,
        readCalls: connector.counters.read,
        staleIgnored: state.staleIgnored,
        sim: connector.readout()
      };
    }
  };
  window.F03Example = F03Example;

  /* ---------- إقلاع: بلا أحداث ولا طلبات ---------- */
  applyInitialValues();
})();
