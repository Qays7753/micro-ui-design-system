# Micro — إعدادات الحساب والتطبيق

شغّل المعاينة المستقلة من جذر المستودع:

```sh
python3 -m http.server 8080
```

ثم `/components/account-settings/example-usage.html`.

## API

`[data-account-settings]` حول مشغل `[data-account-open]` ومرجع `data-account-layer-id`. استخدم `[data-account-view="account|application"]`, `[data-account-to-application]`, `[data-account-back]` و`[data-account-close]`. التهيئة: `MicroAccountSettings.init(root)`.

ينبغي تحميل ملفات Micro المشتركة المذكورة في `specification.md`، وبالأخص `MicroNavigation` من B07. لا يوجد تخزين؛ أحداث المفتاح `micro-account-settings:change` إشعار فقط.

## التعديل

الاسم، الوصف، الأيقونة وأسماء/قيم الصفوف من HTML. تعديلات التنسيق تستخدم توكنات Micro عبر `account-settings.css`. مسار إعدادات التطبيق نص/عنصر مستهلك؛ لا يضيف هذا المكوّن حقولًا أو صلاحيات من تلقاء نفسه.