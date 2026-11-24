/**
 * HeroSurface.states.ts — applicable states from BRIEF 9.0 + 23.8.
 *
 * The hero is passive chrome (the toggle inside it is interactive on its
 * own); the axis that matters visually is value shape: plain, with cents,
 * missing (—), and the long-number drop to number-lg in one step.
 */
export const HeroSurfaceStates = [
  'default',
  'withCents',
  'missing',
  'longNumber',
  'noDiff',
] as const;

export type HeroSurfaceStateId = (typeof HeroSurfaceStates)[number];
