/**
 * DateQuickChips.types.ts — props of the quick-date chips row (BATCH2-SPECS
 * §1.8, 23.18).
 *
 * ONE date inside a form: quick chips (اليوم/أمس/غداً — the app passes the
 * ones it wants) plus the trailing «تاريخ آخر» chip. NOT for a period
 * (PeriodSwitcher). The value is a DD/MM/YYYY string (Western digits, the
 * format the spec pins — criterion 2). The chips WRAP (no horizontal
 * scrolling here — §1.8-6), unlike FilterChips' scrolling row.
 */
import type { Ref } from 'react';
import type { DataState } from '../../lib/types';

export interface DateQuickChipOption {
  /** The chip's date, DD/MM/YYYY — the value handed to onChange. */
  value: string;
  /** The visible word («اليوم»، «أمس»، «غداً») — dictionary text (24). */
  label: string;
}

export interface DateQuickChipsProps {
  /** The group's accessible name («تاريخ البيع») — shown by the app's label
   * line above (23.1); the group itself carries it as its SR name. */
  label: string;
  /** The chosen date, DD/MM/YYYY; undefined = nothing chosen (§1.8-4). */
  value?: string;
  /** The quick chips the app passes (م-خ1) — from among today / yesterday /
   * tomorrow. A chip whose date sits outside [min, max] disables. */
  items: readonly DateQuickChipOption[];
  /** The earliest pickable date (DD/MM/YYYY). */
  min?: string;
  /** The latest pickable date (DD/MM/YYYY). */
  max?: string;
  /** Reports the chosen date (unified onChange, 23.18). */
  onChange?: (value: string) => void;
  /** Disables the whole row (23.2). */
  disabled?: boolean;
  /** error = saved with nothing chosen: «اختر التاريخ» under the row. */
  state?: Extract<DataState, 'idle' | 'error'>;
  /** The «تاريخ آخر» chip was pressed with no custom date yet: until the
   * library's month sheet lands (PeriodSwitcher + MonthGrid — the shared
   * sheet of the DatePicker composition), the HOST opens its own picker
   * from here (the kh16 interim pattern). */
  onPress?: () => void;
  /** React 19 ref-as-prop on the radiogroup root. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
