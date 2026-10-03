# Micro — بوابة الدخول

مثال مستقل من جذر المستودع:

```sh
python3 -m http.server 8080
```

افتح `/components/access-gateway/example-usage.html`.

## API

`MicroAccessGateway.init(root, handlers)` يربط `[data-access-gateway]`. حدد المدخلات بـ`data-access-credential="email|password"` (أو `name="email|password"`). callbacks اختيارية: `onSubmit({email,password})`, `onRecovery()` و`providers: { key: handler }`. اختفاء recovery/providers تلقائي عند غياب callback. لا توجد خدمة جاهزة أو مصادقة ضمنية.

## التعديل

أسماء الحقول والتسميات والقيود والروابط ومفاتيح المزود تأتي من HTML المستهلك؛ الألوان والمقاسات عبر توكنات Micro وحقول/أزرار المكتبة الموجودة. لا تغير ذلك بإضافة API ضمن هذا المكوّن.