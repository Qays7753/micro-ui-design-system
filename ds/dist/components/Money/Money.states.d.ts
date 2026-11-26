/**
 * Money.states.ts — the state list of BRIEF 9.0 that applies to Money (the
 * lab renders every id here; the reviewer and the gates read this list).
 *
 * Not applicable to a non-interactive amount: pressed/focused (no target of
 * their own), draft (belongs to SaveState), locked (market-only components).
 * Hidden amounts are a context state, not a component state (23.18).
 */
export declare const MoneyStates: readonly ["default", "signedIn", "signedOut", "transfer", "debtForYou", "debtAgainstYou", "hidden", "missing", "loading", "disabled", "longest", "sizes"];
export type MoneyStateId = (typeof MoneyStates)[number];
