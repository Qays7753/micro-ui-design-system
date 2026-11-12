# بطاقات استهلاك العائلات الـ14

للتواقيع والمدخلات والأحداث والتحديث والملكية والاستثناءات: [عقود API الحالية](COMPONENT-API-CONTRACTS.md). [التراكيب والإغلاق المقترحة](COMPOSITION-CONTRACTS.md) موثقة للمراجعة فقط، ولم تُنفذ بعد.

طبّق [SOP](COMPONENT-CONSUMPTION.md) ثم [مواصفة العائلة](COMPONENT-INVENTORY.md). الأساس المشترك هو الخطوط والتوكنز والأصول المستخدمة؛ الملفات القابلة للتحميل موجودة في `components/<family>/`. الاعتماديات الأساسية والمشروطة مشتقة في الفهرس من الكتالوج، والنضج لا يتغير بهذا الدليل.

| العائلة | التركيب والتحديث | التنظيف | الحد والاعتماد |
|---|---|---|---|
| Buttons | DOM و`buttons.css`؛ `MicroButtons.setLoading(button, flag, options)` عند التحميل. لا `init` عام. | `disconnect(root)` | النص والنوع والأيقونة وdisabled/loading/full-width والاسم من المستهلك؛ لا سلوك «حفظ/إلغاء» تجاري تلقائي. |
| Fields | `fields.css/js`، ثم `init(root)`؛ بعد ضبط `.value` برمجيًا استعمل `sync(root)` بلا أحداث تعديل زائفة. | `disconnect/destroy(root)` | `buttons.css` قبل `fields.css` لمسح البحث وأزرار الخطوة؛ النص البسيط لا يحتاج أزرارًا. الحالة ورسالتها و`aria-invalid` والتحقق الفعلي من المستهلك. |
| Selection / Picker | `selection.css/js` للمجموعات والمقاطع؛ `setSwitchPending` يأخذ غلاف `.m-switch`. Picker له `picker.css/js` و`init/setOptions/setStatus/clearSelection`. | Selection:`disconnect`؛ Picker:`disconnect/destroy` | Picker مضمّن أو في Navigation؛ الطبقة وB01 اعتمادان مشروطان بالتركيب. البيانات والاستعادة والشبكة للمستهلك، والبحث يفلترها دون اختلاق خيارات. |
| Organization | CSS للصفوف والشارات والهوية؛ `MicroOrganization.init(root)` للطي وبديل الصورة. | `disconnect(root)` | B01 عند تضمين إجراء. رابط الصف رابط حقيقي ولا يحتوي زرًا متداخلًا. الوصفة الضيقة تفصل القراءة عن الحالة والإجراء. |
| Data | `data.css/js` و`init(root)/render(chart)` بعد تحديث `.m-chart__data [data-series]`. | `disconnect(root)`؛ Packed له تنظيفه أيضًا | الصفر/المفقود/غير الصالح متميزة، والوحدة والفترة والمقام والنطاق من المصدر. المكوّن يملك plot والجدول. لا أعمال محاسبة أو API. |
| Messages | `messages.css/js`؛ `init` لإغلاقات المصدر، `toast/announce` للإعلانات والحالات. | `disconnect(root)`؛ النطاق document ينظف القنوات المشتركة أيضًا | B01 إذا استُعملت أزراره؛ `data-return-focus` أو `returnFocus` هدف يعلنه المستهلك، والتنفيذ والمؤقتات في المكوّن. الرسائل الحرجة ثابتة. |
| Navigation | `navigation.css/js`، `init(root)`، `openLayer/closeLayer` للطبقة. tabs يغير panel المرتبط. | `disconnect(root)` | Buttons/Fields/Selection بحسب محتوى appbar/filter/layer/actionbar. المكوّن يملك inert/scroll/focus للطبقة؛ المضيف يملك History وBack وإزاحات أشرطة الصفحة. |
| Surfaces | `surfaces.css` ثم `curves.css` للاتجاه الحالي، أو plain. | لا موارد JavaScript | المعالجة للسطح البارز فقط؛ calm/waves/depth دراسات تاريخية وليست افتراضيات إضافية. |
| Info Strip | بطاقة منفردة CSS؛ `MicroInfoStrip.init/rescan(root)` للشريط؛ Peek عبر ملفاته وAPI الخاصة به. | `MicroInfoStrip.disconnect(root)` و`MicroInfoPeek.disconnect(root)` حسب النوع | لا يفصل رسومًا أو حقولًا مضمّنة نيابة عنها. basic/compact/featured خيارات معلنة؛ `data-controls` يحدد أسهمًا/موضعًا أو نقاطًا أيضًا. |
| Metric Comparison | `metric-comparison.css/js` و`init/render(root)` بعد تغيير source؛ flat/compact/featured/circles. | `disconnect(root)` | المكوّن يملك صفوف ودوائر وجداول العرض المولدة؛ المقارنة الدقيقة flat/rows/bars. الوحدات والفترات يجب أن تكون متجانسة لمقياس مشترك. |
| Account Settings | `account-settings.css/js` و`init(root)` لمنظوري الحساب والتطبيق؛ HTML المستهلك يعرّف الصفوف والإعدادات. | `disconnect/destroy(root)` ثم تنظيف Selection وNavigation المضمّنين | `buttons.css` و`selection.css` و`navigation.css/js`. `selection.js` مطلوب لسلوك مجموعاته/pending عند استعماله؛ checkbox الأصلي وحده يملك تبديله. `micro-account-settings:change` نية تغيير بلا حفظ. |
| Access Gateway | `buttons.css/js` و`fields.css/js` قبل `access-gateway.css/js`؛ تهيئة Fields ثم `init(root, handlers)`. | `disconnect/destroy(root)` وتنظيف Fields المضمنة | handlers للإرسال/الاستعادة/المزودين من المضيف. غياب نتيجة مؤكدة لا يعني دخولًا. الموارد والbusy/reveal في UI، وإلغاء الشبكة والتوثيق عند المضيف. |
| Order Schedule | `order-schedule.css/js`؛ `init(root, options)` يعيد instance. `setData/getState/setSelectedDate/setDisplayedMonth/setView/setCalendarView/setLoading/setError`. | `instance.destroy()` | لا يحتاج Fields لرسم التقويم؛ محرر خارجي من B02 يحتاج ملفاته. instance يملك داخل الجذر؛ البيانات والتأكيد والحفظ عند المضيف. `setError` يأخذ callback أو null. |
| Carousel | `carousel.css/js` و`init(root)` وواجهته الموثقة للفهرس/التنقل. محتوى البطاقة مستقل عنه. | `disconnect(root)` يحفظ حالته؛ `destroy(root)` ينهي الربط والحالة | لا Data/Organization إلزاميًا؛ حمّلهما فقط إن استُعملا داخل البطاقة، ونظفهما أيضًا. peek opt-in؛ بدون autoplay؛ المقارنة المتزامنة تُعرض كصفوف. |

