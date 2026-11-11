# UI System Showcase

**الحالة:** Prototype تفاعلي لعرض مكونات UI الحالية بعد إصلاحات F-01 إلى F-14.

هذا المعرض ليس تطبيق Micro الإنتاجي ولا تصميم شاشة منتج. البيانات fixtures محلية حتمية، ولا توجد شبكة أو مصادقة أو حفظ أو منطق أعمال.

## التشغيل

من جذر المستودع:

```bash
python3 tools/preview-server.py
```

ثم افتح:

```text
http://localhost:5000/previews/ui-system-showcase/index.html
```

أو افتح `standalone.html` مباشرة من `file://`.

## مصدر الحقيقة

- `index.html`: تركيب المعرض.
- `showcase.css`: CSS الخاص بالمعرض باستخدام توكنز المكتبة.
- `showcase.js`: fixtures والتحكم في العرض.
- المكونات الفعلية تأتي من `components/` عبر المسارات النسبية.
- `standalone.html`: ملف مولد، لا تعدله يدويًا.

## إعادة البناء والتحقق

```bash
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
```

الدليل الأخير:

- [`verification.txt`](../../reviews/UI-SYSTEM-SHOWCASE/verification.txt)
- [`qa-verdict.txt`](../../reviews/UI-SYSTEM-SHOWCASE/qa-verdict.txt)
- [`repair-check-after.txt`](../../reviews/UI-SYSTEM-SHOWCASE/repair-check-after.txt)
- [`UI-SYSTEM-SHOWCASE-COVERAGE`](../../docs/UI-SYSTEM-SHOWCASE-COVERAGE.md)
- [`UI-SYSTEM-SHOWCASE-REPAIR-TRACKER`](../../docs/UI-SYSTEM-SHOWCASE-REPAIR-TRACKER.md)

## ما يغطيه

يعرض المعرض العائلات الحالية: surfaces، buttons، fields، selection، organization، info-strip، data، metric-comparison، messages، navigation، access-gateway، account-settings، order-schedule وcarousel. عرض packed-circle في المعرض أُبدل بأعمدة بنفس المصدر بقرار 2026-10-25 الموثق (يبقى الملحق PROPOSED opt-in في المكتبة)، ودوائر المقاييس استُبدلت ببطاقات قراءة مدمجة.

**نموذج التصفح (موثق 2026-10-25 — تحديث سطح المراجعة الافتراضي):** الصفحة ثلاثة أسطح — **«المعاينة المحمولة»** (`data-view="app"` — **الافتراضي**): تطبيق هاتفي متماسك من مكونات المكتبة الحقيقية (الرئيسية/الطلبات/التقارير/حسابي + تسجيل الدخول) ببيانات محلية حتمية، بلا وسوم مكوّنات ولا أدوات فحص ولا إطار جهاز — منفذ العرض نفسه هو الهاتف (360×780 قياسًا مرجعيًا)؛ **«نظرة عامة»** (خمس عائلات أساسية data-overview) للانطباع السريع، و**«مختبر الحالات»** (كل الأقسام الـ15 مع أزرار الاتجاه/العرض/الإجهاد وسجلات الأحداث) للفحص التفصيلي. الوصول إلى أسطح الفحص عبر روابط العمق: `#app` للمعاينة المحمولة، `#sc-canvas` لنظرة عامة، `#state-lab` للمختبر (تُستخدم في أدوات التحقق الآلي ولا تظهر في سطح التطبيق). قسم البيانات في المختبر يعرض عقد 2026-10-25: حالة «لا بيانات» الصادقة مقابل الصفر الحقيقي، وجدول إفصاح كامل (وحدة/فترة/مقام) لكل رسم كمّي.

`DRAFT FOR REVIEW` و`PROPOSED` علامات حالة وليست اعتمادًا إنتاجيًا.

## حدود الفحص

الفحوص Chromium/Playwright فقط. الأجهزة الحقيقية، WebKit/Safari، اللمس الحقيقي، safe areas، TalkBack/VoiceOver وnative zoom ليست مثبتة بهذا المعرض.

## Owner review surfaces — 2026-11-11

- Clean App Preview: `index.html#app` (default).
- Full Component Review: `index.html#component-review`. Use the labelled family selector: 14 families, one family at a time in a phone-width surface. Donut, Bubbles, real Packed Circle (PROPOSED), Metric Circles, Main Metric featured, and Info Strip peek are working examples, not coverage badges. Bars remain the exact-comparison alternative beside the optional Packed example.
- Diagnostic State Lab: `index.html#state-lab`. Width/direction/fixture controls and event logs belong here. Overview remains a short optional summary, not full coverage.

The account preview's component-library action opens Full Component Review. Chart defaults: Bars/Rows/Tables for exact comparison; Line is opt-in only for a meaningful ordered/time sequence. Maturity remains catalog-owned.

Focused verification: `python3 tools/evidence-repair-check.py --out /tmp/micro-review-check`; final release gate: `python3 tools/light-release-check.py --review-scope --out /tmp/micro-review-release`. The owner-scoped gate uses 360×780 RTL at normal text/DPR1. The focused check alone adds narrow 320 risks, one Calendar LTR comparison, and one Calendar-tools-only simulated 200% text case.
