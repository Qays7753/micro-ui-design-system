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
import { type PointerEvent as ReactPointerEvent } from 'react';
/** Platform-standard long-press delay (see file docs — 0-9 decision). */
export declare const LONG_PRESS_MS = 500;
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
export declare function usePress(options?: UsePressOptions): UsePressResult;
