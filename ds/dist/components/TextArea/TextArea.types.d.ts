/**
 * TextArea.types.ts — props of the multi-line field (ADDENDUM §1.2, 23.18).
 *
 * Free multi-line text (a note, a description, a rejection reason, the Ask
 * input). NOT for a one-line value (TextField). Same anatomy as TextField:
 * label above, help below, the hairline field, focus ring + halo.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { DataState } from '../../lib/types';
/** A text area is idle or in error; loading/empty do not apply. */
export type TextAreaState = Extract<DataState, 'idle' | 'error'>;
export interface TextAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
    /** The label above (label 14/20/500). */
    label: string;
    /** The help line below (caption); in error it carries the SOLUTION text. */
    caption?: string;
    /** Controlled text; the app owns it (BRIEF 11). */
    value?: string;
    /** Called with the new text. */
    onChange?: (value: string) => void;
    /** Format hint only, never a label (23.24(10)). */
    placeholder?: string;
    /** idle | error — error draws the red border and marks the help line. */
    state?: TextAreaState;
    /** Disabled look (23.2). */
    disabled?: boolean;
    /** Optional field: «اختياري» after the label (lesson rule 67). */
    optional?: boolean;
    /** enterkeyhint on the textarea (default «enter»; Ask sends via a button). */
    enterKeyHint?: 'enter' | 'send' | 'next';
    /** React 19 ref-as-prop on the textarea element. */
    ref?: Ref<HTMLTextAreaElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
