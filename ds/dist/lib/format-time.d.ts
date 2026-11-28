/** The two words of a formatted time: what it shows and what it speaks. */
export interface FormattedTime {
    /** «4:00 م» — the visible 12-hour form (Western digits, LTR run). */
    text: string;
    /** «4:00 مساءً» — the spoken form for names and announcements. */
    spoken: string;
}
/** Format minutes-since-midnight into the 12-hour pair (§1.9). */
export declare function formatTimeValue(minutes: number): FormattedTime;
