import { render, cleanup } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../../i18n/ar';
import { InlineBanner } from './InlineBanner';
import { InlineBannerStates } from './InlineBanner.states';

afterEach(cleanup);

describe('InlineBanner (BRIEF 517, 658, 23.23, 1649)', () => {
  it('renders the three semantics with their icons and tone pairs', () => {
    const css = readFileSync(join(__dirname, 'InlineBanner.css'), 'utf8');
    expect(css).toContain('.mds-inline-banner--offline');
    expect(css).toContain('var(--mds-color-status-problem-bg)');
    expect(css).toContain('.mds-inline-banner--locked');
    expect(css).toContain('var(--mds-color-status-neutral-bg)');
    expect(css).toContain('.mds-inline-banner--info');
    expect(css).toContain('var(--mds-color-status-info-bg)');
    expect(InlineBannerStates).toContain('offline');
  });

  it('never a fully-colored surface: light pair with icon + text (1649)', () => {
    const { container } = render(<InlineBanner tone="offline" label={ar['banner.offline'].text} />);
    const banner = container.querySelector('.mds-inline-banner') as HTMLElement;
    expect(banner.querySelector('svg')).not.toBeNull();
    expect(banner.textContent).toContain(ar['banner.offline'].text);
    expect(banner.getAttribute('role')).toBe('status');
  });

  it('sticks to the top of content in layer.content (517, 1242)', () => {
    const css = readFileSync(join(__dirname, 'InlineBanner.css'), 'utf8');
    expect(css).toContain('position: sticky');
    expect(css).toContain('z-index: var(--mds-layer-content)');
  });

  it('carries an optional action slot (658)', () => {
    const { container } = render(
      <InlineBanner tone="info" label={ar['banner.backOnline'].text} trailing={<button type="button">A</button>} />,
    );
    expect(container.querySelector('.mds-inline-banner-action')).not.toBeNull();
    expect(InlineBannerStates).toContain('withAction');
  });

  it('icon renders at 20 (23.23)', () => {
    const css = readFileSync(join(__dirname, 'InlineBanner.css'), 'utf8');
    expect(css).toContain('var(--mds-size-icon-20)');
  });
});
