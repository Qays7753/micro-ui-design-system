/**
 * PaymentProgress.types.ts — props of the payment progress (BATCH2-SPECS
 * §2.6; BRIEF 23.18 unified vocabulary).
 *
 * The financial progress of a debt: a track 8 high (size.progress) with
 * the paid part in brand-data from the start, then 4 and the caption
 * line «دُفع 35 د · بقي 45 د». FINANCIAL progress ONLY — any non-financial
 * progress (a delivery, a review) belongs to StatusTrack. Hidden amounts
 * (23.22): the bar AND the line disappear; a «المبلغ مخفي» caption takes
 * their place — the real ratio must not leak through the bar geometry.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';
export interface PaymentProgressProps extends HTMLAttributes<HTMLDivElement> {
    /** The PAID amount (a decimal string or number; 0 renders the bare track). */
    value: MoneyInput;
    /** The TOTAL the debt started at; the paid share is value/total. */
    total: MoneyInput;
    /** loading renders the skeleton bar and hides the ratio from a11y. */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
