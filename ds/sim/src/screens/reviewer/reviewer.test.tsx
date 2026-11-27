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
  test('المراجعة: the queue oldest-first with its DecisionCard places', async () => {
    await enterReviewer();
    expect(screen.getAllByText('المراجعة').length).toBeGreaterThanOrEqual(2); // header + tab
    // §5.2.8: ع3 (5 hours) then ع8 (3 hours, first listing) then ع4-تعديل.
    const queue = document.querySelectorAll('[data-sim-later="ReviewQueueItem"]');
    expect(queue.length).toBe(3);
    expect(queue[0]!.textContent).toContain('خبز صاج، ربطة 10');
    expect(queue[0]!.textContent).toContain('منذ 5 ساعات');
    expect(queue[1]!.textContent).toContain('مقلوبة مجمدة');
    expect(queue[2]!.textContent).toContain('كعك بالسمسم');
    expect(queue[2]!.textContent).toContain('تعديل عرض');
    // The DecisionCard places carry their §6.2 content notes.
    expect(screen.getByText(/بنود التحقق السبعة/)).toBeTruthy();
    expect(screen.getByText(/«اعتمد العرض» \/ «ارفض العرض» بسبب/)).toBeTruthy();
    expect(document.querySelectorAll('[data-sim-later="DecisionCard"]').length).toBe(3);
  });

  test('البلاغات: ع6 with its most-common reason and أبقِ/أوقف', async () => {
    await enterReviewer();
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'البلاغات')!;
    await press(tab);
    expect(screen.getByText(/قماش ساتان، لفّة 25 م/)).toBeTruthy();
    expect(screen.getByText(/السبب الأكثر تكرارًا: معلومات مضللة/)).toBeTruthy();
    expect(screen.getByText(/«أبقِ العرض» \/ «أوقف العرض»/)).toBeTruthy();
  });

  test('السائقون: يزن القضاة with his DriverApprovalCard place', async () => {
    await enterReviewer();
    const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'السائقون')!;
    await press(tab);
    expect(screen.getByText(/يزن القضاة · بانتظار الاعتماد · منذ يومين/)).toBeTruthy();
    expect(screen.getByText('يُركَّب لاحقًا: DriverApprovalCard')).toBeTruthy();
    expect(screen.getByText(/المرفقات الثلاثة/)).toBeTruthy();
  });

  test('the reviewer has no notifications — the real EmptyState', async () => {
    await enterReviewer();
    await press(screen.getByRole('button', { name: 'الإشعارات' }));
    expect(screen.getByText('الإشعارات تظهر هنا.')).toBeTruthy();
    expect(screen.queryByText('يُركَّب لاحقًا: NotificationCenter')).toBeNull();
  });
});
