/**
 * PriceTierTable.types.ts — props of the price tier table
 * (BATCH2-SPECS §5.3).
 *
 * The tiers of a listing detail: a three-column table — «من»، «إلى»،
 * «السعر للعبوة» — the last tier's «إلى» reads «فما فوق», the price
 * column is Money. Visitor: LockedDetails in the full shape (3 rows),
 * and NO number in the page (ق1). EDITING is PriceTierBuilder, NOT this.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';

export interface PriceTier {
  /** The tier's lower bound (quantity). */
  from: number;
  /** The upper bound; the LAST tier omits it («فما فوق»). */
  to?: number;
  /** The unit price at this tier. */
  price: MoneyInput;
}

export interface PriceTierTableProps extends HTMLAttributes<HTMLDivElement> {
  /** The tiers in order. */
  items: readonly PriceTier[];
  /** Visitor: the locked shape, no numbers in page (ق1). */
  locked?: boolean;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
