/**
 * ar.ts — the Arabic dictionary for the whole batch-1 library (plan D9,
 * BRIEF section 24). Every user-visible string in the library comes from here;
 * no component or lib file may contain Arabic text (BRIEF 16.20, 24.4).
 *
 * Entry shape: `{ kind, text }`. `kind` drives the copy gate (plan section 8-و)
 * word limits; `text` may contain `{param}` placeholders resolved by `t()`.
 *
 * Classification notes (documented deviations from the plan's kind table —
 * brief-verbatim sentences win over the heuristic, per plan 8-و):
 * - `banner.backOnline` / `banner.permission` / `confirm.deleteResult` /
 *   `metric.*` delta and `metric.updatedAt` are short informational sentences
 *   mandated verbatim by the brief; they use `help` (≤ 8 words), which fits.
 * - `banner.offline`, `sr.saveFailed` and `errorState.loadFailed` are
 *   what-happened + what-to-do sentences -> `error` (≤ 12 words).
 * - Money fragments (unit, debt words, missing dash) render inline next to
 *   numbers -> `badge`; aria-only words -> `screen-reader`.
 * - `saveState.failed` is a full failed-save sentence -> `error`.
 *
 * Word counts follow BRIEF 24: buttons ≤ 3 words (verb + object, imperative),
 * no exclamation marks, Arabic punctuation (، ؛ ؟ « » … —), Western digits,
 * and the fixed lexicon of 24.3.
 */

/** Copy kinds understood by the ds-copy gate (plan section 8-و). */
import type { PluralForms } from './plural';
import type { MoneyAriaTexts } from '../lib/format-money';

export type TextKind =
  | 'button'
  | 'title'
  | 'badge'
  | 'success'
  | 'error'
  | 'empty'
  | 'help'
  | 'placeholder'
  | 'screen-reader';

export interface TextEntry {
  readonly kind: TextKind;
  readonly text: string;
}

