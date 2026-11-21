/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (selection) — المرحلة 7.
   الملف: components/selection/labels.js

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
  window.MicroLabels['selection'] = {
  "k1": "المحدد: ",
    "k2": "المحدد: لا شيء",
    "k3": "إعادة المحاولة",
    "k4": "لم تُحمّل الخيارات بعد.",
    "k5": "جارٍ تحميل الخيارات…",
    "k6": "لا خيارات متاحة.",
    "k7": "تعذّر تحميل الخيارات. أعد المحاولة.",
    "k8": "الاختيار غير متاح حاليًا.",
    "k9": "لا نتائج مطابقة. عدّل كلمة البحث."
};
})();
