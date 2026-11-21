# API — المرجع الموحد للاستهلاك وعقود مكوّنات Micro UI

## ما هذا الملف

هذا الملف هو المرجع الموحد لاستهلاك مكتبة Micro UI وعقود API فيها: القواعد المشتركة، وSOP التركيب، وبطاقات اعتماد العائلات الـ14، وعقود API التفصيلية لكل عائلة، والمتغيرات، والأفعال المشتركة داخل الرسوم، وقيم القواعد المشتركة V1. يدمج هذا الملف ويحل محل: `COMPONENT-CONSUMPTION.md` و`FAMILY-CONSUMPTION.md` و`COMPONENT-API-CONTRACTS.md` و`SHARED-ACTIONS.md` و`SHARED-SPEC.md` و`UI-USAGE-SOP.md` و`MICRO-COMPONENTS-GUIDE.md`.

هذا المرجع يصف **المصدر الموجود**؛ لا يعلن قبولًا بصريًا جديدًا أو جاهزية للتركيب داخل Micro. يغطي العائلات14 والمتغيرات8 والتراكيب C01–C06 بتحديثات الهاتف، إضافة إلى تراكيب سياق المنتج C07–C14 الموثقة أدناه. المواصفة التفصيلية لكل عائلة و[الكتالوج](COMPONENT-CATALOG.json) يحتفظان بسلطتهما؛ [عقود النظام](../docs/SYSTEM-CONTRACTS.md) تحسم التعارضات التاريخية.

هذا عقد عام لمكتبة UI مستقلة: [عقود النظام](../docs/SYSTEM-CONTRACTS.md) و[الكتالوج](COMPONENT-CATALOG.json) مرجلا السلوك والنضج؛ بطاقات الاعتماد أدناه تحدد الاستدعاء والملكية لكل عائلة. لا يحدد الدليل إطار التطبيق أو مساراته أو خدماته، ولا يثبت جاهزية منصة هاتف.

[التراكيب C01/C02/C03](../docs/COMPOSITIONS.md) وصفات HTML/CSS منفذة بحالة Draft، دون JavaScript API جديدة؛ [طلب الإغلاق D01 وC05/C06](../docs/COMPOSITIONS.md) منفذة الآن للهاتف، بعقود منفصلة دون مزج مالكي طبقات.

## قواعد مشتركة

### حدود العقد والملكية

