/* The consumer showroom (plan S11/D12): EVERY first-batch component,
   imported from the INSTALLED @micro/ds package — nothing copied from
   the repo. Real Arabic literals; the consumer owns its own state. */
import { useState } from 'react';
import {
  ActionBar,
  EmptyState,
  AmountVisibilityProvider,
  AmountVisibilityToggle,
  AskButton,
  Button,
  ConfirmSheet,
  ContextBar,
  EntityMark,
  FilterChips,
  FundBankIcon,
  FundCashIcon,
  FundWalletIcon,
  HeroSurface,
  IconButton,
  InlineBanner,
  Metric,
  MetricSmall,
  Money,
  NavDeliveryIcon,
  NavFinanceIcon,
  NavMarketIcon,
  NavOrdersIcon,
  NavTodayIcon,
  NotificationsButton,
  ObjectCard,
  ObjectRow,
  PageHeader,
  ProjectSwitcher,
  SaveState,
  Section,
  SegmentedControl,
  Sheet,
  Skeleton,
  StatusBadge,
  Surface,
  TabBar,
  TabBarTab,
  TextField,
  Tile,
  Toast,
  Well,
} from '@micro/ds';

const projects = ['ورشة الياسمين للديكور'];

export function ConsumerApp() {
  const [tab, setTab] = useState(0);
  const [segment, setSegment] = useState('اليوم');
  const [chips, setChips] = useState<string[]>(['داخلي']);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <AmountVisibilityProvider>
      <main className="consumer-root">
        {/* Tailwind bridge probe (K14): the class computes the token value. */}
        <header className="consumer-header bg-ground text-ink" data-ds-check="consumer-bridge">
          <h1>تجربة الاستهلاك — كل مكوّنات الدفعة الأولى من @micro/ds</h1>
          <AmountVisibilityToggle />
        </header>

        <ContextBar
          label="شريط السياق"
          leading={<ProjectSwitcher label={projects[0]} caption="مالك" onPress={() => {}} />}
          trailing={(
            <>
              <NotificationsButton value={3} onPress={() => {}} />
              <AskButton onPress={() => {}} />
            </>
          )}
        />
        <PageHeader
          label="اليوم"
          trailing={<Button variant="secondary" size="sm" onClick={() => setSheetOpen(true)}>سجّل حركة</Button>}
        />

        <HeroSurface
          label="المالية"
          value="1,245.750"
          trailing="د.أ"
          direction={<><NavFinanceIcon size={16} /> <span>12% أعلى من أمس</span></>}
          debt="من داخل"
          onDismiss={() => {}}
        />

        <Section label="يحتاجك" caption={3} onPress={() => {}}>
          <Surface>
            <ObjectRow label="سلمى الحجواني" caption="فستان سهره · دجج الكاش" value="1,245.750" trailing="10:24 ص" onPress={() => {}} />
            <ObjectRow
              label="أبو محمد (بقالة النور)"
              caption="فستان سهره · دجج الكاش"
              value="1,250"
              trailing={<StatusBadge tone="waiting" />}
              onPress={() => {}}
            />
          </Surface>
        </Section>

        <div className="consumer-tiles">
          <Tile tone="start" label="المالية" leading={<NavFinanceIcon size={20} />} value="1,250" trailing="داخل" onPress={() => {}} />
          <Tile label="الطلبات" leading={<NavOrdersIcon size={20} />} state value="4" trailing="ينتظر" onPress={() => {}} />
          <Tile label="التوصيل" leading={<NavDeliveryIcon size={20} />} value="2" trailing="خارج" onPress={() => {}} />
          <Tile tone="end" label="السوق" leading={<NavMarketIcon size={20} />} value="72%" trailing="تمّ" onPress={() => {}} />
        </div>

        <Metric label="إيراد الشهر" value="12,450" trailing="د.أ" direction={<span>▲ 8%</span>} />
        <MetricSmall label="أمس" value="980" trailing="د.أ" />
        <Money value="1,245.750" />
        <Money value="1,245.750" debt="forYou" />
        <EntityMark value="س" size="md" />
        <Well>
          <strong>الخزينة</strong>
          <span>نقدية البنك والحافظة</span>
        </Well>
        <div className="consumer-funds">
          <FundCashIcon size={24} />
          <FundBankIcon size={24} />
          <FundWalletIcon size={24} />
        </div>

        <SegmentedControl
          label="الفترة"
          value={segment}
          onChange={setSegment}
          leading={[
            { value: 'اليوم', label: 'اليوم' },
            { value: 'الأسبوع', label: 'الأسبوع' },
            { value: 'الشهر', label: 'الشهر' },
          ]}
        />
        <FilterChips
          label="الموقع"
          leading={[
            { value: 'داخلي', label: 'داخلي' },
            { value: 'خارجي', label: 'خارجي' },
            { value: 'الكل', label: 'الكل' },
          ]}
          value={chips}
          onChange={setChips}
        />
        <TextField id="consumer-amount" label="المبلغ" placeholder="0.000" />
        <SaveState saveState="saved" />
        <SaveState saveState="failed" />
        <InlineBanner tone="offline" label="الاتصال انقطع" />
        <EmptyState
          label="حركات اليوم تظهر هنا."
          trailing={<Button variant="secondary">سجّل حركة</Button>}
        />
        <SkeletonRow />
        <IconButton label="رجوع" onPress={() => {}}><NavTodayIcon size={20} /></IconButton>
        <Button variant="primary" onClick={() => setToast('حُفظت الحركة')}>حفظ</Button>
        <Button variant="secondary">ثانوي</Button>
        <Button variant="text" size="sm">نصي</Button>

        <TabBar value={tab} onChange={setTab}>
          <TabBarTab label="اليوم" leading={<NavTodayIcon weight={tab === 0 ? 'fill' : 'regular'} />} onPress={() => setTab(0)} />
          <TabBarTab label="المالية" leading={<NavFinanceIcon weight={tab === 1 ? 'fill' : 'regular'} />} onPress={() => setTab(1)} />
          <TabBarTab label="الطلبات" leading={<NavOrdersIcon weight={tab === 2 ? 'fill' : 'regular'} />} onPress={() => setTab(2)} />
          <TabBarTab label="التوصيل" leading={<NavDeliveryIcon weight={tab === 3 ? 'fill' : 'regular'} />} onPress={() => setTab(3)} />
          <TabBarTab label="السوق" leading={<NavMarketIcon weight={tab === 4 ? 'fill' : 'regular'} />} onPress={() => setTab(4)} />
        </TabBar>

        {sheetOpen ? (
          <Sheet label="تفاصيل الحركة" onDismiss={() => setSheetOpen(false)}>
            <Surface>
              <TextField id="sheet-amount" label="المبلغ" placeholder="0.000" />
              <ActionBar label="حفظ الحركة" onPress={() => { setSheetOpen(false); setToast('حُفظت الحركة'); }} leading />
            </Surface>
          </Sheet>
        ) : null}
        <Button variant="secondary" onClick={() => setConfirmOpen(true)}>تأكيد حذف</Button>
        {confirmOpen ? (
          <ConfirmSheet
            label="حذف الحركة؟"
            caption="سيُحذف الحركة نهائيًا ولا يمكن التراجع عنها."
            value="احذف الحركة"
            onPress={() => setConfirmOpen(false)}
            onDismiss={() => setConfirmOpen(false)}
          />
        ) : null}
        {toast ? <Toast label={toast} onDismiss={() => setToast(null)} /> : null}

        {/* ObjectCard + the ObjectRow pair complete the list. */}
        <ObjectCard
          label="سلمى الحجواني"
          caption="عميلة دائمة"
          value="1,245.750"
          tone="done"
          onPress={() => {}}
        />
      </main>
    </AmountVisibilityProvider>
  );
}

function SkeletonRow() {
  return (
    <div className="consumer-skeletons" aria-busy="true">
      <Skeleton variant="body" />
      <Skeleton variant="caption" />
      <Skeleton variant="hero" />
      <Skeleton variant="mark" />
    </div>
  );
}
