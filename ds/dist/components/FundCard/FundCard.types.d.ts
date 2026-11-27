/**
 * FundCard.types.ts — props of the fund card (BATCH2-SPECS §2.3; BRIEF
 * 23.18 unified vocabulary).
 *
 * One fund in the finance «الصناديق» section: an ObjectCard 280 wide in
 * a horizontal list — the EntityMark sm 32 with the fund icon, the name
 * body-strong one line, the balance Money lg, the last movement caption,
 * and the attention dot at the header's end when the fund has a draft
 * movement. Picking a fund inside a form is FundPicker, NOT this card.
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';
/** The fund types map to their icons (fund-cash / fund-bank / fund-wallet). */
export type FundType = 'cash' | 'bank' | 'wallet';
export interface FundCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress' | 'value' | 'type'> {
    /** The fund name, one line (body-strong). */
    label: string;
    /** The fund type; picks the mark's icon. */
    variant?: FundType;
    /** The balance; Money lg (number-lg 28/36). A negative keeps its «−»
     *  with no extra colour (§2.3 item 4). */
    value: MoneyInput;
    /** The last movement line: «آخر حركة: −3.000 د · أمس» — passed whole
     *  from the app (it may contain an amount the app formats via Money
     *  lg/sm nodes, or plain text for hidden views). */
    caption?: ReactNode;
    /** True when this fund has a draft movement: the attention dot at the
     *  header's end (§2.3 ق2 — present ONLY with a draft). */
    draft?: boolean;
    /** Fires when the card is pressed. */
    onPress?: () => void;
    /** Loading renders the skeleton card (§0.2 item 1). */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLButtonElement>;
}
