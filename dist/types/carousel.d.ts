/* @micro/ui/carousel — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/carousel/carousel.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface CarouselLabels {
  'empty': string;
  'slide.cardRole': string;
  'slide.labelPrefix': string;
  'slide.positionPrefix': string;
  'position.of': string;
  'status.positionPrefix': string;
  'dots.goToPrefix': string;
  'region.role': string;
}

export interface CarouselOptions {
  labels?: Partial<CarouselLabels>;
}

export interface CarouselInstance {
  root: Element | Document;
  /** = goTo: انتقال برمجي يطلق micro-carousel:change حتى برمجيًا. */
  update(options?: { index?: number; animate?: boolean }): void;
  goTo(index: number, options?: { animate?: boolean }): void;
  next(): void;
  prev(): void;
  getIndex(): number;
  destroy(): void;
}

export function init(root?: Element | Document, options?: CarouselOptions): CarouselInstance;
export function goTo(carousel: Element, index: number, options?: { animate?: boolean }): void;
export function next(carousel: Element): void;
export function prev(carousel: Element): void;
export function getIndex(carousel: Element): number;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): CarouselInstance | null;
export function setLabels(partial: Partial<CarouselLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'micro-carousel:change': CustomEvent<{ index: number; count: number }>;
  }
}
