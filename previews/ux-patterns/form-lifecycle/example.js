/* =========================================================
   Micro UI — UX-F01: سلوك المستهلك لنموذج «تحرير سجل تجريبي»
   الملف: previews/ux-patterns/form-lifecycle/example.js
   الحالة: DRAFT FOR REVIEW — سلوك مستهلك للعينة، ليس framework عام
   ولا منطق أعمال، ولا يعدّل أي مصدر UI.

   مصدر الحقيقة (docs/ux/F01-ACCEPTANCE.md §2):
   - confirmed: النسخة المؤكدة (تبدأ {name:'عينة', note:''}).
   - sending: نسخة إرسال ثابتة عند بدء الحفظ (خام بلا trim).
   - attemptId: معرف محاولة متزايد لكل حفظ جديد.
   - op: idle | saving | failed | unknown | checking | saved
   - dirty محور مستقل: اختلاف أي قيمة خام عن المؤكدة؛ الكتابة ثم
     العودة لنفس القيم تعيد clean دون حفظ. invalid محور مستقل أيضًا.

   قرارات موثقة (تفصيلها في README.md):
   - القناة الإعلانية الوحيدة: m-note ثابتة role=status (خيار رسالة B06
     الثابتة) — لا MicroMessages.announce لنصها نفسه.
   - خطأ الاسم: aria-describedby/aria-invalid + رسالة الحقل، بلا مصدر
     إعلان ثانٍ.
   - saving/unknown/checking: الحقول readOnly (ليست fieldset معطلة)،
     busy على زر الحفظ فقط أثناء saving وزر التحقق فقط أثناء checking
     عبر MicroButtons.setLoading (تحميل B الافتراضي دون تبديل).
   - المغادرة: clean بلا حوار؛ dirty في idle/failed بحوار B07 (كل
     إغلاق غير التخلي = بقاء)؛ saving/unknown/checking محجوبة برسالة
     محلية موجزة.
   - الردود القديمة (attemptId لا يطابق المحاولة النشطة) تُتجاهل تمامًا
     وتسجل في حدث f01:test لدليل الفحص فقط.
   ========================================================= */

