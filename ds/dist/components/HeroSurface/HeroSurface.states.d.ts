/**
 * HeroSurface.states.ts — applicable states from BRIEF 9.0 + 23.8 + 23.25.
 *
 * The hero is passive chrome (the toggle inside it is interactive on its
 * own); the axes that matter visually are value shape (plain, with cents,
 * missing (—), the long-number drop to number-lg in one step), no diff,
 * and the optional small line (23.25, addendum 1.6 أ-ج).
 */
export declare const HeroSurfaceStates: readonly ["default", "withCents", "missing", "longNumber", "noDiff", "withSparkline"];
export type HeroSurfaceStateId = (typeof HeroSurfaceStates)[number];
