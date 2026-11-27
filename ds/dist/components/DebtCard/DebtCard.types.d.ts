/**
 * DebtCard.types.ts — props of the debt card (BATCH2-SPECS §2.4; BRIEF
 * 23.18 unified vocabulary).
 *
 * One buy/sell debt: the ObjectCard anatomy — the party's EntityMark 44
 * with the name and the «لك · يستحق 30/11/2026» caption, the remaining
 * amount in Money's debt form at the first row's end, PaymentProgress
 * below, and ONE compact secondary «سجّل دفعة» button. A settled debt
 * shows the «سُدّد» badge and NO button; an overdue one the «متأخر»
 * badge under the amount. Loans do not exist in Micro — never here.
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';
/** Who owes whom — drives the Money debt word (لك / عليك). */
export type DebtSideProp = 'owed-to-you' | 'you-owe';
export interface DebtCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress' | 'value'> {
    /** The party name (the letter mark renders from it). */
    label: string;
    /** The remaining amount; Money renders it in the debt form «لك 45 د». */
    value: MoneyInput;
    /** Who owes whom (owed-to-you → لك, you-owe → عليك). */
    debt: DebtSideProp;
    /** The second line: «يستحق 30/11/2026» (no date → omit). */
    caption?: string;
    /** The paid amount for PaymentProgress (0..total). */
    paid?: MoneyInput;
    /** The debt's starting total (PaymentProgress total). */
    total?: MoneyInput;
    /** The card's status: overdue shows the «متأخر» waiting badge under the
     *  amount; done shows «سُدّد» and hides the button; undefined = open. */
    tone?: 'overdue' | 'done';
    /** The mark's verification tone when it carries one (23.24(4)). */
    markTone?: Tone;
    /** The ONE compact secondary button («سجّل دفعة») — hidden when done. */
    action?: ReactNode;
    /** Fires when the card itself is pressed. */
    onPress?: () => void;
    /** Loading renders the skeleton card (§0.2 item 1). */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLButtonElement>;
}
