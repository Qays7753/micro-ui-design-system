# معاينة الأزرار B01 — التشغيل والتعديل

المعاينة صفحة مستقلة HTML/CSS/JS (بلا إطار عمل) تعرض المكوّن الحقيقي من مصدره.

## التشغيل

من جذر المستودع:

```bash
python3 -m http.server 8080
```

ثم افتح: `http://localhost:8080/previews/buttons/`

أو من داخل مجلد `previews/buttons/`:

```bash
python3 -m http.server 8080
# ثم http://localhost:8080/
```

يعمل أيضًا بفتح `index.html` مباشرة من القرص (file://) لأن الأيقونات معرّفة داخل الصفحة؛ لكن التنزيل المحلي للخطوط يتطلب خادمًا في بعض المتصفحات، فالأمر أعلاه هو المرجع.

## الملفات

| الملف | الدور |
|---|---|
| `index.html` | لوحة المعاينة: أمثلة الأنواع والحالات والتفاعل وأمثلة الهاتف |
| `board.css` | تنسيق لوحة العرض فقط — لا يلمس `.m-btn` |
| `board.js` | أدوات فحص اللوحة (تكبير 200%) — لا يلمس سلوك المكوّن |
| `../../components/buttons/buttons.css` | شكل المكوّن (المصدر الوحيد للتصميم) |
| `../../components/buttons/buttons.js` | سلوك المكوّن: التحميل ومنع التكرار + عروض تجريبية موسومة |
| `../../shared/tokens.css` | القيم المشتركة (الألوان والمقاسات والحركة) |
| `../../assets/fonts/` | خطوط IBM Plex المحلية وترخيصها |
| `../../assets/icons/` | أصول HugeIcons Stroke Rounded وترخيصها |

## أين نعدّل ماذا

| أريد تغيير | المكان |
|---|---|
| **لون** (بترولي، خطأ، مشمشي…) | `shared/tokens.css` — مثل `--micro-brand-primary` أو `--micro-danger`؛ الانعكاس فوري على كل الأنواع والحالات |
| **لون تدرج الزر الأساسي أو تحويله مصمتًا** | `shared/tokens.css` — `--micro-button-primary-bg` (استبدل التدرج بلون واحد) |
| **مقاس** (ارتفاع الزر، الحشو، هدف اللمس، مقاس الأيقونة) | `shared/tokens.css` — `--micro-button-min-height`، `--micro-button-padding-inline`، `--micro-icon-button-size`، `--micro-icon-in-button` |
| **انحناء** (كبسولة، دائرة) | `shared/tokens.css` — `--micro-radius-capsule` / `--micro-radius-circle` |
| **الخط** | `shared/tokens.css` — `--micro-font-family` + ملفات `assets/fonts/` وتعريفات `assets/fonts/fonts.css` |
| **نص زر** | `previews/buttons/index.html` — النص داخل `<button>` مباشرة |
| **أيقونة** | `previews/buttons/index.html` — بدّل `<use href="#i-…">` أو عدّل `<symbol>` في أعلى الملف؛ الأصل المستقل في `assets/icons/*.svg` |
| **حالة ثابتة** (للمقارنة) | أضف صنفًا للزر: `is-pressed` / `is-focus` / `is-loading` أو السمة `disabled` |
| **حالة تفاعلية** | لا صنف إضافي — `:active` و`:focus-visible` و`aria-busy` مغطاة في `buttons.css` و`buttons.js` |
| **زمن الحركة** | `shared/tokens.css` — `--micro-motion-press` إلخ |
| **رسالة الاكتمال التجريبية** | `index.html` داخل `[data-demo-group]` — نص `[data-demo-message]` |

## قاعدة ذهبية

لا تضيف ألوانًا أو مقاسات جديدة داخل `buttons.css` — أي قيمة جديدة تُعرّف أولًا في `shared/tokens.css` ثم تُستهلك. هذا يبقى المكوّن واحدًا في كل الأمثلة.
