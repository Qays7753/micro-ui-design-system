/**
 * Section.states.ts — applicable states from BRIEF 9.0 + 9.2.
 *
 * The Section is a layout container; its header link carries the press
 * state (23.2) but the section itself has no selection/data axis. The lab
 * axis is the composition: empty (no «الكل», owner decision) vs filled.
 */
export declare const SectionStates: readonly ["default", "withCount", "withSeeAll", "empty"];
export type SectionStateId = (typeof SectionStates)[number];
