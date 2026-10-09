# UI System Showcase Prototype — Coverage Matrix & Plan

**Branch:** `zai/ui-system-showcase-prototype-2026-10-09` (created from `zai/ui-root-cause-repair-implementation`)
**Source SHA:** `788c2fdfe84cf12602870e7656c418e3d45f5c1b` (verified = remote `origin/zai/ui-root-cause-repair-implementation`)
**Date:** 2026-10-09 · **Executor:** Zed AI

هذه وثيقة نطاق العرض التفاعلي المستقل (prototype showcase) — **ليست جولة إصلاح جديدة ولا تطبيق إنتاجي**.
الغرض: ملف واحد يفتح تجربة «كيف تبدو مكوّنات Micro الحالية حين تُركّب معًا» عبر مصادر المكوّنات الفعلية كما هي على فرع الإصلاح المكتمل، مع الحالات والاتجاه RTL ووضع مقارنة LTR وقياسات 320/360/390/430.

**قاعدة النزاهة:** كل ما يظهر في العرض هو عناصر حقيقية من `components/` و`shared/tokens.css` وأصول `assets/` — لا محاكاة شكلية ولا إعادة تنفيذ. أي عيب مصدر يظهر يُسجَّل ولا يُخفى بـ CSS عرض خاص.

## خطة التنفيذ (قبل كتابة أي مصدر عرض)

1. **Phase 0 (هذه الوثيقة):** حصر العائلات من المستودع الحالي + قراءة المواصفات والوثائق الإلزامية + مصفوفة التغطية أدناه. اكتمل الحصر عبر تدقيق قراءة فقط لكل `components/*/specification.md` والوثائق المرجعية (AGENTS/DESIGN/SHARED-SPEC/UI-VISUAL-SYSTEM/MICRO-COMPONENTS-GUIDE/UI-USAGE-SOP/COMPONENT-INVENTORY + تقرير ومتعقب إصلاح 2026-10-08 + مثال standalone F03 وأداة بنائه).
2. **Phase 1 — المصدر القابل للتحرير:** `previews/ui-system-showcase/{index.html, showcase.css, showcase.js}` يستهلك ملفات `components/` الحقيقية بمسارات نسبية، مع شريط تحكم عرض فقط (RTL/LTR · عرض 320/360/390/430 · محتوى عادي/إجهاد · تصفية الحالة current/draft-proposed/all) وبيانات fixtures حتمية محلية داخل `showcase.js` — لا شبكة ولا مصادقة ولا حفظ.
3. **Phase 2 — الملف الواحد:** `tools/build-ui-system-showcase-standalone.py` على معمارية `tools/build-f03-standalone.py` نفسها (خطوط base64 مع ترخيص OFL كاملًا، أيقونات `<symbol data-icon-source>` مطابقة البايت لأصول `assets/icons`، `--check` يقارن بايت-ببايت، حتمية كاملة بلا أختام زمن).
4. **Phase 3 — تحقق مستقل:** مصفوفة تفاعلات + لقطات وقياسات على 320/360/390/430 × RTL/LTR عبر Chromium headless؛ حكم QA مستقل؛ أي عيب عرض يُصلح في ملفات العرض فقط، وأي عيب مصدر يُسجَّل `PROTOTYPE_BLOCKED_BY_CORE_FINDING`.
5. **Phase 4 — التسليم:** README + هذه المصفوفة مكتملة الأدلة + `reviews/UI-SYSTEM-SHOWCASE/{verification.txt, qa-verdict.txt}` + اللقطات والقياسات، ثم دفع عادي واحد للفرع (لا force، لا تعديل main أو فرع الإصلاح).

## الحالات المستمدة من الوثائق (لا حالة مُختلقة)

مصدر الحالة لكل عائلة هو نص المواصفة/الجرد نفسه — الاقتباس حرفي:

