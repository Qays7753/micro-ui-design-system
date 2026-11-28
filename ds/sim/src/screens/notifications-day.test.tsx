/**
 * جولة المستخدم — the bell reads: each notification carries its §5.2.9 text
 * (object + new state), the unread dot, and tapping opens the object; the
 * reviewer's bell stays the real EmptyState.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { App } from '../App';
import { SimProvider } from '../state/store';

afterEach(cleanup);
beforeEach(() => window.localStorage.clear());

async function press(el: Element) {
  const target = el.closest('button') ?? el;
  fireEvent.pointerDown(target, { pointerId: 1 });
  fireEvent.pointerUp(target, { pointerId: 1 });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
}

describe('جولة المستخدم — الجرس يقرأ', () => {
  test('جرس المالك: 5 إشعارات بنصوصها، وغير المقروء بنقطة، والضغط يفتح الكائن', async () => {
    render(
      <SimProvider>
        <App />
      </SimProvider>,
    );
    await press(screen.getByText('ورشة الياسمين للخياطة'));
    await press(screen.getByRole('button', { name: 'الإشعارات، 3 غير مقروءة' }));
    // §5.2.9: «ت1: وصل عرض سعر 3 د» حرفيًا
    expect(screen.getByText('ت1: وصل عرض سعر 3 د')).toBeTruthy();
    expect(screen.getByText('ت1: عرض السعر ينتهي قريبًا')).toBeTruthy();
    expect(screen.getByText('ت2: نتيجة حجز التوصيل')).toBeTruthy();
    // النقاط للغير مقروءة (3)
    expect(document.querySelectorAll('.sim-unread-dot').length).toBe(3);
    // الضغط على إشعار ت1 يفتح ورقة ت1 ويقرأه
    await press(screen.getByText('ت1: وصل عرض سعر 3 د'));
    expect(document.querySelector('.mds-sheet')?.getAttribute('aria-label')).toContain('ت1');
  });

  test('جرس السائق والمراجع: إشعاراته هو، والمراجع فارغ EmptyState', async () => {
    render(
      <SimProvider>
        <App />
      </SimProvider>,
    );
    await press(screen.getByText('عمر الزعبي'));
    await press(screen.getByRole('button', { name: 'الإشعارات، 2 غير مقروءة' }));
    expect(screen.getByText('ت4: طلب حجز توصيل جديد')).toBeTruthy();
    expect(screen.getByText('ت3: أرفق إثبات التسليم قبل انتهاء المهلة')).toBeTruthy();
  });

  test('جرس المراجع فارغ: EmptyState حقيقية بلا علامة', async () => {
    render(
      <SimProvider>
        <App />
      </SimProvider>,
    );
    await press(screen.getByText('مراجعة المنصة'));
    await press(screen.getByRole('button', { name: 'الإشعارات' }));
    expect(screen.getByText('الإشعارات تظهر هنا.')).toBeTruthy();
    expect(screen.queryByText('يُركَّب لاحقًا: NotificationCenter')).toBeNull();
  });
});
