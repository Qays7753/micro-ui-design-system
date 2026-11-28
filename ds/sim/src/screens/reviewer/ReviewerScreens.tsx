/**
 * ReviewerScreens — the reviewer's three tabs (م1 §6.5 / §5.1 المراجع):
 * المراجعة (the queue ع3، ع8، ع4-تعديل at their ReviewQueueItem places with
 * the DecisionCard place for each), البلاغات (ع6's three reports), and
 * السائقون (يزن القضاة). Every batch-2 component's place carries the
 * internal marker with its live queue data; the TabBar carries the three
 * tabs.
 */
import { EmptyState, EntityMark, ObjectRow, PageHeader, Section, StatusBadge } from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, LaterChip, ReviewerTabBar } from '../parts';

/** A queue item's line (§6.1: the title + the type · sender + the age). */
function queueLine(title: string, type: string, sender: string, since: string): string {
  return `${title} · ${type} · ${sender} · ${since}`;
}

export function ReviewScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const items = state.reviewQueue.map((r) => {
    if (r.kind === 'driver') {
      const driver = state.drivers.find((d) => d.id === r.ref);
      return { ref: r.ref, since: r.since, line: queueLine(driver?.name ?? r.ref, 'سائق جديد', '', r.since) };
    }
    const listing = state.listings.find((l) => l.id === r.ref);
    const kind = r.kind === 'listingEdit' ? 'تعديل عرض' : 'عرض جديد';
    const price = listing?.tiers
      ? `${listing.tiers.length} شرائح`
      : listing?.editedPrice
        ? `المعدّل ${listing.editedPrice / 1000} د`
        : `${(listing?.price ?? 0) / 1000} د`;
    return {
      ref: r.ref,
      since: r.since,
      line: queueLine(listing?.title ?? r.ref, `${kind} · ${price}`, listing?.supplier ?? '', r.since),
    };
  });

  return (
    <div className="sim-screen" data-sim-screen-body="review">
      <ContextBarShell />
      <PageHeader label="المراجعة" />
      <div className="sim-screen__body">
        {items.length ? (
          <Section label="طابور المراجعة" caption={items.length}>
            <div className="sim-rows">
              {items.map((item) => (
                <ObjectRow
                  key={item.ref + item.since}
                  label={item.line.split(' · ')[0]!}
                  caption={item.line.split(' · ').slice(1).join(' · ')}
                  leading={<EntityMark value={item.ref} />}
                  trailing={<LaterChip name="ReviewQueueItem" />}
                  onPress={() => dispatch({ type: 'ui/openSheet', id: `decision:${item.ref}` })}
                />
              ))}
            </div>
          </Section>
        ) : (
          <EmptyState label="لا شيء ينتظر المراجعة." />
        )}
      </div>
      <ReviewerTabBar />
    </div>
  );
}

export function ReportsScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const items = state.reportsQueue.map((r) => {
    const listing = state.listings.find((l) => l.id === r.ref);
    const mostCommon = listing?.reports?.[0] ?? '';
    return { ref: r.ref, line: `${listing?.title ?? r.ref} · السبب الأكثر تكرارًا: ${mostCommon} · ${r.since}` };
  });

  return (
    <div className="sim-screen" data-sim-screen-body="reports">
      <ContextBarShell />
      <PageHeader label="البلاغات" />
      <div className="sim-screen__body">
        {items.length ? (
          <Section label="العروض المبلَّغ عنها" caption={items.length}>
            <div className="sim-rows">
              {items.map((item) => (
                <ObjectRow
                  key={item.ref}
                  label={item.line.split(' · ')[0]!}
                  caption={item.line.split(' · ').slice(1).join(' · ')}
                  leading={<EntityMark value={item.ref} />}
                  trailing={<StatusBadge tone="waiting" label="3 بلاغات" />}
                  onPress={() => dispatch({ type: 'ui/openSheet', id: `reports:${item.ref}` })}
                />
              ))}
            </div>
          </Section>
        ) : (
          <EmptyState label="لا بلاغات." />
        )}
      </div>
      <ReviewerTabBar />
    </div>
  );
}

export function DriversScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const items = state.driversQueue.map((r) => {
    const driver = state.drivers.find((d) => d.id === r.ref);
    return { ref: r.ref, line: `${driver?.name ?? r.ref} · بانتظار الاعتماد · ${r.since}` };
  });

  return (
    <div className="sim-screen" data-sim-screen-body="drivers">
      <ContextBarShell />
      <PageHeader label="السائقون" />
      <div className="sim-screen__body">
        {items.length ? (
          <Section label="طلبات الاعتماد" caption={items.length}>
            <div className="sim-rows">
              {items.map((item) => (
                <ObjectRow
                  key={item.ref}
                  label={item.line.split(' · ')[0]!}
                  caption={item.line.split(' · ').slice(1).join(' · ')}
                  leading={<EntityMark value={item.ref} />}
                  trailing={<LaterChip name="ReviewQueueItem" />}
                  onPress={() => dispatch({ type: 'ui/openSheet', id: `driverDecision:${item.ref}` })}
                />
              ))}
            </div>
          </Section>
        ) : (
          <EmptyState label="لا طلبات اعتماد." />
        )}
      </div>
      <ReviewerTabBar />
    </div>
  );
}
