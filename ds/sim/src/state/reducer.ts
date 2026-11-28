/**
 * The reducer — every action the simulation performs, pure. The journeys'
 * own expected errors live here as safe no-ops (the UI validates first; the
 * reducer never trusts its input twice): a transfer between the same fund
 * never happens, an over-payment never lands, delivering twice is recorded
 * once, and accepting one quote retires the others (السؤال 12).
 */
import { SIM_TODAY } from '../data';
import type { Delivery, Listing, Movement, Order } from '../data/types';
import { initialState, initialTasks, initialUi } from './initial';
import { TASKS } from '../tasks/tasks';
import type { SimAction, SimState } from './types';

const nowTime = (): string => '12:30';

/** Next movement id: حN above the highest existing حN. */
function nextMovementId(movements: readonly Movement[]): string {
  const max = movements.reduce((m, x) => {
    if (!x.id.startsWith('ح')) return m;
    const n = Number.parseInt(x.id.slice(1), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ح${max + 1}`;
}

/** Next order id for the active project (1210 → 1211). */
export function nextOrderId(orders: readonly Order[], project: SimState['project']): string {
  const max = orders.reduce((m, o) => {
    if (o.project !== project) return m;
    const n = Number.parseInt(o.id, 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return String(max + 1);
}

/** Next delivery id: تN above the highest existing تN. */
function nextDeliveryId(deliveries: readonly Delivery[]): string {
  const max = deliveries.reduce((m, d) => {
    const n = Number.parseInt(d.id.replace('ت', ''), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ت${max + 1}`;
}

/** Next listing id: عN above the highest existing عN. */
function nextListingId(listings: readonly Listing[]): string {
  const max = listings.reduce((m, l) => {
    const n = Number.parseInt(l.id.replace('ع', ''), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ع${max + 1}`;
}

export function reducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    // ── Roles and project ────────────────────────────────────────────────
    case 'role/enter':
      return { ...state, role: action.role, buyer: false };
    case 'role/guestLogin':
      return { ...state, buyer: true };
    case 'role/change':
      // From the sim panel: switch the role WITHOUT touching the data (§5.7 item 5).
      return { ...state, role: action.role };
    case 'role/exit':
      // «غيّر الدور» (§5.7 item 5): the role screen opens, the data STAYS.
      return { ...state, role: null, ui: initialUi() };
    case 'project/switch':
      return { ...state, project: action.project };

    // ── Amount visibility (ر2.4) ─────────────────────────────────────────
    case 'amountsHidden/set':
      return { ...state, amountsHidden: action.hidden };

    // ── Movements (ر2.1 / ر2.2; the Ask drafts س6/س7 save here too) ───────
    case 'movement/save': {
      const input = action.input;
      if (input.type === 'transfer' && (!input.from || !input.to || input.from === input.to)) return state;
      if (input.amount <= 0) return state;
      const m: Movement = {
        id: nextMovementId(state.movements),
        date: input.date ?? SIM_TODAY,
        time: nowTime(),
        type: input.type,
        fund: input.type === 'transfer' ? undefined : input.fund,
        from: input.type === 'transfer' ? input.from : undefined,
        to: input.type === 'transfer' ? input.to : undefined,
        amount: input.amount,
        party: input.party,
        note: input.note,
        saved: true,
      };
      return { ...state, movements: [...state.movements, m] };
    }
    case 'draft/save': {
      // Promoting the unsaved draft (س6: after saving the AskDraftCard the
      // movement joins the data and every balance changes).
      const draft = state.movements.find((m) => !m.saved);
      if (!draft) return state;
      const promoted: Movement = { ...draft, id: nextMovementId(state.movements), saved: true };
      return { ...state, movements: [...state.movements.filter((m) => m.id !== draft.id), promoted] };
    }
    case 'draft/discard': {
      const draft = state.movements.find((m) => !m.saved);
      if (!draft) return state;
      return { ...state, movements: state.movements.filter((m) => m.id !== draft.id) };
    }

    // ── Orders (ر3.1 with §2.2.5: complete → مؤكد default or اتفاق مبدئي;
    //    missing price → مسودة) ───────────────────────────────────────────
    case 'order/save': {
      const input = action.input;
      if (!input.customer.trim() || !input.dueDate) return state; // بلا عميل أو بلا موعد: خطأ الحقل، لا حفظ
      const missing: string[] = [];
      if (input.price === null) missing.push('السعر');
      const order: SimState['orders'][number] = {
        id: nextOrderId(state.orders, state.project),
        project: state.project,
        customer: input.customer,
        content: input.content,
        price: input.price,
        dueDate: input.dueDate,
        time: input.time,
        durationMinutes: input.durationMinutes,
        status: missing.length > 0 ? 'draft' : input.status,
        ...(missing.length > 0 ? { missing } : {}),
      };
      return { ...state, orders: [...state.orders, order] };
    }
    case 'order/deliver': {
      // ر3.3 — double fast taps are recorded once.
      const order = state.orders.find((o) => o.id === action.id);
      if (!order || order.status === 'delivered') return state;
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: 'delivered' } : o)),
      };
    }
    case 'order/status': {
      // جولة المستخدم: the owner's review of a «يحتاج مراجعة» order — the
      // only status transition the journeys need; everything else rides the
      // real cards in part B.
      const order = state.orders.find((o) => o.id === action.id);
      if (!order || order.status !== 'needsReview') return state;
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: action.status } : o)),
      };
    }

    // ── Debts (ر2.3) ──────────────────────────────────────────────────────
    case 'debt/pay': {
      const debt = state.debts.find((d) => d.id === action.debtId);
      if (!debt || debt.settled) return state;
      if (action.amount <= 0 || action.amount > debt.remaining) return state; // «اكتب مبلغاً حتى 45 د»
      const paid = debt.paid + action.amount;
      const remaining = debt.remaining - action.amount;
      const movement: Movement = {
        id: nextMovementId(state.movements),
        date: SIM_TODAY,
        time: nowTime(),
        type: 'in',
        fund: action.fund,
        amount: action.amount,
        party: debt.party,
        note: 'دفعة دين',
        linkedDebtId: debt.id,
        ...(debt.linkedOrderId ? { linkedOrderId: debt.linkedOrderId } : {}),
        saved: true,
      };
      return {
        ...state,
        movements: [...state.movements, movement],
        debts: state.debts.map((d) =>
          d.id === debt.id
            ? {
                ...d,
                paid,
                remaining,
                settled: remaining === 0,
                paidByMovement: movement.id,
              }
            : d,
        ),
      };
    }

    // ── Deliveries (ر4.1–ر4.4) ────────────────────────────────────────────
    case 'delivery/create': {
      const d: SimState['deliveries'][number] = {
        id: nextDeliveryId(state.deliveries),
        owner: state.project === 'reef' ? 'حلويات بيت الريف' : 'ورشة الياسمين',
        from: action.input.from,
        to: action.input.to,
        date: action.input.date,
        time: action.input.time,
        driver: action.input.driver,
        quotes: [],
        status: 'awaitingQuote', // «اطلب توصيلاً» → بانتظار عرض سعر
        evidence: null,
        description: action.input.content,
      };
      return { ...state, deliveries: [...state.deliveries, d] };
    }
    case 'quote/submit': {
      const d = state.deliveries.find((x) => x.id === action.deliveryId);
      if (!d || action.amount <= 0) return state;
      // A previous own quote becomes superseded (§5.6 ت4 note).
      const quotes = d.quotes.map((q) => (q.state === 'valid' ? { ...q, state: 'superseded' as const } : q));
      return {
        ...state,
        deliveries: state.deliveries.map((x) =>
          x.id === d.id
            ? {
                ...x,
                quotes: [...quotes, { amount: action.amount, time: nowTime(), state: 'valid' as const }],
                status: 'quoteArrived',
              }
            : x,
        ),
        notifications: [
          ...state.notifications,
          { key: 'quote_submitted', role: 'owner', object: d.id, time: '12:30 م', read: false },
        ],
      };
    }
    case 'quote/accept': {
      const d = state.deliveries.find((x) => x.id === action.deliveryId);
      const valid = d?.quotes.find((q) => q.state === 'valid');
      if (!d || !valid) return state;
      return {
        ...state,
        deliveries: state.deliveries.map((x) =>
          x.id === d.id
            ? {
                ...x,
                quotes: x.quotes.map((q) =>
                  q === valid
                    ? { ...q, state: 'accepted' as const }
                    : q.state === 'valid'
                      ? { ...q, state: 'superseded' as const }
                      : q,
                ),
                status: 'accepted',
              }
            : x,
        ),
        // The quote notification becomes read (ر4.2).
        notifications: state.notifications.map((n) =>
          n.key === 'quote_submitted' && n.object === d.id ? { ...n, read: true } : n,
        ),
      };
    }
    case 'delivery/start': {
      const d = state.deliveries.find((x) => x.id === action.deliveryId);
      if (!d || d.status !== 'accepted') return state;
      return {
        ...state,
        deliveries: state.deliveries.map((x) => (x.id === d.id ? { ...x, status: 'inProgress' } : x)),
      };
    }
    case 'delivery/complete': {
      const d = state.deliveries.find((x) => x.id === action.deliveryId);
      if (!d || d.status !== 'inProgress' || !d.evidence) return state;
      // ر4.3: the slide without the photo is disabled at the UI; the reducer
      // requires the evidence the flow demanded.
      return {
        ...state,
        deliveries: state.deliveries.map((x) =>
          x.id === d.id ? { ...x, status: 'done', evidenceProvided: action.evidence } : x,
        ),
      };
    }
    case 'issue/propose': {
      const d = state.deliveries.find((x) => x.id === action.deliveryId);
      if (!d || d.status !== 'inProgress') return state;
      return {
        ...state,
        deliveries: state.deliveries.map((x) =>
          x.id === d.id
            ? { ...x, status: 'failed', description: `${x.description ?? ''} · تعذّر: ${action.reason} — ${action.action}`.replace(/^ · /, '') }
            : x,
        ),
        notifications: [
          ...state.notifications,
          { key: 'status_changed', role: 'owner', object: d.id, time: '12:30 م', read: false },
        ],
      };
    }
    case 'issue/resolve': {
      const d = state.deliveries.find((x) => x.id === action.deliveryId);
      if (!d || d.status !== 'failed') return state;
      // Approval closes the mission (تعذّر مُقفل — ر4.4);
      // refusal returns it to the driver to retry (قيد التنفيذ).
      return {
        ...state,
        deliveries: state.deliveries.map((x) =>
          x.id === d.id ? { ...x, status: action.approve ? 'failed' : 'inProgress', issueClosed: action.approve ? true : x.issueClosed } : x,
        ),
      };
    }

    // ── Market (ر5.2 / ر5.3) ──────────────────────────────────────────────
    case 'listing/create': {
      const l: SimState['listings'][number] = {
        id: nextListingId(state.listings),
        supplier: 'مخبز الأصيل للجملة',
        title: action.input.title,
        price: null,
        tiers: action.input.tiers.map((t) => ({ ...t })),
        availability: 'available',
        qty: null,
        status: 'underReview',
        since: 'الآن',
        imageCount: action.input.imageCount,
        governorate: 'إربد',
        category: 'مخبوزات',
        minOrder: '—',
      };
      return { ...state, listings: [...state.listings, l] };
    }
    case 'listing/edit': {
      // جولة المستخدم: the supplier edits a published price — the edit goes
      // to the review queue exactly like ع4's baked-in edit.
      const l = state.listings.find((x) => x.id === action.listingId);
      if (!l || !Number.isFinite(action.price) || action.price <= 0 || l.status !== 'approved') return state;
      return {
        ...state,
        listings: state.listings.map((x) =>
          x.id === l.id ? { ...x, editedPrice: action.price, status: 'approvedWithEdit' as const, since: 'الآن' } : x,
        ),
        reviewQueue: [...state.reviewQueue, { kind: 'listingEdit' as const, ref: l.id, since: 'الآن' }],
      };
    }
    case 'listing/report': {
      const l = state.listings.find((x) => x.id === action.listingId);
      if (!l || !action.reason.trim()) return state;
      return {
        ...state,
        listings: state.listings.map((x) =>
          x.id === l.id ? { ...x, reports: [...(x.reports ?? []), action.reason] } : x,
        ),
      };
    }
    case 'listing/approve': {
      const l = state.listings.find((x) => x.id === action.listingId);
      if (!l) return state;
      return {
        ...state,
        listings: state.listings.map((x) => (x.id === l.id ? { ...x, status: 'approved', since: undefined } : x)),
        reviewQueue: state.reviewQueue.filter((r) => !(r.kind === 'listing' && r.ref === l.id)),
      };
    }
    case 'listing/reject': {
      const l = state.listings.find((x) => x.id === action.listingId);
      if (!l || !action.reason.trim()) return state; // الرفض بسبب غير فارغ
      return {
        ...state,
        listings: state.listings.map((x) =>
          x.id === l.id ? { ...x, status: 'rejected', rejectReason: action.reason, since: undefined } : x,
        ),
        reviewQueue: state.reviewQueue.filter((r) => !(r.kind === 'listing' && r.ref === l.id)),
      };
    }
    case 'listing/stop': {
      // جولة المستخدم (§6.4): «أبقِ العرض» clears the reports and keeps the
      // listing; «أوقف العرض» hides it from every buyer's market and tells
      // the supplier through a moderation notification.
      const l = state.listings.find((x) => x.id === action.listingId);
      if (!l) return state;
      return {
        ...state,
        listings: state.listings.map((x) =>
          x.id === l.id
            ? action.stop
              ? { ...x, stopped: true, reports: [] }
              : { ...x, stopped: false, reports: [] }
            : x,
        ),
        reportsQueue: state.reportsQueue.filter((r) => r.ref !== l.id),
        notifications: action.stop
          ? [...state.notifications, { key: 'moderation_decision' as const, role: 'supplier' as const, object: l.id, time: 'الآن', read: false }]
          : state.notifications,
      };
    }
    case 'driver/reject': {
      const driver = state.drivers.find((d) => d.id === action.driverId);
      if (!driver || driver.status !== 'pendingReview' || !action.reason.trim()) return state;
      return {
        ...state,
        drivers: state.drivers.map((d) => (d.id === driver.id ? { ...d, status: 'rejected' as const } : d)),
        driversQueue: state.driversQueue.filter((r) => r.ref !== driver.id),
      };
    }
    case 'edit/approve': {
      // ع4's edit: the published price becomes the edited one.
      const l = state.listings.find((x) => x.id === action.listingId);
      if (!l || l.editedPrice === null || l.editedPrice === undefined) return state;
      return {
        ...state,
        listings: state.listings.map((x) =>
          x.id === l.id ? { ...x, price: l.editedPrice!, editedPrice: null, status: 'approved', since: undefined } : x,
        ),
        reviewQueue: state.reviewQueue.filter((r) => !(r.kind === 'listingEdit' && r.ref === l.id)),
      };
    }
    case 'driver/approve': {
      const driver = state.drivers.find((d) => d.id === action.driverId);
      if (!driver || driver.status !== 'pendingReview') return state;
      return {
        ...state,
        drivers: state.drivers.map((d) => (d.id === driver.id ? { ...d, status: 'approved' } : d)),
        driversQueue: state.driversQueue.filter((r) => r.ref !== driver.id),
      };
    }

    // ── Notifications ─────────────────────────────────────────────────────
    case 'notification/read':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.key === action.key && n.object === action.object ? { ...n, read: true } : n,
        ),
      };

    // ── Shell settings (§5.7 / §5.6) ─────────────────────────────────────
    case 'tabOrder/set':
      return { ...state, tabOrder: action.order };
    case 'toggles/set':
      return { ...state, toggles: { ...state.toggles, ...action.patch } };
    case 'identity/set':
      return { ...state, identity: { ...state.identity, ...action.patch } };
    case 'data/reset':
      // «ابدأ من جديد» — everything back to the original (owner decision 2).
      return { ...initialState(), role: null };

    // ── Navigation (transient; the file:// single build needs no router) ───
    case 'ui/navigate':
      return { ...state, ui: { ...state.ui, screen: action.screen } };
    case 'ui/selectDate':
      return { ...state, ui: { ...state.ui, selectedDate: action.date } };
    case 'ui/openListing':
      return { ...state, ui: { ...state.ui, openListing: action.id, sheet: null } };
    case 'ui/openSheet':
      return { ...state, ui: { ...state.ui, sheet: action.id } };

    // ── The 17 tasks (§5.4.2) ───────────────────────────────────────
    case 'task/start': {
      const task = TASKS[action.index];
      if (!task) return state;
      // «ابدأ المهمة» (§5.4.2): (1) the DATA back to the original —
      // tab order, toggles and identity are the experimenter's tools and
      // stay; (2) the task's role; (3) the start screen; (5) the timer.
      const fresh = initialState();
      return {
        ...state,
        movements: fresh.movements,
        debts: fresh.debts,
        orders: fresh.orders,
        deliveries: fresh.deliveries,
        drivers: fresh.drivers,
        listings: fresh.listings,
        reviewQueue: fresh.reviewQueue,
        reportsQueue: fresh.reportsQueue,
        driversQueue: fresh.driversQueue,
        notifications: fresh.notifications,
        amountsHidden: false,
        project: 'yasmine',
        role: task.role,
        buyer: false,
        ui: { ...initialUi(), screen: task.startScreen },
        tasks: {
          ...initialTasks(),
          statuses: state.tasks.statuses,
          current: action.index,
          startedAt: Date.now(),
        },
      };
    }
    case 'task/skip': {
      if (!TASKS[action.index]) return state;
      const statuses = [...state.tasks.statuses];
      statuses[action.index] = 'skipped';
      const next = nextTaskIndex(state.tasks.statuses, action.index);
      return {
        ...state,
        tasks: { ...state.tasks, statuses, current: next, startedAt: next === null ? null : Date.now(), taps: 0, errors: 0 },
      };
    }
    case 'task/succeed': {
      const index = action.index ?? state.tasks.current;
      if (index === null || !TASKS[index]) return state;
      const statuses = [...state.tasks.statuses];
      statuses[index] = 'done';
      const next = nextTaskIndex(statuses, index);
      return {
        ...state,
        tasks: { ...state.tasks, statuses, current: next, startedAt: next === null ? null : Date.now(), taps: 0, errors: 0 },
      };
    }
    case 'task/record':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          taps: state.tasks.taps + (action.taps ?? 0),
          errors: state.tasks.errors + (action.errors ?? 0),
        },
      };

    default:
      return state;
  }
}

/** The first task after `from` with no status yet (the next «الحالية»). */
function nextTaskIndex(statuses: readonly ('done' | 'skipped' | null)[], from: number): number | null {
  for (let i = from + 1; i < statuses.length; i++) {
    if (statuses[i] === null) return i;
  }
  for (let i = 0; i < statuses.length; i++) {
    if (i !== from && statuses[i] === null) return i;
  }
  return null;
}
