/**
 * SA4 — Ask Micro بلا ذكاء اصطناعي (§5.3): the matching, the ten answers,
 * the limits, the unknown question, and — the plan's own test — EVERY NUMBER
 * in the answers is computed from the SA2 trial data (and recomputed after
 * the data changes).
 */
import { describe, expect, it } from 'vitest';
import { reducer } from '../state/reducer';
import { initialState } from '../state/initial';
import type { SimState } from '../state/types';
import { answerQuestion, askRoleOf, availableQuestions } from './ask';
import type { AskPart, AskResult } from './types';

const S = () => initialState();

function askOwner(state: SimState, question: string, nowMinutes = 12 * 60): AskResult {
  const withRole = state.role === 'owner' ? state : { ...state, role: 'owner' } as SimState;
  return answerQuestion(withRole, question, nowMinutes);
}

function askDriver(state: SimState, question: string): AskResult {
  return answerQuestion({ ...state, role: 'driver' } as SimState, question, 12 * 60);
}

function askRoleAs(state: SimState, role: 'supplier' | 'reviewer' | 'guest', question: string): AskResult {
  return answerQuestion({ ...state, role } as SimState, question, 12 * 60);
}

/** Collect every inline 'word' part from an answer (to assert NO digits ride words). */
function wordParts(parts: readonly AskPart[]): string[] {
  const words: string[] = [];
  for (const part of parts) {
    if (part.kind === 'answer') {
      for (const p of part.inline) if (p.t === 'word') words.push(p.text);
    }
    if (part.kind === 'limit') words.push(part.text);
  }
  return words;
}

/** Deep-collect every dinar amount in an answer (inline + computed + table + draft). */
function amountsOf(parts: readonly AskPart[]): number[] {
  const out: number[] = [];
  for (const part of parts) {
    if (part.kind === 'answer') {
      for (const p of part.inline) if (p.t === 'amount') out.push(p.fils);
    }
    if (part.kind === 'computed') out.push(part.fils);
    if (part.kind === 'table') {
      for (const row of part.rows) for (const c of row) if ('amount' in c) out.push(c.amount);
    }
    if (part.kind === 'draft') out.push(part.amount);
  }
  return out;
}

describe('SA4 · the matching normalizes then contains', () => {
  it('the shadda and hamza disappear: «سجّل» carries the key «سجل»', () => {
    const r = askOwner(S(), 'سجّل مصروف 7 دنانير طباعة من الدرج');
    expect(r.status).toBe('answer');
  });
  it('«الصناديق» contains «صناديق»; «ربحت» contains «ربح»', () => {
    expect(askOwner(S(), 'كم في الصناديق الآن؟').status).toBe('answer');
    expect(askOwner(S(), 'كم ربحت هالشهر؟').status).toBe('limit');
  });
  it('ة/ه and ى/ي unify: «مهامي» stays findable, «الصناديق» matches via الهاء', () => {
    expect(askDriver(S(), 'شو مهامي اليوم؟').status).toBe('answer');
  });
});

