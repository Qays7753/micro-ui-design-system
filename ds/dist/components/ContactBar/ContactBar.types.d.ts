/**
 * ContactBar.types.ts — props of the contact bar (BATCH2-SPECS §4.5;
 * BRIEF 23.18 unified vocabulary).
 *
 * Reaching a driver or supplier OUTSIDE Micro: two equal secondary
 * compact buttons — «اتصل» (tel:) and «واتساب» (wa.me) — with their 20
 * icons at the start, chip-gap apart. In the market, a caption line
 * «الشراء والتواصل خارج Micro.» rides field-to-help under the row. In
 * driver mode the buttons grow to touch-driver. In-app chat does not
 * exist in Micro — never here.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { Density } from '../../lib/types';
export interface ContactBarProps extends HTMLAttributes<HTMLDivElement> {
    /** The phone in LOCAL form («079 123 4567»); the links derive the
     *  international form (drop the leading 0) themselves (ق1). */
    value: string;
    /** The person's name for the accessible names («اتصل بعمر الزعبي»). */
    label: string;
    /** large = driver mode: every touch target touch-driver tall. */
    density?: Density;
    /** Adds the market caption line under the row (§4.5 item 2). */
    market?: boolean;
    /** locked: the whole bar becomes a LockedDetails placeholder (ق2:
     *  visitors never see a number) — full width, two-button shape. */
    locked?: boolean;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
