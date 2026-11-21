# Micro UI Design System

مكتبة UI مستقلة لمشروع Micro: مكونات وتراكيب HTML/CSS/JS للهاتف العربي RTL، Light-only، Vanilla بدون إطار. لا مصادقة ولا شبكة ولا منطق أعمال — كل ذلك للتطبيق المضيف.

## الحالة

14 عائلة / 8 متغيرات / 13 تركيبًا (C01–C13)؛ الحالة والنضج والفجوات والمؤجلات في [docs/STATUS.md](docs/STATUS.md).

## تشغيل الفحوص

```bash
uv sync
uv run python tools/check-all.py
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
