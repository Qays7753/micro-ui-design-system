/**
 * جولة المستخدم — the reviewer's decision sheets: the DecisionCard's PLACE
 * (a marker — the real component mounts in part B) carries the REAL decision
 * mechanism with built components: the §6.2 verification items (sim
 * proposals awaiting the owner's list — see data/review.ts), the «اتصال
 * التحقق» flag, «اعتمد العرض» disabled with its reason until everything is
 * checked, the reject swap (ready reasons + TextArea + «أرسل الرفض»), the
 * reports' «أبقِ العرض» / «أوقف العرض»، and the DriverApprovalCard's data +
 * «اعتمد السائق». Each sheet keeps its component's marker visible.
 */
import { useEffect, useState } from 'react';
import {
  ActionBar,
  Button,
  Checkbox,
  EntityMark,
  ObjectRow,
  SelectedIcon,
  Sheet,
  Surface,
  TextArea,
  Toggle,
} from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import { REJECT_REASONS, VERIFY_ITEMS } from '../../data/review';
import type { Listing } from '../../data/types';
import { LaterMark, moneyText } from '../parts';

function SheetBody({ children }: { children: React.ReactNode }) {
  return <div className="sim-sheet__body">{children}</div>;
}

/** The verification block: the 7 items + the verification call. */
function VerifyBlock({ onReady }: { onReady: (all: boolean) => void }) {
  const [checked, setChecked] = useState<boolean[]>(VERIFY_ITEMS.map(() => false));
  const [called, setCalled] = useState(false);
  // جولة المستخدم: the readiness derives in an effect so a stale click
  // closure can never report a wrong state (each row's onChange reads only
  // its own next value; the effect recomputes from the FULL state).
  useEffect(() => {
    onReady(checked.every(Boolean) && called);
  }, [checked, called, onReady]);
  return (
    <>
      <Section2 label="قبل الاعتماد" caption="بنود التحقق السبعة (نصوص مقترحة — تحتاج قرار المالك)" />
      <Surface>
        {VERIFY_ITEMS.map((item, i) => (
          <Checkbox
            key={item}
            label={item}
            selected={checked[i]!}
            onChange={(v) => {
              setChecked((prev) => prev.map((c, j) => (j === i ? v : c)));
            }}
          />
        ))}
        <Toggle label="أجريت اتصال التحقق" selected={called} onChange={setCalled} />
      </Surface>
    </>
  );
}

/** A small section header (the Section component needs children; the sheet
 *  uses a plain heading to avoid nesting constraints). */
function Section2({ label, caption }: { label: string; caption?: string }) {
  return (
    <p className="sim-sheet__section">
      {label}
      {caption ? <span className="sim-sheet__section-caption">{caption}</span> : null}
    </p>
  );
}

