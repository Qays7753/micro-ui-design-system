/**
 * types.ts — shared property-value types (BRIEF 23.18 unified names).
 * Tone/SaveState/IconSize/Space/EntityMarkSize are derived from the token
 * tree and live in tokens.ts; import them from there to avoid ambiguous
 * re-exports at the package root.
 */
/** Component size scale — each component documents the subset it accepts. */
export type Size = 'sm' | 'md' | 'lg';
/** Button variants (BRIEF 23.18 — buttons only). */
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';
/** Data state inside a component (BRIEF 23.18). */
export type DataState = 'idle' | 'loading' | 'error' | 'empty';
/** `large` = driver mode: 56px touch targets (BRIEF 23.18). */
export type Density = 'regular' | 'large';
