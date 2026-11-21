/* @micro/ui/fields — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/fields/fields.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

/** نصوص العائلة (components/fields/labels.js) — لا مفاتيح حاليًا. */
export interface FieldsLabels {}

export interface FieldsOptions {
  labels?: Partial<FieldsLabels>;
}

export interface FieldsInstance {
  root: Element | Document;
  /** = sync القديمة: مزامنة العدادات والرسائل من DOM المصدر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: FieldsOptions): FieldsInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): FieldsInstance | null;
export function setLabels(partial: Partial<FieldsLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
export function sync(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — alias لsync؛ استخدم instance.update(). */
export function update(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-field:cleared': Event;
    'micro-field:changed': Event;
  }
}