- HTML الدلالي جزء من المكوّن؛ الذي لا ينتقل هو شاشة Showcase وبياناتها وأدواتها. يعيد المستهلك استخدام المصدر وmarkup الموثق أو موصلًا رقيقًا، ولا ينسخ CSS/JS لكل موضع.
- معظم `init(root, options?)` يقبل الجذر المطابق وأبناءه (الافتراضي document)، ويعيد instance بعقد R4 الموحد ([أعلاه](#العقد-الموحد-لدورة-الحياة-الجولة-الثانية-r4--2026-11-22))؛ نسخة IIFE وحدها تهيئ تلقائيًا عند تحميل الوحدة (تحترم MicroConfig.autoInit)، وESM بلا تهيئة تلقائية (R-D2). init المكرر يعيد المثيل نفسه ويربط أي عنصر جديد تحت الجذر. Surfaces لا يملك JS، وOrder Schedule يحتاج Element صريحًا. لا نفترض تطابق توقيع العائلات.
- تكرار الربط لا يضاعف المستمعات. هذا لا يعني انعدام الآثار: Data يعيد التصيير ويطلق rendered؛ Carousel وPeek قد يطلقان change عند التنقل البرمجي. لا تُحوّل كل حدث إلى dirty تلقائيًا.
- المستهلك يملك source DOM والبيانات؛ renderer يملك مناطق العرض المولدة فقط. لا يكتب إطار العمل والـrenderer في العقد نفسها. معرّفات المصدر فريدة لكل نسخة. `data-*-ready` المنسوخة ليست بديلًا عن init.
- نظّف الأطفال المضمّنين ثم مالك التركيب قبل إزالة الجذر؛ API الأب لا ينظف كل عائلة بداخله. disconnect لا يعني دائمًا استعادة HTML الأصلي أو حذف الحالة. الاستثناءات أدناه مقصودة.
- CSS الخاص بالهوية والتوكنز والخطوط والأيقونات يُحمّل مرة وفق SOP التركيب. `.m-*` ليست عزل Shadow DOM؛ الاختلافات مع حاوية خارجية تُختبر لاحقًا في حاضنة مستقلة.
- الحالات غير المنطبقة ليست نقصًا: لا loading أو error تلقائي لسطح CSS أو صف ساكن. مصدر الحالة والنتيجة التجارية والحفظ والمصادقة والصلاحيات والشبكة وHistory/Back عند المضيف.

### مصدر الحقيقة والقراءة قبل الاستخدام

- اقرأ `AGENTS.md` ثم `DESIGN.md` و[STATUS](../docs/STATUS.md) و[فهرس المكونات](COMPONENT-INVENTORY.md)، ثم `components/<family>/specification.md` قبل الاستخدام أو التعديل. لا تبدأ من صورة أو standalone أو نتيجة تاريخية.
- مصدر الحقيقة: المكون داخل `components/`، والقيم المشتركة داخل `shared/`، والأصول داخل `assets/`. المعاينة في `previews/` مستهلك للمصدر وليست مصدرًا بديلًا.
- أمثلة العائلات في `previews/<family>/`، والتراكيب المصغرة في `previews/compositions/`، والحالات العددية والإعدادات في `previews/concepts/`، والتركيب الشامل في `previews/ui-system-showcase/`. الأمثلة fixtures مستقلة وليست شاشة إنتاجية؛ لا تنقل بياناتها أو سلوكها الوهمي إلى تطبيق Micro.

### قواعد التنفيذ

- أضف CSS/JS الخاص بالمكوّن من `components/`، واستخدم `shared/tokens.css` و`shared/motion.css` و`assets/` بدل نسخ القيم.
- لا hard-coding لألوان أو مسافات لها توكن قائم.
- لا تغيّر الهوية أو التوكنز أو الخطوط أو الأيقونات دون قرار صريح.
- لا تجعل كل معلومة بطاقة، ولا تجعل العنصر غير التفاعلي يبدو تفاعليًا.
- حافظ على RTL والنص الطويل والأرقام والوحدات والإشارات والبيانات المفقودة.
- لا تقص البيانات المهمة ولا تستخدم اللون وحده للدلالة.
- حافظ على الحالات المعلنة `STABLE UI` و`DRAFT FOR REVIEW` و`PROPOSED`.
- عدّل المصدر القابل للتعديل داخل `components/`، ثم حدّث المواصفة والمثال إذا تغير العقد. لا تعدل `standalone.html` يدويًا؛ أعد توليده بالأداة.

### دورة التحقق والتسليم

بعد تعديل المصدر:

1. حدّث المواصفة والمثال عند تغير العقد.
2. شغّل فحص البناء الحتمي وفحص الـshowcase وفحص العائلة المتأثرة:

```bash
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
python3 tools/concepts-check.py
python3 tools/data-scale-state-check.py
```

3. تحقق من 320/360/390/430 وRTL والحالات الحدية.
4. شغّل `git diff --check`.
5. سجّل ما لم يُختبر على أجهزة أو متصفحات فعلية؛ كل نتيجة تُربط بالرأس الحالي، مع التصريح بالمنصات التي لم تُختبر.

التسليم هو المصدر القابل للتعديل مع المواصفة والفحص. الصور والملفات المولدة أدلة أو مخرجات نقل فقط، ولا تستبدل HTML/CSS/JS/SVG.

## SOP التركيب

### مصدر واحد واستدعاءات متعددة

حمّل نسخة معتمدة واحدة من `components/` و`shared/` والأصول المستخدمة من `assets/`. سجّل commit النسخة عند استهلاكها. لا تستخدم ZIP قديمًا أو `standalone.html` مصدرًا جديدًا، ولا تحمل CSS/JS المعرض في المنتج.

CSS وJavaScript وبنية DOM الدلالية أجزاء من المكوّن. تُعرّف بنية DOM مرة في غلاف مشترك مناسب لإطار المضيف عندما يكون معروفًا؛ الصفحات تمرر الخصائص والبيانات والأحداث. لا يلزم إنشاء React/Vue أو حزمة npm داخل هذه المكتبة الآن. ملف HTML للمعاينة لا ينتقل كشاشة، بينما بنية المكوّن الموثقة تبقى لازمة. `pyproject.toml` خاص بفحوص التطوير، وليس اعتماد تشغيل في المتصفح.

### قائمة التركيب

1. اختر العائلة والمتغير والغرض والنضج. `draft-for-review` و`proposed` لا يتحولان إلى اعتماد نهائي بمجرد نجاح اختبار.
2. حمّل `assets/fonts/fonts.css` و`shared/tokens.css` ثم CSS الاعتماديات والعائلة وفق بطاقتها. حافظ على المسارات النسبية للأصول، أو أعد كتابتها حتميًا في بناء المضيف. استعمل الحركة المشتركة حين تتطلبها أمثلة النمط؛ لا تنقل reset المعرض أو توكنز بديلة.
3. حمّل ملفات JavaScript مرة واحدة وبالترتيب الموثق. السكربتات الحالية plain scripts تعمل على العميل وتوفر `window.Micro…`؛ لا تشغّلها على الخادم أثناء SSR. بعد إضافة DOM ديناميكيًا استدعِ API على الجذر المحلي؛ لا تنتظر تكرار `DOMContentLoaded`.
4. أنشئ IDs فريدة لكل instance، مع `label/for` و`aria-controls/describedby/labelledby` الصحيحة. التسمية و`type` والغرض ليست أمورًا يستنتجها الزر. لا تعامل سمات `bound/ready` المنسوخة كموارد حية.
5. اجعل لكل حالة وجزء DOM كاتبًا واحدًا. المضيف يملك البيانات؛ المكوّن يملك الأجزاء التي يولدها، مثل داخل جذر التقويم وplot والجدول وصفوف الرسم. لا تجعل إطار المضيف يعيد بناء الأجزاء نفسها بالتزامن مع السكربت. استعمل `update` الموحد أو الاسم القائم للعائلة (`sync`/`render`/`setData`/`rescan`/`setOptions`) بعد تحديث مصدرها.
6. اربط أحداث النية مرة واحدة على الجذر المحدد. يستجيب المضيف بالحفظ أو التنقل أو التحقق الفعلي. لا تستبدل نتيجة المصادقة أو البيانات بنتيجة تجريبية. حافظ على الفرق بين أحداث المستخدم والتحديثات البرمجية الصامتة.
7. نظّف قبل إزالة DOM. طبّق cleanup لكل مكوّن مضمن بترتيب عكسي للتركيب، ثم أزل الجذر. لا يوجد teardown عام يكتشف كل الأطفال تلقائيًا. `disconnect` و`destroy` يختلفان بين العائلات؛ لا تستبدلهما بقالب موحد أعمى.
8. افحص التركيب بمحتوى يمثل استخدامه: قراءة واضحة، لا حجب أو قص أو فيض غير مقصود، أرقام كاملة، وتفاعل ولمس ومفاتيح وتركيز. ابدأ بـ360×780 وRTL وLight؛ أضف 320 أو LTR فقط لسبب محدد. اختبار منصة المضيف الفعلية مطلوب لاحقًا؛ نجاح Chromium ليس إثبات iOS/Android أو سلوك Native.

### ملكية المكتبة والمضيف

| المكتبة | المضيف |
|---|---|
| تخطيط المكوّن وحالاته الداخلية وإتاحة عناصره | إطار الشاشة والحاوية وعلاقتها بالأشرطة والكيبورد |
| موارد الطبقة وحصر التركيز وإغلاقها | History وBack ومسارات المنتج وSafe Areas العامة |
| أحداث نية عامة وواجهات بيانات | المصادقة والصلاحيات وAPI والحفظ وإلغاء الشبكة |
| تمثيل صفر/مفقود/غير صالح بصدق | العملة والوحدة والفترة والمنطقة الزمنية والبيانات الصحيحة |
| تجاهل نتيجة UI قديمة بعد الفصل وفق العقد | إدارة الطلبات والاشتراكات ومستمعات الموصل |

تعريفات `.m-*` تقلل التعارض ولا توفر عزل Shadow DOM. افحص cascade وترتيب الملفات وحجم الحاوية قبل تغيير مكوّن سليم. لا نفترض شيئًا عن CSS مضيف لم يُفحص.

### الاستثناءات

| الحالة | الإجراء المقبول |
|---|---|
| اسم طويل مع شارة وإجراء | وصفة صف بسطر قراءة مستقل ثم حالة وإجراء، مثل `previews/compositions/row-example.html`؛ لا تضغط القراءة في عمود ضيق لمجرد غياب overflow. |
| تبويبات أو segments طويلة | `scroll/stack` الموثقان. لا تصغّر الخط لتسع التسميات. ارتفاع segment المرئي 40 ضمن مسار 48 استثناء معتمد. |
| شبكة تقويم بجذر أقل من360 | compact حسب عرض الجذر: أرضية ارتفاع48 وعرض خلية24 وفق العقد. لا تفرض48 عرضًا على سبعة أعمدة داخل الهاتف. |
| peek بجذر أقل من336 | يعود Carousel إلى بطاقة كاملة العرض قصدًا؛ 0/1 لا يوحيان بمحتوى إضافي. |
| رقم طويل داخل دائرة | fallback والقراءة الخارجية الكاملة. مدخل التحرير أحادي السطر قد يتمرر داخليًا؛ نص القراءة ليس مدخلًا ولا يُقص مثله. |
| مقارنة بوحدات أو فترات مختلفة | قراءات بلا مقياس نسبي مضلل. signed/time تصريحان صريحان؛ Donut يحتاج مقامًا صالحًا. الدوائر والفقاعات وPacked خيارات تقريبية متخصصة. |
| شريط إجراء مع تنقل سفلي | مجموعة لاصقة واحدة أو إزاحات مقاسة من ارتفاعها الحقيقي؛ لا شريطان يتصادمان عند `bottom:0`. المثال في عائلة Navigation يوضح ذلك. |
| ارتفاع مختلف لمنظوري حوار | إعادة توسيط الحوار مقصودة؛ اللوحة السفلية بديل تكوين حين يلزم ثبات الرأس. لا تجمّد زر الإغلاق بإزاحة خاصة بكل شاشة. |
| اتجاه Info Strip | المسار الأساسي ثابت RTL وفق عقده؛ Peek يتبع الاتجاه المحسوب. لا تقلب الأيقونات أو المفاتيح كلها آليًا. |

إذا لم يلبِّ متغير موثق حاجة صحيحة، سجّل المحتوى والقياس واللقطة والسبب والبدائل والمالك. أصلح العيب العام في مصدره أو اعتمد امتدادًا قابلًا لإعادة الاستخدام واختبارًا له. الاستثناء المحلي في الموصل يكون ضيقًا ومعلنًا؛ لا يجيز تغيير الهوية أو التوكنز أو إخفاء معلومات أو كسر الإتاحة. تغييرات UX المنتج تحتاج موافقة منفصلة.

### Toast والتركيز

يحدد المستهلك هدفًا صريحًا عبر `data-return-focus` على Toast أو زر إغلاقه، أو `toast(el, {returnFocus: element})` لهدف ديناميكي. السمة الصريحة تتقدم على خيار العنصر. يرد المكوّن التركيز عند الإغلاق المباشر فقط إذا كان داخل Toast والهدف ما زال موجودًا ومرئيًا ومتاحًا. الإغلاق أو الانتهاء عندما يكون التركيز خارج Toast لا يسحبه.

يتوقف وقت الإخفاء أثناء وجود التركيز داخل Toast؛ الانتقال بين أطفاله يبقيه متوقفًا، والخروج يستأنف الوقت المتبقي. إعادة الإظهار تبدأ مدة جديدة وتنظف الدورة السابقة، و`disconnect` يلغي الدورة ولو كانت موقوفة. لا History أو رجوع لمسار منتج. Toast لتأكيد غير حرج مع بديل ثابت؛ أخطاء التصحيح ليست Toast.

### بوابات القبول

- Source/API: اعتماديات وعقود صحيحة، IDs مستقلة، تحديث وتنظيف بلا ازدواج أو موارد متأخرة.
- Visual/Interaction: الحالة الحقيقية داخل تركيب مفهوم، لا الاكتفاء بوجود عنصر في DOM أو `scrollWidth` مناسب.
- Platform: منصة المضيف والمتصفحات والأجهزة المستهدفة. ما لم يُختبر يُذكر صراحة، ولا تعوّضه لقطات المعرض.

فحص المصدر الموجّه: `python3 tools/component-consumption-contract-check.py`. لا يشغّل Dark أو zoom أو مصفوفة مقاسات عامة.

### حدود الحاضنات المستقلة

[حاضنات F01/F02/F03](../docs/COMPOSITIONS.md) تثبت الحاوية وcascade ودورة الحياة ومالك الطبقة، دون استنتاج صحة مضيف إنتاجي. قِس جذر المكوّن، احصر reset المضيف أو رتّب cascade layers، اختر portal خارج سلف يقص fixed، ولا تجمع محركي تركيز/تمرير على الطبقة نفسها. مصدر Navigation يعزل الأشقاء المضافة أثناء الفتح ويستعيد حالتها عند الإغلاق/التنظيف. يظل تنظيف الجذور قبل إزالتها وإدارة raw/baseline/الطلبات وHistory على المستهلك؛ D01 منفذ كطلب إغلاق عام وفق [عقد الهاتف](../docs/COMPOSITIONS.md)؛ لا سياسة dirty أو History في المكتبة.

### اختيار القراءة المنظمة

عند استخدام Data/Metric readable أو اختصار تكرار الوحدة، اتبع [عقد مصدر القراءة وC04](../docs/COMPOSITIONS.md): تحميل المصدر مرة، بيانات/مفاتيح من المستهلك، وحدات ظاهرة افتراضيًا، update ثم render/sync، وتنظيف كل مالك عبر API الخاص به. ملفات المعاينة لا تنتقل للمستهلك.

### أفعال مشتركة ضمن مكونات أخرى

عند استهلاك رسوم Data/Packed/Metric التي تولّد جدول إفصاح أو أدوات اختيار Data، حمّل `buttons.css` مرة قبل CSS العائلة. لا تنسخ مظهر B01 في hook خاص بالمخطط، ولا تفترض أن وجود `<button>` وحده يحقق مظهر الزر المعتمد. استهلاك المتغير وإظهار التعطيل والتركيز والضغط جزء من الفحص، مع مسؤولية العائلة عن حدث الفعل ودورة حياته. العقد والاستثناءات المتخصصة في قسم «الأفعال المشتركة والقواعد المشتركة» أدناه.

## بطاقات الاعتماد — استهلاك العائلات الـ15

للتواقيع والمدخلات والأحداث والتحديث والملكية والاستثناءات: عقود العائلات أدناه في هذا الملف. [التراكيب C01/C02/C03](../docs/COMPOSITIONS.md) وصفات CSS/HTML منفذة بحالة Draft للمراجعة؛ [طلب الإغلاق D01 وC05/C06](../docs/COMPOSITIONS.md) منفذة الآن للهاتف، بعقود منفصلة دون مزج مالكي طبقات.

طبّق SOP التركيب أعلاه ثم [مواصفة العائلة](COMPONENT-INVENTORY.md). الأساس المشترك هو الخطوط والتوكنز والأصول المستخدمة؛ الملفات القابلة للتحميل موجودة في `components/<family>/`. الاعتماديات الأساسية والمشروطة مشتقة في الفهرس من الكتالوج، والنضج لا يتغير بهذا الدليل.

| العائلة | التركيب والتحديث | التنظيف | الحد والاعتماد |
|---|---|---|---|
| Buttons | DOM و`buttons.css`؛ `MicroButtons.setLoading(button, flag, options)` عند التحميل. `init(root)` اكتشاف موثق يعيد أزرار النطاق (الربط تلقائي)؛ لا update — لا مفهوم بيانات. | `disconnect(root)` | النص والنوع والأيقونة وdisabled/loading/full-width والاسم من المستهلك؛ لا سلوك «حفظ/إلغاء» تجاري تلقائي. |
| Fields | `fields.css/js`، ثم `init(root)`؛ بعد ضبط `.value` برمجيًا استعمل `sync(root)` بلا أحداث تعديل زائفة. | `disconnect/destroy(root)` | `buttons.css` قبل `fields.css` لمسح البحث وأزرار الخطوة؛ النص البسيط لا يحتاج أزرارًا. الحالة ورسالتها و`aria-invalid` والتحقق الفعلي من المستهلك. |
| Selection / Picker | `selection.css/js` للمجموعات والمقاطع؛ `setSwitchPending` يأخذ غلاف `.m-switch`. Picker له `picker.css/js` و`init/setOptions/setStatus/clearSelection`. | Selection:`disconnect`؛ Picker:`disconnect/destroy` | Picker مضمّن أو في Navigation؛ الطبقة وB01 اعتمادان مشروطان بالتركيب. البيانات والاستعادة والشبكة للمستهلك، والبحث يفلترها دون اختلاق خيارات. |
| Organization | CSS للصفوف والشارات والهوية؛ `MicroOrganization.init(root)` للطي وبديل الصورة. | `disconnect(root)` | B01 عند تضمين إجراء. رابط الصف رابط حقيقي ولا يحتوي زرًا متداخلًا. الوصفة الضيقة تفصل القراءة عن الحالة والإجراء. |
| Data | `data.css/js` و`init(root)/render(chart)` بعد تحديث `.m-chart__data [data-series]`. | `disconnect(root)`؛ Packed له تنظيفه أيضًا | الصفر/المفقود/غير الصالح متميزة، والوحدة والفترة والمقام والنطاق من المصدر. المكوّن يملك plot والجدول. لا أعمال محاسبة أو API. تحميل `buttons.css` مطلوب لأفعال جداول JavaScript (وفي Data أيضًا التحديد وPacked)، دون `buttons.js`؛ التفاصيل في قسم الأفعال المشتركة أدناه. |
| Messages | `messages.css/js`؛ `init` لإغلاقات المصدر، `toast/announce` للإعلانات والحالات. | `disconnect(root)`؛ النطاق document ينظف القنوات المشتركة أيضًا | B01 إذا استُعملت أزراره؛ `data-return-focus` أو `returnFocus` هدف يعلنه المستهلك، والتنفيذ والمؤقتات في المكوّن. الرسائل الحرجة ثابتة. |
| Navigation | `navigation.css/js`، `init(root)`، `openLayer/closeLayer` للطبقة. tabs يغير panel المرتبط. | `disconnect(root)` | Buttons/Fields/Selection بحسب محتوى appbar/filter/layer/actionbar. المكوّن يملك inert/scroll/focus للطبقة؛ المضيف يملك History وBack وإزاحات أشرطة الصفحة. |
| Surfaces | `surfaces.css` ثم `curves.css` للاتجاه الحالي، أو plain. | لا موارد JavaScript | المعالجة للسطح البارز فقط؛ calm/waves/depth دراسات تاريخية وليست افتراضيات إضافية. |
| Info Strip | بطاقة منفردة CSS؛ `MicroInfoStrip.init/rescan(root)` للشريط؛ Peek عبر ملفاته وAPI الخاصة به. | `MicroInfoStrip.disconnect(root)` و`MicroInfoPeek.disconnect(root)` حسب النوع | لا يفصل رسومًا أو حقولًا مضمّنة نيابة عنها. basic/compact/featured خيارات معلنة؛ `data-controls` يحدد أسهمًا/موضعًا أو نقاطًا أيضًا. |
| Metric Comparison | `metric-comparison.css/js` و`init/render(root)` بعد تغيير source؛ flat/compact/featured/circles. | `disconnect(root)` | المكوّن يملك صفوف ودوائر وجداول العرض المولدة؛ المقارنة الدقيقة flat/rows/bars. الوحدات والفترات يجب أن تكون متجانسة لمقياس مشترك. تحميل `buttons.css` مطلوب لأفعال جداول JavaScript (وفي Data أيضًا التحديد وPacked)، دون `buttons.js`؛ التفاصيل في قسم الأفعال المشتركة أدناه. |
| Account Settings | `account-settings.css/js` و`init(root)` لمنظوري الحساب والتطبيق؛ HTML المستهلك يعرّف الصفوف والإعدادات. | `disconnect/destroy(root)` ثم تنظيف Selection وNavigation المضمّنين | `buttons.css` و`selection.css` و`navigation.css/js`. `selection.js` مطلوب لسلوك مجموعاته/pending عند استعماله؛ checkbox الأصلي وحده يملك تبديله. `micro-account-settings:change` نية تغيير بلا حفظ. |
| Access Gateway | الشاشات الأربع: `fonts.css` ثم `tokens.css` و`buttons.css` و`auth-screens.css`؛ الشاشتان 3/4 تحملان `shared/icons.js` للرمز المحلي. تركيب `m-welcome`/`m-session` العام يحمل `buttons.css` و`access-gateway.css` و`welcome.css`. `fields.css/js` و`init(root, handlers)` تبقى للـAPI العام ذي الحقول أو المزودات المخصصة، لا لزر GIS الرسمي. المضيف يرسم زر Google الرسمي داخل `data-google-provider-slot`. الأمثلة الأربع في [README](../components/access-gateway/README.md). | `disconnect/destroy(root)` وتنظيف Fields عند استعمال API العام | المضيف يملك GIS والتحقق وحالة الجديد/العائد والجلسة والبيانات والأفعال. لا OAuth أو session أو network أو بيانات حساب في المكتبة. غياب نتيجة مؤكدة لا يعني دخولًا. |
| Order Schedule | `order-schedule.css/js`؛ `init(root, options)` يعيد instance. `setData/getState/setSelectedDate/setDisplayedMonth/setView/setCalendarView/setLoading/setError`. | `instance.destroy()` | لا يحتاج Fields لرسم التقويم؛ محرر خارجي من B02 يحتاج ملفاته. instance يملك داخل الجذر؛ البيانات والتأكيد والحفظ عند المضيف. `setError` يأخذ callback أو null. |
| Carousel | `carousel.css/js` و`init(root)` وواجهته الموثقة للفهرس/التنقل. محتوى البطاقة مستقل عنه. | `disconnect(root)` يحفظ حالته؛ `destroy(root)` ينهي الربط والحالة | لا Data/Organization إلزاميًا؛ حمّلهما فقط إن استُعملا داخل البطاقة، ونظفهما أيضًا. peek opt-in؛ بدون autoplay؛ المقارنة المتزامنة تُعرض كصفوف. |

### الحالة والأحداث والموارد المشتركة

المضيف يملك ما سيُحفظ وما سيُنقل. Library state مثل موضع الشريحة أو الشهر المعروض لا يصبح route تلقائيًا. في Calendar استخدم `getState` و`order-schedule:state-change` عند الحاجة لمزامنة عامة؛ setters الصامتة تمنع حلقات الموصل. أحداث edit/delete/add نوايا عامة فقط. في Fields لا تحول `sync` إلى `input/change` مزيف. في Picker استبدال الخيارات يمسح اختيارًا حُذف مع حدث واضح؛ لا تحتفظ بمعرّف لم يعد موجودًا.

الموارد داخل تركيب واحد قد تنتمي لعدة عائلات: إزالة Settings تستلزم تنظيف غلافه وطبقته ومفاتيحه، وإزالة شريط يحتوي رسمًا تستلزم تنظيف الرسم والشريط. يملك الموصل المشترك قائمة cleanup الفعلية، لا كل صفحة نسخة مستقلة منها.

## العقود

### العقد الموحد لدورة الحياة (الجولة الثانية R4 — 2026-11-22)

لكل مدخل JavaScript (عدا `icons` و`labels`) عقد موحد واحد:

```js
const instance = init(root, options?);   // root: عنصر أو نطاق (الافتراضي document)
instance.root;                            // الجذر الذي رُبط عليه
instance.update(arg?);                    // دلالة كل عائلة في جدول المسح أدناه
instance.destroy();                       // تنظيف كامل — مرتين آمن
destroy(root);                            // صادر مريح: يدمر مثيل الجذر إن وجد
getInstance(root);                        // المثيل الحي أو null
```

القواعد الست النافذة (تُفحص آليًا في `tools/api-lifecycle-check.py`):

1. **init على جذر له مثيل حي يعيد المثيل نفسه** ولا يضاعف الربط، ويعيد فحص الجذر فيربط أي عنصر جديد غير مربوط تحته — init متكرر آمن كما في 0.1.0.
2. **destroy مرتين لا يرمي**، وبعده يعمل init من جديد بدءًا من حالة نظيفة.
3. **إزالة الجذر من DOM بلا destroy لا تسبب أخطاء لاحقة** (المراقبات تحرس `isConnected`).
4. **بعد destroy:** لا مستمع على `window`/`document`/الجذر أضافه المكوّن، ولا `ResizeObserver`/`MutationObserver`/`IntersectionObserver` حي، ولا مؤقت معلق (`setTimeout`/`setInterval`/`requestAnimationFrame`).
5. **destroy لا يمس قيم المستخدم ولا يستعيد HTML الأصلي** إلا حيث توثق ذلك صراحة (Order Schedule يفرغ جذره، Carousel يحذف النقاط المولدة).
6. **الأحداث المخصصة أسماؤها وتفاصيلها كما هي** — موثقة لكل مدخل أدناه وفي `tools/package/types/<entry>.d.ts`.

**النسخ المستنسخة من DOM تربط كعناصر جديدة:** علامات الربط المنسوخة (`data-*-ready`/`data-*-bound`) لا تعتبر ربطًا حيًا — الحقيقة في حالة المكوّن الداخلية لا في السمات المنقولة.

**الأسماء المهملة (R-D10) — IIFE فقط حتى 1.0، لا تُصدَّر من مداخل ESM:**

| الاسم المهمل | بديل ESM | ملاحظة |
|---|---|---|
| `disconnect(root)` (كل العائلات) | `destroy(root)` / `instance.destroy()` | يمر بنفس مسار destroy للمثيل: تنظيف كامل وإزالة المثيل من السجل |
| `sync(root)` — Fields/Readings | `instance.update()` | نفس التنفيذ |
| `rescan(root)` — Info Strip | `instance.update()` | إعادة الالتقاط لأول بطاقة (R-15) |
| `render(chart|root)` — Data/Packed/Metric | `instance.update()` | لإعادة تصيير كل الرسوم تحت جذر |
| `update(root)` الجذرية — Fields/InfoStrip/Metric/Data/Packed | `instance.update()` | |
| `update(carousel|strip, index, options?)` — Carousel/Peek | `instance.update({index, animate?})` أو `goTo` | |
| `update(root, handlers?)` — Access Gateway | `init(root, handlers)` أو `instance.update(handlers)` | |

استثناءات تبقى عامة في ESM (أسماء حقيقية لا مهملات): `update(root, items)` لـPicker، و`update(root, orders)` لـOrder Schedule، و`sync(root)` لـFields يبقى صادرًا عامًا مع مهمل `update(root)`.

جدول المسح (instance.update لكل عائلة | دوال المثيل الإضافية | الأحداث المخصصة):

| العائلة | `instance.update` | دوال المثيل الإضافية | أحداث مخصصة |
|---|---|---|---|
| Buttons | `update({loading?, loadingLabel?})` يغلف setLoading لكل أزرار النطاق | — | — |
| Fields | `update()` = sync (بلا أحداث تعديل) | — | `micro-field:cleared`/`changed` |
| Selection | `update()` يعيد قراءة المجموعات والمقاطع | — | `micro-selection:changed`/`segment` |
| Picker | `update(items?)` = setOptions لكل picker | — | `micro-picker:change`/`retry`/`close` |
| Organization | `update()` يعيد فحص الأقسام والصور | — | `micro-organization:toggle` |
| Data | `update()` يعيد تصيير كل الرسوم من DOM المصدر | — | `micro-data:selection-change`/`rendered` |
| Packed | `update()` يعيد تصيير رسوم packed | — | `micro-packed:rendered` |
| Messages | `update()` يعيد فحص الرسائل | — | toast-dismissed/toast-closed/`note-closed` |
| Navigation | `update()` يربط عناصر الطبقات الجديدة | — | opened/close-request/closed/filters-applied |
| Action Sheet | `update()` يربط الأوراق الجديدة | — | `micro-actions:request` |
| Info Strip | `update()` = rescan | — | — |
| Peek | `update({index, animate?})` = goTo | `goTo`/`next`/`prev`/`getIndex` | `micro-info-peek:change` |
| Metric Comparison | `update()` يعيد التصيير | — | — |
| Account Settings | `update()` يعيد فحص اللوحات | — | `micro-account-settings:change` |
| Access Gateway | `update(handlers?)` يحدث callbacks بلا ربط مضاعف | — | `micro-access:submitted` |
| Carousel | `update({index, animate?})` = goTo | `goTo`/`next`/`prev`/`getIndex` | `micro-carousel:change` |
| Order Schedule | `update(orders)` = setData | `setData`/`getState`/`setSelectedDate`/`setDisplayedMonth`/`setView`/`setCalendarView`/`setLoading`/`setError` | `order-schedule:*` الستة |
| Readings (C04) | `update()` = sync | — | — |
| Product (C07–C14) | `update(model)` = replace | `replace`/`resolve`/`getState` | `micro-product:intent` |

Surfaces عائلة CSS بلا JavaScript فلا تدخل العقد. `icons` (hydrate/ready) و`labels` (سجل النصوص) مدخلان مساندان بلا دورة حياة.

الفحص: `tools/api-lifecycle-check.py` ينفذ لكل مدخل السيناريو الكامل (init ← init مكرر ← update ← destroy ×2 ← صفر متبقيات بتغليف المستمعات/المراقبات/المؤقتات ← init من جديد ← إزالة الجذر بلا destroy ← إطاران ← صفر أخطاء)، ويتحقق أن غلوبالات IIFE تعرض دوال المدخل نفسها مع المهملات أعلاه.

## عقود العائلات

### 1. Buttons

**عقد المدخل (R4):** `init(root, options?)` يعيد `ButtonsInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** لا شيء حاليًا (يدخل `labels` في R5 إن ظهرت نصوص).
- **instance:** `update({loading?, loadingLabel?})`.
- **events:** لا أحداث مخصصة.
- **مثال:** `const b = MicroButtons.init(root); b.update({ loading: true, loadingLabel: 'جارٍ الحفظ' }); b.destroy();`
- **مهملات IIFE (R-D10):** `disconnect(root)`.

المصدر: [المواصفة](../components/buttons/specification.md)، [JS](../components/buttons/buttons.js).

- **المدخلات:** markup `.m-btn`، نوع button/link، الاسم والنص والأيقونة والمتغير والمقاس والعرض من المستهلك. `button.type` صريح داخل النموذج؛ disabled الأصلي وaria-disabled للرابط لا يُستبدلان بمجرد مظهر معطل. `MicroButtons.init(root, options?)` يعيد instance (عقد R4 أعلاه) ويربط حراسات التحميل لكل `.m-btn` تحت الجذر (الجذر-الذات مشمول)؛ تكراره آمن ولا يضاعف الربط.
- **التحديث:** `MicroButtons.setLoading(button, flag, {loadingLabel?})`؛ البديل `data-loading-label`. لا يبدأ تحميل زر disabled أصلًا. التحميل المتكرر لا يكرر المؤشر، وإيقافه يستعيد الاسم السابق. حفظ النص الافتراضي وخيار loading-replace يبقيان وفق المواصفة.
- **الأحداث:** لا أحداث مخصصة؛ click تفعيل أصلي، لا «حفظ» تلقائي. loading يمنع التفعيل المتكرر ويحفظ التركيز.
- **الملكية/التنظيف:** مصدر الاسم والمحتوى للمستهلك؛ المؤشر وحراسة التحميل للمكوّن. `disconnect(root)` ينهي التحميل المملوك والحراس؛ ليس إلغاء طلب الشبكة.
- **التغطية التالية:** الأنواع الستة وكل مقاسات/أيقونات/عرض/تحميل المواصفة، طبيعي وتركيز وضغط وتعطيل واسم طويل؛ صفر/فراغ بيانات غير منطبق على الزر نفسه.

### 2. Fields

**عقد المدخل (R4):** `init(root, options?)` يعيد `FieldsInstance`؛ `destroy(root)`/`getInstance(root)` صادران، و`sync(root)` يبقى صادرًا عامًا.
- **options:** `labels` (R5 — لا مفاتيح حاليًا).
- **enterkeyhint (T4/N-D10):** افتراضيًا `next`/`done` من ترتيب الحقول في نفس النموذج و`search` لحقل البحث — دون كتابة فوق قيمة المستهلك؛ Enter مع `next` في حقل مفرد ينقل التركيز للتالي، والنص الطويل يحتفظ بسطره.
- **instance:** `update()` = sync (مزامنة العدّاد/المسح/الخطوة بلا أحداث).
- **events:** `micro-field:cleared` و`micro-field:changed` بلا detail.
- **مثال:** `const f = MicroFields.init(root); input.value = 'جديد'; f.update(); f.destroy();`
- **مهملات IIFE (R-D10):** `update(root)` و`disconnect(root)`.

المصدر: [المواصفة](../components/fields/specification.md)، [JS](../components/fields/fields.js).

- **المدخلات:** `[data-micro-field]` وlabel/control/message؛ قيمة input/textarea وtype/inputmode وrequired/min/max/step/maxlength والوحدة والرسائل من المستهلك. خطأ وصحة وreadonly/disabled تحتاج الحالة الدلالية الفعلية مع CSS، لا صنفًا بصريًا فقط.
- **التحديث:** `MicroFields.init(root)` ثم تعديل `.value` واستدعاء `sync(root)` للعداد والمسح وحالة الخطوة. sync صامت: لا input/change/micro-field، ولا يتعامل مع حقل غير مربوط. `instance.update()` (عقد R4) = sync نفسها — لا وسيط بيانات لأن قيم الحقول في DOM عند المستهلك؛ `update(root)` القديم اسم مهمل في IIFE فقط (R-D10).
- **الأحداث:** المسح تفاعل يطلق input ثم `micro-field:cleared` بلا detail؛ الخطوة تطلق input ثم `micro-field:changed` بلا detail. استمع لقناة واحدة مناسبة كي لا تحسب الفعل مرتين. لا تنتظر change من تعديل `.value` البرمجي.
- **الملكية/التنظيف:** النص الخام في حقل النص للمستهلك؛ ليست كل أنواع الحقول محلل مال. تطبيع الكمية المقصود في stepper وفق المواصفة لا يُعمّم على النص أو المال ولا يُصنف عيبًا تلقائيًا. `destroy(root)` (و`disconnect(root)` المهمل الذي يمر بنفس المسار) يوقف الربط والمراقب ويحذف المثيل؛ لا يمسح قيم المستخدم أو ينفذ reset.
- **التغطية التالية:** text/search/textarea/quantity وبقية أنواع المواصفة، وحدة/بادئة/لاحقة/عداد/مسح/خطوة، عادي وفارغ وصفر وخطأ ومعطل وreadonly؛ لصق نص غير صالح، تعيين قيمة مسبقة، RTL/LTR للجزء الرقمي.

### 3. Selection / Picker

**عقد المدخل (R4):** `MicroSelection.init(root, options?)` و`MicroPicker.init(root, options?)` يعيدان مثيلات؛ `destroy(root)`/`getInstance(root)` صادران لكل منهما.
- **options:** `labels` (R5 — مفاتيح عائلة selection تخص Picker).
- **instance (Selection):** `update()` يعيد قراءة المجموعات والمقاطع. **instance (Picker):** `update(items?)` = setOptions لكل picker تحت الجذر.
- **events:** Selection: `micro-selection:changed` بلا detail و`micro-selection:segment` بـ`{value}`؛ Picker: `micro-picker:change` بـ`{value,label}` وretry/close بلا detail.
- **مثال:** `const p = MicroPicker.init(root); p.update([{value:'a', label:'الأول'}]); p.destroy();`
- **مهملات IIFE (R-D10):** `disconnect(root)` للعائلتين. (تنبيه: `update(root, items)` لPicker يبقى اسمًا عامًا في ESM لا مهملًا.)

المصدر: [المواصفة](../components/selection/specification.md)، [Selection](../components/selection/selection.js)، [Picker](../components/selection/picker.js).

- **Selection:** `MicroSelection.init(root)` للمجموعات والمقاطع؛ native checked/radio/indeterminate والاسم وقيمة العنصر من markup. `setSwitchPending(switchWrapper, flag)` يأخذ `.m-switch`، يقفل input أثناء الانتظار ثم يعيد disabled السابق؛ لا يحفظ الإعداد أو يرجع checked عند رفض الخدمة. `destroy(root)` (وdisconnect المهمل IIFE بنفس المسار) يفصل المجموعات والمقاطع وينهي pending للمفاتيح.
- **أحداث Selection:** native input/change؛ `micro-selection:changed` بلا detail عند فعل checkbox المجموعة؛ `micro-selection:segment` بالتفصيل `{value}` عند الاختيار بالنقر أو الأسهم. لا setters عامة لقيمة كل نوع؛ المستهلك يحدّث source وفق مواصفته. لا يدّعي الحساب dirty بناء على كل تغيير في DOM.
- **Picker:** listbox اختيار قيمة، لا menu أوامر. `MicroPicker.init(root)`؛ `setOptions(picker, [{value,label}])` يستبدل الخيارات بمفاتيح string ويحفظ اختيارًا صالحًا؛ لا يدعم item.disabled في هذا التوقيع الحالي. `instance.update(items?)` (عقد R4) = setOptions لكل picker تحت الجذر (بلا مصفوفة خيارات لا فعل)؛ `update(root, items)` يبقى صادرًا عامًا على مستوى الوحدة. `getSelected(picker)` يعيد `{value,label}` أو null. لا `setSelected` عامة حاليًا؛ الاختيار الابتدائي عبر markup/aria-selected قبل التهيئة.
- **حالات Picker:** `setStatus(picker, kind, message?)` يقبل ready/loading/empty/error/initial/disabled؛ القيمة غير المعروفة تُتجاهل. غير ready يخفي الخيارات القديمة؛ البحث لا يلغي loading/error. لا نتائج البحث مختلفة عن مصدر بيانات فارغ. `setOptions` يعيد ready ويحترم الاستعلام الحالي.
- **أحداث Picker:** `micro-picker:change` يحمل `{value,label}` أو `{value:null,label:null}`؛ عند الاختيار، وعند زواله بعد setOptions، وعند `clearSelection(picker)` حتى لو لم يكن هناك اختيار. `micro-picker:retry` و`micro-picker:close` بلا detail. retry نية، لا جلب آلي؛ close قد يستدعي closeLayer عند وجود Navigation.
- **التنظيف:** `destroy(root)` يفك المستمعات ويحذف الحالة الداخلية دون حذف خيارات المضيف؛ `disconnect(root)` اسم مهمل يمر بنفس المسار (R-D10). القائمة والبحث والملخص والـroving للمكوّن؛ البيانات والطبقة والشبكة للمستهلك.
- **التغطية التالية:** checkbox/radio/group/partial/switch/pending/segmented، وPicker مضمّن وداخل طبقة والبحث وحالاته؛ الاختيارات المعطلة والأسهم وHome/End والاتجاه. لا تحويل تاريخ أصلي إلى تقويم جديد.

### 4. Organization

**عقد المدخل (R4):** `init(root, options?)` يعيد `OrganizationInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5 — `avatar.initialsFallback`).
- **instance:** `update()` يعيد فحص الأقسام والصور الرمزية.
- **events:** `micro-organization:toggle` بـ`{open}`.
- **مثال:** `const o = MicroOrganization.init(root); o.update(); o.destroy();`
- **مهملات IIFE (R-D10):** `disconnect(root)`.

المصدر: [المواصفة](../components/organization/specification.md)، [JS](../components/organization/organization.js).

- **المدخلات:** row/list/section/badge/identity وما تحدده المواصفة؛ النص والقيمة والوحدة والحالة والرابط والإجراء والصورة من المستهلك. الصف متعدد الأفعال حاوية مع رابط وأزرار أشقاء؛ الرابط الشامل لا يحتوي زرًا.
- **التحديث والأحداث:** تحديث source DOM؛ `MicroOrganization.init(root)` للطي وavatar fallback. `micro-organization:toggle` يحمل `{open}` على section بعد التغيير. لا event أو حفظ تجاري للصف الساكن؛ الحقول المالية ليست مسؤولية Organization.
- **التنظيف:** `destroy(root)` (وdisconnect المهمل IIFE) يوقف الربط؛ الصورة الفاشلة قد تكون استُبدلت بالأحرف بالفعل، ولا يعد التنظيف باسترجاعها. المصدر يملك تبديل الصورة/المحتوى لاحقًا.
- **التغطية التالية:** كل أجزاء المواصفة، صف طويل/قيمة طويلة وموقعة/حالة/أفعال متعددة/طي/صورة فاشلة، وفراغ القائمة عند وجوده. وصفة الصف الضيق الحالية في previews ليست CSS منتج معتمدًا بعد؛ انظر [تركيب C02](../docs/COMPOSITIONS.md).

### 5. Data

**عقد المدخل (R4):** `MicroData.init(root, options?)` و`MicroPacked.init(root, options?)` يعيدان مثيلات؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5 — مفاتيح عائلة data).
- **instance (Data):** `update()` يعيد تصيير كل الرسوم من DOM المصدر. **instance (Packed):** `update()` يعيد تصيير رسوم packed.
- **events:** `micro-data:rendered` بـ`{kind}` و`micro-data:selection-change` (عند تفعيل التحديد)؛ `micro-packed:rendered` بـ`{ok, reason?, vmaxDerived?}`.
- **مثال:** `const d = MicroData.init(root); /* عدّل .m-chart__data */ d.update(); d.destroy();`
- **مهملات IIFE (R-D10):** `render(chart)` و`update(root)` و`disconnect(root)` للعائلتين.

