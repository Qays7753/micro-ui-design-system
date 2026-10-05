/* =========================================================
   Micro UI — UX-F02 عينة المفتاح: موصل تحديث الإعداد + أدوات SIMULATION
   الملف: previews/ux-patterns/switch-lifecycle/mock-adapter.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة، ليست API جديدة للمكتبة.

   العقد (docs/ux/F02-ACCEPTANCE.md §6):
   - update({attemptId, value}) → Promise<{attemptId, outcome:'saved'|'not-saved'|'unknown'}>
     رفض update لا يثبت عدم الحفظ → نتيجة مجهولة لدى المستهلك.
   - check({attemptId}) → Promise بالصيغة نفسها — استعلام عن محاولة
     محددة بلا تحديث جديد؛ رفض check يبقي النتيجة مجهولة.
   - السيناريو (setNext*) يطبق على الدعوة المقبلة فقط ولا يعدّل طلبًا جارٍ.
   - التسوية بأمر صريح (settle) — لا مؤقت واجهة يقرر نتيجة خدمة،
     ولا شبكة أو تخزين أو مصادقة أو بيانات حقيقية.
   - الرد القديم بمعرف مختلف يُسلّم عبر معالج المستهلك نفسه
     (deliverTestResponse) دون استهلاك التسوية الحالية — يثبت فلتر
     المستهلك وتجاهله، لا وصولًا شبكيًا فعليًا.
   ========================================================= */

(function () {
  'use strict';

  var OUTCOMES = ['saved', 'not-saved', 'unknown', 'reject'];

  function createConnector() {
    var counters = { update: 0, check: 0 };
    var next = { update: 'saved', check: 'saved' };
    var pending = { update: null, check: null };
    var log = [];

    function emit(detail) {
      document.dispatchEvent(new CustomEvent('f02s:sim', { detail: detail }));
    }

    function readout() {
      return {
        updateCalls: counters.update,
        checkCalls: counters.check,
        pendingUpdate: !!(pending.update && !pending.update.settled),
        pendingCheck: !!(pending.check && !pending.check.settled),
        lastAttempt: log.length ? log[log.length - 1].attemptId : null,
        nextUpdate: next.update,
        nextCheck: next.check
      };
    }

    function makeCall(kind, payload) {
      counters[kind] += 1;
      var armed = OUTCOMES.indexOf(next[kind]) >= 0 ? next[kind] : 'saved';
      next[kind] = 'saved'; /* سيناريو لمرة واحدة: الدعوة المقبلة فقط */
      var attemptId = payload && typeof payload.attemptId === 'number' ? payload.attemptId : null;
      var entry = { seq: log.length + 1, kind: kind, attemptId: attemptId, armed: armed, settled: false };
      log.push(entry);
      var promise = new Promise(function (resolve, reject) {
        entry._resolve = resolve;
        entry._reject = reject;
      });
      if (pending[kind] && !pending[kind].settled) {
        emit(Object.assign({ type: 'overflow', kind: kind }, readout())); /* تعارض عقد العينة: يُعلن لا يُخفى */
      }
      pending[kind] = entry;
      emit(Object.assign({ type: 'call', kind: kind }, readout()));
      return promise;
    }

    function resolveEntry(kind) {
      var entry = pending[kind];
      entry.settled = true;
      pending[kind] = null;
      if (entry.armed === 'reject') {
        entry._reject(new Error('محاكاة UX-F02: رفض Promise بلا نتيجة معلومة'));
      } else {
        var res = { attemptId: entry.attemptId, outcome: entry.armed };
        entry._resolve(res);
      }
      emit(Object.assign({ type: 'settled', kind: kind, outcome: entry.armed }, readout()));
    }

    function settle(kind) {
      var entry = pending[kind];
      if (!entry || entry.settled) return false;
      resolveEntry(kind);
      return true;
    }

    return {
      update: function (p) { return makeCall('update', p); },
      check: function (p) { return makeCall('check', p); },
      setNextUpdate: function (o) { if (OUTCOMES.indexOf(o) >= 0) { next.update = o; emit(Object.assign({ type: 'scenario' }, readout())); } },
      setNextCheck: function (o) { if (OUTCOMES.indexOf(o) >= 0) { next.check = o; emit(Object.assign({ type: 'scenario' }, readout())); } },
      settle: settle,
      counters: counters,
      log: log,
      readout: readout
    };
  }

  /* ---- ربط قسم SIMULATION بالصفحة ---- */
  function bindSimulationPanel(root, connector) {
    if (!root || !connector) return;
    var updateSel = root.querySelector('#f02s-sim-update-outcome');
    var checkSel = root.querySelector('#f02s-sim-check-outcome');
    var settleUpdate = root.querySelector('#f02s-sim-settle-update');
    var settleCheck = root.querySelector('#f02s-sim-settle-check');
    var staleUpdate = root.querySelector('#f02s-sim-stale-update');
    var staleCheck = root.querySelector('#f02s-sim-stale-check');
    var callsEl = root.querySelector('#f02s-sim-calls');
    var checkCallsEl = root.querySelector('#f02s-sim-check-calls');
    var attemptEl = root.querySelector('#f02s-sim-attempt');
    var pendingEl = root.querySelector('#f02s-sim-pending');

    function render(r) {
      if (updateSel) updateSel.value = r.nextUpdate;
      if (checkSel) checkSel.value = r.nextCheck;
      if (callsEl) callsEl.textContent = String(r.updateCalls);
      if (checkCallsEl) checkCallsEl.textContent = String(r.checkCalls);
      if (attemptEl) attemptEl.textContent = r.lastAttempt == null ? '—' : String(r.lastAttempt);
      if (pendingEl) pendingEl.textContent = [r.pendingUpdate && 'تحديث معلق', r.pendingCheck && 'تحقق معلق'].filter(Boolean).join(' + ') || 'لا طلبات معلقة';
      if (settleUpdate) settleUpdate.disabled = !r.pendingUpdate;
      if (settleCheck) settleCheck.disabled = !r.pendingCheck;
      if (staleUpdate) staleUpdate.disabled = !r.pendingUpdate;
      if (staleCheck) staleCheck.disabled = !r.pendingCheck;
    }

    if (updateSel) updateSel.addEventListener('change', function () { connector.setNextUpdate(updateSel.value); });
    if (checkSel) checkSel.addEventListener('change', function () { connector.setNextCheck(checkSel.value); });
    if (settleUpdate) settleUpdate.addEventListener('click', function () { connector.settle('update'); });
    if (settleCheck) settleCheck.addEventListener('click', function () { connector.settle('check'); });
    /* رد بمعرف قديم يُسلّم عبر مسار معالجة النتائج لدى المستهلك (نفس فلتر
       attemptId) دون استهلاك Promise المعلق — المحاولات تبدأ من 1 فالمعرف
       0 لا يطابق أي محاولة نشطة. */
    if (staleUpdate) {
      staleUpdate.addEventListener('click', function () {
        if (window.F02Switch) window.F02Switch.deliverTestResponse('update', { attemptId: 0, outcome: 'saved' });
      });
    }
    if (staleCheck) {
      staleCheck.addEventListener('click', function () {
        if (window.F02Switch) window.F02Switch.deliverTestResponse('check', { attemptId: 0, outcome: 'saved' });
      });
    }

    document.addEventListener('f02s:sim', function (e) { render(e.detail); });
    render(connector.readout());
  }

  window.F02SwitchSim = {
    createConnector: createConnector,
    bindSimulationPanel: bindSimulationPanel
  };
})();
