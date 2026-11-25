/**
 * PageHeader.states.ts — applicable states from BRIEF 9.0 + 9.1.
 *
 * The main-screen header (no back, never collapses), the sub-screen
 * header with the back IconButton, and the collapsed scroll form.
 */
export const PageHeaderStates = [
  'default',
  'mainScreen',
  'subScreenBack',
  'collapsedOnScroll',
  'withTrailing',
] as const;

export type PageHeaderStateId = (typeof PageHeaderStates)[number];
