/**
 * SA7د — the reviewer's three screens (§5.1 المراجع / م1 §6.5): the queue at
 * its ReviewQueueItem places with the DecisionCard place per item, the
 * reports and the driver approval, behind the three-tab TabBar.
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

/** Renders and enters the reviewer role → «المراجعة». */
async function enterReviewer() {
  renderApp();
  await press(screen.getByText('مراجعة المنصة'));
}

describe('SA7د — the reviewer screens (§5.1)', () => {
  test('المراجعة: the queue oldest-first — real rows that open the decision sheets', async () => {
    await enterReviewer();
    expect(screen.getAllByText('المراجعة').length).toBeGreaterThanOrEqual(2); // header + tab
    // §5.2.8: ع3 (5 hours) then ع8 (3 hours, first listing) then ع4-تعديل —
    // جولة المستخدم: الصفوف حقيقية تفتح ورقة القرار، وعلامة ReviewQueueItem
    // في نهاية كل صف.
    const queue = document.querySelectorAll('[data-sim-later="ReviewQueueItem"]');
    expect(queue.length).toBe(3);
    expect(screen.getByText('خبز صاج، ربطة 10')).toBeTruthy();
    expect(screen.getByText('عرض جديد · 1.5 د · مخبز الأصيل للجملة · منذ 5 ساعات')).toBeTruthy();
    expect(screen.getByText('مقلوبة مجمدة، صينية 4 أشخاص')).toBeTruthy();
    expect(screen.getByText('كعك بالسمسم، كيس 1 كغ')).toBeTruthy();
    await press(screen.getByText('خبز صاج، ربطة 10'));
    // ورقة القرار: بنود التحقق السبعة + اتصال + اعتمد/ارفض
    expect(screen.getByText('أجريت اتصال التحقق')).toBeTruthy();
    expect(screen.getByText('اعتمد العرض')).toBeTruthy();
    expect(screen.getByText('ارفض العرض')).toBeTruthy();
    expect(screen.getByText('مكان المكوّن الحقيقي')).toBeTruthy();
  });

  test('البلاغات: ع6 with its most-common reason — the row opens أبقِ/أوقف', async () => {
    await enterReviewer();
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'البلاغات')!;
    await press(tab);
    expect(screen.getByText(/قماش ساتان، لفّة 25 م/)).toBeTruthy();
    expect(screen.getByText(/السبب الأكثر تكرارًا: معلومات مضللة/)).toBeTruthy();
    expect(screen.getByText('3 بلاغات')).toBeTruthy();
    await press(screen.getByText(/قماش ساتان، لفّة 25 م/));
    expect(screen.getByText('أبقِ العرض')).toBeTruthy();
    expect(screen.getByText('أوقف العرض')).toBeTruthy();
    expect(screen.getAllByText('معلومات مضللة').length).toBeGreaterThanOrEqual(1); // السبب في القائمة خلف الورقة وفي صفوفها
  });

  test('السائقون: يزن القضاة — the row opens his approval sheet with data + attachments', async () => {
    await enterReviewer();
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'السائقون')!;
    await press(tab);
    expect(screen.getByText('يزن القضاة')).toBeTruthy();
    expect(screen.getByText(/بانتظار الاعتماد · منذ يومين/)).toBeTruthy();
    await press(screen.getByText('يزن القضاة'));
    expect(screen.getByText('الهاتف')).toBeTruthy();
    expect(screen.getByText('المركبة واللوحة')).toBeTruthy();
    expect(screen.getByText('يُركَّب لاحقًا: DriverApprovalCard')).toBeTruthy();
    expect(screen.getByText('اعتمد السائق')).toBeTruthy();
  });

  test('the reviewer has no notifications — the real EmptyState', async () => {
    await enterReviewer();
    await press(screen.getByRole('button', { name: 'الإشعارات' }));
    expect(screen.getByText('الإشعارات تظهر هنا.')).toBeTruthy();
    expect(screen.queryByText('يُركَّب لاحقًا: NotificationCenter')).toBeNull();
  });
});
