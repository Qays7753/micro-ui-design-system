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
  'nav.agenda': { kind: 'badge', text: 'الأجندة' },
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
  'movement.counted': { kind: 'badge', text: '32 حركة' },
  'row.sampleTitle': { kind: 'title', text: 'سلمى الحوراني' },
  'sheet.sampleTitle': { kind: 'title', text: 'تفاصيل الحركة' },
  // Lab demo sheets (2.1): every pressable opens its real sample sheet
  'sheet.projectTitle': { kind: 'title', text: 'تبديل المشروع' },
  'sheet.notificationsTitle': { kind: 'title', text: 'الإشعارات' },
  'sheet.askTitle': { kind: 'title', text: 'Ask Micro' },
  'sheet.sourceTitle': { kind: 'title', text: 'مصدر الرقم' },
  'sheet.allTitle': { kind: 'title', text: 'كل ما يحتاجك' },
  'sheet.objectTitle': { kind: 'title', text: 'طلب 1175' },
  'notif.quoteArrived': { kind: 'help', text: 'وصل عرض سعر من عمر الزعبي' },
  'notif.orderToday': { kind: 'help', text: 'طلب 1203 موعده اليوم 4:00 م' },
  'notif.paymentIn': { kind: 'help', text: 'دفعة 30 د من رنا العبادي' },
  'notif.timeAgo': { kind: 'help', text: 'قبل 5 دقائق' },
  'notif.timeToday': { kind: 'badge', text: '9:15 ص' },
  'notif.timeYesterday': { kind: 'help', text: 'أمس 5:10 م' },
  'ask.placeholder': { kind: 'placeholder', text: 'اسأل Micro' },
  'ask.amountLabel': { kind: 'badge', text: 'السؤال' },
  'button.askSend': { kind: 'button', text: 'أرسل' },
  'kv.orderTitle': { kind: 'badge', text: 'الطلب' },
  'kv.customer': { kind: 'badge', text: 'العميل' },
  'kv.delivery': { kind: 'badge', text: 'التسليم' },
  'kv.phone': { kind: 'badge', text: 'الهاتف' },
  'title.sheet': { kind: 'title', text: 'الورقة' },
  'confirm.sampleTitle': { kind: 'title', text: 'حذف الحركة؟' },
  'confirm.sampleSentence': { kind: 'help', text: 'ستُحذف الحركة نهائياً ولا يمكن التراجع عنها.' },
  'title.confirmSheet': { kind: 'title', text: 'ورقة التأكيد' },
  'row.sampleCaption': { kind: 'help', text: 'فستان سهرة · درج الكاش' },
  'row.sampleTime': { kind: 'help', text: '10:24 ص' },
  'title.objectRow': { kind: 'title', text: 'الصف' },
  'state.oneLine': { kind: 'badge', text: 'سطر واحد' },
  'state.withBadge': { kind: 'badge', text: 'مع شارة' },
  'title.objectCard': { kind: 'title', text: 'بطاقة الكائن' },
  'state.withButton': { kind: 'badge', text: 'مع زر' },
  'title.metric': { kind: 'title', text: 'المقياس' },
  'title.metricSmall': { kind: 'title', text: 'المقياس الصغير' },
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
  'toast.questionSent': { kind: 'success', text: 'أُرسل السؤال' },
  // Lab-only press responses for samples whose real destination is a full
  // screen the lab page cannot host (tiles → domain tabs, back → previous
  // screen): the Toast IS the documented press response (23.12).
  'toast.opens': { kind: 'help', text: 'تفتح {area}' },

  // --- InlineBanner / ErrorState (BRIEF 9.5, 11.3, 24.5) ---
  'banner.offline': { kind: 'error', text: 'الاتصال انقطع' },
  'banner.backOnline': { kind: 'help', text: 'عاد الاتصال، لديك مسودة' },
  'banner.permission': { kind: 'help', text: 'هذا خارج صلاحياتك في هذا المشروع' },
  'errorState.loadFailed': { kind: 'error', text: 'تعذّر تحميل البيانات. أعد المحاولة.' },
  'errorState.updatedAt': { kind: 'help', text: 'آخر تحديث {time}' },

  // --- EmptyState (BRIEF 23.7, 24.6; و-1 item 14: one button max, and
  // none when the header carries the creation button) ---
  'empty.movements': { kind: 'empty', text: 'حركات اليوم تظهر هنا.' },
  'empty.oneButtonMax': { kind: 'help', text: 'زر واحد كحد أقصى، حين يغيب زر الإنشاء' },

  // --- ConfirmSheet result sentence (BRIEF 24.3) ---
  'confirm.deleteResult': { kind: 'help', text: 'لن تظهر في رصيد {fund}.' },

  // --- Metric delta lines (BRIEF 23.8 + 23.22 hidden form) ---
  'metric.deltaHigher': { kind: 'help', text: '{percent} أعلى من أمس' },
  'metric.deltaLower': { kind: 'help', text: '{percent} أقل من أمس' },
  'metric.deltaHigherHidden': { kind: 'help', text: 'أعلى من أمس' },
  'metric.deltaLowerHidden': { kind: 'help', text: 'أقل من أمس' },

  // --- Money fragments (BRIEF 8; display fragments -> badge) ---
  'money.unit': { kind: 'badge', text: 'د' },
  'money.forYou': { kind: 'badge', text: 'لك' },
  'money.againstYou': { kind: 'badge', text: 'عليك' },
  'money.missing': { kind: 'badge', text: '—' },
  'money.hiddenGlyph': { kind: 'badge', text: '••••' },

  // --- Lab chrome and state names (plan K27/K32: the lab shows component and
  //     state names only; every word lives here, not in lab source) ---
  'lab.stamp': { kind: 'title', text: 'مختبر الدفعة الأولى' },
  // 2.2 (owner note §3): section headings in the product owner's language —
  // what it is and when it is used, two or three words; the technical name
  // renders small beside it (lab-title's .lab-tech).
  'lab.h.amountToggle': { kind: 'title', text: 'زر إخفاء الأرقام' },
  // 3ج.1 — the live override demo (the plan's own example: «سجّل حركة»).
  'title.textOverride': { kind: 'title', text: 'تجاوز النصوص' },
  'lab.h.textOverride': { kind: 'title', text: 'نصوص من التطبيق' },
  'lab.overrideHint': { kind: 'help', text: 'اضغط ليستبدل نص الزر، واضغط ثانية ليعود.' },
  'lab.overrideOn': { kind: 'button', text: 'فعّل التجاوز' },
  'lab.overrideOff': { kind: 'button', text: 'أعد نص المكتبة' },
  'lab.overrideTarget': { kind: 'help', text: 'الهدف الحي' },
  'lab.overrideReplacement': { kind: 'button', text: 'دبّر الحركة' },
  // AmountKeypad (§1.4-7): the SPOKEN names — the visible glyph stays a digit.
  'keypad.srGroup': { kind: 'screen-reader', text: 'لوحة المبالغ' },
  'keypad.sr0': { kind: 'screen-reader', text: 'صفر' },
  'keypad.sr1': { kind: 'screen-reader', text: 'واحد' },
  'keypad.sr2': { kind: 'screen-reader', text: 'اثنان' },
  'keypad.sr3': { kind: 'screen-reader', text: 'ثلاثة' },
  'keypad.sr4': { kind: 'screen-reader', text: 'أربعة' },
  'keypad.sr5': { kind: 'screen-reader', text: 'خمسة' },
  'keypad.sr6': { kind: 'screen-reader', text: 'ستة' },
  'keypad.sr7': { kind: 'screen-reader', text: 'سبعة' },
  'keypad.sr8': { kind: 'screen-reader', text: 'ثمانية' },
  'keypad.sr9': { kind: 'screen-reader', text: 'تسعة' },
  'keypad.sr000': { kind: 'screen-reader', text: 'ثلاثة أصفار' },
  'keypad.srDecimal': { kind: 'screen-reader', text: 'فاصلة' },
  'keypad.srBackspace': { kind: 'screen-reader', text: 'احذف' },
  // the keypad lab page (§1.4-10: typing 145.750 through the keys).
  'title.keypad': { kind: 'title', text: 'لوحة المبالغ' },
  'lab.h.keypad': { kind: 'title', text: 'لوحة أرقام المبالغ' },
  'lab.keypadHint': { kind: 'help', text: 'اضغط المفاتيح يدخل المبلغ في الحقل أعلاه.' },
  // MovementTypeControl (§1.5): the in/out/transfer switch of the movement
  // form. The group's name is a screen-reader word; the save-time error
  // under the control is a help sentence.
  'movementType.srGroup': { kind: 'screen-reader', text: 'نوع الحركة' },
  'movementType.choose': { kind: 'help', text: 'اختر نوع الحركة' },
  'title.movementTypeControl': { kind: 'title', text: 'نوع الحركة' },
  'lab.h.movementTypeControl': { kind: 'title', text: 'مبدّل نوع الحركة' },
  'lab.movementTypeHint': { kind: 'help', text: 'حاول الحفظ بلا اختيار يظهر خطأ الصياغة تحته.' },
  // QuantityStepper (§1.6): the stepper's screen-reader words (its only
  // own texts — everything else is the app's label).
  'quantity.increase': { kind: 'screen-reader', text: 'زيادة' },
  'quantity.decrease': { kind: 'screen-reader', text: 'إنقاص' },
  'field.quantity': { kind: 'badge', text: 'الكمية' },
  'title.quantityStepper': { kind: 'title', text: 'عداد الكمية' },
  'lab.h.quantityStepper': { kind: 'title', text: 'عداد كمية صحيحة' },
  'lab.quantityHint': { kind: 'help', text: 'اضغط مطولًا يتسارع العد، واكتب ما تشاء.' },
  // DateQuickChips (§1.8): the trailing chip's fixed word and the
  // save-time error line. The quick words (اليوم/أمس/غداً) are the app's
  // item labels; the date format is the component's own contract.
  'dateQuick.other': { kind: 'button', text: 'تاريخ آخر' },
  'dateQuick.choose': { kind: 'help', text: 'اختر التاريخ' },
  'dateQuick.chipName': { kind: 'screen-reader', text: '{label}، {value}' },
  'field.saleDate': { kind: 'badge', text: 'تاريخ البيع' },
  'title.dateQuickChips': { kind: 'title', text: 'التواريخ السريعة' },
  'lab.h.dateQuickChips': { kind: 'title', text: 'رقائق تاريخ سريعة' },
  'lab.dateQuickHint': { kind: 'help', text: '«تاريخ آخر» يفتح منتقي التطبيق حتى ورقة الشهر.' },
  'dateWord.today': { kind: 'badge', text: 'اليوم' },
  'dateWord.yesterday': { kind: 'badge', text: 'أمس' },
  'dateWord.tomorrow': { kind: 'badge', text: 'غداً' },
  'state.customRow': { kind: 'badge', text: 'تاريخ مخصص' },
  'lab.h.money': { kind: 'title', text: 'شكل المبلغ ووحدته' },
  'lab.h.statusBadge': { kind: 'title', text: 'شارة الحالة' },
  'lab.h.entityMark': { kind: 'title', text: 'حرف الطرف' },
  'lab.h.button': { kind: 'title', text: 'الأزرار' },
  'lab.h.iconButton': { kind: 'title', text: 'زر أيقونة دائري' },
  'lab.h.textField': { kind: 'title', text: 'حقل سطر واحد' },
  'lab.h.segmentedControl': { kind: 'title', text: 'مبدّل خيارات قليلة' },
  'lab.h.filterChips': { kind: 'title', text: 'رقائق تصفية القائمة' },
  'lab.h.surface': { kind: 'title', text: 'بطاقة محتوى بيضاء' },
  'lab.h.well': { kind: 'title', text: 'معلومات داخل بطاقة' },
  'lab.h.section': { kind: 'title', text: 'عنوان قسم وقائمته' },
  'lab.h.hero': { kind: 'title', text: 'البطاقة الرئيسية' },
  'lab.h.sheet': { kind: 'title', text: 'الورقة المنبثقة' },
  'lab.h.actionBar': { kind: 'title', text: 'شريط الحفظ السفلي' },
  'lab.h.skeleton': { kind: 'title', text: 'هيكل التحميل' },
  'lab.h.emptyState': { kind: 'title', text: 'شكل القائمة الفارغة' },
  'lab.h.inlineBanner': { kind: 'title', text: 'شريط معلومة علوي' },
  'lab.h.toast': { kind: 'title', text: 'رسالة نجاح سريعة' },
  'lab.h.saveState': { kind: 'title', text: 'حالة الحفظ' },
  'lab.h.pageHeader': { kind: 'title', text: 'العنوان وزر الإنشاء' },
  'lab.h.tabBar': { kind: 'title', text: 'تبويبات أسفل الشاشة' },
  'lab.h.contextBar': { kind: 'title', text: 'الشريط العلوي الثابت' },
  'lab.h.projectSwitcher': { kind: 'title', text: 'مبدّل المشروع والدور' },
  'lab.h.notificationsButton': { kind: 'title', text: 'جرس الإشعارات' },
  'lab.h.askButton': { kind: 'title', text: 'زر المساعد Micro' },
  'lab.h.confirmSheet': { kind: 'title', text: 'ورقة تأكيد الحذف' },
  'lab.h.objectRow': { kind: 'title', text: 'صف في قائمة' },
  'lab.h.objectCard': { kind: 'title', text: 'بطاقة كائن موسّعة' },
  'lab.h.metric': { kind: 'title', text: 'الرقم البطل' },
  'lab.h.metricSmall': { kind: 'title', text: 'رقم مصغّر بعنوانه' },
  'lab.h.tile': { kind: 'title', text: 'بلاطات اليوم الأربع' },
  'lab.fontScale': { kind: 'badge', text: 'حجم الخط' },
  'lab.scale100': { kind: 'button', text: '100%' },
  'lab.scale200': { kind: 'button', text: '200%' },
  'title.money': { kind: 'title', text: 'المبلغ' },
  'title.amountToggle': { kind: 'title', text: 'إخفاء المبالغ وإظهارها' },
  'title.statusBadge': { kind: 'title', text: 'شارة الحالة' },
  'state.tones': { kind: 'badge', text: 'النغمات' },
  'title.entityMark': { kind: 'title', text: 'علامة الكيان' },
  'title.iconButton': { kind: 'title', text: 'زر الأيقونة' },
  'title.textField': { kind: 'title', text: 'حقل النص' },
  'field.supplier': { kind: 'badge', text: 'اسم المورد' },
  'field.amount': { kind: 'badge', text: 'المبلغ' },
  'field.optional': { kind: 'badge', text: 'اختياري' },
  'placeholder.amount': { kind: 'placeholder', text: '0.000' },
  'help.supplierName': { kind: 'help', text: 'اكتب الاسم كما في السجل الرسمي' },
  'error.phoneFormat': { kind: 'error', text: 'اكتب الرقم كاملاً بالأرقام الغربية' },
  'state.initial': { kind: 'badge', text: 'الحرف الأول' },
  'state.fundTypes': { kind: 'badge', text: 'أنواع الصناديق' },
  'state.badged': { kind: 'badge', text: 'بشارة تحقق' },
  'title.button': { kind: 'title', text: 'الزر' },
  'variant.primary': { kind: 'badge', text: 'أساسي' },
  'variant.secondary': { kind: 'badge', text: 'ثانوي' },
  'variant.text': { kind: 'badge', text: 'نصي' },
  'variant.danger': { kind: 'badge', text: 'خطر' },
  'state.withIcon': { kind: 'badge', text: 'بأيقونة' },
  'title.segmentedControl': { kind: 'title', text: 'المبدّل المقسّم' },
  'state.twoSegments': { kind: 'badge', text: 'جزآن' },
  'state.threeSegments': { kind: 'badge', text: 'ثلاثة أجزاء' },
  'state.fourSegments': { kind: 'badge', text: 'أربعة أجزاء' },
  'title.filterChips': { kind: 'title', text: 'رقائق التصفية' },
  'title.surface': { kind: 'title', text: 'السطح' },
  'state.withHeader': { kind: 'badge', text: 'برأس' },
  'state.list': { kind: 'badge', text: 'قائمة' },
  'title.well': { kind: 'title', text: 'الحاوي الغائر' },
  'title.section': { kind: 'title', text: 'القسم' },
  'state.withCount': { kind: 'badge', text: 'مع عدد' },
  'state.emptySection': { kind: 'badge', text: 'فارغ' },
  'title.tile': { kind: 'title', text: 'البلاطات' },
  'state.grid4': { kind: 'badge', text: 'شبكة 2×2' },
  'title.hero': { kind: 'title', text: 'السطح البطل' },
  'title.actionBar': { kind: 'title', text: 'شريط الإجراءات' },
  'state.withSecondary': { kind: 'badge', text: 'مع ثانوي' },
  'state.primaryOnly': { kind: 'badge', text: 'أساسي وحده' },
  'state.contentMore': { kind: 'badge', text: 'بقي محتوى' },
  'state.scrolledToEnd': { kind: 'badge', text: 'انتهى التمرير' },
  'title.askButton': { kind: 'title', text: 'زر Ask' },
  'state.unread': { kind: 'badge', text: 'غير مقروء' },
  'title.notificationsButton': { kind: 'title', text: 'زر الإشعارات' },
  'state.noUnread': { kind: 'badge', text: 'بلا نقطة' },
  'title.projectSwitcher': { kind: 'title', text: 'مبدّل المشروع' },
  'state.singleRole': { kind: 'badge', text: 'دور واحد' },
  'title.contextBar': { kind: 'title', text: 'شريط السياق' },
  'state.mainScreens': { kind: 'badge', text: 'الشاشات الرئيسية' },
  'state.subScreens': { kind: 'badge', text: 'الشاشات الفرعية' },
  'sr.switchProject': { kind: 'screen-reader', text: 'تبديل المشروع' },
  'title.tabBar': { kind: 'title', text: 'شريط التبويبات' },
  'title.pageHeader': { kind: 'title', text: 'رأس الصفحة' },
  'title.movements': { kind: 'title', text: 'الحركات' },
  'button.new': { kind: 'button', text: 'جديد' },
  'state.scrolled': { kind: 'badge', text: 'عند التمرير' },
  'title.saveState': { kind: 'title', text: 'حالة الحفظ' },
  'title.toast': { kind: 'title', text: 'الإشعار العابر' },
  'title.inlineBanner': { kind: 'title', text: 'الشريط المثبت' },
  'title.emptyState': { kind: 'title', text: 'حالة الفراغ' },
  'title.skeleton': { kind: 'title', text: 'هيكل التحميل' },
  'lab.index': { kind: 'help', text: 'فهرس المكوّنات' },
  'state.defaultToast': { kind: 'badge', text: 'ثلاث ثوانٍ' },
  'state.draft': { kind: 'badge', text: 'مسودة' },
  'state.sending': { kind: 'badge', text: 'يُرسل' },
  'state.fiveTabs': { kind: 'badge', text: 'خمسة تبويبات' },
  'state.withCents': { kind: 'badge', text: 'مع فلوس' },
  'state.withSparkline': { kind: 'badge', text: 'بخط صغير' },
  'state.longNumber': { kind: 'badge', text: 'رقم طويل' },
  'state.multiSelect': { kind: 'badge', text: 'تحديد متعدد' },
  'state.scrollRow': { kind: 'badge', text: 'قابل للتمرير' },
  'state.driver': { kind: 'badge', text: 'وضع السائق' },
  'state.default': { kind: 'badge', text: 'افتراضي' },
  'state.landed': { kind: 'badge', text: 'وصل محفوظ' },
  'state.todayProject': { kind: 'badge', text: 'مشروع اليوم' },
  'today.date': { kind: 'badge', text: 'الجمعة 27/11/2026' },
  'section.now': { kind: 'title', text: 'الآن' },
  'now.in40': { kind: 'help', text: 'بعد 40 دقيقة' },
  'tile.fundsNow': { kind: 'help', text: 'في الصناديق الآن' },
  'tile.todayNext': { kind: 'help', text: 'اليوم · التالي 4:00 م' },
  'tile.running': { kind: 'badge', text: 'جارية' },
  'tile.offers': { kind: 'badge', text: 'عروض' },
  'state.debt': { kind: 'badge', text: 'دين' },
  'state.hidden': { kind: 'badge', text: 'مخفي' },
  'state.missing': { kind: 'badge', text: 'مفقود' },
  'state.loading': { kind: 'badge', text: 'تحميل' },
  'state.empty': { kind: 'badge', text: 'فراغ' },
  'state.normal': { kind: 'badge', text: 'عادي' },
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
  'sr.notifications': { kind: 'screen-reader', text: 'الإشعارات' },
  'sr.notificationsCount': { kind: 'screen-reader', text: 'الإشعارات، {counted}' },
  'sr.askUnread': { kind: 'screen-reader', text: 'Ask Micro، جواب غير مقروء' },
  'sr.financeNeedsYou': { kind: 'screen-reader', text: 'المالية، يحتاجك' },
  'sr.askThinking': { kind: 'screen-reader', text: 'يعمل Micro على الجواب' },
  'sr.askAnswered': { kind: 'screen-reader', text: 'وصل الجواب' },
  'sr.quoteArrived': { kind: 'screen-reader', text: 'وصل عرض سعر من {name}' },
  'sr.searchResults': { kind: 'screen-reader', text: '{counted}' },
  'sr.ask': { kind: 'screen-reader', text: 'Ask Micro' },
  'sr.close': { kind: 'screen-reader', text: 'إغلاق' },
  'sr.back': { kind: 'screen-reader', text: 'رجوع' },
  'sr.more': { kind: 'screen-reader', text: 'المزيد' },
  'sr.search': { kind: 'screen-reader', text: 'بحث' },
  'sr.clear': { kind: 'screen-reader', text: 'مسح' },
  'sr.saveSaved': { kind: 'screen-reader', text: 'حُفظت الحركة' },
  'sr.saveFailed': { kind: 'error', text: 'لم تُحفظ الحركة. الاتصال انقطع.' },

  // --- Field placeholder, format only (BRIEF 23.24(10)) ---
  'placeholder.phone': { kind: 'placeholder', text: '07X XXX XXXX' },
  // --- BATCH2 3.4: calendar, order states and marketplace vocabularies ---
  // Days WITHOUT «ال» (owner decision د5/1.1), in weekStart=0 order.
  'day.0': { kind: 'badge', text: 'أحد' },
  'day.1': { kind: 'badge', text: 'اثنين' },
  'day.2': { kind: 'badge', text: 'ثلاثاء' },
  'day.3': { kind: 'badge', text: 'أربعاء' },
  'day.4': { kind: 'badge', text: 'خميس' },
  'day.5': { kind: 'badge', text: 'جمعة' },
  'day.6': { kind: 'badge', text: 'سبت' },
  // The Levantine month names for the SCREEN-READER only (و-1: the screen
  // shows «07/2026»; the reader says «تموز 2026»).
  'month.1': { kind: 'screen-reader', text: 'كانون الثاني' },
  'month.2': { kind: 'screen-reader', text: 'شباط' },
  'month.3': { kind: 'screen-reader', text: 'آذار' },
  'month.4': { kind: 'screen-reader', text: 'نيسان' },
  'month.5': { kind: 'screen-reader', text: 'أيار' },
  'month.6': { kind: 'screen-reader', text: 'حزيران' },
  'month.7': { kind: 'screen-reader', text: 'تموز' },
  'month.8': { kind: 'screen-reader', text: 'آب' },
  'month.9': { kind: 'screen-reader', text: 'أيلول' },
  'month.10': { kind: 'screen-reader', text: 'تشرين الأول' },
  'month.11': { kind: 'screen-reader', text: 'تشرين الثاني' },
  'month.12': { kind: 'screen-reader', text: 'كانون الأول' },
  // The TEN order states + their «next step» texts (ADDENDUM 2.2.1 — the
  // badge text and the next-step label ride the SAME table).
  'order.draft': { kind: 'badge', text: 'مسودة' },
  'order.tentative': { kind: 'badge', text: 'اتفاق مبدئي' },
  'order.confirmed': { kind: 'badge', text: 'مؤكد' },
  'order.inProgress': { kind: 'badge', text: 'قيد التنفيذ' },
  'order.ready': { kind: 'badge', text: 'جاهز' },
  'order.delivered': { kind: 'badge', text: 'تم التسليم' },
  'order.settled': { kind: 'badge', text: 'تمت التسوية' },
  'order.deferred': { kind: 'badge', text: 'مؤجل' },
  'order.cancelled': { kind: 'badge', text: 'ملغى' },
  'order.needsReview': { kind: 'badge', text: 'يحتاج مراجعة' },
  'next.draft': { kind: 'button', text: 'أضف السعر والموعد' },
  'next.tentative': { kind: 'button', text: 'ابدأ التنفيذ' },
  'next.confirmed': { kind: 'button', text: 'ابدأ التنفيذ' },
  'next.inProgress': { kind: 'button', text: 'أكمل التنفيذ' },
  'next.ready': { kind: 'button', text: 'سجّل التسليم' },
  'next.delivered': { kind: 'button', text: 'راجع التحصيل والنتيجة' },
  'next.settled': { kind: 'button', text: 'راجع نتيجة الطلب' },
  'next.deferred': { kind: 'button', text: 'راجع سبب التأجيل' },
  'next.cancelled': { kind: 'button', text: 'راجع تسوية الطلب' },
  'next.needsReview': { kind: 'button', text: 'راجع الطلب' },
  // Availability (ADDENDUM 2.5) and report reasons (ADDENDUM 2.8).
  'avail.available': { kind: 'badge', text: 'متوفر' },
  'avail.onRequest': { kind: 'badge', text: 'بالطلب' },
  'avail.unavailable': { kind: 'badge', text: 'غير متوفر مؤقتاً' },
  'report.misleading': { kind: 'badge', text: 'معلومات مضللة' },
  'report.offTopic': { kind: 'badge', text: 'خارج النطاق المسموح' },
  'report.spam': { kind: 'badge', text: 'إعلان مزعج' },
  'report.contact': { kind: 'badge', text: 'مشكلة في التواصل' },
  'report.other': { kind: 'badge', text: 'سبب آخر' },
  'report.writeReason': { kind: 'badge', text: 'اكتب السبب' },
  'checkbox.tickThis': { kind: 'help', text: 'أشّر على هذا البند.' },
  'radio.choose': { kind: 'help', text: 'اختر {label}.' },
  'lab.h.radio': { kind: 'title', text: 'اختيار من قائمة' },
  'lab.tools': { kind: 'screen-reader', text: 'أدوات المختبر' },
  'lab.toolsTitle': { kind: 'title', text: 'أدوات المختبر' },
  'lab.h.toggle': { kind: 'title', text: 'إعداد يعمل فوراً' },
  'title.toggle': { kind: 'title', text: 'المفتاح' },
  'title.radio': { kind: 'title', text: 'مجموعة الراديو' },
  'sr.clearSearch': { kind: 'screen-reader', text: 'امسح البحث' },
  'search.in': { kind: 'placeholder', text: 'ابحث في {area}' },
  'lab.h.searchField': { kind: 'title', text: 'بحث داخل قسم' },
  'lab.h.textArea': { kind: 'title', text: 'نص متعدد الأسطر' },
  'lab.h.amountField': { kind: 'title', text: 'حقل المبالغ' },
  'title.amountField': { kind: 'title', text: 'حقل المبلغ' },
  'title.textArea': { kind: 'title', text: 'حقل الملاحظة' },
  'title.searchField': { kind: 'title', text: 'حقل البحث' },
  'lab.h.checkbox': { kind: 'title', text: 'بنود تُشَرّ مستقلة' },
  'state.errorRow': { kind: 'badge', text: 'حالة الخطأ' },
  'state.fractionFull': { kind: 'badge', text: 'خانات كاملة' },
  'title.checkbox': { kind: 'title', text: 'مربع الاختيار' },

