# Delta v2 Merge Map

## قاعدة الدمج

هذه الحزمة إضافة فقط. لا تحذف ولا تعيد رفع ملفات الحزمة الأصلية. أضف محتويات `added/` إلى جذر مستودع الهوية، ثم راجع `meta/final-manifest.json`.

## Full Color canonical paths

يحتوي الملحق الآن على النسخ الثلاث في مساراتها النهائية:

```text
added/brand/variants/full-color/micro-symbol.svg
added/brand/variants/full-color/micro-lockup-arabic.svg
added/brand/variants/full-color/micro-lockup-english.svg
```

هي aliases canonical للنسخ الثابتة المعتمدة في الحزمة الأصلية، وليست تصاميم جديدة. لا تنشئ نسخة Full Color ثالثة باسم مختلف.

## Color variants

أضف هذه المجلدات كما هي:

```text
added/brand/variants/full-color/
added/brand/variants/monochrome-black/
added/brand/variants/monochrome-petrol/
added/brand/variants/monochrome-white/
added/brand/variants/reversed-dark/
```

## Android resource tree

انسخ محتويات هذا المسار مباشرة إلى مجلد Android resources:

```text
added/brand/platform-icons/android/res/
→ app/src/main/res/
```

بعد النسخ ستكون الملفات في:

```text
app/src/main/res/drawable-nodpi/micro_adaptive_foreground.png
app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
app/src/main/res/values/colors.xml
```

أما ملفات المصدر القابلة للمراجعة فتبقى في:

```text
added/brand/platform-icons/android/source/
```

## Manifests and previews

جميع المسارات داخل manifests موجهة إلى الأسماء الفعلية ذات prefixes الموجودة داخل المستودع canonical. لا توجد إحالات إلى HTML previews؛ المعاينات المسلّمة PNG فقط.

## الطباعة

لا توجد PDF أو EPS أو CMYK داخل هذا الملحق. حالة الطباعة `deferred` ومذكورة صراحةً في التوثيق والـmanifests.

## لا تفعل

لا تغيّر الهندسة، لا تغيّر الألوان، لا تنقل التراكوتا، لا تعكس الرمز، ولا تستبدل ملفات الحركة أو حالات النظام القديمة ضمن هذه الإضافة.
