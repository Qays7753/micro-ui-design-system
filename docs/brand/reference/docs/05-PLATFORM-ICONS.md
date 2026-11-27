# Micro Platform Icons — Corrected Resource Paths

## حالة المرحلة

تم اعتماد أصول المنصات. هذه النسخة تستخدم أسماء ومسارات فعلية موجودة داخل الملحق، ولا تحتوي إحالات إلى ملفات HTML غير مسلّمة.

## Favicon

```text
brand/platform-icons/favicon/favicon.svg
brand/platform-icons/favicon/favicon.ico
brand/platform-icons/favicon/favicon-16.png
brand/platform-icons/favicon/favicon-32.png
brand/platform-icons/favicon/favicon-48.png
```

## PWA

```text
brand/platform-icons/pwa/icon-192.png
brand/platform-icons/pwa/icon-512.png
brand/platform-icons/pwa/maskable-icon.svg
brand/platform-icons/pwa/maskable-icon-192.png
brand/platform-icons/pwa/maskable-icon-512.png
```

## Apple Touch Icon

```text
brand/platform-icons/apple/apple-touch-icon-source.svg
brand/platform-icons/apple/apple-touch-icon-180.png
```

## Android source and direct-copy resources

المصادر القابلة للمراجعة:

```text
brand/platform-icons/android/source/adaptive-foreground.svg
brand/platform-icons/android/source/adaptive-background.svg
```

الشجرة الجاهزة للنسخ:

```text
brand/platform-icons/android/res/drawable-nodpi/micro_adaptive_foreground.png
brand/platform-icons/android/res/mipmap-anydpi-v26/ic_launcher.xml
brand/platform-icons/android/res/values/colors.xml
```

انسخ محتويات `brand/platform-icons/android/res/` إلى:

```text
app/src/main/res/
```

بعد النسخ ستكون إحالة XML إلى `@drawable/micro_adaptive_foreground` صحيحة، لأن الملف موجود في `drawable-nodpi`.

## قرارات التصميم

يُستخدم الرمز فقط في أيقونات المنصات. Full Color هو الافتراضي، بينما تستخدم Maskable وAndroid Adaptive خلفية Petrol وforeground أبيض داخل منطقة أمان. لا توجد gradients أو shadows أو outlines، ولا يتغير موضع التراكوتا داخل الرمز.

## التحقق

تم التحقق من وجود favicon ICO بأحجام 16 و32 و48، وPWA 192 و512، وApple 180، وشجرة Android `res/` الجاهزة للنسخ المباشر.
