/**
 * FilterChips — the horizontally scrolling filter chip row (BRIEF 9.1).
 *
 * - Chips are 40 high inside a 48 touch row (9.1: 40 داخل لمس 48), full
 *   radius, 16 inline padding, 8 between them; the label type is `label`
 *   (14/20) and the selected one `label-strong`.
 * - Unselected: white with a 1px surface-edge border. Selected:
 *   brand-selected-bg fill, brand-anchor text and a ✓ 16 (SelectedIcon) —
 *   selection is never color alone (23.2).
 * - The row scrolls horizontally with NO arrows and NO edge fades
 *   (gradients are banned); the scrollbar is hidden. The next chip peeks
 *   at least 24px at first render and the end padding is 16 (23.16).
 * - Press: surface-pressed background (23.2), no scale, no ripple; the
 *   press cancels when the pointer moves more than 8px (lib/use-press).
 *   Focus ring 2px brand-text offset 2, :focus-visible only.
 * - Multi-select: tapping a chip toggles it in the value array; the app
 *   owns the selection (BRIEF 11). The row is a labelled group and each
 *   chip an aria-pressed button (23.17).
 */
import { usePress } from '../../lib/use-press';
import { SelectedIcon } from '../../icons';
import type { ChipOption } from './FilterChips.types';
import type { FilterChipsProps } from './FilterChips.types';
import './FilterChips.css';

export function FilterChips({
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
}: FilterChipsProps) {
  const toggle = (chipValue: string) => {
    const next = value.includes(chipValue)
      ? value.filter((v) => v !== chipValue)
      : [...value, chipValue];
    onChange(next);
  };

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-filter-chips', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
      {...rest}
    >
      {leading.map((chip) => (
        <Chip
          key={chip.value}
          chip={chip}
          selected={value.includes(chip.value)}
          disabled={disabled || chip.disabled === true}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}

/** One chip button: the selected look (fill + ✓) + press. */
function Chip({
  chip,
  selected,
  disabled,
  onToggle,
}: {
  chip: ChipOption;
  selected: boolean;
  disabled: boolean;
  onToggle: (value: string) => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: () => onToggle(chip.value), disabled });
  const classes = [
    'mds-filter-chip',
    selected ? 'mds-filter-chip--selected' : '',
    isPressed ? 'mds-filter-chip--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected === true}
      disabled={disabled}
      // The 48-high row (with its 4 block padding) is the touch zone; the
      // chip visual height is 40 (9.1) — the documented exemption pattern
      // of Button sm inside its 48 row (23.3).
      data-ds-exempt={disabled ? undefined : ''}
      {...pressProps}
    >
      {selected ? (
        <SelectedIcon size={16} className="mds-filter-chip-check" />
      ) : null}
      <span className="mds-filter-chip-label">{chip.label}</span>
    </button>
  );
}
