/**
 * OrdersScreen — «الطلبات» (§2.2.5): the list and the calendar behind the
 * SegmentedControl. The list: the filter chips (real), the «يحتاجك» cards'
 * places (OrderCard — batch-2 markers), the «الجارية» rows (real ObjectRow —
 * the map names them so), and «السجل» (Disclosure marker). The calendar:
 * the PeriodSwitcher / WeekStrip / DayTimeline / AgendaList places, with the
 * week's live per-day counts from §5.2.5.
 */
import {
  FilterChips,
  ObjectRow,
  PageHeader,
  Section,
  SegmentedControl,
  StatusBadge,
  Button,
  EntityMark,
} from '@micro/ds';
import type { ChipOption, SegmentOption } from '@micro/ds';
import { useState } from 'react';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, LaterMark, OwnerTabBar, projectView } from '../parts';
import { SIM_TODAY, WEEK_START, WEEK_END } from '../../data';
import { dateDisplay, time12 } from '../../format';
import type { Order, OrderStatus } from '../../data/types';

/** The order-status badge words (§2.2.1). */
const STATUS: Record<OrderStatus, { tone: 'neutral' | 'info' | 'waiting' | 'done' | 'problem'; label: string }> = {
  draft: { tone: 'neutral', label: 'مسودة' },
  tentative: { tone: 'info', label: 'اتفاق مبدئي' },
  confirmed: { tone: 'info', label: 'مؤكد' },
  inProgress: { tone: 'info', label: 'قيد التنفيذ' },
  ready: { tone: 'waiting', label: 'جاهز' },
  delivered: { tone: 'done', label: 'تم التسليم' },
  settled: { tone: 'done', label: 'تمت التسوية' },
  postponed: { tone: 'neutral', label: 'مؤجل' },
  cancelled: { tone: 'neutral', label: 'ملغى' },
  needsReview: { tone: 'problem', label: 'يحتاج مراجعة' },
};

/** «يحتاجك» order: يحتاج مراجعة ← جاهز ← تم التسليم ← مسودة (§2.2.1). */
const NEEDS_ORDER: readonly OrderStatus[] = ['needsReview', 'ready', 'delivered', 'draft'];

const LIST_FILTERS: readonly ChipOption[] = [
  { value: 'all', label: 'الكل' },
  { value: 'needsYou', label: 'يحتاجك' },
  { value: 'running', label: 'الجارية' },
  { value: 'log', label: 'السجل' },
];

const SEGMENTS: readonly SegmentOption[] = [
  { value: 'list', label: 'القائمة' },
  { value: 'calendar', label: 'التقويم' },
];

function statusOf(o: Order) {
  return STATUS[o.status];
}

/** «الجارية» statuses (§2.2.1's screen groups). */
const RUNNING: readonly OrderStatus[] = ['tentative', 'confirmed', 'inProgress', 'postponed'];
const LOG: readonly OrderStatus[] = ['settled', 'cancelled'];

