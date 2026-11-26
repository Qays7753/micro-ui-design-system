/**
 * Tile.states.ts — applicable states from BRIEF 9.0 + 23.9.
 *
 * The tile is pressable (scale .98, 23.9) with an attention dot state and
 * a sparkline variant (finance tile only). Loading/error live in the
 * numbers the app passes, not the tile chrome.
 */
export declare const TileStates: readonly ["default", "withDot", "withSparkline", "pressed", "focused", "disabled"];
export type TileStateId = (typeof TileStates)[number];
