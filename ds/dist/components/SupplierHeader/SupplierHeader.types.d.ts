/**
 * SupplierHeader.types.ts — props of the supplier header
 * (BATCH2-SPECS §5.4).
 *
 * The supplier page and listing-sheet header: a plain row (no surface)
 * with EntityMark 64 (approved badge when the supplier is), then 12,
 * then the name title-section (2 lines) over the caption «<المنطقة> ·
 * <العدد> عرضاً». CUSTOMERS are not this (23.24).
 */
import type { HTMLAttributes, Ref } from 'react';
export interface SupplierHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /** The supplier's name. */
    label: string;
    /** «إربد · شارع الجامعة» — the app composes the area line. */
    caption?: string;
    /** The listing count (24.1(8) wording: «عرض واحد/عرضان/3 عروض/11 عرضاً»). */
    items?: number;
    /** The approved badge on the mark (23.24(4)). */
    approved?: boolean;
    /** Loading renders the mark + two skeleton lines. */
    state?: 'idle' | 'loading';
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
