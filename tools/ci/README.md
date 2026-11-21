# CI — التركيب من المالك

الملف `ci.yml` هنا محفوظ حرفيًا ولا يعمل من هذا الموضع (توكن الرفع الحالي بلا نطاق
`workflow` — قرار المرحلة 4). التركيب مرة واحدة من المالك:

```bash
git mv tools/ci/ci.yml .github/workflows/ci.yml
git commit -m "ci: enable workflow (round 2 R7)"
git push
```

يتطلب توكن رفع بنطاق `workflow` (Settings → Developer settings → Personal access
tokens). بعد التركيب يعمل السير تلقائيًا على كل push وpull_request: checkout كامل
بالوسوم، Node 20 + npm ci، uv sync، تثبيت Chromium، `check-all` كاملة (بما فيها
البوابة البصرية مقابل v0.1.0 من وسوم git)، ثم `typecheck`، ورفع مخرجات الفحص
كـartifact عند الفشل. كل الأوامر تعمل محليًا بنفس الترتيب (وهذا ما تشغله
`tools/check-all.py` على نسخة نظيفة في R9).
