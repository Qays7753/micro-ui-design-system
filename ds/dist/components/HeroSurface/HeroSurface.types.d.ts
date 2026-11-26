/**
 * HeroSurface.types.ts — props of the hero surface (BRIEF 1.5, 23.8).
 *
 * The ONE hero of the screen: brand-anchor fill, symmetric 24 radius,
 * padding 20 (24 on tablet). Inside, in order: label 14/20/500 in
 * on-anchor-secondary with the AmountVisibilityToggle at the line's end;
 * 4; the value Rubik 40/48/500 white with tabular digits and −0.01em
 * tracking — cents in the same size but on-anchor-secondary — the unit
 * «د.أ» Plex 16/24/500 on-anchor-secondary on the number's baseline, 4
 * away; 8; the diff line (arrow 14 + 13/20/600 on-anchor-secondary, no
 * green/red inside the hero); 12; the source link 13/20/600 white with a
 * 1px underline offset 3. Height by content, min 152; a number that does
 * not fit drops to number-lg 28/36 in ONE step. Banned: ornaments,
 * watermarks, gradients, background shapes, a chart line, any addition
 * (owner decision 2026-11-25). Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';
export interface HeroSurfaceProps {
    /** The label (14/20/500, on-anchor-secondary). */
    label: string;
    /** The main value; rendered as «1,245» white + «.750» secondary when it
     *  carries cents. `undefined` renders «—» in the SAME display-hero
     *  typography (owner decision 2026-11-25). */
    value?: string;
    /** The unit («د.أ») shown beside the number; omit for unitless values. */
    trailing?: string;
    /** The diff line WITHOUT an invented ratio: arrow 14 + text 13/20/600.
     *  Omitted entirely for numbers without a comparison (23.8). */
    direction?: ReactNode;
    /** The source link line («من 32 حركة») 13/20/600 white, underline 1px
     *  offset 3. */
    debt?: string;
    /** Fires when the source link is pressed. */
    onDismiss?: () => void;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