- **STABLE UI (12):** buttons · fields · selection · organization · data · messages · navigation · surfaces · info-strip (peek: ADOPTED 2026-10-04, opt-in) · metric-comparison · account-settings (دون حفظ) · access-gateway (دون مصادقة)
- **DRAFT FOR REVIEW (2):** order-schedule · carousel
- **PROPOSED (ملحقات opt-in):** data/packed-circle · surface wave knobs · استثناء خلية الشهر 48px في order-schedule
- لا شيء يُوسم UNCLASSIFIED لأن كل عائلة تحمل حالة صريحة في مصادرها.

## مصفوفة التغطية (Coverage Matrix)

| Family | Source files | Example shown | States shown | Interaction | Status from docs | Evidence | Limitation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| surfaces (S01) | `components/surfaces/surfaces.css`, `components/surfaces/curves.css` | سطح curves رئيسي (عنوان+مبلغ+وحدة) + سطح plain | curves (الاتجاه الحالي المعتمد) · plain · مبلغ طويل يلتف | لا شيء — عائلة CSS فقط | STABLE UI؛ الاتجاه الحالي curves (A04 مغلق)؛ knobs كلها PROPOSED | `reviews/UI-SYSTEM-SHOWCASE/screenshots/sc-section-sc-surfaces.png` | المتغيرات التاريخية (calm/waves/waves-v2/depth) غير معروضة — موسومة تاريخية في المواصفة؛ wave SVG مضمّن كـ data URI بالبناء |
| buttons (B01) | `components/buttons/buttons.css`, `buttons.js` | تكوين صف كامل من الأزرار | primary · secondary · light · icon · destructive · destructive-soft · block · filter+counter · disabled · pressed (`.is-pressed`) · loading (Pattern B) | `MicroButtons.setLoading` عبر أزرار عرض الحالة؛ ضغط/تركيز حقيقي | STABLE UI؛ 24px وB افتراضيان | `screenshots/sc-section-sc-buttons.png` + مصفوفة التفاعل | التحميل بعنصر تحكم عرض فقط — لا خدمة خلفية |
| fields (B02) | `components/fields/fields.css`, `fields.js` | نموذج حقول متنوع | نص+مساعدة · نص طويل+عدّاد · بحث+مسح · مبلغ+وحدة · كمية+stepper · خطأ · نجاح · معطل · قراءة فقط · نص إجهاد | إدخال فعلي؛ مسح البحث؛ stepper±؛ تبديل حالة خطأ/نجاح عبر أزرار عرض؛ `micro-field:changed` | STABLE UI؛ تدقيق 2026-10 مغلق | `screenshots/sc-section-sc-fields.png` + مصفوفة التفاعل | سياسة التحقق للمستهلك — أزرار الحالة هنا عرض توضيحي فقط |
| selection (B03) | `components/selection/selection.css`, `selection.js`, `picker.css`, `picker.js` | مجموعة اختيارات + منتقي داخل طبقة B07 | checkbox (عادي/محدد/indeterminate/معطل) · radio · switch (عادي/pending عبر `setSwitchPending`) · toggle (`aria-pressed`) · segmented طويل التسميات + خيار معطل · منتقي (ready/بحث/تحديد/مسح) | تحديد فعلي؛ بحث المنتقي؛ `micro-picker:change`؛ مسح التحديد | STABLE UI؛ حصر التركيز مصحح (A02) | `screenshots/sc-section-sc-selection.png` + `sc-fi-sheet-open.png` + مصفوفة التفاعل | بيانات المنتقي fixtures محلية (عقد المنتقي: بيانات المستهلك) |
| organization (B04) | `components/organization/organization.css`, `organization.js` | قسم تنظيمي كامل | عنوان+وصف · فاصل · مجموعة · صف قراءة (بmissing «—») · صف رابط بسهم · قسم قابل للطي · شارة · عدّاد (0/1/123/9999) · هوية (صورة + بديل أحرف) | طي/فتح القسم؛ حدث `micro-organization:toggle`؛ فشل صورة → بديل الأحرف | STABLE UI | `screenshots/sc-section-sc-organization.png` | — |
| data (B05) | `components/data/data.css`, `data.js` | تكوين رسوم وقراءات | m-stat (قيمة/غير متاح «—») · bars (صفر/مفقود/outlier) · line (مسار مقطوع للمفقود) · donut · bubbles · progress (محدد/غير محدد) · steps (منجزة/حالية/قادمة/متوقفة) · `data-scale-state` | تبديل بيانات fixture (عادي/إجهاد) → إعادة render والملخص/الإفصاح يتزامنان (A4-D04)؛ فتح/غلق الإفصاح داخل الرسم (D-UI-04) | STABLE UI؛ C2 مغلق + عقد المقياس الصريح (A01) | `screenshots/sc-section-sc-data.png` + `sc-stress-data-390.png` + مصفوفة التفاعل | القيم من fixtures حتمية؛ لا CSV (قرار مؤجل)؛ تباين العلامات الفاتحة مسجل في اقتراح A4-R01 ولم يُغير |
| metric-comparison (SPEC-02) | `components/metric-comparison/*.css/js` | الدوائر (منفصلة + متداخلة) + المؤشر الرئيسي بأشرطة موقعة | موجب · سالب · صفر (علامة مجوفة) · غير متاح · `data-scale-state` | تبديل layout (separated/overlap) عبر `render`؛ تبديل fixture | STABLE UI — [UI-RELEASE]؛ «التنفيذ للمراجعة» | `screenshots/sc-section-sc-metric.png` | لا تجميع ولا رياضيات مالية (عقد العائلة) |
| info-strip (SPEC-01) | `components/info-strip/info-strip.css/js`, `info-strip-peek.css/js` | بطاقات مستقلة + شريط أسهم/نقاط + شريط peek | بطاقة مفردة · متعددة القراءات · غير متاحة «—/غير متاح» · شريط كامل · شريط ببطاقة واحدة | أسهم/نقاط تنقل فعلي؛ `micro-info-peek:change`؛ إعادة تمركز عند تغيير العرض (SUI-007) | STABLE UI؛ peek ADOPTED 2026-10-04 opt-in | `screenshots/sc-section-sc-info-strip.png` | سحب peek الفعلي بالمؤشر محاكى برمجيًا في Chromium فقط (لمس فعلي NOT RUN)؛ لا autoplay (عقد العائلة) |
| messages (B06) | `components/messages/messages.css/js` | رف رسائل كامل | help · info · success · warning · error (مع إغلاق وإرجاع تركيز) · toast (فتح/إغلاق) · wait · skeleton · empty ×3 | فتح toast عبر زر عرض وإغلاقه؛ إعلان `MicroMessages.announce` في القنوات الحية المنفصلة (A2-F05)؛ إغلاق ملاحظة | STABLE UI | `screenshots/sc-section-sc-messages.png` + مصفوفة التفاعل | toast غير نقدي فقط (عقد B06)؛ رسالة سقوط ثابتة مصاحبة |
| navigation (B07) | `components/navigation/navigation.css/js`, `shared/motion.css` | شريط تطبيق + ألسنة + طبقة حوار وسطية + لوحة سفلية + شريط أفعال + navbar | appbar بعنوان طويل · ألسنة طويلة (D-UI-01: صف واحد بتمرير أفقي، Home/End) · navbar بأربع وجهات (`aria-current`) · حوار مركزي (role/aria-modal + إغلاق + إرجاع تركيز) · sheet سفلية · actionbar ملتصق | فتح/غلق الطبقات بتركيز صحيح؛ تمرير الألسنة؛ اختيار لسان يغيّر اللوحة | STABLE UI؛ A02 مصحح + التفاف شريط الأفعال | `screenshots/sc-section-sc-navigation.png` + `sc-i-sheet-open.png` + مصفوفة التفاعل | دمج navbar بمنتج غير ممثل — العرض مكونات فقط؛ لمس فعلي NOT RUN |
| account-settings (SPEC-03) | `components/account-settings/*.css/js` | حوار إعدادات بمستويين | عرض الحساب (ملف، صفوف إعدادات) ⇄ عرض التطبيق · مفتاح مع `data-demo-only` وحالة عرض · إرجاع/إغلاق | فتح الحوار عبر `data-account-open`؛ التنقل بين المستويين؛ `micro-account-settings:change` | STABLE UI دون حفظ | `screenshots/sc-section-sc-account.png` + مصفوفة التفاعل | لا حفظ (عقد العائلة)؛ الأيقونات داخل هذا التكوين من sprite أصول حقيقية (انظر حدود الأيقونات أدناه) |
| access-gateway (SPEC-04) | `components/access-gateway/*.css/js` | بوابة كاملة بمعالج عرض محلي | إظهار كلمة مرور (`aria-pressed`) · إرسال فارغ → رسالة مكوّن + `aria-invalid` · pending (setLoading) · نتيجة معالج محلي (نص حالة) | إدخال وإرسال فعلي بمعالج `onSubmit` محلي حتمي (Promise)؛ `micro-access:submitted` | STABLE UI دون مصادقة | `screenshots/sc-section-sc-gateway.png` + مصفوفة التفاعل | **لا مصادقة ولا شبكة** — النتيجة من معالج العرض فقط (عقد العائلة) |
| order-schedule (m-ocal) | `components/order-schedule/*.css/js` | تقويم شهر + لوحة يوم + قائمة | عرض شهر/يوم/قائمة · اليوم الحالي (حلقة) · اليوم المحدد · حالات progress/success/warning/neutral · فارغ (fixture) | `MicroOrderSchedule.init` صريح بـ fixtures؛ تنقل شهور؛ اختيار يوم (`order-schedule:day-select`)؛ تبديل عرض | **DRAFT FOR REVIEW**؛ استثناء خلية الشهر PROPOSED | `screenshots/sc-section-sc-ocal.png` + مصفوفة التفاعل | جدولة/حجز أعمال خارج النطاق (عقد العائلة)؛ RTL أولًا وLTR أفضل جهد |
| carousel | `components/carousel/*.css/js` | عارض 3 بطاقات + نقاط + حالة 6 بطاقات | بطاقة أولى/أخيرة (سهم معطل صادق) · محتوى طويل يلتف · توسيع تفاصيل داخل البطاقة | أسهم/نقاط/لوحة مفاتيح (منطق RTL) · `micro-carousel:change` · توسيع التفاصيل | **DRAFT FOR REVIEW** (دفعة مستقلة) | `screenshots/sc-section-sc-carousel.png` + `agent5-recheck-carousel-320-draft.png` + مصفوفة التفاعل | لا autoplay (عقد العائلة)؛ سحب المؤشر محاكى برمجيًا في Chromium فقط |
| data/packed-circle (ملحق B05) | `components/data/packed-circle.css/js` | رسم فقاعات ملتصقة | قيم فعلية بأحجام مساحية · ملخص | يُرسم مع init (auto) ويعيد القياس مع تغيير العرض | **PROPOSED** — يحتاج مراجعة واعتماد المالك (opt-in) | `screenshots/sc-section-sc-packed.png` | لا يُعرض إلا موسومًا PROPOSED في العرض نفسه |