// ---------------------------------------------------------------------------

} as const;

export type ArKey = keyof typeof ar;

// ---------------------------------------------------------------------------
// 3ج.1 — host-app text overrides (owner note 2026-11-27: «ممكن زر من
// الأزرار أنا اسمه بدي يتغير»). The app passes ANY PART of the dictionary;
// every component, current and future, reads its texts through t() (and
// getMoneyTexts() for the money aria set), so an override set ONCE at app
// start flows everywhere. Keys are typed as ArKey — a wrong key name fails
// typecheck. Any key the app does not pass keeps the library text. Word
// limits (24.1) stay a DOCUMENTED RECOMMENDATION for the app and never
// block an override (the ds-copy gate judges the library dictionary, not
// the host app's wording).
// ---------------------------------------------------------------------------

/** What the host app may override: key -> replacement text. */
export type TextOverrides = Partial<Record<ArKey, string>>;

let overrides: TextOverrides = {};

/**
 * Replace fixed library texts from the host app. Call ONCE at startup
 * (before the first render — the values are read at render time, so a call
 * after mount still applies to the next render, but startup is the contract).
 * A later call REPLACES the whole override set (it is not additive).
 */
export function overrideTexts(next: TextOverrides): void {
  overrides = { ...next };
}

/** Drop every override (tests and the lab's live sample only). */
export function resetTextOverrides(): void {
  overrides = {};
}

