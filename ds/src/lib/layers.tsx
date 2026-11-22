/**
 * layers.tsx — the layer registry (BRIEF 23.15).
 *
 * Sheets register themselves here on mount; each one learns
 * - its level (1 = first sheet, 2 = second sheet) and the z-index variables
 *   for itself and its scrim,
 * - whether it is the top-most sheet,
 * - and whether the stacking limit was exceeded (more than 2 sheets). The
 *   brief's answer to a third sheet is to replace the second sheet's content
 *   (with an in-sheet transition and a back button), never to open a third
 *   one — `overLimit` tells the sheet component to do exactly that.
 *
 * Z-index values are referenced through the token variables, never as
 * numbers (BRIEF 16.22).
 */
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

export interface SheetLayerInfo {
  /** 1 for the bottom sheet, 2 for the sheet above it (capped). */
  readonly level: 1 | 2;
  /** True when more than two sheets are stacked (BRIEF 23.15). */
  readonly overLimit: boolean;
  /** z-index CSS value for the sheet element. */
  readonly sheetZ: string;
  /** z-index CSS value for the accompanying scrim (null above the cap). */
  readonly scrimZ: string | null;
  /** True for the top-most registered sheet. */
  readonly isTop: boolean;
}

interface LayersContextValue {
  sheetIds: readonly string[];
  registerSheet: (id: string) => void;
  unregisterSheet: (id: string) => void;
}

const LayersContext = createContext<LayersContextValue>({
  sheetIds: [],
  registerSheet: () => undefined,
  unregisterSheet: () => undefined,
});

interface LayerAction {
  type: 'register' | 'unregister';
  id: string;
}

function layerReducer(ids: readonly string[], action: LayerAction): readonly string[] {
  switch (action.type) {
    case 'register':
      return ids.includes(action.id) ? ids : [...ids, action.id];
    case 'unregister':
      // Bail out when absent so a repeated unregister cannot loop updates.
      return ids.includes(action.id) ? ids.filter((id) => id !== action.id) : ids;
    default:
      return ids;
  }
}

export interface LayersProviderProps {
  children: ReactNode;
}

/** Provide the layer registry once, near the app root. */
export function LayersProvider({ children }: LayersProviderProps) {
  const [sheetIds, dispatch] = useReducer(layerReducer, [] as readonly string[]);
  // Stable callbacks: sheets register in layout effects whose deps must not
  // change on every registry update (that looped updates in tests).
  const registerSheet = useCallback((id: string) => dispatch({ type: 'register', id }), []);
  const unregisterSheet = useCallback((id: string) => dispatch({ type: 'unregister', id }), []);
  const value = useMemo<LayersContextValue>(
    () => ({ sheetIds, registerSheet, unregisterSheet }),
    [sheetIds, registerSheet, unregisterSheet],
  );
  return <LayersContext.Provider value={value}>{children}</LayersContext.Provider>;
}

/** Register a sheet and read its layer position (BRIEF 23.15). */
export function useSheetLayer(): SheetLayerInfo {
  const { sheetIds, registerSheet, unregisterSheet } = useContext(LayersContext);
  const id = useId();

  useLayoutEffect(() => {
    registerSheet(id);
    return () => unregisterSheet(id);
  }, [id, registerSheet, unregisterSheet]);

  // Position 0 = not yet registered (first render); treat as the next slot.
  const position = sheetIds.indexOf(id) + 1 || sheetIds.length + 1;
  const capped = Math.min(position, 2) as 1 | 2;
  const isTop = position === sheetIds.length;

  return {
    level: capped,
    overLimit: position > 2,
    sheetZ: capped === 1 ? 'var(--mds-layer-sheet)' : 'var(--mds-layer-sheet-2)',
    scrimZ: capped === 1 ? 'var(--mds-layer-scrim)' : 'var(--mds-layer-scrim-2)',
    isTop,
  };
}

/** Read the open sheet count (e.g. to place Toast above the top ActionBar). */
export function useOpenSheetCount(): number {
  const { sheetIds } = useContext(LayersContext);
  return sheetIds.length;
}
