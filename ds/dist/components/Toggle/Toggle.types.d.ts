/**
 * Toggle.types.ts — props of the switch row (ADDENDUM §1.7, 23.18).
 *
 * An INSTANT setting (e.g. «إخفاء المبالغ», «متوفر»). NOT inside a form
 * saved by a button — that is a Checkbox row. The WHOLE row is the press
 * zone; the switch itself is the decoration of a role="switch".
 */
import type { Ref } from 'react';
export interface ToggleProps {
    /** The setting's NAME (never a verb: «إخفاء المبالغ», not «أخفِ»). */
    label: string;
    /** The optional second line: caption 13/20 text-secondary. */
    caption?: string;
    /** Switched on (controlled). */
    selected?: boolean;
    /** Fires with the NEXT state; the whole row presses. */
    onChange?: (selected: boolean) => void;
    /** Disables the row. */
    disabled?: boolean;
    /** React 19 ref-as-prop on the root row element. */
    ref?: Ref<HTMLLabelElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
