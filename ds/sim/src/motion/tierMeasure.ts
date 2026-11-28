/**
 * motion/tierMeasure.ts — قياس المستوى الخفيف التلقائي (الملحق §4).
 * القياس يجري مرة واحدة في الجلسة، أثناء حركة فتح أول ورقة، ويسجّل أزمنة
 * requestAnimationFrame من بداية الحركة إلى نهايتها، ثم يقرر (§4.1-3):
 *  - الإطار البطيء: فجوة بين إطاريْن تزيد عن `tier.slow-frame` (34)،
 *    وقراره `light` إن تكرر 3 مرات أو أكثر (`tier.slow-max`).
 *  - عدد الإطارات: إن قلّ عن `tier.min-frames` (15) خلال حركة 360.
 * ولا قياس ثانٍ ولا عودة من light إلى full داخل الجلسة (§4.1-6).
 */

import { MOTION } from './tokens';

export interface TierStats {
  tier: 'full' | 'light';
  frames: number;
  slow: number;
  longestMs: number;
}

/** قرار المستوى من فجوات الإطارات المقاسة (ms لكل فجوة). */
export function decideTier(deltas: number[]): TierStats {
  const frames = deltas.length;
  const slow = deltas.filter((d) => d > MOTION.tier['slow-frame']).length;
  const longestMs = frames > 0 ? Math.max(...deltas) : 0;
  const light =
    slow >= MOTION.tier['slow-max'] ||
    (frames > 0 && frames < MOTION.tier['min-frames']);
  return { tier: light ? 'light' : 'full', frames, slow, longestMs };
}

/**
 * نافذة القياس: مدة حركة فتح الورقة المرجعية (lg 360) × السكيل، بهامش
 * يضمن رؤية نهاية الحركة قبل الإيقاف.
 */
export function measureWindowMs(scale: number): number {
  return Math.round(MOTION.duration.lg * scale) + 80;
}
