/**
 * layers.tsx — the layer registry (BRIEF 23.15).
 *
 * Sheets register themselves here on mount; each one learns
 * - its level (1 = first sheet, 2 = second sheet) and the z-index variables
 *   for itself and its scrim,
 * - whether it is the top-most sheet,
 * - and whether the stacking limit was exceeded (more than 2 sheets). The
 *   brief's answer to a third sheet is to replace the second sheet's content
 *   (with an in-sheet transition and a back button), never to open a third
 *   one — `overLimit` tells the sheet component to do exactly that.
 *
 * Z-index values are referenced through the token variables, never as
 * numbers (BRIEF 16.22).
 */
import { type ReactNode } from 'react';
export interface SheetLayerInfo {
    /** 1 for the bottom sheet, 2 for the sheet above it (capped). */
    readonly level: 1 | 2;
    /** True when more than two sheets are stacked (BRIEF 23.15). */
    readonly overLimit: boolean;
    /** z-index CSS value for the sheet element. */
    readonly sheetZ: string;
    /** z-index CSS value for the accompanying scrim (null above the cap). */
    readonly scrimZ: string | null;
    /** True for the top-most registered sheet. */
    readonly isTop: boolean;
}
export interface LayersProviderProps {
    children: ReactNode;
}
/** Provide the layer registry once, near the app root. */
export declare function LayersProvider({ children }: LayersProviderProps): import("react").JSX.Element;
/** Register a sheet and read its layer position (BRIEF 23.15). */
export declare function useSheetLayer(): SheetLayerInfo;
/** Read the open sheet count (e.g. to place Toast above the top ActionBar). */
export declare function useOpenSheetCount(): number;
