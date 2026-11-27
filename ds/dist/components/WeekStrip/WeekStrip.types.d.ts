/**
 * WeekStrip.types.ts — props of the week strip (BATCH2-SPECS §3.2; BRIEF
 * 23.18 unified vocabulary; م-خ1 items/weekStart).
 *
 * The week-day picker at the top of the calendar: a full-width surface
 * strip with 7 equal cells (screen ÷ 7), each the short day name (micro,
 * secondary), the date number in a day-mark 36 circle (no leading zero)
 * and up to 3 item dots. Today carries the today-ring; the selected day
 * fills brand-anchor. Choosing a date in a form is DatePicker/MonthGrid,
 * NOT this strip.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { DataState } from '../../lib/types';
/** One day's data: the ISO date key and its item count. */
export interface WeekStripDay {
    /** The date, e.g. '2026-11-27'. */
    date: string;
    /** How many items this day carries (drives the dots / count). */
    items?: number;
}
export interface WeekStripProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
    /** The 7 days of the visible week, in order from weekStart. */
    items: readonly WeekStripDay[];
    /** The selected day's date key (ISO). */
    value?: string;
    /** Today's date key (ISO) — the today ring applies to it. */
    today?: string;
    /** 0 (Sunday) per the owner decision; drives nothing here (the caller
     *  orders `items`), kept for the unified vocabulary (م-خ1). */
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** Fires with the pressed day's date key. */
    onChange?: (date: string) => void;
    /** Loading: the day cells render, the dots do not (§3.2 item 4). */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
