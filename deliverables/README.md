# حزمة المصدر القابل للتعديل

المصدر الحقيقي للمكتبة هو `components/` و`shared/` و`assets/` و`previews/`. أي ZIP أو standalone مخرج قابل لإعادة البناء وليس مصدرًا مستقلًا.

المخرجات الحالية في `generated-artifacts/deliverables/`، لا في هذا المجلد. ZIP وأجزاؤه وpackage-parts.json مستثناة من Git والنشر. أداة البناء تستخدم أوقات ZIP ثابتة؛ وأداة التجميع تتحقق من SHA256 لكل جزء ومن الحزمة الكاملة وCRC قبل الاستبدال الذري. لا تعامل تسليمًا قديمًا، إن وجد، على أنه نسخة المصدر الحالية.

## إعادة البناء

من جذر المستودع:

```bash
python3 tools/component-catalog-build.py
python3 tools/build-ui-system-showcase-standalone.py
python3 tools/manifest-build.py
python3 tools/build-components-package.py
python3 tools/split-components-package.py
python3 tools/assemble-components-package.py
```

إذا احتجت ملفًا واحدًا للنقل، استخدم الناتج المعاد بناؤه من الرأس الحالي. لا تستخدم حزمة قديمة ولا تعدل ملفًا مولدًا يدويًا.
