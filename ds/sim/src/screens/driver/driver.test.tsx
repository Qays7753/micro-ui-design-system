/**
 * SA7ب — the driver's screens (§5.1 السائق): no TabBar, the SegmentedControl
 * «الطلبات» / «مهامي» switches the two parts, and every DriverJobCard place
 * carries the internal marker with the live job data.
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

/** Renders and enters the driver role → «الطلبات». */
async function enterDriver() {
  renderApp();
  await press(screen.getByText('عمر الزعبي'));
}

describe('SA7ب — the driver screens (§5.1)', () => {
  test('الطلبات: ت4 awaits HIS quote and ت1 awaits the owner decision', async () => {
    await enterDriver();
    expect(screen.getByText('التوصيل')).toBeTruthy();
    expect(screen.getByText('الطلبات')).toBeTruthy();
    expect(screen.getByText('مهامي')).toBeTruthy();
    // No TabBar for the driver (9.1: عنصران فقط).
    expect(screen.queryByRole('tablist')).toBeNull();
    // ت4: awaiting his quote (the quote form rides the real card in part B).
    expect(screen.getByText(/ت4 · صالون لمسة · إلى إربد، شارع الجامعة/)).toBeTruthy();
    expect(screen.getByText(/بانتظار عرضك/)).toBeTruthy();
    // ت1: his quote awaits the owner.
    expect(screen.getByText(/ت1 · ورشة الياسمين · إلى مرج الحمام/)).toBeTruthy();
    expect(screen.getByText(/عرضك 3 د بانتظار قرار المالك/)).toBeTruthy();
  });

  test('مهامي: ت3 in progress with the photo evidence + السجل (ت2)', async () => {
    await enterDriver();
    await press(screen.getByText('مهامي'));
    expect(screen.getByText(/ت3 · ورشة الياسمين · إلى الزرقاء، حي معصوم/)).toBeTruthy();
    expect(screen.getByText(/الإثبات المطلوب: صورة/)).toBeTruthy();
    expect(screen.getByText('يُركَّب لاحقًا: Disclosure')).toBeTruthy();
    expect(screen.getByText(/«السجل»: ت2 تمّ/)).toBeTruthy();
  });

  test('the driver ContextBar: the locked switcher (سائق، بلا سهم) and his unread bell', async () => {
    await enterDriver();
    // The switcher shows the workshop with the سائق caption.
    expect(screen.getByText('ورشة الياسمين للخياطة')).toBeTruthy();
    expect(screen.getByText('سائق')).toBeTruthy();
    // The project sheet stays closed for the driver (one project, one role).
    await press(screen.getByText('ورشة الياسمين للخياطة'));
    expect(screen.queryByText('حلويات بيت الريف')).toBeNull();
    expect(screen.queryByText('تبديل المشروع')).toBeNull();
  });

  test('the segments switch the two screens through the store', async () => {
    await enterDriver();
    await press(screen.getByText('مهامي'));
    // Back to الطلبات through the segment.
    await press(screen.getByText('الطلبات'));
    expect(screen.getByText(/ت4 · صالون لمسة · إلى إربد، شارع الجامعة/)).toBeTruthy();
  });
});
