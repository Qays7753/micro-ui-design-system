/**
 * EvidenceSlot.types.ts — props of the delivery evidence slot
 * (BATCH2-SPECS §4.6, open per 17-item-7; م-خ1 kind/value).
 *
 * The delivery proof, by kind: photo (a 4:3 tile — camera prompt before
 * capture, the photo + a redo control after), code (a numeric TextField
 * «الرمز من المستلم» with equal-width digits), or owner (the
 * «المالك يؤكد التسليم.» sentence with the owner's confirm button). At
 * the OWNER the content is read-only (the photo, or «أُدخل الرمز ✓»).
 * Offer photos are Gallery, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { DataState, Density } from '../../lib/types';

export type EvidenceKind = 'photo' | 'code' | 'owner';

export interface EvidenceSlotProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The proof mode — EXACTLY ONE shows (ق1). */
  mode: EvidenceKind;
  /** photo: the captured image URL; code: the entered digits; owner:
   *  unused (the owner's confirm is a button). */
  value?: string;
  /** Fires on capture (photo), digit entry (code) or confirm (owner). */
  onChange?: (value: string) => void;
  /** code error text («الرمز غير صحيح…»); shown under the field. */
  error?: string;
  /** True at the owner: read-only presentation (§4.6 item 2). */
  readOnly?: boolean;
  /** large = driver mode. */
  density?: Density;
  /** The owner's confirm button node (owner kind, driver absent). */
  action?: ReactNode;
  /** Loading renders the skeleton slot. */
  state?: DataState;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
