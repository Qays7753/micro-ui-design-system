# معاينة التنظيم والمعلومات B04 — التشغيل والتعديل

## التشغيل — من جذر المستودع فقط

```bash
python3 -m http.server 8080
```
ثم `http://localhost:8080/previews/organization/`

## الملفات

| الملف | الدور |
|---|---|
| `index.html` | اللوحة: عنوان/وصف/فاصل/مجموعة، صفوف (قراءة/فتح/إجراء)، طي، شارات/عدّادات/هوية، تركيب صعب |
| `board.css` | مسافات عرض فقط — لا يلمس المكوّن |
| `../../components/organization/` | المكوّن: organization.css + organization.js (طي + بديل الصورة) + specification.md |
| `../board-base.css` + `../board.js` | مشتركة لفرع التوسعة |

## أين أعدّل؟

الملخص في `components/organization/specification.md` — ارتفاع الصف والبلاط من `shared/tokens.css` (`--micro-row-*`)، النصوص من HTML، الأيقونات من أصولها.

## إثبات التعديل

غيّر `--micro-row-min-height` إلى 84px وحدّث الصفحة: كل الصفوف ترتفع. أعد 72px.
