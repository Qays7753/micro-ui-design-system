/* @micro/ui 0.1.0 — تعريفات TypeScript محيطية (ambient) لـ globals المكتبة.
   ملف مرجعي فقط: المكتبة نفسها JavaScript بلا خطوة بناء لدى المستهلك؛
   هذه التعريفات توثق أسماء window.Micro* الحقيقية كما في المصدر
   (components/ وshared/) وdocs/API.md — لا تضيف أي API غير موجود.

   الاستخدام من المستهلك (بعد تثبيت الحزمة):
     /// <reference types="@micro/ui/micro-ui.d.ts" />
   أو بمسار نسبي إلى dist/micro-ui.d.ts.

   العقد الموحد (المرحلة 6 — 2026-11-21، docs/API.md «العقد الموحد
   للبرمجة»): update اسم موحد يفوّض إلى التنفيذ القائم (sync/render/
   setData/rescan/setOptions/goTo)؛ العائلات التي لا مفهوم بيانات لها
   (Selection وOrganization وMessages وNavigation وAccount Settings)
   موثق غياب update عندها عمدًا ولم يُخترع لها سلوك. الغلوبالات
   الثانوية (MicroPacked وMicroInfoPeek وMicroReadings وMicroIcons
   وMicroActionSheet) معلنة هنا من مصادرها الحقيقية. عائلة Surfaces
   CSS-only بلا JavaScript. معاملات البيانات typed كـ unknown عمدًا؛
   عقود التفصيل في docs/API.md. */

/** Buttons — اكتشاف موثق + تحميل الزر؛ الربط تلقائي (docs/API.md §1).
    update غير منطبق: لا مفهوم بيانات للزر. */
interface MicroButtonsApi {
  init(root?: ParentNode): Array<HTMLElement>;
  setLoading(button: HTMLElement, flag: boolean, options?: { loadingLabel?: string }): void;
  disconnect(root?: ParentNode): void;
}

/** Fields — init/sync/update/disconnect/destroy (docs/API.md §2).
    update يفوّض إلى sync نفسها؛ لا وسيط بيانات (القيم في DOM). */
