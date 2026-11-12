# عقود المكونات الحالية — مرجع الاستهلاك

المرحلة2، 2026-11-12. هذا المرجع يصف **المصدر الموجود** على فرع تدقيق UX؛ لا يعلن قبولًا بصريًا جديدًا أو جاهزية للتركيب داخل Micro. يغطي العائلات14 والمتغيرات6. المواصفة التفصيلية لكل عائلة والكتالوج يحتفظان بسلطتهما؛ [عقود النظام](SYSTEM-CONTRACTS.md) تحسم التعارضات التاريخية. تفاصيل مصدر كل API وأحداثه في [السجل القابل للتحقق](audits/ux-continuation-phase2-2026-11-12/contracts.json).

اقرأ [SOP الاستهلاك](COMPONENT-CONSUMPTION.md) و[بطاقات التحميل والاعتماديات](FAMILY-CONSUMPTION.md) أيضًا. [التراكيب C01/C02/C03](COMPOSITIONS.md) وصفات HTML/CSS منفذة بحالة Draft، دون JavaScript API جديدة؛ [طلب الإغلاق D01](COMPOSITION-CONTRACTS.md) ما زال مقترحًا غير منفذ.

## قواعد مشتركة وحدود مهمة

- HTML الدلالي جزء من المكوّن؛ الذي لا ينتقل هو شاشة Showcase وبياناتها وأدواتها. يعيد المستهلك استخدام المصدر وmarkup الموثق أو موصلًا رقيقًا، ولا ينسخ CSS/JS لكل موضع.
- معظم `init(root)` يقبل الجذر المطابق وأبناءه، ويُستدعى تلقائيًا عند تحميل الوحدة؛ المحتوى الجديد يحتاج تهيئة محددة. Buttons لا يملك init، وSurfaces لا يملك JS، وOrder Schedule يحتاج Element صريحًا. لا نفترض تطابق توقيع العائلات.
- تكرار الربط لا يضاعف المستمعات. هذا لا يعني انعدام الآثار: Data يعيد التصيير ويطلق rendered؛ Carousel وPeek قد يطلقان change عند التنقل البرمجي. لا تُحوّل كل حدث إلى dirty تلقائيًا.
- المستهلك يملك source DOM والبيانات؛ renderer يملك مناطق العرض المولدة فقط. لا يكتب إطار العمل والـrenderer في العقد نفسها. معرّفات المصدر فريدة لكل نسخة. `data-*-ready` المنسوخة ليست بديلًا عن init.
- نظّف الأطفال المضمّنين ثم مالك التركيب قبل إزالة الجذر؛ API الأب لا ينظف كل عائلة بداخله. disconnect لا يعني دائمًا استعادة HTML الأصلي أو حذف الحالة. الاستثناءات أدناه مقصودة.
- CSS الخاص بالهوية والتوكنز والخطوط والأيقونات يُحمّل مرة وفق SOP. `.m-*` ليست عزل Shadow DOM؛ الاختلافات مع حاوية خارجية تُختبر لاحقًا في حاضنة مستقلة.
- الحالات غير المنطبقة ليست نقصًا: لا loading أو error تلقائي لسطح CSS أو صف ساكن. مصدر الحالة والنتيجة التجارية والحفظ والمصادقة والصلاحيات والشبكة وHistory/Back عند المضيف.

## 1. Buttons

المصدر: [المواصفة](../components/buttons/specification.md)، [JS](../components/buttons/buttons.js).

