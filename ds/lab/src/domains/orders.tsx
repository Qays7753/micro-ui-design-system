/**
 * orders.tsx — the B2 orders & appointments wing of the domains lab
 * (plan B). Every interactive example owns real state (owner note §1).
 * Sections: the five components + the orders compose page (§3.7).
 *
 * The compose page builds only what exists on this branch; SegmentedControl
 * and FilterChips come from batch 1; PeriodSwitcher, PartyPicker,
 * DatePicker, TimePicker, DurationPicker and the new-order sheet's
 * stage-4 pieces do NOT exist yet — their places are left and listed in
 * REPORT-B under «يُكمَّل بعد الدمج».
 */
import { useState } from 'react';
import {
  AgendaList, AskButton, Button, ContextBar, DayTimeline, FilterChips,
  IconButton, NotificationsButton, OrderCard, PageHeader, ProjectSwitcher, SearchField,
  Section, SegmentedControl, SlotPicker, Surface, TabBar, TabBarTab, WeekStrip,
  ar, t,
} from '@micro/ds';
import type { DomainSection } from './index';

const WEEK = [
  { date: '2026-11-22', items: 1 },
  { date: '2026-11-23', items: 2 },
  { date: '2026-11-24' },
  { date: '2026-11-25', items: 3 },
  { date: '2026-11-26', items: 5 },
  { date: '2026-11-27', items: 3 },
  { date: '2026-11-28' },
];

function OrderCardGarden() {
  const [deliveries, setDeliveries] = useState(0);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <OrderCard
          label="سلمى الحوراني"
          caption="فستان سهرة × 2"
          value={45}
          time="التسليم اليوم 4:00 م"
          tone="done"
          action={<Button variant="secondary" size="sm" onPress={() => setDeliveries(deliveries + 1)}>{ar['order.deliver'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('order.duration')}</span>
        <OrderCard
          label="رنا العبادي"
          caption="فستان خطوبة مقاس 38"
          value={120}
          time="اليوم 10:00 ص – 11:30 ص"
          tone="waiting"
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['badge.cancelled'].text}</span>
        <OrderCard label="أبو محمد (بقالة النور)" caption="ستائر محل" value={60} cancelled />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <OrderCard label="…" value={1} state="loading" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['order.deliver'].text}: <bdi dir="ltr">{deliveries}</bdi></span></div>
    </div>
  );
}

function WeekStripGarden() {
  const [picked, setPicked] = useState('2026-11-27');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <WeekStrip items={WEEK} value={picked} today="2026-11-27" onChange={setPicked} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <WeekStrip items={WEEK} state="loading" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.selected')}: {picked}</span></div>
    </div>
  );
}

function DayTimelineGarden() {
  const [opened, setOpen] = useState('');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <DayTimeline
          now={11 * 60 + 10}
          items={[
            { hour: 10, minutes: 90, label: 'رنا العبادي', time: '10:00 ص – 11:30 ص', tone: 'waiting', onPress: () => setOpen('رنا') },
            { hour: 11, minutes: 60, label: 'قياس ثانٍ', time: '11:30 – 12:30', tone: 'info', onPress: () => setOpen('ثانٍ') },
            { hour: 16, label: 'سلمى الحوراني', time: '4:00 م', onPress: () => setOpen('سلمى') },
          ]}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.empty')}</span>
        <DayTimeline items={[]} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.opened')}: {opened}</span></div>
    </div>
  );
}

function AgendaListGarden() {
  const [opened, setOpen] = useState('');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <AgendaList
          items={[
            {
              label: 'اليوم · خميس 27/11',
              rows: [
                { label: 'خالد الزعبي', caption: 'تفصيل قميص', time: '11:05 ص', tone: 'done', onPress: () => setOpen('خالد') },
                { label: 'سلمى الحوراني', caption: 'جلسة قياس', time: '11:00 ص', onPress: () => setOpen('سلمى') },
              ],
            },
            {
              label: 'غداً · جمعة 28/11',
              rows: [
                { label: 'رنا العبادي', caption: 'فستان خطوبة مقاس 38', time: '10:00 ص', tone: 'waiting', onPress: () => setOpen('رنا') },
                { label: 'أبو محمد (بقالة النور)', caption: 'مرايل عمل × 6', time: '—', onPress: () => setOpen('أبو محمد') },
              ],
            },
          ]}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.empty')}</span>
        <AgendaList items={[]} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.opened')}: {opened}</span></div>
    </div>
  );
}