## المتغيرات الستة

- Donut وBubbles من ملفات Data؛ Donut لحصص قليلة ومقام معلوم، والفقاعات للمقدار التقريبي مع قراءة دقيقة خارجية.
- Packed Circle: `data.css` مع `packed-circle.css/js` و`MicroPacked.init/render/disconnect`؛ إذا حُمّل `data.js` لرسوم أخرى يبقى مصدر البيانات مشتركًا، ولا يُربط الإفصاح مرتين. يبقى proposed.
- Main Metric Featured وMetric Circles من ملفات Metric؛ featured إبراز صريح لقراءة واحدة، والدوائر متخصصة وليست افتراض المقارنة الدقيقة على الهاتف. التداخل بصري فقط.
- Info Strip Peek: CSS الشريط الأساسي ثم `info-strip-peek.css` و`info-strip-peek.js` و`MicroInfoPeek`؛ العنصر الموسوم `data-info-peek` ليس ملكية محرك الشريط الأساسي.

## الحالة والأحداث

المضيف يملك ما سيُحفظ وما سيُنقل. Library state مثل موضع الشريحة أو الشهر المعروض لا يصبح route تلقائيًا. في Calendar استخدم `getState` و`order-schedule:state-change` عند الحاجة لمزامنة عامة؛ setters الصامتة تمنع حلقات الموصل. أحداث edit/delete/add نوايا عامة فقط. في Fields لا تحول `sync` إلى `input/change` مزيف. في Picker استبدال الخيارات يمسح اختيارًا حُذف مع حدث واضح؛ لا تحتفظ بمعرّف لم يعد موجودًا.

الموارد داخل تركيب واحد قد تنتمي لعدة عائلات: إزالة Settings تستلزم تنظيف غلافه وطبقته ومفاتيحه، وإزالة شريط يحتوي رسمًا تستلزم تنظيف الرسم والشريط. يملك الموصل المشترك قائمة cleanup الفعلية، لا كل صفحة نسخة مستقلة منها.
