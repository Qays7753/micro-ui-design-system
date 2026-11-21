# البدء — Micro UI

مكتبة Vanilla (بدون إطار) للهاتف العربي RTL، Light-only. المصدر القابل للاستهلاك: `components/` و`shared/` و`assets/`.

## التثبيت

حاليًا عبر git (ستضاف تفاصيل حزمة npm في [CHANGELOG.md](../CHANGELOG.md) عند جهوزيتها):

```bash
git clone https://github.com/Qays7753/micro-ui-design-system.git
```

## ترتيب التحميل الإلزامي

```html
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="shared/tokens.css">
<!-- الحركة عند الحاجة -->
<link rel="stylesheet" href="shared/motion.css">
<!-- ثم CSS العائلات المستهلكة، مثال: -->
<link rel="stylesheet" href="components/buttons/buttons.css">
<link rel="stylesheet" href="components/fields/fields.css">
<!-- ثم JS العائلات مرة واحدة -->
<script src="components/buttons/buttons.js"></script>
<script src="components/fields/fields.js"></script>
```

الخطوط IBM Plex محلية من `assets/fonts` — لا Google Fonts. الاعتماديات المشروطة لكل عائلة في [API.md](../docs/API.md) (بطاقات الاعتماد).

## مثال أدنى

```html
<button class="m-btn m-btn--primary" type="button">حفظ التغييرات</button>
<script>MicroButtons.setLoading(document.querySelector('.m-btn'), true, {loadingLabel: 'جارٍ الحفظ'});</script>
```

التهيئة تلقائية عند تحميل الوحدات؛ DOM المضاف ديناميكيًا يحتاج استدعاء `init` على جذره المحلي. العقود الكاملة لكل عائلة في [API.md](../docs/API.md).

## الفحص

```bash
uv sync
uv run python tools/check-all.py
```
