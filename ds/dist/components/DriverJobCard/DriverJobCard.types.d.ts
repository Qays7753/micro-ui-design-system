/**
 * DriverJobCard.types.ts — props of the driver's job card
 * (BATCH2-SPECS §4.8; BRIEF 23.18 unified vocabulary).
 *
 * One task assigned to the DRIVER, in driver density (every touch
 * touch-driver tall): the «إلى <المنطقة>» title, both LocationSlots, the
 * ContactBar to the owner, the JobTrack, and the stage-appropriate
 * action area — quote form (AmountField + primary send), or evidence +
 * slide-to-confirm, or the «تعذّر» report. The OWNER's request card is
 * DeliveryRequestCard, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { DataState } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';
/** The stage-appropriate action area (§4.8 item 2). */
export type DriverJobStage = 'quoting' | 'active' | 'blocked' | 'awaiting-owner';
export interface DriverJobCardProps extends HTMLAttributes<HTMLDivElement> {
    /** The destination area («الزرقاء، حي معصوم»). */
    label: string;
    /** The origin address (LocationSlot «من»). */
    origin: string;
    /** The destination address (LocationSlot «إلى»). */
    destination: string;
    /** The owner's name for ContactBar. */
    owner: string;
    /** The owner's phone. */
    phone: string;
    /** The delivery stages (JobTrack items). */
    items: readonly {
        label: string;
        tone?: Tone;
    }[];
    /** The current stage index (JobTrack value). */
    value: number;
    /** Which action area shows (§4.8 item 2). */
    stage?: DriverJobStage;
    /** Whether the delivery requires an evidence slot (active stage). */
    evidence?: boolean;
    /** The stage's action node: quote form / slide / report button — the
     *  app passes it; ق2: ONE primary-or-slide element at most. */
    action?: ReactNode;
    /** The quote AmountField node (quoting stage). */
    quote?: ReactNode;
    /** awaiting-owner: the IssueProposalCard (driver copy) replaces the
     *  action area. */
    proposal?: ReactNode;
    /** Loading renders the skeleton card. */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
