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
    readonly 'field.dueDate': {
        readonly kind: "badge";
        readonly text: "تاريخ الاستحقاق";
    };
    readonly 'field.party': {
        readonly kind: "badge";
        readonly text: "اختر العميل";
    };
    readonly 'field.supplierParty': {
        readonly kind: "badge";
        readonly text: "المورد";
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
    readonly 'month.srGrid': {
        readonly kind: "screen-reader";
        readonly text: "{month} {year}";
    };
    readonly 'month.srCell': {
        readonly kind: "screen-reader";
        readonly text: "{day} {month}، {weekday}";
    };
    readonly 'month.srCellToday': {
        readonly kind: "screen-reader";
        readonly text: "{name}، {today}";
    };
    readonly 'month.srCellCount': {
        readonly kind: "screen-reader";
        readonly text: "{name}، {counted}";
    };
    readonly 'datePicker.srName': {
        readonly kind: "screen-reader";
        readonly text: "{label}، {date}";
    };
    readonly 'party.roleClient': {
        readonly kind: "badge";
        readonly text: "عميلاً";
    };
    readonly 'party.roleSupplier': {
        readonly kind: "badge";
        readonly text: "مورداً";
    };
    readonly 'party.roleParty': {
        readonly kind: "badge";
        readonly text: "طرفاً";
    };
    readonly 'party.add': {
        readonly kind: "badge";
        readonly text: "أضف «{name}» {role} جديداً";
    };
    readonly 'party.srAdd': {
        readonly kind: "screen-reader";
        readonly text: "أضف {name} {role} جديداً";
    };
    readonly 'party.srName': {
        readonly kind: "screen-reader";
        readonly text: "{label}، {name}";
    };
    readonly 'party.srNone': {
        readonly kind: "screen-reader";
        readonly text: "{label}، لم يُختر";
    };
    readonly 'party.empty': {
        readonly kind: "empty";
        readonly text: "العملاء يظهرون هنا. اكتب اسماً لإضافته.";
    };
    readonly 'party.choose': {
        readonly kind: "help";
        readonly text: "اختر الطرف.";
    };
    readonly 'fund.from': {
        readonly kind: "badge";
        readonly text: "من:";
    };
    readonly 'fund.to': {
        readonly kind: "badge";
        readonly text: "إلى:";
    };
    readonly 'fund.srChip': {
        readonly kind: "screen-reader";
        readonly text: "{name}، الرصيد {balance}";
    };
    readonly 'fund.srChipDisabled': {
        readonly kind: "screen-reader";
        readonly text: "{name}، هذا صندوق المصدر";
    };
    readonly 'fund.choose': {
        readonly kind: "help";
        readonly text: "اختر الصندوق.";
    };
    readonly 'title.fundPicker': {
        readonly kind: "title";
        readonly text: "منتقي الصندوق";
    };
    readonly 'lab.h.fundPicker': {
        readonly kind: "title";
        readonly text: "اختيار الصندوق في الحركة";
    };
    readonly 'lab.fundPickerHint': {
        readonly kind: "help";
        readonly text: "الشكل يتبع عدد الصناديق: صف، أو رقائق، أو حقل.";
    };
    readonly 'title.partyPicker': {
        readonly kind: "title";
        readonly text: "منتقي الطرف";
    };
    readonly 'lab.h.partyPicker': {
        readonly kind: "title";
        readonly text: "حقل اختيار الطرف";
    };
    readonly 'lab.partyPickerHint': {
        readonly kind: "help";
        readonly text: "الحقل يفتح ورقة البحث، والاختيار يغلقها.";
    };
    readonly 'title.datePicker': {
        readonly kind: "title";
        readonly text: "منتقي التاريخ";
    };
    readonly 'lab.h.datePicker': {
        readonly kind: "title";
        readonly text: "حقل تاريخ النموذج";
    };
    readonly 'lab.datePickerHint': {
        readonly kind: "help";
        readonly text: "التسمية تفتح ورقة الشهر، واختيار اليوم يغلقها.";
    };
    readonly 'title.monthGrid': {
        readonly kind: "title";
        readonly text: "شبكة الشهر";
    };
    readonly 'lab.h.monthGrid': {
        readonly kind: "title";
        readonly text: "تقويم الشهر";
    };
    readonly 'lab.monthGridHint': {
        readonly kind: "help";
        readonly text: "اختر يومًا، أو مدى في وضع المدى.";
    };
    readonly 'monthGrid.modeSingle': {
        readonly kind: "badge";
        readonly text: "اختيار يوم";
    };
    readonly 'monthGrid.modeRange': {
        readonly kind: "badge";
        readonly text: "اختيار مدى";
    };
    readonly 'monthGrid.modeView': {
        readonly kind: "badge";
        readonly text: "عرض فقط";
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
    readonly dayItems: {
        readonly zero: "لا عناصر";
        readonly one: "عنصر واحد";
        readonly two: "عنصران";
        readonly few: "عناصر";
        readonly many: "عنصر";
    };
};
export type PluralNoun = keyof typeof pluralNouns;
export declare function getMoneyTexts(): MoneyAriaTexts;