describe('SA4 · س1: كم دخل هذا الأسبوع؟', () => {
  it('answers 294.750 from 7 movements, 5% below last week, daily table', () => {
    const r = askOwner(S(), 'كم دخل هذا الأسبوع؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(amountsOf(r.parts)).toEqual([294_750, 294_750, 30_000, 2_250, 0, 35_000, 175_000, 52_500]);
    const computed = r.parts.find((p) => p.kind === 'computed')!;
    expect(computed).toMatchObject({ kind: 'computed', fils: 294_750, source: '7 حركات «داخل» من 22/11 إلى 27/11' });
    const table = r.parts.find((p) => p.kind === 'table')!;
    expect(table.headers).toEqual(['اليوم', 'الداخل']);
  });
});

describe('SA4 · س2: كم في الصناديق الآن؟', () => {
  it('answers 595.500 with the wallet-negative sentence and the three funds', () => {
    const r = askOwner(S(), 'كم في الصناديق الآن؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(amountsOf(r.parts)).toEqual([595_500, 595_500, 271_250, 327_250, -3_000]);
    const words = wordParts(r.parts).join(' ');
    expect(words).toContain('المحفظة رصيدها سالب');
  });
});

describe('SA4 · س3: مين عليه دين لي؟', () => {
  it('answers 57.500 from two customers, Abu Mohammad overdue, navigates د2', () => {
    const r = askOwner(S(), 'مين عليه دين لي؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(amountsOf(r.parts)).toEqual([57_500, 45_000, 12_500]);
    expect(wordParts(r.parts).join(' ')).toContain('دين أبو محمد (بقالة النور) متأخر');
    expect(r.parts.find((p) => p.kind === 'nav')).toMatchObject({ kind: 'nav', target: 'د2' });
  });
});

describe('SA4 · س4: شو عندي اليوم؟', () => {
  it('answers «عندك موعدان اليوم» with the two rows sorted by time', () => {
    const r = askOwner(S(), 'شو عندي اليوم؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(wordParts(r.parts).join(' ')).toContain('عندك موعدان اليوم');
    const table = r.parts.find((p) => p.kind === 'table')!;
    expect(table.rows).toEqual([
      [{ text: '11:00 ص' }, { text: 'سلمى الحوراني' }, { text: 'جلسة قياس' }],
      [{ text: '4:00 م' }, { text: 'سلمى الحوراني' }, { text: 'فستان سهرة' }],
    ]);
  });
  it('the nav follows the device clock: after noon it is 1175, before 11 it is 1210', () => {
    const after = askOwner(S(), 'شو عندي اليوم؟', 12 * 60);
    expect(after.status).toBe('answer');
    expect((after as { parts: AskPart[] }).parts.find((p) => p.kind === 'nav')).toMatchObject({ target: '1175' });
    const before = askOwner(S(), 'شو عندي اليوم؟', 9 * 60);
    expect((before as { parts: AskPart[] }).parts.find((p) => p.kind === 'nav')).toMatchObject({ target: '1210' });
  });
});

describe('SA4 · س5: وين طلب 1175؟', () => {
  it('answers with the live status and the delivery time, and navigates', () => {
    const r = askOwner(S(), 'وين طلب 1175؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(wordParts(r.parts).join(' ')).toContain('طلب 1175 جاهز، وتسليمه اليوم 4:00 م');
    expect(r.parts.find((p) => p.kind === 'nav')).toMatchObject({ target: '1175' });
  });
  it('after delivering, the answer recomputes to تم التسليم', () => {
    const delivered = reducer(S(), { type: 'order/deliver', id: '1175' });
    const r = askOwner(delivered, 'وين طلب 1175؟');
    expect((r as { parts: AskPart[] }).parts && wordParts((r as { parts: AskPart[] }).parts).join(' ')).toContain('تم التسليم');
  });
});

describe('SA4 · س6 / س7: the Ask drafts', () => {
  it('س6 returns the existing draft: خارج، 7، درج الكاش، «طباعة»', () => {
    const r = askOwner(S(), 'سجّل مصروف 7 دنانير طباعة من الدرج');
    if (r.status !== 'answer') throw new Error('not an answer');
    expect(r.parts.find((p) => p.kind === 'draft')).toMatchObject({
      kind: 'draft',
      type: 'out',
      amount: 7_000,
      fund: 'درج الكاش',
      note: 'طباعة',
    });
    expect(wordParts(r.parts).join(' ')).toContain('هذه مسودة. راجعها واحفظها');
  });
  it('س7 returns a draft with an EMPTY fund: داخل، 25، رنا العبادي', () => {
    const r = askOwner(S(), 'سجّل بيع 25 دينار لرنا العبادي');
    if (r.status !== 'answer') throw new Error('not an answer');
    expect(r.parts.find((p) => p.kind === 'draft')).toMatchObject({
      kind: 'draft',
      type: 'in',
      amount: 25_000,
      fund: null,
      party: 'رنا العبادي',
    });
    expect(wordParts(r.parts).join(' ')).toContain('هذه مسودة. اختر الصندوق ثم احفظ');
  });
});

describe('SA4 · س8: مين أكثر عميل دفع هالشهر؟', () => {
  it('answers رنا 630 from ح1 ح7 ح10 ح16, with the top three', () => {
    const r = askOwner(S(), 'مين أكثر عميل دفع هالشهر؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(amountsOf(r.parts)).toEqual([630_000, 630_000, 630_000, 242_500, 180_750]);
    expect(r.parts.find((p) => p.kind === 'computed')).toMatchObject({
      source: 'ح1، ح7، ح10، ح16',
    });
    expect(wordParts(r.parts).join(' ')).toContain('رنا العبادي: ');
    expect(wordParts(r.parts).join(' ')).toContain('د من 4 حركات');
  });
});

describe('SA4 · س9: كم ربحت هالشهر؟', () => {
  it('answers the limit: لا أملك بيانات كافية', () => {
    const r = askOwner(S(), 'كم ربحت هالشهر؟');
    expect(r).toMatchObject({ status: 'limit', text: 'لا أملك بيانات كافية لهذا السؤال.' });
  });
});

describe('SA4 · س10 (السائق): شو مهامي اليوم؟', () => {
  it('answers «عندك مهمة جارية» and navigates to ت3', () => {
    const r = askDriver(S(), 'شو مهامي اليوم؟');
    expect(r.status).toBe('answer');
    if (r.status !== 'answer') return;
    expect(wordParts(r.parts).join(' ')).toContain('عندك مهمة جارية');
    expect(r.parts.find((p) => p.kind === 'nav')).toMatchObject({ target: 'ت3' });
  });
  it('after completing ت3 the answer recomputes to لا مهام جارية', () => {
    const done = reducer(
      reducer(S(), { type: 'quote/accept', deliveryId: 'ت3' }),
      { type: 'delivery/complete', deliveryId: 'ت3', evidence: 'photo' },
    );
    const r = askDriver(done, 'شو مهامي اليوم؟');
    expect(wordParts((r as { parts: AskPart[] }).parts).join(' ')).toContain('لا مهام جارية');
  });
});

describe('SA4 · the driver asking about finances', () => {
  it.each(['كم دخل هذا الأسبوع؟', 'كم في الصناديق الآن؟', 'مين عليه دين لي؟', 'كم ربحت هالشهر؟', 'سجّل مصروف 7 دنانير', 'سجّل بيع 25 دينار'])(
    '«%s» is outside the driver scope',
    (question) => {
      expect(askDriver(S(), question)).toMatchObject({
        status: 'limit',
        text: 'هذا خارج صلاحياتك في هذا المشروع.',
      });
    },
  );
});

describe('SA4 · المورد والمراجع والمشتري: س9 فقط', () => {
  it.each(['supplier', 'reviewer', 'guest'])('%s asks س9 → the data limit', (role) => {
    expect(askRoleAs(S(), role as 'supplier', 'كم ربحت هالشهر؟')).toMatchObject({
      status: 'limit',
      text: 'لا أملك بيانات كافية لهذا السؤال.',
    });
  });
  it.each(['supplier', 'reviewer', 'guest'])('%s asks anything else → unknown with س9 available', (role) => {
    const r = askRoleAs(S(), role as 'supplier', 'شو مهامي اليوم؟');
    expect(r.status).toBe('unknown');
    if (r.status !== 'unknown') return;
    expect(r.available).toEqual([{ question: 'كم ربحت هالشهر؟' }]);
  });
});

describe('SA4 · سؤال غير موجود', () => {
  it('the owner sees the polite limit and the nine available questions', () => {
    const r = askOwner(S(), 'شو أكلت على الغدا؟');
    expect(r.status).toBe('unknown');
    if (r.status !== 'unknown') return;
    expect(r.text).toBe('لا أعرف جواب هذا السؤال في هذه النسخة.');
    expect(r.available).toHaveLength(9);
    expect(r.available[0]).toEqual({ question: 'كم دخل هذا الأسبوع؟' });
  });
  it('the driver sees only س10 available', () => {
    const r = askDriver(S(), 'شو أكلت على الغدا؟');
    if (r.status !== 'unknown') throw new Error('expected unknown');
    expect(r.available).toEqual([{ question: 'شو مهامي اليوم؟' }]);
  });
  it('pressing an available row only fills the field (the engine is never auto-asked)', () => {
    // The engine exposes pure building; the fill-only behavior is the panel's.
    const q = availableQuestions('owner')[0]!.question;
    expect(q).toBe('كم دخل هذا الأسبوع؟');
    expect(askOwner(S(), q).status).toBe('answer');
  });
});

describe('SA4 · every later answer computes from the NEW data', () => {
  it('after saving the س7 draft, س2 and س8 recount from the new state', () => {
    const changed = reducer(S(), {
      type: 'movement/save',
      input: { type: 'in', fund: 'cash', amount: 25_000, party: 'رنا العبادي', note: 'بيع' },
    });
    const s2 = askOwner(changed, 'كم في الصناديق الآن؟');
    expect(amountsOf((s2 as { parts: AskPart[] }).parts)).toEqual([620_500, 620_500, 296_250, 327_250, -3_000]);
    const s8 = askOwner(changed, 'مين أكثر عميل دفع هالشهر؟');
    expect(amountsOf((s8 as { parts: AskPart[] }).parts)).toEqual([655_000, 655_000, 655_000, 242_500, 180_750]);
    expect((s8 as { parts: AskPart[] }).parts.find((p) => p.kind === 'computed')).toMatchObject({
      source: 'ح1، ح7، ح10، ح16، ح22',
    });
  });
  it('after paying 35 of د1, س3 recomputes to 22.500 from one customer', () => {
    const changed = reducer(S(), { type: 'debt/pay', debtId: 'د1', amount: 35_000, fund: 'cash' });
    const r = askOwner(changed, 'مين عليه دين لي؟');
    expect(amountsOf((r as { parts: AskPart[] }).parts)).toEqual([22_500, 10_000, 12_500]);
    expect((r as { parts: AskPart[] }).parts.find((p) => p.kind === 'nav')).toMatchObject({ target: 'د2' });
  });
});

describe('SA4 · المبالغ المخفية تسري على كل الأجوبة (23.22)', () => {
  it('no DINAR rides a word part — amounts live only in amount/computed/table cells', () => {
    const questions = [
      'كم دخل هذا الأسبوع؟',
      'كم في الصناديق الآن؟',
      'مين عليه دين لي؟',
      'شو عندي اليوم؟',
      'سجّل مصروف 7 دنانير طباعة من الدرج',
      'سجّل بيع 25 دينار لرنا العبادي',
    ];
    for (const q of questions) {
      const r = askOwner(S(), q);
      expect(r.status, q).toBe('answer');
      for (const word of wordParts((r as { parts: AskPart[] }).parts)) {
        expect(word, `a word part carries digits: ${word}`).not.toMatch(/[0-9٠-٩]/);
      }
    }
    // س5's sentence carries only identifiers and a time — never an amount.
    const s5 = askOwner(S(), 'وين طلب 1175؟');
    expect(amountsOf((s5 as { parts: AskPart[] }).parts)).toEqual([]);
  });
  it('in س8 the only digits riding words are the movement count', () => {
    const r = askOwner(S(), 'مين أكثر عميل دفع هالشهر؟');
    const digitWords = wordParts((r as { parts: AskPart[] }).parts).filter((x) => /[0-9٠-٩]/.test(x));
    expect(digitWords).toEqual([' د من 4 حركات.']);
  });
  it('the ask delay is sim.ask-delay = 1200ms', async () => {
    const { ASK_DELAY_MS } = await import('./types');
    expect(ASK_DELAY_MS).toBe(1200);
  });
});

describe('SA4 · the served role', () => {
  it('the guest stays the guest whether or not they logged in', () => {
    expect(askRoleOf(S())).toBe('guest');
    expect(askRoleOf({ ...S(), role: 'guest', buyer: true } as SimState)).toBe('guest');
    expect(askRoleOf({ ...S(), role: 'owner' } as SimState)).toBe('owner');
  });
});
