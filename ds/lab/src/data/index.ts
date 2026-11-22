/**
 * Lab data — BRIEF section 25, verbatim. Every lab page renders from this
 * module only (BRIEF 25: no "Ahmad Mohammad", no "$1,234.56", no Lorem).
 *
 * Amounts are raw digit strings (Western digits, '.' decimal, optional '-');
 * display formatting (grouping, fils, unit) is lib/format-money's job.
 */

/** Projects (BRIEF 25: المشاريع). */
export const projects: readonly string[] = [
  'ورشة الياسمين للخياطة',
  'حلويات بيت الريف',
  'مطبخ أم خالد',
  'صالون لمسة',
];

/** Customers and parties (BRIEF 25: عملاء وأطراف). */
export const parties: readonly string[] = [
  'سلمى الحوراني',
  'أبو محمد (بقالة النور)',
  'رنا العبادي',
  'خالد الزعبي',
];

/** Suppliers (BRIEF 25: موردون). */
export const suppliers: readonly string[] = [
  'مؤسسة الخطيب للأقمشة',
  'مخبز الأصيل للجملة',
];

/** Drivers (BRIEF 25: سائقون). */
export const drivers: readonly string[] = ['عمر الزعبي', 'يزن القضاة'];

/** Areas (BRIEF 25: مناطق). */
export const areas: readonly string[] = [
  'طبربور',
  'مرج الحمام',
  'الزرقاء، حي معصوم',
  'إربد، شارع الجامعة',
];

/** Movement amounts (BRIEF 25: مبالغ). */
export const amounts: readonly string[] = [
  '2.250',
  '12.500',
  '45',
  '145.750',
  '1280',
  '12450.125',
  '0',
  '-35',
];

/** Order numbers (BRIEF 25: أرقام طلبات — «طلب 1175», never «#1175»). */
export const orders: readonly number[] = [1175, 1203];

/** Mandatory press states for every textual component (BRIEF 25). */
export const edgeCases = {
  /** أطول اسم */
  longestName: 'مؤسسة عبد الرحمن الخطيب للتجارة العامة والتوريدات',
  /** أطول مبلغ — renders as «1,250,000.125 د.أ» */
  longestAmount: '1250000.125',
  /** قيمة مفقودة — renders as «—», never as zero */
  missingAmount: null as string | null,
  /** قيمة قيد تحميل — renders as a skeleton, never as zero */
  loadingAmount: undefined as string | undefined,
} as const;
