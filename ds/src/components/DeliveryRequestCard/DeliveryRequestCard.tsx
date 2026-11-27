/**
 * DeliveryRequestCard — one delivery request at the owner
 * (BATCH2-SPECS §4.1).
 *
 * - The mark: EntityMark 44 with the nav-delivery icon MIRRORED (ق2:
 *   transform scaleX(-1) — the truck faces RTL reading), or the assigned
 *   driver's letter mark.
 * - Title «إلى <المنطقة>» body-strong; caption «من <المنطقة> · <الوصف>»;
 *   the StatusBadge at the first row's end (wraps under the title at
 *   200%/320, §4.1 item 6).
 * - The clock time line 12 under; the ONE secondary «راجع العروض» button
 *   ONLY when the app passes it (ق1: awaiting-decision requests only).
 * - Screen reader: «إلى مرج الحمام، من طبربور، كرتونتا حلويات، اليوم
 *   4:00 مساءً، وصل عرض سعر» (§4.1 item 7).
 * - No amounts on this card — hidden-amounts mode touches nothing.
 */
import { ar } from '../../i18n/ar';
import { usePress } from '../../lib/use-press';
import { ClockIcon, NavDeliveryIcon } from '../../icons';
import { EntityMark } from '../EntityMark/index';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import type { DeliveryRequestCardProps } from './DeliveryRequestCard.types';
import './DeliveryRequestCard.css';

export function DeliveryRequestCard({
  label,
  caption,
  time,
  tone,
  badge,
  driver,
  action,
  onPress,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DeliveryRequestCardProps) {
  const loading = state === 'loading';
  const { isPressed, pressProps } = usePress({ onPress, disabled: loading });

  if (loading) {
    return (
      <div className="mds-card-shell mds-delivery-request-card mds-delivery-request-card--loading" aria-busy="true" id={id} style={style} ref={ref as React.Ref<HTMLDivElement>}>
        <span className="mds-delivery-request-card-head">
          <EntityMark><Skeleton variant="mark" /></EntityMark>
          <span className="mds-object-row-text">
            <Skeleton variant="body" />
            <Skeleton variant="caption" />
          </span>
        </span>
      </div>
    );
  }

  const ariaLabel = [
    `${ar['delivery.to'].text} ${label}`,
    caption,
    time,
    badge ? (badge as React.ReactElement<{ label?: string }>).props.label ?? '' : '',
    !badge && tone && tone !== 'neutral' ? (ar[`badge.${tone}` as keyof typeof ar] as { text: string })?.text ?? '' : '',
  ]
    .filter(Boolean)
    .join(ar['sr.listSeparator'].text);

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      style={style}
      className={[
        'mds-card-shell',
        'mds-delivery-request-card',
        isPressed ? 'mds-card-shell--pressed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={ariaLabel}
      data-ds-check="delivery-request-card"
      {...pressProps}
      {...rest}
    >
      <span className="mds-delivery-request-card-head">
        {driver ? (
          <EntityMark value={driver} />
        ) : (
          <EntityMark>
            {/* ق2: the nav-delivery icon rides MIRRORED for RTL reading. */}
            <span className="mds-delivery-request-card-nav" aria-hidden="true">
              <NavDeliveryIcon size={24} />
            </span>
          </EntityMark>
        )}
        <span className="mds-object-row-text">
          <span className="mds-type-body-strong">{`${ar['delivery.to'].text} ${label}`}</span>
          {caption ? <span className="mds-type-caption">{caption}</span> : null}
        </span>
        {badge ? badge : tone ? <StatusBadge tone={tone} /> : null}
      </span>
      {time ? (
        <span className="mds-delivery-request-card-time">
          <span className="mds-delivery-request-card-time-icon" aria-hidden="true">
            <ClockIcon size={16} />
          </span>
          <span>{time}</span>
        </span>
      ) : null}
      {action ? <span className="mds-delivery-request-card-action">{action}</span> : null}
    </button>
  );
}