المصدر: [المواصفة](../components/data/specification.md)، [JS](../components/data/data.js)، [Packed](../components/data/packed-circle.js).

- **المدخلات:** source `.m-chart__data [data-series]` وdata-value/display وتسميات الفئات والمفاتيح، والوحدة والفترة والمقام والنطاق/المقياس والإحداثي الزمني كما في المواصفة. الرقم الخام للرسم منفصل عن نص العرض؛ لا اشتقاق نسبة من مبلغ أو غياب قيمة من صفر.
- **التحديث:** `MicroData.init(root, options?)` يعيد instance؛ `instance.update()` يعيد تصيير كل رسوم النطاق من DOM المصدر (الجذر-الذات مشمول) — لا وسيط بيانات. `render(chartElement)` و`update(root)` أسماء مهملة في IIFE فقط (R-D10). المكوّن يملك plot وجدول الإفصاح المولّد؛ لا تستبدلهما بإطار العمل. وجود `data-summary-text` يزامن الملخص كل render، وغيابه يترك نص المستهلك.
- **الأحداث والتنظيف:** `micro-data:rendered` يحمل `{kind}`؛ ليس حدث اختيار نقطة ولا نجاح عملية أعمال، وقد يأتي بعد تحديث برمجي أو إعادة قياس. `destroy(root)` (وdisconnect المهمل IIFE) يوقف الرصد وrAF؛ init يعيد الربط. لا يمسح source.
- **Packed الاختياري:** `MicroPacked.init(root, options?)` يعيد instance على `[data-chart-packed]` (لا init مزدوج للإفصاح)؛ `instance.update()` يعيد تصيير رسوم packed؛ `render`/`update`/`disconnect` مهملة في IIFE فقط (R-D10). `micro-packed:rendered` يحمل ok وvmaxDerived في المسارات الحالية، ومع الرفض reason؛ التفاصيل ليست API اختيار عنصر. قيم reason الحالية مدرجة في السجل. لا نعدّل سلوكه أو نضجه Proposed هنا.
- **التغطية التالية:** bars/line وجدول/إفصاح، non-negative/signed ومقياس غير صالح/متجاوز ومحور زمني، فارغ/صفر/مفقود/غير صالح/قيمة كبيرة؛ Donut/Bubbles/Packed مسجلة أدناه. تصميم الرسوم واختيار نقاطها في المسار الأساسي مؤجلان؛ انظر «امتدادات المصدر الاختيارية» أدناه لخيار التحديد المفعل.

