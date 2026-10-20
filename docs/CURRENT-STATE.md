# الحالة الحالية — فرع الإصلاح المهني

**مصدر الجولة الموثق:** `ui/native-svg-polish-2026-10-12` عند `feb19f0f417307c1e41a5b87f214b51b8f29c727`
**نطاق المستودع:** UI-only
**فرع الإصلاح:** `replit/professional-ui-complete-repair-2026-10-20`
**مهم:** هذا وصف لفرع الإصلاح المطلوب، وليس إعلان دمجه في `main`. بقي main دون تعديل أو دمج.

## التحقق الحالي — 2026-10-20

Chromium 152.0.7977.64 / Playwright 1.63.0، مع IBM Plex الفعلي:

- Component mobile: 52/52 PASS.
- Chart mobile: 59/59 PASS.
- Showcase: 118/118 PASS.
- Existing showcase repair gate: 88/88 PASS (320/390 RTL).
- Concepts: 157/157 PASS.
- Data scale lifecycle: 23/23 PASS.
- Professional focused regressions: 278/278 PASS (320/360/390/430، RTL/LTR).
- Deterministic standalone and icon checks: PASS؛ مولد من المصدر دون تعديل يدوي.

النتائج مربوطة ببصمة المصدر وتاريخ التشغيل والالتزام في [تقرير التحقق](replit-professional-ui-repair-2026-10-20/VERIFICATION-REPORT.md). [تقرير التنفيذ](replit-professional-ui-repair-2026-10-20/IMPLEMENTATION-REPORT.md) و[المتتبع](replit-professional-ui-repair-2026-10-20/REPAIR-TRACKER.md) يوضحان F-01 إلى F-14 لهذه الجولة، وهي معرّفات مختلفة عن جولة المعرض التاريخية.

الأدلة الحالية تحت `generated-artifacts/professional-ui-repair/`، منفصلة عن reviews التاريخي. الملفات الناتجة مستثناة من Git والنشر؛ يعيد فحص الإصلاح توليدها.

## ما هو موجود

المكتبة تحتوي مصدرًا قابلًا للتعديل للمكونات، مواصفات الحالات، توكنز مشتركة، أصولًا محلية، أمثلة مستقلة، ومعرضًا موحدًا يعرض العائلات الحالية داخل تركيب واحد.

المصدر الأساسي هو `components/` مع `shared/` و`assets/`. المعرض الحالي هو `previews/ui-system-showcase/`، و`standalone.html` فيه مولد من المصدر.

## حالة العائلات

- العائلات الأساسية: STABLE UI ضمن مواصفاتها الحالية.
- `order-schedule`: DRAFT FOR REVIEW.
- `carousel`: DRAFT FOR REVIEW.
- `packed-circle`: PROPOSED/opt-in ولا يغير السلوك الافتراضي للبيانات.
- `account-settings` و`access-gateway`: UI محلي تجريبي دون حفظ أو مصادقة حقيقية.

هذه الحالات تصف حالة UI والمصدر، ولا تعني جاهزية تطبيق Micro أو اعتماد UX.

## تحقق تاريخي محفوظ — ليس دليلًا على فرع الإصلاح الحالي

جولة المعرض القديمة تغطي معرّفات F-01 إلى F-14 الخاصة بها، لا معرّفات الطلب المهني الجديد. النتائج المحفوظة:

- Showcase: `118/118 PASS`.
- بوابة الإصلاح: `88/88 PASS` عند 320 و390 RTL (وهي العروض التي يجريها سكربت الإصلاح الحالي).
- Concepts: `157/157 PASS`.
- Data scale lifecycle: `23/23 PASS`.

الأدلة النهائية في `reviews/UI-SYSTEM-SHOWCASE/`، والتغطية وسجل الإصلاح في:

- `docs/UI-SYSTEM-SHOWCASE-COVERAGE.md`
- `docs/UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md`

## ما لم يُختبر

لم تُثبت هذه النتائج أجهزة Android أو iOS فعلية، WebKit/Safari، اللمس الحقيقي، safe areas، TalkBack/VoiceOver، أو native zoom. لا تستخدم نتائج Chromium كإثبات توافق شامل.

## قواعد التعديل

1. اقرأ `AGENTS.md` و`DESIGN.md` قبل التعديل.
2. عدّل المصدر القابل للتعديل، لا الملف standalone المولد.
3. لا تغيّر الهوية أو التوكنز أو الأصول دون قرار صريح.
4. حدّث مواصفة المكون والفحص عند تغير العقد.
5. اربط كل نتيجة بالرأس الحالي، ولا تعيد استخدام أرقام تاريخية غير قابلة للتتبع.
