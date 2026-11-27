/**
 * The 17 tasks (§5.4.2): the م1 §9.أ journeys with the addendum §4
 * corrections, in order ر2.1 → ر6.3. Each carries its role, its sentence,
 * its start screen, its steps, its expected errors, and its SUCCESS
 * CONDITION as a pure function of the state — the shell re-checks the
 * condition after every data or screen change (§5.4.2).
 */
import type { SimState, Screen } from '../state/types';
import type { SimRole } from '../data/types';

export interface TaskDef {
  /** The journey's own id (ر2.1 … ر6.3). */
  id: string;
  /** The role the task starts as. */
  role: SimRole;
  /** ر4.4: the task continues as the owner («بدّل إلى المالك»). */
  alsoOwner?: boolean;
  /** The journey's sentence (the bar shows «N/17 · <جملة المهمة>»). */
  sentence: string;
  /** The start screen (§5.4.2's table). */
  startScreen: Screen;
  /** The steps, condensed from the journey's own wording. */
  steps: readonly string[];
  /** The journey's expected errors. */
  expectedErrors?: readonly string[];
  /** Success — a pure function of the state. */
  condition: (state: SimState) => boolean;
}

const isIn = (s: SimState, o: { customer: string; price: number | null; dueDate: string | null; time: string | null; status: string }): boolean =>
  s.orders.some(
    (x) =>
      x.customer === o.customer &&
      x.price === o.price &&
      x.dueDate === o.dueDate &&
      x.time === o.time &&
      (x.status === o.status) &&
      Number.parseInt(x.id, 10) > 1210,
  );

