/**
 * motion/motionPrefs.ts — تفضيلات الحركة في المحاكاة (زر المقارنة، PLAN-MOTION):
 *  - `mode`: «الملحق» (الافتراضي)، و«بدون»، و«خفيف» — مفتاح «الحركة».
 *  - `reducedSim`: «تقليل الحركة» محاكاةً لإعداد الهاتف (عبر reducedSim.ts).
 *  - `labScale`: سرعة مختبر الحركة (1 / 0.5 / 0.25 / 0.1) على §10.1.
 *  - `forcedPaused`: فرض paused في المختبر (§10.1).
 *  - `labOpen`: هل مختبر الحركة مفتوح.
 *
 * حالة جلسة فقط (لا تخزين على الجهاز) — عدّا ذكرى `light` بين الجلسات
 * التي تُحفظ في sessionStorage بإصدار التطبيق (ت1، §4.2) أدناه.
 */

import { useSyncExternalStore } from 'react';
import { SIM_VERSION } from '../version';

export type MotionMode = 'addendum' | 'off' | 'light';

export interface MotionPrefs {
  mode: MotionMode;
  reducedSim: boolean;
  labScale: number;
  forcedPaused: boolean;
  labOpen: boolean;
}

let prefs: MotionPrefs = { mode: 'addendum', reducedSim: false, labScale: 1, forcedPaused: false, labOpen: false };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function getMotionPrefs(): MotionPrefs {
  return prefs;
}

export function setMotionPrefs(patch: Partial<MotionPrefs>): void {
  prefs = { ...prefs, ...patch };
  emit();
}

export function useMotionPrefs(): MotionPrefs {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getMotionPrefs,
    getMotionPrefs,
  );
}

/* ذكرى المستوى الخفيف بين الجلسات (ت1): تُحفظ عند onTierChange للإصدار
 * نفسه، وتُمسح حين يتغير إصدار التطبيق فيمرّ auto مرة (§4.2). */

const TIER_KEY = 'ds-motion-tier-light';

function tierMemory(): { version: string; light: boolean } | null {
  try {
    const raw = window.sessionStorage.getItem(TIER_KEY);
    return raw ? (JSON.parse(raw) as { version: string; light: boolean }) : null;
  } catch {
    return null;
  }
}

/** هل الجلسة تبدأ بـ`light` محفوظ من جلسة سابقة للإصدار نفسه؟ */
export function readSavedLight(): boolean {
  const m = tierMemory();
  return m?.light === true && m.version === SIM_VERSION;
}

/** onTierChange — يحفظ light للإصدار الحالي (ت1). */
export function saveTierLight(): void {
  try {
    window.sessionStorage.setItem(TIER_KEY, JSON.stringify({ version: SIM_VERSION, light: true }));
  } catch {
    /* الجلسة بلا تخزين — الذكرى تسقط وهذا مسموح */
  }
}
