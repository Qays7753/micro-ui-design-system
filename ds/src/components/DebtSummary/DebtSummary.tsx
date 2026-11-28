/**
 * DebtSummary — the head of the debts section (BATCH2-SPECS §2.5).
 *
 * - A Surface with two equal columns 16 apart, NO divider (ق2): each
 *   column is the label («لك» / «عليك»), then 4, the total in Money lg
 *   (no debt word), then 4, the counted parties caption.
 * - Zero is a real zero («0 د»), never «—» (§2.5 item 4).
 * - The uncut guarantee (ق1): a number that cannot fit its column uncut
 *   wraps the grid to two rows — the flex-wrap floor in the CSS keeps
 *   every digit whole at any width.
 * - Hidden amounts: «•••• د»; the counts stay visible (§2.5 item 6).
 * - Screen reader: «لك 45 دينار من عميل واحد. عليك 1,280 دينار من مورد
 *   واحد.» — each column reads its own sentence (§2.5 item 7).
 */
import { ar, getMoneyTexts } from '../../i18n/ar';
import { formatMoney } from '../../lib/format-money';
import { Money } from '../Money/index';
import { Skeleton } from '../Skeleton/index';
import type { DebtSummaryColumn, DebtSummaryProps } from './DebtSummary.types';
import './DebtSummary.css';

function Column({
  label,
  counted,
  value,
  loading,
}: {
  label: string;
  counted: string;
  value: DebtSummaryColumn['value'];
  loading: boolean;
}) {
  return (
    <span className="mds-debt-summary-col">
      <span className="mds-debt-summary-label mds-type-label">{label}</span>
      {loading ? (
        <Skeleton variant="hero" />
      ) : (
        <Money value={value} size="lg" />
      )}
      {loading ? <Skeleton variant="caption" /> : (
        <span className="mds-debt-summary-count mds-type-caption">{counted}</span>
      )}
    </span>
  );
}

export function DebtSummary({
  forYou,
  againstYou,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DebtSummaryProps) {
  const loading = state === 'loading';

  const forYouAria = [
    ar['debt.forYou'].text,
    formatMoney(forYou.value, { texts: getMoneyTexts() }).aria,
    forYou.counted,
  ].join(' ');
  const againstYouAria = [
    ar['debt.againstYou'].text,
    formatMoney(againstYou.value, { texts: getMoneyTexts() }).aria,
    againstYou.counted,
  ].join(' ');

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-debt-summary', loading ? 'mds-debt-summary--loading' : '', className]
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-label={`${forYouAria}. ${againstYouAria}.`}
      data-ds-check="debt-summary"
      {...rest}
    >
      <Column label={ar['debt.forYou'].text} counted={forYou.counted} value={forYou.value} loading={loading} />
      <Column label={ar['debt.againstYou'].text} counted={againstYou.counted} value={againstYou.value} loading={loading} />
    </div>
  );
}
