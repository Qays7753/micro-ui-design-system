/**
 * SA3 — a test for every action: the flows of the addendum §5.4 and the
 * §9.أ journeys (with the §4 corrections) expressed against the reducer.
 */
import { describe, expect, it } from 'vitest';
import { fundBalance, totalBalance } from '../data';
import { initialState } from './initial';
import { reducer } from './reducer';
import type { SimAction, SimState } from './types';

function run(state: SimState, ...actions: SimAction[]): SimState {
  return actions.reduce((s, a) => reducer(s, a), state);
}

const S = () => initialState();

describe('SA3 · role and project', () => {
  it('entering a role from the picker', () => {
    const s = run(S(), { type: 'role/enter', role: 'owner' });
    expect(s.role).toBe('owner');
    expect(s.buyer).toBe(false);
  });
  it('«دخول تجريبي» turns the guest into a registered buyer (ر5.1)', () => {
    const s = run(S(), { type: 'role/enter', role: 'guest' }, { type: 'role/guestLogin' });
    expect(s.role).toBe('guest');
    expect(s.buyer).toBe(true);
  });
  it('changing the role from the panel keeps the data (§5.7 item 5)', () => {
    const s = run(
      S(),
      { type: 'role/enter', role: 'owner' },
      { type: 'movement/save', input: { type: 'out', fund: 'cash', amount: 1000, party: null, note: 'اختبار' } },
      { type: 'role/change', role: 'driver' },
    );
    expect(s.role).toBe('driver');
    expect(s.movements).toHaveLength(23); // 21 saved + draft + the new one
  });
  it('switching the project keeps the balance untouched (04)', () => {
    const s = run(S(), { type: 'project/switch', project: 'reef' });
    expect(s.project).toBe('reef');
    expect(totalBalance(s.movements)).toBe(595_500);
  });
});

describe('SA3 · amounts hidden (ر2.4)', () => {
  it('hiding persists in the state the screens read', () => {
    const s = run(S(), { type: 'amountsHidden/set', hidden: true });
    expect(s.amountsHidden).toBe(true);
    expect(s.movements).toHaveLength(22); // untouched data
  });
});

describe('SA3 · سجّل حركة (ر2.1 / ر2.2)', () => {
  it('an inside movement: the bank counts to 473.000 and the total to 741.250', () => {
    const s = run(S(), {
      type: 'movement/save',
      input: { type: 'in', fund: 'bank', amount: 145_750, party: 'سلمى الحوراني', note: 'طقم' },
    });
    expect(fundBalance(s.movements, 'bank')).toBe(327_250 + 145_750);
    expect(totalBalance(s.movements)).toBe(595_500 + 145_750);
    const added = s.movements[s.movements.length - 1]!;
    expect(added.id).toBe('ح22');
    expect(added.saved).toBe(true);
  });
  it('a transfer moves 45 between the funds and never changes the total (ر2.2)', () => {
    const s = run(S(), {
      type: 'movement/save',
      input: { type: 'transfer', from: 'cash', to: 'bank', amount: 45_000, party: null, note: 'إيداع' },
    });
    expect(fundBalance(s.movements, 'cash')).toBe(271_250 - 45_000);
    expect(fundBalance(s.movements, 'bank')).toBe(327_250 + 45_000);
    expect(totalBalance(s.movements)).toBe(595_500);
  });
  it('a transfer between the same fund never happens (9.4)', () => {
    const s = run(S(), {
      type: 'movement/save',
      input: { type: 'transfer', from: 'cash', to: 'cash', amount: 10_000, party: null, note: '' },
    });
    expect(s.movements).toHaveLength(22); // the initial 21 saved + the draft
  });
  it('a zero or negative amount is refused', () => {
    const s = run(S(), {
      type: 'movement/save',
      input: { type: 'in', fund: 'cash', amount: 0, party: null, note: '' },
    });
    expect(s.movements).toHaveLength(22);
  });
});

describe('SA3 · the draft and Ask (س6 / س7)', () => {
  it('saving the Ask draft joins the data and changes the balances (س6)', () => {
    const s = run(S(), { type: 'draft/save' });
    expect(s.movements.find((m) => !m.saved)).toBeUndefined();
    expect(fundBalance(s.movements, 'cash')).toBe(271_250 - 7_000);
    const promoted = s.movements[s.movements.length - 1]!;
    expect(promoted.note).toBe('طباعة ملصق أسعار');
    expect(promoted.saved).toBe(true);
  });
  it('discarding the draft removes it and nothing else changes', () => {
    const s = run(S(), { type: 'draft/discard' });
    expect(s.movements.find((m) => !m.saved)).toBeUndefined();
    expect(fundBalance(s.movements, 'cash')).toBe(271_250);
  });
});

