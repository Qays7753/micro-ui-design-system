# تقرير تنفيذ إصلاح Micro UI Design System — Light-only

> **إصلاح تشغيل لاحق:** بعد التسليم أدناه طلب المالك إصلاح تعطل المعاينة. أُصلح خطأ ResizeObserver دون استئناف التدقيق البصري الكامل؛ التفاصيل والنتائج في [RUNTIME-FIX.md](RUNTIME-FIX.md). فقرة التوقف التالية تسجل حالة التسليم السابق، ولا تنفي هذا الإصلاح المحدود اللاحق.

> **تسليم الحالة الحالية بطلب المالك والتوقف عن العمل:** أوقفت متابعة الإصلاح بعد المراجعة المستقلة الأخيرة. نتيجتها **788 PASS / 4 FAIL**، وليست نجاحًا كاملًا. حالات الفشل الأربع من سبب واحد: نص وحدة Info Card الإنجليزي `Unavailable` يتجاوز البطاقة عند RTL ونص مكبر في 320/360 وبكثافتي DPR. لم يُصلح هذا التجاوز. كل حالات Calendar المستقلة الـ64 اجتازت. الأقسام التي تشير إلى استكمال التقرير أو بوابات نهائية أدناه تسجل خطوات لم تُستكمل قبل طلب التوقف، ولا تُعد ادعاء تنفيذها. لم تُعد توليد MANIFEST بعد التوثيق، ولم تُنتج النسخة النهائية المدمجة بالصور. تفاصيل المراجعة الفعلية في [INDEPENDENT-REVIEW.md](INDEPENDENT-REVIEW.md). يُرفع الفرع بحالته الحالية دون دمج أو نشر.

**التاريخ:** 2026-10-24. **النطاق:** مكتبة UI مستقلة قبل النقل، لا تطبيق أعمال.

## 1. المصدر والفرع والتسليم

| البند | القيمة |
|---|---|
| Commit البداية | `161bb71adbed86e0df4382174cb07bd2fcb8d62d` |
| مصدر البداية | آخر `origin/main` بعد جلبه؛ ليس الفرع المحلي القديم ولا رأس التقرير السابق |
| الفرع الجديد الوحيد | `replit/light-only-complete-ui-repair-2026-10-24` |
| حالة البداية | `git status --short` فارغ؛ 546 ملفًا متتبعًا |
| Python / Node | 3.12.12 / v20.20.0 |
| المتصفح | Chromium 152.0.7977.64 عبر Playwright؛ ليس جهاز هاتف فعليًا |
| Commit نهاية المصدر | يُثبت بعد آخر مراجعة وقبل commit التقرير؛ انظر سجل التسليم أدناه |
| الدمج / PR / النشر | لا دمج، لا PR، لا نشر، ولا تعديل مباشر لـmain |

ملف التقرير داخل Git لا يستطيع تضمين SHA الالتزام الذي يحتويه حرفيًا دون تغيير SHA نفسه. لذلك يُثبت commit المصدر المتحقق منه، ثم commit توثيق التسليم؛ النسخة النهائية القابلة للتنزيل تسجل أيضًا HEAD النهائي بعد إنشائه. لا يؤثر اختلاف commit التوثيق في نتائج المصدر المرئية.

الحالة النهائية للرفع وبصمات commits تُضاف في قسم سجل التسليم بعد التحقق، ولا تُستنتج من وجود هذا الملف.

## 2. الملخص التنفيذي

نُفذ الإصلاح في المصدر، لا في الصور أو نسخة standalone يدويًا:

1. الإصدار Light-only فعلًا: أُوقف تفعيل Dark/System القديم بأقل احتواء CSS، مع بقاء قيم Dark الأصلية دون تحسين أو إصلاح.
2. لم تُمس هندسة الشعار أو ملفات v2 أو Petrol `#164D59` أو Accent `#D97757`.
3. أضيف حضور Brand Accent صغير قابل لإعادة الاستخدام في تسمية ملخص Info Strip، لا تعبئة عامة للبطاقات أو الأزرار.
4. أُصلحت حدود Bubbles وPacked عندما يضعف فصل التعبئات الفاتحة عن السطح؛ لم تُغيّر قيم البيانات أو أنصاف الأقطار أو المساحات.
5. أُعيد مسار الشهر للهاتف: Picker شهر/سنة، Date Rail بخمسة تواريخ قريبة، وشبكة شهر عند اتساع الجذر. لم تُصغّر الأهداف عن 48px.
6. فُصل شهر العرض عن التاريخ المحدد: اختيار شهر ليس اختيار يوم. لا تحريك صامت للتاريخ أو الطلبات.
7. أُصلحت حالات الحقل في Showcase مع ظهور الرسالة وتطابق aria؛ بقي مصدر MicroFields دون تغيير وظيفي.
8. صار Overview عرضًا للمكونات الحقيقية دون أدوات debug؛ بقي State Lab للتشخيص والحالات والأحداث.
9. أُخذ قرار لكل واحد من الأنواع الاثني عشر. لم يُحذف رسم؛ انتقلت الأنواع المتخصصة إلى opt-in موثق في الكتالوج والعرض.
10. وُحدت الوثائق النشطة وInfo Peek وعدد العائلات، وأعيد بناء standalone حتميًا من المصدر.

