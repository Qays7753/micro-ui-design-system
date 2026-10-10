# التقرير المرجعي الرئيسي لإصلاحات نظام UI الجديد

## Master Root-Cause Audit Report — Current Head `496b900`

- **المستودع المستهدف:** `Qays7753/micro-ui-design-system`
- **النطاق:** نظام UI الجديد فقط؛ لا Micro القديم ولا أي مقارنة مع الاتجاه القديم.
- **المنفذ المعتمد للإصلاحات:** **Z AI**.
- **نوع الوثيقة:** مرجع تشخيصي وتنفيذي للإصلاحات الجذرية.
- **حالة المصدر أثناء التدقيق:** لم يُعدّل كود المستودع في إعداد هذا التقرير.
- **الحكم الحالي:** `CHANGES REQUIRED` — Diagnostic Baseline for Root-Cause Repair.

> هذا ليس ملخصًا تنفيذيًا. هذه وثيقة مرجعية تجمع مخرجات الوكلاء الستة، وتفصل الأدلة والمشكلات النظامية والمحلية والفجوات والتوصيات ومعايير القبول.

---

## 1. قواعد التقرير والتنفيذ

### 1.1 النظام الجديد فقط

هذا التقرير يخص مستودع UI الجديد فقط. لا يستخدم Micro القديم كمرجع بصري أو معماري، ولا يقترح الحفاظ على توافق مع اتجاه قديم. أي ملف أو سجل تاريخي يظهر داخل أدلة الوكلاء يُعامل كسياق تدقيقي لا كقاعدة حية، بينما خط الأساس التشغيلي لهذا التقرير هو الرأس الحالي `496b900` والمسارات الحالية في المستودع.

### 1.2 قاعدة الإصلاح الجذري — Root-Cause Repair Policy

هذه قاعدة أساسية ملزمة لكل إصلاح ينفذه **Z AI**:

1. المشروع في مرحلة تطوير، ولا توجد بيانات إنتاجية أو مستخدمون أو عقد توافق يجب الحفاظ عليها؛ لذلك لا يوجد مبرر لترقيع سطحي أو حماية سلوك قديم على حساب التصميم الصحيح.
2. كل مشكلة تُصلح من طبقتها المالكة: `Foundation` أو `Token` أو `Component` أو `Composition` أو `Runtime` أو `Evidence`.
3. لا تُعالج مشكلة تركيبية بتغيير لون أو `padding` عشوائي داخل مكوّن غير مسؤول.
4. يُسمح بإعادة الهيكلة، تغيير API، حذف منطق غير صحيح، إعادة توزيع الملكية، وإعادة بناء المكوّن أو التكوين إذا كان ذلك هو الإصلاح الصحيح للنظام الجديد.
5. لا تُضاف `compatibility shims` أو aliases أو fallbackات فقط لإبقاء تصميم قديم يعمل، إلا إذا كان ذلك جزءًا صريحًا من عقد النظام الجديد.
6. كل إصلاح جذري يجب أن يحدّث المصدر والمواصفة والمعاينة واختبارات القبول والأدلة معًا.
7. لا تُعدّل الملفات المولدة يدويًا؛ عدّل المصدر، ثم أعد التوليد، ثم طابق الناتج.
8. لا ينفذ هذا التقرير الإصلاحات. **Z AI هو المنفذ الوحيد للإصلاحات**؛ هذا الملف يسلّم التشخيص والسبب الجذري والأولوية ومعيار القبول.
9. إذا كان البند قرار مالك لا عيبًا مثبتًا، فلا يُحسم بصمت؛ يُسجّل القرار المطلوب ثم يُبنى الحل الجذري بعد اعتماده.
10. كل إصلاح يجب أن يحمل `commit/head`، الملفات، الاختبارات، المقاسات، المتصفح، و`RTL/LTR`. إذا ظهر التكبير في دليل تاريخي فهو قياس تشخيصي للـoverflow فقط، وليس وظيفة أو متطلبًا لتغيير مقياس UI.

### 1.3 قاعدة المثال

ذكر المالك مشكلة مثل Chart ضيق أو طويل هو إشارة إلى عرض مرئي، وليس تحديدًا لنطاق المراجعة. لذلك فحص الوكلاء الأدلة المرتبطة بالنظام كاملًا: الأساسات، التوكنز، الطباعة، الهندسة، المكونات، التكوينات الحالية، التنقل، الحالات، البيانات، الرسوم، RTL، الوصولية، الاستجابة، لوحة المفاتيح، واللمس. هذا الاتساع يصف حدود التدقيق، ولا يحول كل Finding إلى أمر تنفيذ في الجولة الحالية.

### 1.4 حدود الدليل

- أي `PASS` في Chromium/Playwright يثبت نطاق Chromium فقط.
- لا يثبت `Safari/WebKit` أو جهاز Android/iOS أو اللمس أو قارئ الشاشة أو `safe-area` موجبة أو `native zoom`.
- كل Finding مصنف إلى: **مثبت**، **خطر محتمل**، **قرار مالك**، **فجوة غير مختبرة**، أو **نقطة قوة يجب الحفاظ عليها**.
- هذا الملف هو مرجع Markdown الرئيسي لهذه الجولة؛ لا تُنشأ نسخ متنافسة منه أثناء الجولة نفسها.

### 1.5 قفل التنفيذ الحالي لـZed AI

التنفيذ الحالي يقتصر على **UI للمكونات الحالية**. لذلك يجب على Zed AI أن يقرأ هذا التقرير على مستويين:

1. **Active UI repair:** التوكنز الحالية، هندسة المكونات، الحالات، semantics، RTL/LTR، الرسوم الحالية، والتراكيب الحالية مثل tabs وnavbar وactionbar وlayer وsheet وdialog.
2. **Audit-only/deferred:** أي Finding لا يدخل في مواصفة الإصلاح التنفيذية المرفقة. يبقى محفوظًا كدليل، لكنه لا يُنفذ ولا يتحول إلى افتراض منتج.

القواعد الملزمة لهذا القفل:

- لا تصميم صفحات أو رحلات أو منطق أعمال أو صلاحيات.
- لا إضافة عائلات مكونات جديدة.
- لا تغيير لألوان الهوية أو توكنزها؛ أي اقتراح لوني يوضع بعد التنفيذ فقط تحت `COLOR PROPOSAL — NOT IMPLEMENTED` مع القيم الدقيقة.
- لا وظيفة تكبير ولا تغيير مقياس UI؛ قياسات التكبير القديمة تشخيصية فقط.
- لا يُحسم أي بند مصنف `قرار مالك` بصمت.
- `main` هو baseline، لكن التنفيذ يكون على **فرع إصلاح واحد** منشأ من آخر `main`؛ لا تعديل مباشر على `main` ولا فروع فرعية لكل موجة.
- أي مسار أو مجلد تاريخي يحمل اسمًا غير UI داخل الأدلة لا يغير هذا النطاق ولا يمنح Agent أمرًا بتنفيذ مجال آخر.
- المسارات `audit-agent-output/` و`audit-session-output/` هي مراجع provenance من جولة التدقيق؛ لا يُطلب من Zed AI العثور عليها أو إعادة بنائها، ولا تتقدم على المصدر الحالي أو مواصفة الإصلاح.

---

## 2. خريطة الوكلاء والأحكام

| الوكيل | المحور | الحكم | أعلى الأولويات |
|---|---|---|---|
| A1 | الأساسات والهندسة البصرية / Foundation Geometry | `CHANGES REQUIRED` محدود | tabs reflow، هامش 390/430، touch spacing، safe-area، Compact/Expanded |
| A2 | المكونات والحالات والتوكنز / Components & States | يحتاج إصلاحات | `aria-disabled`، ARIA defaults/validator، tokens، live regions، `init(root)` |
| A3 | التكوين والتنقل / Composition & Navigation | `REQUEST CHANGES` | `tabpanel`، tabs overflow، safe-area ownership، keyboard/root scroll، nav policy |
| A4 | البيانات والرسوم / Data Visualization | `CHANGES REQUIRED` | dataset accessible، table/CSV، bubble scale، summary drift، axes/contrast |
| A5 | الوصولية وRTL والتكبير / Accessibility & Responsive | تحتاج إصلاحات وقرارات | forced-colors، scaling، busy، native date، keyboard، calendar exception |
| A6 | Web-Native وPWA / Web-Native & PWA | غير جاهز كـPWA إنتاجي | manifest/SW، metadata، safe-area top، keyboard، history/back، adaptive windows |

---

## 3. سجل المشكلات الموحد / Unified Issue Register

المعرّفات التالية ثابتة داخل هذا التقرير. عند إنشاء إصلاح، يجب على Z AI ذكر المعرّف أو مجموعة المعرّفات التي يعالجها، وربطها بملفات المصدر والمواصفة والاختبارات.

| ID | الطبقة | المشكلة الجذرية | الأولوية | حالة الدليل |
|---|---|---|---|---|
| A1-F01 / A3-F02 | Navigation / Composition | `m-tabs` بلا عقد overflow أو reflow عند النص الطويل والتكبير | P1 | مثبت بقياسات DOM |
| A3-F01 | Accessibility / Tabs | `tabpanel` النشطة لا تدخل Tab عند غياب أهداف داخلية | P1 | مثبت بإعادة إنتاج |
| A2-F01 | State semantics | `aria-disabled` محروس في JS لكن مظهره لا يطابق في CSS | P1 | مثبت في المصدر |
| A4-D01 | Data accessibility | SVG/aria-label قصير بلا dataset دلالي أو ربط summary | P1 | مثبت في المصدر؛ AT غير مختبر |
| A4-D02 | Data architecture | لا يوجد table/CSV/disclosure عام للبيانات | P1/P2 | فجوة تغطية مثبتة |
| A4-D03 | Data scale | `bubbles` تسمح بمقياس غير صالح وتتجاوز `rmax` بصمت | P1 | مثبت في المصدر |
| A4-D04 | Data contract | `summary` يكتب مرة واحدة وقد يصبح قديمًا | P1/P2 | مثبت في التنفيذ |
| A2-F03/A2-F04 | ARIA API | أدوار dialog/messages يضيفها المستهلك بلا validator/defaults | P1 | فجوة عقد مثبتة |
| A2-F05 | Live region | قناة واحدة وتبديل polite/assertive بمؤقت 50ms تحت burst | P1 | خطر محتمل؛ AT غير مختبر |
| A3-F03 | Safe-area | تكرار inset بين sticky-foot/actionbar/navbar | P2 | مثبت تركيبيًا؛ أثر الجهاز مشروط |
| A1-F02 | Geometry | هامش المعرض 16px عند 390/430 رغم عقد 20px | P2 | مثبت في CSS |
| A1-F04 | Touch geometry | لا قاعدة فصل عامة بين أهداف اللمس؛ gaps 4/5px | P2 | فجوة/خطر محتمل |
| A1-F05/A6-ADAPT | Responsive | لا عقد صريح لـlandscape/Medium/Expanded/foldable | P2 | قرار نطاق مطلوب |
| A1-F06/A6-MOBILE | Insets | safe-area top/inline غير معالجة أو غير مثبتة | P1/P2 | فجوة/خطر جهاز |
| A3-R01 | Scroll runtime | قفل body فقط؛ root scroll في Safari/WebView غير مثبت | P1/P2 | خطر محتمل |
| A3-R02/A5-F06 | Keyboard | لا visualViewport/keyboard-inset/interactive-widget contract | P1 | غير مختبر |
| A2-F02/A1-token | Tokens | rgba وقيم صلبة وnamespaces محلية غير موحدة | P1/P2 | مثبت في المصدر |
| A2-F09/A5-F01 | Context accessibility | لا forced-colors/prefers-contrast/dark contract | P2 | فجوة غير مذكورة |
| A5-F04 | Example reflow | `#results PRE` يسبب page overflow عند 320+200% | P2 | مثبت في غلاف المثال |
| A5-F05 | Localization | native date يظهر placeholder إنجليزي داخل نموذج عربي | P2 | سلوك منصة غير محسوم |
| A5-F07 | Calendar | خلية شهر تقارب 37.7px عند 320 وتحتاج قرار مالك | P2 | استثناء معلن، ليس عيبًا صامتًا |
| A6-PWA-001 | PWA | لا manifest/service worker/install metadata | P0/P1 | مثبت في المستودع |
| A6-PWA-002 | PWA metadata | theme-color غير متسق؛ لا icons/start_url/display/scope | P1 | مثبت في المستودع |
| A6-NAV-001 | Web navigation | `state.view` داخلي بلا history/deep-link/system-back contract | P2 | فجوة غير مذكورة |
| A6-ADAPT-001 | Adaptive | عمود 560px وbottom nav دون rail/drawer/multi-pane | P2 | قرار نطاق |
| A4-R01 | Chart visual | ألوان data الفاتحة لا تحقق تباينًا كافيًا كعلامات مستقلة | P1/P2 | خطر بصري يحتاج اختبار marks |
| A4-R02/R03 | Chart naming/update | `data-title` يختلف عن العنوان المرئي ولا يوجد إعلان تحديث للـAT | P2 | خطر/فجوة عقد |
| A4-R04 | Data exploration | لا filter/sort/zoom/pagination للكثافة العالية | P3/قرار | قرار نطاق المنتج |
| A2-F08 | Lifecycle API | `init(root)` لا يعالج root نفسه باتساق بين العائلات | P2 | فجوة API |
| A3-D01/D02/D03 | Navigation policy | حدود bottom nav، appbar المتكيف، modal stack/Back غير محسومة | P1/P2 | قرارات مالك |

---

# 4. تقرير الوكيل A1 — الأساسات والهندسة البصرية

- **المعرّف:** `foundation-geometry`
- **النطاق:** الأساسات، المقاييس، المسافات، أحجام أهداف اللمس، الانسياب، التكيّف مع حجم النص/العرض، مناطق الأمان، وتركيب التبويبات/الأشرطة.
- **الحكم:** `CHANGES REQUIRED` محدود.
- **الملكية:** لم يُستخدم Micro القديم ولم يُقارن به. ذُكرت عائلة البيانات/Chart فقط بوصفها جزءًا من المعرض، ولم يُحصر التدقيق فيها.
- **التغيير على المصدر:** لم يُعدّل أي ملف مصدر.

## A1.1 خلاصة الحكم

النظام يملك نواة جيدة: مصدر توكنات واحد، خصائص CSS منطقية في المكونات الأساسية، حد لمس محافظ 48px، ارتفاعات دنيا بدل الارتفاعات الجامدة، `meta viewport`، وتجارب تعترف صراحة بأن Chromium ليس جهازًا فعليًا.

لكن قبول محور الهندسة لا يُغلق بعد:

1. `m-tabs` لا يعيد التدفق عند تكبير النص.
2. وثيقة النظام تفرض هامش 20px من عرض 390 فأعلى، بينما المعرض يفرض 16px على 390 و430.
3. غلاف المعرض يستخدم سلمًا أكبر من سلم المنتج دون فصل أو توثيق.
4. هدف 48px موثق، لكن لا توجد قاعدة قابلة للقياس للمسافة بين الأهداف أو لديناميكية ارتفاع الشريط السفلي عند التفافه.
5. لا توجد عقد عامة للسلوك عند landscape/foldable وsafe-area الجانبية.
6. native zoom وSafari/WebKit وSamsung Internet والهاتف الفعلي واللمس الحقيقي ولوحة الهاتف وقارئات الشاشة لم تُثبت.

## A1.2 F-01 — تبويبات المحتوى تكسر reflow عند 200%

**التصنيف:** عيب مثبت، أولوية P1 للمكوّن/التركيب.

**الأدلة:**

- `components/navigation/navigation.css:49-73`: `.m-tabs` هو `display:flex` دون `flex-wrap` أو سياسة تمرير/تراص.
- كل `.m-tabs__tab` يحتفظ بحشو inline 16px و`min-height:48px`.
- عند 320 + نص 200%: عرض الحاوية 190px لكن `scrollWidth=263`.
- تبويب «المكتملة» يصل إلى `left=-8.5px`، والصفحة إلى `scrollWidth=412` مقابل `clientWidth=320`.
- تكرر تجاوز الصفحة عند 360 و390.

**الأثر:**

النص لا يبقى ضمن الحيز الأفقي عند تكبيره؛ قد يُقطع من جهة البداية أو يفرض تمريرًا أفقيًا ثنائي الاتجاه. هذا ليس قرارًا بصريًا فقط، بل تجاوز قابل لإعادة الإنتاج.

**السبب الجذري:** لا يوجد عقد لتغير تخطيط التبويبات عند تغير العرض أو حجم النص. المكوّن يعتمد على `flex` أفقي واحد مع محتوى غير محدود.

**الإصلاح الجذري المطلوب:**

اختر نمطًا معلنًا: `flex-wrap` مع نمو ارتفاع الصف، أو تراص عند ضيق الحاوية، أو تمريرًا مقصودًا مع مؤشر وملكية تمرير واضحة، أو More/سقف عدد. لا تستخدم القص أو التصغير التلقائي.

**معيار القبول:**

- 320/360/390/430.
- RTL وLTR.
- نص عربي طويل.
- 200% والتكبير المطلوب في العقد.
- كل هدف مرئي وقابل للمس.
- `role=tab`, الأسهم، `aria-controls`، وTab order لا تنكسر.
- لا `scrollWidth > clientWidth` إلا إذا كان overflow مقصودًا ومعلنًا.

## A1.3 F-02 — هامش المعرض يخالف العقد عند 390px+

**التصنيف:** عيب عقد/اتساق هندسي مثبت، أولوية P2.

**الأدلة:**

- `docs/UI-VISUAL-SYSTEM.md:21-23` و`docs/foundations/Micro-UI-Foundations-V1.md:135-145` يقرران 16px تحت 390 و20px من 390 فأعلى.
- `previews/index.css:95-97` يطبق `width:calc(100% - 32px)` حتى 700px.
- النتيجة 16px عند 390 و430، لا 20px.

**الأثر:**

المعرض نفسه، وهو المرجع المرئي المباشر، لا يعكس قاعدة الأساس؛ هذا يغير عرض النص، التفاف العناوين، وموضع البطاقات.

**الإصلاح الجذري المطلوب:**

إما جعل breakpoint للهامش عند `389.98px`، أو تعريف توكن/استثناء صريح لغلاف المعرض. لا تترك الانحراف صامتًا.

## A1.4 F-03 — غلاف المعرض خارج سلم النوع والمسافات

**التصنيف:** قرار بصري يحتاج توثيقًا، وليس عيب وصول بذاته.

**الأدلة:**

- العقد يذكر أدوارًا مثل 22/32 و18/28 و16/26 و14/22 و13/20.
- `previews/index.css:21` يحدد عنوان المعرض `clamp(38px,8vw,72px)`.
- `previews/index.css:39` يحدد عنوان القسم 27px.
- القيم 14/15/18/27/38–72/42px خارج السلم المشترك 4/8/12/16/20/24/32/40.

**السبب الجذري:** لا يوجد فصل موثق بين توكنات غلاف المكتبة وتوكنات المنتج.

**الإصلاح الجذري المطلوب:**

إما تعريف `--micro-gallery-display-*` و`--micro-gallery-space-*` في نطاق المعرض، أو إعادة الغلاف إلى سلم المنتج. القرار ليس تجميليًا فقط لأنه يؤثر على المرجع الذي سيقلده الوكلاء.

## A1.5 F-04 — حجم الهدف مضبوط، لكن تباعد الأهداف غير مقنن

**التصنيف:** فجوة نظامية/خطر محتمل.

**الأدلة:**

- `shared/tokens.css:63-71` يضع 48px للأهداف.
- `components/fields/fields.css:148-153` يضع `gap:4px` بين زري stepper.
- `previews/index.css:54-55` يضع gap رأسي 5px بين روابط ذات `min-height:48px`.

**السبب الجذري:** النظام يثبت حجم الهدف لكنه لا يثبت هندسة الفصل بين bounding boxes الفعلية.

**الإصلاح الجذري المطلوب:**

تعريف قاعدة فصل افتراضية قابلة للقياس، مثل 8px، مع استثناءات موثقة. فحص CSS `min-height` وحده غير كافٍ.

## A1.6 F-05 — نطاق الهاتف العمودي مقابل الشاشات المتكيفة

**التصنيف:** قرار يحتاج المالك، وخطر محتمل إن كان Landscape/نافذة/جهاز قابل للطي داخل النطاق.

لا توجد سياسة معلنة لـ600/840، ولا rail/drawer/multi-pane أو viewport segments. يجب حسم أحد الخيارين:

1. هاتف عمودي فقط مع non-goal معلن.
2. Web/PWA متجاوب يعرّف Compact/Medium/Expanded وLandscape وFoldable وKeyboard.

لا تُعد Samsung/Material شهادة توافق؛ هي مراجع تصميم لاختبار مطلوب.

## A1.7 F-06 — safe-area جزئية وعدم إثبات viewport-fit

**التصنيف:** خطر محتمل، غير مثبت على جهاز.

**الأدلة:**

- `navigation.css:107,167,265` يستخدم `env(safe-area-inset-bottom, 0px)`.
- لا توجد معالجة مقابلة لـsafe-area inline في appbar/actionbar أو حاويات المحتوى.
- لا يوجد `viewport-fit=cover` في صفحات المعاينة.

**الإصلاح الجذري المطلوب:**

تعريف مالك insets، وإضافة top/inline حيث ينطبق، ثم اختبار notch/rounded corners/gesture navigation/keyboard على أجهزة حقيقية.

## A1.8 F-07 — ارتفاع navbar المتغير يحتاج عقدًا عامًا

`m-navbar` و`m-actionbar` يمكن أن يلتفا إلى صفوف متعددة، لكن التعليق الذي يعتمد على ResizeObserver لا يكفي كعقد. لا يوجد ضمان أن كل مستهلك سيضيف الحشو الصحيح للمحتوى التالي.

**الإصلاح:**

انقل شرط القياس إلى عقد موثق ومثال إلزامي، أو اجعل التخطيط يتشارك التدفق نفسه دون الاعتماد على ارتفاع ثابت. اختبر navbar/actionbar/toast/selection indicator معًا.

## A1.9 F-08 — picker option الطويل بلا عقد صريح للانكماش

`picker.css:80-98` يجعل الخيار flex مع `min-height:48px`، لكنه لا يضع `min-inline-size:0` أو `overflow-wrap:anywhere`. `picker.js:204-217` يبني نصًا مباشرًا من المستهلك.

**الإصلاح:**

اختبر تسمية عربية/لاتينية طويلة بلا مسافات عند 320 و200%، أو ثبّت بنية span مع `min-inline-size:0` و`overflow-wrap:anywhere`. لا تستخدم ellipsis لاسم يحتاج قراءة كاملة.

## A1.10 نقاط القوة التي يجب الحفاظ عليها

- سلم مسافات مركزي في `shared/tokens.css`.
- `min-height` وتدفق قابل للتمدد بدل الارتفاع الجامد.
- `min-width:0` و`overflow-wrap:anywhere` في organization rows.
- safe-area bottom موجود في الشريط السفلي وactionbar.
- meta viewport موجود.
- حدود قبول تعترف بأن Chromium ليس هاتفًا.

## A1.11 ملفات وأدلة الوكيل

- `shared/tokens.css`
- `docs/UI-VISUAL-SYSTEM.md`
- `docs/foundations/Micro-UI-Foundations-V1.md`
- `previews/index.css`
- `components/navigation/navigation.css`
- `components/navigation/navigation.js`
- `components/selection/picker.css`
- `components/selection/picker.js`
- `components/fields/fields.css`
- `reviews/B01/`, `reviews/B02/`, `reviews/B04/`, `reviews/B07/`, `reviews/CAROUSEL/`

---

# 5. تقرير الوكيل A2 — المكونات والحالات والتوكنز المحلية

- **المعرّف:** `components-states`
- **النطاق:** المستودع الجديد فقط.
- **الحكم:** يحتاج إلى إصلاحات قبل اعتباره نظام مكونات وحالات جاهزًا لإعادة الاستخدام.
- **قاعدة القراءة:** 20% وصف للحالة الحالية و80% كشف فجوات ومقارنتها بالمراجع الرسمية.

## A2.1 الحالة الحالية

- `shared/tokens.css` يعرّف الهوية والأسطح والنصوص والتركيز والمسافات والمقاسات والحركة.
- buttons.css/js يغطي العادي والضغط والتركيز والتعطيل والتحميل ويحرس Enter/Space أثناء `aria-busy`.
- selection.js يزامن checkbox الجزئي وradio وswitch pending وsegmented.
- navigation.js يدير inert وحصر التركيز وEscape والاستعادة وقفل التمرير.
- messages.js يبني live region مشتركة.
- التوكنز المحلية موجودة لكنها غير موحدة بين system/component/runtime geometry.

## A2.2 F-01 — aria-disabled محروس برمجيًا لكنه يبدو قابلًا للتفاعل

**التصنيف:** عيب مثبت، أولوية عالية.

**الأدلة:**

- `selection.js:21-23` يعرّف `isDisabled` على أنه disabled أو `aria-disabled=true`.
- `selection.js:80-83` يمنع النقر وإطلاق `micro-selection:segment`.
- `selection.css:313-317` ينسق `[disabled]` فقط.
- `selection.css:347` يستثني `[disabled]` فقط من hover.

**الأثر:**

قد يقرأ قارئ الشاشة العنصر معطلًا بينما يراه المستخدم فعالًا، وقد يتلقى hover مضللًا. هذا كسر لاتساق الدلالة والسلوك والمظهر.

