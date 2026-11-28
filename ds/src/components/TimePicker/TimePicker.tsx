/**
 * TimePicker.tsx — the delivery-moment picker (BATCH2-SPECS §1.9 +
 * ADDENDUM §2.4).
 *
 * - The FIELD: a display-only trigger in the TextField look (the box rides
 *   TextField's own input class — the composed anatomy) showing the
 *   12-hour «4:00 م» in a tabular LTR run, with the clock 20 icon in
 *   text-secondary at its end, and an IconButton clear when a value
 *   exists (§2.4). Empty: no text, the icon alone (§1.9-4). Pressing the
 *   field opens the sheet; the clear button clears without opening it.
 * - Screen reader (§1.9-7): the field is a real button named
 *   «<التسمية>، 4:00 مساءً» — «ص»/«م» speak as «صباحاً»/«مساءً».
 * - The SHEET (92%, form): the drafted time in number-lg centered («4:15
 *   م») or «—» before anything is chosen; a SegmentedControl «ص»/«م»;
 *   the hour grid — 12 chips (12, 1..11) in 4 columns; the minute grid —
 *   4 chips (00, 15, 30, 45) in 4 columns (§2.4); and the ActionBar
 *   «اعتمد الوقت» which applies the draft and closes. Chips outside
 *   [min, max] disable (no valid completion exists with them).
 * - The hour/minute grids are TimePicker's OWN sheet anatomy (the
 *   addendum pins them inside it); the standalone SlotPicker component
 *   belongs to the second agent's branch and arrives at the merge.
 * - No <input type="time"> anywhere (criterion 2, rule 11).
 */
import { useState } from 'react';
import { t } from '../../i18n/ar';
import { ClockIcon } from '../../icons';
import { ClearIcon } from '../../icons';
import { formatTimeValue } from '../../lib/format-time';
import { usePress } from '../../lib/use-press';
import { ActionBar } from '../ActionBar/index';
import { IconButton } from '../IconButton/index';
import { SegmentedControl } from '../SegmentedControl/index';
import { Sheet } from '../Sheet/index';
import type { TimePickerProps } from './TimePicker.types';
import './TimePicker.css';

