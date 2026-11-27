/**
 * DriverApprovalStatus.types.ts — props of the driver's approval status
 * (BATCH2-SPECS §4.9).
 *
 * The driver screen's approval banner: the status badge (waiting /
 * approved / rejected) with its sentence; a rejection always carries the
 * reason inside a Well (ق1). The reviewer's own card is
 * DriverApprovalCard, NOT this.
 */
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export interface DriverApprovalStatusProps extends HTMLAttributes<HTMLDivElement> {
  /** waiting | approved | rejected — the badge tone and sentence. */
  tone: 'waiting' | 'approved' | 'rejected';
  /** The rejection reason (required with rejected, ق1). */
  caption?: string;
  /** The waiting sentence override (defaults to the dictionary line). */
  children?: ReactNode;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
