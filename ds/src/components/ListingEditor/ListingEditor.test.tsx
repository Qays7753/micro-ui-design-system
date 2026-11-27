import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { ListingEditor } from './ListingEditor';

/** use-press activates on pointerup-after-down; onClick buttons need the
 *  click too — fire the full trio like a real tap. */
const press = (el: Element) => {
  fireEvent.pointerDown(el, { button: 0, pointerType: 'touch', pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.pointerUp(el, { button: 0, pointerType: 'touch', pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.click(el, { button: 0 });
};

describe('ListingEditor (BATCH2-SPECS §5.6)', () => {
  it('renders every field in order and the ONE primary (ق1)', () => {
    render(<ListingEditor onDismiss={() => {}} />);
    expect(screen.getByText(ar['editor.listingName'].text)).not.toBeNull();
    expect(screen.getByText(ar['editor.unit'].text)).not.toBeNull();
    expect(screen.getByText(ar['editor.available'].text)).not.toBeNull();
    expect(screen.getByText(ar['editor.description'].text)).not.toBeNull();
    const primaries = document.querySelectorAll('.mds-action-bar-primary');
    expect(primaries.length).toBe(1);
    expect(primaries[0].textContent).toBe(ar['editor.sendReview'].text);
  });

  it('editing: the title and button switch (§5.6 item 8)', () => {
    render(<ListingEditor editing onDismiss={() => {}} />);
    expect(document.querySelector('.mds-sheet')?.getAttribute('aria-label')).toBe(ar['editor.editTitle'].text);
    expect(document.querySelector('.mds-action-bar-primary')?.textContent).toBe(ar['editor.sendEdit'].text);
  });

  it('tiers mode swaps the price field for the builder node', () => {
    render(
      <ListingEditor onDismiss={() => {}} tiers={<div data-tier-builder />} />,
    );
    expect(document.querySelector('[data-tier-builder]')).toBeNull();
    const segs = screen.getAllByRole('button').filter(b => b.textContent === ar['editor.tiers'].text);
    press(segs[0]);
    expect(document.querySelector('[data-tier-builder]')).not.toBeNull();
  });

  it('send with empty fields shows the errors (§5.6 item 4)', () => {
    render(<ListingEditor onDismiss={() => {}} />);
    press(document.querySelector('.mds-action-bar-primary')!);
    expect(screen.getAllByText(ar['editor.nameRequired'].text).length).toBeGreaterThan(0);
  });

  it('send with a full draft fires onChange', () => {
    const onChange = vi.fn();
    render(<ListingEditor onDismiss={() => {}} onChange={onChange} draft={{ label: 'طحين', unit: 'كيس', price: 2 }} />);
    press(document.querySelector('.mds-action-bar-primary')!);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ label: 'طحين', mode: 'single' }));
  });
});