describe('SA3 · طلب جديد بحالاته الثلاث (ر3.1 / §2.2.5)', () => {
  it('complete → مؤكد by default', () => {
    const s = run(S(), {
      type: 'order/save',
      input: {
        customer: 'سلمى الحوراني',
        content: 'فستان سهرة',
        price: 45_000,
        dueDate: '2026-11-28',
        time: '16:00',
        durationMinutes: null,
        status: 'confirmed',
      },
    });
    const o = s.orders[s.orders.length - 1]!;
    expect(o.status).toBe('confirmed');
    expect(o.id).toBe('1211');
    expect(o.missing).toBeUndefined();
  });
  it('the sheet can choose اتفاق مبدئي instead', () => {
    const s = run(S(), {
      type: 'order/save',
      input: {
        customer: 'سلمى الحوراني',
        content: 'فستان سهرة',
        price: 45_000,
        dueDate: '2026-11-28',
        time: '16:00',
        durationMinutes: null,
        status: 'tentative',
      },
    });
    expect(s.orders[s.orders.length - 1]!.status).toBe('tentative');
  });
  it('without a price it is saved a مسودة carrying the missing piece', () => {
    const s = run(S(), {
      type: 'order/save',
      input: {
        customer: 'سلمى الحوراني',
        content: 'فستان سهرة',
        price: null,
        dueDate: '2026-11-28',
        time: '16:00',
        durationMinutes: null,
        status: 'confirmed',
      },
    });
    const o = s.orders[s.orders.length - 1]!;
    expect(o.status).toBe('draft');
    expect(o.missing).toEqual(['السعر']);
  });
  it('without a customer or a date nothing is saved (field error)', () => {
    const a = run(S(), {
      type: 'order/save',
      input: { customer: ' ', content: 'x', price: 1_000, dueDate: '2026-11-28', time: null, durationMinutes: null, status: 'confirmed' },
    });
    // ا-12: طلبا الريف يعيشان في الحالة أيضًا — العدّ واعٍ بالمشروع (ياسمين 12)
    expect(a.orders.filter((o) => o.project === 'yasmine')).toHaveLength(12);
    const b = run(S(), {
      type: 'order/save',
      input: { customer: 'سلمى', content: 'x', price: 1_000, dueDate: null, time: null, durationMinutes: null, status: 'confirmed' },
    });
    expect(b.orders.filter((o) => o.project === 'yasmine')).toHaveLength(12);
  });
});

describe('SA3 · سجّل التسليم (ر3.3)', () => {
  it('1175 becomes تم التسليم, and two fast taps record once', () => {
    const s = run(
      S(),
      { type: 'order/deliver', id: '1175' },
      { type: 'order/deliver', id: '1175' },
    );
    expect(s.orders.find((o) => o.id === '1175')!.status).toBe('delivered');
  });
});

describe('SA3 · سجّل دفعة (ر2.3)', () => {
  it('paying 35 from د1: remaining 10, a new movement, progress extends', () => {
    const s = run(S(), { type: 'debt/pay', debtId: 'د1', amount: 35_000, fund: 'cash' });
    const d = s.debts.find((x) => x.id === 'د1')!;
    expect(d.remaining).toBe(10_000);
    expect(d.paid).toBe(70_000);
    expect(fundBalance(s.movements, 'cash')).toBe(271_250 + 35_000);
    const m = s.movements[s.movements.length - 1]!;
    expect(m.type).toBe('in');
    expect(m.party).toBe('سلمى الحوراني');
    expect(m.note).toBe('دفعة دين');
  });
  it('paying the exact remainder settles the debt', () => {
    const s = run(S(), { type: 'debt/pay', debtId: 'د1', amount: 45_000, fund: 'cash' });
    const d = s.debts.find((x) => x.id === 'د1')!;
    expect(d.settled).toBe(true);
    expect(d.remaining).toBe(0);
  });
  it('an over-payment never lands («اكتب مبلغاً حتى 45 د»)', () => {
    const s = run(S(), { type: 'debt/pay', debtId: 'د1', amount: 46_000, fund: 'cash' });
    expect(s.debts.find((x) => x.id === 'د1')!.remaining).toBe(45_000);
    expect(s.movements).toHaveLength(22);
  });
});

describe('SA3 · اطلب توصيلاً (ر4.1)', () => {
  it('a new delivery starts at بانتظار عرض سعر with the chosen driver', () => {
    const s = run(S(), {
      type: 'delivery/create',
      input: { from: 'طبربور', to: 'الزرقاء، حي معصوم', date: '2026-11-27', time: '16:00', content: 'كرتونتان', driver: 'عمر الزعبي' },
    });
    const d = s.deliveries[s.deliveries.length - 1]!;
    expect(d.id).toBe('ت5');
    expect(d.status).toBe('awaitingQuote');
    expect(d.driver).toBe('عمر الزعبي');
    expect(d.quotes).toHaveLength(0);
  });
});

