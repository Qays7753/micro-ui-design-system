/**
 * EntityMark.types.ts — props of the entity mark (BRIEF 9.3, 23.5, 23.24(4)).
 *
 * One neutral mark for every entity: a person/project renders the single
 * isolated initial of `value`; an object (fund, movement, order) renders its
 * type icon as `children`; an optional verification badge comes from `tone`
 * (done = approved ✓, waiting = pending clock) per 23.24(4). One background
 * and one text color for everyone — never per-name colors (23.5).
 */
import type { HTMLAttributes, ReactNode } from 'react';
import type { Ref } from 'react';
import type { Size } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';
export interface EntityMarkProps extends HTMLAttributes<HTMLSpanElement> {
    /** sm = 32, md = 44, lg = 64 with radii 10/14/20 (23.18 EntityMark subset). */
    size?: Size;
    /** The name; the mark renders its first letter in its isolated form (23.5). */
    value?: string;
    /** Optional verification badge: done → approved ✓, waiting → pending clock (23.24(4)). */
    tone?: Tone;
    /** Object marks pass their type icon (FundCashIcon / FundBankIcon / FundWalletIcon) as children. */
    children?: ReactNode;
    /** React 19 ref-as-prop on the root span. */
    ref?: Ref<HTMLSpanElement>;
}
