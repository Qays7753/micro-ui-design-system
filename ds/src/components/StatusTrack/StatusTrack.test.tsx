import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusTrack } from './StatusTrack';

const STAGES = [
  { label: 'أُنشئ' },
  { label: 'قيد التجهيز' },
  { label: 'قيد التنفيذ' },
  { label: 'تمّ' },
];

describe('StatusTrack (BATCH2-SPECS §1.17)', () => {
  it('renders every stage label exactly once', () => {
    const { container } = render(<StatusTrack items={STAGES} value={1} />);
    for (const s of STAGES) {
      expect(screen.getByText(s.label)).not.toBeNull();
    }
    expect(container.querySelectorAll('.mds-status-track-dot').length).toBe(4);
  });

  it('exactly one current step (ق1)', () => {
    const { container } = render(<StatusTrack items={STAGES} value={2} />);
    expect(container.querySelectorAll('.mds-status-track-step--current').length).toBe(1);
    expect(container.querySelectorAll('.mds-status-track-step--done').length).toBe(2);
  });

  it('problem tone on the current step only (§4.3 item 2)', () => {
    const { container } = render(
      <StatusTrack items={[{ label: 'أ' }, { label: 'تعذّر', tone: 'problem' }]} value={1} />,
    );
    expect(container.querySelectorAll('.mds-status-track-step--problem').length).toBe(1);
    expect(container.querySelector('.mds-status-track-step--problem')?.className).toContain('current');
  });

  it('the aria label reads stage n of m with the current name', () => {
    render(<StatusTrack items={STAGES} value={2} />);
    const label = screen.getByRole('group').getAttribute('aria-label') ?? '';
    expect(label).toContain('3');
    expect(label).toContain('4');
    expect(label).toContain('قيد التنفيذ');
  });

  it('a single stage renders without lines', () => {
    const { container } = render(<StatusTrack items={[{ label: 'وحد' }]} value={0} />);
    expect(container.querySelectorAll('.mds-status-track-dot').length).toBe(1);
  });
});
