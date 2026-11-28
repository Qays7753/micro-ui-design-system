/**
 * Trial data types — BATCH2-SPECS-ADDENDUM §5.2 verbatim, as the project model:
 * amounts are INTEGER FILS, dates are ISO ('YYYY-MM-DD'), and the simulation
 * clock is pinned to the fixed Friday 27/11/2026.
 */

/** The fixed simulation date (Friday 27/11/2026). */
export const SIM_TODAY = '2026-11-27';

/** The current simulation week: Sunday 22/11 → Saturday 28/11 (weekStart = 0). */
export const WEEK_START = '2026-11-22';
export const WEEK_END = '2026-11-28';

export type ProjectId = 'yasmine' | 'reef';

export interface SimProject {
  id: ProjectId;
  name: string;
  role: string;
}

export type FundId = 'cash' | 'bank' | 'wallet';

export interface Fund {
  id: FundId;
  name: string;
  /** The catalog kind: fund-cash / fund-bank / fund-wallet. */
  kind: string;
}

export type MovementType = 'in' | 'out' | 'transfer';

export interface Movement {
  /** ح1 … ح21 (the addendum's own numbering). */
  id: string;
  /** ISO date. */
  date: string;
  /** 24h clock time, e.g. '11:20'. */
  time: string;
  type: MovementType;
  /** For in/out: the one fund. For transfer: undefined. */
  fund?: FundId;
  /** For transfer: source → destination. */
  from?: FundId;
  to?: FundId;
  /** Integer fils (signed by type is NOT applied — the type carries it). */
  amount: number;
  party: string | null;
  note: string;
  linkedOrderId?: string;
  linkedDebtId?: string;
  linkedDeliveryId?: string;
  /** false = the unsaved draft (never counted in any balance or sum). */
  saved: boolean;
}

export type DebtSide = 'forYou' | 'againstYou';

export interface Debt {
  id: string;
  party: string;
  side: DebtSide;
  /** Integer fils. */
  total: number;
  paid: number;
  paidByMovement?: string;
  remaining: number;
  /** ISO date or null. */
  dueDate: string | null;
  overdue: boolean;
  settled: boolean;
  linkedOrderId?: string;
}

export type OrderStatus =
  | 'delivered' // تم التسليم
  | 'ready' // جاهز
  | 'settled' // تمت التسوية
  | 'draft' // مسودة
  | 'tentative' // اتفاق مبدئي
  | 'confirmed' // مؤكد
  | 'inProgress' // قيد التنفيذ
  | 'needsReview' // يحتاج مراجعة
  | 'postponed' // مؤجل
  | 'cancelled'; // ملغى

export interface Order {
  id: string;
  project: ProjectId;
  customer: string;
  content: string;
  /** Integer fils, null when missing. */
  price: number | null;
  /** ISO date, null when missing. */
  dueDate: string | null;
  /** 24h clock time, null when missing. */
  time: string | null;
  durationMinutes: number | null;
  status: OrderStatus;
  /** Draft 1190: the missing pieces, for the «أكمل …» next step. */
  missing?: readonly string[];
  /** Postponed reason. */
  reason?: string;
  linkedDebtId?: string;
  linkedMovementId?: string;
  linkedDeliveryId?: string;
}

export type DeliveryStatus =
  | 'created' // أُنشئ
  | 'awaitingQuote' // بانتظار عرض سعر
  | 'quoteArrived' // عرض سعر وصل
  | 'accepted' // مقبول
  | 'inProgress' // قيد التنفيذ
  | 'done' // تمّ
  | 'failed'; // تعذّر (off the happy track)

export interface Quote {
  /** Integer fils. */
  amount: number;
  /** 24h clock time. */
  time: string;
  state: 'valid' | 'superseded' | 'accepted';
  /** Minutes after the simulation opens; undefined = no expiry. */
  expiresInMinutes?: number;
}

export interface Delivery {
  id: string; // ت1 … ت4
  owner: string;
  from: string;
  to: string;
  /** ISO date. */
  date: string;
  /** 24h clock time, null when absent. */
  time: string | null;
  driver: string | null;
  quotes: readonly Quote[];
  status: DeliveryStatus;
  /** The evidence the flow requires: 'photo' (or null). */
  evidence: 'photo' | null;
  /** Present evidence for done jobs: 'photo'. */
  evidenceProvided?: 'photo' | null;
  /** ر4.4: an issue proposal the OWNER approved (the mission stays تعذّر, closed). */
  issueClosed?: boolean;
  linkedOrderId?: string;
  linkedMovementId?: string;
  description?: string;
}

export interface Driver {
  id: 'omar' | 'yazan';
  name: string;
  status: 'approved' | 'pendingReview' | 'rejected'; // جولة المستخدم: الرفض بسبب
  phone: string;
  vehicle: string;
  plate: string;
  areas: readonly string[];
  /** Attachment names — the files render as surface-well placeholder tiles. */
  attachments: readonly string[];
}

export type Availability = 'available' | 'onDemand' | 'temporarilyUnavailable';

export interface PriceTier {
  /** min quantity inclusive. */
  min: number;
  /** max quantity inclusive, null = فما فوق. */
  max: number | null;
  /** Integer fils. */
  price: number;
}

export type ListingStatus =
  | 'approved' // معتمد
  | 'underReview' // قيد المراجعة
  | 'rejected' // مرفوض
  | 'approvedWithEdit'; // معتمد + تعديل قيد المراجعة

export interface Listing {
  id: string; // ع1 … ع8
  supplier: string;
  title: string;
  /** Integer fils (single price; null for tiered). */
  price: number | null;
  /** Tier rows (ع2). */
  tiers?: readonly PriceTier[];
  availability: Availability;
  /** Stock quantity, null when absent. */
  qty: number | null;
  status: ListingStatus;
  /** ع4: the edited price under review. */
  editedPrice?: number | null;
  /** «منذ 5 ساعات» for under-review rows. */
  since?: string;
  rejectReason?: string;
  imageCount: number;
  governorate: string;
  category: string;
  minOrder: string;
  /** ع6: the reports with their reasons. */
  reports?: readonly string[];
  /** جولة المستخدم: «أوقف العرض» — the reviewer's stop decision hides the
   *  listing from every buyer's market without deleting it. */
  stopped?: boolean;
  /** ع8: the supplier's first listing ever. */
  firstListing?: boolean;
}

export type ReviewKind = 'listing' | 'listingEdit' | 'driver';

export interface ReviewItem {
  kind: ReviewKind;
  /** The object id: ع3 / ع8 / ع4 / yazan. */
  ref: string;
  since: string;
}

export type NotificationKey =
  | 'quote_submitted'
  | 'quote_expiring'
  | 'status_changed'
  | 'booking_outcome'
  | 'report_replied'
  | 'booking_request_received'
  | 'evidence_expiry_reminder'
  | 'driver_review_decision'
  | 'moderation_decision'
  | 'listing_freshness_reminder';

export type SimRole = 'owner' | 'driver' | 'supplier' | 'reviewer' | 'guest';

export interface SimNotification {
  key: NotificationKey;
  role: Exclude<SimRole, 'guest'>;
  /** The object id the notification is about (ت1, ع6 …). */
  object: string;
  /** Display time, e.g. '10:40 ص'. */
  time: string;
  read: boolean;
}
