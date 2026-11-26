/**
 * sparkline.tsx — the shared 24-high sparkline drawing (BRIEF 23.25,
 * addendum 1.6 أ-ج) used by HeroSurface (خط السطح البطل) and Tile
 * (آخر قيمة).
 *
 * The HEIGHT is the token (size.sparkline-height); the 80 viewBox width is
 * the chart's own coordinate space — a data-geometry constant like the
 * polyline points, not a design token. The dot radius comes from its token
 * by name; the pad keeps dot + stroke inside the box. The line's STROKE
 * WIDTH and both colors stay with each component's CSS — the caller owns
 * the class names, so the hero draws line+dot in hero-sparkline (ONE
 * terracotta use, و-2 item 2) while the Tile draws a brand-data line with
 * a sparkline-endpoint dot. Hidden amounts draw NEITHER (the slot stays,
 * «بلا قيم» — 23.22). RTL mirroring is CSS-side per component.
 */
import { tokens } from '../tokens/tokens';

const SPARK_W = 80;
const SPARK_H = tokens.size['sparkline-height'];
const SPARK_DOT_R = tokens.size['dot-signal'] / 2;
const SPARK_STROKE = tokens.border['signal-line'];
const SPARK_PAD = SPARK_DOT_R + SPARK_STROKE / 2;

export interface SparkGeometry {
  points: string;
  endX: number;
  endY: number;
}

/** Map the series into the 80×24 viewBox: x 4→76, y inverted 4→20 (a rising
 *  value climbs), a flat series centered, a single value at the line's end. */
export function sparkGeometry(values: readonly number[]): SparkGeometry {
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

export interface SparklineSvgProps {
  values: readonly number[];
  /** Class on the polyline — the caller's CSS colors and strokes it. */
  lineClassName: string;
  /** Class on the endpoint circle — the caller's CSS fills it. */
  dotClassName: string;
  /** Hidden amounts: draw neither line nor dot (the slot stays, 23.22). */
  hidden?: boolean;
}

export function SparklineSvg({ values, lineClassName, dotClassName, hidden = false }: SparklineSvgProps) {
  const geo = !hidden && values.length >= 1 ? sparkGeometry(values) : null;
  return (
    <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} width={SPARK_W} height={SPARK_H} focusable="false">
      {geo && values.length >= 2 ? <polyline className={lineClassName} points={geo.points} /> : null}
      {geo ? <circle className={dotClassName} cx={geo.endX} cy={geo.endY} r={SPARK_DOT_R} /> : null}
    </svg>
  );
}