هذه نتيجة هندسية وبصرية ضمن الفحوص المذكورة، لا شهادة توافق هاتف أو WCAG شاملة أو جاهزية منتج إنتاجي.

## 3. ما لم يتغير

- لا مستودع Micro آخر، ولا نقل أو مقارنة بتطبيق قديم.
- لا Backend أو تسجيل دخول أو مستخدمين أو تخزين أو شبكة أعمال.
- لا عملة أو منطقة زمنية أو فترة مالية مفترضة.
- لا dependencies جديدة، ولا تغيير خطوط أو أصول أيقونات.
- لا إعادة تصميم Plus/Minus/Eye أو حذف حلقة التركيز أو إنشاء رسالة خطأ ثانية.
- لا إصلاح لـTHEME-001 أو THEME-003: هاتان ملاحظتان خاصتان بـDark المستثنى.
- لا تحويل سالب إلى موجب أو غياب إلى صفر أو قص لقيمة كي تبدو أفضل.
- لم يُعدّل مجلد Pixilated الرسمي، ولم يُضمّن في ملفات المنتج.

## 4. خطوات التنفيذ الفعلية

الخطة المنشأة داخل الفرع قبل تعديل المصدر: [PLAN.md](PLAN.md). لا قائمة مهام Replit جديدة أو طلب اعتماد متكرر.

| Wave | العمل |
|---|---|
| 0 | تثبيت origin/main والبصمات والفحوص الأولية؛ احتواء التفعيل القديم للثيم؛ دور Accent الصغير وحدود Light المثبتة |
| 1 | Month/Year Picker، Date Rail، فصل التاريخ عن الشهر، تنقل لوحة المفاتيح والتركيز والمواصفات والمثال |
| 2 | تقييم الأنواع الاثني عشر، إبقاء المقارنات الدقيقة افتراضية، opt-in للأنواع المتخصصة، سياق اختياري من المضيف |
| 3 | إصلاح error/success/clear/input؛ فصل Overview وState Lab مع بقاء fixtures والسجلات |
| 4 | توحيد الوثائق والكتالوج المولد؛ تحديث اختبار العقد القديم؛ إعادة توليد standalone |
| 5 | اختبارات سلوكية وبصرية Light، مقارنة قبل/بعد، مراجعة مستقلة وdiff، تقرير ثم رفع الفرع فقط |

كانت ملكية ملفات العاملين منفصلة: Calendar وData وShowcase؛ التوكنز وInfo Strip والوثائق العامة والتكامل لدى العامل الرئيسي. عامل التحقق مستقل عن مؤلفي تلك الإصلاحات.

## 5. سجل كل ملاحظة

الحالات تصف العمل الفعلي، لا استبدال فحص سابق بادعاء نجاح.

| ID | الحالة | المشكلة أو المراجعة | ما تغير / ما لم يتغير | دليل القبول |
|---|---|---|---|---|
| BRAND-001 | FIXED | Accent محدود ولا يحتاج تعميمًا | حفظ العداد والشارة؛ `.m-info-card--accent` لحافة تسمية ملخص اختياري، مرة واحدة في Overview | فحص القيمة الرسمية والأصول، marker في المصدر والعرض، صور Overview |
| THEME-001 | DEFERRED — خارج النطاق | حبر Accent في Dark | لم يُصلح؛ لا فحوص Dark | diff يثبت عدم تعديل قيمه؛ بوابة Light فقط |
| THEME-002-LIGHT | FIXED | حواف بعض علامات البيانات الفاتحة | stroke للدوائر الفعلية في SVG Bubbles، وinset shadow في Packed؛ لا حد زائد لدوائر Metric السليمة أو أعمدة/نقاط سليمة | `light-data-check.py`؛ computed styles على العلامات؛ أزواج الصور |
| THEME-003 | DEFERRED — خارج النطاق | علامة اكتمال Steps في Dark | لا تغيير لرمز Steps أو success الداكن | النطاق وdiff؛ ليس إصلاح Dark عبر إعادة تسمية |
| CAL-001 | FIXED | زر الشهر لا يفتح مسار شهر حقيقي في الجذر الضيق | Picker وRail وشبكة واسعة، تاريخ وشهر منفصلان، Escape/Back وتركيز وكيبورد | `light-calendar-check.py`؛ المراجعة المستقلة؛ صور الجذور |
| CAL-002 | FIXED | كثرة اختيارات متساوية الوزن | إجراء بديل واحد بين الشهر/اليوم بدل زرّين متنافسين دائمًا؛ الشهر من عنوان قابل للتفعيل | المصدر وصور التقويم؛ لا حذف للقائمة أو الحالات |
| CHART-001 | OPT-IN | الرسوم المساحية أضعف للمقارنة الدقيقة | Bubbles/Packed/Metric Circles خيارات متخصصة صريحة؛ bars/rows/table افتراضيًا | chartPolicy والمتغيرات الستة، Overview، مقارنة نفس البيانات بأشرطة |
| CHART-002 | FIXED | سياق الرسم قد يغيب لدى المضيف | API صغير: `data-unit` و`data-period` و`data-title` عند غياب عنوان مرئي؛ لا استنتاج قيم مجهولة | اختبار metadata في `light-data-check.py`، مواصفة Data |
| CHART-003 | OPT-IN | Donut أبطأ للفئات المتقاربة | أبقي لحصص قليلة عامة فقط؛ موثق opt-in، ومقارنة 4/3/3 بالأشرطة | الصور المتطابقة والجدول؛ لا ادعاء فشل وصولية شامل |
| CHART-004 | NOT REPRODUCED | قص عربي بعد الخط/إعادة القياس | لم يُنشأ إصلاح وهمي؛ أضيف regression بعد fonts.ready وrender ونص مكبر | فحوص 320/390 في Data؛ القراءات الكاملة والمصدر محفوظان |
| FIELD-001 | NOT REPRODUCED | ادعاء تعدد إطار الخطأ والتركيز | لم تُحذف حلقة التركيز؛ حد الحالة منفصل عن focus | فحوص المكونات والمراجعة المستقلة للحقل |
| FIELD-002 | NOT REPRODUCED | ادعاء تكرار رسالة | نفس عقدة الرسالة، لا DOM بديل | تتابع error/success/clear/input، عدد عقد الرسائل=1 |
| FIELD-003 | NOT REPRODUCED | حجم Eye/Plus/Minus | لا إعادة رسم أو تصغير؛ 48px هدف و24px glyph وفق العقد | component-mobile والمراجعة المستقلة |
| FIELD-004 | NOT TESTABLE | صور قديمة غير متاحة | لا ادعاء إعادة إنتاج أو إصلاح | لا يمكن مقارنة صورة غير مرفقة |
| PREVIEW-001 | FIXED | المثال يوعد بصورة شهر غير معروضة | العنوان يتابع `data-ocal-layout`: rail/grid/day/list؛ شرح Showcase تكيفي | الاختبار والعنوان الفعلي |
| PREVIEW-002 | FIXED | error/success لا يظهران فعليًا | `.is-visible`، aria-invalid، ربط الرسالة، clear يحفظ القيمة، input يعيد الطبيعي | التتابع الكامل في اختبار مستقل ومكونات المصدر |
| PREVIEW-003 | FIXED | debug بجانب العرض الافتراضي | Overview نظيف؛ State Lab وdeep links وأدوات الحالة محفوظة | فحوص الحالات والمصفوفة وصورة Overview |
| DOC-001 | FIXED | العدد وInfo Peek غير موحدين | 14 عائلة من الكتالوج؛ 6 متغيرات opt-in صريحة؛ Peek stable-ui opt-in | مولد الكتالوج و`--check` ومساراته |
| DOC-002 | FIXED | تعليق شهر قديم عن خلايا صغيرة | وصف 360px و48px وRail مطابق للمصدر | CSS والمواصفة وفحص الروابط |

