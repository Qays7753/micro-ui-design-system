/**
 * §5.2.1–5.2.5 — projects & roles, funds, movements, debts, orders.
 * Amounts are integer fils; dates are ISO. The unsaved draft rides the
 * movements with saved: false and never enters any balance.
 */
import type { Debt, Fund, Movement, Order, SimProject } from './types';

/** §5.2.1 المشاريع والأدوار. */
export const PROJECTS: readonly SimProject[] = [
  { id: 'yasmine', name: 'ورشة الياسمين للخياطة', role: 'مالك' },
  { id: 'reef', name: 'حلويات بيت الريف', role: 'مالك' },
];

/** Suppliers/projects that appear in the market data only (§5.2.1). */
export const OTHER_PARTIES = {
  supplierArafat: 'مطبخ أم خالد',
  supplierKhatib: 'مؤسسة الخطيب للأقمشة',
  salonLamsa: 'صالون لمسة',
} as const;

/** §5.2.2 الصناديق (ورشة الياسمين). */
export const FUNDS: readonly Fund[] = [
  { id: 'cash', name: 'درج الكاش', kind: 'fund-cash' },
  { id: 'bank', name: 'الحساب البنكي', kind: 'fund-bank' },
  { id: 'wallet', name: 'المحفظة', kind: 'fund-wallet' },
];

/** §5.2.3 الحركات (ورشة الياسمين) — الحرفية كما في الجدول. */
export const MOVEMENTS: readonly Movement[] = [
  { id: 'ح1', date: '2026-11-14', time: '11:20', type: 'in', fund: 'bank', amount: 450000, party: 'رنا العبادي', note: 'طقم عرس · طلب 1180', linkedOrderId: '1180', saved: true },
  { id: 'ح2', date: '2026-11-15', time: '13:05', type: 'out', fund: 'bank', amount: 320000, party: 'مؤسسة الخطيب للأقمشة', note: 'قماش ساتان', saved: true },
  { id: 'ح3', date: '2026-11-17', time: '17:40', type: 'in', fund: 'cash', amount: 85000, party: 'خالد الزعبي', note: 'تقصير بدلة', saved: true },
  { id: 'ح4', date: '2026-11-18', time: '10:15', type: 'out', fund: 'cash', amount: 12500, party: null, note: 'فاتورة كهرباء', saved: true },
  { id: 'ح5', date: '2026-11-19', time: '12:30', type: 'in', fund: 'bank', amount: 145750, party: 'سلمى الحوراني', note: 'فستان خطوبة', saved: true },
  { id: 'ح6', date: '2026-11-20', time: '09:50', type: 'out', fund: 'cash', amount: 35000, party: 'أبو محمد (بقالة النور)', note: 'مستلزمات', saved: true },
  { id: 'ح7', date: '2026-11-21', time: '16:10', type: 'in', fund: 'cash', amount: 60000, party: 'رنا العبادي', note: 'تعديل فستان', saved: true },
  { id: 'ح8', date: '2026-11-21', time: '18:30', type: 'in', fund: 'wallet', amount: 20000, party: 'خالد الزعبي', note: 'قميص', saved: true },
  { id: 'ح9', date: '2026-11-22', time: '11:00', type: 'out', fund: 'wallet', amount: 23000, party: null, note: 'توصيل قماش', saved: true },
  { id: 'ح10', date: '2026-11-22', time: '14:45', type: 'in', fund: 'bank', amount: 30000, party: 'رنا العبادي', note: 'دفعة دين', saved: true },
  { id: 'ح11', date: '2026-11-23', time: '10:05', type: 'in', fund: 'cash', amount: 2250, party: null, note: 'خيط وأزرار', saved: true },
  { id: 'ح12', date: '2026-11-23', time: '15:20', type: 'out', fund: 'bank', amount: 45000, party: null, note: 'صيانة المكينة', saved: true },
  { id: 'ح13', date: '2026-11-25', time: '13:00', type: 'in', fund: 'cash', amount: 35000, party: 'سلمى الحوراني', note: 'دفعة دين · طلب 1172', linkedOrderId: '1172', linkedDebtId: 'د1', saved: true },
  { id: 'ح14', date: '2026-11-26', time: '17:30', type: 'out', fund: 'cash', amount: 3000, party: 'عمر الزعبي', note: 'توصيل طلب 1186', linkedDeliveryId: 'ت2', linkedOrderId: '1186', saved: true },
  { id: 'ح15', date: '2026-11-26', time: '17:35', type: 'in', fund: 'cash', amount: 85000, party: 'خالد الزعبي', note: 'تسليم طلب 1186', linkedOrderId: '1186', saved: true },
  { id: 'ح16', date: '2026-11-26', time: '19:10', type: 'in', fund: 'cash', amount: 90000, party: 'رنا العبادي', note: 'فستان سهرة', saved: true },
  // The transfer comes between ح16 and ح17 in the table's own order.
  { id: 'ح21', date: '2026-11-26', time: '21:00', type: 'transfer', from: 'cash', to: 'bank', amount: 45000, party: null, note: 'إيداع', saved: true },
  { id: 'ح17', date: '2026-11-27', time: '09:40', type: 'in', fund: 'cash', amount: 12500, party: 'خالد الزعبي', note: 'تعديل بنطال', saved: true },
  { id: 'ح18', date: '2026-11-27', time: '10:20', type: 'out', fund: 'cash', amount: 3000, party: null, note: 'مواصلات', saved: true },
  { id: 'ح19', date: '2026-11-27', time: '11:05', type: 'in', fund: 'bank', amount: 40000, party: 'خالد الزعبي', note: 'تفصيل قميص', saved: true },
  { id: 'ح20', date: '2026-11-27', time: '12:10', type: 'out', fund: 'bank', amount: 18500, party: 'مؤسسة الخطيب للأقمشة', note: 'خيوط وإبر', saved: true },
  // The unsaved draft: never inside any balance or sum; it shows in «يحتاجك»
  // and its dot rides the cash FundCard (§5.2.3).
  { id: 'draft-1', date: '2026-11-27', time: '12:00', type: 'out', fund: 'cash', amount: 7000, party: null, note: 'طباعة', saved: false },
];

