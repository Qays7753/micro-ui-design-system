/**
 * PageHeader.types.ts — props of the page header (BRIEF 9.1 anatomy, 23.20
 * width table, 27.3).
 *
 * Title `title-screen` 28/36, TWO lines max (1346: 328 phone → 720 tablet),
 * on `canvas`. The sub screen passes its back IconButton through `leading`
 * (the 23.2 component with the 23.23 `back` icon) — exactly like
 * ContextBar's start. With that leading present and the host scroll
 * signal (`caption`, the same semantic as ContextBar's) the header
 * COLLAPSES to a `label-strong` title beside the back button (9.1). MAIN
 * screens pass nothing: no back, never collapse — the ProjectSwitcher
 * owns the bar's start (9.1). Optional `trailing`: hero metric,
 * PeriodSwitcher, or the creation action (9.1: «إجراء الإنشاء: زر في
 * PageHeader» — no floating button). Free design-value props banned
 * (23.18): everything stays inside the unified vocabulary.
 */
import type { ReactNode, Ref } from 'react';
export interface PageHeaderProps {
    /** The screen title (`title-screen` 28/36, two lines max). */
    label: string;
    /** Sub screens: the back IconButton (23.2) at the start; enables the
     *  scrolled collapse. Main screens omit it (9.1). */
    leading?: ReactNode;
    /** Host scroll signal (same semantic as ContextBar's): with `leading`,
     *  collapse to the label-strong compact title (9.1). */
    caption?: boolean;
    /** End slot: hero metric, PeriodSwitcher, or a creation action. */
    trailing?: ReactNode;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
