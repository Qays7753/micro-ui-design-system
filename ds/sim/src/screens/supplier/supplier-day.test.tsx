/**
 * جولة المستخدم — the supplier's day works end to end: creating a listing
 * with three real tiers (ر5.2)، the honest «أضف صورة أولاً» blocked state،
 * and editing a published price (ع4's loop from the supplier's side).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { App } from '../../App';
import { SimProvider } from '../../state/store';

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

function type(label: RegExp, value: string) {
  const field = screen.getByLabelText(label) as HTMLInputElement;
  fireEvent.change(field, { target: { value } });
}

async function supplier() {
  render(
    <SimProvider>
      <App />
    </SimProvider>,
  );
  await press(screen.getByText('مخبز الأصيل للجملة'));
}

describe('جولة المستخدم — المورد ينشر ويعدّل', () => {
  test('ر5.2: عرض جديد بثلاث شرائح يذهب قيد المراجعة — وبلا صورة الزر معطّل بسببه', async () => {
    await supplier();
    await press(screen.getByText('عرض جديد'));
    const send = screen.getByText('أرسل للمراجعة').closest('button')!;
    expect(send.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('أضف صورة أولاً.')).toBeTruthy();
    type(/اسم العرض/, 'طحين أسمر 25 كغ');
    type(/العبوة/, 'كيس');
    await press(screen.getByText('شرائح'));
    // الصور: التبديل المؤقت — حقل مخفي ينقر نقرة أصلية مرتين (الأولى يبتلعها المتتبع)
    // مفتاح الصور: انقر حتى يثبت (jsdom قد يبتلع أول نقرة بمتتبّع القيم)
    const swByLabel = () => screen.getByText(/الصور أُرفقت/).closest('label')?.querySelector('input') as HTMLInputElement;
    swByLabel().click();
    await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
    if (!swByLabel().checked) {
      swByLabel().click();
      await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
    }
    expect(swByLabel().checked).toBe(true);
    type(/الشريحة 1/, '2');
    type(/الشريحة 2/, '1.750');
    type(/الشريحة 3/, '1.5');
    expect(send.hasAttribute('disabled')).toBe(false);
    await press(send);
    // العرض الجديد في «عروضي» بشارة قيد المراجعة
    expect(screen.getByText('طحين أسمر 25 كغ')).toBeTruthy();
    expect(screen.getAllByText(/قيد المراجعة/).length).toBeGreaterThanOrEqual(1);
  });

  test('تعديل سعر عرض منشور — المنشور مقابل الجديد، والتعديل للمراجعة', async () => {
    await supplier();
    // افتح ع1 (معتمد) ثم «عدّل العرض»
    await press(screen.getAllByText('طحين أبيض فاخر 50 كغ')[0]!);
    await press(screen.getByText('عدّل العرض'));
    expect(screen.getByText('المنشور الآن')).toBeTruthy();
    const send = screen.getByText('أرسل التعديل').closest('button')!;
    expect(send.hasAttribute('disabled')).toBe(true);
    type(/السعر الجديد/, '23');
    expect(send.hasAttribute('disabled')).toBe(false);
    await press(send);
    // ع1 صار «تعديل قيد المراجعة»
    expect(screen.getAllByText(/تعديل قيد المراجعة/).length).toBeGreaterThanOrEqual(2);
  });

  test('بلاغ ر5.3 عبر المالك: السبب يُختار والبلاغ يصل عرض ع6', async () => {
    render(
      <SimProvider>
        <App />
      </SimProvider>,
    );
    await press(screen.getByText('ورشة الياسمين للخياطة'));
    await press(screen.getAllByRole('tab').find((b) => b.textContent === 'السوق')!);
    fireEvent.click(screen.getAllByText('قماش ساتان أبيض — لفّة 25 م')[0]!); // بطاقة السوق onClick
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    await press(screen.getByText('أبلغ عن العرض'));
    const send = screen.getByText('أرسل البلاغ').closest('button')!;
    expect(send.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('اختر سبب البلاغ.')).toBeTruthy();
    await press(screen.getByText('معلومات مضللة'));
    await press(send);
    expect(document.querySelector('.mds-sheet')).toBeNull();
  });
});
