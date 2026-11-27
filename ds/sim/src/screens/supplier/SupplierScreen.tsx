/**
 * SupplierScreen — «عروضي» (م1 §5.8): the SegmentedControl «عروضي» /
 * «السوق» under the header (no TabBar), the supplier's own listings as REAL
 * ObjectRows (the map names them so) with the ListingStatusBadge's place as
 * a compact marker at each row's end (batch-2), and «عرض جديد» opening the
 * ListingEditor form sheet. «السوق» reuses the shared market screen without
 * the owner's TabBar.
 */
import { Button, EntityMark, ObjectRow, PageHeader, Section, SegmentedControl } from '@micro/ds';
import type { SegmentOption } from '@micro/ds';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, LaterChip, moneyText } from '../parts';
import { MarketBody } from '../market/MarketScreen';
import type { ListingStatus } from '../../data/types';

const SEGMENTS: readonly SegmentOption[] = [
  { value: 'myListings', label: 'عروضي' },
  { value: 'market', label: 'السوق' },
];

/** The ListingStatusBadge word+tone per status (م1 §5.7). */
const STATUS: Record<ListingStatus, { label: string; note: string }> = {
  approved: { label: 'معتمد', note: 'معتمد' },
  underReview: { label: 'قيد المراجعة', note: 'قيد المراجعة' },
  rejected: { label: 'مرفوض', note: 'مرفوض · السبب: الصور غير واضحة' },
  approvedWithEdit: { label: 'تعديل قيد المراجعة', note: 'تعديل قيد المراجعة (المنشور 3 د والمعدّل 2.750 د)' },
};

export function SupplierScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const part = state.ui.screen === 'market' ? 'market' : 'myListings';

  // §5.2.7: his own listings — ع1 ع2 ع3 ع4 ع5.
  const mine = state.listings.filter((l) => l.supplier === 'مخبز الأصيل للجملة');

  if (part === 'market') {
    // §5.1: «السوق» كتبويب السوق عند المالك — with the supplier's segments.
    return (
      <div className="sim-screen" data-sim-screen-body="market">
        <ContextBarShell />
        <PageHeader label="السوق" />
        <SegmentedControl
          leading={SEGMENTS}
          value={part}
          onChange={(v) => dispatch({ type: 'ui/navigate', screen: v === 'market' ? 'market' : 'myListings' })}
          label="أجزاء السوق"
        />
        <div className="sim-screen__body">
          <MarketBody />
        </div>
      </div>
    );
  }

  return (
    <div className="sim-screen" data-sim-screen-body="myListings">
      <ContextBarShell />
      <PageHeader
        label="عروضي"
        trailing={
          <Button size="sm" variant="primary" onPress={() => dispatch({ type: 'ui/openSheet', id: 'newListing' })}>
            عرض جديد
          </Button>
        }
      />
      <SegmentedControl
        leading={SEGMENTS}
        value={part}
        onChange={(v) => dispatch({ type: 'ui/navigate', screen: v === 'market' ? 'market' : 'myListings' })}
        label="أجزاء السوق"
      />
      <div className="sim-screen__body">
        <Section label="عروضي" caption={mine.length}>
          <div className="sim-rows">
            {mine.map((l) => {
              const badge = STATUS[l.status];
              const price = l.tiers
                ? `${l.tiers.length} شرائح من ${moneyText(l.tiers[0]?.price ?? 0)} د`
                : `${moneyText(l.price ?? 0)} د`;
              return (
                <div key={l.id} className="sim-supplier-row">
                  <ObjectRow
                    label={l.title}
                    caption={`${price} / ${l.minOrder}${l.since ? ` · ${l.since}` : ''}`}
                    leading={<EntityMark value={l.title} />}
                    trailing={<LaterChip name="ListingStatusBadge" note={badge.label} />}
                    onPress={() => dispatch({ type: 'ui/openListing', id: l.id })}
                  />
                  <span className="sim-later__note sim-supplier-row__why">{badge.note}</span>
                </div>
              );
            })}
          </div>
          <div className="sim-later-inline" data-sim-later="ListingEditor">
            <span className="sim-later__name">يُركَّب لاحقًا: ListingEditor</span>
            <span className="sim-later__note">تعديل العرض من more داخل تفاصيله</span>
          </div>
        </Section>
      </div>
    </div>
  );
}
