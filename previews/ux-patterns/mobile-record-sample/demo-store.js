/* =========================================================
   Micro UI — UX-F03: مخزن البيانات التجريبي (المصدر الواحد)
   الملف: previews/ux-patterns/mobile-record-sample/demo-store.js
   الحالة: DRAFT FOR RE-REVIEW — بيانات تركيبية للعينة، ليست قاعدة أعمال.

   العقد (docs/ux/F03-COMPLETE-EXPERIENCE-BRIEF.md §3):
   - المصدر الوحيد للعناصر والفئات والإعدادات: كل الوجهات والملخصات
     والرسوم تُشتق منه، ولا قيم بيانات مكررة في HTML ولا أرقام ثابتة
     منفصلة عن البيانات.
   - مخطط العنصر (توسعة بتكليف المالك: قيم وكميات وتواريخ وحالات):
       { id, name, category, note,
         value: number|null,        // مبلغ د.أ — null = قيمة مجهولة (لا صفر)
         quantity: number>=0,       // كمية صحيحة
         date: string|null,         // 'YYYY-MM-DD' — null = بلا تاريخ
         status: 'draft'|'ready'|'stopped',
         updatedAt: number }        // ترتيب «الأحدث» حتمي في البذرة
   - الإعدادات التجريبية ذات الأثر الفعلي (includeStoppedInReports /
     showHomeComparison) تُحفظ مع البيانات في مفتاح موحد
     micro-f03-mobile-record-v2 (المفتاح v1 السابق يُقرأ ويُهجر بأمان).
   - حفظ محلي حقيقي عند توفره (localStorage)؛ وعند التعذر أو فشل
     القراءة/التحليل: تدهور آمن إلى حفظ داخل الجلسة بلا انهيار.
   - (R2-05) persist() يزامن الوصف مع آخر نتيجة كتابة: نجاح → دوام؛
     فشل متأخر (حصة/حجب) → جلسة فقط، ويُطلق f03:storage-changed
     حتى يحدث الوصف المعروض (التذييل ووضع المراجعة) فورًا؛ نجاح
     لاحق يعيد الوصف الصحيح. البيانات تبقى صالحة داخل الجلسة.
   - upsert/deleteBy يلتزمان نتيجة «saved» المؤكدة من الموصل وحده.
   - لا شبكة ولا حسابات ولا بيانات حقيقية ولا ادعاء دوام أو مزامنة.
   ========================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'micro-f03-mobile-record-v2';
  var LEGACY_KEY = 'micro-f03-mobile-record-v1';

  /* الفئات التركيبية الثلاث — مصدر وحيد يمرر إلى الموصل ويُشتق منه
     منتقي الفئة ولوحة التصفية والتوزيع والرسوم. */
  var CATEGORIES = [
    { value: 'cat-a', label: 'فئة أ' },
    { value: 'cat-b', label: 'فئة ب' },
    { value: 'cat-c', label: 'فئة ج' }
  ];

  /* حالات العنصر التجريبية الثلاث — شارات محايدة بلا قواعد أعمال */
  var STATUSES = [
    { value: 'draft', label: 'قيد الإعداد' },
    { value: 'ready', label: 'جاهز' },
    { value: 'stopped', label: 'متوقف' }
  ];

  /* البذرة التركيبية: 9 عناصر على 3 فئات بقيم حتمية تغطي حالات القبول:
     صفر صريح (it-04)، قيمة مجهولة (it-06)، حالات ثلاث، تواريخ موزعة على
     أربعة أسابيع للخط، صورة رمزية لعنصرين (it-01/it-05) والباقي بديل أحرف.
     updatedAt أعداد صحيحة متمايزة (ترتيب حتمي لـ«أحدث العناصر»). */
  var SEED_ITEMS = [
    { id: 'it-01', name: 'عنصر ألف', category: 'cat-a', note: 'ملاحظة تركيبية للتجربة.', value: 120.5, quantity: 10, date: '2026-10-05', status: 'ready', updatedAt: 9, photo: true },
    { id: 'it-02', name: 'عنصر باء', category: 'cat-b', note: '', value: 85, quantity: 4, date: '2026-10-04', status: 'draft', updatedAt: 8, photo: false },
    { id: 'it-03', name: 'عنصر جيم', category: 'cat-c', note: 'ملاحظة قابلة للتعديل.', value: 42.75, quantity: 7, date: '2026-10-03', status: 'ready', updatedAt: 7, photo: false },
    { id: 'it-04', name: 'عنصر دال', category: 'cat-a', note: '', value: 0, quantity: 0, date: '2026-10-02', status: 'stopped', updatedAt: 6, photo: false },
    { id: 'it-05', name: 'عنصر هاء', category: 'cat-b', note: 'ملاحظة ثانية للتجربة.', value: 230, quantity: 12, date: '2026-10-01', status: 'ready', updatedAt: 5, photo: true },
    { id: 'it-06', name: 'عنصر زاي', category: 'cat-c', note: '', value: null, quantity: 3, date: '2026-09-28', status: 'draft', updatedAt: 4, photo: false },
    { id: 'it-07', name: 'عنصر حاء', category: 'cat-a', note: '', value: 64.2, quantity: 6, date: '2026-09-25', status: 'ready', updatedAt: 3, photo: false },
    { id: 'it-08', name: 'عنصر طاء', category: 'cat-b', note: 'ملاحظة تجريبية قصيرة.', value: 158.9, quantity: 9, date: '2026-09-18', status: 'stopped', updatedAt: 2, photo: false },
    { id: 'it-09', name: 'عنصر ياء', category: 'cat-c', note: '', value: 96, quantity: 5, date: '2026-09-10', status: 'ready', updatedAt: 1, photo: false }
  ];

  var DEFAULT_SETTINGS = { includeStoppedInReports: true, showHomeComparison: true };

  var items = [];
  var settings = {};
  var storage = { available: false, persistent: false, note: '' };

  function seedCopy() {
    return SEED_ITEMS.map(function (it) {
      return {
        id: it.id, name: it.name, category: it.category, note: it.note,
        value: it.value, quantity: it.quantity, date: it.date,
        status: it.status, updatedAt: it.updatedAt, photo: it.photo
      };
    });
  }

  function seedSettings() {
    return {
      includeStoppedInReports: DEFAULT_SETTINGS.includeStoppedInReports,
      showHomeComparison: DEFAULT_SETTINGS.showHomeComparison
    };
  }

  var STORAGE_NOTE_PERSISTENT = 'التخزين المحلي متاح — التعديلات تبقى بعد إغلاق الملف.';
  var STORAGE_NOTE_SESSION = 'البيانات تبقى داخل هذه الجلسة فقط — تعذر حفظها في هذا المتصفح.';

  function setStorageState(persistent) {
    storage.persistent = persistent === true;
    storage.note = storage.persistent ? STORAGE_NOTE_PERSISTENT : STORAGE_NOTE_SESSION;
    /* (R2-05) الوصف تابع لآخر نتيجة كتابة: يُبلَّغ المستمعون (التذييل
       ووضع المراجعة) بكل تغيّر — لا وصف قديم يوهم بدوام لم يتحقق */
    try {
      document.dispatchEvent(new CustomEvent('f03:storage-changed', {
        detail: { available: storage.available, persistent: storage.persistent, note: storage.note }
      }));
    } catch (e) { /* لا شيء */ }
  }

  function detectStorage() {
    try {
      var probe = STORAGE_KEY + ':probe';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      storage.available = true;
      setStorageState(true);
    } catch (e) {
      storage.available = false;
      setStorageState(false);
    }
  }

  function isValidItem(it) {
    if (!it || typeof it !== 'object') return false;
    if (typeof it.id !== 'string' || !it.id) return false;
    if (typeof it.name !== 'string') return false;
    if (typeof it.category !== 'string' && it.category !== null) return false;
    if (typeof it.note !== 'string') return false;
    if (it.value !== null && (typeof it.value !== 'number' || !isFinite(it.value))) return false;
    if (typeof it.quantity !== 'number' || !isFinite(it.quantity) || it.quantity < 0) return false;
    if (it.date !== null && (typeof it.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(it.date))) return false;
    if (['draft', 'ready', 'stopped'].indexOf(it.status) < 0) return false;
    if (typeof it.updatedAt !== 'number' || !isFinite(it.updatedAt)) return false;
    return true;
  }

  function isValidList(list) {
    if (!Array.isArray(list)) return false;
    for (var i = 0; i < list.length; i++) if (!isValidItem(list[i])) return false;
    return true;
  }

  function normalizeSettings(s) {
    var out = seedSettings();
    if (s && typeof s === 'object') {
      if (typeof s.includeStoppedInReports === 'boolean') out.includeStoppedInReports = s.includeStoppedInReports;
      if (typeof s.showHomeComparison === 'boolean') out.showHomeComparison = s.showHomeComparison;
    }
    return out;
  }

  function readPayload(raw) {
    /* يقرأ حمولة v2 {items,settings} أو قائمة v1 التاريخية (تُهجر بأمان
       مع إكمال الحقول الجديدة من قيم محايدة) — الفساد يعيد null */
    var parsed = JSON.parse(raw);
    var list = null, s = null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Array.isArray(parsed.items)) {
      list = parsed.items;
      s = parsed.settings || null;
    } else if (Array.isArray(parsed)) {
      list = parsed;
    }
    if (!isValidList(list)) return null;
    return {
      items: list.map(function (it) {
        return {
          id: it.id, name: it.name, category: it.category, note: it.note,
          value: typeof it.value === 'number' && isFinite(it.value) ? it.value : (it.value === 0 ? 0 : null),
          quantity: typeof it.quantity === 'number' && isFinite(it.quantity) && it.quantity >= 0 ? it.quantity : 0,
          date: typeof it.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(it.date) ? it.date : null,
          status: ['draft', 'ready', 'stopped'].indexOf(it.status) >= 0 ? it.status : 'draft',
          updatedAt: typeof it.updatedAt === 'number' && isFinite(it.updatedAt) ? it.updatedAt : 1,
          photo: it.photo === true
        };
      }),
      settings: normalizeSettings(s)
    };
  }

  function readLegacy() {
    if (!storage.available) return null;
    try {
      var raw = window.localStorage.getItem(LEGACY_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      /* هجرة v1: الحقول القديمة محفوظة، والجديدة قيم محايدة حتمية */
      return {
        items: parsed.filter(function (it) { return it && typeof it.id === 'string'; }).map(function (it, i) {
          return {
            id: it.id, name: String(it.name || ''), category: it.category || null, note: String(it.note || ''),
            value: null, quantity: 0, date: null, status: 'draft',
            updatedAt: typeof it.updatedAt === 'number' && isFinite(it.updatedAt) ? it.updatedAt : (i + 1),
            photo: false
          };
        }),
        settings: seedSettings()
      };
    } catch (e) {
      return null;
    }
  }

  function load() {
    if (!storage.available) return null;
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var payload = readPayload(raw);
        if (payload) return payload;
      }
      var legacy = readLegacy();
      if (legacy && legacy.items.length) return legacy; /* هجرة بلا فقد بيانات قديمة */
      return null; /* أول تشغيل: بذرة نظيفة تُكتب الآن */
    } catch (e) {
      return null; /* تعذر القراءة/التحليل: بذرة بدل الانهيار */
    }
  }

  function persist() {
    if (!storage.available) { setStorageState(false); return false; }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items, settings: settings }));
      setStorageState(true);
      return true;
    } catch (e) {
      /* الكتابة فشلت (حصة ممتلئة أو حجب متأخر): نكمل داخل الجلسة بلا
         ادعاء دوام، والوصف يتحرك فورًا إلى «جلسة فقط» (R2-05) */
      setStorageState(false);
      return false;
    }
  }

  detectStorage();
  var loaded = load();
  items = loaded ? loaded.items : seedCopy();
  settings = loaded ? loaded.settings : seedSettings();
  if (!loaded) persist(); /* كتابة البذرة عند أول تشغيل فقط */

  window.F03Store = {
    STORAGE_KEY: STORAGE_KEY,
    STATUSES: STATUSES.map(function (s) { return { value: s.value, label: s.label }; }),
    statusLabel: function (value) {
      for (var i = 0; i < STATUSES.length; i++) if (STATUSES[i].value === value) return STATUSES[i].label;
      return null;
    },
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
    /* التزام نتيجة مؤكدة: إضافة أو تعديل، بupdatedAt جديد لترتيب «الأحدث».
       idempotent على المعرف نفسه: آخر التزام هو المعروض دائمًا. */
    upsert: function (item) {
      var now = {
        id: item.id, name: item.name, category: item.category, note: item.note,
        value: item.value, quantity: item.quantity, date: item.date,
        status: item.status, updatedAt: item.updatedAt, photo: item.photo === true
      };
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === now.id) { items[i] = now; persist(); return Object.assign({}, now); }
      }
      items.push(now);
      persist();
      return Object.assign({}, now);
    },
    deleteById: function (id) {
      var out = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) { out = Object.assign({}, items[i]); items.splice(i, 1); break; }
      }
      if (out) persist();
      return out;
    },
    settings: function () {
      return {
        includeStoppedInReports: settings.includeStoppedInReports,
        showHomeComparison: settings.showHomeComparison
      };
    },
    updateSettings: function (patch) {
      if (patch && typeof patch === 'object') {
        if (typeof patch.includeStoppedInReports === 'boolean') settings.includeStoppedInReports = patch.includeStoppedInReports;
        if (typeof patch.showHomeComparison === 'boolean') settings.showHomeComparison = patch.showHomeComparison;
        persist();
      }
      return this.settings();
    },
    resetToSeed: function () {
      items = seedCopy();
      settings = seedSettings();
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
