/**
 * motion/motionMath.ts — أدوات القطع والاستئناف وقاعدة الإفلات (الملحق
 * §3.5)، الدليل الرقمي الوحيد للحركات التي تتبع الإصبع:
 *
 * 1. قاعدة الإفلات (3.5-3): المدة = `release-slope` 4.55 × المسافة
 *    المتبقية ÷ |السرعة|، محصورة بين `release-min` 160 و`release-max`
 *    420 — 4.55 ميل بداية ease.micro فتستمر الحركة بسرعة الإصبع نفسها.
 *    وإن كانت السرعة أقل من `velocity-floor` 0.3px/ms: المدة الأساسية ×
 *    النسبة المتبقية، ولا تقل عن `release-min` 160.
 * 2. الاستئناف بعد القطع (3.5-2): مدة = الأساسية × (المتبقي ÷ الكامل)،
 *    ولا تقل عن 120.
 * 3. قراءة الموضع الحالي عبر getComputedStyle().transform (للاستئناف
 *    من موضع الحركة المقطوعة فعلًا).
 */

import { MOTION } from './tokens';

export interface ReleaseInput {
  /** المسافة المتبقية إلى الهدف (px، موجبة). */
  distanceLeft: number;
  /** المسافة الكاملة للحركة (px، موجبة). */
  distanceFull: number;
  /** سرعة الإفلات (px/ms، إشارتها اتجاه الحركة فقط). */
  velocityPxMs: number;
  /** المدة الأساسية للحركة كاملة (ms). */
  baseMs: number;
}

/** قاعدة الإفلات §3.5-3 بالأرقام الحرفية من الرموز. */
export function releaseDuration({ distanceLeft, distanceFull, velocityPxMs, baseMs }: ReleaseInput): number {
  const speed = Math.abs(velocityPxMs);
  const { 'release-min': min, 'release-max': max, 'velocity-floor': floor, 'release-slope': slope } = MOTION.gesture;
  if (speed >= floor && distanceLeft > 0) {
    const byVelocity = Math.round((slope * distanceLeft) / speed);
    return Math.min(max, Math.max(min, byVelocity));
  }
  if (distanceFull <= 0) return Math.max(min, Math.round(baseMs));
  const byRatio = Math.round((baseMs * Math.min(1, Math.max(0, distanceLeft / distanceFull))));
  return Math.max(min, byRatio);
}

/** الاستئناف بعد القطع §3.5-2: الأساسية × المتبقي÷الكامل، بحد أدنى 120. */
export function resumeDuration({ distanceLeft, distanceFull, baseMs }: Omit<ReleaseInput, 'velocityPxMs'>): number {
  if (distanceFull <= 0) return 120;
  const scaled = Math.round((baseMs * Math.min(1, Math.max(0, distanceLeft / distanceFull))));
  return Math.max(120, scaled);
}

/**
 * قراءة الموضع الحالي لعنصر يتحرك بtranslateY: تعيد الإزاحة بالبكسل من
 * `getComputedStyle().transform` (matrix) — موضع استئناف الحركة المقطوعة.
 */
export function currentTranslateY(el: Element): number {
  const t = getComputedStyle(el).transform;
  if (!t || t === 'none') return 0;
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const parts = m[1].split(',').map((v) => parseFloat(v.trim()));
  if (parts.length < 6 || parts.every((v) => v === 0)) return 0;
  return parts[5];
}

/** قراءة translateX بنفس الطريقة (الشاشات والسحب الأفقي). */
export function currentTranslateX(el: Element): number {
  const t = getComputedStyle(el).transform;
  if (!t || t === 'none') return 0;
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const parts = m[1].split(',').map((v) => parseFloat(v.trim()));
  if (parts.length < 6 || parts.every((v) => v === 0)) return 0;
  return parts[4];
}
