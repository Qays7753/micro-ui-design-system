# ربط القواعد بالمصدر وحدود التنفيذ

خط الأساس المقروء: main عند `ce3d2c8a7823572adb68433bf21b4a1374ff6d6e`. الحالة DRAFT FOR REVIEW. «موجود» يعني وجود مكوّن/عقد تقني؛ لا يعني أن رحلة المنتج أو قاعدة UX الجديدة اختُبرت. لا نضيف عائلة لأن قاعدة جديدة لها ID.

| القاعدة | مصدر قائم يُستهلك | ما يملكه المكوّن | ما يلزم المستهلك/لم يُثبت بعد |
|---|---|---|---|
| UX-01 | [buttons](../../components/buttons/specification.md) | شكل الفعل وتسميته وتركيزه | الاسم والأثر والوجهة ونقطة نجاح المهمة |
| UX-02 | [buttons](../../components/buttons/specification.md)، [organization](../../components/organization/specification.md) | درجات الأزرار والتجميع | ترتيب قرار المجموعة؛ المراجعة على مثال التركيب |
| UX-03 | [buttons](../../components/buttons/specification.md) | `MicroButtons.setLoading` وحراسة التفعيل | نتيجة الطلب، نقطة الالتزام، idempotency عند الحاجة؛ لا ضمان خادمي |
| UX-04 | [navigation](../../components/navigation/specification.md)، [messages](../../components/messages/specification.md) | حوار وإلغاء وعرض رسالة | تصنيف الخطر، التأكيد أو التراجع الحقيقي |
| UX-05 | [fields](../../components/fields/specification.md)، [account-settings](../../components/account-settings/specification.md) | قيمة إدخال وأحداث تغيير | snapshot/dirty والحفظ الصريح أو التلقائي؛ لا تخزين افتراضي |
| UX-06 | [navigation](../../components/navigation/specification.md) | فتح/إغلاق الطبقة | حراسة المغادرة قبل الإغلاق؛ **ليست API عامة مثبتة في B07**؛ تفحص إمكانية التركيب أولًا |
| UX-07 | [fields](../../components/fields/specification.md) | label ورسالة مرتبطة ووحدة | مضمون التسمية والمساعدة الضرورية |
| UX-08 | [fields](../../components/fields/specification.md)، [data](../../components/data/specification.md) | حالات الإدخال والغياب | معنى صلاحية القيمة وتحققها |
| UX-09 | [fields](../../components/fields/specification.md) | إظهار الحالة | توقيت وقواعد التحقق؛ ليست سياسة تلقائية لكل نموذج |
| UX-10 | [fields](../../components/fields/specification.md)، [messages](../../components/messages/specification.md) | ربط الخطأ وإظهاره | جمع أخطاء نموذج وتنظيم الوصول والتصحيح |
| UX-11 | [fields](../../components/fields/specification.md)، [selection](../../components/selection/specification.md) | readonly/disabled أصلية | سبب تعطيل الإجراء ومخرج المستخدم |
| UX-12 | [selection](../../components/selection/specification.md)، [navigation](../../components/navigation/specification.md) | radio/check/switch/toggle/seg/tabs | وظيفة الاختيار وتوقيت تطبيقه |
| UX-13 | [selection](../../components/selection/specification.md) | `setSwitchPending` وحفظ disabled | التحديث أو الاستعادة ونص فشل الحفظ ونقطة التأكيد |
| UX-14 | [selection](../../components/selection/specification.md) و`picker.js` | `setStatus/setOptions/getSelected` وتزامن الملخص | جلب البيانات، ignore stale response، إعادة المحاولة |
| UX-15 | [navigation](../../components/navigation/specification.md) | جاري/مطبق الفلاتر وأحداث التطبيق | تعريف البحث، نتائج الخدمة وحفظ سياق القائمة |
| UX-16 | [navigation](../../components/navigation/specification.md) | appbar/tabs/navbar كأدوات | خريطة التنقل والرجوع الفعلي؛ لا router في المكتبة |
| UX-17 | [navigation](../../components/navigation/specification.md) | حصر/استعادة التركيز وinert وقفل التمرير | ملاءمة هدف التركيز بعد إزالة المشغّل وحراسة dirty |
| UX-18 | [messages](../../components/messages/specification.md) | note/toast/wait/empty | قناة الرسالة ونصها وشدتها بحسب المهمة |
| UX-19 | [messages](../../components/messages/specification.md) | `announce` وعقود الإعلان | توزيع الإعلان بين المكونات في التركيب؛ قارئ شاشة فعلي غير مختبر |
| UX-20 | [messages](../../components/messages/specification.md)، [selection](../../components/selection/specification.md) | تمثيل حالات القراءة | سياسة القديم وتزامن الطلبات وتحديث النتائج |
| UX-21 | [info-strip](../../components/info-strip/specification.md)، [motion](../../shared/motion.css) | نمطا A05 وبدائل التحكم | اختيار النمط حسب المحتوى؛ اللمس الحقيقي متبقٍ |
| UX-22 | [data](../../components/data/specification.md)، [metric-comparison](../../components/metric-comparison/specification.md) | قيم/رسوم/حالات وعقد مقياس | الوحدة والفترة والحسابات ودلالة اتجاه المقارنة |
| UX-23 | [organization](../../components/organization/specification.md)، [messages](../../components/messages/specification.md)، [surfaces](../../components/surfaces/specification.md) | صفوف وقسم قابل للطي وأسطح | أولوية المحتوى والتحرير؛ لا نصوص منتج نهائية |
| UX-24 | [organization](../../components/organization/specification.md) | صف قراءة وصف فتح وإجراء | توزيع أهداف الضغط دون nesting تفاعلي |
| UX-25 | [tokens](../../shared/tokens.css)، [platform notes](../UI-PLATFORM-NOTES.md) | مقاسات/حدود دنيا وأساس الالتفاف | اختبار الهاتف واللوحة وnative units/safe areas |
| UX-26 | [shared spec](../SHARED-SPEC.md)، [fonts](../../assets/fonts/fonts.css) | RTL وعزل الأرقام والهوية | النص المختلط وقراءة المحتوى الفعلي |
| UX-27 | [access-gateway](../../components/access-gateway/specification.md)، [account-settings](../../components/account-settings/specification.md) | callbacks وحالات العرض | تعريف نتيجة الدخول والحفظ والصلاحيات؛ لا مصادقة أو أمن خدمة |
| UX-28 | [عقد Agent](UX-AGENT-CONTRACT.md) | سجل قرارات وتوقف محدود | توفير حقائق المهمة؛ لا يعرفها UI تلقائيًا |

