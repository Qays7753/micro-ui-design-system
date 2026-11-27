/**
 * Toggle — the instant setting row (ADDENDUM §1.7, BRIEF 9.4).
 *
 * - A row of size.row-plain with the row padding: the label (body 16/26)
 *   + optional caption, and at the END the switch: the track
 *   (size.toggle-track 52×32, r-full) and the thumb (size.toggle-thumb 24)
 *   offset 4 inside it. ON: the track brand-anchor and the thumb at the
 *   END carrying the selected check 14 in brand-anchor — a NON-COLOR
 *   signal (ق3: the state reads in grayscale via the thumb position).
 * - A REAL role="switch" input (checkbox input visually hidden) named by
 *   the label; aria-checked follows (ق2).
 * - The WHOLE row presses (ق1); the thumb slides motion.quick and the
 *   track recolors motion.quick (ADDENDUM §1.7-5).
 * - 200%: the label wraps, the switch stays vertically centered.
 */
import { SelectedIcon } from '../../icons';
import type { ToggleProps } from './Toggle.types';
import './Toggle.css';

export function Toggle({
  label,
  caption,
  selected = false,
  onChange,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: ToggleProps) {
  const classes = [
    'mds-toggle',
    selected ? 'mds-toggle--selected' : '',
    disabled ? 'mds-toggle--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label ref={ref} id={id} style={style} className={classes} {...rest}>
      <input
        type="checkbox"
        className="mds-toggle-input"
        role="switch"
        checked={selected}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-checked={selected}
      />
      <span className="mds-toggle-text">
        <span className="mds-toggle-label mds-type-body">{label}</span>
        {caption ? <span className="mds-toggle-caption mds-type-caption">{caption}</span> : null}
      </span>
      <span className="mds-toggle-switch" aria-hidden="true">
        <span className="mds-toggle-track">
          <span className="mds-toggle-thumb">
            <SelectedIcon size={14} />
          </span>
        </span>
      </span>
    </label>
  );
}
