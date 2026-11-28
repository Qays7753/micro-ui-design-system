/**
 * جولة المستخدم — the finance day works end to end: the movement form saves
 * a real movement (in/transfer/yesterday), the payment sheet pays a debt
 * with its «اكتب مبلغاً حتى … د» error, the debt/fund/movement object sheets
 * carry the object's real data, and the draft is saved or discarded from its
 * sheet. All through the REAL UI (render + press), the established pattern.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { App } from '../App';
import { SimProvider } from '../state/store';

afterEach(cleanup);

// The state persists to localStorage (decision 2) — clean it before every
// test so each one starts from the §5.2 original data.
beforeEach(() => window.localStorage.clear());

async function press(el: Element) {
  const target = el.closest('button') ?? el;
  fireEvent.pointerDown(target, { pointerId: 1 });
  fireEvent.pointerUp(target, { pointerId: 1 });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 60));
  });
}

/** A native-click press (the marker cards use onClick). */
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

async function ownerFinance() {
  render(
    <SimProvider>
      <App />
    </SimProvider>,
  );
  await press(screen.getByText('ورشة الياسمين للخياطة'));
  // ← المالية عبر التبويب
  const tab = screen.getAllByRole('tab').find((b) => b.textContent === 'المالية')!;
  await press(tab);
}

/** A SegmentedControl segment press: the first button with that exact name
 *  (the caller passes an index when من/إلى duplicate the names). */
async function pick(name: string, index = 0) {
  const el = screen.getAllByRole('button', { name }).filter((b) => b.classList.contains('mds-segment'))[index]
    ?? screen.getAllByRole('button', { name })[index]!;
  await press(el);
}

describe('جولة المستخدم — المالية تعمل من أولها لآخرها', () => {
  test('ر2.1: تسجيل حركة داخل 145.750 في الحساب البنكي من سلمى الحوراني', async () => {
    await ownerFinance();
    await press(screen.getByText('سجّل حركة'));
    await pick('داخل');
    type(/المبلغ/, '145.750');
    await pick('الحساب البنكي');
    type(/الطرف/, 'سلمى الحوراني');
    await press(screen.getByText('احفظ الحركة'));
    // الحركة حُفظت: رصيد البنك صار 327.250 + 145.750 = 473.000 (ينعرض «473»)
    const bankRow = screen.getAllByText('الحساب البنكي').map((e) => e.closest('button'))
      .find((b) => b?.textContent?.includes('الرصيد الآن'));
    expect(bankRow?.textContent).toContain('473');
    expect(screen.getAllByText(/داخل · سلمى الحوراني/).length).toBeGreaterThanOrEqual(1);
  });

  test('ر2.2: تحويل 45 من الدرج إلى البنك — ومن وإلى لا يكونان الصندوق نفسه', async () => {
    await ownerFinance();
    await press(screen.getByText('سجّل حركة'));
    await pick('تحويل');
    type(/المبلغ/, '45');
    // «من» = الدرج، «إلى» = البنك (الأسماء مكررة بين المن وإلى)
    await pick('درج الكاش', 0);
    await pick('الحساب البنكي', 1);
    // جرّب نفس الصندوق مرتين: خطأ ظاهر والحفظ معطّل
    await pick('درج الكاش', 1);
    expect(screen.getByText('من وإلى لا يكونان الصندوق نفسه.')).toBeTruthy();
    const save = screen.getByText('احفظ الحركة').closest('button')!;
    expect(save.hasAttribute('disabled')).toBe(true);
    // صحّح إلى البنك واحفظ
    await pick('الحساب البنكي', 1);
    await press(save);
    // البنك صار 327.250 + 45 = 372.250
    const bankRow = screen.getAllByText('الحساب البنكي').map((e) => e.closest('button'))
      .find((b) => b?.textContent?.includes('الرصيد الآن'));
    expect(bankRow?.textContent).toContain('372.250');
  });

  test('الحفظ معطّل بلا نوع أو مبلغ، والسبب مكتوب للمستخدم', async () => {
    await ownerFinance();
    await press(screen.getByText('سجّل حركة'));
    const save = screen.getByText('احفظ الحركة').closest('button')!;
    expect(save.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('اختر النوع.')).toBeTruthy();
    await pick('داخل');
    expect(screen.getByText('اكتب المبلغ.')).toBeTruthy();
  });

  test('ر2.3: دفعة على د1 — المبلغ الأكبر يُرفض برسالة المواصفة، والصحيح يُسدّد', async () => {
    await ownerFinance();
    // بطاقة سلمى في الديون: الصف الذي يحمل علامة DebtCard
    const row = screen.getAllByText('سلمى الحوراني').find((el) => el.closest('button')?.querySelector('[data-sim-later="DebtCard"]'))!;
    await press(row);
    expect(screen.getByText('الإجمالي')).toBeTruthy();
    await press(screen.getByText('سجّل دفعة'));
    type(/المبلغ/, '50');
    expect(screen.getByText('اكتب مبلغاً حتى 45 د.')).toBeTruthy();
    const save = screen.getByText('احفظ الدفعة').closest('button')!;
    expect(save.hasAttribute('disabled')).toBe(true);
    type(/المبلغ/, '35');
    await pick('درج الكاش');
    await press(save);
    // المتبقي 10 د ظاهر في صف الدين
    expect(screen.getAllByText(/^10$/).length).toBeGreaterThanOrEqual(1);
  });

  test('ورقة الصندوق تحمل رصيده وحركاته، والمسودة تُجاهل من ورقتها', async () => {
    await ownerFinance();
    await press(screen.getAllByText('درج الكاش')[0]!);
    // صفو الرصيد: الصناديق خلف الورقة + ورقة الصندوق نفسها
    expect(screen.getAllByText('الرصيد الآن').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('حركة لم تُحفظ على هذا الصندوق')).toBeTruthy();
    await press(screen.getByText(/مسودة 7 د/));
    await press(screen.getByText('تجاهل المسودة'));
    expect(screen.queryByText(/طباعة/)).toBeNull();
  });

  test('حفظ المسودة من ورقتها يرفعها للحركات (س6)', async () => {
    await ownerFinance();
    await press(screen.getByText(/مسودة · طباعة/));
    await press(screen.getByText('احفظ المسودة'));
    // رصيد الدرج بعد الخصم: 271.250 - 7 = 264.250
    const cashRow = screen.getAllByText('درج الكاش').map((e) => e.closest('button'))
      .find((b) => b?.textContent?.includes('الرصيد الآن'));
    expect(cashRow?.textContent).toContain('264.250');
  });

  test('بطاقات «يحتاجك» في اليوم تفتح ورقة الكائن (§5.1)', async () => {
    render(
      <SimProvider>
        <App />
      </SimProvider>,
    );
    await press(screen.getByText('ورشة الياسمين للخياطة'));
    await clickEl(screen.getByText(/عرض سعر ساري/));
    // ورقة الكائن تُفتح على ت1 (محتوى التوصيل الكامل يأتي في وحدة التوصيل SU3)
    const sheet = document.querySelector('.mds-sheet');
    expect(sheet).toBeTruthy();
    expect(sheet!.getAttribute('aria-label')).toContain('ت1');
  });
});