`DEFERRED` في سطري Dark يعني **مستثنى بتفويض المالك**، لا وعدًا بإصلاح مؤجل ضمن هذه الدفعة.

## 6. Brand Accent وحدود Light بالتحديد

### 6.1 اللون والدور

- `--micro-brand-accent` يبقى Brand.
- `--micro-data-b` يبقى سلسلة بيانات؛ لا يمثل نجاحًا أو خطأ.
- القيمة نفسها لا تدمج الدورين: كلاهما `#D97757` دون palette جديدة.
- حبر العداد والشارة في Light يبقى `#172D32`؛ النسبة المحسوبة مع Accent حوالي **4.6141:1** للنص الصغير.
- لا Accent لـselected/focus/success/warning/danger/error، ولا recolor للشعار.

### 6.2 ما تغير من selectors

| الملف / selector | القاعدة | السبب |
|---|---|---|
| `info-strip.css`: `.m-info-card--accent .m-info-card__label` | حد منطقي 3px من Accent مع padding توكن قائم | علامة صغيرة لملخص مرجعي، لا سطح ملون كاملًا |
| `data.css`: `.m-chart--bubbles .m-bubble__circle` | `overflow: visible` | تجنب قص نصف stroke عند حدود SVG |
| `data.css`: `.m-chart--bubbles .m-bubble__circle circle` | stroke من `--micro-data-boundary`، 1px، non-scaling-stroke | الحد على الدائرة المرئية نفسها، لا wrapper |
| `packed-circle.css`: `.m-chart--packed .m-bubble__circle` | `inset 0 0 0 1px var(--micro-data-boundary)` | span HTML يحتاج background/box-shadow، لا SVG stroke |
| `tokens.css` | احتواء تعريفات Dark/System القديمة داخل `@media not all` | منع التفعيل فقط؛ القيم الأصلية محفوظة |

تعبئة `data-c=#B6A3D6` مقابل الأبيض تقارب **2.2829:1**؛ الحد يستخدم حبر الدور القائم `#50656A` لا لونًا جديدًا. لا تتغير هندسة المساحة أو القيم. الصفر/الغياب/السالب يحتفظ بعلامته وقراءته، لا يتحول إلى دائرة موجبة.

دوائر Metric تملك inset صالحًا مسبقًا في Light، وأشرطة Main Metric والأعمدة والنقاط والـlegend لا تحتاج زخرفة عامة جديدة حيث القياس صالح. لم يُعمم حد جديد عليها لمجرد توحيد الشكل.

## 7. Calendar: العقد الجديد كاملًا

تفاصيل APIs والأحداث والاختبارات في [CALENDAR-NOTES.md](CALENDAR-NOTES.md).

### 7.1 قواعد العرض