/** The override for `key`, or undefined when the app passed none. */
export function overriddenText(key: ArKey): string | undefined {
  return overrides[key];
}

/**
 * Resolve a dictionary entry with `{param}` interpolation.
 * The host app's override (3ج.1) wins over the library text; unknown params
 * are left as-is; missing params throw nothing (defensive — the copy gate
 * checks completeness separately).
 */
export function t(key: ArKey, params?: Record<string, string | number>): string {
  let text: string = overrides[key] ?? ar[key].text;
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
// stays free of Arabic; BRIEF 8 + 23.17 wording). 3ج.1: a FUNCTION, not a
// module-level snapshot — every caller reads it at render time so host-app
// overrides (overrideTexts) flow into the money aria set too.
// ---------------------------------------------------------------------------

export function getMoneyTexts(): MoneyAriaTexts {
  return {
    unit: t('money.unit'),
    minus: t('money.ariaMinus'),
    dinar: t('money.ariaDinar'),
    fils: t('money.ariaFils'),
    and: t('money.ariaAnd'),
    forYou: t('money.forYou'),
    againstYou: t('money.againstYou'),
    hidden: t('money.ariaHidden'),
    missing: t('money.ariaMissing'),
    hiddenGlyph: t('money.hiddenGlyph'),
    missingGlyph: t('money.missing'),
  };
}
