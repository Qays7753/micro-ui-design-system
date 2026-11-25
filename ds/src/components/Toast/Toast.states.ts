/** Toast.states.ts — applicable states from BRIEF 9.0 + 23.12. */
export const ToastStates = ['default', 'withAction', 'focusedPaused'] as const;
export type ToastStateId = (typeof ToastStates)[number];
