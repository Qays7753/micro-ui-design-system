/* =========================================================
   Micro UI — UX-F03: مخزن البيانات التجريبي (المصدر الواحد)
   الملف: previews/ux-patterns/mobile-record-sample/demo-store.js
   الحالة: DRAFT FOR RE-REVIEW — بيانات تركيبية للعينة، ليست قاعدة أعمال.

   العقد (docs/ux/F03-EXPERIENCE-BRIEF.md §3):
   - المصدر الوحيد للعناصر والفئات: كل الصفحات والملخصات تُشتق منه،
     ولا قيم بيانات مكررة في HTML ولا أرقام ثابتة منفصلة عن البيانات.
   - حفظ محلي حقيقي عند توفره (localStorage، مفتاح ثابت أدناه) بحيث
     تبقى البيانات عند إعادة فتح الملف؛ وعند التعذر أو فشل القراءة:
     تدهور آمن إلى حفظ داخل الجلسة بلا انهيار، والحالة معلنة بصدق.
   - لا شبكة ولا حسابات ولا بيانات حقيقية ولا ادعاء دوام أو مزامنة:
     حفظ تجريبي في هذا المتصفح فقط.
   - upsert يلتزم نتيجة «saved» المؤكدة من الموصل وحده (لا التزام
     من رفض أو نتيجة مجهولة — درس UX-27/UX-05).
   ========================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'micro-f03-mobile-record-v1';

  /* الفئات التركيبية الثلاث — مصدر وحيد يمرر إلى الموصل ويُشتق منه
     منتقي الفئة ولوحة التصفية وتوزيع الرئيسية. */
  var CATEGORIES = [
    { value: 'cat-a', label: 'فئة أ' },
    { value: 'cat-b', label: 'فئة ب' },
    { value: 'cat-c', label: 'فئة ج' }
  ];

  /* البذرة التركيبية: 9 عناصر محايدة تكفي للبحث والتصفية والتمرير.
     updatedAt أعداد صحيحة متمايزة (ترتيب حتمي لـ«أحدث العناصر»)؛
     الحفظ المؤكد يضع updatedAt جديدًا فيصعد العنصر في «الأحدث». */
  var SEED_ITEMS = [
    { id: 'it-01', name: 'عنصر ألف', category: 'cat-a', note: 'ملاحظة تركيبية للتجربة.', updatedAt: 9 },
    { id: 'it-02', name: 'عنصر باء', category: 'cat-b', note: '', updatedAt: 8 },
    { id: 'it-03', name: 'عنصر جيم', category: 'cat-c', note: 'ملاحظة قابلة للتعديل.', updatedAt: 7 },
    { id: 'it-04', name: 'عنصر دال', category: 'cat-a', note: '', updatedAt: 6 },
    { id: 'it-05', name: 'عنصر هاء', category: 'cat-b', note: 'ملاحظة ثانية للتجربة.', updatedAt: 5 },
    { id: 'it-06', name: 'عنصر زاي', category: 'cat-c', note: '', updatedAt: 4 },
    { id: 'it-07', name: 'عنصر حاء', category: 'cat-a', note: '', updatedAt: 3 },
    { id: 'it-08', name: 'عنصر طاء', category: 'cat-b', note: 'ملاحظة تجريبية قصيرة.', updatedAt: 2 },
    { id: 'it-09', name: 'عنصر ياء', category: 'cat-c', note: '', updatedAt: 1 }
  ];

  var items = [];
  var storage = { available: false, persistent: false, note: '' };

  function seedCopy() {
    return SEED_ITEMS.map(function (it) {
      return { id: it.id, name: it.name, category: it.category, note: it.note, updatedAt: it.updatedAt };
    });
  }

  function detectStorage() {
    try {
      var probe = STORAGE_KEY + ':probe';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      storage.available = true;
      storage.persistent = true;
      storage.note = 'التخزين المحلي متاح — التعديلات تبقى بعد إغلاق الملف.';
    } catch (e) {
      storage.available = false;
      storage.persistent = false;
      storage.note = 'التخزين المحلي غير متاح — البيانات تبقى داخل هذه الجلسة فقط.';
    }
  }

  function isValidList(list) {
    if (!Array.isArray(list)) return false;
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      if (!it || typeof it !== 'object') return false;
      if (typeof it.id !== 'string' || !it.id) return false;
      if (typeof it.name !== 'string') return false;
      if (typeof it.category !== 'string' && it.category !== null) return false;
      if (typeof it.note !== 'string') return false;
      if (typeof it.updatedAt !== 'number' || !isFinite(it.updatedAt)) return false;
    }
    return true;
  }

  function load() {
    if (!storage.available) return null;
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null; /* أول تشغيل: بذرة نظيفة تُكتب عند أول التزام */
      var parsed = JSON.parse(raw);
      if (!isValidList(parsed)) return null; /* فساد: بذرة بدل الانهيار */
      return parsed;
    } catch (e) {
      return null; /* تعذر القراءة/التحليل: بذرة بدل الانهيار */
    }
  }

  function persist() {
    if (!storage.available) return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      storage.persistent = true;
      return true;
    } catch (e) {
      /* الكتابة فشلت (حصة ممتلئة أو حجب متأخر): نكمل داخل الجلسة بلا ادعاء دوام */
      storage.persistent = false;
      return false;
    }
  }

  detectStorage();
  var loaded = load();
  items = loaded ? loaded : seedCopy();
  if (!loaded) persist(); /* كتابة البذرة عند أول تشغيل فقط */

  window.F03Store = {
    STORAGE_KEY: STORAGE_KEY,
    categories: function () {
      return CATEGORIES.map(function (c) { return { value: c.value, label: c.label }; });
    },
    categoryLabel: function (value) {
      for (var i = 0; i < CATEGORIES.length; i++) {
        if (CATEGORIES[i].value === value) return CATEGORIES[i].label;
      }
      return null;
    },
    all: function () {
      return items.slice(); /* نسخة قراءة — التعديل عبر الواجهة فقط */
    },
    get: function (id) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) return Object.assign({}, items[i]);
      }
      return null;
    },
    count: function () { return items.length; },
    nextId: function () {
      var max = 0;
      items.forEach(function (it) {
        var m = /^it-(\d+)$/.exec(it.id);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      });
      return 'it-' + String(max + 1).padStart(2, '0');
    },
    /* التزام نتيجة مؤكدة: إضافة أو تعديل، بupdatedAt جديد لترتيب «الأحدث» */
    upsert: function (item) {
      var now = { id: item.id, name: item.name, category: item.category, note: item.note, updatedAt: item.updatedAt };
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === now.id) { items[i] = now; persist(); return Object.assign({}, now); }
      }
      items.push(now);
      persist();
      return Object.assign({}, now);
    },
    resetToSeed: function () {
      items = seedCopy();
      persist();
    },
    clearAll: function () {
      items = [];
      persist();
    },
    storageStatus: function () {
      return { available: storage.available, persistent: storage.persistent, note: storage.note };
    }
  };
})();
