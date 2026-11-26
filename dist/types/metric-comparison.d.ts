/* @micro/ui/metric-comparison — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/metric-comparison/metric-comparison.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface MetricComparisonLabels {
  'circles.discloseAriaLabel': string;
  'circles.renderError': string;
  'circles.unknownLayoutDetail': string;
  'circles.scaleError': string;
  'circles.scaleInvalidDetailPrefix': string;
  'circles.scaleInvalidDetailSuffix': string;
  'circles.radiusInvalidDetail': string;
  'circles.deferredMessage': string;
  'circles.deferredDetail': string;
  'circles.zeroMessage': string;
  'circles.emptyMessage': string;
  'circles.zeroDetail': string;
  'circles.noValuesDetail': string;
  'circles.scaledMessageBase': string;
  'circles.zeroMarkNote': string;
  'circles.scaleNotePrefix': string;
  'circles.overlapNote': string;
  'circles.fitNote': string;
  'value.invalid': string;
  'value.missing': string;
  'value.unreadable': string;
  'chart.empty': string;
  'table.showButton': string;
  'table.hideButton': string;
  'table.unitPrefix': string;
  'table.periodPrefix': string;
  'table.separator': string;
  'table.head.category': string;
  'table.head.value': string;
  'table.head.unit': string;
  'table.head.period': string;
  'table.mainMetricFallback': string;
  'table.missingValue': string;
  'table.invalidValue': string;
  'table.zeroValue': string;
  'table.negativeValue': string;
  'table.head.state': string;
  'bars.stateZero': string;
  'bars.stateNegative': string;
  'bars.emptyDetail': string;
  'bars.unitMismatchError': string;
  'bars.unitMismatchDetail': string;
  'bars.scaleError': string;
  'bars.scaleInvalidDetail': string;
  'bars.unfairScaleError': string;
  'bars.underscaleDetailPrefix': string;
  'bars.underscaleDetailSuffix': string;
  'bars.scaledMessagePrefix': string;
  'bars.scaledDetailUnit': string;
  'bars.scaledDetailPeriod': string;
  'bars.zeroMessage': string;
  'bars.zeroDetail': string;
  'bars.emptyMessage': string;
  'bars.noValuesDetail': string;
  'bars.zeroLineNote': string;
  'main.missing': string;
  'main.invalidSuffix': string;
}

export interface MetricComparisonOptions {
  labels?: Partial<MetricComparisonLabels>;
}

export interface MetricComparisonInstance {
  root: Element | Document;
  /** يعيد التصيير من DOM المصدر لكل المقارنات تحت الجذر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: MetricComparisonOptions): MetricComparisonInstance;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): MetricComparisonInstance | null;
export function setLabels(partial: Partial<MetricComparisonLabels>): void;
