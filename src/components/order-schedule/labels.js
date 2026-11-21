/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (order-schedule) — المرحلة 7.
   الملف: components/order-schedule/labels.js

   هذا الملف هو المصدر الوحيد للنصوص العربية الظاهرة للمستخدم داخل
   JS هذه العائلة (سجل window.MicroLabels). يجب تحميله قبل ملف
   سلوك العائلة في كل صفحة (ترتيب <script>). القيم هي الصياغة
   الحرفية السابقة للمرحلة 7 — بدون تخصيص تبقى المخرجات متطابقة
   بايت-ببايت (D12).
   التخصيص: MicroX.setLabels(partial) يدمج جزئيًا فوق هذه القيم،
   وMicroLabels.setLocale(locale) يغيّر تنسيق الأرقام (الافتراضي
   'ar-u-nu-latn' — أرقام لاتينية بلا فواصل كما هو اليوم).
   ========================================================= */
(function () {
  'use strict';
  window.MicroLabels = window.MicroLabels || {};
  if (!window.MicroLabels.locale) window.MicroLabels.locale = 'ar-u-nu-latn';
  if (!window.MicroLabels.setLocale) {
    /* تغيير locale يسري على التصييرات اللاحقة فقط */
    window.MicroLabels.setLocale = function (locale) {
      window.MicroLabels.locale = locale;
    };
  }
  if (!window.MicroLabels.formatNumber) {
    /* العقد: الافتراضي يطابق السلوك الحالي حرفيًا (String(n) بأرقام
       لاتينية بلا فواصل آلاف)؛ Intl يُستخدم فقط عند locale مخصص. */
    window.MicroLabels.formatNumber = function (value) {
      var locale = window.MicroLabels.locale || 'ar-u-nu-latn';
      if (locale === 'ar-u-nu-latn') return String(value);
      try { return new Intl.NumberFormat(locale).format(value); }
      catch (err) { return String(value); }
    };
  }
  window.MicroLabels['order-schedule'] = {
  "ordersCountPlural": {"zero": "لا طلبات", "one": "طلب واحد", "two": "طلبان", "few": "{n} طلبات", "many": "{n} طلبًا", "other": "{n} طلب", "hundredOne": "{n} طلب واحد", "hundredTwo": "{n} طلبان"},
    "k1": "الأحد",
    "k2": "الاثنين",
    "k3": "الثلاثاء",
    "k4": "الأربعاء",
    "k5": "الخميس",
    "k6": "الجمعة",
    "k7": "السبت",
    "k8": "أحد",
    "k9": "إثن",
    "k10": "ثلا",
    "k11": "أرب",
    "k12": "خمي",
    "k13": "جمع",
    "k14": "سبت",
    "k15": "MicroOrderSchedule.init يتطلب عنصر جذر صالحًا (DOM Element)",
    "k16": "طريقة العرض",
    "k17": "يوم",
    "k18": "أسبوع",
    "k19": "شهر",
    "k20": "عرض التقويم",
    "k21": "عرض القائمة",
    "k22": "اليوم",
    "k23": "الشهر السابق",
    "k24": "الأسبوع السابق",
    "k25": "اليوم السابق",
    "k26": "الشهر التالي",
    "k27": "الأسبوع التالي",
    "k28": "اليوم التالي",
    "k29": "اختيار الشهر والسنة",
    "k30": "السنة السابقة",
    "k31": "السنة التالية",
    "k32": "رجوع للتقويم",
    "k33": "أشهر السنة",
    "k34": "، ",
    "k35": "طلبات ",
    "k36": "طلبات الأسبوع ",
    "k37": "إضافة طلب",
    "k38": "إضافة طلب ليوم ",
    "k39": "التاريخ",
    "k40": "غير مجدول",
    "k41": "الوقت",
    "k42": "المورد",
    "k43": "الحالة",
    "k44": "الملاحظة",
    "k45": "تعديل",
    "k46": "حذف",
    "k47": "طلبات اليوم",
    "k48": "لا يوم محدد في ",
    "k49": " في هذا الشهر",
    "k50": "لا توجد طلبات",
    "k51": "لا توجد طلبات بعد.",
    "k52": "الطلبات القادمة",
    "k53": "الطلبات السابقة",
    "k54": "الطلبات غير المجدولة",
    "k55": "جارٍ تحميل الطلبات…",
    "k56": "تعذّر تحميل الطلبات.",
    "k57": "إعادة المحاولة"
};
})();