export function OrdersScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const [filter, setFilter] = useState('all');

  const orders = projectView(state).orders;

  const needsList = NEEDS_ORDER.flatMap((status) =>
    orders
      .filter((o) => o.status === status)
      .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')),
  ).slice(0, 3);
  const running = orders
    .filter((o) => RUNNING.includes(o.status))
    .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  const log = orders.filter((o) => LOG.includes(o.status));

  const show = (group: 'needsYou' | 'running' | 'log') => filter === 'all' || filter === group;

  // The calendar's live week (§5.2.5): الخميس 1، الجمعة 2، السبت 2.
  const weekCounts = (() => {
    const days: Array<{ date: string; orders: Order[] }> = [];
    const start = new Date(`${WEEK_START}T00:00:00`);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      days.push({ date: iso, orders: orders.filter((o) => o.dueDate === iso) });
    }
    return days;
  })();
  const selected = state.ui.selectedDate ?? SIM_TODAY;
  const selectedDay = weekCounts.find((d) => d.date === selected);

  return (
    <div className="sim-screen" data-sim-screen-body="orders">
      <ContextBarShell />
      <PageHeader
        label="الطلبات"
        trailing={
          <Button size="sm" variant="primary" onPress={() => dispatch({ type: 'ui/openSheet', id: 'newOrder' })}>
            طلب جديد
          </Button>
        }
      />
      <SegmentedControl
        leading={SEGMENTS}
        value={state.ui.screen === 'ordersCalendar' ? 'calendar' : 'list'}
        onChange={(v) =>
          dispatch({ type: 'ui/navigate', screen: v === 'calendar' ? 'ordersCalendar' : 'orders' })
        }
        label="طريقة عرض الطلبات"
      />
      <div className="sim-screen__body">
      {state.ui.screen === 'ordersCalendar' ? (
        <>
          <div className="sim-later-inline" data-sim-later="PeriodSwitcher">
            <span className="sim-later__name">يُركَّب لاحقًا: PeriodSwitcher</span>
            <span className="sim-later__note">أسبوع {dateDisplay(WEEK_START)} – {dateDisplay(WEEK_END)}</span>
          </div>
          <div className="sim-later-inline" data-sim-later="WeekStrip">
            <span className="sim-later__name">يُركَّب لاحقًا: WeekStrip</span>
            <span className="sim-later__note">
              {weekCounts
                .filter((d) => d.orders.length)
                .map((d) => `${dateDisplay(d.date)}: ${d.orders.length}`)
                .join(' · ')}
            </span>
          </div>
          {selectedDay && selectedDay.orders.some((o) => o.durationMinutes) ? (
            <div className="sim-later-inline" data-sim-later="DayTimeline">
              <span className="sim-later__name">يُركَّب لاحقًا: DayTimeline</span>
              <span className="sim-later__note">
                {`يوم ${dateDisplay(selectedDay.date)} · فيه موعدًا بمدة: ${selectedDay.orders
                  .filter((o) => o.durationMinutes)
                  .map((o) => `طلب ${o.id} ${time12(o.time)} · ${o.durationMinutes} دقيقة`)
                  .join('، ')}`}
              </span>
            </div>
          ) : (
            <div className="sim-later-inline" data-sim-later="AgendaList">
              <span className="sim-later__name">يُركَّب لاحقًا: AgendaList</span>
              <span className="sim-later__note">
                {selectedDay && selectedDay.orders.length
                  ? `يوم ${dateDisplay(selectedDay.date)}: ${selectedDay.orders.map((o) => o.id).join('، ')}`
                  : 'لا عناصر في اليوم المحدد'}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <FilterChips
            leading={LIST_FILTERS}
            value={[filter]}
            onChange={(v) => setFilter(v[0] ?? 'all')}
            label="حالات الطلبات"
          />
          {show('needsYou') && needsList.length ? (
            <Section label="يحتاجك" caption={needsList.length}>
              <div className="sim-cards">
                {needsList.map((o) => (
                  <LaterMark key={o.id} name="OrderCard" note={`طلب ${o.id} · ${o.customer} · ${o.content} · ${statusOf(o).label}`} />
                ))}
              </div>
            </Section>
          ) : null}
          {show('running') && running.length ? (
            <Section label="الجارية" caption={running.length}>
              <div className="sim-rows">
                {running.map((o) => (
                  <ObjectRow
                    key={o.id}
                    label={`${o.content} · ${o.customer}`}
                    caption={`طلب ${o.id} · ${o.dueDate ? dateDisplay(o.dueDate) : 'بلا موعد'}${o.time ? ` · ${time12(o.time)}` : ''}`}
                    leading={<EntityMark value={o.customer} />}
                    trailing={<StatusBadge tone={statusOf(o).tone} label={statusOf(o).label} />}
                    onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${o.id}` })}
                  />
                ))}
              </div>
            </Section>
          ) : null}
          {show('log') && log.length ? (
            <div className="sim-later-inline" data-sim-later="Disclosure">
              <span className="sim-later__name">يُركَّب لاحقًا: Disclosure</span>
              <span className="sim-later__note">{`«السجل»: ${log.map((o) => `طلب ${o.id} ${statusOf(o).label}`).join('، ')}`}</span>
            </div>
          ) : null}
        </>
      )}
      </div>
      <OwnerTabBar />
    </div>
  );
}
