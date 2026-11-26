/* @micro/ui/organization — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/organization/organization.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface OrganizationLabels {
  'avatar.initialsFallback': string;
}

export interface OrganizationOptions {
  labels?: Partial<OrganizationLabels>;
}

export interface OrganizationInstance {
  root: Element | Document;
  /** يعيد فحص الأقسام والصور الرمزية تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: OrganizationOptions): OrganizationInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): OrganizationInstance | null;
export function setLabels(partial: Partial<OrganizationLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'micro-organization:toggle': CustomEvent<{ open: boolean }>;
  }
}
