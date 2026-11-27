# File Naming Rules

## القاعدة العامة للأصول

تستخدم أصول الإنتاج داخل `brand/` أسماء lowercase، وأرقامًا عند الحاجة، وواصلات `-` فقط. يمنع استخدام المسافات أو الأسماء المبهمة مثل `new` و`latest` و`final2` داخل أصول runtime.

## ممنوعات أسماء الأصول

لا تستخدم داخل ملفات الشعار أو الأيقونات `v2` أو `v3` أو `final` أو `latest` أو `new` أو `copy` أو `backup` أو `old`. الإصدار يُدار في manifest وملف الإصدار، وليس بإضافة أرقام إلى اسم الأصل.

## استثناء التوثيق والـQA

تُعد الملفات الموجودة تحت `docs/` و`audit/` و`meta/` وملفات manifests استثناءً رسميًا من قاعدة lowercase الصارمة، لأنها ملفات بشرية أو وصفية وليست أصول runtime. لذلك تعتبر الأسماء التالية صحيحة في هذا المستودع:

```text
README-DELTA.md
MERGE-MAP.md
FINAL-AUDIT.md
RELEASE-CHECKLIST.md
final-manifest.json
```

كلمة `FINAL` في `FINAL-AUDIT.md` تصف نوع التقرير، ولا تعني أن هناك نسخة شعار باسم final. لا يجوز نقل هذا الاستثناء إلى ملفات SVG أو PNG.

## بنية أسماء الأصول

```text
micro-{asset}-{language}-{variant}-{state}-{size}.{extension}
```

ليس مطلوبًا استخدام كل العناصر. يجب أن يبقى الاسم قصيرًا ومحددًا.

## بنية المجلدات

```text
brand/master/
brand/variants/
brand/png/
brand/platform-icons/
docs/
audit/
meta/
```

لا يوضع أصل مشتق داخل `master/`، ولا يوضع ملف اختبار داخل مجلد الإنتاج.

## مصدر الحقيقة

`brand/master/` يحتوي على المصدر الرئيسي. `brand/variants/` و`brand/png/` و`brand/platform-icons/` مشتقات منه. كل ملف مشتق يجب أن يكون موثقًا في manifest أو دليل الدمج، وليس عبر إضافة `v2` أو `copy` إلى الاسم.
