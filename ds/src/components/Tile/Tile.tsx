/**
 * Tile — the Bento cell of «اليوم» (BRIEF 23.9).
 *
 * - Four equal tiles in a 2×2 grid (the parent grid class mds-tile-grid);
 *   height 152, padding 16, 1px surface-edge border, NO shadow.
 * - Corner radii per grid position (tone): the OUTER corner of the block
 *   is 28 (radius.signature-outer — like the wordmark units), the other
 *   three 8. start = top-start corner is outer; end = bottom-end corner.
 * - Header at the TOP: icon 20 text-secondary bare + 8 + label 14/20/500
 *   text-secondary; attention dot 8 status-waiting-fg at the line's end
 *   with a screen-reader text (23.17).
 * - Content pinned to the BOTTOM: the number (number-lg Rubik 28/36/500)
 *   — «—» when the value is missing, in the SAME number typography (owner
 *   decision 2026-11-25) — then one 13/20 text-secondary line. Two facts
 *   max. The 24-high sparkline (draft) sits above the number.
 * - Press: scale(.98) (23.9). Tapping opens the filtered domain (onPress).
 */
import { usePress } from '../../lib/use-press';
import type { TileProps } from './Tile.types';
import './Tile.css';

export function Tile({
  leading,
  label,
  state = false,
  caption,
  value,
  trailing,
  draft,
  tone = 'start',
  onPress,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: TileProps) {
  const { isPressed, pressProps } = usePress({ onPress: () => onPress?.(), disabled });
  const classes = [
    'mds-tile',
    `mds-tile--${tone}`,
    isPressed ? 'mds-tile--pressed' : '',
    disabled ? 'mds-tile--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      id={id}
      style={style}
      type="button"
      className={classes}
      disabled={disabled}
      data-ds-exempt={disabled ? undefined : ''}
      {...pressProps}
      {...rest}
    >
      <span className="mds-tile-header">
        {leading ? <span className="mds-tile-header-icon" aria-hidden="true">{leading}</span> : null}
        <span className="mds-tile-header-label">{label}</span>
        {state ? (
          <span className="mds-tile-dot" role="img" aria-label={caption ?? ''} />
        ) : null}
      </span>
      <span className="mds-tile-content">
        {draft ? <span className="mds-tile-sparkline" aria-hidden="true">{draft}</span> : null}
        <span className="mds-tile-value">{value ?? '—'}</span>
        {trailing ? <span className="mds-tile-line">{trailing}</span> : null}
      </span>
    </button>
  );
}
