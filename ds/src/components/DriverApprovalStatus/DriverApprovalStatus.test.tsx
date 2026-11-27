import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { DriverApprovalStatus } from './DriverApprovalStatus';

describe('DriverApprovalStatus (BATCH2-SPECS §4.9)', () => {
  it('waiting: the badge and the review sentence', () => {
    render(<DriverApprovalStatus tone="waiting" />);
    expect(screen.getByText(ar['driver.pending'].text)).not.toBeNull();
    expect(screen.getByText(ar['driver.pendingSentence'].text)).not.toBeNull();
  });

  it('rejected: the reason ALWAYS renders in a Well (ق1)', () => {
    const withReason = render(<DriverApprovalStatus tone="rejected" caption="الرخصة منتهية" />);
    expect(withReason.getByText('الرخصة منتهية')).not.toBeNull();
    expect(withReason.container.querySelector('.mds-well')).not.toBeNull();
  });

  it('approved: badge only, no reason block', () => {
    const { container } = render(<DriverApprovalStatus tone="approved" />);
    expect(screen.getByText(ar['driver.approved'].text)).not.toBeNull();
    expect(container.querySelector('.mds-well')).toBeNull();
  });
});
