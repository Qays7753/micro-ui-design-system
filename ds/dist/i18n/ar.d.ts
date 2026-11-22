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
import type { MoneyAriaTexts } from '../lib/format-money';
export type TextKind = 'button' | 'title' | 'badge' | 'success' | 'error' | 'empty' | 'help' | 'placeholder' | 'screen-reader';
export interface TextEntry {
    readonly kind: TextKind;
    readonly text: string;
}
export declare const ar: {
    readonly 'button.saveMovement': {
        readonly kind: "button";
        readonly text: "احفظ الحركة";
    };
    readonly 'button.acceptQuote': {
        readonly kind: "button";
        readonly text: "اقبل العرض";
    };
    readonly 'button.recordPayment': {
        readonly kind: "button";
        readonly text: "سجّل دفعة";
    };
    readonly 'button.deleteMovement': {
        readonly kind: "button";
        readonly text: "احذف الحركة";
    };
    readonly 'button.back': {
        readonly kind: "button";
        readonly text: "رجوع";
    };
    readonly 'button.retry': {
        readonly kind: "button";
        readonly text: "أعد المحاولة";
    };
    readonly 'button.recordMovement': {
        readonly kind: "button";
        readonly text: "سجّل حركة";
    };
    readonly 'button.reviewAndSave': {
        readonly kind: "button";
        readonly text: "راجع واحفظ";
    };
    readonly 'button.all': {
        readonly kind: "button";
        readonly text: "الكل";
    };
    readonly 'button.undo': {
        readonly kind: "button";
        readonly text: "تراجع";
    };
    readonly 'button.howCalculated': {
        readonly kind: "button";
        readonly text: "كيف حُسبت؟";
    };
    readonly 'button.hideAmounts': {
        readonly kind: "button";
        readonly text: "إخفاء المبالغ";
    };
    readonly 'button.showAmounts': {
        readonly kind: "button";
        readonly text: "إظهار المبالغ";
    };
    readonly 'metric.sourceFrom': {
        readonly kind: "button";
        readonly text: "من {counted}";
    };
    readonly 'title.today': {
        readonly kind: "title";
        readonly text: "اليوم";
    };
    readonly 'title.needsYou': {
        readonly kind: "title";
        readonly text: "يحتاجك";
    };
    readonly 'title.now': {
        readonly kind: "title";
        readonly text: "الآن";
    };
    readonly 'confirm.deleteTitle': {
        readonly kind: "title";
        readonly text: "تحذف حركة {amount}؟";
    };
    readonly 'badge.done': {
        readonly kind: "badge";
        readonly text: "تمّ";
    };
    readonly 'badge.waiting': {
        readonly kind: "badge";
        readonly text: "ينتظر";
    };
    readonly 'badge.problem': {
        readonly kind: "badge";
        readonly text: "مشكلة";
    };
    readonly 'badge.info': {
        readonly kind: "badge";
        readonly text: "معلومة";
    };
    readonly 'badge.neutral': {
        readonly kind: "badge";
        readonly text: "محايد";
    };
    readonly 'badge.cancelled': {
        readonly kind: "badge";
        readonly text: "ملغى";
    };
    readonly 'nav.today': {
        readonly kind: "badge";
        readonly text: "اليوم";
    };
    readonly 'nav.todayLong': {
        readonly kind: "badge";
        readonly text: "مشروع اليوم";
    };
    readonly 'nav.finance': {
        readonly kind: "badge";
        readonly text: "المالية";
    };
    readonly 'nav.orders': {
        readonly kind: "badge";
        readonly text: "الطلبات";
    };
    readonly 'nav.delivery': {
        readonly kind: "badge";
        readonly text: "التوصيل";
    };
    readonly 'nav.market': {
        readonly kind: "badge";
        readonly text: "السوق";
    };
    readonly 'role.owner': {
        readonly kind: "badge";
        readonly text: "مالك";
    };
    readonly 'role.supplier': {
        readonly kind: "badge";
        readonly text: "مورد";
    };
    readonly 'role.driver': {
        readonly kind: "badge";
        readonly text: "سائق";
    };
    readonly 'role.reviewer': {
        readonly kind: "badge";
        readonly text: "مراجع";
    };
    readonly 'role.admin': {
        readonly kind: "badge";
        readonly text: "مسؤول";
    };
    readonly 'movement.in': {
        readonly kind: "badge";
        readonly text: "داخل";
    };
    readonly 'movement.out': {
        readonly kind: "badge";
        readonly text: "خارج";
    };
    readonly 'movement.transfer': {
        readonly kind: "badge";
        readonly text: "تحويل";
    };
    readonly 'saveState.draft': {
        readonly kind: "badge";
        readonly text: "مسودة · لم تُحفظ";
    };
    readonly 'saveState.sending': {
        readonly kind: "badge";
        readonly text: "يُرسل…";
    };
    readonly 'saveState.saved': {
        readonly kind: "badge";
        readonly text: "حُفظ";
    };
    readonly 'saveState.failed': {
        readonly kind: "error";
        readonly text: "لم يُحفظ — أعد المحاولة";
    };
    readonly 'toast.movementSaved': {
        readonly kind: "success";
        readonly text: "حُفظت الحركة";
    };
    readonly 'toast.movementDeleted': {
        readonly kind: "success";
        readonly text: "حُذفت الحركة";
    };
    readonly 'toast.quoteAccepted': {
        readonly kind: "success";
        readonly text: "قُبل العرض";
    };
    readonly 'banner.offline': {
        readonly kind: "error";
        readonly text: "الاتصال انقطع";
    };
    readonly 'banner.backOnline': {
        readonly kind: "help";
        readonly text: "عاد الاتصال، لديك مسودة";
    };
    readonly 'banner.permission': {
        readonly kind: "help";
        readonly text: "هذا خارج صلاحياتك في هذا المشروع";
    };
    readonly 'errorState.loadFailed': {
        readonly kind: "error";
        readonly text: "تعذّر تحميل البيانات. أعد المحاولة.";
    };
    readonly 'errorState.updatedAt': {
        readonly kind: "help";
        readonly text: "آخر تحديث {time}";
    };
    readonly 'empty.movements': {
        readonly kind: "empty";
        readonly text: "حركات اليوم تظهر هنا.";
    };
    readonly 'confirm.deleteResult': {
        readonly kind: "help";
        readonly text: "لن تظهر في رصيد {fund}.";
    };
    readonly 'metric.deltaHigher': {
        readonly kind: "help";
        readonly text: "{percent} أعلى من أمس";
    };
    readonly 'metric.deltaLower': {
        readonly kind: "help";
        readonly text: "{percent} أقل من أمس";
    };
    readonly 'metric.deltaHigherHidden': {
        readonly kind: "help";
        readonly text: "أعلى من أمس";
    };
    readonly 'metric.deltaLowerHidden': {
        readonly kind: "help";
        readonly text: "أقل من أمس";
    };
    readonly 'money.unit': {
        readonly kind: "badge";
        readonly text: "د.أ";
    };
    readonly 'money.forYou': {
        readonly kind: "badge";
        readonly text: "لك";
    };
    readonly 'money.againstYou': {
        readonly kind: "badge";
        readonly text: "عليك";
    };
    readonly 'money.missing': {
        readonly kind: "badge";
        readonly text: "—";
    };
    readonly 'money.hiddenGlyph': {
        readonly kind: "badge";
        readonly text: "••••";
    };
    readonly 'money.ariaMinus': {
        readonly kind: "screen-reader";
        readonly text: "سالب";
    };
    readonly 'money.ariaDinar': {
        readonly kind: "screen-reader";
        readonly text: "دينار";
    };
    readonly 'money.ariaFils': {
        readonly kind: "screen-reader";
        readonly text: "فلس";
    };
    readonly 'money.ariaAnd': {
        readonly kind: "screen-reader";
        readonly text: "و";
    };
    readonly 'money.ariaHidden': {
        readonly kind: "screen-reader";
        readonly text: "المبلغ مخفي";
    };
    readonly 'money.ariaMissing': {
        readonly kind: "screen-reader";
        readonly text: "القيمة غير متوفرة";
    };
    readonly 'sr.notificationsCount': {
        readonly kind: "screen-reader";
        readonly text: "الإشعارات، {counted}";
    };
    readonly 'sr.askUnread': {
        readonly kind: "screen-reader";
        readonly text: "Ask Micro، جواب غير مقروء";
    };
    readonly 'sr.financeNeedsYou': {
        readonly kind: "screen-reader";
        readonly text: "المالية، يحتاجك";
    };
    readonly 'sr.askThinking': {
        readonly kind: "screen-reader";
        readonly text: "يعمل Micro على الجواب";
    };
    readonly 'sr.askAnswered': {
        readonly kind: "screen-reader";
        readonly text: "وصل الجواب";
    };
    readonly 'sr.quoteArrived': {
        readonly kind: "screen-reader";
        readonly text: "وصل عرض سعر من {name}";
    };
    readonly 'sr.searchResults': {
        readonly kind: "screen-reader";
        readonly text: "{counted}";
    };
    readonly 'sr.ask': {
        readonly kind: "screen-reader";
        readonly text: "Ask Micro";
    };
    readonly 'sr.close': {
        readonly kind: "screen-reader";
        readonly text: "إغلاق";
    };
    readonly 'sr.more': {
        readonly kind: "screen-reader";
        readonly text: "المزيد";
    };
    readonly 'sr.search': {
        readonly kind: "screen-reader";
        readonly text: "بحث";
    };
    readonly 'sr.clear': {
        readonly kind: "screen-reader";
        readonly text: "مسح";
    };
    readonly 'sr.saveFailed': {
        readonly kind: "error";
        readonly text: "لم تُحفظ الحركة. الاتصال انقطع.";
    };
    readonly 'placeholder.phone': {
        readonly kind: "placeholder";
        readonly text: "07X XXX XXXX";
    };
};
export type ArKey = keyof typeof ar;
/**
 * Resolve a dictionary entry with `{param}` interpolation.
 * Unknown params are left as-is; missing params throw nothing (defensive —
 * the copy gate checks completeness separately).
 */
