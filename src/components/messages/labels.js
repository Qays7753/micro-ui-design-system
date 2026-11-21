/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (messages) — المرحلة 7.
   الملف: components/messages/labels.js

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
  window.MicroLabels['messages'] = {
  "k1": "[micro-messages] m-note بلا variant ولا role — لا يمكن اختيار دور إعلاني آمن (D-UI-02/SUI-010): أضف نوعًا (m-note--info/success/warning/error/help) أو role صريحًا."
};
})();
