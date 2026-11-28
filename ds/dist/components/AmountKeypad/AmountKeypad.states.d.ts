/**
 * AmountKeypad.states.ts — applicable states from BRIEF 9.0 + ADDENDUM §1.4.
 *
 * pressed is the interaction state; disabled comes from the app;
 * decimal-disabled and fraction-full come from the field's VALUE (a second
 * dot, or a fourth fraction digit — impossible keys are visibly off).
 */
export declare const AmountKeypadStates: readonly ["default", "pressed", "disabled", "decimal-disabled", "fraction-full"];
export type AmountKeypadStateId = (typeof AmountKeypadStates)[number];
