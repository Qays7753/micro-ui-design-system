# تقرير الوكيل 4 — البيانات والعرض والجدولة (SAMSUNG-ONEUI-REPAIR-R1)

**الوكيل:** الوكيل 4 — البيانات والعرض والجدولة (عائلات: data B05 · info-strip E02 · metric-comparison E03 · carousel · order-schedule m-ocal)
**الشجرة المرجعية:** رأس `eacfe8a` (نقطة بداية الجولة) — الفحوص قبل/بعد على شجرة العمل نفسها (غير نظيفة — عمل الوكلاء المتوازي، موثق في JSONs).
**هيكل التقرير:** جلسة وكيل منفذ (الإصلاحات والأدلة قبل/بعد — انتهت جلسته قبل التوثيق) + جلسة إكمال (هذه الجلسة: الرجعيات الناقصة + التحقق الوظيفي + مراجعة العائلات + التوثيق). جميع الأرقام أدناه مستخرجة من JSONs الأدلة الفعلية — لا رقم مُختلق.

---

## 1) خلاصة تنفيذية

| البند | الحالة النهائية | الطبقة | فحص before → after (sui-repair-a4-check) |
|---|---|---|---|
| SUI-007 | **FIX** (مُنفذ ومُتحقق) | COMPONENT (info-strip-peek) | 13/13 فحوص البند: قبل 4/13 → بعد 13/13 |
| SUI-008 | **FIX** | COMPONENT (data.css) | 4/4: قبل 2/4 → بعد 4/4 |
| SUI-009 | **FIX** | COMPOSITION (order-store + العينة) | 6/6: قبل 1/6 → بعد 6/6 |
| SUI-024 | **IMPROVE (FIX عيبه الوظيفي)** | COMPOSITION (comparison.html) | 2/2: قبل 0/2 → بعد 2/2 |
| SUI-025 | **FIX بعد إعادة إنتاج مؤكدة** | COMPONENT (carousel.js) | 6/6: قبل 2/6 → بعد 6/6 |
| SUI-017 (جزء data) | **IMPROVE** | COMPONENT (data.css) | 2/2: قبل 0/2 → بعد 2/2 |
| SUI-030 | **NEEDS OWNER DECISION** (سياق مقيس محدث — بلا تغيير سلوك) | DOC | INFO مقيسة (لا PASS/FAIL) |
| SUI-031 | **NEEDS OWNER DECISION** (سياق مقيس — بلا تغيير سلوك) | DOC | INFO مقيسة (لا PASS/FAIL) |

**فحص الوكيل الإجمالي (`tools/sui-repair-a4-check.py`):** before **7/34** (27 فشلًا مقصودًا يعيد إنتاج العيوب) → after **34/34** → إعادة تحقق مستقلة (جلسة الإكمال، `re-verify/`) **34/34** — صفر أخطاء JavaScript في كل الصفحات والتفاعلات.

**رجعيات جلسة الإكمال (أهم إنجازاتها):**

| الرجعية | النتيجة |
|---|---|
| `tools/order-schedule-check.py` (قبل تحديث الأداة) | 10/16 مسارًا — 239 تحقيقًا (فشل CAL-05/07/08/09/10 بسبب بذرة SUI-009 النظيفة + CAL-14 بناء standalone) |
| `tools/order-schedule-check.py` (بعد تحديث الأداة لعقد fixtures) | **15/16 مسارًا — 267 تحقيقًا**؛ الفشل الوحيد = «بناء standalone حتمي» (إعادة بناء القائد معلقة — خارج ملكيتي) |
| `tools/a05-peek-check.py` | **24/24** (بلا أي تعديل توقع — العقد الجديد متوافق) |
| `tools/b05-screenshots.py` | **26/26** |
| `tools/carousel-screenshots.py` | **53/53** |
| `tools/data-scale-state-check.py` | **23/23** |
| `node tools/repair-regression.cjs` (مشتركة — لم تُمس) | **301/301** |
| `python3 tools/ui-repair-r2-check.py` (مشتركة — لم تُمس) | **130/130** |
| `sui-repair-a4-check.py` re-verify | **34/34** |
| تحقق وظيفي إضافي (Playwright/منفذ 4406) | **11/11** |
| مسبار عائلة metric-comparison | **4/4** |

---

## 2) البنود — الحالة والحل والأرقام

### SUI-007 — peek هندسة قديمة عند أول كشف (FIX · COMPONENT)

