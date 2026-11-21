/* اختبار الأنواع (R3.2) — فحص توقيعات فقط (tsc --noEmit)، لا يُنفَّذ أبدًا.
   يستورد كل مدخل من @micro/ui/<entry> (عبر paths في tsconfig، وبعد التثبيت
   المحلي عبر خرائط exports نفسها في بوابة package-install) ويستدعي الواجهة
   العامة كاملة بعقد الجولة الثانية النهائي (R4: init/update/destroy/
   getInstance، R5: options.labels)، ويستمع لحدث واحد على الأقل لكل عائلة
   لها أحداث. لا يستعمل الأسماء المهملة (R-D10) — تُفحص في types-iife-test. */
import * as buttons from '@micro/ui/buttons';
import * as fields from '@micro/ui/fields';
import * as selection from '@micro/ui/selection';
import * as picker from '@micro/ui/picker';
import * as organization from '@micro/ui/organization';
import * as data from '@micro/ui/data';
import * as packedCircle from '@micro/ui/packed-circle';
import * as messages from '@micro/ui/messages';
import * as navigation from '@micro/ui/navigation';
import * as actionSheet from '@micro/ui/action-sheet';
import * as infoStrip from '@micro/ui/info-strip';
import * as infoStripPeek from '@micro/ui/info-strip-peek';
import * as metricComparison from '@micro/ui/metric-comparison';
import * as accountSettings from '@micro/ui/account-settings';
import * as accessGateway from '@micro/ui/access-gateway';
import * as carousel from '@micro/ui/carousel';
import * as orderSchedule from '@micro/ui/order-schedule';
import * as readings from '@micro/ui/readings';
import * as product from '@micro/ui/product';
import * as icons from '@micro/ui/icons';
import * as labels from '@micro/ui/labels';

declare const appRoot: HTMLElement;
const btn = appRoot.querySelector('.m-btn') as HTMLButtonElement;
const chart = appRoot.querySelector('[data-chart]') as HTMLElement;

/* buttons — لا نصوص ولا أحداث؛ init يربط حراسة التحميل. */
const buttonsInstance = buttons.init(appRoot, {});
buttons.setLoading(btn, true, { loadingLabel: 'جارٍ الحفظ' });
buttonsInstance.update({ loading: true, loadingLabel: 'جارٍ الحفظ' });
buttonsInstance.update();
buttonsInstance.destroy();
buttons.destroy(appRoot);
if (buttons.getInstance(appRoot) !== null) throw new Error('buttons: getInstance بعد destroy يجب أن يعيد null');

/* fields — أحداث micro-field:cleared/changed. */
const fieldsInstance = fields.init(appRoot, { labels: {} });
fieldsInstance.update();
fieldsInstance.destroy();
fields.destroy(appRoot);
fields.setLabels({});
appRoot.addEventListener('micro-field:cleared', () => undefined);
appRoot.addEventListener('micro-field:changed', () => undefined);

/* selection */
const selectionInstance = selection.init(appRoot, { labels: { 'picker.retry': 'أعد المحاولة' } });
selection.setSwitchPending(appRoot.querySelector('.m-switch') as HTMLElement, true);
selectionInstance.update();
selectionInstance.destroy();
selection.destroy(appRoot);
selection.setLabels({ 'picker.selectedNone': 'المحدد: لا شيء' });
appRoot.addEventListener('micro-selection:changed', () => undefined);
appRoot.addEventListener('micro-selection:segment', (event) => { const value: string = event.detail.value; void value; });

