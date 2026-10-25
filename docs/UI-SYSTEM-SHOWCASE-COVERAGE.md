# UI System Showcase — Current Coverage

**Source of truth:** `main` الحالي
**Target:** `previews/ui-system-showcase/`
**Scope:** UI components only

## Families shown

المعرض يعرض المكونات الحالية من `components/` مع أمثلة fixtures محلية: surfaces، buttons، fields، selection، organization، info-strip، data، metric-comparison، messages، navigation، access-gateway، account-settings، order-schedule وcarousel. عرض packed-circle في المعرض أُبدل بأعمدة بنفس المصدر بقرار 2026-10-25 (يبقى الملحق PROPOSED opt-in في المكتبة). نموذج التصفح: «نظرة عامة» (5 عائلات أساسية) و«مختبر الحالات» (15 قسمًا) — وثّق في README المعرض.

`previews/concepts/` و`previews/compositions/` عينات تركيب من المصدر وليست عائلات جديدة أو شاشات منتج.

## Verification matrix

أرقام دورة 2026-10-25 (إصلاح المكونات والمفاهيم) من الرأس المدوّن في تقرير `docs/zai/FINAL-COMPONENT-REPAIR-AND-CONCEPT-AUDIT-2026-10-25.md`:

| الفحص | النتيجة الأخيرة |
|---|---:|
| Showcase source + standalone (`ui-system-showcase-check.py`) | 124/124 PASS |
| Repair gate (`ui-system-showcase-repair-check.py --tag after-component-repair`) | 92/92 PASS عند 320 و390 RTL |
| Concepts | 162/162 PASS |
| Data-scale lifecycle | 23/23 PASS |
| Light release matrix (`light-release-check.py`) | 792/792 PASS |
| Light data + owner chart contracts (`light-data-check.py`) | 178/178 PASS |
| Light calendar (`light-calendar-check.py`) | 123/123 PASS |
| Local icon integrity | 23 icons PASS |

الأرقام التاريخية في `UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md` لدورات سابقة وليست نتائج الرأس الحالي.

## What is verified

تحميل الأصول المحلية، RTL، العروض 320/360/390/430 في مصفوفة الإصدار، النصوص الطويلة، الحالات المفقودة والسالبة، الرسوم، التركيز والطبقات حيث ينطبق، reduced motion، وعدم وجود أخطاء JavaScript أو overflow في المسارات المفحوصة.

## Limits

هذه نتائج Chromium/Playwright. لا تثبت Android أو iOS فعليًا، WebKit/Safari، اللمس الحقيقي، safe areas، TalkBack/VoiceOver أو native zoom. عند تغيير المصدر أعد تشغيل الفحوص من الرأس الجديد؛ لا تنقل هذه الأرقام تلقائيًا إلى تعديل لاحق.
