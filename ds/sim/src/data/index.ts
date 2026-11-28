/**
 * Trial data — the §5.2 model assembled, plus pure selectors over it.
 * The selectors are the single source of every computed number the screens
 * and the Ask answers show (SA4's test asserts they match the addendum).
 */
import { DEBTS, FUNDS, MOVEMENTS, ORDERS, OTHER_PARTIES, PROJECTS, REEF } from './workspace';
import { DELIVERIES, DRIVERS, QUOTE_EXPIRY_MINUTES } from './delivery';
import { LISTINGS, NOTIFICATIONS, REVIEW_QUEUE, DRIVERS_QUEUE, REPORTS_QUEUE } from './market';
import type { FundId, Listing, Movement, Order } from './types';
import { SIM_TODAY, WEEK_END, WEEK_START } from './types';

export { PROJECTS, FUNDS, MOVEMENTS, DEBTS, ORDERS, REEF, DELIVERIES, DRIVERS, QUOTE_EXPIRY_MINUTES, LISTINGS, REVIEW_QUEUE, DRIVERS_QUEUE, REPORTS_QUEUE, NOTIFICATIONS, OTHER_PARTIES };
export { SIM_TODAY, WEEK_START, WEEK_END };
export type * from './types';

/** The movement's signed effect on a fund (fils). Transfers touch two funds. */
export function movementEffectOnFund(m: Movement, fund: FundId): number {
  if (!m.saved) return 0;
  if (m.type === 'in' && m.fund === fund) return m.amount;
  if (m.type === 'out' && m.fund === fund) return -m.amount;
  if (m.type === 'transfer') {
    if (m.from === fund) return -m.amount;
    if (m.to === fund) return m.amount;
  }
  return 0;
}

/** All movements that touch a fund (saved only — drafts never count). */
export function movementsOfFund(movements: readonly Movement[], fund: FundId): Movement[] {
  return movements.filter((m) => m.saved && movementEffectOnFund(m, fund) !== 0);
}

/** The fund's balance = the exact sum of its movements (§5.2.2's rule). */
export function fundBalance(movements: readonly Movement[], fund: FundId): number {
  return movements.reduce((sum, m) => sum + movementEffectOnFund(m, fund), 0);
}

/** The total across the three funds (§5.2.2: 595.500 د). */
export function totalBalance(movements: readonly Movement[]): number {
  return FUNDS.reduce((sum, f) => sum + fundBalance(movements, f.id), 0);
}

/** Income (type 'in') between two ISO dates inclusive. */
export function incomeBetween(movements: readonly Movement[], from: string, to: string): { total: number; count: number } {
  const rows = movements.filter((m) => m.saved && m.type === 'in' && m.date >= from && m.date <= to);
  return { total: rows.reduce((s, m) => s + m.amount, 0), count: rows.length };
}

/** Spending (type 'out') between two ISO dates inclusive. */
export function outBetween(movements: readonly Movement[], from: string, to: string): { total: number; count: number } {
  const rows = movements.filter((m) => m.saved && m.type === 'out' && m.date >= from && m.date <= to);
  return { total: rows.reduce((s, m) => s + m.amount, 0), count: rows.length };
}

/** The previous calendar week (15/11–21/11) relative to the fixed week. */
export const PREV_WEEK_START = '2026-11-15';
export const PREV_WEEK_END = '2026-11-21';

