/**
 * WeekStrip — the week-day picker at the top of the calendar
 * (BATCH2-SPECS §3.2).
 *
 * - A full-width surface strip (hairline top/bottom only, و-2 item 26)
 *   with 7 equal cells: screen ÷ 7 each (ق1: ≥ touch-min wide on 360 —
 *   45.7 on 320 is BELOW it, recorded in the report per §3.2 item 6).
 * - Cell anatomy: the short day name (micro, secondary) → 4 → the date
 *   in a day-mark 36 circle (no leading zero, ق2) → 4 → the item
 *   indicator: up to 3 dot-event dots, 4+ the count (§3.2 item 2).
 * - Today: the today-ring around the circle (ق3: today's cell ONLY).
 *   Selected: brand-anchor fill with on-anchor number; the ring stays
 *   when today is selected.
 * - Screen reader: radiogroup; a cell reads «خميس 27 تشرين الثاني،
 *   اليوم، 3 عناصر» (§3.2 item 7).
 * - Loading: the cells render, the dots do not (§3.2 item 4).
 */
import { t } from '../../i18n/ar';
import type { ArKey } from '../../i18n/ar';
import type { WeekStripDay, WeekStripProps } from './WeekStrip.types';
import './WeekStrip.css';

/** Parse '2026-11-27' into its parts (no Date parsing: stable and TZ-safe). */
function parseIso(date: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

/** Day-of-week (0=Sunday) from a Gregorian date — Sakamoto's method. */
function dayOfWeek(y: number, m: number, d: number): number {
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  const yy = m < 3 ? y - 1 : y;
  return (yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) + t[m - 1] + d) % 7;
}

export function WeekStrip({
  items,
  value,
  today,
  weekStart: _weekStart = 0,
  onChange,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: WeekStripProps) {
  const loading = state === 'loading';
  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="radiogroup"
      className={['mds-week-strip', className].filter(Boolean).join(' ')}
      data-ds-check="week-strip"
      {...rest}
    >
      {items.map((day: WeekStripDay) => {
        const parts = parseIso(day.date);
        if (!parts) return null;
        const dow = dayOfWeek(parts.y, parts.m, parts.d);
        const selected = value === day.date;
        const isToday = today === day.date;
        const count = day.items ?? 0;
        // 3ج.1: day/month words resolve through t() so overrides flow.
        const dayName = t(`day.${dow}` as ArKey) ?? String(dow);
        const monthName = t(`month.${parts.m}` as ArKey) ?? String(parts.m);
        const ariaLabel = [
          `${dayName} ${parts.d} ${monthName}`,
          isToday ? t('sr.weekStripToday') : '',
          count > 0 ? t('sr.weekStripItems', { counted: count }) : '',
        ]
          .filter(Boolean)
          .join(t('sr.listSeparator'));
        return (
          <button
            key={day.date}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={ariaLabel}
            className={[
              'mds-week-strip-day',
              selected ? 'mds-week-strip-day--selected' : '',
              isToday ? 'mds-week-strip-day--today' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange?.(day.date)}
          >
            <span className="mds-week-strip-name mds-type-micro">{dayName}</span>
            <span className="mds-week-strip-mark">{parts.d}</span>
            {!loading && count > 0 ? (
              <span className="mds-week-strip-dots" aria-hidden="true">
                {count <= 3 ? (
                  Array.from({ length: count }, (_, i) => (
                    <span key={i} className="mds-week-strip-dot" />
                  ))
                ) : (
                  <span className="mds-week-strip-count mds-type-micro">{count}</span>
                )}
              </span>
            ) : (
              <span className="mds-week-strip-dots" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
