/**
 * SA7ج — the supplier's screens (§5.1 المورد): the SegmentedControl
 * «عروضي» / «السوق», his own listings as REAL ObjectRows with the
 * ListingStatusBadge's place as compact markers, the ListingEditor form
 * sheet's real fields, and the market part reusing the shared body.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { App } from '../../App';
import { SimProvider } from '../../state/store';

afterEach(cleanup);

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

/** Renders and enters the supplier role → «عروضي». */
async function enterSupplier() {
  renderApp();
  await press(screen.getByText('مخبز الأصيل للجملة'));
}

describe('SA7ج — the supplier screens (§5.1)', () => {
  test('عروضي: his five listings as real rows with their badge words', async () => {
    await enterSupplier();
    expect(screen.getAllByText('عروضي').length).toBeGreaterThanOrEqual(2); // header + segment
    expect(screen.getByText('عرض جديد')).toBeTruthy();
    // ع1–ع5: his own listings only (not ع6–ع8 of other suppliers).
    expect(screen.getByText('طحين أبيض فاخر 50 كغ')).toBeTruthy();
    expect(screen.getByText('معمول تمر فاخر — علبة 24')).toBeTruthy();
    expect(screen.getAllByRole('button').filter((b) => /خبز صاج/.test(b.textContent ?? '')).length).toBe(1);
    // The badge words at the rows' ends (the ListingStatusBadge's place).
    expect(screen.getAllByText('قيد المراجعة').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/تعديل قيد المراجعة/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('يُركَّب لاحقًا: ListingStatusBadge').length).toBe(5);
    // The rejected listing carries its reason.
    expect(screen.getByText(/مرفوض · السبب: الصور غير واضحة/)).toBeTruthy();
    // No TabBar for the supplier.
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  test('«عرض جديد» opens the ListingEditor form with its real fields', async () => {
    await enterSupplier();
    await press(screen.getByText('عرض جديد'));
    expect(screen.getByText('اسم العرض')).toBeTruthy();
    expect(screen.getByText('العبوة')).toBeTruthy();
    expect(screen.getByText('متوفر')).toBeTruthy();
    expect(screen.getByText('أرسل للمراجعة')).toBeTruthy();
    // The batch-2 parts carry the marker.
    expect(screen.getAllByText('يُركَّب لاحقًا: PhotoUploader').length).toBe(2); // المعرض + النموذج (صور ع1 وع…) — جولة المستخدم
  });

  test('«السوق» segment: the shared market body with the supplier segments', async () => {
    await enterSupplier();
    await press(screen.getByText('السوق'));
    // The 5 visible listings of the shared market.
    expect(screen.getAllByText('يُركَّب لاحقًا: ListingCard').length).toBe(5);
    expect(screen.getByPlaceholderText('ابحث في السوق')).toBeTruthy();
    // The segments stay for the way back to عروضي.
    await press(screen.getByText('عروضي'));
    expect(screen.getByText('معمول تمر فاخر — علبة 24')).toBeTruthy();
  });
});
