/**
 * SA5 — the 17 tasks (§5.4.2): each success condition is checked on a
 * SYNTHETIC state (the journey's own ending state) and fails on the pristine
 * one; «ابدأ المهمة» resets the data, switches the role and lands on the
 * start screen; skip/succeed move «الحالية»; the progress label matches.
 */
import { describe, expect, it } from 'vitest';
import { initialState } from '../state/initial';
import { reducer } from '../state/reducer';
import type { SimAction, SimState } from '../state/types';
import { TASKS, taskBarLabel, tasksProgress } from './tasks';

const S = () => initialState();

/** Run actions over the initial state — the synthetic journey ending. */
function run(...actions: SimAction[]): SimState {
  return actions.reduce((s, a) => reducer(s, a), S());
}

/** ر2.1's ending: the exact new movement saved (27/11, not the 19/11 one). */
const R21 = run({
  type: 'movement/save',
  input: { type: 'in', fund: 'bank', amount: 145_750, party: 'سلمى الحوراني', note: 'طقم' },
});

describe('SA5 · the 17 tasks are complete and ordered', () => {
  it('there are exactly 17, ر2.1 → ر6.3', () => {
    expect(TASKS).toHaveLength(17);
    expect(TASKS[0]!.id).toBe('ر2.1');
    expect(TASKS[16]!.id).toBe('ر6.3');
    expect(TASKS.map((t) => t.id)).toEqual([
      'ر2.1', 'ر2.2', 'ر2.3', 'ر2.4',
      'ر3.1', 'ر3.2', 'ر3.3',
      'ر4.1', 'ر4.2', 'ر4.3', 'ر4.4',
      'ر5.1', 'ر5.2', 'ر5.3',
      'ر6.1', 'ر6.2', 'ر6.3',
    ]);
  });
  it('every task carries a role, a sentence, a start screen, steps and a condition', () => {
    for (const t of TASKS) {
      expect(t.role, t.id).toBeTruthy();
      expect(t.sentence, t.id).not.toBe('');
      expect(t.startScreen, t.id).toBeTruthy();
      expect(t.steps.length, t.id).toBeGreaterThan(0);
      expect(typeof t.condition, t.id).toBe('function');
    }
    // The expected errors exist exactly where the journeys list them.
    expect(TASKS.filter((t) => t.expectedErrors).length).toBe(12);
  });
  it('ر4.4 is the only two-role task (السائق ثم المالك)', () => {
    expect(TASKS.filter((t) => t.alsoOwner)).toEqual([TASKS[10]]);
    expect(TASKS[10]!.role).toBe('driver');
  });
});

describe('SA5 · every condition fails on the pristine state', () => {
  it('no condition is satisfied by the initial data alone', () => {
    for (const t of TASKS) {
      expect(t.condition(S()), `${t.id} should not hold on the initial state`).toBe(false);
    }
  });
});

