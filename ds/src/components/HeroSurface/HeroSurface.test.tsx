import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar, moneyTexts } from '../../i18n/ar';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
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

  it('renders the optional small line between the diff line and the source link (23.25)', () => {
    const { container } = render(
      <HeroSurface
        label={LABEL}
        value="1,245.750"
        trailing={UNIT}
        draft={[9.1, 8.4, 9.6, 8.8, 10.1, 9.4, 11.2]}
        direction={<span>↑ أعلى</span>}
        debt={SOURCE}
      />,
    );
    const sparkline = container.querySelector('.mds-hero-sparkline');
    expect(sparkline).not.toBeNull();
    expect(sparkline?.querySelector('polyline')).not.toBeNull();
    expect(sparkline?.querySelector('circle')).not.toBeNull();
    expect(HeroSurfaceStates).toContain('withSparkline');
    // order (23.25): diff → sparkline → source
    const order = ['.mds-hero-diff', '.mds-hero-sparkline', '.mds-hero-source'].map(
      (sel) => container.querySelector(sel),
    );
    expect(order[0]).not.toBeNull();
    expect(order[1]).not.toBeNull();
    expect(order[2]).not.toBeNull();
    expect(order[0]!.compareDocumentPosition(order[1]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(order[1]!.compareDocumentPosition(order[2]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('draws the endpoint dot ALONE for a single value (no line)', () => {
    const { container } = render(
      <HeroSurface label={LABEL} value="1,245" draft={[11.2]} />,
    );
    expect(container.querySelector('.mds-hero-sparkline circle')).not.toBeNull();
    expect(container.querySelector('.mds-hero-sparkline polyline')).toBeNull();
  });

  it('omits the small line entirely when draft is not given', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,245" />);
    expect(container.querySelector('.mds-hero-sparkline')).toBeNull();
  });

  it('keeps the small line slot WITHOUT values when amounts are hidden (23.22: stays, value-less)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <HeroSurface label={LABEL} value="1,245" trailing={UNIT} draft={[9.1, 8.4, 9.6, 8.8]} />
      </AmountVisibilityProvider>,
    );
    const sparkline = container.querySelector('.mds-hero-sparkline');
    expect(sparkline).not.toBeNull();
    expect(sparkline?.querySelector('polyline')).toBeNull();
    expect(sparkline?.querySelector('circle')).toBeNull();
  });

  it('renders «••••» + the unit and NO real value when amounts are hidden (23.22)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <HeroSurface label={LABEL} value="1,245.750" trailing={UNIT} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-hero-value-glyph')?.textContent).toBe(moneyTexts.hiddenGlyph);
    expect(container.querySelector('.mds-hero-unit')?.textContent).toBe(UNIT);
    expect(container.textContent).not.toContain('1,245.750');
    expect(container.querySelector('.mds-visually-hidden')?.textContent).toBe(moneyTexts.hidden);
  });

  it('renders the missing em dash ALONE, without the unit (addendum 1.6 w-2 item 9)', () => {
    const { container } = render(<HeroSurface label={LABEL} trailing={UNIT} />);
    expect(container.querySelector('.mds-hero-value-glyph')?.textContent).toBe(moneyTexts.missingGlyph);
    expect(container.querySelector('.mds-hero-unit')).toBeNull();
    // and «—» survives hidden (missing wins over hidden, like Money)
    const hiddenRender = render(
      <AmountVisibilityProvider hidden>
        <HeroSurface label={LABEL} trailing={UNIT} />
      </AmountVisibilityProvider>,
    );
    expect(hiddenRender.container.querySelector('.mds-hero-value-glyph')?.textContent).toBe(moneyTexts.missingGlyph);
    expect(hiddenRender.container.querySelector('.mds-visually-hidden')).toBeNull();
  });
});
