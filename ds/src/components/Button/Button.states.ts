/**
 * Button.states.ts — applicable states from BRIEF 9.0 + 23.2/23.3.
 *
 * Pressed/focused/disabled are the interaction states; loading is the
 * action-running state (23.3). The four variants are the component's own
 * axis. The lab never renders a permanently disabled button (ds-states
 * presses every visible button); the gate exercises the disabled look by
 * flipping the native property.
 */
export const ButtonStates = [
  'default',
  'primary',
  'secondary',
  'text',
  'danger',
  'pressed',
  'focused',
  'disabled',
  'loading',
  'sm',
  'withIcon',
] as const;

export type ButtonStateId = (typeof ButtonStates)[number];
