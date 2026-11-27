import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { SlotPicker } from './SlotPicker';

const GROUPS = [
  { label: 'صباحاً', slots: ['9:00 ص', '10:30 ص', '11:00 ص'], disabled: ['10:30 ص'] },
  { label: 'مساءً', slots: ['4:00 م', '5:30 م', '6:00 م'] },
];

describe('SlotPicker (BATCH2-SPECS §3.6)', () => {
  it('renders the labelled groups as radiogroups', () => {
    render(<SlotPicker items={GROUPS} value="" onChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: 'صباحاً' })).not.toBeNull();
    expect(screen.getByRole('radiogroup', { name: 'مساءً' })).not.toBeNull();
    expect(screen.getAllByRole('radio').length).toBe(6);
  });

  it('at most one selected slot (ق2)', () => {
    render(<SlotPicker items={GROUPS} value="4:00 م" onChange={() => {}} />);
    expect(document.querySelectorAll('[aria-checked="true"]').length).toBe(1);
  });

  it('unavailable slots are disabled with the aria note (§3.6 item 7)', () => {
    render(<SlotPicker items={GROUPS} value="" onChange={() => {}} />);
    const chip = screen.getByRole('radio', { name: `10:30 ص ${ar['sr.slotUnavailable'].text}` });
    expect((chip as HTMLButtonElement).disabled).toBe(true);
  });

  it('pressing a slot fires onChange once with its value', () => {
    let picked = '';
    render(<SlotPicker items={GROUPS} value="" onChange={(s) => { picked = s; }} />);
    fireEvent.click(screen.getByRole('radio', { name: '5:30 م' }));
    expect(picked).toBe('5:30 م');
  });

  it('no slots at all renders the EmptyState with no button (§3.6 item 4)', () => {
    const { container } = render(<SlotPicker items={[{ label: 'صباحاً', slots: [] }]} value="" onChange={() => {}} />);
    expect(screen.getByText(ar['slot.empty'].text)).not.toBeNull();
    expect(container.querySelector('button')).toBeNull();
  });

  it('loading keeps the group labels with skeleton chips', () => {
    const { container } = render(<SlotPicker items={GROUPS} value="" onChange={() => {}} state="loading" />);
    expect(screen.getByText('صباحاً')).not.toBeNull();
    expect(container.querySelectorAll('.mds-skeleton').length).toBeGreaterThanOrEqual(6);
    expect(container.querySelector('.mds-slot-picker-grid[role="radiogroup"]')).toBeNull();
  });
});
