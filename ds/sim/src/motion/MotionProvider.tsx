/**
 * motion/MotionProvider.tsx — المزوّد (الملحق §2.1، الاثنان).
 *
 * يلف التطبيق كله مرة واحدة، فوق أي مكوّن من المكتبة، ويحمل:
 *  - `tier`: auto | full | light — مع auto يقيس أول ورقة تُفتح في الجلسة (§4).
 *  - `paused`: التطبيق يمرره حين document.visibilityState === "hidden" (ت2).
 *  - `profile`: standard | driver — السائق مدده ×0.75 في CSS (ت3).
 *  - `scale`: مختبر الحركة فقط (0.1–1)، في الإنتاج دائمًا 1.
 *  - `onTierChange`: تُستدعى مرة واحدة في الجلسة حين يقرر القياس light (ت1).
 *
 * يقرأ prefers-reduced-motion بنفسه ويتابع تغيّره، ويضع على جذره صفات
 * البيانات الأربع ومتغيرات `--ds-motion-*` من ملف الرموز (tokens.ts) —
 * وCSS الحركة كله يُبنى على هذه الصفات في motion.css.
 *
 * عند النقل إلى ds/src/motion/MotionProvider.tsx ينتقل كما هو.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motionCssVars } from './tokens';
import { decideTier, measureWindowMs } from './tierMeasure';

export type MotionTier = 'auto' | 'full' | 'light';
export type MotionProfile = 'standard' | 'driver';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

export function MotionProvider({
  tier = 'auto',
  paused = false,
  profile = 'standard',
  scale = 1,
  onTierChange,
  children,
}: {
  tier?: MotionTier;
  paused?: boolean;
  profile?: MotionProfile;
  scale?: number;
  onTierChange?: (tier: 'light') => void;
  children: ReactNode;
}) {
  const [reduced, setReduced] = useState(false);
  const [autoTier, setAutoTier] = useState<'full' | 'light'>('full');
  const rootRef = useRef<HTMLDivElement>(null);
  const decidedRef = useRef(false);
  const measuringRef = useRef(false);
  const onTierChangeRef = useRef(onTierChange);
  useEffect(() => {
    onTierChangeRef.current = onTierChange;
  }, [onTierChange]);

  // المكتبة تقرأ تقليل الحركة بنفسها وتتابع تغيّره أثناء الجلسة (§2.1).
  useEffect(() => {
    const mq = window.matchMedia(REDUCE_QUERY);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const clampedScale = Math.min(1, Math.max(0.1, scale));
  const effectiveTier: 'full' | 'light' = tier === 'auto' ? autoTier : tier;

  // قياس المستوى: فقط tier="auto"، وبلا تقليل حركة، ولم يُتخذ قرار بعد (§4.1-1).
  // أين: أثناء حركة فتح أول ورقة في الجلسة — يُرصد تركيب .mds-sheet-panel.
  useEffect(() => {
    if (tier !== 'auto') return;

    const startMeasure = () => {
      if (decidedRef.current || measuringRef.current) return;
      if (window.matchMedia(REDUCE_QUERY).matches) return;
      measuringRef.current = true;
      const deltas: number[] = [];
      let last = performance.now();
      let raf = 0;
      const step = (t: number) => {
        deltas.push(t - last);
        last = t;
        raf = window.requestAnimationFrame(step);
      };
      raf = window.requestAnimationFrame(step);
      const finish = () => {
        window.cancelAnimationFrame(raf);
        measuringRef.current = false;
        if (decidedRef.current) return;
        decidedRef.current = true;
        const stats = decideTier(deltas);
        if (stats.tier === 'light') {
          setAutoTier('light');
          onTierChangeRef.current?.('light');
        }
      };
      const timeout = window.setTimeout(finish, measureWindowMs(clampedScale));
      cleanupTimersRef.current = () => {
        window.clearTimeout(timeout);
        window.cancelAnimationFrame(raf);
      };
    };

    const cleanupTimersRef: { current: (() => void) | null } = { current: null };
    const observer = new MutationObserver((muts) => {
      if (decidedRef.current || measuringRef.current) return;
      for (const m of muts) {
        for (const n of Array.from(m.addedNodes)) {
          if (n instanceof HTMLElement) {
            const panel = n.classList.contains('mds-sheet-panel')
              ? n
              : n.querySelector('.mds-sheet-panel');
            if (panel) {
              startMeasure();
              return;
            }
          }
        }
      }
    });
    // أوراق المكتبة تُركَّب عبر portal إلى document.body — الرصد على
    // المستند كله هو الذي يرى أول ورقة في الجلسة.
    observer.observe(document.body, { childList: true, subtree: true });
    // وإن كانت ورقة مفتوحة قبل تركيب المزوّد (effects الأبناء تسبق أباهم)
    // فالقياس يبدأ عليها فورًا — هي أول ورقة في الجلسة.
    if (document.querySelector('.mds-sheet-panel')) startMeasure();
    return () => {
      observer.disconnect();
      cleanupTimersRef.current?.();
      measuringRef.current = false;
    };
  }, [tier, clampedScale]);

  const style = motionCssVars(clampedScale) as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="ds-motion-root"
      data-ds-motion-tier={effectiveTier}
      data-ds-motion-reduced={reduced ? 'true' : 'false'}
      data-ds-motion-paused={paused ? 'true' : 'false'}
      data-ds-motion-profile={profile}
      data-ds-motion-scale={clampedScale}
      style={style}
    >
      {children}
    </div>
  );
}
