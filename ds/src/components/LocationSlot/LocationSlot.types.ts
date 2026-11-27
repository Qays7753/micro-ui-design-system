/**
 * LocationSlot.types.ts — props of the location slot (BATCH2-SPECS §4.7).
 *
 * One «من»/«إلى» address line of a delivery request: a plain row with
 * the map-pin icon, the textual address (2 lines max) and a «افتح في
 * الخرائط» link (Google Maps search URL, encoded). Live tracking is NOT
 * this — and the future map area is simply absent (no reserved blank).
 */
import type { HTMLAttributes, Ref } from 'react';

export interface LocationSlotProps extends Omit<HTMLAttributes<HTMLDivElement>, 'value'> {
  /** «من» or «إلى». */
  label: string;
  /** The textual address; empty renders «—» with no link (§4.7 item 4). */
  value?: string;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