/* picker */
const pickerInstance = picker.init(appRoot, { labels: { 'picker.status.loading': 'جارٍ التحميل…' } });
const pickerItems: picker.PickerItem[] = [{ value: 'a', label: 'الخيار أ' }];
picker.setOptions(appRoot.querySelector('[data-picker]') as HTMLElement, pickerItems);
picker.setStatus(appRoot.querySelector('[data-picker]') as HTMLElement, 'loading');
picker.clearSelection(appRoot.querySelector('[data-picker]') as HTMLElement);
const picked: picker.PickerItem | null = picker.getSelected(appRoot.querySelector('[data-picker]') as HTMLElement);
void picked;
pickerInstance.update(pickerItems);
pickerInstance.destroy();
picker.destroy(appRoot);
picker.setLabels({ 'picker.noResults': 'لا نتائج' });
appRoot.addEventListener('micro-picker:change', (event) => { void event.detail.value; });
appRoot.addEventListener('micro-picker:retry', () => undefined);
appRoot.addEventListener('micro-picker:close', () => undefined);

/* organization */
const organizationInstance = organization.init(appRoot, { labels: { 'avatar.initialsFallback': '؟' } });
organizationInstance.update();
organizationInstance.destroy();
organization.destroy(appRoot);
organization.setLabels({});
appRoot.addEventListener('micro-organization:toggle', (event) => { const open: boolean = event.detail.open; void open; });

/* data */
const dataInstance = data.init(appRoot, { labels: { 'chart.empty': 'لا بيانات' } });
void data.getSelection(chart);
void data.setSelection(chart, 'a');
void data.setSelection(chart, null);
dataInstance.update();
dataInstance.destroy();
data.destroy(appRoot);
data.setLabels({ 'table.showButton': 'عرض البيانات كجدول' });
appRoot.addEventListener('micro-data:selection-change', (event) => { void event.detail; });
appRoot.addEventListener('micro-data:rendered', (event) => { const kind: string = event.detail.kind; void kind; });

/* packed-circle — نصوصه من عائلة data. */
const packedInstance = packedCircle.init(appRoot, { labels: { 'packed.empty': 'لا قيم' } });
packedInstance.update();
packedInstance.destroy();
packedCircle.destroy(appRoot);
packedCircle.setLabels({});
appRoot.addEventListener('micro-packed:rendered', (event) => { const ok: boolean = event.detail.ok; void ok; });

/* messages */
const messagesInstance = messages.init(appRoot, { labels: {} });
const toastEl = appRoot.querySelector('.m-toast') as HTMLElement;
messages.toast(toastEl, { duration: 3000, returnFocus: btn });
messages.closeToast(toastEl, btn);
messages.announce('تم الحفظ', { id: 'save', assertive: true });
messages.announce('تنبيه', true);
messages.resetAnnouncements();
messagesInstance.update();
messagesInstance.destroy();
messages.destroy(appRoot);
messages.setLabels({});
appRoot.addEventListener('micro-messages:toast-dismissed', () => undefined);
appRoot.addEventListener('micro-messages:toast-closed', () => undefined);
appRoot.addEventListener('micro-messages:note-closed', (event) => { const focus: boolean = event.detail.returnFocus; void focus; });

/* navigation */
const layer = appRoot.querySelector('.m-layer') as HTMLElement;
const panel = appRoot.querySelector('.m-filter-panel') as HTMLElement;
const navigationInstance = navigation.init(appRoot, { labels: { 'filters.summary.applied': 'المطبّق' } });
navigation.openLayer(layer, { trigger: btn });
const closeAllowed: boolean = navigation.requestClose(layer, { reason: 'escape', trigger: btn });
void closeAllowed;
navigation.closeLayer(layer);
const applied: Record<string, unknown> = navigation.appliedFilters(panel);
navigation.setAppliedFilters(panel, applied);
navigationInstance.update();
navigationInstance.destroy();
navigation.destroy(appRoot);
navigation.setLabels({});
appRoot.addEventListener('micro-navigation:opened', () => undefined);
appRoot.addEventListener('micro-navigation:close-request', (event) => { void event.detail.reason; });
appRoot.addEventListener('micro-navigation:closed', () => undefined);
appRoot.addEventListener('micro-navigation:filters-applied', (event) => { const count: number = event.detail.count; void count; });

