/**
 * AmountField — the amount input (ADDENDUM §1.3, BRIEF 9.4).
 *
 * - Height size.amount-field (72), r-md, surface, the border.field hairline,
 *   horizontal padding chip-padding (§1.3-2). The digits render
 *   amount-input 32/40/500 tabular inside a dir=ltr isolation, START
 *   aligned; the unit «د» sits FIXED at the end as body-strong
 *   text-secondary — never removable, never in the label (ق5).
 * - Starts EMPTY (rule 15/§1.3-4) — no placeholder (ق2).
 * - inputmode=decimal, enterkeyhint=next, NO type=number (23.24(10)); the
 *   entry normalizes per ADDENDUM §1.3-5 (Arabic-Indic → western, «٫»/«,» →
 *   «.», ≤3 fraction digits, no thousand separators while typing).
 * - On blur the value displays MONEY-formatted without the unit
 *   («1,280.500» — the thousands grouping, ADDENDUM §1.4); on focus it
 *   returns to the raw digits (§1.3-5).
 * - If the digits outgrow amount-input: one step down to number-lg
 *   (23.20, ADDENDUM 2.1), then the field scrolls horizontally — never
 *   clipping (ق6: «1,250,000.125» fits at 320 unfclipped).
 * - error: the problem border + the solution caption («اكتب المبلغ
 *   بالأرقام» / «اكتب مبلغاً أكبر من صفر», §1.3-4); draft leaves the field
 *   unchanged (the badge rides SaveState).
 */
import { useState } from 'react';
import { normalizeAmount } from '../../lib/normalize-amount';
import { formatMoney } from '../../lib/format-money';
import { moneyTexts } from '../../i18n/ar';
import type { AmountFieldProps } from './AmountField.types';
import './AmountField.css';

export function AmountField({
  label,
  caption,
  value = '',
  onChange,
  disabled = false,
  state = 'idle',
  draft = false,
  className,
  id,
  style,
  ref,
  ...rest
}: AmountFieldProps) {
  const [focused, setFocused] = useState(false);
  const classes = [
    'mds-amount-field',
    disabled ? 'mds-amount-field--disabled' : '',
    state === 'error' ? 'mds-amount-field--error' : '',
    draft ? 'mds-amount-field--draft' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // §1.3-5: raw digits while focused; on blur the Money grouping without
  // the unit («1,280.500», ADDENDUM §1.4 — always 3 fraction digits when
  // present, none when zero).
  const display = focused || value === ''
    ? value
    : formatMoney(value, { texts: moneyTexts }).int + (value.includes('.') ? formatMoney(value, { texts: moneyTexts }).frac : '');

  return (
    <div id={id} style={style} className={classes} {...rest}>
      <span className="mds-amount-field-label">{label}</span>
      <div className="mds-amount-field-box">
        <input
          ref={ref}
          className="mds-amount-field-input"
          inputMode="decimal"
          enterKeyHint="next"
          value={display}
          disabled={disabled}
          aria-label={label}
          aria-invalid={state === 'error' || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          data-long={display.length > 13 ? 'true' : undefined}
          onChange={(e) => onChange?.(normalizeAmount(e.target.value))}
        />
        <span className="mds-amount-field-unit">{moneyTexts.unit}</span>
      </div>
      {state === 'error' && caption ? (
        <span className="mds-amount-field-help">{caption}</span>
      ) : caption ? (
        <span className="mds-amount-field-help">{caption}</span>
      ) : null}
    </div>
  );
}
