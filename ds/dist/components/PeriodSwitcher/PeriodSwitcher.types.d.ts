/**
 * PeriodSwitcher.types.ts — props of the period switcher (BATCH2-SPECS
 * §1.27, 23.18).
 *
 * ABOVE content that depends on a period (finance, charts, calendar) —
 * NOT for a single date in a form (DateQuickChips). The value carries the
 * size AND the start; the end derives from the grid (or rides `end` for a
 * custom range). A SINGLE allowed size (items of one) is the month-only
 * anatomy the DatePicker composition rides: the label is NOT a button and
 * no size sheet exists (ADDENDUM §3.4-2 «بوضع الشهر فقط»).
 */
import type { HTMLAttributes, Ref } from 'react';
/** The period sizes (§1.27-2): the three segments plus the custom range. */
export type PeriodSize = 'day' | 'week' | 'month' | 'custom';
export interface PeriodValue {
    /** The period's size. */
    size: PeriodSize;
    /** The period's first day, DD/MM/YYYY (snapped to the size's grid). */
    start: string;
    /** The period's last day, DD/MM/YYYY — custom ranges carry it; the
     * fixed sizes derive their end and ignore it. */
    end?: string;
}
export interface PeriodSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
    /** The period (size + start) — controlled by the app (BRIEF 11). */
    value: PeriodValue;
    /** The allowed sizes (§1.27-3 `items`). One size only = the label is
     * not a button and no size sheet opens (the DatePicker composition's
     * month-only anatomy). Defaults to day/week/month — `custom` joins when
     * the size sheet's range mode is wired (MonthGrid, unit 4.15). */
    items?: readonly PeriodSize[];
    /** The latest day the periods may reach (DD/MM/YYYY) — «التالي»
     * disables when the next period would pass it (§1.27-4). */
    max?: string;
    /** The first day of the week, 0 (Sunday, the owner's decision 1.1) to
     * 6 — criterion 4: the week starts here (م-خ1). */
    weekStart?: number;
    /** Reports the stepped / resized / jumped-to period (unified onChange,
     * 23.18) — always grid-snapped. */
    onChange?: (value: PeriodValue) => void;
    /** React 19 ref-as-prop on the row root. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
    [key: `data-${string}`]: string | number | boolean | undefined;
}
