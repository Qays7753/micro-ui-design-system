import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar, getMoneyTexts,} from '../../i18n/ar';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { HeroSurface } from './HeroSurface';
import { HeroSurfaceStates } from './HeroSurface.states';

const LABEL = ar['nav.finance'].text;
const UNIT = ar['money.unit'].text;
const SOURCE = ar['metric.sourceFrom'].text.replace('{counted}', ar['movement.counted'].text);

describe('HeroSurface (BRIEF 1.5, 23.8 + 1.7 ت2)', () => {
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

  it('omits the one line entirely when there is neither diff nor source', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,245" />);
    expect(container.querySelector('.mds-hero-line')).toBeNull();
    expect(HeroSurfaceStates).toContain('noDiff');
  });

  it('merges the diff and the source into ONE line with « · » between them (1.7 ت2.3)', () => {
    const { container } = render(
      <HeroSurface label={LABEL} value="1,245" direction={<span>↑ أعلى</span>} debt={SOURCE} />,
    );
    const line = container.querySelector('.mds-hero-line') as HTMLElement;
    expect(line).not.toBeNull();
    expect(line.querySelector('.mds-hero-diff')).not.toBeNull();
    expect(line.querySelector('.mds-hero-line-sep')?.textContent).toBe('·');
    expect(line.querySelector('.mds-hero-source')).not.toBeNull();
  });

  it('renders the line with the source ALONE when there is no diff', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,245" debt={SOURCE} />);
    const line = container.querySelector('.mds-hero-line') as HTMLElement;
    expect(line).not.toBeNull();
    expect(line.querySelector('.mds-hero-diff')).toBeNull();
    expect(line.querySelector('.mds-hero-line-sep')).toBeNull();
    expect(line.querySelector('.mds-hero-source')).not.toBeNull();
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

  it('renders the small line LAST, full width, at hero-sparkline-height (1.7 ت2.4)', () => {
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
    expect(HeroSurfaceStates).toContain('withSparkline');
    // order (1.7 ت2): label line → value → ONE line (diff + source) → sparkline
    const order = ['.mds-hero-header', '.mds-hero-amount', '.mds-hero-line', '.mds-hero-sparkline'].map(
      (sel) => container.querySelector(sel),
    );
    for (const el of order) expect(el).not.toBeNull();
    for (let i = 0; i + 1 < order.length; i += 1) {
      expect(order[i]!.compareDocumentPosition(order[i + 1]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    // the line carries BOTH the diff and the source, in that order
    const line = container.querySelector('.mds-hero-line') as HTMLElement;
    const diff = line.querySelector('.mds-hero-diff') as HTMLElement;
    const source = line.querySelector('.mds-hero-source') as HTMLElement;
    expect(diff.compareDocumentPosition(source) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // the stretched svg rides the content's full width (preserveAspectRatio none)
    const svg = sparkline?.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('100%');
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('none');
  });

  it('draws the endpoint dot ALONE for a single value (no line)', () => {
    const { container } = render(
      <HeroSurface label={LABEL} value="1,245" draft={[11.2]} />,
    );
    // full-width mode: the dot is a zero-length round-capped path, not a circle
    expect(container.querySelector('.mds-hero-sparkline path.mds-hero-sparkline-dot')).not.toBeNull();
    expect(container.querySelector('.mds-hero-sparkline polyline')).toBeNull();
  });

  it('omits the small line entirely when draft is not given', () => {
    const { container } = render(<HeroSurface label={LABEL} value="1,245" />);
    expect(container.querySelector('.mds-hero-sparkline')).toBeNull();
  });

  it('keeps the small line slot WITHOUT values when amounts are hidden (23.22 + 1.7 ت10: stays, value-less)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <HeroSurface label={LABEL} value="1,245" trailing={UNIT} draft={[9.1, 8.4, 9.6, 8.8]} />
      </AmountVisibilityProvider>,
    );
    const sparkline = container.querySelector('.mds-hero-sparkline');
    expect(sparkline).not.toBeNull();
    expect(sparkline?.querySelector('polyline')).toBeNull();
    expect(sparkline?.querySelector('path')).toBeNull();
  });

  it('renders «••••» + the unit and NO real value when amounts are hidden (23.22)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <HeroSurface label={LABEL} value="1,245.750" trailing={UNIT} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-hero-value-glyph')?.textContent).toBe(getMoneyTexts().hiddenGlyph);
    expect(container.querySelector('.mds-hero-unit')?.textContent).toBe(UNIT);
    expect(container.textContent).not.toContain('1,245.750');
    expect(container.querySelector('.mds-visually-hidden')?.textContent).toBe(getMoneyTexts().hidden);
  });

  it('renders the missing em dash ALONE, without the unit (addendum 1.6 w-2 item 9)', () => {
    const { container } = render(<HeroSurface label={LABEL} trailing={UNIT} />);
    expect(container.querySelector('.mds-hero-value-glyph')?.textContent).toBe(getMoneyTexts().missingGlyph);
    expect(container.querySelector('.mds-hero-unit')).toBeNull();
    // and «—» survives hidden (missing wins over hidden, like Money)
    const hiddenRender = render(
      <AmountVisibilityProvider hidden>
        <HeroSurface label={LABEL} trailing={UNIT} />
      </AmountVisibilityProvider>,
    );
    expect(hiddenRender.container.querySelector('.mds-hero-value-glyph')?.textContent).toBe(getMoneyTexts().missingGlyph);
    expect(hiddenRender.container.querySelector('.mds-visually-hidden')).toBeNull();
  });
});
