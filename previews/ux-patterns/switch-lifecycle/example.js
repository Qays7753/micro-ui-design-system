/* =========================================================
   Micro UI — UX-F02: سلوك المستهلك لعينة «تحديث إعداد تجريبي»
   الملف: previews/ux-patterns/switch-lifecycle/example.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة لا منطق أعمال، ولا تعدّل
   أي مصدر UI. مصدر القواعد: docs/ux/F02-ACCEPTANCE.md §5.

   مصدر الحقيقة:
   - confirmed: آخر قيمة مؤكدة (تبدأ من SWITCH_CONFIRMED_INIT — مصدر وحيد).
   - submitted: نسخة إرسال ثابتة {attemptId, value} لحين الحسم.
   - attemptId: معرف محاولة متزايد؛ كل تبديل = تحديث واحد فقط.
   - op: idle | pending | saved | not-saved | unknown | checking
   - checked للعرض فقط: pending يعرض القيمة المقصودة، unknown يبقيها
     غير مؤكدة، not-saved يستعيد confirmed — ولا نقول «حُفظ» إلا بعد
     نتيجة مؤكدة (لا change ولا rendered ولا زوال pending = حفظ).

   قرارات موثقة (تفصيلها في README.md):
   - حراسة المستهلك فوق حراسة المكوّن: لا تحديث ثانٍ أثناء
     pending/checking، ولا تحقق إلا من محاولة معلومة النتيجة مجهولة،
     ولا إرسال تلقائي بعد check-unknown، ولا rollback يوهم الرفض.
   - سياسة التركيز (نص البطاقة حرفيًا):
     · إن كان input هو التركيز عند بدء العملية نُقل التركيز «قبل
       التعطيل» (setSwitchPending) إلى وصف انتظار ثابت (#f02s-note)
       tabindex=-1 مرتبط بالمفتاح عبر aria-describedby؛ لا تركيز BODY
       ولا عنصر معطل. الوصف يبقى بعد الحسم وإن تغير نصه — لا نقل
       تلقائي إلى المفتاح عند تفعيله، وإن نقل المستخدم تركيزه فلا سرقة.
     · زر التحقق عند الحسم: إن كان التركيز عليه ينتقل إلى المفتاح
       «بعد تفعيله وقبل إخفائه»؛ وإن كان في موضع آخر فلا نقله. لا
       aria-disabled وحدها حراسة، ولا تعطيل fieldset يحجب الزر.
   - زر التحقق مخفي فعليًا خارج unknown/checking: سمة hidden + قاعدة
     #f02s-check[hidden]{display:none} لأن قاعدة عرض B01 تغلب إخفاء
     المتصفح (درس F01-R1-01) — والقياس display/مستطيل لا سمة وحدها.
   - قناة إعلان واحدة: #f02s-note (m-note role=status) لكل أحداث
     العملية — بلا MicroMessages.announce لنصها ولا منطقة حية ثانية،
     وبلا toast يختفي: الرسالة باقية حتى يستبدلها حدث أحدث.
   - المفتاح الثاني «قفل العينة» معطل أصلًا: يختبر عقد R2-06 أن
     setSwitchPending(false) المتكرر لا يعيد تفعيل معطل أصلًا.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- ثوابت البداية: مصدر وحيد ---------- */
  var SWITCH_CONFIRMED_INIT = false; /* بداية بديلة مجربة: true */

  /* ---------- عناصر العينة ---------- */
  var el = {
    sw: document.getElementById('f02s-switch'),
    input: document.getElementById('f02s-switch-input'),
    stateText: document.getElementById('f02s-switch-state'),
    note: document.getElementById('f02s-note'),
    noteTitle: document.getElementById('f02s-note-title'),
    noteBody: document.getElementById('f02s-note-body'),
    checkBtn: document.getElementById('f02s-check'),
    lockedInput: document.getElementById('f02s-locked-input')
  };

  /* ---------- الحالة ---------- */
  var state = {
    confirmed: SWITCH_CONFIRMED_INIT,
    submitted: null, /* {attemptId, value} */
    attemptId: 0,
    op: 'idle',
    staleIgnored: 0
  };

  /* الموصل التجريبي — قابل للاستبدال (واجهة mock-adapter.js) */
  var connector = window.F02SwitchSim.createConnector();
  window.F02SwitchSim.bindSimulationPanel(document.getElementById('f02s-sim'), connector);

  /* ---------- رسالة العملية: القناة الإعلانية الوحيدة ----------
     F02-R1-06: معنى واحد لكل رسالة — العنوان يحمل المعنى كاملًا
     والجسم للخطوة التالية فقط إن وجدت (لا تكرار العنوان في الجسم،
     ولا تفاصيل داخلية مثل حالة القيمة في رسالة النجاح.
     ثابتة باقية (لا toast) وتحمل tabindex=-1 لتكون هدف تركيز برمجي
     لسياسة انتظار المفتاح، وaria-describedby على input يربطها به. */
  function setOpMessage(variant, title, body) {
    el.note.hidden = false;
    el.note.className = 'm-note m-note--' + variant;
    el.note.setAttribute('data-op-state', variant);
    el.noteTitle.textContent = title;
    el.noteBody.textContent = body;
  }
  function clearOpMessage() {
    el.note.hidden = true;
    el.note.setAttribute('data-op-state', 'idle');
    el.noteTitle.textContent = '';
    el.noteBody.textContent = '';
  }

  /* ---------- عرض حالة المفتاح الظاهرة ---------- */
  function renderSwitchState() {
    if (state.op === 'pending' || state.op === 'checking') {
      el.stateText.textContent = 'جارٍ التحديث…';
    } else if (state.op === 'unknown') {
      el.stateText.textContent = 'غير مؤكد';
    } else {
      /* idle/saved/not-saved: عرض القيمة المؤكدة المعروفة */
      el.stateText.textContent = state.confirmed ? 'مفعّل' : 'غير مفعّل';
    }
  }

  /* ---------- بدء محاولة تحديث (تبديل المستخدم) ---------- */
  el.input.addEventListener('change', function (e) {
    if (!e.isTrusted) return; /* إشعار برمجي ليس تبديلًا فعليًا */
    var intended = el.input.checked;
    if (state.op === 'pending' || state.op === 'checking') {
      /* منع تكرار التفعيل: حراسة المستهلك + تعطيل المكوّن */
      el.input.checked = state.confirmed;
      return;
    }
    if (state.op === 'unknown') return; /* لا تحديث جديد قبل الحسم/التحقق */
    if (intended === state.confirmed) {
      /* لا تغيير فعلي: لا محاولة ولا رسالة نجاح */
      return;
    }
    startUpdate(intended);
  });

  function startUpdate(intended) {
    state.attemptId += 1;
    state.submitted = { attemptId: state.attemptId, value: intended };
    state.op = 'pending';
    setOpMessage('info', 'جارٍ تحديث الإعداد…', '');
    renderSwitchState();
    /* سياسة التركيز: قبل التعطيل — إن كان المفتاح هو التركيز انقل إلى
       وصف الانتظار الثابت. إن كان المستخدم في موضع آخر فلا سرقة. */
    if (document.activeElement === el.input) el.note.focus();
    window.MicroSelection.setSwitchPending(el.sw, true); /* يعطّل input فعليًا */
    connector.update({ attemptId: state.attemptId, value: state.submitted.value })
      .then(handleUpdateResult, function () {
        /* رفض update لا يثبت عدم الحفظ: نتيجة مجهولة — لا rollback يوهم الرفض */
        handleUpdateResult({ attemptId: state.submitted.attemptId, outcome: 'unknown' });
      });
  }

  function belongsToActiveAttempt(res) {
    return !!(res && typeof res === 'object' && res.attemptId === state.attemptId && state.submitted && res.attemptId === state.submitted.attemptId);
  }

  /* الحسم على قيمة إرسال المحاولة نفسها (ليست قيمة عرض حالية) */
  function applySavedResult() {
    state.confirmed = state.submitted.value;
    releasePending();
    state.op = 'saved';
    setOpMessage('success', 'تم تحديث الإعداد.', '');
    renderSwitchState();
    el.input.checked = state.confirmed;
  }

  function applyNotSavedResult() {
    releasePending();
    state.op = 'not-saved';
    setOpMessage('error', 'لم يُحدَّث الإعداد.', 'حاول مجددًا.');
    renderSwitchState();
    el.input.checked = state.confirmed; /* استرجاع القيمة المؤكدة */
  }

  function enterUnknown() {
    state.op = 'unknown';
    /* يبقى محجوبًا (لا setSwitchPending false): القيمة غير محسومة */
    setOpMessage('warning', 'تعذر تأكيد التحديث.', 'تحقق من النتيجة.');
    renderSwitchState();
    el.checkBtn.hidden = false; /* التحقق متاح فعليًا */
  }

  function releasePending() {
    window.MicroSelection.setSwitchPending(el.sw, false); /* يسترجع disabled الأصلي (معطل أصلًا يبقى) */
  }

  function handleUpdateResult(res) {
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      return; /* لا قيمة ولا رسالة ولا تركيز */
    }
    if (res.outcome === 'saved') {
      applySavedResult(); /* يعيد تفعيل المفتاح أولًا */
      if (document.activeElement === el.checkBtn) el.input.focus(); /* بعد التفعيل وقبل الإخفاء */
      el.checkBtn.hidden = true;
    } else if (res.outcome === 'not-saved') {
      applyNotSavedResult();
      if (document.activeElement === el.checkBtn) el.input.focus();
      el.checkBtn.hidden = true;
    } else {
      enterUnknown();
    }
  }

  /* ---------- التحقق من محاولة مجهولة ---------- */
  el.checkBtn.addEventListener('click', function () {
    if (state.op !== 'unknown') return; /* تكرار التفعيل لا يكرر الاستعلام */
    state.op = 'checking';
    setOpMessage('info', 'جارٍ التحقق من نتيجة آخر تحديث…', '');
    renderSwitchState();
    window.MicroButtons.setLoading(el.checkBtn, true, { loadingLabel: 'جارٍ التحقق' });
    connector.check({ attemptId: state.attemptId })
      .then(handleCheckResult, function () {
        /* رفض check يبقي النتيجة مجهولة: عودة unknown وإتاحة تحقق جديد */
        window.MicroButtons.setLoading(el.checkBtn, false);
        state.op = 'unknown';
        setOpMessage('warning', 'تعذر تأكيد التحديث.', 'تحقق من النتيجة.');
        renderSwitchState();
      });
  });

  function handleCheckResult(res) {
    if (!belongsToActiveAttempt(res)) {
      state.staleIgnored += 1;
      return;
    }
    window.MicroButtons.setLoading(el.checkBtn, false);
    if (res.outcome === 'saved') {
      applySavedResult(); /* تفعيل المفتاح أولًا (F02 سياسة التركيز: بعد التفعيل) */
      if (document.activeElement === el.checkBtn) el.input.focus(); /* وقبل إخفاء الزر */
      el.checkBtn.hidden = true;
    } else if (res.outcome === 'not-saved') {
      applyNotSavedResult();
      if (document.activeElement === el.checkBtn) el.input.focus();
      el.checkBtn.hidden = true;
    } else {
      state.op = 'unknown';
      setOpMessage('warning', 'تعذر تأكيد التحديث.', 'تحقق من النتيجة.');
      renderSwitchState(); /* زر التحقق يبقى متاحًا — دون إرسال تلقائي */
    }
  }

  /* ---------- تسليم رد فحص بمعرف قديم (مسار المستهلك نفسه) ---------- */
  function deliverTestResponse(kind, payload) {
    if (kind === 'update') handleUpdateResult(payload);
    else if (kind === 'check') handleCheckResult(payload);
  }

  /* ---------- واجهة فحص للقراءة فقط ---------- */
  function realVisible(elm) {
    var cs = window.getComputedStyle(elm);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    var r = elm.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  window.F02Switch = {
    version: 'F02-switch-r1',
    deliverTestResponse: deliverTestResponse,
    inspect: function () {
      return {
        op: state.op,
        confirmed: state.confirmed,
        submitted: state.submitted ? { attemptId: state.submitted.attemptId, value: state.submitted.value } : null,
        attemptId: state.attemptId,
        checked: el.input.checked,
        inputDisabled: el.input.disabled,
        pendingAttr: el.sw.getAttribute('data-pending'),
        lockedInputDisabled: el.lockedInput.disabled,
        message: el.note.hidden ? null : {
          variant: el.note.getAttribute('data-op-state'),
          title: el.noteTitle.textContent,
          text: el.noteBody.textContent
        },
        noteFocusable: el.note.getAttribute('tabindex') === '-1',
        noteVisible: realVisible(el.note),
        checkVisible: realVisible(el.checkBtn),
        checkDisplay: window.getComputedStyle(el.checkBtn).display,
        checkRect: (function () { var r = el.checkBtn.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })(),
        checkBusy: el.checkBtn.getAttribute('aria-busy') === 'true',
        focusId: document.activeElement ? (document.activeElement.id || document.activeElement.tagName.toLowerCase()) : 'none',
        updateCalls: connector.counters.update,
        checkCalls: connector.counters.check,
        staleIgnored: state.staleIgnored,
        sim: connector.readout()
      };
    }
  };

  /* ---------- إقلاع: مطابقة confirmed بلا أحداث ولا تحديثات ---------- */
  el.input.checked = state.confirmed;
  el.note.setAttribute('tabindex', '-1');
  el.input.setAttribute('aria-describedby', 'f02s-note');
  renderSwitchState();
})();
