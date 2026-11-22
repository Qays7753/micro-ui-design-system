import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider, useAmountVisibility } from './amount-visibility';

function Probe() {
  const { hidden, visible } = useAmountVisibility();
  return <p data-testid="probe">{hidden ? 'hidden' : visible ? 'visible' : 'broken'}</p>;
}

describe('amount visibility context (BRIEF 23.22)', () => {
  it('defaults to visible outside a provider', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('visible');
  });

  it('reads hidden from the provider', () => {
    render(
      <AmountVisibilityProvider hidden>
        <Probe />
      </AmountVisibilityProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('hidden');
  });

  it('reflects state changes (the app toggles it)', () => {
    const { rerender } = render(
      <AmountVisibilityProvider hidden={false}>
        <Probe />
      </AmountVisibilityProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('visible');
    rerender(
      <AmountVisibilityProvider hidden>
        <Probe />
      </AmountVisibilityProvider>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('hidden');
  });
});
