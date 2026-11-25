/**
 * ProjectSwitcher — the project/role switcher trigger (BRIEF 9.1, 23.20).
 *
 * - EntityMark 32 + project name `body-strong` + role `micro` in
 *   text-secondary + the expand caret (CaretDown Bold 16, 23.23).
 * - ONE project AND one role => no caret at all (9.1: «من له مشروع
 *   ودور واحد لا يرى السهم») — `locked`.
 * - The name ellipsizes and NEVER pushes the bar's buttons: the 23.20
 *   row fixes min 120 / max bar-width − 3×48 − 16.
 * - Press/focus through the shared use-press treatment (23.2).
 */
import { usePress } from '../../lib/use-press';
import { EntityMark } from '../EntityMark/index';
import { ExpandIcon } from '../../icons';
import type { ProjectSwitcherProps } from './ProjectSwitcher.types';
import './ProjectSwitcher.css';

export function ProjectSwitcher({
  label,
  caption,
  locked = false,
  onPress,
  className,
  id,
  style,
  ref,
  ...rest
}: ProjectSwitcherProps) {
  const { isPressed, pressProps } = usePress({ onPress });

  const classes = [
    'mds-project-switcher',
    isPressed ? 'mds-project-switcher--pressed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      id={id}
      style={style}
      type="button"
      className={classes}
      {...rest}
      {...pressProps}
    >
      <EntityMark size="sm" value={label} />
      <span className="mds-project-switcher-text">
        <span className="mds-project-switcher-name mds-type-body-strong">{label}</span>
        {caption ? (
          <span className="mds-project-switcher-role">{caption}</span>
        ) : null}
      </span>
      {locked ? null : <ExpandIcon className="mds-project-switcher-caret" />}
    </button>
  );
}
