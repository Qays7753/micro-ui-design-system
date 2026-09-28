# معاينة الاختيار B03 — التشغيل والتعديل

## التشغيل — من جذر المستودع فقط

```bash
python3 -m http.server 8080
```
ثم `http://localhost:8080/previews/selection/`

## الملفات

| الملف | الدور |
|---|---|
| `index.html` | اللوحة: Checkbox/Radio/مجموعة جزئية/Switch/Toggle/Segmented/قائمة/منتقي/تاريخ |
| `board.css` | طبقة المنتقي المؤقتة فقط (تستكمل بطبقة B07) |
| `board.js` | محاكاة فقط: نص حالة المفتاح، الإعداد غير المتزامن (فشل/نجاح بعقد موثق)، حالات قراءة المنتقي |
| `../../components/selection/` | المكوّن: selection.css + selection.js + specification.md |
| `../board-base.css` + `../board.js` | مشتركة لفرع التوسعة (تنسيق عام + أيقونات + تكبير) |

## أين أعدّل؟

الملخص في `components/selection/specification.md` §5 — الألوان والمقاسات من `shared/tokens.css`، وبيانات القائمة من HTML المستهلك، والأيقونات من أصولها.

## إثبات التعديل

غيّر `--micro-choice-size` إلى 28px وحدّث الصفحة: كل الصناديق تكبر. أعد القيمة (24px) للنسخة المسلَّمة.
