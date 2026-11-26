/**
 * IconButton.states.ts — applicable states from BRIEF 9.0 + 23.2/23.3.
 *
 * pressed/focused/disabled are the interaction states; the density pair
 * (regular/large) is the component's own axis. The lab never renders a
 * permanently disabled instance (ds-states presses every visible button);
 * the gate exercises the disabled look by flipping the native property.
 */
export declare const IconButtonStates: readonly ["default", "pressed", "focused", "disabled", "large"];
export type IconButtonStateId = (typeof IconButtonStates)[number];
