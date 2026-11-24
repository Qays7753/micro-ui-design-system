import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { HeroSurface } from './HeroSurface';
import { HeroSurfaceStates } from './HeroSurface.states';

const LABEL = ar['nav.finance'].text;
const UNIT = ar['money.unit'].text;
const SOURCE = ar['metric.sourceFrom'].text.replace('{counted}', ar['movement.counted'].text);

describe('HeroSurface (BRIEF 1.5, 23.8)', () => {
  it('renders label, value, unit, diff and source link in order', () => {
    const { container } = render(
      <HeroSurface
        label={LABEL}
        value="1,245.750"
        trailing={UNIT}
        direction={<span>↑ 12% أعلى من أمس</span>}
        debt={SOURCE}
      />,
    );
    expect(container.querySelector('.mds-hero-label')?.textContent).toBe(LABEL);
    expect(container.querySelector('.mds-hero-value-whole')?.textContent).toBe('1,245');
    expect(container.querySelector('.mds-hero-value-cents')?.textContent).toBe('.750');
    expect(container.querySelector('.mds-hero-unit')?.textContent).toBe(UNIT);
    expect(container.querySelector('.mds-hero-diff')).not.toBeNull();
    expect(container.querySelector('.mds-hero-source')?.textContent).toBe(SOURCE);
    expect(HeroSurfaceStates).toContain('withCents');
  });

  it('renders «—» in the SAME display-hero typography when missing (owner decision)', () => {
    const { container } = render(<HeroSurface label={LABEL} />);
    const value = container.querySelector('.mds-hero-value') as HTMLElement;
    expect(value.textContent).toContain('—');
    expect(value.className).toContain('mds-hero-value--hero');
    expect(HeroSurfaceStates).toContain('missing');
  });

  it('drops a long number to number-lg in ONE step (23.8)', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,250,000.125" trailing={UNIT} />);
    expect(container.querySelector('.mds-hero-value--lg')).not.toBeNull();
    expect(HeroSurfaceStates).toContain('longNumber');
  });

  it('omits the diff line when there is no comparison (23.8)', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,245" />);
    expect(container.querySelector('.mds-hero-diff')).toBeNull();
    expect(HeroSurfaceStates).toContain('noDiff');
  });

  it('fires onDismiss when the source link is pressed', () => {
    const onDismiss = vi.fn();
    const { container } = render(<HeroSurface label={LABEL} value="1,245" debt={SOURCE} onDismiss={onDismiss} />);
    const link = container.querySelector('.mds-hero-source') as HTMLElement;
    fireEvent.pointerDown(link);
    fireEvent.pointerUp(link);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('carries the AmountVisibilityToggle in the label line (23.8 item 1)', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,245" />);
    expect(
      container.querySelector('.mds-hero-header .mds-amount-visibility-toggle'),
    ).not.toBeNull();
  });

  it('uses no brand-signal-text anywhere (owner terracotta decision)', () => {
    const css = readFileSync(join(__dirname, 'HeroSurface.css'), 'utf8');
    expect(css).not.toContain('brand-signal-text');
  });
});
