/**
 * QuantityStepper.states.ts — applicable states from BRIEF 9.0 +
 * BATCH2-SPECS §1.6.
 *
 * pressed is the interaction state; at-min/at-max come from the VALUE (the
 * impossible step disables); disabled comes from the app; typing is the
 * field's own focus state.
 */
export const QuantityStepperStates = [
  'default',
  'pressed',
  'at-min',
  'at-max',
  'typing',
  'disabled',
] as const;

export type QuantityStepperStateId = (typeof QuantityStepperStates)[number];
