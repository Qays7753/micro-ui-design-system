# Micro UI Design System

مكتبة UI مستقلة لمشروع Micro: مكونات وتراكيب HTML/CSS/JS للهاتف العربي RTL، Light-only، Vanilla بدون إطار. لا مصادقة ولا شبكة ولا منطق أعمال — كل ذلك للتطبيق المضيف.

## الحالة

إصدار `0.2.0` على فرع الربط: المصدر ES modules، مدخل لكل عائلة (21)، أنواع TypeScript، دورة حياة موحدة (`init`/`update`/`destroy` لكل مدخل)، ونصوص بمفاتيح دلالية قابلة للتخصيص لكل نسخة. التفاصيل في [docs/STATUS.md](docs/STATUS.md) و[CHANGELOG.md](CHANGELOG.md).

## تشغيل الفحوص

```bash
npm ci
uv sync
uv run python tools/check-all.py   # 26 بوابة، تشمل البصرية مقابل v0.1.0
npm run typecheck
```

## تشغيل المعرض

```bash
python3 tools/preview-server.py
# ثم http://localhost:5000/previews/ui-system-showcase/index.html
```

أو افتح `previews/ui-system-showcase/standalone.html` مباشرة (ملف مولد لا يُعدَّل يدويًا).

## الوثائق

- [البدء](docs/GETTING-STARTED.md) · [الحالة](docs/STATUS.md) · [عقود النظام](docs/SYSTEM-CONTRACTS.md)
- [API والاستهلاك](docs/API.md) · [التراكيب](docs/COMPOSITIONS.md) · [أسس التصميم](docs/DESIGN-FOUNDATIONS.md)
- [الاختبار](docs/TESTING.md) · [التسليم](docs/HANDOFF.md) · [القرارات](docs/DECISIONS.md)
- [الكتالوج](docs/COMPONENT-CATALOG.json) (مصدر النضج) · [عقد العمل](AGENTS.md) · [الهوية والحدود](DESIGN.md)
