/**
 * ReportSheet.types.ts — props of the report sheet (BATCH2-SPECS §5.5).
 *
 * Reporting a LISTING: Sheet 92% titled «أبلغ عن العرض», one reason per
 * plain row (radio semantics, the chosen row ends with the selected icon
 * 20), an optional TextArea «تفاصيل», and the ActionBar's primary
 * «أرسل البلاغ» + SaveState. Sending with NO reason shows «اختر سبب
 * البلاغ» under the surface. MODERATION is not this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export interface ReportSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDismiss' | 'onChange'> {
  /** The report reasons from the app (question 9). */
  items: readonly string[];
  /** The chosen reason's index. */
  value?: number;
  /** The details text (optional). */
  caption?: string;
  /** Fires when the sheet closes (drag or scrim). */
  onDismiss: () => void;
  /** Fires when the report is sent (reason index + details). */
  onChange?: (reason: number, details: string) => void;
  /** The SaveState slot from the app (rides the bar). */
  save?: ReactNode;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
