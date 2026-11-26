/**
 * HeroSurface — the screen's single hero (BRIEF 1.5, 23.8 — with the ONE
 * addition addendum 1.6 allows: the optional small line, 23.25).
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
 * - Hidden amounts (23.22 [مؤكد], read from the app's visibility context —
 *   the internal default provider that used to shadow it is gone): the
 *   value renders «••••» with the unit kept, the real value leaves the page
 *   entirely, the screen reader gets «المبلغ مخفي», and the swap replays
 *   the quick cross-fade (like Money).
 * - «—» for a missing value keeps the SAME display-hero typography, alone,
 *   without the unit (owner decision 2026-11-25; و-2 item 9).
 * - The optional sparkline (23.25, addendum 1.6 أ-ج): 12 under the diff
 *   line, height sparkline-height 24, stroke signal-line in hero-sparkline,
 *   a dot-signal endpoint — the line and its dot are ONE terracotta use
 *   (و-2 item 2). «يبقى بلا قيم»: with hidden amounts the slot stays but
 *   draws no values — the trend must not leak.
 * - A number that does not fit drops to number-lg 28/36 in ONE step
 *   (23.8) — the app passes a long value; the drop is the app's choice made
 *   explicit here through the same token ladder, so the component does
 *   not guess: value strings longer than 9 digit-group characters render
 *   at number-lg (the «1,250,000.125 د.أ» case of 23.8).
 */
import { usePress } from '../../lib/use-press';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { moneyTexts } from '../../i18n/ar';
import { tokens } from '../../tokens/tokens';
import { AmountVisibilityToggle } from '../AmountVisibilityToggle/index';
import type { HeroSurfaceProps } from './HeroSurface.types';
import './HeroSurface.css';

/** Split «1,245.750» into the white part and the on-anchor-secondary part. */
function splitValue(value: string): { whole: string; cents: string } {
  const dot = value.indexOf('.');
  if (dot === -1) return { whole: value, cents: '' };
  return { whole: value.slice(0, dot), cents: value.slice(dot) };
}

/* The sparkline's chart geometry. The HEIGHT is the token
 * (size.sparkline-height = sparkline-height 24); the 80 viewBox width is the
 * chart's own coordinate space — a data-geometry constant like the polyline
 * points, not a design token. The dot radius and stroke come from their
 * tokens by name; the pad keeps dot + stroke inside the 24-high box. */
const SPARK_W = 80;
const SPARK_H = tokens.size['sparkline-height'];
const SPARK_DOT_R = tokens.size['dot-signal'] / 2;
const SPARK_STROKE = tokens.border['signal-line'];
const SPARK_PAD = SPARK_DOT_R + SPARK_STROKE / 2;

/** Map the series into the 80×24 viewBox: x 4→76, y inverted 4→20 (a rising
 *  value climbs), a flat series centered, a single value at the line's end. */
function sparkGeometry(values: readonly number[]): { points: string; endX: number; endY: number } {
  const n = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const x = (i: number) => (n === 1 ? SPARK_W - SPARK_PAD : SPARK_PAD + (i / (n - 1)) * (SPARK_W - 2 * SPARK_PAD));
  const y = (v: number) =>
    span === 0 ? SPARK_H / 2 : SPARK_PAD + (1 - (v - min) / span) * (SPARK_H - 2 * SPARK_PAD);
  const points = values.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  return { points, endX: x(n - 1), endY: y(values[n - 1]) };
}

function HeroValue({ value }: { value?: string }) {
  const { hidden } = useAmountVisibility();
  const missing = value === undefined;
  // 23.22 [مؤكد]: hidden = «••••» and the real value never renders; missing
  // = «—» alone (و-2 item 9). Both keep the value's own typography.
  const glyph = missing ? moneyTexts.missingGlyph : hidden ? moneyTexts.hiddenGlyph : null;
  const { whole, cents } = splitValue(value ?? moneyTexts.missingGlyph);
  // 23.8: «1,250,000.125 د.أ» does not fit at 40 — drop to number-lg
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
  // «يبقى بلا قيم» (23.22): hidden amounts keep the 24-high slot but draw
  // neither the line nor the endpoint dot — no digit, no trend leak.
  const geo = !hidden && values.length >= 1 ? sparkGeometry(values) : null;
  return (
    <span className="mds-hero-sparkline" aria-hidden="true">
      <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} width={SPARK_W} height={SPARK_H} focusable="false">
        {geo && values.length >= 2 ? <polyline className="mds-hero-sparkline-line" points={geo.points} /> : null}
        {geo ? <circle className="mds-hero-sparkline-dot" cx={geo.endX} cy={geo.endY} r={SPARK_DOT_R} /> : null}
      </svg>
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
        <AmountVisibilityToggle className="mds-hero-toggle" />
      </header>
      <p className="mds-hero-amount">
        {/* The key remounts the visual on every shown/hidden swap so the
            quick cross-fade of 23.22 replays (like Money); while hidden the
            visual is silent and the screen reader gets the phrase. */}
        <span className="mds-hero-visual" key={swapped ? 'hidden' : 'shown'} aria-hidden={swapped || undefined}>
          <HeroValue value={value} />
          {trailing && value !== undefined ? <span className="mds-hero-unit">{trailing}</span> : null}
        </span>
        {swapped ? <span className="mds-visually-hidden">{moneyTexts.hidden}</span> : null}
      </p>
      {direction ? <p className="mds-hero-diff">{direction}</p> : null}
      {draft ? <HeroSparkline values={draft} /> : null}
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
  );
}
