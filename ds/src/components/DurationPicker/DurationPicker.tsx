/**
 * DurationPicker.tsx — the appointment duration picker (BATCH2-SPECS
 * ADDENDUM §3.3).
 *
 * - The FIELD: a display-only trigger in the TextField look (the box rides
 *   TextField's own input class — the composed anatomy, the TimePicker
 *   pattern) showing the duration words «45 دقيقة»، «ساعة»، «ساعة و15
 *   دقيقة»، «ساعتان»، «12 ساعة» (lib/format-duration), with an IconButton
 *   clear at the end when a value exists. Empty: no text.
 * - The SHEET (50%): the drafted duration in number-lg centered (or «—»
 *   before any choice); «مدد شائعة» — the addendum's eight common
 *   durations as single-choice chips in TWO columns; «مدة أخرى» — the
 *   QuantityStepper at step 15, min 15, max 720, its value ANNOUNCED as
 *   text (a polite region reads formatDuration, never the bare number);
 *   and the ActionBar «اعتمد المدة» which applies the draft and closes.
 * - Screen reader (§3.3-7): the field is a real button named
 *   «<التسمية>، ساعة و15 دقيقة».
 * - A duration past midnight is allowed with no error (§3.3-4).
 * - The chip grid is the sheet's OWN anatomy (the addendum pins it inside
 *   DurationPicker); the standalone SlotPicker component belongs to the
 *   second agent's branch and arrives at the merge.
 */
import { useState } from 'react';
import { t } from '../../i18n/ar';
import { ClearIcon } from '../../icons';
import { formatDuration } from '../../lib/format-duration';
import { usePress } from '../../lib/use-press';
import { ActionBar } from '../ActionBar/index';
import { IconButton } from '../IconButton/index';
import { QuantityStepper } from '../QuantityStepper/index';
import { Sheet } from '../Sheet/index';
import type { DurationPickerProps } from './DurationPicker.types';
import './DurationPicker.css';

/** The addendum's eight common durations, minutes (§3.3-2). */
const COMMON: ReadonlyArray<number> = [15, 30, 45, 60, 90, 120, 180, 240];

export function DurationPicker({
  label,
  value,
  min = 15,
  max = 720,
  step = 15,
  onChange,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: DurationPickerProps) {
  const [open, setOpen] = useState(false);
  const classes = [
    'mds-duration-field',
    disabled ? 'mds-duration-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-duration-field-label mds-type-label">{label}</span>
      <DurationFieldButton
        label={label}
        text={value !== undefined ? formatDuration(value) : undefined}
        disabled={disabled}
        onOpen={() => setOpen(true)}
        hasValue={value !== undefined}
        onClearValue={() => onChange?.(undefined)}
      />
      {open ? (
        <DurationSheet
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
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

/** The display field: the TextField-look trigger with the clear button. */
function DurationFieldButton({
  label,
  text,
  disabled,
  onOpen,
  hasValue,
  onClearValue,
}: {
  label: string;
  text: string | undefined;
  disabled: boolean;
  onOpen: () => void;
  hasValue: boolean;
  onClearValue: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen, disabled });
  const name = text
    ? t('durationPicker.srName', { label, duration: text })
    : label;
  const classes = [
    'mds-text-field-input',
    'mds-picker-field-box',
    isPressed ? 'mds-picker-field-box--pressed' : '',
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
        <span className="mds-duration-field-text">{text ?? ''}</span>
      </button>
      {hasValue ? (
        <IconButton label={t('sr.clear')} disabled={disabled} onPress={onClearValue}>
          <ClearIcon size={20} />
        </IconButton>
      ) : null}
    </span>
  );
}

/** The 50% sheet: the number-lg draft, the common chips (2 columns), the
 * «مدة أخرى» stepper, and the apply bar (§3.3-2). */
function DurationSheet({
  label,
  value,
  min,
  max,
  step,
  onApply,
  onDismiss,
}: {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  step: number;
  onApply: (value: number) => void;
  onDismiss: () => void;
}) {
  /** The draft: from the value, or nothing chosen yet («—»). */
  const [draft, setDraft] = useState<number | undefined>(value);
  const text = draft !== undefined ? formatDuration(draft) : undefined;

  return (
    <Sheet label={label} onDismiss={onDismiss}>
      <div className="mds-picker-sheet-head">
        <span className="mds-duration-sheet-value mds-type-number-lg">
          {text ?? t('money.missing')}
        </span>
      </div>
      <div className="mds-duration-common" role="radiogroup" aria-label={t('duration.common')}>
        {COMMON.map((minutes) => (
          <CommonChip
            key={minutes}
            label={formatDuration(minutes)}
            selected={draft === minutes}
            onChange={() => setDraft(minutes)}
          />
        ))}
      </div>
      <div className="mds-duration-other">
        <span className="mds-duration-other-title mds-type-label-strong">{t('duration.other')}</span>
        {/* The stepper rides the 15-minute step itself (§3.3: «بخطوة 15
            دقيقة») — its buttons move by 15 and its typed values snap to
            the grid; the wrapper only guards the bounds. */}
        <QuantityStepper
          label={t('duration.other')}
          value={draft}
          min={min}
          max={max}
          step={step}
          onChange={(next) => setDraft(Math.min(Math.max(next, min), max))}
        />
        {/* §3.3-7: the stepper announces the TEXT, never the bare number. */}
        <span className="mds-visually-hidden" aria-live="polite">
          {text ?? ''}
        </span>
        <span className="mds-duration-other-text mds-type-body">{text ?? ''}</span>
      </div>
      <ActionBar
        label={t('durationPicker.apply')}
        onPress={() => draft !== undefined && onApply(draft)}
        disabled={draft === undefined}
        leading
      />
    </Sheet>
  );
}

function CommonChip({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: boolean;
  onChange: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onChange });
  const classes = [
    'mds-filter-chip',
    'mds-duration-common-chip',
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
      aria-label={label}
      data-ds-exempt=""
      {...pressProps}
    >
      <span className="mds-filter-chip-label mds-duration-common-chip-label">{label}</span>
    </button>
  );
}
