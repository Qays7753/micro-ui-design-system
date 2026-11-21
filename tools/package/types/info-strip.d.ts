/* @micro/ui/info-strip — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/info-strip/info-strip.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface InfoStripLabels {
  'pages.ariaLabel': string;
  'status.positionPrefix': string;
  'status.ofSeparator': string;
  'page.showPrefix': string;
  'status.initialPrefix': string;
  'status.empty': string;
  'peek.status.positionPrefix': string;
  'peek.status.ofSeparator': string;
  'peek.status.empty': string;
  'peek.pages.ariaLabel': string;
  'peek.page.showPrefix': string;
}

export interface InfoStripOptions {
  labels?: Partial<InfoStripLabels>;
}

export interface InfoStripInstance {
  root: Element | Document;
  /** = rescan القديمة: يعيد فحص الشرائح تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: InfoStripOptions): InfoStripInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): InfoStripInstance | null;
export function setLabels(partial: Partial<InfoStripLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
export function rescan(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — alias لrescan؛ استخدم instance.update(). */
export function update(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;
