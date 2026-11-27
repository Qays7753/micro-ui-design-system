/**
 * TodayScreen — «مشروع اليوم» (§5.1 / 10.2 (1)): the header + date, then
 * «الآن» (the nearest item after the device clock today — hidden when none),
 * then «يحتاجك» (up to 3 in §5.1's fixed order, each at its card's place —
 * the cards are batch-2 and unbuilt, so their places carry the internal
 * marker), and the 4 Bento tiles with the live §5.2 numbers.
 */
import {
  NavDeliveryIcon,
  NavFinanceIcon,
  NavMarketIcon,
  NavOrdersIcon,
  PageHeader,
  Section,
  Tile,
} from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import {
  ContextBarShell,
  LaterMark,
  OwnerTabBar,
  deliveryRunningCount,
  marketCount,
  moneyText,
  projectView,
  needsCard,
  ordersTodayTile,
  todayNeedsYouList,
} from '../parts';
import { SIM_TODAY, endOfDayBalances, totalBalance } from '../../data';
import { time12 } from '../../format';
import { TODAY_LINE } from '../../texts';

export function TodayScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();

  // «الآن»: the nearest order of today after the device clock (س4's rule).
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todays = projectView(state).orders
    .filter((o) => o.project === 'yasmine' && o.dueDate === SIM_TODAY && o.time)
    .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
  const nearest = todays.find((o) => {
    const [h, m] = (o.time ?? '').split(':').map((x) => Number.parseInt(x, 10));
    return Number.isFinite(h) && h * 60 + (m || 0) >= nowMinutes;
  });

  const needs = todayNeedsYouList(state);
  const view = projectView(state);
  const visibleNeeds = needs.slice(0, 3);

  // The tiles' live numbers (§5.1 البلاطات).
  const spark = endOfDayBalances(view.movements).slice(-7).map((d) => d.balance / 1000);
  const ordersTile = ordersTodayTile(state);
  const deliveriesTile = deliveryRunningCount(state);
  const hasQuote = view.deliveries.some((d) => d.status === 'quoteArrived');

  return (
    <div className="sim-screen" data-sim-screen-body="today">
      <ContextBarShell />
      <PageHeader label="مشروع اليوم" />
      <div className="sim-screen__body">
        <p className="sim-screen__date"> {TODAY_LINE} </p>
        {nearest ? (
          <Section label="الآن">
            <div className="sim-cards">
              <LaterMark name="OrderCard" note={`طلب ${nearest.id} · ${nearest.customer} · ${time12(nearest.time)}`} />
            </div>
          </Section>
        ) : null}
        <Section
          label="يحتاجك"
          caption={needs.length || undefined}
          onPress={() => dispatch({ type: 'ui/openSheet', id: 'needsYouAll' })}
        >
          {visibleNeeds.length ? (
            <div className="sim-cards">
              {visibleNeeds.map((item) => (
                <LaterMark key={item.ref} name={needsCard(item.kind)} note={item.line} />
              ))}
            </div>
          ) : null}
        </Section>
        <div className="mds-tile-grid sim-tiles">
          <Tile
            tone="start"
            label="المالية"
            leading={<NavFinanceIcon size={20} />}
            value={moneyText(totalBalance(view.movements))}
            trailing="في الصناديق الآن"
            draft={spark}
            onPress={() => dispatch({ type: 'ui/navigate', screen: 'finance' })}
          />
          <Tile
            label="الطلبات"
            leading={<NavOrdersIcon size={20} />}
            value={ordersTile.count === 0 ? undefined : String(ordersTile.count)}
            trailing={ordersTile.next ? `اليوم · التالي ${time12(ordersTile.next)}` : 'اليوم'}
            onPress={() => dispatch({ type: 'ui/navigate', screen: 'orders' })}
          />
          <Tile
            label="التوصيل"
            leading={<NavDeliveryIcon size={20} />}
            state={hasQuote}
            caption="يوجد عرض سعر ينتظرك"
            value={deliveriesTile === 0 ? undefined : String(deliveriesTile)}
            trailing="جارية"
            onPress={() => dispatch({ type: 'ui/navigate', screen: 'delivery' })}
          />
          <Tile
            tone="end"
            label="السوق"
            leading={<NavMarketIcon size={20} />}
            value={String(marketCount(state))}
            trailing="عروض"
            onPress={() => dispatch({ type: 'ui/navigate', screen: 'market' })}
          />
        </div>
      </div>
      <OwnerTabBar />
    </div>
  );
}
