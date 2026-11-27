/**
 * FundCard — one fund in the finance «الصناديق» horizontal list
 * (BATCH2-SPECS §2.3).
 *
 * - The ObjectCard anatomy at size.horizontal-card-width (280) in a
 *   horizontal list (23.16), padding surface-padding-phone.
 * - Header: EntityMark sm 32 with the fund icon → 8 → the name
 *   body-strong one line; a draft puts the attention dot at the
 *   header's end (ق2: ONLY with a draft).
 * - Balance: Money lg (number-lg), then 4, the last-movement caption in
 *   text-secondary. A negative balance keeps its «−» with no extra
 *   colour (§2.3 item 4).
 * - Hidden amounts: the balance AND the last-movement line hide (§2.3
 *   item 6) — the caption carries amounts, so it hides with them.
 * - Screen reader: «درج الكاش، الرصيد 1,280 دينار، آخر حركة سالب 3
 *   دنانير أمس، فيه مسودة» (§2.3 item 7) — Money supplies the amount
 *   words; the app passes the rest.
 * - Press: the ObjectCard press treatment (scale(.98), §2.3 item 5).
 */
import { ar } from '../../i18n/ar';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { usePress } from '../../lib/use-press';
import { FundBankIcon, FundCashIcon, FundWalletIcon } from '../../icons';
import { EntityMark } from '../EntityMark/index';
import { Money } from '../Money/index';
import { Skeleton } from '../Skeleton/index';
import type { FundCardProps, FundType } from './FundCard.types';
import './FundCard.css';

const FUND_ICONS: Record<FundType, typeof FundCashIcon> = {
  cash: FundCashIcon,
  bank: FundBankIcon,
  wallet: FundWalletIcon,
};

export function FundCard({
  label,
  variant = 'cash',
  value,
  caption,
  draft = false,
  onPress,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: FundCardProps) {
  const { hidden: contextHidden } = useAmountVisibility();
  const loading = state === 'loading';
  const Icon = FUND_ICONS[variant];
  const { isPressed, pressProps } = usePress({ onPress, disabled: loading });

  const ariaLabel = [
    label,
    ar['fund.balanceWord'].text,
    draft ? ar['sr.fundHasDraft'].text : '',
  ]
    .filter(Boolean)
    .join(ar['sr.listSeparator'].text);

  const classes = [
    'mds-card-shell',
    'mds-fund-card',
    isPressed ? 'mds-card-shell--pressed' : '',
    loading ? 'mds-fund-card--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      id={id}
      style={style}
      className={classes}
      aria-label={ariaLabel}
      disabled={loading}
      data-ds-check="fund-card"
      {...pressProps}
      {...rest}
    >
      <span className="mds-fund-card-header">
        <EntityMark size="sm">
          <Icon size={16} />
        </EntityMark>
        <span className="mds-fund-card-name mds-type-body-strong">{label}</span>
        {draft ? <span className="mds-fund-card-dot" aria-hidden="true" /> : null}
      </span>
      <span className="mds-fund-card-balance">
        {loading ? (
          <>
            <Skeleton variant="hero" />
            <Skeleton variant="caption" />
          </>
        ) : contextHidden ? (
          <Money value={value} size="lg" />
        ) : (
          <>
            <Money value={value} size="lg" />
            {caption ? <span className="mds-fund-card-last mds-type-caption">{caption}</span> : null}
          </>
        )}
      </span>
    </button>
  );
}
