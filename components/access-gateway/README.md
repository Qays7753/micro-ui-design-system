# Micro — بوابة الدخول

مثال مستقل من جذر المستودع:

```sh
python3 -m http.server 8080
```

افتح `/components/access-gateway/google-welcome-usage.html` لتركيب الدخول المستهدف Google-only، أو `/components/access-gateway/example-usage.html` لمثال API العام ذي الحقول.

## API

`MicroAccessGateway.init(root, handlers)` يربط `[data-access-gateway]`. حدد المدخلات بـ`data-access-credential="email|password"` (أو `name="email|password"`). callbacks اختيارية: `onSubmit({email,password})`, `onRecovery()` و`providers: { key: handler }`. اختفاء recovery/providers تلقائي عند غياب callback. لا توجد خدمة جاهزة أو مصادقة ضمنية.

## تركيب الدخول المعتمد

حمّل `buttons.css` ثم `access-gateway.css` ثم `welcome.css` بعد tokens والخطوط؛ Buttons مطلوبة لأفعال Micro الاختيارية في حالة الجلسة. `google-welcome-usage.html` مثال تركيب UI نظيف داخل العائلة الحالية: لا حقول بريد/كلمة مرور، ولا إنشاء حساب منفصل، ولا روابط قانونية وهمية. يستخدم المستخدم الجديد والعائد مسار Google نفسه. يحمّل التطبيق المضيف Google Identity Services ويرسم زر Google الرسمي داخل `[data-google-provider-slot]` وفق تعليمات المزود السارية؛ لا تستخدم `.m-google-button` أو صورة G المحلية كزر إنتاجي. يبقى موضع GIS فارغًا عند فتح المثال دون SDK، وهذا مقصود كي لا نستبدل الزر الرسمي بعينة مخصصة. المثال لا يشغّل OAuth أو SDK ولا يتصل بخدمة؛ المضيف يملك credential callback والنتيجة والجلسة.

`m-session` يعرض حالة يرسلها المضيف فقط (`restoring`, `expired`, `denied`, `offline`). الواجهة لا تستعيد الجلسة ولا تقرر صلاحية الحساب ولا تحفظها. روابط الشروط والخصوصية اختيارية ولا تضاف إلا بعناوين فعلية من المضيف.

**عقد النتيجة (SUI-R1-01):** المستهلك يملك النتيجة والرسالة — المكوّن لا يستنتج نجاح دخول من مجرد اكتمال المعالج: `result.message` تُعرض حرفيًا إن وُجدت؛ `result.authenticated` صريحة تحدد «تم الدخول بنجاح.»/«لم يتم الدخول.»؛ أي نتيجة أخرى (undefined أو مفاتيح غير معروفة) تُعرض نصًا محايدًا «انتهى الطلب دون نتيجة مؤكدة من التطبيق.»؛ والرفض يظهر رسالة الخطأ. المفاتيح اختيارية وليست مخطط أعمال — التفصيل الكامل وجدول المسارات في [specification.md](specification.md). مثال الاستخدام يوثق تعاقبًا حتمًا: معالج محلي يرجع `{authenticated:false, message}` فتبقى رسالة المستهلك ظاهرة.

## التعديل

أسماء الحقول والتسميات والقيود والروابط ومفاتيح المزود تأتي من HTML المستهلك؛ الألوان والمقاسات عبر توكنات Micro وحقول/أزرار المكتبة الموجودة. لا تغير ذلك بإضافة API ضمن هذا المكوّن.