describe('SA5 · each condition on its synthetic state', () => {
  it('ر2.1: a new inside movement, bank, 145.750, سلمى, today', () => {
    expect(TASKS[0]!.condition(R21)).toBe(true);
    // The journey's own trap: the 19/11 movement with the same values does not count.
    expect(
      TASKS[0]!.condition(
        run({
          type: 'movement/save',
          input: { type: 'in', fund: 'bank', amount: 145_750, party: 'سلمى الحوراني', note: 'فستان خطوبة' },
        }),
      ),
    ).toBe(true);
    // A wrong fund or amount does not count.
    expect(
      TASKS[0]!.condition(
        run({ type: 'movement/save', input: { type: 'in', fund: 'cash', amount: 145_750, party: 'سلمى الحوراني', note: 'x' } }),
      ),
    ).toBe(false);
  });
  it('ر2.2: a NEW transfer cash → bank 45 (the original ح21 never counts)', () => {
    const s = run({ type: 'movement/save', input: { type: 'transfer', from: 'cash', to: 'bank', amount: 45_000, party: null, note: 'إيداع' } });
    expect(TASKS[1]!.condition(s)).toBe(true);
    expect(
      TASKS[1]!.condition(run({ type: 'movement/save', input: { type: 'transfer', from: 'bank', to: 'cash', amount: 45_000, party: null, note: 'x' } })),
    ).toBe(false);
    // The reverse direction alone never satisfies it either.
    expect(TASKS[1]!.condition(S())).toBe(false);
  });
  it('ر2.3: د1 remaining 10', () => {
    expect(TASKS[2]!.condition(run({ type: 'debt/pay', debtId: 'د1', amount: 35_000, fund: 'cash' }))).toBe(true);
  });
  it('ر2.4: amounts hidden', () => {
    expect(TASKS[3]!.condition(run({ type: 'amountsHidden/set', hidden: true }))).toBe(true);
  });
  it('ر3.1: the new order, مؤكد or اتفاق مبدئي', () => {
    const base = { customer: 'سلمى الحوراني', content: 'فستان سهرة', price: 45_000, dueDate: '2026-11-28', time: '16:00', durationMinutes: null };
    expect(TASKS[4]!.condition(run({ type: 'order/save', input: { ...base, status: 'confirmed' } }))).toBe(true);
    expect(TASKS[4]!.condition(run({ type: 'order/save', input: { ...base, status: 'tentative' } }))).toBe(true);
    // Without a price it stays a draft → the condition does not hold.
    expect(TASKS[4]!.condition(run({ type: 'order/save', input: { ...base, price: null, status: 'confirmed' } }))).toBe(false);
    // The ORIGINAL 1175 (same values, dated 27/11) never satisfies it.
    expect(TASKS[4]!.condition(S())).toBe(false);
  });
  it('ر3.2: the calendar open with 28/11 selected', () => {
    const s = run({ type: 'ui/navigate', screen: 'ordersCalendar' }, { type: 'ui/selectDate', date: '2026-11-28' });
    expect(TASKS[5]!.condition(s)).toBe(true);
    expect(TASKS[5]!.condition(run({ type: 'ui/navigate', screen: 'ordersCalendar' }))).toBe(false);
  });
  it('ر3.3: 1175 delivered', () => {
    expect(TASKS[6]!.condition(run({ type: 'order/deliver', id: '1175' }))).toBe(true);
  });
  it('ر4.1: the new delivery to حي معصوم, عمر, today 4:00 م, awaiting quote', () => {
    const s = run({
      type: 'delivery/create',
      input: { from: 'طبربور', to: 'الزرقاء، حي معصوم', date: '2026-11-27', time: '16:00', content: 'كرتونتان', driver: 'عمر الزعبي' },
    });
    expect(TASKS[7]!.condition(s)).toBe(true);
    expect(
      TASKS[7]!.condition(run({ type: 'delivery/create', input: { from: 'طبربور', to: 'مرج الحمام', date: '2026-11-27', time: '16:00', content: 'x', driver: 'عمر الزعبي' } })),
    ).toBe(false);
  });
  it('ر4.2: ت1 accepted with the 3 د quote', () => {
    expect(TASKS[8]!.condition(run({ type: 'quote/accept', deliveryId: 'ت1' }))).toBe(true);
  });
  it('ر4.3: ت3 done with photo evidence', () => {
    const s = run(
      { type: 'quote/accept', deliveryId: 'ت3' },
      { type: 'delivery/start', deliveryId: 'ت3' },
      { type: 'delivery/complete', deliveryId: 'ت3', evidence: 'photo' },
    );
    expect(TASKS[9]!.condition(s)).toBe(true);
    // ت3 already rides قيد التنفيذ in the original data, so completing it
    // with the photo right away is the journey itself; without evidence the
    // completion never lands (the reducer refuses) and the condition stays false.
    expect(TASKS[9]!.condition(run({ type: 'delivery/complete', deliveryId: 'ت3', evidence: 'photo' }))).toBe(true);
    const noEvidence = S();
    noEvidence.deliveries = noEvidence.deliveries.map((d) =>
      d.id === 'ت3' ? { ...d, evidenceProvided: null } : d,
    );
    expect(TASKS[9]!.condition(noEvidence)).toBe(false);
  });
  it('ر4.4: تعذّر on ت3 approved by the owner (closed)', () => {
    const s = run(
      { type: 'issue/propose', deliveryId: 'ت3', reason: 'المستلم لا يرد', action: 'الاتصال لاحقًا' },
      { type: 'issue/resolve', deliveryId: 'ت3', approve: true },
    );
    expect(TASKS[10]!.condition(s)).toBe(true);
    // The proposal without the owner approval is NOT enough (السائق لا يغلقها وحده).
    expect(TASKS[10]!.condition(run({ type: 'issue/propose', deliveryId: 'ت3', reason: 'x', action: 'y' }))).toBe(false);
  });
  it('ر5.1: دخول تجريبي done with ع1 details open', () => {
    const s = run({ type: 'role/enter', role: 'guest' }, { type: 'role/guestLogin' }, { type: 'ui/openListing', id: 'ع1' });
    expect(TASKS[11]!.condition(s)).toBe(true);
    // Logged in but the details closed → not yet.
    expect(TASKS[11]!.condition(run({ type: 'role/enter', role: 'guest' }, { type: 'role/guestLogin' }))).toBe(false);
    // Details open without logging in → not yet.
    expect(TASKS[11]!.condition(run({ type: 'role/enter', role: 'guest' }, { type: 'ui/openListing', id: 'ع1' }))).toBe(false);
  });
  it('ر5.2: a new listing under review with three tiers', () => {
    const s = run({
      type: 'listing/create',
      input: {
        title: 'طحين أبيض 25 كغ',
        unit: 'كيس',
        imageCount: 3,
        tiers: [
          { min: 1, max: 9, price: 12_000 },
          { min: 10, max: 49, price: 11_500 },
          { min: 50, max: null, price: 11_000 },
        ],
      },
    });
    expect(TASKS[12]!.condition(s)).toBe(true);
    expect(
      TASKS[12]!.condition(
        run({ type: 'listing/create', input: { title: 'x', unit: 'y', imageCount: 1, tiers: [{ min: 1, max: null, price: 1_000 }] } }),
      ),
    ).toBe(false);
  });
  it('ر5.3: the report على ع6 بمعلومات مضللة', () => {
    expect(TASKS[13]!.condition(run({ type: 'listing/report', listingId: 'ع6', reason: 'معلومات مضللة' }))).toBe(true);
    expect(TASKS[13]!.condition(run({ type: 'listing/report', listingId: 'ع7', reason: 'معلومات مضللة' }))).toBe(false);
  });
  it('ر6.1: ع8 approved', () => {
    expect(TASKS[14]!.condition(run({ type: 'listing/approve', listingId: 'ع8' }))).toBe(true);
  });
  it('ر6.2: ع3 rejected with a non-empty reason', () => {
    expect(TASKS[15]!.condition(run({ type: 'listing/reject', listingId: 'ع3', reason: 'الصور غير واضحة' }))).toBe(true);
    expect(TASKS[15]!.condition(run({ type: 'listing/reject', listingId: 'ع3', reason: ' ' }))).toBe(false);
  });
  it('ر6.3: يزن القضاة approved', () => {
    expect(TASKS[16]!.condition(run({ type: 'driver/approve', driverId: 'yazan' }))).toBe(true);
  });
});

