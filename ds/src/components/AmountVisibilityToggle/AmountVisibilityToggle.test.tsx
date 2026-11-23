import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { t } from '../../i18n/ar';
import { AmountVisibilityToggle } from './AmountVisibilityToggle';
import { AmountVisibilityToggleStates } from './AmountVisibilityToggle.states';

describe('AmountVisibilityToggle (BRIEF 23.22)', () => {
  it('is a 48 icon button whose icon is the shown state by default', () => {
    const { container } = render(<AmountVisibilityToggle />);
    const button = screen.getByRole('button');
    expect(button).toBe(container.querySelector('.mds-amount-visibility-toggle'));
    expect(container.querySelector('.mds-amount-visibility-toggle--large')).toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('names itself after the shown state (hide amounts)', () => {
    render(<AmountVisibilityToggle />);
    expect(screen.getByRole('button', { name: t('button.hideAmounts') })).not.toBeNull();
  });

  it('follows the context: hidden amounts switch the icon and the name', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <AmountVisibilityToggle />
      </AmountVisibilityProvider>,
    );
    expect(screen.getByRole('button', { name: t('button.showAmounts') })).not.toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('reports the requested visibility through onChange and owns no state', () => {
    const onChange = vi.fn();
    const { rerender } = render(<AmountVisibilityToggle onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith(false);

    rerender(
      <AmountVisibilityProvider hidden>
        <AmountVisibilityToggle onChange={onChange} />
      </AmountVisibilityProvider>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('keeps working without an onChange (display-only usage)', () => {
    render(<AmountVisibilityToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: t('button.hideAmounts') })).not.toBeNull();
  });

  it('supports the driver density and the disabled look', () => {
    const large = render(<AmountVisibilityToggle density="large" />);
    expect(large.container.querySelector('.mds-amount-visibility-toggle--large')).not.toBeNull();
    render(<AmountVisibilityToggle disabled />);
    expect((screen.getAllByRole('button')[1] as HTMLButtonElement).disabled).toBe(true);
  });

  it('passes data attributes through to the button (the lab check hooks)', () => {
    const { container } = render(
      <AmountVisibilityToggle data-ds-check="amount-visibility-toggle" />,
    );
    expect(container.querySelector('[data-ds-check="amount-visibility-toggle"]')).not.toBeNull();
  });

  it('exposes its state list for the lab and the gates (BRIEF 9.0)', () => {
    expect(AmountVisibilityToggleStates).toContain('amountsShown');
    expect(AmountVisibilityToggleStates).toContain('amountsHidden');
    expect(AmountVisibilityToggleStates).toContain('disabled');
  });
});