| viewport | الجذر في الفحص | شهر عند الوضع الجديد |
|---:|---:|---|
| 320 | 288 | Date Rail بخمسة أيام + عنوان يفتح Picker |
| 360 | 328 | Date Rail + Picker |
| 390 | 358 | Date Rail + Picker |
| 430 | 398 | شبكة الشهر؛ Picker متاح أيضًا |

حد الشبكة 360 CSS px: 7×48 + 6×4. ليست المشكلة عرض الجهاز وحده؛ الحاوية هي المقياس. لا شبكة شهر مزيفة بأهداف أصغر من 48px.

### 7.2 الشهر والتاريخ

- `monthCursor` شهر العرض، و`selectedDate` التاريخ المحدد؛ ليسا القيمة نفسها.
- السابق/التالي للشهر وPicker يغيران العرض فقط؛ لا `day-select` ولا تغيير الطلبات.
- في الشهر الأقصر يبقى التاريخ القديم الكامل محددًا، ولو خارج الشهر المعروض؛ لا clamp صامت من 31 إلى 28.
- النقر على تاريخ/Today/تنقل اليوم اختيار فعلي وفق الحدث الحالي.
- `setSelectedDate(date)` الصريح من المضيف يبقى صامتًا ويزامن الشهر كما ينص العقد.
- البيانات القديمة لا تعاد كتابتها؛ loading/error/empty وحالة الطلبات مستقلة عن التنقل.

### 7.3 Picker وDate Rail

- منتقي محلي `role=dialog` غير modal شامل للصفحة، ليس طبقة نظام أو history.
- 12 شهرًا في شبكة أربع أعمدة؛ أهداف لا تقل عن 48px، وأسماء تتكيف دون قص.
- السابق/التالي للسنة مع حدود السنة؛ انتقال ديسمبر/يناير مفحوص.
- اختيار الشهر يغلق Picker ويعيد التركيز إلى عنوان الشهر. Escape/رجوع يغلقان دون تطبيق شهر غير مختار.
- أسهم الأشهر/اليوم تتبع RTL/LTR؛ Home/End وتنقل الأسابيع يحافظ على الفرق بين focus وselection.
- Date Rail والتنقل القريب ليسا بديلًا عن إمكانية القفز لشهر بعيد.
- تغيير عرض الجذر يعيد layout ويحاول حفظ التركيز على التحكم/التاريخ المكافئ.

### 7.4 سمات/actions للفحص والمضيف

`data-ocal-layout` = `date-rail|month-grid|day|list`؛
`data-ocal-selected-date`؛
`data-ocal-date-rail`؛
`data-ocal-grid`؛
`data-ocal-picker`.

أفعال Picker: `month-picker`, `picker-prev-year`, `picker-next-year`, `picker-month` بقيمة 0–11، `picker-back`. اختيار Rail: `date-rail-day`. لا backend أو جدولة أو استدعاء أعمال مضاف.

## 8. قرار كل chart — تقني وبصري منفصلان

الدرجات **تقدير مهني إرشادي** لا نتائج دراسة مستخدمين. لا يُستنتج الاحتراف من مرور assertion.

| النوع | القرار | Technical في Light | Visual/Communication | الفهم | سبب البقاء |
|---|---|---|---|---:|---|
| Bars | REFINE | القيم والنطاقات والحالات ومحور الصفر والجدول سليمة ضمن الفحوص | أوضح مقارنة فئات وقيم دقيقة | 5/5 | بداية المقارنة؛ إضافة سياق المضيف دون تزيين زائد |
| Line | KEEP | gaps/time الصريح وsigned والقراءات محفوظة | اتجاه مرتب؛ الزمن لا يُستنتج من اسم الفئة | 4/5 | مفيد للاتجاه، وليس بديلًا لترتيب قيم غير مترابطة |
| Donut | MAKE OPT-IN | المقام والقطاعات والجدول كما هي | صالح لحصص قليلة؛ بطيء للفئات المتقاربة | 3/5 | لم يفقد غرضه المهني، فلا مبرر لحذفه كله |
| Bubbles | MAKE OPT-IN | المساحة √value وحالات non-area محفوظة؛ الحد الفعلي أضيف | تقدير أحجام تقريبي لا مقارنة مالية | 2/5 | مثال متخصص، لا افتراضيًا في Overview |
| Packed Circle | MAKE OPT-IN | المصدر والنسب محفوظة؛ inset فعلي | تجميع بصري أكثر من ترتيب دقيق | 2/5 | مقترح/اختياري، مع قائمة قراءة دقيقة |
| Metric Circles | MAKE OPT-IN | المقاييس والحالات والحد القديم محفوظة | يحتاج المفتاح ولا يضاهي rows للدقة | 2/5 | عرض تقريب معلن، لا default |
| Main Metric flat | KEEP | وحدة/فترة المضيف والمقياس والإشارات محفوظة | مضغوط وواضح للقيمة ومقارنتها | 5/5 | تركيب المقارنة القياسي |
| Main Metric featured | MAKE OPT-IN | لا تغيير للحساب؛ القراءة الرئيسية خارج مقياس الأشرطة | كتلة بارزة واحدة للتأكيد، لا لكل صف | 4/5 | استعمال محدود مقصود؛ ليس دائرة progress |
| Stats | KEEP | قيمة/وحدة/إشارة/غياب والتفاف العدد | قراءة مباشرة أفضل من رسم دون مقارنة | 5/5 | أقل عبء بصري للقيمة الواحدة |
| Progress | KEEP | المحدد وغير المحدد وreduced-motion محفوظة | صالح لهدف وتقدم حقيقيين معروفين | 4/5 | لا استنتاج هدف من قيمة عشوائية |
| Steps | KEEP | ترتيب وحالات المضيف ضمن الفحوص | تسلسل رأسي وشارة الحالي؛ لا لون وحده | 4/5 | للمراحل لا للمقادير؛ Dark مستثنى |
| Disclosure Table | KEEP | جدول دلالي وقراءات من المصدر نفسه | القراءة الدقيقة والكاملة | 5/5 | ليس تكرارًا بلا غرض؛ بديل قرائي دقيق |

