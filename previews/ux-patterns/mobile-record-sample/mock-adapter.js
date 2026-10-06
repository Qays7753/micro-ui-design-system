/* =========================================================
   Micro UI — UX-F03: موصل المحاكاة القابل للاستبدال + أدوات وضع المراجعة
   الملف: previews/ux-patterns/mobile-record-sample/mock-adapter.js
   الحالة: DRAFT FOR RE-REVIEW — عينة مستقلة، ليست API جديدة للمكتبة.

   العقد (docs/ux/F03-EXPERIENCE-BRIEF.md §4):
   - save({attemptId, mode:'add'|'edit', id, values})
       → Promise<{attemptId, outcome:'saved'|'not-saved'|'unknown', item?}>
     عند نتيجة saved المؤكدة فقط يُلتزم العنصر في F03Store (معرف جديد
     للإضافة وupdatedAt جديد) ويُحل Promise بمرجع العنصر الملزم.
   - check({attemptId}) → Promise بالصيغة نفسها: استعلام حتمي عن نتيجة
     محاولة الحفظ الأصلية بلا حفظ جديد (الافتراضي saved إن لم توجد).
   - readCategories({readId})
       → Promise<{readId, outcome:'ready'|'empty'|'error', items:[{value,label}]}>
   - cancel(kind, id) → إلغاء صريح بعقد موثق: رفض Promise بـ
     {cancelled:true} — لا يبقى وعد معلقًا بصمت (إغلاق R1-04).
   - الوضع الافتراضي حتمي وينجح تلقائيًا: تُحسم الدعوة بعد AUTO_SETTLE_MS
     (600ms ثابتة) بالنتيجة الافتراضية — زمن خدمة محاكاة داخل الموصل،
     لا مؤقت واجهة يقرر نجاحًا: الواجهة تنتظر Promise المستهلك دائمًا.
   - السيناريو المسلح (وضع المراجعة) يطبق على الدعوة المقبلة فقط، ويُحسم
     تلقائيًا داخل الموصل بوقت حتمي (ARMED_SETTLE_MS = 2000ms) إن لم
     يُنهَ يدويًا من طبقة وضع المراجعة — مساران مستقلان فلا يعلق
     المستخدم داخل pending أبدًا (إغلاق R1-07).
   - (R1-03) كل قراءة تثبت snapshot لعناصرها عند بدء الدعوة (نسخ
     {value,label} عنصرًا عنصرًا) وتُسوّى من snapshot الخاص بها؛ تغيير
     المصدر أو تعديل خصائص كائناته بعد الدعوة لا يمس النتيجة الجارية.
   - (R1-04) المؤقت والتسوية التلقائية مربوطان بالدخول (entry) الذي
     أنشأهما لا بـ pending[kind] الحالي؛ طلب أحدث لا تحسمه مؤقتات أقدم.
   - الفيض: دعوة ثانية لنوع معلق تُعلن overflow وتُلغي المعلق القديم
     إلغاءً صريحًا (cancel) — لا تجاهل صامت ولا وعد يتيم.
   - رفض Promise أثناء save يعامل unknown إن لم يؤكد العقد عدم الحفظ؛
     رفض check يبقى unknown؛ ولرفض معلوم صريح استخدم نتيجة not-saved.
   - عدادات وسجل الدعوات للفحص فقط — لا تدخل رسائل المستفيد.
   لا شبكة ولا مصادقة ولا بيانات حقيقية؛ البيانات تجريبية محلية.
   ========================================================= */