### 6. Messages

**عقد المدخل (R4):** `init(root, options?)` يعيد `MessagesInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5).
- **instance:** `update()` يعيد فحص الرسائل (أدوار m-note وأزرار الإغلاق الجديدة).
- **events:** `micro-messages:note-closed` بـ`{returnFocus}` وtoast-dismissed/toast-closed بلا detail.
- **مثال:** `const m = MicroMessages.init(root); m.update(); m.destroy();`
- **مهملات IIFE (R-D10):** `disconnect(root)`.

المصدر: [المواصفة](../components/messages/specification.md)، [JS](../components/messages/messages.js).

- **المدخلات:** note/inline/empty/toast حسب المواصفة؛ النص والنبرة والإجراء والقرار بين رسالة ثابتة وإعلان مؤقت للمستهلك. الأدوار الافتراضية note للمساعدة وstatus للمعلومة/النجاح/التحذير وalert للخطأ؛ role الصريح محفوظ.
- **التحديث:** `MicroMessages.init(root)` للأدوار والإغلاق؛ `toast(element,{duration?,returnFocus?})` افتراضي4000ms، يوقف العد أثناء التركيز داخله. `closeToast(element,trigger?)` يغلق ويدير هدف التركيز الصالح. `data-return-focus` selector أو returnFocus عنصر من المستهلك. لا تستخدم Toast مؤقتًا للخطأ الحرج الذي يحتاج بقاءً.
- **الإعلان:** `announce(text,{id?,assertive?,tone?})` أو الوسيط boolean القديم؛ `tone:"error"` (T4/N-D7) يصاحبه نبضة اهتزاز خطأ عند تفعيل الاهتزاز (معطل افتراضيًا). نفس id والنص ضمن نافذة الهوية لا يكرر الإعلان؛ دون id إعلان مستقل. `resetAnnouncements()` يعيد سجل الهوية ولا يمسح القناة الحية. ليست آلية dedup لطلبات الشبكة.
- **الأحداث:** `micro-messages:note-closed` يحمل `{returnFocus: boolean}`؛ toast-closed للإغلاق اليدوي وtoast-dismissed لانتهاء المؤقت، بلا detail. ليست تأكيدات حفظ/حذف.
- **التنظيف:** `destroy(root)` (وdisconnect المهمل IIFE بنفس المسار) يوقف الموارد المحلية؛ التنظيف على مستوى document ينظف القنوات المشتركة أيضًا. لا تعطّل إعلانات نسخ أخرى بتنظيف document عند إزالة Toast واحدة.
- **التغطية التالية:** كل النبرات/الأجزاء، إعادة الإعلان، فقدان هدف التركيز، نص طويل وأزرار، خطأ ثابت وفراغ؛ لا نسبة/صفر خاص بالمكوّن.

### 7. Navigation

**عقد المدخل (R4):** `init(root, options?)` يعيد `NavigationInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5).
- **instance:** `update()` يربط عناصر الطبقات/التبويبات/الفلاتر الجديدة تحت الجذر.
- **events:** `micro-navigation:opened`/`closed` بلا detail؛ `close-request` بـ`{reason?, trigger}` قابل للإلغاء؛ `filters-applied` بـ`{applied, count}`.
- **مثال:** `const n = MicroNavigation.init(root); n.update(); n.destroy();`
- **مهملات IIFE (R-D10):** `disconnect(root)`.

