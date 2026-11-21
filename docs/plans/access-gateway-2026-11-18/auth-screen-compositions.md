# Auth Screen Compositions Implementation Plan

> **For agentic workers:** تنفيذ الخطة inline على الفرع المعتمد؛ استخدم مربعات الاختيار لتتبع الخطوات ولا تفوض وكلاء إضافيين.

**Goal:** إضافة تراكيب UI قابلة للاستهلاك للشاشات الأربع المعتمدة داخل Access Gateway دون إضافة مصادقة فعلية أو تعديل أي مستودع سوى مكتبة Micro UI.

**Architecture:** تبقى عائلة Access Gateway وواجهتها العامة دون حذف أو تغيير. يضيف `auth-screens.css` تكوينات CSS-only لشاشات Splash وGoogle sign-in وترحيب المستخدم الجديد والعائد؛ المضيف يختار الشاشة بعد نتيجة موثوقة، ويقدّم زر GIS وبيانات الحساب والأفعال. لا OAuth أو شبكة أو حفظ أو تحليل حالة مستخدم داخل المصدر.

**Tech Stack:** HTML وCSS وتوكنز Micro المحلية وأصول الشعار والأيقونات الحالية؛ Python وPlaywright الموجودان لفحص الهاتف. لا اعتمادات أو مصادر شبكة جديدة.

**Spec:** `components/access-gateway/specification.md`، `docs/MOBILE-EXPERIENCE-HANDOFF.md`، والمرجع المرئي الوحيد `/home/ubuntu/upload/Micro-Auth%281%29.zip` مع موجز القرارات `MICRO-AUTH-CONTINUATION-BRIEF-2026-11-21.md`.

## Global Constraints

- فرع التنفيذ `feature/google-only-access-gateway-2026-11-18`؛ لا كتابة إلى `main` أو `review/component-readiness-20261117` ولا دمج أو PR.
- الاحتفاظ بـcommit `692b188` والبناء فوقه؛ لا فتح أو تعديل مستودع Micro أو ملفات ZIP المصدرية.
- المرجع المرئي الوحيد هو صور `Micro-Auth(1).zip`: Splash وGoogle sign-in محفوظتان؛ الصقل المحدود للشاشتين الجديد والعائد يحافظ على اتجاههما.
- لا تضف Onboarding أو بريد/كلمة مرور أو مزود دخول آخر أو زر Google مرسوم يدويًا.
- استخدم توكنز النظام، شعار Micro v2 والخطوط/الأيقونات المحلية فقط؛ لا تغيّر الهوية أو الكتالوج أو نضج العائلة.
- لا بيانات حساب تجريبية في أمثلة التسليم. بطاقة الحساب اختيارية ولا تظهر إلا ببيانات حقيقية يمررها المضيف.
- شاشة الجديد لا تقول «حسابك جاهز»؛ استخدم «يسعدنا انضمامك.» لعدم وجود تأكيد من النظام أن الحساب أُنشئ وجُهّز.
- المضيف وحده يملك GIS وcredential callback والتحقق الموثوق وتحديد `new` أو `returning` والجلسة والوجهات والأفعال.
- الفحص Light وRTL عند 360×780؛ افحص 320×780 فقط للتحقق من عدم الفيض الضيق. لا فحوص عامة لبقية العائلات.

---

### Task 1: تثبيت عقد الشاشة وملكية المضيف

**Files:**
- Modify: `AGENTS.md`
- Modify: `DESIGN.md`
- Modify: `components/access-gateway/specification.md`
- Modify: `components/access-gateway/README.md`
- Modify: `docs/CURRENT-STATE.md`
- Modify: `docs/COMPONENT-API-CONTRACTS.md`
- Modify: `docs/FAMILY-CONSUMPTION.md`
- Modify: `docs/MOBILE-EXPERIENCE-HANDOFF.md`

**Interfaces:**
- الواجهة المرئية: `.m-auth-screen--splash`, `.m-auth-screen--signin`, `.m-auth-screen--new-user`, `.m-auth-screen--returning-user`.
- موضع زر المزود: `[data-google-provider-slot]`؛ لا تستهدف CSS داخله.
- بيانات اختيارية من المضيف: `[data-auth-account]`، `[data-auth-user-name]`، `[data-auth-user-email]`، `[data-auth-user-initial]`.
- أفعال يربطها المضيف: `[data-auth-action="continue"]` و`[data-auth-action="use-another-account"]`.
- لا تضيف API JavaScript للشاشات؛ يبقى `MicroAccessGateway.init(root, handlers)` كما هو للتركيب العام.

- [x] حدّث `AGENTS.md` و`DESIGN.md` باستثناء محدد يسمح بتراكيب Access Gateway الأربع UI-only، مع إبقاء حظر OAuth والجلسات والبيانات الحقيقية والمنطق التجاري.
- [x] وثّق في المواصفة شروط ظهور شاشة الجديد والعائد: نتيجة موثوقة من المضيف بعد التحقق، لا اكتمال Promise أو البريد أو تخزين المتصفح.
- [x] وثّق الحساب كمنطقة اختيارية مخفية ما لم يمرر المضيف بياناته؛ لا تضع اسمًا أو بريدًا ثابتًا في أمثلة المصدر.
- [x] حدّث README وCURRENT-STATE وعقود API والاستهلاك وhandoff لترتيب ملفات CSS الجديد وحالة الشاشات الأربع؛ لا تعدّل تقارير الأرشيف أو الكتالوج.
- [x] افحص روابط المواصفة الجديدة محليًا وتأكد أن لا سجل تاريخي يوصف التدفق الحالي على أنه مصادقة حقيقية.