describe('SA3 · العروض (ر4.2 / السؤال 12)', () => {
  it('submitting a quote on ت4: عرض سعر وصل + the owner is notified', () => {
    const s = run(S(), { type: 'quote/submit', deliveryId: 'ت4', amount: 5_000 });
    const d = s.deliveries.find((x) => x.id === 'ت4')!;
    expect(d.status).toBe('quoteArrived');
    expect(d.quotes).toHaveLength(1);
    expect(s.notifications.some((n) => n.key === 'quote_submitted' && n.object === 'ت4' && !n.read)).toBe(true);
  });
  it('a second own quote supersedes the first', () => {
    const s = run(S(), { type: 'quote/submit', deliveryId: 'ت4', amount: 5_000 }, { type: 'quote/submit', deliveryId: 'ت4', amount: 6_000 });
    const d = s.deliveries.find((x) => x.id === 'ت4')!;
    expect(d.quotes[0]!.state).toBe('superseded');
    expect(d.quotes[1]!.state).toBe('valid');
  });
  it('accepting the valid quote: مقبول, the notification read, others retired', () => {
    const s = run(S(), { type: 'quote/accept', deliveryId: 'ت1' });
    const d = s.deliveries.find((x) => x.id === 'ت1')!;
    expect(d.status).toBe('accepted');
    expect(d.quotes.find((q) => q.amount === 3_000)!.state).toBe('accepted');
    expect(d.quotes.find((q) => q.amount === 3_500)!.state).toBe('superseded');
    expect(s.notifications.find((n) => n.key === 'quote_submitted' && n.object === 'ت1')!.read).toBe(true);
  });
});

describe('SA3 · the driver mission (ر4.3 / ر4.4)', () => {
  it('start → قيد التنفيذ only after مقبول', () => {
    const a = run(S(), { type: 'delivery/start', deliveryId: 'ت1' });
    expect(a.deliveries.find((x) => x.id === 'ت1')!.status).toBe('quoteArrived');
    const b = run(S(), { type: 'quote/accept', deliveryId: 'ت1' }, { type: 'delivery/start', deliveryId: 'ت1' });
    expect(b.deliveries.find((x) => x.id === 'ت1')!.status).toBe('inProgress');
  });
  it('ت3 completes only with the photo evidence it demands', () => {
    const ok = run(S(), { type: 'delivery/complete', deliveryId: 'ت3', evidence: 'photo' });
    const d = ok.deliveries.find((x) => x.id === 'ت3')!;
    expect(d.status).toBe('done');
    expect(d.evidenceProvided).toBe('photo');
    // A delivery that demands no evidence cannot be completed this way (ت2).
    const t2 = run(S(), { type: 'delivery/complete', deliveryId: 'ت2', evidence: 'photo' });
    expect(t2.deliveries.find((x) => x.id === 'ت2')!.status).toBe('done');
  });
  it('the issue proposal: تعذّر + the owner is notified (ر4.4)', () => {
    const s = run(S(), { type: 'issue/propose', deliveryId: 'ت3', reason: 'المستلم لا يرد', action: 'إعادة المحاولة غدًا' });
    expect(s.deliveries.find((x) => x.id === 'ت3')!.status).toBe('failed');
    expect(s.notifications.some((n) => n.key === 'status_changed' && n.object === 'ت3' && !n.read)).toBe(true);
  });
  it('the owner approves → the mission closes; refuses → back to the driver', () => {
    const approve = run(S(), { type: 'issue/propose', deliveryId: 'ت3', reason: 'x', action: 'y' }, { type: 'issue/resolve', deliveryId: 'ت3', approve: true });
    expect(approve.deliveries.find((x) => x.id === 'ت3')!.status).toBe('failed');
    const refuse = run(S(), { type: 'issue/propose', deliveryId: 'ت3', reason: 'x', action: 'y' }, { type: 'issue/resolve', deliveryId: 'ت3', approve: false });
    expect(refuse.deliveries.find((x) => x.id === 'ت3')!.status).toBe('inProgress');
  });
});

describe('SA3 · السوق (ر5.2 / ر5.3)', () => {
  it('a new listing lands قيد المراجعة with its three tiers', () => {
    const s = run(S(), {
      type: 'listing/create',
      input: {
        title: 'طحين أبيض 10 كغ',
        unit: 'كيس',
        imageCount: 3,
        tiers: [
          { min: 1, max: 9, price: 3_000 },
          { min: 10, max: 49, price: 2_750 },
          { min: 50, max: null, price: 2_500 },
        ],
      },
    });
    const l = s.listings[s.listings.length - 1]!;
    expect(l.id).toBe('ع9');
    expect(l.status).toBe('underReview');
    expect(l.tiers).toHaveLength(3);
  });
  it('a report adds its reason (ر5.3)', () => {
    const s = run(S(), { type: 'listing/report', listingId: 'ع6', reason: 'معلومات مضللة' });
    expect(s.listings.find((l) => l.id === 'ع6')!.reports).toHaveLength(4);
  });
  it('a report with an empty reason never lands', () => {
    const s = run(S(), { type: 'listing/report', listingId: 'ع6', reason: ' ' });
    expect(s.listings.find((l) => l.id === 'ع6')!.reports).toHaveLength(3);
  });
});