/* action-sheet */
const sheet = appRoot.querySelector('.m-action-sheet') as HTMLElement;
const actionSheetInstance = actionSheet.init(appRoot, { labels: {} });
const opened: boolean = actionSheet.open(sheet, { trigger: btn, contextKey: 'context-key-1' });
void opened;
actionSheet.close(sheet);
actionSheetInstance.update();
actionSheetInstance.destroy();
actionSheet.destroy(appRoot);
actionSheet.setLabels({});
appRoot.addEventListener('micro-actions:request', (event) => { const id: string = event.detail.id; void id; });

/* info-strip — لا أحداث للشريط الأساسي. */
const infoStripInstance = infoStrip.init(appRoot, { labels: { 'status.empty': 'لا بطاقات.' } });
infoStripInstance.update();
infoStripInstance.destroy();
infoStrip.destroy(appRoot);
infoStrip.setLabels({});

/* info-strip-peek */
const strip = appRoot.querySelector('[data-peek]') as HTMLElement;
const peekInstance = infoStripPeek.init(strip, { labels: { 'peek.status.empty': 'لا بطاقات.' } });
peekInstance.update({ index: 1, animate: false });
peekInstance.goTo(0, { animate: true });
peekInstance.next();
peekInstance.prev();
const peekIndex: number = peekInstance.getIndex();
void peekIndex;
infoStripPeek.goTo(strip, 1);
infoStripPeek.next(strip);
infoStripPeek.prev(strip);
void infoStripPeek.getIndex(strip);
peekInstance.destroy();
infoStripPeek.destroy(strip);
infoStripPeek.setLabels({});
strip.addEventListener('micro-info-peek:change', (event) => { void event.detail.count; });

/* metric-comparison */
const metricInstance = metricComparison.init(appRoot, { labels: { 'chart.empty': 'لا بيانات للمقارنة.' } });
metricInstance.update();
metricInstance.destroy();
metricComparison.destroy(appRoot);
metricComparison.setLabels({});

/* account-settings */
const accountInstance = accountSettings.init(appRoot, { labels: { 'demo.changeNotice': 'مثال فقط' } });
accountInstance.update();
accountInstance.destroy();
accountSettings.destroy(appRoot);
accountSettings.setLabels({});
appRoot.addEventListener('micro-account-settings:change', (event) => { const checked: boolean = event.detail.checked; void checked; });

/* access-gateway */
const gatewayInstance = accessGateway.init(appRoot, {
  labels: { 'submit.loadingLabel': 'جارٍ تسجيل الدخول' },
  onSubmit: (credentials) => credentials.email,
  onRecovery: () => 'recovery-requested',
  providers: { google: () => 'google' },
});
gatewayInstance.update({ onRecovery: () => 'recovery-again' });
gatewayInstance.destroy();
accessGateway.destroy(appRoot);
accessGateway.setLabels({ 'demo.notice': 'نسخة عرض' });
appRoot.addEventListener('micro-access:submitted', (event) => { void event.detail.result; });

/* carousel */
const carouselEl = appRoot.querySelector('[data-carousel]') as HTMLElement;
const carouselInstance = carousel.init(carouselEl, { labels: { 'empty': 'لا توجد بطاقات.' } });
carouselInstance.update({ index: 1, animate: false });
carouselInstance.goTo(0);
carouselInstance.next();
carouselInstance.prev();
void carouselInstance.getIndex();
carousel.goTo(carouselEl, 1, { animate: true });
carousel.next(carouselEl);
carousel.prev(carouselEl);
void carousel.getIndex(carouselEl);
carouselInstance.destroy();
carousel.destroy(carouselEl);
void (carousel.getInstance(carouselEl) === null);
carousel.setLabels({ 'dots.goToPrefix': 'الانتقال إلى البطاقة ' });
carouselEl.addEventListener('micro-carousel:change', (event) => { const count: number = event.detail.count; void count; });