المصدر: [المواصفة](../components/navigation/specification.md)، [JS](../components/navigation/navigation.js).

- **المدخلات:** appbar/tabs/tabpanel/navbar/layer/backdrop/filter/actionbar وفق markup؛ IDs وروابط التحكم وtrigger/عنوان الطبقة وسياسة `data-backdrop=close|keep` من المستهلك. navbar ليس router.
- **التحديث:** `MicroNavigation.init(root)`؛ `openLayer(layer,{trigger?,backdropEl?})` و`closeLayer(layer)` أمر إغلاق مباشر. `appliedFilters(panel)` يعيد نسخة؛ `setAppliedFilters(panel,values)` يعمل بعد تهيئة panel، يزامن المصدر حسب قواعد الجاري/المطبق القائمة. ليس نموذج dirty عامًا.
- **الأحداث:** `micro-navigation:opened` وclosed بلا detail، closed بعد اكتمال الإغلاق؛ `micro-navigation:filters-applied` يحمل `{applied,count}`. micro-navigation:close-request طلب قابل للإلغاء قبل تغيير الحالة، detail={reason,trigger}، عبر requestClose للطبقة العليا. tabs يغيّر panels وARIA، لا event مخصص موثق إضافي.
- **الملكية/التنظيف:** مالك وحيد للتركيز وinert وقفل التمرير. `destroy(root)` (وdisconnect المهمل IIFE بنفس المسار) يخفي طبقاته وينهي الربط والإغلاقات المتأخرة ويعيد الموارد؛ ليس إغلاقًا قابلًا للمنع. Escape على document مفرد. History/Back وقياس الأشرطة وsafe areas على مستوى الصفحة للمضيف.
- **التغطية التالية:** كل الأجزاء، طبقات متداخلة وفلاتر وتبويبات مطولة ولوحة فارغة وأفعال معطلة/طويلة؛ الطلب المحروس D01 منفذ، وسياسة dirty والحفظ للمستهلك؛ C03 native dialog يحتفظ بمالكه المستقل.

### 8. Surfaces

**عقد المدخل:** عائلة CSS بلا JavaScript — لا init/instance/events/destroy.

المصدر: [المواصفة](../components/surfaces/specification.md).

- CSS فقط: `surfaces.css` ثم `curves.css` للاتجاه المعتمد أو plain؛ لا init/events/disconnect. المحتوى الدلالي يملكه المستهلك، والزخرفة لا تدخل القراءة أو التفاعل.
- المعالجة للسطح البارز اختياريًا، لا تزيين كل صف. calm/waves/depth دراسات تاريخية لا بدائل افتراضية معتمدة؛ أي knobs موصوفة Proposed تبقى كذلك.
- الاختبار اللاحق: plain/curves المعتمدان، حاوية ضيقة ومحتوى طويل وتركيز طفل تفاعلي. loading/error/zero/empty كسلوك سطح غير منطبق؛ أطفال السطح يملكون حالاتهم.

### 9. Info Strip

**عقد المدخل (R4):** `MicroInfoStrip.init(root, options?)` و`MicroInfoPeek.init(root, options?)` يعيدان مثيلات؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5 — مفاتيح عائلة info-strip).
- **instance (Strip):** `update()` = rescan. **instance (Peek):** `update({index, animate?})` = goTo، مع `goTo`/`next`/`prev`/`getIndex` على المثيل.
- **events:** Peek فقط: `micro-info-peek:change` بـ`{index, count}`؛ الشريط العادي بلا أحداث.
- **مثال:** `const s = MicroInfoStrip.init(root); /* بطاقات جديدة */ s.update(); s.destroy();`
- **مهملات IIFE (R-D10):** `rescan(root)` و`update(root)` و`disconnect(root)` للشريط؛ `update(strip, ...)` و`disconnect(root)` لPeek.

المصدر: [المواصفة](../components/info-strip/specification.md)، [Strip](../components/info-strip/info-strip.js)، [Peek](../components/info-strip/info-strip-peek.js).

- بطاقة info منفردة CSS، لا JS لعرض الرقم. label/value/unit/context وbasic/compact/featured والقراءات من المصدر؛ لا حساب نسبة أو حالة مالية تلقائية.
- `MicroInfoStrip.init(root)` للشريط، `instance.update()` بعد إضافة/حذف بطاقات يعيد التقاط المصدر (يعيد الشريط لأول بطاقة وفق عقد R-15)؛ `rescan`/`update`/`disconnect` أسماء مهملة في IIFE فقط (R-D10). `data-controls` يحدد أدوات التحكم وفق المواصفة. لا event مخصص للشريط العادي حاليًا؛ تحريك scroll ليس اختيار سجل أعمال.
- Peek مالك مستقل على `[data-info-peek]`: `MicroInfoPeek.init(root, options?)` يعيد instance له `update({index, animate?})`=goTo و`goTo/next/prev/getIndex`؛ دوال مستوى العنصر تبقى صادرة عامة. `update(strip, ...)` و`disconnect` مهملة في IIFE فقط (R-D10). getIndex يعيد -1 دون حالة؛ goTo يقيّد الفهرس للمتاح. `micro-info-peek:change` يحمل `{index,count}` عند تغير الفهرس، بما فيه التنقل البرمجي. destroy يوقف الرصد والسحب والمهام المتأخرة ويمحو حالة المثيل؛ init بعده يعيد الاتصال من جديد (تحديث R4: صار destroy موحدًا للPeek).
- لا يشغّل Strip العادي على Peek، ولا ينظف أيهما أطفال Data/Fields. تغيير بنية شرائح Peek ليس مكافئًا لـrescan الشريط العادي؛ لا نفترض دعمًا غير موثق.
- التغطية التالية: بطاقة منفردة/متعددة القراءات/basic/compact/featured، شريط بأدواته، Peek اختياري،0/1/عدة بطاقات وقيم طويلة/مفقودة، RTL/LTR وتركيز بطاقة غير نشطة.

### 10. Metric Comparison

**عقد المدخل (R4):** `init(root, options?)` يعيد `MetricComparisonInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5).
- **instance:** `update()` يعيد التصيير من DOM المصدر.
- **events:** لا أحداث مخصصة.
- **مثال:** `const mc = MicroMetricComparison.init(root); mc.update(); mc.destroy();`
- **مهملات IIFE (R-D10):** `render(root)` و`update(root)` و`disconnect(root)`.

المصدر: [المواصفة](../components/metric-comparison/specification.md)، [JS](../components/metric-comparison/metric-comparison.js).

- source DOM للقراءات والتسميات والوحدات والفترات والمقياس؛ `MicroMetricComparison.init(root, options?)` يعيد instance على `[data-main-comparison]` أو `[data-metric-circles]` أو حاويتهما؛ `instance.update()` يعيد التصيير لكل النطاق — لا وسيط بيانات لأن المصدر DOM. `render`/`update` مهملة في IIFE فقط (R-D10).
- source data للمستهلك؛ العناصر/الأشرطة/الدوائر والجداول المولدة للمكوّن. `destroy(root)` (وdisconnect المهمل IIFE) يوقف المراقبة وrAF؛ لا يمسح المصدر. لا أحداث مخصصة أو حفظ أو point-selection عامة حاليًا.
- الافتراضي flat/rows/bars للمقارنة الدقيقة؛ compact/featured/circles اختيارات وفق المواصفة. لا مقياس مشترك لوحدات/فترات غير متجانسة، ولا نسبة بلا مقام ومعنى معلنين.
- التغطية التالية: كل العروض وأرقام صغيرة/طويلة وصفر/مفقود/غير صالح/مقياس غير صالح؛ الأرقام الحقيقية تبقى الأساس، وتصميم البدائل الرسومية مؤجل.

### 11. Account Settings

**عقد المدخل (R4):** `init(root, options?)` يعيد `AccountSettingsInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options:** `labels` (R5).
- **instance:** `update()` يعيد فحص اللوحات.
- **events:** `micro-account-settings:change` بـ`{setting, checked}`.
- **مثال:** `const a = MicroAccountSettings.init(root); a.update(); a.destroy();`
- **مهملات IIFE (R-D10):** `disconnect(root)`.

المصدر: [المواصفة](../components/account-settings/specification.md)، [JS](../components/account-settings/account-settings.js).

