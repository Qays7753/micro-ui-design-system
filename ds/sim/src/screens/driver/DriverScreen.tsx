/**
 * DriverScreen — «التوصيل» for the driver (م1 §4.10): NO TabBar, the
 * SegmentedControl «الطلبات» / «مهامي» under the header switches the two
 * parts. «الطلبات»: every job directed to him — ت4 (awaiting HIS quote) and
 * ت1 (his quote awaiting the owner: «بانتظار قرار المالك»). «مهامي»: ت3 in
 * progress (the photo evidence) and «السجل» (ت2). The DriverJobCard itself
 * is batch-2 and unbuilt — its place carries the internal marker with the
 * live job data (its inner quote form / SlideToConfirm / ورقة التعذّر ride
 * with the real card in part B; the ورقة التعذّر's own reducer action
 * 'issue/propose' is ready from SA3).
 */
import { PageHeader, SegmentedControl } from '@micro/ds';
import type { SegmentOption } from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, LaterMark, moneyText, whenLine } from '../parts';
import { time12 } from '../../format';
import type { Delivery } from '../../data/types';

const SEGMENTS: readonly SegmentOption[] = [
  { value: 'orders', label: 'الطلبات' },
  { value: 'jobs', label: 'مهامي' },
];

/** The driver's live job line for a DriverJobCard marker's note — جولة
 *  المستخدم: the OWNER's name leads the line (the driver serves more than
 *  one project; ت4 comes from صالون لمسة not ورشة الياسمين). */
function jobLine(d: Delivery): string {
  const valid = d.quotes.find((q) => q.state === 'valid');
  const superseded = d.quotes.find((q) => q.state === 'superseded');
  const parts = [`${d.id} · ${d.owner}`, `إلى ${d.to}`, `من ${d.from}`, whenLine(d.date, d.time)];
  if (d.status === 'quoteArrived') {
    parts.push(
      `عرضك ${moneyText(valid?.amount ?? superseded?.amount ?? 0)} د بانتظار قرار المالك${superseded && !valid ? ' (السابق مستبدل)' : ''}`,
    );
  } else if (d.status === 'awaitingQuote') {
    parts.push('بانتظار عرضك — «سعرك» + «أرسل العرض» داخل البطاقة');
  } else if (d.status === 'inProgress' || d.status === 'accepted') {
    parts.push('قيد التنفيذ · الإثبات المطلوب: صورة · «اسحب: تمّ التسليم» داخل البطاقة');
  } else if (d.status === 'done') {
    parts.push('تمّ · الإثبات: صورة');
  } else if (d.status === 'failed') {
    parts.push('تعذّر — «لم أستطع التسليم» يفتح ورقة السبب والإجراء');
  }
  return parts.filter(Boolean).join(' · ');
}

export function DriverScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const part = state.ui.screen === 'myJobs' ? 'jobs' : 'orders';

  // §5.1 الطلبات: the jobs waiting on HIM (his quote) or on the owner's
  // decision over his quote.
  const orders = state.deliveries.filter(
    (d) => d.status === 'awaitingQuote' || d.status === 'quoteArrived',
  );
  // §5.1 مهامي: the running job + السجل.
  const running = state.deliveries.filter(
    (d) => d.status === 'inProgress' || d.status === 'accepted' || d.status === 'failed',
  );
  const done = state.deliveries.filter((d) => d.status === 'done');

  return (
    <div className="sim-screen" data-sim-screen-body={part === 'jobs' ? 'myJobs' : 'driverOrders'}>
      <ContextBarShell />
      <PageHeader label="التوصيل" />
      <SegmentedControl
        leading={SEGMENTS}
        value={part}
        onChange={(v) => dispatch({ type: 'ui/navigate', screen: v === 'jobs' ? 'myJobs' : 'driverOrders' })}
        label="أجزاء التوصيل"
      />
      <div className="sim-screen__body">
        {part === 'orders' ? (
          <div className="sim-cards">
            {orders.map((d) => (
              <LaterMark key={d.id} name="DriverJobCard" note={jobLine(d)} onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${d.id}` })} />
            ))}
          </div>
        ) : (
          <>
            <div className="sim-cards">
              {running.map((d) => (
                <LaterMark key={d.id} name="DriverJobCard" note={jobLine(d)} onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${d.id}` })} />
              ))}
            </div>
            {done.length ? (
              <div className="sim-later-inline" data-sim-later="Disclosure">
                <span className="sim-later__name">يُركَّب لاحقًا: Disclosure</span>
                <span className="sim-later__note">
                  {`«السجل»: ${done.map((d) => `${d.id} تمّ ${time12(d.time) ?? ''}`).join('، ')}`}
                </span>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
