import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { EmptyState } from './EmptyState';
import { EmptyStateStates } from './EmptyState.states';

afterEach(cleanup);

describe('EmptyState (BRIEF 23.7, 1649)', () => {
  it('two ghost rows shaped like ObjectRow (44 mark + two lines), no motion', () => {
    const { container } = render(<EmptyState label={ar['empty.movements'].text} />);
    expect(container.querySelectorAll('.mds-empty-state-ghost').length).toBe(2);
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).toContain('var(--mds-size-entity-44)');
    expect(css).toContain('var(--mds-size-skeleton-line-body)');
    expect(css).toContain('var(--mds-size-skeleton-line-caption)');
    expect(css).toContain('width: 72%');
    expect(css).toContain('width: 48%');
    expect(css).not.toContain('animation');
    expect(EmptyStateStates).toContain('default');
  });

  it('r-lg 24 symmetric surface with centered content', () => {
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).toContain('border-radius: var(--mds-radius-lg)');
    expect(css).toContain('align-items: center');
    expect(css).toContain('text-align: center');
  });

  it('content ≤ 280 (layout.empty-state-content-max)', () => {
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).toContain('var(--mds-layout-empty-state-content-max)');
  });

  it('ONE sentence + ONE optional secondary action', () => {
    const first = render(<EmptyState label={ar['empty.movements'].text} />);
    expect(first.container.querySelectorAll('.mds-empty-state-sentence').length).toBe(1);
    expect(first.container.querySelector('.mds-empty-state-action')).toBeNull();
    first.unmount();
    const second = render(
      <EmptyState label={ar['empty.movements'].text} trailing={<button type="button">A</button>} />,
    );
    expect(second.container.querySelector('.mds-empty-state-action')).not.toBeNull();
    expect(EmptyStateStates).toContain('withAction');
  });

  it('skeleton color only, no big icon in a circle (23.7 ban)', () => {
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).toContain('var(--mds-color-skeleton)');
    expect(css).not.toContain('border-radius: var(--mds-radius-full)');
  });
});