interface MicroFieldsApi {
  init(root?: ParentNode): void;
  sync(root?: ParentNode): void;
  update(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Selection — المجموعات والمقاطع والمفاتيح (docs/API.md §3).
    update غير منطبق: الحالة الأصلية checked/pressed يملكها المستهلك. */
interface MicroSelectionApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  setSwitchPending(switchWrapper: HTMLElement, pending: boolean): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Picker — listbox اختيار قيمة واحدة (docs/API.md §3).
    update(root, items) يفوّض إلى setOptions لكل picker تحت الجذر. */
interface MicroPickerSelection { value: string; label: string; }
interface MicroPickerApi {
  init(root?: ParentNode): void;
  update(root: ParentNode, items: Array<{ value: string; label: string }>): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
  setOptions(picker: HTMLElement, items: Array<{ value: string; label: string }>): void;
  setStatus(picker: HTMLElement, kind: 'ready' | 'loading' | 'empty' | 'error' | 'initial' | 'disabled', message?: string): void;
  clearSelection(picker: HTMLElement): void;
  getSelected(picker: HTMLElement): MicroPickerSelection | null;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Organization — الطي وبديل الصورة (docs/API.md §4).
    update غير منطبق: تحديث source DOM عند المستهلك ثم init. */
interface MicroOrganizationApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Data — init/render/update/selection/disconnect (docs/API.md §5).
    update(root) يعيد تصيير كل رسوم النطاق عبر render؛ لا وسيط بيانات. */
interface MicroDataApi {
  init(root?: ParentNode): void;
  render(chart: HTMLElement): void;
  update(root?: ParentNode): void;
  getSelection(chart: HTMLElement): unknown;
  setSelection(chart: HTMLElement, key: string | null): unknown;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Messages — init/toast/announce (docs/API.md §6).
    update غير منطبق: toast/announce/closeToast واجهات الحالة. */
interface MicroMessagesApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  toast(element: HTMLElement, options?: { duration?: number; returnFocus?: HTMLElement }): void;
  closeToast(element: HTMLElement, trigger?: HTMLElement): void;
  announce(text: string, options?: { id?: string; assertive?: boolean } | boolean): void;
  resetAnnouncements(): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Navigation — init/layers/filters (docs/API.md §7).
    update غير منطبق: openLayer/closeLayer/setAppliedFilters واجهات الحالة. */
interface MicroNavigationApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  openLayer(layer: HTMLElement, options?: { trigger?: HTMLElement; backdropEl?: HTMLElement }): void;
  closeLayer(layer: HTMLElement): void;
  requestClose(layer: HTMLElement, options?: { reason?: string; trigger?: HTMLElement }): boolean;
  appliedFilters(panel: HTMLElement): Record<string, unknown>;
  setAppliedFilters(panel: HTMLElement, values: Record<string, unknown>): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Info Strip — الشريط الأساسي (docs/API.md §9).
    update(root) يفوّض إلى rescan نفسها؛ لا وسيط بيانات. */
interface MicroInfoStripApi {
  init(root?: ParentNode): void;
  rescan(root?: ParentNode): void;
  update(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Metric Comparison — init/render/update/disconnect (docs/API.md §10).
    update يفوّض إلى render نفسها؛ لا وسيط بيانات (المصدر DOM). */
interface MicroMetricComparisonApi {
  init(root?: ParentNode): void;
  render(root?: ParentNode): void;
  update(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Account Settings — init/disconnect/destroy (docs/API.md §11).
    update غير منطبق: لا setData/save — الحالة الأصلية عند المستهلك. */
interface MicroAccountSettingsApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Access Gateway — init/update(root, handlers?)/disconnect/destroy (docs/API.md §12).
    update يفوّض إلى init نفسها: تحديث callbacks وتوافر الإجراءات بلا ربط مضاعف. */
interface MicroAccessGatewayHandlers {
  labels?: Record<string, unknown>;
  onSubmit?(credentials: { email: string; password: string }): unknown;
  onRecovery?(): unknown;
  providers?: Record<string, () => unknown>;
}
interface MicroAccessGatewayApi {
  init(root?: ParentNode, handlers?: MicroAccessGatewayHandlers): void;
  update(root?: ParentNode, handlers?: MicroAccessGatewayHandlers): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Order Schedule — init(element, options?) يعيد instance (docs/API.md §13). */
interface MicroOrderScheduleOptions {
  orders?: unknown[];
  statuses?: unknown;
  today?: string;
  weekStart?: unknown;
  selectedDate?: string | null;
  displayedMonth?: string;
  view?: 'calendar' | 'list';
  calendarView?: 'month' | 'week' | 'day';
  orderActions?: unknown;
  headingLevel?: number;
  loading?: boolean;
  retry?: unknown;
}
interface MicroOrderScheduleState {
  view: string;
  calendarView: string;
  selectedDate: string | null;
  displayedMonth: string;
}
interface MicroOrderScheduleInstance {
  setData(orders: unknown[]): void;
  getState(): MicroOrderScheduleState;
  setSelectedDate(date: string): void;
  setDisplayedMonth(month: string): void;
  setView(view: 'calendar' | 'list'): void;
  setCalendarView(view: 'month' | 'week' | 'day'): void;
  setLoading(flag: boolean): void;
  setError(retryCallback: (() => void) | null): void;
  destroy(): void;
}
interface MicroOrderScheduleApi {
  init(root: HTMLElement, options?: MicroOrderScheduleOptions): MicroOrderScheduleInstance;
  update(root: HTMLElement, orders: unknown[]): MicroOrderScheduleInstance | null;
  getInstance(root: HTMLElement): MicroOrderScheduleInstance | null;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Carousel — init/goTo/next/prev/getIndex/update/disconnect/destroy (docs/API.md §14).
    update(carousel, index, options?) يفوّض إلى goTo نفسها (يطلق change حتى برمجيًا). */
interface MicroCarouselApi {
  init(root?: ParentNode): void;
  goTo(carousel: HTMLElement, index: number, options?: { animate?: boolean }): void;
  update(carousel: HTMLElement, index: number, options?: { animate?: boolean }): void;
  next(carousel: HTMLElement): void;
  prev(carousel: HTMLElement): void;
  getIndex(carousel: HTMLElement): number;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Product — mount/replace/resolve/destroy لتراكيب C07–C13 (docs/API.md).
    طبقة تراكيب بعقد مثيل موحد أصلًا؛ replace هو تحديث المثيل. */
interface MicroProductInstance {
  replace(value: unknown): boolean;
  resolve(token: { instanceId: string; generation: number; requestId: string; contextKey: string | null }, next: unknown): boolean;
  getState(): unknown;
  destroy(): void;
}
interface MicroProductApi {
  register(type: string, renderer: unknown): void;
  mount(root: HTMLElement, type: string, value: unknown): MicroProductInstance;
  contextKey(scope: unknown): string | null;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** Globals المكتبة على window — الأسماء الحقيقية فقط (window.Micro*). */
declare const MicroButtons: MicroButtonsApi;
declare const MicroFields: MicroFieldsApi;
declare const MicroSelection: MicroSelectionApi;
declare const MicroPicker: MicroPickerApi;
declare const MicroOrganization: MicroOrganizationApi;
declare const MicroData: MicroDataApi;
declare const MicroMessages: MicroMessagesApi;
declare const MicroNavigation: MicroNavigationApi;
declare const MicroInfoStrip: MicroInfoStripApi;
declare const MicroMetricComparison: MicroMetricComparisonApi;
declare const MicroAccountSettings: MicroAccountSettingsApi;
declare const MicroAccessGateway: MicroAccessGatewayApi;
declare const MicroOrderSchedule: MicroOrderScheduleApi;
declare const MicroCarousel: MicroCarouselApi;
declare const MicroProduct: MicroProductApi;

/** Globals ثانوية — من مصادرها الحقيقية (متغيرات وامتدادات الهاتف).
    MicroPacked: متغير packed-circle لعائلة Data (Proposed).
    update(root) يعيد التصيير عبر render لكل رسم تحت الجذر. */
interface MicroPackedApi {
  init(root?: ParentNode): void;
  render(chart: HTMLElement): void;
  update(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}
/** MicroInfoPeek: متغير peek لعائلة Info Strip.
    update(strip, index, options?) يفوّض إلى goTo نفسها. */
interface MicroInfoPeekApi {
  init(root?: ParentNode): void;
  goTo(strip: HTMLElement, index: number, options?: { animate?: boolean }): void;
  update(strip: HTMLElement, index: number, options?: { animate?: boolean }): void;
  next(strip: HTMLElement): void;
  prev(strip: HTMLElement): void;
  getIndex(strip: HTMLElement): number;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}
/** MicroReadings: امتداد C04 لاختصار تكرار الوحدة بسياق صريح.
    update(root) يفوّض إلى sync نفسها. */
interface MicroReadingsApi {
  init(root?: ParentNode): void;
  sync(root?: ParentNode): void;
  update(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
}
/** MicroIcons: ترطيب SVG المحلي من HugeIcons (shared/icons.js).
    بلا lifecycle: hydrate تعيد Promise، وready ترطيب التحميل الأول. */
interface MicroIconsApi {
  hydrate(root?: ParentNode): Promise<unknown[]>;
  ready: Promise<unknown[]>;
}
/** MicroActionSheet: تركيب C05 قائمة الأفعال فوق عقد Navigation.
    بلا update: contextKey يمرر إلى open وليس حالة بيانات. */
interface MicroActionSheetApi {
  init(root?: ParentNode): void;
  open(sheet: HTMLElement, options?: { trigger?: HTMLElement; contextKey?: string | null }): boolean;
  close(sheet: HTMLElement): void;
  disconnect(root?: ParentNode): void;
  /** المرحلة 7 — دمج جزئي فوق نصوص العائلة الافتراضية في سجل MicroLabels؛
      يسري على التصييرات اللاحقة (docs/API.md «النصوص الافتراضية»). */
  setLabels(partial: Record<string, unknown>): void;
}

/** المرحلة 7 — سجل النصوص الافتراضية وإعدادات عامة (docs/API.md
    «النصوص الافتراضية وتخصيصها»): labels.js لكل عائلة تُحمَّل قبل ملف
    سلوكها؛ القيم العربية الافتراضية هي الصياغة الحرفية السابقة. */
interface MicroLabelsRegistry {
  locale: string;
  setLocale(locale: string): void;
  formatNumber(value: number): string;
  [family: string]: unknown;
}
interface MicroConfig {
  autoInit?: boolean;
}
declare const MicroLabels: MicroLabelsRegistry;
declare const MicroConfig: MicroConfig;

declare const MicroPacked: MicroPackedApi;
declare const MicroInfoPeek: MicroInfoPeekApi;
declare const MicroReadings: MicroReadingsApi;
declare const MicroIcons: MicroIconsApi;
declare const MicroActionSheet: MicroActionSheetApi;

interface Window {
  MicroButtons: MicroButtonsApi;
  MicroFields: MicroFieldsApi;
  MicroSelection: MicroSelectionApi;
  MicroPicker: MicroPickerApi;
  MicroOrganization: MicroOrganizationApi;
  MicroData: MicroDataApi;
  MicroMessages: MicroMessagesApi;
  MicroNavigation: MicroNavigationApi;
  MicroInfoStrip: MicroInfoStripApi;
  MicroMetricComparison: MicroMetricComparisonApi;
  MicroAccountSettings: MicroAccountSettingsApi;
  MicroAccessGateway: MicroAccessGatewayApi;
  MicroOrderSchedule: MicroOrderScheduleApi;
  MicroCarousel: MicroCarouselApi;
  MicroProduct: MicroProductApi;
  MicroPacked: MicroPackedApi;
  MicroInfoPeek: MicroInfoPeekApi;
  MicroReadings: MicroReadingsApi;
  MicroIcons: MicroIconsApi;
  MicroActionSheet: MicroActionSheetApi;
  MicroLabels: MicroLabelsRegistry;
  MicroConfig: MicroConfig;
}
