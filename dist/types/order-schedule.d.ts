/* @micro/ui/order-schedule — أنواع المدخل العامة (R3، مكتوبة يدويًا).
   المصدر: components/order-schedule/order-schedule.js. تصف هذه الأنواع عقد الجولة الثانية كاملًا:
   init(root, options?) يعيد instance له update/destroy (R4)، وoptions.labels
   يخصص نصوص هذا الـinstance فقط (R5)، والأحداث بأسمائها وتفاصيلها الحرفية.
   الأسماء الموسومة deprecated (R-D10) متاحة في نسخة IIFE فقط بعد R4. */
import type { MicroPluralForms } from './labels';

export interface OrderScheduleLabels {
  'schedule.weekdays.full': string[];
  'schedule.weekdays.short': string[];
  'schedule.orders.count': MicroPluralForms;
  'schedule.errors.invalidRoot': string;
  'schedule.view.ariaLabel': string;
  'schedule.view.day': string;
  'schedule.view.week': string;
  'schedule.view.month': string;
  'schedule.view.calendarToggle': string;
  'schedule.view.listToggle': string;
  'schedule.nav.today': string;
  'schedule.nav.prevMonth': string;
  'schedule.nav.prevWeek': string;
  'schedule.nav.prevDay': string;
  'schedule.nav.nextMonth': string;
  'schedule.nav.nextWeek': string;
  'schedule.nav.nextDay': string;
  'schedule.picker.ariaLabel': string;
  'schedule.picker.prevYear': string;
  'schedule.picker.nextYear': string;
  'schedule.picker.back': string;
  'schedule.picker.monthsLabel': string;
  'schedule.dayCell.ordersSuffix': string;
  'schedule.monthTitlePrefix': string;
  'schedule.weekTitlePrefix': string;
  'schedule.addOrder.label': string;
  'schedule.addOrder.dayAriaPrefix': string;
  'schedule.orderRow.date': string;
  'schedule.orderRow.unscheduled': string;
  'schedule.orderRow.time': string;
  'schedule.orderRow.customer': string;
  'schedule.orderRow.status': string;
  'schedule.orderRow.note': string;
  'schedule.orderRow.edit': string;
  'schedule.orderRow.delete': string;
  'schedule.dayList.title': string;
  'schedule.dayList.noDayPrefix': string;
  'schedule.dayList.noDaySuffix': string;
  'schedule.dayList.empty': string;
  'schedule.list.empty': string;
  'schedule.list.upcoming': string;
  'schedule.list.past': string;
  'schedule.list.unscheduled': string;
  'schedule.loading': string;
  'schedule.loadError': string;
  'schedule.retry': string;
}

export interface OrderScheduleOptions {
  orders?: unknown[];
  statuses?: unknown;
  today?: string;
  weekStart?: number;
  selectedDate?: string | null;
  displayedMonth?: string;
  view?: 'calendar' | 'list';
  calendarView?: 'month' | 'week' | 'day';
  orderActions?: unknown;
  headingLevel?: number;
  loading?: boolean;
  retry?: unknown;
  labels?: Partial<OrderScheduleLabels>;
}

export interface OrderScheduleState {
  view: string;
  calendarView: string;
  selectedDate: string | null;
  displayedMonth: string;
}

export interface OrderScheduleInstance {
  root: Element;
  /** = setData: استبدال الطلبات وإعادة التصيير. */
  update(orders: unknown[]): void;
  setData(orders: unknown[]): void;
  getState(): OrderScheduleState;
  setSelectedDate(date: string): void;
  setDisplayedMonth(month: string): void;
  setView(view: 'calendar' | 'list'): void;
  setCalendarView(view: 'month' | 'week' | 'day'): void;
  setLoading(flag: boolean): void;
  setError(retryCallback: (() => void) | null): void;
  destroy(): void;
}

/** init يرمي Error إن لم يكن الجذر عنصر DOM صالحًا (schedule.errors.invalidRoot). */
export function init(root: Element, options?: OrderScheduleOptions): OrderScheduleInstance;
export function update(root: Element, orders: unknown[]): OrderScheduleInstance | null;
export function getInstance(root: Element): OrderScheduleInstance | null;
export function destroy(root: Element): void;
export function setLabels(partial: Partial<OrderScheduleLabels>): void;

declare global {
  interface HTMLElementEventMap {
    'order-schedule:state-change': CustomEvent<OrderScheduleState>;
    'order-schedule:day-select': CustomEvent<{ date: string }>;
    'order-schedule:order-open': CustomEvent<{ id: string }>;
    'order-schedule:order-edit-request': CustomEvent<{ id: string }>;
    'order-schedule:order-delete-request': CustomEvent<{ id: string }>;
    'order-schedule:add-request': CustomEvent<{ date: string | null }>;
  }
}
