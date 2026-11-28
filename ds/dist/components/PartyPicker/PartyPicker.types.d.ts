/**
 * PartyPicker.types.ts — props of the party picker (BATCH2-SPECS §1.10,
 * 23.18).
 *
 * Choosing a client, a supplier, or a debt party IN A FORM — NOT for
 * browsing customers (a plain list). The chosen party rides the whole
 * item; the add row reports a NEW party by its typed name (the app
 * creates it — the value is the name).
 */
import type { HTMLAttributes, Ref } from 'react';
/** The sheet's role word: «عميلاً» / «مورداً» / «طرفاً» (§1.10-8). */
export type PartyRole = 'client' | 'supplier' | 'party';
export interface PartyOption {
    /** The party's stable identity — handed to onChange. */
    value: string;
    /** The name (the field shows it after the choice). */
    label: string;
    /** The row's second line: the phone (§1.10-2 — a plain string; a debt
     *  rides `debt`). */
    caption?: string;
    /** A debt amount («45») — renders through Money as «لك 45 د» in the
     *  row's end and hides with the amounts context (§1.10-6, the
     *  needs-you rows' own pattern). */
    debt?: string;
}
export interface PartyPickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'children'> {
    /** The field's label — also the sheet's title («اختر العميل»). */
    label: string;
    /** The chosen party; undefined = nothing chosen. */
    value?: PartyOption;
    /** The parties the app passes (§1.10-3 items — no list lives here). */
    items?: readonly PartyOption[];
    /** The role word in the add row: client (عميلاً), supplier (مورداً),
     *  party (طرفاً) — what the app passes (§1.10-8). */
    mode?: PartyRole;
    /** True while the app loads the list: the sheet renders three
     *  skeleton rows (§1.10-4). */
    loading?: boolean;
    /** Reports the picked row (the sheet closes), the add row's NEW party
     *  (its name is the value), or undefined from the clear button. */
    onChange?: (value: PartyOption | undefined) => void;
    /** Disables the field (23.2). */
    disabled?: boolean;
    /** idle · error — the error looks like TextField's. */
    state?: 'idle' | 'error';
    /** React 19 ref-as-prop on the field root. */
    ref?: Ref<HTMLSpanElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
