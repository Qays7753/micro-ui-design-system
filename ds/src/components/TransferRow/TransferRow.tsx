/**
 * TransferRow — a transfer between two funds in a list (BATCH2-SPECS §2.2).
 *
 * - The ObjectRow anatomy (row-with-mark 72) with the transfer mark
 *   (arrows-left-right icon 24 on the entity surface).
 * - The title: «درج الكاش ← الحساب البنكي» — the text arrow renders
 *   visually between the two fund names and is aria-hidden; the screen
 *   reader hears «تحويل من درج الكاش إلى الحساب البنكي» (§2.2 ق2). One
 *   line, ellipsized from the end so the FIRST fund name stays whole
 *   (§2.2 item 6).
 * - The end column: Money md with NO sign (ق1), then the time.
 * - Hidden amounts: «•••• د» (§2.2 item 6).
 * - Loading: the Skeleton row in the row's own shape (§0.2 item 1).
 */
import { t } from '../../i18n/ar';
import { usePress } from '../../lib/use-press';
import { TransferIcon } from '../../icons';
import { EntityMark } from '../EntityMark/index';
import { Money } from '../Money/index';
import { Skeleton } from '../Skeleton/index';
import type { TransferRowProps } from './TransferRow.types';
import './TransferRow.css';

export function TransferRow({
  from,
  to,
  caption,
  value,
  time,
  onPress,
  onLongPress,
  state = 'idle',
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: TransferRowProps) {
  const { isPressed, pressProps } = usePress({ onPress, onLongPress, disabled });

  if (state === 'loading') {
    return (
      <div className="mds-transfer-row mds-transfer-row--loading mds-object-row" aria-busy="true" id={id} style={style} ref={ref as React.Ref<HTMLDivElement>}>
        <EntityMark>
          <Skeleton variant="mark" />
        </EntityMark>
        <span className="mds-transfer-row-text">
          <Skeleton variant="body" />
          <Skeleton variant="caption" />
        </span>
        <span className="mds-transfer-row-end">
          <Skeleton variant="caption" />
        </span>
      </div>
    );
  }

  const classes = [
    'mds-transfer-row',
    'mds-object-row',
    isPressed ? 'mds-object-row--pressed' : '',
    disabled ? 'mds-object-row--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = [
    t('sr.transferFrom', { from, to }),
    caption,
    value === null || value === undefined ? t('money.ariaMissing') : '',
    time ?? '',
  ]
    .filter(Boolean)
    .join(t('sr.listSeparator'));

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      style={style}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      data-ds-check="transfer-row"
      {...pressProps}
      {...rest}
    >
      <EntityMark>
        <TransferIcon size={24} />
      </EntityMark>
      <span className="mds-object-row-text">
        <span className="mds-object-row-title mds-type-body-strong">
          {/* One line, ellipsized from the END: the first fund name stays
              whole (§2.2 item 6) — direction-aware overflow. */}
          <span className="mds-transfer-row-route">
            {from}
            <span className="mds-transfer-row-arrow" aria-hidden="true">{t('transfer.arrow')}</span>
            {to}
          </span>
        </span>
        {caption ? <span className="mds-object-row-caption mds-type-caption">{caption}</span> : null}
      </span>
      <span className="mds-object-row-end">
        <span className="mds-object-row-value mds-type-amount-row">
          <Money value={value} flow="transfer" />
        </span>
        {time ? <span className="mds-object-row-time mds-type-caption">{time}</span> : null}
      </span>
    </button>
  );
}
