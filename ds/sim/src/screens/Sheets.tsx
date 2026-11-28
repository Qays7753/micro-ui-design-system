/**
 * The shared sheets (§5.1 عام لكل الأدوار + the screens' own actions): the
 * ask panel's place (AskPanel — batch-2 marker; SA4's engine mounts inside
 * it in part B), the notification center's place (marker; the reviewer's
 * empty state is real), the REAL project switcher sheet (Sheet + ObjectRows
 * + إخفاء المبالغ — all built), the hero's source sheet (the three live
 * fund rows), the «كل ما يحتاجك» sheet, the object sheets' places
 * (ObjectSheet markers), and the three creation forms (movement / order /
 * delivery) whose built fields really type and whose unbuilt fields are
 * markers — ActionBar + SaveState are real, and the save dispatches only
 * when the required fields exist (in part A the type/date/party controls
 * are markers, so the form honestly stays a draft «مسودة · لم تُحفظ»).
 */
import {
  ActionBar,
  AmountField,
  AmountsHiddenIcon,
  AmountsShownIcon,
  Button,
  DraftIcon,
  EmptyState,
  EntityMark,
  ObjectRow,
  SaveState,
  SelectedIcon,
  SegmentedControl,
  Sheet,
  Surface,
  TextArea,
  TextField,
  Toggle,
} from '@micro/ds';
import type { SegmentOption } from '@micro/ds';
import { useState } from 'react';
import { useSim, useSimDispatch } from '../state/store';
import { FUNDS, PROJECTS, fundBalance } from '../data';
import type { FundId, Listing } from '../data/types';
import type { MovementInput, OrderInput, DeliveryInput, SimState } from '../state/types';
import { LaterMark, moneyText, needsCard, todayNeedsYouList, whenLine } from './parts';
import { minutesSinceOpen } from '../clock';
import { DecisionSheet, DriverDecisionSheet } from './reviewer/ReviewerSheets';
import { dateDisplay, parseTimeInput, time12 } from '../format';

/** The sheet's own body rhythm. */
function SheetBody({ children }: { children: React.ReactNode }) {
  return <div className="sim-sheet__body">{children}</div>;
}

/** The ask panel's place (§5.3's engine from SA4 mounts in part B). */
export function AskSheet({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Sheet label="Ask Micro" onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="AskPanel" note="محرك الأسئلة جاهز — يُركَّب معه" />
      </SheetBody>
    </Sheet>
  );
}

/** The notification center's place (the reviewer's empty state is real). */
/** §5.2.9: each notification's text = the object + its new state. */
const NOTIF_PHRASES: Record<string, string> = {
  quote_submitted: 'وصل عرض سعر',
  quote_expiring: 'عرض السعر ينتهي قريبًا',
  status_changed: 'تغيّرت حالة التوصيل',
  booking_outcome: 'نتيجة حجز التوصيل',
  report_replied: 'ردّ المنصة على بلاغك',
  booking_request_received: 'طلب حجز توصيل جديد',
  evidence_expiry_reminder: 'أرفق إثبات التسليم قبل انتهاء المهلة',
  driver_review_decision: 'قرار مراجعة الاعتماد',
  moderation_decision: 'قرار المراجعة في عرضك',
  listing_freshness_reminder: 'حدّث نشاط عرضك',
};

/** جولة المستخدم: the notifications READ their §5.2.9 texts now — real rows
 *  with the unread dot and the time, tapping one marks it read and opens its
 *  object. The NotificationCenter's place rides the sheet as a marker. */
export function NotificationsSheet({ onDismiss }: { onDismiss: () => void }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  const role = state.role === 'guest' ? 'owner' : state.role ?? 'owner';
  const items = state.notifications.filter((n) => n.role === role);
  const objectLine = (n: (typeof items)[number]): string => {
    const phrase = NOTIF_PHRASES[n.key] ?? '';
    if (n.key === 'quote_submitted' && n.object.startsWith('ت')) {
      const d = state.deliveries.find((x) => x.id === n.object);
      const valid = d?.quotes.find((q) => q.state === 'valid');
      return `${n.object}: ${phrase} ${moneyText(valid?.amount ?? 0)} د`;
    }
    return n.object ? `${n.object}: ${phrase}` : phrase;
  };
  return (
    <Sheet label="الإشعارات" onDismiss={onDismiss}>
      <SheetBody>
        {items.length ? (
          <>
          <LaterMark name="NotificationCenter" note="قائمة الإشعارات الحقيقية تُركَّب هنا" />
          <Surface>
            {items.map((n, i) => (
              <ObjectRow
                key={`${n.key}-${n.object}-${i}`}
                label={objectLine(n)}
                caption={n.time}
                leading={n.read ? undefined : <span className="sim-unread-dot" aria-hidden="true" />}
                onPress={() => {
                  dispatch({ type: 'notification/read', key: n.key, object: n.object });
                  const target = n.object.startsWith('ت')
                    ? `object:${n.object}`
                    : n.object.startsWith('ع')
                      ? 'open-listing'
                      : null;
                  if (target === 'open-listing') {
                    dispatch({ type: 'ui/openSheet', id: null });
                    dispatch({ type: 'ui/openListing', id: n.object });
                  } else if (target) {
                    dispatch({ type: 'ui/openSheet', id: target });
                  }
                }}
              />
            ))}
          </Surface>
          </>
        ) : (
          <EmptyState label="الإشعارات تظهر هنا." />
        )}
      </SheetBody>
    </Sheet>
  );
}

/** The REAL project switcher sheet (BRIEF 9.1): rows + إخفاء المبالغ row. */
export function ProjectSheet({ onDismiss }: { onDismiss: () => void }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  return (
    <Sheet label="تبديل المشروع" onDismiss={onDismiss}>
      <SheetBody>
        <Surface>
          {PROJECTS.map((p) => (
            <ObjectRow
              key={p.id}
              label={p.name}
              caption={p.role}
              leading={<EntityMark value={p.name} />}
              trailing={state.project === p.id ? <SelectedIcon size={20} /> : undefined}
              onPress={() => {
                dispatch({ type: 'project/switch', project: p.id });
                dispatch({ type: 'ui/openSheet', id: null });
              }}
            />
          ))}
          <ObjectRow
            label="إخفاء المبالغ"
            leading={state.amountsHidden ? <AmountsHiddenIcon size={24} /> : <AmountsShownIcon size={24} />}
            trailing={state.amountsHidden ? <SelectedIcon size={20} /> : undefined}
            onPress={() => dispatch({ type: 'amountsHidden/set', hidden: !state.amountsHidden })}
          />
        </Surface>
      </SheetBody>
    </Sheet>
  );
}

/** The hero's source (23.8): the three live fund balances. */
export function SourceSheet({ onDismiss }: { onDismiss: () => void }) {
  const state = useSim();
  return (
    <Sheet label="مصدر الرقم" onDismiss={onDismiss}>
      <SheetBody>
        <Surface>
          {FUNDS.map((f) => (
            <ObjectRow
              key={f.id}
              label={f.name}
              caption="رصيد الصندوق"
              value={<span className="sim-money">{moneyText(fundBalance(state.movements, f.id))} د</span>}
              leading={<EntityMark value={f.name} />}
            />
          ))}
        </Surface>
      </SheetBody>
    </Sheet>
  );
}