describe('SA3 · المراجعة (ر6.1 / ر6.2 / ر6.3)', () => {
  it('approving ع8: the queue row leaves and the listing joins the market', () => {
    const s = run(S(), { type: 'listing/approve', listingId: 'ع8' });
    expect(s.listings.find((l) => l.id === 'ع8')!.status).toBe('approved');
    expect(s.reviewQueue.find((r) => r.ref === 'ع8')).toBeUndefined();
  });
  it('rejecting ع3 with a reason: مرفوض + the reason + the queue row leaves', () => {
    const s = run(S(), { type: 'listing/reject', listingId: 'ع3', reason: 'الصور غير واضحة' });
    const l = s.listings.find((x) => x.id === 'ع3')!;
    expect(l.status).toBe('rejected');
    expect(l.rejectReason).toBe('الصور غير واضحة');
    expect(s.reviewQueue.find((r) => r.ref === 'ع3')).toBeUndefined();
  });
  it('a rejection without a reason never lands', () => {
    const s = run(S(), { type: 'listing/reject', listingId: 'ع3', reason: '' });
    expect(s.listings.find((l) => l.id === 'ع3')!.status).toBe('underReview');
  });
  it('approving ع4 edit publishes 2.750 and empties its queue row', () => {
    const s = run(S(), { type: 'edit/approve', listingId: 'ع4' });
    const l = s.listings.find((x) => x.id === 'ع4')!;
    expect(l.price).toBe(2_750);
    expect(l.status).toBe('approved');
    expect(s.reviewQueue.find((r) => r.ref === 'ع4')).toBeUndefined();
  });
  it('approving the driver يزن: معتمد and the queue leaves (ر6.3)', () => {
    const s = run(S(), { type: 'driver/approve', driverId: 'yazan' });
    expect(s.drivers.find((d) => d.id === 'yazan')!.status).toBe('approved');
    expect(s.driversQueue).toHaveLength(0);
  });
});

describe('SA3 · الإشعار يصير مقروءًا (ر4.2)', () => {
  it('marking one notification read leaves the others', () => {
    const s = run(S(), { type: 'notification/read', key: 'status_changed', object: 'ت3' });
    expect(s.notifications.find((n) => n.key === 'status_changed' && n.object === 'ت3')!.read).toBe(true);
    expect(s.notifications.find((n) => n.key === 'quote_submitted' && n.object === 'ت1')!.read).toBe(false);
  });
});

describe('SA3 · إعدادات الشريط (§5.7 / §5.6)', () => {
  it('the tab order a/b switches', () => {
    expect(run(S(), { type: 'tabOrder/set', order: 'a' }).tabOrder).toBe('a');
    expect(run(S(), { type: 'tabOrder/set', order: 'b' }).tabOrder).toBe('b');
  });
  it('the sim toggles patch partially', () => {
    const s = run(S(), { type: 'toggles/set', patch: { offline: true, saveError: true } });
    expect(s.toggles.offline).toBe(true);
    expect(s.toggles.saveError).toBe(true);
    expect(s.toggles.slow).toBe(false);
  });
  it('the identity overrides patch partially', () => {
    const s = run(S(), { type: 'identity/set', patch: { radiusScale: 1.5, fontScale: 200 } });
    expect(s.identity.radiusScale).toBe(1.5);
    expect(s.identity.fontScale).toBe(200);
    expect(s.identity.brandAnchor).toBeNull();
  });
});

describe('SA3 · ابدأ من جديد (قرار المالك 2)', () => {
  it('the whole state returns to the original trial data', () => {
    const changed = run(
      S(),
      { type: 'role/enter', role: 'owner' },
      { type: 'movement/save', input: { type: 'in', fund: 'cash', amount: 50_000, party: null, note: 'بيع' } },
      { type: 'order/deliver', id: '1175' },
      { type: 'amountsHidden/set', hidden: true },
      { type: 'toggles/set', patch: { offline: true } },
    );
    const s = run(changed, { type: 'data/reset' });
    expect(s.role).toBeNull();
    expect(totalBalance(s.movements)).toBe(595_500);
    expect(s.orders.find((o) => o.id === '1175')!.status).toBe('ready');
    expect(s.amountsHidden).toBe(false);
    expect(s.toggles.offline).toBe(false);
    expect(s).toEqual(initialState());
  });
});
