/**
 * ObjectRow — the list row of an object (BRIEF 23.4).
 *
 * - Order from the start (RTL: right): EntityMark 44 → 12 → the text
 *   column (flex: 1, min-width: 0 — the title ellipsizes, NEVER the
 *   amount) → 12 → the end column (width by content, never truncated).
 * - Baselines: the title sits on the value's baseline; the caption sits
 *   on the time's baseline (align-items: baseline on both columns'
 *   first/second lines via matched line-heights).
 * - Heights (و-1 هـ1): the height follows what STARTS the row — this row
 *   always renders EntityMark 44, so every row is 72, one line or two;
 *   the one-line row centers its text vertically. The 56 plain rows (no
 *   mark, or a 24 icon: the actions/settings lists) are app-side patterns
 *   of 23.24(7), not this component.
 * - Press: the row-inset treatment (23.2). No trailing «›» (23.24).
 * - Values (batch-2 1.2): a FINANCIAL value must be passed as a <Money>
 *   node (md size — 23.4 fixes the size, not the shape) so the sign and
 *   the unit «د» ride on Money and the hidden-amounts context applies
 *   (23.22). Non-financial numbers stay plain text. A raw «45 د» text
 *   value FAILS the ds-money gate (rule 1: every amount through Money).
 */
import { usePress } from '../../lib/use-press';
import { EntityMark } from '../EntityMark/index';
import type { ObjectRowProps } from './ObjectRow.types';
import './ObjectRow.css';

export function ObjectRow({
  leading,
  tone,
  label,
  caption,
  value,
  trailing,
  onPress,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: ObjectRowProps) {
  const { isPressed, pressProps } = usePress({ onPress: () => onPress?.(), disabled });
  const interactive = onPress !== undefined;
  const classes = [
    'mds-object-row',
    isPressed ? 'mds-object-row--pressed' : '',
    disabled ? 'mds-object-row--disabled' : '',
    interactive ? '' : 'mds-object-row--passive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Root = interactive ? 'button' : 'div';

  return (
    <Root
      ref={ref as never}
      id={id}
      style={style}
      type={interactive ? 'button' : undefined}
      className={classes}
      disabled={interactive ? disabled : undefined}
      {...(interactive ? pressProps : {})}
      {...rest}
    >
      <EntityMark size="md" tone={tone} value={typeof leading === 'string' ? leading : label}>
        {typeof leading === 'string' ? undefined : leading}
      </EntityMark>
      <span className="mds-object-row-text">
        <span className="mds-object-row-title mds-type-body-strong">{label}</span>
        {caption ? <span className="mds-object-row-caption mds-type-caption">{caption}</span> : null}
      </span>
      {value !== undefined || trailing ? (
        <span className="mds-object-row-end">
          <span className="mds-object-row-value mds-type-amount-row">
            {value === undefined ? (
              <bdi dir="ltr">—</bdi>
            ) : typeof value === 'string' ? (
              <bdi dir="ltr">{value}</bdi>
            ) : (
              /* A Money node renders itself (its own LTR isolation, sign,
                 unit and hidden-amounts behaviour) — never re-wrapped. */
              value
            )}
          </span>
          {trailing ? <span className="mds-object-row-time mds-type-caption">{trailing}</span> : null}
        </span>
      ) : null}
    </Root>
  );
}
