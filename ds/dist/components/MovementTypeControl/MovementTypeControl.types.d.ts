/**
 * MovementTypeControl.types.ts — props of the movement type control
 * (BATCH2-SPECS §1.5, 23.18).
 *
 * The FIRST element of the money-movement form: the in/out/transfer switch.
 * NOT usable outside a movement form. It is the segmented anatomy (BRIEF
 * 9.1) with exactly three fixed segments — inside, outside, transfer — whose
 * words come from the dictionary (24.3), so the app passes no labels. The
 * value stays app-owned (BRIEF 11): nothing chosen until the app says so,
 * and the save-time error rides `state="error"` like Radio.
 */
import type { Ref } from 'react';
import type { DataState } from '../../lib/types';
/** The three movement directions (BRIEF 8: داخل/خارج/تحويل). */
export type MovementTypeValue = 'in' | 'out' | 'transfer';
export interface MovementTypeControlProps {
    /** The chosen direction; undefined = nothing chosen yet (§1.5-4). */
    value?: MovementTypeValue;
    /** Reports the chosen direction (unified onChange, 23.18). */
    onChange?: (value: MovementTypeValue) => void;
    /** Disables all three segments (23.2). */
    disabled?: boolean;
    /** error = saved with nothing chosen: «اختر نوع الحركة» under the
     * control (§1.5-4). idle otherwise. */
    state?: Extract<DataState, 'idle' | 'error'>;
    /** React 19 ref-as-prop on the radiogroup root. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
