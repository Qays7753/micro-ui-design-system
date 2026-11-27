/**
 * DayTimeline.types.ts — props of the day timeline (BATCH2-SPECS §3.3;
 * م-خ1 items/min/max).
 *
 * One day by hours when it carries DURATION appointments: an hours
 * column (layout.timeline-hours 48) with caption hour labels, duration
 * blocks (r-inset, the status' light background, min height 32) and
 * moment deliveries as pinned chips; overlapping items split the width
 * equally; a now-line with a dot rides across when the day is today.
 * A day of moment-only items is AgendaList, NOT this.
 */
import type { HTMLAttributes, Ref } from 'react';
import type { DataState } from '../../lib/types';
import type { Tone } from '../../tokens/tokens';

/** One timeline item. */
export interface DayTimelineItem {
  /** Start hour, 0..23 (whole hours; minutes via startMinutes). */
  hour: number;
  /** Minutes past the start hour (default 0). */
  startMinutes?: number;
  /** Duration in minutes; undefined = a moment item (the pinned chip). */
  minutes?: number;
  /** The item's title (a party or content name). */
  label: string;
  /** The time text the item shows («10:00 ص – 11:30 ص» or «4:00 م»). */
  time?: string;
  /** The status tone; drives the block's light background and dark text. */
  tone?: Tone;
  /** Fires when the block/chip is pressed. */
  onPress?: () => void;
}

export interface DayTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** The items, any order (the timeline positions them). */
  items: readonly DayTimelineItem[];
  /** First shown hour (default 8, quality.timeline-default-range). */
  min?: number;
  /** Last shown hour, exclusive (default 20). */
  max?: number;
  /** The current time in minutes past midnight — renders the now-line. */
  now?: number;
  /** Loading renders the hours column with skeleton blocks (§0.2). */
  state?: DataState;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
