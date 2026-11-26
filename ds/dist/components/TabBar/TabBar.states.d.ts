/**
 * TabBar.states.ts — applicable states from BRIEF 9.0 + 9.1.
 *
 * The bar with 2 tabs (two-item roles use SegmentedControl instead
 * per 9.1 — the bar still accepts them), 5 tabs, the active Fill
 * state, and the pressed tab.
 */
export declare const TabBarStates: readonly ["default", "activeFill", "pressed", "focused", "fiveTabs", "twoTabs"];
export type TabBarStateId = (typeof TabBarStates)[number];
