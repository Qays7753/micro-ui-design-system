/**
 * sparkline.tsx — the shared sparkline drawing (BRIEF 23.25, addendum 1.6
 * أ-ج) used by HeroSurface (خط السطح البطل) and Tile (آخر قيمة).
 *
 * The HEIGHT is the caller's token (size.sparkline-height 24 for the tile,
 * size.hero-sparkline-height 32 for the hero — 1.7 ت2); the 80 viewBox
 * width is the chart's own coordinate space — a data-geometry constant
 * like the polyline points, not a design token. The dot radius comes from
 * its token by name; the pad keeps dot + stroke inside the box. The line's
 * STROKE WIDTH and both colors stay with each component's CSS — the
 * caller owns the class names, so the hero draws line+dot in
 * hero-sparkline (ONE terracotta use, و-2 item 2) while the Tile draws a
 * brand-data line with a sparkline-endpoint dot. Hidden amounts draw
 * NEITHER (the slot stays, «بلا قيم» — 23.22, now ت10 for the hero).
 * RTL mirroring is CSS-side per component.
 *
 * fullWidth (1.7 ت2.4 — the hero's line rides the CONTENT's full width):
 * the svg stretches with preserveAspectRatio="none" so the polyline spans
 * the container. A stretched viewBox would distort a circle dot into an
 * ellipse and thin/thicken the stroke along the way, so the stretched
 * mode draws the endpoint as a ZERO-LENGTH round-capped path and both the
 * line and the dot carry vector-effect="non-scaling-stroke" — the stroke
 * stays 2px and the dot stays a perfect circle at any stretch.
 */
import { tokens } from '../tokens/tokens';

const SPARK_W = 80;
const SPARK_DOT_R = tokens.size['dot-signal'] / 2;
const SPARK_STROKE = tokens.border['signal-line'];
const SPARK_PAD = SPARK_DOT_R + SPARK_STROKE / 2;

export interface SparkGeometry {
  points: string;
  endX: number;
  endY: number;
}

/** Map the series into the 80×height viewBox: x 4→76, y inverted inside the
 *  pad (a rising value climbs), a flat series centered, a single value at
 *  the line's end. */
export function sparkGeometry(values: readonly number[], height: number): SparkGeometry {
  const n = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const x = (i: number) => (n === 1 ? SPARK_W - SPARK_PAD : SPARK_PAD + (i / (n - 1)) * (SPARK_W - 2 * SPARK_PAD));
  const y = (v: number) =>
    span === 0 ? height / 2 : SPARK_PAD + (1 - (v - min) / span) * (height - 2 * SPARK_PAD);
  const points = values.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  return { points, endX: x(n - 1), endY: y(values[n - 1]) };
}

export interface SparklineSvgProps {
  values: readonly number[];
  /** Class on the polyline — the caller's CSS colors and strokes it. */
  lineClassName: string;
  /** Class on the endpoint dot — fill for the fixed mode, stroke for the
   *  stretched mode (the round cap IS the dot there). */
  dotClassName: string;
  /** Hidden amounts: draw neither line nor dot (the slot stays, 23.22). */
  hidden?: boolean;
  /** Rendered height in px (the viewBox height follows it): the tile's 24
   *  or the hero's 32 (size.hero-sparkline-height, 1.7 ت2). */
  height?: number;
  /** Stretch to the container's full width (the hero's full-content-width
   *  line, 1.7 ت2.4). */
  fullWidth?: boolean;
}

export function SparklineSvg({
  values,
  lineClassName,
  dotClassName,
  hidden = false,
  height,
  fullWidth = false,
}: SparklineSvgProps) {
  const h = height ?? tokens.size['sparkline-height'];
  const geo = !hidden && values.length >= 1 ? sparkGeometry(values, h) : null;
  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${h}`}
      width={fullWidth ? '100%' : SPARK_W}
      height={h}
      preserveAspectRatio={fullWidth ? 'none' : undefined}
      focusable="false"
    >
      {geo && values.length >= 2 ? (
        <polyline
          className={lineClassName}
          points={geo.points}
          vectorEffect={fullWidth ? 'non-scaling-stroke' : undefined}
        />
      ) : null}
      {geo ? fullWidth ? (
        /* The stretched dot: a zero-length path with a round cap and a
           non-scaling stroke keeps its token diameter and its circle shape
           under any preserveAspectRatio="none" stretch. */
        <path
          className={dotClassName}
          d={`M ${geo.endX.toFixed(2)} ${geo.endY.toFixed(2)} L ${geo.endX.toFixed(2)} ${geo.endY.toFixed(2)}`}
          strokeWidth={tokens.size['dot-signal']}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      ) : (
        <circle className={dotClassName} cx={geo.endX} cy={geo.endY} r={SPARK_DOT_R} />
      ) : null}
    </svg>
  );
}
