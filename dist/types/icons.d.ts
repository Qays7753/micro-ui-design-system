/* @micro/ui/icons — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: shared/icons.js — ترطيب SVG المحلي. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

/** ترطيب كل [data-micro-icon] تحت الجذر (الافتراضي document). */
export function hydrate(root?: Element | Document): Promise<unknown[]>;
/** كسولة في ESM: تبدأ الترطيب عند أول نداء (نسخة IIFE تولّد خاصية ready متعجلة). */
export function ready(): Promise<unknown[]>;