- **العيب (قبل):** أول كشف لوجهة التقارير في F03 يترك `transform=0` والبطاقة النشطة ملاصقة للحافة — قياس before على F03@320: `transform: 0، leftInset: 60، rightInset: 0` (البطاقة خارج التوسيط بمقدار 30px كاملة). عزل الهارنس: كشف بعد إخفاء يترك `transform 0 / حواف 60/0`، وتغيّر عرض الأب **بلا window-resize** لا يعيد التوسيط (يبقى transform=0). `MicroInfoPeek.disconnect` غير موجودة (TypeError) و`ResizeObserver` غير مستخدم أصلًا (built=0).
- **الحل (نمط R3-UI01 من data.js):** مراقب `ResizeObserver` واحد لكل شريط (WeakMap — init المزدوج لا يضاعف) على `[data-info-strip-viewport]` يراقب **العرض فقط** (عتبة ≥0.5px، rAF مدمج)؛ **سياسة العرض 0**: المخفي لا يُعاد قياسه ويحتفظ بآخر توسيط، والإظهار يطلق الرصد بنفسه؛ إعادة التوسيط مزامنة صامتة لنفس الفهرس (بلا حدث `micro-info-peek:change` ولا نقل تركيز)؛ `window-resize` يبقى احتياطًا لبيئة بلا ResizeObserver (حد موثق)؛ `MicroInfoPeek.disconnect(root)` جديد لدورة التنظيف (يفصل المراقبين ويمسح آخر عرض — init لاحق يعيد الإلحاق).
- **بعد (أرقام فعلية):** F03@320 أول كشف: `transform=-30، leftInset=30، rightInset=30` (فرق حواف 0 ≤ 2) والفرق بين «قبل أول تفاعل» و«بعده» = صفر (نفس transform ونفس rect). F03@430 كذلك: `-30 / 30/30`. عزل: كشف بعد إخفاء → `-30 (320px)`؛ تغير عرض الأب → إعادة توسيط فورية `-30 (360px)`؛ الفهرس محفوظ عبر إخفاء/كشف (`index=2` موسّطة 514px، صفر أحداث)؛ التركيز يبقى داخل البطاقة النشطة؛ init مزدوج → `built_before=1 built_after=1`؛ disconnect → `disconnected=1` وتغير عرض بعده **لا** يعيد التوسيط (transform يبقى 514px).
- **معيار القبول المحقق:** «أول كشف لوجهة التقارير = توسيط صحيح (نفس أرقام goTo)؛ لا مراقب مكرر عند init مزدوج؛ سياسة العرض 0 موثقة» — كلها PASS مقيسة + عقد مكتوب في المواصفة §peek.
- **الملفات:** `components/info-strip/info-strip-peek.js` (+74/-11 سطرًا تقريبًا) · `components/info-strip/specification.md` (فقرة عقد كاملة + كيف أفحص).

### SUI-008 — m-stat__num رقم طويل يفيض عند 200% (FIX · COMPONENT)

- **العيب (قبل):** بطاقة stat برقم 16 خانة عند 320+200%: `cardClientW=312، cardScrollW=324` (فيض 12px) والرقم نفسه `numW=641px` خارج البطاقة (`numInsideCard=false`) بلا لف (`overflowWrap=normal`). على لوحة data نفسها: `scrollW=428 > 320` عند 320+200% مع 14 عنصرًا خارج إطار العرض (حتى `m-stat__unit` و`m-stat__delta` تصل إلى x=479) — يطابق رقم تدقيق D2 حرفيًا.
- **الحل:** نفس نمط العائلات الشقيقة: `.m-stat__num` يحمل `overflow-wrap: anywhere` + `min-width: 0` + `max-width: 100%`، وصف القيمة `.m-stat__value` يحمل `flex-wrap: wrap` + `max-width: 100%` (الوحدة/المؤشر يلتفان لسطر تالٍ) — بلا تصغير ولا تغيير قيمة ولا تمرير مفقود.
- **بعد (أرقام فعلية):** عند 320+200%: `cardClientW=288 = cardScrollW=288` (صفر فيض) والقيمة كاملة مرئية بالتلف: `numW=264، numH=264` داخل البطاقة (`numInsideCard=true`) و`overflowWrap=anywhere`؛ نص DOM كامل `1234567890123456`. عند 1×: الرقم القصير `1,240.50` سطر واحد (`numW=140، numH=44`) — لا انحدار. لوحة data عند 320+200%: **صفر عنصر خارج إطار العرض** (مسح مستطيلات كامل؛ قراءة scrollWidth الظاهرة 344 هي محاسبة RTL لأصل قياس التمرير بلا فيض مرئي — موثقة في `checks/sui008-before-sim.json`).
- **معيار القبول المحقق:** «scrollW ≤ clientW داخل البطاقة عند 200% برقم 16 خانة؛ القيمة كاملة في DOM ومرئية» — PASS مقيس + عقد في المواصفة (جدول الجزء `m-stat`).
- **الملفات:** `components/data/data.css` (سطور 34-60 منطقة) · `components/data/specification.md`.

