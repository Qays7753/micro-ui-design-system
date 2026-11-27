/**
 * Shared screen parts (§5.1 عام لكل الأدوار): the internal «يُركَّب لاحقًا»
 * marker (never an invented substitute — the part's PLACE carries the marker
 * until part B mounts the real batch-2 component), the ContextBar shell, the
 * role TabBars, the live «يحتاجك» selectors and the 8.1 weekly-bars drawing
 * the app owns (BATCH2-SPECS §8: the chart is a PATTERN the app draws inside
 * a library Surface, not a library component).
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AskButton,
  ChartIcon,
  ContextBar,
  IconButton,
  Money,
  NotificationsButton,
  ProjectSwitcher,
  Surface,
  TabBar,
  TabBarTab,
  TableIcon,
} from '@micro/ds';
import {
  NavDeliveryIcon,
  NavFinanceIcon,
  NavMarketIcon,
  NavOrdersIcon,
  NavTodayIcon,
} from '@micro/ds';
import { PROJECTS, REEF, SIM_TODAY, FUNDS, fundBalance, totalBalance, visibleListings } from '../data';
import type { Debt, Delivery, Movement, Order } from '../data/types';
import { dateDisplay, time12 } from '../format';
import { useSim, useSimDispatch } from '../state/store';
import type { SimState } from '../state/types';
import type { Screen } from '../state/types';
import { TODAY_LINE } from '../texts';

/** The internal marker at an unbuilt component's place (SA7's rule). */
export function LaterMark({ name, note }: { name: string; note?: ReactNode }) {
  return (
    <div className="sim-later" data-sim-later={name}>
      <span className="sim-later__name">يُركَّب لاحقًا: {name}</span>
      {note ? <span className="sim-later__note">{note}</span> : null}
    </div>
  );
}

/** The date caption line under the اليوم header (10.2 (1)). */
export function ScreenDate() {
  return <p className="sim-screen__date"> {TODAY_LINE} </p>;
}

/** The shared ContextBar (§5.1: المشترك لكل الأدوار). */
export function ContextBarShell() {
  const dispatch = useSimDispatch();
  const { notifications, project } = useSim();
  const current = PROJECTS.find((p) => p.id === project) ?? PROJECTS[0]!;
  const unread = notifications.filter((n) => !n.read && n.role === 'owner').length;

  // 23.16: the bottom hairline shows ONLY while content scrolled under.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ContextBar
      label="شريط السياق"
      leading={
        <ProjectSwitcher
          label={current.name}
          caption={current.role}
          onPress={() => dispatch({ type: 'ui/openSheet', id: 'project-switcher' })}
        />
      }
      trailing={
        <>
          <NotificationsButton
            value={unread}
            label={unread ? `الإشعارات، ${unread} غير مقروءة` : 'الإشعارات'}
            onPress={() => dispatch({ type: 'ui/openSheet', id: 'notifications' })}
          />
          <AskButton onPress={() => dispatch({ type: 'ui/openSheet', id: 'ask' })} />
        </>
      }
      caption={scrolled}
    />
  );
}

/** The owner's TabBar (§5.1: خمسة عناصر بترتيب اللوحة أ/ب). */
export function OwnerTabBar() {
  const { tabOrder, ui } = useSim();
  const dispatch = useSimDispatch();
  const items: Array<{ key: Screen; label: string; icon: ReactNode }> = [
    { key: 'finance', label: 'المالية', icon: <NavFinanceIcon size={24} /> },
    { key: 'orders', label: 'الطلبات', icon: <NavOrdersIcon size={24} /> },
    { key: 'today', label: tabOrder === 'a' ? 'اليوم' : 'مشروع اليوم', icon: <NavTodayIcon size={24} /> },
    { key: 'delivery', label: 'التوصيل', icon: <NavDeliveryIcon size={24} /> },
    { key: 'market', label: 'السوق', icon: <NavMarketIcon size={24} /> },
  ];
  const order = tabOrder === 'a' ? [items[2]!, items[0]!, items[1]!, items[3]!, items[4]!] : items;
  const index = order.findIndex((i) => i.key === ui.screen || (ui.screen === 'ordersCalendar' && i.key === 'orders'));
  return (
    <TabBar
      value={index < 0 ? 2 : index}
      onChange={(i) => dispatch({ type: 'ui/navigate', screen: order[i]!.key })}
    >
      {order.map((item, i) => (
        <TabBarTab
          key={item.key}
          label={item.label}
          leading={item.icon}
          selected={i === (index < 0 ? 2 : index)}
          onPress={() => dispatch({ type: 'ui/navigate', screen: item.key })}
        />
      ))}
    </TabBar>
  );
}

