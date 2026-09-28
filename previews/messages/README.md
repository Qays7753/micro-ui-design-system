# معاينة الرسائل والحالات B06 — التشغيل والتعديل

## التشغيل — من جذر المستودع فقط
```bash
python3 -m http.server 8080
```
ثم `http://localhost:8080/previews/messages/`

## أين أعدّل؟
الألوان من `shared/tokens.css`، النصوص من HTML، مدة العابرة من خيارات المستدعي، الأيقونات من أصولها. الجدول الكامل في `components/messages/specification.md` §2.

## إثبات التعديل
غيّر `--micro-info-surface` إلى `#EDF4FB` وحدّث الصفحة: رسائل المعلومة تتغير. أعد `#E9F1FA`.
