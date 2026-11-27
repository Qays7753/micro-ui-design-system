/**
 * DebtSummary.types.ts — props of the debts summary (BATCH2-SPECS §2.5;
 * BRIEF 23.18 unified vocabulary).
 *
 * The head of the debts section: a Surface with TWO equal columns (no
 * divider) — «لك» with its total in Money lg and its party count, and
 * «عليك» the same. When either number does not fit its column uncut the
 * columns become two rows (first above second, 16 apart). NOT the hero
 * number of the finance screen (that is HeroSurface).
 */
import type { HTMLAttributes, Ref } from 'react';
import type { MoneyInput } from '../../lib/format-money';
import type { DataState } from '../../lib/types';

export interface DebtSummaryColumn {
  /** The column total; Money lg, no debt word (§2.5 item 2). */
  value: MoneyInput;
  /** The count line: «من عميل واحد» / «من مورد واحد» — the app passes
   *  the counted plural text (24.8 rules) whole. */
  counted: string;
}

export interface DebtSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /** The «لك» column (owed to you). */
  forYou: DebtSummaryColumn;
  /** The «عليك» column (you owe). */
  againstYou: DebtSummaryColumn;
  /** Loading renders the skeleton columns (§0.2 item 1). */
  state?: DataState;
  /** React 19 ref-as-prop on the root element. */
  ref?: Ref<HTMLDivElement>;
}
