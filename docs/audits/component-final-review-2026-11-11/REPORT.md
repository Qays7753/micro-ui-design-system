# المرحلة السادسة — القبول النهائي لنظام المكونات المستقل

اكتملت بوابات Light المحددة لهذه المراجعة، وفحص العائلات الـ14 والمتغيرات الاختيارية الستة. أُصلح عيب إضافي مثبت في اتجاه التاريخ الصريح داخل الرسم الزمني. النتيجة قبول تقني ضمن النطاق الموثق أدناه؛ لا تعني اعتمادًا بصريًا تلقائيًا للخيارات Draft/Proposed، أو قبولًا داخل تطبيق أو على جهاز فعلي.

## النسخة والحدود

- المستودع الوحيد: `Qays7753/micro-ui-design-system`.
- أساس الفرع من main: `041c5a1096424047ebacccc9ca19c4b49e20aac1`.
- بداية المرحلة السادسة: `0fcaff4e81a12ae7fb516d481317f8342641e59d`؛ رأس الفرع البعيد قبل رفع المرحلتين5 و6: `382780f3dc0f1263311af78f16ac4ba85ce38e64`.
- مصدر المكونات المثبت والمختبر: `8adbe8f7220338fd2d6b42d2b85be8e34f05136e`. الالتزام اللاحق يضيف تقرير التسليم والأدلة والحاضنات وMANIFEST فقط؛ بصمات المصدر في [verification-summary.json](verification-summary.json) تتيح التحقق من تطابقه مع رأس التسليم.
- [فرع المراجعة الوحيد](https://github.com/Qays7753/micro-ui-design-system/tree/feature/ui-system-component-audit-repair-2026-11-11). الرأس النهائي هو commit التقرير الظاهر في GitHub، ويسجل SHA الكامل في رد التسليم؛ تجنبنا بصمة ذاتية دائرية داخل التقرير.
- لم يتغير `shared/tokens.css` أو `assets/` أو نضج الكتالوج. لم يُفحص مستودع Micro، ولم تُنشأ شاشات منتج أو أغلفة إطار له.

## تغطية العائلات — 14/14

الحكم «سليم ضمن النطاق» يعني عدم وجود عيب مؤكد مفتوح في الحالات المفحوصة، وليس ضمانًا لكل تركيب ممكن. «أُصلح» يشمل الدفعات السابقة على الفرع نفسه.

| العائلة | النتيجة | الحالات والمتغيرات التي راجعناها |
|---|---|---|
| Buttons | أُصلح واجتاز | الأنواع والأحجام والأيقونة وfull-width؛ عادي/تركيز/معطل/تحميل؛ B الافتراضي وloading-replace التوافقي؛ ثبات المقاس والاسم ومنع التكرار. |
| Fields | سليم ضمن النطاق | النص والبحث وكلمة المرور والنص الطويل والكمية؛ التسمية والمساعدة والخطأ والفراغ والملء وreadonly/disabled؛ المسح وخطوات الكمية والتركيز. |
| Selection / Picker | أُصلح واجتاز | checkbox/radio/switch وpending، segmented والمجموعة متعددة الاختيار؛ Picker بحث واختيار وتبديل الخيارات/loading/error/retry/disabled وبحث بلا نتائج؛ RTL والمفاتيح والنسخ. |
| Organization | أُصلح واجتاز | الأقسام القابلة للطي، الصفوف والشارات والصور البديلة؛ النسخ وإعادة الربط والمفاتيح. تزاحم صف العرض عولج بوصفة تركيب المعاينة، لا بتغيير المكوّن. |
| Data | أُصلح واجتاز | bars/rows/line/table والزمن والإشارات والفجوات؛ صفر/غياب/غير صالح/تعارض/نطاق سالب؛ القيم الخام والوحدة والفترة والتشخيص وجدول الإفصاح؛ donut/bubbles/Packed أدناه. |
| Messages | أُصلح واجتاز | info/success/warning/error/note، تحميل وفراغ ولا نتائج؛ نسخ وإغلاق؛ قناتا الإعلان المنفصلتان؛ Toast يوقف الوقت أثناء التركيز ويستأنف الباقي ويعيده لهدف صريح عند انطباق السياسة. |
| Navigation | أُصلح واجتاز | appbar/navbar/tabs وactionbar العادي وstack؛ sheet/dialog/filter؛ Tab وShift+Tab وEscape والاسترجاع والقفل والإلغاء/التطبيق/المسح؛ إصابة الأيقونة وعدم تغطيتها. |
| Surfaces | سليم ضمن النطاق | المنحنى المعتمد وplain، العنوان والقراءة والنص؛ CSS فقط، لذلك دورة أحداث/تحميل/خطأ ذاتي لا تنطبق. الخيارات الزخرفية التاريخية Proposed موثقة ولا تُفعّل أو يُعاد تصميمها. |
| Info strip | أُصلح واجتاز | البطاقة العادية وfeatured، الشريط compact، 0/1/2/7 عناصر؛ انتقال ومفاتيح وسحب حيث ينطبق، نسخ وإعادة قياس وتنظيف؛ Peek أدناه. |
| Metric comparison | أُصلح واجتاز | flat/compact/featured، standard/small/zero/negative/missing/invalid/mixed؛ القيم الموقعة والوحدة والفترة والجدول؛ circles منفصلة ومتداخلة وفق العقد. |
| Account settings | أُصلح واجتاز | عرض الحساب والتطبيق والتنقل بينهما، المفاتيح والتبديل والرجوع والإغلاق وتركيز المشغّل؛ لا حفظ أو حسابات خلفية مفترضة. |
| Access gateway | أُصلح واجتاز | فارغ/خطأ/كشف كلمة المرور/busy ونتيجة المستهلك والرفض والنتيجة غير المؤكدة؛ منع الإرسال المكرر؛ خيار الاستعادة عند توفير callback وخطه وحدوده. لا ادعاء مصادقة. |
| Order schedule | أُصلح واجتاز؛ يبقى Draft | شهر/أسبوع/يوم، تقويم/قائمة، منتقي شهر/سنة، صف مختصر/موسع، تحميل/خطأ/فراغ و100طلب؛ صلاحية التاريخ والمعرفات والأحداث وواجهة الحالة العامة والتنظيف؛ يحتاج اعتمادًا بصريًا منفصلًا. |
| Carousel | سليم ضمن النطاق؛ يبقى Draft | 0/1/متعدد، انتقال وسحب وإلغاءه ومفاتيح RTL/LTR؛ تفاصيل مطوية/موسعة، الشرائح غير النشطة inert، إعادة الإلحاق والتنظيف؛ لا autoplay. يحتاج اعتمادًا بصريًا منفصلًا. |

## المتغيرات الاختيارية — 6/6

| المتغير | النتيجة | قيد الاستخدام المحفوظ |
|---|---|---|
| donut | أُصلح مسار الجدول المشترك واجتاز | حصص فئات قليلة، مقام معلن؛ صفر مقابل غياب/سالب/تعارض؛ جدول دقيق عند الحاجة. |
| bubbles | أُصلح مسار الجدول المشترك واجتاز | عرض تقريبي متخصص، مع كشف القيم الدقيقة؛ ليس افتراضي المقارنة. |
| packed-circle | أُصلح واجتاز؛ يبقى Proposed | جدول ونسخ ومعرفات وinit(root)/disconnect والرصد؛ لا تفعيل افتراضي أو ترقية اعتماد. |
| metric-circles | أُصلح واجتاز | المقارنة العددية والجدول والحالات، separated/overlap بحسب العقد؛ التداخل المقصود ليس عيب تراكب عناصر تحكم. |
| main-metric-featured | أُصلح المسار المشترك واجتاز | قراءة محورية واضحة ومقارناتها، مع الوحدة والفترة؛ opt-in. |
| info-strip-peek | أُصلح واجتاز | مساحة البطاقة والبطاقة التالية، 0/1/متعدد، تغير العرض والخط والنسخ ودورة الحياة؛ opt-in، وcompact يظل الافتراضي. |

اختيار الرسم لقرار صاحب مشروع يبقى متعلقًا بالسؤال والبيانات: bars/rows/table للمقارنة الدقيقة؛ الرسوم الدائرية والمتخصصة اختيار صريح. لم نستبدل البيانات أو نغيّر السياسة لتحسين شكل لقطة. لا حاجة لإجبار كل مكوّن ساكن على حالات loading/error لا يملكها.

## العيب الجديد ودليل إصلاحه

كان النص المنطقي للتسمية العربية يتضمن `2026-01-01`، لكن مواضع glyphs داخل سياق RTL تعرض أجزاء إحداثي التاريخ بترتيب معكوس. انطبق ذلك على القراءة المرئية وعلى رأس صف الجدول؛ إضافة بادئة ترتيب في المسار الموقّع كانت تسطح DOM وتفقد العزل أيضًا.

- أضاف `components/data/data.js` مسار `writeFullLabel` يعزل إحداثي `data-x` الصريح بـ`bdi dir=ltr` عند `data-axis-type=time` فقط، ويحفظ النص الخام كاملًا. إضافة الترتيب أصبحت عقدة نص قبل الأبناء بدل استبدالهم. لا تحليل تخميني لتسميات الفئات ولا تغيير بيانات.
- أضيفت أربع تحققات تقيس ترتيب السنة والشهر واليوم بمواضع Range، للقراءة ورأس الجدول في RTL/LTR، باستخدام تاريخين غير متناظرين `2026-01-02` و`2026-02-13`.
- [التشغيل قبل الإصلاح](evidence/time-label-before.json): **33 نجاحًا و4 إخفاقات** على `0fcaff4…`؛ [بعد الإصلاح](evidence/contracts.json): **37 نجاحًا وصفر إخفاقات**. التوقعات نفسها في التشغيلين. تجربة إصلاح أولية أعطت35/2 فشخصنا فقدان DOM في المسار الموقّع وأصلحناه قبل التثبيت؛ لم نضعف الاختبار.
- [لقطة قبل](evidence/time-label-before.png) و[لقطة بعد](evidence/time-label-after.png). الشاشات تستخدم أمثلة المعرض؛ الدليل العددي غير المتناظر في JSON يمنع التباس تاريخ يومه وشهره متساويان.
- حُدثت مواصفة Data وREADME، وأعيد توليد standalone وMANIFEST بالطريقة المعتمدة.

فُحصت أيضًا إشارة السالب في القراءة الخارجية للمقارنة وثبت ترتيبها الصحيح بقياس glyphs؛ لم نغيّرها لمجرد الاشتباه البصري.

## الإصلاحات السابقة المعاد التحقق منها

تقرير [الدفعة الأساسية](../component-audit-2026-11-11/REPORT.md) يثبت إصلاح تهيئة النسخ ودورة الحياة عبر Selection وOrganization وData وMessages وNavigation وInfo/Metric/Account، وPacked والتنظيف، وصلاحية التواريخ والمعرفات في Calendar. واجهة Calendar للحالة والشهر والأحداث إضافة عامة موثقة؛ ليست منطق مضيف أو URL.

تقرير [المرحلة الخامسة](../component-consumption-repair-2026-11-11/REPORT.md) يفصل إصلاح حصر التركيز في Navigation، وربط Picker المنسوخ، واتجاه أرقام جداول Data/Metric/Packed، وloading-replace في Buttons، ومظهر استعادة Access. ويثبت سياسة Toast المعتمدة وإصلاح تركيب footer وصف المعاينة. أدلة تلك المرحلة تبقى موسومة برأسها؛ اللقطات هنا من مصدر المرحلة السادسة.

دليل [الاستهلاك العام](../../COMPONENT-CONSUMPTION.md) و[بطاقات العائلات](../../FAMILY-CONSUMPTION.md) يحددان DOM والاعتماديات والملكية والتحديث والتنظيف وSOP القبول والاستثناءات. تغليف المكونات حسب إطار التطبيق وبياناته وطرق حفظه مسؤولية مرحلة مضيف لاحقة. لم ننسخ Showcase إلى منتج.

## الاختبارات الفعلية

| الفحص | نجاح | إخفاق |
|---|---:|---:|
| component-consumption-contract-check.py |37|0|
| component-audit-check.py |65|0|
| calendar-contract-check.py |41|0|
| clone-lifecycle-check.py |31|0|
| light-release-check.py --review-scope |35|0|
| light-data-check.py --review-scope |40|0|
| complete-repair-lifecycle-check.py --review-scope |155|0|
| light-calendar-check.py --review-scope |126|0|
| preview-runtime-check.py --review-scope --standalone-http |28|0|
| data-scale-state-check.py --width 360 |23|0|
| checks/focused.py — مفاتيح ولمس محاكى وأسماء AX |67|0|
| checks/visual-focused.py — هندسة ومعاينات الإصلاحات |8|0|
| light-static-check.py |238|0|

المجموع **894 نجاحًا وصفر إخفاقات**. هذه تحققات متداخلة، وليست عدد سيناريوهات مستقلة أو شهادة إتاحة. كل سجل بوابة محفوظ في `evidence/`. لا أخطاء JavaScript أو موارد مسجلة في جلسات التسليم، ولا فيض صفحة أفقي في28تحميلًا (المعرض والمعاينة لكل عائلة). جرى فحص الأبعاد وإصابة الأزرار والتفاعل واللقطات، وليس وجود DOM وحده.

فحص الكتالوج الحتمي:14 عائلة و6 متغيرات؛ standalone يطابق إعادة البناء والأيقونات24؛ MANIFEST مطابق للمصدر؛ `git diff --check` نظيف. نتائجها النصية في `evidence/deterministic.txt`.

أضيف `--review-scope` لبوابة Calendar مع إبقاء السلوك الافتراضي القديم: تشغيل360×780 RTL، وLTR حيث يؤثر الاتجاه، و320 للحالة الضيقة المستهدفة؛ تُستثنى390/430 وتجربة الجذر العريض ويعلنها JSON صراحة. هذا ضبط نطاق لتعليمات المالك، لا حذف توقعات لتجاوز فشل. لم تُشغّل فحوص Dark أو zoom أو مصفوفة عروض موسعة.

## إعادة التشغيل

من جذر المستودع، مع Python وPlaywright وChromium ومتطلبات المشروع:

```bash
python3 tools/component-consumption-contract-check.py --out /tmp/micro-final-contracts
python3 tools/component-audit-check.py --out /tmp/micro-final-families
python3 tools/calendar-contract-check.py --out /tmp/micro-final-calendar-contract
python3 tools/clone-lifecycle-check.py --out /tmp/micro-final-clones
python3 tools/light-release-check.py --review-scope --out /tmp/micro-final-release
python3 tools/light-data-check.py --review-scope --out /tmp/micro-final-data
python3 tools/complete-repair-lifecycle-check.py --review-scope --out /tmp/micro-final-lifecycle
python3 tools/light-calendar-check.py --review-scope --out /tmp/micro-final-calendar
python3 tools/data-scale-state-check.py --width 360 --out /tmp/micro-final-scale
python3 docs/audits/component-final-review-2026-11-11/checks/focused.py
python3 docs/audits/component-final-review-2026-11-11/checks/visual-focused.py
python3 tools/light-static-check.py --out /tmp/micro-final-static.json
python3 tools/component-catalog-build.py --check
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/manifest-build.py --check
git diff --check
```

Runtime يتطلب خادم معاينة محليًا أولًا (`python3 tools/preview-server.py`، افتراضيًا5000)، ثم في جلسة أخرى:

```bash
python3 tools/preview-runtime-check.py --review-scope --standalone-http --base http://127.0.0.1:5000 --out /tmp/micro-final-runtime
```

حاضنتا `checks/capture.py` و`checks/states.py` تعيدان لقطات العائلات والمتغيرات والحالات فقط؛ ليستا بوابة نجاح بصري آلي. حاضنات `checks/` تستخدم خادمًا مؤقتًا على loopback. يضبط `MICRO_AUDIT_OUT` مجلدها بدل `/tmp` عند الحاجة؛ لا تكتب مخرجاتها إلى المستودع افتراضيًا.

## اللقطات والقياسات

Chromium156.0.8078.79، Light، هاتف محاكى360×780 وRTL، انتظار الخطوط؛ اللقطات الطويلة قصاصات عناصر كاملة من هذا العرض. LTR لفحوص الاتجاه والمفاتيح؛320 فقط للتقويم وDonut والإفصاحات العددية وإعادة القياس المستهدفة. لا قياسات أخرى أو zoom.

- [Buttons](evidence/buttons.png)، [Fields](evidence/fields.png)، [Picker](evidence/picker.png).
- [Navigation وأيقونة الإجراء](evidence/navigation.png)، [تركيب الصف](evidence/row.png)، [إعدادات التطبيق](evidence/settings.png).
- [Calendar](evidence/calendar.png)، [Carousel](evidence/carousel.png)، [Packed Circle](evidence/packed.png)، [Peek](evidence/peek.png).

قائمة التحميل والقياسات والأخطاء في [observations.json](evidence/observations.json)، والحالات الإضافية في [state-observations.json](evidence/state-observations.json). هذه أمثلة مراجعة، لا شاشات منتج.

## ما بقي والقرارات

لا عيب مؤكد مفتوح ضمن الحالات والبيئة المسجلتين بعد الإصلاح وإعادة الفحص. تبقى أمور منفصلة:

1. **قرار اعتماد بصري:** Calendar وCarousel ما زالا Draft، وPacked Circle Proposed. لا ترقية دون مراجعة المالك، ولا إجبار للرسوم المتخصصة على الاستخدام الافتراضي.
2. **حدود تحقق واقعية:** لم نختبر Safari/WebKit أو Android/iOS فعليًا أو قارئ شاشة أو لوحة مفاتيح هاتف فعلية أو safe areas أو native zoom. اختبارات المفاتيح وAX لا تحل محل ذلك.
3. **standalone عبر HTTP:** بروتوكول `file://` محظور في متصفح البيئة؛ نجاح HTTP لا يثبت دعم فتح الملف محليًا. سجّلنا القيد ولم نخفِ فشل الملاحة أو نعدّل سياسة المتصفح.
4. **تركيب التطبيق لاحقًا:** يلزم تقييم حدود CSS وإطار التطبيق ودورة حياته وبياناته وتنقله عند التصريح بمرحلة النقل. دليل SOP يساعد على قبول كل تركيب، ولا يضمن صحة مضيف لم يُفحص. لا ادعاء Native.

توصية لاحقة قبل قبول تجربة الهاتف للمستخدمين: تحقق مركز على الجهاز والمتصفح المستهدفين، وقرار على المسودات، مع إبقاء المقارنة الدقيقة أساس الرسوم. لا توصية منفذة لتغيير الهوية أو الألوان أو التوكنز. التسليم على فرع Feature نفسه للمراجعة فقط؛ لا PR أو دمج أو نشر.
