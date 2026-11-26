/**
 * SegmentedControl.states.ts — applicable states from BRIEF 9.0 + 9.1.
 *
 * The selected axis is the component's own; pressed/focused/disabled are
 * the interaction states. threeSegments/fourSegments show the width ladder
 * (72 per segment, equal widths, 23.20); withIcon shows the leading-icon
 * segment. The lab never renders a permanently disabled control (ds-states
 * presses every visible button) — the gate exercises the disabled look by
 * flipping the native property.
 */
export declare const SegmentedControlStates: readonly ["default", "selected", "pressed", "focused", "disabled", "threeSegments", "fourSegments", "withIcon"];
export type SegmentedControlStateId = (typeof SegmentedControlStates)[number];
