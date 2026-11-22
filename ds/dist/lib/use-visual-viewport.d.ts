export interface VisualViewportState {
    /** Layout height of the visual viewport in px. */
    readonly height: number;
    /** Top offset of the visual viewport within the layout viewport in px. */
    readonly offsetTop: number;
    /** Pinch-zoom scale. */
    readonly scale: number;
    /**
     * Estimated on-screen keyboard height in px (heuristic, see file docs).
     * 0 when the keyboard is closed or the API is unavailable.
     */
    readonly keyboardHeight: number;
}
/** Subscribe to the visual viewport; safe when the API is missing. */
export declare function useVisualViewport(): VisualViewportState;
