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
import { LaterMark, needsCard, moneyText, todayNeedsYouList } from './parts';

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
export function NotificationsSheet({ onDismiss }: { onDismiss: () => void }) {
  const state = useSim();
  const role = state.role === 'guest' ? 'owner' : state.role ?? 'owner';
  const items = state.notifications.filter((n) => n.role === role);
  return (
    <Sheet label="الإشعارات" onDismiss={onDismiss}>
      <SheetBody>
        {items.length ? (
          <LaterMark name="NotificationCenter" note={`${items.length} إشعارات · ${items.filter((n) => !n.read).length} غير مقروءة`} />
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

/** An object sheet's place (the batch-2 ObjectSheet mounts in part B). */
export function ObjectSheetShell({ title, onDismiss }: { title: string; onDismiss: () => void }) {
  return (
    <Sheet label={title} onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="ObjectSheet" note={title} />
      </SheetBody>
    </Sheet>
  );
}

/** A listing's details sheet (§5.8): the Gallery/price/supplier/contact places. */
export function ListingSheet({ listing, onDismiss }: { listing: Listing; onDismiss: () => void }) {
  const dispatch = useSimDispatch();
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

/** The report sheet's place (ر5.3's action mounts with ReportSheet in part B). */
export function ReportSheetShell({ listing, onDismiss }: { listing: Listing; onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  // The reason picker is a batch-2 marker in part A, so no reason is ever
  // picked here and the report honestly stays unsaved.
  const reason: string | null = null;
  return (
    <Sheet label="أبلغ عن العرض" onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="ReportSheet" note={`${listing.title} · الأسباب: معلومات مضللة، إعلان مزعج…`} />
        <SaveState saveState="draft" />
        <ActionBar
          label="أرسل البلاغ"
          onPress={() => {
            if (!reason) return; // the reason picker is a batch-2 marker in part A.
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
    available: boolean;
    description: string;
    imageCount: number;
  }>({ title: '', unit: '', price: '', tiers: null, available: true, description: '', imageCount: 0 });
  const complete = form.title.trim() !== '' && form.unit.trim() !== '' && form.imageCount > 0;
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
          <div className="sim-later-inline" data-sim-later="PriceTierBuilder">
            <span className="sim-later__name">يُركَّب لاحقًا: PriceTierBuilder</span>
            <span className="sim-later__note">بناء الشرائح (ر5.2: ثلاث شرائح)</span>
          </div>
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
        <TextArea
          label="الوصف"
          value={form.description}
          onChange={(description) => setForm((f) => ({ ...f, description }))}
          caption="اختياري"
        />
        <SaveState saveState="draft" />
        <ActionBar
          label="أرسل للمراجعة"
          onPress={() => {
            if (!complete) return; // the photos ride the real PhotoUploader in part B.
            dispatch({
              type: 'listing/create',
              input: {
                title: form.title,
                unit: form.unit,
                imageCount: form.imageCount,
                tiers: form.tiers ?? [{ min: 1, max: null, price: Math.round(Number.parseFloat(form.price) * 1000) }],
              },
            });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The movement form (2.7's ورقة «سجّل حركة») — built fields real. */
export function MovementSheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  // The form's own state; the batch-2 controls that own type/fund/party are
  // markers in part A, so those fields stay empty and the save stays a draft.
  const [form, setForm] = useState<{
    type: MovementInput['type'] | undefined;
    fund: FundId | undefined;
    amount: string;
    note: string;
  }>({ type: undefined, fund: undefined, amount: '', note: '' });
  const amountOk = Number.parseFloat(form.amount) > 0;
  const complete = form.type !== undefined && form.fund !== undefined && amountOk;
  return (
    <Sheet label="سجّل حركة" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="MovementTypeControl">
          <span className="sim-later__name">يُركَّب لاحقًا: MovementTypeControl</span>
          <span className="sim-later__note">داخل · خارج · تحويل</span>
        </div>
        <AmountField
          label="المبلغ"
          value={form.amount}
          onChange={(amount) => setForm((f) => ({ ...f, amount }))}
        />
        <div className="sim-later-inline" data-sim-later="AmountKeypad">
          <span className="sim-later__name">يُركَّب لاحقًا: AmountKeypad</span>
        </div>
        <div className="sim-later-inline" data-sim-later="FundPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: FundPicker</span>
          <span className="sim-later__note">درج الكاش · الحساب البنكي · المحفظة</span>
        </div>
        <div className="sim-later-inline" data-sim-later="PartyPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: PartyPicker</span>
          <span className="sim-later__note">اختياري</span>
        </div>
        <div className="sim-later-inline" data-sim-later="DateQuickChips">
          <span className="sim-later__name">يُركَّب لاحقًا: DateQuickChips</span>
        </div>
        <TextArea
          label="ملاحظة"
          value={form.note}
          onChange={(note) => setForm((f) => ({ ...f, note }))}
          caption="اختياري"
        />
        <SaveState saveState="draft" />
        <ActionBar
          label="احفظ الحركة"
          onPress={() => {
            if (!complete || !form.type || !form.fund) return;
            const input: MovementInput = {
              type: form.type,
              fund: form.fund,
              amount: Math.round(Number.parseFloat(form.amount) * 1000),
              party: null,
              note: form.note,
            };
            dispatch({ type: 'movement/save', input });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
      </SheetBody>
    </Sheet>
  );
}

/** The order form (§2.2.5's ورقة «طلب جديد») — built fields real. */
export function NewOrderSheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [form, setForm] = useState<{
    customer: string | null;
    content: string;
    price: string;
    dueDate: string | null;
    status: 'confirmed' | 'tentative';
    note: string;
  }>({ customer: null, content: '', price: '', dueDate: null, status: 'confirmed', note: '' });
  const missing = !form.customer || !form.dueDate || !form.price;
  const STATUS_SEGMENTS: readonly SegmentOption[] = [
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'tentative', label: 'اتفاق مبدئي' },
  ];
  return (
    <Sheet label="طلب جديد" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="PartyPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: PartyPicker</span>
          <span className="sim-later__note">العميل</span>
        </div>
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
          <span className="sim-later__note">موعد التسليم</span>
        </div>
        <div className="sim-later-inline" data-sim-later="TimePicker">
          <span className="sim-later__name">يُركَّب لاحقًا: TimePicker</span>
          <span className="sim-later__note">اختياري</span>
        </div>
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
          disabled={missing}
          label="الحالة"
        />
        {missing ? <p className="sim-form-help">يُحفظ مسودة حتى تكمل السعر والموعد.</p> : null}
        <SaveState saveState="draft" />
        <ActionBar
          label="احفظ الطلب"
          onPress={() => {
            if (missing || !form.customer || !form.dueDate || !form.content.trim()) return;
            const input: OrderInput = {
              customer: form.customer,
              content: form.content,
              price: Math.round(Number.parseFloat(form.price) * 1000),
              dueDate: form.dueDate,
              time: null,
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

/** The delivery form (م1 §4.10's ورقة «اطلب توصيلاً»). */
export function NewDeliverySheet({ onDismiss }: { onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [form, setForm] = useState<{
    from: string | null;
    to: string | null;
    date: string | null;
    time: string | null;
    description: string;
    driver: string | null;
  }>({ from: null, to: null, date: null, time: null, description: '', driver: null });
  const complete = Boolean(form.from && form.to && form.date && form.driver);
  return (
    <Sheet label="اطلب توصيلاً" variant="form" onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-later-inline" data-sim-later="LocationSlot">
          <span className="sim-later__name">يُركَّب لاحقًا: LocationSlot</span>
          <span className="sim-later__note">من · إلى</span>
        </div>
        <div className="sim-later-inline" data-sim-later="DateQuickChips">
          <span className="sim-later__name">يُركَّب لاحقًا: DateQuickChips</span>
        </div>
        <div className="sim-later-inline" data-sim-later="TimePicker">
          <span className="sim-later__name">يُركَّب لاحقًا: TimePicker</span>
        </div>
        <TextArea
          label="الوصف"
          value={form.description}
          onChange={(description) => setForm((f) => ({ ...f, description }))}
        />
        <div className="sim-later-inline" data-sim-later="PartyPicker">
          <span className="sim-later__name">يُركَّب لاحقًا: PartyPicker</span>
          <span className="sim-later__note">السائق — وضع السائقين المعتمدين</span>
        </div>
        <SaveState saveState="draft" />
        <ActionBar
          label="أرسل الطلب"
          onPress={() => {
            if (!complete || !form.from || !form.to || !form.date || !form.driver) return;
            const input: DeliveryInput = {
              from: form.from,
              to: form.to,
              date: form.date,
              time: form.time,
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
  if (sheet.startsWith('object:')) {
    return <ObjectSheetShell title={objectTitle(sheet.slice('object:'.length), state)} onDismiss={close} />;
  }
  return null;
}
