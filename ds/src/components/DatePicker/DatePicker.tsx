/**
 * DatePicker.tsx — the date picker (ADDENDUM §3.4 — a composition, §9.4).
 *
 * - The FIELD rides the shared picker-field anatomy (base.css): a
 *   display-only trigger in the TextField look (the box rides
 *   mds-text-field-input) showing «30/11/2026» in a tabular LTR run, the
 *   calendar icon 20 in text-secondary at its end, and the clear
 *   IconButton AFTER the box when the field is optional and carries a
 *   value. Empty: no text, the icon stays (§3.4-4). The error looks like
 *   TextField's.
 * - The press opens the 50% MonthSheet — PeriodSwitcher in month-only
 *   mode + MonthGrid single at weekStart 0, no ActionBar: choosing a day
 *   closes the sheet and writes DD/MM/YYYY (criterion 2). The sheet's
 *   default month: the value's month, else the current month (§3.4-4).
 * - No <input type="date"> anywhere (criterion 1, rule 11).
 * - Screen reader (§3.4-7): the field button is named
 *   «<التسمية>، 30 تشرين الثاني 2026» (the Levantine month through the
 *   format-period words — host overrides flow in, 3ج.1).
 */
import { useState } from 'react';
import { t } from '../../i18n/ar';
import { CalendarIcon, ClearIcon } from '../../icons';
import { formatPeriod } from '../../lib/format-period';
import { usePress } from '../../lib/use-press';
import { IconButton } from '../IconButton/index';
import { MonthSheet } from './MonthSheet';
import type { DatePickerProps } from './DatePicker.types';
import './DatePicker.css';

export function DatePicker({
  label,
  value,
  min,
  max,
  onChange,
  optional = false,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const classes = [
    'mds-date-field',
    state === 'error' ? 'mds-date-field--error' : '',
    disabled ? 'mds-date-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  /** «30 تشرين الثاني 2026» — the spoken day form (format-period). */
  const spoken = value !== undefined
    ? formatPeriod({ size: 'day', start: value }, 0).spoken
    : undefined;
  const name = spoken !== undefined
    ? t('datePicker.srName', { label, date: spoken })
    : label;

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-date-field-label mds-type-label">{label}</span>
      <FieldButton
        name={name}
        text={value}
        disabled={disabled}
        error={state === 'error'}
        onOpen={() => setOpen(true)}
        hasValue={value !== undefined}
        optional={optional}
        onClearValue={() => onChange?.(undefined)}
      />
      {state === 'error' ? (
        <span className="mds-date-field-error mds-type-caption">{t('dateQuick.choose')}</span>
      ) : null}
      {open ? (
        <MonthSheet
          label={label}
          value={value}
          min={min}
          max={max}
          onChange={(next) => {
            onChange?.(next);
            setOpen(false);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </span>
  );
}

/** The display field: the TextField-look trigger, the calendar icon, and
 *  the optional clear button. */
function FieldButton({
  name,
  text,
  disabled,
  error,
  onOpen,
  hasValue,
  optional,
  onClearValue,
}: {
  name: string;
  text: string | undefined;
  disabled: boolean;
  error: boolean;
  onOpen: () => void;
  hasValue: boolean;
  optional: boolean;
  onClearValue: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen, disabled });
  const classes = [
    'mds-text-field-input',
    'mds-picker-field-box',
    isPressed ? 'mds-picker-field-box--pressed' : '',
    error ? 'mds-date-field-box--error' : '',
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
        {...pressProps}
      >
        {text ? (
          <span className="mds-date-field-text">{text}</span>
        ) : (
          <span className="mds-date-field-text mds-date-field-text--empty" />
        )}
        <CalendarIcon size={20} className="mds-date-field-icon" />
      </button>
      {optional && hasValue ? (
        <IconButton label={t('sr.clear')} disabled={disabled} onPress={onClearValue}>
          <ClearIcon size={20} />
        </IconButton>
      ) : null}
    </span>
  );
}
