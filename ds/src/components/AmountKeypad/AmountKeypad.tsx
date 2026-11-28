/**
 * AmountKeypad.tsx — the in-app amount number pad (ADDENDUM §1.4, BRIEF 9.4).
 *
 * - A 4×4 grid with dir="ltr" (digit order like any number pad, §1.4-2):
 *   columns 1–3 carry 1..9; column 4 rows 1–2 is the double-height
 *   backspace (icon 24, NOT flipped — the pad is LTR); column 4 row 3 is
 *   the «.»; row 4 is «0» (two columns) and «000» (two columns).
 * - The key: height size.keypad-key, radius r-md, surface background with
 *   a hairline surface-edge border, the glyph in number-lg text-primary,
 *   centered. Pressed = surface-pressed (23.2); disabled = disabled-fg.
 * - The pad reads the field's value: «.» disables once a dot exists and
 *   the digit/«000» keys disable once three fraction digits are typed
 *   (BRIEF 8's three-fraction ceiling) — impossible keys are visibly off,
 *   not silently dropped.
 * - The long press on backspace clears the field (onClearAll); repeated
 *   taps are the alternative (§1.4-5). External keyboards keep working on
 *   the field itself — the pad never intercepts physical input.
 * - Screen reader: every key is a real button named by its spoken word
 *   («واحد»… «ثلاثة أصفار», «فاصلة», «احذف») — §1.4-7.
 */
import type { ArKey } from '../../i18n/ar';
import { t } from '../../i18n/ar';
import { BackspaceIcon } from '../../icons';
import { usePress } from '../../lib/use-press';
import type { CSSProperties } from 'react';
import type { KeypadKey, AmountKeypadProps } from './AmountKeypad.types';
import './AmountKeypad.css';

/** The spoken names for the visible glyphs (§1.4-7). */
const SR_KEYS: Record<Exclude<KeypadKey, 'backspace'>, ArKey> = {
  '0': 'keypad.sr0',
  '1': 'keypad.sr1',
  '2': 'keypad.sr2',
  '3': 'keypad.sr3',
  '4': 'keypad.sr4',
  '5': 'keypad.sr5',
  '6': 'keypad.sr6',
  '7': 'keypad.sr7',
  '8': 'keypad.sr8',
  '9': 'keypad.sr9',
  '000': 'keypad.sr000',
  '.': 'keypad.srDecimal',
};

interface KeyButtonProps {
  /** The visible glyph («1», «000», «.») — also the emitted key (the
   * vocabulary's `value`: what the key IS, not what it is called). */
  value: Exclude<KeypadKey, 'backspace'>;
  /** The spoken name (§1.4-7) — the digit reads as its word. */
  label: ArKey;
  /** grid-area rides the standard style pass-through. */
  style?: CSSProperties;
  disabled: boolean;
  onPress: () => void;
}

function KeyButton({ value, label, style, disabled, onPress }: KeyButtonProps) {
  const { isPressed, pressProps } = usePress({ onPress, disabled });
  const box = [
    'mds-keypad-key',
    'mds-keypad-key--glyph',
    isPressed ? 'mds-keypad-key--pressed' : '',
    disabled ? 'mds-keypad-key--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      className={box}
      style={style}
      aria-label={t(label)}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...pressProps}
    >
      <span className="mds-keypad-key-label mds-number-lg">{value}</span>
    </button>
  );
}

interface BackspaceButtonProps {
  /** grid-area rides the standard style pass-through. */
  style?: CSSProperties;
  disabled: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function BackspaceButton({ style, disabled, onPress, onLongPress }: BackspaceButtonProps) {
  const { isPressed, pressProps } = usePress({ onPress, onLongPress, disabled });
  const box = [
    'mds-keypad-key',
    'mds-keypad-key--backspace',
    isPressed ? 'mds-keypad-key--pressed' : '',
    disabled ? 'mds-keypad-key--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      className={box}
      style={style}
      aria-label={t('keypad.srBackspace')}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...pressProps}
    >
      <BackspaceIcon size={24} />
    </button>
  );
}

export function AmountKeypad({
  value = '',
  onChange,
  onLongPress,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: AmountKeypadProps) {
  const hasDot = value.includes('.');
  const fraction = hasDot ? (value.split('.')[1] ?? '').length : 0;
  const fractionFull = hasDot && fraction >= 3;

  const classes = ['mds-keypad', disabled ? 'mds-keypad--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  const keyDisabled = (glyph: Exclude<KeypadKey, 'backspace'>) =>
    disabled ||
    (glyph === '.' && hasDot) ||
    (glyph !== '.' && fractionFull);

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={classes}
      dir="ltr"
      role="group"
      aria-label={t('keypad.srGroup')}
      data-value={value}
      {...rest}
    >
      <KeyButton value="1" label={SR_KEYS['1']} style={{ gridArea: '1 / 1 / 2 / 2' }} disabled={keyDisabled('1')} onPress={() => onChange?.('1')} />
      <KeyButton value="2" label={SR_KEYS['2']} style={{ gridArea: '1 / 2 / 2 / 3' }} disabled={keyDisabled('2')} onPress={() => onChange?.('2')} />
      <KeyButton value="3" label={SR_KEYS['3']} style={{ gridArea: '1 / 3 / 2 / 4' }} disabled={keyDisabled('3')} onPress={() => onChange?.('3')} />
      <BackspaceButton
        style={{ gridArea: '1 / 4 / 3 / 5' }}
        disabled={disabled}
        onPress={() => onChange?.('backspace')}
        onLongPress={() => onLongPress?.()}
      />
      <KeyButton value="4" label={SR_KEYS['4']} style={{ gridArea: '2 / 1 / 3 / 2' }} disabled={keyDisabled('4')} onPress={() => onChange?.('4')} />
      <KeyButton value="5" label={SR_KEYS['5']} style={{ gridArea: '2 / 2 / 3 / 3' }} disabled={keyDisabled('5')} onPress={() => onChange?.('5')} />
      <KeyButton value="6" label={SR_KEYS['6']} style={{ gridArea: '2 / 3 / 3 / 4' }} disabled={keyDisabled('6')} onPress={() => onChange?.('6')} />
      <KeyButton value="7" label={SR_KEYS['7']} style={{ gridArea: '3 / 1 / 4 / 2' }} disabled={keyDisabled('7')} onPress={() => onChange?.('7')} />
      <KeyButton value="8" label={SR_KEYS['8']} style={{ gridArea: '3 / 2 / 4 / 3' }} disabled={keyDisabled('8')} onPress={() => onChange?.('8')} />
      <KeyButton value="9" label={SR_KEYS['9']} style={{ gridArea: '3 / 3 / 4 / 4' }} disabled={keyDisabled('9')} onPress={() => onChange?.('9')} />
      <KeyButton value="." label={SR_KEYS['.']} style={{ gridArea: '3 / 4 / 4 / 5' }} disabled={keyDisabled('.')} onPress={() => onChange?.('.')} />
      <KeyButton value="0" label={SR_KEYS['0']} style={{ gridArea: '4 / 1 / 5 / 3' }} disabled={keyDisabled('0')} onPress={() => onChange?.('0')} />
      <KeyButton value="000" label={SR_KEYS['000']} style={{ gridArea: '4 / 3 / 5 / 5' }} disabled={keyDisabled('000')} onPress={() => onChange?.('000')} />
    </div>
  );
}
