/**
 * PeriodSwitcher.states.ts — applicable states from BRIEF 9.0 +
 * BATCH2-SPECS §1.27.
 *
 * the spec's month data (11/2026, current), stepped back (10/2026 with
 * the jump button), the week at a past week, the day at today («اليوم»),
 * the size sheet open, the custom row armed, «التالي» at max, and the
 * month-only anatomy (the DatePicker composition's single size).
 */
export declare const PeriodSwitcherStates: readonly ["default", "month-current", "stepped-back", "week-past", "day-today", "sheet-open", "custom-armed", "next-disabled", "month-only"];
export type PeriodSwitcherStateId = (typeof PeriodSwitcherStates)[number];
