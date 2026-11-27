/**
 * The application state — ONE store (SA3), plain data, reducer-driven.
 * Every action the simulation can perform (the addendum's §5.4 flows, the
 * §9.أ journeys with the §4 corrections) is an action here; the screens only
 * dispatch. What the experimenter records persists on the device (owner
 * decision 2) through state/storage.ts.
 */
import type {
  Debt,
  Delivery,
  Driver,
  FundId,
  Listing,
  Movement,
  Order,
  ProjectId,
  ReviewItem,
  SimNotification,
  SimRole,
} from '../data/types';

/** The simulation toggles (addendum §5.7 item 2 — amounts hidden rides its own field). */
export interface SimToggles {
  /** بلا اتصال — every save fails and stays a draft. */
  offline: boolean;
  /** تحميل بطيء — every screen/sheet open waits sim.slow-ms with a skeleton. */
  slow: boolean;
  /** خطأ في الحفظ — every save fails while on. */
  saveError: boolean;
  /** وضع السائق — density="large" everywhere, all roles. */
  driverMode: boolean;
  /** خط 200% — root font scale 200% (bound to the identity panel's font scale). */
  font200: boolean;
}

/** The identity panel's live overrides (§5.6) — applied in memory only. */
export interface IdentityOverrides {
  brandAnchor: string | null;
  brandText: string | null;
  brandData: string | null;
  brandSignal: string | null;
  canvas: string | null;
  /** sim.radius-scale: 0.5 / 1 / 1.5. */
  radiusScale: number;
  /** sim.density-scale: 0.75 / 1 / 1.25. */
  densityScale: number;
  /** 100 / 150 / 200 (%). */
  fontScale: number;
}

/** The store. */
export interface SimState {
  /** The data version this snapshot was written by (storage migration gate). */
  version: number;
  /** The chosen role; 'guest' = the visitor shell, null = the role screen. */
  role: SimRole | null;
  /** The owner's active project (switching projects §04). */
  project: ProjectId;
  /** The guest pressed «دخول تجريبي» → a registered buyer with no project (§5.1/§5.8). */
  buyer: boolean;
  /** Amounts hidden (ر2.4) — persists across sections and reopens. */
  amountsHidden: boolean;
  movements: Movement[];
  debts: Debt[];
  orders: Order[];
  deliveries: Delivery[];
  drivers: Driver[];
  listings: Listing[];
  reviewQueue: ReviewItem[];
  reportsQueue: ReviewItem[];
  driversQueue: ReviewItem[];
  notifications: SimNotification[];
  /** التبويبات (§5.7 item 4): أ = اليوم أولاً، ب = مشروع اليوم في الوسط (default). */
  tabOrder: 'a' | 'b';
  toggles: SimToggles;
  identity: IdentityOverrides;
}

/** What a new movement's save carries (ر2.1/ر2.2 and the Ask drafts س6/س7). */
export interface MovementInput {
  type: Movement['type'];
  fund?: FundId;
  from?: FundId;
  to?: FundId;
  amount: number;
  party: string | null;
  note: string;
}

/** What a new order's save carries (ر3.1 with §2.2.5's three states). */
export interface OrderInput {
  customer: string;
  content: string;
  price: number | null;
  dueDate: string | null;
  time: string | null;
  durationMinutes: number | null;
  /** The sheet's own SegmentedControl: مؤكد (default) or اتفاق مبدئي (§2.2.5). */
  status: 'confirmed' | 'tentative';
}

/** What a new delivery request carries (ر4.1). */
export interface DeliveryInput {
  from: string;
  to: string;
  date: string;
  time: string | null;
  content: string;
  driver: string;
}

/** What a new listing carries (ر5.2). */
export interface ListingInput {
  title: string;
  unit: string;
  imageCount: number;
  tiers: ReadonlyArray<{ min: number; max: number | null; price: number }>;
}

export type SimAction =
  | { type: 'role/enter'; role: SimRole }
  | { type: 'role/guestLogin' }
  | { type: 'role/change'; role: SimRole }
  | { type: 'project/switch'; project: ProjectId }
  | { type: 'amountsHidden/set'; hidden: boolean }
  | { type: 'movement/save'; input: MovementInput }
  | { type: 'draft/save' }
  | { type: 'draft/discard' }
  | { type: 'order/save'; input: OrderInput }
  | { type: 'order/deliver'; id: string }
  | { type: 'debt/pay'; debtId: string; amount: number; fund: FundId }
  | { type: 'delivery/create'; input: DeliveryInput }
  | { type: 'quote/submit'; deliveryId: string; amount: number }
  | { type: 'quote/accept'; deliveryId: string }
  | { type: 'delivery/start'; deliveryId: string }
  | { type: 'delivery/complete'; deliveryId: string; evidence: 'photo' }
  | { type: 'issue/propose'; deliveryId: string; reason: string; action: string }
  | { type: 'issue/resolve'; deliveryId: string; approve: boolean }
  | { type: 'listing/create'; input: ListingInput }
  | { type: 'listing/report'; listingId: string; reason: string }
  | { type: 'listing/approve'; listingId: string }
  | { type: 'listing/reject'; listingId: string; reason: string }
  | { type: 'edit/approve'; listingId: string }
  | { type: 'driver/approve'; driverId: string }
  | { type: 'notification/read'; key: SimNotification['key']; object: string }
  | { type: 'tabOrder/set'; order: 'a' | 'b' }
  | { type: 'toggles/set'; patch: Partial<SimToggles> }
  | { type: 'identity/set'; patch: Partial<IdentityOverrides> }
  | { type: 'data/reset' };
