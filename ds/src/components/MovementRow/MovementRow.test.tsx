import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountVisibilityProvider } from '../../lib/amount-visibility';
import { ar } from '../../i18n/ar';
import { MovementRow } from './MovementRow';

describe('MovementRow (BATCH2-SPECS §2.1)', () => {
  it('renders the sign from the direction, text-primary in both (ق1+ق2)', () => {
    const { container } = render(
      <MovementRow label="أبو محمد (بقالة النور)" caption="درج الكاش · مستلزمات" value={35} direction="out" time="10:42 صباحاً" />,
    );
    const visual = container.querySelector('.mds-money-visual');
    expect(visual?.textContent).toContain('−35');
    expect(visual?.textContent).not.toContain('+');
    expect(container.querySelector('.mds-movement-row--out')).not.toBeNull();
  });

  it('in renders «+» with the movement-in mark', () => {
    const { container } = render(
      <MovementRow label="سلمى الحوراني" caption="الحساب البنكي · فستان خطوبة" value="145.750" direction="in" time="12:30 م" />,
    );
    expect(container.querySelector('.mds-money-visual')?.textContent).toContain('+145.750');
    expect(container.querySelector('.mds-movement-row--in')).not.toBeNull();
  });

  it('no badge on a normal saved row (ق3)', () => {
    const { container } = render(
      <MovementRow label="سلمى" value={45} direction="in" time="12:30 م" />,
    );
    expect(container.querySelector('.mds-status-badge')).toBeNull();
  });

  it('draft replaces the time with the «مسودة» waiting badge', () => {
    render(
      <MovementRow label="طباعة" caption="درج الكاش" value={7} direction="out" draft time={undefined} />,
    );
    expect(screen.getByText(ar['state.draft'].text)).not.toBeNull();
  });

  it('hidden amounts render «•••• د» with no sign (§2.1 item 6)', () => {
    const { container } = render(
      <AmountVisibilityProvider hidden>
        <MovementRow label="أبو محمد" value={35} direction="out" time="10:42" />
      </AmountVisibilityProvider>,
    );
    const text = container.querySelector('.mds-money-visual')?.textContent ?? '';
    expect(text).toContain('••••');
    expect(text).not.toContain('−');
    expect(text).not.toContain('35');
  });

  it('loading renders the skeleton row with no real numbers (§0.2 item 1)', () => {
    const { container } = render(
      <MovementRow label="س" value={5} direction="in" state="loading" />,
    );
    expect(container.querySelector('.mds-movement-row--loading')).not.toBeNull();
    expect(container.querySelector('.mds-money')).toBeNull();
    expect(container.textContent).not.toContain('5');
  });

  it('the screen-reader label starts with the direction word (§2.1 item 7)', () => {
    render(
      <MovementRow label="أبو محمد" caption="درج الكاش" value={35} direction="out" time="10:42 صباحاً" />,
    );
    const row = screen.getByRole('button');
    expect(row.getAttribute('aria-label')?.startsWith(ar['sr.movementRowOut'].text)).toBe(true);
  });
});
