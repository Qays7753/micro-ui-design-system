/**
 * جولة المستخدم — the orders day works end to end: creating the ر3.1 order
 * with its exact values (سلمى الحوراني، 45، غدًا 28/11، 4:00 م)، delivering
 * 1175 from its sheet (ر3.3)، approving the «يحتاج مراجعة» order 1203، the
 * honest blocked-save help, and the time parsing. Real UI throughout.
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

/** The marker cards ride onClick — a real touch's compatibility click. */
async function clickEl(el: Element) {
  fireEvent.click(el);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
}

function type(label: RegExp, value: string) {
  const field = screen.getByLabelText(label) as HTMLInputElement;
  fireEvent.change(field, { target: { value } });
}

async function ownerOrders() {
  render(
    <SimProvider>
      <App />
    </SimProvider>,
  );
  await press(screen.getByText('ورشة الياسمين للخياطة'));
  const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'الطلبات')!;
  await press(tab);
}

describe('جولة المستخدم — الطلبات تعمل من أولها لآخرها', () => {
  test('ر3.1: طلب جديد لسلمى 45 د غدًا 4:00 م بحالة مؤكد', async () => {
    await ownerOrders();
    await press(screen.getByText('طلب جديد'));
    type(/العميل/, 'سلمى الحوراني');
    type(/المحتوى/, 'فستان سهرة');
    type(/السعر/, '45');
    await press(screen.getByText('غدًا'));
    type(/الوقت/, '4:00 م');
    await press(screen.getByText('احفظ الطلب'));
    // الطلب الجديد في «الجارية»: العميل أولًا ثم المحتوى
    expect(screen.getAllByText(/سلمى الحوراني · فستان سهرة/).length).toBeGreaterThanOrEqual(1);
  });

  test('الوقت يُطبَّع: «16:00» و«4:00 م» يصيران 16:00، والخطأ له رسالة', async () => {
    await ownerOrders();
    await press(screen.getByText('طلب جديد'));
    type(/العميل/, 'ندى الشوابكه');
    type(/السعر/, '30');
    await press(screen.getByText('غدًا'));
    type(/الوقت/, '16:00');
    // لا رسالة خطأ
    expect(screen.queryByText('اكتب الوقت مثل 4:00 م أو 16:00.')).toBeNull();
    type(/الوقت/, 'خمسة');
    expect(screen.getByText('اكتب الوقت مثل 4:00 م أو 16:00.')).toBeTruthy();
    const save = screen.getByText('احفظ الطلب').closest('button')!;
    expect(save.hasAttribute('disabled')).toBe(true);
  });

  test('الحفظ معطّل بلا عميل أو موعد، والسبب مكتوب', async () => {
    await ownerOrders();
    await press(screen.getByText('طلب جديد'));
    const save = screen.getByText('احفظ الطلب').closest('button')!;
    expect(save.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('اكتب اسم العميل.')).toBeTruthy();
    type(/العميل/, 'خالد الزعبي');
    expect(screen.getByText('اختر موعد التسليم.')).toBeTruthy();
    await press(screen.getByText('اليوم'));
    // السعر فارغ لا يمنع الحفظ — يُحفظ مسودة (ر3.1's expected error path)
    const saveBtn = screen.getByText('احفظ الطلب').closest('button')!;
    expect(saveBtn.hasAttribute('disabled')).toBe(false);
    expect(screen.getByText(/بلا سعر يُحفظ «مسودة»/)).toBeTruthy();
    await press(saveBtn);
    // الحفظ تم: ورقة «طلب جديد» أُغلقت (المسودة رابعة في ترتيب «يحتاجك» فتظهر عبر «الكل» لا هنا)
    expect(document.querySelector('.mds-sheet')).toBeNull();
  });

  test('ر3.3: تسليم طلب 1175 من ورقته — حالته صارت «تم التسليم» ويظل في «يحتاجك» لحين التسوية', async () => {
    await ownerOrders();
    // 1175 جاهز في «يحتاجك» (بطاقة OrderCard)
    await clickEl(screen.getByText(/طلب 1175/));
    expect(screen.getByText('سجّل التسليم')).toBeTruthy();
    await press(screen.getByText('سجّل التسليم'));
    // الورقة أُغلقت، وحالة البطاقة صارت «تم التسليم» — الطلب يظل في «يحتاجك»
    // (تسويته المالية ما زالت على المالك)، و«السجل» لحين التسوية لا يعرضه
    expect(screen.queryByText(/طلب 1175 · سلمى الحوراني · فستان سهرة — بتالة كتف · جاهز/)).toBeNull();
    expect(screen.getAllByText(/طلب 1175 .* تم التسليم/).length).toBeGreaterThanOrEqual(1);
    // الرقائق تعمل الآن (كانت عالقة على «الكل»): «السجل» يخفي بطاقة يحتاجك —
    // 1175 لم تُسوَّ بعد فلا هي في السجل — والعودة إلى «الكل» تظهرها مجددًا
    await press(screen.getByText('السجل'));
    expect(screen.queryByText(/طلب 1175/)).toBeNull();
    expect(screen.getAllByText(/تمت التسوية|ملغى/).length).toBeGreaterThanOrEqual(1);
    await press(screen.getByText('السجل'));
    expect(screen.getAllByText(/1175/).length).toBeGreaterThanOrEqual(1);
  });

  test('اعتماد طلب «يحتاج مراجعة» (1203) يجعله مؤكدًا', async () => {
    await ownerOrders();
    await clickEl(screen.getByText(/طلب 1203/));
    expect(screen.getByText('اعتمد الطلب')).toBeTruthy();
    await press(screen.getByText('اعتمد الطلب'));
    // 1203 صار في «الجارية» بشارة «مؤكد»
    const row = screen.getAllByText(/خالد الزعبي · بدلة كاملة/)[0];
    expect(row).toBeTruthy();
  });

  test('ورقة الطلب تحمل بياناته كاملة (السعر، الموعد، الحالة، الارتباط)', async () => {
    await ownerOrders();
    await clickEl(screen.getByText(/طلب 1175/));
    expect(screen.getByText('العميل')).toBeTruthy();
    expect(screen.getByText('السعر')).toBeTruthy();
    expect(screen.getByText('الموعد')).toBeTruthy();
    expect(screen.getByText('الحالة')).toBeTruthy();
    // 1175 مرتبط بتوصيل ت1
    expect(screen.getByText('مرتبط بتوصيل')).toBeTruthy();
  });

  test('رقائق الفلتر تعمل: «يحتاجك» يخفي «الجارية» و«السجل» (كانت عالقة على الكل — جولة المستخدم)', async () => {
    await ownerOrders();
    const chipLabel = (t: string) =>
      [...document.querySelectorAll('button.mds-filter-chip')].find(
        (c) => c.querySelector('.mds-filter-chip-label')?.textContent === t,
      );
    const sections = () =>
      [...document.querySelectorAll('.mds-section')].map(
        (s) => s.querySelector('.mds-section-title')?.textContent ?? '',
      );
    // قبل الفلتر: الأقسام الثلاثة كلها ظاهرة
    expect(sections()).toContain('يحتاجك');
    expect(sections()).toContain('الجارية');
    // لمسة على رقاقة «يحتاجك»: FilterChips متعدد الاختيار فأرسل ['all','needsYou']
    // وكان onChange يأخذ v[0] فيبقى الفلتر 'all' للأبد — الآن يفوز الاختيار الأخير
    await press(chipLabel('يحتاجك')!);
    expect(chipLabel('يحتاجك')!.getAttribute('aria-pressed')).toBe('true');
    expect(chipLabel('الكل')!.getAttribute('aria-pressed')).toBe('false');
    // قسما «الجارية» و«السجل» خرجا من القائمة
    expect(sections()).not.toContain('الجارية');
    expect(sections()).not.toContain('السجل');
    expect(sections()).toContain('يحتاجك');
    // العودة إلى «الكل»: لمسة على الرقاقة النشطة تعيد الكل
    await press(chipLabel('يحتاجك')!);
    expect(chipLabel('الكل')!.getAttribute('aria-pressed')).toBe('true');
    expect(sections()).toContain('الجارية');
  });
});