/** The reviewer's TabBar (§5.1: المراجعة، البلاغات، السائقون). */
export function ReviewerTabBar() {
  const { ui } = useSim();
  const dispatch = useSimDispatch();
  const items: Array<{ key: Screen; label: string }> = [
    { key: 'review', label: 'المراجعة' },
    { key: 'reports', label: 'البلاغات' },
    { key: 'drivers', label: 'السائقون' },
  ];
  const index = Math.max(0, items.findIndex((i) => i.key === ui.screen));
  return (
    <TabBar value={index} onChange={(i) => dispatch({ type: 'ui/navigate', screen: items[i]!.key })}>
      {items.map((item, i) => (
        <TabBarTab
          key={item.key}
          label={item.label}
          selected={i === index}
          onPress={() => dispatch({ type: 'ui/navigate', screen: item.key })}
        />
      ))}
    </TabBar>
  );
}

// ── The project view (§5.2.5: reef is the switch demo's own data) ───────

export interface ProjectView {
  movements: readonly Movement[];
  orders: readonly Order[];
  debts: readonly Debt[];
  deliveries: readonly Delivery[];
}

/** The ACTIVE project's own data (SA3: switching keeps the state's data —
 *  the view decides what to show; reef carries only its cash fund). */
export function projectView(s: SimState): ProjectView {
  if (s.project === 'reef') {
    return {
      movements: REEF.movements,
      orders: s.orders.filter((o) => o.project === 'reef'),
      debts: [],
      deliveries: [],
    };
  }
  return {
    movements: s.movements,
    orders: s.orders.filter((o) => o.project === 'yasmine'),
    debts: s.debts,
    deliveries: s.deliveries,
  };
}

// ── The live «يحتاجك» selectors (§5.1's fixed order, from the live state) ─

export interface NeedsItem {
  kind: 'quote' | 'needsReview' | 'overdueDebt' | 'negativeFund' | 'ready' | 'delivered' | 'proposal' | 'draft';
  ref: string;
  /** The object's display line (e.g. «ت1 · عرض سعر ساري 3 د»). */
  line: string;
}

/** The «يحتاجك» of مشروع اليوم — §5.1's fixed order, live. */
export function todayNeedsYouList(s: SimState): NeedsItem[] {
  const view = projectView(s);
  const out: NeedsItem[] = [];
  const quote = view.deliveries.find((d) => d.status === 'quoteArrived');
  if (quote) {
    const valid = quote.quotes.find((q) => q.state === 'valid');
    out.push({ kind: 'quote', ref: quote.id, line: `${quote.id} · عرض سعر ساري ${valid ? moneyText(valid.amount) : ''} د` });
  }
  for (const o of view.orders.filter((o) => o.status === 'needsReview')) {
    out.push({ kind: 'needsReview', ref: o.id, line: `طلب ${o.id} · ${o.content}` });
  }
  for (const d of view.debts.filter((d) => d.side === 'forYou' && d.overdue && !d.settled)) {
    out.push({ kind: 'overdueDebt', ref: d.id, line: `${d.id} · دين ${d.party} متأخر` });
  }
  for (const f of FUNDS) {
    if (fundBalance(view.movements, f.id) < 0) {
      out.push({ kind: 'negativeFund', ref: f.id, line: `${f.name} · رصيده سالب` });
    }
  }
  for (const o of view.orders.filter((o) => o.status === 'ready')) {
    out.push({ kind: 'ready', ref: o.id, line: `طلب ${o.id} · ${o.content}` });
  }
  for (const o of view.orders.filter((o) => o.status === 'delivered')) {
    out.push({ kind: 'delivered', ref: o.id, line: `طلب ${o.id} · ${o.content}` });
  }
  const proposal = view.deliveries.find((d) => d.status === 'failed' && !d.issueClosed);
  if (proposal) out.push({ kind: 'proposal', ref: proposal.id, line: `${proposal.id} · مقترح تعذّر ينتظر موافقتك` });
  for (const m of view.movements.filter((m) => !m.saved)) {
    out.push({ kind: 'draft', ref: m.id, line: `مسودة ${m.type === 'out' ? 'خارج' : m.type === 'in' ? 'داخل' : 'تحويل'} ${moneyText(m.amount)} د · ${m.note}` });
  }
  return out;
}

/** The needs of a needs-item row's card component (the map's name). */
export function needsCard(kind: NeedsItem['kind']): string {
  switch (kind) {
    case 'quote':
      return 'QuoteCard';
    case 'overdueDebt':
      return 'DebtCard';
    case 'negativeFund':
      return 'FundCard';
    case 'proposal':
      return 'IssueProposalCard';
    case 'needsReview':
    case 'ready':
    case 'delivered':
      return 'OrderCard';
    case 'draft':
      return 'ObjectRow';
  }
}

/** The finance screen's «يحتاجك» (2.7 item 5): drafts then overdue debts. */
export function financeNeedsYou(s: SimState): NeedsItem[] {
  const drafts = todayNeedsYouList(s).filter((i) => i.kind === 'draft');
  const overdue = todayNeedsYouList(s).filter((i) => i.kind === 'overdueDebt');
  return [...drafts, ...overdue].slice(0, 3);
}

