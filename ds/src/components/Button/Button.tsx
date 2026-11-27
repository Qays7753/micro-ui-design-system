/**
 * Button — the action button (BRIEF 9.3, 23.2, 23.3).
 *
 * - Variants: primary (brand-anchor, white text), secondary
 *   (brand-selected-bg, brand-anchor text), text (brand-text), danger
 *   (status-problem-fg text — it fills inside ConfirmSheet only, 9.3).
 * - md = 52 high, radius 16, padding-inline 20, min-width 96; sm = 44 high
 *   with radius 12 and compact padding — the 48 touch zone comes from the
 *   container row it sits in (23.3: ارتفاع 44 داخل منطقة لمس 48).
 * - Press: background swap + scale(.96) on primary/secondary, surface-pressed
 *   without scale on text/danger (23.2). No hover on touch, no ripple; the
 *   press cancels when the pointer moves more than 8px (lib/use-press).
 * - Focus ring 2px brand-text offset 2, :focus-visible only (23.2, 23.3).
 * - Loading: the 20 spinner replaces the icon, width unchanged, aria-busy;
 *   the caller owns the ongoing-form label (23.3, 23.24(1)).
 */
import { usePress } from '../../lib/use-press';
import type { ButtonProps } from './Button.types';
import './Button.css';

export function Button({
  variant = 'primary',
  mode = 'surface',
  size = 'md',
  loading = false,
  leading,
  trailing,
  onPress,
  onLongPress,
  disabled = false,
  className,
  id,
  style,
  ref,
  children,
  ...rest
}: ButtonProps) {
  const { isPressed, pressProps } = usePress({
    onPress,
    onLongPress,
    disabled: disabled || loading,
  });
  const classes = [
    'mds-button',
    `mds-button--${variant}`,
    `mds-button--${size}`,
    mode === 'canvas' ? 'mds-button--on-canvas' : '',
    isPressed ? 'mds-button--pressed' : '',
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
      disabled={disabled}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="mds-button-spinner" aria-hidden="true" />
      ) : leading ? (
        <span className="mds-button-icon">{leading}</span>
      ) : null}
      <span className="mds-button-label">{children}</span>
      {trailing ? <span className="mds-button-icon">{trailing}</span> : null}
    </button>
  );
}
