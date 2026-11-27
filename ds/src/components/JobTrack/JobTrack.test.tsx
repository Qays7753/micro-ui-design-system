import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JobTrack } from './JobTrack';

const STAGES = [
  { label: 'أُنشئ' },
  { label: 'عُيّن السائق' },
  { label: 'قيد التنفيذ' },
  { label: 'تمّ' },
];

describe('JobTrack (BATCH2-SPECS §4.3)', () => {
  it('is the StatusTrack anatomy with the app stages', () => {
    const { container } = render(<JobTrack items={STAGES} value={2} />);
    expect(container.querySelector('.mds-status-track')).not.toBeNull();
    expect(container.querySelectorAll('.mds-status-track-dot').length).toBe(4);
    expect(screen.getByText('قيد التنفيذ')).not.toBeNull();
  });

  it('a problem current step renders problem tones (§4.3 item 2)', () => {
    const { container } = render(
      <JobTrack items={[{ label: 'أ' }, { label: 'تعذّر', tone: 'problem' }]} value={1} />,
    );
    expect(container.querySelector('.mds-status-track-step--problem')).not.toBeNull();
  });
});