/* order-schedule */
const ocalRoot = document.createElement('div');
const scheduleInstance = orderSchedule.init(ocalRoot, {
  orders: [],
  view: 'calendar',
  calendarView: 'month',
  today: '2026-11-21',
  labels: { 'schedule.retry': 'إعادة المحاولة' },
});
scheduleInstance.setData([]);
const scheduleState: orderSchedule.OrderScheduleState = scheduleInstance.getState();
void scheduleState;
scheduleInstance.setSelectedDate('2026-11-21');
scheduleInstance.setDisplayedMonth('2026-11');
scheduleInstance.setView('list');
scheduleInstance.setCalendarView('week');
scheduleInstance.setLoading(true);
scheduleInstance.setError(() => undefined);
scheduleInstance.update([]);
scheduleInstance.destroy();
void (orderSchedule.getInstance(ocalRoot) === null);
void (orderSchedule.update(ocalRoot, []) === null);
orderSchedule.destroy(ocalRoot);
orderSchedule.setLabels({ 'schedule.nav.today': 'اليوم' });
ocalRoot.addEventListener('order-schedule:state-change', (event) => { void event.detail.view; });
ocalRoot.addEventListener('order-schedule:day-select', (event) => { const date: string = event.detail.date; void date; });
ocalRoot.addEventListener('order-schedule:order-open', (event) => { void event.detail.id; });
ocalRoot.addEventListener('order-schedule:order-edit-request', (event) => { void event.detail.id; });
ocalRoot.addEventListener('order-schedule:order-delete-request', (event) => { void event.detail.id; });
ocalRoot.addEventListener('order-schedule:add-request', (event) => { void event.detail.date; });

/* readings — تركيب C04، لا نصوص ولا أحداث خاصة. */
const readingsInstance = readings.init(appRoot, {});
readingsInstance.update();
readingsInstance.destroy();
readings.destroy(appRoot);

/* product — سياق المنتج C07–C12 وC14. */
const scope: product.ProductScope = {
  contextId: 'owner-a', workspaceId: 'workshop-a', roleId: 'owner', kind: 'business', label: 'ورشة الشروق · صاحب مشروع',
};
const manageModel: product.ProductModel = {
  type: 'manage', scope, dataContext: scope, phase: 'ready', connection: 'online',
  destination: 'manage', permissions: ['view', 'compose'], revision: 'types-r1',
};
const productRoot = document.createElement('section');
const productInstance = product.init(productRoot, manageModel);
const replaced: boolean = productInstance.update({ ...manageModel, phase: 'pending' });
void replaced;
const mounted = product.mount(productRoot, 'context', { ...manageModel });
const token: product.ProductResolveToken = {
  instanceId: 'instance-1', generation: 1, requestId: 'request-1', contextKey: product.contextKey(scope),
};
void mounted.resolve(token, manageModel);
void mounted.replace(manageModel);
void mounted.getState();
mounted.destroy();
product.register('custom', { type: 'custom', render: () => undefined });
productInstance.destroy();
product.destroy(productRoot);
void (product.getInstance(productRoot) === null);
product.setLabels({ 'operation.title': 'حالة العملية' });
productRoot.addEventListener('micro-product:intent', (event) => {
  const intent: product.ProductIntentDetail = event.detail;
  void intent.action;
});

/* icons */
const hydrated: Promise<unknown[]> = icons.hydrate(appRoot);
void hydrated;
void icons.ready();

/* labels — السجل المشترك. */
labels.registerLabels('types-demo', { 'demo.hello': 'مرحبا {name}' });
const label: string = labels.getLabel('types-demo', 'demo.hello', { name: 'زياد' });
void label;
void labels.familyLabels('types-demo');
labels.setLabels('types-demo', { 'demo.hello': 'أهلا {name}' });
labels.setLocale('ar-EG');
const locale: string = labels.getLocale();
void locale;
void labels.formatNumber(1150);
void labels.pluralCategory(102);
void labels.plural(2, { zero: 'لا عناصر', one: 'عنصر', two: 'عنصران', few: 'عناصر', many: 'عنصرًا', other: 'عنصر' });
