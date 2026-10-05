/* =========================================================
   Micro UI — UX-F02 عينة الاختيار: موصل قراءة المنتقي + أدوات SIMULATION
   الملف: previews/ux-patterns/choice-lifecycle/mock-adapter.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة، ليست API جديدة للمكتبة.

   العقد (docs/ux/F02-ACCEPTANCE.md §6):
   - read({readId}) → Promise<{readId, outcome:'ready'|'empty'|'error', items}>
     رفض Promise = خطأ قراءة معروف (error) لدى المستهلك — ليس نتيجة حفظ مجهولة.
   - القراءات المتعددة مسموحة ومتداخلة عمدًا (فتح خلال قراءة سابقة)؛
     كل طلب مستقل بمعرفه، والتسوية بأمر صريح: settle(readId?) تسوّي
     أقدم معلّق عند غياب المعرف، وsettleLatest() تسوّي الأحدث.
   - السيناريو (setNext) يطبق على الدعوة المقبلة فقط ولا يعدّل طلبًا جارٍ.
   - F02-R2-03: لقطة كل طلب نسخ عميق نسبيًا لمخطط خيارات العينة: كل عنصر
     يُنسخ عنصرًا عنصرًا عند بدء القراءة (value وlabel وdisabled/checked
     كقيم أولية) — تعديل كائنات المصدر نفسها بعد الدعوة (label أو value)
     لا يمس نتيجة الطلب الجارية، بعكس نسخ المصفوفة فقط الذي يشارك
     الكائنات. حد موثق: ما دون مخطط العينة لا يُحمل ولا يُستنسخ عميقًا.
   - لا مؤقت واجهة يقرر نتيجة، ولا شبكة أو تخزين أو مصادقة.
   - رد بمعرف قديم يُسلّم عبر مسار المستهلك (deliverTestReadResponse)
     دون استهلاك التسوية الحالية — يثبت فلتر المستهلك لا وصولًا شبكيًا.
   - عدادات الدعوات وسجل القراءات معروضان في قسم SIMULATION وفي
     inspect() — ليست رسائل مستفيد.
   ========================================================= */

