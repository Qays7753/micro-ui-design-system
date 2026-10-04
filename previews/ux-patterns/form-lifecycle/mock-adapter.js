/* =========================================================
   Micro UI — UX-F01: موصل المحاكاة القابل للاستبدال + أدوات SIMULATION
   الملف: previews/ux-patterns/form-lifecycle/mock-adapter.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة، ليست API جديدة للمكتبة.

   العقد (من docs/ux/F01-ACCEPTANCE.md §3):
   - save({attemptId, values}) → Promise<{attemptId, outcome: 'saved'|'not-saved'|'unknown'}>
   - check({attemptId})        → Promise بالصيغة نفسها، استعلام للمحاولة نفسها بلا حفظ جديد.
   - رفض Promise أثناء save يعامل unknown إن لم يؤكد العقد عدم الحفظ؛ رفض check يبقى unknown.
     ولرفض معلوم صريح استخدم نتيجة not-saved.
   - السيناريو (setNextSave/setNextCheck) يطبق على الدعوة المقبلة فقط — لا يعدّل
     Promise جارٍ أو نتيجته بعد انطلاقه.
   - الإنهاء حتمي بأمر صريح (settle) — لا مؤقت واجهة يقرر نتيجة، ولا sleeps.
   - (F01-R1-05) لا توجد أداة respond هنا: تسوية Promise الطلب المعلق برد
     بمعرف قديم كانت تستهلك الطلب الحالي وتعلق المحاكاة (لا يمكن حسمه بعدها).
     رد الفحص بمعرف قديم يُسلّم الآن عبر مسار معالجة النتائج لدى المستهلك
     (F01Example.deliverTestResponse) — نفس معالجات Promise وفلتر attemptId —
     دون استهلاك الطلب المعلق؛ فيُتجاهل الرد القديم ويظل الطلب قابلًا للحسم
     بنتيجته الصحيحة. ما يثبته الفحص: فلتر المستهلك وتجاهله واستمرار الحسم —
     لا يثبت وصولًا شبكيًا فعليًا لرد محاولة سابقة (حد موثق في README).
   - عدّادا الدعوات وسجل النسخة المرسلة/معرف المحاولة معروضان في قسم SIMULATION
     وفي inspect() للفحص — وليسا رسائل مستفيد.
   لا localStorage ولا شبكة ولا مصادقة ولا بيانات حقيقية.
   ========================================================= */

