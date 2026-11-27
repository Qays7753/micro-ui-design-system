/**
 * Splash — the in-app boot screen (§9.ب item 2): on canvas, the four symbol
 * modules GATHER over motion.splash (600ms), then the first screen appears.
 * With prefers-reduced-motion: the symbol sits still 300ms, then motion.fade.
 */
import { useEffect, useState } from 'react';
import { MODULE_PATH, SYMBOL_MODULES } from '../symbol';
import './Splash.css';

const SPLASH_MS = 600;
const REDUCED_MS = 300;
const FADE_MS = 150;

export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'gather' | 'fade'>('gather');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = reduced ? REDUCED_MS : SPLASH_MS;
    const t1 = window.setTimeout(() => setPhase('fade'), hold);
    const t2 = window.setTimeout(onDone, hold + FADE_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`sim-splash${phase === 'fade' ? ' sim-splash--fade' : ''}`}
      data-sim-splash={phase}
      role="img"
      aria-label="Micro"
    >
      <svg className="sim-splash__mark" viewBox="0 0 224 224" width="64" height="64">
        <g transform="translate(16 16)">
          {SYMBOL_MODULES.map((m) => (
            <g key={m.angle} transform={`rotate(${m.angle} 96 96)`}>
              <g className="sim-splash__module">
                <path d={MODULE_PATH} fill={m.fill} />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
