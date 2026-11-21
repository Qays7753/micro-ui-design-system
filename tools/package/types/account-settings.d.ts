/* @micro/ui/account-settings — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/account-settings/account-settings.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface AccountSettingsLabels {
  'demo.changeNotice': string;
}

export interface AccountSettingsOptions {
  labels?: Partial<AccountSettingsLabels>;
}

export interface AccountSettingsInstance {
  root: Element | Document;
  /** يعيد فحص اللوحات تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: AccountSettingsOptions): AccountSettingsInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): AccountSettingsInstance | null;
export function setLabels(partial: Partial<AccountSettingsLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-account-settings:change': CustomEvent<{ setting: string; checked: boolean }>;
  }
}
