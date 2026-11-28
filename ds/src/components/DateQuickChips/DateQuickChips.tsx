/**
 * DateQuickChips.tsx — the quick-date single-choice chips (BATCH2-SPECS §1.8).
 *
 * - The chip anatomy is COMPOSED: the chips render FilterChips' own
 *   mds-filter-chip classes (the shared chip look, pressed/selected/
 *   disabled treatments — §1.8-2 «صف رقائق بشكل FilterChips»); this file
 *   owns the row (WRAPPING — no horizontal scroll here, §1.8-6) and the
 *   error line. Selection rides motion.quick (the chips' own transition).
 * - Single choice (§1.8-2 «باختيار واحد»): the quick chips plus the
 *   trailing «تاريخ آخر» chip carrying calendar 16. When the value is a
 *   date none of the quick chips carries, the trailing chip BECOMES that
 *   date («14/07/2026») selected (§1.8-2) — criterion 1: at most one
 *   selected chip, criterion 2: the date reads DD/MM/YYYY.
 * - Screen reader (§1.8-7): a radiogroup named by the label; each chip a
 *   radio named «اليوم، 27/11/2026» (word + date).
 * - error (§1.8-4): saving with nothing chosen shows «اختر التاريخ» under
 *   the row — a line under, never a repeated date text (criterion 4).
 * - The trailing chip with no custom date opens THE COMPOSITION'S OWN
 *   month sheet (ADDENDUM §3.4-2: DateQuickChips rides the DatePicker
 *   sheet — PeriodSwitcher month-only + MonthGrid single, no ActionBar);
 *   picking a day reports it through onChange and closes. min and max
 *   flow into the sheet's days (§1.8-2).
 * - No <input type="date"> anywhere (criterion 3, rule 11).
 */
import { useState } from 'react';
import { t } from '../../i18n/ar';
import { CalendarIcon } from '../../icons';
import { usePress } from '../../lib/use-press';
import { MonthSheet } from '../DatePicker/index';
import type { DateQuickChipOption } from './DateQuickChips.types';
import type { DateQuickChipsProps } from './DateQuickChips.types';
import './DateQuickChips.css';

/** Parse a DD/MM/YYYY string into a comparable number (NaN when invalid). */
function dateKey(value: string | undefined): number {
  if (!value) return Number.NaN;
  const parts = value.split('/');
  if (parts.length !== 3) return Number.NaN;
  const day = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  const year = Number.parseInt(parts[2], 10);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return Number.NaN;
  }
  return year * 10000 + month * 100 + day;
}

export function DateQuickChips({
  label,
  value,
  items,
  min,
  max,
  onChange,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DateQuickChipsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const quickSelected = items.some((item) => item.value === value);
  /** A value none of the quick chips carries rides the trailing chip. */
  const customDate = value !== undefined && !quickSelected ? value : undefined;

  const outside = (date: string): boolean => {
    const key = dateKey(date);
    const minKey = dateKey(min);
    const maxKey = dateKey(max);
    if (Number.isFinite(key) && Number.isFinite(minKey) && key < minKey) return true;
    if (Number.isFinite(key) && Number.isFinite(maxKey) && key > maxKey) return true;
    return false;
  };

  const classes = [
    'mds-date-quick',
    state === 'error' ? 'mds-date-quick--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      role="radiogroup"
      aria-label={label}
      data-value={value ?? ''}
      {...rest}
    >
      <div className="mds-date-quick-row">
        {items.map((item) => (
          <QuickChip
            key={item.value}
            item={item}
            selected={item.value === value}
            disabled={disabled || outside(item.value)}
            onChange={onChange}
          />
        ))}
        <OtherChip
          customDate={customDate}
          disabled={disabled}
          onChange={onChange}
          onOpenSheet={() => setSheetOpen(true)}
        />
      </div>
      {state === 'error' ? (
        <span className="mds-date-quick-error mds-type-caption">{t('dateQuick.choose')}</span>
      ) : null}
      {sheetOpen ? (
        <MonthSheet
          label={t('dateQuick.other')}
          value={customDate}
          min={min}
          max={max}
          onChange={(next) => {
            onChange?.(next);
            setSheetOpen(false);
          }}
          onDismiss={() => setSheetOpen(false)}
        />
      ) : null}
    </div>
  );
}

/** One quick chip — the FilterChips anatomy with radio semantics. */
function QuickChip({
  item,
  selected,
  disabled,
  onChange,
}: {
  item: DateQuickChipOption;
  selected: boolean;
  disabled: boolean;
  onChange?: (value: string) => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: () => onChange?.(item.value), disabled });
  const classes = [
    'mds-filter-chip',
    'mds-date-quick-chip',
    selected ? 'mds-filter-chip--selected' : '',
    isPressed ? 'mds-filter-chip--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="radio"
      className={classes}
      aria-checked={selected}
      aria-label={t('dateQuick.chipName', { label: item.label, value: item.value })}
      disabled={disabled}
      data-ds-exempt={disabled ? undefined : ''}
      {...pressProps}
    >
      <span className="mds-filter-chip-label">{item.label}</span>
    </button>
  );
}

/** The trailing chip: «تاريخ آخر» (calendar 16) until a custom date
 * exists, then the date itself, selected (§1.8-2). With no custom date,
 * the press opens the composition's own month sheet (§3.4-2). */
function OtherChip({
  customDate,
  disabled,
  onChange,
  onOpenSheet,
}: {
  customDate: string | undefined;
  disabled: boolean;
  onChange?: (value: string) => void;
  onOpenSheet: () => void;
}) {
  const selected = customDate !== undefined;
  const { isPressed, pressProps } = usePress({
    onPress: () => (selected ? onChange?.(customDate) : onOpenSheet()),
    disabled,
  });
  const classes = [
    'mds-filter-chip',
    'mds-date-quick-chip',
    'mds-date-quick-chip--other',
    selected ? 'mds-filter-chip--selected' : '',
    isPressed ? 'mds-filter-chip--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="radio"
      className={classes}
      aria-checked={selected}
      aria-label={selected ? customDate : t('dateQuick.other')}
      disabled={disabled}
      data-ds-exempt={disabled ? undefined : ''}
      {...pressProps}
    >
      {selected ? (
        <span className="mds-filter-chip-label mds-date-quick-chip-date">{customDate}</span>
      ) : (
        <>
          <CalendarIcon size={16} className="mds-date-quick-chip-icon" />
          <span className="mds-filter-chip-label">{t('dateQuick.other')}</span>
        </>
      )}
    </button>
  );
}
