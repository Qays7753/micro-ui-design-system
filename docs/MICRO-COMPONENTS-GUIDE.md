# دليل استخدام مكونات Micro UI

هذا الدليل يشرح استهلاك مصدر UI الحالي. لا يصف رحلات منتج أو منطق أعمال.

## قبل الاستخدام

1. اقرأ `DESIGN.md` و`docs/UI-RELEASE.md`.
2. اختر العائلة من `docs/COMPONENT-INVENTORY.md`.
3. اقرأ `components/<family>/specification.md`.
4. أضف CSS/JS الخاص بالمكون من `components/`.
5. استخدم `shared/tokens.css` و`shared/motion.css` و`assets/` بدل نسخ القيم.

## أمثلة

- أمثلة العائلات في `previews/<family>/`.
- التراكيب المصغرة في `previews/compositions/`.
- الحالات العددية والإعدادات في `previews/concepts/`.
- التركيب الشامل في `previews/ui-system-showcase/`.

الأمثلة fixtures مستقلة وليست شاشة إنتاجية. لا تنقل بياناتها أو سلوكها الوهمي إلى تطبيق Micro.

## تعديل مكون

عدّل المصدر القابل للتعديل داخل `components/`، ثم حدّث المواصفة والمثال إذا تغير العقد. لا تعدل `standalone.html` يدويًا؛ أعد توليده بالأداة.

## التحقق

```bash
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
python3 tools/concepts-check.py
python3 tools/data-scale-state-check.py
```

كل نتيجة يجب أن تُربط بالرأس الحالي، مع التصريح بالمنصات التي لم تُختبر.