function SlotPickerGarden() {
  const [slot, setSlot] = useState('4:00 م');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <SlotPicker
          items={[
            { label: ar['slot.morning'].text, slots: ['9:00 ص', '10:30 ص', '11:00 ص'], disabled: ['10:30 ص'] },
            { label: ar['slot.evening'].text, slots: ['4:00 م', '5:30 م', '6:00 م'] },
          ]}
          value={slot}
          onChange={setSlot}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.empty')}</span>
        <SlotPicker items={[{ label: ar['slot.morning'].text, slots: [] }]} value="" onChange={() => {}} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.selected')}: {slot}</span></div>
    </div>
  );
}

function OrdersCompose() {
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [chips, setChips] = useState<string[]>(['all']);
  const [picked, setPicked] = useState('2026-11-27');
  const [search, setSearch] = useState(false);
  return (
    <div className="lab-compose-screen" data-ds-check="orders-compose">
      <ContextBar
        label={t('sr.switchProject')}
        leading={<ProjectSwitcher label="ورشة الياسمين للخياطة" caption={ar['role.owner'].text} onPress={() => setView(view)} />}
        trailing={<><NotificationsButton value={3} onPress={() => setView(view)} /><AskButton onPress={() => setView(view)} /></>}
      />
      <PageHeader label={t('nav.orders')} />
      <SegmentedControl
        label={t('nav.orders')}
        leading={[{ value: 'list', label: ar['orders.listView'].text }, { value: 'calendar', label: ar['orders.calendarView'].text }]}
        value={view}
        onChange={(v) => setView(v as 'list' | 'calendar')}
      />
      {view === 'list' ? (
        <>
          {search ? (
            <SearchField label={t('title.searchField')} value="" onChange={() => {}} />
          ) : (
            <FilterChips
              leading={[
                { value: 'all', label: ar['orders.all'].text },
                { value: 'needs', label: t('title.needsYou') },
                { value: 'active', label: ar['orders.active'].text },
                { value: 'log', label: ar['orders.log'].text },
              ]}
              value={chips}
              onChange={setChips}
              label={t('nav.orders')}
            />
          )}
          <IconButton label={search ? ar['button.back'].text : t('title.searchField')} onPress={() => setSearch(!search)} className="lab-key" />
          <Section label={t('title.needsYou')} caption={2}>
            <OrderCard label="سلمى الحوراني" caption="فستان سهرة" value={45} time="التسليم اليوم 4:00 م" tone="done" />
            <OrderCard label="خالد الزعبي" caption="بدلة كاملة" value={120} time="غداً 12:00 م" tone="problem" />
          </Section>
          <Section label={ar['orders.active'].text} caption={2}>
            <Surface>
              <OrderCard label="رنا العبادي" caption="فستان خطوبة مقاس 38" value={120} time="غداً 10:00 ص" tone="waiting" />
              <OrderCard label="أبو محمد (بقالة النور)" caption="مرايل عمل × 6" value={36} time="غداً" tone="waiting" />
            </Surface>
          </Section>
        </>
      ) : (
        <>
          {/* PeriodSwitcher (stage 4) غير موجود بعد — موضعه يُكمَّل بعد الدمج */}
          <WeekStrip items={WEEK} value={picked} today="2026-11-27" onChange={setPicked} />
          <DayTimeline
            now={11 * 60 + 10}
            items={[
              { hour: 10, minutes: 90, label: 'رنا العبادي', time: '10:00 ص – 11:30 ص', tone: 'waiting' },
              { hour: 16, label: 'سلمى الحوراني', time: '4:00 م' },
            ]}
          />
        </>
      )}
      <TabBar>
        <TabBarTab label={t('nav.today')} onPress={() => setView('list')} />
        <TabBarTab label={t('nav.orders')} onPress={() => setView('calendar')} />
        <TabBarTab label={t('nav.finance')} onPress={() => setView('list')} />
        <TabBarTab label={t('nav.market')} onPress={() => setView('calendar')} />
      </TabBar>
    </div>
  );
}

export const ordersSections: DomainSection[] = [
  { id: 'order-card', name: t('lab.h.orderCard'), content: <OrderCardGarden /> },
  { id: 'week-strip', name: t('lab.h.weekStrip'), content: <WeekStripGarden /> },
  { id: 'day-timeline', name: t('lab.h.dayTimeline'), content: <DayTimelineGarden /> },
  { id: 'agenda-list', name: t('lab.h.agendaList'), content: <AgendaListGarden /> },
  { id: 'slot-picker', name: t('lab.h.slotPicker'), content: <SlotPickerGarden /> },
  { id: 'orders-compose', name: t('lab.h.ordersCompose'), content: <OrdersCompose /> },
];
