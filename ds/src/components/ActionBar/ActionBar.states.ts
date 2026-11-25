/**
 * ActionBar.states.ts — applicable states from BRIEF 9.0 + 23.16 + 27.4.
 *
 * The bar itself has no data state; the axes are the top hairline
 * (content-more vs scrolled-to-end, 23.16), the primary button's
 * interaction states, and the keyboard pin (27.4, approximated here,
 * real keyboards are the owner's device check).
 */
export const ActionBarStates = [
  'default',
  'pressed',
  'focused',
  'disabled',
  'loading',
  'contentMore',
  'scrolledToEnd',
  'keyboardOpen',
] as const;

export type ActionBarStateId = (typeof ActionBarStates)[number];
