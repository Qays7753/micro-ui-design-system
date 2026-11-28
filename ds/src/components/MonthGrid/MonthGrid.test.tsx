import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { MonthGrid } from './MonthGrid';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

/** The spec's fixed clock: الجمعة 27/11/2026 (§3.5-10's data sits in it). */
function pinToday(): void {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 27, 12, 0, 0));
}

/** November 2026: the 1st is a Sunday, 30 days, today the 27th. */
const NOVEMBER = '11/2026';

describe('MonthGrid (BATCH2-SPECS §3.5)', () => {
  it('the grid is named by the month, Levantine (§3.5-7)', () => {
    pinToday();
    render(<MonthGrid month={NOVEMBER} mode="view" />);
    expect(screen.getByRole('grid', { name: 'تشرين الثاني 2026' })).not.toBeNull();
  });

  it('criterion 3: no leading zero — the 1st reads «1»', () => {
    pinToday();
    const { container } = render(<MonthGrid month={NOVEMBER} mode="view" />);
    const numbers = Array.from(container.querySelectorAll('.mds-month-mark-number'));
    expect(numbers.map((el) => el.textContent)).toContain('1');
    expect(numbers.map((el) => el.textContent)).not.toContain('01');
  });

  it('the spec\'s data: 30 days in 11/2026, today 27, selected 30 (§3.5-10)', () => {
    pinToday();
    const { container } = render(
      <MonthGrid month={NOVEMBER} mode="single" value="30/11/2026" />,
    );
    const numbers = Array.from(container.querySelectorAll('.mds-month-mark-number'));
    expect(numbers).toHaveLength(30);
    // today ring on 27, selected on 30
    const todayCell = container.querySelector('[data-day="27/11/2026"]');
    const selectedCell = container.querySelector('[data-day="30/11/2026"]');
    expect(todayCell?.className).toContain('mds-month-cell-button--today');
    expect(selectedCell?.className).toContain('mds-month-cell-button--selected');
  });

  it('out-of-month days render EMPTY cells (the grid structure kept)', () => {
    pinToday();
    const { container } = render(<MonthGrid month="12/2026" mode="view" />);
    // December 2026 starts Tuesday → 2 leading empty cells in the first row
    const firstRow = container.querySelector('.mds-month-week') as HTMLElement;
    expect(firstRow.children.length).toBe(7);
    expect((firstRow.children[0] as HTMLElement).className).toContain('mds-month-cell--empty');
    expect((firstRow.children[1] as HTMLElement).className).toContain('mds-month-cell--empty');
    expect((firstRow.children[2] as HTMLElement).className).not.toContain('mds-month-cell--empty');
  });

  it('up to three dots under the day, and the dot row keeps its height', () => {
    pinToday();
    const { container } = render(
      <MonthGrid month={NOVEMBER} mode="view" items={{ '20/11/2026': 3, '21/11/2026': 0 }} />,
    );
    const dots = container.querySelector('[data-day="20/11/2026"]')
      ?.querySelector('.mds-month-dots') as HTMLElement;
    expect(dots.querySelectorAll('.mds-month-dot')).toHaveLength(3);
    const empty = container.querySelector('[data-day="21/11/2026"]')
      ?.querySelector('.mds-month-dots') as HTMLElement;
    expect(empty.querySelectorAll('.mds-month-dot')).toHaveLength(0);
    // the height stays (the circle never shifts)
    expect(empty.className).toContain('mds-month-dots--empty');
  });

  it('a cell press reports its date (single mode)', () => {
    pinToday();
    const onChange = vi.fn();
    render(<MonthGrid month={NOVEMBER} mode="single" onChange={onChange} />);
    press(screen.getByRole('button', { name: /30 تشرين الثاني، اثنين/ }));
    expect(onChange).toHaveBeenCalledWith('30/11/2026');
  });

  it('days outside min/max disable with disabled-fg (§3.5-4)', () => {
    pinToday();
    const { container } = render(
      <MonthGrid month={NOVEMBER} mode="single" min="20/11/2026" max="28/11/2026" />,
    );
    const before = container.querySelector('[data-day="19/11/2026"]') as HTMLButtonElement;
    const after = container.querySelector('[data-day="29/11/2026"]') as HTMLButtonElement;
    const inside = container.querySelector('[data-day="27/11/2026"]') as HTMLButtonElement;
    expect(before.disabled).toBe(true);
    expect(after.disabled).toBe(true);
    expect(inside.disabled).toBe(false);
  });

  it('range mode: a press starts, the second completes, a third restarts (§3.5-2)', () => {
    pinToday();
    const onChange = vi.fn();
    const { rerender } = render(
      <MonthGrid month={NOVEMBER} mode="range" onChange={onChange} />,
    );
    press(screen.getByRole('button', { name: /2 تشرين الثاني، اثنين/ }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '02/11/2026' });
    // the app writes the draft back — the second press completes it
    rerender(
      <MonthGrid month={NOVEMBER} mode="range" value={{ start: '02/11/2026' }} onChange={onChange} />,
    );
    press(screen.getByRole('button', { name: /5 تشرين الثاني، خميس/ }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '02/11/2026', end: '05/11/2026' });
    // a complete range restarts on the next press
    rerender(
      <MonthGrid
        month={NOVEMBER}
        mode="range"
        value={{ start: '02/11/2026', end: '05/11/2026' }}
        onChange={onChange}
      />,
    );
    press(screen.getByRole('button', { name: /20 تشرين الثاني، جمعة/ }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '20/11/2026' });
  });

  it('range mode: a day before the start restarts the draft there', () => {
    pinToday();
    const onChange = vi.fn();
    render(
      <MonthGrid month={NOVEMBER} mode="range" value={{ start: '10/11/2026' }} onChange={onChange} />,
    );
    press(screen.getByRole('button', { name: /5 تشرين الثاني، خميس/ }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '05/11/2026' });
  });

  it('range visuals: the start and end circles fill, the band joins the in-range cells', () => {
    pinToday();
    const { container } = render(
      <MonthGrid month={NOVEMBER} mode="range" value={{ start: '02/11/2026', end: '04/11/2026' }} />,
    );
    const start = container.querySelector('[data-day="02/11/2026"]') as HTMLElement;
    const middle = container.querySelector('[data-day="03/11/2026"]') as HTMLElement;
    const end = container.querySelector('[data-day="04/11/2026"]') as HTMLElement;
    expect(start.className).toContain('mds-month-cell-button--range-start');
    expect(start.className).toContain('mds-month-cell-button--selected');
    expect(middle.className).toContain('mds-month-cell-button--in-range');
    expect(middle.className).not.toContain('mds-month-cell-button--selected');
    expect(end.className).toContain('mds-month-cell-button--range-end');
  });

  it('view mode: NO buttons at all — nothing selectable', () => {
    pinToday();
    const { container } = render(<MonthGrid month={NOVEMBER} mode="view" />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
    expect(container.querySelectorAll('.mds-month-cell-static')).toHaveLength(30);
  });

  it('the arrow keys walk the cells (§3.5-7) — right = the earlier day in RTL', () => {
    pinToday();
    const { container } = render(<MonthGrid month={NOVEMBER} mode="single" />);
    const day27 = container.querySelector('[data-day="27/11/2026"]') as HTMLElement;
    const day28 = container.querySelector('[data-day="28/11/2026"]') as HTMLElement;
    day28.focus();
    expect(document.activeElement).toBe(day28);
    fireEvent.keyDown(container.querySelector('.mds-month-grid') as HTMLElement, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(day27);
    fireEvent.keyDown(container.querySelector('.mds-month-grid') as HTMLElement, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(day28);
    fireEvent.keyDown(container.querySelector('.mds-month-grid') as HTMLElement, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(container.querySelector('[data-day="21/11/2026"]'));
  });

  it('the first day cell owns the tab stop, the rest are roving', () => {
    pinToday();
    const { container } = render(<MonthGrid month={NOVEMBER} mode="single" />);
    const day1 = container.querySelector('[data-day="01/11/2026"]') as HTMLElement;
    const day2 = container.querySelector('[data-day="02/11/2026"]') as HTMLElement;
    expect((day1 as HTMLButtonElement).tabIndex).toBe(0);
    expect((day2 as HTMLButtonElement).tabIndex).toBe(-1);
  });

  it('weekStart aligns the first column (criterion 4 through the grid)', () => {
    pinToday();
    const { container } = render(<MonthGrid month={NOVEMBER} mode="view" weekStart={6} />);
    // November 2026 starts SUNDAY; weekStart 6 (Saturday) puts the 1st in
    // the week's SECOND column → one leading empty cell
    const firstRow = container.querySelector('.mds-month-week') as HTMLElement;
    let empties = 0;
    for (const child of Array.from(firstRow.children)) {
      if ((child as HTMLElement).className.includes('mds-month-cell--empty')) empties += 1;
    }
    expect(empties).toBe(1);
  });

  it('an invalid month falls back to the current month', () => {
    pinToday();
    const { container } = render(<MonthGrid month="garbage" mode="view" />);
    expect((container.querySelector('.mds-month-grid') as HTMLElement).dataset.month).toBe('11/2026');
  });

  it('the cell name counts its items through the plural rules (§3.5-7)', () => {
    pinToday();
    render(<MonthGrid month={NOVEMBER} mode="single" items={{ '27/11/2026': 3 }} />);
    // 27/11/2026 is a Friday: «27 تشرين الثاني، الجمعة، اليوم، 3 عناصر»
    expect(
      screen.getByRole('button', {
        name: '27 تشرين الثاني، جمعة، اليوم، 3 عناصر',
      }),
    ).not.toBeNull();
    expect(ar['month.srCellCount'].text).toBe('{name}، {counted}');
  });
});
