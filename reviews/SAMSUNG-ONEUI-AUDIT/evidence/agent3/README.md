# Evidence — Agent 3 (navigation/feedback audit)

- **Baseline:** commit `a5500c9` (tree `05f344b`), working tree clean except `reviews/`.
- **أداة القياس:** Playwright (sync API) + Chrome for Testing (`/home/z/my-project/evidence/bin/chromium`) عبر خادم `tools/preview-server.py` المحلي (منفذ 5000، بلا تعديل). صفر `pageerror` في كل الجلسات المسجلة.
- **لوحة مفاتيح حقيقية:** Tab/Shift+Tab/Enter/Space/Escape/Arrows عبر Playwright keyboard API.
- **آلية تكبير النص 200% (معلنة):** مضاعفة الخط المحسوب لكل عنصر عبر JS walk (مروران: قياس قبل/بعد) — محاكاة text zoom، **ليست** native zoom.
- **reduced-motion:** سياق Playwright مستقل `reduced_motion="reduce"` (قياس محسوب فعلي).
- مقاسات: 320/360/390/430 CSSpx (ارتفاع 800).

## الملفات

| ملف | ما يقيسه |
|---|---|
| `probe-n1-f03-toast-cals.py` + `n1-f03-toast-cals.json` | تأكيد CAL-R1-01 (toast 0×0 في مساري إضافة الطلب وحذف العنصر + منطقة الإعلان الحية) وتأكيد CAL-R1-02 (مفتاح `mystery` في مفتاح الكالندر) |
| `probe-n2-f03-layer-contracts.py` + `n2-f03-layer-contracts.json` | عقود الطبقات في F03: تركيز/Escape/استعادة/hسر Tab/inert/قفل التمرير، حارس المغادرة، لوحة الفلاتر (draft/applied)، طبقة الحساب، حوار الحذف (keep policy) |
| `probe-n3-nav-msg-components.py` + `n3-nav-msg-components.json` | لوحة navigation (appbar/تبويبات/سهم RTL/navbar/شريط إجراء) + لوحة messages (toast مرئي/توقيت/إغلاق يدوي/منطقة إعلان واحدة/dedup) + بوابة F03 (إرسال فارغ) + **قياس اصطناعي** موضع toast مقابل navbar + reduced-motion |
| `probe-n4-f03-widths-200pct.py` + `n4-f03-widths-200pct.json` | F03 عند 320/360/390/430 (navbar/appbar/foot) + مرورا 200% على وضع التحديد (تحقق مستقل من V1 للوكيل 1: تراكب 18px) + شريط الإجراء بعد التمرير للنهاية |
| `probe-n5-f03-taborder-foot-focusring.py` + `n5-...json` | ترتيب Tab في البوابة والرئيسية + حلقة focus-visible على navbar + خلوص التذييل بعد التمرير + مثال account-settings + مثال access-gateway |
| `probe-n6-filter-lifecycle-b06-example.py` + `n6-...json` | عينة filter-lifecycle (تطبيق/تصحيح/إلغاء/Escape) — **ملاحظة أداة:** قسم messages example-usage استهدف صفحة غير موجودة (404 — المكوّن بلا example-usage.html)؛ نتائجه غير صالحة، والمرجع هو لوحة previews/messages المقيسة في n3 |
| `probe-n7-f03-detail-note.py` + `n7-f03-detail-note.json` | حفظ عنصر → الملاحظة الثابتة الظاهرة (البديل الثابت لعقد B06) + تبديل aria-current + حالة busy — **ملاحظة تسمية:** المفتاح `fieldsStillEditable` في JSON يسجل فعليًا قيمة `readOnly` (true = الحقول مقفولة) |
| `probe-n7b-f03-rejected-save.py` + `n7b-...json` | الرفض المعلوم للحفظ → ملاحظة الخطأ الثابتة النهائية |
| `probe-n8-gateway-reveal-errors.py` + `n8-...json` | زر الإظهار (aria-pressed/label) + خطأ بريد غير صالح + busy + ما بعد الإرسال |

## اللقطات (الحالة المعنية ظاهرة في كل واحدة)

- `f03-360-order-save-toast-state.png` — بعد حفظ طلب: لا تأكيد مرئي (توثيق CAL-R1-01).
- `f03-360-schedule-legend-mystery.png` — مفتاح حالات الكالندر وفيه `mystery` (CAL-R1-02).
- `f03-360-item-save-detail-note-visible.png` — ملاحظة النجاح الثابتة بعد حفظ عنصر (KEEP).
- `f03-360-rejected-save-persistent-error-note.png` — ملاحظة الخطأ الثابتة بعد رفض الحفظ (KEEP).
- `f03-320-text200-selection-navbar-overlap.png` — وضع تحديد عند 200% نص: أسفل الشريط تحت navbar (تحقق V1).
