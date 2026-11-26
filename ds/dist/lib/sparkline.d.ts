export interface SparkGeometry {
    points: string;
    endX: number;
    endY: number;
}
/** Map the series into the 80×24 viewBox: x 4→76, y inverted 4→20 (a rising
 *  value climbs), a flat series centered, a single value at the line's end. */
export declare function sparkGeometry(values: readonly number[]): SparkGeometry;
export interface SparklineSvgProps {
    values: readonly number[];
    /** Class on the polyline — the caller's CSS colors and strokes it. */
    lineClassName: string;
    /** Class on the endpoint circle — the caller's CSS fills it. */
    dotClassName: string;
    /** Hidden amounts: draw neither line nor dot (the slot stays, 23.22). */
    hidden?: boolean;
}
export declare function SparklineSvg({ values, lineClassName, dotClassName, hidden }: SparklineSvgProps): import("react").JSX.Element;
