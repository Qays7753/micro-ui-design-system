/**
 * MovementTypeControl.tsx — the in/out/transfer switch (BATCH2-SPECS §1.5).
 *
 * - The segmented anatomy, COMPOSED: the track and the segments render the
 *   mds-segmented-* classes of SegmentedControl (§1.5-2: «SegmentedControl
 *   من الدفعة الأولى بثلاثة أجزاء») — the visual contract is the shared
 *   one, not a copy of it (ds-dup). Exactly three fixed segments in the
 *   order inside → outside → transfer, no icons.
 * - The words come from the dictionary (24.3: داخل، خارج، تحويل) through
 *   t(), so a host-app text override flows in (3ج.1).
 * - Screen reader (§1.5-7): a radiogroup named «نوع الحركة»; each segment
 *   is a radio with aria-checked. The arrow keys walk the three segments.
 * - error (§1.5-4): saving with nothing chosen shows «اختر نوع الحركة»
 *   under the control — the app passes state="error" at save time.
 * - Press: surface-pressed background on the segment (23.2), no scale; the
 *   transition to a new selection is motion.quick (§1.5-5).
 */
import { t } from '../../i18n/ar';
import type { ArKey } from '../../i18n/ar';
import { usePress } from '../../lib/use-press';
import type { MovementTypeValue } from './MovementTypeControl.types';
import type { MovementTypeControlProps } from './MovementTypeControl.types';
import './MovementTypeControl.css';

/** The three segments in the spec's fixed order (§1.5-2), each carrying its
 * dictionary word (24.3) — the app never passes labels. */
const SEGMENTS: ReadonlyArray<{ value: MovementTypeValue; word: ArKey }> = [
  { value: 'in', word: 'movement.in' },
  { value: 'out', word: 'movement.out' },
  { value: 'transfer', word: 'movement.transfer' },
];

export function MovementTypeControl({
  value,
  onChange,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: MovementTypeControlProps) {
  const classes = [
    'mds-movement-type',
    state === 'error' ? 'mds-movement-type--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /** The arrows walk the three segments (§1.5-7's radio semantics): the
   * next/previous value fires and its button takes focus. ArrowLeft is
   * forward in RTL, ArrowRight backward; both accepted either way. */
  const walk = (from: MovementTypeValue | undefined, step: 1 | -1) => {
    const currentIndex = from === undefined ? -1 : SEGMENTS.findIndex((s) => s.value === from);
    return SEGMENTS[(currentIndex + step + SEGMENTS.length) % SEGMENTS.length] ?? SEGMENTS[0];
  };

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      role="radiogroup"
      aria-label={t('movementType.srGroup')}
      data-value={value ?? ''}
      {...rest}
    >
      {/* The segmented track — SegmentedControl's own classes (§1.5-2). */}
      <div className="mds-segmented">
        {SEGMENTS.map((segment) => (
          <Segment
            key={segment.value}
            segment={segment}
            selected={segment.value === value}
            disabled={disabled}
            onChange={onChange}
            walk={walk}
          />
        ))}
      </div>
      {state === 'error' ? (
        <span className="mds-movement-type-error mds-type-caption">{t('movementType.choose')}</span>
      ) : null}
    </div>
  );
}

/** One segment button: the selected look (white, 1px border, label-strong)
 * + the press treatment — all from the shared segmented classes. The radio
 * semantics ride role=radio/aria-checked (§1.5-7). */
function Segment({
  segment,
  selected,
  disabled,
  onChange,
  walk,
}: {
  segment: { value: MovementTypeValue; word: ArKey };
  selected: boolean;
  disabled: boolean;
  onChange?: (value: MovementTypeValue) => void;
  walk: (from: MovementTypeValue | undefined, step: 1 | -1) => { value: MovementTypeValue };
}) {
  const { isPressed, pressProps } = usePress({ onPress: () => onChange?.(segment.value), disabled });
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
      role="radio"
      className={classes}
      aria-checked={selected}
      aria-label={t(segment.word)}
      disabled={disabled}
      // The 48-high track (with its 4 padding, 9.1) is the touch zone; the
      // segment visual height is 40 — the documented exemption pattern of
      // SegmentedControl's own segments (23.3, ds-small-screen).
      data-ds-exempt={disabled ? undefined : ''}
      onKeyDown={(event) => {
        // §1.5-7's radio semantics: the arrows walk the three segments —
        // the walked-to value fires and its button takes focus.
        const step =
          event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? 1
          : event.key === 'ArrowRight' || event.key === 'ArrowUp' ? -1
          : 0;
        if (step === 0) return;
        event.preventDefault();
        const next = walk(segment.value, step);
        onChange?.(next.value);
        const track = event.currentTarget.parentElement;
        const buttons = track
          ? Array.from(track.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
          : [];
        buttons[SEGMENTS.findIndex((s) => s.value === next.value)]?.focus();
      }}
      {...pressProps}
    >
      <span className="mds-segmented-segment-label">{t(segment.word)}</span>
    </button>
  );
}