**لم يُحذف أي نوع**؛ لا CSS/JS ميت جديد بسبب حذف. Bubbles وMetric Circles وDonut وfeatured أصبحت متغيرات opt-in صريحة إلى جانب Packed وInfo Peek، دون خلق عائلات جديدة.

### 8.1 مقارنة موحدة

`tools/light-evidence-capture.py` يخدم موارد **قبل** من Git عند commit البداية وموارد **بعد** من المصدر الحالي، ويستخدم نفس HTML fixture حرفيًا، و390px RTL وLight وDPR1 والخط نفسه بعد fonts.ready.

- 12 هدفًا × قبل/بعد = 24 صورة.
- مقارنة Packed نفسه بأشرطة، وDonut نفسه بأشرطة × مرحلتين = 4 صور إضافية.
- المجموع **28 صورة chart**، لا 28 اختبارًا أو chart مختلفًا.
- Packed والأشرطة المقابلة يستخدمان المصدر نفسه 10/1/4؛ Donut والأشرطة المقابلة 4/3/3.
- الحدود والسياق هي التغييرات، لا الأرقام أو المساحة النسبية.
- صور matrix الأخرى تثبت العروض والاتجاهات وDPR؛ ليست هي بالضرورة أزواج قبل/بعد.

### 8.2 Metadata دون اختراع

`data-unit` و`data-period` اختياريان يملكهما المضيف. القيمة النصية تعرض كما مررت بعزل اتجاهي. لا قيمة افتراضية لعملة أو سنة أو فترة. `data-title` يظهر فقط عند غياب `.m-chart__title` كيلا تتكرر تسمية مرئية موجودة. حذف السمات ثم render يزيل سياقها بدل إبقاء قيمة قديمة. يكتب النص بـtextContent لا HTML.

## 9. Fields وOverview/State Lab

### 9.1 الإصلاح محصور بالمضيف

المشكلة كانت أن المضيف يزيل `hidden` لكن CSS يحتاج `.is-visible`. الآن:

1. normal: لا حالة أو رسالة نشطة.
2. error: `.has-error`، نفس الرسالة تظهر، `aria-invalid=true`.
3. success: تزال حالة الخطأ وaria-invalid، تظهر رسالة النجاح نفسها.
4. clear: تزال الحالة والنص والظهور، **تبقى قيمة المستخدم**.
5. input: يعيد الحالة الطبيعية حسب تركيب المعرض، مع بقاء الإدخال الجديد.

`aria-describedby` يشير إلى ID رسالة الحقل؛ لا إنشاء عقدة ثانية ولا تغيير API MicroFields. clear الحالة ليس زر مسح البحث؛ زر البحث الأصلي يحتفظ بعقده.

### 9.2 تقديم المعرض

Overview يحتوي مكونات مصدر حقيقية: الأسطح والأزرار والحقول والملخص والمقارنة المسطحة. الشرح التقني والسجلات وأدوات الحالات لا تظهر بجانبها. الروابط إلى State Lab وComposition Lab موجودة.

State Lab يحتفظ بعرض RTL/LTR والعروض والـfixtures والحالات وevent logs. `#state-lab` و`#sc-fields` و`#sc-ocal` وغيرها مسارات مباشرة. النقر على قسم لا يترك المستخدم في Overview مع هدف مخفي.

تمت إزالة خيارات Dark/System وlogo-swapping من المعرض؛ ملفات الشعارات نفسها سليمة. لا تغيير للقيم الثابتة في fixtures كي تبدو اللقطات أجمل.

## 10. نتائج الفحوص والأدلة

لا تُجمع الأعداد التالية كأنها أجهزة أو مستخدمون أو حالات مستقلة؛ هناك تداخل متعمد بين فحوص المصدر والمعرض.

### 10.1 الأساس قبل تعديل المنتج

| الأمر | النتيجة |
|---|---|
| `python3 tools/component-catalog-build.py --check` | مطابق للكتالوج القديم؛ 14 عائلة ومتغيران وقت البداية |
| `python3 tools/build-ui-system-showcase-standalone.py --check` | المصدر والملف المولد متطابقان وقت البداية |
| `python3 tools/component-mobile-check.py --out /tmp/light-only-baseline/component` | 52/52 |
| `python3 tools/chart-mobile-check.py --out /tmp/light-only-baseline/chart` | 59/59 |

هذه الفحوص المختارة شُغّلت قبل تعديل المصدر. فحوص التكامل الأوسع أدناه نتائج بعد التنفيذ، لا نتائج baseline معاد تسميتها.

