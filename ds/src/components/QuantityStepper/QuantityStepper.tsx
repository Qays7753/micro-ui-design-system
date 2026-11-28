/**
 * QuantityStepper.tsx — the integer quantity stepper (BATCH2-SPECS §1.6).
 *
 * - A dir="ltr" group (the number line reads left-to-right even in the RTL
 *   app): minus button, the number field, plus button, 8 between them
 *   (§1.6-2, criterion 1: «+» sits visually to the RIGHT of «−»).
 * - The buttons: size.icon-button circles at r-full with a hairline
 *   surface-edge border, the 20 icon in text-primary, pressed =
 *   surface-pressed (23.2). A quick tap steps once; a HOLD steps once at
 *   the long-press threshold and then repeats every
 *   motion.response-max-ms (100ms — §1.6-5) until release, cancel, or
 *   unmount. The keyboard hold (Enter/Space) rides the same repeat.
 * - The number: a real input, amount-row figures, centered, no border,
 *   inputmode="numeric", its touch floor is size.touch-min wide. Typing is
 *   accepted live; an out-of-range (or non-numeric) value returns to the
 *   bound on blur (§1.6-5). The displayed value is DERIVED from the
 *   controlled prop (a draft exists only while focused — no setState in
 *   an effect anywhere).
 * - «−» disables at min and «+» at max (§1.6-4, criterion 2: aria-disabled)
 *   — impossible steps are visibly off, not silently dropped.
 * - Screen reader (§1.6-7): the group is role="group" named by the label;
 *   the buttons say «إنقاص» and «زيادة». The polite announcement of each
 *   new value is the HOST's live region (the same §1.4-7 pattern).
 * - No texts of its own beyond the screen-reader words — everything else
 *   is the app's label (§1.6-8).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../../i18n/ar';
import { MinusIcon } from '../../icons';
import { PlusIcon } from '../../icons';
import { usePress } from '../../lib/use-press';
import { getToken } from '../../tokens/tokens';
import type { QuantityStepperProps } from './QuantityStepper.types';
import './QuantityStepper.css';

/** The repeat cadence of a held stepper button (§1.6-5). */
const REPEAT_MS: number = getToken('motion.response-max-ms');

export function QuantityStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: QuantityStepperProps) {
  /** The app owns the value; nothing passed = the lower bound (§1.6-4). */
  const current = value ?? min;
  const minusDisabled = disabled || current <= min;
  const plusDisabled = disabled || (max !== undefined && current >= max);

  /** The typing draft lives only while the field is focused; the displayed
   * value is derived, so an out-of-range draft returns to the bound on
   * blur. */
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(current);

  /** The latest step function and value, read by the repeat interval (the
   * interval outlives renders; a captured stale step would freeze the
   * count). The refs are written from an effect — never during render. */
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<(direction: 1 | -1) => void>(() => {});
  const valueRef = useRef<typeof value>(value);
  const stopRepeat = useCallback(() => {
    if (repeatTimer.current !== null) {
      clearInterval(repeatTimer.current);
      repeatTimer.current = null;
    }
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setDraft(null);
      const next = (valueRef.current ?? min) + direction;
      if (next < min || (max !== undefined && next > max)) return;
      onChange?.(next);
    },
    [min, max, onChange],
  );
  useEffect(() => {
    stepRef.current = step;
    valueRef.current = value;
  });

  const startRepeat = useCallback((direction: 1 | -1) => {
    stopRepeat();
    stepRef.current(direction);
    repeatTimer.current = setInterval(() => stepRef.current(direction), REPEAT_MS);
  }, [stopRepeat]);

  // A repeat never survives the component's unmount.
  useEffect(() => stopRepeat, [stopRepeat]);

  const classes = ['mds-quantity-stepper', disabled ? 'mds-quantity-stepper--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      dir="ltr"
      role="group"
      aria-label={label}
      data-value={current}
      {...rest}
    >
      <StepButton
        icon={<MinusIcon size={20} />}
        name={t('quantity.decrease')}
        disabled={minusDisabled}
        step={() => step(-1)}
        startRepeat={() => startRepeat(-1)}
        stopRepeat={stopRepeat}
      />
      <input
        type="text"
        className="mds-quantity-stepper-input mds-type-amount-row"
        inputMode="numeric"
        aria-label={label}
        value={shown}
        disabled={disabled}
        onFocus={() => setDraft(String(current))}
        onChange={(event) => {
          const raw = event.currentTarget.value;
          setDraft(raw);
          const parsed = Number.parseInt(raw, 10);
          if (Number.isFinite(parsed) && parsed >= min && (max === undefined || parsed <= max)) {
            onChange?.(parsed);
          }
        }}
        onBlur={() => {
          const parsed = Number.parseInt(draft ?? '', 10);
          const bounded = Number.isFinite(parsed)
            ? Math.min(Math.max(parsed, min), max ?? Number.MAX_SAFE_INTEGER)
            : current;
          if (bounded !== current) onChange?.(bounded);
          setDraft(null);
        }}
      />
      <StepButton
        icon={<PlusIcon size={20} />}
        name={t('quantity.increase')}
        disabled={plusDisabled}
        step={() => step(1)}
        startRepeat={() => startRepeat(1)}
        stopRepeat={stopRepeat}
      />
    </div>
  );
}

/** One stepper button: the bordered circle with its 20 icon. A quick tap
 * steps once (usePress's onPress); a hold starts the repeat cadence. The
 * stop handlers ride AFTER the spread so the release truly stops the
 * cadence (a spread placed last would override them). */
function StepButton({
  icon,
  name,
  disabled,
  step,
  startRepeat,
  stopRepeat,
}: {
  icon: React.ReactNode;
  name: string;
  disabled: boolean;
  step: () => void;
  startRepeat: () => void;
  stopRepeat: () => void;
}) {
  const { isPressed, pressProps } = usePress({
    onPress: step,
    onLongPress: startRepeat,
    disabled,
  });
  const classes = [
    'mds-quantity-stepper-button',
    isPressed ? 'mds-quantity-stepper-button--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={name}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onKeyDown={(event) => {
        // The keyboard hold rides the same repeat cadence: the first
        // keydown steps, a held key repeats, keyup stops (the browser's
        // click on keyup hits no onClick — no double step).
        if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
          event.preventDefault();
          startRepeat();
        }
      }}
      onKeyUp={(event) => {
        if (event.key === ' ' || event.key === 'Enter') stopRepeat();
      }}
      {...pressProps}
      onPointerUp={(event) => {
        stopRepeat();
        pressProps.onPointerUp(event);
      }}
      onPointerCancel={(event) => {
        stopRepeat();
        pressProps.onPointerCancel(event);
      }}
    >
      {icon}
    </button>
  );
}
