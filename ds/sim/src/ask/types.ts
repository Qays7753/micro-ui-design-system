/**
 * Ask Micro, no artificial intelligence (addendum §5.3): the answers are DATA,
 * built from the live in-memory data. The parts mirror the Ask component
 * vocabulary of BATCH2-SPECS §7 — the answer sentence, the computed result,
 * the inline table, the nav result, the limit, and the draft card — with
 * every DINAR amount riding its own typed part so the hidden-amounts rule
 * (23.22: never an amount inside Ask answers) can be applied by the UI.
 */
import type { SimRole } from '../data/types';

/** One inline piece of an answer sentence: words stay words, amounts stay amounts. */
export type AskInlinePart =
  | { t: 'word'; text: string }
  | { t: 'amount'; fils: number }
  | { t: 'pct'; signed: number };

/** A table cell: text or a dinar amount. */
export type AskCell = { text: string } | { amount: number };

export type AskPart =
  /** AskAnswer — one sentence, inline parts. */
  | { kind: 'answer'; inline: readonly AskInlinePart[] }
  /** AskComputedResult — the headline number with its source line. */
  | { kind: 'computed'; fils: number; source: string }
  /** AskInlineTable — headers and rows. */
  | { kind: 'table'; headers: readonly string[]; rows: readonly (readonly AskCell[])[] }
  /** AskNavResult — navigates to the object. */
  | { kind: 'nav'; label: string; target: string }
  /** AskLimit — the polite refusal. */
  | { kind: 'limit'; text: string }
  /** AskDraftCard — a draft the user reviews and saves. */
  | {
      kind: 'draft';
      type: 'in' | 'out';
      amount: number;
      /** The fund name, or null when the draft still needs one (س7). */
      fund: string | null;
      party: string | null;
      note: string;
    };

export interface AskQuestionRow {
  /** The row's role. */
  role: SimRole;
  /** The visible question (the addendum's س1…س10 wording). */
  question: string;
  /** The matching keys — the normalized question must contain every word. */
  keys: readonly string[];
  /** Builds the answer from the LIVE state; the device clock decides س4's nav. */
  build: (state: SimStateLike, nowMinutes: number) => AskPart[];
}

/** The minimal state surface the builders need (the store satisfies it). */
export interface SimStateLike {
  role: SimRole | null;
  buyer: boolean;
  movements: ReadonlyArray<{
    saved: boolean;
    type: 'in' | 'out' | 'transfer';
    date: string;
    amount: number;
    party: string | null;
    id: string;
    fund?: string;
    from?: string;
    to?: string;
  }>;
  orders: ReadonlyArray<{ id: string; project: string; customer: string; content: string; price: number | null; dueDate: string | null; time: string | null; status: string }>;
  debts: ReadonlyArray<{ id: string; party: string; side: 'forYou' | 'againstYou'; remaining: number; dueDate: string | null; overdue: boolean; settled: boolean }>;
  deliveries: ReadonlyArray<{ id: string; driver: string | null; status: string; date: string }>;
}

export type AskResult =
  | { status: 'answer'; parts: AskPart[] }
  | { status: 'limit'; text: string }
  | { status: 'unknown'; text: string; available: readonly { question: string }[] };

/** AskThinking's delay — sim.ask-delay (addendum م-ر20), simulation only. */
export const ASK_DELAY_MS = 1200;
