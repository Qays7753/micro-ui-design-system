/* @micro/ui/action-sheet — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/navigation/action-sheet.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */
import type { NavigationLabels } from './navigation';

export interface ActionSheetOptions {
  labels?: Partial<NavigationLabels>;
}

export interface ActionSheetInstance {
  root: Element | Document;
  /** يعيد ربط أوراق الأفعال الجديدة تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: ActionSheetOptions): ActionSheetInstance;
export function open(sheet: Element, options?: { trigger?: Element; contextKey?: string | null }): boolean;
export function close(sheet: Element): void;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): ActionSheetInstance | null;
export function setLabels(partial: Partial<NavigationLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-actions:request': CustomEvent<{ id: string; contextKey: string | null }>;
  }
}
