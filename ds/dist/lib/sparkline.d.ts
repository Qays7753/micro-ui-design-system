export interface SparkGeometry {
    points: string;
    endX: number;
    endY: number;
}
/** Map the series into the 80×height viewBox: x 4→76, y inverted inside the
 *  pad (a rising value climbs), a flat series centered, a single value at
 *  the line's end. */
export declare function sparkGeometry(values: readonly number[], height: number): SparkGeometry;
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
export declare function SparklineSvg({ values, lineClassName, dotClassName, hidden, height, fullWidth, }: SparklineSvgProps): import("react").JSX.Element;
