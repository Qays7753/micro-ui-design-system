/**
 * Toast — the bottom feedback bar (BRIEF 23.12, 23.17).
 *
 * Fixed above the bars at toast-offset; the timer is 3000ms, or 5000ms
 * with an action; it pauses while focus is inside the toast. Polite
 * role=status. The app keeps ONE toast: rendering a new label replaces
 * the old (23.12 «الجديد يحل محل القديم» — same instance, new content).
 */
import { useEffect, useRef } from 'react';
import { t as _t } from '../../i18n/ar';
import type { ToastProps } from './Toast.types';
import './Toast.css';

export function Toast({
  label,
  trailing,
  onDismiss,
  className,
  id,
  style,
  ref,
  ...rest
}: ToastProps) {
  const timer = useRef<number | null>(null);
  const remaining = useRef<number>(0);
  const startedAt = useRef<number>(0);
  const duration = trailing ? 5000 : 3000;

  useEffect(() => {
    // 23.12: 3000ms, or 5000ms with «تراجع».
    remaining.current = duration;
    startedAt.current = Date.now();
    timer.current = window.setTimeout(() => onDismiss?.(), duration);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, duration]);

  const pause = () => {
    if (!timer.current) return;
    window.clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - startedAt.current;
  };

  const resume = () => {
    if (timer.current) return;
    startedAt.current = Date.now();
    timer.current = window.setTimeout(() => onDismiss?.(), Math.max(0, remaining.current));
  };

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-toast', className].filter(Boolean).join(' ')}
      role="status"
      onFocus={pause}
      onBlur={resume}
      {...rest}
    >
      <span className="mds-toast-text">{label}</span>
      {trailing ? <span className="mds-toast-action">{trailing}</span> : null}
    </div>
  );
}
