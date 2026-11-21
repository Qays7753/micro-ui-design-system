# سير عمل CI — نسخة جاهزة للتركيب

ملف `ci.yml` هنا هو سير عمل GitHub Actions المعتمد للمرحلتين 4 و5 (تشغيل كل
البوابات — ومنها بوابة الحزمة `package` — على
`feature/integration-readiness-2026-11-21` عند كل push/pull_request).

## لماذا ليس في `.github/workflows/`؟

التوكن المستخدم للرفع في هذه الجولة لا يملك نطاق `workflow`، ويرفض GitHub أي
دفع يعدّل ملفات workflows بدونه. القرار مسجل في `docs/DECISIONS.md`.

## التركيب (لمالك المستودع، مرة واحدة)

```bash
mkdir -p .github/workflows
cp tools/ci/ci.yml .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: add gates workflow"
git push
```

بعد ذلك يعمل CI تلقائيًا على كل دفعة للفرع. البديل المؤقت المحلي:
`uv sync && uv run python tools/check-all.py --skip-visual`.
