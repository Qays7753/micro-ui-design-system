/**
 * SlotPicker — choosing a time from the available slots (BATCH2-SPECS
 * §3.6).
 *
 * - Labelled groups («صباحاً»، «مساءً») with layout.group-to-group between
 *   them; each group a 3-column equal grid (2 at 200%) of chips shaped
 *   like FilterChips: full radius, touch-min height (ق1), centered label
 *   with tabular digits.
 * - Single selection (ق2): the selected chip fills brand-anchor; pressing
 *   the selected slot keeps it.
 * - Unavailable slots render disabled («غير متاح» in the aria label).
 * - No available slots at all: EmptyState with NO button «لا أوقات
 *   متاحة في هذا اليوم.» (§3.6 item 4).
 * - Screen reader: a radiogroup per group (§3.6 item 7).
 */
import { ar } from '../../i18n/ar';
import { EmptyState } from '../EmptyState/index';
import { Skeleton } from '../Skeleton/index';
import type { SlotGroup, SlotPickerProps } from './SlotPicker.types';
import './SlotPicker.css';

export function SlotPicker({
  items,
  value,
  step: _step,
  onChange,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: SlotPickerProps) {
  const loading = state === 'loading';
  const hasSlots = items.some((group: SlotGroup) => group.slots.length > 0);

  if (!loading && !hasSlots) {
    return <EmptyState label={ar['slot.empty'].text} />;
  }

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-slot-picker', className].filter(Boolean).join(' ')}
      data-ds-check="slot-picker"
      {...rest}
    >
      {items.map((group) => (
        <div className="mds-slot-picker-group" key={group.label}>
          <p className="mds-slot-picker-group-label">{group.label}</p>
          {loading ? (
            <div className="mds-slot-picker-grid" aria-hidden="true">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} variant="caption" />
              ))}
            </div>
          ) : (
            <div className="mds-slot-picker-grid" role="radiogroup" aria-label={group.label}>
              {group.slots.map((slot) => {
                const unavailable = group.disabled?.includes(slot) ?? false;
                const selected = value === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={unavailable ? `${slot} ${ar['sr.slotUnavailable'].text}` : slot}
                    disabled={unavailable}
                    className={['mds-slot-picker-slot', selected ? 'mds-slot-picker-slot--selected' : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onChange(slot)}
                  >
                    <bdi dir="ltr">{slot}</bdi>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
