/* @micro/ui 0.1.0 — تعريفات TypeScript محيطية (ambient) لـ globals المكتبة.
   ملف مرجعي فقط: المكتبة نفسها JavaScript بلا خطوة بناء لدى المستهلك؛
   هذه التعريفات توثق أسماء window.Micro* الحقيقية كما في المصدر
   (components/ وshared/) وdocs/API.md — لا تضيف أي API غير موجود.

   الاستخدام من المستهلك (بعد تثبيت الحزمة):
     /// <reference types="@micro/ui/micro-ui.d.ts" />
   أو بمسار نسبي إلى dist/micro-ui.d.ts.

   ملاحظة نطاق: globals ثانوية موثقة في docs/API.md لكنها خارج نطاق هذا
   الملف الأدنى (المرحلة 5): MicroPacked وMicroInfoPeek وMicroReadings
   وMicroIcons وMicroActionSheet. عائلة Surfaces CSS-only بلا JavaScript.
   معاملات البيانات typed كـ unknown عمدًا؛ عقود التفصيل في docs/API.md. */

/** Buttons — تحميل الزر فقط؛ لا يوجد init عام (docs/API.md §1). */
interface MicroButtonsApi {
  setLoading(button: HTMLElement, flag: boolean, options?: { loadingLabel?: string }): void;
  disconnect(root?: ParentNode): void;
}

/** Fields — init/sync/disconnect/destroy (docs/API.md §2). */
interface MicroFieldsApi {
  init(root?: ParentNode): void;
  sync(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
}

/** Selection — المجموعات والمقاطع والمفاتيح (docs/API.md §3). */
interface MicroSelectionApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  setSwitchPending(switchWrapper: HTMLElement, pending: boolean): void;
}

/** Picker — listbox اختيار قيمة واحدة (docs/API.md §3). */
interface MicroPickerSelection { value: string; label: string; }
interface MicroPickerApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
  setOptions(picker: HTMLElement, items: Array<{ value: string; label: string }>): void;
  setStatus(picker: HTMLElement, kind: 'ready' | 'loading' | 'empty' | 'error' | 'initial' | 'disabled', message?: string): void;
  clearSelection(picker: HTMLElement): void;
  getSelected(picker: HTMLElement): MicroPickerSelection | null;
}

/** Organization — الطي وبديل الصورة (docs/API.md §4). */
interface MicroOrganizationApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
}

/** Data — init/render/selection/disconnect (docs/API.md §5). */
interface MicroDataApi {
  init(root?: ParentNode): void;
  render(chart: HTMLElement): void;
  getSelection(chart: HTMLElement): unknown;
  setSelection(chart: HTMLElement, key: string | null): unknown;
  disconnect(root?: ParentNode): void;
}

/** Messages — init/toast/announce (docs/API.md §6). */
interface MicroMessagesApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  toast(element: HTMLElement, options?: { duration?: number; returnFocus?: HTMLElement }): void;
  closeToast(element: HTMLElement, trigger?: HTMLElement): void;
  announce(text: string, options?: { id?: string; assertive?: boolean } | boolean): void;
  resetAnnouncements(): void;
}

/** Navigation — init/layers/filters (docs/API.md §7). */
interface MicroNavigationApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  openLayer(layer: HTMLElement, options?: { trigger?: HTMLElement; backdropEl?: HTMLElement }): void;
  closeLayer(layer: HTMLElement): void;
  requestClose(layer: HTMLElement, options?: { reason?: string; trigger?: HTMLElement }): boolean;
  appliedFilters(panel: HTMLElement): Record<string, unknown>;
  setAppliedFilters(panel: HTMLElement, values: Record<string, unknown>): void;
}

/** Info Strip — الشريط الأساسي (docs/API.md §9). */
interface MicroInfoStripApi {
  init(root?: ParentNode): void;
  rescan(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
}

/** Metric Comparison — init/render/disconnect (docs/API.md §10). */
interface MicroMetricComparisonApi {
  init(root?: ParentNode): void;
  render(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
}

/** Account Settings — init/disconnect/destroy (docs/API.md §11). */
interface MicroAccountSettingsApi {
  init(root?: ParentNode): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
}

/** Access Gateway — init(root, handlers?) (docs/API.md §12). */
interface MicroAccessGatewayHandlers {
  onSubmit?(credentials: { email: string; password: string }): unknown;
  onRecovery?(): unknown;
  providers?: Record<string, () => unknown>;
}
interface MicroAccessGatewayApi {
  init(root?: ParentNode, handlers?: MicroAccessGatewayHandlers): void;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
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
  getInstance(root: HTMLElement): MicroOrderScheduleInstance | null;
}

/** Carousel — init/goTo/next/prev/getIndex (docs/API.md §14). */
interface MicroCarouselApi {
  init(root?: ParentNode): void;
  goTo(carousel: HTMLElement, index: number, options?: { animate?: boolean }): void;
  next(carousel: HTMLElement): void;
  prev(carousel: HTMLElement): void;
  getIndex(carousel: HTMLElement): number;
  disconnect(root?: ParentNode): void;
  destroy(root?: ParentNode): void;
}

/** Product — mount/replace/resolve/destroy لتراكيب C07–C13 (docs/API.md). */
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
}
