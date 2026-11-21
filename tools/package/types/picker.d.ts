/* @micro/ui/picker — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/selection/picker.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */
import type { SelectionLabels } from './selection';

export interface PickerItem {
  value: string;
  label: string;
}

export interface PickerOptions {
  labels?: Partial<SelectionLabels>;
}

export interface PickerInstance {
  root: Element | Document;
  /** = setOptions لكل picker تحت الجذر. */
  update(items?: PickerItem[]): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: PickerOptions): PickerInstance;
export function setOptions(picker: Element, items: PickerItem[]): void;
export function setStatus(picker: Element, kind: 'ready' | 'loading' | 'empty' | 'error' | 'initial' | 'disabled', message?: string): void;
export function clearSelection(picker: Element): void;
export function getSelected(picker: Element): PickerItem | null;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): PickerInstance | null;
export function setLabels(partial: Partial<SelectionLabels>): void;
/** @deprecated منذ 0.2.0 (R-D10) — alias لsetOptions لكل picker تحت الجذر؛ استخدم instance.update(items). */
export function update(root: Element | Document, items: PickerItem[]): void;
/** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root?: Element | Document): void;

declare global {
  interface HTMLElementEventMap {
    'micro-picker:change': CustomEvent<{ value: string | null; label: string | null }>;
    'micro-picker:retry': Event;
    'micro-picker:close': Event;
  }
}
