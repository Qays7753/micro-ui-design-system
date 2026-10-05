/* =========================================================
   Micro UI — UX-F02: سلوك المستهلك لعينة «دورة الفلاتر»
   الملف: previews/ux-patterns/filter-lifecycle/example.js
   الحالة: DRAFT FOR REVIEW — عينة مستقلة لا منطق أعمال، ولا تعدّل
   أي مصدر UI. مصدر القواعد: docs/ux/F02-ACCEPTANCE.md §4.

   مصدر الحقيقة:
   - draft: قيم اللوحة الجارية (يديرها عقد B07 داخل data-filter-panel).
   - applied: آخر نسخة مقرّة من event.detail.applied (نسخة كاملة، بلا
     اعتماد على أي خاصية داخلية للوحة).
   - القائمة مشتقة من FILTER_ITEMS_INIT بتصفية AND محلية؛ القراءة والحفظ
     والشبكة غير موجودة إطلاقًا — لا موصل، ولا «تم الحفظ»، ولا toast.

   قرارات موثقة (تفصيلها في README.md):
   - أسماء المفاتيح (q/active/marked) أسماء عقد لا نصوص مستخدم؛ الملخص
     البشري يأتي من updateSummary في B07 عبر data-filter-label أو التسمية
     المرتبطة، وعدّاد الزر عدد شروط مطبقة (0 = مخفي فعليًا بلا وصول)،
     وعدد النتائج عرض منفصل — لا عدّ نتائج داخل شرط.
   - «مسح» يمسح draft وحده؛ «إلغاء»/الإغلاق/Escape/الخلفية ترمي draft
     ولا تطلق حدث تطبيق؛ فتح اللوحة يعيد draft من applied (عقد B07).
   - no-results ليست خطأ قراءة ولا مصدرًا فارغًا: نص موجز + فعل «تعديل
     الفلاتر» يعيد فتح اللوحة مع بقاء applied كما هو.
   - البحث المطبق مشذب الأطراف حسب عقد B07؛ مطابقة literal بالاحتواء —
     لا تطبيع عربي ولا تحويل حالة؛ نص البحث يُدرج textContent حرفيًا.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- ثوابت البداية: مصدر وحيد ----------
     عدّل هنا فقط؛ تنعكس في القائمة والفحص دون تعديل HTML. */
  var FILTER_ITEMS_INIT = [
    { id: 'a', label: 'عينة أ', active: true, marked: false },
    { id: 'b', label: 'عينة ب', active: false, marked: true },
    { id: 'c', label: 'عينة ج', active: true, marked: true }
  ];
  var FILTER_APPLIED_INIT = { q: '', active: false, marked: false };

  /* ---------- عناصر العينة ---------- */
  var el = {
    openBtn: document.getElementById('f02f-filter-btn'),
    filterCount: document.getElementById('f02f-filter-count'),
    resultsCount: document.getElementById('f02f-results-count'),
    list: document.getElementById('f02f-list'),
    empty: document.getElementById('f02f-no-results'),
    editFiltersBtn: document.getElementById('f02f-edit-filters'),
    layer: document.getElementById('f02f-filter-layer')
  };

  /* ---------- الحالة ---------- */
  var applied = Object.assign({}, FILTER_APPLIED_INIT);

  /* ---------- التصفية المحلية: AND حسب عقد البطاقة ---------- */
  function matches(item, f) {
    if (f.active === true && item.active !== true) return false;
    if (f.marked === true && item.marked !== true) return false;
    var q = typeof f.q === 'string' ? f.q : '';
    if (q !== '' && item.label.indexOf(q) === -1) return false;
    return true;
  }

  function conditionCount(f) {
    var n = 0;
    if (f.active === true) n += 1;
    if (f.marked === true) n += 1;
    if (typeof f.q === 'string' && f.q !== '') n += 1;
    return n;
  }

  /* ---------- العرض ---------- */
  function renderList() {
    el.list.textContent = '';
    var shown = FILTER_ITEMS_INIT.filter(function (item) { return matches(item, applied); });
    shown.forEach(function (item) {
      var row = document.createElement('li');
      row.className = 'f02f-row';
      row.setAttribute('data-item-id', item.id);
      var title = document.createElement('span');
      title.className = 'f02f-row__label';
      title.textContent = item.label; /* نص حرفي — لا HTML */
      var meta = document.createElement('span');
      meta.className = 'f02f-row__meta';
      meta.textContent = (item.active ? 'نشطة' : 'غير نشطة') + ' · ' + (item.marked ? 'معلّمة' : 'غير معلّمة');
      row.appendChild(title);
      row.appendChild(meta);
      el.list.appendChild(row);
    });
    el.empty.hidden = shown.length !== 0;
    el.resultsCount.textContent = 'النتائج: ' + shown.length;
  }

  /* F02-R1-06: العدّاد هو .m-btn__counter المعتمد من B01 — الصفر الحقيقي
     مخفي فعليًا بـ .m-btn__counter--zero (درس تجاوز hidden في B01)،
     والاسم المتاح للزر يشرح عدد الشروط بكلمات لا رقم مجرد. */
  function conditionsLabel(n) {
    if (n === 0) return 'تصفية، لا شروط مطبقة';
    if (n === 1) return 'تصفية، شرط واحد مطبق';
    if (n === 2) return 'تصفية، شرطان مطبقان';
    return 'تصفية، ' + n + ' شروط مطبقة';
  }

  function renderBadge() {
    var n = conditionCount(applied);
    el.filterCount.textContent = String(n);
    el.filterCount.hidden = n === 0;
    el.filterCount.classList.toggle('m-btn__counter--zero', n === 0);
    el.openBtn.setAttribute('aria-label', conditionsLabel(n));
  }

  /* ---------- حدث التطبيق: نسخة من detail.applied ---------- */
  el.layer.addEventListener('micro-navigation:filters-applied', function (e) {
    var d = e.detail || {};
    applied = Object.assign({}, d.applied); /* نسخة كاملة — لا مرجع ولا خاصية داخلية */
    renderList();
    renderBadge();
  });

  /* ---------- no-results: فعل تصحيح لا خطأ قراءة ---------- */
  el.editFiltersBtn.addEventListener('click', function () {
    window.MicroNavigation.openLayer(el.layer, { trigger: el.openBtn });
  });

  el.openBtn.addEventListener('click', function () {
    window.MicroNavigation.openLayer(el.layer, { trigger: el.openBtn });
  });

  /* ---------- واجهة فحص للقراءة فقط ---------- */
  window.F02Filter = {
    version: 'F02-filter-r1',
    inspect: function () {
      var shown = FILTER_ITEMS_INIT.filter(function (item) { return matches(item, applied); });
      return {
        applied: Object.assign({}, applied),
        appliedEventCount: conditionCount(applied),
        shownIds: shown.map(function (i) { return i.id; }),
        resultsText: el.resultsCount.textContent,
        badge: {
          text: el.filterCount.textContent,
          hiddenAttr: el.filterCount.hidden,
          display: getComputedStyle(el.filterCount).display,
          visibleRect: el.filterCount.getBoundingClientRect().width > 0
        },
        summaryText: (el.layer.querySelector('[data-filter-summary]') || {}).textContent || '',
        draft: {
          q: (el.layer.querySelector('[data-filter-key="q"]') || {}).value,
          active: (el.layer.querySelector('[data-filter-key="active"]') || {}).checked,
          marked: (el.layer.querySelector('[data-filter-key="marked"]') || {}).checked
        },
        layerOpen: !el.layer.hidden,
        noResultsVisible: !el.empty.hidden,
        rowLabels: [].slice.call(el.list.querySelectorAll('.f02f-row__label')).map(function (n) { return n.textContent; }),
        focusId: document.activeElement ? (document.activeElement.id || document.activeElement.tagName.toLowerCase()) : 'none'
      };
    }
  };

  /* ---------- إقلاع: بلا أحداث ولا حفظ ---------- */
  renderList();
  renderBadge();
})();
