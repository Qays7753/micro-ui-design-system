/**
 * TextField.types.ts — props of the TextField (BRIEF 9.3, 23.18, 23.24(10)).
 *
 * Unified names only: `label` (above, `label` type), `caption` (the help
 * line below, `caption` type), `value`/`onChange` (controlled text),
 * `placeholder` (format-only, never a label substitute), `state` (idle |
 * error: the error shows the red border and the solution line the caller
 * supplies through `caption`), `disabled`. Free design-value props banned;
 * every word comes from the app dictionary (BRIEF 24).
 */
import type { InputHTMLAttributes, Ref } from 'react';
import type { DataState } from '../../lib/types';
/** A text field is idle or in error; loading/empty do not apply to an input. */
export type TextFieldState = Extract<DataState, 'idle' | 'error'>;
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'state'> {
    /** The label above the field (`label` 14/20/500) — names the input. */
    label: string;
    /** The help line below (`caption`); while state="error" it carries the SOLUTION text (9.3). */
    caption?: string;
    /** Controlled text; the app owns it (BRIEF 11). */
    value?: string;
    /** Called with the new text (unified onChange, 23.18). */
    onChange?: (value: string) => void;
    /** Format hint only («07X XXX XXXX») in text-secondary — never a label (23.24(10)). */
    placeholder?: string;
    /** idle | error — error draws the red border and marks the help line. */
    state?: TextFieldState;
    /** Disabled look: disabled-bg fill and disabled-fg text (23.2). */
    disabled?: boolean;
    /** React 19 ref-as-prop on the input element. */
    ref?: Ref<HTMLInputElement>;
}
