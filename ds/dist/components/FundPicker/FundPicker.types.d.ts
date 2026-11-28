/**
 * FundPicker.types.ts — props of the fund picker (ADDENDUM §3.5, 23.18).
 *
 * Choosing the fund inside the movement and payment sheets — NOT for
 * displaying funds (FundCard). The FORM follows the fund count
 * (criterion 1): one fund — a plain row; 2-4 — a single-choice chip row;
 * 5+ — a TextField-look field with a sheet. TRANSFER is the host's own
 * composition: two pickers, the second's items carrying the from-fund
 * as disabled (criterion 2 — the chip then reads «هذا صندوق المصدر»).
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
export interface FundOption {
    /** The fund's stable identity — handed to onChange. */
    value: string;
    /** The fund's name. */
    label: string;
    /** The balance — renders through Money (hidden amounts apply,
     *  §3.5-6); a negative balance keeps its «−» with no color (§3.5-2). */
    balance?: string;
    /** The fund's icon node (FundCashIcon / FundBankIcon / FundWalletIcon)
     *  — 16 in the chips, 20 in the row and the field. */
    leading?: ReactNode;
    /** Disabled in this picker (the TRANSFER's second field marks the
     *  from-fund — criterion 2). The accessible name carries the reason
     *  «هذا صندوق المصدر». */
    disabled?: boolean;
}
export interface FundPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
    /** The field's word («من الصندوق» / «إلى الصندوق») — the 2-4 form's
     *  label, the 5+ form's field label, and the group's accessible name. */
    label: string;
    /** The funds the app passes (§3.5-3 items — no list lives here). */
    items: readonly FundOption[];
    /** The chosen fund's value; undefined = nothing chosen. */
    value?: string;
    /** Where the money goes: `out` (from the fund — «من:»), `in` (to the
     *  fund — «إلى:»), or `transfer` (the host composes two pickers). */
    direction?: 'in' | 'out' | 'transfer';
    /** Reports the picked fund (the sheets close on the pick). */
    onChange?: (value: string) => void;
    /** Disables the picker (23.2). */
    disabled?: boolean;
    /** idle · error — with more than one fund, saving with no choice shows
     *  «اختر الصندوق» (§3.5-4). */
    state?: 'idle' | 'error';
    /** React 19 ref-as-prop on the root. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
