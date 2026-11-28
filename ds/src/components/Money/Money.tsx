/**
 * Money — the amount display (BRIEF section 8, 9.3, 23.22).
 *
 * - The digits and the sign sit inside a LTR isolation (<bdi dir="ltr">); the
 *   unit «د» follows the number with the token unit gap, and the amount
 *   never wraps (white-space: nowrap).
 * - Signs: in «+», out «−» (U+2212), transfer none; the sign carries the
 *   number's own color — an outgoing amount is NOT red (BRIEF 8).
 * - Hidden amounts come from the app-owned context, never a prop (23.22):
 *   the component renders exactly «•••• د» (no sign, no fils, debt word
 *   kept) and keeps every digit out of the DOM — not even the screen-reader
 *   text carries the real value.
 * - The screen reader gets the amount in full words («سالب 35 دينار») from
 *   lib/format-money; the visual part is aria-hidden.
 * - No raw values: fonts, sizes, gaps and colors all come from tokens.css.
 */
import { getMoneyTexts } from '../../i18n/ar';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { formatMoney } from '../../lib/format-money';
import type { MoneyProps } from './Money.types';
import './Money.css';

export function Money({
  value,
  flow,
  debt,
  size = 'md',
  state = 'idle',
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: MoneyProps) {
  const { hidden: contextHidden } = useAmountVisibility();
  const hidden = contextHidden && value !== null && value !== undefined;
  const result = formatMoney(value, { flow, debt, hidden, texts: getMoneyTexts() });
  const classes = ['mds-money', `mds-money--${size}`, size === 'lg' ? 'mds-number-lg' : '', disabled ? 'mds-money--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  if (state === 'loading') {
    // BRIEF 8: a loading amount is a skeleton, never a zero. Busy, silent.
    return (
      <span ref={ref} id={id} style={style} className={classes} aria-busy="true" {...rest}>
        <span className="mds-money-skeleton" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      {/* key remounts the visual part on every shown/hidden swap so the
          quick cross-fade of 23.22 replays (outgoing fades, incoming draws). */}
      <span className="mds-money-visual" key={hidden ? 'hidden' : 'shown'} aria-hidden="true">
        {result.debtWord ? <span className="mds-money-debt">{result.debtWord}</span> : null}
        {result.missing ? (
          <span className="mds-money-missing">{getMoneyTexts().missingGlyph}</span>
        ) : (
          <>
            <bdi className="mds-money-value" dir="ltr">
              {result.hidden ? (
                getMoneyTexts().hiddenGlyph
              ) : (
                <>
                  <span className="mds-money-integer">
                    {result.sign}
                    {result.int}
                  </span>
                  {result.frac ? <span className="mds-money-fraction">{result.frac}</span> : null}
                </>
              )}
            </bdi>
            <span className="mds-money-unit">{result.unit}</span>
          </>
        )}
      </span>
      <span className="mds-visually-hidden">{result.aria}</span>
    </span>
  );
}
