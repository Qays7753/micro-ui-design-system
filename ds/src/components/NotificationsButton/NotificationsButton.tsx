/**
 * NotificationsButton — the bell (BRIEF 9.1, 23.23, 23.24(2)).
 *
 * - Bell Regular 24 inside the 48 touch zone; the circular press
 *   treatment like IconButton (23.2) through the shared use-press.
 * - Unread: the 8px `brand-anchor` dot with its 2px ring of the bar's
 *   own background, in the corner FARTHEST from the icon's center
 *   (23.24(2)); hidden at 0.
 * - The count rides the accessible name: «الإشعارات، {counted}»
 *   (23.17) — the dot is the only visual, no visible number.
 */
import { usePress } from '../../lib/use-press';
import { NotificationsIcon } from '../../icons';
import { t } from '../../i18n/ar';
import { pluralAr } from '../../i18n/plural';
import { pluralNouns } from '../../i18n/ar';
import type { NotificationsButtonProps } from './NotificationsButton.types';
import './NotificationsButton.css';

export function NotificationsButton({
  value = 0,
  label,
  onPress,
  className,
  id,
  style,
  ref,
  ...rest
}: NotificationsButtonProps) {
  const { isPressed, pressProps } = usePress({ onPress });

  // 23.17: «الإشعارات، 3 غير مقروءة» — the count in the name.
  const counted = pluralAr(value, pluralNouns.unread);
  const name = label ?? t('sr.notificationsCount', { counted });

  const classes = [
    'mds-notifications-button',
    isPressed ? 'mds-notifications-button--pressed' : '',
    value > 0 ? 'mds-notifications-button--unread' : '',
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
      aria-label={name}
      {...rest}
      {...pressProps}
    >
      <NotificationsIcon />
      {value > 0 ? <span className="mds-notifications-dot" aria-hidden="true" /> : null}
    </button>
  );
}
