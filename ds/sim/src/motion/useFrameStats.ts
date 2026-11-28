/**
 * motion/useFrameStats.ts — عدّاد إطارات مختبر الحركة (§10.3): العدد
 * الكلي، والإطارات الأبطأ من tier.slow-frame (34)، وأطول إطار، والمجموع.
 * يعمل بـrequestAnimationFrame وحده (أداء §3.7-5)، ويتوقف بنفسه بعد
 * مهلة الحركة أو بنداء stop.
 */

import { useCallback, useRef, useState } from 'react';
import { MOTION } from './tokens';

export interface FrameStats {
  frames: number;
  slow: number;
  longestMs: number;
  totalMs: number;
  running: boolean;
}

const EMPTY: FrameStats = { frames: 0, slow: 0, longestMs: 0, totalMs: 0, running: false };

export function useFrameStats() {
  const [stats, setStats] = useState<FrameStats>(EMPTY);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const accRef = useRef({ frames: 0, slow: 0, longestMs: 0, totalMs: 0 });

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame?.(rafRef.current);
      rafRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStats((s) => ({ ...s, running: false }));
  }, []);

  const start = useCallback(
    (windowMs: number) => {
      stop();
      accRef.current = { frames: 0, slow: 0, longestMs: 0, totalMs: 0 };
      setStats({ ...EMPTY, running: true });
      if (typeof window.requestAnimationFrame !== 'function') return;
      lastRef.current = performance.now();
      const step = (t: number) => {
        const delta = t - lastRef.current;
        lastRef.current = t;
        const acc = accRef.current;
        acc.frames += 1;
        acc.totalMs += delta;
        if (delta > MOTION.tier['slow-frame']) acc.slow += 1;
        if (delta > acc.longestMs) acc.longestMs = delta;
        setStats({ ...acc, running: true });
        rafRef.current = window.requestAnimationFrame(step);
      };
      rafRef.current = window.requestAnimationFrame(step);
      timeoutRef.current = window.setTimeout(stop, windowMs);
    },
    [stop],
  );

  return { stats, start, stop };
}
