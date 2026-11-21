/* @micro/ui/buttons — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/buttons/buttons.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface ButtonsOptions {}

/** مثيل من init — العقد الموحد (R4). */
export interface ButtonsInstance {
  root: Element | Document;
  /** يغلف setLoading لكل .m-btn تحت الجذر. */
  update(state?: { loading?: boolean; loadingLabel?: string }): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: ButtonsOptions): ButtonsInstance;
export function setLoading(button: Element, flag: boolean, options?: { loadingLabel?: string }): void;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): ButtonsInstance | null;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;
