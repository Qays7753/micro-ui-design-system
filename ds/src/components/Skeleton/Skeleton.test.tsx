import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Skeleton } from './Skeleton';
import { SkeletonStates } from './Skeleton.states';

afterEach(cleanup);

describe('Skeleton (BRIEF 23.10, 1650)', () => {
  it('shapes size to the real content with tokens', () => {
    const css = readFileSync(join(__dirname, 'Skeleton.css'), 'utf8');
    expect(css).toContain('var(--mds-size-skeleton-line-body)');
    expect(css).toContain('var(--mds-size-skeleton-line-caption)');
    expect(css).toContain('var(--mds-size-skeleton-hero-160)');
    expect(css).toContain('var(--mds-size-skeleton-hero-32)');
    expect(css).toContain('var(--mds-size-entity-44)');
    expect(css).toContain('width: 72%');
    expect(css).toContain('width: 48%');
    expect(SkeletonStates).toHaveLength(4);
  });

  it('pulses with the motion tokens, never shimmer (23.10)', () => {
    const css = readFileSync(join(__dirname, 'Skeleton.css'), 'utf8');
    expect(css).toContain('var(--mds-motion-skeleton-pulse-ms)');
    expect(css).toContain('var(--mds-motion-skeleton-pulse-ease)');
    expect(css).toContain('infinite');
    expect(css).not.toMatch(/gradient\s*\(/i);
    expect(css).toContain('prefers-reduced-motion');
  });

  it('renders hidden from the accessibility tree (23.17)', () => {
    const { container } = render(<Skeleton variant="body" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList.contains('mds-skeleton--body')).toBe(true);
  });

  it('uses the skeleton color and content radii', () => {
    const css = readFileSync(join(__dirname, 'Skeleton.css'), 'utf8');
    expect(css).toContain('var(--mds-color-skeleton)');
    expect(css).toContain('var(--mds-radius-2xs)');
    expect(css).toContain('var(--mds-radius-sm)');
    expect(css).toContain('var(--mds-radius-entity-44)');
  });
});