### SUI-009 — «mystery» وعنوان حقن HTML في البذرة الافتراضية (FIX · COMPOSITION)

- **العيب (قبل):** المسار الافتراضي لـF03 والعينة المستقلة يعرض مفتاح `mystery` في مفتاح الكالندر (legendText: «قيد التنفيذتم التسليمبانتظار العميل**mystery**»، `mysteryInDom=true`، `storeCount=24`) — بيانات فحص تقنية في تجربة مستخدم حقيقية. لا `createStore` ولا `EDGE_FIXTURES` في الموصل.
- **الحل:** بذرة افتراضية **نظيفة** ببيانات أعمال عربية واقعية بمفاتيح progress/done/hold فقط (22 طلبًا)؛ حالتا الحدود (od-10 `mystery` + od-inj عنوان محقون `<b>/<img onerror>`) في `OrderDemoStore.EDGE_FIXTURES` **معزولة** تُحمّل حصرًا عبر: وسيط `?fixtures=edge` أو زر «حالات الحدود (وضع الفحص)» (موسوم `aria-pressed`) أو الواجهة البرمجية `createStore(seed)` (مصنع مخزن معزول صامت للأدوات). إعادة تحميل بلا وسيط تعيد المسار النظيف.
- **بعد (أرقام فعلية):** F03 الافتراضي: `mysteryInDom=false`، `storeCount=22`، legend نظيف. العينة الافتراضية: كذلك + `hasCreateStore=true، hasEdgeFixtures=true`. `createStore` معزولة: `isolatedCount=1` مقابل `defaultCount=22` (بلا تسريب). وضع `?fixtures=edge`: `hasOd10=true، hasOdInj=true، mysteryLabel='mystery'` محايد بنصه + `injText` يظهر نصًا حرفيًا مع `rootB=0، rootImg=0، xssArmed=false` و`storeCount=24`. زر وضع الفحص: `pressed false→true` بعد نقرة واحدة بلا reload.
- **معيار القبول المحقق:** «المسار الافتراضي في F03 والعينة: لا mystery ولا حقن؛ وضع fixtures يغطي الحالتين للأدوات؛ order-schedule-check يمر عبر fixtures» — أول اثنان PASS في sui-repair-a4-check (34/34)، والثالث تحقق بتحديث الأداة المبرر أدناه (§5).
- **الملفات:** `previews/ux-patterns/order-schedule/order-store.js` (بذرة نظيفة + EDGE_FIXTURES + createStore) · `example.js` (تحميل الوسيط/الزر) · `index.html` (زر وضع الفحص) · `example.css` (حاوية أزرار الشريط) · `README.md` (توثيق وضع الفحص).

### SUI-024 — جدول comparison يفيض أفقيًا عند 320+200% (IMPROVE · COMPOSITION)

- **العيب (قبل):** `docScrollW=572` مقابل `docClientW=320` (تمديد الصفحة كلها 252px) و`hasScrollContainer=false` — محتوى غير قابل للوصول بتمرير (WCAG 1.4.10) ويدمر تمرير الصفحة.
- **الحل:** حاوية `.cmp-table-scroll` بـ`overflow-x: auto` حول الجدول + `tabindex="0"` مع `aria-label` يفصح عن التمرير (لوحة مفاتيح يمكنها التمرير أيضًا) + مساحة تنفس للحد عند أقصى تمرير.
- **بعد (أرقام فعلية):** `docScrollW=320 = docClientW=320` (الصفحة لم تعد تتمدد) والجدول قابل للتمرير داخل حاويته: `boxClientW=287، boxScrollW=556`، `scrollLeftAfter=1` (يتغير فعلًا)، `tableW=556`.
- **معيار القبول المحقق:** «scrollWidth للصفحة = viewport؛ الجدول قابل للتمرير داخل حاويته» — PASS مقيس.
- **الملفات:** `previews/info-strip/comparison.html`.