### Task 2: بناء التراكيب الأربع من مرجع الحزمة المعتمدة

**Files:**
- Create: `components/access-gateway/auth-screens.css`
- Create: `components/access-gateway/splash-usage.html`
- Create: `components/access-gateway/google-sign-in-usage.html`
- Create: `components/access-gateway/new-user-welcome-usage.html`
- Create: `components/access-gateway/returning-user-welcome-usage.html`

**Interfaces:**
- كل شاشة عنصر مستقل كامل الارتفاع في الهاتف؛ المضيف يركّب شاشة واحدة حسب مسار التطبيق.
- Splash يحافظ على سطحه الأبيض ودائرتي العلامة والشعار الرسمي ويصل في المثال إلى صفحة Google sign-in المحلية.
- Google sign-in يحافظ على الشعار أعلى الشاشة ولوحة البترول أسفلها؛ مكان GIS فارغ/عنصر توضيحي غير تفاعلي حتى يرسم المضيف الزر الرسمي. لا روابط شروط/خصوصية بلا وجهات فعلية.
- شاشة الجديد تستخدم العنوان «مرحبًا بك في Micro» والنص المحايد «يسعدنا انضمامك.» وزر المتابعة؛ شاشة العائد تستخدم «أهلًا بعودتك» و«يسعدنا رؤيتك مجددًا.» وزر المتابعة. كلتاهما تحتفظان بمساحة الحساب وزر «استخدم حسابًا آخر» عند توفر بيانات/سلوك المضيف.

- [x] أنشئ CSS بخصائص RTL منطقية للمحتوى، وارتفاع أدنى يتكيف مع Safe Area والتفاف النص؛ لا يُقص المحتوى، والقص محصور بطبقة الزخارف الخلفية.
- [x] اربط اللون والتباعد والخط والزوايا بأدوار وتوكنز النظام؛ استخدم الشعار العربي v2 بالحجم الموثق، واستخدم رمز `check.svg` عبر `shared/icons.js` مع `aria-hidden`.
- [x] أنشئ `google-sign-in-usage.html` للشاشة الثانية دون GIS/OAuth أو روابط قانونية وهمية، وأبقِ `google-welcome-usage.html` تركيبًا أدنى لـ`m-welcome` و`m-session` كما هو.
- [x] أنشئ صفحتي الجديد والعائد بنفس بنية اللوحة الداكنة وبطاقة الحساب الفاتحة، مع بيانات حساب فارغة مخفية افتراضيًا، وزري الإجراء بعقود المضيف المذكورة أعلاه.
- [x] أنشئ Splash وفق مرجع الحزمة الأخيرة دون حركة جديدة أو تغيير اتجاه، واربط التنقل المحلي في المثال فقط.
- [x] راجع أسماء الأصناف وملفات التحميل بحيث تظل كل شاشة قابلة للاستخدام دون مختبر أو page-level JavaScript.

### Task 3: تحقق مركز وتسليم الفرع

**Files:**
- Modify: `tools/mobile-experience-check.py`
- Generated by tool only: `MANIFEST.json`

- [x] وسّع مرحلة `login` الحالية لتفتح صفحات الشاشات الأربع في Chromium عند 360×780، تنتظر الخط المحلي والأيقونة، وتلتقط صورًا مؤقتة تحت `/tmp` للمراجعة البصرية.
- [x] تحقق من RTL، وجود العنوان/الإجراء الأساسي وموضع GIS، غياب حقول الاعتماد والـSDK والروابط الوهمية وبيانات الحساب الثابتة، وعدم وجود overflow أفقي.
- [x] حقن بيانات fixture مؤقتة من الاختبار فقط لإظهار بطاقة الحساب وفحص التفاف الاسم والبريد؛ لا تحفظها في أمثلة المنتج أو صور Git.
- [x] أعد الفحص عند 320×780 لاكتشاف الفيض فقط، ثم أعد viewport إلى 360×780.
- [x] شغّل `python3 tools/mobile-experience-check.py --phase login --out /tmp/auth-screen-check`، ثم `python3 tools/manifest-build.py` و`python3 tools/manifest-build.py --check` و`git diff --check`.
- [x] راجع الصور الأربع والتغييرات كاملة، وتأكد أن `components/access-gateway/access-gateway.js` و`shared/tokens.css` والكتالوج لم تتغير.
- التسليم بعد نجاح الفحوص: أنشئ commit واحدًا على فرع الميزة وارفع الفرع نفسه؛ لا تدمج، ولا تنشئ PR، ولا تغيّر فرع المراجعة أو `main`.
- [x] اذكر في التسليم أن الفحص Chromium فقط؛ لا جهاز فعلي أو Safari/WebKit أو GIS/OAuth حقيقي أو قارئ شاشة.

## بوابة الإغلاق

يُعد نطاق UI جاهزًا للمراجعة عندما تكون ملفات التراكيب الأربع وعقد استهلاكها واضحة، ولا تتضمن أمثلة المصدر بيانات مستخدم ثابتة أو مصادقة فعلية، وتنجح فحوص login المركزة وMANIFEST و`git diff --check`، وتكون صور 360×780 RTL قابلة للمراجعة. لا يعني ذلك أن خدمة Google أو التحقق أو الجلسة أو التكامل مع Micro قد نُفذ أو اختُبر.