- **المدخلات:** markup `.m-btn`، نوع button/link، الاسم والنص والأيقونة والمتغير والمقاس والعرض من المستهلك. `button.type` صريح داخل النموذج؛ disabled الأصلي وaria-disabled للرابط لا يُستبدلان بمجرد مظهر معطل.
- **التحديث:** `MicroButtons.setLoading(button, flag, {loadingLabel?})`؛ البديل `data-loading-label`. لا يبدأ تحميل زر disabled أصلًا. التحميل المتكرر لا يكرر المؤشر، وإيقافه يستعيد الاسم السابق. حفظ النص الافتراضي وخيار loading-replace يبقيان وفق المواصفة.
- **الأحداث:** لا أحداث مخصصة؛ click تفعيل أصلي، لا «حفظ» تلقائي. loading يمنع التفعيل المتكرر ويحفظ التركيز.
- **الملكية/التنظيف:** مصدر الاسم والمحتوى للمستهلك؛ المؤشر وحراسة التحميل للمكوّن. `disconnect(root)` ينهي التحميل المملوك والحراس؛ ليس إلغاء طلب الشبكة.
- **التغطية التالية:** الأنواع الستة وكل مقاسات/أيقونات/عرض/تحميل المواصفة، طبيعي وتركيز وضغط وتعطيل واسم طويل؛ صفر/فراغ بيانات غير منطبق على الزر نفسه.

## 2. Fields

المصدر: [المواصفة](../components/fields/specification.md)، [JS](../components/fields/fields.js).

- **المدخلات:** `[data-micro-field]` وlabel/control/message؛ قيمة input/textarea وtype/inputmode وrequired/min/max/step/maxlength والوحدة والرسائل من المستهلك. خطأ وصحة وreadonly/disabled تحتاج الحالة الدلالية الفعلية مع CSS، لا صنفًا بصريًا فقط.
- **التحديث:** `MicroFields.init(root)` ثم تعديل `.value` واستدعاء `sync(root)` للعداد والمسح وحالة الخطوة. sync صامت: لا input/change/micro-field، ولا يتعامل مع حقل غير مربوط.
- **الأحداث:** المسح تفاعل يطلق input ثم `micro-field:cleared` بلا detail؛ الخطوة تطلق input ثم `micro-field:changed` بلا detail. استمع لقناة واحدة مناسبة كي لا تحسب الفعل مرتين. لا تنتظر change من تعديل `.value` البرمجي.
- **الملكية/التنظيف:** النص الخام في حقل النص للمستهلك؛ ليست كل أنواع الحقول محلل مال. تطبيع الكمية المقصود في stepper وفق المواصفة لا يُعمّم على النص أو المال ولا يُصنف عيبًا تلقائيًا. `disconnect(root)` و`destroy(root)` اسمان للتنظيف نفسه؛ يوقفان الربط والمراقب، لا يمسحان قيم المستخدم أو ينفذان reset.
- **التغطية التالية:** text/search/textarea/quantity وبقية أنواع المواصفة، وحدة/بادئة/لاحقة/عداد/مسح/خطوة، عادي وفارغ وصفر وخطأ ومعطل وreadonly؛ لصق نص غير صالح، تعيين قيمة مسبقة، RTL/LTR للجزء الرقمي.

## 3. Selection / Picker

المصدر: [المواصفة](../components/selection/specification.md)، [Selection](../components/selection/selection.js)، [Picker](../components/selection/picker.js).

