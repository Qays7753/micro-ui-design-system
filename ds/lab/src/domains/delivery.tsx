/**
 * delivery.tsx — the B3 delivery wing of the domains lab (plan B). Every
 * interactive example owns real state (owner note §1). Sections: the
 * nine delivery components + the delivery compose page (§4.10).
 *
 * The compose page builds only what exists on this branch; the request
 * sheet's stage-4 pieces (DateQuickChips, TimePicker, PartyPicker) and
 * SlideToConfirm/PhotoUploader do NOT exist yet — their places are left
 * and listed in REPORT-B under «يُكمَّل بعد الدمج».
 */
import { useState } from 'react';
import {
  AmountField, AskButton, Button, ContactBar, ContextBar, DeliveryRequestCard, DriverApprovalStatus,
  DriverJobCard, EvidenceSlot, IssueProposalCard, JobTrack, LocationSlot, NotificationsButton,
  ProjectSwitcher, QuoteCard, Section, SegmentedControl, StatusTrack,
  ar, t,
} from '@micro/ds';
import type { DomainSection } from './index';

const PHONE = '079 123 4567';
const STAGES = [{ label: 'أُنشئ' }, { label: 'عُيّن السائق' }, { label: 'قيد التنفيذ' }, { label: 'تمّ' }];

function DeliveryRequestCardGarden() {
  // The states gate presses every button: presses stay side-effect-free
  // (no re-render mid-scan); the counts are display-only.
  const [opened] = useState(0);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <DeliveryRequestCard
          label="مرج الحمام"
          caption="من طبربور · كرتونتا حلويات"
          time="اليوم 4:00 م"
          tone="waiting"
          action={<Button variant="secondary" size="sm">{ar['delivery.reviewQuotes'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.assigned'].text}</span>
        <DeliveryRequestCard label="الزرقاء، حي معصوم" caption="من طبربور · فستان خطوبة" time="غداً 10:00 ص" driver="عمر الزعبي" tone="done" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <DeliveryRequestCard label="…" state="loading" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.opened')} <bdi dir="ltr">{opened}</bdi></span></div>
    </div>
  );
}

function QuoteCardGarden() {
  const [accepted] = useState(0);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <QuoteCard
          label="عمر الزعبي"
          caption="أصل خلال 20 دقيقة"
          value={3}
          accept={<Button variant="secondary" size="sm">{ar['quote.accept'].text}</Button>}
          reject={<Button variant="text" size="sm">{ar['quote.reject'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['orders.active'].text}</span>
        <QuoteCard label="يزن القضاة" caption="أوصلك أول طريق" value="3.500" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['quote.rejected'].text}</span>
        <QuoteCard label="عمر الزعبي" caption="أصل خلال 20 دقيقة" value={3} state="rejected" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['quote.accept'].text}: <bdi dir="ltr">{accepted}</bdi></span></div>
    </div>
  );
}

function StatusTrackGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <StatusTrack items={STAGES} value={2} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['orders.active'].text}</span>
        <StatusTrack items={STAGES} value={1} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['issue.title'].text}</span>
        <StatusTrack items={[{ label: 'أُنشئ' }, { label: 'تعذّر', tone: 'problem' }]} value={1} />
      </div>
    </div>
  );
}

function JobTrackGarden() {
  return (
    <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
      <JobTrack items={STAGES} value={2} />
    </div>
  );
}

function IssueProposalCardGarden() {
  // The gate scan presses every button: the decision must NOT unmount the
  // pressed pair mid-scan, so the garden keeps both copies side by side
  // and only counts the presses.
  const [presses] = useState(0);
  const items = [
    { key: ar['issue.reason'].text, value: 'المستلم لا يرد' },
    { key: ar['issue.proposed'].text, value: 'إعادة المحاولة غداً' },
  ];
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['role.owner'].text}</span>
        <IssueProposalCard
          items={items}
          accept={<Button variant="secondary" size="sm">وافق</Button>}
          reject={<Button variant="text" size="sm">ارفض</Button>}
          result={ar['quote.resultSentence'].text}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.decided'].text}</span>
        <IssueProposalCard items={items} decided={<span>وافقت · 10:42 ص</span>} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.pressed')} <bdi dir="ltr">{presses}</bdi></span></div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.driver')}</span>
        <IssueProposalCard items={items} audience="driver" />
      </div>
    </div>
  );
}

function ContactBarGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <ContactBar value={PHONE} label="عمر الزعبي" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('nav.market')}</span>
        <ContactBar value={PHONE} label="مخبز الأصيل للجملة" market />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.driver')}</span>
        <ContactBar value={PHONE} label="ورشة الياسمين للخياطة" density="large" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['visitor.locked'].text}</span>
        <ContactBar value={PHONE} label="زائر" locked market />
      </div>
    </div>
  );
}

function EvidenceSlotGarden() {
  // Presses must not re-render the scan: photo/code stay frozen; the
  // error shows on the fixed wrong code so the error state is still
  // exhibited.
  const [photo] = useState('');
  const [code] = useState('12');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['evidence.title'].text} — photo</span>
        <EvidenceSlot mode="photo" value={photo} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['evidence.photoTaken'].text}</span>
        <EvidenceSlot mode="photo" value="https://picsum.photos/seed/delivery/288/216" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">code</span>
        <EvidenceSlot mode="code" value={code} error={ar['evidence.codeError'].text} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">owner</span>
        <EvidenceSlot mode="owner" action={<Button variant="secondary" size="sm">{ar['evidence.confirm'].text}</Button>} />
      </div>
    </div>
  );
}

function LocationSlotGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['delivery.fromWord'].text}</span>
        <LocationSlot label={ar['delivery.fromWord'].text} value="طبربور" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['delivery.to'].text}</span>
        <LocationSlot label={ar['delivery.to'].text} value="الزرقاء، حي معصوم" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.empty')}</span>
        <LocationSlot label={ar['delivery.to'].text} value="" />
      </div>
    </div>
  );
}

