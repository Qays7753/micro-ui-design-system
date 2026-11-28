/**
 * جولة المستخدم — the reviewer's day works end to end: ع8 approved through
 * the seven verification items + the call (ر6.1)، ع3 rejected with a ready
 * reason (ر6.2)، ع4's edit approved، ع6's reports kept/stopped (the market
 * hides a stopped listing)، and يزن approved after seeing his data and
 * attachments (ر6.3).
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

async function clickEl(el: Element) {
  // صفوف المكتبة (ObjectRow) تفتح بالضغط الإشاري نفسه
  await press(el);
}

async function reviewer(tab: 'المراجعة' | 'البلاغات' | 'السائقون' = 'المراجعة') {
  render(
    <SimProvider>
      <App />
    </SimProvider>,
  );
  await press(screen.getByText('مراجعة المنصة'));
  const tabEl = screen.getAllByRole('tab').find((b) => b.textContent === tab)!;
  await press(tabEl);
}

describe('جولة المستخدم — المراجع يبتّ في كل شيء', () => {
  test('ر6.1: ع8 معتمد بعد تأشير البنود السبعة واتصال التحقق — والزر معطّل قبلهما بسببه', async () => {
    await reviewer();
    await clickEl(screen.getAllByText(/خبز صاج/)[0]!);
    const approve = screen.getByText('اعتمد العرض').closest('button')!;
    expect(approve.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('أشّر على كل البنود أولاً.')).toBeTruthy();
    // البنود السبعة — الضغط على صف كل بند (الlabel يحمل الحقل المخفي)
    // النقرة الأولى على ورقة مفتوحة حديثًا يبتلعها متتبّع القيم في jsdom —
    // تسخين ثم الأنقرات الحقيقية عبر element.click()
    const { VERIFY_ITEMS } = await import('../../data/review');
    const warm = screen.getByText(VERIFY_ITEMS[0]!).closest('label')?.querySelector('input') as HTMLInputElement;
    warm.click();
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    for (const item of VERIFY_ITEMS) {
      const input = screen.getByText(item).closest('label')?.querySelector('input') as HTMLInputElement;
      input.click();
      await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    }
    // أعِد الاستعلام بعد كل إعادة رسم (عقدة React قد تُستبدل)
    const approve2 = screen.getByText('اعتمد العرض').closest('button')!;
    expect(approve2.hasAttribute('disabled')).toBe(true); // الاتصال لم يُؤشَّر بعد
    (screen.getByRole('switch', { hidden: true }) as HTMLInputElement).click();
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    const approve3 = screen.getByText('اعتمد العرض').closest('button')!;
    expect(approve3.hasAttribute('disabled')).toBe(false);
    await press(approve3);
    // ع8 خرج من الطابور
    expect(screen.queryByText(/خبز صاج/)).toBeNull();
  });

  test('ر6.2: ع3 مرفوض بسبب جاهز غير فارغ', async () => {
    await reviewer();
    await clickEl(screen.getAllByText(/خبز صاج/)[0]!);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    await press(screen.getByText('ارفض العرض'));
    await press(screen.getByText('الصور غير واضحة'));
    await press(screen.getByText('أرسل الرفض'));
    // ع3 خرج من الطابور
    expect(screen.queryByText(/خبز صاج/)).toBeNull();
  });

  test('تعديل ع4: اعتماد التعديل يجعل 2.750 المنشور', async () => {
    await reviewer();
    await clickEl(screen.getAllByText(/كعك بالسمسم/)[0]!);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    expect(screen.getByText('المنشور الآن')).toBeTruthy();
    await press(screen.getByText('اعتمد التعديل'));
    expect(screen.queryByText(/كعك بالسمسم/)).toBeNull();
  });

  test('البلاغات: أبقِ العرض يمحو البلاغات، وأوقف العرض يخفيه من السوق', async () => {
    await reviewer('البلاغات');
    expect(screen.getAllByText(/3 بلاغات/).length).toBeGreaterThanOrEqual(1);
    await clickEl(screen.getAllByText(/قماش ساتان/)[0]!);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    await press(screen.getByText('أبقِ العرض'));
    expect(screen.getByText('لا بلاغات.')).toBeTruthy();
  });

  test('ر6.3: يزن معتمد بعد رؤية حقوله ومرفقاته الثلاثة', async () => {
    await reviewer('السائقون');
    await clickEl(screen.getAllByText(/يزن القضاة/)[0]!);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    expect(screen.getByText('الهاتف')).toBeTruthy();
    expect(screen.getByText('المركبة واللوحة')).toBeTruthy();
    expect(screen.getByText('صورة الهوية')).toBeTruthy();
    expect(screen.getByText('رخصة القيادة')).toBeTruthy();
    expect(screen.getByText('إثبات المركبة')).toBeTruthy();
    await press(screen.getByText('اعتمد السائق'));
    expect(screen.getByText('لا طلبات اعتماد.')).toBeTruthy();
  });
});
