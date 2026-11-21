/* تحقق غلوبالات نسخة IIFE (R-D10) — فحص أنواع فقط، لا يُنفَّذ.
   window.Micro* تعرض صادرات مدخل ESM نفسها زائد الأسماء المهملة
   (disconnect/sync/rescan/render/update القديمة) التي تبقى في IIFE
   حتى 1.0. يضمّن عبر tsconfig (types/iife.d.ts). */
declare const appRoot: HTMLElement;
const btn = appRoot.querySelector('.m-btn') as HTMLButtonElement;
const chart = appRoot.querySelector('[data-chart]') as HTMLElement;
const layer = appRoot.querySelector('.m-layer') as HTMLElement;
const sheet = appRoot.querySelector('.m-action-sheet') as HTMLElement;
const strip = appRoot.querySelector('[data-peek]') as HTMLElement;
const carouselEl = appRoot.querySelector('[data-carousel]') as HTMLElement;
const pickerEl = appRoot.querySelector('[data-picker]') as HTMLElement;
const ocalRoot = document.createElement('div');

/* الصادرات الحقيقية عبر الغلوبال. */
window.MicroButtons.init();
window.MicroButtons.setLoading(btn, false);
window.MicroFields.init();
window.MicroSelection.setSwitchPending(appRoot.querySelector('.m-switch') as HTMLElement, false);
window.MicroPicker.setOptions(pickerEl, [{ value: 'a', label: 'أ' }]);
window.MicroOrganization.init();
window.MicroData.getSelection(chart);
window.MicroMessages.announce('جاهز');
window.MicroNavigation.openLayer(layer);
window.MicroActionSheet.open(sheet);
window.MicroInfoStrip.init();
window.MicroInfoPeek.goTo(strip, 1);
window.MicroMetricComparison.init();
window.MicroAccountSettings.init();
window.MicroAccessGateway.init(appRoot, { onSubmit: (c) => c.email });
window.MicroCarousel.next(carouselEl);
window.MicroOrderSchedule.init(ocalRoot, { orders: [] });
window.MicroReadings.init();
window.MicroProduct.register('custom', { type: 'custom', render: () => undefined });
window.MicroLabels.setLocale('ar-EG');
void window.MicroIcons.ready;

/* الأسماء المهملة (R-D10) — متاحة في IIFE فقط. */
window.MicroButtons.disconnect();
window.MicroFields.sync();
window.MicroFields.update();
window.MicroFields.disconnect();
window.MicroSelection.disconnect();
window.MicroPicker.update(appRoot, [{ value: 'a', label: 'أ' }]);
window.MicroPicker.disconnect();
window.MicroOrganization.disconnect();
window.MicroData.render(chart);
window.MicroData.update();
window.MicroData.disconnect();
window.MicroPacked.render(chart);
window.MicroPacked.update();
window.MicroPacked.disconnect();
window.MicroMessages.disconnect();
window.MicroNavigation.disconnect();
window.MicroActionSheet.disconnect();
window.MicroInfoStrip.rescan();
window.MicroInfoStrip.update();
window.MicroInfoStrip.disconnect();
window.MicroInfoPeek.update(strip, 1);
window.MicroInfoPeek.disconnect();
window.MicroMetricComparison.render();
window.MicroMetricComparison.update();
window.MicroMetricComparison.disconnect();
window.MicroAccountSettings.disconnect();
window.MicroAccessGateway.update(appRoot, {});
window.MicroAccessGateway.disconnect();
window.MicroCarousel.update(carouselEl, 1);
window.MicroCarousel.disconnect();
window.MicroReadings.sync();
window.MicroReadings.update();
window.MicroReadings.disconnect();

/* توافق 0.1.0: خاصيتا locale وready على الغلوبالين. */
const locale: string = window.MicroLabels.locale;
void locale;
const ready: Promise<unknown[]> = window.MicroIcons.ready;
void ready;

/* التهيئة التلقائية (R-D3) تُضبط عبر MicroConfig. */
window.MicroConfig = { autoInit: false };
