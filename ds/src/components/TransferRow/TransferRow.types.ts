/**
 * TransferRow.types.ts — props of the transfer row (BATCH2-SPECS §2.2;
 * BRIEF 23.18 unified vocabulary).
 *
 * A transfer between two funds in a list: the ObjectRow anatomy with the
 * transfer mark, the title «درج الكاش ← الحساب البنكي» (the arrow is a
 * text arrow, aria-hidden — the screen reader hears «من … إلى …»), and at
 * the end Money with NO sign, then the time. The money-in/out movement
 * with an external party is NOT this row (MovementRow).
 */
import type { ButtonHTMLAttributes, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';

export interface TransferRowProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress' | 'value'> {
  /** The source fund name («درج الكاش»). */
  from: string;
  /** The destination fund name («الحساب البنكي»). */
  to: string;
  /** The second line: the description when there is one, else «تحويل». */
  caption?: string;
  /** The amount; Money renders it with NO sign (§2.2 ق1). */
  value: MoneyInput;
  /** The time text under the amount. */
  time?: string;
  /** Fires when the row is pressed (opens the transfer's sheet). */
  onPress?: () => void;
  /** Long-press opens the action menu (edit / delete the transfer). */
  onLongPress?: () => void;
  /** Loading renders the Skeleton row shapes (§0.2 item 1). */
  state?: DataState;
  /** Disables the row (23.24(15)). */
  disabled?: boolean;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLButtonElement>;
}
