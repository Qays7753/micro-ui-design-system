import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { EmptyState } from './EmptyState';
import { EmptyStateStates } from './EmptyState.states';

afterEach(cleanup);

describe('EmptyState (BRIEF 23.7 + 1.7 ت9)', () => {
  it('NO ghost rows — the skeleton preview is gone (ت9: it read as a frozen loading)', () => {
    const { container } = render(<EmptyState label={ar['empty.movements'].text} />);
    expect(container.querySelector('.mds-empty-state-ghosts')).toBeNull();
    expect(container.querySelector('.mds-empty-state-ghost')).toBeNull();
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).not.toContain('mds-empty-state-ghost');
    expect(css).not.toContain('var(--mds-color-skeleton)');
    expect(css).not.toContain('animation');
    expect(EmptyStateStates).toContain('default');
  });

  it('r-lg symmetric surface with content aligned from the START (ت9, out of the 23.1(4) centering list)', () => {
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).toContain('border-radius: var(--mds-radius-lg)');
    expect(css).toContain('align-items: flex-start');
    expect(css).toContain('text-align: start');
    expect(css).not.toContain('align-items: center');
    expect(css).not.toContain('text-align: center');
  });

  it('the ONE sentence rides text-primary (ت9: it is the content, not a caption)', () => {
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).toContain('color: var(--mds-color-text-primary)');
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

  it('no big icon in a circle (23.7 ban stays)', () => {
    const css = readFileSync(join(__dirname, 'EmptyState.css'), 'utf8');
    expect(css).not.toContain('border-radius: var(--mds-radius-full)');
  });
});
