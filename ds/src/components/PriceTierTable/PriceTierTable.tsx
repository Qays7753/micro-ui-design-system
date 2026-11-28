/**
 * PriceTierTable — a listing's price tiers (BATCH2-SPECS §5.3).
 *
 * - A semantic three-column table: «من» / «إلى» / «السعر للعبوة»;
 *   the LAST tier's «إلى» reads «فما فوق»; the price column carries
 *   Money (tabular digits).
 * - locked (visitor): the LockedDetails SHAPE — three well rows, no
 *   numbers in the page at all (ق1).
 * - Screen reader: the table is named «شرائح السعر» (caption).
 */
import { t, getMoneyTexts } from '../../i18n/ar';
import { formatMoney } from '../../lib/format-money';
import type { PriceTierTableProps } from './PriceTierTable.types';
import './PriceTierTable.css';

export function PriceTierTable({
  items,
  locked = false,
  className,
  id,
  style,
  ref,
  ...rest
}: PriceTierTableProps) {
  if (locked) {
    return (
      <div
        ref={ref}
        id={id}
        style={style}
        aria-label={t('tier.tableName')}
        className={['mds-price-tier-table-locked', className].filter(Boolean).join(' ')}
        data-ds-check="price-tier-table"
        {...rest}
      >
        <span className="mds-price-tier-table-locked-row" aria-hidden="true" />
        <span className="mds-price-tier-table-locked-row" aria-hidden="true" />
        <span className="mds-price-tier-table-locked-row" aria-hidden="true" />
      </div>
    );
  }

  return (
    <table
      ref={ref as React.Ref<HTMLTableElement>}
      id={id}
      style={style}
      className={['mds-price-tier-table', className].filter(Boolean).join(' ')}
      data-ds-check="price-tier-table"
      {...(rest as React.TableHTMLAttributes<HTMLTableElement>)}
    >
      <caption>{t('tier.tableName')}</caption>
      <thead>
        <tr>
          <th scope="col">{t('tier.from')}</th>
          <th scope="col">{t('tier.to')}</th>
          <th scope="col">{t('tier.pricePerUnit')}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((tier, i) => {
          const last = i === items.length - 1;
          return (
            <tr key={`${tier.from}-${i}`}>
              <td>{tier.from}</td>
              <td>{last || tier.to === undefined ? t('tier.andAbove') : tier.to}</td>
              <td>{formatMoney(tier.price, { texts: getMoneyTexts() }).display}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
