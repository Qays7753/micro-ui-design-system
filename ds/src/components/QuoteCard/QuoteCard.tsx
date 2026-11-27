/**
 * QuoteCard — a price offer from a driver (BATCH2-SPECS §4.2).
 *
 * - Head: the driver's EntityMark 44 WITH the approved badge (23.24(4)),
 *   name body-strong, note caption 2 lines max.
 * - Price: Money lg then 4 the outcome sentence caption secondary
 *  (ق2: the sentence always renders — «بالقبول يبدأ السائق المهمة.»).
 * - In the offers LIST: «اقبل العرض» secondary compact + «ارفض» text,
 *   chip-gap apart; ALONE in the ObjectSheet: no buttons — the sheet's
 *   ActionBar carries the primary accept (ق1: no primary inside a list
 *   card).
 * - accepting: the accept button pending, reject disabled. rejected: the
 *   whole card secondary, a neutral «مرفوض» badge, no buttons.
 * - Hidden amounts leave the price VISIBLE (a proposal, not a balance).
 * - Screen reader: «عرض من عمر الزعبي، معتمد، 3 دنانير، بالقبول يبدأ
 *   السائق المهمة»; the accept button's name carries the driver's.
 */
import { ar, moneyTexts as texts } from '../../i18n/ar';
import { formatMoney } from '../../lib/format-money';
import { EntityMark } from '../EntityMark/index';
import { Money } from '../Money/index';
import { StatusBadge } from '../StatusBadge/index';
import type { QuoteCardProps } from './QuoteCard.types';
import './QuoteCard.css';

export function QuoteCard({
  label,
  caption,
  value,
  inList = true,
  result,
  accept,
  reject,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: QuoteCardProps) {
  const rejected = state === 'rejected';
  const accepting = state === 'accepting';
  const loading = state === 'loading';

  const ariaLabel = [
    ar['quote.offerFrom'].text.replace('{label}', label),
    ar['quote.approved'].text,
    formatMoney(value, { texts }).aria,
    ar['quote.resultSentence'].text,
    rejected ? ar['quote.rejected'].text : '',
  ]
    .filter(Boolean)
    .join(ar['sr.listSeparator'].text);

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="group"
      aria-label={ariaLabel}
      className={[
        'mds-card-shell',
        'mds-quote-card',
        rejected ? 'mds-quote-card--rejected' : '',
        loading ? 'mds-quote-card--loading' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="quote-card"
      {...rest}
    >
      <span className="mds-quote-card-head">
        <EntityMark tone="done" value={label} />
        <span className="mds-object-row-text">
          <span className="mds-quote-card-title mds-type-body-strong">{label}</span>
          {caption ? <span className="mds-quote-card-caption mds-type-caption">{caption}</span> : null}
          {rejected ? <StatusBadge tone="neutral" label={ar['quote.rejected'].text} /> : null}
        </span>
      </span>
      <span className="mds-quote-card-price">
        <Money value={value} size="lg" />
        <span className="mds-quote-card-result mds-type-caption">
          {result ?? ar['quote.resultSentence'].text}
        </span>
      </span>
      {inList && !rejected ? (
        <span className="mds-quote-card-actions">
          {/* The app passes its real buttons (ق1: the accept is secondary
              in lists; the primary accept lives in the sheet's ActionBar).
              accepting greys them via the aria-disabled contract below. */}
          <span aria-hidden={accepting || undefined} className={accepting ? 'mds-quote-card--await' : ''}>{accept}</span>
          {reject}
        </span>
      ) : null}
    </div>
  );
}
