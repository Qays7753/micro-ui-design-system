/**
 * SupplierHeader — the supplier page/sheet header (BATCH2-SPECS §5.4).
 *
 * - EntityMark 64 with the approved badge when the supplier is; then 12;
 *   the name title-section (an h1 — §5.4 item 7) over the caption
 *   «<المنطقة> · <العدد> عرضاً».
 * - ق1: the count's wording follows 24.1(8) for 0/1/2/3/11.
 * - Screen reader: «مخبز الأصيل للجملة، معتمد، إربد، 12 عرضاً».
 */
import { t } from '../../i18n/ar';
import { EntityMark } from '../EntityMark/index';
import { Skeleton } from '../Skeleton/index';
import type { SupplierHeaderProps } from './SupplierHeader.types';
import './SupplierHeader.css';

/** 24.1(8) count wording: «عرض واحد» / «عرضان» / «N عروض» / «N عرضاً». */
export function offersCountWord(n: number): string {
  if (n === 1) return t('supplier.oneOffer');
  if (n === 2) return t('supplier.twoOffers');
  if (n >= 3 && n <= 10) return t('supplier.offers', { n: n });
  return t('supplier.offersMany', { n: n });
}

export function SupplierHeader({
  label,
  caption,
  items,
  approved = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: SupplierHeaderProps) {
  const loading = state === 'loading';
  const ariaLabel = [
    label,
    approved ? t('quote.approved') : '',
    caption ?? '',
    items !== undefined ? offersCountWord(items) : '',
  ].filter(Boolean).join(t('sr.listSeparator'));

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      aria-label={ariaLabel}
      className={['mds-supplier-header', loading ? 'mds-supplier-header--loading' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="supplier-header"
      {...rest}
    >
      {loading ? (
        <>
          <EntityMark><Skeleton variant="mark" /></EntityMark>
          <span className="mds-supplier-header-id">
            <Skeleton variant="body" />
            <Skeleton variant="caption" />
          </span>
        </>
      ) : (
        <>
          <EntityMark value={label} size="lg" tone={approved ? 'done' : undefined} />
          <span className="mds-supplier-header-id">
            <h1 className="mds-supplier-header-name">{label}</h1>
            {caption || items !== undefined ? (
              <span className="mds-supplier-header-caption mds-type-caption">
                {[caption, items !== undefined ? offersCountWord(items) : '']
                  .filter(Boolean)
                  .join(` ${t('sr.listSeparator')} `)}
              </span>
            ) : null}
          </span>
        </>
      )}
    </div>
  );
}
