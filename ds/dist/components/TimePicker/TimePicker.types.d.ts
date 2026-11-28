/**
 * TimePicker.types.ts — props of the time picker (BATCH2-SPECS §1.9 +
 * ADDENDUM §2.4, 23.18).
 *
 * A delivery MOMENT in one point (not a duration — DurationPicker). The
 * value is minutes since midnight (0..1439, step 15 — ADDENDUM §2.4);
 * the field shows the 12-hour «4:00 م» and the sheet picks hour, minute,
 * and ص/م through chips. NOT a native time input (rule 11, criterion 2).
 */
import type { Ref } from 'react';
import type { DataState } from '../../lib/types';
export interface TimePickerProps {
    /** The field's label («وقت التسليم») — also the sheet's title. */
    label: string;
    /** The chosen time, minutes since midnight; undefined = empty (§1.9-4). */
    value?: number;
    /** The minute step (م-خ1) — 15 per the addendum; the minute chips ride
     * it (00/15/30/45 at 15). */
    step?: number;
    /** The earliest pickable time, minutes since midnight. */
    min?: number;
    /** The latest pickable time, minutes since midnight. */
    max?: number;
    /** Reports the applied time (unified onChange, 23.18) — fires on the
     * sheet's «اعتمد الوقت» press (§2.4); the field's clear button fires
     * it with undefined. */
    onChange?: (value: number | undefined) => void;
    /** Disables the field (23.2). */
    disabled?: boolean;
    /** error = saved with nothing chosen: the TextField error look plus the
     * «اختر الوقت» line under the field (§1.9-4). */
    state?: Extract<DataState, 'idle' | 'error'>;
    /** React 19 ref-as-prop on the field root. */
    ref?: Ref<HTMLSpanElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
