/* @micro/ui/data — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/data/data.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */

export interface DataLabels {
  'value.invalid': string;
  'value.unavailable': string;
  'value.negativeUnplottedSuffix': string;
  'common.listSeparator': string;
  'context.unit': string;
  'context.period': string;
  'table.ariaLabel': string;
  'value.outlierSuffix': string;
  'bars.rangeError': string;
  'bars.scaleInvalidDetail': string;
  'bars.overscaleDetailPrefix': string;
  'bars.overscaleDetailMax': string;
  'bars.overscaleDetailSuffix': string;
  'bars.ariaLabel': string;
  'bars.rescaledAriaSuffix': string;
  'bars.rescaledAriaInsteadOf': string;
  'bars.invalidMark': string;
  'bars.negativeUnplottedMark': string;
  'bars.outlierMark': string;
  'bars.rescaledNotePrefix': string;
  'bars.rescaledNoteInsteadOf': string;
  'bars.rescaledNoteSuffix': string;
  'bars.rescaleDetailPrefix': string;
  'bars.rescaleDetailTo': string;
  'bars.rescaleDetailSuffix': string;
  'chart.empty': string;
  'signed.rangeError': string;
  'signed.ariaLabel': string;
  'signed.ariaSuffix': string;
  'axis.missingSetupError': string;
  'axis.autoExtendedNote': string;
  'axis.timeMissingWithReadings': string;
  'axis.timeMissing': string;
  'axis.unsupportedWithReadings': string;
  'axis.unsupported': string;
  'line.overscaleDetailPrefix': string;
  'line.overscaleDetailSuffix': string;
  'line.ariaLabel': string;
  'line.rescaleDetailPrefix': string;
  'line.readingsAriaLabel': string;
  'donut.rangeError': string;
  'donut.ariaLabel': string;
  'donut.totalInvalidDetail': string;
  'donut.negativeValuesDetail': string;
  'donut.oversumDetailPrefix': string;
  'donut.oversumDetailMax': string;
  'donut.oversumDetailSuffix': string;
  'donut.negativeTotalDetail': string;
  'donut.zeroTotalDetailPrefix': string;
  'donut.zeroTotalDetailSuffix': string;
  'donut.totalUnknown': string;
  'donut.totalLabel': string;
  'donut.knownSumLabel': string;
  'donut.invalidValueSuffix': string;
  'donut.invalidShareSuffix': string;
  'donut.invalidReading': string;
  'table.showButton': string;
  'table.hideButton': string;
  'table.unitPrefix': string;
  'table.periodPrefix': string;
  'table.head.category': string;
  'table.head.time': string;
  'table.head.value': string;
  'bubbles.rangeError': string;
  'bubbles.scaleInvalidDetail': string;
  'bubbles.overscaleDetailPrefix': string;
  'bubbles.overscaleDetailSuffix': string;
  'bubbles.negativeAreaSuffix': string;
  'bubbles.rescaledNotePrefix': string;
  'bubbles.rescaleDetailPrefix': string;
  'bubbles.rescaleDetailSuffix': string;
  'reading.selectPrompt': string;
  'reading.noneSelected': string;
  'reading.shareSuffix': string;
  'reading.unitUnspecified': string;
  'reading.periodUnspecified': string;
  'reading.caption': string;
  'reading.prevButton': string;
  'reading.rangeAriaLabel': string;
  'reading.nextButton': string;
  'reading.unsupportedRangeError': string;
  'packed.listAriaLabel': string;
  'packed.zeroText': string;
  'packed.unknown': string;
  'packed.invalidSuffix': string;
  'packed.invalid': string;
  'packed.negativeSuffix': string;
  'packed.table.showButton': string;
  'packed.table.hideButton': string;
  'packed.table.unitHead': string;
  'packed.table.periodHead': string;
  'packed.table.scaleHead': string;
  'packed.table.separator': string;
  'packed.table.categoryHead': string;
  'packed.table.valueHead': string;
  'packed.scaleError': string;
  'packed.zeroDetailMax': string;
  'packed.zeroDetailWithPositive': string;
  'packed.zeroDetailNoPositive': string;
  'packed.invalidDetail': string;
  'packed.empty': string;
  'packed.tooManyCategoriesError': string;
}

export interface DataOptions {
  labels?: Partial<DataLabels>;
}

export interface DataInstance {
  root: Element | Document;
  /** يعيد تصيير كل الرسوم تحت الجذر من DOM المصدر. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document, options?: DataOptions): DataInstance;
export function getSelection(chart: Element): unknown;
export function setSelection(chart: Element, key: string | null): unknown;
export function destroy(root: Element | Document): void;
export function getInstance(root: Element | Document): DataInstance | null;
export function setLabels(partial: Partial<DataLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'micro-data:selection-change': CustomEvent<unknown>;
    'micro-data:rendered': CustomEvent<{ kind: string }>;
  }
}
