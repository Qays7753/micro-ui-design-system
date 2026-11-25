/**
 * TabBar — the bottom tab bar (BRIEF 9.1, 23.16, 23.20, 27.3).
 *
 * - 64 (size.tab-bar) + the safe area below; 2 to 5 tabs as
 *   TabBarTab children, equal widths, max 120 each (23.20).
 * - White surface with the PERMANENT 1px `surface-edge` top hairline
 *   (23.16: «حده العلوي ثابت دائماً» — unlike ContextBar/ActionBar).
 * - Inactive: icon Regular `text-secondary`, label `micro`. Active:
 *   icon Fill `brand-logo`, label `text-primary`, NO background
 *   behind it. Label «مشروع اليوم» fits one line at 5 items on 360.
 * - The active tab carries aria-current="page" (23.17). The app owns
 *   the order — the component forces no tab position.
 * - layer.bars (23.15).
 */
import { Children, type ReactElement } from 'react';
import { usePress } from '../../lib/use-press';
import type { TabBarProps, TabBarTabProps } from './TabBar.types';
import './TabBar.css';

function TabBarTab({
  label,
  selected = false,
  leading,
  onPress,
  className,
  ref,
  ...rest
}: TabBarTabProps) {
  const { isPressed, pressProps } = usePress({ onPress });

  const classes = [
    'mds-tab',
    selected ? 'mds-tab--active' : '',
    isPressed ? 'mds-tab--pressed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      className={classes}
      aria-selected={selected}
      aria-current={selected ? 'page' : undefined}
      tabIndex={selected ? 0 : -1}
      {...rest}
      {...pressProps}
    >
      {leading ? <span className="mds-tab-icon" aria-hidden="true">{leading}</span> : null}
      <span className="mds-tab-label">{label}</span>
    </button>
  );
}

export function TabBar({
  children,
  value,
  onChange,
  className,
  id,
  style,
  ref,
  ...rest
}: TabBarProps) {
  // value drives the roving tabindex even for uncontrolled usage; the
  // TabBarTab itself carries the visual selected state. If ANY child
  // carries an explicit `selected`, the app owns the selection fully
  // and the positional default never applies.
  const childrenArray = Children.toArray(children) as ReactElement[];
  const explicit = childrenArray.some(
    (c) => c && typeof c === 'object' && 'props' in c
      && (c.props as Partial<TabBarTabProps>).selected !== undefined,
  );
  const activeIndex = value ?? 0;

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-tab-bar', className].filter(Boolean).join(' ')}
      role="tablist"
      {...rest}
    >
      {childrenArray.map((child, index) => {
        if (child && typeof child === 'object' && 'props' in child) {
          const childProps = child.props as Partial<TabBarTabProps>;
          const selected = explicit
            ? childProps.selected === true
            : index === activeIndex;
          // The bar also reports the index to onChange (23.18), while
          // the tab's own onPress stays the app's handler.
          const tabOnPress = () => {
            childProps.onPress?.();
            onChange?.(index);
          };
          return {
            ...child,
            props: { ...childProps, selected, onPress: tabOnPress },
          } as ReactElement;
        }
        return child;
      })}
    </div>
  );
}

export { TabBarTab };
