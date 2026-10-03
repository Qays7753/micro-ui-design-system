# بوابة الدخول — SPEC-04

**الحالة: STABLE UI — [UI-RELEASE](../../docs/UI-RELEASE.md).** مجموعة إدخال وتركيب فقط؛ لا مصادقة افتراضية.

## الأجزاء

نموذج مستهلك `[data-access-gateway]` و`form[data-access-form]` يركّب حقلي البريد وكلمة المرور من `.m-field` الحالي، وزر الإرسال من `.m-btn` الحالي. عيّن `[data-access-credential="email"]` و`[data-access-credential="password"]` لتحديد الحقول بصرف النظر عن `name`; يدعم البديل `name="email"` و`name="password"`. لا يشترط إظهار النوعين معًا، والسمات الأصلية مثل `required` و`minlength` تحدد قواعد الحقل. زر الإظهار `[data-access-reveal]` يتحكم في حقل كلمة المرور عبر `aria-controls`. محتوى الحالة `[data-access-status]` منطقة إعلان. العناصر الاختيارية لاستعادة الوصول `[data-access-recovery]` ومزودي الهوية `[data-access-provider="key"]` مخفية تلقائيًا حتى يوفر المستهلك callback مطابقًا.

## callbacks

`MicroAccessGateway.init(root, handlers)` حيث `handlers.onSubmit({email,password})` و`handlers.onRecovery()` و`handlers.providers[key]()` وظائف يقدمها المستهلك. يمكن أن تعيد Promise؛ حالة الانتظار تستعمل `MicroButtons.setLoading`، والرفض يظهر نص الخطأ بـ`textContent`. بعد النجاح تُرسل `micro-access:submitted` وتذكر الرسالة أن نتيجة الدخول مسؤولية المستهلك. لا تحفظ المكتبة كلمة المرور ولا تطلب API.

دون `onSubmit`، يرفض المثال الإيهام بالإرسال ويعلن أنه عرض محلي فقط. القيود الأساسية والتحقق الأصلي للبريد وكلمة المرور مطلوبة؛ لا منطق تحقق/مصادقة تجاري. موصلات Google/Apple/الضيف لا تظهر ولا تعمل دون handlers صريحة.

## الإتاحة والاعتماد

اسم واضح لكل حقل، أخطاء مرتبطة بصريًا وبالسمة `aria-invalid`, كلمة المرور قابلة للإظهار بلوحة المفاتيح مع تحديث الاسم والحالة، ودعم تحميل/رفض callback. RTL يستخدم حقول وأزرار Micro. يعتمد على `fields.css/js`, `buttons.css/js`, tokens وخطوط Micro. لا مكتبات أو روابط خارجية.

## الحدود

هذه البوابة لا تنفذ توثيقًا أو جلسة أو حماية بيانات أو استعادة فعلية. على المستهلك توفير endpoint آمن وسياسة ورسائل مناسبة؛ لا تخزن credentials في DOM أو logs أو storage.