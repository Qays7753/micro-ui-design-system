/**
 * ListingCard — one offer in the market grid (BATCH2-SPECS §5.1).
 *
 * - The 4:3 figure is reserved before load (ق1); photos crop center with
 *   the entity-image-edge inset; a small image centers on the well; none:
 *   the supplier's EntityMark 44.
 * - Title body-strong 2 lines; the amount-row price (tiers say «من»);
 *   unavailable: a NEUTRAL badge replaces the price (no badge otherwise);
 *   visitor: LockedDetails — ق3: no number anywhere in the page.
 * - Screen reader: «طحين أبيض 50 كغ، 2 دينار و500 فلس للعبوة، مخبز
 *   الأصيل للجملة» (§5.1 item 7).
 * - Market prices are not project amounts: hidden mode leaves them.
 */
import { ar, moneyTexts } from '../../i18n/ar';
import { formatMoney } from '../../lib/format-money';
import { usePress } from '../../lib/use-press';
import { EntityMark } from '../EntityMark/index';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import type { ListingCardProps } from './ListingCard.types';
import './ListingCard.css';

export function ListingCard({
  label,
  value,
  caption,
  tone = 'flat',
  supplier,
  image,
  unavailable = false,
  locked = false,
  onPress,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: ListingCardProps) {
  const loading = state === 'loading';
  const { isPressed, pressProps } = usePress({ onPress, disabled: loading });

  if (loading) {
    return (
      <div className="mds-listing-card mds-listing-card--loading" aria-busy="true" id={id} style={style}>
        <span className="mds-listing-card-figure"><Skeleton variant="body" /></span>
        <span className="mds-listing-card-body">
          <Skeleton variant="body" />
          <Skeleton variant="caption" />
        </span>
      </div>
    );
  }

  const ariaLabel = [
    label,
    unavailable ? ar['listing.unavailable'].text : locked ? '' :
      value !== undefined ? formatMoney(value, { texts: moneyTexts }).aria : '',
    unavailable || locked || value !== undefined ? `${caption ?? ''}` : '',
    supplier ?? '',
  ].filter(Boolean).join(ar['sr.listSeparator'].text);

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      style={style}
      className={[
        'mds-listing-card',
        isPressed ? 'mds-listing-card--pressed' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      data-ds-check="listing-card"
      {...pressProps}
      {...rest}
    >
      <span className="mds-listing-card-figure">
        {image ? (
          <img
            className={['mds-media-fill', /* small-image heuristic is the app's */ '']
              .filter(Boolean).join(' ')}
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        ) : (
          <EntityMark value={supplier} />
        )}
      </span>
      <span className="mds-listing-card-body">
        <span className="mds-listing-card-title">{label}</span>
        {unavailable ? (
          <StatusBadge tone="neutral" label={ar['listing.unavailable'].text} />
        ) : locked ? (
          /* ق3: the visitor sees NO number — the locked block carries no
             digits; its aria says the price is hidden. */
          <span className="mds-listing-card-unit" aria-hidden="true">••••</span>
        ) : value !== undefined ? (
          <span className="mds-listing-card-price">
            {tone === 'tiers' ? <span className="mds-listing-card-unit">{ar['listing.from'].text}</span> : null}
            <span className="mds-number-lg">{formatMoney(value, { texts: moneyTexts }).display}</span>
            {caption ? <span className="mds-listing-card-unit">{ar['listing.perUnit'].text.replace('{unit}', caption)}</span> : null}
          </span>
        ) : null}
        {supplier ? (
          <span className="mds-listing-card-supplier">
            <EntityMark value={supplier} size="sm" />
            <span className="mds-listing-card-supplier-name mds-type-caption">{supplier}</span>
          </span>
        ) : null}
      </span>
    </button>
  );
}
