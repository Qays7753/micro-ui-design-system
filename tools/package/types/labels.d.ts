/* @micro/ui/labels — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: shared/labels.js — سجل النصوص المشترك. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

/** صيغ الجمع العربية (الفئات القياسية + قاعدة العدد المركب 100+). */
export interface MicroPluralForms {
  zero: string;
  one: string;
  two: string;
  few: string;
  many: string;
  other: string;
  [form: string]: string;
}

/** متغيرات الاستبدال داخل نص المفتاح بصيغة {name}. */
export interface MicroLabelVars {
  [name: string]: string | number;
}

export function registerLabels(family: string, defaults: Record<string, unknown>): void;
export function getLabel(family: string, key: string, vars?: MicroLabelVars): string;
export function familyLabels(family: string): Record<string, unknown> | undefined;
/** دمج جزئي بمستوى واحد؛ كائنات صيغ الجمع تُدمج بمفتاحها الداخلي. */
export function setLabels(family: string, partial: Record<string, unknown>): void;
/** يسري على التصييرات اللاحقة فقط. الافتراضي 'ar-u-nu-latn'. */
export function setLocale(locale: string): void;
export function getLocale(): string;
export function formatNumber(value: number): string;
export function pluralCategory(n: number): string;
export function plural(n: number, forms: MicroPluralForms | Record<string, string>): string;