/** «كل ما يحتاجك» (§5.1: «الكل» ← ورقة بكل عناصر «يحتاجك»). */
export function NeedsYouAllSheet({ onDismiss }: { onDismiss: () => void }) {
  const state = useSim();
  const needs = todayNeedsYouList(state);
  return (
    <Sheet label="كل ما يحتاجك" onDismiss={onDismiss}>
      <SheetBody>
        <Surface>
          {needs.map((item: ReturnType<typeof todayNeedsYouList>[number]) => (
            <div key={item.ref + item.kind} className="sim-later-inline" data-sim-later={needsCard(item.kind)}>
              <span className="sim-later__name">يُركَّب لاحقًا: {needsCard(item.kind)}</span>
              <span className="sim-later__note">{item.line}</span>
            </div>
          ))}
        </Surface>
      </SheetBody>
    </Sheet>
  );
}

/** An object's display title for its sheet («طلب 1175»، «درج الكاش»…). */
export function objectTitle(ref: string, state: SimState): string {
  const order = state.orders.find((o) => o.id === ref);
  if (order) return `طلب ${order.id}`;
  const debt = state.debts.find((d) => d.id === ref);
  if (debt) return `${debt.id} · ${debt.party}`;
  const delivery = state.deliveries.find((d) => d.id === ref);
  if (delivery) return `${delivery.id} · إلى ${delivery.to}`;
  const fund = FUNDS.find((f) => f.id === ref);
  if (fund) return fund.name;
  const movement = state.movements.find((m) => m.id === ref);
  if (movement) return `حركة ${movement.id}`;
  return ref;
}

/** جولة المستخدم: the object sheets carry the object's REAL data now —
 *  movement (with the draft's save/discard), debt (with «سجّل دفعة»), fund
 *  (balance + its movements), order and delivery (SU2/SU3 fill those kinds).
 *  The ObjectSheet component itself stays a marker — its place rides the
 *  sheet as a marker chip so part B mounts the real component here. */
