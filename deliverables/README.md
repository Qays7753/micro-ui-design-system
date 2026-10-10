# حزمة المصدر القابل للتعديل

المصدر الحقيقي للمكتبة هو `components/` و`shared/` و`assets/` و`previews/`. أي ZIP أو standalone مخرج قابل لإعادة البناء وليس مصدرًا مستقلًا.

## إعادة البناء

من جذر المستودع:

```bash
python3 tools/manifest-build.py
python3 tools/build-components-package.py
python3 tools/split-components-package.py
python3 tools/assemble-components-package.py
```

إذا احتجت ملفًا واحدًا للنقل، استخدم الناتج المعاد بناؤه من الرأس الحالي. لا تستخدم حزمة قديمة ولا تعدل ملفًا مولدًا يدويًا.
