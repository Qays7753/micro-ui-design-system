/**
 * market.tsx — the B4 market wing of the domains lab (plan B). Every
 * example owns real state or is deliberately frozen (press-stable, the
 * ds-states contract). Sections: the seven market components + the
 * market compose page (§5.8).
 *
 * PhotoUploader and PriceTierBuilder are agent-1 phase-4 pieces — their
 * slots stay empty and are listed in REPORT-B under «يُكمَّل بعد الدمج».
 */
import { useState } from 'react';
import {
  AskButton, ContactBar, ContextBar, FilterChips, Gallery, ListingCard, ListingEditor,
  ListingStatusBadge, NotificationsButton, PriceTierTable, ProjectSwitcher, ReportSheet,
  SearchField, Section, SupplierHeader, TabBar, TabBarTab,
  ar, t,
} from '@micro/ds';
import type { DomainSection } from './index';

const FLOUR = 'https://picsum.photos/seed/flour/288/216';
const SATIN = 'https://picsum.photos/seed/satin/288/216';
const TIERS = [
  { from: 1, to: 10, price: 2.5 },
  { from: 11, to: 50, price: 2.25 },
  { from: 51, price: 2 },
];

function ListingCardGarden() {
  return (
    <div>
      <div className="lab-grid-2">
        <ListingCard label="طحين أبيض 50 كغ" value={2.5} caption="عبوة" supplier="مخبز الأصيل للجملة" image={FLOUR} />
        <ListingCard label="قماش ساتان، لفّة 25 م" value={4} caption="لفّة" supplier="مؤسسة الخطيب للأقمشة" image={SATIN} />
      </div>
      <div className="lab-grid-2" style={{ marginBlockStart: 12 }}>
        <ListingCard label="طحين أبيض 50 كغ" value={2} caption="عبوة" tone="tiers" supplier="مخبز الأصيل للجملة" />
        <ListingCard label="قماش ساتان" supplier="مؤسسة الخطيب للأقمشة" unavailable />
      </div>
      <div className="lab-grid-2" style={{ marginBlockStart: 12 }}>
        <ListingCard label="زائر يرى" locked caption="عبوة" supplier="مخبز الأصيل للجملة" />
        <ListingCard label="…" state="loading" />
      </div>
    </div>
  );
}

function GalleryGarden() {
  const [idx, setIdx] = useState(0);
  const four = [
    { src: FLOUR, alt: 'طحين أبيض 50 كغ' },
    { src: SATIN, alt: 'طحين أبيض 50 كغ' },
    { src: FLOUR, alt: 'طحين أبيض 50 كغ' },
    { src: SATIN, alt: 'طحين أبيض 50 كغ' },
  ];
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['gallery.imageOf'].text.replace('{current}', String(idx + 1)).replace('{total}', '4')}</span>
        <Gallery items={four} value={idx} onChange={setIdx} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <Gallery items={[{ src: FLOUR, alt: 'طحين' }]} value={0} />
      </div>
    </div>
  );
}

function PriceTierTableGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <PriceTierTable items={TIERS} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.hidden'].text}</span>
        <PriceTierTable items={TIERS} locked />
      </div>
    </div>
  );
}

function SupplierHeaderGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['quote.approved'].text}</span>
        <SupplierHeader label="مخبز الأصيل للجملة" caption="إربد · شارع الجامعة" items={12} approved />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <SupplierHeader label="مؤسسة الخطيب للأقمشة والأستيك والخيوط بكافة أنواعها" caption="عمان" items={2} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <SupplierHeader label="…" state="loading" />
      </div>
    </div>
  );
}

function ListingStatusBadgeGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['listing.reviewPending'].text}</span>
        <ListingStatusBadge tone="waiting" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['listing.approved'].text}</span>
        <ListingStatusBadge tone="done" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['listing.rejected'].text}</span>
        <ListingStatusBadge tone="rejected" caption="الصور غير واضحة" />
      </div>
    </div>
  );
}