- markup `[data-account-settings]` مع طبقة وعنواني account/application ومعرفاتهما وروابط العرض وإعدادات `[data-account-setting]`؛ المحتوى من المستهلك، ليس إعدادات منتج جاهزة. Navigation وSelection وButtons حسب دليل الاعتماد.
- `MicroAccountSettings.init(root, options?)` يعيد instance له `update()` (إعادة فحص اللوحات — لا مفهوم بيانات: الحالة الأصلية checked عند المستهلك) و`destroy()`. لا setData أو save؛ `disconnect` اسم مهمل في IIFE فقط (R-D10). ضبط checked خارجيًا لا يطلق حدثًا من تلقاء نفسه؛ إعادة init ليست API لتغيير هوية الطبقة.
- `micro-account-settings:change` يحمل `{setting,checked}` بعد native change. النية لا تعني أن الخدمة حفظت. pending/الفشل/إرجاع القيمة يديرها المستهلك مع Selection عند الحاجة.
- المكوّن يملك ربط تبديل المنظورين، وNavigation يملك الطبقة؛ تنظيف Account وحده لا يفصل بقية العائلات. التغطية التالية: المنظوران، رجوع داخلي، محتوى طويل، تغيير معطل/منتظر وفشل ممثل خارجيًا، دون خدمات إعدادات.

### 12. Access Gateway

**عقد المدخل (R4):** `init(root, handlers?)` يعيد `AccessGatewayInstance`؛ `destroy(root)`/`getInstance(root)` صادران.
- **options (handlers):** `labels` (R5) و`onSubmit({email, password})` و`onRecovery()` و`providers[key]()`.
- **instance:** `update(handlers?)` يحدث callbacks وتوافر الإجراءات بلا ربط مضاعف.
- **events:** `micro-access:submitted` بـ`{result}`.
- **مثال:** `const g = MicroAccessGateway.init(root, { onSubmit }); g.update({ onRecovery }); g.destroy();`
- **مهملات IIFE (R-D10):** `update(root, handlers?)` و`disconnect(root)`.

المصدر: [المواصفة](../components/access-gateway/specification.md)، [JS](../components/access-gateway/access-gateway.js).

- `MicroAccessGateway.init(root,handlers?)`؛ هيّئ Fields قبلها عند استخدام حقول الاعتماد فقط. تركيب Google-only بلا حقول لا يحتاج Fields. handlers: `onSubmit({email,password})` و`onRecovery()` و`providers[key]()`، يمكن أن تعيد قيمة/Promise. إعادة init لنفس الجذر تحدّث callbacks وتوافر الإجراءات الاختيارية دون ربط مضاعف؛ ليست إعادة بناء form. `instance.update(handlers?)` (عقد R4) هذا التحديث نفسه — لا يبني النموذج من جديد ولا يعيد كلمة المرور المظهرة؛ `update(root, handlers?)` القديم اسم مهمل في IIFE فقط (R-D10).
- المستهلك يملك الخدمة والمصادقة والصلاحيات وإلغاء الشبكة؛ المكوّن يملك التحقق الأصلي للحقلين ورسائل UI وbusy وكشف كلمة المرور. غياب handler لا يرسل شيئًا، وغياب نتيجة صريحة لا يعني دخولًا.
- النتيجة الاختيارية `{message?,tone?,authenticated?}` عقد عرض فقط؛ tone يقبل info/error. الرسالة الصريحة تُعرض؛ authenticated=true تأكيد المستهلك، false عدم دخول، وغير ذلك نتيجة محايدة. الرفض يعرض userMessage البشرية إن قُدمت، لا stack أو Error.message الخام.
- `micro-access:submitted` من form يحمل `{result}` بعد الحل، بلا بيانات اعتماد مضافة من المكوّن؛ لا event مماثل للمزود والاستعادة حاليًا. لا تسجل credentials أو نتيجة حساسة في telemetry؛ النتيجة التي يردها handler مسؤوليته.
- `destroy(root)` (وdisconnect المهمل IIFE بنفس المسار) ينهي الربط وbusy ويعيد إخفاء كلمة المرور ويمنع استجابة Promise قديمة من تحديث UI؛ لا يلغي طلب الشبكة الفعلي. Fields ينظف منفصلًا.
- التغطية التالية: form/وسائل اختيارية/إظهار كلمة المرور، فراغ/invalid/disabled/pending/رفض/نتيجة محايدة وإعادة callbacks؛ لا مصادقة فعلية أو بيانات حقيقية.
- تركيب `m-welcome` و`m-session` العام موثق في [google-welcome-usage.html](../components/access-gateway/google-welcome-usage.html) ويبقى مثالًا أدنى محفوظًا. صفحة Google sign-in الكاملة هي [google-sign-in-usage.html](../components/access-gateway/google-sign-in-usage.html)، وتعرض موضع `data-google-provider-slot` للمضيف دون إعادة رسم زر GIS؛ `.m-google-button` وصورة G المحلية عينتان وليستا زر الإنتاج. يحافظ API العام على دعمه لـform/providers.
- `m-session` يقدم markup وحالات عرض يقودها المضيف (`restoring/expired/denied/offline`)؛ لا API جلسة ولا OAuth أو network أو storage داخل المكتبة. المضيف يملك الحالة والنص والإجراء، ولا يعرض النجاح إلا بعد تأكيده الصريح.
- تراكيب الشاشات الأربع تُستهلك من `auth-screens.css` وصفحات `splash-usage.html` و`google-sign-in-usage.html` و`new-user-welcome-usage.html` و`returning-user-welcome-usage.html`. يختار المضيف شاشة الجديد/العائد بعد تحقق موثوق؛ لا يقدّم المصدر حالة أو بيانات حساب تجريبية. يظل `google-welcome-usage.html` مثال `m-welcome`/`m-session` الأدنى.
- عند استخدام تركيب GIS، يملأ المضيف `[data-google-provider-slot]` بزر المزود الرسمي دون أن تستهدفه قواعد تنسيق داخلية. `shared/icons.js` يحمّل رمز التحقق المحلي للشاشتين 3/4؛ `buttons.css` يوفّر CTA. أفعال المتابعة وتبديل الحساب وربط بيانات الحساب ملك المضيف، وليست OAuth أو جلسة من المكتبة.

### 13. Order Schedule

**عقد المدخل (R4):** `init(element, options?)` يعيد `OrderScheduleInstance`؛ `getInstance(root)` و`destroy(root)` و`update(root, orders)` صادرة عامة.
- **options:** orders/statuses/today/weekStart/selectedDate/displayedMonth/view/calendarView/orderActions/headingLevel/loading/retry (+`labels` في R5).
- **instance:** `update(orders)` = setData، مع setData/getState/setSelectedDate/setDisplayedMonth/setView/setCalendarView/setLoading/setError/destroy.
- **events:** `order-schedule:state-change`/`day-select`/`order-open`/`order-edit-request`/`order-delete-request`/`add-request`.
- **مثال:** `const cal = MicroOrderSchedule.init(el, { orders }); cal.update(newOrders); cal.destroy();`
- **لا مهملات** — كل الأسماء عامة.

المصدر: [المواصفة](../components/order-schedule/specification.md)، [JS](../components/order-schedule/order-schedule.js). يبقى Draft.

- `MicroOrderSchedule.init(element,options)` يعيد instance؛ root غير صالح يرمي Error. تهيئة نفس الجذر تعيد المثيل نفسه وتتجاهل options الجديدة؛ `getInstance(root)` يعيد المثيل أو null. `instance.update(orders)` = `instance.setData(orders)` نفسها (عقد R4)؛ `update(root, orders)` على مستوى الوحدة يفوّض إلى setData ويعيد المثيل أو null، و`destroy(root)` يدمر مثيل الجذر إن وجد. لا auto-init عام للتقويم.
- options الحالية: orders/statuses/today/weekStart/selectedDate/displayedMonth/view/calendarView/orderActions/headingLevel/loading/retry. تواريخ مدنية YYYY-MM-DD وشهر YYYY-MM، وقت HH:mm؛ لا تحويل timezone أو recurrence. يطبّع الطلب إلى id/title/date/time/statusKey/customer/note؛ metadata الأخرى لا تُحفظ تلقائيًا. IDs المستهلك مستقرة وفريدة، وstatusKey لا يشتق من التاريخ.
- instance: `setData(orders)` استبدال كامل يحفظ حالة العرض/التحديد، يزيل loading/error ويطوي طلبًا مفتوحًا حُذف. `setSelectedDate(date)` يغير التحديد وشهره. `setDisplayedMonth(month)` يصفح الشهر مستقلًا عن التحديد. `setView('calendar'|'list')` و`setCalendarView('month'|'week'|'day')`. القيم غير الصالحة تُتجاهل.
- `getState()` نسخة `{view,calendarView,selectedDate,displayedMonth}`، لا store للبيانات أو حالة حفظ. setters صامتة. عند تغير الحالة بفعل مستخدم يطلق `order-schedule:state-change` مرة بالتفصيل نفسه؛ day-select يحمل `{date}`؛ order-open/edit-request/delete-request تحمل `{id}`؛ add-request يحمل `{date:ISO|null}`. order-open اسم الحدث الحالي عند فتح صف، لا تفويضًا تلقائيًا لفتح route.
- `setLoading(flag)` و`setError(retryCallback|null)`؛ retry callback هو فعل المستهلك، ليس جلبًا داخليًا. آخر حالة loading/error قائمة تملك العرض وفق المواصفة. `destroy()` ينهي المستمعات والمراقبين ويفرغ الجذر ويزيل سماته وحالته؛ old instance لا يعاد استخدامه. إعادة init بعده تبدأ مثيلًا جديدًا.
- التقويم يملك كامل داخله؛ summary خارجي عبر مصدر المستهلك وgetState/events، لا حقن DOM داخله. التغطية التالية: شهر/أسبوع/يوم وقائمة ومنتقي الشهر وصفوف/أكورديون وأفعال اختيارية، فارغ/غير مجدول/حالات/فشل/انتظار وحدود التاريخ والاتجاه؛ لا محرر أو حفظ أو URL أو نموذج حجوزات.

### 14. Carousel

**عقد المدخل (R4):** `init(root, options?)` يعيد `CarouselInstance`؛ `destroy(root)`/`getInstance(root)` صادران، و`goTo/next/prev/getIndex` على مستوى العنصر تبقى عامة.
- **options:** `labels` (R5).
- **instance:** `update({index, animate?})` = goTo، مع `goTo`/`next`/`prev`/`getIndex` على المثيل.
- **events:** `micro-carousel:change` بـ`{index, count}` (حتى البرمجي).
- **مثال:** `const c = MicroCarousel.init(root); c.update({ index: 2 }); c.destroy();`
- **مهملات IIFE (R-D10):** `update(carousel, index, options?)` و`disconnect(root)`.

المصدر: [المواصفة](../components/carousel/specification.md)، [JS](../components/carousel/carousel.js). يبقى Draft.

- source markup `[data-carousel]` مع viewport/track/slides وcontrols/compact/expand والخيارات الموثقة؛ محتوى البطاقة من عائلات مستقلة. لا autoplay؛ المقارنة المتزامنة صفوف وليست Carousel إلزاميًا.
- `MicroCarousel.init(root, options?)` يعيد instance له `update({index, animate?})`=goTo و`goTo/next/prev/getIndex`؛ دوال مستوى العنصر تبقى صادرة عامة، و`update(carousel, ...)` اسم مهمل في IIFE فقط (R-D10). getIndex=-1 دون حالة وgoTo يقيّد الفهرس. `micro-carousel:change` يحمل `{index,count}` عند تغيره، حتى من goTo البرمجي؛ ليس input خاصًا بالمنتج. تغيير الشريحة يطوي الموسعة، ولا يوسع الجديدة تلقائيًا.
- `destroy(root)` (وdisconnect المهمل IIFE بنفس المسار) يوقف الرصد والسحب وrAF ويحذف الحالة والنقاط المولدة؛ init بعده يبدأ من جديد. لا setSlides/rescan عامة؛ تبديل بنية الشرائح يحتاج دورة destroy ثم init وتنظيف الأطفال، لا تعديل track المملوك مع افتراض إعادة التقاط تلقائية.
- التغطية التالية:0/1/عدة شرائح، controls/peek الاختياري وcompact/expand حسب المواصفة، حد أول/آخر، سحب/إلغاء/تركيز/RTL/LTR؛ البيانات الفارغة داخل البطاقة مسؤولية مكوّنها، لا خطأ شبكة في Carousel نفسه.

