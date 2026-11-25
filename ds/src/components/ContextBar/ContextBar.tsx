/**
 * ContextBar — the top context bar (BRIEF 9.1, 23.16, 27.3).
 *
 * - 56 (size.context-bar), `canvas` background; a 1px `surface-edge`
 *   BOTTOM hairline appears ONLY while content scrolled under it
 *   (23.16 — the host passes the signal through `caption`).
 * - Composition slots: leading = ProjectSwitcher (main screens) or a
 *   back IconButton (sub screens); trailing = NotificationsButton
 *   then AskButton — Ask is the LAST element in the corner and the
 *   bell sits just inside it [confirmed order in 9.1].
 * - layer.bars (23.15); the top safe area rides the padding (27.3).
 */
import type { ContextBarProps } from './ContextBar.types';
import './ContextBar.css';

export function ContextBar({
  leading,
  trailing,
  caption = false,
  label,
  className,
  id,
  style,
  ref,
  children,
  ...rest
}: ContextBarProps) {
  const classes = [
    'mds-context-bar',
    caption ? 'mds-context-bar--scrolled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      role="banner"
      aria-label={label}
      {...rest}
    >
      <div className="mds-context-bar-start">{leading ?? children}</div>
      <div className="mds-context-bar-end">{trailing}</div>
    </div>
  );
}
