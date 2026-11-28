/**
 * format-period.ts — the period label words (BATCH2-SPECS §1.27).
 *
 * A period VALUE is a size plus its start (DD/MM/YYYY, Western digits —
 * criterion 2 of DateQuickChips' date form, ج7). The visible words:
 * day «27/11/2026» (and «اليوم» when it IS today), week «23/11 – 29/11»,
 * month «11/2026», custom «01/11/2026 – 15/11/2026». The SPOKEN words
 * (§1.27-7) name the months Levantine: «تشرين الثاني 2026» (criterion 3:
 * the screen shows MM/YYYY, the reader says the Levantine name).
 *
 * Every word reads through t() so host-app overrides flow in (3ج.1).
 * The date math lives here on UTC epoch-days — no timezone drift — so
 * MonthGrid (the next unit) can ride the same helpers.
 */
import { t } from '../i18n/ar';
import type { ArKey } from '../i18n/ar';
import type { PeriodSize, PeriodValue } from '../components/PeriodSwitcher/index';

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

/** A calendar day without time (the lab's fixed clock is a date, never an instant). */
export interface SimpleDate {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
}

/** The two words of a formatted period: what it shows and what it speaks. */
export interface FormattedPeriod {
  /** «11/2026» — the visible label (Western tabular digits, LTR run). */
  text: string;
  /** «تشرين الثاني 2026» — the spoken form for names and announcements. */
  spoken: string;
}

/** Parse a DD/MM/YYYY string; undefined when it is not a real date. */
export function parseDateParts(value: string | undefined): SimpleDate | undefined {
  if (!value) return undefined;
  const parts = value.split('/');
  if (parts.length !== 3) return undefined;
  const day = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  const year = Number.parseInt(parts[2], 10);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return undefined;
  }
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return undefined;
  }
  return { year, month, day };
}

/** The days in a month (1..12). */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Format as DD/MM/YYYY (two-digit day and month — the label form). */
export function formatDateParts(date: SimpleDate): string {
  return `${pad2(date.day)}/${pad2(date.month)}/${date.year}`;
}

/** Days since 1970-01-01 (UTC) — the comparison and stepping unit. */
export function epochDays(date: SimpleDate): number {
  return Math.floor(Date.UTC(date.year, date.month - 1, date.day) / 86_400_000);
}

/** The date `days` epoch-days after 1970-01-01. */
export function fromEpochDays(days: number): SimpleDate {
  const utc = new Date(days * 86_400_000);
  return { year: utc.getUTCFullYear(), month: utc.getUTCMonth() + 1, day: utc.getUTCDate() };
}

