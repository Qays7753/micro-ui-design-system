/**
 * MovementRow — a money-in / money-out movement in a list (BATCH2-SPECS
 * §2.1).
 *
 * - The ObjectRow anatomy (row-with-mark 72, its own CSS classes) with
 *   the movement mark: movement-in / movement-out icon 24 on the entity
 *   surface (object mark, §2.1 item 2). Built directly on the row
 *   primitives (not through ObjectRow) because the long-press action
 *   menu (§2.1 item 4) needs usePress's own onLongPress hook.
 * - The end column: Money md with the sign from the direction («+» /
 *   «−» U+2212), ALWAYS text-primary (ق2 — an outgoing amount is not
 *   red, BRIEF 8).
 * - Draft: the «مسودة» waiting StatusBadge in place of the time (ق3: no
 *   badge on a normal saved row).
 * - Hidden amounts (§2.1 item 6): «•••• د» with NO sign — the sign rides
 *   on Money, which drops it when hidden.
 * - Screen reader: «خارج، أبو محمد (بقالة النور)، درج الكاش، سالب 3
 *   دنانير، 10:42 صباحاً» — the direction word first (§2.1 item 7).
 * - Loading: the Skeleton row in the row's own shape (§0.2 item 1).
 */
import { t } from '../../i18n/ar';
import { usePress } from '../../lib/use-press';
import { MovementInIcon, MovementOutIcon } from '../../icons';
import { EntityMark } from '../EntityMark/index';
import { Money } from '../Money/index';
import { Skeleton } from '../Skeleton/index';
import { StatusBadge } from '../StatusBadge/index';
import type { MovementRowProps } from './MovementRow.types';
import './MovementRow.css';

export function MovementRow({
  label,
  caption,
  value,
  direction,
  draft = false,
  time,
  onPress,
  onLongPress,
  state = 'idle',
  disabled = false,
  trailing,
  className,
  id,
  style,
  ref,
  ...rest
}: MovementRowProps) {
  const { isPressed, pressProps } = usePress({ onPress, onLongPress, disabled });

  if (state === 'loading') {
    // §0.2 item 1: the skeleton takes the row's own shape — mark 44, a
    // title line, an amount block; nothing of the real numbers in the DOM.
    return (
      <div className="mds-movement-row mds-movement-row--loading mds-object-row" aria-busy="true" id={id} style={style} ref={ref as React.Ref<HTMLDivElement>}>
        <EntityMark>
          <Skeleton variant="mark" />
        </EntityMark>
        <span className="mds-movement-row-text">
          <Skeleton variant="body" />
          <Skeleton variant="caption" />
        </span>
        <span className="mds-movement-row-end">
          <Skeleton variant="caption" />
        </span>
      </div>
    );
  }

  const classes = [
    'mds-movement-row',
    'mds-object-row',
    isPressed ? 'mds-object-row--pressed' : '',
    disabled ? 'mds-object-row--disabled' : '',
    'mds-movement-row--' + direction,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = [
    direction === 'out' ? t('sr.movementRowOut') : t('sr.movementRowIn'),
    label,
    caption,
    value === null || value === undefined ? t('money.ariaMissing') : '',
    draft ? t('state.draft') : time ?? '',
  ]
    .filter(Boolean)
    .join(t('sr.listSeparator'));

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      id={id}
      style={style}
      type="button"
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      data-ds-check="movement-row"
      {...pressProps}
      {...rest}
    >
      <EntityMark>
        {direction === 'in' ? <MovementInIcon size={24} /> : <MovementOutIcon size={24} />}
      </EntityMark>
      <span className="mds-object-row-text">
        <span className="mds-object-row-title mds-type-body-strong">{label}</span>
        {caption ? <span className="mds-object-row-caption mds-type-caption">{caption}</span> : null}
      </span>
      <span className="mds-object-row-end">
        <span className="mds-object-row-value mds-type-amount-row">
          <Money value={value} flow={direction} />
        </span>
        <span className="mds-object-row-time mds-type-caption">
          {draft ? <StatusBadge tone="waiting" label={t('state.draft')} /> : trailing ?? time}
        </span>
      </span>
    </button>
  );
}
