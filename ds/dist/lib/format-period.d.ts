import type { PeriodSize, PeriodValue } from '../components/PeriodSwitcher/index';
/** A calendar day without time (the lab's fixed clock is a date, never an instant). */
export interface SimpleDate {
    year: number;
    month: number;
    day: number;
}
/** The two words of a formatted period: what it shows and what it speaks. */
export interface FormattedPeriod {
    /** «11/2026» — the visible label (Western tabular digits, LTR run). */
    text: string;
    /** «تشرين الثاني 2026» — the spoken form for names and announcements. */
    spoken: string;
}
/** Parse a DD/MM/YYYY string; undefined when it is not a real date. */
export declare function parseDateParts(value: string | undefined): SimpleDate | undefined;
/** The days in a month (1..12). */
export declare function daysInMonth(year: number, month: number): number;
/** Format as DD/MM/YYYY (two-digit day and month — the label form). */
export declare function formatDateParts(date: SimpleDate): string;
/** Days since 1970-01-01 (UTC) — the comparison and stepping unit. */
export declare function epochDays(date: SimpleDate): number;
/** The date `days` epoch-days after 1970-01-01. */
export declare function fromEpochDays(days: number): SimpleDate;
/** A comparable number for a DD/MM/YYYY string (NaN when invalid). */
export declare function dateKey(value: string | undefined): number;
/** The first day of the `weekStart`-based week that contains `date`. */
export declare function weekStartOf(date: SimpleDate, weekStart: number): SimpleDate;
/** The first day of `date`'s month. */
export declare function monthStartOf(date: SimpleDate): SimpleDate;
/** The last day of `date`'s month. */
export declare function monthEndOf(date: SimpleDate): SimpleDate;
/**
 * Snap a period's start to its size's grid: the week to its weekStart
 * boundary, the month to its first day (criterion 4: the week starts at
 * weekStart). A custom range keeps its days but orders them.
 */
export declare function normalizePeriod(value: PeriodValue, weekStart: number): PeriodValue;
/** The period's last day (derived for the fixed sizes, `end` for custom;
 * the start is already grid-snapped, so no weekStart is needed). */
export declare function periodEnd(value: PeriodValue): SimpleDate;
/** One step back (-1) or forward (+1) in the period's own size. */
export declare function stepPeriod(value: PeriodValue, weekStart: number, direction: 1 | -1): PeriodValue;
/** The period of `size` that contains `today` («الفترة الحالية», §1.27-2). */
export declare function currentPeriod(size: PeriodSize, weekStart: number, today: SimpleDate): PeriodValue;
/** Two periods are the same period (size + grid-snapped start). */
export declare function isSamePeriod(a: PeriodValue, b: PeriodValue): boolean;
/** Today as a SimpleDate (UTC — the date the words compare against). */
export declare function startOfToday(): SimpleDate;
/** Format a period into its visible and spoken words. */
export declare function formatPeriod(value: PeriodValue, weekStart: number, today?: SimpleDate): FormattedPeriod;