/** Daily income for the current week, Sunday → Friday (§5.2.3's per-day values). */
export function incomeByDay(movements: readonly Movement[]): Array<{ date: string; total: number }> {
  const days: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(`${WEEK_START}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days.map((date) => ({
    date,
    total: movements
      .filter((m) => m.saved && m.type === 'in' && m.date === date)
      .reduce((s, m) => s + m.amount, 0),
  }));
}

/** End-of-day TOTAL balances for 21/11 → 27/11 (§5.2.3's reference list). */
export function endOfDayBalances(movements: readonly Movement[]): Array<{ date: string; balance: number }> {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(`${PREV_WEEK_END}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days.map((date) => ({
    date,
    balance: movements.reduce((sum, m) => {
      if (!m.saved || m.date > date) return sum;
      return (
        sum +
        FUNDS.reduce((s, f) => s + movementEffectOnFund(m, f.id), 0)
      );
    }, 0),
  }));
}

/** November totals: income, spending and its movement count (§5.2.3). */
export function monthStats(movements: readonly Movement[]): { income: number; out: number; outCount: number } {
  const rows = movements.filter((m) => m.saved && m.date >= '2026-11-01' && m.date <= '2026-11-30');
  const inRows = rows.filter((m) => m.type === 'in');
  const outRows = rows.filter((m) => m.type === 'out');
  return {
    income: inRows.reduce((s, m) => s + m.amount, 0),
    out: outRows.reduce((s, m) => s + m.amount, 0),
    outCount: outRows.length,
  };
}

/** Per-party income totals (س8's answer ranks them). */
export function partyIncomeTotals(movements: readonly Movement[]): Array<{ party: string; total: number; movements: string[] }> {
  const map = new Map<string, { total: number; movements: string[] }>();
  for (const m of movements) {
    if (!m.saved || m.type !== 'in' || !m.party) continue;
    const entry = map.get(m.party) ?? { total: 0, movements: [] };
    entry.total += m.amount;
    entry.movements.push(m.id);
    map.set(m.party, entry);
  }
  return [...map.entries()]
    .map(([party, v]) => ({ party, total: v.total, movements: [...v.movements] }))
    .sort((a, b) => b.total - a.total);
}

/** The debts summary (§5.2.4's DebtSummary numbers). */
export function debtsSummary(debts: readonly {
  side: 'forYou' | 'againstYou';
  remaining: number;
  settled: boolean;
  overdue: boolean;
}[]): { forYou: number; forYouParties: number; againstYou: number; againstYouParties: number } {
  const open = debts.filter((d) => !d.settled);
  const forYou = open.filter((d) => d.side === 'forYou');
  const against = open.filter((d) => d.side === 'againstYou');
  return {
    forYou: forYou.reduce((s, d) => s + d.remaining, 0),
    forYouParties: forYou.length,
    againstYou: against.reduce((s, d) => s + d.remaining, 0),
    againstYouParties: against.length,
  };
}

/** Orders of one project. */
export function ordersOf(orders: readonly Order[], project: 'yasmine' | 'reef'): Order[] {
  return orders.filter((o) => o.project === project);
}

/** The market's VISIBLE listings for buyers (§5.2.7): ع1 ع2 ع4(المنشورة) ع6 ع7 = 5. */
export function visibleListings(listings: readonly Listing[]): Listing[] {
  // جولة المستخدم: «أوقف العرض» يخفيه عن كل المشترين دون حذفه.
  return listings.filter(
    (l) => !l.stopped && (l.status === 'approved' || l.status === 'approvedWithEdit'),
  );
}

/** «يحتاجك» of the project-today screen, in the addendum's fixed order. */
export function todayNeedsYou(): { kind: string; ref: string; reason: string }[] {
  return [
    { kind: 'quote', ref: 'ت1', reason: 'عروض أسعار سارية' },
    { kind: 'order', ref: '1203', reason: 'طلبات «يحتاج مراجعة»' },
    { kind: 'debt', ref: 'د2', reason: 'ديون متأخرة' },
    { kind: 'fund', ref: 'wallet', reason: 'صناديق برصيد سالب' },
    { kind: 'order', ref: '1175', reason: 'طلبات «جاهز»' },
    { kind: 'order', ref: '1172', reason: 'طلبات «تم التسليم»' },
    { kind: 'proposal', ref: 'ت3', reason: 'مقترحات تعذّر' },
    { kind: 'draft', ref: 'draft-1', reason: 'مسودات' },
  ];
}
