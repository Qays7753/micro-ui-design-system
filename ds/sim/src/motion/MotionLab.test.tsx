/** نمط الضغط المعتمد (App.test): كل fireEvent يُصفّى بنفسه بين النزول والرفع. */
async function press(el: Element) {
  const target = el as HTMLElement;
  fireEvent.pointerDown(target, { pointerId: 1 });
  await act(async () => {});
  fireEvent.pointerUp(target, { pointerId: 1 });
  await act(async () => {});
}

/**
 * اختبارات مختبر الحركة وتفضيلاته — PLAN-MOTION M1:
 *  - التفضيلات: وضع المقارنة (الملحق/بدون/خفيف)، والإبطاء، والذكرى §4.2.
 *  - المختبر: البنية §10 (السرعة، مفاتيح الفرض، صف المرجع بعدّاد الإطارات)،
 *    وصف الورقة التجريبية يفتح ورقة حقيقية.
 */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MotionLab } from './lab/MotionLab';
import {
  getMotionPrefs,
  readSavedLight,
  saveTierLight,
  setMotionPrefs,
  useMotionPrefs,
} from './motionPrefs';

function PrefsProbe() {
  const prefs = useMotionPrefs();
  return (
    <span data-testid="mode">{prefs.mode}</span>
  );
}

function LabOpenProbe() {
  const prefs = useMotionPrefs();
  return <span data-testid="lab-open">{String(prefs.labOpen)}</span>;
}

describe('تفضيلات الحركة', () => {
  beforeEach(() => {
    setMotionPrefs({ mode: 'addendum', reducedSim: false, labScale: 1, forcedPaused: false, labOpen: false });
    window.sessionStorage.clear();
  });
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('الافتراضي: الملحق، بلا إبطاء، والمختبر مغلق', () => {
    expect(getMotionPrefs()).toEqual({
      mode: 'addendum',
      reducedSim: false,
      labScale: 1,
      forcedPaused: false,
      labOpen: false,
    });
  });

  it('التبديل يشعر المشتركين فورًا', () => {
    const { getByTestId } = render(<PrefsProbe />);
    expect(getByTestId('mode').textContent).toBe('addendum');
    act(() => setMotionPrefs({ mode: 'off' }));
    expect(getByTestId('mode').textContent).toBe('off');
    act(() => setMotionPrefs({ mode: 'addendum' }));
  });

  it('ذكرى light بين الجلسات (§4.2): تُقرأ للإصدار نفسه، وتسقط لإصدار آخر', () => {
    expect(readSavedLight()).toBe(false);
    saveTierLight();
    expect(readSavedLight()).toBe(true);
    // إصدار آخر يمسح الذكرى: نكتب يدويًا بإصدار مغاير.
    window.sessionStorage.setItem('ds-motion-tier-light', JSON.stringify({ version: '0.0.1 · 1/1/2025', light: true }));
    expect(readSavedLight()).toBe(false);
  });
});

describe('مختبر الحركة (§10)', () => {
  beforeEach(() => {
    setMotionPrefs({ mode: 'addendum', reducedSim: false, labScale: 1, forcedPaused: false, labOpen: false });
  });

  it('البنية: السرعة الأربع، ومفاتيح الفرض، وصف المرجع مع عدّاد الإطارات', () => {
    render(<MotionLab />);
    expect(document.querySelector('[data-sim-motion-lab="open"]')).toBeTruthy();
    expect(screen.getByText('مختبر الحركة')).toBeTruthy();
    expect(document.querySelector('[data-sim-lab-speed="1"]')).toBeTruthy();
    expect(screen.getByText('تقليل الحركة')).toBeTruthy();
    expect(screen.getByText('خفيف (tier=light)')).toBeTruthy();
    expect(screen.getByText('إيقاف مؤقت (paused)')).toBeTruthy();
    expect(document.querySelector('[data-lab-motion="ref-sheet-open"]')).toBeTruthy();
    expect(screen.getByText('شغّل')).toBeTruthy();
  });

  it('صف المرجع يفتح ورقة حقيقية، وزر إغلاق المختبر يعيد labOpen إلى false', async () => {
    setMotionPrefs({ labOpen: true });
    render(
      <>
        <MotionLab />
        <LabOpenProbe />
      </>,
    );
    fireEvent.click(screen.getByText('شغّل')); // زر خام للضغط (onClick)
    await waitFor(() => expect(document.querySelector('.mds-sheet-panel')).toBeTruthy());
    // الإغلاق بزر X الذي يحمل اسم الورقة نفسه (واجهة المكتبة)
    await press(screen.getByRole('button', { name: 'ورقة التجربة' }));
    await waitFor(() => expect(document.querySelector('.mds-sheet-panel')).toBeFalsy());
    // زر إغلاق المختبر يقلب العلم — الـApp هو من يفرغ الصفحة على الحقيقة.
    await press(screen.getByRole('button', { name: 'إغلاق مختبر الحركة' }));
    await waitFor(() => expect(screen.getByTestId('lab-open').textContent).toBe('false'));
    setMotionPrefs({ labOpen: false });
  });

  it('السرعة تُحدَّث من المقاطع', async () => {
    render(<MotionLab />);
    await press(screen.getByRole('button', { name: '0.5' }));
    await waitFor(() => expect(document.querySelector('[data-sim-lab-speed="0.5"]')).toBeTruthy());
    setMotionPrefs({ labScale: 1 });
  });
});
