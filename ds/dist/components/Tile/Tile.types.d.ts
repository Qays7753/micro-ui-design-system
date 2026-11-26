/**
 * Tile.types.ts — props of the Bento Tile (BRIEF 23.9, 23.18).
 *
 * A 152-high Bento cell: header (icon 20 text-secondary no container + 8 +
 * label 14/20/500 text-secondary, attention dot 8 status-waiting-fg at the
 * header line's end with a screen-reader text), content pinned to the
 * BOTTOM (number-lg Rubik 28/36/500 + one 13/20 text-secondary line; two
 * facts max). One tile (finance) may carry a 24-high sparkline above the
 * number. Corner radii per grid position: the OUTER corner of the 2×2
 * block is 28 (radius.signature-outer), the other three 8 — exactly like
 * the wordmark units. Press: scale(.98). Tapping opens the filtered
 * domain. Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';
export interface TileProps {
    /** The header icon (20, text-secondary, no container) — BRIEF 23.9. */
    leading?: ReactNode;
    /** The header label (14/20/500, text-secondary). */
    label: string;
    /** Attention dot at the header line's end; presence flag (BRIEF 23.9). */
    state?: boolean;
    /** Screen-reader text for the attention dot (23.17). */
    caption?: string;
    /** The main number (number-lg Rubik 28/36/500) or «—» when missing
     *  (owner decision 2026-11-25: same number typography, not caption). */
    value?: string;
    /** The single 13/20 text-secondary line under the number. */
    trailing?: string;
    /** The 24-high sparkline above the number — one tile max (finance). */
    draft?: ReactNode;
    /** Grid position decides the outer 28 corner (BRIEF 23.9). */
    tone?: 'start' | 'end';
    /** Tapping opens the filtered domain (BRIEF 23.9). */
    onPress?: () => void;
    /** Disables the tile (23.24(15)). */
    disabled?: boolean;
    /** React 19 ref-as-prop on the tile element. */
    ref?: Ref<HTMLButtonElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
