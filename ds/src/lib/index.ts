/**
 * lib — shared, framework-level behavior for every component.
 * No Arabic strings here: all user-visible words live in src/i18n/ar.ts.
 */
export {
  formatMoney,
  type DebtSide,
  type MoneyAriaTexts,
  type MoneyDirection,
  type MoneyFormatOptions,
  type MoneyInput,
  type MoneyResult,
} from './format-money';
export {
  AmountVisibilityProvider,
  useAmountVisibility,
  type AmountVisibility,
  type AmountVisibilityContextValue,
  type AmountVisibilityProviderProps,
} from './amount-visibility';
export {
  usePress,
  LONG_PRESS_MS,
  type PressProps,
  type UsePressOptions,
  type UsePressResult,
} from './use-press';
export {
  useVisualViewport,
  type VisualViewportState,
} from './use-visual-viewport';
export {
  LayersProvider,
  useOpenSheetCount,
  useSheetLayer,
  type LayersProviderProps,
  type SheetLayerInfo,
} from './layers';
export type { ButtonVariant, DataState, Density, Size } from './types';
