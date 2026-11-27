/**
 * Gallery.types.ts — props of the listing photo gallery
 * (BATCH2-SPECS §5.2).
 *
 * The listing detail's photos: a horizontal scroll-snap strip — each
 * photo the container's width at 4:3, r-md — and the 23.16 dots 8 under.
 * ONE photo: no dots, no scroll. Uploading is PhotoUploader, NOT this.
 */
import type { HTMLAttributes, Ref } from 'react';
export interface GalleryItem {
    /** The image URL. */
    src: string;
    /** The alt word (the listing's title) for the screen reader. */
    alt?: string;
}
export interface GalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'items'> {
    /** The photos in order (one item: no dots, no snap scroll). */
    items: readonly GalleryItem[];
    /** The current photo's index. */
    value?: number;
    /** Fires when the visible photo changes (scroll or the hidden
     *  previous/next buttons). */
    onChange?: (value: number) => void;
    /** React 19 ref-as-prop on the root element. */
    ref?: Ref<HTMLDivElement>;
}
