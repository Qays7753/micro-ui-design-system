# Micro Brand Ecosystem Delta v2

هذا الملف المضغوط هو **ملحق إضافي فقط** للحزمة الأصلية، وليس نسخة ثانية من الحزمة القديمة.

## ما تم إصلاحه في v2

تمت معالجة ملاحظات المراجعة كلها: توحيد مسارات manifests مع الملفات الفعلية، إزالة إحالات HTML غير المسلّمة، إضافة مسارات Full Color canonical، تحويل Android إلى Resource Tree جاهز للنسخ، توضيح تأجيل PDF وEPS وCMYK، تثبيت استثناءات التسمية، وفصل عدد ملفات الـsupplement عن عدد ملفات المستودع canonical.

## محتويات الإضافة

يحتوي `added/` على 4 ملفات Master SVG، و15 ملف Variant SVG canonical، و85 ملف PNG، وأيقونات Favicon وPWA وMaskable وApple وAndroid، و8 ملفات توثيق، و4 لوحات معاينة PNG، وتقرير التدقيق وقائمة الإصدار، وmanifests محدثة بمسارات فعلية فقط.

## Full Color aliases

الملفات التالية موجودة الآن داخل الملحق في مساراتها canonical:

```text
added/brand/variants/full-color/micro-symbol.svg
added/brand/variants/full-color/micro-lockup-arabic.svg
added/brand/variants/full-color/micro-lockup-english.svg
```

هذه ليست concept جديدة ولا إعادة تصميم؛ هي تنظيم canonical للنسخ المعتمدة الموجودة في الحزمة القديمة حتى يصبح `brand/variants/` مكتملًا ولا يعتمد على خطوة تخمينية من الـagent.

## Android

الشجرة الجديدة جاهزة للنسخ المباشر:

```text
added/brand/platform-icons/android/res/drawable-nodpi/micro_adaptive_foreground.png
added/brand/platform-icons/android/res/mipmap-anydpi-v26/ic_launcher.xml
added/brand/platform-icons/android/res/values/colors.xml
```

تُنسخ محتويات `android/res/` إلى `app/src/main/res/`.

## الطباعة

هذا الإصدار مخصص للويب والتطبيق وPWA وApple وAndroid. تصديرات PDF وEPS وCMYK مؤجلة صراحةً إلى مرحلة مستقلة، ولا ينبغي اعتبار غيابها خطأً في هذا الـDelta.

## عدد الملفات

الحزمة الأصلية الموجودة فعليًا كانت 24 ملفًا، رغم تداول رقم 31. لم تُنسخ ملفاتها القديمة. بعد إضافة aliases canonical والإصلاحات، يحتوي هذا الـDelta على 147 ملفًا، منها 146 قبل ملف checksums.

## طريقة الدمج

اقرأ `MERGE-MAP.md` أولًا، ثم أضف محتويات `added/` إلى المستودع. استخدم `meta/final-manifest.json` لوصف المستودع canonical، واستخدم `delta-manifest.json` لوصف هذه الإضافة فقط.
