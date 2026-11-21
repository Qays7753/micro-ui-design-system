/* @micro/ui/packed-circle — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/data/packed-circle.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */
import type { DataLabels } from './data';

export interface PackedCircleOptions {
  labels?: Partial<DataLabels>;
}

export interface PackedCircleInstance {
  root: Element | Document;
  /** يعيد تصيير كل رسوم الدوائر تحت الجذر من DOM المصدر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: PackedCircleOptions): PackedCircleInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): PackedCircleInstance | null;
export function setLabels(partial: Partial<DataLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — لتصيير كل الرسوم تحت جذر استخدم instance.update(). */
export function render(chart?: Element): void;
/** @deprecated منذ 0.2.0 (R-D10) — alias لrender؛ استخدم instance.update(). */
export function update(root?: Element | Document): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-packed:rendered': CustomEvent<{ ok: boolean; reason?: string; vmaxDerived?: number | null; [key: string]: unknown }>;
  }
}
