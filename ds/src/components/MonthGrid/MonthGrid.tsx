/**
 * MonthGrid.tsx — the month grid (BATCH2-SPECS §3.5).
 *
 * - A WHITE strip at the FULL screen width (و-2 item 26,
 *   layout.month-grid-margin = 0): surface background, no radius, a
 *   hairline surface-edge border on the top and the bottom ONLY (criterion
 *   4: no side borders, no radius on the phone). On the tablet it narrows
 *   to the content max with side borders and a radius (§3.5-2's «داخل
 *   Surface عادي»).
 * - The day-names row at height 24 (space): micro in text-secondary
 *   centered per column, in weekStart order.
 * - The cell: width = the strip ÷ 7 (criterion 1), height size.touch-min,
 *   the day number `body` with NO leading zero (criterion 3) inside a
 *   size.day-mark circle, and up to three size.dot-event dots in
 *   text-secondary under it (the dot row keeps its height even when
 *   empty — the circle never shifts when the dots arrive).
 * - Out-of-month days: EMPTY cells (the grid structure kept).
 * - Today: a today-ring (border.signal-line in the today-ring role)
 *   around the circle. Selected: the circle fills brand-anchor with the
 *   number on-anchor — and the ring stays when the selected day IS today.
 * - Range mode: the start and the end circles fill brand-anchor, and a
 *   brand-selected-bg band at the circle's height joins them through the
 *   in-range cells (§3.5-2). A press restarts a complete range, and a day
 *   before the current start restarts too; the end completes it.
 * - Days outside [min, max] disable (§3.5-4). View mode renders NO
 *   buttons at all — nothing is selectable.
 * - Screen reader (§3.5-7): role="grid" labelled by the month's NAME
 *   («تشرين الثاني 2026»); a cell reads «27 تشرين الثاني، خميس، اليوم،
 *   3 عناصر»; the arrow keys walk the cells (roving tabindex — the first
 *   day carries tab stop 0; right = the earlier day in RTL's reading
 *   direction, up/down jump a week).
 * - Motion: the selection rides motion.quick; the month swap from the
 *   parent's PeriodSwitcher fades (motion.fade — the composition's own
 *   wiring at 4.15).
 */
import { useMemo } from 'react';
import { t } from '../../i18n/ar';
import type { ArKey } from '../../i18n/ar';
import { pluralAr } from '../../i18n/plural';
import { pluralNouns } from '../../i18n/ar';
import {
  dateKey,
  daysInMonth,
  epochDays,
  formatDateParts,
  fromEpochDays,
  startOfToday,
} from '../../lib/format-period';
import { usePress } from '../../lib/use-press';
import type {
  MonthGridMode,
  MonthGridProps,
  MonthGridRange,
} from './MonthGrid.types';
import './MonthGrid.css';

/** The day-name keys, Sunday-first (the owner's list, 3.4). */
const DAY_KEYS: readonly ArKey[] = [
  'day.0',
  'day.1',
  'day.2',
  'day.3',
  'day.4',
  'day.5',
  'day.6',
];

/** The month-number → dictionary-key map (typed keys, no template union). */
const MONTH_KEYS: Readonly<Record<number, ArKey>> = {
  1: 'month.1',
  2: 'month.2',
  3: 'month.3',
  4: 'month.4',
  5: 'month.5',
  6: 'month.6',
  7: 'month.7',
  8: 'month.8',
  9: 'month.9',
  10: 'month.10',
  11: 'month.11',
  12: 'month.12',
};

/** The date a cell carries. */
interface CellDay {
  year: number;
  month: number;
  day: number;
  /** DD/MM/YYYY — the cell's own date form. */
  date: string;
}

