/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (navigation) — المرحلة 7 / الجولة الثانية R2.
   الملف: components/navigation/labels.js

   وحدة بيانات نصوص العائلة (الجولة الثانية R5): المفاتيح دلالية بموضعها، والقيم حرفية كما كانت (R-D15) —
   بدون تخصيص تبقى المخرجات متطابقة بايت-ببايت (D12). يسجلها ملف سلوك
   العائلة في سجل النصوص المشترك (shared/labels.js) عند الاستيراد، فلا
   يُحمَّل هذا الملف منفصلًا في الصفحات بعد الآن.

   التخصيص: <FamilyApi>.setLabels(partial) يدمج جزئيًا فوق هذه القيم،
   وsetLocale(locale) من مدخل labels يغيّر تنسيق الأرقام (الافتراضي
   'ar-u-nu-latn' — أرقام لاتينية بلا فواصل كما هو اليوم).
   ========================================================= */
export const defaults = {
  'layer.unnamedWarning': "[micro-navigation] طبقة مفتوحة بلا اسم متاح (عقد D-UI-02): أضف aria-label أو aria-labelledby أو عنصر .m-layer__title — الطبقة modal بلا اسم غير صالحة.",
  'layer.unusualRolePrefix': "[micro-navigation] دور غير معتاد للطبقة \"",
  'layer.unusualRoleSuffix': "\" — عقد الطبقات: dialog/alertdialog (D-UI-02).",
  'filters.count.one': "فلتر واحد",
  'filters.count.two': "فلتران",
  'filters.count.fewSuffix': " فلاتر",
  'filters.count.manySuffix': " فلترًا",
  'filters.count.hundredSuffix': " فلتر",
  'filters.count.hundredOneSuffix': " فلتر واحد",
  'filters.count.hundredTwoSuffix': " فلتران",
  'filters.summary.emptySuffix': ": لا فلاتر",
  'filters.summary.separator': "، ",
  'filters.summary.current': "الجاري",
  'filters.summary.applied': "المطبّق",
};
