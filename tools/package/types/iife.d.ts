/* @micro/ui/iife — أنواع الغلوبالات window.Micro* لنسخة IIFE (R3).
   بديل micro-ui.d.ts القديم (0.1.0). كل غلوبال يعرض صادرات مدخل ESM نفسها
   زائد الأسماء المهملة (R-D10: disconnect/sync/rescan/render/update القديمة)
   التي تبقى في IIFE فقط حتى 1.0 — لا تُصدَّر من ESM بعد R4.
   التهيئة التلقائية في ملفات IIFE تحترم MicroConfig.autoInit و
   data-micro-manual (R-D3). الاستخدام: /// <reference types="@micro/ui/iife" />
   أو تضمين dist/types/iife.d.ts في tsconfig. */

import type * as Buttons from './buttons';
import type * as Fields from './fields';
import type * as Selection from './selection';
import type * as Picker from './picker';
import type * as Organization from './organization';
import type * as Data from './data';
import type * as PackedCircle from './packed-circle';
import type * as Messages from './messages';
import type * as Navigation from './navigation';
import type * as ActionSheet from './action-sheet';
import type * as InfoStrip from './info-strip';
import type * as InfoStripPeek from './info-strip-peek';
import type * as MetricComparison from './metric-comparison';
import type * as AccountSettings from './account-settings';
import type * as AccessGateway from './access-gateway';
import type * as Carousel from './carousel';
import type * as Screen from './screen';
import type * as OrderSchedule from './order-schedule';
import type * as Readings from './readings';
import type * as Product from './product';
import type * as Icons from './icons';
import type * as Labels from './labels';

type MicroButtonsGlobal = typeof Buttons & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroFieldsGlobal = typeof Fields & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
  sync(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — alias لsync؛ استخدم instance.update(). */
  update(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroSelectionGlobal = typeof Selection & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroPickerGlobal = typeof Picker & {
  /** @deprecated منذ 0.2.0 (R-D10) — alias لsetOptions لكل picker تحت الجذر؛ استخدم instance.update(items). */
  update(root: Element | Document, items: Array<{ value: string; label: string }>): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroOrganizationGlobal = typeof Organization & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroDataGlobal = typeof Data & {
  /** @deprecated منذ 0.2.0 (R-D10) — لتصيير كل الرسوم تحت جذر استخدم instance.update(). */
  render(chart?: Element): void;
  /** @deprecated منذ 0.2.0 (R-D10) — alias لrender لكل رسم تحت الجذر؛ استخدم instance.update(). */
  update(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroPackedGlobal = typeof PackedCircle & {
  /** @deprecated منذ 0.2.0 (R-D10) — لتصيير كل الرسوم تحت جذر استخدم instance.update(). */
  render(chart?: Element): void;
  /** @deprecated منذ 0.2.0 (R-D10) — alias لrender لكل رسم تحت الجذر؛ استخدم instance.update(). */
  update(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroMessagesGlobal = typeof Messages & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroNavigationGlobal = typeof Navigation & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroActionSheetGlobal = typeof ActionSheet & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroInfoStripGlobal = typeof InfoStrip & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
  rescan(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — alias لrescan؛ استخدم instance.update(). */
  update(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroInfoPeekGlobal = typeof InfoStripPeek & {
  /** @deprecated منذ 0.2.0 (R-D10) — alias لgoTo؛ استخدم instance.update({index}). */
  update(strip: Element, index: number, options?: { animate?: boolean }): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroMetricComparisonGlobal = typeof MetricComparison & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
  render(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — alias لrender؛ استخدم instance.update(). */
  update(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroAccountSettingsGlobal = typeof AccountSettings & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroAccessGatewayGlobal = typeof AccessGateway & {
  /** @deprecated منذ 0.2.0 (R-D10) — تحديث callbacks؛ استخدم init أو instance.update(handlers). */
  update(root?: Element | Document, handlers?: AccessGateway.AccessGatewayHandlers): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroCarouselGlobal = typeof Carousel & {
  /** @deprecated منذ 0.2.0 (R-D10) — alias لgoTo؛ استخدم instance.update({index}). */
  update(carousel: Element, index: number, options?: { animate?: boolean }): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

type MicroReadingsGlobal = typeof Readings & {
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم instance.update(). */
  sync(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — alias لsync؛ استخدم instance.update(). */
  update(root?: Element | Document): void;
  /** @deprecated منذ 0.2.0 (R-D10) — استخدم destroy(root) أو instance.destroy(). */
  disconnect(root?: Element | Document): void;
};

/** توافق 0.1.0: خاصية locale قابلة للقراءة على السجل. */
type MicroLabelsGlobal = typeof Labels & { readonly locale: string };
/** توافق 0.1.0: الترطيب المتعجل عند التحميل كخاصية ready. */
type MicroIconsGlobal = typeof Icons & { ready: Promise<unknown[]> };

interface MicroConfig {
  autoInit?: boolean;
}

declare global {
  interface Window {
    MicroButtons: MicroButtonsGlobal;
    MicroFields: MicroFieldsGlobal;
    MicroSelection: MicroSelectionGlobal;
    MicroPicker: MicroPickerGlobal;
    MicroOrganization: MicroOrganizationGlobal;
    MicroData: MicroDataGlobal;
    MicroPacked: MicroPackedGlobal;
    MicroMessages: MicroMessagesGlobal;
    MicroNavigation: MicroNavigationGlobal;
    MicroActionSheet: MicroActionSheetGlobal;
    MicroInfoStrip: MicroInfoStripGlobal;
    MicroInfoPeek: MicroInfoPeekGlobal;
    MicroMetricComparison: MicroMetricComparisonGlobal;
    MicroAccountSettings: MicroAccountSettingsGlobal;
    MicroAccessGateway: MicroAccessGatewayGlobal;
    MicroCarousel: MicroCarouselGlobal;
    MicroScreen: typeof Screen;
    MicroOrderSchedule: typeof OrderSchedule;
    MicroReadings: MicroReadingsGlobal;
    MicroProduct: typeof Product;
    MicroIcons: MicroIconsGlobal;
    MicroLabels: MicroLabelsGlobal;
    MicroConfig: MicroConfig;
  }
  const MicroButtons: MicroButtonsGlobal;
  const MicroFields: MicroFieldsGlobal;
  const MicroSelection: MicroSelectionGlobal;
  const MicroPicker: MicroPickerGlobal;
  const MicroOrganization: MicroOrganizationGlobal;
  const MicroData: MicroDataGlobal;
  const MicroPacked: MicroPackedGlobal;
  const MicroMessages: MicroMessagesGlobal;
  const MicroNavigation: MicroNavigationGlobal;
  const MicroActionSheet: MicroActionSheetGlobal;
  const MicroInfoStrip: MicroInfoStripGlobal;
  const MicroInfoPeek: MicroInfoPeekGlobal;
  const MicroMetricComparison: MicroMetricComparisonGlobal;
  const MicroAccountSettings: MicroAccountSettingsGlobal;
  const MicroAccessGateway: MicroAccessGatewayGlobal;
  const MicroCarousel: MicroCarouselGlobal;
  const MicroScreen: typeof Screen;
  const MicroOrderSchedule: typeof OrderSchedule;
  const MicroReadings: MicroReadingsGlobal;
  const MicroProduct: typeof Product;
  const MicroIcons: MicroIconsGlobal;
  const MicroLabels: MicroLabelsGlobal;
  const MicroConfig: MicroConfig;
}
