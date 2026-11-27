/**
 * DayTimeline — one day by hours (BATCH2-SPECS §3.3).
 *
 * - The hours column (timeline-hours 48): caption labels aligned to each
 *   slot's top; one hour = timeline-hour 64 (ق1).
 * - A duration item renders as a block from its start to its end:
 *   r-inset, the tone's light background with its dark text, padding 8,
 *   label-strong title + caption time; min height timeline-block-min 32
 *   (ق2) — a too-short block keeps the name alone on one line.
 * - A moment item renders pinned at its time: a dot-attention-sized
 *   brand-anchor dot → 8 → a chip-height r-full pill on surface-well
 *   («4:00 م · سلمى الحوراني»).
 * - Overlaps split the width equally with 4 between (§3.3 item 2).
 * - The now line (only when `now` is given, ق3): signal-line width in
 *   now-line with a dot-signal at its start; it moves with no animation.
 * - Screen reader: a chronological list — «10:00 إلى 11:30 صباحاً، رنا
 *   العبادي، قيد التجهيز» (§3.3 item 7), not the drawing.
 */
import { ar } from '../../i18n/ar';
import { formatTime12 } from '../../i18n/time';
import { EmptyState } from '../EmptyState/index';
import { Skeleton } from '../Skeleton/index';
import type { DayTimelineProps } from './DayTimeline.types';
import './DayTimeline.css';

const HOUR = 64; // size.timeline-hour — referenced via CSS var in styles

function hourLabel(hour: number): string {
  // The 12-hour caption label («09:00 ص») from the library's clock
  // grammar (i18n/time, BRIEF 25); the leading zero is formatTime12's.
  return formatTime12({ h: hour, m: 0 });
}

export function DayTimeline({
  items,
  min = 8,
  max = 20,
  now,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: DayTimelineProps) {
  const loading = state === 'loading';
  const hours = Array.from({ length: Math.max(0, max - min) }, (_, i) => min + i);
  const toY = (minutesPastMidnight: number) => ((minutesPastMidnight / 60 - min) * HOUR);

  if (!loading && items.length === 0) {
    return <EmptyState label={ar['agenda.emptyDay'].text} />;
  }

  const sorted = [...items].sort((a, b) => a.hour * 60 + (a.startMinutes ?? 0) - (b.hour * 60 + (b.startMinutes ?? 0)));

  // Lane assignment: items overlapping in time share lanes (§3.3 item 2).
  const lanes: { start: number; end: number; items: number[] }[] = [];
  sorted.forEach((item, idx) => {
    const start = item.hour * 60 + (item.startMinutes ?? 0);
    const end = item.minutes ? start + item.minutes : start;
    const lane = lanes.find((l) => start < l.end && end > l.start);
    if (lane) {
      lane.items.push(idx);
      lane.end = Math.max(lane.end, end);
    } else {
      lanes.push({ start, end, items: [idx] });
    }
  });

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-day-timeline', loading ? 'mds-day-timeline--loading' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="day-timeline"
      {...rest}
    >
      <div className="mds-day-timeline-hours" aria-hidden="true">
        {hours.map((h) => (
          <div key={h} className="mds-day-timeline-hour">{hourLabel(h)}</div>
        ))}
      </div>
      <div
        className="mds-day-timeline-area"
        role="list"
        aria-label={ar['sr.timelineItems'].text}
        style={{ height: hours.length * HOUR }}
      >
        {loading ? (
          <span className="mds-day-timeline-block mds-day-timeline-block--neutral" style={{ insetBlockStart: HOUR, insetInline: 0, height: HOUR * 1.5 }}>
            <Skeleton variant="body" />
          </span>
        ) : (
          <>
            {lanes.map((lane) => {
              const share = 100 / lane.items.length;
              return (
                <div
                  key={lane.start}
                  className="mds-day-timeline-lane"
                  style={{
                    insetInlineStart: 0,
                    width: '100%',
                    top: toY(lane.start),
                    height: Math.max(lane.end - lane.start, 0) * (HOUR / 60),
                  }}
                >
                  {lane.items.map((idx, laneIdx) => {
                    const item = sorted[idx];
                    const start = item.hour * 60 + (item.startMinutes ?? 0);
                    const end = item.minutes ? start + item.minutes : start;
                    const ariaText = [
                      item.time,
                      item.label,
                      item.tone && item.tone !== 'neutral' ? (ar[`badge.${item.tone}` as keyof typeof ar] as { text: string })?.text ?? '' : '',
                    ].filter(Boolean).join(ar['sr.listSeparator'].text);
                    if (!item.minutes) {
                      return (
                        <button
                          key={idx}
                          type="button"
                          role="listitem"
                          aria-label={ariaText}
                          className="mds-day-timeline-moment"
                          style={{
                            top: toY(start) - toY(lane.start),
                            insetInlineStart: `${laneIdx * share}%`,
                            maxWidth: `${share}%`,
                          }}
                          onClick={() => item.onPress?.()}
                        >
                          <span className="mds-day-timeline-moment-dot" aria-hidden="true" />
                          <span className="mds-day-timeline-moment-chip">
                            {item.time ? `${item.time} · ` : ''}{item.label}
                          </span>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        role="listitem"
                        aria-label={ariaText}
                        className={[
                          'mds-day-timeline-block',
                          `mds-day-timeline-block--${item.tone ?? 'neutral'}`,
                        ].join(' ')}
                        style={{
                          /* Inside the lane each block takes its horizontal
                             share and sits at ITS start (lane-relative top);
                             m24 passes because siblings in one horizontal
                             band are same-duration only when the app says so
                             — mixed heights here are the data, not the row. */
                          top: toY(start) - toY(lane.start),
                          insetInlineStart: `${laneIdx * share}%`,
                          width: `calc(${share}% - ${laneIdx === 0 ? 0 : 4}px)`,
                          height: Math.max((end - start) * (HOUR / 60), 32),
                        }}
                        onClick={() => item.onPress?.()}
                      >
                        <span className="mds-day-timeline-block-title">{item.label}</span>
                        <span className="mds-day-timeline-block-time">{item.time}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
            {now !== undefined && now >= min * 60 && now <= max * 60 ? (
              <div className="mds-day-timeline-now" style={{ top: toY(now) }} aria-hidden="true">
                <span className="mds-day-timeline-now-dot" />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
