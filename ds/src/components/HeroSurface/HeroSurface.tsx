/**
 * HeroSurface — the screen's single hero (BRIEF 1.5, 23.8 — with the ONE
 * addition addendum 1.6 allows: the optional small line, 23.25; structure
 * per addendum 1.7 ت2).
 *
 * - Fill brand-anchor, symmetric radius 16 (radius.lg), padding 20 (24 on
 *   tablet); min-height 152; height by content. No ornaments, no
 *   watermark, no gradient, no background shape (23.8 ممنوع).
 * - Stack (1.7 ت2, top to bottom):
 *   1. Label line 20 high — 14/20/500 on-anchor-secondary with the
 *      AmountVisibilityToggle at the line's end; the toggle's 48 touch
 *      area rides INSIDE the padding and does not raise the line.
 *   2. 8 → value display-hero (Rubik 40/48/500, white, tabular, −0.01em
 *      on digits; cents the same size in on-anchor-secondary; unit «د»
 *      Plex 16/24/500 on-anchor-secondary on the number's baseline, 4
 *      away).
 *   3. 8 → ONE line: the diff (arrow 14 + 13/20/600 on-anchor-secondary —
 *      direction by arrow and word ONLY, no green/red), then « · », then
 *      the source link 13/20/600 white with a 1px underline offset 3 at
 *      the line's end.
 *   4. 16 → the small line (23.25): the CONTENT's full width, height
 *      hero-sparkline-height 32, stroke signal-line in hero-sparkline, a
 *      dot-signal endpoint — one terracotta use (و-2 item 2).
 * - Hidden amounts (23.22 + 1.7 ت10, read from the app's visibility
 *   context): the value renders «••••» with the unit kept, the real value
 *   leaves the page entirely, the screen reader gets «المبلغ مخفي», the
 *   swap replays the quick cross-fade (like Money), the diff line keeps
 *   the arrow and the word only, and the small line's slot STAYS without
 *   values — the shape must not leak the trend.
 * - «—» for a missing value keeps the SAME display-hero typography,
 *   alone, without the unit (owner decision 2026-11-25; و-2 item 9).
 * - A number that does not fit drops to number-lg 28/36 in ONE step
 *   (23.8) — value strings longer than 9 digit-group characters render
 *   at number-lg (the «1,250,000.125 د» case of 23.8).
 */
import { usePress } from '../../lib/use-press';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { getMoneyTexts } from '../../i18n/ar';
import { tokens } from '../../tokens/tokens';
import { SparklineSvg } from '../../lib/sparkline';
import { AmountVisibilityToggle } from '../AmountVisibilityToggle/index';
import type { HeroSurfaceProps } from './HeroSurface.types';
import './HeroSurface.css';

/** Split «1,245.750» into the white part and the on-anchor-secondary part. */
function splitValue(value: string): { whole: string; cents: string } {
  const dot = value.indexOf('.');
  if (dot === -1) return { whole: value, cents: '' };
  return { whole: value.slice(0, dot), cents: value.slice(dot) };
}

function HeroValue({ value }: { value?: string }) {
  const { hidden } = useAmountVisibility();
  const missing = value === undefined;
  // 23.22 [مؤكد]: hidden = «••••» and the real value never renders; missing
  // = «—» alone (و-2 item 9). Both keep the value's own typography.
  const glyph = missing ? getMoneyTexts().missingGlyph : hidden ? getMoneyTexts().hiddenGlyph : null;
  const { whole, cents } = splitValue(value ?? getMoneyTexts().missingGlyph);
  // 23.8: «1,250,000.125 د» does not fit at 40 — drop to number-lg
  // 28/36 in ONE step, no gradual shrinking. 9 chars covers the quoted
  // example without catching «12,345,678» (8) which does fit. The hidden
  // bullets keep the value's size class (the slot never reflows).
  const long = (value ?? '').length > 9;
  const sizeClass = long ? 'mds-hero-value--lg mds-number-lg' : 'mds-hero-value--hero mds-type-display-hero';
  return (
    <span className={`mds-hero-value ${sizeClass}`}>
      {/* LTR isolation like Money: the full number keeps its logical
          digit order in the RTL line (A1 — «1,245.750» never reads
          «750.1,245»). */}
      <bdi dir="ltr">
        {glyph !== null ? (
          <span className="mds-hero-value-glyph">{glyph}</span>
        ) : (
          <>
            <span className="mds-hero-value-whole">{whole}</span>
            {cents ? <span className="mds-hero-value-cents">{cents}</span> : null}
          </>
        )}
      </bdi>
    </span>
  );
}

function HeroSparkline({ values }: { values: readonly number[] }) {
  const { hidden } = useAmountVisibility();
  // «يبقى بلا قيم» (23.22 + 1.7 ت10): hidden amounts keep the 32-high
  // full-width slot but draw neither the line nor the endpoint dot — no
  // digit, no trend leak. The slot itself stays so the card never jumps.
  return (
    <span className="mds-hero-sparkline" aria-hidden="true">
      <SparklineSvg
        values={values}
        hidden={hidden}
        height={tokens.size['hero-sparkline-height']}
        fullWidth
        lineClassName="mds-hero-sparkline-line"
        dotClassName="mds-hero-sparkline-dot"
      />
    </span>
  );
}

export function HeroSurface({
  label,
  value,
  trailing,
  direction,
  debt,
  draft,
  onDismiss,
  onChange,
  className,
  id,
  style,
  ref,
  ...rest
}: HeroSurfaceProps) {
  const { isPressed, pressProps } = usePress({ onPress: () => onDismiss?.() });
  // The app's own context, read ONCE at the surface level (the internal
  // default provider that shadowed it is removed — 23.22's app-owned state
  // reaches the value, the unit and the sparkline alike).
  const { hidden } = useAmountVisibility();
  const swapped = hidden && value !== undefined;
  const classes = ['mds-hero-surface', className].filter(Boolean).join(' ');

  return (
    <section ref={ref} id={id} style={style} className={classes} {...rest}>
      <header className="mds-hero-header">
        <span className="mds-hero-label">{label}</span>
        <AmountVisibilityToggle className="mds-hero-toggle" onChange={onChange} />
      </header>
      <p className="mds-hero-amount">
        {/* The key remounts the visual on every shown/hidden swap so the
            quick cross-fade of 23.22 replays (like Money); while hidden the
            visual is silent and the screen reader gets the phrase. */}
        <span className="mds-hero-visual" key={swapped ? 'hidden' : 'shown'} aria-hidden={swapped || undefined}>
          <HeroValue value={value} />
          {trailing && value !== undefined ? <span className="mds-hero-unit">{trailing}</span> : null}
        </span>
        {swapped ? <span className="mds-visually-hidden">{getMoneyTexts().hidden}</span> : null}
      </p>
      {direction || debt ? (
        /* 1.7 ت2.3: ONE line — the diff, then « · », then the source link
            at the line's end (they used to be two stacked lines with the
            source under the sparkline). */
        <p className="mds-hero-line">
          {direction ? <span className="mds-hero-diff">{direction}</span> : null}
          {direction && debt ? <span className="mds-hero-line-sep" aria-hidden="true">·</span> : null}
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
        </p>
      ) : null}
      {draft ? <HeroSparkline values={draft} /> : null}
    </section>
  );
}
