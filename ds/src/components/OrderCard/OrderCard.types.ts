/**
 * OrderCard.types.ts — props of the order card (BATCH2-SPECS §3.1; BRIEF
 * 23.18 unified vocabulary).
 *
 * One order or appointment in «يحتاجك» / «الآن» / curated lists: the
 * ObjectCard anatomy — the customer's EntityMark 44 with the name and the
 * content caption, the order value in Money at the first row's end, the
 * appointment line (clock 16 + label + StatusBadge), then ONE compact
 * secondary button for the next step. A cancelled order goes all
 * text-secondary with a strikethrough value and NO button.
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';

export interface OrderCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress' | 'value'> {
  /** The customer name (the letter mark renders from it). */
  label: string;
  /** The content caption: «فستان سهرة × 2». */
  caption?: string;
  /** The order value; Money amount-row at the row's end. null = «—». */
  value?: MoneyInput;
  /** The appointment line text: «التسليم اليوم 4:00 م» — the app formats
   *  it (its clock icon rides inside the component). */
  time?: string;
  /** The status badge tone (9.7); the badge sits at the appointment
   *  line's end. Pass the badge node itself for a custom word. */
  tone?: Tone;
  badge?: ReactNode;
  /** True when the order is cancelled: name/value text-secondary, the
   *  value strikethrough, NO button (§3.1 item 2). */
  cancelled?: boolean;
  /** The ONE compact secondary next-step button (ق1: never primary);
   *  hidden when cancelled. */
  action?: ReactNode;
  /** Fires when the card itself is pressed (opens the ObjectSheet). */
  onPress?: () => void;
  /** Loading renders the skeleton card (§0.2 item 1). */
  state?: DataState;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLButtonElement>;
}
