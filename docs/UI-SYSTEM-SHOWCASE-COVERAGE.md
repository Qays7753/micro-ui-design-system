# UI System Showcase — Current Coverage

**Source of truth:** `main` الحالي
**Target:** `previews/ui-system-showcase/`
**Scope:** UI components only

## Families shown

المعرض يعرض المكونات الحالية من `components/` مع أمثلة fixtures محلية: surfaces، buttons، fields، selection، organization، info-strip، data، metric-comparison، messages، navigation، access-gateway، account-settings، order-schedule، carousel وpacked-circle حسب حالة كل مواصفة.

`previews/concepts/` و`previews/compositions/` عينات تركيب من المصدر وليست عائلات جديدة أو شاشات منتج.

## Verification matrix

| الفحص | النتيجة الأخيرة |
|---|---:|
| Showcase source + standalone | 118/118 PASS |
| Repair gate (`ui-system-showcase-repair-check.py --tag after`) | 88/88 PASS عند 320 و390 RTL |
| Concepts | 157/157 PASS |
| Data-scale lifecycle | 23/23 PASS |
| UI release matrix | 322/322 PASS |
| Local icon integrity | 23 icons PASS |

## What is verified

تحميل الأصول المحلية، RTL، العروض 320/360/390/430 في مصفوفة الإصدار، النصوص الطويلة، الحالات المفقودة والسالبة، الرسوم، التركيز والطبقات حيث ينطبق، reduced motion، وعدم وجود أخطاء JavaScript أو overflow في المسارات المفحوصة.

## Limits

هذه نتائج Chromium/Playwright. لا تثبت Android أو iOS فعليًا، WebKit/Safari، اللمس الحقيقي، safe areas، TalkBack/VoiceOver أو native zoom. عند تغيير المصدر أعد تشغيل الفحوص من الرأس الجديد؛ لا تنقل هذه الأرقام تلقائيًا إلى تعديل لاحق.
