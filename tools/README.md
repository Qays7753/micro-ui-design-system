# أدوات Micro UI الحالية

كل الأوامر تعمل من جذر المستودع ولا تحتاج شبكة أو أسرارًا، ما لم يذكر الأمر خلاف ذلك.

## المعاينة

```bash
python3 tools/preview-server.py
```

ثم افتح `previews/index.html` أو `previews/ui-system-showcase/index.html`.

## المعرض الأخير

```bash
python3 tools/build-ui-system-showcase-standalone.py
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
```

الملف `previews/ui-system-showcase/standalone.html` مولد؛ لا تعدله يدويًا.

## فحوص المصدر

```bash
python3 tools/concepts-check.py
python3 tools/data-scale-state-check.py
python3 tools/ui-release-check.py
```

## الحزمة

```bash
python3 tools/manifest-build.py
python3 tools/build-components-package.py
python3 tools/split-components-package.py
python3 tools/assemble-components-package.py
```

الحزمة مخرج نقل يمكن إعادة بنائه؛ المصدر الحقيقي هو `components/` و`shared/` و`assets/` و`previews/`.

## حدود الأدلة

الفحوص الحالية تستخدم Chromium/Playwright. لا تعني نجاحها اختبار Android أو iOS أو WebKit/Safari أو اللمس الحقيقي أو قارئات الشاشة أو native zoom.
