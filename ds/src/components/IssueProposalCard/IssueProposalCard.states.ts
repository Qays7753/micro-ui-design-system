/**
 * IssueProposalCard.states.ts — the component's axis (BATCH2-SPECS §4.4):
 * owner copy, driver copy, decided, loading.
 */
export const IssueProposalCardStates = ['owner', 'driver', 'decided', 'loading'] as const;

export type IssueProposalCardStateId = (typeof IssueProposalCardStates)[number];