export const ar = {
  // --- Buttons and links (BRIEF 24.1: verb + object, ≤ 3 words) ---
  'button.saveMovement': { kind: 'button', text: 'احفظ الحركة' },
  'button.acceptQuote': { kind: 'button', text: 'اقبل العرض' },
  'button.recordPayment': { kind: 'button', text: 'سجّل دفعة' },
  'button.deleteMovement': { kind: 'button', text: 'احذف الحركة' },
  'button.back': { kind: 'button', text: 'رجوع' },
  'button.retry': { kind: 'button', text: 'أعد المحاولة' },
  'button.recordMovement': { kind: 'button', text: 'سجّل حركة' },
  'button.reviewAndSave': { kind: 'button', text: 'راجع واحفظ' },
  'button.all': { kind: 'button', text: 'الكل' },
  'button.undo': { kind: 'button', text: 'تراجع' },
  'button.howCalculated': { kind: 'button', text: 'كيف حُسبت؟' },
  'button.hideAmounts': { kind: 'button', text: 'إخفاء المبالغ' },
  'button.showAmounts': { kind: 'button', text: 'إظهار المبالغ' },
  'metric.sourceFrom': { kind: 'button', text: 'من {counted}' },

  // --- Titles (BRIEF 24: ≤ 3 words) ---
  'title.today': { kind: 'title', text: 'اليوم' },
  'title.needsYou': { kind: 'title', text: 'يحتاجك' },
  'title.now': { kind: 'title', text: 'الآن' },
  'confirm.deleteTitle': { kind: 'title', text: 'تحذف حركة {amount}؟' },

  // --- Badges: status words, nav labels, roles, movement types (≤ 2 words) ---
  'badge.done': { kind: 'badge', text: 'تمّ' },
  'badge.waiting': { kind: 'badge', text: 'ينتظر' },
  'badge.problem': { kind: 'badge', text: 'مشكلة' },
  'badge.info': { kind: 'badge', text: 'معلومة' },
  'badge.neutral': { kind: 'badge', text: 'محايد' },
  'badge.cancelled': { kind: 'badge', text: 'ملغى' },
  'nav.today': { kind: 'badge', text: 'اليوم' },
  'nav.todayLong': { kind: 'badge', text: 'مشروع اليوم' },
  'nav.finance': { kind: 'badge', text: 'المالية' },
  'nav.orders': { kind: 'badge', text: 'الطلبات' },
  'nav.delivery': { kind: 'badge', text: 'التوصيل' },
  'nav.market': { kind: 'badge', text: 'السوق' },
  'role.owner': { kind: 'badge', text: 'مالك' },
  'role.supplier': { kind: 'badge', text: 'مورد' },
  'role.driver': { kind: 'badge', text: 'سائق' },
  'role.reviewer': { kind: 'badge', text: 'مراجع' },
  'role.admin': { kind: 'badge', text: 'مسؤول' },
  'movement.in': { kind: 'badge', text: 'داخل' },
  'movement.out': { kind: 'badge', text: 'خارج' },
  'movement.transfer': { kind: 'badge', text: 'تحويل' },

  // --- SaveState (BRIEF 9.5, 11.1 — the four states, verbatim) ---
  'saveState.draft': { kind: 'badge', text: 'مسودة · لم تُحفظ' },
  'saveState.sending': { kind: 'badge', text: 'يُرسل…' },
  'saveState.saved': { kind: 'badge', text: 'حُفظ' },
  'saveState.failed': { kind: 'error', text: 'لم يُحفظ — أعد المحاولة' },

  // --- Success toasts (BRIEF 24.4: passive past + object, ≤ 5 words) ---
  'toast.movementSaved': { kind: 'success', text: 'حُفظت الحركة' },
  'toast.movementDeleted': { kind: 'success', text: 'حُذفت الحركة' },
  'toast.quoteAccepted': { kind: 'success', text: 'قُبل العرض' },

  // --- InlineBanner / ErrorState (BRIEF 9.5, 11.3, 24.5) ---
  'banner.offline': { kind: 'error', text: 'الاتصال انقطع' },
  'banner.backOnline': { kind: 'help', text: 'عاد الاتصال، لديك مسودة' },
  'banner.permission': { kind: 'help', text: 'هذا خارج صلاحياتك في هذا المشروع' },
  'errorState.loadFailed': { kind: 'error', text: 'تعذّر تحميل البيانات. أعد المحاولة.' },
  'errorState.updatedAt': { kind: 'help', text: 'آخر تحديث {time}' },

  // --- EmptyState (BRIEF 23.7, 24.6) ---
  'empty.movements': { kind: 'empty', text: 'حركات اليوم تظهر هنا.' },

  // --- ConfirmSheet result sentence (BRIEF 24.3) ---
  'confirm.deleteResult': { kind: 'help', text: 'لن تظهر في رصيد {fund}.' },

  // --- Metric delta lines (BRIEF 23.8 + 23.22 hidden form) ---
  'metric.deltaHigher': { kind: 'help', text: '{percent} أعلى من أمس' },
  'metric.deltaLower': { kind: 'help', text: '{percent} أقل من أمس' },
  'metric.deltaHigherHidden': { kind: 'help', text: 'أعلى من أمس' },
  'metric.deltaLowerHidden': { kind: 'help', text: 'أقل من أمس' },

  // --- Money fragments (BRIEF 8; display fragments -> badge) ---
  'money.unit': { kind: 'badge', text: 'د.أ' },
  'money.forYou': { kind: 'badge', text: 'لك' },
  'money.againstYou': { kind: 'badge', text: 'عليك' },
  'money.missing': { kind: 'badge', text: '—' },
  'money.hiddenGlyph': { kind: 'badge', text: '••••' },

  // --- Lab chrome and state names (plan K27/K32: the lab shows component and
  //     state names only; every word lives here, not in lab source) ---
  'lab.stamp': { kind: 'title', text: 'مختبر الدفعة الأولى' },
  'lab.fontScale': { kind: 'badge', text: 'حجم الخط' },
  'lab.scale100': { kind: 'button', text: '100%' },
  'lab.scale200': { kind: 'button', text: '200%' },
  'title.money': { kind: 'title', text: 'المبلغ' },
  'title.amountToggle': { kind: 'title', text: 'إخفاء المبالغ وإظهارها' },
  'state.driver': { kind: 'badge', text: 'وضع السائق' },
  'state.default': { kind: 'badge', text: 'افتراضي' },
  'state.debt': { kind: 'badge', text: 'دين' },
  'state.hidden': { kind: 'badge', text: 'مخفي' },
  'state.missing': { kind: 'badge', text: 'مفقود' },
  'state.loading': { kind: 'badge', text: 'تحميل' },
  'state.disabled': { kind: 'badge', text: 'معطّل' },
  'state.longest': { kind: 'badge', text: 'أطول قيمة' },
  'state.sizes': { kind: 'badge', text: 'المقاسات' },
  'state.tabular': { kind: 'badge', text: 'أرقام جدولية' },

  // --- Money aria words (BRIEF 23.17; assembled in lib/format-money.ts) ---
  'money.ariaMinus': { kind: 'screen-reader', text: 'سالب' },
  'money.ariaDinar': { kind: 'screen-reader', text: 'دينار' },
  'money.ariaFils': { kind: 'screen-reader', text: 'فلس' },
  'money.ariaAnd': { kind: 'screen-reader', text: 'و' },
  'money.ariaHidden': { kind: 'screen-reader', text: 'المبلغ مخفي' },
  'money.ariaMissing': { kind: 'screen-reader', text: 'القيمة غير متوفرة' },

  // --- Screen-reader announcements (BRIEF 23.17, verbatim where quoted) ---
  'sr.notificationsCount': { kind: 'screen-reader', text: 'الإشعارات، {counted}' },
  'sr.askUnread': { kind: 'screen-reader', text: 'Ask Micro، جواب غير مقروء' },
  'sr.financeNeedsYou': { kind: 'screen-reader', text: 'المالية، يحتاجك' },
  'sr.askThinking': { kind: 'screen-reader', text: 'يعمل Micro على الجواب' },
  'sr.askAnswered': { kind: 'screen-reader', text: 'وصل الجواب' },
  'sr.quoteArrived': { kind: 'screen-reader', text: 'وصل عرض سعر من {name}' },
  'sr.searchResults': { kind: 'screen-reader', text: '{counted}' },
  'sr.ask': { kind: 'screen-reader', text: 'Ask Micro' },
  'sr.close': { kind: 'screen-reader', text: 'إغلاق' },
  'sr.more': { kind: 'screen-reader', text: 'المزيد' },
  'sr.search': { kind: 'screen-reader', text: 'بحث' },
  'sr.clear': { kind: 'screen-reader', text: 'مسح' },
  'sr.saveFailed': { kind: 'error', text: 'لم تُحفظ الحركة. الاتصال انقطع.' },

  // --- Field placeholder, format only (BRIEF 23.24(10)) ---
  'placeholder.phone': { kind: 'placeholder', text: '07X XXX XXXX' },
} as const;