/** The hour chips in the addendum's fixed order: 12, 1..11 (§2.4). */
const HOURS: ReadonlyArray<number> = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function TimePicker({
  label,
  value,
  step = 15,
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
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const formatted = value !== undefined ? formatTimeValue(value) : undefined;
  const classes = [
    'mds-time-field',
    state === 'error' ? 'mds-time-field--error' : '',
    disabled ? 'mds-time-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-time-field-label mds-type-label">{label}</span>
      <FieldButton
        label={label}
        formatted={formatted}
        disabled={disabled}
        error={state === 'error'}
        onOpen={() => setOpen(true)}
        hasValue={value !== undefined}
        onClearValue={() => onChange?.(undefined)}
      />
      {state === 'error' ? (
        <span className="mds-time-field-error mds-type-caption">{t('timePicker.choose')}</span>
      ) : null}
      {open ? (
        <TimeSheet
          label={label}
          value={value}
          step={step}
          min={min}
          max={max}
          onApply={(next) => {
            onChange?.(next);
            setOpen(false);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </span>
  );
}

/** The display field: the TextField-look trigger with the clock icon and
 * (with a value) the clear IconButton. */
function FieldButton({
  label,
  formatted,
  disabled,
  error,
  onOpen,
  hasValue,
  onClearValue,
}: {
  label: string;
  formatted: { text: string; spoken: string } | undefined;
  disabled: boolean;
  error: boolean;
  onOpen: () => void;
  hasValue: boolean;
  onClearValue: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen, disabled });
  const name = formatted
    ? t('timePicker.srName', { label, time: formatted.spoken })
    : label;
  const classes = [
    'mds-text-field-input',
    'mds-picker-field-box',
    isPressed ? 'mds-picker-field-box--pressed' : '',
    error ? 'mds-time-field-box--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className="mds-picker-field-row">
      <button
        type="button"
        className={classes}
        aria-label={name}
        disabled={disabled}
        data-ds-exempt=""
        {...pressProps}
      >
        {formatted ? (
          <span className="mds-time-field-text">{formatted.text}</span>
        ) : (
          <span className="mds-time-field-text mds-time-field-text--empty" />
        )}
        <ClockIcon size={20} className="mds-time-field-icon" />
      </button>
      {hasValue ? (
        <IconButton label={t('sr.clear')} disabled={disabled} onPress={onClearValue}>
          <ClearIcon size={20} />
        </IconButton>
      ) : null}
    </span>
  );
}

/** The 92% sheet: the number-lg draft, the ص/م segments, the hour and
 * minute grids, and the apply bar (ADDENDUM §2.4). */
function TimeSheet({
  label,
  value,
  step,
  min,
  max,
  onApply,
  onDismiss,
}: {
  label: string;
  value: number | undefined;
  step: number;
  min: number | undefined;
  max: number | undefined;
  onApply: (value: number) => void;
  onDismiss: () => void;
}) {
  /** The draft: from the value, or nothing chosen yet («—»). The period
   * is its OWN state (switching ص/م works before any hour is picked). */
  const [draft, setDraft] = useState<number | undefined>(value);
  const [period, setPeriod] = useState<'am' | 'pm'>(value !== undefined && value >= 720 ? 'pm' : 'am');
  const current = draft !== undefined ? formatTimeValue(draft) : undefined;
  const isAm = period === 'am';

  const minuteChips = buildMinutes(step);
  const inRange = (time: number): boolean =>
    (min === undefined || time >= min) && (max === undefined || time <= max);
  const hourEnabled = (hour: number): boolean =>
    minuteChips.some((m) => inRange(toMinutes(hour, m, isAm)));
  const minuteEnabled = (minute: number): boolean =>
    HOURS.some((h) => inRange(toMinutes(h, minute, isAm)));

  const apply = () => {
    if (draft !== undefined) onApply(draft);
  };

  return (
    <Sheet variant="form" label={label} onDismiss={onDismiss}>
      <div className="mds-picker-sheet-head">
        <span className="mds-time-sheet-value mds-type-number-lg">
          {current ? current.text : t('money.missing')}
        </span>
      </div>
      <SegmentedControl
        label={t('time.periodGroup')}
        leading={[
          { value: 'am', label: t('time.am') },
          { value: 'pm', label: t('time.pm') },
        ]}
        value={period}
        onChange={(next) => {
          // switching the period re-bases the draft hour on the same
          // 12-hour clock position (12 ص <-> 12 م keeps «12»); with no
          // draft yet it simply arms the period for the next pick
          setPeriod(next === 'pm' ? 'pm' : 'am');
          if (draft === undefined) return;
          const hour24 = Math.floor(draft / 60);
          const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
          const newPeriod = next === 'pm' ? 12 : 0;
          const newHours = hour12 % 12 + newPeriod;
          setDraft(newHours * 60 + (draft % 60));
        }}
      />
      <SlotGrid
        title={t('time.hour')}
        options={HOURS.map((h) => ({
          value: String(h),
          label: String(h),
          disabled: !hourEnabled(h),
        }))}
        selected={draft === undefined ? undefined : String(Math.floor(draft / 60) % 12 === 0 ? 12 : Math.floor(draft / 60) % 12)}
        onChange={(hour) => {
          const h = Number.parseInt(hour, 10);
          const minutes = draft === undefined ? 0 : draft % 60;
          setDraft(toMinutes(h, minutes, isAm));
        }}
      />
      <SlotGrid
        title={t('time.minutes')}
        options={minuteChips.map((m) => ({
          value: String(m),
          label: m < 10 ? `0${m}` : String(m),
          disabled: !minuteEnabled(m),
        }))}
        selected={draft === undefined ? undefined : String(draft % 60)}
        onChange={(minute) => {
          const m = Number.parseInt(minute, 10);
          const hour = draft === undefined ? 12 : Math.floor(draft / 60);
          setDraft(hour * 60 + m);
        }}
      />
      <ActionBar label={t('timePicker.apply')} onPress={apply} disabled={draft === undefined} leading />
    </Sheet>
  );
}

/** Compose hour + minute + period into minutes since midnight. */
function toMinutes(hour12: number, minute: number, isAm: boolean): number {
  return (hour12 % 12 + (isAm ? 0 : 12)) * 60 + minute;
}

/** The minute chips at the step (00/15/30/45 at 15 — §2.4). */
function buildMinutes(step: number): number[] {
  const safe = step > 0 && 60 % step === 0 ? step : 15;
  return Array.from({ length: 60 / safe }, (_, i) => i * safe);
}

/** One chip grid: a titled radiogroup of chips in 4 columns (§2.4). */
function SlotGrid({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: ReadonlyArray<{ value: string; label: string; disabled: boolean }>;
  selected: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mds-time-slot">
      <span className="mds-time-slot-title mds-type-label-strong">{title}</span>
      <div className="mds-time-slot-grid" role="radiogroup" aria-label={title}>
        {options.map((option) => (
          <SlotChip
            key={option.value}
            option={option}
            selected={option.value === selected}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

function SlotChip({
  option,
  selected,
  onChange,
}: {
  option: { value: string; label: string; disabled: boolean };
  selected: boolean;
  onChange: (value: string) => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: () => onChange(option.value), disabled: option.disabled });
  const classes = [
    'mds-filter-chip',
    'mds-time-slot-chip',
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
      aria-label={option.label}
      disabled={option.disabled}
      data-ds-exempt={option.disabled ? undefined : ''}
      {...pressProps}
    >
      <span className="mds-filter-chip-label mds-time-slot-chip-label">{option.label}</span>
    </button>
  );
}
