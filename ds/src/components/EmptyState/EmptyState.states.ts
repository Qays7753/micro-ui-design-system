/** EmptyState.states.ts — applicable states from BRIEF 9.0 + 23.7. */
export const EmptyStateStates = ['default', 'withAction'] as const;
export type EmptyStateStateId = (typeof EmptyStateStates)[number];
