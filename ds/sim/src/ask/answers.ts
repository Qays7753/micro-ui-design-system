/**
 * The answer builders — every number comes from the LIVE state through the
 * data selectors (the addendum's own values are the ORIGINAL state's). The
 * parts mirror the Ask component vocabulary; dinar amounts ride amount
 * parts so hidden amounts (23.22) can blank every number inside answers.
 */
import { dateDisplay, time12 } from '../format';
import type { AskCell, AskInlinePart, AskPart, AskQuestionRow, SimStateLike } from './types';

const w = (text: string): AskInlinePart => ({ t: 'word', text });
const a = (fils: number): AskInlinePart => ({ t: 'amount', fils });
const p = (signed: number): AskInlinePart => ({ t: 'pct', signed });

const cell = (text: string): AskCell => ({ text });
const cellAmount = (fils: number): AskCell => ({ amount: fils });

/** Weekday names for the daily income table (Sunday-first, weekStart = 0). */
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/** Income between two ISO dates (fils) from the saved 'in' movements. */
function incomeBetween(s: SimStateLike, from: string, to: string): { total: number; count: number } {
  const rows = s.movements.filter((m) => m.saved && m.type === 'in' && m.date >= from && m.date <= to);
  return { total: rows.reduce((t, m) => t + m.amount, 0), count: rows.length };
}

/** Total balance across the funds = total of all saved movement effects. */
function totalOf(s: SimStateLike): number {
  return s.movements.reduce((t, m) => {
    if (!m.saved) return t;
    if (m.type === 'in') return t + m.amount;
    if (m.type === 'out') return t - m.amount;
    return t; // a transfer nets zero
  }, 0);
}

/** One fund's live balance (fils) — a transfer leaves it and enters the other. */
function fundOf(s: SimStateLike, id: 'cash' | 'bank' | 'wallet'): number {
  let bal = 0;
  for (const m of s.movements) {
    if (!m.saved) continue;
    if (m.type === 'in' && m.fund === id) bal += m.amount;
    else if (m.type === 'out' && m.fund === id) bal -= m.amount;
    else if (m.type === 'transfer') {
      if (m.from === id) bal -= m.amount;
      if (m.to === id) bal += m.amount;
    }
  }
  return bal;
}

/** Party-count grammar: عميل واحد / عميلين / N عملاء. */
function partiesWord(n: number): string {
  if (n === 1) return 'عميل واحد';
  if (n === 2) return 'عميلين';
  return `${n} عملاء`;
}

/** Open «لك» debts, oldest overdue first. */
function openForYou(s: SimStateLike) {
  return s.debts.filter((d) => !d.settled && d.side === 'forYou');
}

/** The order's status word (§2.2.1). */
const STATUS_WORDS: Record<string, string> = {
  delivered: 'تم التسليم',
  ready: 'جاهز',
  settled: 'تمت التسوية',
  draft: 'مسودة',
  tentative: 'اتفاق مبدئي',
  confirmed: 'مؤكد',
  inProgress: 'قيد التنفيذ',
  needsReview: 'يحتاج مراجعة',
  postponed: 'مؤجل',
  cancelled: 'ملغى',
};

/** Arabic count sentence for «موعد»: 0/1/2/N. */
function appointmentsSentence(n: number): string {
  if (n === 0) return 'لا مواعيد اليوم.';
  if (n === 1) return 'عندك موعد واحد اليوم.';
  if (n === 2) return 'عندك موعدان اليوم.';
  if (n <= 10) return `عندك ${n} مواعيد اليوم.`;
  return `عندك ${n} موعدًا اليوم.`;
}

/** Arabic count sentence for «مهمة جارية»: 0/1/2/N. */
function missionsSentence(n: number): string {
  if (n === 0) return 'لا مهام جارية.';
  if (n === 1) return 'عندك مهمة جارية.';
  if (n === 2) return 'عندك مهمتان جاريتان.';
  return `عندك ${n} مهام جارية.`;
}