export function ObjectSheetShell({ title, refId, onDismiss }: { title: string; refId: string; onDismiss: () => void }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  const movement = state.movements.find((m) => m.id === refId);
  const debt = state.debts.find((d) => d.id === refId);
  const fund = FUNDS.find((f) => f.id === refId);

  if (movement) {
    const isDraft = !movement.saved;
    const kindLine = movement.type === 'transfer' ? `تحويل · ${FUNDS.find((f) => f.id === movement.from)?.name} ← ${FUNDS.find((f) => f.id === movement.to)?.name}` : `${movement.type === 'in' ? 'داخل' : 'خارج'} · ${FUNDS.find((f) => f.id === movement.fund)?.name}`;
    return (
      <Sheet label={title} onDismiss={onDismiss}>
        <SheetBody>
          <LaterMark name="ObjectSheet" note="مكان ورقة الكائن الحقيقية" />
          <Surface>
            <ObjectRow label={kindLine} caption={`التاريخ · ${whenLine(movement.date, movement.time)}`} value={<span className="sim-money">{moneyText(movement.amount)} د</span>} />
            <ObjectRow label={movement.party ?? '—'} caption={movement.party ? 'الطرف' : 'الطرف: —'} />
            <ObjectRow label={movement.note || '—'} caption={movement.note ? 'الوصف' : 'الوصف: —'} />
            {movement.linkedOrderId ? <ObjectRow label={`طلب ${movement.linkedOrderId}`} caption="مرتبط بـ" /> : null}
            {movement.linkedDeliveryId ? <ObjectRow label={movement.linkedDeliveryId} caption="مرتبط بتوصيل" /> : null}
            {movement.linkedDebtId ? <ObjectRow label={movement.linkedDebtId} caption="مرتبط بدين" /> : null}
          </Surface>
          {isDraft ? (
            <>
              <p className="sim-form-help">مسودة لم تُحفظ — لا تدخل في أي رصيد.</p>
              <ActionBar
                label="احفظ المسودة"
                onPress={() => {
                  dispatch({ type: 'draft/save' });
                  dispatch({ type: 'ui/openSheet', id: null });
                }}
              />
              <div className="sim-sheet__gap" />
              <Button variant="text" onPress={() => { dispatch({ type: 'draft/discard' }); dispatch({ type: 'ui/openSheet', id: null }); }}>
                تجاهل المسودة
              </Button>
            </>
          ) : null}
        </SheetBody>
      </Sheet>
    );
  }

  if (debt) {
    const settled = debt.settled;
    return (
      <Sheet label={title} onDismiss={onDismiss}>
        <SheetBody>
          <LaterMark name="ObjectSheet" note="مكان ورقة الكائن الحقيقية" />
          <LaterMark name="DebtCard" note="بطاقة الدين الحقيقية تُركَّب هنا" />
          <Surface>
            <ObjectRow label={debt.party} caption={debt.side === 'forYou' ? 'دين لك' : 'دين عليك'} leading={<EntityMark value={debt.party} />} />
            <ObjectRow label="الإجمالي" value={<span className="sim-money">{moneyText(debt.total)} د</span>} />
            <ObjectRow label="المدفوع" value={<span className="sim-money">{moneyText(debt.paid)} د</span>} />
            <ObjectRow label="المتبقي" value={<span className="sim-money">{moneyText(debt.remaining)} د</span>} />
            <ObjectRow label="الاستحقاق" value={<span>{debt.dueDate ? dateDisplay(debt.dueDate) : '—'}</span>} />
            <ObjectRow
              label={settled ? 'سُدّد' : debt.overdue ? 'متأخر' : '—'}
              caption={settled ? 'الحالة' : debt.overdue ? 'الحالة: متأخر' : 'الحالة: —'}
            />
            {debt.linkedOrderId ? <ObjectRow label={`طلب ${debt.linkedOrderId}`} caption="مرتبط بـ" /> : null}
          </Surface>
          {settled ? (
            <p className="sim-form-help">سُدّد بالكامل — لا دفعة عليه.</p>
          ) : debt.side === 'forYou' ? (
            <>
              <ActionBar
                label="سجّل دفعة"
                onPress={() => dispatch({ type: 'ui/openSheet', id: `pay:${debt.id}` })}
              />
            </>
          ) : (
            <p className="sim-form-help">دين عليك مورد — سجّل تسديدك من «سجّل حركة» ← خارج.</p>
          )}
        </SheetBody>
      </Sheet>
    );
  }

  const order = state.orders.find((o) => o.id === refId);
  if (order) {
    const STATUS_WORDS: Record<string, string> = {
      delivered: 'تم التسليم', ready: 'جاهز', settled: 'تمت التسوية', draft: 'مسودة',
      tentative: 'اتفاق مبدئي', confirmed: 'مؤكد', inProgress: 'قيد التنفيذ',
      needsReview: 'يحتاج مراجعة', postponed: 'مؤجل', cancelled: 'ملغى',
    };
    const deliverable = ['ready', 'confirmed', 'tentative', 'inProgress'].includes(order.status);
    return (
      <Sheet label={title} onDismiss={onDismiss}>
        <SheetBody>
          <LaterMark name="ObjectSheet" note="مكان ورقة الكائن الحقيقية" />
          <Surface>
            <ObjectRow label={order.customer} caption="العميل" leading={<EntityMark value={order.customer} />} />
            <ObjectRow label={order.content || '—'} caption={order.content ? 'المحتوى' : 'المحتوى: —'} />
            <ObjectRow label="السعر" value={<span className="sim-money">{order.price !== null ? `${moneyText(order.price)} د` : '—'}</span>} />
            <ObjectRow
              label="الموعد"
              value={<span>{order.dueDate ? `${dateDisplay(order.dueDate)}${order.time ? ` · ${time12(order.time)}` : ''}` : '—'}</span>}
            />
            {order.durationMinutes ? <ObjectRow label="المدة" value={<span>{`${order.durationMinutes} دقيقة`}</span>} /> : null}
            <ObjectRow label="الحالة" value={<span>{STATUS_WORDS[order.status] ?? order.status}</span>} />
            {order.reason ? <ObjectRow label={order.reason} caption="سبب التأجيل" /> : null}
            {order.linkedDebtId ? <ObjectRow label={order.linkedDebtId} caption="مرتبط بدين" /> : null}
            {order.linkedMovementId ? <ObjectRow label={`حركة ${order.linkedMovementId}`} caption="مرتبط بحركة" /> : null}
            {order.linkedDeliveryId ? <ObjectRow label={order.linkedDeliveryId} caption="مرتبط بتوصيل" /> : null}
          </Surface>
          {order.status === 'needsReview' ? (
            <>
              <ActionBar
                label="اعتمد الطلب"
                onPress={() => {
                  dispatch({ type: 'order/status', id: order.id, status: 'confirmed' });
                  dispatch({ type: 'ui/openSheet', id: null });
                }}
              />
            </>
          ) : deliverable ? (
            <>
              <ActionBar
                label="سجّل التسليم"
                onPress={() => {
                  dispatch({ type: 'order/deliver', id: order.id });
                  dispatch({ type: 'ui/openSheet', id: null });
                }}
              />
            </>
          ) : order.status === 'draft' && order.missing?.length ? (
            <p className="sim-form-help">{`مسودة — الناقص: ${order.missing.join(' و')}.`}</p>
          ) : null}
        </SheetBody>
      </Sheet>
    );
  }

  const delivery = state.deliveries.find((d) => d.id === refId);
  if (delivery) {
    const driverView = state.role === 'driver';
    const valid = delivery.quotes.find((q) => q.state === 'valid');
    const expired = valid?.expiresInMinutes !== undefined && minutesSinceOpen() > valid.expiresInMinutes;
    const STAGE_WORDS: Record<string, string> = {
      created: 'أُنشئ', awaitingQuote: 'بانتظار عرض سعر', quoteArrived: 'عرض سعر وصل',
      accepted: 'مقبول', inProgress: 'قيد التنفيذ', done: 'تمّ', failed: 'تعذّر',
    };
    return (
      <Sheet label={title} onDismiss={onDismiss}>
        <SheetBody>
          <LaterMark name="ObjectSheet" note="مكان ورقة الكائن الحقيقية" />
          <Surface>
            <ObjectRow label={delivery.owner} caption="المالك" leading={<EntityMark value={delivery.owner} />} />
            <ObjectRow label={`${delivery.from} ← ${delivery.to}`} caption="من ← إلى" />
            <ObjectRow label="الموعد" value={<span>{`${dateDisplay(delivery.date)}${delivery.time ? ` · ${time12(delivery.time)}` : ''}`}</span>} />
            <ObjectRow label={delivery.driver ?? '—'} caption={delivery.driver ? 'السائق' : 'السائق: —'} />
            <ObjectRow label="المرحلة" value={<span>{STAGE_WORDS[delivery.status] ?? delivery.status}</span>} />
            {delivery.description ? <ObjectRow label={delivery.description} caption="الوصف" /> : null}
            {delivery.quotes.map((q, i) => (
              <ObjectRow
                key={i}
                label={`${moneyText(q.amount)} د · ${time12(q.time)}`}
                caption={q.state === 'accepted' ? 'عرض مقبول' : q.state === 'superseded' ? 'مستبدل' : expired ? 'انتهى' : 'ساري'}
                value={<span className="sim-money">{moneyText(q.amount)} د</span>}
              />
            ))}
          </Surface>
          {delivery.status === 'quoteArrived' && !driverView && !expired ? (
            <ActionBar
              label="اقبل العرض"
              onPress={() => {
                dispatch({ type: 'quote/accept', deliveryId: delivery.id });
                dispatch({ type: 'ui/openSheet', id: null });
              }}
            />
          ) : null}
          {delivery.status === 'quoteArrived' && !driverView && expired ? (
            <p className="sim-form-help">انتهى عرض السعر — اطلب عرضًا جديدًا.</p>
          ) : null}
          {delivery.status === 'awaitingQuote' && driverView ? (
            <DriverQuoteForm deliveryId={delivery.id} />
          ) : null}
          {delivery.status === 'quoteArrived' && driverView ? (
            <p className="sim-form-help">عرضك بانتظار قرار المالك.</p>
          ) : null}
          {delivery.status === 'inProgress' && driverView ? (
            <DriverCompleteForm deliveryId={delivery.id} />
          ) : null}
          {delivery.status === 'failed' && !driverView && !delivery.issueClosed ? (
            <>
              <p className="sim-form-help">سائقك اعتذر عن التسليم — القرار لك دون إعادة البيانات:</p>
              <ActionBar
                label="وافق على المقترح"
                onPress={() => {
                  dispatch({ type: 'issue/resolve', deliveryId: delivery.id, approve: true });
                  dispatch({ type: 'ui/openSheet', id: null });
                }}
              />
              <div className="sim-sheet__gap" />
              <Button variant="text" onPress={() => { dispatch({ type: 'issue/resolve', deliveryId: delivery.id, approve: false }); dispatch({ type: 'ui/openSheet', id: null }); }}>
                ارفض وأعد المهمة للسائق
              </Button>
            </>
          ) : null}
        </SheetBody>
      </Sheet>
    );
  }

  if (fund) {
    const draft = state.movements.find((m) => !m.saved && (m.fund === fund.id || m.from === fund.id));
    const fundMovements = state.movements.filter((m) => m.saved && (m.fund === fund.id || m.from === fund.id || m.to === fund.id)).slice(-6).reverse();
    return (
      <Sheet label={title} onDismiss={onDismiss}>
        <SheetBody>
          <LaterMark name="ObjectSheet" note="مكان ورقة الكائن الحقيقية" />
          <LaterMark name="FundCard" note="بطاقة الصندوق الحقيقية تُركَّب هنا" />
          <Surface>
            <ObjectRow label="الرصيد الآن" value={<span className="sim-money">{moneyText(fundBalance(state.movements, fund.id))} د</span>} />
            {draft ? <ObjectRow label={`مسودة ${moneyText(draft.amount)} د`} caption="حركة لم تُحفظ على هذا الصندوق" leading={<DraftIcon size={24} />} onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${draft.id}` })} /> : null}
            {fundMovements.map((m) => (
              <ObjectRow
                key={m.id}
                label={`${m.type === 'in' ? 'داخل' : m.type === 'out' ? 'خارج' : 'تحويل'} · ${m.party ?? m.note ?? '—'}`}
                caption={`${m.id} · ${whenLine(m.date, m.time)}`}
                value={<span className="sim-money">{moneyText(m.amount)} د</span>}
                onPress={() => dispatch({ type: 'ui/openSheet', id: `object:${m.id}` })}
              />
            ))}
          </Surface>
        </SheetBody>
      </Sheet>
    );
  }

  return (
    <Sheet label={title} onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="ObjectSheet" note={title} />
      </SheetBody>
    </Sheet>
  );
}

/** جولة المستخدم: the supplier's price edit (the ListingEditor's temporary
 *  core until the real editor mounts): the new price goes to the review
 *  queue exactly like ع4's baked-in edit. */
export function EditListingSheet({ listingId, onDismiss }: { listingId: string; onDismiss: () => void }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  const listing = state.listings.find((l) => l.id === listingId);
  const [price, setPrice] = useState('');
  const fils = Math.round(Number.parseFloat(price) * 1000);
  const ok = listing !== undefined && Number.isFinite(fils) && fils > 0 && fils !== listing.price;
  if (!listing) return null;
  return (
    <Sheet label={`عدّل العرض · ${listing.title}`} variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="ListingEditor" note="بديل مؤقت: تعديل السعر فقط — المحرر الكامل يُركَّب في الجزء ب" />
        <Surface>
          <ObjectRow label="المنشور الآن" value={<span className="sim-money">{`${moneyText(listing.price ?? 0)} د`}</span>} />
        </Surface>
        <AmountField label="السعر الجديد" value={price} onChange={setPrice} caption="بالدينار" />
        <ActionBar
          label="أرسل التعديل"
          disabled={!ok}
          onPress={() => {
            if (!ok) return;
            dispatch({ type: 'listing/edit', listingId: listing.id, price: fils });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** ورقة الدفعة (ر2.3): amount + fund + the «اكتب مبلغاً حتى … د» error. */
export function PaymentSheet({ debtId, onDismiss }: { debtId: string; onDismiss: () => void }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  const debt = state.debts.find((d) => d.id === debtId);
  const [form, setForm] = useState<{ amount: string; fund: FundId | undefined }>({ amount: '', fund: undefined });
  const amount = Math.round(Number.parseFloat(form.amount) * 1000);
  const tooMuch = debt !== undefined && Number.isFinite(amount) && amount > debt.remaining;
  const complete = debt !== undefined && amount > 0 && !tooMuch && form.fund !== undefined;
  if (!debt) return null;
  return (
    <Sheet label={`سجّل دفعة · ${debt.party}`} variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <AmountField
          label="المبلغ"
          value={form.amount}
          onChange={(v) => setForm((f) => ({ ...f, amount: v }))}
          caption={`المتبقي ${moneyText(debt.remaining)} د`}
        />
        {tooMuch ? <p className="sim-form-help sim-form-help--error">{`اكتب مبلغاً حتى ${moneyText(debt.remaining)} د.`}</p> : null}
        <div className="sim-later-inline" data-sim-later="FundPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: FundPicker</span>
          <span className="sim-later__note">بديل مؤقت هنا حتى يُركَّب</span>
        </div>
        <SegmentedControl
          leading={FUNDS.map((f) => ({ value: f.id, label: f.name }))}
          value={form.fund ?? ''}
          onChange={(v) => setForm((f) => ({ ...f, fund: v as FundId }))}
          label="الصندوق"
        />
        <SaveState saveState="draft" />
        <ActionBar
          label="احفظ الدفعة"
          disabled={!complete}
          onPress={() => {
            if (!complete || !form.fund) return;
            dispatch({ type: 'debt/pay', debtId: debt.id, amount, fund: form.fund });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** A listing's details sheet (§5.8): the Gallery/price/supplier/contact places. */
export function ListingSheet({ listing, onDismiss }: { listing: Listing; onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const state = useSim();
  const ownApproved = state.role === 'supplier' && listing.supplier === 'مخبز الأصيل للجملة' && listing.status === 'approved';
  return (
    <Sheet label={listing.title} onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="Gallery">
          <span className="sim-later__name">يُركَّب لاحقًا: Gallery</span>
          <span className="sim-later__note">{`${listing.imageCount} صور`}</span>
        </div>
        <div className="sim-later-inline" data-sim-later="PriceTierTable">
          <span className="sim-later__name">يُركَّب لاحقًا: PriceTierTable</span>
          <span className="sim-later__note">
            {listing.tiers
              ? listing.tiers.map((t) => `${t.min}${t.max ? `–${t.max}` : ' فما فوق'}: ${moneyText(t.price)}`).join('، ')
              : `${moneyText(listing.price ?? 0)} د / ${listing.minOrder}`}
          </span>
        </div>
        <div className="sim-later-inline" data-sim-later="SupplierHeader">
          <span className="sim-later__name">يُركَّب لاحقًا: SupplierHeader</span>
          <span className="sim-later__note">{`${listing.supplier} · ${listing.governorate}`}</span>
        </div>
        <div className="sim-later-inline" data-sim-later="ContactBar">
          <span className="sim-later__name">يُركَّب لاحقًا: ContactBar</span>
          <span className="sim-later__note">التواصل مع المورد</span>
        </div>
        {ownApproved ? (
          <ObjectRow
            label="عدّل العرض"
            caption="السعر الجديد يذهب للمراجعة كما في ع4"
            onPress={() => {
              dispatch({ type: 'ui/openListing', id: null });
              dispatch({ type: 'ui/openSheet', id: `editListing:${listing.id}` });
            }}
          />
        ) : null}
        <ObjectRow
          label="أبلغ عن العرض"
          caption="more"
          onPress={() => {
            // The listing slot shadows the sheet slot, so the report sheet
            // only appears after the listing sheet leaves (جولة الناقد: the
            // row was dead — the report sheet never showed).
            dispatch({ type: 'ui/openListing', id: null });
            dispatch({ type: 'ui/openSheet', id: `report:${listing.id}` });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The report sheet (ر5.3) — جولة المستخدم: the reason rows are TEMPORARY
 *  built rows under the ReportSheet marker (its §5.2.7 reasons), and the
 *  report really lands on the listing for the reviewer's queue. */
export function ReportSheetShell({ listing, onDismiss }: { listing: Listing; onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [reason, setReason] = useState<string | null>(null);
  return (
    <Sheet label="أبلغ عن العرض" onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="ReportSheet" note="بديل مؤقت: أسباب §5.2.7 كصفوف اختيار" />
        <Surface>
          {['معلومات مضللة', 'إعلان مزعج', 'مخالف لقواعد السوق'].map((r) => (
            <ObjectRow
              key={r}
              label={r}
              trailing={reason === r ? <SelectedIcon size={20} /> : undefined}
              onPress={() => setReason(r)}
            />
          ))}
        </Surface>
        <SaveState saveState={reason ? 'draft' : 'failed'} />
        {!reason ? <p className="sim-form-help">اختر سبب البلاغ.</p> : null}
        <ActionBar
          label="أرسل البلاغ"
          disabled={!reason}
          onPress={() => {
            if (!reason) return;
            dispatch({ type: 'listing/report', listingId: listing.id, reason });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The listing form (م1 §5.6's ListingEditor) — built fields real. */
export function NewListingSheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [form, setForm] = useState<{
    title: string;
    unit: string;
    price: string;
    tiers: ReadonlyArray<{ min: number; max: number | null; price: number }> | null;
    tierPrices: [string, string, string];
    available: boolean;
    description: string;
    imageCount: number;
  }>({ title: '', unit: '', price: '', tiers: null, tierPrices: ['', '', ''], available: true, description: '', imageCount: 0 });
  // جولة المستخدم: «إرسال بلا صورة» خطأ المواصفة — الزر معطّل بسببه حتى
  // يؤكد الصور (بديل مؤقت موسوم إلى PhotoUploader).
  const complete = form.title.trim() !== '' && form.unit.trim() !== '' && form.imageCount > 0 && (form.tiers === null || form.tierPrices.every((t) => Number.parseFloat(t) > 0));
  return (
    <Sheet label="عرض جديد" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="PhotoUploader">
          <span className="sim-later__name">يُركَّب لاحقًا: PhotoUploader</span>
          <span className="sim-later__note">الصور — بلا صورة: خطأ الإرسال</span>
        </div>
        <TextField
          label="اسم العرض"
          value={form.title}
          onChange={(title) => setForm((f) => ({ ...f, title }))}
        />
        <TextField
          label="العبوة"
          placeholder="كرتونة 12 قطعة"
          value={form.unit}
          onChange={(unit) => setForm((f) => ({ ...f, unit }))}
        />
        <SegmentedControl
          leading={[
            { value: 'single', label: 'سعر واحد' },
            { value: 'tiers', label: 'شرائح' },
          ]}
          value={form.tiers ? 'tiers' : 'single'}
          onChange={(v) => setForm((f) => ({ ...f, tiers: v === 'tiers' ? [{ min: 1, max: null, price: 0 }] : null }))}
          label="طريقة السعر"
        />
        {form.tiers ? (
          <>
            <div className="sim-later-inline" data-sim-later="PriceTierBuilder">
              <span className="sim-later__name">يُركَّب لاحقًا: PriceTierBuilder</span>
              <span className="sim-later__note">بديل مؤقت: ثلاث شرائح ثابتة الحدود وأسعارها حقيقية (ر5.2)</span>
            </div>
            <AmountField label="الشريحة 1 (1–9)" value={form.tierPrices[0]!} onChange={(v) => setForm((f) => ({ ...f, tierPrices: [v, f.tierPrices[1]!, f.tierPrices[2]!] }))} />
            <AmountField label="الشريحة 2 (10–49)" value={form.tierPrices[1]!} onChange={(v) => setForm((f) => ({ ...f, tierPrices: [f.tierPrices[0]!, v, f.tierPrices[2]!] }))} />
            <AmountField label="الشريحة 3 (50 فما فوق)" value={form.tierPrices[2]!} onChange={(v) => setForm((f) => ({ ...f, tierPrices: [f.tierPrices[0]!, f.tierPrices[1]!, v] }))} />
          </>
        ) : (
          <AmountField
            label="السعر للعبوة"
            value={form.price}
            onChange={(price) => setForm((f) => ({ ...f, price }))}
          />
        )}
        <Toggle
          label="متوفر"
          selected={form.available}
          onChange={(available) => setForm((f) => ({ ...f, available }))}
        />
        <div className="sim-later-inline" data-sim-later="PhotoUploader">
          <span className="sim-later__name">يُركَّب لاحقًا: PhotoUploader</span>
          <span className="sim-later__note">بديل مؤقت: تأكيد إرفاق الصور (صورتان تجريبيتان)</span>
        </div>
        <Toggle
          label="الصور أُرفقت (مؤقت حتى يُركَّب رافع الصور)"
          selected={form.imageCount > 0}
          onChange={(v) => setForm((f) => ({ ...f, imageCount: v ? 2 : 0 }))}
        />
        <TextArea
          label="الوصف"
          value={form.description}
          onChange={(description) => setForm((f) => ({ ...f, description }))}
          caption="اختياري"
        />
        <SaveState saveState="draft" />
        {!complete ? <p className="sim-form-help">{form.imageCount === 0 ? 'أضف صورة أولاً.' : !form.title.trim() ? 'اكتب اسم العرض.' : !form.unit.trim() ? 'اكتب العبوة.' : 'أكمل أسعار الشرائح الثلاث.'}</p> : null}
        <ActionBar
          label="أرسل للمراجعة"
          disabled={!complete}
          onPress={() => {
            if (!complete) return;
            dispatch({
              type: 'listing/create',
              input: {
                title: form.title,
                unit: form.unit,
                imageCount: form.imageCount,
                tiers:
                  form.tiers === null
                    ? [{ min: 1, max: null, price: Math.round(Number.parseFloat(form.price) * 1000) }]
                    : [
                        { min: 1, max: 9, price: Math.round(Number.parseFloat(form.tierPrices[0]!) * 1000) },
                        { min: 10, max: 49, price: Math.round(Number.parseFloat(form.tierPrices[1]!) * 1000) },
                        { min: 50, max: null, price: Math.round(Number.parseFloat(form.tierPrices[2]!) * 1000) },
                      ],
              },
            });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The movement form (2.7's ورقة «سجّل حركة») — جولة المستخدم: the form now
 *  WORKS end to end. The batch-2 controls that own type/fund/date are still
 *  markers, so until they mount the sim offers TEMPORARY real controls
 *  (built SegmentedControl rows) under each marker — documented in
 *  REPORT-SIM as a temporary accommodation; the save stays disabled with its
 *  reason until the form is complete. */
export function MovementSheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [form, setForm] = useState<{
    type: MovementInput['type'] | undefined;
    fund: FundId | undefined;
    from: FundId | undefined;
    to: FundId | undefined;
    amount: string;
    party: string;
    note: string;
    day: 'today' | 'yesterday';
  }>({ type: undefined, fund: undefined, from: undefined, to: undefined, amount: '', party: '', note: '', day: 'today' });
  const amountOk = Number.parseFloat(form.amount) > 0;
  const transferReady = form.type !== 'transfer' || (form.from !== undefined && form.to !== undefined && form.from !== form.to);
  const sameFund = form.type === 'transfer' && form.from !== undefined && form.to !== undefined && form.from === form.to;
  const complete = form.type !== undefined && amountOk && transferReady && (form.type === 'transfer' || form.fund !== undefined);
  const fundSegments: readonly SegmentOption[] = FUNDS.map((f) => ({ value: f.id, label: f.name }));
  const daySegments: readonly SegmentOption[] = [
    { value: 'today', label: 'اليوم' },
    { value: 'yesterday', label: 'أمس' },
  ];
  return (
    <Sheet label="سجّل حركة" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="MovementTypeControl">
          <span className="sim-later__name">يُركَّب لاحقًا: MovementTypeControl</span>
          <span className="sim-later__note">بديل مؤقت هنا حتى يُركَّب — الاختيار حقيقي</span>
        </div>
        <SegmentedControl
          leading={[
            { value: 'in', label: 'داخل' },
            { value: 'out', label: 'خارج' },
            { value: 'transfer', label: 'تحويل' },
          ]}
          value={form.type ?? ''}
          onChange={(v) => setForm((f) => ({ ...f, type: v as MovementInput['type'] }))}
          label="النوع"
        />
        <AmountField
          label="المبلغ"
          value={form.amount}
          onChange={(amount) => setForm((f) => ({ ...f, amount }))}
        />
        <div className="sim-later-inline" data-sim-later="AmountKeypad">
          <span className="sim-later__name">يُركَّب لاحقًا: AmountKeypad</span>
        </div>
        {form.type === 'transfer' ? (
          <>
            <div className="sim-later-inline" data-sim-later="FundPicker">
              <span className="sim-later__name">يُركَّب لاحقًا: FundPicker</span>
              <span className="sim-later__note">بديل مؤقت — من وإلى</span>
            </div>
            <SegmentedControl
              leading={fundSegments}
              value={form.from ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, from: v as FundId }))}
              label="من"
            />
            <SegmentedControl
              leading={fundSegments}
              value={form.to ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, to: v as FundId }))}
              label="إلى"
            />
            {sameFund ? <p className="sim-form-help sim-form-help--error">من وإلى لا يكونان الصندوق نفسه.</p> : null}
          </>
        ) : (
          <>
            <div className="sim-later-inline" data-sim-later="FundPicker">
              <span className="sim-later__name">يُركَّب لاحقًا: FundPicker</span>
              <span className="sim-later__note">بديل مؤقت هنا حتى يُركَّب</span>
            </div>
            <SegmentedControl
              leading={fundSegments}
              value={form.fund ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, fund: v as FundId }))}
              label="الصندوق"
            />
          </>
        )}
        <div className="sim-later-inline" data-sim-later="PartyPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: PartyPicker</span>
          <span className="sim-later__note">بديل مؤقت: كتابة الاسم مباشرة</span>
        </div>
        <TextField
          label="الطرف"
          placeholder="مثال: سلمى الحوراني"
          value={form.party}
          onChange={(party) => setForm((f) => ({ ...f, party }))}
          caption="اختياري"
        />
        <div className="sim-later-inline" data-sim-later="DateQuickChips">
          <span className="sim-later__name">يُركَّب لاحقًا: DateQuickChips</span>
          <span className="sim-later__note">بديل مؤقت: اليوم أو أمس</span>
        </div>
        <SegmentedControl
          leading={daySegments}
          value={form.day}
          onChange={(v) => setForm((f) => ({ ...f, day: v as 'today' | 'yesterday' }))}
          label="التاريخ"
        />
        <TextArea
          label="ملاحظة"
          value={form.note}
          onChange={(note) => setForm((f) => ({ ...f, note }))}
          caption="اختياري"
        />
        <SaveState saveState="draft" />
        {!complete ? (
          <p className="sim-form-help">
            {sameFund
              ? 'اختر صندوقين مختلفين للتحويل.'
              : !form.type
                ? 'اختر النوع.'
                : !amountOk
                  ? 'اكتب المبلغ.'
                  : form.type === 'transfer'
                    ? 'اختر من وإلى.'
                    : 'اختر الصندوق.'}
          </p>
        ) : null}
        <ActionBar
          label="احفظ الحركة"
          disabled={!complete}
          onPress={() => {
            if (!complete || !form.type) return;
            const input: MovementInput = {
              type: form.type,
              fund: form.type === 'transfer' ? undefined : form.fund,
              from: form.type === 'transfer' ? form.from : undefined,
              to: form.type === 'transfer' ? form.to : undefined,
              amount: Math.round(Number.parseFloat(form.amount) * 1000),
              party: form.party.trim() || null,
              note: form.note,
              date: form.day === 'yesterday' ? '2026-11-26' : undefined,
            };
            dispatch({ type: 'movement/save', input });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The order form (§2.2.5's ورقة «طلب جديد») — جولة المستخدم: the form WORKS.
 *  The customer/date/time pickers are still markers; until they mount the
 *  sim offers TEMPORARY real inputs (a TextField for the customer, اليوم /
 *  غدًا / بعد غد chips for the date, a TextField parsing «4:00 م» for the
 *  time) — documented in REPORT-SIM as a temporary accommodation. Without a
 *  price the order saves as مسودة (§2.2.5 + ر3.1's expected error). */
export function NewOrderSheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [form, setForm] = useState<{
    customer: string;
    content: string;
    price: string;
    dueDay: 'today' | 'tomorrow' | 'afterTomorrow' | null;
    time: string;
    status: 'confirmed' | 'tentative';
    note: string;
  }>({ customer: '', content: '', price: '', dueDay: null, time: '', status: 'confirmed', note: '' });
  const DUE_DAYS: readonly { value: 'today' | 'tomorrow' | 'afterTomorrow'; label: string; iso: string }[] = [
    { value: 'today', label: 'اليوم', iso: '2026-11-27' },
    { value: 'tomorrow', label: 'غدًا', iso: '2026-11-28' },
    { value: 'afterTomorrow', label: 'بعد غد', iso: '2026-11-29' },
  ];
  const timeIso = form.time.trim() ? parseTimeInput(form.time) : null;
  const timeInvalid = form.time.trim() !== '' && timeIso === null;
  const missingCustomer = !form.customer.trim();
  const missingDate = form.dueDay === null;
  const priceValue = form.price.trim() === '' ? null : Math.round(Number.parseFloat(form.price) * 1000);
  const priceInvalid = priceValue !== null && (!Number.isFinite(priceValue) || priceValue <= 0);
  // ر3.1's expected error: بلا سعر يُحفظ «مسودة» — النقص لا يمنع الحفظ، بل يغيّر حالته.
  const blocked = missingCustomer || missingDate || timeInvalid || priceInvalid;
  const STATUS_SEGMENTS: readonly SegmentOption[] = [
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'tentative', label: 'اتفاق مبدئي' },
  ];
  const blockedReason = missingCustomer
    ? 'اكتب اسم العميل.'
    : missingDate
      ? 'اختر موعد التسليم.'
      : priceInvalid
        ? 'اكتب سعرًا صحيحًا — أو اتركه فارغًا ليُحفظ مسودة.'
        : null; // خطأ الوقت يظهر تحت حقل الوقت نفسه — لا تكرار
  return (
    <Sheet label="طلب جديد" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="PartyPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: PartyPicker</span>
          <span className="sim-later__note">بديل مؤقت: كتابة الاسم مباشرة</span>
        </div>
        <TextField
          label="العميل"
          placeholder="مثال: سلمى الحوراني"
          value={form.customer}
          onChange={(customer) => setForm((f) => ({ ...f, customer }))}
        />
        <TextArea
          label="المحتوى"
          value={form.content}
          onChange={(content) => setForm((f) => ({ ...f, content }))}
        />
        <AmountField
          label="السعر"
          value={form.price}
          onChange={(price) => setForm((f) => ({ ...f, price }))}
        />
        <div className="sim-later-inline" data-sim-later="DatePicker">
          <span className="sim-later__name">يُركَّب لاحقًا: DatePicker</span>
          <span className="sim-later__note">بديل مؤقت: اليوم / غدًا / بعد غد</span>
        </div>
        <SegmentedControl
          leading={DUE_DAYS.map((d) => ({ value: d.value, label: d.label }))}
          value={form.dueDay ?? ''}
          onChange={(v) => setForm((f) => ({ ...f, dueDay: v as 'today' | 'tomorrow' | 'afterTomorrow' }))}
          label="موعد التسليم"
        />
        <div className="sim-later-inline" data-sim-later="TimePicker">
          <span className="sim-later__name">يُركَّب لاحقًا: TimePicker</span>
          <span className="sim-later__note">بديل مؤقت: كتابة الوقت</span>
        </div>
        <TextField
          label="الوقت"
          placeholder="مثال: 4:00 م أو 16:00"
          value={form.time}
          onChange={(time) => setForm((f) => ({ ...f, time }))}
          caption="اختياري"
        />
        {timeInvalid ? <p className="sim-form-help sim-form-help--error">اكتب الوقت مثل 4:00 م أو 16:00.</p> : null}
        <TextArea
          label="ملاحظة"
          value={form.note}
          onChange={(note) => setForm((f) => ({ ...f, note }))}
          caption="اختياري"
        />
        <SegmentedControl
          leading={STATUS_SEGMENTS}
          value={form.status}
          onChange={(v) => setForm((f) => ({ ...f, status: v as 'confirmed' | 'tentative' }))}
          disabled={blocked}
          label="الحالة"
        />
        {blocked && blockedReason ? <p className="sim-form-help">{blockedReason}</p> : null}
        {!blocked && priceValue === null ? (
          <p className="sim-form-help">بلا سعر يُحفظ «مسودة» ويظهر في «يحتاجك» بخطوة أكمل السعر.</p>
        ) : null}
        <SaveState saveState="draft" />
        <ActionBar
          label="احفظ الطلب"
          disabled={blocked || timeInvalid}
          onPress={() => {
            if (blocked || timeInvalid) return;
            const iso = DUE_DAYS.find((d) => d.value === form.dueDay)?.iso;
            if (!iso) return;
            const input: OrderInput = {
              customer: form.customer.trim(),
              content: form.content,
              price: priceValue,
              dueDate: iso,
              time: timeIso,
              durationMinutes: null,
              status: form.status,
            };
            dispatch({ type: 'order/save', input });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The delivery form (م1 §4.10's ورقة «اطلب توصيلاً») — جولة المستخدم: the
 *  form WORKS. The location/date/time/driver pickers are still markers; the
 *  sim offers TEMPORARY real inputs (from/to TextFields with the known
 *  areas' placeholders, اليوم/غدًا chips, a time TextField parsing «4:00 م»،
 *  and a driver SegmentedControl over the APPROVED drivers only) — the
 *  temporary accommodation is documented in REPORT-SIM. */
export function NewDeliverySheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const state = useSim();
  const [form, setForm] = useState<{
    from: string;
    to: string;
    day: 'today' | 'tomorrow';
    time: string;
    description: string;
    driver: string | null;
  }>({ from: '', to: '', day: 'today', time: '', description: '', driver: null });
  const approvedDrivers = state.drivers.filter((d) => d.status === 'approved');
  const timeIso = form.time.trim() ? parseTimeInput(form.time) : null;
  const timeInvalid = form.time.trim() !== '' && timeIso === null;
  const complete =
    form.from.trim() !== '' && form.to.trim() !== '' && form.driver !== null && !timeInvalid;
  return (
    <Sheet label="اطلب توصيلاً" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="LocationSlot">
          <span className="sim-later__name">يُركَّب لاحقًا: LocationSlot</span>
          <span className="sim-later__note">بديل مؤقت: كتابة المنطتين مباشرة</span>
        </div>
        <TextField label="من" placeholder="مثال: طبربور" value={form.from} onChange={(from) => setForm((f) => ({ ...f, from }))} />
        <TextField label="إلى" placeholder="مثال: الزرقاء، حي معصوم" value={form.to} onChange={(to) => setForm((f) => ({ ...f, to }))} />
        <div className="sim-later-inline" data-sim-later="DateQuickChips">
          <span className="sim-later__name">يُركَّب لاحقًا: DateQuickChips</span>
          <span className="sim-later__note">بديل مؤقت: اليوم / غدًا</span>
        </div>
        <SegmentedControl
          leading={[
            { value: 'today', label: 'اليوم' },
            { value: 'tomorrow', label: 'غدًا' },
          ]}
          value={form.day}
          onChange={(v) => setForm((f) => ({ ...f, day: v as 'today' | 'tomorrow' }))}
          label="اليوم"
        />
        <div className="sim-later-inline" data-sim-later="TimePicker">
          <span className="sim-later__name">يُركَّب لاحقًا: TimePicker</span>
          <span className="sim-later__note">بديل مؤقت: كتابة الوقت</span>
        </div>
        <TextField label="الوقت" placeholder="مثال: 4:00 م أو 16:00" value={form.time} onChange={(time) => setForm((f) => ({ ...f, time }))} caption="اختياري" />
        {timeInvalid ? <p className="sim-form-help sim-form-help--error">اكتب الوقت مثل 4:00 م أو 16:00.</p> : null}
        <TextArea
          label="الوصف"
          value={form.description}
          onChange={(description) => setForm((f) => ({ ...f, description }))}
          caption="اختياري"
        />
        <div className="sim-later-inline" data-sim-later="PartyPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: PartyPicker</span>
          <span className="sim-later__note">بديل مؤقت: السائقون المعتمدون</span>
        </div>
        <SegmentedControl
          leading={approvedDrivers.map((d) => ({ value: d.id, label: d.name }))}
          value={form.driver ?? ''}
          onChange={(v) => setForm((f) => ({ ...f, driver: approvedDrivers.find((d) => d.id === v)?.name ?? null }))}
          label="السائق"
        />
        <SaveState saveState="draft" />
        {!complete ? (
          <p className="sim-form-help">
            {form.from.trim() === '' ? 'اكتب من أين يبدأ التوصيل.' : form.to.trim() === '' ? 'اكتب إلى أين.' : form.driver === null ? 'اختر السائق.' : ''}
          </p>
        ) : null}
        <ActionBar
          label="أرسل الطلب"
          disabled={!complete}
          onPress={() => {
            if (!complete || !form.driver) return;
            const iso = form.day === 'tomorrow' ? '2026-11-28' : '2026-11-27';
            const input: DeliveryInput = {
              from: form.from.trim(),
              to: form.to.trim(),
              date: iso,
              time: timeIso,
              content: form.description,
              driver: form.driver,
            };
            dispatch({ type: 'delivery/create', input });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** جولة المستخدم: the driver's quote form inside ت4's sheet (ر4.1's engine —
 *  the real DriverJobCard mounts its own in part B; this is the sim's
 *  temporary form with the marker riding it). */
function DriverQuoteForm({ deliveryId }: { deliveryId: string }) {
  const dispatch = useSimDispatch();
  const [amount, setAmount] = useState('');
  const fils = Math.round(Number.parseFloat(amount) * 1000);
  const ok = Number.isFinite(fils) && fils > 0;
  return (
    <>
      <div className="sim-later-inline" data-sim-later="QuoteForm">
        <span className="sim-later__name">يُركَّب لاحقًا: نموذج العرض داخل DriverJobCard</span>
        <span className="sim-later__note">بديل مؤقت — السعر حقيقي ويُستبدل العرض السابق</span>
      </div>
      <AmountField label="سعرك" value={amount} onChange={setAmount} caption="بالدينار" />
      <ActionBar
        label="أرسل العرض"
        disabled={!ok}
        onPress={() => {
          if (!ok) return;
          dispatch({ type: 'quote/submit', deliveryId, amount: fils });
          dispatch({ type: 'ui/openSheet', id: null });
        }}
      />
    </>
  );
}

/** جولة المستخدم: the driver's completion on ت3 — the photo is a temporary
 *  toggle until PhotoUploader mounts (ر4.3: without it the button is
 *  disabled with its reason; SlideToConfirm rides the real card in part B). */
function DriverCompleteForm({ deliveryId }: { deliveryId: string }) {
  const dispatch = useSimDispatch();
  const [photo, setPhoto] = useState(false);
  return (
    <>
      <div className="sim-later-inline" data-sim-later="PhotoUploader">
        <span className="sim-later__name">يُركَّب لاحقًا: PhotoUploader</span>
        <span className="sim-later__note">بديل مؤقت: تأكيد رفع صورة الإثبات</span>
      </div>
      <Toggle label="صورة الإثبات أُرفقت (مؤقت حتى يُركَّب رافع الصور)" selected={photo} onChange={setPhoto} />
      <ActionBar
        label="تمّ التسليم"
        disabled={!photo}
        onPress={() => {
          if (!photo) return;
          dispatch({ type: 'delivery/complete', deliveryId, evidence: 'photo' });
          dispatch({ type: 'ui/openSheet', id: null });
        }}
      />
      {!photo ? <p className="sim-form-help">أضف صورة الإثبات أولاً.</p> : null}
      <Button variant="text" onPress={() => dispatch({ type: 'ui/openSheet', id: `issue:${deliveryId}` })}>
        لم أستطع التسليم
      </Button>
    </>
  );
}

/** ورقة التعذّر (ر4.4): the reason + the proposed action (the owner's
 *  recorded proposal texts) — «أرسل للمالك» closes the sheet; the SimBar
 *  then carries «بدّل إلى المالك». */
function IssueSheet({ deliveryId, onDismiss }: { deliveryId: string; onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<string | null>(null);
  const ACTIONS: readonly SegmentOption[] = [
    { value: 'أعد المحاولة لاحقًا', label: 'أعد المحاولة لاحقًا' },
    { value: 'أرجع الطلب للورشة', label: 'أرجع الطلب للورشة' },
  ];
  const ok = reason.trim() !== '' && action !== null;
  return (
    <Sheet label="لم أستطع التسليم" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <TextArea label="السبب" value={reason} onChange={setReason} placeholder="مثال: المستلم لا يرد" />
        <p className="sim-form-help">الإجراء المقترح (صفوف اختيار):</p>
        <SegmentedControl leading={ACTIONS} value={action ?? ''} onChange={(v) => setAction(v)} label="الإجراء المقترح" />
        <ActionBar
          label="أرسل للمالك"
          disabled={!ok}
          onPress={() => {
            if (!ok || !action) return;
            dispatch({ type: 'issue/propose', deliveryId, reason: reason.trim(), action });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/**
 * The router of the sheets driven by `ui.sheet` (+ `ui.openListing`) — the
 * single place every sheet opens from, so each screen only dispatches.
 */
export function SharedSheets() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const close = () => dispatch({ type: 'ui/openSheet', id: null });
  const sheet = state.ui.sheet;
  const listing = state.listings.find((l) => l.id === state.ui.openListing) ?? null;

  if (listing) {
    return (
      <ListingSheet listing={listing} onDismiss={() => dispatch({ type: 'ui/openListing', id: null })} />
    );
  }
  if (!sheet) return null;
  if (sheet === 'ask') return <AskSheet onDismiss={close} />;
  if (sheet === 'notifications') return <NotificationsSheet onDismiss={close} />;
  if (sheet === 'project-switcher') return <ProjectSheet onDismiss={close} />;
  if (sheet === 'source') return <SourceSheet onDismiss={close} />;
  if (sheet === 'needsYouAll') return <NeedsYouAllSheet onDismiss={close} />;
  if (sheet === 'movement') return <MovementSheet onDismiss={close} />;
  if (sheet === 'newOrder') return <NewOrderSheet onDismiss={close} />;
  if (sheet === 'newListing') return <NewListingSheet onDismiss={close} />;
  if (sheet === 'newDelivery') return <NewDeliverySheet onDismiss={close} />;
  if (sheet.startsWith('report:')) {
    const target = state.listings.find((l) => l.id === sheet.slice('report:'.length)) ?? state.listings[0]!;
    return <ReportSheetShell listing={target} onDismiss={close} />;
  }
  if (sheet.startsWith('pay:')) {
    return <PaymentSheet debtId={sheet.slice('pay:'.length)} onDismiss={close} />;
  }
  if (sheet.startsWith('editListing:')) {
    return <EditListingSheet listingId={sheet.slice('editListing:'.length)} onDismiss={close} />;
  }
  if (sheet.startsWith('issue:')) {
    return <IssueSheet deliveryId={sheet.slice('issue:'.length)} onDismiss={close} />;
  }
  if (sheet.startsWith('decision:')) {
    const id = sheet.slice('decision:'.length);
    const listing = state.listings.find((l) => l.id === id);
    if (listing) return <DecisionSheet listing={listing} mode="queue" onDismiss={close} />;
  }
  if (sheet.startsWith('reports:')) {
    const id = sheet.slice('reports:'.length);
    const listing = state.listings.find((l) => l.id === id);
    if (listing) return <DecisionSheet listing={listing} mode="reports" onDismiss={close} />;
  }
  if (sheet.startsWith('driverDecision:')) {
    return <DriverDecisionSheet driverId={sheet.slice('driverDecision:'.length)} onDismiss={close} />;
  }
  if (sheet.startsWith('object:')) {
    const refId = sheet.slice('object:'.length);
    return <ObjectSheetShell title={objectTitle(refId, state)} refId={refId} onDismiss={close} />;
  }
  return null;
}
