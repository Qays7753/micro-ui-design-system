/* @micro/ui/messages — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/messages/messages.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface MessagesLabels {
  'note.missingVariantWarning': string;
}

export interface MessagesOptions {
  labels?: Partial<MessagesLabels>;
}

export interface MessagesInstance {
  root: Element | Document;
  /** يعيد فحص الرسائل تحت الجذر (أدوار الإعلان وأزرار الإغلاق). */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: MessagesOptions): MessagesInstance;
export function toast(element: Element, options?: { duration?: number; returnFocus?: Element }): void;
export function closeToast(element: Element, trigger?: Element): void;
export function announce(text: string, options?: { id?: string; assertive?: boolean } | boolean): void;
export function resetAnnouncements(): void;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): MessagesInstance | null;
export function setLabels(partial: Partial<MessagesLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-messages:toast-dismissed': Event;
    'micro-messages:toast-closed': Event;
    'micro-messages:note-closed': CustomEvent<{ returnFocus: boolean }>;
  }
}
