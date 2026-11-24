import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Well } from './Well';
import { WellStates } from './Well.states';

const TEXT = ar['empty.movements'].text;

describe('Well (BRIEF 9.2, 23.1(1), 23.21)', () => {
  it('renders a plain inset with the well classes', () => {
    const { container } = render(<Well>{TEXT}</Well>);
    expect(container.querySelector('.mds-well')).not.toBeNull();
    expect(WellStates).toContain('default');
  });

  it('renders inside a Surface (its only legal parent, 9.2)', () => {
    const { container } = render(
      <div className="mds-surface">
        <Well>{TEXT}</Well>
      </div>,
    );
    expect(container.querySelector('.mds-surface .mds-well')).not.toBeNull();
    expect(WellStates).toContain('inSurface');
  });

  it('passes data attributes through (lab hooks)', () => {
    const { container } = render(<Well data-ds-check="well">{TEXT}</Well>);
    expect(container.querySelector('[data-ds-check="well"]')).not.toBeNull();
  });
});
