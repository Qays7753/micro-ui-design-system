# Micro — بوابة الدخول

مثال مستقل من جذر المستودع:

```sh
python3 -m http.server 8080
```

افتح `/components/access-gateway/example-usage.html`.

## API

`MicroAccessGateway.init(root, handlers)` يربط `[data-access-gateway]`. حدد المدخلات بـ`data-access-credential="email|password"` (أو `name="email|password"`). callbacks اختيارية: `onSubmit({email,password})`, `onRecovery()` و`providers: { key: handler }`. اختفاء recovery/providers تلقائي عند غياب callback. لا توجد خدمة جاهزة أو مصادقة ضمنية.

**عقد النتيجة (SUI-R1-01):** المستهلك يملك النتيجة والرسالة — المكوّن لا يستنتج نجاح دخول من مجرد اكتمال المعالج: `result.message` تُعرض حرفيًا إن وُجدت؛ `result.authenticated` صريحة تحدد «تم الدخول بنجاح.»/«لم يتم الدخول.»؛ أي نتيجة أخرى (undefined أو مفاتيح غير معروفة) تُعرض نصًا محايدًا «انتهى الطلب دون نتيجة مؤكدة من التطبيق.»؛ والرفض يظهر رسالة الخطأ. المفاتيح اختيارية وليست مخطط أعمال — التفصيل الكامل وجدول المسارات في [specification.md](specification.md). مثال الاستخدام يوثق تعاقبًا حتمًا: معالج محلي يرجع `{authenticated:false, message}` فتبقى رسالة المستهلك ظاهرة.

## التعديل

أسماء الحقول والتسميات والقيود والروابط ومفاتيح المزود تأتي من HTML المستهلك؛ الألوان والمقاسات عبر توكنات Micro وحقول/أزرار المكتبة الموجودة. لا تغير ذلك بإضافة API ضمن هذا المكوّن.