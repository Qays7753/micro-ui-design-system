/**
 * The initial state — §5.2 verbatim, assembled by the data module, plus the
 * neutral shell defaults (role screen, tab order ب, everything off).
 */
import { DEBTS, DELIVERIES, DRIVERS, LISTINGS, MOVEMENTS, NOTIFICATIONS, ORDERS, DRIVERS_QUEUE, REPORTS_QUEUE, REVIEW_QUEUE } from '../data';
import type { SimState, TasksState, UiState } from './types';

export function initialUi(): UiState {
  return { screen: 'today', selectedDate: null, openListing: null, sheet: null };
}

export function initialTasks(): TasksState {
  return { current: null, statuses: Array(17).fill(null), startedAt: null, taps: 0, errors: 0 };
}

export function initialState(): SimState {
  return {
    version: 1,
    role: null,
    project: 'yasmine',
    buyer: false,
    amountsHidden: false,
    movements: MOVEMENTS.map((m) => ({ ...m })),
    debts: DEBTS.map((d) => ({ ...d })),
    orders: ORDERS.map((o) => ({ ...o })),
    deliveries: DELIVERIES.map((d) => ({ ...d, quotes: d.quotes.map((q) => ({ ...q })) })),
    drivers: DRIVERS.map((d) => ({ ...d, areas: [...d.areas], attachments: [...d.attachments] })),
    listings: LISTINGS.map((l) => ({
      ...l,
      tiers: l.tiers?.map((t) => ({ ...t })),
      reports: l.reports ? [...l.reports] : undefined,
    })),
    reviewQueue: REVIEW_QUEUE.map((r) => ({ ...r })),
    reportsQueue: REPORTS_QUEUE.map((r) => ({ ...r })),
    driversQueue: DRIVERS_QUEUE.map((r) => ({ ...r })),
    notifications: NOTIFICATIONS.map((n) => ({ ...n })),
    tabOrder: 'b',
    toggles: { offline: false, slow: false, saveError: false, driverMode: false, font200: false },
    identity: {
      brandAnchor: null,
      brandText: null,
      brandData: null,
      brandSignal: null,
      canvas: null,
      radiusScale: 1,
      densityScale: 1,
      fontScale: 100,
    },
    ui: initialUi(),
    tasks: initialTasks(),
  };
}
