/**
 * MonthGrid.types.ts — props of the month grid (BATCH2-SPECS §3.5, 23.18).
 *
 * The monthly calendar strip: for the monthly calendar screens, for the
 * DateQuickChips «تاريخ آخر» sheet, and for range picking — NOT a
 * replacement for WeekStrip above the daily calendar (§3.5-1).
 */
import type { HTMLAttributes, Ref } from 'react';

/** The selection mode (§3.5-3: «طريقة الاختيار» — `mode`, not `kind`,
 *  owner decision 1.3). */
export type MonthGridMode = 'single' | 'range' | 'view';

/** A range draft: the start circle once picked, the end when it completes. */
export interface MonthGridRange {
  /** The range's first day, DD/MM/YYYY. */
  start?: string;
  /** The range's last day, DD/MM/YYYY. */
  end?: string;
}

/** The selection: a single date, or the range draft in range mode. */
export type MonthGridValue = string | MonthGridRange;

export interface MonthGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** The displayed month, MM/YYYY («11/2026» — the label's own month form).
   * The PARENT owns it (the DatePicker composition rides the sheet's
   * PeriodSwitcher month); the grid never steps it itself. */
  month: string;
  /** The selection: a single date (single), or the range draft (range).
   * View mode ignores it. */
  value?: MonthGridValue;
  /** The items count per day, keyed DD/MM/YYYY (§3.5-3 «عدد العناصر لكل
   *  يوم») — up to three dots under the number. */
  items?: Record<string, number>;
  /** The earliest selectable day, DD/MM/YYYY — earlier days disable. */
  min?: string;
  /** The latest selectable day, DD/MM/YYYY — later days disable. */
  max?: string;
  /** The first day of the week, 0 (Sunday, the owner's decision 1.1) to 6. */
  weekStart?: number;
  /** The selection mode: `single` (one day), `range` (a start and an end),
   * or `view` (nothing selectable — the plain month view). */
  mode?: MonthGridMode;
  /** Reports the picked day (single) or the growing range draft (range) —
   * grid-snapped dates; view mode never fires it. */
  onChange?: (value: MonthGridValue) => void;
  /** React 19 ref-as-prop on the grid root. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
