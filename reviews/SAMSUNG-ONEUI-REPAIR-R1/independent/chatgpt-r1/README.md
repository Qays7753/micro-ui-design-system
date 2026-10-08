# إعادة تحقق ChatGPT — Samsung repair R1

الرأس المفحوص eab02bbc42ef8067572d4caf85b417df9bb8e928؛ مصدر المنفذ fd7ef93 مطابق له في components/previews/shared/tools. لا تعديل على هذه المصادر. المتصفح Chromium 153.0.8010.0 وPlaywright 1.63.0، لا بيئة المنفذ 143. الأرقام قد تختلف قليلًا بحسب المحرك. التكبير نص ×2 بمرورين، وليس native zoom.

## إعادة التشغيل

من checkout للجولة، عيّن `MICRO_REVIEW_BROWSER` إلى Chromium صالح في بيئتك. يمكن تعيين `MICRO_REVIEW_ROOT` إلى checkout آخر. المخرجات الافتراضية تحت /tmp وليست داخل الأدلة التاريخية.

```bash
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/independent/chatgpt-r1/extra-probe.py
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/independent/chatgpt-r1/visual-probe.py
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/independent/chatgpt-r1/replay-existing.py
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/independent/chatgpt-r1/regression-replay.py f03
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/independent/chatgpt-r1/regression-replay.py concepts
```

`MICRO_REVIEW_OUT` يخصص إخراج visual-probe.py؛ مثال before-visual-results مولد من eacfe8a. شريط الحساب مقصوص في الرأس السابق والحالي، لذا هو عيب سابق غير مغلق لا انحدار جديد.

replay-existing يعيد سكربت قياسات Agent5 الموجود مع تبديل المتصفح والإخراج فقط؛ ليس تشغيل وكيل جديد. نتيجة الخروج وحدها لا تثبت صحة المعايير. regression-replay يكيف مسار المتصفح والخادم والإخراج دون تغيير أحكام الأدوات. f03=46/46، concepts=154/155؛ فشل الأخير توقع نص تاريخي، مع اختبار callback مستقل يكشف رسالة نجاح غير مضمونة فعلًا.

اللقطات الست قرئت بصريًا. القراءة الصوتية للقارئات وكل المنصات الفعلية NOT RUN. تقرير الأحكام: ../../CHATGPT-REVIEW-R1.md.
