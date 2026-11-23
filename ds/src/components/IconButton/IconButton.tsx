/**
 * IconButton — the circular icon-only button (BRIEF 23.2, 23.3).
 *
 * - A 48 circle with no background at rest; pressed it fills with
 *   surface-pressed (23.2: دائرة 48 بخلفية surface-pressed). No hover on
 *   touch, no ripple; the press cancels when the pointer moves more than
 *   8px (lib/use-press).
 * - The icon renders at 24 and inherits the button color: text-secondary at
 *   rest, disabled-fg when disabled (23.2).
 * - Focus ring is circular (2px brand-text offset 2, :focus-visible only —
 *   the full radius makes the outline follow the circle).
 * - Driver density large widens the touch circle to 56 (23.18, BRIEF 7).
 * - The accessible name comes from `label` — icon-only buttons name
 *   themselves (29.1-م4); ds-a11y enforces it on every button.
 */
import { usePress } from '../../lib/use-press';
import type { IconButtonProps } from './IconButton.types';
import './IconButton.css';

export function IconButton({
  label,
  onPress,
  onLongPress,
  disabled = false,
  density = 'regular',
  className,
  id,
  style,
  ref,
  children,
  ...rest
}: IconButtonProps) {
  const { isPressed, pressProps } = usePress({ onPress, onLongPress, disabled });
  const classes = [
    'mds-icon-button',
    density === 'large' ? 'mds-icon-button--large' : '',
    isPressed ? 'mds-icon-button--pressed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      id={id}
      style={style}
      {...rest}
      {...pressProps}
      type="button"
      className={classes}
      aria-label={label}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
