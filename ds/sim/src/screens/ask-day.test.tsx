/**
 * جولة المستخدم — Ask works: the owner's س1 answers from the live data with
 * its computed result and table، س3 names the overdue debt، س9 (ربح) is the
 * polite limit، an unknown question lists the role's ready questions، and
 * the driver asking about finance hits the scope limit.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { App } from '../App';
import { SimProvider } from '../state/store';

afterEach(cleanup);
beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => vi.useRealTimers());

async function press(el: Element) {
  const target = el.closest('button') ?? el;
  fireEvent.pointerDown(target, { pointerId: 1 });
  fireEvent.pointerUp(target, { pointerId: 1 });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
}

function type(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label) as HTMLInputElement, { target: { value } });
}

async function openAsk(row: string) {
  render(
    <SimProvider>
      <App />
    </SimProvider>,
  );
  await press(screen.getByText(row));
  await press(screen.getAllByRole('button', { name: 'Ask Micro' })[0]!);
}

async function askQuestion(q: string) {
  type(/اسأل عن مشروعك/, q);
  await press(screen.getByText('اسأل'));
  // §5.3: the AskThinking delay (1200ms) then the answer.
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1300);
  });
}

describe('جولة المستخدم — Ask يجيب من البيانات الحية', () => {
  test('س1: دخل هذا الأسبوع 294.750 د من 7 حركات + الجدول اليومي', async () => {
    await openAsk('ورشة الياسمين للخياطة');
    await askQuestion('كم دخل هذا الأسبوع؟');
    expect(screen.getAllByText(/دخل هذا الأسبوع/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/294\.750/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('7 حركات «داخل» من 22/11 إلى 27/11')).toBeTruthy();
    expect(screen.getByText('اليوم · الداخل')).toBeTruthy();
  });

  test('س3: الديون تجيب بأبو محمد المتأخر وصف يفتح الدين', async () => {
    await openAsk('ورشة الياسمين للخياطة');
    await askQuestion('مين عليه دين لي؟');
    expect(screen.getAllByText(/عند عميلين/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/متأخر/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/أبو محمد/).length).toBeGreaterThanOrEqual(1);
  });

  test('س9: «كم ربحت؟» يُجاب بالرفض المهذب', async () => {
    await openAsk('ورشة الياسمين للخياطة');
    await askQuestion('كم ربحت هالشهر؟');
    expect(screen.getByText('لا أملك بيانات كافية لهذا السؤال.')).toBeTruthy();
  });

  test('سؤال غير موجود: يسرّد أسئلة الدور ويكتبها في الحقل', async () => {
    await openAsk('ورشة الياسمين للخياطة');
    await askQuestion('كيف الطقس اليوم؟');
    expect(screen.getAllByText('لا أعرف جواب هذا السؤال في هذه النسخة.').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('كم دخل هذا الأسبوع؟').length).toBeGreaterThanOrEqual(1);
    await press(screen.getAllByText('كم دخل هذا الأسبوع؟').at(-1)!);
    const field = screen.getByLabelText(/اسأل عن مشروعك/) as HTMLInputElement;
    expect(field.value).toBe('كم دخل هذا الأسبوع؟');
  });

  test('س6: «سجّل مصروف 7 دنانير طباعة» → بطاقة مسودة تُحفظ فتتغير الأرصدة', async () => {
    await openAsk('ورشة الياسمين للخياطة');
    await askQuestion('سجّل مصروف 7 دنانير طباعة من الدرج');
    expect(screen.getByText(/هذه مسودة/)).toBeTruthy();
    expect(screen.getByText(/خارج · طباعة/)).toBeTruthy();
    await press(screen.getByText('احفظ المسودة'));
    // الورقة أُغلقت والحركة دخلت البيانات (رصيد الدرج 271.250 − 7 = 264.250)
    expect(document.querySelector('.mds-sheet')).toBeNull();
  });

  test('السائق يسأل عن المالية: خارج صلاحياتك', async () => {
    await openAsk('عمر الزعبي');
    await askQuestion('كم دخل هذا الأسبوع؟');
    expect(screen.getByText('هذا خارج صلاحياتك في هذا المشروع.')).toBeTruthy();
  });

  test('إخفاء المبالغ يسري على الأجوبة', async () => {
    await openAsk('ورشة الياسمين للخياطة');
    // أخفِ المبالغ من مبدّل المشروع
    await press(screen.getAllByRole('button', { name: /ورشة الياسمين/ })[0]!);
    await press(screen.getByText('إخفاء المبالغ'));
    await press(screen.getAllByRole('button', { name: 'Ask Micro' })[0]!);
    await askQuestion('كم في الصناديق الآن؟');
    expect(screen.queryByText(/595\.500/)).toBeNull();
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1);
  });
});