### 16. Back — ربط زر الرجوع بالطبقات (الجولة الثالثة T4/N-D8)

**عقد المدخل:** `bindBackToLayers(options?)` → `{ openCount(), destroy() }` — وحدة اختيارية بلا تهيئة تلقائية.
- **السلوك:** عند فتح طبقة (كل عائلة تطلق `micro-layer:open`) تضاف حالة سجل واحدة؛ زر الرجوع/إيماءته يغلقان الطبقة العليا عبر مسار إغلاقها (إعادة التركيز لفاتحها)، ثم يخرج بسلوك المتصفح. الإغلاق بالطرق الأخرى (زر/Esc/سحب) يستهلك الحالة فورًا فلا حالات زائدة. حالات سجل المضيف لا تُمس.
- **الأحداث المستهلكة:** `micro-layer:open`/`micro-layer:close` (تفاصيل `{layer, opener, close?}`) — تطلقها navigation لكل طبقاتها (modal/لوحة تصفية/action-sheet/ورقة منتقٍ داخل طبقة).
- **مثال:** `const back = MicroBack.bindBackToLayers(); /* ... */ back.destroy();`
- **حدود:** iOS Safari غير المثبت — إيماءة الحافة قد يديرها النظام (NATIVE-BEHAVIOR قسم 11).

المصدر: [JS](../shared/back.js)، [عقد السلوك](NATIVE-BEHAVIOR.md) قسم 4.

### 17. Haptics — الاهتزاز الاختياري (الجولة الثالثة T4/N-D7)

**عقد المدخل:** `setHaptics(on)` (يعيد الحالة الفعلية)، `isHapticsEnabled()`، `pulse(kind)` بـkind من `confirm` (12ms) / `error` (15ms) / `selection` (10ms).
- **معطل افتراضيًا**؛ المضيف يفعّله. لا شيء على iOS (لا `navigator.vibrate`) ويُهمل مع `prefers-reduced-motion: reduce`. الحالة مشتركة عبر `globalThis` فسريان التفعيل على كل العائلات في صفحات IIFE متعددة المدخلات.
- **المستدعى من:** إغلاق الورقة السفلية بالسحب (navigation)، رسائل الخطأ (messages)، تأكيد الأفعال الحساسة (product).

المصدر: [JS](../shared/haptics.js)، [عقد السلوك](NATIVE-BEHAVIOR.md) قسم 7.

### 15. Screen — هيكل شاشة الهاتف (الجولة الثالثة T3)

**عقد المدخل:** `init(root?)` يعيد `ScreenInstance`؛ `update(root?)` و`destroy(root?)` و`getInstance(root?)` صادران.
- **options:** لا شيء (لا نصوص ولا بيانات — عائلة تخطيط بلا labels.js، موثق في DECISIONS).
- **instance:** `update()` يعيد قياس ارتفاعات الأشرطة بعد تغيير محتوى ديناميكي.
- **events:** لا أحداث مخصصة.
- **مثال:** `const s = MicroScreen.init(); /* أشرطة جديدة */ s.update(); s.destroy();`
- **لا مهملات IIFE** — عائلة جديدة بعقد R4 النقي.

المصدر: [المواصفة](../components/screen/specification.md)، [JS](../components/screen/screen.js). الحالة `draft-for-review` (N-D5).

- markup `[data-micro-screen]`: شريط علوي `__top` ومحتوى يتمرر وحده `__content` وشريط إجراءات `__actions` وشريط تنقل `__nav` (كلها اختيارية عدا `__content`) داخل `100dvh` (بديل `100vh`). الأشرطة صفوف grid لا طبقات فلا تغطية ممكنة؛ قياس ResizeObserver يغذي `scroll-padding-bottom` فيبقى آخر عنصر قابلًا للوصول.
- لوحة المفاتيح (N-D10 / [NATIVE-BEHAVIOR](NATIVE-BEHAVIOR.md) قسم 3): عبر `visualViewport` يبقى الحقل المركّز ظاهرًا، و`__actions[data-actions="keyboard-follow"]` يرتفع فوق اللوحة و`keyboard-hide` يختفي (الافتراضي عند وجود `__nav`). **المضيف يضبط `viewport-fit=cover`** لتفعيل الحواف الآمنة.
- لا يملك route ولا history ولا بيانات؛ نصوص الأشرطة من عائلاتها (appbar/navbar من navigation، الأزرار من buttons).
- التغطية التالية: 360×780 و320×780 RTL/LTR، آخر عنصر غير مغطى، محاكاة لوحة مفاتيح، safe areas بقيم اصطناعية (بوابة screen-check).

### امتدادات المصدر الاختيارية

Data يضيف getSelection(chart)/setSelection(chart,key|null) وحدث مستخدم micro-data:selection-change فقط عند data-selection=single ومفاتيح فريدة؛ لا تغيير rendered أو API قديم. C04 يضيف MicroReadings.init(root, options?) بعقد R4 الموحد (`instance.update()`=sync و`destroy`)؛ `sync`/`update`/`disconnect` أسماء مهملة في IIFE فقط (R-D10). [المدخلات والتحديث والإتاحة والتنظيف بالتفصيل](../docs/COMPOSITIONS.md). D01 وC05 قائمة إجراءات الهاتف وC06 ملخص خارجي منفذة وفق [عقود الهاتف](../docs/COMPOSITIONS.md)؛ حقول metadata داخل الطلب لم تُضف.

### استهلاك B01 داخل الرسوم

لا تغيير في API أو أسماء الأحداث أو IDs/hooks الجداول. أضيفت أصناف B01 secondary للأفعال المولدة، ويعاد تطبيقها على جدول منسوخ/قديم عند init/render. الاعتماد CSS على buttons.css شرط تحميل معلن؛ لا يلزم buttons.js بلا API تحميل. العقد والاستثناءات في قسم «الأفعال المشتركة والقواعد المشتركة» أدناه.

### امتدادات الهاتف الحالية

Navigation يضيف requestClose(layer,{reason?,trigger?}) بنتيجة boolean، مع بقاء closeLayer أمرًا مباشرًا. MicroActionSheet يضيف init (بعقد R4 الموحد: instance له update/destroy) وopen/close للتركيب C05؛ disconnect اسم مهمل في IIFE فقط، وmicro-actions:request يحمل {id,contextKey} بعد closed. C06 وصفة C01 خارج التقويم بمالك مزامنة من المستهلك؛ لا API جديدة داخل Order Schedule. [التفصيل والحدود والتحميل](../docs/COMPOSITIONS.md).

## المتغيرات

### المتغيرات الستة ذات العقود — كلها محفوظة في التغطية

| المتغير | مصدره وعقد استهلاكه الحالي | حد القرار |
|---|---|---|
| donut | Data، data-chart المناسب وsource التوزيع، render/جدول وحالات Data | opt-in؛ حصص قليلة بمقام معلوم، لا تفرض النسبة على المبلغ. |
| bubbles | Data، مصدر القيم وlegend/readings، render/جدول وحالات Data | opt-in وتقريبي مساحيًا؛ قراءة دقيقة مرافقة. |
| packed-circle | ملفات Packed مع data.css؛ MicroPacked ودورة حياته | Proposed، opt-in؛ رفض المقياس/الكثافة ليس نجاح رسم. |
| main-metric-featured | Metric Comparison وsource القراءة والسياق | opt-in؛ لا معنى مالي تلقائي من الإبراز. |
| metric-circles | Metric Comparison وsource الدوائر | opt-in؛ ليست افتراضي المقارنة الدقيقة. |
| info-strip-peek | Info Peek وmarkup مستقل، API وأحداثه أعلاه | opt-in؛ لا double-init مع الشريط العادي. |

هذه تغطية **عقود ومراجعة مصدر**، وليست نتائج فحص بصري/تفاعلي. تفاصيل كل خيار CSS أو markup تبقى في المواصفة، ولا تُحذف منها خيارات لأنها لا تمتلك API JavaScript. اختبار 360×780 RTL Light أساس الفحص، و320 للحاجة المثبتة وLTR حين يؤثر الاتجاه؛ لا Dark أو مصفوفة مقاسات واسعة.

### ملاحظات التحميل لكل متغير

- Donut وBubbles من ملفات Data؛ Donut لحصص قليلة ومقام معلوم، والفقاعات للمقدار التقريبي مع قراءة دقيقة خارجية.
- Packed Circle: `data.css` مع `packed-circle.css/js` و`MicroPacked.init/render/disconnect`؛ إذا حُمّل `data.js` لرسوم أخرى يبقى مصدر البيانات مشتركًا، ولا يُربط الإفصاح مرتين. يبقى proposed.
- Main Metric Featured وMetric Circles من ملفات Metric؛ featured إبراز صريح لقراءة واحدة، والدوائر متخصصة وليست افتراض المقارنة الدقيقة على الهاتف. التداخل بصري فقط.
- Info Strip Peek: CSS الشريط الأساسي ثم `info-strip-peek.css` و`info-strip-peek.js` و`MicroInfoPeek`؛ العنصر الموسوم `data-info-peek` ليس ملكية محرك الشريط الأساسي.
- Data readable وMetric readable: امتدادان اختياريان Draft من مصدر العائلتين، ويكملان عدد متغيرات الكتالوج إلى ثمانية؛ [القراءة والوحدات والتحديد](../docs/COMPOSITIONS.md).

## الأفعال المشتركة والقواعد المشتركة

### الأفعال المشتركة

المصدر الوحيد لمظهر الزر العام: `components/buttons/buttons.css`. لا تغيير للوحة أو الهوية أو قيم tokens أو مظهر B01 في هذه الدفعة. Data/Metric/Packed تستهلك المتغير الثانوي الموجود، مع احتفاظها بمنطق التحديد/الإفصاح والتنظيف.

#### أدوار الأفعال

| العنصر | المصدر المعتمد | ملكية السلوك |
|---|---|---|
| السابق/التالي في قراءة Data | `m-btn m-btn--secondary` + hook `m-chart__select-step` | Data؛ اختيار بمفتاح، لا تنقل صفحات أو طلبات خادم. |
| عرض/إخفاء جدول Data وPacked | `m-btn m-btn--secondary` + hook `m-chart__disclose` | renderer الحالي، وaria-expanded/controls ومعرف واحد وربط مرة. |
| عرض/إخفاء جدول Metric | `m-btn m-btn--secondary` + hook `m-main-metric__disclose` | Metric؛ المصدر والقراءات ودورة الحياة باقية. |
| فئة الدونات، range، خلايا التقويم، خيارات Picker | تحكم اختيار متخصص وفق مواصفته | لا يتحول كل عنصر button إلى CTA؛ أسماء وحالات وإتاحة ودلالات اختيار واضحة. |
| إفصاح C04 | `details/summary` أصلي بعلامة فتح/إغلاق ظاهرة وهدف48px | المتصفح؛ لا زر إضافي أو JS جديد. |
| زر إجراء في C01/C02/C03 أو رسالة أو طبقة | B01 وفق الغرض الأساسي/الثانوي/المتلف | المكوّن أو المستهلك حسب العقد؛ لا حفظ أو شبكة تلقائية. |

#### تحميل واضح مرة واحدة

```html
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="shared/tokens.css">
<link rel="stylesheet" href="components/buttons/buttons.css">
<link rel="stylesheet" href="components/data/data.css">
<script src="components/data/data.js"></script>
```

المسارات مثال من جذر الحزمة؛ اضبط base عند الاستهلاك. Metric يحتاج CSS/JS الخاصين به، وPacked يحتاج data.css وpacked-circle.css/js وفق عقده، إضافة إلى buttons.css للأفعال المولدة. لا يلزم buttons.js للزر العادي الذي يديره renderer؛ يلزم عند استهلاك API تحميل B01 نفسه. لا يلزم اعتماد B01 لسطوح Data الثابتة CSS-only التي لا تستخدم أفعالًا.

