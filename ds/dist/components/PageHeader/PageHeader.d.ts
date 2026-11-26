/**
 * PageHeader — the page title block (BRIEF 9.1, 23.16, 23.20, 27.3).
 *
 * - `title-screen` 28/36 on `canvas`, TWO lines max; content follows the
 *   screen margins (16 phone / 24 tablet, 23.20).
 * - Sub screens: the app's back IconButton (23.2) rides `leading`; with
 *   the host's `caption` scroll signal the title collapses to the
 *   compact `label-strong` form beside that button (9.1) — no hairline
 *   of its own (the bar carries the scrolled hairline, 23.16).
 * - Main screens never collapse (9.1: the ProjectSwitcher owns the bar).
 */
import type { PageHeaderProps } from './PageHeader.types';
import './PageHeader.css';
export declare function PageHeader({ label, leading, caption, trailing, className, id, style, ref, ...rest }: PageHeaderProps): import("react").JSX.Element;