/** A money string for Money's input (fils → the western-decimal string). */
export function moneyText(fils: number): string {
  const sign = fils < 0 ? '-' : '';
  const abs = Math.abs(fils);
  const int = Math.floor(abs / 1000);
  const frac = abs % 1000;
  if (frac === 0) return `${sign}${int}`;
  return `${sign}${int}.${String(frac).padStart(3, '0')}`;
}

/** A Money node (kept as the only way amounts are written). */
export function moneyNode(fils: number): ReactNode {
  return <Money value={moneyText(fils)} />;
}

// ── The 8.1 weekly-bars drawing (BATCH2-SPECS §8 — the app owns the chart) ─

const DAY_LABELS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];

export interface WeekBarsProps {
  /** The week's per-day values, fils (the latest bar = today, highlighted). */
  values: readonly number[];
  /** The summary sentence parts (the line before the chart, 8.0). */
  label: string;
  /** The chart's accessible name (8.0: the summary sentence). */
  ariaLabel: string;
}

/**
 * The 8.1 vertical-bars core: the summary line (title-card + AskAboutThis
 * marker + the table IconButton), then the bars — the latest highlighted,
 * day labels beneath, the value badge under the finger (23.13), and the
 * table toggle swaps to the DataTable marker (unbuilt). Hidden amounts: the
 * bars stay, no value is written anywhere (8.0).
 */
export function WeekBars({ values, label, ariaLabel }: WeekBarsProps) {
  const [table, setTable] = useState(false);
  const [scrub, setScrub] = useState<number | null>(null);
  const max = Math.max(...values, 1);
  return (
    <Surface>
      <div className="sim-chart">
        <div className="sim-chart__head">
          <h3 className="sim-chart__title">{label}</h3>
          <span className="sim-chart__tools">
            <LaterMark name="AskAboutThis" />
            <IconButton label={table ? 'رسم' : 'جدول'} onPress={() => setTable((v) => !v)}>
              {table ? <ChartIcon size={20} /> : <TableIcon size={20} />}
            </IconButton>
          </span>
        </div>
        {table ? (
          <div className="sim-chart__table">
            <LaterMark name="DataTable" note="الجدول البديل بنفس البيانات" />
          </div>
        ) : (
          <div
            className="sim-bars"
            role="img"
            aria-label={ariaLabel}
            onPointerDown={(e) => {
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const cell = rect.width / values.length;
              setScrub(Math.min(values.length - 1, Math.max(0, Math.floor((rect.width - x) / cell))));
            }}
            onPointerMove={(e) => {
              if (e.buttons === 0) return;
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const cell = rect.width / values.length;
              setScrub(Math.min(values.length - 1, Math.max(0, Math.floor((rect.width - x) / cell))));
            }}
            onPointerUp={() => setScrub(null)}
            onPointerCancel={() => setScrub(null)}
            onPointerLeave={() => setScrub(null)}
          >
            {values.map((v, i) => {
              const latest = i === values.length - 1;
              const active = scrub === i;
              const ratio = v / max;
              return (
                <div key={i} className="sim-bars__cell">
                  <span className="sim-bars__stack">
                    {active ? (
                      <span className="sim-bars__badge">
                        <Money value={moneyText(v)} size="md" />
                      </span>
                    ) : null}
                    <div
                      className={`sim-bars__bar${latest ? ' sim-bars__bar--latest' : ''}${active ? ' sim-bars__bar--active' : ''}`}
                      style={{ height: `${Math.max(ratio * 100, v === 0 ? 0 : 6)}%` }}
                    />
                  </span>
                  <span className="sim-bars__day">{DAY_LABELS[i]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Surface>
  );
}

/** The delivery tile's live line: the project's running deliveries. */
export function deliveryRunningCount(s: SimState): number {
  return projectView(s).deliveries.filter((d) => d.status === 'inProgress').length;
}

/** The orders tile's live line: the project's today orders + the next time. */
export function ordersTodayTile(s: SimState): { count: number; next: string | null } {
  const today = projectView(s).orders
    .filter((o) => o.dueDate === SIM_TODAY && o.time)
    .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
  const next = today.find((o) => {
    const now = new Date();
    const [h, m] = (o.time ?? '').split(':').map((x) => Number.parseInt(x, 10));
    return Number.isFinite(h) && h * 60 + (m || 0) >= now.getHours() * 60 + now.getMinutes();
  });
  return { count: today.length, next: next?.time ?? today[0]?.time ?? null };
}

/** The date+time display used by the rows. */
export function whenLine(date: string | null | undefined, time: string | null | undefined): string {
  const d = dateDisplay(date);
  const t = time12(time);
  if (d && t) return `${d} · ${t}`;
  if (d) return d;
  if (t) return t;
  return '—';
}

/** The market's visible listings count (the السوق tile's number). */
export function marketCount(s: SimState): number {
  return visibleListings(s.listings).length;
}

/** The finance hero's live numbers. */
export function financeHero(s: SimState) {
  const movements = projectView(s).movements;
  const total = totalBalance(movements);
  const count = movements.filter((m) => m.saved).length;
  return { total, count };
}
