# Micro — بوابة الدخول

مثال مستقل من جذر المستودع:

```sh
python3 -m http.server 8080
```

افتح أمثلة [الشاشات الأربع](#تراكيب-الشاشات-الأربع) لمعاينتها منفردة، أو `/components/access-gateway/example-usage.html` لمثال API العام ذي الحقول.

## API

`MicroAccessGateway.init(root, handlers)` يربط `[data-access-gateway]`. حدد المدخلات بـ`data-access-credential="email|password"` (أو `name="email|password"`). callbacks اختيارية: `onSubmit({email,password})`, `onRecovery()` و`providers: { key: handler }`. اختفاء recovery/providers تلقائي عند غياب callback. لا توجد خدمة جاهزة أو مصادقة ضمنية.

## تركيب الدخول المعتمد

حمّل `buttons.css` ثم `access-gateway.css` ثم `welcome.css` بعد tokens والخطوط؛ Buttons مطلوبة لأفعال Micro الاختيارية في حالة الجلسة. `google-welcome-usage.html` مثال أدنى لتركيب `m-welcome` و`m-session` العام، ويبقى محفوظًا كما هو؛ ليس صفحة Google sign-in الكاملة. الشاشة الثانية الكاملة موثقة في [`google-sign-in-usage.html`](google-sign-in-usage.html). المستخدم الجديد والعائد يستخدمان مسار Google نفسه. يحمّل التطبيق المضيف Google Identity Services ويرسم زر Google الرسمي داخل `[data-google-provider-slot]` وفق تعليمات المزود السارية؛ لا تستخدم `.m-google-button` أو صورة G المحلية كزر إنتاجي. يبقى موضع GIS فارغًا عند فتح الأمثلة دون SDK، وهذا مقصود كي لا نستبدل الزر الرسمي بعينة مخصصة. لا يشغّل أي مثال OAuth أو SDK ولا يتصل بخدمة؛ المضيف يملك credential callback والنتيجة والجلسة.

`m-session` يعرض حالة يرسلها المضيف فقط (`restoring`, `expired`, `denied`, `offline`). الواجهة لا تستعيد الجلسة ولا تقرر صلاحية الحساب ولا تحفظها. روابط الشروط والخصوصية اختيارية ولا تضاف إلا بعناوين فعلية من المضيف.

**عقد النتيجة (SUI-R1-01):** المستهلك يملك النتيجة والرسالة — المكوّن لا يستنتج نجاح دخول من مجرد اكتمال المعالج: `result.message` تُعرض حرفيًا إن وُجدت؛ `result.authenticated` صريحة تحدد «تم الدخول بنجاح.»/«لم يتم الدخول.»؛ أي نتيجة أخرى (undefined أو مفاتيح غير معروفة) تُعرض نصًا محايدًا «انتهى الطلب دون نتيجة مؤكدة من التطبيق.»؛ والرفض يظهر رسالة الخطأ. المفاتيح اختيارية وليست مخطط أعمال — التفصيل الكامل وجدول المسارات في [specification.md](specification.md). مثال الاستخدام يوثق تعاقبًا حتمًا: معالج محلي يرجع `{authenticated:false, message}` فتبقى رسالة المستهلك ظاهرة.

## التعديل

أسماء الحقول والتسميات والقيود والروابط ومفاتيح المزود تأتي من HTML المستهلك؛ الألوان والمقاسات عبر توكنات Micro وحقول/أزرار المكتبة الموجودة. لا تغير ذلك بإضافة API ضمن هذا المكوّن.

## تراكيب الشاشات الأربع

التراكيب هي UI فقط؛ لا تحتوي أي صفحة على مصادقة أو Google SDK أو تخزين. الحزمة المرجعية هي `Micro-Auth(1).zip` فقط. تُحمّل `auth-screens.css` بعد الخطوط والتوكنز، وتحمل شاشتا الترحيب `buttons.css`؛ تستخدم الشاشتان 3/4 رمز `check.svg` المحلي عبر `shared/icons.js`.

- [Splash](splash-usage.html): شعار Micro v2 وأشكال العلامة؛ رابط المثال ينتقل إلى صفحة Google المحلية فقط.
- [Google sign-in](google-sign-in-usage.html): لا يعرض سوى موضع `[data-google-provider-slot]`؛ التطبيق المضيف يرسم زر Google الرسمي ويملك الروابط القانونية الحقيقية إن وجدت.
- [ترحيب مستخدم جديد](new-user-welcome-usage.html): يعرض «مرحبًا بك في Micro» ونصًا محايدًا، ويضع بيانات الحساب اختيارية مخفية حتى يقدّمها المضيف.
- [ترحيب مستخدم عائد](returning-user-welcome-usage.html): يعرض «أهلًا بعودتك»؛ لا يظهر إلا بعد تأكيد المضيف أن النتيجة عائدة.

المضيف وحده يتحقق من نتيجة Google ويقرر `new` أو `returning`، ويملأ `[data-auth-account]` ويربط `[data-auth-action]`. لا تُضمَّن بيانات مستخدم تجريبية أو روابط `#` في أمثلة التسليم.

يظل [google-welcome-usage.html](google-welcome-usage.html) مثالًا أدنى لتركيب `m-welcome` وحالات `m-session` القائمة؛ ليس شاشة Google sign-in الكاملة ولا يستبدل API العام.
