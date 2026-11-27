/**
 * ObjectRow — the list row of an object (BRIEF 23.4).
 *
 * - Order from the start (RTL: right): EntityMark 44 → 12 → the text
 *   column (flex: 1, min-width: 0 — the title ellipsizes, NEVER the
 *   amount) → 12 → the end column (width by content, never truncated).
 * - Baselines: the title sits on the value's baseline; the caption sits
 *   on the time's baseline (align-items: baseline on both columns'
 *   first/second lines via matched line-heights).
 * - Heights (و-1 هـ1): the height follows what STARTS the row — an entity
 *   row renders EntityMark 44, so every entity row is 72, one line or two;
 *   the one-line row centers its text vertically. An ICON row (ت4 1.7: a
 *   ReactNode `leading` — an action or a setting) starts with the icon 20
 *   in text-secondary and rides the row-plain 56 height.
 * - Press: the row-inset treatment (23.2 + 1.7 ت13): surface-pressed
 *   background, inset 8 from the surface's edges (the row's own padding
 *   absorbs the inset so the CONTENT never moves), corner radius r-sm 8 —
 *   to sit inside a surface whose own corner is 16 (radius.lg). No
 *   trailing «›» (23.24).
 * - Landed (1.7 ت12): after a save closes its sheet the affected row
 *   plays motion.landed ONCE — brand-selected-bg fading to transparent
 *   over 1200ms ease-out (reduced motion: no fade; the Toast alone
 *   signals) — with the same floating-inset geometry as the press.
 * - End column (ت5 1.7): a row WITHOUT a value shows NOTHING at its end —
 *   «—» belongs to a LABELED value cell (KeyValueList, Metric), never to
 *   an object row.
 * - Values (batch-2 1.2): a FINANCIAL value must be passed as a <Money>
 *   node (md size — 23.4 fixes the size, not the shape) so the sign and
 *   the unit «د» ride on Money and the hidden-amounts context applies
 *   (23.22). Non-financial numbers stay plain text. A raw «45 د» text
 *   value FAILS the ds-money gate (rule 1: every amount through Money).
 */
import type { ReactNode } from 'react';
import { usePress } from '../../lib/use-press';
import { EntityMark } from '../EntityMark/index';

/** A ReactNode leading is the icon-row pattern (ت4); a string is the mark's
 *  value; undefined renders the mark from the label. */
function isIconLead(leading: ReactNode): leading is ReactNode {
  return leading !== undefined && leading !== null && typeof leading !== 'string';
}
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
  landed = false,
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
    isIconLead(leading) ? 'mds-object-row--icon' : '',
    isPressed ? 'mds-object-row--pressed' : '',
    landed ? 'mds-object-row--landed' : '',
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
      {isIconLead(leading) ? (
        /* ت4 (1.7): a NON-entity row (an action, a setting) starts with its
           icon 20 in text-secondary — no 44 mark box, a row-plain height. */
        <span className="mds-object-row-icon" aria-hidden="true">{leading}</span>
      ) : (
        <EntityMark size="md" tone={tone} value={typeof leading === 'string' ? leading : label} />
      )}
      <span className="mds-object-row-text">
        <span className="mds-object-row-title mds-type-body-strong">{label}</span>
        {caption ? <span className="mds-object-row-caption mds-type-caption">{caption}</span> : null}
      </span>
      {value !== undefined || trailing ? (
        <span className="mds-object-row-end">
          {value !== undefined ? (
            <span className="mds-object-row-value mds-type-amount-row">
              {typeof value === 'string' ? (
                <bdi dir="ltr">{value}</bdi>
              ) : (
                /* A Money node renders itself (its own LTR isolation, sign,
                   unit and hidden-amounts behaviour) — never re-wrapped. */
                value
              )}
            </span>
          ) : null}
          {trailing ? <span className="mds-object-row-time mds-type-caption">{trailing}</span> : null}
        </span>
      ) : null}
    </Root>
  );
}
