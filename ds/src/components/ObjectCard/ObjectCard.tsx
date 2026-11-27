/**
 * ObjectCard — the card size of the unified object (BRIEF 4.1 + 23.24).
 *
 * - Anatomy: EntityMark 64 → 12 → title `title-card` 18/26 TWO lines
 *   (clamp + ellipsis) → caption 13/20 → value amount-row → StatusBadge
 *   → ONE compact secondary Button (the next step) at the end.
 * - Allowed children per 23.24: mark, title, value, badge, second line,
 *   one compact secondary button. Banned: Surface inside, primary
 *   button, more than one button.
 * - Radius 24; width 280 in horizontal lists (size.horizontal-card-width)
 *   with full-width flexibility up to 720 in vertical layouts.
 * - Press: scale(.98) + surface-pressed (23.24 press table).
 * - Press surface (و-2 item 19): the WHOLE card is one press element
 *   (`<a>` when `href` is given, else a `<button>` when `onPress` is),
 *   and the next-step Button is a SIBLING positioned above it — never a
 *   nested interactive inside another (invalid HTML, a11y bug). The
 *   card reserves the action's space at its end; the action anchors to
 *   the card's padding corner. A passive card (no href/onPress) is a
 *   plain div.
 */
import { usePress } from '../../lib/use-press';
import { EntityMark } from '../EntityMark/index';
import type { ObjectCardProps } from './ObjectCard.types';
import './ObjectCard.css';

export function ObjectCard({
  leading,
  tone,
  label,
  caption,
  value,
  state,
  href,
  children,
  onPress,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: ObjectCardProps) {
  const { isPressed, pressProps } = usePress({ onPress: () => onPress?.(), disabled });
  const interactive = onPress !== undefined || href !== undefined;
  const hasAction = children !== undefined && children !== null;
  const Card = href ? 'a' : interactive ? 'button' : 'div';
  const classes = [
    'mds-object-card',
    isPressed ? 'mds-object-card--pressed' : '',
    disabled ? 'mds-object-card--disabled' : '',
    hasAction ? 'mds-object-card--with-action' : '',
    interactive ? '' : 'mds-object-card--passive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} id={id} style={style} className={['mds-object-card-wrap', disabled ? 'mds-object-card-wrap--disabled' : '', className].filter(Boolean).join(' ')} {...rest}>
      <Card
        className={classes}
        href={href}
        type={Card === 'button' ? 'button' : undefined}
        disabled={Card === 'button' ? disabled : undefined}
        {...(interactive ? pressProps : {})}
      >
        <span className="mds-object-card-mark">
          <EntityMark size="lg" tone={tone} value={typeof leading === 'string' ? leading : label}>
            {typeof leading === 'string' ? undefined : leading}
          </EntityMark>
          {state ? <span className="mds-object-card-state">{state}</span> : null}
        </span>
        <span className="mds-object-card-body">
          <span className="mds-object-card-title">{label}</span>
          {caption ? <span className="mds-object-card-caption mds-type-caption">{caption}</span> : null}
          {value !== undefined ? (
            <span className="mds-object-card-value mds-type-amount-row">
              {typeof value === 'string'
                ? <bdi dir="ltr">{value}</bdi>
                : /* A Money node renders itself (its own isolation, sign,
                     unit and hidden-amounts behaviour) — never re-wrapped. */
                  value}
            </span>
          ) : null}
        </span>
      </Card>
      {hasAction ? <span className="mds-object-card-action">{children}</span> : null}
    </div>
  );
}
