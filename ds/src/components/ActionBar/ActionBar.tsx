/**
 * ActionBar — the fixed bottom action bar (BRIEF 9.2 + 23.16 + 27.3/27.4).
 *
 * - Fixed to the bottom of the screen (or its sheet): white, 1px
 *   `surface-edge` top border shown ONLY while the content above has
 *   not scrolled to its end (23.16 — the host passes that signal).
 * - ONE primary button filling the remaining width (23.20 width
 *   table: «الزر الأساسي يملأ ما يتبقى بعد الثانوي»), an optional
 *   text secondary (Button variant=text) before it, and the safe-area
 *   inset (27.3: `env(safe-area-inset-bottom)`).
 * - Rides above the keyboard: the bar follows window.visualViewport
 *   (27.4) — when the keyboard shrinks the viewport the bar pins to
 *   the visible bottom, so the active field never covers it. The
 *   real-keyboard behavior stays an owner-device check (D16).
 * - Layer: `layer.bars` (20) — the screen's own bar. A sheet-owned
 *   ActionBar lives inside the sheet's own stacking context (23.15),
 *   which out-stacks layer.bars automatically.
 */
import { useVisualViewport } from '../../lib/use-visual-viewport';
import { Button } from '../Button/index';
import type { ActionBarProps } from './ActionBar.types';
import './ActionBar.css';

export function ActionBar({
  label,
  onPress,
  loading = false,
  disabled = false,
  caption,
  onRetry,
  leading = true,
  trailing,
  className,
  id,
  style,
  ref,
  ...rest
}: ActionBarProps) {
  // 27.4: the bar follows the visual viewport so it stays above the
  // keyboard. offsetTop + height describe the visible rectangle; the
  // bar's bottom pins to it instead of the layout viewport bottom.
  const viewport = useVisualViewport();

  // Keyboard covering the layout viewport: pin to the visible bottom.
  // The inset needs no raw fallback: env() evaluates to 0 where no
  // safe-area applies (see ActionBar.css note).
  const keyboardPin =
    viewport.keyboardHeight > 0
      ? {
          bottom: `calc(${viewport.keyboardHeight}px + env(safe-area-inset-bottom))`,
        }
      : undefined;

  const classes = ['mds-action-bar', leading ? 'mds-action-bar--more' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      id={id}
      style={{ ...keyboardPin, ...style }}
      className={classes}
      role="group"
      aria-label={label}
      {...rest}
    >
      {caption ? (
        <Button variant="text" onPress={onRetry} className="mds-action-bar-secondary">
          {caption}
        </Button>
      ) : null}
      <Button
        variant="primary"
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        leading={trailing}
        className="mds-action-bar-primary"
      >
        {label}
      </Button>
    </div>
  );
}
