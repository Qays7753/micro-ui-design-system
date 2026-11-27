/**
 * ReviewerScreens — the reviewer's three tabs (م1 §6.5 / §5.1 المراجع):
 * المراجعة (the queue ع3، ع8، ع4-تعديل at their ReviewQueueItem places with
 * the DecisionCard place for each), البلاغات (ع6's three reports), and
 * السائقون (يزن القضاة). Every batch-2 component's place carries the
 * internal marker with its live queue data; the TabBar carries the three
 * tabs.
 */
import { EmptyState, PageHeader, Section } from '@micro/ds';
import { useSim } from '../../state/store';
import { ContextBarShell, LaterMark, ReviewerTabBar } from '../parts';

/** A queue item's line (§6.1: the title + the type · sender + the age). */
function queueLine(title: string, type: string, sender: string, since: string): string {
  return `${title} · ${type} · ${sender} · ${since}`;
}

export function ReviewScreen() {
  const state = useSim();
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
                <div key={item.ref + item.since} className="sim-review-item">
                  <LaterMark name="ReviewQueueItem" note={item.line} />
                  <div className="sim-later-inline" data-sim-later="DecisionCard">
                    <span className="sim-later__name">يُركَّب لاحقًا: DecisionCard</span>
                    <span className="sim-later__note">
                      {item.ref === 'ع8'
                        ? 'تأشير بنود التحقق السبعة + «أجريت اتصال التحقق» ← «اعتمد العرض»'
                        : item.ref === 'ع3'
                          ? '«اعتمد العرض» / «ارفض العرض» بسبب'
                          : 'اعتماد التعديل على ع4'}
                    </span>
                  </div>
                </div>
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
                <div key={item.ref} className="sim-review-item">
                  <LaterMark name="ReportItem" note={item.line} />
                  <div className="sim-later-inline" data-sim-later="DecisionCard">
                    <span className="sim-later__name">يُركَّب لاحقًا: DecisionCard</span>
                    <span className="sim-later__note">«أبقِ العرض» / «أوقف العرض»</span>
                  </div>
                </div>
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
                <div key={item.ref} className="sim-review-item">
                  <LaterMark name="ReviewQueueItem" note={item.line} />
                  <div className="sim-later-inline" data-sim-later="DriverApprovalCard">
                    <span className="sim-later__name">يُركَّب لاحقًا: DriverApprovalCard</span>
                    <span className="sim-later__note">
                      الحقول (الهاتف، المركبة، اللوحة، مناطق الخدمة) والمرفقات الثلاثة ← «اعتمد السائق»
                    </span>
                  </div>
                </div>
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
