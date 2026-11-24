/**
 * HeroSurface — the screen's single hero (BRIEF 1.5, 23.8 — built exactly
 * as written, with NO chart line and NO addition: owner decision
 * 2026-11-25).
 *
 * - Fill brand-anchor, symmetric radius 24, padding 20 (24 on tablet);
 *   min-height 152; height by content. No ornaments, no watermark, no
 *   gradient, no background shape (23.8 ممنوع).
 * - Stack (23.8): label 14/20/500 on-anchor-secondary with the
 *   AmountVisibilityToggle at the line's end → 4 → value display-hero
 *   (Rubik 40/48/500, white, tabular, −0.01em on digits; cents the same
 *   size in on-anchor-secondary; unit «د.أ» Plex 16/24/500
 *   on-anchor-secondary on the number's baseline, 4 away) → 8 → diff line
 *   (arrow 14 + 13/20/600 on-anchor-secondary — direction by arrow and
 *   word ONLY, no green/red) → 12 → source link 13/20/600 white with a
 *   1px underline offset 3.
 * - «—» for a missing value keeps the SAME display-hero typography
 *   (owner decision 2026-11-25).
 * - A number that does not fit drops to number-lg 28/36 in ONE step
 *   (23.8) — the fit is declared by the app via the `density` prop? No:
 *   the app passes a long value; the drop is the app's choice made
 *   explicit here through the same token ladder, so the component does
 *   not guess: value strings longer than 9 digit-group characters render
 *   at number-lg (the «1,250,000.125 د.أ» case of 23.8).
 */
import { usePress } from '../../lib/use-press';
import { AmountVisibilityProvider, useAmountVisibility } from '../../lib/amount-visibility';
import { AmountVisibilityToggle } from '../AmountVisibilityToggle/index';
import type { HeroSurfaceProps } from './HeroSurface.types';
import './HeroSurface.css';

/** Split «1,245.750» into the white part and the on-anchor-secondary part. */
function splitValue(value: string): { whole: string; cents: string } {
  const dot = value.indexOf('.');
  if (dot === -1) return { whole: value, cents: '' };
  return { whole: value.slice(0, dot), cents: value.slice(dot) };
}

function HeroValue({ value }: { value: string }) {
  const { hidden } = useAmountVisibility();
  const { whole, cents } = splitValue(hidden ? '—' : value);
  // 23.8: «1,250,000.125 د.أ» does not fit at 40 — drop to number-lg
  // 28/36 in ONE step, no gradual shrinking. 9 chars covers the quoted
  // example without catching «12,345,678» (8) which does fit.
  const long = value.length > 9;
  const sizeClass = long ? 'mds-hero-value--lg mds-number-lg' : 'mds-hero-value--hero mds-type-display-hero';
  return (
    <span className={`mds-hero-value ${sizeClass}`}>
      <span className="mds-hero-value-whole">{whole}</span>
      {cents ? <span className="mds-hero-value-cents">{cents}</span> : null}
    </span>
  );
}

export function HeroSurface({
  label,
  value,
  trailing,
  direction,
  debt,
  onDismiss,
  className,
  id,
  style,
  ref,
  ...rest
}: HeroSurfaceProps) {
  const { isPressed, pressProps } = usePress({ onPress: () => onDismiss?.() });
  const { hidden } = useAmountVisibility();
  const classes = ['mds-hero-surface', className].filter(Boolean).join(' ');

  return (
    <AmountVisibilityProvider>
      <section ref={ref} id={id} style={style} className={classes} {...rest}>
        <header className="mds-hero-header">
          <span className="mds-hero-label">{label}</span>
          <AmountVisibilityToggle className="mds-hero-toggle" />
        </header>
        <p className="mds-hero-amount">
          <HeroValue value={value ?? '—'} />
          {trailing && !hidden ? <span className="mds-hero-unit">{trailing}</span> : null}
        </p>
        {direction ? <p className="mds-hero-diff">{direction}</p> : null}
        {debt ? (
          <button
            type="button"
            className={['mds-hero-source', isPressed ? 'mds-hero-source--pressed' : '']
              .filter(Boolean)
              .join(' ')}
            data-ds-exempt=""
            {...pressProps}
          >
            {debt}
          </button>
        ) : null}
      </section>
    </AmountVisibilityProvider>
  );
}
