/**
 * motion/lab/MotionLab.tsx — مختبر الحركة (الملحق §10): صفحة داخل
 * المحاكاة داخل MotionProvider، تشغّل كل حركة بزر، وبجانبها المعرّف
 * والمدة المتوقعة والمدة المقاسة وعدّاد الإطارات (الكلي، والأبطأ من
 * 34، وأطول إطار). التحكم: السرعة (scale 1/0.5/0.25/0.1)، ومفاتيح
 * تفرض كل حالة: تقليل الحركة، وtier=light («خفيف»)، وprofile=driver
 * (وضع السائق نفسه)، وpaused. اتجاه الصفحة rtl ثابت.
 *
 * صفوف الحركات تنمو مع الوحدات: M1 يركّب الهيكل وصف المرجع (فتح ورقة
 * بحركة المكتبة الحالية — قبل تجاوز M4).
 */

import { useState } from 'react';
import { ClearIcon, IconButton, SegmentedControl, Sheet, Surface, Toggle } from '@micro/ds';
import { setMotionPrefs, useMotionPrefs } from '../motionPrefs';
import { setSimulatedReduced } from '../reducedSim';
import { MOTION } from '../tokens';
import { useFrameStats } from '../useFrameStats';

const SCALES = [1, 0.5, 0.25, 0.1] as const;

function ms(n: number): string {
  return n === 0 ? '—' : `${Math.round(n)}ms`;
}

export function MotionLab() {
  const prefs = useMotionPrefs();
  const { stats, start } = useFrameStats();
  const [demoOpen, setDemoOpen] = useState(false);

  const runDemoSheet = () => {
    // نافذة القياس: مدة الحركة المرجعية للورقة + هامش.
    start(MOTION.duration.lg * prefs.labScale + 240);
    setDemoOpen(true);
  };

  return (
    <div className="sim-motion-lab" data-sim-motion-lab="open" dir="rtl">
      <header className="sim-motion-lab__head">
        <h1 className="sim-motion-lab__title">مختبر الحركة</h1>
        <IconButton label="إغلاق مختبر الحركة" onPress={() => setMotionPrefs({ labOpen: false })}>
          <ClearIcon size={20} />
        </IconButton>
      </header>

      <div className="sim-motion-lab__body">
        <Surface>
          <div className="sim-motion-lab__speed" data-sim-lab-speed={String(prefs.labScale)}>
            <span className="sim-motion-lab__label">السرعة</span>
            <SegmentedControl
              label="سرعة الحركة"
              leading={SCALES.map((s) => ({ value: String(s), label: String(s) }))}
              value={String(prefs.labScale)}
              onChange={(v) => setMotionPrefs({ labScale: Number(v) })}
            />
          </div>
          <Toggle
            label="تقليل الحركة"
            selected={prefs.reducedSim}
            onChange={(v) => {
              setSimulatedReduced(v);
              setMotionPrefs({ reducedSim: v });
            }}
          />
          <Toggle
            label="خفيف (tier=light)"
            selected={prefs.mode === 'light'}
            onChange={(v) => setMotionPrefs({ mode: v ? 'light' : 'addendum' })}
          />
          <Toggle
            label="إيقاف مؤقت (paused)"
            selected={prefs.forcedPaused}
            onChange={(v) => setMotionPrefs({ forcedPaused: v })}
          />
        </Surface>

        <Surface>
          <div className="sim-motion-lab__row" data-lab-motion="ref-sheet-open">
            <div className="sim-motion-lab__row-info">
              <b>المرجع — فتح ورقة</b>
              <span className="sim-motion-lab__meta">حركة المكتبة الحالية، قبل تجاوز M4</span>
              <span className="sim-motion-lab__meta">المتوقع {ms(MOTION.duration.md)}</span>
            </div>
            <div className="sim-motion-lab__row-end">
              <span className="sim-motion-lab__stats" data-sim-frame-stats={stats.frames}>
                {stats.frames} إطارًا · بطيء {stats.slow} · أطول {ms(stats.longestMs)} · {ms(stats.totalMs)}
              </span>
              <button type="button" className="sim-motion-lab__run" onClick={runDemoSheet}>
                شغّل
              </button>
            </div>
          </div>
        </Surface>

        <p className="sim-motion-lab__note">
          صفوف ح01–ح40 تُضاف مع وحداتها (M3 وما بعدها)، وفحص الرمز مع M10.
        </p>
      </div>

      {demoOpen ? (
        <Sheet label="ورقة التجربة" onDismiss={() => setDemoOpen(false)}>
          <p>افتحت بحركة المكتبة — العدّاد فوق يسجّل إطاراتها.</p>
        </Sheet>
      ) : null}
    </div>
  );
}
