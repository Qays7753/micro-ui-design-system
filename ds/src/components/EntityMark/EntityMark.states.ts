/**
 * EntityMark.states.ts — the cases the lab renders (BRIEF 23.5, 23.24(4),
 * section 25 data): the three sizes with the isolated initial, the fund-type
 * object marks, and the optional verification badges.
 */
export const EntityMarkStates = [
  'initial',
  'sizes',
  'fundTypes',
  'approved',
  'pending',
  'withImageRule',
] as const;

export type EntityMarkStateId = (typeof EntityMarkStates)[number];