/** §5.2.4 الديون (ورشة الياسمين). */
export const DEBTS: readonly Debt[] = [
  { id: 'د1', party: 'سلمى الحوراني', side: 'forYou', total: 80000, paid: 35000, paidByMovement: 'ح13', remaining: 45000, dueDate: '2026-11-30', overdue: false, settled: false, linkedOrderId: '1172' },
  { id: 'د2', party: 'أبو محمد (بقالة النور)', side: 'forYou', total: 12500, paid: 0, remaining: 12500, dueDate: '2026-11-25', overdue: true, settled: false },
  { id: 'د3', party: 'مؤسسة الخطيب للأقمشة', side: 'againstYou', total: 1280000, paid: 0, remaining: 1280000, dueDate: null, overdue: false, settled: false },
  { id: 'د4', party: 'رنا العبادي', side: 'forYou', total: 30000, paid: 30000, paidByMovement: 'ح10', remaining: 0, dueDate: null, overdue: false, settled: true },
];

/** §5.2.5 الطلبات (ورشة الياسمين). */
export const ORDERS: readonly Order[] = [
  { id: '1172', project: 'yasmine', customer: 'سلمى الحوراني', content: 'عباءة مطرزة', price: 80000, dueDate: '2026-11-20', time: null, durationMinutes: null, status: 'delivered', linkedDebtId: 'د1' },
  { id: '1175', project: 'yasmine', customer: 'سلمى الحوراني', content: 'فستان سهرة', price: 45000, dueDate: '2026-11-27', time: '16:00', durationMinutes: null, status: 'ready', linkedDeliveryId: 'ت1' },
  { id: '1180', project: 'yasmine', customer: 'رنا العبادي', content: 'طقم عرس', price: 450000, dueDate: '2026-11-14', time: null, durationMinutes: null, status: 'settled', linkedMovementId: 'ح1' },
  { id: '1186', project: 'yasmine', customer: 'خالد الزعبي', content: 'تقصير بدلة', price: 85000, dueDate: '2026-11-26', time: '17:00', durationMinutes: null, status: 'settled', linkedMovementId: 'ح15', linkedDeliveryId: 'ت2' },
  { id: '1190', project: 'yasmine', customer: 'سلمى الحوراني', content: 'تعديل فستان', price: null, dueDate: null, time: null, durationMinutes: null, status: 'draft', missing: ['السعر', 'الموعد'] },
  { id: '1192', project: 'yasmine', customer: 'رنا العبادي', content: 'فستان خطوبة مقاس 38', price: 120000, dueDate: '2026-11-28', time: '10:00', durationMinutes: 30, status: 'tentative' },
  { id: '1195', project: 'yasmine', customer: 'خالد الزعبي', content: 'قميص رسمي × 2', price: 70000, dueDate: '2026-11-29', time: '12:00', durationMinutes: null, status: 'confirmed' },
  { id: '1198', project: 'yasmine', customer: 'أبو محمد (بقالة النور)', content: 'مرايل عمل × 6', price: 36000, dueDate: '2026-11-28', time: null, durationMinutes: null, status: 'inProgress' },
  { id: '1203', project: 'yasmine', customer: 'خالد الزعبي', content: 'بدلة كاملة', price: 120000, dueDate: '2026-11-30', time: null, durationMinutes: null, status: 'needsReview' },
  { id: '1205', project: 'yasmine', customer: 'رنا العبادي', content: 'تقصير عباءة', price: 15000, dueDate: null, time: null, durationMinutes: null, status: 'postponed', reason: 'العميلة مسافرة' },
  { id: '1207', project: 'yasmine', customer: 'أبو محمد (بقالة النور)', content: 'ستائر محل', price: 60000, dueDate: null, time: null, durationMinutes: null, status: 'cancelled' },
  { id: '1210', project: 'yasmine', customer: 'سلمى الحوراني', content: 'جلسة قياس', price: 10000, dueDate: '2026-11-27', time: '11:00', durationMinutes: 45, status: 'confirmed' },
];

/** §5.2.5 حلويات بيت الريف (للتبديل فقط). */
export const REEF: {
  cashBalance: number;
  movements: readonly Movement[];
  orders: readonly Order[];
} = {
  cashBalance: 170000,
  movements: [
    { id: 'ر1', date: '2026-11-25', time: '12:00', type: 'in', fund: 'cash', amount: 120000, party: null, note: 'كنافة', saved: true },
    { id: 'ر2', date: '2026-11-26', time: '12:00', type: 'out', fund: 'cash', amount: 35000, party: null, note: 'سكر وسمن', saved: true },
    { id: 'ر3', date: '2026-11-27', time: '12:00', type: 'in', fund: 'cash', amount: 85000, party: null, note: 'معمول', saved: true },
  ],
  orders: [
    { id: '2041', project: 'reef', customer: 'خالد الزعبي', content: 'صينية كنافة', price: 25000, dueDate: '2026-11-28', time: '18:00', durationMinutes: null, status: 'confirmed' },
    { id: '2042', project: 'reef', customer: 'رنا العبادي', content: 'معمول 3 كغ', price: null, dueDate: null, time: null, durationMinutes: null, status: 'draft', missing: ['السعر', 'الموعد'] },
  ],
};
