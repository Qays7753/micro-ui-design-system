/* =========================================================
   Micro UI — UX-F02: سلوك المستهلك لعينة «دورة الاختيار»
   الملف: previews/ux-patterns/choice-lifecycle/example.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة لا منطق أعمال ولا framework،
   ولا تعدّل أي مصدر UI. مصدر القواعد: docs/ux/F02-ACCEPTANCE.md §3.

   مصدر الحقيقة:
   - selected: الاختيار المحلي الفوري {value,label} أو null.
     يبدأ من PICKER_SELECTED_INIT (لا أحداث/طلبات عند الإقلاع).
   - readSeq: معرف القراءة المتزايد (readId) — النتيجة بمعرف أقدم من
     readSeq تُتجاهل كليًا (لا قيمة/رسالة/تركيز).
   - mode: «موجز»|«تفصيلي» محلي عبر المقطّع — بلا أثر على المنتقي.

   قرارات موثقة (تفصيلها في README.md):
   - الاختيار فوري ومحلي: micro-picker:change بقيمة يحدّث القيمة والعرض
     الخارجي ثم يغلق الطبقة. setOptions أو المسح (قيمة null) لا يغلق.
   - كل فتح للطبقة يبدأ قراءة جديدة بreadId جديد؛ الإغلاق لا يلغي قراءة،
     والنتيجة المقبولة تزامن العرض ولو كانت الطبقة مغلقة، ولا إعادة فتح
     تلقائية (الإغلاق الظاهر/Escape/الخلفية كلها إغلاق عرض لا «إلغاء»).
   - الحالة عبر setStatus: loading/error/empty تخفي الخيارات القديمة
     (لا اختيار نتائج عتيقة)، والبحث لا يزيل حالة الخطأ.
   - setOptions: يحفظ اختيارًا باقيًا بالمعرف ويزامن تسميته الخارجية
     حتى دون حدث change (بقاء المعرف)، ويسقط الاختيار الزائل مع رسالة
     «الخيار السابق لم يعد متاحًا. اختر مجددًا» — بلا اختيار تلقائي لأول خيار.
   - مصدر فارغ: setStatus(picker,'empty') صراحة بعد setOptions — لا
     اعتماد على قائمة بيضاء. no-results نتيجة بحث فقط ولا تخلط بالحالة.
   - التركيز (F02-14): قبل استبدال/إخفاء عناصر مركّز داخل منتقي مفتوح
     ينتقل التركيز إلى حقل البحث الثابت؛ إن نقل المستخدم تركيزه خارج
     العنصر المستبدل فلا سرقة. عند إغلاق الطبقة يدير B07 الإعادة وحده.
   - قناتان منفصلتان، حدث واحد = قناة واحدة:
     · حالة القراءة (loading/ready/empty/error) داخل الطبقة المفتوحة
       (#f02c-picker-live) كي لا تسقط في خلفية inert.
     · تغيّر الاختيار (اختيار/مسح/سقوط) خارجها (#f02c-selection-note).
     لا MicroMessages.announce لأي من النصين، ولا منطقة حية ثالثة.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- ثوابت البداية: مصدر وحيد للتعديل ----------
     عدّل هذه الثوابت فقط وتنعكس في العرض والموصل والفحص دون إعادة إنشاء.
     gamma معطلة محددة أصلًا وفق البطاقة §3.1 (خياران مفعّلان + ثالث
     معطل محدد) — الأعلام على نفس المصدر الواحد لا نسخ في HTML. */
  var CHOICES_INIT = [
    { value: 'alpha', label: 'عينة أ' },
    { value: 'beta', label: 'عينة ب' },
    { value: 'gamma', label: 'عينة ج', disabled: true, checked: true }
  ];
  var PICKER_SELECTED_INIT = null; /* أو {value:'beta', label:'عينة ب'} لبداية بديلة */
  /* مصدر خيارات القراءة يمرر إلى الموصل — بلا تكرار في HTML أو الموصل */
  var PICKER_READ_ITEMS_INIT = [
    { value: 'alpha', label: 'عينة أ' },
    { value: 'beta', label: 'عينة ب' },
    { value: 'gamma', label: 'عينة ج' }
  ];

  /* ---------- عناصر العينة ---------- */
  var el = {
    groupMain: document.getElementById('f02c-group-main'),
    groupZero: document.getElementById('f02c-group-zero'),
    groupZeroAll: document.getElementById('f02c-group-zero-all'),
    radios: document.getElementById('f02c-radios'),
    seg: document.getElementById('f02c-mode-seg'),
    modeBrief: document.getElementById('f02c-mode-brief'),
    modeDetail: document.getElementById('f02c-mode-detail'),
    openPicker: document.getElementById('f02c-open-picker'),
    display: document.getElementById('f02c-selected-display'),
    selectionNote: document.getElementById('f02c-selection-note'),
    clearBtn: document.getElementById('f02c-clear'),
    layer: document.getElementById('f02c-picker-layer'),
    picker: document.getElementById('f02c-picker'),
    pickerLive: document.getElementById('f02c-picker-live')
  };

  /* ---------- حالة المستهلك ---------- */
  var state = {
    selected: PICKER_SELECTED_INIT ? { value: PICKER_SELECTED_INIT.value, label: PICKER_SELECTED_INIT.label } : null,
    mode: 'brief',
    readSeq: 0,
    staleIgnored: 0
  };

  /* الموصل التجريبي — قابل للاستبدال (واجهة mock-adapter.js) */
  var connector = window.F02ChoiceSim.createConnector({ items: PICKER_READ_ITEMS_INIT });
  window.F02ChoiceSim.bindSimulationPanel(document.getElementById('f02c-sim'), connector);

  /* ---------- بناء المجموعات من المصدر الواحد ---------- */
  function checkboxRow(item, idSuffix) {
    var label = document.createElement('label');
    label.className = 'm-choice m-choice--check';
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('data-choice-item', '');
    input.id = 'f02c-choice-' + item.value + (idSuffix || '');
    if (item.disabled) input.disabled = true;
    if (item.checked) input.checked = true;
    var box = document.createElement('span');
    box.className = 'm-choice__box';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<svg><use href="#i-check"></use></svg>';
    var text = document.createElement('span');
    text.className = 'm-choice__text';
    text.textContent = item.label; /* نص حرفي — لا HTML */
    label.appendChild(input);
    label.appendChild(box);
    label.appendChild(text);
    return label;
  }

  function renderGroups() {
    if (el.groupMain) {
      el.groupMain.querySelectorAll('[data-rendered]').forEach(function (n) { n.remove(); });
      CHOICES_INIT.forEach(function (item) {
        var row = checkboxRow(item);
        row.setAttribute('data-rendered', '');
        el.groupMain.appendChild(row);
      });
    }
    if (el.radios) {
      el.radios.querySelectorAll('[data-rendered]').forEach(function (n) { n.remove(); });
      CHOICES_INIT.forEach(function (item) {
        var label = document.createElement('label');
        label.className = 'm-choice m-choice--radio';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'f02c-radio';
        input.value = item.value;
        input.id = 'f02c-radio-' + item.value;
        var box = document.createElement('span');
        box.className = 'm-choice__box';
        box.setAttribute('aria-hidden', 'true');
        var text = document.createElement('span');
        text.className = 'm-choice__text';
        text.textContent = item.label;
        label.appendChild(input);
        label.appendChild(box);
        label.appendChild(text);
        label.setAttribute('data-rendered', '');
        el.radios.appendChild(label);
      });
    }
  }

  /* ---------- العرض الخارجي للاختيار ---------- */
  function renderSelection() {
    el.display.textContent = state.selected
      ? 'المحدد: ' + state.selected.label
      : 'المحدد: لا شيء';
  }

  /* رسالة تغيّر الاختيار: القناة الحية الوحيدة خارج الطبقة.
     نص فارغ عند عدم وجود ما يقال — لا إعلان الاختيار العادي نفسه. */
  function setSelectionNote(text) {
    el.selectionNote.textContent = text || '';
  }

  /* ---------- القراءة: loading → ready | empty | error ---------- */
  function pickerStatusVisibleOptionCount() {
    return [].slice.call(el.picker.querySelectorAll('.m-picker__option'))
      .filter(function (o) { return !o.hidden; }).length;
  }

  function announceReadState(text) {
    el.pickerLive.textContent = text; /* قناة واحدة داخل الطبقة */
  }

  /* F02-14: قبل استبدال/إخفاء عنصر مركّز داخل منتقي مفتوح → البحث الثابت.
     إن كان المستخدم خارج الخيارات/المنتجق فلا سرقة تركيز. */
  function moveFocusIntoPickerBeforeDataChange() {
    var layerOpen = !el.layer.hidden;
    if (!layerOpen) return;
    var active = document.activeElement;
    if (!active || !el.picker.contains(active)) return;
    var search = el.picker.querySelector('[data-picker-search]');
    if (active !== search) search.focus();
  }

  function startRead(reason) {
    state.readSeq += 1;
    var readId = state.readSeq;
    moveFocusIntoPickerBeforeDataChange();
    window.MicroPicker.setStatus(el.picker, 'loading');
    announceReadState('جارٍ قراءة الخيارات…');
    connector.read({ readId: readId }).then(function (res) {
      handleReadResult(res);
    }, function () {
      /* رفض Promise قراءة = خطأ قراءة معروف (عقد الموصل §6) */
      handleReadResult({ readId: readId, outcome: 'error', items: [] });
    });
  }

  function belongsToLatestRead(res) {
    return !!(res && typeof res === 'object' && res.readId === state.readSeq);
  }

  function handleReadResult(res) {
    if (!belongsToLatestRead(res)) {
      state.staleIgnored += 1;
      return; /* رد أقدم: لا قيمة ولا رسالة ولا تركيز */
    }
    moveFocusIntoPickerBeforeDataChange();
    if (res.outcome === 'ready') {
      window.MicroPicker.setOptions(el.picker, res.items || []);
      /* المزامنة بعد setOptions — بما فيها تسمية جديدة لبقاء المعرف
         دون حدث change، أو سقوط الاختيار مع رسالة معالجة */
      syncSelectionFromPicker();
      if (!res.items || !res.items.length) {
        /* مصدر فارغ: حالة صريحة بعد setOptions — لا اعتماد على قائمة بيضاء */
        window.MicroPicker.setStatus(el.picker, 'empty', 'لا خيارات في المصدر.');
        announceReadState('لا خيارات في المصدر.');
      } else {
        announceReadState('تمت القراءة: ' + res.items.length + ' خيارات.');
      }
    } else if (res.outcome === 'empty') {
      window.MicroPicker.setStatus(el.picker, 'empty', 'لا خيارات في المصدر.');
      announceReadState('لا خيارات في المصدر.');
    } else {
      window.MicroPicker.setStatus(el.picker, 'error');
      announceReadState('تعذرت قراءة الخيارات.');
    }
  }

  /* بعد setOptions: الوضع المحلي يجب أن يطابق المنتقي دائمًا */
  function syncSelectionFromPicker() {
    var cur = window.MicroPicker.getSelected(el.picker);
    if (cur) {
      if (!state.selected || state.selected.value !== cur.value || state.selected.label !== cur.label) {
        state.selected = { value: cur.value, label: cur.label };
        setSelectionNote('');
      }
    } else if (state.selected) {
      state.selected = null;
      setSelectionNote('الخيار السابق لم يعد متاحًا. اختر مجددًا.');
    }
    renderSelection();
  }

  /* ---------- أحداث المنتقي ---------- */
  el.picker.addEventListener('micro-picker:change', function (e) {
    var d = e.detail || {};
    if (d.value != null) {
      /* اختيار مستخدم: فوري ومحلي ثم إغلاق الطبقة (لا Apply ثانٍ) */
      state.selected = { value: d.value, label: d.label };
      setSelectionNote('');
      renderSelection();
      window.MicroNavigation.closeLayer(el.layer);
    } else {
      /* مسح (clearSelection) أو سقوط الاختيار (setOptions): تزامن دون إغلاق.
         رسالة السقوط تصدر من syncSelectionFromPicker بعد setOptions. */
      syncSelectionFromPicker();
    }
  });

  el.picker.addEventListener('micro-picker:retry', function () {
    startRead(); /* طلب واحد واضح لكل نقرة إعادة محاولة */
  });

  /* ---------- فتح/إغلاق الطبقة ---------- */
  el.openPicker.addEventListener('click', function () {
    window.MicroNavigation.openLayer(el.layer, { trigger: el.openPicker });
  });
  el.layer.addEventListener('micro-navigation:opened', function () {
    startRead(); /* كل فتح قراءة جديدة بمعرف جديد */
  });

  /* المسح من خارج الطبقة: قيمة وعرض خارجي وداخلي إلى null — لا حفظ */
  el.clearBtn.addEventListener('click', function () {
    state.selected = null;
    setSelectionNote('');
    window.MicroPicker.clearSelection(el.picker); /* يعلن change بقيمة null → التزامن أعلاه */
    renderSelection();
  });

  /* ---------- المقطّع: وضع محلي فقط ---------- */
  el.seg.addEventListener('micro-selection:segment', function (e) {
    var v = e.detail && e.detail.value;
    if (v !== 'brief' && v !== 'detail') return;
    state.mode = v;
    el.modeBrief.hidden = v !== 'brief';
    el.modeDetail.hidden = v !== 'detail';
  });

  /* ---------- تسليم رد قراءة بمعرف قديم عبر مسار المستهلك ----------
     يمر بفلتر belongsToLatestRead نفسه دون استهلاك أي Promise معلق —
     يثبت فلتر المستهلك، لا وصولًا شبكيًا (حد موثق في README). */
  function deliverTestReadResponse(payload) {
    handleReadResult(payload);
  }

  /* ---------- واجهة فحص للقراءة فقط ---------- */
  window.F02Choice = {
    /* أداة SIMULATION: تبديل مصدر القراءة (للفحص) — موثقة في README حدود المحاكاة */
    setSource: function (items) { connector.setSource(items); },
    version: 'F02-choice-r1',
    deliverTestReadResponse: deliverTestReadResponse,
    inspect: function () {
      var options = [].slice.call(el.picker.querySelectorAll('.m-picker__option'));
      return {
        selected: state.selected ? { value: state.selected.value, label: state.selected.label } : null,
        displayText: el.display.textContent,
        selectionNote: el.selectionNote.textContent,
        mode: state.mode,
        readSeq: state.readSeq,
        staleIgnored: state.staleIgnored,
        layerOpen: !el.layer.hidden,
        pickerSummary: (el.picker.querySelector('[data-picker-summary]') || {}).textContent || '',
        options: options.map(function (o) {
          var r = o.getBoundingClientRect();
          return {
            value: o.getAttribute('data-value'),
            label: o.textContent,
            selected: o.getAttribute('aria-selected') === 'true',
            hiddenAttr: o.hidden,
            display: getComputedStyle(o).display,
            visibleRect: r.width > 0 && r.height > 0,
            tabIndex: o.tabIndex
          };
        }),
        stateRow: (function () {
          var row = el.picker.querySelector('.m-picker__state');
          return row ? row.textContent : null;
        })(),
        liveText: el.pickerLive.textContent,
        focusId: document.activeElement ? (document.activeElement.id || document.activeElement.tagName.toLowerCase()) : 'none',
        readCalls: connector.counters.read,
        searchValue: (el.picker.querySelector('[data-picker-search]') || {}).value || ''
      };
    }
  };

  /* ---------- إقلاع: بلا أحداث ولا طلبات ---------- */
  renderGroups();
  renderSelection();
})();
