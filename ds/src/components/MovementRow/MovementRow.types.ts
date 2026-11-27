/**
 * MovementRow.types.ts — props of the movement row (BATCH2-SPECS §2.1;
 * BRIEF 23.18 unified vocabulary).
 *
 * A money-in/money-out movement in a list: an ObjectRow (row-with-mark 72)
 * with the movement's EntityMark (movement-in / movement-out icon), the
 * party as the title (or the description when no party), the second line
 * «<الصندوق> · <الوصف>», and at the end Money signed by the direction —
 * the amount is ALWAYS text-primary, in or out (BRIEF 8). A draft shows
 * the «مسودة» badge in place of the time. The transfer between funds is
 * NOT this row (TransferRow).
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';

/** The movement direction drives the mark icon AND the Money sign. */
export type MovementDirection = 'in' | 'out';

export interface MovementRowProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress' | 'value'> {
  /** The title: the party when there is one, else the description. */
  label: string;
  /** The second line: «درج الكاش · وصف الحركة» (the description only when
   *  the title is the party; the fund alone otherwise). */
  caption?: string;
  /** The amount; null renders «—» (BRIEF 8: a missing value is not a zero). */
  value: MoneyInput;
  /** in → «+» with the movement-in mark; out → «−» with movement-out. */
  direction: MovementDirection;
  /** A draft movement: the «مسودة» waiting badge replaces the time. */
  draft?: boolean;
  /** The time text under the amount («10:42 صباحاً») — replaced by the
   *  draft badge when `draft` is set. */
  time?: string;
  /** Fires when the row is pressed (opens the movement's sheet). */
  onPress?: () => void;
  /** Long-press opens the action menu (edit / delete the movement). */
  onLongPress?: () => void;
  /** Loading renders the Skeleton row shapes (BATCH2 §0.2 item 1). */
  state?: DataState;
  /** Disables the row (23.24(15)). */
  disabled?: boolean;
  /** Extra trailing content (a StatusBadge) — reserved for the lab. */
  trailing?: ReactNode;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLElement>;
}
