import { render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';
import * as Icons from './index';
import { RTL_FLIP_ICONS } from './index';

/** Component name for a semantic icon name (nav-delivery -> NavDeliveryIcon). */
function componentName(semantic: string): string {
  const pascal = semantic
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
  return `${pascal}Icon`;
}

const byName = Icons as unknown as Record<string, ComponentType | unknown>;

const componentExports = Object.entries(Icons).filter(
  ([, value]) => typeof value === 'function',
) as [string, ComponentType][];

describe('generated icons (BRIEF 23.23)', () => {
  it('exports every semantic icon component', () => {
    const names = new Set(componentExports.map(([name]) => name));
    for (const semantic of RTL_FLIP_ICONS) {
      expect(names.has(componentName(semantic)), `${semantic} -> ${componentName(semantic)}`).toBe(true);
    }
    for (const semantic of [
      'nav-today', 'nav-finance', 'nav-orders', 'nav-delivery', 'nav-market',
      'notifications', 'amounts-shown', 'amounts-hidden', 'back', 'forward',
      'expand', 'close', 'selected', 'search', 'clear', 'field-error',
      'delta-up', 'delta-down', 'tone-done', 'tone-waiting', 'tone-problem',
      'tone-info', 'draft', 'retry', 'offline', 'locked', 'info', 'more',
      'entity-approved', 'entity-pending', 'danger',
      'fund-cash', 'fund-bank', 'fund-wallet', 'transfer', 'debt', 'quote',
      'job-failed', 'order', 'appointment', 'price-tier', 'review', 'report',
    ]) {
      expect(names.has(componentName(semantic)), semantic).toBe(true);
    }
    expect(names.has('AskSymbolIcon')).toBe(true);
  });

  it('renders every icon with the mds-icon class and aria-hidden default', () => {
    for (const [name, Component] of componentExports) {
      const { container, unmount } = render(<Component />);
      const svg = container.querySelector('svg');
      expect(svg, name).not.toBeNull();
      expect(svg?.classList.contains('mds-icon'), name).toBe(true);
      expect(svg?.getAttribute('aria-hidden'), name).toBe('true');
      unmount();
    }
  });

  it('adds the RTL flip class only to directional icons', () => {
    for (const semantic of RTL_FLIP_ICONS) {
      const name = componentName(semantic);
      const Component = byName[name] as ComponentType;
      const { container } = render(<Component />);
      expect(container.querySelector('svg')?.classList.contains('mds-icon-flip'), name).toBe(true);
    }
    for (const name of ['CloseIcon', 'SearchIcon', 'NotificationsIcon', 'AmountsShownIcon', 'ToneWaitingIcon']) {
      const Component = byName[name] as ComponentType;
      const { container } = render(<Component />);
      expect(container.querySelector('svg')?.classList.contains('mds-icon-flip'), name).toBe(false);
    }
  });

  it('flips exactly the 23.23 directional names', () => {
    // 23.23 + BATCH2 م-أ7 (movement-in/out) + م-أ10 (send): the directional
    // names flip in RTL — nothing else does.
    expect(RTL_FLIP_ICONS).toEqual([
      'nav-delivery', 'back', 'forward', 'transfer',
      'movement-in', 'movement-out', 'send',
    ]);
  });

  it('renders at the requested size (BRIEF 5.5: 14/16/20/24)', () => {
    const Back = Icons.BackIcon;
    for (const size of [14, 16, 20, 24] as const) {
      const { container } = render(<Back size={size} />);
      expect(container.querySelector('svg')?.getAttribute('width')).toBe(String(size));
      expect(container.querySelector('svg')?.getAttribute('height')).toBe(String(size));
    }
    const { container } = render(<Back />);
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('24');
  });

  it('draws on the Phosphor 256 viewBox with currentColor', () => {
    const { container } = render(<Icons.NavTodayIcon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 256 256');
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('renders the ask symbol from the favicon geometry at 28 (or 16)', () => {
    const { container, rerender } = render(<Icons.AskSymbolIcon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 224 224');
    expect(svg?.getAttribute('width')).toBe('28');
    expect(svg?.classList.contains('mds-icon-flip')).toBe(false); // never flipped
    expect(svg?.querySelectorAll('g').length).toBe(5);
    rerender(<Icons.AskSymbolIcon size={16} />);
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('16');
  });

  it('draws both weights for dual-weight icons (Regular + Fill)', () => {
    const { container } = render(<Icons.NavFinanceIcon weight="fill" />);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    const regular = render(<Icons.NavFinanceIcon />);
    expect(regular.container.querySelectorAll('path').length).toBeGreaterThan(0);
  });
});
