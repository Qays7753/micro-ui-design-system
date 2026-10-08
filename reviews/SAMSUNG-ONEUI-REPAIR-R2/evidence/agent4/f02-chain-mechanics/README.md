# تجربة آلية وسائط سلسلة رجعية F02-32 — الوكيل 4 (SUI-R2-A4)

**هذه تجربة أسماء وسائط وميكانيكا مجلدات فقط — ليست أدلة رجعية رسمية.**
شُغلت على شجرة عملي المعدلة (66bc1a8 + تعديلاتي)، ويسجل b03 ذلك بصدق في
ترويسته («شجرة عمل معدلة (9 مدخلًا في git status)»). السلسلة الرسمية
يتعين أن تنفذ من checkout نظيف للمصدر النثبت النهائي (القائد) — انظر
الأوامر الموثقة في تقرير الوكيل 4.

ما تأكد بالتجربة أو بقراءة رؤوس الأدوات (وسائطها الفعلية):

| الأداة | وسيط الإخراج الفعلي | ملاحظات |
|---|---|---|
| b03-screenshots.py | `--out <dir>` (الافتراضي reviews/B03) | تجربة: 25/25 — يكتب `<dir>/verification.txt` + `<dir>/screenshots/` بترويسة commit/شجرة مطابقة لمتطلب F02-32 (بعد إعادة تسمية الملف إلى b03-verification.txt) |
| b07-screenshots.py | **لا وسيط إخراج** (بقراءة المصدر: بلا argparse/sys.argv) | يكتب reviews/B07/screenshots + verification.txt ثابتة — تشغيله يعدّل ملفًا متعقبًا؛ يلزم نقل المخرجات ثم `git restore reviews/B07` |
| ux-f01-check.py | `--round <name>` (الافتراضي: أدلة reviews/UX-F01 الأصلية) | يكتب reviews/UX-F01/round-<name>/{verification.json,verification.txt,screenshots/} — meta.source_commit من git rev-parse HEAD |
| ux-f02-check.py | `--root <path>` و`--round <name>` | يقرأ reviews/UX-F02/round-<round>/regression/b03-verification.txt (25) وb07-verification.txt (28) وf01-regression/verification.json (20 صفًا) |

مخرجات التجربة: b03-experiment/ (سجل + لقطات) — شغّلت `b03` فقط لأني
أملك وسيلة إخراج آمنة؛ b07 بلا وسيط إخراج كان سيكتب فوق reviews/B07
التاريخية (ممنوع)، وf01/f02 أدوات جولة رسمية مكانها checkout نظيف.
