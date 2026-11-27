/**
 * Radio — the single-choice group (ADDENDUM §3.2, BRIEF 9.4).
 *
 * - The group's label (label 14/20) sits 8 above a Surface whose rows are
 *   size.row-plain: the circle (size.checkbox 20, r-full) → 12 → the label
 *   (body 16/26, wraps at 200%). The WHOLE row presses (ق1 walk-order).
 * - A REAL <input type="radio"> per row (named by its label, 23.17); the
 *   styled circle is decoration: unfocused = border-field hairline,
 *   selected = focus border in brand-anchor + the inner dot
 *   (size.dot-unread) in brand-anchor, appearing with motion.quick.
 * - error: nothing chosen at submit → «اختر <التسمية>» under the surface.
 * - The group is a real radiogroup named by its label; the arrows walk.
 */
import { useId } from 'react';
import { t } from '../../i18n/ar';
import type { RadioProps } from './Radio.types';
import './Radio.css';

export function Radio({
  label,
  items,
  value,
  onChange,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: RadioProps) {
  const groupName = useId();
  const classes = [
    'mds-radio',
    disabled ? 'mds-radio--disabled' : '',
    state === 'error' ? 'mds-radio--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-radio-label mds-type-label">{label}</span>
      <div className="mds-radio-surface" role="radiogroup" aria-label={label}>
        {items.map((item) => {
          const selected = item.value === value;
          return (
            <label key={item.value} className="mds-radio-row">
              <input
                type="radio"
                className="mds-radio-input"
                name={groupName}
                checked={selected}
                disabled={disabled || item.disabled}
                onChange={() => onChange?.(item.value)}
              />
              <span className="mds-radio-circle" aria-hidden="true">
                <span className="mds-radio-dot" />
              </span>
              <span className="mds-radio-text">
                <span className="mds-radio-row-label mds-type-body">{item.label}</span>
                {item.caption ? (
                  <span className="mds-radio-caption mds-type-caption">{item.caption}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {state === 'error' ? (
        <span className="mds-radio-error mds-type-caption">{t('radio.choose').replace('{label}', label)}</span>
      ) : null}
    </div>
  );
}
