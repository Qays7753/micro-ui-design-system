/* @micro/ui/info-strip-peek — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/info-strip/info-strip-peek.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */
import type { InfoStripLabels } from './info-strip';

export interface InfoStripPeekOptions {
  labels?: Partial<InfoStripLabels>;
}

export interface InfoStripPeekInstance {
  root: Element | Document;
  /** = goTo: انتقال برمجي يطلق micro-info-peek:change. */
  update(options?: { index?: number; animate?: boolean }): void;
  goTo(index: number, options?: { animate?: boolean }): void;
  next(): void;
  prev(): void;
  getIndex(): number;
  destroy(): void;
}

export function init(root?: Element | Document, options?: InfoStripPeekOptions): InfoStripPeekInstance;
export function goTo(strip: Element, index: number, options?: { animate?: boolean }): void;
export function next(strip: Element): void;
export function prev(strip: Element): void;
export function getIndex(strip: Element): number;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): InfoStripPeekInstance | null;
export function setLabels(partial: Partial<InfoStripLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — alias لgoTo؛ استخدم instance.update({index}). */
export function update(strip: Element, index: number, options?: { animate?: boolean }): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-info-peek:change': CustomEvent<{ index: number; count: number }>;
  }
}
