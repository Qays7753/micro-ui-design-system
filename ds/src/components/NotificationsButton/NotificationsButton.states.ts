/**
 * NotificationsButton.states.ts — applicable states from BRIEF 9.0 + 23.24(2).
 *
 * The bell at rest, pressed, focused, with and without the unread dot.
 */
export const NotificationsButtonStates = [
  'default',
  'pressed',
  'focused',
  'unreadDot',
] as const;

export type NotificationsButtonStateId = (typeof NotificationsButtonStates)[number];