(function () {
  'use strict';

  var AUTO_SETTLE_MS = 600;    /* زمن خدمة المحاكاة الافتراضي — حتمي لا عشوائي */
  var ARMED_SETTLE_MS = 2000;  /* حسم السيناريو المسلح بوقت حتمي إن لم يُنهَ يدويًا */
  var SAVE_OUTCOMES = ['saved', 'not-saved', 'unknown'];
  var READ_OUTCOMES = ['ready', 'empty', 'error'];

  function isSaveOutcome(o) { return SAVE_OUTCOMES.indexOf(o) >= 0 || o === 'reject'; }
  function isReadOutcome(o) { return READ_OUTCOMES.indexOf(o) >= 0 || o === 'reject'; }

  function createConnector(options) {
    options = options || {};
    var store = options.store || null;

    var counters = { save: 0, check: 0, read: 0 };
    var calls = [];                 /* سجل كل دعوة للفحص */
    /* السيناريو المسلح للدعوة المقبلة: null = افتراضي (حسم تلقائي بعد AUTO_SETTLE_MS) */
    var next = { save: null, check: null, read: null };
    var pending = { save: null, check: null, read: null };
    /* (R1-03) تجاوز مصدر القراءة للفحص فقط — الافتراضي فئات المخزن */
    var sourceOverride = null;

    function emit(detail) {
      document.dispatchEvent(new CustomEvent('f03:sim', { detail: detail }));
    }

    function snapshotValues(values) {
      if (!values) return null;
      return {
        name: String(values.name == null ? '' : values.name),
        category: values.category == null ? null : String(values.category),
        note: String(values.note == null ? '' : values.note)
      };
    }

    /* (R1-03) snapshot عناصر {value,label} عند بدء الدعوة — نسخ عنصرًا عنصرًا */
    function snapshotSource() {
      var src = sourceOverride || (store ? store.categories() : []);
      return src.map(function (c) { return { value: String(c.value), label: String(c.label) }; });
    }

    function readout() {
      return {
        saveCalls: counters.save,
        checkCalls: counters.check,
        readCalls: counters.read,
        pendingSave: !!(pending.save && !pending.save.settled && !pending.save.cancelled),
        pendingCheck: !!(pending.check && !pending.check.settled && !pending.check.cancelled),
        pendingRead: !!(pending.read && !pending.read.settled && !pending.read.cancelled),
        nextSave: next.save || 'auto',
        nextCheck: next.check || 'auto',
        nextRead: next.read || 'auto',
        armedAutoMs: ARMED_SETTLE_MS,
        autoMs: AUTO_SETTLE_MS
      };
    }

    /* (R1-04) الحسم مرتبط بالدخول نفسه: المؤقت المغلق على entry لا يصل
       إلى pending[kind] الحالي، فلا يحسم طلبًا أ newer من زمنه. */
    function settleEntry(entry, override) {
      if (!entry || entry.settled || entry.cancelled) return false;
      entry.settled = true;
      if (pending[entry.kind] === entry) pending[entry.kind] = null;
      var outcome = override || entry.armed;
      if (entry.kind === 'read') {
        if (!isReadOutcome(outcome)) outcome = 'ready';
        if (outcome === 'reject') {
          entry.result = { rejected: true };
          entry._reject(new Error('محاكاة UX-F03: رفض Promise لقراءة الفئات'));
        } else {
          /* التسوية من snapshot الدعوة نفسها (R1-03) — لا من المصدر الحالي */
          var res = {
            readId: entry.id,
            outcome: outcome,
            items: outcome === 'ready' ? entry.snapshot.map(function (c) { return { value: c.value, label: c.label }; }) : []
          };
          entry.result = res;
          entry._resolve(res);
        }
      } else {
        if (!isSaveOutcome(outcome)) outcome = 'saved';
        if (outcome === 'reject') {
          entry.result = { rejected: true };
          entry._reject(new Error('محاكاة UX-F03: رفض Promise بلا نتيجة معلومة'));
        } else if (entry.kind === 'save' && outcome === 'saved') {
          /* التزام النتيجة المؤكدة في المخزن ثم حل Promise بالعنصر الملزم،
             وتسجيل العنصر الملتزم بالدخول ليُعيده check للمحاولة نفسها */
          var v = entry.values;
          var item = store.upsert({
            id: entry.mode === 'add' ? store.nextId() : entry.itemId,
            name: v.name,
            category: v.category,
            note: v.note,
            updatedAt: Date.now()
          });
          entry.committedItem = item;
          var res2 = { attemptId: entry.id, outcome: 'saved', item: item };
          entry.result = res2;
          entry._resolve(res2);
        } else if (entry.kind === 'check' && outcome === 'saved' && entry.committedItemId) {
          /* نجاح تحقق المحاولة نفسها: العنصر الملتزم بها (نسخة من المخزن) */
          var committed = store.get(entry.committedItemId);
          var res4 = { attemptId: entry.id, outcome: 'saved', item: committed };
          entry.result = res4;
          entry._resolve(res4);
        } else {
          var res3 = { attemptId: entry.id, outcome: outcome };
          entry.result = res3;
          entry._resolve(res3);
        }
      }
      emit(Object.assign({ type: 'settled', kind: entry.kind, outcome: outcome }, readout()));
      return true;
    }

    /* إلغاء صريح بعقد موثق: رفض {cancelled:true} — للمستهلك تجاهله بصمت
       (سياق الطلب انتهى) فلا يبقى وعد معلقًا بصمت (إغلاق R1-04/R1-05). */
    function cancel(kind, id) {
      var entry = pending[kind];
      if (!entry || entry.settled || entry.cancelled) return false;
      if (id != null && entry.id !== id) return false;
      entry.cancelled = true;
      entry.settled = true;
      pending[kind] = null;
      entry.result = { cancelled: true };
      var err = new Error('محاكاة UX-F03: أُلغي الطلب لأن سياقه انتهى');
      err.cancelled = true;
      entry._reject(err);
      emit(Object.assign({ type: 'cancelled', kind: kind }, readout()));
      return true;
    }

    /* دعوة موحدة: سيناريو مسلّح = حسم حتمي بعد ARMED_SETTLE_MS أو أمر يدوي؛
       وإلا حسم تلقائي حتمي بعد AUTO_SETTLE_MS. الفيض يُعلن فقط: كل دخول
       يحسم بعقده الخاص (مؤقته/أمره/إلغاء المستهلك) فلا وعد يتيم ولا
       مؤقت قديم يحسم أحدث (إغلاق R1-04). */
    function makeCall(kind, payload, defaultOutcome) {
      if (pending[kind] && !pending[kind].settled && !pending[kind].cancelled) {
        /* حراسة الفيض: نعلن (للفحص) — الدعوة الجديدة تُزاح المعلق السابق
           من pending[kind] لكن دخوله يبقى قادرًا على الحسم بمؤقته أو
           بالإلغاء الصريح من المستهلك عند انتهاء سياقه. */
        emit(Object.assign({ type: 'overflow', kind: kind }, readout()));
      }
      counters[kind] += 1;
      var armed = next[kind];
      next[kind] = null; /* سيناريو لمرة واحدة: الدعوة المقبلة فقط */
      var entry = {
        seq: calls.length + 1,
        kind: kind,
        id: kind === 'read' ? (payload && payload.readId) : (payload && payload.attemptId),
        mode: kind === 'save' ? (payload && payload.mode) || 'edit' : null,
        itemId: kind === 'save' ? (payload && payload.id) || null : null,
        values: kind === 'save' ? snapshotValues(payload && payload.values) : null,
        /* (R1-03) snapshot القراءة يثبت الآن — عند بدء الدعوة لا عند التسوية */
        snapshot: kind === 'read' ? snapshotSource() : null,
        armed: armed || defaultOutcome,
        settled: false,
        cancelled: false,
        result: null
      };
      calls.push(entry);
      var promise = new Promise(function (resolve, reject) {
        entry._resolve = resolve;
        entry._reject = reject;
      });
      pending[kind] = entry;
      emit(Object.assign({ type: 'call', kind: kind }, readout()));

      var delay = armed ? ARMED_SETTLE_MS : AUTO_SETTLE_MS;
      window.setTimeout(function () { settleEntry(entry); }, delay);
      return promise;
    }

    /* التسوية اليدوية تستهدف الدخول المزاح أيضًا إن كان أحدث pending —
       والعكس: settle(kind) ينهي المعلق الحالي لنوعه فقط (عقد واضح). */

    return {
      save: function (p) { return makeCall('save', p, 'saved'); },
      check: function (p) {
        /* استعلام حتمي عن نتيجة المحاولة الأصلية بلا حفظ جديد؛ النجاح
           يعيد العنصر الملتزم بالمحاولة نفسها (نسخة من المخزن) */
        var attemptId = p && p.attemptId;
        var original = null;
        for (var i = calls.length - 1; i >= 0; i--) {
          if (calls[i].kind === 'save' && calls[i].id === attemptId) { original = calls[i]; break; }
        }
        var replay = 'saved';
        if (original && original.result && !original.result.cancelled && !original.result.rejected) {
          replay = original.result.outcome;
        }
        var promise = makeCall('check', p, replay);
        /* تسجيل العنصر الملتزم بالمحاولة الأصلية على دخول التحقق نفسه */
        if (original && original.committedItem && calls.length) {
          calls[calls.length - 1].committedItemId = original.committedItem.id;
        }
        return promise;
      },
      readCategories: function (p) { return makeCall('read', p, 'ready'); },
      cancel: cancel,
      setNextSave: function (o) { next.save = isSaveOutcome(o) ? o : null; emit(Object.assign({ type: 'scenario' }, readout())); },
      setNextCheck: function (o) { next.check = isSaveOutcome(o) ? o : null; emit(Object.assign({ type: 'scenario' }, readout())); },
      setNextRead: function (o) { next.read = isReadOutcome(o) ? o : null; emit(Object.assign({ type: 'scenario' }, readout())); },
      /* للفحص: تجاوز مصدر القراءة (يطبق من القراءة التالية) — أداة فحص فقط */
      setSource: function (items) {
        sourceOverride = (items || []).map(function (c) {
          return { value: String(c.value), label: String(c.label) };
        });
        emit(Object.assign({ type: 'source' }, readout()));
      },
      settle: function (kind, override) {
        /* التسوية اليدوية للطلب المعلق الحالي من نوعه — عقد واضح للفحص
           ووضع المراجعة، ولا يمس طلبات أخرى أو طلبات ملغاة */
        return settleEntry(pending[kind], override);
      },
      counters: counters,
      calls: calls,
      readout: readout
    };
  }

  /* ---- ربط طبقة وضع المراجعة بالصفحة ----
     يستقبل الموصل وجذر الطبقة. الطبقة طبقة B07 عليا عند فتحها فتعمل
     أدواتها من الهاتف في أي لحظة (بلا console ولا reload) — إغلاق R1-07.
     النصوص التقنية داخل هذه الطبقة فقط ولا تُنقل إلى واجهة المستفيد. */
  function bindReviewPanel(root, connector) {
    if (!root || !connector) return;
    var saveSel = root.querySelector('#f03-rev-save-outcome');
    var checkSel = root.querySelector('#f03-rev-check-outcome');
    var readSel = root.querySelector('#f03-rev-read-outcome');
    var settleSave = root.querySelector('#f03-rev-settle-save');
    var settleCheck = root.querySelector('#f03-rev-settle-check');
    var settleRead = root.querySelector('#f03-rev-settle-read');
    var staleSave = root.querySelector('#f03-rev-stale-save');
    var staleCheck = root.querySelector('#f03-rev-stale-check');
    var staleRead = root.querySelector('#f03-rev-stale-read');
    var resetData = root.querySelector('#f03-rev-reset-data');
    var clearData = root.querySelector('#f03-rev-clear-data');
    var saveCallsEl = root.querySelector('#f03-rev-save-calls');
    var checkCallsEl = root.querySelector('#f03-rev-check-calls');
    var readCallsEl = root.querySelector('#f03-rev-read-calls');
    var pendingEl = root.querySelector('#f03-rev-pending');
    var storageEl = root.querySelector('#f03-rev-storage');

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

    function renderStorage() {
      if (storageEl && window.F03Store) {
        storageEl.textContent = window.F03Store.storageStatus().note;
      }
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
      if (window.F03App) window.F03App.deliverTestResponse('save', { attemptId: 0, outcome: 'saved' });
    });
    staleCheck.addEventListener('click', function () {
      if (window.F03App) window.F03App.deliverTestResponse('check', { attemptId: 0, outcome: 'saved' });
    });
    staleRead.addEventListener('click', function () {
      if (window.F03App) window.F03App.deliverTestResponse('read', { readId: 0, outcome: 'ready', items: [{ value: 'stale', label: 'فئة قديمة' }] });
    });

    resetData.addEventListener('click', function () {
      if (window.F03App) window.F03App.resetDemoData();
    });
    clearData.addEventListener('click', function () {
      if (window.F03App) window.F03App.clearDemoData();
    });

    document.addEventListener('f03:sim', function (e) { render(e.detail); });
    render(connector.readout());
    renderStorage();
  }

  window.F03Sim = {
    createConnector: createConnector,
    bindReviewPanel: bindReviewPanel,
    AUTO_SETTLE_MS: AUTO_SETTLE_MS,
    ARMED_SETTLE_MS: ARMED_SETTLE_MS
  };
})();
