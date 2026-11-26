/**
 * EmptyState — the ghost-preview empty surface (BRIEF 23.7).
 *
 * Two static skeleton-colored ghost ObjectRows (44 mark + two lines,
 * 72% / 48% widths per 23.10), the one body sentence, at most one
 * secondary action (و-1 item 14: none when the header carries the
 * creation button). Centered inside an r-lg 24 surface; content ≤ 280.
 */
import type { EmptyStateProps } from './EmptyState.types';
import './EmptyState.css';
export declare function EmptyState({ label, trailing, className, id, style, ref, ...rest }: EmptyStateProps): import("react").JSX.Element;