export const TASKS: readonly TaskDef[] = [
  {
    id: 'ر2.1',
    role: 'owner',
    sentence: 'سجّل بيعاً بـ145.750 د دخل الحساب البنكي من سلمى الحوراني',
    startScreen: 'finance',
    steps: [
      '«سجّل حركة» ← «داخل»',
      'اكتب 145.750',
      'الصندوق: الحساب البنكي',
      'ابحث «سلمى» واختر الصف',
      '«اليوم» ← «احفظ الحركة»',
    ],
    expectedErrors: [
      'الحفظ بلا مبلغ أو بلا نوع: خطأ الحقل',
      'خانة عشرية رابعة تُرفض',
      'أرقام هندية من لوحة الجهاز تُطبَّع',
      'فقد الاتصال عند الحفظ: «لم يُحفظ — أعد المحاولة»',
    ],
    condition: (s) =>
      s.movements.some(
        (m) => m.saved && m.type === 'in' && m.fund === 'bank' && m.amount === 145_750 && m.party === 'سلمى الحوراني' && m.date === '2026-11-27',
      ),
  },
  {
    id: 'ر2.2',
    role: 'owner',
    sentence: 'حوّل 45 د من درج الكاش إلى الحساب البنكي',
    startScreen: 'finance',
    steps: [
      '«سجّل حركة» ← «تحويل»',
      'من: درج الكاش ← إلى: الحساب البنكي',
      'اكتب 45 ← «احفظ الحركة»',
    ],
    expectedErrors: ['اختيار الصندوق نفسه مرتين: غير ممكن'],
    condition: (s) =>
      s.movements.some((m) => m.saved && m.type === 'transfer' && m.from === 'cash' && m.to === 'bank' && m.amount === 45_000 && m.date === '2026-11-27'),
  },
  {
    id: 'ر2.3',
    role: 'owner',
    sentence: 'سجّل دفعة 35 د من دين سلمى الحوراني',
    startScreen: 'finance',
    steps: ['«الديون» ← بطاقة سلمى ← «سجّل دفعة»', '35 من درج الكاش ← «احفظ الدفعة»'],
    expectedErrors: ['مبلغ أكبر من المتبقي: «اكتب مبلغاً حتى 45 د»'],
    condition: (s) => s.debts.find((d) => d.id === 'د1')?.remaining === 10_000,
  },
  {
    id: 'ر2.4',
    role: 'owner',
    sentence: 'أخفِ المبالغ قبل أن يرى الزبون الشاشة',
    startScreen: 'finance',
    steps: ['HeroSurface ← زر الإخفاء'],
    condition: (s) => s.amountsHidden === true,
  },
  {
    id: 'ر3.1',
    role: 'owner',
    sentence: 'سجّل طلب فستان سهرة لسلمى الحوراني بـ45 د، تسليمه غداً 4 م',
    startScreen: 'orders',
    steps: [
      '«طلب جديد» ← سلمى الحوراني',
      'المحتوى: فستان سهرة',
      '45',
      '«غداً»',
      'الوقت: «م» + «4» + «00» ← «اعتمد الوقت»',
      '«احفظ الطلب»',
    ],
    expectedErrors: ['الحفظ بلا سعر: يُحفظ «مسودة» ويظهر في «يحتاجك» بالخطوة «أكمل السعر»'],
    condition: (s) =>
      isIn(s, { customer: 'سلمى الحوراني', price: 45_000, dueDate: '2026-11-28', time: '16:00', status: 'confirmed' }) ||
      isIn(s, { customer: 'سلمى الحوراني', price: 45_000, dueDate: '2026-11-28', time: '16:00', status: 'tentative' }),
  },
  {
    id: 'ر3.2',
    role: 'owner',
    sentence: 'اعرف مواعيد الغد',
    startScreen: 'orders',
    steps: ['«التقويم» ← اضغط يوم الغد'],
    expectedErrors: ['يوم بلا عناصر: EmptyState بلا زر'],
    condition: (s) => s.ui.screen === 'ordersCalendar' && s.ui.selectedDate === '2026-11-28',
  },
  {
    id: 'ر3.3',
    role: 'owner',
    sentence: 'سلّم طلب 1175',
    startScreen: 'today',
    steps: ['بطاقة 1175 (بلا زر)', 'الورقة ← «سجّل التسليم»'],
    expectedErrors: ['ضغطتان سريعتان: تُسجَّل مرة واحدة'],
    condition: (s) => s.orders.find((o) => o.id === '1175')?.status === 'delivered',
  },
  {
    id: 'ر4.1',
    role: 'owner',
    sentence: 'اطلب توصيل كرتونتين إلى الزرقاء، حي معصوم، اليوم 4 م',
    startScreen: 'delivery',
    steps: [
      '«اطلب توصيلاً»',
      'من: طبربور ← إلى: الزرقاء، حي معصوم',
      'اليوم 4:00 م',
      'المحتوى: كرتونتان',
      'السائق: عمر الزعبي ← «أرسل الطلب»',
    ],
    condition: (s) =>
      s.deliveries.some(
        (d) =>
          d.id !== 'ت1' && d.id !== 'ت2' && d.id !== 'ت3' && d.id !== 'ت4' &&
          d.to === 'الزرقاء، حي معصوم' &&
          d.driver === 'عمر الزعبي' &&
          d.date === '2026-11-27' &&
          d.time === '16:00' &&
          d.status === 'awaitingQuote',
      ),
  },
  {
    id: 'ر4.2',
    role: 'owner',
    sentence: 'اقبل عرض عمر الزعبي بـ3 د',
    startScreen: 'today',
    steps: ['ت1 في «يحتاجك»', 'الورقة ← العرض الساري 3 د', '«اقبل العرض»'],
    expectedErrors: ['العرض انتهى قبل القبول: «انتهى» بلا أزرار'],
    condition: (s) => {
      const d = s.deliveries.find((x) => x.id === 'ت1');
      return d?.status === 'accepted' && d.quotes.some((q) => q.amount === 3_000 && q.state === 'accepted');
    },
  },
  {
    id: 'ر4.3',
    role: 'driver',
    sentence: 'أكّد تسليم المهمة إلى حي معصوم',
    startScreen: 'myJobs',
    steps: ['مهمة ت3', 'صورة الإثبات', '«أكّد التسليم» (SlideToConfirm)'],
    expectedErrors: ['إفلات قبل 80%: يعود المقبض', 'صورة لم تُرفع: الزر معطّل وسببه «أضف صورة الإثبات أولاً.»'],
    condition: (s) => {
      const d = s.deliveries.find((x) => x.id === 'ت3');
      return d?.status === 'done' && d.evidenceProvided === 'photo';
    },
  },
  {
    id: 'ر4.4',
    role: 'driver',
    alsoOwner: true,
    sentence: 'المستلم لا يرد',
    startScreen: 'myJobs',
    steps: [
      'ت3 ← «لم أستطع التسليم»',
      'السبب والإجراء ← «أرسل للمالك»',
      'يظهر في الشريط «بدّل إلى المالك»',
      'المالك: المقترح ← «وافق»',
    ],
    expectedErrors: ['السائق لا يستطيع إغلاق المهمة وحده (لا زر)'],
    condition: (s) => {
      const d = s.deliveries.find((x) => x.id === 'ت3');
      return d?.status === 'failed' && d.issueClosed === true;
    },
  },
  {
    id: 'ر5.1',
    role: 'guest',
    sentence: 'اعرف سعر الطحين عند مخبز الأصيل',
    startScreen: 'market',
    steps: ['ابحث «طحين»', 'بطاقة العرض ← التفاصيل', '«دخول تجريبي»'],
    expectedErrors: ['إلغاء الدخول: يبقى المحتوى مقفلاً بلا رسالة خطأ'],
    condition: (s) => s.buyer === true && s.ui.openListing === 'ع1',
  },
  {
    id: 'ر5.2',
    role: 'supplier',
    sentence: 'انشر عرض طحين بثلاث شرائح',
    startScreen: 'myListings',
    steps: ['«عرض جديد»', '3 صور', 'الاسم والعبوة', '«شرائح» × 3', '«أرسل للمراجعة»'],
    expectedErrors: ['شريحة «فما فوق» قبل الأخيرة', 'إرسال بلا صورة'],
    condition: (s) =>
      s.listings.some(
        (l) => Number.parseInt(l.id.replace('ع', ''), 10) > 8 && l.status === 'underReview' && (l.tiers?.length ?? 0) === 3,
      ),
  },
  {
    id: 'ر5.3',
    role: 'owner',
    sentence: 'أبلغ عن عرض بسعر مضلل',
    startScreen: 'market',
    steps: ['تفاصيل عرض ع6', 'more ← «أبلغ عن العرض»', 'السبب: «معلومات مضللة»', '«أرسل البلاغ»'],
    condition: (s) => {
      const l = s.listings.find((x) => x.id === 'ع6');
      return (l?.reports?.length ?? 0) === 4 && l?.reports?.[l.reports.length - 1] === 'معلومات مضللة';
    },
  },
  {
    id: 'ر6.1',
    role: 'reviewer',
    sentence: 'اعتمد عرض مقلوبة مطبخ أم خالد',
    startScreen: 'review',
    steps: ['طابور المراجعة ← ع8 (أول عرض للمورد)', 'تأشير 7 بنود', '«أجريت اتصال التحقق مع المورد»', '«اعتمد العرض»'],
    expectedErrors: ['الضغط قبل التأشير: الزر معطّل وسببه مكتوب'],
    condition: (s) => s.listings.find((l) => l.id === 'ع8')?.status === 'approved',
  },
  {
    id: 'ر6.2',
    role: 'reviewer',
    sentence: 'ارفض عرض خبز صاج لأن الصور غير واضحة',
    startScreen: 'review',
    steps: ['ع3 ← «ارفض العرض»', 'السبب: «الصور غير واضحة»', '«أرسل الرفض»'],
    condition: (s) => {
      const l = s.listings.find((x) => x.id === 'ع3');
      return l?.status === 'rejected' && (l?.rejectReason ?? '') !== '';
    },
  },
  {
    id: 'ر6.3',
    role: 'reviewer',
    sentence: 'اعتمد السائق يزن القضاة',
    startScreen: 'drivers',
    steps: ['«السائقون» ← يزن القضاة', '«اعتمد السائق»'],
    condition: (s) => s.drivers.find((d) => d.id === 'yazan')?.status === 'approved',
  },
];

/** «3/17»: the number of tasks with a status (done or skipped). */
export function tasksProgress(statuses: readonly ('done' | 'skipped' | null)[]): number {
  return statuses.filter((x) => x !== null).length;
}

/** The bar's progress label «3/17 · <جملة المهمة>» (§5.4.1). */
export function taskBarLabel(tasks: readonly TaskDef[], current: number | null, statuses: readonly ('done' | 'skipped' | null)[]): string {
  const progress = tasksProgress(statuses);
  if (current === null || !tasks[current]) return 'المهام';
  return `${progress}/17 · ${tasks[current]!.sentence}`;
}
