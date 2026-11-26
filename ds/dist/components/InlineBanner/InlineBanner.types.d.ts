/**
 * InlineBanner.types.ts — props of the inline banner (BRIEF 517, 658,
 * 23.23 icons column, 23.17, 1649).
 *
 * The three brief-named banner semantics, each with its 23.23 icon and
 * its 5.2 tone pair (icon + text, NO fully-colored surface — 1649):
 *   offline → WifiSlash Regular 20, problem pair (network loss)
 *   locked  → LockSimple Regular 20, neutral pair (permissions)
 *   info    → Info Regular 20, info pair (information)
 * Fixed at the top of the content (517); layer.content (1242). The
 * screen reader gets the banner text politely (23.17: «الاتصال
 * انقطع»). An optional trailing action slot carries e.g. «راجع
 * واحفظ» (658). Free design-value props banned (23.18).
 */
import type { ReactNode, Ref } from 'react';
export type InlineBannerTone = 'offline' | 'locked' | 'info';
export interface InlineBannerProps {
    /** The banner semantics — selects icon + tone pair (23.23). */
    tone: InlineBannerTone;
    /** The message text. */
    label: string;
    /** Optional action slot (658: «راجع واحفظ»). */
    trailing?: ReactNode;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
    /** Standard pass-throughs. */
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}
