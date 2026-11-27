/**
 * Gallery.states.ts — the component's axis (BATCH2-SPECS §5.2): four
 * photos, two, one (no dots), a photo still loading.
 */
export const GalleryStates = ['four', 'two', 'single', 'loading'] as const;

export type GalleryStateId = (typeof GalleryStates)[number];
