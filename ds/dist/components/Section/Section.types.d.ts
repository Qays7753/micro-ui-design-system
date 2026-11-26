/**
 * Section.types.ts — props of the Section container (BRIEF 9.2, 23.24(16),
 * 23.18).
 *
 * A titled group of surfaces: the header renders the `title-section` title,
 * then the caption count `caption-strong` in text-secondary after 8, and at
 * the line's end «الكل» `label-strong` in brand-text with the forward icon —
 * all three on ONE baseline. The «الكل» link is a 48 touch zone. It does
 * NOT render when the section is empty (owner decision 2026-11-25). Props
 * stay inside the unified 23.18 vocabulary.
 */
import type { ReactNode, Ref } from 'react';
export interface SectionProps {
    /** The section title (`title-section` 22/30/600). */
    label: string;
    /** The count shown after the title (`caption-strong`, text-secondary,
     *  8 away). Omitted when undefined. */
    caption?: number | string;
    /** Fires when «الكل» is pressed; when undefined AND the section is empty
     *  the link is not rendered at all (owner decision, REPORT). */
    onPress?: () => void;
    /** The section body — one Surface or more (9.2). */
    children?: ReactNode;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
