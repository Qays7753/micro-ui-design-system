/**
 * DeliveryRequestCard.types.ts — props of the delivery request card
 * (BATCH2-SPECS §4.1; BRIEF 23.18 unified vocabulary).
 *
 * One delivery request at the OWNER (delivery lists and «يحتاجك»): the
 * ObjectCard anatomy with the (mirrored) nav-delivery mark — or the
 * driver's mark once assigned — the «إلى <المنطقة>» title, the «من
 * <المنطقة> · <الوصف>» caption, a StatusBadge, the clock time line, and
 * the ONE secondary «راجع العروض» button ONLY when the request awaits
 * the owner's decision. The DRIVER's own task is DriverJobCard.
 */
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { DataState } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';
export interface DeliveryRequestCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onPress' | 'onLongPress' | 'value'> {
    /** The destination area («مرج الحمام») — the title reads «إلى <label>». */
    label: string;
    /** The origin line: «طبربور · كرتونتا حلويات» (the app composes it). */
    caption?: string;
    /** The time text: «اليوم 4:00 م» (clock icon rides inside). */
    time?: string;
    /** The status badge tone + optional custom badge node. */
    tone?: Tone;
    badge?: ReactNode;
    /** The driver's name — when set, their letter mark replaces the icon. */
    driver?: string;
    /** The ONE secondary next-step button; render it ONLY when the request
     *  awaits the owner's decision (ق1: no button otherwise). */
    action?: ReactNode;
    /** Loading renders the skeleton card (§0.2 item 1). */
    state?: DataState;
    /** Fires when the card is pressed (opens the request's ObjectSheet). */
    onPress?: () => void;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLButtonElement>;
}
