/**
 * The store provider — ONE store for the whole app (SA3): useReducer over the
 * pure reducer, hydrated from the device on mount, saved on every change
 * (owner decision 2). The screens dispatch through useSimDispatch and read
 * through useSim/useSimSelector.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { initialState } from './initial';
import { reducer } from './reducer';
import { loadState, saveState } from './storage';
import type { SimAction, SimState } from './types';

interface SimContextValue {
  state: SimState;
  dispatch: Dispatch<SimAction>;
}

const SimContext = createContext<SimContextValue | null>(null);

export function SimProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState() ?? initialState());

  // Persist every change the experimenter records (the store's own state only;
  // transient navigation lives outside it).
  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim(): SimState {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim: no SimProvider above');
  return ctx.state;
}

export function useSimDispatch(): Dispatch<SimAction> {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimDispatch: no SimProvider above');
  return ctx.dispatch;
}
