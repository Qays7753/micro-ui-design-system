/**
 * AskButton — the Ask Micro trigger (BRIEF 9.1, 4.2(1), 23.24(2)).
 *
 * - The Micro symbol at 28 inside a 48 touch zone; no rest container
 *   (the symbol IS the button, 4.2).
 * - Unread answer: 6px dot (size.dot-ask) in the symbol's empty
 *   CENTER — the dot's only use as a mark element (4.2).
 * - Press: the circular surface-pressed fill like IconButton (23.2)
 *   via the shared use-press with its 8px move cancel; circular
 *   focus ring, :focus-visible only.
 * - Long-press = direct voice recording (9.1) — use-press exposes it.
 * - Screen-reader name: «Ask Micro» + «، جواب غير مقروء» with the
 *   dot (23.17).
 */
import { usePress } from '../../lib/use-press';
import { AskSymbolIcon } from '../../icons';
import { t } from '../../i18n/ar';
import type { AskButtonProps } from './AskButton.types';
import './AskButton.css';

export function AskButton({
  selected = false,
  onPress,
  onLongPress,
  className,
  id,
  style,
  ref,
  ...rest
}: AskButtonProps) {
  const { isPressed, pressProps } = usePress({ onPress, onLongPress });

  const name = selected ? t('sr.askUnread') : t('sr.ask');

  const classes = ['mds-ask-button', isPressed ? 'mds-ask-button--pressed' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      id={id}
      style={style}
      type="button"
      className={classes}
      aria-label={name}
      {...rest}
      {...pressProps}
    >
      <AskSymbolIcon size={28} />
      {selected ? <span className="mds-ask-dot" aria-hidden="true" /> : null}
    </button>
  );
}