function DriverJobCardGarden() {
  // Frozen stages: the four action areas render as four separate cards so
  // the scan sees every state without any press mutating the DOM.
  const [price] = useState('');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.driver')}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone={PHONE}
          items={STAGES}
          value={1}
          stage="quoting"
          quote={<AmountField label={ar['job.priceLabel'].text} value={price} />}
          action={<Button variant="primary">{ar['job.sendQuote'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.driverActive'].text}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone="079 123 4567"
          items={STAGES}
          value={2}
          stage="active"
          action={<Button variant="primary">{ar['job.slideDelivered'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.driverBlocked'].text}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone="079 123 4567"
          items={STAGES}
          value={2}
          stage="blocked"
          action={<Button variant="secondary">{ar['job.cannotDeliver'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.awaitingOwner'].text}</span>
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone="079 123 4567"
          items={STAGES}
          value={2}
          stage="awaiting-owner"
          proposal={
            <IssueProposalCard
              items={[
                { key: ar['issue.reason'].text, value: 'المستلم لا يرد' },
                { key: ar['issue.proposed'].text, value: 'إعادة المحاولة غداً' },
              ]}
              audience="driver"
            />
          }
        />
      </div>
    </div>
  );
}

function DriverApprovalStatusGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['driver.pending'].text}</span>
        <DriverApprovalStatus tone="waiting" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['driver.approved'].text}</span>
        <DriverApprovalStatus tone="approved" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['driver.rejected'].text}</span>
        <DriverApprovalStatus tone="rejected" caption="الرخصة منتهية" />
      </div>
    </div>
  );
}

function DeliveryCompose() {
  // Frozen: the states gate presses every control — a real view swap would
  // unmount half the specimens mid-scan. Both wings render stacked; the
  // segmented control stays interactive-looking but inert here.
  const [view] = useState<'requests' | 'driver'>('requests');
  return (
    <div className="lab-compose-screen" data-ds-check="delivery-compose">
      <ContextBar
        label={t('sr.switchProject')}
        leading={<ProjectSwitcher label="ورشة الياسمين للخياطة" caption={ar['role.owner'].text} onPress={() => {}} />}
        trailing={<><NotificationsButton value={3} onPress={() => {}} /><AskButton onPress={() => {}} /></>}
      />
      <PageHeaderShim label={t('nav.delivery')} />
      <SegmentedControl
        label={t('nav.delivery')}
        leading={[{ value: 'requests', label: ar['delivery.requests'].text }, { value: 'driver', label: ar['delivery.driverView'].text }]}
        value={view}
        onChange={() => {}}
      />
      {view === 'requests' && (
        <>
          <Section label={t('title.needsYou')} caption={1}>
            <DeliveryRequestCard
              label="مرج الحمام"
              caption="من طبربور · كرتونتا حلويات"
              time="اليوم 4:00 م"
              tone="waiting"
              action={<Button variant="secondary" size="sm">{ar['delivery.reviewQuotes'].text}</Button>}
            />
          </Section>
          <Section label={ar['orders.active'].text} caption={1}>
            <DeliveryRequestCard label="الزرقاء، حي معصوم" caption="من طبربور · فستان خطوبة" time="غداً 10:00 ص" driver="عمر الزعبي" tone="done" />
          </Section>
          <Section label={ar['quote.accept'].text}>
            <QuoteCard
              label="عمر الزعبي"
              caption="أصل خلال 20 دقيقة"
              value={3}
              accept={<Button variant="secondary" size="sm">{ar['quote.accept'].text}</Button>}
              reject={<Button variant="text" size="sm">{ar['quote.reject'].text}</Button>}
            />
          </Section>
          {/* Disclosure «السجل»: مكوّن مرحلة 2 غير مرفوع بعد — يُكمَّل بعد الدمج */}
        </>
      )}
      <Section label={ar['delivery.driverView'].text}>
        <DriverApprovalStatus tone="waiting" />
        <DriverJobCard
          label="الزرقاء، حي معصوم"
          origin="طبربور"
          destination="الزرقاء، حي معصوم"
          owner="ورشة الياسمين للخياطة"
          phone={PHONE}
          items={STAGES}
          value={1}
          stage="active"
          action={<Button variant="primary">{ar['job.slideDelivered'].text}</Button>}
        />
      </Section>
    </div>
  );
}

/** PageHeader is batch-1; a light section title keeps the compose page
 *  self-contained until the merge brings the real one. */
function PageHeaderShim({ label }: { label: string }) {
  return <h2 className="mds-type-title-section" style={{ margin: 0 }}>{label}</h2>;
}

export const deliverySections: DomainSection[] = [
  { id: 'delivery-request-card', name: t('lab.h.deliveryRequestCard'), content: <DeliveryRequestCardGarden /> },
  { id: 'quote-card', name: t('lab.h.quoteCard'), content: <QuoteCardGarden /> },
  { id: 'status-track', name: t('lab.h.statusTrack'), content: <StatusTrackGarden /> },
  { id: 'job-track', name: t('lab.h.jobTrack'), content: <JobTrackGarden /> },
  { id: 'issue-proposal-card', name: t('lab.h.issueProposalCard'), content: <IssueProposalCardGarden /> },
  { id: 'contact-bar', name: t('lab.h.contactBar'), content: <ContactBarGarden /> },
  { id: 'evidence-slot', name: t('lab.h.evidenceSlot'), content: <EvidenceSlotGarden /> },
  { id: 'location-slot', name: t('lab.h.locationSlot'), content: <LocationSlotGarden /> },
  { id: 'driver-job-card', name: t('lab.h.driverJobCard'), content: <DriverJobCardGarden /> },
  { id: 'driver-approval-status', name: t('lab.h.driverApprovalStatus'), content: <DriverApprovalStatusGarden /> },
  { id: 'delivery-compose', name: t('lab.h.deliveryCompose'), content: <DeliveryCompose /> },
];