export const QUESTIONS: readonly AskQuestionRow[] = [
  // س1 — كم دخل هذا الأسبوع؟
  {
    role: 'owner',
    question: 'كم دخل هذا الأسبوع؟',
    keys: ['دخل', 'اسبوع'],
    build: (s) => {
      const week = incomeBetween(s, '2026-11-22', '2026-11-27');
      const prev = incomeBetween(s, '2026-11-15', '2026-11-21');
      const diff = prev.total === 0 ? 0 : Math.round(((week.total - prev.total) / prev.total) * 100);
      const dir = diff > 0 ? 'أعلى بـ' : diff < 0 ? 'أقل بـ' : 'مثل';
      const inline: AskInlinePart[] =
        diff === 0
          ? [w('دخل هذا الأسبوع '), a(week.total), w(' د، مثل الأسبوع الماضي.')]
          : [w('دخل هذا الأسبوع '), a(week.total), w(` د، ${dir} `), p(Math.abs(diff)), w('% من الأسبوع الماضي.')];
      const days = [0, 1, 2, 3, 4, 5].map((i) => {
        const d = new Date(`2026-11-22T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() + i);
        const iso = d.toISOString().slice(0, 10);
        const total = s.movements
          .filter((m) => m.saved && m.type === 'in' && m.date === iso)
          .reduce((t, m) => t + m.amount, 0);
        return [cell(DAY_NAMES[i]!), cellAmount(total)] as const;
      });
      return [
        { kind: 'answer', inline },
        { kind: 'computed', fils: week.total, source: `${week.count} حركات «داخل» من 22/11 إلى 27/11` },
        { kind: 'table', headers: ['اليوم', 'الداخل'], rows: days },
      ];
    },
  },
  // س2 — كم في الصناديق الآن؟
  {
    role: 'owner',
    question: 'كم في الصناديق الآن؟',
    keys: ['صناديق'],
    build: (s) => {
      const total = totalOf(s);
      const walletNegative = fundOf(s, 'wallet') < 0;
      const funds = (['cash', 'bank', 'wallet'] as const).map((id) => [
        cell(id === 'cash' ? 'درج الكاش' : id === 'bank' ? 'الحساب البنكي' : 'المحفظة'),
        cellAmount(fundOf(s, id)),
      ] as const);
      return [
        {
          kind: 'answer',
          inline: walletNegative
            ? [w('في الصناديق '), a(total), w(' د. المحفظة رصيدها سالب.')]
            : [w('في الصناديق '), a(total), w(' د.')],
        },
        { kind: 'computed', fils: total, source: 'الصناديق الثلاثة' },
        { kind: 'table', headers: ['الصندوق', 'الرصيد'], rows: funds },
      ];
    },
  },
  // س3 — مين عليه دين لي؟
  {
    role: 'owner',
    question: 'مين عليه دين لي؟',
    keys: ['دين', 'لي'],
    build: (s) => {
      const open = openForYou(s);
      const overdue = open.filter((d) => d.overdue);
      const total = open.reduce((t, d) => t + d.remaining, 0);
      const inline: AskInlinePart[] =
        open.length === 0
          ? [w('لا ديون لك عند أحد.')]
          : [
              w('لك '),
              a(total),
              w(` د عند ${partiesWord(open.length)}`),
              ...overdue.slice(0, 1).flatMap((d) => [w(` دين ${d.party} متأخر.`)]),
            ];
      const rows = open.map((d) => [
        cell(d.party),
        cellAmount(d.remaining),
        cell(d.dueDate ? dateDisplay(d.dueDate)! : '—'),
      ] as const);
      const parts: AskPart[] = [
        { kind: 'answer', inline },
        { kind: 'table', headers: ['الطرف', 'المتبقي', 'الاستحقاق'], rows },
      ];
      if (open.length > 0) {
        const nav = overdue[0] ?? open[0]!;
        parts.push({ kind: 'nav', label: `دين ${nav.party}`, target: nav.id });
      }
      return parts;
    },
  },
  // س4 — شو عندي اليوم؟
  {
    role: 'owner',
    question: 'شو عندي اليوم؟',
    keys: ['عندي', 'اليوم'],
    build: (s, nowMinutes) => {
      const today = s.orders.filter((o) => o.project === 'yasmine' && o.dueDate === '2026-11-27');
      const sorted = [...today].sort((x, y) => (x.time ?? '').localeCompare(y.time ?? ''));
      const inline: AskInlinePart[] = [w(appointmentsSentence(sorted.length))];
      const rows = sorted.map((o) => [
        cell(time12(o.time) ?? '—'),
        cell(o.customer),
        cell(o.content),
      ] as const);
      const parts: AskPart[] = [
        { kind: 'answer', inline },
        { kind: 'table', headers: ['الوقت', 'العميل', 'الطلب'], rows },
      ];
      const next = sorted.find((o) => {
        const [h, m] = (o.time ?? '').split(':').map((x) => Number.parseInt(x, 10));
        return Number.isFinite(h) && h * 60 + (m || 0) >= nowMinutes;
      });
      if (next) {
        parts.push({ kind: 'nav', label: `طلب ${next.id}`, target: next.id });
      }
      return parts;
    },
  },
  // س5 — وين طلب 1175؟
  {
    role: 'owner',
    question: 'وين طلب 1175؟',
    keys: ['1175'],
    build: (s) => {
      const o = s.orders.find((x) => x.id === '1175');
      if (!o) return [{ kind: 'limit', text: 'لا أعرف جواب هذا السؤال في هذه النسخة.' } as AskPart];
      const when = o.time ? `اليوم ${time12(o.time)}` : o.dueDate ? dateDisplay(o.dueDate)! : 'بلا موعد';
      return [
        { kind: 'answer', inline: [w(`طلب 1175 ${STATUS_WORDS[o.status] ?? o.status}، وتسليمه ${when}.`)] },
        { kind: 'nav', label: 'طلب 1175', target: '1175' },
      ];
    },
  },
  // س6 — سجّل مصروف 7 دنانير طباعة من الدرج
  {
    role: 'owner',
    question: 'سجّل مصروف 7 دنانير طباعة من الدرج',
    keys: ['سجل', 'مصروف'],
    build: () => [
      { kind: 'answer', inline: [w('هذه مسودة. راجعها واحفظها.')] },
      { kind: 'draft', type: 'out', amount: 7_000, fund: 'درج الكاش', party: null, note: 'طباعة' },
    ],
  },
  // س7 — سجّل بيع 25 دينار لرنا العبادي
  {
    role: 'owner',
    question: 'سجّل بيع 25 دينار لرنا العبادي',
    keys: ['سجل', 'بيع'],
    build: () => [
      { kind: 'answer', inline: [w('هذه مسودة. اختر الصندوق ثم احفظ.')] },
      { kind: 'draft', type: 'in', amount: 25_000, fund: null, party: 'رنا العبادي', note: '' },
    ],
  },
  // س8 — مين أكثر عميل دفع هالشهر؟
  {
    role: 'owner',
    question: 'مين أكثر عميل دفع هالشهر؟',
    keys: ['اكثر', 'عميل'],
    build: (s) => {
      const map = new Map<string, { total: number; ids: string[] }>();
      for (const m of s.movements) {
        if (!m.saved || m.type !== 'in' || !m.party) continue;
        if (!m.date.startsWith('2026-11')) continue;
        const entry = map.get(m.party) ?? { total: 0, ids: [] };
        entry.total += m.amount;
        entry.ids.push(m.id);
        map.set(m.party, entry);
      }
      const ranked = [...map.entries()]
        .map(([party, v]) => ({ party, total: v.total, ids: [...v.ids] }))
        .sort((x, y) => y.total - x.total);
      if (ranked.length === 0) {
        return [{ kind: 'answer', inline: [w('لا حركات داخل هذا الشهر.')] }];
      }
      const top = ranked[0]!;
      const rows = ranked
        .slice(0, 3)
        .map((r) => [cell(r.party), cellAmount(r.total)] as const);
      return [
        {
          kind: 'answer',
          inline: [w(`${top.party}: `), a(top.total), w(` د من ${top.ids.length} حركات.`)],
        },
        { kind: 'computed', fils: top.total, source: top.ids.join('، ') },
        { kind: 'table', headers: ['العميل', 'المدفوع'], rows },
      ];
    },
  },
  // س9 — كم ربحت هالشهر؟ (AskLimit للجميع)
  {
    role: 'owner',
    question: 'كم ربحت هالشهر؟',
    keys: ['ربح'],
    build: () => [{ kind: 'limit', text: 'لا أملك بيانات كافية لهذا السؤال.' }],
  },
  // س10 — شو مهامي اليوم؟ (السائق)
  {
    role: 'driver',
    question: 'شو مهامي اليوم؟',
    keys: ['مهام'],
    build: (s) => {
      const mine = s.deliveries.filter((d) => d.driver === 'عمر الزعبي' && d.status === 'inProgress');
      const inline: AskInlinePart[] =
        mine.length === 0
          ? [w(missionsSentence(0))]
          : [w(missionsSentence(mine.length))];
      const parts: AskPart[] = [{ kind: 'answer', inline }];
      if (mine[0]) {
        parts.push({ kind: 'nav', label: `توصيل ${mine[0].id}`, target: mine[0].id });
      }
      return parts;
    },
  },
];

/** The driver's finance scope (§5.3): these keys → خارج صلاحياتك. */
export const DRIVER_FINANCE_KEYS: readonly string[] = ['دخل', 'صناديق', 'دين', 'ربح', 'مصروف', 'بيع'];
