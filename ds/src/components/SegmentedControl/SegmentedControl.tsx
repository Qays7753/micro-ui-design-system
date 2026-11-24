/**
 * SegmentedControl — the 2–4 segment switcher (BRIEF 9.1).
 *
 * - 48 high on a `track` background with a full radius and 4 padding; the
 *   selected segment is white with a 1px surface-edge border and NO shadow
 *   (9.1: المحدد أبيض بحد 1px بلا ظل); its label is label-strong, the rest
 *   label (14/20).
 * - Every segment is ≥ 72 wide and they share the width equally when the
 *   control fills its container (23.20); 4 segments maximum.
 * - Selection is not color alone: the selected label is bold (label-strong)
 *   and the segment's aria-pressed/aria-checked state is announced (23.2).
 * - Press: surface-pressed background on the segment (23.2), no scale, no
 *   ripple; the press cancels when the pointer moves more than 8px
 *   (lib/use-press). Focus ring 2px brand-text offset 2, :focus-visible only.
 * - The control is an element group: role="group" with an aria-label; the
 *   selected segment is marked aria-pressed="true" on its button.
 * - It renders real buttons; the app owns the selection state (BRIEF 11).
 */
import { usePress } from '../../lib/use-press';
import type { SegmentOption } from './SegmentedControl.types';
import type { SegmentedControlProps } from './SegmentedControl.types';
import './SegmentedControl.css';

export function SegmentedControl({
  leading,
  value,
  onChange,
  disabled = false,
  label,
  className,
  id,
  style,
  ref,
  ...rest
}: SegmentedControlProps) {
  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-segmented', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
      {...rest}
    >
      {leading.map((segment) => (
        <Segment
          key={segment.value}
          segment={segment}
          selected={segment.value === value}
          disabled={disabled || segment.disabled === true}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

/** One segment button: the selected look (white, 1px border, no shadow) + press. */
function Segment({
  segment,
  selected,
  disabled,
  onChange,
}: {
  segment: SegmentOption;
  selected: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: () => onChange(segment.value), disabled });
  const classes = [
    'mds-segmented-segment',
    selected ? 'mds-segmented-segment--selected' : '',
    isPressed ? 'mds-segmented-segment--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected === true}
      disabled={disabled}
      // The 48-high track (with its 4 padding, 9.1) is the touch zone; the
      // segment visual height is 40 — the documented exemption pattern of
      // Button sm inside its 48 row (23.3).
      data-ds-exempt={disabled ? undefined : ''}
      {...pressProps}
    >
      {segment.leading ? <span className="mds-segmented-segment-icon" aria-hidden="true">{segment.leading}</span> : null}
      <span className="mds-segmented-segment-label">{segment.label}</span>
    </button>
  );
}