export function MonthGrid({
  month,
  value,
  items,
  min,
  max,
  weekStart = 0,
  mode = 'single',
  onChange,
  className,
  id,
  style,
  ref,
  ...rest
}: MonthGridProps) {
  const today = startOfToday();

  /** The displayed month, normalized MM/YYYY (invalid → the current month). */
  const anchor = useMemo(() => {
    const parts = month.split('/');
    if (parts.length === 2) {
      const year = Number.parseInt(parts[1], 10);
      const parsed = Number.parseInt(parts[0], 10);
      if (Number.isFinite(year) && Number.isFinite(parsed) && parsed >= 1 && parsed <= 12) {
        return { year, month: parsed };
      }
    }
    return { year: today.year, month: today.month };
  }, [month, today.year, today.month]);

  /** The weeks of the displayed month: rows × 7 columns, the out-of-month
   *  days as null (empty cells, §3.5-2), the first row aligned to
   *  weekStart. */
  const weeks = useMemo(
    () => buildWeeks(anchor.year, anchor.month, weekStart),
    [anchor.year, anchor.month, weekStart],
  );

  /** The selection, split per mode. */
  const single = mode === 'single' && typeof value === 'string' ? value : undefined;
  const range = mode === 'range' && value !== undefined && typeof value !== 'string'
    ? (value as MonthGridRange)
    : undefined;

  /** The first day-carrying cell's date — the tab stop (roving tabindex). */
  const firstDay = weeks.flat().find((day) => day !== null)?.date;

  const classes = ['mds-month-grid', `mds-month-grid--${mode}`, className]
    .filter(Boolean)
    .join(' ');
  const gridName = t('month.srGrid', { month: t(MONTH_KEYS[anchor.month]), year: anchor.year });


  /** A cell press: single reports the day; range grows the draft. */
  const handlePick = (day: CellDay): void => {
    if (mode === 'single') {
      onChange?.(day.date);
      return;
    }
    if (mode !== 'range') return;
    if (range === undefined || range.start === undefined || range.end !== undefined) {
      // no draft, or a complete range — start over
      onChange?.({ start: day.date });
      return;
    }
    if (dateKey(day.date) <= dateKey(range.start)) {
      // before the current start, or the same day again — start over
      onChange?.({ start: day.date });
      return;
    }
    onChange?.({ start: range.start, end: day.date });
  };

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      role="grid"
      aria-label={gridName}
      data-month={`${String(anchor.month).padStart(2, '0')}/${anchor.year}`}
      onKeyDown={mode === 'view' ? undefined : (event) => walkArrows(event)}
      {...rest}
    >
      <div className="mds-month-days" role="row">
        {DAY_KEYS.map((_, index) => (
          <span key={index} className="mds-month-day-name mds-type-micro" role="columnheader">
            {t(DAY_KEYS[(index + weekStart) % 7])}
          </span>
        ))}
      </div>
      {weeks.map((week, rowIndex) => (
        <div className="mds-month-week" role="row" key={rowIndex}>
          {week.map((day, dayIndex) => {
            if (!day) {
              return (
                <span className="mds-month-cell mds-month-cell--empty" role="gridcell" key={dayIndex} />
              );
            }
            const focusable = day.date === firstDay;
            return (
              <DayCell
                key={day.date}
                day={day}
                selected={single === day.date}
                rangeStart={range?.start === day.date}
                rangeEnd={range?.end === day.date}
                inRange={
                  range?.start !== undefined
                  && range?.end !== undefined
                  && dateKey(range.start) <= dateKey(day.date)
                  && dateKey(day.date) <= dateKey(range.end)
                }
                count={items?.[day.date] ?? 0}
                disabled={
                  (min !== undefined && dateKey(day.date) < dateKey(min))
                  || (max !== undefined && dateKey(day.date) > dateKey(max))
                }
                focusable={focusable}
                mode={mode}
                isToday={epochDays(day) === epochDays(today)}
                onPick={handlePick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** One selectable day: the circle-number button inside its gridcell. */
function DayCell({
  day,
  selected,
  rangeStart,
  rangeEnd,
  inRange,
  count,
  disabled,
  focusable,
  mode,
  isToday,
  onPick,
}: {
  day: CellDay;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  count: number;
  disabled: boolean;
  focusable: boolean;
  mode: MonthGridMode;
  isToday: boolean;
  onPick: (day: CellDay) => void;
}) {
  const interactive = mode !== 'view' && !disabled;
  const { isPressed, pressProps } = usePress({
    onPress: () => onPick(day),
    disabled: !interactive,
  });
  const name = cellName(day, isToday, count);
  const classes = [
    'mds-month-cell-button',
    selected || rangeStart || rangeEnd ? 'mds-month-cell-button--selected' : '',
    inRange ? 'mds-month-cell-button--in-range' : '',
    rangeStart ? 'mds-month-cell-button--range-start' : '',
    rangeEnd ? 'mds-month-cell-button--range-end' : '',
    isToday ? 'mds-month-cell-button--today' : '',
    isPressed ? 'mds-month-cell-button--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const dots = (
    <span className={count >= 1 ? 'mds-month-dots' : 'mds-month-dots mds-month-dots--empty'} aria-hidden="true">
      {count >= 1 ? <span className="mds-month-dot" /> : null}
      {count >= 2 ? <span className="mds-month-dot" /> : null}
      {count >= 3 ? <span className="mds-month-dot" /> : null}
    </span>
  );
  const mark = (
    <span className="mds-month-mark">
      <span className="mds-month-mark-number mds-type-body">{day.day}</span>
    </span>
  );

  return (
    <span className="mds-month-cell" role="gridcell" aria-selected={selected || rangeStart || rangeEnd || inRange ? true : undefined}>
      {mode === 'view' ? (
        <span className="mds-month-cell-static" data-day={day.date}>
          {mark}
          {dots}
        </span>
      ) : (
        <button
          type="button"
          className={classes}
          aria-label={name}
          disabled={disabled}
          tabIndex={focusable ? 0 : -1}
          data-day={day.date}
          {...(interactive ? pressProps : {})}
        >
          {mark}
          {dots}
        </button>
      )}
    </span>
  );
}

/** Build the month's weeks: rows × 7, nulls for the out-of-month cells,
 *  the first row aligned to weekStart (criterion-4 alignment through the
 *  parent's PeriodSwitcher pairing). */
function buildWeeks(year: number, month: number, weekStart: number): (CellDay | null)[][] {
  const total = daysInMonth(year, month);
  /** The weekday of the 1st, shifted into weekStart columns. */
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() - weekStart + 7) % 7;
  const cells: (CellDay | null)[] = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let day = 1; day <= total; day += 1) {
    cells.push({ year, month, day, date: formatDateParts({ year, month, day }) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (CellDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** The cell's accessible name: «27 تشرين الثاني، خميس، اليوم، 3 عناصر». */
function cellName(day: CellDay, today: boolean, count: number): string {
  let name = t('month.srCell', {
    day: day.day,
    month: t(MONTH_KEYS[day.month]),
    weekday: t(DAY_KEYS[weekdayOf(day)]),
  });
  if (today) {
    name = t('month.srCellToday', { name, today: t('dateWord.today') });
  }
  if (count > 0) {
    name = t('month.srCellCount', { name, counted: pluralAr(count, pluralNouns.dayItems) });
  }
  return name;
}

/** The day's weekday, 0 = Sunday. */
function weekdayOf(day: CellDay): number {
  return new Date(Date.UTC(day.year, day.month - 1, day.day)).getUTCDay();
}

/** The arrow walk (§3.5-7): right = the earlier day (RTL's reading
 *  direction), left = the next day, up/down = a week. Disabled cells are
 *  skipped by the walk's own rule — focus never lands on a dead day. */
function walkArrows(event: React.KeyboardEvent<HTMLDivElement>): void {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  const active = document.activeElement as HTMLElement | null;
  if (!active || !active.dataset.day) return;
  const current = parseDay(active.dataset.day);
  if (!current) return;
  event.preventDefault();
  const shift = event.key === 'ArrowRight' ? -1
    : event.key === 'ArrowLeft' ? 1
      : event.key === 'ArrowUp' ? -7
        : 7;
  const next = formatDateParts(fromEpochDays(epochDays(current) + shift));
  const cell = event.currentTarget.querySelector(`button[data-day="${next}"]`) as HTMLElement | null;
  if (cell && !(cell as HTMLButtonElement).disabled) {
    cell.focus();
  }
}

function parseDay(value: string): { year: number; month: number; day: number } | undefined {
  const parts = value.split('/');
  if (parts.length !== 3) return undefined;
  const day = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  const year = Number.parseInt(parts[2], 10);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return undefined;
  return { year, month, day };
}