هذا **تغيير استهلاكي معلن**: أضف buttons.css للرسوم المولدة بالجافاسكربت، ولا تعتمد على تنسيق عائلة الرسم القديم لإعادة رسم مظهر الزر. أمثلة المصدر الحالية والمعرض والملفات المولدة تحمّل الاعتماد، والكتالوج يسجله conditionalDependency؛ لا دورات اعتماد أو framework جديد.

#### مصدر واحد للخصائص

الخط16 وارتفاع اللمس الأدنى48 والانحناء12 والحد واللون وحالات التعطيل/الضغط/التركيز تأتي من B01 وtokens الحالية. hook العائلة للعثور على الفعل وترتيبه، وليس نسخة ثانية من CSS الأزرار. تصحيح رقم24 القديم في سطرين من مواصفة Buttons توثيقي فقط؛ لم يتغير CSS أو token الانحناء12 الموجود أصلًا.

الأصناف لا تُغني عن تحميل المصدر، والوجود في DOM أو نجاح النقر لا يثبت وضوح الدور. الفحص يقارن computed appearance بمرجع B01 الفعلي ويفحص التعطيل والتركيز والضغط والحجم والتفاعل والنسخ. لا يستبدل ذلك تجربة هاتف أو دراسة فهم مع مستخدمين.

#### حدود المصدر والمراجعة

CSS وJS من components/shared/assets هي ما يُستهلك. صفحات المعاينة وcontrollers الاختبار وstandalone ليست شاشات منتج أو مصادر أعمال. لا يُبنى غلاف framework أو route أو سياسة صلاحيات هنا. D01/UX-06 وUX-07 وUX-08 تبقى بشروط التأجيل المسجلة.

### القواعد المشتركة — قيم الإصدار المستقر V1

قواعد الإصدار المستقر للمكتبة، مشتقة من الأسس. [STATUS](../docs/STATUS.md) يحسم تفاصيل الدفعة بتفويض المالك؛ هذا القسم يختصر القواعد ولا يستبدل الأسس.

#### مصدر القيم

مرجع القيم هو [أسس التصميم](../docs/DESIGN-FOUNDATIONS.md)، و[shared/tokens.css](../shared/tokens.css) مصدرها التنفيذي الوحيد الموجود. عدّل التوكن الدلالي هناك بدل إنشاء مصدر ثانٍ؛ لا ألوان أو مسافات متعارضة مكررة بين العناصر. لا تولّد نظام tokens ضخمًا لأجزاء لم نبدأها. مرجع الاختيار والتركيب: [DESIGN.md](../DESIGN.md).

| الدور | القيمة |
|---|---|
| primary / pressed / gradient-start | #164D59 / #103E48 / #236675 |
| page / base / selected | #F7F8F4 / #FFFFFF / #DFEEE6 |
| text-primary / secondary / inverse | #172D32 / #50656A / #FFFFFF |
| disabled-surface / disabled-text | #E4EAE8 / #53676B |
| border-control / divider / focus | #71868B / #DCE5E2 / #164D59 |
| destructive / destructive-surface | #AD303B / #FBEAEC |
| accent | #D97757؛ مع نص داكن |
| spacing | 4، 8، 12، 16، 20، 24، 32، 40px |
| touch-target | حد أدنى 48 × 48px كقاعدة المشروع |
| control-border / focus | 1px / 2px وفاصل 2px |
| icon / gap | 20–24px / 8px افتراضيًا |
| button-label | IBM Plex Sans Arabic، 16px، line-height 24px، وزن 500 |
| button | min-height 48px، padding-inline 20px، padding-block 12px؛ يتمدد مع النص |
| radius | كبسولة للزر القصير؛ 16px للحقل؛ 24px للسطح؛ دائري لزر الأيقونة |
| emphasis shadow | 0 3px 8px، لون primary بشفافية 14%؛ للأساسي فقط افتراضيًا |
| motion | ضغط 120ms، تغير اختيار 180ms؛ الفتح 240ms في دفعات الطبقات |

#### قواعد ثابتة

- RTL، أرقام 0–9؛ IBM Plex Sans للأرقام، واتساق عرضها عند المقارنة. لا تباعد مصطنع للحروف العربية.
- HugeIcons Stroke Rounded بأصول قابلة للتعديل مع مصدرها وترخيصها. لا Emoji ولا رسم بديل يُنسب للعائلة.
- النص الأبيض فوق #507F8B أو التراكوتا غير معتمد للنص الصغير. لا تستنتج التباين من صورة.
- الخلفية خلف النص والمدخلات مستقرة. لا زجاج شامل ولا مؤثرات كثيفة.
- العرض يتمدد دون تغيير دور العنصر؛ الارتفاع حد أدنى وليس قصًا للنص. هدف اللمس لا يصغر بسبب أيقونة صغيرة.
- لا معنى باللون وحده. الحالة المعطلة ليست التحميل، والتركيز ليس الضغط.
- لا اعتماد على hover؛ قلل الحركة عند طلب النظام ذلك. لا حركة تغيّر التخطيط أو تؤخر الاستجابة.
- الدلالات المهمة غير المعروفة لا تُعرض 0؛ المكوّن لا يحسب قواعد مالية.
- التصميم الجديد لا يرث مقاسات أو أصناف أو تبويبات التقرير القديم تلقائيًا.

#### القرارات المحسومة

تفاصيل الحالات غير المعتمدة تبقى مسودات في مواصفات العائلة. 24px للزر متعدد الأسطر والتحميل B افتراضيان مستقران صريحان في [سجل الاختيارات](../docs/DECISIONS.md). يوجد منتقي تاريخ native ضمن الاختيار؛ لا تقويم مخصص أو PIN أو قنوات مشاركة تلقائيًا. الاختبارات العملية ولكل تشغيل منها مصدر وحدود تغطية؛ ليست شهادة شاملة للمكتبة.

## امتداد سياق المنتج C07–C14

**عقد المدخل (R4):** `MicroProduct.init(root, model)` يختار الـrenderer من `model.type` ويفوّض إلى mount؛ `instance.update(model)` = replace، مع `replace`/`resolve`/`getState`/`destroy` على المثيل. `mount(root, type, value)` و`register` و`contextKey` و`destroy(root)` و`getInstance(root)` صادرة عامة. الحدث `micro-product:intent` بـ`{type, action, scope, request, payload}`. لا مهملات. مثال: `const p = MicroProduct.init(root, { type: 'manage', scope, ... }); p.update(nextModel); p.destroy();`

[العقد العام الموثق](../components/product-context/specification.md) و[جدول التغطية والقرارات](product-context/COVERAGE.md) يضيفان تراكيب Draft فوق المصدر الحالي. `MicroProduct.mount/replace/resolve/destroy` مالك محتواها الداخلي فقط، ولا يحل محل Navigation/Fields/Carousel أو سياسة الخادم. لا تنسخ lab.js أو بيانات الأمثلة.

C07–C12 وC14 تراكيب سياق المنتج بحالة Draft فوق العائلات الحالية، ومصدرها `components/product-context/`: C07 الهوية والدور وWorkspace والوجهات، وC08 حالة الاتصال والعمليات المُقرّة، وC09 بطاقة السوق ومحرره وبحثه ونتائجه، وC10 طلب التوصيل وعرضه وتغييره وإثباته، وC11 محادثة Ask Micro المحدودة النطاق وتأكيدها، وC12 قائمة المراجعة وبندها وبلاغها، وC14 سجل عمليات Manage ونموذج إدخالها (المرحلة 8).

C13 شاشات بوابة الدخول تركيب بحالة DRAFT FOR REVIEW يُستهلك من `components/access-gateway/auth-screens.css` وصفحات الاستخدام الأربع (`splash-usage.html` و`google-sign-in-usage.html` و`new-user-welcome-usage.html` و`returning-user-welcome-usage.html`)؛ عائلة أساسه buttons، وهو تركيب CSS/HTML بلا JavaScript API خاصة به، فاستهلاكه وملكيته وتنظيفه وفق عقد Access Gateway أعلاه.

## النصوص الافتراضية وتخصيصها — الجولة الثانية R5 (المفاتيح الدلالية)

المفاتيح الكاملة ونصوصها الافتراضية موثقة آليًا في [LABELS.md](LABELS.md).

كل نص عربي ظاهر للمستخدم (بما فيه نصوص `aria-label` الإتاحية) كان مكتوبًا داخل JS العائلات أصبح يُقرأ من سجل نصوص افتراضي لكل عائلة: `components/<family>/labels.js` يسجّل `window.MicroLabels['<family>'] = { … }` بقيم هي الصياغة الحرفية السابقة للمرحلة (بلا تخصيص تبقى المخرجات متطابقة بايت-ببايت — D12). ملف `labels.js` يجب أن يُحمَّل قبل ملف سلوك العائلة في كل صفحة (تُفحص آليًا ببوابة `hardcoded-text`)، وملفات JS العائلات تقرأ النص وقت الاستخدام لا وقت التحميل، لذا يعمل التخصيص بعد التحميل.

واجهات التخصيص:

- **`MicroX.setLabels(partial)`** — متاح على كل عائلة لها نصوص JS ظاهرة (Fields، Selection، Picker، Organization، Data وPacked، Messages، Navigation وActionSheet، InfoStrip وPeek، MetricComparison، AccountSettings، AccessGateway، OrderSchedule، Carousel، Product): دمج جزئي (بمستوى واحد، وكائنات صيغ الجمع تُدمج بمفتاحها الداخلي) فوق الافتراضي في سجل العائلة. يسري على التصييرات اللاحقة؛ النص الثابت الموجود في DOM يتحدث عند أول `render`/`update` بعده (أو بتهيئة مثيل جديد). لا يوجد setLabels على Buttons وIcons وReadings وSurfaces عمدًا — لا نصوص JS ظاهرة فيها أصلًا.
- **`options.labels`** — Access Gateway: `MicroAccessGateway.init(root, { labels: {…}, … })` يدمج نصوص هذا الاستدعاء قبل الربط ( Carousel وPicker بلا معامل options في `init` اليوم — استخدام `setLabels` مؤجل بقرار موثق في DECISIONS).
- **`MicroLabels.setLocale(locale)`** — locale تنسيق الأرقام للتصييرات اللاحقة. الافتراضي `'ar-u-nu-latn'`: أرقام لاتينية بلا فواصل كما هو الحالي حرفيًا (`MicroLabels.formatNumber` يمرر `String(n)` في الافتراضي؛ `Intl.NumberFormat` يُستخدم فقط عند locale مخصص) — لا يوجد تغيير في أشكال الأرقام أو التواريخ المرئية افتراضيًا (التواريخ تبقى رقمية `DD/MM/YYYY` كما هي).
- **صيغ الجمع:** `ordersCountPlural` في سجل order-schedule كائن فئات `{ zero, one, two, few, many, other, hundredOne, hundredTwo }` تُختار عبر `Intl.PluralRules('ar')` للعدادات دون 100 (تطابق تام مع المنطق السابق)، والأعداد 100 فأكثر تحتفظ بقاعدة العدد المركب الموثقة (آخر رقمين) — القيم نفس الصياغة الحرفية السابقة، و`{n}` موضع الرقم.
- **`window.MicroConfig = { autoInit: false }`** قبل تحميل أي ملف سلوك يوقف الربط التلقائي عند `DOMContentLoaded`/`readyState` في مسار IIFE لكل العائلات (كائن الواجهة العام يبقى مصدرًا للتهيئة اليدوية). مستمع إعادة قياس الرسوم بعد جاهزية الخطوط في Data/Packed ليس تهيئة تلقائية فيبقى.

بوابة `tools/hardcoded-text-check.py` (داخل `check-all`): صفر نصوص عربية داخل سلاسل JS خارج `*/labels.js`، استيراد `./labels.js` في ملف سلوك كل عائلة، تغطية مفاتيح `L()`، وتغطية كل صادر ESM مبنى في `dist/esm/<entry>.js` مقابل `tools/package/types/<entry>.d.ts`.