- **Selection:** `MicroSelection.init(root)` للمجموعات والمقاطع؛ native checked/radio/indeterminate والاسم وقيمة العنصر من markup. `setSwitchPending(switchWrapper, flag)` يأخذ `.m-switch`، يقفل input أثناء الانتظار ثم يعيد disabled السابق؛ لا يحفظ الإعداد أو يرجع checked عند رفض الخدمة. `disconnect(root)` يفصل المجموعات والمقاطع وينهي pending للمفاتيح.
- **أحداث Selection:** native input/change؛ `micro-selection:changed` بلا detail عند فعل checkbox المجموعة؛ `micro-selection:segment` بالتفصيل `{value}` عند الاختيار بالنقر أو الأسهم. لا setters عامة لقيمة كل نوع؛ المستهلك يحدّث source وفق مواصفته. لا يدّعي الحساب dirty بناء على كل تغيير في DOM.
- **Picker:** listbox اختيار قيمة، لا menu أوامر. `MicroPicker.init(root)`؛ `setOptions(picker, [{value,label}])` يستبدل الخيارات بمفاتيح string ويحفظ اختيارًا صالحًا؛ لا يدعم item.disabled في هذا التوقيع الحالي. `getSelected(picker)` يعيد `{value,label}` أو null. لا `setSelected` عامة حاليًا؛ الاختيار الابتدائي عبر markup/aria-selected قبل التهيئة.
- **حالات Picker:** `setStatus(picker, kind, message?)` يقبل ready/loading/empty/error/initial/disabled؛ القيمة غير المعروفة تُتجاهل. غير ready يخفي الخيارات القديمة؛ البحث لا يلغي loading/error. لا نتائج البحث مختلفة عن مصدر بيانات فارغ. `setOptions` يعيد ready ويحترم الاستعلام الحالي.
- **أحداث Picker:** `micro-picker:change` يحمل `{value,label}` أو `{value:null,label:null}`؛ عند الاختيار، وعند زواله بعد setOptions، وعند `clearSelection(picker)` حتى لو لم يكن هناك اختيار. `micro-picker:retry` و`micro-picker:close` بلا detail. retry نية، لا جلب آلي؛ close قد يستدعي closeLayer عند وجود Navigation.
- **التنظيف:** `disconnect(root)` يحفظ DOM والحالة؛ `destroy(root)` يحذف الحالة الداخلية أيضًا، دون حذف خيارات المضيف. القائمة والبحث والملخص والـroving للمكوّن؛ البيانات والطبقة والشبكة للمستهلك.
- **التغطية التالية:** checkbox/radio/group/partial/switch/pending/segmented، وPicker مضمّن وداخل طبقة والبحث وحالاته؛ الاختيارات المعطلة والأسهم وHome/End والاتجاه. لا تحويل تاريخ أصلي إلى تقويم جديد.

## 4. Organization

المصدر: [المواصفة](../components/organization/specification.md)، [JS](../components/organization/organization.js).

- **المدخلات:** row/list/section/badge/identity وما تحدده المواصفة؛ النص والقيمة والوحدة والحالة والرابط والإجراء والصورة من المستهلك. الصف متعدد الأفعال حاوية مع رابط وأزرار أشقاء؛ الرابط الشامل لا يحتوي زرًا.
- **التحديث والأحداث:** تحديث source DOM؛ `MicroOrganization.init(root)` للطي وavatar fallback. `micro-organization:toggle` يحمل `{open}` على section بعد التغيير. لا event أو حفظ تجاري للصف الساكن؛ الحقول المالية ليست مسؤولية Organization.
- **التنظيف:** `disconnect(root)` يوقف الربط؛ الصورة الفاشلة قد تكون استُبدلت بالأحرف بالفعل، ولا يعد التنظيف باسترجاعها. المصدر يملك تبديل الصورة/المحتوى لاحقًا.
- **التغطية التالية:** كل أجزاء المواصفة، صف طويل/قيمة طويلة وموقعة/حالة/أفعال متعددة/طي/صورة فاشلة، وفراغ القائمة عند وجوده. وصفة الصف الضيق الحالية في previews ليست CSS منتج معتمدًا بعد؛ انظر تركيب C02.

## 5. Data

المصدر: [المواصفة](../components/data/specification.md)، [JS](../components/data/data.js)، [Packed](../components/data/packed-circle.js).

