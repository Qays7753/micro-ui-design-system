/**
 * ObjectRow — the list row of an object (BRIEF 23.4).
 *
 * - Order from the start (RTL: right): EntityMark 44 → 12 → the text
 *   column (flex: 1, min-width: 0 — the title ellipsizes, NEVER the
 *   amount) → 12 → the end column (width by content, never truncated).
 * - Baselines: the title sits on the value's baseline; the caption sits
 *   on the time's baseline (align-items: baseline on both columns'
 *   first/second lines via matched line-heights).
 * - Heights: 72 two lines, 56 one line (from padding 12×2 + line pairs).
 * - Press: the row-inset treatment (23.2). No trailing «›» (23.24).
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
    caption || trailing ? '' : 'mds-object-row--one-line',
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
      <EntityMark size="md" tone={tone} value={typeof leading === 'string' ? leading : undefined}>
        {typeof leading === 'string' ? undefined : leading}
      </EntityMark>
      <span className="mds-object-row-text">
        <span className="mds-object-row-title">{label}</span>
        {caption ? <span className="mds-object-row-caption">{caption}</span> : null}
      </span>
      {value !== undefined || trailing ? (
        <span className="mds-object-row-end">
          <span className="mds-object-row-value">{value ?? '—'}</span>
          {trailing ? <span className="mds-object-row-time">{trailing}</span> : null}
        </span>
      ) : null}
    </Root>
  );
}
