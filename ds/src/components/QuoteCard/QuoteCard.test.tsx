import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { Button } from '../Button/index';
import { QuoteCard } from './QuoteCard';

const ACCEPT = <Button variant="secondary" size="sm">{ar['quote.accept'].text}</Button>;
const REJECT = <Button variant="text" size="sm">{ar['quote.reject'].text}</Button>;

describe('QuoteCard (BATCH2-SPECS §4.2)', () => {
  it('renders driver, note, lg price and the outcome sentence (ق2)', () => {
    const { container } = render(
      <QuoteCard label="عمر الزعبي" caption="أصل خلال 20 دقيقة" value={3} accept={ACCEPT} reject={REJECT} />,
    );
    expect(screen.getByText('عمر الزعبي')).not.toBeNull();
    expect(screen.getByText('أصل خلال 20 دقيقة')).not.toBeNull();
    expect(container.querySelector('.mds-money')?.className).toContain('mds-number-lg');
    expect(screen.getByText(ar['quote.resultSentence'].text)).not.toBeNull();
  });

  it('no primary button in a list card (ق1)', () => {
    const { container } = render(
      <QuoteCard label="أ" value={3} accept={ACCEPT} reject={REJECT} />,
    );
    for (const b of container.querySelectorAll('button.mds-button')) {
      expect(b.className).not.toContain('primary');
    }
  });

  it('alone in the sheet: no buttons at all (the ActionBar owns them)', () => {
    const { container } = render(
      <QuoteCard label="أ" value={3} inList={false} accept={ACCEPT} reject={REJECT} />,
    );
    expect(container.querySelector('.mds-quote-card-actions')).toBeNull();
  });

  it('rejected: secondary text, neutral badge, no buttons (§4.2 item 4)', () => {
    const { container } = render(
      <QuoteCard label="أ" value={3} state="rejected" accept={ACCEPT} reject={REJECT} />,
    );
    expect(container.querySelector('.mds-quote-card--rejected')).not.toBeNull();
    expect(container.querySelector('.mds-status-badge')?.textContent).toContain(ar['quote.rejected'].text);
    expect(container.querySelector('.mds-quote-card-actions')).toBeNull();
  });

  it('the aria reads offer, approved, price and outcome (§4.2 item 7)', () => {
    render(<QuoteCard label="عمر الزعبي" value={3} />);
    const label = screen.getByRole('group').getAttribute('aria-label') ?? '';
    expect(label).toContain('عرض من عمر الزعبي');
    expect(label).toContain('معتمد');
    expect(label).toContain('3');
  });
});
