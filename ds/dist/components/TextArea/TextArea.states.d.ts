/**
 * TextArea.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §1.2.
 *
 * focused/error/disabled are the interaction states; grown shows the 6-line
 * ceiling with the internal scroll (ق2).
 */
export declare const TextAreaStates: readonly ["default", "focused", "error", "disabled", "grown"];
export type TextAreaStateId = (typeof TextAreaStates)[number];
