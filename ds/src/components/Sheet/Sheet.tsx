/**
 * Sheet — the bottom sheet (BRIEF 23.11 + 23.15 layers).
 *
 * - detail variant (default): canvas background, white surfaces carry
 *   the content; form variant (1.7 ت7): surface background, fields
 *   directly on it, always 92% tall (ت6).
 *   elevation-float shadow; radius 24 top corners (Surface family).
 * - Handle 36×5 full-radius `handle` color, 8 from the top edge.
 * - Header: title Rubik 22/30/600, padding 20, closing IconButton at
 *   the end.
 * - Drag: the sheet follows the finger 1:1 (translateY only, downward);
 *   released past 30% of its height or faster than 0.6px/ms it closes,
 *   otherwise it returns with the `standard` motion; the motion is
 *   interruptible (a new touch stops it where it is and follows again).
 * - Scrolling inside: overscroll-behavior contain (the drag starts only
 *   from the header/handle area or a scrolled-to-top body).
 * - Close (و-2 item 30): the sheet plays its OWN exit motion first —
 *   the panel slides to translateY(100%) with the exit token and the
 *   scrim fades — THEN calls onDismiss, and the app removes it. A new
 *   touch on the grab zone cancels the close where it is (23.11
 *   interruptible). Focus returns to the opener when the dismiss fires
 *   (23.17). prefers-reduced-motion (and any engine that reports no
 *   transition) closes immediately: no orphaned motion.
 * - Layers: layer.sheet(40) over layer.scrim(30); `stacked` renders at
 *   layer.sheet-2(60) over layer.scrim-2(50). Max two stacked (23.15) —
 *   enforced by the app's own flow; the component provides the levels.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CloseIcon } from '../../icons';

/** Live-mounted sheet registry: render order decides the layer level. */
const liveSheets = new Set<symbol>();
import { IconButton } from '../IconButton/index';
import type { SheetProps } from './Sheet.types';
import './Sheet.css';

export function Sheet({
  label,
  variant = 'detail',
  children,
  onDismiss,
  className,
  id,
  style,
  ref,
  ...rest
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const openerRef = useRef<HTMLElement | null>(null);

  // The latest onDismiss, so the transitionend callback (registered once
  // per close) always fires the current prop — written in an effect,
  // never during render.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  /** Finishes the close: return focus to the opener (23.17), then hand
   *  the removal to the app. */
  const finishDismiss = useCallback(() => {
    openerRef.current?.focus?.();
    onDismissRef.current();
  }, []);

  // 23.15: the stacking level from live render order — the second live
  // sheet takes sheet-2(60) over scrim-2(50); a third never mounts (the
  // app replaces the second's content instead). The registration runs
  // once at first render (the useState initializer) and leaves in the
  // unmount cleanup.
  const [token] = useState(() => Symbol('sheet'));
  const [level] = useState(() => {
    liveSheets.add(token);
    return liveSheets.size >= 2 ? 2 : 1;
  });
  useEffect(
    () => () => {
      liveSheets.delete(token);
    },
    [token],
  );

  const threshold = () => {
    // 30% of the SHEET's own height (23.11) — measured on the panel,
    // not the fixed overlay root (which is full-screen).
    const el = sheetRef.current?.querySelector('.mds-sheet-panel') as HTMLElement | null;
    if (!el) return 0;
    return el.getBoundingClientRect().height * 0.3;
  };

  /** The dismiss entry point for every close path (و-2 item 30): start
   *  the exit motion, then onDismiss — the app unmounts afterwards. A
   *  second request while closing is a no-op; the grab-zone pointerdown
   *  cancels instead (23.11 interruptible). */
  const requestDismiss = useCallback(() => {
    if (closing) return;
    openerRef.current = (document.activeElement as HTMLElement | null) ?? null;
    setClosing(true);
    // Next frame so the closing transition class is committed before the
    // target transform is written (a plain rAF; jsdom falls back to a
    // microtask-ish timeout — scheduling only, never a design value).
    const schedule = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0);
    schedule(() => {
      const panel = sheetRef.current?.querySelector('.mds-sheet-panel') as HTMLElement | null;
      if (!panel) {
        finishDismiss();
        return;
      }
      const duration = getComputedStyle(panel).transitionDuration;
      const animated = duration && duration !== '0s' && duration !== '';
      panel.style.transform = 'translateY(100%)';
      if (!animated) {
        // prefers-reduced-motion (transition: none) or a non-CSS engine:
        // close immediately, never orphan the exit.
        finishDismiss();
        return;
      }
      const done = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return;
        panel.removeEventListener('transitionend', done);
        finishDismiss();
      };
      panel.addEventListener('transitionend', done);
    });
  }, [closing, finishDismiss]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const now = performance.now();
    const dt = now - lastT.current;
    if (dt > 0) velocity.current = (e.clientY - lastY.current) / dt;
    lastY.current = e.clientY;
    lastT.current = now;
    // 1:1 with the finger, downward only (a sheet never moves up).
    setDragY(Math.max(0, e.clientY - dragOrigin.current));
  };

  // The pointer-down clientY; the drag delta is measured from it plus
  // whatever offset a previous partial drag left.
  const dragOrigin = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    // The drag starts from the header/handle area, or from the body only
    // when it is scrolled to the top (23.11 scrolling-inside rule).
    const target = e.target as HTMLElement;
    const body = sheetRef.current?.querySelector('.mds-sheet-body') as HTMLElement | null;
    const fromBody = body?.contains(target);
    if (fromBody && body && body.scrollTop > 0) return;
    if (closing) {
      // 23.11 interruptible: a new touch cancels the exit where the
      // panel is and the drag follows the finger again.
      const panel = sheetRef.current?.querySelector('.mds-sheet-panel') as HTMLElement | null;
      if (panel) panel.style.transform = dragY ? `translateY(${dragY}px)` : '';
      setClosing(false);
    }
    velocity.current = 0;
    lastY.current = e.clientY;
    lastT.current = performance.now();
    setDragging(true);
    // Pointer capture keeps the drag tied to the grab zone across
    // leave events; guard for engines without it (jsdom).
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    const pastDistance = dragY > threshold();
    const fast = velocity.current > 0.6;
    if (pastDistance || fast) {
      // Dismiss: KEEP the drag offset — the exit motion starts from
      // where the finger left it (و-2 item 30), not from a snapped-back 0.
      requestDismiss();
    } else {
      // Return: the offset resets so the panel springs back (standard).
      setDragY(0);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestDismiss]);

  const classes = [
    'mds-sheet',
    variant === 'form' ? 'mds-sheet--form' : '',
    level === 2 ? 'mds-sheet--stacked' : '',
    dragging ? 'mds-sheet--dragging' : '',
    closing ? 'mds-sheet--closing' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={(node) => {
        sheetRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
      }}
      id={id}
      style={style}
      className={classes}
      data-ds-sheet-level={String(level)}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      {...rest}
    >
      <div
        className="mds-sheet-scrim"
        onClick={() => requestDismiss()}
        aria-hidden="true"
      />
      <div
        className="mds-sheet-panel"
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        <div
          className="mds-sheet-grab"
          onPointerDown={(e) => {
            dragOrigin.current = e.clientY - dragY;
            onPointerDown(e);
          }}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className="mds-sheet-handle" aria-hidden="true" />
          <header className="mds-sheet-header">
            <h2 className="mds-sheet-title mds-type-title-section">{label}</h2>
          </header>
        </div>
        <div className="mds-sheet-close">
          <IconButton label={label} onPress={requestDismiss}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mds-sheet-body">{children}</div>
      </div>
    </div>
  );
}