function ReportSheetGarden() {
  // Frozen (press-stable): the sheet renders inline with its states side
  // by side; the real dismissal stays with the app.
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <div className="lab-sheet-stage"><ReportSheet items={['محتوى مضلل', 'سعر غير صحيح', 'منتج مقلد']} onDismiss={() => {}} /></div>
      </div>
    </div>
  );
}

function ListingEditorGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['editor.newTitle'].text}</span>
        <div className="lab-sheet-stage"><ListingEditor onDismiss={() => {}} /></div>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['editor.editTitle'].text}</span>
        <div className="lab-sheet-stage"><ListingEditor editing onDismiss={() => {}} draft={{ label: 'طحين أبيض 50 كغ', unit: 'كيس 50 كغ', mode: 'tiers', items: TIERS }} /></div>
      </div>
    </div>
  );
}

function MarketCompose() {
  // Frozen like every compose page: both wings stacked, no view swaps.
  return (
    <div className="lab-compose-screen" data-ds-check="market-compose">
      <ContextBar
        label={t('sr.switchProject')}
        leading={<ProjectSwitcher label="ورشة الياسمين للخياطة" caption={ar['role.owner'].text} onPress={() => {}} />}
        trailing={<><NotificationsButton value={3} onPress={() => {}} /><AskButton onPress={() => {}} /></>}
      />
      <h2 className="mds-type-title-section" style={{ margin: 0 }}>{t('nav.market')}</h2>
      <SearchField label={t('nav.market')} value="" onChange={() => {}} />
      <FilterChips label={t('nav.market')} leading={[
        { value: 'جملة', label: 'جملة' },
        { value: 'أقمشة', label: 'أقمشة' },
        { value: 'مواد غذائية', label: 'مواد غذائية' },
      ]} value={[]} onChange={() => {}} />
      <div className="lab-grid-2">
        <ListingCard label="طحين أبيض 50 كغ" value={2.5} caption="عبوة" supplier="مخبز الأصيل للجملة" image={FLOUR} />
        <ListingCard label="قماش ساتان، لفّة 25 م" value={4} caption="لفّة" supplier="مؤسسة الخطيب للأقمشة" image={SATIN} />
        <ListingCard label="خميرة فورية 500 غ" value={1.75} caption="كيس" supplier="مخبز الأصيل للجملة" />
        <ListingCard label="خيط بوليستر 5000 م" value={0.9} caption="بكرة" supplier="مؤسسة الخطيب للأقمشة" />
      </div>
      {/* التفاصيل والسجل وGuestShell: مكوّنات مرحلة 4 — يُكمَّل بعد الدمج */}
      <Section label={ar['listing.rejected'].text}>
        <PriceTierTable items={TIERS} />
        <SupplierHeader label="مخبز الأصيل للجملة" caption="إربد" items={12} approved />
        <ContactBar value="079 123 4567" label="مخبز الأصيل للجملة" market />
      </Section>
      <TabBar value={2} onChange={() => {}}>
        <TabBarTab label="اليوم" onPress={() => {}} />
        <TabBarTab label="المالية" onPress={() => {}} />
        <TabBarTab label="السوق" onPress={() => {}} />
      </TabBar>
    </div>
  );
}

export const marketSections: DomainSection[] = [
  { id: 'listing-card', name: t('lab.h.listingCard'), content: <ListingCardGarden /> },
  { id: 'gallery', name: t('lab.h.gallery'), content: <GalleryGarden /> },
  { id: 'price-tier-table', name: t('lab.h.priceTierTable'), content: <PriceTierTableGarden /> },
  { id: 'supplier-header', name: t('lab.h.supplierHeader'), content: <SupplierHeaderGarden /> },
  { id: 'report-sheet', name: t('lab.h.reportSheet'), content: <ReportSheetGarden /> },
  { id: 'listing-editor', name: t('lab.h.listingEditor'), content: <ListingEditorGarden /> },
  { id: 'listing-status-badge', name: t('lab.h.listingStatusBadge'), content: <ListingStatusBadgeGarden /> },
  { id: 'market-compose', name: t('lab.h.marketCompose'), content: <MarketCompose /> },
];