- **المدخلات:** source `.m-chart__data [data-series]` وdata-value/display وتسميات الفئات والمفاتيح، والوحدة والفترة والمقام والنطاق/المقياس والإحداثي الزمني كما في المواصفة. الرقم الخام للرسم منفصل عن نص العرض؛ لا اشتقاق نسبة من مبلغ أو غياب قيمة من صفر.
- **التحديث:** `MicroData.init(root)` أو `render(chartElement)` بعد تحديث source؛ render ليس API بيانات array. المكوّن يملك plot وجدول الإفصاح المولّد؛ لا تستبدلهما بإطار العمل. وجود `data-summary-text` يزامن الملخص كل render، وغيابه يترك نص المستهلك.
- **الأحداث والتنظيف:** `micro-data:rendered` يحمل `{kind}`؛ ليس حدث اختيار نقطة ولا نجاح عملية أعمال، وقد يأتي بعد تحديث برمجي أو إعادة قياس. `disconnect(root)` يوقف الرصد وrAF؛ init/render يعيدان الربط. لا يمسح source.
- **Packed الاختياري:** `MicroPacked.init(root)/render(chart)/disconnect(root)` على `[data-chart-packed]`، لا init مزدوج للإفصاح. `micro-packed:rendered` يحمل ok وvmaxDerived في المسارات الحالية، ومع الرفض reason؛ التفاصيل ليست API اختيار عنصر. قيم reason الحالية مدرجة في السجل. لا نعدّل سلوكه أو نضجه Proposed هنا.
- **التغطية التالية:** bars/line وجدول/إفصاح، non-negative/signed ومقياس غير صالح/متجاوز ومحور زمني، فارغ/صفر/مفقود/غير صالح/قيمة كبيرة؛ Donut/Bubbles/Packed مسجلة أدناه. تصميم الرسوم واختيار نقاطها مؤجلان للمرحلة6.

## 6. Messages

المصدر: [المواصفة](../components/messages/specification.md)، [JS](../components/messages/messages.js).

- **المدخلات:** note/inline/empty/toast حسب المواصفة؛ النص والنبرة والإجراء والقرار بين رسالة ثابتة وإعلان مؤقت للمستهلك. الأدوار الافتراضية note للمساعدة وstatus للمعلومة/النجاح/التحذير وalert للخطأ؛ role الصريح محفوظ.
- **التحديث:** `MicroMessages.init(root)` للأدوار والإغلاق؛ `toast(element,{duration?,returnFocus?})` افتراضي4000ms، يوقف العد أثناء التركيز داخله. `closeToast(element,trigger?)` يغلق ويدير هدف التركيز الصالح. `data-return-focus` selector أو returnFocus عنصر من المستهلك. لا تستخدم Toast مؤقتًا للخطأ الحرج الذي يحتاج بقاءً.
- **الإعلان:** `announce(text,{id?,assertive?})` أو الوسيط boolean القديم. نفس id والنص ضمن نافذة الهوية لا يكرر الإعلان؛ دون id إعلان مستقل. `resetAnnouncements()` يعيد سجل الهوية ولا يمسح القناة الحية. ليست آلية dedup لطلبات الشبكة.
- **الأحداث:** `micro-messages:note-closed` يحمل `{returnFocus: boolean}`؛ toast-closed للإغلاق اليدوي وtoast-dismissed لانتهاء المؤقت، بلا detail. ليست تأكيدات حفظ/حذف.
- **التنظيف:** `disconnect(root)` يوقف الموارد المحلية؛ `disconnect(document)` ينظف القنوات المشتركة أيضًا. لا تعطّل إعلانات نسخ أخرى بتنظيف document عند إزالة Toast واحدة.
- **التغطية التالية:** كل النبرات/الأجزاء، إعادة الإعلان، فقدان هدف التركيز، نص طويل وأزرار، خطأ ثابت وفراغ؛ لا نسبة/صفر خاص بالمكوّن.

## 7. Navigation

المصدر: [المواصفة](../components/navigation/specification.md)، [JS](../components/navigation/navigation.js).

