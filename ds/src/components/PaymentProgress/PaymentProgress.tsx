/**
 * PaymentProgress — the financial progress of a debt (BATCH2-SPECS §2.6).
 *
 * - The bar: track 8 high (size.progress), r-full; the paid share in
 *   brand-data grows from the start with motion.standard (§2.6 item 5).
 * - The caption line: «دُفع 35 د · بقي 45 د» — every amount through
 *   formatMoney (§0.2 item 2), so the unit «د» and the 23.22 hidden
 *   behaviour ride on the shared formatter.
 * - Hidden amounts: the bar AND the line are not rendered (§2.6 item 6);
 *   «المبلغ مخفي» takes their place — the ratio must not leak through
 *   the bar geometry either.
 * - Screen reader: role=progressbar with aria-valuenow as a percentage
 *   and the aria text «دُفع 35 من 80 دينار» (§2.6 item 7).
 * - Zero paid renders the bare track; a complete debt renders the full
 *   bar (§2.6 item 4). A non-positive total is invalid — the bar stays
 *   empty rather than lying with a fake ratio.
 */
import { moneyTexts, t } from '../../i18n/ar';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { formatMoney } from '../../lib/format-money';
import type { MoneyInput } from '../../lib/format-money';
import type { PaymentProgressProps } from './PaymentProgress.types';
import './PaymentProgress.css';

/** Fils magnitude (×1000) of an amount; null when missing/unparseable. */
function filsOf(input: MoneyInput): number | null {
  if (input === null || input === undefined) return null;
  const digits = String(input).replace(/[^0-9.]/g, '');
  if (!digits || digits === '.') return null;
  const value = Number(digits);
  return Number.isFinite(value) ? Math.round(value * 1000) : null;
}

export function PaymentProgress({
  value,
  total,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: PaymentProgressProps) {
  const { hidden: contextHidden } = useAmountVisibility();
  const hidden = contextHidden && state !== 'loading';
  const loading = state === 'loading';

  const paid = filsOf(value);
  const whole = filsOf(total);
  const valid = whole !== null && whole > 0 && paid !== null && paid >= 0;
  const paidCapped = valid ? Math.min(paid as number, whole as number) : 0;
  const wholeSafe = valid ? (whole as number) : 1;
  const share = Math.round((paidCapped / wholeSafe) * 1000) / 10;
  const remaining = Math.max(wholeSafe - paidCapped, 0);

  const classes = [
    'mds-payment-progress',
    hidden ? 'mds-payment-progress--hidden' : '',
    loading ? 'mds-payment-progress--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      role={hidden || loading ? undefined : 'progressbar'}
      aria-label={t('sr.debtProgress', {
        paid: formatMoney(value, { texts: moneyTexts }).aria,
        total: formatMoney(total, { texts: moneyTexts }).aria,
      })}
      aria-valuenow={hidden || loading ? undefined : share}
      aria-valuemin={hidden || loading ? undefined : 0}
      aria-valuemax={hidden || loading ? undefined : 100}
      aria-busy={loading || undefined}
      {...rest}
    >
      {hidden ? (
        <span className="mds-payment-progress-hidden mds-type-caption">{moneyTexts.hidden}</span>
      ) : (
        <>
          <span className="mds-payment-progress-track">
            <span
              className="mds-payment-progress-fill"
              style={{ '--mds-payment-progress-share': `${share}%` } as React.CSSProperties}
            />
          </span>
          <span className="mds-payment-progress-line">
            {t('payment.paid')}{' '}
            <bdi dir="ltr">{formatMoney(paidCapped / 1000, { texts: moneyTexts }).display}</bdi>
            {' · '}
            {t('payment.remaining')}{' '}
            <bdi dir="ltr">{formatMoney(remaining / 1000, { texts: moneyTexts }).display}</bdi>
          </span>
        </>
      )}
    </div>
  );
}
