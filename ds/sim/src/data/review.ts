/**
 * جولة المستخدم — the reviewer's SIM-DATA proposals. The verification
 * items' texts and the ready rejection reasons were an OPEN question in m1
 * (سؤال 11: «بنود التحقق… ما القائمة؟») — the sim proposes these so the
 * journey ر6.1 is trialable; the owner's real list replaces them
 * (REPORT-SIM «يحتاج قرار المالك»).
 */

/** DecisionCard's «قبل الاعتماد» — SEVEN items per §6.2. */
export const VERIFY_ITEMS: readonly string[] = [
  'الصور تُظهر المنتج واضحة',
  'السعر بالدينار وواضح لكل عبوة',
  'الوصف يطابق الصور',
  'الكمية والتوافر منطقيان',
  'الحد الأدنى للطلب معقول',
  'التصنيف والمحافظة صحيحان',
  'لا معلومة تواصل خارج المنصة',
];

/** The ready rejection reasons (the ع5 rejection used the first one). */
export const REJECT_REASONS: readonly string[] = [
  'الصور غير واضحة',
  'الوصف لا يطابق الصور',
  'معلومات ناقصة',
  'سعر غير واضح',
];
