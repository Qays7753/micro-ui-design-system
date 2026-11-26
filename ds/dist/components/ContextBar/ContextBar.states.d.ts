/**
 * ContextBar.states.ts — applicable states from BRIEF 9.0 + 23.16.
 *
 * The bar with the switcher (main screens), with a back button (sub
 * screens), the scrolled hairline on/off, and the bell+Ask pair.
 */
export declare const ContextBarStates: readonly ["default", "mainScreenSwitcher", "subScreenBack", "scrolledHairline", "notScrolled"];
export type ContextBarStateId = (typeof ContextBarStates)[number];
