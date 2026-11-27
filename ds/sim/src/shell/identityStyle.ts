/**
 * The identity overrides → CSS custom properties (§5.6): applied LIVE
 * through variables, on every screen, in memory only. The values multiply
 * the TOKEN TREE by name (no raw design values), and the font scale rides
 * the root font-size (every type size is rem).
 */
import type { CSSProperties } from 'react';
import { tokens } from '@micro/ds';
import type { IdentityOverrides } from '../state/types';

/** Every r-* token EXCEPT r-full (§5.6: «عدا r-full»). */
const RADIUS_KEYS = [
  '2xs',
  'xs',
  'sm',
  'inset',
  'md',
  'lg',
  'signature-outer',
  'xl',
  'entity-32',
  'entity-44',
  'entity-64',
  'nested-min',
] as const;

/** The layout tokens that scale with density (heights live in size.* and stay). */
const LAYOUT_KEYS = Object.keys(tokens.layout) as Array<keyof typeof tokens.layout>;

export function identityStyle(identity: IdentityOverrides): CSSProperties {
  const style: Record<string, string> = {};

  if (identity.brandAnchor) style['--mds-color-brand-anchor'] = identity.brandAnchor;
  if (identity.brandText) style['--mds-color-brand-text'] = identity.brandText;
  if (identity.brandData) style['--mds-color-brand-data'] = identity.brandData;
  if (identity.brandSignal) style['--mds-color-brand-signal'] = identity.brandSignal;
  if (identity.canvas) style['--mds-color-canvas'] = identity.canvas;

  if (identity.radiusScale !== 1) {
    for (const key of RADIUS_KEYS) {
      style[`--mds-radius-${key}`] = `${(tokens.radius[key] as number) * identity.radiusScale}px`;
    }
  }

  if (identity.densityScale !== 1) {
    for (const value of tokens.space) {
      style[`--mds-space-${value}`] = `${(value as number) * identity.densityScale}px`;
    }
    for (const key of LAYOUT_KEYS) {
      style[`--mds-layout-${key}`] = `${(tokens.layout[key] as number) * identity.densityScale}px`;
    }
  }

  return style as CSSProperties;
}

/** The root font scale (100/150/200) rides html, because every type is rem. */
export function applyRootFontScale(scale: number): void {
  document.documentElement.style.fontSize = `${scale}%`;
}
