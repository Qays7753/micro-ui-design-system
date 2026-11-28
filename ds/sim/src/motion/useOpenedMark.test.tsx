/**
 * اختبارات ح04 — الصف المفتوح يبقى معلَّمًا (useOpenedMark):
 *  - الدخول فوري مع الورقة المفتوحة ('true').
 *  - أثناء حركة الإغلاق (exit.lg 250) تبقى 'true'.
 *  - بعد onClosed تصير 'fade' (التلاشي 600 في CSS).
 *  - صف آخر لم يُفتح لا يحمل شيئًا.
 */
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useOpenedMark } from './useOpenedMark';

function RowHarness({ openId, rowId }: { openId: string | null; rowId: string }) {
  const mark = useOpenedMark(openId);
  const props = mark(rowId);
  return <span {...props} data-testid="row">{props['data-sim-opened'] ?? 'none'}</span>;
}

describe('ح04 — الصف المفتوح يبقى معلَّمًا', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('الورقة مفتوحة: العلامة true فورًا', () => {
    render(<RowHarness openId="object:m1" rowId="object:m1" />);
    expect(screen.getByTestId('row').getAttribute('data-sim-opened')).toBe('true');
  });

  it('صف آخر لم يُفتح: بلا علامة', () => {
    render(<RowHarness openId="object:m1" rowId="object:m2" />);
    expect(screen.getByTestId('row').getAttribute('data-sim-opened')).toBeNull();
  });

  it('أثناء حركة الإغلاق (exit.lg 250) تبقى العلامة، ثم fade عند onClosed', () => {
    const { rerender } = render(<RowHarness openId="object:m1" rowId="object:m1" />);
    act(() => {
      rerender(<RowHarness openId={null} rowId="object:m1" />);
    });
    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(screen.getByTestId('row').getAttribute('data-sim-opened')).toBe('true');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId('row').getAttribute('data-sim-opened')).toBe('fade');
  });

  it('فتح صف آخر يصفّر التلاشي العالق', () => {
    const { rerender } = render(<RowHarness openId="object:m1" rowId="object:m1" />);
    act(() => {
      rerender(<RowHarness openId={null} rowId="object:m1" />);
    });
    act(() => {
      vi.advanceTimersByTime(260);
    });
    act(() => {
      rerender(<RowHarness openId="object:f1" rowId="object:m1" />);
    });
    expect(screen.getByTestId('row').getAttribute('data-sim-opened')).toBeNull();
    act(() => {
      rerender(<RowHarness openId={null} rowId="object:m1" />);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId('row').getAttribute('data-sim-opened')).toBeNull();
  });
});
