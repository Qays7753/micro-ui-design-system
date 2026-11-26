/**
 * Sheet.types.ts — props of the bottom sheet (BRIEF 23.11, 23.15).
 *
 * The bottom sheet over a scrim: canvas background, content in white
 * surfaces, elevation-float shadow, handle 36×5 full-radius 8 from the
 * top edge, header Rubik 22/30/600 with padding 20 and a closing
 * IconButton at the end, 1:1 drag that closes past 30% of the height or
 * above 0.6px/ms and otherwise springs back with `standard`,
 * interruptible motion, `overscroll-behavior: contain`. Layers per
 * 23.15: first sheet layer.sheet(40) over scrim(30); a sheet opened from
 * a sheet is sheet-2(60) over scrim-2(50). Max two stacked. Free
 * design-value props banned (23.18).
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
export interface SheetProps extends HTMLAttributes<HTMLDivElement> {
    /** The sheet title (Rubik 22/30/600). */
    label: string;
    /** The sheet body: surfaces, Metric, StatusTrack, LinkedObjects,
     *  ActivityLog, and ONE ActionBar at the bottom (23.24 Sheet row). */
    children?: ReactNode;
    /** Fires when the sheet asks to close: scrim press, close button, drag
     *  past threshold, Escape. Mount the sheet to open it; unmount to
     *  close (23.18 has no `open` prop — the caller owns mounting). */
    onDismiss: () => void;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
