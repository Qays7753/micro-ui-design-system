/**
 * TextField.states.ts — applicable states from BRIEF 9.0 + 9.3.
 *
 * focused/disabled are the interaction states; error is the validation
 * state (red border + solution caption). withCaption/withPlaceholder are
 * composition states for the lab.
 */
export declare const TextFieldStates: readonly ["default", "focused", "disabled", "error", "withCaption", "withPlaceholder"];
export type TextFieldStateId = (typeof TextFieldStates)[number];
