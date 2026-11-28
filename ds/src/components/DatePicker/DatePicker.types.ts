/**
 * DatePicker.types.ts — props of the date picker (ADDENDUM §3.4, 23.18).
 *
 * A date IN A FORM the quick chips do not fit (a due date, a far delivery)
 * — NOT for periods (PeriodSwitcher). A COMPOSITION by §9.4: the field
 * rides the shared picker-field anatomy, and the sheet composes
 * PeriodSwitcher (month-only) + MonthGrid (single) — no anatomy of its
 * own. The value is DD/MM/YYYY.
 */
import type { HTMLAttributes, Ref } from 'react';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'children'> {
  /** The field's label — also the sheet's title. */
  label: string;
  /** The chosen date, DD/MM/YYYY; undefined = empty (§3.4-4). */
  value?: string;
  /** The earliest selectable day, DD/MM/YYYY — earlier sheet days disable. */
  min?: string;
  /** The latest selectable day, DD/MM/YYYY. */
  max?: string;
  /** Reports the picked day, or undefined from the clear button. */
  onChange?: (value: string | undefined) => void;
  /** An OPTIONAL field carries the clear button when it has a value
   *  (§3.4-2 — the lesson rule 67 «اختياري» mark is the host's own). */
  optional?: boolean;
  /** Disables the field (23.2). */
  disabled?: boolean;
  /** idle · error — the error looks like TextField's (§3.4-4). */
  state?: 'idle' | 'error';
  /** React 19 ref-as-prop on the field root. */
  ref?: Ref<HTMLSpanElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

/** The shared month sheet's props (DatePicker's own composition, and the
 *  sheet DateQuickChips' «تاريخ آخر» chip rides — ADDENDUM §3.4-2). */
export interface MonthSheetProps {
  /** The sheet's title (the owning field's label, or «تاريخ آخر»). */
  label: string;
  /** The current date, DD/MM/YYYY — the sheet's month opens on it (else
   *  the current month, §3.4-4), and its day shows selected. */
  value?: string;
  /** The earliest selectable day, DD/MM/YYYY. */
  min?: string;
  /** The latest selectable day, DD/MM/YYYY. */
  max?: string;
  /** Reports the picked day — the sheet closes with no ActionBar
   *  (§3.4-2: choosing a day closes the sheet). */
  onChange: (value: string) => void;
  /** The Sheet's own dismiss (scrim, close button, drag, Escape). */
  onDismiss: () => void;
}
