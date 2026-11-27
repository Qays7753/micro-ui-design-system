import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { IssueProposalCard } from './IssueProposalCard';

const ITEMS = [
  { key: ar['issue.reason'].text, value: 'المستلم لا يرد' },
  { key: ar['issue.proposed'].text, value: 'إعادة المحاولة غداً' },
];
const BUTTONS = (
  <>
    <Button variant="secondary" size="sm">وافق</Button>
    <Button variant="text" size="sm">ارفض</Button>
  </>
);

describe('IssueProposalCard (BATCH2-SPECS §4.4)', () => {
  it('renders the header, reason and proposed action in a Well', () => {
    const { container } = render(<IssueProposalCard items={ITEMS} accept={BUTTONS} />);
    expect(screen.getByText(ar['issue.title'].text)).not.toBeNull();
    expect(screen.getByText('المستلم لا يرد')).not.toBeNull();
    expect(screen.getByText('إعادة المحاولة غداً')).not.toBeNull();
    expect(container.querySelector('.mds-well')).not.toBeNull();
  });

  it('driver copy: waiting badge, NO buttons (ق1)', () => {
    const { container } = render(<IssueProposalCard items={ITEMS} audience="driver" accept={BUTTONS} />);
    expect(container.querySelector('button.mds-button')).toBeNull();
    expect(container.querySelector('.mds-status-badge')?.textContent).toContain(ar['issue.awaitingOwner'].text);
  });

  it('owner copy renders both decision buttons', () => {
    const { container } = render(<IssueProposalCard items={ITEMS} accept={BUTTONS} />);
    expect(container.querySelectorAll('button.mds-button').length).toBe(2);
  });

  it('decided replaces the buttons with the decision line (§4.4 item 4)', () => {
    const { container } = render(
      <IssueProposalCard items={ITEMS} decided={<span>وافقت · 10:42 ص</span>} />,
    );
    expect(container.querySelector('.mds-issue-proposal-card-decided')?.textContent).toContain('وافقت');
    expect(container.querySelector('.mds-issue-proposal-card-actions')).toBeNull();
  });

  it('the aria reads title, reason and action (§4.4 item 7)', () => {
    render(<IssueProposalCard items={ITEMS} />);
    const label = screen.getByRole('group').getAttribute('aria-label') ?? '';
    expect(label).toContain('تعذّر التسليم');
    expect(label).toContain('السبب');
    expect(label).toContain('إعادة المحاولة غداً');
  });
});
