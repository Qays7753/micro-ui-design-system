/**
 * The §5.1 screen map as DATA: every screen with its name, its pattern, its
 * ordered components (a batch-2 component still unbuilt on design-system
 * carries `later` — its PLACE renders the internal «يُركَّب لاحقًا» marker,
 * never an invented substitute), its data source and its actions. A part may
 * carry `roles` when it renders for some roles only (the guest's shell).
 */
import type { Screen } from '../state/types';
import type { SimRole } from '../data/types';

export interface ScreenPart {
  component: string;
  /** Batch-2 component not yet built — «يُركَّب لاحقًا: <اسم>». */
  later?: boolean;
  note?: string;
  /** Renders for these roles only (e.g. the guest's shell around السوق). */
  roles?: readonly SimRole[];
}

export interface ScreenSpec {
  key: Screen;
  name: string;
  roles: readonly SimRole[];
  pattern: string;
  parts: readonly ScreenPart[];
}

export const SCREEN_SPECS: readonly ScreenSpec[] = [
  // ── المالك ────────────────────────────────────────────────────────────
  {
    key: 'today',
    name: 'مشروع اليوم',
    roles: ['owner'],
    pattern: '10.2 (1)',
    parts: [
      { component: 'PageHeader', note: '«مشروع اليوم» + التاريخ «الجمعة 27/11/2026» caption' },
      { component: 'OrderCard', later: true, note: 'قسم «الآن»: أقرب عنصر بعد ساعة الجهاز اليوم، وتختفي إن لم يوجد' },
      { component: 'OrderCard', later: true, note: 'قسم «يحتاجك»: حتى 3 بترتيب §5.1 الثابت + «الكل»' },
      { component: 'QuoteCard', later: true, note: '«يحتاجك» ت1: عرض سعر ساري' },
      { component: 'DebtCard', later: true, note: '«يحتاجك» د2: دين متأخر' },
      { component: 'Tile ×4', note: 'المالية (Money + الخط الصغير)، الطلبات، التوصيل (نقطة انتباه)، السوق' },
    ],
  },
  {
    key: 'finance',
    name: 'المالية',
    roles: ['owner'],
    pattern: 'م1 §2.7',
    parts: [
      { component: 'PageHeader', note: '«المالية» + «سجّل حركة» (أساسي مضغوط)' },
      { component: 'HeroSurface', note: '«في الصناديق الآن» 595.500 د + الفرق + «من 21 حركة» + الخط الصغير' },
      { component: 'PeriodSwitcher', later: true, note: 'أسبوع' },
      { component: 'Surface + رسم 8.1', note: 'الداخل لكل يوم (الأحد 22 → الجمعة 27)' },
      { component: 'ObjectRow', note: 'قسم «يحتاجك»: المسودة (طباعة) — الصف مكوّن حقيقي' },
      { component: 'DebtCard', later: true, note: 'قسم «يحتاجك»: الديون المتأخرة (د2)' },
      { component: 'FundCard', later: true, note: 'قسم «الصناديق»: الثلاثة (المحفظة سالب، ونقطة المسودة على الدرج)' },
      { component: 'MovementRow', later: true, note: 'قسم «الحركات»: حركات الفترة حتى 5 + «الكل» ← شاشة الحركات' },
      { component: 'TransferRow', later: true, note: 'قسم «الحركات»: التحويل ح21' },
      { component: 'DebtSummary', later: true, note: 'قسم «الديون»: لك 57.500 د من عميلين، وعليك 1,280 د' },
      { component: 'DebtCard', later: true, note: 'قسم «الديون»: د1–د4 + «سجّل دفعة» ← ورقة الدفعة' },
    ],
  },
  {
    key: 'movements',
    name: 'الحركات',
    roles: ['owner'],
    pattern: '10.2 (3)',
    parts: [
      { component: 'PageHeader', note: '«الحركات» + زر رجوع ← المالية' },
      { component: 'SearchField', note: 'بحث الحركات' },
      { component: 'FilterChips', note: 'داخل / خارج / تحويل' },
      { component: 'Section ×المدة', note: 'أقسام زمنية بعناوين مثبتة مع المجاميع' },
      { component: 'MovementRow', later: true, note: 'كل الحركات المحفوظة' },
      { component: 'TransferRow', later: true, note: 'التحويلات' },
    ],
  },
  {
    key: 'orders',
    name: 'الطلبات — القائمة',
    roles: ['owner'],
    pattern: '2.2.5',
    parts: [
      { component: 'PageHeader', note: '«الطلبات» + «طلب جديد» (أساسي مضغوط)' },
      { component: 'SegmentedControl', note: '«القائمة» / «التقويم»' },
      { component: 'FilterChips', note: 'الحالات (القائمة)' },
      { component: 'OrderCard', later: true, note: '«يحتاجك»: يحتاج مراجعة ← جاهز ← تم التسليم ← مسودة' },
      { component: 'ObjectRow', note: '«الجارية»: صفوف بعلامة العميل والمحتوى والموعد والشارة' },
      { component: 'Disclosure', later: true, note: '«السجل»: تمت التسوية وملغى' },
    ],
  },
  {
    key: 'ordersCalendar',
    name: 'الطلبات — التقويم',
    roles: ['owner'],
    pattern: '2.2.5',
    parts: [
      { component: 'PageHeader', note: '«الطلبات» + «طلب جديد» (أساسي مضغوط)' },
      { component: 'SegmentedControl', note: '«القائمة» / «التقويم»' },
      { component: 'PeriodSwitcher', later: true, note: 'أسبوع: 22/11 – 28/11' },
      { component: 'WeekStrip', later: true, note: 'الأسبوع بنقاط عنصره (الخميس 1، الجمعة 2، السبت 2)' },
      { component: 'DayTimeline', later: true, note: 'يوم فيه موعد بمدة (28/11 طلب 1192: 10:00 ص · 30 دقيقة)' },
      { component: 'AgendaList', later: true, note: 'بقية الأيام' },
    ],
  },
  {
    key: 'delivery',
    name: 'التوصيل',
    roles: ['owner'],
    pattern: 'م1 §4.10',
    parts: [
      { component: 'PageHeader', note: '«التوصيل» + «اطلب توصيلاً» (أساسي مضغوط)' },
      { component: 'DeliveryRequestCard', later: true, note: 'قسم «يحتاجك»: ت1 (عرض سارٍ 3 د ينتهي بعد ساعتين)' },
      { component: 'DriverJobCard', later: true, note: 'قسم «الجارية»: ت3 قيد التنفيذ' },
      { component: 'Disclosure', later: true, note: '«السجل»: ت2 تمّ' },
    ],
  },
  // ── السائق ─────────────────────────────────────────────────────────────
  {
    key: 'driverOrders',
    name: 'التوصيل — الطلبات',
    roles: ['driver'],
    pattern: 'م1 §4.10',
    parts: [
      { component: 'PageHeader', note: '«التوصيل»' },
      { component: 'SegmentedControl', note: '«الطلبات» / «مهامي»' },
      { component: 'DriverJobCard', later: true, note: 'ت4 (بانتظار عرضه) وت1 (عرضه بانتظار المالك: «بانتظار قرار المالك»)' },
    ],
  },
  {
    key: 'myJobs',
    name: 'التوصيل — مهامي',
    roles: ['driver'],
    pattern: 'م1 §4.10',
    parts: [
      { component: 'PageHeader', note: '«التوصيل»' },
      { component: 'SegmentedControl', note: '«الطلبات» / «مهامي»' },
      { component: 'DriverJobCard', later: true, note: 'ت3 قيد التنفيذ (الإثبات المطلوب: صورة)' },
      { component: 'Disclosure', later: true, note: '«السجل»: ت2 تمّ' },
    ],
  },
  // ── المورد ─────────────────────────────────────────────────────────────
  {
    key: 'myListings',
    name: 'عروضي',
    roles: ['supplier'],
    pattern: 'م1 §5.8',
    parts: [
      { component: 'PageHeader', note: '«عروضي» + «عرض جديد» (أساسي مضغوط)' },
      { component: 'SegmentedControl', note: '«عروضي» / «السوق»' },
      { component: 'ObjectRow', note: 'صفوف عروضه (ع1 ع2 ع3 ع4 ع5)' },
      { component: 'ListingStatusBadge', later: true, note: 'نهاية كل صف: معتمد/قيد المراجعة/مرفوض/تعديل قيد المراجعة' },
      { component: 'ListingEditor', later: true, note: '«عدّل العرض»' },
    ],
  },
  // ── المراجع ────────────────────────────────────────────────────────────
  {
    key: 'review',
    name: 'المراجعة',
    roles: ['reviewer'],
    pattern: 'م1 §6.5',
    parts: [
      { component: 'PageHeader', note: '«المراجعة»' },
      { component: 'ReviewQueueItem', later: true, note: 'طابور: ع3 (5 ساعات) ثم ع8 (3 ساعات، أول عرض)' },
      { component: 'DecisionCard', later: true, note: 'ع8: تأشير 7 بنود + «أجريت اتصال التحقق» ← «اعتمد العرض»' },
      { component: 'ReviewQueueItem', later: true, note: 'تعديل ع4 (منذ ساعة)' },
      { component: 'DecisionCard', later: true, note: 'ع3: «ارفض العرض» + السبب' },
    ],
  },
  {
    key: 'reports',
    name: 'البلاغات',
    roles: ['reviewer'],
    pattern: 'م1 §6.5',
    parts: [
      { component: 'PageHeader', note: '«البلاغات»' },
      { component: 'ReportItem', later: true, note: 'ع6 (3 بلاغات)' },
      { component: 'DecisionCard', later: true, note: '«أبقِ العرض» / «أوقف العرض»' },
    ],
  },
  {
    key: 'drivers',
    name: 'السائقون',
    roles: ['reviewer'],
    pattern: 'م1 §6.5',
    parts: [
      { component: 'PageHeader', note: '«السائقون»' },
      { component: 'ReviewQueueItem', later: true, note: 'يزن القضاة (منذ يومين)' },
      { component: 'DriverApprovalCard', later: true, note: 'الحقول والمرفقات (2.12) ← «اعتمد السائق»' },
    ],
  },
  // ── السوق (المالك والمورد تبويبًا، والزائر كله) ──────────────────────────
  {
    key: 'market',
    name: 'السوق',
    roles: ['owner', 'supplier', 'guest'],
    pattern: 'م1 §5.8',
    parts: [
      { component: 'GuestShell', later: true, roles: ['guest'], note: 'شريط علوي: الشعار + مكان الدخول (SA7هـ)' },
      { component: 'PageHeader', roles: ['owner', 'supplier'], note: '«السوق»' },
      { component: 'SearchField', note: '«ابحث في السوق»' },
      { component: 'FilterChips', note: 'التصنيفات من بيانات العروض' },
      { component: 'ListingCard', later: true, note: 'شبكة العروض الظاهرة الخمسة (ع1 ع2 ع4 ع6 ع7)' },
      { component: 'Gallery', later: true, note: 'عارض الصور (م1 §1.2) — من تفاصيل العرض' },
      { component: 'ReportSheet', later: true, note: 'البلاغ من more' },
      { component: 'GoogleSignInSlot', later: true, roles: ['guest'], note: 'مكان «دخول تجريبي» (الزر ثانوي، ليس شكل Google)' },
    ],
  },
];

/** The screens of one role in tab/visit order. */
export function specsOfRole(role: SimRole): ScreenSpec[] {
  return SCREEN_SPECS.filter((s) => s.roles.includes(role));
}

/** Every part marked «يُركَّب لاحقًا» — SA.end's full list. */
export function laterParts(): Array<{ screen: string; component: string; note?: string }> {
  const out: Array<{ screen: string; component: string; note?: string }> = [];
  for (const spec of SCREEN_SPECS) {
    for (const part of spec.parts) {
      if (part.later) out.push({ screen: spec.name, component: part.component, note: part.note });
    }
  }
  return out;
}