export declare function t(key: ArKey, params?: Record<string, string | number>): string;
export declare const pluralNouns: {
    readonly movements: {
        readonly zero: "لا حركات";
        readonly one: "حركة واحدة";
        readonly two: "حركتين";
        readonly few: "حركات";
        readonly many: "حركة";
    };
    readonly orders: {
        readonly zero: "لا طلبات";
        readonly one: "طلب واحد";
        readonly two: "طلتان";
        readonly few: "طلبات";
        readonly many: "طلب";
    };
    readonly quotes: {
        readonly zero: "لا عروض";
        readonly one: "عرض واحد";
        readonly two: "عرضان";
        readonly few: "عروض";
        readonly many: "عرض";
    };
    readonly results: {
        readonly zero: "لا نتائج";
        readonly one: "نتيجة واحدة";
        readonly two: "نتيجتان";
        readonly few: "نتائج";
        readonly many: "نتيجة";
    };
    readonly unread: {
        readonly zero: "لا شيء غير مقروء";
        readonly one: "غير مقروء واحد";
        readonly two: "غير مقروءان";
        readonly few: "غير مقروءة";
        readonly many: "غير مقروءة";
    };
};
export type PluralNoun = keyof typeof pluralNouns;
export declare const moneyTexts: MoneyAriaTexts;