/** The DecisionCard's place for a listing queue item (§6.2). */
export function DecisionSheet({ listing, mode, onDismiss }: { listing: Listing; mode: 'queue' | 'reports'; onDismiss: () => void }) {
  const dispatch = useSimDispatch();
  const [ready, setReady] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [chosen, setChosen] = useState<string | null>(null);
  const isEdit = listing.editedPrice !== null && listing.editedPrice !== undefined;

  if (rejecting) {
    return (
      <Sheet label={`رفض ${listing.title}`} variant="form" onDismiss={onDismiss}>
        <SheetBody>
          <Section2 label="أسباب جاهزة" />
          <Surface>
            {REJECT_REASONS.map((r) => (
              <ObjectRow
                key={r}
                label={r}
                onPress={() => { setChosen(r); setReason(r); }}
                trailing={chosen === r ? <SelectedIcon size={20} /> : undefined}
              />
            ))}
          </Surface>
          <TextArea label="سبب الرفض" value={reason} onChange={setReason} caption="إلزامي إن لم تختر سببًا جاهزًا" />
          <ActionBar
            label="أرسل الرفض"
            disabled={!reason.trim()}
            onPress={() => {
              if (!reason.trim()) return;
              dispatch({ type: 'listing/reject', listingId: listing.id, reason: reason.trim() });
              dispatch({ type: 'ui/openSheet', id: null });
            }}
          />
        </SheetBody>
      </Sheet>
    );
  }

  return (
    <Sheet label={mode === 'reports' ? `بلاغات ${listing.title}` : listing.title} onDismiss={onDismiss}>
      <SheetBody>
        <LaterMark name="ObjectSheet" note="ورقة القرار الحقيقية تُركَّب هنا" />
        <LaterMark name={mode === 'reports' ? 'DecisionCard' : 'ReviewQueueItem'} note="مكان المكوّن الحقيقي" />
        {mode === 'reports' ? (
          <>
            <Section2 label={`البلاغات (${listing.reports?.length ?? 0})`} />
            <Surface>
              {(listing.reports ?? []).map((r, i) => (
                <ObjectRow key={i} label={r} caption={`بلاغ ${i + 1}`} />
              ))}
            </Surface>
            <ActionBar
              label="أبقِ العرض"
              onPress={() => {
                dispatch({ type: 'listing/stop', listingId: listing.id, stop: false });
                dispatch({ type: 'ui/openSheet', id: null });
              }}
            />
            <Button variant="text" onPress={() => { dispatch({ type: 'listing/stop', listingId: listing.id, stop: true }); dispatch({ type: 'ui/openSheet', id: null }); }}>
              أوقف العرض
            </Button>
          </>
        ) : isEdit ? (
          <>
            <Surface>
              <ObjectRow label="المنشور الآن" value={<span className="sim-money">{`${moneyText(listing.price ?? 0)} د`}</span>} />
              <ObjectRow label="المعدّل بانتظار المراجعة" value={<span className="sim-money">{`${moneyText(listing.editedPrice ?? 0)} د`}</span>} />
            </Surface>
            <ActionBar
              label="اعتمد التعديل"
              onPress={() => {
                dispatch({ type: 'edit/approve', listingId: listing.id });
                dispatch({ type: 'ui/openSheet', id: null });
              }}
            />
          </>
        ) : (
          <>
            <VerifyBlock onReady={setReady} />
            {!ready ? <p className="sim-form-help">أشّر على كل البنود أولاً.</p> : null}
            <ActionBar
              label="اعتمد العرض"
              disabled={!ready}
              onPress={() => {
                if (!ready) return;
                dispatch({ type: 'listing/approve', listingId: listing.id });
                dispatch({ type: 'ui/openSheet', id: null });
              }}
            />
            <Button variant="text" onPress={() => setRejecting(true)}>
              ارفض العرض
            </Button>
          </>
        )}
      </SheetBody>
    </Sheet>
  );
}

/** The DriverApprovalCard's place (§6.3): the driver's data + attachments +
 *  «اعتمد السائق»، و«ارفض» يبدّل إلى السبب. */
export function DriverDecisionSheet({ driverId, onDismiss }: { driverId: string; onDismiss: () => void }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const driver = state.drivers.find((d) => d.id === driverId);
  if (!driver) return null;

  if (rejecting) {
    return (
      <Sheet label={`رفض ${driver.name}`} variant="form" onDismiss={onDismiss}>
        <SheetBody>
          <TextArea label="سبب الرفض" value={reason} onChange={setReason} />
          <ActionBar
            label="أرسل الرفض"
            disabled={!reason.trim()}
            onPress={() => {
              if (!reason.trim()) return;
              dispatch({ type: 'driver/reject', driverId: driver.id, reason: reason.trim() });
              dispatch({ type: 'ui/openSheet', id: null });
            }}
          />
        </SheetBody>
      </Sheet>
    );
  }

  return (
    <Sheet label={driver.name} onDismiss={onDismiss}>
      <SheetBody>
        <div className="sim-driver-head">
          <EntityMark value={driver.name} />
          <span className="sim-driver-head__name">{driver.name}</span>
          <span className="sim-driver-head__area">{driver.areas.join(' · ')}</span>
        </div>
        <LaterMark name="DriverApprovalCard" note="بطاقة الاعتماد الحقيقية تُركَّب هنا" />
        <Surface>
          <ObjectRow label={driver.phone} caption="الهاتف" />
          <ObjectRow label={`${driver.vehicle} · ${driver.plate}`} caption="المركبة واللوحة" />
          <ObjectRow label={driver.areas.join(' · ')} caption="مناطق الخدمة" />
        </Surface>
        <Section2 label="المرفقات" caption={driver.attachments.length ? undefined : '—'} />
        <Surface>
          {driver.attachments.length ? (
            driver.attachments.map((a: string) => <ObjectRow key={a} label={a} caption="صورة بديلة مولّدة داخل الملف" />)
          ) : (
            <ObjectRow label="—" caption="لا مرفقات (سائق معتمد سابقًا)" />
          )}
        </Surface>
        <ActionBar
          label="اعتمد السائق"
          onPress={() => {
            dispatch({ type: 'driver/approve', driverId: driver.id });
            dispatch({ type: 'ui/openSheet', id: null });
          }}
        />
        <Button variant="text" onPress={() => setRejecting(true)}>
          ارفض
        </Button>
      </SheetBody>
    </Sheet>
  );
}
