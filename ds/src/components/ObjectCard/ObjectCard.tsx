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
  const interactive = onPress !== undefined;
  const classes = [
    'mds-object-card',
    isPressed ? 'mds-object-card--pressed' : '',
    disabled ? 'mds-object-card--disabled' : '',
    interactive ? '' : 'mds-object-card--passive',
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
      <span className="mds-object-card-mark">
        <EntityMark size="lg" tone={tone} value={typeof leading === 'string' ? leading : undefined}>
          {typeof leading === 'string' ? undefined : leading}
        </EntityMark>
        {state ? <span className="mds-object-card-state">{state}</span> : null}
      </span>
      <span className="mds-object-card-body">
        <span className="mds-object-card-title">{label}</span>
        {caption ? <span className="mds-object-card-caption mds-type-caption">{caption}</span> : null}
        {value !== undefined ? <span className="mds-object-card-value mds-type-amount-row"><bdi dir="ltr">{value}</bdi></span> : null}
        {children ? <span className="mds-object-card-action">{children}</span> : null}
      </span>
    </Root>
  );
}
