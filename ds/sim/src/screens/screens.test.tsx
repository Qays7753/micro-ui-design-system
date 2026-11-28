/**
 * SA7أ — the owner's screens from the §5.1 map: every screen renders its
 * real components (the live §5.2 numbers) and the internal marker at every
 * unbuilt batch-2 component's place; the tabs navigate; the shared sheets
 * open from the ContextBar and the screens' own buttons.
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { App } from '../App';
import { SimProvider, useSim } from '../state/store';
import { todayNeedsYouList, financeNeedsYou, moneyText, marketCount } from './parts';
import { objectTitle } from './Sheets';

afterEach(cleanup);

/** The established press pattern (App.test): each fireEvent flushes its own
 *  act (a fresh pointerUp closure sees isPressed), then a tick. */
async function press(el: Element) {
  const target = el.closest('button') ?? el;
  fireEvent.pointerDown(target, { pointerId: 1 });
  fireEvent.pointerUp(target, { pointerId: 1 });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
}

function renderApp() {
  return render(
    <SimProvider>
      <App />
    </SimProvider>,
  );
}

/** Renders and enters the owner role → «مشروع اليوم». */
async function enterOwner() {
  renderApp();
  await press(screen.getByText('ورشة الياسمين للخياطة'));
}

describe('SA7أ — the owner screens (§5.1)', () => {
  test('the §5.1 map covers every screen key with its pattern', async () => {
    const { SCREEN_SPECS, laterParts } = await import('./map');
    expect(SCREEN_SPECS.length).toBeGreaterThanOrEqual(13);
    const keys = SCREEN_SPECS.map((s) => s.key);
    for (const key of [
      'today',
      'finance',
      'orders',
      'ordersCalendar',
      'movements',
      'delivery',
      'driverOrders',
      'myJobs',
      'myListings',
      'review',
      'reports',
      'drivers',
      'market',
    ] as const) {
      expect(keys).toContain(key);
    }
    // The unbuilt batch-2 parts carry the marker (SA.end's list feeds on it).
    const later = laterParts().map((p) => p.component);
    for (const name of ['OrderCard', 'FundCard', 'MovementRow', 'WeekStrip', 'ListingCard', 'DecisionCard', 'GuestShell']) {
      expect(later).toContain(name);
    }
  });

  test('مشروع اليوم: the date line, «يحتاجك» up to 3 in the fixed order, the 4 tiles with the live numbers', async () => {
    await enterOwner();
    expect(screen.getAllByText('مشروع اليوم').length).toBeGreaterThanOrEqual(2); // header + center tab (ب)
    expect(screen.getByText(/الجمعة 27\/11\/2026/)).toBeTruthy();
    // The tiles' live numbers (§5.1 البلاطات).
    expect(screen.getByText('595.500')).toBeTruthy();
    expect(screen.getByText('في الصناديق الآن')).toBeTruthy();
    // The tile's «التالي» follows the device clock (س4's rule): 11:00 ص
    // before it, 4:00 م between the two, and the fallback afterwards.
    const hour = new Date().getHours();
    const next = hour < 11 ? '11:00 ص' : hour < 16 ? '4:00 م' : '11:00 ص';
    expect(screen.getByText(`اليوم · التالي ${next}`)).toBeTruthy();
    expect(screen.getByText('جارية')).toBeTruthy();
    expect(screen.getByText('عروض')).toBeTruthy();
    // «يحتاجك» shows the first 3 of §5.1's fixed order: ت1، طلب 1203، د2.
    expect(screen.getAllByText(/يُركَّب لاحقًا/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/ت1 · عرض سعر ساري 3 د/)).toBeTruthy();
    expect(screen.getByText(/طلب 1203/)).toBeTruthy();
    expect(screen.getByText(/د2 · دين أبو محمد/)).toBeTruthy();
    // The fourth need (the negative wallet) waits in the «الكل» sheet.
    expect(screen.queryByText(/المحفظة · رصيده سالب/)).toBeNull();
    await press(screen.getByText('الكل'));
    expect(screen.getByText(/المحفظة · رصيده سالب/)).toBeTruthy();
  });

  test('المالية: the hero with the live total and diff, the draft row, the markers at the batch-2 places', async () => {
    await enterOwner();
    // Enter via the finance tile (the bento is pressable).
    await press(screen.getAllByText('المالية')[0]!);
    expect(screen.getByText('سجّل حركة')).toBeTruthy();
    expect(screen.getByText('في الصناديق الآن')).toBeTruthy();
    expect(screen.getByText(/أعلى من أمس/)).toBeTruthy();
    expect(screen.getByText(/من 21 حركة/)).toBeTruthy();
    // The draft row is a REAL ObjectRow (the map names it so).
    expect(screen.getByText('مسودة · طباعة ملصق أسعار')).toBeTruthy();
    // The batch-2 cards are markers, never substitutes.
    expect(screen.getAllByText('يُركَّب لاحقًا: FundCard').length).toBe(3);
    expect(screen.getAllByText('يُركَّب لاحقًا: DebtCard').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText(/يُركَّب لاحقًا: (MovementRow|TransferRow)/).length).toBe(5);
    // «الكل» (the movements section's link) opens the movements sub-screen.
    await press(screen.getByText('الكل'));
    expect(screen.getByPlaceholderText('ابحث في الحركات')).toBeTruthy();
  });

  test('الطلبات: the segments, the «الجارية» real rows, «يحتاجك» markers, the calendar switch', async () => {
    await enterOwner();
    // Navigate via the owner's TabBar (المالية · الطلبات · اليوم · التوصيل · السوق).
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'الطلبات')!;
    await press(tab);
    expect(screen.getByText('طلب جديد')).toBeTruthy();
    // «الجارية» rows are REAL ObjectRows with the live orders.
    expect(screen.getByText(/مرايل عمل × 6/)).toBeTruthy();
    expect(screen.getByText('يحتاج مراجعة', { exact: false })).toBeTruthy();
    // The calendar behind the segment.
    await press(screen.getByText('التقويم'));
    expect(screen.getAllByText('يُركَّب لاحقًا: WeekStrip').length).toBe(1);
  });

  test('التوصيل: the sections with the live ت1 quote and السجل', async () => {
    await enterOwner();
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'التوصيل')!;
    await press(tab);
    expect(screen.getByText('اطلب توصيلاً')).toBeTruthy();
    expect(screen.getByText(/ت1 · إلى مرج الحمام · 3 د/)).toBeTruthy();
    expect(screen.getByText(/ت3 · إلى الزرقاء، حي معصوم · قيد التنفيذ/)).toBeTruthy();
  });

  test('السوق: the 5 visible listings in the grid, the search narrows it', async () => {
    await enterOwner();
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'السوق')!;
    await press(tab);
    // §5.2.7: the market shows exactly 5 listings.
    const cells = screen.getAllByText('يُركَّب لاحقًا: ListingCard');
    expect(cells.length).toBe(5);
    expect(screen.getByText('طحين أبيض فاخر 50 كغ')).toBeTruthy();
    // The search narrows the grid.
    const field = screen.getByPlaceholderText('ابحث في السوق');
    fireEvent.change(field, { target: { value: 'خيوط' } });
    await waitFor(() => {
      expect(screen.getAllByText('يُركَّب لاحقًا: ListingCard').length).toBe(1);
    });
  });

  test('the shared sheets: the REAL project switcher (rows + إخفاء المبالغ) switches projects', async () => {
    await enterOwner();
    // The ContextBar's project switcher opens the sheet.
    await press(screen.getByText('ورشة الياسمين للخياطة'));
    expect(screen.getByText('حلويات بيت الريف')).toBeTruthy();
    expect(screen.getByText('إخفاء المبالغ')).toBeTruthy();
    await press(screen.getByText('حلويات بيت الريف'));
    await waitFor(() => {
      expect(screen.getByText(/170/)).toBeTruthy(); // حلويات بيت الريف's cash box on the tile
    });
  });

  test('the object sheet titles resolve the live objects', () => {
    const Probe = () => {
      const state = useSim();
      return (
        <p data-testid="titles">
          {[objectTitle('1175', state), objectTitle('cash', state), objectTitle('د2', state), objectTitle('ت3', state)].join('|')}
        </p>
      );
    };
    render(
      <SimProvider>
        <Probe />
      </SimProvider>,
    );
    expect(screen.getByTestId('titles').textContent).toBe('طلب 1175|درج الكاش|د2 · أبو محمد (بقالة النور)|ت3 · إلى الزرقاء، حي معصوم');
  });

  test('the needs-you selectors: the §5.1 fixed order from the live data', () => {
    // The static trial data order: ت1 (quote), 1203 (needsReview), د2 (debt),
    // wallet (negative), 1175 (ready), 1172 (delivered), ت3 (proposal), draft.
    const state = {
      deliveries: [
        { id: 'ت1', status: 'quoteArrived', quotes: [{ amount: 3000, state: 'valid', time: '10:40' }] },
        { id: 'ت3', status: 'failed', issueClosed: false },
      ],
      orders: [
        { id: '1203', project: 'yasmine', status: 'needsReview', content: 'بدلة كاملة', customer: 'خالد الزعبي' },
        { id: '1175', project: 'yasmine', status: 'ready', content: 'فستان سهرة', customer: 'سلمى الحوراني' },
        { id: '1172', project: 'yasmine', status: 'delivered', content: 'عباءة مطرزة', customer: 'سلمى الحوراني' },
      ],
      debts: [
        { id: 'د2', party: 'أبو محمد (بقالة النور)', side: 'forYou', overdue: true, settled: false },
        { id: 'د1', party: 'سلمى الحوراني', side: 'forYou', overdue: false, settled: false },
      ],
      movements: [
        { id: 'ح1', saved: true, type: 'in', amount: 450000, fund: 'bank', party: 'رنا', note: 'طقم' },
        { id: 'ح9', saved: true, type: 'out', amount: 23000, fund: 'wallet', party: null, note: 'توصيل' },
        { id: 'draft-1', saved: false, type: 'out', amount: 7000, fund: 'cash', party: null, note: 'طباعة' },
      ],
      listings: [],
    } as unknown as Parameters<typeof todayNeedsYouList>[0];
    const needs = todayNeedsYouList(state).map((n) => n.kind);
    expect(needs).toEqual(['quote', 'needsReview', 'overdueDebt', 'negativeFund', 'ready', 'delivered', 'proposal', 'draft']);
    const finance = financeNeedsYou(state).map((n) => n.kind);
    expect(finance).toEqual(['draft', 'overdueDebt']);
  });

  test('moneyText: the fils → Money-input string (the §5.2.3 reference values)', () => {
    expect(moneyText(595500)).toBe('595.500');
    expect(moneyText(271250)).toBe('271.250');
    expect(moneyText(-3000)).toBe('-3');
    expect(moneyText(1055500)).toBe('1055.500');
    expect(marketCount({ listings: [] } as unknown as Parameters<typeof marketCount>[0])).toBe(0);
  });
});
