# حزمة المصدر الكاملة

حزمة إقفال UI المثبتة عند main `ce3d2c8` محفوظة على أجزاء لأجل حد الرفع، دون حذف أي ملف من ذلك الإصدار. إضافات UX-F00 اللاحقة موجودة في مصادر main الحية ولا تدخل هذه اللقطة؛ اقرأ docs/ux/README.md. تغيير وثائق UX لا يعيد نشر إصدار UI أو يمنحه فحوصًا جديدة.

من جذر نسخة المستودع:

```bash
python3 tools/assemble-components-package.py
```

ينتج micro-components-editable.zip في هذا المجلد بعد تحقق SHA256 للأجزاء والملف الكامل، ثم CRC. لا تفتح الأجزاء منفردة على أنهاZIP. package-parts.json يحدد ترتيبها وأحجامها وبصماتها.

لإعادة الإنتاج بعد تحديث المصادر:

```bash
python3 tools/manifest-build.py
python3 tools/build-components-package.py
python3 tools/split-components-package.py
```
