/**
 * FinanceScreen — «المالية» (م1 §2.7): the header + «سجّل حركة», the hero
 * with the live total / diff / source (real HeroSurface, live §5.2 numbers),
 * the PeriodSwitcher's PLACE (unbuilt marker), the real 8.1 weekly bars, the
 * needs-you draft row (a real ObjectRow — the map names it so), and the
 * funds / movements / debts sections whose batch-2 cards are still unbuilt —
 * their places carry the internal marker, never an invented substitute.
 */
import {
  Button,
  DeltaDownIcon,
  DeltaUpIcon,
  DraftIcon,
  EntityMark,
  HeroSurface,
  ObjectRow,
  PageHeader,
  Section,
  Surface,
  Money,
  pluralAr,
} from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import {
  ContextBarShell,
  LaterChip,
  OwnerTabBar,
  WeekBars,
  moneyText,
  whenLine,
} from '../parts';
import { FINANCE_HERO } from '../../texts';
import { FUNDS, fundBalance, incomeByDay, totalBalance, endOfDayBalances } from '../../data';
import { projectView } from '../parts';

export function FinanceScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const view = projectView(state);
  const { amountsHidden } = state;

  // The hero's live numbers (§5.1 HeroSurface المالية) — the project's own.
  const total = totalBalance(view.movements);
  const savedCount = view.movements.filter((m) => m.saved).length;
  const balances = endOfDayBalances(view.movements);
  const yesterday = balances.length >= 2 ? balances[balances.length - 2]!.balance : total;
  const diff = total - yesterday;
  const percent = yesterday === 0 ? 0 : Math.round((Math.abs(diff) / yesterday) * 100);
  const up = diff >= 0;
  const spark = balances.slice(-7).map((d) => d.balance / 1000);

  // The 8.1 chart's per-day income (الأحد 22 → الجمعة 27).
  const daily = incomeByDay(view.movements).map((d) => d.total);

  // «يحتاجك» (2.7 item 5): drafts (real ObjectRow) + overdue debts, up to 3.
  const drafts = view.movements.filter((m) => !m.saved);
  const overdue = view.debts.filter((d) => d.side === 'forYou' && d.overdue && !d.settled);

  // The period's movements (this week), up to 5 rows.
  const periodMovements = view.movements
    .filter((m) => m.saved && m.date >= '2026-11-22' && m.date <= '2026-11-28')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const visibleMovements = periodMovements.slice(0, 5);

  return (
    <div className="sim-screen" data-sim-screen-body="finance">
      <ContextBarShell />
      <PageHeader
        label="المالية"
        trailing={
          <Button size="sm" variant="primary" onPress={() => dispatch({ type: 'ui/openSheet', id: 'movement' })}>
            سجّل حركة
          </Button>
        }
      />
      <HeroSurface
        label={FINANCE_HERO.label}
        value={moneyText(total)}
        trailing="د"
        draft={spark}
        direction={
          <span className="sim-hero-delta">
            {up ? <DeltaUpIcon /> : <DeltaDownIcon />}
            <span>
              {amountsHidden
                ? up
                  ? FINANCE_HERO.higherHidden
                  : FINANCE_HERO.lowerHidden
                : up
                  ? FINANCE_HERO.higher(`${percent}%`)
                  : FINANCE_HERO.lower(`${percent}%`)}
            </span>
          </span>
        }
        debt={FINANCE_HERO.source(pluralAr(savedCount, FINANCE_HERO.counted))}
        onDismiss={() => dispatch({ type: 'ui/openSheet', id: 'source' })}
        onChange={(visible) => dispatch({ type: 'amountsHidden/set', hidden: !visible })}
      />
      <div className="sim-later-inline sim-period" data-sim-later="PeriodSwitcher">
        <span className="sim-later__name">يُركَّب لاحقًا: PeriodSwitcher</span>
        <span className="sim-later__note">أسبوع 22/11 – 28/11</span>
      </div>
      <div className="sim-screen__body">
      <WeekBars
        values={daily}
        label="دخل هذا الأسبوع"
        ariaLabel="رسم دخل هذا الأسبوع اليومي من الأحد إلى الجمعة"
      />
      {drafts.length || overdue.length ? (
        <Section label="يحتاجك" caption={drafts.length + overdue.length || undefined}>
          <Surface>
            {drafts.map((m) => (
              <ObjectRow
                key={m.id}
                label={`مسودة · ${m.note}`}
                caption={`${m.type === 'in' ? 'داخل' : 'خارج'} · ${FUNDS.find((f) => f.id === m.fund)?.name} · ${whenLine(m.date, m.time)}`}
                value={<Money value={moneyText(m.amount)} flow={m.type} />}
                leading={<DraftIcon size={24} />}
                onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${m.id}` })}
              />
            ))}
            {overdue.map((d) => (
              <ObjectRow
                key={d.id}
                label={d.party}
                caption="دين متأخر"
                value={<Money value={moneyText(d.remaining)} />}
                leading={<EntityMark value={d.party} />}
                trailing={<LaterChip name="DebtCard" />}
                onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${d.id}` })}
              />
            ))}
          </Surface>
        </Section>
      ) : null}
      <Section label="الصناديق">
        <Surface>
          {FUNDS.map((fund) => (
            <ObjectRow
              key={fund.id}
              label={fund.name}
              caption="الرصيد الآن"
              value={<span className="sim-money"><Money value={moneyText(fundBalance(view.movements, fund.id))} /> د</span>}
              leading={<EntityMark value={fund.name} />}
              trailing={<LaterChip name="FundCard" />}
              onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${fund.id}` })}
            />
          ))}
        </Surface>
      </Section>
      <Section
        label="الحركات"
        caption={periodMovements.length}
        onPress={() => dispatch({ type: 'ui/navigate', screen: 'movements' })}
      >
        <Surface>
          {visibleMovements.map((m) => (
            <ObjectRow
              key={m.id}
              label={`${m.type === 'in' ? 'داخل' : m.type === 'out' ? 'خارج' : 'تحويل'} · ${m.party ?? m.note ?? '—'}`}
              caption={`${m.id} · ${whenLine(m.date, m.time)}`}
              value={<Money value={moneyText(m.amount)} flow={m.type} />}
              trailing={<LaterChip name={m.type === 'transfer' ? 'TransferRow' : 'MovementRow'} />}
              onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${m.id}` })}
            />
          ))}
        </Surface>
      </Section>
      <Section label="الديون">
        <Surface>
          <div className="sim-later-inline" data-sim-later="DebtSummary">
            <span className="sim-later__name">يُركَّب لاحقًا: DebtSummary</span>
            <span className="sim-later__note">لك 57.500 د من عميلين، وعليك 1,280 د</span>
          </div>
          {view.debts.map((d) => (
            <ObjectRow
              key={d.id}
              label={d.party}
              caption={`${d.side === 'forYou' ? 'لك' : 'عليك'} · ${d.settled ? 'سُدّد' : d.overdue ? 'متأخر' : 'المتبقي'}`}
              value={<Money value={moneyText(d.remaining)} />}
              leading={<EntityMark value={d.party} />}
              trailing={<LaterChip name="DebtCard" />}
              onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${d.id}` })}
            />
          ))}
        </Surface>
      </Section>
      </div>
      <OwnerTabBar />
    </div>
  );
}
