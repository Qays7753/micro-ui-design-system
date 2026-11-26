/* @micro/ui/selection — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/selection/selection.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

/** نصوص عائلة selection (components/selection/labels.js) — تخص مدخل picker. */
export interface SelectionLabels {
  'picker.selectedPrefix': string;
  'picker.selectedNone': string;
  'picker.retry': string;
  'picker.status.initial': string;
  'picker.status.loading': string;
  'picker.status.empty': string;
  'picker.status.error': string;
  'picker.status.disabled': string;
  'picker.noResults': string;
}

export interface SelectionOptions {
  labels?: Partial<SelectionLabels>;
}

export interface SelectionInstance {
  root: Element | Document;
  /** يعيد قراءة حالة المجموعات والمقاطع تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: SelectionOptions): SelectionInstance;
export function setSwitchPending(switchWrapper: Element, pending: boolean): void;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): SelectionInstance | null;
export function setLabels(partial: Partial<SelectionLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'micro-selection:changed': Event;
    'micro-selection:segment': CustomEvent<{ value: string }>;
  }
}
