/**
 * اختبارات MotionProvider — عقد §2.1 وقياس المستوى §4 (ق1–ق3).
 */
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Sheet } from '@micro/ds';
import { MotionProvider } from './MotionProvider';
import { decideTier } from './tierMeasure';

function attr(name: string): string | null {
  return document.documentElement.getAttribute(name);
}

describe('decideTier (§4.1-3)', () => {
  it('ثلاث فجوات أكبر من 34 → light', () => {
    const stats = decideTier([16, 40, 16, 41, 16, 42]);
    expect(stats.slow).toBe(3);
    expect(stats.tier).toBe('light');
  });

  it('أقل من 15 إطارًا في نافذة الحركة → light', () => {
    const stats = decideTier([36, 36, 36, 36, 36, 36]);
    expect(stats.frames).toBe(6);
    expect(stats.tier).toBe('light');
  });

  it('إطارات منتظمة كثيرة → full بلا استدعاء', () => {
    const deltas = Array.from({ length: 21 }, () => 16.7);
    expect(decideTier(deltas).tier).toBe('full');
  });

  it('أقصى فجوة تسجَّل', () => {
    expect(decideTier([16, 50, 16]).longestMs).toBe(50);
  });
});

describe('MotionProvider — صفات البيانات والمتغيرات (§2.1)', () => {
  it('يضع الصفات الأربع من خصائصه', () => {
    render(
      <MotionProvider tier="light" paused profile="driver" scale={0.5}>
        <p>داخل</p>
      </MotionProvider>,
    );
    expect(screen.getByText('داخل')).toBeTruthy();
    expect(attr('data-ds-motion-tier')).toBe('light');
    expect(attr('data-ds-motion-paused')).toBe('true');
    expect(attr('data-ds-motion-profile')).toBe('driver');
    expect(attr('data-ds-motion-scale')).toBe('0.5');
    const rootEl = document.documentElement;
    expect(rootEl.style.getPropertyValue('--ds-motion-scale')).toBe('0.5');
    expect(rootEl.style.getPropertyValue('--ds-motion-duration-lg')).toBe('360ms');
  });

  it('الافتراضي: auto يبدأ full وscale يُحصر في 0.1–1', () => {
    render(
      <MotionProvider scale={0.01}>
        <span />
      </MotionProvider>,
    );
    expect(attr('data-ds-motion-tier')).toBe('full');
    expect(attr('data-ds-motion-scale')).toBe('0.1');
    expect(attr('data-ds-motion-reduced')).toBe('false');
    expect(attr('data-ds-motion-profile')).toBe('standard');
  });

  it('يقرأ prefers-reduced-motion بنفسه', () => {
    const listeners = new Set<() => void>();
    vi.stubGlobal(
      'matchMedia',
      vi.fn((q: string) => ({
        matches: q === '(prefers-reduced-motion: reduce)',
        media: q,
        onchange: null,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      })),
    );
    try {
      render(
        <MotionProvider>
          <span />
        </MotionProvider>,
      );
      expect(attr('data-ds-motion-reduced')).toBe('true');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('قياس المستوى على أول ورقة (§4)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  /** rAF مصطنعة تحت المؤقتات الزائفة: كل نداء يجدول الإطار التالي بالفجوة
   * المخصصة (أول `gaps` ثم 16) — فتُستهلك الفجوات بالترتيب مع تقدّم الوقت. */
  function stubRaf(gaps: number[]) {
    let t = 0;
    let i = 0;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((fn: (ts: number) => void) => {
        const gap = i < gaps.length ? gaps[i] : 16;
        i += 1;
        t += gap;
        return window.setTimeout(() => fn(t), gap);
      }),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => window.clearTimeout(id)));
  }

  it('ق1: ثلاث فجوات > 34 في أول ورقة → الجذر light وonTierChange مرة واحدة', () => {
    stubRaf([16, 40, 16, 41, 16, 42]);
    const onTierChange = vi.fn();
    render(
      <MotionProvider onTierChange={onTierChange}>
        <Sheet label="ورقة القياس" onDismiss={() => {}}>
          <span>محتوى</span>
        </Sheet>
      </MotionProvider>,
    );
    expect(attr('data-ds-motion-tier')).toBe('full');
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(attr('data-ds-motion-tier')).toBe('light');
    expect(onTierChange).toHaveBeenCalledTimes(1);
    expect(onTierChange).toHaveBeenCalledWith('light');
  });

  it('ق2: tier="light" — لا قياس ولا استدعاء', () => {
    stubRaf([40, 41, 42, 43, 44, 45]);
    const onTierChange = vi.fn();
    render(
      <MotionProvider tier="light" onTierChange={onTierChange}>
        <Sheet label="ورقة" onDismiss={() => {}}>
          <span />
        </Sheet>
      </MotionProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(attr('data-ds-motion-tier')).toBe('light');
    expect(onTierChange).not.toHaveBeenCalled();
  });

  it('ق3: مع تقليل الحركة لا قياس', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((q: string) => ({
        matches: q === '(prefers-reduced-motion: reduce)',
        media: q,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      })),
    );
    stubRaf([40, 41, 42, 43, 44, 45]);
    const onTierChange = vi.fn();
    render(
      <MotionProvider onTierChange={onTierChange}>
        <Sheet label="ورقة" onDismiss={() => {}}>
          <span />
        </Sheet>
      </MotionProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(attr('data-ds-motion-tier')).toBe('full');
    expect(onTierChange).not.toHaveBeenCalled();
  });

  it('إطارات منتظمة → يبقى full بلا استدعاء', () => {
    stubRaf(Array.from({ length: 30 }, () => 16.7));
    const onTierChange = vi.fn();
    render(
      <MotionProvider onTierChange={onTierChange}>
        <Sheet label="ورقة" onDismiss={() => {}}>
          <span />
        </Sheet>
      </MotionProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(attr('data-ds-motion-tier')).toBe('full');
    expect(onTierChange).not.toHaveBeenCalled();
  });

  it('ورقة ثانية في الجلسة: لا قياس ثانٍ (§4.1-6)', () => {
    stubRaf([16, 40, 16, 41, 16, 42]);
    const onTierChange = vi.fn();
    const { rerender } = render(
      <MotionProvider onTierChange={onTierChange}>
        <Sheet label="الأولى" onDismiss={() => {}}>
          <span />
        </Sheet>
      </MotionProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(onTierChange).toHaveBeenCalledTimes(1);
    rerender(
      <MotionProvider onTierChange={onTierChange}>
        <Sheet label="الثانية" onDismiss={() => {}}>
          <span />
        </Sheet>
      </MotionProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(onTierChange).toHaveBeenCalledTimes(1);
  });
});
