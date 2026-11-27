/**
 * ListingStatusBadge.types.ts — props of the listing status badge
 * (BATCH2-SPECS §5.7, open per 17-item-6).
 *
 * A listing's moderation status in the SUPPLIER's list and detail:
 * «قيد المراجعة» (waiting), «معتمد» (done), «مرفوض» (problem) — a
 * rejection ALWAYS carries its reason caption under the row/card (ق1).
 * The market grid for browsers is NOT this (they only see approved).
 */
import type { HTMLAttributes, Ref } from 'react';

/** The three moderation states. */
export type ListingStatus = 'waiting' | 'done' | 'rejected';

export interface ListingStatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** The moderation state. */
  tone: ListingStatus;
  /** The rejection reason — REQUIRED with rejected (ق1). */
  caption?: string;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
