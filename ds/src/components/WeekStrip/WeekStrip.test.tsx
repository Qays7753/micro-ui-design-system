import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { WeekStrip } from './WeekStrip';

const WEEK = [
  { date: '2026-11-22', items: 1 },
  { date: '2026-11-23', items: 2 },
  { date: '2026-11-24' },
  { date: '2026-11-25', items: 3 },
  { date: '2026-11-26', items: 5 },
  { date: '2026-11-27', items: 3 },
  { date: '2026-11-28' },
];

describe('WeekStrip (BATCH2-SPECS §3.2)', () => {
  it('renders the seven days ordered from weekStart (الأحد أولًا)', () => {
    render(<WeekStrip items={WEEK} />);
    // 22/11/2026 is a Sunday (owner-corrected data: the week runs 22..28)
    const first = screen.getAllByRole('radio')[0];
    expect(first.getAttribute('aria-label')).toContain(ar['day.0'].text);
  });

  it('no leading zero in the date number (ق2)', () => {
    render(<WeekStrip items={WEEK} />);
    const marks = document.querySelectorAll('.mds-week-strip-mark');
    expect([...marks].map((m) => m.textContent)).toEqual(['22', '23', '24', '25', '26', '27', '28']);
  });

  it('today ring class only on the today cell (ق3)', () => {
    render(<WeekStrip items={WEEK} today="2026-11-27" />);
    const todayCells = document.querySelectorAll('.mds-week-strip-day--today');
    expect(todayCells.length).toBe(1);
    expect(todayCells[0].querySelector('.mds-week-strip-mark')?.textContent).toBe('27');
  });

  it('selected fills the circle; today ring stays when selected', () => {
    render(<WeekStrip items={WEEK} value="2026-11-27" today="2026-11-27" />);
    const cell = document.querySelector('.mds-week-strip-day--selected');
    expect(cell).not.toBeNull();
    expect(cell?.className).toContain('mds-week-strip-day--today');
  });

  it('up to 3 dots; 4+ renders the count', () => {
    render(<WeekStrip items={WEEK} />);
    const dotsPerCell = [...document.querySelectorAll('.mds-week-strip-day')].map(
      (c) => c.querySelectorAll('.mds-week-strip-dot').length,
    );
    expect(dotsPerCell).toEqual([1, 2, 0, 3, 0, 3, 0]);
    const counts = [...document.querySelectorAll('.mds-week-strip-count')].map((c) => c.textContent);
    expect(counts).toEqual(['5']);
  });

  it('loading keeps the days, drops the dots (§3.2 item 4)', () => {
    render(<WeekStrip items={WEEK} state="loading" />);
    expect(document.querySelectorAll('.mds-week-strip-day').length).toBe(7);
    expect(document.querySelectorAll('.mds-week-strip-dot').length).toBe(0);
  });

  it('pressing a day fires onChange with its date', () => {
    let picked = '';
    render(<WeekStrip items={WEEK} onChange={(d) => { picked = d; }} />);
    fireEvent.click(screen.getAllByRole('radio')[4]);
    expect(picked).toBe('2026-11-26');
  });

  it('the radiogroup cells read day, date, today and items', () => {
    render(<WeekStrip items={WEEK} today="2026-11-27" />);
    const cell = screen.getAllByRole('radio')[4];
    const label = cell.getAttribute('aria-label') ?? '';
    expect(label).toContain(ar['day.4'].text); // الخميس 26
    expect(label).toContain('26');
  });
});
