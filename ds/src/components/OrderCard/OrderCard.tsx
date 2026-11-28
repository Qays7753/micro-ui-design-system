/**
 * OrderCard — one order or appointment in the curated lists
 * (BATCH2-SPECS §3.1).
 *
 * - The ObjectCard anatomy: EntityMark 44 → 12 → name body-strong with
 *   the content caption; the value Money amount-row at the row's end
 *   (wraps under the name at 200%/320 — ق2 of the shared card rules).
 * - The appointment line: clock 16 text-secondary → 8 → the time label
 *   text-primary; the StatusBadge anchors the line's end.
 * - ONE compact secondary next-step button (ق1: never primary, and per
 *   و-2 item 19 it rides as a SIBLING slot above the stretched card — the
 *   card root is the only interactive besides it, so no nested link
 *   inside a link in the tree (ق2)).
 * - Cancelled: name, caption, time and value go text-secondary, the value
 *   strikes through, the button disappears.
 * - Time format is the app's; the component never invents one (ق3 is the
 *   app's 12-hour wording passing through `time`).
 * - Screen reader: «سلمى الحوراني، فستان سهرة × 2، 45 دينار، التسليم
 *   اليوم 4:00 مساءً، جاهز» — the aria label composes the same fields.
 */
import { ar, getMoneyTexts } from '../../i18n/ar';
import { usePress } from '../../lib/use-press';
import { formatMoney } from '../../lib/format-money';
import { ClockIcon } from '../../icons';
import { EntityMark } from '../EntityMark/index';
import { Money } from '../Money/index';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import type { OrderCardProps } from './OrderCard.types';
import './OrderCard.css';

export function OrderCard({
  label,
  caption,
  value,
  time,
  tone,
  badge,
  cancelled = false,
  action,
  onPress,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: OrderCardProps) {
  const loading = state === 'loading';
  const { isPressed, pressProps } = usePress({ onPress, disabled: loading });

  if (loading) {
    return (
      <div className="mds-order-card mds-order-card--loading" aria-busy="true" id={id} style={style} ref={ref as React.Ref<HTMLDivElement>}>
        <span className="mds-order-card-head">
          <EntityMark><Skeleton variant="mark" /></EntityMark>
          <span className="mds-order-card-id">
            <Skeleton variant="body" />
            <Skeleton variant="caption" />
          </span>
          <span className="mds-order-card-head"><Skeleton variant="caption" /></span>
        </span>
      </div>
    );
  }

  const ariaLabel = [
    label,
    caption,
    value !== undefined && value !== null ? formatMoney(value, { texts: getMoneyTexts() }).aria : '',
    time,
    badge ? (badge as React.ReactElement<{ label?: string }>).props.label ?? '' : tone ? ar[`badge.${tone}` as keyof typeof ar] instanceof Object ? (ar[`badge.${tone}` as keyof typeof ar] as { text: string }).text : '' : '',
    cancelled ? ar['badge.cancelled'].text : '',
  ]
    .filter(Boolean)
    .join(ar['sr.listSeparator'].text);

  const classes = [
    'mds-card-shell',
    'mds-order-card',
    isPressed ? 'mds-card-shell--pressed' : '',
    cancelled ? 'mds-order-card--cancelled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      style={style}
      className={classes}
      aria-label={ariaLabel}
      data-ds-check="order-card"
      {...pressProps}
      {...rest}
    >
      <span className="mds-order-card-head">
        <EntityMark value={label} />
        <span className="mds-order-card-id">
          <span className="mds-order-card-title mds-type-body-strong">{label}</span>
          {caption ? <span className="mds-object-row-caption mds-type-caption">{caption}</span> : null}
        </span>
        {value !== undefined ? (
          <span className="mds-type-amount-row">
            <Money value={value} />
          </span>
        ) : null}
      </span>
      {time || tone || badge ? (
        <span className="mds-order-card-time">
          <span className="mds-order-card-time-icon" aria-hidden="true">
            <ClockIcon size={16} />
          </span>
          <span>{time}</span>
          {badge ? <span className="mds-order-card-time-badge">{badge}</span> : tone ? (
            <span className="mds-order-card-time-badge">
              <StatusBadge tone={tone} />
            </span>
          ) : null}
        </span>
      ) : null}
      {!cancelled && action ? <span className="mds-order-card-action">{action}</span> : null}
    </button>
  );
}
