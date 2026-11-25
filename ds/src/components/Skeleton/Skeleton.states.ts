/** Skeleton.states.ts — the real-content shapes of BRIEF 23.10. */
export const SkeletonStates = ['body', 'caption', 'hero', 'mark'] as const;
export type SkeletonStateId = (typeof SkeletonStates)[number];
