import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { AgendaList } from './AgendaList';

const DAYS = [
  {
    label: 'اليوم · خميس 27/11',
    rows: [
      { label: 'خالد الزعبي', caption: 'تفصيل قميص', time: '11:05 ص', tone: 'done' as const },
      { label: 'سلمى الحوراني', caption: 'جلسة قياس', time: '11:00 ص' },
    ],
  },
  {
    label: 'غداً · جمعة 28/11',
    rows: [
      { label: 'رنا العبادي', caption: 'فستان خطوبة مقاس 38', time: '10:00 ص', tone: 'waiting' as const },
      { label: 'أبو محمد', caption: 'مرايل عمل × 6', time: '—' },
    ],
  },
];

describe('AgendaList (BATCH2-SPECS §3.4)', () => {
  it('renders one heading per day with its row count', () => {
    render(<AgendaList items={DAYS} />);
    expect(screen.getByText('اليوم · خميس 27/11')).not.toBeNull();
    expect(screen.getByText('غداً · جمعة 28/11')).not.toBeNull();
    expect(document.querySelectorAll('.mds-agenda-list-count').length).toBe(2);
  });

  it('no heading without rows (ق1): empty days are dropped', () => {
    render(<AgendaList items={[...DAYS, { label: 'فارغ', rows: [] }]} />);
    expect(screen.queryByText('فارغ')).toBeNull();
    expect(document.querySelectorAll('.mds-agenda-list-heading').length).toBe(2);
  });

  it('rows render with mark, name, content, time and badge', () => {
    const { container } = render(<AgendaList items={DAYS} />);
    expect(container.querySelectorAll('.mds-object-row').length).toBe(4);
    expect(container.querySelector('.mds-entity-mark')).not.toBeNull();
    expect(container.querySelector('.mds-status-badge')).not.toBeNull();
    expect(screen.getByText('مرايل عمل × 6')).not.toBeNull();
  });

  it('rows keep the given (time) order (ق2)', () => {
    const { container } = render(<AgendaList items={DAYS} />);
    const names = [...container.querySelectorAll('.mds-object-row-title')].map((n) => n.textContent);
    expect(names).toEqual(['خالد الزعبي', 'سلمى الحوراني', 'رنا العبادي', 'أبو محمد']);
  });

  it('fully empty renders the EmptyState with no button (§3.4 item 4)', () => {
    const { container } = render(<AgendaList items={[]} />);
    expect(screen.getByText(ar['agenda.emptyAll'].text)).not.toBeNull();
    expect(container.querySelector('button')).toBeNull();
  });

  it('loading renders skeleton groups with no real rows', () => {
    const { container } = render(<AgendaList items={DAYS} state="loading" />);
    expect(container.querySelector('.mds-agenda-list--loading')).not.toBeNull();
    expect(container.querySelector('.mds-agenda-list-heading')).toBeNull();
    expect(container.querySelectorAll('.mds-skeleton').length).toBeGreaterThan(0);
  });

  it('the day heading is a real heading (§3.4 item 7)', () => {
    render(<AgendaList items={DAYS} />);
    const h = document.querySelector('.mds-agenda-list-heading');
    expect(h?.tagName).toBe('H4');
  });
});
