/**
 * The simulation's own texts (PLAN-SIM: «نصوص المحاكاة الخاصة … في
 * ds/sim/texts.ts بالعربي، بحدود كلمات القسم 24.1 من الموجز»).
 *
 * Library-owned words come from the library dictionary (`ar`/`t`); only the
 * strings the specs assign to the simulation screens live here. Screen names
 * and section titles are names (≤ 4 words), buttons are imperative + object
 * (≤ 3 words), success is past passive — 24.1.
 */

/** §5.1 screen names (the §5.1 tables verbatim). */
export const SCREEN_NAMES = {
  today: 'مشروع اليوم',
  finance: 'المالية',
  orders: 'الطلبات',
  ordersCalendar: 'الطلبات — التقويم',
  delivery: 'التوصيل',
  driverOrders: 'التوصيل — الطلبات',
  myJobs: 'التوصيل — مهامي',
  market: 'السوق',
  myListings: 'عروضي',
  review: 'المراجعة',
  reports: 'البلاغات',
  drivers: 'السائقون',
} as const;

/** Section titles (10.2 / §5.1). */
export const SECTIONS = {
  now: 'الآن',
  needsYou: 'يحتاجك',
  funds: 'الصناديق',
  movements: 'الحركات',
  debts: 'الديون',
  running: 'الجارية',
  log: 'السجل',
  list: 'القائمة',
  calendar: 'التقويم',
  myOrders: 'الطلبات',
  myJobs: 'مهامي',
  myListings: 'عروضي',
  market: 'السوق',
} as const;

/** Sheet titles (the §5.1 actions' destinations). */
export const SHEETS = {
  project: 'تبديل المشروع',
  notifications: 'الإشعارات',
  ask: 'Ask Micro',
  needsYouAll: 'كل ما يحتاجك',
  movement: 'سجّل حركة',
  newOrder: 'طلب جديد',
  newDelivery: 'اطلب توصيلاً',
  newListing: 'عرض جديد',
  report: 'أبلغ عن العرض',
} as const;

/** The fixed simulation date line under the اليوم header (10.2 (1)). */
export const TODAY_LINE = 'الجمعة 27/11/2026';

/** The sim market search placeholder («ابحث في السوق»). */
export const MARKET_SEARCH = 'ابحث في السوق';

/** The «الكل» chip label (§2.2.5). */
export const ALL = 'الكل';

/** Order-list filter chips (§2.2.5 item 4): الكل، يحتاجك، الجارية، السجل. */
export const ORDER_FILTERS = [
  { value: 'all', label: 'الكل' },
  { value: 'needsYou', label: 'يحتاجك' },
  { value: 'running', label: 'الجارية' },
  { value: 'log', label: 'السجل' },
] as const;

/** The finance hero (§5.1 البلاطات + HeroSurface المالية). */
export const FINANCE_HERO = {
  label: 'في الصناديق الآن',
  higher: (percent: string) => `${percent} أعلى من أمس`,
  lower: (percent: string) => `${percent} أدنى من أمس`,
  higherHidden: 'أعلى من أمس',
  lowerHidden: 'أدنى من أمس',
  source: (counted: string) => `من ${counted}`,
  /** 24.8 counted forms for «حركة». */
  counted: { zero: 'لا حركات', one: 'حركة واحدة', two: 'حركتان', few: 'حركات', many: 'حركة' },
} as const;

/** The needs-you reasons (§5.1 ترتيب «يحتاجك» في «مشروع اليوم»). */
export const NEEDS_YOU_REASONS = {
  quote: 'عروض أسعار سارية',
  needsReview: 'طلبات «يحتاج مراجعة»',
  overdueDebt: 'ديون متأخرة',
  negativeFund: 'صناديق برصيد سالب',
  ready: 'طلبات «جاهز»',
  delivered: 'طلبات «تم التسليم»',
  proposal: 'مقترحات تعذّر',
  draft: 'مسودات',
} as const;
