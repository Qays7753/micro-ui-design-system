/* =========================================================
   Micro UI — UX-F03: موصل المحاكاة القابل للاستبدال + أدوات SIMULATION
   الملف: previews/ux-patterns/mobile-record-sample/mock-adapter.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة، ليست API جديدة للمكتبة.

   العقد (من docs/ux/F03-ACCEPTANCE.md §4):
   - save({attemptId, values})            → Promise<{attemptId, outcome: 'saved'|'not-saved'|'unknown'}>
   - check({attemptId})                   → Promise بالصيغة نفسها — استعلام للمحاولة نفسها بلا حفظ جديد.
   - readCategories({readId})             → Promise<{readId, outcome: 'ready'|'empty'|'error', items: [{value,label}]}>
   - رفض Promise أثناء save يعامل unknown إن لم يؤكد العقد عدم الحفظ؛ رفض check يبقى unknown.
     ولرفض معلوم صريح استخدم نتيجة not-saved.
   - الوضع الافتراضي حتمي وينجح تلقائيًا: بلا سيناريو مسلّح تُحسم الدعوة تلقائيًا بعد
     AUTO_SETTLE_MS (700ms ثابت) بالنتيجة الافتراضية (saved/saved/ready بالفئات) —
     هذا زمن خدمة المحاكاة داخل الموصل، لا مؤقت واجهة يقرر نجاحًا: الواجهة تنتظر
     Promise المستهلك دائمًا.
   - السيناريو المسلح (setNextSave/setNextCheck/setNextRead) يطبق على الدعوة المقبلة
     فقط ويجعلها معلقة حتى أمر settle(kind) الصريح — لا مؤقت واجهة ولا sleeps.
   - تسليم رد بمعرف قديم لا يمر عبر تسوية Promise الطلب المعلق (كان يستهلكه ويعلق
     المحاكاة — درس F01-R1-05): يُسلَّم عبر مسار معالجة النتائج لدى المستهلك
     (F03Example.deliverTestResponse) بذات فلتر attemptId/readId دون استهلاك الطلب
     المعلق. ما يثبته: فلتر المستهلك وتجاهله الكامل — لا يثبت وصولًا شبكيًا فعليًا.
   - عدادات الدعوات وسجلها للفحص فقط — لا تدخل رسائل المستفيد.
   لا localStorage ولا شبكة ولا مصادقة ولا بيانات حقيقية؛ الحفظ تجريبي داخل الجلسة.
   ========================================================= */

