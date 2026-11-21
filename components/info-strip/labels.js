/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (info-strip) — المرحلة 7 / الجولة الثانية R2.
   الملف: components/info-strip/labels.js

   وحدة بيانات نصوص العائلة (الجولة الثانية R5): المفاتيح دلالية بموضعها، والقيم حرفية كما كانت (R-D15) —
   بدون تخصيص تبقى المخرجات متطابقة بايت-ببايت (D12). يسجلها ملف سلوك
   العائلة في سجل النصوص المشترك (shared/labels.js) عند الاستيراد، فلا
   يُحمَّل هذا الملف منفصلًا في الصفحات بعد الآن.

   التخصيص: <FamilyApi>.setLabels(partial) يدمج جزئيًا فوق هذه القيم،
   وsetLocale(locale) من مدخل labels يغيّر تنسيق الأرقام (الافتراضي
   'ar-u-nu-latn' — أرقام لاتينية بلا فواصل كما هو اليوم).
   ========================================================= */
export const defaults = {
  'pages.ariaLabel': "اختيار البطاقة",
  'status.positionPrefix': "البطاقة ",
  'status.ofSeparator': " من ",
  'page.showPrefix': "عرض البطاقة ",
  'status.initialPrefix': "البطاقة 1 من ",
  'status.empty': "لا توجد بطاقات.",
  'peek.status.positionPrefix': "البطاقة ",
  'peek.status.ofSeparator': " من ",
  'peek.status.empty': "لا توجد بطاقات.",
  'peek.pages.ariaLabel': "اختيار البطاقة",
  'peek.page.showPrefix': "عرض البطاقة ",
};
