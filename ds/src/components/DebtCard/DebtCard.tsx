/**
 * DebtCard — one buy/sell debt (BATCH2-SPECS §2.4).
 *
 * - First row: the party's EntityMark 44 → 12 → name body-strong with the
 *   «لك · يستحق 30/11/2026» caption; at the row's end the remaining
 *   amount in Money's debt form («لك 45 د»).
 * - Then 12 → PaymentProgress (paid/total), then 12 → the ONE compact
 *   secondary «سجّل دفعة» button (ق1: at most one button — hidden when
 *   the debt is settled).
 * - Overdue (due date before today, passed by the app as tone="overdue"):
 *   the «متأخر» waiting badge under the amount (ق3). Settled: the
 *   «سُدّد» done badge, no button.
 * - Hidden amounts: the remaining AND PaymentProgress hide (§2.4 item 6).
 * - Screen reader: «سلمى الحوراني، لك 45 دينار، يستحق 30/11/2026، دُفع
 *   35 من 80» (§2.4 item 7); the button's accessible name carries the
 *   party («سجّل دفعة، سلمى الحوراني»).
 * - The word «قرض» never appears (ق2) — Micro has no loans.
 */
import { t, getMoneyTexts } from '../../i18n/ar';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { usePress } from '../../lib/use-press';
import { formatMoney } from '../../lib/format-money';
import { EntityMark } from '../EntityMark/index';
import { Money } from '../Money/index';
import { PaymentProgress } from '../PaymentProgress/index';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import type { DebtCardProps } from './DebtCard.types';
import './DebtCard.css';

export function DebtCard({
  label,
  value,
  debt,
  caption,
  paid,
  total,
  tone,
  markTone,
  action,
  onPress,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DebtCardProps) {
  const { hidden: contextHidden } = useAmountVisibility();
  const loading = state === 'loading';
  const { isPressed, pressProps } = usePress({ onPress, disabled: loading });

  const debtFlow = debt === 'owed-to-you' ? 'forYou' : 'againstYou';

  if (loading) {
    return (
      <div className="mds-debt-card mds-debt-card--loading" aria-busy="true" id={id} style={style} ref={ref as React.Ref<HTMLDivElement>}>
        <span className="mds-debt-card-head">
          <EntityMark><Skeleton variant="mark" /></EntityMark>
          <span className="mds-debt-card-id">
            <Skeleton variant="body" />
            <Skeleton variant="caption" />
          </span>
          <span className="mds-debt-card-end"><Skeleton variant="caption" /></span>
        </span>
      </div>
    );
  }

  const ariaLabel = [
    label,
    formatMoney(value, { debt: debtFlow, texts: getMoneyTexts() }).aria,
    caption,
    paid !== undefined && total !== undefined
      ? t('sr.debtProgress', { paid: formatMoney(paid, { texts: getMoneyTexts() }).aria }).replace('{total}', formatMoney(total, { texts: getMoneyTexts() }).aria)
      : '',
    tone === 'overdue' ? t('debt.overdue') : '',
    tone === 'done' ? t('debt.settled') : '',
  ]
    .filter(Boolean)
    .join(t('sr.listSeparator'));

  const classes = [
    'mds-card-shell',
    'mds-debt-card',
    isPressed ? 'mds-card-shell--pressed' : '',
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
      data-ds-check="debt-card"
      {...pressProps}
      {...rest}
    >
      <span className="mds-debt-card-head">
        <EntityMark tone={markTone} value={label} />
        <span className="mds-debt-card-id">
          <span className="mds-type-body-strong">{label}</span>
          {caption ? <span className="mds-type-caption">{caption}</span> : null}
        </span>
        <span className="mds-debt-card-end">
          <span className="mds-type-amount-row">
            <Money value={value} debt={debtFlow} />
          </span>
          {tone === 'overdue' ? (
            <StatusBadge tone="waiting" label={t('debt.overdue')} />
          ) : null}
          {tone === 'done' ? (
            <StatusBadge tone="done" label={t('debt.settled')} />
          ) : null}
        </span>
      </span>
      {!contextHidden && paid !== undefined && total !== undefined && tone !== 'done' ? (
        <span className="mds-debt-card-progress">
          <PaymentProgress value={paid} total={total} />
        </span>
      ) : null}
      {tone !== 'done' && action ? <span className="mds-debt-card-action">{action}</span> : null}
    </button>
  );
}