- **المدخلات:** appbar/tabs/tabpanel/navbar/layer/backdrop/filter/actionbar وفق markup؛ IDs وروابط التحكم وtrigger/عنوان الطبقة وسياسة `data-backdrop=close|keep` من المستهلك. navbar ليس router.
- **التحديث:** `MicroNavigation.init(root)`؛ `openLayer(layer,{trigger?,backdropEl?})` و`closeLayer(layer)` أمر إغلاق مباشر. `appliedFilters(panel)` يعيد نسخة؛ `setAppliedFilters(panel,values)` يعمل بعد تهيئة panel، يزامن المصدر حسب قواعد الجاري/المطبق القائمة. ليس نموذج dirty عامًا.
- **الأحداث:** `micro-navigation:opened` وclosed بلا detail، closed بعد اكتمال الإغلاق؛ `micro-navigation:filters-applied` يحمل `{applied,count}`. لا close-request قابل للإلغاء حاليًا. tabs يغيّر panels وARIA، لا event مخصص موثق إضافي.
- **الملكية/التنظيف:** مالك وحيد للتركيز وinert وقفل التمرير. `disconnect(root)` يخفي طبقاته وينهي الربط والإغلاقات المتأخرة ويعيد الموارد؛ ليس إغلاقًا قابلًا للمنع. Escape على document مفرد. History/Back وقياس الأشرطة وsafe areas على مستوى الصفحة للمضيف.
- **التغطية التالية:** كل الأجزاء، طبقات متداخلة وفلاتر وتبويبات مطولة ولوحة فارغة وأفعال معطلة/طويلة؛ الطلب المحروس مقترح منفصل C03/D01، لا يُستهلك كأنه موجود.

## 8. Surfaces

المصدر: [المواصفة](../components/surfaces/specification.md).

- CSS فقط: `surfaces.css` ثم `curves.css` للاتجاه المعتمد أو plain؛ لا init/events/disconnect. المحتوى الدلالي يملكه المستهلك، والزخرفة لا تدخل القراءة أو التفاعل.
- المعالجة للسطح البارز اختياريًا، لا تزيين كل صف. calm/waves/depth دراسات تاريخية لا بدائل افتراضية معتمدة؛ أي knobs موصوفة Proposed تبقى كذلك.
- الاختبار اللاحق: plain/curves المعتمدان، حاوية ضيقة ومحتوى طويل وتركيز طفل تفاعلي. loading/error/zero/empty كسلوك سطح غير منطبق؛ أطفال السطح يملكون حالاتهم.

## 9. Info Strip

المصدر: [المواصفة](../components/info-strip/specification.md)، [Strip](../components/info-strip/info-strip.js)، [Peek](../components/info-strip/info-strip-peek.js).

- بطاقة info منفردة CSS، لا JS لعرض الرقم. label/value/unit/context وbasic/compact/featured والقراءات من المصدر؛ لا حساب نسبة أو حالة مالية تلقائية.
- `MicroInfoStrip.init(root)` للشريط، `rescan(root)` بعد إضافة/حذف بطاقات يعيد التقاط المصدر؛ `disconnect(root)` يفصل الربط. `data-controls` يحدد أدوات التحكم وفق المواصفة. لا event مخصص للشريط العادي حاليًا؛ تحريك scroll ليس اختيار سجل أعمال.
- Peek مالك مستقل على `[data-info-peek]`: `MicroInfoPeek.init(root)/goTo(strip,index,{animate?})/next(strip)/prev(strip)/getIndex(strip)/disconnect(root)`. getIndex يعيد -1 دون حالة؛ goTo يقيّد الفهرس للمتاح. `micro-info-peek:change` يحمل `{index,count}` عند تغير الفهرس، بما فيه التنقل البرمجي. disconnect يحفظ الحالة ويوقف الرصد والسحب والمهام المتأخرة؛ init يعيد الاتصال. لا destroy عامة أو وعد rescan ديناميكي لـPeek.
- لا يشغّل Strip العادي على Peek، ولا ينظف أيهما أطفال Data/Fields. تغيير بنية شرائح Peek ليس مكافئًا لـrescan الشريط العادي؛ لا نفترض دعمًا غير موثق.
- التغطية التالية: بطاقة منفردة/متعددة القراءات/basic/compact/featured، شريط بأدواته، Peek اختياري،0/1/عدة بطاقات وقيم طويلة/مفقودة، RTL/LTR وتركيز بطاقة غير نشطة.

## 10. Metric Comparison

