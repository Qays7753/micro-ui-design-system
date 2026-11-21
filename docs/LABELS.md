# نصوص المكتبة الافتراضية — LABELS

مولَّد آليًا من `components/*/labels.js` بـ`tools/labels-doc-build.py` — لا يُعدَّل يدويًا.
المفاتيح دلالية بموضعها (الجولة الثانية R5): من يقرأ المفتاح يعرف أين يظهر النص.
التخصيص: `init(root, { labels: { key: value } })` طبقة لهذا المثيل فقط،
و`setLabels(partial)` من كل مدخل للسجل العام، و`setLocale(locale)` لتنسيق الأرقام.
النصوص الافتراضية حرفية كما في 0.1.0 (R-D15).

## access-gateway

المدخل: `@micro/ui/access-gateway`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `passwordReveal.label` | إظهار كلمة المرور | — |
| `recovery.uncertain` | انتهى طلب المساعدة دون تأكيد إرساله. | — |
| `recovery.error` | تعذّر إرسال طلب المساعدة. أعد المحاولة. | — |
| `provider.connectingLabel` | جارٍ الاتصال | — |
| `provider.connectingMessage` | جارٍ الاتصال بمزود الدخول… | — |
| `provider.success` | تم الدخول بنجاح. | — |
| `provider.failure` | لم يتم الدخول. | — |
| `provider.uncertain` | انتهى الطلب دون نتيجة مؤكدة من التطبيق. | — |
| `provider.error` | تعذّر تنفيذ الدخول. أعد المحاولة. | — |
| `form.incomplete` | نموذج الدخول غير مكتمل. تواصل مع المسؤول إن تكرر ذلك. | — |
| `validation.email` | أدخل بريدًا إلكترونيًا صالحًا. | — |
| `validation.password` | أدخل كلمة المرور. | — |
| `validation.passwordMinLengthPrefix` | أدخل كلمة مرور لا تقل عن  | — |
| `validation.passwordMinLengthSuffix` |  أحرف. | — |
| `validation.passwordRequired` | تحقق من كلمة المرور المطلوبة. | — |
| `validation.emailAndPasswordRequired` | تحقق من البريد الإلكتروني وكلمة المرور المطلوبة. | — |
| `demo.notice` | هذه نسخة عرض تجريبية: لن تُرسل بياناتك إلى أي خدمة. | — |
| `submit.loadingLabel` | جارٍ تسجيل الدخول | — |
| `submit.pendingMessage` | جارٍ التحقق من بيانات الدخول… | — |
| `submit.error` | تعذّر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة. | — |

## account-settings

المدخل: `@micro/ui/account-settings`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `demo.changeNotice` | تغيّر هذا المثال داخل الصفحة فقط؛ لم يُحفظ الإعداد. | — |

## carousel

المدخل: `@micro/ui/carousel`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `empty` | لا توجد بطاقات. | — |
| `slide.cardRole` | بطاقة | — |
| `slide.labelPrefix` | بطاقة  | — |
| `slide.positionPrefix` | ، البطاقة  | — |
| `position.of` |  من  | — |
| `status.positionPrefix` | البطاقة  | — |
| `dots.goToPrefix` | الانتقال إلى البطاقة  | — |
| `region.role` | عارض بطاقات | — |

## data

