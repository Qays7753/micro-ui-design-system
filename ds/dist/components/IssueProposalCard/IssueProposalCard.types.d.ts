/**
 * IssueProposalCard.types.ts — props of the issue proposal card
 * (BATCH2-SPECS §4.4; BRIEF 23.18 unified vocabulary; م-خ1 items).
 *
 * When the driver cannot complete the delivery and proposes a course:
 * a Surface with the job-failed header, the reason and proposed action
 * in a KeyValueList inside a Well. The OWNER decides («وافق» secondary +
 * «ارفض» text, then the outcome sentence); the DRIVER waits (a waiting
 * badge instead of buttons). After the decision the buttons become one
 * «وافقت · 10:42 ص» line. Technical errors are InlineBanner, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { DataState } from '../../lib/types';
export interface IssueProposalCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** The card heading: «تعذّر التسليم» (title-card). */
    label?: string;
    /** The key-value rows: «السبب», «الإجراء المقترح» — the app passes
     *  them (م-خ1: items), rendered inside a Well. */
    items: readonly {
        key: string;
        value: string;
    }[];
    /** The audience: owner shows the decision buttons, driver the waiting
     *  badge (ق1: no buttons in the driver copy). */
    audience?: 'owner' | 'driver';
    /** The decision buttons (owner): «وافق» secondary + «ارفض» text. */
    accept?: ReactNode;
    reject?: ReactNode;
    /** The outcome sentence under the buttons (app-passed per action). */
    result?: ReactNode;
    /** decided: the app passes the decision line «وافقت · 10:42 ص» that
     *  replaces both buttons. */
    decided?: ReactNode;
    /** Loading renders the skeleton card. */
    state?: DataState;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