### 10.2 بعد التنفيذ

| الفحص | النتيجة المثبتة | ماذا تثبت |
|---|---|---|
| `light-calendar-check.py` | 79/79 | الجذور الأربعة، الاتجاهان، Picker/focus/الأشهر/السنة وحالات الطلبات والأحداث |
| `light-data-check.py` | 165/165 | 16 تركيبة width/dir/DPR، حالات البيانات والحدود وmetadata وfont-ready/تكبير نص 320/390 |
| `chart-mobile-check.py` | 59/59 | النسب والفجوات والقراءات والتنقل من المصدر |
| `component-mobile-check.py` | 52/52 | 48px وglyphs والحدود وreadonly/disabled وتكبير النص |
| `ui-system-showcase-check.py` | 118/118 | المصدر وfile:// standalone وتفاعلات المكونات |
| `ui-system-showcase-repair-check.py --tag light-only-final --widths 320,360,390,430` | 176/176 | بوابة الانحدار بعد مطابقة عقد الشهر الجديد |
| `concepts-check.py` | 162/162 | أمثلة المصدر والموارد وحالات واجهات المحركات |
| `data-scale-state-check.py` | 23/23 | الانتقالات ومقاييس الرفض/التوسيع وفصل التشخيص عن نص المستخدم |
| `light-release-check.py` | تُثبت أرقام التشغيل المستقل النهائي في سجل التسليم | مصفوفة العرض والمضيف والحقول وCalendar والنسخة المستقلة |
| `light-static-check.py` | يُثبت التشغيل النهائي بعد اكتمال الوثائق | compile، JS، CSS structural، الروابط والتوكنز والأصول وdiff وتوقيعات الأسرار |
| catalog + standalone `--check` | إعادة توليد حتمية | 14 عائلة، 6 متغيرات، 23 رمز أيقونة مطابقًا، ترتيب المصادر |

### 10.3 أخطاء ظهرت أثناء العمل وتصنيفها

1. بوابة repair القديمة أعطت أولًا **172/176**: ثلاث assertions تطالب auto-Day، وواحدة تقسم ارتفاع عنوان صار زرًا 48px على 22 وتعتبره سطرين. هذه توقعات العقد القديم، وليست أربع مشكلات منتج جديدة. حُدثت assertions لتطالب Rail/Picker حقيقيين عند الضيق، وتفحص نطاق حبر عنوان الشهر وحدود زر اللمس بدل تخمين عدد السطور من ارتفاعه. العدد بقي 176؛ التشغيل النهائي **176/176**.
2. أول تشغيل لأداة الصور الإضافية فشل لأن روابط fixture مطلقة تجاوزت بادئة before/after. أُصلح توجيه **أداة الدليل**، لا مصدر الرسم. التشغيل الصحيح أنتج 28 صورة دون أخطاء موارد. لا يُحسب التشغيل الفاشل PASS.
3. لم تُشغّل `professional-remediation-check.py` القديم لأنه يتضمن Dark/System-dark. ليس هناك ادعاء مرور هذا الفحص في الإصدار الحالي.
4. أي نتائج preflight للمراجع المستقل ليست بديلًا عن آخر تشغيل على المصدر المتكامل؛ الأرقام النهائية وحدها في سجل التسليم.

### 10.4 المصفوفة ومعنى التكبير

4 عروض × اتجاهين × لغتي **محتوى مضيف** × مستويي typography × DPR1/2 = **64 تركيبة**، لا 128. English تعني إدخال تسميات وقيم إنجليزية فعلية في fixtures، لا تغيير lang فقط؛ النصوص العربية الثابتة في واجهة المختبر ليست ترجمة إنجليزية كاملة.

تكبير Typography في الاختبارات محاكاة CSS على النصوص، وDPR2 كثافة raster؛ لا واحد منهما native OS zoom أو اختبار إصبع حقيقي. مصفوفة Calendar الإضافية تختبر المحتوى النصي نفسه دون مضاعفة أبعاد الأيقونات أو التباعد.

### 10.5 أماكن الأدلة

كل المخرجات الثقيلة خارج Git، تحت `generated-artifacts/light-only-repair/` أو المجلدات المؤقتة الواردة في مذكرات الفحص:

- `baseline.json`؛ `calendar.json`؛ `data.json`؛ `static.json`.
- `chart-pairs/manifest.json` و28 PNG.
- `calendar-before/` و`calendar-after/`، ثماني صور لكل مرحلة.
- `acceptance/` لنتائج المراجع المستقل وfixtures والصور.
- `overview-390.jpg` و`calendar-390.jpg`: لقطتان من تطبيق المعاينة الجاري نفسه، لا fixture فقط.
- بعض الأدوات القديمة تكتب تلقائيًا داخل `generated-artifacts/professional-ui-repair/`؛ هذا مسار مخرجات، لا نتيجة تاريخية معاد استخدامها.

## 11. حدود الأدلة والقيود الباقية