**الإصلاح الجذري:**

إضافة `[aria-disabled="true"]` إلى قواعد التعطيل واستثناءات hover/active/focus، ثم اختبار عدم إطلاق الحدث، المظهر، Tab، pointer، وkeyboard. يجب اتخاذ قرار مستقل حول إبقائه في Tab أو إخراجه.

## A2.3 F-02 — قيمة hover صلبة خارج حوكمة التوكنز

**الأدلة:**

- `selection.css:347` يستخدم `rgba(223,238,230,.65)` بدل توكن دلالي.
- `shared/tokens.css:20` يعرّف `--micro-surface-selected: #DFEEE6`.
- `metric-comparison.css:381` يستخدم قيمة ظل صلبة `rgba(255,255,255,.16)`.

**الأثر:**

تعديل surface-selected أو بناء نسق آخر لا ينعكس على hover، وتصبح القرارات غير قابلة للتدقيق.

**الإصلاح الجذري:**

تعريف توكن مثل `--micro-selection-hover-surface` أو توثيق اشتقاقه صراحة، وإضافة lint يمنع hex/rgba داخل components إلا باستثناء موثق.

## A2.4 F-03 — الطبقة قد تصبح Modal بلا عقد ARIA

navigation.js يدير التركيز والعزل لكنه لا يضيف أو يتحقق من `role=dialog`, `aria-modal`, `aria-labelledby` أو `aria-label`. الأمثلة تضيفها يدويًا.

**الإصلاح الجذري:**

إما أن يضيف المكوّن semantics الافتراضية ويصدر تحذيرًا عند غياب الاسم، أو يملك validator بنيويًا يفشل عند فتح طبقة بلا role/name/modal. لا يكفي فحص inert.

## A2.5 F-04 — أدوار الرسائل الثابتة ليست مضمونة

messages.js يبني live region للتوست، لكنه لا يضمن role مناسبًا لـm-note. المثال يضيف `role=status` يدويًا.

**الأثر:**

قد تعرض الرسالة نجاحًا أو خطأ بصريًا بلا إعلان مناسب، أو قد تُعمم `alert` على تحذير غير حرج.

**الإصلاح الجذري:**

اجعل النوع يحدد role افتراضيًا عند init، أو validator يحذر/يرفض m-note بلا role مناسب، مع فصل status عن alert.

## A2.6 F-05 — live region واحدة وتبديل polite/assertive بمؤقت 50ms

messages.js يبدل aria-live على نفس العقدة ثم يمسح النص ويعيده بعد 50ms. عند حدثين متقاربين قد تتنافس المؤقتات أو يضيع ترتيب الإعلان.

**الإصلاح الجذري:**

اختبار burst مستقل، إعلانين بهوية واحدة، assertive يلي polite، مع NVDA/VoiceOver/TalkBack. عند الحاجة استخدم queue/coalescing أو قناة assertive مستقلة بدل مؤقت ثابت.

## A2.7 F-06 — أسماء التوكنز المحلية وحدودها غير موحدة

- surfaces يستخدم `--micro-surface-wave-*` مع fallbacks غير معلنة في `:root`.
- carousel يستخدم `--_peek` و`--_gap`.
- info-strip-peek يستخدم `--m-peek-width` و`--m-peek-gap`.
- metric-comparison يعتمد على `--m-circle-*` و`--m-bar-width` التي يكتبها JS.

**الإصلاح الجذري:**

اعتماد convention مثل `--micro-comp-carousel-*` للقيم القابلة للضبط و`--micro-geom-*` للقيم التي يكتبها JS، وتوثيق نطاق override.

## A2.8 F-07 — الشكل المرئي لـSegmented أصغر من هدف اللمس

الشكل المرئي 40px تقريبًا، بينما `::after` يمدد hit area إلى 48px. هذا قرار بصري يحتاج تثبيتًا لا إصلاحًا صامتًا.

**الإصلاح الجذري:**

حسم هل 40px مع hit area 48px مقصود، ثم فحص `elementFromPoint` ولمس حقيقي وتباعد الأهداف على Android/iOS. لا تُساوى CSS px بـdp/pt.

## A2.9 F-08 — عدم اتساق عقد init(root)

selection.js لا يعالج root نفسه، بينما account-settings وinfo-strip-peek يعالجان الجذر نفسه صراحة. تمرير عقدة segmented ذاتها قد يفشل.

**الإصلاح الجذري:**

توحيد كل APIs على “root نفسه + الأبناء” أو إعلان أن root حاوية فقط، مع اختبارات node ذاتي، container، re-init، disconnect، وdynamic mount.

## A2.10 F-09 — لا مسار واضح لـforced-colors/high contrast/dark

لا تظهر `forced-colors`, `prefers-contrast`, أو `color-scheme` في shared/components.

**الإصلاح الجذري:**

حسم نطاق الدعم. إذا كان مطلوبًا، أضف طبقة tokens سياقية واختبارات للحدود والتركيز والأيقونات والنص.

## A2.11 ما لم يُختبر

- فشل إعادة تشغيل بعض أدوات الفحص بسبب غياب executable في بيئة Playwright أثناء جولة الوكيل.
- TalkBack/VoiceOver/NVDA.
- forced-colors/High Contrast.
- WebKit/Safari فعليًا.
- لمس حقيقي ولوحة هاتف.
- 48dp/44pt على جهاز فعلي.

## A2.12 التوصيات المرتبة

1. إصلاح F-01 في CSS وJS وkeyboard/pointer tests.
2. عقد دلالات قابل للتحقق للطبقات والرسائل.
3. استبدال rgba والقيم الصلبة بتوكنز مسماة.
4. تصميم queue/coalescing للـlive region.
5. توحيد namespaces للـtokens والـruntime geometry.
6. تثبيت قرار segmented المرئي/hit area.
7. توحيد init(root) ودورات mount/disconnect/re-init.
8. حسم forced-colors/high-contrast/dark.
9. بوابة إصدار تفصل Chromium عن WebKit والجهاز وقارئ الشاشة.

---

# 6. تقرير الوكيل A3 — التكوينات والتنقل والتمرير والطبقات

- **المعرّف:** `composition-navigation`
- **رأس المصدر المقروء:** `496b900ab41085627ca0a8f9479674a9dc3ad677`
- **الحكم:** `REQUEST CHANGES / غير جاهز كعقد نظامي عام`.

## A3.1 نقاط القوة الحالية

- navigation.js يدير stack للطبقات، inert للأشقاء، حصر Tab/Shift+Tab، استعادة التركيز، وقفل التمرير بعداد.
- يعالج إعادة الفتح أثناء الخفوت ويمنع مؤقت الإغلاق القديم من إخفاء طبقة أعيد فتحها.
- m-layer__body منطقة تمرير داخلية مع `overscroll-behavior: contain`.
- `prefers-reduced-motion` مدعوم.
- B07 لديه 28/28 ضمن Chromium، لكن هذا لا يثبت جهازًا فعليًا أو قارئ شاشة أو WebKit.

## A3.2 F-01 — tabpanel تُتجاوز في Tab

**الأدلة:**

- `previews/navigation/index.html:49-57` يعرّف tablist/tab/tabpanel.
- `navigation.js:443-451` يبدل hidden وaria-selected فقط، ولا يضيف `tabindex=0` للوحة النشطة.
- بعد focus على tab ثم Tab ينتقل التركيز إلى زر لاحق، و`panelTabIndex=-1`.

**الأثر:**

مستخدم لوحة المفاتيح أو قارئ الشاشة يفعّل التبويب ولا يصل إلى بداية محتواه بـTab.

**الإصلاح الجذري:**

عند تهيئة التبويبات، عيّن `tabindex=0` للtabpanel النشطة عندما لا تحتوي هدفًا قابلًا للتركيز، وأضف فحصًا سلوكيًا: تبويب نشط → Tab → panel.

## A3.3 F-02 — m-tabs بلا overflow أو سياسة كثرة تبويبات

**الأدلة:**

- `navigation.css:49-53` يعرّف flex فقط.
- لا `overflow-x:auto`، ولا التفاف، ولا More، ولا حد للمستهلك.
- مع ثلاث تسميات عربية طويلة: 320px `clientWidth=190`, `scrollWidth=437`, `overflowX=visible`; 390px `clientWidth=260`, `scrollWidth=437`.

**الإصلاح الجذري:**

اختيار عقد واحد: overflow مقصود مع مؤشر وتمرير لوحة مفاتيح، أو حد وجهات وMore، أو نمط تبويبات مختلف للبيانات الكثيرة. لا تترك overflow مرئيًا صامتًا.

## A3.4 F-03 — تكرار safe-area في تركيب الشريطين

`sticky-foot` يضيف inset، وm-navbar يضيفه، وm-actionbar يضيفه أيضًا. التركيب يركب الثلاثة، فتُحجز القيمة ثلاث مرات عند inset موجب.

**الإصلاح الجذري:**

اجعل outermost bottom surface هو مالك safe-area، أو استخدم سمة/توكنًا يحدد المالك. أضف harness بقيمة inset موجبة؛ لا يكفي Chromium الذي يعطي صفرًا.

## A3.5 R-01 — قفل body وحده

navigation.js يغير `document.body.style.overflow` فقط. هذا لا يثبت قفل root scrolling في Safari/WebView.

**الإصلاح الجذري:**

اختبار WebKit/WebView ثم توحيد root scroll lock (`html`/`body` حسب الغلاف) مع حفظ القيم الأصلية.

## A3.6 R-02 — لوحة المفاتيح قد تغطي حقلًا داخل طبقة ثابتة

الطبقة تستخدم max-height وsafe-area bottom فقط، ولا يوجد visualViewport أو keyboard-inset أو interactive-widget. مسار البحث يستخدم data-autofocus.

**الإصلاح الجذري:**

عقد keyboard/IME يضمن بقاء الحقل وCTA ورسالة الخطأ مرئية، ويدير focus scroll وإغلاق اللوحة دون تحريك الخلفية.

## A3.7 R-03 — التركيز الأول على إجراء متلف

الحوار يضع autofocus على زر حذف نهائي. هذا ليس عيبًا WCAG مثبتًا، لكنه قرار أمان يحتاج مالكًا؛ التوصية هي الإلغاء أو العنوان/الوصف أولًا عند العملية غير القابلة للعكس، مع `aria-describedby` عند الحاجة.

## A3.8 D-01 — التفاف navbar إلى صفوف متعددة

الإرشادات العامة للمنصات تميل إلى 3–5 وجهات في الشريط السفلي وMore/rail عندما تزيد. الالتفاف يحافظ على النص لكنه يغير ارتفاع شريط تنقل أساسي.

**قرار المالك المطلوب:** سقف 3–5، More، أو adaptive rail/sidebar. إن كان الالتفاف للمعاينة العربية فقط، يجب فصله عن variant الإنتاج.

## A3.9 D-02 — appbar ثابت أم متكيف مع التمرير؟

m-appbar حاليًا static. ليس عيبًا إن كان هذا عقده، لكنه يحتاج تسمية `static appbar` أو variant opt-in للـcollapse.

## A3.10 D-03 — تكديس الطبقات والرجوع

الـstack يعمل برمجيًا، لكن لا توجد سياسة منتج: هل sheet فوق dialog؟ ماذا يفعل Back؟ كيف يُعلن stack لقارئ الشاشة؟ يجب وضع جدول حالات مسموحة.

## A3.11 ما لم يُختبر

- TalkBack/VoiceOver/NVDA.
- Safari/WebKit وSamsung Internet/WebView.
- هاتف فعلي ولمس وسحب وgesture navigation وcutout.
- keyboard الفعلية.
- native zoom.
- predictive back.
- أداء التمرير مع طبقات ثابتة كثيرة.

## A3.12 ترتيب الإصلاح

1. إصلاح tabpanel.
2. اختيار سياسة tabs overflow/More/الحد.
3. توحيد safe-area ownership مع harness موجب.
4. حسم سقف bottom nav وappbar وmodal stack/Back.
5. اختبار أجهزة وقارئات شاشة، مع فصل النتيجة عن Chromium.

---

# 7. تقرير الوكيل A4 — البيانات والرسوم والجداول وعروض المعلومات

- **المعرّف:** `data-visualization`
- **الحكم:** `CHANGES REQUIRED` قبل اعتماد المحور.
- **قاعدة المحور:** الرسوم عائلة نظامية، وليست رسمًا واحدًا.

## A4.1 نقاط القوة الحالية

- تحليل الرقم يميز الفارغ وغير الرقمي وNaN وInfinity والمجهول.
- bars/line يملكان حالات auto/ok/invalid/over ورفضًا صريحًا أو rescale معلنًا.
- الخط ينقطع عند الفجوة بدل الوصل الصامت.
- donut يفرق بين المقام غير الصالح والتعارض وعدم البيانات والإجمالي غير المعلوم والحالة الصفرية.
- metric-comparison يملك fallback نصيًا خارج الدائرة.
- order-schedule يوثق grid وroving tabindex وaria-selected/current.

## A4.2 D-01 — الرسم الطبيعي لا يقدم dataset دلاليًا كاملًا

**الأدلة:**

- `.m-chart__data[hidden] { display:none; }`.
- bars/line/donut تُنشئ SVG بـ`role=img` و`aria-label`.
- لا يوجد `aria-describedby` يربط summary المرئي.
- البيانات الكاملة مخفية في المعاينة.

**الأثر:**

مستخدم AT قد يحصل على اسم الرسم فقط، لا الفئات والقيم والحالات. وجود النص في DOM لا يضمن علاقة وصفية مرتبطة بالرسم.

**الإصلاح الجذري:**

ربط العنوان المرئي عبر `aria-labelledby`، وربط الوصف عبر `aria-describedby`، وإنشاء مسار dataset دلالي قابل للاكتشاف بدل hidden source فقط.

## A4.3 D-02 — غياب table/CSV/disclosure عام

لم يجد الوكيل نمط `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th>`, `<td>` أو `role=table` في العائلات والعينات المفحوصة. order-schedule grid وليس جدول بيانات.

**الأثر:**

لا يوجد مسار موحد للفرز والنسخ والمقارنة الدقيقة أو الوصول للبيانات عند كثافة النقاط.

**الإصلاح الجذري:**

إضافة Disclosure لجدول دلالي أو CSV حسب الكثافة والسيناريو، مع caption وthead/tbody وscope/headers عند استخدام جدول.

## A4.4 D-03 — عقد مقياس bubbles غير صادق

`data.js:773-781` يستبدل data-max غير الصالح تلقائيًا. `data.js:803-808` يحسب نصف القطر دون التحقق من أن vmax أكبر من أكبر قيمة.

مع `data-max=5` وقيمة 10 يصبح `r=Rmax×√2` ويتجاوز الحد المعلن. bars/line لديهما عقد رفض/rescale، أما bubbles فتتسامح بصمت.

**الإصلاح الجذري:**

تطبيق عقد A01 على bubbles: الغياب = auto موثق؛ invalid = رفض صريح؛ max أصغر من أكبر قيمة = refuse افتراضي أو rescale معلن؛ لا تجاوز صامت لـrmax.

## A4.5 D-04 — summary drift بعد تغيير البيانات

`data.js:862-880` يملأ الملخص فقط إذا كان فارغًا. عند إعادة التصيير وتغيير القيم قد يبقى النص يصف حالة سابقة.

**الإصلاح الجذري:**

إما تحديث summary من API في كل render، أو تعريف ملكية واضحة تجعل المستهلك يعيد كتابته بطريقة مرتبطة بالمصدر. لا يبقى وصف قديم مرتبطًا برسم جديد.

## A4.6 R-01 — تباين علامات البيانات غير مضمون

ألوان data الحالية تتضمن ألوانًا فاتحة على الأبيض بنحو 1.89:1 و2.28:1 و2.00:1. هذا لا يعوضه فحص النصوص، ولا توجد دائمًا outlines/separators/patterns للـmarks.

**الإصلاح الجذري:**

فحص العلامات مقابل الأسطح الفعلية، grayscale/forced-colors، وتحديد palette أو outlines/separators/patterns. يبقى النص والقيمة ترميزًا ثانويًا.

## A4.7 R-02 — الاسم المتاح لا يطابق العنوان المرئي

العنوان المرئي و`data-title` مختلفان في المعاينة، وaria-label يأخذ data-title بدل الإشارة إلى h3.

**الإصلاح الجذري:**

مصدر واحد لاسم الرسم، ويفضل `aria-labelledby` عندما يوجد عنوان مرئي.

## A4.8 R-03 — لا إعلان متاح عند إعادة التصيير

يوجد حدث `micro-data:rendered` داخلي، لكن لا توجد live region أو وصف مرتبط يتحدث عند filter/period change.

**الإصلاح الجذري:**

عقد تحديث اختياري واحد: تحديث description/summary وإعلان التغيير مرة واحدة دون ضجيج.

## A4.9 R-04 — قابلية استكشاف البيانات غير موجودة كأنماط جاهزة

لا توجد filter/sort/zoom/pan/pagination/CSV أو تحديد نقطة. هذا مقبول لعينة ثابتة صغيرة، لكنه فجوة إذا كان الهدف dashboard كثيفًا.

**قرار المالك:** تحديد B05 كرسوم ثابتة قصيرة فقط، أو اعتماد controls مشتركة للفرز والفلترة والتقسيم والبيانات البديلة.

## A4.10 R-05 — bubbles بلا grouping/accessibility contract واضح

بنية `m-bubbles` تعرض قيمة ودائرة وlabel دون aria-hidden للدائرة أو grouping/اسم واضح لكل عنصر. ليست عيبًا مثبتًا قبل AT، لكنها تحتاج عقدًا.

## A4.11 فجوات لم يذكرها المالك

1. غياب table/CSV كمسار أساسي.
2. عدم ربط title/summary بالرسم.
3. summary drift.
4. عدم اتساق عقد المقاييس بين bars/line وbubbles.
5. غياب ticks/scale context.
6. ألوان marks الفاتحة خارج فحص التباين المنشور.
7. غياب إعلان تغير البيانات لـAT.
8. غياب سياسة كثافة وأداء.
9. غياب نمط ثابت لأسماء الرسوم.
10. غياب اختبار شجرة وصول وقارئ شاشة فعلي.

## A4.12 قرارات المالك

- هل B05 ثابت أم dashboard قابل للاستكشاف؟
- هل الجدول البديل دائم أم عند الكثافة/التعقيد/الفشل؟
- هل palette الحالية مقبولة مع labels أم تحتاج threshold/outline/pattern؟
- من يملك تحديث summary عند تغير البيانات؟

## A4.13 ما لم يُختبر

VoiceOver/TalkBack/NVDA، شجرة الوصول، Safari/Samsung Internet/Firefox، لمس حقيقي، LTR فعلي، forced-colors، grayscale، آلاف النقاط، التغييرات السريعة، وResizeObserver تحت الضغط.

## A4.14 توصيات التنفيذ

1. عقد الوصول للرسم: title ID، aria-labelledby، aria-describedby، نوع ومحاور ونطاق ووحدة وحالات.
2. Dataset بديل: table أو disclosure أو CSV.
3. A01 على bubbles.
4. إصلاح summary drift.
5. ticks/units/range أو قرار موثق بأن labels بديل كافٍ.
6. فحص data marks في grayscale/forced-colors.
7. عقد تحديث AT اختياري.
8. grouping لكل bubble.
9. حد كثافة وأداء عند 100 و1000 نقطة على الأقل.

---

# 8. تقرير الوكيل A5 — الوصولية وRTL والتكبير والاستجابة

- **المعرّف:** `accessibility-rtl-responsive`
- **الحكم:** جيدة بنيويًا في RTL والتركيز وأهداف اللمس، لكنها تحتاج إصلاحات وقرارات قبل الاعتماد.
- **ملاحظة:** لم يُكتب تقرير فرعي مستقل لهذا الوكيل، لذلك حُفظت هنا النتيجة المنظمة كاملة كما سلّمها الوكيل.

## A5.1 نقاط القوة

- shared/tokens.css يعرّف هدف لمس 48px وحلقة تركيز 2px مع فجوة 2px.
- الأزرار والحقول والتنقل تستخدم الخصائص المنطقية وfocus-visible.
- B02 يعزل الأرقام LTR مع unicode-bidi:isolate وtabular-nums، ورسائل الحقول مرتبطة بـaria-describedby.
- طبقات الحوار تستخدم inset-inline وscroll داخلي وaria-modal وحصر التركيز واستعادة المشغل.
- التقويم يعلن استثناء الخلايا الصغيرة بينما تبقى البدائل والأفعال الأخرى أكبر.
- فحوص Chromium تثبت مسارات reflow محددة، لا native zoom أو جهازًا.

## A5.2 A5-01 — غياب forced-colors وprefers-contrast وdark contract

لا توجد قواعد واضحة لهذه السياقات. ألوان التوكنز الحالية لا تثبت بقاء التركيز والحدود والحالات في High Contrast أو إعدادات تباين الهاتف.

**الإصلاح الجذري:**

قرار نطاق رسمي. إذا كان الدعم مطلوبًا، أضف طبقة tokens سياقية واختبارات forced-colors/prefers-contrast/grayscale، ولا تعتمد على اللون وحده.

## A5.3 A5-02 — تعريف 200% غير موحد مع native zoom وDynamic Type

معظم الأحجام px. محاكاة font-size×2 ليست native browser zoom ولا Dynamic Type.

**الإصلاح الجذري:**

تعريف scaling contract منفصل: browser zoom، text preference، Android font scale، iOS Dynamic Type. استخدم rem/em حيث يلزم أو وثّق سبب px، ثم ابنِ matrix قبول لكل طبقة.

## A5.4 A5-03 — دلالة busy غير مكتملة

buttons.js يستخدم aria-busy ويمنع التفعيل مع إبقاء التركيز، لكنه لا يثبت أن AT يعرف أن الزر محجوز أو أن المظهر يطابق الحالة.

**الإصلاح الجذري:**

عقد busy/pending يحدد aria-disabled أو semantics المناسبة، focus retained، الإعلان، وحراسة pointer/keyboard، مع اختبار NVDA/VoiceOver/TalkBack.

## A5.5 A5-04 — غلاف نتائج المثال يخرق reflow

القياس سجل `document.scrollWidth=359` مقابل `clientWidth=320` عند 320+200%، والسبب #results/‏PRE في صفحة المثال لا مكوّن الحقل.

**الإصلاح الجذري:**

إصلاح غلاف النتائج بـoverflow-wrap:anywhere أو بنية قابلة للالتفاف، ثم إعادة فحص المصدر والstandalone. لا تضع رقعة داخل B02.

## A5.6 A5-05 — native date والـlocale العربي

تظهر صيغة `mm/dd/yyyy` الإنجليزية داخل نموذج عربي في لقطة Chromium. هذا يختلف باختلاف Chrome/Safari/Samsung Internet.

**الإصلاح الجذري:**

قرار localization/platform contract للـinput[type=date]، ثم اختبار Android/iOS بالـArabic locale، وتوثيق ما يبقى native وما يستبدل بمكوّن مخصص.

## A5.7 A5-06 — لوحة المفاتيح وvisual viewport

لا توجد مصفوفة فعلية لـvisualViewport أو keyboard resize أو dvh أو scrollIntoView مع لوحة النظام. قد تُغطى الطبقات والحقول على جهاز حقيقي.

**الإصلاح الجذري:**

عقد keyboard/IME يشمل العنصر النشط وCTA ورسالة الخطأ وfocus scroll وإرجاع الحالة بعد الإغلاق، مع اختبار iOS Safari وAndroid Chrome/Samsung Internet.

## A5.8 A5-07 — استثناء شبكة الشهر

خلية الشهر تقارب 37.7px عند 320px. المواصفة تعلن الاستثناء وتوفر مسارات بديلة وأفعالًا أكبر؛ لا يصح تسميته عيبًا مخفيًا ولا ادعاء 48px لكل شبكة.

**قرار المالك:** إبقاء الشبكة مع جعل قائمة/عرض اليوم المسار الأساسي عند العرض الضيق، أو إعادة تصميم الشبكة/حجمها.

## A5.9 A5-08 — RTL/LTR والأرقام والتواريخ المختلطة

وجود dir=rtl والخصائص المنطقية لا يثبت كل مسارات back/next/Home/End ولا مزج العربية والإنجليزية وISO والأرقام المحلية على Android/iOS.

**الإصلاح الجذري:**

مصفوفة RTL/LTR، نص عربي طويل، أرقام ومبالغ وتواريخ مختلطة، اتجاهات الحركة، لوحة مفاتيح، وقارئ شاشة.

## A5.10 الفجوات غير المذكورة

- forced-colors/prefers-contrast.
- عقد scaling.
- busy semantics.
- overflow-wrap في غلاف نتائج الاختبار.
- native date locale.
- keyboard/visual viewport.
- قرار calendar cell 37.7px.
- اختبار touch/AT/Safari/Samsung Internet.

## A5.11 التوصيات

1. أصلح غلاف #results فقط بعد عزله.
2. أضف forced-colors/prefers-contrast أو سجلهما خارج النطاق بقرار.
3. وحّد busy/pending semantics واختبرها سمعيًا.
4. اختبر native date وDynamic Type وfont scale ولوحة المفاتيح على Android/iOS.
5. سجّل قرار شبكة الشهر.
6. لا تغلق محور الوصولية بنتائج headless فقط.

---

# 9. تقرير الوكيل A6 — Web-Native وPWA وقيود الهاتف

