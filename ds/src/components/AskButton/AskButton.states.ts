/**
 * AskButton.states.ts — applicable states from BRIEF 9.0 + 4.2.
 *
 * The symbol button at rest, pressed, focused, the unread dot, and
 * the long-press recording entry point.
 */
export const AskButtonStates = [
  'default',
  'pressed',
  'focused',
  'unreadDot',
  'longPressRecording',
] as const;

export type AskButtonStateId = (typeof AskButtonStates)[number];
