/**
 * ProjectSwitcher.states.ts — applicable states from BRIEF 9.0 + 9.1.
 *
 * The trigger at rest, pressed, focused, with the caret (multi) and
 * without it (single project + single role).
 */
export declare const ProjectSwitcherStates: readonly ["default", "pressed", "focused", "withCaret", "singleRoleNoCaret"];
export type ProjectSwitcherStateId = (typeof ProjectSwitcherStates)[number];
