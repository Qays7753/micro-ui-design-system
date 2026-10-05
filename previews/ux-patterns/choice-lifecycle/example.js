/* =========================================================
   Micro UI — UX-F02: سلوك المستهلك لعينة «دورة الاختيار»
   الملف: previews/ux-patterns/choice-lifecycle/example.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة لا منطق أعمال ولا framework،
   ولا تعدّل أي مصدر UI. مصدر القواعد: docs/ux/F02-ACCEPTANCE.md §3.

   مصدر الحقيقة:
   - selected: الاختيار المحلي الفوري {value,label} أو null.
     يبدأ من PICKER_SELECTED_INIT (لا أحداث/طلبات عند الإقلاع)، ويُبذر
     داخل المنتقي نفسه عند الإقلاع (F02-R1-01 أدناه) فلا يزيله أول ready.
   - readSeq: معرف القراءة المتزايد (readId) — النتيجة بمعرف أقدم من
     readSeq تُتجاهل كليًا (لا قيمة/رسالة/تركيز).
   - mode: «موجز»|«تفصيلي» محلي عبر المقطّع — بلا أثر على المنتقي.

   قرارات جولة R2 (تفصيلها في README.md):
   - R1-01 بذرة البداية من مصدر واحد: PICKER_SELECTED_INIT يُزرع في
     حالة المستهلك وداخل المنتقي (aria-selected عبر عقد DOM الموثقة
     و[data-picker-summary]) عند الإقلاع، بلا أحداث اختيار/قراءة مبكرة.
     أول ready صحيح يُبقي معرف البداية الموجود محددًا داخل المنتقي
     وخارجه؛ معرف غائب فعلًا يُمسح بأول تأكيد قراءة برسالة الزوال.
   - R1-02 empty مؤكدة تُطبق مصدرًا فارغًا وتزامن null والملخص والعرض
     ورسالة الزوال — مثل ready بقائمة فارغة. loading/error يحفظان
     آخر اختيار محلي وفق البطاقة §3.2.
   - R1-03 حرس التركيز ينتقل فقط قبل زوال عنصر مركّز سيُخفى أو يُستبدل
     (خيار/صف حالة/زر إعادة محاولة)؛ العناصر الثابتة (البحث/إغلاق
     الطبقة/غيرها) لا تُسرق منها، وإن انتقل المستخدم لهدف آخر صالح
     فلا نقل.
   - R1-04 توجيه رسالة معالجة الاختيار: داخل طبقة مفتوحة تُدمج في
     إعلان القراءة نفسه على القناة الوحيدة داخل نطاق الطبقة (#f02c-
     picker-live، live-only) كي لا تسقط في خلفية inert ولا تُعلن
     مرتين؛ خارج الطبقة تُكتب في #f02c-selection-note. no-results
     ومسح البحث يزامنان إعلانًا مفهومًا بدل عدد قراءة قديم.
   - R1-06 إغلاق ظاهر واحد في هذا التركيب: زر رأس الطبقة (B07) —
     Escape/الخلفية كما هي. القناة داخل الطبقة live-only؛ الحالة
     المرئية لكل معنى هي صف حالة المنتقي (من core) والملخص.

   قرارات موثقة (تفصيلها في README.md):
   - الاختيار فوري ومحلي: micro-picker:change بقيمة يحدّث القيمة والعرض
     الخارجي ثم يغلق الطبقة. setOptions أو المسح (قيمة null) لا يغلق.
   - كل فتح للطبقة يبدأ قراءة جديدة بreadId جديد؛ الإغلاق لا يلغي قراءة،
     والنتيجة المقبولة تزامن العرض ولو كانت الطبقة مغلقة، ولا إعادة فتح
     تلقائية (الإغلاق الظاهر = زر رأس الطبقة/Escape/الخلفية كلها إغلاق
     عرض لا «إلغاء»).
   - الحالة عبر setStatus: loading/error/empty تخفي الخيارات القديمة
     (لا اختيار نتائج عتيقة)، والبحث لا يزيل حالة الخطأ.
   - setOptions: يحفظ اختيارًا باقيًا بالمعرف ويزامن تسميته الخارجية
     حتى دون حدث change (بقاء المعرف)، ويسقط الاختيار الزائل مع رسالة
     «الخيار السابق لم يعد متاحًا. اختر مجددًا» — بلا اختيار تلقائي لأول خيار.
   - مصدر فارغ (ready بلا عناصر أو empty): مصدر فارغ مطبق + حالة صريحة
     بعد setOptions — لا اعتماد على قائمة بيضاء، والمسح يزامن null.
     no-results نتيجة بحث فقط ولا تخلط بالحالة.
   - التركيز (F02-14/F02-R1-03): قبل زوال عنصر مركّز سيُخفى/يُستبدل
     (خيار/صف حالة/إعادة محاولة) ينتقل التركيز إلى حقل البحث الثابت؛
     العناصر الثابتة لا تُسرق منها، وإن نقل المستخدم تركيزه فلا نقل.
     عند إغلاق الطبقة يدير B07 الإعادة وحده.
   - قناة الإعلان (حدث = قناة واحدة):
     · حالة القراءة وسقوط الاختيار أثناء طبقة مفتوحة: #f02c-picker-live
       داخل نطاق الطبقة (live-only بلا strip مرئي مكرر — الحالة المرئية
       صف حالة المنتقي من core). رسالة السقوط تُدمج في إعلان القراءة
       نفسه كي لا تُعلن مرتين ولا يطغى عليها عد القراءة.
     · سقوط الاختيار والعرض مغلق: #f02c-selection-note (role=status).
     · لا MicroMessages.announce لأي من النصين، ولا منطقة حية ثالثة.
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
  /* F02-R1-04: أثناء معالجة نتيجة قراءة تُؤجل رسالة السقوط لتُدمج في
     إعلان القراءة نفسه (قناة واحدة، بلا إعلان مزدوج). خارج المعالجة
     تُوجّه فورًا حسب موضع الطبقة. */
  var inReadResult = false;
  var pendingDropNote = null;

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

  /* F02-14 + F02-R1-03: التركيز يُنقل إلى البحث الثابت فقط قبل زوال
     عنصر مركّز سيُخفى أو تُستبدل عقده (خيار/صف حالة/زر إعادة محاولة).
     العناصر الثابتة — حقل البحث وزر إغلاق الطبقة وغيرهما — لا تُسرق
     منها، وإن نقل المستخدم تركيزه إلى هدف آخر صالح فلا نقل. */
  function moveFocusIntoPickerBeforeDataChange() {
    var layerOpen = !el.layer.hidden;
    if (!layerOpen) return;
    var active = document.activeElement;
    if (!active || !el.picker.contains(active)) return;
    var doomed = active.classList.contains('m-picker__option')
      || active.hasAttribute('data-picker-retry')
      || !!active.closest('.m-picker__state');
    if (!doomed) return; /* عنصر ثابت أو هدف صالح آخر — لا سرقة */
    var search = el.picker.querySelector('[data-picker-search]');
    if (search && active !== search) search.focus();
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
    inReadResult = true;
    pendingDropNote = null;
    try {
      if (res.outcome === 'ready') {
        window.MicroPicker.setOptions(el.picker, res.items || []);
        /* المزامنة بعد setOptions — بما فيها تسمية جديدة لبقاء المعرف
           دون حدث change، أو سقوط الاختيار (رسالته تُدمج أدناه) */
        syncSelectionFromPicker();
        if (!res.items || !res.items.length) {
          /* مصدر فارغ: حالة صريحة بعد setOptions — لا اعتماد على قائمة بيضاء */
          window.MicroPicker.setStatus(el.picker, 'empty', 'لا خيارات في المصدر.');
          announceWithDropNote('لا خيارات في المصدر.');
        } else {
          announceWithDropNote('تمت القراءة: ' + res.items.length + ' خيارات.');
        }
      } else if (res.outcome === 'empty') {
        /* F02-R1-02: empty مؤكدة تطبق مصدرًا فارغًا وتزامن null والملخص
           والعرض ورسالة الزوال — مثل ready بقائمة فارغة. ليست كـ
           loading/error الذين يحفظان آخر اختيار محلي وفق البطاقة §3.2. */
        window.MicroPicker.setOptions(el.picker, []);
        syncSelectionFromPicker();
        window.MicroPicker.setStatus(el.picker, 'empty', 'لا خيارات في المصدر.');
        announceWithDropNote('لا خيارات في المصدر.');
      } else {
        window.MicroPicker.setStatus(el.picker, 'error');
        announceWithDropNote('تعذرت قراءة الخيارات.');
      }
    } finally {
      inReadResult = false;
      pendingDropNote = null;
    }
  }

  /* F02-R1-04: حالة القراءة + سقوط الاختيار في تحديث قناة واحد داخل
     نطاق الطبقة المفتوحة (لا إعلان مزدوج ولا يطغى عد القراءة على رسالة
     السقوط). والعرض مغلق: السقوط إلى القناة الخارجية المناسبة. */
  function announceWithDropNote(baseText) {
    if (pendingDropNote && el.layer.hidden) {
      /* عرض مغلق: القناة الخارجية للمعالجة، وإعلان حالة القراءة كما هو */
      setSelectionNote(pendingDropNote);
      announceReadState(baseText);
      return;
    }
    announceReadState(pendingDropNote ? baseText + ' ' + pendingDropNote : baseText);
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
      var dropNote = 'الخيار السابق لم يعد متاحًا. اختر مجددًا.';
      if (inReadResult) {
        /* داخل معالجة قراءة: يُدمج مع إعلان القراءة نفسه (قناة واحدة) */
        pendingDropNote = dropNote;
      } else {
        routeProcessingMessage(dropNote);
      }
    }
    renderSelection();
  }

  /* F02-R1-04: توجيه رسالة معالجة الاختيار إلى القناة الصحيحة حسب موضع
     الطبقة — داخلها عبر قناتها الحية داخل النطاق (وإلا سقطت في خلفية
     inert)، وخارجها القناة الخارجية. قناة واحدة لكل حدث بلا إعلان
     مزدوج ولا إعادة فتح. */
  function routeProcessingMessage(text) {
    if (!el.layer.hidden) {
      announceReadState(text);
    } else {
      setSelectionNote(text);
    }
  }

  /* ---------- بذرة اختيار البداية (F02-R1-01) ----------
     مصدر واحد: PICKER_SELECTED_INIT يُزرع في حالة المستهلك وداخل
     المنتقي نفسه عند الإقلاع — بناء الخيارات من PICKER_READ_ITEMS_INIT
     (بلا أحداث اختيار لأن لا تحديد سابق) ثم aria-selected على العقدة
     الموثقة وتحديث الملخص الداخلي. بلا أحداث حفظ/قراءة مبكرة. معرف
     البداية غير موجود في المصدر: لا بذرة داخل المنتقي، وأول ready
     يؤكد الزوال ويمسح برسالة الزوال الصحيحة. */
  function seedInitialSelection() {
    if (!state.selected) return;
    window.MicroPicker.setOptions(el.picker, PICKER_READ_ITEMS_INIT);
    var options = el.picker.querySelectorAll('.m-picker__option');
    for (var i = 0; i < options.length; i++) {
      if (options[i].getAttribute('data-value') === state.selected.value) {
        options[i].setAttribute('aria-selected', 'true');
        var foot = el.picker.querySelector('[data-picker-summary]');
        if (foot) foot.textContent = 'المحدد: ' + options[i].textContent.trim();
        return;
      }
    }
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

  /* F02-R1-04: مزامنة إعلان البحث مع القناة داخل الطبقة — لا عدد قراءة
     قديم يوهم بوجود نتائج عند no-results، ومسح البحث يعلن حالة مفهومة.
     لا role حي على خيار أو صف نتائج؛ القناة واحدة هي #f02c-picker-live.
     حالة القراءة (غير ready) يدير إعلانها مسار القراءة — لا نعلن فوقها. */
  var searchInput = el.picker.querySelector('[data-picker-search]');
  function bindSearchAnnouncement() {
    if (!searchInput || searchInput.dataset.f02SearchAnnounced) return;
    searchInput.dataset.f02SearchAnnounced = '1';
    searchInput.addEventListener('input', function () {
      if (el.layer.hidden) return;
      var row = el.picker.querySelector('.m-picker__state');
      var rowText = row ? row.textContent : '';
      /* صف «لا نتائج مطابقة» نتيجة تصفية بحث فقط (يظهر في ready وحده) */
      if (rowText.indexOf('لا نتائج مطابقة') !== -1) {
        announceReadState('لا نتائج مطابقة للبحث. جرّب اسمًا آخر.');
        return;
      }
      if (row) return; /* صف حالة قراءة (loading/error/empty) — مسار القراءة يعلنها */
      var visible = pickerStatusVisibleOptionCount();
      if (searchInput.value.trim() === '') {
        announceReadState('الخيارات الظاهرة: ' + visible + ' خيارات.');
      } else {
        announceReadState('نتائج البحث: ' + visible + ' خيارات.');
      }
    });
  }
  /* التسجيل بعد init المنتقي (DOMContentLoaded يُبلّغ المسجلين بترتيبهم،
     وpicker.js سجل نفسه قبل هذا الملف) كي يقرأ المستمع DOM بعد تصفية
     المنتقي لا قبلها — وإلا لعكس الإعلان حدثًا (درس مُثبت بالفحص). */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSearchAnnouncement);
  } else {
    bindSearchAnnouncement();
  }

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

  /* ---------- إقلاع: بلا أحداث ولا طلبات ----------
     F02-R1-01: بذرة اختيار البداية داخل المنتقي نفسه من المصدر الواحد
     (aria-selected + الملخص) دون أحداث اختيار/قراءة مبكرة. */
  renderGroups();
  seedInitialSelection();
  renderSelection();
})();
