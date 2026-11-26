/**
 * TextField — the single-line text field (BRIEF 9.3, 23.24(10)).
 *
 * - 56 high, radius 16, 1px border-field; label above (`label` type, 8 gap),
 *   help below (`caption`, 4 gap). The input text is body 16+ (plan S4:
 *   خط الحقول ≥ 16) — never smaller.
 * - Focus: 2px brand-text border + the 4px brand-selected-bg halo,
 *   on :focus-visible (keyboard) as well as pointer focus — a text caret is
 *   keyboard interaction by definition.
 * - Error: the border turns status-problem-fg and the caption row shows the
 *   solution text with the tone-problem icon (9.3).
 * - Placeholder is a format hint in text-secondary (23.24(10)); the caret is
 *   brand-text, the selection background brand-selected-bg, and the browser
 *   autofill fill is cancelled (surface background restored).
 * - The label names the input: htmlFor by `id`, aria-label otherwise.
 */
import { ToneProblemIcon } from '../../icons';
import { t } from '../../i18n/ar';
import type { TextFieldProps } from './TextField.types';
import './TextField.css';

export function TextField({
  label,
  caption,
  value,
  onChange,
  placeholder,
  state = 'idle',
  disabled = false,
  optional = false,
  className,
  id,
  style,
  ref,
  ...rest
}: TextFieldProps) {
  const classes = [
    'mds-text-field',
    state === 'error' ? 'mds-text-field--error' : '',
    disabled ? 'mds-text-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const inputId = id ? `${id}-input` : undefined;

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      <label className="mds-text-field-label" htmlFor={inputId}>
        {label}
        {/* Rule 67: optional fields ALONE carry the mark, one uniform shape:
            the dictionary word after the label in caption type. Required
            fields are never marked. */}
        {optional ? <span className="mds-text-field-optional">{t('field.optional')}</span> : null}
      </label>
      <input
        id={inputId}
        className="mds-text-field-input"
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={id ? undefined : label}
        aria-invalid={state === 'error' || undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {caption ? (
        <span className={state === 'error' ? 'mds-text-field-caption mds-text-field-caption--error' : 'mds-text-field-caption'}>
          {state === 'error' ? <ToneProblemIcon size={14} /> : null}
          {caption}
        </span>
      ) : null}
    </span>
  );
}
