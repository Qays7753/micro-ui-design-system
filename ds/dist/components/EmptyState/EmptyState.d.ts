/**
 * EmptyState — the empty state surface (BRIEF 23.7 as amended by addendum
 * 1.7 ت9).
 *
 * The ghost rows are GONE (ت9: rows in skeleton color on white read as a
 * frozen loading, not as an emptiness; the owner's verdict ب3). What
 * stays: a symmetric r-lg surface with the ONE body sentence in
 * text-primary (not secondary — the sentence is the content here, not a
 * caption), then 16, then AT MOST one secondary action (و-1 item 14: the
 * creation button lives in PageHeader ALONE — EmptyState carries NO
 * button when the header has it). The alignment is from the START (ت9:
 * centering is a template tell; 23.1(4) no longer lists EmptyState among
 * the centering exceptions). Content ≤ 280 wide
 * (layout.empty-state-content-max). NO big icon in a circle, NO
 * cartoons, NO «لا توجد بيانات» heading (23.7 bans stay).
 */
import type { EmptyStateProps } from './EmptyState.types';
import './EmptyState.css';
export declare function EmptyState({ label, trailing, className, id, style, ref, ...rest }: EmptyStateProps): import("react").JSX.Element;
