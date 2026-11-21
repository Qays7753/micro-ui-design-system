/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (metric-comparison) — المرحلة 7 / الجولة الثانية R2.
   الملف: components/metric-comparison/labels.js

   وحدة بيانات نصوص العائلة (الجولة الثانية R5): المفاتيح دلالية بموضعها، والقيم حرفية كما كانت (R-D15) —
   بدون تخصيص تبقى المخرجات متطابقة بايت-ببايت (D12). يسجلها ملف سلوك
   العائلة في سجل النصوص المشترك (shared/labels.js) عند الاستيراد، فلا
   يُحمَّل هذا الملف منفصلًا في الصفحات بعد الآن.

   التخصيص: <FamilyApi>.setLabels(partial) يدمج جزئيًا فوق هذه القيم،
   وsetLocale(locale) من مدخل labels يغيّر تنسيق الأرقام (الافتراضي
   'ar-u-nu-latn' — أرقام لاتينية بلا فواصل كما هو اليوم).
   ========================================================= */
export const defaults = {
  'circles.discloseAriaLabel': "القراءات الدقيقة لكل القيم",
  'circles.renderError': "تعذّر رسم الدوائر بهذا الإعداد. القيم معروضة في القائمة.",
  'circles.unknownLayoutDetail': "' غير معروف (المعروف: separated/overlap) — رُفض الرسم؛ القراءات كاملة في القائمة البديلة.",
  'circles.scaleError': "تعذّر رسم الدوائر بهذا النطاق. القيم معروضة في القائمة.",
  'circles.scaleInvalidDetailPrefix': "' غير موجب أو أصغر من أكبر مقدار معلوم (",
  'circles.scaleInvalidDetailSuffix': ") — مقياس غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة.",
  'circles.radiusInvalidDetail': "' غير موجب — حد حجم دائرة غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة.",
  'circles.deferredMessage': "لا تتوفر مساحة عرض بعد؛ ستظهر الدوائر عند إتاحة البطاقة.",
  'circles.deferredDetail': "metric-circles: عرض اللوحة 0 — الرسم مؤجل حتى إتاحة المساحة (يعاد الرسم عند الإظهار).",
  'circles.zeroMessage': "القيم المعروفة صفرية؛ العلامة المجوفة تعني صفرًا، وليست مساحة عددية.",
  'circles.emptyMessage': "لا توجد قراءات متاحة للمقارنة بعد.",
  'circles.zeroDetail': "metric-circles: كل القيم المعلومة صفر — علامات صفر مجوفة بلا مساحات مقارنة.",
  'circles.noValuesDetail': "metric-circles: لا قيم معلومة — لا رسم.",
  'circles.scaledMessageBase': "المساحة تقارن مقدار القيمة؛ الإشارة مكتوبة في القراءة.",
  'circles.zeroMarkNote': " العلامة المجوفة تعني صفرًا، وليست مساحة عددية.",
  'circles.scaleNotePrefix': " النطاق يصل إلى ",
  'circles.overlapNote': " التداخل بصري فقط ولا يدل على تقاطع أو علاقة بين القيم.",
  'circles.fitNote': " — الحجم يتكيف مع عرض البطاقة ضمن نصف القطر؛ scale=",
  'value.invalid': "قيمة غير صالحة",
  'value.missing': "غير متاح",
  'value.unreadable': "تعذّر قراءة القيمة",
  'chart.empty': "لا توجد بيانات للمقارنة.",
  'table.showButton': "عرض البيانات كجدول",
  'table.hideButton': "إخفاء جدول البيانات",
  'table.unitPrefix': "الوحدة: ",
  'table.periodPrefix': "الفترة: ",
  'table.separator': "، ",
  'table.head.category': "الفئة",
  'table.head.value': "القيمة",
  'table.head.unit': "الوحدة",
  'table.head.period': "الفترة",
  'table.mainMetricFallback': "القيمة الرئيسية",
  'table.missingValue': "— (غير متاح)",
  'table.invalidValue': "(قيمة غير صالحة)",
  'table.zeroValue': "(صفر)",
  'table.negativeValue': "(سالب)",
  'table.head.state': "الحالة",
  'bars.stateZero': "صفر",
  'bars.stateNegative': "سالب — معروض بالقيمة والإشارة لا بالمساحة",
  'bars.emptyDetail': "metric-bars: مصدر فارغ — لا صفوف.",
  'bars.unitMismatchError': "تعذّر عرض المقارنة: وحدة أو فترة غير متوافقة بين القيم. القراءات معروضة كاملة.",
  'bars.unitMismatchDetail': "metric-bars: تباين data-unit/data-period في بعض الصفوف مع data-common-unit/data-common-period — لا مقياس مشترك؛ رُفض رسم الأشرطة والقراءات كاملة.",
  'bars.scaleError': "تعذّر عرض المقارنة بهذا النطاق. القراءات معروضة كاملة.",
  'bars.scaleInvalidDetail': "' غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض رسم الأشرطة والقراءات كاملة.",
  'bars.unfairScaleError': "تعذّر عرض مقارنة عادلة بهذا النطاق. القراءات معروضة كاملة.",
  'bars.underscaleDetailPrefix': " أصغر من أكبر مقدار معلوم (",
  'bars.underscaleDetailSuffix': ") — رسم نسبي كان سيخفي الفرق؛ رُفض رسم الأشرطة والقراءات كاملة.",
  'bars.scaledMessagePrefix': "الأشرطة حتى ",
  'bars.scaledDetailUnit': "؛ common-unit=",
  'bars.scaledDetailPeriod': "؛ common-period=",
  'bars.zeroMessage': "القيم المعروفة صفرية؛ علامة الصفر ظاهرة دون طول مصطنع.",
  'bars.zeroDetail': "metric-bars: كل القيم المعلومة صفر — علامات صفر بلا أطوال.",
  'bars.emptyMessage': "لا توجد قراءات متاحة لبناء مقياس بعد.",
  'bars.noValuesDetail': "metric-bars: لا قيم معلومة — لا مقياس.",
  'bars.zeroLineNote': " خط الوسط صفر؛ الموجب يمينه والسالب يساره.",
  'main.missing': "(غير متاح)",
  'main.invalidSuffix': " (قيمة غير صالحة)",
};