### SUI-025 — carousel يشارك نمط window-resize فقط (REPRODUCE → FIX · COMPONENT)

- **إعادة الإنتاج (قبل أي إصلاح — العيب حقيقي):** عزل عارض داخل قسم مخفي ثم كشفه: `transform=0` والبطاقة الحالية ملاصقة للحافة (`leftInset=72، rightInset=0` عند vpW=320). تغيّر عرض حاوية الأب **بلا window-resize** بعد التنقل للبطاقة 1: هندسة قديمة تُخرج البطاقة من القناع (`leftInset=-4، rightInset=76` — حافة سالبة). `MicroCarousel.disconnect` غير موجودة (TypeError) ولا مراقب عرض (built=0). عُرضت الأرقام في `checks/probe-before.json → SUI-025_harness` ولقطات `before-sui025-carousel-first-reveal-320.png`.
- **الحل (نفس عقد SUI-007/نمط R3-UI01):** مراقب `ResizeObserver` واحد لكل عارض (WeakMap) على `[data-viewport]` يراقب العرض فقط (EPS 0.5px + rAF مدمج)؛ سياسة العرض 0 (المخفي يحتفظ بآخر توسيط والإظهار يطلق الرصد)؛ إعادة التوسيط تحفظ الفهرس والتركيز (مزامنة صامتة بلا `micro-carousel:change` ولا طي توسعة)؛ `window-resize` يُوجَّه عبر المسار نفسه ويبقى احتياطًا لبيئة بلا ResizeObserver؛ `MicroCarousel.disconnect(root)` للتنظيف.
- **بعد (أرقام فعلية):** كشف بعد إخفاء: `transform=-36، leftInset=36، rightInset=36` (موسّطة قبل أي تفاعل)؛ تغير عرض الأب: إعادة توسيط فورية `-36` عند vpW=360 (slideW=288)؛ الفهرس محفوظ (`index=1` موسّطة 224px، صفر أحداث)؛ التركيز يبقى داخل البطاقة؛ init مزدوج `built_before=1 built_after=1`؛ disconnect `disconnected=1` وتغير عرض بعده لا يعيد التوسيط (transform يبقى 224px).
- **معيار القبول المحقق:** «إن ثبت: نفس عقد القياس عند الكشف (نمط SUI-007)» — ثبت وأُصلح بقياس. رجعيات العائلة كاملة: `carousel-screenshots` **53/53** و`repair-regression.cjs` (فحوص M1/M2 carousel عند 320/360/390/430 × reduced) **301/301**.
- **الملفات:** `components/carousel/carousel.js` (+76 سطرًا) · `components/carousel/specification.md` (عقد «رصد عرض العارض — قياس عند الكشف»).

### SUI-017 (جزء data) — هرمية عناوين الأقسام (IMPROVE · COMPONENT)

- **قبل:** `.m-chart__title` في لوحة data ووجهة التقارير F03: `fs=16px، lh=26px، fw=600` (غير متسق مع قرار قائد الوحدة 16/24).
- **الحل:** `line-height: 1.5` (24px عند 16px — يتبع الخط عند التكبير) بدل `var(--micro-body-line)` (26px).
- **بعد:** `fs=16px، lh=24px، fw=600` في **كلا** الموضعين (قياس computed متطابق) — متسق مع F03 (جزء A3 من البند نفسه).
- **الملفات:** `components/data/data.css` (`.m-chart__title`) · `components/data/specification.md` (توثيق القرار).
- **رجعية:** b05-screenshots **26/26** (تشمل لقطات اللوحة) — لا انحدار.

### SUI-030 — استثناء خلية الشهر يمتد فعليًا حتى 390 (NEEDS OWNER DECISION — سياق محدث بلا تغيير سلوك)

