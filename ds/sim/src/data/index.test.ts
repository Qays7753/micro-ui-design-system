/**
 * SA2 — the trial data (addendum §5.2) as the project model. The tests assert
 * the addendum's own arithmetic: every fund balance equals the exact sum of
 * its movements, the total is 595.500 د, the wallet is −3 د, and the
 * reference values the screens and Ask answers quote all hold.
 */
import { describe, expect, it } from 'vitest';
import {
  DEBTS,
  FUNDS,
  LISTINGS,
  MOVEMENTS,
  ORDERS,
  SIM_TODAY,
  debtsSummary,
  endOfDayBalances,
  fundBalance,
  incomeBetween,
  incomeByDay,
  monthStats,
  outBetween,
  partyIncomeTotals,
  totalBalance,
  visibleListings,
} from './index';
import { PREV_WEEK_END, PREV_WEEK_START, WEEK_END, WEEK_START } from './index';

const FILS = {
  cash: 271_250,
  bank: 327_250,
  wallet: -3_000,
  total: 595_500,
  weekIn: 294_750,
  weekInCount: 7,
  prevWeekIn: 310_750,
  weekOut: 92_500,
  weekOutCount: 5,
  monthIn: 1_055_500,
  monthOut: 460_000,
  monthOutCount: 8,
  forYou: 57_500,
  againstYou: 1_280_000,
} as const;

describe('SA2 · funds: balance = the exact sum of its movements', () => {
  it('cash is 271.250 د', () => {
    expect(FUNDS.find((f) => f.id === 'cash')!.name).toBe('درج الكاش');
    expect(fundBalance(MOVEMENTS, 'cash')).toBe(FILS.cash);
  });
  it('bank is 327.250 د', () => {
    expect(fundBalance(MOVEMENTS, 'bank')).toBe(FILS.bank);
  });
  it('wallet is −3 د (a negative fund)', () => {
    expect(fundBalance(MOVEMENTS, 'wallet')).toBe(FILS.wallet);
    expect(FILS.wallet).toBe(-3_000);
  });
  it('the transfer counts once out of cash and once into bank', () => {
    const transfer = MOVEMENTS.find((m) => m.id === 'ح21')!;
    expect(transfer.type).toBe('transfer');
    const cashWith = fundBalance(MOVEMENTS, 'cash');
    const bankWith = fundBalance(MOVEMENTS, 'bank');
    const movementsWithOutTransfer = MOVEMENTS.filter((m) => m.id !== 'ح21');
    expect(fundBalance(movementsWithOutTransfer, 'cash') - 45_000).toBe(cashWith);
    expect(fundBalance(movementsWithOutTransfer, 'bank') + 45_000).toBe(bankWith);
  });
});

describe('SA2 · the total and the fixed date', () => {
  it('the total across the three funds is 595.500 د', () => {
    expect(totalBalance(MOVEMENTS)).toBe(FILS.total);
  });
  it('the simulation date is fixed at Friday 27/11/2026', () => {
    expect(SIM_TODAY).toBe('2026-11-27');
    expect(new Date(`${SIM_TODAY}T12:00:00Z`).getUTCDay()).toBe(5); // Friday
    expect(WEEK_START).toBe('2026-11-22'); // Sunday, weekStart = 0
    expect(WEEK_END).toBe('2026-11-28');
  });
});

describe('SA2 · the unsaved draft never counts', () => {
  it('the draft is out, cash, 7 د, «طباعة», and saved = false', () => {
    const draft = MOVEMENTS.find((m) => !m.saved)!;
    expect(draft.type).toBe('out');
    expect(draft.fund).toBe('cash');
    expect(draft.amount).toBe(7_000);
    expect(draft.note).toBe('طباعة');
  });
  it('removing it changes no balance (it was never inside)', () => {
    const without = MOVEMENTS.filter((m) => m.saved);
    expect(fundBalance(without, 'cash')).toBe(FILS.cash);
    expect(totalBalance(without)).toBe(FILS.total);
  });
});

