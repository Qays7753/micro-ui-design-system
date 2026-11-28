/**
 * اختبارات أدوات القطع والاستئناف — أرقام قبول الملحق نفسها:
 *  - ح07 ق1: إفلات بسرعة 1.2px/ms على بُعد 200px → 4.55×200÷1.2 ≈ 758
 *    فتُحصر في 420 ±16 (أي 420 بالضبط).
 *  - ح07 ق2: سحب 25% بسرعة 0.2 (تحت الأرضية) → رجوع إلى 0 (المدة بقاعدة
 *    النسبة: الأساسية × المتبقي، بحد 160).
 *  - 3.5-2: الاستئناف من موضع الحركة المقطوعة بنسبة المتبقي، بحد 120.
 */
import { describe, expect, it } from 'vitest';
import { currentTranslateX, currentTranslateY, releaseDuration, resumeDuration } from './motionMath';

describe('قاعدة الإفلات §3.5-3', () => {
  it('ح07 ق1: 200px متبقية بسرعة 1.2 → 758 تُحصر في 420', () => {
    expect(releaseDuration({ distanceLeft: 200, distanceFull: 400, velocityPxMs: 1.2, baseMs: 360 })).toBe(420);
  });

  it('سرعة أقل من 0.3: الأساسية × النسبة المتبقية، بلا أقل من 160', () => {
    // متبقٍ 25% من 360 → 90 → يُرفع إلى 160.
    expect(releaseDuration({ distanceLeft: 100, distanceFull: 400, velocityPxMs: 0.2, baseMs: 360 })).toBe(160);
    // متبقٍ 80% من 360 → 288.
    expect(releaseDuration({ distanceLeft: 320, distanceFull: 400, velocityPxMs: 0.1, baseMs: 360 })).toBe(288);
  });

  it('سرعة عالية ومسافة قصيرة: الحد الأدنى 160', () => {
    expect(releaseDuration({ distanceLeft: 20, distanceFull: 400, velocityPxMs: 2, baseMs: 360 })).toBe(160);
  });

  it('الإشارة لا تعني شيئًا — |السرعة| فقط', () => {
    expect(
      releaseDuration({ distanceLeft: 200, distanceFull: 400, velocityPxMs: -1.2, baseMs: 360 }),
    ).toBe(420);
  });

  it('الحد الأدنى والقصى من الرموز (160 و420)', () => {
    expect(releaseDuration({ distanceLeft: 1, distanceFull: 1, velocityPxMs: 10, baseMs: 360 })).toBe(160);
    expect(releaseDuration({ distanceLeft: 5000, distanceFull: 5000, velocityPxMs: 0.31, baseMs: 360 })).toBe(420);
  });
});

describe('الاستئناف §3.5-2', () => {
  it('المدة = الأساسية × المتبقي÷الكامل', () => {
    expect(resumeDuration({ distanceLeft: 200, distanceFull: 400, baseMs: 360 })).toBe(180);
  });

  it('لا تقل عن 120 أبدًا', () => {
    expect(resumeDuration({ distanceLeft: 10, distanceFull: 400, baseMs: 360 })).toBe(120);
    expect(resumeDuration({ distanceLeft: 0, distanceFull: 400, baseMs: 360 })).toBe(120);
  });
});

describe('قراءة الموضع الحالي (getComputedStyle)', () => {
  it('none أو غياب transform → صفر', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(currentTranslateY(el)).toBe(0);
    expect(currentTranslateX(el)).toBe(0);
    el.remove();
  });

  it('matrix معروفة تعيد الإزاحتين', () => {
    const el = document.createElement('div');
    el.style.transform = 'matrix(1, 0, 0, 1, 15, -40)';
    document.body.appendChild(el);
    expect(currentTranslateX(el)).toBe(15);
    expect(currentTranslateY(el)).toBe(-40);
    el.remove();
  });
});