- **القياس المحدَّث على شجرة الإصلاح (INFO موثقة في كل من before/after/re-verify):** خلية الشهر في **العينة المستقلة**: 37.7×37.8 @320 · 43.4×43.4 @360 · 47.7×47.7 @390 · 53.4×53.4 @430. في **تركيب F03**: 37.7×37.8 · 43.4×43.4 · 46.6×46.6 · 52.3×52.3. أي أن الاستثناء المعلن عند 320 **يمتد فعليًا حتى 390** (كل ما دون 48px) ويتجاوز القاعدة من 430 في التركيبين.
- **البديل المعروض على المالك (بلا تنفيذ):** اعتماد الصف اليومي/القائمة مسارًا أساسيًا لللمس (صفوف ≥48px مقيسة، بتبديلة واحدة) مع إبقاء خلية الشهر عنصر عرض/تنقل بلوحة مفاتيح وroving (أسهم + Enter مقيسة تعمل — `order-schedule-check` CAL-12 PASS) لا هدف لمس أساسيًا. **لا تعميم ولا خفض لقاعدة 48px في هذه الجولة.**
- **الملف:** `components/order-schedule/specification.md` (سياق محدث + بديل).
- **رجعية البند:** `order-schedule-check` CAL-11 يمر (مقاسات موثقة بلا ادعاء 48) — لا تغيير.

### SUI-031 — القص يصل حرفًا واحدًا عند 320 (NEEDS OWNER DECISION — سياق بلا تغيير سلوك)

- **القياس (INFO):** عند 320 تظهر التسميات المرئية: `م…مبيعات` (aria=«مبيعات» + `<title>مبيعات</title>`)، `م…مشتريات`، `مر…مرتجعات`، وفي رسم الخط بتركيب F03 تُقطع أول/آخر تسمية أسبوع إلى `10/…` و`01/…`. عقد R3-UI02 محفوظ مقيسًا (القراءة الكاملة موجودة في aria/title و`data-label-full` يوصل ISO الكامل في F03) لكن التسمية المرئية شبه معدومة الدلالة عند 320 على اللمس (لا hover).
- **لا تغيير سلوك** — القرار للمالك (اقتراح مسجل سابقًا: مفتاح مرئي أو تفاصيل بالنقر).
- **الملف:** `components/data/specification.md` (سياق مقيس موسوم SUI-031).

---

## 3) مراجعة العائلات (KEEP/IMPROVE بمبرر مقيس)

| العائلة | القرار | المبرر (قياس/رجعية) |
|---|---|---|
| **data (B05)** | **IMPROVE منفذ + KEEP للباقي** | SUI-008 FIX (فيض 324>312 و14 عنصرًا خارج العرض → صفر فيض وصفر عنصر خارج) + SUI-017 FIX (26→24px). الباقي KEEP: عقود صدق البيانات (صفر/مجهول/سالب/شاذة) محمية برجعيات كاملة: `b05-screenshots` 26/26 (تشمل A2..A17/C2 وD1 reduced-motion) و`data-scale-state-check` 23/23 (دورة حياة التشخيص R8-07) و`repair-regression` packed/light/dark 301/301. |
| **info-strip (E02)** | **IMPROVE منفذ + KEEP للباقي** | SUI-007 FIX (transform 0→−30 عند أول كشف؛ مراقب واحد؛ disconnect) + SUI-024 FIX (صفحة 572→320). الباقي KEEP: عقد الشريط الحالي محمي بـ`a05-peek-check` **24/24** (تتبع 1:1، عتبة، snap-back، RTL، كيبورد، inert، فراغ، reduced-motion، مالك وحيد، تهيئة متكررة) — بلا أي تعديل توقع بعد تغيير peek. |
| **metric-comparison (E03)** | **KEEP** | محمي أصلًا: `overflow-wrap: anywhere` مقيسًا على الرقم الرئيسي وتسميات fallback (مسبار جلسة الإكمال 4/4)؛ رقم 16 خانة عند 320+200% يلتف داخل البطاقة (numRect داخل cardRect)؛ عقد الغياب «غير متاح» لا صفر مخترع والصفر قراءة صريحة (`liStates=['zero']` + fallback يحمل التسمية والحالة). لا عيب مقيس → لا تغيير. |
| **carousel** | **IMPROVE منفذ + KEEP للباقي** | SUI-025: أُعيد إنتاجه (transform 0/حواف 72/0 وحافة سالبة −4 بعد تغير عرض الأب) ثم أُصلح بعقد القياس عند الكشف — قياس before/after أعلاه. الباقي KEEP: `carousel-screenshots` **53/53** (سحب/إفلات خارج viewport/إلغاء عمودي/أسهم داخل الحقول/توسعة inline/دوائر بقيم حقيقية/سالب display) + فحوص M1/M2 (توسعة/تبويب/نقاط/RTL) في `repair-regression` 301/301 عند 4 مقاسات × reduced. |
| **order-schedule (m-ocal)** | **IMPROVE منفذ + KEEP للباقي** | SUI-009 FIX (بذرة نظيفة + fixtures معزولة)؛ SUI-030/031 سياق قرار فقط. الباقي KEEP: مصفوفة القبول CAL-01..15 كاملة عبر `order-schedule-check` (رياضيات التقويم المدني، علامات اليوم، عدّادات/نقاط، رحلة متصلة بلا reload، أقسام القائمة، حالات loading/error/empty صادقة، مقاسات أربعة + 200%، كيبورد/roving/reduced-motion، أحداث، موارد) — **15/16 مسارًا و267 تحقيقًا** بعد تحديث الأداة (الفشل الوحيد = بناء standalone — للقائد). |