المصدر: [المواصفة](../components/metric-comparison/specification.md)، [JS](../components/metric-comparison/metric-comparison.js).

- source DOM للقراءات والتسميات والوحدات والفترات والمقياس؛ `MicroMetricComparison.init(root)/render(root)` على `[data-main-comparison]` أو `[data-metric-circles]` أو حاويتهما. `render` يقبل نطاقًا، بخلاف MicroData.render الذي يأخذ رسمًا واحدًا.
- source data للمستهلك؛ العناصر/الأشرطة/الدوائر والجداول المولدة للمكوّن. `disconnect(root)` يوقف المراقبة وrAF؛ لا يمسح المصدر. لا أحداث مخصصة أو حفظ أو point-selection عامة حاليًا.
- الافتراضي flat/rows/bars للمقارنة الدقيقة؛ compact/featured/circles اختيارات وفق المواصفة. لا مقياس مشترك لوحدات/فترات غير متجانسة، ولا نسبة بلا مقام ومعنى معلنين.
- التغطية التالية: كل العروض وأرقام صغيرة/طويلة وصفر/مفقود/غير صالح/مقياس غير صالح؛ الأرقام الحقيقية تبقى الأساس، وتصميم البدائل الرسومية مؤجل.

## 11. Account Settings

المصدر: [المواصفة](../components/account-settings/specification.md)، [JS](../components/account-settings/account-settings.js).

- markup `[data-account-settings]` مع طبقة وعنواني account/application ومعرفاتهما وروابط العرض وإعدادات `[data-account-setting]`؛ المحتوى من المستهلك، ليس إعدادات منتج جاهزة. Navigation وSelection وButtons حسب دليل الاعتماد.
- `MicroAccountSettings.init(root)`، `disconnect(root)` و`destroy(root)` الاسم الآخر نفسه. لا setData أو save أو update-handlers عامة. ضبط checked خارجيًا لا يطلق حدثًا من تلقاء نفسه؛ إعادة init ليست API لتغيير هوية الطبقة.
- `micro-account-settings:change` يحمل `{setting,checked}` بعد native change. النية لا تعني أن الخدمة حفظت. pending/الفشل/إرجاع القيمة يديرها المستهلك مع Selection عند الحاجة.
- المكوّن يملك ربط تبديل المنظورين، وNavigation يملك الطبقة؛ تنظيف Account وحده لا يفصل بقية العائلات. التغطية التالية: المنظوران، رجوع داخلي، محتوى طويل، تغيير معطل/منتظر وفشل ممثل خارجيًا، دون خدمات إعدادات.

## 12. Access Gateway

المصدر: [المواصفة](../components/access-gateway/specification.md)، [JS](../components/access-gateway/access-gateway.js).

- `MicroAccessGateway.init(root,handlers?)` بعد Fields؛ handlers: `onSubmit({email,password})` و`onRecovery()` و`providers[key]()`، يمكن أن تعيد قيمة/Promise. إعادة init لنفس الجذر تحدّث callbacks وتوافر الإجراءات الاختيارية دون ربط مضاعف؛ ليست إعادة بناء form.
- المستهلك يملك الخدمة والمصادقة والصلاحيات وإلغاء الشبكة؛ المكوّن يملك التحقق الأصلي للحقلين ورسائل UI وbusy وكشف كلمة المرور. غياب handler لا يرسل شيئًا، وغياب نتيجة صريحة لا يعني دخولًا.
- النتيجة الاختيارية `{message?,tone?,authenticated?}` عقد عرض فقط؛ tone يقبل info/error. الرسالة الصريحة تُعرض؛ authenticated=true تأكيد المستهلك، false عدم دخول، وغير ذلك نتيجة محايدة. الرفض يعرض userMessage البشرية إن قُدمت، لا stack أو Error.message الخام.
- `micro-access:submitted` من form يحمل `{result}` بعد الحل، بلا بيانات اعتماد مضافة من المكوّن؛ لا event مماثل للمزود والاستعادة حاليًا. لا تسجل credentials أو نتيجة حساسة في telemetry؛ النتيجة التي يردها handler مسؤوليته.
- `disconnect/destroy(root)` ينهيان الربط وbusy ويعيدان إخفاء كلمة المرور ويمنعان استجابة Promise قديمة من تحديث UI؛ لا يلغيان طلب الشبكة الفعلي. Fields ينظف منفصلًا.
- التغطية التالية: form/وسائل اختيارية/إظهار كلمة المرور، فراغ/invalid/disabled/pending/رفض/نتيجة محايدة وإعادة callbacks؛ لا مصادقة فعلية أو بيانات حقيقية.

