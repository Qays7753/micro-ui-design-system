/**
 * Surface.states.ts — applicable states from BRIEF 9.0 + 9.2.
 *
 * Containers have no selected/loading/error axis of their own; the
 * interaction states (9.0) that apply are the pressable variant (23.2:
 * Surface/Tile/ObjectCard القابلة للضغط) and the composition states. A
 * permanently disabled surface is not a thing (it is not a control).
 */
export const SurfaceStates = [
  'default',
  'withHeader',
  'withAction',
  'pressed',
  'list',
] as const;

export type SurfaceStateId = (typeof SurfaceStates)[number];