(function () {
  'use strict';

  var OUTCOMES = ['ready', 'empty', 'error', 'reject'];

  /* F02-R2-03: نسخ عنصر واحد وفق مخطط خيارات العينة.
     المخطط: { value, label } إلزاميان سلوكيًا، وdisabled/checked أعلام
     اختيارية — قيم أولية بنسخ مباشر (لا مراجع مشتركة). حد موثق: مفاتيح
     خارج المخطط لا تُحمل، والكائنات المتداخلة لا تُستنسخ (لا مكتبة
     استنساخ عامة — العينة لا تحتاجها؛ القيم في المخطط أولية). */
  var SNAPSHOT_KEYS = ['value', 'label', 'disabled', 'checked'];

  function snapshotItem(item) {
    if (!item || typeof item !== 'object') return item;
    var copy = {};
    for (var i = 0; i < SNAPSHOT_KEYS.length; i++) {
      var k = SNAPSHOT_KEYS[i];
      if (item[k] !== undefined) copy[k] = item[k];
    }
    return copy;
  }

  function createConnector(config) {
    var sourceItems = (config && config.items) || [];
    var counters = { read: 0 };
    var pending = [];               /* القراءات المعلقة بالترتيب */
    var next = 'ready';             /* سيناريو الدعوة المقبلة */
    var log = [];                   /* سجل كل قراءة للفحص */

    function emit(detail) {
      document.dispatchEvent(new CustomEvent('f02c:sim', { detail: detail }));
    }

    function readout() {
      return {
        readCalls: counters.read,
        pendingCount: pending.length,
        lastReadId: log.length ? log[log.length - 1].readId : null,
        next: next,
        sourceSize: sourceItems.length
      };
    }

    function makeCall(payload) {
      counters.read += 1;
      var readId = payload && typeof payload.readId === 'number' ? payload.readId : null;
      var entry = {
        readId: readId,
        armed: OUTCOMES.indexOf(next) >= 0 ? next : 'ready',
        settled: false,
        /* F02-R1-05 + F02-R2-03: نسخة بيانات مستقلة لكل طلب عند بدئه —
           نسخ المصفوفة والعناصر معًا (snapshotItem): تعديل fixture
           (setSource) أو تعديل كائنات عناصر المصدر نفسها بعد الدعوة
           (label/value) يخص القراءة التالية ولا يمس الجارية، بعكس
           قراءة المصدر عند التسوية أو نسخ المصفوفة فقط الذي يشارك
           كائنات العناصر. */
        itemsSnapshot: sourceItems.map(snapshotItem)
      };
      next = 'ready'; /* سيناريو الدعوة التالية فقط */
      log.push(entry);
      var promise = new Promise(function (resolve, reject) {
        entry._resolve = resolve;
        entry._reject = reject;
      });
      pending.push(entry);
      emit(Object.assign({ type: 'call' }, readout()));
      return promise;
    }

    function resolveEntry(entry) {
      var outcome = entry.armed;
      if (OUTCOMES.indexOf(outcome) < 0) outcome = 'ready';
      if (outcome === 'reject') {
        entry._reject(new Error('محاكاة UX-F02: رفض قراءة بلا نتيجة معلومة'));
      } else {
        /* النتيجة من لقطة الطلب نفسه — لا من المصدر الحالي */
        var items = outcome === 'ready' ? (entry.itemsSnapshot || []).slice() : [];
        entry._resolve({ readId: entry.readId, outcome: outcome, items: items });
      }
      emit(Object.assign({ type: 'settled', outcome: outcome, readId: entry.readId }, readout()));
    }

    function settle(readId) {
      var entry = null;
      if (typeof readId === 'number') {
        for (var i = 0; i < pending.length; i++) {
          if (pending[i].readId === readId) { entry = pending[i]; break; }
        }
      } else {
        entry = pending[0]; /* الأقدم — ترتيب الوصول الافتراضي */
      }
      if (!entry || entry.settled) return false;
      entry.settled = true;
      pending = pending.filter(function (e) { return e !== entry; });
      resolveEntry(entry);
      return true;
    }

    function settleLatest() {
      if (!pending.length) return false;
      var entry = pending[pending.length - 1];
      entry.settled = true;
      pending = pending.filter(function (e) { return e !== entry; });
      resolveEntry(entry);
      return true;
    }

    return {
      read: function (p) { return makeCall(p); },
      /* أداة SIMULATION: تبديل مصدر الخيارات لاختبار القراءة التالية
         (تسمية محدثة/اختفاء اختيار) — لقطة كل طلب تُخذ عند بدئه بنسخ
         العناصر نفسها فلا يمس تعديل fixture (المصفوفة أو كائناتها)
         أي قراءة جارية (F02-R1-05 + F02-R2-03). */
      setSource: function (items) { sourceItems = (items || []).slice(); emit(Object.assign({ type: 'source' }, readout())); },
      setNext: function (o) { if (OUTCOMES.indexOf(o) >= 0) { next = o; emit(Object.assign({ type: 'scenario' }, readout())); } },
      settle: settle,
      settleLatest: settleLatest,
      counters: counters,
      log: log,
      readout: readout
    };
  }

  /* ---- ربط قسم SIMULATION (خارج واجهة المثال) ---- */
  function bindSimulationPanel(root, connector) {
    if (!root || !connector) return;
    var outcomeSel = root.querySelector('#f02c-sim-outcome');
    var settleLatestBtn = root.querySelector('#f02c-sim-settle-latest');
    var settleOldestBtn = root.querySelector('#f02c-sim-settle-oldest');
    var staleBtn = root.querySelector('#f02c-sim-stale');
    var callsEl = root.querySelector('#f02c-sim-calls');
    var staleEl = root.querySelector('#f02c-sim-stale-count');
    var lastIdEl = root.querySelector('#f02c-sim-last-id');
    var pendingEl = root.querySelector('#f02c-sim-pending');

    function render(r) {
      if (outcomeSel) outcomeSel.value = r.next === 'ready' ? 'ready' : r.next;
      if (callsEl) callsEl.textContent = String(r.readCalls);
      if (lastIdEl) lastIdEl.textContent = r.lastReadId == null ? '—' : String(r.lastReadId);
      if (pendingEl) pendingEl.textContent = r.pendingCount ? r.pendingCount + ' معلقة' : 'لا قراءات معلقة';
      if (settleLatestBtn) settleLatestBtn.disabled = !r.pendingCount;
      if (settleOldestBtn) settleOldestBtn.disabled = !r.pendingCount;
      if (staleEl && window.F02Choice) staleEl.textContent = String(window.F02Choice.inspect().staleIgnored);
    }

    if (outcomeSel) outcomeSel.addEventListener('change', function () { connector.setNext(outcomeSel.value); });
    if (settleLatestBtn) settleLatestBtn.addEventListener('click', function () { connector.settleLatest(); });
    if (settleOldestBtn) settleOldestBtn.addEventListener('click', function () { connector.settle(); });
    if (staleBtn) {
      staleBtn.addEventListener('click', function () {
        if (window.F02Choice) {
          window.F02Choice.deliverTestReadResponse({ readId: 0, outcome: 'ready', items: [{ value: 'stale', label: 'رد قديم' }] });
        }
      });
    }
    document.addEventListener('f02c:sim', function (e) { render(e.detail); });
    render(connector.readout());
  }

  window.F02ChoiceSim = {
    createConnector: createConnector,
    bindSimulationPanel: bindSimulationPanel
  };
})();
