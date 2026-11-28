/**
 * MonthSheet.tsx — the shared month sheet (ADDENDUM §3.4-2).
 *
 * The composition's own sheet: a Sheet 50% carrying PeriodSwitcher in its
 * MONTH-ONLY anatomy (items of one — the label is NOT a button, no size
 * sheet) and MonthGrid in single mode at weekStart 0 — NO ActionBar:
 * choosing a day closes the sheet. DatePicker's field opens it, and
 * DateQuickChips' «تاريخ آخر» chip rides THE SAME sheet (م1 §1.8 +
 * ADDENDUM §3.4-2). The sheet's month opens on the value's month, else
 * the current month (§3.4-4); the arrows step months and the grid swap
 * fades (motion.fade — the MonthGrid's own entry fade, §3.5-5). The grid
 * runs FULL-BLEED inside the sheet (و-2 item 26: the calendar strip edge
 * to edge; the switcher row above keeps the sheet's own margins).
 */
import { useState } from 'react';
import { MonthGrid } from '../MonthGrid/index';
import { PeriodSwitcher } from '../PeriodSwitcher/index';
import { Sheet } from '../Sheet/index';
import { parseDateParts, startOfToday } from '../../lib/format-period';
import type { MonthSheetProps } from './DatePicker.types';
import type { PeriodValue } from '../PeriodSwitcher/index';

export function MonthSheet({ label, value, min, max, onChange, onDismiss }: MonthSheetProps) {
  /** §3.4-4: the default month at open — the value's month, else today's. */
  const [period, setPeriod] = useState<PeriodValue>(() => {
    const anchor = parseDateParts(value) ?? startOfToday();
    return { size: 'month', start: `01/${String(anchor.month).padStart(2, '0')}/${anchor.year}` };
  });

  const monthForm = period.start.slice(3); // '01/11/2026' → '11/2026'

  return (
    <Sheet label={label} onDismiss={onDismiss}>
      <PeriodSwitcher items={['month']} value={period} onChange={setPeriod} />
      {/* key = the month: the swap remount replays the entry fade
          (motion.fade, §3.5-5 — the month change from PeriodSwitcher). */}
      <MonthGrid
        key={monthForm}
        className="mds-date-sheet-grid"
        month={monthForm}
        mode="single"
        weekStart={0}
        value={inMonth(value, monthForm) ? value : undefined}
        min={min}
        max={max}
        onChange={(next) => typeof next === 'string' && onChange?.(next)}
      />
    </Sheet>
  );
}

/** Is the date inside the displayed month? (Only then does its day show
 *  selected — the value may live in another month.) */
function inMonth(value: string | undefined, monthForm: string): boolean {
  const parsed = parseDateParts(value);
  if (!parsed) return false;
  return `${String(parsed.month).padStart(2, '0')}/${parsed.year}` === monthForm;
}
