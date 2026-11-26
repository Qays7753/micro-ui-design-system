/**
 * ProjectSwitcher.types.ts — props of the project switcher (BRIEF 9.1,
 * 23.20 width table, 23.23 expand/selected rows).
 *
 * A button: EntityMark 32 + project name `body-strong` + role `micro`
 * in `text-secondary` + the expand caret (CaretDown Bold 16) — the
 * caret HIDES when the user has one project and one role (9.1: «من له
 * مشروع ودور واحد لا يرى السهم»). The name ellipsizes and never
 * pushes the bar's buttons (23.20: min 120, max bar − 3×48 − 16).
 * Pressing opens the projects sheet (the host owns the sheet; this is
 * the trigger). Free design-value props banned (23.18).
 */
import type { Ref } from 'react';
export interface ProjectSwitcherProps {
    /** The project name (`body-strong`, one line, ellipsized). */
    label: string;
    /** The role name (`micro`, text-secondary), e.g. «مالك». */
    caption?: string;
    /** True when only one project and one role exist: no caret (9.1). */
    locked?: boolean;
    /** Fires when the switcher is pressed (opens the projects sheet). */
    onPress: () => void;
    /** React 19 ref-as-prop on the button element. */
    ref?: Ref<HTMLButtonElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