**عائلات إضافية مفحوصة ولا مصدر مستقل لها:** لا توجد مجلدات `components/` غير المذكورة أعلاه (14 مجلدًا = 14 عائلة/ملحقًا). `previews/concepts` و`previews/compositions` عينات تركيب وليست عائلات.

## قواعد العرض الملزمة (مستمدة من التكليف والمستودع)

1. الافتراضي: عربي · RTL · فاتح · mobile-first · مقياس ثابت بلا تكبير (لا تحكم zoom البتة).
2. شريط التحكم يبدّل فقط: الاتجاه RTL/LTR، عرض المعاينة 320/360/390/430 (fixture عرض لا سلوك منتج)، محتوى عادي/إجهاد، تصفية الحالة (current/reference · draft/proposed · all).
3. الألوان والخطوط والأيقونات من المصادر الحالية فقط؛ أي مشكلة ناتجة عن قيمة حالية (مثل تباين علامات البيانات الفاتحة A4-R01) تُحفظ القيمة وتُسجَّل — لا ابتكار لون.
4. الأيقونات: sprite `<symbol data-icon-source="...">` بمحتوى ملفات `assets/icons` نفسها (نمط F03) — أداة البناء تتحقق بايت-ببايت أن كل رمز يطابق أصله (فشل البناء عند أي انحراف). `shared/icons.js` نفسه لا يُستهلك في العرض لأنه يتطلب http (fetch) بينما الملف الواحد يعمل من file:// — نفس الأصول، مسار تضمين مختلف موثق هنا.
5. أي عيب مصدر يظهر أثناء العرض: `PROTOTYPE_BLOCKED_BY_CORE_FINDING` بالمكوّن والملف وإعادة الإنتاج والتوصية — لا رقعة core في هذا الفرع.
6. الثوابت: لا تعديل `components/` أو `shared/tokens.css` أو الوثائق المرجعية الثلاث أو main أو فرع الإصلاح؛ لا فروع إضافية؛ لا force-push.