/** A comparable number for a DD/MM/YYYY string (NaN when invalid). */
export function dateKey(value: string | undefined): number {
  const parsed = parseDateParts(value);
  if (!parsed) return Number.NaN;
  return parsed.year * 10000 + parsed.month * 100 + parsed.day;
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** The weekday of a date, 0 = Sunday .. 6 = Saturday. */
function weekday(date: SimpleDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/** The first day of the `weekStart`-based week that contains `date`. */
export function weekStartOf(date: SimpleDate, weekStart: number): SimpleDate {
  const shift = (weekday(date) - weekStart + 7) % 7;
  return fromEpochDays(epochDays(date) - shift);
}

/** The first day of `date`'s month. */
export function monthStartOf(date: SimpleDate): SimpleDate {
  return { year: date.year, month: date.month, day: 1 };
}

/** The last day of `date`'s month. */
export function monthEndOf(date: SimpleDate): SimpleDate {
  return { year: date.year, month: date.month, day: daysInMonth(date.year, date.month) };
}

/**
 * Snap a period's start to its size's grid: the week to its weekStart
 * boundary, the month to its first day (criterion 4: the week starts at
 * weekStart). A custom range keeps its days but orders them.
 */
export function normalizePeriod(value: PeriodValue, weekStart: number): PeriodValue {
  const start = parseDateParts(value.start);
  if (!start) return value;
  if (value.size === 'week') {
    return { ...value, start: formatDateParts(weekStartOf(start, weekStart)) };
  }
  if (value.size === 'month') {
    return { ...value, start: formatDateParts(monthStartOf(start)) };
  }
  if (value.size === 'custom') {
    const end = parseDateParts(value.end ?? value.start) ?? start;
    const [first, second] = epochDays(start) <= epochDays(end) ? [start, end] : [end, start];
    return { size: 'custom', start: formatDateParts(first), end: formatDateParts(second) };
  }
  return { ...value, start: formatDateParts(start) };
}

/** The period's last day (derived for the fixed sizes, `end` for custom;
 * the start is already grid-snapped, so no weekStart is needed). */
export function periodEnd(value: PeriodValue): SimpleDate {
  const start = parseDateParts(value.start);
  if (!start) return startOfToday();
  if (value.size === 'day') return start;
  if (value.size === 'week') return fromEpochDays(epochDays(start) + 6);
  if (value.size === 'month') return monthEndOf(start);
  const end = parseDateParts(value.end ?? value.start);
  return end ?? start;
}

/** One step back (-1) or forward (+1) in the period's own size. */
export function stepPeriod(value: PeriodValue, weekStart: number, direction: 1 | -1): PeriodValue {
  const normalized = normalizePeriod(value, weekStart);
  const start = parseDateParts(normalized.start);
  if (!start) return normalized;
  if (normalized.size === 'month') {
    const month = start.month + direction;
    const next = month < 1
      ? { year: start.year - 1, month: 12, day: 1 }
      : month > 12
        ? { year: start.year + 1, month: 1, day: 1 }
        : { year: start.year, month, day: 1 };
    return { size: 'month', start: formatDateParts(next) };
  }
  if (normalized.size === 'week') {
    return { size: 'week', start: formatDateParts(fromEpochDays(epochDays(start) + direction * 7)) };
  }
  if (normalized.size === 'custom') {
    // A custom range steps by its own length (the documented reading:
    // the spec names only day/week/month steps; the range keeps its
    // length — recorded in the unit's report row).
    const length = epochDays(periodEnd(normalized)) - epochDays(start) + 1;
    const shift = direction * length;
    return {
      size: 'custom',
      start: formatDateParts(fromEpochDays(epochDays(start) + shift)),
      end: formatDateParts(fromEpochDays(epochDays(periodEnd(normalized)) + shift)),
    };
  }
  return { size: 'day', start: formatDateParts(fromEpochDays(epochDays(start) + direction)) };
}

/** The period of `size` that contains `today` («الفترة الحالية», §1.27-2). */
export function currentPeriod(size: PeriodSize, weekStart: number, today: SimpleDate): PeriodValue {
  if (size === 'month') {
    return { size: 'month', start: formatDateParts(monthStartOf(today)) };
  }
  if (size === 'week') {
    return { size: 'week', start: formatDateParts(weekStartOf(today, weekStart)) };
  }
  return { size: 'day', start: formatDateParts(today) };
}

/** Two periods are the same period (size + grid-snapped start). */
export function isSamePeriod(a: PeriodValue, b: PeriodValue): boolean {
  return dateKey(a.start) === dateKey(b.start) && a.size === b.size;
}

/** Today as a SimpleDate (UTC — the date the words compare against). */
export function startOfToday(): SimpleDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

/** The Levantine month name from the dictionary (§0.2-6). */
function spokenMonth(month: number): string {
  return t(MONTH_KEYS[month]);
}

/** One spoken side: «27 تشرين الثاني» (the year joins at the range level). */
function spokenDayMonth(date: SimpleDate): string {
  return `${date.day} ${spokenMonth(date.month)}`;
}

/** Format a period into its visible and spoken words. */
export function formatPeriod(
  value: PeriodValue,
  weekStart: number,
  today: SimpleDate = startOfToday(),
): FormattedPeriod {
  const normalized = normalizePeriod(value, weekStart);
  const start = parseDateParts(normalized.start);
  if (!start) return { text: '', spoken: '' };
  const end = periodEnd(normalized);

  if (normalized.size === 'month') {
    return {
      text: `${pad2(start.month)}/${start.year}`,
      spoken: `${spokenMonth(start.month)} ${start.year}`,
    };
  }
  if (normalized.size === 'week') {
    return {
      text: `${formatDayMonth(start)} – ${formatDayMonth(end)}`,
      spoken: `${spokenDayMonth(start)} ${t('period.spokenTo')} ${spokenSide(end, start)}`,
    };
  }
  if (normalized.size === 'custom') {
    return {
      text: `${formatDateParts(start)} – ${formatDateParts(end)}`,
      spoken: `${spokenDayMonth(start)} ${t('period.spokenTo')} ${spokenSide(end, start)}`,
    };
  }
  const isToday = epochDays(start) === epochDays(today);
  return {
    text: isToday ? t('dateWord.today') : formatDateParts(start),
    spoken: `${start.day} ${spokenMonth(start.month)} ${start.year}`,
  };
}

/** «29/11» — the week label's short side (day+month only). */
function formatDayMonth(date: SimpleDate): string {
  return `${pad2(date.day)}/${pad2(date.month)}`;
}

/** The closing side of a spoken range — its own month, and the year (also
 * the start's year when the two years differ). */
function spokenSide(end: SimpleDate, start: SimpleDate): string {
  if (end.year !== start.year) {
    return `${spokenDayMonth(end)} ${end.year} ${start.year}`;
  }
  if (end.month !== start.month) {
    return `${spokenDayMonth(end)} ${end.year}`;
  }
  return `${end.day} ${spokenMonth(end.month)} ${end.year}`;
}
