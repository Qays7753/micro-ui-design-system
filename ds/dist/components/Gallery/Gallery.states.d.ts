/**
 * Gallery.states.ts — the component's axis (BATCH2-SPECS §5.2): four
 * photos, two, one (no dots), a photo still loading.
 */
export declare const GalleryStates: readonly ["four", "two", "single", "loading"];
export type GalleryStateId = (typeof GalleryStates)[number];
