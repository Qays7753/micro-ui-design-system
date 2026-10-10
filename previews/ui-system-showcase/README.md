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

يعرض المعرض العائلات الحالية: surfaces، buttons، fields، selection، organization، info-strip، data، metric-comparison، messages، navigation، access-gateway، account-settings، order-schedule، carousel وpacked-circle حسب حالة كل مكون.

`DRAFT FOR REVIEW` و`PROPOSED` علامات حالة وليست اعتمادًا إنتاجيًا.

## حدود الفحص

الفحوص Chromium/Playwright فقط. الأجهزة الحقيقية، WebKit/Safari، اللمس الحقيقي، safe areas، TalkBack/VoiceOver وnative zoom ليست مثبتة بهذا المعرض.
