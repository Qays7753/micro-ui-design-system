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
export declare const arBase: {
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
    readonly 'nav.agenda': {
        readonly kind: "badge";
        readonly text: "الأجندة";
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
    readonly 'movement.counted': {
        readonly kind: "badge";
        readonly text: "32 حركة";
    };
    readonly 'row.sampleTitle': {
        readonly kind: "title";
        readonly text: "سلمى الحوراني";
    };
    readonly 'sheet.sampleTitle': {
        readonly kind: "title";
        readonly text: "تفاصيل الحركة";
    };
    readonly 'sheet.projectTitle': {
        readonly kind: "title";
        readonly text: "تبديل المشروع";
    };
    readonly 'sheet.notificationsTitle': {
        readonly kind: "title";
        readonly text: "الإشعارات";
    };
    readonly 'sheet.askTitle': {
        readonly kind: "title";
        readonly text: "Ask Micro";
    };
    readonly 'sheet.sourceTitle': {
        readonly kind: "title";
        readonly text: "مصدر الرقم";
    };
    readonly 'sheet.allTitle': {
        readonly kind: "title";
        readonly text: "كل ما يحتاجك";
    };
    readonly 'sheet.objectTitle': {
        readonly kind: "title";
        readonly text: "طلب 1175";
    };
    readonly 'notif.quoteArrived': {
        readonly kind: "help";
        readonly text: "وصل عرض سعر من عمر الزعبي";
    };
    readonly 'notif.orderToday': {
        readonly kind: "help";
        readonly text: "طلب 1203 موعده اليوم 4:00 م";
    };
    readonly 'notif.paymentIn': {
        readonly kind: "help";
        readonly text: "دفعة 30 د من رنا العبادي";
    };
    readonly 'notif.timeAgo': {
        readonly kind: "help";
        readonly text: "قبل 5 دقائق";
    };
    readonly 'notif.timeToday': {
        readonly kind: "badge";
        readonly text: "9:15 ص";
    };
    readonly 'notif.timeYesterday': {
        readonly kind: "help";
        readonly text: "أمس 5:10 م";
    };
    readonly 'ask.placeholder': {
        readonly kind: "placeholder";
        readonly text: "اسأل Micro";
    };
    readonly 'ask.amountLabel': {
        readonly kind: "badge";
        readonly text: "السؤال";
    };
    readonly 'button.askSend': {
        readonly kind: "button";
        readonly text: "أرسل";
    };
    readonly 'kv.orderTitle': {
        readonly kind: "badge";
        readonly text: "الطلب";
    };
    readonly 'kv.customer': {
        readonly kind: "badge";
        readonly text: "العميل";
    };
    readonly 'kv.delivery': {
        readonly kind: "badge";
        readonly text: "التسليم";
    };
    readonly 'kv.phone': {
        readonly kind: "badge";
        readonly text: "الهاتف";
    };
    readonly 'title.sheet': {
        readonly kind: "title";
        readonly text: "الورقة";
    };
    readonly 'confirm.sampleTitle': {
        readonly kind: "title";
        readonly text: "حذف الحركة؟";
    };
    readonly 'confirm.sampleSentence': {
        readonly kind: "help";
        readonly text: "ستُحذف الحركة نهائياً ولا يمكن التراجع عنها.";
    };
    readonly 'title.confirmSheet': {
        readonly kind: "title";
        readonly text: "ورقة التأكيد";
    };
    readonly 'row.sampleCaption': {
        readonly kind: "help";
        readonly text: "فستان سهرة · درج الكاش";
    };
    readonly 'row.sampleTime': {
        readonly kind: "help";
        readonly text: "10:24 ص";
    };
    readonly 'title.objectRow': {
        readonly kind: "title";
        readonly text: "الصف";
    };
    readonly 'state.oneLine': {
        readonly kind: "badge";
        readonly text: "سطر واحد";
    };
    readonly 'state.withBadge': {
        readonly kind: "badge";
        readonly text: "مع شارة";
    };
    readonly 'title.objectCard': {
        readonly kind: "title";
        readonly text: "بطاقة الكائن";
    };
    readonly 'state.withButton': {
        readonly kind: "badge";
        readonly text: "مع زر";
    };
    readonly 'title.metric': {
        readonly kind: "title";
        readonly text: "المقياس";
    };
    readonly 'title.metricSmall': {
        readonly kind: "title";
        readonly text: "المقياس الصغير";
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
    readonly 'toast.questionSent': {
        readonly kind: "success";
        readonly text: "أُرسل السؤال";
    };
    readonly 'toast.opens': {
        readonly kind: "help";
        readonly text: "تفتح {area}";
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
    readonly 'empty.oneButtonMax': {
        readonly kind: "help";
        readonly text: "زر واحد كحد أقصى، حين يغيب زر الإنشاء";
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
        readonly text: "د";
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
    readonly 'lab.stamp': {
        readonly kind: "title";
        readonly text: "مختبر الدفعة الأولى";
    };
    readonly 'lab.h.amountToggle': {
        readonly kind: "title";
        readonly text: "زر إخفاء الأرقام";
    };
    readonly 'title.textOverride': {
        readonly kind: "title";
        readonly text: "تجاوز النصوص";
    };
    readonly 'lab.h.textOverride': {
        readonly kind: "title";
        readonly text: "نصوص من التطبيق";
    };
    readonly 'lab.overrideHint': {
        readonly kind: "help";
        readonly text: "اضغط ليستبدل نص الزر، واضغط ثانية ليعود.";
    };
    readonly 'lab.overrideOn': {
        readonly kind: "button";
        readonly text: "فعّل التجاوز";
    };
    readonly 'lab.overrideOff': {
        readonly kind: "button";
        readonly text: "أعد نص المكتبة";
    };
    readonly 'lab.overrideTarget': {
        readonly kind: "help";
        readonly text: "الهدف الحي";
    };
    readonly 'lab.overrideReplacement': {
        readonly kind: "button";
        readonly text: "دبّر الحركة";
    };
    readonly 'keypad.srGroup': {
        readonly kind: "screen-reader";
        readonly text: "لوحة المبالغ";
    };
    readonly 'keypad.sr0': {
        readonly kind: "screen-reader";
        readonly text: "صفر";
    };
    readonly 'keypad.sr1': {
        readonly kind: "screen-reader";
        readonly text: "واحد";
    };
    readonly 'keypad.sr2': {
        readonly kind: "screen-reader";
        readonly text: "اثنان";
    };
    readonly 'keypad.sr3': {
        readonly kind: "screen-reader";
        readonly text: "ثلاثة";
    };
    readonly 'keypad.sr4': {
        readonly kind: "screen-reader";
        readonly text: "أربعة";
    };
    readonly 'keypad.sr5': {
        readonly kind: "screen-reader";
        readonly text: "خمسة";
    };
    readonly 'keypad.sr6': {
        readonly kind: "screen-reader";
        readonly text: "ستة";
    };
    readonly 'keypad.sr7': {
        readonly kind: "screen-reader";
        readonly text: "سبعة";
    };
    readonly 'keypad.sr8': {
        readonly kind: "screen-reader";
        readonly text: "ثمانية";
    };
    readonly 'keypad.sr9': {
        readonly kind: "screen-reader";
        readonly text: "تسعة";
    };
    readonly 'keypad.sr000': {
        readonly kind: "screen-reader";
        readonly text: "ثلاثة أصفار";
    };
    readonly 'keypad.srDecimal': {
        readonly kind: "screen-reader";
        readonly text: "فاصلة";
    };
    readonly 'keypad.srBackspace': {
        readonly kind: "screen-reader";
        readonly text: "احذف";
    };
    readonly 'title.keypad': {
        readonly kind: "title";
        readonly text: "لوحة المبالغ";
    };
    readonly 'lab.h.keypad': {
        readonly kind: "title";
        readonly text: "لوحة أرقام المبالغ";
    };
    readonly 'lab.keypadHint': {
        readonly kind: "help";
        readonly text: "اضغط المفاتيح يدخل المبلغ في الحقل أعلاه.";
    };
    readonly 'movementType.srGroup': {
        readonly kind: "screen-reader";
        readonly text: "نوع الحركة";
    };
    readonly 'movementType.choose': {
        readonly kind: "help";
        readonly text: "اختر نوع الحركة";
    };
    readonly 'title.movementTypeControl': {
        readonly kind: "title";
        readonly text: "نوع الحركة";
    };
    readonly 'lab.h.movementTypeControl': {
        readonly kind: "title";
        readonly text: "مبدّل نوع الحركة";
    };
    readonly 'lab.movementTypeHint': {
        readonly kind: "help";
        readonly text: "حاول الحفظ بلا اختيار يظهر خطأ الصياغة تحته.";
    };
    readonly 'quantity.increase': {
        readonly kind: "screen-reader";
        readonly text: "زيادة";
    };
    readonly 'quantity.decrease': {
        readonly kind: "screen-reader";
        readonly text: "إنقاص";
    };
    readonly 'field.quantity': {
        readonly kind: "badge";
        readonly text: "الكمية";
    };
    readonly 'title.quantityStepper': {
        readonly kind: "title";
        readonly text: "عداد الكمية";
    };
    readonly 'lab.h.quantityStepper': {
        readonly kind: "title";
        readonly text: "عداد كمية صحيحة";
    };
    readonly 'lab.quantityHint': {
        readonly kind: "help";
        readonly text: "اضغط مطولًا يتسارع العد، واكتب ما تشاء.";
    };
    readonly 'dateQuick.other': {
        readonly kind: "button";
        readonly text: "تاريخ آخر";
    };
    readonly 'dateQuick.choose': {
        readonly kind: "help";
        readonly text: "اختر التاريخ";
    };
    readonly 'dateQuick.chipName': {
        readonly kind: "screen-reader";
        readonly text: "{label}، {value}";
    };
    readonly 'field.saleDate': {
        readonly kind: "badge";
        readonly text: "تاريخ البيع";
    };
    readonly 'title.dateQuickChips': {
        readonly kind: "title";
        readonly text: "التواريخ السريعة";
    };
    readonly 'lab.h.dateQuickChips': {
        readonly kind: "title";
        readonly text: "رقائق تاريخ سريعة";
    };
    readonly 'lab.dateQuickHint': {
        readonly kind: "help";
        readonly text: "«تاريخ آخر» يفتح منتقي التطبيق حتى ورقة الشهر.";
    };
    readonly 'dateWord.today': {
        readonly kind: "badge";
        readonly text: "اليوم";
    };
    readonly 'dateWord.yesterday': {
        readonly kind: "badge";
        readonly text: "أمس";
    };
    readonly 'dateWord.tomorrow': {
        readonly kind: "badge";
        readonly text: "غداً";
    };
    readonly 'state.customRow': {
        readonly kind: "badge";
        readonly text: "تاريخ مخصص";
    };
    readonly 'time.am': {
        readonly kind: "badge";
        readonly text: "ص";
    };
    readonly 'time.pm': {
        readonly kind: "badge";
        readonly text: "م";
    };
    readonly 'time.amSpoken': {
        readonly kind: "screen-reader";
        readonly text: "صباحاً";
    };
    readonly 'time.pmSpoken': {
        readonly kind: "screen-reader";
        readonly text: "مساءً";
    };
    readonly 'time.periodGroup': {
        readonly kind: "screen-reader";
        readonly text: "الفترة";
    };
    readonly 'time.hour': {
        readonly kind: "title";
        readonly text: "الساعة";
    };
    readonly 'time.minutes': {
        readonly kind: "title";
        readonly text: "الدقائق";
    };
    readonly 'timePicker.apply': {
        readonly kind: "button";
        readonly text: "اعتمد الوقت";
    };
    readonly 'timePicker.choose': {
        readonly kind: "help";
        readonly text: "اختر الوقت";
    };
    readonly 'timePicker.srName': {
        readonly kind: "screen-reader";
        readonly text: "{label}، {time}";
    };
    readonly 'field.deliveryTime': {
        readonly kind: "badge";
        readonly text: "وقت التسليم";
    };
    readonly 'title.timePicker': {
        readonly kind: "title";
        readonly text: "منتقي الوقت";
    };
    readonly 'lab.h.timePicker': {
        readonly kind: "title";
        readonly text: "حقل موعد بلحظة";
    };
    readonly 'lab.timePickerHint': {
        readonly kind: "help";
        readonly text: "اضغط الحقل تفتح الورقة، واعتمد منها.";
    };
    readonly 'duration.hourOne': {
        readonly kind: "badge";
        readonly text: "ساعة";
    };
    readonly 'duration.hourTwo': {
        readonly kind: "badge";
        readonly text: "ساعتان";
    };
    readonly 'duration.hourFew': {
        readonly kind: "badge";
        readonly text: "ساعات";
    };
    readonly 'duration.hourMany': {
        readonly kind: "badge";
        readonly text: "ساعة";
    };
    readonly 'duration.minuteOne': {
        readonly kind: "badge";
        readonly text: "دقيقة";
    };
    readonly 'duration.minuteTwo': {
        readonly kind: "badge";
        readonly text: "دقيقتان";
    };
    readonly 'duration.minuteFew': {
        readonly kind: "badge";
        readonly text: "دقائق";
    };
    readonly 'duration.minuteMany': {
        readonly kind: "badge";
        readonly text: "دقيقة";
    };
    readonly 'duration.half': {
        readonly kind: "badge";
        readonly text: "ونصف";
    };
    readonly 'duration.and': {
        readonly kind: "badge";
        readonly text: "و";
    };
    readonly 'duration.common': {
        readonly kind: "title";
        readonly text: "مدد شائعة";
    };
    readonly 'duration.other': {
        readonly kind: "badge";
        readonly text: "مدة أخرى";
    };
    readonly 'durationPicker.apply': {
        readonly kind: "button";
        readonly text: "اعتمد المدة";
    };
    readonly 'durationPicker.srName': {
        readonly kind: "screen-reader";
        readonly text: "{label}، {duration}";
    };
    readonly 'field.duration': {
        readonly kind: "badge";
        readonly text: "المدة";
    };
    readonly 'title.durationPicker': {
        readonly kind: "title";
        readonly text: "منتقي المدة";
    };
    readonly 'lab.h.durationPicker': {
        readonly kind: "title";
        readonly text: "حقل مدة الموعد";
    };
    readonly 'lab.durationPickerHint': {
        readonly kind: "help";
        readonly text: "المدة تظهر بعد اختيار الوقت، وتُعتمد من الورقة.";
    };
    readonly 'period.day': {
        readonly kind: "badge";
        readonly text: "يوم";
    };
    readonly 'period.week': {
        readonly kind: "badge";
        readonly text: "أسبوع";
    };
    readonly 'period.month': {
        readonly kind: "badge";
        readonly text: "شهر";
    };
    readonly 'period.custom': {
        readonly kind: "button";
        readonly text: "فترة مخصصة";
    };
    readonly 'period.apply': {
        readonly kind: "button";
        readonly text: "اعرض الفترة";
    };
    readonly 'period.today': {
        readonly kind: "button";
        readonly text: "اليوم";
    };
    readonly 'period.thisWeek': {
        readonly kind: "button";
        readonly text: "هذا الأسبوع";
    };
    readonly 'period.thisMonth': {
        readonly kind: "button";
        readonly text: "هذا الشهر";
    };
    readonly 'period.sheetTitle': {
        readonly kind: "title";
        readonly text: "حجم الفترة";
    };
    readonly 'period.sizeGroup': {
        readonly kind: "screen-reader";
        readonly text: "حجم الفترة";
    };
    readonly 'period.srName': {
        readonly kind: "screen-reader";
        readonly text: "الفترة: {spoken}، غيّر الفترة";
    };
    readonly 'period.spokenTo': {
        readonly kind: "screen-reader";
        readonly text: "إلى";
    };
    readonly 'period.srDayPrev': {
        readonly kind: "screen-reader";
        readonly text: "اليوم السابق";
    };
    readonly 'period.srDayNext': {
        readonly kind: "screen-reader";
        readonly text: "اليوم التالي";
    };
    readonly 'period.srWeekPrev': {
        readonly kind: "screen-reader";
        readonly text: "الأسبوع السابق";
    };
    readonly 'period.srWeekNext': {
        readonly kind: "screen-reader";
        readonly text: "الأسبوع التالي";
    };
    readonly 'period.srMonthPrev': {
        readonly kind: "screen-reader";
        readonly text: "الشهر السابق";
    };
    readonly 'period.srMonthNext': {
        readonly kind: "screen-reader";
        readonly text: "الشهر التالي";
    };
    readonly 'period.srCustomPrev': {
        readonly kind: "screen-reader";
        readonly text: "الفترة السابقة";
    };
    readonly 'period.srCustomNext': {
        readonly kind: "screen-reader";
        readonly text: "الفترة التالية";
    };
    readonly 'title.periodSwitcher': {
        readonly kind: "title";
        readonly text: "مبدّل الفترة";
    };
    readonly 'lab.h.periodSwitcher': {
        readonly kind: "title";
        readonly text: "تنقّل الفترات";
    };
    readonly 'lab.periodSwitcherHint': {
        readonly kind: "help";
        readonly text: "السابق والتالي يتنقّلان، والتسمية تفتح ورقة الحجم.";
    };
    readonly 'lab.periodDayRow': {
        readonly kind: "badge";
        readonly text: "تنقّل يومي";
    };
    readonly 'lab.periodMonthOnlyRow': {
        readonly kind: "badge";
        readonly text: "شهر فقط";
    };
    readonly 'lab.h.money': {
        readonly kind: "title";
        readonly text: "شكل المبلغ ووحدته";
    };
    readonly 'lab.h.statusBadge': {
        readonly kind: "title";
        readonly text: "شارة الحالة";
    };
    readonly 'lab.h.entityMark': {
        readonly kind: "title";
        readonly text: "حرف الطرف";
    };
    readonly 'lab.h.button': {
        readonly kind: "title";
        readonly text: "الأزرار";
    };
    readonly 'lab.h.iconButton': {
        readonly kind: "title";
        readonly text: "زر أيقونة دائري";
    };
    readonly 'lab.h.textField': {
        readonly kind: "title";
        readonly text: "حقل سطر واحد";
    };
    readonly 'lab.h.segmentedControl': {
        readonly kind: "title";
        readonly text: "مبدّل خيارات قليلة";
    };
    readonly 'lab.h.filterChips': {
        readonly kind: "title";
        readonly text: "رقائق تصفية القائمة";
    };
    readonly 'lab.h.surface': {
        readonly kind: "title";
        readonly text: "بطاقة محتوى بيضاء";
    };
    readonly 'lab.h.well': {
        readonly kind: "title";
        readonly text: "معلومات داخل بطاقة";
    };
    readonly 'lab.h.section': {
        readonly kind: "title";
        readonly text: "عنوان قسم وقائمته";
    };
    readonly 'lab.h.hero': {
        readonly kind: "title";
        readonly text: "البطاقة الرئيسية";
    };
    readonly 'lab.h.sheet': {
        readonly kind: "title";
        readonly text: "الورقة المنبثقة";
    };
    readonly 'lab.h.actionBar': {
        readonly kind: "title";
        readonly text: "شريط الحفظ السفلي";
    };
    readonly 'lab.h.skeleton': {
        readonly kind: "title";
        readonly text: "هيكل التحميل";
    };
    readonly 'lab.h.emptyState': {
        readonly kind: "title";
        readonly text: "شكل القائمة الفارغة";
    };
    readonly 'lab.h.inlineBanner': {
        readonly kind: "title";
        readonly text: "شريط معلومة علوي";
    };
    readonly 'lab.h.toast': {
        readonly kind: "title";
        readonly text: "رسالة نجاح سريعة";
    };
    readonly 'lab.h.saveState': {
        readonly kind: "title";
        readonly text: "حالة الحفظ";
    };
    readonly 'lab.h.pageHeader': {
        readonly kind: "title";
        readonly text: "العنوان وزر الإنشاء";
    };
    readonly 'lab.h.tabBar': {
        readonly kind: "title";
        readonly text: "تبويبات أسفل الشاشة";
    };
    readonly 'lab.h.contextBar': {
        readonly kind: "title";
        readonly text: "الشريط العلوي الثابت";
    };
    readonly 'lab.h.projectSwitcher': {
        readonly kind: "title";
        readonly text: "مبدّل المشروع والدور";
    };
    readonly 'lab.h.notificationsButton': {
        readonly kind: "title";
        readonly text: "جرس الإشعارات";
    };
    readonly 'lab.h.askButton': {
        readonly kind: "title";
        readonly text: "زر المساعد Micro";
    };
    readonly 'lab.h.confirmSheet': {
        readonly kind: "title";
        readonly text: "ورقة تأكيد الحذف";
    };
    readonly 'lab.h.objectRow': {
        readonly kind: "title";
        readonly text: "صف في قائمة";
    };
    readonly 'lab.h.objectCard': {
        readonly kind: "title";
        readonly text: "بطاقة كائن موسّعة";
    };
    readonly 'lab.h.metric': {
        readonly kind: "title";
        readonly text: "الرقم البطل";
    };
    readonly 'lab.h.metricSmall': {
        readonly kind: "title";
        readonly text: "رقم مصغّر بعنوانه";
    };
    readonly 'lab.h.tile': {
        readonly kind: "title";
        readonly text: "بلاطات اليوم الأربع";
    };
    readonly 'lab.fontScale': {
        readonly kind: "badge";
        readonly text: "حجم الخط";
    };
    readonly 'lab.scale100': {
        readonly kind: "button";
        readonly text: "100%";
    };
    readonly 'lab.scale200': {
        readonly kind: "button";
        readonly text: "200%";
    };
    readonly 'title.money': {
        readonly kind: "title";
        readonly text: "المبلغ";
    };
    readonly 'title.amountToggle': {
        readonly kind: "title";
        readonly text: "إخفاء المبالغ وإظهارها";
    };
    readonly 'title.statusBadge': {
        readonly kind: "title";
        readonly text: "شارة الحالة";
    };
    readonly 'state.tones': {
        readonly kind: "badge";
        readonly text: "النغمات";
    };
    readonly 'title.entityMark': {
        readonly kind: "title";
        readonly text: "علامة الكيان";
    };
    readonly 'title.iconButton': {
        readonly kind: "title";
        readonly text: "زر الأيقونة";
    };
    readonly 'title.textField': {
        readonly kind: "title";
        readonly text: "حقل النص";
    };
    readonly 'field.supplier': {
        readonly kind: "badge";
        readonly text: "اسم المورد";
    };
    readonly 'field.amount': {
        readonly kind: "badge";
        readonly text: "المبلغ";
    };
    readonly 'field.optional': {
        readonly kind: "badge";
        readonly text: "اختياري";
    };
    readonly 'placeholder.amount': {
        readonly kind: "placeholder";
        readonly text: "0.000";
    };
    readonly 'help.supplierName': {
        readonly kind: "help";
        readonly text: "اكتب الاسم كما في السجل الرسمي";
    };
    readonly 'error.phoneFormat': {
        readonly kind: "error";
        readonly text: "اكتب الرقم كاملاً بالأرقام الغربية";
    };
    readonly 'state.initial': {
        readonly kind: "badge";
        readonly text: "الحرف الأول";
    };
    readonly 'state.fundTypes': {
        readonly kind: "badge";
        readonly text: "أنواع الصناديق";
    };
    readonly 'state.badged': {
        readonly kind: "badge";
        readonly text: "بشارة تحقق";
    };
    readonly 'title.button': {
        readonly kind: "title";
        readonly text: "الزر";
    };
    readonly 'variant.primary': {
        readonly kind: "badge";
        readonly text: "أساسي";
    };
    readonly 'variant.secondary': {
        readonly kind: "badge";
        readonly text: "ثانوي";
    };
    readonly 'variant.text': {
        readonly kind: "badge";
        readonly text: "نصي";
    };
    readonly 'variant.danger': {
        readonly kind: "badge";
        readonly text: "خطر";
    };
    readonly 'state.withIcon': {
        readonly kind: "badge";
        readonly text: "بأيقونة";
    };
    readonly 'title.segmentedControl': {
        readonly kind: "title";
        readonly text: "المبدّل المقسّم";
    };
    readonly 'state.twoSegments': {
        readonly kind: "badge";
        readonly text: "جزآن";
    };
    readonly 'state.threeSegments': {
        readonly kind: "badge";
        readonly text: "ثلاثة أجزاء";
    };
    readonly 'state.fourSegments': {
        readonly kind: "badge";
        readonly text: "أربعة أجزاء";
    };
    readonly 'title.filterChips': {
        readonly kind: "title";
        readonly text: "رقائق التصفية";
    };
    readonly 'title.surface': {
        readonly kind: "title";
        readonly text: "السطح";
    };
    readonly 'state.withHeader': {
        readonly kind: "badge";
        readonly text: "برأس";
    };
    readonly 'state.list': {
        readonly kind: "badge";
        readonly text: "قائمة";
    };
    readonly 'title.well': {
        readonly kind: "title";
        readonly text: "الحاوي الغائر";
    };
    readonly 'title.section': {
        readonly kind: "title";
        readonly text: "القسم";
    };
    readonly 'state.withCount': {
        readonly kind: "badge";
        readonly text: "مع عدد";
    };
    readonly 'state.emptySection': {
        readonly kind: "badge";
        readonly text: "فارغ";
    };
    readonly 'title.tile': {
        readonly kind: "title";
        readonly text: "البلاطات";
    };
    readonly 'state.grid4': {
        readonly kind: "badge";
        readonly text: "شبكة 2×2";
    };
    readonly 'title.hero': {
        readonly kind: "title";
        readonly text: "السطح البطل";
    };
    readonly 'title.actionBar': {
        readonly kind: "title";
        readonly text: "شريط الإجراءات";
    };
    readonly 'state.withSecondary': {
        readonly kind: "badge";
        readonly text: "مع ثانوي";
    };
    readonly 'state.primaryOnly': {
        readonly kind: "badge";
        readonly text: "أساسي وحده";
    };
    readonly 'state.contentMore': {
        readonly kind: "badge";
        readonly text: "بقي محتوى";
    };
    readonly 'state.scrolledToEnd': {
        readonly kind: "badge";
        readonly text: "انتهى التمرير";
    };
    readonly 'title.askButton': {
        readonly kind: "title";
        readonly text: "زر Ask";
    };
    readonly 'state.unread': {
        readonly kind: "badge";
        readonly text: "غير مقروء";
    };
    readonly 'title.notificationsButton': {
        readonly kind: "title";
        readonly text: "زر الإشعارات";
    };
    readonly 'state.noUnread': {
        readonly kind: "badge";
        readonly text: "بلا نقطة";
    };
    readonly 'title.projectSwitcher': {
        readonly kind: "title";
        readonly text: "مبدّل المشروع";
    };
    readonly 'state.singleRole': {
        readonly kind: "badge";
        readonly text: "دور واحد";
    };
    readonly 'title.contextBar': {
        readonly kind: "title";
        readonly text: "شريط السياق";
    };
    readonly 'state.mainScreens': {
        readonly kind: "badge";
        readonly text: "الشاشات الرئيسية";
    };
    readonly 'state.subScreens': {
        readonly kind: "badge";
        readonly text: "الشاشات الفرعية";
    };
    readonly 'sr.switchProject': {
        readonly kind: "screen-reader";
        readonly text: "تبديل المشروع";
    };
    readonly 'title.tabBar': {
        readonly kind: "title";
        readonly text: "شريط التبويبات";
    };
    readonly 'title.pageHeader': {
        readonly kind: "title";
        readonly text: "رأس الصفحة";
    };
    readonly 'title.movements': {
        readonly kind: "title";
        readonly text: "الحركات";
    };
    readonly 'button.new': {
        readonly kind: "button";
        readonly text: "جديد";
    };
    readonly 'state.scrolled': {
        readonly kind: "badge";
        readonly text: "عند التمرير";
    };
    readonly 'title.saveState': {
        readonly kind: "title";
        readonly text: "حالة الحفظ";
    };
    readonly 'title.toast': {
        readonly kind: "title";
        readonly text: "الإشعار العابر";
    };
    readonly 'title.inlineBanner': {
        readonly kind: "title";
        readonly text: "الشريط المثبت";
    };
    readonly 'title.emptyState': {
        readonly kind: "title";
        readonly text: "حالة الفراغ";
    };
    readonly 'title.skeleton': {
        readonly kind: "title";
        readonly text: "هيكل التحميل";
    };
    readonly 'lab.index': {
        readonly kind: "help";
        readonly text: "فهرس المكوّنات";
    };
    readonly 'state.defaultToast': {
        readonly kind: "badge";
        readonly text: "ثلاث ثوانٍ";
    };
    readonly 'state.draft': {
        readonly kind: "badge";
        readonly text: "مسودة";
    };
    readonly 'state.sending': {
        readonly kind: "badge";
        readonly text: "يُرسل";
    };
    readonly 'state.fiveTabs': {
        readonly kind: "badge";
        readonly text: "خمسة تبويبات";
    };
    readonly 'state.withCents': {
        readonly kind: "badge";
        readonly text: "مع فلوس";
    };
    readonly 'state.withSparkline': {
        readonly kind: "badge";
        readonly text: "بخط صغير";
    };
    readonly 'state.longNumber': {
        readonly kind: "badge";
        readonly text: "رقم طويل";
    };
    readonly 'state.multiSelect': {
        readonly kind: "badge";
        readonly text: "تحديد متعدد";
    };
    readonly 'state.scrollRow': {
        readonly kind: "badge";
        readonly text: "قابل للتمرير";
    };
    readonly 'state.driver': {
        readonly kind: "badge";
        readonly text: "وضع السائق";
    };
    readonly 'state.default': {
        readonly kind: "badge";
        readonly text: "افتراضي";
    };
    readonly 'state.landed': {
        readonly kind: "badge";
        readonly text: "وصل محفوظ";
    };
    readonly 'state.todayProject': {
        readonly kind: "badge";
        readonly text: "مشروع اليوم";
    };
    readonly 'today.date': {
        readonly kind: "badge";
        readonly text: "الجمعة 27/11/2026";
    };
    readonly 'section.now': {
        readonly kind: "title";
        readonly text: "الآن";
    };
    readonly 'now.in40': {
        readonly kind: "help";
        readonly text: "بعد 40 دقيقة";
    };
    readonly 'tile.fundsNow': {
        readonly kind: "help";
        readonly text: "في الصناديق الآن";
    };
    readonly 'tile.todayNext': {
        readonly kind: "help";
        readonly text: "اليوم · التالي 4:00 م";
    };
    readonly 'tile.running': {
        readonly kind: "badge";
        readonly text: "جارية";
    };
    readonly 'tile.offers': {
        readonly kind: "badge";
        readonly text: "عروض";
    };
    readonly 'state.debt': {
        readonly kind: "badge";
        readonly text: "دين";
    };
    readonly 'state.hidden': {
        readonly kind: "badge";
        readonly text: "مخفي";
    };
    readonly 'state.missing': {
        readonly kind: "badge";
        readonly text: "مفقود";
    };
    readonly 'state.loading': {
        readonly kind: "badge";
        readonly text: "تحميل";
    };
    readonly 'state.empty': {
        readonly kind: "badge";
        readonly text: "فراغ";
    };
    readonly 'state.normal': {
        readonly kind: "badge";
        readonly text: "عادي";
    };
    readonly 'state.disabled': {
        readonly kind: "badge";
        readonly text: "معطّل";
    };
    readonly 'state.longest': {
        readonly kind: "badge";
        readonly text: "أطول قيمة";
    };
    readonly 'state.sizes': {
        readonly kind: "badge";
        readonly text: "المقاسات";
    };
    readonly 'state.tabular': {
        readonly kind: "badge";
        readonly text: "أرقام جدولية";
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
    readonly 'sr.notifications': {
        readonly kind: "screen-reader";
        readonly text: "الإشعارات";
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
    readonly 'sr.back': {
        readonly kind: "screen-reader";
        readonly text: "رجوع";
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
    readonly 'sr.saveSaved': {
        readonly kind: "screen-reader";
        readonly text: "حُفظت الحركة";
    };
    readonly 'sr.saveFailed': {
        readonly kind: "error";
        readonly text: "لم تُحفظ الحركة. الاتصال انقطع.";
    };
    readonly 'placeholder.phone': {
        readonly kind: "placeholder";
        readonly text: "07X XXX XXXX";
    };
    readonly 'day.0': {
        readonly kind: "badge";
        readonly text: "أحد";
    };
    readonly 'day.1': {
        readonly kind: "badge";
        readonly text: "اثنين";
    };
    readonly 'day.2': {
        readonly kind: "badge";
        readonly text: "ثلاثاء";
    };
    readonly 'day.3': {
        readonly kind: "badge";
        readonly text: "أربعاء";
    };
    readonly 'day.4': {
        readonly kind: "badge";
        readonly text: "خميس";
    };
    readonly 'day.5': {
        readonly kind: "badge";
        readonly text: "جمعة";
    };
    readonly 'day.6': {
        readonly kind: "badge";
        readonly text: "سبت";
    };
    readonly 'month.1': {
        readonly kind: "screen-reader";
        readonly text: "كانون الثاني";
    };
    readonly 'month.2': {
        readonly kind: "screen-reader";
        readonly text: "شباط";
    };
    readonly 'month.3': {
        readonly kind: "screen-reader";
        readonly text: "آذار";
    };
    readonly 'month.4': {
        readonly kind: "screen-reader";
        readonly text: "نيسان";
    };
    readonly 'month.5': {
        readonly kind: "screen-reader";
        readonly text: "أيار";
    };
    readonly 'month.6': {
        readonly kind: "screen-reader";
        readonly text: "حزيران";
    };
    readonly 'month.7': {
        readonly kind: "screen-reader";
        readonly text: "تموز";
    };
    readonly 'month.8': {
        readonly kind: "screen-reader";
        readonly text: "آب";
    };
    readonly 'month.9': {
        readonly kind: "screen-reader";
        readonly text: "أيلول";
    };
    readonly 'month.10': {
        readonly kind: "screen-reader";
        readonly text: "تشرين الأول";
    };
    readonly 'month.11': {
        readonly kind: "screen-reader";
        readonly text: "تشرين الثاني";
    };
    readonly 'month.12': {
        readonly kind: "screen-reader";
        readonly text: "كانون الأول";
    };
    readonly 'order.draft': {
        readonly kind: "badge";
        readonly text: "مسودة";
    };
    readonly 'order.tentative': {
        readonly kind: "badge";
        readonly text: "اتفاق مبدئي";
    };
    readonly 'order.confirmed': {
        readonly kind: "badge";
        readonly text: "مؤكد";
    };
    readonly 'order.inProgress': {
        readonly kind: "badge";
        readonly text: "قيد التنفيذ";
    };
    readonly 'order.ready': {
        readonly kind: "badge";
        readonly text: "جاهز";
    };
    readonly 'order.delivered': {
        readonly kind: "badge";
        readonly text: "تم التسليم";
    };
    readonly 'order.settled': {
        readonly kind: "badge";
        readonly text: "تمت التسوية";
    };
    readonly 'order.deferred': {
        readonly kind: "badge";
        readonly text: "مؤجل";
    };
    readonly 'order.cancelled': {
        readonly kind: "badge";
        readonly text: "ملغى";
    };
    readonly 'order.needsReview': {
        readonly kind: "badge";
        readonly text: "يحتاج مراجعة";
    };
    readonly 'next.draft': {
        readonly kind: "button";
        readonly text: "أضف السعر والموعد";
    };
    readonly 'next.tentative': {
        readonly kind: "button";
        readonly text: "ابدأ التنفيذ";
    };
    readonly 'next.confirmed': {
        readonly kind: "button";
        readonly text: "ابدأ التنفيذ";
    };
    readonly 'next.inProgress': {
        readonly kind: "button";
        readonly text: "أكمل التنفيذ";
    };
    readonly 'next.ready': {
        readonly kind: "button";
        readonly text: "سجّل التسليم";
    };
    readonly 'next.delivered': {
        readonly kind: "button";
        readonly text: "راجع التحصيل والنتيجة";
    };
    readonly 'next.settled': {
        readonly kind: "button";
        readonly text: "راجع نتيجة الطلب";
    };
    readonly 'next.deferred': {
        readonly kind: "button";
        readonly text: "راجع سبب التأجيل";
    };
    readonly 'next.cancelled': {
        readonly kind: "button";
        readonly text: "راجع تسوية الطلب";
    };
    readonly 'next.needsReview': {
        readonly kind: "button";
        readonly text: "راجع الطلب";
    };
    readonly 'avail.available': {
        readonly kind: "badge";
        readonly text: "متوفر";
    };
    readonly 'avail.onRequest': {
        readonly kind: "badge";
        readonly text: "بالطلب";
    };
    readonly 'avail.unavailable': {
        readonly kind: "badge";
        readonly text: "غير متوفر مؤقتاً";
    };
    readonly 'report.misleading': {
        readonly kind: "badge";
        readonly text: "معلومات مضللة";
    };
    readonly 'report.offTopic': {
        readonly kind: "badge";
        readonly text: "خارج النطاق المسموح";
    };
    readonly 'report.spam': {
        readonly kind: "badge";
        readonly text: "إعلان مزعج";
    };
    readonly 'report.contact': {
        readonly kind: "badge";
        readonly text: "مشكلة في التواصل";
    };
    readonly 'report.other': {
        readonly kind: "badge";
        readonly text: "سبب آخر";
    };
    readonly 'report.writeReason': {
        readonly kind: "badge";
        readonly text: "اكتب السبب";
    };
    readonly 'checkbox.tickThis': {
        readonly kind: "help";
        readonly text: "أشّر على هذا البند.";
    };
    readonly 'radio.choose': {
        readonly kind: "help";
        readonly text: "اختر {label}.";
    };
    readonly 'lab.h.radio': {
        readonly kind: "title";
        readonly text: "اختيار من قائمة";
    };
    readonly 'lab.tools': {
        readonly kind: "screen-reader";
        readonly text: "أدوات المختبر";
    };
    readonly 'lab.toolsTitle': {
        readonly kind: "title";
        readonly text: "أدوات المختبر";
    };
    readonly 'lab.h.toggle': {
        readonly kind: "title";
        readonly text: "إعداد يعمل فوراً";
    };
    readonly 'title.toggle': {
        readonly kind: "title";
        readonly text: "المفتاح";
    };
    readonly 'title.radio': {
        readonly kind: "title";
        readonly text: "مجموعة الراديو";
    };
    readonly 'sr.clearSearch': {
        readonly kind: "screen-reader";
        readonly text: "امسح البحث";
    };
    readonly 'search.in': {
        readonly kind: "placeholder";
        readonly text: "ابحث في {area}";
    };
    readonly 'lab.h.searchField': {
        readonly kind: "title";
        readonly text: "بحث داخل قسم";
    };
    readonly 'lab.h.textArea': {
        readonly kind: "title";
        readonly text: "نص متعدد الأسطر";
    };
    readonly 'lab.h.amountField': {
        readonly kind: "title";
        readonly text: "حقل المبالغ";
    };
    readonly 'title.amountField': {
        readonly kind: "title";
        readonly text: "حقل المبلغ";
    };
    readonly 'title.textArea': {
        readonly kind: "title";
        readonly text: "حقل الملاحظة";
    };
    readonly 'title.searchField': {
        readonly kind: "title";
        readonly text: "حقل البحث";
    };
    readonly 'lab.h.checkbox': {
        readonly kind: "title";
        readonly text: "بنود تُشَرّ مستقلة";
    };
    readonly 'state.errorRow': {
        readonly kind: "badge";
        readonly text: "حالة الخطأ";
    };
    readonly 'state.fractionFull': {
        readonly kind: "badge";
        readonly text: "خانات كاملة";
    };
    readonly 'title.checkbox': {
        readonly kind: "title";
        readonly text: "مربع الاختيار";
    };
};
export declare const ar: {
    'fund.lastMovement': {
        readonly kind: "badge";
        readonly text: "آخر حركة:";
    };
    'fund.cashDrawer': {
        readonly kind: "badge";
        readonly text: "درج الكاش";
    };
    'fund.bankAccount': {
        readonly kind: "badge";
        readonly text: "الحساب البنكي";
    };
    'fund.walletName': {
        readonly kind: "badge";
        readonly text: "المحفظة";
    };
    'fund.balanceWord': {
        readonly kind: "screen-reader";
        readonly text: "الرصيد";
    };
    'fund.negativeBalance': {
        readonly kind: "badge";
        readonly text: "رصيد سالب";
    };
    'debt.forYou': {
        readonly kind: "badge";
        readonly text: "لك";
    };
    'debt.againstYou': {
        readonly kind: "badge";
        readonly text: "عليك";
    };
    'debt.dueOn': {
        readonly kind: "help";
        readonly text: "يستحق {date}";
    };
    'debt.overdue': {
        readonly kind: "badge";
        readonly text: "متأخر";
    };
    'debt.settled': {
        readonly kind: "badge";
        readonly text: "سُدّد";
    };
    'metric.weekIn': {
        readonly kind: "title";
        readonly text: "الداخل هذا الأسبوع";
    };
    'payment.paid': {
        readonly kind: "badge";
        readonly text: "دُفع";
    };
    'payment.remaining': {
        readonly kind: "badge";
        readonly text: "بقي";
    };
    'sr.listSeparator': {
        readonly kind: "screen-reader";
        readonly text: "، ";
    };
    'sr.movementRowOut': {
        readonly kind: "screen-reader";
        readonly text: "خارج";
    };
    'sr.movementRowIn': {
        readonly kind: "screen-reader";
        readonly text: "داخل";
    };
    'transfer.arrow': {
        readonly kind: "badge";
        readonly text: "←";
    };
    'sr.transferFrom': {
        readonly kind: "screen-reader";
        readonly text: "تحويل من {from} إلى {to}";
    };
    'sr.fundHasDraft': {
        readonly kind: "screen-reader";
        readonly text: "فيه مسودة";
    };
    'sr.debtProgress': {
        readonly kind: "screen-reader";
        readonly text: "دُفع {paid} من {total}";
    };
    'title.funds': {
        readonly kind: "title";
        readonly text: "الصناديق";
    };
    'title.debts': {
        readonly kind: "title";
        readonly text: "الديون";
    };
    'state.negativeBalance': {
        readonly kind: "badge";
        readonly text: "رصيد سالب";
    };
    'state.opened': {
        readonly kind: "badge";
        readonly text: "فُتح:";
    };
    'state.pressed': {
        readonly kind: "badge";
        readonly text: "مرات الضغط:";
    };
    'lab.h.movementRow': {
        readonly kind: "title";
        readonly text: "صف حركة مالية";
    };
    'lab.h.transferRow': {
        readonly kind: "title";
        readonly text: "صف تحويل صندوقين";
    };
    'lab.h.fundCard': {
        readonly kind: "title";
        readonly text: "بطاقة صندوق ورصيده";
    };
    'lab.h.debtCard': {
        readonly kind: "title";
        readonly text: "بطاقة دين ودفعاته";
    };
    'lab.h.debtSummary': {
        readonly kind: "title";
        readonly text: "ملخص الديون";
    };
    'lab.h.paymentProgress': {
        readonly kind: "title";
        readonly text: "شريط تقدم السداد";
    };
    'lab.h.financeCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة المالية";
    };
    'order.delivery': {
        readonly kind: "badge";
        readonly text: "التسليم";
    };
    'order.deliver': {
        readonly kind: "button";
        readonly text: "سلّم الطلب";
    };
    'order.duration': {
        readonly kind: "badge";
        readonly text: "موعد بمدة";
    };
    'order.today': {
        readonly kind: "badge";
        readonly text: "اليوم";
    };
    'order.tomorrow': {
        readonly kind: "badge";
        readonly text: "غداً";
    };
    'order.yesterday': {
        readonly kind: "badge";
        readonly text: "أمس";
    };
    'agenda.noTime': {
        readonly kind: "title";
        readonly text: "بلا وقت";
    };
    'agenda.emptyDay': {
        readonly kind: "empty";
        readonly text: "مواعيد هذا اليوم تظهر هنا.";
    };
    'agenda.emptyAll': {
        readonly kind: "empty";
        readonly text: "لا عناصر في هذه الفترة.";
    };
    'slot.morning': {
        readonly kind: "title";
        readonly text: "صباحاً";
    };
    'slot.evening': {
        readonly kind: "title";
        readonly text: "مساءً";
    };
    'slot.empty': {
        readonly kind: "empty";
        readonly text: "لا أوقات متاحة في هذا اليوم.";
    };
    'minute.one': {
        readonly kind: "badge";
        readonly text: "دقيقة";
    };
    'minute.few': {
        readonly kind: "badge";
        readonly text: "دقائق";
    };
    'hour.one': {
        readonly kind: "badge";
        readonly text: "ساعة";
    };
    'hour.two': {
        readonly kind: "badge";
        readonly text: "ساعتان";
    };
    'hour.few': {
        readonly kind: "badge";
        readonly text: "ساعات";
    };
    'sr.weekStripToday': {
        readonly kind: "screen-reader";
        readonly text: "اليوم";
    };
    'sr.weekStripItems': {
        readonly kind: "screen-reader";
        readonly text: "{counted}";
    };
    'sr.slotUnavailable': {
        readonly kind: "screen-reader";
        readonly text: "غير متاح";
    };
    'sr.statusTrackStages': {
        readonly kind: "screen-reader";
        readonly text: "المراحل";
    };
    'sr.statusTrackStep': {
        readonly kind: "screen-reader";
        readonly text: "المرحلة {n} من {m}";
    };
    'sr.statusTrackOf': {
        readonly kind: "screen-reader";
        readonly text: "من {m}";
    };
    'sr.timelineItems': {
        readonly kind: "screen-reader";
        readonly text: "عناصر اليوم بالترتيب";
    };
    'sr.timelineNow': {
        readonly kind: "screen-reader";
        readonly text: "الآن";
    };
    'orders.listView': {
        readonly kind: "badge";
        readonly text: "القائمة";
    };
    'orders.calendarView': {
        readonly kind: "badge";
        readonly text: "التقويم";
    };
    'orders.all': {
        readonly kind: "badge";
        readonly text: "الكل";
    };
    'orders.active': {
        readonly kind: "badge";
        readonly text: "الجارية";
    };
    'orders.log': {
        readonly kind: "badge";
        readonly text: "السجل";
    };
    'state.selected': {
        readonly kind: "badge";
        readonly text: "المحدد:";
    };
    'lab.h.orderCard': {
        readonly kind: "title";
        readonly text: "بطاقة طلب";
    };
    'lab.h.weekStrip': {
        readonly kind: "title";
        readonly text: "شريط أيام الأسبوع";
    };
    'lab.h.dayTimeline': {
        readonly kind: "title";
        readonly text: "جدول اليوم بالساعات";
    };
    'lab.h.agendaList': {
        readonly kind: "title";
        readonly text: "قائمة عناصر بالأيام";
    };
    'lab.h.slotPicker': {
        readonly kind: "title";
        readonly text: "أوقات متاحة للاختيار";
    };
    'lab.h.ordersCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة الطلبات";
    };
    'delivery.to': {
        readonly kind: "badge";
        readonly text: "إلى";
    };
    'delivery.fromWord': {
        readonly kind: "badge";
        readonly text: "من";
    };
    'delivery.from': {
        readonly kind: "help";
        readonly text: "من {area} · {desc}";
    };
    'delivery.reviewQuotes': {
        readonly kind: "button";
        readonly text: "راجع العروض";
    };
    'quote.offerFrom': {
        readonly kind: "screen-reader";
        readonly text: "عرض من {label}";
    };
    'quote.approved': {
        readonly kind: "screen-reader";
        readonly text: "معتمد";
    };
    'quote.resultSentence': {
        readonly kind: "help";
        readonly text: "بالقبول يبدأ السائق المهمة.";
    };
    'quote.accept': {
        readonly kind: "button";
        readonly text: "اقبل العرض";
    };
    'quote.reject': {
        readonly kind: "button";
        readonly text: "ارفض";
    };
    'quote.expiry': {
        readonly kind: "help";
        readonly text: "ينتهي {time}";
    };
    'quote.expiringSoon': {
        readonly kind: "badge";
        readonly text: "ينتهي قريباً";
    };
    'quote.acceptOutcome': {
        readonly kind: "help";
        readonly text: "بالقبول يبدأ السائق المهمة.";
    };
    'quote.rejected': {
        readonly kind: "badge";
        readonly text: "مرفوض";
    };
    'quote.superseded': {
        readonly kind: "badge";
        readonly text: "مستبدل";
    };
    'quote.expired': {
        readonly kind: "badge";
        readonly text: "انتهى";
    };
    'issue.title': {
        readonly kind: "title";
        readonly text: "تعذّر التسليم";
    };
    'issue.reason': {
        readonly kind: "badge";
        readonly text: "السبب";
    };
    'issue.proposed': {
        readonly kind: "badge";
        readonly text: "الإجراء المقترح";
    };
    'issue.awaitingOwner': {
        readonly kind: "help";
        readonly text: "بانتظار موافقة المالك";
    };
    'issue.agreedAt': {
        readonly kind: "help";
        readonly text: "وافقت · {time}";
    };
    'issue.rejectedAt': {
        readonly kind: "help";
        readonly text: "رفضت · {time}";
    };
    'contact.call': {
        readonly kind: "button";
        readonly text: "اتصل";
    };
    'contact.whatsapp': {
        readonly kind: "button";
        readonly text: "واتساب";
    };
    'contact.marketNote': {
        readonly kind: "help";
        readonly text: "الشراء والتواصل خارج Micro.";
    };
    'evidence.title': {
        readonly kind: "title";
        readonly text: "إثبات التسليم";
    };
    'evidence.takePhoto': {
        readonly kind: "button";
        readonly text: "التقط صورة";
    };
    'evidence.codeLabel': {
        readonly kind: "help";
        readonly text: "الرمز من المستلم";
    };
    'evidence.ownerSentence': {
        readonly kind: "help";
        readonly text: "المالك يؤكد التسليم.";
    };
    'evidence.confirm': {
        readonly kind: "button";
        readonly text: "أكّد التسليم";
    };
    'evidence.codeError': {
        readonly kind: "error";
        readonly text: "الرمز غير صحيح. اسأل المستلم مرة أخرى.";
    };
    'evidence.entered': {
        readonly kind: "help";
        readonly text: "أُدخل الرمز ✓";
    };
    'evidence.retake': {
        readonly kind: "help";
        readonly text: "أعد الالتقاط";
    };
    'evidence.photoMissing': {
        readonly kind: "help";
        readonly text: "لم تُلتقط بعد";
    };
    'evidence.photoTaken': {
        readonly kind: "help";
        readonly text: "صورة مُلتقطة";
    };
    'location.openMaps': {
        readonly kind: "button";
        readonly text: "افتح في الخرائط";
    };
    'job.priceLabel': {
        readonly kind: "badge";
        readonly text: "سعرك";
    };
    'job.sendQuote': {
        readonly kind: "button";
        readonly text: "أرسل العرض";
    };
    'job.cannotDeliver': {
        readonly kind: "button";
        readonly text: "لم أستطع التسليم";
    };
    'job.sendToOwner': {
        readonly kind: "button";
        readonly text: "أرسل للمالك";
    };
    'job.slideDelivered': {
        readonly kind: "button";
        readonly text: "اسحب: تمّ التسليم";
    };
    'driver.pending': {
        readonly kind: "badge";
        readonly text: "بانتظار الاعتماد";
    };
    'driver.approved': {
        readonly kind: "badge";
        readonly text: "معتمد";
    };
    'driver.rejected': {
        readonly kind: "badge";
        readonly text: "مرفوض";
    };
    'driver.pendingSentence': {
        readonly kind: "help";
        readonly text: "طلبك قيد المراجعة. ستصلك الطلبات بعد الاعتماد.";
    };
    'sr.contactCall': {
        readonly kind: "screen-reader";
        readonly text: "اتصل بـ{name}";
    };
    'sr.contactWhatsapp': {
        readonly kind: "screen-reader";
        readonly text: "واتساب {name}، يفتح تطبيقاً آخر";
    };
    'sr.openMaps': {
        readonly kind: "screen-reader";
        readonly text: "افتح العنوان في الخرائط، يفتح تطبيقاً آخر";
    };
    'sr.jobTrack': {
        readonly kind: "screen-reader";
        readonly text: "مراحل التوصيل: المرحلة {current} من {total}";
    };
    'sr.evidenceNotTaken': {
        readonly kind: "screen-reader";
        readonly text: "لم تُلتقط بعد";
    };
    'sr.evidencePhoto': {
        readonly kind: "screen-reader";
        readonly text: "صورة";
    };
    'state.assigned': {
        readonly kind: "badge";
        readonly text: "سائق معيّن";
    };
    'state.decided': {
        readonly kind: "badge";
        readonly text: "بعد القرار";
    };
    'state.awaitingOwner': {
        readonly kind: "badge";
        readonly text: "بانتظار المالك";
    };
    'state.driverBlocked': {
        readonly kind: "badge";
        readonly text: "تعذّر";
    };
    'state.driverActive': {
        readonly kind: "badge";
        readonly text: "قيد التنفيذ";
    };
    'state.driver': {
        readonly kind: "badge";
        readonly text: "السائق";
    };
    'state.stage': {
        readonly kind: "badge";
        readonly text: "المرحلة";
    };
    'visitor.locked': {
        readonly kind: "badge";
        readonly text: "زائر";
    };
    'delivery.requests': {
        readonly kind: "badge";
        readonly text: "الطلبات";
    };
    'delivery.driverView': {
        readonly kind: "badge";
        readonly text: "وضع السائق";
    };
    'lab.h.deliveryRequestCard': {
        readonly kind: "title";
        readonly text: "بطاقة طلب توصيل";
    };
    'lab.h.quoteCard': {
        readonly kind: "title";
        readonly text: "بطاقة عرض سعر";
    };
    'lab.h.statusTrack': {
        readonly kind: "title";
        readonly text: "مسار الحالة";
    };
    'lab.h.jobTrack': {
        readonly kind: "title";
        readonly text: "مسار مراحل التوصيل";
    };
    'lab.h.issueProposalCard': {
        readonly kind: "title";
        readonly text: "مقترح تعذّر التسليم";
    };
    'lab.h.contactBar': {
        readonly kind: "title";
        readonly text: "اتصال وواتساب";
    };
    'lab.h.evidenceSlot': {
        readonly kind: "title";
        readonly text: "إثبات التسليم";
    };
    'lab.h.locationSlot': {
        readonly kind: "title";
        readonly text: "عنوانا من وإلى";
    };
    'lab.h.driverJobCard': {
        readonly kind: "title";
        readonly text: "مهمة السائق الحالية";
    };
    'lab.h.driverApprovalStatus': {
        readonly kind: "title";
        readonly text: "حالة اعتماد السائق";
    };
    'lab.h.deliveryCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة التوصيل";
    };
    'listing.perUnit': {
        readonly kind: "badge";
        readonly text: "/ {unit}";
    };
    'listing.from': {
        readonly kind: "badge";
        readonly text: "من";
    };
    'listing.unavailable': {
        readonly kind: "badge";
        readonly text: "غير متوفر";
    };
    'listing.byRequest': {
        readonly kind: "badge";
        readonly text: "بالطلب";
    };
    'tier.from': {
        readonly kind: "badge";
        readonly text: "من";
    };
    'tier.to': {
        readonly kind: "badge";
        readonly text: "إلى";
    };
    'tier.pricePerUnit': {
        readonly kind: "badge";
        readonly text: "السعر للعبوة";
    };
    'tier.andAbove': {
        readonly kind: "badge";
        readonly text: "فما فوق";
    };
    'tier.tableName': {
        readonly kind: "title";
        readonly text: "شرائح السعر";
    };
    'supplier.oneOffer': {
        readonly kind: "badge";
        readonly text: "عرض واحد";
    };
    'supplier.twoOffers': {
        readonly kind: "badge";
        readonly text: "عرضان";
    };
    'supplier.offers': {
        readonly kind: "badge";
        readonly text: "{n} عروض";
    };
    'supplier.offersMany': {
        readonly kind: "badge";
        readonly text: "{n} عرضاً";
    };
    'gallery.imageOf': {
        readonly kind: "screen-reader";
        readonly text: "صورة {current} من {total}";
    };
    'gallery.prev': {
        readonly kind: "screen-reader";
        readonly text: "السابق";
    };
    'gallery.next': {
        readonly kind: "screen-reader";
        readonly text: "التالي";
    };
    'gallery.close': {
        readonly kind: "screen-reader";
        readonly text: "أغلق الصور";
    };
    'gallery.zoomIn': {
        readonly kind: "screen-reader";
        readonly text: "كبّر";
    };
    'gallery.zoomOut': {
        readonly kind: "screen-reader";
        readonly text: "صغّر";
    };
    'gallery.loadFailed': {
        readonly kind: "error";
        readonly text: "لم تُحمَّل الصورة.";
    };
    'report.title': {
        readonly kind: "title";
        readonly text: "أبلغ عن العرض";
    };
    'report.details': {
        readonly kind: "badge";
        readonly text: "تفاصيل";
    };
    'report.detailsOptional': {
        readonly kind: "help";
        readonly text: "اختياري";
    };
    'report.send': {
        readonly kind: "button";
        readonly text: "أرسل البلاغ";
    };
    'report.chooseReason': {
        readonly kind: "error";
        readonly text: "اختر سبب البلاغ";
    };
    'report.sent': {
        readonly kind: "success";
        readonly text: "أُرسل البلاغ";
    };
    'editor.photos': {
        readonly kind: "badge";
        readonly text: "الصور";
    };
    'editor.listingName': {
        readonly kind: "badge";
        readonly text: "اسم العرض";
    };
    'editor.unit': {
        readonly kind: "badge";
        readonly text: "العبوة";
    };
    'editor.singlePrice': {
        readonly kind: "badge";
        readonly text: "سعر واحد";
    };
    'editor.tiers': {
        readonly kind: "badge";
        readonly text: "شرائح";
    };
    'editor.pricePerUnit': {
        readonly kind: "badge";
        readonly text: "السعر للعبوة";
    };
    'editor.sendReview': {
        readonly kind: "button";
        readonly text: "أرسل للمراجعة";
    };
    'editor.sendEdit': {
        readonly kind: "button";
        readonly text: "أرسل التعديل";
    };
    'editor.editTitle': {
        readonly kind: "title";
        readonly text: "عدّل العرض";
    };
    'editor.newTitle': {
        readonly kind: "title";
        readonly text: "عرض جديد";
    };
    'editor.unitHint': {
        readonly kind: "placeholder";
        readonly text: "كرتونة 12 قطعة";
    };
    'editor.priceMode': {
        readonly kind: "badge";
        readonly text: "السعر";
    };
    'editor.available': {
        readonly kind: "badge";
        readonly text: "متوفر";
    };
    'editor.description': {
        readonly kind: "badge";
        readonly text: "الوصف";
    };
    'editor.nameRequired': {
        readonly kind: "error";
        readonly text: "اكتب اسم العرض.";
    };
    'editor.unitRequired': {
        readonly kind: "error";
        readonly text: "اكتب العبوة.";
    };
    'editor.priceRequired': {
        readonly kind: "error";
        readonly text: "اكتب السعر.";
    };
    'editor.photoRequired': {
        readonly kind: "error";
        readonly text: "أضف صورة واحدة على الأقل.";
    };
    'listing.reviewPending': {
        readonly kind: "badge";
        readonly text: "قيد المراجعة";
    };
    'listing.approved': {
        readonly kind: "badge";
        readonly text: "معتمد";
    };
    'listing.rejected': {
        readonly kind: "badge";
        readonly text: "مرفوض";
    };
    'listing.editPending': {
        readonly kind: "help";
        readonly text: "تعديل قيد المراجعة";
    };
    'listing.editRejected': {
        readonly kind: "badge";
        readonly text: "رُفض التعديل";
    };
    'sr.galleryRegion': {
        readonly kind: "screen-reader";
        readonly text: "معرض";
    };
    'sr.tierTable': {
        readonly kind: "screen-reader";
        readonly text: "شرائح السعر";
    };
    'lab.h.listingCard': {
        readonly kind: "title";
        readonly text: "بطاقة عرض";
    };
    'lab.h.gallery': {
        readonly kind: "title";
        readonly text: "صور العرض والعارض";
    };
    'lab.h.priceTierTable': {
        readonly kind: "title";
        readonly text: "جدول شرائح السعر";
    };
    'lab.h.supplierHeader': {
        readonly kind: "title";
        readonly text: "رأس صفحة المورد";
    };
    'lab.h.reportSheet': {
        readonly kind: "title";
        readonly text: "ورقة الإبلاغ";
    };
    'lab.h.listingEditor': {
        readonly kind: "title";
        readonly text: "نموذج إنشاء عرض";
    };
    'lab.h.listingStatusBadge': {
        readonly kind: "title";
        readonly text: "شارة حالة العرض";
    };
    'lab.h.marketCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة السوق";
    };
    'review.newListing': {
        readonly kind: "badge";
        readonly text: "عرض جديد";
    };
    'review.editListing': {
        readonly kind: "badge";
        readonly text: "تعديل عرض";
    };
    'review.newDriver': {
        readonly kind: "badge";
        readonly text: "سائق جديد";
    };
    'review.report': {
        readonly kind: "badge";
        readonly text: "بلاغ";
    };
    'review.sinceAgo': {
        readonly kind: "help";
        readonly text: "منذ {duration}";
    };
    'review.emptyQueue': {
        readonly kind: "empty";
        readonly text: "لا شيء ينتظر المراجعة.";
    };
    'review.emptyReports': {
        readonly kind: "empty";
        readonly text: "لا بلاغات.";
    };
    'review.beforeApprove': {
        readonly kind: "title";
        readonly text: "بنود التحقق";
    };
    'review.firstListing': {
        readonly kind: "badge";
        readonly text: "أول عرض";
    };
    'review.verificationCall': {
        readonly kind: "help";
        readonly text: "أجريت اتصال التحقق مع المورد";
    };
    'review.tickAllFirst': {
        readonly kind: "help";
        readonly text: "أشّر على كل البنود أولاً.";
    };
    'review.decisionReason': {
        readonly kind: "badge";
        readonly text: "سبب القرار";
    };
    'review.approve': {
        readonly kind: "button";
        readonly text: "اعتمد العرض";
    };
    'review.reject': {
        readonly kind: "button";
        readonly text: "ارفض العرض";
    };
    'review.sendRejection': {
        readonly kind: "button";
        readonly text: "أرسل الرفض";
    };
    'review.approvedToast': {
        readonly kind: "success";
        readonly text: "اعتُمد العرض";
    };
    'review.rejectedToast': {
        readonly kind: "success";
        readonly text: "رُفض العرض";
    };
    'review.writeReason': {
        readonly kind: "error";
        readonly text: "اكتب سبب القرار.";
    };
    'reportItem.one': {
        readonly kind: "badge";
        readonly text: "بلاغ";
    };
    'reportItem.two': {
        readonly kind: "badge";
        readonly text: "بلاغان";
    };
    'reportItem.few': {
        readonly kind: "badge";
        readonly text: "{count} بلاغات";
    };
    'driverReview.approve': {
        readonly kind: "button";
        readonly text: "اعتمد السائق";
    };
    'driverReview.reject': {
        readonly kind: "button";
        readonly text: "ارفض";
    };
    'driverReview.approvedToast': {
        readonly kind: "success";
        readonly text: "اعتُمد السائق";
    };
    'driverReview.attachments': {
        readonly kind: "title";
        readonly text: "المرفقات";
    };
    'sr.unread': {
        readonly kind: "screen-reader";
        readonly text: "غير مقروء";
    };
    'sr.reviewItems': {
        readonly kind: "screen-reader";
        readonly text: "{count} بنود، أُشّر على {ticked}";
    };
    'lab.h.reviewQueueItem': {
        readonly kind: "title";
        readonly text: "صف طابور المراجعة";
    };
    'lab.h.decisionCard': {
        readonly kind: "title";
        readonly text: "ورقة قرار الاعتماد";
    };
    'lab.h.driverApprovalCard': {
        readonly kind: "title";
        readonly text: "ورقة اعتماد سائق";
    };
    'lab.h.reportItem': {
        readonly kind: "title";
        readonly text: "صف عرض مبلَّغاً";
    };
    'lab.h.reviewCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة المراجعة";
    };
    'ask.title': {
        readonly kind: "title";
        readonly text: "Ask Micro";
    };
    'ask.askMicro': {
        readonly kind: "badge";
        readonly text: "اسأل Micro";
    };
    'ask.contextPrefix': {
        readonly kind: "help";
        readonly text: "تسأل عن: {context}";
    };
    'ask.you': {
        readonly kind: "screen-reader";
        readonly text: "أنت:";
    };
    'ask.notSent': {
        readonly kind: "error";
        readonly text: "لم يُرسل";
    };
    'ask.resend': {
        readonly kind: "button";
        readonly text: "أعد الإرسال";
    };
    'ask.microPrefix': {
        readonly kind: "screen-reader";
        readonly text: "Micro:";
    };
    'ask.incomplete': {
        readonly kind: "error";
        readonly text: "لم يكتمل الجواب.";
    };
    'ask.retry': {
        readonly kind: "button";
        readonly text: "أعد المحاولة";
    };
    'ask.howCalculated': {
        readonly kind: "button";
        readonly text: "كيف حُسبت؟";
    };
    'ask.numberSource': {
        readonly kind: "title";
        readonly text: "مصدر الرقم";
    };
    'ask.fullTable': {
        readonly kind: "button";
        readonly text: "الجدول كاملاً";
    };
    'ask.gone': {
        readonly kind: "help";
        readonly text: "لم يعد موجوداً";
    };
    'ask.limitPermission': {
        readonly kind: "help";
        readonly text: "هذا خارج صلاحياتك في هذا المشروع.";
    };
    'ask.limitData': {
        readonly kind: "help";
        readonly text: "لا أملك بيانات كافية لهذا السؤال.";
    };
    'ask.recordVoice': {
        readonly kind: "screen-reader";
        readonly text: "سجّل صوتاً";
    };
    'ask.send': {
        readonly kind: "screen-reader";
        readonly text: "أرسل";
    };
    'sr.howCalculated': {
        readonly kind: "screen-reader";
        readonly text: "كيف حُسبت {label}";
    };
    'sr.askAbout': {
        readonly kind: "screen-reader";
        readonly text: "اسأل Micro عن {label}";
    };
    'lab.h.askPanel': {
        readonly kind: "title";
        readonly text: "لوحة المساعد Ask";
    };
    'lab.h.askContextChip': {
        readonly kind: "title";
        readonly text: "رقاقة سياق السؤال";
    };
    'lab.h.askUserMessage': {
        readonly kind: "title";
        readonly text: "رسالة المستخدم";
    };
    'lab.h.askAnswer': {
        readonly kind: "title";
        readonly text: "جواب Micro النصي";
    };
    'lab.h.askComputedResult': {
        readonly kind: "title";
        readonly text: "رقم محسوب ومصدره";
    };
    'lab.h.askInlineTable': {
        readonly kind: "title";
        readonly text: "جدول داخل الجواب";
    };
    'lab.h.askNavResult': {
        readonly kind: "title";
        readonly text: "كائن من الجواب";
    };
    'lab.h.askDraftCard': {
        readonly kind: "title";
        readonly text: "مسودة من الجواب";
    };
    'lab.h.askLimit': {
        readonly kind: "title";
        readonly text: "جواب خارج الصلاحيات";
    };
    'lab.h.askThinking': {
        readonly kind: "title";
        readonly text: "انتظار الجواب";
    };
    'lab.h.askAboutThis': {
        readonly kind: "title";
        readonly text: "زر اسأل عنه";
    };
    'lab.h.askCompose': {
        readonly kind: "title";
        readonly text: "تركيب محادثة Ask";
    };
    'chart.table': {
        readonly kind: "screen-reader";
        readonly text: "جدول";
    };
    'chart.chart': {
        readonly kind: "screen-reader";
        readonly text: "رسم";
    };
    'chart.empty': {
        readonly kind: "empty";
        readonly text: "لا بيانات لهذه الفترة.";
    };
    'chart.thisWeek': {
        readonly kind: "badge";
        readonly text: "هذا الأسبوع";
    };
    'chart.lastWeek': {
        readonly kind: "badge";
        readonly text: "الأسبوع الماضي";
    };
    'chart.other': {
        readonly kind: "badge";
        readonly text: "غير ذلك";
    };
    'lab.h.chartBars': {
        readonly kind: "title";
        readonly text: "أعمدة مبيعات الأيام";
    };
    'lab.h.chartNegative': {
        readonly kind: "title";
        readonly text: "أعمدة فيها خسارة";
    };
    'lab.h.chartRanked': {
        readonly kind: "title";
        readonly text: "أعلى العملاء بالقيمة";
    };
    'lab.h.chartLine': {
        readonly kind: "title";
        readonly text: "خط تغير سنة";
    };
    'lab.h.chartStacked': {
        readonly kind: "title";
        readonly text: "توزيع الخارج بالنسب";
    };
    'lab.h.chartCompare': {
        readonly kind: "title";
        readonly text: "مقارنة أسبوعين";
    };
    'lab.h.chartsCompose': {
        readonly kind: "title";
        readonly text: "تركيب الرسوم";
    };
    'button.saveMovement': {
        readonly kind: "button";
        readonly text: "احفظ الحركة";
    };
    'button.acceptQuote': {
        readonly kind: "button";
        readonly text: "اقبل العرض";
    };
    'button.recordPayment': {
        readonly kind: "button";
        readonly text: "سجّل دفعة";
    };
    'button.deleteMovement': {
        readonly kind: "button";
        readonly text: "احذف الحركة";
    };
    'button.back': {
        readonly kind: "button";
        readonly text: "رجوع";
    };
    'button.retry': {
        readonly kind: "button";
        readonly text: "أعد المحاولة";
    };
    'button.recordMovement': {
        readonly kind: "button";
        readonly text: "سجّل حركة";
    };
    'button.reviewAndSave': {
        readonly kind: "button";
        readonly text: "راجع واحفظ";
    };
    'button.all': {
        readonly kind: "button";
        readonly text: "الكل";
    };
    'button.undo': {
        readonly kind: "button";
        readonly text: "تراجع";
    };
    'button.howCalculated': {
        readonly kind: "button";
        readonly text: "كيف حُسبت؟";
    };
    'button.hideAmounts': {
        readonly kind: "button";
        readonly text: "إخفاء المبالغ";
    };
    'button.showAmounts': {
        readonly kind: "button";
        readonly text: "إظهار المبالغ";
    };
    'metric.sourceFrom': {
        readonly kind: "button";
        readonly text: "من {counted}";
    };
    'title.today': {
        readonly kind: "title";
        readonly text: "اليوم";
    };
    'title.needsYou': {
        readonly kind: "title";
        readonly text: "يحتاجك";
    };
    'title.now': {
        readonly kind: "title";
        readonly text: "الآن";
    };
    'confirm.deleteTitle': {
        readonly kind: "title";
        readonly text: "تحذف حركة {amount}؟";
    };
    'badge.done': {
        readonly kind: "badge";
        readonly text: "تمّ";
    };
    'badge.waiting': {
        readonly kind: "badge";
        readonly text: "ينتظر";
    };
    'badge.problem': {
        readonly kind: "badge";
        readonly text: "مشكلة";
    };
    'badge.info': {
        readonly kind: "badge";
        readonly text: "معلومة";
    };
    'badge.neutral': {
        readonly kind: "badge";
        readonly text: "محايد";
    };
    'badge.cancelled': {
        readonly kind: "badge";
        readonly text: "ملغى";
    };
    'nav.today': {
        readonly kind: "badge";
        readonly text: "اليوم";
    };
    'nav.todayLong': {
        readonly kind: "badge";
        readonly text: "مشروع اليوم";
    };
    'nav.agenda': {
        readonly kind: "badge";
        readonly text: "الأجندة";
    };
    'nav.finance': {
        readonly kind: "badge";
        readonly text: "المالية";
    };
    'nav.orders': {
        readonly kind: "badge";
        readonly text: "الطلبات";
    };
    'nav.delivery': {
        readonly kind: "badge";
        readonly text: "التوصيل";
    };
    'nav.market': {
        readonly kind: "badge";
        readonly text: "السوق";
    };
    'role.owner': {
        readonly kind: "badge";
        readonly text: "مالك";
    };
    'role.supplier': {
        readonly kind: "badge";
        readonly text: "مورد";
    };
    'role.driver': {
        readonly kind: "badge";
        readonly text: "سائق";
    };
    'role.reviewer': {
        readonly kind: "badge";
        readonly text: "مراجع";
    };
    'role.admin': {
        readonly kind: "badge";
        readonly text: "مسؤول";
    };
    'movement.in': {
        readonly kind: "badge";
        readonly text: "داخل";
    };
    'movement.counted': {
        readonly kind: "badge";
        readonly text: "32 حركة";
    };
    'row.sampleTitle': {
        readonly kind: "title";
        readonly text: "سلمى الحوراني";
    };
    'sheet.sampleTitle': {
        readonly kind: "title";
        readonly text: "تفاصيل الحركة";
    };
    'sheet.projectTitle': {
        readonly kind: "title";
        readonly text: "تبديل المشروع";
    };
    'sheet.notificationsTitle': {
        readonly kind: "title";
        readonly text: "الإشعارات";
    };
    'sheet.askTitle': {
        readonly kind: "title";
        readonly text: "Ask Micro";
    };
    'sheet.sourceTitle': {
        readonly kind: "title";
        readonly text: "مصدر الرقم";
    };
    'sheet.allTitle': {
        readonly kind: "title";
        readonly text: "كل ما يحتاجك";
    };
    'sheet.objectTitle': {
        readonly kind: "title";
        readonly text: "طلب 1175";
    };
    'notif.quoteArrived': {
        readonly kind: "help";
        readonly text: "وصل عرض سعر من عمر الزعبي";
    };
    'notif.orderToday': {
        readonly kind: "help";
        readonly text: "طلب 1203 موعده اليوم 4:00 م";
    };
    'notif.paymentIn': {
        readonly kind: "help";
        readonly text: "دفعة 30 د من رنا العبادي";
    };
    'notif.timeAgo': {
        readonly kind: "help";
        readonly text: "قبل 5 دقائق";
    };
    'notif.timeToday': {
        readonly kind: "badge";
        readonly text: "9:15 ص";
    };
    'notif.timeYesterday': {
        readonly kind: "help";
        readonly text: "أمس 5:10 م";
    };
    'ask.placeholder': {
        readonly kind: "placeholder";
        readonly text: "اسأل Micro";
    };
    'ask.amountLabel': {
        readonly kind: "badge";
        readonly text: "السؤال";
    };
    'button.askSend': {
        readonly kind: "button";
        readonly text: "أرسل";
    };
    'kv.orderTitle': {
        readonly kind: "badge";
        readonly text: "الطلب";
    };
    'kv.customer': {
        readonly kind: "badge";
        readonly text: "العميل";
    };
    'kv.delivery': {
        readonly kind: "badge";
        readonly text: "التسليم";
    };
    'kv.phone': {
        readonly kind: "badge";
        readonly text: "الهاتف";
    };
    'title.sheet': {
        readonly kind: "title";
        readonly text: "الورقة";
    };
    'confirm.sampleTitle': {
        readonly kind: "title";
        readonly text: "حذف الحركة؟";
    };
    'confirm.sampleSentence': {
        readonly kind: "help";
        readonly text: "ستُحذف الحركة نهائياً ولا يمكن التراجع عنها.";
    };
    'title.confirmSheet': {
        readonly kind: "title";
        readonly text: "ورقة التأكيد";
    };
    'row.sampleCaption': {
        readonly kind: "help";
        readonly text: "فستان سهرة · درج الكاش";
    };
    'row.sampleTime': {
        readonly kind: "help";
        readonly text: "10:24 ص";
    };
    'title.objectRow': {
        readonly kind: "title";
        readonly text: "الصف";
    };
    'state.oneLine': {
        readonly kind: "badge";
        readonly text: "سطر واحد";
    };
    'state.withBadge': {
        readonly kind: "badge";
        readonly text: "مع شارة";
    };
    'title.objectCard': {
        readonly kind: "title";
        readonly text: "بطاقة الكائن";
    };
    'state.withButton': {
        readonly kind: "badge";
        readonly text: "مع زر";
    };
    'title.metric': {
        readonly kind: "title";
        readonly text: "المقياس";
    };
    'title.metricSmall': {
        readonly kind: "title";
        readonly text: "المقياس الصغير";
    };
    'movement.out': {
        readonly kind: "badge";
        readonly text: "خارج";
    };
    'movement.transfer': {
        readonly kind: "badge";
        readonly text: "تحويل";
    };
    'saveState.draft': {
        readonly kind: "badge";
        readonly text: "مسودة · لم تُحفظ";
    };
    'saveState.sending': {
        readonly kind: "badge";
        readonly text: "يُرسل…";
    };
    'saveState.saved': {
        readonly kind: "badge";
        readonly text: "حُفظ";
    };
    'saveState.failed': {
        readonly kind: "error";
        readonly text: "لم يُحفظ — أعد المحاولة";
    };
    'toast.movementSaved': {
        readonly kind: "success";
        readonly text: "حُفظت الحركة";
    };
    'toast.movementDeleted': {
        readonly kind: "success";
        readonly text: "حُذفت الحركة";
    };
    'toast.quoteAccepted': {
        readonly kind: "success";
        readonly text: "قُبل العرض";
    };
    'toast.questionSent': {
        readonly kind: "success";
        readonly text: "أُرسل السؤال";
    };
    'toast.opens': {
        readonly kind: "help";
        readonly text: "تفتح {area}";
    };
    'banner.offline': {
        readonly kind: "error";
        readonly text: "الاتصال انقطع";
    };
    'banner.backOnline': {
        readonly kind: "help";
        readonly text: "عاد الاتصال، لديك مسودة";
    };
    'banner.permission': {
        readonly kind: "help";
        readonly text: "هذا خارج صلاحياتك في هذا المشروع";
    };
    'errorState.loadFailed': {
        readonly kind: "error";
        readonly text: "تعذّر تحميل البيانات. أعد المحاولة.";
    };
    'errorState.updatedAt': {
        readonly kind: "help";
        readonly text: "آخر تحديث {time}";
    };
    'empty.movements': {
        readonly kind: "empty";
        readonly text: "حركات اليوم تظهر هنا.";
    };
    'empty.oneButtonMax': {
        readonly kind: "help";
        readonly text: "زر واحد كحد أقصى، حين يغيب زر الإنشاء";
    };
    'confirm.deleteResult': {
        readonly kind: "help";
        readonly text: "لن تظهر في رصيد {fund}.";
    };
    'metric.deltaHigher': {
        readonly kind: "help";
        readonly text: "{percent} أعلى من أمس";
    };
    'metric.deltaLower': {
        readonly kind: "help";
        readonly text: "{percent} أقل من أمس";
    };
    'metric.deltaHigherHidden': {
        readonly kind: "help";
        readonly text: "أعلى من أمس";
    };
    'metric.deltaLowerHidden': {
        readonly kind: "help";
        readonly text: "أقل من أمس";
    };
    'money.unit': {
        readonly kind: "badge";
        readonly text: "د";
    };
    'money.forYou': {
        readonly kind: "badge";
        readonly text: "لك";
    };
    'money.againstYou': {
        readonly kind: "badge";
        readonly text: "عليك";
    };
    'money.missing': {
        readonly kind: "badge";
        readonly text: "—";
    };
    'money.hiddenGlyph': {
        readonly kind: "badge";
        readonly text: "••••";
    };
    'lab.stamp': {
        readonly kind: "title";
        readonly text: "مختبر الدفعة الأولى";
    };
    'lab.h.amountToggle': {
        readonly kind: "title";
        readonly text: "زر إخفاء الأرقام";
    };
    'lab.h.money': {
        readonly kind: "title";
        readonly text: "شكل المبلغ ووحدته";
    };
    'lab.h.statusBadge': {
        readonly kind: "title";
        readonly text: "شارة الحالة";
    };
    'lab.h.entityMark': {
        readonly kind: "title";
        readonly text: "حرف الطرف";
    };
    'lab.h.button': {
        readonly kind: "title";
        readonly text: "الأزرار";
    };
    'lab.h.iconButton': {
        readonly kind: "title";
        readonly text: "زر أيقونة دائري";
    };
    'lab.h.textField': {
        readonly kind: "title";
        readonly text: "حقل سطر واحد";
    };
    'lab.h.segmentedControl': {
        readonly kind: "title";
        readonly text: "مبدّل خيارات قليلة";
    };
    'lab.h.filterChips': {
        readonly kind: "title";
        readonly text: "رقائق تصفية القائمة";
    };
    'lab.h.surface': {
        readonly kind: "title";
        readonly text: "بطاقة محتوى بيضاء";
    };
    'lab.h.well': {
        readonly kind: "title";
        readonly text: "معلومات داخل بطاقة";
    };
    'lab.h.section': {
        readonly kind: "title";
        readonly text: "عنوان قسم وقائمته";
    };
    'lab.h.hero': {
        readonly kind: "title";
        readonly text: "البطاقة الرئيسية";
    };
    'lab.h.sheet': {
        readonly kind: "title";
        readonly text: "الورقة المنبثقة";
    };
    'lab.h.actionBar': {
        readonly kind: "title";
        readonly text: "شريط الحفظ السفلي";
    };
    'lab.h.skeleton': {
        readonly kind: "title";
        readonly text: "هيكل التحميل";
    };
    'lab.h.emptyState': {
        readonly kind: "title";
        readonly text: "شكل القائمة الفارغة";
    };
    'lab.h.inlineBanner': {
        readonly kind: "title";
        readonly text: "شريط معلومة علوي";
    };
    'lab.h.toast': {
        readonly kind: "title";
        readonly text: "رسالة نجاح سريعة";
    };
    'lab.h.saveState': {
        readonly kind: "title";
        readonly text: "حالة الحفظ";
    };
    'lab.h.pageHeader': {
        readonly kind: "title";
        readonly text: "العنوان وزر الإنشاء";
    };
    'lab.h.tabBar': {
        readonly kind: "title";
        readonly text: "تبويبات أسفل الشاشة";
    };
    'lab.h.contextBar': {
        readonly kind: "title";
        readonly text: "الشريط العلوي الثابت";
    };
    'lab.h.projectSwitcher': {
        readonly kind: "title";
        readonly text: "مبدّل المشروع والدور";
    };
    'lab.h.notificationsButton': {
        readonly kind: "title";
        readonly text: "جرس الإشعارات";
    };
    'lab.h.askButton': {
        readonly kind: "title";
        readonly text: "زر المساعد Micro";
    };
    'lab.h.confirmSheet': {
        readonly kind: "title";
        readonly text: "ورقة تأكيد الحذف";
    };
    'lab.h.objectRow': {
        readonly kind: "title";
        readonly text: "صف في قائمة";
    };
    'lab.h.objectCard': {
        readonly kind: "title";
        readonly text: "بطاقة كائن موسّعة";
    };
    'lab.h.metric': {
        readonly kind: "title";
        readonly text: "الرقم البطل";
    };
    'lab.h.metricSmall': {
        readonly kind: "title";
        readonly text: "رقم مصغّر بعنوانه";
    };
    'lab.h.tile': {
        readonly kind: "title";
        readonly text: "بلاطات اليوم الأربع";
    };
    'lab.fontScale': {
        readonly kind: "badge";
        readonly text: "حجم الخط";
    };
    'lab.scale100': {
        readonly kind: "button";
        readonly text: "100%";
    };
    'lab.scale200': {
        readonly kind: "button";
        readonly text: "200%";
    };
    'title.money': {
        readonly kind: "title";
        readonly text: "المبلغ";
    };
    'title.amountToggle': {
        readonly kind: "title";
        readonly text: "إخفاء المبالغ وإظهارها";
    };
    'title.statusBadge': {
        readonly kind: "title";
        readonly text: "شارة الحالة";
    };
    'state.tones': {
        readonly kind: "badge";
        readonly text: "النغمات";
    };
    'title.entityMark': {
        readonly kind: "title";
        readonly text: "علامة الكيان";
    };
    'title.iconButton': {
        readonly kind: "title";
        readonly text: "زر الأيقونة";
    };
    'title.textField': {
        readonly kind: "title";
        readonly text: "حقل النص";
    };
    'field.supplier': {
        readonly kind: "badge";
        readonly text: "اسم المورد";
    };
    'field.amount': {
        readonly kind: "badge";
        readonly text: "المبلغ";
    };
    'field.optional': {
        readonly kind: "badge";
        readonly text: "اختياري";
    };
    'placeholder.amount': {
        readonly kind: "placeholder";
        readonly text: "0.000";
    };
    'help.supplierName': {
        readonly kind: "help";
        readonly text: "اكتب الاسم كما في السجل الرسمي";
    };
    'error.phoneFormat': {
        readonly kind: "error";
        readonly text: "اكتب الرقم كاملاً بالأرقام الغربية";
    };
    'state.initial': {
        readonly kind: "badge";
        readonly text: "الحرف الأول";
    };
    'state.fundTypes': {
        readonly kind: "badge";
        readonly text: "أنواع الصناديق";
    };
    'state.badged': {
        readonly kind: "badge";
        readonly text: "بشارة تحقق";
    };
    'title.button': {
        readonly kind: "title";
        readonly text: "الزر";
    };
    'variant.primary': {
        readonly kind: "badge";
        readonly text: "أساسي";
    };
    'variant.secondary': {
        readonly kind: "badge";
        readonly text: "ثانوي";
    };
    'variant.text': {
        readonly kind: "badge";
        readonly text: "نصي";
    };
    'variant.danger': {
        readonly kind: "badge";
        readonly text: "خطر";
    };
    'state.withIcon': {
        readonly kind: "badge";
        readonly text: "بأيقونة";
    };
    'title.segmentedControl': {
        readonly kind: "title";
        readonly text: "المبدّل المقسّم";
    };
    'state.twoSegments': {
        readonly kind: "badge";
        readonly text: "جزآن";
    };
    'state.threeSegments': {
        readonly kind: "badge";
        readonly text: "ثلاثة أجزاء";
    };
    'state.fourSegments': {
        readonly kind: "badge";
        readonly text: "أربعة أجزاء";
    };
    'title.filterChips': {
        readonly kind: "title";
        readonly text: "رقائق التصفية";
    };
    'title.surface': {
        readonly kind: "title";
        readonly text: "السطح";
    };
    'state.withHeader': {
        readonly kind: "badge";
        readonly text: "برأس";
    };
    'state.list': {
        readonly kind: "badge";
        readonly text: "قائمة";
    };
    'title.well': {
        readonly kind: "title";
        readonly text: "الحاوي الغائر";
    };
    'title.section': {
        readonly kind: "title";
        readonly text: "القسم";
    };
    'state.withCount': {
        readonly kind: "badge";
        readonly text: "مع عدد";
    };
    'state.emptySection': {
        readonly kind: "badge";
        readonly text: "فارغ";
    };
    'title.tile': {
        readonly kind: "title";
        readonly text: "البلاطات";
    };
    'state.grid4': {
        readonly kind: "badge";
        readonly text: "شبكة 2×2";
    };
    'title.hero': {
        readonly kind: "title";
        readonly text: "السطح البطل";
    };
    'title.actionBar': {
        readonly kind: "title";
        readonly text: "شريط الإجراءات";
    };
    'state.withSecondary': {
        readonly kind: "badge";
        readonly text: "مع ثانوي";
    };
    'state.primaryOnly': {
        readonly kind: "badge";
        readonly text: "أساسي وحده";
    };
    'state.contentMore': {
        readonly kind: "badge";
        readonly text: "بقي محتوى";
    };
    'state.scrolledToEnd': {
        readonly kind: "badge";
        readonly text: "انتهى التمرير";
    };
    'title.askButton': {
        readonly kind: "title";
        readonly text: "زر Ask";
    };
    'state.unread': {
        readonly kind: "badge";
        readonly text: "غير مقروء";
    };
    'title.notificationsButton': {
        readonly kind: "title";
        readonly text: "زر الإشعارات";
    };
    'state.noUnread': {
        readonly kind: "badge";
        readonly text: "بلا نقطة";
    };
    'title.projectSwitcher': {
        readonly kind: "title";
        readonly text: "مبدّل المشروع";
    };
    'state.singleRole': {
        readonly kind: "badge";
        readonly text: "دور واحد";
    };
    'title.contextBar': {
        readonly kind: "title";
        readonly text: "شريط السياق";
    };
    'state.mainScreens': {
        readonly kind: "badge";
        readonly text: "الشاشات الرئيسية";
    };
    'state.subScreens': {
        readonly kind: "badge";
        readonly text: "الشاشات الفرعية";
    };
    'sr.switchProject': {
        readonly kind: "screen-reader";
        readonly text: "تبديل المشروع";
    };
    'title.tabBar': {
        readonly kind: "title";
        readonly text: "شريط التبويبات";
    };
    'title.pageHeader': {
        readonly kind: "title";
        readonly text: "رأس الصفحة";
    };
    'title.movements': {
        readonly kind: "title";
        readonly text: "الحركات";
    };
    'button.new': {
        readonly kind: "button";
        readonly text: "جديد";
    };
    'state.scrolled': {
        readonly kind: "badge";
        readonly text: "عند التمرير";
    };
    'title.saveState': {
        readonly kind: "title";
        readonly text: "حالة الحفظ";
    };
    'title.toast': {
        readonly kind: "title";
        readonly text: "الإشعار العابر";
    };
    'title.inlineBanner': {
        readonly kind: "title";
        readonly text: "الشريط المثبت";
    };
    'title.emptyState': {
        readonly kind: "title";
        readonly text: "حالة الفراغ";
    };
    'title.skeleton': {
        readonly kind: "title";
        readonly text: "هيكل التحميل";
    };
    'lab.index': {
        readonly kind: "help";
        readonly text: "فهرس المكوّنات";
    };
    'state.defaultToast': {
        readonly kind: "badge";
        readonly text: "ثلاث ثوانٍ";
    };
    'state.draft': {
        readonly kind: "badge";
        readonly text: "مسودة";
    };
    'state.sending': {
        readonly kind: "badge";
        readonly text: "يُرسل";
    };
    'state.fiveTabs': {
        readonly kind: "badge";
        readonly text: "خمسة تبويبات";
    };
    'state.withCents': {
        readonly kind: "badge";
        readonly text: "مع فلوس";
    };
    'state.withSparkline': {
        readonly kind: "badge";
        readonly text: "بخط صغير";
    };
    'state.longNumber': {
        readonly kind: "badge";
        readonly text: "رقم طويل";
    };
    'state.multiSelect': {
        readonly kind: "badge";
        readonly text: "تحديد متعدد";
    };
    'state.scrollRow': {
        readonly kind: "badge";
        readonly text: "قابل للتمرير";
    };
    'state.default': {
        readonly kind: "badge";
        readonly text: "افتراضي";
    };
    'state.landed': {
        readonly kind: "badge";
        readonly text: "وصل محفوظ";
    };
    'state.todayProject': {
        readonly kind: "badge";
        readonly text: "مشروع اليوم";
    };
    'today.date': {
        readonly kind: "badge";
        readonly text: "الجمعة 27/11/2026";
    };
    'section.now': {
        readonly kind: "title";
        readonly text: "الآن";
    };
    'now.in40': {
        readonly kind: "help";
        readonly text: "بعد 40 دقيقة";
    };
    'tile.fundsNow': {
        readonly kind: "help";
        readonly text: "في الصناديق الآن";
    };
    'tile.todayNext': {
        readonly kind: "help";
        readonly text: "اليوم · التالي 4:00 م";
    };
    'tile.running': {
        readonly kind: "badge";
        readonly text: "جارية";
    };
    'tile.offers': {
        readonly kind: "badge";
        readonly text: "عروض";
    };
    'state.debt': {
        readonly kind: "badge";
        readonly text: "دين";
    };
    'state.hidden': {
        readonly kind: "badge";
        readonly text: "مخفي";
    };
    'state.missing': {
        readonly kind: "badge";
        readonly text: "مفقود";
    };
    'state.loading': {
        readonly kind: "badge";
        readonly text: "تحميل";
    };
    'state.empty': {
        readonly kind: "badge";
        readonly text: "فراغ";
    };
    'state.normal': {
        readonly kind: "badge";
        readonly text: "عادي";
    };
    'state.disabled': {
        readonly kind: "badge";
        readonly text: "معطّل";
    };
    'state.longest': {
        readonly kind: "badge";
        readonly text: "أطول قيمة";
    };
    'state.sizes': {
        readonly kind: "badge";
        readonly text: "المقاسات";
    };
    'state.tabular': {
        readonly kind: "badge";
        readonly text: "أرقام جدولية";
    };
    'money.ariaMinus': {
        readonly kind: "screen-reader";
        readonly text: "سالب";
    };
    'money.ariaDinar': {
        readonly kind: "screen-reader";
        readonly text: "دينار";
    };
    'money.ariaFils': {
        readonly kind: "screen-reader";
        readonly text: "فلس";
    };
    'money.ariaAnd': {
        readonly kind: "screen-reader";
        readonly text: "و";
    };
    'money.ariaHidden': {
        readonly kind: "screen-reader";
        readonly text: "المبلغ مخفي";
    };
    'money.ariaMissing': {
        readonly kind: "screen-reader";
        readonly text: "القيمة غير متوفرة";
    };
    'sr.notifications': {
        readonly kind: "screen-reader";
        readonly text: "الإشعارات";
    };
    'sr.notificationsCount': {
        readonly kind: "screen-reader";
        readonly text: "الإشعارات، {counted}";
    };
    'sr.askUnread': {
        readonly kind: "screen-reader";
        readonly text: "Ask Micro، جواب غير مقروء";
    };
    'sr.financeNeedsYou': {
        readonly kind: "screen-reader";
        readonly text: "المالية، يحتاجك";
    };
    'sr.askThinking': {
        readonly kind: "screen-reader";
        readonly text: "يعمل Micro على الجواب";
    };
    'sr.askAnswered': {
        readonly kind: "screen-reader";
        readonly text: "وصل الجواب";
    };
    'sr.quoteArrived': {
        readonly kind: "screen-reader";
        readonly text: "وصل عرض سعر من {name}";
    };
    'sr.searchResults': {
        readonly kind: "screen-reader";
        readonly text: "{counted}";
    };
    'sr.ask': {
        readonly kind: "screen-reader";
        readonly text: "Ask Micro";
    };
    'sr.close': {
        readonly kind: "screen-reader";
        readonly text: "إغلاق";
    };
    'sr.back': {
        readonly kind: "screen-reader";
        readonly text: "رجوع";
    };
    'sr.more': {
        readonly kind: "screen-reader";
        readonly text: "المزيد";
    };
    'sr.search': {
        readonly kind: "screen-reader";
        readonly text: "بحث";
    };
    'sr.clear': {
        readonly kind: "screen-reader";
        readonly text: "مسح";
    };
    'sr.saveSaved': {
        readonly kind: "screen-reader";
        readonly text: "حُفظت الحركة";
    };
    'sr.saveFailed': {
        readonly kind: "error";
        readonly text: "لم تُحفظ الحركة. الاتصال انقطع.";
    };
    'placeholder.phone': {
        readonly kind: "placeholder";
        readonly text: "07X XXX XXXX";
    };
    'day.0': {
        readonly kind: "badge";
        readonly text: "أحد";
    };
    'day.1': {
        readonly kind: "badge";
        readonly text: "اثنين";
    };
    'day.2': {
        readonly kind: "badge";
        readonly text: "ثلاثاء";
    };
    'day.3': {
        readonly kind: "badge";
        readonly text: "أربعاء";
    };
    'day.4': {
        readonly kind: "badge";
        readonly text: "خميس";
    };
    'day.5': {
        readonly kind: "badge";
        readonly text: "جمعة";
    };
    'day.6': {
        readonly kind: "badge";
        readonly text: "سبت";
    };
    'month.1': {
        readonly kind: "screen-reader";
        readonly text: "كانون الثاني";
    };
    'month.2': {
        readonly kind: "screen-reader";
        readonly text: "شباط";
    };
    'month.3': {
        readonly kind: "screen-reader";
        readonly text: "آذار";
    };
    'month.4': {
        readonly kind: "screen-reader";
        readonly text: "نيسان";
    };
    'month.5': {
        readonly kind: "screen-reader";
        readonly text: "أيار";
    };
    'month.6': {
        readonly kind: "screen-reader";
        readonly text: "حزيران";
    };
    'month.7': {
        readonly kind: "screen-reader";
        readonly text: "تموز";
    };
    'month.8': {
        readonly kind: "screen-reader";
        readonly text: "آب";
    };
    'month.9': {
        readonly kind: "screen-reader";
        readonly text: "أيلول";
    };
    'month.10': {
        readonly kind: "screen-reader";
        readonly text: "تشرين الأول";
    };
    'month.11': {
        readonly kind: "screen-reader";
        readonly text: "تشرين الثاني";
    };
    'month.12': {
        readonly kind: "screen-reader";
        readonly text: "كانون الأول";
    };
    'order.draft': {
        readonly kind: "badge";
        readonly text: "مسودة";
    };
    'order.tentative': {
        readonly kind: "badge";
        readonly text: "اتفاق مبدئي";
    };
    'order.confirmed': {
        readonly kind: "badge";
        readonly text: "مؤكد";
    };
    'order.inProgress': {
        readonly kind: "badge";
        readonly text: "قيد التنفيذ";
    };
    'order.ready': {
        readonly kind: "badge";
        readonly text: "جاهز";
    };
    'order.delivered': {
        readonly kind: "badge";
        readonly text: "تم التسليم";
    };
    'order.settled': {
        readonly kind: "badge";
        readonly text: "تمت التسوية";
    };
    'order.deferred': {
        readonly kind: "badge";
        readonly text: "مؤجل";
    };
    'order.cancelled': {
        readonly kind: "badge";
        readonly text: "ملغى";
    };
    'order.needsReview': {
        readonly kind: "badge";
        readonly text: "يحتاج مراجعة";
    };
    'next.draft': {
        readonly kind: "button";
        readonly text: "أضف السعر والموعد";
    };
    'next.tentative': {
        readonly kind: "button";
        readonly text: "ابدأ التنفيذ";
    };
    'next.confirmed': {
        readonly kind: "button";
        readonly text: "ابدأ التنفيذ";
    };
    'next.inProgress': {
        readonly kind: "button";
        readonly text: "أكمل التنفيذ";
    };
    'next.ready': {
        readonly kind: "button";
        readonly text: "سجّل التسليم";
    };
    'next.delivered': {
        readonly kind: "button";
        readonly text: "راجع التحصيل والنتيجة";
    };
    'next.settled': {
        readonly kind: "button";
        readonly text: "راجع نتيجة الطلب";
    };
    'next.deferred': {
        readonly kind: "button";
        readonly text: "راجع سبب التأجيل";
    };
    'next.cancelled': {
        readonly kind: "button";
        readonly text: "راجع تسوية الطلب";
    };
    'next.needsReview': {
        readonly kind: "button";
        readonly text: "راجع الطلب";
    };
    'avail.available': {
        readonly kind: "badge";
        readonly text: "متوفر";
    };
    'avail.onRequest': {
        readonly kind: "badge";
        readonly text: "بالطلب";
    };
    'avail.unavailable': {
        readonly kind: "badge";
        readonly text: "غير متوفر مؤقتاً";
    };
    'report.misleading': {
        readonly kind: "badge";
        readonly text: "معلومات مضللة";
    };
    'report.offTopic': {
        readonly kind: "badge";
        readonly text: "خارج النطاق المسموح";
    };
    'report.spam': {
        readonly kind: "badge";
        readonly text: "إعلان مزعج";
    };
    'report.contact': {
        readonly kind: "badge";
        readonly text: "مشكلة في التواصل";
    };
    'report.other': {
        readonly kind: "badge";
        readonly text: "سبب آخر";
    };
    'report.writeReason': {
        readonly kind: "badge";
        readonly text: "اكتب السبب";
    };
    'checkbox.tickThis': {
        readonly kind: "help";
        readonly text: "أشّر على هذا البند.";
    };
    'radio.choose': {
        readonly kind: "help";
        readonly text: "اختر {label}.";
    };
    'lab.h.radio': {
        readonly kind: "title";
        readonly text: "اختيار من قائمة";
    };
    'lab.tools': {
        readonly kind: "screen-reader";
        readonly text: "أدوات المختبر";
    };
    'lab.toolsTitle': {
        readonly kind: "title";
        readonly text: "أدوات المختبر";
    };
    'lab.h.toggle': {
        readonly kind: "title";
        readonly text: "إعداد يعمل فوراً";
    };
    'title.toggle': {
        readonly kind: "title";
        readonly text: "المفتاح";
    };
    'title.radio': {
        readonly kind: "title";
        readonly text: "مجموعة الراديو";
    };
    'sr.clearSearch': {
        readonly kind: "screen-reader";
        readonly text: "امسح البحث";
    };
    'search.in': {
        readonly kind: "placeholder";
        readonly text: "ابحث في {area}";
    };
    'lab.h.searchField': {
        readonly kind: "title";
        readonly text: "بحث داخل قسم";
    };
    'lab.h.textArea': {
        readonly kind: "title";
        readonly text: "نص متعدد الأسطر";
    };
    'lab.h.amountField': {
        readonly kind: "title";
        readonly text: "حقل المبالغ";
    };
    'title.amountField': {
        readonly kind: "title";
        readonly text: "حقل المبلغ";
    };
    'title.textArea': {
        readonly kind: "title";
        readonly text: "حقل الملاحظة";
    };
    'title.searchField': {
        readonly kind: "title";
        readonly text: "حقل البحث";
    };
    'lab.h.checkbox': {
        readonly kind: "title";
        readonly text: "بنود تُشَرّ مستقلة";
    };
    'state.errorRow': {
        readonly kind: "badge";
        readonly text: "حالة الخطأ";
    };
    'title.checkbox': {
        readonly kind: "title";
        readonly text: "مربع الاختيار";
    };
};
export type ArKey = keyof typeof ar;
/** What the host app may override: key -> replacement text. */
export type TextOverrides = Partial<Record<ArKey, string>>;
/**
 * Replace fixed library texts from the host app. Call ONCE at startup
 * (before the first render — the values are read at render time, so a call
 * after mount still applies to the next render, but startup is the contract).
 * A later call REPLACES the whole override set (it is not additive).
 */
export declare function overrideTexts(next: TextOverrides): void;
/** Drop every override (tests and the lab's live sample only). */
export declare function resetTextOverrides(): void;
/** The override for `key`, or undefined when the app passed none. */
export declare function overriddenText(key: ArKey): string | undefined;
/**
 * Resolve a dictionary entry with `{param}` interpolation.
 * The host app's override (3ج.1) wins over the library text; unknown params
 * are left as-is; missing params throw nothing (defensive — the copy gate
 * checks completeness separately).
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
export declare function getMoneyTexts(): MoneyAriaTexts;
