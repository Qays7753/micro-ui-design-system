# Release Checklist — Micro Ecosystem Delta v2

## الأصول والمسارات

- [x] Master SVG للرمز والـlockups موجود.
- [x] Full Color canonical paths موجودة.
- [x] النسخ Black وWhite وPetrol وReversed Dark موجودة.
- [x] PNG شفاف بالمقاسات الموثقة موجود.
- [x] Favicon وPWA وMaskable وApple موجودة.
- [x] Android `res/drawable-nodpi` موجود.
- [x] Android `res/mipmap-anydpi-v26` موجود.
- [x] Android `res/values` موجود.

## التدقيق

- [x] Option 02 هو المفهوم الوحيد.
- [x] Geometry: Outside R36 · C8 · G12.
- [x] الألوان لم تتغير.
- [x] لا توجد v2 أو v3 أو ideaA أو ideaB كأصول إنتاجية.
- [x] manifests تشير إلى أسماء ملفات فعلية.
- [x] لا توجد HTML preview references غير مسلّمة.
- [x] قواعد التسمية تشرح استثناءات docs وaudit وmeta.

## النطاق

- [x] الويب والتطبيق وPWA وApple وAndroid مشمولة.
- [x] الطباعة `deferred` ومذكورة صراحةً.
- [ ] PDF/EPS/CMYK — مرحلة لاحقة، ليست شرطًا لهذا الإصدار.

## قبل الدمج

- [ ] إضافة محتويات `added/` إلى مستودع الهوية.
- [ ] نسخ `android/res/` إلى `app/src/main/res/`.
- [ ] اختبار الخلفيات الفاتحة والداكنة.
- [ ] اختبار الرمز عند 16 و20 و24 و32px.
- [ ] اختبار الـlockup عند 144 و180px.
- [ ] مراجعة RTL وLTR في السياق الفعلي.
- [ ] Git commit أو رفع خارجي — ينفذ فقط بتفويض مستقل.
