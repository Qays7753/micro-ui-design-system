import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { formatPeriod, normalizePeriod, stepPeriod, weekStartOf } from '../../lib/format-period';
import { PeriodSwitcher } from './PeriodSwitcher';
import type { PeriodValue } from './PeriodSwitcher.types';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function press(button: HTMLElement): void {
  fireEvent.pointerDown(button);
  fireEvent.pointerUp(button);
}

/** The spec's fixed clock: الجمعة 27/11/2026 (§1.27-10's data sits in it). */
function pinToday(): void {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 27, 12, 0, 0));
}

function labelButtonName(spoken: string): string {
  return ar['period.srName'].text.replace('{spoken}', spoken);
}

describe('PeriodSwitcher (BATCH2-SPECS §1.27)', () => {
  it('the month label shows MM/YYYY and speaks the Levantine name (criterion 3)', () => {
    pinToday();
    const { container } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} />,
    );
    expect((container.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('11/2026');
    expect(screen.getByRole('button', { name: labelButtonName('تشرين الثاني 2026') })).not.toBeNull();
  });

  it('the spec\'s data: 11/2026, then 10/2026 after «السابق» (§1.27-10)', () => {
    pinToday();
    const onChange = vi.fn();
    const { rerender, container } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} onChange={onChange} />,
    );
    press(screen.getByRole('button', { name: ar['period.srMonthPrev'].text }));
    expect(onChange).toHaveBeenCalledWith({ size: 'month', start: '01/10/2026' });
    rerender(<PeriodSwitcher value={{ size: 'month', start: '01/10/2026' }} />);
    expect((container.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('10/2026');
  });

  it('the week label «22/11 – 28/11» and the week starts at weekStart (criterion 4)', () => {
    pinToday();
    // 27/11/2026 is a FRIDAY; weekStart 0 (Sunday, the owner's decision
    // 1.1) → the week 22/11–28/11. The spec's «23/11 – 29/11» is the
    // FORM example (DD/MM – DD/MM), not the alignment — ق4 and the
    // DatePicker's criterion 3 pin the week to weekStart.
    const { container } = render(
      <PeriodSwitcher value={{ size: 'week', start: '27/11/2026' }} weekStart={0} />,
    );
    expect((container.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('22/11 – 28/11');
    const { container: c2 } = render(
      <PeriodSwitcher value={{ size: 'week', start: '27/11/2026' }} weekStart={6} />,
    );
    // weekStart 6 (Saturday): the week containing Friday 27/11 starts Saturday 21/11
    expect((c2.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('21/11 – 27/11');
    expect(weekStartOf({ year: 2026, month: 11, day: 27 }, 0)).toEqual({ year: 2026, month: 11, day: 22 });
  });

  it('the day label «27/11/2026» and «اليوم» when it IS today', () => {
    pinToday();
    const { container, rerender } = render(
      <PeriodSwitcher value={{ size: 'day', start: '26/11/2026' }} />,
    );
    expect((container.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('26/11/2026');
    rerender(<PeriodSwitcher value={{ size: 'day', start: '27/11/2026' }} />);
    expect((container.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('اليوم');
  });

  it('the custom range label «01/11/2026 – 15/11/2026»', () => {
    pinToday();
    const { container } = render(
      <PeriodSwitcher value={{ size: 'custom', start: '01/11/2026', end: '15/11/2026' }} items={['custom']} />,
    );
    expect((container.querySelector('.mds-period-label-text') as HTMLElement).textContent).toBe('01/11/2026 – 15/11/2026');
  });

  it('criterion 1: ONE row — the root carries only the row\'s own controls', () => {
    pinToday();
    const { container } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/10/2026' }} />,
    );
    const row = container.querySelector('.mds-period-switcher') as HTMLElement;
    // prev + label + next + the jump button + the polite region — nothing else
    expect(row.children.length).toBe(5);
    expect(row.querySelectorAll('.mds-icon-button')).toHaveLength(2);
    expect(row.querySelectorAll('.mds-button')).toHaveLength(1);
  });

  it('criterion 2: «الحالية» absent in the current period, present outside — and it jumps', () => {
    pinToday();
    const onChange = vi.fn();
    const { rerender } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} onChange={onChange} />,
    );
    expect(screen.queryByRole('button', { name: ar['period.thisMonth'].text })).toBeNull();
    rerender(<PeriodSwitcher value={{ size: 'month', start: '01/10/2026' }} onChange={onChange} />);
    press(screen.getByRole('button', { name: ar['period.thisMonth'].text }));
    expect(onChange).toHaveBeenCalledWith({ size: 'month', start: '01/11/2026' });
  });

  it('the day and week jump words: «اليوم» and «هذا الأسبوع»', () => {
    pinToday();
    const { rerender } = render(
      <PeriodSwitcher value={{ size: 'day', start: '26/11/2026' }} />,
    );
    expect(screen.getByRole('button', { name: ar['period.today'].text })).not.toBeNull();
    rerender(<PeriodSwitcher value={{ size: 'week', start: '16/11/2026' }} />);
    expect(screen.getByRole('button', { name: ar['period.thisWeek'].text })).not.toBeNull();
  });

  it('«التالي» disables at max (§1.27-4)', () => {
    pinToday();
    const { container } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} max="30/11/2026" />,
    );
    const next = container.querySelectorAll('.mds-icon-button')[1] as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    const { container: c2 } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} />,
    );
    expect((c2.querySelectorAll('.mds-icon-button')[1] as HTMLButtonElement).disabled).toBe(false);
  });

  it('the label button opens the size sheet; a segment resizes on the same start and closes (§1.27-2)', () => {
    pinToday();
    const onChange = vi.fn();
    render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} onChange={onChange} />,
    );
    press(screen.getByRole('button', { name: labelButtonName('تشرين الثاني 2026') }));
    expect(screen.getByRole('group', { name: ar['period.sizeGroup'].text })).not.toBeNull();
    press(screen.getByRole('button', { name: ar['period.week'].text }));
    // month start 01/11/2026 is a Sunday → the week 01/11–07/11
    expect(onChange).toHaveBeenCalledWith({ size: 'week', start: '01/11/2026' });
    // the sheet closed after the pick
    expect(screen.queryByRole('group', { name: ar['period.sizeGroup'].text })).toBeNull();
  });

  it('single-size items: the label is NOT a button and no size sheet (the DatePicker month-only anatomy)', () => {
    pinToday();
    const { container } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} items={['month']} />,
    );
    const label = container.querySelector('.mds-period-label') as HTMLElement;
    expect(label.tagName).toBe('SPAN');
    expect(container.querySelector('.mds-period-label--button')).toBeNull();
    // the arrows still work (the DatePicker sheet's month navigation)
    cleanup();
    const onChange = vi.fn();
    render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} items={['month']} onChange={onChange} />,
    );
    press(screen.getByRole('button', { name: ar['period.srMonthPrev'].text }));
    expect(onChange).toHaveBeenCalledWith({ size: 'month', start: '01/10/2026' });
  });

  it('the custom row arms the range mode and shows «اعرض الفترة» only then (§1.27-2)', () => {
    pinToday();
    render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} items={['day', 'week', 'month', 'custom']} />,
    );
    expect(screen.queryByRole('button', { name: ar['period.apply'].text })).toBeNull();
    press(screen.getByRole('button', { name: labelButtonName('تشرين الثاني 2026') }));
    press(screen.getByRole('button', { name: ar['period.custom'].text }));
    const apply = screen.getByRole('button', { name: ar['period.apply'].text }) as HTMLButtonElement;
    expect(apply).not.toBeNull();
    // no range can complete before the MonthGrid wiring (4.15) — the bar stays disabled
    expect(apply.disabled).toBe(true);
  });

  it('the custom row does not render when items omits custom (the lab\'s interim)', () => {
    pinToday();
    render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} />,
    );
    press(screen.getByRole('button', { name: labelButtonName('تشرين الثاني 2026') }));
    expect(screen.queryByRole('button', { name: ar['period.custom'].text })).toBeNull();
  });

  it('every change announces the spoken period politely (§1.27-7)', () => {
    pinToday();
    const { container, rerender } = render(
      <PeriodSwitcher value={{ size: 'month', start: '01/11/2026' }} />,
    );
    const live = container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(live.textContent).toBe('تشرين الثاني 2026');
    rerender(<PeriodSwitcher value={{ size: 'month', start: '01/10/2026' }} />);
    expect(live.textContent).toBe('تشرين الأول 2026');
  });

  it('formatPeriod: the spoken week and range forms', () => {
    pinToday();
    const week = formatPeriod({ size: 'week', start: '23/11/2026' }, 0);
    // 23/11 is a Monday — the grid snaps the week to its Sunday 22/11
    expect(week.text).toBe('22/11 – 28/11');
    expect(week.spoken).toBe('22 تشرين الثاني إلى 28 تشرين الثاني 2026');
    const custom = formatPeriod({ size: 'custom', start: '01/11/2026', end: '15/11/2026' }, 0);
    expect(custom.spoken).toBe('1 تشرين الثاني إلى 15 تشرين الثاني 2026');
    const crossing = formatPeriod({ size: 'custom', start: '29/11/2026', end: '05/12/2026' }, 0);
    expect(crossing.spoken).toBe('29 تشرين الثاني إلى 5 كانون الأول 2026');
  });

  it('stepPeriod: the custom range steps by its own length (the documented reading)', () => {
    const value: PeriodValue = { size: 'custom', start: '01/11/2026', end: '15/11/2026' };
    expect(stepPeriod(value, 0, 1)).toEqual({
      size: 'custom',
      start: '16/11/2026',
      end: '30/11/2026',
    });
  });

  it('normalizePeriod: the week snaps to its weekStart boundary (criterion 4)', () => {
    expect(normalizePeriod({ size: 'week', start: '27/11/2026' }, 0)).toEqual({
      size: 'week',
      start: '22/11/2026',
    });
    expect(normalizePeriod({ size: 'month', start: '27/11/2026' }, 0)).toEqual({
      size: 'month',
      start: '01/11/2026',
    });
  });
});
