import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { getMoneyTexts,} from '../../i18n/ar';
import { Money } from './Money';
import { MoneyStates } from './Money.states';

function digitsOf(container: HTMLElement): string {
  return container.querySelector('.mds-money-value')?.textContent ?? '';
}

describe('Money (BRIEF 8)', () => {
  it('renders the grouped amount with the unit and an LTR isolation', () => {
    const { container } = render(<Money value="12450.125" />);
    const value = container.querySelector('.mds-money-value')!;
    expect(value.getAttribute('dir')).toBe('ltr');
    expect(value.textContent).toBe('12,450.125');
    expect(container.querySelector('.mds-money-unit')?.textContent).toBe(getMoneyTexts().unit);
  });

  it('keeps three fils digits when present and none when zero (BRIEF 8)', () => {
    const withFils = render(<Money value="12.500" />);
    expect(withFils.container.querySelector('.mds-money-fraction')?.textContent).toBe('.500');
    const whole = render(<Money value="150" />);
    expect(whole.container.querySelector('.mds-money-fraction')).toBeNull();
    expect(digitsOf(whole.container)).toBe('150');
  });

  it('signs out with the real minus and never colors it (BRIEF 8)', () => {
    const { container } = render(<Money value="-35" />);
    expect(digitsOf(container)).toBe('−35');
  });

  it('signs in with + and transfers without a sign', () => {
    const incoming = render(<Money value="35" flow="in" />);
    expect(digitsOf(incoming.container)).toBe('+35');
    const moved = render(<Money value="1280" flow="transfer" />);
    expect(digitsOf(moved.container)).toBe('1,280');
  });

  it('A2: the sign is the FIRST character inside the LTR isolation, adjacent to the integer', () => {
    const out = render(<Money value="-35" />);
    const value = out.container.querySelector('.mds-money-value')!;
    expect(value.getAttribute('dir')).toBe('ltr');
    const integer = value.querySelector('.mds-money-integer')!;
    // Sign + digits form ONE adjacent run inside the isolation, so the
    // sign can never drift to the number's far side («35−» is banned).
    expect(integer.textContent).toBe('−35');
    expect(integer.textContent?.indexOf('−')).toBe(0);
    const incoming = render(<Money value="2250" flow="in" />);
    const int2 = incoming.container.querySelector('.mds-money-integer')!;
    expect(int2.textContent).toBe('+2,250');
    expect(int2.textContent?.indexOf('+')).toBe(0);
  });

  it('renders the debt forms without a sign (BRIEF 8)', () => {
    const forYou = render(<Money value={45} debt="forYou" />);
    expect(forYou.container.querySelector('.mds-money-debt')?.textContent).toBe(getMoneyTexts().forYou);
    expect(digitsOf(forYou.container)).toBe('45');
    // Independently assembled from dictionary parts, not from formatMoney.
    expect(screen.getByText(`${getMoneyTexts().forYou} 45 ${getMoneyTexts().dinar}`)).not.toBeNull();
    const againstYou = render(<Money value={20} debt="againstYou" />);
    expect(againstYou.container.querySelector('.mds-money-debt')?.textContent).toBe(getMoneyTexts().againstYou);
  });

  it('announces the amount in full words to the screen reader (23.17)', () => {
    render(<Money value="12.500" />);
    expect(screen.getByText(`12 ${getMoneyTexts().dinar} ${getMoneyTexts().and}500 ${getMoneyTexts().fils}`)).not.toBeNull();
    render(<Money value="-35" />);
    expect(screen.getByText(`${getMoneyTexts().minus} 35 ${getMoneyTexts().dinar}`)).not.toBeNull();
  });

  it('hides the visual part from the accessibility tree, with words kept aside', () => {
    const { container } = render(<Money value="45" debt="forYou" />);
    expect(container.querySelector('.mds-money-visual')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.mds-visually-hidden')?.textContent)
      .toBe(`${getMoneyTexts().forYou} 45 ${getMoneyTexts().dinar}`);
  });

  it('shows «—» for a missing value, never a zero (BRIEF 8)', () => {
    const { container } = render(<Money value={null} />);
    expect(container.querySelector('.mds-money-missing')?.textContent).toBe(getMoneyTexts().missingGlyph);
    expect(container.querySelector('.mds-money-value')).toBeNull();
    expect(container.textContent).not.toContain('0');
  });

  it('renders the missing glyph in the NUMBER typography, never a caption (rule 9 / owner decision)', () => {
    const { container } = render(<Money value={null} />);
    const missing = container.querySelector('.mds-money-missing') as HTMLElement;
    // the glyph rides the amount line itself: no caption class anywhere on it
    expect(missing.className).not.toContain('caption');
    expect(missing.closest('.mds-type-caption')).toBeNull();
    // and it sits in the same visual flow the value would occupy (the
    // mds-money-visual line, sibling of where the bdi value renders)
    expect(missing.parentElement?.classList.contains('mds-money-visual')).toBe(true);
    expect(missing.parentElement?.querySelector('.mds-money-value')).toBeNull();
  });

  it('spaces the unit from the number with the amount-unit-gap token (rule 4)', () => {
    const css = readFileSync(join(__dirname, 'Money.css'), 'utf8');
    expect(css).toContain('var(--mds-layout-amount-unit-gap)');
  });

  it('renders the loading skeleton with aria-busy, never a zero (BRIEF 8, 23.17)', () => {
    const { container } = render(<Money state="loading" value="12.500" />);
    expect(container.querySelector('.mds-money-skeleton')).not.toBeNull();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(/[0-9]/.test(container.textContent ?? '')).toBe(false);
  });

  it('supports the disabled look (BRIEF 23.2)', () => {
    const { container } = render(<Money value="45" disabled />);
    expect(container.querySelector('.mds-money--disabled')).not.toBeNull();
  });

  it('documents its size subset: md (default) and lg with tracking', () => {
    const md = render(<Money value="45" />);
    expect(md.container.querySelector('.mds-money--md')).not.toBeNull();
    const lg = render(<Money value="45" size="lg" />);
    expect(lg.container.querySelector('.mds-money--lg')).not.toBeNull();
  });

  it('passes data attributes through to the root (the lab check hooks)', () => {
    const { container } = render(<Money value="45" data-ds-check="amount" />);
    expect(container.querySelector('[data-ds-check="amount"]')).not.toBeNull();
  });
});

describe('Money — hidden amounts (BRIEF 23.22)', () => {
  it('renders exactly four bullets plus the unit, with zero digits in the DOM', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Money value="12450.125" />
      </AmountVisibilityProvider>,
    );
    const root = container.querySelector('.mds-money')!;
    const text = root.textContent ?? '';
    expect((text.match(/\u2022/g) ?? [])).toHaveLength(4);
    expect(text).toContain(getMoneyTexts().unit);
    expect(/[0-9]/.test(text)).toBe(false);
    expect(root.getAttribute('aria-label')).toBeNull();
  });

  it('keeps the debt word while hidden, with four bullets', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Money value={45} debt="forYou" />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-money-debt')?.textContent).toBe(getMoneyTexts().forYou);
    const text = container.textContent ?? '';
    expect((text.match(/\u2022/g) ?? [])).toHaveLength(4);
  });

  it('announces the hidden amount without any digit (23.17, 23.22)', () => {
    render(
      <AmountVisibilityProvider hidden>
        <Money value="12450.125" />
      </AmountVisibilityProvider>,
    );
    expect(screen.getByText(getMoneyTexts().hidden)).not.toBeNull();
  });

  it('still shows «—» for a missing value when amounts are hidden', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <Money value={null} />
      </AmountVisibilityProvider>,
    );
    expect(container.querySelector('.mds-money-missing')?.textContent).toBe(getMoneyTexts().missingGlyph);
    expect((container.textContent ?? '').match(/\u2022/g) ?? []).toHaveLength(0);
  });

  it('shows the real value again when the provider turns visible', () => {
    const { container, rerender } = render(
      <AmountVisibilityProvider hidden>
        <Money value="45" />
      </AmountVisibilityProvider>,
    );
    expect(/[0-9]/.test(container.textContent ?? '')).toBe(false);
    rerender(
      <AmountVisibilityProvider hidden={false}>
        <Money value="45" />
      </AmountVisibilityProvider>,
    );
    expect(digitsOf(container)).toBe('45');
  });
});

describe('Money.states (BRIEF 9.0)', () => {
  it('lists the applicable states the lab must render', () => {
    expect(MoneyStates).toContain('default');
    expect(MoneyStates).toContain('hidden');
    expect(MoneyStates).toContain('missing');
    expect(MoneyStates).toContain('loading');
    expect(MoneyStates).toContain('disabled');
    expect(MoneyStates).toContain('longest');
  });
});
