/**
 * AmountKeypad.types.ts — props of the amount keypad (ADDENDUM §1.4, 23.18).
 *
 * The in-app number pad under AmountField inside the money-entry sheet —
 * NOT a standalone calculator and NOT for anything but amounts. The keypad
 * EMITS keys; the app (the field's owner) applies them to the value. The
 * keypad still reads the field's `value` to disable its own impossible
 * keys (a second «.» or a fourth fraction digit — BRIEF 8's three-fraction
 * ceiling).
 */
import type { Ref } from 'react';
/** Every key the pad can emit (the visual glyph, not the spoken name). */
export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '000' | '.' | 'backspace';
export interface AmountKeypadProps {
    /** The field's raw value (Western digits, '.' decimal) — drives the
     * impossible-key disabling: «.» once a dot exists, the digits and «000»
     * once three fraction digits are typed (§1.4-4). */
    value?: string;
    /** A key was pressed (the glyph or 'backspace'). The app applies it. */
    onChange?: (key: KeypadKey) => void;
    /** A LONG press on the backspace key: the whole field clears (§1.4-5;
     * the repeated-tap alternative is just more onChange('backspace')).
     * The unified vocabulary rides the long-press name — on the pad it means
     * CLEAR (the only long press the pad has). */
    onLongPress?: () => void;
    /** Every key takes the disabled look and ignores presses (23.2). */
    disabled?: boolean;
    /** React 19 ref-as-prop on the grid root. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
