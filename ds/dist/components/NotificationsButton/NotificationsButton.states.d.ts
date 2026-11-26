/**
 * NotificationsButton.states.ts — applicable states from BRIEF 9.0 + 23.24(2).
 *
 * The bell at rest, pressed, focused, with and without the unread dot.
 */
export declare const NotificationsButtonStates: readonly ["default", "pressed", "focused", "unreadDot"];
export type NotificationsButtonStateId = (typeof NotificationsButtonStates)[number];
