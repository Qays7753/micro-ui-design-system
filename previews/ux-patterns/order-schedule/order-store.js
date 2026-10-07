/* =========================================================
   Micro UI — موصل بيانات جدول الطلبات التجريبي (منفصل عن F03Store)
   الملف: previews/ux-patterns/order-schedule/order-store.js
   الاسم العالمي: window.OrderDemoStore — DRAFT FOR REVIEW.

   الدور (docs/ux/ORDER-SCHEDULE-BRIEF.md «تركيب تجربة يمكن
   استخدامها على الهاتف» + بطاقة ORDER-SCHEDULE-ACCEPTANCE):
   - مصدر طلبات تجريبي **مستقل تمامًا عن F03Store** (عناصر العينة):
     لا تحويل «العناصر» إلى طلبات ولا نسخ قواعدها — بذرة طلبات
     خاصة بهذه التجربة فقط، تستهلكها نسختا F03 والعينة المستقلة
     معًا (نفس الملف الفعلي في F03 عبر <script>).
   - الحفظ داخل الذاكرة (جلسة الصفحة) فقط — **بلا localStorage**:
     إعادة تحميل الصفحة تعيد البذرة. هذا اختيار صادق موثق: العينة
     تجربة قراءة/مراجعة، والانعكاس الفوري على الجدول يكفي الغرض
     (بلا reload أصلًا أثناء الجلسة).
   - TODAY مثبت '2026-10-07' عمدًا: حتمية الفحص (نفس الأيام
     دائمًا: أمس/اليوم/غدًا/أسبوعان/…) بمعزل عن تاريخ تشغيل
     الآلة — اليوم الافتراضي في المكوّن يبقى محليًا حقيقيًا،
     والموصل هو من يثبته لاختبارات العينة.
   - لا شبكة ولا مصادقة ولا أي حقل مالي (لا مبلغ/رصيد/إيراد) —
     عقد الجدولة فقط: {id, title, date|null, time|null,
     statusKey, customer|null}.
   ========================================================= */

