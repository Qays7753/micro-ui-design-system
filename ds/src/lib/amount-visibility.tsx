/**
 * amount-visibility.tsx — the amount-visibility context (BRIEF 23.22 [مؤكد]).
 *
 * The app owns the hidden/shown state (and persists it); the library only
 * reads it. Components never receive it as a prop (BRIEF 23.18).
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface AmountVisibilityContextValue {
  /** True when amounts must render as bullets (BRIEF 23.22). */
  readonly hidden: boolean;
}

export interface AmountVisibility {
  readonly hidden: boolean;
  /** Convenience: !hidden. */
  readonly visible: boolean;
}

const AmountVisibilityContext = createContext<AmountVisibilityContextValue>({ hidden: false });

export interface AmountVisibilityProviderProps {
  children: ReactNode;
  /** The app decides; default is visible. */
  hidden?: boolean;
}

/** Provide the amount-visibility state once, near the app root. */
export function AmountVisibilityProvider({ children, hidden = false }: AmountVisibilityProviderProps) {
  const value = useMemo(() => ({ hidden }), [hidden]);
  return <AmountVisibilityContext.Provider value={value}>{children}</AmountVisibilityContext.Provider>;
}

/** Read the amount-visibility state (defaults to visible outside a provider). */
export function useAmountVisibility(): AmountVisibility {
  const { hidden } = useContext(AmountVisibilityContext);
  return { hidden, visible: !hidden };
}
