/**
 * ListingCard.types.ts — props of the market listing card (BATCH2-SPECS
 * §5.1; BRIEF 23.18 unified vocabulary).
 *
 * One offer in the market grid (2-up on the phone): Surface pad-8, the
 * whole card pressable. The 4:3 image (r-md, center crop, entity-image-
 * edge inset) — a small centered image rides surface-well; no image: the
 * supplier's EntityMark 44 on surface-well. Under: title body-strong (2
 * lines), the amount-row price «2.500 د / عبوة» (or «من …» with tiers),
 * and the supplier line (mark 32 + name caption). Unavailable: a neutral
 * badge replaces the price; NO availability badge otherwise. Visitor: the
 * price is LockedDetails — and NEVER in the page (ق3). The supplier's OWN
 * list is ObjectRow + ListingStatusBadge, NOT this.
 */
import type { ButtonHTMLAttributes, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';

export interface ListingCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'value'> {
  /** The offer title: «طحين أبيض 50 كغ» (2 lines max). */
  label: string;
  /** The price; renders the amount-row «2.500 د / عبوة» or «من 2 د» with
   *  tiers. Ignored when unavailable or locked. */
  value?: MoneyInput;
  /** The unit word from the app: «عبوة». */
  caption?: string;
  /** True when the price is tiered («من 2 د / عبوة»). */
  tone?: 'flat' | 'tiers';
  /** The supplier's name for the bottom line + fallback mark. */
  supplier?: string;
  /** The main image URL (4:3, center crop); small images center on a
   *  well; none renders the supplier mark. */
  image?: string;
  /** Unavailable: a neutral badge replaces the price row. */
  unavailable?: boolean;
  /** Visitor: LockedDetails replaces the price — ق3: no number in page. */
  locked?: boolean;
  /** Fires when the card opens (the listing's sheet). */
  onPress?: () => void;
  /** Loading renders the skeleton card (§5.1 item 4). */
  state?: 'idle' | 'loading';
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLButtonElement>;
}