## حدود الأدلة المعلنة (مسبقًا)

- **Chromium (Playwright headless) فقط** لكل فحص — الجهاز الفعلي/اللمس/قارئ الشاشة/WebKit/native zoom: **NOT RUN**.
- السحب الفعلي بالإصبع غير قابل للفحص هنا؛ سلوك peek/carousel drag يُفحص برمجيًا بأحداث مؤشر Chromium.
- فتح `standalone.html` من `file://` يُفحص فعليًا داخل Playwright.

---

## نتيجة التحقق النهائية (2026-10-09)

| البند | النتيجة |
|---|---|
| مصفوفة التحقق (الهدفان: المصدر http + الملف الواحد file://) | **118/118 PASS** — `reviews/UI-SYSTEM-SHOWCASE/verification.txt` |
| أخطاء console / أخطاء صفحة / موارد فاشلة | **0 / 0 / 0** (على الهدفين) |
| الملف الواحد من file:// | يعمل: خطوط مضمّنة محمّلة، كل المكوّنات تُبنى وتتفاعل، بلا fetch/import/CDN |
| حتمية البناء | `--check` مطابق بايت-ببايت + SELF-CHECK OK (بناءان متتاليان) |
| تحقق أيقونات sprite | 23 رمزًا يطابق أصول `assets/icons` (المحتوى وfill) — يفشل البناء عند أي انحراف |
| مراجعة مستقلة (Agent 5 — probes خاصة لا تعتمد ادعاءات المنفذ) | **PASS** — 17/17 + 3/3 spot-checks؛ عيب تركيب واحد (فيض العارض مع تصفية draft عند 320/360) وجده المراجع، أُصلح في ملف العرض (قاعدة تركيب مستهلك)، وأعيد فحصه مستقلًا 8/8 — `qa-verdict.txt` |
| تعديل core | **لا شيء** — `components/` و`shared/` بلا أي تعديل (git status نظيف باستثناء إضافات العرض) |
| PROTOTYPE_BLOCKED_BY_CORE_FINDING | **لا بنود** — لم يُعثر على عيب مصدر جديد في هذه الجولة |

**NOT RUN المعلنة:** الأجهزة الفعلية واللمس الفعلي (سحب peek/carousel بالإصبع) · TalkBack/VoiceOver/NVDA · WebKit/Safari/Firefox · native zoom/Dynamic Type · safe-area فعلية. كل الفحوص Chromium (Playwright headless) فقط.

**دليل الأدلة الكامل:** `reviews/UI-SYSTEM-SHOWCASE/` (verification.txt · qa-verdict.txt · 31 لقطة في screenshots/).
