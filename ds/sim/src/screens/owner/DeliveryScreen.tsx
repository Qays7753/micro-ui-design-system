/**
 * DeliveryScreen — «التوصيل» (م1 §4.10): the header + «اطلب توصيلاً», the
 * «يحتاجك» DeliveryRequestCard place (ت1 — its valid quote 3 د, expiring),
 * the «الجارية» DriverJobCard place (ت3), and «السجل» (Disclosure marker).
 * The live quote expiry follows the simulation clock (sim.quote-expiry-minutes).
 */
import { Button, PageHeader, Section } from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, LaterMark, OwnerTabBar, moneyText, projectView, whenLine } from '../parts';
import { minutesSinceOpen } from '../../clock';

export function DeliveryScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();

  const needs = projectView(state).deliveries.filter((d) => d.status === 'quoteArrived');
  // جولة المستخدم: «الجارية» تشمل كل ما ليس في السجل ولا في «يحتاجك» —
  // بانتظار عرض السعر، مقبول، قيد التنفيذ (كانت تختفي الطلبات الجديدة!).
  const running = projectView(state).deliveries.filter((d) =>
    ['awaitingQuote', 'accepted', 'inProgress'].includes(d.status),
  );
  const done = projectView(state).deliveries.filter((d) => d.status === 'done');

  return (
    <div className="sim-screen" data-sim-screen-body="delivery">
      <ContextBarShell />
      <PageHeader
        label="التوصيل"
        trailing={
          <Button size="sm" variant="primary" onPress={() => dispatch({ type: 'ui/openSheet', id: 'newDelivery' })}>
            اطلب توصيلاً
          </Button>
        }
      />
      <div className="sim-screen__body">
      {needs.length ? (
        <Section label="يحتاجك" caption={needs.length}>
          <div className="sim-cards">
            {needs.map((d) => {
              const valid = d.quotes.find((q) => q.state === 'valid');
              const minutesLeft = valid?.expiresInMinutes ? Math.max(0, Math.round(valid.expiresInMinutes - minutesSinceOpen())) : 0;
              const expiring = valid?.expiresInMinutes
                ? minutesLeft >= 90
                  ? `ينتهي بعد ساعتين تقريبًا`
                  : `ينتهي بعد ${minutesLeft} دقيقة`
                : null;
              return (
                <LaterMark
                  key={d.id}
                  name="DeliveryRequestCard"
                  note={`${d.id} · إلى ${d.to} · ${moneyText(valid?.amount ?? 0)} د${expiring ? ` · ${expiring}` : ''}`}
                  onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${d.id}` })}
                />
              );
            })}
          </div>
        </Section>
      ) : null}
      {running.length ? (
        <Section label="الجارية" caption={running.length}>
          <div className="sim-cards">
            {running.map((d) => (
              <LaterMark
                key={d.id}
                name="DriverJobCard"
                note={`${d.id} · إلى ${d.to} · ${d.status === 'awaitingQuote' ? 'بانتظار عرض السعر' : d.status === 'accepted' ? 'مقبول — بانتظار بدء السائق' : 'قيد التنفيذ'}`}
                onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${d.id}` })}
              />
            ))}
          </div>
        </Section>
      ) : null}
      {done.length ? (
        <div className="sim-later-inline" data-sim-later="Disclosure">
          <span className="sim-later__name">يُركَّب لاحقًا: Disclosure</span>
          <span className="sim-later__note">{`«السجل»: ${done.map((d) => `${d.id} تمّ ${whenLine(d.date, d.time)}`).join('، ')}`}</span>
        </div>
      ) : null}
      </div>
      <OwnerTabBar />
    </div>
  );
}

/** Minutes since this simulation opened (the quote's §5.2 clock). */
export { minutesSinceOpen };