## 13. Order Schedule

المصدر: [المواصفة](../components/order-schedule/specification.md)، [JS](../components/order-schedule/order-schedule.js). يبقى Draft.

- `MicroOrderSchedule.init(element,options)` يعيد instance؛ root غير صالح يرمي Error. تهيئة نفس الجذر تعيد المثيل نفسه وتتجاهل options الجديدة؛ `getInstance(root)` يعيد المثيل أو null. لا auto-init عام للتقويم.
- options الحالية: orders/statuses/today/weekStart/selectedDate/displayedMonth/view/calendarView/orderActions/headingLevel/loading/retry. تواريخ مدنية YYYY-MM-DD وشهر YYYY-MM، وقت HH:mm؛ لا تحويل timezone أو recurrence. يطبّع الطلب إلى id/title/date/time/statusKey/customer/note؛ metadata الأخرى لا تُحفظ تلقائيًا. IDs المستهلك مستقرة وفريدة، وstatusKey لا يشتق من التاريخ.
- instance: `setData(orders)` استبدال كامل يحفظ حالة العرض/التحديد، يزيل loading/error ويطوي طلبًا مفتوحًا حُذف. `setSelectedDate(date)` يغير التحديد وشهره. `setDisplayedMonth(month)` يصفح الشهر مستقلًا عن التحديد. `setView('calendar'|'list')` و`setCalendarView('month'|'week'|'day')`. القيم غير الصالحة تُتجاهل.
- `getState()` نسخة `{view,calendarView,selectedDate,displayedMonth}`، لا store للبيانات أو حالة حفظ. setters صامتة. عند تغير الحالة بفعل مستخدم يطلق `order-schedule:state-change` مرة بالتفصيل نفسه؛ day-select يحمل `{date}`؛ order-open/edit-request/delete-request تحمل `{id}`؛ add-request يحمل `{date:ISO|null}`. order-open اسم الحدث الحالي عند فتح صف، لا تفويضًا تلقائيًا لفتح route.
- `setLoading(flag)` و`setError(retryCallback|null)`؛ retry callback هو فعل المستهلك، ليس جلبًا داخليًا. آخر حالة loading/error قائمة تملك العرض وفق المواصفة. `destroy()` ينهي المستمعات والمراقبين ويفرغ الجذر ويزيل سماته وحالته؛ old instance لا يعاد استخدامه. إعادة init بعده تبدأ مثيلًا جديدًا.
- التقويم يملك كامل داخله؛ summary خارجي عبر مصدر المستهلك وgetState/events، لا حقن DOM داخله. التغطية التالية: شهر/أسبوع/يوم وقائمة ومنتقي الشهر وصفوف/أكورديون وأفعال اختيارية، فارغ/غير مجدول/حالات/فشل/انتظار وحدود التاريخ والاتجاه؛ لا محرر أو حفظ أو URL أو نموذج حجوزات.

## 14. Carousel

المصدر: [المواصفة](../components/carousel/specification.md)، [JS](../components/carousel/carousel.js). يبقى Draft.

