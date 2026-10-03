# حزمة المصدر الكاملة

كل المصادر والوثائق والأصول والأدلة موجودة في main. حزمة ZIP الكاملة محفوظة على أجزاء لأجل حد الرفع، دون حذف أي ملف من الحزمة.

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
