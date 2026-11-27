/**
 * QuoteCard.types.ts — props of the driver's quote card (BATCH2-SPECS
 * §4.2; BRIEF 23.18 unified vocabulary).
 *
 * A price offer from a driver: the ObjectCard anatomy with the driver's
 * EntityMark 44 carrying the approved badge, their note (2 lines max),
 * the price Money lg, the outcome sentence, and TWO buttons (accept
 * secondary + reject text) in lists — accept PRIMARY rides in the sheet's
 * ActionBar instead. A market listing is ListingCard, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';
export interface QuoteCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onPress' | 'onChange'> {
    /** The driver's name. */
    label: string;
    /** The driver's note: «أصل خلال 20 دقيقة» (2 lines max). */
    caption?: string;
    /** The offered price; Money lg. It STAYS VISIBLE in hidden-amounts
     *  mode (§4.2 item 6: a proposed price, not a project balance). */
    value: MoneyInput;
    /** True inside the offers LIST (two buttons: accept secondary + reject
     *  text). False renders ALONE for the ObjectSheet: no buttons — the
     *  sheet's own ActionBar carries the primary accept (§4.2 item 2). */
    inList?: boolean;
    /** The accept button node (secondary compact in lists; the sheet's
     *  ActionBar carries the primary accept when inList={false}). */
    accept?: ReactNode;
    /** The reject button node (text variant). */
    reject?: ReactNode;
    /** rejected: the card goes text-secondary, no buttons, a neutral
     *  «مرفوض» badge (§4.2 item 4). accepting: the accept button pending,
     *  the other disabled. */
    state?: DataState | 'rejected' | 'accepting';
    /** The outcome sentence node under the price (ق2: always present). */
    result?: ReactNode;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