- **المعرّف:** `web-native-pwa`
- **الحكم:** مناسب كمعاينات ويب محلية/ملف مستقل، وليس PWA قابلة للتثبيت أو Web-Native إنتاجيًا.

## A6.1 الحالة الحالية

- README وhandoff يصفان الناتج كمكتبة ومعاينات لا اعتمادًا إنتاجيًا.
- F03 عينة هاتف مستقلة، و`standalone.html` ملف HTML مضمن يعمل عبر `file://`.
- صفحات المعاينة تملك `meta viewport` جيدًا ولا تستخدم `user-scalable=no`.
- F03 يستخدم عمودًا بحد أقصى 560px، حشوًا أفقيًا، التفافًا للنص، وأهداف لمس من توكن المشروع.
- bottom navbar يستخدم safe-area bottom، والحشو السفلي يعتمد على ارتفاع navbar مقيسًا عبر ResizeObserver.
- فحوص Chromium أثبتت 46/46 مسارًا و207 تحقيقات وصفر أخطاء في جولة F03، لكن الحدود معلنة.
- Probe محلي وجد `scrollWidth == innerWidth` عند 320/390/430 للمصدر والstandalone، لكنه وجد `manifest=null`.

## A6.2 F-PWA-001 — لا يوجد عقد PWA قابل للتثبيت

لا توجد ملفات `*.webmanifest` أو service worker، ولا `rel=manifest` أو `navigator.serviceWorker` أو `beforeinstallprompt`.

**الحكم:**

حد نطاق مقصود إذا كان الهدف معاينات UI فقط، لكنه مانع تثبيت إذا كان الهدف PWA.

**الإصلاح الجذري عند اعتماد PWA:**

إنشاء manifest وربطه بكل entrypoint، وإضافة name/short_name/icons/start_url/display/scope/theme/background/lang/dir/orientation، ثم service worker بـinstall/activate/fetch وoffline/update/versioning.

## A6.3 F-PWA-002 — عدم اتساق metadata

`theme-color` موجود في فهرس المكتبة فقط. لا توجد icons أو start_url أو display أو scope أو orientation أو apple-touch-icon في F03/standalone.

**الإصلاح الجذري:**

حزمة metadata موحدة لكل entrypoint، مع أيقونات 192/512 وmaskable safe zone مرتبطة فعليًا بالmanifest.

## A6.4 F-MOBILE-001 — safe-area علوية غير معالجة

الكود يعالج bottom safe-area في navbar/foot، لكن appbar والمحتوى العلوي يستخدمان حشوًا ثابتًا بلا safe-area top.

**الحكم:**

فجوة تصميمية يجب إغلاقها قبل ادعاء edge-to-edge، لكنها ليست إعادة إنتاج جهاز مثبتة لأن viewport-fit/standalone/iPhone/Samsung لم تُختبر.

## A6.5 F-MOBILE-002 — لا سياسة keyboard/interactive viewport

لا يوجد `interactive-widget`, `visualViewport`, `keyboard-inset-*` أو scrollIntoView. لا عقد يضمن بقاء الحقل وCTA فوق لوحة المفاتيح.

**الإصلاح الجذري:**

تعريف keyboard contract واختباره على Android/iOS، مع focus scroll وإدارة visual viewport وdvh عند الحاجة.

## A6.6 F-NAV-001 — state.view بلا URL/history/deep-link

الحالة تُدار كمتغير JS داخلي مع أزرار رجوع. لا يوجد history.pushState/replaceState/popstate.

**الأثر:**

في PWA قد يخرج Back من التجربة أو يعيد البوابة بدل الرجوع من التفاصيل إلى القائمة.

**الإصلاح الجذري:**

اعتماد route/history contract أو توثيق عدم دعم deep links، ثم اختبار reload وAndroid Back وiOS swipe-back وfocus restoration.

## A6.7 F-ADAPT-001 — نفس العمود وbottom nav على النوافذ الواسعة

العمود محدود بـ560px، ولا توجد rail/drawer/multi-pane أو viewport-segment logic.

**قرار المالك:**

Compact-only مع non-goal واضح، أو Responsive PWA يتكيف مع Medium/Expanded/Foldable.

## A6.8 F-TOUCH-001 — 48 CSS px ليست شهادة 48dp/44pt

48px قرار ويب داخل النظام، لكنه ليس معايرة dp/pt ولا اختبار لمس إصبع أو إيماءات النظام.

**الإصلاح الجذري:**

معيار قبول منفصل لكل منصة واختبار لمس حقيقي.

## A6.9 F-ARIA-001 — semantics موجودة لكن قارئات الشاشة المحمولة غير مثبتة

توجد role=dialog وaria-modal وaria-labelledby وinert وإرجاع focus، لكن TalkBack/VoiceOver غير منفذين.

**الحكم:**

عدم اختبار، وليس عيب ARIA جديدًا مثبتًا دون اختبار سمعي.

## A6.10 F-OFFLINE-001 — standalone bundling ليس offline PWA

standalone.html يضمن تضمين الأصول، وdemo-store يستخدم localStorage/fallback، لكن لا يوجد caching أو update أو recovery أو service worker.

**الحكم:**

الوصف صادق لعينة file://، لكن لا يجوز تسميتها offline PWA.

## A6.11 فجوات A6 غير المذكورة

1. غياب عقد PWA نفسه.
2. عدم اتساق metadata بين الصفحات.
3. safe-area العلوية غائبة مقابل السفلية.
4. غياب عقد keyboard/interactive viewport.
5. غياب URL/history/deep-link contract.
6. غياب breakpoint strategy لـFoldable/Tablet.
7. غياب cache versioning/update prompt/offline fallback.
8. غياب أيقونة PWA مهيأة 192/512/maskable.

## A6.12 مصفوفة قبول A6

| الاختبار | معيار القبول | الحالة الحالية |
|---|---|---|
| manifest/link/icons | manifest صالح و192/512 وstart_url/display/scope | غير موجود |
| service worker | activated ويتحكم في shell ويعمل offline بعد زيارة أولى | غير موجود |
| 320/390/430 reflow | لا قص/فيض على جهاز فعلي | Chromium PASS؛ الجهاز غير مختبر |
| top/bottom safe areas | لا overlap مع notch/gesture/nav | غير مختبر |
| keyboard | الحقل ورسالة الخطأ وCTA تبقى مرئية | غير مختبر |
| back/deep link | تفاصيل ← قائمة وطبقة ← مشغل وreload حسب العقد | لا contract |
| dynamic text | native font scale/Dynamic Type بلا قص | محاكاة ×2 فقط |
| AT | dialog names/roles/live/swipe order | غير مختبر |
| Medium/Expanded | rail/drawer/multi-pane أو compact-only موثق | قرار مالك |

---

# 10. التركيب الجذري عبر الوكلاء / Cross-Agent Root Causes

## RC-01 — غياب عقد هندسة شامل

التوكنز موجودة، لكن bounding boxes، الفصل، ملكية الارتفاع، overflow، safe-area، keyboard، وتغير النافذة لا تملك عقدًا موحدًا. لذلك تظهر مشاكل tabs/navbar/charts/gallery/layers كأعراض متفرقة.

## RC-02 — الدلالة موزعة بين الطبقات

JS قد يحرس حالة أو تركيزًا، CSS لا يعكسها، والمستهلك يضيف role/label يدويًا. الإصلاح الجذري يحتاج API/validator يملك semantics.

## RC-03 — لا يوجد قرار واضح لنطاق المنصة

المستودع يخدم معاينات Compact، بينما الهدف العام Web App قابل للتثبيت على Android/iOS. غياب قرار PWA وMedium/Expanded وkeyboard/history يمنع إغلاق التصميم.

## RC-04 — البيانات تُعامل كرسوم قبل أن تُعامل كمعلومة

SVG والحسابات جيدة جزئيًا، لكن الجدول والوصف والتحديث والكثافة والمحاور والترميز غير اللوني ليست عقودًا مشتركة.

## RC-05 — غياب حوكمة الاستثناءات

القيم الصلبة، namespaces الخاصة، gallery scales، calendar exception، و40px visual control تحتاج مالكًا وسببًا واختبارًا.

## RC-06 — حدود الإثبات غير مفصولة

`PASS Chromium`, `PASS reflow`, `PASS device`, `PASS AT`, و`PASS PWA` يجب أن تكون طبقات منفصلة. خلطها يجعل النظام يبدو مكتملًا قبل اختبار المنصة الحقيقية.

---

# 11. حزمة تسليم الإصلاح إلى Z AI / Z AI Repair Handoff

## 11.1 شروط التنفيذ الجذري

1. ابدأ من السبب الجذري والطبقة المالكة، وليس من اللقطة التي يظهر فيها العرض.
2. أعد النظر في العقد والـAPI والـtokens عندما تكون هي سبب المشكلة.
3. اسمح بإعادة بناء المكوّن أو التكوين أو API؛ لا توجد بيانات أو مستخدمون أو توافق قديم يجب حمايته.
4. لا تستخدم Micro القديم أو ملفاته أو لقطاته أو تصميمه كمرجع.
5. لا تعدّل الملفات المولدة يدويًا.
6. حدّث المصدر والمواصفة والاختبار والمعاينة والدليل في نفس الإصلاح.
7. اذكر `commit/head` والبيئة والviewport وRTL/LTR والتكبير.
8. لا تحسم قرارات المالك بصمت.

## 11.2 موجات الإصلاح

| الموجة | الهدف | البنود الأساسية | مخرج Z AI |
|---|---|---|---|
| Wave 0 — Scope | حسم عقد المنتج | PWA أم preview؛ Compact أم responsive؛ history/back؛ dark/contrast | قرارات موثقة |
| Wave 1 — Geometry/Navigation | إزالة الانهيارات النظامية | A1-F01؛ A3-F01/F02/F03؛ A1-F02/F04؛ safe-area ownership؛ tabs/navbar/appbar | مصدر + spec + probes + screenshots |
| Wave 2 — Semantics/States | جعل الدلالة مملوكة وقابلة للتحقق | A2-F01/F03/F04/F05؛ A2-F08؛ A5-F03؛ live/busy/dialog | API/validator + AT-ready tests |
| Wave 3 — Data | تحويل الرسم إلى معلومة قابلة للوصول | A4-D01..D04؛ R01..R05؛ table/CSV؛ scale؛ summary؛ axes | Chart/Data contract + fixtures + fallbacks |
| Wave 4 — Runtime | إغلاق فجوات الهاتف والويب | A5-F02/F05/F06؛ A6-PWA؛ keyboard؛ history؛ safe-area top؛ adaptive | PWA/runtime layer + device matrix |
| Wave 5 — Evidence | إثبات حقيقي منفصل الطبقات | Chromium/WebKit/device/touch/AT/PWA/forced-colors | Acceptance pack with provenance |

## 11.3 تعريف إنجاز الإصلاح

- لا يكفي أن تختفي اللقطة السيئة؛ يجب أن يختفي سببها في كل مستهلك مشابه.
- لا يكفي اختبار واحد؛ يجب تغطية 320/360/390/430 وRTL/LTR والنص الطويل والتكبير والحالات.
- لا يكفي وجود ARIA attributes؛ يجب اختبار التركيز والاسم والوصف وترتيب القراءة وتحديث الحالة.
- لا يكفي أن يعمل الرسم بصريًا؛ يجب وجود قراءة بديلة وبيانات قابلة للاستكشاف عند الحاجة.
- لا يكفي وجود standalone.html؛ إذا اختير PWA فلابد من manifest/service worker/install/offline/update واختبار فعلي.
- إذا أُخرج بند من النطاق، يجب أن يكون القرار مكتوبًا.

---

# 12. بوابة قبول الإصلاحات / Root-Cause Acceptance Gates

| الفئة | بوابة القبول |
|---|---|
| Source integrity | كل الإصلاحات من المصدر الحالي؛ لا تعديل يدوي للمولد؛ التقرير يذكر commit والملفات. |
| Geometry | لا overflow غير مقصود في 320/360/390/430؛ قياس bounding boxes والفواصل؛ لا قص أو تداخل عند التكبير. |
| Navigation | tabpanel تصل إليها Tab؛ tabs لها سياسة overflow؛ navbar/appbar/actionbar لها مالك ارتفاع واحد؛ Back/stack موثقة. |
| States & semantics | disabled/aria-disabled متطابقان؛ dialog/message roles وnames/descriptions مملوكة أو validator يفشل؛ live burst مختبر. |
| Data | title/summary مرتبطان؛ summary يتحدث؛ invalid scale معلن؛ table/CSV/disclosure موجود عند الحاجة؛ palette وnon-color encoding مختبران. |
| RTL & language | RTL/LTR، العربية/الإنجليزية، الأرقام والتواريخ المختلطة، Home/End/back/next مختبرة. |
| Keyboard & insets | CTA والحقل والخطأ تظل مرئية مع لوحة النظام؛ safe-area top/bottom/inline لا تتكرر؛ root scroll يعمل. |
| PWA | إذا كان داخل النطاق: manifest، icons، HTTPS، service worker، offline/update/install، start_url/scope/display، lang/dir. |
| Evidence | Chromium/WebKit/device/touch/AT/PWA نتائج منفصلة؛ لا يُرفع PASS محاكى إلى شهادة جهاز. |

---

# 13. قرار الإغلاق الحالي

الرأس الحالي لا يُغلق كنظام جاهز للإصلاحات النهائية بعد. التصنيف الصحيح هو:

> **CHANGES REQUIRED — Diagnostic Baseline for Root-Cause Repair**

هذا ليس رفضًا للاتجاه؛ بل تثبيت لنقاط الإصلاح الجذري قبل البناء فوقها. بعد تنفيذ Z AI للموجات، يجب إنشاء تقرير مراجعة جديد على الرأس الجديد فقط، مع تحديث هذا المرجع إلى نسخة أحدث واحدة عند اعتماد الجولة التالية.

---

# 14. فهرس الأدلة الحالية

- `shared/tokens.css`
- `components/navigation/navigation.css`
- `components/navigation/navigation.js`
- `components/selection/selection.css`
- `components/selection/selection.js`
- `components/data/data.css`
- `components/data/data.js`
- `previews/index.css`
- `previews/navigation/index.html`
- `previews/ux-patterns/mobile-record-sample/index.html`
- `previews/ux-patterns/mobile-record-sample/example.css`
- `previews/ux-patterns/mobile-record-sample/example.js`
- `previews/ux-patterns/mobile-record-sample/standalone.html`
- `docs/UI-PLATFORM-NOTES.md`
- `docs/UI-VISUAL-SYSTEM.md`
- `audit-agent-output/00-system-synthesis.md`
- `audit-agent-output/01-foundation-geometry.md`
- `audit-agent-output/02-components-states.md`
- `audit-agent-output/03-composition-navigation.md`
- `audit-agent-output/04-data-visualization.md`
- `audit-agent-output/06-web-native-pwa.md`

---

## المصادر الرسمية التي استندت إليها تقارير الوكلاء