(function () {
  'use strict';

  /* اليوم المثبت — حتمية الفحص (موثق أعلاه)؛ ليس «اليوم» الحقيقي */
  var TODAY = '2026-10-07';

  /* خريطة الحالات — **fixtures عينة فقط، ليست آلة حالات منتج**:
     المفاتيح الثلاثة ونبراتها أزواج توكنات معتمدة تمرر للمكوّن
     كما هي (النبرة قرار عرض لا قاعدة عمل). المفتاح غير المعروف
     يظهر محايدًا بنصه الخام من جهة المكوّن (عقد المواصفة). */
  var STATUSES = {
    progress: { label: 'قيد التنفيذ', tone: 'progress' },
    done: { label: 'تم التسليم', tone: 'success' },
    hold: { label: 'بانتظار العميل', tone: 'warning' }
  };

  /* البذرة التركيبية الغنية حول 2026-10-07 (كل الحالات المثبتة):
   * أمس (10-06) طلبان (واحد بعميل وواحد بوقت)؛
   * اليوم (10-07) ثلاثة مختلطة: واحد بعميل وواحد بوقت وواحد بهما؛
   * غدًا (10-08) ثلاثة — منها العنوان الطويل جدًا (يلتف ولا يكسر)؛
   * يوم بطلب واحد (10-09)؛
   * يوم 5 طلبات بثلاث حالات (10-22: progress/done/hold)؛
   * بعد أسبوعين (10-20)؛
   * ماضٍ أبعد: حالتان done (لا تسمّيا «متأخرة» — الحالة من
     البيانات فقط ولا استنتاج من التاريخ)؛
   * طلبان غير مجدولين (date null) في قسمهما؛
   * od-10 بمفتاح حالة غير معروف 'mystery' (محايد بنصه الخام)؛
   * od-inj عنوانه فيه <b> و<img onerror> — اختبار الحقن:
     يظهر نصًا حرفيًا (المكوّن لا يمرر HTML من البيانات أبدًا).
   updatedAt عدّاد داخلي للترتيب/الفحص — ليس جزءًا من عقد
   الطلب لدى المكوّن (يُهمل هناك) ويُعاد ضبطه عند كل كتابة. */
  var SEED_ORDERS = [
    /* اليوم — 3 مختلطة */
    { id: 'od-01', title: 'طلب القهوة العربية', date: '2026-10-07', time: '14:30', statusKey: 'progress', customer: 'مطزاوية الفيصل' },
    { id: 'od-02', title: 'طلب تجهيز مكتب الاستقبال', date: '2026-10-07', time: null, statusKey: 'done', customer: 'شركة الواحة' },
    { id: 'od-03', title: 'طلب مستلزمات الضيافة', date: '2026-10-07', time: '18:45', statusKey: 'progress', customer: null },
    /* غدًا — 3 (منها العنوان الطويل جدًا) */
    { id: 'od-04', title: 'طلب ضيافة استقبال شركة الوفادة المرافقة لوفد المنطقة الغربية مع تجهيز القاعة الرئيسية والمستلزمات الكاملة للفعالية المقامة يوم الخميس القادم بتجهيزات صباحية إضافية', date: '2026-10-08', time: '11:15', statusKey: 'progress', customer: 'قاعة الملتقى' },
    { id: 'od-05', title: 'طلب تعقيم غرف الاجتماعات', date: '2026-10-08', time: '16:00', statusKey: 'done', customer: null },
    { id: 'od-06', title: 'طلب صيانة أجهزة العرض', date: '2026-10-08', time: null, statusKey: 'hold', customer: null },
    /* يوم بطلب واحد */
    { id: 'od-07', title: 'طلب قرطاسية إدارية', date: '2026-10-09', time: '10:30', statusKey: 'done', customer: 'الإدارة العامة' },
    /* مفتاح حالة غير معروف → محايد بنص المفتاح الخام */
    { id: 'od-10', title: 'طلب تجهيز معرض المنتجات', date: '2026-10-15', time: '12:00', statusKey: 'mystery', customer: 'وحدة التسويق' },
    /* الأسبوع القادم */
    { id: 'od-08', title: 'طلب فطور اجتماع القسم', date: '2026-10-12', time: '08:00', statusKey: 'progress', customer: 'قسم التطوير' },
    { id: 'od-09', title: 'طلب ماء وضيافة مسائية', date: '2026-10-12', time: '13:00', statusKey: 'done', customer: null },
    /* بعد أسبوعين */
    { id: 'od-11', title: 'طلب صيانة دورية للمصاعد', date: '2026-10-20', time: '17:30', statusKey: 'hold', customer: null },
    /* يوم 5 طلبات بثلاث حالات */
    { id: 'od-22a', title: 'طلب ضيافة صباحية', date: '2026-10-22', time: '09:00', statusKey: 'progress', customer: 'البرج الشمالي' },
    { id: 'od-22b', title: 'طلب تعقيم دوري', date: '2026-10-22', time: '10:30', statusKey: 'done', customer: null },
    { id: 'od-22c', title: 'طلب مستلزمات ورش العمل', date: '2026-10-22', time: '12:15', statusKey: 'progress', customer: null },
    { id: 'od-22d', title: 'طلب صيانة تكييف', date: '2026-10-22', time: '14:00', statusKey: 'hold', customer: 'الإدارة المالية' },
    { id: 'od-22e', title: 'طلب تجهيز قاعة التدريب', date: '2026-10-22', time: '15:45', statusKey: 'progress', customer: null },
    /* بعده */
    { id: 'od-12', title: 'طلب أرشفة مستندات نهاية الشهر', date: '2026-10-25', time: null, statusKey: 'progress', customer: null },
    /* أمس — طلبان */
    { id: 'od-p1', title: 'طلب نقل عفش مكتبي', date: '2026-10-06', time: '15:00', statusKey: 'done', customer: 'فرع الشمال' },
    { id: 'od-p2', title: 'طلب صيانة سباكة', date: '2026-10-06', time: '10:00', statusKey: 'progress', customer: null },
    /* ماضٍ أبعد — حالتان done (لا تسمّيان «متأخرة») */
    { id: 'od-p3', title: 'طلب تركيب لوحات إرشادية', date: '2026-10-01', time: '09:30', statusKey: 'done', customer: 'الإدارة العامة' },
    { id: 'od-p4', title: 'طلب تغيير إضاءة الممرات', date: '2026-09-28', time: null, statusKey: 'done', customer: null },
    /* غير مجدولة — طلبان */
    { id: 'od-u1', title: 'طلب عناية حدائق', date: null, time: null, statusKey: 'progress', customer: 'الحديقة الغربية' },
    { id: 'od-u2', title: 'طلب إطارات كراسي مكتبية', date: null, time: null, statusKey: 'done', customer: null },
    /* حقن HTML: العنوان يظهر نصًا حرفيًا */
    { id: 'od-inj', title: 'طلب <b>عنوان</b> <img onerror="window.__xss=1"> تجريبي', date: '2026-10-11', time: '13:00', statusKey: 'progress', customer: null }
  ];

  var orders = [];
  var updateClock = 0; /* عدّاد updatedAt متزايد — حتمي بلا ساعة حائط */

  function copy(o) {
    return {
      id: o.id, title: o.title, date: o.date, time: o.time,
      statusKey: o.statusKey, customer: o.customer, updatedAt: o.updatedAt
    };
  }

  function seedCopy() {
    return SEED_ORDERS.map(function (o) {
      var c = copy(o);
      updateClock += 1;
      c.updatedAt = updateClock;
      return c;
    });
  }

  function notifyChange(id, isNew) {
    try {
      document.dispatchEvent(new CustomEvent('order-store:changed', {
        bubbles: true,
        detail: { id: id, isNew: isNew === true }
      }));
    } catch (e) { /* لا شيء — الإخبار تحسين لا شرط */ }
  }

  orders = seedCopy();

  window.OrderDemoStore = {
    /* نسخة قراءة فقط — التعديل عبر upsert حصرًا؛ ترتيب الإدخال
       (updatedAt) حتمي = ترتيب البذرة نفسه */
    all: function () {
      return orders.slice().sort(function (a, b) {
        return a.updatedAt - b.updatedAt;
      }).map(copy);
    },
    get: function (id) {
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === id) return copy(orders[i]);
      }
      return null;
    },
    /* خريطة الحالات (نسخة) — fixtures عينة لا آلة حالات منتج */
    statuses: function () {
      var out = {};
      Object.keys(STATUSES).forEach(function (k) {
        out[k] = { label: STATUSES[k].label, tone: STATUSES[k].tone };
      });
      return out;
    },
    today: function () {
      return TODAY; /* مثبت لحتمية الفحص — موثق في رأس الملف */
    },
    count: function () {
      return orders.length;
    },
    nextId: function () {
      var max = 0;
      orders.forEach(function (o) {
        var m = /^od-(\d+)$/.exec(o.id);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      });
      return 'od-' + String(max + 1).padStart(2, '0');
    },
    /* إضافة أو تعديل — idempotent بالمعرف: نفس المعرف يستبدل طلبه
       القائم (لا نسخة ثانية) بupdatedAt جديد دائمًا. القيم تُطبع
       نصًا خامًا (نفس عقد المكوّن: تاريخ غير صالح → غير مجدول،
       وقت غير صالح → غائب) بلا أي تمرير HTML. يُطلق حدث DOM
       'order-store:changed' (bubbles) على المستند ليستمع
       المستهلكون ويعيدوا التصيير من المصدر الواحد. */
    upsert: function (order) {
      if (!order || typeof order !== 'object' || !order.id) return null;
      var now = {
        id: String(order.id),
        title: order.title == null ? '' : String(order.title),
        date: (typeof order.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(order.date)) ? order.date : null,
        time: (typeof order.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(order.time)) ? order.time : null,
        statusKey: order.statusKey == null ? '' : String(order.statusKey),
        customer: (order.customer == null || String(order.customer) === '') ? null : String(order.customer)
      };
      var isNew = true;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === now.id) {
          updateClock += 1;
          now.updatedAt = updateClock;
          orders[i] = now;
          isNew = false;
          break;
        }
      }
      if (isNew) {
        updateClock += 1;
        now.updatedAt = updateClock;
        orders.push(now);
      }
      notifyChange(now.id, isNew);
      return copy(now);
    }
  };
})();
