/* @micro/ui/readings — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/compositions/reading-context.js — تركيب C04. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface ReadingsOptions {}

export interface ReadingsInstance {
  root: Element | Document;
  /** = sync القديمة: يعيد ربط قراءات الوحدة بسياقها الصريح. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: ReadingsOptions): ReadingsInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): ReadingsInstance | null;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
export function sync(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — alias لsync؛ استخدم instance.update(). */
export function update(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;
