/**
 * VersionBadge (§5.9): «<رئيسي>.<فرعي>.<إصلاح> · DD/MM/YYYY» inside an LTR
 * isolation, caption in text-secondary. The two hidden panels open by a
 * LONG PRESS here (owner decision 4).
 */
import { useRef } from 'react';
import { SIM_VERSION } from '../version';

const LONG_PRESS_MS = 500;

export function VersionBadge({ onLongPress }: { onLongPress?: () => void }) {
  const timer = useRef<number | null>(null);
  const longFired = useRef(false);

  const start = () => {
    if (!onLongPress) return;
    longFired.current = false;
    timer.current = window.setTimeout(() => {
      longFired.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  };
  const cancel = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  return (
    <span
      className="sim-version"
      data-sim-version={SIM_VERSION}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => {
        if (longFired.current) e.preventDefault();
      }}
    >
      <bdi dir="ltr">{SIM_VERSION}</bdi>
    </span>
  );
}
