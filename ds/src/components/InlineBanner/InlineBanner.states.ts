/** InlineBanner.states.ts — the three brief-named semantics (23.23). */
export const InlineBannerStates = ['offline', 'locked', 'info', 'withAction'] as const;
export type InlineBannerStateId = (typeof InlineBannerStates)[number];
