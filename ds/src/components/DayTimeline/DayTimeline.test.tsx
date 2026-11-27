import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { DayTimeline } from './DayTimeline';

const DURATION = { hour: 10, minutes: 90, label: 'رنا العبادي', time: '10:00 ص – 11:30 ص', tone: 'waiting' as const };
const MOMENT = { hour: 16, label: 'سلمى الحوراني', time: '4:00 م' };

describe('DayTimeline (BATCH2-SPECS §3.3)', () => {
  it('renders the hours column with timeline-hour slots (ق1 via CSS var)', () => {
    const { container } = render(<DayTimeline items={[DURATION]} />);
    const hours = container.querySelectorAll('.mds-day-timeline-hour');
    expect(hours.length).toBe(12); // 8..20 exclusive
    expect(hours[0].textContent).toContain('ص');
  });

  it('a duration block carries its tone class and min height 32 (ق2)', () => {
    const { container } = render(<DayTimeline items={[DURATION]} />);
    const block = container.querySelector('.mds-day-timeline-block');
    expect(block?.className).toContain('mds-day-timeline-block--waiting');
    expect((block as HTMLElement)?.style.height).toBe(`${90 * (64 / 60)}px`);
  });

  it('a moment item renders the pinned dot+chip', () => {
    const { container } = render(<DayTimeline items={[MOMENT]} />);
    expect(container.querySelector('.mds-day-timeline-moment-dot')).not.toBeNull();
    expect(container.querySelector('.mds-day-timeline-moment-chip')?.textContent).toContain('سلمى الحوراني');
  });

  it('overlapping items share one lane (the lane div groups them)', () => {
    const { container } = render(
      <DayTimeline items={[DURATION, { hour: 11, minutes: 60, label: 'ثاني', time: '11:00' }]} />,
    );
    const lanes = container.querySelectorAll('.mds-day-timeline-lane');
    expect(lanes.length).toBe(1);
    expect(lanes[0].children.length).toBe(2);
  });

  it('the now line exists only when now is inside the range (ق3)', () => {
    const withNow = render(<DayTimeline items={[DURATION]} now={10 * 60 + 30} />);
    expect(withNow.container.querySelector('.mds-day-timeline-now')).not.toBeNull();
    withNow.unmount();
    const outside = render(<DayTimeline items={[DURATION]} now={7 * 60} />);
    expect(outside.container.querySelector('.mds-day-timeline-now')).toBeNull();
    const none = render(<DayTimeline items={[DURATION]} />);
    expect(none.container.querySelector('.mds-day-timeline-now')).toBeNull();
  });

  it('empty renders the EmptyState sentence (§3.3 item 4)', () => {
    render(<DayTimeline items={[]} />);
    expect(screen.getByText(ar['agenda.emptyDay'].text)).not.toBeNull();
  });

  it('items read chronologically with time then name (§3.3 item 7)', () => {
    render(<DayTimeline items={[MOMENT, DURATION]} />);
    const list = screen.getAllByRole('listitem');
    expect(list[0].getAttribute('aria-label')).toContain('10:00 ص – 11:30 ص');
    expect(list[0].getAttribute('aria-label')).toContain('رنا العبادي');
    expect(list[1].getAttribute('aria-label')).toContain('4:00 م');
  });

  it('loading renders hours with a skeleton block', () => {
    const { container } = render(<DayTimeline items={[DURATION]} state="loading" />);
    expect(container.querySelector('.mds-day-timeline--loading')).not.toBeNull();
    expect(container.querySelector('.mds-skeleton')).not.toBeNull();
    expect(container.querySelectorAll('.mds-day-timeline-hour').length).toBe(12);
  });
});