- لا iOS/Android فعلي، لا WebKit/Safari، لا VoiceOver/TalkBack، ولا keyboard/safe-area/native zoom فعلي.
- لا شهادة WCAG شاملة؛ تم فحص أزواج وعلامات محددة وسلوك وتخطيط.
- لا مستخدمين فعليين أو usability research؛ درجات الفهم المهنية ليست متوسطات مستخدمين.
- Calendar وCarousel يبقيان DRAFT FOR REVIEW؛ الصور والاختبارات لا ترقيهما إلى Stable تلقائيًا.
- Packed يبقى proposed opt-in؛ opt-in لا يعني أنه صار أداة مقارنة دقيقة.
- الصور القديمة غير الموجودة لا يمكن اختبارها. لم تُنشأ إصلاحات خيالية لها.
- تعطي قيم Number هندسة صادقة ضمن دعم المصدر، لا دقة محاسبة أعلى من IEEE-754.
- `light-static-check.py` يفحص توازن CSS والتوكنز والمسارات، لا CSS standards validator كاملًا. فحص الأسرار توقيعات مرتفعة الثقة في diff، لا برهان استحالة وجود أي سر.
- لا ضمان جاهزية إنتاجية أو نقل إلى منتج آخر قبل بوابة منصة مستقلة.

## 12. التشغيل وإعادة التحقق

```bash
python3 tools/preview-server.py
```

من المعاينة:

```text
/previews/ui-system-showcase/index.html
/previews/ui-system-showcase/index.html#state-lab
/previews/ui-system-showcase/index.html#sc-fields
/previews/ui-system-showcase/index.html#sc-ocal
/components/order-schedule/example-usage.html
/components/data/example-usage.html
```

الملف الواحد `previews/ui-system-showcase/standalone.html` يعمل من file:// بعد البناء. لا تعدله يدويًا.

```bash
python3 tools/component-catalog-build.py --check
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/light-static-check.py
python3 tools/light-calendar-check.py
python3 tools/light-data-check.py --out generated-artifacts/light-only-repair/data-rerun
python3 tools/light-release-check.py
python3 tools/light-evidence-capture.py
python3 tools/component-mobile-check.py --out generated-artifacts/light-only-repair/component-rerun
python3 tools/chart-mobile-check.py --out generated-artifacts/light-only-repair/chart-rerun
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag light-only-rerun --widths 320,360,390,430
python3 tools/concepts-check.py --base "https://$REPLIT_DEV_DOMAIN" --out generated-artifacts/light-only-repair/concepts-rerun
python3 tools/data-scale-state-check.py --out generated-artifacts/light-only-repair/scale-rerun
git diff --check
```

أوامر المولد عند تغير المصدر:

```bash
python3 tools/component-catalog-build.py
python3 tools/build-ui-system-showcase-standalone.py
python3 tools/manifest-build.py
```

## 13. مراجعة مهنية للنظام بعد الإصلاح

النظام أوضح للهاتف، لأن التنقل في الشهر صار وظيفة فعلية لا زرًا شكليًا، ولأن المقارنة الدقيقة لم تعد تبدأ بدوائر تقريبية، ولأن واجهة العرض لم تعد تعرض التشخيص كأنه واجهة مستخدم نهائية. حضور Accent صغير ومقصود ويحافظ على Petrol.

أقوى الأجزاء: rows/bars والملخص المسطح والقراءات المباشرة. الأشكال المساحية ما زالت أقل كفاءة للدقة، ولذلك أبقيت خيارًا متخصصًا لا واجهة افتراضية. Calendar يحتاج اعتمادًا بصريًا من المالك واختبار منصة، لا إعادة بناء أعمال أو افتراض منتج غير موجود.

## 14. قائمة تحقق قبل الدمج — للمالك، لا إذن merge تلقائي

- [ ] مراجعة Overview والتقويم وPicker على هاتف فعلي.
- [ ] اعتماد اختيار الإبقاء على الرسوم المتخصصة opt-in.
- [ ] اختبار WebKit/Safari وقارئ شاشة عند الانتقال لمرحلة منصة.
- [ ] مراجعة المصدر والوثائق وأوامر إعادة الإنتاج على الفرع.
- [ ] التحقق من HEAD الفرع ومطابقته لسجل التسليم.
- [ ] اتخاذ قرار merge منفصل؛ لم يُنفذ هنا.
- [ ] اتخاذ قرار publish منفصل؛ لم يُنفذ هنا.

## 15. فهرس الملفات

M=ملف قائم عُدّل؛ A=ملف جديد. لا تدخل الصور أو المخرجات المستثناة أو cache أو ذاكرة العامل الخاصة في إحصاء ملفات Git.

