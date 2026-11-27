/**
 * ListingEditor.types.ts — props of the listing editor sheet
 * (BATCH2-SPECS §5.6).
 *
 * The SUPPLIER creating or editing a listing: Sheet 92%, one column —
 * photos, name, package unit, single-price/tiers switch, the price field
 * or the tier builder, the availability toggle, the optional
 * description, and the ActionBar's ONE primary «أرسل للمراجعة» (editing:
 * «أرسل التعديل») + SaveState. Field errors on send, focus on the first
 * (23.17). VIEWING is the listing sheet, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { PriceTier } from '../PriceTierTable/PriceTierTable.types';

export interface ListingEditorDraft {
  /** The listing name. */
  label?: string;
  /** The package word («كيس 50 كغ»). */
  unit?: string;
  /** single | tiers. */
  mode?: 'single' | 'tiers';
  /** The single price (mode=single). */
  price?: MoneyInput;
  /** The tiers (mode=tiers) — PriceTierBuilder owns their editing. */
  items?: readonly PriceTier[];
  /** Available toggle. */
  available?: boolean;
  /** The optional description. */
  caption?: string;
}

export interface ListingEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDismiss' | 'onChange'> {
  /** True when EDITING (the title and button switch, §5.6 item 8). */
  editing?: boolean;
  /** The draft state (controlled by the app). */
  draft?: ListingEditorDraft;
  /** Fires when the sheet closes. */
  onDismiss: () => void;
  /** Fires on send (the validated draft). */
  onChange?: (draft: ListingEditorDraft) => void;
  /** The photo uploader node — the app's PhotoUploader (phase 4); its
   *  place is kept and its error slot fires on send with no photo (ق2). */
  photos?: ReactNode;
  /** The tier builder node — the app's PriceTierBuilder (phase 4). */
  tiers?: ReactNode;
  /** The SaveState slot above the bar. */
  save?: ReactNode;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