export type ArKey = keyof typeof ar;

/**
 * Resolve a dictionary entry with `{param}` interpolation.
 * Unknown params are left as-is; missing params throw nothing (defensive —
 * the copy gate checks completeness separately).
 */
export function t(key: ArKey, params?: Record<string, string | number>): string {
  let text: string = ar[key].text;
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

// ---------------------------------------------------------------------------
// Plural noun forms — morphology data for pluralAr() (BRIEF 24.8), not UI
// strings: pluralAr() itself prepends the number for few/many/other.
// 'movements' uses the genitive dual (حركتين) because it follows «من» in
// the source link; standalone announcements use the 24.8 nominative forms.
// ---------------------------------------------------------------------------

export const pluralNouns = {
  movements: { zero: 'لا حركات', one: 'حركة واحدة', two: 'حركتين', few: 'حركات', many: 'حركة' },
  orders: { zero: 'لا طلبات', one: 'طلب واحد', two: 'طلتان', few: 'طلبات', many: 'طلب' },
  quotes: { zero: 'لا عروض', one: 'عرض واحد', two: 'عرضان', few: 'عروض', many: 'عرض' },
  results: { zero: 'لا نتائج', one: 'نتيجة واحدة', two: 'نتيجتان', few: 'نتائج', many: 'نتيجة' },
  unread: { zero: 'لا شيء غير مقروء', one: 'غير مقروء واحد', two: 'غير مقروءان', few: 'غير مقروءة', many: 'غير مقروءة' },
} as const satisfies Record<string, PluralForms>;

export type PluralNoun = keyof typeof pluralNouns;

// ---------------------------------------------------------------------------
// Money aria texts — bound into lib/format-money.ts by callers (the lib itself
// stays free of Arabic; BRIEF 8 + 23.17 wording).
// ---------------------------------------------------------------------------

export const moneyTexts: MoneyAriaTexts = {
  unit: ar['money.unit'].text,
  minus: ar['money.ariaMinus'].text,
  dinar: ar['money.ariaDinar'].text,
  fils: ar['money.ariaFils'].text,
  and: ar['money.ariaAnd'].text,
  forYou: ar['money.forYou'].text,
  againstYou: ar['money.againstYou'].text,
  hidden: ar['money.ariaHidden'].text,
  missing: ar['money.ariaMissing'].text,
  hiddenGlyph: ar['money.hiddenGlyph'].text,
  missingGlyph: ar['money.missing'].text,
};