describe('SA5 · «ابدأ المهمة» (§5.4.2)', () => {
  it('resets the data, switches the role, lands on the start screen, starts the timer', () => {
    const changed = run(
      { type: 'movement/save', input: { type: 'in', fund: 'cash', amount: 25_000, party: null, note: 'بيع' } },
      { type: 'amountsHidden/set', hidden: true },
      { type: 'role/enter', role: 'supplier' },
    );
    const started = reducer(changed, { type: 'task/start', index: 9 }); // ر4.3 — السائق
    expect(started.role).toBe('driver');
    expect(started.ui.screen).toBe('myJobs');
    // The data is back to the original.
    expect(started.movements).toHaveLength(22);
    expect(started.amountsHidden).toBe(false);
    expect(started.tasks.current).toBe(9);
    expect(started.tasks.startedAt).not.toBeNull();
    // The experimenter's tools stay: tab order, toggles, identity.
    expect(started.tabOrder).toBe('b');
    expect(started.toggles.offline).toBe(false);
  });
  it('the start screen follows the task table (ر3.3 → مشروع اليوم, ر6.3 → السائقون)', () => {
    expect(reducer(S(), { type: 'task/start', index: 6 }).ui.screen).toBe('today');
    expect(reducer(S(), { type: 'task/start', index: 16 }).ui.screen).toBe('drivers');
    expect(reducer(S(), { type: 'task/start', index: 13 }).ui.screen).toBe('market');
  });
});

describe('SA5 · the tasks sheet semantics', () => {
  it('skip marks تُخطيت and the next becomes الحالية', () => {
    const s = run({ type: 'task/start', index: 0 }, { type: 'task/skip', index: 0 });
    expect(s.tasks.statuses[0]).toBe('skipped');
    expect(s.tasks.current).toBe(1);
  });
  it('succeed marks أُنجزت and advances', () => {
    const s = run({ type: 'task/start', index: 0 }, { type: 'task/succeed' });
    expect(s.tasks.statuses[0]).toBe('done');
    expect(s.tasks.current).toBe(1);
  });
  it('the last task done closes the list (no الحالية)', () => {
    let s = S();
    for (let i = 0; i < 17; i++) {
      s = reducer(s, { type: 'task/start', index: i });
      s = reducer(s, { type: 'task/succeed' });
    }
    expect(s.tasks.statuses.every((x) => x === 'done')).toBe(true);
    expect(s.tasks.current).toBeNull();
    expect(taskBarLabel(TASKS, s.tasks.current, s.tasks.statuses)).toBe('المهام');
  });
  it('taps and errors record in memory while a task runs', () => {
    const s = run(
      { type: 'task/start', index: 0 },
      { type: 'task/record', taps: 1 },
      { type: 'task/record', taps: 1 },
      { type: 'task/record', errors: 1 },
    );
    expect(s.tasks.taps).toBe(2);
    expect(s.tasks.errors).toBe(1);
  });
});

describe('SA5 · the progress label (§5.4.1)', () => {
  it('«3/17 · <جملة المهمة>» — the bar shows the done count with the current sentence', () => {
    let s = S();
    s = reducer(s, { type: 'task/start', index: 0 });
    expect(taskBarLabel(TASKS, s.tasks.current, s.tasks.statuses)).toBe('0/17 · سجّل بيعاً بـ145.750 د دخل الحساب البنكي من سلمى الحوراني');
    s = reducer(s, { type: 'task/succeed' });
    s = reducer(s, { type: 'task/succeed', index: 1 });
    s = reducer(s, { type: 'task/start', index: 2 });
    expect(taskBarLabel(TASKS, s.tasks.current, s.tasks.statuses)).toBe('2/17 · سجّل دفعة 35 د من دين سلمى الحوراني');
    expect(tasksProgress(s.tasks.statuses)).toBe(2);
  });
});