## فجوات الأولوية، لا عيوب مثبتة في UI

1. دورة نموذج عام: dirty، validate، pending، نجاح مثبت، رفض معروف، نتيجة غير معروفة. هذه طبقة مستهلك مفقودة من مفهوم المكتبة، وليست سببًا لإعادة تصميم الحقول.
2. ربط الإغلاق/الرجوع بحراسة التعديل: قراءة مصدر B07 وتسجيل نقطة الربط قبل التنفيذ. لا تدّعِ اعتراض جميع الطرق من المثال دون قياس Escape/backdrop/close/رجوع فعلًا.
3. فحص أن رسائل المكونات المركبة لا تضاعف الإعلان أو تخفي السبب. نجاح فحص عائلة واحدة لا يثبت التركيب.
4. مصفوفة المنصات الحالية باقية؛ لا يكفي DOM أو اسم role لإغلاق TalkBack/VoiceOver.

دفعة F01 تغطي 1 وعينة محدودة من 2 و3؛ يذكر التقرير ما يحتاج hook عامًا إن ظهر، ولا يضيفه خفية أو يعدّل مصدر UI خارج التكليف.

## قرار F01 بعد مراجعة R1

[بطاقة القبول](F01-ACCEPTANCE.md) تضع النموذج خارج modal؛ B07 يفتح حوار البقاء/التخلي فقط. الإغلاق غير الصريح للتخلي يعني بقاء، لذلك لا تحتاج هذه العينة إضافة حراسة before-close للمكتبة. تنفيذ نموذج كامل داخل modal وحراسة مغادرته يبقى مسألة تطبيق لاحقة؛ لا نعتبرها مغلقة باجتياز F01. الرجوع محلي في العينة ولا يثبت حراسة history/native back.
