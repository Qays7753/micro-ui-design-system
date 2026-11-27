/**
 * The ask engine (§5.3): normalize the question, match it against the rows
 * for the CURRENT role, and build the answer from the live data. The driver
 * asking about finances gets the out-of-scope limit; س9 is known to every
 * role except the driver (whose ربح is finance scope); anything else is
 * «سؤال غير موجود» with the role's available questions.
 */
import { DRIVER_FINANCE_KEYS, QUESTIONS } from './answers';
import { matchesKeys } from './normalize';
import type { AskQuestionRow, AskResult, SimStateLike } from './types';

export type AskRole = 'owner' | 'driver' | 'supplier' | 'reviewer' | 'guest';

/** The role the ask engine serves (the guest stays the guest, buyer or not). */
export function askRoleOf(state: SimStateLike): AskRole {
  return (state.role ?? 'guest') as AskRole;
}

/** The questions a role may ask (the unknown-question Surface lists them). */
export function availableQuestions(role: AskRole): AskQuestionRow[] {
  const own = QUESTIONS.filter((q) => q.role === role);
  // س9 (ربح) is known to every role EXCEPT the driver (finance scope).
  if (role === 'driver' || own.some((q) => q.keys.length === 1 && q.keys[0] === 'ربح')) return own;
  return [...own, QUESTIONS.find((q) => q.role === 'owner' && q.keys.length === 1 && q.keys[0] === 'ربح')!];
}

/** The engine. nowMinutes = the device clock (minutes since midnight) for س4. */
export function answerQuestion(state: SimStateLike, question: string, nowMinutes: number): AskResult {
  const role = askRoleOf(state);

  // The driver asking about finances: خارج صلاحياتك (§5.3) — before anything else.
  if (role === 'driver' && DRIVER_FINANCE_KEYS.some((k) => matchesKeys(question, [k]))) {
    return { status: 'limit', text: 'هذا خارج صلاحياتك في هذا المشروع.' };
  }

  // The first row of this role that matches.
  const row = QUESTIONS.find((q) => q.role === role && matchesKeys(question, q.keys));
  if (row) {
    const parts = row.build(state, nowMinutes);
    // A row whose whole answer is one polite refusal (س9) IS the limit result.
    if (parts.length === 1 && parts[0]!.kind === 'limit') {
      return { status: 'limit', text: parts[0]!.text };
    }
    return { status: 'answer', parts };
  }

  // س9 (ربح) is known to every other role too — with its limit answer.
  if (role !== 'driver' && matchesKeys(question, ['ربح'])) {
    return { status: 'limit', text: 'لا أملك بيانات كافية لهذا السؤال.' };
  }

  return {
    status: 'unknown',
    text: 'لا أعرف جواب هذا السؤال في هذه النسخة.',
    available: availableQuestions(role).map((q) => ({ question: q.question })),
  };
}
