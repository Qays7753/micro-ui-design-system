/**
 * Checkbox — the tickable row (ADDENDUM §3.1, BRIEF 9.4 «Toggle / Checkbox /
 * Radio: منطقة لمس 48»).
 *
 * - A row of size.row-plain with the row's own inline padding (23.18):
 *   the box (size.checkbox 20, r-xs) → 12 → the label (body 16/26) and the
 *   optional caption (13/20). The WHOLE row is the press zone (ق1).
 * - A REAL <input type="checkbox"> drives the state (ق2, 23.17): visually
 *   hidden, named by the label; the styled box is decoration. Ticked: the
 *   box fills brand-anchor and draws the check with motion.check-draw
 *   (23.14); unticked: a border-field hairline on surface.
 * - Error (a mandatory unticked box at submit): the box border turns
 *   status-problem-fg and the fix-it line sits under the row.
 * - Disabled: box border and label in disabled-fg — still readable (23.2).
 * - 200%: the label wraps, the box stays on the first line's axis.
 * - Motion: the fill motion.quick, the check motion.check-draw.
 */
import { SelectedIcon } from '../../icons';
import { t } from '../../i18n/ar';
import type { CheckboxProps } from './Checkbox.types';
import './Checkbox.css';

export function Checkbox({
  label,
  caption,
  selected = false,
  onChange,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  'aria-label': ariaLabel,
  ...rest
}: CheckboxProps) {
  // The row is the press zone: a <label> wrapping a real checkbox —
  // pointer and keyboard behave identically, and ds-states' native
  // disabled flip keeps working (the input is the interactive element).
  const classes = [
    'mds-checkbox',
    selected ? 'mds-checkbox--selected' : '',
    disabled ? 'mds-checkbox--disabled' : '',
    state === 'error' ? 'mds-checkbox--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label ref={ref} id={id} style={style} className={classes} {...rest}>
      <input
        type="checkbox"
        className="mds-checkbox-input"
        checked={selected}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label={ariaLabel}
        aria-invalid={state === 'error' || undefined}
      />
      <span className="mds-checkbox-box" aria-hidden="true">
        <SelectedIcon size={14} />
      </span>
      <span className="mds-checkbox-text">
        <span className="mds-checkbox-label mds-type-body">{label}</span>
        {caption ? <span className="mds-checkbox-caption mds-type-caption">{caption}</span> : null}
      </span>
      {state === 'error' ? (
        <span className="mds-checkbox-error mds-type-caption">{t('checkbox.tickThis')}</span>
      ) : null}
    </label>
  );
}
