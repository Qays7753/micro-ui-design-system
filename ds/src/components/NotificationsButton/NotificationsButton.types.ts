/**
 * NotificationsButton.types.ts — props of the notifications bell button
 * (BRIEF 9.1, 23.23 notifications row, 23.24(2)).
 *
 * 48 touch zone with the Bell Regular 24 icon; an 8px `brand-anchor`
 * dot ringed by 2px of the bar's own background sits in the corner
 * farthest from the icon's center when unread items exist (hidden at
 * 0). The count rides the accessible name («الإشعارات، {counted}»,
 * 23.17). Free design-value props banned (23.18).
 */
import type { Ref } from 'react';

export interface NotificationsButtonProps {
  /** Unread count; 0/undefined hides the dot. */
  value?: number;
  /** The screen-reader name, e.g. «الإشعارات، 3 غير مقروءة». */
  label?: string;
  /** Fires when the bell is pressed (opens the notifications sheet). */
  onPress: () => void;
  /** React 19 ref-as-prop on the button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}
