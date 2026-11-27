/**
 * TextArea — the multi-line field (ADDENDUM §1.2, BRIEF 9.3/9.4).
 *
 * - Like TextField: the label above (8), the hairline field, the help below
 *   (4). Differences (§1.2-2): min-height size.field; it GROWS with the
 *   text up to size.textarea-max-lines lines of body (6) and then scrolls
 *   INTERNALLY (ق2); the vertical padding 16 keeps the first line in line
 *   with TextField; the growth is INSTANT (layout change — §1.2-5).
 * - error: the problem border + field-error icon + the solution caption
 *   (the same contract as TextField, ADDENDUM §1.2-4).
 * - aria-multiline rides the real textarea; the error binds via
 *   aria-describedby (§1.2-7).
 */
import { useId, useMemo } from 'react';
import { FieldErrorIcon } from '../../icons';
import { t } from '../../i18n/ar';
import type { TextAreaProps } from './TextArea.types';
import './TextArea.css';

export function TextArea({
  label,
  caption,
  value = '',
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
}: TextAreaProps) {
  const reactId = useId();
  const errorId = useMemo(() => `${reactId}-error`, [reactId]);
  const classes = [
    'mds-field',
    'mds-text-area',
    state === 'error' ? 'mds-text-area--error' : '',
    disabled ? 'mds-text-area--disabled mds-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id={id} style={style} className={classes} {...rest}>
      <label className="mds-text-area-label mds-type-label" htmlFor={id ?? reactId}>
        {label}
        {optional ? <span className="mds-text-area-optional mds-type-caption">{t('field.optional')}</span> : null}
      </label>
      {/* §1.2-8: enterkeyhint is FIXED «enter» — the spec does not expose it
          as a prop (Ask sends via its own button, not the keyboard hint). */}
      <textarea
        ref={ref}
        id={id ?? reactId}
        className="mds-text-area-input mds-field-input"
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-multiline="true"
        aria-invalid={state === 'error' || undefined}
        aria-describedby={state === 'error' ? errorId : undefined}
        enterKeyHint="enter"
        onChange={(e) => onChange?.(e.target.value)}
        onInput={(e) => {
          // §1.2-2: grow to 6 lines, then scroll internally. The growth is
          // instant (a layout change, §1.2-5) — no transition, no animation.
          const el = e.currentTarget;
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
        }}
      />
      {state === 'error' ? (
        <span id={errorId} className="mds-text-area-help mds-type-caption">
          <FieldErrorIcon size={16} />
          <span>{caption}</span>
        </span>
      ) : caption ? (
        <span className="mds-text-area-help mds-type-caption">
          <span>{caption}</span>
        </span>
      ) : null}
    </div>
  );
}
