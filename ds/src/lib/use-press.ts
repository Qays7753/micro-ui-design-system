/**
 * use-press.ts — the press interaction (BRIEF 23.2 + 27).
 *
 * - Exposes `isPressed` for the CSS pressed state (the component maps it to
 *   the pressed class; the scale/background values stay in component CSS).
 * - Cancels the press when the pointer moves more than
 *   `motion.press-cancel-px` (8px) — the user is scrolling, not pressing.
 * - Fires `onPress` on release (only if the press was not cancelled and no
 *   long-press fired), `onLongPress` after LONG_PRESS_MS.
 * - Works for touch and mouse via Pointer Events.
 *
 * LONG_PRESS_MS = 500 is a platform-standard value; the brief does not fix
 * one (batch-1 report, section 0-9 decision).
 */
import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { getToken } from '../tokens/tokens';

/** Platform-standard long-press delay (see file docs — 0-9 decision). */
export const LONG_PRESS_MS = 500;

export interface UsePressOptions {
  /** Fired on release, when the press was not cancelled or long-pressed. */
  onPress?: () => void;
  /** Fired once after the long-press delay while still pressed. */
  onLongPress?: () => void;
  /** Disabled elements ignore presses entirely (BRIEF 23.24(15)). */
  disabled?: boolean;
}

export interface PressProps {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
}

export interface UsePressResult {
  /** True between pointerdown and release (while not cancelled). */
  isPressed: boolean;
  /** Spread onto the interactive element. */
  pressProps: PressProps;
}

/** Movement (px) that cancels a press — from tokens.json (BRIEF 23.2). */
const PRESS_CANCEL_PX: number = getToken('motion.press-cancel-px');

export function usePress(options: UsePressOptions = {}): UsePressResult {
  const { onPress, onLongPress, disabled } = options;
  const [isPressed, setIsPressed] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    clearLongPressTimer();
    start.current = null;
    longPressFired.current = false;
    setIsPressed(false);
  }, [clearLongPressTimer]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (disabled) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      // Keep receiving move/up events outside the element (mouse drag away).
      if (typeof event.currentTarget.setPointerCapture === 'function') {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Capture can race with the browser — the press still works.
        }
      }
      start.current = { x: event.clientX, y: event.clientY };
      longPressFired.current = false;
      setIsPressed(true);
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          longPressFired.current = true;
          onLongPress();
        }, LONG_PRESS_MS);
      }
    },
    [disabled, onLongPress],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!isPressed || start.current === null) return;
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      if (Math.hypot(dx, dy) > PRESS_CANCEL_PX) {
        cancel(); // the user is scrolling, not pressing (BRIEF 23.2)
      }
    },
    [isPressed, cancel],
  );

  const onPointerUp = useCallback(
    (_event: ReactPointerEvent<HTMLElement>) => {
      if (!isPressed) return;
      const wasLongPress = longPressFired.current;
      cancel();
      if (!wasLongPress && !disabled) onPress?.();
    },
    [isPressed, disabled, onPress, cancel],
  );

  return {
    isPressed,
    pressProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: cancel,
    },
  };
}
