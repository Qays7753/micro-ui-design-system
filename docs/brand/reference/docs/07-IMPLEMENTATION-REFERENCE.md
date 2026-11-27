# Micro Implementation Reference

## اختيار الأصل

```text
brand/master/ → brand/variants/ → brand/png/ أو brand/platform-icons/
```

لا تعدّل اللون أو الحجم داخل الكود إذا كان variant جاهزًا.

## الويب وPWA

استخدم favicon وApple Touch من `brand/platform-icons/`. استخدم `pwa/icon-192.png` و`pwa/icon-512.png` لغرض `any`، ونسخ `maskable-icon-*` لغرض `maskable`.

## Android

انسخ محتويات:

```text
brand/platform-icons/android/res/
```

إلى:

```text
app/src/main/res/
```

النتيجة المتوقعة:

```text
app/src/main/res/drawable-nodpi/micro_adaptive_foreground.png
app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
app/src/main/res/values/colors.xml
```

اترك ملفات SVG المصدر في `brand/platform-icons/android/source/` للمراجعة، ولا تستخدمها بدل resources وقت التشغيل.

## RTL وLTR

استخدم lockup العربي في السياق العربي والإنجليزي في السياق الإنجليزي. لا تعكس ملفًا أفقيًا عبر CSS.

## المساحة الآمنة

طبّق `C = 0.5U` حول الحدود البصرية الخارجية. في co-branding استخدم `2C`.

## الطباعة

PDF وEPS وCMYK مؤجلة إلى مرحلة مستقلة. هذا المرجع يغطي الويب والتطبيق وPWA وApple وAndroid فقط.