(function () {
  'use strict';

  var AUTO_SETTLE_MS = 700; /* زمن خدمة المحاكاة الثابت — حتمي لا عشوائي */
  var SAVE_OUTCOMES = ['saved', 'not-saved', 'unknown'];
  var READ_OUTCOMES = ['ready', 'empty', 'error'];

  function isSaveOutcome(o) { return SAVE_OUTCOMES.indexOf(o) >= 0 || o === 'reject'; }
  function isReadOutcome(o) { return READ_OUTCOMES.indexOf(o) >= 0 || o === 'reject'; }

  function createConnector(options) {
    options = options || {};
    var source = (options.categories || []).map(function (c) {
      return { value: String(c.value), label: String(c.label) };
    });

    var counters = { save: 0, check: 0, read: 0 };
    var calls = [];                 /* سجل كل دعوة للفحص */
    /* السيناريو المسلح للدعوة المقبلة: null = افتراضي (حسم تلقائي بعد AUTO_SETTLE_MS) */
    var next = { save: null, check: null, read: null };
    var pending = { save: null, check: null, read: null };

    function emit(detail) {
      document.dispatchEvent(new CustomEvent('f03:sim', { detail: detail }));
    }

    function snapshot(values) {
      if (!values) return null;
      return {
        name: String(values.name == null ? '' : values.name),
        category: values.category
          ? { value: String(values.category.value), label: String(values.category.label) }
          : null,
        note: String(values.note == null ? '' : values.note)
      };
    }

    function readout() {
      return {
        saveCalls: counters.save,
        checkCalls: counters.check,
        readCalls: counters.read,
        pendingSave: !!(pending.save && !pending.save.settled),
        pendingCheck: !!(pending.check && !pending.check.settled),
        pendingRead: !!(pending.read && !pending.read.settled),
        nextSave: next.save || 'auto',
        nextCheck: next.check || 'auto',
        nextRead: next.read || 'auto'
      };
    }

    /* دعوة موحدة: سيناريو مسلّح = معلقة حتى settle؛ وإلا حسم تلقائي حتمي */
    function makeCall(kind, payload, defaultOutcome) {
      if (pending[kind] && !pending[kind].settled) {
        /* حراسة الموصل نفسها: دعوة ثانية أثناء معلق تعارض مع عقد العينة —
           المستهلك ملزم بحراستها أولًا؛ هنا نعلن الفيض لا نتجاهله بصمت. */
        emit(Object.assign({ type: 'overflow', kind: kind }, readout()));
      }
      counters[kind] += 1;
      var armed = next[kind];
      next[kind] = null; /* سيناريو لمرة واحدة: الدعوة المقبلة فقط */
      var entry = {
        seq: calls.length + 1,
        kind: kind,
        id: kind === 'read' ? (payload && payload.readId) : (payload && payload.attemptId),
        values: kind === 'save' ? snapshot(payload && payload.values) : null,
        armed: armed || defaultOutcome,
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

      if (armed === null) {
        /* الوضع الافتراضي: حسم تلقائي حتمي بزمن ثابت وبالنتيجة الافتراضية —
           المسار الافتراضي للمستخدم يعمل بسهولة وينجح (بطاقة F03 §4). */
        window.setTimeout(function () { settle(kind); }, AUTO_SETTLE_MS);
      }
      /* السيناريو المسلح: تنتظر الدعوة أمر settle الصريح من أدوات الفحص */
      return promise;
    }

    function settle(kind, override) {
      var entry = pending[kind];
      if (!entry || entry.settled) return false;
      entry.settled = true;
      pending[kind] = null;
      var outcome = override || entry.armed;
      if (kind === 'read') {
        if (!isReadOutcome(outcome)) outcome = 'ready';
        if (outcome === 'reject') {
          entry.result = { rejected: true };
          entry._reject(new Error('محاكاة UX-F03: رفض Promise لقراءة الفئات'));
        } else {
          var res = {
            readId: entry.id,
            outcome: outcome,
            items: outcome === 'ready'
              ? source.map(function (c) { return { value: c.value, label: c.label }; })
              : []
          };
          entry.result = res;
          entry._resolve(res);
        }
      } else {
        if (!isSaveOutcome(outcome)) outcome = 'saved';
        if (outcome === 'reject') {
          entry.result = { rejected: true };
          entry._reject(new Error('محاكاة UX-F03: رفض Promise بلا نتيجة معلومة'));
        } else {
          var res2 = { attemptId: entry.id, outcome: outcome };
          entry.result = res2;
          entry._resolve(res2);
        }
      }
      emit(Object.assign({ type: 'settled', kind: kind, outcome: outcome }, readout()));
      return true;
    }

    return {
      save: function (p) { return makeCall('save', p, 'saved'); },
      check: function (p) { return makeCall('check', p, 'saved'); },
      readCategories: function (p) { return makeCall('read', p, 'ready'); },
      setNextSave: function (o) { next.save = isSaveOutcome(o) ? o : null; emit(Object.assign({ type: 'scenario' }, readout())); },
      setNextCheck: function (o) { next.check = isSaveOutcome(o) ? o : null; emit(Object.assign({ type: 'scenario' }, readout())); },
      setNextRead: function (o) { next.read = isReadOutcome(o) ? o : null; emit(Object.assign({ type: 'scenario' }, readout())); },
      /* للفحص: تبديل مصدر الفئات (يطبق من القراءة التالية) */
      setSource: function (items) {
        source = (items || []).map(function (c) {
          return { value: String(c.value), label: String(c.label) };
        });
        emit(Object.assign({ type: 'source' }, readout()));
      },
      settle: settle,
      counters: counters,
      calls: calls,
      readout: readout
    };
  }

  /* ---- ربط قسم SIMULATION بالصفحة (خارج واجهة المثال) ----
     يستقبل الموصل الذي أنشأه example.js للعينة نفسها + جذر القسم.
     أثناء فتح طبقة فوق الصفحة يعزل B07 الخلفية فعليًا (inert) — لذا
     توفر example.js أيضًا تحكمًا برمجيًا محايد التركيز (F03Example.arm/
     settle) لأدوات الفحص، وهذا القسم للتجربة اليدوية بلا طبقات مفتوحة. */
  function bindSimulationPanel(root, connector) {
    if (!root || !connector) return;
    var saveSel = root.querySelector('#f03-sim-save-outcome');
    var checkSel = root.querySelector('#f03-sim-check-outcome');
    var readSel = root.querySelector('#f03-sim-read-outcome');
    var settleSave = root.querySelector('#f03-sim-settle-save');
    var settleCheck = root.querySelector('#f03-sim-settle-check');
    var settleRead = root.querySelector('#f03-sim-settle-read');
    var staleSave = root.querySelector('#f03-sim-stale-save');
    var staleCheck = root.querySelector('#f03-sim-stale-check');
    var staleRead = root.querySelector('#f03-sim-stale-read');
    var saveCallsEl = root.querySelector('#f03-sim-save-calls');
    var checkCallsEl = root.querySelector('#f03-sim-check-calls');
    var readCallsEl = root.querySelector('#f03-sim-read-calls');
    var pendingEl = root.querySelector('#f03-sim-pending');

    function render(r) {
      /* مزامنة القوائم مع السيناريو المسلح فعليًا: السيناريو لمرة واحدة
         يُستهلك عند الدعوة فتعود القائمة إلى «auto» بدل عرض قيمة قديمة */
      saveSel.value = r.nextSave === 'auto' ? '' : r.nextSave;
      checkSel.value = r.nextCheck === 'auto' ? '' : r.nextCheck;
      readSel.value = r.nextRead === 'auto' ? '' : r.nextRead;
      saveCallsEl.textContent = String(r.saveCalls);
      checkCallsEl.textContent = String(r.checkCalls);
      readCallsEl.textContent = String(r.readCalls);
      var busy = [];
      if (r.pendingSave) busy.push('حفظ معلق');
      if (r.pendingCheck) busy.push('تحقق معلق');
      if (r.pendingRead) busy.push('قراءة معلقة');
      pendingEl.textContent = busy.length ? busy.join(' + ') : 'لا طلبات معلقة';
      settleSave.disabled = !r.pendingSave;
      settleCheck.disabled = !r.pendingCheck;
      settleRead.disabled = !r.pendingRead;
    }

    saveSel.addEventListener('change', function () { connector.setNextSave(saveSel.value || null); });
    checkSel.addEventListener('change', function () { connector.setNextCheck(checkSel.value || null); });
    readSel.addEventListener('change', function () { connector.setNextRead(readSel.value || null); });
    settleSave.addEventListener('click', function () { connector.settle('save'); });
    settleCheck.addEventListener('click', function () { connector.settle('check'); });
    settleRead.addEventListener('click', function () { connector.settle('read'); });

    /* رد بمعرف قديم: يُسلَّم عبر مسار معالجة النتائج لدى المستهلك (نفس
       فلتر attemptId/readId) دون استهلاك الطلب المعلق — المعرفات تبدأ
       من 1 فالمعرف 0 لا يطابق أي طلب نشط. */
    staleSave.addEventListener('click', function () {
      if (window.F03Example) window.F03Example.deliverTestResponse('save', { attemptId: 0, outcome: 'saved' });
    });
    staleCheck.addEventListener('click', function () {
      if (window.F03Example) window.F03Example.deliverTestResponse('check', { attemptId: 0, outcome: 'saved' });
    });
    staleRead.addEventListener('click', function () {
      if (window.F03Example) window.F03Example.deliverTestResponse('read', { readId: 0, outcome: 'ready', items: [{ value: 'stale', label: 'فئة قديمة' }] });
    });

    document.addEventListener('f03:sim', function (e) { render(e.detail); });
    render(connector.readout());
  }

  window.F03Sim = {
    createConnector: createConnector,
    bindSimulationPanel: bindSimulationPanel,
    AUTO_SETTLE_MS: AUTO_SETTLE_MS
  };
})();