المدخل: `@micro/ui/data وpacked-circle`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `value.invalid` | قيمة غير صالحة | — |
| `value.unavailable` | (غير متاح) | — |
| `value.negativeUnplottedSuffix` |  (سالب غير مرسوم) | — |
| `common.listSeparator` | ،  | — |
| `context.unit` | الوحدة | — |
| `context.period` | الفترة | — |
| `table.ariaLabel` | القراءات الكاملة للرسم | — |
| `value.outlierSuffix` |  (قيمة شاذة) | — |
| `bars.rangeError` | تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه. | — |
| `bars.scaleInvalidDetail` | \" غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض الرسم النسبي والقيم معروضة كاملة. | — |
| `bars.overscaleDetailPrefix` | bars: أكبر قيمة ( | — |
| `bars.overscaleDetailMax` | ) تتجاوز data-max=\" | — |
| `bars.overscaleDetailSuffix` | \" — الرسم النسبي كان سيخفي الفرق بين القيم؛ صحّح data-max أو استخدم data-overscale=\"r… | — |
| `bars.ariaLabel` | رسم أعمدة | — |
| `bars.rescaledAriaSuffix` | ؛ مقياس موسّع إلى  | — |
| `bars.rescaledAriaInsteadOf` |  بدل المعلن  | — |
| `bars.invalidMark` | غير صالح | — |
| `bars.negativeUnplottedMark` | سالب غير مرسوم | — |
| `bars.outlierMark` | قيمة شاذة | — |
| `bars.rescaledNotePrefix` | نطاق العرض:  | — |
| `bars.rescaledNoteInsteadOf` |  بدل  | — |
| `bars.rescaledNoteSuffix` | . القيم الأصلية دون تغيير. | — |
| `bars.rescaleDetailPrefix` | bars: data-overscale=\"rescale\" — رسم بمقياس موسّع من  | — |
| `bars.rescaleDetailTo` |  إلى  | — |
| `bars.rescaleDetailSuffix` | ؛ القيم الأصلية دون تغيير. | — |
| `chart.empty` | لا توجد بيانات لعرضها. | — |
| `signed.rangeError` | تعذّر عرض الرسم بهذا النطاق. القراءات متاحة كاملة. | — |
| `signed.ariaLabel` | رسم موقّع | — |
| `signed.ariaSuffix` | ؛ محور صفر مشترك، والقراءات الكاملة أدناه | — |
| `axis.missingSetupError` | تعذّر عرض المحور دون إعداد وأوقات صريحة صالحة. القراءات متاحة كاملة. | — |
| `axis.autoExtendedNote` | وُسّع النطاق ليشمل جميع القيم؛ القراءات الأصلية دون تغيير. | — |
| `axis.timeMissingWithReadings` | تعذر عرض المحور الزمني دون أوقات صريحة لكل نقطة. القراءات متاحة أدناه. | — |
| `axis.timeMissing` | تعذر عرض المحور الزمني دون أوقات صريحة لكل نقطة. | — |
| `axis.unsupportedWithReadings` | نوع المحور غير مدعوم. القراءات متاحة أدناه. | — |
| `axis.unsupported` | نوع المحور غير مدعوم. | — |
| `line.overscaleDetailPrefix` | line: أكبر قيمة ( | — |
| `line.overscaleDetailSuffix` | \" — الرسم كان سيخرج نقطة خارج مجال الرسم؛ صحّح data-max أو استخدم data-overscale=\"res… | — |
| `line.ariaLabel` | رسم خط | — |
| `line.rescaleDetailPrefix` | line: data-overscale=\"rescale\" — رسم بمقياس موسّع من  | — |
| `line.readingsAriaLabel` | التسميات والقراءات الكاملة للرسم | — |
| `donut.rangeError` | تعذر رسم التوزيع كنسب. القيم معروضة في المفتاح دون نسب. | — |
| `donut.ariaLabel` | توزيع | — |
| `donut.totalInvalidDetail` | \" غير رقمي/غير محدود — مقام غير قابل للاستخدام؛ رُفضت النسب والقيم معروضة في المفتاح د… | — |
| `donut.negativeValuesDetail` | donut: قيم سالبة — التوزيع نسب من قيم غير سالبة فقط؛ رُفضت النسب والقيم معروضة في المفت… | — |
| `donut.oversumDetailPrefix` | donut: مجموع الفئات ( | — |
| `donut.oversumDetailMax` | ) يتجاوز المقام المعلن data-total=\" | — |
| `donut.oversumDetailSuffix` | \" — النسب كانت ستتجاوز المقام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب. | — |
| `donut.negativeTotalDetail` | \" سالب — المقام السالب غير صالح للنسب (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب. | — |
| `donut.zeroTotalDetailPrefix` | donut: data-total=\"0\" بينما مجموع الفئات  | — |
| `donut.zeroTotalDetailSuffix` |  — تعارض بيانات: لا نسب من مقام صفر ولا استبدال تلقائي للمقام (C2)؛ رُفضت النسب والقيم … | — |
| `donut.totalUnknown` | الإجمالي غير معلوم | — |
| `donut.totalLabel` | الإجمالي | — |
| `donut.knownSumLabel` | مجموع المعلوم | — |
| `donut.invalidValueSuffix` |  (قيمة غير صالحة) | — |
| `donut.invalidShareSuffix` |  (غير صالح للنسب) | — |
| `donut.invalidReading` | (قيمة غير صالحة) | — |
| `table.showButton` | عرض البيانات كجدول | — |
| `table.hideButton` | إخفاء جدول البيانات | — |
| `table.unitPrefix` | الوحدة:  | — |
| `table.periodPrefix` | الفترة:  | — |
| `table.head.category` | الفئة | — |
| `table.head.time` | وقت النقطة | — |
| `table.head.value` | القيمة | — |
| `bubbles.rangeError` | تعذر عرض الدوائر بهذا النطاق. القيم متاحة أدناه. | — |
| `bubbles.scaleInvalidDetail` | \" غير رقمي/غير موجب — مقياس غير قابل للاستخدام (عقد A01 نفسه bars/line)؛ رُفض الرسم ال… | — |
| `bubbles.overscaleDetailPrefix` | bubbles: أكبر قيمة ( | — |
| `bubbles.overscaleDetailSuffix` | \" — كان نصف القطر سيتجاوز rmax المعلن بصمت (r = Rmax×√(v/vmax) > Rmax)؛ صحّح data-max … | — |
| `bubbles.negativeAreaSuffix` |  (سالب غير صالح للمساحة) | — |
| `bubbles.rescaledNotePrefix` | نطاق الدوائر:  | — |
| `bubbles.rescaleDetailPrefix` | bubbles: data-overscale=\"rescale\" — رسم بمقياس موسّع من  | — |
| `bubbles.rescaleDetailSuffix` | ؛ القيم الأصلية دون تغيير، ولا نصف قطر يتجاوز rmax. | — |
| `reading.selectPrompt` | اختر عنصرًا لقراءة تفاصيله | — |
| `reading.noneSelected` | لم يُحدد عنصر | — |
| `reading.shareSuffix` |  من الإجمالي | — |
| `reading.unitUnspecified` | (وحدة غير محددة) | — |
| `reading.periodUnspecified` | (فترة غير محددة) | — |
| `reading.caption` | القراءات بوحداتها وفتراتها | — |
| `reading.prevButton` | السابق | — |
| `reading.rangeAriaLabel` | تحديد عنصر لقراءة قيمته | — |
| `reading.nextButton` | التالي | — |
| `reading.unsupportedRangeError` | نوع نطاق القيم غير مدعوم. القراءات متاحة كاملة. | — |
| `packed.listAriaLabel` | حالات لا تدخل الرسم المساحي | — |
| `packed.zeroText` | 0 (صفر) | — |
| `packed.unknown` | (غير معروف) | — |
| `packed.invalidSuffix` |  (قيمة غير صالحة) | — |
| `packed.invalid` | (غير متاح) | — |
| `packed.negativeSuffix` |  (سالب غير صالح للمساحة) | — |
| `packed.table.showButton` | عرض البيانات كجدول | — |
| `packed.table.hideButton` | إخفاء جدول البيانات | — |
| `packed.table.unitHead` | الوحدة | — |
| `packed.table.periodHead` | الفترة | — |
| `packed.table.scaleHead` | المقياس | — |
| `packed.table.separator` | ،  | — |
| `packed.table.categoryHead` | الفئة | — |
| `packed.table.valueHead` | القيمة | — |
| `packed.scaleError` | تعذّر رسم المقارنة بهذا المقياس. القيم معروضة في المفتاح دون رسم. | — |
| `packed.zeroDetailMax` | \" صفر | — |
| `packed.zeroDetailWithPositive` |  بينما توجد قيم موجبة؛ تعارض بيانات: لا مقارنة مساحية من مقياس صفر ولا استبدال تلقائي ل… | — |
| `packed.zeroDetailNoPositive` |  ولا توجد قيم موجبة للمقارنة. | — |
| `packed.invalidDetail` | \" غير صالح (سالب أو غير رقمي) للمقارنة المساحية. | — |
| `packed.empty` | لا توجد قيم موجبة قابلة للرسم المساحي. | — |
| `packed.tooManyCategoriesError` | تعذر عرض الدوائر لمقارنة أكثر من خمس فئات موجبة. القيم الكاملة معروضة في المفتاح. | — |

## fields

المدخل: `@micro/ui/fields`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| — | لا مفاتيح حاليًا | — |

## info-strip

المدخل: `@micro/ui/info-strip وinfo-strip-peek`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `pages.ariaLabel` | اختيار البطاقة | — |
| `status.positionPrefix` | البطاقة  | — |
| `status.ofSeparator` |  من  | — |
| `page.showPrefix` | عرض البطاقة  | — |
| `status.initialPrefix` | البطاقة 1 من  | — |
| `status.empty` | لا توجد بطاقات. | — |
| `peek.status.positionPrefix` | البطاقة  | — |
| `peek.status.ofSeparator` |  من  | — |
| `peek.status.empty` | لا توجد بطاقات. | — |
| `peek.pages.ariaLabel` | اختيار البطاقة | — |
| `peek.page.showPrefix` | عرض البطاقة  | — |

## messages

المدخل: `@micro/ui/messages`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `note.missingVariantWarning` | [micro-messages] m-note بلا variant ولا role — لا يمكن اختيار دور إعلاني آمن (D-UI-02/S… | — |

## metric-comparison

المدخل: `@micro/ui/metric-comparison`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `circles.discloseAriaLabel` | القراءات الدقيقة لكل القيم | — |
| `circles.renderError` | تعذّر رسم الدوائر بهذا الإعداد. القيم معروضة في القائمة. | — |
| `circles.unknownLayoutDetail` | ' غير معروف (المعروف: separated/overlap) — رُفض الرسم؛ القراءات كاملة في القائمة البديلة. | — |
| `circles.scaleError` | تعذّر رسم الدوائر بهذا النطاق. القيم معروضة في القائمة. | — |
| `circles.scaleInvalidDetailPrefix` | ' غير موجب أو أصغر من أكبر مقدار معلوم ( | — |
| `circles.scaleInvalidDetailSuffix` | ) — مقياس غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة. | — |
| `circles.radiusInvalidDetail` | ' غير موجب — حد حجم دائرة غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة الب… | — |
| `circles.deferredMessage` | لا تتوفر مساحة عرض بعد؛ ستظهر الدوائر عند إتاحة البطاقة. | — |
| `circles.deferredDetail` | metric-circles: عرض اللوحة 0 — الرسم مؤجل حتى إتاحة المساحة (يعاد الرسم عند الإظهار). | — |
| `circles.zeroMessage` | القيم المعروفة صفرية؛ العلامة المجوفة تعني صفرًا، وليست مساحة عددية. | — |
| `circles.emptyMessage` | لا توجد قراءات متاحة للمقارنة بعد. | — |
| `circles.zeroDetail` | metric-circles: كل القيم المعلومة صفر — علامات صفر مجوفة بلا مساحات مقارنة. | — |
| `circles.noValuesDetail` | metric-circles: لا قيم معلومة — لا رسم. | — |
| `circles.scaledMessageBase` | المساحة تقارن مقدار القيمة؛ الإشارة مكتوبة في القراءة. | — |
| `circles.zeroMarkNote` |  العلامة المجوفة تعني صفرًا، وليست مساحة عددية. | — |
| `circles.scaleNotePrefix` |  النطاق يصل إلى  | — |
| `circles.overlapNote` |  التداخل بصري فقط ولا يدل على تقاطع أو علاقة بين القيم. | — |
| `circles.fitNote` |  — الحجم يتكيف مع عرض البطاقة ضمن نصف القطر؛ scale= | — |
| `value.invalid` | قيمة غير صالحة | — |
| `value.missing` | غير متاح | — |
| `value.unreadable` | تعذّر قراءة القيمة | — |
| `chart.empty` | لا توجد بيانات للمقارنة. | — |
| `table.showButton` | عرض البيانات كجدول | — |
| `table.hideButton` | إخفاء جدول البيانات | — |
| `table.unitPrefix` | الوحدة:  | — |
| `table.periodPrefix` | الفترة:  | — |
| `table.separator` | ،  | — |
| `table.head.category` | الفئة | — |
| `table.head.value` | القيمة | — |
| `table.head.unit` | الوحدة | — |
| `table.head.period` | الفترة | — |
| `table.mainMetricFallback` | القيمة الرئيسية | — |
| `table.missingValue` | — (غير متاح) | — |
| `table.invalidValue` | (قيمة غير صالحة) | — |
| `table.zeroValue` | (صفر) | — |
| `table.negativeValue` | (سالب) | — |
| `table.head.state` | الحالة | — |
| `bars.stateZero` | صفر | — |
| `bars.stateNegative` | سالب — معروض بالقيمة والإشارة لا بالمساحة | — |
| `bars.emptyDetail` | metric-bars: مصدر فارغ — لا صفوف. | — |
| `bars.unitMismatchError` | تعذّر عرض المقارنة: وحدة أو فترة غير متوافقة بين القيم. القراءات معروضة كاملة. | — |
| `bars.unitMismatchDetail` | metric-bars: تباين data-unit/data-period في بعض الصفوف مع data-common-unit/data-common-… | — |
| `bars.scaleError` | تعذّر عرض المقارنة بهذا النطاق. القراءات معروضة كاملة. | — |
| `bars.scaleInvalidDetail` | ' غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض رسم الأشرطة والقراءات كاملة. | — |
| `bars.unfairScaleError` | تعذّر عرض مقارنة عادلة بهذا النطاق. القراءات معروضة كاملة. | — |
| `bars.underscaleDetailPrefix` |  أصغر من أكبر مقدار معلوم ( | — |
| `bars.underscaleDetailSuffix` | ) — رسم نسبي كان سيخفي الفرق؛ رُفض رسم الأشرطة والقراءات كاملة. | — |
| `bars.scaledMessagePrefix` | الأشرطة حتى  | — |
| `bars.scaledDetailUnit` | ؛ common-unit= | — |
| `bars.scaledDetailPeriod` | ؛ common-period= | — |
| `bars.zeroMessage` | القيم المعروفة صفرية؛ علامة الصفر ظاهرة دون طول مصطنع. | — |
| `bars.zeroDetail` | metric-bars: كل القيم المعلومة صفر — علامات صفر بلا أطوال. | — |
| `bars.emptyMessage` | لا توجد قراءات متاحة لبناء مقياس بعد. | — |
| `bars.noValuesDetail` | metric-bars: لا قيم معلومة — لا مقياس. | — |
| `bars.zeroLineNote` |  خط الوسط صفر؛ الموجب يمينه والسالب يساره. | — |
| `main.missing` | (غير متاح) | — |
| `main.invalidSuffix` |  (قيمة غير صالحة) | — |

## navigation

المدخل: `@micro/ui/navigation وaction-sheet`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `layer.unnamedWarning` | [micro-navigation] طبقة مفتوحة بلا اسم متاح (عقد D-UI-02): أضف aria-label أو aria-label… | — |
| `layer.unusualRolePrefix` | [micro-navigation] دور غير معتاد للطبقة \" | — |
| `layer.unusualRoleSuffix` | \" — عقد الطبقات: dialog/alertdialog (D-UI-02). | — |
| `filters.count.one` | فلتر واحد | — |
| `filters.count.two` | فلتران | — |
| `filters.count.fewSuffix` |  فلاتر | — |
| `filters.count.manySuffix` |  فلترًا | — |
| `filters.count.hundredSuffix` |  فلتر | — |
| `filters.count.hundredOneSuffix` |  فلتر واحد | — |
| `filters.count.hundredTwoSuffix` |  فلتران | — |
| `filters.summary.emptySuffix` | : لا فلاتر | — |
| `filters.summary.separator` | ،  | — |
| `filters.summary.current` | الجاري | — |
| `filters.summary.applied` | المطبّق | — |

## order-schedule

المدخل: `@micro/ui/order-schedule`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `schedule.orders.count` | {"zero": "لا طلبات", "one": "طلب واحد", "two": "طلبان", "few": "{n} طلبات", "many": "{n… | {n} |
| `schedule.weekdays.full` | ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] | — |
| `schedule.weekdays.short` | ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"] | — |
| `schedule.errors.invalidRoot` | MicroOrderSchedule.init يتطلب عنصر جذر صالحًا (DOM Element) | — |
| `schedule.view.ariaLabel` | طريقة العرض | — |
| `schedule.view.day` | يوم | — |
| `schedule.view.week` | أسبوع | — |
| `schedule.view.month` | شهر | — |
| `schedule.view.calendarToggle` | عرض التقويم | — |
| `schedule.view.listToggle` | عرض القائمة | — |
| `schedule.nav.today` | اليوم | — |
| `schedule.nav.prevMonth` | الشهر السابق | — |
| `schedule.nav.prevWeek` | الأسبوع السابق | — |
| `schedule.nav.prevDay` | اليوم السابق | — |
| `schedule.nav.nextMonth` | الشهر التالي | — |
| `schedule.nav.nextWeek` | الأسبوع التالي | — |
| `schedule.nav.nextDay` | اليوم التالي | — |
| `schedule.picker.ariaLabel` | اختيار الشهر والسنة | — |
| `schedule.picker.prevYear` | السنة السابقة | — |
| `schedule.picker.nextYear` | السنة التالية | — |
| `schedule.picker.back` | رجوع للتقويم | — |
| `schedule.picker.monthsLabel` | أشهر السنة | — |
| `schedule.dayCell.ordersSuffix` | ،  | — |
| `schedule.monthTitlePrefix` | طلبات  | — |
| `schedule.weekTitlePrefix` | طلبات الأسبوع  | — |
| `schedule.addOrder.label` | إضافة طلب | — |
| `schedule.addOrder.dayAriaPrefix` | إضافة طلب ليوم  | — |
| `schedule.orderRow.date` | التاريخ | — |
| `schedule.orderRow.unscheduled` | غير مجدول | — |
| `schedule.orderRow.time` | الوقت | — |
| `schedule.orderRow.customer` | المورد | — |
| `schedule.orderRow.status` | الحالة | — |
| `schedule.orderRow.note` | الملاحظة | — |
| `schedule.orderRow.edit` | تعديل | — |
| `schedule.orderRow.delete` | حذف | — |
| `schedule.dayList.title` | طلبات اليوم | — |
| `schedule.dayList.noDayPrefix` | لا يوم محدد في  | — |
| `schedule.dayList.noDaySuffix` |  في هذا الشهر | — |
| `schedule.dayList.empty` | لا توجد طلبات | — |
| `schedule.list.empty` | لا توجد طلبات بعد. | — |
| `schedule.list.upcoming` | الطلبات القادمة | — |
| `schedule.list.past` | الطلبات السابقة | — |
| `schedule.list.unscheduled` | الطلبات غير المجدولة | — |
| `schedule.loading` | جارٍ تحميل الطلبات… | — |
| `schedule.loadError` | تعذّر تحميل الطلبات. | — |
| `schedule.retry` | إعادة المحاولة | — |

## organization

المدخل: `@micro/ui/organization`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `avatar.initialsFallback` | ؟ | — |

## product-context

المدخل: `@micro/ui/product`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `phase.loading` | جارٍ التحميل… | — |
| `phase.empty` | لا توجد بيانات بعد | — |
| `phase.success` | تمت العملية | — |
| `phase.error` | تعذّر إكمال الطلب | — |
| `phase.rejected` | لم يُقبل الطلب | — |
| `phase.disabled` | الإجراء غير متاح حاليًا | — |
| `phase.pending` | بانتظار نتيجة مؤكدة | — |
| `phase.uncertain` | النتيجة غير مؤكدة؛ تحقق قبل إعادة الإرسال | — |
| `phase.denied` | لا تتوفر صلاحية لهذا السياق | — |
| `phase.expired` | انتهت الجلسة | — |
| `phase.signedOut` | يلزم تسجيل الدخول | — |
| `phase.conflict` | تغيّرت البيانات؛ راجع النسخة الأحدث | — |
| `confirm.missingComponent` | يلزم تحميل مكوّن التأكيد | — |
| `confirm.title` | تأكيد الإجراء | — |
| `confirm.cancel` | تراجع | — |
| `confirm.ok` | تأكيد | — |
| `form.requiredFields` | أكمل الحقول المطلوبة | — |
| `form.missingFieldPrefix` | أدخل  | — |
| `form.missingFieldFallback` | القيمة المطلوبة | — |
| `media.unavailable` | لا توجد صورة متاحة | — |
| `media.carouselLabel` | صور المرفقات | — |
| `media.cardLabelPrefix` | صورة  | — |
| `media.imageAltFallback` | صورة المرفق | — |
| `media.imageError` | تعذّر عرض الصورة | — |
| `media.linkUnavailable` | رابط الصورة غير متاح | — |
| `media.prev` | السابق | — |
| `media.next` | التالي | — |
| `attachments.label` | الصور | — |
| `attachments.addMore` | إضافة صور | — |
| `attachments.replaceSelection` | استبدال الاختيار | — |
| `attachments.choose` | اختيار الصور | — |
| `attachments.fileError` | تعذّر استخدام الملف | — |
| `attachments.fileErrorDetail` | نوع الصورة أو حجمها لا يطابق القيد المقدم. | — |
| `attachments.remove` | إزالة | — |
| `attachments.removeAriaPrefix` | إزالة  | — |
| `attachments.removeAll` | إزالة المرفقات | — |
| `attachments.requiredNotice` | أرفق صورة للمتابعة. | — |
| `shell.previousContextHidden` | بيانات السياق السابق غير معروضة. | — |
| `shell.reauth` | متابعة الدخول | — |
| `shell.chooseContext` | اختيار سياق آخر | — |
| `shell.noScopeTitle` | اختر سياقًا معتمدًا | — |
| `shell.noScopeDetail` | لا تُعرض بيانات خاصة قبل تحديد السياق. | — |
| `shell.driverScopeTitle` | هذه الوجهة غير متاحة في سياق السائق | — |
| `shell.driverScopeDetail` | المتاح للسائق Delivery وAsk Micro فقط. | — |
| `shell.noPermission` | لا يمكنك عرض هذه البيانات في السياق الحالي | — |
| `connection.offline` | الاتصال منقطع | — |
| `connection.local` | وضع محلي | — |
| `connection.weak` | الاتصال ضعيف | — |
| `connection.manageNotice` | الكتابة متاحة أثناء الاتصال فقط؛ لا طابور مزامنة (المرحلة 8 — توافق Online-only). | — |
| `connection.genericNotice` | العمليات التي تحتاج الاتصال غير متاحة الآن. | — |
| `stateCard.recheck` | إعادة التحقق | — |
| `context.accountFallback` | حساب Micro | — |
| `context.unavailableTitle` | السياق غير متاح | — |
| `context.unavailableDetail` | لا يمكن اختيار سياق الآن. | — |
| `context.invalidListTitle` | قائمة السياقات غير صالحة | — |
| `context.selectLabel` | الدور والمنشأة | — |
| `context.destination.manage` | Manage · الإدارة | — |
| `context.destination.market` | Market · السوق | — |
| `context.destination.delivery` | Delivery · التوصيل | — |
| `context.navLabel` | وجهات Micro المصرح بها | — |
| `context.noDestinationsTitle` | لا وجهات متاحة | — |
| `context.noDestinationsDetail` | اختر سياقًا آخر للمتابعة. | — |
| `delivery.title` | طلب توصيل | — |
| `delivery.pickup` | الاستلام | — |
| `delivery.dropoff` | التسليم | — |
| `common.unavailable` | (غير متاح) | — |
| `delivery.addressesUnavailable` | تفاصيل المواقع غير متاحة لهذا السياق | — |
| `delivery.pickupField` | موقع الاستلام | — |
| `delivery.dropoffField` | موقع التسليم | — |
| `delivery.noteField` | تفاصيل الطلب | — |
| `delivery.requestAction` | إرسال طلب توصيل | — |
| `delivery.requestConfirm` | سيُرسل طلب التوصيل بالبيانات المدخلة. | — |
| `common.unitFallback` | (الوحدة غير محددة) | — |
| `delivery.validityFallback` | مهلة العرض غير متاحة | — |
| `delivery.quote.accept` | قبول العرض | — |
| `delivery.quote.decline` | رفض العرض | — |
| `delivery.quote.assign` | طلب إسناد للسائق | — |
| `delivery.quote.confirmPrefix` | تأكيد العرض كما ورد:  | — |
| `common.unavailablePlain` | غير متاح | — |
| `delivery.change.current` | البيانات الحالية | — |
| `delivery.change.proposed` | التعديل المقترح | — |
| `delivery.partyStatusFallback` | القرار غير متاح | — |
| `delivery.change.requestAction` | طلب موافقة على التعديل | — |
| `delivery.change.confirm` | هذا طلب موافقة؛ لا يعتمد التعديل أو يغيّر الطلب من جهة واحدة. | — |
| `delivery.proof.noteField` | ملاحظة الإثبات | — |
| `delivery.proof.returnAction` | إرسال إثبات إرجاع | — |
| `delivery.proof.deliveryAction` | إرسال إثبات تسليم | — |
| `delivery.proof.attachmentRequired` | أرفق الإثبات المطلوب | — |
| `delivery.proof.confirm` | سيُرسل الإثبات للمراجعة؛ لا يعني ذلك اكتمال التسليم أو الإرجاع. | — |
| `delivery.updateStatusAction` | تحديث الحالة | — |
| `market.editorTitle` | بيانات الإعلان | — |
| `market.searchTitle` | بحث السوق | — |
| `market.listingTitle` | إعلان | — |
| `market.searchField` | البحث | — |
| `market.searchAction` | عرض النتائج | — |
| `market.titleField` | عنوان الإعلان | — |
| `market.descriptionField` | الوصف | — |
| `market.priceField` | السعر | — |
| `market.priceUnitFallback` | الوحدة غير محددة | — |
| `market.publishAction` | إرسال للنشر | — |
| `market.saveDraftAction` | حفظ المسودة | — |
| `market.publishConfirmPrefix` | إرسال  | — |
| `market.publishConfirmPrice` |  بسعر  | — |
| `common.unitFallback` | (الوحدة غير محددة) | — |
| `market.reviewNoteTitle` | ملاحظة المراجعة | — |
| `market.editAction` | تعديل | — |
| `market.reportAction` | الإبلاغ عن الإعلان | — |
| `market.reportConfirm` | إرسال طلب بلاغ؛ التصنيف والمراجعة وفق قواعد المنتج المعتمدة. | — |
| `operation.title` | حالة العملية | — |
| `operation.referencePrefix` | مرجع الطلب:  | — |
| `operation.actions.recheck` | إعادة التحقق | — |
| `operation.actions.retry` | إعادة المحاولة | — |
| `assistant.logLabel` | رسائل المحادثة | — |
| `assistant.userSpeaker` | أنت | — |
| `assistant.noteSpeaker` | ملاحظة | — |
| `assistant.retryAction` | إعادة المحاولة | — |
| `assistant.proposalExpired` | انتهت صلاحية الاقتراح | — |
| `assistant.proposalCompleted` | تم تنفيذ الإجراء | — |
| `assistant.proposalUnavailable` | الإجراء غير متاح | — |
| `assistant.emptyLog` | ابدأ محادثة في السياق الحالي | — |
| `assistant.searchingStatus` | جارٍ البحث… | — |
| `assistant.preparingStatus` | جارٍ إعداد الرد… | — |
| `assistant.newMessagesAction` | رسائل جديدة | — |
| `assistant.proposalTitle` | إجراء مقترح | — |
| `assistant.proposalActionFallback` | مراجعة وتأكيد الإجراء | — |
| `assistant.messageField` | رسالتك | — |
| `assistant.sendAction` | إرسال | — |
| `review.reportTitle` | إرسال بلاغ | — |
| `review.itemTitle` | عنصر للمراجعة | — |
| `review.reasonField` | سبب البلاغ | — |
| `review.categoryField` | التصنيف | — |
| `review.submitAction` | إرسال البلاغ | — |
| `review.submitConfirm` | سيُرسل البلاغ للمراجعة. | — |
| `review.reasonTitle` | سبب أو ملاحظة | — |
| `review.attachmentsRestricted` | المرفقات مقيدة حسب الصلاحية | — |
| `review.decisionNoteField` | ملاحظة القرار | — |
| `review.approveAction` | قبول | — |
| `review.rejectAction` | رفض | — |
| `review.requestInfoAction` | طلب معلومات | — |
| `review.decisionConfirmPrefix` | مراجعة قرار  | — |
| `review.decisionConfirmOn` |  على  | — |
| `review.subjectFallback` | هذا العنصر | — |
| `manage.title` | سجل العمليات | — |
| `manage.summaryTitle` | ملخص الفترة | — |
| `manage.listTitle` | العمليات | — |
| `manage.formTitle` | عملية جديدة | — |
| `manage.amountField` | المبلغ | — |
| `manage.typeField` | النوع | — |
| `manage.type.sale` | مبيعات | — |
| `manage.type.expense` | مصاريف | — |
| `manage.dateField` | التاريخ | — |
| `manage.noteField` | الملاحظة | — |
| `manage.submitAction` | إضافة العملية | — |
| `manage.clearAction` | تفريغ الحقول | — |
| `manage.emptyList` | لا عمليات في هذه الفترة | — |
| `manage.submitConfirm` | سيُرسل إدخال العملية كما هو؛ لا يُسجَّل مبلغ قبل تأكيد الخادم. | — |
| `market.resultsTitle` | النتائج | — |
| `market.noAdsTitle` | لا توجد إعلانات | — |
| `market.noAdsDetail` | المصدر لا يضم إعلانات معروضة حاليًا. | — |
| `market.noResultsTitle` | لا نتائج لهذا البحث | — |
| `market.noResultsDetail` | عدّل كلمات البحث أو الفلاتر ثم أعد المحاولة. | — |
| `review.queueTitle` | قائمة المراجعة | — |
| `review.kind.listing` | إعلان | — |
| `review.kind.flag` | بلاغ | — |
| `review.kind.driverApplication` | طلب سائق | — |
| `review.emptyQueue` | لا عناصر في القائمة | — |

## selection

المدخل: `@micro/ui/selection وpicker`

| المفتاح | النص الافتراضي | المتغيرات |
|---|---|---|
| `picker.selectedPrefix` | المحدد:  | — |
| `picker.selectedNone` | المحدد: لا شيء | — |
| `picker.retry` | إعادة المحاولة | — |
| `picker.status.initial` | لم تُحمّل الخيارات بعد. | — |
| `picker.status.loading` | جارٍ تحميل الخيارات… | — |
| `picker.status.empty` | لا خيارات متاحة. | — |
| `picker.status.error` | تعذّر تحميل الخيارات. أعد المحاولة. | — |
| `picker.status.disabled` | الاختيار غير متاح حاليًا. | — |
| `picker.noResults` | لا نتائج مطابقة. عدّل كلمة البحث. | — |