| الحالة | المسار | التغيير |
|---|---|---|
| M | `AGENTS.md` | نطاق Light-only وتعطيل فحوص Dark لهذه الدفعة |
| M | `DESIGN.md` | الهوية الثابتة ونطاق Light-only |
| M | `README.md` | المرجع الحالي والتشغيل والفحوص وOverview/State Lab |
| M | `shared/tokens.css` | بوابة inert لتعريفات الثيم القديم دون تغيير قيمها |
| M | `components/data/data.css` | تنسيق سياق المضيف وحدود Bubbles |
| M | `components/data/data.js` | مزامنة metadata الاختيارية وإزالتها، دون تغيير math |
| M | `components/data/packed-circle.css` | inset boundary للعلامة HTML |
| M | `components/data/specification.md` | سياق المضيف وopt-in وLight-only |
| M | `components/info-strip/info-strip.css` | marker اختياري على حافة التسمية فقط |
| M | `components/info-strip/example-usage.html` | استعمال marker في ملخص واحد |
| M | `components/info-strip/specification.md` | معنى Accent وحدوده ودور data-b وLight-only |
| M | `components/metric-comparison/specification.md` | فصل المقارنة الدقيقة عن الدوائر الاختيارية |
| M | `components/order-schedule/order-schedule.js` | Picker وRail والفصل بين العرض والاختيار والتركيز والكيبورد |
| M | `components/order-schedule/order-schedule.css` | شبكة واسعة، Rail وPicker و48px والتكيف والكثافة |
| M | `components/order-schedule/example-usage.html` | عنوان ديناميكي يطابق layout |
| M | `components/order-schedule/specification.md` | العقد الجديد والأحداث والحالات والتركيز |
| M | `components/access-gateway/specification.md` | تصحيح الادعاء النشط إلى Light-only فقط |
| M | `components/account-settings/specification.md` | تصحيح الادعاء النشط إلى Light-only فقط |
| M | `components/buttons/specification.md` | تصحيح الادعاء النشط إلى Light-only فقط |
| M | `components/carousel/specification.md` | تصحيح الثيم دون ترقية draft أو تغيير السلوك |
| M | `components/fields/specification.md` | تصحيح الثيم؛ لا تغيير API أو هندسة الحقل |
| M | `components/messages/specification.md` | تصحيح الثيم؛ لا تغيير محرك الرسائل |
| M | `components/navigation/specification.md` | تصحيح الثيم؛ لا تغيير طبقات navigation |
| M | `components/organization/specification.md` | تصحيح الثيم؛ لا تغيير شارة Accent |
| M | `components/selection/specification.md` | تصحيح الثيم؛ لا تغيير selected/focus |
| M | `components/surfaces/specification.md` | تصحيح الثيم؛ لا إعادة تلوين الأسطح |
| M | `docs/COMPONENT-CATALOG.json` | releaseTheme وchartPolicy و6 متغيرات صريحة |
| M | `docs/COMPONENT-INVENTORY.md` | مولد من الكتالوج لا تحرير موازٍ |
| M | `docs/CURRENT-STATE.md` | الحالي Light-only، وفصل السجل التاريخي |
| M | `docs/IMPLEMENTATION-VERIFICATION.md` | وسم صريح بأنه تاريخي، لا PASS للفرع الجديد |
| M | `docs/SYSTEM-CONTRACTS.md` | نطاق الثيم والألوان والرسوم والتسليم الحالي |
| M | `docs/UI-RELEASE.md` | أوامر القبول الحالية ونطاقها |
| M | `docs/UI-VISUAL-SYSTEM.md` | 14 عائلة وInfo Peek stable opt-in |
| M | `previews/ui-system-showcase/index.html` | Light-only، opt-in، وصف التقويم وmarker واحد؛ payload كتالوج مولد |
| M | `previews/ui-system-showcase/showcase.css` | Overview بمكونات فعلية، إخفاء debug عنه، لا تفعيل Dark |
| M | `previews/ui-system-showcase/showcase.js` | إصلاح حالات الحقل وتثبيت Light والتقديم |
| M | `previews/ui-system-showcase/standalone.html` | بناء حتمي من المصدر، لا تعديل يدوي |
| M | `tools/component-catalog-build.py` | اشتقاق عدد المتغيرات والتحقق من مساراتها |
| M | `tools/ui-system-showcase-repair-check.py` | تحديث F-08 لعقد Rail/Picker وقياس حبر العنوان |
| A | `tools/light-calendar-check.py` | regression خاص بالتقويم من مصدره |
| A | `tools/light-data-check.py` | regression للبيانات والحدود والسياق والخط |
| A | `tools/light-release-check.py` | تحقق مستقل ومصفوفات ومخرجات قبول |
| A | `tools/light-static-check.py` | بوابات compile/JS/CSS/روابط/توكنز/أصول/diff |
| A | `tools/light-evidence-capture.py` | صور قبل/بعد من baseline Git والمصدر الحالي بنفس fixture |
| A | `docs/replit/light-only-complete-ui-repair-2026-10-24/PLAN.md` | خطة الفرع قبل التعديل |
| A | `docs/replit/light-only-complete-ui-repair-2026-10-24/CALENDAR-NOTES.md` | تفاصيل العقد واختباراته |
| A | `docs/replit/light-only-complete-ui-repair-2026-10-24/CHART-DECISIONS.md` | قرار كل رسم والأدلة |
| A | `docs/replit/light-only-complete-ui-repair-2026-10-24/SHOWCASE-NOTES.md` | تركيب المعرض ومسار فحص الحقل |
| A | `docs/replit/light-only-complete-ui-repair-2026-10-24/INDEPENDENT-REVIEW.md` | نتيجة المراجع غير المؤلف للإصلاحات |
| A | `docs/replit/light-only-complete-ui-repair-2026-10-24/REPORT.md` | هذا التقرير العربي |

لا ملفات محذوفة ولا تغييرات لأصول v2 أو ألوان العلامة. يُراجع هذا الجدول مع `git diff --name-status` في بوابة التسليم، لا يُكتفى بكتابته.

## 16. سجل التسليم النهائي

يستكمل بعد نتيجة المراجع المستقل وdiff ورفع الفرع. لا تُقرأ المسودة على أنها إثبات push.
