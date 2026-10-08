# SAMSUNG-ONEUI-REPAIR-R1 — جولة إصلاح وتطوير مكتبة Micro UI

**الحالة: DRAFT FOR REVIEW — بانتظار مراجعة المالك. لا اعتماد ذاتي، لا نشر، لا تركيب على النظام الإنتاجي.**

## ما هذه الجولة

تنفيذ فعلي (إصلاح + تطوير) على المصادر القابلة للتعديل بعد جولة التدقيق `reviews/SAMSUNG-ONEUI-AUDIT/` ومراجعتها المستقلة `CHATGPT-REVIEW-R1.md` (تصحيحاتها مقدَّمة عند التعارض). التنفيذ بخمسة وكلاء فعليين: أربعة منفّذين بمجالات وملكيات منفصلة (A1 أسس/جودة بصرية، A2 حقول/اختيار، A3 تنقل/تفاعل/رسائل/F03، A4 بيانات/عرض/جدولة) + مراجع مستقل (A5) لا يكتب إصلاحًا يراجعه، والقائد يدمج ويبني standalone ويولّد الأدلة الرسمية ويدفع.

## المحتويات

| الملف | الدور |
|---|---|
| [REPORT.md](REPORT.md) | التقرير النهائي للجولة (الأحكام والأرقام والقيود) |
| [MATRIX.md](MATRIX.md) | مصفوفة التنفيذ: بنود SUI-001..032 بحالاتها + توزيع العائلات الـ14 + النتائج النهائية |
| [PROTOCOL.md](PROTOCOL.md) | بروتوكول الوكلاء (الملكية، القياس قبل/بعد، الصادقية) |
| [COVERAGE-REPAIR.csv](COVERAGE-REPAIR.csv) | تغطية الجولة للعائلات والحالات المتأثرة (صادقة: REVIEWED/NOT RUN) |
| `agents/` | تقارير الوكلاء الخمسة + مدخلات سجل عملهم |
| `evidence/` | أدلة قابلة لإعادة التشغيل: `agent1..agent5` (قبل/بعد JSON + لقطات الحالات المفصلية + README لكل وكيل) و`leader/` (تحقق القائد + التشغيل الرسمي) و`official-run/` (الأدلة الرسمية من checkout نظيف للمصدر المثبت) |

## كيف أعيد التشغيل

```bash
# من جذر المستودع (المصدر المثبت لهذه الجولة):
python3 tools/sui-repair-a1-check.py --stage after   # A1: 31/32 (فشل واحد مقصود لبند خارج ملكيته)
python3 tools/sui-repair-a2-check.py --tag after     # A2: 67/67
python3 tools/sui-repair-a3-check.py --phase after   # A3: 57/57
python3 tools/sui-repair-a4-check.py --stage after   # A4: 34/34
python3 tools/ux-f03-check.py --out <مجلد>           # 46/46 (207)
python3 tools/order-schedule-check.py --out <مجلد>   # 16/16 (267)
node tools/repair-regression.cjs                     # 301/301
python3 tools/ui-repair-r2-check.py                  # 130/130
python3 tools/ui-repair-r1-check.py                  # 54/54
```

> سلسلة لقطات إعادة تشغيل أدوات الرجعية قُلّم من مجلدات أدلة الوكلاء (الأرقام كاملة في JSON/TXT المحفوظة؛ لقطات الحالات المفصلية قبل/بعد محفوظة). الأدلة الرسمية في `evidence/official-run/` وُلدت من worktree نظيف للـcommit المثبت.
