/**
 * AmountVisibilityToggle — the hide/show amounts button (BRIEF 23.22 [مؤكد]).
 *
 * - An IconButton: 48 (56 in driver density) with Eye when amounts are shown
 *   and EyeSlash when hidden, Regular 24 (23.22 + 23.23 `amounts-shown` /
 *   `amounts-hidden`).
 * - Its accessible name follows the state: «إخفاء المبالغ» / «إظهار المبالغ».
 * - It owns no state: it reads the app-owned context and reports the press
 *   through onChange(visible) — the app applies it to AmountVisibilityProvider.
 * - Its place per the brief is the end of the label line inside HeroSurface
 *   and the ProjectSwitcher row; the component itself is surface-agnostic.
 */
import { t } from '../../i18n/ar';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { AmountsHiddenIcon } from '../../icons';
import { AmountsShownIcon } from '../../icons';
import type { AmountVisibilityToggleProps } from './AmountVisibilityToggle.types';
import './AmountVisibilityToggle.css';

export function AmountVisibilityToggle({
  onChange,
  disabled = false,
  density = 'regular',
  className,
  id,
  style,
  ref,
  ...rest
}: AmountVisibilityToggleProps) {
  const { hidden, visible } = useAmountVisibility();
  const Icon = hidden ? AmountsHiddenIcon : AmountsShownIcon;
  const label = hidden ? t('button.showAmounts') : t('button.hideAmounts');
  const classes = [
    'mds-amount-visibility-toggle',
    density === 'large' ? 'mds-amount-visibility-toggle--large' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      id={id}
      style={style}
      {...rest}
      type="button"
      className={classes}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!visible)}
    >
      <Icon size={24} />
    </button>
  );
}