(function () {
  'use strict';

  var CONFIRMED_INIT = { name: 'عينة', note: '' };

  /* ---------- عناصر العينة ---------- */
  var el = {
    form: document.getElementById('f01-form'),
    nameField: document.getElementById('f01-name-field'),
    name: document.getElementById('f01-name'),
    nameMsg: document.getElementById('f01-name-msg'),
    noteField: document.getElementById('f01-note-field'),
    note: document.getElementById('f01-note'),
    opNote: document.getElementById('f01-op-note'),
    opTitle: document.getElementById('f01-op-title'),
    opBody: document.getElementById('f01-op-body'),
    dirtyHint: document.getElementById('f01-dirty-hint'),
    saveBtn: document.getElementById('f01-save'),
    checkBtn: document.getElementById('f01-check'),
    backBtn: document.getElementById('f01-back'),
    editBtn: document.getElementById('f01-edit-btn'),
    readView: document.getElementById('f01-read'),
    editView: document.getElementById('f01-edit'),
    readTitle: document.getElementById('f01-read-title'),
    readName: document.getElementById('f01-read-name'),
    readNote: document.getElementById('f01-read-note'),
    dialog: document.getElementById('f01-leave-dialog'),
    stayBtn: document.getElementById('f01-stay'),
    abandonBtn: document.getElementById('f01-abandon')
  };

  /* ---------- حالة المستهلك ---------- */
  var state = {
    confirmed: { name: CONFIRMED_INIT.name, note: CONFIRMED_INIT.note },
    sending: null,
    attemptId: 0,
    op: 'idle', /* idle|saving|failed|unknown|checking|saved */
    staleIgnored: 0,
    abandonRequested: false
  };

  /* الموصل التجريبي — قابل للاستبدال (واجهة mock-adapter.js) */
  var connector = window.F01Sim.createConnector();
  window.F01Sim.bindSimulationPanel(document.getElementById('f01-sim'), connector);

  /* ---------- أدوات مساعدة ---------- */
  function currentValues() {
    return { name: el.name.value, note: el.note.value };
  }
  function sameValues(a, b) {
    return a.name === b.name && a.note === b.note;
  }
  function isDirty() {
    return !sameValues(currentValues(), state.confirmed);
  }
  function nameValid(raw) {
    return String(raw).trim() !== ''; /* الفحص دون تغيير القيمة المكتوبة */
  }
  function inBusyOp() {
    return state.op === 'saving' || state.op === 'checking' || state.op === 'unknown';
  }

  function emitTest(kind, detail) {
    /* أثر فحص فقط — لا يظهر في واجهة المستفيد */
    document.dispatchEvent(new CustomEvent('f01:test', {
      detail: Object.assign({ kind: kind }, detail || {})
    }));
  }

  /* ---------- رسالة العملية: القناة الإعلانية الوحيدة ----------
     m-note ثابتة role=status. لا نداء MicroMessages.announce لنصها،
     ولا قناة حية ثانية في العينة. تبقى باقية حتى يستبدلها حدث أحدث. */
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

  /* ---------- حالة الحقول والأزرار ---------- */
  function setFieldsReadonly(ro) {
    /* readOnly يفقد التحرير ويحفظ القراءة والنسخ — ليس fieldset معطلاً */
    el.name.readOnly = ro;
    el.note.readOnly = ro;
    el.nameField.classList.toggle('has-readonly', ro);
    el.noteField.classList.toggle('has-readonly', ro);
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

  function renderDirtyHint() {
    el.dirtyHint.hidden = !isDirty();
  }

  /* ---------- الإدخال: محور dirty + تقييم الخطأ المعروف ---------- */
  function syncAfterInput() {
    renderDirtyHint();
    /* UX-09: بعد معرفة خطأ محدد أعد تقييمه عند التصحيح */
    if (nameErrorActive() && nameValid(el.name.value)) setNameError(false);
    /* رسالة النجاح القديمة لا تصف الإدخال الجديد: تزال وتصبح العملية idle */
    if (state.op === 'saved') {
      state.op = 'idle';
      clearOpMessage();
    }
    /* failed تبقى: «لم تُحفظ» تصف حالة القيم الحالية أيضًا حتى محاولة جديدة */
  }
  el.name.addEventListener('input', syncAfterInput);
  el.note.addEventListener('input', syncAfterInput);

  /* ---------- الحفظ: حراسة المستهلك + تحقق عند الإرسال ---------- */
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* حراسة المستهلك إضافة لحراسة الزر: submit لا يلزم أن يأتي من click.
       saving/checking: لا عملية جديدة إطلاقًا. unknown: الحفظ ممنوع
       سلوكيًا وشرح السبب باقٍ (لا رسالة جديدة ولا حفظ). */
    if (state.op === 'saving' || state.op === 'checking') return;
    if (state.op === 'unknown') return;

    var values = currentValues();

    /* حفظ clean: لا دعوة ولا loading ولا نجاح جديد */
    if (!isDirty()) {
      setOpMessage('info', 'لا تغييرات', 'لا تغييرات للحفظ — القيم مطابقة للنسخة المؤكدة.');
      return;
    }

    /* إدخال غير صالح: لا عملية — عرّف الخطأ، حافظ القيم، ركّز الاسم */
    if (!nameValid(values.name)) {
      setNameError(true, 'الاسم مطلوب — أدخل اسمًا غير فارغ ثم احفظ مجددًا.');
      el.name.focus();
      return;
    }

    /* حفظ dirty صالح: نسخة إرسال ثابتة (خام بلا trim) + معرف محاولة */
    state.attemptId += 1;
    state.sending = { name: values.name, note: values.note };
    state.op = 'saving';
    setFieldsReadonly(true);
    setOpMessage('info', 'جارٍ الحفظ', 'جارٍ حفظ التعديلات…');
    window.MicroButtons.setLoading(el.saveBtn, true, { loadingLabel: 'جارٍ الحفظ' });
    emitTest('attempt', { channel: 'save', attemptId: state.attemptId });

    connector.save({
      attemptId: state.attemptId,
      values: { name: state.sending.name, note: state.sending.note }
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

  function applySaved(messageText) {
    state.confirmed = { name: state.sending.name, note: state.sending.note };
    state.op = 'saved';
    setFieldsReadonly(false);
    setOpMessage('success', 'تم الحفظ', messageText);
    renderDirtyHint();
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
    el.checkBtn.hidden = false; /* التحقق متاح */
    renderDirtyHint();
  }

  function handleSaveResult(res) {
    /* رد قديم لا يخص المحاولة النشطة: تجاهل كاملًا وسجّل للفحص فقط */
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

  function handleCheckResult(res) {
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      emitTest('stale-ignored', { channel: 'check', receivedAttemptId: res && res.attemptId });
      return;
    }
    window.MicroButtons.setLoading(el.checkBtn, false);
    if (res.outcome === 'saved') {
      /* النتيجة تُطبق على نسخة إرسال المحاولة نفسها */
      applySaved('تأكدت النتيجة: تم حفظ التعديلات.');
      el.checkBtn.hidden = true;
    } else if (res.outcome === 'not-saved') {
      applyFailed('تأكدت النتيجة: لم تُحفظ التعديلات — القيم باقية ويمكنك التصحيح والمحاولة مجددًا.');
      el.checkBtn.hidden = true;
    } else {
      /* تحقق بنتيجة مجهولة: عودة unknown بقيم كما هي وإمكان إعادة تحقق */
      state.op = 'unknown';
      setOpMessage('warning', 'تعذر تأكيد النتيجة', 'تعذر تأكيد النتيجة، تحقق مجددًا.');
    }
  }

  /* ---------- المغادرة: رجوع للقراءة / حوار قرار ---------- */
  el.backBtn.addEventListener('click', function () {
    if (inBusyOp()) {
      /* محجوبة برسالة محلية موجزة — لا حوار تخلي ولا وهم إلغاء طلب جارٍ */
      setOpMessage('warning', 'المغادرة غير متاحة الآن', blockedLeaveText());
      return;
    }
    if (isDirty()) {
      state.abandonRequested = false;
      window.MicroNavigation.openLayer(el.dialog, { trigger: el.backBtn });
      return;
    }
    goToReadView();
  });

  function blockedLeaveText() {
    if (state.op === 'saving') return 'لا يمكن الرجوع الآن — بانتظار نتيجة الحفظ.';
    if (state.op === 'checking') return 'لا يمكن الرجوع الآن — جارٍ التحقق من نتيجة الحفظ.';
    return 'لا يمكن الرجوع قبل حسم نتيجة الحفظ — استخدم «التحقق من النتيجة» أولًا.';
  }

  /* كل إغلاق غير «التخلي» = بقاء: B07 يستعيد التركيز للمشغّل بنفسه
     ولا نلمس القيم ولا ننتقل للقراءة. */
  el.stayBtn.addEventListener('click', function () {
    window.MicroNavigation.closeLayer(el.dialog);
  });

  el.abandonBtn.addEventListener('click', function () {
    state.abandonRequested = true;
    /* التخلي وحده يستعيد النسخة المؤكدة — بلا أي حفظ */
    el.name.value = state.confirmed.name;
    el.note.value = state.confirmed.note;
    state.op = 'idle';
    state.sending = null;
    clearOpMessage();
    setNameError(false);
    renderDirtyHint();
    window.MicroNavigation.closeLayer(el.dialog);
  });

  el.dialog.addEventListener('micro-navigation:closed', function (e) {
    if (e.target !== el.dialog) return;
    if (!state.abandonRequested) return; /* بقاء: لا فعل إضافي */
    state.abandonRequested = false;
    /* ننتظر الإغلاق الفعلي قبل إخفاء منظر التحرير (لا نخفي المشغّل أثناء الخفوت) */
    goToReadView();
  });

  /* ---------- التنقل بين المنظرين ---------- */
  function goToReadView() {
    el.editView.hidden = true;
    el.readView.hidden = false;
    el.readName.textContent = state.confirmed.name;
    el.readNote.textContent = state.confirmed.note === '' ? '—' : state.confirmed.note;
    renderDirtyHint();
    el.readTitle.focus(); /* عنوان القراءة قابل للتركيز برمجيًا */
  }

  el.editBtn.addEventListener('click', function () {
    el.readView.hidden = true;
    el.editView.hidden = false;
    renderDirtyHint();
    el.name.focus(); /* سياسة التركيز: إعادة تعديل → الاسم */
  });

  /* ---------- واجهة فحص للقراءة فقط (ليست أزرار debug في الواجهة) ---------- */
  window.F01Example = {
    version: 'F01-R1',
    inspect: function () {
      var active = document.activeElement;
      return {
        op: state.op,
        dirty: isDirty(),
        current: currentValues(),
        confirmed: { name: state.confirmed.name, note: state.confirmed.note },
        sending: state.sending ? { name: state.sending.name, note: state.sending.note } : null,
        attemptId: state.attemptId,
        nameError: nameErrorActive(),
        nameMsgText: el.nameMsg.hidden ? '' : el.nameMsg.textContent,
        nameAriaInvalid: el.name.getAttribute('aria-invalid') === 'true',
        nameDescribedBy: el.name.getAttribute('aria-describedby') || '',
        readonly: el.name.readOnly && el.note.readOnly,
        disabled: el.name.disabled || el.note.disabled,
        saveBusy: el.saveBtn.getAttribute('aria-busy') === 'true',
        checkBusy: el.checkBtn.getAttribute('aria-busy') === 'true',
        checkVisible: !el.checkBtn.hidden,
        message: el.opNote.hidden ? null : {
          variant: el.opNote.getAttribute('data-op-state'),
          title: el.opTitle.textContent,
          text: el.opBody.textContent
        },
        dirtyHintVisible: !el.dirtyHint.hidden,
        views: { read: !el.readView.hidden, edit: !el.editView.hidden },
        dialogOpen: !el.dialog.hidden,
        focusId: active ? (active.id || active.tagName.toLowerCase()) : 'none',
        saveCalls: connector.counters.save,
        checkCalls: connector.counters.check,
        staleIgnored: state.staleIgnored,
        sim: connector.readout()
      };
    }
  };
})();