---

## 4) NOT RUN (بصراحة)

- أجهزة فعلية / لمس حقيقي / Samsung Galaxy S25 / Samsung Internet (كل التفاعلات محاكاة أحداث Playwright).
- TalkBack/VoiceOver أو أي قارئ شاشة صوتي (فقط سمات aria/title مقيسة في DOM).
- WebKit/Safari (كل الفحوص Chromium).
- native zoom (المستخدم محاكاة نص ×2 بمرورين نظيفين ZOOM2_CLEAN — مضاعفة computed font-size؛ موثقة في كل JSON).
- القراءة البصرية البشرية للقطات (الأدوات تثبت وجودها وغير فارغة — الحكم النهائي للقائد).

## 5) تحديثات الأدوات (ملك الوكيل 4 — مبررة)

1. **`tools/order-schedule-check.py`** — تحديثان موثقان في رأس الأداة:
   - **وسيطا `--out`/`--port`** (بنية فقط): إعادة تشغيل الرجعية بمخرجات معزولة (`evidence/agent4/regression/`) دون الكتابة فوق `reviews/ORDER-SCHEDULE/` التاريخي، وتثبيت الخادم على منفذ نطاق الوكيل 4. الافتراضات كما كانت.
   - **تحميل fixtures صريحة لمسارات CAL-05/07/08/09/10** بتبرير: «اختبار الحالات الحدية عبر fixtures صريحة بدل المسار الافتراضي — عقد SUI-009». الآلية: بعد فتح الهدف (src/sample) تُحقن `OrderDemoStore.EDGE_FIXTURES` عبر الواجهة البرمجية (`upsert` → حدث `order-store:changed` يعيد التصيير من المصدر الواحد)؛ **standalone.html القائم** (قبل إعادة بناء القائد) مبني على البذرة القديمة التي تحمل الحالتين أصلًا ولا يعرّف `EDGE_FIXTURES` فيتخطاه التحميل بأمان. **لم يُعدل أي توقع قائم** (الأعداد 24/18 وسلوك mystery المحايد والحقن الحرفي كما في بطاقة القبول). النتيجة: 10/16 مسارًا (239 تحقيقًا) قبل التحديث → **15/16 مسارًا و267 تحقيقًا** بعده.
2. **`tools/a05-peek-check.py`** و**`tools/b05-screenshots.py`** و**`tools/carousel-screenshots.py`** و**`tools/data-scale-state-check.py`** — **بنية فقط**: وسيطا `--out`/`--port` بنفس الغرض (لا تغيير توقع واحدًا). a05 مرّت كاملة (24/24) بلا أي تحديث سلوكي — عقد القياس عند الكشف الجديد متوافق مع فحوصها (المالك الوحيد/التهيئة المتكررة/الفراغ).
3. سكربتا أدلة جديدان (ملك الوكيل): `evidence/agent4/scripts/a4_functional_verify.py` (تحقق وظيفي 11/11) و`a4_family_metric_probe.py` (مسبار metric-comparison 4/4).

## 6) الأدوات المشتركة — النتائج والاقتراحات

| الأداة | النتيجة على شجرة الإصلاح | تعديل مقترح؟ |
|---|---|---|
| `node tools/repair-regression.cjs` (node v24.21.0 · Chromium 143.0.7499.4 عبر `--chromium-path`) | **301/301 PASS** (فحوص carousel M1/M2 عند 320/360/390/430 × reduced + navigation + packed + surfaces + waves؛ صفر أخطاء JS) | **لا** — عقدي الجديدان (SUI-007/SUI-025) لم يكسرا شيئًا. |
| `python3 tools/ui-repair-r2-check.py` | **130/130 PASS** (كميات/مبالغ/حصص تقارير/أزرار تحميل؛ standalone القديم أيضًا) | **لا**. |