describe('SA2 · §5.2.3 reference values', () => {
  it('this week (22–27/11) income is 294.750 د from 7 movements', () => {
    const r = incomeBetween(MOVEMENTS, WEEK_START, SIM_TODAY);
    expect(r.total).toBe(FILS.weekIn);
    expect(r.count).toBe(FILS.weekInCount);
  });
  it('last week (15–21/11) income is 310.750 د, so the diff is −5%', () => {
    const r = incomeBetween(MOVEMENTS, PREV_WEEK_START, PREV_WEEK_END);
    expect(r.total).toBe(FILS.prevWeekIn);
    const diff = (FILS.weekIn - FILS.prevWeekIn) / FILS.prevWeekIn;
    expect(Math.round(diff * 100)).toBe(-5);
  });
  it('this week spending is 92.500 د from 5 movements', () => {
    const r = outBetween(MOVEMENTS, WEEK_START, SIM_TODAY);
    expect(r.total).toBe(FILS.weekOut);
    expect(r.count).toBe(FILS.weekOutCount);
  });
  it('daily income: Sun 30, Mon 2.250, Tue 0, Wed 35, Thu 175, Fri 52.500', () => {
    expect(incomeByDay(MOVEMENTS).map((d) => d.total)).toEqual([
      30_000,
      2_250,
      0,
      35_000,
      175_000,
      52_500,
    ]);
  });
  it('end-of-day totals: 393.250 400.250 357.500 357.500 392.500 564.500 595.500', () => {
    expect(endOfDayBalances(MOVEMENTS).map((d) => d.balance)).toEqual([
      393_250,
      400_250,
      357_500,
      357_500,
      392_500,
      564_500,
      595_500,
    ]);
  });
  it('November: income 1,055.500 د, spending 460 د from 8 movements', () => {
    const m = monthStats(MOVEMENTS);
    expect(m.income).toBe(FILS.monthIn);
    expect(m.out).toBe(FILS.monthOut);
    expect(m.outCount).toBe(FILS.monthOutCount);
  });
  it('top payer: رنا العبادي 630 د from ح1 ح7 ح10 ح16', () => {
    const top = partyIncomeTotals(MOVEMENTS)[0];
    expect(top.party).toBe('رنا العبادي');
    expect(top.total).toBe(630_000);
    expect(top.movements).toEqual(['ح1', 'ح7', 'ح10', 'ح16']);
    expect(partyIncomeTotals(MOVEMENTS).map((p) => p.total)).toEqual([630_000, 242_500, 180_750]);
  });
});

describe('SA2 · debts summary', () => {
  it('لك 57.500 د from two customers, عليك 1,280 د from one supplier', () => {
    const s = debtsSummary(DEBTS);
    expect(s.forYou).toBe(FILS.forYou);
    expect(s.forYouParties).toBe(2);
    expect(s.againstYou).toBe(FILS.againstYou);
    expect(s.againstYouParties).toBe(1);
  });
  it('د1: سلمى remaining 45, د2 overdue, د4 settled', () => {
    expect(DEBTS.find((d) => d.id === 'د1')!.remaining).toBe(45_000);
    expect(DEBTS.find((d) => d.id === 'د2')!.overdue).toBe(true);
    expect(DEBTS.find((d) => d.id === 'د4')!.settled).toBe(true);
  });
});

describe('SA2 · orders and the week strip counts', () => {
  it('12 workshop orders; 1190 is a draft missing price and date', () => {
    expect(ORDERS.filter((o) => o.project === 'yasmine')).toHaveLength(12);
    const draft = ORDERS.find((o) => o.id === '1190')!;
    expect(draft.status).toBe('draft');
    expect(draft.price).toBeNull();
    expect(draft.dueDate).toBeNull();
    expect(draft.missing).toEqual(['السعر', 'الموعد']);
  });
  it('week items: Thu 26 one, Fri 27 two, Sat 28 two', () => {
    const byDate = (d: string) => ORDERS.filter((o) => o.project === 'yasmine' && o.dueDate === d);
    expect(byDate('2026-11-26')).toHaveLength(1);
    expect(byDate('2026-11-27')).toHaveLength(2);
    expect(byDate('2026-11-28')).toHaveLength(2);
  });
});

describe('SA2 · the market shows 5 listings', () => {
  it('visible: ع1 ع2 ع4 ع6 ع7; ع3 ع5 ع8 hidden', () => {
    const ids = visibleListings(LISTINGS).map((l) => l.id);
    expect(ids).toEqual(['ع1', 'ع2', 'ع4', 'ع6', 'ع7']);
  });
  it('ع2 carries the three price tiers', () => {
    const t = LISTINGS.find((l) => l.id === 'ع2')!.tiers!;
    expect(t.map((x) => x.price)).toEqual([2_500, 2_250, 2_000]);
    expect(t[2].max).toBeNull();
  });
  it('ع4 is approved with a 2.750 edit under review; ع5 rejected', () => {
    const p4 = LISTINGS.find((l) => l.id === 'ع4')!;
    expect(p4.status).toBe('approvedWithEdit');
    expect(p4.editedPrice).toBe(2_750);
    const p5 = LISTINGS.find((l) => l.id === 'ع5')!;
    expect(p5.status).toBe('rejected');
    expect(p5.rejectReason).toBe('الصور غير واضحة');
  });
});
