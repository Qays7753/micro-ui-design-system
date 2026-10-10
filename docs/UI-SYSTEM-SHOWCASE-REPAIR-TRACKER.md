# UI System Showcase — Current Repair Tracker

هذا tracker يصف الحالة الحالية فقط. لا توجد فيه إحالات إلى فروع أو جولات أو UX محذوفة.

## Gates

| الأداة | النتيجة الحالية | النطاق |
|---|---:|---|
| `tools/ui-system-showcase-check.py` | 118/118 PASS | مصدر المعرض وstandalone |
| `tools/ui-system-showcase-repair-check.py --tag after` | 88/88 PASS | 320 و390 RTL |
| `tools/concepts-check.py` | 157/157 PASS | concepts، العروض والحالات العددية |
| `tools/data-scale-state-check.py` | 23/23 PASS | دورة حياة تشخيص الرسوم |
| `tools/ui-release-check.py` | 322/322 PASS | مصفوفة الإصدار 320/360/390/430 |

## قواعد الإصلاح

- أصلح المصدر داخل `components/` أو `shared/` أو مصدر المعرض، لا `standalone.html`.
- لا تغيّر ألوان الهوية أو الخطوط أو الأيقونات أو التوكنز دون قرار صريح.
- لا تحل ضيق الهاتف بقص البيانات أو hard-coding جديد عندما يوجد توكن أو عقد قائم.
- راجع RTL، النص الطويل، الأرقام، الحالات المفقودة والسالبة، الطبقات، التركيز والحركة المخفّضة.
- بعد كل إصلاح، شغّل الفحص الأقرب ثم مصفوفة المعرض، وسجّل ما لم يُختبر فعليًا.

## إعادة التشغيل

```bash
python3 tools/build-ui-system-showcase-standalone.py --check
python3 tools/ui-system-showcase-check.py
python3 tools/ui-system-showcase-repair-check.py --tag after
python3 tools/concepts-check.py
python3 tools/data-scale-state-check.py
python3 tools/ui-release-check.py
```

مخرجات الفحوص التفصيلية المولدة لا تُحفظ في الشجرة التشغيلية. الدليل المختصر الحالي في `reviews/UI-SYSTEM-SHOWCASE/`.