- source markup `[data-carousel]` مع viewport/track/slides وcontrols/compact/expand والخيارات الموثقة؛ محتوى البطاقة من عائلات مستقلة. لا autoplay؛ المقارنة المتزامنة صفوف وليست Carousel إلزاميًا.
- `MicroCarousel.init(root)/goTo(carousel,index,{animate?})/next(carousel)/prev(carousel)/getIndex(carousel)`؛ getIndex=-1 دون حالة وgoTo يقيّد الفهرس. `micro-carousel:change` يحمل `{index,count}` عند تغيره، حتى من goTo البرمجي؛ ليس input خاصًا بالمنتج. تغيير الشريحة يطوي الموسعة، ولا يوسع الجديدة تلقائيًا.
- `disconnect(root)` يوقف الرصد والسحب وrAF ويحفظ الحالة لعودة init؛ `destroy(root)` يفصل أيضًا الربط النهائي ويحذف الحالة والنقاط المولدة. لا setSlides/rescan عامة؛ تبديل بنية الشرائح يحتاج دورة destroy ثم init وتنظيف الأطفال، لا تعديل track المملوك مع افتراض إعادة التقاط تلقائية.
- التغطية التالية:0/1/عدة شرائح، controls/peek الاختياري وcompact/expand حسب المواصفة، حد أول/آخر، سحب/إلغاء/تركيز/RTL/LTR؛ البيانات الفارغة داخل البطاقة مسؤولية مكوّنها، لا خطأ شبكة في Carousel نفسه.

## المتغيرات الستة — كلها محفوظة في التغطية

| المتغير | مصدره وعقد استهلاكه الحالي | حد القرار |
|---|---|---|
| donut | Data، data-chart المناسب وsource التوزيع، render/جدول وحالات Data | opt-in؛ حصص قليلة بمقام معلوم، لا تفرض النسبة على المبلغ. |
| bubbles | Data، مصدر القيم وlegend/readings، render/جدول وحالات Data | opt-in وتقريبي مساحيًا؛ قراءة دقيقة مرافقة. |
| packed-circle | ملفات Packed مع data.css؛ MicroPacked ودورة حياته | Proposed، opt-in؛ رفض المقياس/الكثافة ليس نجاح رسم. |
| main-metric-featured | Metric Comparison وsource القراءة والسياق | opt-in؛ لا معنى مالي تلقائي من الإبراز. |
| metric-circles | Metric Comparison وsource الدوائر | opt-in؛ ليست افتراضي المقارنة الدقيقة. |
| info-strip-peek | Info Peek وmarkup مستقل، API وأحداثه أعلاه | opt-in؛ لا double-init مع الشريط العادي. |

هذه تغطية **عقود ومراجعة مصدر** وليست نتائج فحص بصري/تفاعلي لهذه المرحلة. تفاصيل كل خيار CSS أو markup تبقى في المواصفة، ولا تُحذف منها خيارات لأنها لا تمتلك API JavaScript. اختبار360×780 RTL Light أساس المرحلة3، و320 للحاجة المثبتة وLTR حين يؤثر الاتجاه؛ لا Dark أو مصفوفة مقاسات واسعة.

## امتدادات المصدر الاختيارية 2026-11-12

Data يضيف getSelection(chart)/setSelection(chart,key|null) وحدث مستخدم micro-data:selection-change فقط عند data-selection=single ومفاتيح فريدة؛ لا تغيير rendered أو API قديم. C04 يضيف MicroReadings.init/sync/disconnect(root?) لاختصار تكرار وحدة بسياق صريح. [المدخلات والتحديث والإتاحة والتنظيف بالتفصيل](READABLE-SOURCE.md). D01/Menu/Calendar metadata مستمرة التأجيل.

## استهلاك B01 داخل الرسوم — 2026-11-12

لا تغيير في API أو أسماء الأحداث أو IDs/hooks الجداول. أضيفت أصناف B01 secondary للأفعال المولدة، ويعاد تطبيقها على جدول منسوخ/قديم عند init/render. الاعتماد CSS على buttons.css شرط تحميل معلن؛ لا يلزم buttons.js بلا API تحميل. [عقد الأفعال والتغيير الاستهلاكي](SHARED-ACTIONS.md).
