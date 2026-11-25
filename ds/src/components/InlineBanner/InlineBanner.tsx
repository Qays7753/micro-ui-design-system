/**
 * InlineBanner — the network / permissions / info strip (BRIEF 517,
 * 658, 23.23, 23.17, 1649).
 *
 * Icon + text on the light tone pair — never a fully-colored surface.
 * Sticks to the top of the content (517). Polite role=status (23.17).
 */
import { InfoIcon } from '../../icons';
import { LockedIcon } from '../../icons';
import { OfflineIcon } from '../../icons';
import type { InlineBannerProps } from './InlineBanner.types';
import './InlineBanner.css';

const ICONS = {
  offline: OfflineIcon,
  locked: LockedIcon,
  info: InfoIcon,
} as const;

export function InlineBanner({
  tone,
  label,
  trailing,
  className,
  id,
  style,
  ref,
  ...rest
}: InlineBannerProps) {
  const Icon = ICONS[tone];

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-inline-banner', `mds-inline-banner--${tone}`, className]
        .filter(Boolean)
        .join(' ')}
      role="status"
      {...rest}
    >
      <Icon />
      <span className="mds-inline-banner-text">{label}</span>
      {trailing ? <span className="mds-inline-banner-action">{trailing}</span> : null}
    </div>
  );
}
