/**
 * Money.types.ts — props of the Money component (BRIEF 8, 9.3, 23.18, 23.22).
 *
 * Unified property names only (23.18): the amount arrives as `value`, the
 * signed forms through `direction` (داخل/خارج/تحويل) and `debt` (لك/عليك) —
 * the same semantics lib/format-money defines for the whole library.
 * Amount visibility is NEVER a prop: it comes from the app-owned context
 * (BRIEF 23.22). Free design-value props (color/padding/…) are banned.
 */
import type { Ref } from 'react';
import type { HTMLAttributes } from 'react';
import type { DebtSide, MoneyDirection, MoneyInput } from '../../lib/format-money';
import type { DataState, Size } from '../../lib/types';
/**
 * Money sizes (BRIEF 23.18: every component documents its subset).
 * md = amount-row 16/24/600 (rows, debts), lg = number-lg 28/36/500 with
 * digit tracking (large figures outside Metric).
 */
export type MoneySize = Extract<Size, 'md' | 'lg'>;
/**
 * Money data states (BRIEF 8: a missing value shows «—», a loading one the
 * gray skeleton — never a zero). `error`/`empty` do not apply to a bare
 * amount; missing values are `value={null}`.
 */
export type MoneyState = Extract<DataState, 'idle' | 'loading'>;
export interface MoneyProps extends HTMLAttributes<HTMLSpanElement> {
    /** Amount as a western-digit decimal string or number; null/undefined = missing («—»). */
    value: MoneyInput;
    /** Movement direction: in → «+», out → «−» (U+2212), transfer → no sign (BRIEF 8). */
    direction?: MoneyDirection;
    /** Debt form: forYou → «لك …», againstYou → «عليك …» (BRIEF 8). */
    debt?: DebtSide;
    /** md (default) = amount-row; lg = number-lg with digit tracking (BRIEF 5.3). */
    size?: MoneySize;
    /** loading renders the skeleton block and sets aria-busy (BRIEF 8, 23.17). */
    state?: MoneyState;
    /** Disabled look: disabled-fg text (BRIEF 23.2). */
    disabled?: boolean;
    /** React 19 ref-as-prop on the root span. */
    ref?: Ref<HTMLSpanElement>;
}