- [W3C WCAG 2.2 — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C WCAG 2.2 — Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [Material Design 3](https://m3.material.io/)
- [Android Developers](https://developer.android.com/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Samsung One UI](https://developer.samsung.com/one-ui/)
- [MDN](https://developer.mozilla.org/)
- [web.dev Learn PWA](https://web.dev/learn/pwa/)
- [Carbon Charts](https://charts.carbondesignsystem.com/)
- [Fluent UI Charting](https://microsoft.github.io/fluentui-charting-contrib/docs/Overview)


## ملحق الوكيل A5 — تفصيل منظم كامل

### نطاق الفحص

راجع الوكيل التوكنز، الأزرار، الحقول، التنقل، التقويم، info-strip، المعاينات، لقطات التكبير، وملاحظات المنصة. طبّق قاعدة 20/80، ولم يستخدم Micro القديم.

### نقاط القوة

- هدف لمس 48px وحلقة تركيز 2px مع فجوة 2px.
- استخدام الخصائص المنطقية وfocus-visible.
- عزل الأرقام LTR مع unicode-bidi:isolate وtabular-nums.
- ربط رسائل الحقول بـaria-describedby.
- طبقات الحوار تستخدم inset-inline وscroll داخلي وaria-modal وحصر التركيز واستعادة المشغل.
- استثناء شبكة الشهر موثق بدل إخفائه.

### A5-01 — forced-colors وprefers-contrast وdark

لا توجد قواعد واضحة لهذه السياقات. ألوان التوكنز الحالية لا تثبت بقاء التركيز والحدود والحالات في High Contrast.

**الإصلاح الجذري:** قرار نطاق رسمي؛ إن كان الدعم مطلوبًا، طبقة tokens سياقية واختبارات forced-colors/prefers-contrast/grayscale، دون اعتماد على اللون وحده.

### A5-02 — 200% ليس native zoom أو Dynamic Type

معظم الأحجام px. محاكاة font-size×2 ليست native browser zoom ولا Android font scale ولا iOS Dynamic Type.

**الإصلاح الجذري:** scaling contract منفصل لكل بيئة، استخدام rem/em حيث يلزم أو توثيق px، وبناء matrix قبول مستقلة.

### A5-03 — busy semantics غير مكتملة

aria-busy يمنع التفعيل مع إبقاء التركيز، لكنه لا يثبت أن قارئ الشاشة يعرف أن الزر محجوز أو أن المظهر يطابق الحالة.

**الإصلاح الجذري:** busy/pending contract يحدد aria-disabled أو semantics المناسبة، focus retained، الإعلان، والحراسة، مع اختبار NVDA/VoiceOver/TalkBack.

### A5-04 — غلاف نتائج المثال يخرق reflow

عند 320+200% سجلت الصفحة `scrollWidth=359` مقابل `clientWidth=320`، والسبب `#results`/`PRE` داخل صفحة المثال، لا B02.

**الإصلاح الجذري:** إصلاح الغلاف بـoverflow-wrap:anywhere أو بنية قابلة للالتفاف، ثم إعادة الفحص من المصدر والstandalone، دون رقعة داخل المكوّن.

### A5-05 — native date والـlocale العربي

يظهر placeholder إنجليزي `mm/dd/yyyy` داخل نموذج عربي في Chromium. هذا يختلف حسب Chrome/Safari/Samsung Internet.

**الإصلاح الجذري:** localization/platform contract للـinput[type=date]، واختبار Arabic locale على Android/iOS، وتوثيق ما يبقى native وما يصبح مكوّنًا مخصصًا.

### A5-06 — لوحة المفاتيح وvisual viewport

لا توجد معالجة موثقة لـvisualViewport أو keyboard resize أو dvh أو scrollIntoView مع لوحة النظام.

**الإصلاح الجذري:** keyboard/IME contract يضمن بقاء العنصر النشط وCTA ورسالة الخطأ مرئية، مع focus scroll وإرجاع الحالة.

### A5-07 — استثناء شبكة الشهر

خلية الشهر تقارب 37.7px عند 320px. المواصفة تعلن الاستثناء وتوفر بدائل، لذلك لا يصح تسميته عيبًا مخفيًا.

**قرار المالك:** إبقاء الشبكة مع جعل القائمة/عرض اليوم المسار الأساسي عند الضيق، أو إعادة تصميم الشبكة.

### A5-08 — RTL/LTR والأرقام والتواريخ المختلطة

dir=rtl والخصائص المنطقية لا يثبتان كل back/next/Home/End ولا المزج بين العربية والإنجليزية وISO والأرقام المحلية.

**الإصلاح الجذري:** matrix RTL/LTR، نص عربي طويل، أرقام ومبالغ وتواريخ مختلطة، اتجاهات الحركة، لوحة مفاتيح، وقارئ شاشة.

### فجوات إضافية لم يذكرها المالك

- forced-colors/prefers-contrast.
- scaling contract.
- busy semantics.
- overflow-wrap في غلاف نتائج الاختبار.
- native date locale.
- keyboard/visual viewport.
- قرار calendar cell 37.7px.
- اختبار touch/AT/Safari/Samsung Internet.

### توصيات الوكيل

1. إصلاح غلاف #results فقط بعد عزله.
2. إضافة forced-colors/prefers-contrast أو تسجيلهما خارج النطاق.
3. توحيد busy/pending semantics واختبارها سمعيًا.
4. اختبار native date وDynamic Type وfont scale ولوحة المفاتيح على Android/iOS.
5. تسجيل قرار شبكة الشهر.
6. عدم إغلاق محور الوصولية بنتائج headless فقط.

---

# 15. النص الكامل لمخرجات الوكلاء / Full Agent Output Appendix

هذا الملحق يحفظ مخرجات الوكلاء كما كُتبت في ملفات التدقيق، لتكون قابلة للرجوع عند تنفيذ Z AI.


## A1 — الأساسات والهندسة البصرية: النص الأصلي للتقرير

# تدقيق محور الأساسات والهندسة البصرية

- **المعرّف:** `foundation-geometry`
- **النطاق:** الأساسات، المقاييس، المسافات، أحجام أهداف اللمس، الانسياب، التكيّف مع حجم النص/العرض، مناطق الأمان، وتركيب التبويبات/الأشرطة.
- **الحالة:** **CHANGES REQUIRED محدود**؛ الأساس العام منضبط وقابل للمراجعة، لكن هناك عيب reflow مثبت في تبويبات B07، وانحراف هندسي مثبت في هامش المعرض، وفجوات تعاقدية لم تُحسم على مستوى safe-area/الاتجاه/الأجهزة الأوسع.
- **الملكية:** لم أعد استخدام Micro القديم ولم أقارنه به. ذُكرت عائلة البيانات/Chart فقط بوصفها جزءًا من المعرض؛ لم يُحصر التدقيق فيها.
- **التغيير على المصدر:** لم أعدّل أي ملف مصدر.

## خلاصة الحكم

النظام يملك نواة جيدة: مصدر توكنات واحد، خصائص CSS منطقية في المكونات الأساسية، حد لمس محافظ 48px، ارتفاعات دنيا بدل الارتفاعات الجامدة، `meta viewport`، وتجارب/لقطات تعترف صراحة بأن Chromium ليس جهازًا فعليًا. هذا يخفض مخاطر الفجوة بين التصميم والتنفيذ.

لكن قبول محور الهندسة لا يُغلق بعد:

1. **عيب مثبت:** `m-tabs` لا يعيد التدفق عند تكبير النص. عند 320/360/390 CSS px مع محاكاة نصية صحيحة 200% خرجت الصفحة إلى `scrollWidth=412`، ووصل تبويب `المكتملة` إلى `left=-8.5px` داخل عينة B07. هذا ليس مجرد قرار بصري؛ إنه تجاوز أفقي قابل لإعادة الإنتاج في التركيب الحالي.
2. **عيب/انحراف عقد مثبت:** وثيقة النظام تفرض هامش 20px من عرض 390 فأعلى، لكن `previews/index.css` يفرض 16px على كل عرض حتى 700px، بما في ذلك 390 و430.
3. **قرار بصري غير موثق:** غلاف المعرض يستخدم سلم عرض أكبر بكثير من سلم الأدوار المعتمد للمكونات (عنوان 38–72px، وعنوان قسم 27px)، ويستخدم مسافات 14/15/42px خارج السلم المشترك. قد يكون ذلك مقصودًا لغلاف المعرض، لكنه يحتاج توكنات/استثناءً معلنًا حتى لا يصبح مرجعًا بصريًا منافسًا.
4. **فجوة نظامية:** هدف 48px موثق، لكن لا توجد قاعدة قابلة للقياس للمسافة بين الأهداف أو لديناميكية ارتفاع الشريط السفلي عند التفافه، ولا عقد عامة لسلوك landscape/foldable وsafe-area الجانبية.
5. **غير مختبر:** native browser/system zoom، Safari/WebKit، Samsung Internet، هاتف فعلي ولمس فعلي، لوحة مفاتيح هاتف حقيقية، safe areas فعلية، TalkBack/VoiceOver، واتجاهات/أحجام نوافذ غير الهاتف العمودي.

## منهج الفحص والأدلة

- قرأت الملفات المحددة، ثم قرأت CSS/HTML/JS للمكونات المرتبطة بالهندسة عند الحاجة.
- راجعت بصريًا اللقطات: `reviews/B01/screenshots/01-overview-390-full.png`، `19-text-zoom-200-320.png`، `reviews/B02/screenshots/12-zoom-200-320.png`، `reviews/B04/screenshots/00-overview-390-full.png` و`06-zoom-200-320.png`، `reviews/B07/screenshots/00-overview-390-full.png` و`01-appbar-tabs-390.png` و`05-zoom-200-320.png`، و`reviews/CAROUSEL/screenshots/18-width-320.png`.
- شغّلت قياسًا محليًا مستقلًا على Chromium النظامي (`/usr/bin/chromium`) بعروض 320/360/390/430. محاكاة 200% استُخدمت بمرورين: قراءة الأحجام المحسوبة أولًا ثم تطبيق الضرب، حتى لا تتضاعف الأحجام بالوراثة. هذا **اختبار reflow نصي في Chromium فقط**، وليس native zoom ولا شهادة جهاز.
- القياس التفصيلي لتبويبات B07 محفوظ في سجل الجلسة: `audit-session-output/2026-10-08_19-08-12_287491_1154.txt`، والنتيجة المختصرة في `audit-session-output/2026-10-08_19-07-51_255511_1154.txt`.

## النتائج المصنفة

### F-01 — عيب مثبت: تبويبات المحتوى تكسر reflow عند 200%

**التصنيف:** عيب مثبت، أولوية P1 للمكون/التركيب.

**الأدلة المحلية:**

- `components/navigation/navigation.css:49-73`: `.m-tabs` هو `display:flex` دون `flex-wrap` أو سياسة تمرير/تراص، وكل `.m-tabs__tab` يحتفظ بحشو inline 16px و`min-height:48px`.
- `previews/navigation/index.html:49-52`: تبويبا «النشطة» و«المكتملة» داخل `role=tablist` حقيقي.
- القياس في 320 + نص 200%:
  - `.m-tabs`: `left=65`, `right=255`, `width/clientWidth=190`, لكن `scrollWidth=263`.
  - `#tab-b-btn` («المكتملة»): `left=-8.5`, `right=127.2`, `width=135.7`.
  - الصفحة: `scrollWidth=412` مقابل `clientWidth=320`.
- تكرر تجاوز الصفحة عند 360 و390 (`scrollWidth=412`)، بينما 430 عاد بلا تجاوز في هذا المثال.

**الأثر:** النص لا يبقى ضمن الحيز الأفقي عند تكبيره؛ قد يُقطع من جهة البداية أو يفرض تمريرًا أفقيًا ثنائي الاتجاه. نجاح اللقطة `reviews/B07/screenshots/05-zoom-200-320.png` في ترتيب الهاتف المعروض لا يغلق هذا السيناريو لأنه لا يثبت كل تركيب tablist ولا native zoom.

**المقارنة الرسمية:**

- [WCAG 2.2 — Reflow 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) يطلب عرض المحتوى دون فقد معلومات أو تمرير ثنائي الأبعاد عند عرض يعادل 320 CSS px، باستثناء التركيبات ذات البعدَين الضروريين للمعنى.
- [Material Accessibility](https://m2.material.io/design/usability/accessibility.html) يطلب تخطيطات مرنة تستوعب تغير العرض والخط ولا تقص المحتوى.
- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) يوصي بأن تتحول العناصر المتجاورة أفقيًا إلى تراص رأسي أو أن تنمو الصفوف عند Dynamic Type.
- [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) يثبت عقد `tablist/tab/tabpanel` والأسهم والارتباطات؛ لكنه لا يبرر كسر الهندسة، لذلك الإصلاح يجب أن يحافظ على العقد السلوكية مع معالجة الحيز.

**الإجراء:** اختر أحد أنماط reflow المعلنة: `flex-wrap` مع نمو ارتفاع الصف، أو نمط تراص عند ضيق الحاوية، مع `min-inline-size:0`/سلوك التفاف واضح للعناوين. لا تستخدم قصًا أو تصغيرًا تلقائيًا. اختبر كل tablist طويل عند 320/360/390/430 مع 200%، وأثبت أن كل هدف يبقى قابلًا للرؤية واللمس وأن التبويب/السهم/`aria-controls` لم تتأثر.

### F-02 — عيب مثبت: هامش المعرض يخالف عقد 390px+

**التصنيف:** عيب عقد/اتساق هندسي مثبت، أولوية P2.

**الأدلة المحلية:**

- `UI-VISUAL-SYSTEM.md:21-23` و`docs/foundations/Micro-UI-Foundations-V1.md:135-145`: السلم يقرر 16px للشاشات الأصغر من 390 و20px من 390 فأعلى.
- `previews/index.css:16,32` يضع العرض الأساسي على `100% - 40px` (هامش 20px)، لكن `previews/index.css:95-97` يطبق عند `max-width:700px` `width:calc(100% - 32px)` على `.library-head__inner,.library-main,.library-footer`. النتيجة 16px يمينًا ويسارًا عند 390 و430، لا 20px.

**الأثر:** المعرض نفسه، وهو المرجع المرئي المباشر، لا يعكس قاعدة الأساس التي يُفترض أن تُقاس عليها التركيبات. الانحراف صغير لكنه يغيّر عرض النص، التفاف العناوين، وموضع البطاقات عند أكثر مقاسين موثقين.

**الإجراء:** اجعل breakpoint للهامش عند `389.98px` بدل `700px`، أو عرّف توكن/استثناء صريح لغلاف المعرض. أعد تصوير 390 و430 بعد الإصلاح، ولا تخلط بين هامش غلاف المعرض وهامش المنتج دون تسمية.

### F-03 — قرار بصري يحتاج توثيقًا: غلاف المعرض خارج سلم النوع والمسافات

**التصنيف:** قرار بصري، ليس عيب وصول بذاته.

**الأدلة المحلية:**

- العقد المعتمد يذكر في `UI-VISUAL-SYSTEM.md:21` و`Micro-UI-Foundations-V1.md:118-127`: صفحة 22/32، قسم 18/28، نص 16/26، مساعدة 14/22، ثانوي 13/20.
- `previews/index.css:21` يحدد عنوان المعرض `clamp(38px,8vw,72px)` مع line-height 1.13، ويعيد في `:98` الحجم 46px للهاتف.
- `previews/index.css:39` يحدد عنوان القسم 27px/1.4، و`:52-53` عنوان العائلة 19px/1.5.
- `previews/index.css:33,43,49,54,85` يستخدم 14/18/15/5/42px في padding/gap، بينما السلم المشترك في `shared/tokens.css:53-61` هو 4/8/12/16/20/24/32/40.

**الحكم:** يجوز أن يكون للـlibrary shell سلم عرض/عرض تقديمي مستقل، لكن لا يوجد في الملفات المحددة توكن أو فقرة صريحة تفصل «هوية غلاف المعرض» عن أدوار المنتج. إبقاؤه بلا تسمية يجعل اللقطة المرجعية تبدو وكأنها معيار لكل شاشة.

**الإجراء:** إمّا تعريف `--micro-gallery-display-*` و`--micro-gallery-space-*` في نطاق المعرض وتوثيق أنه غير قابل للتعميم، أو إعادة الغلاف إلى سلم الأدوار. لا أطلب قرارًا جماليًا من المراجع؛ أطلب تسجيل القرار وحدوده.

### F-04 — فجوة غير مذكورة: حجم الهدف مضبوط، لكن تباعد الأهداف غير مقنن

**التصنيف:** فجوة نظامية/خطر محتمل، لا فشل WCAG مثبت.

**الأدلة المحلية:**

- `shared/tokens.css:63-71` يضع 48px للأهداف والأزرار والأيقونات.
- `components/fields/fields.css:148-153` يضع `.m-field__stepper { gap:4px; }` بين زري الزيادة والنقصان، رغم أن كل زر 48px من B01.
- `previews/index.css:54-55` يضع روابط المعرض ذات `min-height:48px` مع `gap:5px 16px`، أي مسافة رأسية 5px.

**المقارنة الرسمية:**

- Material يوصي 48dp للهدف و8dp فصلًا في معظم الحالات.
- [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) يحدد 24×24 CSS px أو تباعدًا مكافئًا مع استثناءات؛ لذلك 48px هنا قرار مشروع محافظ، لا دليلًا على تحقق التباعد الأفضل.
- Apple HIG Accessibility يذكر 44×44pt كحجم افتراضي في iOS/iPadOS، ويعامل الحشو بين التحكمات كعامل مستقل (نحو 12pt حول العناصر ذات الإطار).

**الإجراء:** أضف قاعدة قابلة للقياس: 8px على الأقل بين أهداف اللمس المتجاورة افتراضيًا، مع استثناء موثق للـstepper إن كان اعتماد المالك لكثافة أعلى مقصودًا. افحص bounding boxes لا CSS `min-height` فقط، لأن الحشو/الحد/التداخل قد يغيّر الهدف الفعلي.

### F-05 — خطر محتمل/قرار يحتاج المالك: نطاق الهاتف العمودي مقابل الشاشات المتكيفة

**التصنيف:** قرار يحتاج المالك؛ خطر محتمل إن كان المنتج سيُفتح في landscape أو نافذة/جهاز قابل للطي.

**الأدلة المحلية:**

- `DESIGN.md:21-24` و`Micro-UI-Foundations-V1.md:18-24` يثبتان الهاتف وRTL والوضع الفاتح، لكن لا يثبتان صراحة portrait-only ولا عقدًا لـlandscape/foldable.
- `previews/index.html:5` و`previews/navigation/index.html:13` يحتويان `width=device-width, initial-scale=1`، لكن لا يوجد `viewport-fit=cover`.
- `components/navigation/navigation.css:100-128` يملك شريطًا سفليًا فقط؛ لا يوجد مسار rail/drawer أو قرار واضح عند اتساع النافذة.

**المقارنة الرسمية:**

- [Samsung Large Screen](https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html) يميز compact أقل من 600dp (navigation bar)، medium بين 600–840 (rail)، وexpanded من 840 فأعلى (drawer/لوحات متعددة)، ويحذر من تمديد عمود واحد على شاشة كبيرة.
- [Samsung Foldable](https://developer.samsung.com/one-ui/largescreen-and-foldable/designing_for_foldable.html) يطلب الاستجابة للأبعاد والنسب المختلفة، landscape، الشاشة المغلقة/المفتوحة، واستمرار موضع التمرير.
- Apple HIG يطلب التكيف مع orientation، size classes، text-size changes، وsafe areas؛ لا يصح اتخاذ نوع الجهاز بديلًا عن المساحة المتاحة.

**الإجراء:** قرار المالك أولًا: (أ) هاتف عمودي فقط مع non-goal معلن للشاشات الأخرى، أو (ب) ويب/PWA متجاوب يعرّف behavior عند 600/840، landscape، نافذة صغيرة، foldable، وkeyboard. لا تُعد Samsung/Material شهادة توافق؛ هي مراجع تصميم لاختبار مطلوب.

### F-06 — خطر محتمل: safe-area جزئية وعدم إثبات `viewport-fit`

**التصنيف:** خطر محتمل، غير مثبت على جهاز.

**الأدلة المحلية:**

- `components/navigation/navigation.css:107` و`:167` و`:265` تستخدم `env(safe-area-inset-bottom, 0px)` للشريط السفلي/الطبقات/actionbar.
- لا توجد معالجة مقابلة لـ`safe-area-inset-left/right` في appbar أو actionbar أو حاويات المحتوى، ولا `viewport-fit=cover` في صفحات المعاينة.
- `docs/UI-VISUAL-SYSTEM.md:60-67` و`docs/foundations/Micro-UI-Foundations-V1.md:188-194` يعلنان أن safe areas والهاتف الفعلي لم تُفحص.

**المقارنة الرسمية:**

- [MDN env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env) يعرّف inset علويًا/سفليًا/يمينًا/يسارًا، ويذكر أن القيم قد تصبح موجبة مع النتوءات، الحواف غير المستطيلة، لوحة المفاتيح أو إشعارات النظام.
- Apple HIG يعرّف safe area بأنها المنطقة التي لا يحجبها العتاد أو شريط النظام، ويعتبر احترامها أساسيًا.

**الإجراء:** إن كان portrait-only قرارًا مقصودًا، وثّقه. وإلا اختبر landscape/rounded corners مع `viewport-fit=cover` حيث ينطبق، وأضف safe-area inline للسطوح المثبتة/اللاصقة. تحقق من لوحة المفاتيح الديناميكية، لا من قيمة `env` صفر في Chromium.

### F-07 — خطر محتمل: ارتفاع navbar المتغير يحتاج عقدًا عامًا لا تعليقًا في CSS

**التصنيف:** خطر محتمل، لم يُثبت تداخلًا في المصدر العام.

**الأدلة المحلية:**

- `components/navigation/navigation.css:100-113` يفعّل `flex-wrap` و`max-width:50%`، ولذلك يمكن أن يصبح الشريط صفين أو أكثر عند النص الطويل.
- `components/navigation/navigation.css:257-271` يجعل actionbar sticky ويلف أزراره أيضًا.
- التعليق في `navigation.css:90-99` يقول إن المستهلك يقيس الارتفاع الفعلي عبر ResizeObserver، لكن هذا ليس عقدًا ذاتيًا في `.m-navbar` ولا يضمن أن كل مستهلك سيضيف `padding-block-end` المناسب.
- لقطة `reviews/B07/screenshots/05-zoom-200-320.png` تثبت مثالًا مرئيًا، لا كل تركيب مستهلك.

**الإجراء:** انقل شرط القياس إلى عقد موثق ومثال إلزامي: `ResizeObserver` أو CSS layout يجعل المحتوى التالي يشارك التدفق نفسه، وعدم الاعتماد على ارتفاع 48/53 ثابت. اختبر navbar بعدد عناصر وتسميات يحددها المستهلك عند 320/360/390/430 و200%، مع actionbar/toast/selection indicator معًا.

### F-08 — خطر محتمل: option الطويل في picker بلا عقد صريح للانكماش

**التصنيف:** خطر محتمل يحتاج اختبارًا موجهًا.

**الأدلة المحلية:**

- `components/selection/picker.css:80-98` يجعل `.m-picker__option` flex مع `min-height:48px`، لكن لا يضع `min-inline-size:0` أو `overflow-wrap:anywhere` على الخيار نفسه.
- `components/selection/picker.js:204-217` يبني زر الخيار كنص مباشر عبر `textContent`; النصوص العربية/اللاتينية الطويلة تأتي من المستهلك بلا حد طول.
- `picker.css:139` يعالج `.m-picker__title` فقط، لا نص الخيار.

**الحكم:** لم أعدّ هذا عيبًا مثبتًا لأن العينة الحالية لا تثبت أسوأ تسمية ممكنة. لكنه فجوة مهمة في عقد النص الطويل، خصوصًا مع `m-picker__list { overflow:hidden; }` في `picker.css:65-71`.

**الإجراء:** أضف اختبار تسمية طويلة بلا مسافات، عربي/لاتيني مختلط، 320 و200%؛ أو ثبّت بنية span داخل الخيار مع `min-inline-size:0; overflow-wrap:anywhere`. لا تستخدم `ellipsis` لاسم كيان يحتاج قراءة كاملة.

## ما هو جيد ومثبت ضمن النطاق

- `shared/tokens.css:53-61` يحافظ على سلم مسافات واحد بدل مصادر متنافسة، و`:63-85` يفصل أهداف اللمس عن مقاسات الأيقونات والزوايا.
- `components/buttons/buttons.css:16-40` و`components/fields/fields.css:43-72` يستخدمان `min-height` وتدفقًا قابلًا للتمدد بدل ارتفاع ثابت يقص النص.
- `components/organization/organization.css:86-103` يضع `min-width:0` و`overflow-wrap:anywhere` على عناوين الصفوف؛ هذا اتجاه صحيح ينبغي تعميمه على العناصر النصية الأخرى.
- `components/navigation/navigation.css:107` و`:265` يضيفان safe-area bottom للشريط السفلي وactionbar، و`previews/index.html:5` يملك meta viewport صحيحًا.
- `DESIGN.md:44-53` و`UI-VISUAL-SYSTEM.md:60-67` يضعان حدود قبول صحيحة: مقاسات متعددة، تكبير، RTL، تركيز، ويصرحان بأن Chromium/محاكاة الهاتف ليست هاتفًا فعليًا.
- بصريًا، لقطة B02 `12-zoom-200-320.png` تُظهر أن الحقول والرسالة الطويلة تنمو بدل قصها، ولقطة B01 `19-text-zoom-200-320.png` تُظهر أن الأزرار والنصوص تعيد التدفق. هذه أدلة إيجابية محدودة بالمحرك/طريقة المحاكاة، وليست شهادة منصة.

## مصفوفة الاختبار المتبقية

| الحالة | الوضع الحالي | القرار المطلوب |
|---|---|---|
| 320/360/390/430 CSS px، نص 200%، مكونات منفردة | توجد لقطات وفحوص لبعض العائلات؛ تبويبات B07 تكشف تجاوزًا | إصلاح F-01 وإعادة تشغيل كل التراكيب، لا العائلة المتسببة فقط |
| 400% reflow المكافئ لـ320 CSS px | غير مختبر كتكبير متصفح أصلي | تشغيل WebKit/Chromium native zoom حيث يمكن، وتوثيق الفرق عن text-scale |
| safe-area top/bottom/inline + keyboard | غير مختبر على جهاز فعلي | iPhone/Android فعليان، landscape، لوحة مفاتيح، PWA إن كان ضمن النطاق |
| touch targets والفراغ بينها | قياسات CSS/لقطات فقط | قياس bounding boxes عند كل تركيب؛ إضافة 8px default أو استثناء معلن |
| Samsung Internet/One UI، Safari/WebKit | غير مختبر | تشغيل على جهاز/محاكي حقيقي؛ لا تنسب نجاح Chromium لهذه المنصات |
| TalkBack/VoiceOver/قارئ شاشة | DOM/ARIA فقط | اختبار صوتي يدوي لعقود tablist، الطبقات، الحقول، والرسائل |
| width 600/840+ وlandscape/foldable | لا عقد منتج محدد | قرار نطاق من المالك ثم breakpoints/alternative layouts حسب القرار |

## توصيات مرتبة

1. **P1:** إصلاح `m-tabs` للـreflow والحفاظ على WAI-ARIA، ثم إضافة probe يرفض أي `scrollWidth > clientWidth` عند 320/360/390/430 مع 200%.
2. **P1/P2:** تصحيح هامش 390/430 في `previews/index.css` أو توثيق أن المعرض يستثنى من قاعدة 20px؛ لا تترك الانحراف صامتًا.
3. **P2:** اعتماد عقد مسافات تفاعلية منفصل عن حجم الهدف: 48px هدف مشروع، و8px فصل افتراضي Material، مع استثناءات مالك موثقة.
4. **P2:** توثيق safe-area/keyboard/orientation، وإضافة الاختبار الفعلي قبل ادعاء جاهزية الهاتف أو PWA. استخدم `env` لكل الحواف المثبتة ذات الصلة، لا bottom وحده تلقائيًا.
5. **P2:** تثبيت عقد navbar الديناميكي بحيث لا يعتمد المستهلك على ارتفاع ثابت عند التفاف التسميات.
6. **P3:** فصل توكنات غلاف المعرض عن توكنات المنتج، أو إعادة الغلاف إلى سلم النوع/المسافات المعتمد.
7. **P3:** إضافة fixture للـpicker بعنوان طويل جدًا ومختلط الاتجاهات، وعدم اعتبار نجاح العينة القصيرة دليلًا عامًا.

## المراجع الرسمية المستخدمة

- [W3C WCAG 2.2 — Reflow 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C WCAG 2.2 — Target Size 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WAI-ARIA APG — Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Material Design — Accessibility](https://m2.material.io/design/usability/accessibility.html)
- [Apple Human Interface Guidelines — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Samsung One UI — Large screen and foldable](https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html)
- [Samsung One UI — Designing for foldable](https://developer.samsung.com/one-ui/largescreen-and-foldable/designing_for_foldable.html)
- [web.dev — Responsive web design basics](https://web.dev/articles/responsive-web-design-basics)
- [MDN — CSS `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [MDN — CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)

## الملفات التي تمت مراجعتها

- `DESIGN.md`
- `shared/tokens.css`
- `docs/UI-VISUAL-SYSTEM.md`
- `docs/foundations/Micro-UI-Foundations-V1.md`
- `previews/index.css`
- `previews/index.html`
- `components/buttons/buttons.css`
- `components/fields/fields.css`
- `components/organization/organization.css`
- `components/navigation/navigation.css`
- `components/navigation/navigation.js`
- `components/selection/picker.css`
- `components/selection/picker.js`
- `components/surfaces/surfaces.css`
- `previews/navigation/index.html`
- `docs/CURRENT-STATE.md`
- `docs/SHARED-SPEC.md`
- `reviews/B01/review.md`
- `reviews/B07/review.md`
- `reviews/S01/review.md`
- اللقطات المذكورة في قسم الأدلة أعلاه.


---

## A2 — المكونات والحالات والتوكنز المحلية: النص الأصلي للتقرير

# تدقيق المحور: المكونات والحالات والتوكنز المحلية

**المعرّف:** `components-states`  
**النطاق:** المستودع الجديد `.` فقط.  
**قاعدة القراءة:** 20% وصف للحالة الحالية، و80% كشف فجوات ومقارنتها بمراجع رسمية. لم أستخدم أي مستودع آخر أو أقارن به، وتعاملت مع أي ذكر للرسم البياني بوصفه مثالًا لا محورًا مستقلًا.

## الحكم التنفيذي

**الحكم: يحتاج إلى إصلاحات قبل اعتباره نظام مكونات وحالات جاهزًا لإعادة الاستخدام عبر مستهلكين متنوعين.** توجد لغة بصرية متماسكة: معظم الألوان والمسافات وأحجام الأهداف وحلقات التركيز تأتي من `shared/tokens.css`، وحالات كثيرة لها مسارات CSS/JS واضحة، كما أن أمثلة اللوحات تعرض التعطيل والضغط والتركيز والانتظار والفراغ والتحديد. لكن عقد الحالة ليست محكمة بالقدر نفسه: هناك عيب مثبت في توافق `aria-disabled` بين السلوك والمظهر، وقيم بصرية صلبة خارج مصدر التوكنز، ودلالات ARIA أساسية تُترك للترميز المستهلك بلا فحص أو تحذير. لذلك لا ينبغي اعتبار اجتياز Chromium، أو اللقطات الحالية، شهادة لجهاز فعلي أو قارئ شاشة.

## 1) الحالة الحالية — 20% من التدقيق

| جانب | ما يظهر في المصدر | التقييم الحالي |
|---|---|---|
| مصدر القيم | `shared/tokens.css` يعرّف الهوية، الأسطح، النصوص، التركيز، المسافات، المقاسات، الانحناءات، الخطوط، الحركة، وتوكنز العائلات. | **جيد جزئيًا:** مصدر مركزي واضح، لكن ليس كل القرارات المحلية داخله أو مسماة كتوكنات مكون.
| حالات الأزرار | `buttons.css/js` يغطي العادي، الضغط، التركيز، التعطيل، والتحميل؛ `buttons.js` يحرس تفعيل Enter/Space أثناء `aria-busy`. | **قوي في السلوك المعلن**، مع بقاء سياسة `aria-disabled` للأزرار غير محسومة في المواصفة.
| حالات الاختيار | `selection.js` يزامن checkbox الجزئي، radio، switch pending، وsegmented؛ يوجد تنقل أسهم وحراسة `disabled` و`aria-disabled` في JS. | **سلوكيًا واضح**، لكن العرض البصري لـ`aria-disabled` في segmented لا يطابق الحراسة البرمجية.
| الطبقات والرسائل | `navigation.js` يدير `inert`، حصر التركيز، Escape، الاستعادة، وقفل التمرير. `messages.js` يبني live region مشتركة للتوست والإعلانات. | **إدارة حركة/تركيز جيدة في Chromium**، لكن أدوار ARIA الأساسية تعتمد على HTML المستهلك ولا تُتحقق من المصدر.
| التوكنز المحلية | توجد توكنز خاصة مثل `--_peek` و`--_gap` و`--m-circle-*`، ومقابض موجات سطحية غير معرفة في `:root` لكنها ذات fallbacks. | **مقبول كآلية override**، لكنه يحتاج سياسة تسمية/ملكية وفصلًا آليًا بين system tokens وcomponent tokens والقيم الهندسية.
| الأدلة البصرية | لقطات `reviews/B01`, `B03`, `B06`, `B07`, و`S01` تعرض الحالات الأساسية؛ لقطة الدوائر `reviews/CONCEPTS/screenshots/circles-zero-390.png` تعرض الصفر دون اختلاق بيانات. | **دليل بصري مفيد لا دليل منصة:** اللقطات لا تثبت TalkBack/VoiceOver أو لمسًا حقيقيًا أو وحدات dp/pt.

## 2) الفجوات والنتائج — 80% من التدقيق

### F-01 — عيب مثبت: `aria-disabled` في Segmented محروس برمجيًا لكنه يبدو قابلًا للتفاعل

**التصنيف:** عيب مثبت — أولوية عالية.  
**الدليل:**

- `components/selection/selection.js:21-23` يعرّف `isDisabled` على أنه `disabled` الأصلي أو `aria-disabled="true"`.
- `components/selection/selection.js:80-83` يمنع النقر وإطلاق `micro-selection:segment` في الحالتين.
- `components/selection/selection.css:313-317` ينسّق التعطيل لـ`[disabled]` فقط.
- `components/selection/selection.css:347` يستثني `[disabled]` فقط من hover؛ العنصر ذي `aria-disabled="true"` يمكن أن يتلقى لون hover، ويظل له شكل عنصر فعال، كما أن محددات التركيز لا تستثنيه.

**الأثر:** قد يقرأ قارئ الشاشة العنصر معطلًا بينما يراه المستخدم الناظر مفعّلًا؛ كما أن بقاءه في ترتيب Tab مقبول أحيانًا عند اختيار `aria-disabled`، لكن يجب أن يكون مظهره واضحًا وأن تكون كل طرق التفعيل محروسة. هذا ليس اختلافًا بصريًا بسيطًا، بل كسر لاتساق الحالة بين الدلالة، السلوك، والمظهر.

**المقارنة الرسمية:** توضح [MDN aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled) أن `aria-disabled` دلالة فقط؛ لا توقف التفعيل أو تغيّر النمط أو التركيز تلقائيًا، وعلى التطبيق توفير الحراسة البرمجية والتنسيق المرئي يدويًا. توضح [Material States](https://m3.material.io/foundations/interaction/states) أن الحالة تحتاج مؤشرين بصريين وتطبّق باتساق، ويمكن جمع الحالات مثل selected وhover.

**الإجراء:** أضف `[aria-disabled="true"]` إلى قواعد مظهر التعطيل وقواعد استثناء hover/active/focus، ثم أضف فحصًا يثبت: لا حدث تغيير، لا لون hover مضلل، ومظهر معطل واضح، مع تقرير منفصل لقرار إبقائه في Tab أو إخراجه.

### F-02 — عيب مثبت في حوكمة التوكنز: قيمة hover صلبة تكرر لون توكن دون اسم دلالي

**التصنيف:** عيب مثبت على مستوى النظام البصري/التغيير المشترك — أولوية متوسطة.  
**الدليل:** `components/selection/selection.css:347` يستخدم `rgba(223,238,230,.65)` بدل توكن دلالي. اللون الأساسي نفسه هو `--micro-surface-selected: #DFEEE6` في `shared/tokens.css:20`، لكن درجة الشفافية لا تملك اسمًا أو مصدرًا مركزيًا. ويوجد مثال آخر لقيمة ظل صلبة في `components/metric-comparison/metric-comparison.css:381` (`rgba(255,255,255,.16)`).

**الأثر:** تعديل surface-selected أو بناء نسق تباين/مظهر آخر لا ينعكس على hover، وقد تصبح العلاقة بين selected وhover غير قابلة للتدقيق. هذا يخالف مبدأ الدليل المحلي في `docs/UI-USAGE-SOP.md:61-69, 89-93` الذي يطلب أن تكون القيمة البصرية الجديدة توكنًا مسمى أو استثناءً موثقًا في موضعه.

**المقارنة الرسمية:** [Material Design tokens](https://m3.material.io/foundations/design-tokens) يوصي باستخدام التوكنز بدل القيم الصلبة، ويفصل reference/system/component tokens، ويجمع توكنز المكون حسب العنصر والحالة كي يمكن تغييرها عالميًا أو حسب السياق.

**الإجراء:** عرّف مثلًا `--micro-selection-hover-surface` أو توكن component باسم يوضح العنصر والحالة، أو وثّق صراحة أن الشفافية مشتقة لا قابلة للتغيير. أضف lint يمنع hex/rgba داخل `components/**.css` ما لم يرافقه تعليق يحدد أنه هندسة داخلية أو fallback.

### F-03 — خطر محتمل/فجوة عقد: الطبقة قد تصبح Modal بصريًا بلا عقد ARIA إذا نسي المستهلك السمات

**التصنيف:** خطر محتمل، وليس عيبًا مثبتًا في المثال الحالي.  
**الدليل:** `components/navigation/navigation.js:5-35` يصف إدارة التركيز والعزل، و`navigation.js:65-82` يحسب العناصر القابلة للتركيز، لكنه لا يضيف أو يتحقق من `role="dialog"` أو `aria-modal="true"` أو `aria-labelledby`/`aria-label`. الأمثلة تضيفها يدويًا في `previews/navigation/example-usage.html:31-35` و`previews/selection/index.html:309-314`، ولذلك تبدو الأمثلة ملتزمة، لكن API العامة لا تمنع تركيب `.m-layer` بلا هذه السمات.

**المقارنة الرسمية:** [WAI-ARIA APG Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) يشترط دور `dialog`، و`aria-modal="true"`، واسمًا عبر `aria-labelledby` أو `aria-label`، مع حصر Tab واستعادة التركيز. كما يحذر من وضع `aria-modal` إذا كان السلوك المرئي لا يعزل الخلفية فعليًا.

**الإجراء:** احسم عقدًا واحدًا: إما أن يضيف المكوّن السمات الافتراضية ويصدر تحذيرًا عند غياب الاسم، أو يعلن بوضوح أن الترميز مسؤولية المستهلك ويضيف فحص بنية يفشل عند فتح طبقة بلا role/name/modal. لا تكتفِ بفحص `inert` كبديل عن اختبار الشجرة الإتاحية.

### F-04 — خطر محتمل/فجوة عقد: أدوار الرسائل الثابتة ليست مضمونة من المصدر

**التصنيف:** خطر محتمل، مع قرار API مطلوب.  
**الدليل:** `components/messages/messages.js:4-10` يصرح أن التوست بلا `role/aria-live` ويستخدم live region واحدة؛ هذا مقصود لتجنب التكرار. لكن `m-note` لا يحصل آليًا على `role="note"` أو `status` أو `alert` بحسب النوع. المثال يضيف `role="status"` يدويًا في `previews/messages/example-usage.html:35`، والمواصفة تسرد الأدوار في `components/messages/specification.md:9-24` دون آلية تحقق في المصدر.

**الأثر:** تركيب أدنى من المستهلك قد يعرض نجاحًا أو خطأ بصريًا بلا إعلان مناسب، أو قد يعمم `alert` على تحذير غير حرج. وجود live region للتوست لا يعالج الرسائل الثابتة.

**المقارنة الرسمية:** يحدد [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) أن `polite` لا يقطع المهمة، بينما `assertive` مخصص للمقاطعة الضرورية. ويحدد دليل المشروع نفسه في `components/messages/specification.md:20-24` فصل status عن alert.

**الإجراء:** اجعل النوع يحدد role افتراضيًا عند `init`، أو ضع validator صريحًا يرفض/يحذر من `m-note--error` بلا role مناسب. سجّل استثناءات alert القابلة للتصرف، ولا تعتمد على اسم الصنف وحده في قارئ الشاشة.

### F-05 — خطر محتمل غير مختبر: قناة live واحدة وتبديل `polite/assertive` مع مؤقت 50ms

**التصنيف:** خطر محتمل — لم يُثبت بقارئ شاشة.  
**الدليل:** `components/messages/messages.js:54-61` ينشئ live region واحدة. `messages.js:73-109` يبدّل `aria-live` على نفس العقدة ثم يمسح النص ويعيده بعد `setTimeout(..., 50)`. عند ورود حدثين متقاربين، يمكن أن تتنافس المؤقتات وتظهر قيمة وسيطة أو يضيع ترتيب الإعلان؛ كما أن تبديل القناة نفسها بين polite وassertive يجعل سلوك المقاطعة عالميًا لكل المستهلكين.

**المقارنة الرسمية:** [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) يوصي بقناة موجزة محدثة، يذكر `aria-atomic` و`aria-busy` للتحكم في التحديثات، ويحذر من `assertive` لأنه قد يمسح طابور الكلام.

**الإجراء:** اختبر burst من إعلانين مستقلين، إعلانين بهوية واحدة، وإعلان assertive يلي polite مع NVDA/VoiceOver/TalkBack. عند الحاجة افصل قناة assertive أو طبّق queue/coalescing صريحًا بدل مؤقت ثابت غير موثق.

### F-06 — قرار يحتاج المالك: حدود التوكنز المحلية وأسماء override غير موحدة

**التصنيف:** قرار بصري/هندسي يحتاج المالك، وليس كسرًا بصريًا مثبتًا.  
**الدليل:**

- `components/surfaces/surfaces.css:9-14` يعرّف مقابض `--micro-surface-wave-opacity`, `--micro-surface-wave-pos`, `--micro-surface-wave-scale`, و`--micro-surface-light` في التعليق فقط؛ `surfaces.css:34,52-58` يستخدم fallbacks، لذلك لا يحدث انهيار عند غيابها، لكنها ليست معلنة في `:root`.
- `components/carousel/carousel.css:52,90,105` يستخدم `--_peek` و`--_gap` كخصائص خاصة.
- `components/info-strip/info-strip-peek.css:11-14,25,35` يستخدم `--m-peek-width` و`--m-peek-gap`.
- `components/metric-comparison/metric-comparison.css` يعتمد على `--m-circle-*` و`--m-bar-width` التي يكتبها JS هندسيًا.

**المشكلة:** لا يوجد حد آلي واضح بين system token، component token، وruntime geometry. قد يغيّر مستهلك `--_gap` بلا معرفة بعقده، أو ينسخ قيمة خاصة إلى عائلة أخرى. وفي المقابل، ليس مطلوبًا ترقية كل قيمة هندسية مثل نسبة الموجة إلى توكن مشترك.

**المقارنة الرسمية:** يشرح Material أن component tokens تمثل أجزاء المكون وحالاته، وأن كل قرار ينطبق على عدة مكونات ينبغي أن يكون توكنًا، بينما السياقات مثل RTL والكثافة والمظهر يمكنها تغيير قيمة التوكن.

**الإجراء:** اعتمد convention موثقًا، مثل `--micro-comp-carousel-*` للقيم القابلة للضبط و`--micro-geom-*` للقيم التي يكتبها JS، ودوّن نطاق override لكل خاصية. لا ترفع قيمة خاصة إلى `:root` إلا إذا ثبت أنها مشتركة.

### F-07 — قرار بصري يحتاج المالك: الشكل المرئي للـSegmented أصغر من هدف اللمس

**التصنيف:** قرار بصري مع خطر تحقق على الجهاز، وليس عيبًا مثبتًا.  
**الدليل:** `components/selection/selection.css:278-281` يجعل الشكل المرئي `min-height:40px`، ثم `:after` في `selection.css:326-331` يمدد الهدف رأسيًا إلى 48px عبر `--micro-touch-min`. لقطة `reviews/B03/screenshots/02-switches-390.png` تعرض الشكل البصري 40px تقريبًا، بينما العقد تقول إن المنطقة الفعلية 48px.

**المقارنة الرسمية:** تصميم Android يشيع هدف 48dp، وApple HIG يوصي بـ44×44pt افتراضيًا؛ هذه وحدات منصة وليست مساوية لـ48 CSS px. كما أن [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) يطلب مراعاة المسافة بين الأهداف وتقديم بدائل للإيماءات.

**الإجراء:** ثبّت قرارًا بصريًا موثقًا: هل 40px شكل مقصود مع hit area 48px أم يجب أن يظهر التحكم نفسه بارتفاع أكبر؟ اختبر `elementFromPoint` مع صفوف ملتفة، وقلم/لمس فعلي، وتباعد الأهداف في Android وiOS؛ لا تعتبر شكل لقطة Chromium قياس dp/pt.

### F-08 — فجوة غير مذكورة: عدم اتساق عقد `init(root)` حول الجذر-الذاتي

**التصنيف:** خطر محتمل في API الإلحاق الديناميكي.  
**الدليل:** `components/selection/selection.js:106-110` يستدعي `querySelectorAll` على `root` ولا يفحص إن كان `root` نفسه `[data-choice-group]` أو `[data-seg]`. بالمقابل، `components/account-settings/account-settings.js:67-71` و`components/info-strip/info-strip-peek.js:367-371` يعالجان الجذر نفسه صراحة. إذا مرر المستهلك عقدة segmented نفسها إلى `MicroSelection.init(seg)`, فلن ترتبط دون تمرير أب أو `document`.

**الإجراء:** إمّا توحيد كل APIs على contract «الجذر نفسه + الأبناء» أو إعلان أن root حاوية فقط. أضف اختبار init على node ذاتي، وعلى حاوية، وعلى إعادة init بعد الإدراج.

### F-09 — فجوة غير مذكورة في التوكنز السياقية: لا مسار واضح لـforced colors/high contrast/dark context

**التصنيف:** فجوة نظامية غير مذكورة في مصفوفة المالك — قرار نطاق مطلوب.  
**الدليل:** البحث في `shared` و`components` لا يجد `forced-colors`, `prefers-contrast`, أو `color-scheme`. التوكنز في `shared/tokens.css:9-155` ثابتة للمظهر الفاتح، مع تركيز وألوان حالات ثابتة.

**المقارنة الرسمية:** Material يصف السياقات كالكثافة وRTL والمظهر، وApple يوصي بتباين أعلى عند Increase Contrast، وعدم الاعتماد على اللون وحده، ودعم النص الكبير. وجود `prefers-reduced-motion` لا يغطي forced colors أو contrast.

**الإجراء:** يحتاج المالك حسم ما إذا كانت المكتبة web-only light theme أم تدعم forced colors/contrast/dark. إن كان الدعم مطلوبًا، أضف طبقة tokens سياقية واختبارات تجبر الحدود والأيقونات والنص على البقاء مفهومة.

## 3) ما لم يُختبر، وما لا يجوز استنتاجه

1. في الجولة الحالية، تعذر إعادة تشغيل الفحوص الآلية: `tools/ui-release-check.py`, `tools/audit-fixes-check.py`, و`tools/data-scale-state-check.py` انتهت بفشل تشغيل Playwright بسبب غياب executable في `local-environment/ms-playwright/...`. كما أن `tools/concepts-check.py` فشل لأن `127.0.0.1:5000` لم يكن مشغّلًا. سجل التفصيل المؤقت: `audit-session-output/jobs/afdaf1e7ac6c_a1/current-checks.txt`.
2. سجلات `reviews/B01` و`reviews/B03` و`reviews/B06` و`reviews/B07` تقدم أدلة تاريخية على Chromium headless، لكنها لا تثبت إعادة الفحص بعد أي تغيير لاحق ولا قارئ شاشة.
3. `docs/UI-PLATFORM-NOTES.md:21-58` يصرح بأن المقاسات 320/360/390/430 ومحاكاة تكبير النص ليست تكبير نظام، وأن أجهزة Android/iOS ولوحة الهاتف واللمس الحقيقي وSafari/WebKit وقارئ الشاشة غير منفذة. هذا يتسق مع قيد المهمة: نجاح Chromium ليس شهادة جهاز.
4. لم أختبر TalkBack أو VoiceOver أو NVDA، أو forced-colors/High Contrast، أو WebKit/Safari فعليًا، أو قلمًا/لمسًا حقيقيًا، أو لوحة مفاتيح هاتف تغطي حقلًا، أو 48dp/44pt على جهاز. لا ينبغي تحويل أي لقطة إلى ادعاء منصة.
5. صفحة Samsung الرسمية التي حاولت قراءتها (`https://developer.samsung.com/one-ui/accessibility/intro.html`) أعادت بوابة cookies، لذلك لم أبنِ حكمًا على اقتباس غير قابل للتحقق منها. المقارنة التشغيلية هنا تعتمد على WAI-ARIA/MDN/Material/Android/Apple، مع إبقاء One UI ضمن اختبار لاحق عند توفر دليل قابل للقراءة.

## 4) مقارنة الممارسات الرسمية

| المرجع | المبدأ المناسب للمحور | حالة المستودع | الفجوة العملية |
|---|---|---|---|
| WAI-ARIA APG Dialog | role/aria-modal/name، دخول التركيز، حصر Tab، Escape، استعادة التركيز | السلوك البرمجي موجود، السمات في أمثلة المستهلك | لا validator أو default semantics على الطبقة المجردة |
| MDN `aria-disabled` | الدلالة لا تعطل الكود أو النمط أو التركيز تلقائيًا | JS segmented يحرس السلوك | CSS لا يغطي `aria-disabled`؛ حالة مرئية مضللة |
| Material States | مؤشرا حالة على الأقل، ودمج متسق للحالات | حلقات وتركيز/تحديد موجودة غالبًا | عدم اتساق aria-disabled، وعدم وجود مصفوفة حالة آلية لكل component |
| Material Tokens | لا قيم صلبة؛ أسماء component/state/context واضحة | shared tokens واسعة ومفيدة | rgba صلبة وprivate tokens غير موحدة |
| Android adaptive | reflow/reveal/presentation change عبر window classes، وعدم تمديد المدخلات والأزرار | اختبارات هاتف ثابتة ومحاكاة نص 200% | لا اختبار medium/large أو context فعلي؛ المقاسات ليست شهادة dp |
| Apple HIG Accessibility | 200% text، contrast، لا لون وحده، أهداف 44pt، بدائل gesture، VoiceOver | نصوص وحالات وأهداف 48 CSS px وبدائل carousel موجودة | لا Dynamic Type/VoiceOver/لمس أو contrast contexts فعلي |
| MDN `aria-live` | polite افتراضيًا، assertive للمقاطعة الضرورية، atomic/busy عند تحديثات مركبة | live region مشتركة وatomic | burst/timing/تبديل assertive غير مختبر |
| Samsung One UI | مواءمة التحكم والتباعد والوصول على Galaxy/Touch/assistive tech | لا دليل جهاز Samsung | يحتاج فحص One UI/Touch/ TalkBack فعلي؛ صفحة المرجع مقيدة بالcookies في هذه الجولة |

## 5) التوصيات المرتبة

1. **P0 — إصلاح F-01:** وحّد `disabled` و`aria-disabled` في CSS وJS وkeyboard/pointer tests في segmented، ثم كرر النمط نفسه في أي component يقبل `aria-disabled`.
2. **P0 — عقد الدلالات:** أضف فحصًا وقت `init` أو أداة static contract للطبقات والرسائل: role، modal، label، live/status/alert، واسم عناصر الأيقونة. لا تجعل فحص `inert` بديلًا عن الاسم الإتاحي.
3. **P1 — توكنز الحالات:** استبدل `rgba(223,238,230,.65)` والقيم الصلبة المماثلة بتوكنز حالة مسماة، وأضف lint يحدد الاستثناءات الهندسية.
4. **P1 — live region:** صمّم queue/coalescing وتحقق بقارئ شاشة من أحداث burst، وحدد متى يجوز assertive. أضف `aria-busy` أو قناة منفصلة عند التحديثات المركبة بدل تغيير نفس العقدة عالميًا.
5. **P1 — قرار token architecture:** وثّق namespace ونطاق كل `--_`, `--m-*`, و`--micro-*`؛ ميّز runtime geometry عن component tokens عن shared system tokens.
6. **P2 — قرار segmented:** ثبّت بصريًا هل الشكل 40px مع hit area 48px مقصود؛ ثم فحص لمس حقيقي وتباعد بعد الالتفاف، مع عدم الخلط بين CSS px وdp/pt.
7. **P2 — توحيد init:** اجعل APIs كلها تعالج root نفسه وأبناءه أو توثق العكس، ثم أضف دورة dynamic mount/disconnect/init لكل عائلة.
8. **P2 — سياقات الوصول:** إذا كان المنتج يستهدف web متعدد السياقات، أضف forced-colors/high-contrast/dark أو سجّل صراحة أنها خارج النطاق، مع فحوص contrast وfocus في تلك السياقات.
9. **P3 — بوابة الإصدار:** قبل اعتماد `STABLE UI` للمحور، شغّل الفحوص من نسخة نظيفة مع Chromium مثبت، ثم WebKit/Safari، ثم TalkBack/VoiceOver/NVDA ولمس Android/iOS فعلي. سجّل commit المصدر ومحرك الاختبار في كل تقرير.

## الخلاصة

النظام يملك أساسًا بصريًا جيدًا وحالات كثيرة منفذة، لكن **الاعتمادية النظامية للمكونات تتوقف حاليًا عند حدود Chromium ووعي المستهلك بالترميز**. العيب المثبت في `aria-disabled`، مع سياسة التوكنز غير المكتملة ودلالات ARIA غير المفروضة، كافٍ لطلب جولة إصلاح قبل التسليم النهائي. الفجوات الأخرى ليست كلها أعطالًا؛ بعضها قرارات بصريّة أو نطاق يحتاج مالكًا، ويجب عدم تحويلها إلى «نجاح» أو «فشل» قبل حسم العقد واختبار الأجهزة الحقيقية.

## الملفات واللقطات التي تمت مراجعتها

- `shared/tokens.css`
- `components/buttons/buttons.css`, `components/buttons/buttons.js`, `components/buttons/specification.md`
- `components/fields/fields.css`, `components/fields/fields.js`
- `components/selection/selection.css`, `components/selection/selection.js`, `components/selection/specification.md`
- `components/messages/messages.css`, `components/messages/messages.js`, `components/messages/specification.md`
- `components/navigation/navigation.css`, `components/navigation/navigation.js`, `components/navigation/specification.md`
- `components/surfaces/surfaces.css`, `components/surfaces/curves.css`
- `components/carousel/carousel.css`, `components/carousel/carousel.js`, `components/carousel/specification.md`
- `components/info-strip/info-strip.css`, `components/info-strip/info-strip.js`, `components/info-strip/info-strip-peek.css`, `components/info-strip/info-strip-peek.js`, `components/info-strip/specification.md`
- `components/metric-comparison/metric-comparison.css`, `components/metric-comparison/metric-comparison.js`, `components/metric-comparison/specification.md`
- `components/account-settings/account-settings.js`, `components/account-settings/specification.md`
- `components/access-gateway/access-gateway.js`, `components/access-gateway/specification.md`
- `previews/navigation/example-usage.html`
- `previews/selection/index.html`
- `previews/messages/example-usage.html`
- `previews/fields/example-usage.html`
- `previews/account-settings/example-usage.html`
- `previews/access-gateway/example-usage.html`
- `previews/system/index.html`
- `docs/UI-USAGE-SOP.md`, `docs/UI-PLATFORM-NOTES.md`
- `reviews/B01/review.md`, `reviews/B03/review.md`, `reviews/B06/review.md`, `reviews/B07/review.md`
- `reviews/B03/screenshots/02-switches-390.png`
- `reviews/B06/screenshots/03-empty-390.png`
- `reviews/B07/screenshots/04-dialog-delete-390.png`
- `reviews/S01/screenshots/00-overview-390-full.png`
- `reviews/CONCEPTS/screenshots/circles-zero-390.png`

## المراجع الرسمية

- [WAI-ARIA APG: Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: `aria-disabled`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)
- [MDN: `aria-live`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)
- [Material 3: States](https://m3.material.io/foundations/interaction/states)
- [Material 3: Design tokens](https://m3.material.io/foundations/design-tokens)
- [Android: Adapt layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout)
- [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Samsung One UI accessibility](https://developer.samsung.com/one-ui/accessibility/intro.html) — الوصول أعاد بوابة cookies في هذه الجولة.


---

## A3 — التكوينات والتنقل والتمرير والطبقات: النص الأصلي للتقرير

# تدقيق المحور: التكوينات والتنقل والتمرير والطبقات

- **المعرّف:** `composition-navigation`
- **النطاق:** مستودع UI الجديد فقط: `.`
- **رأس المصدر المقروء:** `496b900ab41085627ca0a8f9479674a9dc3ad677`
- **تاريخ التدقيق:** 2026-10-08
- **الحكم:** **REQUEST CHANGES / غير جاهز كعقد نظامي عام**. أساس B07 قوي في عزل الخلفية، حصر التركيز، استعادة المشغّل، التمرير الداخلي، وتقليل الحركة؛ لكن توجد فجوتان مثبتتان في نمط التبويبات، وعيب تركيبي مشروط في ملكية الـsafe-area، إضافة إلى مخاطر أجهزة/منصات وسياسات تنقل لم تُحسم. نجاح Chromium القائم لا يثبت جهازًا فعليًا أو قارئ شاشة أو WebKit.

> هذا التقرير لا يستخدم Micro القديم ولا يقارنه ولا يقترح إعادة استعماله. ذكر Chart أو أي مثال بيانات ليس محور هذا التدقيق.

## 1) ملخص الحالة الحالية — 20%

المصدر يملك طبقة تنقل/طبقات مشتركة واضحة في `components/navigation/`، وتستعمل معاينة B07 المصدر الفعلي لا نسخة مقلدة. `navigation.js` يدير stack للطبقات، `inert` للأشقاء، حصر `Tab/Shift+Tab`، استعادة التركيز، قفل التمرير بعدّاد، وإلغاء دورة الإغلاق القديمة عند إعادة الفتح. `navigation.css` يعرّف `m-layer__body` كمنطقة تمرير داخلية مع `overscroll-behavior: contain`، ويدعم `prefers-reduced-motion`. كما أن تركيب B07 يثبت بصريًا شريط عنوان/تبويبات، طبقة فلاتر، حوار تأكيد، وشريط أفعال مع شريط تنقل سفلي.

الأدلة الموجودة قوية **داخل نطاقها**: `reviews/B07/verification.txt` يسجل 28/28، بما فيها A2–A15 وB1–B3، لكن الفحص آلي على Chromium. ويصرّح `docs/UI-PLATFORM-NOTES.md` صراحة بعدم اختبار قارئ شاشة فعلي، WebKit/Safari، جهاز فعلي، لمس حقيقي، لوحة مفاتيح الهاتف، وsafe-area حقيقية. لذلك لا أتعامل مع PASS كاعتماد شامل.

## 2) الحكم التنفيذي

| التصنيف | الحكم | الأولوية |
|---|---|---:|
| عيب مثبت | `tabpanel` غير داخل ترتيب Tab عند عدم وجود عناصر قابلة للتركيز | P1 |
| عيب مثبت | `m-tabs` بلا سياسة overflow؛ محتوى طويل يخرج أفقيًا بدل تمرير/More/قرار واضح | P1/P2 |
| عيب مثبت في تركيب المعاينة (شرطي بوجود safe-area) | `sticky-foot` يضيف safe-area فوق safe-area المكوّنين، فتتكرر المساحة أسفل الجهاز | P2 |
| خطر محتمل | قفل `body` وحده قد لا يغلق root scrolling في Safari/WebView؛ لا يوجد تحقق WebKit | P1 للغلاف الهجين، P2 للمكتبة العامة |
| خطر محتمل | الطبقة الثابتة لا تتكيف صراحة مع لوحة المفاتيح الافتراضية؛ حقل البحث قد يُغطى | P1 لمسار الفلاتر على جهاز فعلي |
| خطر محتمل/قرار يحتاج المالك | `data-autofocus` على زر الحذف المتلف بدل الإلغاء/ملخص ثابت | P2 |
| قرار يحتاج المالك | التفاف `m-navbar` إلى صفوف متعددة يتعارض مع إرشادات حدود وجهات التنقل؛ لا توجد سياسة More/rail | P1 قبل اعتماد العقد العام |
| قرار يحتاج المالك | لا يوجد نمط app bar اختياري يتقلص مع التمرير رغم أن الاسم/المراجع المنصية توحي بذلك | P2 |
| قرار يحتاج المالك | stack لطبقات متعددة مدعوم برمجيًا، لكن لا سياسة منتج معلنة متى يسمح بالتداخل | P2 |
| لم يُختبر | TalkBack/VoiceOver/NVDA، Safari/WebKit، لمس وسحب فعلي، safe-area/keyboard حقيقية، native zoom، predictive back | حجب اعتماد الجهاز |

## 3) الفجوات المثبتة

### F-01 — `tabpanel` قابل للوصول بصريًا لكنه يُتجاوز في Tab

**التصنيف:** عيب مثبت في تطبيق نمط WAI-ARIA APG — **P1**.

**الأدلة المحلية:**

- `previews/navigation/index.html:49-57` يعرّف `role="tablist"` و`role="tab"` و`role="tabpanel"`، لكن `#tab-a` و`#tab-b` لا يملكان `tabindex="0"`.
- `components/navigation/navigation.js:443-451` يبدّل `hidden` و`aria-selected` فقط؛ لا يضيف `tabindex="0"` إلى اللوحة النشطة.
- إعادة إنتاج Chromium على `previews/navigation/index.html` بعرض 390px: بعد `focus('#tab-a-btn')` ثم `Tab` كان العنصر النشط زر `مشروعي` داخل `m-navbar`، مع `panelTabIndex: -1`. أي أن اللوحة النشطة التي لا تحتوي عنصرًا تفاعليًا تُتجاوز كليًا.

**المعيار الرسمي:** [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) ينص على أن `tabpanel` الذي لا يحتوي عناصر قابلة للتركيز، أو لا يكون أول محتوى ذي معنى فيه قابلًا للتركيز، ينبغي أن يحمل `tabindex="0"` لإدخاله في تسلسل الصفحة. هذا ليس اعتراضًا بصريًا ولا مقارنة منصة.

**الأثر:** مستخدم لوحة المفاتيح/قارئ الشاشة قد يفعّل تبويبًا ثم لا يصل إلى بداية محتواه بـTab، وينتقل إلى تنقل لاحق. وجود `aria-controls` لا يصلح ترتيب التركيز وحده.

**التوصية:** عند تهيئة التبويبات، عيّن `tabindex="0"` للوحة النشطة إذا لم يكن فيها هدف قابل للتركيز، وأزل/اضبطه عند التبديل حسب العقد. أضف فحصًا يثبت: تبويب نشط → Tab → `tabpanel`، وتبويب يدوي إن قرر المالك عدم التفعيل على السهم. لا تغيّر قرار RTL للأسهم دون قرار منفصل؛ المشكلة هنا هي إدخال اللوحة في التسلسل.

### F-02 — `m-tabs` لا يملك overflow أو سياسة كثرة تبويبات

**التصنيف:** عيب مثبت عند استهلاك تبويبات طويلة — **P1/P2**.

**الأدلة المحلية:**

- `components/navigation/navigation.css:49-53` يعرّف `.m-tabs` كـ`display:flex` فقط؛ لا `overflow-x:auto`، ولا التفاف، ولا `min-width:0`/More، ولا إشارة للمستهلك عن الحد.
- `components/navigation/navigation.css:55-73` يترك التسمية داخل زر التبويب دون آلية احتواء عندما يزيد عدد التبويبات أو طولها.
- إعادة إنتاج بإضافة ثلاث تسميات عربية طويلة إلى المعاينة: عند viewport 320px كانت `clientWidth=190` و`scrollWidth=437` و`overflowX=visible`؛ عند 390px كانت `clientWidth=260` و`scrollWidth=437` و`overflowX=visible`. هذه قياسات DOM فعلية على Chromium وليست لقطة.
- لقطة الحالة القائمة `reviews/B07/screenshots/01-appbar-tabs-390.png` تعرض حالتي تبويب قصيرتين فقط؛ لا تثبت الحالة الطويلة.

**المعيار/الممارسة:** [Apple HIG — Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) يوصي بتقليل عدد التبويبات وتجنب overflow، واستخدام More عندما لا تكفي المساحة. [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) يحدد تفاعل لوحة المفاتيح لكنه لا يمنح CSS تصريحًا بإخراج المحتوى من viewport.

**الأثر:** عند استخدام عقد “عناصر قابلة للتغيير من المستهلك” لا يوجد guard يمنع خروج التبويبات من الشاشة أو يجعل الوصول إلى الطرف المخفي واضحًا. في RTL قد لا يكتشف المستخدم الطرف الخارج بصريًا، كما لا توجد إشارة تمرير.

**التوصية:** حدّد عقدًا واحدًا: (أ) `overflow-x:auto` مع مؤشرات/تسمية تمرير وفحص لوحة المفاتيح، أو (ب) حد وجهات وMore/قائمة، أو (ج) نمط تبويبات مختلف للبيانات الكثيرة. لا تتركه overflow مرئيًا صامتًا.

### F-03 — تكرار safe-area في تركيب الشريطين

**التصنيف:** عيب مثبت في تركيب المعاينة، أثره مشروط بكون `safe-area-inset-bottom > 0` — **P2**.

**الأدلة المحلية:**

- `previews/navigation/board.css:12-20`: `.sticky-foot` يضيف `padding-block-end: env(safe-area-inset-bottom, 0px)`.
- `components/navigation/navigation.css:100-108`: `.m-navbar` يضيف safe-area في padding السفلي.
- `components/navigation/navigation.css:257-268`: `.m-actionbar` يضيف safe-area في padding السفلي أيضًا.
- `previews/navigation/index.html:127-136` يركّب الثلاثة فعليًا: `sticky-foot` ← `m-actionbar` + `m-navbar`.

إذن في هذا التركيب تُحجز قيمة inset ثلاث مرات: أسفل actionbar، أسفل navbar، وأسفل الحاوية. Chromium يعطي `env(...) = 0`، لذلك لا تظهر الزيادة في `reviews/B07/screenshots/05-zoom-200-390.png` ولا في PASS B1–B3. على جهاز ذي home indicator/gesture inset موجب سيظهر فراغ إضافي وقد يزاح زر/محتوى أكثر من اللازم.

**الممارسة الرسمية:** [MDN `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) و[web.dev Screen configurations](https://web.dev/learn/design/screen-configurations) يوجهان إلى تطبيق inset على الحافة التي تحتاجه. لا ينبغي أن يملك كل ancestor وchild الحافة نفسها بلا عقد ملكية.

**التوصية:** اجعل safe-area مسؤولية outermost bottom surface في التركيب، أو افصل توكنًا/سمة `data-safe-area-owner` بحيث يضيف واحد فقط padding الحافة. اختبر قيمة inset اصطناعية موجبة على جهاز/WebKit أو harness خاص؛ لا يكفي Chromium بقيمة صفر.

## 4) المخاطر المحتملة غير المذكورة كفجوات تشغيلية

### R-01 — قفل `body` وحده وقفل root scrolling

`components/navigation/navigation.js:150-165` يحفظ ويغيّر `document.body.style.overflow` فقط. `reviews/B07/verification.txt:7,16` يثبت `bodyHidden: hidden` على Chromium، لا يثبت أن root scrolling مقفول في Safari/WebView أو عند كون `html` هو scroll container. كما أن `overscroll-behavior` في `components/navigation/navigation.css:218-224` يخص جسم الطبقة لا root.

[web.dev dialog component](https://web.dev/articles/building/a-dialog-component) يوضح أن `overscroll-behavior` وحده لا يكفي لقفل الصفحة، ويعرض قفل `html` أثناء modal؛ [MDN overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overscroll-behavior) يشرح أن الخاصية تمنع scroll chaining فقط على scroll containers.

**الحكم:** خطر محتمل، غير مثبت خارج Chromium. التوصية هي اختبار Safari/WebKit وWebView، ثم توحيد root scroll lock (`html`/`body` حسب الغلاف) مع حفظ القيم الأصلية، لا إضافة تغيير صامت قبل معرفة حاوية التمرير النهائية.

### R-02 — لوحة المفاتيح الافتراضية قد تغطي حقلًا داخل طبقة ثابتة

`components/navigation/navigation.css:156-167` يثبت الطبقة في أسفل viewport ويستخدم `max-height:86%` و`safe-area-inset-bottom` فقط. لا يوجد في المستودع محور/كود لـ`visualViewport` أو `navigator.virtualKeyboard` أو `keyboard-inset-*`، والـmeta في `previews/navigation/index.html:13` و`previews/navigation/example-usage.html:11` و`previews/compositions/index.html:5` لا يتضمن `viewport-fit=cover`.

هذا مهم تحديدًا لأن الفلتر يفتح مع `data-autofocus` على البحث (`previews/navigation/index.html:204-212`). [web.dev VirtualKeyboard](https://web.dev/virtualkeyboard) يذكر صراحة أن حقلًا قد يصبح محجوبًا عند ظهور لوحة المفاتيح، ويعرض `keyboard-inset-*`/`geometrychange`. [MDN `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) يميز keyboard insets عن safe-area.

**الحكم:** خطر محتمل على جهاز فعلي، وليس عيبًا مثبتًا من Chromium. `docs/UI-PLATFORM-NOTES.md:38-57` يقر بأن هذا المسار غير منفذ. المطلوب قبل اعتماد طبقة فلاتر على الهاتف: اختبار Android/Samsung Internet وiOS Safari، فتح اللوحة، ظهور لوحة المفاتيح، بقاء الحقل فوقها، وإغلاقها دون تحريك الصفحة الخلفية.

### R-03 — التركيز الأول على الإجراء المتلف

`previews/navigation/index.html:157-166` يضع `data-autofocus` على زر **حذف نهائي**، بينما زر الإلغاء هو البديل الأقل خطورة. [WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) يذكر أنه في خطوة نهائية غير قابلة للعكس قد يكون من الأنسب تركيز الإجراء الأقل تدميرًا. هذا توجيه قابل للتطبيق وليس WCAG إلزاميًا.

**الحكم:** خطر محتمل/قرار يحتاج المالك، وليس عيبًا مثبتًا؛ المالك قد يقصد تأكيد الإجراء مباشرة. لكن Enter/Space بعد فتح الحوار قد يذهب إلى الحذف، ولقطة `reviews/B07/screenshots/04-dialog-delete-390.png` تثبت وضوح الترتيب البصري لا سلامة focus. أوصي بتركيز الإلغاء أو عنوان/وصف ثابت ثم الحذف، وتوثيق القرار واختباره مع قارئ شاشة. يمكن أيضًا ربط الوصف البسيط بـ`aria-describedby="..."`؛ APG يجعله اختياريًا لكنه مفيد لحيثيات الحذف.

## 5) قرارات نظامية تحتاج المالك

### D-01 — التفاف شريط التنقل إلى صفوف متعددة مقابل حدود المنصة

العقد الحالي معلن في `components/navigation/specification.md:11-12` و`components/navigation/navigation.css:87-113`: لا عدد ثابت للعناصر، `flex-wrap`, `max-width:50%`، والارتفاع ينمو مع الصفوف. هذا قرار صريح، لذلك لا أصنفه عيب CSS عابرًا.

لكنه غير محسوم كسياسة تنقل عامة:

- [Android NavigationBar](https://developer.android.com/develop/ui/compose/components/navigation-bar) يخصصه لـ3–5 وجهات متساوية الأهمية في النافذة الصغيرة.
- صفحة [Samsung One UI Bottom navigation](https://developer.samsung.com/one-ui/comp/bottom-navigation.html) تقول إن التبويبات النصية في الأسفل تكون أقل من 4، وبحد أقصى 5 عند الحاجة، ولا تعتمد السحب بين التبويبات.
- [Apple HIG Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) يتجنب overflow ويقترح More للعناصر المخفية.

**الحكم:** قرار بصري/معماري يحتاج المالك. التفاف الوجهات إلى صفين يحافظ على النص، لكنه يغيّر ارتفاع شريط تنقل أساسي ويزيد زمن الوصول ويجعل نمط “شريط سفلي” مختلفًا عن التوقعات الرسمية. إن كان المقصود عرضًا تجريبيًا لتجميع عناصر عربية طويلة، فليُفصل class/variant عن شريط وجهات الإنتاج. وإن كان عقدًا عامًا، يلزم قرار واضح بين سقف 3–5، More، أو adaptive rail/sidebar.

### D-02 — app bar ثابت بسيط أم app bar متكيف مع التمرير؟

`components/navigation/navigation.css:25-44` يعرّف `m-appbar` كـflex عادي؛ لا `position:sticky/fixed` ولا scroll observer ولا variant ممتد/منكمش في `navigation.js`. [Samsung One UI App bar](https://developer.samsung.com/one-ui/comp/app-bar.html) يميز condensed/extended ويذكر أن الشريط الممتد ينكمش عند التمرير ويعود عند التمرير إلى أعلى. [Android Top app bar](https://developer.android.com/develop/ui/compose/quick-guides/content/display-top-app-bar) يعرض `scrollBehavior` للتقلص/التمدد.

**الحكم:** ليس عيبًا إذا كان `m-appbar` عقدًا ثابتًا صغيرًا؛ لكنه فجوة في القرار لأن الاسم والاستخدام داخل صفحة قابلة للتمرير قد يوحيان بغير ذلك. لا ينبغي ادعاء تكافؤ One UI. أوصي بتسمية الحالي `static appbar` أو إضافة variant opt-in موثق، مع اختبار حفظ الحالة عند العودة إن اختير النمط المتكيف.

### D-03 — هل يسمح النظام بصفائح/حورات متداخلة؟

`navigation.js:48` يحتفظ بـ`openLayers` stack، و`navigation.js:234-242` يسمح بفتح طبقة فوق أخرى، وA6 في `reviews/B07/verification.txt:10` يثبت Escape طبقة طبقة. هذا جيد تقنيًا من منظور APG؛ [WAI-ARIA Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) يصف الحوار فوق نافذة/حوار آخر.

لكن [Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) يوصي بإظهار sheet واحدة من الواجهة الرئيسية وإغلاق الأولى قبل إظهار الثانية، بينما [Apple Modality](https://developer.apple.com/design/human-interface-guidelines/modality) يحذر من تكديس modal views إلا حالات محدودة. [Android ModalBottomSheet](https://developer.android.com/develop/ui/compose/components/bottom-sheets) يطلب `onDismissRequest` وإزالة العنصر من composition بعد الإخفاء.

**الحكم:** قرار يحتاج المالك، وليس عيبًا مثبتًا. يلزم جدول مسموح: منتقي فوق صفحة، alert فوق منتقي؟ sheet فوق dialog؟ ماذا يفعل زر الرجوع/Back في الغلاف؟ لا يكفي أن stack يعمل برمجيًا؛ يجب فحص قارئ الشاشة، الإعلان، والعودة البصرية لكل حالة.

## 6) نقاط قوة مثبتة لا ينبغي فقدها

- `components/navigation/navigation.js:65-83,167-181` يحسب عناصر Tab الفعلية ويستبعد السالب/المعطل/المخفي و`inert`، ويحصر Tab داخل الطبقة.
- `components/navigation/navigation.js:120-165,228-240` يعزل الأشقاء ويحفظ `overflow` السابق بعدّاد، وهو أفضل من قفل/فتح ساذج.
- `components/navigation/navigation.js:244-302` يعالج إعادة الفتح أثناء الخفوت، ويمنع مؤقت الإغلاق القديم من إخفاء طبقة أعيد فتحها.
- `components/navigation/navigation.css:218-224` يوفر تمريرًا داخليًا و`overscroll-behavior:contain`؛ و`previews/navigation/index.html:183-194` يقدم حالة نص طويل.
- `components/navigation/navigation.css:175-191` و`shared/motion.css` يحترمان `prefers-reduced-motion`، وسجل A15 يثبت رصد الانتقال ثم الفورية عند التقليل.
- `components/navigation/navigation.css:257-271` يجعل `m-actionbar` يلتف بدل الخروج الأفقي عند تكبير النص؛ سجل B3 ولقطة `reviews/B07/screenshots/05-zoom-200-390.png` يثبتان الحالة في Chromium.
- التباين المقاس في `reviews/B07/contrast-check.txt:4-12` ناجح للأزواج المفحوصة؛ هذا لا يغطي قارئ شاشة أو جهازًا.

## 7) ما لم يُختبر — لا يُحوّل إلى PASS

وفق `components/navigation/specification.md:21-36` و`reviews/B07/review.md:41-43` و`docs/UI-PLATFORM-NOTES.md:38-57`:

1. قارئ شاشة فعلي: TalkBack/VoiceOver/NVDA، خصوصًا `aria-modal`, `inert`, إعلان `tabpanel`, focus restoration، وطبقات stack.
2. Safari/WebKit وSamsung Internet وWebView؛ محاولة WebKit المذكورة في المنصة لم تُنفذ بنجاح.
3. هاتف Android/iOS فعلي، لمس حقيقي، سحب، gesture navigation، home indicator، cutout، وقيم safe-area موجبة.
4. لوحة المفاتيح الافتراضية: البحث داخل filter panel، الحقول الطويلة، وتغير viewport أثناء فتح/إغلاق keyboard.
5. native/system text zoom؛ اختبار 200% الحالي محاكاة مرورين للخط وليست تكبير نظام.
6. predictive back/زر الرجوع في الغلاف، وهو منفصل عن Escape والمتصفح.
7. قياس أداء التمرير على جهاز منخفض القدرة أو أثناء طبقات ثابتة كثيرة.

## 8) خطة الإصلاح والتحقق — بالترتيب

1. **أصلح F-01**: أضف عقد `tabpanel` في تسلسل Tab عندما لا توجد أهداف داخلية، واكتب فحصًا سلوكيًا لا فحص وجود سمات فقط.
2. **أصلح F-02**: اختر سياسة overflow/More/سقف عدد التبويبات، ثم اختبر RTL، 320/360، نص عربي طويل، Home/End، وتمرير لوحة المفاتيح.
3. **أصلح F-03** في المعاينة/التركيب: اجعل مالك safe-area واحدًا، وأضف harness بقيمة inset موجبة؛ راجع كذلك `safe-area-inset-left/right` في edge-to-edge.
4. **احسم D-01..D-03** مع المالك قبل تعديل الشكل: سقف وجهات bottom nav، variant app bar، وسياسة stack/Back.
5. **اختبار جهاز/منصة مستقل:** iOS Safari/VoiceOver وAndroid/Samsung Internet/TalkBack مع keyboard, gesture insets, safe areas، وإعادة focus. لا تسجل نتيجته كبديل عن Chromium بل كطبقة تحقق إضافية.
6. **لا تعدّل** `shared/tokens.css` أو الهوية لإخفاء فجوات التنقل؛ المشكلة عقد وسياق وتمرير وليست Chart أو لونًا.

## 9) الملفات واللقطات التي تمت مراجعتها

### مصدر المكوّن والتكوين

- `components/navigation/navigation.js`
- `components/navigation/navigation.css`
- `components/navigation/specification.md`
- `previews/navigation/index.html`
- `previews/navigation/board.css`
- `previews/navigation/board.js`
- `previews/navigation/example-usage.html`
- `previews/compositions/index.html`
- `previews/compositions/compositions.css`
- `previews/compositions/compositions.js`
- `shared/tokens.css`
- `previews/board-base.css`
- `components/selection/selection.css`
- `components/selection/selection.js`

### وثائق وفحوص الحالة

- `reviews/B07/review.md`
- `reviews/B07/verification.txt`
- `reviews/B07/contrast-check.txt`
- `tools/b07-screenshots.py`
- `docs/UI-PLATFORM-NOTES.md`
- `docs/ux/UX-RULES.md`
- `docs/ux/F03-EXPERIENCE-BRIEF.md`
- `references/samsung-one-ui/MICRO-ADAPTATION.md`

### الأدلة البصرية

- `reviews/B07/screenshots/00-overview-390-full.png`
- `reviews/B07/screenshots/01-appbar-tabs-390.png`
- `reviews/B07/screenshots/03-filter-open-390.png`
- `reviews/B07/screenshots/04-dialog-delete-390.png`
- `reviews/B07/screenshots/05-zoom-200-390.png`
- `reviews/AFTER-DIRECTION/screenshots/1a-composition-320.png`
- `reviews/AFTER-DIRECTION/screenshots/1b-composition-360.png`
- `reviews/AFTER-DIRECTION/screenshots/1c-composition-430.png`
- `reviews/AFTER-DIRECTION/repair/screenshots/navigation-nested.png`
- `reviews/AFTER-DIRECTION/repair/screenshots/navigation-separate.png`

## 10) خلاصة نهائية

الجزء الصعب من B07 — عزل الخلفية، حصر التركيز، استعادة المشغّل، stack الإغلاق، التمرير الداخلي، وتقليل الحركة — منفذ بعناية ومسنود بفحوص Chromium. لكن النظام لا يزال يخلط بين “اللوحة تبدو صحيحة” و“العقد يعمل في كل مسار”: `tabpanel` يُتجاوز، tab overflow غير معالج، safe-area مكرر في التركيب، ولوحة المفاتيح/root scroll غير محسومين على الهاتف. أطلب معالجة F-01/F-02/F-03، ثم قرارات مالك صريحة لـD-01..D-03، قبل تحويل المحور من **REQUEST CHANGES** إلى مراجعة أجهزة/قارئات شاشة.


---

## A4 — البيانات والرسوم والجداول: النص الأصلي للتقرير

# تدقيق المحور: البيانات والرسوم والجداول وعروض المعلومات

- **المعرّف:** `data-visualization`
- **المستودع المراجع:** `.`
- **تاريخ التدقيق:** 2026-10-08
- **الحكم:** **CHANGES REQUIRED قبل اعتماد المحور**.
- **نطاق الحكم:** المصدر الجديد فقط. لم أستخدم المستودع القديم، ولم أقارن به، ولم أقترح إعادة استعماله. ذُكرت الرسوم بوصفها عائلة نظامية، لا باعتبار رسم واحد محور التحقيق.

## 1) خلاصة تنفيذية (20% الحالة الحالية)

المستودع يملك أساسًا جيدًا في **صدق الحساب** أكثر من المتوسط: المصدر في HTML، تحليل الرقم كاملًا، التمييز بين الصفر والمجهول والسالب، رفض مقياس bars/line غير الصالح أو المتجاوز، انقطاع الخط عند الفجوة، مفتاح donut بقيم خام، وfallback نصي لدوائر المقارنة. كما أن `metric-comparison` يضع القراءة الكاملة خارج الدائرة عندما لا يتسع النص، و`order-schedule` يملك شبكة تقويم بـ`role=grid` وتسمية خلية كاملة.

لكن الاعتماد الحالي يخلط بين **نجاح الرسم هندسيًا** وبين اكتمال **عرض البيانات كمعلومة قابلة للفهم والوصول**. أهم ما يمنع الاعتماد:

1. الرسم SVG الطبيعي يُعرض كـ`role="img"` مع `aria-label` قصير فقط؛ قائمة المصدر تحمل `hidden`، ولا يوجد جدول/قائمة بيانات كاملة مرتبطة بالرسم، ولا `aria-describedby` يربط الملخص المرئي. هذا يترك مستخدم قارئ الشاشة مع اسم الرسم، لا مع مجموعة القراءات الكاملة في حالة bars/line.
2. لا يوجد نمط جدول دلالي (`table/caption/th/td`) في المكونات والعينات المفحوصة. هذا ليس عيبًا في كل رسم صغير، لكنه فجوة نظامية لأن الإرشادات الرسمية تعتبر الجدول/البيانات القابلة للتنزيل مسارًا موازيًا مهمًا، خصوصًا عند كثرة النقاط أو الحاجة للمقارنة.
3. `bubbles` لا يشارك عقد المقياس الصريح مع bars/line: `data-max` غير الصالح يُستبدل بصمت، و`data-max` الأصغر من أكبر قيمة يضخم الدائرة فوق `rmax` بلا رفض أو ملاحظة. هذه فجوة صدق/اتساق مثبتة في المصدر.
4. الملخص النصي `data-summary-text` يُكتب مرة واحدة فقط؛ بعد إعادة التصيير وتغيير البيانات يمكن أن يبقى ملخص قديمًا. ادعاء «مصدر واحد» لا يشمل الملخص، ما يفتح باب معلومة مرئية متناقضة مع الرسم.
5. bars/line لا يرسمان تدريجات أو محاور رقمية ذات نطاق واضح؛ لا تظهر قيمة `data-max` في الحالة العادية. كل قيمة تُكتب فوق العلامة، لكن قراءة الارتفاع/السياق والمقارنة عبر رسوم متعددة أضعف من الممارسات الرسمية.

## 2) ما هو جيد ومثبت في الحالة الحالية

- **صدق الحالات:** `components/data/data.js:82-109` يحلل الرقم كاملًا، ويعامل الفارغ/غير الرقمي/NaN/∞ كمجهول بدل التخمين.
- **مقياس bars/line:** `components/data/data.js:355-377` يميز `auto/ok/invalid/over`، و`components/data/data.js:380-446` يرفض الرسم المشوه أو يوسعه فقط بخيار صريح.
- **فجوة الخط:** `components/data/data.js:564-578` يبني شرائح منفصلة عند القيمة المفقودة، فلا يصل بين نقطتين عبر فراغ صامت.
- **دونات صادقة:** `components/data/data.js:678-710` يفرق بين المقام غير الصالح، التعارض، عدم وجود البيانات، الإجمالي غير المعلوم، والحالة الصفرية دون قسمة على صفر.
- **قراءات مقارنة بديلة:** `components/metric-comparison/metric-comparison.js:214-246` ينقل النص الكامل إلى fallback عند ضيق الدائرة أو التداخل، و`metric-comparison.css:126-151` يعرض القائمة نصيًا.
- **ترميز لا يعتمد على اللون وحده في بعض المواضع:** أرقام وقيم وتسميات ظاهرة، ومجهول/صفر/سالب لها نصوص صريحة؛ bars/line لا يعتمد على hover (`components/data/data.css:108-110`).
- **اتساق تقويم الطلبات:** `components/order-schedule/specification.md:107-115` يوثق شبكة، roving tabindex، `aria-selected/current`، وتسمية خلية كاملة؛ الصفوف أزرار أصلية ≥48px وفق `order-schedule.css:426-454`.

هذه نقاط قوة حقيقية، لكنها لا تغلق فجوات الوصول والمعنى في المسار الطبيعي للرسم.

## 3) العيوب المثبتة محليًا

### D-01 — الرسم الطبيعي لا يقدّم dataset دلاليًا قابلًا للقراءة (P1)

**التصنيف:** عيب مثبت في بنية المصدر؛ أثر قارئ الشاشة الفعلي **لم يُختبر**، لذلك لا أدعي شهادة WCAG نهائية.

**الأدلة المحلية:**

- `components/data/data.css:125-129` يجعل SVG غير الدونات يتمدد فقط، و`components/data/data.css:159-160` يثبت أن `.m-chart__data[hidden] { display: none; }`.
- `components/data/data.js:465-470` ينشئ bars/line كـ`<svg role="img" aria-label="...">`.
- `components/data/data.js:562` يفعل الشيء نفسه للخط، و`components/data/data.js:650` للدونات.
- لا يوجد `aria-describedby` في `data.js` أو `previews/data/index.html` يربط `data-summary` بالرسم.
- البيانات الكاملة في المصدر مخفية في `previews/data/index.html:111-120`, `150-160`, `174-182`, `190-201`.

**المشكلة:** الاسم المتاح للرسم هو `data-title` فقط. في الحالة الطبيعية، قيم bars/line وأسماء الفئات موجودة داخل SVG أو في قائمة `hidden`، وليست dataset دلاليًا منفصلًا. الملخص المرئي بعد الرسم ليس وصفًا مرتبطًا برمجيًا به. وجود النص بصريًا في الصفحة لا يضمن أن مستخدم AT سيحصل على علاقة «هذا الوصف لهذا الرسم» أو على كل صفوف البيانات.

**المرجع الرسمي:**

- [WAI-ARIA APG — Providing Accessible Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/): الاسم قصير، والوصف الإضافي يربط عبر `aria-describedby` عند الحاجة؛ ويوصي بالاختبار لأن حساب الأسماء غير متسق إن أسيء تركيبه.
- [W3C WCAG — Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html): مخطط البيانات يحتاج وصفًا قصيرًا، ووصفًا أطول عند عدم كفاية القصير، و«حيثما كان عمليًا» البيانات الفعلية في جدول.
- [Apple HIG — Charts](https://developer.apple.com/design/human-interface-guidelines/charts): كل رسم يجب أن يكون متاحًا، مع وصف الغرض والبنية والمحاور والقيم المناسبة.

### D-02 — غياب نمط جدول بيانات دلالي/بديل قابل للتنزيل (P1/P2 حسب كثافة البيانات)

**التصنيف:** فجوة نظامية مثبتة في تغطية المحور، وليست مطالبة بأن يكون كل رسم جدولًا.

**الأدلة المحلية:** بحث مباشر في `components/`, `previews/data/`, و`previews/ux-patterns/order-schedule/` لم يجد أي `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th>`, `<td>` أو `role="table"`. `order-schedule` شبكة تقويم/قائمة (`components/order-schedule/specification.md:20-23`) وليست نمط جدول بيانات.

**الأثر:** لا يوجد مسار موحد للبيانات الخام عند كثرة النقاط، أو عند الحاجة للفرز/نسخ/مقارنة دقيقة، أو لمن يفضل عدم تفسير العلامات بصريًا. fallback الحالي في `renderScaleRefusal` وfallback المقارنة يغطي حالات محددة، لا العرض الطبيعي لكل رسم.

**المراجع الرسمية:**

- [Material — Top Tips for Data Accessibility](https://m3.material.io/blog/data-visualization-accessibility): توفير طريقة متاحة للوصول إلى dataset الأساسي، مثل CSV قابل للتنزيل أو جدول قابل للوصول؛ وتوفير الفرز/الترشيح عند الحاجة.
- [MDN — HTML table accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Table_accessibility): `caption` و`th` و`scope`/`headers` تعطي قارئ الشاشة علاقات الصفوف والأعمدة.
- [MDN — `<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table): استخدم `table` عندما تكون البيانات ثنائية الأبعاد في صفوف وأعمدة.

### D-03 — عقد مقياس bubbles غير صادق/غير متسق مع باقي الرسوم (P1)

**التصنيف:** عيب مثبت.

**الأدلة المحلية:**

- `components/data/data.js:773-781` يقرأ `data-rmax` و`data-max`، لكنه يجعل `vmax` تلقائيًا إذا كان `data-max` غير صالح، بلا حالة خطأ أو تشخيص.
- `components/data/data.js:803-808` يحسب `r = Rmax * Math.sqrt(it.value / vmax)` دون التحقق من أن `vmax >= أكبر قيمة` ودون clamp/رفض/ملاحظة.
- لذلك مع `data-max="5"` وقيمة `10` تصبح `r = Rmax × √2`؛ الدائرة تتجاوز الحد المعلن بصريًا. أما bars/line فلديهما A01 صريحًا في `data.js:355-446` يرفضان الحالة أو يوسّعانها بملاحظة.
- العينة `previews/data/index.html:187-203` تختبر قيمًا كلها تحت `data-max=100`، لذلك لا تكشف الحالة.

**الأثر:** نفس نظام البيانات يعرض خطأ صريحًا في bars/line لكنه يغيّر معنى/حجم bubble بصمت. هذا يخرق دقة الترميز بالمساحة ويصعّب المقارنة بين العائلات.

### D-04 — الملخص النصي يمكن أن يصبح قديمًا بعد تغيير البيانات (P1/P2)

**التصنيف:** عيب عقد/خطر صدق مثبت في التنفيذ؛ شدة الأثر تعتمد على ما إذا كان المستهلك يغيّر البيانات.

**الأدلة المحلية:**

- `components/data/data.js:862-880` يعيد الرسم من `m-chart__data` ثم يملأ الملخص فقط عند فراغه: `if (summary && !summary.textContent && data-summary-text) summary.textContent = ...`.
- `previews/data/example-usage.html:21-29` يضع مصدر البيانات والملخص منفصلين، ثم `example-usage.html:43-49` يغير القيمة 8→11→8 ويعيد التصيير. المثال يكشف وجود مصدر ثانٍ للملخص حتى لو كان النص العام فيه غير رقمي.
- عينة اللوحة تضع ادعاءات رقمية في `data-summary-text` مثل `previews/data/index.html:111`, `150`, `174`, `188`, `272`, `285`.

**الأثر:** إذا غير المستهلك الفئات أو القيم أو المرشح، قد يبقى `p[data-summary]` يصف حالة سابقة. هذا يتعارض مع توصية Material بتحديث الملخص بعد التفاعل، ومع Apple HIG التي تعتبر الوصف جزءًا من معنى الرسم.

## 4) مخاطر محتملة وفجوات غير محسومة

### R-01 — تباين ألوان علامات البيانات غير مضمون (P1 بصري محتمل)

الألوان الفعلية في `shared/tokens.css:120-125` هي:

- `a #164D59` — نحو 9.38:1 على الأبيض.
- `b #F4AD76` — نحو 1.89:1 على الأبيض.
- `c #B6A3D6` — نحو 2.28:1 على الأبيض.
- `d #496D92` — نحو 5.40:1 على الأبيض.
- `e #B3BD7B` — نحو 2.00:1 على الأبيض.

الحساب أعلاه من قيم التوكنات مقابل سطح أبيض؛ لا يعوّض قياس موضعي للصورة. `components/data/data.css:162-167` يضع هذه الألوان كألوان marks، وbars/line وdonut لا يضيفان فاصلًا/نمطًا مستقلًا للشرائح الفاتحة (`data.css:181-200`). أداة `tools/contrast-check.py` تخص أزواج نص/أسطح S01 ولا تثبت تباين ألوان البيانات نفسها.

**المرجع:** [web.dev — Color and contrast](https://web.dev/learn/accessibility/color-contrast) و[Material Data visualization](https://m2.material.io/design/communication/data-visualization.html) يطلبان عدم الاعتماد على اللون وحده، واستخدام تباين/شكل/نمط/نص إضافي. النص والقيم الحالية تقلل الخطر، لكنها لا تثبت وضوح العلامة الملونة نفسها؛ يلزم اختبار grayscale/low vision وقرار palette أو outlines/separators.

### R-02 — الاسم المتاح لا يطابق العنوان المرئي

في العينة، العنوان المرئي هو `توزيع العمليات (3 فئات)` (`previews/data/index.html:112`) بينما `data-title` هو `توزيع العمليات على الفئات` (`:111`). ويُستخدم الأخير مباشرة في `aria-label` (`data.js:465-469`). يوجد إذن مصدران لاسم الرسم، ولا `aria-labelledby` يشير إلى `h3`. هذا خطر صيانة/ترجمة واتساق أكثر منه عطلًا بصريًا فوريًا.

[MDN aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) و[WAI APG](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/) يفضلان `aria-labelledby` عندما يوجد نص مرئي، بدل تكرار اسم مخفي.

### R-03 — لا إعلان متاح عند إعادة التصيير الديناميكي

`data.js:877-880` يطلق `micro-data:rendered` كحدث DOM، لكنه لا يملك live region ولا يحدّث وصفًا متاحًا للرسم. عند تطبيق filter أو تبديل فترة، قد يتغير الرسم دون إعلان للمستخدم الذي لا يراه. هذا **خطر محتمل** لأن الاستهلاك الحالي قد يكون ثابتًا؛ يلزم عقد واضح: تحديث description/summary في مكان مرتبط، أو إعلان اختياري لا يكرر الرسالة.

Apple VoiceOver يذكر صراحة: [Make charts and infographics fully accessible](https://developer.apple.com/design/human-interface-guidelines/voiceover)، وإبلاغ AT بتغير المحتوى/التخطيط المرئي.

### R-04 — قابلية استكشاف البيانات غير موجودة كأنماط جاهزة

لا توجد في عائلة data أزرار/تفاعلات للفرز، filter، zoom/pan، pagination، CSV، أو تحديد نقطة. للمكوّن الصغير الثابت قد يكون هذا قرارًا صحيحًا، لكنه يصبح فجوة عند dashboard أو dataset كبير. Material وSamsung One UI يربطان سهولة الاكتشاف بالتحكم والفلترة/التفاعل؛ وApple تؤكد ألا تُشترط التفاعلات للوصول إلى المعلومات الحرجة، لكنها تشجع مسارًا منطقيًا للبيانات التفاعلية.

**التصنيف:** خطر محتمل + قرار يحتاج المالك، لا أصف غياب التفاعل بعيب إذا كان نطاق B05 ثابتًا ومختصرًا.

### R-05 — bubbles لا يملك grouping/accessibility contract صريحًا

`components/data/data.js:782-813` يبني `div.m-bubbles` و`div.m-bubble` مع قيمة ثم دائرة ثم label؛ الدائرة ليست معلّمة `aria-hidden`، ولا يوجد اسم/وصف لكل عنصر يربط label بالقيمة. النص موجود، لذا لا أعدّه عيبًا مثبتًا قبل اختبار AT، لكن ترتيب «القيمة ثم الاسم» وغياب grouping قد يضعف الفهم لقارئ الشاشة. هذا منفصل عن bug المقياس D-03.

## 5) فجوات لم يذكرها المالك صراحة

هذه ليست إعادة صياغة لملاحظة Chart؛ هي نتائج نمطية عبر العائلات:

1. **غياب table/CSV كمسار بيانات أساسي**، لا مجرد fallback لحالات خطأ.
2. **عدم ربط title/summary بالرسم برمجيًا** رغم وجود نص مرئي و`data-summary`.
3. **summary drift** عند إعادة التصيير، لأن النص يكتب مرة واحدة ولا يُمسح أو يُحدّث بعقد.
4. **عدم اتساق عقد المقاييس**: bars/line صارمان، bubbles يقبلان max ناقصًا/سيئًا بصمت.
5. **غياب تدريجات ومحاور نطاق** يجعل `data-max` عقدًا داخليًا لا سياقًا بصريًا في الحالة العادية.
6. **ألوان البيانات الفاتحة لم تدخل فحص التباين المنشور**؛ فحص S01 لا يغطي marks.
7. **غياب إعلان تغير البيانات لـAT** رغم وجود حدث داخلي `micro-data:rendered`.
8. **غياب سياسة كثافة البيانات**: لا حد/ترقيم/تصفية/ترقيم صفحات/اختصار معرف عند عشرات أو آلاف النقاط.
9. **غياب نمط ثابت لأسماء الرسوم**: `h3` المرئي و`data-title` قد يتباعدان.
10. **عدم وجود اختبار قارئ شاشة/شجرة وصول** يثبت أن SVG، legend، fallback، وملخص الرسم تُقرأ ككتلة واحدة مفهومة.

## 6) مقارنة 80/20 بالممارسات الرسمية

| المرجع | الممارسة الرسمية المناسبة | حالة المستودع الجديد | الحكم |
|---|---|---|---|
| [Material M3 — Data Accessibility](https://m3.material.io/blog/data-visualization-accessibility) | تسهيل المقارنة، ملخص للمغزى، labels للبؤر، filtering/sorting عند الحاجة، رابط إلى CSV أو جدول متاح | توجد قيم/labels وملخص مستهلك، لكن لا dataset متاح طبيعيًا ولا filter/sort/CSV ولا ربط برمجي للملخص | D-01/D-02 + R-04 |
| [Material Data Visualization](https://m2.material.io/design/communication/data-visualization.html) | الدقة، القابلية للتوسع، عدم الاعتماد على اللون، محاور وتسميات، baseline صفر للأعمدة، legend/annotations، تبسيط العرض الصغير | baseline صفر جيد، والفئات مسماة؛ لكن لا ticks/scale ظاهر في bars/line، palette فاتحة بلا فحص marks، ولا simplification strategy للكثافة | R-01 + فجوة محاور |
| [Apple HIG — Charts](https://developer.apple.com/design/human-interface-guidelines/charts) | axis/ticks/gridlines للسياق، وصف الغرض والرسالة، labels ذات سياق، لا تفرض interaction للمعلومة الحرجة، تفاعل منطقي عند الحاجة، لا لون وحده | `aria-label` اسم فقط، الملخص غير مربوط، لا ticks، لا summary مضمون التحديث، ولا مسار تفاعل/استكشاف | D-01/R-02/R-03 |
| [Apple HIG — VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover) | وصف موجز لكل infographic، تفاعل متاح عبر AT، إبلاغ التغييرات، عناوين وتسلسل واضح | لا وصف مرتبط، لا اختبار VoiceOver/TalkBack، حدث داخلي بلا live/description contract | D-01/R-03/U-01 |
| [Samsung Design System — Chart](https://developer.samsung.com/design-system/chart) | Simple/Accurate/Distinct/Easy to discover؛ تمييز كل data بمعنى ثابت، وإتاحة التفاعل عند كثافة البيانات | تعيين series ثابت جيد، لكن light marks غير مضمونة التباين، وbubbles تقبل max غير صالح، ولا discoverability controls | D-03 + R-01/R-04 |
| [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/) | اسم قصير، وصف منفصل عند الحاجة، prefer visible text عبر `aria-labelledby`، اختبار حساب الاسم | `aria-label` مكرر من `data-title`، لا `aria-labelledby`/`aria-describedby`، ولا AT test | D-01/R-02/U-01 |
| [W3C WCAG Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html) | بديل قصير + طويل عند عدم كفاية القصير؛ جدول فعلي حيثما أمكن | ملخص بصري غير مرتبط، data source hidden، لا table fallback طبيعي | D-01/D-02 |
| [MDN Table accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Table_accessibility) | caption، thead/tbody، th/scope أو headers لعلاقات الخلايا | لا نمط table داخل المصدر المفحوص | D-02 |
| [web.dev — Accessibility tips](https://web.dev/articles/a11y-tips-for-web-dev) و[Color/contrast](https://web.dev/learn/accessibility/color-contrast) | نص بديل، keyboard/AT، لا color alone، contrast، تكبير، اختبار accessibility tree وAT | النص موجود جزئيًا لكن chart dataset غير دلالي؛ لا اختبار tree/AT؛ palette marks تحتاج فحصًا | D-01/R-01/U-01 |

## 7) القرارات البصرية/قرارات المالك التي يجب فصلها عن العيوب

### قرار بصري موثق، لا إصلاح صامت

- `components/data/specification.md:40-47` و`:45` يوثقان أن القص عند عرض 320 قد يصل إلى حرف + «…» (`م…مبيعات`، `10/…`) مع القراءة الكاملة في `aria-label`/`title`. هذا **قرار بصري يحتاج توقيع المالك**: هل الأولوية لعدم تداخل الجيران أم وضوح الاسم المرئي؟ لا أوصي بإزالة القص بلا بديل؛ أوصي بمفتاح مرئي/تفاصيل بالنقر إن كانت الكثافة مهمة.

### قرارات يحتاجها المالك

1. هل B05 يستهدف رسومًا ثابتة قصيرة فقط، أم dashboards قابلة للاستكشاف؟ إذا كانت الثانية، يجب اعتماد controls مشتركة للفرز/الفلترة/التقسيم والبيانات البديلة.
2. هل الجدول البديل مطلوب دائمًا، أم عند كثافة/تعقيد/فشل الرسم فقط؟ القرار يؤثر على API وlayout وليس على حساب الرسم.
3. هل تُقبل palette الحالية للفئات الفاتحة مع labels، أم تُفرض عتبة 3:1 للعلامات/فواصل/أنماط؟ لا يقرر المراجع هوية الألوان بدل المالك.
4. هل كل تحديث بيانات يجب أن يحدّث summary متاحًا، أم أن المستهلك مسؤول عن كتابة `data-summary` يدويًا؟ العقد الحالي غير صريح ويحتاج حسمًا.

## 8) ما لم يُختبر — لا تعتبر Chromium شهادة جهاز فعلي

- `components/data/specification.md:65-67` يقر صراحة: لا قارئ شاشة فعلي، لا لمس حقيقي، لا متصفحات غير Chromium، وأداء المجموعات الكبيرة غير مفحوص.
- `tools/data-scale-state-check.py:15-17` يوضح أن Chromium هو الافتراضي، وأن WebKit إن شُغّل لا يعادل Safari حقيقيًا أو جهازًا أو قارئ شاشة.
- `reviews/UI-RELEASE/review.md:16-29` يثبت أن الأرقام 321/321 ضمن نطاقات أدوات محددة فقط، وأن Firefox/WebKit/Safari/الهاتف الفعلي/القارئ/التكبير الأصلي غير مختبرة.
- محاولة إعادة تشغيل `tools/data-scale-state-check.py` في بيئة هذا التدقيق توقفت قبل الاختبارات لأن executable الخاص بـPlaywright Chromium غير مثبت (`BrowserType.launch: Executable doesn't exist`). لذلك لا أضيف نجاحًا جديدًا ولا أتعامل مع اللقطات التاريخية كاختبار حي.
- غير مفحوص: VoiceOver/TalkBack/NVDA، شجرة الوصول الفعلية، Safari/Samsung Internet/Firefox، لمس أصابع حقيقي، اتجاه LTR على جهاز، high-contrast/forced-colors، grayscale/color-vision simulation على كل marks، آلاف النقاط، تغييرات بيانات سريعة وResizeObserver تحت الضغط.

## 9) أدلة بصرية

- `reviews/UI-RELEASE/screenshots/data.png` — لقطة **390×874**: عمود dark واحد وقيمة صفر/مجهول؛ تؤكد وضوح القيمة والlabel في المثال، لكنها تُظهر أيضًا عدم وجود تدريجات/محور رقمي ظاهر.
- `reviews/UI-RELEASE/screenshots/metric-comparison.png` — لقطة **390×874**: دوائر مقدار مع fallback نصي وقيمة رئيسية/أشرطة؛ تؤكد أن fallback موجود في هذه العائلة، لكنها ليست بديلًا عامًا لـbars/line.
- لا أعتبر أيًا من اللقطتين دليلًا على قارئ شاشة أو جهاز فعلي.

## 10) خطة توصيات مرتبة

### P0/P1 — قبل الاعتماد

1. **وحّد عقد الوصول للرسم:** أعطِ العنوان المرئي ID، استخدم `aria-labelledby` للـSVG، واربط `data-summary` عبر `aria-describedby`. اجعل الوصف يذكر نوع الرسم، المحاور/النطاق، الوحدة، الرسالة الرئيسية، وحالات missing/outlier.
2. **أضف dataset بديلًا:** جدولًا دلاليًا (`caption`, `thead/tbody`, `th scope`, قيم/حالات) أو disclosure واضحًا «عرض البيانات كجدول»، مع خيار CSV عندما يكون السيناريو تحليليًا. لا تجعل المصدر `hidden` هو المسار الوحيد.
3. **طبّق A01 على bubbles:** `data-max` الغائب = auto موثق؛ غير الصالح = رفض مع القراءات؛ الأصغر من أكبر قيمة = refuse افتراضي أو rescale صريح؛ لا دائرة تتجاوز `rmax` بصمت.
4. **أصلح summary drift:** إمّا أن يُحدّث الملخص في كل render من API يملكه المستهلك، أو تُمسح/تُعاد كتابة نسخة المستهلك وفق عقد صريح. لا تسمح بوصف قديم مرتبط بالرسم الجديد.

### P2 — جودة الفهم والمرونة

5. أضف تدريجات/حدودًا رقمية دنيا مناسبة لـbars/line، أو وثّق قرارًا صريحًا بأن labels الكاملة بديل كافٍ، مع إظهار الوحدة والنطاق في العنوان/الوصف.
6. أضف فحصًا مستقلًا لألوان data marks: التباين مقابل الأسطح الفعلية، grayscale/forced-colors، وفواصل أو patterns للـdonut/العلامات الفاتحة. أبق الأسماء والقيم النصية كترميز ثانٍ.
7. أضف contract اختياريًا للتحديث: عند تغير filter/period، يُحدّث الوصف المتاح ويعلن التغيير مرة واحدة فقط؛ لا تعتمد على `micro-data:rendered` الداخلي دون قناة للمستخدم.
8. عرّف grouping لكل bubble (`li`/اسم accessible واضح، والدائرة `aria-hidden` إن كانت زخرفية)، واختبر ترتيب label/value RTL/LTR.

### P3 — سياسة منتج/قياس

9. حدّد حد كثافة: متى ينتقل الرسم إلى table/pagination/aggregation، ومتى يظهر filter/sort/zoom. أضف اختبار أداء لـ100 و1,000 نقطة على الأقل.
10. نفّذ اختبار AT حقيقي متعدد المسارات: NVDA/Chrome أو TalkBack/Samsung Internet أو VoiceOver/Safari، مع فحص labels/description/fallback/update، ولا ترفع نتيجة Chromium إلى «دعم جهاز».

## 11) الحكم النهائي

**CHANGES REQUIRED.** الحسابات الأساسية والتمييز بين الحالات قوية، لكن محور «عرض المعلومات» غير مكتمل: المسار الطبيعي لا يقدم dataset دلاليًا/جدولًا بديلًا، اسم/ملخص الرسم غير مربوطين برمجيًا، bubbles تكسر اتساق المقياس، والملخص قابل للتقادم. بعد إغلاق D-01..D-04 وإضافة اختبار AT/جدول بديل وفحص palette، يمكن إعادة التقييم. القرارات الخاصة بالتفاعل والكثافة والهوية البصرية تُعاد للمالك ولا تُغلق بقرار مراجع.


---

## A6 — Web-Native وPWA: النص الأصلي للتقرير

> **AUDIT-ONLY / خارج تنفيذ UI الحالي:** هذا المحور محفوظ لاكتمال الأدلة فقط. لا ينفذ Zed AI أي بند منه في جولة إصلاح المكونات الحالية، ولا يضيف طبقة منصة أو تثبيت أو تكيف أو رجوع/مسارات بناءً عليه. المرجع التنفيذي الوحيد هو قفل النطاق في §1.5 ومواصفة إصلاح UI.

# تدقيق محور Web-Native وPWA وقيود الهاتف

- **المعرّف:** `web-native-pwa`
- **النطاق:** مستودع UI الجديد في `.` فقط.
- **تاريخ التدقيق:** 2026-10-08.
- **النتيجة التنفيذية:** **المخرجات مناسبة كمعاينات ويب محلية/ملف مستقل، وليست PWA قابلة للتثبيت أو تطبيق Web-Native إنتاجي حتى الآن.** توجد أدلة جيدة على إعادة التدفق في Chromium عند 320/390/430px، لكن لا توجد طبقة PWA أصلًا، كما أن الحواف الآمنة العلوية، لوحة المفاتيح، رجوع النظام، WebKit، واللمس الفعلي غير مثبتة على جهاز.
- **حدود مهمة:** نجاح Chromium/Playwright لا يُعامل كشهادة Android أو iOS أو Samsung Internet أو Safari، ولا كإثبات لعمل PWA مثبتة.

## 1) ملخص الحالة الحالية — 20%

1. المستودع يصرّح صراحة بأنه **مكتبة UI ومعاينات للمراجعة وليست اعتمادًا إنتاجيًا**: `README.md:1-3,19-24,29-35`، و`docs/UI-FINAL-HANDOFF.md:5,14-18,41`.
2. عينة F03 موصوفة كعينة هاتف مستقلة، لا منتجًا: `previews/ux-patterns/mobile-record-sample/README.md:1-11`. يوجد مصدر HTML/CSS/JS وملف `standalone.html` واحد يعمل عبر `file://` مع الأصول مضمنة (`README.md:7-11`؛ `standalone.html:1-8`). هذا **ليس** وضع PWA المثبتة.
3. كل صفحات المعاينات تقريبًا تحتوي `meta viewport` من نمط `width=device-width, initial-scale=1`; المثال الحي: `previews/ux-patterns/mobile-record-sample/index.html:22-27`، والملف المستقل: `standalone.html:56-62`. لا يوجد `user-scalable=no`، وهذه نقطة جيدة للحفاظ على تكبير المستخدم.
4. عينة F03 مصممة هاتفًا أولًا: عمود بحد أقصى 560px، حشو أفقي، التفاف للنص الطويل، وأهداف لمس من توكن المشروع: `example.css:10-33,152-183,193-210`.
5. شريط التنقل السفلي الثابت يستخدم `env(safe-area-inset-bottom)`، والحشو السفلي يستخدم ارتفاع navbar مقيسًا عبر `ResizeObserver`: `example.css:567-580,618-633`، و`docs/ux/F03-COMPLETE-EXPERIENCE-BRIEF.md`/`previews/ux-patterns/mobile-record-sample/example.js` كما تثبته مراجعة F03.
6. فحوص المصدر والمحاكاة أثبتت في Chromium headless: 46/46 مسارًا، 207 تحقيقات، صفر أخطاء صفحة/موارد في جولة F03، مع إعلان الحدود صراحة: `reviews/UX-F03/round-r3/review.md:5-14,31-44`.
7. Probe مستقل محلي (Chromium، viewport محاكى، 320/390/430) وجد `scrollWidth == innerWidth` للمصدر والملف المستقل، بلا أخطاء صفحة؛ لكنه وجد أيضًا `manifest=null` في كل المقاسات. هذه نتيجة ويب محاكى وليست اختبار جهاز.

## 2) الفجوات والمقارنة الرسمية — 80%

### A. عيوب/فجوات مثبتة في طبقة التسليم

#### F-PWA-001 — لا يوجد عقد PWA قابل للتثبيت (فجوة مثبتة؛ قرار مالك إذا كانت PWA خارج النطاق)

**الدليل المحلي:** بحث المستودع لم يجد أي `*.webmanifest` أو service worker فعلي. `MANIFEST.json` الموجود في الجذر هو فهرس بصمات للتسليم، وليس Web App Manifest. لا توجد في `previews/**/*.html` وصلة `rel="manifest"`، ولا تسجيل `navigator.serviceWorker` أو `beforeinstallprompt`: المثال `previews/ux-patterns/mobile-record-sample/index.html:22-27`، و`standalone.html:1-8,56-62`.

**المعيار الرسمي:**

- [web.dev — Web app manifest](https://web.dev/learn/pwa/web-app-manifest): يجب إنشاء manifest وربطه عبر `<link rel="manifest">` في صفحات PWA، ويحدد الاسم والأيقونات و`start_url` و`display` وغيرها.
- [web.dev — Install criteria](https://web.dev/articles/install-criteria): مسار Chrome للتثبيت يحتاج HTTPS وmanifest فيه `name`/`short_name`، أيقونات 192 و512، `start_url` و`display` صالحًا.
- [web.dev — Service workers](https://web.dev/learn/pwa/service-workers): يجب تسجيل service worker ليصبح قادرًا على اعتراض الطلبات وتقديم shell/cache عند ضعف الشبكة أو انقطاعها.

**الحكم:** إذا كان المطلوب من هذا المحور مجرد معاينات UI، فهذه **حدود نطاق مقصودة** وليست عيبًا في المكتبة. إذا كان المطلوب PWA، فهذه فجوة مانعة للتثبيت وليست حالة PASS.

#### F-PWA-002 — لا يوجد اتساق metadata للتجربة المثبتة (فجوة مثبتة)

`theme-color` يظهر في فهرس المكتبة فقط (`previews/index.html:3-7`) ولا يظهر في رأس F03 (`index.html:22-27`) أو الملف المستقل (`standalone.html:56-62`). لا توجد `icons` أو `start_url` أو `display` أو `scope` أو `orientation` بصيغة Web Manifest، ولا `apple-touch-icon` أو حزمة أيقونة PWA. الأصول التي تحمل شعارًا في `assets/brand/micro-logo/...` ليست مرتبطة تلقائيًا بmanifest، ولا تثبت أحجام 192/512/maskable المطلوبة للتثبيت.

**الحكم:** عيب تسليم PWA مثبت بالبحث النصي، لكنه لا يعيب معاينة HTML إذا لم تكن هذه المعاينة نقطة تثبيت.

#### F-MOBILE-001 — safe-area علوية غير معالجة في كود التجربة (خطر محتمل مثبت في المصدر، أثره غير مثبت على جهاز)

الكود يعالج الحافة السفلية فقط: `.f03-navbar` عند `example.css:570-580` و`.f03-foot` عند `example.css:618-625` يستخدمان `env(safe-area-inset-bottom)`. في المقابل يبدأ المحتوى العلوي من `.f03-main` بحشو توكن ثابت (`example.css:29-33`) وapp bar بحشو عادي (`example.css:36-53`) بلا `env(safe-area-inset-top)`.

**الممارسة الرسمية:**

- [MDN — `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env): `safe-area-inset-*` يحدد المستطيل المرئي الآمن حول النوتش/الحواف غير المستطيلة، ويشمل أيضًا حالات لوحة المفاتيح والمتغيرات الخاصة بالأجهزة القابلة للطي.
- [Android — Edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge): عند edge-to-edge يجب التعامل مع system bars وdisplay cutouts وsystem gesture insets، خصوصًا للعناصر القابلة للنقر والمحتوى القابل للتمرير.
- [Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout): يجب احترام safe area والتكيف مع Dynamic Island وأحجام/اتجاهات/نوافذ مختلفة.

**الحكم:** لا يمكن تسميته عيب جهاز مثبتًا لأن `viewport-fit=cover` وPWA standalone وiPhone/Samsung الفعلي لم تُختبر. لكنه فجوة تصميمية يجب إغلاقها قبل ادعاء edge-to-edge.

#### F-MOBILE-002 — لا توجد سياسة صريحة للوحة المفاتيح المرئية/إعادة تدفق viewport (خطر محتمل؛ غير مختبر)

بحث المصدر عن `interactive-widget`, `visualViewport`, `keyboard-inset-*` و`scrollIntoView` لم يعثر على معالجة في F03. رأس الصفحة يكتفي بـ`width=device-width, initial-scale=1` (`index.html:25`). لا يوجد عقد يضمن بقاء الحقل النشط وزر الحفظ فوق لوحة المفاتيح عند فتحها.

**المعيار الرسمي:** [MDN — viewport](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport) يوضح أن `interactive-widget` يحدد ما إذا كانت لوحة المفاتيح تغيّر visual viewport أو content viewport أو تغطي المحتوى، وأن `viewport-fit=cover` يحتاج safe-area insets لتفادي القص.

**الحكم:** ليست إعادة إنتاج لعيب؛ هي **خطر محتمل** يحتاج تجربة لوحة مفاتيح حقيقية على Android/iOS. وقد أعلن المستودع نفسه أن لوحة الهاتف والحقول الفعلية `NOT RUN`: `docs/UI-PLATFORM-NOTES.md:45-55` و`reviews/UX-F03/round-r3/review.md:42-44`.

#### F-NAV-001 — التنقل حالة داخلية فقط ولا يوجد عقد URL/history/deep-link (فجوة غير مذكورة؛ خطر Web-Native)

الحالة تبدأ وتُدار كمتغير JS (`example.js:254-260`، `state.view`) مع أزرار رجوع داخلية، مثل فتح/رجوع الطلبات (`example.js:2067-2075`). لا توجد إحالات `history.pushState` أو `replaceState` أو `popstate` في مصدر F03. بذلك لا يوجد عقد لإعادة فتح الوجهة الحالية عند reload، أو deep link، أو التفريق بين زر رجوع النظام ورجوع داخل التجربة.

**الحكم:** في معاينة محلية هذا قرار بسيط ومقبول. في PWA مثبتة هو **خطر محتمل** لأن زر رجوع النظام/المتصفح قد يخرج من التطبيق أو يعيد البوابة بدل الرجوع من التفاصيل إلى القائمة. يلزم قرار مالك قبل فرض router؛ ليس اقتراح إعادة استخدام مستودع آخر.

### B. مخاطر/قرارات التكيف المنصّي

#### F-ADAPT-001 — نفس العمود ونفس bottom navigation على النوافذ الواسعة (قرار بصري/قرار يحتاج المالك)

`example.css:29-33` يثبت عمودًا بحد أقصى 560px، و`example.css:570-580` يثبت navbar سفليًا بحد أقصى 560px. لا توجد قواعد انتقال إلى rail/drawer أو multi-pane عند 600/840px، ولا viewport-segment logic. هذا متسق مع عينة هاتف، لكنه ليس تكيفًا كاملًا لشاشات Fold/Tablet/desktop PWA.

**الممارسة الرسمية:**

- [Samsung — Large screens and foldables](https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html): Compact أقل من 600 يعتمد bottom navigation، وMedium/Expanded ينتقل إلى navigation rail/drawer؛ كما يوصي multi-pane عند 600/960dp وفوقها.
- [Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout): التكيف يكون حسب المساحة المتاحة/size classes لا حسب نوع الجهاز أو الاتجاه فقط، مع دعم تغير حجم النص والنوافذ.
- [Android — adaptive apps](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes): window size classes أساس لاختبار layout المتكيف.

**الحكم:** لا يعد عيبًا في نطاق F03 الهاتف فقط. يجب أن يقرر المالك هل المستهدف Compact-only، أم PWA يستهدف Tablet/Foldable أيضًا. إذا كان الثاني، فالتصميم الحالي لا يحقق ذلك.

#### F-TOUCH-001 — 48 CSS px ليست شهادة 48dp/44pt (قرار يحتاج المالك؛ لم يُختبر)

المستودع يقيس أهداف لمس 48px كقاعدة مشروع (`docs/UI-PLATFORM-NOTES.md:30,57`، و`example.css:157`). [Material 3](https://m3.material.io/foundations/designing/structure) يوصي عادةً بـ48×48dp، مع ذكر أن iOS يوصي 44×44؛ لكن المستند نفسه يقر بأن `48 CSS px ≠ 48dp ≠ 44pt`. لا توجد معايرة فعلية لكثافة الجهاز أو لمس إصبع أو إيماءات النظام.

**الحكم:** قرار قياس بصري صالح للويب، وليس عيبًا مثبتًا. يلزم اختبار لمس حقيقي ومعيار قبول منفصل لكل منصة.

#### F-ARIA-001 — semantics موجودة لكن دعم قارئات الشاشة المحمولة غير مثبت (غير مختبر)

العينة تستخدم `role=dialog`, `aria-modal`, `aria-labelledby`, `inert` وإرجاع focus في طبقاتها، وتُظهر نتائج فحوص التركيز في `reviews/UX-F03/round-r3/review.md:20-29`. لكن [WAI-ARIA APG — Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/) يحذر صراحة من فجوات الدعم بين المتصفح وAT على الهاتف ويطلب اختبارًا فعليًا، كما يوصي بإعادة التركيز إلى المشغّل عند الإغلاق. `docs/UI-PLATFORM-NOTES.md:47-49` و`reviews/UX-F03/round-r3/review.md:42-44` يعلنان TalkBack/VoiceOver غير منفذين.

**الحكم:** لا أسجل عيب ARIA جديدًا دون اختبار سمعي؛ أسجل **عدم اختبار** فقط.

#### F-OFFLINE-001 — offline هنا bundling لملف واحد، لا offline PWA (قرار يحتاج المالك)

`standalone.html:1-8` يضمن أن الخطوط والأيقونات وCSS/JS مضمّنة وأن الملف يعمل بلا خادم/إنترنت. هذا يحسن قابلية العرض للملف، لكنه لا يثبت caching، تحديث shell، recovery، أو نطاق service worker. `demo-store.js:90-115,199-210` يعتمد localStorage مع fallback للجلسة عند تعذر التخزين؛ لا توجد IndexedDB أو sync أو سياسة تحديث أصول.

**الحكم:** الوصف صادق لعينة file://؛ لا يجوز تسميته PWA offline. إذا اختار المالك PWA، يلزم service worker واستراتيجية cache/update وoffline fallback على HTTPS.

## 3) ما هو مثبت مقابل ما هو محتمل/بصري/قرار/غير مختبر

| التصنيف | البنود | الحكم |
|---|---|---|
| **عيب/فجوة مثبتة** | لا manifest، لا service worker، لا install metadata، ولا `start_url`/icons/display | مانع PWA؛ ليس عيب معاينة إذا كان النطاق Preview-only |
| **خطر محتمل** | top safe-area مفقودة في المصدر، لوحة المفاتيح بلا سياسة viewport، history/back غير معقود، تفاوت عرض واسع | يحتاج جهازًا/قرار نطاق؛ لا يُغلق بنجاح Chromium |
| **قرار بصري** | عمود 560px، bottom nav في Compact، عدم تحويل المعاينة إلى multi-pane | مقبول لعينة هاتف؛ غير محسوم لـTablet/Foldable/PWA واسع |
| **قرار يحتاج المالك** | هل المطلوب PWA فعلًا؟ هل compact-only؟ هل offline دائم أم standalone file فقط؟ هل نحتاج URL/deep links؟ | لا تنفيذ قبل تحديد المنتج/النطاق |
| **لم يُختبر** | Android/iOS حقيقي، Samsung Internet، Safari/WebKit، لمس، لوحة الهاتف، safe-area فعلية، رجوع النظام، Dynamic Type/native zoom، TalkBack/VoiceOver | معلن في `UI-PLATFORM-NOTES.md:38-57` و`UX-F03/round-r3/review.md:42-44` |

## 4) الفجوات غير المذكورة من المالك

1. **غياب عقد PWA نفسه**: لا manifest ولا service worker ولا install/update/offline acceptance؛ وجود `standalone.html` قد يوهم بعض القراء بأنه PWA، وهو ليس كذلك.
2. **عدم اتساق metadata بين الصفحات**: `theme-color` في فهرس المكتبة فقط، ولا manifest/icon metadata في عينة F03 أو الملف المستقل.
3. **غياب safe-area العلوية مقابل وجود السفلية**: الكود يضيف `safe-area-inset-bottom` للـnavbar، لكنه لا يضع inset علويًا للمحتوى في edge-to-edge.
4. **غياب عقد keyboard/interactive viewport**: لا `interactive-widget`, `visualViewport`, keyboard inset، أو اختبار بقاء CTA فوق لوحة المفاتيح.
5. **غياب URL/history/deep-link contract**: التنقل عبر `state.view` وأزرار داخلية فقط؛ لا سياسة لزر رجوع النظام أو reload داخل PWA.
6. **غياب breakpoint strategy للشاشات Foldable/Tablet**: لا استخدام لـwindow classes أو viewport segments؛ الحد الأقصى 560px قرار هاتف وليس تكيفًا متعدد النوافذ.
7. **غياب سياسة تحديث أصول PWA**: حتى لو أضيف service worker لاحقًا، لا توجد حاليًا سياسة cache versioning، update prompt، أو fallback عند فشل shell.
8. **غياب أيقونة تثبيت مهيأة**: أصول الشعار الحالية لا تعني وجود أيقونة PWA 192/512 أو maskable safe zone مرتبطة بالmanifest.

## 5) التوصيات المرتبة

### P0 — قبل أي ادعاء PWA

1. **قرار مالك مكتوب:** `preview-only` أم `PWA production`. لا يُسمّى `standalone.html` تطبيقًا مثبتًا دون هذا القرار.
2. إذا كان PWA مطلوبًا، أنشئ `app.webmanifest` واحدًا على HTTPS واربطه بكل HTML entrypoint قابل للتثبيت؛ أضف `name`, `short_name`, `icons` (192/512 على الأقل، وmaskable)، `start_url`, `scope`, `display`, `theme_color`, `background_color`, `lang=ar`, `dir=rtl`، وقرر `orientation`.
3. أضف service worker بــinstall/activate/fetch واضحين: precache للـapp shell، fallback offline، سياسة تحديث versioned، وسلوك صريح لفشل الشبكة/التخزين. لا تعتمد على file:// لإثبات ذلك.
4. اختبر installability في Chrome وSamsung Internet وSafari/iOS وفق HTTPS/manifest/SW، مع تقرير منفصل لحدود كل متصفح.

### P1 — قبل اعتماد تجربة الهاتف

5. عالج edge-to-edge على الطرفين: inset علوي للمحتوى/الشريط العلوي، وinset سفلي للnavbar/actionbar، مع `viewport-fit=cover` فقط إن كان المنتج يتعمد ملء الحواف، وبـfallback آمن. اختبر notch/Dynamic Island وgesture navigation.
6. عرّف سياسة keyboard: `interactive-widget` المناسب، إعادة حساب موضع CTA/لوحة الإجراء، و`visualViewport` أو `scrollIntoView` عند الحاجة. اختبر حقول الدخول والنموذج والمنتقي مع لوحة Android وiOS.
7. عرّف navigation contract: route/state في URL أو قرار صريح أن التطبيق لا يدعم deep links، ثم اختبر reload، زر Back في Android، swipe-back في iOS، وعودة focus بعد إغلاق كل طبقة.

### P2 — إذا كان النطاق يتجاوز Compact الهاتف

8. أضف مصفوفة responsive لـCompact/Medium/Expanded: bottom nav في Compact، rail/drawer أو multi-pane في المساحات الأكبر، مع foldable viewport segments؛ لا يكفي أن يبقى العمود بعرض 560px.
9. اختبر أحجام النص الأصلية للنظام (Dynamic Type/Android font scale) بدل محاكاة `font-size ×2` فقط، وكرر المسارات مع RTL وطول نص عربي طويل.
10. نفذ TalkBack وVoiceOver فعليًا للـdialogs، picker، tabs، navbar، والرسائل الحية؛ نتائج وجود ARIA أو فحص التركيز لا تكفي.

## 6) مصفوفة قبول مقترحة

| الاختبار | البيئة | معيار PASS | الحالة الآن |
|---|---|---|---|
| manifest/link/icons | HTTPS + Chrome/Samsung Internet | manifest يقرأ دون أخطاء، 192/512، start_url/display/scope صحيحة | **NOT RUN / غير موجود** |
| service worker | Chrome/Safari/Samsung Internet | Activated، يتحكم في start_url، shell يعمل offline بعد زيارة أولى | **NOT RUN / غير موجود** |
| 320/390/430 reflow | Chromium + جهاز فعلي | لا قص/فيض؛ آخر عنصر وCTA قابلان للوصول | Chromium PASS؛ الجهاز **NOT RUN** |
| top/bottom safe areas | iPhone notch + Android gesture/nav modes | لا overlap مع status/nav/cutout؛ المحتوى والـCTA داخل safe rect | **NOT RUN** |
| keyboard | iOS Safari + Android Chrome/Samsung Internet | الحقل النشط ورسالة الخطأ وCTA تبقى مرئية، لا قفزة/تراكب | **NOT RUN** |
| system back/deep link | Android back + iOS swipe-back + reload | التفاصيل ← القائمة، الطبقة ← المشغل، reload يحفظ route حسب العقد | **NOT RUN / لا contract** |
| dynamic text | Android font scale + iOS Dynamic Type/native zoom | لا قص ولا overlap، لا تعتمد على ×2 محاكاة فقط | ×2 محاكاة معلنة؛ native **NOT RUN** |
| AT | TalkBack + VoiceOver | dialog focus in/out، names/roles، live messages، swipe order | **NOT RUN** |
| Medium/Expanded | Galaxy Fold/Tab/iPad window resize | rail/drawer/multi-pane أو قرار compact-only موثق | **NOT RUN / قرار مالك** |

## 7) الأدلة والمسارات واللقطات

### أدلة المصدر

- `README.md:1-3,19-24,29-35,48-58` — المكتبة/المعاينات، بلا إطار تطبيق أو ربط إنتاجي.
- `docs/UI-FINAL-HANDOFF.md:5,14-18,20-25,41` — التسليم مكتبة مستقلة؛ تركيب/نشر Micro خارج الإذن.
- `docs/UI-PLATFORM-NOTES.md:21-35` — نطاق Chromium ومحاكاة النص وأهداف اللمس.
- `docs/UI-PLATFORM-NOTES.md:38-57` — WebKit، الأجهزة، لوحة المفاتيح، safe areas، رجوع النظام، TalkBack/VoiceOver غير منفذة.
- `previews/ux-patterns/mobile-record-sample/README.md:1-11,34-38,62-65` — عينة محلية، file://، local/session storage، وحدود S25/WebKit/لمس.
- `previews/ux-patterns/mobile-record-sample/index.html:22-27` — lang/dir وviewport، دون manifest/theme-color/PWA link.
- `previews/ux-patterns/mobile-record-sample/standalone.html:1-8,56-62` — ملف واحد مضمن يعمل file://، دون manifest/service worker.
- `previews/ux-patterns/mobile-record-sample/example.css:10-33,285-313,567-633,748-757` — عمود 560px، شريط ثابت، bottom safe-area، حشو تذييل/تحديد/toast، وعدم وجود top inset.
- `previews/ux-patterns/mobile-record-sample/example.js:254-260,2067-2075,2313-2393` — state-view والتنقل الداخلي، رجوع عبر زر، ResizeObserver، لا history API.
- `previews/ux-patterns/mobile-record-sample/demo-store.js:90-115,147-210` — localStorage ومحاولة fallback/قراءة seed.
- `previews/index.html:3-7` — `theme-color` موجود في فهرس المكتبة فقط.
- `reviews/UX-F03/round-r3/review.md:5-14,31-44` — Chromium headless، 46/46، وعدم ادعاء جهاز فعلي.

### أدلة بصرية

- `reviews/UX-F03/round-r2/screenshots/f03-32-zoom200-form-320.png` (320×844): reflow مرئي للنموذج عند تكبير 200%؛ يثبت القراءة المحاكية فقط، لا native zoom أو لوحة مفاتيح.
- `reviews/UX-F03/round-r3/screenshots/f03-41-widths-final.png` (390×844): navbar سفلي ثابت ومحتوى حساب داخل عمود الهاتف.
- `reviews/UX-F03/round-r3/screenshots/f03-44-standalone-home.png` (390×844): الملف المستقل يبدو كصفحة ويب كاملة؛ لا يثبت وجود OS-installed standalone window أو manifest.
- `reviews/UX-F03/round-r3/screenshots/f03-37-reports-390.png` (390×844): الرسم والبطاقات داخل تخطيط الهاتف؛ لا يثبت قدرة PWA أو تكيف Foldable.

### المراجع الرسمية المستخدمة

- [web.dev — Web app manifest](https://web.dev/learn/pwa/web-app-manifest)
- [web.dev — Install criteria](https://web.dev/articles/install-criteria)
- [web.dev — Service workers](https://web.dev/learn/pwa/service-workers)
- [MDN — `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- [MDN — `<meta name="viewport">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport)
- [Android — Display content edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
- [Material 3 — Designing / Target sizes](https://m3.material.io/foundations/designing/structure)
- [Apple HIG — Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Samsung One UI — Large screens and foldables](https://developer.samsung.com/one-ui/largescreen-and-foldable/intro.html)
- [WAI-ARIA APG — Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/)

## 8) الملفات التي تمت مراجعتها

- `README.md`
- `MANIFEST.json` (فهرس التسليم، وليس Web Manifest)
- `docs/CURRENT-STATE.md`
- `docs/UI-PLATFORM-NOTES.md`
- `docs/UI-FINAL-HANDOFF.md`
- `previews/index.html`
- `previews/ux-patterns/mobile-record-sample/README.md`
- `previews/ux-patterns/mobile-record-sample/index.html`
- `previews/ux-patterns/mobile-record-sample/example.css`
- `previews/ux-patterns/mobile-record-sample/example.js`
- `previews/ux-patterns/mobile-record-sample/demo-store.js`
- `previews/ux-patterns/mobile-record-sample/standalone.html`
- `components/navigation/navigation.css`
- `components/messages/messages.css`
- `reviews/UX-F03/round-r3/review.md`
- `reviews/UX-F03/round-r3/screenshots/f03-41-widths-final.png`
- `reviews/UX-F03/round-r3/screenshots/f03-44-standalone-home.png`
- `reviews/UX-F03/round-r3/screenshots/f03-37-reports-390.png`
- `reviews/UX-F03/round-r2/screenshots/f03-32-zoom200-form-320.png`

**خلاصة المراجع المستقل:** لا أوصي بتصنيف هذا التسليم PWA أو Web-Native production. أوصي بتسجيله كـ`preview-only / mobile-web simulation` إلى أن يقرر المالك نطاق PWA، ثم تنفيذ عقد manifest/SW/install/route/insets/keyboard واختبار الأجهزة الفعلية قبل أي اعتماد.


---
