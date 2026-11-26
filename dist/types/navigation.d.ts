/* @micro/ui/navigation — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/navigation/navigation.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface NavigationLabels {
  'layer.unnamedWarning': string;
  'layer.unusualRolePrefix': string;
  'layer.unusualRoleSuffix': string;
  'filters.count.one': string;
  'filters.count.two': string;
  'filters.count.fewSuffix': string;
  'filters.count.manySuffix': string;
  'filters.count.hundredSuffix': string;
  'filters.count.hundredOneSuffix': string;
  'filters.count.hundredTwoSuffix': string;
  'filters.summary.emptySuffix': string;
  'filters.summary.separator': string;
  'filters.summary.current': string;
  'filters.summary.applied': string;
}

export interface NavigationOptions {
  labels?: Partial<NavigationLabels>;
}

export interface NavigationInstance {
  root: Element | Document;
  /** يعيد ربط عناصر الطبقات الجديدة تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: NavigationOptions): NavigationInstance;
export function openLayer(layer: Element, options?: { trigger?: Element; backdropEl?: Element }): void;
export function closeLayer(layer: Element): void;
export function requestClose(layer: Element, options?: { reason?: string; trigger?: Element }): boolean;
export function appliedFilters(panel: Element): Record<string, unknown>;
export function setAppliedFilters(panel: Element, values: Record<string, unknown>): void;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): NavigationInstance | null;
export function setLabels(partial: Partial<NavigationLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'micro-navigation:opened': Event;
    'micro-navigation:close-request': CustomEvent<{ reason?: string; trigger: Element | null }>;
    'micro-navigation:closed': Event;
    'micro-navigation:filters-applied': CustomEvent<{ applied: Record<string, unknown>; count: number }>;
  }
}
