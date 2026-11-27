/**
 * AgendaList.types.ts — props of the agenda list (BATCH2-SPECS §3.4;
 * م-خ1 items).
 *
 * Items grouped by day for the calendar's day view: a pinned day heading
 * («اليوم · خميس 27/11» with its count at the end) then a Surface of
 * ObjectRow rows (row-with-mark 72) — the customer mark, name, content,
 * the time at the end with the status badge under it. Days without items
 * never render. A single day of overlapping DURATION items is
 * DayTimeline, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { DataState } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';
export interface AgendaRow {
    /** The customer name (the letter mark renders from it). */
    label: string;
    /** The content caption. */
    caption?: string;
    /** The time text at the row's end: «4:00 م» or «10:00 ص – 11:30 ص». */
    time: string;
    /** The status badge tone under the time. */
    tone?: Tone;
    /** A custom badge node instead of the tone's default word. */
    badge?: ReactNode;
    /** Fires when the row is pressed. */
    onPress?: () => void;
}
export interface AgendaDay {
    /** The pinned heading text: «اليوم · خميس 27/11». */
    label: string;
    /** The day's rows, sorted by time by the app (ق2 checks the order). */
    rows: readonly AgendaRow[];
}
export interface AgendaListProps extends HTMLAttributes<HTMLDivElement> {
    /** The days, in order; empty days must not be passed (ق1). */
    items: readonly AgendaDay[];
    /** Loading renders skeleton day groups (§0.2 item 1). */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