- طريقة التشغيل: كلا الأداتين بلا وسيط إخراج؛ شُغّلتا في مكانهما (يكتبان في أدلة التاريخ `reviews/AFTER-DIRECTION/repair` و`reviews/UI-SOURCE-REPAIR-R2`) ثم **نُسخت المخرجات كاملة إلى أدلتي** (`evidence/agent4/regression/…`) و**أُعيدت الملفات التاريخية المتتبعة إلى حالتها** (`git restore` للمسارين — بلا commit/push/branch) — تحقق `git status` بعدها: صفر تغييرات متتبعة في المسارين. تفاصيل وإعادة تشغيل في `evidence/agent4/README.md`.
- ملفات `r3-*.png` الست غير المتتبعة في `reviews/UI-SOURCE-REPAIR-R2/screenshots/` هي بقايا تشغيل الوكيل 3 لنفس الأداة (21:56 UTC)؛ إعادة تشغيلي جدّدها **بايت-ببايت مطابقة** (diff SAME) — بلا أثر.

## 7) NEEDS OWNER DECISION

1. **SUI-030** — توقيع استثناء خلية الشهر بنطاقه المقيس (320–390: 37.7/43.4/47.7px) أو اعتماد بديل «الصف اليومي/القائمة مسار اللمس الأساسي + خلية الشهر تنقل كيبورد» (موثق في `components/order-schedule/specification.md` §8).
2. **SUI-031** — التسمية المرئية شبه المعدومة (`م…مبيعات`) عند 320 مقابل القراءة الكاملة في aria/title: إبقاء عقد R3-UI02 أو إضافة مفتاح مرئي/تفاصيل بالنقر (سياق مقيس في `components/data/specification.md`).
3. (خارج ملكيتي، للعلم): إعادة بناء `standalone.html` بعد الدمج — يفتح CAL-14 في `order-schedule-check` وF03-44 في ux-f03-check للوكيل 3.

## 8) إجراء القائد عند الدمج (خارج الأدوات المشتركة)

1. `python3 tools/build-f03-standalone.py` ثم إعادة `python3 tools/order-schedule-check.py --out <دليل> --port 4400` → يتوقع **16/16 مسارًا و267 تحقيقًا** (فشل CAL-14 الوحيد الحالي هو تقادم standalone بتحكم — إعادة البناء تغلقه؛ standalone الجديد سيعرّف `EDGE_FIXTURES` فيغطي تحميل fixtures الأهداف الثلاثة كلها).
2. اعتماد تحديثات أدوات الوكيل 4 أعلاه (كلها داخل ملكيته).

## 9) ملاحظات صدق

- أرقام before لكل بند أعيد إنتاجها فعلًا على الشجرة قبل الإصلاح (JSON `before-results.json` + `probe-before.json` + لقطات before) — لا بند «غير معاد إنتاجه» في نطاقي.
- بند SUI-025 كان «REPRODUCE→FIX إن ثبت»: **ثبت** بالقياس (حواف 72/0 ثم حافة سالبة −4) قبل أي إصلاح.
- جلسته المنفذة انتهت قبل إكمال الرجعيات والتقارير؛ جلسة الإكمال هذه شغّلت كل الرجعيات الناقصة وأعادت فحص الوكيل (34/34) ووثّقت. **لم أجد عيبًا فعليًا في عمل الوكيل المنفذ يتطلب تعديل المصدر**؛ العيبان الوحيدان اللذان وجدتهما وأصلحتهما كانا في سكربت تحققي الخاص (جسّه لصفوف الحالات الحدية احتاج التحويل لعرض القائمة أولًا — `a4_functional_verify.py`، وبنية مسبار metric-comparison الأولية كانت ببنية DOM خاطئة للمصدر — أصلحت كليهما وأعدت التشغيل حتى PASS).
- البذرة الافتراضية نظيفة تحققًا مستقلًا: diff `order-store.js` (لا mystery/حقن في SEED_ORDERS) + تحقق وظيفي DOM (11/11) + فحص SUI-009 (6/6).