(function () {
  'use strict';

  var OUTCOMES = ['saved', 'not-saved', 'unknown'];

  function isOutcome(o) { return OUTCOMES.indexOf(o) >= 0 || o === 'reject'; }

  function createConnector() {
    var counters = { save: 0, check: 0 };
    var calls = [];                    /* سجل كل دعوة للفحص */
    var next = { save: 'saved', check: 'saved' }; /* السيناريو المسلح للدعوة المقبلة */
    var pending = { save: null, check: null };

    function emit(detail) {
      document.dispatchEvent(new CustomEvent('f01:sim', { detail: detail }));
    }

    function snapshot(values) {
      return values ? { name: String(values.name == null ? '' : values.name),
                        note: String(values.note == null ? '' : values.note) } : null;
    }

    function readout() {
      return {
        saveCalls: counters.save,
        checkCalls: counters.check,
        pendingSave: !!(pending.save && !pending.save.settled),
        pendingCheck: !!(pending.check && !pending.check.settled),
        lastAttempt: calls.length ? calls[calls.length - 1].attemptId : null,
        nextSave: next.save,
        nextCheck: next.check
      };
    }

    function makeCall(kind, payload) {
      if (pending[kind] && !pending[kind].settled) {
        /* حراسة الموصل نفسها: دعوة ثانية أثناء معلق تعارض مع عقد العينة —
           المستهلك ملزم بحراستها أولًا؛ هنا نعلن الفيض لا نتجاهله بصمت. */
        emit(Object.assign({ type: 'overflow', kind: kind }, readout()));
      }
      counters[kind] += 1;
      var armed = next[kind];
      if (!isOutcome(armed)) armed = 'saved';
      next[kind] = 'saved'; /* سيناريو لمرة واحدة: الدعوة المقبلة فقط */
      var entry = {
        seq: calls.length + 1,
        kind: kind,
        attemptId: payload && typeof payload.attemptId === 'number' ? payload.attemptId : null,
        values: kind === 'save' ? snapshot(payload && payload.values) : null,
        armed: armed,
        settled: false,
        result: null
      };
      calls.push(entry);
      var promise = new Promise(function (resolve, reject) {
        entry._resolve = resolve;
        entry._reject = reject;
      });
      pending[kind] = entry;
      emit(Object.assign({ type: 'call', kind: kind }, readout()));
      return promise;
    }

    function settle(kind, override) {
      var entry = pending[kind];
      if (!entry || entry.settled) return false;
      entry.settled = true;
      pending[kind] = null;
      var outcome = override || entry.armed;
      if (!isOutcome(outcome)) outcome = 'saved';
      if (outcome === 'reject') {
        entry.result = { rejected: true };
        entry._reject(new Error('محاكاة UX-F01: رفض Promise بلا نتيجة معلومة'));
      } else {
        var res = { attemptId: entry.attemptId, outcome: outcome };
        entry.result = res;
        entry._resolve(res);
      }
      emit(Object.assign({ type: 'settled', kind: kind, outcome: outcome }, readout()));
      return true;
    }

    return {
      save: function (p) { return makeCall('save', p); },
      check: function (p) { return makeCall('check', p); },
      setNextSave: function (o) { if (isOutcome(o)) { next.save = o; emit(Object.assign({ type: 'scenario' }, readout())); } },
      setNextCheck: function (o) { if (isOutcome(o)) { next.check = o; emit(Object.assign({ type: 'scenario' }, readout())); } },
      settle: settle,
      counters: counters,
      calls: calls,
      readout: readout
    };
  }

  /* ---- ربط قسم SIMULATION بالصفحة (خارج واجهة المثال) ----
     يستقبل الموصل الذي أنشأه example.js للعينة نفسها + جذر القسم. */
  function bindSimulationPanel(root, connector) {
    if (!root || !connector) return;
    var saveSel = root.querySelector('#f01-sim-save-outcome');
    var checkSel = root.querySelector('#f01-sim-check-outcome');
    var settleSave = root.querySelector('#f01-sim-settle-save');
    var settleCheck = root.querySelector('#f01-sim-settle-check');
    var staleSave = root.querySelector('#f01-sim-stale-save');
    var staleCheck = root.querySelector('#f01-sim-stale-check');
    var saveCallsEl = root.querySelector('#f01-sim-save-calls');
    var checkCallsEl = root.querySelector('#f01-sim-check-calls');
    var attemptEl = root.querySelector('#f01-sim-attempt');
    var pendingEl = root.querySelector('#f01-sim-pending');

    function render(r) {
      /* مزامنة القوائم مع السيناريو المسلح فعليًا: السيناريو لمرة واحدة
         يُستهلك عند الدعوة، فتعود القائمة إلى الافتراضي بدل عرض قيمة قديمة */
      saveSel.value = r.nextSave;
      checkSel.value = r.nextCheck;
      saveCallsEl.textContent = String(r.saveCalls);
      checkCallsEl.textContent = String(r.checkCalls);
      attemptEl.textContent = r.lastAttempt == null ? '—' : String(r.lastAttempt);
      var busy = [];
      if (r.pendingSave) busy.push('حفظ معلق');
      if (r.pendingCheck) busy.push('تحقق معلق');
      pendingEl.textContent = busy.length ? busy.join(' + ') : 'لا طلبات معلقة';
      settleSave.disabled = !r.pendingSave;
      settleCheck.disabled = !r.pendingCheck;
      staleSave.disabled = !r.pendingSave;
      staleCheck.disabled = !r.pendingCheck;
    }

    saveSel.addEventListener('change', function () { connector.setNextSave(saveSel.value); });
    checkSel.addEventListener('change', function () { connector.setNextCheck(checkSel.value); });
    settleSave.addEventListener('click', function () { connector.settle('save'); });
    settleCheck.addEventListener('click', function () { connector.settle('check'); });
    /* (F01-R1-05) رد بمعرف قديم: يُسلّم عبر مسار معالجة النتائج لدى المستهلك
       (نفس معالجات Promise وفلتر attemptId) دون استهلاك الطلب المعلق —
       فيُتجاهل ويظل الطلب قابلًا للحسم بـ«إنهاء». المحاولات تبدأ من 1
       فالمعرف 0 لا يطابق أي محاولة نشطة. */
    staleSave.addEventListener('click', function () {
      if (window.F01Example) window.F01Example.deliverTestResponse('save', { attemptId: 0, outcome: 'saved' });
    });
    staleCheck.addEventListener('click', function () {
      if (window.F01Example) window.F01Example.deliverTestResponse('check', { attemptId: 0, outcome: 'saved' });
    });

    document.addEventListener('f01:sim', function (e) { render(e.detail); });
    render(connector.readout());
  }

  window.F01Sim = {
    createConnector: createConnector,
    bindSimulationPanel: bindSimulationPanel
  };
})();
